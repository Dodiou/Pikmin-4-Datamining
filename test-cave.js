import { mkdirSync, readdirSync, writeFileSync } from "fs";
import { groupBy } from "./Scripts/Parse/util.js";
import { debugDropItems } from "./Scripts/Parse/Sublevels/parseDrops.js";
import { parseMapFiles } from "./Scripts/Parse/parseMapFiles.js";

const caves = new Array(36).fill(0).map((_, i) => 'Cave' + ('000' + i).slice(-3));

for (const cave of caves) {
  const caveDir = `./Maps/Madori/Cave/${cave}`;
  const floors = readdirSync(caveDir);

  for (const floor of floors) {
    const objectsArray = parseMapFiles(floor);
    const groupedObjects = groupBy(objectsArray, 'type');

    mkdirSync(`./TestScripts/${cave}`, { recursive: true });
    writeFileSync(`./TestScripts/${cave}/${floor}.json`, JSON.stringify(groupedObjects, undefined, 2));
  }
  console.log("Parsed:", cave);
}

debugDropItems();
// writeFileSync(`./TestScripts/cave-transforms.json`, JSON.stringify(mapTransforms, undefined, 2));
