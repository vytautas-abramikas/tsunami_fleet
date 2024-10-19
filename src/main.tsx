import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameProvider } from "./context/GameContext.tsx";
import { App } from "./components/App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>
);
