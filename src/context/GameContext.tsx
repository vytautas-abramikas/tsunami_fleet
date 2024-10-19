import { createContext, useState, ReactNode } from "react";
import { TGrid, TGameContext, TShips } from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";
import { initializeShips } from "../utils/initializeShips";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userGrid, setUserGrid] = useState<TGrid>(initializeGrid("User"));
  const [browserGrid, setBrowserGrid] = useState<TGrid>(
    initializeGrid("Browser")
  );
  const [userShips, setUserShips] = useState<TShips>(initializeShips("User"));
  const [browserShips, setBrowserShips] = useState<TShips>(
    initializeShips("Browser")
  );

  return (
    <GameContext.Provider
      value={{
        userGrid,
        browserGrid,
        userShips,
        browserShips,
        setUserGrid,
        setBrowserGrid,
        setUserShips,
        setBrowserShips,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
