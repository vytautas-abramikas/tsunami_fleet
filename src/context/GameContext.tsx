import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
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

  //See when Provider code is run
  // console.log("%cGameProvider", "color: cyan");

  // Initial useEffect for testing
  // useEffect(() => {
  //   console.log("%cInitial useEffect", "color: purple");
  // }, []);

  //Actions on appState change
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // console.log("%cappState: " + appState, "color: blue");
    switch (appState) {
      case "Welcome":
        setRandomBrowserGrid();
        setMessages([MSG_LIB.Welcome]);
        setButtons(welcomeButtons);
        break;
      case "PlacementStart":
        setEmptyPlayerGridAndShipsForPlacement();
        setMessages([MSG_LIB.PlacementStart]);
        setButtons(placementStartButtons);
        break;
      case "PlacementEmpty":
        setEmptyPlayerGridAndShipsForPlacement();
        setCurrentShipId(1);
        setMessages([]);
        setGridActiveStatus("Player", "activate");
        setAppState("PlacementFirstSegment");
        break;
      case "PlacementFirstSegment": {
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
        const preparedPlayerGrid = getPreparePlayerGridForBattle(playerGrid);
        setUpdateGrid("Player", preparedPlayerGrid);
        setMessages([MSG_LIB.PlacementFinalize]);
        setButtons(placementFinalizeButtons);
        break;
      }
      case "PlacementGenerate":
        setRandomPlayerShipsAndGrid();
        setMessages([MSG_LIB.PlacementGenerate]);
        setButtons(placementGenerateButtons);
        break;
      case "BattleStart": {
        setGridActiveStatus("Browser", "deactivate");
        const startingCombatant = getWhoGetsFirstTurn();
        setActiveCombatant(startingCombatant);
        setMessages([fillIn(MSG_LIB.BattleStart, [startingCombatant])]);
        setButtons(battleStartButtons);
        break;
      }
      case "Battle":
        setButtons(battleButtons);
        break;
      case "BattlePause":
        setTimeout(() => {
          setAppState("Battle");
        }, BROWSER_TURN_TIMEOUT / 5);
        break;
      case "BattleOver":
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
      // console.log(
      //   "%c" + activeCombatant + "'s turn",
      //   `color: ${activeCombatant === "Player" ? "green" : "red"}`
      // );
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
          setTimeout(() => {
            setUpdateGrid("Player", cellsToProcess);
            switch (browserHitStatus) {
              case "empty":
                setAddMessage(fillIn(MSG_LIB.BrowserMissPlayer, ["Browser"]));
                setActiveCombatant("Player");
                break;
              case "hit":
                setAddMessage(
                  fillIn(MSG_LIB.BrowserHitPlayerShip, ["Browser"])
                );
                setAppState("BattlePause");
                break;
              case "sunk": {
                if (!isPlayersLastSegment) {
                  setAddMessage(
                    fillIn(MSG_LIB.BrowserSankPlayerShip, ["Browser"])
                  );
                  setAppState("BattlePause");
                } else {
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
      // console.log("useEffect calculating and setting battle statistics");
      setStats(
        getBattleStatistics(playerShips, playerGrid, browserShips, browserGrid)
      );
    }
  }, [playerGrid, browserGrid]);
  /* eslint-enable react-hooks/exhaustive-deps */

  //Setter for grid, updating some cells
  const setUpdateGrid = useCallback(
    (owner: TCombatant, updatedCells: TCell[]) => {
      // console.log("setUpdateGrid");
      const setGrid = owner === "Player" ? setPlayerGrid : setBrowserGrid;

      setGrid((prev) => {
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
    },
    []
  );

  const setUpdatePlayerShip = useCallback((updatedShip: TShip) => {
    // console.log("setUpdatePlayerShip");
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
  }, []);

  const setResetCurrentPlayerShip = useCallback(() => {
    // console.log("setResetCurrentPlayerShip");
    const currentShip: TShip = { ...playerShips[currentShipId - 1] };
    const updatedGridCells: TCell[] = currentShip.segments.map((segment) => ({
      ...playerGrid[segment],
      status: "empty" as const,
      isVisible: false,
    }));
    setUpdatePlayerShip({ ...currentShip, segments: [] });
    setUpdateGrid("Player", updatedGridCells);
    setAppState("PlacementFirstSegment");
  }, [
    playerShips,
    currentShipId,
    playerGrid,
    setUpdatePlayerShip,
    setUpdateGrid,
  ]);

  const setGridActiveStatus = useCallback(
    (owner: TCombatant, mode: "activate" | "deactivate") => {
      // console.log("setGridActiveStatus");
      let modifiedGrid: TGrid = [];
      if (owner === "Player" && playerGrid) {
        modifiedGrid = getChangeCellsActiveStatus(playerGrid, mode);
        setUpdateGrid(owner, modifiedGrid);
      } else if (browserGrid) {
        modifiedGrid = getChangeCellsActiveStatus(browserGrid, mode);
        setUpdateGrid(owner, modifiedGrid);
      }
    },
    [playerGrid, browserGrid, setUpdateGrid]
  );

  const setRandomPlayerShipsAndGrid = useCallback(() => {
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
  }, [playerGrid]);

  const setEmptyPlayerGridAndShipsForPlacement = useCallback(() => {
    // console.log("setEmptyPlayerGridAndShipsForPlacement");
    const initialPlayerShips = getInitializeShips();
    const initialPlayerGrid = getInitializeGrid();
    setPlayerShips(initialPlayerShips);
    const disabledGrid = getChangeCellsActiveStatus(
      initialPlayerGrid,
      "deactivate"
    );
    setPlayerGrid(disabledGrid);
  }, []);

  const setRandomBrowserGrid = useCallback(() => {
    // console.log("setRandomBrowserGrid");
    const initialBrowserShips = getGenerateShips();
    const initialBrowserGrid = getPopulateGrid(initialBrowserShips);
    setBrowserShips(initialBrowserShips);
    setBrowserGrid(initialBrowserGrid);
  }, []);

  const setAddMessage = useCallback((newMessage: TMessage) => {
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
  }, []);

  // handle Player part of battle
  const handlePlayerShot = useCallback(
    (cellId: number) => {
      // console.log("handlePlayerShot");
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
    },
    [browserGrid, browserShips, setUpdateGrid, setAddMessage]
  );

  //handle Player clicks while placing ships
  const handlePlayerPlacement = useCallback(
    (cellId: number) => {
      // console.log("handlePlayerPlacement");
      const { shipToProcess, cellsToProcess } = getPlayerPlacementResults(
        cellId,
        playerShips[currentShipId - 1],
        playerGrid
      );
      setUpdatePlayerShip(shipToProcess);
      setUpdateGrid("Player", cellsToProcess);
      setAppState("PlacementTransition");
    },
    [playerShips, playerGrid, currentShipId, setUpdatePlayerShip, setUpdateGrid]
  );

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

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
