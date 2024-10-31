import { TBattleStatistics, TGrid, TShips } from "../types/types";
import { FLEET_COMPOSITION } from "../constants/FLEET_COMPOSITION";

const getShipsAfloatAndSunkBySize = (
  size: number,
  ships: TShips,
  grid: TGrid
): { afloat: number; sunk: number } => {
  const sizedShips = ships.filter((ship) => ship.size === size);
  const numberOfShips = sizedShips.length;
  const sunk = sizedShips.filter((ship) =>
    ship.segments.every((segment) => grid[segment].status === ("sunk" as const))
  ).length;
  const afloat = numberOfShips - sunk;
  return { afloat, sunk };
};

export const getBattleStatistics = (
  playerShips: TShips,
  playerGrid: TGrid,
  browserShips: TShips,
  browserGrid: TGrid
): TBattleStatistics => {
  // console.log("getBattleStatistics");
  const stats: TBattleStatistics = { player: [], browser: [] };

  const sizes = Array.from(new Set(FLEET_COMPOSITION));

  sizes.forEach((shipSize) => {
    const { afloat: playerShipsAfloat, sunk: playerShipsSunk } =
      getShipsAfloatAndSunkBySize(shipSize, playerShips, playerGrid);
    stats.player.push({
      size: String(shipSize),
      afloat: playerShipsAfloat,
      sunk: playerShipsSunk,
    });

    const { afloat: browserShipsAfloat, sunk: browserShipsSunk } =
      getShipsAfloatAndSunkBySize(shipSize, browserShips, browserGrid);
    stats.browser.push({
      size: String(shipSize),
      afloat: browserShipsAfloat,
      sunk: browserShipsSunk,
    });
  });
  // console.log(stats);
  return stats;
};
