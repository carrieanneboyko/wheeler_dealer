import SUITS from "./suits";
import RANKS from "./ranks";

export default class Card {
  public readonly suit: string;
  public readonly rank: string;
  public readonly value: number;
  public readonly display: string;
  constructor(public readonly index: number) {
    if (index < 0 || index > 51) {
      throw new Error(`Card index ${index} out of range`);
    }
    this.suit = SUITS[Math.floor(index / 13)];
    this.rank = RANKS[index % 13];
    this.value = index % 13;
    this.display = `${this.rank}${this.suit}`;
  }
}
