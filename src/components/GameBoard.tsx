import { useGameContext } from "../hooks/useGameContext";
import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  const { appState, activeCombatant, userGrid, browserGrid } = useGameContext();

  const isBattle: boolean =
    appState === "BattleStart" ||
    appState === "Battle" ||
    appState === "BattlePause" ||
    appState === "BattleOver";
  return (
    <>
      <div
        className={`grid ${isBattle ? "grid-cols-2 gap-24" : "grid-cols-1"}`}
      >
        <div className="flex flex-col items-center justify-center">
          <h2
            className={`font-bold mb-4 drop-shadow-lg h-10 ${
              isBattle && activeCombatant === "User"
                ? "text-yellow-300 text-3xl"
                : "text-white text-2xl"
            }`}
          >
            User
          </h2>
          <Grid owner="User" grid={userGrid} />
        </div>
        {isBattle && (
          <div className="flex flex-col items-center justify-center">
            <h2
              className={`font-bold mb-4 drop-shadow-lg h-10 ${
                isBattle && activeCombatant === "Browser"
                  ? "text-yellow-300 text-3xl"
                  : "text-white text-2xl"
              }`}
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
