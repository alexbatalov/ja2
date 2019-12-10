namespace ja2 {

export const MAPS_DIR = "Temp";

// Defines used for the bUseMercGridNoPlacement contained in the the merc profile struct
const enum Enum278 {
  PROFILE_NOT_SET, // initially set to this
  PROFILE_DONT_USE_GRIDNO, // if the merc is switching sectors, etc
  PROFILE_USE_GRIDNO, // if we are to use the GridNo variable in the profile struct
}

// Flags used for the AddDeadSoldierToUnLoadedSector() function
export const ADD_DEAD_SOLDIER_USE_GRIDNO = 0x00000001; // just place the items and corpse on the gridno location
export const ADD_DEAD_SOLDIER_TO_SWEETSPOT = 0x00000002; // Finds the closet free gridno

export const ADD_DEAD_SOLDIER__USE_JFK_HEADSHOT_CORPSE = 0x00000040; // Will ue the JFK headshot

export const NEW_ROTATION_ARRAY_SIZE = 49;
export const BASE_NUMBER_OF_ROTATION_ARRAYS = 19;

}
