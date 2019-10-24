// mvt modifier
//#define FOOT_MVT_MODIFIER 2

let gusPlottedPath: UINT16[] /* [256] */;
let gusMapPathingData: UINT16[] /* [256] */;
let gusPathDataSize: UINT16;
let gfPlotToAvoidPlayerInfuencedSectors: BOOLEAN = FALSE;

// UINT16 gusEndPlotGridNo;

let ubFromMapDirToInsertionCode: UINT8[] /* [] */ = [
  Enum175.INSERTION_CODE_SOUTH, // NORTH_STRATEGIC_MOVE
  Enum175.INSERTION_CODE_WEST, // EAST_STRATEGIC_MOVE
  Enum175.INSERTION_CODE_NORTH, // SOUTH_STRATEGIC_MOVE
  Enum175.INSERTION_CODE_EAST // WEST_STRATEGIC_MOVE
];

// Globals
interface path_t {
  nextLink: INT16; // 2
  prevLink: INT16; // 2
  location: INT16; // 2
  costSoFar: INT32; // 4
  costToGo: INT32; // 4
  pathNdx: INT16; // 2
}

interface trail_t {
  nextLink: short;
  diStratDelta: short;
}

const MAXTRAILTREE = (4096);
const MAXpathQ = (512);
const MAP_WIDTH = 18;
const MAP_LENGTH = MAP_WIDTH *MAP_WIDTH;

//#define EASYWATERCOST	TRAVELCOST_FLAT / 2
//#define ISWATER(t)	(((t)==TRAVELCOST_KNEEDEEP) || ((t)==TRAVELCOST_DEEPWATER))
//#define NOPASS (TRAVELCOST_OBSTACLE)
//#define VEINCOST TRAVELCOST_FLAT     //actual cost for bridges and doors and such
//#define ISVEIN(v) ((v==TRAVELCOST_VEINMID) || (v==TRAVELCOST_VEINEND))
const TRAILCELLTYPE = UINT32;

/* static */ let pathQB: path_t[] /* [MAXpathQ] */;
/* static */ let totAPCostB: UINT16[] /* [MAXpathQ] */;
/* static */ let gusPathShown: UINT16;
/* static */ let gusAPtsToMove: UINT16;
/* static */ let gusMapMovementCostsB: UINT16[][] /* [MAP_LENGTH][MAXDIR] */;
/* static */ let trailCostB: TRAILCELLTYPE[] /* [MAP_LENGTH] */;
/* static */ let trailStratTreeB: trail_t[] /* [MAXTRAILTREE] */;
let trailStratTreedxB: short = 0;

const QHEADNDX = (0);
const QPOOLNDX = () => (MAXpathQ - 1);

const pathQNotEmpty = () => (pathQB[QHEADNDX].nextLink != QHEADNDX);
const pathFound = () => (pathQB[pathQB[QHEADNDX].nextLink].location == sDestination);
const pathNotYetFound = () => (!pathFound());

const REMQUENODE = (ndx) => {
  pathQB[pathQB[ndx].prevLink].nextLink = pathQB[ndx].nextLink;
  pathQB[pathQB[ndx].nextLink].prevLink = pathQB[ndx].prevLink;
};

const INSQUENODEPREV = (newNode, curNode) => {
  pathQB[newNode].nextLink = curNode;
  pathQB[newNode].prevLink = pathQB[curNode].prevLink;
  pathQB[pathQB[curNode].prevLink].nextLink = newNode;
  pathQB[curNode].prevLink = newNode;
};

const INSQUENODE = (newNode, curNode) => {
  pathQB[newNode].prevLink = curNode;
  pathQB[newNode].NextLink = pathQB[curNode].nextLink;
  pathQB[pathQB[curNode].nextLink].prevLink = newNode;
  pathQB[curNode].nextLink = newNode;
};

const DELQUENODE = (ndx) => {
  REMQUENODE(ndx);
  INSQUENODEPREV(ndx, QPOOLNDX);
  pathQB[ndx].location = -1;
};

const NEWQUENODE = () => {
  if (queRequests < QPOOLNDX)
    qNewNdx = queRequests++;
  else {
    qNewNdx = pathQB[QPOOLNDX].nextLink;
    REMQUENODE(qNewNdx);
  }
};

const ESTIMATE0 = () => ((dx > dy) ? (dx) : (dy));
const ESTIMATE1 = () => ((dx < dy) ? ((dx * 14) / 10 + dy) : ((dy * 14) / 10 + dx));
const ESTIMATE2 = () => FLATCOST *((dx < dy) ? ((dx * 14) / 10 + dy) : ((dy * 14) / 10 + dx));
const ESTIMATEn = () => ((FLATCOST * sqrt(dx * dx + dy * dy)));
const ESTIMATE = () => ESTIMATE1();

const REMAININGCOST = (ndx) => ((locY = pathQB[ndx].location / MAP_WIDTH), (locX = pathQB[ndx].location % MAP_WIDTH), (dy = abs(iDestY - locY)), (dx = abs(iDestX - locX)), ESTIMATE);

const MAXCOST = (99900);
const TOTALCOST = (ndx) => (pathQB[ndx].costSoFar + pathQB[ndx].costToGo);
const XLOC = (a) => (a % MAP_WIDTH);
const YLOC = (a) => (a / MAP_WIDTH);
const LEGDISTANCE = (a, b) => (abs(XLOC(b) - XLOC(a)) + abs(YLOC(b) - YLOC(a)));
const FARTHER = (ndx, NDX) => (LEGDISTANCE(pathQB[ndx].location, sDestination) > LEGDISTANCE(pathQB[NDX].location, sDestination));

const FLAT_STRATEGIC_TRAVEL_TIME = 60;

const QUESEARCH = (ndx, NDX) => {
  let k: INT32 = TOTALCOST(ndx);
  NDX = pathQB[QHEADNDX].nextLink;
  while (NDX && (k > TOTALCOST(NDX)))
    NDX = pathQB[NDX].nextLink;
  while (NDX && (k == TOTALCOST(NDX)) && FARTHER(ndx, NDX))
    NDX = pathQB[NDX].nextLink;
};

let queRequests: INT32;

let diStratDelta: INT16[] /* [8] */ = [
  -MAP_WIDTH, // N
  1 - MAP_WIDTH, // NE
  1, // E
  1 + MAP_WIDTH, // SE
  MAP_WIDTH, // S
  MAP_WIDTH - 1, // SW
  -1, // W
  -MAP_WIDTH - 1 // NW
];

// this will find if a shortest strategic path

