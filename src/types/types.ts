export type TCombatant = "User" | "Browser";

export type TAppState =
  | "Welcome"
  | "PlacementStart"
  | "PlacementGenerate"
  | "PlacementFirstSegment"
  | "PlacementAdditionalSegments"
  | "PlacementFinalize"
  | "Battle"
  | "BattleOver";

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
  owner: TCombatant;
  cells: TCell[];
};

export type TShip = {
  id: number;
  size: number;
  segments: number[];
};

export type TShips = {
  owner: TCombatant;
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
  appState: TAppState;
  activeCombatant: TCombatant;
  userGrid: TGrid;
  browserGrid: TGrid;
  userShips: TShips;
  browserShips: TShips;
  messages: TMessage[];
  buttons: TButtonProps[];
  setAppState: React.Dispatch<React.SetStateAction<TAppState>>;
  setActiveCombatant: React.Dispatch<React.SetStateAction<TCombatant>>;
  updateGrid: (owner: TCombatant, updatedCells: TCell[]) => void;
  addMessage: (newMessage: TMessage) => void;
};
