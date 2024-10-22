import { Combatant, TGrid, TShips } from "../types/types";
import { initializeGrid } from "./initializeGrid";

export const populateGrid = (owner: Combatant, ships: TShips): TGrid => {
  let grid = initializeGrid(owner);
  ships.list.forEach((ship) =>
    ship.segments.forEach((segment) => {
      grid.cells[segment].status = "ship";
      grid.cells[segment].shipId = ship.id;
    })
  );
  return grid;
};
