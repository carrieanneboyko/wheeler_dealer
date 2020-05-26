import { HandRank } from "./types";

export const POKER_HASH: Record<number | string, [string, HandRank]> = {
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
export const WHEEL_HASH = 0x403c; // 0100 0000 0011 1100
export const BROADWAY_HASH = 0x7c00; // 0111 1100 0000 0000

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

export const PAIR_TYPES: string[] = ["kickers", "pairs", "trips", "quads"];
