import {
  sortHand,
  isInSequence,
  isWheel,
  isStraight,
  isFlush,
  isStraightFlush,
  catalogHand,
  evaluateHand,
} from "./evaluateHand";

import { displayHand, shortHand, numsToHand } from "../utils/shorthand";

describe("helper functions", () => {
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
      expect(isInSequence(shortHand("3♦ 6♦ 4♠ 5♠ 7♠"))).toBe(true);
    });
    it("fails wrap-around straights", () => {
      expect(isInSequence(shortHand("3♦ 2♦ 4♠ A♠ K♠"))).toBe(false);
    });
    it("false-negative wheels (by design)", () => {
      expect(isInSequence(shortHand("3♦ 2♦ 4♠ A♠ 5♠"))).toBe(false);
    });
  });

  describe(`isWheel`, () => {
    it("catches wheels", () => {
      expect(isWheel(shortHand("3♦ 2♦ 4♠ A♠ K♠"))).toBe(false);

      expect(isWheel(shortHand("3♦ 2♦ 4♠ A♠ 5♠"))).toBe(true);
    });
  });

  describe(`isStraight`, () => {
    it("fails non-straights (including wraparounds", () => {
      expect(isStraight(shortHand("3♦ 2♦ 4♠ A♠ K♠"))).toBe(false);
    });
    it("passes wheels", () => {
      expect(isStraight(shortHand("3♦ 2♦ 4♠ A♠ 5♠"))).toBe(true);
    });
    it("passes normal straights", () => {
      expect(isStraight(shortHand("3♦ 6♦ 4♠ 5♠ 7♠"))).toBe(true);
    });
  });

  describe(`isFlush`, () => {
    it("fails non-flushes", () => {
      expect(isFlush(shortHand("3♦ 2♦ 4♠ A♠ K♠"))).toBe(false);
    });
    it("passes flushes", () => {
      expect(isFlush(shortHand("3♦ 2♦ 4♦ A♦ K♦"))).toBe(true);
    });
  });

  describe(`isStraightFlush`, () => {
    it("fails non-straight-flushes", () => {
      expect(isStraightFlush(shortHand("3♦ 2♦ 4♠ A♠ K♠"))).toBe(false);
      expect(isStraightFlush(shortHand("3♦ 2♦ 4♦ A♦ K♦"))).toBe(false);
      expect(isStraightFlush(shortHand("3♦ 6♦ 4♠ 5♠ 7♠"))).toBe(false);
    });
    it("passes steel wheels", () => {
      expect(isStraightFlush(shortHand("3♦ 2♦ 4♦ A♦ 5♦"))).toBe(true);
    });
    it("passes non-wheel straight flushes", () => {
      expect(isStraightFlush(shortHand("3♦ 6♦ 4♦ 7♦ 5♦"))).toBe(true);
    });
  });
});

describe("catalog hand", () => {
  it("correctly catalogs hands", () => {
    expect(catalogHand(shortHand("3♦ 2♦ 4♦ A♦ 5♦"))).toEqual({
      "0": 1,
      "1": 1,
      "2": 1,
      "3": 1,
      "12": 1,
    });
    expect(catalogHand(shortHand("3♦ 2♦ 4♦ 8♦ 5♦"))).toEqual({
      "0": 1,
      "1": 1,
      "2": 1,
      "3": 1,
      "6": 1,
    });
    expect(catalogHand(shortHand("K♠ K♥ 4♦ 4♣ 4♠"))).toEqual({
      "11": 2,
      "2": 3,
    });
  });
});

describe("evaluateHand", () => {
  it("correctly evaluates all these hands", () => {
    expect(evaluateHand(shortHand("3♦ 6♦ 4♦ 7♦ 5♦"))).toEqual({
      handRank: 8,
      values: [5, 4, 3, 2, 1],
    });
    expect(evaluateHand(shortHand("3♦ A♦ 4♦ 2♦ 5♦"))).toEqual({
      handRank: 8,
      values: [3, 2, 1, 0, 12],
    });
    expect(evaluateHand(shortHand("K♠ 4♥ 4♦ 4♣ 4♠"))).toEqual({
      handRank: 7,
      values: [2, 2, 2, 2, 11],
    });
    expect(evaluateHand(shortHand("K♠ K♦ 4♦ 4♣ 4♠"))).toEqual({
      handRank: 6,
      values: [2, 2, 2, 11, 11],
    });
    expect(evaluateHand(shortHand("K♠ K♦ K♥ 4♣ 4♠"))).toEqual({
      handRank: 6,
      values: [11, 11, 11, 2, 2],
    });
    expect(evaluateHand(shortHand("3♦ 2♦ 4♦ 8♦ 5♦"))).toEqual({
      handRank: 5,
      values: [6, 3, 2, 1, 0],
    });
    expect(evaluateHand(shortHand("3♦ 2♦ 4♦ 6♠ 5♦"))).toEqual({
      handRank: 4,
      values: [4, 3, 2, 1, 0],
    });
    expect(evaluateHand(shortHand("3♦ 2♦ 4♦ A♠ 5♦"))).toEqual({
      handRank: 4,
      values: [3, 2, 1, 0, 12],
    });
    expect(evaluateHand(shortHand("K♠ K♦ K♥ 6♣ 4♠"))).toEqual({
      handRank: 3,
      values: [11, 11, 11, 4, 2],
    });
    expect(evaluateHand(shortHand("K♠ K♦ 6♥ 6♣ 4♠"))).toEqual({
      handRank: 2,
      values: [11, 11, 4, 4, 2],
    });
    expect(evaluateHand(shortHand("K♠ K♦ 6♥ A♣ 4♠"))).toEqual({
      handRank: 1,
      values: [11, 11, 12, 4, 2],
    });
    expect(evaluateHand(shortHand("K♠ Q♦ 6♥ A♣ 4♠"))).toEqual({
      handRank: 0,
      values: [12, 11, 10, 4, 2],
    });
  });
});

describe("visualTest", () => {
  for (let i = 0; i < 100; i++) {}
});
