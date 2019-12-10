namespace ja2 {

// DEFINES
export const BGND_FLAG_PERMANENT = 0x80000000;
export const BGND_FLAG_SINGLE = 0x40000000;
export const BGND_FLAG_SAVE_Z = 0x20000000;
export const BGND_FLAG_MERC = 0x10000000;
export const BGND_FLAG_SAVERECT = 0x08000000;
const BGND_FLAG_TOPMOST = 0x04000000;
export const BGND_FLAG_ANIMATED = 0x00000001;

export const VOVERLAY_DIRTYBYTEXT = 0x00000001;
export const VOVERLAY_STARTDISABLED = 0x00000002;

export const VOVERLAY_DESC_TEXT = 0x00001000;
export const VOVERLAY_DESC_DISABLED = 0x00002000;
export const VOVERLAY_DESC_POSITION = 0x00004000;

// STRUCTURES

// Callback for topmost blitters
type OVERLAY_CALLBACK = (a: VIDEO_OVERLAY) => void;

// Struct for backgrounds
export interface BACKGROUND_SAVE {
  fAllocated: boolean;
  fFilled: boolean;
  fFreeMemory: boolean;
  fZBuffer: boolean;
  uiFlags: UINT32;
  pSaveArea: Uint8ClampedArray | null;
  pZSaveArea: Uint8ClampedArray | null;
  sLeft: INT16;
  sTop: INT16;
  sRight: INT16;
  sBottom: INT16;
  sWidth: INT16;
  sHeight: INT16;
  fPendingDelete: boolean;
  fDisabled: boolean;
}

export function createBackgroundSave(): BACKGROUND_SAVE {
  return {
    fAllocated: false,
    fFilled: false,
    fFreeMemory: false,
    fZBuffer: false,
    uiFlags: 0,
    pSaveArea: null,
    pZSaveArea: null,
    sLeft: 0,
    sTop: 0,
    sRight: 0,
    sBottom: 0,
    sWidth: 0,
    sHeight: 0,
    fPendingDelete: false,
    fDisabled: false,
  };
}

export function resetBackgroundSave(o: BACKGROUND_SAVE) {
  o.fAllocated = false;
  o.fFilled = false;
  o.fFreeMemory = false;
  o.fZBuffer = false;
  o.uiFlags = 0;
  o.pSaveArea = null;
  o.pZSaveArea = null;
  o.sLeft = 0;
  o.sTop = 0;
  o.sRight = 0;
  o.sBottom = 0;
  o.sWidth = 0;
  o.sHeight = 0;
  o.fPendingDelete = false;
  o.fDisabled = false;
}

// Struct for topmost blitters
export interface VIDEO_OVERLAY {
  uiFlags: UINT32;
  fAllocated: UINT8 /* boolean */;
  fDisabled: boolean;
  fActivelySaving: boolean;
  fDeletionPending: boolean;
  uiBackground: INT32;
  pBackground: BACKGROUND_SAVE | null;
  pSaveArea: Uint8ClampedArray | null;
  uiUserData: UINT32[] /* [5] */;
  uiFontID: UINT32;
  sX: INT16;
  sY: INT16;
  ubFontBack: UINT8;
  ubFontFore: UINT8;
  zText: string /* INT16[200] */;
  uiDestBuff: UINT32;
  BltCallback: OVERLAY_CALLBACK;
}

export function createVideoOverlay(): VIDEO_OVERLAY {
  return {
    uiFlags: 0,
    fAllocated: 0,
    fDisabled: false,
    fActivelySaving: false,
    fDeletionPending: false,
    uiBackground: 0,
    pBackground: null,
    pSaveArea: null,
    uiUserData: createArray(5, 0),
    uiFontID: 0,
    sX: 0,
    sY: 0,
    ubFontBack: 0,
    ubFontFore: 0,
    zText: '',
    uiDestBuff: 0,
    BltCallback: <OVERLAY_CALLBACK><unknown>null,
  };
}

export function resetVideoOverlay(o: VIDEO_OVERLAY) {
  o.uiFlags = 0;
  o.fAllocated = 0;
  o.fDisabled = false;
  o.fActivelySaving = false;
  o.fDeletionPending = false;
  o.uiBackground = 0;
  o.pBackground = null;
  o.pSaveArea = null;
  o.uiUserData.fill(0);
  o.uiFontID = 0;
  o.sX = 0;
  o.sY = 0;
  o.ubFontBack = 0;
  o.ubFontFore = 0;
  o.zText = '';
  o.uiDestBuff = 0;
  o.BltCallback = <OVERLAY_CALLBACK><unknown>null;
}

// Struct for init topmost blitter
export interface VIDEO_OVERLAY_DESC {
  uiFlags: UINT32;
  fDisabled: boolean;
  sLeft: INT16;
  sTop: INT16;
  sRight: INT16;
  sBottom: INT16;
  uiFontID: UINT32;
  sX: INT16;
  sY: INT16;
  ubFontBack: UINT8;
  ubFontFore: UINT8;
  pzText: string /* INT16[200] */;
  BltCallback: OVERLAY_CALLBACK;
}

export function createVideoOverlayDesc(): VIDEO_OVERLAY_DESC {
  return {
    uiFlags: 0,
    fDisabled: false,
    sLeft: 0,
    sTop: 0,
    sRight: 0,
    sBottom: 0,
    uiFontID: 0,
    sX: 0,
    sY: 0,
    ubFontBack: 0,
    ubFontFore: 0,
    pzText: "",
    BltCallback: <OVERLAY_CALLBACK><unknown>null,
  };
}

// FUNCTIONS
////////////

}