function FindStratPath(sStart: INT16, sDestination: INT16, sMvtGroupNumber: INT16, fTacticalTraversal: BOOLEAN): INT32 {
  let iCnt: INT32;
  let ndx: INT32;
  let insertNdx: INT32;
  let qNewNdx: INT32;
  let iDestX: INT32;
  let iDestY: INT32;
  let locX: INT32;
  let locY: INT32;
  let dx: INT32;
  let dy: INT32;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let newLoc: UINT16;
  let curLoc: UINT16;
  let curCost: TRAILCELLTYPE;
  let newTotCost: TRAILCELLTYPE;
  let nextCost: TRAILCELLTYPE;
  let sOrigination: INT16;
  let iCounter: INT16 = 0;
  let fPlotDirectPath: BOOLEAN = FALSE;
  /* static */ let fPreviousPlotDirectPath: BOOLEAN = FALSE; // don't save
  let pGroup: Pointer<GROUP>;

  // ******** Fudge by Bret (for now), curAPcost is never initialized in this function, but should be!
  // so this is just to keep things happy!

  // for player groups only!
  pGroup = GetGroup(sMvtGroupNumber);
  if (pGroup.value.fPlayer) {
    // if player is holding down SHIFT key, find the shortest route instead of the quickest route!
    if (_KeyDown(SHIFT)) {
      fPlotDirectPath = TRUE;
    }

    if (fPlotDirectPath != fPreviousPlotDirectPath) {
      // must redraw map to erase the previous path...
      fMapPanelDirty = TRUE;
      fPreviousPlotDirectPath = fPlotDirectPath;
    }
  }

  queRequests = 2;

  // initialize the ai data structures
  memset(trailStratTreeB, 0, sizeof(trailStratTreeB));
  memset(trailCostB, 255, sizeof(trailCostB));

  // memset(trailCostB,255*PATHFACTOR,MAP_LENGTH);
  memset(pathQB, 0, sizeof(pathQB));

  // FOLLOWING LINE COMMENTED OUT ON MARCH 7/97 BY IC
  memset(gusMapPathingData, (sStart), sizeof(gusMapPathingData));
  trailStratTreedxB = 0;

  // set up common info
  sOrigination = sStart;

  iDestY = (sDestination / MAP_WIDTH);
  iDestX = (sDestination % MAP_WIDTH);

  // if origin and dest is water, then user wants to stay in water!
  // so, check and set waterToWater flag accordingly

  // setup Q
  pathQB[QHEADNDX].location = sOrigination;
  pathQB[QHEADNDX].nextLink = 1;
  pathQB[QHEADNDX].prevLink = 1;
  pathQB[QHEADNDX].costSoFar = MAXCOST;

  pathQB[QPOOLNDX].nextLink = QPOOLNDX;
  pathQB[QPOOLNDX].prevLink = QPOOLNDX;

  // setup first path record
  pathQB[1].nextLink = QHEADNDX;
  pathQB[1].prevLink = QHEADNDX;
  pathQB[1].location = sOrigination;
  pathQB[1].pathNdx = 0;
  pathQB[1].costSoFar = 0;
  pathQB[1].costToGo = REMAININGCOST(1);

  trailStratTreedxB = 0;
  trailCostB[sOrigination] = 0;
  ndx = pathQB[QHEADNDX].nextLink;
  pathQB[ndx].pathNdx = trailStratTreedxB;
  trailStratTreedxB++;

  do {
    // remove the first and best path so far from the que
    ndx = pathQB[QHEADNDX].nextLink;
    curLoc = pathQB[ndx].location;
    curCost = pathQB[ndx].costSoFar;
    // = totAPCostB[ndx];
    DELQUENODE(ndx);

    if (trailCostB[curLoc] < curCost)
      continue;

    // contemplate a new path in each direction
    for (iCnt = 0; iCnt < 8; iCnt += 2) {
      newLoc = curLoc + diStratDelta[iCnt];

      // are we going off the map?
      if ((newLoc % MAP_WORLD_X == 0) || (newLoc % MAP_WORLD_X == MAP_WORLD_X - 1) || (newLoc / MAP_WORLD_X == 0) || (newLoc / MAP_WORLD_X == MAP_WORLD_X - 1)) {
        // yeppers
        continue;
      }

      if (gfPlotToAvoidPlayerInfuencedSectors && newLoc != sDestination) {
        sSectorX = (newLoc % MAP_WORLD_X);
        sSectorY = (newLoc / MAP_WORLD_X);

        if (IsThereASoldierInThisSector(sSectorX, sSectorY, 0)) {
          continue;
        }
        if (GetNumberOfMilitiaInSector(sSectorX, sSectorY, 0)) {
          continue;
        }
        if (!OkayForEnemyToMoveThroughSector(SECTOR(sSectorX, sSectorY))) {
          continue;
        }
      }

      // are we plotting path or checking for existance of one?
      if (sMvtGroupNumber != 0) {
        if (iHelicopterVehicleId != -1) {
          nextCost = GetTravelTimeForGroup((SECTOR((curLoc % MAP_WORLD_X), (curLoc / MAP_WORLD_X))), (iCnt / 2), sMvtGroupNumber);
          if (nextCost != 0xffffffff && sMvtGroupNumber == pVehicleList[iHelicopterVehicleId].ubMovementGroup) {
            // is a heli, its pathing is determined not by time (it's always the same) but by total cost
            // Skyrider will avoid uncontrolled airspace as much as possible...
            if (StrategicMap[curLoc].fEnemyAirControlled == TRUE) {
              nextCost = COST_AIRSPACE_UNSAFE;
            } else {
              nextCost = COST_AIRSPACE_SAFE;
            }
          }
        } else {
          nextCost = GetTravelTimeForGroup((SECTOR((curLoc % MAP_WORLD_X), (curLoc / MAP_WORLD_X))), (iCnt / 2), sMvtGroupNumber);
        }
      } else {
        nextCost = GetTravelTimeForFootTeam((SECTOR(curLoc % MAP_WORLD_X, curLoc / MAP_WORLD_X)), (iCnt / 2));
      }

      if (nextCost == 0xffffffff) {
        continue;
      }

      // if we're building this path due to a tactical traversal exit, we have to force the path to the next sector be
      // in the same direction as the traversal, even if it's not the shortest route, otherwise pathing can crash!  This
      // can happen in places where the long way around to next sector is actually shorter: e.g. D5 to D6.  ARM
      if (fTacticalTraversal) {
        // if it's the first sector only (no cost yet)
        if (curCost == 0 && (newLoc == sDestination)) {
          if (GetTraversability((SECTOR(curLoc % 18, curLoc / 18)), (SECTOR(newLoc % 18, newLoc / 18))) != Enum127.GROUNDBARRIER) {
            nextCost = 0;
          }
        }
      } else {
        if (fPlotDirectPath) {
          // use shortest route instead of faster route
          nextCost = FLAT_STRATEGIC_TRAVEL_TIME;
        }
      }

      /*
      // Commented out by CJC Feb 4 1999... causing errors!

      //make the destination look very attractive
      if( ( newLoc == sDestination ) )
      {
              if( GetTraversability( ( INT16 )( SECTOR( curLoc % 18, curLoc / 18 ) ), ( INT16 ) ( SECTOR( newLoc %18,  newLoc / 18 ) ) ) != GROUNDBARRIER )
              {
                      nextCost = 0;
              }
      }
      */
      // if (_KeyDown(CTRL_DOWN) && nextCost < TRAVELCOST_VEINEND)
      newTotCost = curCost + nextCost;
      if (newTotCost < trailCostB[newLoc]) {
        NEWQUENODE;

        if (qNewNdx == QHEADNDX) {
          return 0;
        }

        if (qNewNdx == QPOOLNDX) {
          return 0;
        }

        // make new path to current location
        trailStratTreeB[trailStratTreedxB].nextLink = pathQB[ndx].pathNdx;
        trailStratTreeB[trailStratTreedxB].diStratDelta = iCnt;
        pathQB[qNewNdx].pathNdx = trailStratTreedxB;
        trailStratTreedxB++;

        if (trailStratTreedxB >= MAXTRAILTREE) {
          return 0;
        }

        pathQB[qNewNdx].location = newLoc;
        pathQB[qNewNdx].costSoFar = newTotCost;
        pathQB[qNewNdx].costToGo = REMAININGCOST(qNewNdx);
        trailCostB[newLoc] = newTotCost;
        // do a sorted que insert of the new path
        QUESEARCH(qNewNdx, insertNdx);
        INSQUENODEPREV(qNewNdx, insertNdx);
      }
    }
  } while (pathQNotEmpty && pathNotYetFound);
  // work finished. Did we find a path?
  if (pathFound) {
    let z: INT16;
    let _z: INT16;
    let _nextLink: INT16; //,tempgrid;

    _z = 0;
    z = pathQB[pathQB[QHEADNDX].nextLink].pathNdx;

    while (z) {
      _nextLink = trailStratTreeB[z].nextLink;
      trailStratTreeB[z].nextLink = _z;
      _z = z;
      z = _nextLink;
    }

    // if this function was called because a solider is about to embark on an actual route
    // (as opposed to "test" path finding (used by cursor, etc), then grab all pertinent
    // data and copy into soldier's database

    z = _z;

    for (iCnt = 0; z && (iCnt < MAX_PATH_LIST_SIZE); iCnt++) {
      gusMapPathingData[iCnt] = trailStratTreeB[z].diStratDelta;

      z = trailStratTreeB[z].nextLink;
    }

    gusPathDataSize = iCnt;

    // return path length : serves as a "successful" flag and a path length counter
    return iCnt;
  }
  // failed miserably, report...
  return 0;
}

