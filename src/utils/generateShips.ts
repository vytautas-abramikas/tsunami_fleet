import { TGrid, TShips } from "../types/types";
import { initializeGrid } from "./initializeGrid";
import { initializeShips } from "./initializeShips";

const getRandomPosition = () => Math.floor(Math.random() * 10);

const isShipPlacementValid = (grid: TGrid, segments: number[]) => {
  const anyCellsOccupied: boolean = segments.some(
    (segment) => grid.cells[segment].status === "ship"
  );
  if (anyCellsOccupied) {
    //any segments in grid cells already occupied
    return false;
  }
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
        // this filters out false adjacents in edge cases, they are either out of bounds or on the other edge, so there is no need to check them
        adj >= 0 &&
        adj < 100 &&
        Math.abs(adjX - x) <= 1 &&
        Math.abs(adjY - y) <= 1
      ) {
        if (grid.cells[adj].status === "ship") {
          //only checks if a cell is occupied if it is really adjacent
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
    segments = [start]; //First segment is the starting position
    while (segments.length < size) {
      const candidates: number[] = [];
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
            //position is within the grid, not occupied, not yet selected for segment placement and not yet a candidate
            newX >= 0 &&
            newX < 10 &&
            newY >= 0 &&
            newY < 10 &&
            grid.cells[newIndex].status === "empty" &&
            !segments.includes(newIndex) &&
            !candidates.includes(newIndex)
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
        // no possible further cells to place a segment, retry from starting position
        break;
      }
    }
    if (segments.length === size) {
      return segments;
    }
    attempts++;
  }
  // failed to generate suitable segments for a ship from starting position in a maximum number of allowed attempts, abort, return empty array
  return [];
};

export const generateShips = (owner: "User" | "Browser"): TShips => {
  let grid = initializeGrid(owner);
  let ships = initializeShips(owner);
  const occupiedPositions = new Set<number>();
  const maxAttempts = 100;

  ships.list.forEach((ship) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < maxAttempts) {
      let isValidPosition = false;
      let start = -1;
      while (!isValidPosition) {
        // Get a suitable starting cell to build a ship
        start = getRandomPosition() + getRandomPosition() * 10;
        isValidPosition = isShipPlacementValid(grid, [start]);
      }
      const segments = generateShipSegments(start, ship.size, grid);
      if (
        segments.length === ship.size &&
        isShipPlacementValid(grid, segments)
      ) {
        // Ship length is correct and placement area is clear
        const uniquePositions = new Set(segments);
        if (
          // Ship segments are all in different cells and all the segment cells are not yet occupied
          uniquePositions.size === ship.size &&
          [...uniquePositions].every((pos) => !occupiedPositions.has(pos))
        ) {
          ship.segments = segments;
          segments.forEach((index) => {
            grid.cells[index].status = "ship";
            occupiedPositions.add(index);
          });
          placed = true;
          // console.log(
          //   `Placed ship ID ${ship.id} at positions: ${segments} in ${
          //     attempts + 1
          //   } attempts`
          // );
        }
      }
      attempts++;
      if (attempts >= maxAttempts) {
        console.error(
          `Failed to place ship ID ${ship.id} after ${attempts} attempts`
        );
        break;
      }
    }
  });

  // Final validation - there is an exact number of ship segments needed on board
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

  return ships;
};
