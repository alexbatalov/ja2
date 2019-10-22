let fLandLayerDirty: BOOLEAN = TRUE;

let gpZBuffer: Pointer<UINT16> = NULL;
let gfTagAnimatedTiles: BOOLEAN = TRUE;

let gsCurrentGlowFrame: INT16 = 0;
let gsCurrentItemGlowFrame: INT16 = 0;

// VIEWPORT OFFSET VALUES
// NOTE:
// THESE VALUES MUST BE MULTIPLES OF TILE SIZES!
const VIEWPORT_XOFFSET_S = WORLD_TILE_X * 1;
const VIEWPORT_YOFFSET_S = WORLD_TILE_Y * 2;
const LARGER_VIEWPORT_XOFFSET_S = (VIEWPORT_XOFFSET_S * 3);
const LARGER_VIEWPORT_YOFFSET_S = (VIEWPORT_YOFFSET_S * 5);

const TILES_TYPE_BITMASK = 0x00040000;

const TILES_TYPE_MASK = 0x07ffffff;

const TILES_DIRTY = 0x80000000;
const TILES_DYNAMIC = 0x40000000;
const TILES_NOZWRITE = 0x20000000;
const TILES_MARKED = 0x10000000;
const TILES_NOZ = 0x04000000;
const TILES_DOALL = 0x02000000;
const TILES_OBSCURED = 0x01000000;

//#define TILES_MERC								0x00000400
//#define TILES_Z_BLITTER						0x00000200
//#define TILES_Z_WRITE							0x00000100
//#define TILES_SHADOW							0x00000080
//#define TILES_BACKWARDS						0x00000040

const MAX_RENDERED_ITEMS = 3;

// RENDERER FLAGS FOR DIFFERENT RENDER LEVELS
const enum Enum306 {
  RENDER_STATIC_LAND,
  RENDER_STATIC_OBJECTS,
  RENDER_STATIC_SHADOWS,
  RENDER_STATIC_STRUCTS,
  RENDER_STATIC_ROOF,
  RENDER_STATIC_ONROOF,
  RENDER_STATIC_TOPMOST,
  RENDER_DYNAMIC_LAND,
  RENDER_DYNAMIC_OBJECTS,
  RENDER_DYNAMIC_SHADOWS,
  RENDER_DYNAMIC_STRUCT_MERCS,
  RENDER_DYNAMIC_MERCS,
  RENDER_DYNAMIC_STRUCTS,
  RENDER_DYNAMIC_ROOF,
  RENDER_DYNAMIC_HIGHMERCS,
  RENDER_DYNAMIC_ONROOF,
  RENDER_DYNAMIC_TOPMOST,
  NUM_RENDER_FX_TYPES,
}

const SCROLL_INTERTIA_STEP1 = 6;
const SCROLL_INTERTIA_STEP2 = 8;

//#define SHORT_ROUND( x ) ( (INT16)( ( x * 1000 ) / 1000 ) )
const SHORT_ROUND = (x) => (x);

const NUM_ITEM_CYCLE_COLORS = 60;

let us16BPPItemCycleWhiteColors: UINT16[] /* [NUM_ITEM_CYCLE_COLORS] */;
let us16BPPItemCycleRedColors: UINT16[] /* [NUM_ITEM_CYCLE_COLORS] */;
let us16BPPItemCycleYellowColors: UINT16[] /* [NUM_ITEM_CYCLE_COLORS] */;

let gsLobOutline: INT16;
let gsThrowOutline: INT16;
let gsGiveOutline: INT16;
let gusNormalItemOutlineColor: INT16;
let gusYellowItemOutlineColor: INT16;

let gsRenderHeight: INT16 = 0;
let gfRenderFullThisFrame: BOOLEAN = 0;

// UINT8		gubIntTileCheckFlags	 = INTILE_CHECK_FULL;
let gubIntTileCheckFlags: UINT8 = INTILE_CHECK_SELECTIVE;

let ubRGBItemCycleWhiteColors: UINT8[] /* [] */ = [
  25, 25, 25,
  50, 50, 50,
  75, 75, 75,
  100, 100, 100,
  125, 125, 125,
  150, 150, 150,
  175, 175, 175,
  200, 200, 200,
  225, 225, 225,
  250, 250, 250,

  250, 250, 250,
  225, 225, 225,
  200, 200, 200,
  175, 175, 175,
  150, 150, 150,
  125, 125, 125,
  100, 100, 100,
  75, 75, 75,
  50, 50, 50,
  25, 25, 25,

  25, 25, 25,
  50, 50, 50,
  75, 75, 75,
  100, 100, 100,
  125, 125, 125,
  150, 150, 150,
  175, 175, 175,
  200, 200, 200,
  225, 225, 225,
  250, 250, 250,

  250, 250, 250,
  225, 225, 225,
  200, 200, 200,
  175, 175, 175,
  150, 150, 150,
  125, 125, 125,
  100, 100, 100,
  75, 75, 75,
  50, 50, 50,
  25, 25, 25,

  25, 25, 25,
  50, 50, 50,
  75, 75, 75,
  100, 100, 100,
  125, 125, 125,
  150, 150, 150,
  175, 175, 175,
  200, 200, 200,
  225, 225, 225,
  250, 250, 250,

  250, 250, 250,
  225, 225, 225,
  200, 200, 200,
  175, 175, 175,
  150, 150, 150,
  125, 125, 125,
  100, 100, 100,
  75, 75, 75,
  50, 50, 50,
  25, 25, 25,
];

let ubRGBItemCycleRedColors: UINT8[] /* [] */ = [
  25, 0, 0,
  50, 0, 0,
  75, 0, 0,
  100, 0, 0,
  125, 0, 0,
  150, 0, 0,
  175, 0, 0,
  200, 0, 0,
  225, 0, 0,
  250, 0, 0,

  250, 0, 0,
  225, 0, 0,
  200, 0, 0,
  175, 0, 0,
  150, 0, 0,
  125, 0, 0,
  100, 0, 0,
  75, 0, 0,
  50, 0, 0,
  25, 0, 0,

  25, 0, 0,
  50, 0, 0,
  75, 0, 0,
  100, 0, 0,
  125, 0, 0,
  150, 0, 0,
  175, 0, 0,
  200, 0, 0,
  225, 0, 0,
  250, 0, 0,

  250, 0, 0,
  225, 0, 0,
  200, 0, 0,
  175, 0, 0,
  150, 0, 0,
  125, 0, 0,
  100, 0, 0,
  75, 0, 0,
  50, 0, 0,
  25, 0, 0,

  25, 0, 0,
  50, 0, 0,
  75, 0, 0,
  100, 0, 0,
  125, 0, 0,
  150, 0, 0,
  175, 0, 0,
  200, 0, 0,
  225, 0, 0,
  250, 0, 0,

  250, 0, 0,
  225, 0, 0,
  200, 0, 0,
  175, 0, 0,
  150, 0, 0,
  125, 0, 0,
  100, 0, 0,
  75, 0, 0,
  50, 0, 0,
  25, 0, 0,
];

let ubRGBItemCycleYellowColors: UINT8[] /* [] */ = [
  25, 25, 0,
  50, 50, 0,
  75, 75, 0,
  100, 100, 0,
  125, 125, 0,
  150, 150, 0,
  175, 175, 0,
  200, 200, 0,
  225, 225, 0,
  250, 250, 0,

  250, 250, 0,
  225, 225, 0,
  200, 200, 0,
  175, 175, 0,
  150, 150, 0,
  125, 125, 0,
  100, 100, 0,
  75, 75, 0,
  50, 50, 0,
  25, 25, 0,

  25, 25, 0,
  50, 50, 0,
  75, 75, 0,
  100, 100, 0,
  125, 125, 0,
  150, 150, 0,
  175, 175, 0,
  200, 200, 0,
  225, 225, 0,
  250, 250, 0,

  250, 250, 0,
  225, 225, 0,
  200, 200, 0,
  175, 175, 0,
  150, 150, 0,
  125, 125, 0,
  100, 100, 0,
  75, 75, 0,
  50, 50, 0,
  25, 25, 0,

  25, 25, 0,
  50, 50, 0,
  75, 75, 0,
  100, 100, 0,
  125, 125, 0,
  150, 150, 0,
  175, 175, 0,
  200, 200, 0,
  225, 225, 0,
  250, 250, 0,

  250, 250, 0,
  225, 225, 0,
  200, 200, 0,
  175, 175, 0,
  150, 150, 0,
  125, 125, 0,
  100, 100, 0,
  75, 75, 0,
  50, 50, 0,
  25, 25, 0,
];

const NUMSPEEDS = 5;

let gubNewScrollXSpeeds: UINT8[][] /* [2][NUMSPEEDS] */ = [
  [ 40, 80, 100, 180, 200 ], // Non-video mode scroll
  [ 20, 40, 80, 80, 80 ], // Video mode scroll
];

let gubNewScrollYSpeeds: UINT8[][] /* [2][NUMSPEEDS] */ = [
  [ 40, 80, 100, 180, 200 ], // Non-video mode scroll
  [ 10, 20, 60, 80, 80 ], // Video mode scroll
];

// These speeds are only an indication of how long to do each subtile step until moving on to another
let gubNewScrollIDSpeeds: UINT8[] /* [] */ = [
  10,
  10,
  20,
  20,
  20,
];

let gubScrollSpeedStartID: UINT8 = 2;
let gubScrollSpeedEndID: UINT8 = 4;

let gubCurScrollSpeedID: UINT8 = 1;

let gfDoVideoScroll: BOOLEAN = TRUE;
let gfDoSubtileScroll: BOOLEAN = FALSE;

let gfScrollPending: BOOLEAN = FALSE;

let uiLayerUsedFlags: UINT32 = 0xffffffff;
let uiAdditiveLayerUsedFlags: UINT32 = 0xffffffff;

// Array of shade values to use.....
const NUM_GLOW_FRAMES = 30;

let gsGlowFrames: INT16[] /* [] */ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,

  2,
  4,
  6,
  8,
  9,
  8,
  6,
  4,
  2,
  0,
];

// This has to be the same # of frames as NUM_GLOW_FRAMES
let gsFastGlowFrames: INT16[] /* [] */ = [
  0,
  0,
  6,
  7,
  8,
  9,
  8,
  7,
  6,
  5,

  0,
  0,
  6,
  7,
  8,
  9,
  8,
  7,
  6,
  5,

  0,
  0,
  6,
  7,
  8,
  9,
  8,
  7,
  6,
  5,
];

// The glow frame pointer can be adjusted to use a faster/ slower glow
let gpGlowFramePointer: Pointer<INT16> = gsGlowFrames;

let gScrollDirectionFlags: UINT32[] /* [NUM_WORLD_DIRECTIONS] */ = [
  SCROLL_UP | SCROLL_RIGHT,
  SCROLL_RIGHT,
  SCROLL_DOWN | SCROLL_RIGHT,
  SCROLL_DOWN,
  SCROLL_DOWN | SCROLL_LEFT,
  SCROLL_LEFT,
  SCROLL_UP | SCROLL_LEFT,
  SCROLL_UP,
];

let SCROLL_X_STEP: INT16 = (WORLD_TILE_X);
let SCROLL_Y_STEP: INT16 = (WORLD_TILE_Y * 2);

let gsVIEWPORT_START_X: INT16 = 0;
let gsVIEWPORT_START_Y: INT16 = 0;
let gsVIEWPORT_END_Y: INT16 = 360;
let gsVIEWPORT_WINDOW_END_Y: INT16 = 360;
let gsVIEWPORT_WINDOW_START_Y: INT16 = 0;
let gsVIEWPORT_END_X: INT16 = 640;

let gsTopLeftWorldX: INT16;
let gsTopLeftWorldY: INT16;
let gsTopRightWorldX: INT16;
let gsTopRightWorldY: INT16;
let gsBottomLeftWorldX: INT16;
let gsBottomLeftWorldY: INT16;
let gsBottomRightWorldX: INT16;
let gsBottomRightWorldY: INT16;
let gfIgnoreScrolling: BOOLEAN = FALSE;

let gfIgnoreScrollDueToCenterAdjust: BOOLEAN = FALSE;

// GLOBAL SCROLLING PARAMS
let gTopLeftWorldLimitX: INT16;
let gTopLeftWorldLimitY: INT16;
let gTopRightWorldLimitX: INT16;
let gTopRightWorldLimitY: INT16;
let gBottomLeftWorldLimitX: INT16;
let gBottomLeftWorldLimitY: INT16;
let gBottomRightWorldLimitX: INT16;
let gBottomRightWorldLimitY: INT16;
let Slide: INT16;
let gCenterWorldY: INT16;
let gsTLX: INT16;
let gsTLY: INT16;
let gsTRX: INT16;
let gsTRY: INT16;
let gsBLX: INT16;
let gsBLY: INT16;
let gsBRX: INT16;
let gsBRY: INT16;
let gsCX: INT16;
let gsCY: INT16;
let gdScaleX: DOUBLE;
let gdScaleY: DOUBLE;

const FASTMAPROWCOLTOPOS = (r, c) => ((r) * WORLD_COLS + (c));

let gfScrollInertia: BOOLEAN = FALSE;

// GLOBALS FOR CALCULATING STARTING PARAMETERS
let gsStartPointX_W: INT16;
let gsStartPointY_W: INT16;
let gsStartPointX_S: INT16;
let gsStartPointY_S: INT16;
let gsStartPointX_M: INT16;
let gsStartPointY_M: INT16;
let gsEndXS: INT16;
let gsEndYS: INT16;
// LARGER OFFSET VERSION FOR GIVEN LAYERS
let gsLStartPointX_W: INT16;
let gsLStartPointY_W: INT16;
let gsLStartPointX_S: INT16;
let gsLStartPointY_S: INT16;
let gsLStartPointX_M: INT16;
let gsLStartPointY_M: INT16;
let gsLEndXS: INT16;
let gsLEndYS: INT16;

let gfRenderScroll: BOOLEAN = FALSE;
let gfScrollStart: BOOLEAN = FALSE;
let gsScrollXIncrement: INT16;
let gsScrollYIncrement: INT16;
let guiScrollDirection: INT32;

// Rendering flags (full, partial, etc.)
let gRenderFlags: UINT32 = 0;

let gClippingRect: SGPRect = [ 0, 0, 640, 360 ];
let gOldClipRect: SGPRect;
let gsRenderCenterX: INT16;
let gsRenderCenterY: INT16;
let gsRenderWorldOffsetX: INT16 = -1;
let gsRenderWorldOffsetY: INT16 = -1;
let gSelectRegion: SGPRect;
let fSelectMode: UINT32 = NO_SELECT;
let gSelectAnchor: SGPPoint;

interface RenderFXType {
  fDynamic: BOOLEAN;
  fZWrite: BOOLEAN;
  fZBlitter: BOOLEAN;
  fShadowBlitter: BOOLEAN;
  fLinkedListDirection: BOOLEAN;
  fMerc: BOOLEAN;
  fCheckForRedundency: BOOLEAN;
  fMultiZBlitter: BOOLEAN;
  fConvertTo16: BOOLEAN;
  fObscured: BOOLEAN;
}

