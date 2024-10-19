import { createContext, useState, ReactNode, useEffect, useRef } from "react";
import { TGrid, TGameContext, TShips } from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";
import { initializeShips } from "../utils/initializeShips";
import { placeShips } from "../utils/placeShips";

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

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      console.log("Initializing browser ships and placing them on grid...");
      const gridWithShips = placeShips(browserGrid, browserShips);
      setBrowserGrid(gridWithShips);
      setBrowserShips({ owner: "Browser", list: browserShips.list });
      console.log(JSON.stringify(browserShips));
      isMounted.current = true;
    }
  }, []);

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
