namespace ja2 {

export const ITEM_HANDLE_OK = 1;
export const ITEM_HANDLE_RELOADING = -1;
export const ITEM_HANDLE_UNCONSCIOUS = -2;
export const ITEM_HANDLE_NOAPS = -3;
export const ITEM_HANDLE_NOAMMO = -4;
export const ITEM_HANDLE_CANNOT_GETTO_LOCATION = -5;
export const ITEM_HANDLE_BROKEN = -6;
export const ITEM_HANDLE_NOROOM = -7;
export const ITEM_HANDLE_REFUSAL = -8;

// Define for code to try and pickup all items....
export const ITEM_PICKUP_ACTION_ALL = 32000;
export const ITEM_PICKUP_SELECTION = 31000;

export const ITEM_IGNORE_Z_LEVEL = -1;

const ITEMLIST_INIT_HANDLE = 1;
export const ITEMLIST_DISPLAY = 2;
export const ITEMLIST_HANDLE = 3;
const ITEMLIST_END_HANDLE = 4;
const ITEMLIST_HANDLE_SELECTION = 5;

// visibility defines
export const ANY_VISIBILITY_VALUE = -10;
export const HIDDEN_ITEM = -4;
export const BURIED = -3;
export const HIDDEN_IN_OBJECT = -2;
export const INVISIBLE = -1;
export const VISIBLE = 1;

const ITEM_LOCATOR_DELAY = 0x01;
export const ITEM_LOCATOR_LOCKED = 0x02;

// MACRO FOR DEFINING OF ITEM IS VISIBLE
export const ITEMPOOL_VISIBLE = (pItemPool: ITEM_POOL) => ((pItemPool.bVisible >= 1) || (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS));

export type ITEM_POOL_LOCATOR_HOOK = () => void;

export interface ITEM_POOL {
  pNext: ITEM_POOL | null /* Pointer<ITEM_POOL> */;
  pPrev: ITEM_POOL | null /* Pointer<ITEM_POOL> */;

  iItemIndex: INT32;
  bVisible: INT8;
  bFlashColor: INT8;
  uiTimerID: UINT32;
  sGridNo: INT16;
  ubLevel: UINT8;
  usFlags: UINT16;
  bRenderZHeightAboveLevel: INT8;
  pLevelNode: LEVELNODE /* Pointer<LEVELNODE> */;
}

export function createItemPool(): ITEM_POOL {
  return {
    pNext: null,
    pPrev: null,
    iItemIndex: 0,
    bVisible: 0,
    bFlashColor: 0,
    uiTimerID: 0,
    sGridNo: 0,
    ubLevel: 0,
    usFlags: 0,
    bRenderZHeightAboveLevel: 0,
    pLevelNode: <LEVELNODE><unknown>null,
  };
}

export interface ITEM_POOL_LOCATOR {
  pItemPool: ITEM_POOL /* Pointer<ITEM_POOL> */;

  // Additional info for locators
  bRadioFrame: INT8;
  uiLastFrameUpdate: UINT32;
  Callback: ITEM_POOL_LOCATOR_HOOK | null;
  fAllocated: boolean;
  ubFlags: UINT8;
}

export function createItemPoolLocator(): ITEM_POOL_LOCATOR {
  return {
    pItemPool: <ITEM_POOL><unknown>null,
    bRadioFrame: 0,
    uiLastFrameUpdate: 0,
    Callback: null,
    fAllocated: false,
    ubFlags: 0,
  };
}

}
