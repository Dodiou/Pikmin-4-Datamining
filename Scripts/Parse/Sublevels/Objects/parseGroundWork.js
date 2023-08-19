import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";
import { DefaultLarvaDrop, parseObjectDropList } from "../parseDrops.js";

// Not sure how to categorize these. Just calling them "Ground Work" for now.
export function isMoundComp(comp) {
  return !!comp.Properties.TateanaAI;
}

export function isFishingComp(comp) {
  return !!comp.Properties.RopeFishingAI;
}

export function isDrainComp(comp) {
  return !!comp.Properties.MizunukiAI;
}

export function parseMoundComp(comp, compsList) {
  // TODO parse RebirthInterval?
  const moundAIComp = getObjectFromPath(comp.Properties.TateanaAI, compsList);
  return removeUndefineds({
    type: MarkerType.BreakableMound,
    infoType: InfoType.Breakable,
    // default drop is to spawn BABY teki (bulborb larva)
    drops: parseObjectDropList(moundAIComp, DefaultLarvaDrop)
  });
}

export function parseFishingComp(comp, compsList) {
  const RopeFishing = getObjectFromPath(comp.Properties.RopeFishingAI, compsList);

  // TODO: find how to attach treasures to this
  return removeUndefineds({
    type: MarkerType.MiscPullrope,
    infoType: InfoType.Misc,
    // NOTE: default is whatever the attached treasure is (See CfaK11 or TotSL8)
    weight: RopeFishing.Properties?.RopeFishingAIParameter?.ManualWorkNum,
    // One 'drops' a Gold Flintbeetle.
    drops: parseObjectDropList(RopeFishing)
  });
}

export function parseDrainComponent(comp, compsList) {
  const Mizunuki = getObjectFromPath(comp.Properties.MizunukiAI, compsList);
  return {
    type: MarkerType.SwitchDrain,
    infoType: InfoType.Switchable,
    switchId: Mizunuki.Properties?.WaterBoxID || 'mizunuki'
  };
}
