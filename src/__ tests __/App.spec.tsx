import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GameProvider } from "../context/GameContext";
import { App } from "../components/App";

describe("App should have correct behavior from start to battle", () => {
  it("should render correct elements and react to button clicks from initial state to battle", async () => {
    render(
      <GameProvider>
        <App />
      </GameProvider>
    );
    expect(
      screen.getByRole("heading", { name: "Tsunami Fleet" })
    ).toBeInTheDocument();
    expect(screen.getByText("Dare to brave the seas?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Prepare for battle" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tsunami Fleet © 2024 by Vytautas Abramikas")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Prepare for battle" }));

    await Promise.all([
      waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Randomly" })
        ).toBeInTheDocument()
      ),
      waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Manually" })
        ).toBeInTheDocument()
      ),
      waitFor(() =>
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      ),
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Randomly" }));

    await Promise.all([
      waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Accept" })
        ).toBeInTheDocument()
      ),
      waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Reroll" })
        ).toBeInTheDocument()
      ),
      waitFor(() =>
        expect(screen.getByRole("button", { name: "Exit" })).toBeInTheDocument()
      ),
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    await Promise.all([
      waitFor(() => expect(screen.getByText("Player")).toBeInTheDocument()),
      waitFor(() => expect(screen.getByText("Browser")).toBeInTheDocument()),
    ]);

    await Promise.all([
      waitFor(
        () =>
          expect(
            screen.getByRole("button", { name: "Quit" })
          ).toBeInTheDocument(),
        { timeout: 3000 }
      ),
      waitFor(
        () =>
          expect(
            screen.getByRole("button", { name: "Compare" })
          ).toBeInTheDocument(),
        { timeout: 3000 }
      ),
    ]);
  });
});
