import { mkdirSync, readdirSync, writeFileSync } from "fs";
import { groupBy } from "./Parse/util.js";
import { parseMapFiles } from "./Parse/parseMapFiles.js";

const caves = new Array(36).fill(0).map((_, i) => 'Cave' + ('000' + i).slice(-3));
function parseCaves() {
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
}


const areas = [
  'Area001',
  'Area002',
  'Area003',
  'Area004',
  'Area006',
  'Area010',
  'Area500'
];
function parseAreas() {
  for (const area of areas) {
    const parsedObjects = parseMapFiles(area);
    // NOTE: Area500 only has the shared file
    parsedObjects.day = parsedObjects.day || [];

    const dayObjects = groupBy(
      [...parsedObjects.shared, ...parsedObjects.day],
      'type'
    );

    const areaDirectory = `./TestScripts/${area}`;
    mkdirSync(areaDirectory, { recursive: true });
    writeFileSync(areaDirectory + '/day.json', JSON.stringify(dayObjects, undefined, 2));

    if (parsedObjects.night) {
      // Area500 would have no night objects.
      const nightObjects = groupBy(
        [...parsedObjects.shared, ...parsedObjects.night],
        'type'
      );
      writeFileSync(areaDirectory + '/night.json', JSON.stringify(nightObjects, undefined, 2));
    }
    if (parsedObjects.olimar) {
      const olimarObjects = groupBy(
        parsedObjects.olimar,
        'type'
      );
      writeFileSync(areaDirectory + '/olimar.json', JSON.stringify(olimarObjects, undefined, 2));
    }

    console.log("Parsed:", area);
  }
}


parseCaves();
parseAreas();
