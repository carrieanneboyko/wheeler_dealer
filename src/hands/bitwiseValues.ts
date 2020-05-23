const HAND_RANK = {
  highCard: 0,
  pair: 1,
  twoPair: 2,
  trips: 3,
  straight: 4,
  flush: 5,
  fullHouse: 6,
  quads: 7,
  straightFlush: 8,
};

export const valueHand = (value: number): number => {
  switch (value) {
    case 1:
      return HAND_RANK.quads;
    case 5:
      return HAND_RANK.highCard;
    case 6:
      return HAND_RANK.pair;
    case 7:
      return HAND_RANK.twoPair;
    case 9:
      return HAND_RANK.trips;
    case 10:
      return HAND_RANK.fullHouse;
    default:
      return -1;
  }
};
