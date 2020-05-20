import Card from "../deck/Card";
import { sortHand } from "./evaluateHand";

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
