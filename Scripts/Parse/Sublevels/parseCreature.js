import { default as EnemyData } from '../../../Enemy Data/BaseData.json' assert { type: 'json' };
import { default as EnemyNames } from '../../../Localization/GenseiName/en-US/GenseiName.json' assert { type: 'json' };
import { InfoType, MarkerType } from '../types.js';
import { getInternalId, getObjectFromPath, removeLocalizationMetadata, removeUndefineds } from "../util.js";
import { parseCreatureDropList, parseFlintBeetleDropList } from './parseDrops.js';

const CreatureIdMap = {
  'BIGCHAPPY': 'BIGCHAPPY_NIGHT',
  'DODOROEGG': 'DODORO',
  'BOSSINU2': 'BOSSINU',
  'BURROWDEMEJAKO': 'DEMEJAKO',
  'BURROWDEMEJAKOCLOSE': 'DEMEJAKO',
}
function getCreatureId(type) {
  const internalId = getInternalId(type);
  if (internalId.startsWith('NIGHT')) {
    return internalId.substring('NIGHT'.length);
  }
  return CreatureIdMap[internalId] || internalId;
}

const CreatureMap = EnemyData[0].Rows;
const CreatureNamesMap = EnemyNames.GenseiName;
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
    seeds: creature.CarryIncPikmins
  }
};

export function isCreatureComp(comp) {
  return !comp.Properties.EggAI &&
    // These are the other holes Bug-Eyed Crawmad can burrow out of
    !comp.Properties.BurrowAI &&
    // These are Arachnode webs, for some reason do not use the internal name 'Marigumo'
    !comp.Properties.TamagumoNetAI &&
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
