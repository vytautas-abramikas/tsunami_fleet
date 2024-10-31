import { TBattleStatistics, TGrid, TShips } from "../types/types";

export const getBattleStatistics = (
  playerGrid: TGrid,
  playerShips: TShips,
  browserGrid: TGrid,
  browserShips: TShips
): TBattleStatistics => {
  let stats: TBattleStatistics = {
    player: {
      size4Afloat: 0,
      size4Sunk: 0,
      size3Afloat: 0,
      size3Sunk: 0,
      size2Afloat: 0,
      size2Sunk: 0,
      size1Afloat: 0,
      size1Sunk: 0,
    },
    browser: {
      size4Afloat: 0,
      size4Sunk: 0,
      size3Afloat: 0,
      size3Sunk: 0,
      size2Afloat: 0,
      size2Sunk: 0,
      size1Afloat: 0,
      size1Sunk: 0,
    },
  };

  return stats;
};
