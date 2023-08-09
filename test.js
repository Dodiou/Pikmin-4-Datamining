import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { parseSublevelsObjects } from "./Scripts/Parse/parseMapObjectsSublevels.js";
import { parseObjectLocations } from "./Scripts/Parse/parseMapActorLocations.js";
import { parseRootMapComponents } from "./Scripts/Parse/parseRootMapFile.js";
import { groupBy, preprocessJSON } from "./Scripts/Parse/util.js";

function parseObjectFiles(sublevelFile, placementFile) {
  const sublevelJson = JSON.parse(preprocessJSON(readFileSync(sublevelFile).toString()));
  const placementJson = JSON.parse(preprocessJSON(readFileSync(placementFile).toString()));

  const semiParsedObjects = parseSublevelsObjects(sublevelJson);
  return parseObjectLocations(placementJson[0].Properties.ActorGeneratorList, semiParsedObjects);
}

const areaHasOlimar = {
  'Area001': true,
  'Area002': true,
  'Area003': true,
  'Area004': false,
  'Area006': false,
  'Area010': true,
};

const root = `./Maps/Main/Area/`;

Object.entries(areaHasOlimar).forEach(([area, hasOlimar]) => {
  const areaRoot = root + `/${area}`;
  const rootMapFile = areaRoot + `/${area}_P.json`;

  const rootSublevelFile = areaRoot + `/Sublevels/${area}_Objects.json`;
  const daySublevelFile = areaRoot + `/Sublevels/${area}_Objects_Day.json`;
  const nightSublevelFile = areaRoot + `/Sublevels/${area}_Objects_Night.json`;

  const rootPlacementFile = areaRoot + `/ActorPlacementInfo/AP_${area}_P_Objects.json`;
  const dayPlacementFile = areaRoot + `/ActorPlacementInfo/AP_${area}_P_Objects_Day.json`;
  const nightPlacementFile = areaRoot + `/ActorPlacementInfo/AP_${area}_P_Objects_Night.json`;

  const rootObjects = parseObjectFiles(rootSublevelFile, rootPlacementFile);
  const dayObjects = groupBy([...rootObjects, ...parseObjectFiles(daySublevelFile, dayPlacementFile)], 'type');
  const nightObjects = groupBy([...rootObjects, ...parseObjectFiles(nightSublevelFile, nightPlacementFile)], 'type');

  const areaDirectory = `./TestScripts/${area}`;
  mkdirSync(areaDirectory, { recursive: true });
  writeFileSync(areaDirectory + '/day.json', JSON.stringify(dayObjects, undefined, 2));
  writeFileSync(areaDirectory + '/night.json', JSON.stringify(nightObjects, undefined, 2));

  if (hasOlimar) {
    const olimarSublevelFile = areaRoot + `/Sublevels/${area}_Hero_Objects.json`;
    const olimarPlacementFile = areaRoot + `/ActorPlacementInfo/AP_${area}_P_Hero_Objects.json`;

    const olimarObjects = groupBy(parseObjectFiles(olimarSublevelFile, olimarPlacementFile), 'type');
    writeFileSync(areaDirectory + '/olimar.json', JSON.stringify(olimarObjects, undefined, 2));
  }

  const rootMapObjects = JSON.parse(preprocessJSON(readFileSync(rootMapFile).toString()));
  const rotation = parseRootMapComponents(rootMapObjects).rotation;

  console.log('Map rotation for ', area, ':', rotation);
});
