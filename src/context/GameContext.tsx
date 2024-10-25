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
import { getWhoGetsFirstTurn } from "../utils/getWhoGetsFirstTurn";
import { getBrowserShotResults } from "../utils/getBrowserShotResults";
import { isGameOverAndWhoWon } from "../utils/isGameOverAndWhoWon";

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
    setNewUserGrid(); //not needed but keeping it here to not get get warnings for unused (for now) function
    setRandomBrowserGrid();
  }, []);

  //Actions on appState change
  useEffect(() => {
    if (appState === "Welcome") {
      console.log("%cappState: Welcome", "color: purple");
      setMessages([{ text: "Dare to brave the seas?" }]);
      setButtons(welcomeButtons);
    }
    if (appState === "PlacementGenerate") {
      console.log("%cappState: PlacementGenerate", "color: purple");
      setRandomUserShipsAndGrid();
      setMessages([{ text: "Ready to set sail?" }]);
      setButtons(placementGenerateButtons);
    }
    if (appState === "BattleStart") {
      console.log("%cappState: BattleStart", "color: purple");
      setGridActiveStatus("Browser", "deactivate");
      const startingPlayer = getWhoGetsFirstTurn();
      setActiveCombatant(startingPlayer);
      setMessages([
        { text: `${startingPlayer} gets to start. Ready for battle?` },
      ]);
      setButtons(battleStartButtons);
    }
    if (appState === "Battle") {
      console.log("%cappState: Battle", "color: purple");
      setButtons([]);
      setMessages([]);
    }
    if (appState === "BattlePause") {
      console.log("%cappState: BattlePause", "color: purple");
      setTimeout(() => {
        setAppState("Battle");
      }, 200);
    }
    if (appState === "BattleOver") {
      console.log("%cappState: BattleOver", "color: purple");
      setGridActiveStatus("User", "deactivate");
      setGridActiveStatus("Browser", "deactivate");
      setButtons(gameOverButtons);
    }
  }, [appState]);

  //Batlle orchestration
  useEffect(() => {
    if (appState === "Battle" || appState === "BattlePause") {
      console.log("check if game is not over - ", appState);
      const { isGameOver, whoWon } = isGameOverAndWhoWon(userGrid, browserGrid);

      if (isGameOver) {
        setMessages([
          {
            text: `Game over. ${
              whoWon === "User"
                ? "User won! Congratulations!!!"
                : "Browser won. Better luck next time captain!"
            }`,
          },
        ]);
        setAppState("BattleOver");
        return;
      }
    }

    if (appState === "Battle") {
      console.log(`--- ${activeCombatant} ---`);
      if (activeCombatant === "User") {
        setGridActiveStatus("Browser", "activate");
        setAddMessage({ text: "User, your turn!" });
      } else {
        setTimeout(() => {
          setGridActiveStatus("Browser", "deactivate");
          const { browserHitStatus, cellsToProcess } = getBrowserShotResults(
            userGrid,
            userShips
          );
          setUpdateGrid("User", cellsToProcess);
          setAddMessage({
            text:
              browserHitStatus === "empty"
                ? "Browser missed..."
                : browserHitStatus === "hit"
                ? "Browser hit User's ship"
                : "Browser sank User's ship",
          });
          if (browserHitStatus === "empty") {
            setActiveCombatant("User");
          } else {
            setAppState("BattlePause");
          }
        }, 100);
      }
    }
  }, [activeCombatant, appState]);

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

  const setGridActiveStatus = (
    owner: TCombatant,
    mode: "activate" | "deactivate"
  ) => {
    console.log("setGridActiveStatus");
    let modifiedGrid: TGrid = [];
    if (owner === "User" && userGrid) {
      // console.log(JSON.stringify(userGrid));
      modifiedGrid = getChangeCellsActiveStatus(userGrid, mode);
      setUpdateGrid(owner, modifiedGrid);
    } else if (browserGrid) {
      // console.log(JSON.stringify(browserGrid));
      modifiedGrid = getChangeCellsActiveStatus(browserGrid, mode);
      // console.log(JSON.stringify(deactivatedGrid));
      // setBrowserGrid(deactivatedGrid);
      setUpdateGrid(owner, modifiedGrid);
    }
  };

  const setRandomUserShipsAndGrid = () => {
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
      setUserShips(generatedUserShips);
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
      text: "Ready",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setAppState,
      args: ["BattleStart"],
    },
    {
      text: "Reroll",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setRandomUserShipsAndGrid,
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
      text: "Start battle",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setAppState,
      args: ["Battle"],
    },
    {
      text: "Chicken out",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  const gameOverButtons: TButtonProps[] = [
    {
      text: "Exit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  // const testButtons: TButtonProps[] = [
  //   {
  //     text: "Maybe",
  //     classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
  //     onClick: setRandomUserGrid,
  //     args: ["PlacementGenerate"],
  //   },
  //   {
  //     text: "Yes",
  //     classes: "bg-green-600 hover:bg-green-700 text-white",
  //     onClick: setAddMessage,
  //     args: [{ text: "Yes" }],
  //   },
  //   {
  //     text: "No",
  //     classes: "bg-red-600 hover:bg-red-700 text-white",
  //     onClick: setAddMessage,
  //     args: [{ text: "No" }],
  //   },
  // ];

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
