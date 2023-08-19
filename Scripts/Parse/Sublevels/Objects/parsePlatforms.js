import { InfoType, MarkerType } from "../../types.js";

export function isPlatformComp(comp) {
  return !!(
    comp.Properties.TrampolineAI ||
    comp.Properties.OoAshibaKinokoAI
  );
}

export function parsePlatformComp(comp) {
  if (comp.Properties.TrampolineAI) {
    return {
      type: MarkerType.PlatformBounce,
      infoType: InfoType.Platform
    };
  }
  else if (comp.Properties.OoAshibaKinokoAI) {
    return {
      type: MarkerType.PlatformCharge,
      infoType: InfoType.Platform
    };
  }

  throw new Error(`Unknown platform component ${comp.Type}`);
}
