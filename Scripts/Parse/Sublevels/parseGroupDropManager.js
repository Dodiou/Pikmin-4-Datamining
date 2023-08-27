import { InfoType, MarkerType } from "../types.js";
import { getObjectFromPath, removeUndefineds } from "../util.js";
import { parseDropList } from "./parseDrops.js";

// NOTE: there is 1 group drop manager in an Objects file (Cave009)
export function isGroupDropManagerComp(comp) {
  return !!comp.Properties.GroupDropManager;
}

/*
 * Occurs in
 * - Secluded Courtyard F00
 * - Subterranean Swarm F01
 * - Doppelganger's Den F01
 * - Hectic Hollows F00
 */
const DEFAULT_DROP = {
  item: 'GPiecePick_C',
  chance: 1,
  min: 1,
  max: 1,
}

export function parseGroupDropManagerComp(comp, compsList) {
  const GroupDropManager = getObjectFromPath(comp.Properties.GroupDropManager, compsList);

  const ignoreIds = GroupDropManager.Properties.GroupDropManagerAIParameter.IgnoreCIDList;
  const radius = GroupDropManager.Properties.GroupDropManagerAIParameter.GroupingRadius;
  let drops = GroupDropManager.Properties.GroupDropManagerAIParameter?.DropParameter?.DropItemParameter
    ? parseDropList(GroupDropManager.Properties.GroupDropManagerAIParameter.DropParameter, DEFAULT_DROP)
    : [DEFAULT_DROP];

  if (drops.length > 1) {
    /*
     * Only first item is dropped. See:
     * - Industrial Maze F02
     * - Kingdom of Beasts F05
     * - Cavern for a King F02, F04, F15
     * - Doppelganger's Den F03
     * - Dream Home
     */
    drops = drops.slice(0, 1);
  }
  if (!radius) {
    // CfaK F02
    console.warn(`Unknown/bad GroupDropManager radius: ${radius}.`);
  }

  return removeUndefineds({
    type: MarkerType.MiscGroupdropmanager,
    infoType: InfoType.Misc,
    ignoreIds,
    radius,
    drops
  });
}