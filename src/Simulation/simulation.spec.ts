import { SingleSimulation } from "./Simulation";
import { formatHandFromString } from "../utils/shorthand";

describe("SingleSimulation", () => {
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
    expect(singleSimulation.simulationResults).toHaveLength(1672);

    const equities = await singleSimulation.calcEquity();
    expect(equities).toEqual({
      "0": 0.2299641148325359,
      "1": 0.05861244019138756,
      "2": 0.25149521531100477,
    });
  });
});
