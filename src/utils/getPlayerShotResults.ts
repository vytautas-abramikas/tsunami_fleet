import { TCell, TGrid, TShips } from "../types/types";
import { isLastSegment } from "./isLastSegment";
import { getShipCells } from "./getShipCells";
import { getShipNeighborCells } from "./getShipNeighborCells";

export const getPlayerShotResults = (
  cellId: number,
  grid: TGrid,
  ships: TShips
): { playerHitStatus: "empty" | "hit" | "sunk"; cellsToProcess: TCell[] } => {
  let playerHitStatus: "empty" | "hit" | "sunk" = "empty";
  let cellsToProcess: TCell[] = [];
  const cell: TCell = grid[cellId];

  if (cell.id === cellId && !cell.isVisible) {
    if (cell.status === "ship") {
      if (isLastSegment(cellId, ships, grid)) {
        //if last ship segment is hit, mark all ship segments as sunk
        playerHitStatus = "sunk" as const;
        const sunkCells: TCell[] = getShipCells(cell.shipId, ships, grid).map(
          (cell) => ({
            ...cell,
            status: "sunk" as const,
            isVisible: true,
          })
        );
        //mark neighboring cells of a sunk ship as visible
        const revealedNeighbors: TCell[] = getShipNeighborCells(
          ships[cell.shipId - 1].segments,
          grid
        ).map((cell) => ({ ...cell, isVisible: true }));
        //merge all updated cells into one array
        cellsToProcess = [...sunkCells, ...revealedNeighbors];
      } else {
        //if the segment hit is not the last one of its ship
        playerHitStatus = "hit" as const;
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
      `Illegal action on player click, cellId:${cellId}, grid:${grid}, ships:${ships}`
    );
  }
  return { playerHitStatus: playerHitStatus, cellsToProcess: cellsToProcess };
};
