import { TCell, TGrid } from "../types/types";

export const getChangeCellsActiveStatus = (
  grid: TGrid,
  action: "activate" | "deactivate",
  mode?: "include" | "exclude",
  cellIds?: number[]
): TGrid => {
  console.log("getChangeCellsActiveStatus");
  // console.log(JSON.stringify(grid));
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
  // console.log(changedCells.length);
  // console.log(JSON.stringify(changedCells));
  return [...changedCells];
};
