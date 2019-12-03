namespace ja2 {

/*
        Filename        :       pathai.c
        Author          :       Ray E. Bornert II
        Date            :       1992-MAR-15

        Skip list additions
        Author          :       Chris Camfield
        Date            :       1997-NOV
*/

// extern UINT8 gubDiagCost[20];
// skiplist has extra level of pointers every 4 elements, so a level 5is optimized for
// 4 to the power of 5 elements, or 2 to the power of 10, 1024

//#define PATHAI_VISIBLE_DEBUG

//#define PATHAI_SKIPLIST_DEBUG

export let gfPlotPathToExitGrid: boolean = false;
let gfRecalculatingExistingPathCost: boolean = false;
export let gubGlobalPathFlags: UINT8 = 0;

let gubBuildingInfoToSet: UINT8;

// ABSOLUTE maximums
//#ifdef JA2EDITOR
const ABSMAX_SKIPLIST_LEVEL = 5;
const ABSMAX_TRAIL_TREE = (16384);
const ABSMAX_PATHQ = (512);
/*
#else
        #define ABSMAX_SKIPLIST_LEVEL 5
        #define ABSMAX_TRAIL_TREE (4096)
        #define ABSMAX_PATHQ (512)
#endif
*/

// STANDARD maximums... configurable!
const MAX_SKIPLIST_LEVEL = 5;
const MAX_TRAIL_TREE = (4096);
const MAX_PATHQ = (512);

let iMaxSkipListLevel: INT32 = MAX_SKIPLIST_LEVEL;
let iMaxTrailTree: INT32 = MAX_TRAIL_TREE;
let iMaxPathQ: INT32 = MAX_PATHQ;

type TRAILCELLTYPE = UINT16;

// OLD PATHAI STUFF
/////////////////////////////////////////////////
interface path_t {
  iLocation: INT32; // 4
  pNext: path_t[] /* Pointer<path_t>[ABSMAX_SKIPLIST_LEVEL] */; // 4 * MAX_SKIPLIST_LEVEL (5) = 20
  sPathNdx: INT16; // 2
  usCostSoFar: TRAILCELLTYPE; // 2
  usCostToGo: TRAILCELLTYPE; // 2
  usTotalCost: TRAILCELLTYPE; // 2
  bLevel: INT8; // 1
  ubTotalAPCost: UINT8; // 1
  ubLegDistance: UINT8; // 1
}

function createPath(): path_t {
  return {
    iLocation: 0,
    pNext: createArray(ABSMAX_SKIPLIST_LEVEL, <path_t><unknown>null),
    sPathNdx: 0,
    usCostSoFar: 0,
    usCostToGo: 0,
    usTotalCost: 0,
    bLevel: 0,
    ubTotalAPCost: 0,
    ubLegDistance: 0,
  };
}

function resetPath(o: path_t) {
  o.iLocation = 0;
  o.pNext.fill(<path_t><unknown>null),
  o.sPathNdx = 0;
  o.usCostSoFar = 0;
  o.usCostToGo = 0;
  o.usTotalCost = 0;
  o.bLevel = 0;
  o.ubTotalAPCost = 0;
  o.ubLegDistance = 0;
}

interface trail_t {
  nextLink: INT16;
  stepDir: INT8;
  fFlags: INT8;
  sGridNo: INT16;
}

function createTrail(): trail_t {
  return {
    nextLink: 0,
    stepDir: 0,
    fFlags: 0,
    sGridNo: 0,
  };
}

const enum Enum248 {
  STEP_BACKWARDS = 0x01,
}

const EASYWATERCOST = TRAVELCOST_FLAT / 2;
const ISWATER = (t: number) => (((t) == TRAVELCOST_KNEEDEEP) || ((t) == TRAVELCOST_DEEPWATER));
const NOPASS = (TRAVELCOST_BLOCKED);
//#define VEINCOST TRAVELCOST_FLAT     //actual cost for bridges and doors and such
//#define ISVEIN(v) ((v==TRAVELCOST_VEINMID) || (v==TRAVELCOST_VEINEND))

/* static */ let pathQ: path_t[] /* Pointer<path_t> */;
/* static */ let gusPathShown: UINT16;
/* static */ let gusAPtsToMove: UINT16;
/* static */ let queRequests: INT32;
/* static */ let iSkipListSize: INT32;
/* static */ let iClosedListSize: INT32;
/* static */ let bSkipListLevel: INT8;
/* static */ let iSkipListLevelLimit: INT32[] /* [8] */ = [
  0,
  4,
  16,
  64,
  256,
  1024,
  4192,
  16384,
];

const ESTIMATE0 = () => ((dx > dy) ? (dx) : (dy));
const ESTIMATE1 = () => ((dx < dy) ? ((dx * 14) / 10 + dy) : ((dy * 14) / 10 + dx));
const ESTIMATE2 = () => FLATCOST *((dx < dy) ? ((dx * 14) / 10 + dy) : ((dy * 14) / 10 + dx));
const ESTIMATEn = () => ((FLATCOST * Math.sqrt(dx * dx + dy * dy)));
const ESTIMATEC = () => (((dx < dy) ? (TRAVELCOST_BUMPY * (dx * 14 + dy * 10) / 10) : (TRAVELCOST_BUMPY * (dy * 14 + dx * 10) / 10)));
//#define ESTIMATEC (((dx<dy) ? ( (TRAVELCOST_FLAT * dx * 14) / 10 + dy) : (TRAVELCOST_FLAT * dy * 14 ) / 10 + dx) ) )
const ESTIMATE = () => ESTIMATEC();

const MAXCOST = (9990);
//#define MAXCOST (255)
//#define TOTALCOST( pCurrPtr ) (pCurrPtr->usCostSoFar + pCurrPtr->usCostToGo)
const TOTALCOST = (ptr: Pointer<path_t>) => (ptr.value.usTotalCost);
const XLOC = (a: number) => (a % MAPWIDTH);
const YLOC = (a: number) => (a / MAPWIDTH);
//#define LEGDISTANCE(a,b) ( abs( XLOC(b)-XLOC(a) ) + abs( YLOC(b)-YLOC(a) ) )
const LEGDISTANCE = (x1: number, y1: number, x2: number, y2: number) => (Math.abs(x2 - x1) + Math.abs(y2 - y1));
//#define FARTHER(ndx,NDX) ( LEGDISTANCE( ndx->sLocation,sDestination) > LEGDISTANCE(NDX->sLocation,sDestination) )
const FARTHER = (ndx: Pointer<path_t>, NDX: Pointer<path_t>) => (ndx.value.ubLegDistance > NDX.value.ubLegDistance);

const SETLOC = (str, loc) => {
  (str).iLocation = loc;
};

/* static */ let trailCost: TRAILCELLTYPE[] /* Pointer<TRAILCELLTYPE> */;
/* static */ let trailCostUsed: UINT8[] /* Pointer<UINT8> */;
/* static */ let gubGlobalPathCount: UINT8 = 0;
/* static */ let trailTree: trail_t[] /* Pointer<trail_t> */;

/* static */ let trailTreeNdx: number = 0;

const QHEADNDX = (0);
const QPOOLNDX = () => (iMaxPathQ - 1);

/* static */ let pQueueHead: path_t /* Pointer<path_t> */;
/* static */ let pClosedHead: path_t /* Pointer<path_t> */;

const pathQNotEmpty = () => (pQueueHead.value.pNext[0] != null);
const pathFound = () => (pQueueHead.value.pNext[0].value.iLocation == iDestination);
const pathNotYetFound = () => (!pathFound());

// Note, the closed list is maintained as a doubly-linked list;
// it's a regular queue, essentially, as we always add to the end
// and remove from the front

// pNext[0] is used for the next pointers
// and pNext[1] is used for prev pointers

/*
#define ClosedListAdd( pNew ) \
{\
        pNew->pNext[0] = pClosedHead;\
        pNew->pNext[1] = pClosedHead->pNext[1];\
        pClosedHead->pNext[1]->pNext[0] = pNew;\
        pClosedHead->pNext[1] = pNew;\
        pNew->iLocation = -1;\
        iClosedListSize++;\
}

#define ClosedListGet( pNew )\
{\
        if (queRequests<QPOOLNDX)\
        {\
                pNew = pathQ + (queRequests);\
                queRequests++;\
                memset( pNew->pNext, 0, sizeof( path_t *) * ABSMAX_SKIPLIST_LEVEL );\
                pNew->bLevel = RandomSkipListLevel();\
        }\
        else if (iClosedListSize > 0)\
        {\
                pNew = pClosedHead->pNext[0];\
                pNew->pNext[1]->pNext[0] = pNew->pNext[0];\
                pNew->pNext[0]->pNext[1] = pNew->pNext[1];\
                iClosedListSize--;\
                queRequests++;\
                memset( pNew->pNext, 0, sizeof( path_t *) * ABSMAX_SKIPLIST_LEVEL );\
                pNew->bLevel = RandomSkipListLevel();\
        }\
        else\
        {\
                pNew = NULL;\
        }\
}
*/

// experiment 1, seemed to fail
const ClosedListAdd = (pNew) => {
  pNew.value.pNext[0] = pClosedHead.pNext[0];
  pClosedHead.pNext[0] = pNew;
  pNew.value.iLocation = -1;
  iClosedListSize++;
};

const ClosedListGet = (pNew) => {
  if (queRequests < QPOOLNDX()) {
    pNew = pathQ + (queRequests);
    queRequests++;
    pNew.value.bLevel = RandomSkipListLevel();
  } else if (iClosedListSize > 0) {
    pNew = pClosedHead.pNext[0];
    pClosedHead.pNext[0] = pNew.value.pNext[0];
    iClosedListSize--;
    queRequests++;
    memset(pNew.value.pNext, 0, sizeof(path_t /* Pointer<path_t> */) * ABSMAX_SKIPLIST_LEVEL);
    pNew.value.bLevel = RandomSkipListLevel();
  } else {
    pNew = null;
  }
};

/*
#define ClosedListAdd( pNew ) \
{\
        pNew->pNext[0] = pClosedHead;\
        pNew->pNext[1] = pClosedHead->pNext[1];\
        pClosedHead->pNext[1]->pNext[0] = pNew;\
        pClosedHead->pNext[1] = pNew;\
        pNew->iLocation = -1;\
        iClosedListSize++;\
}

#define ClosedListGet( pNew )\
{\
        if (queRequests<QPOOLNDX)\
        {\
                pNew = pathQ + (queRequests);\
                queRequests++;\
                memset( pNew->pNext, 0, sizeof( path_t *) * ABSMAX_SKIPLIST_LEVEL );\
                pNew->bLevel = RandomSkipListLevel();\
        }\
        else if (iClosedListSize > 0)\
        {\
                pNew = pClosedHead->pNext[0];\
                pNew->pNext[1]->pNext[0] = pNew->pNext[0];\
                pNew->pNext[0]->pNext[1] = pNew->pNext[1];\
                iClosedListSize--;\
                queRequests++;\
                memset( pNew->pNext, 0, sizeof( path_t *) * ABSMAX_SKIPLIST_LEVEL );\
                pNew->bLevel = RandomSkipListLevel();\
        }\
        else\
        {\
                pNew = NULL;\
        }\
}
*/

const SkipListRemoveHead = () => {
  pDel = pQueueHead.value.pNext[0];
  for (iLoop = 0; iLoop < Math.min(bSkipListLevel, pDel.value.bLevel); iLoop++) {
    pQueueHead.value.pNext[iLoop] = pDel.value.pNext[iLoop];
  }
  iSkipListSize--;
  ClosedListAdd(pDel);
};

const SkipListInsert = (pNew) => {
  pCurr = pQueueHead;
  uiCost = TOTALCOST(pNew);
  memset(pUpdate, 0, MAX_SKIPLIST_LEVEL * sizeof(path_t /* Pointer<path_t> */));
  for (iCurrLevel = bSkipListLevel - 1; iCurrLevel >= 0; iCurrLevel--) {
    pNext = pCurr.value.pNext[iCurrLevel];
    while (pNext) {
      if (uiCost > TOTALCOST(pNext) || (uiCost == TOTALCOST(pNext) && FARTHER(pNew, pNext))) {
        pCurr = pNext;
        pNext = pCurr.value.pNext[iCurrLevel];
      } else {
        break;
      }
    }
    pUpdate[iCurrLevel] = pCurr;
  }
  pCurr = pCurr.value.pNext[0];
  for (iCurrLevel = 0; iCurrLevel < pNew.value.bLevel; iCurrLevel++) {
    if (!(pUpdate[iCurrLevel])) {
      break;
    }
    pNew.value.pNext[iCurrLevel] = pUpdate[iCurrLevel].value.pNext[iCurrLevel];
    pUpdate[iCurrLevel].value.pNext[iCurrLevel] = pNew;
  }
  iSkipListSize++;
  if (iSkipListSize > iSkipListLevelLimit[bSkipListLevel]) {
    pCurr = pQueueHead;
    pNext = pQueueHead.value.pNext[bSkipListLevel - 1];
    while (pNext) {
      if (pNext.value.bLevel > bSkipListLevel) {
        pCurr.value.pNext[bSkipListLevel] = pNext;
        pCurr = pNext;
      }
      pNext = pNext.value.pNext[bSkipListLevel - 1];
    }
    pCurr.value.pNext[bSkipListLevel] = pNext;
    bSkipListLevel++;
  }
};

const REMQUEHEADNODE = () => SkipListRemoveHead();

const DELQUENODE = (ndx) => SkipListRemoveHead();

const REMAININGCOST = (ptr) => ((dy = Math.abs(iDestY - iLocY)), (dx = Math.abs(iDestX - iLocX)), ESTIMATE());
/*
#define REMAININGCOST(ptr)					\
(								\
        (locY = (ptr)->iLocation/MAPWIDTH),			\
        (locX = (ptr)->iLocation%MAPWIDTH),			\
        (dy = abs(iDestY-locY)),					\
        (dx = abs(iDestX-locX)),					\
        ESTIMATE						\
)
*/

const NEWQUENODE = () => ClosedListGet(pNewPtr);

const QUEINSERT = (ndx) => SkipListInsert(ndx);

const GREENSTEPSTART = 0;
const REDSTEPSTART = 16;
const PURPLESTEPSTART = 32;
const BLUESTEPSTART = 48;
const ORANGESTEPSTART = 64;

export let gubNPCAPBudget: UINT8 = 0;
export let gusNPCMovementMode: UINT16;
export let gubNPCDistLimit: UINT8 = 0;
export let gfNPCCircularDistLimit: boolean = false;
export let gubNPCPathCount: UINT8;

let gfPlotDirectPath: boolean = false;
export let gfEstimatePath: boolean = false;
export let gfPathAroundObstacles: boolean = true;

/* static */ let guiPlottedPath: UINT32[] /* [256] */ = createArray(256, 0);
export let guiPathingData: UINT32[] /* [256] */ = createArray(256, 0);
/* static */ let giPathDataSize: INT32;
/* static */ let giPlotCnt: INT32;
/* static */ let guiEndPlotGridNo: UINT32;

/* static */ let dirDelta: INT32[] /* [8] */ = [
  -MAPWIDTH, // N
  1 - MAPWIDTH, // NE
  1, // E
  1 + MAPWIDTH, // SE
  MAPWIDTH, // S
  MAPWIDTH - 1, // SW
  -1, // W
  -MAPWIDTH - 1, // NW
];

const LOOPING_CLOCKWISE = 0;
const LOOPING_COUNTERCLOCKWISE = 1;
const LOOPING_REVERSE = 2;

function RandomSkipListLevel(): INT8 {
  let bLevel: INT8 = 1;

  while (Random(4) == 0 && bLevel < iMaxSkipListLevel - 1) {
    bLevel++;
  }
  return bLevel;
}

export function InitPathAI(): boolean {
  pathQ = createArrayFrom(ABSMAX_PATHQ, createPath);
  trailCost = createArray(MAPLENGTH, 0);
  trailCostUsed = createArray(MAPLENGTH, 0);
  trailTree = createArrayFrom(ABSMAX_TRAIL_TREE, createTrail);
  if (!pathQ || !trailCost || !trailCostUsed || !trailTree) {
    return false;
  }
  pQueueHead = pathQ[QHEADNDX];
  pClosedHead = pathQ[QPOOLNDX()];
  return true;
}

export function ShutDownPathAI(): void {
  pathQ = <path_t[]><unknown>null;
  trailCostUsed = <UINT8[]><unknown>null;
  trailCost = <TRAILCELLTYPE[]><unknown>null;
  trailTree = <trail_t[]><unknown>null;
}

function ReconfigurePathAI(iNewMaxSkipListLevel: INT32, iNewMaxTrailTree: INT32, iNewMaxPathQ: INT32): void {
  // make sure the specified parameters are reasonable
  iNewMaxSkipListLevel = Math.max(iNewMaxSkipListLevel, ABSMAX_SKIPLIST_LEVEL);
  iNewMaxTrailTree = Math.max(iNewMaxTrailTree, ABSMAX_TRAIL_TREE);
  iNewMaxPathQ = Math.max(iNewMaxPathQ, ABSMAX_PATHQ);
  // assign them
  iMaxSkipListLevel = iNewMaxSkipListLevel;
  iMaxTrailTree = iNewMaxTrailTree;
  iMaxPathQ = iNewMaxPathQ;
  // relocate the head of the closed list to the end of the array portion being used
  pClosedHead = pathQ[QPOOLNDX()];
  resetPath(pClosedHead);
}

function RestorePathAIToDefaults(): void {
  iMaxSkipListLevel = MAX_SKIPLIST_LEVEL;
  iMaxTrailTree = MAX_TRAIL_TREE;
  iMaxPathQ = MAX_PATHQ;
  // relocate the head of the closed list to the end of the array portion being used
  pClosedHead = pathQ[QPOOLNDX()];
  resetPath(pClosedHead);
}

///////////////////////////////////////////////////////////////////////
//	FINDBESTPATH                                                   /
////////////////////////////////////////////////////////////////////////
export function FindBestPath(s: SOLDIERTYPE, sDestination: INT16, ubLevel: INT8, usMovementMode: INT16, bCopy: INT8, fFlags: UINT8): INT32 {
  let iDestination: INT32 = sDestination;
  let iOrigination: INT32;
  let iCnt: INT32 = -1;
  let iStructIndex: INT32;
  let iLoopStart: INT32 = 0;
  let iLoopEnd: INT32 = 0;
  let bLoopState: INT8 = LOOPING_CLOCKWISE;
  // BOOLEAN fLoopForwards = FALSE;
  let fCheckedBehind: boolean = false;
  let ubMerc: UINT8;
  let iDestX: INT32;
  let iDestY: INT32;
  let iLocX: INT32;
  let iLocY: INT32;
  let dx: INT32;
  let dy: INT32;
  let newLoc: INT32;
  let curLoc: INT32;
  // INT32 curY;
  let curCost: INT32;
  let newTotCost: INT32;
  let nextCost: INT32;
  let sCurPathNdx: INT16;
  let prevCost: INT32;
  let iWaterToWater: INT32;
  let ubCurAPCost: UINT8;
  let ubAPCost: UINT8;
  let ubNewAPCost: UINT8 = 0;
  // BOOLEAN fTurnSlow = FALSE;
  // BOOLEAN fReverse = FALSE; // stuff for vehicles turning
  let fMultiTile: boolean;
  let fVehicle: boolean;
  // INT32 iLastDir, iPrevToLastDir;
  // INT8 bVehicleCheckDir;
  // UINT16 adjLoc;
  let pStructureFileRef: STRUCTURE_FILE_REF | null = null;
  let usAnimSurface: UINT16;
  // INT32 iCnt2, iCnt3;

  let iLastDir: INT32 = 0;

  let pNewPtr: Pointer<path_t>;
  let pCurrPtr: Pointer<path_t>;

  let pUpdate: Pointer<path_t>[] /* [ABSMAX_SKIPLIST_LEVEL] */;
  let pCurr: Pointer<path_t>;
  let pNext: Pointer<path_t>;
  let pDel: Pointer<path_t>;
  let uiCost: UINT32;
  let iCurrLevel: INT32;
  let iLoop: INT32;

  let fHiddenStructVisible: boolean; // Used for hidden struct visiblity
  let usOKToAddStructID: UINT16 = 0;

  let fCopyReachable: boolean;
  let fCopyPathCosts: boolean;
  let fVisitSpotsOnlyOnce: boolean;
  let iOriginationX: INT32;
  let iOriginationY: INT32;
  let iX: INT32;
  let iY: INT32;

  let fTurnBased: boolean;
  let fPathingForPlayer: boolean;
  let iDoorGridNo: INT32 = -1;
  let fDoorIsObstacleIfClosed: boolean = false; // if false, door is obstacle if it is open
  let pDoorStatus: DOOR_STATUS | null;
  let pDoor: DOOR | null;
  let pDoorStructure: STRUCTURE | null;
  let fDoorIsOpen: boolean = false;
  let fNonFenceJumper: boolean;
  let fNonSwimmer: boolean;
  let fPathAroundPeople: boolean;
  let fConsiderPersonAtDestAsObstacle: boolean;
  let fGoingThroughDoor: boolean = false; // for one tile
  let fContinuousTurnNeeded: boolean;
  let fCloseGoodEnough: boolean;
  let usMovementModeToUseForAPs: UINT16;
  let sClosePathLimit: INT16;

  fVehicle = false;
  iOriginationX = iOriginationY = 0;
  iOrigination = s.sGridNo;

  if (iOrigination < 0 || iOrigination > WORLD_MAX) {
    return 0;
  } else if (!GridNoOnVisibleWorldTile(iOrigination)) {
    return 0;
  } else if (s.bLevel != ubLevel) {
    // pathing to a different level... bzzzt!
    return 0;
  }

  if (gubGlobalPathFlags) {
    fFlags |= gubGlobalPathFlags;
  }

  fTurnBased = ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT));

  fPathingForPlayer = ((s.bTeam == gbPlayerNum) && (!gTacticalStatus.fAutoBandageMode) && !(s.uiStatusFlags & SOLDIER_PCUNDERAICONTROL));
  fNonFenceJumper = !(IS_MERC_BODY_TYPE(s));
  fNonSwimmer = !(IS_MERC_BODY_TYPE(s));
  if (fNonSwimmer) {
    if (Water(sDestination)) {
      return 0;
    }
  }
  fPathAroundPeople = ((fFlags & PATH_THROUGH_PEOPLE) == 0);
  fCloseGoodEnough = ((fFlags & PATH_CLOSE_GOOD_ENOUGH) != 0);
  if (fCloseGoodEnough) {
    sClosePathLimit = Math.min(PythSpacesAway(s.sGridNo, sDestination) - 1, PATH_CLOSE_RADIUS);
    if (sClosePathLimit <= 0) {
      return 0;
    }
  }

  fConsiderPersonAtDestAsObstacle = (fPathingForPlayer && fPathAroundPeople && !(fFlags & PATH_IGNORE_PERSON_AT_DEST));

  if (bCopy >= COPYREACHABLE) {
    fCopyReachable = true;
    fCopyPathCosts = (bCopy == COPYREACHABLE_AND_APS);
    fVisitSpotsOnlyOnce = (bCopy == COPYREACHABLE);
    // make sure we aren't trying to copy path costs for an area greater than the AI array...
    if (fCopyPathCosts && gubNPCDistLimit > AI_PATHCOST_RADIUS) {
      // oy!!!! dis no supposed to happen!
      gubNPCDistLimit = AI_PATHCOST_RADIUS;
    }
  } else {
    fCopyReachable = false;
    fCopyPathCosts = false;
    fVisitSpotsOnlyOnce = false;
  }

  gubNPCPathCount++;

  if (gubGlobalPathCount == 255) {
    // reset arrays!
    memset(trailCostUsed, 0, MAPLENGTH);
    gubGlobalPathCount = 1;
  } else {
    gubGlobalPathCount++;
  }

  // only allow nowhere destination if distance limit set
  if (sDestination == NOWHERE) {
    /*
    if (gubNPCDistLimit == 0)
    {
            return( FALSE );
    }
    */
  } else {
    // the very first thing to do is make sure the destination tile is reachable
    if (!NewOKDestination(s, sDestination, fConsiderPersonAtDestAsObstacle, ubLevel)) {
      gubNPCAPBudget = 0;
      gubNPCDistLimit = 0;
      return false;
    }

    if (sDestination == s.sGridNo) {
      return false;
    }
  }

  if (gubNPCAPBudget) {
    ubAPCost = MinAPsToStartMovement(s, usMovementMode);
    if (ubAPCost > gubNPCAPBudget) {
      gubNPCAPBudget = 0;
      gubNPCDistLimit = 0;
      return 0;
    } else {
      gubNPCAPBudget -= ubAPCost;
    }
  }

  fMultiTile = ((s.uiStatusFlags & SOLDIER_MULTITILE) != 0);
  if (fMultiTile) {
    // Get animation surface...
    // Chris_C... change this to use parameter.....
    usAnimSurface = DetermineSoldierAnimationSurface(s, usMovementMode);
    // Get structure ref...
    pStructureFileRef = GetAnimationStructureRef(s.ubID, usAnimSurface, usMovementMode);

    if (pStructureFileRef) {
      fVehicle = ((s.uiStatusFlags & SOLDIER_VEHICLE) != 0);

      fContinuousTurnNeeded = ((s.uiStatusFlags & (SOLDIER_MONSTER | SOLDIER_ANIMAL | SOLDIER_VEHICLE)) != 0);

      /*
      if (fVehicle && s->bReverse)
      {
              fReverse = TRUE;
      }
      */
      /*
      if (fVehicle || s->ubBodyType == COW || s->ubBodyType == BLOODCAT) // or a vehicle
      {
              fTurnSlow = TRUE;
      }
      */
      if (gfEstimatePath) {
        usOKToAddStructID = IGNORE_PEOPLE_STRUCTURE_ID;
      } else if (s.pLevelNode != null && s.pLevelNode.value.pStructureData != null) {
        usOKToAddStructID = s.pLevelNode.value.pStructureData.value.usStructureID;
      } else {
        usOKToAddStructID = INVALID_STRUCTURE_ID;
      }
    } else {
      // turn off multitile pathing
      fMultiTile = false;
      fContinuousTurnNeeded = false;
    }
  } else {
    fContinuousTurnNeeded = false;
  }

  if (!fContinuousTurnNeeded) {
    iLoopStart = 0;
    iLoopEnd = 0;
    bLoopState = LOOPING_CLOCKWISE;
  }

  ubCurAPCost = 0;
  queRequests = 2;

  // initialize the path data structures
  memset(pathQ, 0, iMaxPathQ * sizeof(path_t));
  memset(trailTree, 0, iMaxTrailTree * sizeof(trail_t));

  bSkipListLevel = 1;
  iSkipListSize = 0;
  iClosedListSize = 0;

  trailTreeNdx = 0;

  // set up common info
  if (fCopyPathCosts) {
    iOriginationY = (iOrigination / MAPWIDTH);
    iOriginationX = (iOrigination % MAPWIDTH);
  }

  iDestY = (iDestination / MAPWIDTH);
  iDestX = (iDestination % MAPWIDTH);

  // if origin and dest is water, then user wants to stay in water!
  // so, check and set waterToWater flag accordingly
  if (iDestination == NOWHERE) {
    iWaterToWater = 0;
  } else {
    if (ISWATER(gubWorldMovementCosts[iOrigination][0][ubLevel]) && ISWATER(gubWorldMovementCosts[iDestination][0][ubLevel]))
      iWaterToWater = 1;
    else
      iWaterToWater = 0;
  }

  // setup Q and first path record

  SETLOC(pQueueHead.value, iOrigination);
  pQueueHead.value.usCostSoFar = MAXCOST;
  pQueueHead.value.bLevel = iMaxSkipListLevel - 1;

  pClosedHead.pNext[0] = pClosedHead;
  pClosedHead.pNext[1] = pClosedHead;

  // setup first path record
  iLocY = iOrigination / MAPWIDTH;
  iLocX = iOrigination % MAPWIDTH;

  SETLOC(pathQ[1], iOrigination);
  pathQ[1].sPathNdx = 0;
  pathQ[1].usCostSoFar = 0;
  if (fCopyReachable) {
    pathQ[1].usCostToGo = 100;
  } else {
    pathQ[1].usCostToGo = REMAININGCOST(addressof(pathQ[1]));
  }
  pathQ[1].usTotalCost = pathQ[1].usCostSoFar + pathQ[1].usCostToGo;
  pathQ[1].ubLegDistance = LEGDISTANCE(iLocX, iLocY, iDestX, iDestY);
  pathQ[1].bLevel = 1;
  pQueueHead.value.pNext[0] = addressof(pathQ[1]);
  iSkipListSize++;

  trailTreeNdx = 0;
  trailCost[iOrigination] = 0;
  pCurrPtr = pQueueHead.value.pNext[0];
  pCurrPtr.value.sPathNdx = trailTreeNdx;
  trailTreeNdx++;

  do {
    // remove the first and best path so far from the que
    pCurrPtr = pQueueHead.value.pNext[0];
    curLoc = pCurrPtr.value.iLocation;
    curCost = pCurrPtr.value.usCostSoFar;
    sCurPathNdx = pCurrPtr.value.sPathNdx;

    // remember the cost used to get here...
    prevCost = gubWorldMovementCosts[trailTree[sCurPathNdx].sGridNo][trailTree[sCurPathNdx].stepDir][ubLevel];

    if (gubNPCAPBudget) {
      ubCurAPCost = pCurrPtr.value.ubTotalAPCost;
    }
    if (fCopyReachable && prevCost != TRAVELCOST_FENCE) {
      gpWorldLevelData[curLoc].uiFlags |= MAPELEMENT_REACHABLE;
      if (gubBuildingInfoToSet > 0) {
        gubBuildingInfo[curLoc] = gubBuildingInfoToSet;
      }
    }

    DELQUENODE(pCurrPtr);

    if (trailCostUsed[curLoc] == gubGlobalPathCount && trailCost[curLoc] < curCost)
      goto("NEXTDIR");

    // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String( "PATHAI %d", curLoc ) );

    if (fContinuousTurnNeeded) {
      if (trailTreeNdx < 2) {
        iLastDir = s.bDirection;
      } else if (trailTree[pCurrPtr.value.sPathNdx].fFlags & Enum248.STEP_BACKWARDS) {
        iLastDir = gOppositeDirection[trailTree[pCurrPtr.value.sPathNdx].stepDir];
      } else {
        iLastDir = trailTree[pCurrPtr.value.sPathNdx].stepDir;
      }
      iLoopStart = iLastDir;
      iLoopEnd = iLastDir;
      bLoopState = LOOPING_CLOCKWISE;
      fCheckedBehind = false;
    }

    // contemplate a new path in each direction
    // for ( iCnt = iLoopStart; iCnt != iLoopEnd; iCnt = (iCnt + iLoopIncrement) % MAXDIR )
    for (iCnt = iLoopStart;;) {
      /*
      if (fTurnSlow)
      {
              if (iLastDir == iPrevToLastDir)
              {
                      if ( iCnt != iLastDir && iCnt != gOneCDirection[ iLastDir ] && iCnt != gOneCCDirection[ iLastDir ])
                      {
                              goto NEXTDIR;
                      }
              }
              else
              {
                      if ( iCnt != iLastDir )
                      {
                              goto NEXTDIR;
                      }
              }
      }
      */

      if (bLoopState == LOOPING_REVERSE) {
        iStructIndex = gOppositeDirection[gOneCDirection[iCnt]];
      } else {
        iStructIndex = gOneCDirection[iCnt];
      }

      if (fMultiTile) {
        if (fContinuousTurnNeeded) {
          if (iCnt != iLastDir) {
            if (!OkayToAddStructureToWorld(curLoc, ubLevel, pStructureFileRef.pDBStructureRef[iStructIndex], usOKToAddStructID)) {
              // we have to abort this loop and possibly reset the loop conditions to
              // search in the other direction (if we haven't already done the other dir)
              if (bLoopState == LOOPING_CLOCKWISE) {
                iLoopStart = iLastDir;
                iLoopEnd = iCnt;
                bLoopState = LOOPING_COUNTERCLOCKWISE; // backwards
                // when we go to the bottom of the loop, iLoopIncrement will be added to iCnt
                // which is good since it avoids duplication of effort
                iCnt = iLoopStart;
                goto("NEXTDIR");
              } else if (bLoopState == LOOPING_COUNTERCLOCKWISE && !fCheckedBehind) {
                // check rear dir
                bLoopState = LOOPING_REVERSE;

                // NB we're stuck with adding 1 to the loop counter down below so configure to accomodate...
                // iLoopStart = (iLastDir + (MAXDIR / 2) - 1) % MAXDIR;
                iLoopStart = gOppositeDirection[gOneCCDirection[iLastDir]];
                iLoopEnd = (iLoopStart + 2) % MAXDIR;
                iCnt = iLoopStart;
                fCheckedBehind = true;
                goto("NEXTDIR");
              } else {
                // done
                goto("ENDOFLOOP");
              }
            }
          }
        } else if (pStructureFileRef) {
          // check to make sure it's okay for us to turn to the new direction in our current tile
          if (!OkayToAddStructureToWorld(curLoc, ubLevel, pStructureFileRef.pDBStructureRef[iStructIndex], usOKToAddStructID)) {
            goto("NEXTDIR");
          }
        }
      }

      newLoc = curLoc + dirDelta[iCnt];

      if (fVisitSpotsOnlyOnce && trailCostUsed[newLoc] == gubGlobalPathCount) {
        // on a "reachable" test, never revisit locations!
        goto("NEXTDIR");
      }

      // if (gpWorldLevelData[newLoc].sHeight != ubLevel)
      // ATE: Movement onto cliffs? Check vs the soldier's gridno height
      // CJC: PREVIOUS LOCATION's height
      if (gpWorldLevelData[newLoc].sHeight != gpWorldLevelData[curLoc].sHeight) {
        goto("NEXTDIR");
      }

      if (gubNPCDistLimit) {
        if (gfNPCCircularDistLimit) {
          if (PythSpacesAway(iOrigination, newLoc) > gubNPCDistLimit) {
            goto("NEXTDIR");
          }
        } else {
          if (SpacesAway(iOrigination, newLoc) > gubNPCDistLimit) {
            goto("NEXTDIR");
          }
        }
      }

      // AI check for mines
      if (gpWorldLevelData[newLoc].uiFlags & MAPELEMENT_ENEMY_MINE_PRESENT && s.bSide != 0) {
        goto("NEXTDIR");
      }

      /*
      if ( gpWorldLevelData[newLoc].uiFlags & (MAPELEMENT_ENEMY_MINE_PRESENT | MAPELEMENT_PLAYER_MINE_PRESENT) )
      {
              if (s->bSide == 0)
              {
                      // For our team, skip a location with a known mines unless it is the end of our
                      // path; for others on our side, skip such locations completely;
                      if (s->bTeam != gbPlayerNum || newLoc != iDestination)
                      {
                              if (gpWorldLevelData[newLoc].uiFlags & MAPELEMENT_PLAYER_MINE_PRESENT)
                              {
                                      goto NEXTDIR;
                              }
                      }
              }
              else
              {
                      // For the enemy, always skip known mines
                      if (gpWorldLevelData[newLoc].uiFlags & MAPELEMENT_ENEMY_MINE_PRESENT)
                      {
                              goto NEXTDIR;
                      }
              }
      }
      */

      // how much is admission to the next tile
      if (gfPathAroundObstacles) {
        nextCost = gubWorldMovementCosts[newLoc][iCnt][ubLevel];

        // ATE:	Check for differences from reality
        // Is next cost an obstcale
        if (nextCost == TRAVELCOST_HIDDENOBSTACLE) {
          if (fPathingForPlayer) {
            // Is this obstcale a hidden tile that has not been revealed yet?
            if (DoesGridnoContainHiddenStruct(newLoc, addressof(fHiddenStructVisible))) {
              // Are we not visible, if so use terrain costs!
              if (!fHiddenStructVisible) {
                // Set cost of terrain!
                nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
              }
            }
          }
        } else if (nextCost == TRAVELCOST_NOT_STANDING) {
          // for path plotting purposes, use the terrain value
          nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
        } else if (nextCost == TRAVELCOST_EXITGRID) {
          if (gfPlotPathToExitGrid) {
            // replace with terrain cost so that we can plot path, otherwise is obstacle
            nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
          }
        } else if (nextCost == TRAVELCOST_FENCE && fNonFenceJumper) {
          goto("NEXTDIR");
        } else if (IS_TRAVELCOST_DOOR(nextCost)) {
          // don't let anyone path diagonally through doors!
          if (iCnt & 1) {
            goto("NEXTDIR");
          }

          switch (nextCost) {
            case TRAVELCOST_DOOR_CLOSED_HERE:
              fDoorIsObstacleIfClosed = true;
              iDoorGridNo = newLoc;
              break;
            case TRAVELCOST_DOOR_CLOSED_N:
              fDoorIsObstacleIfClosed = true;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTH];
              break;
            case TRAVELCOST_DOOR_CLOSED_W:
              fDoorIsObstacleIfClosed = true;
              iDoorGridNo = newLoc + dirDelta[Enum245.WEST];
              break;
            case TRAVELCOST_DOOR_OPEN_HERE:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc;
              break;
            case TRAVELCOST_DOOR_OPEN_N:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTH];
              break;
            case TRAVELCOST_DOOR_OPEN_NE:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTHEAST];
              break;
            case TRAVELCOST_DOOR_OPEN_E:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.EAST];
              break;
            case TRAVELCOST_DOOR_OPEN_SE:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.SOUTHEAST];
              break;
            case TRAVELCOST_DOOR_OPEN_S:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.SOUTH];
              break;
            case TRAVELCOST_DOOR_OPEN_SW:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.SOUTHWEST];
              break;
            case TRAVELCOST_DOOR_OPEN_W:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.WEST];
              break;
            case TRAVELCOST_DOOR_OPEN_NW:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTHWEST];
              break;
            case TRAVELCOST_DOOR_OPEN_N_N:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTH] + dirDelta[Enum245.NORTH];
              break;
            case TRAVELCOST_DOOR_OPEN_NW_N:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTHWEST] + dirDelta[Enum245.NORTH];
              break;
            case TRAVELCOST_DOOR_OPEN_NE_N:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTHEAST] + dirDelta[Enum245.NORTH];
              break;
            case TRAVELCOST_DOOR_OPEN_W_W:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.WEST] + dirDelta[Enum245.WEST];
              break;
            case TRAVELCOST_DOOR_OPEN_SW_W:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.SOUTHWEST] + dirDelta[Enum245.WEST];
              break;
            case TRAVELCOST_DOOR_OPEN_NW_W:
              fDoorIsObstacleIfClosed = false;
              iDoorGridNo = newLoc + dirDelta[Enum245.NORTHWEST] + dirDelta[Enum245.WEST];
              break;
            default:
              break;
          }

          if (fPathingForPlayer && gpWorldLevelData[iDoorGridNo].ubExtFlags[0] & MAPELEMENT_EXT_DOOR_STATUS_PRESENT) {
            // check door status
            pDoorStatus = GetDoorStatus(iDoorGridNo);
            if (pDoorStatus) {
              fDoorIsOpen = (pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN) != 0;
            } else {
              // door destroyed?
              nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
            }
          } else {
            // check door structure
            pDoorStructure = FindStructure(iDoorGridNo, STRUCTURE_ANYDOOR);
            if (pDoorStructure) {
              fDoorIsOpen = (pDoorStructure.value.fFlags & STRUCTURE_OPEN) != 0;
            } else {
              // door destroyed?
              nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
            }
          }

          // now determine movement cost... if it hasn't been changed already
          if (IS_TRAVELCOST_DOOR(nextCost)) {
            if (fDoorIsOpen) {
              if (fDoorIsObstacleIfClosed) {
                nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
              } else {
                nextCost = TRAVELCOST_OBSTACLE;
              }
            } else {
              if (fDoorIsObstacleIfClosed) {
                // door is closed and this should be an obstacle, EXCEPT if we are calculating
                // a path for an enemy or NPC with keys
                if (fPathingForPlayer || (s && (s.uiStatusFlags & SOLDIER_MONSTER || s.uiStatusFlags & SOLDIER_ANIMAL))) {
                  nextCost = TRAVELCOST_OBSTACLE;
                } else {
                  // have to check if door is locked and NPC does not have keys!
                  pDoor = FindDoorInfoAtGridNo(iDoorGridNo);
                  if (pDoor) {
                    if (!pDoor.fLocked || s.bHasKeys) {
                      // add to AP cost
                      if (gubNPCAPBudget) {
                        fGoingThroughDoor = true;
                      }
                      nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
                    } else {
                      nextCost = TRAVELCOST_OBSTACLE;
                    }
                  } else {
                    nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
                  }
                }
              } else {
                nextCost = gTileTypeMovementCost[gpWorldLevelData[newLoc].ubTerrainID];
              }
            }
          }
        } else if ((nextCost == TRAVELCOST_SHORE || nextCost == TRAVELCOST_KNEEDEEP || nextCost == TRAVELCOST_DEEPWATER) && fNonSwimmer) {
          // creatures and animals can't go in water
          nextCost = TRAVELCOST_OBSTACLE;
        }

        // Apr. '96 - moved up be ahead of AP_Budget stuff
        if ((nextCost >= NOPASS)) // || ( nextCost == TRAVELCOST_DOOR ) )
          goto("NEXTDIR");
      } else {
        nextCost = TRAVELCOST_FLAT;
      }

      if (newLoc > GRIDSIZE) {
        // WHAT THE??? hack.
        goto("NEXTDIR");
      }

      // if contemplated tile is NOT final dest and someone there, disqualify route
      // when doing a reachable test, ignore all locations with people in them
      if (fPathAroundPeople && ((newLoc != iDestination) || fCopyReachable)) {
        // ATE: ONLY cancel if they are moving.....
        ubMerc = WhoIsThere2(newLoc, s.bLevel);

        if (ubMerc < NOBODY && ubMerc != s.ubID) {
          // Check for movement....
          // if ( fTurnBased || ( (Menptr[ ubMerc ].sFinalDestination == Menptr[ ubMerc ].sGridNo) || (Menptr[ ubMerc ].fDelayedMovement) ) )
          //{
          goto("NEXTDIR");
          //}
          //	else
          //{
          //	nextCost += 50;
          //}
        }
      }

      if (fMultiTile) {
        // vehicle test for obstacles: prevent movement to next tile if
        // a tile covered by the vehicle in that position & direction
        // has an obstacle in it

        // because of the order in which animations are stored (dir 7 first,
        // then 0 1 2 3 4 5 6), we must subtract 1 from the direction
        // ATE: Send in our existing structure ID so it's ignored!

        if (!OkayToAddStructureToWorld(newLoc, ubLevel, pStructureFileRef.pDBStructureRef[iStructIndex], usOKToAddStructID)) {
          goto("NEXTDIR");
        }

        /*
        // vehicles aren't moving any more....
        if (fVehicle)
        {
                // transmogrify pathing costs for vehicles!
                switch(nextCost)
                {
                        case TRAVELCOST_THICK		:	nextCost = TRAVELCOST_GRASS;
                                                                                                                                break;
                        case TRAVELCOST_SHORE		:
                        case TRAVELCOST_KNEEDEEP:
                        case TRAVELCOST_DEEPWATER:
//						case TRAVELCOST_VEINEND	:
//						case TRAVELCOST_VEINMID	:
                        //case TRAVELCOST_DOOR		:
                        case TRAVELCOST_FENCE		:	nextCost = TRAVELCOST_OBSTACLE;
                                                                                                                                break;

                        default									:	break;
                }
        }
        */
      }

      // NEW Apr 21 by Ian: abort if cost exceeds budget
      if (gubNPCAPBudget) {
        switch (nextCost) {
          case TRAVELCOST_NONE:
            ubAPCost = 0;
            break;

          case TRAVELCOST_DIRTROAD:
          case TRAVELCOST_FLAT:
            ubAPCost = AP_MOVEMENT_FLAT;
            break;
          // case TRAVELCOST_BUMPY	:
          case TRAVELCOST_GRASS:
            ubAPCost = AP_MOVEMENT_GRASS;
            break;
          case TRAVELCOST_THICK:
            ubAPCost = AP_MOVEMENT_BUSH;
            break;
          case TRAVELCOST_DEBRIS:
            ubAPCost = AP_MOVEMENT_RUBBLE;
            break;
          case TRAVELCOST_SHORE:
            ubAPCost = AP_MOVEMENT_SHORE; // wading shallow water
            break;
          case TRAVELCOST_KNEEDEEP:
            ubAPCost = AP_MOVEMENT_LAKE; // wading waist/chest deep - very slow
            break;

          case TRAVELCOST_DEEPWATER:
            ubAPCost = AP_MOVEMENT_OCEAN; // can swim, so it's faster than wading
            break;
            // case TRAVELCOST_VEINEND	:
            // case TRAVELCOST_VEINMID	: ubAPCost = AP_MOVEMENT_FLAT;
            //													break;

            // case TRAVELCOST_DOOR		:	ubAPCost = AP_MOVEMENT_FLAT;
            //													break;

          case TRAVELCOST_FENCE:
            ubAPCost = AP_JUMPFENCE;

            /*
                                    if ( sSwitchValue == TRAVELCOST_FENCE )
                                    {
                                            sPoints += sTileCost;

                                            // If we are changeing stance ( either before or after getting there....
                                            // We need to reflect that...
                                            switch(usMovementMode)
                                            {
                                                    case RUNNING:
                                                    case WALKING :

                                                            // Add here cost to go from crouch to stand AFTER fence hop....
                                                            // Since it's AFTER.. make sure we will be moving after jump...
                                                            if ( ( iCnt + 2 ) < iLastGrid )
                                                            {
                                                                    sPoints += AP_CROUCH;
                                                            }
                                                            break;

                                                    case SWATTING:

                                                            // Add cost to stand once there BEFORE....
                                                            sPoints += AP_CROUCH;
                                                            break;

                                                    case CRAWLING:

                                                            // Can't do it here.....
                                                            break;

                                            }
                                    }

            */

            break;

          case TRAVELCOST_OBSTACLE:
          default:
            goto("NEXTDIR"); // Cost too much to be considered!
            break;
        }

        // don't make the mistake of adding directly to
        // ubCurAPCost, that must be preserved for remaining dirs!
        if (iCnt & 1) {
          // ubAPCost++;
          // ubAPCost = gubDiagCost[ubAPCost];
          ubAPCost = (ubAPCost * 14) / 10;
        }

        usMovementModeToUseForAPs = usMovementMode;

        // ATE: if water, force to be walking always!
        if (nextCost == TRAVELCOST_SHORE || nextCost == TRAVELCOST_KNEEDEEP || nextCost == TRAVELCOST_DEEPWATER) {
          usMovementModeToUseForAPs = Enum193.WALKING;
        }

        // adjust AP cost for movement mode
        switch (usMovementModeToUseForAPs) {
          case Enum193.RUNNING:
          case Enum193.ADULTMONSTER_WALKING:
            // save on casting
            ubAPCost = ubAPCost * 10 / ((RUNDIVISOR * 10));
            // ubAPCost = (INT16)(DOUBLE)( (sTileCost / RUNDIVISOR) );	break;
            break;
          case Enum193.WALKING:
          case Enum193.ROBOT_WALK:
            ubAPCost = (ubAPCost + WALKCOST);
            break;
          case Enum193.SWATTING:
            ubAPCost = (ubAPCost + SWATCOST);
            break;
          case Enum193.CRAWLING:
            ubAPCost = (ubAPCost + CRAWLCOST);
            break;
        }

        if (nextCost == TRAVELCOST_FENCE) {
          switch (usMovementModeToUseForAPs) {
            case Enum193.RUNNING:
            case Enum193.WALKING:
              // Here pessimistically assume the path will continue after hopping the fence
              ubAPCost += AP_CROUCH;
              break;

            case Enum193.SWATTING:

              // Add cost to stand once there BEFORE jumping....
              ubAPCost += AP_CROUCH;
              break;

            case Enum193.CRAWLING:

              // Can't do it here.....
              goto("NEXTDIR");
          }
        } else if (nextCost == TRAVELCOST_NOT_STANDING) {
          switch (usMovementModeToUseForAPs) {
            case Enum193.RUNNING:
            case Enum193.WALKING:
              // charge crouch APs for ducking head!
              ubAPCost += AP_CROUCH;
              break;

            default:
              break;
          }
        } else if (fGoingThroughDoor) {
          ubAPCost += AP_OPEN_DOOR;
          fGoingThroughDoor = false;
        }

        ubNewAPCost = ubCurAPCost + ubAPCost;

        if (ubNewAPCost > gubNPCAPBudget)
          goto("NEXTDIR");
      }

      // ATE: Uncommented out for doors, if we are at a door but not dest, continue!
      //	if ( nextCost == TRAVELCOST_DOOR  ) //&& newLoc != iDestination)
      //	      goto NEXTDIR;
      /*
                              // FOLLOWING SECTION COMMENTED OUT ON MARCH 7/97 BY IC

                              if (nextCost == SECRETCOST && !s->human)
                                   goto NEXTDIR;

                              if (prevCost==VEINMIDCOST)
                                      if (!ISVEIN(nextCost))
                                              goto NEXTDIR;
                              //veining check
                              if (nextCost==VEINMIDCOST)
                                      if (!ISVEIN(prevCost))
                                              goto NEXTDIR;

                              if (nextCost==VEINMIDCOST)
                                //if (ISVEIN(nextCost))
                                      nextCost=VEINCOST;
                              else
                                 if (nextCost==VEINENDCOST)
                                   if (Grid[newLoc].land < LAKE1)
                                      nextCost = VEINCOST;
                                   else
                                      nextCost = OCEANCOST+(10*PATHFACTOR);

              */

      if (fCloseGoodEnough) {
        if (PythSpacesAway(newLoc, sDestination) <= sClosePathLimit) {
          // stop the path here!
          iDestination = newLoc;
          sDestination = newLoc;
          fCloseGoodEnough = false;
        }
      }
      // make the destination look very attractive
      if (newLoc == iDestination)
        nextCost = 0;
      else
          // if (_KeyDown(CTRL_DOWN) && nextCost < TRAVELCOST_VEINEND)
          if (gfPlotDirectPath && nextCost < NOPASS)
        nextCost = TRAVELCOST_FLAT;

      // if (ISVEIN(prevCost))
      //		prevCost=VEINCOST;

      // make water cost attractive for water to water paths
      if (iWaterToWater) {
        if (ISWATER(prevCost))
          prevCost = EASYWATERCOST;
        if (ISWATER(nextCost))
          nextCost = EASYWATERCOST;
      }

      // NOTE: on September 24, 1997, Chris went back to a diagonal bias system
      if (iCnt & 1) {
        // moving on a diagonal
        // nextCost = gubDiagCost[nextCost];
        nextCost = nextCost * 14 / 10;
        // nextCost++;
      }

      if (bLoopState == LOOPING_REVERSE) {
        // penalize moving backwards to encourage turning sooner
        nextCost += 50;
      }

      newTotCost = curCost + nextCost;

      /*
      // no diagonal bias - straightforward costing regardless of direction
                              newTotCost = curCost + nextCost;


      // NOTE: ON JAN 6TH, 1995, IAN COMMENTED OUT THE DIAGONAL BIAS AND
      //       UNCOMMENTED THE "NO DIAGONAL BIAS"
      //diagonal bias - this makes diagonal moves cost more


                  if (iCnt & 1)
                              // diagonal move costs 70 percent
                                   //newTotCost += (nextCost/PATHFACTOR);
                                   newTotCost += 1;
      //				newTotCost = curCost + ((prevCost+nextCost)*7)/10;
      //			else	// non-diagonal costs only 50%
      //				newTotCost = curCost + (prevCost+nextCost)/2;
      */

      // have we found a path to the current location that
      // costs less than the best so far to the same location?
      if (trailCostUsed[newLoc] != gubGlobalPathCount || newTotCost < trailCost[newLoc]) {
        // NEWQUENODE;
        {
          if (queRequests < QPOOLNDX()) {
            pNewPtr = pathQ + (queRequests);
            queRequests++;
            memset(pNewPtr.value.pNext, 0, sizeof(path_t /* Pointer<path_t> */) * ABSMAX_SKIPLIST_LEVEL);
            pNewPtr.value.bLevel = RandomSkipListLevel();
          } else if (iClosedListSize > 0) {
            pNewPtr = pClosedHead.pNext[0];
            pClosedHead.pNext[0] = pNewPtr.value.pNext[0];
            iClosedListSize--;
            queRequests++;
            memset(pNewPtr.value.pNext, 0, sizeof(path_t /* Pointer<path_t> */) * ABSMAX_SKIPLIST_LEVEL);
            pNewPtr.value.bLevel = RandomSkipListLevel();
          } else {
            pNewPtr = null;
          }
        }

        if (pNewPtr == null) {
          gubNPCAPBudget = 0;
          gubNPCDistLimit = 0;
          return 0;
        }

        // make new path to current location
        trailTree[trailTreeNdx].nextLink = sCurPathNdx;
        trailTree[trailTreeNdx].stepDir = iCnt;
        if (bLoopState == LOOPING_REVERSE) {
          trailTree[trailTreeNdx].fFlags = Enum248.STEP_BACKWARDS;
        } else {
          trailTree[trailTreeNdx].fFlags = 0;
        }
        trailTree[trailTreeNdx].sGridNo = newLoc;
        pNewPtr.value.sPathNdx = trailTreeNdx;
        trailTreeNdx++;

        if (trailTreeNdx >= iMaxTrailTree) {
          gubNPCAPBudget = 0;
          gubNPCDistLimit = 0;
          return 0;
        }

        iLocY = newLoc / MAPWIDTH;
        iLocX = newLoc % MAPWIDTH;
        SETLOC(pNewPtr.value, newLoc);
        pNewPtr.value.usCostSoFar = newTotCost;
        pNewPtr.value.usCostToGo = REMAININGCOST(pNewPtr);
        if (fCopyReachable) {
          pNewPtr.value.usCostToGo = 100;
        } else {
          pNewPtr.value.usCostToGo = REMAININGCOST(pNewPtr);
        }

        pNewPtr.value.usTotalCost = newTotCost + pNewPtr.value.usCostToGo;
        pNewPtr.value.ubLegDistance = LEGDISTANCE(iLocX, iLocY, iDestX, iDestY);

        if (gubNPCAPBudget) {
          // save the AP cost so far along this path
          pNewPtr.value.ubTotalAPCost = ubNewAPCost;
          // update the AP costs in the AI array of path costs if necessary...
          if (fCopyPathCosts) {
            iX = AI_PATHCOST_RADIUS + iLocX - iOriginationX;
            iY = AI_PATHCOST_RADIUS + iLocY - iOriginationY;
            gubAIPathCosts[iX][iY] = ubNewAPCost;
          }
        }

        // update the trail map to reflect the newer shorter path
        trailCost[newLoc] = newTotCost;
        trailCostUsed[newLoc] = gubGlobalPathCount;

        // do a sorted que insert of the new path
        // COMMENTED OUT TO DO BOUNDS CHECKER CC JAN 18 99
        // QUEINSERT(pNewPtr);
        //#define SkipListInsert( pNewPtr )
        {
          pCurr = pQueueHead;
          uiCost = TOTALCOST(pNewPtr);
          memset(pUpdate, 0, MAX_SKIPLIST_LEVEL * sizeof(path_t /* Pointer<path_t> */));
          for (iCurrLevel = bSkipListLevel - 1; iCurrLevel >= 0; iCurrLevel--) {
            pNext = pCurr.value.pNext[iCurrLevel];
            while (pNext) {
              if (uiCost > TOTALCOST(pNext) || (uiCost == TOTALCOST(pNext) && FARTHER(pNewPtr, pNext))) {
                pCurr = pNext;
                pNext = pCurr.value.pNext[iCurrLevel];
              } else {
                break;
              }
            }
            pUpdate[iCurrLevel] = pCurr;
          }
          pCurr = pCurr.value.pNext[0];
          for (iCurrLevel = 0; iCurrLevel < pNewPtr.value.bLevel; iCurrLevel++) {
            if (!(pUpdate[iCurrLevel])) {
              break;
            }
            pNewPtr.value.pNext[iCurrLevel] = pUpdate[iCurrLevel].value.pNext[iCurrLevel];
            pUpdate[iCurrLevel].value.pNext[iCurrLevel] = pNewPtr;
          }
          iSkipListSize++;
          if (iSkipListSize > iSkipListLevelLimit[bSkipListLevel]) {
            pCurr = pQueueHead;
            pNext = pQueueHead.value.pNext[bSkipListLevel - 1];
            while (pNext) {
              if (pNext.value.bLevel > bSkipListLevel) {
                pCurr.value.pNext[bSkipListLevel] = pNext;
                pCurr = pNext;
              }
              pNext = pNext.value.pNext[bSkipListLevel - 1];
            }
            pCurr.value.pNext[bSkipListLevel] = pNext;
            bSkipListLevel++;
          }
        }
      }

    NEXTDIR:
      if (bLoopState == LOOPING_CLOCKWISE) // backwards
      {
        iCnt = gOneCCDirection[iCnt];
      } else {
        iCnt = gOneCDirection[iCnt];
      }
      if (iCnt == iLoopEnd) {
      ENDOFLOOP:
        break;
      } else if (fContinuousTurnNeeded && iCnt == gOppositeDirection[iLoopStart]) {
        fCheckedBehind = true;
      }
    }
  } while (pathQNotEmpty() && pathNotYetFound());

  // work finished. Did we find a path?
  if (pathQNotEmpty() && pathFound()) {
    let z: INT16;
    let _z: INT16;
    let _nextLink: INT16; //,tempgrid;

    _z = 0;
    z = pQueueHead.value.pNext[0].value.sPathNdx;

    while (z) {
      _nextLink = trailTree[z].nextLink;
      trailTree[z].nextLink = _z;
      _z = z;
      z = _nextLink;
    }

    // if this function was called because a solider is about to embark on an actual route
    // (as opposed to "test" path finding (used by cursor, etc), then grab all pertinent
    // data and copy into soldier's database
    if (bCopy == COPYROUTE) {
      z = _z;

      for (iCnt = 0; z && (iCnt < MAX_PATH_LIST_SIZE); iCnt++) {
        s.usPathingData[iCnt] = trailTree[z].stepDir;

        z = trailTree[z].nextLink;
      }

      s.usPathIndex = 0;
      s.usPathDataSize = iCnt;
    } else if (bCopy == NO_COPYROUTE) {
      z = _z;

      for (iCnt = 0; z != 0; iCnt++) {
        guiPathingData[iCnt] = trailTree[z].stepDir;

        z = trailTree[z].nextLink;
      }

      giPathDataSize = iCnt;
    }

// return path length : serves as a "successful" flag and a path length counter
    gubNPCAPBudget = 0;
    gubNPCDistLimit = 0;

    // TEMP:  This is returning zero when I am generating edgepoints, so I am force returning 1 until
    //       this is fixed?
    if (gfGeneratingMapEdgepoints) {
      return true;
    }

    return iCnt;
  }

  // failed miserably, report...
  gubNPCAPBudget = 0;
  gubNPCDistLimit = 0;
  return 0;
}

