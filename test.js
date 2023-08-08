import { readFileSync, writeFileSync } from "fs";
import { parseSublevelsObjects } from "./Scripts/Parse/parseMapObjectsSublevels.js";
import { parseObjectLocations } from "./Scripts/Parse/parseMapActorLocations.js";
import { parseRootMapComponents } from "./Scripts/Parse/parseRootMapFile.js";
import { preprocessJSON } from "./Scripts/Parse/util.js";

const area = 'Area010';
const root = `./Maps/Main/Area/${area}`;

const rootMap = root + `/${area}_P.json`;
const subObjects = root + `/Sublevels/${area}_Objects.json`;
const subObjectsDay = root + `/Sublevels/${area}_Objects_Day.json`;
const subObjectsNight = root + `/Sublevels/${area}_Objects_Night.json`;
const subObjectsOlimar = root + `/Sublevels/${area}_Hero_Objects.json`;
const apfObjects = root + `/ActorPlacementInfo/AP_${area}_P_Objects.json`;
const apfObjectsDay = root + `/ActorPlacementInfo/AP_${area}_P_Objects_Day.json`;
const apfObjectsNight = root + `/ActorPlacementInfo/AP_${area}_P_Objects_Night.json`;
const apfObjectsOlimar = root + `/ActorPlacementInfo/AP_${area}_P_Hero_Objects.json`;

const rootMapJson = JSON.parse(preprocessJSON(readFileSync(rootMap).toString()));
const subObjectsJson = JSON.parse(preprocessJSON(readFileSync(subObjects).toString()));
const subObjectsDayJson = JSON.parse(preprocessJSON(readFileSync(subObjectsDay).toString()));
const subObjectsNightJson = JSON.parse(preprocessJSON(readFileSync(subObjectsNight).toString()));
const subObjectsOlimarJson = JSON.parse(preprocessJSON(readFileSync(subObjectsOlimar).toString()));
const apfObjectsJson = JSON.parse(preprocessJSON(readFileSync(apfObjects).toString()));
const apfObjectsDayJson = JSON.parse(preprocessJSON(readFileSync(apfObjectsDay).toString()));
const apfObjectsNightJson = JSON.parse(preprocessJSON(readFileSync(apfObjectsNight).toString()));
const apfObjectsOlimarJson = JSON.parse(preprocessJSON(readFileSync(apfObjectsOlimar).toString()));

const parsedRootMap = parseRootMapComponents(rootMapJson);
const semiParsedObjects = parseSublevelsObjects(subObjectsJson);
const semiParsedObjectsDay = parseSublevelsObjects(subObjectsDayJson);
const semiParsedObjectsNight = parseSublevelsObjects(subObjectsNightJson);
const semiParsedObjectsOlimar = parseSublevelsObjects(subObjectsOlimarJson);

const parsedObjects = parseObjectLocations(apfObjectsJson[0].Properties.ActorGeneratorList, semiParsedObjects);
const parsedObjectsDay = parseObjectLocations(apfObjectsDayJson[0].Properties.ActorGeneratorList, semiParsedObjectsDay);
const parsedObjectsNight = parseObjectLocations(apfObjectsNightJson[0].Properties.ActorGeneratorList, semiParsedObjectsNight);
const parsedObjectsOlimar = parseObjectLocations(apfObjectsOlimarJson[0].Properties.ActorGeneratorList, semiParsedObjectsOlimar);

const mergedObjectsDay = [ ...parsedObjects, ...parsedObjectsDay ];
const mergedObjectsNight = [ ...parsedObjects, ...parsedObjectsNight ];

console.log(parsedRootMap);
writeFileSync('./TestScripts/outfileDay.json', JSON.stringify(mergedObjectsDay, undefined, 2));
writeFileSync('./TestScripts/outfileNight.json', JSON.stringify(mergedObjectsNight, undefined, 2));
writeFileSync('./TestScripts/outfileOlimar.json', JSON.stringify(parsedObjectsOlimar, undefined, 2));
