import { ObjectTypes } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

// "PieceStations" are piles that pikmin will run back and forth to. Includes Materials, Gold Nuggets, and "Star Bits"/glow pellets
function parsePieceStationAIComp(stationType, PieceStationAI) {
  const isGoldNugget = stationType.includes('KinkaiStation');
  const amount = PieceStationAI.Properties.PieceNum;
  if (isGoldNugget) {
    return {
      type: ObjectTypes.Treasure,
      treasureId: 'KINKAISTATION',
      name: 'Gold Nugget',
      amount,
      weight: 1,
      carryMax: 1,
      value: 5
    }
  }

  const isGlowPellet = stationType.includes('HikariStation');
  const isMaterials = stationType.includes('BridgeStation');

  if (!(isGoldNugget || isGlowPellet || isMaterials)) {
    throw new Error(`Unknown work station found! ${PieceStationAI.Outer}.`);
  }

  return {
    type: isMaterials
      ? ObjectTypes.Materials
      : ObjectTypes.GlowPellets,
    amount
  };
}

export function isPieceStationComp(comp) {
  return !!comp.Properties.PieceStationAI;
}

export function parsePieceStationComp(comp, compsList) {
  const pieceStationComp = getObjectFromPath(comp.Properties.PieceStationAI, compsList);
  return parsePieceStationAIComp(comp.Type, pieceStationComp);
}
