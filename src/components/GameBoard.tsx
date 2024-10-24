import { useGameContext } from "../hooks/useGameContext";
import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  const { appState, activeCombatant } = useGameContext();

  const isBattle: boolean =
    appState === "BattleStart" ||
    appState === "Battle" ||
    appState === "BattleOver";
  return (
    <>
      <div
        className={`grid ${isBattle ? "grid-cols-2 gap-24" : "grid-cols-1"}`}
      >
        <div className="flex flex-col items-center justify-center">
          <h2
            className={`font-bold mb-4 drop-shadow-lg ${
              isBattle && activeCombatant === "User"
                ? "text-yellow-300 text-3xl"
                : "text-white text-2xl"
            }`}
          >
            User
          </h2>
          <Grid owner="User" />
        </div>
        {isBattle && (
          <div className="flex flex-col items-center justify-center">
            <h2
              className={`font-bold mb-4 drop-shadow-lg ${
                isBattle && activeCombatant === "Browser"
                  ? "text-yellow-300 text-3xl"
                  : "text-white text-2xl"
              }`}
            >
              Browser
            </h2>
            <Grid owner="Browser" />
          </div>
        )}
      </div>
    </>
  );
};
