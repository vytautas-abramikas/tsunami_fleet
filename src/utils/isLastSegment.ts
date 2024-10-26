import { TShips, TGrid } from "../types/types";
import { getShipCells } from "./getShipCells";

export const isLastSegment = (
  cellId: number,
  ships: TShips,
  grid: TGrid
): boolean => {
  // console.log("isLastSegment");
  const shipId = grid[cellId].shipId;
  const shipSegments = ships[shipId - 1].segments;
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
