import { useGameContext } from "../hooks/useGameContext";

export const ButtonBoard: React.FC = () => {
  const { addMessage } = useGameContext();

  return (
    <div className="flex justify-center items-center pt-8 h-24">
      <button
        onClick={() => addMessage({ text: "Maybe" })}
        className="py-2 px-8 mr-4 ml-4 bg-indigo-600 hover:bg-indigo-700 hover:scale-110 transition duration-500 ease-out text-white text-center font-bold text-2xl rounded-lg shadow-lg"
      >
        Maybe
      </button>
      <button
        onClick={() => addMessage({ text: "Yes" })}
        className="py-2 px-8 mr-4 ml-4 bg-green-600 hover:bg-green-700 hover:scale-110 transition duration-500 ease-out text-white text-center font-bold text-2xl rounded-lg shadow-lg"
      >
        Yes
      </button>
      <button
        onClick={() => addMessage({ text: "No" })}
        className="py-2 px-8 mr-4 ml-4 bg-red-600 hover:bg-red-700 hover:scale-110 transition duration-500 ease-out text-white text-center font-bold text-2xl rounded-lg shadow-lg"
      >
        No
      </button>
    </div>
  );
};