import { TCellProps } from "../types/types";

export const Cell: React.FC<TCellProps> = ({ cell, onClick }) => {
  return (
    <div
      key={cell.id}
      className={`cell w-10 h-10 border border-gray-700 ${
        cell.isVisible ? cell.status : "unknown"
      }`}
      onClick={() => onClick(cell.id)}
    ></div>
  );
};
