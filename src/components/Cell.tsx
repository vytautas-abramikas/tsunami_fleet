import { TCellProps } from "../types/types";

export const Cell: React.FC<TCellProps> = ({ cell, onClick }) => {
  return (
    <div
      key={cell.id}
      className={`cell w-10 h-10 border border-gray-700 shadow-lg ${
        cell.isVisible ? cell.status : "unknown"
      } ${!cell.isActive ? "pointer-events-none" : ""}`}
      onClick={() => onClick(cell.id)}
    ></div>
  );
};
