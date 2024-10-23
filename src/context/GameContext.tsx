import { createContext, useState, useEffect, ReactNode } from "react";
import {
  TGrid,
  TGameContext,
  TShips,
  TMessage,
  TCell,
  TButtonProps,
  TCombatant,
  TAppState,
} from "../types/types";
import { getInitializeGrid } from "../utils/getInitializeGrid";
import { getInitializeShips } from "../utils/getInitializeShips";
import { getGenerateShips } from "../utils/getGenerateShips";
import { getPopulateGrid } from "../utils/getPopulateGrid";
import { getChangeCellsActiveStatus } from "../utils/getChangeCellsActiveStatus";
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
    setButtons(testButtons);
  }, []);

  //Actions on appState change
  useEffect(() => {
    if (appState === "PlacementGenerate" && userGrid) {
      console.log("%cappState: PlacementGenerate", "color: purple");
      setDeactivateGrid("User");
      setRandomUserGrid();
    }
  }, [appState]);

  //Setter for grid, updating some cells
  const setUpdateGrid = (owner: TCombatant, updatedCells: TCell[]) => {
    console.log("setUpdateGrid");
    const setGrid = owner === "User" ? setUserGrid : setBrowserGrid;

    setGrid((prev) => {
      // console.log(JSON.stringify(prev));
      if (!prev) {
        return prev;
      }
      return [
        ...prev.map(
          (cell) =>
            updatedCells.find((updated) => updated.id === cell.id) || cell
        ),
      ];
    });
  };

  const setDeactivateGrid = (owner: TCombatant) => {
    console.log("setDeactivateGrid");
    let deactivatedGrid: TGrid = [];
    if (owner === "User" && userGrid) {
      deactivatedGrid = getChangeCellsActiveStatus(userGrid, "deactivate");
      setUserGrid(deactivatedGrid);
    } else if (browserGrid) {
      deactivatedGrid = getChangeCellsActiveStatus(browserGrid, "deactivate");
      setBrowserGrid(deactivatedGrid);
    }
  };

  const setRandomUserGrid = () => {
    console.log("setRandomUserGrid");
    if (userGrid) {
      const generatedUserShips = getGenerateShips();
      const populatedUserGrid = getPopulateGrid(generatedUserShips);
      const gridWithShipsVisible = getAllShipsCellsSetVisible(
        generatedUserShips,
        populatedUserGrid
      );
      setUpdateGrid("User", gridWithShipsVisible);
    }
  };

  const setNewUserGrid = () => {
    console.log("setNewUserGrid");
    const initialUserShips = getInitializeShips();
    const initialUserGrid = getInitializeGrid();
    setUserShips(initialUserShips);
    setUserGrid(initialUserGrid);
  };

  const setRandomBrowserGrid = () => {
    console.log("setRandomBrowserGrid");
    const initialBrowserShips = getGenerateShips();
    const initialBrowserGrid = getPopulateGrid(initialBrowserShips);
    setBrowserShips(initialBrowserShips);
    setBrowserGrid(initialBrowserGrid);
  };

  const setAddMessage = (newMessage: TMessage) => {
    console.log("setAddMessage");
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

  const testButtons: TButtonProps[] = [
    {
      text: "Maybe",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setAppState,
      args: ["PlacementGenerate"],
    },
    {
      text: "Yes",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setAddMessage,
      args: [{ text: "Yes" }],
    },
    {
      text: "No",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAddMessage,
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
        setUpdateGrid,
        setAddMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
