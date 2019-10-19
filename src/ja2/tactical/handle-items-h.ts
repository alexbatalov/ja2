const ITEM_HANDLE_OK = 1;
const ITEM_HANDLE_RELOADING = -1;
const ITEM_HANDLE_UNCONSCIOUS = -2;
const ITEM_HANDLE_NOAPS = -3;
const ITEM_HANDLE_NOAMMO = -4;
const ITEM_HANDLE_CANNOT_GETTO_LOCATION = -5;
const ITEM_HANDLE_BROKEN = -6;
const ITEM_HANDLE_NOROOM = -7;
const ITEM_HANDLE_REFUSAL = -8;

// Define for code to try and pickup all items....
const ITEM_PICKUP_ACTION_ALL = 32000;
const ITEM_PICKUP_SELECTION = 31000;

const ITEM_IGNORE_Z_LEVEL = -1;

const ITEMLIST_INIT_HANDLE = 1;
const ITEMLIST_DISPLAY = 2;
const ITEMLIST_HANDLE = 3;
const ITEMLIST_END_HANDLE = 4;
const ITEMLIST_HANDLE_SELECTION = 5;

// visibility defines
const ANY_VISIBILITY_VALUE = -10;
const HIDDEN_ITEM = -4;
const BURIED = -3;
const HIDDEN_IN_OBJECT = -2;
const INVISIBLE = -1;
const VISIBLE = 1;

const ITEM_LOCATOR_DELAY = 0x01;
const ITEM_LOCATOR_LOCKED = 0x02;

// MACRO FOR DEFINING OF ITEM IS VISIBLE
const ITEMPOOL_VISIBLE = (pItemPool) => ((pItemPool->bVisible >= 1) || (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS));

type ITEM_POOL_LOCATOR_HOOK = () => void;

interface ITEM_POOL {
  pNext: Pointer<ITEM_POOL>;
  pPrev: Pointer<ITEM_POOL>;

  iItemIndex: INT32;
  bVisible: INT8;
  bFlashColor: INT8;
  uiTimerID: UINT32;
  sGridNo: INT16;
  ubLevel: UINT8;
  usFlags: UINT16;
  bRenderZHeightAboveLevel: INT8;
  pLevelNode: Pointer<LEVELNODE>;
}

interface ITEM_POOL_LOCATOR {
  pItemPool: Pointer<ITEM_POOL>;

  // Additional info for locators
  bRadioFrame: INT8;
  uiLastFrameUpdate: UINT32;
  Callback: ITEM_POOL_LOCATOR_HOOK;
  fAllocated: BOOLEAN;
  ubFlags: UINT8;
}

INT32 HandleItem(SOLDIERTYPE *pSoldier, UINT16 usGridNo, INT8 bLevel, UINT16 usHandItem, BOOLEAN fFromUI);
void SoldierPickupItem(SOLDIERTYPE *pSoldier, INT32 iItemIndex, INT16 sGridNo, INT8 bZLevel);
void HandleSoldierPickupItem(SOLDIERTYPE *pSoldier, INT32 iItemIndex, INT16 sGridNo, INT8 bZLevel);
void HandleFlashingItems();

BOOLEAN SoldierDropItem(SOLDIERTYPE *pSoldier, OBJECTTYPE *pObj);

void HandleSoldierThrowItem(SOLDIERTYPE *pSoldier, INT16 sGridNo);
BOOLEAN VerifyGiveItem(SOLDIERTYPE *pSoldier, SOLDIERTYPE **ppTargetSoldier);
void SoldierGiveItemFromAnimation(SOLDIERTYPE *pSoldier);
void SoldierGiveItem(SOLDIERTYPE *pSoldier, SOLDIERTYPE *pTargetSoldier, OBJECTTYPE *pObject, INT8 bInvPos);

void NotifySoldiersToLookforItems();
void AllSoldiersLookforItems(BOOLEAN RevealRoofsAndItems);

void SoldierGetItemFromWorld(SOLDIERTYPE *pSoldier, INT32 iItemIndex, INT16 sGridNo, INT8 bZLevel, BOOLEAN *pfSelectionList);

OBJECTTYPE *AddItemToPool(INT16 sGridNo, OBJECTTYPE *pObject, INT8 bVisible, UINT8 ubLevel, UINT16 usFlags, INT8 bRenderZHeightAboveLevel);
OBJECTTYPE *AddItemToPoolAndGetIndex(INT16 sGridNo, OBJECTTYPE *pObject, INT8 bVisible, UINT8 ubLevel, UINT16 usFlags, INT8 bRenderZHeightAboveLevel, INT32 *piItemIndex);
OBJECTTYPE *InternalAddItemToPool(INT16 *psGridNo, OBJECTTYPE *pObject, INT8 bVisible, UINT8 ubLevel, UINT16 usFlags, INT8 bRenderZHeightAboveLevel, INT32 *piItemIndex);

