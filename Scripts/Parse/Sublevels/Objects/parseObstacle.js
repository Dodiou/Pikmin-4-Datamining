
export function isObstacleComp(comp) {
  return !!(
    // all mushrooms, not just child/small ones
    comp.Properties.KomushAI ||
    comp.Properties.CrackPotAI ||
    // hydro jelly
    comp.Properties.CrushJellyAI
  )
}
