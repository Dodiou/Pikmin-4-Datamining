import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";

// See Cave012_F01. Fences have this ID, but SingleSwitch does not.
export const DefaultSwitchID = 'switch01';

function parseFan(CirculatorAI) {
  return {
    type: MarkerType.SwitchFan,
    infoType: InfoType.Switchable,
    switchId: CirculatorAI.Properties.CirculatorAIParameter?.SwitchID || DefaultSwitchID
  };
}

function parseFence(fenceType, FenceFallAI) {
  // NOTE: Only link gates with "Fall" in type.
  //       See Cave005_F00. One fence has null, and switch has null, but the fences do not link.
  const isIron  = fenceType.includes("Fall");
  const switchId = isIron
    ? FenceFallAI.Properties.FenceFallAIParameter?.SwitchID || DefaultSwitchID
    : undefined;
  return removeUndefineds({
    type: isIron ? MarkerType.SwitchFenceiron : MarkerType.SwitchFencenormal,
    infoType: InfoType.Switchable,
    switchId
  });
}

function parseConveyor(ConveyorAAI) {
  return {
    type: MarkerType.SwitchConveyor,
    infoType: InfoType.Switchable,
    switchId: ConveyorAAI.Properties.ConveyorBaseAIParameter?.SwitchID || DefaultSwitchID
  }
}

function parseSwitch(SingleOrTwinSwitchAI) {
  const isSingleSwitch = SingleOrTwinSwitchAI.Type.includes('Single');
  return {
    type: isSingleSwitch ? MarkerType.SwitchSingle : MarkerType.SwitchDouble,
    infoType: InfoType.Switchable,
    switchId: SingleOrTwinSwitchAI.Properties.SwitchBaseAIParameter?.SwitchID || DefaultSwitchID
  };
}

export function isSwitchableComp(comp) {
  return !!(
    // switchables
    // NOTE: WaterBox and TriggerDoor (numbered gate) is also switchable.
    comp.Properties.FenceFallAI ||
    comp.Properties.CirculatorAI ||
    comp.Properties.ConveyorAAI ||
    // switches
    comp.Properties.SingleSwitchAI ||
    comp.Properties.TwinSwitchAI
  )
}

export function parseSwitchableComp(comp, compsList) {
  if (comp.Properties.CirculatorAI) {
    const fanComp = getObjectFromPath(comp.Properties.CirculatorAI, compsList);
    return parseFan(fanComp);
  }
  else if (comp.Properties.FenceFallAI) {
    const fenceComp = getObjectFromPath(comp.Properties.FenceFallAI, compsList);
    return parseFence(comp.Type, fenceComp);
  }
  else if (comp.Properties.ConveyorAAI) {
    const conveyorComp = getObjectFromPath(comp.Properties.ConveyorAAI, compsList);
    return parseConveyor(conveyorComp);
  }
  else if (comp.Properties.SingleSwitchAI || comp.Properties.TwinSwitchAI) {
    const switchComp = getObjectFromPath(comp.Properties.SingleSwitchAI || comp.Properties.TwinSwitchAI, compsList);
    return parseSwitch(switchComp);
  }
}
