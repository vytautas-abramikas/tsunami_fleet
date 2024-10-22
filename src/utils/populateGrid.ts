import { TCombatant, TGrid, TShips } from "../types/types";
import { initializeGrid } from "./initializeGrid";

export const populateGrid = (owner: TCombatant, ships: TShips): TGrid => {
  let grid = initializeGrid(owner);
  ships.list.forEach((ship) =>
    ship.segments.forEach((segment) => {
      grid.cells[segment].status = "ship";
      grid.cells[segment].shipId = ship.id;
    })
  );
  return grid;
};
