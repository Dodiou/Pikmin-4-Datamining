import { InfoType, MarkerType } from "../../types.js";
import { getObjectFromPath } from "../../util.js";

export function isTunnelComp(comp) {
  return !!(
    comp.Properties.WarpCarryAI ||
    comp.Properties.HappyDoorAI
  );
}

const DefaultPupTunnelId = 'HappyDoorID_0';
const DefaultTunnelId = 'TunnelID_0';
const DefaultCaptainTunnelId = 'WarpCarryID_0';

export function parseTunnelComp(comp, compsList) {
  if (comp.Properties.WarpCarryAI) {
    const AIComponent = getObjectFromPath(comp.Properties.WarpCarryAI, compsList);
    const isCaptainOnly = comp.Type === 'GTunnel_C';

    const defaultTunnelId = isCaptainOnly ? DefaultCaptainTunnelId : DefaultTunnelId;
    const tunnelId = AIComponent.Properties?.WarpCarryAIParameter?.WarpCarryID || defaultTunnelId;

    return {
      type: isCaptainOnly ? MarkerType.TunnelCaptain : MarkerType.TunnelAny,
      infoType: InfoType.Tunnel,
      tunnelId
    };
  }
  else if (comp.Properties.HappyDoorAI) {
    const AIComponent = getObjectFromPath(comp.Properties.HappyDoorAI, compsList);
    const tunnelId = AIComponent.Properties?.HappyDoorAIParameter?.HappyDoorID || DefaultPupTunnelId;

    return {
      type: MarkerType.TunnelOatchi,
      infoType: InfoType.Tunnel,
      tunnelId
    }
  }
  throw new Error(`Unknown tunnel component ${comp.Type}`);
}
