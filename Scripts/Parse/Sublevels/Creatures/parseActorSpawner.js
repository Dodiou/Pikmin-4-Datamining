import { getTypeFromBlueprint, getObjectFromPath } from "../../util.js";
import { DefaultIcicleObject } from "../Objects/parseMisc.js";
import { getCreatureFromType } from "../parseCreature.js";
import { DefaultEggObject } from "../parseEgg.js";

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
  const blueprintName = ActorSpawner.Properties.ActorSpawnAIParameter.DropSpawnMiniInfo.DropActor.ObjectName;

  const spawnType = getTypeFromBlueprint(blueprintName);
  if (spawnType === 'GEgg_C') {
    return DefaultEggObject;
  }
  else if (spawnType === 'GIcicle_C') {
    return DefaultIcicleObject;
  }

  // TODO: add isDropped property?
  const creature = getCreatureFromType(spawnType);

  // Only one instance of this, the 'Fire Dweevil' carrying a bomb in Cave035_F05
  if (ActorSpawner.Properties.ActorSpawnAIParameter.DropSpawnMiniInfo.CustomParameter === 'ShoulderBomb') {
    creature.creatureId = 'BOMBOTAKARA';
    creature.name = 'Bomb Dweevil';
  }
  return creature;
}
