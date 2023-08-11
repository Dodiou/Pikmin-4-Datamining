import { ObjectTypes, SpoutVariants } from "../../types.js";

export function isSpoutComp(comp) {
  return !!comp.Properties.HibaBaseAI;
}

const SpoutVariantMap = {
  'GHibaIce_C': SpoutVariants.Ice,
  'GHibaWater_C': SpoutVariants.Water,
  'GHibaPoison_C': SpoutVariants.Poison,
  'GHibaBubble_C': SpoutVariants.Bubble,
  'GHibaDenki_C': SpoutVariants.Electric,
  'GHiba_C': SpoutVariants.Fire,
}
export function parseSpoutComp(comp) {
  const variant = SpoutVariantMap[comp.Type];

  return {
    type: ObjectTypes.Spout,
    variant
  }
}