import { ObjectTypes } from "../../types.js";


export function isPieceStationComp(comp) {
  return !!comp.Properties.PieceStationAI;
}

// "PieceStations" are piles that pikmin will run back and forth to. Includes Materials, Gold Nuggets, and "Star Bits"/glow pellets
export function parsePieceStationAIComp(PieceStationAI) {
  // Hopefully "Outer" always includes the type. If not, component type will have to be deferred until XYZ is read.
  const isGoldNugget = PieceStationAI.Outer.includes('KinkaiStation');
  const isGlowPellet = PieceStationAI.Outer.includes('HikariStation');
  const isMaterials = PieceStationAI.Outer.includes('BridgeStation');

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