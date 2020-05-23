import { handRanksToBitwise, displayIntAs16Bit } from "./bitwiseEvaluator";

const A = 14;
const K = 13;
const Q = 12;
const J = 11;
const T = 10;

describe.only("bitwiseEvaluator", () => {
  describe("handRanksToBitwise()", () => {
    it("converts hand ranks to bitwise values", () => {
      const broadway = [A, K, Q, J, T];
      expect(displayIntAs16Bit(handRanksToBitwise(broadway))).toBe(
        "0111 1100 0000 0000"
      );
      const twoPair = [8, 8, J, 9, 9];
      expect(displayIntAs16Bit(handRanksToBitwise(twoPair))).toBe(
        "0000 1011 0000 0000"
      );
    });
  });
});
