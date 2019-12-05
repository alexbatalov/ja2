namespace ja2 {

// dynamic arrays that contain the valid gridno's for each edge
export let gps1stNorthEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
export let gps1stEastEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
export let gps1stSouthEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
export let gps1stWestEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
// contains the size for each array
export let gus1stNorthEdgepointArraySize: UINT16 = 0;
export let gus1stEastEdgepointArraySize: UINT16 = 0;
export let gus1stSouthEdgepointArraySize: UINT16 = 0;
export let gus1stWestEdgepointArraySize: UINT16 = 0;
// contains the index value for the first array index of the second row of each edgepoint array.
// Because each edgepoint side has two rows, the outside most row is calculated first, then the inside row.
// For purposes of AI, it may become necessary to avoid this.
let gus1stNorthEdgepointMiddleIndex: UINT16 = 0;
let gus1stEastEdgepointMiddleIndex: UINT16 = 0;
let gus1stSouthEdgepointMiddleIndex: UINT16 = 0;
let gus1stWestEdgepointMiddleIndex: UINT16 = 0;

// dynamic arrays that contain the valid gridno's for each edge
let gps2ndNorthEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
let gps2ndEastEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
let gps2ndSouthEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
let gps2ndWestEdgepointArray: INT16[] /* Pointer<INT16> */ = <INT16[]><unknown>null;
// contains the size for each array
let gus2ndNorthEdgepointArraySize: UINT16 = 0;
let gus2ndEastEdgepointArraySize: UINT16 = 0;
let gus2ndSouthEdgepointArraySize: UINT16 = 0;
let gus2ndWestEdgepointArraySize: UINT16 = 0;
// contains the index value for the first array index of the second row of each edgepoint array.
// Because each edgepoint side has two rows, the outside most row is calculated first, then the inside row.
// For purposes of AI, it may become necessary to avoid this.
let gus2ndNorthEdgepointMiddleIndex: UINT16 = 0;
let gus2ndEastEdgepointMiddleIndex: UINT16 = 0;
let gus2ndSouthEdgepointMiddleIndex: UINT16 = 0;
let gus2ndWestEdgepointMiddleIndex: UINT16 = 0;

let gfEdgepointsExist: boolean = false;
export let gfGeneratingMapEdgepoints: boolean = false;

let gsTLGridNo: INT16 = 13286;
let gsTRGridNo: INT16 = 1043;
let gsBLGridNo: INT16 = 24878;
let gsBRGridNo: INT16 = 12635;

export function TrashMapEdgepoints(): void {
  // Primary edgepoints
  gps1stNorthEdgepointArray = <INT16[]><unknown>null;
  gps1stEastEdgepointArray = <INT16[]><unknown>null;
  gps1stSouthEdgepointArray = <INT16[]><unknown>null;
  gps1stWestEdgepointArray = <INT16[]><unknown>null;
  gus1stNorthEdgepointArraySize = 0;
  gus1stEastEdgepointArraySize = 0;
  gus1stSouthEdgepointArraySize = 0;
  gus1stWestEdgepointArraySize = 0;
  gus1stNorthEdgepointMiddleIndex = 0;
  gus1stEastEdgepointMiddleIndex = 0;
  gus1stSouthEdgepointMiddleIndex = 0;
  gus1stWestEdgepointMiddleIndex = 0;
  // Secondary edgepoints
  gps2ndNorthEdgepointArray = <INT16[]><unknown>null;
  gps2ndEastEdgepointArray = <INT16[]><unknown>null;
  gps2ndSouthEdgepointArray = <INT16[]><unknown>null;
  gps2ndWestEdgepointArray = <INT16[]><unknown>null;
  gus2ndNorthEdgepointArraySize = 0;
  gus2ndEastEdgepointArraySize = 0;
  gus2ndSouthEdgepointArraySize = 0;
  gus2ndWestEdgepointArraySize = 0;
  gus2ndNorthEdgepointMiddleIndex = 0;
  gus2ndEastEdgepointMiddleIndex = 0;
  gus2ndSouthEdgepointMiddleIndex = 0;
  gus2ndWestEdgepointMiddleIndex = 0;
}

// This final step eliminates some edgepoints which actually don't path directly to the edge of the map.
// Cases would include an area that is close to the edge, but a fence blocks it from direct access to the edge
// of the map.
function ValidateEdgepoints(): void {
  let i: INT32;
  let usValidEdgepoints: UINT16;
  let Soldier: SOLDIERTYPE = createSoldierType();

  Soldier.bTeam = 1;

  // north
  usValidEdgepoints = 0;
  for (i = 0; i < gus1stNorthEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps1stNorthEdgepointArray[i])) {
      gps1stNorthEdgepointArray[usValidEdgepoints] = gps1stNorthEdgepointArray[i];
      if (i == gus1stNorthEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus1stNorthEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus1stNorthEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus1stNorthEdgepointMiddleIndex++;
    }
  }
  gus1stNorthEdgepointArraySize = usValidEdgepoints;
  // East
  usValidEdgepoints = 0;
  for (i = 0; i < gus1stEastEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps1stEastEdgepointArray[i])) {
      gps1stEastEdgepointArray[usValidEdgepoints] = gps1stEastEdgepointArray[i];
      if (i == gus1stEastEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus1stEastEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus1stEastEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus1stEastEdgepointMiddleIndex++;
    }
  }
  gus1stEastEdgepointArraySize = usValidEdgepoints;
  // South
  usValidEdgepoints = 0;
  for (i = 0; i < gus1stSouthEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps1stSouthEdgepointArray[i])) {
      gps1stSouthEdgepointArray[usValidEdgepoints] = gps1stSouthEdgepointArray[i];
      if (i == gus1stSouthEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus1stSouthEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus1stSouthEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus1stSouthEdgepointMiddleIndex++;
    }
  }
  gus1stSouthEdgepointArraySize = usValidEdgepoints;
  // West
  usValidEdgepoints = 0;
  for (i = 0; i < gus1stWestEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps1stWestEdgepointArray[i])) {
      gps1stWestEdgepointArray[usValidEdgepoints] = gps1stWestEdgepointArray[i];
      if (i == gus1stWestEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus1stWestEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus1stWestEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus1stWestEdgepointMiddleIndex++;
    }
  }
  gus1stWestEdgepointArraySize = usValidEdgepoints;

  // north
  usValidEdgepoints = 0;
  for (i = 0; i < gus2ndNorthEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps2ndNorthEdgepointArray[i])) {
      gps2ndNorthEdgepointArray[usValidEdgepoints] = gps2ndNorthEdgepointArray[i];
      if (i == gus2ndNorthEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus2ndNorthEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus2ndNorthEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus2ndNorthEdgepointMiddleIndex++;
    }
  }
  gus2ndNorthEdgepointArraySize = usValidEdgepoints;
  // East
  usValidEdgepoints = 0;
  for (i = 0; i < gus2ndEastEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps2ndEastEdgepointArray[i])) {
      gps2ndEastEdgepointArray[usValidEdgepoints] = gps2ndEastEdgepointArray[i];
      if (i == gus2ndEastEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus2ndEastEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus2ndEastEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus2ndEastEdgepointMiddleIndex++;
    }
  }
  gus2ndEastEdgepointArraySize = usValidEdgepoints;
  // South
  usValidEdgepoints = 0;
  for (i = 0; i < gus2ndSouthEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps2ndSouthEdgepointArray[i])) {
      gps2ndSouthEdgepointArray[usValidEdgepoints] = gps2ndSouthEdgepointArray[i];
      if (i == gus2ndSouthEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus2ndSouthEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus2ndSouthEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus2ndSouthEdgepointMiddleIndex++;
    }
  }
  gus2ndSouthEdgepointArraySize = usValidEdgepoints;
  // West
  usValidEdgepoints = 0;
  for (i = 0; i < gus2ndWestEdgepointArraySize; i++) {
    if (VerifyEdgepoint(Soldier, gps2ndWestEdgepointArray[i])) {
      gps2ndWestEdgepointArray[usValidEdgepoints] = gps2ndWestEdgepointArray[i];
      if (i == gus2ndWestEdgepointMiddleIndex) {
        // adjust the middle index to the new one.
        gus2ndWestEdgepointMiddleIndex = usValidEdgepoints;
      }
      usValidEdgepoints++;
    } else if (i == gus2ndWestEdgepointMiddleIndex) {
      // increment the middle index because it's edgepoint is no longer valid.
      gus2ndWestEdgepointMiddleIndex++;
    }
  }
  gus2ndWestEdgepointArraySize = usValidEdgepoints;
}

