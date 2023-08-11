import { HeatObstacleVariants, ObjectTypes } from "../../types.js";
import { getObjectFromPath } from "../../util.js";
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
    return {
      type: ObjectTypes.HeatObstacle,
      variant: HeatObstacleVariants.Straw,
      drops: parseObjectDropList(BurningAI)
    };
  }
  else if (comp.Properties.TanebiStationAI) {
    // "Relay" stations are not lit initially
    return {
      type: ObjectTypes.FirePit,
      isLit: !comp.Type.includes("Relay")
    };
  }
  else if (comp.Properties.ColdBoxAI) {
    const ColdBox = getObjectFromPath(comp.Properties.ColdBoxAI, compsList)
    return {
      type: ObjectTypes.HeatObstacle,
      variant: HeatObstacleVariants.IceBox,
      drops: parseObjectDropList(ColdBox)
    };
  }
  throw new Error('Unknown heat obstacle');
}