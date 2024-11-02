import { TCell, TGrid, TShip } from "../types/types";
//Provides a list of neighboring empty cells (or still marked as candidates) to uncover after ship placement is complete. Returns cells
const getNeighbors = (cellIds: number[], grid: TGrid): TCell[] => {
  const indices: number[] = [];

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
        indices.push(adj);
      }
    }
  }
  const uniqueIndices = [...new Set(indices)];
  return uniqueIndices.map((i) => ({ ...grid[i] }));
};

//Executed when Player clicks on grid to place a new segment, if it is the last segment, reveals neighboring cells and marks the segments as "ship",
//if it is not the last segment, marks the cell as "segment". Returns the updated ship and updated grid.
export const getPlayerPlacementResults = (
  cellId: number,
  currentShip: TShip,
  grid: TGrid
): {
  shipToProcess: TShip;
  cellsToProcess: TCell[];
} => {
  // console.log("getPlayerPlacementResults");
  const isLastShipSegment: boolean =
    currentShip.size - currentShip.segments.length === 1;
  let cellsToProcess: TCell[] = [];
  const shipToProcess: TShip = {
    ...currentShip,
    segments: [...currentShip.segments, cellId],
  };
  if (isLastShipSegment) {
    const shipCells: TCell[] = shipToProcess.segments.map((index) => ({
      ...grid[index],
      isVisible: true,
      status: "ship",
      shipId: currentShip.id,
    }));
    const neighbors: TCell[] = getNeighbors(shipToProcess.segments, grid);
    const revealedNeighbors = neighbors.map((cell) => ({
      ...cell,
      isVisible: true,
    }));
    cellsToProcess = [...shipCells, ...revealedNeighbors];
  } else {
    cellsToProcess = shipToProcess.segments.map((index) => ({
      ...grid[index],
      isVisible: true,
      status: "segment",
      shipId: currentShip.id,
    }));
  }

  return { shipToProcess, cellsToProcess };
};
