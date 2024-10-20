import { useState, useEffect } from "react";
import { useGameContext } from "../hooks/useGameContext";

export const MessageConsole: React.FC = () => {
  const { messages } = useGameContext();

  const [triggerEffect, setTriggerEffect] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setTriggerEffect(true);
      setTimeout(() => setTriggerEffect(false), 500); // Match the animation duration
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-44 pt-8 space-y-2">
      <div className="flex items-center justify-center h-12 w-full">
        <p
          className={`text-4xl font-bold drop-shadow-lg truncate leading-relaxed ${
            triggerEffect ? "new-message" : ""
          } ${messages.length > 0 ? messages[0].tailwindClasses : ""}`}
        >
          {messages.length > 0 ? messages[0].text : null}
        </p>
      </div>
      <div className="flex items-center justify-center h-12 w-full">
        <p
          className={`text-4xl font-bold drop-shadow-lg truncate leading-relaxed text-opacity-50 ${
            messages.length > 1 ? messages[1].tailwindClasses : ""
          }`}
        >
          {messages.length > 1 ? messages[1].text : null}
        </p>
      </div>
      <div className="flex items-center justify-center h-12 w-full">
        <p
          className={`text-4xl font-bold drop-shadow-lg truncate leading-relaxed text-opacity-25 ${
            messages.length > 2 ? messages[2].tailwindClasses : ""
          } leading-relaxed`}
        >
          {messages.length > 2 ? messages[2].text : null}
        </p>
      </div>
    </div>
  );
};
