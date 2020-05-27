import fillBoardAndEvaluate, { findRemainingCardsInDeck } from "./fillBoard";
import { performance } from "perf_hooks";

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
  describe("Simulate Holdem Hand, Amarillo Slim", () => {
    it("simulates a hand (classic evaluation)", () => {
      const hand1 = "Js Ts";
      const hand2 = "Ac Kd";
      const hand3 = "4h 4d";
      console.log("starting timer: Classic Evaluation");
      const start = performance.now();
      const result = fillBoardAndEvaluate([hand1, hand2, hand3]);
      console.log(
        `Classic Evaluation time: ${(performance.now() - start) / 1000}seconds`
      );
      expect(result).toEqual({
        count: 1370754,
        players: [0.3576000264574418, 0.3468971578172649, 0.2955028157252463],
      });
      expect(result.players.reduce((pv, cv) => pv + cv)).toBeCloseTo(1);
    });
    it("simulates a hand (bitwise evaluation)", () => {
      const hand1 = "Js Ts";
      const hand2 = "Ac Kd";
      const hand3 = "4h 4d";
      console.log("starting timer: Bitwise Evaluation");
      const start = performance.now();
      const result = fillBoardAndEvaluate(
        [hand1, hand2, hand3],
        undefined,
        true
      );
      console.log(
        `Bitwise Evaluation time: ${(performance.now() - start) / 1000}seconds`
      );
      expect(result).toEqual({
        count: 1370754,
        players: [0.3576000264574418, 0.3468971578172649, 0.2955028157252463],
      });
      expect(result.players.reduce((pv, cv) => pv + cv)).toBeCloseTo(1);
    });
  });
});
