export type TCombatant = "User" | "Browser";

export type TAppState =
  | "Welcome"
  | "PlacementStart"
  | "PlacementGenerate"
  | "PlacementFirstSegment"
  | "PlacementAdditionalSegments"
  | "PlacementFinalize"
  | "BattleStart"
  | "Battle"
  | "BattlePause"
  | "BattleOver";

export type TCell = {
  id: number;
  isVisible: boolean;
  isVisibleToBrowser: boolean;
  status: "empty" | "segment" | "ship" | "hit" | "sunk";
  shipId: number;
  isActive: boolean;
};

export type TCellProps = {
  cell: TCell;
  onClick: (id: number) => void;
};

//just there to distinguish a full grid from an array of cells of arbitrary length in a function declaration
export type TGrid = TCell[];

export type TShip = {
  id: number;
  size: number;
  segments: number[];
};

//just there to distinguish a full list of ships from an array of ships of arbitrary length in a function declaration
export type TShips = TShip[];

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
  setUpdateGrid: (owner: TCombatant, updatedCells: TCell[]) => void;
  setAddMessage: (newMessage: TMessage) => void;
};
