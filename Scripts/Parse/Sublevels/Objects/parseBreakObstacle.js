import { ObjectTypes } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { parseCreatureDropList, parseObjectDropList } from "../parseDrops.js";

function parseMushroomComp(comp, compsList) {
  // NOTE: ignore 'Sticky' in type; this just means it's on a StickyFloor
  const AIComponent = getObjectFromPath(comp.Properties.KomushAI || comp.Properties.PoisonMushAI, compsList);
  const isPoison = comp.Type.includes('Poison');
  // So many combinations: Full type regex below (I think)
  //   G(Sticky|Poison)?(Kom|M)ush(Poison)?(L|S)?_C
  const isLarge = false; // Unknown how to find this 

  return removeUndefineds({
    type: ObjectTypes.Mushroom,
    isPoison,
    isLarge,
    // NOTE: even though these only appear in Objects files, they use Teki/Creature AI params
    drops: parseCreatureDropList(AIComponent)
  });
}

export function isBreakObstacleComp(comp) {
  return !!(
    // all mushrooms, not just child/small ones
    comp.Properties.KomushAI ||
    comp.Properties.PoisonMushAI ||
    comp.Properties.CrackPotAI ||
    // hydro jelly
    comp.Properties.CrushJellyAI
  )
}

export function parseBreakObstacleComp(comp, compsList) {
  if (comp.Properties.KomushAI || comp.Properties.PoisonMushAI) {
    return parseMushroomComp(comp, compsList);
  }
  else if (comp.Properties.CrackPotAI) {
    const crackPotComp = getObjectFromPath(comp.Properties.CrackPotAI, compsList);
    return removeUndefineds({
      type: ObjectTypes.Pot,
      drops: parseObjectDropList(crackPotComp)
    });
  }
  else if (comp.Properties.CrushJellyAI) {
    const crushJellyComp = getObjectFromPath(comp.Properties.CrushJellyAI, compsList);
    // TODO CrushJellyAIParameter.SearchCIDList for the object this contains
    return removeUndefineds({
      type: ObjectTypes.HydroJelly,
      drops: parseObjectDropList(crushJellyComp)
    });
  }
  throw new Error(`Unknown BreakableObstacle component ${comp.Type}`);
}
