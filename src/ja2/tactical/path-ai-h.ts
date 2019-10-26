namespace ja2 {

/*
        Filename        :       pathai.h
        Author          :       Ray E. Bornert II
        Date            :       1992-MAR-15

        Copyright (C) 1993 HixoxiH Software
*/

// Ian's terrain values for travelling speed/pathing purposes
// Fixed by CJC March 4, 1998.  Please do not change these unless familiar
// with how this will affect the path code!

export const TRAVELCOST_NONE = 0;
export const TRAVELCOST_FLAT = 10;
export const TRAVELCOST_BUMPY = 12;
export const TRAVELCOST_GRASS = 12;
export const TRAVELCOST_THICK = 16;
export const TRAVELCOST_DEBRIS = 20;
export const TRAVELCOST_SHORE = 30;
export const TRAVELCOST_KNEEDEEP = 36;
export const TRAVELCOST_DEEPWATER = 50;
export const TRAVELCOST_FENCE = 40;

// these values are used to indicate "this is an obstacle
// if there is a door (perceived) open/closed in this tile
export const TRAVELCOST_DOOR_CLOSED_HERE = 220;
export const TRAVELCOST_DOOR_CLOSED_N = 221;
export const TRAVELCOST_DOOR_CLOSED_W = 222;
export const TRAVELCOST_DOOR_OPEN_HERE = 223;
export const TRAVELCOST_DOOR_OPEN_N = 224;
export const TRAVELCOST_DOOR_OPEN_NE = 225;
export const TRAVELCOST_DOOR_OPEN_E = 226;
export const TRAVELCOST_DOOR_OPEN_SE = 227;
export const TRAVELCOST_DOOR_OPEN_S = 228;
export const TRAVELCOST_DOOR_OPEN_SW = 229;
export const TRAVELCOST_DOOR_OPEN_W = 230;
export const TRAVELCOST_DOOR_OPEN_NW = 231;
export const TRAVELCOST_DOOR_OPEN_N_N = 232;
export const TRAVELCOST_DOOR_OPEN_NW_N = 233;
export const TRAVELCOST_DOOR_OPEN_NE_N = 234;
export const TRAVELCOST_DOOR_OPEN_W_W = 235;
export const TRAVELCOST_DOOR_OPEN_SW_W = 236;
export const TRAVELCOST_DOOR_OPEN_NW_W = 237;
export const TRAVELCOST_NOT_STANDING = 248;
export const TRAVELCOST_OFF_MAP = 249;
export const TRAVELCOST_CAVEWALL = 250;
export const TRAVELCOST_HIDDENOBSTACLE = 251;
export const TRAVELCOST_DOOR = 252;
export const TRAVELCOST_OBSTACLE = 253;
export const TRAVELCOST_WALL = 254;
export const TRAVELCOST_EXITGRID = 255;

export const TRAVELCOST_TRAINTRACKS = 30;
export const TRAVELCOST_DIRTROAD = 9;
export const TRAVELCOST_PAVEDROAD = 9;
export const TRAVELCOST_FLATFLOOR = 10;

export const TRAVELCOST_BLOCKED = (TRAVELCOST_OFF_MAP);
export const IS_TRAVELCOST_DOOR = (x) => (x >= TRAVELCOST_DOOR_CLOSED_HERE && x <= TRAVELCOST_DOOR_OPEN_NW_W);
const IS_TRAVELCOST_CLOSED_DOOR = (x) => (x >= TRAVELCOST_DOOR_CLOSED_HERE && x << TRAVELCOST_DOOR_CLOSED_W);

// ------------------------------------------
// PLOT PATH defines
export const NOT_STEALTH = 0;
const STEALTH = 1;

export const NO_PLOT = 0;
export const PLOT = 1;

export const TEMPORARY = 0;
const PERMANENT = 1;

export const FORWARD = 0;
const REVERSE = 1;

export const NO_COPYROUTE = 0;
export const COPYROUTE = 1;
export const COPYREACHABLE = 2;
export const COPYREACHABLE_AND_APS = 3;

export const PATH_THROUGH_PEOPLE = 0x01;
export const PATH_IGNORE_PERSON_AT_DEST = 0x02;
export const PATH_CLOSE_GOOD_ENOUGH = 0x04;

export const PATH_CLOSE_RADIUS = 5;

// ------------------------------------------

}