function BuildAStrategicPath(pPath: PathStPtr, iStartSectorNum: INT16, iEndSectorNum: INT16, sMvtGroupNumber: INT16, fTacticalTraversal: BOOLEAN): PathStPtr {
  let iCurrentSectorNum: INT32;
  let iDelta: INT32 = 0;
  let iPathLength: INT32;
  let iCount: INT32 = 0;
  let pNode: PathStPtr = NULL;
  let pNewNode: PathStPtr = NULL;
  let pDeleteNode: PathStPtr = NULL;
  let fFlag: BOOLEAN = FALSE;
  let pHeadOfPathList: PathStPtr = pPath;
  let iOldDelta: INT32 = 0;
  iCurrentSectorNum = iStartSectorNum;

  if (pNode == NULL) {
    // start new path list
    pNode = MemAlloc(sizeof(PathSt));
    /*
       if ( _KeyDown( CTRL ))
                     pNode->fSpeed=SLOW_MVT;
             else
    */
    pNode.value.fSpeed = NORMAL_MVT;
    pNode.value.uiSectorId = iStartSectorNum;
    pNode.value.pNext = NULL;
    pNode.value.pPrev = NULL;
    pNode.value.uiEta = GetWorldTotalMin();
    pHeadOfPathList = pNode;
  }

  if (iEndSectorNum < MAP_WORLD_X - 1)
    return NULL;

  iPathLength = (FindStratPath((iStartSectorNum), (iEndSectorNum), sMvtGroupNumber, fTacticalTraversal));
  while (iPathLength > iCount) {
    switch (gusMapPathingData[iCount]) {
      case (Enum245.NORTH):
        iDelta = NORTH_MOVE;
        break;
      case (Enum245.SOUTH):
        iDelta = SOUTH_MOVE;
        break;
      case (Enum245.EAST):
        iDelta = EAST_MOVE;
        break;
      case (Enum245.WEST):
        iDelta = WEST_MOVE;
        break;
    }
    iCount++;
    // create new node
    iCurrentSectorNum += iDelta;

    if (!AddSectorToPathList(pHeadOfPathList, iCurrentSectorNum)) {
      pNode = pHeadOfPathList;
      // intersected previous node, delete path to date
      if (!pNode)
        return NULL;
      while (pNode.value.pNext)
        pNode = pNode.value.pNext;
      // start backing up
      while (pNode.value.uiSectorId != iStartSectorNum) {
        pDeleteNode = pNode;
        pNode = pNode.value.pPrev;
        pNode.value.pNext = NULL;
        MemFree(pDeleteNode);
      }
      return NULL;
    }

    // for strategic mvt events
    // we are at the new node, check if previous node was a change in deirection, ie change in delta..add waypoint
    // if -1, do not
    /*
    if( iOldDelta != 0 )
    {
            if( iOldDelta != iDelta )
            {
                    // ok add last waypt
                    if( fTempPath == FALSE )
                    {
                            // change in direction..add waypoint
                            AddWaypointToGroup( ( UINT8 )sMvtGroupNumber, ( UINT8 )( ( iCurrentSectorNum - iDelta ) % MAP_WORLD_X ), ( UINT8 )( ( iCurrentSectorNum - iDelta ) / MAP_WORLD_X ) );
                    }
            }
    }
    */
    iOldDelta = iDelta;

    pHeadOfPathList = pNode;
    if (!pNode)
      return NULL;
    while (pNode.value.pNext)
      pNode = pNode.value.pNext;
  }

  pNode = pHeadOfPathList;

  if (!pNode)
    return NULL;
  while (pNode.value.pNext)
    pNode = pNode.value.pNext;

  if (!pNode.value.pPrev) {
    MemFree(pNode);
    pHeadOfPathList = NULL;
    pPath = pHeadOfPathList;
    return FALSE;
  }

  /*
  // ok add last waypt
  if( fTempPath == FALSE )
  {
          // change in direction..add waypoint
          AddWaypointToGroup( ( UINT8 )sMvtGroupNumber, ( UINT8 )( iCurrentSectorNum% MAP_WORLD_X ), ( UINT8 )( iCurrentSectorNum / MAP_WORLD_X ) );
}
  */

  pPath = pHeadOfPathList;
  return pPath;
}

