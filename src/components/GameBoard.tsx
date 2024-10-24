import { useGameContext } from "../hooks/useGameContext";
import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  const { appState } = useGameContext();

  const showBrowserGrid: boolean =
    appState === "BattleStart" ||
    appState === "Battle" ||
    appState === "BattleOver";
  return (
    <>
      <div
        className={`grid ${
          showBrowserGrid ? "grid-cols-2 gap-24" : "grid-cols-1"
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">User</h2>
          <Grid owner="User" />
        </div>
        {showBrowserGrid && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">Browser</h2>
            <Grid owner="Browser" />
          </div>
        )}
      </div>
    </>
  );
};