INT16 AdjustGridNoForItemPlacement(SOLDIERTYPE *pSoldier, INT16 sGridNo);
BOOLEAN GetItemPool(UINT16 usMapPos, ITEM_POOL **ppItemPool, UINT8 ubLevel);
BOOLEAN DrawItemPoolList(ITEM_POOL *pItemPool, INT16 sGridNo, UINT8 bCommand, INT8 bZLevel, INT16 sXPos, INT16 sYPos);
BOOLEAN RemoveItemFromPool(INT16 sGridNo, INT32 iItemIndex, UINT8 ubLevel);
BOOLEAN ItemExistsAtLocation(INT16 sGridNo, INT32 iItemIndex, UINT8 ubLevel);
BOOLEAN MoveItemPools(INT16 sStartPos, INT16 sEndPos);

void SetItemPoolLocator(ITEM_POOL *pItemPool);
void SetItemPoolLocatorWithCallback(ITEM_POOL *pItemPool, ITEM_POOL_LOCATOR_HOOK Callback);
BOOLEAN SetItemPoolVisibilityOn(ITEM_POOL *pItemPool, INT8 bAllGreaterThan, BOOLEAN fSetLocator);
void AdjustItemPoolVisibility(ITEM_POOL *pItemPool);

void SetItemPoolVisibilityHiddenInObject(ITEM_POOL *pItemPool);
void SetItemPoolVisibilityHidden(ITEM_POOL *pItemPool);

INT32 GetItemOfClassTypeInPool(INT16 sGridNo, UINT32 uiItemClass, UINT8 ubLevel);
void RemoveItemPool(INT16 sGridNo, UINT8 ubLevel);
void RenderTopmostFlashingItems();

void RemoveAllUnburiedItems(INT16 sGridNo, UINT8 ubLevel);

BOOLEAN DoesItemPoolContainAnyHiddenItems(ITEM_POOL *pItemPool);
BOOLEAN DoesItemPoolContainAllHiddenItems(ITEM_POOL *pItemPool);

void HandleSoldierDropBomb(SOLDIERTYPE *pSoldier, INT16 sGridNo);
void HandleSoldierUseRemote(SOLDIERTYPE *pSoldier, INT16 sGridNo);

BOOLEAN DoesItemPoolContainAllItemsOfZeroZLevel(ITEM_POOL *pItemPool);
BOOLEAN DoesItemPoolContainAllItemsOfHigherZLevel(ITEM_POOL *pItemPool);

BOOLEAN ItemPoolOKForDisplay(ITEM_POOL *pItemPool, INT8 bZLevel);
INT16 GetNumOkForDisplayItemsInPool(ITEM_POOL *pItemPool, INT8 bZLevel);

void SoldierHandleDropItem(SOLDIERTYPE *pSoldier);

BOOLEAN LookForHiddenItems(INT16 sGridNo, INT8 ubLevel, BOOLEAN fSetLocator, INT8 bZLevel);

INT8 GetZLevelOfItemPoolGivenStructure(INT16 sGridNo, UINT8 ubLevel, STRUCTURE *pStructure);

INT8 GetLargestZLevelOfItemPool(ITEM_POOL *pItemPool);

BOOLEAN NearbyGroundSeemsWrong(SOLDIERTYPE *pSoldier, INT16 sGridNo, BOOLEAN fCheckAroundGridno, INT16 *psProblemGridNo);
void MineSpottedDialogueCallBack(void);

extern INT16 gsBoobyTrapGridNo;
extern SOLDIERTYPE *gpBoobyTrapSoldier;
void AddBlueFlag(INT16 sGridNo, INT8 bLevel);
void RemoveBlueFlag(INT16 sGridNo, INT8 bLevel);

// check if item is booby trapped
BOOLEAN ContinuePastBoobyTrapInMapScreen(OBJECTTYPE *pObject, SOLDIERTYPE *pSoldier);

// set off the booby trap in mapscreen
void SetOffBoobyTrapInMapScreen(SOLDIERTYPE *pSoldier, OBJECTTYPE *pObject);

void RefreshItemPools(WORLDITEM *pItemList, INT32 iNumberOfItems);

BOOLEAN HandItemWorks(SOLDIERTYPE *pSoldier, INT8 bSlot);

BOOLEAN ItemTypeExistsAtLocation(INT16 sGridNo, UINT16 usItem, UINT8 ubLevel, INT32 *piItemIndex);

INT16 FindNearestAvailableGridNoForItem(INT16 sSweetGridNo, INT8 ubRadius);

BOOLEAN CanPlayerUseRocketRifle(SOLDIERTYPE *pSoldier, BOOLEAN fDisplay);

void MakeNPCGrumpyForMinorOffense(SOLDIERTYPE *pSoldier, SOLDIERTYPE *pOffendingSoldier);
