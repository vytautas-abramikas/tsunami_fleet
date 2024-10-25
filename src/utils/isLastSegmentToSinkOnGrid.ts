import { TGrid } from "../types/types";

export const isLastSegmentToSinkOnGrid = (grid: TGrid): boolean => {
  console.log("isLastSegmentToSinkOnGrid");
  const howManyShipCellsSunk: number = grid.reduce(
    (acc, cur) => acc + (cur.status === "sunk" ? 1 : 0),
    0
  );
  console.log(howManyShipCellsSunk);
  if (howManyShipCellsSunk === 19) {
    return true;
  } else return false;
};
