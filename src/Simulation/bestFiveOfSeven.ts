import nPickK from "../utils/nChooseK";
import classicEvaluator from "../hands/classicEvaluator";

const combos = nPickK(7, 5);
export const getAllCombos = (sevenCardHand: string) => {
  const handToArr: string[] = sevenCardHand.split(" ");
  const output: string[] = [];
  for (let combo of combos) {
    output.push(combo.map((i: number): string => handToArr[i]).join(" "));
  }
  return output;
};
const bestFiveOfSeven = (sevenCardHand: string) => {
  const hands = getAllCombos(sevenCardHand);
  let best: string | null = null;
  for (const hand of hands) {
    if (best === null || classicEvaluator(hand, best) > 0) {
      best = hand;
    }
  }
  return best;
};

export default bestFiveOfSeven;
