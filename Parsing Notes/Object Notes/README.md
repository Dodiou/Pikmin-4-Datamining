# Work Object Params

`PieceStationAI` = pile
`BuildWallFlexibleAI` = climbing wall

## From Sublevels File

Type of 

KinkaiStation = GoldNuggets

BridgeStation = Materials

### BuildWallFlexibleAI

Climbable walls material count needed is based on two parameters. In game, walls rows built 4 panels across. Each panel takes `PiecePerPanel` to build (default is 2). I.e. mats per row equals `PiecePerPanel * 4`.

The `NeedColumnNum` property is the amount of rows the wall has. `PiecePutNum` is how many pieces have already been placed on the wall. Total number of mats needed is `NeedColumnNum * PiecePerPanel * 4 - PiecePutNum`.

See `Area001_Objects.json` for the water wall in Sun-Speckled Terrace.

## From ActorPlacementInfo File
Amount is in AI.Dynamic[36]

# Misc. Notes

### Water Boxes
`SwampBox` vs `WaterBox`
Location data only in ActorPlacementInfo as Quaternion
MaxIcePikmins = amount to freeze
bDisableSink = no sink in swamp