function CompactEdgepointArray(psArray: Pointer<INT16[]>, pusMiddleIndex: Pointer<UINT16>, pusArraySize: Pointer<UINT16>): void {
  let i: INT32;
  let usArraySize: UINT16;
  let usValidIndex: UINT16 = 0;

  usArraySize = pusArraySize.value;

  for (i = 0; i < usArraySize; i++) {
    if ((psArray.value)[i] == -1) {
      (pusArraySize.value)--;
      if (i < pusMiddleIndex.value) {
        (pusMiddleIndex.value)--;
      }
    } else {
      if (usValidIndex != i) {
        (psArray.value)[usValidIndex] = (psArray.value)[i];
      }
      usValidIndex++;
    }
  }
  psArray.value = psArray.value.slice(0, pusArraySize.value);
  Assert(psArray.value);
}

function InternallyClassifyEdgepoints(pSoldier: SOLDIERTYPE, sGridNo: INT16, psArray1: Pointer<INT16[]>, pusMiddleIndex1: Pointer<UINT16>, pusArraySize1: Pointer<UINT16>, psArray2: Pointer<INT16[]>, pusMiddleIndex2: Pointer<UINT16>, pusArraySize2: Pointer<UINT16>): void {
  let i: INT32;
  let us1stBenchmarkID: UINT16;
  let us2ndBenchmarkID: UINT16;
  us1stBenchmarkID = us2ndBenchmarkID = 0xffff;
  if (!(psArray2.value)) {
    psArray2.value = createArray(400, 0);
  }
  for (i = 0; i < pusArraySize1.value; i++) {
    if (sGridNo == (psArray1.value)[i]) {
      if (i < pusMiddleIndex1.value) {
        // in the first half of the array
        us1stBenchmarkID = i;
        // find the second benchmark
        for (i = pusMiddleIndex1.value; i < pusArraySize1.value; i++) {
          if (EdgepointsClose(pSoldier, (psArray1.value)[us1stBenchmarkID], (psArray1.value)[i])) {
            us2ndBenchmarkID = i;
            break;
          }
        }
      } else {
        // in the second half of the array
        us2ndBenchmarkID = i;
        // find the first benchmark
        for (i = 0; i < pusMiddleIndex1.value; i++) {
          if (EdgepointsClose(pSoldier, (psArray1.value)[us2ndBenchmarkID], (psArray1.value)[i])) {
            us1stBenchmarkID = i;
            break;
          }
        }
      }
      break;
    }
  }
  // Now we have found the two benchmarks, so go in both directions for each one to determine which entrypoints
  // are going to be used in the primary array.  All rejections will be positioned in the secondary array for
  // use for isolated entry when tactically traversing.
  if (us1stBenchmarkID != 0xffff) {
    for (i = us1stBenchmarkID; i > 0; i--) {
      if (!EdgepointsClose(pSoldier, (psArray1.value)[i], (psArray1.value)[i - 1])) {
        // All edgepoints from index 0 to i-1 are rejected.
        while (i) {
          i--;
          (psArray2.value)[pusArraySize2.value] = (psArray1.value)[i];
          (pusMiddleIndex2.value)++;
          (pusArraySize2.value)++;
          (psArray1.value)[i] = -1;
        }
        break;
      }
    }
    for (i = us1stBenchmarkID; i < pusMiddleIndex1.value - 1; i++) {
      if (!EdgepointsClose(pSoldier, (psArray1.value)[i], (psArray1.value)[i + 1])) {
        // All edgepoints from index i+1 to 1st middle index are rejected.
        while (i < pusMiddleIndex1.value - 1) {
          i++;
          (psArray2.value)[pusArraySize2.value] = (psArray1.value)[i];
          (pusMiddleIndex2.value)++;
          (pusArraySize2.value)++;
          (psArray1.value)[i] = -1;
        }
        break;
      }
    }
  }
  if (us2ndBenchmarkID != 0xffff) {
    for (i = us2ndBenchmarkID; i > pusMiddleIndex1.value; i--) {
      if (!EdgepointsClose(pSoldier, (psArray1.value)[i], (psArray1.value)[i - 1])) {
        // All edgepoints from 1st middle index  to i-1 are rejected.
        while (i > pusMiddleIndex1.value) {
          i--;
          (psArray2.value)[pusArraySize2.value] = (psArray1.value)[i];
          (pusArraySize2.value)++;
          (psArray1.value)[i] = -1;
        }
        break;
      }
    }
    for (i = us2ndBenchmarkID; i < pusArraySize1.value - 1; i++) {
      if (!EdgepointsClose(pSoldier, (psArray1.value)[i], (psArray1.value)[i + 1])) {
        // All edgepoints from index 0 to i-1 are rejected.
        while (i < pusArraySize1.value - 1) {
          i++;
          (psArray2.value)[(pusArraySize2.value)] = (psArray1.value)[i];
          (pusArraySize2.value)++;
          (psArray1.value)[i] = -1;
        }
        break;
      }
    }
  }
  // Now compact the primary array, because some edgepoints have been removed.
  CompactEdgepointArray(psArray1, pusMiddleIndex1, pusArraySize1);
  (psArray2.value) = (psArray2.value).slice(0, pusArraySize2.value);
}

