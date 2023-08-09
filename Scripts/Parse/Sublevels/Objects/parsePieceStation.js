import { ObjectTypes } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

// "PieceStations" are piles that pikmin will run back and forth to. Includes Materials, Gold Nuggets, and "Star Bits"/glow pellets
function parsePieceStationAIComp(stationType, PieceStationAI) {
  // Hopefully "Outer" always includes the type. If not, component type will have to be deferred until XYZ is read.
  const isGoldNugget = stationType.includes('KinkaiStation');
  const isGlowPellet = stationType.includes('HikariStation');
  const isMaterials = stationType.includes('BridgeStation');

  if (!(isGoldNugget || isGlowPellet || isMaterials)) {
    throw new Error(`Unknown work station found! ${PieceStationAI.Outer}.`);
  }

  return {
    type: isGoldNugget
      ? ObjectTypes.Treasure
      : isMaterials
        ? ObjectTypes.Materials
        : isGlowPellet
          ? ObjectTypes.GlowPellets
          : ObjectTypes.Unknown,
    amount: PieceStationAI.Properties.PieceNum,
  };
}

export function isPieceStationComp(comp) {
  return !!comp.Properties.PieceStationAI;
}

export function parsePieceStationComp(comp, compsList) {
  const pieceStationComp = getObjectFromPath(comp.Properties.PieceStationAI, compsList);
  return parsePieceStationAIComp(comp.Type, pieceStationComp);
}