function AddSectorToPathList(pPath: PathStPtr, uiSectorNum: UINT16): BOOLEAN {
  let pNode: PathStPtr = NULL;
  let pTempNode: PathStPtr = NULL;
  let pHeadOfList: PathStPtr = pPath;
  pNode = pPath;

  if (uiSectorNum < MAP_WORLD_X - 1)
    return FALSE;

  if (pNode == NULL) {
    pNode = MemAlloc(sizeof(PathSt));

    // Implement EtaCost Array as base EtaCosts of sectors
    // pNode->uiEtaCost=EtaCost[uiSectorNum];
    pNode.value.uiSectorId = uiSectorNum;
    pNode.value.uiEta = GetWorldTotalMin();
    pNode.value.pNext = NULL;
    pNode.value.pPrev = NULL;
    /*
         if ( _KeyDown( CTRL ))
                   pNode->fSpeed=SLOW_MVT;
               else
    */
    pNode.value.fSpeed = NORMAL_MVT;

    return TRUE;
  } else {
    // if (pNode->uiSectorId==uiSectorNum)
    //	  return FALSE;
    while (pNode.value.pNext) {
      //  if (pNode->uiSectorId==uiSectorNum)
      //	  return FALSE;
      pNode = pNode.value.pNext;
    }

    pTempNode = MemAlloc(sizeof(PathSt));
    pTempNode.value.uiEta = 0;
    pNode.value.pNext = pTempNode;
    pTempNode.value.uiSectorId = uiSectorNum;
    pTempNode.value.pPrev = pNode;
    pTempNode.value.pNext = NULL;
    /*
          if ( _KeyDown( CTRL ))
           pTempNode->fSpeed=SLOW_MVT;
          else
    */
    pTempNode.value.fSpeed = NORMAL_MVT;
    pNode = pTempNode;
  }
  pPath = pHeadOfList;
  return TRUE;
}

/*
BOOLEAN TravelBetweenSectorsIsBlockedFromVehicle( UINT16 sSourceSector, UINT16 sDestSector )
{
        INT16 sDelta;

        sDelta = sDestSector - sSourceSector;

        switch( sDelta )
        {
                case( 0 ):
                        return( TRUE );
                break;
                case( - MAP_WORLD_Y ):
                  return( StrategicMap[ sSourceSector ].uiBadVehicleSector[ 0 ] );
                break;
                case( MAP_WORLD_Y):
        return( StrategicMap[ sSourceSector ].uiBadVehicleSector[ 2 ] );
    break;
                case( 1 ):
                        return ( StrategicMap[ sSourceSector ].uiBadVehicleSector[ 1 ] );
                break;
                case( -1 ):
                        return ( StrategicMap[ sSourceSector ].uiBadVehicleSector[ 3 ] );
                break;
        }

        return( FALSE );
}



BOOLEAN SectorIsBlockedFromVehicleExit( UINT16 sSourceSector, INT8 bToDirection  )
{

        if( StrategicMap[ sSourceSector ].uiBadVehicleSector[ bToDirection ] )
        {
                return ( TRUE );
        }
        else
        {
                return ( FALSE );
        }

}



BOOLEAN TravelBetweenSectorsIsBlockedFromFoot( UINT16 sSourceSector, UINT16 sDestSector )
{
        INT16 sDelta;

        sDelta = sDestSector - sSourceSector;

        switch( sDelta )
        {
                case( 0 ):
                        return( TRUE );
                break;
                case( - MAP_WORLD_Y ):
                  return( StrategicMap[ sSourceSector ].uiBadFootSector[ 0 ] );
                break;
                case( MAP_WORLD_Y):
        return( StrategicMap[ sSourceSector ].uiBadFootSector[ 2 ] );
    break;
                case( 1 ):
                        return ( StrategicMap[ sSourceSector ].uiBadFootSector[ 1 ] );
                break;
                case( -1 ):
                        return ( StrategicMap[ sSourceSector ].uiBadFootSector[ 3 ] );
                break;
        }

        return( FALSE );
}


BOOLEAN SectorIsBlockedFromFootExit( UINT16 sSourceSector, INT8 bToDirection )
{
        if( StrategicMap[ sSourceSector ].uiBadFootSector[ bToDirection ]  )
        {
                return ( TRUE );
        }
        else
        {
                return ( FALSE );
        }

}



BOOLEAN CanThisMercMoveToThisSector( SOLDIERTYPE *pSoldier ,INT16 sX, INT16 sY )
{
        // this fucntion will return if this merc ( pSoldier ), can move to sector sX, sY
  BOOLEAN fOkToMoveFlag = FALSE;


        return fOkToMoveFlag;
}



void SetThisMercsSectorXYToTheseValues( SOLDIERTYPE *pSoldier ,INT16 sX, INT16 sY, UINT8 ubFromDirection )
{
  // will move a merc ( pSoldier )to a sector sX, sY

        // Ok, update soldier control pointer values
        pSoldier->sSectorX = sX;
        pSoldier->sSectorY = sY;

        // Set insertion code....
        pSoldier->ubStrategicInsertionCode = ubFromMapDirToInsertionCode[ ubFromDirection ];

        // Are we the same as our current sector
        if ( gWorldSectorX == sX && gWorldSectorY == sY && !gbWorldSectorZ )
        {
                // Add this poor bastard!
                UpdateMercInSector( pSoldier, sX, sY, 0 );
        }
        // Were we in sector?
        else if ( pSoldier->bInSector )
        {
                RemoveSoldierFromTacticalSector( pSoldier, TRUE );

                // Remove from tactical team UI
                RemovePlayerFromTeamSlotGivenMercID( pSoldier->ubID );

        }

        return;
}
*/

function AppendStrategicPath(pNewSection: PathStPtr, pHeadOfPathList: PathStPtr): PathStPtr {
  // will append a new section onto the end of the head of list, then return the head of the new list

  let pNode: PathStPtr = pHeadOfPathList;
  let pPastNode: PathStPtr = NULL;
  // move to end of original section

  if (pNewSection == NULL) {
    return pHeadOfPathList;
  }

  // is there in fact a list to append to
  if (pNode) {
    // move to tail of old list
    while (pNode.value.pNext) {
      // next node in list
      pNode = pNode.value.pNext;
    }

    // make sure the 2 are not the same

    if (pNode.value.uiSectorId == pNewSection.value.uiSectorId) {
      // are the same, remove head of new list
      pNewSection = RemoveHeadFromStrategicPath(pNewSection);
    }

    // append onto old list
    pNode.value.pNext = pNewSection;
    pNewSection.value.pPrev = pNode;
  } else {
    // head of list becomes head of new section
    pHeadOfPathList = pNewSection;
  }

  // return head of new list
  return pHeadOfPathList;
}

function ClearStrategicPathList(pHeadOfPath: PathStPtr, sMvtGroup: INT16): PathStPtr {
  // will clear out a strategic path and return head of list as NULL
  let pNode: PathStPtr = pHeadOfPath;
  let pDeleteNode: PathStPtr = pHeadOfPath;

  // is there in fact a path?
  if (pNode == NULL) {
    // no path, leave
    return pNode;
  }

  // clear list
  while (pNode.value.pNext) {
    // set up delete node
    pDeleteNode = pNode;

    // move to next node
    pNode = pNode.value.pNext;

    // delete delete node
    MemFree(pDeleteNode);
  }

  // clear out last node
  MemFree(pNode);

  pNode = NULL;
  pDeleteNode = NULL;

  if ((sMvtGroup != -1) && (sMvtGroup != 0)) {
    // clear this groups mvt pathing
    RemoveGroupWaypoints(sMvtGroup);
  }

  return pNode;
}