let RenderFX: RenderFXType[] /* [] */ = [
  [ FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE ], // STATIC LAND
  [ FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE ], // STATIC OBJECTS
  [ FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // STATIC SHADOWS
  [ FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE ], // STATIC STRUCTS
  [ FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // STATIC ROOF
  [ FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE ], // STATIC ONROOF
  [ FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // STATIC TOPMOST
  [ TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE ], // DYNAMIC LAND
  [ TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE ], // DYNAMIC OBJECT
  [ TRUE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC SHADOW
  [ TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC STRUCT MERCS
  [ TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC MERCS
  [ TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC STRUCT
  [ TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC ROOF
  [ TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC HIGHMERCS
  [ TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC ONROOF
  [ TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE ], // DYNAMIC TOPMOST
];

let RenderFXStartIndex: UINT8[] /* [] */ = [
  LAND_START_INDEX, // STATIC LAND
  OBJECT_START_INDEX, // STATIC OBJECTS
  SHADOW_START_INDEX, // STATIC SHADOWS
  STRUCT_START_INDEX, // STATIC STRUCTS
  ROOF_START_INDEX, // STATIC ROOF
  ONROOF_START_INDEX, // STATIC ONROOF
  TOPMOST_START_INDEX, // STATIC TOPMOST
  LAND_START_INDEX, // DYNAMIC LAND
  OBJECT_START_INDEX, // DYNAMIC OBJECT
  SHADOW_START_INDEX, // DYNAMIC SHADOW
  MERC_START_INDEX, // DYNAMIC STRUCT MERCS
  MERC_START_INDEX, // DYNAMIC MERCS
  STRUCT_START_INDEX, // DYNAMIC STRUCT
  ROOF_START_INDEX, // DYNAMIC ROOF
  MERC_START_INDEX, // DYNAMIC HIGHMERCS
  ONROOF_START_INDEX, // DYNAMIC ONROOF
  TOPMOST_START_INDEX, // DYNAMIC TOPMOST
];

// INT16 gsCoordArray[ 500 ][ 500 ][ 4 ];
// INT16 gsCoordArrayX;
// INT16 gsCoordArrayY;

// void SetRenderGlobals( INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS );
// void TempRenderTiles(UINT32 uiFlags, INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS );
// void TempRenderTiles(UINT32 uiFlags, INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS, UINT8 ubNumLevels, UINT32 *puiLevels );

function RevealWalls(sX: INT16, sY: INT16, sRadius: INT16): BOOLEAN {
  let pStruct: Pointer<LEVELNODE>;
  let sCountX: INT16;
  let sCountY: INT16;
  let uiTile: UINT32;
  let fRerender: BOOLEAN = FALSE;
  let TileElem: Pointer<TILE_ELEMENT>;

  for (sCountY = sY - sRadius; sCountY < (sY + sRadius + 2); sCountY++)
    for (sCountX = sX - sRadius; sCountX < (sX + sRadius + 2); sCountX++) {
      uiTile = FASTMAPROWCOLTOPOS(sCountY, sCountX);
      pStruct = gpWorldLevelData[uiTile].pStructHead;

      while (pStruct != NULL) {
        TileElem = &(gTileDatabase[pStruct->usIndex]);
        switch (TileElem->usWallOrientation) {
          case NO_ORIENTATION:
            break;

          case INSIDE_TOP_RIGHT:
          case OUTSIDE_TOP_RIGHT:
            if (sCountX >= sX) {
              pStruct->uiFlags |= LEVELNODE_REVEAL;
              fRerender = TRUE;
            }
            break;

          case INSIDE_TOP_LEFT:
          case OUTSIDE_TOP_LEFT:
            if (sCountY >= sY) {
              pStruct->uiFlags |= LEVELNODE_REVEAL;
              fRerender = TRUE;
            }
            break;
        }
        pStruct = pStruct->pNext;
      }
    }

  /*
          if(fRerender)
                  SetRenderFlags(RENDER_FLAG_FULL);
  */

  return TRUE;
}

function ConcealWalls(sX: INT16, sY: INT16, sRadius: INT16): BOOLEAN {
  let pStruct: Pointer<LEVELNODE>;
  let sCountX: INT16;
  let sCountY: INT16;
  let uiTile: UINT32;
  let fRerender: BOOLEAN = FALSE;
  let TileElem: Pointer<TILE_ELEMENT>;

  for (sCountY = sY - sRadius; sCountY < (sY + sRadius + 2); sCountY++)
    for (sCountX = sX - sRadius; sCountX < (sX + sRadius + 2); sCountX++) {
      uiTile = FASTMAPROWCOLTOPOS(sCountY, sCountX);
      pStruct = gpWorldLevelData[uiTile].pStructHead;

      while (pStruct != NULL) {
        TileElem = &(gTileDatabase[pStruct->usIndex]);
        switch (TileElem->usWallOrientation) {
          case NO_ORIENTATION:
            break;

          case INSIDE_TOP_RIGHT:
          case OUTSIDE_TOP_RIGHT:
            if (sCountX >= sX) {
              pStruct->uiFlags &= (~LEVELNODE_REVEAL);
              fRerender = TRUE;
            }
            break;

          case INSIDE_TOP_LEFT:
          case OUTSIDE_TOP_LEFT:
            if (sCountY >= sY) {
              pStruct->uiFlags &= (~LEVELNODE_REVEAL);
              fRerender = TRUE;
            }
            break;
        }
        pStruct = pStruct->pNext;
      }
    }

  /*
          if(fRerender)
                  SetRenderFlags(RENDER_FLAG_FULL);
  */

  return TRUE;
}

function ConcealAllWalls(): void {
  let pStruct: Pointer<LEVELNODE>;
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < WORLD_MAX; uiCount++) {
    pStruct = gpWorldLevelData[uiCount].pStructHead;
    while (pStruct != NULL) {
      pStruct->uiFlags &= (~LEVELNODE_REVEAL);
      pStruct = pStruct->pNext;
    }
  }
}

function ResetLayerOptimizing(): void {
  uiLayerUsedFlags = 0xffffffff;
  uiAdditiveLayerUsedFlags = 0;
}

function ResetSpecificLayerOptimizing(uiRowFlag: UINT32): void {
  uiLayerUsedFlags |= uiRowFlag;
}

function SumAddiviveLayerOptimization(): void {
  uiLayerUsedFlags = uiAdditiveLayerUsedFlags;
}

function SetRenderFlags(uiFlags: UINT32): void {
  gRenderFlags |= uiFlags;
}

function ClearRenderFlags(uiFlags: UINT32): void {
  gRenderFlags &= (~uiFlags);
}

function GetRenderFlags(): UINT32 {
  return gRenderFlags;
}

function RenderSetShadows(fShadows: BOOLEAN): void {
  if (fShadows)
    gRenderFlags |= RENDER_FLAG_SHADOWS;
  else
    gRenderFlags &= (~RENDER_FLAG_SHADOWS);
}

function RenderTiles(uiFlags: UINT32, iStartPointX_M: INT32, iStartPointY_M: INT32, iStartPointX_S: INT32, iStartPointY_S: INT32, iEndXS: INT32, iEndYS: INT32, ubNumLevels: UINT8, puiLevels: Pointer<UINT32>, psLevelIDs: Pointer<UINT16>): void {
  //#if 0

  let pNode: Pointer<LEVELNODE>; //, *pLand, *pStruct; //*pObject, *pTopmost, *pMerc;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pSelSoldier: Pointer<SOLDIERTYPE>;
  let hVObject: HVOBJECT;
  let pTrav: Pointer<ETRLEObject>;
  let TileElem: Pointer<TILE_ELEMENT> = NULL;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8> = NULL;
  let usAnimSurface: UINT16;
  let bXOddFlag: INT8 = 0;
  let iAnchorPosX_M: INT32;
  let iAnchorPosY_M: INT32;
  let iAnchorPosX_S: INT32;
  let iAnchorPosY_S: INT32;
  let iTempPosX_M: INT32;
  let iTempPosY_M: INT32;
  let iTempPosX_S: INT32;
  let iTempPosY_S: INT32;
  let dOffsetX: FLOAT;
  let dOffsetY: FLOAT;
  let dTempX_S: FLOAT;
  let dTempY_S: FLOAT;
  let uiTileIndex: UINT32;
  let usImageIndex: UINT16;
  let pShadeTable: Pointer<UINT16>;
  let pDirtyBackPtr: Pointer<UINT16>;
  let uiBrushWidth: UINT32;
  let uiBrushHeight: UINT32;
  let uiDirtyFlags: UINT32;
  let sTileHeight: INT16;
  let sXPos: INT16;
  let sYPos: INT16;
  let sZLevel: INT16;
  let sMouseX_M: INT16;
  let sMouseY_M: INT16;
  let fShadowBlitter: BOOLEAN = FALSE;
  let fZBlitter: BOOLEAN = FALSE;
  let fZWrite: BOOLEAN = FALSE;
  let fLinkedListDirection: BOOLEAN = TRUE;
  let fRenderTile: BOOLEAN = TRUE;
  let fMerc: BOOLEAN = FALSE;
  let fCheckForRedundency: BOOLEAN = FALSE;
  let uiRowFlags: UINT32;
  let fDynamic: BOOLEAN = TRUE;
  let fEndRenderRow: BOOLEAN = FALSE;
  let fEndRenderCol: BOOLEAN = FALSE;
  let fPixelate: BOOLEAN = FALSE;
  let fMultiZBlitter: BOOLEAN = FALSE;
  let fWallTile: BOOLEAN = FALSE;
  let fMultiTransShadowZBlitter: BOOLEAN = FALSE;
  let sMultiTransShadowZBlitterIndex: INT16 = -1;
  let fTranslucencyType: BOOLEAN = FALSE;
  let sX: INT16;
  let sY: INT16;
  let fTileInvisible: BOOLEAN = FALSE;
  let fConvertTo16: BOOLEAN = FALSE;
  let fBlit16: BOOLEAN = FALSE;
  let cnt: UINT32;
  /* static */ let ubLevelNodeStartIndex: UINT8[] /* [NUM_RENDER_FX_TYPES] */;
  let bItemOutline: BOOLEAN;
  let usOutlineColor: UINT16 = 0;

  /* static */ let iTileMapPos: INT32[] /* [500] */;
  let uiMapPosIndex: UINT32;
  let bBlitClipVal: UINT8;
  let bItemCount: INT8;
  let bVisibleItemCount: INT8;
  // UINT16			us16BPPIndex;
  let RenderingFX: RenderFXType;
  let fCheckForMouseDetections: BOOLEAN = FALSE;
  /* static */ let RenderFXList: RenderFXType[] /* [NUM_RENDER_FX_TYPES] */;
  let fSaveZ: BOOLEAN;
  let sWorldY: INT16;
  let sZOffsetX: INT16 = -1;
  let sZOffsetY: INT16 = -1;
  let fIntensityBlitter: BOOLEAN;
  let gsForceSoldierZLevel: INT16;
  let pCorpse: Pointer<ROTTING_CORPSE> = NULL;
  let fUseTileElem: BOOLEAN;
  let uiLevelNodeFlags: UINT32;
  let uiTileElemFlags: UINT32 = 0;
  let bGlowShadeOffset: INT8;
  let fObscured: BOOLEAN;
  let fObscuredBlitter: BOOLEAN;
  let sModifiedTileHeight: INT16;
  let fDoRow: BOOLEAN;
  let pShadeStart: Pointer<Pointer<INT16>>;

  let uiSaveBufferPitchBYTES: UINT32;
  let pSaveBuf: Pointer<UINT8>;
  let pItemPool: Pointer<ITEM_POOL> = NULL;
  let fHiddenTile: BOOLEAN = FALSE;
  let uiAniTileFlags: UINT32 = 0;

  // Init some variables
  usImageIndex = 0;
  sZLevel = 0;
  uiDirtyFlags = 0;
  pShadeTable = NULL;

  // Begin Render Loop
  iAnchorPosX_M = iStartPointX_M;
  iAnchorPosY_M = iStartPointY_M;
  iAnchorPosX_S = iStartPointX_S;
  iAnchorPosY_S = iStartPointY_S;

  if (!(uiFlags & TILES_DIRTY))
    pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

  if (uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE) {
    if (ShouldCheckForMouseDetections()) {
      BeginCurInteractiveTileCheck(gubIntTileCheckFlags);
      fCheckForMouseDetections = TRUE;

      // If we are in edit mode, don't do this...
      if (gfEditMode) {
        fCheckForMouseDetections = FALSE;
      }
    }
  }

  // if((uiFlags&TILES_TYPE_MASK)==TILES_STATIC_LAND)
  GetMouseXY(&sMouseX_M, &sMouseY_M);

  pDirtyBackPtr = NULL;

  if (gTacticalStatus.uiFlags & TRANSLUCENCY_TYPE)
    fTranslucencyType = TRUE;

  for (cnt = 0; cnt < ubNumLevels; cnt++) {
    ubLevelNodeStartIndex[cnt] = RenderFXStartIndex[psLevelIDs[cnt]];
    RenderFXList[cnt] = RenderFX[psLevelIDs[cnt]];
  }

  do {
    iTempPosX_M = iAnchorPosX_M;
    iTempPosY_M = iAnchorPosY_M;
    iTempPosX_S = iAnchorPosX_S;
    iTempPosY_S = iAnchorPosY_S;

    uiMapPosIndex = 0;

    // Build tile index list
    do {
      iTileMapPos[uiMapPosIndex] = FASTMAPROWCOLTOPOS(iTempPosY_M, iTempPosX_M);

      iTempPosX_S += 40;
      iTempPosX_M++;
      iTempPosY_M--;

      uiMapPosIndex++;
    } while (iTempPosX_S < iEndXS);

    for (cnt = 0; cnt < ubNumLevels; cnt++) {
      uiRowFlags = puiLevels[cnt];
      fDoRow = TRUE;

      if ((uiRowFlags & TILES_ALL_DYNAMICS) && !(uiLayerUsedFlags & uiRowFlags) && !(uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE)) {
        fDoRow = FALSE;
      }

      if (fDoRow) {
        iTempPosX_M = iAnchorPosX_M;
        iTempPosY_M = iAnchorPosY_M;
        iTempPosX_S = iAnchorPosX_S;
        iTempPosY_S = iAnchorPosY_S;

        fEndRenderRow = FALSE;
        uiMapPosIndex = 0;

        if (bXOddFlag > 0)
          iTempPosX_S += 20;

        do {
          uiTileIndex = iTileMapPos[uiMapPosIndex];
          uiMapPosIndex++;

          // if ( 0 )
          if (uiTileIndex < GRIDSIZE) {
            // OK, we're sreaching through this loop anyway, might as well check for mouse position
            // over objects...
            // Experimental!
            if (uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE) {
              if (fCheckForMouseDetections && gpWorldLevelData[uiTileIndex].pStructHead != NULL) {
                LogMouseOverInteractiveTile(uiTileIndex);
              }
            }

            if ((uiFlags & TILES_MARKED) && !(gpWorldLevelData[uiTileIndex].uiFlags & MAPELEMENT_REDRAW)) {
              pNode = NULL;
            } else {
              // pNode = gpWorldLevelData[ uiTileIndex ].pLevelNodes[ RenderFXStartIndex[ psLevelIDs[ cnt ] ] ];
              // pNode = gpWorldLevelData[ uiTileIndex ].pLevelNodes[ 0 ];
              // pNode=NULL;
              pNode = gpWorldLevelData[uiTileIndex].pLevelNodes[ubLevelNodeStartIndex[cnt]];
            }

            bItemCount = 0;
            bVisibleItemCount = 0;
            pItemPool = NULL;

            while (pNode != NULL) {
              RenderingFX = RenderFXList[cnt];

              fObscured = RenderingFX.fObscured;
              fDynamic = RenderingFX.fDynamic;

              fMerc = RenderingFX.fMerc;
              fZWrite = RenderingFX.fZWrite;
              fZBlitter = RenderingFX.fZBlitter;
              fShadowBlitter = RenderingFX.fShadowBlitter;
              fLinkedListDirection = RenderingFX.fLinkedListDirection;
              fCheckForRedundency = RenderingFX.fCheckForRedundency;
              fMultiZBlitter = RenderingFX.fMultiZBlitter;
              fConvertTo16 = RenderingFX.fConvertTo16;
              fIntensityBlitter = FALSE;
              fSaveZ = FALSE;
              fWallTile = FALSE;
              gsForceSoldierZLevel = FALSE;
              pSoldier = NULL;
              fUseTileElem = FALSE;
              fMultiTransShadowZBlitter = FALSE;
              fObscuredBlitter = FALSE;
              fTranslucencyType = TRUE;
              uiAniTileFlags = 0;

              uiLevelNodeFlags = pNode->uiFlags;

              if (fCheckForRedundency) {
                if ((gpWorldLevelData[uiTileIndex].uiFlags & MAPELEMENT_REDUNDENT)) {
                  // IF WE DONOT WANT TO RE-EVALUATE FIRST
                  if (!(gpWorldLevelData[uiTileIndex].uiFlags & MAPELEMENT_REEVALUATE_REDUNDENCY) && !(gTacticalStatus.uiFlags & NOHIDE_REDUNDENCY)) {
                    pNode = NULL;
                    break;
                  }
                }
              }

              // Force z-buffer blitting for marked tiles ( even ground!)
              if ((uiFlags & TILES_MARKED)) {
                fZBlitter = TRUE;
              }

              // Looking up height every time here is alot better than doing it above!
              sTileHeight = gpWorldLevelData[uiTileIndex].sHeight;

              sModifiedTileHeight = (((sTileHeight / 80) - 1) * 80);

              if (sModifiedTileHeight < 0) {
                sModifiedTileHeight = 0;
              }

              fRenderTile = TRUE;
              pDirtyBackPtr = NULL;
              if (uiLevelNodeFlags & LEVELNODE_REVEAL) {
                if (!fDynamic)
                  fRenderTile = FALSE;
                else
                  fPixelate = TRUE;
              } else
                fPixelate = FALSE;

              // non-type specific setup
              sXPos = iTempPosX_S;
              sYPos = iTempPosY_S;

              // setup for any tile type except mercs
              if (!fMerc) {
                if (!(uiLevelNodeFlags & (LEVELNODE_ROTTINGCORPSE | LEVELNODE_CACHEDANITILE))) {
                  if ((uiLevelNodeFlags & LEVELNODE_REVEALTREES)) {
                    TileElem = &(gTileDatabase[pNode->usIndex + 2]);
                  } else {
                    TileElem = &(gTileDatabase[pNode->usIndex]);
                  }

                  // HANDLE INDEPENDANT-PER-TILE ANIMATIONS ( IE: DOORS, EXPLODING THINGS, ETC )
                  if (fDynamic) {
                    if ((uiLevelNodeFlags & LEVELNODE_ANIMATION)) {
                      if (pNode->sCurrentFrame != -1) {
                        Assert(TileElem->pAnimData != NULL);
                        TileElem = &gTileDatabase[TileElem->pAnimData->pusFrames[pNode->sCurrentFrame]];
                      }
                    }
                  }
                }

                // Check for best translucency
                if (uiLevelNodeFlags & LEVELNODE_USEBESTTRANSTYPE) {
                  fTranslucencyType = FALSE;
                }

                if ((uiLevelNodeFlags & (LEVELNODE_ROTTINGCORPSE | LEVELNODE_CACHEDANITILE))) {
                  if (fDynamic) {
                    if (!(uiLevelNodeFlags & (LEVELNODE_DYNAMIC)) && !(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC))
                      fRenderTile = FALSE;
                  } else if ((uiLevelNodeFlags & (LEVELNODE_DYNAMIC)))
                    fRenderTile = FALSE;
                } else {
                  // Set Tile elem flags here!
                  uiTileElemFlags = TileElem->uiFlags;
                  // Set valid tile elem!
                  fUseTileElem = TRUE;

                  if (fDynamic || fPixelate) {
                    if (!fPixelate) {
                      if (!(uiTileElemFlags & ANIMATED_TILE) && !(uiTileElemFlags & DYNAMIC_TILE) && !(uiLevelNodeFlags & LEVELNODE_DYNAMIC) && !(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC))
                        fRenderTile = FALSE;
                      else if (!(uiTileElemFlags & DYNAMIC_TILE) && !(uiLevelNodeFlags & LEVELNODE_DYNAMIC) && !(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC))
                      //	else if((TileElem->uiFlags&ANIMATED_TILE) )
                      {
                        Assert(TileElem->pAnimData != NULL);
                        TileElem = &gTileDatabase[TileElem->pAnimData->pusFrames[TileElem->pAnimData->bCurrentFrame]];
                        uiTileElemFlags = TileElem->uiFlags;
                      }
                    }
                  } else if ((uiTileElemFlags & ANIMATED_TILE) || (uiTileElemFlags & DYNAMIC_TILE) || (uiLevelNodeFlags & LEVELNODE_DYNAMIC)) {
                    if (!(uiFlags & TILES_OBSCURED) || (uiTileElemFlags & ANIMATED_TILE)) {
                      fRenderTile = FALSE;
                    }
                  }
                }

                // OK, ATE, CHECK FOR AN OBSCURED TILE AND MAKE SURE IF LEVELNODE IS SET
                // WE DON'T RENDER UNLESS WE HAVE THE RENDER FLAG SET!
                if (fObscured) {
                  if ((uiFlags & TILES_OBSCURED)) {
                    if (uiLevelNodeFlags & LEVELNODE_SHOW_THROUGH) {
                      fObscuredBlitter = TRUE;

                      // ATE: Check if this is a levelnode, and what frame we are on
                      // turn off......
                      // if ( ( uiLevelNodeFlags & LEVELNODE_ITEM ) && gsCurrentItemGlowFrame < 25 )
                      //{
                      //	fRenderTile = FALSE;
                      //}
                    } else {
                      // Don;t render if we are not on this render loop!
                      fRenderTile = FALSE;
                    }
                  } else {
                    if (uiLevelNodeFlags & LEVELNODE_SHOW_THROUGH) {
                      fRenderTile = FALSE;

                      // ATE: Check if this is a levelnode, and what frame we are on
                      // turn off......
                      // if ( ( uiLevelNodeFlags & LEVELNODE_ITEM ) && gsCurrentItemGlowFrame < 25 )
                      //{
                      //	fRenderTile = TRUE;
                      //}
                    }
                  }
                }

                // If flag says to do dynamic as well, render!
                if ((uiFlags & TILES_DOALL)) {
                  fRenderTile = TRUE;
                }

                // If we are on the struct layer, check for if it's hidden!
                if (uiRowFlags & (TILES_STATIC_STRUCTURES | TILES_DYNAMIC_STRUCTURES | TILES_STATIC_SHADOWS | TILES_DYNAMIC_SHADOWS)) {
                  if (fUseTileElem) {
                  }
                }

                if (fRenderTile) {
                  // Set flag to set layer as used
                  if (fDynamic || fPixelate) {
                    uiAdditiveLayerUsedFlags |= uiRowFlags;
                  }

                  if (uiLevelNodeFlags & LEVELNODE_DYNAMICZ) {
                    fSaveZ = TRUE;
                    fZWrite = TRUE;
                  }

                  if ((uiLevelNodeFlags & LEVELNODE_CACHEDANITILE)) {
                    hVObject = gpTileCache[pNode->pAniTile->sCachedTileID].pImagery->vo;
                    usImageIndex = pNode->pAniTile->sCurrentFrame;
                    uiAniTileFlags = pNode->pAniTile->uiFlags;

                    // Position corpse based on it's float position
                    if ((uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE)) {
                      pCorpse = &(gRottingCorpse[pNode->pAniTile->uiUserData]);

                      pShadeTable = pCorpse->pShades[pNode->ubShadeLevel];

                      // pShadeTable = pCorpse->p16BPPPalette;

                      dOffsetX = pCorpse->def.dXPos - gsRenderCenterX;
                      dOffsetY = pCorpse->def.dYPos - gsRenderCenterY;

                      // OK, if this is a corpse.... stop if not visible
                      if (pCorpse->def.bVisible != 1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
                        // CONTINUE, DONOT RENDER
                        if (!fLinkedListDirection)
                          pNode = pNode->pPrevNode;
                        else
                          pNode = pNode->pNext;

                        continue;
                      }
                    } else {
                      dOffsetX = (pNode->pAniTile->sRelativeX - gsRenderCenterX);
                      dOffsetY = (pNode->pAniTile->sRelativeY - gsRenderCenterY);
                    }

                    // Calculate guy's position
                    FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, &dTempX_S, &dTempY_S);

                    sXPos = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
                    sYPos = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S - sTileHeight;

                    // Adjust for offset position on screen
                    sXPos -= gsRenderWorldOffsetX;
                    sYPos -= gsRenderWorldOffsetY;
                  } else {
                    hVObject = TileElem->hTileSurface;
                    usImageIndex = TileElem->usRegionIndex;

                    // ADJUST FOR WORLD MAPELEM HIEGHT
                    sYPos -= TileElem->sOffsetHeight;

                    if ((TileElem->uiFlags & IGNORE_WORLD_HEIGHT)) {
                      sYPos = sYPos - sModifiedTileHeight;
                      // sYPos -= sTileHeight;
                    }

                    if (!(uiLevelNodeFlags & LEVELNODE_IGNOREHEIGHT) && !(TileElem->uiFlags & IGNORE_WORLD_HEIGHT))
                      sYPos -= sTileHeight;

                    if (!(uiFlags & TILES_DIRTY)) {
                      hVObject->pShadeCurrent = hVObject->pShades[pNode->ubShadeLevel];
                      hVObject->pShade8 = ubColorTables[pNode->ubShadeLevel];
                    }
                  }

                  // ADJUST FOR RELATIVE OFFSETS
                  if (uiLevelNodeFlags & LEVELNODE_USERELPOS) {
                    sXPos += pNode->sRelativeX;
                    sYPos += pNode->sRelativeY;
                  }

                  if (uiLevelNodeFlags & LEVELNODE_USEZ) {
                    sYPos -= pNode->sRelativeZ;
                  }

                  // ADJUST FOR ABSOLUTE POSITIONING
                  if (uiLevelNodeFlags & LEVELNODE_USEABSOLUTEPOS) {
                    dOffsetX = (pNode->sRelativeX - gsRenderCenterX);
                    dOffsetY = (pNode->sRelativeY - gsRenderCenterY);

                    // OK, DONT'T ASK... CONVERSION TO PROPER Y NEEDS THIS...
                    dOffsetX -= CELL_Y_SIZE;

                    FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, &dTempX_S, &dTempY_S);

                    sXPos = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + SHORT_ROUND(dTempX_S);
                    sYPos = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + SHORT_ROUND(dTempY_S);

                    // Adjust for offset position on screen
                    sXPos -= gsRenderWorldOffsetX;
                    sYPos -= gsRenderWorldOffsetY;

                    sYPos -= pNode->sRelativeZ;
                  }
                }

                // COUNT # OF ITEMS AT THIS LOCATION
                if (uiLevelNodeFlags & LEVELNODE_ITEM) {
                  // OK set item pool for this location....
                  if (bItemCount == 0) {
                    pItemPool = pNode->pItemPool;
                  } else {
                    pItemPool = pItemPool->pNext;
                  }

                  if (bItemCount < MAX_RENDERED_ITEMS) {
                    bItemCount++;

                    if (gWorldItems[pItemPool->iItemIndex].bVisible == VISIBLE) {
                      bVisibleItemCount++;
                    }
                  }

                  // LIMIT RENDERING OF ITEMS TO ABOUT 7, DO NOT RENDER HIDDEN ITEMS TOO!
                  if (bVisibleItemCount == MAX_RENDERED_ITEMS || (gWorldItems[pItemPool->iItemIndex].bVisible != VISIBLE) || (pItemPool->usFlags & WORLD_ITEM_DONTRENDER)) {
                    if (!(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
                      // CONTINUE, DONOT RENDER
                      if (!fLinkedListDirection)
                        pNode = pNode->pPrevNode;
                      else
                        pNode = pNode->pNext;
                      continue;
                    }
                  }

                  if (pItemPool->bRenderZHeightAboveLevel > 0) {
                    sYPos -= pItemPool->bRenderZHeightAboveLevel;
                  }
                }

                // If render tile is false...
                if (!fRenderTile) {
                  if (!fLinkedListDirection)
                    pNode = pNode->pPrevNode;
                  else
                    pNode = pNode->pNext;

                  continue;
                }
              }

              // specific code for node types on a per-tile basis
              switch (uiRowFlags) {
                case TILES_STATIC_LAND:

                  LandZLevel(iTempPosX_M, iTempPosY_M);
                  break;

                case TILES_STATIC_OBJECTS:

                  // ATE: Modified to use constant z level, as these are same level as land items
                  ObjectZLevel(TileElem, pNode, iTempPosX_M, iTempPosY_M);
                  break;

                case TILES_STATIC_STRUCTURES:

                  StructZLevel(iTempPosX_M, iTempPosY_M);

                  if (fUseTileElem && (TileElem->uiFlags & MULTI_Z_TILE)) {
                    fMultiZBlitter = TRUE;
                  }

                  // ATE: if we are a wall, set flag
                  if (fUseTileElem && (TileElem->uiFlags & WALL_TILE)) {
                    fWallTile = TRUE;
                  }

                  break;

                case TILES_STATIC_ROOF:

                  RoofZLevel(iTempPosX_M, iTempPosY_M);

                  // Automatically adjust height!
                  sYPos -= WALL_HEIGHT;

                  // ATE: Added for shadows on roofs
                  if (fUseTileElem && (TileElem->uiFlags & ROOFSHADOW_TILE)) {
                    fShadowBlitter = TRUE;
                  }
                  break;
                case TILES_STATIC_ONROOF:

                  OnRoofZLevel(iTempPosX_M, iTempPosY_M);
                  // Automatically adjust height!
                  sYPos -= WALL_HEIGHT;
                  break;

                case TILES_STATIC_TOPMOST:

                  TopmostZLevel(iTempPosX_M, iTempPosY_M);
                  break;

                case TILES_STATIC_SHADOWS:

                  ShadowZLevel(iTempPosX_M, iTempPosY_M);

                  if (uiLevelNodeFlags & LEVELNODE_EXITGRID) {
                    fIntensityBlitter = TRUE;
                    fShadowBlitter = FALSE;
                  }
                  break;

                case TILES_DYNAMIC_LAND:

                  LandZLevel(iTempPosX_M, iTempPosY_M);
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  break;
                case TILES_DYNAMIC_SHADOWS:

                  ShadowZLevel(iTempPosX_M, iTempPosY_M);
                  // sZLevel=SHADOW_Z_LEVEL;
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  break;
                case TILES_DYNAMIC_OBJECTS:

                  ObjectZLevel(TileElem, pNode, iTempPosX_M, iTempPosY_M);
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  break;

                case TILES_DYNAMIC_STRUCTURES:

                  StructZLevel(iTempPosX_M, iTempPosY_M);
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  break;
                case TILES_DYNAMIC_ROOF:

                  sYPos -= WALL_HEIGHT;

                  RoofZLevel(iTempPosX_M, iTempPosY_M);
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  // For now, adjust to hieght of a wall ( 50 temp, make define )
                  // if ( TileElem->fType > FOOTPRINTS )
                  //{
                  //	sYPos -= 58;
                  //}
                  break;

                case TILES_DYNAMIC_ONROOF:

                  OnRoofZLevel(iTempPosX_M, iTempPosY_M);
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  // Automatically adjust height!
                  sYPos -= WALL_HEIGHT;
                  break;

                case TILES_DYNAMIC_TOPMOST:
                  TopmostZLevel(iTempPosX_M, iTempPosY_M);
                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED;
                  break;

                case TILES_DYNAMIC_MERCS:
                case TILES_DYNAMIC_HIGHMERCS:
                case TILES_DYNAMIC_STRUCT_MERCS:

                  // Set flag to set layer as used
                  uiAdditiveLayerUsedFlags |= uiRowFlags;

                  pSoldier = pNode->pSoldier;

                  if (uiRowFlags == TILES_DYNAMIC_MERCS) {
                    // If we are multi-tiled, ignore here
                    if (pSoldier->uiStatusFlags & SOLDIER_MULTITILE_Z) {
                      pNode = pNode->pNext;
                      continue;
                    }

                    // If we are at a higher level, no not do anything unless we are at the highmerc stage
                    if (pSoldier->bLevel > 0) {
                      pNode = pNode->pNext;
                      continue;
                    }
                  }

                  if (uiRowFlags == TILES_DYNAMIC_HIGHMERCS) {
                    // If we are multi-tiled, ignore here
                    if (pSoldier->uiStatusFlags & SOLDIER_MULTITILE_Z) {
                      pNode = pNode->pNext;
                      continue;
                    }

                    // If we are at a lower level, no not do anything unless we are at the highmerc stage
                    if (pSoldier->bLevel == 0) {
                      pNode = pNode->pNext;
                      continue;
                    }
                  }

                  if (uiRowFlags == TILES_DYNAMIC_STRUCT_MERCS) {
                    // If we are not multi-tiled, ignore here
                    if (!(pSoldier->uiStatusFlags & SOLDIER_MULTITILE_Z)) {
                      // If we are at a low level, no not do anything unless we are at the merc stage
                      if (pSoldier->bLevel == 0) {
                        pNode = pNode->pNext;
                        continue;
                      }
                    }

                    if (pSoldier->uiStatusFlags & SOLDIER_MULTITILE_Z) {
                      fSaveZ = TRUE;
                      fMultiTransShadowZBlitter = TRUE;
                      fZBlitter = TRUE;

                      // ATE: Use one direction for queen!
                      if (pSoldier->ubBodyType == QUEENMONSTER) {
                        sMultiTransShadowZBlitterIndex = 0;
                      } else {
                        sMultiTransShadowZBlitterIndex = gOneCDirection[pSoldier->bDirection];
                      }
                    }
                  }

                  // IF we are not active, or are a placeholder for multi-tile animations do nothing
                  // if ( !pSoldier->bActive  )
                  if (!pSoldier->bActive || (uiLevelNodeFlags & LEVELNODE_MERCPLACEHOLDER)) {
                    pNode = pNode->pNext;
                    continue;
                  }

                  // Skip if we cannot see the guy!
                  if (pSoldier->bLastRenderVisibleValue == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
                    pNode = pNode->pNext;
                    continue;
                  }

                  // Get animation surface....
                  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier->usAnimState);

                  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
                    pNode = pNode->pNext;
                    continue;
                  }

                  // Shade guy always lighter than sceane default!
                  {
                    let ubShadeLevel: UINT8;

                    ubShadeLevel = (pNode->ubShadeLevel & 0x0f);
                    ubShadeLevel = __max(ubShadeLevel - 2, DEFAULT_SHADE_LEVEL);
                    ubShadeLevel |= (pNode->ubShadeLevel & 0x30);

                    if (pSoldier->fBeginFade) {
                      pShadeTable = pSoldier->pCurrentShade = pSoldier->pShades[pSoldier->ubFadeLevel];
                    } else {
                      pShadeTable = pSoldier->pCurrentShade = pSoldier->pShades[ubShadeLevel];
                    }
                  }

                  // Position guy based on guy's position
                  dOffsetX = pSoldier->dXPos - gsRenderCenterX;
                  dOffsetY = pSoldier->dYPos - gsRenderCenterY;

                  // Calculate guy's position
                  FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, &dTempX_S, &dTempY_S);

                  sXPos = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
                  sYPos = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S - sTileHeight;

                  // Adjust for offset position on screen
                  sXPos -= gsRenderWorldOffsetX;
                  sYPos -= gsRenderWorldOffsetY;

                  // Adjust for soldier height
                  sYPos -= pSoldier->sHeightAdjustment;

                  // Handle shade stuff....
                  if (!pSoldier->fBeginFade) {
                    // Special effect - draw ghost if is seen by a guy in player's team but not current guy
                    // ATE: Todo: setup flag for 'bad-guy' - can releive some checks in renderer
                    if (!pSoldier->bNeutral && (pSoldier->bSide != gbPlayerNum)) {
                      if (gusSelectedSoldier != NOBODY) {
                        pSelSoldier = MercPtrs[gusSelectedSoldier];
                      } else {
                        pSelSoldier = NULL;
                      }

                      bGlowShadeOffset = 0;

                      if (gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
                        // Shade differently depending on visiblity
                        if (pSoldier->bLastRenderVisibleValue == 0) {
                          bGlowShadeOffset = 10;
                        }

                        if (pSelSoldier != NULL) {
                          if (pSelSoldier->bOppList[pSoldier->ubID] != SEEN_CURRENTLY) {
                            if (pSoldier->usAnimState != CHARIOTS_OF_FIRE && pSoldier->usAnimState != BODYEXPLODING) {
                              bGlowShadeOffset = 10;
                            }
                          }
                        }
                      }

                      if (pSoldier->bLevel == 0) {
                        pShadeStart = &(pSoldier->pGlowShades[0]);
                      } else {
                        pShadeStart = &(pSoldier->pShades[20]);
                      }

                      // Set shade
                      // If a bad guy is highlighted
                      if (gfUIHandleSelectionAboveGuy == TRUE && MercPtrs[gsSelectedGuy]->bSide != gbPlayerNum) {
                        if (gsSelectedGuy == pSoldier->ubID) {
                          pShadeTable = pShadeStart[gsGlowFrames[gsCurrentGlowFrame] + bGlowShadeOffset];
                          gsForceSoldierZLevel = TOPMOST_Z_LEVEL;
                        } else {
                          // Are we dealing with a not-so visible merc?
                          if (bGlowShadeOffset == 10) {
                            pShadeTable = pSoldier->pEffectShades[0];
                          }
                        }
                      } else {
                        // OK,not highlighted, but maybe we are in enemy's turn and they have the baton

                        // AI's turn?
                        if (gTacticalStatus.ubCurrentTeam != OUR_TEAM) {
                          // Does he have baton?
                          if ((pSoldier->uiStatusFlags & SOLDIER_UNDERAICONTROL)) {
                            pShadeTable = pShadeStart[gpGlowFramePointer[gsCurrentGlowFrame] + bGlowShadeOffset];

                            if (gpGlowFramePointer[gsCurrentGlowFrame] >= 7) {
                              gsForceSoldierZLevel = TOPMOST_Z_LEVEL;
                            }
                          }
                        } else {
                          pShadeTable = pShadeStart[gpGlowFramePointer[gsCurrentGlowFrame] + bGlowShadeOffset];

                          if (gpGlowFramePointer[gsCurrentGlowFrame] >= 7) {
                            gsForceSoldierZLevel = TOPMOST_Z_LEVEL;
                          }
                        }
                      }

                      // if ( gusSelectedSoldier != NOBODY )
                      //{
                      //	pSelSoldier = MercPtrs[ gusSelectedSoldier ];

                      // Shade differently depending on visiblity
                      //	if ( pSoldier->bVisible == 0 || ( pSelSoldier->bOppList[ pSoldier->ubID ] == 0  ) )
                      //	{
                      // Shade gray
                      //		pShadeTable = pSoldier->pGlowShades[ gpGlowFramePointer[ gsCurrentGlowFrame ] + 10 ];
                      //	}
                      //}
                    }
                  }

                  // Calculate Z level
                  SoldierZLevel(pSoldier, iTempPosX_M, iTempPosY_M);

                  if (!(uiFlags & TILES_DIRTY)) {
                    if (pSoldier->fForceShade) {
                      pShadeTable = pSoldier->pForcedShade;
                    }
                  }

                  // check if we are a merc duplicate, if so, only do minimal stuff!
                  if (pSoldier->ubID >= MAX_NUM_SOLDIERS) {
                    // Shade gray
                    pShadeTable = pSoldier->pEffectShades[1];
                  }

                  hVObject = gAnimSurfaceDatabase[usAnimSurface].hVideoObject;

                  if (hVObject == NULL) {
                    pNode = pNode->pNext;
                    continue;
                  }

                  // ATE: If we are in a gridno that we should not use obscure blitter, set!
                  if (!(gpWorldLevelData[uiTileIndex].ubExtFlags[0] & MAPELEMENT_EXT_NOBURN_STRUCT)) {
                    fObscuredBlitter = TRUE;
                  } else {
                    // ATE: Artificially increase z=level...
                    sZLevel += 2;
                  }

                  usImageIndex = pSoldier->usAniFrame;

                  uiDirtyFlags = BGND_FLAG_SINGLE | BGND_FLAG_ANIMATED | BGND_FLAG_MERC;
                  break;
              }

              // Adjust for interface level
              sYPos += gsRenderHeight;

              // OK, check for LEVELNODE HIDDEN...
              fHiddenTile = FALSE;

              if (uiLevelNodeFlags & LEVELNODE_HIDDEN) {
                fHiddenTile = TRUE;

                if (TileElem != NULL) {
                  // If we are a roof and have SHOW_ALL_ROOFS on, turn off hidden tile check!
                  if ((TileElem->uiFlags & ROOF_TILE) && (gTacticalStatus.uiFlags & SHOW_ALL_ROOFS)) {
                    // Turn off
                    fHiddenTile = FALSE;
                  }
                }
              }

              if (fRenderTile && !fHiddenTile) {
                fTileInvisible = FALSE;

                if ((uiLevelNodeFlags & LEVELNODE_ROTTINGCORPSE)) {
                  // Set fmerc flag!
                  fMerc = TRUE;
                  fZWrite = TRUE;

                  // if ( hVObject->ppZStripInfo != NULL )
                  {
                    sMultiTransShadowZBlitterIndex = GetCorpseStructIndex(&(pCorpse->def), TRUE);
                    fMultiTransShadowZBlitter = TRUE;
                  }
                }

                if ((uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC) && !(uiFlags & TILES_DIRTY)) {
                  // Remove flags!
                  pNode->uiFlags &= (~LEVELNODE_LASTDYNAMIC);
                  fZWrite = TRUE;
                }

                if (uiLevelNodeFlags & LEVELNODE_NOWRITEZ) {
                  fZWrite = FALSE;
                }

                if (uiFlags & TILES_NOZWRITE)
                  fZWrite = FALSE;

                if (uiFlags & TILES_NOZ) {
                  fZBlitter = FALSE;
                }

                if ((uiLevelNodeFlags & LEVELNODE_WIREFRAME)) {
                  if (!gGameSettings.fOptions[TOPTION_TOGGLE_WIREFRAME]) {
                    fTileInvisible = TRUE;
                  }
                }

                // RENDER
                if (fTileInvisible) {
                } else if (uiLevelNodeFlags & LEVELNODE_DISPLAY_AP && !(uiFlags & TILES_DIRTY)) {
                  pTrav = &(hVObject->pETRLEObject[usImageIndex]);
                  sXPos += pTrav->sOffsetX;
                  sYPos += pTrav->sOffsetY;

                  if (gfUIDisplayActionPointsInvalid) {
                    SetFontBackground(FONT_MCOLOR_BLACK);
                    SetFontForeground(FONT_MCOLOR_WHITE);
                  } else {
                    SetFontBackground(FONT_MCOLOR_BLACK);
                    SetFontForeground(FONT_MCOLOR_WHITE);
                  }

                  if (gfUIDisplayActionPointsBlack) {
                    SetFontBackground(FONT_MCOLOR_BLACK);
                    SetFontForeground(FONT_MCOLOR_BLACK);
                  }

                  SetFont(TINYFONT1);
                  SetFontDestBuffer(guiSAVEBUFFER, 0, gsVIEWPORT_WINDOW_START_Y, 640, gsVIEWPORT_WINDOW_END_Y, FALSE);
                  VarFindFontCenterCoordinates(sXPos, sYPos, 1, 1, TINYFONT1, &sX, &sY, L"%d", pNode->uiAPCost);
                  mprintf_buffer(pDestBuf, uiDestPitchBYTES, TINYFONT1, sX, sY, L"%d", pNode->uiAPCost);
                  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);
                } else if ((uiLevelNodeFlags & LEVELNODE_ERASEZ) && !(uiFlags & TILES_DIRTY)) {
                  Zero8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex);
                  // Zero8BPPDataTo16BPPBufferTransparent( (UINT16*)gpZBuffer, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex );
                } else if ((uiLevelNodeFlags & LEVELNODE_ITEM) && !(uiFlags & TILES_DIRTY)) {
                  let fZBlit: BOOLEAN = FALSE;

                  if (uiRowFlags == TILES_STATIC_ONROOF || uiRowFlags == TILES_DYNAMIC_ONROOF) {
                    usOutlineColor = gusYellowItemOutlineColor;
                    bItemOutline = TRUE;
                    fZBlit = TRUE;
                  } else {
                    usOutlineColor = gusNormalItemOutlineColor;
                    bItemOutline = TRUE;
                    fZBlit = TRUE;
                  }

                  if (gGameSettings.fOptions[TOPTION_GLOW_ITEMS]) {
                    if (uiRowFlags == TILES_STATIC_ONROOF || uiRowFlags == TILES_DYNAMIC_ONROOF) {
                      usOutlineColor = us16BPPItemCycleYellowColors[gsCurrentItemGlowFrame];
                      bItemOutline = TRUE;
                    } else {
                      if (gTacticalStatus.uiFlags & RED_ITEM_GLOW_ON) {
                        usOutlineColor = us16BPPItemCycleRedColors[gsCurrentItemGlowFrame];
                        bItemOutline = TRUE;
                      } else {
                        usOutlineColor = us16BPPItemCycleWhiteColors[gsCurrentItemGlowFrame];
                        bItemOutline = TRUE;
                      }
                    }
                  }

                  // else
                  //{
                  //	usOutlineColor = us16BPPItemCycleWhiteColors[ pItemPool->bFlashColor ];
                  //	bItemOutline = TRUE;
                  //}

                  bBlitClipVal = BltIsClippedOrOffScreen(hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);

                  if (bBlitClipVal == FALSE) {
                    if (fZBlit) {
                      if (fObscuredBlitter) {
                        Blt8BPPDataTo16BPPBufferOutlineZPixelateObscured(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline);
                      } else {
                        Blt8BPPDataTo16BPPBufferOutlineZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline);
                      }
                    } else {
                      Blt8BPPDataTo16BPPBufferOutline(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline);
                    }
                  } else if (bBlitClipVal == TRUE) {
                    if (fZBlit) {
                      if (fObscuredBlitter) {
                        Blt8BPPDataTo16BPPBufferOutlineZPixelateObscuredClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline, &gClippingRect);
                      } else {
                        Blt8BPPDataTo16BPPBufferOutlineZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline, &gClippingRect);
                      }
                    } else {
                      Blt8BPPDataTo16BPPBufferOutlineClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline, &gClippingRect);
                    }
                  }
                }
                // ATE: Check here for a lot of conditions!
                else if (((uiLevelNodeFlags & LEVELNODE_PHYSICSOBJECT)) && !(uiFlags & TILES_DIRTY)) {
                  bItemOutline = TRUE;

                  if (uiLevelNodeFlags & LEVELNODE_PHYSICSOBJECT) {
                    bItemOutline = FALSE;
                  }

                  bBlitClipVal = BltIsClippedOrOffScreen(hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);

                  if (fShadowBlitter) {
                    if (bBlitClipVal == FALSE) {
                      Blt8BPPDataTo16BPPBufferShadowZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                    } else {
                      Blt8BPPDataTo16BPPBufferShadowZNBClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                    }
                  } else {
                    if (bBlitClipVal == FALSE) {
                      Blt8BPPDataTo16BPPBufferOutlineZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline);
                    } else if (bBlitClipVal == TRUE) {
                      Blt8BPPDataTo16BPPBufferOutlineClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, usOutlineColor, bItemOutline, &gClippingRect);
                    }
                  }
                } else if (uiFlags & TILES_DIRTY) {
                  if (!(uiLevelNodeFlags & LEVELNODE_LASTDYNAMIC)) {
                    pTrav = &(hVObject->pETRLEObject[usImageIndex]);
                    uiBrushHeight = pTrav->usHeight;
                    uiBrushWidth = pTrav->usWidth;
                    sXPos += pTrav->sOffsetX;
                    sYPos += pTrav->sOffsetY;

                    RegisterBackgroundRect(uiDirtyFlags, NULL, sXPos, sYPos, (sXPos + uiBrushWidth), (__min((sYPos + uiBrushHeight), gsVIEWPORT_WINDOW_END_Y)));

                    if (fSaveZ) {
                      RegisterBackgroundRect(uiDirtyFlags | BGND_FLAG_SAVE_Z, NULL, sXPos, sYPos, (sXPos + uiBrushWidth), (__min((sYPos + uiBrushHeight), gsVIEWPORT_WINDOW_END_Y)));
                    }
                  }
                } else {
                  if (gbPixelDepth == 16) {
                    /*if(fConvertTo16)
                    {
                            ConvertVObjectRegionTo16BPP(hVObject, usImageIndex, 4);
                            if(CheckFor16BPPRegion(hVObject, usImageIndex, 4, &us16BPPIndex))
                            {
                                    Blt16BPPDataTo16BPPBufferTransparentClip((UINT16*)pDestBuf, uiDestPitchBYTES,  hVObject, sXPos, sYPos, us16BPPIndex, &gClippingRect);
                            }
                    }*/

                    if (fMultiTransShadowZBlitter) {
                      if (fZBlitter) {
                        if (fObscuredBlitter) {
                          Blt8BPPDataTo16BPPBufferTransZTransShadowIncObscureClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, sMultiTransShadowZBlitterIndex, pShadeTable);
                        } else {
                          Blt8BPPDataTo16BPPBufferTransZTransShadowIncClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, sMultiTransShadowZBlitterIndex, pShadeTable);
                        }
                      } else {
                        // Blt8BPPDataTo16BPPBufferTransparentClip((UINT16*)pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect );
                      }
                    } else if (fMultiZBlitter) {
                      if (fZBlitter) {
                        if (fObscuredBlitter) {
                          Blt8BPPDataTo16BPPBufferTransZIncObscureClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                        } else {
                          if (fWallTile) {
                            Blt8BPPDataTo16BPPBufferTransZIncClipZSameZBurnsThrough(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          } else {
                            Blt8BPPDataTo16BPPBufferTransZIncClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          }
                        }
                      } else {
                        Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                      }
                    } else {
                      bBlitClipVal = BltIsClippedOrOffScreen(hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);

                      if (bBlitClipVal == TRUE) {
                        if (fPixelate) {
                          if (fTranslucencyType) {
                            // if(fZWrite)
                            //	Blt8BPPDataTo16BPPBufferTransZClipTranslucent((UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                            // else
                            Blt8BPPDataTo16BPPBufferTransZNBClipTranslucent(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          } else {
                            // if(fZWrite)
                            //	Blt8BPPDataTo16BPPBufferTransZClipPixelate((UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                            // else
                            Blt8BPPDataTo16BPPBufferTransZNBClipPixelate(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          }
                        } else if (fMerc) {
                          if (fZBlitter) {
                            if (fZWrite) {
                              Blt8BPPDataTo16BPPBufferTransShadowZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, pShadeTable);
                            } else {
                              if (fObscuredBlitter) {
                                Blt8BPPDataTo16BPPBufferTransShadowZNBObscuredClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, pShadeTable);
                              } else {
                                Blt8BPPDataTo16BPPBufferTransShadowZNBClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, pShadeTable);
                              }
                            }

                            if ((uiLevelNodeFlags & LEVELNODE_UPDATESAVEBUFFERONCE)) {
                              pSaveBuf = LockVideoSurface(guiSAVEBUFFER, &uiSaveBufferPitchBYTES);

                              // BLIT HERE
                              Blt8BPPDataTo16BPPBufferTransShadowClip(pSaveBuf, uiSaveBufferPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, pShadeTable);

                              UnLockVideoSurface(guiSAVEBUFFER);

                              // Turn it off!
                              pNode->uiFlags &= (~LEVELNODE_UPDATESAVEBUFFERONCE);
                            }
                          } else {
                            Blt8BPPDataTo16BPPBufferTransShadowClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, pShadeTable);
                          }
                        } else if (fShadowBlitter) {
                          if (fZBlitter) {
                            if (fZWrite)
                              Blt8BPPDataTo16BPPBufferShadowZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                            else
                              Blt8BPPDataTo16BPPBufferShadowZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          } else {
                            Blt8BPPDataTo16BPPBufferShadowClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          }
                        } else if (fIntensityBlitter) {
                          if (fZBlitter) {
                            if (fZWrite)
                              Blt8BPPDataTo16BPPBufferIntensityZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                            else
                              Blt8BPPDataTo16BPPBufferIntensityZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          } else {
                            Blt8BPPDataTo16BPPBufferIntensityClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          }
                        } else if (fZBlitter) {
                          if (fZWrite) {
                            if (fObscuredBlitter) {
                              Blt8BPPDataTo16BPPBufferTransZClipPixelateObscured(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                            } else {
                              Blt8BPPDataTo16BPPBufferTransZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                            }
                          } else {
                            Blt8BPPDataTo16BPPBufferTransZNBClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                          }

                          if ((uiLevelNodeFlags & LEVELNODE_UPDATESAVEBUFFERONCE)) {
                            pSaveBuf = LockVideoSurface(guiSAVEBUFFER, &uiSaveBufferPitchBYTES);

                            // BLIT HERE
                            Blt8BPPDataTo16BPPBufferTransZClip(pSaveBuf, uiSaveBufferPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);

                            UnLockVideoSurface(guiSAVEBUFFER);

                            // Turn it off!
                            pNode->uiFlags &= (~LEVELNODE_UPDATESAVEBUFFERONCE);
                          }
                        } else
                          Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                      } else if (bBlitClipVal == FALSE) {
                        if (fPixelate) {
                          if (fTranslucencyType) {
                            if (fZWrite)
                              Blt8BPPDataTo16BPPBufferTransZTranslucent(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                            else
                              Blt8BPPDataTo16BPPBufferTransZNBTranslucent(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                          } else {
                            if (fZWrite)
                              Blt8BPPDataTo16BPPBufferTransZPixelate(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                            else
                              Blt8BPPDataTo16BPPBufferTransZNBPixelate(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                          }
                        } else if (fMerc) {
                          if (fZBlitter) {
                            if (fZWrite) {
                              Blt8BPPDataTo16BPPBufferTransShadowZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, pShadeTable);
                            } else {
                              if (fObscuredBlitter) {
                                Blt8BPPDataTo16BPPBufferTransShadowZNBObscured(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, pShadeTable);
                              } else {
                                Blt8BPPDataTo16BPPBufferTransShadowZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, pShadeTable);
                              }
                            }

                            if ((uiLevelNodeFlags & LEVELNODE_UPDATESAVEBUFFERONCE)) {
                              pSaveBuf = LockVideoSurface(guiSAVEBUFFER, &uiSaveBufferPitchBYTES);

                              // BLIT HERE
                              Blt8BPPDataTo16BPPBufferTransShadow(pSaveBuf, uiSaveBufferPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, pShadeTable);

                              UnLockVideoSurface(guiSAVEBUFFER);

                              // Turn it off!
                              pNode->uiFlags &= (~LEVELNODE_UPDATESAVEBUFFERONCE);
                            }
                          } else {
                            Blt8BPPDataTo16BPPBufferTransShadow(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, pShadeTable);
                          }
                        } else if (fShadowBlitter) {
                          if (fZBlitter) {
                            if (fZWrite)
                              Blt8BPPDataTo16BPPBufferShadowZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                            else
                              Blt8BPPDataTo16BPPBufferShadowZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                          } else {
                            Blt8BPPDataTo16BPPBufferShadow(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex);
                          }
                        } else if (fIntensityBlitter) {
                          if (fZBlitter) {
                            if (fZWrite)
                              Blt8BPPDataTo16BPPBufferIntensityZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                            else
                              Blt8BPPDataTo16BPPBufferIntensityZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                          } else {
                            Blt8BPPDataTo16BPPBufferIntensity(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex);
                          }
                        } else if (fZBlitter) {
                          if (fZWrite) {
                            // TEST
                            // Blt8BPPDataTo16BPPBufferTransZPixelate( (UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);

                            if (fObscuredBlitter) {
                              Blt8BPPDataTo16BPPBufferTransZPixelateObscured(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                            } else {
                              Blt8BPPDataTo16BPPBufferTransZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                            }
                          } else
                            Blt8BPPDataTo16BPPBufferTransZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);

                          if ((uiLevelNodeFlags & LEVELNODE_UPDATESAVEBUFFERONCE)) {
                            pSaveBuf = LockVideoSurface(guiSAVEBUFFER, &uiSaveBufferPitchBYTES);

                            // BLIT HERE
                            Blt8BPPDataTo16BPPBufferTransZ(pSaveBuf, uiSaveBufferPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);

                            UnLockVideoSurface(guiSAVEBUFFER);

                            // Turn it off!
                            pNode->uiFlags &= (~LEVELNODE_UPDATESAVEBUFFERONCE);
                          }
                        } else
                          Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex);
                      }
                    }
                  } else // 8bpp section
                  {
                    if (fPixelate) {
                      if (fZWrite)
                        Blt8BPPDataTo8BPPBufferTransZClipPixelate(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                      else
                        Blt8BPPDataTo8BPPBufferTransZNBClipPixelate(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                    } else if (BltIsClipped(hVObject, sXPos, sYPos, usImageIndex, &gClippingRect)) {
                      if (fMerc) {
                        Blt8BPPDataTo8BPPBufferTransShadowZNBClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect, pShadeTable);
                      } else if (fShadowBlitter)
                        if (fZWrite)
                          Blt8BPPDataTo8BPPBufferShadowZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                        else
                          Blt8BPPDataTo8BPPBufferShadowZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);

                      else if (fZBlitter) {
                        if (fZWrite)
                          Blt8BPPDataTo8BPPBufferTransZClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                        else
                          Blt8BPPDataTo8BPPBufferTransZNBClip(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                      } else
                        Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex, &gClippingRect);
                    } else {
                      if (fMerc) {
                        Blt8BPPDataTo16BPPBufferTransShadowZNBObscured(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex, pShadeTable);

                        //	Blt8BPPDataTo8BPPBufferTransShadowZNB( (UINT16*)pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel,
                        //																							hVObject,
                        //																							sXPos, sYPos,
                        //																							usImageIndex,
                        //																							pShadeTable);
                      } else if (fShadowBlitter) {
                        if (fZWrite)
                          Blt8BPPDataTo8BPPBufferShadowZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                        else
                          Blt8BPPDataTo8BPPBufferShadowZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                      } else if (fZBlitter) {
                        if (fZWrite)
                          Blt8BPPDataTo8BPPBufferTransZ(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                        else
                          Blt8BPPDataTo8BPPBufferTransZNB(pDestBuf, uiDestPitchBYTES, gpZBuffer, sZLevel, hVObject, sXPos, sYPos, usImageIndex);
                      } else
                        Blt8BPPDataTo8BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sXPos, sYPos, usImageIndex);
                    }
                  }
                }

                // RENDR APS ONTOP OF PLANNED MERC GUY
                if (fRenderTile && !(uiFlags & TILES_DIRTY)) {
                  if (fMerc) {
                    if (pSoldier != NULL && pSoldier->ubID >= MAX_NUM_SOLDIERS) {
                      SetFont(TINYFONT1);
                      SetFontDestBuffer(guiSAVEBUFFER, 0, gsVIEWPORT_WINDOW_START_Y, 640, gsVIEWPORT_WINDOW_END_Y, FALSE);
                      VarFindFontCenterCoordinates(sXPos, sYPos, 1, 1, TINYFONT1, &sX, &sY, L"%d", pSoldier->ubPlannedUIAPCost);
                      mprintf_buffer(pDestBuf, uiDestPitchBYTES, TINYFONT1, sX, sY, L"%d", pSoldier->ubPlannedUIAPCost);
                      SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);
                    }
                  }
                }
              }

              if (!fLinkedListDirection)
                pNode = pNode->pPrevNode;
              else
                pNode = pNode->pNext;

              // pNode = NULL;
            }
          } else {
            if (gfEditMode) {
              // ATE: Used here in the editor to denote then an area is not in the world

              // Kris:  Fixed a couple things here...
              //  First, there was a problem with the FRAME_BUFFER already being locked which caused failures,
              //	and eventual crashes, so if it reaches this code, the buffer needs to be unlocked first, as
              //  it gets locked and unlocked internally within ColorFillVideoSurfaceArea().  I'm surprised
              //	this problem didn't surface a long time ago.  Anyway, it seems that scrolling to the bottom
              //	right hand corner of the map, would cause the end of the world to be drawn.  Now, this would
              //	only crash on my computer and not Emmons, so this should work.  Also, I changed the color
              //	from fluorescent green to black, which is easier on the eyes, and prevent the drawing of the
              //	end of the world if it would be drawn on the editor's taskbar.
              if (iTempPosY_S < 360) {
                if (!(uiFlags & TILES_DIRTY))
                  UnLockVideoSurface(FRAME_BUFFER);
                ColorFillVideoSurfaceArea(FRAME_BUFFER, iTempPosX_S, iTempPosY_S, (iTempPosX_S + 40), (min(iTempPosY_S + 20, 360)), Get16BPPColor(FROMRGB(0, 0, 0)));
                if (!(uiFlags & TILES_DIRTY))
                  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
              }
            }
          }

          iTempPosX_S += 40;
          iTempPosX_M++;
          iTempPosY_M--;

          if (iTempPosX_S >= iEndXS) {
            fEndRenderRow = TRUE;
          }
        } while (!fEndRenderRow);
      }
    }
    //	} while( FALSE );

    if (bXOddFlag > 0) {
      iAnchorPosY_M++;
    } else {
      iAnchorPosX_M++;
    }

    bXOddFlag = !bXOddFlag;
    iAnchorPosY_S += 10;

    if (iAnchorPosY_S >= iEndYS) {
      fEndRenderCol = TRUE;
    }
  } while (!fEndRenderCol);

  if (!(uiFlags & TILES_DIRTY))
    UnLockVideoSurface(FRAME_BUFFER);

  if (uiFlags & TILES_DYNAMIC_CHECKFOR_INT_TILE) {
    EndCurInteractiveTileCheck();
  }
}

