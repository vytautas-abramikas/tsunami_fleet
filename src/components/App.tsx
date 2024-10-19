import { GameBoard } from "./GameBoard";

export const App: React.FC = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <h1 className="text-4xl font-bold mb-8 text-yellow-300">A message</h1>
        <GameBoard />
      </main>
    </>
  );
};
