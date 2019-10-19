// TEMP SELECT STUFF
const NO_SELECT = 0;
const FULL_SELECT = 1;
const SELECT_WIDTH = 2;
const SELECT_HEIGHT = 3;

BOOLEAN gfDoVideoScroll;
BOOLEAN gfDoSubtileScroll;
UINT8 gubCurScrollSpeedID;

// RENDERING FLAGS
const RENDER_FLAG_FULL = 0x00000001;
const RENDER_FLAG_SHADOWS = 0x00000002;
const RENDER_FLAG_MARKED = 0x00000004;
const RENDER_FLAG_SAVEOFF = 0x00000008;
const RENDER_FLAG_NOZ = 0x00000010;
const RENDER_FLAG_ROOMIDS = 0x00000020;
const RENDER_FLAG_CHECKZ = 0x00000040;
const RENDER_FLAG_ONLYLAND = 0x00000080;
const RENDER_FLAG_ONLYSTRUCT = 0x00000100;
const RENDER_FLAG_FOVDEBUG = 0x00000200;

const SCROLL_UP = 0x00000001;
const SCROLL_DOWN = 0x00000002;
const SCROLL_RIGHT = 0x00000004;
const SCROLL_LEFT = 0x00000008;
const SCROLL_UPLEFT = 0x00000020;
const SCROLL_UPRIGHT = 0x00000040;
const SCROLL_DOWNLEFT = 0x00000080;
const SCROLL_DOWNRIGHT = 0x00000200;

const Z_SUBLAYERS = 8;
const LAND_Z_LEVEL = 0;
const OBJECT_Z_LEVEL = 1;
const SHADOW_Z_LEVEL = 2;
const MERC_Z_LEVEL = 3;
const STRUCT_Z_LEVEL = 4;
const ROOF_Z_LEVEL = 5;
const ONROOF_Z_LEVEL = 6;
const FOG_Z_LEVEL = 7;
const TOPMOST_Z_LEVEL = 32767;

// highest bit value is rendered first!
const TILES_STATIC_LAND = 0x00040000;
const TILES_STATIC_OBJECTS = 0x00020000;
const TILES_STATIC_SHADOWS = 0x00008000;
const TILES_STATIC_STRUCTURES = 0x00004000;
const TILES_STATIC_ROOF = 0x00002000;
const TILES_STATIC_ONROOF = 0x00001000;
const TILES_STATIC_TOPMOST = 0x00000800;

// highest bit value is rendered first!
const TILES_ALL_DYNAMICS = 0x00000fff;
const TILES_DYNAMIC_CHECKFOR_INT_TILE = 0x00000400;
const TILES_DYNAMIC_LAND = 0x00000200;
const TILES_DYNAMIC_OBJECTS = 0x00000100;
const TILES_DYNAMIC_SHADOWS = 0x00000080;
const TILES_DYNAMIC_STRUCT_MERCS = 0x00000040;
const TILES_DYNAMIC_MERCS = 0x00000020;
const TILES_DYNAMIC_STRUCTURES = 0x00000010;
const TILES_DYNAMIC_ROOF = 0x00000008;
const TILES_DYNAMIC_HIGHMERCS = 0x00000004;
const TILES_DYNAMIC_ONROOF = 0x00000002;
const TILES_DYNAMIC_TOPMOST = 0x00000001;

BOOLEAN gfRenderScroll;
INT16 gsScrollXIncrement;
INT16 gsScrollYIncrement;
INT32 guiScrollDirection;
BOOLEAN gfScrollStart;
extern INT16 gsRenderHeight;

// Distance around mercs to pixelate walls
const REVEAL_WALLS_RADIUS = 3;

// GLOBAL VARIABLES
INT16 SCROLL_X_STEP;
INT16 SCROLL_Y_STEP;

INT16 gsVIEWPORT_START_X;
INT16 gsVIEWPORT_START_Y;
INT16 gsVIEWPORT_WINDOW_START_Y;
INT16 gsVIEWPORT_END_Y;
INT16 gsVIEWPORT_WINDOW_END_Y;
INT16 gsVIEWPORT_END_X;

