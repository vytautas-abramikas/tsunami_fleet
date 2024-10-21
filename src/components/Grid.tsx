import React from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCell, TGrid } from "../types/types";
import { getShipNeighborCells } from "../utils/getShipNeighborCells";
import { getShipCells } from "../utils/getShipCells";
import { isLastSegment } from "../utils/isLastSegment";

export const Grid: React.FC<{ owner: "User" | "Browser" }> = ({ owner }) => {
  const {
    userGrid,
    userShips,
    browserGrid,
    browserShips,
    updateGrid,
    addMessage,
  } = useGameContext();
  const grid = owner === "User" ? userGrid : browserGrid;
  const ships = owner === "User" ? userShips : browserShips;

  const handleCellClick = (cellId: number) => {
    // just a mock function for now
    const cell = grid.cells[cellId];
    // console.log(JSON.stringify(cell));
    let updatedCells: TCell[] = [];
    if (cell.id === cellId && !cell.isVisible) {
      if (cell.status === "ship") {
        if (isLastSegment(cellId, ships, grid)) {
          let sunkCells = getShipCells(cell.shipId, ships, grid).map(
            (cell) => ({
              ...cell,
              status: "sunk" as "sunk",
              isVisible: true,
            })
          );
          let revealedNeighbors: TCell[] = getShipNeighborCells(
            cell.shipId,
            ships,
            grid
          ).map((cell) => ({ ...cell, isVisible: true }));
          updatedCells = [...sunkCells, ...revealedNeighbors];
          addMessage({ text: "Ship sunk!" });
          // console.log(
          //   JSON.stringify(getShipNeighborCells(cell.shipId, ships, grid))
          // );
        } else {
          const updatedCell = {
            ...cell,
            status: "hit" as "hit",
            isVisible: true,
          };
          updatedCells = [updatedCell];
          addMessage({ text: "Ship hit!" });
        }
      } else {
        const updatedCell = { ...cell, isVisible: true };
        updatedCells = [updatedCell];
        addMessage({ text: "Missed..." });
      }
    }
    updateGrid(owner, updatedCells);
  };

  return (
    <div key={grid.owner} className="grid grid-cols-10 gap-1">
      {grid.cells.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
