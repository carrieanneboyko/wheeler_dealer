import { SingleSimulation } from "./Simulation";
import { formatHandFromString } from "../utils/shorthand";
const simulateLive = async () => {
  const singleSimulation = new SingleSimulation(
    ["A♥ A♣", "K♦ K♠", "A♦ A♠"].map(formatHandFromString)
  );
  const equities = await singleSimulation.calcEquity();
  console.log(equities);
  return equities;
};

const runner = async () => {
  const timer = Date.now();
  await simulateLive();
  console.log(`Executed in ${Date.now() - timer}`);
};

runner();
