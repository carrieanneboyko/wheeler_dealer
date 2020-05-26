import { shuffler } from "../shuffler";
import range from "lodash/range";
import fs from "fs";

const [A, K, Q, J, T] = [14, 13, 12, 11, 10];
const Deck = range(52);
const broadway = {
  [A]: "A",
  [K]: "K",
  [Q]: "Q",
  [J]: "J",
  [T]: "T",
};
const suits: Record<number, string> = {
  0: "s",
  1: "h",
  2: "d",
  3: "c",
};
const cardToString = (n: number): string => {
  let rank: number | string = (n % 13) + 2;
  if (rank > 9) {
    rank = broadway[rank];
  }
  const suit = suits[~~(n / 13)];
  return `${rank}${suit}`;
};

const makeHand = (): string => {
  const d = shuffler(Deck);
  return d.slice(0, 5).map(cardToString).join(" ");
};

const writeHands = (n: number) =>
  new Promise((resolve) => {
    const stream = fs.createWriteStream("hands.txt", { flags: "a" });
    for (let i = 0; i < n; i++) {
      const h = makeHand();
      stream.write(h + "\n");
    }
    resolve(stream.end);
  });
console.log("start");
writeHands(100000).then(() => console.log("end"));
