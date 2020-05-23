import {
  countRanksBitwise,
  countDuplicatesBitwise,
  parseHandFromString,
} from "./bitwiseEvaluator";

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
      expect(displayFloatAs64Bit(countDuplicatesBitwise(broadway))).toBe(
        "0000 0001 0001 0001 0001 0001 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
      );
      const twoPair = [8, 8, J, 9, 9];
      expect(displayFloatAs64Bit(countDuplicatesBitwise(twoPair))).toBe(
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
