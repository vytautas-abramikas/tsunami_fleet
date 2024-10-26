import { TGrid } from "../types/types";

export const isLastSegmentToSinkOnGrid = (grid: TGrid): boolean => {
  console.log("isLastSegmentToSinkOnGrid");
  const howManyShipCellsHitOrSunk: number = grid.reduce(
    (acc, cur) => acc + (cur.status === "sunk" || cur.status === "hit" ? 1 : 0),
    0
  );
  console.log("ship cells sunk: ", howManyShipCellsHitOrSunk);
  if (howManyShipCellsHitOrSunk === 19) {
    return true;
  } else return false;
};
