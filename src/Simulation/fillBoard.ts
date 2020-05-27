import without from "lodash/without";
import DECK from "../deck";
import nPickK from "../utils/nChooseK";
import bestOfSevenHands from "../Simulation/bestFiveOfSeven";
import classicEvaluator from "../hands/classicEvaluator";
import bitwiseEvaluator from "../hands/bitwiseEvaluator";

export const findRemainingCardsInDeck = (
  hands: string[],
  board?: string
): string[] => {
  const allDeadCards: string[] = [...hands, board]
    .filter((x) => !!x) // filters undefined and "" boards.
    .join(" ")
    .split(" ");
  return without(DECK, ...allDeadCards);
};

interface Tally {
  count: number;
  players: number[];
}

export const getBestPlayerHandsOfSeven = (
  playerHands: string[][],
  board: string[]
): any =>
  playerHands.map((playerHand) =>
    bestOfSevenHands(playerHand.concat(board).join(" "))
  );

export const assignWinnerEquity = (
  winningHand: string,
  bestPlayerHands: string[],
  comparator: (a: string, b: string) => number
): [number, number][] => {
  const winners: number[] = [];
  for (let i = 0, l = bestPlayerHands.length; i < l; i++) {
    if (comparator(winningHand, bestPlayerHands[i]) === 0) {
      winners.push(i);
    }
  }
  return winners.map((winner) => [winner, 1 / winners.length]);
};

export const fillBoardAndEvaluate = (
  hands: string[],
  board: string = "",
  experimentalBitwise: boolean = false
): Tally => {
  const compareHands = experimentalBitwise
    ? bitwiseEvaluator
    : classicEvaluator;
  const remainingCardsInDeck = findRemainingCardsInDeck(hands, board);
  const handsAsArray = hands.map((h) => h.split(" "));
  const boardAsArray = board !== "" ? board.split(" ") : [];
  const cardsToGrab = 5 - boardAsArray.length;
  const tally: Tally = {
    count: 0,
    players: Array(hands.length).fill(0),
  };
  if (cardsToGrab === 0) {
    throw new Error("TODO: Implement for only one possibility");
  }
  const permutations: number[][] = nPickK(
    remainingCardsInDeck.length,
    cardsToGrab
  );
  for (const perm of permutations) {
    tally.count += 1;
    const permCards = perm.map((index) => remainingCardsInDeck[index]);
    const bestPlayerHands = getBestPlayerHandsOfSeven(
      handsAsArray,
      boardAsArray.concat(permCards)
    );
    const sortedHands = bestPlayerHands
      .slice()
      .sort((a: string, b: string) => compareHands(a, b))
      .reverse();
    const winningHand = sortedHands[0];
    const equities = assignWinnerEquity(
      winningHand,
      bestPlayerHands,
      compareHands
    );
    equities.forEach(([winner, amount]) => {
      tally.players[winner] += amount;
    });
  }
  for (const player in tally.players) {
    tally.players[player] = tally.players[player] / tally.count;
  }
  return tally;
};

export default fillBoardAndEvaluate;
