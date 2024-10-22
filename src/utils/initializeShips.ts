import { TShip, TShips } from "../types/types";

export const initializeShips = (owner: "User" | "Browser"): TShips => {
  console.log(`${owner}' ships initializing`);
  const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  const list: TShip[] = shipSizes.map((size, index) => ({
    id: index + 1,
    size,
    segments: [],
    sunk: false,
  }));
  return { owner, list };
};
