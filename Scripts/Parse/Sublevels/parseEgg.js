import { InfoType, MarkerType } from "../types.js";
import { getObjectFromPath, removeUndefineds } from "../util.js";
import { parseCreatureDropList } from "./parseDrops.js";

export const DefaultEggObject = {
  type: MarkerType.BreakableEgg,
  infoType: InfoType.Breakable,
  isBig: false,
  // TODO: unknown if these are the true default drops.
  drops: [
    {
      item: "GHoney_C",
      chance: 0.75,
      min: 1,
      max: 1
    },
    {
      item: "GPiecePick_C",
      chance: 0.2,
      min: 1,
      max: 1
    },
    {
      item: "GHotExtract_C",
      chance: 0.05,
      min: 1,
      max: 1
    }
  ]
};

// NOTE: there is 1 egg in an Objects file (Area010 Day)
export function isEggComp(comp) {
  return !!comp.Properties.EggAI;
}

export function parseEggComp(comp, compsList) {
  const EggAI = getObjectFromPath(comp.Properties.EggAI, compsList);
  const drops = parseCreatureDropList(EggAI);

  return removeUndefineds({
    type: MarkerType.BreakableEgg,
    infoType: InfoType.Breakable,
    isBig: comp.Type === 'GBigEgg_C',
    drops
  });
}