function ClearStrategicPathListAfterThisSector(pHeadOfPath: PathStPtr, sX: INT16, sY: INT16, sMvtGroup: INT16): PathStPtr {
  // will clear out a strategic path and return head of list as NULL
  let pNode: PathStPtr = pHeadOfPath;
  let pDeleteNode: PathStPtr = pHeadOfPath;
  let sSector: INT16 = 0;
  let sCurrentSector: INT16 = -1;

  // is there in fact a path?
  if (pNode == NULL) {
    // no path, leave
    return pNode;
  }

  // get sector value
  sSector = sX + (sY * MAP_WORLD_X);

  // go to end of list
  pNode = MoveToEndOfPathList(pNode);

  // get current sector value
  sCurrentSector = pNode.value.uiSectorId;

  // move through list
  while ((pNode) && (sSector != sCurrentSector)) {
    // next value
    pNode = pNode.value.pPrev;

    // get current sector value
    if (pNode != NULL) {
      sCurrentSector = pNode.value.uiSectorId;
    }
  }

  // did we find the target sector?
  if (pNode == NULL) {
    // nope, leave
    return pHeadOfPath;
  }

  // we want to KEEP the target sector, not delete it, so advance to the next sector
  pNode = pNode.value.pNext;

  // is nothing left?
  if (pNode == NULL) {
    // that's it, leave
    return pHeadOfPath;
  }

  // if we're NOT about to clear the head (there's a previous entry)
  if (pNode.value.pPrev) {
    // set next for tail to NULL
    pNode.value.pPrev.value.pNext = NULL;
  } else {
    // clear head, return NULL
    pHeadOfPath = ClearStrategicPathList(pHeadOfPath, sMvtGroup);

    return NULL;
  }

  // clear list
  while (pNode.value.pNext) {
    // set up delete node
    pDeleteNode = pNode;

    // move to next node
    pNode = pNode.value.pNext;

    // check if we are clearing the head of the list
    if (pDeleteNode == pHeadOfPath) {
      // null out head
      pHeadOfPath = NULL;
    }

    // delete delete node
    MemFree(pDeleteNode);
  }

  // clear out last node
  MemFree(pNode);
  pNode = NULL;
  pDeleteNode = NULL;

  return pHeadOfPath;
}

function MoveToBeginningOfPathList(pList: PathStPtr): PathStPtr {
  // move to beginning of this list

  // no list, return
  if (pList == NULL) {
    return NULL;
  }

  // move to beginning of list
  while (pList.value.pPrev) {
    pList = pList.value.pPrev;
  }

  return pList;
}

function MoveToEndOfPathList(pList: PathStPtr): PathStPtr {
  // move to end of list

  // no list, return
  if (pList == NULL) {
    return NULL;
  }

  // move to beginning of list
  while (pList.value.pNext) {
    pList = pList.value.pNext;
  }

  return pList;
}

function RemoveTailFromStrategicPath(pHeadOfList: PathStPtr): PathStPtr {
  // remove the tail section from the strategic path
  let pNode: PathStPtr = pHeadOfList;
  let pLastNode: PathStPtr = pHeadOfList;

  if (pNode == NULL) {
    // no list, leave
    return NULL;
  }

  while (pNode.value.pNext) {
    pLastNode = pNode;
    pNode = pNode.value.pNext;
  }

  // end of list

  // set next to null
  pLastNode.value.pNext = NULL;

  // now remove old last node
  MemFree(pNode);

  // return head of new list
  return pHeadOfList;
}

function RemoveHeadFromStrategicPath(pList: PathStPtr): PathStPtr {
  // move to head of list
  let pNode: PathStPtr = pList;
  let pNewHead: PathStPtr = pList;

  // check if there is a list
  if (pNode == NULL) {
    // no list, leave
    return NULL;
  }

  // move to head of list
  while (pNode.value.pPrev) {
    // back one node
    pNode = pNode.value.pPrev;
  }

  // set up new head
  pNewHead = pNode.value.pNext;
  if (pNewHead) {
    pNewHead.value.pPrev = NULL;
  }

  // free old head
  MemFree(pNode);

  pNode = NULL;

  // return new head
  return pNewHead;
}

function RemoveSectorFromStrategicPathList(pList: PathStPtr, sX: INT16, sY: INT16): PathStPtr {
  // find sector sX, sY ...then remove it
  let sSector: INT16 = 0;
  let sCurrentSector: INT16 = -1;
  let pNode: PathStPtr = pList;
  let pPastNode: PathStPtr = pList;

  // get sector value
  sSector = sX + (sY * MAP_WORLD_X);

  // check if there is a valid list
  if (pNode == NULL) {
    return pNode;
  }

  // get current sector value
  sCurrentSector = pNode.value.uiSectorId;

  // move to end of list
  pNode = MoveToEndOfPathList(pNode);

  // move through list
  while ((pNode) && (sSector != sCurrentSector)) {
    // set past node up
    pPastNode = pNode;

    // next value
    pNode = pNode.value.pPrev;

    // get current sector value
    sCurrentSector = pNode.value.uiSectorId;
  }

  // no list left, sector not found
  if (pNode == NULL) {
    return NULL;
  }

  // sector found...remove it
  pPastNode.value.pNext = pNode.value.pNext;

  // remove node
  MemFree(pNode);

  // set up prev for next
  pPastNode.value.pNext.value.pPrev = pPastNode;

  pPastNode = MoveToBeginningOfPathList(pPastNode);

  return pPastNode;
}

function GetLastSectorIdInCharactersPath(pCharacter: Pointer<SOLDIERTYPE>): INT16 {
  // will return the last sector of the current path, or the current sector if there's no path
  let sLastSector: INT16 = (pCharacter.value.sSectorX) + (pCharacter.value.sSectorY) * (MAP_WORLD_X);
  let pNode: PathStPtr = NULL;

  pNode = GetSoldierMercPathPtr(pCharacter);

  while (pNode) {
    sLastSector = (pNode.value.uiSectorId);
    pNode = pNode.value.pNext;
  }

  return sLastSector;
}

// get id of last sector in vehicle path list
function GetLastSectorIdInVehiclePath(iId: INT32): INT16 {
  let sLastSector: INT16 = -1;
  let pNode: PathStPtr = NULL;

  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return sLastSector;
  }
  // now check if vehicle is valid
  if (pVehicleList[iId].fValid == FALSE) {
    return sLastSector;
  }

  // get current last sector
  sLastSector = (pVehicleList[iId].sSectorX) + (pVehicleList[iId].sSectorY * MAP_WORLD_X);

  pNode = pVehicleList[iId].pMercPath;

  while (pNode) {
    sLastSector = (pNode.value.uiSectorId);
    pNode = pNode.value.pNext;
  }

  return sLastSector;
}

