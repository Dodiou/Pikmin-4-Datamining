import { InfoType, MarkerType } from "../../types.js";

export function isSpoutComp(comp) {
  return !!comp.Properties.HibaBaseAI;
}

const SpoutMarkerMap = {
  'GHibaIce_C': MarkerType.HazardSpoutIce,
  'GHibaWater_C': MarkerType.HazardSpoutWater,
  'GHibaPoison_C': MarkerType.HazardSpoutPoison,
  'GHibaBubble_C': MarkerType.HazardSpoutBubble,
  'GHibaDenki_C': MarkerType.HazardSpoutElectric,
  'GHiba_C': MarkerType.HazardSpoutFire,
  // gas stove burner in HH
  'GKonro_C': MarkerType.HazardSpoutFire,
}
export function parseSpoutComp(comp) {
  const type = SpoutMarkerMap[comp.Type];
  if (type === undefined) {
    throw new Error(`Unknown spout type: ${comp.Type}`);
  }

  return {
    type,
    infoType: InfoType.Hazard
  }
}