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
  let stats: TBattleStatistics = {
    player: FLEET_COMPOSITION.map((shipSize) => ({
      name: `Size ${shipSize}`,
      size: shipSize,
      afloat: 0,
      sunk: 0,
    })),
    browser: FLEET_COMPOSITION.map((shipSize) => ({
      name: `Size ${shipSize}`,
      size: shipSize,
      afloat: 0,
      sunk: 0,
    })),
  };

  FLEET_COMPOSITION.forEach((shipSize, index) => {
    const { afloat: playerShipsAfloat, sunk: playerShipsSunk } =
      getShipsAfloatAndSunkBySize(shipSize, playerShips, playerGrid);
    stats.player[index].afloat = playerShipsAfloat;
    stats.player[index].sunk = playerShipsSunk;

    const { afloat: browserShipsAfloat, sunk: browserShipsSunk } =
      getShipsAfloatAndSunkBySize(shipSize, browserShips, browserGrid);
    stats.browser[index].afloat = browserShipsAfloat;
    stats.browser[index].sunk = browserShipsSunk;
  });

  return stats;
};
