import evaluateHand, { HandRanking } from "./evaluateHand";
import Card from "../deck/Card";
import nChooseK from "../utils/nChooseK";

const HOLDEM_COMBOS = nChooseK(7, 5);

export const isCandidateBetter = (
  old: HandRanking,
  candidate: HandRanking
): number => {
  if (old.handRank > candidate.handRank) {
    return -1;
  }
  if (old.handRank < candidate.handRank) {
    return 1;
  }
  for (var i = 0; i < 5; i++) {
    if (old.values[i] > candidate.values[i]) {
      return -1;
    }
    if (old.values[i] < candidate.values[i]) {
      return 1;
    }
  }
  return 0;
};

interface PlayedHand {
  playedHand: Card[];
  evaluation: HandRanking;
}

export const findHandThatPlays = (
  board: Card[],
  playerCards: Card[]
): PlayedHand => {
  const allCards = board.concat(playerCards);
  const result: PlayedHand = {
    playedHand: board,
    evaluation: evaluateHand(board),
  };
  for (const combo of HOLDEM_COMBOS) {
    const candidate: Card[] = combo.map((index) => allCards[index]);
    const evaluatedCandidate: HandRanking = evaluateHand(candidate);
    if (isCandidateBetter(result.evaluation, evaluatedCandidate) > 0) {
      result.playedHand = candidate;
      result.evaluation = evaluatedCandidate;
    }
  }
  return result;
};
