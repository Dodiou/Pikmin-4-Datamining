// TODO auto build this list w/ debugDropItems
const AllDropValues = [
  'GPikminRed_C',
  'GPikminYellow_C',
  'GPikminBlue_C',
  'GPikminPurple_C',
  'GPikminWhite_C',
  'GPikminRock_C',
  'GPikminWing_C',
  'GPikminIce_C',
  'GHoney_C',
  'GPiecePick_C',
  // Huh?? Glow pellets in Cave002_F00??
  // This might just be a copy/paste thing form night enemies...
  'GHikariStation_C',
  'GHotExtract_C'
]

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

  return parseDropList(comp.Properties.ObjectAIParameter.DropParameter);
}

// NOTE: Some objects have "RareDropParameter", but this always seems to be empty or with drop-rates,min,max set to 0.
export function parseDropList(DropParameter, defaultDrop = undefined) {
  // TODO: a few have "null" DropActor's. What are the default drops?
  const dropsWithUndefineds = DropParameter.DropItemParameter.map((dropItem) => {
    if (dropItem.DropRatio <= 0.0) {
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
      min: dropItem.MinNum,
      max: dropItem.Max,
    };
  });

  // filter out the undefineds and DropsToExclude
  return dropsWithUndefineds.filter(dropItem => dropItem && !DropsToExclude.includes(dropItem.item));
}
