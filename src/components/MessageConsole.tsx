import { useState, useEffect } from "react";
import { useGameContext } from "../hooks/useGameContext";

export const MessageConsole: React.FC = () => {
  const { messages } = useGameContext();

  const [triggerEffect, setTriggerEffect] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      setTriggerEffect(true);
      setTimeout(() => setTriggerEffect(false), 200); // Match the animation duration
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-44 pt-8 space-y-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className="flex items-center justify-center h-12 w-full"
        >
          <p
            className={`text-3xl drop-shadow-lg truncate leading-relaxed ${
              index === 0 && triggerEffect ? "new-message" : ""
            } ${
              index === 1
                ? "text-opacity-50"
                : index === 2
                ? "text-opacity-25"
                : ""
            } ${message.classes || "text-white font-semibold"}`}
          >
            {message.text}
          </p>
        </div>
      ))}
    </div>
  );
};
