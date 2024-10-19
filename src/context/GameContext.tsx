import { createContext, useState, ReactNode } from "react";
import { TGrid, TGameContext } from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userGrid, setUserGrid] = useState<TGrid>(initializeGrid("User"));
  const [browserGrid, setBrowserGrid] = useState<TGrid>(
    initializeGrid("Browser")
  );

  return (
    <GameContext.Provider
      value={{ userGrid, browserGrid, setUserGrid, setBrowserGrid }}
    >
      {children}
    </GameContext.Provider>
  );
};
