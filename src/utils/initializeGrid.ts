import { TCell, TGrid } from "../types/types";

export const initializeGrid = (owner: "User" | "Browser"): TGrid => {
  console.log(`${owner}' grid initializing`);
  const cells: TCell[] = Array.from({ length: 100 }, (_, i) => {
    return {
      id: i,
      isVisible: owner === "Browser" ? false : true,
      status: "empty",
      shipId: 0,
    };
  });
  return { owner, cells };
};
