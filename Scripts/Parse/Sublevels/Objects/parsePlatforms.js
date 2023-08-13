import { ObjectTypes, ShortcutVariants } from "../../types.js";

export function isPlatformComp(comp) {
  return !!(
    comp.Properties.TrampolineAI ||
    comp.Properties.OoAshibaKinokoAI
  );
}

export function parsePlatformComp(comp) {
  if (comp.Properties.TrampolineAI) {
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.BounceShroom
    };
  }
  else if (comp.Properties.OoAshibaKinokoAI) {
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.ChargeShroom
    };
  }

  throw new Error(`Unknown platform component ${comp.Type}`);
}
