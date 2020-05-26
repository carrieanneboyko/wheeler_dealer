import classicEvaluator from "./classicEvaluator";
import bitwiseEvaluator from "./bitwiseEvaluator";
import { performance } from "perf_hooks";
import fs from "fs";

let hands: string[] = [];

const loadHands = (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    fs.readFile("100000hands.txt", "UTF-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.split(/\r?\n/).filter((s) => s.length > 0));
    });
  });

describe("performance", () => {
  beforeAll(async () => {
    console.log("Loading Hands");
    hands = await loadHands();
    console.log("Done loading hands");
    return hands;
  });
  describe("classicEvaluator", () => {
    it("determines the best hand out of 100000 lines", () => {
      console.log("Starting Classic Evaluator");
      const start = performance.now();
      let best = "";
      for (let hand of hands) {
        if (best === "") {
          best = hand;
          continue;
        }
        let val = classicEvaluator(hand, best);
        if (val > 0) {
          best = hand;
        }
      }
      const end = performance.now();
      console.log(`Classic found best hand ${best} in ${end - start}`);
      expect(best).toBe(`5s 6s 7s 4s 8s`);
    });
  });
  describe("bitwiseEvaluator", () => {
    it("determines the best hand out of 100000 lines", () => {
      console.log("Starting Bitwise Evaluator");
      const start = performance.now();
      let best = "";
      for (let hand of hands) {
        if (best === "") {
          best = hand;
          continue;
        }
        let val = bitwiseEvaluator(hand, best);
        if (val > 0) {
          best = hand;
        }
      }
      const end = performance.now();
      console.log(`Bitwise found best hand ${best} in ${end - start}`);
      expect(best).toBe("5s 6s 7s 4s 8s");
    });
  });
});
