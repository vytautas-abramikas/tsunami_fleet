import { TCell, TShips, TGrid } from "../types/types";

export const getShipCells = (
  shipId: number,
  ships: TShips,
  grid: TGrid
): TCell[] => {
  const shipSegments = ships.list[shipId - 1].segments;
  return shipSegments.map((seg) => grid.cells[seg]);
};
