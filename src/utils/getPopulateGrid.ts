import { TGrid, TShips } from "../types/types";
import { getInitializeGrid } from "./getInitializeGrid";

export const getPopulateGrid = (ships: TShips): TGrid => {
  // console.log("getPopulateGrid");
  let grid = getInitializeGrid();
  ships.forEach((ship) =>
    ship.segments.forEach((segment) => {
      grid[segment].status = "ship";
      grid[segment].shipId = ship.id;
    })
  );
  return grid;
};
