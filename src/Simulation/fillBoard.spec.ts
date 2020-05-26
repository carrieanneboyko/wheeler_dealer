import { findRemainingCardsInDeck } from "./fillBoard";

describe("fillBoard", () => {
  describe("findRemainingCardsInDeck", () => {
    it("finds remaining cards in the deck", () => {
      const deadHands = ["Ks Kh", "Ac Td", "7s 6s"];
      const deadBoard = "As Qs Jc";
      const test1 = findRemainingCardsInDeck(deadHands, deadBoard);
      expect(test1).toHaveLength(52 - 9);
      expect(test1).toEqual([
        "2s",
        "3s",
        "4s",
        "5s",
        "8s",
        "9s",
        "Ts",
        "Js",
        "2h",
        "3h",
        "4h",
        "5h",
        "6h",
        "7h",
        "8h",
        "9h",
        "Th",
        "Jh",
        "Qh",
        "Ah",
        "2d",
        "3d",
        "4d",
        "5d",
        "6d",
        "7d",
        "8d",
        "9d",
        "Jd",
        "Qd",
        "Kd",
        "Ad",
        "2c",
        "3c",
        "4c",
        "5c",
        "6c",
        "7c",
        "8c",
        "9c",
        "Tc",
        "Qc",
        "Kc",
      ]);
      const test2 = findRemainingCardsInDeck(deadHands);
      expect(test2).toHaveLength(52 - 6);
    });
  });
});
