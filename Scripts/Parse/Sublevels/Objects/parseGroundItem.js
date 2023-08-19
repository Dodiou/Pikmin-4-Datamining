import { InfoType, MarkerType } from "../../types.js";

const ItemMap = {
  'GIceBomb_C': MarkerType.MiscIcebomb,
  'GBomb_C': MarkerType.MiscBomb,
};

export function isGroundItemComp(comp) {
  return !!comp.Properties.BombAI;
}

export function parseGroundItemComp(comp) {
  const type = ItemMap[comp.Type];
  if (!type) {
    throw new Error("Unknown item type!");
  }

  return {
    type,
    infoType: InfoType.Misc
  };
}