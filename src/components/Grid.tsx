import React from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCell, TGrid } from "../types/types";

export const Grid: React.FC<{ owner: "User" | "Browser" }> = ({ owner }) => {
  const {
    userGrid,
    userShips,
    browserGrid,
    browserShips,
    setUserGrid,
    setBrowserGrid,
    addMessage,
  } = useGameContext();
  const grid = owner === "User" ? userGrid : browserGrid;
  const ships = owner === "User" ? userShips : browserShips;
  const setGrid = owner === "User" ? setUserGrid : setBrowserGrid;

  const handleCellClick = (cellId: number) => {
    // just a mock function for now
    const cell = grid.cells[cellId];
    console.log(JSON.stringify(cell));
    let updatedCells: TCell[] = [];
    if (cell.id === cellId && !cell.isVisible) {
      if (cell.status === "ship" && cell.shipId) {
        if (isLastSegment(cellId)) {
          updatedCells = getShipCells(cell.shipId).map((cell) => ({
            ...cell,
            status: "sunk" as "sunk",
            isVisible: true,
          }));
          addMessage({ text: "Ship sunk!" });
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
        addMessage({ text: "Missed!" });
      }
    }
    setGrid((prevGrid: TGrid | null) => {
      if (!prevGrid) return prevGrid;

      return {
        ...prevGrid,
        cells: prevGrid.cells.map(
          (gridCell) =>
            updatedCells.find((updated) => updated.id === gridCell.id) ||
            gridCell
        ),
      };
    });
  };

  const isLastSegment = (cellId: number): boolean => {
    const shipId = grid.cells[cellId].shipId;
    if (!shipId) {
      return false;
    } else {
      const shipSegments = ships.list[shipId - 1].segments;
      const cells = getShipCells(shipId);
      const cellsHitLength = cells.reduce(
        (acc, cur) => acc + (cur.status === "hit" ? 1 : 0),
        0
      );
      if (shipSegments.length - cellsHitLength === 1) {
        return true;
      } else {
        return false;
      }
    }
  };

  const getShipCells = (shipId: number): TCell[] => {
    const shipSegments = ships.list[shipId - 1].segments;
    return shipSegments.map((seg) => grid.cells[seg]);
  };

  return (
    <div key={grid.owner} className="grid grid-cols-10 gap-1">
      {grid.cells.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
