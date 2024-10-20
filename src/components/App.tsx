import { GameBoard } from "./GameBoard";

export const App: React.FC = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <GameBoard />
        <div className="flex flex-col h-44 pt-12">
          <p className="text-4xl font-bold text-white drop-shadow-lg">
            A message
          </p>
          <p className="text-4xl font-bold text-gray-300 drop-shadow-lg">
            B message
          </p>
          <p className="text-4xl font-bold text-gray-400 drop-shadow-lg">
            C message
          </p>
        </div>
        <div className="flex justify-center items-center pt-8 h-24">
          <button className="py-2 px-8 mr-4 ml-4 bg-indigo-600 hover:bg-indigo-700 hover:scale-110 transition duration-500 ease-out text-white font-bold text-2xl rounded-lg shadow-lg">
            Maybe
          </button>
          <button className="py-2 px-8 mr-4 ml-4 bg-green-600 hover:bg-green-700 hover:scale-110 transition duration-500 ease-out text-white font-bold text-2xl rounded-lg shadow-lg">
            Yes
          </button>
          <button className="py-2 px-8 mr-4 ml-4 bg-red-600 hover:bg-red-700 hover:scale-110 transition duration-500 ease-out text-white font-bold text-2xl rounded-lg shadow-lg">
            No
          </button>
        </div>
      </main>
    </>
  );
};
