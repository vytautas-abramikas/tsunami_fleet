export type Combatant = "User" | "Browser";

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
  owner: Combatant;
  cells: TCell[];
};

export type TShip = {
  id: number;
  size: number;
  segments: number[];
  isSunk: boolean;
};

export type TShips = {
  owner: Combatant;
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
  activeCombatant: Combatant;
  userGrid: TGrid;
  browserGrid: TGrid;
  userShips: TShips;
  browserShips: TShips;
  messages: TMessage[];
  buttons: TButtonProps[];
  setActiveCombatant: React.Dispatch<React.SetStateAction<Combatant>>;
  updateShip: (owner: Combatant, ship: TShip) => void;
  updateGrid: (owner: Combatant, updatedCells: TCell[]) => void;
  addMessage: (newMessage: TMessage) => void;
};
