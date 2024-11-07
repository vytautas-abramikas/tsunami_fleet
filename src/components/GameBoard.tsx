import { useGameContext } from "../hooks/useGameContext";
import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  const { appState, activeCombatant, playerGrid, browserGrid } =
    useGameContext();

  const hidePlayerTitle: boolean =
    appState === "PlacementStart" ||
    appState === "PlacementEmpty" ||
    appState === "PlacementFirstSegment" ||
    appState === "PlacementAdditionalSegment" ||
    appState === "PlacementFinalize" ||
    appState === "PlacementGenerate";

  const isBattle: boolean =
    appState === "BattleStart" ||
    appState === "Battle" ||
    appState === "BattlePause";

  const isBattleOver: boolean = appState === "BattleOver";

  const isShowBothGrids: boolean = isBattle || isBattleOver;

  const playerTitleClasses: string = hidePlayerTitle
    ? "opacity-0"
    : isBattle
    ? activeCombatant === "Player"
      ? "text-white"
      : "text-white opacity-50"
    : isBattleOver
    ? activeCombatant === "Player"
      ? "text-yellow-300"
      : "text-[#8B0000]"
    : "";

  const browserTitleClasses: string = isBattle
    ? activeCombatant === "Browser"
      ? "text-white"
      : "text-white opacity-50"
    : isBattleOver
    ? activeCombatant === "Browser"
      ? "text-yellow-300"
      : "text-[#8B0000]"
    : "";

  return (
    <>
      <div className={`grid-custom ${isShowBothGrids ? "two-columns" : ""}`}>
        <div className="flex flex-col items-center justify-center">
          <h2
            className={`flex items-end font-bold mb-4 drop-shadow-lg h-10 text-3xl ${playerTitleClasses}`}
          >
            Player
          </h2>
          <Grid owner="Player" grid={playerGrid} />
        </div>
        {isShowBothGrids && (
          <div className="flex flex-col items-center justify-center">
            <h2
              className={`flex items-end font-bold mb-4 drop-shadow-lg h-10 text-3xl ${browserTitleClasses}`}
            >
              Browser
            </h2>
            <Grid owner="Browser" grid={browserGrid} />
          </div>
        )}
      </div>
    </>
  );
};
