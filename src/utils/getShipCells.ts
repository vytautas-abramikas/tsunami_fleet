import { TCell, TShips, TGrid } from "../types/types";

export const getShipCells = (
  shipId: number,
  ships: TShips,
  grid: TGrid
): TCell[] => {
  console.log("getShipCells");
  const shipSegments = ships[shipId - 1].segments;
  return shipSegments.map((seg) => grid[seg]);
};
