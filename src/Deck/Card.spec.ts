import Card from "./Card";
import { SPADES, HEARTS } from "./suits";

describe("class Card", () => {
  it(`creates the Ace of Spades: A${SPADES}`, () => {
    const aceOfSpades = new Card(12);
    expect(aceOfSpades.index).toBe(12);
    expect(aceOfSpades.suit).toBe(SPADES);
    expect(aceOfSpades.rank).toBe("A");
    expect(aceOfSpades.value).toBe(12);
  });
  it(`creates the Queen of Hearts: Q${HEARTS}`, () => {
    const queenOfHearts = new Card(23);
    expect(queenOfHearts.index).toBe(23);
    expect(queenOfHearts.suit).toBe(HEARTS);
    expect(queenOfHearts.rank).toBe("Q");
    expect(queenOfHearts.value).toBe(10);
  });
});
