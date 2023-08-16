import { ObjectTypes } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { parseCreatureDropList } from "../parseDrops.js";
import { DefaultValveId } from "./parseStructure.js";

export const DefaultIcicleObject = {
  type: ObjectTypes.Icicle
};

export function isMiscComp(comp) {
  return !!(
    comp.Properties.SprinklerAI ||
    comp.Properties.CharcoalAI ||
    comp.Properties.IcicleAI ||
    comp.Properties.PelletAI ||
    comp.Properties.HoneyAI ||
    comp.Properties.IwakkoCrystalAI
  );
}

const PELLET_SEEDS_REGEX = /GPellet(\d+)_C/;
export function parseMiscComp(comp, compsList) {
  if (comp.Properties.SprinklerAI) {
    const SprinklerAI = getObjectFromPath(comp.Properties.SprinklerAI, compsList);
    // TODO unknown default
    const radius = SprinklerAI.Properties?.SprinklerAIParameter?.WaterRange || 300;
    const valveId = SprinklerAI.Properties?.ValveID || DefaultValveId;

    return {
      type: ObjectTypes.Sprinkler,
      valveId,
      radius
    };
  }
  else if (comp.Properties.CharcoalAI) {
    return {
      type: ObjectTypes.Charcoal
    };
  }
  else if (comp.Properties.IcicleAI) {
    return DefaultIcicleObject;
  }
  else if (comp.Properties.PelletAI) {
    const PelletAI = getObjectFromPath(comp.Properties.PelletAI, compsList);
    const seeds = parseInt(comp.Type.match(PELLET_SEEDS_REGEX)[1]);
    const color = PelletAI.Properties?.AIParameter?.PelletColor || "EPikminColor::Red"
  
    return {
      type: ObjectTypes.Pellet,
      color,
      seeds
    };
  }
  else if (comp.Properties.HoneyAI) {
    return {
      type: ObjectTypes.Honey
    };
  }
  else if (comp.Properties.IwakkoCrystalAI) {
    const IwakkoCrystalAI = getObjectFromPath(comp.Properties.IwakkoCrystalAI, compsList);
    return removeUndefineds({
      type: ObjectTypes.Crystal,
      // NOTE: Even though this is in Objects, it uses Teki/Creature drops
      drops: parseCreatureDropList(IwakkoCrystalAI)
    });
  }
  throw new Error(`Unknown misc. component ${comp.Type}`);
}

/*
if (comp.Properties.PelletAI) {
  const PelletAI = getObjectFromPath(comp.Properties.PelletAI, compsList);
  const seeds = parseInt(comp.Type.match(/GPellet(\d+)_C/)[1]);
  const color = PelletAI.Properties?.AIParameter?.PelletColor || "EPikminColor::Red"

  return {
    type: ObjectTypes.Pellet,
    color,
    seeds
  }
}
*/
