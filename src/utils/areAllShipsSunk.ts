import { TShips } from "../types/types";

export const areAllShipsSunk = (ships: TShips): boolean => {
  return ships.list.every((ship) => ship.isSunk);
};
