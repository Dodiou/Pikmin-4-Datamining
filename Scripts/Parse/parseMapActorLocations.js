import { Euler, Quaternion } from 'three';

import { ObjectTypes, StructureVariants } from "./types.js";

const ImportantRotations = [ObjectTypes.Fence, ObjectTypes.Gate, ObjectTypes.Structure, ObjectTypes.Switch, ObjectTypes.Water, ObjectTypes.Zipline];
const RotationVariantExceptions = [StructureVariants.Valve];

const ImportantScales = [];
const ScaleVariantExceptions = [];

export function parseObjectLocations(actorGeneratorList, parsedObjectDict) {
  // only the actors that have had parameters parsed
  const knownActors = actorGeneratorList.filter(
    (actor) => {
      return (actor.GenerateInfo?.DebugUniqueId && actor.GenerateInfo.DebugUniqueId in parsedObjectDict);
    }
  );

  // Actors with all parsed params and transforms
  return knownActors.map((actor) => {
    const parsedObject = parsedObjectDict[actor.GenerateInfo.DebugUniqueId];

    const needsRotation = ImportantRotations.includes(parsedObject.type) && !RotationVariantExceptions.includes(parsedObject.variant);
    const needsScale = ImportantScales.includes(parsedObject.type) && !ScaleVariantExceptions.includes(parsedObject.variant);
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
      transform.rotation = eulerAngle.z * 180 / Math.PI;
    }
    if (needsScale) {
      transform.scale = {
        x: actor.InitTransform.Scale3D.X,
        y: actor.InitTransform.Scale3D.Y,
      };
    }

    // keep all params, but add in transform
    return { ...parsedObject, transform };
  });
}

export function parseCreatureLocations(actorGeneratorList, parsedCreatureDict) {
  // only the actors that have had parameters parsed
  const knownActors = actorGeneratorList.filter(
    (actor) => actor.GenerateInfo?.DebugUniqueId && actor.GenerateInfo.DebugUniqueId in parsedCreatureDict
  );

  // Actors with all parsed params and transforms
  return knownActors.map((actor) => {
    const parsedObject = parsedCreatureDict[actor.GenerateInfo.DebugUniqueId];

    const transform = {
      translation: { 
        x: actor.InitTransform.Translation.X,
        y: actor.InitTransform.Translation.Y
      },
    }

    // keep all params, but add in transform
    return { ...parsedObject, transform };
  });
}
