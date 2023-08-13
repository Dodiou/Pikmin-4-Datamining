import { HeatObstacleVariants, ObjectTypes } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { parseObjectDropList } from "../parseDrops.js";

export function isHeatObstacleComp(comp) {
  return !!(
    comp.Properties.ColdBoxAI ||
    comp.Properties.BurningAI ||
    comp.Properties.TanebiStationAI
  );
}

export function parseHeatObstacleComp(comp, compsList) {
  if (comp.Properties.BurningAI) {
    // BurningAIParameter.SearchActorCID appears to pevent object from being interactable until burned.
    // E.g. MADORIPOKO (challenge caves), YBOX (push bag), or OTATOMATOM (Tomato treasure) in Giant's Hearth
    // No idea what ColdBoxEventRadius does
    const BurningAI = getObjectFromPath(comp.Properties.BurningAI, compsList);
    return removeUndefineds({
      type: ObjectTypes.HeatObstacle,
      variant: HeatObstacleVariants.Straw,
      drops: parseObjectDropList(BurningAI)
    });
  }
  else if (comp.Properties.TanebiStationAI) {
    const TanebiStationAI = getObjectFromPath(comp.Properties.TanebiStationAI, compsList);
    // In most caves, "Relay" stations means it is not lit initially... but there is also a parameter
    // used for the some stations that determine this... oof.
    const isLit = !comp.Type.includes("Relay") &&
      !TanebiStationAI.Properties?.TanebiStationAIParameter?.bInitOff;

    return {
      type: ObjectTypes.FirePit,
      isLit
    };
  }
  else if (comp.Properties.ColdBoxAI) {
    const ColdBox = getObjectFromPath(comp.Properties.ColdBoxAI, compsList);
    return removeUndefineds({
      type: ObjectTypes.HeatObstacle,
      variant: HeatObstacleVariants.IceBox,
      drops: parseObjectDropList(ColdBox)
    });
  }
  throw new Error('Unknown heat obstacle');
}