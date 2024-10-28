import { TCell, TShips, TGrid } from "../types/types";

export const getShipNeighborCells = (
  shipId: number,
  ships: TShips,
  grid: TGrid
): TCell[] => {
  const shipSegments = ships[shipId - 1].segments;
  // console.log("getShipNeighborCells");
  const indices = [];
  for (const index of shipSegments) {
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
        // this filters out false adjacents in edge cases
        adj >= 0 &&
        adj < 100 &&
        Math.abs(adjX - x) <= 1 &&
        Math.abs(adjY - y) <= 1 &&
        grid[adj].status === "empty"
      ) {
        indices.push(adj);
      }
    }
  }
  const uniqueIndices = [...new Set(indices)];
  return uniqueIndices.map((i) => ({ ...grid[i] }));
};
