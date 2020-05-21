import Card from "../deck/Card";
import { freshDeck } from "../deck";
import { shuffler } from "../shuffler";
import { findHandThatPlays, isCandidateBetter } from "../hands/compareHands";

// There are traditions in Holdem that you deal one card to each player before dealing
// the second card to each player, and that you burn before dealing board cards.
// These traditions make sense in a live game but increase the difficulty in
// coding a simulation.

export default class Game {
  public hands: Card[][];
  public board: Card[] = [];
  public deck: Card[] = shuffler<Card>(freshDeck());
  constructor(public readonly numPlayers: number) {
    if (numPlayers > 22) {
      throw new Error(
        "Number of players must be 22 or less, otherwise you run out of cards"
      );
    }
    this.hands = Array(numPlayers).fill([]);
  }
  private dealTopCards = (numCards: number): Card[] => {
    const cards: Card[] = [];
    for (let i = 0; i < numCards; i++) {
      const topCard = this.deck.pop();
      if (!topCard) {
        throw new Error(`Out of cards`);
      }
      cards.push(topCard);
    }
    return cards;
  };
  public dealPreflop = () => {
    for (let i = 0; i < this.numPlayers; i++) {
      this.hands[i] = this.dealTopCards(2);
    }
  };
  public dealFlop = () => {
    this.board = this.board.concat(this.dealTopCards(3));
  };
  public dealTurn = () => {
    this.board = this.board.concat(this.dealTopCards(1));
  };
  // same thing but for naming convention sake;
  public dealRiver = this.dealTurn;
  public showdown = () => {
    const handEvaluations = this.hands
      .map((playerHand, index) => ({
        index,
        bestHand: findHandThatPlays(this.board, playerHand),
      }))
      .sort((handA, handB) =>
        isCandidateBetter(handA.bestHand.evaluation, handB.bestHand.evaluation)
      );
    return handEvaluations;
  };
}
