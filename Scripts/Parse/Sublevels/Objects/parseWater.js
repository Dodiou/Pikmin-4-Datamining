import { ObjectTypes, WaterVariants } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";


function parseWaterTriggersComp(WaterCarrotTrigger) {
  const isSwamp = WaterCarrotTrigger.Type.includes('Swamp');

  const waterProps = {
    type: ObjectTypes.Water,
    variant: isSwamp ? WaterVariants.Swamp : WaterVariants.Water,
    amountToFreeze: WaterCarrotTrigger.Properties?.MaxIcePikmins ?? 5, // See Aquiferous Summit floor 1
    canSink: isSwamp
      ? !(WaterCarrotTrigger.Properties?.bDisableSink)
      : undefined
  };

  return removeUndefineds(waterProps);
}

function getTextureFilename(fullpath, extension = '.png') {
  if (!fullpath) {
    return undefined;
  }

  return fullpath.substring(fullpath.lastIndexOf('/') + 1, fullpath.lastIndexOf('.')) + extension;
}

// it looks like water levels in places other than Serene Shores were planned to be changeable, but was later scrapped
const EXCLUDE_CHANGE_WATER_TEXTURES = ['T_ui_Map_Cave022_F02_WaterBox00_ChangeDist_D', 'T_ui_Map_HeroStory002_WaterBox00_Hero_ChangeDist_D'];
function getWaterRadarTextures(waterTexture, changedTexture) {
  const normalTexture = getTextureFilename(waterTexture?.ObjectPath);
  const dynamicTexture = getTextureFilename(changedTexture?.ObjectPath);

  if (EXCLUDE_CHANGE_WATER_TEXTURES.includes(dynamicTexture)) {
    dynamicTexture = undefined;
  }

  return removeUndefineds({
    normalTexture,
    dynamicTexture
  });
}


export function isWaterComp(comp) {
  return !!(comp.Properties.WaterCarrotTrigger || comp.Properties.SwampCarrotTrigger || comp.Properties.RadarMapWBTexture);
}

export function parseWaterComp(comp, compsList) {
  const waterTriggersCompProp = comp.Properties.WaterCarrotTrigger || comp.Properties.SwampCarrotTrigger;
  const waterTriggersComp = getObjectFromPath(waterTriggersCompProp, compsList);

  const waterAIComp = getObjectFromPath(comp.Properties.WaterBoxAI, compsList);

  // TODO: add 'WaterBoxAIParameter?.WaterLevel?.WaterBoxSwitchID'? (Only in Hideaway to drain sink)
  // TODO: add 'WaterBoxAIParameter?.WaterLevel?.AfterMaxIcePikmins' and 'bUseSunMeter'? (Serene Shores, big pond)
  return Object.assign(
    {},
    parseWaterTriggersComp(waterTriggersComp),
    getWaterRadarTextures(comp.Properties.RadarMapWBTexture, comp.Properties.RadarMapWBChangeDistTexture),
  );
}