import { createContext, useState, ReactNode } from "react";
import { TGrid, TGameContext, TShips } from "../types/types";
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
