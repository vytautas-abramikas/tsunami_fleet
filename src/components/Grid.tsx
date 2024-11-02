import { useMemo } from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCombatant, TGrid } from "../types/types";

export const Grid: React.FC<{ owner: TCombatant; grid: TGrid }> = ({
  owner,
  grid,
}) => {
  const { appState, activeCombatant, handlePlayerShot, handlePlayerPlacement } =
    useGameContext();

  const pointerStyle: string = useMemo(() => {
    if (appState === "Battle" || appState === "BattlePause") {
      if (activeCombatant === "Browser") {
        return "cursor-not-allowed";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }, [appState, activeCombatant]);

  const border: string = useMemo(() => {
    if (appState === "Battle" || appState === "BattlePause") {
      if (activeCombatant !== owner) {
        return "p-1 border-dashed border border-sky-500";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }, [appState, activeCombatant, owner]);

  const handleCellClick = (cellId: number) => {
    if (
      appState === "Battle" &&
      activeCombatant === "Player" &&
      owner === "Browser"
    ) {
      handlePlayerShot(cellId);
    } else if (
      appState === "PlacementFirstSegment" ||
      appState === "PlacementAdditionalSegment"
    ) {
      handlePlayerPlacement(cellId);
    }
  };

  return (
    <div
      key={owner}
      className={`grid grid-cols-10 gap-1 ${border} ${pointerStyle}`}
    >
      {grid.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
