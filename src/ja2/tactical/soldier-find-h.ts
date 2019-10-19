const FIND_SOLDIER_FULL = 0x000000002;
const FIND_SOLDIER_GRIDNO = 0x000000004;
const FIND_SOLDIER_SAMELEVEL = 0x000000008;
const FIND_SOLDIER_SELECTIVE = 0x000000020;
const FIND_SOLDIER_BEGINSTACK = 0x000000040;

// RETURN FLAGS FOR FINDSOLDIER
const SELECTED_MERC = 0x000000002;
const OWNED_MERC = 0x000000004;
const ENEMY_MERC = 0x000000008;
const UNCONSCIOUS_MERC = 0x000000020;
const DEAD_MERC = 0x000000040;
const VISIBLE_MERC = 0x000000080;
const ONDUTY_MERC = 0x000000100;
const NOINTERRUPT_MERC = 0x000000200;
const NEUTRAL_MERC = 0x000000400;

const FINDSOLDIERSAMELEVEL = (l) => (((FIND_SOLDIER_FULL | FIND_SOLDIER_SAMELEVEL) | (l << 16)));

const FINDSOLDIERSELECTIVESAMELEVEL = (l) => (((FIND_SOLDIER_SELECTIVE | FIND_SOLDIER_SAMELEVEL) | (l << 16)));

BOOLEAN FindSoldierFromMouse(UINT16 *pusSoldierIndex, UINT32 *pMercFlags);
BOOLEAN SelectiveFindSoldierFromMouse(UINT16 *pusSoldierIndex, UINT32 *pMercFlags);
BOOLEAN FindSoldier(INT16 sGridNo, UINT16 *pusSoldierIndex, UINT32 *pMercFlags, UINT32 uiFlags);
SOLDIERTYPE *SimpleFindSoldier(INT16 sGridNo, INT8 bLevel);

BOOLEAN CycleSoldierFindStack(UINT16 usMapPos);

BOOLEAN GridNoOnScreen(INT16 sGridNo);

BOOLEAN SoldierOnScreen(UINT16 usID);
BOOLEAN SoldierLocationRelativeToScreen(INT16 sGridNo, UINT16 usReasonID, INT8 *pbDirection, UINT32 *puiScrollFlags);
void GetSoldierScreenPos(SOLDIERTYPE *pSoldier, INT16 *psScreenX, INT16 *psScreenY);
void GetSoldierAnimDims(SOLDIERTYPE *pSoldier, INT16 *psHeight, INT16 *psWidth);
void GetSoldierAnimOffsets(SOLDIERTYPE *pSoldier, INT16 *sOffsetX, INT16 *sOffsetY);
void GetSoldierTRUEScreenPos(SOLDIERTYPE *pSoldier, INT16 *psScreenX, INT16 *psScreenY);
BOOLEAN IsPointInSoldierBoundingBox(SOLDIERTYPE *pSoldier, INT16 sX, INT16 sY);
BOOLEAN FindRelativeSoldierPosition(SOLDIERTYPE *pSoldier, UINT16 *usFlags, INT16 sX, INT16 sY);

UINT8 QuickFindSoldier(INT16 sGridNo);
void GetGridNoScreenPos(INT16 sGridNo, UINT8 ubLevel, INT16 *psScreenX, INT16 *psScreenY);
