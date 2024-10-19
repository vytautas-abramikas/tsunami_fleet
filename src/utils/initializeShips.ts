import { TShip, TShips } from "../types/types";

export const initializeShips = (owner: "User" | "Browser"): TShips => {
  const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  const list: TShip[] = shipSizes.map((size, index) => ({
    id: index,
    size,
    segments: [],
    sunk: false,
  }));
  return { owner, list };
};
