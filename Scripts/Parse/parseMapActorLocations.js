import { Euler, Quaternion } from 'three';

import { MarkerType } from "./types.js";
import { removeUndefineds } from './util.js';

function parseGenerateNum(actor) {
  const spawnNum = actor.GenerateInfo.GenerateNum;
  return spawnNum > 1 ? spawnNum : undefined;
}

// NOTE: some Material piles are set to 'RebirthLater', but never actually respawn
const IgnoreRebirthInfo = [MarkerType.PileMaterials];

// Rebirth info:
// ERebirthInterval::NoRebirth            Never respawns
// ERebirthInterval::RebirthLater         respawns after "RebirthInterval + 1" sunsets (only on surface and Challenge caves)
// ERebirthInterval::AlwaysRebirth        Respawns on every LOAD (not day) if set to 
// ERebirthInterval::RebirthFullExplore   Respawns every load only if Cave 100% (i.e. every sublevel, only occurs in caves)
function parseObjectRebirthInfo(actor, actorType) {
  if (IgnoreRebirthInfo.includes(actorType)) {
    return undefined;
  }

  const { RebirthType, RebirthInterval } = actor.RebirthInfo;
  if (RebirthType === 'ERebirthType::RebirthLater') {
    return RebirthInterval + 1;
  }
  return undefined;
}

const ImportantRotations = [
  // no rotation adjustment:
  MarkerType.SwitchConveyor,
  MarkerType.ShortcutPushbag,
  MarkerType.SwitchDouble,
  MarkerType.WaterWater,
  MarkerType.WaterSwamp,
  // 90 deg. rotation adjustment
  MarkerType.SwitchFenceiron,
  MarkerType.SwitchFencenormal,
  MarkerType.GateBomb,
  MarkerType.GateCrystal,
  MarkerType.GateDirt,
  MarkerType.GateElectric,
  MarkerType.GateIce,
  MarkerType.GateNumbered,
  MarkerType.ShortcutSquashbag,
  MarkerType.ShortcutClipboardhigh,
  MarkerType.ShortcutClipboardlow,
  MarkerType.ShortcutRoot,
  MarkerType.ShortcutStringup,
  MarkerType.ShortcutStringdown,
  MarkerType.RidableZipline,
  MarkerType.MiscPullrope,
  MarkerType.RidableMovefloor, // maybe?
  // 180 deg. rotation adjustment
  MarkerType.StructureBridge,
  // -90 deg. rotation
  MarkerType.StructureWall,
  MarkerType.StructureSlope
];

const ImportantScales = [];

function parseTransformation(actor, parsedObject) {
  const needsRotation = ImportantRotations.includes(parsedObject.type);
  const needsScale = ImportantScales.includes(parsedObject.type);

  const transform = {
    translation: { 
      x: actor.InitTransform.Translation.X,
      y: actor.InitTransform.Translation.Y
    },
  }
  if (needsRotation) {
    const q = actor.InitTransform.Rotation;
    // NOTE: Unreal uses left-handedness coordinate system. Three.js is right-handed. Flip the Z axis.
    const quaternion = new Quaternion(q.X, q.Y, -q.Z, q.W);
    const eulerAngle = new Euler().setFromQuaternion(quaternion);

    // Radar only cares about rotations along about the Z axis.
    // convert to degrees
    // Round to nearest one-thousandth
    transform.rotation = Math.round(eulerAngle.z * 180 * 1000 / Math.PI) / 1000;
  }
  if (needsScale) {
    transform.scale = {
      x: actor.InitTransform.Scale3D.X,
      y: actor.InitTransform.Scale3D.Y,
    };
  }

  return transform;
}

export function parseObjectLocations(actorGeneratorList, parsedObjectDict, isCave) {
  // only the actors that have had parameters parsed
  const knownActors = actorGeneratorList.filter(
    (actor) => (actor.GenerateInfo?.DebugUniqueId && actor.GenerateInfo.DebugUniqueId in parsedObjectDict)
  );

  // Actors with all parsed params and transforms
  return knownActors.map((actor) => {
    const parsedObject = parsedObjectDict[actor.GenerateInfo.DebugUniqueId];

    // keep all params, but add in transform
    return removeUndefineds({
      ...parsedObject,
      transform: parseTransformation(actor, parsedObject),
      // Cave rebirth is always RebirthFullExplore for tekis, NoRebirth for breakable objects
      rebirthInterval: isCave
        ? undefined
        : parseObjectRebirthInfo(actor, parsedObject.type),
      spawnNum: parseGenerateNum(actor)
    });
  });
}
