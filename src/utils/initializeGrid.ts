import { TPoint, TCell, TGrid } from "../types/types";

export const initializeGrid = (owner: "User" | "Browser"): TGrid => {
  const cells: TCell[] = Array.from({ length: 100 }, (_, i) => {
    const pos: TPoint = { x: i % 10, y: Math.floor(i / 10) };
    return {
      id: i,
      pos,
      isVisible: false,
      status: "empty",
    };
  });
  return { owner, cells };
};
