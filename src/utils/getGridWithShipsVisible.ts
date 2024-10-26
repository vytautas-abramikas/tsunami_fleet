import { TGrid } from "../types/types";

export const getGridWithShipsVisible = (grid: TGrid): TGrid => {
  // console.log("getGridWithShipsVisible");
  const gridWithShipsVisible = grid.map((cell) =>
    cell.status === "ship" ? { ...cell, isVisible: true } : cell
  );

  // console.log(JSON.stringify(gridWithShipsVisible));
  return gridWithShipsVisible;
};
