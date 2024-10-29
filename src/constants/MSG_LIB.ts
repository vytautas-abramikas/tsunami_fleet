import { TMessage } from "../types/types";

export const fillIn = (message: TMessage, values: string[]): TMessage => {
  let text = message.text;
  values.forEach((value, index) => {
    text = text.replace(`{${index}}`, value);
  });
  return { ...message, text };
};

export const MSG_LIB: { [key: string]: TMessage } = {
  Welcome: {
    text: "Dare to brave the seas?",
    classes: "text-4xl font-bold text-white",
  },
  PlacementStart: {
    text: "Admiral, how do you want your fleet to be placed?",
    classes: "text-4xl font-bold",
  },
  PlacementFirstSegment: {
    text: "Admiral, place your size-{0} ship",
    classes: "text-4xl font-bold",
  },
  PlacementAdditionalSegment: {
    text: "Place an additional segment of your size-{0} ship",
    classes: "font-semibold text-white",
  },
  PlacementGenerate: {
    text: "Admiral, do you accept the fleet layout?",
    classes: "text-4xl font-bold",
  },
  BattleStart: {
    text: "{0} gets to start. Engage in battle?",
    classes: "text-4xl font-bold",
  },
  PlayersTurn: {
    text: "{0}, your turn!",
    classes: "font-semibold text-green-400",
  },
  BrowserMissPlayer: { text: "{0} missed..." },
  PlayerMissBrowser: { text: "You missed... {0}'s turn now." },
  BrowserHitPlayerShip: {
    text: "{0} hit your ship and gets to shoot again...",
    classes: "text-semibold text-red-400",
  },
  PlayerHitBrowserShip: {
    text: "You hit an enemy ship! Shoot again and sink it!",
    classes: "font-semibold text-green-400",
  },
  BrowserSankPlayerShip: {
    text: "{0} sank your ship and gets to shoot again...",
    classes: "text-semibold text-red-400",
  },
  PlayerSankBrowserShip: {
    text: "You sank an enemy ship! Shoot again to find the next one!",
    classes: "font-semibold text-green-400",
  },
  BrowserVictory: {
    text: "{0} won. Better luck next time, {1}!",
    classes: "text-4xl font-bold text-red-400",
  },
  PlayerVictory: {
    text: "You won! Congratulations!!!",
    classes: "text-4xl font-bold text-yellow-300",
  },
};