function ClassifyEdgepoints(): void {
  let Soldier: SOLDIERTYPE = createSoldierType();
  let sGridNo: INT16 = -1;

  Soldier.bTeam = 1;

  // north
  if (gMapInformation.sNorthGridNo != -1) {
    sGridNo = FindNearestEdgepointOnSpecifiedEdge(gMapInformation.sNorthGridNo, Enum291.NORTH_EDGEPOINT_SEARCH);
    if (sGridNo != NOWHERE) {
      InternallyClassifyEdgepoints(Soldier, sGridNo, createPointer(() => gps1stNorthEdgepointArray, (v) => gps1stNorthEdgepointArray = v), createPointer(() => gus1stNorthEdgepointMiddleIndex, (v) => gus1stNorthEdgepointMiddleIndex = v), createPointer(() => gus1stNorthEdgepointArraySize, (v) => gus1stNorthEdgepointArraySize = v), createPointer(() => gps2ndNorthEdgepointArray, (v) => gps2ndNorthEdgepointArray = v), createPointer(() => gus2ndNorthEdgepointMiddleIndex, (v) => gus2ndNorthEdgepointMiddleIndex = v), createPointer(() => gus2ndNorthEdgepointArraySize, (v) => gus2ndNorthEdgepointArraySize = v));
    }
  }
  // east
  if (gMapInformation.sEastGridNo != -1) {
    sGridNo = FindNearestEdgepointOnSpecifiedEdge(gMapInformation.sEastGridNo, Enum291.EAST_EDGEPOINT_SEARCH);
    if (sGridNo != NOWHERE) {
      InternallyClassifyEdgepoints(Soldier, sGridNo, createPointer(() => gps1stEastEdgepointArray, (v) => gps1stEastEdgepointArray = v), createPointer(() => gus1stEastEdgepointMiddleIndex, (v) => gus1stEastEdgepointMiddleIndex = v), createPointer(() => gus1stEastEdgepointArraySize, (v) => gus1stEastEdgepointArraySize = v), createPointer(() => gps2ndEastEdgepointArray, (v) => gps2ndEastEdgepointArray = v), createPointer(() => gus2ndEastEdgepointMiddleIndex, (v) => gus2ndEastEdgepointMiddleIndex = v), createPointer(() => gus2ndEastEdgepointArraySize, (v) => gus2ndEastEdgepointArraySize = v));
    }
  }
  // south
  if (gMapInformation.sSouthGridNo != -1) {
    sGridNo = FindNearestEdgepointOnSpecifiedEdge(gMapInformation.sSouthGridNo, Enum291.SOUTH_EDGEPOINT_SEARCH);
    if (sGridNo != NOWHERE) {
      InternallyClassifyEdgepoints(Soldier, sGridNo, createPointer(() => gps1stSouthEdgepointArray, (v) => gps1stSouthEdgepointArray = v), createPointer(() => gus1stSouthEdgepointMiddleIndex, (v) => gus1stSouthEdgepointMiddleIndex = v), createPointer(() => gus1stSouthEdgepointArraySize, (v) => gus1stSouthEdgepointArraySize = v), createPointer(() => gps2ndSouthEdgepointArray, (v) => gps2ndSouthEdgepointArray = v), createPointer(() => gus2ndSouthEdgepointMiddleIndex, (v) => gus2ndSouthEdgepointMiddleIndex = v), createPointer(() => gus2ndSouthEdgepointArraySize, (v) => gus2ndSouthEdgepointArraySize = v));
    }
  }
  // west
  if (gMapInformation.sWestGridNo != -1) {
    sGridNo = FindNearestEdgepointOnSpecifiedEdge(gMapInformation.sWestGridNo, Enum291.WEST_EDGEPOINT_SEARCH);
    if (sGridNo != NOWHERE) {
      InternallyClassifyEdgepoints(Soldier, sGridNo, createPointer(() => gps1stWestEdgepointArray, (v) => gps1stWestEdgepointArray = v), createPointer(() => gus1stWestEdgepointMiddleIndex, (v) => gus1stWestEdgepointMiddleIndex = v), createPointer(() => gus1stWestEdgepointArraySize, (v) => gus1stWestEdgepointArraySize = v), createPointer(() => gps2ndWestEdgepointArray, (v) => gps2ndWestEdgepointArray = v), createPointer(() => gus2ndWestEdgepointMiddleIndex, (v) => gus2ndWestEdgepointMiddleIndex = v), createPointer(() => gus2ndWestEdgepointArraySize, (v) => gus2ndWestEdgepointArraySize = v));
    }
  }
}

