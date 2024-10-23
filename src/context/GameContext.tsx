import { createContext, useState, useEffect, ReactNode } from "react";
import {
  TGrid,
  TGameContext,
  TShips,
  TMessage,
  TCell,
  TButtonProps,
  TShip,
  TCombatant,
  TAppState,
} from "../types/types";
import { initializeGrid } from "../utils/initializeGrid";
import { initializeShips } from "../utils/initializeShips";
import { generateShips } from "../utils/generateShips";
import { populateGrid } from "../utils/populateGrid";
import { changeCellsActiveStatus } from "../utils/changeCellsActiveStatus";
import { getAllShipsCellsSetVisible } from "../utils/getAllShipsCellsSetVisible";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<TAppState>("Welcome");
  const [activeCombatant, setActiveCombatant] = useState<TCombatant>("User");
  const [userShips, setUserShips] = useState<TShips | null>(null);
  const [userGrid, setUserGrid] = useState<TGrid | null>(null);
  const [browserShips, setBrowserShips] = useState<TShips | null>(null);
  const [browserGrid, setBrowserGrid] = useState<TGrid | null>(null);
  const [buttons, setButtons] = useState<TButtonProps[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);

  // Initialize the state once
  useEffect(() => {
    setNewUserGrid();
    setRandomBrowserGrid();
    setButtons(initialButtons);
  }, []);

  //Actions on appState change
  useEffect(() => {
    if (appState === "PlacementGenerate" && userGrid) {
      console.log("PlacementGenerate");
      deactivateGrid("User");
      setRandomUserGrid();
    }
  }, [appState]);

  //Setter for grid, updating some cells
  const updateGrid = (owner: TCombatant, updatedCells: TCell[]) => {
    const setGrid = owner === "User" ? setUserGrid : setBrowserGrid;

    setGrid((prev) => {
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
  };
  //Wrapper for 2 setter functions, sets an updated ship into state
  const updateShip = (owner: TCombatant, updatedShip: TShip) => {
    const setShips = owner === "User" ? setUserShips : setBrowserShips;

    setShips((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        list: prev.list.map((ship) =>
          ship.id === updatedShip.id ? updatedShip : ship
        ),
      };
    });
  };

  const deactivateGrid = (owner: TCombatant) => {
    let deactivatedGrid: TGrid = { owner: owner, cells: [] };
    if (owner === "User" && userGrid) {
      deactivatedGrid = changeCellsActiveStatus(userGrid, "deactivate");
      setUserGrid(deactivatedGrid);
    } else if (browserGrid) {
      deactivatedGrid = changeCellsActiveStatus(browserGrid, "deactivate");
      setBrowserGrid(deactivatedGrid);
    }
  };

  const setRandomUserGrid = () => {
    if (userGrid) {
      const generatedUserShips = generateShips("User");
      const populatedUserGrid = populateGrid("User", generatedUserShips);
      const gridWithShipsVisible = getAllShipsCellsSetVisible(
        generatedUserShips,
        populatedUserGrid
      );
      updateGrid("User", gridWithShipsVisible);
    }
  };

  const setNewUserGrid = () => {
    const initialUserShips = initializeShips("User");
    const initialUserGrid = initializeGrid("User");
    setUserShips(initialUserShips);
    setUserGrid(initialUserGrid);
  };

  const setRandomBrowserGrid = () => {
    const initialBrowserShips = generateShips("Browser");
    const initialBrowserGrid = populateGrid("Browser", initialBrowserShips);
    setBrowserShips(initialBrowserShips);
    setBrowserGrid(initialBrowserGrid);
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

  const initialButtons: TButtonProps[] = [
    {
      text: "Maybe",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setAppState,
      args: ["PlacementGenerate"],
    },
    {
      text: "Yes",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: addMessage,
      args: [{ text: "Yes" }],
    },
    {
      text: "No",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: addMessage,
      args: [{ text: "No" }],
    },
  ];

  if (!userGrid || !browserGrid || !userShips || !browserShips) {
    return (
      <main className="bg-gradient-to-r from-purple-500 to-blue-900 text-white flex flex-col items-center justify-center min-h-screen overflow-hidden"></main>
    );
  }

  return (
    <GameContext.Provider
      value={{
        appState,
        activeCombatant,
        userGrid,
        browserGrid,
        userShips,
        browserShips,
        messages,
        buttons,
        setAppState,
        setActiveCombatant,
        updateShip,
        updateGrid,
        addMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
