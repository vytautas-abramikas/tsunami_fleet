import { useGameContext } from "../hooks/useGameContext";

export const ButtonBoard: React.FC = () => {
  const { appState, activeCombatant, buttons } = useGameContext();

  const onDisable: string =
    (appState === "Battle" || appState === "BattlePause") &&
    activeCombatant === "Browser"
      ? "pointer-events-none filter grayscale-[50%]"
      : "";

  return (
    <div className="flex justify-center items-center pt-8 h-24">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`py-2 px-8 mr-4 ml-4 hover:scale-110 transition duration-500 ease-out text-center font-bold text-2xl rounded-lg shadow-lg tshadow ${button.classes} ${onDisable}`}
          onClick={() => button.onClick(...(button.args || []))}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};
