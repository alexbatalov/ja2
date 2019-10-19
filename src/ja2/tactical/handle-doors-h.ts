const HANDLE_DOOR_OPEN = 1;
const HANDLE_DOOR_EXAMINE = 2;
const HANDLE_DOOR_LOCKPICK = 3;
const HANDLE_DOOR_FORCE = 4;
const HANDLE_DOOR_LOCK = 5;
const HANDLE_DOOR_UNLOCK = 6;
const HANDLE_DOOR_EXPLODE = 7;
const HANDLE_DOOR_UNTRAP = 8;
const HANDLE_DOOR_CROWBAR = 9;

extern BOOLEAN gfSetPerceivedDoorState;

BOOLEAN HandleOpenableStruct(SOLDIERTYPE *pSoldier, INT16 sGridNo, STRUCTURE *pStructure);

void InteractWithOpenableStruct(SOLDIERTYPE *pSoldier, STRUCTURE *pStructure, UINT8 ubDirection, BOOLEAN fDoor);

void InteractWithClosedDoor(SOLDIERTYPE *pSoldier, UINT8 ubHandleCode);

void SetDoorString(INT16 sGridNo);

void HandleDoorChangeFromGridNo(SOLDIERTYPE *pSoldier, INT16 sGridNo, BOOLEAN fNoAnimations);
