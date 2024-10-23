import { TGrid } from "../types/types";

export const getNextShipSegmentCandidates = (
  grid: TGrid,
  shipSegments: number[]
): number[] => {
  console.log("getNextShipSegmentCandidates");
  const candidates = new Set();

  const directions = [
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }, // right
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 }, // down
  ];

  const allDirections = [
    { dx: -1, dy: -1 }, // top-left
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: -1 }, // top-right
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }, // right
    { dx: -1, dy: 1 }, // bottom-left
    { dx: 0, dy: 1 }, // down
    { dx: 1, dy: 1 }, // bottom-right
  ];

  shipSegments.forEach((index) => {
    const x = index % 10;
    const y = Math.floor(index / 10);

    directions.forEach((dir) => {
      const newX = x + dir.dx;
      const newY = y + dir.dy;
      const newIndex = newY * 10 + newX;

      if (
        newX >= 0 &&
        newX < 10 &&
        newY >= 0 &&
        newY < 10 &&
        grid[newIndex].status === "empty" &&
        !shipSegments.includes(newIndex)
      ) {
        const isValid = allDirections.every((adjDir) => {
          const adjX = newX + adjDir.dx;
          const adjY = newY + adjDir.dy;
          const adjIndex = adjY * 10 + adjX;

          return (
            adjX < 0 ||
            adjX >= 10 ||
            adjY < 0 ||
            adjY >= 10 || // Out of bounds
            shipSegments.includes(adjIndex) || // Part of the current ship
            grid[adjIndex].status === "empty" // Completely unoccupied
          );
        });

        if (isValid) {
          candidates.add(newIndex);
        }
      }
    });
  });

  return [...candidates] as number[];
};