INT16 gsRenderCenterX;
INT16 gsRenderCenterY;
INT16 gsRenderWorldOffsetX;
INT16 gsRenderWorldOffsetY;

// CURRENT VIEWPORT IN WORLD COORDS
INT16 gsTopLeftWorldX, gsTopLeftWorldY;
INT16 gsTopRightWorldX, gsTopRightWorldY;
INT16 gsBottomLeftWorldX, gsBottomLeftWorldY;
INT16 gsBottomRightWorldX, gsBottomRightWorldY;

SGPRect gSelectRegion;
SGPPoint gSelectAnchor;
UINT32 fSelectMode;

// GLOBAL COORDINATES
INT16 gTopLeftWorldLimitX, gTopLeftWorldLimitY;
INT16 gTopRightWorldLimitX, gTopRightWorldLimitY;
INT16 gBottomLeftWorldLimitX, gBottomLeftWorldLimitY;
INT16 gBottomRightWorldLimitX, gBottomRightWorldLimitY;
INT16 gCenterWorldX, gCenterWorldY;
INT16 gsTLX, gsTLY, gsTRX, gsTRY;
INT16 gsBLX, gsBLY, gsBRX, gsBRY;
INT16 gsCX, gsCY;
DOUBLE gdScaleX, gdScaleY;

BOOLEAN fLandLayerDirty;

BOOLEAN gfIgnoreScrollDueToCenterAdjust;

// FUNCTIONS
void ScrollWorld();
void InitRenderParams(UINT8 ubRestrictionID);
void RenderWorld();

void ResetLayerOptimizing(void);
void ResetSpecificLayerOptimizing(UINT32 uiRowFlag);

// Routines of RenderWorld
extern void RenderStaticWorld();
extern void RenderDynamicWorld();
void CopyRenderBuffer();

void SetRenderFlags(UINT32 uiFlags);
UINT32 GetRenderFlags(void);
void ClearRenderFlags(UINT32 uiFlags);

void RenderSetShadows(BOOLEAN fShadows);

extern UINT16 *gpZBuffer;
extern UINT32 gRenderFlags;
BOOLEAN gfIgnoreScrolling;

BOOLEAN gfScrollInertia;
BOOLEAN gfScrollPending;

// Definitions for dirty rectangle uploads
void ReRenderWorld(INT16 sLeft, INT16 sTop, INT16 sRight, INT16 sBottom);

BOOLEAN ConcealWalls(INT16 sX, INT16 sY, INT16 sRadius);
BOOLEAN RevealWalls(INT16 sX, INT16 sY, INT16 sRadius);
void ConcealAllWalls(void);

BOOLEAN ApplyScrolling(INT16 sTempRenderCenterX, INT16 sTempRenderCenterY, BOOLEAN fForceAdjust, BOOLEAN fCheckOnly);

BOOLEAN Blt8BPPDataTo16BPPBufferTransZIncClip(UINT16 *pBuffer, UINT32 uiDestPitchBYTES, UINT16 *pZBuffer, UINT16 usZValue, HVOBJECT hSrcVObject, INT32 iX, INT32 iY, UINT16 usIndex, SGPRect *clipregion);

void RenderStaticWorldRect(INT16, INT16, INT16, INT16, BOOLEAN);
void RenderMarkedWorld(void);
void RenderDynamicMercWorld(void);

void ExamineZBufferRect(INT16 sLeft, INT16 sTop, INT16 sRight, INT16 sBottom);

void InvalidateWorldRedundency(void);
void InvalidateWorldRedundencyRadius(INT16 sX, INT16 sY, INT16 sRadius);
void DirtyWorldRender();

// These two functions will setup the glow frame script to use then glowing enemy mercs....
void SetMercGlowFast();
void SetMercGlowNormal();

void SetRenderCenter(INT16 sNewX, INT16 sNewY);
