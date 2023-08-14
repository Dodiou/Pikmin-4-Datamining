const AllDropValues = [
  "GPiecePick_C",
  "GOtaButtonWood_C",
  "GOtaPlum_C",
  "GHoney_C",
  "GBomb_C",
  "GOtaGolfBall_C",
  "GIceBomb_C",
  "GOtaDuckB_C",
  "GKanitama_C",
  "GHotExtract_C",
  "GOtaMango_C",
  "GKinkaiPick_C",
  "GNiseZako_C",
  "GOtaRoboHandR_C",
  "GOtaApricot_C",
  "GSurvivorA_C",
  "GOtaBilliardBall5_C",
  "GOtaPuzzleG_C",
  "GOtaTomatoS_C",
  "GOtaDice6WHT_C",
  "GOtaPotato_C",
  "GOtaMatDollLB_C",
  "GPikminRed_C",
  'GPikminYellow_C',
  'GPikminBlue_C',
  "GPikminPurple_C",
  "GPikminWhite_C",
  'GPikminRock_C',
  "GPikminWing_C",
  "GPikminIce_C",
  // This drop appears in non-night areas. might just be a copy/paste thing from night enemies.
  'GHikariStation_C',
];

const CaveDrops = [
  'GHoney_C',            'GPiecePick_C',        'GPikminIce_C',
  'GHotExtract_C',       'GHikariStation_C',    'GOtaYoshiCookieB_C',
  'GPikminRed_C',        'GSurvivorA_C',        'GPikminYellow_C',
  'GOtaDuckS_C',         'GMiniMochi_C',        'GOtaIsobeyaki_C',
  'GOtaCandyStick_C',    'GPellet1_C',          'GPellet5_C',
  'GOtaDice6WHT_C',      'GOtaGamaguchi_C',     'GKinkaiPick_C',
  'GOtaBilliardBall5_C', 'GOtaDarts_C',         'GOtaSpeaker_C',
  'GOtaYoshiCookieC_C',  'GOtaTomatoS_C',       'GOtaRingo_C',
  'GOtaDisc_C',          'GOtaRingPop_C',       'GOtaPaintsRED_C',
  'GOtaHanafudaE_C',     'GOtaGolfBall_C',      'GIceBomb_C',
  'GOtaLaFrance_C',      'GOtaMacaronA_C',      'GOtaMacaronB_C',
  'GOtaMangosteen_C',    'GOtaFruitsPickYEL_C', 'GBomb_C',
  'GOtaFruitsPickORN_C', 'GOtaMelon_C',         'GOtaPuzzleG_C',
  'GOtaPumpkin_C',       'GOtaEggplant_C',      'GOtaButtonMetal_C',
  'GOtaJoyConR_C',       'GOtaDragonFruit_C',   'GOtaShutterGlasses_C',
  'GOtaCollar_C',        'GSurvivorLouie_C',    'GOtaNashi_C',
  'GPikminWing_C',       'GOtaMuscat_C',        'GOtaKaki_C',
  'GOtaSFCMouse_C',      'GNiseZako_C',         'GOtaDice4Sided_C',
  'GOtaDice20_C',        'GSurvivorLeaf_C',     'GOtaRailwayLineE_C',
  'GOtaLime_C',          'GOtaIcePick_C',       'GBabyCrow_C',
  'GOtaCasinoChip10_C',  'GOtaJamIchigo_C',     'GOtaButtonPlastic_C',
  'GOtaIchijiku_C',      'GOtaHam_C',           'GOtaPotato_C',
  'GOtaTomatoM_C',       'GOtaMatDollLB_C',     'GOtaApricot_C',
  'GPikminWhite_C',      'GPikminPurple_C'
];

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
    const internalItemName = blueprintName.substring(blueprintName.indexOf("'") + 1, blueprintName.length - 1);
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
