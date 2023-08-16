import { ObjectTypes, PikminVariants } from "../../types.js";
import { getObjectFromPath, getPikminColor, removeUndefineds } from "../../util.js";

function parseObfuscatedParams(params) {
  if (!params.bMabikiEnable) {
    return {
      disappears: false,
      pikminCapCandypop: !params.bDisableForcePongashi
    };
  }

  const disappears = true;
  const hasCandypop = !!params.bMabikiPongashi;
}

// The spawner code params is very poorly written, so some assertions to help find special cases if they arise:
function assertSpawnerParams(params, hasSpawns) {
  if (params.bMabikiEnable && params.MabikiNumFromFollow === undefined) {
    throw new Error('This pikmin spawner has a spawnMax without a set number. What is the default?')
  }
  if (!params.bMabikiEnable && (hasSpawns || params.bMabikiPongashi)) {
    // Challenge caves only: Cave028, Cave035_F05. Untestable
    throw new Error('This pikmin spawner has no spawnMax, but has replacements. What happens here?');
  }

  // assume bMabikiEnable = true from now on
  if (params.bMabikiPongashi && params.bDisableForcePongashi) {
    throw new Error('This pikmin spawner gets replaced by a candypop, but also gets no replacement. What happens here?');
  }
  if (params.bMabikiPongashi && hasSpawns) {
    // Challenge caves only: Cave035_F05. Untestable
    throw new Error('This pikmin spawner gets replaced by a candypop and objects. What happens here?');
  }
  if (params.bMabikiPongashi && params.PongashiChangeColorFollowNum === undefined && params.PongashiChangeColorFromFollow) {
    throw new Error('Candypop changes color, but after unknown amount of pikmin. What is the default?')
  }
  if (
    params.bMabikiPongashi &&
    params.PongashiColor &&
    params.PongashiColor !== params.PikminColor &&
    (
      params.PongashiChangeColorFollowNum &&
      params.MabikiNumFromFollow &&
      params.PongashiChangeColorFollowNum + 2 > params.MabikiNumFromFollow
    )
  ) {
    // Cave012 (Subzero Sauna. PongashiColor is ignored b/c it disappears)
    throw new Error('The candypop color differs from the normal color before the ChangeColor is reached. What happens here?');
  }
}

// Some defaults for non-candypop pikmin spawners
// const DEFAULT_NORA_SPAWNER_AI_PARAMS = {
//   "PikminColor": "EPikminColor::Red",
//   "bProWrestling": false,
//   "NumSpawn": 5,
//   "bMabikiPongashi": false,
//   "MabikiPongashiOffset": {
//     "X": 0,
//     "Y": 0,
//     "Z": 0,
//   },
// }
function parsePikminSpawnerAIComp(spawnerType, NoraSpawnerAI) {
  const params = NoraSpawnerAI.Properties.NoraSpawnerAIParam || {};

  const isCandypop = spawnerType.includes('PongashiLock');
  const isSprouts = spawnerType.includes('HeadLock');
  const isFighting = params.bProWrestling === true;
  const hasSpawns = params.RandomActorSpawnList && params.RandomActorSpawnList.length !== 0;

  // uncomment to debug some of the weird spawner params:
  // assertSpawnerParams(params, hasSpawns);
  
  // SpawnHeadLeaves probably not important, but determines leaf, flower, bud

  const spawnerProps = {
    type: isCandypop
      ? ObjectTypes.Candypop
      : ObjectTypes.Pikmin,
    color: getPikminColor(params.PikminColor),
    // What state the pikmin are in. candypop, fighting, sprouts, or idle (are there others?)
    variant: isCandypop
      ? undefined
      : isSprouts
        ? PikminVariants.Sprouts
        : isFighting
          ? PikminVariants.Fighting
          : PikminVariants.Idle,
    amount: params.SpawnNum || (isCandypop ? 1 : 5),
    // unknown if these are candypop only.
    changeToCondition: params.PongashiChangeColorFollowNum,
    changeToColor: params.PongashiChangeColorFromFollow && getPikminColor(params.PongashiChangeColorFromFollow),
    // Add 1 b/c of >check
    // the spawner will not spawn if the player has >='replacementCondition' of the same pikmin color
    replacementCondition: params.MabikiNumFromFollow && params.MabikiNumFromFollow + 1,
    // some spawners have replacements if 'spawnMaxCondition' is met, (and only if it is met, not if "forced" by 100 pikmin limit)
    // usually candypops of the same color, but sometimes eggs or candypops of a different color
    // TODO: depends on bDisableForcePongashi?
    replacement: params.bMabikiPongashi && !params.bDisableForcePongashi ? 'candypop' : hasSpawns ? 'other' : undefined,
    // XYZ offset of where to spawn the replacement candypop. E.g. enter Last-Frost Cavern w/ 51 ice pikmin
    //   and a candypop will spawn 1000,-1000,0 from the icy blowhog (ends up near the onion location)
    candypopOffset: params.MabikiPongashiOffset
  };

  return removeUndefineds(spawnerProps);
}

export function isPikminSpawnerComp(comp) {
  return !!comp.Properties.NoraSpawnerAI;
}

export function parsePikminSpawnerComp(comp, compsList) {
  const spawnerComp = getObjectFromPath(comp.Properties.NoraSpawnerAI, compsList);
  return parsePikminSpawnerAIComp(comp.Type, spawnerComp);
}