function CopyPaths(pSourcePath: PathStPtr, pDestPath: PathStPtr): PathStPtr {
  let pDestNode: PathStPtr = pDestPath;
  let pCurNode: PathStPtr = pSourcePath;
  // copies path from source to dest

  // NULL out dest path
  pDestNode = ClearStrategicPathList(pDestNode, -1);
  Assert(pDestNode == NULL);

  // start list off
  if (pCurNode != NULL) {
    pDestNode = MemAlloc(sizeof(PathSt));

    // set next and prev nodes
    pDestNode.value.pPrev = NULL;
    pDestNode.value.pNext = NULL;

    // copy sector value and times
    pDestNode.value.uiSectorId = pCurNode.value.uiSectorId;
    pDestNode.value.uiEta = pCurNode.value.uiEta;
    pDestNode.value.fSpeed = pCurNode.value.fSpeed;

    pCurNode = pCurNode.value.pNext;
  }

  while (pCurNode != NULL) {
    pDestNode.value.pNext = MemAlloc(sizeof(PathSt));

    // set next's previous to current
    pDestNode.value.pNext.value.pPrev = pDestNode;

    // set next's next to null
    pDestNode.value.pNext.value.pNext = NULL;

    // increment ptr
    pDestNode = pDestNode.value.pNext;

    // copy sector value and times
    pDestNode.value.uiSectorId = pCurNode.value.uiSectorId;
    pDestNode.value.uiEta = pCurNode.value.uiEta;
    pDestNode.value.fSpeed = pCurNode.value.fSpeed;

    pCurNode = pCurNode.value.pNext;
  }

  // move back to beginning fo list
  pDestNode = MoveToBeginningOfPathList(pDestNode);

  // return to head of path
  return pDestNode;
}

function GetStrategicMvtSpeed(pCharacter: Pointer<SOLDIERTYPE>): INT32 {
  // will return the strategic speed of the character
  let iSpeed: INT32;

  // avg of strength and agility * percentage health..very simple..replace later

  iSpeed = ((pCharacter.value.bAgility + pCharacter.value.bStrength) / 2);
  iSpeed *= ((pCharacter.value.bLife));
  iSpeed /= pCharacter.value.bLifeMax;

  return iSpeed;
}

/*
void CalculateEtaForCharacterPath( SOLDIERTYPE *pCharacter )
{
        PathStPtr pNode = NULL;
        UINT32 uiDeltaEta =0;
        INT32 iMveDelta = 0;
        BOOLEAN fInVehicle;

        // valid character
        if( pCharacter == NULL )
        {
                return;
        }

        // the rules change a little for people in vehicles
        if( pCharacter -> bAssignment == VEHICLE )
        {
                fInVehicle = TRUE;
        }

        if( ( pCharacter -> pMercPath == NULL ) && ( fInVehicle == FALSE ) )
        {
                return;
        }

        if( ( fInVehicle == TRUE ) && ( VehicleIdIsValid( pCharacter -> iVehicleId ) ) )
        {
                // valid vehicle, is there a path for it?
                if( pVehicleList[ iId ].pMercPath == NULL )
                {
                        // nope
                        return;
                }
        }


        // go through path list, calculating eta's based on previous sector eta, speed of mvt through sector, and eta cost of sector
        pNode = GetSoldierMercPathPtr( pCharacter );

        // while there are nodes, calculate eta
        while( pNode )
        {
                // first node, set eta to current time
                if( pNode -> pPrev == NULL )
                {
                        pNode -> uiEta = GetWorldTotalMin( );
                }
                else
                {
                        // get delta in sectors
                        switch( pNode -> uiSectorId - pNode -> pPrev -> uiSectorId )
                        {
                        case( NORTH_MOVE ):
                                iMveDelta = 0;
                                break;
                        case( SOUTH_MOVE ):
                                iMveDelta = 2;
                                break;
                        case( EAST_MOVE ):
                                iMveDelta = 1;
                                break;
                        case( WEST_MOVE ):
                                iMveDelta = 3;
                                break;
                        }

                        if( fInVehicle == TRUE )
                        {
                                // which type

                        }
                        else
                        {
                                // get delta..is the  sector ( mvt cost * modifier ) / ( character strategic speed * mvt speed )
                                uiDeltaEta = ( ( StrategicMap[ pNode -> uiSectorId ].uiFootEta[ iMveDelta ] * FOOT_MVT_MODIFIER ) / ( GetStrategicMvtSpeed( pCharacter ) * ( pNode -> fSpeed + 1 ) ) );
                        }


                        // next sector eta
                        pNode -> uiEta = pNode -> pPrev -> uiEta + ( uiDeltaEta );
                }
                pNode = pNode -> pNext;
        }
        return;
}
*/

/*
void MoveCharacterOnPath( SOLDIERTYPE *pCharacter )
{
        // will move a character along a merc path
        PathStPtr pNode = NULL;
        PathStPtr pDeleteNode = NULL;


        // error check
        if( pCharacter == NULL )
        {
                return;
        }

        if( pCharacter -> pMercPath == NULL )
        {
                return;
        }

        if( pCharacter -> pMercPath -> pNext == NULL )
        {
                // simply set eta to current time
                pCharacter -> pMercPath -> uiEta = GetWorldTotalMin( );
                return;
        }

        // set up node to beginning of path list
        pNode = pCharacter -> pMercPath;


        // while there are nodes left with eta less than current time
        while( pNode -> pNext -> uiEta < GetWorldTotalMin( ) )
        {
                // delete node, move on
                pDeleteNode = pNode;

                // next node
                pNode = pNode -> pNext;

                // delete delete node
                MemFree( pDeleteNode );

                // set up merc path to this sector
                pCharacter -> pMercPath = pNode;

                // no where left to go
                if( pNode == NULL )
                {
                        return;
                }


                // null out prev to beginning of merc path list
                pNode -> pPrev = NULL;

                // set up new location
                pCharacter -> sSectorX = ( INT16 )( pNode -> uiSectorId ) % MAP_WORLD_X ;
                pCharacter -> sSectorY = ( INT16 )( pNode -> uiSectorId ) / MAP_WORLD_X;

                // dirty map panel
                fMapPanelDirty = TRUE;

                if( pNode -> pNext == NULL )
                {
                        return;
                }
        }
}


void MoveTeamOnFoot( void )
{
        // run through list of characters on player team, if on foot, move them
        SOLDIERTYPE *pSoldier, *pTeamSoldier;
  INT32 cnt=0;

        // set psoldier as first in merc ptrs
        pSoldier = MercPtrs[0];

        // go through list of characters, move characters
        for ( pTeamSoldier = MercPtrs[ cnt ]; cnt <= gTacticalStatus.Team[ pSoldier->bTeam ].bLastID; cnt++,pTeamSoldier++)
        {
                if ( pTeamSoldier->bActive )
                {
                        MoveCharacterOnPath( pTeamSoldier );
                }
        }

        return;
}
*/

/*
UINT32 GetEtaGivenRoute( PathStPtr pPath )
{
        // will return the eta of a passed path in global time units, in minutes
        PathStPtr pNode = pPath;

        if( pPath == NULL )
        {
                return( GetWorldTotalMin( ) );
        }
        else if( pPath -> pNext == NULL )
        {
                return( GetWorldTotalMin( ) );
        }
        else
        {
                // there is a path
                while( pNode -> pNext )
                {
                        // run through list
                        pNode = pNode -> pNext;
                }

                // have last sector, therefore the eta of the path
                return( pNode -> uiEta );
        }

        // error
        return( 0 );
}
*/