function DeleteFromWorld(usTileIndex: UINT16, uiRenderTiles: UINT32, usIndex: UINT16): void {
  switch (uiRenderTiles) {
    case TILES_DYNAMIC_LAND:
    case TILES_STATIC_LAND:
      RemoveLand(usTileIndex, usIndex);
      break;
    case TILES_DYNAMIC_OBJECTS:
    case TILES_STATIC_OBJECTS:
      RemoveObject(usTileIndex, usIndex);
      break;
    case TILES_STATIC_STRUCTURES:
    case TILES_DYNAMIC_STRUCTURES:
      RemoveStruct(usTileIndex, usIndex);
      break;
    case TILES_DYNAMIC_ROOF:
    case TILES_STATIC_ROOF:
      RemoveRoof(usTileIndex, usIndex);
      break;
    case TILES_STATIC_ONROOF:
      RemoveOnRoof(usTileIndex, usIndex);
      break;

    case TILES_DYNAMIC_TOPMOST:
    case TILES_STATIC_TOPMOST:
      RemoveTopmost(usTileIndex, usIndex);
      break;
  }
}

// memcpy's the background to the new scroll position, and renders the missing strip
// via the RenderStaticWorldRect. Dynamic stuff will be updated on the next frame
// by the normal render cycle
function ScrollBackground(uiDirection: UINT32, sScrollXIncrement: INT16, sScrollYIncrement: INT16): void {
  // RestoreBackgroundRects();

  if (!gfDoVideoScroll) {
    // Clear z-buffer
    memset(gpZBuffer, LAND_Z_LEVEL, 1280 * gsVIEWPORT_END_Y);

    RenderStaticWorldRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y, FALSE);

    FreeBackgroundRectType(BGND_FLAG_ANIMATED);
  } else {
    if (gfRenderScroll == FALSE) {
      guiScrollDirection = uiDirection;
      gfScrollStart = TRUE;
      gsScrollXIncrement = 0;
      gsScrollYIncrement = 0;
    } else {
      guiScrollDirection |= uiDirection;
      gfScrollStart = FALSE;
    }

    gfRenderScroll = TRUE;
    gsScrollXIncrement += sScrollXIncrement;
    gsScrollYIncrement += sScrollYIncrement;
  }
}

