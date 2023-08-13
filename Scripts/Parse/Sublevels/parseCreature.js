import { default as EnemyData } from '../../../Enemy Data/BaseData.json' assert { type: 'json' };
import { default as EnemyNames } from '../../../Localization/GenseiName/en-US/GenseiName.json' assert { type: 'json' };
import { ObjectTypes } from '../types';
import { getInternalId, getObjectFromPath, removeLocalizationMetadata, removeUndefineds } from "../util.js";
import { parseCreatureDropList } from './parseDrops';

export function isCreatureComp(comp) {
  return !comp.Properties.EggAI && Object.keys(comp.Properties).some(key => key.endsWith('AI'));
}

export function parseCreatureComp(comp, compsList) {
  const aiComponentKey = Object.keys(comp.Properties).find(key => key.endsWith('AI'));

  if (!aiComponentKey) {
    throw new Error(`The enemy ${comp.Type} has no AI component.`);
  }

  const AIComponent = getObjectFromPath(comp, compsList);
  const creatureId = getInternalId(comp);

  const creature = EnemyData[creatureId];
  if (!creature) {
    throw new Error(`Unknown creature ${creatureId}.`);
  }

  const creatureName = removeLocalizationMetadata(EnemyNames[creatureId]);

  return removeUndefineds({
    type: ObjectTypes.Creature,
    creatureId,
    name: creatureName,
    weight: creature.CarryWeighMin,
    carryMax: creature.CarryWeightMax,
    value: creature.Kira,
    seeds: creature.CarryIncPikmins,
    drops: parseCreatureDropList(AIComponent)
  });
}
