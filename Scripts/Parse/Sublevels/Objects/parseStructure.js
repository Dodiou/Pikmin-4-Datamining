import { ObjectTypes, StructureVariants } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

function parseStructureProps(structureParams) {
  return {
    type: ObjectTypes.Structure,
    variant: structureParams._variant,
    materialsNeeded:
      (structureParams.NeedColumnNum * structureParams._panelsPerRow * structureParams.PiecePerPanel) - structureParams.PiecePutNum
  }
}

const BridgeParamDefaults = {
  _panelsPerRow: 6, // custom prop by me
  _variant: StructureVariants.Bridge,
  // number of pieces per panel.
  PiecePerPanel: 1,
  // number of pieces already placed (not panels)
  PiecePutNum: 3, // see Seafloor Resort floor 3 (3 are placed); also Ultimate Testing Range floor 1
  // number of rows of panels. (not pieces)
  NeedColumnNum: 5 // Serene Shores, bridge near 1st base (40 - 13 = 17); also Ultimate Testing Range floor 1
}
function parseStructureBridgeComp(BridgeFlexibleAI) {
  const structureParams = { ...BridgeParamDefaults, ...BridgeFlexibleAI.Properties };
  return parseStructureProps(structureParams);
}

const ClimbingWallDefaults = {
  _panelsPerRow: 4,
  _variant: StructureVariants.Wall,
  PiecePerPanel: 2, // See all, except Area002_Hero_Objects
  PiecePutNum: 0, // TODO: unknown, no files are missing this prop
  NeedColumnNum: 2, // TODO: unknown, no files are missing this prop
}
function parseStructureWallComp(BuildWallFlexibleAI) {
  const structureParams = { ...ClimbingWallDefaults, ...BuildWallFlexibleAI.Properties };
  return parseStructureProps(structureParams);
}

// PiecePutNum(8) + Defaults = 12 (Seafloor Resort floor 1)
// All Defaults = 16 (All other valves)
const ValveParamDefaults = {
  _panelsPerRow: 1, // not really rows on this thing
  _variant: StructureVariants.Valve,
  PiecePerPanel: 2, // kinda guessing here. Structure is 1 piece, then 4 panels, then 1 piece, then 4 panels, then 1 panel (total 10 full panels)
  PiecePutNum: 4, // (first placed piece is underneath all others, flat and in the center. next 4 are first layer)
  NeedColumnNum: 10, 
  // _panelsPerRow, PiecePerPanel, and NeedColumnNum are unknown, since nothing uses these.
  // whatever maths out to 20 pieces needed is probably fine.
}
function parseStructureValveComp(ValveAI) {
  const structureParams = { ...ValveParamDefaults, ...ValveAI.Properties };
  return parseStructureProps(structureParams);
}

// Props             Mats Needed       Total       Object name
// PiecePutNum(5)  = 20 (Olimar SST) = 25 pieces = 50uu
// PiecePutNum(10) = 15 (PT)         = 25 pieces = 50uu
// PiecePutNum(0)  = 25 (CotB)       = 25 pieces = Sidecut50uu
// Defaults        = 21 (EC)         = 25 pieces = Sidecut
// PiecePutNum(10) = 25 (BGD)        = 25 pieces = Sidecut
// Defaults        = 21 (Hideaway)   = 25 pieces = (none)
// PiecePutNum(22) = 24 (Olimar BA)  = 46 pieces = SideCut80uu
// PiecePutNum(21) = 25 (GH)         = 46 pieces = SideCut80uu
// PiecePutNum(8)  = 38 (GH)         = 46 pieces = SideCut80uu
const SlopeParamDefaults = {
  _panelsPerRow: 1, // not really rows on this thing
  _variant: StructureVariants.Slope,
  PiecePerPanel: 1,
  PiecePutNum: 4, // See Engulfed Castle floor 4, Hero's Hideaway
  NeedColumnNum: 25, 
  // _panelsPerRow, PiecePerPanel, and NeedColumnNum are unknown, since nothing uses these.
  //   total mats = 46 if Name includes '80uu', else 25
}
function parseStructureSlopeComp(SlopeBothAI) {
  const isLargeSlope = SlopeBothAI.Name.includes('80uu'); // wish there was a better way to get this
  const structureParams = { ...SlopeParamDefaults, ...SlopeBothAI.Properties };
  structureParams.NeedColumnNum = isLargeSlope ? 46 : 25;

  return parseStructureProps(structureParams);
}



export function isStructureComp(comp) {
  return !!(
    comp.Properties.BuildWallFlexibleAI ||
    comp.Properties.BridgeFlexibleAI ||
    comp.Properties.ValveAI ||
    comp.Properties.SlopeBothAI
  );
}

export function parseStructureComp(comp, compsList) {
  if (comp.Properties.BuildWallFlexibleAI) {
    const wallComp = getObjectFromPath(comp.Properties.BuildWallFlexibleAI, compsList);
    return parseStructureWallComp(wallComp);
  }
  else if (comp.Properties.BridgeFlexibleAI) {
    const bridgeComp = getObjectFromPath(comp.Properties.BridgeFlexibleAI, compsList);
    return parseStructureBridgeComp(bridgeComp);
  }
  else if (comp.Properties.ValveAI) {
    const valveComp = getObjectFromPath(comp.Properties.ValveAI, compsList);
    return parseStructureValveComp(valveComp);
  }
  else if (comp.Properties.SlopeBothAI) {
    const slopeComp = getObjectFromPath(comp.Properties.SlopeBothAI, compsList);
    return parseStructureSlopeComp(slopeComp);
  }

  throw new Error('Could not parse unknown structure');
}
