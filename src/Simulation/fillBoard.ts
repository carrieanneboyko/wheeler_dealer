import without from "lodash/without";
import DECK from "../deck";

export const findRemainingCardsInDeck = (
  hands: string[],
  board?: string
): string[] => {
  const allDeadCards: string[] = [...hands, board]
    .filter((x) => !!x)
    .join(" ")
    .split(" ");
  return without(DECK, ...allDeadCards);
};
