import { TCell, TGrid, TShip } from "../types/types";
import { getShipNeighborCells } from "./getShipNeighborCells";

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
    const neighbors: TCell[] = getShipNeighborCells(
      shipToProcess.segments,
      grid
    );
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
