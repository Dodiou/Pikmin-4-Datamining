import { FloorObstacleVariants, ObjectTypes } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { parseObjectDropList } from "../parseDrops.js";

const FLOOR_RADIUS_REGEX = /G\w+Floor(\d+)uu_C/;
// TODO I don't think this is correct... uu might not match to actual units 1:1
function getFloorDiameter(compType) {
  const radiusMatch = compType.match(FLOOR_RADIUS_REGEX);
  if (!radiusMatch) {
    // TODO find default
    return 100;
  }

  return parseInt(radiusMatch[1]);
}

function parseMushroomFloor(comp, compsList) {
  const StickyFloor = getObjectFromPath(comp.Properties.StickyFloorAI, compsList);
  const isPoison = comp.Type.includes('Poison');

  return removeUndefineds({
    type: ObjectTypes.FloorObstacle,
    variant: FloorObstacleVariants.Mushroom,
    isPoison,
    radius: getFloorDiameter(comp.Type),
    drops: parseObjectDropList(StickyFloor)
  });
}

function parseFireFloor(comp) {
  return {
    type: ObjectTypes.FloorObstacle,
    variant: FloorObstacleVariants.Fire,
    radius: getFloorDiameter(comp.Type)
  }
}

function parseMoveFloor(_comp) {
  return {
    type: ObjectTypes.FloorObstacle,
    variant: FloorObstacleVariants.Movable
  }
}

export function isFloorComp(comp) {
  return !!(
    // PressFloor is the squishy terrain in Sov. Bulblax/Masterhop arenas
    //   comp.Properties.PressFloorAI ||
    // MoveFloor is floating platforms
    comp.Properties.MoveFloorAI ||
    comp.Properties.StickyFloorAI ||
    comp.Properties.FireFloorAI
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
  throw new Error('Unknown floor type!');
}