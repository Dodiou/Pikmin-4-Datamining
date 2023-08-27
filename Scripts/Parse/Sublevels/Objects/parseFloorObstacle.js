import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { DefaultValveId } from "./parseStructure.js";
import { parseObjectDropList } from "../parseDrops.js";

const FLOOR_RADIUS_REGEX = /G\w+Floor(\d+)uu_C/;
function getFloorDiameter(compType) {
  const radiusMatch = compType.match(FLOOR_RADIUS_REGEX);
  if (!radiusMatch) {
    // TODO find default
    return -1;
  }

  return parseInt(radiusMatch[1]);
}

function parseMushroomFloor(comp, compsList) {
  const StickyFloor = getObjectFromPath(comp.Properties.StickyFloorAI, compsList);
  const isPoison = comp.Type.includes('Poison');

  return removeUndefineds({
    type: MarkerType.HazardFloormushroom,
    infoType: InfoType.Hazard,
    isPoison,
    radius: getFloorDiameter(comp.Type),
    drops: parseObjectDropList(StickyFloor)
  });
}

function parseFireFloor(comp) {
  return {
    type: MarkerType.HazardFloorfire,
    infoType: InfoType.Hazard,
    radius: getFloorDiameter(comp.Type)
  }
}

function parseMoveFloor(_comp) {
  return {
    type: MarkerType.RidableMovefloor,
    infoType: InfoType.Ridable
  }
}

function parseSprinkler(comp, compsList) {
  const SprinklerAI = getObjectFromPath(comp.Properties.SprinklerAI, compsList);
  // TODO unknown default
  const radius = SprinklerAI.Properties?.SprinklerAIParameter?.WaterRange || -1;
  const valveId = SprinklerAI.Properties?.ValveID || DefaultValveId;

  return {
    type: MarkerType.HazardSprinkler,
    infoType: InfoType.Hazard,
    valveId,
    radius
  };
}

export function isFloorComp(comp) {
  return !!(
    // PressFloor is the squishy terrain in Sov. Bulblax/Masterhop arenas
    //   comp.Properties.PressFloorAI ||
    // MoveFloor is floating platforms
    comp.Properties.MoveFloorAI ||
    comp.Properties.StickyFloorAI ||
    comp.Properties.FireFloorAI ||
    comp.Properties.SprinklerAI
  )
}

export function parseFloorComp(comp, compsList) {
  if (comp.Properties.MoveFloorAI) {
    return parseMoveFloor(comp);
  }
  else if (comp.Properties.StickyFloorAI) {
    return parseMushroomFloor(comp, compsList);
  }
  else if (comp.Properties.FireFloorAI) {
    return parseFireFloor(comp);
  }
  else if (comp.Properties.SprinklerAI) {
    return parseSprinkler(comp, compsList);
  }
  throw new Error('Unknown floor type!');
}