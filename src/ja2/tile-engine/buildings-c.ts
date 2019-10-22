const ROOF_LOCATION_CHANCE = 8;

let gubBuildingInfo: UINT8[] /* [WORLD_MAX] */;
let gBuildings: BUILDING[] /* [MAX_BUILDINGS] */;
let gubNumberOfBuildings: UINT8;

function CreateNewBuilding(pubBuilding: Pointer<UINT8>): Pointer<BUILDING> {
  if (gubNumberOfBuildings + 1 >= MAX_BUILDINGS) {
    return NULL;
  }
  // increment # of buildings
  gubNumberOfBuildings++;
  // clear entry
  gBuildings[gubNumberOfBuildings].ubNumClimbSpots = 0;
  *pubBuilding = gubNumberOfBuildings;
  // return pointer (have to subtract 1 since we just added 1
  return addressof(gBuildings[gubNumberOfBuildings]);
}

function GenerateBuilding(sDesiredSpot: INT16): Pointer<BUILDING> {
  let uiLoop: UINT32;
  let sTempGridNo: INT16;
  let sNextTempGridNo: INT16;
  let sVeryTemporaryGridNo: INT16;
  let sStartGridNo: INT16;
  let sCurrGridNo: INT16;
  let sPrevGridNo: INT16 = NOWHERE;
  let sRightGridNo: INT16;
  let bDirection: INT8;
  let bTempDirection: INT8;
  let fFoundDir: BOOLEAN;
  let fFoundWall: BOOLEAN;
  let uiChanceIn: UINT32 = ROOF_LOCATION_CHANCE; // chance of a location being considered
  let sWallGridNo: INT16;
  let bDesiredOrientation: INT8;
  let bSkipSpots: INT8 = 0;
  let FakeSoldier: SOLDIERTYPE;
  let pBuilding: Pointer<BUILDING>;
  let ubBuildingID: UINT8 = 0;

  pBuilding = CreateNewBuilding(addressof(ubBuildingID));
  if (!pBuilding) {
    return NULL;
  }

  // set up fake soldier for location testing
  memset(addressof(FakeSoldier), 0, sizeof(SOLDIERTYPE));
  FakeSoldier.sGridNo = sDesiredSpot;
  FakeSoldier.bLevel = 1;
  FakeSoldier.bTeam = 1;

  // Set reachable
  RoofReachableTest(sDesiredSpot, ubBuildingID);

  // From sGridNo, search until we find a spot that isn't part of the building
  bDirection = NORTHWEST;
  sTempGridNo = sDesiredSpot;
  // using diagonal directions to hopefully prevent picking a
  // spot that
  while ((gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
    sNextTempGridNo = NewGridNo(sTempGridNo, DirectionInc(bDirection));
    if (sTempGridNo == sNextTempGridNo) {
      // hit edge of map!??!
      return NULL;
    } else {
      sTempGridNo = sNextTempGridNo;
    }
  }

  // we've got our spot
  sStartGridNo = sTempGridNo;

  sCurrGridNo = sStartGridNo;
  sVeryTemporaryGridNo = NewGridNo(sCurrGridNo, DirectionInc(EAST));
  if (gpWorldLevelData[sVeryTemporaryGridNo].uiFlags & MAPELEMENT_REACHABLE) {
    // go north first
    bDirection = NORTH;
  } else {
    // go that way (east)
    bDirection = EAST;
  }

  gpWorldLevelData[sStartGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_ROOFCODE_VISITED;

  while (1) {
    // if point to (2 clockwise) is not part of building and is not visited,
    // or is starting point, turn!
    sRightGridNo = NewGridNo(sCurrGridNo, DirectionInc(gTwoCDirection[bDirection]));
    sTempGridNo = sRightGridNo;
    if (((!(gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) && !(gpWorldLevelData[sTempGridNo].ubExtFlags[0] & MAPELEMENT_EXT_ROOFCODE_VISITED)) || (sTempGridNo == sStartGridNo)) && (sCurrGridNo != sStartGridNo)) {
      bDirection = gTwoCDirection[bDirection];
      // try in that direction
      continue;
    }

    // if spot ahead is part of building, turn
    sTempGridNo = NewGridNo(sCurrGridNo, DirectionInc(bDirection));
    if (gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) {
      // first search for a spot that is neither part of the building or visited

      // we KNOW that the spot in the original direction is blocked, so only loop 3 times
      bTempDirection = gTwoCDirection[bDirection];
      fFoundDir = FALSE;
      for (uiLoop = 0; uiLoop < 3; uiLoop++) {
        sTempGridNo = NewGridNo(sCurrGridNo, DirectionInc(bTempDirection));
        if (!(gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE) && !(gpWorldLevelData[sTempGridNo].ubExtFlags[0] & MAPELEMENT_EXT_ROOFCODE_VISITED)) {
          // this is the way to go!
          fFoundDir = TRUE;
          break;
        }
        bTempDirection = gTwoCDirection[bTempDirection];
      }
      if (!fFoundDir) {
        // now search for a spot that is just not part of the building
        bTempDirection = gTwoCDirection[bDirection];
        fFoundDir = FALSE;
        for (uiLoop = 0; uiLoop < 3; uiLoop++) {
          sTempGridNo = NewGridNo(sCurrGridNo, DirectionInc(bTempDirection));
          if (!(gpWorldLevelData[sTempGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
            // this is the way to go!
            fFoundDir = TRUE;
            break;
          }
          bTempDirection = gTwoCDirection[bTempDirection];
        }
        if (!fFoundDir) {
          // WTF is going on?
          return NULL;
        }
      }
      bDirection = bTempDirection;
      // try in that direction
      continue;
    }

    // move ahead
    sPrevGridNo = sCurrGridNo;
    sCurrGridNo = sTempGridNo;
    sRightGridNo = NewGridNo(sCurrGridNo, DirectionInc(gTwoCDirection[bDirection]));

    if (sCurrGridNo == sStartGridNo) {
      // done
      break;
    }

    if (!(gpWorldLevelData[sCurrGridNo].ubExtFlags[0] & MAPELEMENT_EXT_ROOFCODE_VISITED)) {
      gpWorldLevelData[sCurrGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_ROOFCODE_VISITED;

      // consider this location as possible climb gridno
      // there must be a regular wall adjacent to this for us to consider it a
      // climb gridno

      // if the direction is east or north, the wall would be in our gridno;
      // if south or west, the wall would be in the gridno two clockwise
      fFoundWall = FALSE;

      switch (bDirection) {
        case NORTH:
          sWallGridNo = sCurrGridNo;
          bDesiredOrientation = OUTSIDE_TOP_RIGHT;
          break;
        case EAST:
          sWallGridNo = sCurrGridNo;
          bDesiredOrientation = OUTSIDE_TOP_LEFT;
          break;
        case SOUTH:
          sWallGridNo = (sCurrGridNo + DirectionInc(gTwoCDirection[bDirection]));
          bDesiredOrientation = OUTSIDE_TOP_RIGHT;
          break;
        case WEST:
          sWallGridNo = (sCurrGridNo + DirectionInc(gTwoCDirection[bDirection]));
          bDesiredOrientation = OUTSIDE_TOP_LEFT;
          break;
        default:
          // what the heck?
          return NULL;
      }

      if (bDesiredOrientation == OUTSIDE_TOP_LEFT) {
        if (WallExistsOfTopLeftOrientation(sWallGridNo)) {
          fFoundWall = TRUE;
        }
      } else {
        if (WallExistsOfTopRightOrientation(sWallGridNo)) {
          fFoundWall = TRUE;
        }
      }

      if (fFoundWall) {
        if (bSkipSpots > 0) {
          bSkipSpots--;
        } else if (Random(uiChanceIn) == 0) {
          // don't consider people as obstacles
          if (NewOKDestination(addressof(FakeSoldier), sCurrGridNo, FALSE, 0)) {
            pBuilding.value.sUpClimbSpots[pBuilding.value.ubNumClimbSpots] = sCurrGridNo;
            pBuilding.value.sDownClimbSpots[pBuilding.value.ubNumClimbSpots] = sRightGridNo;
            pBuilding.value.ubNumClimbSpots++;

            if (pBuilding.value.ubNumClimbSpots == MAX_CLIMBSPOTS_PER_BUILDING) {
              // gotta stop!
              return pBuilding;
            }

            // if location is added as a spot, reset uiChanceIn
            uiChanceIn = ROOF_LOCATION_CHANCE;
            // skip the next spot
            bSkipSpots = 1;
          } else {
            // if location is not added, 100% chance of handling next location
            // and the next until we can add one
            uiChanceIn = 1;
          }
        } else {
          // didn't pick this location, so increase chance that next location
          // will be considered
          if (uiChanceIn > 2) {
            uiChanceIn--;
          }
        }
      } else {
        // can't select this spot
        if ((sPrevGridNo != NOWHERE) && (pBuilding.value.ubNumClimbSpots > 0)) {
          if (pBuilding.value.sDownClimbSpots[pBuilding.value.ubNumClimbSpots - 1] == sCurrGridNo) {
            // unselect previous spot
            pBuilding.value.ubNumClimbSpots--;
            // overwrote a selected spot so go into automatic selection for later
            uiChanceIn = 1;
          }
        }

        // skip the next gridno
        bSkipSpots = 1;
      }
    }
  }

  // at end could prune # of locations if there are too many

  /*
  #ifdef ROOF_DEBUG
          SetRenderFlags( RENDER_FLAG_FULL );
          RenderWorld();
          RenderCoverDebug( );
          InvalidateScreen( );
          EndFrameBufferRender();
          RefreshScreen( NULL );
  #endif
  */

  return pBuilding;
}

function FindBuilding(sGridNo: INT16): Pointer<BUILDING> {
  let ubBuildingID: UINT8;
  // UINT8					ubRoomNo;

  if (sGridNo <= 0 || sGridNo > WORLD_MAX) {
    return NULL;
  }

  // id 0 indicates no building
  ubBuildingID = gubBuildingInfo[sGridNo];
  if (ubBuildingID == NO_BUILDING) {
    return NULL;
    /*
    // need extra checks to see if is valid spot...
    // must have valid room information and be a flat-roofed
    // building
    if ( InARoom( sGridNo, &ubRoomNo ) && (FindStructure( sGridNo, STRUCTURE_NORMAL_ROOF ) != NULL) )
    {
            return( GenerateBuilding( sGridNo ) );
    }
    else
    {
            return( NULL );
    }
    */
  } else if (ubBuildingID > gubNumberOfBuildings) // huh?
  {
    return NULL;
  }

  return addressof(gBuildings[ubBuildingID]);
}

function InBuilding(sGridNo: INT16): BOOLEAN {
  if (FindBuilding(sGridNo) == NULL) {
    return FALSE;
  }
  return TRUE;
}

function GenerateBuildings(): void {
  let uiLoop: UINT32;

  // init building structures and variables
  memset(addressof(gubBuildingInfo), 0, WORLD_MAX * sizeof(UINT8));
  memset(addressof(gBuildings), 0, MAX_BUILDINGS * sizeof(BUILDING));
  gubNumberOfBuildings = 0;

  if ((gbWorldSectorZ > 0) || gfEditMode) {
    return;
  }

  // reset ALL reachable flags
  // do once before we start building generation for
  // whole map
  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    gpWorldLevelData[uiLoop].uiFlags &= ~(MAPELEMENT_REACHABLE);
    gpWorldLevelData[uiLoop].ubExtFlags[0] &= ~(MAPELEMENT_EXT_ROOFCODE_VISITED);
  }

  // search through world
  // for each location in a room try to find building info

  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    if ((gubWorldRoomInfo[uiLoop] != NO_ROOM) && (gubBuildingInfo[uiLoop] == NO_BUILDING) && (FindStructure(uiLoop, STRUCTURE_NORMAL_ROOF) != NULL)) {
      GenerateBuilding(uiLoop);
    }
  }
}

function FindClosestClimbPoint(sStartGridNo: INT16, sDesiredGridNo: INT16, fClimbUp: BOOLEAN): INT16 {
  let pBuilding: Pointer<BUILDING>;
  let ubNumClimbSpots: UINT8;
  let psClimbSpots: Pointer<INT16>;
  let ubLoop: UINT8;
  let sDistance: INT16;
  let sClosestDistance: INT16 = 1000;
  let sClosestSpot: INT16 = NOWHERE;

  pBuilding = FindBuilding(sDesiredGridNo);
  if (!pBuilding) {
    return NOWHERE;
  }

  ubNumClimbSpots = pBuilding.value.ubNumClimbSpots;

  if (fClimbUp) {
    psClimbSpots = pBuilding.value.sUpClimbSpots;
  } else {
    psClimbSpots = pBuilding.value.sDownClimbSpots;
  }

  for (ubLoop = 0; ubLoop < ubNumClimbSpots; ubLoop++) {
    if ((WhoIsThere2(pBuilding.value.sUpClimbSpots[ubLoop], 0) == NOBODY) && (WhoIsThere2(pBuilding.value.sDownClimbSpots[ubLoop], 1) == NOBODY)) {
      sDistance = PythSpacesAway(sStartGridNo, psClimbSpots[ubLoop]);
      if (sDistance < sClosestDistance) {
        sClosestDistance = sDistance;
        sClosestSpot = psClimbSpots[ubLoop];
      }
    }
  }

  return sClosestSpot;
}

function SameBuilding(sGridNo1: INT16, sGridNo2: INT16): BOOLEAN {
  if (gubBuildingInfo[sGridNo1] == NO_BUILDING) {
    return FALSE;
  }
  if (gubBuildingInfo[sGridNo2] == NO_BUILDING) {
    return FALSE;
  }
  return (gubBuildingInfo[sGridNo1] == gubBuildingInfo[sGridNo2]);
}
