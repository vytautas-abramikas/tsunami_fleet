import { FLEET_COMPOSITION } from "../constants/FLEET_COMPOSITION";
import { TShip, TShips } from "../types/types";

export const getInitializeShips = (): TShips => {
  // console.log("getInitializeShips");
  const shipSizes = FLEET_COMPOSITION;
  const ships: TShip[] = shipSizes.map((size, index) => ({
    id: index + 1,
    size,
    segments: [],
  }));
  return ships;
};
