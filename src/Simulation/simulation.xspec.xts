import { SingleSimulation } from "./Simulation";
import { formatHandFromString } from "../utils/shorthand";

describe("SingleSimulation", () => {
  describe("Known flop, 3 hands", () => {
    it("runs a single simulation given fixed hands but unknown board cards", async () => {
      const singleSimulation = new SingleSimulation(
        ["A♥ A♣", "K♦ K♠", "A♦ A♠"].map(formatHandFromString)
      );
      expect(singleSimulation.hands).toHaveLength(3);
      expect(singleSimulation.deadCards).toHaveLength(6);
      formatHandFromString("3♠ Q♠ 9♣").forEach(singleSimulation.addBoardCard);
      expect(singleSimulation.board).toHaveLength(3);
      expect(singleSimulation.deadCards).toHaveLength(9);

      await singleSimulation.simulateBoard();
      expect(singleSimulation.simulationResults).toHaveLength(903);

      const equities = await singleSimulation.calcEquity();
      expect(equities).toEqual({
        "0": 0.4258028792912514,
        "1": 0.10852713178294573,
        "2": 0.46566998892580286,
      });
      console.log(
        "FLOATING POINT",
        Object.values(equities).reduce((pv, cv) => pv + cv, 0)
      );
      expect(
        Object.values(equities).reduce((pv, cv) => pv + cv, 0)
      ).toBeCloseTo(1.0, 5);
    });
  });
  describe("No board, 3 hands...", () => {
    it("runs a single simulation given fixed hands but unknown board cards", async () => {
      jest.setTimeout(300000); // five minutes. Usually takes around 4 minutes
      const singleSimulation = new SingleSimulation(
        ["A♥ A♣", "K♦ K♠", "A♦ A♠"].map(formatHandFromString)
      );
      expect(singleSimulation.hands).toHaveLength(3);
      expect(singleSimulation.deadCards).toHaveLength(6);
      expect(singleSimulation.board).toHaveLength(0);

      await singleSimulation.simulateBoard();
      expect(singleSimulation.simulationResults).toHaveLength(903);

      const equities = await singleSimulation.calcEquity();
      expect(equities).toEqual({
        "0": 0.40077626376916586,
        "1": 0.2042997260388614,
        "2": 0.3949240101919315,
      });

      expect(
        Object.values(equities).reduce((pv, cv) => pv + cv, 0)
      ).toBeCloseTo(1.0, 5);
    });
  });
});
