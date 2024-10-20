import { TGrid, TShips } from "../types/types";

export const populateGrid = (grid: TGrid, ships: TShips): TGrid => {
  ships.list.forEach((ship) =>
    ship.segments.forEach((segment) => {
      grid.cells[segment].status = "ship";
      grid.cells[segment].shipId = ship.id;
    })
  );
  return grid;
};
