import { TCell, TGrid } from "../types/types";

export const changeCellsActiveStatus = (
  grid: TGrid,
  action: "activate" | "deactivate",
  mode?: "include" | "exclude",
  cellIds?: number[]
): TGrid => {
  let changedCells: TCell[] = [];
  if (mode && cellIds && cellIds.length) {
    if (action === "activate") {
      if (mode === "include") {
        changedCells = grid.cells.map((cell) => ({
          ...cell,
          isActive: cellIds.includes(cell.id),
        }));
      } else {
        changedCells = grid.cells.map((cell) => ({
          ...cell,
          isActive: !cellIds.includes(cell.id),
        }));
      }
    } else {
      if (mode === "include") {
        changedCells = grid.cells.map((cell) => ({
          ...cell,
          isActive: !cellIds.includes(cell.id),
        }));
      } else {
        changedCells = grid.cells.map((cell) => ({
          ...cell,
          isActive: cellIds.includes(cell.id),
        }));
      }
    }
  } else {
    if (action === "activate") {
      changedCells = grid.cells.map((cell) => ({ ...cell, isActive: true }));
    } else {
      changedCells = grid.cells.map((cell) => ({ ...cell, isActive: false }));
    }
  }
  return { ...grid, cells: changedCells };
};
