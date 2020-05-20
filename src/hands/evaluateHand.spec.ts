import Card from "../deck/Card";
import { sortHand, isInSequence } from "./evaluateHand";
import SUITS from "../deck/suits";
import RANKS from "../deck/ranks";
const displayToCardIndex = (c: string): number => {
  return SUITS.indexOf(c.charAt(1)) * 13 + RANKS.indexOf(c.charAt(0));
};
const displayHand = (hand: Card[]) => hand.map((card) => card.display);
const numsToHand = (nums: number[]) => nums.map((i) => new Card(i));
describe("sortHand", () => {
  it("sorts various hands", () => {
    const sixHighSF = numsToHand([0, 1, 2, 3, 4]);
    sortHand(sixHighSF);
    expect(displayHand(sixHighSF)).toEqual(["6♠", "5♠", "4♠", "3♠", "2♠"]);
    const wheel = numsToHand([0, 1, 2, 3, 12]);
    sortHand(wheel);
    expect(displayHand(wheel)).toEqual(["A♠", "5♠", "4♠", "3♠", "2♠"]);
    const randomHand = numsToHand([21, 50, 14, 2, 24]);
    // befor sort
    expect(displayHand(randomHand)).toEqual(["T♥", "K♣", "3♥", "4♠", "K♥"]);
    sortHand(randomHand);
    expect(displayHand(randomHand)).toEqual(["K♣", "K♥", "T♥", "4♠", "3♥"]);
  });
});

describe(`isInSequence`, () => {
  it("catches straights", () => {
    expect(
      isInSequence(
        sortHand(
          numsToHand(["3♦", "6♦", "4♠", "5♠", "7♠"].map(displayToCardIndex))
        )
      )
    ).toBe(true);
  });
  // it('ignores wrap-around straights', () => {})
  // it('false-negative wheels (by design)' () => {})
});
