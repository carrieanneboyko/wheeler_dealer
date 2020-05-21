import Game from "../Game";
import Card from "../Deck/Card";
import { freshDeck } from "../Deck";

export class SingleSimulation {
  public hands: Card[][] = [];
  public board: Card[] = [];
  private readonly deck: Card[] = freshDeck(); // all cards will be in order, no shuffle.
  private remainingDeck: Card[] = [];
  private deadCards: number[] = [];

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
  public setRemainingDeck = () => {
    this.remainingDeck = this.deck.filter(
      (card: Card) => !this.deadCards.includes(card.index)
    );
    return this;
  };
}