// Render routine takes center X, Y and Z coordinate and gets world
// Coordinates for the window from that using the following functions
// For coordinate transformations

function RenderWorld(): void {
  let TileElem: Pointer<TILE_ELEMENT>;
  let pAnimData: Pointer<TILE_ANIMATION_DATA>;
  let cnt: UINT32 = 0;

  gfRenderFullThisFrame = FALSE;

  // If we are testing renderer, set background to pink!
  if (gTacticalStatus.uiFlags & DEBUGCLIFFS) {
    ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, gsVIEWPORT_WINDOW_START_Y, 640, gsVIEWPORT_WINDOW_END_Y, Get16BPPColor(FROMRGB(0, 255, 0)));
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  if (gTacticalStatus.uiFlags & SHOW_Z_BUFFER) {
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  //	SetRenderFlags(RENDER_FLAG_FULL);

  // FOR NOW< HERE, UPDATE ANIMATED TILES
  if (COUNTERDONE(ANIMATETILES)) {
    RESETCOUNTER(ANIMATETILES);

    while (cnt < gusNumAnimatedTiles) {
      TileElem = &(gTileDatabase[gusAnimatedTiles[cnt]]);

      pAnimData = TileElem->pAnimData;

      Assert(pAnimData != NULL);

      pAnimData->bCurrentFrame++;

      if (pAnimData->bCurrentFrame >= pAnimData->ubNumFrames)
        pAnimData->bCurrentFrame = 0;
      cnt++;
    }
  }

  // HERE, UPDATE GLOW INDEX
  if (COUNTERDONE(GLOW_ENEMYS)) {
    RESETCOUNTER(GLOW_ENEMYS);

    gsCurrentGlowFrame++;

    if (gsCurrentGlowFrame == NUM_GLOW_FRAMES) {
      gsCurrentGlowFrame = 0;
    }

    gsCurrentItemGlowFrame++;

    if (gsCurrentItemGlowFrame == NUM_ITEM_CYCLE_COLORS) {
      gsCurrentItemGlowFrame = 0;
    }
  }

  // RenderStaticWorldRect( gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
  // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
  // return;

  //#if 0

  if (gRenderFlags & RENDER_FLAG_FULL) {
    gfRenderFullThisFrame = TRUE;

    gfTopMessageDirty = TRUE;

    // Dirty the interface...
    fInterfacePanelDirty = DIRTYLEVEL2;

    // Apply scrolling sets some world variables
    ApplyScrolling(gsRenderCenterX, gsRenderCenterY, TRUE, FALSE);
    ResetLayerOptimizing();

    if ((gRenderFlags & RENDER_FLAG_NOZ)) {
      RenderStaticWorldRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y, FALSE);
    } else {
      RenderStaticWorld();
    }

    if (!(gRenderFlags & RENDER_FLAG_SAVEOFF))
      UpdateSaveBuffer();
  } else if (gRenderFlags & RENDER_FLAG_MARKED) {
    ResetLayerOptimizing();
    RenderMarkedWorld();
    if (!(gRenderFlags & RENDER_FLAG_SAVEOFF))
      UpdateSaveBuffer();
  }

  if (gfScrollInertia == FALSE || (gRenderFlags & RENDER_FLAG_NOZ) || (gRenderFlags & RENDER_FLAG_FULL) || (gRenderFlags & RENDER_FLAG_MARKED)) {
    RenderDynamicWorld();
  }

  if (gfScrollInertia) {
    EmptyBackgroundRects();
  }

  if (gRenderFlags & RENDER_FLAG_ROOMIDS) {
    RenderRoomInfo(gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS);
  }

  //#endif

  // RenderStaticWorldRect( gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
  // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );

  if (gRenderFlags & RENDER_FLAG_MARKED)
    ClearMarkedTiles();

  if (gRenderFlags & RENDER_FLAG_CHECKZ && !(gTacticalStatus.uiFlags & NOHIDE_REDUNDENCY)) {
    ExamineZBufferRect(gsVIEWPORT_START_X, gsVIEWPORT_WINDOW_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);
  }

  gRenderFlags &= (~(RENDER_FLAG_FULL | RENDER_FLAG_MARKED | RENDER_FLAG_ROOMIDS | RENDER_FLAG_CHECKZ));

  if (gTacticalStatus.uiFlags & SHOW_Z_BUFFER) {
    // COPY Z BUFFER TO FRAME BUFFER
    let uiDestPitchBYTES: UINT32;
    let pDestBuf: Pointer<UINT16>;
    let cnt: UINT32;
    let zVal: INT16;

    pDestBuf = LockVideoSurface(guiRENDERBUFFER, &uiDestPitchBYTES);

    for (cnt = 0; cnt < (640 * 480); cnt++) {
      // Get Z value
      zVal = gpZBuffer[cnt];
      pDestBuf[cnt] = zVal;
    }

    UnLockVideoSurface(guiRENDERBUFFER);
  }
}

// Start with a center X,Y,Z world coordinate and render direction
// Determine WorldIntersectionPoint and the starting block from these
// Then render away!
function RenderStaticWorldRect(sLeft: INT16, sTop: INT16, sRight: INT16, sBottom: INT16, fDynamicsToo: BOOLEAN): void {
  let uiLevelFlags: UINT32[] /* [10] */;
  let sLevelIDs: UINT16[] /* [10] */;

  // Calculate render starting parameters
  CalcRenderParameters(sLeft, sTop, sRight, sBottom);

  // Reset layer optimizations
  ResetLayerOptimizing();

  // STATICS
  uiLevelFlags[0] = TILES_STATIC_LAND;
  // uiLevelFlags[1] = TILES_STATIC_OBJECTS;
  sLevelIDs[0] = RENDER_STATIC_LAND;
  // sLevelIDs[1]		= RENDER_STATIC_OBJECTS;
  RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 1, uiLevelFlags, sLevelIDs);

  //#if 0

  uiLevelFlags[0] = TILES_STATIC_OBJECTS;
  sLevelIDs[0] = RENDER_STATIC_OBJECTS;
  RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 1, uiLevelFlags, sLevelIDs);

  if (gRenderFlags & RENDER_FLAG_SHADOWS) {
    uiLevelFlags[0] = TILES_STATIC_SHADOWS;
    sLevelIDs[0] = RENDER_STATIC_SHADOWS;
    RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 1, uiLevelFlags, sLevelIDs);
  }

  uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
  uiLevelFlags[1] = TILES_STATIC_ROOF;
  uiLevelFlags[2] = TILES_STATIC_ONROOF;
  uiLevelFlags[3] = TILES_STATIC_TOPMOST;

  sLevelIDs[0] = RENDER_STATIC_STRUCTS;
  sLevelIDs[1] = RENDER_STATIC_ROOF;
  sLevelIDs[2] = RENDER_STATIC_ONROOF;
  sLevelIDs[3] = RENDER_STATIC_TOPMOST;

  RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 4, uiLevelFlags, sLevelIDs);

  // ATE: Do obsucred layer!
  uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
  sLevelIDs[0] = RENDER_STATIC_STRUCTS;
  uiLevelFlags[1] = TILES_STATIC_ONROOF;
  sLevelIDs[1] = RENDER_STATIC_ONROOF;
  RenderTiles(TILES_OBSCURED, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 2, uiLevelFlags, sLevelIDs);

  // uiLevelFlags[0] = TILES_DYNAMIC_MERCS;
  // uiLevelFlags[1] = TILES_DYNAMIC_HIGHMERCS;

  // sLevelIDs[0]    = RENDER_DYNAMIC_MERCS;
  // sLevelIDs[1]		= RENDER_DYNAMIC_HIGHMERCS;
  // RenderTiles( 0, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs );

  if (fDynamicsToo) {
    // DYNAMICS
    uiLevelFlags[0] = TILES_DYNAMIC_LAND;
    uiLevelFlags[1] = TILES_DYNAMIC_OBJECTS;
    uiLevelFlags[2] = TILES_DYNAMIC_SHADOWS;
    uiLevelFlags[3] = TILES_DYNAMIC_STRUCT_MERCS;
    uiLevelFlags[4] = TILES_DYNAMIC_MERCS;
    uiLevelFlags[5] = TILES_DYNAMIC_STRUCTURES;
    uiLevelFlags[6] = TILES_DYNAMIC_ROOF;
    uiLevelFlags[7] = TILES_DYNAMIC_HIGHMERCS;
    uiLevelFlags[8] = TILES_DYNAMIC_ONROOF;

    sLevelIDs[0] = RENDER_DYNAMIC_LAND;
    sLevelIDs[1] = RENDER_DYNAMIC_OBJECTS;
    sLevelIDs[2] = RENDER_DYNAMIC_SHADOWS;
    sLevelIDs[3] = RENDER_DYNAMIC_STRUCT_MERCS;
    sLevelIDs[4] = RENDER_DYNAMIC_MERCS;
    sLevelIDs[5] = RENDER_DYNAMIC_STRUCTS;
    sLevelIDs[6] = RENDER_DYNAMIC_ROOF;
    sLevelIDs[7] = RENDER_DYNAMIC_HIGHMERCS;
    sLevelIDs[8] = RENDER_DYNAMIC_ONROOF;
    RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 9, uiLevelFlags, sLevelIDs);

    SumAddiviveLayerOptimization();
  }

  ResetRenderParameters();

  if (!gfDoVideoScroll) {
    // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_WINDOW_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y );
    AddBaseDirtyRect(sLeft, sTop, sRight, sBottom);
  }

  //#endif
}

