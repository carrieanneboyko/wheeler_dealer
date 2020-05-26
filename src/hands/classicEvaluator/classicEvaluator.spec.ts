import { compareHands, getHandDetails } from "./classicEvaluator";
import { Rank } from "../constants";

const { A, K, Q, J, T } = Rank;

describe("classicEvaluator", () => {
  describe("getHandDetails", () => {
    it("gets hand details", () => {
      const royal = "As Ks Qs Js Ts";
      const straightFlush = "4s 5s 7s 6s 3s";
      const steelWheel = "Ah 3h 5h 4h 2h";
      const quads = "Jh Jc Jd Js 2h";
      const boat = "8h 8c 8d 9s 9h";
      const flush = "Ah Kh 9h 3h 2h";
      const straight = "4s 5c 7d 6s 3s";
      const wheel = "2s As 4s 3s 5d";
      const trips = "Ts Tc Td 4s Ad";
      const twoPair = "8s 8d Jc 9s 9d";
      const onePair = "6s 6d As Kd Jd";
      const highCard = "Ks Js 9s 7s 6d";
      expect(getHandDetails(royal)).toEqual({
        handRank: 9,
        ranks: [14, 13, 12, 11, 10],
        suits: [1, 1, 1, 1, 1],
        values: [14, 13, 12, 11, 10],
      });
      expect(getHandDetails(straightFlush)).toEqual({
        handRank: 8,
        ranks: [7, 6, 5, 4, 3],
        suits: [1, 1, 1, 1, 1],
        values: [7, 6, 5, 4, 3],
      });
      expect(getHandDetails(steelWheel)).toEqual({
        handRank: 8,
        ranks: [5, 4, 3, 2, 14],
        suits: [4, 4, 4, 4, 4],
        values: [5, 4, 3, 2, 14],
      });
      expect(getHandDetails(quads)).toEqual({
        handRank: 7,
        ranks: [11, 11, 11, 11, 2],
        suits: [4, 2, 8, 1, 4],
        values: [11, 2],
      });
      expect(getHandDetails(boat)).toEqual({
        handRank: 6,
        ranks: [9, 9, 8, 8, 8],
        suits: [4, 2, 8, 1, 4],
        values: [8, 9],
      });
      expect(getHandDetails(flush)).toEqual({
        handRank: 5,
        ranks: [14, 13, 9, 3, 2],
        suits: [4, 4, 4, 4, 4],
        values: [14, 13, 9, 3, 2],
      });
      expect(getHandDetails(straight)).toEqual({
        handRank: 4,
        ranks: [7, 6, 5, 4, 3],
        suits: [1, 2, 8, 1, 1],
        values: [7, 6, 5, 4, 3],
      });
      expect(getHandDetails(wheel)).toEqual({
        handRank: 4,
        ranks: [5, 4, 3, 2, A],
        suits: [1, 1, 1, 1, 8],
        values: [5, 4, 3, 2, 14],
      });
      expect(getHandDetails(trips)).toEqual({
        handRank: 3,
        ranks: [14, 10, 10, 10, 4],
        suits: [1, 2, 8, 1, 8],
        values: [10, 14, 4],
      });
      expect(getHandDetails(twoPair)).toEqual({
        handRank: 2,
        ranks: [11, 9, 9, 8, 8],
        suits: [1, 8, 2, 1, 8],
        values: [9, 8, 11],
      });
      expect(getHandDetails(onePair)).toEqual({
        handRank: 1,
        ranks: [14, 13, 11, 6, 6],
        suits: [1, 8, 1, 8, 8],
        values: [6, 14, 13, 11],
      });
      expect(getHandDetails(highCard)).toEqual({
        handRank: 0,
        ranks: [13, 11, 9, 7, 6],
        suits: [1, 1, 1, 1, 8],
        values: [13, 11, 9, 7, 6],
      });
    });
  });
});

