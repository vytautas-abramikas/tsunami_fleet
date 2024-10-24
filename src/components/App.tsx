import { useGameContext } from "../hooks/useGameContext";
import { Welcome } from "./Welcome";
import { ButtonBoard } from "./ButtonBoard";
import { GameBoard } from "./GameBoard";
import { MessageConsole } from "./MessageConsole";

export const App: React.FC = () => {
  const { appState } = useGameContext();

  const showWelcome: boolean = appState === "Welcome";

  const showGameBoard: boolean =
    appState === "PlacementStart" ||
    appState === "PlacementGenerate" ||
    appState === "PlacementFirstSegment" ||
    appState === "PlacementAdditionalSegments" ||
    appState === "PlacementFinalize" ||
    appState === "Battle" ||
    appState === "BattleOver";
  return (
    <>
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {showWelcome && <Welcome />}
        {showGameBoard && <GameBoard />}
        <MessageConsole />
        <ButtonBoard />
      </main>
    </>
  );
};
