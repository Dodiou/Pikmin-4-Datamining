import { readFileSync, writeFileSync } from "fs";
import { parseSublevelsObjects } from "./Scripts/Parse/parseMapObjectsSublevels.js";
import { parseObjectLocations } from "./Scripts/Parse/parseMapActorLocations.js";
import { parseRootMapComponents } from "./Scripts/Parse/parseRootMapFile.js";
import { preprocessJSON } from "./Scripts/Parse/util.js";

const cave = 'Cave009';
const floor = 'F00';
const cave_floor = cave + '_' + floor;
const root = `./Maps/Madori/Cave/${cave}/${cave_floor}`;

const rootMap = root + `/${cave_floor}_P.json`;
const subObjects = root + `/Sublevels/${cave_floor}_Objects.json`;
const apfObjects = root + `/ActorPlacementInfo/AP_${cave_floor}_P_Objects.json`;

const rootMapJson = JSON.parse(preprocessJSON(readFileSync(rootMap).toString()));
const subObjectsJson = JSON.parse(preprocessJSON(readFileSync(subObjects).toString()));
const apfObjectsJson = JSON.parse(preprocessJSON(readFileSync(apfObjects).toString()));

const parsedRootMap = parseRootMapComponents(rootMapJson);
const semiParsedObjects = parseSublevelsObjects(subObjectsJson);

const parsedObjects = parseObjectLocations(apfObjectsJson[0].Properties.ActorGeneratorList, semiParsedObjects);

console.log(parsedRootMap);
writeFileSync('./TestScripts/outfileCave.json', JSON.stringify(parsedObjects, undefined, 2));
