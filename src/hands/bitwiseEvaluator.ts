/* Significantly based on https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math */
/* but written with variable names to be more readable. */

type u16 = number;
type float = number;
interface HandAnalysis {
  handRank: number;
  english: string;
  btRanks: number;
  btCount: number;
}
enum HandRank {
  highCard = 0,
  pair = 1,
  twoPair = 2,
  trips = 3,
  straight = 4,
  flush = 5,
  fullHouse = 6,
  quads = 7,
  straightFlush = 8,
  royalFlush = 9,
}
export const Rank: Record<string, number> = {
  A: 14, // in binary: 0100 0000 0000 0000
  K: 13, // 0100 0000 0000 0000
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};
export const Suit: Record<string, number> = {
  s: 1,
  c: 2,
  h: 4,
  d: 8,
};
const WHEEL_HASH = 0x403c; // 0100 0000 0011 1100
const BROADWAY_HASH = 0x7c00; // 0111 1100 0000 0000

export const parseHandFromString = (
  handNotation: string
): [number[], number[]] => {
  const cards = handNotation.trim().split(" ");
  const ranks = cards.map((c) => Rank[c.charAt(0)]);
  const suits = cards.map((c) => Suit[c.charAt(1).toLowerCase()]);
  return [ranks, suits];
};

/**
 * The purpose of this is to record a 1 bit for each rank – duplicates are lost.
 */
export const countRanksBitwise = (handRanks: number[]): u16 => {
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
export const countDuplicatesBitwise = (handRanks: number[]): float => {
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
      offset = Math.pow(2, handRanks[i] * 4) // maybe we should refactor this somehow, don't like it here inside the for loop.
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

const POKER_HASH: Record<number | string, [string, HandRank]> = {
  RF: ["Royal Flush", HandRank.royalFlush],
  SF: ["Straight Flush", HandRank.straightFlush],
  1: ["Four of a Kind", HandRank.quads],
  10: ["Full House", HandRank.fullHouse],
  F: ["Flush", HandRank.flush],
  S: ["Straight", HandRank.straight],
  9: ["Three of a Kind", HandRank.trips],
  7: ["Two Pair", HandRank.twoPair],
  6: ["Pair", HandRank.pair],
  HC: ["High Card", HandRank.highCard],
};

export const rankPokerHand = (
  ranks: number[],
  suits: number[]
): HandAnalysis => {
  const btRanks = countRanksBitwise(ranks);
  const btCount = countDuplicatesBitwise(ranks) % 15;
  if (btCount !== 5) {
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
    return {
      handRank: POKER_HASH.RF[1],
      english: POKER_HASH.RF[0],
      btRanks,
      btCount,
    };
  }
  if (isStraight && isFlush) {
    return {
      handRank: POKER_HASH.SF[1],
      english: POKER_HASH.SF[0],
      btRanks,
      btCount,
    };
  }
  if (isFlush) {
    return {
      handRank: POKER_HASH.F[1],
      english: POKER_HASH.F[0],
      btRanks,
      btCount,
    };
  }
  if (isStraight) {
    return {
      handRank: POKER_HASH.S[1],
      english: POKER_HASH.S[0],
      btRanks,
      btCount,
    };
  }
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

const simplifyComplexHands = (
  handRank: HandRank,
  ranks: number[]
): number[] => {
  ranks.sort((a, b) => a - b); // some hands can only be determined by sorting first.
  if (handRank === HandRank.quads) {
    const quadVal = ranks[2]; // logically, arr 1, 2, 3 must be 3 of the 4.
    const kickerVal = ranks[0] !== quadVal ? ranks[0] : ranks[4]; // the kicker is either card 1 or card 5.
    return [quadVal, kickerVal];
  }

  if (handRank === HandRank.fullHouse) {
    const trips = ranks[2]; // logically, the 3rd card must be in the trips.
    const pair = ranks[3] === trips ? ranks[1] : ranks[3];
    return [trips, pair];
  }

  if (handRank === HandRank.trips) {
    const trips = ranks[2]; // logically, the 3rd card must be in the trips.
    const kickers = ranks.filter((rank) => rank !== trips);
    return [trips, ...kickers];
  }
  if (handRank === HandRank.twoPair) {
    const highPair = ranks[1]; // logically, the higher pair must be either (1, 2) or (2, 3);
    const lowPair = ranks[3]; // logically, the lower pair must be either (3, 4) or (4, 5);
    const kicker = ranks.find((r) => r !== highPair && r !== lowPair) as number;
    return [highPair, lowPair, kicker];
  }

  if (handRank === HandRank.pair) {
    const pairFinder = (sortedRanks: number[]) => {
      // since the values are sorted, the pairs should be together.
      for (let i = 1; i < 5; i++) {
        if (sortedRanks[i - 1] === sortedRanks[i]) {
          return sortedRanks[i];
        }
      }
      throw new Error(
        `Hand ranks ${ranks} was sent to simplifyPair but does not contain a pair`
      );
    };
    const pair = pairFinder(ranks);
    const kickers = ranks.filter((rank) => rank !== pair);
    return [pair, ...kickers] as number[];
  }
  throw new Error(`Cannot simplify HandRank type ${handRank}`);
};

export const compareHands = (handA: string, handB: string): number => {
  /**
   * Returns positive number if hand A is stronger, negative number if hand B is stronger.
   * Returns 0 on a tie.
   */
  const [aRanks, aSuits] = parseHandFromString(handA);
  const [bRanks, bSuits] = parseHandFromString(handB);
  const a = rankPokerHand(aRanks, aSuits);
  const b = rankPokerHand(bRanks, bSuits);
  // easy if the hand ranks don't match.
  if (a.handRank !== b.handRank) {
    return a.handRank - b.handRank;
  }
  // all rfs tie each other.
  if (a.handRank === HandRank.royalFlush) {
    return 0;
  }
  // flushes and high cards will always have a higher bitwise value if they win.
  if (a.handRank === HandRank.flush || a.handRank === HandRank.highCard) {
    return a.btRanks - b.btRanks;
  }
  // so will MOST straight flushes & straights, except wheels/steel wheels.
  if (
    a.handRank === HandRank.straightFlush ||
    a.handRank === HandRank.straight
  ) {
    // Wheels are a special case where the bitwise rank of the ace throws
    // everything off and need to be checked seperately.
    if (a.btRanks === WHEEL_HASH && b.btRanks === WHEEL_HASH) {
      return 0;
    }
    if (a.btRanks === WHEEL_HASH) {
      return -1;
    }
    if (b.btRanks === WHEEL_HASH) {
      return 1;
    }
    return a.btRanks - b.btRanks;
  }

  const simpleA = simplifyComplexHands(a.handRank, aRanks);
  const simpleB = simplifyComplexHands(b.handRank, bRanks);
  // we can't compare full houses, quads, etc. by hash, because hands such as "JJJAA" have a
  // higher hash value than "KKKQQ". Unless someone can think of something clever...
  for (let i = 0, l = simpleA.length; i < l; i++) {
    const valueArray = simpleA[i] - simpleB[i];
    if (valueArray !== 0) {
      return valueArray;
    }
  }
  return 0;
};
