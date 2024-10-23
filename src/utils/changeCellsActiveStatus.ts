import { TCell, TGrid } from "../types/types";

export const changeCellsActiveStatus = (
  grid: TGrid,
  action: "activate" | "deactivate",
  mode?: "include" | "exclude",
  cellIds?: number[]
): TGrid => {
  console.log("changeCellsActiveStatus");
  let changedCells: TCell[] = [];
  if (mode && cellIds) {
    if (action === "activate") {
      if (mode === "include") {
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
      if (mode === "include") {
        changedCells = grid.map((cell) => ({
          ...cell,
          isActive: !cellIds.includes(cell.id),
        }));
      } else {
        changedCells = grid.map((cell) => ({
          ...cell,
          isActive: cellIds.includes(cell.id),
        }));
      }
    }
  } else {
    if (action === "activate") {
      changedCells = grid.map((cell) => ({ ...cell, isActive: true }));
    } else {
      changedCells = grid.map((cell) => ({ ...cell, isActive: false }));
    }
  }
  return [...changedCells];
};
