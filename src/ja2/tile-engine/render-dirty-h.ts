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
type OVERLAY_CALLBACK = (a: Pointer<VIDEO_OVERLAY>) => void;

// Struct for backgrounds
export interface BACKGROUND_SAVE {
  fAllocated: boolean;
  fFilled: boolean;
  fFreeMemory: boolean;
  fZBuffer: boolean;
  uiFlags: UINT32;
  pSaveArea: Pointer<INT16>;
  pZSaveArea: Pointer<INT16>;
  sLeft: INT16;
  sTop: INT16;
  sRight: INT16;
  sBottom: INT16;
  sWidth: INT16;
  sHeight: INT16;
  fPendingDelete: boolean;
  fDisabled: boolean;
}

// Struct for topmost blitters
export interface VIDEO_OVERLAY {
  uiFlags: UINT32;
  fAllocated: boolean;
  fDisabled: boolean;
  fActivelySaving: boolean;
  fDeletionPending: boolean;
  uiBackground: INT32;
  pBackground: Pointer<BACKGROUND_SAVE>;
  pSaveArea: Pointer<INT16>;
  uiUserData: UINT32[] /* [5] */;
  uiFontID: UINT32;
  sX: INT16;
  sY: INT16;
  ubFontBack: UINT8;
  ubFontFore: UINT8;
  zText: INT16[] /* [200] */;
  uiDestBuff: UINT32;
  BltCallback: OVERLAY_CALLBACK;
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
  pzText: INT16[] /* [200] */;
  BltCallback: OVERLAY_CALLBACK;
}

// FUNCTIONS
////////////

}
