import { GateVariants, ObjectTypes } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

function isNumberedGate(comp) {
  return !!comp.Properties.TriggerDoorAI;
}

function parseNumberedGate(comp, compsList) {
  const triggerComp = getObjectFromPath(comp.Properties.TriggerDoorAI, compsList);

  // TODO: number = TriggerDoorAIParameter.CIDList.length
  // TODO: switchID = TriggerDoorAIParameter.SwitchID

  return {
    type: ObjectTypes.Gate,
    variant: GateVariants.Numbered
  };
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
function parseNonNumberedGate(comp, _compsList) {
  // Reading gate type from Type currently. Is there a better way?
  const variantMatch = comp.Type.match(VariantMatchRegex)[0];
  const variant = VariantMap[variantMatch];

  return {
    type: ObjectTypes.Gate,
    variant
  };
}

export function isGateComp(comp) {
  return !!comp.Properties.WallAffordance;
}

export function parseGateComp(comp, compsList) {
  if (isNumberedGate(comp)) {
    return parseNumberedGate(comp, compsList);
  }

  return parseNonNumberedGate(comp, compsList);
}
