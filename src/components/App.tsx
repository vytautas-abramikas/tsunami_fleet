import { useGameContext } from "../hooks/useGameContext";
import { Welcome } from "./Welcome";
import { ButtonBoard } from "./ButtonBoard";
import { GameBoard } from "./GameBoard";
import { MessageConsole } from "./MessageConsole";
import { Copyright } from "./Copyright";
import { useMemo } from "react";

export const App: React.FC = () => {
  const { appState } = useGameContext();

  const showWelcome: boolean = useMemo(() => {
    if (appState === "Welcome") {
      return true;
    } else {
      return false;
    }
  }, [appState]);

  const showGameBoard: boolean = useMemo(() => {
    if (
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
      appState === "BattleOver"
    ) {
      return true;
    } else {
      return false;
    }
  }, [appState]);

  return (
    <>
      <main className="font-sans text-white flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-animation">
        {showWelcome && <Welcome />}
        {showGameBoard && <GameBoard />}
        <MessageConsole />
        <ButtonBoard />
        <Copyright />
      </main>
    </>
  );
};
