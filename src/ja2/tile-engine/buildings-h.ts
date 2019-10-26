namespace ja2 {

// for what it's worth, 2 bytes, we use roof climb spots as 1-based
// so the 0th entry is always 0 and can be compared with (and not equal)
// NOWHERE or any other location
export const MAX_CLIMBSPOTS_PER_BUILDING = 21;

// similarly for buildings, only we really want 0 to be invalid index
export const NO_BUILDING = 0;
export const MAX_BUILDINGS = 31;

export interface BUILDING {
  sUpClimbSpots: INT16[] /* [MAX_CLIMBSPOTS_PER_BUILDING] */;
  sDownClimbSpots: INT16[] /* [MAX_CLIMBSPOTS_PER_BUILDING] */;
  ubNumClimbSpots: UINT8;
}

}
