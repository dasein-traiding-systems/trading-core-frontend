export const getRatio = (v1: number | undefined, v2: number | undefined): number => {
  if (v1 !== undefined && v2 !== undefined && v2 > 0) {
    return Math.round(((v1 - v2) * 100) / 100 / v2);
  }
  return 0;
};

// getBgDownClass(ratio, [10, 5, 4, 3, 2, 1, 0.5]
export const getBgDownClass = (value: number, levels: number[], color: string = "red"): string => {
  for (let i = 1; i < levels.length - 1; i++) {
    if (levels[i + 1] <= value && value < levels[i - 1]) {
      return `${color}${i + 1}`;
    }
  }

  return "";
};

export const getBgUpClass = (value: number, levels: number[], color: string = "red"): string => {
  if (value >= levels[levels.length - 1]) return `${color}${levels.length}`;
  for (let i = 1; i < levels.length - 1; i++) {
    if (levels[i + 1] > value && value >= levels[i - 1]) {
      return `${color}${i + 1}`;
    }
  }

  return "";
};
