/* Significantly based on https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math */
/* but written with variable names to be more readable. */
import { float, u16, HandRank, HandAnalysis, PairUps } from "../types";
import {
  WHEEL_HASH,
  BROADWAY_HASH,
  POKER_HASH,
  Rank,
  Suit,
  PAIR_TYPES,
} from "../constants";
import parseHandFromString from "../parseHandFromString";

// used mainly for debugging/testing
export const displayBits = (bits = 16) => (x: number): string =>
  x
    .toString(2)
    .split("")
    .join("")
    .padStart(bits, "0")
    .replace(/(\d{4})/g, "$1 ")
    .replace(/(^\s+|\s+$)/, "");

/**
 * The purpose of this is to record a 1 bit for each rank – duplicates are lost.
 * It is mainly used to detect if there is a straight in the hand.
 */
export const mapRanksToBits = (handRanks: number[]): u16 => {
  let bitValue: u16 = 0;
  for (let card = 0; card < 5; card++) {
    const cardValue: u16 = 1 << handRanks[card];
    bitValue = bitValue | cardValue;
  }
  return bitValue;
};
/**
 * Okay - this is where JS gets freaky. Javascript uses only 32 bit integers,
 * but 64 bits to store floats.  Of them, 1 (Most significant bit) is used
 * to store the sign, 11 are used to store exponentiation, and that leaves
 * exactly 52 bits left...
 * Now, the problem is that you can't use bitwise operators on floats in JS.
 * Doing so would immediately convert it to an integer.
 * You CAN however, use normal math including % and Math.pow()
 *
 * So it's possible to set a nibble for each of the 13 ranks...
 * and assign a bit for each time one occurs.  Kings full of jacks, for example,
 * can be represented as the number 123351460741120, or
 * 0000 0111 0000 0011 0000 0000 0000 0000 0000 0000 0000 0000 0000
 *   A    K    Q    J    T    9    8    7    6    5    4    3    2
 * to so so, we set an "offset" to the nibble of the rank,
 */
export const countDuplicates = (handRanks: number[]): float => {
  let offset: float = 0;
  let value: float = 0;
  /*  A note on this for-loop. 
      offest will be 0 during the i === 0 phase. The left side then evaluates as
      value = 0 * (NaN & 15) + 1;
      but all NaNs are converted to 0 before any bitwise operation in JS ES5. -- According to the ES5 spec:
      // https://es5.github.io/
  */
  for (
    let i = -1, l = handRanks.length;
    i < l;
    i++,
      // offsets for the correct rank. Equal to 1 << handRanks[i]*4, but we can't use bitwise operators on floats.
      offset = Math.pow(2, handRanks[i] * 4)
  ) {
    // though value is a float, it's bits can still be manipulated via addition.
    // (value/offset) bit shifts the desired nibble to the least significant bits (LSBs)
    // & 15 (or (0xF)) "masks" the other bits so that they're not affected,
    value += offset * (((value / offset) & 15) + 1);
  }
  return value;
};

/**
 * (btCount % 15) sums all the nibbles in the btCount.
 * regardless of *which* cards you have, the operation returns the *same* value based on the
 * unique count of card ranks.
 * high card is 0001 + 0001 + 0001 + 0001 + 0001 (+ 7x0000) = 5;
 * one pair will always be 0011 + 0001 + 0001 + 0001 = 6
 * two pair will always be 0011 + 0011 + 0001 = 7
 * three of a kind will always be 0111 + 0001 + 0001 = 9,
 * a full house will be 0111 + 0011 = 10,
 * and four of a kind will be 1111 + 0001 = 16... but modulo 15, that becomes a 1.
 * lets ignore straights and flushes for now.
 * what's really cool about this is that with a little tweaking, this will also work with 7-card hands.
 */
