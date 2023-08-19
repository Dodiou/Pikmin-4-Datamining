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

  return removeUndefineds({
    type,
    infoType: InfoType.Gate,
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
