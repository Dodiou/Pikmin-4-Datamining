import { ObjectTypes, ShortcutVariants } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

export function isShortcutComp(comp) {
  return !!(
    comp.Properties.HandleBoardAI ||
    comp.Properties.DownFloorAI ||
    comp.Properties.StringAI ||
    comp.Properties.PushGimmickAI ||
    comp.Properties.PullNekkoAI ||
    comp.Properties.BranchAI ||
    comp.Properties.GeyserAI ||
    comp.Properties.ZiplineAI
  );
}

export function parseShortcutComp(comp, compsList) {
  if (comp.Properties.HandleBoardAI) {
    const isYellow = comp.Type.includes("Yellow");
    const handleBoardComp = getObjectFromPath(comp.Properties.HandleBoardAI, compsList);

    return {
      type: ObjectTypes.Shortcut,
      variant: isYellow ? ShortcutVariants.ClipboardYellow : ShortcutVariants.ClipboardAny,
      weight: handleBoardComp.Properties?.HandleBoardAIParameter?.WorkNum || 20 // TODO: double check it isn't based on component
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
      // unknown what bFalled is
      //   completed: stringComp.Properties?.bFalled
    };
    // TODO: what is WorkNumGensei?
  }
  else if (comp.Properties.PushGimmickAI) {
    const pushAffordanceComp = comp.Properties.PushAffordance && getObjectFromPath(comp.Properties.PushAffordance, compsList);
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.PushBag,
      weight: pushAffordanceComp?.Properties?.WorkNum || 10, // See any push box. TODO: double check not component based?
    };
  }
  else if (comp.Properties.PullNekkoAI) {
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.Root
    }
  }
  else if (comp.Properties.BranchAI) {
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.Stick
    }
  }
  else if (comp.Properties.ZiplineAI) {
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.Zipline
    }
  }
  else if (comp.Properties.GeyserAI) {
    // TODO: read spline for end locations?
    const Geyser = getObjectFromPath(comp.Properties.GeyserAI, compsList);
    return {
      type: ObjectTypes.Shortcut,
      variant: ShortcutVariants.Geyser,
      hasCrystal: Geyser.Properties?.GeyserAIParameter?.bSetCrystal
    };
  }
  throw new Error('Unknown shortcut!');
}
