// this order is important for the bitwise calculation.  Might be useful as a map;
const hands = [
  "4 of a Kind",
  "Straight Flush",
  "Straight",
  "Flush",
  "High Card",
  "1 Pair",
  "2 Pair",
  "Royal Flush",
  "3 of a Kind",
  "Full House",
];

type u16 = number;
type float = number;

const Rank = {
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
const { A, K, Q, J, T } = Rank;
const Suit = {
  s: 1,
  c: 2,
  h: 4,
  d: 8,
};

// Bitwise operators
/* 
  << : Zero fill left shift -- Shifts left by pushing zeros in from the right and let the leftmost bits fall off
    // Effectively, 1 << x === Math.pow(2, x), in base 10, but what it's doing is converting the value of 
    // the card to 16-bit binary. 
    // so an ace (value 14) would be: 0100 0000 0000 0000, (15th bit is true) a 9 would be 0000 0010 0000 0000; (10th bit is true)

  |	: Bitwise OR -- Sets each bit to 1 if one of two bits is 1
*/
// Calculates the Rank of a 5 card Poker hand using bit manipulations. See bitwiseEvaluator.spec.ts;
// The purpose of this is to record a 1 bit for each rank – duplicates are lost.
/**
 *
 * @param {number[]} handRanks
 * @returns {}
 */
export const handRanksToBitwise = (handRanks: number[]): u16 => {
  let bf: u16 = 0;
  for (let card = 0; card < 5; card++) {
    const cVal = 1 << handRanks[card];
    bf = bf | cVal;
  }
  return bf;
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
 * can be represented as
 * 0000 0111 0000 0011 0000 0000 0000 0000 0000 0000 0000 0000 0000
 *   A    K    Q    J    T    9    8    7    6    5    4    3    2
 * to so so, we set an "offset" to the nibble of the rank,
 * @param {number[]} handRanks
 * @returns {float}
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
      offset = Math.pow(2, handRanks[i] * 4)
  ) {
    // though value is a float, it's bits can still be manipulated via addition.
    // (value/offset) bit shifts the desired nibble to the least significant bits (LSBs)
    // & 15 (or (0xF)) "masks" the other bits so that they're not affected,
    value += offset * (((value / offset) & 15) + 1);
  }
  return value;
};

// function rankPokerHand(cardRanks: number[], suitValues: number[]) {
//   let countOfEachRank: bitField;
//   let v = 0;
//   let i;
//   let o = 0;
//   // convert each card rank to bitwise, then "bitwise or" them together. AAQTT would be:
//   let s = handRanksToBitwise(cardRanks);

//   for (let i = -1; i < 5; i++, o = Math.pow(2, cardRanks[i] * 4)) {
//     v += o * (((v / o) & 15) + 1);
//   }
//   v = (v % 15) - (s / (s & -s) == 31 || s == 0x403c ? 3 : 1);
//   v -=
//     (suitValues[0] ==
//       (suitValues[1] | suitValues[2] | suitValues[3] | suitValues[4])) *
//     (s == 0x7c00 ? -5 : 1);
//   console.log(
//     "Hand: " + hands[v] + (s == 0x403c ? " (Ace low)" : "") + "<br/>"
//   );
// }

// rankPokerHand([T, J, Q, K, A], [Suit.s, Suit.s, Suit.s, Suit.s, Suit.s]); // Royal Flush
// rankPokerHand([4, 5, 6, 7, 8], [Suit.s, Suit.s, Suit.s, Suit.s, Suit.s]); // Straight Flush
// rankPokerHand([2, 3, 4, 5, A], [Suit.s, Suit.s, Suit.s, Suit.s, Suit.s]); // Straight Flush
// rankPokerHand([8, 8, 8, 8, 9], [Suit.s, Suit.c, Suit.h, Suit.d, Suit.s]); // 4 of a Kind
// rankPokerHand([7, 7, 7, 9, 9], [Suit.s, Suit.c, Suit.h, Suit.s, Suit.c]); // Full house
// rankPokerHand([T, J, 6, K, 9], [Suit.c, Suit.c, Suit.c, Suit.c, Suit.c]); // Flush
// rankPokerHand([T, J, Q, K, 9], [Suit.s, Suit.c, Suit.h, Suit.c, Suit.d]); // Straight
// rankPokerHand([2, 3, 4, 5, A], [Suit.s, Suit.c, Suit.h, Suit.c, Suit.d]); // Straight
// rankPokerHand([4, 4, 4, 8, 9], [Suit.s, Suit.c, Suit.h, Suit.s, Suit.c]); // 3 of a Kind
// rankPokerHand([8, 8, J, 9, 9], [Suit.s, Suit.c, Suit.h, Suit.s, Suit.c]); // 2 Pair
// rankPokerHand([8, 8, 3, 5, 9], [Suit.s, Suit.c, Suit.h, Suit.s, Suit.c]); // 1 Pair
// rankPokerHand([T, 5, 4, 7, 9], [Suit.s, Suit.c, Suit.h, Suit.s, Suit.c]); // High Card
