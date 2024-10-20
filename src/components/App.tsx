import { GameBoard } from "./GameBoard";

export const App: React.FC = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <GameBoard />
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold mt-8 pt-4 text-white drop-shadow-lg">
            A message
          </h2>
          <h2 className="text-4xl font-bold text-gray-300 drop-shadow-lg">
            B message
          </h2>
          <h2 className="text-4xl font-bold text-gray-400 drop-shadow-lg">
            C message
          </h2>
        </div>
        <div className="flex justify-center items-center mt-8">
          <button className="py-2 px-8 mr-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-2xl rounded-lg shadow-lg">
            Maybe
          </button>
          <button className="py-2 px-8 mr-8 bg-green-600 hover:bg-green-700 text-white font-bold text-2xl rounded-lg shadow-lg">
            Yes
          </button>
          <button className="py-2 px-8 mr-8 bg-red-600 hover:bg-red-700 text-white font-bold text-2xl rounded-lg shadow-lg">
            No
          </button>
        </div>
      </main>
    </>
  );
};
