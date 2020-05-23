import { handRanksToBitwise, countOfEachRank } from "./bitwiseEvaluator";

const A = 14;
const K = 13;
const Q = 12;
const J = 11;
const T = 10;

export const displayIntAs16Bit = (x: number): string => {
  const bitwise = x.toString(2).split("");
  while (bitwise.length < 16) {
    bitwise.unshift("0");
  }
  return `${bitwise.slice(0, 4).join("")} ${bitwise
    .slice(4, 8)
    .join("")} ${bitwise.slice(8, 12).join("")} ${bitwise.slice(12).join("")}`;
};
export const displayFloatAs64Bit = (x: number): string => {
  const bitwise = x.toString(2).split("");
  while (bitwise.length < 64) {
    bitwise.unshift("0");
  }
  return bitwise
    .join("")
    .replace(/(\d{4})/g, "$1 ")
    .replace(/(^\s+|\s+$)/, "");
};

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
  describe("countOfEachHandRank", () => {
    it("magically counts each rank", () => {
      const broadway = [A, K, Q, J, T];
      const twoPair = [8, 8, J, 9, 9];
      expect(displayFloatAs64Bit(countOfEachRank(broadway))).toBe(
        "0000 0001 0001 0001 0001 0001 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
      );
      expect(displayFloatAs64Bit(countOfEachRank(twoPair))).toBe(
        "0000 0000 0000 0000 0001 0000 0011 0011 0000 0000 0000 0000 0000 0000 0000 0000"
      );
    });
  });
});
