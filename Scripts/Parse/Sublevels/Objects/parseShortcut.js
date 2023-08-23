import { InfoType, MarkerType } from "../../types.js";
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
      type: isYellow ? MarkerType.ShortcutClipboardhigh : MarkerType.ShortcutClipboardlow,
      infoType: InfoType.Shortcut,
      weight: handleBoardComp.Properties?.HandleBoardAIParameter?.WorkNum || 20 // TODO: double check it isn't based on component
    };
  }
  else if (comp.Properties.DownFloorAI) {
    const rideAffordanceComp = comp.Properties.RideAffordance && getObjectFromPath(comp.Properties.RideAffordance, compsList);
    return {
      type: MarkerType.ShortcutSquashbag,
      infoType: InfoType.Shortcut,
      weight: rideAffordanceComp?.Properties?.NeedWeight || 10 // See squash bag to Yellow Onion in SST
    };
  }
  else if (comp.Properties.StringAI) {
    const pushAffordanceComp = comp.Properties.PushAffordance && getObjectFromPath(comp.Properties.PushAffordance, compsList);
    const stringComp = getObjectFromPath(comp.Properties.StringAI, compsList);
    // some strings start in the "down" position
    const isDown = stringComp.Properties?.StringAIParameter?.bFalled;

    return {
      type: isDown ? MarkerType.ShortcutStringdown : MarkerType.ShortcutStringup,
      infoType: InfoType.Shortcut,
      weight: pushAffordanceComp?.Properties?.WorkNum || 5, // See any StringAI, other than Cave20
    };
    // TODO: what is WorkNumGensei?
  }
  else if (comp.Properties.PushGimmickAI) {
    const pushAffordanceComp = comp.Properties.PushAffordance && getObjectFromPath(comp.Properties.PushAffordance, compsList);
    // Differentiate between push bags and push boxes, and further separate boxes to cardboard/metal (use different icons)
    // XBox is used for boxes that don't fall after being pushed, YBox is for bags/boxes that do; that difference doesn't matter for this
    // This whole thing can almost certainly be written way more elegantly using regex, feel free to rewrite it
    //const isBox = comp.Type.includes("XBox") || comp.Type.includes("Cube");
    //if (isBox) {
    //  const boxType = comp.Type.includes("Can") ? MarkerType.Pushboxcardboard : MarkerType.Pushboxmetal;
    //};
    
    return {
      //type: isBox ? boxType : MarkerType.ShortcutPushbag,
      type: MarkerType.ShortcutPushbag,
      infoType: InfoType.Shortcut,
      weight: pushAffordanceComp?.Properties?.WorkNum || 10, // See any push box. TODO: double check not component based?
    };
  }
  else if (comp.Properties.PullNekkoAI) {
    return {
      type: MarkerType.ShortcutRoot,
      infoType: InfoType.Shortcut
    }
  }
  else if (comp.Properties.BranchAI) {
    return {
      type: MarkerType.MiscStick,
      infoType: InfoType.Misc,
    }
  }
  else if (comp.Properties.ZiplineAI) {
    return {
      type: MarkerType.RidableZipline,
      infoType: InfoType.Ridable,
    }
  }
  else if (comp.Properties.GeyserAI) {
    // TODO: read spline for end locations?
    const Geyser = getObjectFromPath(comp.Properties.GeyserAI, compsList);
    return {
      type: MarkerType.RidableGeyser,
      infoType: InfoType.Ridable,
      hasCrystal: Geyser.Properties?.GeyserAIParameter?.bSetCrystal
    };
  }
  throw new Error('Unknown shortcut!');
}
