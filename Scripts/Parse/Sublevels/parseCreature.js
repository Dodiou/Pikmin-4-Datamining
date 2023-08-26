import { default as EnemyData } from '../../../Enemy Data/BaseData.json' assert { type: 'json' };
import { default as EnemyNames } from '../../../Localization/GenseiName/en-US/GenseiName.json' assert { type: 'json' };
import { InfoType, MarkerType } from '../types.js';
import { getInternalId, getObjectFromPath, removeLocalizationMetadata, removeUndefineds } from "../util.js";
import { parseCreatureDropList, parseFlintBeetleDropList } from './parseDrops.js';


const CreatureMap = EnemyData[0].Rows;
const CreatureNamesMap = EnemyNames.GenseiName;
// some special cases
const CreatureIdMap = {
  'DODOROEGG': 'DODORO',
  'BOSSINU2': 'BOSSINU',
  // These names differ slightly from internal IDs
  'BIGCHAPPY': 'BIGCHAPPY_NIGHT',
  'NIGHTKOCHAPPY': 'KOCHAPPY_NIGHT',
  // NOTE: NIGHTCHAPPY (or CHAPPY_NIGHT in BaseData.json) is not used. A normal Bulborb is used instead
  // These are Arachnode webs, they spawn the arachnodes
  'MARIGUMONET': 'MARIGUMO',
  'MARIGUMONET_LOW': 'MARIGUMO',
}
function getCreatureId(type) {
  const internalId = getInternalId(type);
  // If ID can be mapped, return immediately (E.g. NIGHTCHAPPY is valid, but NIGHTTOBINKO is not)
  if (CreatureIdMap[internalId]) {
    return CreatureIdMap[internalId];
  }
  // Night specific instances of enemies. NOTE: these appear in non-night files too
  if (internalId.startsWith('NIGHT')) {
    return internalId.substring('NIGHT'.length);
  }
  return internalId;
}

export function getCreatureFromType(type) {
  const creatureId = getCreatureId(type);

  const creature = CreatureMap[creatureId];
  if (!creature) {
    throw new Error(`Unknown creature ${creatureId}.`);
  }

  if (!CreatureNamesMap[creatureId]) {
    throw new Error(`Unknown creature name ${creatureId}`);
  }
  const creatureName = removeLocalizationMetadata(CreatureNamesMap[creatureId]);

  return {
    type: MarkerType.Creature,
    infoType: InfoType.Creature,
    creatureId,
    name: creatureName,
    weight: creature.CarryWeighMin,
    carryMax: creature.CarryWeightMax,
    value: creature.Kira,
    health: creature.MaxLife,
    seeds: creature.CarryIncPikmins
  }
};

export function isCreatureComp(comp) {
  return !comp.Properties.EggAI &&
    // These are the other holes Crawmads can burrow out of
    !comp.Properties.BurrowAI && // hermit crawmad holes
    !comp.Properties.DemejakoBurrowAI && // bug-eyed crawmad holes
    Object.keys(comp.Properties).some(key => key.endsWith('AI'));
}

export function parseCreatureComp(comp, compsList) {
  const aiComponentKey = Object.keys(comp.Properties).find(key => key.endsWith('AI'));

  if (!aiComponentKey) {
    throw new Error(`The enemy ${comp.Type} has no AI component.`);
  }

  const AIComponent = getObjectFromPath(comp.Properties[aiComponentKey], compsList);
  const creatureProps = getCreatureFromType(comp.Type);

  // Note: flint-beetles ignore normal TekiAIParameter drops.
  let drops = !aiComponentKey.includes("Kogane")
    ? parseCreatureDropList(AIComponent)
    : parseFlintBeetleDropList(AIComponent);

  return removeUndefineds({
    ...creatureProps,
    drops
  });
}
