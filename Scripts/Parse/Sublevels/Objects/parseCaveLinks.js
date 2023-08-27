import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath, removeUndefineds } from "../../util.js";

// Madori = cave
// PortalTrigger.Properties.ToLevelName: string
//   SP in level name = challenge
//   VS in level name = battle
// PortalNumber?: number = ID for links
// ToPortalNumber?: number = exit hole if different (e.g. exiting Aquiferous Summit)

// NOTE: you can do caves w/ multiple entrances in reverse order. This is what base camp will be loaded.
// ToBaseCampID?: number = initial base ID in the cave

// PankuzuPriority?: number = ??? breadcrumbs?
// CheckPointLevelNames?: string[] = ???
// bInitialPortalMove?: boolean = ???

// bDisableIsFlareGuard?: boolean = ??? only on GMadoriRuins9. Might be "enable fire around cave".

// bDeactivateByExit?: boolean = ??? only in caves

// Naming conventions:
// GMadori
//   Ruins = cave
//   MadoriRuinsForExit = cave 2nd exit
//   Poko = challenge
//   Arena = battle
// GDownPortal = next subfloor
// GDungeonExit = exit cave
const MarkerTypeMap = {
  'GMadoriRuins_C': MarkerType.CaveEntrance,
  'GMadoriRuinsForExit_C': MarkerType.CaveEntrance,
  'GMadoriPoko_C': MarkerType.CaveChallenge,
  'GMadoriArena_C': MarkerType.CaveBattle,
  'GDungeonExit_C': MarkerType.CaveExit,
  'GDownPortal_C': MarkerType.CaveEntrance,
}

// See GMadoriRuins3, GMadoriRuins9, GMadoriPoko3
// DisablePikminFlags?: number = what pikmin are dis/allowed. 17405 & 1021 = only blues, 766 = only red, 17149
const PikminColorFlags = {
  red: 0b0000_0001,
  blue: 0b0000_0010,
  // NOTE: The following are not used anywhere, but are just a best guess based on what the enum values map to
  //       See 'Parsing Notes/PikminObjectNotes' for enum values
  yellow: 0b0000_0100,
  rock: 0b0000_1000,
  wing: 0b0001_0000,
  purple: 0b0010_0000,
  white: 0b0100_0000,
  ice: 0b1000_0000,
  // There might be more... Some disable flags exceed 8-bits in length. E.g. 17405 and 17149
}

// NOTE: search for "PortalBaseAI", since characters that transition to menus (e.g. Character Stylist) have portal triggers
//       Then use PortalTrigger
export function isCaveLinkComp(comp) {
  return !!(comp.Properties.PortalBaseAI && comp.Properties.PortalTrigger);
}

export function parseCaveLinkComp(comp, compsList) {
  const PortalTrigger = getObjectFromPath(comp.Properties.PortalTrigger, compsList);

  const disabledPikmin = {};
  Object.entries(PikminColorFlags).forEach(([color, flag]) => {
    const disabledPikminFlags = PortalTrigger.Properties?.DisablePikminFlags || 0;
    if ((disabledPikminFlags & flag) !== 0) {
      disabledPikmin[color] = true;
    }
  });

  const type = MarkerTypeMap[comp.Type];
  // Battles and Challenges are unlocked in order, and not at specific caves. Set those links to undefined.
  const toMapId = (type === MarkerType.CaveEntrance || type === MarkerType.CaveExit)
    ? PortalTrigger.Properties?.ToLevelName
    : undefined;

  return removeUndefineds({
    type,
    infoType: InfoType.Cave,
    portalId: PortalTrigger.Properties?.PortalNumber,
    toMapId,
    toPortalId: PortalTrigger.Properties?.ToPortalNumber,
    toBaseId: PortalTrigger.Properties?.ToBaseCampId,
    disabledPikmin,
  });

}
