import { TCell, TGrid, TShips } from "../types/types";
import { getAdjacentHitCandidates } from "./getAdjacentHitCandidates";
import { isLastSegment } from "./isLastSegment";
import { getShipCells } from "./getShipCells";
import { getShipNeighborCells } from "./getShipNeighborCells";

const getRandomIdFromList = (list: number[]): number => {
  return list[Math.floor(Math.random() * list.length)];
};

export const getBrowserShotResults = (
  grid: TGrid,
  ships: TShips
): { status: "empty" | "hit" | "sunk"; cells: TCell[] } => {
  let status: "empty" | "hit" | "sunk" = "empty"; // just for now, cause TS!!!!!!!
  let cells: TCell[] = [];
  let cellToHitId: number;

  const cellsHitIds = grid
    .filter((cell) => cell.status === "hit")
    .map((hitCell) => hitCell.id);
  //there is a ship hit but not sunk on grid
  if (cellsHitIds.length > 0) {
    const potentialTargetIds = getAdjacentHitCandidates(grid, cellsHitIds);
    cellToHitId = getRandomIdFromList(potentialTargetIds);
  } else {
    //shooting randomly at any unknown cell
    const unknownCellsIds = grid
      .filter((cell) => !cell.isVisible)
      .map((unknownCell) => unknownCell.id);
    cellToHitId = getRandomIdFromList(unknownCellsIds);
  }
  //when cell to hit is known, check its status and determine what to do next
  //missed, return the cell uncovered
  if (grid[cellToHitId].status === "empty") {
    status = "empty";
    cells = [{ ...grid[cellToHitId], isVisible: true }];
    //if it is a ship cell
  } else if (grid[cellToHitId].status === "ship") {
    //hit the ship but didn't sink it, return the hit cell and uncover it
    if (isLastSegment(cellToHitId, ships, grid)) {
      //hit the ship and sunk it, return the sunk cells and uncover its neighbors
      const shipId = grid[cellToHitId].shipId;
      const sunkCells = getShipCells(shipId, ships, grid).map((cell) => ({
        ...cell,
        status: "sunk" as "sunk",
        isVisible: true,
      }));
      const revealedNeighbors: TCell[] = getShipNeighborCells(
        shipId,
        ships,
        grid
      ).map((cell) => ({ ...cell, isVisible: true }));
      status = "sunk";
      cells = [...sunkCells, ...revealedNeighbors];
    } else {
      status = "hit";
      cells = [{ ...grid[cellToHitId], isVisible: true, status: status }];
    }
  }
  return { status, cells };
};
