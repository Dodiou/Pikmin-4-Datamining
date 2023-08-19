import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath } from "../../util.js";


export function isBaseComp(comp) {
  return !!(
    comp.Properties.AreaBaseCamp
  );
}

export function parseBaseComp(comp, compsList) {
  const isBeagle = comp.Type.startsWith('GPodCamp');

  const AreaBaseCamp = getObjectFromPath(comp.Properties.AreaBaseCamp, compsList);
  const guardedBy = AreaBaseCamp.Properties?.AreaBaseCampParameter?.CIDList;
  const baseId = AreaBaseCamp.Properties?.BaseCampId || 0;

  return {
    type: isBeagle ? MarkerType.BaseBeagle : MarkerType.BaseOnion,
    infoType: InfoType.Base,
    baseId,
    guardedBy,
  }
}
