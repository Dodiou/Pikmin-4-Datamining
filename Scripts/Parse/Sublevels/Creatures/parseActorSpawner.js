import { getObjectFromPath } from "../../util";

// NOTE: ActorSpawner is used in Objects as well, but only for mounds. no important info (except maybe larva spawn interval)
// NOTE: the only non-creature spawns are GIcicle_C, and GEgg_C

// comp.Properties.ActorSpawner
// ActorSpawner.Properties?.ActorSpawnAIParameter?.DropSpawnMiniInfo?.DropActor && CustomParameter='ShoulderBomb' (dweevil w bomb)
// Only CustomParameter of note is ShoulderBomb.
//   Others are Bomb (probably a mistake, only two mounds use it) and SVSleep000/LFSleep005/SV024 (survivors)

export function isActorSpawnerComp(comp) {
  return !!(
    comp.Properties.ActorSpawner
  );
}

export function parseActorSpawnerComp(comp, compsList) {
  const ActorSpawner = getObjectFromPath(comp.Properties.ActorSpawner, compsList);

  return {

  };
}
