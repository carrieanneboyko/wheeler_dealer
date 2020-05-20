// Fischer-yates shuffler & tools;

/* WARNING: Mutates Array */

export const throwNSidedDie = (dieSides: number, base: number = 0): number =>
  ~~(Math.random() * dieSides) + base;

export const shuffler = <T>(arr: Array<T>): Array<T> => {
  const l = arr.length;
  const switcher = (a: number, b: number): void => {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  };
  for (let i = 0; i < l; i++) {
    switcher(i, throwNSidedDie(l, 0));
  }
  return [...arr];
};
