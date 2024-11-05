import { TCell, TGrid } from "../types/types";

export const getChangeCellsActiveStatus = (
  grid: TGrid,
  action: "activate" | "deactivate",
  cellIds?: number[]
): TGrid => {
  // console.log("getChangeCellsActiveStatus");
  let changedCells: TCell[] = [];
  if (cellIds) {
    if (action === "activate") {
      changedCells = grid.map((cell) => ({
        ...cell,
        isActive: cellIds.includes(cell.id),
      }));
    } else {
      changedCells = grid.map((cell) => ({
        ...cell,
        isActive: !cellIds.includes(cell.id),
      }));
    }
  } else {
    if (action === "activate") {
      changedCells = grid.map((cell) => ({ ...cell, isActive: true }));
    } else {
      changedCells = grid.map((cell) => ({
        ...cell,
        isActive: false,
      }));
    }
  }
  return [...changedCells];
};
