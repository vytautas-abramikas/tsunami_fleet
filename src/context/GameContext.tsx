import { createContext, useState, ReactNode } from "react";
import { TGrid, TGameContext, TShips } from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";
import { initializeShips } from "../utils/initializeShips";
import { placeShips } from "../utils/placeShips";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userGrid, setUserGrid] = useState<TGrid>(initializeGrid("User"));
  const [userShips, setUserShips] = useState<TShips>(initializeShips("User"));

  let initialBrowsergrid = initializeGrid("Browser");
  let initialBrowserShips = initializeShips("Browser");
  initialBrowsergrid = placeShips(initialBrowsergrid, initialBrowserShips);

  const [browserGrid, setBrowserGrid] = useState<TGrid>(initialBrowsergrid);

  const [browserShips, setBrowserShips] = useState<TShips>(initialBrowserShips);

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
