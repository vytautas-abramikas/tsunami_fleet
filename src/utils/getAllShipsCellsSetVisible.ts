import { TCell, TGrid, TShips } from "../types/types";

export const getAllShipsCellsSetVisible = (
  ships: TShips,
  grid: TGrid
): TCell[] => {
  let cells: TCell[] = [];
  ships.list.forEach((ship) =>
    ship.segments.forEach((segment) =>
      cells.push({ ...grid.cells[segment], isVisible: true })
    )
  );
  return cells;
};
