import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { parseSublevelsObjects, parseSublevelsTekis } from "./Scripts/Parse/parseMapSublevels.js";
import { parseObjectLocations } from "./Scripts/Parse/parseMapActorLocations.js";
import { parseRootMapComponents } from "./Scripts/Parse/parseRootMapFile.js";
import { groupBy, preprocessJSON } from "./Scripts/Parse/util.js";
import { debugDropItems } from "./Scripts/Parse/Sublevels/parseDrops.js";

const caves = new Array(36).fill(0).map((_, i) => 'Cave' + ('000' + i).slice(-3));
const mapTransforms = {};

for (const cave of caves) {
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
  
    const parsedRootMap = parseRootMapComponents(rootMapJson, true);
    const semiParsedObjects = parseSublevelsObjects(subObjectsJson);
  
    const parsedObjects = parseObjectLocations(apfObjectsJson[0].Properties.ActorGeneratorList, semiParsedObjects);
    const groupedObjects = groupBy(parsedObjects, 'type');

    const groupedAll = { ...groupedObjects };
    
    const subTekis = root + `/Sublevels/${floor}_Teki.json`;
    const apfTekis = root + `/ActorPlacementInfo/AP_${floor}_P_Teki.json`;

    if (existsSync(apfTekis)) {
      const subTekisJson = JSON.parse(preprocessJSON(readFileSync(subTekis).toString()));
      const apfTekisJson = JSON.parse(preprocessJSON(readFileSync(apfTekis).toString()));

      const semiParsedTekis = parseSublevelsTekis(subTekisJson);
      const parsedTekis = parseObjectLocations(apfTekisJson[0].Properties.ActorGeneratorList, semiParsedTekis);

      const groupedTekis = groupBy(parsedTekis, 'type');

      Object.entries(groupedTekis).forEach(([k,v]) => {
        if (groupedAll[k] !== undefined) {
          console.log("matched a key", k)
          groupedAll[k] = [...groupedAll[k], ...v];
        }
        else {
          console.log("didn't match a key", k)
          groupedAll[k] = v;
        }
      });

      if (floor === 'Cave009_F00') {
        writeFileSync(`./TestScripts/${cave}/${floor}_Teki.json`, JSON.stringify(groupedTekis, undefined, 2));
      }
    }

    mapTransforms[floor] = parsedRootMap;
    mkdirSync(`./TestScripts/${cave}`, { recursive: true });
    writeFileSync(`./TestScripts/${cave}/${floor}.json`, JSON.stringify(groupedObjects, undefined, 2));
  }
  console.log("Parsed:", cave);
}

debugDropItems();
writeFileSync(`./TestScripts/cave-transforms.json`, JSON.stringify(mapTransforms, undefined, 2));
