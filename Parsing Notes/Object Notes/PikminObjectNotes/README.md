## Important Pikmin Spawner Params

### From Sublevels files

Look for objects with a `NoraSpawnerAI` component. Use `GeneratorInfo.DebugUniqueId` to link back to the `ActorPlacementInfo` file for location data.

Any components with `"Name": "NoraSpawnerAI"` contain the params for how the pikmin spawn. Some of this data must be extracted from the `"Outer"` object name.

E.g., the type of spawner: candypop, sprouts, or fighting/idle. Candypops include `PongashiLock` in the name, while `HeadLock` means sprouts and `PikminLock` means fighting/idle. The `bProWrestling` param determines if the pikmin are fighting or idle.

Some props have defaults depending on spawner type. E.g. Candypops have `"NumSpawn": 1` while the other types have `"NumSpawn": 5`.

After a certain number of the same type of pikmin is following the player, the candypop/pikmin will not spawn. The max number to still spawn (inclusive) is `MabikiNumFromFollow`.

Some spawners are replaced by other objects if the above condition is met. `"bMabikiPongashi": true` allows a candypop to spawn in its place. Some also include `MabikiPongashiOffset` with relative `X, Y, Z` to spawn the candypop in a different location (see Cave001_F00).

In addition to candypops, some spawners can spawn other objects using the `RandomActorSpawnList`. (see Cave002_F01, one of the two yellow spawners will spawn an egg).

From Cave001_F00: (Ice pikmin fighting Blowhog, fighting if <= 50 ice pikmin and <= 95 pikmin, else candypop near onion)
```json
"NoraSpawnerAIParam": {
  "PikminColor": "EPikminColor::Ice",
  "bMabikiEnable": true,
  "MabikiNumFromFollow": 50, // <= # of PikminColor means spawn
  "bMabikiPongashi": true, // allows candypop to replace spawner if pikmin cannot spawn
  "MabikiPongashiOffset": { // where the candypop will spawn relative to this
    "X": 1000.0,
    "Y": -1000.0,
    "Z": 0.0
  },
  "RandomActorSpawnList": [],
  "bProWrestling": true, // is fighting an icy blowhog
  "ProWrestlingTekiSearchRange": 200.0,
  "ProWrestlingOffset": {
    "X": 209.64803,
    "Y": 230.0,
    "Z": 0.0
  },
  "GroupIdlingType": "EPikminIdlePlayType::Guidance"
}
```

From Cave002_F01: (red candypop if <= 5 red pikmin, else nospawn)
```json
"NoraSpawnerAIParam": {
  "bMabikiEnable": true,
  "MabikiNumFromFollow": 5,
  "RandomActorSpawnList": []
},
```

From Cave0012_F00: (A white candypop that does not respawn after depletion) (does this change to Ice if >50 white pikmin enter)
```json
"NoraSpawnerAIParam": {
  "PikminColor": "EPikminColor::White",
  "SpawnRadius": 25.0,
  "bMabikiEnable": true,
  "MabikiNumFromFollow": 51,
  "bMabikiPongashi": true,
  "PongashiChangeColorFollowNum": 50,
  "PongashiChangeColorFromFollow": "EPikminColor::Ice",
  "bReservedBirth": true,
  "PongashiColor": "EPikminColor::Ice"
}
```


### From ActorPlacementInfo files

- `AI.Static[0]` is amount
  - See `AP_Cave007_F00_P_Objects.json`, there are 5 blue pikmin fighting, 2 on one wolpole, 3 on the other. There are also 5 blue pikmin planted
  - Can be asserted from `NoraSpawnerAIParams.NumSpawn` after accounting for candypop/sprout/pikmin differences

- `AI.Static[12]` seems to be color
  - 0 = red, 1 = blue, 2 = yellow, 3 = rock, 4 = wing 5 = purple, 6 = white, 7 = ice,
  - Can be asserted from `NoraSpawnerAIParams.PikminColor` after converting enum values to ints




