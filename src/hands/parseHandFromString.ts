import { Rank, Suit } from "./constants";

export const parseHandFromString = (
  handNotation: string
): [number[], number[]] => {
  const cards = handNotation.trim().split(" ");
  const ranks = cards.map((c) => Rank[c.charAt(0)]);
  const suits = cards.map((c) => Suit[c.charAt(1).toLowerCase()]);
  return [ranks, suits];
};

export default parseHandFromString;
