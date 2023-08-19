import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, getPikminColor, removeUndefineds } from "../../util.js";
import { parseCreatureDropList } from "../parseDrops.js";

export const DefaultIcicleObject = {
  type: MarkerType.MiscIcicle,
  infoType: InfoType.Misc
};

export function isMiscComp(comp) {
  return !!(
    comp.Properties.CharcoalAI ||
    comp.Properties.IcicleAI ||
    comp.Properties.PelletAI ||
    comp.Properties.HoneyAI ||
    comp.Properties.IwakkoCrystalAI
  );
}

const PELLET_SEEDS_REGEX = /GPellet(\d+)_C/;
export function parseMiscComp(comp, compsList) {
  if (comp.Properties.CharcoalAI) {
    return {
      type: MarkerType.HazardCharcoal,
      infoType: InfoType.Hazard
    };
  }
  else if (comp.Properties.IcicleAI) {
    // todo isFelled or isDropped or something
    return DefaultIcicleObject;
  }
  else if (comp.Properties.PelletAI) {
    const PelletAI = getObjectFromPath(comp.Properties.PelletAI, compsList);
    const seeds = parseInt(comp.Type.match(PELLET_SEEDS_REGEX)[1]);
    const color = getPikminColor(PelletAI.Properties?.AIParameter?.PelletColor || "EPikminColor::Red");
  
    return {
      type: MarkerType.MiscPellet,
      infoType: InfoType.Misc,
      color,
      seeds
    };
  }
  else if (comp.Properties.HoneyAI) {
    return {
      type: MarkerType.MiscHoney,
      infoType: InfoType.Misc
    };
  }
  else if (comp.Properties.IwakkoCrystalAI) {
    const IwakkoCrystalAI = getObjectFromPath(comp.Properties.IwakkoCrystalAI, compsList);
    return removeUndefineds({
      type: MarkerType.BreakableCrystal,
      infoType: InfoType.Breakable,
      // NOTE: Even though this is in Objects, it uses Teki/Creature drops
      drops: parseCreatureDropList(IwakkoCrystalAI)
    });
  }
  throw new Error(`Unknown misc. component ${comp.Type}`);
}