export const rankPokerHand = (
  ranks: number[],
  suits: number[]
): HandAnalysis => {
  const btRanks = mapRanksToBits(ranks);
  const btCount = countDuplicates(ranks) % 15;
  if (btCount !== 5) {
    // one pair, two pair, three of a kind, full house, four of a kind
    return {
      handRank: POKER_HASH[btCount][1],
      english: POKER_HASH[btCount][0],
      btRanks,
      btCount,
    };
  }
  // if btCount === 5, there are no duplicates, so it's either a high card, straight, flush, or straight flush.
  const isStraight =
    btRanks / (btRanks & -btRanks) == 31 || btRanks === WHEEL_HASH; // checks if there are 5 consecutive 1s
  const isFlush = suits[0] === (suits[1] | suits[2] | suits[3] | suits[4]); // are all the same.
  if (isFlush && btRanks === BROADWAY_HASH) {
    // royal flush
    return {
      handRank: POKER_HASH.RF[1],
      english: POKER_HASH.RF[0],
      btRanks,
      btCount,
    };
  }
  if (isStraight && isFlush) {
    // straight flush
    return {
      handRank: POKER_HASH.SF[1],
      english: POKER_HASH.SF[0],
      btRanks,
      btCount,
    };
  }
  if (isFlush) {
    // flush
    return {
      handRank: POKER_HASH.F[1],
      english: POKER_HASH.F[0],
      btRanks,
      btCount,
    };
  }
  if (isStraight) {
    // straight
    return {
      handRank: POKER_HASH.S[1],
      english: POKER_HASH.S[0],
      btRanks,
      btCount,
    };
  }
  // high card
  return {
    handRank: POKER_HASH.HC[1],
    english: POKER_HASH.HC[0],
    btRanks,
    btCount,
  };
};

/**
 * returns a positive value if A is higher, a negative value if B is higher,
 * and zero if they are the same.
 */

export const analyzeKickers = (handRanks: number[]): PairUps => {
  const workspace: PairUps = { quads: [], trips: [], pairs: [], kickers: [] };
  handRanks.sort((a, b) => b - a); //descending order
  const queue = { rank: handRanks[0], count: 1 };
  for (let rank of handRanks.slice(1)) {
    if (queue.rank === rank) {
      queue.count += 1;
    } else {
      workspace[PAIR_TYPES[queue.count - 1]].push(queue.rank);
      queue.rank = rank;
      queue.count = 1;
    }
  }
  workspace[PAIR_TYPES[queue.count - 1]].push(queue.rank);
  return workspace;
};

const makeCorrectArray: Record<string, (x: PairUps) => number[]> = {
  quads: (x: PairUps) => x.quads.concat(x.kickers),
  boat: (x: PairUps) => x.trips.concat(x.pairs),
  trips: (x: PairUps) => x.trips.concat(x.kickers),
  pair: (x: PairUps) => x.pairs.concat(x.kickers),
};

// positive = a bigger, negative = b bigger, 0 = the same;
export const compareArrays = (a: number[], b: number[]): number => {
  for (let i = 0, l = a.length; i < l; i++) {
    const check = a[i] - b[i];
    if (check !== 0) {
      return check;
    }
  }
  return 0;
};

export const compareHands = (handA: string, handB: string): number => {
  const [aRanks, aSuits] = parseHandFromString(handA);
  const [bRanks, bSuits] = parseHandFromString(handB);
  const a = rankPokerHand(aRanks, aSuits);
  const b = rankPokerHand(bRanks, bSuits);
  // easy if the hand ranks don't match.
  if (a.handRank !== b.handRank) {
    return a.handRank - b.handRank;
  }
  // fallthrough deliberate;
  switch (a.handRank) {
    case HandRank.royalFlush:
      return 0;
    case HandRank.straightFlush:
    case HandRank.straight:
      // check for wheels, steel wheels, otherwise fallthrough
      if (a.btRanks === WHEEL_HASH && b.btRanks === WHEEL_HASH) {
        return 0;
      }
      if (a.btRanks === WHEEL_HASH) {
        return -1;
      }
      if (b.btRanks === WHEEL_HASH) {
        return 1;
      }
    // fallthrough deliberate;
    case HandRank.flush:
    case HandRank.highCard:
      return a.btRanks - b.btRanks;
  }

  const pairUpsA: PairUps = analyzeKickers(aRanks);
  const pairUpsB: PairUps = analyzeKickers(bRanks);
  switch (a.handRank) {
    case HandRank.quads:
      return compareArrays(
        makeCorrectArray.quads(pairUpsA),
        makeCorrectArray.quads(pairUpsB)
      );
    case HandRank.fullHouse:
      return compareArrays(
        makeCorrectArray.boat(pairUpsA),
        makeCorrectArray.boat(pairUpsB)
      );
    case HandRank.trips:
      return compareArrays(
        makeCorrectArray.trips(pairUpsA),
        makeCorrectArray.trips(pairUpsB)
      );
    default:
      // two pair, one pair
      return compareArrays(
        makeCorrectArray.pair(pairUpsA),
        makeCorrectArray.pair(pairUpsB)
      );
  }
};

export default compareHands;