export function GenerateMapEdgepoints(): void {
  let i: INT32 = -1;
  let sGridNo: INT16 = -1;
  let sVGridNo: INT16[] /* [400] */ = createArray(400, 0);
  let gubSaveNPCAPBudget: UINT8 = 0;
  let gubSaveNPCDistLimit: UINT8 = 0;

  // Get rid of the current edgepoint lists.
  TrashMapEdgepoints();

  gfGeneratingMapEdgepoints = true;

  if (gMapInformation.sNorthGridNo != -1)
    sGridNo = gMapInformation.sNorthGridNo;
  else if (gMapInformation.sEastGridNo != -1)
    sGridNo = gMapInformation.sEastGridNo;
  else if (gMapInformation.sSouthGridNo != -1)
    sGridNo = gMapInformation.sSouthGridNo;
  else if (gMapInformation.sWestGridNo != -1)
    sGridNo = gMapInformation.sWestGridNo;
  else if (gMapInformation.sCenterGridNo != -1)
    sGridNo = gMapInformation.sCenterGridNo;
  else
    return;

  GlobalReachableTest(sGridNo);

  // Calculate the north edges
  if (gMapInformation.sNorthGridNo != -1) {
    // 1st row
    sGridNo = gsTLGridNo;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stNorthEdgepointArraySize++] = sGridNo;
    while (sGridNo > gsTRGridNo) {
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stNorthEdgepointArraySize++] = sGridNo;
      sGridNo -= 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stNorthEdgepointArraySize++] = sGridNo;
    }
    // 2nd row
    gus1stNorthEdgepointMiddleIndex = gus1stNorthEdgepointArraySize;
    sGridNo = gsTLGridNo + 161;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stNorthEdgepointArraySize++] = sGridNo;
    while (sGridNo > gsTRGridNo + 161) {
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stNorthEdgepointArraySize++] = sGridNo;
      sGridNo -= 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stNorthEdgepointArraySize++] = sGridNo;
    }
    if (gus1stNorthEdgepointArraySize) {
      // Allocate and copy over the valid gridnos.
      gps1stNorthEdgepointArray = createArray(gus1stNorthEdgepointArraySize, 0);
      for (i = 0; i < gus1stNorthEdgepointArraySize; i++)
        gps1stNorthEdgepointArray[i] = sVGridNo[i];
    }
  }
  // Calculate the east edges
  if (gMapInformation.sEastGridNo != -1) {
    // 1st row
    sGridNo = gsTRGridNo;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stEastEdgepointArraySize++] = sGridNo;
    while (sGridNo < gsBRGridNo) {
      sGridNo += 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stEastEdgepointArraySize++] = sGridNo;
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stEastEdgepointArraySize++] = sGridNo;
    }
    // 2nd row
    gus1stEastEdgepointMiddleIndex = gus1stEastEdgepointArraySize;
    sGridNo = gsTRGridNo + 159;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stEastEdgepointArraySize++] = sGridNo;
    while (sGridNo < gsBRGridNo + 159) {
      sGridNo += 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stEastEdgepointArraySize++] = sGridNo;
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stEastEdgepointArraySize++] = sGridNo;
    }
    if (gus1stEastEdgepointArraySize) {
      // Allocate and copy over the valid gridnos.
      gps1stEastEdgepointArray = createArray(gus1stEastEdgepointArraySize, 0);
      for (i = 0; i < gus1stEastEdgepointArraySize; i++)
        gps1stEastEdgepointArray[i] = sVGridNo[i];
    }
  }
  // Calculate the south edges
  if (gMapInformation.sSouthGridNo != -1) {
    // 1st row
    sGridNo = gsBLGridNo;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stSouthEdgepointArraySize++] = sGridNo;
    while (sGridNo > gsBRGridNo) {
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stSouthEdgepointArraySize++] = sGridNo;
      sGridNo -= 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stSouthEdgepointArraySize++] = sGridNo;
    }
    // 2nd row
    gus1stSouthEdgepointMiddleIndex = gus1stSouthEdgepointArraySize;
    sGridNo = gsBLGridNo - 161;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stSouthEdgepointArraySize++] = sGridNo;
    while (sGridNo > gsBRGridNo - 161) {
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stSouthEdgepointArraySize++] = sGridNo;
      sGridNo -= 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stSouthEdgepointArraySize++] = sGridNo;
    }
    if (gus1stSouthEdgepointArraySize) {
      // Allocate and copy over the valid gridnos.
      gps1stSouthEdgepointArray = createArray(gus1stSouthEdgepointArraySize, 0);
      for (i = 0; i < gus1stSouthEdgepointArraySize; i++)
        gps1stSouthEdgepointArray[i] = sVGridNo[i];
    }
  }
  // Calculate the west edges
  if (gMapInformation.sWestGridNo != -1) {
    // 1st row
    sGridNo = gsTLGridNo;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stWestEdgepointArraySize++] = sGridNo;
    while (sGridNo < gsBLGridNo) {
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stWestEdgepointArraySize++] = sGridNo;
      sGridNo += 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stWestEdgepointArraySize++] = sGridNo;
    }
    // 2nd row
    gus1stWestEdgepointMiddleIndex = gus1stWestEdgepointArraySize;
    sGridNo = gsTLGridNo - 159;
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
      sVGridNo[gus1stWestEdgepointArraySize++] = sGridNo;
    while (sGridNo < gsBLGridNo - 159) {
      sGridNo++;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stWestEdgepointArraySize++] = sGridNo;
      sGridNo += 160;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus1stWestEdgepointArraySize++] = sGridNo;
    }
    if (gus1stWestEdgepointArraySize) {
      // Allocate and copy over the valid gridnos.
      gps1stWestEdgepointArray = createArray(gus1stWestEdgepointArraySize, 0);
      for (i = 0; i < gus1stWestEdgepointArraySize; i++)
        gps1stWestEdgepointArray[i] = sVGridNo[i];
    }
  }

  // CHECK FOR ISOLATED EDGEPOINTS (but only if the entrypoint is ISOLATED!!!)
  if (gMapInformation.sIsolatedGridNo != -1 && !(gpWorldLevelData[gMapInformation.sIsolatedGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
    GlobalReachableTest(gMapInformation.sIsolatedGridNo);
    if (gMapInformation.sNorthGridNo != -1) {
      // 1st row
      sGridNo = gsTLGridNo;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndNorthEdgepointArraySize++] = sGridNo;
      while (sGridNo > gsTRGridNo) {
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndNorthEdgepointArraySize++] = sGridNo;
        sGridNo -= 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndNorthEdgepointArraySize++] = sGridNo;
      }
      // 2nd row
      gus2ndNorthEdgepointMiddleIndex = gus2ndNorthEdgepointArraySize;
      sGridNo = gsTLGridNo + 161;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndNorthEdgepointArraySize++] = sGridNo;
      while (sGridNo > gsTRGridNo + 161) {
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndNorthEdgepointArraySize++] = sGridNo;
        sGridNo -= 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndNorthEdgepointArraySize++] = sGridNo;
      }
      if (gus2ndNorthEdgepointArraySize) {
        // Allocate and copy over the valid gridnos.
        gps2ndNorthEdgepointArray = createArray(gus2ndNorthEdgepointArraySize, 0);
        for (i = 0; i < gus2ndNorthEdgepointArraySize; i++)
          gps2ndNorthEdgepointArray[i] = sVGridNo[i];
      }
    }
    // Calculate the east edges
    if (gMapInformation.sEastGridNo != -1) {
      // 1st row
      sGridNo = gsTRGridNo;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndEastEdgepointArraySize++] = sGridNo;
      while (sGridNo < gsBRGridNo) {
        sGridNo += 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndEastEdgepointArraySize++] = sGridNo;
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndEastEdgepointArraySize++] = sGridNo;
      }
      // 2nd row
      gus2ndEastEdgepointMiddleIndex = gus2ndEastEdgepointArraySize;
      sGridNo = gsTRGridNo + 159;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndEastEdgepointArraySize++] = sGridNo;
      while (sGridNo < gsBRGridNo + 159) {
        sGridNo += 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndEastEdgepointArraySize++] = sGridNo;
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndEastEdgepointArraySize++] = sGridNo;
      }
      if (gus2ndEastEdgepointArraySize) {
        // Allocate and copy over the valid gridnos.
        gps2ndEastEdgepointArray = createArray(gus2ndEastEdgepointArraySize, 0);
        for (i = 0; i < gus2ndEastEdgepointArraySize; i++)
          gps2ndEastEdgepointArray[i] = sVGridNo[i];
      }
    }
    // Calculate the south edges
    if (gMapInformation.sSouthGridNo != -1) {
      // 1st row
      sGridNo = gsBLGridNo;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndSouthEdgepointArraySize++] = sGridNo;
      while (sGridNo > gsBRGridNo) {
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndSouthEdgepointArraySize++] = sGridNo;
        sGridNo -= 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndSouthEdgepointArraySize++] = sGridNo;
      }
      // 2nd row
      gus2ndSouthEdgepointMiddleIndex = gus2ndSouthEdgepointArraySize;
      sGridNo = gsBLGridNo - 161;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndSouthEdgepointArraySize++] = sGridNo;
      while (sGridNo > gsBRGridNo - 161) {
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndSouthEdgepointArraySize++] = sGridNo;
        sGridNo -= 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndSouthEdgepointArraySize++] = sGridNo;
      }
      if (gus2ndSouthEdgepointArraySize) {
        // Allocate and copy over the valid gridnos.
        gps2ndSouthEdgepointArray = createArray(gus2ndSouthEdgepointArraySize, 0);
        for (i = 0; i < gus2ndSouthEdgepointArraySize; i++)
          gps2ndSouthEdgepointArray[i] = sVGridNo[i];
      }
    }
    // Calculate the west edges
    if (gMapInformation.sWestGridNo != -1) {
      // 1st row
      sGridNo = gsTLGridNo;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndWestEdgepointArraySize++] = sGridNo;
      while (sGridNo < gsBLGridNo) {
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndWestEdgepointArraySize++] = sGridNo;
        sGridNo += 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndWestEdgepointArraySize++] = sGridNo;
      }
      // 2nd row
      gus2ndWestEdgepointMiddleIndex = gus2ndWestEdgepointArraySize;
      sGridNo = gsTLGridNo - 159;
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
        sVGridNo[gus2ndWestEdgepointArraySize++] = sGridNo;
      while (sGridNo < gsBLGridNo - 159) {
        sGridNo++;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndWestEdgepointArraySize++] = sGridNo;
        sGridNo += 160;
        if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE && (!gubWorldRoomInfo[sGridNo] || gfBasement))
          sVGridNo[gus2ndWestEdgepointArraySize++] = sGridNo;
      }
      if (gus2ndWestEdgepointArraySize) {
        // Allocate and copy over the valid gridnos.
        gps2ndWestEdgepointArray = createArray(gus2ndWestEdgepointArraySize, 0);
        for (i = 0; i < gus2ndWestEdgepointArraySize; i++)
          gps2ndWestEdgepointArray[i] = sVGridNo[i];
      }
    }
  }

  // Eliminates any edgepoints not accessible to the edge of the world.  This is done to the primary edgepoints
  ValidateEdgepoints();
  // Second step is to process the primary edgepoints and determine if any of the edgepoints aren't accessible from
  // the associated entrypoint.  These edgepoints that are rejected are placed in the secondary list.
  if (gMapInformation.sIsolatedGridNo != -1) {
    // only if there is an isolated gridno in the map.  There is a flaw in the design of this system.  The classification
    // process will automatically assign areas to be isolated if there is an obstacle between one normal edgepoint and another
    // causing a 5 tile connection check to fail.  So, all maps with isolated edgepoints will need to be checked manually to
    // make sure there are no obstacles causing this to happen (except for obstacles between normal areas and the isolated area)

    // Good thing most maps don't have isolated sections.  This is one expensive function to call!  Maybe 200MI!
    ClassifyEdgepoints();
  }

  gfGeneratingMapEdgepoints = false;
}

