import {
  countRanksBitwise,
  countDuplicatesBitwise,
  parseHandFromString,
  rankPokerHand,
  compareHands,
  displayFloatAs64Bit,
  displayIntAs16Bit,
  Rank,
  btCountToAnalysis,
} from "./bitwiseEvaluator";

const { A, K, Q, J, T } = Rank;

describe("bitwiseEvaluator", () => {
  describe("countRanksBitwise()", () => {
    it("converts hand ranks to bitwise values", () => {
      const broadway = [A, K, Q, J, T];
      expect(displayIntAs16Bit(countRanksBitwise(broadway))).toBe(
        "0111 1100 0000 0000"
      );
      const wheel = [A, 2, 3, 4, 5];
      expect(displayIntAs16Bit(countRanksBitwise(wheel))).toBe(
        "0100 0000 0011 1100"
      );
      const twoPair = [8, 8, J, 9, 9];
      expect(displayIntAs16Bit(countRanksBitwise(twoPair))).toBe(
        "0000 1011 0000 0000"
      );
    });
  });
  describe("countDuplicatesBitwise", () => {
    it("magically counts each rank", () => {
      const broadway = [A, K, Q, J, T];
      const broadwayNumberValue = countDuplicatesBitwise(broadway);
      expect(broadwayNumberValue).toBe(76861360339681280);
      expect(displayFloatAs64Bit(broadwayNumberValue)).toBe(
        "0000 0001 0001 0001 0001 0001 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
      );
      const quadKings = [K, K, K, K, T];
      const quadKingsNumberValue = countDuplicatesBitwise(quadKings);
      expect(quadKingsNumberValue).toBe(67555093922185220);
      expect(displayFloatAs64Bit(quadKingsNumberValue)).toBe(
        "0000 0000 1111 0000 0000 0001 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
      );
      const twoPair = [8, 8, J, 9, 9];
      const twoPairNumberValue = countDuplicatesBitwise(twoPair);
      expect(twoPairNumberValue).toBe(17811229376512);
      expect(displayFloatAs64Bit(twoPairNumberValue)).toBe(
        "0000 0000 0000 0000 0001 0000 0011 0011 0000 0000 0000 0000 0000 0000 0000 0000"
      );
    });
  });
  describe("parseHandFromString", () => {
    it("parses a string into two arrays, one for ranks, one for suits,", () => {
      const broadway = "As Ks Qs Js Td";
      const wheel = "2s As 4s 3s 5d";
      const twoPair = "8s 8d Jc 9s 9d";
      const highCard = "Ks Js 9s 7s 6d";
      const flush = "Ah Kh 9h 3h 2h";
      expect(parseHandFromString(broadway)).toEqual([
        [14, 13, 12, 11, 10],
        [1, 1, 1, 1, 8],
      ]);
      expect(parseHandFromString(wheel)).toEqual([
        [2, 14, 4, 3, 5],
        [1, 1, 1, 1, 8],
      ]);
      expect(parseHandFromString(twoPair)).toEqual([
        [8, 8, 11, 9, 9],
        [1, 8, 2, 1, 8],
      ]);
      expect(parseHandFromString(highCard)).toEqual([
        [13, 11, 9, 7, 6],
        [1, 1, 1, 1, 8],
      ]);
      expect(parseHandFromString(flush)).toEqual([
        [14, 13, 9, 3, 2],
        [4, 4, 4, 4, 4],
      ]);
    });
  });
});

describe("rank poker hand", () => {
  it("puts it all together", () => {
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
    expect(rankPokerHand(...parseHandFromString(royal))).toEqual({
      btCount: 5,
      btRanks: 31744,
      english: "Royal Flush",
      handRank: 9,
    });
    expect(rankPokerHand(...parseHandFromString(straightFlush))).toEqual({
      btCount: 5,
      btRanks: 248,
      english: "Straight Flush",
      handRank: 8,
    });
    expect(rankPokerHand(...parseHandFromString(steelWheel))).toEqual({
      btCount: 5,
      btRanks: 16444,
      english: "Straight Flush",
      handRank: 8,
    });
    expect(rankPokerHand(...parseHandFromString(quads))).toEqual({
      btCount: 1,
      btRanks: 2052,
      english: "Four of a Kind",
      handRank: 7,
    });
    expect(rankPokerHand(...parseHandFromString(boat))).toEqual({
      btCount: 10,
      btRanks: 768,
      english: "Full House",
      handRank: 6,
    });
    expect(rankPokerHand(...parseHandFromString(flush))).toEqual({
      btCount: 5,
      btRanks: 25100,
      english: "Flush",
      handRank: 5,
    });
    expect(rankPokerHand(...parseHandFromString(straight))).toEqual({
      btCount: 5,
      btRanks: 248,
      english: "Straight",
      handRank: 4,
    });
    expect(rankPokerHand(...parseHandFromString(wheel))).toEqual({
      btCount: 5,
      btRanks: 16444,
      english: "Straight",
      handRank: 4,
    });
    expect(rankPokerHand(...parseHandFromString(trips))).toEqual({
      btCount: 9,
      btRanks: 17424,
      english: "Three of a Kind",
      handRank: 3,
    });
    expect(rankPokerHand(...parseHandFromString(twoPair))).toEqual({
      btCount: 7,
      btRanks: 2816,
      english: "Two Pair",
      handRank: 2,
    });
    expect(rankPokerHand(...parseHandFromString(onePair))).toEqual({
      btCount: 6,
      btRanks: 26688,
      english: "Pair",
      handRank: 1,
    });
    expect(rankPokerHand(...parseHandFromString(highCard))).toEqual({
      btCount: 5,
      btRanks: 10944,
      english: "High Card",
      handRank: 0,
    });
  });
});

describe.only("btCountToAnalysis", () => {
  it(`correctly counts`, () => {
    console.log(displayFloatAs64Bit(2052));
    const quads = "Jh Jc Jd Js 2h";
    const boat = "8h 8c 8d 9s 9h";
    const trips = "Ts Tc Td 4s Ad";
    const twoPair = "8s 8d Jc 9s 9d";
    const onePair = "Ts Td As Kd Jd";
    const qJJJJ2 = btCountToAnalysis(parseHandFromString(quads)[0]);
    expect(qJJJJ2).toEqual({ trips: [], pairs: [], quads: [J], kickers: [2] });
    const b88899 = btCountToAnalysis(parseHandFromString(boat)[0]);
    expect(b88899).toEqual({ trips: [8], pairs: [9], quads: [], kickers: [] });
    const tTTT4A = btCountToAnalysis(parseHandFromString(trips)[0]);
    expect(tTTT4A).toEqual({
      trips: [T],
      pairs: [],
      quads: [],
      kickers: [A, 4],
    });
    const tP9988J = btCountToAnalysis(parseHandFromString(twoPair)[0]);
    expect(tP9988J).toEqual({
      trips: [],
      pairs: [9, 8],
      quads: [],
      kickers: [J],
    });
    const pTTAKJ = btCountToAnalysis(parseHandFromString(onePair)[0]);
    expect(pTTAKJ).toEqual({
      trips: [],
      pairs: [T],
      quads: [],
      kickers: [A, K, J],
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
  xit(`correctly compares hands of the same rank by their kickers`, () => {
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