function RenderStaticWorld(): void {
  let uiLevelFlags: UINT32[] /* [9] */;
  let sLevelIDs: UINT16[] /* [9] */;

  // Calculate render starting parameters
  CalcRenderParameters(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y);

  // Clear z-buffer
  memset(gpZBuffer, LAND_Z_LEVEL, 1280 * gsVIEWPORT_END_Y);

  FreeBackgroundRectType(BGND_FLAG_ANIMATED);
  InvalidateBackgroundRects();

  uiLevelFlags[0] = TILES_STATIC_LAND;
  // uiLevelFlags[1] = TILES_STATIC_OBJECTS;
  sLevelIDs[0] = RENDER_STATIC_LAND;
  // sLevelIDs[1]		= RENDER_STATIC_OBJECTS;
  RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 1, uiLevelFlags, sLevelIDs);

  uiLevelFlags[0] = TILES_STATIC_OBJECTS;
  sLevelIDs[0] = RENDER_STATIC_OBJECTS;
  RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 1, uiLevelFlags, sLevelIDs);

  if (gRenderFlags & RENDER_FLAG_SHADOWS) {
    uiLevelFlags[0] = TILES_STATIC_SHADOWS;
    sLevelIDs[0] = RENDER_STATIC_SHADOWS;
    RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 1, uiLevelFlags, sLevelIDs);
  }

  uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
  uiLevelFlags[1] = TILES_STATIC_ROOF;
  uiLevelFlags[2] = TILES_STATIC_ONROOF;
  uiLevelFlags[3] = TILES_STATIC_TOPMOST;

  sLevelIDs[0] = RENDER_STATIC_STRUCTS;
  sLevelIDs[1] = RENDER_STATIC_ROOF;
  sLevelIDs[2] = RENDER_STATIC_ONROOF;
  sLevelIDs[3] = RENDER_STATIC_TOPMOST;

  RenderTiles(0, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 4, uiLevelFlags, sLevelIDs);

  // ATE: Do obsucred layer!
  uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
  sLevelIDs[0] = RENDER_STATIC_STRUCTS;
  uiLevelFlags[1] = TILES_STATIC_ONROOF;
  sLevelIDs[1] = RENDER_STATIC_ONROOF;
  RenderTiles(TILES_OBSCURED, gsLStartPointX_M, gsLStartPointY_M, gsLStartPointX_S, gsLStartPointY_S, gsLEndXS, gsLEndYS, 2, uiLevelFlags, sLevelIDs);

  AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_WINDOW_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);

  ResetRenderParameters();
}

function RenderMarkedWorld(): void {
  let uiLevelFlags: UINT32[] /* [4] */;
  let sLevelIDs: UINT16[] /* [4] */;

  CalcRenderParameters(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y);

  RestoreBackgroundRects();
  FreeBackgroundRectType(BGND_FLAG_ANIMATED);
  InvalidateBackgroundRects();

  ResetLayerOptimizing();

  uiLevelFlags[0] = TILES_STATIC_LAND;
  uiLevelFlags[1] = TILES_STATIC_OBJECTS;
  sLevelIDs[0] = RENDER_STATIC_LAND;
  sLevelIDs[1] = RENDER_STATIC_OBJECTS;
  RenderTiles(TILES_MARKED, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 2, uiLevelFlags, sLevelIDs);

  if (gRenderFlags & RENDER_FLAG_SHADOWS) {
    uiLevelFlags[0] = TILES_STATIC_SHADOWS;
    sLevelIDs[0] = RENDER_STATIC_SHADOWS;
    RenderTiles(TILES_MARKED, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs);
  }

  uiLevelFlags[0] = TILES_STATIC_STRUCTURES;
  sLevelIDs[0] = RENDER_STATIC_STRUCTS;
  RenderTiles(TILES_MARKED, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs);

  uiLevelFlags[0] = TILES_STATIC_ROOF;
  sLevelIDs[0] = RENDER_STATIC_ROOF;
  RenderTiles(TILES_MARKED, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs);

  uiLevelFlags[0] = TILES_STATIC_ONROOF;
  sLevelIDs[0] = RENDER_STATIC_ONROOF;
  RenderTiles(TILES_MARKED, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs);

  uiLevelFlags[0] = TILES_STATIC_TOPMOST;
  sLevelIDs[0] = RENDER_STATIC_TOPMOST;
  RenderTiles(TILES_MARKED, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs);

  AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_WINDOW_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);

  ResetRenderParameters();
}

function RenderDynamicWorld(): void {
  let ubNumLevels: UINT8;
  let uiLevelFlags: UINT32[] /* [10] */;
  let sLevelIDs: UINT16[] /* [10] */;

  CalcRenderParameters(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y);

  RestoreBackgroundRects();

  if (!gfTagAnimatedTiles) {
    uiLevelFlags[0] = TILES_DYNAMIC_OBJECTS;
    uiLevelFlags[1] = TILES_DYNAMIC_SHADOWS;
    uiLevelFlags[2] = TILES_DYNAMIC_STRUCT_MERCS;
    uiLevelFlags[3] = TILES_DYNAMIC_MERCS;
    uiLevelFlags[4] = TILES_DYNAMIC_STRUCTURES;
    uiLevelFlags[5] = TILES_DYNAMIC_HIGHMERCS;
    uiLevelFlags[6] = TILES_DYNAMIC_ROOF;
    uiLevelFlags[7] = TILES_DYNAMIC_ONROOF;
    uiLevelFlags[8] = TILES_DYNAMIC_TOPMOST;

    sLevelIDs[0] = RENDER_DYNAMIC_OBJECTS;
    sLevelIDs[1] = RENDER_DYNAMIC_SHADOWS;
    sLevelIDs[2] = RENDER_DYNAMIC_STRUCT_MERCS;
    sLevelIDs[3] = RENDER_DYNAMIC_MERCS;
    sLevelIDs[4] = RENDER_DYNAMIC_STRUCTS;
    sLevelIDs[5] = RENDER_DYNAMIC_MERCS;
    sLevelIDs[6] = RENDER_DYNAMIC_ROOF;
    sLevelIDs[7] = RENDER_DYNAMIC_ONROOF;
    sLevelIDs[8] = RENDER_DYNAMIC_TOPMOST;

    ubNumLevels = 9;
  } else {
    gfTagAnimatedTiles = FALSE;
    // uiLevelFlags[0] = TILES_DYNAMIC_LAND;
    uiLevelFlags[0] = TILES_DYNAMIC_OBJECTS;
    uiLevelFlags[1] = TILES_DYNAMIC_SHADOWS;
    uiLevelFlags[2] = TILES_DYNAMIC_STRUCT_MERCS;
    uiLevelFlags[3] = TILES_DYNAMIC_MERCS;
    uiLevelFlags[4] = TILES_DYNAMIC_STRUCTURES;
    uiLevelFlags[5] = TILES_DYNAMIC_HIGHMERCS;
    uiLevelFlags[6] = TILES_DYNAMIC_ROOF;
    uiLevelFlags[7] = TILES_DYNAMIC_ONROOF;
    uiLevelFlags[8] = TILES_DYNAMIC_TOPMOST;

    // sLevelIDs[0]		= RENDER_DYNAMIC_LAND;
    sLevelIDs[0] = RENDER_DYNAMIC_OBJECTS;
    sLevelIDs[1] = RENDER_DYNAMIC_SHADOWS;
    sLevelIDs[2] = RENDER_DYNAMIC_STRUCT_MERCS;
    sLevelIDs[3] = RENDER_DYNAMIC_MERCS;
    sLevelIDs[4] = RENDER_DYNAMIC_STRUCTS;
    sLevelIDs[5] = RENDER_DYNAMIC_MERCS;
    sLevelIDs[6] = RENDER_DYNAMIC_ROOF;
    sLevelIDs[7] = RENDER_DYNAMIC_ONROOF;
    sLevelIDs[8] = RENDER_DYNAMIC_TOPMOST;

    ubNumLevels = 9;
  }

  RenderTiles(TILES_DIRTY, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, ubNumLevels, uiLevelFlags, sLevelIDs);

  if (!gfEditMode && !gfAniEditMode)
  {
    RenderTacticalInterface();
  }

  SaveBackgroundRects();

  // uiLevelFlags[0] = TILES_DYNAMIC_LAND;
  uiLevelFlags[0] = TILES_DYNAMIC_OBJECTS;
  uiLevelFlags[1] = TILES_DYNAMIC_SHADOWS;
  uiLevelFlags[2] = TILES_DYNAMIC_STRUCT_MERCS;
  uiLevelFlags[3] = TILES_DYNAMIC_MERCS;
  uiLevelFlags[4] = TILES_DYNAMIC_STRUCTURES;

  // sLevelIDs[0]    = RENDER_DYNAMIC_LAND;
  sLevelIDs[0] = RENDER_DYNAMIC_OBJECTS;
  sLevelIDs[1] = RENDER_DYNAMIC_SHADOWS;
  sLevelIDs[2] = RENDER_DYNAMIC_STRUCT_MERCS;
  sLevelIDs[3] = RENDER_DYNAMIC_MERCS;
  sLevelIDs[4] = RENDER_DYNAMIC_STRUCTS;

  RenderTiles(0, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 5, uiLevelFlags, sLevelIDs);

  uiLevelFlags[0] = TILES_DYNAMIC_ROOF;
  uiLevelFlags[1] = TILES_DYNAMIC_HIGHMERCS;
  uiLevelFlags[2] = TILES_DYNAMIC_ONROOF;

  sLevelIDs[0] = RENDER_DYNAMIC_ROOF;
  sLevelIDs[1] = RENDER_DYNAMIC_HIGHMERCS;
  sLevelIDs[2] = RENDER_DYNAMIC_ONROOF;

  RenderTiles(0, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 3, uiLevelFlags, sLevelIDs);

  uiLevelFlags[0] = TILES_DYNAMIC_TOPMOST;
  sLevelIDs[0] = RENDER_DYNAMIC_TOPMOST;

  // ATE: check here for mouse over structs.....
  RenderTiles(TILES_DYNAMIC_CHECKFOR_INT_TILE, gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS, 1, uiLevelFlags, sLevelIDs);

  SumAddiviveLayerOptimization();

  ResetRenderParameters();
}

function HandleScrollDirections(ScrollFlags: UINT32, sScrollXStep: INT16, sScrollYStep: INT16, psTempRenderCenterX: Pointer<INT16>, psTempRenderCenterY: Pointer<INT16>, fCheckOnly: BOOLEAN): BOOLEAN {
  let fAGoodMove: BOOLEAN = FALSE;
  let fMovedPos: BOOLEAN = FALSE;
  let sTempX_W: INT16;
  let sTempY_W: INT16;
  let fUpOK: BOOLEAN;
  let fLeftOK: BOOLEAN;
  let fDownOK: BOOLEAN;
  let fRightOK: BOOLEAN;
  let sTempRenderCenterX: INT16;
  let sTempRenderCenterY: INT16;

  sTempRenderCenterX = sTempRenderCenterY = 0;

  // This checking sequence just validates the values!
  if (ScrollFlags & SCROLL_LEFT) {
    FromScreenToCellCoordinates(-sScrollXStep, 0, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;

    fMovedPos = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);
    if (fMovedPos) {
      fAGoodMove = TRUE;
    }

    if (!fCheckOnly) {
      ScrollBackground(SCROLL_LEFT, sScrollXStep, sScrollYStep);
    }
  }

  if (ScrollFlags & SCROLL_RIGHT) {
    FromScreenToCellCoordinates(sScrollXStep, 0, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fMovedPos = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);
    if (fMovedPos) {
      fAGoodMove = TRUE;
    }

    if (!fCheckOnly) {
      ScrollBackground(SCROLL_RIGHT, sScrollXStep, sScrollYStep);
    }
  }

  if (ScrollFlags & SCROLL_UP) {
    FromScreenToCellCoordinates(0, -sScrollYStep, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fMovedPos = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);
    if (fMovedPos) {
      fAGoodMove = TRUE;
    }

    if (!fCheckOnly) {
      ScrollBackground(SCROLL_UP, sScrollXStep, sScrollYStep);
    }
  }

  if (ScrollFlags & SCROLL_DOWN) {
    FromScreenToCellCoordinates(0, sScrollYStep, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fMovedPos = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);
    if (fMovedPos) {
      fAGoodMove = TRUE;
    }

    if (!fCheckOnly) {
      ScrollBackground(SCROLL_DOWN, sScrollXStep, sScrollYStep);
    }
  }

  if (ScrollFlags & SCROLL_UPLEFT) {
    // Check up
    FromScreenToCellCoordinates(0, -sScrollYStep, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fUpOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    // Check left
    FromScreenToCellCoordinates(-sScrollXStep, 0, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fLeftOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    if (fLeftOK && fUpOK) {
      FromScreenToCellCoordinates(-sScrollXStep, -sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_UPLEFT, sScrollXStep, sScrollYStep);
      }
    } else if (fUpOK) {
      fAGoodMove = TRUE;

      FromScreenToCellCoordinates(0, -sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_UP, sScrollXStep, sScrollYStep);
      }
    } else if (fLeftOK) {
      fAGoodMove = TRUE;

      FromScreenToCellCoordinates(-sScrollXStep, 0, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_LEFT, sScrollXStep, sScrollYStep);
      }
    }
  }

  if (ScrollFlags & SCROLL_UPRIGHT) {
    // Check up
    FromScreenToCellCoordinates(0, -sScrollYStep, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fUpOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    // Check right
    FromScreenToCellCoordinates(sScrollXStep, 0, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fRightOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    if (fUpOK && fRightOK) {
      FromScreenToCellCoordinates(sScrollXStep, -sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_UPRIGHT, sScrollXStep, sScrollYStep);
      }
    } else if (fUpOK) {
      fAGoodMove = TRUE;

      FromScreenToCellCoordinates(0, -sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_UP, sScrollXStep, sScrollYStep);
      }
    } else if (fRightOK) {
      fAGoodMove = TRUE;

      FromScreenToCellCoordinates(sScrollXStep, 0, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_RIGHT, sScrollXStep, sScrollYStep);
      }
    }
  }

  if (ScrollFlags & SCROLL_DOWNLEFT) {
    // Check down......
    FromScreenToCellCoordinates(0, sScrollYStep, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fDownOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    // Check left.....
    FromScreenToCellCoordinates(-sScrollXStep, 0, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fLeftOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    if (fLeftOK && fDownOK) {
      fAGoodMove = TRUE;
      FromScreenToCellCoordinates(-sScrollXStep, sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_DOWNLEFT, sScrollXStep, sScrollYStep);
      }
    } else if (fLeftOK) {
      FromScreenToCellCoordinates(-sScrollXStep, 0, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_LEFT, sScrollXStep, sScrollYStep);
      }
    } else if (fDownOK) {
      FromScreenToCellCoordinates(0, sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_DOWN, sScrollXStep, sScrollYStep);
      }
    }
  }

  if (ScrollFlags & SCROLL_DOWNRIGHT) {
    // Check right
    FromScreenToCellCoordinates(sScrollXStep, 0, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fRightOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    // Check down
    FromScreenToCellCoordinates(0, sScrollYStep, &sTempX_W, &sTempY_W);
    sTempRenderCenterX = gsRenderCenterX + sTempX_W;
    sTempRenderCenterY = gsRenderCenterY + sTempY_W;
    fDownOK = ApplyScrolling(sTempRenderCenterX, sTempRenderCenterY, FALSE, fCheckOnly);

    if (fDownOK && fRightOK) {
      FromScreenToCellCoordinates(sScrollXStep, sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_DOWNRIGHT, sScrollXStep, sScrollYStep);
      }
    } else if (fDownOK) {
      FromScreenToCellCoordinates(0, sScrollYStep, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_DOWN, sScrollXStep, sScrollYStep);
      }
    } else if (fRightOK) {
      FromScreenToCellCoordinates(sScrollXStep, 0, &sTempX_W, &sTempY_W);
      sTempRenderCenterX = gsRenderCenterX + sTempX_W;
      sTempRenderCenterY = gsRenderCenterY + sTempY_W;
      fAGoodMove = TRUE;

      if (!fCheckOnly) {
        ScrollBackground(SCROLL_RIGHT, sScrollXStep, sScrollYStep);
      }
    }
  }

  (*psTempRenderCenterX) = sTempRenderCenterX;
  (*psTempRenderCenterY) = sTempRenderCenterY;

  return fAGoodMove;
}

function ScrollWorld(): void {
  let ScrollFlags: UINT32 = 0;
  let fDoScroll: BOOLEAN = FALSE;
  let fMovedPos: BOOLEAN = FALSE;
  let fAGoodMove: BOOLEAN = FALSE;
  let sTempRenderCenterX: INT16;
  let sTempRenderCenterY: INT16;
  let bDirection: INT8;
  let sScrollXStep: INT16 = -1;
  let sScrollYStep: INT16 = -1;
  let fIgnoreInput: BOOLEAN = FALSE;
  /* static */ let ubOldScrollSpeed: UINT8 = 0;
  /* static */ let fFirstTimeInSlideToMode: BOOLEAN = TRUE;

  if (gfIgnoreScrollDueToCenterAdjust) {
    //	gfIgnoreScrollDueToCenterAdjust = FALSE;
    return;
  }

  if (gfIgnoreScrolling == 1) {
    return;
  }

  if (gfIgnoreScrolling == 2) {
    fIgnoreInput = TRUE;
  }

  if (gCurrentUIMode == LOCKUI_MODE) {
    fIgnoreInput = TRUE;
  }

  // If in editor, ignore scrolling if any of the shift keys pressed with arrow keys
  if (gfEditMode && (_KeyDown(CTRL) || _KeyDown(ALT)))
    return;

  // Ignore if ALT DONW
  if (_KeyDown(ALT))
    return;

  do {
    if (gfIgnoreScrolling != 3) {
      // Check for sliding
      if (gTacticalStatus.sSlideTarget != NOWHERE) {
        // Ignore all input...
        // Check if we have reached out dest!
        if (fFirstTimeInSlideToMode) {
          ubOldScrollSpeed = gubCurScrollSpeedID;
          fFirstTimeInSlideToMode = FALSE;
        }

        // Make faster!
        // gubCurScrollSpeedID = 2;

        ScrollFlags = 0;
        fDoScroll = FALSE;
        //
        if (SoldierLocationRelativeToScreen(gTacticalStatus.sSlideTarget, gTacticalStatus.sSlideReason, &bDirection, &ScrollFlags) && GridNoOnVisibleWorldTile(gTacticalStatus.sSlideTarget)) {
          ScrollFlags = gScrollDirectionFlags[bDirection];
          fDoScroll = TRUE;
          fIgnoreInput = TRUE;
        } else {
          // We've stopped!
          gTacticalStatus.sSlideTarget = NOWHERE;
        }
      } else {
        // Restore old scroll speed
        if (!fFirstTimeInSlideToMode) {
          gubCurScrollSpeedID = ubOldScrollSpeed;
        }
        fFirstTimeInSlideToMode = TRUE;
      }
    }

    if (!fIgnoreInput) {
      // Check keys
      if (_KeyDown(UPARROW)) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_UP;
      }

      if (_KeyDown(DNARROW)) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_DOWN;
      }

      if (_KeyDown(RIGHTARROW)) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_RIGHT;
      }

      if (_KeyDown(LEFTARROW)) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_LEFT;
      }

      // Do mouse - PUT INTO A TIMER!
      // Put a counter on starting from mouse, if we have not started already!
      if (!gfScrollInertia && gfScrollPending == FALSE) {
        if (!COUNTERDONE(STARTSCROLL)) {
          break;
        }
        RESETCOUNTER(STARTSCROLL);
      }

      if (gusMouseYPos == 0) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_UP;
      }

      if (gusMouseYPos >= 479) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_DOWN;
      }

      if (gusMouseXPos >= 639) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_RIGHT;
      }

      if (gusMouseXPos == 0) {
        fDoScroll = TRUE;
        ScrollFlags |= SCROLL_LEFT;
      }
    }
  } while (FALSE);

  if (fDoScroll) {
    if (gfDoSubtileScroll) {
      if (gfScrollInertia > gubNewScrollIDSpeeds[gubCurScrollSpeedID]) {
        gubCurScrollSpeedID++;

        if (gubCurScrollSpeedID > gubScrollSpeedEndID) {
          gubCurScrollSpeedID = gubScrollSpeedEndID;
        }
      }
    }

    // if ( !gfDoVideoScroll )
    //{
    //	gubCurScrollSpeedID = 4;
    //}

    // Adjust speed based on whether shift is down
    if (_KeyDown(SHIFT)) {
      sScrollXStep = gubNewScrollXSpeeds[gfDoVideoScroll][3];
      sScrollYStep = gubNewScrollYSpeeds[gfDoVideoScroll][3];
    } else {
      sScrollXStep = gubNewScrollXSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];
      sScrollYStep = gubNewScrollYSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];
    }

    // Set diagonal flags!
    if ((ScrollFlags & SCROLL_LEFT) && (ScrollFlags & SCROLL_UP)) {
      ScrollFlags = SCROLL_UPLEFT;
    }
    if ((ScrollFlags & SCROLL_RIGHT) && (ScrollFlags & SCROLL_UP)) {
      ScrollFlags = SCROLL_UPRIGHT;
    }
    if ((ScrollFlags & SCROLL_LEFT) && (ScrollFlags & SCROLL_DOWN)) {
      ScrollFlags = SCROLL_DOWNLEFT;
    }
    if ((ScrollFlags & SCROLL_RIGHT) && (ScrollFlags & SCROLL_DOWN)) {
      ScrollFlags = SCROLL_DOWNRIGHT;
    }

    fAGoodMove = HandleScrollDirections(ScrollFlags, sScrollXStep, sScrollYStep, &sTempRenderCenterX, &sTempRenderCenterY, TRUE);
  }

  // Has this been an OK scroll?
  if (fAGoodMove) {
    if (COUNTERDONE(NEXTSCROLL)) {
      RESETCOUNTER(NEXTSCROLL);

      // Are we starting a new scroll?
      if (gfScrollInertia == 0 && gfScrollPending == FALSE) {
        // We are starting to scroll - setup scroll pending
        gfScrollPending = TRUE;

        // Remove any interface stuff
        ClearInterface();

        // Return so that next frame things will be erased!
        return;
      }

      // If here, set scroll pending to false
      gfScrollPending = FALSE;

      // INcrement scroll intertia
      gfScrollInertia++;

      // Now we actually begin our scrolling
      HandleScrollDirections(ScrollFlags, sScrollXStep, sScrollYStep, &sTempRenderCenterX, &sTempRenderCenterY, FALSE);
    }
  } else {
    // ATE: Also if scroll pending never got to scroll....
    if (gfScrollPending == TRUE) {
      // Do a complete rebuild!
      gfScrollPending = FALSE;

      // Restore Interface!
      RestoreInterface();

      // Delete Topmost blitters saved areas
      DeleteVideoOverlaysArea();
    }

    // Check if we have just stopped scrolling!
    if (gfScrollInertia != FALSE) {
      SetRenderFlags(RENDER_FLAG_FULL | RENDER_FLAG_CHECKZ);

      // Restore Interface!
      RestoreInterface();

      // Delete Topmost blitters saved areas
      DeleteVideoOverlaysArea();
    }

    gfScrollInertia = FALSE;
    gfScrollPending = FALSE;

    if (gfDoSubtileScroll) {
      gubCurScrollSpeedID = gubScrollSpeedStartID;
    }
  }
}

