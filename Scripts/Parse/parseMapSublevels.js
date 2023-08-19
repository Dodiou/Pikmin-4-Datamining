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
import { isTunnelComp, parseTunnelComp } from './Sublevels/Objects/parseTunnel.js';
import { isEggComp, parseEggComp } from './Sublevels/parseEgg.js';
import { isGroupDropManagerComp, parseGroupDropManagerComp } from './Sublevels/parseGroupDropManager.js';
import { isBreakObstacleComp, parseBreakObstacleComp } from './Sublevels/Objects/parseBreakObstacle.js';
import { isMiscComp, parseMiscComp } from './Sublevels/Objects/parseMisc.js';
import { isPlatformComp, parsePlatformComp } from './Sublevels/Objects/parsePlatforms.js';
import { isCreatureComp, parseCreatureComp } from './Sublevels/parseCreature.js';
import { isActorSpawnerComp, parseActorSpawnerComp } from './Sublevels/Creatures/parseActorSpawner.js';
import { assertDynamicallyBuiltMarkerType } from './util.js';

/**
 * Finds root object components by DebugUniqueId
 * @param {*} compsList The entire JSON file for {Map}/Sublevels/{Map}_Objects.json
 * @returns 
 */
function parseSublevelsComponents(compsList, propsFinderFunc) {
  const rootComps = compsList.filter(comp => {
    return comp.Properties?.GenerateInfo?.DebugUniqueId != undefined
  });

  const componentPropsDict = {};
  for(const comp of rootComps) {
    let componentProps = propsFinderFunc(comp);

    if (!componentProps) {
      // skip over this useless comp
      continue;
    }

    // some assertions to make sure I didn't mess up parsing types
    if (
      componentProps.type === undefined ||
      componentProps.infoType === undefined ||
      !componentProps.type.startsWith(componentProps.infoType)
    ) {
      throw new Error(`Programmer error in parsing code. type: ${componentProps.type}, infoType: ${componentProps.infoType}`);
    }
    assertDynamicallyBuiltMarkerType(componentProps.type);

    componentPropsDict[comp.Properties.GenerateInfo.DebugUniqueId] = componentProps;
  }

  return componentPropsDict;
}

/*
 * Note: Some props seem to have redundancy in the "ActorPlacementInfo" JSON and the
 *       "Sublevels" JSON.
 *       E.g., AI.Static[0] = NoraSpawnerAI.NoraSpawnerAIParam.SpawnNum
 *             AI.Static[12] = NoraSpawnerAI.NoraSpawnerAIParam.PikminColor (converted from enum to int)
 *             AI.Dynamic[36] = PieceStationAI.Properties.PieceNum
 *       These "AI" props are hard to figure out meaning though. It's easier to read
 *       these sublevels files for now.
 */

/**
 * Parse object components by finding them in the objComps list. Pushes interesting objects, their props, and their
 * DebugUniqueId's to the returned Map object.
 * @param {*} objComps The entire JSON file for {Map}/Sublevels/{Map}_Objects.json
 * @returns 
 */
export function parseSublevelsObjects(objComps) {
  return parseSublevelsComponents(objComps, (comp) => {
    if (isPikminSpawnerComp(comp)) {
      return parsePikminSpawnerComp(comp, objComps);
    }
    else if (isCollectableComp(comp)) {
      return parseCollectableComp(comp, objComps);
    }
    else if (isPieceStationComp(comp)) {
      return parsePieceStationComp(comp, objComps);
    }
    else if (isStructureComp(comp)) {
      return parseStructureComp(comp, objComps);
    }
    else if (isHeatObstacleComp(comp)) {
      return parseHeatObstacleComp(comp, objComps);
    }
    else if (isFloorComp(comp)) {
      return parseFloorComp(comp, objComps);
    }
    else if (isBreakObstacleComp(comp)) {
      return parseBreakObstacleComp(comp, objComps);
    }
    else if (isCaveLinkComp(comp)) {
      return parseCaveLinkComp(comp, objComps);
    }
    else if (isSpoutComp(comp)) {
      return parseSpoutComp(comp);
    }
    else if (isSwitchableComp(comp)) {
      return parseSwitchableComp(comp, objComps);
    }
    else if (isShortcutComp(comp)) {
      return parseShortcutComp(comp, objComps);
    }
    else if (isPlatformComp(comp)) {
      return parsePlatformComp(comp);
    }
    else if (isMoundComp(comp)) {
      return parseMoundComp(comp, objComps);
    }
    else if (isDrainComp(comp)) {
      return parseDrainComponent(comp, objComps);
    }
    else if (isFishingComp(comp)) {
      return parseFishingComp(comp, objComps);
    }
    else if (isGroundItemComp(comp)) {
      return parseGroundItemComp(comp);
    }
    else if (isGateComp(comp)) {
      return parseGateComp(comp, objComps);
    }
    else if (isTunnelComp(comp)) {
      return parseTunnelComp(comp, objComps);
    }
    else if (isWaterComp(comp)) {
      return parseWaterComp(comp, objComps);
    }
    else if (isBaseComp(comp)) {
      return parseBaseComp(comp, objComps);
    }
    else if (isMiscComp(comp)) {
      return parseMiscComp(comp, objComps);
    }
    else if (isGroupDropManagerComp(comp)) {
      return parseGroupDropManagerComp(comp, objComps);
    }
    else if (isEggComp(comp)) {
      return parseEggComp(comp, objComps);
    }
    // skip over this useless comp
    return undefined;
  });
}


/**
 * Parse teki components by finding them in the tekiComps list. Pushes interesting objects, their props, and their
 * DebugUniqueId's to the returned Map object.
 * @param {*} tekiComps The entire JSON file for {Map}/Sublevels/{Map}_Teki.json
 * @returns 
 */
export function parseSublevelsTekis(tekiComps) {
  return parseSublevelsComponents(tekiComps, (comp) => {
    if (isGroupDropManagerComp(comp)) {
      return parseGroupDropManagerComp(comp, tekiComps);
    }
    else if (isEggComp(comp)) {
      return parseEggComp(comp, tekiComps);
    }
    else if (isActorSpawnerComp(comp)) {
      return parseActorSpawnerComp(comp, tekiComps);
    }
    else if (isCreatureComp(comp)) {
      return parseCreatureComp(comp, tekiComps);
    }
    // skip over this component. Unknown what it is.
    return undefined;
  });
}


/*
Objects to look at:
BookendAI
TsuyukusaAI? spicy berries?

// Night objects
"Name": "WasurenagusaAI" forget-me-nots? This is Lumiknolls
_00 = blue
_01 = orange/red
WasurenagusaMiniAI/NIGHTDECOY must be Tricknolls.

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
PelplantAI // cannot parse in this file. These don't have DebugUniqueIds to link to positions

EPikminColor::Mix? None?
*/