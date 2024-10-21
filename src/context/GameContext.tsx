import { createContext, useState, useEffect, ReactNode } from "react";
import { TGrid, TGameContext, TShips, TMessage, TCell } from "../types/types";
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

  const updateGrid = (owner: "User" | "Browser", updatedCells: TCell[]) => {
    if (owner === "User") {
      setUserGrid((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          cells: prev.cells.map(
            (cell) =>
              updatedCells.find((updated) => updated.id === cell.id) || cell
          ),
        };
      });
    } else {
      setBrowserGrid((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          cells: prev.cells.map(
            (cell) =>
              updatedCells.find((updated) => updated.id === cell.id) || cell
          ),
        };
      });
    }
  };

  const addMessage = (newMessage: TMessage) => {
    const text = newMessage.text;
    const classes = newMessage.classes || "text-white";
    setMessages((prevMessages) => {
      const updatedMessages = [{ text, classes }, ...prevMessages];
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
        setUserShips,
        setBrowserShips,
        updateGrid,
        addMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
