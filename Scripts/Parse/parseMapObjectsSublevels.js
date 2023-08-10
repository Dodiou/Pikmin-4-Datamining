import { getObjectFromPath } from './util.js';
import { ItemVariants, ObjectTypes } from './types.js';
import { isStructureComp, parseStructureComp } from './Sublevels/Objects/parseStructure.js';
import { isWaterComp, parseWaterComp } from './Sublevels/Objects/parseWater.js';
import { isPikminSpawnerComp, parsePikminSpawnerComp } from './Sublevels/Objects/parsePikmin.js';
import { isPieceStationComp, parsePieceStationComp } from './Sublevels/Objects/parsePieceStation.js';
import { isGateComp, parseGateComp } from './Sublevels/Objects/parseGate.js';
import { isShortcutComp, parseShortcutComp } from './Sublevels/Objects/parseShortcut.js';
import { DefaultLarvaDrop, parseObjectDropList } from './Sublevels/parseDrops.js';

/* 
 * Note: Some props seem to have redundancy in the "ActorPlacementInfo" JSON and the
 *       "Sublevels" JSON.
 *       E.g., AI.Static[0] = NoraSpawnerAI.NoraSpawnerAIParam.NumSpawn
 *             AI.Static[12] = NoraSpawnerAI.NoraSpawnerAIParam.PikminColor (converted from enum to int)
 *             AI.Dynamic[36] = PieceStationAI.Properties.PieceNum
 *       These "AI" props are hard to figure out meaning though. It's easier to read
 *       these sublevels files for now.
 */

const ItemMap = {
  'GIceBomb_C': ItemVariants.Bomb,
  'GBomb_C': ItemVariants.IceBomb,
};

/**
 * Finds root object components by DebugUniqueId
 * @param {*} compsList The entire JSON file for {Map}/Sublevels/{Map}_Objects.json
 * @param {*} debugUuids The entire list of DebugUniqueId's from {Map}/ActorPlacementInfo/{Map}_Objects.json
 * @returns 
 */
export function parseSublevelsObjects(compsList) {
  const rootComps = compsList.filter(comp => {
    return comp.Properties?.GenerateInfo?.DebugUniqueId != undefined
  });

  const componentPropsDict = {};
  for(const comp of rootComps) {
    let componentProps = {};

    if (isPikminSpawnerComp(comp)) {
      componentProps = parsePikminSpawnerComp(comp, compsList);
    }
    else if (isPieceStationComp(comp)) {
      componentProps = parsePieceStationComp(comp, compsList);
    }
    else if (isStructureComp(comp)) {
      componentProps = parseStructureComp(comp, compsList);
    }
    else if (comp.Properties.BurningAI) {
      componentProps = { type: ObjectTypes.Straw };
    }
    else if (comp.Properties.TanebiStationAI) {
      // TODO find out first lit one in Cave035_F01. Only one that doesn't have "Relay" in name?
      componentProps = { type: ObjectTypes.FirePit };
    }
    else if (comp.Properties.ZiplineAI) {
      // TODO ZiplineAI.Properties.ZiplineAIParameter.goalOffset?
      // Note: Spline not needed. Maps have the zipline route.
      componentProps = { type: ObjectTypes.Zipline };
    }
    else if (comp.Properties.CrackPotAI) {
      const crackPotComp = getObjectFromPath(comp.Properties.CrackPotAI, compsList);
      componentProps = {
        type: ObjectTypes.Pot,
        drops: parseObjectDropList(crackPotComp)
      };
    }
    else if (comp.Properties.CrushJellyAI) {
      const crushJellyComp = getObjectFromPath(comp.Properties.CrushJellyAI, compsList);
      componentProps = {
        type: ObjectTypes.HydroJelly,
        drops: parseObjectDropList(crushJellyComp)
      };
    }
    else if (comp.Properties.FenceFallAI) {
      // TODO: add Properties.FenceFallAIParameter.SwitchID
      componentProps = { type: ObjectTypes.Fence };
    }
    else if (comp.Properties.SingleSwitchAI) {
      // TODO: add Properties.SwitchBaseAIParameter.SwitchID
      componentProps = { type: ObjectTypes.Switch };
    }
    else if (isShortcutComp(comp)) {
      componentProps = parseShortcutComp(comp, compsList);
    }
    else if (comp.Properties.TateanaAI) {
      // TODO parse RebirthInterval?
      const moundAIComp = getObjectFromPath(comp.Properties.TateanaAI, compsList);
      componentProps = {
        type: ObjectTypes.Mound,
        // TODO: default drop is to spawn BABY teki (bulbor larva)
        drops: parseObjectDropList(moundAIComp, DefaultLarvaDrop)
      };
    }
    else if (comp.Properties.BombAI) {
      componentProps = {
        type: ObjectTypes.Item,
        variant: ItemMap[comp.Type]
      };
      // test for other item types
      componentProps.variant == undefined && console.error("Unknown item type!");
    }
    else if (isGateComp(comp)) {
      componentProps = parseGateComp(comp, compsList);
    }
    else if (isWaterComp(comp)) {
      componentProps = parseWaterComp(comp, compsList);
    }
    else {
      // skip over this useless comp
      continue;
    }

    if (comp.Properties.GenerateInfo.DebugUniqueId in componentPropsDict) {
      console.error("BAD.ID:", comp.Properties.GenerateInfo.DebugUniqueId, "-");
    }
    componentPropsDict[comp.Properties.GenerateInfo.DebugUniqueId] = componentProps;
  }

  return componentPropsDict;
}



/*
Objects to look at:
"Name": "ColdBoxAI"
"Name": "StickyFloorAI"
"Name": "BranchAI"
"Name": "GeyserAI"
"Name": "SprinklerAI" (location, maybe radius too?)
"Name": "RopeFishingAI" what is this??
"Name": "WarpCarryAI" tunnels?
"Name": "HappyDoorAI" pup tunnels!
"Name": "MizunukiAI" these are drains for water. They have a default "SwitchID" of "mizunuki"

"Name": "WasurenagusaAI" forget-me-nots? This is Lumiknolls
_00 = blue
_01 = orange/red
WasurenagusaMiniAI/NIGHTDECOY must be Trickknolls.

"Name": "ExcavationAI" might be important

"Name": "OnyonCarryAI",
"Name": "OtakaraAI",

EPikminColor::Mix
"PelletColor": "EPikminColor::Yellow"
*/