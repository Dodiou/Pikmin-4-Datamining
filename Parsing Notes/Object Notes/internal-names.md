GPodCamp_C: base-beagle or base-onion\
G(Sticky|Poison)?(Kom|M)ush(Poison)?(L|S)?_C = different types of mushrooms\
GCrackPot(L|S)_C = breakable-pot\
GCrushJelly(\w+)_C = breakable-hydrojelly

GMadoriRuins_C: cave-entrance\
GMadoriRuinsForExit_C: cave-entrance (the second entrance for caves with multiple entrances)\
GMadoriPoko_C: cave-challenge\
GMadoriArena_C: cave-battle\
GDungeonExit_C: cave-exit\
GDownPortal_C: cave-entrance (inside caves)

GOnyonCarryBoost_C: onion-flarlic\
GOnyonBootUpRed_C: onion-red\
GOnyonCarryWhite_C: onion-white\
GOnyonCarryPurple_C: onion-purple\
GOnyonCarryYellow_C: onion-yellow\
GOnyonCarryBlue_C: onion-blue\
GOnyonCarryIce_C: onion-ice\
GOnyonCarryStone_C: onion-rock\
GOnyonCarryPink_C: onion-pink

GSurvivor: castaway-normal\
GSurvivorA_C: castaway-normal\
GSurvivorLeaf: castaway-leafling\
GSurvivorLouie_C: castaway-normal\
GSurvivorOlimarLeaf: castaway-leafling (Olimar)\
GSurvivorKoppai: castaway-normal (Koppaite)

GMoveFloor_C: ridable-movefloor\
GStickyFloor(\d+)uu_C: hazardradial-floormushroom\
GFireFloor(\d+)uu_C: hazardradial-floorfire\
GSprinkler_C: hazardradial-sprinkler

GGateRock(\d+)uu_C: gate-crystal\
GVarGateDenki...: gate-electric\
GVarGateSoft...: gate-dirt\
GVarGateIce...: gate-ice\
GVarGateBomb...: gate-bomb\
GVarGateTrigger...: gate-numbered

GIceBomb_C: miscitem-icebomb\
GBomb_C: miscitem-bomb

GTateana_C: breakable-mound\
GRopeFishing_C: misc-pullrope\
GMizunuki_C: switchable-drain\
GMizunukiIndoor_C: switchable-drain

GBurning_C: breakable-straw\
GTanebiStation_C: firepit-lit (Note: rarely unlit)\
GTanebiStationRelay_C: firepit-unlit (never lit)\
GColdBox_C: breakable-icebox

GCharcoal_C: hazardmisc-charcoal\
GIcicle_C: misc-icicle\
GPellet_C: misc-pellet\
GHoney_C: miscitem-honey\
GTsuyukusa_C: misc-spiderwort\
GIwakkoCrystal_C: breakable-crystal (skutterchuck crystals)

GKinkaiStation_C: treasure (KINKAISTATION | gold nuggets)\
GHikariStation_C: pile-glowpellets\
GBridgeStation_C: pile-materials

GNoraSpawnerPikminLock_C: pikmin-* (idle, fighting, playing, etc.)\
GNoraSpawnerHeadLock_C: pimin-* (planted)\
GNoraSpawnerPongashiLock_C: candypop-*\
GNoraSpawnerPrologue_C: not parsed. Prologue-only

GTrampoline_C: platform-trampoline\
GOoAshibaKinoko_C: platform-charge (Oatchi charge mushrooms)

GHandleBoard_C: shortcut-clipboardlow | shortcut-clipboardhigh\
GDownFloor_C: shortcut-squashbag\
GString_C: shortcut-string\
GPullNekko_C: shortcut-root (pull roots)\
GBranch_C: misc-stick\
GGeyser_C: ridable-geyser\
GZipline_C: ridable-zipline

GXBox_C: shortcut-pushbag (does not fall | cardboard)\
GXBoxCan_C: shortcut-pushbag (does not fall | metal)\
GYBox_C: shortcut-pushbag (falls | cardboard)\
GYBoxAnother_C: shortcut-pushbag (falls | cardboard)\
GYBoxSmall_C: shortcut-pushbag (falls | cardboard)\
GYBoxSmallAnother_C: shortcut-pushbag (falls | cardboard)\
GYBoxCube_C: shortcut-pushbag (falls | cardboard)\
GYBoxCubeCan_C: shortcut-pushbag (falls | metal)

GHibaIce_C: hazardspout-ice\
GHibaWater_C: hazardspout-water\
GHibaPoison_C: hazardspout-poison\
GHibaBubble_C: hazardspout-bubble\
GHibaDenki_C: hazardspout-electric\
GHiba_C: hazardspout-fire\
GKonro_C: hazardspout-fire (stove entrance flames to Frozen Inferno)

GBridgeFlexible_C: structure-bridge\
GBridgeFlexibleCave_C: structure-bridge\
GWallFlexible_C: structure-wall\
GWallFlexibleCave_C: structure-wall\
GValveOnce_C: structure-valve\
GValveVariable_C: structure-valve\
GSlope(\w*)_C: structure-slope

GCirculator_C: switchable-fan\
GCirculatorLean_C: switchable-fan\
GCirculatorLeanForWorkingOnlyDay_C: switchable-fan\
GCirculatorLeanForHeroArea010_C: switchable-fan\
GCirculatorLeanPurple_C: switchable-fan\
GCirculatorRed_C: switchable-fan

GFence_C: switchable-fencenormal\
GFenceNoSideCol_C: switchable-fencenormal\
GFenceNoSideColNoSE_C: switchable-fencenormal\
GFenceFall_C: switchable-fenceiron (these are the only ones that can be lowered w/ swtiches)

GConveyor265uu_C: switchable-conveyor

G(TriggerDoor)?Switch(Off|Red|Blue|Green)_C: switchable-singleswitch\
G(TriggerDoor)?SwitchOnOff(Red|Blue|Green)?_C: switchable-doubleswitch

GTunnel_C: tunnel-captain\
GWarpCarryFloor_C: tunnel-any\
GWarpCarryFloorCave_C: tunnel-any\
GWarpCarryWall_C: tunnel-any\
GWarpCarryWallCave_C: tunnel-any\
GHappyDoor_C: tunnel-oatchi

GSwampBox_C: water-swamp\
GSwampBoxDark_C: water-swamp\
GWaterBox_C: water-water\
GWaterBoxDeep_C: water-water\
GWaterBoxReduction_C: water-water\
GWaterBoxFluctuation_C: water-water\
GWaterBoxFluctuationDeep_C: water-water\
GWaterBoxCircle_C: water-water

GHotExtract_C: miscitem-spicy\
GEgg_C: breakable-egg\
GGroupDropManager_C: misc-groupdropmanager

GWasurenagusa_C: lumiknoll (not parsed)\
GWasurenagusaMini_C: tricknoll (not parsed)

GOta...: treasure\
G\<creatureId>_C: creature
