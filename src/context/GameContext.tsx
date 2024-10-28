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
import { isLastSegment } from "../utils/isLastSegment";
import { getShipCells } from "../utils/getShipCells";
import { getShipNeighborCells } from "../utils/getShipNeighborCells";
import { MSG_LIB, fillIn } from "../constants/MSG_LIB";
import { BROWSER_TURN_TIMEOUT } from "../constants/BROWSER_TURN_TIMEOUT";

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
    const cell = browserGrid[cellId];
    const isBrowsersLastSegment = isLastSegmentToSinkOnGrid(browserGrid);
    // console.log(JSON.stringify(cell));
    let updatedCells: TCell[] = [];
    if (cell.id === cellId && !cell.isVisible) {
      if (cell.status === "ship") {
        if (isLastSegment(cellId, browserShips, browserGrid)) {
          //if last ship segment is hit, mark all ship segments as sunk
          // console.log(
          //   "User shooting, last segment of a ship detected, cellId: ",
          //   cellId
          // );
          const sunkCells: TCell[] = getShipCells(
            cell.shipId,
            browserShips,
            browserGrid
          ).map((cell) => ({
            ...cell,
            status: "sunk" as "sunk",
            isVisible: true,
          }));
          //mark neighboring cells of a sunk ship as visible
          const revealedNeighbors: TCell[] = getShipNeighborCells(
            cell.shipId,
            browserShips,
            browserGrid
          ).map((cell) => ({ ...cell, isVisible: true }));
          //merge all updated cells into one array, display message
          updatedCells = [...sunkCells, ...revealedNeighbors];
          if (isBrowsersLastSegment) {
            // console.log("---last segment on grid is to be sunk by User ----");
            setAddMessage(MSG_LIB.UserVictory);
            // console.log("User shooting, BattleOver is to be set ", cellId);
            setAppState("BattleOver");
          } else {
            // ship sunk, but it is not the last one
            setAddMessage(MSG_LIB.UserSankBrowserShip);
          }
        } else {
          //if the segment hit is not the last one of its ship
          const updatedCell = {
            ...cell,
            status: "hit" as "hit",
            isVisible: true,
          };
          updatedCells = [updatedCell];
          setAddMessage(MSG_LIB.UserHitBrowserShip);
        }
      } else {
        //if an empty cell is hit, just reveal it
        const updatedCell = { ...cell, isVisible: true };
        updatedCells = [updatedCell];
        setAddMessage(fillIn(MSG_LIB.UserMissBrowser, ["Browser"]));
        setActiveCombatant("Browser");
      }
    }
    //set new grid state
    setUpdateGrid("Browser", updatedCells);
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
