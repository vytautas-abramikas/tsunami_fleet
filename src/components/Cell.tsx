import { TCellProps } from "../types/types";

export const Cell: React.FC<TCellProps> = ({ cell, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(cell.id);
  };
  return (
    <button
      key={cell.id}
      className={`cell p-0 w-10 h-10 border border-gray-700 shadow-lg ${
        cell.isVisible ? cell.status : "unknown"
      } ${!cell.isActive || cell.isVisible ? "pointer-events-none" : ""}`}
      onClick={handleClick}
    ></button>
  );
};
