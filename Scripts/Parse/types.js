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

// Categories
// const Collectable = {
//   CollectableTreasure,
//   CollectableCastaway,
//   CollectableCreature,
//   CollectableOnionRed,
//   CollectableOnionYellow,
//   CollectableOnionBlue,
//   CollectableOnion,
//   CollectableOnionRed,
//   CollectableOnionRed,
// }

// const GateType = {
//   GateBomb,
//   GateCrystal,
//   GateDirt,
//   GateElectric,
//   GateIce,
//   GateNumbered,
//   GateSquashbag
// }

// const ShortcutType = {
//   ShortcutClipboardHigh,
//   ShortcutClipboardShort,
//   ShortcutGeyser,
//   ShortcutPushbag,
//   ShortcutRoot,
//   ShortcutString,
//   ShortcutZipline
// }

// const AccessType = {
//   AccessPlatformBounce,
//   AccessPlatformCharge,
//   AccessPlatformMove,
//   AccessTunnelAny,
//   AccessTunnelCaptain,
//   AccessTunnelOatchi
// }

// const HazardType = {
//   HazardFloorFire,
//   HazardFloorCharcoal,
//   HazardFloorMushroom,
//   HazardSpoutFire,
//   HazardSpoutWater,
//   HazardSpoutIce,
//   HazardSpoutElectric,
//   HazardSpoutBubble,
//   HazardSpoutPoison
// }

// const SwitchType = {
//   SwitchConveyor,
//   SwitchFan,
//   SwitchFenceIron,
//   SwitchFenceNormal,
//   SwitchSingle,
//   SwitchDouble,
// }

// const LocationType = {
//   BaseOnion,
//   BaseBeagle,
//   CaveEntrance,
//   CaveExit,
//   CaveChallenge,
//   CaveBattle
// }

// const StructureType = {
//   Materials,
//   StructureBridge,
//   StructureSlope,
//   StructureValve,
//   StructureWall,
//   Sprinkler
// }

// const BreakableType = {
//   Crystal,
//   Hydrojelly,
//   Icebox,
//   Pot,
//   Straw,
//   MushroomLarge,
//   MushroomSmall
// }

// const WorkType = {
//   WorkMound,
//   WorkPullrope,
//   WorkStick,
// }

// const MiscType = {
//   MiscIcicle,
//   MiscHoney,
//   MiscPellet,
//   MiscEgg,
//   MiscBomb,
//   MiscIcebomb,
//   MiscSpiderwort
// }

// const WaterType = {
//   WaterWater,
//   WaterSwamp,
//   WaterDrain,
// }

// const NightType = {
//   NightLumiknoll,
//   NightTricknoll,
//   NightGlowpellets
// }
