import { createContext, useState, ReactNode } from "react";
import { TGrid, TGameContext, TShips, TMessage } from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";
import { initializeShips } from "../utils/initializeShips";
import { generateShips } from "../utils/generateShips";
import { populateGrid } from "../utils/populateGrid";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userShips, setUserShips] = useState<TShips>(initializeShips("User"));
  const [userGrid, setUserGrid] = useState<TGrid>(initializeGrid("User"));

  const generatedShips = generateShips("Browser");
  const [browserShips, setBrowserShips] = useState<TShips>(generatedShips);
  const [browserGrid, setBrowserGrid] = useState<TGrid>(
    populateGrid("Browser", generatedShips)
  );

  const [messages, setMessages] = useState<TMessage[]>([]);

  const addMessage = (newMessage: TMessage) => {
    const text = newMessage.text;
    const tailwindClasses = newMessage.tailwindClasses || "text-white";
    setMessages((prevMessages) => {
      const updatedMessages = [{ text, tailwindClasses }, ...prevMessages];
      if (updatedMessages.length > 3) {
        updatedMessages.pop();
      }
      return updatedMessages;
    });
  };

  return (
    <GameContext.Provider
      value={{
        userGrid,
        browserGrid,
        userShips,
        browserShips,
        messages,
        setUserGrid,
        setBrowserGrid,
        setUserShips,
        setBrowserShips,
        addMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
