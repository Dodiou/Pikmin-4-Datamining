import { getObjectFromPath } from "./util.js";
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

function findMapRotaton(compsList) {
  const rootLevelComp = compsList.find(comp => mapTypes.includes(comp.Type));

  const radarNorthArrowCompIndex = rootLevelComp.Properties.NorthArrow.ObjectPath.split('.')[1];
  const radarNorthArrowComp = compsList[radarNorthArrowCompIndex];

  // is this useful, or even correct?
  // const translation = radarNorthArrowComp.Properties?.RelativeLocation || DEFAULT_MAP_TRANSLATION;
  const rotation = radarNorthArrowComp.Properties?.RelativeRotation || DEFAULT_MAP_ROTATION;

  // Map PNG rotation in degrees, anticlockwise
  // NOTE: although Unreal is left-handed, this rotation does not need to be flipped.
  return Math.round(rotation.Yaw);
}

// No idea what is correct here. It looks *almost* correct, but not quite (Sun-speckled Terrace
// needs -6000 to 6000 for x and y)
// NOTE: old code that didn't quite work. Just here for documenting it
function __OLD__findMapExtent(compsList) {
  // Every level seems to have exactly one NavMeshBounds (except Area500).
  const navMeshBounds = compsList.find(comp => {
    return comp.Type === "NavMeshBoundsVolume" &&
      // some weird Rescue Ops Camp thing. Has something to do with menus I think.
      !comp.Name.includes("Zukan");
  });

  const brushComp = getObjectFromPath(navMeshBounds.Properties.BrushComponent, compsList);
  const brushBodySetupComp = getObjectFromPath(brushComp.Properties.BrushBodySetup, compsList);
  const vertices = brushBodySetupComp.Properties.AggGeom.ConvexElems[0].VertexData;

  const xMin = vertices.reduce((min, vertex) => vertex.X < min ? vertex.X : min, Number.MAX_SAFE_INTEGER);
  const xMax = vertices.reduce((max, vertex) => vertex.X > max ? vertex.X : max, Number.MIN_SAFE_INTEGER);
  const yMin = vertices.reduce((min, vertex) => vertex.Y < min ? vertex.Y : min, Number.MAX_SAFE_INTEGER);
  const yMax = vertices.reduce((max, vertex) => vertex.Y > max ? vertex.Y : max, Number.MIN_SAFE_INTEGER);

  return {
    xMin, xMax, yMin, yMax
  };
}

/*
  NOTE: Surface maps seem to fit perfectly with -6000 to 6000.
        Cave maps (see Aquiferous Summit 1) seem to fit perfectly with -2000 to 2000
  EDIT: might not be so simple... See Seafloor Resort 1
*/
function findMapExtent(isCave) {
  return isCave
    ? {
      xMin: -2000,
      xMax: 2000,
      yMin: -2000,
      yMax: 2000
    }
    : {
      xMin: -6000,
      xMax: 6000,
      yMin: -6000,
      yMax: 6000
    }
}

export function parseRootMapComponents(compsList, isCave) {
  return {
    rotation: findMapRotaton(compsList),
    extent: findMapExtent(isCave)
  }
}
