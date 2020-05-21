import { evaluateHand } from "./evaluateHand";

import { isCandidateBetter, findHandThatPlays } from "./compareHands";
import { displayHand, shortHand } from "../utils/shorthand";

describe("isCandidateBetter", () => {
  it("returns -1 if the candidate does not beat the other card", () => {
    expect(
      isCandidateBetter(
        {
          handRank: 1,
          values: [11, 11, 12, 4, 2],
        },
        {
          handRank: 0,
          values: [12, 11, 10, 4, 2],
        }
      )
    ).toBe(-1);
    // difference in rank.
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("K♠ K♦ 6♥ A♣ 4♠")),
        evaluateHand(shortHand("K♠ Q♦ 6♥ A♣ 4♠"))
      )
    ).toBe(-1);
    // difference in kickers
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("A♠ Q♦ 6♥ 3♣ 4♠")),
        evaluateHand(shortHand("K♠ Q♦ 6♥ 7♣ 4♠"))
      )
    ).toBe(-1);
    // kickers play even with quads!
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("K♠ 4♥ 4♦ 4♣ 4♠")),
        evaluateHand(shortHand("Q♠ 4♥ 4♦ 4♣ 4♠"))
      )
    ).toBe(-1);
  });
  it("returns 0 if the candidate ties", () => {
    expect(
      isCandidateBetter(
        {
          handRank: 1,
          values: [11, 11, 12, 10, 9],
        },
        {
          handRank: 1,
          values: [11, 11, 12, 10, 9],
        }
      )
    ).toBe(0);
    // difference in rank.
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("K♠ K♦ 6♥ A♣ 4♠")),
        evaluateHand(shortHand("K♠ K♥ 6♥ A♣ 4♠"))
      )
    ).toBe(0);
    // difference in kickers
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("A♠ Q♠ 6♠ 3♠ 4♠")),
        evaluateHand(shortHand("A♥ Q♥ 6♥ 3♥ 4♥"))
      )
    ).toBe(0);
    // kickers play even with quads!
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("Q♠ 4♥ 4♦ 4♣ 4♠")),
        evaluateHand(shortHand("Q♠ 4♥ 4♦ 4♣ 4♠"))
      )
    ).toBe(0);
  });
  it("returns 1 if the candidate is better", () => {
    // difference in rank.
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("K♠ Q♦ 6♥ A♣ 4♠")),
        evaluateHand(shortHand("K♠ K♦ 6♥ A♣ 4♠"))
      )
    ).toBe(1);
    // difference in kickers
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("K♠ Q♦ 6♥ 7♣ 4♠")),
        evaluateHand(shortHand("A♠ Q♦ 6♥ 3♣ 4♠"))
      )
    ).toBe(1);
    // kickers play even with quads!
    expect(
      isCandidateBetter(
        evaluateHand(shortHand("Q♠ 4♥ 4♦ 4♣ 4♠")),
        evaluateHand(shortHand("K♠ 4♥ 4♦ 4♣ 4♠"))
      )
    ).toBe(1);
  });
});

describe("findHandThatPlays", () => {
  it("takes board cards and hole cards and finds the hand that plays", () => {
    const board = shortHand("A♠ Q♦ 6♥ 3♣ 4♠");
    expect(findHandThatPlays(board, shortHand("A♥ 3♥"))).toMatchInlineSnapshot(`
      Object {
        "evaluation": Object {
          "handRank": 2,
          "values": Array [
            12,
            12,
            1,
            1,
            10,
          ],
        },
        "playedHand": Array [
          Card {
            "display": "A♠",
            "index": 12,
            "rank": "A",
            "suit": "♠",
            "value": 12,
          },
          Card {
            "display": "A♥",
            "index": 25,
            "rank": "A",
            "suit": "♥",
            "value": 12,
          },
          Card {
            "display": "Q♦",
            "index": 36,
            "rank": "Q",
            "suit": "♦",
            "value": 10,
          },
          Card {
            "display": "3♣",
            "index": 40,
            "rank": "3",
            "suit": "♣",
            "value": 1,
          },
          Card {
            "display": "3♥",
            "index": 14,
            "rank": "3",
            "suit": "♥",
            "value": 1,
          },
        ],
      }
    `);
    expect(displayHand(findHandThatPlays(board, shortHand("Q♥ K♥")).playedHand))
      .toMatchInlineSnapshot(`
      Array [
        "A♠",
        "K♥",
        "Q♦",
        "Q♥",
        "6♥",
      ]
    `);
    expect(displayHand(findHandThatPlays(board, shortHand("4♥ 4♥")).playedHand))
      .toMatchInlineSnapshot(`
      Array [
        "A♠",
        "Q♦",
        "4♠",
        "4♥",
        "4♥",
      ]
    `);
    expect(displayHand(findHandThatPlays(board, shortHand("5♥ 7♥")).playedHand))
      .toMatchInlineSnapshot(`
      Array [
        "7♥",
        "6♥",
        "5♥",
        "4♠",
        "3♣",
      ]
    `);
  });
});
