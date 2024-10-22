import { useGameContext } from "../hooks/useGameContext";
import { Grid } from "./Grid";

export const GameBoard: React.FC = () => {
  const { appState } = useGameContext();

  const hideBrowserGrid: boolean =
    appState === "PlacementStart" ||
    appState === "PlacementGenerate" ||
    appState === "PlacementFirstSegment" ||
    appState === "PlacementAdditionalSegments" ||
    appState === "PlacementFinalize";
  return (
    <>
      <div
        className={`grid ${
          hideBrowserGrid ? "grid-cols-1" : "grid-cols-2 gap-24"
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">User</h2>
          <Grid owner="User" />
        </div>
        {!hideBrowserGrid && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">Browser</h2>
            <Grid owner="Browser" />
          </div>
        )}
      </div>
    </>
  );
};
