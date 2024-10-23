import { TCell, TGrid, TShips } from "../types/types";

export const getAllShipsCellsSetVisible = (
  ships: TShips,
  grid: TGrid
): TCell[] => {
  console.log("getAllShipsCellsSetVisible");
  let cells: TCell[] = [];
  ships.forEach((ship) =>
    ship.segments.forEach((segment) =>
      cells.push({ ...grid[segment], isVisible: true })
    )
  );
  // console.log(JSON.stringify(cells));
  return cells;
};
