import isEqual from "lodash/isEqual";
import Card from "../deck/Card";

export interface HandRanking {
  handRank: number;
  values: number[];
}

export const HandRanks = {
  HighCard: 0,
  Pair: 1,
  TwoPair: 2,
  ThreeOfAKind: 3,
  Straight: 4,
  Flush: 5,
  FullHouse: 6,
  FourOfAKind: 7,
  StraightFlush: 8,
};

const WHEEL: number[] = [3, 2, 1, 0, 12];

// mutates hand. Sorts from biggest value to smallest
export const sortHand = (cards: Card[]): Card[] =>
  cards.sort((a, b) => b.value - a.value);

export const isInSequence = (cards: Card[]): boolean => {
  for (let i = 0, l = cards.length; i < l - 1; i++) {
    if (cards[i].value - 1 !== cards[i + 1].value) {
      return false;
    }
  }
  return true;
};

export const isWheel = (hand: Card[]): boolean =>
  isEqual(
    WHEEL,
    hand
      .slice(1)
      .map((card: Card) => card.value)
      .concat(hand[0].value)
  );

export const isStraight = (hand: Card[]): boolean => {
  return isInSequence(hand) || isWheel(hand);
};

export const isFlush = (hand: Card[]): boolean => {
  const target = hand[0].suit;
  return hand.every((card) => card.suit === target);
};

export const isStraightFlush = (hand: Card[]): boolean =>
  isStraight(hand) && isFlush(hand);

export const catalogHand = (hand: Card[]): Record<number, number> =>
  hand.reduce((pv: Record<number, number>, card: Card) => {
    pv[card.value] = (pv[card.value] || 0) + 1;
    return pv;
  }, {});

export const evaluateHand = (hand: Card[]): HandRanking => {
  sortHand(hand); // mutates hand.
  const catalog = catalogHand(hand);
  // five cards of different ranks. Must be a straight, flush, straight flush, or high card.
  if (Object.keys(catalog).length === 5) {
    if (isWheel(hand)) {
      const isSteelWheel = isFlush(hand);
      return {
        handRank: isSteelWheel ? HandRanks.StraightFlush : HandRanks.Straight,
        values: WHEEL,
      };
    }
    if (isStraightFlush(hand)) {
      return {
        handRank: HandRanks.StraightFlush,
        values: hand.map((card: Card) => card.value),
      };
    }
    if (isFlush(hand)) {
      return {
        handRank: HandRanks.Flush,
        values: hand.map((card: Card) => card.value),
      };
    }
    if (isInSequence(hand)) {
      return {
        handRank: HandRanks.Straight,
        values: hand.map((card: Card) => card.value),
      };
    }
    return {
      handRank: HandRanks.HighCard,
      values: hand.map((card: Card) => card.value),
    };
  }
  const catalogValues = Object.values(catalog);
  // four of a kind;
  if (catalogValues.includes(4)) {
    const quadVal = hand[2].value; // logically, arr 1, 2, 3 must be 3 of the 4.
    const kickerVal = hand[0].value !== quadVal ? hand[0].value : hand[4].value;
    return {
      handRank: HandRanks.FourOfAKind,
      values: [quadVal, quadVal, quadVal, quadVal, kickerVal],
    };
  }
  // Full Houses & Sets
  if (catalogValues.includes(3)) {
    const tripsValue = hand[2].value; // logically hand[2] must be the trips.
    // full house
    if (catalogValues.includes(2)) {
      const pairValue =
        hand[3].value !== tripsValue ? hand[3].value : hand[1].value;
      return {
        handRank: HandRanks.FullHouse,
        values: [tripsValue, tripsValue, tripsValue, pairValue, pairValue],
      };
    } else {
      // trips
      return {
        handRank: HandRanks.ThreeOfAKind,
        values: [
          tripsValue,
          tripsValue,
          tripsValue,
          ...hand
            .filter((card: Card) => card.value !== tripsValue)
            .map((card: Card) => card.value),
        ],
      };
    }
  }
  // Two Pair & Pair
  const numPairs = catalogValues.reduce(
    (pv: number, cv: number) => (cv === 2 ? pv + 1 : pv),
    0
  );
  // Two Pair
  if (numPairs === 2) {
    const highPairValue = hand[1].value;
    const lowPairValue = hand[3].value;
    return {
      handRank: HandRanks.TwoPair,
      values: [
        highPairValue,
        highPairValue,
        lowPairValue,
        lowPairValue,
        ...hand
          .filter(
            (card: Card) => ![highPairValue, lowPairValue].includes(card.value)
          )
          .map((card: Card) => card.value),
      ],
    };
  }
  // one pair and the default (because high card is handled above);
  const kickers = Object.keys(catalog)
    .map((k) => k.toString())
    .filter((key: string) => catalog[parseInt(key, 10)] !== 2)
    .map(parseInt);
  return {
    handRank: HandRanks.Pair,
    values: [
      ...hand
        .filter((card: Card) => !kickers.includes(card.value))
        .map((card: Card) => card.value),
      ...hand
        .filter((card: Card) => kickers.includes(card.value))
        .map((card: Card) => card.value),
    ],
  };
};

export default evaluateHand;
