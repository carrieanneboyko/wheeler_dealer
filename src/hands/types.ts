export type u16 = number;
export type float = number;
export interface HandAnalysis {
  handRank: number;
  english: string;
  btRanks: number;
  btCount: number;
}

export enum HandRank {
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
export interface ClassicAnalysis {
  ranks: number[];
  suits: number[];
  values: number[];
  handRank: HandRank;
}
export interface PairUps {
  quads: number[];
  trips: number[];
  pairs: number[];
  kickers: number[];
  [key: string]: number[];
}
