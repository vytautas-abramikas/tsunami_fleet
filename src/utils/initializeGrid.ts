import { TCell, TGrid } from "../types/types";

export const initializeGrid = (): TGrid => {
  console.log("initializeGrid");
  const cells: TCell[] = Array.from({ length: 100 }, (_, i) => {
    return {
      id: i,
      isVisible: false,
      status: "empty",
      shipId: 0,
      isActive: true,
    };
  });
  return cells;
};
