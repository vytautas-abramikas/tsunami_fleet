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
import { isLastSegmentToSinkOnGrid } from "../utils/isLastSegmentToSinkOnGrid";
import { MSG_LIB, fillIn } from "../constants/MSG_LIB";
import { BROWSER_TURN_TIMEOUT } from "../constants/BROWSER_TURN_TIMEOUT";
import { getUserShotResults } from "../utils/getUserShotResults";

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
    // console.log("%cInitial useEffect", "color: purple");
    setNewUserGrid(); //just to keep the function needed for now
  }, []);

  //Actions on appState change
  useEffect(() => {
    if (appState === "Welcome") {
      // console.log("%cappState: Welcome", "color: purple");
      setRandomBrowserGrid();
      setMessages([MSG_LIB.Welcome]);
      setButtons(welcomeButtons);
    }
    if (appState === "PlacementGenerate") {
      // console.log("%cappState: PlacementGenerate", "color: purple");
      setRandomUserShipsAndGrid();
      setMessages([MSG_LIB.PlacementGenerate]);
      setButtons(placementGenerateButtons);
    }
    if (appState === "BattleStart") {
      // console.log("%cappState: BattleStart", "color: purple");
      setGridActiveStatus("Browser", "deactivate");
      const startingPlayer = getWhoGetsFirstTurn();
      setActiveCombatant(startingPlayer);
      setMessages([fillIn(MSG_LIB.BattleStart, [startingPlayer])]);
      setButtons(battleStartButtons);
    }
    if (appState === "Battle") {
      // console.log("%cappState: Battle", "color: purple");
      setButtons([]);
    }
    if (appState === "BattlePause") {
      // console.log("%cappState: BattlePause", "color: purple");
      setTimeout(() => {
        setAppState("Battle");
      }, 0);
    }
    if (appState === "BattleOver") {
      // console.log("%cappState: BattleOver", "color: purple");
      setGridActiveStatus("User", "deactivate");
      setGridActiveStatus("Browser", "deactivate");
      setButtons(gameOverButtons);
    }
  }, [appState]);

  //Battle orchestration
  useEffect(() => {
    if (appState === "Battle") {
      // console.log(`--- ${activeCombatant} ---`);
      if (activeCombatant === "User") {
        setGridActiveStatus("Browser", "activate");
        setAddMessage(fillIn(MSG_LIB.UsersTurn, [activeCombatant]));
      } else {
        //browser is gonna shoot now
        setTimeout(() => {
          const isUsersLastSegment = isLastSegmentToSinkOnGrid(userGrid);
          setGridActiveStatus("Browser", "deactivate");
          const { browserHitStatus, cellsToProcess } = getBrowserShotResults(
            userGrid,
            userShips
          );
          setUpdateGrid("User", cellsToProcess);
          if (browserHitStatus === "empty") {
            // console.log("Browser missed, User set active");
            setAddMessage(fillIn(MSG_LIB.BrowserMissUser, ["Browser"]));
            setActiveCombatant("User");
          } else if (browserHitStatus === "hit") {
            // console.log(
            //   "Browser hit, not last segment, Browser gets another turn"
            // );
            setAddMessage(fillIn(MSG_LIB.BrowserHitUserShip, ["Browser"]));
            setAppState("BattlePause");
          } else {
            if (!isUsersLastSegment) {
              // console.log(
              //   "Browser sank a ship, not last segment on board, Browser gets another turn"
              // );
              setAddMessage(fillIn(MSG_LIB.BrowserSankUserShip, ["Browser"]));
              setAppState("BattlePause");
            } else {
              // console.log(
              //   "--- Browser sank a ship, last segment on board, Browser won ---"
              // );
              const browserShipsRevealed: TGrid =
                getGridWithShipsVisible(browserGrid);
              setUpdateGrid("Browser", browserShipsRevealed);
              setAddMessage(fillIn(MSG_LIB.BrowserVictory, ["Browser"]));
              setAppState("BattleOver");
            }
          }
        }, BROWSER_TURN_TIMEOUT);
      }
    }
  }, [activeCombatant, appState]);

  // handle User part of battle
  const handleUserShot = (cellId: number) => {
    const isBrowsersLastSegment = isLastSegmentToSinkOnGrid(browserGrid);
    // console.log(JSON.stringify(cell));
    const { userHitStatus, cellsToProcess } = getUserShotResults(
      cellId,
      browserGrid,
      browserShips
    );
    setUpdateGrid("Browser", cellsToProcess);

    if (userHitStatus === "empty") {
      setAddMessage(fillIn(MSG_LIB.UserMissBrowser, ["Browser"]));
      setActiveCombatant("Browser");
    } else if (userHitStatus === "hit") {
      setAddMessage(MSG_LIB.UserHitBrowserShip);
    } else {
      if (!isBrowsersLastSegment) {
        setAddMessage(MSG_LIB.UserSankBrowserShip);
      } else {
        setAddMessage(MSG_LIB.UserVictory);
        setAppState("BattleOver");
      }
    }
  };

  //Setter for grid, updating some cells
  const setUpdateGrid = (owner: TCombatant, updatedCells: TCell[]) => {
    // console.log("setUpdateGrid");
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
    // console.log("setGridActiveStatus");
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
    // console.log("setRandomUserGrid");
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
    // console.log("setNewUserGrid");
    const initialUserShips = getInitializeShips();
    const initialUserGrid = getInitializeGrid();
    setUserShips(initialUserShips);
    setUserGrid(initialUserGrid);
  };

  const setRandomBrowserGrid = () => {
    // console.log("setRandomBrowserGrid");
    const initialBrowserShips = getGenerateShips();
    const initialBrowserGrid = getPopulateGrid(initialBrowserShips);
    setBrowserShips(initialBrowserShips);
    setBrowserGrid(initialBrowserGrid);
  };

  const setAddMessage = (newMessage: TMessage) => {
    // console.log("setAddMessage");
    const text = newMessage.text;
    const classes = newMessage.classes || "text-white font-semibold";
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
      text: "Accept",
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

  return (
    <GameContext.Provider
      value={{
        appState,
        activeCombatant,
        userGrid,
        browserGrid,
        messages,
        buttons,
        handleUserShot,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
