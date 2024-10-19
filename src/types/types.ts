export type TPoint = {
  x: number;
  y: number;
};

export type TCell = {
  id: number;
  pos: TPoint;
  isVisible: boolean;
  status: "empty" | "ship" | "hit" | "sunk";
  shipId?: number;
};

export type TCellProps = {
  cell: TCell;
  onClick: (id: number) => void;
};

export type TGrid = {
  owner: "User" | "Browser";
  cells: TCell[];
};

export type TShip = {
  id: number;
  size: number;
  segments: number[];
  sunk: boolean;
};

export type TShips = {
  owner: "User" | "Browser";
  list: TShip[];
};

export type TGameContext = {
  userGrid: TGrid;
  browserGrid: TGrid;
  setUserGrid: React.Dispatch<React.SetStateAction<TGrid>>;
  setBrowserGrid: React.Dispatch<React.SetStateAction<TGrid>>;
};