export function GlobalReachableTest(sStartGridNo: INT16): void {
  let s: SOLDIERTYPE = createSoldierType();
  let iCurrentGridNo: INT32 = 0;

  s.sGridNo = sStartGridNo;
  s.bLevel = 0;
  s.bTeam = 1;

  // reset the flag for gridno's
  for (iCurrentGridNo = 0; iCurrentGridNo < WORLD_MAX; iCurrentGridNo++) {
    gpWorldLevelData[iCurrentGridNo].uiFlags &= ~(MAPELEMENT_REACHABLE);
  }

  ReconfigurePathAI(ABSMAX_SKIPLIST_LEVEL, ABSMAX_TRAIL_TREE, ABSMAX_PATHQ);
  FindBestPath(s, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE);
  RestorePathAIToDefaults();
}

export function LocalReachableTest(sStartGridNo: INT16, bRadius: INT8): void {
  let s: SOLDIERTYPE = createSoldierType();
  let iCurrentGridNo: INT32 = 0;
  let iX: INT32;
  let iY: INT32;

  s.sGridNo = sStartGridNo;

  // if we are moving on the gorund level
  if (gsInterfaceLevel == Enum214.I_ROOF_LEVEL) {
    s.bLevel = 1;
  } else {
    s.bLevel = 0;
  }

  s.bTeam = OUR_TEAM;

  // reset the flag for gridno's
  for (iY = -bRadius; iY <= bRadius; iY++) {
    for (iX = -bRadius; iX <= bRadius; iX++) {
      iCurrentGridNo = sStartGridNo + iX + iY * MAXCOL;
      if (iCurrentGridNo >= 0 && iCurrentGridNo <= WORLD_MAX) {
        gpWorldLevelData[iCurrentGridNo].uiFlags &= ~(MAPELEMENT_REACHABLE);
      }
    }
  }

  // set the dist limit
  gubNPCDistLimit = bRadius;
  // make the function call
  FindBestPath(s, NOWHERE, s.bLevel, Enum193.WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE);
  // reset dist limit
  gubNPCDistLimit = 0;
}

