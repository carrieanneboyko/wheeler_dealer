import Game from "../Game";
import Card from "../Deck/Card";
import { freshDeck } from "../Deck";
import nChooseK from "../utils/nChooseK";

export class SingleSimulation {
  public hands: Card[][] = [];
  public board: Card[] = [];
  private deadCards: number[] = [];
  private simulationResults: number[][] = [];
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
  public simulateBoard = (): Promise<number[][]> =>
    new Promise((resolve) => {
      const remainingStreets = 5 - this.board.length;
      if (remainingStreets === 0) {
        const onlyGame = new Game(this.hands.length);
        onlyGame.hands = this.hands;
        onlyGame.board = this.board;
        this.simulationResults = onlyGame.showdown().equity;
        return resolve(this.simulationResults);
      }

      const remainingDeck = freshDeck().filter(
        (card: Card) => !this.deadCards.includes(card.index)
      );
      const remainingCards = remainingDeck.length;
      const allPossibleCombinations: number[][] = nChooseK(
        remainingCards,
        remainingStreets
      );
      console.log(
        `simulating ${allPossibleCombinations.length} possible combinations`
      );
      for (let combo of allPossibleCombinations) {
        const gameSim = new Game(this.hands.length);
        gameSim.hands = this.hands;
        gameSim.board = this.board.concat(
          combo.map((index: number) => remainingDeck[index])
        );
        this.simulationResults = this.simulationResults.concat(
          gameSim.showdown().equity
        );
      }
      return resolve(this.simulationResults);
    });
}