function InitRenderParams(ubRestrictionID: UINT8): void {
  let gsTilesX: INT16;
  let gsTilesY: INT16;
  let cnt: UINT32;
  let cnt2: UINT32;
  let dWorldX: DOUBLE;
  let dWorldY: DOUBLE;

  switch (ubRestrictionID) {
    case 0: // Default!

      gTopLeftWorldLimitX = CELL_X_SIZE;
      gTopLeftWorldLimitY = (WORLD_ROWS / 2) * CELL_X_SIZE;

      gTopRightWorldLimitX = (WORLD_COLS / 2) * CELL_Y_SIZE;
      gTopRightWorldLimitY = CELL_X_SIZE;

      gBottomLeftWorldLimitX = ((WORLD_COLS / 2) * CELL_Y_SIZE);
      gBottomLeftWorldLimitY = (WORLD_ROWS * CELL_Y_SIZE);

      gBottomRightWorldLimitX = (WORLD_COLS * CELL_Y_SIZE);
      gBottomRightWorldLimitY = ((WORLD_ROWS / 2) * CELL_X_SIZE);
      break;

    case 1: // BAEMENT LEVEL 1

      gTopLeftWorldLimitX = (3 * WORLD_ROWS / 10) * CELL_X_SIZE;
      gTopLeftWorldLimitY = (WORLD_ROWS / 2) * CELL_X_SIZE;

      gTopRightWorldLimitX = (WORLD_ROWS / 2) * CELL_X_SIZE;
      gTopRightWorldLimitY = (3 * WORLD_COLS / 10) * CELL_X_SIZE;

      gBottomLeftWorldLimitX = (WORLD_ROWS / 2) * CELL_X_SIZE;
      gBottomLeftWorldLimitY = (7 * WORLD_COLS / 10) * CELL_X_SIZE;

      gBottomRightWorldLimitX = (7 * WORLD_ROWS / 10) * CELL_X_SIZE;
      gBottomRightWorldLimitY = (WORLD_ROWS / 2) * CELL_X_SIZE;
      break;
  }

  gCenterWorldX = (WORLD_ROWS) / 2 * CELL_X_SIZE;
  gCenterWorldY = (WORLD_COLS) / 2 * CELL_Y_SIZE;

  // Convert Bounding box into screen coords
  FromCellToScreenCoordinates(gTopLeftWorldLimitX, gTopLeftWorldLimitY, &gsTLX, &gsTLY);
  FromCellToScreenCoordinates(gTopRightWorldLimitX, gTopRightWorldLimitY, &gsTRX, &gsTRY);
  FromCellToScreenCoordinates(gBottomLeftWorldLimitX, gBottomLeftWorldLimitY, &gsBLX, &gsBLY);
  FromCellToScreenCoordinates(gBottomRightWorldLimitX, gBottomRightWorldLimitY, &gsBRX, &gsBRY);
  FromCellToScreenCoordinates(gCenterWorldX, gCenterWorldY, &gsCX, &gsCY);

  // Adjust for interface height tabbing!
  gsTLY += ROOF_LEVEL_HEIGHT;
  gsTRY += ROOF_LEVEL_HEIGHT;
  gsCY += (ROOF_LEVEL_HEIGHT / 2);

  // Take these spaning distances and determine # tiles spaning
  gsTilesX = (gsTRX - gsTLX) / WORLD_TILE_X;
  gsTilesY = (gsBRY - gsTRY) / WORLD_TILE_Y;

  DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("World Screen Width %d Height %d", (gsTRX - gsTLX), (gsBRY - gsTRY)));

  // Determine scale factors
  // First scale world screen coords for VIEWPORT ratio
  dWorldX = (gsTRX - gsTLX);
  dWorldY = (gsBRY - gsTRY);

  gdScaleX = RADAR_WINDOW_WIDTH / dWorldX;
  gdScaleY = RADAR_WINDOW_HEIGHT / dWorldY;

  for (cnt = 0, cnt2 = 0; cnt2 < NUM_ITEM_CYCLE_COLORS; cnt += 3, cnt2++) {
    us16BPPItemCycleWhiteColors[cnt2] = Get16BPPColor(FROMRGB(ubRGBItemCycleWhiteColors[cnt], ubRGBItemCycleWhiteColors[cnt + 1], ubRGBItemCycleWhiteColors[cnt + 2]));
    us16BPPItemCycleRedColors[cnt2] = Get16BPPColor(FROMRGB(ubRGBItemCycleRedColors[cnt], ubRGBItemCycleRedColors[cnt + 1], ubRGBItemCycleRedColors[cnt + 2]));
    us16BPPItemCycleYellowColors[cnt2] = Get16BPPColor(FROMRGB(ubRGBItemCycleYellowColors[cnt], ubRGBItemCycleYellowColors[cnt + 1], ubRGBItemCycleYellowColors[cnt + 2]));
  }

  gsLobOutline = Get16BPPColor(FROMRGB(10, 200, 10));
  gsThrowOutline = Get16BPPColor(FROMRGB(253, 212, 10));
  gsGiveOutline = Get16BPPColor(FROMRGB(253, 0, 0));

  gusNormalItemOutlineColor = Get16BPPColor(FROMRGB(255, 255, 255));
  gusYellowItemOutlineColor = Get16BPPColor(FROMRGB(255, 255, 0));

  // NOW GET DISTANCE SPANNING WORLD LIMITS IN WORLD COORDS
  // FromScreenToCellCoordinates( ( gTopRightWorldLimitX - gTopLeftWorldLimitX ), ( gTopRightWorldLimitY - gTopLeftWorldLimitY ), &gsWorldSpanX, &gsWorldSpanY );

  // CALCULATE 16BPP COLORS FOR ITEMS
}

