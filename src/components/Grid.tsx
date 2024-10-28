import React from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCombatant, TGrid } from "../types/types";

export const Grid: React.FC<{ owner: TCombatant; grid: TGrid }> = ({
  owner,
  grid,
}) => {
  const { appState, activeCombatant, handleUserShot } = useGameContext();

  const handleCellClick = (cellId: number) => {
    if (
      appState === "Battle" &&
      activeCombatant === "User" &&
      owner === "Browser"
    ) {
      handleUserShot(cellId);
    }
  };

  return (
    <div key={owner} className="grid grid-cols-10 gap-1">
      {grid.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
