import { Rank, Suit, PAIR_TYPES } from "../constants";
import { PairUps, HandRank, ClassicAnalysis } from "../types";
import isEqual from "lodash/isEqual";
const { A, K } = Rank;
import parseHandFromString from "../parseHandFromString";

// in-memory cache, so we don't sort more than once for a given set.
const sortRanks = (ranks: number[]) => {
  const sorted = ranks.sort((a, b) => b - a);
  if (isEqual(sorted, [A, 5, 4, 3, 2])) {
    return [5, 4, 3, 2, A];
  }
  return sorted;
};

const isInSequence = (ranks: number[]): boolean => {
  for (let i = 1, l = ranks.length; i < l; i++) {
    if (ranks[i - 1] - 1 !== ranks[i]) {
      return false;
    }
  }
  return true;
};

const isStraight = (ranks: number[]): boolean =>
  isInSequence(ranks) || isEqual(ranks, [5, 4, 3, 2, A]);

const isFlush = (suits: number[]): boolean =>
  suits.every((suit: number) => suit - suits[0] === 0);

const analyzeKickers = (ranks: number[]): PairUps => {
  const workspace: PairUps = { quads: [], trips: [], pairs: [], kickers: [] };
  ranks = sortRanks(ranks);
  const queue = { rank: ranks[0], count: 1 };
  for (let rank of ranks.slice(1)) {
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

const getHandRanking = (
  ranks: number[],
  suits: number[],
  preSorted: boolean = false
): [HandRank, number[]] => {
  const sortedRanks = preSorted ? ranks : sortRanks(ranks);

  const s = isStraight(sortedRanks);
  const f = isFlush(suits);
  if (s && f) {
    if (sortedRanks[1] === K) {
      return [HandRank.royalFlush, sortedRanks];
    }
    return [HandRank.straightFlush, sortedRanks];
  }
  if (f) {
    return [HandRank.flush, sortedRanks];
  }
  if (s) {
    return [HandRank.straight, sortedRanks];
  }
  const pairUps = analyzeKickers(sortedRanks);
  if (pairUps.kickers.length === 5) {
    return [HandRank.highCard, sortedRanks];
  }
  if (pairUps.kickers.length === 3) {
    return [HandRank.pair, makeCorrectArray.pair(pairUps)];
  }
  if (pairUps.kickers.length === 2) {
    return [HandRank.trips, makeCorrectArray.trips(pairUps)];
  }
  if (pairUps.kickers.length === 1) {
    return pairUps.quads.length > 0
      ? [HandRank.quads, makeCorrectArray.quads(pairUps)]
      : [HandRank.twoPair, makeCorrectArray.pair(pairUps)];
  }
  if (pairUps.kickers.length === 0) {
    return [HandRank.fullHouse, makeCorrectArray.boat(pairUps)];
  }
  throw new Error(
    `This is impossible; ${JSON.stringify(
      pairUps
    )} is not a valid poker hand, check ${JSON.stringify(
      ranks
    )} ranks and ${JSON.stringify(suits)} suits`
  );
};

export const getHandDetails = (hand: string): ClassicAnalysis => {
  let [ranks, suits] = parseHandFromString(hand);
  const sortedRanks = sortRanks(ranks);

  const [handRank, values] = getHandRanking(sortedRanks, suits, true);
  return {
    ranks: sortedRanks,
    suits,
    handRank,
    values,
  };
};
/**
 * Returns positive number if hand A is stronger, negative number if hand B is stronger.
 * Returns 0 on a tie.
 */
export const compareHands = (handA: string, handB: string): number => {
  const a = getHandDetails(handA);
  const b = getHandDetails(handB);
  if (a.handRank !== b.handRank) {
    return a.handRank - b.handRank;
  }
  return compareArrays(a.values, b.values);
};

export default compareHands;
