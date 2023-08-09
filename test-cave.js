import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { parseSublevelsObjects } from "./Scripts/Parse/parseMapObjectsSublevels.js";
import { parseObjectLocations } from "./Scripts/Parse/parseMapActorLocations.js";
import { parseRootMapComponents } from "./Scripts/Parse/parseRootMapFile.js";
import { groupBy, preprocessJSON } from "./Scripts/Parse/util.js";

const caves = new Array(36).fill(0).map((_, i) => 'Cave' + ('000' + i).slice(-3));

for (const cave of caves) {
  console.log("Cave:", cave);

  const caveDir = `./Maps/Madori/Cave/${cave}`;
  const floors = readdirSync(caveDir);

  for (const floor of floors) {
    const root = `./Maps/Madori/Cave/${cave}/${floor}`;
  
    const rootMap = root + `/${floor}_P.json`;
    const subObjects = root + `/Sublevels/${floor}_Objects.json`;
    const apfObjects = root + `/ActorPlacementInfo/AP_${floor}_P_Objects.json`;
  
    const rootMapJson = JSON.parse(preprocessJSON(readFileSync(rootMap).toString()));
    const subObjectsJson = JSON.parse(preprocessJSON(readFileSync(subObjects).toString()));
    const apfObjectsJson = JSON.parse(preprocessJSON(readFileSync(apfObjects).toString()));
  
    // TODO view map rotation info.
    const parsedRootMap = parseRootMapComponents(rootMapJson);
    const semiParsedObjects = parseSublevelsObjects(subObjectsJson);
  
    const parsedObjects = parseObjectLocations(apfObjectsJson[0].Properties.ActorGeneratorList, semiParsedObjects);
    const groupedObjects = groupBy(parsedObjects, 'type');

    mkdirSync(`./TestScripts/${cave}`, { recursive: true });
    writeFileSync(`./TestScripts/${cave}/${floor}.json`, JSON.stringify(groupedObjects, undefined, 2));
  }
}
