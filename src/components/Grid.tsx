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
    // console.log(JSON.stringify(cell));
    let updatedCells: TCell[] = [];
    if (cell.id === cellId && !cell.isVisible) {
      if (cell.status === "ship") {
        if (isLastSegment(cellId)) {
          let sunkCells = getShipCells(cell.shipId).map((cell) => ({
            ...cell,
            status: "sunk" as "sunk",
            isVisible: true,
          }));
          let revealedNeighbors: TCell[] = getShipNeighborCells(
            cell.shipId
          ).map((cell) => ({ ...cell, isVisible: true }));
          updatedCells = [...sunkCells, ...revealedNeighbors];
          addMessage({ text: "Ship sunk!" });
          // console.log(JSON.stringify(getShipNeighborCells(cell.shipId)));
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
  };

  const getShipCells = (shipId: number): TCell[] => {
    const shipSegments = ships.list[shipId - 1].segments;
    return shipSegments.map((seg) => grid.cells[seg]);
  };

  const getShipNeighborCells = (shipId: number): TCell[] => {
    const shipSegments = ships.list[shipId - 1].segments;
    let indices = [];
    for (const index of shipSegments) {
      const x = index % 10;
      const y = Math.floor(index / 10);

      const adjacentIndices = [
        index - 11,
        index - 10,
        index - 9,
        index - 1,
        index + 1,
        index + 9,
        index + 10,
        index + 11,
      ];

      for (const adj of adjacentIndices) {
        const adjX = adj % 10;
        const adjY = Math.floor(adj / 10);
        if (
          // this filters out false adjacents in edge cases
          adj >= 0 &&
          adj < 100 &&
          Math.abs(adjX - x) <= 1 &&
          Math.abs(adjY - y) <= 1 &&
          grid.cells[adj].status === "empty"
        ) {
          indices.push(adj);
        }
      }
    }
    const uniqueIndices = [...new Set(indices)];
    return uniqueIndices.map((i) => ({ ...grid.cells[i] }));
  };

  return (
    <div key={grid.owner} className="grid grid-cols-10 gap-1">
      {grid.cells.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
