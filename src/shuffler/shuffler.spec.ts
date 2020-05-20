import range from "lodash/range";
import { shuffler, throwNSidedDie } from "./index";

describe("throwNSidedDie", () => {
  it("throws an n-sided die and returns the result", () => {
    for (let i = 0; i < 100; i++) {
      const roll = throwNSidedDie(20, 1);
      expect(roll).toBeGreaterThan(0);
      expect(roll).toBeLessThan(21);
      expect(roll).toBe(~~roll); // i.e, that it's an integer equal to it's own Math.floor();
    }
  });
});

describe("shuffler", () => {
  it("creates a random deck shuffle", () => {
    const DECK = range(20);
    let prev = null;
    for (let i = 0; i < 100; i++) {
      const shufDeck = shuffler(DECK.slice());
      expect(shufDeck).toHaveLength(20);
      expect(shufDeck).not.toEqual(prev);
      expect(shufDeck).not.toEqual(DECK);
      prev = shufDeck.slice();
    }
  });
});