export function SaveMapEdgepoints(fp: HWFILE): void {
  let sizeBuffer: Buffer;
  let dataBuffer: Buffer;

  sizeBuffer = Buffer.allocUnsafe(2);

  // 1st priority edgepoints -- for common entry -- tactical placement gui uses only these points.
  sizeBuffer.writeUInt16LE(gus1stNorthEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus1stNorthEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus1stNorthEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus1stNorthEdgepointArraySize * 2);
    writeIntArray(gps1stNorthEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus1stNorthEdgepointArraySize * 2);
  }

  sizeBuffer.writeUInt16LE(gus1stEastEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus1stEastEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus1stEastEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus1stEastEdgepointArraySize * 2);
    writeIntArray(gps1stEastEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus1stEastEdgepointArraySize * 2);
  }

  sizeBuffer.writeUInt16LE(gus1stSouthEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus1stSouthEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus1stSouthEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus1stSouthEdgepointArraySize * 2);
    writeIntArray(gps1stSouthEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus1stSouthEdgepointArraySize * 2);
  }

  sizeBuffer.writeUInt16LE(gus1stWestEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus1stWestEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);
  if (gus1stWestEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus1stWestEdgepointArraySize * 2);
    writeIntArray(gps1stWestEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus1stWestEdgepointArraySize * 2);
  }
  // 2nd priority edgepoints -- for isolated areas.  Okay to be zero

  sizeBuffer.writeUInt16LE(gus2ndNorthEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus2ndNorthEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus2ndNorthEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus2ndNorthEdgepointArraySize * 2);
    writeIntArray(gps2ndNorthEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus2ndNorthEdgepointArraySize * 2);
  }

  sizeBuffer.writeUInt16LE(gus2ndEastEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus2ndEastEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus2ndEastEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus2ndEastEdgepointArraySize * 2);
    writeIntArray(gps2ndEastEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus2ndEastEdgepointArraySize * 2);
  }

  sizeBuffer.writeUInt16LE(gus2ndSouthEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus2ndSouthEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus2ndSouthEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus2ndSouthEdgepointArraySize * 2);
    writeIntArray(gps2ndSouthEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus2ndSouthEdgepointArraySize * 2);
  }

  sizeBuffer.writeUInt16LE(gus2ndWestEdgepointArraySize, 0);
  FileWrite(fp, sizeBuffer, 2);

  sizeBuffer.writeUInt16LE(gus2ndWestEdgepointMiddleIndex, 0);
  FileWrite(fp, sizeBuffer, 2);

  if (gus2ndWestEdgepointArraySize) {
    dataBuffer = Buffer.allocUnsafe(gus2ndWestEdgepointArraySize * 2);
    writeIntArray(gps2ndWestEdgepointArray, dataBuffer, 0, 2);
    FileWrite(fp, dataBuffer, gus2ndWestEdgepointArraySize * 2);
  }
}

function OldLoadMapEdgepoints(buffer: Buffer, offset: number): number {
  gus1stNorthEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stNorthEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stNorthEdgepointArraySize) {
    gps1stNorthEdgepointArray = createArray(gus1stNorthEdgepointArraySize, 0);
    offset = readIntArray(gps1stNorthEdgepointArray, buffer, offset, 2)
  }
  gus1stEastEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stEastEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stEastEdgepointArraySize) {
    gps1stEastEdgepointArray = createArray(gus1stEastEdgepointArraySize, 0);
    offset = readIntArray(gps1stEastEdgepointArray, buffer, offset, 2)
  }
  gus1stSouthEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stSouthEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stSouthEdgepointArraySize) {
    gps1stSouthEdgepointArray = createArray(gus1stSouthEdgepointArraySize, 0);
    offset = readIntArray(gps1stSouthEdgepointArray, buffer, offset, 2)
  }
  gus1stWestEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stWestEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stWestEdgepointArraySize) {
    gps1stWestEdgepointArray = createArray(gus1stWestEdgepointArraySize, 0);
    offset = readIntArray(gps1stWestEdgepointArray, buffer, offset, 2)
  }
  return offset;
}

export function LoadMapEdgepoints(buffer: Buffer, offset: number): { result: boolean, offset: number } {
  TrashMapEdgepoints();
  if (gMapInformation.ubMapVersion < 17) {
    // To prevent invalidation of older maps, which only used one layer of edgepoints, and a UINT8 for
    // containing the size, we will preserve that paradigm, then kill the loaded edgepoints and
    // regenerate them.
    offset = OldLoadMapEdgepoints(buffer, offset);
    TrashMapEdgepoints();
    return { result: false, offset };
  }
  gus1stNorthEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stNorthEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stNorthEdgepointArraySize) {
    gps1stNorthEdgepointArray = createArray(gus1stNorthEdgepointArraySize, 0);
    offset = readIntArray(gps1stNorthEdgepointArray, buffer, offset, 2);
  }
  gus1stEastEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stEastEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stEastEdgepointArraySize) {
    gps1stEastEdgepointArray = createArray(gus1stEastEdgepointArraySize, 0);
    offset = readIntArray(gps1stEastEdgepointArray, buffer, offset, 2);
  }
  gus1stSouthEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stSouthEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stSouthEdgepointArraySize) {
    gps1stSouthEdgepointArray = createArray(gus1stSouthEdgepointArraySize, 0);
    offset = readIntArray(gps1stSouthEdgepointArray, buffer, offset, 2);
  }
  gus1stWestEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus1stWestEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus1stWestEdgepointArraySize) {
    gps1stWestEdgepointArray = createArray(gus1stWestEdgepointArraySize, 0);
    offset = readIntArray(gps1stWestEdgepointArray, buffer, offset, 2);
  }

  gus2ndNorthEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus2ndNorthEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus2ndNorthEdgepointArraySize) {
    gps2ndNorthEdgepointArray = createArray(gus2ndNorthEdgepointArraySize, 0);
    offset = readIntArray(gps2ndNorthEdgepointArray, buffer, offset, 2);
  }
  gus2ndEastEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus2ndEastEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus2ndEastEdgepointArraySize) {
    gps2ndEastEdgepointArray = createArray(gus2ndEastEdgepointArraySize, 0);
    offset = readIntArray(gps2ndEastEdgepointArray, buffer, offset, 2);
  }
  gus2ndSouthEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus2ndSouthEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus2ndSouthEdgepointArraySize) {
    gps2ndSouthEdgepointArray = createArray(gus2ndSouthEdgepointArraySize, 0);
    offset = readIntArray(gps2ndSouthEdgepointArray, buffer, offset, 2);
  }
  gus2ndWestEdgepointArraySize = buffer.readUInt16LE(offset); offset += 2;
  gus2ndWestEdgepointMiddleIndex = buffer.readUInt16LE(offset); offset += 2;
  if (gus2ndWestEdgepointArraySize) {
    gps2ndWestEdgepointArray = createArray(gus2ndWestEdgepointArraySize, 0);
    offset = readIntArray(gps2ndWestEdgepointArray, buffer, offset, 2);
  }
  if (gMapInformation.ubMapVersion < 22) {
    // regenerate them.
    TrashMapEdgepoints();
    return { result: false, offset };
  }

  return { result: true, offset };
}

