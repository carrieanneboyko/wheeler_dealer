type u16 = number;
type float = number;

// the array's index value matches to some bitwise math, this is why these hand rankings
// are not in order of value. see below.
/* Significantly based on https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math */
/* but written with actual variable names instead of incomprehensible gibberish. */

const Rank: Record<string, number> = {
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
const Suit: Record<string, number> = {
  s: 1,
  c: 2,
  h: 4,
  d: 8,
};

export const parseHandFromString = (
  handNotation: string
): [number[], number[]] => {
  const cards = handNotation.split(" ");
  const ranks = cards.map((c) => Rank[c.charAt(0)]);
  const suits = cards.map((c) => Suit[c.charAt(1).toLowerCase()]);
  return [ranks, suits];
};

// Bitwise operators
/* 
  << : Zero fill left shift -- Shifts left by pushing zeros in from the right and let the leftmost bits fall off
    // Effectively, 1 << x === Math.pow(2, x), in base 10, but what it's doing is converting the value of 
    // the card to 16-bit binary. 
    // so an ace (value 14) would be: 0100 0000 0000 0000, (15th bit is true) a 9 would be 0000 0010 0000 0000; (10th bit is true)

  |	: Bitwise OR -- Sets each bit to 1 if one of two bits is 1
*/

/**
 * Calculates the Rank of a 5 card Poker hand using bit manipulations. See bitwiseEvaluator.spec.ts;
 * The purpose of this is to record a 1 bit for each rank – duplicates are lost.
 * Really, we're just looking for straights here.
 * @param {number[]} handRanks
 * @returns {}
 */
export const handRanksToBitwise = (handRanks: number[]): u16 => {
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
 * ... waaaaaaait a second...
 * Now, the problem is that you can't use bitwise operators on floats in JS.
 * Doing so would immediately convert it to an integer.
 * You CAN however, use normal math including modulo and Math.pow()
 *
 * So it's possible to set a nibble for each of the 13 ranks...
 * and assign a bit for each time one occurs.  Kings full of jacks, for example,
 * can be represented as the number 123351460741120, or
 * 0000 0111 0000 0011 0000 0000 0000 0000 0000 0000 0000 0000 0000
 *   A    K    Q    J    T    9    8    7    6    5    4    3    2
 * to so so, we set an "offset" to the nibble of the rank,
 */
export const countOfEachRank = (handRanks: number[]): float => {
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
 * (bitwiseCount % 15) sums all the nibbles in the bitwiseCount.
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
 * @param {u16} bitwiseRanks -- the output of HandRanks to Bitwise
 * @param {float} bitwiseCount -- the output of countOfEachRank
 * @return {unknown}
 */
const WHEEL = 0x403c; // 0100 0000 0011 1100
const BROADWAY = 0x7c00; // 0111 1100 0000 0000
const RANK_HASHTABLE: Record<number, [string, number]> = {
  1: ["Four of a Kind", 7],
  6: ["Pair", 1],
  7: ["Two Pair", 2],
  9: ["Three of a Kind", 3],
  10: ["Full House", 6],
};
export const rankPokerHand = (
  rankValues: number[],
  suitValues: number[]
): [string, number] => {
  const bitwiseRanks = handRanksToBitwise(rankValues);
  const bitwiseCount = countOfEachRank(rankValues) % 15;
  // if bitwiseCount === 5, there are no duplicates, so it's either a high card, straight, flush, or straight flush.
  if (bitwiseCount === 5) {
    const isStraight =
      bitwiseRanks / (bitwiseRanks & -bitwiseRanks) == 31 ||
      bitwiseRanks === WHEEL;
    const isFlush =
      suitValues[0] ===
      (suitValues[1] | suitValues[2] | suitValues[3] | suitValues[4]); // are all the same.

    const isStraightFlush = isStraight && isFlush;
    const isRoyalFlush = isStraightFlush && bitwiseRanks === BROADWAY;
    if (isRoyalFlush) {
      return ["Royal Flush", 9];
    }
    if (isStraightFlush) {
      return ["Straight Flush", 8];
    }
    if (isFlush) {
      return ["Flush", 5];
    }
    if (isStraight) {
      return ["Straight", 4];
    }
    return ["High Card", 0];
  } else {
    return RANK_HASHTABLE[bitwiseCount];
  }
};
