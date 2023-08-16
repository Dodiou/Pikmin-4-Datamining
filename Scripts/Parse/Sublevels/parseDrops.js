import { getTypeFromBlueprint } from "../util.js";

const AllDropValues = [
  'GHoney_C',             'GPiecePick_C',        'GPikminIce_C',
  'GHotExtract_C',        'GPikminBlue_C',       'GOtaYoshiCookieB_C',
  'GPikminRed_C',         'GSurvivorA_C',        'GPikminYellow_C',
  'GOtaDuckS_C',          'GMiniMochi_C',        'GOtaIsobeyaki_C',
  'GOtaCandyStick_C',     'GOtaDice6WHT_C',      'GOtaGamaguchi_C',
  'GKinkaiPick_C',        'GOtaBilliardBall5_C', 'GOtaDarts_C',
  'GOtaSpeaker_C',        'GOtaYoshiCookieC_C',  'GOtaTomatoS_C',
  'GOtaRingo_C',          'GOtaDisc_C',          'GOtaRingPop_C',
  'GOtaPaintsRED_C',      'GOtaHanafudaE_C',     'GOtaGolfBall_C',
  'GIceBomb_C',           'GOtaLaFrance_C',      'GOtaMacaronA_C',
  'GOtaMacaronB_C',       'GOtaMangosteen_C',    'GOtaFruitsPickYEL_C',
  'GBomb_C',              'GOtaFruitsPickORN_C', 'GOtaMelon_C',
  'GOtaPuzzleG_C',        'GOtaPumpkin_C',       'GOtaEggplant_C',
  'GOtaButtonMetal_C',    'GOtaJoyConR_C',       'GOtaDragonFruit_C',
  'GOtaShutterGlasses_C', 'GOtaCollar_C',        'GSurvivorLouie_C',
  'GOtaNashi_C',          'GPikminWing_C',       'GOtaMuscat_C',
  'GOtaKaki_C',           'GOtaSFCMouse_C',      'GNiseZako_C',
  'GOtaDice4Sided_C',     'GOtaDice20_C',        'GSurvivorLeaf_C',
  'GOtaRailwayLineE_C',   'GOtaLime_C',          'GOtaIcePick_C',
  'GBabyCrow_C',          'GOtaCasinoChip10_C',  'GOtaJamIchigo_C',
  'GOtaButtonPlastic_C',  'GOtaIchijiku_C',      'GOtaHam_C',
  'GOtaPotato_C',         'GOtaTomatoM_C',       'GOtaMatDollLB_C',
  'GOtaApricot_C',        'GPikminWhite_C',      'GPikminPurple_C',
  'GOtaButtonWood_C',     'GOtaPlum_C',          'GOtaHanafudaC_C',
  'GPellet1_C',           'GPellet5_C',          'GOtaGaragara_C',
  'GOtaBrushA_C',         'GOtaHeroPartsD_C',    'GTamagoMushi_C',
  'GOtaHeroPartsT_C',     'GOtaDuckB_C',         'GKanitama_C',
  'GOtaLemon_C',          'GOtaSushiEbi_C',      'GOtaHeroPartsAC_C',
  'GOtaHeroPartsZ_C',     'GOtaHeroPartsS_C',    'GOtaPapaya_C',
  'GOtaCasinoChip50_C',   'GOtaMango_C',         'GOtaRoboHandR_C',
  'GOtaPaperballoon_C',   'GOtaHeroPartsG_C',
  // This drop appears in non-night areas. might just be a copy/paste thing from night enemies.
  'GHikariStation_C'
];

// This drop appears in non-night areas. might just be a copy/paste thing from night enemies.
const DropsToExclude = ['GHikariStation_C'];


const TrackedDropValues = {};
function trackDropItem(item) {
  TrackedDropValues[item] = true;
}

export function debugDropItems() {
  console.log(Object.keys(TrackedDropValues));
}

export const DefaultLarvaDrop = {
  item: 'GBaby_C',
  chance: 1.0,
  min: 1,
  max: 1,
};

/*
 * DropParameter for objects comes from Properties.ObjectAIParameter.DropParameter
 */
export function parseObjectDropList(comp, defaultDrop = undefined) {
  if (!comp.Properties?.ObjectAIParameter?.DropParameter?.DropItemParameter) {
    return defaultDrop ? [defaultDrop] : [];
  }

  // there's one mound (Secluded Courtyard Floor 3) with this annoying parameter
  const dropAmountMultiplier = comp.Properties.TateanaAIParameter?.NumDig || 1;

  return parseDropList(comp.Properties.ObjectAIParameter.DropParameter, defaultDrop, dropAmountMultiplier);
}

