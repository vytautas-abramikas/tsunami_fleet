export type TCell = {
  id: number;
  isVisible: boolean;
  status: "empty" | "part-ship" | "ship" | "hit" | "sunk";
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
};

export type TShips = {
  owner: "User" | "Browser";
  list: TShip[];
};

export type TMessage = {
  text: string;
  tailwindClasses?: string;
};

export type TGameContext = {
  userGrid: TGrid;
  browserGrid: TGrid;
  userShips: TShips;
  browserShips: TShips;
  messages: TMessage[];
  setUserGrid: React.Dispatch<React.SetStateAction<TGrid | null>>;
  setBrowserGrid: React.Dispatch<React.SetStateAction<TGrid | null>>;
  setUserShips: React.Dispatch<React.SetStateAction<TShips | null>>;
  setBrowserShips: React.Dispatch<React.SetStateAction<TShips | null>>;
  addMessage: (newMessage: TMessage) => void;
};
