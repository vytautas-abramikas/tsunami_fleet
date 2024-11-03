import { TCell, TGrid } from "../types/types";

export const getShipNeighborCells = (
  cellIds: number[],
  grid: TGrid
): TCell[] => {
  // console.log("getShipNeighborCells");
  const indices = new Set<number>();

  for (const index of cellIds) {
    const x = index % 10;
    const y = Math.floor(index / 10);

    const adjacentIndices = [
      index - 11,
      index - 10,
      index - 9,
      index - 1,
      index + 1,
      index + 9,
      index + 10,
      index + 11,
    ];

    for (const adj of adjacentIndices) {
      const adjX = adj % 10;
      const adjY = Math.floor(adj / 10);
      if (
        // this filters out false adjacents in edge cases and given cellIds indices
        adj >= 0 &&
        adj < 100 &&
        Math.abs(adjX - x) <= 1 &&
        Math.abs(adjY - y) <= 1 &&
        (grid[adj].status === "empty" || grid[adj].status === "candidate") &&
        !cellIds.includes(adj)
      ) {
        indices.add(adj);
      }
    }
  }
  const uniqueIndices = [...indices];
  return uniqueIndices.map((i) => ({ ...grid[i] }));
};
