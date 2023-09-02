import { InfoType, MarkerType } from "../types.js";
import { getObjectFromPath, removeUndefineds } from "../util.js";
import { parseCreatureDropList } from "./parseDrops.js";

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