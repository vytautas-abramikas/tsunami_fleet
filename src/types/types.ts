export type TCell = {
  id: number;
  isVisible: boolean;
  status: "empty" | "segment" | "ship" | "hit" | "sunk";
  shipId: number;
  isActive: boolean;
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

export type TMessage = {
  text: string;
  classes?: string;
};

export type TButtonProps = {
  text: string;
  classes: string;
  onClick: (...args: any[]) => any;
  args?: any[];
};

export type TGameContext = {
  userGrid: TGrid;
  browserGrid: TGrid;
  userShips: TShips;
  browserShips: TShips;
  messages: TMessage[];
  buttons: TButtonProps[];
  updateShip: (owner: "User" | "Browser", ship: TShip) => void;
  updateGrid: (owner: "User" | "Browser", updatedCells: TCell[]) => void;
  addMessage: (newMessage: TMessage) => void;
};
