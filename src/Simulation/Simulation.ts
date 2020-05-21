import Game from "../Game";
import Card from "../Deck/Card";
import { freshDeck } from "../Deck";
import nChooseK from "../utils/nChooseK";

export class SingleSimulation {
  public hands: Card[][] = [];
  public board: Card[] = [];
  public deadCards: number[] = []; // make private after testing
  public simulationResults: number[][] = [];
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
        this.simulationResults = onlyGame.showdown().equity;
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
      const progressBar = setInterval(() => {
        const ratio = processedCombo / comboLength;
        console.log(
          `Processing: ${processedCombo}/${comboLength} ${Math.floor(
            ratio * 100
          )}%`
        );
      }, 1000);
      for (let combo of allPossibleCombinations) {
        const gameSim = new Game(this.hands.length);
        gameSim.hands = this.hands;
        const simCards = combo.map((index: number) => remainingDeck[index]);
        gameSim.board = this.board.concat(simCards);
        this.simulationResults = this.simulationResults.concat(
          gameSim.showdown().equity
        );
        processedCombo += 1;
      }
      console.log(`Done in ${Date.now() - startTime}ms`);
      clearInterval(progressBar);
      return resolve(this);
    });
  public calcEquity = async (): Promise<Record<number, number>> => {
    await this.simulateBoard();
    const rawResults: Record<number, number> = {};
    for (const sim of this.simulationResults) {
      const [player, oneHandEquity] = sim;
      if (!rawResults[player]) {
        rawResults[player] = 0;
      }
      rawResults[player] += oneHandEquity;
    }
    const equities: Record<number, number> = {};
    for (const [player, multiHandEquities] of Object.entries(rawResults)) {
      equities[parseInt(player, 10)] =
        multiHandEquities / this.simulationResults.length;
    }
    return equities;
  };
}
