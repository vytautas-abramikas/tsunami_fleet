import React from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCombatant, TCell } from "../types/types";
import { getShipNeighborCells } from "../utils/getShipNeighborCells";
import { getShipCells } from "../utils/getShipCells";
import { isLastSegment } from "../utils/isLastSegment";

export const Grid: React.FC<{ owner: TCombatant }> = ({ owner }) => {
  const {
    userGrid,
    userShips,
    browserGrid,
    browserShips,
    updateShip,
    updateGrid,
    addMessage,
  } = useGameContext();
  const grid = owner === "User" ? userGrid : browserGrid;
  const ships = owner === "User" ? userShips : browserShips;

  const handleCellClick = (cellId: number) => {
    // just a mock function for now
    if (owner === "Browser") {
      handleUserShot(cellId);
    }
  };

  const handleUserShot = (cellId: number) => {
    const cell = grid.cells[cellId];
    // console.log(JSON.stringify(cell));
    let updatedCells: TCell[] = [];
    if (cell.id === cellId && !cell.isVisible) {
      if (cell.status === "ship") {
        if (isLastSegment(cellId, ships, grid)) {
          //if last ship segment is hit, mark all ship segments as sunk
          let sunkCells = getShipCells(cell.shipId, ships, grid).map(
            (cell) => ({
              ...cell,
              status: "sunk" as "sunk",
              isVisible: true,
            })
          );
          //mark neighboring cells of a sunk ship as visible
          let revealedNeighbors: TCell[] = getShipNeighborCells(
            cell.shipId,
            ships,
            grid
          ).map((cell) => ({ ...cell, isVisible: true }));
          //merge all updated cells into one array, set ship state as sunk, display message
          updatedCells = [...sunkCells, ...revealedNeighbors];
          updateShip(owner, { ...ships.list[cell.shipId - 1], isSunk: true });
          addMessage({ text: "Ship sunk!" });
        } else {
          //if the segment hit is not the last one of its ship
          const updatedCell = {
            ...cell,
            status: "hit" as "hit",
            isVisible: true,
          };
          updatedCells = [updatedCell];
          addMessage({ text: "Ship hit!" });
        }
      } else {
        //if an empty cell is hit, just reveal it
        const updatedCell = { ...cell, isVisible: true };
        updatedCells = [updatedCell];
        addMessage({ text: "Missed..." });
      }
    }
    //set new grid state
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
