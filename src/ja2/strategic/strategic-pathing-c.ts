namespace ja2 {

// mvt modifier
//#define FOOT_MVT_MODIFIER 2

let gusPlottedPath: UINT16[] /* [256] */ = createArray(256, 0);
let gusMapPathingData: UINT16[] /* [256] */ = createArray(256, 0);
let gusPathDataSize: UINT16;
let gfPlotToAvoidPlayerInfuencedSectors: boolean = false;

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

function createPathT(): path_t {
  return {
    nextLink: 0,
    prevLink: 0,
    location: 0,
    costSoFar: 0,
    costToGo: 0,
    pathNdx: 0,
  };
}

function resetPathT(o: path_t) {
  o.nextLink = 0;
  o.prevLink = 0;
  o.location = 0;
  o.costSoFar = 0;
  o.costToGo = 0;
  o.pathNdx = 0;
}

interface trail_t {
  nextLink: number;
  diStratDelta: number;
}

function createTrailT(): trail_t {
  return {
    nextLink: 0,
    diStratDelta: 0,
  };
}

function resetTrailT(o: trail_t) {
  o.nextLink = 0;
  o.diStratDelta = 0;
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
type TRAILCELLTYPE = UINT32;

/* static */ let pathQB: path_t[] /* [MAXpathQ] */ = createArrayFrom(MAXpathQ, createPathT);
/* static */ let totAPCostB: UINT16[] /* [MAXpathQ] */ = createArray(MAXpathQ, 0);
/* static */ let gusPathShown: UINT16;
/* static */ let gusAPtsToMove: UINT16;
/* static */ let gusMapMovementCostsB: UINT16[][] /* [MAP_LENGTH][MAXDIR] */ = createArrayFrom(MAP_LENGTH, () => createArray(MAXDIR, 0));
/* static */ let trailCostB: TRAILCELLTYPE[] /* [MAP_LENGTH] */ = createArray(MAP_LENGTH, 0);
/* static */ let trailStratTreeB: trail_t[] /* [MAXTRAILTREE] */ = createArrayFrom(MAXTRAILTREE, createTrailT);
let trailStratTreedxB: number = 0;

const QHEADNDX = (0);
const QPOOLNDX = (MAXpathQ - 1);

const pathQNotEmpty = () => (pathQB[QHEADNDX].nextLink != QHEADNDX);
const pathFound = (sDestination: number) => (pathQB[pathQB[QHEADNDX].nextLink].location == sDestination);
const pathNotYetFound = (sDestination: number) => (!pathFound(sDestination));

const REMQUENODE = (ndx: number) => {
  pathQB[pathQB[ndx].prevLink].nextLink = pathQB[ndx].nextLink;
  pathQB[pathQB[ndx].nextLink].prevLink = pathQB[ndx].prevLink;
};

const INSQUENODEPREV = (newNode: number, curNode: number) => {
  pathQB[newNode].nextLink = curNode;
  pathQB[newNode].prevLink = pathQB[curNode].prevLink;
  pathQB[pathQB[curNode].prevLink].nextLink = newNode;
  pathQB[curNode].prevLink = newNode;
};

const INSQUENODE = (newNode: number, curNode: number) => {
  pathQB[newNode].prevLink = curNode;
  pathQB[newNode].nextLink = pathQB[curNode].nextLink;
  pathQB[pathQB[curNode].nextLink].prevLink = newNode;
  pathQB[curNode].nextLink = newNode;
};

const DELQUENODE = (ndx: number) => {
  REMQUENODE(ndx);
  INSQUENODEPREV(ndx, QPOOLNDX);
  pathQB[ndx].location = -1;
};

const NEWQUENODE = () => {
  let qNewNdx: number;
  if (queRequests < QPOOLNDX)
    qNewNdx = queRequests++;
  else {
    qNewNdx = pathQB[QPOOLNDX].nextLink;
    REMQUENODE(qNewNdx);
  }
  return qNewNdx;
};

const FLATCOST = 1;

const ESTIMATE0 = (dx: number, dy: number) => ((dx > dy) ? (dx) : (dy));
const ESTIMATE1 = (dx: number, dy: number) => ((dx < dy) ? (Math.trunc((dx * 14) / 10) + dy) : (Math.trunc((dy * 14) / 10) + dx));
const ESTIMATE2 = (dx: number, dy: number) => FLATCOST * ((dx < dy) ? (Math.trunc((dx * 14) / 10) + dy) : (Math.trunc((dy * 14) / 10) + dx));
const ESTIMATEn = (dx: number, dy: number) => ((FLATCOST * Math.sqrt(dx * dx + dy * dy)));
const ESTIMATE = (dx: number, dy: number) => ESTIMATE1(dx, dy);

const REMAININGCOST = (iDestX: INT32, iDestY: INT32, ndx: number) => {
  const locY = Math.trunc(pathQB[ndx].location / MAP_WIDTH);
  const locX = pathQB[ndx].location % MAP_WIDTH;
  const dy = Math.abs(iDestY - locY);
  const dx = Math.abs(iDestX - locX);
  return ESTIMATE(dx, dy);
};

const MAXCOST = (99900);
const TOTALCOST = (ndx: number) => (pathQB[ndx].costSoFar + pathQB[ndx].costToGo);
const XLOC = (a: number) => (a % MAP_WIDTH);
const YLOC = (a: number) => Math.trunc(a / MAP_WIDTH);
const LEGDISTANCE = (a: number, b: number) => (Math.abs(XLOC(b) - XLOC(a)) + Math.abs(YLOC(b) - YLOC(a)));
const FARTHER = (ndx: number, NDX: number, sDestination: number) => (LEGDISTANCE(pathQB[ndx].location, sDestination) > LEGDISTANCE(pathQB[NDX].location, sDestination));

const FLAT_STRATEGIC_TRAVEL_TIME = 60;

const QUESEARCH = (ndx: number, sDestination: number) => {
  let k: INT32 = TOTALCOST(ndx);
  let NDX: INT32;

  NDX = pathQB[QHEADNDX].nextLink;
  while (NDX && (k > TOTALCOST(NDX)))
    NDX = pathQB[NDX].nextLink;
  while (NDX && (k == TOTALCOST(NDX)) && FARTHER(ndx, NDX, sDestination))
    NDX = pathQB[NDX].nextLink;

  return NDX;
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

/* static */ let FindStratPath__fPreviousPlotDirectPath: boolean = false; // don't save
export function FindStratPath(sStart: INT16, sDestination: INT16, sMvtGroupNumber: INT16, fTacticalTraversal: boolean): INT32 {
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
  let fPlotDirectPath: boolean = false;
  let pGroup: GROUP | null;

  // ******** Fudge by Bret (for now), curAPcost is never initialized in this function, but should be!
  // so this is just to keep things happy!

  // for player groups only!
  pGroup = GetGroup(sMvtGroupNumber);
  if (pGroup.fPlayer) {
    // if player is holding down SHIFT key, find the shortest route instead of the quickest route!
    if (_KeyDown(SHIFT)) {
      fPlotDirectPath = true;
    }

    if (fPlotDirectPath != FindStratPath__fPreviousPlotDirectPath) {
      // must redraw map to erase the previous path...
      fMapPanelDirty = true;
      FindStratPath__fPreviousPlotDirectPath = fPlotDirectPath;
    }
  }

  queRequests = 2;

  // initialize the ai data structures
  trailStratTreeB.forEach(resetTrailT);
  trailCostB.fill(255);

  // memset(trailCostB,255*PATHFACTOR,MAP_LENGTH);
  pathQB.forEach(resetPathT);

  // FOLLOWING LINE COMMENTED OUT ON MARCH 7/97 BY IC
  gusMapPathingData.fill(sStart);
  trailStratTreedxB = 0;

  // set up common info
  sOrigination = sStart;

  iDestY = Math.trunc(sDestination / MAP_WIDTH);
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
  pathQB[1].costToGo = REMAININGCOST(iDestX, iDestY, 1);

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
      if ((newLoc % MAP_WORLD_X == 0) || (newLoc % MAP_WORLD_X == MAP_WORLD_X - 1) || (Math.trunc(newLoc / MAP_WORLD_X) == 0) || (Math.trunc(newLoc / MAP_WORLD_X) == MAP_WORLD_X - 1)) {
        // yeppers
        continue;
      }

      if (gfPlotToAvoidPlayerInfuencedSectors && newLoc != sDestination) {
        sSectorX = (newLoc % MAP_WORLD_X);
        sSectorY = Math.trunc(newLoc / MAP_WORLD_X);

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
          nextCost = GetTravelTimeForGroup((SECTOR((curLoc % MAP_WORLD_X), Math.trunc(curLoc / MAP_WORLD_X))), Math.trunc(iCnt / 2), sMvtGroupNumber);
          if (nextCost != 0xffffffff && sMvtGroupNumber == pVehicleList[iHelicopterVehicleId].ubMovementGroup) {
            // is a heli, its pathing is determined not by time (it's always the same) but by total cost
            // Skyrider will avoid uncontrolled airspace as much as possible...
            if (StrategicMap[curLoc].fEnemyAirControlled == true) {
              nextCost = COST_AIRSPACE_UNSAFE;
            } else {
              nextCost = COST_AIRSPACE_SAFE;
            }
          }
        } else {
          nextCost = GetTravelTimeForGroup((SECTOR((curLoc % MAP_WORLD_X), Math.trunc(curLoc / MAP_WORLD_X))), Math.trunc(iCnt / 2), sMvtGroupNumber);
        }
      } else {
        nextCost = GetTravelTimeForFootTeam((SECTOR(curLoc % MAP_WORLD_X, Math.trunc(curLoc / MAP_WORLD_X))), Math.trunc(iCnt / 2));
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
          if (GetTraversability((SECTOR(curLoc % 18, Math.trunc(curLoc / 18))), (SECTOR(newLoc % 18, Math.trunc(newLoc / 18)))) != Enum127.GROUNDBARRIER) {
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
        qNewNdx = NEWQUENODE();

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
        pathQB[qNewNdx].costToGo = REMAININGCOST(iDestX, iDestY, qNewNdx);
        trailCostB[newLoc] = newTotCost;
        // do a sorted que insert of the new path
        insertNdx = QUESEARCH(qNewNdx, sDestination);
        INSQUENODEPREV(qNewNdx, insertNdx);
      }
    }
  } while (pathQNotEmpty() && pathNotYetFound(sDestination));
  // work finished. Did we find a path?
  if (pathFound(sDestination)) {
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

export function BuildAStrategicPath(pPath: PathSt | null, iStartSectorNum: INT16, iEndSectorNum: INT16, sMvtGroupNumber: INT16, fTacticalTraversal: boolean): PathSt | null {
  let iCurrentSectorNum: INT32;
  let iDelta: INT32 = 0;
  let iPathLength: INT32;
  let iCount: INT32 = 0;
  let pNode: PathSt | null = null;
  let pNewNode: PathSt | null = null;
  let pDeleteNode: PathSt | null = null;
  let fFlag: boolean = false;
  let pHeadOfPathList: PathSt | null = pPath;
  let iOldDelta: INT32 = 0;
  iCurrentSectorNum = iStartSectorNum;

  if (pNode == null) {
    // start new path list
    pNode = createPathSt();
    /*
       if ( _KeyDown( CTRL ))
                     pNode->fSpeed=SLOW_MVT;
             else
    */
    pNode.fSpeed = NORMAL_MVT;
    pNode.uiSectorId = iStartSectorNum;
    pNode.pNext = null;
    pNode.pPrev = null;
    pNode.uiEta = GetWorldTotalMin();
    pHeadOfPathList = pNode;
  }

  if (iEndSectorNum < MAP_WORLD_X - 1)
    return null;

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
        return null;
      while (pNode.pNext)
        pNode = pNode.pNext;
      // start backing up
      while (pNode.uiSectorId != iStartSectorNum) {
        pDeleteNode = pNode;
        pNode = <PathSt>pNode.pPrev;
        pNode.pNext = null;
      }
      return null;
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
      return null;
    while (pNode.pNext)
      pNode = pNode.pNext;
  }

  pNode = pHeadOfPathList;

  if (!pNode)
    return null;
  while (pNode.pNext)
    pNode = pNode.pNext;

  if (!pNode.pPrev) {
    pHeadOfPathList = null;
    pPath = pHeadOfPathList;
    return null;
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

function AddSectorToPathList(pPath: PathSt | null, uiSectorNum: UINT16): boolean {
  let pNode: PathSt | null = null;
  let pTempNode: PathSt | null = null;
  let pHeadOfList: PathSt | null = pPath;
  pNode = pPath;

  if (uiSectorNum < MAP_WORLD_X - 1)
    return false;

  if (pNode == null) {
    pNode = createPathSt();

    // Implement EtaCost Array as base EtaCosts of sectors
    // pNode->uiEtaCost=EtaCost[uiSectorNum];
    pNode.uiSectorId = uiSectorNum;
    pNode.uiEta = GetWorldTotalMin();
    pNode.pNext = null;
    pNode.pPrev = null;
    /*
         if ( _KeyDown( CTRL ))
                   pNode->fSpeed=SLOW_MVT;
               else
    */
    pNode.fSpeed = NORMAL_MVT;

    return true;
  } else {
    // if (pNode->uiSectorId==uiSectorNum)
    //	  return FALSE;
    while (pNode.pNext) {
      //  if (pNode->uiSectorId==uiSectorNum)
      //	  return FALSE;
      pNode = pNode.pNext;
    }

    pTempNode = createPathSt();
    pTempNode.uiEta = 0;
    pNode.pNext = pTempNode;
    pTempNode.uiSectorId = uiSectorNum;
    pTempNode.pPrev = pNode;
    pTempNode.pNext = null;
    /*
          if ( _KeyDown( CTRL ))
           pTempNode->fSpeed=SLOW_MVT;
          else
    */
    pTempNode.fSpeed = NORMAL_MVT;
    pNode = pTempNode;
  }
  pPath = pHeadOfList;
  return true;
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

export function AppendStrategicPath(pNewSection: PathSt | null, pHeadOfPathList: PathSt | null): PathSt | null {
  // will append a new section onto the end of the head of list, then return the head of the new list

  let pNode: PathSt | null = pHeadOfPathList;
  let pPastNode: PathSt | null = null;
  // move to end of original section

  if (pNewSection == null) {
    return pHeadOfPathList;
  }

  // is there in fact a list to append to
  if (pNode) {
    // move to tail of old list
    while (pNode.pNext) {
      // next node in list
      pNode = pNode.pNext;
    }

    // make sure the 2 are not the same

    if (pNode.uiSectorId == pNewSection.uiSectorId) {
      // are the same, remove head of new list
      pNewSection = RemoveHeadFromStrategicPath(pNewSection);
    }

    // append onto old list
    pNode.pNext = pNewSection;
    (<PathSt>pNewSection).pPrev = pNode;
  } else {
    // head of list becomes head of new section
    pHeadOfPathList = pNewSection;
  }

  // return head of new list
  return pHeadOfPathList;
}

export function ClearStrategicPathList(pHeadOfPath: PathSt | null, sMvtGroup: INT16): PathSt | null {
  // will clear out a strategic path and return head of list as NULL
  let pNode: PathSt | null = pHeadOfPath;
  let pDeleteNode: PathSt | null = pHeadOfPath;

  // is there in fact a path?
  if (pNode == null) {
    // no path, leave
    return pNode;
  }

  // clear list
  while (pNode.pNext) {
    // set up delete node
    pDeleteNode = pNode;

    // move to next node
    pNode = pNode.pNext;
  }

  pNode = null;
  pDeleteNode = null;

  if ((sMvtGroup != -1) && (sMvtGroup != 0)) {
    // clear this groups mvt pathing
    RemoveGroupWaypoints(sMvtGroup);
  }

  return pNode;
}

export function ClearStrategicPathListAfterThisSector(pHeadOfPath: PathSt | null, sX: INT16, sY: INT16, sMvtGroup: INT16): PathSt | null {
  // will clear out a strategic path and return head of list as NULL
  let pNode: PathSt | null = pHeadOfPath;
  let pDeleteNode: PathSt | null = pHeadOfPath;
  let sSector: INT16 = 0;
  let sCurrentSector: INT16 = -1;

  // is there in fact a path?
  if (pNode == null) {
    // no path, leave
    return pNode;
  }

  // get sector value
  sSector = sX + (sY * MAP_WORLD_X);

  // go to end of list
  pNode = MoveToEndOfPathList(pNode);

  // get current sector value
  sCurrentSector = (<PathSt>pNode).uiSectorId;

  // move through list
  while ((pNode) && (sSector != sCurrentSector)) {
    // next value
    pNode = pNode.pPrev;

    // get current sector value
    if (pNode != null) {
      sCurrentSector = pNode.uiSectorId;
    }
  }

  // did we find the target sector?
  if (pNode == null) {
    // nope, leave
    return pHeadOfPath;
  }

  // we want to KEEP the target sector, not delete it, so advance to the next sector
  pNode = pNode.pNext;

  // is nothing left?
  if (pNode == null) {
    // that's it, leave
    return pHeadOfPath;
  }

  // if we're NOT about to clear the head (there's a previous entry)
  if (pNode.pPrev) {
    // set next for tail to NULL
    pNode.pPrev.pNext = null;
  } else {
    // clear head, return NULL
    pHeadOfPath = ClearStrategicPathList(pHeadOfPath, sMvtGroup);

    return null;
  }

  // clear list
  while (pNode.pNext) {
    // set up delete node
    pDeleteNode = pNode;

    // move to next node
    pNode = pNode.pNext;

    // check if we are clearing the head of the list
    if (pDeleteNode == pHeadOfPath) {
      // null out head
      pHeadOfPath = null;
    }
  }

  // clear out last node
  pNode = null;
  pDeleteNode = null;

  return pHeadOfPath;
}

export function MoveToBeginningOfPathList(pList: PathSt | null): PathSt | null {
  // move to beginning of this list

  // no list, return
  if (pList == null) {
    return null;
  }

  // move to beginning of list
  while (pList.pPrev) {
    pList = pList.pPrev;
  }

  return pList;
}

function MoveToEndOfPathList(pList: PathSt | null): PathSt | null {
  // move to end of list

  // no list, return
  if (pList == null) {
    return null;
  }

  // move to beginning of list
  while (pList.pNext) {
    pList = pList.pNext;
  }

  return pList;
}

function RemoveTailFromStrategicPath(pHeadOfList: PathSt | null): PathSt | null {
  // remove the tail section from the strategic path
  let pNode: PathSt | null = pHeadOfList;
  let pLastNode: PathSt | null = pHeadOfList;

  if (pNode == null) {
    // no list, leave
    return null;
  }

  while (pNode.pNext) {
    pLastNode = pNode;
    pNode = pNode.pNext;
  }

  // end of list

  // set next to null
  (<PathSt>pLastNode).pNext = null;

  // return head of new list
  return pHeadOfList;
}

export function RemoveHeadFromStrategicPath(pList: PathSt | null): PathSt | null {
  // move to head of list
  let pNode: PathSt | null = pList;
  let pNewHead: PathSt | null = pList;

  // check if there is a list
  if (pNode == null) {
    // no list, leave
    return null;
  }

  // move to head of list
  while (pNode.pPrev) {
    // back one node
    pNode = pNode.pPrev;
  }

  // set up new head
  pNewHead = pNode.pNext;
  if (pNewHead) {
    pNewHead.pPrev = null;
  }

  pNode = null;

  // return new head
  return pNewHead;
}

function RemoveSectorFromStrategicPathList(pList: PathSt | null, sX: INT16, sY: INT16): PathSt | null {
  // find sector sX, sY ...then remove it
  let sSector: INT16 = 0;
  let sCurrentSector: INT16 = -1;
  let pNode: PathSt | null = pList;
  let pPastNode: PathSt | null = pList;

  // get sector value
  sSector = sX + (sY * MAP_WORLD_X);

  // check if there is a valid list
  if (pNode == null) {
    return pNode;
  }

  // get current sector value
  sCurrentSector = pNode.uiSectorId;

  // move to end of list
  pNode = MoveToEndOfPathList(pNode);

  // move through list
  while ((pNode) && (sSector != sCurrentSector)) {
    // set past node up
    pPastNode = pNode;

    // next value
    pNode = pNode.pPrev;

    // get current sector value
    sCurrentSector = (<PathSt>pNode).uiSectorId;
  }

  // no list left, sector not found
  if (pNode == null) {
    return null;
  }

  // sector found...remove it
  Assert(pPastNode);
  pPastNode.pNext = <PathSt>pNode.pNext;

  // set up prev for next
  pPastNode.pNext.pPrev = pPastNode;

  pPastNode = MoveToBeginningOfPathList(pPastNode);

  return pPastNode;
}

export function GetLastSectorIdInCharactersPath(pCharacter: SOLDIERTYPE): INT16 {
  // will return the last sector of the current path, or the current sector if there's no path
  let sLastSector: INT16 = (pCharacter.sSectorX) + (pCharacter.sSectorY) * (MAP_WORLD_X);
  let pNode: PathSt | null = null;

  pNode = GetSoldierMercPathPtr(pCharacter);

  while (pNode) {
    sLastSector = (pNode.uiSectorId);
    pNode = pNode.pNext;
  }

  return sLastSector;
}

// get id of last sector in vehicle path list
export function GetLastSectorIdInVehiclePath(iId: INT32): INT16 {
  let sLastSector: INT16 = -1;
  let pNode: PathSt | null = null;

  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return sLastSector;
  }
  // now check if vehicle is valid
  if (pVehicleList[iId].fValid == false) {
    return sLastSector;
  }

  // get current last sector
  sLastSector = (pVehicleList[iId].sSectorX) + (pVehicleList[iId].sSectorY * MAP_WORLD_X);

  pNode = pVehicleList[iId].pMercPath;

  while (pNode) {
    sLastSector = (pNode.uiSectorId);
    pNode = pNode.pNext;
  }

  return sLastSector;
}

export function CopyPaths(pSourcePath: PathSt | null, pDestPath: PathSt | null): PathSt {
  let pDestNode: PathSt | null = pDestPath;
  let pCurNode: PathSt | null = pSourcePath;
  // copies path from source to dest

  // NULL out dest path
  pDestNode = ClearStrategicPathList(pDestNode, -1);
  Assert(pDestNode == null);

  // start list off
  if (pCurNode != null) {
    pDestNode = createPathSt();

    // set next and prev nodes
    pDestNode.pPrev = null;
    pDestNode.pNext = null;

    // copy sector value and times
    pDestNode.uiSectorId = pCurNode.uiSectorId;
    pDestNode.uiEta = pCurNode.uiEta;
    pDestNode.fSpeed = pCurNode.fSpeed;

    pCurNode = pCurNode.pNext;
  }

  while (pCurNode != null) {
    Assert(pDestNode);
    pDestNode.pNext = createPathSt();

    // set next's previous to current
    pDestNode.pNext.pPrev = pDestNode;

    // set next's next to null
    pDestNode.pNext.pNext = null;

    // increment ptr
    pDestNode = pDestNode.pNext;

    // copy sector value and times
    pDestNode.uiSectorId = pCurNode.uiSectorId;
    pDestNode.uiEta = pCurNode.uiEta;
    pDestNode.fSpeed = pCurNode.fSpeed;

    pCurNode = pCurNode.pNext;
  }

  // move back to beginning fo list
  pDestNode = MoveToBeginningOfPathList(pDestNode);

  // return to head of path
  return <PathSt>pDestNode;
}

function GetStrategicMvtSpeed(pCharacter: SOLDIERTYPE): INT32 {
  // will return the strategic speed of the character
  let iSpeed: INT32;

  // avg of strength and agility * percentage health..very simple..replace later

  iSpeed = Math.trunc((pCharacter.bAgility + pCharacter.bStrength) / 2);
  iSpeed *= ((pCharacter.bLife));
  iSpeed = Math.trunc(iSpeed / pCharacter.bLifeMax);

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

export function RebuildWayPointsForGroupPath(pHeadOfPath: PathSt | null, sMvtGroup: INT16): void {
  let iDelta: INT32 = 0;
  let iOldDelta: INT32 = 0;
  let fFirstNode: boolean = true;
  let pNode: PathSt | null = pHeadOfPath;
  let pGroup: GROUP;
  let wp: WAYPOINT | null = null;

  if ((sMvtGroup == -1) || (sMvtGroup == 0)) {
    // invalid group...leave
    return;
  }

  pGroup = GetGroup(sMvtGroup);

  // KRIS!  Added this because it was possible to plot a new course to the same destination, and the
  //       group would add new arrival events without removing the existing one(s).
  DeleteStrategicEvent(Enum132.EVENT_GROUP_ARRIVAL, sMvtGroup);

  RemoveGroupWaypoints(sMvtGroup);

  if (pGroup.fPlayer) {
    // update the destination(s) in the team list
    fTeamPanelDirty = true;

    // update the ETA in character info
    fCharacterInfoPanelDirty = true;

    // allows assignments to flash right away if their subject moves away/returns (robot/vehicle being repaired), or
    // patient/doctor/student/trainer being automatically put on a squad via the movement menu.
    gfReEvaluateEveryonesNothingToDo = true;
  }

  // if group has no path planned at all
  if ((pNode == null) || (pNode.pNext == null)) {
    // and it's a player group, and it's between sectors
    // NOTE: AI groups never reverse direction between sectors, Kris cheats & teleports them back to their current sector!
    if (pGroup.fPlayer && pGroup.fBetweenSectors) {
      // send the group right back to its current sector by reversing directions
      GroupReversingDirectionsBetweenSectors(pGroup, pGroup.ubSectorX, pGroup.ubSectorY, false);
    }

    return;
  }

  // if we're currently between sectors
  if (pGroup.fBetweenSectors) {
    // figure out which direction we're already going in  (Otherwise iOldDelta starts at 0)
    iOldDelta = CALCULATE_STRATEGIC_INDEX(pGroup.ubNextX, pGroup.ubNextY) - CALCULATE_STRATEGIC_INDEX(pGroup.ubSectorX, pGroup.ubSectorY);
  }

  // build a brand new list of waypoints, one for initial direction, and another for every "direction change" thereafter
  while (pNode.pNext) {
    iDelta = pNode.pNext.uiSectorId - pNode.uiSectorId;
    Assert(iDelta != 0); // same sector should never repeat in the path list

    // Waypoints are only added at "pivot points" - whenever there is a change in orthogonal direction.
    // If we're NOT currently between sectors, iOldDelta will start off at 0, which means that the first node can't be
    // added as a waypoint.  This is what we want - for stationary mercs, the first node in a path is the CURRENT sector.
    if ((iOldDelta != 0) && (iDelta != iOldDelta)) {
      // add this strategic sector as a waypoint
      AddWaypointStrategicIDToPGroup(pGroup, pNode.uiSectorId);
    }

    // remember this delta
    iOldDelta = iDelta;

    pNode = pNode.pNext;
    fFirstNode = false;
  }

  // there must have been at least one next node, or we would have bailed out on "no path" earlier
  Assert(!fFirstNode);

  // the final destination sector - always add a waypoint for it
  AddWaypointStrategicIDToPGroup(pGroup, pNode.uiSectorId);

  // at this point, the final sector in the path must be identical to this group's last waypoint
  wp = GetFinalWaypoint(pGroup);
  AssertMsg(wp, "Path exists, but no waypoints were added!  AM-0");
  AssertMsg(pNode.uiSectorId == CALCULATE_STRATEGIC_INDEX(wp.x, wp.y), "Last waypoint differs from final path sector!  AM-0");

  // see if we've already reached the first sector in the path (we never actually left the sector and reversed back to it)
  if (pGroup.uiArrivalTime == GetWorldTotalMin()) {
    // never really left.  Must set check for battle TRUE in order for HandleNonCombatGroupArrival() to run!
    GroupArrivedAtSector(pGroup.ubGroupID, true, true);
  }
}

// clear strategic movement (mercpaths and waypoints) for this soldier, and his group (including its vehicles)
export function ClearMvtForThisSoldierAndGang(pSoldier: SOLDIERTYPE): void {
  let pGroup: GROUP | null = null;

  // check if valid grunt
  Assert(pSoldier);

  pGroup = GetGroup(pSoldier.ubGroupID);
  Assert(pGroup);

  // clear their strategic movement (mercpaths and waypoints)
  ClearMercPathsAndWaypointsForAllInGroup(pGroup);
}

export function MoveGroupFromSectorToSector(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): boolean {
  let pNode: PathSt | null = null;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, false /*, FALSE */);

  if (pNode == null) {
    return false;
  }

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return true;
}

function MoveGroupFromSectorToSectorButAvoidLastSector(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): boolean {
  let pNode: PathSt | null = null;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, false /*, FALSE*/);

  if (pNode == null) {
    return false;
  }

  // remove tail from path
  pNode = RemoveTailFromStrategicPath(pNode);

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return true;
}

export function MoveGroupFromSectorToSectorButAvoidPlayerInfluencedSectors(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): boolean {
  let pNode: PathSt | null = null;

  // init sectors with soldiers in them
  InitSectorsWithSoldiersList();

  // build the list of sectors with soldier in them
  BuildSectorsWithSoldiersList();

  // turn on the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = true;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, false /*, FALSE */);

  // turn off the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = false;

  if (pNode == null) {
    if (MoveGroupFromSectorToSector(ubGroupID, sStartX, sStartY, sDestX, sDestY) == false) {
      return false;
    } else {
      return true;
    }
  }

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return true;
}

export function MoveGroupFromSectorToSectorButAvoidPlayerInfluencedSectorsAndStopOneSectorBeforeEnd(ubGroupID: UINT8, sStartX: INT16, sStartY: INT16, sDestX: INT16, sDestY: INT16): boolean {
  let pNode: PathSt | null = null;

  // init sectors with soldiers in them
  InitSectorsWithSoldiersList();

  // build the list of sectors with soldier in them
  BuildSectorsWithSoldiersList();

  // turn on the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = true;

  // build the path
  pNode = BuildAStrategicPath(pNode, CALCULATE_STRATEGIC_INDEX(sStartX, sStartY), CALCULATE_STRATEGIC_INDEX(sDestX, sDestY), ubGroupID, false /*, FALSE */);

  // turn off the avoid flag
  gfPlotToAvoidPlayerInfuencedSectors = false;

  if (pNode == null) {
    if (MoveGroupFromSectorToSectorButAvoidLastSector(ubGroupID, sStartX, sStartY, sDestX, sDestY) == false) {
      return false;
    } else {
      return true;
    }
  }

  // remove tail from path
  pNode = RemoveTailFromStrategicPath(pNode);

  pNode = MoveToBeginningOfPathList(pNode);

  // start movement to next sector
  RebuildWayPointsForGroupPath(pNode, ubGroupID);

  // now clear out the mess
  pNode = ClearStrategicPathList(pNode, -1);

  return true;
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

export function GetLengthOfPath(pHeadPath: PathSt | null): INT32 {
  let iLength: INT32 = 0;
  let pNode: PathSt | null = pHeadPath;

  while (pNode) {
    pNode = pNode.pNext;
    iLength++;
  }

  return iLength;
}

export function GetLengthOfMercPath(pSoldier: SOLDIERTYPE): INT32 {
  let pNode: PathSt | null = null;
  let iLength: INT32 = 0;

  pNode = GetSoldierMercPathPtr(pSoldier);
  iLength = GetLengthOfPath(pNode);
  return iLength;
}

function CheckIfPathIsEmpty(pHeadPath: PathSt | null): boolean {
  // no path
  if (pHeadPath == null) {
    return true;
  }

  // nothing next either
  if (pHeadPath.pNext == null) {
    return true;
  }

  return false;
}

export function GetSoldierMercPathPtr(pSoldier: SOLDIERTYPE): PathSt | null {
  let pMercPath: PathSt | null = null;

  Assert(pSoldier);

  // IN a vehicle?
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    pMercPath = pVehicleList[pSoldier.iVehicleId].pMercPath;
  }
  // IS a vehicle?
  else if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    pMercPath = pVehicleList[pSoldier.bVehicleID].pMercPath;
  } else // a person
  {
    pMercPath = pSoldier.pMercPath;
  }

  return pMercPath;
}

export function GetGroupMercPathPtr(pGroup: GROUP): PathSt | null {
  let pMercPath: PathSt | null = null;
  let iVehicledId: INT32 = -1;

  Assert(pGroup);

  // must be a player group!
  Assert(pGroup.fPlayer);

  if (pGroup.fVehicle) {
    iVehicledId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
    Assert(iVehicledId != -1);

    pMercPath = pVehicleList[iVehicledId].pMercPath;
  } else {
    // value returned will be NULL if there's nobody in the group!
    if (pGroup.pPlayerList && pGroup.pPlayerList.pSoldier) {
      pMercPath = pGroup.pPlayerList.pSoldier.pMercPath;
    }
  }

  return pMercPath;
}

export function GetSoldierGroupId(pSoldier: SOLDIERTYPE): UINT8 {
  let ubGroupId: UINT8 = 0;

  // IN a vehicle?
  if (pSoldier.bAssignment == Enum117.VEHICLE) {
    ubGroupId = pVehicleList[pSoldier.iVehicleId].ubMovementGroup;
  }
  // IS a vehicle?
  else if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    ubGroupId = pVehicleList[pSoldier.bVehicleID].ubMovementGroup;
  } else // a person
  {
    ubGroupId = pSoldier.ubGroupID;
  }

  return ubGroupId;
}

// clears this groups strategic movement (mercpaths and waypoints), include those in the vehicle structs(!)
export function ClearMercPathsAndWaypointsForAllInGroup(pGroup: GROUP): void {
  let pPlayer: PLAYERGROUP | null = null;
  let pSoldier: SOLDIERTYPE | null = null;

  pPlayer = pGroup.pPlayerList;
  while (pPlayer) {
    pSoldier = pPlayer.pSoldier;

    if (pSoldier != null) {
      ClearPathForSoldier(pSoldier);
    }

    pPlayer = pPlayer.next;
  }

  // if it's a vehicle
  if (pGroup.fVehicle) {
    let iVehicleId: INT32 = -1;
    let pVehicle: VEHICLETYPE;

    iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
    Assert(iVehicleId != -1);

    pVehicle = pVehicleList[iVehicleId];

    // clear the path for that vehicle
    pVehicle.pMercPath = ClearStrategicPathList(pVehicle.pMercPath, pVehicle.ubMovementGroup);
  }

  // clear the waypoints for this group too - no mercpath = no waypoints!
  RemovePGroupWaypoints(pGroup);
  // not used anymore
  // SetWayPointsAsCanceled( pCurrentMerc->ubGroupID );
}

// clears the contents of the soldier's mercpPath, as well as his vehicle path if he is a / or is in a vehicle
function ClearPathForSoldier(pSoldier: SOLDIERTYPE): void {
  let pVehicle: VEHICLETYPE | null = null;

  // clear the soldier's mercpath
  pSoldier.pMercPath = <PathSt>ClearStrategicPathList(pSoldier.pMercPath, pSoldier.ubGroupID);

  // if a vehicle
  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    pVehicle = pVehicleList[pSoldier.bVehicleID];
  }
  // or in a vehicle
  else if (pSoldier.bAssignment == Enum117.VEHICLE) {
    pVehicle = pVehicleList[pSoldier.iVehicleId];
  }

  // if there's an associate vehicle structure
  if (pVehicle != null) {
    // clear its mercpath, too
    pVehicle.pMercPath = ClearStrategicPathList(pVehicle.pMercPath, pVehicle.ubMovementGroup);
  }
}