export function ChooseMapEdgepoint(ubStrategicInsertionCode: UINT8): UINT16 {
  let psArray: INT16[];
  let usArraySize: UINT16 = 0;
  /* static */ let randomVal: INT32 = 0;

  // First validate and get access to the correct array based on strategic direction.
  // We will use the selected array to choose insertion gridno's.
  switch (ubStrategicInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      psArray = gps1stNorthEdgepointArray;
      usArraySize = gus1stNorthEdgepointArraySize;
      break;
    case Enum175.INSERTION_CODE_EAST:
      psArray = gps1stEastEdgepointArray;
      usArraySize = gus1stEastEdgepointArraySize;
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      psArray = gps1stSouthEdgepointArray;
      usArraySize = gus1stSouthEdgepointArraySize;
      break;
    case Enum175.INSERTION_CODE_WEST:
      psArray = gps1stWestEdgepointArray;
      usArraySize = gus1stWestEdgepointArraySize;
      break;
    default:
      AssertMsg(false, "ChooseMapEdgepoints:  Failed to pass a valid strategic insertion code.");
      break;
  }
  if (!usArraySize) {
    return NOWHERE;
  }
  return psArray[Random(usArraySize)];
}

export function ChooseMapEdgepoints(pMapEdgepointInfo: MAPEDGEPOINTINFO, ubStrategicInsertionCode: UINT8, ubNumDesiredPoints: UINT8): void {
  let psArray: INT16[];
  let usArraySize: UINT16 = 0;
  let i: INT32 = -1;
  let usSlots: UINT16;
  let usCurrSlot: UINT16;
  let psTempArray: INT16[];

  AssertMsg(ubNumDesiredPoints > 0 && ubNumDesiredPoints <= 32, FormatString("ChooseMapEdgepoints:  Desired points = %d, valid range is 1-32", ubNumDesiredPoints));
  // First validate and get access to the correct array based on strategic direction.
  // We will use the selected array to choose insertion gridno's.
  switch (ubStrategicInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      psArray = gps1stNorthEdgepointArray;
      usArraySize = gus1stNorthEdgepointArraySize;
      break;
    case Enum175.INSERTION_CODE_EAST:
      psArray = gps1stEastEdgepointArray;
      usArraySize = gus1stEastEdgepointArraySize;
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      psArray = gps1stSouthEdgepointArray;
      usArraySize = gus1stSouthEdgepointArraySize;
      break;
    case Enum175.INSERTION_CODE_WEST:
      psArray = gps1stWestEdgepointArray;
      usArraySize = gus1stWestEdgepointArraySize;
      break;
    default:
      AssertMsg(false, "ChooseMapEdgepoints:  Failed to pass a valid strategic insertion code.");
      break;
  }
  pMapEdgepointInfo.ubStrategicInsertionCode = ubStrategicInsertionCode;
  if (!usArraySize) {
    pMapEdgepointInfo.ubNumPoints = 0;
    return;
  }

  // JA2 Gold: don't place people in the water.
  // If any of the waypoints is on a water spot, we're going to have to remove it
  psTempArray = createArray(usArraySize, 0);
  copyArray(psTempArray, psArray);
  psArray = psTempArray;
  for (i = 0; i < usArraySize; i++) {
    if (GetTerrainType(psArray[i]) == Enum315.MED_WATER || GetTerrainType(psArray[i]) == Enum315.DEEP_WATER) {
      if (i == usArraySize - 1) {
        // just axe it and we're done.
        psArray[i] = 0;
        usArraySize--;
        break;
      } else {
        // replace this element in the array with the LAST element in the array, then decrement
        // the array size
        psArray[i] = psArray[usArraySize - 1];
        usArraySize--;
        // we're going to have to check the array element we just copied into this spot, too
        i--;
      }
    }
  }

  if (ubNumDesiredPoints >= usArraySize) {
    // We don't have enough points for everyone, return them all.
    pMapEdgepointInfo.ubNumPoints = usArraySize;
    for (i = 0; i < usArraySize; i++)
      pMapEdgepointInfo.sGridNo[i] = psArray[i];

    return;
  }
  // We have more points, so choose them randomly.
  usSlots = usArraySize;
  usCurrSlot = 0;
  pMapEdgepointInfo.ubNumPoints = ubNumDesiredPoints;
  for (i = 0; i < usArraySize; i++) {
    if (Random(usSlots) < ubNumDesiredPoints) {
      pMapEdgepointInfo.sGridNo[usCurrSlot++] = psArray[i];
      ubNumDesiredPoints--;
    }
    usSlots--;
  }
}

let gpReservedGridNos: INT16[] = <INT16[]><unknown>null;
let gsReservedIndex: INT16 = 0;

export function BeginMapEdgepointSearch(): void {
  let sGridNo: INT16;

  // Create the reserved list
  AssertMsg(!gpReservedGridNos, "Attempting to BeginMapEdgepointSearch that has already been created.");
  gpReservedGridNos = createArray(20, 0);
  Assert(gpReservedGridNos);
  gsReservedIndex = 0;

  if (gMapInformation.sNorthGridNo != -1)
    sGridNo = gMapInformation.sNorthGridNo;
  else if (gMapInformation.sEastGridNo != -1)
    sGridNo = gMapInformation.sEastGridNo;
  else if (gMapInformation.sSouthGridNo != -1)
    sGridNo = gMapInformation.sSouthGridNo;
  else if (gMapInformation.sWestGridNo != -1)
    sGridNo = gMapInformation.sWestGridNo;
  else
    return;

  GlobalReachableTest(sGridNo);

  // Now, we have the path values calculated.  Now, we can check for closest edgepoints.
}

export function EndMapEdgepointSearch(): void {
  AssertMsg(gpReservedGridNos, "Attempting to EndMapEdgepointSearch that has already been removed.");
  gpReservedGridNos = <INT16[]><unknown>null;
  gsReservedIndex = 0;
}

