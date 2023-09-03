import { default as FreezeDrops } from '../../../Enemy Data/FreezeDropItem.json' assert { type: 'json'};

export function parseFreezeDrops(FreezeDropType) {
  const lookupKey = FreezeDropType.substring(FreezeDropType.lastIndexOf(':') + 1);

  const drops = FreezeDrops[0].Rows[lookupKey];
  if (lookupKey === 'NoDrop') {
    return undefined;
  }

  return {
    bossType: lookupKey,
    amount: drops.Num,
    honeyChance: drops.HoneyDropRate
  };
}
