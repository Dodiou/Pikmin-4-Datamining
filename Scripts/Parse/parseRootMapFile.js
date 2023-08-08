// Map types:
//   BP_CarrotGameRuleStory_C (Day/Night/Olimar)
//   BP_CarrotGameRuleStoryCaveOtakaraCollect_C (Challenge)
//   BP_CarrotGameRuleStoryCaveExtra_C (Sage Trials)
// Dandori Battle (DDB) has no radar
const mapTypes = ['BP_CarrotGameRuleStory_C', 'BP_CarrotGameRuleStoryCaveOtakaraCollect_C', 'BP_CarrotGameRuleStoryCaveExtra_C'];

const DEFAULT_MAP_TRANSLATION = {
  X: 0,
  Y: 0,
  Z: 0
}
const DEFAULT_MAP_ROTATION = {
  Pitch: 0.0,
  Yaw: 0.0,
  Roll: 0.0
}
export function parseRootMapComponents(compsList) {
  const rootLevelComp = compsList.find(comp => mapTypes.includes(comp.Type));

  const radarNorthArrowCompIndex = rootLevelComp.Properties.NorthArrow.ObjectPath.split('.')[1];
  const radarNorthArrowComp = compsList[radarNorthArrowCompIndex];

  // is this useful, or even correct?
  // const translation = radarNorthArrowComp.Properties?.RelativeLocation || DEFAULT_MAP_TRANSLATION;
  const rotation = radarNorthArrowComp.Properties?.RelativeRotation || DEFAULT_MAP_ROTATION;
  return {
    // Map PNG rotation in degrees, anticlockwise
    // NOTE: although Unreal is left-handed, this rotation does not need to be flipped.
    rotation: Math.round(rotation.Yaw),
  }
}
