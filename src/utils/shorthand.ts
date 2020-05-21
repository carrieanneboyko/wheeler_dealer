import SUITS from "../Deck/suits";
import RANKS from "../Deck/ranks";
import Card from "../Deck/Card";
import { sortHand } from "../hands/evaluateHand";

// helpers
export const displayToCardIndex = (c: string): number => {
  return SUITS.indexOf(c.charAt(1)) * 13 + RANKS.indexOf(c.charAt(0));
};
export const displayHand = (hand: Card[]) => hand.map((card) => card.display);
export const numsToHand = (nums: number[]) => nums.map((i) => new Card(i));

export const formatHandFromString = (str: string): Card[] =>
  numsToHand(str.split(" ").map(displayToCardIndex));

export const shortHand = (str: string): Card[] =>
  sortHand(formatHandFromString(str));
