import DECK from "./index";
import Card from "./Card";

const EXPECTED_DISPLAY_DECK =
  "2♠ 3♠ 4♠ 5♠ 6♠ 7♠ 8♠ 9♠ T♠ J♠ Q♠ K♠ A♠ " +
  "2♥ 3♥ 4♥ 5♥ 6♥ 7♥ 8♥ 9♥ T♥ J♥ Q♥ K♥ A♥ " +
  "2♦ 3♦ 4♦ 5♦ 6♦ 7♦ 8♦ 9♦ T♦ J♦ Q♦ K♦ A♦ " +
  "2♣ 3♣ 4♣ 5♣ 6♣ 7♣ 8♣ 9♣ T♣ J♣ Q♣ K♣ A♣";
describe("DECK", () => {
  it("is a 52 card deck", () => {
    const displayDeck = DECK.map((card: Card) => card.display);
    expect(displayDeck.join(" ")).toBe(EXPECTED_DISPLAY_DECK);
  });
});
