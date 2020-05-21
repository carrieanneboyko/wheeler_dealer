import Game from "../Game";
import Card from "../Deck/Card";
import { freshDeck } from "../Deck";
import nChooseK from "../utils/nChooseK";

export class SingleSimulation {
  public hands: Card[][] = [];
  public board: Card[] = [];
  public deadCards: number[] = []; // make private after testing
  public simulationResults: number[][][] = [];
  constructor(initialHands?: Card[][]) {
    if (initialHands) {
      initialHands.forEach(this.addHand);
    }
  }
  public pluckFromDeck = (...indexes: number[]) => {
    for (let index of indexes) {
      if (this.deadCards.includes(index)) {
        throw new Error(`Cannot play same card twice - index: ${index}`);
      }
    }
    this.deadCards = this.deadCards.concat(indexes);
    return this;
  };
  public addHand = (hand: Card[]) => {
    this.pluckFromDeck(...hand.map((card: Card) => card.index));
    this.hands.push(hand);
    return this;
  };
  public addBoardCard = (card: Card) => {
    this.pluckFromDeck(card.index);
    this.board.push(card);
  };
  public simulateBoard = (): Promise<SingleSimulation> =>
    new Promise((resolve) => {
      // clear previous simulation results if they exist.
      if (this.simulationResults.length !== 0) {
        this.simulationResults = [];
      }
      const remainingStreets = 5 - this.board.length;
      if (remainingStreets === 0) {
        const onlyGame = new Game(this.hands.length);
        onlyGame.hands = this.hands;
        onlyGame.board = this.board;
        this.simulationResults = [onlyGame.showdown().equity];
        return resolve(this);
      }

      const remainingDeck = freshDeck().filter(
        (card: Card) => !this.deadCards.includes(card.index)
      );
      const remainingCards = remainingDeck.length;
      const allPossibleCombinations: number[][] = nChooseK(
        remainingCards,
        remainingStreets
      );
      const comboLength = allPossibleCombinations.length;
      console.log(
        `simulating ${allPossibleCombinations.length} possible combinations`
      );
      let startTime = Date.now();
      let processedCombo = 0;

      for (let combo of allPossibleCombinations) {
        const simCards = combo.map((index: number) => remainingDeck[index]);
        const gameSim = new Game(this.hands.length);
        gameSim.hands = this.hands;
        gameSim.board = this.board.concat(simCards);
        this.simulationResults.push(gameSim.showdown().equity);
        processedCombo += 1;
        if (processedCombo % 50000 === 0) {
          console.log(
            `${Math.floor((processedCombo / comboLength) * 100)}% done in ${
              Date.now() - startTime
            }ms`
          );
        }
      }
      console.log(`Done in ${Date.now() - startTime}ms`);
      return resolve(this);
    });
  public calcEquity = async (): Promise<Record<number, number>> => {
    await this.simulateBoard();
    const rawResults: Record<number, number> = {};
    for (const game of this.simulationResults) {
      for (const simResult of game) {
        const [player, oneHandEquity] = simResult;
        if (!rawResults[player]) {
          rawResults[player] = 0;
        }
        rawResults[player] += oneHandEquity;
      }
    }
    const equities: Record<number, number> = {};
    for (const [player, multiHandEquities] of Object.entries(rawResults)) {
      equities[parseInt(player, 10)] =
        multiHandEquities / this.simulationResults.length;
    }
    return equities;
  };
}
