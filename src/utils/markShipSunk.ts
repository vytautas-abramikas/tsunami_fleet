import { TShip, TShips } from "../types/types";

export const markShipSunk = (shipId: number, ships: TShips): TShip => ({
  ...ships.list[shipId - 1],
  sunk: true,
});