export function parseCreatureDropList(aiComp) {
  if (!aiComp.Properties?.TekiAIParameter?.DropParameter?.DropItemParameter) {
    return [];
  }

  return parseDropList(aiComp.Properties.TekiAIParameter.DropParameter);
}

// Note: Drops for flint beetles use KoganeBaseAIParameter instead.
//       See: Area001 Teki_Day beetle, near the pond near the challenge cave
//       It drops 1 pellet, three 1 pellets, two 5 pellets instead of its TekiAI drop list.
const DefaultIridescentBeetleDrops = [
  {
    item: 'GPellet1_C',
    chance: 1.0,
    min: 1,
    max: 1,
  },
  {
    item: 'GPellet1_C',
    chance: 1.0,
    min: 3,
    max: 3,
  },
  {
    item: 'GPellet5_C',
    chance: 1.0,
    min: 2,
    max: 2,
  }
];
// See: Area006 Teki_Day beetle, near the tunnel near landing site 2
const DefaultGoldenBeetleDrops = [
  {
    item: 'GHotExtract_C',
    chance: 1.0,
    min: 1,
    max: 1,
  },
  {
    item: 'GHotExtract_C',
    chance: 1.0,
    min: 2,
    max: 2,
  },
  {
    item: 'GHotExtract_C',
    chance: 1.0,
    min: 3,
    max: 3,
  }
];
// stinkbug. Drops seem random. These are the ones I have seen.
const DefaultDoodleBugDrops = [
  {
    item: 'GIceBomb_C',
    chance: 0.5,
    min: 1,
    max: 3,
  },
  {
    item: 'GBomb_C',
    chance: 0.5,
    min: 1,
    max: 3,
  },
  {
    item: 'GTamagoMushi_C', // Mitites.
    chance: 0.0, // unknown chance
    min: 8,
    max: 8,
  },
  {
    item: 'GHotExtract_C', // very low chance. also had 2 bombs with it.
    chance: 0.0, // unknown chance
    min: 1,
    max: 1,
  },
];
export function parseFlintBeetleDropList(aiComp) {
  if (!aiComp.Type.includes('Kogane')) {
    throw new Error(`Trying to add Flint Beetle drops for a non-Flint Beetle: ${comp.Type}`);
  }

  if (aiComp.Properties?.KoganeBaseAIParameter?.DropParameter?.ParameterList) {
    const dropItemsList = aiComp.Properties.KoganeBaseAIParameter.DropParameter.ParameterList.reduce(
      (collector, curDropList) => {
        return [...collector, ...curDropList.DropItemParameter]
      },
      []
    );
    return parseDropList({ DropItemParameter: dropItemsList });
  }

  if (aiComp.Type.startsWith('Oo')) {
    return DefaultGoldenBeetleDrops;
  }
  else if (aiComp.Type.startsWith('Gas')) {
    return DefaultDoodleBugDrops;
  }
  return DefaultIridescentBeetleDrops;
}

// NOTE: Some objects have "RareDropParameter", but this always seems to be empty or with drop-rates,min,max set to 0.
export function parseDropList(DropParameter, defaultDrop = undefined, dropAmountMultiplier = 1) {
  // TODO: a few have "null" DropActor's. What are the default drops?
  const dropsWithUndefineds = DropParameter.DropItemParameter.map((dropItem) => {
    if (dropItem.DropRatio <= 0.0 || dropItem.MaxNum <= 0) {
      return undefined;
    }
    if (!dropItem.SpawnMiniInfo?.DropActor?.ObjectName) {
      return defaultDrop;
    }

    const blueprintName = dropItem.SpawnMiniInfo.DropActor.ObjectName;
    const internalItemName = getTypeFromBlueprint(blueprintName);
    trackDropItem(internalItemName);

    return {
      item: internalItemName,
      chance: dropItem.DropRatio,
      min: dropItem.MinNum * dropAmountMultiplier,
      max: dropItem.MaxNum * dropAmountMultiplier,
    };
  });

  // filter out the undefineds and DropsToExclude
  return dropsWithUndefineds.filter(dropItem => dropItem && !DropsToExclude.includes(dropItem.item));
}
