import React from "react";
import { useGameContext } from "../hooks/useGameContext";
import { Cell } from "./Cell";
import { TCell, TGrid } from "../types/types";

export const Grid: React.FC<{ owner: "User" | "Browser" }> = ({ owner }) => {
  const { userGrid, browserGrid, setUserGrid, setBrowserGrid } =
    useGameContext();
  const grid = owner === "User" ? userGrid : browserGrid;
  const setGrid = owner === "User" ? setUserGrid : setBrowserGrid;

  const handleCellClick = (cellId: number) => {
    // just a mock function for now
    setGrid((prevGrid: TGrid) => {
      const updatedCells: TCell[] = prevGrid.cells.map((cell) => {
        if (cell.id === cellId && !cell.isVisible) {
          const newStatus: "hit" | "empty" =
            cell.status === "ship" ? "hit" : "empty";
          return {
            ...cell,
            isVisible: true,
            status: newStatus,
          };
        }
        return cell;
      });
      return { ...prevGrid, cells: updatedCells };
    });
  };

  return (
    <div key={grid.owner} className="grid grid-cols-10 gap-1">
      {grid.cells.map((cell) => (
        <Cell key={cell.id} cell={cell} onClick={handleCellClick} />
      ))}
    </div>
  );
};
