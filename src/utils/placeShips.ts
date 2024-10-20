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
  let attempts = 0;
  const maxAttempts = 100;
  let segments: number[];

  while (attempts < maxAttempts) {
    segments = [start];
    while (segments.length < size) {
      const candidates = [];
      for (const seg of segments) {
        const x = seg % 10;
        const y = Math.floor(seg / 10);
        const possibleMoves = [
          { dx: -1, dy: 0 }, // left
          { dx: 1, dy: 0 }, // right
          { dx: 0, dy: -1 }, // up
          { dx: 0, dy: 1 }, // down
        ];
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
            candidates.push(newIndex);
          }
        }
      }
      if (candidates.length > 0) {
        const newSegment =
          candidates[Math.floor(Math.random() * candidates.length)];
        segments.push(newSegment);
      } else {
        break;
      }
    }
    if (segments.length === size) {
      return segments;
    }
    attempts++;
  }
  return [];
};

export const placeShips = (grid: TGrid, ships: TShips): TGrid => {
  const occupiedPositions = new Set<number>();

  ships.list.forEach((ship) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      let isCellAvailable = false;
      let start = -1;
      while (!isCellAvailable) {
        start = getRandomPosition() + getRandomPosition() * 10;
        let isValidPosition = isPlacementValid(grid, [start]);
        if (grid.cells[start].status === "empty" && isValidPosition) {
          isCellAvailable = true;
        }
      }
      const segments = generateShipSegments(start, ship.size, grid);

      if (segments.length === ship.size && isPlacementValid(grid, segments)) {
        const uniquePositions = new Set(segments);
        if (
          uniquePositions.size === ship.size &&
          [...uniquePositions].every((pos) => !occupiedPositions.has(pos))
        ) {
          ship.segments = segments;
          segments.forEach((index) => {
            grid.cells[index].status = "ship";
            grid.cells[index].shipId = ship.id;
            occupiedPositions.add(index);
          });
          placed = true;
          console.log(`Placed ship ID ${ship.id} at positions: ${segments}`);
        }
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

  // Validation step to check the number of occupied cells
  const shipSegmentsCount = grid.cells.filter(
    (cell) => cell.status === "ship"
  )?.length;

  if (shipSegmentsCount !== 20) {
    console.error(
      `Mismatch in occupied cells: Found ${shipSegmentsCount}, expected 20`
    );
  } else {
    console.log(
      `All ships placed correctly with ${shipSegmentsCount} occupied cells`
    );
  }

  return grid;
};