export function GlobalItemsReachableTest(sStartGridNo1: INT16, sStartGridNo2: INT16): void {
  let s: SOLDIERTYPE = createSoldierType();
  let iCurrentGridNo: INT32 = 0;

  s.sGridNo = sStartGridNo1;
  s.bLevel = 0;
  s.bTeam = 1;

  // reset the flag for gridno's
  for (iCurrentGridNo = 0; iCurrentGridNo < WORLD_MAX; iCurrentGridNo++) {
    gpWorldLevelData[iCurrentGridNo].uiFlags &= ~(MAPELEMENT_REACHABLE);
  }

  ReconfigurePathAI(ABSMAX_SKIPLIST_LEVEL, ABSMAX_TRAIL_TREE, ABSMAX_PATHQ);
  FindBestPath(s, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE);
  if (sStartGridNo2 != NOWHERE) {
    s.sGridNo = sStartGridNo2;
    FindBestPath(s, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE);
  }
  RestorePathAIToDefaults();
}

export function RoofReachableTest(sStartGridNo: INT16, ubBuildingID: UINT8): void {
  let s: SOLDIERTYPE = createSoldierType();

  s.sGridNo = sStartGridNo;
  s.bLevel = 1;
  s.bTeam = 1;

  gubBuildingInfoToSet = ubBuildingID;

  ReconfigurePathAI(ABSMAX_SKIPLIST_LEVEL, ABSMAX_TRAIL_TREE, ABSMAX_PATHQ);
  FindBestPath(s, NOWHERE, 1, Enum193.WALKING, COPYREACHABLE, 0);
  RestorePathAIToDefaults();

  // set start position to reachable since path code sets it unreachable
  gpWorldLevelData[sStartGridNo].uiFlags |= MAPELEMENT_REACHABLE;

  // reset building variable
  gubBuildingInfoToSet = 0;
}

