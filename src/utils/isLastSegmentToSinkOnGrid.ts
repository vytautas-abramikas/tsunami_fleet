import { SHIP_CELLS_ON_GRID } from "../constants/FLEET_COMPOSITION";
import { TGrid } from "../types/types";

export const isLastSegmentToSinkOnGrid = (grid: TGrid): boolean => {
  // console.log("isLastSegmentToSinkOnGrid");
  const howManyShipCellsHitOrSunk: number = grid.reduce(
    (acc, curr) =>
      acc + (curr.status === "sunk" || curr.status === "hit" ? 1 : 0),
    0
  );
  if (howManyShipCellsHitOrSunk === SHIP_CELLS_ON_GRID - 1) {
    return true;
  } else return false;
};
