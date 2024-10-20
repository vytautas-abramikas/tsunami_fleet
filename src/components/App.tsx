import { ButtonBoard } from "./ButtonBoard";
import { GameBoard } from "./GameBoard";
import { MessageConsole } from "./MessageConsole";

export const App: React.FC = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <GameBoard />
        <MessageConsole />
        <ButtonBoard />
      </main>
    </>
  );
};