export function ErasePath(bEraseOldOne: char): void {
  let iCnt: INT16;

  // NOTE: This routine must be called BEFORE anything happens that changes
  //       a merc's gridno, else the....

  // EraseAPCursor();

  if (gfUIHandleShowMoveGrid) {
    gfUIHandleShowMoveGrid = 0;

    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS4);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS9);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS2);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS13);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS15);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS19);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS20);
  }

  if (!gusPathShown) {
    // OldPath = FALSE;
    return;
  }

  // if (OldPath > 0 && !eraseOldOne)
  //   return;

  // OldPath = FALSE;

  gusPathShown = false;

  for (iCnt = 0; iCnt < giPlotCnt; iCnt++) {
    // Grid[PlottedPath[cnt]].fstep = 0;

    RemoveAllObjectsOfTypeRange(guiPlottedPath[iCnt], Enum313.FOOTPRINTS, Enum313.FOOTPRINTS);

    RemoveAllOnRoofsOfTypeRange(guiPlottedPath[iCnt], Enum313.FOOTPRINTS, Enum313.FOOTPRINTS);

    // RemoveAllObjectsOfTypeRange( guiPlottedPath[iCnt], FIRSTPOINTERS, FIRSTPOINTERS );
  }

  // for (cnt=0; cnt < GRIDSIZE; cnt++)
  //    Grid[cnt].fstep = 0;
  // RemoveAllStructsOfTypeRange( gusEndPlotGridNo, GOODRING, GOODRING );

  giPlotCnt = 0;
  guiPlottedPath.fill(0);
}

