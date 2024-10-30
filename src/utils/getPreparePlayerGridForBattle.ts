import { TCell, TGrid } from "../types/types";

export const getPreparePlayerGridForBattle = (grid: TGrid): TCell[] => {
  //   console.log("getPreparePlayerGridForBattle");
  return grid.map((cell) => ({
    ...cell,
    isVisible: cell.status === "ship",
    isActive: false,
  }));
};
