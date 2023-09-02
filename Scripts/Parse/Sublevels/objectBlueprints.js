import { default as EnemyData } from '../../../Enemy Data/BaseData.json' assert { type: 'json' };
import { default as EnemyNames } from '../../../Localization/GenseiName/en-US/GenseiName.json' assert { type: 'json' };
import { default as TreasureData } from "../../../Treasure Data/BaseData.json" assert { type: "json" };
import { default as TreasureNames } from "../../../Localization/OtakaraName/en-US/OtakaraName.json" assert { type: "json" };
import { getInternalId, removeLocalizationMetadata } from "../util.js";
import { InfoType, MarkerType, PikminColorBlueprintMap, PikminSpawnState } from "../types.js";

/**
 * This file contains default object blueprint values.
 */

const DefaultSurvivorDrop = {
  type: MarkerType.CastawayNormal,
  infoType: InfoType.Castaway,
  isLeafling: false,
  isKoppaite: false,
  weight: 3,
  carryMax: 6
};

export const DefaultObject = {
  'GIcicle_C': {
    type: MarkerType.MiscIcicle,
    infoType: InfoType.Misc
  },
  'GEgg_C': {
    type: MarkerType.BreakableEgg,
    infoType: InfoType.Breakable,
    isBig: false,
  },
  'GHoney_C': {
    type: MarkerType.MiscHoney,
    infoType: InfoType.Misc
  },
  'GHotExtract_C': {
    type: MarkerType.MiscSpicy,
    infoType: InfoType.Misc
  },
  'GPiecePick_C': {
    type: MarkerType.PileMaterials,
    infoType: InfoType.Pile
  },
  'GHikariStation_C': {
    type: MarkerType.PileGlowpellets,
    infoType: InfoType.Pile
  },
  'GIceBomb_C': {
    type: MarkerType.MiscIcebomb,
    infoType: InfoType.Misc
  },
  'GBomb_C': {
    type: MarkerType.MiscBomb,
    infoType: InfoType.Misc
  },
  'GPellet1_C': {
    type: MarkerType.MiscPellet,
    InfoType: InfoType.Misc
  },
  'GPellet5_C': {
    type: MarkerType.MiscPellet,
    InfoType: InfoType.Misc
  },
  'GSurvivorA_C': DefaultSurvivorDrop,
  'GSurvivorLouie_C': DefaultSurvivorDrop,
  'GSurvivorLeaf_C': {
    ...DefaultSurvivorDrop,
    type: MarkerType.CastawayLeafling,
    isLeafling: true,
  },
  'GOnyonCarryBoost_C': {
    type: MarkerType.OnionFlarlic,
    infoType: InfoType.Onion,
    color: 'flarlic',
    weight: 5
  }
};

export const DefaultObjectWithDrops = {
  ...DefaultObject,
  'GEgg_C': {
    ...DefaultObject.GEgg_C,
    drops: [
      {
        ...DefaultObject.GHoney_C,
        chance: 0.75,
        min: 1,
        max: 1
      },
      {
        ...DefaultObject.GPiecePick_C,
        chance: 0.2,
        min: 1,
        max: 1
      },
      {
        ...DefaultObject.GHotExtract_C,
        chance: 0.05,
        min: 1,
        max: 1
      }
    ]
  }
};


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
  };
};


const TreasureNameMap = TreasureNames.OtakaraName;
function getTreasureName(treasureId) {
  const localeStr = TreasureNameMap[treasureId];
  // remove meta-data/styling from treasure names
  return removeLocalizationMetadata(localeStr);
}

const TreasureMap = TreasureData[0].Rows;
export function getTreasureFromType(type) {
  type = type === 'GKinkaiPick_C' ? 'GKinkaiStation_C' : type;

  const treasureId = getInternalId(type);
  const treasure = TreasureMap[treasureId];

  if (!treasure) {
    throw new Error(`Unknown treasure ${treasureId}`);
  }

  return {
    type: MarkerType.Treasure,
    infoType: InfoType.Treasure,
    treasureId: treasureId,
    name: getTreasureName(treasureId),
    weight: treasure.CarryWeightMin,
    carryMax: treasure.CarryWeightMax,
    value: treasure.Kira,
  };
}


function getPikminFromType(type) {
  const color = PikminColorBlueprintMap[type];
  if (!color) {
    throw new Error(`Unknown pikmin ${type}`);
  }

  const markerType = `${InfoType.Pikmin}-${color}`;
  return {
    type: markerType,
    infoType: InfoType.Pikmin,
    color,
    state: PikminSpawnState.Idle
  }
}


export function getObjectFromType(type) {
  if (type.startsWith('GOta') || type.startsWith('GKinkai')) {
    return getTreasureFromType(type);
  }
  else if (type.startsWith('GPikmin')) {
    return getPikminFromType(type);
  }

  const blueprint = DefaultObject[type];
  return blueprint ? blueprint : getCreatureFromType(type);
}
