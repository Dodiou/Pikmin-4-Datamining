import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, getPikminColor, removeUndefineds } from "../../util.js";
import { DefaultObject, getCreatureFromType } from "../objectBlueprints.js";
import { parseCreatureDropList } from "../parseDrops.js";

export function isMiscComp(comp) {
  return !!(
    comp.Properties.CharcoalAI ||
    comp.Properties.IcicleAI ||
    comp.Properties.PelletAI ||
    comp.Properties.HoneyAI ||
    comp.Properties.TsuyukusaAI ||
    comp.Properties.IwakkoCrystalAI
  );
}

export function parseMiscComp(comp, compsList) {
  if (comp.Properties.CharcoalAI) {
    return {
      type: MarkerType.HazardCharcoal,
      infoType: InfoType.Hazard
    };
  }
  else if (comp.Properties.IcicleAI) {
    // todo isFelled or isDropped or something
    return DefaultObject.GIcicle_C;
  }
  else if (comp.Properties.PelletAI) {
    // TODO: move to parsePellet.js, and add pelplants too
    const PelletAI = getObjectFromPath(comp.Properties.PelletAI, compsList);
    const color = getPikminColor(PelletAI.Properties?.AIParameter?.PelletColor || "EPikminColor::Red");

    return {
      ...getCreatureFromType(comp.Type),
      color,
    };
  }
  else if (comp.Properties.HoneyAI) {
    return DefaultObject.GHoney_C;
  }
  else if (comp.Properties.TsuyukusaAI) {
    return {
      type: MarkerType.MiscSpiderwort,
      infoType: InfoType.Misc
    }
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
