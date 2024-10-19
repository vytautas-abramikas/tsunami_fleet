import { TGrid, TShips } from "../types/types";

const getRandomPosition = () => Math.floor(Math.random() * 10);

const isPlacementValid = (
  grid: TGrid,
  segments: number[],
  shipSize: number
) => {
  for (let i = 0; i < shipSize; i++) {
    const index = segments[i];
    const x = index % 10;
    const y = Math.floor(index / 10);

    // Check adjacent cells to ensure there's at least one empty cell separating ships
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

export const placeShips = (grid: TGrid, ships: TShips): TGrid => {
  ships.list.forEach((ship) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      // Ensure the loop terminates after a certain number of attempts
      const x = getRandomPosition();
      const y = getRandomPosition();
      const horizontal = Math.random() < 0.5;

      const segments = [];
      for (let i = 0; i < ship.size; i++) {
        const posX = horizontal ? x + i : x;
        const posY = horizontal ? y : y + i;
        const index = posY * 10 + posX;

        if (posX < 10 && posY < 10 && grid.cells[index].status === "empty") {
          segments.push(index);
        } else {
          break;
        }
      }

      if (
        segments.length === ship.size &&
        isPlacementValid(grid, segments, ship.size)
      ) {
        ship.segments = segments;
        segments.forEach((index) => {
          grid.cells[index].status = "ship";
          grid.cells[index].shipId = ship.id;
        });
        placed = true;
        console.log(`Placed ship ID ${ship.id} at positions: ${segments}`);
      }
      attempts++;
      if (attempts === 100) {
        console.error(
          `Failed to place ship ID ${ship.id} after ${attempts} attempts`
        );
      }
    }
  });

  return grid;
};
