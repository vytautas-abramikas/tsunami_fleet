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
      const allSegmentIds = result.reduce((segments, ship) => {
        ship.segments.forEach((segment) => segments.add(segment));
        return segments;
      }, new Set());
      return allSegmentIds.size === SHIP_CELLS_ON_GRID;
    });
    expect(allCorrect).toBe(true);
  });
});