export function AddSectorToFrontOfMercPathForAllSoldiersInGroup(pGroup: GROUP, ubSectorX: UINT8, ubSectorY: UINT8): void {
  let pPlayer: PLAYERGROUP | null = null;
  let pSoldier: SOLDIERTYPE | null = null;

  pPlayer = pGroup.pPlayerList;
  while (pPlayer) {
    pSoldier = pPlayer.pSoldier;

    if (pSoldier != null) {
      pSoldier.pMercPath = AddSectorToFrontOfMercPath(pSoldier.pMercPath, ubSectorX, ubSectorY);
    }

    pPlayer = pPlayer.next;
  }

  // if it's a vehicle
  if (pGroup.fVehicle) {
    let iVehicleId: INT32 = -1;
    let pVehicle: VEHICLETYPE;

    iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
    Assert(iVehicleId != -1);

    pVehicle = pVehicleList[iVehicleId];

    // add it to that vehicle's path
    pVehicle.pMercPath = AddSectorToFrontOfMercPath(pVehicle.pMercPath, ubSectorX, ubSectorY);
  }
}

function AddSectorToFrontOfMercPath(pMercPath: PathSt | null, ubSectorX: UINT8, ubSectorY: UINT8): PathSt {
  let pNode: PathSt;

  // allocate and hang a new node at the front of the path list
  pNode = createPathSt();

  pNode.uiSectorId = CALCULATE_STRATEGIC_INDEX(ubSectorX, ubSectorY);
  pNode.pNext = pMercPath;
  pNode.pPrev = null;
  pNode.uiEta = GetWorldTotalMin();
  pNode.fSpeed = NORMAL_MVT;

  // if path wasn't null
  if (pMercPath != null) {
    // hang the previous pointer of the old head to the new head
    pMercPath.pPrev = pNode;
  }

  return pNode;
}

}
