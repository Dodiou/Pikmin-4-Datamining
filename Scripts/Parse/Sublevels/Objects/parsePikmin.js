import { InfoType, PikminSpawnState } from "../../types.js";
import { getObjectFromPath, getPikminColor, getTypeFromBlueprint, removeUndefineds } from "../../util.js";

// NOTE: Ignore "PongashiColor"; Differs from PikminColor in Cave012, Subzero Sauna, but does not get used.
function parseCandypop(params) {
  const color = getPikminColor(params.PikminColor);

  // default is undefined
  const changesAt = params.PongashiChangeColorFollowNum || undefined;
  // undefined if no changesAt
  const changesTo = changesAt && getPikminColor(params.PongashiChangeColorFromFollow);

  // default is undefined
  const disappearsAt = params.MabikiNumFromFollow !== undefined ? params.MabikiNumFromFollow + 1 : undefined;
  // Note: egg is the only replacement used.
  const replacedBy = (disappearsAt && params.RandomActorSpawnList?.length)
    ? getTypeFromBlueprint(params.RandomActorSpawnList[0].DropActor.ObjectName)
    : undefined;

  if (replacedBy && replacedBy !== 'GEgg_C') {
    throw new Error('Found a candypop that is not replaced by egg');
  }


  const type = `${InfoType.Candypop}-${color}`;
  return removeUndefineds({
    type,
    infoType: InfoType.Candypop,
    color,
    changesAt,
    changesTo,
    disappearsAt,
    replacedBy
  });
}

// NOTE: Ignored params
//       - MabikiNumFromAll       - only occurs in Challenges/Trials. Does not get used
//       - PongashiColor          - differs from PikminColor only in Sage Trials (untestable)
//       - PongashiChangeColor*   - change color never differs from PikminColor for non-candypops
function parsePikmin(params, pikminState) {
  const color = getPikminColor(params.PikminColor);
  // default is undefined
  const disappearsAt = params.bMabikiEnable 
    ? params.MabikiNumFromFollow + 1
    : undefined;
  // Note: egg is the only replacement used.
  const otherReplacement = params.RandomActorSpawnList?.length
    ? getTypeFromBlueprint(params.RandomActorSpawnList[0].DropActor.ObjectName)
    : undefined;

  // Note: candypop color never changes from pikmin color
  const replacedBy = disappearsAt &&
    (
      params.bMabikiPongashi
        ? `${InfoType.Candypop}-${color}`
        : otherReplacement
    );

  if (otherReplacement && otherReplacement !== 'GEgg_C') {
    throw new Error('Found a pikmin spawner that is not replaced by egg');
  }


  const type = `${InfoType.Pikmin}-${color}`;
  return removeUndefineds({
    type,
    infoType: InfoType.Pikmin,
    color,
    state: pikminState,
    amount: params.SpawnNum || 5,
    disappearsAt,
    replacedBy,
    // XYZ offset of where to spawn the replacement candypop. E.g. enter Last-Frost Cavern w/ 51 ice pikmin
    //   and a candypop will spawn 1000,-1000,0 from the icy blowhog (ends up near the onion location)
    candypopOffset: replacedBy && replacedBy.startsWith('candypop')
      ? params.MabikiPongashiOffset
      : undefined
  });
}

// The spawner code params is very poorly written, so some assertions to help find special cases if they arise:
function assertSpawnerParams(params, isCandypop) {
  const hasSpawns = !!params.RandomActorSpawnList?.length;
  if (params.bMabikiEnable && params.MabikiNumFromFollow === undefined) {
    throw new Error('This pikmin spawner has a spawnMax without a set number. What is the default?')
  }
  if (!params.bMabikiEnable && (hasSpawns || params.bMabikiPongashi)) {
    // Challenge caves only: Cave028, Cave035_F05. Untestable
    // throw new Error('This pikmin spawner has no spawnMax, but has replacements. What happens here?');
  }
  if (!params.bMabikiEnable && params.MabikiNumFromFollow !== undefined) {
    throw new Error('This pikmin spawner doesn\'t disapper, but has a disappearance number.')
  }

  // assume bMabikiEnable = true from now on
  if (params.bMabikiPongashi && params.bDisableForcePongashi) {
    throw new Error('This pikmin spawner gets replaced by a candypop, but also gets no replacement. What happens here?');
  }
  if (params.bMabikiPongashi && hasSpawns) {
    // Challenge caves only: Cave035_F05. Untestable
    // throw new Error('This pikmin spawner gets replaced by a candypop and objects. What happens here?');
  }
  if (params.bMabikiPongashi && params.PongashiChangeColorFollowNum === undefined && params.PongashiChangeColorFromFollow) {
    throw new Error('Candypop changes color, but after unknown amount of pikmin. What is the default?')
  }
  if (
    params.bMabikiPongashi &&
    params.PongashiColor &&
    params.PongashiColor !== params.PikminColor
  ) {
    // Only occurs in Candypops (PongashiColor is ignore) and Sage Trials (untestable)
    throw new Error('The candypop color differs from the normal color before the ChangeColor is reached. What happens here?');
  }
}

export function isPikminSpawnerComp(comp) {
  return !!comp.Properties.NoraSpawnerAI;
}

export function parsePikminSpawnerComp(comp, compsList) {
  const NoraSpawnerAI = getObjectFromPath(comp.Properties.NoraSpawnerAI, compsList);
  const params = NoraSpawnerAI.Properties.NoraSpawnerAIParam || {};

  if (comp.Type.includes('PongashiLock')) {
    return parseCandypop(params);
  };

  const isSprouts = comp.Type.includes('HeadLock');
  const isFighting = params.bProWrestling === true;
  return parsePikmin(
    params,
    isSprouts
      ? PikminSpawnState.Sprouts
      : isFighting
        ? PikminSpawnState.Fighting
        : PikminSpawnState.Idle
  );
}
