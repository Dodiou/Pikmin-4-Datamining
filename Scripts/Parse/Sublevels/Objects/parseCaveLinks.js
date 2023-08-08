// Madori = cave
// NOTE: search for "PortalBaseAI", since characters that transition to menus (e.g. Character Stylist) have portal triggers
// PortalTrigger.Properties.ToLevelName: string
//   SP in level name = challenge
//   VS in level name = battle
// PortalNumber?: number = ID for links
// ToPortalNumber?: number = exit hole if different (e.g. Aquiferous Summit)

// NOTE: you can do caves w/ multiple entrances in reverse order. interesting.
// ToBaseCampID?: number = ??? maybe initial base ID in the cave

// PankuzuPriority?: number = ??? breadcrumbs?
// CheckPointLevelNames?: string[] = ???
// bInitialPortalMove?: boolean = ???

// See GMadoriRuins3, GMadoriPoko3
// DisablePikminFlags?: number = what pikmin are dis/allowed. 17405 = only blues, 766 = only red
// bDisableIsFlareGuard?: boolean = ??? only on GMadoriRuins9

// bDeactivateByExit?: boolean = ??? only in caves

// Naming conventions:
// GMadori
//   Ruins = cave
//   Poko = challenge
//   Arena = battle
// GDownPortal = next subfloor
// GDungeonExit = exit cave
