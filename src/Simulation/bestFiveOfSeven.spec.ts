import bestFiveOfSeven, { getAllCombos } from "./bestFiveOfSeven";
import { shuffler } from "../shuffler";

const shuffleInTwo = (fiveString: string, twoString: string): string =>
  shuffler(fiveString.split(" ").concat(twoString.split(" "))).join(" ");

const royal = "As Ks Qs Js Ts";
const sevenRoyal = shuffleInTwo(royal, "Th Qh");
const straightFlush = "4s 5s 7s 6s 3s";
const sevenStraightFlush = shuffleInTwo(straightFlush, "2s 4h");
const steelWheel = "Ah 3h 5h 4h 2h";
const sevenSteelWheel = shuffleInTwo(steelWheel, "6s Ac");
const quads = "Jh Jc Jd Js 2c";
const sevenQuads = shuffleInTwo(quads, "2s 2h");
const boat = "8h 8c 8d 9s 9h";
const sevenBoat = shuffleInTwo(boat, "7s 7c");
const flush = "Ah Kh 9h 3h 2h";
const sevenFlush = shuffleInTwo(flush, "7s 7c");
const straight = "4s 5c 7c 6s 3h";
const sevenStraight = shuffleInTwo(straight, "7s 7d");
const wheel = "2s Ac 4s 3s 5d";
const sevenWheel = shuffleInTwo(wheel, "Ad As");
const trips = "Ts Tc Td 4s Ad";
const sevenTrips = shuffleInTwo(trips, "3d 2d");
const twoPair = "8s 8d Jc 9s 9d";
const sevenTwoPair = shuffleInTwo(twoPair, "2c 2d");
const onePair = "6s 6d As Kd Jd";
const sevenOnePair = shuffleInTwo(onePair, "9d 8h");
const highCard = "Ks Js 9s 7s 6d";
const sevenHighCard = shuffleInTwo(highCard, "4c 2c");

describe("getAllCombos", () => {
  it("gets all combos of a seven card hand", () => {
    const hands = getAllCombos(sevenRoyal)
      .map((combo) => combo.split(" ").sort().join(" "))
      .sort();
    expect(hands).toEqual([
      "As Js Ks Qh Qs",
      "As Js Ks Qh Th",
      "As Js Ks Qh Ts",
      "As Js Ks Qs Th",
      "As Js Ks Qs Ts",
      "As Js Ks Th Ts",
      "As Js Qh Qs Th",
      "As Js Qh Qs Ts",
      "As Js Qh Th Ts",
      "As Js Qs Th Ts",
      "As Ks Qh Qs Th",
      "As Ks Qh Qs Ts",
      "As Ks Qh Th Ts",
      "As Ks Qs Th Ts",
      "As Qh Qs Th Ts",
      "Js Ks Qh Qs Th",
      "Js Ks Qh Qs Ts",
      "Js Ks Qh Th Ts",
      "Js Ks Qs Th Ts",
      "Js Qh Qs Th Ts",
      "Ks Qh Qs Th Ts",
    ]);
  });
});
describe("bestFiveOfSeven", () => {
  it("returns the best five card hand out of seven", () => {
    expect(bestFiveOfSeven(sevenRoyal.split(" ").sort().join(" "))).toBe(
      royal.split(" ").sort().join(" ")
    );
    expect(
      bestFiveOfSeven(sevenStraightFlush.split(" ").sort().join(" "))
    ).toBe(straightFlush.split(" ").sort().join(" "));
    expect(bestFiveOfSeven(sevenSteelWheel.split(" ").sort().join(" "))).toBe(
      steelWheel.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenQuads.split(" ").sort().join(" "))).toBe(
      quads.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenBoat.split(" ").sort().join(" "))).toBe(
      boat.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenFlush.split(" ").sort().join(" "))).toBe(
      flush.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenStraight.split(" ").sort().join(" "))).toBe(
      straight.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenWheel.split(" ").sort().join(" "))).toBe(
      wheel.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenTrips.split(" ").sort().join(" "))).toBe(
      trips.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenTwoPair.split(" ").sort().join(" "))).toBe(
      twoPair.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenOnePair.split(" ").sort().join(" "))).toBe(
      onePair.split(" ").sort().join(" ")
    );
    expect(bestFiveOfSeven(sevenHighCard.split(" ").sort().join(" "))).toBe(
      highCard.split(" ").sort().join(" ")
    );
  });
});
