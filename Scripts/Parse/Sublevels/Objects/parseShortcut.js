import { ObjectTypes, ShortcutVariants } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

export function isShortcutComp(comp) {
  return !!(comp.Properties.HandleBoardAI || comp.Properties.DownFloorAI || comp.Properties.StringAI || comp.Properties.PushGimmisckAI);
}

export function parseShortcutComp(comp, compsList) {
  if (comp.Properties.HandleBoardAI) {
    const handleBoardComp = getObjectFromPath(comp.Properties.HandleBoardAI, compsList);
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.Clipboard,
      weight: handleBoardComp.Properties?.HandleBoardAIParameter?.WorkNum || 20 // TODO: double check it isn't based on component
      // TODO: find the "high" ones?
    };
  }
  else if (comp.Properties.DownFloorAI) {
    const rideAffordanceComp = comp.Properties.RideAffordance && getObjectFromPath(comp.Properties.RideAffordance, compsList);
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.SquashBag,
      weight: rideAffordanceComp?.Properties?.NeedWeight || 10 // See squash bag to Yellow Onion in SST
    };
  }
  else if (comp.Properties.StringAI) {
    const pushAffordanceComp = comp.Properties.PushAffordance && getObjectFromPath(comp.Properties.PushAffordance, compsList);
    const stringComp = getObjectFromPath(comp.Properties.StringAI, compsList);
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.String,
      weight: pushAffordanceComp?.Properties?.WorkNum || 5, // See any StringAI, other than Cave20
      // completed: stringComp.Properties?.bFalled
    };
    // TODO: what is WorkNumGensei?
  }
  else if (comp.Properties.PushGimmisckAI) {
    const pushAffordanceComp = comp.Properties.PushAffordance && getObjectFromPath(comp.Properties.PushAffordance, compsList);
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.PushBag,
      weight: pushAffordanceComp?.Properties?.WorkNum || 10, // See any push box. TODO: double check not component based?
    };
  }
}
