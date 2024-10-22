import { Combatant, TCell, TGrid } from "../types/types";

export const initializeGrid = (owner: Combatant): TGrid => {
  console.log(`${owner}' grid initializing`);
  const cells: TCell[] = Array.from({ length: 100 }, (_, i) => {
    return {
      id: i,
      isVisible: false,
      status: "empty",
      shipId: 0,
      isActive: true,
    };
  });
  return { owner, cells };
};
