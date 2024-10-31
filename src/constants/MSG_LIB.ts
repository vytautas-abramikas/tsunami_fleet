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
    text: "How do you want your fleet to be placed?",
    classes: "text-4xl font-bold text-white",
  },
  PlacementFirstSegment: {
    text: "Place your size-{0} ship",
    classes: "font-semibold text-white",
  },
  PlacementAdditionalSegment: {
    text: "Place an additional segment",
    classes: "font-semibold text-white",
  },
  PlacementFinalize: {
    text: "Fleet placement complete. Accept layout?",
    classes: "text-4xl font-bold text-white",
  },
  PlacementGenerate: {
    text: "Accept the fleet layout?",
    classes: "text-4xl font-bold text-white",
  },
  BattleStart: {
    text: "{0} gets to start. Engage in battle?",
    classes: "text-4xl font-bold text-white",
  },
  PlayersTurn: {
    text: "{0}, your turn!",
    classes: "font-semibold text-green-400",
  },
  BrowserMissPlayer: {
    text: "{0} missed...",
    classes: "font-semibold text-white",
  },
  PlayerMissBrowser: {
    text: "You missed... {0}'s turn now.",
    classes: "font-semibold text-white",
  },
  BrowserHitPlayerShip: {
    text: "{0} hit your ship and gets to shoot again...",
    classes: "text-semibold text-[#8B0000]",
  },
  PlayerHitBrowserShip: {
    text: "You hit an enemy ship! Shoot again and sink it!",
    classes: "font-semibold text-green-400",
  },
  BrowserSankPlayerShip: {
    text: "{0} sank your ship and gets to shoot again...",
    classes: "text-semibold text-[#8B0000]",
  },
  PlayerSankBrowserShip: {
    text: "You sank an enemy ship! Shoot again to find the next one!",
    classes: "font-semibold text-green-400",
  },
  BrowserVictory: {
    text: "{0} won. Better luck next time, {1}!",
    classes: "text-4xl font-bold text-[#8B0000]",
  },
  PlayerVictory: {
    text: "You won! Congratulations!!!",
    classes: "text-4xl font-bold text-yellow-300",
  },
};
