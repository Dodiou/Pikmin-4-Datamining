import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { parseObjectDropList } from "../parseDrops.js";
import { DefaultSwitchID } from "./parseSwitchables.js";

function parseNumberedGate(comp, compsList) {
  const triggerComp = getObjectFromPath(comp.Properties.TriggerDoorAI, compsList);

  // TODO: number actually depends on objects in level with CID in list, not just the length
  const number = triggerComp.Properties?.TriggerDoorAIParameter?.CIDList?.length
  // These DO have a default of 'switch01'. See Cave022_F02
  // ...but only if no CIDList. See Cave035_F05
  // TODO: differentiate between TriggerDoor, TriggerDoorSwitchOff, TriggerDoorSwitchRed, and TriggerDoorSwitchBlue using blueprint names
  const switchId = number !== undefined
    ? undefined
    : triggerComp.Properties?.TriggerDoorAIParameter?.SwitchID || DefaultSwitchID

  return removeUndefineds({
    type: MarkerType.GateNumbered,
    // TODO: might need a different info type
    infoType: InfoType.Gate,
    switchId
  });
}

// mostly copied from parseFloorObstacle.js
/*
const ROCKGATE_WIDTH_REGEX = /GGateRock(\d+)uu_C/;
// TODO I don't think this is correct... uu might not match to actual units 1:1
function getGateWidth(compType) {
  const radiusMatch = compType.match(ROCKGATE_WIDTH_REGEX);
  if (!radiusMatch) {
    // TODO find default
    return 100;
  }

  return parseInt(radiusMatch[1]);
}
*/

const MarkerTypeMap = {
  'Denki': MarkerType.GateElectric,
  'Soft': MarkerType.GateDirt,
  'Ice': MarkerType.GateIce,
  'Rock': MarkerType.GateCrystal,
  'Bomb': MarkerType.GateBomb,
  'Trigger': MarkerType.GateNumbered,
}
const MarkerMatchRegex = '(' + Object.keys(MarkerTypeMap).join('|') + ')';
function parseNonNumberedGate(comp, compsList) {
  const markerMatch = comp.Type.match(MarkerMatchRegex)[1];
  const type = MarkerTypeMap[markerMatch];

  const VarGateAI = getObjectFromPath(comp.Properties.VarGateAI, compsList);
  const LifeComponent = getObjectFromPath(comp.Properties.LifeComponent, compsList);

  return removeUndefineds({
    type,
    infoType: InfoType.Gate,
    //width: type == MarkerType.GateCrystal ? 
      //getGateWidth(comp.Type) : 
      // This seems to correlate with gate width for all other gates, unsure exactly how though
      //getObjectFromPath(comp.Properties.AddWallNum, compsList),
    health: LifeComponent.Properties?.Life,
    // undefined = undamaged (likely default = 0), 1 = 1/3 damaged, 2 = 2/3 damaged. Starting health is health * (3 - stage) / 3
    //stage: VarGateAI.Properties?.StartValidWallIndex,
    // Default drops = 2 mats per remaining wall stage--where/how to implement this?
    drops: parseObjectDropList(VarGateAI)
  });
}

export function isGateComp(comp) {
  return !!(
    comp.Properties.VarGateAI ||
    comp.Properties.TriggerDoorAI
  );
}

export function parseGateComp(comp, compsList) {
  if (comp.Properties.TriggerDoorAI) {
    return parseNumberedGate(comp, compsList);
  }
  else if (comp.Properties.VarGateAI) {
    return parseNonNumberedGate(comp, compsList);
  }
  throw new Error(`Unknown gate component ${comp.Type}`);
}
