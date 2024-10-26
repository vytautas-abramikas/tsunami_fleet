import React from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCombatant, TCell } from "../types/types";
import { getShipNeighborCells } from "../utils/getShipNeighborCells";
import { getShipCells } from "../utils/getShipCells";
import { isLastSegment } from "../utils/isLastSegment";
import { isLastSegmentToSinkOnGrid } from "../utils/isLastSegmentToSinkOnGrid";

export const Grid: React.FC<{ owner: TCombatant }> = ({ owner }) => {
  const {
    appState,
    activeCombatant,
    userGrid,
    userShips,
    browserGrid,
    browserShips,
    setAppState,
    setUpdateGrid,
    setAddMessage,
    setActiveCombatant,
  } = useGameContext();
  const grid = owner === "User" ? userGrid : browserGrid;
  const ships = owner === "User" ? userShips : browserShips;

  const handleCellClick = (cellId: number) => {
    // just a mock function for now
    if (
      appState === "Battle" &&
      activeCombatant === "User" &&
      owner === "Browser"
    ) {
      // console.log(browserGrid);
      handleUserShot(cellId);
    }
  };

  const handleUserShot = (cellId: number) => {
    const cell = grid[cellId];
    const isBrowsersLastSegment = isLastSegmentToSinkOnGrid(grid);
    // console.log(JSON.stringify(cell));
    let updatedCells: TCell[] = [];
    if (cell.id === cellId && !cell.isVisible) {
      if (cell.status === "ship") {
        if (isLastSegment(cellId, ships, grid)) {
          //if last ship segment is hit, mark all ship segments as sunk
          console.log(
            "User shooting, last segment of a ship detected, cellId: ",
            cellId
          );
          const sunkCells = getShipCells(cell.shipId, ships, grid).map(
            (cell) => ({
              ...cell,
              status: "sunk" as "sunk",
              isVisible: true,
            })
          );
          //mark neighboring cells of a sunk ship as visible
          const revealedNeighbors: TCell[] = getShipNeighborCells(
            cell.shipId,
            ships,
            grid
          ).map((cell) => ({ ...cell, isVisible: true }));
          //merge all updated cells into one array, display message
          updatedCells = [...sunkCells, ...revealedNeighbors];
          if (isBrowsersLastSegment) {
            console.log("---last segment on grid is to be sunk by User ----");
            setAddMessage({
              text: "User won! Congratulations!!!",
              classes: "text-4xl font-bold text-yellow-300",
            });
            console.log("User shooting, BattleOver is to be set ", cellId);
            setAppState("BattleOver");
          } else {
            setAddMessage({ text: "Ship sunk! Find the next one!" });
          }
        } else {
          //if the segment hit is not the last one of its ship
          const updatedCell = {
            ...cell,
            status: "hit" as "hit",
            isVisible: true,
          };
          updatedCells = [updatedCell];
          setAddMessage({ text: "Ship hit! Try and sink it!" });
        }
      } else {
        //if an empty cell is hit, just reveal it
        const updatedCell = { ...cell, isVisible: true };
        updatedCells = [updatedCell];
        setAddMessage({ text: "Missed... Browser's turn now." });
        setActiveCombatant("Browser");
      }
    }
    //set new grid state
    setUpdateGrid(owner, updatedCells);
  };

  return (
    <div key={owner} className="grid grid-cols-10 gap-1">
      {grid.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