function RebuildWayPointsForGroupPath(pHeadOfPath: PathStPtr, sMvtGroup: INT16): void {
  let iDelta: INT32 = 0;
  let iOldDelta: INT32 = 0;
  let fFirstNode: BOOLEAN = TRUE;
  let pNode: PathStPtr = pHeadOfPath;
  let pGroup: Pointer<GROUP> = NULL;
  let wp: Pointer<WAYPOINT> = NULL;

  if ((sMvtGroup == -1) || (sMvtGroup == 0)) {
    // invalid group...leave
    return;
  }

  pGroup = GetGroup(sMvtGroup);

  // KRIS!  Added this because it was possible to plot a new course to the same destination, and the
  //       group would add new arrival events without removing the existing one(s).
  DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, sMvtGroup);

  RemoveGroupWaypoints(sMvtGroup);

  if (pGroup.value.fPlayer) {
    // update the destination(s) in the team list
    fTeamPanelDirty = TRUE;

    // update the ETA in character info
    fCharacterInfoPanelDirty = TRUE;

    // allows assignments to flash right away if their subject moves away/returns (robot/vehicle being repaired), or
    // patient/doctor/student/trainer being automatically put on a squad via the movement menu.
    gfReEvaluateEveryonesNothingToDo = TRUE;
  }

  // if group has no path planned at all
  if ((pNode == NULL) || (pNode.value.pNext == NULL)) {
    // and it's a player group, and it's between sectors
    // NOTE: AI groups never reverse direction between sectors, Kris cheats & teleports them back to their current sector!
    if (pGroup.value.fPlayer && pGroup.value.fBetweenSectors) {
      // send the group right back to its current sector by reversing directions
      GroupReversingDirectionsBetweenSectors(pGroup, pGroup.value.ubSectorX, pGroup.value.ubSectorY, FALSE);
    }

    return;
  }

  // if we're currently between sectors
  if (pGroup.value.fBetweenSectors) {
    // figure out which direction we're already going in  (Otherwise iOldDelta starts at 0)
    iOldDelta = CALCULATE_STRATEGIC_INDEX(pGroup.value.ubNextX, pGroup.value.ubNextY) - CALCULATE_STRATEGIC_INDEX(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  }

  // build a brand new list of waypoints, one for initial direction, and another for every "direction change" thereafter
  while (pNode.value.pNext) {
    iDelta = pNode.value.pNext.value.uiSectorId - pNode.value.uiSectorId;
    Assert(iDelta != 0); // same sector should never repeat in the path list

    // Waypoints are only added at "pivot points" - whenever there is a change in orthogonal direction.
    // If we're NOT currently between sectors, iOldDelta will start off at 0, which means that the first node can't be
    // added as a waypoint.  This is what we want - for stationary mercs, the first node in a path is the CURRENT sector.
    if ((iOldDelta != 0) && (iDelta != iOldDelta)) {
      // add this strategic sector as a waypoint
      AddWaypointStrategicIDToPGroup(pGroup, pNode.value.uiSectorId);
    }

    // remember this delta
    iOldDelta = iDelta;

    pNode = pNode.value.pNext;
    fFirstNode = FALSE;
  }

  // there must have been at least one next node, or we would have bailed out on "no path" earlier
  Assert(!fFirstNode);

  // the final destination sector - always add a waypoint for it
  AddWaypointStrategicIDToPGroup(pGroup, pNode.value.uiSectorId);

  // at this point, the final sector in the path must be identical to this group's last waypoint
  wp = GetFinalWaypoint(pGroup);
  AssertMsg(wp, "Path exists, but no waypoints were added!  AM-0");
  AssertMsg(pNode.value.uiSectorId == CALCULATE_STRATEGIC_INDEX(wp.value.x, wp.value.y), "Last waypoint differs from final path sector!  AM-0");

  // see if we've already reached the first sector in the path (we never actually left the sector and reversed back to it)
  if (pGroup.value.uiArrivalTime == GetWorldTotalMin()) {
    // never really left.  Must set check for battle TRUE in order for HandleNonCombatGroupArrival() to run!
    GroupArrivedAtSector(pGroup.value.ubGroupID, TRUE, TRUE);
  }
}

// clear strategic movement (mercpaths and waypoints) for this soldier, and his group (including its vehicles)
function ClearMvtForThisSoldierAndGang(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pGroup: Pointer<GROUP> = NULL;

  // check if valid grunt
  Assert(pSoldier);

  pGroup = GetGroup(pSoldier.value.ubGroupID);
  Assert(pGroup);

  // clear their strategic movement (mercpaths and waypoints)
  ClearMercPathsAndWaypointsForAllInGroup(pGroup);
}

function MoveGroupFromSectorToSector(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): BOOLEAN {
  let pNode: PathStPtr = NULL;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, FALSE /*, FALSE */);

  if (pNode == NULL) {
    return FALSE;
  }

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return TRUE;
}

function MoveGroupFromSectorToSectorButAvoidLastSector(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): BOOLEAN {
  let pNode: PathStPtr = NULL;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, FALSE /*, FALSE*/);

  if (pNode == NULL) {
    return FALSE;
  }

  // remove tail from path
  pNode = RemoveTailFromStrategicPath(pNode);

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return TRUE;
}

function MoveGroupFromSectorToSectorButAvoidPlayerInfluencedSectors(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): BOOLEAN {
  let pNode: PathStPtr = NULL;

  // init sectors with soldiers in them
  InitSectorsWithSoldiersList();

  // build the list of sectors with soldier in them
  BuildSectorsWithSoldiersList();

  // turn on the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = TRUE;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, FALSE /*, FALSE */);

  // turn off the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = FALSE;

  if (pNode == NULL) {
    if (MoveGroupFromSectorToSector(ubGroupID, sStartX, sStartY, sDestX, sDestY) == FALSE) {
      return FALSE;
    } else {
      return TRUE;
    }
  }

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return TRUE;
}

function MoveGroupFromSectorToSectorButAvoidPlayerInfluencedSectorsAndStopOneSectorBeforeEnd(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): BOOLEAN {
  let pNode: PathStPtr = NULL;

  // init sectors with soldiers in them
  InitSectorsWithSoldiersList();

  // build the list of sectors with soldier in them
  BuildSectorsWithSoldiersList();

  // turn on the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = TRUE;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, FALSE /*, FALSE */);

  // turn off the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = FALSE;

  if (pNode == NULL) {
    if (MoveGroupFromSectorToSectorButAvoidLastSector(ubGroupID, sStartX, sStartY, sDestX, sDestY) == FALSE) {
      return FALSE;
    } else {
      return TRUE;
    }
  }

  // remove tail from path
  pNode = RemoveTailFromStrategicPath(pNode);

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return TRUE;
}

/*
BOOLEAN MoveGroupToOriginalSector( UINT8 ubGroupID )
{
        GROUP *pGroup;
        UINT8 ubDestX, ubDestY;
        pGroup = GetGroup( ubGroupID );
        ubDestX = ( pGroup->ubOriginalSector % 16 ) + 1;
        ubDestY = ( pGroup->ubOriginalSector / 16 ) + 1;
        MoveGroupFromSectorToSector( ubGroupID, pGroup->ubSectorX, pGroup->ubSectorY, ubDestX, ubDestY );

        return( TRUE );
}
*/

