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
  PlacementGenerate: {
    text: "Admiral, do you accept the fleet layout?",
    classes: "text-4xl font-bold",
  },
  BattleStart: {
    text: "{0} gets to start. Engage in battle?",
    classes: "text-4xl font-bold",
  },
  UsersTurn: {
    text: "{0}, your turn!",
    classes: "font-semibold text-green-400",
  },
  BrowserMissUser: { text: "{0} missed..." },
  UserMissBrowser: { text: "You missed... {0}'s turn now." },
  BrowserHitUserShip: {
    text: "{0} hit {1}'s ship and gets to shoot again...",
    classes: "text-semibold text-red-400",
  },
  UserHitBrowserShip: {
    text: "You hit an enemy ship! Shoot again and sink it!",
    classes: "font-semibold text-green-400",
  },
  BrowserSankUserShip: {
    text: "{0} sank {1}'s ship and gets to shoot again...",
    classes: "text-semibold text-red-400",
  },
  UserSankBrowserShip: {
    text: "You sank an enemy ship! Shoot again to find the next one!",
    classes: "font-semibold text-green-400",
  },
  BrowserVictory: {
    text: "{0} won. Better luck next time Admiral!",
    classes: "text-4xl font-bold text-red-400",
  },
  UserVictory: {
    text: "You won! Congratulations!!!",
    classes: "text-4xl font-bold text-yellow-300",
  },
};
