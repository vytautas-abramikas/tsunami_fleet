export const FLEET_COMPOSITION: number[] = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

export const SHIP_CELLS_ON_GRID: number = FLEET_COMPOSITION.reduce(
  (acc, curr) => acc + curr,
  0
);
