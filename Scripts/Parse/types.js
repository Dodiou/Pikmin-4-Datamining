export const ObjectTypes = {
  Base: 'base',
  Berry: 'berry',
  Candypop: 'candypop',
  Castaway: 'castaway',
  CaveLink: 'caveLink',
  Charcoal: 'charcoal',
  Conveyor: 'conveyor',
  Creature: 'creature',
  Crystal: 'crystal',
  Drain: 'drain',
  Egg: 'egg',
  Fan: 'fan',
  Fence: 'fence',
  FirePit: 'firePit',
  FloorObstacle: 'floor',
  Gate: 'gate',
  GlowPellets: 'glowPellets',
  GroupDropManager: 'groupDropManager',
  HeatObstacle: 'heatObstacle',
  Honey: 'honey',
  HydroJelly: 'hydroJelly',
  Icicle: 'icicle',
  Item: 'item',
  Materials: 'materials',
  Mound: 'mound',
  Mushroom: 'mushroom',
  Onion: 'onion',
  Pellet: 'pellet',
  Pikmin: 'pikmin',
  Pot: 'pot',
  RopeFishing: 'ropeFishing',
  Shortcut: 'shortcut',
  Spout: 'spout',
  Sprinkler: 'sprinkler',
  Straw: 'straw',
  Structure: 'structure',
  Switch: 'switch',
  Treasure: 'treasure',
  Tunnel: 'tunnel',
  Water: 'water',
  Unknown: '__unknown'
}

export const RebirthTypes = {
  NoRebirth: 'ERebirthType::NoRebirth',
  AlwaysRebirth: 'ERebirthType::AlwaysRebirth',
  RebirthFullExplore: 'ERebirthType::RebirthFullExplore', // rebirth until cave is fully explored
  RebirthLater: 'ERebirthType::RebirthLater',
}

export const BaseVariants = {
  Onion: 'onion',
  Beagle: 'beagle'
}

export const ItemVariants = {
  Bomb: 'bomb',
  IceBomb: 'iceBomb'
  // Don't think any other items appear anywhere
}

export const HeatObstacleVariants = {
  IceBox: 'iceBox',
  Straw: 'straw'
}

export const FloorObstacleVariants = {
  Mushroom: 'mushroom',
  Fire: 'fire',
  Movable: 'movable'
}

export const GateVariants = {
  Bomb: 'bomb',
  Crystal: 'crystal',
  Dirt: 'dirt',
  Electric: 'electric',
  Ice: 'ice',
  Numbered: 'numbered',
}

export const PikminVariants = {
  Fighting: 'fighting',
  Idle: 'idle',
  Sprouts: 'sprouts'
}

export const StructureVariants = {
  Bridge: 'bridge',
  Slope: 'slope',
  Valve: 'valve',
  Wall: 'wall',
}

export const WaterVariants = {
  Water: 'water',
  Swamp: 'swamp',
}

export const ShortcutVariants = {
  BounceShroom: 'bounceShroom',
  ClipboardAny: 'clipboard',
  ClipboardYellow: 'clipboardYellow',
  ChargeShroom: 'chargeShroom',
  Geyser: 'geyser',
  PushBag: 'pushbag',
  Root: 'root',
  SquashBag: 'squashbag',
  Stick: 'stick',
  String: 'string',
  Zipline: 'zipline'
}

export const SpoutVariants = {
  Bubble: 'bubble',
  Electric: 'electric',
  Fire: 'fire',
  Ice: 'ice',
  Poison: 'poison',
  Water: 'water'
}

export const SwitchVariants = {
  DoubleSwitch: 'double',
  SingleSwitch: 'single',
}

export const TunnelVariants = {
  Captain: 'captain',
  Normal: 'normal',
  Oatchi: 'pup'
}

export const FenceVariant = {
  Iron: 'iron',
  Normal: 'normal'
}

export const CaveLinkVariants = {
  Battle: 'battle',
  Cave: 'cave',
  Challenge: 'challenge',
  Exit: 'exit'
}

export const PikminColor = {
  Red: 'red',
  Yellow: 'yellow',
  Blue: 'blue',
  Purple: 'purple',
  White: 'white',
  Rock: 'rock',
  Wing: 'wing',
  Ice: 'ice',
  Glow: 'glow',
}

export const PikminColorEnumMap = {
  "EPikminColor::Red": PikminColor.Red,
  "EPikminColor::Yellow": PikminColor.Yellow,
  "EPikminColor::Blue": PikminColor.Blue,
  "EPikminColor::Purple": PikminColor.Purple,
  "EPikminColor::White": PikminColor.White,
  "EPikminColor::Rock": PikminColor.Rock,
  "EPikminColor::Wing": PikminColor.Wing,
  "EPikminColor::Ice": PikminColor.Ice,
  "EPikminColor::Photon": PikminColor.Glow,
  "EPikminColor::Undef": PikminColor.Red,
  "EPikminColor::None": PikminColor.Red,
}