export function PlotPath(pSold: SOLDIERTYPE, sDestGridno: INT16, bCopyRoute: INT8, bPlot: INT8, bStayOn: INT8, usMovementMode: UINT16, bStealth: INT8, bReverse: INT8, sAPBudget: INT16): INT16 {
  let sTileCost: INT16;
  let sPoints: INT16 = 0;
  let sTempGrid: INT16;
  let sAnimCost: INT16 = 0;
  let sPointsWalk: INT16 = 0;
  let sPointsCrawl: INT16 = 0;
  let sPointsRun: INT16 = 0;
  let sPointsSwat: INT16 = 0;
  let sExtraCostStand: INT16;
  let sExtraCostSwat: INT16;
  let sExtraCostCrawl: INT16;
  let iLastGrid: INT32;
  let iCnt: INT32;
  let sOldGrid: INT16 = 0;
  let sFootOrderIndex: INT16;
  let sSwitchValue: INT16;
  let sFootOrder: INT16[] /* [5] */ = [
    GREENSTEPSTART,
    PURPLESTEPSTART,
    BLUESTEPSTART,
    ORANGESTEPSTART,
    REDSTEPSTART,
  ];
  let usTileIndex: UINT16;
  let usTileNum: UINT16;
  let pNode: LEVELNODE;
  let usMovementModeToUseForAPs: UINT16;
  let bIgnoreNextCost: boolean = false;
  let sTestGridno: INT16;

  if (bPlot && gusPathShown) {
    ErasePath(false);
  }

  gusAPtsToMove = 0;
  sTempGrid = pSold.sGridNo;

  sFootOrderIndex = 0;

  // gubNPCMovementMode = (UINT8) usMovementMode;
  // distance limit to reduce the cost of plotting a path to a location we can't reach

  // For now, use known hight adjustment
  if (gfRecalculatingExistingPathCost || FindBestPath(pSold, sDestGridno, pSold.bLevel, usMovementMode, bCopyRoute, 0)) {
    // if soldier would be STARTING to run then he pays a penalty since it takes time to
    // run full speed
    if (pSold.usAnimState != Enum193.RUNNING) {
      // for estimation purposes, always pay penalty
      sPointsRun = AP_START_RUN_COST;
    }

    // Add to points, those needed to start from different stance!
    sPoints += MinAPsToStartMovement(pSold, usMovementMode);

    // We should reduce points for starting to run if first tile is a fence...
    sTestGridno = NewGridNo(pSold.sGridNo, DirectionInc(guiPathingData[0]));
    if (gubWorldMovementCosts[sTestGridno][guiPathingData[0]][pSold.bLevel] == TRAVELCOST_FENCE) {
      if (usMovementMode == Enum193.RUNNING && pSold.usAnimState != Enum193.RUNNING) {
        sPoints -= AP_START_RUN_COST;
      }
    }

    // FIRST, add up "startup" additional costs - such as intermediate animations, etc.
    switch (pSold.usAnimState) {
      // case START_AID   :
      // case GIVING_AID  :	sAnimCost = AP_STOP_FIRST_AID;
      //										break;
      // case TWISTOMACH  :
      // case COLLAPSED   :	sAnimCost = AP_GET_UP;
      //										break;
      // case TWISTBACK   :
      // case UNCONSCIOUS :	sAnimCost = (AP_ROLL_OVER+AP_GET_UP);
      //										break;

      //	case CROUCHING	 :  if (usMovementMode == WALKING || usMovementMode == RUNNING)
      //													sAnimCost = AP_CROUCH;
      //											break;
    }

    sPoints += sAnimCost;
    gusAPtsToMove += sAnimCost;

    if (bStayOn) {
      iLastGrid = giPathDataSize + 1;
    } else {
      iLastGrid = giPathDataSize;
    }

    for (iCnt = 0; iCnt < iLastGrid; iCnt++) {
      sExtraCostStand = 0;
      sExtraCostSwat = 0;
      sExtraCostCrawl = 0;
      // what is the next gridno in the path?
      sOldGrid = sTempGrid;

      sTempGrid = NewGridNo(sTempGrid, DirectionInc(guiPathingData[iCnt]));

      // Get switch value...
      sSwitchValue = gubWorldMovementCosts[sTempGrid][guiPathingData[iCnt]][pSold.bLevel];

      // get the tile cost for that tile based on WALKING
      sTileCost = TerrainActionPoints(pSold, sTempGrid, guiPathingData[iCnt], pSold.bLevel);

      usMovementModeToUseForAPs = usMovementMode;

      // ATE - MAKE MOVEMENT ALWAYS WALK IF IN WATER
      if (gpWorldLevelData[sTempGrid].ubTerrainID == Enum315.DEEP_WATER || gpWorldLevelData[sTempGrid].ubTerrainID == Enum315.MED_WATER || gpWorldLevelData[sTempGrid].ubTerrainID == Enum315.LOW_WATER) {
        usMovementModeToUseForAPs = Enum193.WALKING;
      }

      if (bIgnoreNextCost) {
        bIgnoreNextCost = false;
      } else {
        // ATE: If we have a 'special cost, like jump fence...
        if (sSwitchValue == TRAVELCOST_FENCE) {
          sPoints += sTileCost;

          bIgnoreNextCost = true;

          // If we are changeing stance ( either before or after getting there....
          // We need to reflect that...
          switch (usMovementModeToUseForAPs) {
            case Enum193.RUNNING:
            case Enum193.WALKING:

              // Add here cost to go from crouch to stand AFTER fence hop....
              // Since it's AFTER.. make sure we will be moving after jump...
              if ((iCnt + 2) < iLastGrid) {
                sExtraCostStand += AP_CROUCH;

                // ATE: if running, charge extra point to srart again
                if (usMovementModeToUseForAPs == Enum193.RUNNING) {
                  sExtraCostStand++;
                }

                sPoints += sExtraCostStand;
              }
              break;

            case Enum193.SWATTING:

              // Add cost to stand once there BEFORE....
              sExtraCostSwat += AP_CROUCH;
              sPoints += sExtraCostSwat;
              break;

            case Enum193.CRAWLING:

              // Can't do it here.....
              break;
          }
        } else if (sTileCost > 0) {
          // else, movement is adjusted based on mode...

          if (sSwitchValue == TRAVELCOST_NOT_STANDING) {
            switch (usMovementModeToUseForAPs) {
              case Enum193.RUNNING:
              case Enum193.WALKING:
                // charge crouch APs for ducking head!
                sExtraCostStand += AP_CROUCH;
                break;

              default:
                break;
            }
          }

          // so, then we must modify it for other movement styles and accumulate
          switch (usMovementModeToUseForAPs) {
            case Enum193.RUNNING:
              sPoints += ((sTileCost / RUNDIVISOR)) + sExtraCostStand;
              break;
            case Enum193.WALKING:
              sPoints += (sTileCost + WALKCOST) + sExtraCostStand;
              break;
            case Enum193.SWATTING:
              sPoints += (sTileCost + SWATCOST) + sExtraCostSwat;
              break;
            case Enum193.CRAWLING:
              sPoints += (sTileCost + CRAWLCOST) + sExtraCostCrawl;
              break;
            default:
              sPoints += sTileCost;
              break;
          }
        }
      }

      // THIS NEXT SECTION ONLY NEEDS TO HAPPEN FOR CURSOR UI FEEDBACK, NOT ACTUAL COSTING

      if (bPlot && ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT))) // OR USER OPTION ON... ***)
      {
        // ATE; TODO: Put stuff in here to allow for fact of costs other than movement ( jump fence, open door )

        // store WALK cost
        sPointsWalk += (sTileCost + WALKCOST) + sExtraCostStand;

        // now get cost as if CRAWLING
        sPointsCrawl += (sTileCost + CRAWLCOST) + sExtraCostCrawl;

        // now get cost as if SWATTING
        sPointsSwat += (sTileCost + SWATCOST) + sExtraCostSwat;

        // now get cost as if RUNNING
        sPointsRun += ((sTileCost / RUNDIVISOR)) + sExtraCostStand;
      }

      if (iCnt == 0 && bPlot) {
        gusAPtsToMove = sPoints;

        giPlotCnt = 0;
      }

      // if ( gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT) ) // OR USER OPTION "show paths" ON... ***
      {
        if (bPlot && ((iCnt < (iLastGrid - 1)) || (iCnt < iLastGrid && bStayOn))) {
          guiPlottedPath[giPlotCnt++] = sTempGrid;

          // we need a footstep graphic ENTERING the next tile

          // get the direction
          usTileNum = guiPathingData[iCnt] + 2;
          if (usTileNum > 8) {
            usTileNum = 1;
          }

          // Are we a vehicle?
          if (pSold.uiStatusFlags & SOLDIER_VEHICLE) {
            // did we exceed WALK cost?
            if (sPointsSwat > sAPBudget) {
              sFootOrderIndex = 4;
            } else {
              sFootOrderIndex = 3;
            }
          } else {
            // did we exceed CRAWL cost?
            if (sFootOrderIndex == 0 && sPointsCrawl > sAPBudget) {
              sFootOrderIndex++;
            }

            // did we exceed WALK cost?
            if (sFootOrderIndex == 1 && sPointsSwat > sAPBudget) {
              sFootOrderIndex++;
            }

            // did we exceed SWAT cost?
            if (sFootOrderIndex == 2 && sPointsWalk > sAPBudget) {
              sFootOrderIndex++;
            }

            // did we exceed RUN cost?
            if (sFootOrderIndex == 3 && sPointsRun > sAPBudget) {
              sFootOrderIndex++;
            }
          }

          usTileIndex = GetTileIndexFromTypeSubIndex(Enum313.FOOTPRINTS, usTileNum);

          // Adjust based on what mode we are in...
          if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            // find out which color we're using
            usTileIndex += sFootOrder[4];
          } else // turn based
          {
            // find out which color we're using
            usTileIndex += sFootOrder[sFootOrderIndex];
          }

          /*
          if ( sPoints <= sAPBudget)
          {
                  // find out which color we're using
                  usTileIndex += sFootOrder[sFootOrderIndex];
          }
          else
          {
                  // use red footprints ( offset by 16 )
                  usTileIndex += REDSTEPSTART;
          }
          */

          if (pSold.bLevel == 0) {
            pNode = AddObjectToTail(sTempGrid, usTileIndex);
            pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          } else {
            pNode = <LEVELNODE>AddOnRoofToTail(sTempGrid, usTileIndex);
            pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          }

          // we need a footstep graphic LEAVING this tile

          // get the direction using the NEXT tile (thus iCnt+1 as index)
          usTileNum = guiPathingData[iCnt + 1] + 2;
          if (usTileNum > 8) {
            usTileNum = 1;
          }

          // this is a LEAVING footstep which is always the second set of 8
          usTileNum += 8;

          usTileIndex = GetTileIndexFromTypeSubIndex(Enum313.FOOTPRINTS, usTileNum);

          // Adjust based on what mode we are in...
          if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
            // find out which color we're using
            usTileIndex += sFootOrder[4];
          } else // turnbased
          {
            // find out which color we're using
            usTileIndex += sFootOrder[sFootOrderIndex];
          }

          if (pSold.bLevel == 0) {
            pNode = AddObjectToTail(sTempGrid, usTileIndex);
            pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          } else {
            pNode = <LEVELNODE>AddOnRoofToTail(sTempGrid, usTileIndex);
            pNode.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            pNode.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          }
        }
      } // end of if turn based or real-time user option "show paths" on...
    }

    if (bPlot) {
      gusPathShown = true;
    }
  } // end of found a path

  // reset distance limit
  gubNPCDistLimit = 0;

  return sPoints;
}

