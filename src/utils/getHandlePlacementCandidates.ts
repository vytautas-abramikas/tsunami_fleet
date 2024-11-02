import { TGrid } from "../types/types";
import { getChangeCellsActiveStatus } from "./getChangeCellsActiveStatus";
import { getNextShipSegmentCandidates } from "./getNextShipSegmentCandidates";

//Clears candidates and then either activates the grid for placement of a next segment (if no cell ids of an unfinished ship are provided) or calculates
//and sets new candidates (given current ship cell ids) and then activates the grid for placement of a next segment
export const getHandlePlacementCandidates = (
  grid: TGrid,
  shipCellIds?: number[]
): TGrid => {
  // console.log("getHandlePlacementCandidates");
  let updatedGrid: TGrid = [];
  const gridWithClearedCandidates = grid.map((cell) => ({
    ...cell,
    status: cell.status === "candidate" ? "empty" : cell.status,
  }));
  if (!shipCellIds) {
    updatedGrid = getChangeCellsActiveStatus(
      gridWithClearedCandidates,
      "activate"
    );
  } else {
    const candidateIds = getNextShipSegmentCandidates(
      gridWithClearedCandidates,
      shipCellIds
    );
    const gridWithNewCandidates = gridWithClearedCandidates.map((cell) =>
      candidateIds.includes(cell.id)
        ? { ...cell, status: "candidate" as const }
        : { ...cell }
    );
    updatedGrid = getChangeCellsActiveStatus(
      gridWithNewCandidates,
      "activate",
      candidateIds
    );
  }
  return [...updatedGrid];
};