export const MarkerType = {
  // collectibles
  Treasure: 'treasure',
  CastawayNormal: 'castaway-normal',
  CastawayLeafling: 'castaway-leafling',
  Creature: 'creature',
  OnionFlarlic: 'onion-flarlic',
  OnionRed: 'onion-red',
  OnionYellow: 'onion-yellow',
  OnionBlue: 'onion-blue',
  OnionPurple: 'onion-purple',
  OnionWhite: 'onion-white',
  OnionRock: 'onion-rock',
  OnionWing: 'onion-wing',
  OnionIce: 'onion-ice',
  // pikmin
  PikminRed: 'pikmin-red',
  PikminYellow: 'pikmin-yellow',
  PikminBlue: 'pikmin-blue',
  PikminPurple: 'pikmin-purple',
  PikminWhite: 'pikmin-white',
  PikminRock: 'pikmin-rock',
  PikminWing: 'pikmin-wing',
  PikminIce: 'pikmin-ice',
  CandypopRed: 'candypop-red',
  CandypopYellow: 'candypop-yellow',
  CandypopBlue: 'candypop-blue',
  CandypopPurple: 'candypop-purple',
  CandypopWhite: 'candypop-white',
  CandypopRock: 'candypop-rock',
  CandypopWing: 'candypop-wing',
  CandypopIce: 'candypop-ice',
  // structures
  PileMaterials: 'pile-materials',
  StructureBridge: 'structure-bridge',
  StructureSlope: 'structure-slope',
  StructureValve: 'structure-valve',
  StructureWall: 'structure-wall',
  HazardSprinkler: 'hazardradial-sprinkler',
  // breakables
  BreakableHydrojelly: 'breakable-hydrojelly',
  BreakablePot: 'breakable-pot',
  MushroomLarge: 'mushroom-large',
  MushroomSmall: 'mushroom-small',
  BreakableStraw: 'breakable-straw',
  BreakableIcebox: 'breakable-icebox',
  FirepitLit: 'firepit-lit',
  FirepitUnlit: 'firepit-unlit',
  BreakableCrystal: 'breakable-crystal',
  // items
  WorkableMound: 'breakable-mound',
  MiscEgg: 'misc-egg',
  MiscBomb: 'miscitem-bomb',
  MiscIcebomb: 'miscitem-icebomb',
  MiscSpicy: 'miscitem-spicy', // not an actual map marker, but is a drop marker
  MiscSpiderwort: 'misc-spiderwort',
  // hazards
  HazardSpoutFire: 'hazardspout-fire',
  HazardSpoutElectric: 'hazardspout-electric',
  HazardSpoutWater: 'hazardspout-water',
  HazardSpoutPoison: 'hazardspout-poison',
  HazardSpoutIce: 'hazardspout-ice',
  HazardSpoutBubble: 'hazardspout-bubble',
  HazardFloorfire: 'hazardradial-floorfire',
  HazardCharcoal: 'hazardmisc-charcoal',
  HazardFloormushroom: 'hazardradial-floormushroom',
  // shortcuts
  ShortcutClipboardhigh: 'shortcut-clipboardhigh',
  ShortcutClipboardlow: 'shortcut-clipboardlow',
  ShortcutPushbag: 'shortcut-pushbag',
  ShortcutRoot: 'shortcut-root',
  ShortcutString: 'shortcut-string',
  RidableGeyser: 'ridable-geyser',
  RidableZipline: 'ridable-zipline',
  TunnelAny: 'tunnel-any',
  TunnelCaptain: 'tunnel-captain',
  TunnelOatchi: 'tunnel-oatchi',
  PlatformBounce: 'platform-bounceshroom',
  PlatformCharge: 'platform-chargeshroom',
  RidableMovefloor: 'ridable-movefloor',
  // gates
  GateBomb: 'gate-bomb',
  GateCrystal: 'gate-crystal',
  GateDirt: 'gate-dirt',
  GateElectric: 'gate-electric',
  GateIce: 'gate-ice',
  GateNumbered: 'gate-numbered',
  GateSquashbag: 'gate-squashbag',
  // switchables
  SwitchConveyor: 'switchable-conveyor',
  SwitchFan: 'switchable-fan',
  SwitchFenceIron: 'switchable-fenceiron',
  SwitchFenceNormal: 'switchable-fencenormal',
  SwitchSingle: 'switchable-singleswitch',
  SwitchDouble: 'switchable-doubleswitch',
  // locations
  BaseOnion: 'base-beagle',
  BaseBeagle: 'base-onion',
  CaveEntrance: 'cave-entrance',
  CaveExit: 'cave-exit',
  CaveChallenge: 'cave-challenge',
  CaveBattle: 'cave-battle',
  // water
  WaterWater: 'water-water',
  WaterSwamp: 'water-swamp',
  SwitchDrain: 'switchable-drain',
  // misc
  MiscPullrope: 'misc-pullrope',
  MiscStick: 'misc-stick',
  MiscIcicle: 'misc-icicle',
  MiscHoney: 'miscitem-honey',
  MiscPellet: 'misc-pellet',
  // night
  NightLumiknoll: 'night-lumiknoll',
  NightTricknoll: 'night-tricknoll',
  NightGlowpellets: 'pile-glowpellets',
}

export const InfoType = {
  Treasure: 'treasure',
  Castaway: 'castaway',
  Onion: 'onion',
  Pikmin: 'pikmin',
  Candypop: 'candypop',
  Structure: 'structure',
  Pile: 'pile',
  Breakable: 'breakable',
  Mushroom: 'mushroom',
  Firepit: 'firepit',
  Hazard: 'hazard',
  Shortcut: 'shortcut',
  Ridable: 'ridable',
  Platform: 'platform',
  Tunnel: 'tunnel',
  Gate: 'gate',
  Switchable: 'switchable',
  Base: 'base',
  Cave: 'cave',
  Water: 'water',
  Misc: 'misc',
  Night: 'night',
}
