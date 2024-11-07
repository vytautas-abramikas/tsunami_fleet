import { TShips } from "../types/types";
import { getGenerateShips } from "../utils/getGenerateShips";
import { SHIP_CELLS_ON_GRID } from "../constants/FLEET_COMPOSITION";

describe("getGenerateShips should work correctly", () => {
  const results: TShips[] = [];

  beforeAll(() => {
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      results.push(getGenerateShips());
    }
  });

  it("should produce results when run 1000 times", () => {
    expect(results.length).toBe(1000);
  });
  it("should produce a correct number of unique ship cell ids 1000 times", () => {
    const allCorrect = results.every((result) => {
      const allSegmentIds = result.reduce((segments: number[], ship) => {
        ship.segments.forEach((segment) => segments.push(segment));
        return segments;
      }, []);
      const uniqueIds = new Set(allSegmentIds);
      return (
        allSegmentIds.length === SHIP_CELLS_ON_GRID &&
        uniqueIds.size === SHIP_CELLS_ON_GRID
      );
    });
    expect(allCorrect).toBe(true);
  });
});
