import { TCombatant } from "../types/types";

export const getWhoGetsFirstTurn = (): TCombatant => {
  const roll: number = Math.floor(Math.random() * 2);
  return roll === 0 ? "User" : "Browser";
};