export function UIPlotPath(pSold: SOLDIERTYPE, sDestGridno: INT16, bCopyRoute: INT8, bPlot: INT8, bStayOn: INT8, usMovementMode: UINT16, bStealth: INT8, bReverse: INT8, sAPBudget: INT16): INT16 {
  // This function is specifically for UI calls to the pathing routine, to
  // check whether the shift key is pressed, etc.
  let sRet: INT16;

  if (_KeyDown(SHIFT)) {
    gfPlotDirectPath = true;
  }

  // If we are on the same level as the interface level, continue, else return
  if (pSold.bLevel != gsInterfaceLevel) {
    return 0;
  }

  if (gGameSettings.fOptions[Enum8.TOPTION_ALWAYS_SHOW_MOVEMENT_PATH]) {
    bPlot = PLOT;
  }

  sRet = PlotPath(pSold, sDestGridno, bCopyRoute, bPlot, bStayOn, usMovementMode, bStealth, bReverse, sAPBudget);
  gfPlotDirectPath = false;
  return sRet;
}

export function RecalculatePathCost(pSoldier: SOLDIERTYPE, usMovementMode: UINT16): INT16 {
  // AI function for a soldier already with a path; this will return the cost of that path using the given movement mode
  let sRet: INT16;

  if (!pSoldier.bPathStored || pSoldier.usPathDataSize == 0) {
    return 0;
  }

  gfRecalculatingExistingPathCost = true;
  sRet = PlotPath(pSoldier, pSoldier.sFinalDestination, NO_COPYROUTE, NO_PLOT, TEMPORARY, usMovementMode, NOT_STEALTH, FORWARD, 0);
  gfRecalculatingExistingPathCost = false;
  return sRet;
}

