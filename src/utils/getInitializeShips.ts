import { TShip, TShips } from "../types/types";

export const getInitializeShips = (): TShips => {
  console.log("getInitializeShips");
  const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  const ships: TShip[] = shipSizes.map((size, index) => ({
    id: index + 1,
    size,
    segments: [],
  }));
  return ships;
};
