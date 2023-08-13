import { GateVariants, ObjectTypes } from "../../types.js";
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
    type: ObjectTypes.Gate,
    variant: GateVariants.Numbered,
    switchId
  });
}

const VariantMap = {
  'Denki': GateVariants.Electric,
  'Soft': GateVariants.Dirt,
  'Ice': GateVariants.Ice,
  'Rock': GateVariants.Crystal,
  'Bomb': GateVariants.Bomb,
  'Trigger': GateVariants.Numbered,
}
const VariantMatchRegex = '(' + Object.keys(VariantMap).join('|') + ')';
function parseNonNumberedGate(comp, compsList) {
  const variantMatch = comp.Type.match(VariantMatchRegex)[1];
  const variant = VariantMap[variantMatch];

  const VarGateAI = getObjectFromPath(comp.Properties.VarGateAI, compsList);

  return removeUndefineds({
    type: ObjectTypes.Gate,
    variant,
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
