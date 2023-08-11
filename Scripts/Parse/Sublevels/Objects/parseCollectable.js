import { ObjectTypes } from "../../types.js";
import { default as TreasureData } from "../../../../Treasure Data/BaseData.json" assert { type: "json" };
import { default as TreasureNames } from "../../../../Localization/OtakaraName/en-US/OtakaraName.json" assert { type: "json" };;

// NOTE: Onion spelled w/ onyomi keystrokes in game files
const OnionColorMap = {
  'GOnyonCarryBoost_C': 'flarlic',
  'GOnyonBootUpRed_C': 'red',
  'GOnyonCarryWhite_C': 'white',
  'GOnyonCarryPurple_C': 'purple',
  'GOnyonCarryYellow_C': 'yellow',
  'GOnyonCarryBlue_C': 'blue',
  'GOnyonCarryIce_C': 'ice',
  'GOnyonCarryStone_C': 'rock',
  'GOnyonCarryPink_C': 'wing',
}
const OnionWeightMap = {
  'flarlic': 5,
  'red': 3,
  'white': 10,
  'purple': 100,
  'yellow': 20,
  'blue': 20,
  'ice': 30,
  'rock': 30,
  'wing': 10,
}
function parseOnionComp(comp) {
  const color = OnionColorMap[comp.Type];
  const weight = OnionWeightMap[color];

  if (!color) {
    throw new Error('Unknown onion color!');
  }

  return {
    type: ObjectTypes.Onion,
    color,
    weight
  };
}


const TreasureNameMap = TreasureNames.OtakaraName;
function getTreasureName(treasureId) {
  const localeStr = TreasureNameMap[treasureId]
  // remove meta-data/styling from treasure names
  return localeStr.substring(localeStr.lastIndexOf(']') + 1);
}

const TreasureMap = TreasureData[0].Rows;
function parseTreasureComp(comp) {
  // Remove starting 'G' and ending '_C' from Type to get the name. Force uppercase
  const treasureId = comp.Type.substring(1, comp.Type.length - 2).toUpperCase();
  const treasure = TreasureMap[treasureId];

  if (!treasure) {
    throw new Error('Unknown treasure!');
  }

  return {
    type: ObjectTypes.Treasure,
    treasureId: treasureId,
    name: getTreasureName(treasureId),
    weight: treasure.CarryWeightMin,
    carryMax: treasure.CarryWeightMax,
    value: treasure.Kira,
  };
}


function isCastaway(comp) {
  return comp.Type.startsWith('GSurvivor');
}

function parseCastaway(comp) {
  const isLeafling = comp.Type.startsWith('GSurvivorLeaf') ||
    comp.Type.startsWith('GSurvivorOlimarLeaf');
  const isKoppaite = comp.Type.startsWith('GSurvivorKoppai');

  return {
    type: ObjectTypes.Castaway,
    isLeafling,
    weight: 3,
    carryMax: 6
  }
}

export function isCollectableComp(comp) {
  return !!(
    // Castaways are considered treasures <3
    comp.Properties.OtakaraAI ||
    comp.Properties.OnyonCarryAI
  )
}

export function parseCollectableComp(comp, compsList) {
  if (comp.Properties.OnyonCarryAI) {
    return parseOnionComp(comp, compsList);
  }
  else if (isCastaway(comp)) {
    return parseCastaway(comp, compsList);
  }
  else if (comp.Properties.OtakaraAI) {
    return parseTreasureComp(comp, compsList);
  }
  throw new Error('Unknown collectable!');
}
