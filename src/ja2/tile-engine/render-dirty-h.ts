// DEFINES
const BGND_FLAG_PERMANENT = 0x80000000;
const BGND_FLAG_SINGLE = 0x40000000;
const BGND_FLAG_SAVE_Z = 0x20000000;
const BGND_FLAG_MERC = 0x10000000;
const BGND_FLAG_SAVERECT = 0x08000000;
const BGND_FLAG_TOPMOST = 0x04000000;
const BGND_FLAG_ANIMATED = 0x00000001;

const VOVERLAY_DIRTYBYTEXT = 0x00000001;
const VOVERLAY_STARTDISABLED = 0x00000002;

const VOVERLAY_DESC_TEXT = 0x00001000;
const VOVERLAY_DESC_DISABLED = 0x00002000;
const VOVERLAY_DESC_POSITION = 0x00004000;

// STRUCTURES

// Callback for topmost blitters
type OVERLAY_CALLBACK = (a: Pointer<VIDEO_OVERLAY>) => void;

// Struct for backgrounds
interface BACKGROUND_SAVE {
  fAllocated: BOOLEAN;
  fFilled: BOOLEAN;
  fFreeMemory: BOOLEAN;
  fZBuffer: BOOLEAN;
  uiFlags: UINT32;
  pSaveArea: Pointer<INT16>;
  pZSaveArea: Pointer<INT16>;
  sLeft: INT16;
  sTop: INT16;
  sRight: INT16;
  sBottom: INT16;
  sWidth: INT16;
  sHeight: INT16;
  fPendingDelete: BOOLEAN;
  fDisabled: BOOLEAN;
}

// Struct for topmost blitters
interface VIDEO_OVERLAY {
  uiFlags: UINT32;
  fAllocated: BOOLEAN;
  fDisabled: BOOLEAN;
  fActivelySaving: BOOLEAN;
  fDeletionPending: BOOLEAN;
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
interface VIDEO_OVERLAY_DESC {
  uiFlags: UINT32;
  fDisabled: BOOLEAN;
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

// GLOBAL VARIABLES
SGPRect gDirtyClipRect;

// FUNCTIONS
////////////

// DIRTY QUEUE
BOOLEAN InitializeBaseDirtyRectQueue();
void ShutdownBaseDirtyRectQueue();
void AddBaseDirtyRect(INT32 iLeft, INT32 iTop, INT32 iRight, INT32 iBottom);
BOOLEAN ExecuteBaseDirtyRectQueue();
BOOLEAN EmptyDirtyRectQueue();

// BACKGROUND RECT BUFFERING STUFF
void DisableBackgroundRect(INT32 iIndex, BOOLEAN fDisabled);
BOOLEAN InitializeBackgroundRects(void);
BOOLEAN ShutdownBackgroundRects(void);
INT32 RegisterBackgroundRect(UINT32 uiFlags, INT16 *pSaveArea, INT16 sLeft, INT16 sTop, INT16 sRight, INT16 sBottom);
BOOLEAN FreeBackgroundRect(INT32 iIndex);
BOOLEAN FreeBackgroundRectPending(INT32 iIndex);
BOOLEAN FreeBackgroundRectType(UINT32 uiFlags);
BOOLEAN RestoreBackgroundRects(void);
BOOLEAN SaveBackgroundRects(void);
BOOLEAN InvalidateBackgroundRects(void);
BOOLEAN UpdateSaveBuffer(void);
BOOLEAN RestoreExternBackgroundRect(INT16 sLeft, INT16 sTop, INT16 sWidth, INT16 sHeight);
void SetBackgroundRectFilled(UINT32 uiBackgroundID);
BOOLEAN EmptyBackgroundRects(void);

// GPRINTF DIRTY STUFF
UINT16 gprintfdirty(INT16 x, INT16 y, UINT16 *pFontString, ...);
UINT16 gprintfinvalidate(INT16 x, INT16 y, UINT16 *pFontString, ...);
UINT16 gprintfRestore(INT16 x, INT16 y, UINT16 *pFontString, ...);

// VIDEO OVERLAY STUFF
INT32 GetFreeVideoOverlay(void);
void RecountVideoOverlays(void);
INT32 RegisterVideoOverlay(UINT32 uiFlags, VIDEO_OVERLAY_DESC *pTopmostDesc);
void ExecuteVideoOverlays();
BOOLEAN UpdateVideoOverlay(VIDEO_OVERLAY_DESC *pTopmostDesc, UINT32 iBlitterIndex, BOOLEAN fForceAll);
void SaveVideoOverlaysArea(UINT32 uiSrcBuffer);
void DeleteVideoOverlaysArea();
void AllocateVideoOverlaysArea();
void ExecuteVideoOverlaysToAlternateBuffer(UINT32 uiNewDestBuffer);
void RemoveVideoOverlay(INT32 iVideoOverlay);
BOOLEAN RestoreShiftedVideoOverlays(INT16 sShiftX, INT16 sShiftY);
BOOLEAN SetOverlayUserData(INT32 iVideoOverlay, UINT8 ubNum, UINT32 uiData);
void EnableVideoOverlay(BOOLEAN fEnable, INT32 iOverlayIndex);

void BlitMFont(VIDEO_OVERLAY *pBlitter);

BOOLEAN BlitBufferToBuffer(UINT32 uiSrcBuffer, UINT32 uiDestBuffer, UINT16 usSrcX, UINT16 usSrcY, UINT16 usWidth, UINT16 usHeight);