export function EstimatePlotPath(pSold: SOLDIERTYPE, sDestGridno: INT16, bCopyRoute: INT8, bPlot: INT8, bStayOn: INT8, usMovementMode: UINT16, bStealth: INT8, bReverse: INT8, sAPBudget: INT16): INT16 {
  // This function is specifically for AI calls to estimate path cost to a location
  // It sets stuff up to ignore all people
  let sRet: INT16;

  gfEstimatePath = true;

  sRet = PlotPath(pSold, sDestGridno, bCopyRoute, bPlot, bStayOn, usMovementMode, bStealth, bReverse, sAPBudget);

  gfEstimatePath = false;

  return sRet;
}

export function InternalDoorTravelCost(pSoldier: SOLDIERTYPE | null, iGridNo: INT32, ubMovementCost: UINT8, fReturnPerceivedValue: boolean, piDoorGridNo: Pointer<INT32>, fReturnDoorCost: boolean): UINT8 {
  // This function will return either TRAVELCOST_DOOR (in place of closed door cost),
  // TRAVELCOST_OBSTACLE, or the base ground terrain
  // travel cost, depending on whether or not the door is open or closed etc.
  let fDoorIsObstacleIfClosed: boolean = false;
  let iDoorGridNo: INT32 = -1;
  let pDoorStatus: DOOR_STATUS | null;
  let pDoor: DOOR | null;
  let pDoorStructure: STRUCTURE | null;
  let fDoorIsOpen: boolean;
  let ubReplacementCost: UINT8;

  if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
    ubReplacementCost = TRAVELCOST_OBSTACLE;

    switch (ubMovementCost) {
      case TRAVELCOST_DOOR_CLOSED_HERE:
        fDoorIsObstacleIfClosed = true;
        iDoorGridNo = iGridNo;
        ubReplacementCost = TRAVELCOST_DOOR;
        break;
      case TRAVELCOST_DOOR_CLOSED_N:
        fDoorIsObstacleIfClosed = true;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTH];
        ubReplacementCost = TRAVELCOST_DOOR;
        break;
      case TRAVELCOST_DOOR_CLOSED_W:
        fDoorIsObstacleIfClosed = true;
        iDoorGridNo = iGridNo + dirDelta[Enum245.WEST];
        ubReplacementCost = TRAVELCOST_DOOR;
        break;
      case TRAVELCOST_DOOR_OPEN_HERE:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo;
        break;
      case TRAVELCOST_DOOR_OPEN_N:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTH];
        break;
      case TRAVELCOST_DOOR_OPEN_NE:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTHEAST];
        break;
      case TRAVELCOST_DOOR_OPEN_E:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.EAST];
        break;
      case TRAVELCOST_DOOR_OPEN_SE:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.SOUTHEAST];
        break;
      case TRAVELCOST_DOOR_OPEN_S:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.SOUTH];
        break;
      case TRAVELCOST_DOOR_OPEN_SW:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.SOUTHWEST];
        break;
      case TRAVELCOST_DOOR_OPEN_W:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.WEST];
        break;
      case TRAVELCOST_DOOR_OPEN_NW:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTHWEST];
        break;
      case TRAVELCOST_DOOR_OPEN_N_N:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTH] + dirDelta[Enum245.NORTH];
        break;
      case TRAVELCOST_DOOR_OPEN_NW_N:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTHWEST] + dirDelta[Enum245.NORTH];
        break;
      case TRAVELCOST_DOOR_OPEN_NE_N:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTHEAST] + dirDelta[Enum245.NORTH];
        break;
      case TRAVELCOST_DOOR_OPEN_W_W:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.WEST] + dirDelta[Enum245.WEST];
        break;
      case TRAVELCOST_DOOR_OPEN_SW_W:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.SOUTHWEST] + dirDelta[Enum245.WEST];
        break;
      case TRAVELCOST_DOOR_OPEN_NW_W:
        fDoorIsObstacleIfClosed = false;
        iDoorGridNo = iGridNo + dirDelta[Enum245.NORTHWEST] + dirDelta[Enum245.WEST];
        break;
      default:
        break;
    }

    if (pSoldier && (pSoldier.uiStatusFlags & SOLDIER_MONSTER || pSoldier.uiStatusFlags & SOLDIER_ANIMAL)) {
      // can't open doors!
      ubReplacementCost = TRAVELCOST_OBSTACLE;
    }

    if (piDoorGridNo) {
      // return gridno of door through pointer
      piDoorGridNo.value = iDoorGridNo;
    }

    if (fReturnPerceivedValue && gpWorldLevelData[iDoorGridNo].ubExtFlags[0] & MAPELEMENT_EXT_DOOR_STATUS_PRESENT) {
      // check door status
      pDoorStatus = GetDoorStatus(iDoorGridNo);
      if (pDoorStatus) {
        fDoorIsOpen = (pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN) != 0;
      } else {
        // abort!
        return ubMovementCost;
      }
    } else {
      // check door structure
      pDoorStructure = FindStructure(iDoorGridNo, STRUCTURE_ANYDOOR);
      if (pDoorStructure) {
        fDoorIsOpen = (pDoorStructure.fFlags & STRUCTURE_OPEN) != 0;
      } else {
        // abort!
        return ubMovementCost;
      }
    }
    // now determine movement cost
    if (fDoorIsOpen) {
      if (fDoorIsObstacleIfClosed) {
        ubMovementCost = gTileTypeMovementCost[gpWorldLevelData[iGridNo].ubTerrainID];
      } else {
        ubMovementCost = ubReplacementCost;
      }
    } else {
      if (fDoorIsObstacleIfClosed) {
        // door is closed and this should be an obstacle, EXCEPT if we are calculating
        // a path for an enemy or NPC with keys

        // creatures and animals can't open doors!
        if (fReturnPerceivedValue || (pSoldier && (pSoldier.uiStatusFlags & SOLDIER_MONSTER || pSoldier.uiStatusFlags & SOLDIER_ANIMAL))) {
          ubMovementCost = ubReplacementCost;
        } else {
          // have to check if door is locked and NPC does not have keys!
          pDoor = FindDoorInfoAtGridNo(iDoorGridNo);
          if (pDoor) {
            if ((!pDoor.fLocked || (pSoldier && pSoldier.bHasKeys)) && !fReturnDoorCost) {
              ubMovementCost = gTileTypeMovementCost[gpWorldLevelData[iGridNo].ubTerrainID];
            } else {
              ubMovementCost = ubReplacementCost;
            }
          } else {
            ubMovementCost = ubReplacementCost;
          }
        }
      } else {
        ubMovementCost = gTileTypeMovementCost[gpWorldLevelData[iGridNo].ubTerrainID];
      }
    }
  }
  return ubMovementCost;
}

export function DoorTravelCost(pSoldier: SOLDIERTYPE | null, iGridNo: INT32, ubMovementCost: UINT8, fReturnPerceivedValue: boolean, piDoorGridNo: Pointer<INT32>): UINT8 {
  return InternalDoorTravelCost(pSoldier, iGridNo, ubMovementCost, fReturnPerceivedValue, piDoorGridNo, false);
}

}