describe("compareHands", () => {
  it("compares hands", () => {
    const royal = "As Ks Qs Js Ts";
    const straightFlush = "4s 5s 7s 6s 3s";
    const steelWheel = "Ah 3h 5h 4h 2h";
    const quads = "Jh Jc Jd Js 2h";
    const boat = "8h 8c 8d 9s 9h";
    const flush = "Ah Kh 9h 3h 2h";
    const straight = "4s 5c 7d 6s 3s";
    const wheel = "2s As 4s 3s 5d";
    const trips = "Ts Tc Td 4s Ad";
    const twoPair = "8s 8d Jc 9s 9d";
    const onePair = "Ts Td As Kd Jd";
    const highCard = "Ks Js 9s 7s 6d";
    const cardOrder = [
      royal,
      straightFlush,
      steelWheel,
      quads,
      boat,
      flush,
      straight,
      wheel,
      trips,
      twoPair,
      onePair,
      highCard,
    ];
    for (let i = 0, l = cardOrder.length; i < l; i++) {
      for (let j = 0; j < l; j++) {
        if (i === j) {
          const shouldBeZero = compareHands(cardOrder[i], cardOrder[j]);
          if (shouldBeZero !== 0) {
            console.error(
              `should be zero: ${cardOrder[i]}, ${cardOrder[j]}, got ${shouldBeZero}`
            );
          }
          expect(shouldBeZero).toBe(0);
        }
        if (i < j) {
          const shouldBePositive = compareHands(cardOrder[i], cardOrder[j]);
          if (shouldBePositive <= 0) {
            console.error(
              `should be positive: ${cardOrder[i]}, ${cardOrder[j]}, got ${shouldBePositive}`
            );
          }
          expect(shouldBePositive).toBeGreaterThan(0);
        }
        if (i > j) {
          const shouldBeNegative = compareHands(cardOrder[i], cardOrder[j]);
          if (shouldBeNegative >= 0) {
            console.error(
              `should be negative: ${cardOrder[i]}, ${cardOrder[j]}, got ${shouldBeNegative}`
            );
          }
          expect(shouldBeNegative).toBeLessThan(0);
        }
      }
    }
  });
  it(`correctly compares hands of the same rank by their kickers`, () => {
    const straightFlush = "4s 5s 7s 6s 3s";
    const betterSF = "Qd Jd Td 9d 8d";
    expect(compareHands(straightFlush, betterSF)).toBeLessThan(0);
    expect(compareHands(betterSF, straightFlush)).toBeGreaterThan(0);
    expect(compareHands(betterSF, betterSF)).toBe(0);

    const quads = "Jh Jc Jd Js Ah";
    const betterQuads = "Kh Kc Kd Ks 2h";

    expect(compareHands(quads, betterQuads)).toBeLessThan(0);
    expect(compareHands(betterQuads, quads)).toBeGreaterThan(0);
    expect(compareHands(betterQuads, betterQuads)).toBe(0);

    const boat = "8h 8c 8d 9s 9h";
    const betterBoat = "7s 7h Th Tc Td";

    expect(compareHands(boat, betterBoat)).toBeLessThan(0);
    expect(compareHands(betterBoat, boat)).toBeGreaterThan(0);
    expect(compareHands(betterBoat, betterBoat)).toBe(0);

    const flush = "Ah Kh 9h 3h 2h";
    const betterflush = "Ah Kh 9h 4h 2h";
    expect(compareHands(flush, betterflush)).toBeLessThan(0);
    expect(compareHands(betterflush, flush)).toBeGreaterThan(0);
    expect(compareHands(betterflush, betterflush)).toBe(0);

    const straight = "4s 5c 7d 6s 3s";
    const betterstraight = "9s 5c 7d 6s 8s";
    expect(compareHands(straight, betterstraight)).toBeLessThan(0);
    expect(compareHands(betterstraight, straight)).toBeGreaterThan(0);
    expect(compareHands(betterstraight, betterstraight)).toBe(0);

    const trips = "Ts Tc Td 4s Ad";
    const bettertrips = "Ks Kc Kd 4s Ad";
    const tripsKicker = "Ts Tc Td 8s Ad";
    expect(compareHands(trips, bettertrips)).toBeLessThan(0);
    expect(compareHands(bettertrips, trips)).toBeGreaterThan(0);
    expect(compareHands(bettertrips, bettertrips)).toBe(0);
    expect(compareHands(tripsKicker, bettertrips)).toBeLessThan(0);
    expect(compareHands(tripsKicker, trips)).toBeGreaterThan(0);
    expect(compareHands(bettertrips, tripsKicker)).toBeGreaterThan(0);
    expect(compareHands(tripsKicker, bettertrips)).toBeLessThan(0);
    const twoPair = "8s 8d Jc 9s 9d";
    const bettertwoPair = "Ts Td Jc 2s 2d";
    const twoPairKicker = "8s 8d Kc 9s 9d";
    expect(compareHands(twoPair, bettertwoPair)).toBeLessThan(0);
    expect(compareHands(bettertwoPair, twoPair)).toBeGreaterThan(0);
    expect(compareHands(bettertwoPair, bettertwoPair)).toBe(0);
    expect(compareHands(twoPairKicker, bettertwoPair)).toBeLessThan(0);
    expect(compareHands(twoPairKicker, twoPair)).toBeGreaterThan(0);
    expect(compareHands(bettertwoPair, twoPairKicker)).toBeGreaterThan(0);
    expect(compareHands(twoPairKicker, bettertwoPair)).toBeLessThan(0);
    const onePair = "Ts Td As Kd Jd";
    const betteronePair = "As Td As Kd Jd";
    const onePairKicker = "Ts Td As Kd Qd";

    expect(compareHands(onePair, betteronePair)).toBeLessThan(0);
    expect(compareHands(betteronePair, onePair)).toBeGreaterThan(0);
    expect(compareHands(betteronePair, betteronePair)).toBe(0);
    expect(compareHands(onePairKicker, betteronePair)).toBeLessThan(0);
    expect(compareHands(onePairKicker, onePair)).toBeGreaterThan(0);
    expect(compareHands(betteronePair, onePairKicker)).toBeGreaterThan(0);
    expect(compareHands(onePairKicker, betteronePair)).toBeLessThan(0);
    const highCard = "Ks Js 9s 7s 6d";
    const betterhighCard = "As Js 9s 7s 6d";

    expect(compareHands(highCard, betterhighCard)).toBeLessThan(0);
    expect(compareHands(betterhighCard, highCard)).toBeGreaterThan(0);
    expect(compareHands(betterhighCard, betterhighCard)).toBe(0);
  });
});
