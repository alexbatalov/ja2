/*
        Filename        :       pathai.h
        Author          :       Ray E. Bornert II
        Date            :       1992-MAR-15

        Copyright (C) 1993 HixoxiH Software
*/

BOOLEAN InitPathAI(void);
void ShutDownPathAI(void);
INT16 PlotPath(SOLDIERTYPE *pSold, INT16 sDestGridno, INT8 bCopyRoute, INT8 bPlot, INT8 bStayOn, UINT16 usMovementMode, INT8 bStealth, INT8 bReverse, INT16 sAPBudget);
INT16 UIPlotPath(SOLDIERTYPE *pSold, INT16 sDestGridno, INT8 bCopyRoute, INT8 bPlot, INT8 bStayOn, UINT16 usMovementMode, INT8 bStealth, INT8 bReverse, INT16 sAPBudget);
INT16 EstimatePlotPath(SOLDIERTYPE *pSold, INT16 sDestGridno, INT8 bCopyRoute, INT8 bPlot, INT8 bStayOn, UINT16 usMovementMode, INT8 bStealth, INT8 bReverse, INT16 sAPBudget);

void ErasePath(char bEraseOldOne);
INT32 FindBestPath(SOLDIERTYPE *s, INT16 sDestination, INT8 ubLevel, INT16 usMovementMode, INT8 bCopy, UINT8 fFlags);
void GlobalReachableTest(INT16 sStartGridNo);
void GlobalItemsReachableTest(INT16 sStartGridNo1, INT16 sStartGridNo2);
void RoofReachableTest(INT16 sStartGridNo, UINT8 ubBuildingID);
void LocalReachableTest(INT16 sStartGridNo, INT8 bRadius);

UINT8 DoorTravelCost(SOLDIERTYPE *pSoldier, INT32 iGridNo, UINT8 ubMovementCost, BOOLEAN fReturnPerceivedValue, INT32 *piDoorGridNo);
UINT8 InternalDoorTravelCost(SOLDIERTYPE *pSoldier, INT32 iGridNo, UINT8 ubMovementCost, BOOLEAN fReturnPerceivedValue, INT32 *piDoorGridNo, BOOLEAN fReturnDoorCost);

INT16 RecalculatePathCost(SOLDIERTYPE *pSoldier, UINT16 usMovementMode);

// Exporting these global variables
extern UINT32 guiPathingData[256];
extern UINT8 gubNPCAPBudget;
extern UINT16 gusNPCMovementMode;
extern UINT8 gubNPCDistLimit;
extern UINT8 gubNPCPathCount;
extern BOOLEAN gfPlotPathToExitGrid;
extern BOOLEAN gfNPCCircularDistLimit;
extern BOOLEAN gfEstimatePath;
extern BOOLEAN gfPathAroundObstacles;
extern UINT8 gubGlobalPathFlags;

// Ian's terrain values for travelling speed/pathing purposes
// Fixed by CJC March 4, 1998.  Please do not change these unless familiar
// with how this will affect the path code!

const TRAVELCOST_NONE = 0;
const TRAVELCOST_FLAT = 10;
const TRAVELCOST_BUMPY = 12;
const TRAVELCOST_GRASS = 12;
const TRAVELCOST_THICK = 16;
const TRAVELCOST_DEBRIS = 20;
const TRAVELCOST_SHORE = 30;
const TRAVELCOST_KNEEDEEP = 36;
const TRAVELCOST_DEEPWATER = 50;
const TRAVELCOST_FENCE = 40;

// these values are used to indicate "this is an obstacle
// if there is a door (perceived) open/closed in this tile
const TRAVELCOST_DOOR_CLOSED_HERE = 220;
const TRAVELCOST_DOOR_CLOSED_N = 221;
const TRAVELCOST_DOOR_CLOSED_W = 222;
const TRAVELCOST_DOOR_OPEN_HERE = 223;
const TRAVELCOST_DOOR_OPEN_N = 224;
const TRAVELCOST_DOOR_OPEN_NE = 225;
const TRAVELCOST_DOOR_OPEN_E = 226;
const TRAVELCOST_DOOR_OPEN_SE = 227;
const TRAVELCOST_DOOR_OPEN_S = 228;
const TRAVELCOST_DOOR_OPEN_SW = 229;
const TRAVELCOST_DOOR_OPEN_W = 230;
const TRAVELCOST_DOOR_OPEN_NW = 231;
const TRAVELCOST_DOOR_OPEN_N_N = 232;
const TRAVELCOST_DOOR_OPEN_NW_N = 233;
const TRAVELCOST_DOOR_OPEN_NE_N = 234;
const TRAVELCOST_DOOR_OPEN_W_W = 235;
const TRAVELCOST_DOOR_OPEN_SW_W = 236;
const TRAVELCOST_DOOR_OPEN_NW_W = 237;
const TRAVELCOST_NOT_STANDING = 248;
const TRAVELCOST_OFF_MAP = 249;
const TRAVELCOST_CAVEWALL = 250;
const TRAVELCOST_HIDDENOBSTACLE = 251;
const TRAVELCOST_DOOR = 252;
const TRAVELCOST_OBSTACLE = 253;
const TRAVELCOST_WALL = 254;
const TRAVELCOST_EXITGRID = 255;

const TRAVELCOST_TRAINTRACKS = 30;
const TRAVELCOST_DIRTROAD = 9;
const TRAVELCOST_PAVEDROAD = 9;
const TRAVELCOST_FLATFLOOR = 10;

const TRAVELCOST_BLOCKED = (TRAVELCOST_OFF_MAP);
const IS_TRAVELCOST_DOOR = (x) => (x >= TRAVELCOST_DOOR_CLOSED_HERE && x <= TRAVELCOST_DOOR_OPEN_NW_W);
const IS_TRAVELCOST_CLOSED_DOOR = (x) => (x >= TRAVELCOST_DOOR_CLOSED_HERE && x << TRAVELCOST_DOOR_CLOSED_W);

// ------------------------------------------
// PLOT PATH defines
const NOT_STEALTH = 0;
const STEALTH = 1;

const NO_PLOT = 0;
const PLOT = 1;

const TEMPORARY = 0;
const PERMANENT = 1;

const FORWARD = 0;
const REVERSE = 1;

const NO_COPYROUTE = 0;
const COPYROUTE = 1;
const COPYREACHABLE = 2;
const COPYREACHABLE_AND_APS = 3;

const PATH_THROUGH_PEOPLE = 0x01;
const PATH_IGNORE_PERSON_AT_DEST = 0x02;
const PATH_CLOSE_GOOD_ENOUGH = 0x04;

const PATH_CLOSE_RADIUS = 5;

// ------------------------------------------