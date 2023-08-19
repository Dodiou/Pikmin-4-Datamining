import { ObjectTypes } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { parseCreatureDropList, parseObjectDropList } from "../parseDrops.js";

function parseMushroomComp(comp, compsList) {
  const AIComponent = getObjectFromPath(comp.Properties.KomushAI || comp.Properties.PoisonMushAI, compsList);
  const isPoison = comp.Type.includes('Poison');
  // So many combinations: Full type regex below (I think)
  //   G(Sticky|Poison)?(Kom|M)ush(L|S)?_C
  // "Ko" means child/small. Hopefully no Kingcaps use 'Komush'.
  // "Sticky" mushrooms appear on StickyFloor's. These are never large
  const isLarge = !comp.Type.includes('Komush') && !comp.Type.includes('Sticky');

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
