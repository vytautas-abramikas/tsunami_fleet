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
import { getGridWithShipsVisible } from "../utils/getGridWithShipsVisible";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<TAppState>("Welcome");
  const [activeCombatant, setActiveCombatant] = useState<TCombatant>("User");
  const [userShips, setUserShips] = useState<TShips | []>([]);
  const [userGrid, setUserGrid] = useState<TGrid | []>([]);
  const [browserShips, setBrowserShips] = useState<TShips | []>([]);
  const [browserGrid, setBrowserGrid] = useState<TGrid | []>([]);
  const [buttons, setButtons] = useState<TButtonProps[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);

  // Initialize the state once
  useEffect(() => {
    console.log("%cInitial useEffect", "color: purple");
    setRandomBrowserGrid();
  }, []);

  //Actions on appState change
  useEffect(() => {
    if (appState === "Welcome") {
      setMessages([{ text: "Dare to brave the seas?" }]);
      setButtons(welcomeButtons);
    }
    if (appState === "PlacementGenerate") {
      console.log("%cappState: PlacementGenerate", "color: purple");
      setRandomUserGrid();
      setMessages([{ text: "Ready to set sail?" }]);
      setButtons(placementGenerateButtons);
    }
    if (appState === "BattleStart") {
      console.log("%cappState: BattleStart", "color: purple");
      setMessages([{ text: "Ready for battle?" }]);
      setButtons(battleStartButtons);
    }
    if (appState === "Battle") {
      setDeactivateGrid("Browser");
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
      console.log(JSON.stringify(userGrid));
      deactivatedGrid = getChangeCellsActiveStatus(userGrid, "deactivate");
      setUserGrid(deactivatedGrid);
    } else if (browserGrid) {
      console.log(JSON.stringify(browserGrid));
      deactivatedGrid = getChangeCellsActiveStatus(browserGrid, "deactivate");
      console.log(JSON.stringify(deactivatedGrid));
      // setBrowserGrid(deactivatedGrid);
      setUpdateGrid(owner, deactivatedGrid);
    }
  };

  const setRandomUserGrid = () => {
    console.log("setRandomUserGrid");
    if (userGrid) {
      const generatedUserShips = getGenerateShips();
      const populatedUserGrid = getPopulateGrid(generatedUserShips);
      const gridWithShipsVisible = getGridWithShipsVisible(populatedUserGrid);
      const deactivatedGrid = getChangeCellsActiveStatus(
        gridWithShipsVisible,
        "deactivate"
      );
      setUserGrid(deactivatedGrid);
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

  const welcomeButtons: TButtonProps[] = [
    {
      text: "Build your fleet",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setAppState,
      args: ["PlacementGenerate"],
    },
  ];

  const placementGenerateButtons: TButtonProps[] = [
    {
      text: "Start Battle",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setAppState,
      args: ["BattleStart"],
    },
    {
      text: "Reroll",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setRandomUserGrid,
    },

    {
      text: "Exit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  const battleStartButtons: TButtonProps[] = [
    {
      text: "DeactivateTestAppState",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setAppState,
      args: ["Battle"],
    },
    {
      text: "DeactivateTestClick",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setDeactivateGrid,
      args: ["Browser"],
    },
    {
      text: "No",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAddMessage,
      args: [{ text: "No" }],
    },
  ];

  const testButtons: TButtonProps[] = [
    {
      text: "Maybe",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setRandomUserGrid,
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
