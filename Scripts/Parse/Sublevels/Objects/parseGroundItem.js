import { ItemVariants, ObjectTypes } from "../../types.js";

const ItemMap = {
  'GIceBomb_C': ItemVariants.Bomb,
  'GBomb_C': ItemVariants.IceBomb,
};

export function isGroundItemComp(comp) {
  return !!comp.Properties.BombAI;
}

export function parseGroundItemComp(comp) {
  const variant = ItemMap[comp.Type];
  if (!variant) {
    throw new Error("Unknown item type!");
  }

  return {
    type: ObjectTypes.Item,
    variant
  };
}