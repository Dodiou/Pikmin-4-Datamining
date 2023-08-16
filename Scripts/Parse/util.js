// assumes object is in the same file (haven't encountered otherwise yet)
export function getObjectFromPath(component, allObjects) {
  const compIndex = parseInt(component.ObjectPath.split('.')[1]);
  return allObjects[compIndex];
}

// Used for Treasures and Creatures
export function getInternalId(type) {
  // Remove starting 'G' and ending '_C' from Type to get the name. Force uppercase
  return type.substring(1, type.length - 2).toUpperCase();
}

export function getTypeFromBlueprint(blueprintName) {
  return blueprintName.substring(blueprintName.indexOf("'") + 1, blueprintName.length - 1);
}

export function removeLocalizationMetadata(localeStr) {
  // Match all character between '[' and ']', non-greedy so it doesn't eat the entire string if multiple meta tags
  return localeStr.split(/\[.*?\]/).join('');
}

const OstAreaNameToFolderId = {
  'HeroStory001': 'Area001',
  'HeroStory002': 'Area002',
  'HeroStory003': 'Area003',
  'HeroStory010': 'Area010',
};

export function isCaveId(mapId) {
  return mapId.startsWith('Cave');
}

export function getMapFolderPath(radarFolderId) {
  const mapId = OstAreaNameToFolderId[radarFolderId] || radarFolderId;
  const isCave = isCaveId(radarFolderId);

  if (isCave) {
    const caveId = mapId.split('_')[0];
    return `./Maps/Madori/Cave/${caveId}/${mapId}`;
  }

  return `./Maps/Main/Area/${mapId}`;
}

export function removeUndefineds(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k,v]) => {
    if (v === undefined || v === null) {
      return false;
    }

    if (typeof v !== 'object') {
      return true;
    }

    // only keep objects that have keys and arrays that have items.
    return (Array.isArray(v) && v.length > 0) ||
      Object.keys(v).length > 0
  }));
}

const DebugUniqueIdRegex = /"DebugUniqueId": (\d+)/g;
// DebugUniqueId's are too big, JSON.parse will lose precision and things will bug out.
//   Convert them to strings since type doesn't matter
export function preprocessJSON(jsonString) {
  return jsonString.replaceAll(DebugUniqueIdRegex, (_match, digits) => `"DebugUniqueId": "${digits}"`);
}

export function groupBy(array, property) {
  const results = {};

  for (const obj of array) {
    const propVal = obj[property];

    if (!results[propVal]) {
      results[propVal] = [];
    }

    results[propVal].push(obj);
  }

  return results;
}
