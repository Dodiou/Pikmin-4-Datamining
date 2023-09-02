import { getObjectFromPath, removeUndefineds } from "../util.js";
import { getCreatureFromType } from "./objectBlueprints.js";
import { parseCreatureDropList, parseFlintBeetleDropList } from './parseDrops.js';

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
