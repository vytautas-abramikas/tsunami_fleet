import { TShips, TGrid } from "../types/types";
import { getShipCells } from "./getShipCells";

export const isLastSegment = (
  cellId: number,
  ships: TShips,
  grid: TGrid
): boolean => {
  const shipId = grid.cells[cellId].shipId;
  const shipSegments = ships.list[shipId - 1].segments;
  const cells = getShipCells(shipId, ships, grid);
  const cellsHitLength = cells.reduce(
    (acc, cur) => acc + (cur.status === "hit" ? 1 : 0),
    0
  );
  if (shipSegments.length - cellsHitLength === 1) {
    return true;
  } else {
    return false;
  }
};
