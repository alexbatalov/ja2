const SMALLBRUSH = 0;
const MEDIUMBRUSH = 1;
const LARGEBRUSH = 2;

const NO_BANKS = 0;
const DRAW_BANKS = 1;
const DRAW_BANK_WATER = 2;
const DRAW_ERASE = 3;

const NO_CLIFFS = 0;
const DRAW_CLIFFS = 1;
const DRAW_CLIFF_LAND = 2;

BOOLEAN gfWarning;

BOOLEAN gfDoFill;
UINT16 CurrentPaste;
UINT16 gDebrisPaste;
UINT16 gChangeElevation;
UINT16 CurrentStruct;
UINT32 gDoBanks;
UINT32 gDoCliffs;

void EraseMapTile(UINT32 iMapIndex);
void QuickEraseMapTile(UINT32 iMapIndex);
void DeleteStuffFromMapTile(UINT32 iMapIndex);

void PasteDebris(UINT32 iMapIndex);

void PasteStructure(UINT32 iMapIndex);
void PasteStructure1(UINT32 iMapIndex);
void PasteStructure2(UINT32 iMapIndex);
void PasteStructureCommon(UINT32 iMapIndex);

void PasteSingleWall(UINT32 iMapIndex);
void PasteSingleDoor(UINT32 iMapIndex);
void PasteSingleWindow(UINT32 iMapIndex);
void PasteSingleRoof(UINT32 iMapIndex);
void PasteSingleBrokenWall(UINT32 iMapIndex);
void PasteSingleDecoration(UINT32 iMapIndex);
void PasteSingleDecal(UINT32 iMapIndex);
void PasteSingleFloor(UINT32 iMapIndex);
void PasteSingleToilet(UINT32 iMapIndex);
void PasteRoomNumber(UINT32 iMapIndex, UINT8 ubRoomNumber);

void PasteSingleWallCommon(UINT32 iMapIndex);

UINT16 GetRandomIndexByRange(UINT16 usRangeStart, UINT16 usRangeEnd);
UINT16 GetRandomTypeByRange(UINT16 usRangeStart, UINT16 usRangeEnd);

void PasteFloor(UINT32 iMapIndex, UINT16 usFloorIndex, BOOLEAN fReplace);

void PasteBanks(UINT32 iMapIndex, UINT16 usStructIndex, BOOLEAN fReplace);
void PasteRoads(UINT32 iMapIndex);
void PasteCliffs(UINT32 iMapIndex, UINT16 usStructIndex, BOOLEAN fReplace);

void PasteTexture(UINT32 iMapIndex);
void PasteTextureCommon(UINT32 iMapIndex);

void PasteHigherTexture(UINT32 iMapIndex, UINT32 fNewType);

void RaiseWorldLand();

void EliminateObjectLayerRedundancy();
