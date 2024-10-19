import { TGrid, TShips } from "../types/types";

const getRandomPosition = () => Math.floor(Math.random() * 10);

const isPlacementValid = (grid: TGrid, segments: number[]) => {
  for (const index of segments) {
    const x = index % 10;
    const y = Math.floor(index / 10);

    const adjacentIndices = [
      index - 11,
      index - 10,
      index - 9,
      index - 1,
      index + 1,
      index + 9,
      index + 10,
      index + 11,
    ];

    for (const adj of adjacentIndices) {
      const adjX = adj % 10;
      const adjY = Math.floor(adj / 10);
      if (
        adj >= 0 &&
        adj < 100 &&
        Math.abs(adjX - x) <= 1 &&
        Math.abs(adjY - y) <= 1
      ) {
        if (grid.cells[adj].status === "ship") {
          return false;
        }
      }
    }
  }
  return true;
};

const generateShipSegments = (
  start: number,
  size: number,
  grid: TGrid
): number[] => {
  let segments = [start];
  let attempts = 0;
  while (segments.length < size && attempts < 100) {
    const x = segments[segments.length - 1] % 10;
    const y = Math.floor(segments[segments.length - 1] / 10);
    const possibleMoves = [
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }, // right
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 }, // down
    ];
    possibleMoves.sort(() => Math.random() - 0.5);

    let validMoveFound = false;
    for (const move of possibleMoves) {
      const newX = x + move.dx;
      const newY = y + move.dy;
      const newIndex = newY * 10 + newX;

      if (
        newX >= 0 &&
        newX < 10 &&
        newY >= 0 &&
        newY < 10 &&
        grid.cells[newIndex].status === "empty" &&
        !segments.includes(newIndex)
      ) {
        segments.push(newIndex);
        validMoveFound = true;
        break;
      }
    }

    if (!validMoveFound) {
      segments = [start];
      attempts++;
    }
  }
  return segments;
};

export const placeShips = (grid: TGrid, ships: TShips): TGrid => {
  ships.list.forEach((ship) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      const start = getRandomPosition() + getRandomPosition() * 10;
      const segments = generateShipSegments(start, ship.size, grid);

      if (segments.length === ship.size && isPlacementValid(grid, segments)) {
        ship.segments = segments;
        segments.forEach((index) => {
          grid.cells[index].status = "ship";
          grid.cells[index].shipId = ship.id;
        });
        placed = true;
        console.log(`Placed ship ID ${ship.id} at positions: ${segments}`);
      }
      attempts++;
      if (attempts >= 100) {
        console.error(
          `Failed to place ship ID ${ship.id} after ${attempts} attempts`
        );
        break;
      }
    }
  });

  return grid;
};
