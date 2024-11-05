import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { GameProvider } from "../context/GameContext";
import { App } from "../components/App";

test("demo", () => {
  expect(true).toBe(true);
});

test("Renders the main page", () => {
  render(
    <GameProvider>
      <App />
    </GameProvider>
  );
  expect(true).toBeTruthy();
});
