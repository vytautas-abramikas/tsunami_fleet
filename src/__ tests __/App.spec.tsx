import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { GameProvider } from "../context/GameContext";
import { App } from "../components/App";

describe("App initial components are rendered", () => {
  it("has a correct heading", () => {
    const { getByRole } = render(
      <GameProvider>
        <App />
      </GameProvider>
    );
    expect(getByRole("heading", { name: "Tsunami Fleet" })).toBeInTheDocument();
  });
  it("has a correct message", () => {
    const { getByText } = render(
      <GameProvider>
        <App />
      </GameProvider>
    );
    expect(getByText("Dare to brave the seas?")).toBeInTheDocument();
  });
  it("has a correct button", () => {
    const { getByRole } = render(
      <GameProvider>
        <App />
      </GameProvider>
    );
    expect(
      getByRole("button", { name: "Prepare for battle" })
    ).toBeInTheDocument();
  });
  it("has correct copyright info", () => {
    const { getByText } = render(
      <GameProvider>
        <App />
      </GameProvider>
    );
    expect(
      getByText("Tsunami Fleet © 2024 by Vytautas Abramikas")
    ).toBeInTheDocument();
  });
});
