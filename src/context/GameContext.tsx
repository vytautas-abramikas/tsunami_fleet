import { createContext, useState, useEffect, ReactNode } from "react";
import {
  TGrid,
  TGameContext,
  TShip,
  TShips,
  TMessage,
  TCell,
  TButtonProps,
  TCombatant,
  TAppState,
  TBattleStatistics,
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
import { getPlayerPlacementResults } from "../utils/getPlayerPlacementResults";
import { getHandlePlacementCandidates } from "../utils/getHandlePlacementCandidates";
import { getPreparePlayerGridForBattle } from "../utils/getPreparePlayerGridForBattle";
import { getBattleStatistics } from "../utils/getBattleStatistics";

export const GameContext = createContext<TGameContext | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<TAppState>("Welcome");
  const [currentShipId, setCurrentShipId] = useState<number>(1);
  const [activeCombatant, setActiveCombatant] = useState<TCombatant>("Player");
  const [playerShips, setPlayerShips] = useState<TShips | []>([]);
  const [playerGrid, setPlayerGrid] = useState<TGrid | []>([]);
  const [browserShips, setBrowserShips] = useState<TShips | []>([]);
  const [browserGrid, setBrowserGrid] = useState<TGrid | []>([]);
  const [stats, setStats] = useState<TBattleStatistics>({
    player: [],
    browser: [],
  });
  const [isStatsModalVisible, setIsStatsModalVisible] =
    useState<boolean>(false);
  const [buttons, setButtons] = useState<TButtonProps[]>([]);
  const [messages, setMessages] = useState<TMessage[]>([]);

  // Initialization empty for now
  useEffect(() => {
    // console.log("%cInitial useEffect", "color: purple");
  }, []);

  //Actions on appState change
  useEffect(() => {
    switch (appState) {
      case "Welcome":
        // console.log("%cappState: Welcome", "color: purple");
        setRandomBrowserGrid();
        setMessages([MSG_LIB.Welcome]);
        setButtons(welcomeButtons);
        break;
      case "PlacementStart":
        // console.log("%cappState: PlacementStart", "color: purple");
        setEmptyPlayerGridAndShipsForPlacement();
        setMessages([MSG_LIB.PlacementStart]);
        setButtons(placementStartButtons);
        break;
      case "PlacementEmpty":
        // console.log("%cappState: PlacementEmpty", "color: purple");
        setEmptyPlayerGridAndShipsForPlacement();
        setCurrentShipId(1);
        setMessages([]);
        setGridActiveStatus("Player", "activate");
        setAppState("PlacementFirstSegment");
        break;
      case "PlacementFirstSegment": {
        // console.log("%cappState: PlacementFirstSegment", "color: purple");
        const gridActiveNoCandidates = getHandlePlacementCandidates(playerGrid);
        setUpdateGrid("Player", gridActiveNoCandidates);
        setAddMessage(
          fillIn(MSG_LIB.PlacementFirstSegment, [
            String(playerShips[currentShipId - 1].size),
          ])
        );
        setButtons(placementFirstSegmentButtons);
        break;
      }
      case "PlacementAdditionalSegment": {
        // console.log("%cappState: PlacementAdditionalSegment", "color: purple");
        const gridNewCandidates = getHandlePlacementCandidates(
          playerGrid,
          playerShips[currentShipId - 1].segments
        );
        setUpdateGrid("Player", gridNewCandidates);
        setAddMessage(MSG_LIB.PlacementAdditionalSegment);
        setButtons(placementAdditionalSegmentButtons);
        break;
      }
      case "PlacementTransition": {
        // console.log("%cappState: PlacementTransition", "color: purple");
        const gridCleardCandidatesActivated =
          getHandlePlacementCandidates(playerGrid);
        setUpdateGrid("Player", gridCleardCandidatesActivated);
        if (
          playerShips[currentShipId - 1].size ===
          playerShips[currentShipId - 1].segments.length
        ) {
          if (currentShipId === playerShips.length) {
            setAppState("PlacementFinalize");
          } else {
            setCurrentShipId((prev) => prev + 1);
            setAppState("PlacementFirstSegment");
          }
        } else {
          setAppState("PlacementAdditionalSegment");
        }
        break;
      }
      case "PlacementFinalize": {
        // console.log("%cappState: PlacementFinalize", "color: purple");
        const preparedPlayerGrid = getPreparePlayerGridForBattle(playerGrid);
        setUpdateGrid("Player", preparedPlayerGrid);
        setMessages([MSG_LIB.PlacementFinalize]);
        setButtons(placementFinalizeButtons);
        break;
      }
      case "PlacementGenerate":
        // console.log("%cappState: PlacementGenerate", "color: purple");
        setRandomPlayerShipsAndGrid();
        setMessages([MSG_LIB.PlacementGenerate]);
        setButtons(placementGenerateButtons);
        break;
      case "BattleStart": {
        // console.log("%cappState: BattleStart", "color: purple");
        setGridActiveStatus("Browser", "deactivate");
        const startingCombatant = getWhoGetsFirstTurn();
        setActiveCombatant(startingCombatant);
        setMessages([fillIn(MSG_LIB.BattleStart, [startingCombatant])]);
        setButtons(battleStartButtons);
        break;
      }
      case "Battle":
        // console.log("%cappState: Battle", "color: purple");
        setButtons(battleButtons);
        break;
      case "BattlePause":
        // console.log("%cappState: BattlePause", "color: purple");
        setTimeout(() => {
          setAppState("Battle");
        }, BROWSER_TURN_TIMEOUT / 5);
        break;
      case "BattleOver":
        // console.log("%cappState: BattleOver", "color: purple");
        setGridActiveStatus("Player", "deactivate");
        setGridActiveStatus("Browser", "deactivate");
        setButtons(gameOverButtons);
        break;
      default:
        break;
    }
  }, [appState]);

  // Battle orchestration
  useEffect(() => {
    if (appState === "Battle") {
      // console.log(`--- ${activeCombatant} ---`);
      switch (activeCombatant) {
        case "Player":
          setGridActiveStatus("Browser", "activate");
          setAddMessage(fillIn(MSG_LIB.PlayersTurn, [activeCombatant]));
          break;
        case "Browser": {
          const isPlayersLastSegment = isLastSegmentToSinkOnGrid(playerGrid);
          setGridActiveStatus("Browser", "deactivate");
          const { browserHitStatus, cellsToProcess } = getBrowserShotResults(
            playerGrid,
            playerShips
          );
          // browser is gonna shoot now
          setTimeout(() => {
            setUpdateGrid("Player", cellsToProcess);
            switch (browserHitStatus) {
              case "empty":
                // console.log("Browser missed, Player set active");
                setAddMessage(fillIn(MSG_LIB.BrowserMissPlayer, ["Browser"]));
                setActiveCombatant("Player");
                break;
              case "hit":
                // console.log("Browser hit, not last segment, Browser gets another turn");
                setAddMessage(
                  fillIn(MSG_LIB.BrowserHitPlayerShip, ["Browser"])
                );
                setAppState("BattlePause");
                break;
              case "sunk": {
                if (!isPlayersLastSegment) {
                  // console.log("Browser sank a ship, not last segment on board, Browser gets another turn");
                  setAddMessage(
                    fillIn(MSG_LIB.BrowserSankPlayerShip, ["Browser"])
                  );
                  setAppState("BattlePause");
                } else {
                  // console.log("--- Browser sank a ship, last segment on board, Browser won ---");
                  const browserShipsRevealed: TGrid =
                    getGridWithShipsVisible(browserGrid);
                  setUpdateGrid("Browser", browserShipsRevealed);
                  setMessages([
                    fillIn(MSG_LIB.BrowserVictory, ["Browser", "Player"]),
                  ]);
                  setAppState("BattleOver");
                }
                break;
              }
              default:
                break;
            }
          }, BROWSER_TURN_TIMEOUT);
          break;
        }
        default:
          break;
      }
    }
  }, [activeCombatant, appState]);

  useEffect(() => {
    if (appState === "Battle" || appState === "BattleOver") {
      // console.log("useEffect setting stats");
      setStats(
        getBattleStatistics(playerShips, playerGrid, browserShips, browserGrid)
      );
    }
  }, [playerGrid, browserGrid]);

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
        setMessages([MSG_LIB.PlayerVictory]);
        setAppState("BattleOver");
      }
    }
  };

  //handle Player clicks while placing ships
  const handlePlayerPlacement = (cellId: number) => {
    // console.log("handlePlayerPlacement");
    const { shipToProcess, cellsToProcess } = getPlayerPlacementResults(
      cellId,
      playerShips[currentShipId - 1],
      playerGrid
    );
    // console.log(shipToProcess, cellsToProcess);
    setUpdatePlayerShip(shipToProcess);
    setUpdateGrid("Player", cellsToProcess);
    setAppState("PlacementTransition");
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

  const setUpdatePlayerShip = (updatedShip: TShip) => {
    setPlayerShips((prev) => {
      if (!prev) {
        return prev;
      }
      return [
        ...prev.map((ship) =>
          ship.id === updatedShip.id ? { ...updatedShip } : ship
        ),
      ];
    });
  };

  const setResetCurrentPlayerShip = () => {
    const currentShip: TShip = { ...playerShips[currentShipId - 1] };
    const updatedGridCells: TCell[] = currentShip.segments.map((segment) => ({
      ...playerGrid[segment],
      status: "empty" as const,
      isVisible: false,
    }));
    setUpdatePlayerShip({ ...currentShip, segments: [] });
    setUpdateGrid("Player", updatedGridCells);
    setAppState("PlacementFirstSegment");
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

  const setEmptyPlayerGridAndShipsForPlacement = () => {
    // console.log("setNewPlayerGrid");
    const initialPlayerShips = getInitializeShips();
    const initialPlayerGrid = getInitializeGrid();
    setPlayerShips(initialPlayerShips);
    const disabledGrid = getChangeCellsActiveStatus(
      initialPlayerGrid,
      "deactivate"
    );
    setPlayerGrid(disabledGrid);
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
    const classes = newMessage.classes || "";
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
      args: ["PlacementStart"],
    },
  ];

  const placementStartButtons: TButtonProps[] = [
    {
      text: "Randomly",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setAppState,
      args: ["PlacementGenerate"],
    },
    {
      text: "Manually",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setAppState,
      args: ["PlacementEmpty"],
    },
    {
      text: "Exit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  const placementFirstSegmentButtons: TButtonProps[] = [
    {
      text: "Exit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  const placementAdditionalSegmentButtons: TButtonProps[] = [
    {
      text: "Reset this ship",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setResetCurrentPlayerShip,
    },
  ];

  const placementFinalizeButtons: TButtonProps[] = [
    {
      text: "Accept",
      classes: "bg-green-600 hover:bg-green-700 text-white",
      onClick: setAppState,
      args: ["BattleStart"],
    },
    {
      text: "Exit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
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
      text: "Exit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  const battleButtons: TButtonProps[] = [
    {
      text: "Compare",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setIsStatsModalVisible,
      args: [true],
    },
    {
      text: "Quit",
      classes: "bg-red-600 hover:bg-red-700 text-white",
      onClick: setAppState,
      args: ["Welcome"],
    },
  ];

  const gameOverButtons: TButtonProps[] = [
    {
      text: "Compare",
      classes: "bg-indigo-600 hover:bg-indigo-700 text-white",
      onClick: setIsStatsModalVisible,
      args: [true],
    },
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
        stats,
        isStatsModalVisible,
        messages,
        buttons,
        handlePlayerShot,
        handlePlayerPlacement,
        setIsStatsModalVisible,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
