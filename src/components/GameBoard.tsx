import { useMemo } from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  const { appState, activeCombatant, playerGrid, browserGrid } =
    useGameContext();

  const isBattle: boolean = useMemo(() => {
    if (
      appState === "BattleStart" ||
      appState === "Battle" ||
      appState === "BattlePause" ||
      appState === "BattleOver"
    ) {
      return true;
    } else {
      return false;
    }
  }, [appState]);

  const hidePlayerTitle: boolean = useMemo(() => {
    if (
      appState === "PlacementStart" ||
      appState === "PlacementEmpty" ||
      appState === "PlacementFirstSegment" ||
      appState === "PlacementAdditionalSegment" ||
      appState === "PlacementFinalize" ||
      appState === "PlacementGenerate"
    ) {
      return true;
    } else {
      return false;
    }
  }, [appState]);

  return (
    <>
      <div
        className={`grid ${isBattle ? "grid-cols-2 gap-24" : "grid-cols-1"}`}
      >
        <div className="flex flex-col items-center justify-center">
          <h2
            className={`flex items-end font-bold mb-4 drop-shadow-lg h-10 ${
              hidePlayerTitle ? "opacity-0" : ""
            } ${
              isBattle && activeCombatant === "Player"
                ? "text-yellow-300 text-3xl"
                : "text-white text-2xl"
            }`}
          >
            Player
          </h2>
          <Grid owner="Player" grid={playerGrid} />
        </div>
        {isBattle && (
          <div className="flex flex-col items-center justify-center">
            <h2
              className={`flex items-end font-bold mb-4 drop-shadow-lg h-10 relative ${
                isBattle && activeCombatant === "Browser"
                  ? "text-yellow-300 text-3xl"
                  : "text-white text-2xl"
              }`}
            >
              Browser
              {isBattle && activeCombatant === "Player" && (
                <span className="absolute top-4 right-[-2rem] text-sm text-blue-200 border-2 rounded-full border-blue-200 flex items-center justify-center w-5 h-5 hover:text-blue-400 hover:border-blue-400 hover:cursor-pointer">
                  ?
                </span>
              )}
            </h2>
            <Grid owner="Browser" grid={browserGrid} />
          </div>
        )}
      </div>
    </>
  );
};
