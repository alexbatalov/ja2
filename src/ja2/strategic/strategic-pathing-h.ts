namespace ja2 {

// directions of movement for badsector determination ( blocking off of a sector exit from foot or vehicle travel)

// Shortest Path Defines
export const NORTH_MOVE = -18;
export const EAST_MOVE = 1;
export const WEST_MOVE = -1;
export const SOUTH_MOVE = 18;

// Movement speed defines
export const NORMAL_MVT = 1;
const SLOW_MVT = 0;

// movment modes
const enum Enum187 {
  MVT_MODE_AIR,
  MVT_MODE_VEHICLE,
  MVT_MODE_FOOT,
}

// build eta's for characters path - no longer used
// void CalculateEtaForCharacterPath( SOLDIERTYPE *pCharacter );
/*
// move character along path
void MoveCharacterOnPath( SOLDIERTYPE *pCharacter );
// move the whole team
void MoveTeamOnFoot( void );

// get the final eta of this path to the last sector in it's list
UINT32 GetEtaGivenRoute( PathStPtr pPath );
*/

/*
BOOLEAN MoveGroupToOriginalSector( UINT8 ubGroupID );
*/

}
