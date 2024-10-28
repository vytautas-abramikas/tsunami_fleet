import { TCell, TGrid, TShips } from "../types/types";
import { isLastSegment } from "./isLastSegment";
import { getShipCells } from "./getShipCells";
import { getShipNeighborCells } from "./getShipNeighborCells";

export const getUserShotResults = (
  cellId: number,
  grid: TGrid,
  ships: TShips
): { userHitStatus: "empty" | "hit" | "sunk"; cellsToProcess: TCell[] } => {
  let userHitStatus: "empty" | "hit" | "sunk" = "empty";
  let cellsToProcess: TCell[] = [];
  const cell: TCell = grid[cellId];

  if (cell.id === cellId && !cell.isVisible) {
    if (cell.status === "ship") {
      if (isLastSegment(cellId, ships, grid)) {
        //if last ship segment is hit, mark all ship segments as sunk
        // console.log(
        //   "User shooting, last segment of a ship detected, cellId: ",
        //   cellId
        // );
        userHitStatus = "sunk" as const;
        const sunkCells: TCell[] = getShipCells(cell.shipId, ships, grid).map(
          (cell) => ({
            ...cell,
            status: "sunk" as const,
            isVisible: true,
          })
        );
        //mark neighboring cells of a sunk ship as visible
        const revealedNeighbors: TCell[] = getShipNeighborCells(
          cell.shipId,
          ships,
          grid
        ).map((cell) => ({ ...cell, isVisible: true }));
        //merge all updated cells into one array
        cellsToProcess = [...sunkCells, ...revealedNeighbors];
      } else {
        //if the segment hit is not the last one of its ship
        userHitStatus = "hit" as const;
        const updatedCell = {
          ...cell,
          status: "hit" as const,
          isVisible: true,
        };
        cellsToProcess = [updatedCell];
      }
    } else {
      //if an empty cell is hit, just reveal it
      const updatedCell = { ...cell, isVisible: true };
      cellsToProcess = [updatedCell];
    }
  } else {
    console.error(
      `Illegal action on user click, cellId:${cellId}, grid:${grid}, ships:${ships}`
    );
  }
  return { userHitStatus: userHitStatus, cellsToProcess: cellsToProcess };
};
