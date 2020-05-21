import STACKED_DECK from "../Deck/stackedDeck";
import { formatHandFromString, displayHand } from "../utils/shorthand";
import Game from "./Game";

let testGame = new Game(8);
let testGame2 = new Game(8);
testGame2.deck = formatHandFromString(STACKED_DECK);
describe("class Game", () => {
  describe("constructor", () => {
    it("should have eight players", () => {
      expect(testGame.hands).toHaveLength(8);
    });
    it("should have a random deck", () => {
      // technically speaking, could randomly false fail, but
      // the chances of that are 1/52! so...
      expect(testGame.deck).not.toEqual(formatHandFromString(STACKED_DECK));
    });
  });
  describe("public dealPreflop()", () => {
    it("should deal the preflop", () => {
      testGame.deck = formatHandFromString(STACKED_DECK); // stack the deck for the test
      testGame.dealPreflop();
      expect(
        testGame.hands.map((hand) => displayHand(hand).join(" "))
      ).toEqual([
        "K♠ 8♣",
        "5♣ 9♠",
        "8♦ T♣",
        "J♠ 3♥",
        "2♥ Q♥",
        "6♠ A♠",
        "5♦ J♥",
        "4♥ J♦",
      ]);
      expect(testGame.deck).toHaveLength(52 - 16);
    });
  });
  describe("public dealFlop()", () => {
    it("should deal the flop", () => {
      testGame.dealFlop();
      expect(displayHand(testGame.board).join(" ")).toBe("3♠ Q♠ A♣");
      expect(testGame.deck).toHaveLength(52 - 19);
    });
  });
  describe("public dealTurn()", () => {
    it("should deal the turn", () => {
      testGame.dealTurn();
      expect(displayHand(testGame.board).join(" ")).toBe("3♠ Q♠ A♣ 9♥");
      expect(testGame.deck).toHaveLength(52 - 20);
    });
  });
  describe("public dealRiver()", () => {
    it("should deal the river", () => {
      testGame.dealRiver();
      expect(displayHand(testGame.board).join(" ")).toBe("3♠ Q♠ A♣ 9♥ 3♣");
      expect(testGame.deck).toHaveLength(52 - 21);
    });
  });
  describe("public showdown()", () => {
    it("should evaluate the showdown", () => {
      const result = testGame.showdown().evaluations;
      const bestToWorst = result.map((hand) => hand.index);
      expect(bestToWorst).toEqual([3, 5, 4, 1, 0, 6, 7, 2]);
      const evaluations = result.map((hand) => hand.bestHand.evaluation);
      expect(evaluations).toEqual([
        { handRank: 3, values: [1, 1, 1, 12, 10] },
        { handRank: 2, values: [12, 12, 1, 1, 10] },
        { handRank: 2, values: [10, 10, 1, 1, 12] },
        { handRank: 2, values: [7, 7, 1, 1, 12] },
        { handRank: 1, values: [1, 1, 12, 11, 10] },
        { handRank: 1, values: [1, 1, 12, 10, 9] },
        { handRank: 1, values: [1, 1, 12, 10, 9] },
        { handRank: 1, values: [1, 1, 12, 10, 8] },
      ]);
    });
  });
});

describe("chained operations", () => {
  it("should should do all of the above in a chain", () => {
    const result = testGame2
      .dealPreflop()
      .dealFlop()
      .dealTurn()
      .dealRiver()
      .showdown().evaluations;
    const bestToWorst = result.map((hand) => hand.index);
    expect(bestToWorst).toEqual([3, 5, 4, 1, 0, 6, 7, 2]);
    const evaluations = result.map((hand) => hand.bestHand.evaluation);
    expect(evaluations).toEqual([
      { handRank: 3, values: [1, 1, 1, 12, 10] },
      { handRank: 2, values: [12, 12, 1, 1, 10] },
      { handRank: 2, values: [10, 10, 1, 1, 12] },
      { handRank: 2, values: [7, 7, 1, 1, 12] },
      { handRank: 1, values: [1, 1, 12, 11, 10] },
      { handRank: 1, values: [1, 1, 12, 10, 9] },
      { handRank: 1, values: [1, 1, 12, 10, 9] },
      { handRank: 1, values: [1, 1, 12, 10, 8] },
    ]);
  });
});
