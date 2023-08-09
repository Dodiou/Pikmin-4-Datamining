// Madori = cave
// NOTE: search for "PortalBaseAI", since characters that transition to menus (e.g. Character Stylist) have portal triggers
//       Then use PortalTrigger
// PortalTrigger.Properties.ToLevelName: string
//   SP in level name = challenge
//   VS in level name = battle
// PortalNumber?: number = ID for links
// ToPortalNumber?: number = exit hole if different (e.g. Aquiferous Summit)

import { MapLinkVariants } from "../../types";

// NOTE: you can do caves w/ multiple entrances in reverse order. interesting.
// ToBaseCampID?: number = ??? maybe initial base ID in the cave

// PankuzuPriority?: number = ??? breadcrumbs?
// CheckPointLevelNames?: string[] = ???
// bInitialPortalMove?: boolean = ???

// See GMadoriRuins3, GMadoriPoko3
// DisablePikminFlags?: number = what pikmin are dis/allowed. 17405 & 1021 = only blues, 766 = only red
// bDisableIsFlareGuard?: boolean = ??? only on GMadoriRuins9

// bDeactivateByExit?: boolean = ??? only in caves

// Naming conventions:
// GMadori
//   Ruins = cave
//   Poko = challenge
//   Arena = battle
// GDownPortal = next subfloor
// GDungeonExit = exit cave

const VariantMap = {
  'GMadoriRuins_C': MapLinkVariants.Cave,
  'GMadoriPoko_C': MapLinkVariants.Challenge,
  'GMadoriArena_C': MapLinkVariants.Battle,
  'GDungeonExit_C': MapLinkVariants.Exit,
  'GDownPortal_C': MapLinkVariants.Cave,
}
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

export function isCaveLinkComp(comp) {
  return !!(comp.Properties.PortalBaseAI && comp.Properties.PortalTrigger);
}

export function parseCaveLinkComp(comp) {
  const PortalTrigger = comp.Properties.PortalTrigger;

  const disabledPikmin = {};
  Object.entries(PikminColorFlags).forEach(([color, flag]) => {
    if (comp.Properties.DisablePikminFlags & flag !== 0) {
      disabledPikmin[color] = true;
    }
  });
}