// THIS CODE ISN'T RECOMMENDED FOR TIME CRITICAL AREAS.
export function SearchForClosestPrimaryMapEdgepoint(sGridNo: INT16, ubInsertionCode: UINT8): INT16 {
  let i: INT32;
  let iDirectionLoop: INT32;
  let psArray: INT16[];
  let sRadius: INT16;
  let sDistance: INT16;
  let sDirection: INT16;
  let sOriginalGridNo: INT16;
  let usArraySize: UINT16 = 0;
  let fReserved: boolean;

  if (gsReservedIndex >= 20) {
    // Everything is reserved.
    AssertMsg(0, "All closest map edgepoints have been reserved.  We should only have 20 soldiers maximum...");
  }
  switch (ubInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      psArray = gps1stNorthEdgepointArray;
      usArraySize = gus1stNorthEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any north mapedgepoints. LC:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    case Enum175.INSERTION_CODE_EAST:
      psArray = gps1stEastEdgepointArray;
      usArraySize = gus1stEastEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any east mapedgepoints. LC:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      psArray = gps1stSouthEdgepointArray;
      usArraySize = gus1stSouthEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any south mapedgepoints. LC:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    case Enum175.INSERTION_CODE_WEST:
      psArray = gps1stWestEdgepointArray;
      usArraySize = gus1stWestEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any west mapedgepoints. LC:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    default:
      Assert(false);
  }
  if (!usArraySize) {
    return NOWHERE;
  }

  // Check the initial gridno, to see if it is available and an edgepoint.
  fReserved = false;
  for (i = 0; i < gsReservedIndex; i++) {
    if (gpReservedGridNos[i] == sGridNo) {
      fReserved = true;
      break;
    }
  }
  if (!fReserved) {
    // Not reserved, so see if we can find this gridno in the edgepoint array.
    for (i = 0; i < usArraySize; i++) {
      if (psArray[i] == sGridNo) {
        // Yes, the gridno is in the edgepoint array.
        gpReservedGridNos[gsReservedIndex] = sGridNo;
        gsReservedIndex++;
        return sGridNo;
      }
    }
  }

  // spiral outwards, until we find an unreserved mapedgepoint.
  //
  // 09 08 07 06
  // 10	01 00 05
  // 11 02 03 04
  // 12 13 14 15 ..
  sRadius = 1;
  sDirection = WORLD_COLS;
  sOriginalGridNo = sGridNo;
  while (sRadius < (gbWorldSectorZ ? 30 : 10)) {
    sGridNo = sOriginalGridNo + (-1 - WORLD_COLS) * sRadius; // start at the TOP-LEFT gridno
    for (iDirectionLoop = 0; iDirectionLoop < 4; iDirectionLoop++) {
      switch (iDirectionLoop) {
        case 0:
          sDirection = WORLD_COLS;
          break;
        case 1:
          sDirection = 1;
          break;
        case 2:
          sDirection = -WORLD_COLS;
          break;
        case 3:
          sDirection = -1;
          break;
      }
      sDistance = sRadius * 2;
      while (sDistance--) {
        sGridNo += sDirection;
        if (sGridNo < 0 || sGridNo >= WORLD_MAX)
          continue;
        // Check the gridno, to see if it is available and an edgepoint.
        fReserved = false;
        for (i = 0; i < gsReservedIndex; i++) {
          if (gpReservedGridNos[i] == sGridNo) {
            fReserved = true;
            break;
          }
        }
        if (!fReserved) {
          // Not reserved, so see if we can find this gridno in the edgepoint array.
          for (i = 0; i < usArraySize; i++) {
            if (psArray[i] == sGridNo) {
              // Yes, the gridno is in the edgepoint array.
              gpReservedGridNos[gsReservedIndex] = sGridNo;
              gsReservedIndex++;
              return sGridNo;
            }
          }
        }
      }
    }
    sRadius++;
  }
  return NOWHERE;
}

export function SearchForClosestSecondaryMapEdgepoint(sGridNo: INT16, ubInsertionCode: UINT8): INT16 {
  let i: INT32;
  let iDirectionLoop: INT32;
  let psArray: INT16[];
  let sRadius: INT16;
  let sDistance: INT16;
  let sDirection: INT16;
  let sOriginalGridNo: INT16;
  let usArraySize: UINT16 = 0;
  let fReserved: boolean;

  if (gsReservedIndex >= 20) {
    // Everything is reserved.
    AssertMsg(false, "All closest map edgepoints have been reserved.  We should only have 20 soldiers maximum...");
  }
  switch (ubInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      psArray = gps2ndNorthEdgepointArray;
      usArraySize = gus2ndNorthEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any isolated north mapedgepoints. KM:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    case Enum175.INSERTION_CODE_EAST:
      psArray = gps2ndEastEdgepointArray;
      usArraySize = gus2ndEastEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any isolated east mapedgepoints. KM:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      psArray = gps2ndSouthEdgepointArray;
      usArraySize = gus2ndSouthEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any isolated south mapedgepoints. KM:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    case Enum175.INSERTION_CODE_WEST:
      psArray = gps2ndWestEdgepointArray;
      usArraySize = gus2ndWestEdgepointArraySize;
      if (!usArraySize)
        AssertMsg(false, FormatString("Sector %c%d level %d doesn't have any isolated west mapedgepoints. KM:1", String.fromCharCode(gWorldSectorY + 'A'.charCodeAt(0) - 1), gWorldSectorX, gbWorldSectorZ));
      break;
    default:
      Assert(false);
  }
  if (!usArraySize) {
    return NOWHERE;
  }

  // Check the initial gridno, to see if it is available and an edgepoint.
  fReserved = false;
  for (i = 0; i < gsReservedIndex; i++) {
    if (gpReservedGridNos[i] == sGridNo) {
      fReserved = true;
      break;
    }
  }
  if (!fReserved) {
    // Not reserved, so see if we can find this gridno in the edgepoint array.
    for (i = 0; i < usArraySize; i++) {
      if (psArray[i] == sGridNo) {
        // Yes, the gridno is in the edgepoint array.
        gpReservedGridNos[gsReservedIndex] = sGridNo;
        gsReservedIndex++;
        return sGridNo;
      }
    }
  }

  // spiral outwards, until we find an unreserved mapedgepoint.
  //
  // 09 08 07 06
  // 10	01 00 05
  // 11 02 03 04
  // 12 13 14 15 ..
  sRadius = 1;
  sDirection = WORLD_COLS;
  sOriginalGridNo = sGridNo;
  while (sRadius < (gbWorldSectorZ ? 30 : 10)) {
    sGridNo = sOriginalGridNo + (-1 - WORLD_COLS) * sRadius; // start at the TOP-LEFT gridno
    for (iDirectionLoop = 0; iDirectionLoop < 4; iDirectionLoop++) {
      switch (iDirectionLoop) {
        case 0:
          sDirection = WORLD_COLS;
          break;
        case 1:
          sDirection = 1;
          break;
        case 2:
          sDirection = -WORLD_COLS;
          break;
        case 3:
          sDirection = -1;
          break;
      }
      sDistance = sRadius * 2;
      while (sDistance--) {
        sGridNo += sDirection;
        if (sGridNo < 0 || sGridNo >= WORLD_MAX)
          continue;
        // Check the gridno, to see if it is available and an edgepoint.
        fReserved = false;
        for (i = 0; i < gsReservedIndex; i++) {
          if (gpReservedGridNos[i] == sGridNo) {
            fReserved = true;
            break;
          }
        }
        if (!fReserved) {
          // Not reserved, so see if we can find this gridno in the edgepoint array.
          for (i = 0; i < usArraySize; i++) {
            if (psArray[i] == sGridNo) {
              // Yes, the gridno is in the edgepoint array.
              gpReservedGridNos[gsReservedIndex] = sGridNo;
              gsReservedIndex++;
              return sGridNo;
            }
          }
        }
      }
    }
    sRadius++;
  }
  return NOWHERE;
}

