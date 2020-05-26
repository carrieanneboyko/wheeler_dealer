const ranks: string[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];
const suits: string[] = ["s", "h", "d", "c"];

export const DECK: string[] = (() => {
  const d: string[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      d.push(`${rank}${suit}`);
    }
  }
  return d;
})();

export default DECK;
