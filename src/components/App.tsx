import { useGameContext } from "../hooks/useGameContext";
import { Welcome } from "./Welcome";
import { ButtonBoard } from "./ButtonBoard";
import { GameBoard } from "./GameBoard";
import { MessageConsole } from "./MessageConsole";
import { Copyright } from "./Copyright";
import { StatsModal } from "./StatsModal";

export const App: React.FC = () => {
  const { appState, isStatsModalVisible } = useGameContext();

  const showGameBoard: boolean =
    appState === "PlacementStart" ||
    appState === "PlacementGenerate" ||
    appState === "PlacementEmpty" ||
    appState === "PlacementFirstSegment" ||
    appState === "PlacementTransition" ||
    appState === "PlacementAdditionalSegment" ||
    appState === "PlacementFinalize" ||
    appState === "BattleStart" ||
    appState === "Battle" ||
    appState === "BattlePause" ||
    appState === "BattleOver";

  return (
    <>
      <main className="font-sans text-white flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-animation">
        {appState === "Welcome" && <Welcome />}
        {showGameBoard && <GameBoard />}
        <MessageConsole />
        <ButtonBoard />
        <Copyright />
        {isStatsModalVisible && <StatsModal />}
      </main>
    </>
  );
};
