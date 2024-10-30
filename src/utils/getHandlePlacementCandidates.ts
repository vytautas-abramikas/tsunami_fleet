import { TGrid } from "../types/types";
import { getChangeCellsActiveStatus } from "./getChangeCellsActiveStatus";
import { getNextShipSegmentCandidates } from "./getNextShipSegmentCandidates";

export const getHandlePlacementCandidates = (
  grid: TGrid,
  shipCellIds?: number[]
): TGrid => {
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