// Appy? HEahehahehahehae.....
function ApplyScrolling(sTempRenderCenterX: INT16, sTempRenderCenterY: INT16, fForceAdjust: BOOLEAN, fCheckOnly: BOOLEAN): BOOLEAN {
  let fScrollGood: BOOLEAN = FALSE;
  let fOutLeft: BOOLEAN = FALSE;
  let fOutRight: BOOLEAN = FALSE;
  let fOutTop: BOOLEAN = FALSE;
  let fOutBottom: BOOLEAN = FALSE;

  let dOpp: double;
  let dAdj: double;
  let dAngle: double;

  let sTopLeftWorldX: INT16;
  let sTopLeftWorldY: INT16;
  let sTopRightWorldX: INT16;
  let sTopRightWorldY: INT16;
  let sBottomLeftWorldX: INT16;
  let sBottomLeftWorldY: INT16;
  let sBottomRightWorldX: INT16;
  let sBottomRightWorldY: INT16;

  let sTempPosX_W: INT16;
  let sTempPosY_W: INT16;

  // For debug text for all 4 angles
  let at1: double;
  let at2: double;
  let at3: double;
  let at4: double;

  let sX_S: INT16;
  let sY_S: INT16;
  let sScreenCenterX: INT16;
  let sScreenCenterY: INT16;
  let sDistToCenterY: INT16;
  let sDistToCenterX: INT16;
  let sNewScreenX: INT16;
  let sNewScreenY: INT16;
  let sMult: INT16;

  // Makesure it's a multiple of 5
  sMult = sTempRenderCenterX / CELL_X_SIZE;
  sTempRenderCenterX = (sMult * CELL_X_SIZE) + (CELL_X_SIZE / 2);

  // Makesure it's a multiple of 5
  sMult = sTempRenderCenterY / CELL_X_SIZE;
  sTempRenderCenterY = (sMult * CELL_Y_SIZE) + (CELL_Y_SIZE / 2);

  // Find the diustance from render center to true world center
  sDistToCenterX = sTempRenderCenterX - gCenterWorldX;
  sDistToCenterY = sTempRenderCenterY - gCenterWorldY;

  // From render center in world coords, convert to render center in "screen" coords
  FromCellToScreenCoordinates(sDistToCenterX, sDistToCenterY, &sScreenCenterX, &sScreenCenterY);

  // Subtract screen center
  sScreenCenterX += gsCX;
  sScreenCenterY += gsCY;

  // Adjust for offset position on screen
  sScreenCenterX -= 0;
  sScreenCenterY -= 10;

  // Get corners in screen coords
  // TOP LEFT
  sX_S = (gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2;
  sY_S = (gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2;

  sTopLeftWorldX = sScreenCenterX - sX_S;
  sTopLeftWorldY = sScreenCenterY - sY_S;

  sTopRightWorldX = sScreenCenterX + sX_S;
  sTopRightWorldY = sScreenCenterY - sY_S;

  sBottomLeftWorldX = sScreenCenterX - sX_S;
  sBottomLeftWorldY = sScreenCenterY + sY_S;

  sBottomRightWorldX = sScreenCenterX + sX_S;
  sBottomRightWorldY = sScreenCenterY + sY_S;

  // Get angles
  // TOP LEFT CORNER FIRST
  dOpp = sTopLeftWorldY - gsTLY;
  dAdj = sTopLeftWorldX - gsTLX;

  dAngle = atan2(dAdj, dOpp);
  at1 = dAngle * 180 / PI;

  if (dAngle < 0) {
    fOutLeft = TRUE;
  } else if (dAngle > PI / 2) {
    fOutTop = TRUE;
  }

  // TOP RIGHT CORNER
  dOpp = sTopRightWorldY - gsTRY;
  dAdj = gsTRX - sTopRightWorldX;

  dAngle = atan2(dAdj, dOpp);
  at2 = dAngle * 180 / PI;

  if (dAngle < 0) {
    fOutRight = TRUE;
  } else if (dAngle > PI / 2) {
    fOutTop = TRUE;
  }

  // BOTTOM LEFT CORNER
  dOpp = gsBLY - sBottomLeftWorldY;
  dAdj = sBottomLeftWorldX - gsBLX;

  dAngle = atan2(dAdj, dOpp);
  at3 = dAngle * 180 / PI;

  if (dAngle < 0) {
    fOutLeft = TRUE;
  } else if (dAngle > PI / 2) {
    fOutBottom = TRUE;
  }

  // BOTTOM RIGHT CORNER
  dOpp = gsBRY - sBottomRightWorldY;
  dAdj = gsBRX - sBottomRightWorldX;

  dAngle = atan2(dAdj, dOpp);
  at4 = dAngle * 180 / PI;

  if (dAngle < 0) {
    fOutRight = TRUE;
  } else if (dAngle > PI / 2) {
    fOutBottom = TRUE;
  }

  sprintf(gDebugStr, "Angles: %d %d %d %d", at1, at2, at3, at4);

  if (!fOutRight && !fOutLeft && !fOutTop && !fOutBottom) {
    fScrollGood = TRUE;
  }

  // If in editor, anything goes
  if (gfEditMode && _KeyDown(SHIFT)) {
    fScrollGood = TRUE;
  }

  // Reset some UI flags
  gfUIShowExitEast = FALSE;
  gfUIShowExitWest = FALSE;
  gfUIShowExitNorth = FALSE;
  gfUIShowExitSouth = FALSE;

  if (!fScrollGood) {
    // Force adjustment, if true
    if (fForceAdjust) {
      if (fOutTop) {
        // Adjust screen coordinates on the Y!
        CorrectRenderCenter(sScreenCenterX, (gsTLY + sY_S), &sNewScreenX, &sNewScreenY);
        FromScreenToCellCoordinates(sNewScreenX, sNewScreenY, &sTempPosX_W, &sTempPosY_W);

        sTempRenderCenterX = sTempPosX_W;
        sTempRenderCenterY = sTempPosY_W;
        fScrollGood = TRUE;
      }

      if (fOutBottom) {
        // OK, Ajust this since we get rounding errors in our two different calculations.
        CorrectRenderCenter(sScreenCenterX, (gsBLY - sY_S - 50), &sNewScreenX, &sNewScreenY);
        FromScreenToCellCoordinates(sNewScreenX, sNewScreenY, &sTempPosX_W, &sTempPosY_W);

        sTempRenderCenterX = sTempPosX_W;
        sTempRenderCenterY = sTempPosY_W;
        fScrollGood = TRUE;
      }

      if (fOutLeft) {
        CorrectRenderCenter((gsTLX + sX_S), sScreenCenterY, &sNewScreenX, &sNewScreenY);
        FromScreenToCellCoordinates(sNewScreenX, sNewScreenY, &sTempPosX_W, &sTempPosY_W);

        sTempRenderCenterX = sTempPosX_W;
        sTempRenderCenterY = sTempPosY_W;
        fScrollGood = TRUE;
      }

      if (fOutRight) {
        CorrectRenderCenter((gsTRX - sX_S), sScreenCenterY, &sNewScreenX, &sNewScreenY);
        FromScreenToCellCoordinates(sNewScreenX, sNewScreenY, &sTempPosX_W, &sTempPosY_W);

        sTempRenderCenterX = sTempPosX_W;
        sTempRenderCenterY = sTempPosY_W;
        fScrollGood = TRUE;
      }
    } else {
      if (fOutRight) {
        // Check where our cursor is!
        if (gusMouseXPos >= 639) {
          gfUIShowExitEast = TRUE;
        }
      }

      if (fOutLeft) {
        // Check where our cursor is!
        if (gusMouseXPos == 0) {
          gfUIShowExitWest = TRUE;
        }
      }

      if (fOutTop) {
        // Check where our cursor is!
        if (gusMouseYPos == 0) {
          gfUIShowExitNorth = TRUE;
        }
      }

      if (fOutBottom) {
        // Check where our cursor is!
        if (gusMouseYPos >= 479) {
          gfUIShowExitSouth = TRUE;
        }
      }
    }
  }

  if (fScrollGood) {
    if (!fCheckOnly) {
      sprintf(gDebugStr, "Center: %d %d ", gsRenderCenterX, gsRenderCenterY);

      // Makesure it's a multiple of 5
      sMult = sTempRenderCenterX / CELL_X_SIZE;
      gsRenderCenterX = (sMult * CELL_X_SIZE) + (CELL_X_SIZE / 2);

      // Makesure it's a multiple of 5
      sMult = sTempRenderCenterY / CELL_X_SIZE;
      gsRenderCenterY = (sMult * CELL_Y_SIZE) + (CELL_Y_SIZE / 2);

      // gsRenderCenterX = sTempRenderCenterX;
      // gsRenderCenterY = sTempRenderCenterY;

      gsTopLeftWorldX = sTopLeftWorldX - gsTLX;
      gsTopLeftWorldY = sTopLeftWorldY - gsTLY;

      gsTopRightWorldX = sTopRightWorldX - gsTLX;
      gsTopRightWorldY = sTopRightWorldY - gsTLY;

      gsBottomLeftWorldX = sBottomLeftWorldX - gsTLX;
      gsBottomLeftWorldY = sBottomLeftWorldY - gsTLY;

      gsBottomRightWorldX = sBottomRightWorldX - gsTLX;
      gsBottomRightWorldY = sBottomRightWorldY - gsTLY;

      SetPositionSndsVolumeAndPanning();
    }

    return TRUE;
  }

  return FALSE;
}

function ClearMarkedTiles(): void {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < WORLD_MAX; uiCount++)
    gpWorldLevelData[uiCount].uiFlags &= (~MAPELEMENT_REDRAW);
}

// @@ATECLIP TO WORLD!
function InvalidateWorldRedundencyRadius(sX: INT16, sY: INT16, sRadius: INT16): void {
  let sCountX: INT16;
  let sCountY: INT16;
  let uiTile: UINT32;

  SetRenderFlags(RENDER_FLAG_CHECKZ);

  for (sCountY = sY - sRadius; sCountY < (sY + sRadius + 2); sCountY++) {
    for (sCountX = sX - sRadius; sCountX < (sX + sRadius + 2); sCountX++) {
      uiTile = FASTMAPROWCOLTOPOS(sCountY, sCountX);

      gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REEVALUATE_REDUNDENCY;
    }
  }
}

function InvalidateWorldRedundency(): void {
  let uiCount: UINT32;

  SetRenderFlags(RENDER_FLAG_CHECKZ);

  for (uiCount = 0; uiCount < WORLD_MAX; uiCount++)
    gpWorldLevelData[uiCount].uiFlags |= MAPELEMENT_REEVALUATE_REDUNDENCY;
}

const Z_STRIP_DELTA_Y = (Z_SUBLAYERS * 10);

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZIncClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferTransZIncClip(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: Pointer<SGPRect>): BOOLEAN {
  let p16BPPPalette: Pointer<UINT16>;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let usZLevel: UINT16;
  let usZStartLevel: UINT16;
  let usZColsToGo: UINT16;
  let usZStartIndex: UINT16;
  let usCount: UINT16;
  let usZIndex: UINT16;
  let usZStartCols: UINT16;
  let pZArray: Pointer<INT8>;
  let pZInfo: Pointer<ZStripInfo>;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  if (clipregion == NULL) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion->iLeft;
    ClipY1 = clipregion->iTop;
    ClipX2 = clipregion->iRight;
    ClipY2 = clipregion->iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = __min(ClipX1 - min(ClipX1, iTempX), usWidth);
  RightSkip = __min(max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = __min(ClipY1 - __min(ClipY1, iTempY), usHeight);
  BottomSkip = __min(__max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return TRUE;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return TRUE;

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject->pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  if (hSrcVObject->ppZStripInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }
  // setup for the z-column blitting stuff
  pZInfo = hSrcVObject->ppZStripInfo[usIndex];
  if (pZInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }

  usZStartLevel = (usZValue + (pZInfo->bInitialZChange * Z_STRIP_DELTA_Y));
  // set to odd number of pixels for first column

  if (LeftSkip > pZInfo->ubFirstZStripWidth) {
    usZStartCols = (LeftSkip - pZInfo->ubFirstZStripWidth);
    usZStartCols = 20 - (usZStartCols % 20);
  } else if (LeftSkip < pZInfo->ubFirstZStripWidth)
    usZStartCols = (pZInfo->ubFirstZStripWidth - LeftSkip);
  else
    usZStartCols = 20;

  usZColsToGo = usZStartCols;

  pZArray = pZInfo->pbZChange;

  if (LeftSkip >= pZInfo->ubFirstZStripWidth) {
    // Index into array after doing left clipping
    usZStartIndex = 1 + ((LeftSkip - pZInfo->ubFirstZStripWidth) / 20);

    // calculates the Z-value after left-side clipping
    if (usZStartIndex) {
      for (usCount = 0; usCount < usZStartIndex; usCount++) {
        switch (pZArray[usCount]) {
          case -1:
            usZStartLevel -= Z_STRIP_DELTA_Y;
            break;
          case 0: // no change
            break;
          case 1:
            usZStartLevel += Z_STRIP_DELTA_Y;
            break;
        }
      }
    }
  } else
    usZStartIndex = 0;

  usZLevel = usZStartLevel;
  usZIndex = usZStartIndex;

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    // Skips the number of lines clipped at the top
    TopSkipLoop:

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    // Start of line loop

    // Skips the pixels hanging outside the left-side boundry
    LeftSkipSetup:

    mov Unblitted, 0 // Unblitted counts any pixels left from a run
    mov eax, LeftSkip // after we have skipped enough left-side pixels
    mov LSCount, eax // LSCount counts how many pixels skipped so far
    or eax, eax
    jz BlitLineSetup // check for nothing to skip

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNTL1 // *** jumps into non-transparent blit loop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent // *** jumps into transparent blit loop

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    //-------------------------------------------------
    // setup for beginning of line

    BlitLineSetup:
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz RSLoop2

    //--------------------------------
    // blitting non-transparent pixels

    and ecx, 07fH

    BlitNTL1:
    mov ax, [ebx] // check z-level of pixel
    cmp ax, usZLevel
    jae BlitNTL2

    mov ax, usZLevel // update z-level of pixel
    mov [ebx], ax

    xor eax, eax
    mov al, [esi] // copy pixel
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2

    dec usZColsToGo
    jnz BlitNTL6

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitNTL5 // dir = 0 no change
    js BlitNTL4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_STRIP_DELTA_Y
    jmp BlitNTL5

    BlitNTL4:
    sub dx, Z_STRIP_DELTA_Y

    BlitNTL5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitNTL6:
    dec LSCount // decrement pixel length to blit
    jz RightSkipLoop // done blitting the visible line

    dec ecx
    jnz BlitNTL1 // continue current run

    jmp BlitDispatch // done current run, go for another

    //----------------------------
    // skipping transparent pixels

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH

    BlitTrans2:

    add edi, 2 // move up the destination pointer
    add ebx, 2

    dec usZColsToGo
    jnz BlitTrans1

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitTrans5 // dir = 0 no change
    js BlitTrans4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_STRIP_DELTA_Y
    jmp BlitTrans5

    BlitTrans4:
    sub dx, Z_STRIP_DELTA_Y

    BlitTrans5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitTrans1:

    dec LSCount // decrement the pixels to blit
    jz RightSkipLoop // done the line

    dec ecx
    jnz BlitTrans2

    jmp BlitDispatch

    //---------------------------------------------
    // Scans the ETRLE until it finds an EOL marker

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    RSLoop2:

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    // reset all the z-level stuff for a new line

    mov ax, usZStartLevel
    mov usZLevel, ax
    mov ax, usZStartIndex
    mov usZIndex, ax
    mov ax, usZStartCols
    mov usZColsToGo, ax

    jmp LeftSkipSetup

    BlitDone:
  }

  return TRUE;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZIncClipSaveZBurnsThrough

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferTransZIncClipZSameZBurnsThrough(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: Pointer<SGPRect>): BOOLEAN {
  let p16BPPPalette: Pointer<UINT16>;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let usZLevel: UINT16;
  let usZStartLevel: UINT16;
  let usZColsToGo: UINT16;
  let usZStartIndex: UINT16;
  let usCount: UINT16;
  let usZIndex: UINT16;
  let usZStartCols: UINT16;
  let pZArray: Pointer<INT8>;
  let pZInfo: Pointer<ZStripInfo>;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  if (clipregion == NULL) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion->iLeft;
    ClipY1 = clipregion->iTop;
    ClipX2 = clipregion->iRight;
    ClipY2 = clipregion->iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = __min(ClipX1 - min(ClipX1, iTempX), usWidth);
  RightSkip = __min(max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = __min(ClipY1 - __min(ClipY1, iTempY), usHeight);
  BottomSkip = __min(__max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return TRUE;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return TRUE;

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject->pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  if (hSrcVObject->ppZStripInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }
  // setup for the z-column blitting stuff
  pZInfo = hSrcVObject->ppZStripInfo[usIndex];
  if (pZInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }

  usZStartLevel = (usZValue + (pZInfo->bInitialZChange * Z_STRIP_DELTA_Y));
  // set to odd number of pixels for first column

  if (LeftSkip > pZInfo->ubFirstZStripWidth) {
    usZStartCols = (LeftSkip - pZInfo->ubFirstZStripWidth);
    usZStartCols = 20 - (usZStartCols % 20);
  } else if (LeftSkip < pZInfo->ubFirstZStripWidth)
    usZStartCols = (pZInfo->ubFirstZStripWidth - LeftSkip);
  else
    usZStartCols = 20;

  usZColsToGo = usZStartCols;

  pZArray = pZInfo->pbZChange;

  if (LeftSkip >= pZInfo->ubFirstZStripWidth) {
    // Index into array after doing left clipping
    usZStartIndex = 1 + ((LeftSkip - pZInfo->ubFirstZStripWidth) / 20);

    // calculates the Z-value after left-side clipping
    if (usZStartIndex) {
      for (usCount = 0; usCount < usZStartIndex; usCount++) {
        switch (pZArray[usCount]) {
          case -1:
            usZStartLevel -= Z_STRIP_DELTA_Y;
            break;
          case 0: // no change
            break;
          case 1:
            usZStartLevel += Z_STRIP_DELTA_Y;
            break;
        }
      }
    }
  } else
    usZStartIndex = 0;

  usZLevel = usZStartLevel;
  usZIndex = usZStartIndex;

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    // Skips the number of lines clipped at the top
    TopSkipLoop:

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    // Start of line loop

    // Skips the pixels hanging outside the left-side boundry
    LeftSkipSetup:

    mov Unblitted, 0 // Unblitted counts any pixels left from a run
    mov eax, LeftSkip // after we have skipped enough left-side pixels
    mov LSCount, eax // LSCount counts how many pixels skipped so far
    or eax, eax
    jz BlitLineSetup // check for nothing to skip

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNTL1 // *** jumps into non-transparent blit loop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent // *** jumps into transparent blit loop

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    //-------------------------------------------------
    // setup for beginning of line

    BlitLineSetup:
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz RSLoop2

    //--------------------------------
    // blitting non-transparent pixels

    and ecx, 07fH

    BlitNTL1:
    mov ax, [ebx] // check z-level of pixel
    cmp ax, usZLevel
    ja BlitNTL2

    mov ax, usZLevel // update z-level of pixel
    mov [ebx], ax

    xor eax, eax
    mov al, [esi] // copy pixel
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2

    dec usZColsToGo
    jnz BlitNTL6

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitNTL5 // dir = 0 no change
    js BlitNTL4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_STRIP_DELTA_Y
    jmp BlitNTL5

    BlitNTL4:
    sub dx, Z_STRIP_DELTA_Y

    BlitNTL5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitNTL6:
    dec LSCount // decrement pixel length to blit
    jz RightSkipLoop // done blitting the visible line

    dec ecx
    jnz BlitNTL1 // continue current run

    jmp BlitDispatch // done current run, go for another

    //----------------------------
    // skipping transparent pixels

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH

    BlitTrans2:

    add edi, 2 // move up the destination pointer
    add ebx, 2

    dec usZColsToGo
    jnz BlitTrans1

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitTrans5 // dir = 0 no change
    js BlitTrans4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_STRIP_DELTA_Y
    jmp BlitTrans5

    BlitTrans4:
    sub dx, Z_STRIP_DELTA_Y

    BlitTrans5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitTrans1:

    dec LSCount // decrement the pixels to blit
    jz RightSkipLoop // done the line

    dec ecx
    jnz BlitTrans2

    jmp BlitDispatch

    //---------------------------------------------
    // Scans the ETRLE until it finds an EOL marker

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    RSLoop2:

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    // reset all the z-level stuff for a new line

    mov ax, usZStartLevel
    mov usZLevel, ax
    mov ax, usZStartIndex
    mov usZIndex, ax
    mov ax, usZStartCols
    mov usZColsToGo, ax

    jmp LeftSkipSetup

    BlitDone:
  }

  return TRUE;
}

/**********************************************************************************************
 Blt8BPPDataTo16BPPBufferTransZIncObscureClip

        Blits an image into the destination buffer, using an ETRLE brush as a source, and a 16-bit
        buffer as a destination. As it is blitting, it checks the Z value of the ZBuffer, and if the
        pixel's Z level is below that of the current pixel, it is written on, and the Z value is
        updated to the current value,	for any non-transparent pixels. The Z-buffer is 16 bit, and
        must be the same dimensions (including Pitch) as the destination.

        //ATE: This blitter makes the values that are =< z value pixellate rather than not
        // render at all

**********************************************************************************************/
function Blt8BPPDataTo16BPPBufferTransZIncObscureClip(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: Pointer<SGPRect>): BOOLEAN {
  let p16BPPPalette: Pointer<UINT16>;
  let uiOffset: UINT32;
  let uiLineFlag: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let usZLevel: UINT16;
  let usZStartLevel: UINT16;
  let usZColsToGo: UINT16;
  let usZStartIndex: UINT16;
  let usCount: UINT16;
  let usZIndex: UINT16;
  let usZStartCols: UINT16;
  let pZArray: Pointer<INT8>;
  let pZInfo: Pointer<ZStripInfo>;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  if (clipregion == NULL) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion->iLeft;
    ClipY1 = clipregion->iTop;
    ClipX2 = clipregion->iRight;
    ClipY2 = clipregion->iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = __min(ClipX1 - min(ClipX1, iTempX), usWidth);
  RightSkip = __min(max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = __min(ClipY1 - __min(ClipY1, iTempY), usHeight);
  BottomSkip = __min(__max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  uiLineFlag = (iTempY & 1);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return TRUE;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return TRUE;

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  p16BPPPalette = hSrcVObject->pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  if (hSrcVObject->ppZStripInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }
  // setup for the z-column blitting stuff
  pZInfo = hSrcVObject->ppZStripInfo[usIndex];
  if (pZInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }

  usZStartLevel = (usZValue + (pZInfo->bInitialZChange * Z_STRIP_DELTA_Y));
  // set to odd number of pixels for first column

  if (LeftSkip > pZInfo->ubFirstZStripWidth) {
    usZStartCols = (LeftSkip - pZInfo->ubFirstZStripWidth);
    usZStartCols = 20 - (usZStartCols % 20);
  } else if (LeftSkip < pZInfo->ubFirstZStripWidth)
    usZStartCols = (pZInfo->ubFirstZStripWidth - LeftSkip);
  else
    usZStartCols = 20;

  usZColsToGo = usZStartCols;

  pZArray = pZInfo->pbZChange;

  if (LeftSkip >= pZInfo->ubFirstZStripWidth) {
    // Index into array after doing left clipping
    usZStartIndex = 1 + ((LeftSkip - pZInfo->ubFirstZStripWidth) / 20);

    // calculates the Z-value after left-side clipping
    if (usZStartIndex) {
      for (usCount = 0; usCount < usZStartIndex; usCount++) {
        switch (pZArray[usCount]) {
          case -1:
            usZStartLevel -= Z_STRIP_DELTA_Y;
            break;
          case 0: // no change
            break;
          case 1:
            usZStartLevel += Z_STRIP_DELTA_Y;
            break;
        }
      }
    }
  } else
    usZStartIndex = 0;

  usZLevel = usZStartLevel;
  usZIndex = usZStartIndex;

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    // Skips the number of lines clipped at the top
    TopSkipLoop:

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:

    xor uiLineFlag, 1
    dec TopSkip
    jnz TopSkipLoop

    // Start of line loop

    // Skips the pixels hanging outside the left-side boundry
    LeftSkipSetup:

    mov Unblitted, 0 // Unblitted counts any pixels left from a run
    mov eax, LeftSkip // after we have skipped enough left-side pixels
    mov LSCount, eax // LSCount counts how many pixels skipped so far
    or eax, eax
    jz BlitLineSetup // check for nothing to skip

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNTL1 // *** jumps into non-transparent blit loop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitTransparent // *** jumps into transparent blit loop

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    //-------------------------------------------------
    // setup for beginning of line

    BlitLineSetup:
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz RSLoop2

    //--------------------------------
    // blitting non-transparent pixels

    and ecx, 07fH

    BlitNTL1:
    mov ax, [ebx] // check z-level of pixel
    cmp ax, usZLevel
    jae BlitPixellate1
    jmp BlitPixel1

    BlitPixellate1:

    // OK, DO PIXELLATE SCHEME HERE!
    test uiLineFlag, 1
    jz BlitSkip1

    test edi, 2
    jz BlitNTL2
    jmp BlitPixel1

    BlitSkip1:
    test edi, 2
    jnz BlitNTL2

    BlitPixel1:

    mov ax, usZLevel // update z-level of pixel
    mov [ebx], ax

    xor eax, eax
    mov al, [esi] // copy pixel
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2

    dec usZColsToGo
    jnz BlitNTL6

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitNTL5 // dir = 0 no change
    js BlitNTL4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_STRIP_DELTA_Y
    jmp BlitNTL5

    BlitNTL4:
    sub dx, Z_STRIP_DELTA_Y

    BlitNTL5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitNTL6:
    dec LSCount // decrement pixel length to blit
    jz RightSkipLoop // done blitting the visible line

    dec ecx
    jnz BlitNTL1 // continue current run

    jmp BlitDispatch // done current run, go for another

    //----------------------------
    // skipping transparent pixels

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH

    BlitTrans2:

    add edi, 2 // move up the destination pointer
    add ebx, 2

    dec usZColsToGo
    jnz BlitTrans1

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitTrans5 // dir = 0 no change
    js BlitTrans4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_STRIP_DELTA_Y
    jmp BlitTrans5

    BlitTrans4:
    sub dx, Z_STRIP_DELTA_Y

    BlitTrans5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitTrans1:

    dec LSCount // decrement the pixels to blit
    jz RightSkipLoop // done the line

    dec ecx
    jnz BlitTrans2

    jmp BlitDispatch

    //---------------------------------------------
    // Scans the ETRLE until it finds an EOL marker

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    RSLoop2:

    xor uiLineFlag, 1
    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    // reset all the z-level stuff for a new line

    mov ax, usZStartLevel
    mov usZLevel, ax
    mov ax, usZStartIndex
    mov usZIndex, ax
    mov ax, usZStartCols
    mov usZColsToGo, ax

    jmp LeftSkipSetup

    BlitDone:
  }

  return TRUE;
}

// Blitter Specs
// 1 ) 8 to 16 bpp
// 2 ) strip z-blitter
// 3 ) clipped
// 4 ) trans shadow - if value is 254, makes a shadow
//
function Blt8BPPDataTo16BPPBufferTransZTransShadowIncObscureClip(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: Pointer<SGPRect>, sZIndex: INT16, p16BPPPalette: Pointer<UINT16>): BOOLEAN {
  let uiOffset: UINT32;
  let uiLineFlag: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let usZLevel: UINT16;
  let usZStartLevel: UINT16;
  let usZColsToGo: UINT16;
  let usZStartIndex: UINT16;
  let usCount: UINT16;
  let usZIndex: UINT16;
  let usZStartCols: UINT16;
  let pZArray: Pointer<INT8>;
  let pZInfo: Pointer<ZStripInfo>;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  if (clipregion == NULL) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion->iLeft;
    ClipY1 = clipregion->iTop;
    ClipX2 = clipregion->iRight;
    ClipY2 = clipregion->iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = __min(ClipX1 - min(ClipX1, iTempX), usWidth);
  RightSkip = __min(max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = __min(ClipY1 - __min(ClipY1, iTempY), usHeight);
  BottomSkip = __min(__max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  uiLineFlag = (iTempY & 1);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return TRUE;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return TRUE;

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  if (hSrcVObject->ppZStripInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }
  // setup for the z-column blitting stuff
  pZInfo = hSrcVObject->ppZStripInfo[sZIndex];
  if (pZInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }

  usZStartLevel = (usZValue + (pZInfo->bInitialZChange * Z_SUBLAYERS * 10));

  if (LeftSkip > pZInfo->ubFirstZStripWidth) {
    usZStartCols = (LeftSkip - pZInfo->ubFirstZStripWidth);
    usZStartCols = 20 - (usZStartCols % 20);
  } else if (LeftSkip < pZInfo->ubFirstZStripWidth)
    usZStartCols = (pZInfo->ubFirstZStripWidth - LeftSkip);
  else
    usZStartCols = 20;

  // set to odd number of pixels for first column
  usZColsToGo = usZStartCols;

  pZArray = pZInfo->pbZChange;

  if (LeftSkip >= usZColsToGo) {
    // Index into array after doing left clipping
    usZStartIndex = 1 + ((LeftSkip - pZInfo->ubFirstZStripWidth) / 20);

    // calculates the Z-value after left-side clipping
    if (usZStartIndex) {
      for (usCount = 0; usCount < usZStartIndex; usCount++) {
        switch (pZArray[usCount]) {
          case -1:
            usZStartLevel -= Z_SUBLAYERS;
            break;
          case 0: // no change
            break;
          case 1:
            usZStartLevel += Z_SUBLAYERS;
            break;
        }
      }
    }
  } else
    usZStartIndex = 0;

  usZLevel = usZStartLevel;
  usZIndex = usZStartIndex;

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    // Skips the number of lines clipped at the top
    TopSkipLoop:

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:

    xor uiLineFlag, 1
    dec TopSkip
    jnz TopSkipLoop

    // Start of line loop

    // Skips the pixels hanging outside the left-side boundry
    LeftSkipSetup:

    mov Unblitted, 0 // Unblitted counts any pixels left from a run
    mov eax, LeftSkip // after we have skipped enough left-side pixels
    mov LSCount, eax // LSCount counts how many pixels skipped so far
    or eax, eax
    jz BlitLineSetup // check for nothing to skip

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNTL1 // *** jumps into non-transparent blit loop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax

    mov Unblitted, 0
    jmp BlitTransparent // *** jumps into transparent blit loop

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    //-------------------------------------------------
    // setup for beginning of line

    BlitLineSetup:
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz RSLoop2

    //--------------------------------
    // blitting non-transparent pixels

    and ecx, 07fH

    BlitNTL1:
    mov ax, [ebx] // check z-level of pixel
    cmp ax, usZLevel
    jae BlitPixellate1
    jmp BlitPixel1

    BlitPixellate1:

    // OK, DO PIXELLATE SCHEME HERE!
    test uiLineFlag, 1
    jz BlitSkip1

    test edi, 2
    jz BlitNTL2
    jmp BlitPixel1

    BlitSkip1:
    test edi, 2
    jnz BlitNTL2

    BlitPixel1:

    mov ax, usZLevel // update z-level of pixel
    mov [ebx], ax

    // Check for shadow...
    xor eax, eax
    mov al, [esi]
    cmp al, 254
    jne BlitNTL66

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL2

    BlitNTL66:

    mov ax, [edx+eax*2] // Copy pixel
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2

    dec usZColsToGo
    jnz BlitNTL6

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitNTL5 // dir = 0 no change
    js BlitNTL4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_SUBLAYERS
    jmp BlitNTL5

    BlitNTL4:
    sub dx, Z_SUBLAYERS

    BlitNTL5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitNTL6:
    dec LSCount // decrement pixel length to blit
    jz RightSkipLoop // done blitting the visible line

    dec ecx
    jnz BlitNTL1 // continue current run

    jmp BlitDispatch // done current run, go for another

    //----------------------------
    // skipping transparent pixels

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH

    BlitTrans2:

    add edi, 2 // move up the destination pointer
    add ebx, 2

    dec usZColsToGo
    jnz BlitTrans1

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitTrans5 // dir = 0 no change
    js BlitTrans4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_SUBLAYERS
    jmp BlitTrans5

    BlitTrans4:
    sub dx, Z_SUBLAYERS

    BlitTrans5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitTrans1:

    dec LSCount // decrement the pixels to blit
    jz RightSkipLoop // done the line

    dec ecx
    jnz BlitTrans2

    jmp BlitDispatch

    //---------------------------------------------
    // Scans the ETRLE until it finds an EOL marker

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    RSLoop2:

    xor uiLineFlag, 1
    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    // reset all the z-level stuff for a new line

    mov ax, usZStartLevel
    mov usZLevel, ax
    mov ax, usZStartIndex
    mov usZIndex, ax
    mov ax, usZStartCols
    mov usZColsToGo, ax

    jmp LeftSkipSetup

    BlitDone:
  }

  return TRUE;
}

function CorrectRenderCenter(sRenderX: INT16, sRenderY: INT16, pSNewX: Pointer<INT16>, pSNewY: Pointer<INT16>): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sNumXSteps: INT16;
  let sNumYSteps: INT16;

  // Use radar scale values to get screen values, then convert ot map values, rounding to nearest middle tile
  sScreenX = sRenderX;
  sScreenY = sRenderY;

  // Adjust for offsets!
  sScreenX += 0;
  sScreenY += 10;

  // Adjust to viewport start!
  sScreenX -= ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
  sScreenY -= ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

  // Make sure these coordinates are multiples of scroll steps
  sNumXSteps = sScreenX / gubNewScrollXSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];
  sNumYSteps = sScreenY / gubNewScrollYSpeeds[gfDoVideoScroll][gubCurScrollSpeedID];

  sScreenX = (sNumXSteps * gubNewScrollXSpeeds[gfDoVideoScroll][gubCurScrollSpeedID]);
  sScreenY = (sNumYSteps * gubNewScrollYSpeeds[gfDoVideoScroll][gubCurScrollSpeedID]);

  // Adjust back
  sScreenX += ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
  sScreenY += ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

  *pSNewX = sScreenX;
  *pSNewY = sScreenY;
}

// Blitter Specs
// 1 ) 8 to 16 bpp
// 2 ) strip z-blitter
// 3 ) clipped
// 4 ) trans shadow - if value is 254, makes a shadow
//
function Blt8BPPDataTo16BPPBufferTransZTransShadowIncClip(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16, clipregion: Pointer<SGPRect>, sZIndex: INT16, p16BPPPalette: Pointer<UINT16>): BOOLEAN {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let Unblitted: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;
  let LeftSkip: INT32;
  let RightSkip: INT32;
  let TopSkip: INT32;
  let BottomSkip: INT32;
  let BlitLength: INT32;
  let BlitHeight: INT32;
  let LSCount: INT32;
  let ClipX1: INT32;
  let ClipY1: INT32;
  let ClipX2: INT32;
  let ClipY2: INT32;
  let usZLevel: UINT16;
  let usZStartLevel: UINT16;
  let usZColsToGo: UINT16;
  let usZStartIndex: UINT16;
  let usCount: UINT16;
  let usZIndex: UINT16;
  let usZStartCols: UINT16;
  let pZArray: Pointer<INT8>;
  let pZInfo: Pointer<ZStripInfo>;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  if (clipregion == NULL) {
    ClipX1 = ClippingRect.iLeft;
    ClipY1 = ClippingRect.iTop;
    ClipX2 = ClippingRect.iRight;
    ClipY2 = ClippingRect.iBottom;
  } else {
    ClipX1 = clipregion->iLeft;
    ClipY1 = clipregion->iTop;
    ClipX2 = clipregion->iRight;
    ClipY2 = clipregion->iBottom;
  }

  // Calculate rows hanging off each side of the screen
  LeftSkip = __min(ClipX1 - min(ClipX1, iTempX), usWidth);
  RightSkip = __min(max(ClipX2, (iTempX + usWidth)) - ClipX2, usWidth);
  TopSkip = __min(ClipY1 - __min(ClipY1, iTempY), usHeight);
  BottomSkip = __min(__max(ClipY2, (iTempY + usHeight)) - ClipY2, usHeight);

  // calculate the remaining rows and columns to blit
  BlitLength = (usWidth - LeftSkip - RightSkip);
  BlitHeight = (usHeight - TopSkip - BottomSkip);

  // check if whole thing is clipped
  if ((LeftSkip >= usWidth) || (RightSkip >= usWidth))
    return TRUE;

  // check if whole thing is clipped
  if ((TopSkip >= usHeight) || (BottomSkip >= usHeight))
    return TRUE;

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * (iTempY + TopSkip)) + ((iTempX + LeftSkip) * 2);
  LineSkip = (uiDestPitchBYTES - (BlitLength * 2));

  if (hSrcVObject->ppZStripInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }
  // setup for the z-column blitting stuff
  pZInfo = hSrcVObject->ppZStripInfo[sZIndex];
  if (pZInfo == NULL) {
    DebugMsg(TOPIC_VIDEOOBJECT, DBG_LEVEL_0, String("Missing Z-Strip info on multi-Z object"));
    return FALSE;
  }

  usZStartLevel = (usZValue + (pZInfo->bInitialZChange * Z_SUBLAYERS * 10));

  if (LeftSkip > pZInfo->ubFirstZStripWidth) {
    usZStartCols = (LeftSkip - pZInfo->ubFirstZStripWidth);
    usZStartCols = 20 - (usZStartCols % 20);
  } else if (LeftSkip < pZInfo->ubFirstZStripWidth)
    usZStartCols = (pZInfo->ubFirstZStripWidth - LeftSkip);
  else
    usZStartCols = 20;

  // set to odd number of pixels for first column
  usZColsToGo = usZStartCols;

  pZArray = pZInfo->pbZChange;

  if (LeftSkip >= usZColsToGo) {
    // Index into array after doing left clipping
    usZStartIndex = 1 + ((LeftSkip - pZInfo->ubFirstZStripWidth) / 20);

    // calculates the Z-value after left-side clipping
    if (usZStartIndex) {
      for (usCount = 0; usCount < usZStartIndex; usCount++) {
        switch (pZArray[usCount]) {
          case -1:
            usZStartLevel -= Z_SUBLAYERS;
            break;
          case 0: // no change
            break;
          case 1:
            usZStartLevel += Z_SUBLAYERS;
            break;
        }
      }
    }
  } else
    usZStartIndex = 0;

  usZLevel = usZStartLevel;
  usZIndex = usZStartIndex;

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    cmp TopSkip, 0 // check for nothing clipped on top
    je LeftSkipSetup

    // Skips the number of lines clipped at the top
    TopSkipLoop:

    mov cl, [esi]
    inc esi
    or cl, cl
    js TopSkipLoop
    jz TSEndLine

    add esi, ecx
    jmp TopSkipLoop

    TSEndLine:
    dec TopSkip
    jnz TopSkipLoop

    // Start of line loop

    // Skips the pixels hanging outside the left-side boundry
    LeftSkipSetup:

    mov Unblitted, 0 // Unblitted counts any pixels left from a run
    mov eax, LeftSkip // after we have skipped enough left-side pixels
    mov LSCount, eax // LSCount counts how many pixels skipped so far
    or eax, eax
    jz BlitLineSetup // check for nothing to skip

    LeftSkipLoop:

    mov cl, [esi]
    inc esi

    or cl, cl
    js LSTrans

    cmp ecx, LSCount
    je LSSkip2 // if equal, skip whole, and start blit with new run
    jb LSSkip1 // if less, skip whole thing

    add esi, LSCount // skip partial run, jump into normal loop for rest
    sub ecx, LSCount
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0
    jmp BlitNTL1 // *** jumps into non-transparent blit loop

    LSSkip2:
    add esi, ecx // skip whole run, and start blit with new run
    jmp BlitLineSetup

    LSSkip1:
    add esi, ecx // skip whole run, continue skipping
    sub LSCount, ecx
    jmp LeftSkipLoop

    LSTrans:
    and ecx, 07fH
    cmp ecx, LSCount
    je BlitLineSetup // if equal, skip whole, and start blit with new run
    jb LSTrans1 // if less, skip whole thing

    sub ecx, LSCount // skip partial run, jump into normal loop for rest
    mov eax, BlitLength
    mov LSCount, eax

    mov Unblitted, 0
    jmp BlitTransparent // *** jumps into transparent blit loop

    LSTrans1:
    sub LSCount, ecx // skip whole run, continue skipping
    jmp LeftSkipLoop

    //-------------------------------------------------
    // setup for beginning of line

    BlitLineSetup:
    mov eax, BlitLength
    mov LSCount, eax
    mov Unblitted, 0

    BlitDispatch:

    cmp LSCount, 0 // Check to see if we're done blitting
    je RightSkipLoop

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz RSLoop2

    //--------------------------------
    // blitting non-transparent pixels

    and ecx, 07fH

    BlitNTL1:
    mov ax, [ebx] // check z-level of pixel
    cmp ax, usZLevel
    ja BlitNTL2

    mov ax, usZLevel // update z-level of pixel
    mov [ebx], ax

    // Check for shadow...
    xor eax, eax
    mov al, [esi]
    cmp al, 254
    jne BlitNTL66

    mov ax, [edi]
    mov ax, ShadeTable[eax*2]
    mov [edi], ax
    jmp BlitNTL2

    BlitNTL66:

    mov ax, [edx+eax*2] // Copy pixel
    mov [edi], ax

    BlitNTL2:
    inc esi
    add edi, 2
    add ebx, 2

    dec usZColsToGo
    jnz BlitNTL6

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitNTL5 // dir = 0 no change
    js BlitNTL4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_SUBLAYERS
    jmp BlitNTL5

    BlitNTL4:
    sub dx, Z_SUBLAYERS

    BlitNTL5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitNTL6:
    dec LSCount // decrement pixel length to blit
    jz RightSkipLoop // done blitting the visible line

    dec ecx
    jnz BlitNTL1 // continue current run

    jmp BlitDispatch // done current run, go for another

    //----------------------------
    // skipping transparent pixels

    BlitTransparent: // skip transparent pixels

    and ecx, 07fH

    BlitTrans2:

    add edi, 2 // move up the destination pointer
    add ebx, 2

    dec usZColsToGo
    jnz BlitTrans1

    // update the z-level according to the z-table

    push edx
    mov edx, pZArray // get pointer to array
    xor eax, eax
    mov ax, usZIndex // pick up the current array index
    add edx, eax
    inc eax // increment it
    mov usZIndex, ax // store incremented value

    mov al, [edx] // get direction instruction
    mov dx, usZLevel // get current z-level

    or al, al
    jz BlitTrans5 // dir = 0 no change
    js BlitTrans4 // dir < 0 z-level down
    // dir > 0 z-level up (default)
    add dx, Z_SUBLAYERS
    jmp BlitTrans5

    BlitTrans4:
    sub dx, Z_SUBLAYERS

    BlitTrans5:
    mov usZLevel, dx // store the now-modified z-level
    mov usZColsToGo, 20 // reset the next z-level change to 20 cols
    pop edx

    BlitTrans1:

    dec LSCount // decrement the pixels to blit
    jz RightSkipLoop // done the line

    dec ecx
    jnz BlitTrans2

    jmp BlitDispatch

    //---------------------------------------------
    // Scans the ETRLE until it finds an EOL marker

    RightSkipLoop:

    RSLoop1:
    mov al, [esi]
    inc esi
    or al, al
    jnz RSLoop1

    RSLoop2:

    dec BlitHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip

    // reset all the z-level stuff for a new line

    mov ax, usZStartLevel
    mov usZLevel, ax
    mov ax, usZStartIndex
    mov usZIndex, ax
    mov ax, usZStartCols
    mov usZColsToGo, ax

    jmp LeftSkipSetup

    BlitDone:
  }

  return TRUE;
}

function RenderRoomInfo(sStartPointX_M: INT16, sStartPointY_M: INT16, sStartPointX_S: INT16, sStartPointY_S: INT16, sEndXS: INT16, sEndYS: INT16): void {
  let bXOddFlag: INT8 = 0;
  let sAnchorPosX_M: INT16;
  let sAnchorPosY_M: INT16;
  let sAnchorPosX_S: INT16;
  let sAnchorPosY_S: INT16;
  let sTempPosX_M: INT16;
  let sTempPosY_M: INT16;
  let sTempPosX_S: INT16;
  let sTempPosY_S: INT16;
  let fEndRenderRow: BOOLEAN = FALSE;
  let fEndRenderCol: BOOLEAN = FALSE;
  let usTileIndex: UINT16;
  let sX: INT16;
  let sY: INT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;

  // Begin Render Loop
  sAnchorPosX_M = sStartPointX_M;
  sAnchorPosY_M = sStartPointY_M;
  sAnchorPosX_S = sStartPointX_S;
  sAnchorPosY_S = sStartPointY_S;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

  do {
    fEndRenderRow = FALSE;
    sTempPosX_M = sAnchorPosX_M;
    sTempPosY_M = sAnchorPosY_M;
    sTempPosX_S = sAnchorPosX_S;
    sTempPosY_S = sAnchorPosY_S;

    if (bXOddFlag > 0)
      sTempPosX_S += 20;

    do {
      usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

      if (usTileIndex < GRIDSIZE) {
        sX = sTempPosX_S + (WORLD_TILE_X / 2) - 5;
        sY = sTempPosY_S + (WORLD_TILE_Y / 2) - 5;

        // THIS ROOM STUFF IS ONLY DONE IN THE EDITOR...
        // ADJUST BY SHEIGHT
        sY -= gpWorldLevelData[usTileIndex].sHeight;
        // sY += gsRenderHeight;

        if (gubWorldRoomInfo[usTileIndex] != NO_ROOM) {
          SetFont(SMALLCOMPFONT);
          SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, gsVIEWPORT_END_Y, FALSE);
          switch (gubWorldRoomInfo[usTileIndex] % 5) {
            case 0:
              SetFontForeground(FONT_GRAY3);
              break;
            case 1:
              SetFontForeground(FONT_YELLOW);
              break;
            case 2:
              SetFontForeground(FONT_LTRED);
              break;
            case 3:
              SetFontForeground(FONT_LTBLUE);
              break;
            case 4:
              SetFontForeground(FONT_LTGREEN);
              break;
          }
          mprintf_buffer(pDestBuf, uiDestPitchBYTES, TINYFONT1, sX, sY, L"%d", gubWorldRoomInfo[usTileIndex]);
          SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);
        }
      }

      sTempPosX_S += 40;
      sTempPosX_M++;
      sTempPosY_M--;

      if (sTempPosX_S >= sEndXS) {
        fEndRenderRow = TRUE;
      }
    } while (!fEndRenderRow);

    if (bXOddFlag > 0) {
      sAnchorPosY_M++;
    } else {
      sAnchorPosX_M++;
    }

    bXOddFlag = !bXOddFlag;
    sAnchorPosY_S += 10;

    if (sAnchorPosY_S >= sEndYS) {
      fEndRenderCol = TRUE;
    }
  } while (!fEndRenderCol);

  UnLockVideoSurface(FRAME_BUFFER);
}

