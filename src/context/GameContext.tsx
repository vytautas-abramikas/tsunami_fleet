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
import { getPlayerShotResults } from "../utils/getPlayerShotResults";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<TAppState>("Welcome");
  const [activeCombatant, setActiveCombatant] = useState<TCombatant>("Player");
  const [playerShips, setPlayerShips] = useState<TShips | []>([]);
  const [playerGrid, setPlayerGrid] = useState<TGrid | []>([]);
  const [browserShips, setBrowserShips] = useState<TShips | []>([]);
  const [browserGrid, setBrowserGrid] = useState<TGrid | []>([]);
  const [buttons, setButtons] = useState<TButtonProps[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);

  // Initialize the state once
  useEffect(() => {
    // console.log("%cInitial useEffect", "color: purple");
    setNewPlayerGrid(); //just to keep the function needed for now
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
      setRandomPlayerShipsAndGrid();
      setMessages([MSG_LIB.PlacementGenerate]);
      setButtons(placementGenerateButtons);
    }
    if (appState === "BattleStart") {
      // console.log("%cappState: BattleStart", "color: purple");
      setGridActiveStatus("Browser", "deactivate");
      const startingCombatant = getWhoGetsFirstTurn();
      setActiveCombatant(startingCombatant);
      setMessages([fillIn(MSG_LIB.BattleStart, [startingCombatant])]);
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
      setGridActiveStatus("Player", "deactivate");
      setGridActiveStatus("Browser", "deactivate");
      setButtons(gameOverButtons);
    }
  }, [appState]);

  //Battle orchestration
  useEffect(() => {
    if (appState === "Battle") {
      // console.log(`--- ${activeCombatant} ---`);
      if (activeCombatant === "Player") {
        setGridActiveStatus("Browser", "activate");
        setAddMessage(fillIn(MSG_LIB.PlayersTurn, [activeCombatant]));
      } else {
        //browser is gonna shoot now
        setTimeout(() => {
          const isPlayersLastSegment = isLastSegmentToSinkOnGrid(playerGrid);
          setGridActiveStatus("Browser", "deactivate");
          const { browserHitStatus, cellsToProcess } = getBrowserShotResults(
            playerGrid,
            playerShips
          );
          setUpdateGrid("Player", cellsToProcess);
          if (browserHitStatus === "empty") {
            // console.log("Browser missed, Player set active");
            setAddMessage(fillIn(MSG_LIB.BrowserMissPlayer, ["Browser"]));
            setActiveCombatant("Player");
          } else if (browserHitStatus === "hit") {
            // console.log(
            //   "Browser hit, not last segment, Browser gets another turn"
            // );
            setAddMessage(fillIn(MSG_LIB.BrowserHitPlayerShip, ["Browser"]));
            setAppState("BattlePause");
          } else {
            if (!isPlayersLastSegment) {
              // console.log(
              //   "Browser sank a ship, not last segment on board, Browser gets another turn"
              // );
              setAddMessage(fillIn(MSG_LIB.BrowserSankPlayerShip, ["Browser"]));
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

  // handle Player part of battle
  const handlePlayerShot = (cellId: number) => {
    const isBrowsersLastSegment = isLastSegmentToSinkOnGrid(browserGrid);
    const { playerHitStatus, cellsToProcess } = getPlayerShotResults(
      cellId,
      browserGrid,
      browserShips
    );
    setUpdateGrid("Browser", cellsToProcess);

    if (playerHitStatus === "empty") {
      setAddMessage(fillIn(MSG_LIB.PlayerMissBrowser, ["Browser"]));
      setActiveCombatant("Browser");
    } else if (playerHitStatus === "hit") {
      setAddMessage(MSG_LIB.PlayerHitBrowserShip);
    } else {
      if (!isBrowsersLastSegment) {
        setAddMessage(MSG_LIB.PlayerSankBrowserShip);
      } else {
        setAddMessage(MSG_LIB.PlayerVictory);
        setAppState("BattleOver");
      }
    }
  };

  //Setter for grid, updating some cells
  const setUpdateGrid = (owner: TCombatant, updatedCells: TCell[]) => {
    // console.log("setUpdateGrid");
    const setGrid = owner === "Player" ? setPlayerGrid : setBrowserGrid;

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
    if (owner === "Player" && playerGrid) {
      // console.log(JSON.stringify(playerGrid));
      modifiedGrid = getChangeCellsActiveStatus(playerGrid, mode);
      setUpdateGrid(owner, modifiedGrid);
    } else if (browserGrid) {
      // console.log(JSON.stringify(browserGrid));
      modifiedGrid = getChangeCellsActiveStatus(browserGrid, mode);
      // console.log(JSON.stringify(deactivatedGrid));
      // setBrowserGrid(deactivatedGrid);
      setUpdateGrid(owner, modifiedGrid);
    }
  };

  const setRandomPlayerShipsAndGrid = () => {
    // console.log("setRandomPlayerShipsAndGrid");
    if (playerGrid) {
      const generatedPlayerShips = getGenerateShips();
      const populatedPlayerGrid = getPopulateGrid(generatedPlayerShips);
      const gridWithShipsVisible = getGridWithShipsVisible(populatedPlayerGrid);
      const deactivatedGrid = getChangeCellsActiveStatus(
        gridWithShipsVisible,
        "deactivate"
      );
      setPlayerGrid(deactivatedGrid);
      setPlayerShips(generatedPlayerShips);
    }
  };

  const setNewPlayerGrid = () => {
    // console.log("setNewPlayerGrid");
    const initialPlayerShips = getInitializeShips();
    const initialPlayerGrid = getInitializeGrid();
    setPlayerShips(initialPlayerShips);
    setPlayerGrid(initialPlayerGrid);
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
      text: "Prepare for battle",
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
      onClick: setRandomPlayerShipsAndGrid,
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
        playerGrid,
        browserGrid,
        messages,
        buttons,
        handlePlayerShot,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
