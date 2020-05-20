const nPickKCombinations = (n: number, k: number): number[][] => {
  let result: number[][] = [];
  let stack: number[] = [];
  const combine = (currentNumber: number): void => {
    if (stack.length === k) {
      let newCombo: number[] = stack.slice();
      result.push(newCombo);
      return;
    }
    if (currentNumber > n - 1) {
      return;
    }

    stack.push(currentNumber);
    combine(currentNumber + 1);
    stack.pop();
    combine(currentNumber + 1);
  };
  combine(0);
  return result;
};

export default nPickKCombinations;
