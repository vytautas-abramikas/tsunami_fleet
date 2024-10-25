import { TCombatant, TGrid } from "../types/types";

export const getAdjacentHitCandidates = (
  owner: TCombatant,
  grid: TGrid,
  hitSegments: number[]
): number[] => {
  console.log("getAdjacentHitCandidates");
  const candidates = new Set();

  const directions = [
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }, // right
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 }, // down
  ];

  hitSegments.forEach((index) => {
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
        (owner === "Browser"
          ? !grid[newIndex].isVisible
          : !grid[newIndex].isVisibleToBrowser) &&
        !hitSegments.includes(newIndex)
      ) {
        candidates.add(newIndex);
      }
    });
  });
  return [...candidates] as number[];
};
