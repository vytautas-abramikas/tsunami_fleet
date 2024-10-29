import { TCell, TGrid, TShip } from "../types/types";

export const getPlayerPlacementResults = (
  cellId: number,
  currentShip: TShip,
  grid: TGrid
): {
  isShipFinished: boolean;
  shipToProcess: TShip;
  cellsToProcess: TCell[];
} => {
  let isShipFinished: boolean = false;
  let shipToProcess: TShip = { ...currentShip };
  let cellsToProcess: TCell[] = [];
  // first segment being placed
  if (currentShip.segments.length === 0) {
    if (currentShip.size > 1) {
      isShipFinished = false;
      shipToProcess = {
        ...shipToProcess,
        segments: [...shipToProcess.segments, cellId],
      };
      cellsToProcess = [
        {
          ...grid[cellId],
          isVisible: true,
          status: "segment",
          shipId: currentShip.id,
        },
      ];
    } else {
      // 1x ship is finished at once, needs neighbors revealed
    }
  } else {
    // additional segment being placed
  }

  return { isShipFinished, shipToProcess, cellsToProcess };
};
