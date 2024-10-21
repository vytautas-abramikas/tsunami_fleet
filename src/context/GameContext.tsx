import { createContext, useState, useEffect, ReactNode } from "react";
import { TGrid, TGameContext, TShips, TMessage } from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";
import { initializeShips } from "../utils/initializeShips";
import { generateShips } from "../utils/generateShips";
import { populateGrid } from "../utils/populateGrid";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userShips, setUserShips] = useState<TShips | null>(null);
  const [userGrid, setUserGrid] = useState<TGrid | null>(null);
  const [browserShips, setBrowserShips] = useState<TShips | null>(null);
  const [browserGrid, setBrowserGrid] = useState<TGrid | null>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);

  // Initialize the state once
  useEffect(() => {
    const initialUserShips = initializeShips("User");
    const initialUserGrid = initializeGrid("User");
    const initialBrowserShips = generateShips("Browser");
    const initialBrowserGrid = populateGrid("Browser", initialBrowserShips);

    setUserShips(initialUserShips);
    setUserGrid(initialUserGrid);
    setBrowserShips(initialBrowserShips);
    setBrowserGrid(initialBrowserGrid);
  }, []);

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

  if (!userGrid || !browserGrid || !userShips || !browserShips) {
    return (
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden"></main>
    );
  }

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
