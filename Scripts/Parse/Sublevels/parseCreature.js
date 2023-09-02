import { getObjectFromPath, removeUndefineds } from "../util.js";
import { getCreatureFromType } from "./objectBlueprints.js";
import { parseClamclampDrop, parseCreatureDropList, parseFlintBeetleDropList } from './parseDrops.js';

function hasSpecialDrops(aiComponentName) {
  return aiComponentName.includes('Kogane') || // Flint/Glint beetles, Doodlebugs
    aiComponentName.includes('Yamashinju');    // Pearly clamclamps
}

function getSpecialDrops(AIComponent) {
  return AIComponent.Name.includes("Kogane")
    ? parseFlintBeetleDropList(AIComponent)
    : parseClamclampDrop(AIComponent)
}

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
  let drops = !hasSpecialDrops(aiComponentKey)
    ? parseCreatureDropList(AIComponent)
    : getSpecialDrops(AIComponent);

  return removeUndefineds({
    ...creatureProps,
    drops
  });
}
