import { TCell, TGrid } from "../types/types";

export const initializeGrid = (owner: "User" | "Browser"): TGrid => {
  const cells: TCell[] = Array.from({ length: 100 }, (_, i) => {
    return {
      id: i,
      isVisible: owner === "User" ? false : true,
      status: "empty",
    };
  });
  return { owner, cells };
};
