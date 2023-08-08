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
  'GHikariStation_C', // Huh?? Glow pellets in Cave002_F00??
  'GHotExtract_C'
]

const DropsToInclude = [];


const TrackedDropValues = {};
function trackDropItem(item) {
  TrackedDropValues[item] = true;
}

export function debugDropItems() {
  console.log(Object.keys(TrackedDropValues));
}

/*
 * DropParameter for objects comes from Properties.ObjectAIParameter.DropParameter
 */
export function parseObjectDropList(comp) {
  if (!comp.Properties?.ObjectAIParameter?.DropParameter?.DropItemParameter) {
    return [];
  }

  return parseDropList(comp.Properties.ObjectAIParameter.DropParameter);
}

// NOTE: Some objects have "RareDropParameter", but this always seems to be empty or with drop-rates,min,max set to 0.
export function parseDropList(DropParameter) {
  return DropParameter.DropItemParameter.map(dropItem => {
    // TODO a few have "null" DropActor's. What happens if these drop rates hit?
    //      I am just setting to the BABY teki for now.
    const blueprintName = dropItem.SpawnMiniInfo.DropActor?.ObjectName || "'GBaby_C'";

    const internalItemName = blueprintName.substring(blueprintName.indexOf("'") + 1, blueprintName.length - 1);
    trackDropItem(internalItemName);

    return {
      item: internalItemName,
      chance: dropItem.DropRatio,
      min: dropItem.MinNum,
      max: dropItem.Max,
    }
  })
}
