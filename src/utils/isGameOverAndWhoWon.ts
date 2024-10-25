import { TCombatant, TGrid } from "../types/types";

export const isGameOverAndWhoWon = (
  userGrid: TGrid,
  browserGrid: TGrid
): { isGameOver: boolean; whoWon: TCombatant | null } => {
  const howManyBrowserShipCellsSunk: number = browserGrid.reduce(
    (acc, cur) => acc + (cur.status === "sunk" ? 1 : 0),
    0
  );
  if (howManyBrowserShipCellsSunk === 20) {
    return { isGameOver: true, whoWon: "User" };
  }
  const howManyUserShipCellsSunk: number = userGrid.reduce(
    (acc, cur) => acc + (cur.status === "sunk" ? 1 : 0),
    0
  );
  if (howManyUserShipCellsSunk === 20) {
    return { isGameOver: true, whoWon: "Browser" };
  }
  return { isGameOver: false, whoWon: null };
};