function ExamineZBufferRect(sLeft: INT16, sTop: INT16, sRight: INT16, sBottom: INT16): void {
  CalcRenderParameters(sLeft, sTop, sRight, sBottom);

  ExamineZBufferForHiddenTiles(gsStartPointX_M, gsStartPointY_M, gsStartPointX_S, gsStartPointY_S, gsEndXS, gsEndYS);
}

function ExamineZBufferForHiddenTiles(sStartPointX_M: INT16, sStartPointY_M: INT16, sStartPointX_S: INT16, sStartPointY_S: INT16, sEndXS: INT16, sEndYS: INT16): void {
  let bXOddFlag: INT8 = 0;
  let sAnchorPosX_M: INT16;
  let sAnchorPosY_M: INT16;
  let sAnchorPosX_S: INT16;
  let sAnchorPosY_S: INT16;
  let sTempPosX_M: INT16;
  let sTempPosY_M: INT16;
  let sTempPosX_S: INT16;
  let sTempPosY_S: INT16;
  let fEndRenderRow: BOOLEAN = FALSE;
  let fEndRenderCol: BOOLEAN = FALSE;
  let usTileIndex: UINT16;
  let sX: INT16;
  let sY: INT16;
  let sWorldX: INT16;
  let sZLevel: INT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let TileElem: Pointer<TILE_ELEMENT>;
  let bBlitClipVal: INT8;
  let pObject: Pointer<LEVELNODE>;

  // Begin Render Loop
  sAnchorPosX_M = sStartPointX_M;
  sAnchorPosY_M = sStartPointY_M;
  sAnchorPosX_S = sStartPointX_S;
  sAnchorPosY_S = sStartPointY_S;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

  // Get VObject for firt land peice!
  TileElem = &(gTileDatabase[FIRSTTEXTURE1]);

  do {
    fEndRenderRow = FALSE;
    sTempPosX_M = sAnchorPosX_M;
    sTempPosY_M = sAnchorPosY_M;
    sTempPosX_S = sAnchorPosX_S;
    sTempPosY_S = sAnchorPosY_S;

    if (bXOddFlag > 0)
      sTempPosX_S += 20;

    do {
      usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

      if (usTileIndex < GRIDSIZE) {
        // ATE: Don;t let any vehicle sit here....
        if (FindStructure(usTileIndex, (STRUCTURE_MOBILE))) {
          // Continue...
          goto ENDOFLOOP;
        }

        sX = sTempPosX_S;
        sY = sTempPosY_S - gpWorldLevelData[usTileIndex].sHeight;

        // Adjust for interface level
        sY += gsRenderHeight;

        // Caluluate zvalue
        // Look for anything less than struct layer!
        GetWorldXYAbsoluteScreenXY(sTempPosX_M, sTempPosY_M, &sWorldX, &sZLevel);

        sZLevel += gsRenderHeight;

        sZLevel = (sZLevel * Z_SUBLAYERS) + STRUCT_Z_LEVEL;

        if (gpWorldLevelData[usTileIndex].uiFlags & MAPELEMENT_REEVALUATE_REDUNDENCY) {
          bBlitClipVal = BltIsClippedOrOffScreen(TileElem->hTileSurface, sX, sY, TileElem->usRegionIndex, &gClippingRect);

          if (bBlitClipVal == FALSE) {
            // Set flag to not evaluate again!
            gpWorldLevelData[usTileIndex].uiFlags &= (~MAPELEMENT_REEVALUATE_REDUNDENCY);

            // OK, first do some rules with exceptions
            // Don't let this happen for roads!
            pObject = gpWorldLevelData[usTileIndex].pObjectHead;

            if (IsTileRedundent(gpZBuffer, sZLevel, TileElem->hTileSurface, sX, sY, TileElem->usRegionIndex)) {
              // Mark in the world!
              gpWorldLevelData[usTileIndex].uiFlags |= MAPELEMENT_REDUNDENT;
            } else {
              // Un Mark in the world!
              gpWorldLevelData[usTileIndex].uiFlags &= (~MAPELEMENT_REDUNDENT);
            }
          }
        }
      }

    ENDOFLOOP:

      sTempPosX_S += 40;
      sTempPosX_M++;
      sTempPosY_M--;

      if (sTempPosX_S >= sEndXS) {
        fEndRenderRow = TRUE;
      }
    } while (!fEndRenderRow);

    if (bXOddFlag > 0) {
      sAnchorPosY_M++;
    } else {
      sAnchorPosX_M++;
    }

    bXOddFlag = !bXOddFlag;
    sAnchorPosY_S += 10;

    if (sAnchorPosY_S >= sEndYS) {
      fEndRenderCol = TRUE;
    }
  } while (!fEndRenderCol);

  UnLockVideoSurface(FRAME_BUFFER);
}

function CalcRenderParameters(sLeft: INT16, sTop: INT16, sRight: INT16, sBottom: INT16): void {
  let sTempPosX_W: INT16;
  let sTempPosY_W: INT16;
  let sRenderCenterX_W: INT16;
  let sRenderCenterY_W: INT16;
  let sOffsetX_W: INT16;
  let sOffsetY_W: INT16;
  let sOffsetX_S: INT16;
  let sOffsetY_S: INT16;

  gOldClipRect = gClippingRect;

  // Set new clipped rect
  gClippingRect.iLeft = __max(gsVIEWPORT_START_X, sLeft);
  gClippingRect.iRight = __min(gsVIEWPORT_END_X, sRight);
  gClippingRect.iTop = __max(gsVIEWPORT_WINDOW_START_Y, sTop);
  gClippingRect.iBottom = __min(gsVIEWPORT_WINDOW_END_Y, sBottom);

  gsEndXS = sRight + VIEWPORT_XOFFSET_S;
  gsEndYS = sBottom + VIEWPORT_YOFFSET_S;

  sRenderCenterX_W = gsRenderCenterX;
  sRenderCenterY_W = gsRenderCenterY;

  // STEP THREE - determine starting point in world coords
  // a) Determine where in screen coords to start rendering
  gsStartPointX_S = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) - (sLeft - VIEWPORT_XOFFSET_S);
  gsStartPointY_S = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) - (sTop - VIEWPORT_YOFFSET_S);

  // b) Convert these distances into world distances
  FromScreenToCellCoordinates(gsStartPointX_S, gsStartPointY_S, &sTempPosX_W, &sTempPosY_W);

  // c) World start point is Render center minus this distance
  gsStartPointX_W = sRenderCenterX_W - sTempPosX_W;
  gsStartPointY_W = sRenderCenterY_W - sTempPosY_W;

  // NOTE: Increase X map value by 1 tile to offset where on screen we are...
  if (gsStartPointX_W > 0)
    gsStartPointX_W += CELL_X_SIZE;

  // d) screen start point is screen distances minus screen center
  gsStartPointX_S = sLeft - VIEWPORT_XOFFSET_S;
  gsStartPointY_S = sTop - VIEWPORT_YOFFSET_S;

  // STEP FOUR - Determine Start block
  // a) Find start block
  gsStartPointX_M = (gsStartPointX_W) / CELL_X_SIZE;
  gsStartPointY_M = (gsStartPointY_W) / CELL_Y_SIZE;

  // STEP 5 - Determine Deltas for center and find screen values
  // Make sure these coordinates are multiples of scroll steps
  sOffsetX_W = abs(gsStartPointX_W) - (abs((gsStartPointX_M * CELL_X_SIZE)));
  sOffsetY_W = abs(gsStartPointY_W) - (abs((gsStartPointY_M * CELL_Y_SIZE)));

  FromCellToScreenCoordinates(sOffsetX_W, sOffsetY_W, &sOffsetX_S, &sOffsetY_S);

  if (gsStartPointY_W < 0) {
    gsStartPointY_S += 0; //(sOffsetY_S/2);
  } else {
    gsStartPointY_S -= sOffsetY_S;
  }
  gsStartPointX_S -= sOffsetX_S;

  // Set globals for render offset
  if (gsRenderWorldOffsetX == -1) {
    gsRenderWorldOffsetX = sOffsetX_S;
  }

  if (gsRenderWorldOffsetY == -1) {
    gsRenderWorldOffsetY = sOffsetY_S;
  }

  /////////////////////////////////////////
  // ATE: CALCULATE LARGER OFFSET VALUES
  gsLEndXS = sRight + LARGER_VIEWPORT_XOFFSET_S;
  gsLEndYS = sBottom + LARGER_VIEWPORT_YOFFSET_S;

  // STEP THREE - determine starting point in world coords
  // a) Determine where in screen coords to start rendering
  gsLStartPointX_S = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) - (sLeft - LARGER_VIEWPORT_XOFFSET_S);
  gsLStartPointY_S = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) - (sTop - LARGER_VIEWPORT_YOFFSET_S);

  // b) Convert these distances into world distances
  FromScreenToCellCoordinates(gsLStartPointX_S, gsLStartPointY_S, &sTempPosX_W, &sTempPosY_W);

  // c) World start point is Render center minus this distance
  gsLStartPointX_W = sRenderCenterX_W - sTempPosX_W;
  gsLStartPointY_W = sRenderCenterY_W - sTempPosY_W;

  // NOTE: Increase X map value by 1 tile to offset where on screen we are...
  if (gsLStartPointX_W > 0)
    gsLStartPointX_W += CELL_X_SIZE;

  // d) screen start point is screen distances minus screen center
  gsLStartPointX_S = sLeft - LARGER_VIEWPORT_XOFFSET_S;
  gsLStartPointY_S = sTop - LARGER_VIEWPORT_YOFFSET_S;

  // STEP FOUR - Determine Start block
  // a) Find start block
  gsLStartPointX_M = (gsLStartPointX_W) / CELL_X_SIZE;
  gsLStartPointY_M = (gsLStartPointY_W) / CELL_Y_SIZE;

  // Adjust starting screen coordinates
  gsLStartPointX_S -= sOffsetX_S;

  if (gsLStartPointY_W < 0) {
    gsLStartPointY_S += 0;
    gsLStartPointX_S -= 20;
  } else {
    gsLStartPointY_S -= sOffsetY_S;
  }
}

function ResetRenderParameters(): void {
  // Restore clipping rect
  gClippingRect = gOldClipRect;
}

function Zero8BPPDataTo16BPPBufferTransparent(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16): BOOLEAN {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  // Validations
  CHECKF(iTempX >= 0);
  CHECKF(iTempY >= 0);

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    clc
    rcr cl, 1
    jnc BlitNTL2

    mov [edi], ax

    inc esi
    add edi, 2

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    mov [edi], ax

    mov [edi+2], ax

    add esi, 2
    add edi, 4

    BlitNTL3:

    or cl, cl
    jz BlitDispatch

    xor ebx, ebx

    BlitNTL4:

    mov [edi], ax

    mov [edi+2], ax

    mov [edi+4], ax

    mov [edi+6], ax

    add esi, 4
    add edi, 8
    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    jmp BlitDispatch

    BlitDone:
  }

  return TRUE;
}

function Blt8BPPDataTo16BPPBufferTransInvZ(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16): BOOLEAN {
  let p16BPPPalette: Pointer<UINT16>;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let DestPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;

  // Assertions
  Assert(hSrcVObject != NULL);
  Assert(pBuffer != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  // Validations
  CHECKF(iTempX >= 0);
  CHECKF(iTempY >= 0);

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  DestPtr = pBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  ZPtr = pZBuffer + (uiDestPitchBYTES * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject->pShadeCurrent;
  LineSkip = (uiDestPitchBYTES - (usWidth * 2));

  __asm {
    mov esi, SrcPtr
    mov edi, DestPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    xor eax, eax

    BlitNTL4:

    mov ax, usZValue
    cmp ax, [ebx]
    jne BlitNTL5

    // mov [ebx], ax

    xor ah, ah
    mov al, [esi]
    mov ax, [edx+eax*2]
    mov [edi], ax

    BlitNTL5:
    inc esi
    inc edi
    inc ebx
    inc edi
    inc ebx

    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add edi, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add edi, LineSkip
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  }

  return TRUE;
}

function IsTileRedundent(pZBuffer: Pointer<UINT16>, usZValue: UINT16, hSrcVObject: HVOBJECT, iX: INT32, iY: INT32, usIndex: UINT16): BOOLEAN {
  let p16BPPPalette: Pointer<UINT16>;
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let ZPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let iTempX: INT32;
  let iTempY: INT32;
  let fHidden: BOOLEAN = TRUE;

  // Assertions
  Assert(hSrcVObject != NULL);

  // Get Offsets from Index into structure
  pTrav = &(hSrcVObject->pETRLEObject[usIndex]);
  usHeight = pTrav->usHeight;
  usWidth = pTrav->usWidth;
  uiOffset = pTrav->uiDataOffset;

  // Add to start position of dest buffer
  iTempX = iX + pTrav->sOffsetX;
  iTempY = iY + pTrav->sOffsetY;

  // Validations
  CHECKF(iTempX >= 0);
  CHECKF(iTempY >= 0);

  SrcPtr = hSrcVObject->pPixData + uiOffset;
  ZPtr = pZBuffer + (1280 * iTempY) + (iTempX * 2);
  p16BPPPalette = hSrcVObject->pShadeCurrent;
  LineSkip = (1280 - (usWidth * 2));

  __asm {
    mov esi, SrcPtr
    mov edx, p16BPPPalette
    xor eax, eax
    mov ebx, ZPtr
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    xor eax, eax

    BlitNTL4:

    mov ax, usZValue
    cmp ax, [ebx]
    jle BlitNTL5

    // Set false, flag
    mov fHidden, 0
    jmp BlitDone

    BlitNTL5:
    inc esi
    inc ebx
    inc ebx

    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add ecx, ecx
    add ebx, ecx
    jmp BlitDispatch

    BlitDoneLine:

    dec usHeight
    jz BlitDone
    add ebx, LineSkip
    jmp BlitDispatch

    BlitDone:
  }

  return fHidden;
}

function SetMercGlowFast(): void {
  // gpGlowFramePointer	= gsFastGlowFrames;
}

function SetMercGlowNormal(): void {
  gpGlowFramePointer = gsGlowFrames;
}

function SetRenderCenter(sNewX: INT16, sNewY: INT16): void {
  if (gfIgnoreScrolling == 1) {
    return;
  }

  // Apply these new coordinates to the renderer!
  ApplyScrolling(sNewX, sNewY, TRUE, FALSE);

  // Set flag to ignore scrolling this frame
  gfIgnoreScrollDueToCenterAdjust = TRUE;

  // Set full render flag!
  // DIRTY THE WORLD!
  SetRenderFlags(RENDER_FLAG_FULL);

  gfPlotNewMovement = TRUE;

  if (gfScrollPending == TRUE) {
    // Do a complete rebuild!
    gfScrollPending = FALSE;

    // Restore Interface!
    RestoreInterface();

    // Delete Topmost blitters saved areas
    DeleteVideoOverlaysArea();
  }

  gfScrollInertia = FALSE;
}
