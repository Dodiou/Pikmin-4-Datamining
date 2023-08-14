import { existsSync, readFileSync } from 'fs';
import { getMapFolderPath, isCaveId, preprocessJSON, removeUndefineds } from "./util.js"
import { parseSublevelsObjects, parseSublevelsTekis } from './parseMapSublevels.js';
import { parseObjectLocations } from './parseMapActorLocations.js';


export function parseMapFiles(radarFolderId) {
  if (isCaveId(radarFolderId)) {
    return parseCaveFiles(radarFolderId);
  }
  return parseSurfaceFiles(radarFolderId);
}

const SharedEndings = {
  objects: 'Objects',
  tekis: 'Teki',
};
const DayEndings = {
  objects: 'Objects_Day',
  tekis: 'Teki_Day',
};
const NightEndings = {
  objects: 'Objects_Night',
  tekis: 'Teki_Night',
};
const OlimarEndings = {
  objects: 'Hero_Objects',
  tekis: 'Hero_Teki',
};
const FileEndings = {
  shared: SharedEndings,
  day: DayEndings,
  night: NightEndings,
  olimar: OlimarEndings
};

function parseSurfaceFiles(radarFolderId) {
  const baseFolder = getMapFolderPath(radarFolderId);
  const placementsFolder = baseFolder + '/ActorPlacementInfo';
  const sublevelsFolder = baseFolder + '/Sublevels';
  
  return removeUndefineds(
    Object.fromEntries(
      Object.entries(FileEndings).map(([timeOfDay, fileEndings]) => {
        const objectPlacements = placementsFolder + `/AP_${radarFolderId}_P_${fileEndings.objects}.json`;
        const tekiPlacements = placementsFolder + `/AP_${radarFolderId}_P_${fileEndings.tekis}.json`;
        const objectSublevels = sublevelsFolder + `/${radarFolderId}_${fileEndings.objects}.json`;
        const tekiSublevels = sublevelsFolder + `/${radarFolderId}_${fileEndings.tekis}.json`;

        return [
          timeOfDay,
          [
            ...parseMapObjects(objectSublevels, objectPlacements),
            ...parseMapTekis(tekiSublevels, tekiPlacements)
          ]
        ];
      })
    )
  );
}

function parseCaveFiles(radarFolderId) {
  const baseFolder = getMapFolderPath(radarFolderId);
  const placementsFolder = baseFolder + '/ActorPlacementInfo';
  const sublevelsFolder = baseFolder + '/Sublevels';

  const objectPlacements = placementsFolder + `/AP_${radarFolderId}_P_Objects.json`;
  const tekiPlacements = placementsFolder + `/AP_${radarFolderId}_P_Teki.json`;
  const objectSublevels = sublevelsFolder + `/${radarFolderId}_Objects.json`;
  const tekiSublevels = sublevelsFolder + `/${radarFolderId}_Teki.json`;

  return [
    ...parseMapObjects(objectSublevels, objectPlacements),
    ...parseMapTekis(tekiSublevels, tekiPlacements)
  ];
}

function parseMapObjects(sublevelsFile, placementsFile) {
  if (!existsSync(placementsFile) || !existsSync(sublevelsFile)) {
    return [];
  }

  const sublevelsJson = JSON.parse(preprocessJSON(readFileSync(sublevelsFile).toString()));
  const semiParsedObjects = parseSublevelsObjects(sublevelsJson);

  const placementsJson = JSON.parse(preprocessJSON(readFileSync(placementsFile).toString()));
  return parseObjectLocations(placementsJson[0].Properties.ActorGeneratorList, semiParsedObjects);
}

function parseMapTekis(sublevelsFile, placementsFile) {
  if (!existsSync(placementsFile) || !existsSync(sublevelsFile)) {
    return [];
  }

  const sublevelsJson = JSON.parse(preprocessJSON(readFileSync(sublevelsFile).toString()));
  const semiParsedTekis = parseSublevelsTekis(sublevelsJson);

  const placementsJson = JSON.parse(preprocessJSON(readFileSync(placementsFile).toString()));
  return parseObjectLocations(placementsJson[0].Properties.ActorGeneratorList, semiParsedTekis);
}
