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

const A = 14;
const K = 13;
const Q = 12;
const J = 11;
const T = 10;
const Rank = {
  A,
  K,
  Q,
  J,
  T,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};
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
//Calculates the Rank of a 5 card Poker hand using bit manipulations. See bitwiseEvaluator.spec.ts;
export const handRanksToBitwise = (handRanks: number[]): number => {
  let bitCalc: number = 0;
  for (let card = 0; card < 5; card++) {
    const cVal = 1 << handRanks[card];
    bitCalc = bitCalc | cVal;
  }
  return bitCalc;
};
export const displayIntAs16Bit = (x: number): string => {
  const bitwise = x.toString(2).split("");
  while (bitwise.length < 16) {
    bitwise.unshift("0");
  }
  return `${bitwise.slice(0, 4).join("")} ${bitwise
    .slice(4, 8)
    .join("")} ${bitwise.slice(8, 12).join("")} ${bitwise.slice(12).join("")}`;
};
// function rankPokerHand(cardRanks, suitValues) {
//   let v;
//   let i;
//   let o;
//   // convert each card rank to bitwise, then "bitwise or" them together. AAQTT would be:
//   let s =
//     (1 << cardRanks[0]) |
//     (1 << cardRanks[1]) |
//     (1 << cardRanks[2]) |
//     (1 << cardRanks[3]) |
//     (1 << cardRanks[4]);

//   for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cardRanks[i] * 4)) {
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