function GetLengthOfPath(pHeadPath: PathStPtr): INT32 {
  let iLength: INT32 = 0;
  let pNode: PathStPtr = pHeadPath;

  while (pNode) {
    pNode = pNode.value.pNext;
    iLength++;
  }

  return iLength;
}

function GetLengthOfMercPath(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let pNode: PathStPtr = NULL;
  let iLength: INT32 = 0;

  pNode = GetSoldierMercPathPtr(pSoldier);
  iLength = GetLengthOfPath(pNode);
  return iLength;
}

function CheckIfPathIsEmpty(pHeadPath: PathStPtr): BOOLEAN {
  // no path
  if (pHeadPath == NULL) {
    return TRUE;
  }

  // nothing next either
  if (pHeadPath.value.pNext == NULL) {
    return TRUE;
  }

  return FALSE;
}

function GetSoldierMercPathPtr(pSoldier: Pointer<SOLDIERTYPE>): PathStPtr {
  let pMercPath: PathStPtr = NULL;

  Assert(pSoldier);

  // IN a vehicle?
  if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
    pMercPath = pVehicleList[pSoldier.value.iVehicleId].pMercPath;
  }
  // IS a vehicle?
  else if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    pMercPath = pVehicleList[pSoldier.value.bVehicleID].pMercPath;
  } else // a person
  {
    pMercPath = pSoldier.value.pMercPath;
  }

  return pMercPath;
}

function GetGroupMercPathPtr(pGroup: Pointer<GROUP>): PathStPtr {
  let pMercPath: PathStPtr = NULL;
  let iVehicledId: INT32 = -1;

  Assert(pGroup);

  // must be a player group!
  Assert(pGroup.value.fPlayer);

  if (pGroup.value.fVehicle) {
    iVehicledId = GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID);
    Assert(iVehicledId != -1);

    pMercPath = pVehicleList[iVehicledId].pMercPath;
  } else {
    // value returned will be NULL if there's nobody in the group!
    if (pGroup.value.pPlayerList && pGroup.value.pPlayerList.value.pSoldier) {
      pMercPath = pGroup.value.pPlayerList.value.pSoldier.value.pMercPath;
    }
  }

  return pMercPath;
}

function GetSoldierGroupId(pSoldier: Pointer<SOLDIERTYPE>): UINT8 {
  let ubGroupId: UINT8 = 0;

  // IN a vehicle?
  if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
    ubGroupId = pVehicleList[pSoldier.value.iVehicleId].ubMovementGroup;
  }
  // IS a vehicle?
  else if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    ubGroupId = pVehicleList[pSoldier.value.bVehicleID].ubMovementGroup;
  } else // a person
  {
    ubGroupId = pSoldier.value.ubGroupID;
  }

  return ubGroupId;
}

// clears this groups strategic movement (mercpaths and waypoints), include those in the vehicle structs(!)
function ClearMercPathsAndWaypointsForAllInGroup(pGroup: Pointer<GROUP>): void {
  let pPlayer: Pointer<PLAYERGROUP> = NULL;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  pPlayer = pGroup.value.pPlayerList;
  while (pPlayer) {
    pSoldier = pPlayer.value.pSoldier;

    if (pSoldier != NULL) {
      ClearPathForSoldier(pSoldier);
    }

    pPlayer = pPlayer.value.next;
  }

  // if it's a vehicle
  if (pGroup.value.fVehicle) {
    let iVehicleId: INT32 = -1;
    let pVehicle: Pointer<VEHICLETYPE> = NULL;

    iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID);
    Assert(iVehicleId != -1);

    pVehicle = addressof(pVehicleList[iVehicleId]);

    // clear the path for that vehicle
    pVehicle.value.pMercPath = ClearStrategicPathList(pVehicle.value.pMercPath, pVehicle.value.ubMovementGroup);
  }

  // clear the waypoints for this group too - no mercpath = no waypoints!
  RemovePGroupWaypoints(pGroup);
  // not used anymore
  // SetWayPointsAsCanceled( pCurrentMerc->ubGroupID );
}

// clears the contents of the soldier's mercpPath, as well as his vehicle path if he is a / or is in a vehicle
function ClearPathForSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pVehicle: Pointer<VEHICLETYPE> = NULL;

  // clear the soldier's mercpath
  pSoldier.value.pMercPath = ClearStrategicPathList(pSoldier.value.pMercPath, pSoldier.value.ubGroupID);

  // if a vehicle
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    pVehicle = addressof(pVehicleList[pSoldier.value.bVehicleID]);
  }
  // or in a vehicle
  else if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
    pVehicle = addressof(pVehicleList[pSoldier.value.iVehicleId]);
  }

  // if there's an associate vehicle structure
  if (pVehicle != NULL) {
    // clear its mercpath, too
    pVehicle.value.pMercPath = ClearStrategicPathList(pVehicle.value.pMercPath, pVehicle.value.ubMovementGroup);
  }
}

function AddSectorToFrontOfMercPathForAllSoldiersInGroup(pGroup: Pointer<GROUP>, ubSectorX: UINT8, ubSectorY: UINT8): void {
  let pPlayer: Pointer<PLAYERGROUP> = NULL;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  pPlayer = pGroup.value.pPlayerList;
  while (pPlayer) {
    pSoldier = pPlayer.value.pSoldier;

    if (pSoldier != NULL) {
      AddSectorToFrontOfMercPath(addressof(pSoldier.value.pMercPath), ubSectorX, ubSectorY);
    }

    pPlayer = pPlayer.value.next;
  }

  // if it's a vehicle
  if (pGroup.value.fVehicle) {
    let iVehicleId: INT32 = -1;
    let pVehicle: Pointer<VEHICLETYPE> = NULL;

    iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID);
    Assert(iVehicleId != -1);

    pVehicle = addressof(pVehicleList[iVehicleId]);

    // add it to that vehicle's path
    AddSectorToFrontOfMercPath(addressof(pVehicle.value.pMercPath), ubSectorX, ubSectorY);
  }
}

function AddSectorToFrontOfMercPath(ppMercPath: Pointer<PathStPtr>, ubSectorX: UINT8, ubSectorY: UINT8): void {
  let pNode: PathStPtr = NULL;

  // allocate and hang a new node at the front of the path list
  pNode = MemAlloc(sizeof(PathSt));

  pNode.value.uiSectorId = CALCULATE_STRATEGIC_INDEX(ubSectorX, ubSectorY);
  pNode.value.pNext = ppMercPath.value;
  pNode.value.pPrev = NULL;
  pNode.value.uiEta = GetWorldTotalMin();
  pNode.value.fSpeed = NORMAL_MVT;

  // if path wasn't null
  if (ppMercPath.value != NULL) {
    // hang the previous pointer of the old head to the new head
    (ppMercPath.value).value.pPrev = pNode;
  }

  ppMercPath.value = pNode;
}
