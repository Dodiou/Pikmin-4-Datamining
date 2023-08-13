import { ObjectTypes, WaterVariants } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";


function parseWaterTriggersComp(WaterCarrotTrigger, texture) {
  const isSwamp = WaterCarrotTrigger.Type.includes('Swamp');

  const waterProps = {
    type: ObjectTypes.Water,
    variant: isSwamp ? WaterVariants.Swamp : WaterVariants.Water,
    // separate water into two parts: normal and dynamic (e.g. for Serene Shores)
    normal: removeUndefineds({
      image: texture,
      // See Aquiferous Summit floor 1 for default
      amountToFreeze: WaterCarrotTrigger.Properties?.MaxIcePikmins ?? 5,
      canSink: isSwamp
        ? !(WaterCarrotTrigger.Properties?.bDisableSink)
        : undefined
    })
  };

  return removeUndefineds(waterProps);
}

function parseWaterBoxAIComp(WaterBoxAIComp, texture, normalData) {
  const dynamicData = removeUndefineds({
    amountToFreeze: WaterBoxAIComp.Properties?.WaterBoxAIParameter?.WaterLevel?.AfterMaxIcePikmins,
    image: texture
    // TODO: is bUseSunMeter important? Only happens in Serene Shores.
  });

  if (Object.keys(dynamicData).length === 0) {
    return undefined;
  }

  return removeUndefineds({
    // use normalData if props in dynamicData do not exist.
    dynamic: { ...normalData, ...dynamicData },
    // Note: No default. See Cave012_F01 (Subzero Sauna). Fences use 'switch01', switch has no ID,
    //       and one waterbox has no ID. Fences link up, but the water doesn't
    switchId: WaterBoxAIComp.Properties?.WaterLevel?.WaterBoxSwitchID
  });
}

function getTextureFilename(fullpath, extension = '.png') {
  if (!fullpath) {
    return undefined;
  }

  return fullpath.substring(fullpath.lastIndexOf('/') + 1, fullpath.lastIndexOf('.')) + extension;
}

// it looks like these were planned to be changeable, but were scrapped.
const EXCLUDE_CHANGE_WATER_TEXTURES = ['T_ui_Map_Cave022_F02_WaterBox00_ChangeDist_D', 'T_ui_Map_HeroStory002_WaterBox00_Hero_ChangeDist_D'];
function getWaterRadarTextures(waterTexture, changedTexture) {
  // NOTE: there is 1 waterbox in Cave016_F17 (CfaK, Sovereign Bulblax) that does not have a radar image
  //       this the press floor/squishy terrain. No waterbox, but there is water
  const normal = getTextureFilename(waterTexture?.ObjectPath);
  const dynamic = getTextureFilename(changedTexture?.ObjectPath);

  if (EXCLUDE_CHANGE_WATER_TEXTURES.includes(dynamic)) {
    dynamic = undefined;
  }

  return removeUndefineds({
    normal,
    dynamic
  });
}


export function isWaterComp(comp) {
  return !!(
    comp.Properties.WaterCarrotTrigger || comp.Properties.SwampCarrotTrigger
  );
}

export function parseWaterComp(comp, compsList) {
  const waterTriggersCompProp = comp.Properties.WaterCarrotTrigger || comp.Properties.SwampCarrotTrigger;
  const waterTriggersComp = getObjectFromPath(waterTriggersCompProp, compsList);
  const textureData = getWaterRadarTextures(comp.Properties.RadarMapWBTexture, comp.Properties.RadarMapWBChangeDistTexture);

  const waterData = parseWaterTriggersComp(waterTriggersComp, textureData.normal);

  const waterBoxAIComp = getObjectFromPath(comp.Properties.WaterBoxAI, compsList);
  const dynamicData = parseWaterBoxAIComp(waterBoxAIComp, textureData.dynamic, waterData.normal);

  return {
    ...dynamicData,
    ...waterData
  }
}