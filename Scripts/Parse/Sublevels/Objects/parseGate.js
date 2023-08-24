import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, removeUndefineds, round } from "../../util.js";
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

// TODO: find actual units per wall num
const WIDTH_PER_WALL_NUM = 100;
const ROCKGATE_WIDTH_REGEX = /GGateRock(\d+)uu_C/;
// TODO I don't think this is correct... uu might not match to actual units 1:1
function getGateWidth(comp) {
  if (type !== MarkerType.GateCrystal) {
    return (comp.Properties.AddWallNum || 0) * WIDTH_PER_WALL_NUM;
  }

  const widthMatch = compType.match(ROCKGATE_WIDTH_REGEX);
  if (!widthMatch) {
    // TODO find default
    return 100;
  }

  return parseInt(widthMatch[1]);
}

function getDefaultGateDrop(type, undamagedStages) {
  const materialAmount = type === MarkerType.GateCrystal
    // all crystal gates drop 6 materials upon fully destroyed (See KoB)
    ? 6
    // all other gets drop 2 materials per destroyed stage
    : undamagedStages * 2
  return {
    item: 'GPiecePick_C',
    chance: 1,
    min: materialAmount,
    max: materialAmount,
  };
}

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

  const undamagedStages = VarGateAI.Properties?.StartValidWallIndex || 3;
  // TODO: is there a default for this?
  const maxHealth = LifeComponent.Properties?.Life || 8000;
  if (!LifeComponent.Properties?.Life) {
    throw new Error('No default max health on gate.');
  }
  // See Cave002_F01 (Crackling Cauldron). Both gates start at 1/3 damaged (or 2/3 of full health)
  const health = round(maxHealth * undamagedStages / 3);

  return removeUndefineds({
    type,
    infoType: InfoType.Gate,
    // width: getGateWidth(comp),
    health,
    // NOTE: pretty sure drop lists are always empty for walls, and are just used to clear the
    //       default drop values
    drops: parseObjectDropList(VarGateAI, getDefaultGateDrop(type, undamagedStages))
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
