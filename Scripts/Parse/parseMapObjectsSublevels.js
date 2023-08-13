import { isStructureComp, parseStructureComp } from './Sublevels/Objects/parseStructure.js';
import { isWaterComp, parseWaterComp } from './Sublevels/Objects/parseWater.js';
import { isPikminSpawnerComp, parsePikminSpawnerComp } from './Sublevels/Objects/parsePikmin.js';
import { isPieceStationComp, parsePieceStationComp } from './Sublevels/Objects/parsePieceStation.js';
import { isGateComp, parseGateComp } from './Sublevels/Objects/parseGate.js';
import { isShortcutComp, parseShortcutComp } from './Sublevels/Objects/parseShortcut.js';
import { isDrainComp, isFishingComp, isMoundComp, parseDrainComponent, parseFishingComp, parseMoundComp } from './Sublevels/Objects/parseGroundWork.js';
import { isSwitchableComp, parseSwitchableComp } from './Sublevels/Objects/parseSwitchables.js';
import { isSpoutComp, parseSpoutComp } from './Sublevels/Objects/parseSpoutObstacles.js';
import { isGroundItemComp, parseGroundItemComp } from './Sublevels/Objects/parseGroundItem.js';
import { isHeatObstacleComp, parseHeatObstacleComp } from './Sublevels/Objects/parseHeatObstacle.js';
import { isBaseComp, parseBaseComp } from './Sublevels/Objects/parseBase.js';
import { isCaveLinkComp, parseCaveLinkComp } from './Sublevels/Objects/parseCaveLinks.js';
import { isCollectableComp, parseCollectableComp } from './Sublevels/Objects/parseCollectable.js';
import { isFloorComp, parseFloorComp } from './Sublevels/Objects/parseFloorObstacle.js';
import { isEggComp, parseEggComp } from './Sublevels/parseEgg.js';
import { isGroupDropManagerComp, parseGroupDropManagerComp } from './Sublevels/parseGroupDropManager.js';
import { isBreakObstacleComp, parseBreakObstacleComp } from './Sublevels/Objects/parseBreakObstacle.js';
import { isMiscComp, parseMiscComp } from './Sublevels/Objects/parseMisc.js';

/* 
 * Note: Some props seem to have redundancy in the "ActorPlacementInfo" JSON and the
 *       "Sublevels" JSON.
 *       E.g., AI.Static[0] = NoraSpawnerAI.NoraSpawnerAIParam.NumSpawn
 *             AI.Static[12] = NoraSpawnerAI.NoraSpawnerAIParam.PikminColor (converted from enum to int)
 *             AI.Dynamic[36] = PieceStationAI.Properties.PieceNum
 *       These "AI" props are hard to figure out meaning though. It's easier to read
 *       these sublevels files for now.
 */

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
    else if (isCollectableComp(comp)) {
      componentProps = parseCollectableComp(comp, compsList);
    }
    else if (isPieceStationComp(comp)) {
      componentProps = parsePieceStationComp(comp, compsList);
    }
    else if (isStructureComp(comp)) {
      componentProps = parseStructureComp(comp, compsList);
    }
    else if (isHeatObstacleComp(comp)) {
      componentProps = parseHeatObstacleComp(comp, compsList);
    }
    else if (isFloorComp(comp)) {
      componentProps = parseFloorComp(comp, compsList);
    }
    else if (isBreakObstacleComp(comp)) {
      componentProps = parseBreakObstacleComp(comp, compsList);
    }
    else if (isCaveLinkComp(comp)) {
      componentProps = parseCaveLinkComp(comp, compsList);
    }
    else if (isSpoutComp(comp)) {
      componentProps = parseSpoutComp(comp);
    }
    else if (isSwitchableComp(comp)) {
      componentProps = parseSwitchableComp(comp, compsList);
    }
    else if (isShortcutComp(comp)) {
      componentProps = parseShortcutComp(comp, compsList);
    }
    else if (isMoundComp(comp)) {
      componentProps = parseMoundComp(comp, compsList);
    }
    else if (isDrainComp(comp)) {
      componentProps = parseDrainComponent(comp, compsList);
    }
    else if (isFishingComp(comp)) {
      componentProps = parseFishingComp(comp, compsList);
    }
    else if (isGroundItemComp(comp)) {
      componentProps = parseGroundItemComp(comp);
    }
    else if (isGateComp(comp)) {
      componentProps = parseGateComp(comp, compsList);
    }
    else if (isWaterComp(comp)) {
      componentProps = parseWaterComp(comp, compsList);
    }
    else if (isBaseComp(comp)) {
      componentProps = parseBaseComp(comp, compsList);
    }
    else if (isMiscComp(comp)) {
      componentProps = parseMiscComp(comp, compsList);
    }
    else if (isGroupDropManagerComp(comp)) {
      componentProps = parseGroupDropManagerComp(comp, compsList);
    }
    else if (isEggComp(comp)) {
      componentProps = parseEggComp(comp, compsList);
    }
    else {
      // skip over this useless comp
      continue;
    }

    if (componentProps.type === undefined) {
      throw new Error('Programmer error in parsing code. Sorry!');
    }
    componentPropsDict[comp.Properties.GenerateInfo.DebugUniqueId] = componentProps;
  }

  return componentPropsDict;
}



/*
Objects to look at:
TrampolineAI
OoAshibaKinokoAI // charge mushroom
BookendAI
TsuyukusaAI? spicy berries?
"Name": "CharcoalAI" these things extinguish FireFloorAI
IcicleAI

// Night objects
"Name": "WasurenagusaAI" forget-me-nots? This is Lumiknolls
_00 = blue
_01 = orange/red
WasurenagusaMiniAI/NIGHTDECOY must be Trickknolls.

//Nearest object modifiers
"Name": "ExcavationAI" buried object
"Name": "RopeBranchAI" hanging object
"Name": "RopeFishingAI"
"CrushJellyAIParameter.SearchCIDList"
"AreaBaseCampParameter.CIDList"
"AreaBaseCampParameter.BaseCampID"


// unimportant
"HikariKinoko" glow mushroom. not important
TriggerColdAI? causes pikmin to shiver
ShakeObjectAI? unknown
OjamaBlockAI? Rock blocking CfaK/Rescue Command expansion sites?
CushionAI? probably just for pikmin "playing" triggers

// enemy-like
PelplantAI // cannot parse. These don't have DebugUniqueIds to link to positions

EPikminColor::Mix? None?
*/