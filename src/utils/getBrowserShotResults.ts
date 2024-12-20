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
): { browserHitStatus: "empty" | "hit" | "sunk"; cellsToProcess: TCell[] } => {
  let browserHitStatus: "empty" | "hit" | "sunk" = "empty";
  let cellsToProcess: TCell[] = [];
  let cellToHitId: number;

  const cellsHitIds = grid
    .filter((cell) => cell.status === "hit")
    .map((hitCell) => hitCell.id);
  //there is a ship hit but not sunk on grid
  if (cellsHitIds.length > 0) {
    const potentialTargetIds = getAdjacentHitCandidates(
      "Player",
      grid,
      cellsHitIds
    );
    cellToHitId = getRandomIdFromList(potentialTargetIds);
  } else {
    //shooting randomly at any unknown cell
    const unknownCellsIds = grid
      .filter((cell) => !cell.isVisibleToBrowser)
      .map((unknownCell) => unknownCell.id);
    cellToHitId = getRandomIdFromList(unknownCellsIds);
  }
  //when cell to hit is known, check its status and determine what to do next
  //missed, return the cell uncovered
  if (grid[cellToHitId].status === "empty") {
    browserHitStatus = "empty";
    cellsToProcess = [
      { ...grid[cellToHitId], isVisible: true, isVisibleToBrowser: true },
    ];
    //if it is a ship cell
  } else if (grid[cellToHitId].status === "ship") {
    //hit the ship but didn't sink it, return the hit cell and uncover it
    const lastSegment = isLastSegment(cellToHitId, ships, grid);
    if (lastSegment) {
      //hit the ship and sunk it, return the sunk cells and uncover its neighbors
      const shipId = grid[cellToHitId].shipId;
      browserHitStatus = "sunk";
      const sunkCells = getShipCells(shipId, ships, grid).map((cell) => ({
        ...cell,
        status: browserHitStatus,
        isVisible: true,
        isVisibleToBrowser: true,
      }));
      const revealedNeighbors: TCell[] = getShipNeighborCells(
        ships[shipId - 1].segments,
        grid
      ).map((cell) => ({ ...cell, isVisible: true, isVisibleToBrowser: true }));

      cellsToProcess = [...sunkCells, ...revealedNeighbors];
    } else {
      browserHitStatus = "hit";
      cellsToProcess = [
        {
          ...grid[cellToHitId],
          isVisible: true,
          isVisibleToBrowser: true,
          status: browserHitStatus,
        },
      ];
    }
  }
  return { browserHitStatus, cellsToProcess };
};