const EDGE_OF_MAP_SEARCH = 5;
function VerifyEdgepoint(pSoldier: SOLDIERTYPE, sEdgepoint: INT16): boolean {
  let iSearchRange: INT32;
  let sMaxLeft: INT16;
  let sMaxRight: INT16;
  let sMaxUp: INT16;
  let sMaxDown: INT16;
  let sXOffset: INT16;
  let sYOffset: INT16;
  let sGridNo: INT16;
  let bDirection: INT8 = 0;
  let bDirection__Pointer = createPointer(() => bDirection, (v) => bDirection = v);

  pSoldier.sGridNo = sEdgepoint;

  iSearchRange = EDGE_OF_MAP_SEARCH;

  // determine maximum horizontal limits
  sMaxLeft = Math.min(iSearchRange, (pSoldier.sGridNo % MAXCOL));
  // NumMessage("sMaxLeft = ",sMaxLeft);
  sMaxRight = Math.min(iSearchRange, MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1));
  // NumMessage("sMaxRight = ",sMaxRight);

  // determine maximum vertical limits
  sMaxUp = Math.min(iSearchRange, (pSoldier.sGridNo / MAXROW));
  // NumMessage("sMaxUp = ",sMaxUp);
  sMaxDown = Math.min(iSearchRange, MAXROW - ((pSoldier.sGridNo / MAXROW) + 1));

  // Call FindBestPath to set flags in all locations that we can
  // walk into within range.  We have to set some things up first...

  // set the distance limit of the square region
  gubNPCDistLimit = EDGE_OF_MAP_SEARCH;

  // reset the "reachable" flags in the region we're looking at
  for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
    for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
      sGridNo = sEdgepoint + sXOffset + (MAXCOL * sYOffset);
      gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_REACHABLE);
    }
  }

  FindBestPath(pSoldier, NOWHERE, pSoldier.bLevel, Enum193.WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE);

  // Turn off the "reachable" flag for the current location
  // so we don't consider it
  // gpWorldLevelData[sEdgepoint].uiFlags &= ~(MAPELEMENT_REACHABLE);

  // SET UP DOUBLE-LOOP TO STEP THROUGH POTENTIAL GRID #s
  for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
    for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
      // calculate the next potential gridno
      sGridNo = sEdgepoint + sXOffset + (MAXCOL * sYOffset);

      if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
        continue;
      }

      if (GridNoOnEdgeOfMap(sGridNo, bDirection__Pointer)) {
        // ok!
        return true;
      }
    }
  }

  // no spots right on edge of map within 5 tiles
  return false;
}

function EdgepointsClose(pSoldier: SOLDIERTYPE, sEdgepoint1: INT16, sEdgepoint2: INT16): boolean {
  let iSearchRange: INT32;
  let sMaxLeft: INT16;
  let sMaxRight: INT16;
  let sMaxUp: INT16;
  let sMaxDown: INT16;
  let sXOffset: INT16;
  let sYOffset: INT16;
  let sGridNo: INT16;

  pSoldier.sGridNo = sEdgepoint1;

  if (gWorldSectorX == 14 && gWorldSectorY == 9 && !gbWorldSectorZ) {
    // BRUTAL CODE  -- special case map.
    iSearchRange = 250;
  } else {
    iSearchRange = EDGE_OF_MAP_SEARCH;
  }

  // determine maximum horizontal limits
  sMaxLeft = Math.min(iSearchRange, (pSoldier.sGridNo % MAXCOL));
  // NumMessage("sMaxLeft = ",sMaxLeft);
  sMaxRight = Math.min(iSearchRange, MAXCOL - ((pSoldier.sGridNo % MAXCOL) + 1));
  // NumMessage("sMaxRight = ",sMaxRight);

  // determine maximum vertical limits
  sMaxUp = Math.min(iSearchRange, (pSoldier.sGridNo / MAXROW));
  // NumMessage("sMaxUp = ",sMaxUp);
  sMaxDown = Math.min(iSearchRange, MAXROW - ((pSoldier.sGridNo / MAXROW) + 1));

  // Call FindBestPath to set flags in all locations that we can
  // walk into within range.  We have to set some things up first...

  // set the distance limit of the square region
  gubNPCDistLimit = iSearchRange;

  // reset the "reachable" flags in the region we're looking at
  for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
    for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
      sGridNo = sEdgepoint1 + sXOffset + (MAXCOL * sYOffset);
      gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_REACHABLE);
    }
  }

  if (FindBestPath(pSoldier, sEdgepoint2, pSoldier.bLevel, Enum193.WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE)) {
    return true;
  }
  return false;
}

export function CalcMapEdgepointClassInsertionCode(sGridNo: INT16): UINT8 {
  let Soldier: SOLDIERTYPE = createSoldierType();
  let iLoop: INT32;
  let psEdgepointArray1: INT16[];
  let psEdgepointArray2: INT16[];
  let iEdgepointArraySize1: INT32;
  let iEdgepointArraySize2: INT32;
  let sClosestSpot1: INT16 = NOWHERE;
  let sClosestDist1: INT16 = 0x7FFF;
  let sTempDist: INT16;
  let sClosestSpot2: INT16 = NOWHERE;
  let sClosestDist2: INT16 = 0x7FFF;
  let fPrimaryValid: boolean = false;
  let fSecondaryValid: boolean = false;

  Soldier.bTeam = 1;
  Soldier.sGridNo = sGridNo;

  if (gMapInformation.sIsolatedGridNo == -1) {
    // If the map has no isolated area, then all edgepoints are primary.
    return Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX;
  }

  switch (gubTacticalDirection) {
    case Enum245.NORTH:
      psEdgepointArray1 = gps1stNorthEdgepointArray;
      iEdgepointArraySize1 = gus1stNorthEdgepointArraySize;
      psEdgepointArray2 = gps2ndNorthEdgepointArray;
      iEdgepointArraySize2 = gus2ndNorthEdgepointArraySize;
      break;
    case Enum245.EAST:
      psEdgepointArray1 = gps1stEastEdgepointArray;
      iEdgepointArraySize1 = gus1stEastEdgepointArraySize;
      psEdgepointArray2 = gps2ndEastEdgepointArray;
      iEdgepointArraySize2 = gus2ndEastEdgepointArraySize;
      break;
    case Enum245.SOUTH:
      psEdgepointArray1 = gps1stSouthEdgepointArray;
      iEdgepointArraySize1 = gus1stSouthEdgepointArraySize;
      psEdgepointArray2 = gps2ndSouthEdgepointArray;
      iEdgepointArraySize2 = gus2ndSouthEdgepointArraySize;
      break;
    case Enum245.WEST:
      psEdgepointArray1 = gps1stWestEdgepointArray;
      iEdgepointArraySize1 = gus1stWestEdgepointArraySize;
      psEdgepointArray2 = gps2ndWestEdgepointArray;
      iEdgepointArraySize2 = gus2ndWestEdgepointArraySize;
      break;
    default:
      // WTF???
      return Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX;
  }

  // Do a 2D search to find the closest map edgepoint and
  // try to create a path there
  for (iLoop = 0; iLoop < iEdgepointArraySize1; iLoop++) {
    sTempDist = PythSpacesAway(sGridNo, psEdgepointArray1[iLoop]);
    if (sTempDist < sClosestDist1) {
      sClosestDist1 = sTempDist;
      sClosestSpot1 = psEdgepointArray1[iLoop];
    }
  }
  for (iLoop = 0; iLoop < iEdgepointArraySize2; iLoop++) {
    sTempDist = PythSpacesAway(sGridNo, psEdgepointArray2[iLoop]);
    if (sTempDist < sClosestDist2) {
      sClosestDist2 = sTempDist;
      sClosestSpot2 = psEdgepointArray2[iLoop];
    }
  }

  // set the distance limit of the square region
  gubNPCDistLimit = 15;

  if (!sClosestDist1 || FindBestPath(Soldier, sClosestSpot1, 0, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
    fPrimaryValid = true;
  }
  if (!sClosestDist2 || FindBestPath(Soldier, sClosestSpot2, 0, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
    fSecondaryValid = true;
  }

  if (fPrimaryValid == fSecondaryValid) {
    if (sClosestDist2 < sClosestDist1) {
      return Enum175.INSERTION_CODE_SECONDARY_EDGEINDEX;
    }
    return Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX;
  }
  if (fPrimaryValid) {
    return Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX;
  }
  return Enum175.INSERTION_CODE_SECONDARY_EDGEINDEX;
}

}
