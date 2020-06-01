import evaluate from "./fillBoard";
import { performance } from "perf_hooks";

const runSim1 = () =>
  new Promise((resolve, reject) => {
    console.log(`Running first simulation: Amarillo Slim`);
    const hand1 = "Js Ts";
    const hand2 = "Ac Kd";
    const hand3 = "4h 4d";
    console.log("starting timer: Classic Evaluation");
    const start = performance.now();
    try {
      const result = evaluate([hand1, hand2, hand3]);
      console.log(
        `Classic Evaluation time: ${(performance.now() - start) / 1000}seconds`
      );
      resolve(result);
    } catch (err) {
      console.error(`Error: ${err}, canot evaluate`);
      reject(err);
    }
  });

const runSim2 = () =>
  new Promise((resolve, reject) => {
    console.log(`Running first simulation: Amarillo Slim`);
    const hand1 = "Js Ts";
    const hand2 = "Ac Kd";
    const hand3 = "4h 4d";
    console.log("starting timer: Bitwise Evaluation");
    const start = performance.now();
    try {
      const result = evaluate([hand1, hand2, hand3], undefined, true);
      console.log(
        `Bitwise Evaluation time: ${(performance.now() - start) / 1000}seconds`
      );
      resolve(result);
    } catch (err) {
      console.error(`Error: ${err}, canot evaluate`);
      reject(err);
    }
  });

runSim1()
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .then(runSim2)
  .then((result) => {
    console.log(JSON.stringify(result));
    return;
  });
