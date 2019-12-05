namespace ja2 {

// zoom x and y coords for map scrolling
export let iZoomX: INT32 = 0;
export let iZoomY: INT32 = 0;

// Scroll region width
const SCROLL_REGION = 4;

// The Map/Mouse Scroll defines
const EAST_DIR = 0;
const WEST_DIR = 1;
const NORTH_DIR = 2;
const SOUTH_DIR = 3;
const TOP_NORTH = 2;
const TOP_SOUTH = 13;
const RIGHT_WEST = 250;
const RIGHT_EAST = 260;
const LEFT_EAST = 640;
const LEFT_WEST = 630;
const BOTTOM_NORTH = 320;
const BOTTOM_SOUTH = 330;

// Map Scroll Defines
const SCROLL_EAST = 0;
const SCROLL_WEST = 1;
const SCROLL_NORTH = 2;
const SCROLL_SOUTH = 3;
const SCROLL_DELAY = 50;
const HORT_SCROLL = 14;
const VERT_SCROLL = 10;

// the pop up for helicopter stuff
const MAP_HELICOPTER_ETA_POPUP_X = 400;
const MAP_HELICOPTER_ETA_POPUP_Y = 250;
const MAP_HELICOPTER_UPPER_ETA_POPUP_Y = 50;
const MAP_HELICOPTER_ETA_POPUP_WIDTH = 120;
const MAP_HELICOPTER_ETA_POPUP_HEIGHT = 68;

const MAP_LEVEL_STRING_X = 432;
const MAP_LEVEL_STRING_Y = 305;

// font
const MAP_FONT = () => BLOCKFONT2();

// index color
const MAP_INDEX_COLOR = 32 * 4 - 9;

// max number of sectors viewable
const MAX_VIEW_SECTORS = 16;

// Map Location index regions

// x start of hort index
const MAP_HORT_INDEX_X = 292;

// y position of hort index
const MAP_HORT_INDEX_Y = 10;

// height of hort index
const MAP_HORT_HEIGHT = () => GetFontHeight(MAP_FONT());

// vert index start x
const MAP_VERT_INDEX_X = 273;

// vert index start y
const MAP_VERT_INDEX_Y = 31;

// vert width
const MAP_VERT_WIDTH = () => GetFontHeight(MAP_FONT());

// "Boxes" Icons
const SMALL_YELLOW_BOX = 0;
const BIG_YELLOW_BOX = 1;
const SMALL_DULL_YELLOW_BOX = 2;
const BIG_DULL_YELLOW_BOX = 3;
const SMALL_WHITE_BOX = 4;
const BIG_WHITE_BOX = 5;
const SMALL_RED_BOX = 6;
const BIG_RED_BOX = 7;
const SMALL_QUESTION_MARK = 8;
const BIG_QUESTION_MARK = 9;

const MERC_ICONS_PER_LINE = 6;
const ROWS_PER_SECTOR = 5;

const MAP_X_ICON_OFFSET = 2;
const MAP_Y_ICON_OFFSET = 1;

// Arrow Offsets
const UP_X = 13;
const UP_Y = 7;
const DOWN_X = 0;
const DOWN_Y = -2;
const RIGHT_X = -2;
const RIGHT_Y = 11;
const LEFT_X = 2;
const LEFT_Y = 5;

// The Path Lines
const NORTH_LINE = 1;
const SOUTH_LINE = 0;
const WEST_LINE = 3;
const EAST_LINE = 2;
const N_TO_E_LINE = 4;
const E_TO_S_LINE = 5;
const W_TO_N_LINE = 6;
const S_TO_W_LINE = 7;
const W_TO_S_LINE = 8;
const N_TO_W_LINE = 9;
const S_TO_E_LINE = 10;
const E_TO_N_LINE = 11;
const W_TO_E_LINE = 12;
const N_TO_S_LINE = 13;
const E_TO_W_LINE = 14;
const S_TO_N_LINE = 15;
const W_TO_E_PART1_LINE = 16;
const W_TO_E_PART2_LINE = 17;
const E_TO_W_PART1_LINE = 18;
const E_TO_W_PART2_LINE = 19;
const N_TO_S_PART1_LINE = 20;
const N_TO_S_PART2_LINE = 21;
const S_TO_N_PART1_LINE = 22;
const S_TO_N_PART2_LINE = 23;
const GREEN_X_WEST = 36;
const GREEN_X_EAST = 37;
const GREEN_X_NORTH = 38;
const GREEN_X_SOUTH = 39;
const RED_X_WEST = 40;
const RED_X_EAST = 41;
const RED_X_NORTH = 42;
const RED_X_SOUTH = 43;

// The arrows
const Y_NORTH_ARROW = 24;
const Y_SOUTH_ARROW = 25;
const Y_EAST_ARROW = 26;
const Y_WEST_ARROW = 27;
const W_NORTH_ARROW = 28;
const W_SOUTH_ARROW = 29;
const W_EAST_ARROW = 30;
const W_WEST_ARROW = 31;
const NORTH_ARROW = 32;
const SOUTH_ARROW = 33;
const EAST_ARROW = 34;
const WEST_ARROW = 35;

const ZOOM_Y_NORTH_ARROW = 68;
const ZOOM_Y_SOUTH_ARROW = 69;
const ZOOM_Y_EAST_ARROW = 70;
const ZOOM_Y_WEST_ARROW = 71;
const ZOOM_W_NORTH_ARROW = 72;
const ZOOM_W_SOUTH_ARROW = 73;
const ZOOM_W_EAST_ARROW = 74;
const ZOOM_W_WEST_ARROW = 75;
const ZOOM_NORTH_ARROW = 76;
const ZOOM_SOUTH_ARROW = 77;
const ZOOM_EAST_ARROW = 78;
const ZOOM_WEST_ARROW = 79;
const ARROW_DELAY = 20;
const PAUSE_DELAY = 1000;

// The zoomed in path lines
const SOUTH_ZOOM_LINE = 44;
const NORTH_ZOOM_LINE = 45;
const EAST_ZOOM_LINE = 46;
const WEST_ZOOM_LINE = 47;
const N_TO_E_ZOOM_LINE = 48;
const E_TO_S_ZOOM_LINE = 49;
const W_TO_N_ZOOM_LINE = 50;
const S_TO_W_ZOOM_LINE = 51;
const W_TO_S_ZOOM_LINE = 52;
const N_TO_W_ZOOM_LINE = 53;
const S_TO_E_ZOOM_LINE = 54;
const E_TO_N_ZOOM_LINE = 55;
const W_TO_E_ZOOM_LINE = 56;
const N_TO_S_ZOOM_LINE = 57;
const E_TO_W_ZOOM_LINE = 58;
const S_TO_N_ZOOM_LINE = 59;
const ZOOM_GREEN_X_WEST = 80;
const ZOOM_GREEN_X_EAST = 81;
const ZOOM_GREEN_X_NORTH = 82;
const ZOOM_GREEN_X_SOUTH = 83;
const ZOOM_RED_X_WEST = 84;
const ZOOM_RED_X_EAST = 85;
const ZOOM_RED_X_NORTH = 86;
const ZOOM_RED_X_SOUTH = 87;

const CHAR_FONT_COLOR = 32 * 4 - 9;

// Arrow Offsets
const EAST_OFFSET_X = 11;
const EAST_OFFSET_Y = 0;
const NORTH_OFFSET_X = 9;
const NORTH_OFFSET_Y = -9;
const SOUTH_OFFSET_X = -9;
const SOUTH_OFFSET_Y = 9;
const WEST_OFFSET_X = -11;
const WEST_OFFSET_Y = 0;
const WEST_TO_SOUTH_OFFSET_Y = 0;
const EAST_TO_NORTH_OFFSET_Y = 0;
const RED_WEST_OFF_X = -MAP_GRID_X;
const RED_EAST_OFF_X = MAP_GRID_X;
const RED_NORTH_OFF_Y = -21;
const RED_SOUTH_OFF_Y = 21;

// the font use on the mvt icons for mapscreen
const MAP_MVT_ICON_FONT = () => SMALLCOMPFONT();

// map shading colors

const enum Enum157 {
  MAP_SHADE_BLACK = 0,
  MAP_SHADE_LT_GREEN,
  MAP_SHADE_DK_GREEN,
  MAP_SHADE_LT_RED,
  MAP_SHADE_DK_RED,
}
// the big map .pcx
export let guiBIGMAP: UINT32;

// orta .sti icon
export let guiORTAICON: UINT32;
export let guiTIXAICON: UINT32;

// boxes for characters on the map
export let guiCHARICONS: UINT32;

// the merc arrival sector landing zone icon
export let guiBULLSEYE: UINT32;

// the max allowable towns militia in a sector
const MAP_MILITIA_MAP_X = 4;
const MAP_MILITIA_MAP_Y = 20;
const MAP_MILITIA_LOWER_ROW_Y = 142;
const NUMBER_OF_MILITIA_ICONS_PER_LOWER_ROW = 25;
const MILITIA_BOX_ROWS = 3;
const MILITIA_BOX_BOX_HEIGHT = 36;
const MILITIA_BOX_BOX_WIDTH = 42;
const MAP_MILITIA_BOX_POS_X = 400;
const MAP_MILITIA_BOX_POS_Y = 125;

const POPUP_MILITIA_ICONS_PER_ROW = 5; // max 6 rows gives the limit of 30 militia
const MEDIUM_MILITIA_ICON_SPACING = 5;
const LARGE_MILITIA_ICON_SPACING = 6;

const MILITIA_BTN_OFFSET_X = 26;
const MILITIA_BTN_HEIGHT = 11;
const MILITIA_BOX_WIDTH = 133;
const MILITIA_BOX_TEXT_OFFSET_Y = 4;
const MILITIA_BOX_UNASSIGNED_TEXT_OFFSET_Y = 132;
const MILITIA_BOX_TEXT_TITLE_HEIGHT = 13;

const MAP_MILITIA_BOX_AUTO_BOX_X = 4;
const MAP_MILITIA_BOX_AUTO_BOX_Y = 167;
const MAP_MILITIA_BOX_DONE_BOX_X = 67;

const HELI_ICON = 0;
const HELI_SHADOW_ICON = 1;

const HELI_ICON_WIDTH = 20;
const HELI_ICON_HEIGHT = 10;
const HELI_SHADOW_ICON_WIDTH = 19;
const HELI_SHADOW_ICON_HEIGHT = 11;

// the militia box buttons and images
let giMapMilitiaButtonImage: INT32[] /* [5] */ = createArray(5, 0);
let giMapMilitiaButton: INT32[] /* [5] */ = [
  -1,
  -1,
  -1,
  -1,
  -1,
];

let gsMilitiaSectorButtonColors: INT16[] /* [] */ = [
  FONT_LTGREEN,
  FONT_LTBLUE,
  16,
];

// track number of townspeople picked up
export let sGreensOnCursor: INT16 = 0;
export let sRegularsOnCursor: INT16 = 0;
export let sElitesOnCursor: INT16 = 0;

// the current militia town id
export let sSelectedMilitiaTown: INT16 = 0;

// sublevel graphics
export let guiSubLevel1: UINT32;
export let guiSubLevel2: UINT32;
export let guiSubLevel3: UINT32;

// the between sector icons
export let guiCHARBETWEENSECTORICONS: UINT32;
export let guiCHARBETWEENSECTORICONSCLOSE: UINT32;

// tixa found
export let fFoundTixa: boolean = false;

// selected sector
export let sSelMapX: UINT16 = 9;
export let sSelMapY: UINT16 = 1;

// highlighted sector
export let gsHighlightSectorX: INT16 = -1;
export let gsHighlightSectorX__Pointer = createPointer(() => gsHighlightSectorX, (v) => gsHighlightSectorX = v);
export let gsHighlightSectorY: INT16 = -1;
export let gsHighlightSectorY__Pointer = createPointer(() => gsHighlightSectorY, (v) => gsHighlightSectorY = v);

// the current sector Z value of the map being displayed
export let iCurrentMapSectorZ: INT32 = 0;

// the palettes
let pMapLTRedPalette: Uint16Array | null;
let pMapDKRedPalette: Uint16Array | null;
let pMapLTGreenPalette: Uint16Array | null;
let pMapDKGreenPalette: Uint16Array | null;

// the map border eta pop up
export let guiMapBorderEtaPopUp: UINT32;

// heli pop up
export let guiMapBorderHeliSectors: UINT32;

// list of map sectors that player isn't allowed to even highlight
let sBadSectorsList: boolean[][] /* [WORLD_MAP_X][WORLD_MAP_X] */ = createArrayFrom(WORLD_MAP_X, () => createArray(WORLD_MAP_X, false));

let sBaseSectorList: INT16[] /* [] */ = [
  // NOTE: These co-ordinates must match the top left corner of the 3x3 town tiles cutouts in Interface/MilitiaMaps.sti!
  SECTOR(9, 1), // Omerta
  SECTOR(13, 2), // Drassen
  SECTOR(13, 8), // Alma
  SECTOR(1, 7), // Grumm
  SECTOR(8, 9), // Tixa
  SECTOR(8, 6), // Cambria
  SECTOR(4, 2), // San Mona
  SECTOR(5, 8), // Estoni
  SECTOR(3, 10), // Orta
  SECTOR(11, 11), // Balime
  SECTOR(3, 14), // Meduna
  SECTOR(2, 1), // Chitzena
];

// position of town names on the map
// these are no longer PIXELS, but 10 * the X,Y position in SECTORS (fractions possible) to the X-CENTER of the town
let pTownPoints: POINT[] /* [] */ = [
  createPointFrom(0, 0),
  createPointFrom(90, 10), // Omerta
  createPointFrom(125, 40), // Drassen
  createPointFrom(130, 90), // Alma
  createPointFrom(15, 80), // Grumm
  createPointFrom(85, 100), // Tixa
  createPointFrom(95, 70), // Cambria
  createPointFrom(45, 40), // San Mona
  createPointFrom(55, 90), // Estoni
  createPointFrom(35, 110), // Orta
  createPointFrom(110, 120), // Balime
  createPointFrom(45, 150), // Meduna
  createPointFrom(15, 20), // Chitzena
];

let gpSamSectorX: INT16[] /* [] */ = [
  SAM_1_X,
  SAM_2_X,
  SAM_3_X,
  SAM_4_X,
];
let gpSamSectorY: INT16[] /* [] */ = [
  SAM_1_Y,
  SAM_2_Y,
  SAM_3_Y,
  SAM_4_Y,
];

// map region
export let MapScreenRect: SGPRect = createSGPRectFrom((MAP_VIEW_START_X + MAP_GRID_X - 2), (MAP_VIEW_START_Y + MAP_GRID_Y - 1), MAP_VIEW_START_X + MAP_VIEW_WIDTH - 1 + MAP_GRID_X, MAP_VIEW_START_Y + MAP_VIEW_HEIGHT - 10 + MAP_GRID_Y);

let gOldClipRect: SGPRect = createSGPRect();

// screen region
let FullScreenRect: SGPRect = createSGPRectFrom(0, 0, 640, 480);

// temp helicopter path
export let pTempHelicopterPath: PathSt | null = null;

// character temp path
export let pTempCharacterPath: PathSt | null = null;

// draw temp path?
export let fDrawTempHeliPath: boolean = false;

// the map arrows graphics
export let guiMAPCURSORS: UINT32;

// destination plotting character
export let bSelectedDestChar: INT8 = -1;

// assignment selection character
export let bSelectedAssignChar: INT8 = -1;

// current contract char
export let bSelectedContractChar: INT8 = -1;

// has the temp path for character or helicopter been already drawn?
export let fTempPathAlreadyDrawn: boolean = false;

// the regions for the mapscreen militia box
let gMapScreenMilitiaBoxRegions: MOUSE_REGION[] /* [9] */ = createArrayFrom(9, createMouseRegion);
let gMapScreenMilitiaRegion: MOUSE_REGION = createMouseRegion();

// the mine icon
export let guiMINEICON: UINT32;

// militia graphics
let guiMilitia: UINT32;
let guiMilitiaMaps: UINT32;
let guiMilitiaSectorHighLight: UINT32;
let guiMilitiaSectorOutline: UINT32;

// the sector that is highlighted on the militia map
let sSectorMilitiaMapSector: INT16 = -1;
let fMilitiaMapButtonsCreated: boolean = false;
let sSectorMilitiaMapSectorOutline: INT16 = -1;

// have any nodes in the current path list been deleted?
export let fDeletedNode: boolean = false;

let gusUndergroundNearBlack: UINT16;

export let gfMilitiaPopupCreated: boolean = false;

export let giAnimateRouteBaseTime: INT32 = 0;
export let giPotHeliPathBaseTime: INT32 = 0;
export let giClickHeliIconBaseTime: INT32 = 0;

// UINT8 NumActiveCharactersInSector( INT16 sSectorX, INT16 sSectorY, INT16 bSectorZ );
// UINT8 NumFriendlyInSector( INT16 sX, INT16 sY, INT8 bZ );

export function DrawMapIndexBigMap(fSelectedCursorIsYellow: boolean): void {
  // this procedure will draw the coord indexes on the zoomed out map
  let usX: INT16;
  let usY: INT16;
  let iCount: INT32 = 0;
  let fDrawCursors: boolean;

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
  // SetFontColors(FONT_FCOLOR_GREEN)
  SetFont(MAP_FONT());
  SetFontForeground(MAP_INDEX_COLOR);
  // Dk Red is 163
  SetFontBackground(FONT_MCOLOR_BLACK);

  fDrawCursors = CanDrawSectorCursor();

  for (iCount = 1; iCount <= MAX_VIEW_SECTORS; iCount++) {
    if (fDrawCursors && (iCount == sSelMapX) && (bSelectedDestChar == -1) && (fPlotForHelicopter == false))
      SetFontForeground((fSelectedCursorIsYellow ? FONT_YELLOW : FONT_WHITE));
    else if (fDrawCursors && (iCount == gsHighlightSectorX))
      SetFontForeground(FONT_WHITE);
    else
      SetFontForeground(MAP_INDEX_COLOR);

    ({ sX: usX, sY: usY } = FindFontCenterCoordinates(((MAP_HORT_INDEX_X + (iCount - 1) * MAP_GRID_X)), MAP_HORT_INDEX_Y, MAP_GRID_X, MAP_HORT_HEIGHT(), pMapHortIndex[iCount], MAP_FONT()));
    mprintf(usX, usY, pMapHortIndex[iCount]);

    if (fDrawCursors && (iCount == sSelMapY) && (bSelectedDestChar == -1) && (fPlotForHelicopter == false))
      SetFontForeground((fSelectedCursorIsYellow ? FONT_YELLOW : FONT_WHITE));
    else if (fDrawCursors && (iCount == gsHighlightSectorY))
      SetFontForeground(FONT_WHITE);
    else
      SetFontForeground(MAP_INDEX_COLOR);

    ({ sX: usX, sY: usY } = FindFontCenterCoordinates(MAP_VERT_INDEX_X, ((MAP_VERT_INDEX_Y + (iCount - 1) * MAP_GRID_Y)), MAP_HORT_HEIGHT(), MAP_GRID_Y, pMapVertIndex[iCount], MAP_FONT()));
    mprintf(usX, usY, pMapVertIndex[iCount]);
  }

  InvalidateRegion(MAP_VERT_INDEX_X, MAP_VERT_INDEX_Y, MAP_VERT_INDEX_X + MAP_HORT_HEIGHT(), MAP_VERT_INDEX_Y + (iCount - 1) * MAP_GRID_Y);
  InvalidateRegion(MAP_HORT_INDEX_X, MAP_HORT_INDEX_Y, MAP_HORT_INDEX_X + (iCount - 1) * MAP_GRID_X, MAP_HORT_INDEX_Y + MAP_HORT_HEIGHT());

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
}

/*
void DrawMapIndexSmallMap( BOOLEAN fSelectedCursorIsYellow )
{
        // this procedure will draw the coord indexes on the zoomed in map
        INT16 usX, usY;
        INT32 iCount=0;
        BOOLEAN fDrawCursors;


        SetFont(MAP_FONT);
        SetFontDestBuffer( FRAME_BUFFER, MAP_HORT_INDEX_X, MAP_HORT_INDEX_Y, MAP_HORT_INDEX_X+(MAX_VIEW_SECTORS)*MAP_GRID_X, MAP_HORT_INDEX_Y+MAP_GRID_Y, FALSE );
  //SetFontColors(FONT_FCOLOR_GREEN)
  SetFont(MAP_FONT);
  SetFontForeground(MAP_INDEX_COLOR);
  SetFontBackground(FONT_MCOLOR_BLACK);

        fDrawCursors = CanDrawSectorCursor( );

        for(iCount=1; iCount <= MAX_VIEW_SECTORS; iCount++)
        {
         if( fDrawCursors && ( iCount == sSelMapX ) && ( bSelectedDestChar == -1 ) && ( fPlotForHelicopter == FALSE ) )
                SetFontForeground( ( UINT8 ) ( fSelectedCursorIsYellow ? FONT_YELLOW : FONT_WHITE ) );
   else if( fDrawCursors && ( iCount == gsHighlightSectorX ) )
    SetFontForeground(FONT_WHITE);
   else
    SetFontForeground(MAP_INDEX_COLOR);

   FindFontCenterCoordinates(((INT16)(MAP_HORT_INDEX_X+((iCount)*MAP_GRID_X)*2-iZoomX)), MAP_HORT_INDEX_Y, MAP_GRID_X*2, MAP_HORT_HEIGHT, pMapHortIndex[iCount], MAP_FONT, &usX, &usY);
         mprintf(usX,usY,pMapHortIndex[iCount]);
  }
        SetFontDestBuffer( FRAME_BUFFER, MAP_VERT_INDEX_X, MAP_VERT_INDEX_Y, MAP_VERT_INDEX_X+MAP_GRID_X, MAP_VERT_INDEX_Y+(MAX_VIEW_SECTORS)*MAP_GRID_Y, FALSE );

        for(iCount=1; iCount <= MAX_VIEW_SECTORS; iCount++)
        {
         if( fDrawCursors && ( iCount == sSelMapY) && ( bSelectedDestChar == -1 ) && ( fPlotForHelicopter == FALSE ) )
                SetFontForeground( ( UINT8 ) ( fSelectedCursorIsYellow ? FONT_YELLOW : FONT_WHITE ) );
   else if( fDrawCursors && ( iCount == gsHighlightSectorY ) )
    SetFontForeground(FONT_WHITE);
   else
    SetFontForeground(MAP_INDEX_COLOR);

         FindFontCenterCoordinates(MAP_VERT_INDEX_X, ((INT16)(MAP_VERT_INDEX_Y+(iCount*MAP_GRID_Y)*2-iZoomY)), MAP_HORT_HEIGHT, MAP_GRID_Y*2, pMapVertIndex[iCount], MAP_FONT, &usX, &usY);
         mprintf(usX,usY,pMapVertIndex[iCount]);
        }

  InvalidateRegion(MAP_VERT_INDEX_X, MAP_VERT_INDEX_Y,MAP_VERT_INDEX_X+MAP_HORT_HEIGHT,  MAP_VERT_INDEX_Y+iCount*MAP_GRID_Y );
  InvalidateRegion(MAP_HORT_INDEX_X, MAP_HORT_INDEX_Y,MAP_HORT_INDEX_X+iCount*MAP_GRID_X,  MAP_HORT_INDEX_Y+ MAP_HORT_HEIGHT);
  SetFontDestBuffer( FRAME_BUFFER, 0, 0, 640, 480, FALSE );
}
*/

function HandleShowingOfEnemiesWithMilitiaOn(): void {
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  // if show militia flag is false, leave
  if (!fShowMilitia) {
    return;
  }

  for (sX = 1; sX < (MAP_WORLD_X - 1); sX++) {
    for (sY = 1; sY < (MAP_WORLD_Y - 1); sY++) {
      HandleShowingOfEnemyForcesInSector(sX, sY, iCurrentMapSectorZ, CountAllMilitiaInSector(sX, sY));
    }
  }

  return;
}

export function DrawMap(): boolean {
  let hSrcVSurface: HVSURFACE;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let pSrcBuf: Pointer<UINT8>;
  let clip: SGPRect = createSGPRect();
  let cnt: INT16;
  let cnt2: INT16;
  let iCounter: INT32 = 0;

  if (!iCurrentMapSectorZ) {
    pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));

    if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
      return false;
    }
    pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

    // clip blits to mapscreen region
    // ClipBlitsToMapViewRegion( );

    if (fZoomFlag) {
      // set up bounds
      if (iZoomX < WEST_ZOOM_BOUND)
        iZoomX = WEST_ZOOM_BOUND;
      if (iZoomX > EAST_ZOOM_BOUND)
        iZoomX = EAST_ZOOM_BOUND;
      if (iZoomY < NORTH_ZOOM_BOUND + 1)
        iZoomY = NORTH_ZOOM_BOUND;
      if (iZoomY > SOUTH_ZOOM_BOUND)
        iZoomY = SOUTH_ZOOM_BOUND;

      clip.iLeft = iZoomX - 2;
      clip.iRight = clip.iLeft + MAP_VIEW_WIDTH + 2;
      clip.iTop = iZoomY - 3;
      clip.iBottom = clip.iTop + MAP_VIEW_HEIGHT - 1;

      /*
      clip.iLeft=clip.iLeft - 1;
      clip.iRight=clip.iLeft + MapScreenRect.iRight - MapScreenRect.iLeft;
      clip.iTop=iZoomY - 1;
      clip.iBottom=clip.iTop + MapScreenRect.iBottom - MapScreenRect.iTop;
      */

      if (clip.iBottom > hSrcVSurface.value.usHeight) {
        clip.iBottom = hSrcVSurface.value.usHeight;
      }

      if (clip.iRight > hSrcVSurface.value.usWidth) {
        clip.iRight = hSrcVSurface.value.usWidth;
      }

      Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, MAP_VIEW_START_X + MAP_GRID_X, MAP_VIEW_START_Y + MAP_GRID_Y - 2, addressof(clip));
    } else {
      Blt8BPPDataTo16BPPBufferHalf(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, MAP_VIEW_START_X + 1, MAP_VIEW_START_Y);
    }

    UnLockVideoSurface(guiBIGMAP);
    UnLockVideoSurface(guiSAVEBUFFER);

    // shade map sectors (must be done after Tixa/Orta/Mine icons have been blitted, but before icons!)
    for (cnt = 1; cnt < MAP_WORLD_X - 1; cnt++) {
      for (cnt2 = 1; cnt2 < MAP_WORLD_Y - 1; cnt2++) {
        // LATE DESIGN CHANGE: darken sectors not yet visited, instead of those under known enemy control
        if (GetSectorFlagStatus(cnt, cnt2, iCurrentMapSectorZ, SF_ALREADY_VISITED) == false)
        //				if ( IsTheSectorPerceivedToBeUnderEnemyControl( cnt, cnt2, ( INT8 )( iCurrentMapSectorZ ) ) )
        {
          if (fShowAircraftFlag && !iCurrentMapSectorZ) {
            if (!StrategicMap[cnt + cnt2 * WORLD_MAP_X].fEnemyAirControlled) {
              // sector not visited, not air controlled
              ShadeMapElem(cnt, cnt2, Enum157.MAP_SHADE_DK_GREEN);
            } else {
              // sector not visited, controlled and air not
              ShadeMapElem(cnt, cnt2, Enum157.MAP_SHADE_DK_RED);
            }
          } else {
            // not visited
            ShadeMapElem(cnt, cnt2, Enum157.MAP_SHADE_BLACK);
          }
        } else {
          if (fShowAircraftFlag && !iCurrentMapSectorZ) {
            if (!StrategicMap[cnt + cnt2 * WORLD_MAP_X].fEnemyAirControlled) {
              // sector visited and air controlled
              ShadeMapElem(cnt, cnt2, Enum157.MAP_SHADE_LT_GREEN);
            } else {
              // sector visited but not air controlled
              ShadeMapElem(cnt, cnt2, Enum157.MAP_SHADE_LT_RED);
            }
          }
        }
      }
    }

    // UNFORTUNATELY, WE CAN'T SHADE THESE ICONS AS PART OF SHADING THE MAP, BECAUSE FOR AIRSPACE, THE SHADE FUNCTION
    // DOESN'T MERELY SHADE THE EXISTING MAP SURFACE, BUT INSTEAD GRABS THE ORIGINAL GRAPHICS FROM BIGMAP, AND CHANGES
    // THEIR PALETTE.  BLITTING ICONS PRIOR TO SHADING WOULD MEAN THEY DON'T SHOW UP IN AIRSPACE VIEW AT ALL.

    // if Orta found
    if (fFoundOrta) {
      DrawOrta();
    }

    // if Tixa found
    if (fFoundTixa) {
      DrawTixa();
    }

    // draw SAM sites
    ShowSAMSitesOnStrategicMap();

    // draw mine icons
    for (iCounter = 0; iCounter < Enum179.MAX_NUMBER_OF_MINES; iCounter++) {
      BlitMineIcon(gMineLocation[iCounter].sSectorX, gMineLocation[iCounter].sSectorY);
    }

    // if mine details filter is set
    if (fShowMineFlag) {
      // show mine name/production text
      for (iCounter = 0; iCounter < Enum179.MAX_NUMBER_OF_MINES; iCounter++) {
        BlitMineText(gMineLocation[iCounter].sSectorX, gMineLocation[iCounter].sSectorY);
      }
    }

    // draw towns names & loyalty ratings, and grey town limit borders
    if (fShowTownFlag) {
      BlitTownGridMarkers();
      ShowTownText();
    }

    // draw militia icons
    if (fShowMilitia) {
      DrawTownMilitiaForcesOnMap();
    }

    if (fShowAircraftFlag && !gfInChangeArrivalSectorMode) {
      DrawBullseye();
    }
  } else {
    HandleLowerLevelMapBlit();
  }

  // show mine outlines even when viewing underground sublevels - they indicate where the mine entrances are
  if (fShowMineFlag)
    // draw grey mine sector borders
    BlitMineGridMarkers();

  // do not show mercs/vehicles when airspace is ON
  // commented out on a trial basis!
  //	if( !fShowAircraftFlag )
  {
    if (fShowTeamFlag)
      ShowTeamAndVehicles(SHOW_TEAMMATES | SHOW_VEHICLES);
    else
      HandleShowingOfEnemiesWithMilitiaOn();

    /*
                    if((fShowTeamFlag)&&(fShowVehicleFlag))
                     ShowTeamAndVehicles(SHOW_TEAMMATES | SHOW_VEHICLES);
                    else if(fShowTeamFlag)
                            ShowTeamAndVehicles(SHOW_TEAMMATES);
                    else if(fShowVehicleFlag)
                            ShowTeamAndVehicles(SHOW_VEHICLES);
                    else
                    {
                            HandleShowingOfEnemiesWithMilitiaOn( );
                    }
    */
  }

  if (fShowItemsFlag) {
    ShowItemsOnMap();
  }

  DisplayLevelString();

  // RestoreClipRegionToFullScreen( );

  return true;
}

export function GetScreenXYFromMapXY(sMapX: INT16, sMapY: INT16): { sX: INT16, sY: INT16 } {
  let sX: INT16;
  let sY: INT16;

  let sXTempOff: INT16 = 1;
  let sYTempOff: INT16 = 1;
  if (fZoomFlag) {
    sX = ((sMapX / 2 + sXTempOff) * MAP_GRID_ZOOM_X) + MAP_VIEW_START_X;
    sY = ((sMapY / 2 + sYTempOff) * MAP_GRID_ZOOM_Y) + MAP_VIEW_START_Y;
  } else {
    sX = (sMapX * MAP_GRID_X) + MAP_VIEW_START_X;
    sY = (sMapY * MAP_GRID_Y) + MAP_VIEW_START_Y;
  }

  return { sX, sY };
}

function GetScreenXYFromMapXYStationary(sMapX: INT16, sMapY: INT16): { sX: INT16, sY: INT16 } {
  let sX: INT16;
  let sY: INT16;

  let sXTempOff: INT16 = 1;
  let sYTempOff: INT16 = 1;
  //(MAP_VIEW_START_X+((iCount+1)*MAP_GRID_X)*2-iZoomX));
  sX = ((sMapX + sXTempOff) * MAP_GRID_X) * 2 - (iZoomX) + MAP_VIEW_START_X;
  sY = ((sMapY + sYTempOff) * MAP_GRID_Y) * 2 - (iZoomY) + MAP_VIEW_START_Y;

  return { sX, sY };
}

function ShowTownText(): void {
  let sString: string /* CHAR16[32] */;
  let sStringA: string /* CHAR16[32] */;
  let bTown: INT8 = 0;
  let usX: UINT16;
  let usY: UINT16;
  let fLoyaltyTooLowToTrainMilitia: boolean;

  // this procedure will display the town names on the screen

  SetFont(MAP_FONT());
  SetFontBackground(FONT_MCOLOR_BLACK);

  for (bTown = FIRST_TOWN; bTown < Enum135.NUM_TOWNS; bTown++) {
    // skip Orta/Tixa until found
    if (((fFoundOrta != false) || (bTown != Enum135.ORTA)) && ((bTown != Enum135.TIXA) || (fFoundTixa != false))) {
      sString = swprintf("%s", pTownNames[bTown]);

      fLoyaltyTooLowToTrainMilitia = false;

      // don't show loyalty string until loyalty tracking for that town has been started
      if (gTownLoyalty[bTown].fStarted && gfTownUsesLoyalty[bTown]) {
        sStringA = swprintf("%d%%%% %s", gTownLoyalty[bTown].ubRating, gsLoyalString[0]);

        // if loyalty is too low to train militia, and militia training is allowed here
        if ((gTownLoyalty[bTown].ubRating < MIN_RATING_TO_TRAIN_TOWN) && MilitiaTrainingAllowedInTown(bTown)) {
          fLoyaltyTooLowToTrainMilitia = true;
        }
      } else {
        sStringA = "";
      }

      if (!fZoomFlag) {
        usX = (MAP_VIEW_START_X + MAP_GRID_X + (pTownPoints[bTown].x * MAP_GRID_X) / 10);
        usY = (MAP_VIEW_START_Y + MAP_GRID_Y + ((pTownPoints[bTown].y * MAP_GRID_Y) / 10) + 1);
      } else {
        usX = (MAP_VIEW_START_X + MAP_GRID_X + MAP_GRID_ZOOM_X - iZoomX + (pTownPoints[bTown].x * MAP_GRID_ZOOM_X) / 10);
        usY = (MAP_VIEW_START_Y + MAP_GRID_Y + MAP_GRID_ZOOM_Y - iZoomY + ((pTownPoints[bTown].y * MAP_GRID_ZOOM_Y) / 10) + 1);
        //			usX = 2 * pTownPoints[ bTown  ].x - iZoomX - MAP_VIEW_START_X + MAP_GRID_X;
        //			usY = 2 * pTownPoints[ bTown  ].y - iZoomY - MAP_VIEW_START_Y + MAP_GRID_Y;
      }

      // red for low loyalty, green otherwise
      SetFontForeground((fLoyaltyTooLowToTrainMilitia ? FONT_MCOLOR_RED : FONT_MCOLOR_LTGREEN));

      DrawTownLabels(sString, sStringA, usX, usY);
    }
  }
}

function DrawTownLabels(pString: string /* STR16 */, pStringA: string /* STR16 */, usFirstX: UINT16, usFirstY: UINT16): void {
  // this procedure will draw the given strings on the screen centered around the given x and at the given y

  let sSecondX: INT16;
  let sSecondY: INT16;
  let sPastEdge: INT16;

  // if within view region...render, else don't
  if ((usFirstX > MAP_VIEW_START_X + MAP_VIEW_WIDTH) || (usFirstX < MAP_VIEW_START_X) || (usFirstY < MAP_VIEW_START_Y) || (usFirstY > MAP_VIEW_START_Y + MAP_VIEW_HEIGHT)) {
    return;
  }

  SetFontDestBuffer(guiSAVEBUFFER, MapScreenRect.iLeft + 2, MapScreenRect.iTop, MapScreenRect.iRight, MapScreenRect.iBottom, false);

  // clip blits to mapscreen region
  ClipBlitsToMapViewRegion();

  // we're CENTERING the first string AROUND usFirstX, so calculate the starting X
  usFirstX -= StringPixLength(pString, MAP_FONT()) / 2;

  // print first string
  gprintfdirty(usFirstX, usFirstY, pString);
  mprintf(usFirstX, usFirstY, pString);

  // calculate starting coordinates for the second string
  ({ sX: sSecondX, sY: sSecondY } = VarFindFontCenterCoordinates((usFirstX), usFirstY, StringPixLength(pString, MAP_FONT()), 0, MAP_FONT(), pStringA));

  // make sure we don't go past left edge (Grumm)
  if (!fZoomFlag) {
    sPastEdge = (MAP_VIEW_START_X + 23) - sSecondX;

    if (sPastEdge > 0)
      sSecondX += sPastEdge;
  }

  // print second string beneath first
  sSecondY = (usFirstY + GetFontHeight(MAP_FONT()));
  gprintfdirty(sSecondX, sSecondY, pStringA);
  mprintf(sSecondX, sSecondY, pStringA);

  // restore clip blits
  RestoreClipRegionToFullScreen();
}

// "on duty" includes mercs inside vehicles
function ShowOnDutyTeam(sMapX: INT16, sMapY: INT16): INT32 {
  let ubCounter: UINT8 = 0;
  let ubIconPosition: UINT8 = 0;
  let hIconHandle: SGPVObject;
  let pSoldier: SOLDIERTYPE;

  hIconHandle = GetVideoObject(guiCHARICONS);

  // run through list
  while (gCharactersList[ubCounter].fValid) {
    pSoldier = MercPtrs[gCharactersList[ubCounter].usSolID];

    if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier.sSectorX == sMapX) && (pSoldier.sSectorY == sMapY) && (pSoldier.bSectorZ == iCurrentMapSectorZ) && ((pSoldier.bAssignment < Enum117.ON_DUTY) || ((pSoldier.bAssignment == Enum117.VEHICLE) && (pSoldier.iVehicleId != iHelicopterVehicleId))) && (pSoldier.bLife > 0) && (!PlayerIDGroupInMotion(pSoldier.ubGroupID))) {
      DrawMapBoxIcon(hIconHandle, SMALL_YELLOW_BOX, sMapX, sMapY, ubIconPosition);
      ubIconPosition++;
    }

    ubCounter++;
  }
  return ubIconPosition;
}

function ShowAssignedTeam(sMapX: INT16, sMapY: INT16, iCount: INT32): INT32 {
  let ubCounter: UINT8;
  let ubIconPosition: UINT8;
  let hIconHandle: SGPVObject;
  let pSoldier: SOLDIERTYPE;

  hIconHandle = GetVideoObject(guiCHARICONS);
  ubCounter = 0;

  // run through list
  ubIconPosition = iCount;

  while (gCharactersList[ubCounter].fValid) {
    pSoldier = MercPtrs[gCharactersList[ubCounter].usSolID];

    // given number of on duty members, find number of assigned chars
    // start at beginning of list, look for people who are in sector and assigned
    if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier.sSectorX == sMapX) && (pSoldier.sSectorY == sMapY) && (pSoldier.bSectorZ == iCurrentMapSectorZ) && (pSoldier.bAssignment >= Enum117.ON_DUTY) && (pSoldier.bAssignment != Enum117.VEHICLE) && (pSoldier.bAssignment != Enum117.IN_TRANSIT) && (pSoldier.bAssignment != Enum117.ASSIGNMENT_POW) && (pSoldier.bLife > 0) && (!PlayerIDGroupInMotion(pSoldier.ubGroupID))) {
      // skip mercs inside the helicopter if we're showing airspace level - they show up inside chopper icon instead
      if (!fShowAircraftFlag || (pSoldier.bAssignment != Enum117.VEHICLE) || (pSoldier.iVehicleId != iHelicopterVehicleId)) {
        DrawMapBoxIcon(hIconHandle, SMALL_DULL_YELLOW_BOX, sMapX, sMapY, ubIconPosition);
        ubIconPosition++;
      }
    }

    ubCounter++;
  }
  return ubIconPosition;
}

function ShowVehicles(sMapX: INT16, sMapY: INT16, iCount: INT32): INT32 {
  let ubCounter: UINT8;
  let ubIconPosition: UINT8;
  let hIconHandle: SGPVObject;
  let pVehicleSoldier: SOLDIERTYPE;

  hIconHandle = GetVideoObject(guiCHARICONS);
  ubCounter = 0;

  ubIconPosition = iCount;

  // run through list of vehicles
  while (ubCounter < ubNumberOfVehicles) {
    // skip the chopper, it has its own icon and displays in airspace mode
    if (ubCounter != iHelicopterVehicleId) {
      if ((pVehicleList[ubCounter].sSectorX == sMapX) && (pVehicleList[ubCounter].sSectorY == sMapY)) {
        // don't show vehicles between sectors (in motion - they're counted as "people in motion"
        if ((pVehicleList[ubCounter].sSectorZ == iCurrentMapSectorZ) && !PlayerIDGroupInMotion(pVehicleList[ubCounter].ubMovementGroup)) {
          // ATE: Check if this vehicle has a soldier and it's on our team.....
          pVehicleSoldier = GetSoldierStructureForVehicle(ubCounter);

          // this skips the chopper, which has no soldier
          if (pVehicleSoldier) {
            if (pVehicleSoldier.bTeam == gbPlayerNum) {
              DrawMapBoxIcon(hIconHandle, SMALL_WHITE_BOX, sMapX, sMapY, ubIconPosition);
              ubIconPosition++;
            }
          }
        }
      }
    }

    ubCounter++;
  }

  return ubIconPosition;
}

function ShowEnemiesInSector(sSectorX: INT16, sSectorY: INT16, sNumberOfEnemies: INT16, ubIconPosition: UINT8): void {
  let hIconHandle: SGPVObject;
  let ubEnemy: UINT8 = 0;

  // get the video object
  hIconHandle = GetVideoObject(guiCHARICONS);

  for (ubEnemy = 0; ubEnemy < sNumberOfEnemies; ubEnemy++) {
    DrawMapBoxIcon(hIconHandle, SMALL_RED_BOX, sSectorX, sSectorY, ubIconPosition);
    ubIconPosition++;
  }
}

function ShowUncertainNumberEnemiesInSector(sSectorX: INT16, sSectorY: INT16): void {
  let sXPosition: INT16 = 0;
  let sYPosition: INT16 = 0;
  let hIconHandle: SGPVObject;

  // grab the x and y postions
  sXPosition = sSectorX;
  sYPosition = sSectorY;

  // get the video object
  hIconHandle = GetVideoObject(guiCHARICONS);

  // check if we are zoomed in...need to offset in case for scrolling purposes
  if (!fZoomFlag) {
    sXPosition = (MAP_X_ICON_OFFSET + (MAP_VIEW_START_X + (sSectorX * MAP_GRID_X + 1)) - 1);
    sYPosition = (((MAP_VIEW_START_Y + (sSectorY * MAP_GRID_Y) + 1)));
    sYPosition -= 2;

    // small question mark
    BltVideoObject(guiSAVEBUFFER, hIconHandle, SMALL_QUESTION_MARK, sXPosition, sYPosition, VO_BLT_SRCTRANSPARENCY, null);
    InvalidateRegion(sXPosition, sYPosition, sXPosition + DMAP_GRID_X, sYPosition + DMAP_GRID_Y);
  }
  /*
          else
          {
                  INT16 sX = 0, sY = 0;

                  GetScreenXYFromMapXYStationary( sSectorX, sSectorY, &sX, &sY );
                  sYPosition = sY-MAP_GRID_Y;
                  sXPosition = sX-MAP_GRID_X;

                  // get the x and y position
                  sXPosition = MAP_X_ICON_OFFSET + sXPosition ;
                  sYPosition = sYPosition - 1;

                  // clip blits to mapscreen region
                  ClipBlitsToMapViewRegion( );

                  // large question mark
                  BltVideoObject(guiSAVEBUFFER, hIconHandle, BIG_QUESTION_MARK, sXPosition, sYPosition, VO_BLT_SRCTRANSPARENCY, NULL );

                  // restore clip blits
                  RestoreClipRegionToFullScreen( );

                  InvalidateRegion( sXPosition, sYPosition, sXPosition + DMAP_GRID_ZOOM_X, sYPosition + DMAP_GRID_ZOOM_Y );
          }
  */
}

function ShowTeamAndVehicles(fShowFlags: INT32): void {
  // go through each sector, display the on duty, assigned, and vehicles
  let sMapX: INT16 = 0;
  let sMapY: INT16 = 0;
  let iIconOffset: INT32 = 0;
  let fContemplatingRetreating: boolean = false;

  if (gfDisplayPotentialRetreatPaths && gpBattleGroup) {
    fContemplatingRetreating = true;
  }

  for (sMapX = 1; sMapX < MAP_WORLD_X - 1; sMapX++) {
    for (sMapY = 1; sMapY < MAP_WORLD_Y - 1; sMapY++) {
      // don't show mercs/vehicles currently in this sector if player is contemplating retreating from THIS sector
      if (!fContemplatingRetreating || (sMapX != (<GROUP>gpBattleGroup).ubSectorX) || (sMapY != (<GROUP>gpBattleGroup).ubSectorY)) {
        if (fShowFlags & SHOW_TEAMMATES) {
          iIconOffset = ShowOnDutyTeam(sMapX, sMapY);
          iIconOffset = ShowAssignedTeam(sMapX, sMapY, iIconOffset);
        }

        if (fShowFlags & SHOW_VEHICLES)
          iIconOffset = ShowVehicles(sMapX, sMapY, iIconOffset);
      }

      if (fShowFlags & SHOW_TEAMMATES) {
        HandleShowingOfEnemyForcesInSector(sMapX, sMapY, iCurrentMapSectorZ, iIconOffset);
        ShowPeopleInMotion(sMapX, sMapY);
      }
    }
  }
}

function ShadeMapElem(sMapX: INT16, sMapY: INT16, iColor: INT32): boolean {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let hSrcVSurface: HVSURFACE;
  // HVSURFACE hSAMSurface;
  // HVSURFACE hMineSurface;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let pSrcBuf: Pointer<UINT8>;
  let clip: SGPRect = createSGPRect();
  let pOriginalPallette: Pointer<UINT16>;

  // get original video surface palette
  if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
    return false;
  }
  // get original video surface palette
  // CHECKF( GetVideoSurface( &hSAMSurface, guiSAMICON ) );
  // get original video surface palette
  // CHECKF( GetVideoSurface( &hMineSurface, guiMINEICON ) );
  // get original video surface palette

  pOriginalPallette = hSrcVSurface.value.p16BPPPalette;

  if (fZoomFlag)
    ShadeMapElemZoomIn(sMapX, sMapY, iColor);
  else {
    ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY(sMapX, sMapY));

    // compensate for original BIG_MAP blit being done at MAP_VIEW_START_X + 1
    sScreenX += 1;

    // compensate for original BIG_MAP blit being done at MAP_VIEW_START_X + 1
    clip.iLeft = 2 * (sScreenX - (MAP_VIEW_START_X + 1));
    clip.iTop = 2 * (sScreenY - MAP_VIEW_START_Y);
    clip.iRight = clip.iLeft + (2 * MAP_GRID_X);
    clip.iBottom = clip.iTop + (2 * MAP_GRID_Y);

    if (iColor != Enum157.MAP_SHADE_BLACK) {
      // airspace
      /*
                              if( sMapX == 1 )
                              {
                                      clip.iLeft -= 4;
                                      clip.iRight += 4;
                                      sScreenX -= 2;
                              }
                              else
                              {
                                      sScreenX += 1;
                              }
      */
    } else {
      // non-airspace
      sScreenY -= 1;
    }

    switch (iColor) {
      case (Enum157.MAP_SHADE_BLACK):
        // simply shade darker
        ShadowVideoSurfaceRect(guiSAVEBUFFER, sScreenX, sScreenY, sScreenX + MAP_GRID_X - 1, sScreenY + MAP_GRID_Y - 1);
        break;

      case (Enum157.MAP_SHADE_LT_GREEN):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }

        hSrcVSurface.value.p16BPPPalette = pMapLTGreenPalette;
        // hMineSurface->p16BPPPalette = pMapLTGreenPalette;
        // hSAMSurface->p16BPPPalette = pMapLTGreenPalette;

        // lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        Blt8BPPDataTo16BPPBufferHalfRect(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // now blit
        // Blt8BPPDataSubTo16BPPBuffer( pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf,uiSrcPitchBYTES, sScreenX, sScreenY, &clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);
        break;

      case (Enum157.MAP_SHADE_DK_GREEN):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapDKGreenPalette;
        // hMineSurface->p16BPPPalette = pMapDKGreenPalette;
        // hSAMSurface->p16BPPPalette = pMapDKGreenPalette;

        /// lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        Blt8BPPDataTo16BPPBufferHalfRect(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // now blit
        // Blt8BPPDataSubTo16BPPBuffer( pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf,uiSrcPitchBYTES, sScreenX , sScreenY , &clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);
        break;

      case (Enum157.MAP_SHADE_LT_RED):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapLTRedPalette;
        // hMineSurface->p16BPPPalette = pMapLTRedPalette;
        // hSAMSurface->p16BPPPalette = pMapLTRedPalette;

        // lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        Blt8BPPDataTo16BPPBufferHalfRect(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // now blit
        // Blt8BPPDataSubTo16BPPBuffer( pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf,uiSrcPitchBYTES, sScreenX , sScreenY , &clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);
        break;

      case (Enum157.MAP_SHADE_DK_RED):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapDKRedPalette;
        // hMineSurface->p16BPPPalette = pMapDKRedPalette;
        // hSAMSurface->p16BPPPalette = pMapDKRedPalette;

        // lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        Blt8BPPDataTo16BPPBufferHalfRect(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // now blit
        // Blt8BPPDataSubTo16BPPBuffer( pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf,uiSrcPitchBYTES, sScreenX , sScreenY , &clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);
        break;
    }

    // restore original palette
    if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
      return false;
    }
    hSrcVSurface.value.p16BPPPalette = pOriginalPallette;
    // hMineSurface->p16BPPPalette = pOriginalPallette;
    // hSAMSurface->p16BPPPalette = pOriginalPallette;
  }

  return true;
}

function ShadeMapElemZoomIn(sMapX: INT16, sMapY: INT16, iColor: INT32): boolean {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let iX: INT32;
  let iY: INT32;
  let hSrcVSurface: HVSURFACE;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  // UINT8 *pDestBuf2;
  let pSrcBuf: Pointer<UINT8>;
  let clip: SGPRect = createSGPRect();
  let pOriginalPallette: Pointer<UINT16>;

  // get sX and sY
  iX = sMapX;
  iY = sMapY;

  // trabslate to screen co-ords for zoomed
  ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXYStationary(((iX)), ((iY))));

  // shift left by one sector
  iY = sScreenY - MAP_GRID_Y;
  iX = sScreenX - MAP_GRID_X;

  // get original video surface palette
  if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
    return false;
  }
  pOriginalPallette = hSrcVSurface.value.p16BPPPalette;

  if ((iX > MapScreenRect.iLeft - MAP_GRID_X * 2) && (iX < MapScreenRect.iRight) && (iY > MapScreenRect.iTop - MAP_GRID_Y * 2) && (iY < MapScreenRect.iBottom)) {
    sScreenX = iX;
    sScreenY = iY;

    if (iColor == Enum157.MAP_SHADE_BLACK) {
      clip.iLeft = sScreenX + 1;
      clip.iRight = sScreenX + MAP_GRID_X * 2 - 1;
      clip.iTop = sScreenY;
      clip.iBottom = sScreenY + MAP_GRID_Y * 2 - 1;
    } else {
      clip.iLeft = iZoomX + sScreenX - MAP_VIEW_START_X - MAP_GRID_X;
      clip.iRight = clip.iLeft + MAP_GRID_X * 2;
      clip.iTop = iZoomY + sScreenY - MAP_VIEW_START_Y - MAP_GRID_Y;
      clip.iBottom = clip.iTop + MAP_GRID_Y * 2;

      if (sScreenY <= MapScreenRect.iTop + 10) {
        clip.iTop -= 5;
        sScreenY -= 5;
      }

      if (sMapX == 1) {
        clip.iLeft -= 5;
        sScreenX -= 4;
      } else {
        sScreenX += 1;
      }
    }

    if (sScreenX >= MapScreenRect.iRight - 2 * MAP_GRID_X) {
      clip.iRight++;
    }

    if (sScreenY >= MapScreenRect.iBottom - 2 * MAP_GRID_X) {
      clip.iBottom++;
    }

    sScreenX += 1;
    sScreenY += 1;

    if ((sScreenX > MapScreenRect.iRight) || (sScreenY > MapScreenRect.iBottom)) {
      return false;
    }

    switch (iColor) {
      case (Enum157.MAP_SHADE_BLACK):
        // simply shade darker
        if (iCurrentMapSectorZ > 0) {
          ShadowVideoSurfaceRect(guiSAVEBUFFER, clip.iLeft, clip.iTop, clip.iRight, clip.iBottom);
        }
        ShadowVideoSurfaceRect(guiSAVEBUFFER, clip.iLeft, clip.iTop, clip.iRight, clip.iBottom);
        break;

      case (Enum157.MAP_SHADE_LT_GREEN):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapLTGreenPalette;

        // lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        // now blit
        Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);

        break;

      case (Enum157.MAP_SHADE_DK_GREEN):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapDKGreenPalette;

        /// lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        // now blit
        Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);

        break;

      case (Enum157.MAP_SHADE_LT_RED):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapLTRedPalette;

        // lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        // now blit
        Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);

        break;

      case (Enum157.MAP_SHADE_DK_RED):
        // grab video surface and set palette
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        hSrcVSurface.value.p16BPPPalette = pMapDKRedPalette;

        // lock source and dest buffers
        pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
        if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
          return false;
        }
        pSrcBuf = LockVideoSurface(guiBIGMAP, addressof(uiSrcPitchBYTES));

        // now blit
        Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, sScreenX, sScreenY, clip);

        // unlock source and dest buffers
        UnLockVideoSurface(guiBIGMAP);
        UnLockVideoSurface(guiSAVEBUFFER);

        break;
    }
  }

  // restore original palette
  if ((hSrcVSurface = GetVideoSurface(guiBIGMAP)) === null) {
    return false;
  }
  hSrcVSurface.value.p16BPPPalette = pOriginalPallette;

  return true;
}

export function InitializePalettesForMap(): boolean {
  // init palettes
  let hSrcVSurface: HVSURFACE;
  let pPalette: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let uiTempMap: UINT32;

  // load image
  vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.ImageFile = "INTERFACE\\b_map.pcx";
  if ((uiTempMap = AddVideoSurface(vs_desc)) === -1) {
    return false;
  }

  // get video surface
  if ((hSrcVSurface = GetVideoSurface(uiTempMap)) === null) {
    return false;
  }
  GetVSurfacePaletteEntries(hSrcVSurface, pPalette);

  // set up various palettes
  pMapLTRedPalette = Create16BPPPaletteShaded(pPalette, 400, 0, 0, true);
  pMapDKRedPalette = Create16BPPPaletteShaded(pPalette, 200, 0, 0, true);
  pMapLTGreenPalette = Create16BPPPaletteShaded(pPalette, 0, 400, 0, true);
  pMapDKGreenPalette = Create16BPPPaletteShaded(pPalette, 0, 200, 0, true);

  // delete image
  DeleteVideoSurfaceFromIndex(uiTempMap);

  return true;
}

export function ShutDownPalettesForMap(): void {
  pMapLTRedPalette = null;
  pMapDKRedPalette = null;
  pMapLTGreenPalette = null;
  pMapDKGreenPalette = null;

  return;
}

export function PlotPathForCharacter(pCharacter: SOLDIERTYPE, sX: INT16, sY: INT16, fTacticalTraversal: boolean): void {
  // will plot a path for this character

  // is cursor allowed here?..if not..don't build path
  if (!IsTheCursorAllowedToHighLightThisSector(sX, sY)) {
    return;
  }

  // is the character in transit?..then leave
  if (pCharacter.bAssignment == Enum117.IN_TRANSIT) {
    // leave
    return;
  }

  if (pCharacter.bSectorZ != 0) {
    if (pCharacter.bAssignment >= Enum117.ON_DUTY) {
      // not on the surface, character won't move until they reach surface..info player of this fact
      MapScreenMessage(FONT_MCOLOR_DKRED, MSG_INTERFACE, "%s %s", pCharacter.name, gsUndergroundString[0]);
    } else // squad
    {
      MapScreenMessage(FONT_MCOLOR_DKRED, MSG_INTERFACE, "%s %s", pLongAssignmentStrings[pCharacter.bAssignment], gsUndergroundString[0]);
    }
    return;
  }

  if ((pCharacter.bAssignment == Enum117.VEHICLE) || (pCharacter.uiStatusFlags & SOLDIER_VEHICLE)) {
    SetUpMvtGroupForVehicle(pCharacter);
  }

  // make sure we are at the beginning
  pCharacter.pMercPath = <PathSt>MoveToBeginningOfPathList(pCharacter.pMercPath);

  // will plot a path from current position to sX, sY
  // get last sector in characters list, build new path, remove tail section, move to beginning of list, and append onto old list
  pCharacter.pMercPath = <PathSt>AppendStrategicPath(MoveToBeginningOfPathList(BuildAStrategicPath(null, GetLastSectorIdInCharactersPath(pCharacter), (sX + sY * (MAP_WORLD_X)), GetSoldierGroupId(pCharacter), fTacticalTraversal /*, FALSE */)), pCharacter.pMercPath);

  // move to beginning of list
  pCharacter.pMercPath = <PathSt>MoveToBeginningOfPathList(pCharacter.pMercPath);

  // check if in vehicle, if so, copy path to vehicle
  if ((pCharacter.bAssignment == Enum117.VEHICLE) || (pCharacter.uiStatusFlags & SOLDIER_VEHICLE)) {
    MoveCharactersPathToVehicle(pCharacter);
  } else {
    CopyPathToCharactersSquadIfInOne(pCharacter);
  }
}

export function PlotATemporaryPathForCharacter(pCharacter: SOLDIERTYPE, sX: INT16, sY: INT16): void {
  // make sure we're at the beginning
  pTempCharacterPath = MoveToBeginningOfPathList(pTempCharacterPath);

  // clear old temp path
  pTempCharacterPath = ClearStrategicPathList(pTempCharacterPath, -1);

  // is cursor allowed here?..if not..don't build temp path
  if (!IsTheCursorAllowedToHighLightThisSector(sX, sY)) {
    return;
  }

  // build path
  pTempCharacterPath = BuildAStrategicPath(pTempCharacterPath, GetLastSectorIdInCharactersPath(pCharacter), (sX + sY * (MAP_WORLD_X)), GetSoldierGroupId(pCharacter), false /*, TRUE */);

  return;
}

// clear out character path list, after and including this sector
export function ClearPathAfterThisSectorForCharacter(pCharacter: SOLDIERTYPE, sX: INT16, sY: INT16): UINT32 {
  let iOrigLength: INT32 = 0;
  let pVehicle: VEHICLETYPE | null = null;

  iOrigLength = GetLengthOfMercPath(pCharacter);

  if (!iOrigLength) {
    // no previous path, nothing to do
    return Enum158.ABORT_PLOTTING;
  }

  // if we're clearing everything beyond the current sector, that's quite different.  Since we're basically cancelling
  // his movement completely, we must also make sure his next X,Y are changed and he officially "returns" to his sector
  if ((sX == pCharacter.sSectorX) && (sY == pCharacter.sSectorY)) {
    // if we're in confirm map move mode, cancel that (before new UI messages are issued)
    EndConfirmMapMoveMode();

    CancelPathsOfAllSelectedCharacters();
    return Enum158.PATH_CLEARED;
  } else // click not in the current sector
  {
    // if the clicked sector is along current route, this will repath only as far as it.  If not, the entire path will
    // be canceled.

    // if a vehicle
    if (pCharacter.uiStatusFlags & SOLDIER_VEHICLE) {
      pVehicle = pVehicleList[pCharacter.bVehicleID];
    }
    // or in a vehicle
    else if (pCharacter.bAssignment == Enum117.VEHICLE) {
      pVehicle = pVehicleList[pCharacter.iVehicleId];
    } else {
      // foot soldier
      pCharacter.pMercPath = <PathSt>ClearStrategicPathListAfterThisSector(pCharacter.pMercPath, sX, sY, pCharacter.ubGroupID);
    }

    // if there's an associated vehicle structure
    if (pVehicle != null) {
      // do it for the vehicle, too
      pVehicle.pMercPath = ClearStrategicPathListAfterThisSector(pVehicle.pMercPath, sX, sY, pVehicle.ubMovementGroup);
    }

    if (GetLengthOfMercPath(pCharacter) < iOrigLength) {
      CopyPathToAllSelectedCharacters(pCharacter.pMercPath);
      // path WAS actually shortened
      return Enum158.PATH_SHORTENED;
    } else {
      // same path as before - it's not any shorter
      return Enum158.ABORT_PLOTTING;
    }
  }
}

export function CancelPathForCharacter(pCharacter: SOLDIERTYPE): void {
  // clear out character's entire path list, he and his squad will stay/return to his current sector.
  pCharacter.pMercPath = <PathSt>ClearStrategicPathList(pCharacter.pMercPath, pCharacter.ubGroupID);
  // NOTE: This automatically calls RemoveGroupWaypoints() internally for valid movement groups

  // This causes the group to effectively reverse directions (even if they've never actually left), so handle that.
  // They are going to return to their current X,Y sector.
  RebuildWayPointsForGroupPath(pCharacter.pMercPath, pCharacter.ubGroupID);
  //	GroupReversingDirectionsBetweenSectors( GetGroup( pCharacter->ubGroupID ), ( UINT8 )( pCharacter->sSectorX ), ( UINT8 )( pCharacter->sSectorY ), FALSE );

  // if he's in a vehicle, clear out the vehicle, too
  if (pCharacter.bAssignment == Enum117.VEHICLE) {
    CancelPathForVehicle(pVehicleList[pCharacter.iVehicleId], true);
  } else {
    // display "travel route canceled" message
    MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[3]);
  }

  CopyPathToCharactersSquadIfInOne(pCharacter);

  fMapPanelDirty = true;
  fTeamPanelDirty = true;
  fCharacterInfoPanelDirty = true; // to update ETA
}

export function CancelPathForVehicle(pVehicle: VEHICLETYPE, fAlreadyReversed: boolean): void {
  // we're clearing everything beyond the *current* sector, that's quite different.  Since we're basically cancelling
  // his movement completely, we must also make sure his next X,Y are changed and he officially "returns" to his sector
  pVehicle.pMercPath = ClearStrategicPathList(pVehicle.pMercPath, pVehicle.ubMovementGroup);
  // NOTE: This automatically calls RemoveGroupWaypoints() internally for valid movement groups

  // if we already reversed one of the passengers, flag will be TRUE,
  // don't do it again or we're headed back where we came from!
  if (!fAlreadyReversed) {
    // This causes the group to effectively reverse directions (even if they've never actually left), so handle that.
    // They are going to return to their current X,Y sector.
    RebuildWayPointsForGroupPath(pVehicle.pMercPath, pVehicle.ubMovementGroup);
    //		GroupReversingDirectionsBetweenSectors( GetGroup( pVehicle->ubMovementGroup ), ( UINT8 ) ( pVehicle->sSectorX ), ( UINT8 ) ( pVehicle->sSectorY ), FALSE );
  }

  // display "travel route canceled" message
  MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[3]);

  // turn the helicopter flag off here, this prevents the "route aborted" msg from coming up
  fPlotForHelicopter = false;

  fTeamPanelDirty = true;
  fMapPanelDirty = true;
  fCharacterInfoPanelDirty = true; // to update ETA
}

function CancelPathForGroup(pGroup: GROUP): void {
  let iVehicleId: INT32;

  // if it's the chopper, but player can't redirect it
  if (pGroup.fPlayer && IsGroupTheHelicopterGroup(pGroup) && (CanHelicopterFly() == false)) {
    // explain & ignore
    ExplainWhySkyriderCantFly();
    return;
  }

  // is it a non-vehicle group?
  if ((pGroup.fPlayer) && (pGroup.fVehicle == false)) {
    if (pGroup.pPlayerList) {
      if (pGroup.pPlayerList.pSoldier) {
        // clearing one merc should be enough, it copies changes to his squad on its own
        CancelPathForCharacter(pGroup.pPlayerList.pSoldier);
      }
    }
  }
  // is it a vehicle group?
  else if (pGroup.fVehicle) {
    iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);

    // must be valid!
    Assert(iVehicleId != -1);
    if (iVehicleId == -1)
      return;

    CancelPathForVehicle(pVehicleList[iVehicleId], false);
  }
}

function CopyPathToCharactersSquadIfInOne(pCharacter: SOLDIERTYPE): void {
  let bSquad: INT8 = 0;

  // check if on a squad, if so, do same thing for all characters

  // what squad is character in?
  bSquad = SquadCharacterIsIn(pCharacter);

  // check to see if character is on a squad, if so, copy path to squad
  if (bSquad != -1) {
    // copy path over
    CopyPathOfCharacterToSquad(pCharacter, bSquad);
  }
}

export function DisplaySoldierPath(pCharacter: SOLDIERTYPE): void {
  let pPath: PathSt | null = null;

  /* ARM: Hopefully no longer required once using GetSoldierMercPathPtr() ???
          // check if in vehicle, if so, copy path to vehicle
          if( ( pCharacter->bAssignment == VEHICLE )||( pCharacter->uiStatusFlags & SOLDIER_VEHICLE ) )
          {
                  // get the real path from vehicle's structure and copy it into this soldier's
                  CopyVehiclePathToSoldier( pCharacter );
          }
  */

  pPath = GetSoldierMercPathPtr(pCharacter);

  // trace real route
  TracePathRoute(false, true, pPath);
  AnimateRoute(pPath);

  return;
}

export function DisplaySoldierTempPath(pCharacter: SOLDIERTYPE): void {
  // now render temp route
  TracePathRoute(false, true, pTempCharacterPath);

  return;
}

export function DisplayHelicopterPath(): void {
  // move to beginning of path list
  pVehicleList[iHelicopterVehicleId].pMercPath = MoveToBeginningOfPathList(pVehicleList[iHelicopterVehicleId].pMercPath);

  // clip to map
  ClipBlitsToMapViewRegion();

  // trace both lists..temp is conditional if cursor has sat in same sector grid long enough
  TracePathRoute(true, true, pVehicleList[iHelicopterVehicleId].pMercPath);
  AnimateRoute(pVehicleList[iHelicopterVehicleId].pMercPath);

  // restore
  RestoreClipRegionToFullScreen();

  return;
}

export function DisplayHelicopterTempPath(): void {
  // should we draw temp path?
  if (fDrawTempHeliPath) {
    TracePathRoute(true, true, pTempHelicopterPath);
  }

  return;
}

export function PlotPathForHelicopter(sX: INT16, sY: INT16): void {
  // will plot the path for the helicopter

  // no heli...go back
  if (!fShowAircraftFlag || !fHelicopterAvailable) {
    return;
  }

  // is cursor allowed here?..if not..don't build path
  if (!IsTheCursorAllowedToHighLightThisSector(sX, sY)) {
    return;
  }

  // set up mvt group for helicopter
  SetUpHelicopterForMovement();

  // move to beginning of list
  // pHelicopterPath = MoveToBeginningOfPathList( pVehicleList[ iHelicopterVehicleId ].pMercPath );
  MoveToBeginningOfPathList(pVehicleList[iHelicopterVehicleId].pMercPath);

  // will plot a path from current position to sX, sY
  // get last sector in helicopters list, build new path, remove tail section, move to beginning of list, and append onto old list
  pVehicleList[iHelicopterVehicleId].pMercPath = AppendStrategicPath(MoveToBeginningOfPathList(BuildAStrategicPath(null, GetLastSectorOfHelicoptersPath(), (sX + sY * (MAP_WORLD_X)), pVehicleList[iHelicopterVehicleId].ubMovementGroup, false /*, FALSE */)), pVehicleList[iHelicopterVehicleId].pMercPath);

  // move to beginning of list
  pVehicleList[iHelicopterVehicleId].pMercPath = MoveToBeginningOfPathList(pVehicleList[iHelicopterVehicleId].pMercPath);

  fMapPanelDirty = true;

  return;
}

export function PlotATemporaryPathForHelicopter(sX: INT16, sY: INT16): void {
  // clear old temp path
  pTempHelicopterPath = ClearStrategicPathList(pTempHelicopterPath, 0);

  // is cursor allowed here?..if not..don't build temp path
  if (!IsTheCursorAllowedToHighLightThisSector(sX, sY)) {
    return;
  }

  // build path
  pTempHelicopterPath = BuildAStrategicPath(null, GetLastSectorOfHelicoptersPath(), (sX + sY * (MAP_WORLD_X)), pVehicleList[iHelicopterVehicleId].ubMovementGroup, false /*, TRUE */);

  return;
}

// clear out helicopter path list, after and including this sector
export function ClearPathAfterThisSectorForHelicopter(sX: INT16, sY: INT16): UINT32 {
  let pVehicle: VEHICLETYPE;
  let iOrigLength: INT32 = 0;

  // clear out helicopter path list, after and including this sector
  if (iHelicopterVehicleId == -1 || !CanHelicopterFly()) {
    // abort plotting, shouldn't even be here
    return Enum158.ABORT_PLOTTING;
  }

  pVehicle = pVehicleList[iHelicopterVehicleId];

  iOrigLength = GetLengthOfPath(pVehicle.pMercPath);
  if (!iOrigLength) {
    // no previous path, nothing to do, and we didn't shorten it
    return Enum158.ABORT_PLOTTING;
  }

  // are we clearing everything beyond the helicopter's CURRENT sector?
  if ((sX == pVehicle.sSectorX) && (sY == pVehicle.sSectorY)) {
    // if we're in confirm map move mode, cancel that (before new UI messages are issued)
    EndConfirmMapMoveMode();

    CancelPathForVehicle(pVehicle, false);
    return Enum158.PATH_CLEARED;
  } else // click not in the current sector
  {
    // if the clicked sector is along current route, this will repath only as far as it.  If not, the entire path will
    // be canceled.
    pVehicle.pMercPath = ClearStrategicPathListAfterThisSector(pVehicle.pMercPath, sX, sY, pVehicle.ubMovementGroup);

    if (GetLengthOfPath(pVehicle.pMercPath) < iOrigLength) {
      // really shortened!
      return Enum158.PATH_SHORTENED;
    } else {
      // same path as before - it's not any shorter
      return Enum158.ABORT_PLOTTING;
    }
  }
}

export function GetLastSectorOfHelicoptersPath(): INT16 {
  // will return the last sector of the helicopter's current path
  let sLastSector: INT16 = pVehicleList[iHelicopterVehicleId].sSectorX + pVehicleList[iHelicopterVehicleId].sSectorY * MAP_WORLD_X;
  let pNode: PathSt | null = null;

  pNode = pVehicleList[iHelicopterVehicleId].pMercPath;

  while (pNode) {
    sLastSector = (pNode.uiSectorId);
    pNode = pNode.pNext;
  }

  return sLastSector;
}

function TracePathRoute(fCheckFlag: boolean, fForceUpDate: boolean, pPath: PathSt | null): boolean {
  let pCurrentNode: PathSt | null = null;
  let fSpeedFlag: boolean = false;
  let fUpDate: boolean = false;
  let iDifference: INT32 = 0;
  let iArrow: INT32 = -1;
  let iX: INT32;
  let iY: INT32;
  let sX: INT16;
  let sY: INT16;
  let iArrowX: INT32;
  let iArrowY: INT32;
  let iDeltaA: INT32;
  let iDeltaB: INT32;
  let iDeltaB1: INT32;
  let iDirection: INT32 = 0;
  let fUTurnFlag: boolean = false;
  let fNextNode: boolean = false;
  let pTempNode: PathSt | null = null;
  let pNode: PathSt | null = null;
  let pPastNode: PathSt | null = null;
  let pNextNode: PathSt | null = null;
  let ubCounter: UINT32 = 1;
  let hMapHandle: SGPVObject;

  if (pPath == null) {
    return false;
  }

  while (pPath.pPrev) {
    pPath = pPath.pPrev;
  }

  pNode = pPath;

  iDirection = -1;
  if (pNode.pNext)
    pNextNode = pNode.pNext;
  else
    pNextNode = null;
  if (pNode.pPrev)
    pPastNode = pNode.pPrev;
  else
    pPastNode = null;

  hMapHandle = GetVideoObject(guiMAPCURSORS);
  // go through characters list and display arrows for path
  while (pNode) {
    fUTurnFlag = false;
    if ((pPastNode) && (pNextNode)) {
      iDeltaA = pNode.uiSectorId - pPastNode.uiSectorId;
      iDeltaB = pNode.uiSectorId - pNextNode.uiSectorId;
      if (iDeltaA == 0)
        return false;
      if (pNode.fSpeed)
        fSpeedFlag = false;
      else
        fSpeedFlag = true;
      if (!fZoomFlag) {
        iX = (pNode.uiSectorId % MAP_WORLD_X);
        iY = (pNode.uiSectorId / MAP_WORLD_X);
        iX = (iX * MAP_GRID_X) + MAP_VIEW_START_X;
        iY = (iY * MAP_GRID_Y) + MAP_VIEW_START_Y;
      } else {
        ({ sX, sY } = GetScreenXYFromMapXYStationary(((pNode.uiSectorId % MAP_WORLD_X)), ((pNode.uiSectorId / MAP_WORLD_X))));
        iY = sY - MAP_GRID_Y;
        iX = sX - MAP_GRID_X;
      }
      iArrowX = iX;
      iArrowY = iY;
      if ((pPastNode.pPrev) && (pNextNode.pNext)) {
        fUTurnFlag = false;
        // check to see if out-of sector U-turn
        // for placement of arrows
        iDeltaB1 = pNextNode.uiSectorId - pNextNode.pNext.uiSectorId;
        if ((iDeltaB1 == -WORLD_MAP_X) && (iDeltaA == -WORLD_MAP_X) && (iDeltaB == -1)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == -WORLD_MAP_X) && (iDeltaA == -WORLD_MAP_X) && (iDeltaB == 1)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == WORLD_MAP_X) && (iDeltaA == WORLD_MAP_X) && (iDeltaB == 1)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == -WORLD_MAP_X) && (iDeltaA == -WORLD_MAP_X) && (iDeltaB == 1)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == -1) && (iDeltaA == -1) && (iDeltaB == -WORLD_MAP_X)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == -1) && (iDeltaA == -1) && (iDeltaB == WORLD_MAP_X)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == 1) && (iDeltaA == 1) && (iDeltaB == -WORLD_MAP_X)) {
          fUTurnFlag = true;
        } else if ((iDeltaB1 == 1) && (iDeltaA == 1) && (iDeltaB == WORLD_MAP_X)) {
          fUTurnFlag = true;
        } else
          fUTurnFlag = false;
      }

      if ((pPastNode.uiSectorId == pNextNode.uiSectorId)) {
        if (pPastNode.uiSectorId + WORLD_MAP_X == pNode.uiSectorId) {
          if (!(pNode.fSpeed))
            fSpeedFlag = true;
          else
            fSpeedFlag = false;

          if (fZoomFlag) {
            iDirection = S_TO_N_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_NORTH_ARROW;
            else
              iArrow = ZOOM_NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X * 2;
            iArrowY += NORTH_OFFSET_Y * 2;
          } else {
            iDirection = S_TO_N_LINE;
            if (fSpeedFlag)
              iArrow = Y_NORTH_ARROW;
            else
              iArrow = NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X;
            iArrowY += NORTH_OFFSET_Y;
          }
        } else if (pPastNode.uiSectorId - WORLD_MAP_X == pNode.uiSectorId) {
          if (fZoomFlag) {
            iDirection = N_TO_S_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_SOUTH_ARROW;
            else
              iArrow = ZOOM_SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X * 2;
            iArrowY += SOUTH_OFFSET_Y * 2;
          } else {
            iDirection = N_TO_S_LINE;
            if (fSpeedFlag)
              iArrow = Y_SOUTH_ARROW;
            else
              iArrow = SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X;
            iArrowY += SOUTH_OFFSET_Y;
          }
        } else if (pPastNode.uiSectorId + 1 == pNode.uiSectorId) {
          if (fZoomFlag) {
            iDirection = E_TO_W_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_WEST_ARROW;
            else
              iArrow = ZOOM_WEST_ARROW;
            iArrowX += WEST_OFFSET_X * 2;
            iArrowY += WEST_OFFSET_Y * 2;
          } else {
            iDirection = E_TO_W_LINE;
            if (fSpeedFlag)
              iArrow = Y_WEST_ARROW;
            else
              iArrow = WEST_ARROW;
            iArrowX += WEST_OFFSET_X;
            iArrowY += WEST_OFFSET_Y;
          }
        } else {
          if (fZoomFlag) {
            iDirection = W_TO_E_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_EAST_ARROW;
            else
              iArrow = ZOOM_EAST_ARROW;
            iArrowX += EAST_OFFSET_X * 2;
            iArrowY += EAST_OFFSET_Y * 2;
          } else {
            iDirection = W_TO_E_LINE;
            if (fSpeedFlag)
              iArrow = Y_EAST_ARROW;
            else
              iArrow = EAST_ARROW;
            iArrowX += EAST_OFFSET_X;
            iArrowY += EAST_OFFSET_Y;
          }
        }
      } else {
        if ((iDeltaA == -1) && (iDeltaB == 1)) {
          /*
                                                  if( pPastNode == NULL )
                                                  {
                                                          fSpeedFlag = !fSpeedFlag;
                                                  }

          */
          if (fZoomFlag) {
            iDirection = WEST_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_WEST_ARROW;
            else
              iArrow = ZOOM_WEST_ARROW;
            iArrowX += WEST_OFFSET_X * 2;
            iArrowY += WEST_OFFSET_Y * 2;
          } else {
            iDirection = WEST_LINE;
            if (fSpeedFlag)
              iArrow = Y_WEST_ARROW;
            else
              iArrow = WEST_ARROW;
            iArrowX += WEST_OFFSET_X;
            iArrowY += WEST_OFFSET_Y;
          }
        } else if ((iDeltaA == 1) && (iDeltaB == -1)) {
          if (fZoomFlag) {
            iDirection = EAST_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_EAST_ARROW;
            else
              iArrow = ZOOM_EAST_ARROW;
            iArrowX += EAST_OFFSET_X * 2;
            iArrowY += EAST_OFFSET_Y * 2;
          } else {
            iDirection = EAST_LINE;
            if (fSpeedFlag)
              iArrow = Y_EAST_ARROW;
            else
              iArrow = EAST_ARROW;
            iArrowX += EAST_OFFSET_X;
            iArrowY += EAST_OFFSET_Y;
          }
        } else if ((iDeltaA == -WORLD_MAP_X) && (iDeltaB == WORLD_MAP_X)) {
          if (fZoomFlag) {
            iDirection = NORTH_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_NORTH_ARROW;
            else
              iArrow = ZOOM_NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X * 2;
            iArrowY += NORTH_OFFSET_Y * 2;
          } else {
            iDirection = NORTH_LINE;
            if (fSpeedFlag)
              iArrow = Y_NORTH_ARROW;
            else
              iArrow = NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X;
            iArrowY += NORTH_OFFSET_Y;
          }
        } else if ((iDeltaA == WORLD_MAP_X) && (iDeltaB == -WORLD_MAP_X)) {
          if (fZoomFlag) {
            iDirection = SOUTH_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_SOUTH_ARROW;
            else
              iArrow = ZOOM_SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X * 2;
            iArrowY += SOUTH_OFFSET_Y * 2;
          } else {
            iDirection = SOUTH_LINE;
            if (fSpeedFlag)
              iArrow = Y_SOUTH_ARROW;
            else
              iArrow = SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X;
            iArrowY += SOUTH_OFFSET_Y;
          }
        } else if ((iDeltaA == -WORLD_MAP_X) && (iDeltaB == -1)) {
          if (fZoomFlag) {
            iDirection = N_TO_E_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_EAST_ARROW;
            else
              iArrow = ZOOM_EAST_ARROW;
            iArrowX += EAST_OFFSET_X * 2;
            iArrowY += EAST_OFFSET_Y * 2;
          } else {
            iDirection = N_TO_E_LINE;
            if (fSpeedFlag)
              iArrow = Y_EAST_ARROW;
            else
              iArrow = EAST_ARROW;
            iArrowX += EAST_OFFSET_X;
            iArrowY += EAST_OFFSET_Y;
          }
        } else if ((iDeltaA == WORLD_MAP_X) && (iDeltaB == 1)) {
          if (fZoomFlag) {
            iDirection = S_TO_W_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_WEST_ARROW;
            else
              iArrow = ZOOM_WEST_ARROW;
            iArrowX += WEST_OFFSET_X * 2;
            iArrowY += WEST_OFFSET_Y * 2;
          } else {
            iDirection = S_TO_W_LINE;
            if (fSpeedFlag)
              iArrow = Y_WEST_ARROW;
            else
              iArrow = WEST_ARROW;
            iArrowX += WEST_OFFSET_X;
            iArrowY += WEST_OFFSET_Y;
          }
        } else if ((iDeltaA == 1) && (iDeltaB == -WORLD_MAP_X)) {
          if (fZoomFlag) {
            iDirection = E_TO_S_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_SOUTH_ARROW;
            else
              iArrow = ZOOM_SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X * 2;
            iArrowY += SOUTH_OFFSET_Y * 2;
          } else {
            iDirection = E_TO_S_LINE;
            if (fSpeedFlag)
              iArrow = Y_SOUTH_ARROW;
            else
              iArrow = SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X;
            iArrowY += SOUTH_OFFSET_Y;
          }
        } else if ((iDeltaA == -1) && (iDeltaB == WORLD_MAP_X)) {
          if (fZoomFlag) {
            iDirection = W_TO_N_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_NORTH_ARROW;
            else
              iArrow = ZOOM_NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X * 2;
            iArrowY += NORTH_OFFSET_Y * 2;
          } else {
            iDirection = W_TO_N_LINE;
            if (fSpeedFlag)
              iArrow = Y_NORTH_ARROW;
            else
              iArrow = NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X;
            iArrowY += NORTH_OFFSET_Y;
          }
        } else if ((iDeltaA == -1) && (iDeltaB == -WORLD_MAP_X)) {
          if (fZoomFlag) {
            iDirection = W_TO_S_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_SOUTH_ARROW;
            else
              iArrow = ZOOM_SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X * 2;
            iArrowY += (SOUTH_OFFSET_Y + WEST_TO_SOUTH_OFFSET_Y) * 2;
          } else {
            iDirection = W_TO_S_LINE;
            if (fSpeedFlag)
              iArrow = Y_SOUTH_ARROW;
            else
              iArrow = SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X;
            iArrowY += (SOUTH_OFFSET_Y + WEST_TO_SOUTH_OFFSET_Y);
          }
        } else if ((iDeltaA == -WORLD_MAP_X) && (iDeltaB == 1)) {
          if (fZoomFlag) {
            iDirection = N_TO_W_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_WEST_ARROW;
            else
              iArrow = ZOOM_WEST_ARROW;
            iArrowX += WEST_OFFSET_X * 2;
            iArrowY += WEST_OFFSET_Y * 2;
          } else {
            iDirection = N_TO_W_LINE;
            if (fSpeedFlag)
              iArrow = Y_WEST_ARROW;
            else
              iArrow = WEST_ARROW;
            iArrowX += WEST_OFFSET_X;
            iArrowY += WEST_OFFSET_Y;
          }
        } else if ((iDeltaA == WORLD_MAP_X) && (iDeltaB == -1)) {
          if (fZoomFlag) {
            iDirection = S_TO_E_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_EAST_ARROW;
            else
              iArrow = ZOOM_EAST_ARROW;
            iArrowX += EAST_OFFSET_X * 2;
            iArrowY += EAST_OFFSET_Y * 2;
          } else {
            iDirection = S_TO_E_LINE;
            if (fSpeedFlag)
              iArrow = Y_EAST_ARROW;
            else
              iArrow = EAST_ARROW;
            iArrowX += EAST_OFFSET_X;
            iArrowY += EAST_OFFSET_Y;
          }
        } else if ((iDeltaA == 1) && (iDeltaB == WORLD_MAP_X)) {
          if (fZoomFlag) {
            iDirection = E_TO_N_ZOOM_LINE;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_NORTH_ARROW;
            else
              iArrow = ZOOM_NORTH_ARROW;
            iArrowX += (NORTH_OFFSET_X * 2);
            iArrowY += (NORTH_OFFSET_Y + EAST_TO_NORTH_OFFSET_Y) * 2;
          } else {
            iDirection = E_TO_N_LINE;
            if (fSpeedFlag)
              iArrow = Y_NORTH_ARROW;
            else
              iArrow = NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X;
            iArrowY += NORTH_OFFSET_Y + EAST_TO_NORTH_OFFSET_Y;
          }
        }
      }
    } else {
      if (!fZoomFlag) {
        iX = (pNode.uiSectorId % MAP_WORLD_X);
        iY = (pNode.uiSectorId / MAP_WORLD_X);
        iX = (iX * MAP_GRID_X) + MAP_VIEW_START_X;
        iY = (iY * MAP_GRID_Y) + MAP_VIEW_START_Y;
      } else {
        ({ sX, sY } = GetScreenXYFromMapXYStationary(((pNode.uiSectorId % MAP_WORLD_X)), ((pNode.uiSectorId / MAP_WORLD_X))));
        iY = sY - MAP_GRID_Y;
        iX = sX - MAP_GRID_X;
      }
      iArrowX = iX;
      iArrowY = iY;
      if ((pNode.fSpeed))
        fSpeedFlag = false;
      else
        fSpeedFlag = true;
      // display enter and exit 'X's
      if (pPastNode) {
        fUTurnFlag = true;
        iDeltaA = pNode.uiSectorId - pPastNode.uiSectorId;
        if (iDeltaA == -1) {
          if (fZoomFlag) {
            iDirection = ZOOM_RED_X_WEST;
            // iX-=MAP_GRID_X;
            // iY-=MAP_GRID_Y;
          } else
            iDirection = RED_X_WEST;
          // iX+=RED_WEST_OFF_X;
        } else if (iDeltaA == 1) {
          if (fZoomFlag) {
            iDirection = ZOOM_RED_X_EAST;
          } else
            iDirection = RED_X_EAST;
          // iX+=RED_EAST_OFF_X;
        } else if (iDeltaA == -WORLD_MAP_X) {
          if (fZoomFlag) {
            iDirection = ZOOM_RED_X_NORTH;
          } else
            iDirection = RED_X_NORTH;
          // iY+=RED_NORTH_OFF_Y;
        } else {
          if (fZoomFlag) {
            iDirection = ZOOM_RED_X_SOUTH;
          } else
            iDirection = RED_X_SOUTH;
          //	iY+=RED_SOUTH_OFF_Y;
        }
      }
      if (pNextNode) {
        fUTurnFlag = false;
        iDeltaB = pNode.uiSectorId - pNextNode.uiSectorId;
        if ((pNode.fSpeed))
          fSpeedFlag = false;
        else
          fSpeedFlag = true;

        if (iDeltaB == -1) {
          if (fZoomFlag) {
            iDirection = ZOOM_GREEN_X_EAST;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_EAST_ARROW;
            else
              iArrow = ZOOM_EAST_ARROW;
            iX -= 0;
            MAP_GRID_X;
            iY -= 0;
            MAP_GRID_Y;
            iArrowX += EAST_OFFSET_X * 2;
            iArrowY += EAST_OFFSET_Y * 2;
          } else {
            iDirection = GREEN_X_EAST;
            if (fSpeedFlag)
              iArrow = Y_EAST_ARROW;
            else
              iArrow = EAST_ARROW;
            iArrowX += EAST_OFFSET_X;
            iArrowY += EAST_OFFSET_Y;
          }
          // iX+=RED_EAST_OFF_X;
        } else if (iDeltaB == 1) {
          if (fZoomFlag) {
            iDirection = ZOOM_GREEN_X_WEST;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_WEST_ARROW;
            else
              iArrow = ZOOM_WEST_ARROW;
            iArrowX += WEST_OFFSET_X * 2;
            iArrowY += WEST_OFFSET_Y * 2;
          } else {
            iDirection = GREEN_X_WEST;
            if (fSpeedFlag)
              iArrow = Y_WEST_ARROW;
            else
              iArrow = WEST_ARROW;
            iArrowX += WEST_OFFSET_X;
            iArrowY += WEST_OFFSET_Y;
          }
          // iX+=RED_WEST_OFF_X;
        } else if (iDeltaB == WORLD_MAP_X) {
          if (fZoomFlag) {
            iDirection = ZOOM_GREEN_X_NORTH;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_NORTH_ARROW;
            else
              iArrow = ZOOM_NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X * 2;
            iArrowY += NORTH_OFFSET_Y * 2;
          } else {
            iDirection = GREEN_X_NORTH;
            if (fSpeedFlag)
              iArrow = Y_NORTH_ARROW;
            else
              iArrow = NORTH_ARROW;
            iArrowX += NORTH_OFFSET_X;
            iArrowY += NORTH_OFFSET_Y;
            // iY+=RED_NORTH_OFF_Y;
          }
        } else {
          if (fZoomFlag) {
            iDirection = ZOOM_GREEN_X_SOUTH;
            if (fSpeedFlag)
              iArrow = ZOOM_Y_SOUTH_ARROW;
            else
              iArrow = ZOOM_SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X * 2;
            iArrowY += SOUTH_OFFSET_Y * 2;
          } else {
            iDirection = GREEN_X_SOUTH;
            if (fSpeedFlag)
              iArrow = Y_SOUTH_ARROW;
            else
              iArrow = SOUTH_ARROW;
            iArrowX += SOUTH_OFFSET_X;
            iArrowY += SOUTH_OFFSET_Y;
            // iY+=RED_SOUTH_OFF_Y;
          }
        }
      }
    }
    if ((iDirection != -1)) {
      if ((!fZoomFlag) || ((fZoomFlag) && (iX > MAP_VIEW_START_X) && (iY > MAP_VIEW_START_Y) && (iX < 640 - MAP_GRID_X * 2) && (iY < MAP_VIEW_START_Y + MAP_VIEW_HEIGHT))) {
        BltVideoObject(FRAME_BUFFER, hMapHandle, iDirection, iX, iY, VO_BLT_SRCTRANSPARENCY, null);

        if (!fUTurnFlag) {
          BltVideoObject(FRAME_BUFFER, hMapHandle, iArrow, iArrowX, iArrowY, VO_BLT_SRCTRANSPARENCY, null);
          InvalidateRegion(iArrowX, iArrowY, iArrowX + 2 * MAP_GRID_X, iArrowY + 2 * MAP_GRID_Y);
        }

        InvalidateRegion(iX, iY, iX + 2 * MAP_GRID_X, iY + 2 * MAP_GRID_Y);

        fUTurnFlag = false;
      }
    }
    // check to see if there is a turn

    pPastNode = pNode;
    pNode = pNode.pNext;
    if (!pNode)
      return false;
    if (pNode.pNext)
      pNextNode = pNode.pNext;
    else
      pNextNode = null;
  }

  return true;
}

function AnimateRoute(pPath: PathSt | null): void {
  // set buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // the animated path
  if (TraceCharAnimatedRoute(pPath, false, false)) {
    // ARM? Huh?  Why the same thing twice more?
    TraceCharAnimatedRoute(pPath, false, true);
    TraceCharAnimatedRoute(pPath, false, true);
  }
}

function RestoreArrowBackgroundsForTrace(iArrow: INT32, iArrowX: INT32, iArrowY: INT32, fZoom: boolean): void {
  let sArrow: INT16 = 0;
  let iX: INT32 = -1;
  let iY: INT32 = -1;
  // find location of arrow and restore appropriate background

  if ((iArrow == SOUTH_ARROW) || (iArrow == W_SOUTH_ARROW) || (iArrow == ZOOM_W_SOUTH_ARROW) || (ZOOM_SOUTH_ARROW == iArrow)) {
    sArrow = SOUTH_ARROW;
  } else if ((iArrow == NORTH_ARROW) || (iArrow == W_NORTH_ARROW) || (iArrow == ZOOM_W_NORTH_ARROW) || (ZOOM_NORTH_ARROW == iArrow)) {
    sArrow = NORTH_ARROW;
  } else if ((iArrow == WEST_ARROW) || (iArrow == W_WEST_ARROW) || (iArrow == ZOOM_W_WEST_ARROW) || (ZOOM_WEST_ARROW == iArrow)) {
    sArrow = WEST_ARROW;
  } else if ((iArrow == EAST_ARROW) || (iArrow == W_EAST_ARROW) || (iArrow == ZOOM_W_EAST_ARROW) || (ZOOM_EAST_ARROW == iArrow)) {
    sArrow = EAST_ARROW;
  }

  switch (sArrow) {
    case (SOUTH_ARROW):
      iX = iArrowX;
      iY = iArrowY;
      break;
    case (NORTH_ARROW):
      iX = iArrowX;
      iY = iArrowY;
      break;
    case (WEST_ARROW):
      iX = iArrowX;
      iY = iArrowY;
      break;
    case (EAST_ARROW):
      iX = iArrowX;
      iY = iArrowY;
      break;
  }

  // error check
  if (iX == -1) {
    return;
  }

  if (!fZoom)
    RestoreExternBackgroundRect((iX), (iY), DMAP_GRID_X / 2, DMAP_GRID_Y / 2);
  else
    RestoreExternBackgroundRect((iX), (iY), DMAP_GRID_ZOOM_X, DMAP_GRID_ZOOM_Y);

  return;
}

/* static */ let TraceCharAnimatedRoute__pCurrentNode: PathSt | null = null;
/* static */ let TraceCharAnimatedRoute__bCurrentChar: INT8 = -1;
/* static */ let TraceCharAnimatedRoute__fUpDateFlag: boolean = false;
/* static */ let TraceCharAnimatedRoute__fPauseFlag: boolean = true;
/* static */ let TraceCharAnimatedRoute__ubCounter: UINT8 = 1;
function TraceCharAnimatedRoute(pPath: PathSt | null, fCheckFlag: boolean, fForceUpDate: boolean): boolean {
  let hMapHandle: SGPVObject;
  let fSpeedFlag: boolean = false;
  let fUpDate: boolean = false;
  let iDifference: INT32 = 0;
  let iArrow: INT32 = -1;
  let iX: INT32 = 0;
  let iY: INT32 = 0;
  let iPastX: INT32;
  let iPastY: INT32;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let iArrowX: INT32;
  let iArrowY: INT32;
  let iDeltaA: INT32;
  let iDeltaB: INT32;
  let iDeltaB1: INT32;
  let iDirection: INT32 = -1;
  let fUTurnFlag: boolean = false;
  let fNextNode: boolean = false;
  let pTempNode: PathSt | null = null;
  let pNode: PathSt | null = null;
  let pPastNode: PathSt | null = null;
  let pNextNode: PathSt | null = null;

  // must be plotting movement
  if ((bSelectedDestChar == -1) && (fPlotForHelicopter == false)) {
    return false;
  }

  // if any nodes have been deleted, reset current node to beginning of the list
  if (fDeletedNode) {
    fDeletedNode = false;
    TraceCharAnimatedRoute__pCurrentNode = null;
  }

  // Valid path?
  if (pPath == null) {
    return false;
  } else {
    if (TraceCharAnimatedRoute__pCurrentNode == null) {
      TraceCharAnimatedRoute__pCurrentNode = pPath;
    }
  }

  // Check Timer
  if (giAnimateRouteBaseTime == 0) {
    giAnimateRouteBaseTime = GetJA2Clock();
    return false;
  }

  // check difference in time
  iDifference = GetJA2Clock() - giAnimateRouteBaseTime;

  // if pause flag, check time, if time passed, reset, continue on, else return
  if (TraceCharAnimatedRoute__fPauseFlag) {
    if (iDifference < PAUSE_DELAY) {
      return false;
    } else {
      TraceCharAnimatedRoute__fPauseFlag = false;
      giAnimateRouteBaseTime = GetJA2Clock();
    }
  }

  // if is checkflag and change in status, return TRUE;
  if (!fForceUpDate) {
    if (iDifference < ARROW_DELAY) {
      if (!TraceCharAnimatedRoute__fUpDateFlag)
        return false;
    } else {
      // sufficient time, update base time
      giAnimateRouteBaseTime = GetJA2Clock();
      TraceCharAnimatedRoute__fUpDateFlag = !TraceCharAnimatedRoute__fUpDateFlag;

      if (fCheckFlag)
        return true;

      fNextNode = true;
    }
  }

  // check to see if Current node has not been deleted
  pTempNode = pPath;

  while (pTempNode) {
    if (pTempNode == TraceCharAnimatedRoute__pCurrentNode) {
      // not deleted
      // reset pause flag
      break;
    } else
      pTempNode = pTempNode.pNext;
  }

  // if deleted, restart at beginnning
  if (pTempNode == null) {
    TraceCharAnimatedRoute__pCurrentNode = pPath;

    // set pause flag
    if (!TraceCharAnimatedRoute__pCurrentNode)
      return false;
  }

  // Grab Video Objects
  hMapHandle = GetVideoObject(guiMAPCURSORS);

  // Handle drawing of arrow
  pNode = TraceCharAnimatedRoute__pCurrentNode;
  if ((!pNode.pPrev) && (TraceCharAnimatedRoute__ubCounter == 1) && (fForceUpDate)) {
    TraceCharAnimatedRoute__ubCounter = 0;
    return false;
  } else if ((TraceCharAnimatedRoute__ubCounter == 1) && (fForceUpDate)) {
    pNode = <PathSt>TraceCharAnimatedRoute__pCurrentNode.pPrev;
  }
  if (pNode.pNext)
    pNextNode = pNode.pNext;
  else
    pNextNode = null;

  if (pNode.pPrev)
    pPastNode = pNode.pPrev;
  else
    pPastNode = null;

  // go through characters list and display arrows for path
  fUTurnFlag = false;
  if ((pPastNode) && (pNextNode)) {
    iDeltaA = pNode.uiSectorId - pPastNode.uiSectorId;
    iDeltaB = pNode.uiSectorId - pNextNode.uiSectorId;
    if (!pNode.fSpeed)
      fSpeedFlag = true;
    else
      fSpeedFlag = false;
    if (iDeltaA == 0)
      return false;
    if (!fZoomFlag) {
      iX = (pNode.uiSectorId % MAP_WORLD_X);
      iY = (pNode.uiSectorId / MAP_WORLD_X);
      iX = (iX * MAP_GRID_X) + MAP_VIEW_START_X;
      iY = (iY * MAP_GRID_Y) + MAP_VIEW_START_Y;
    } else {
      ({ sX, sY } = GetScreenXYFromMapXYStationary(((pNode.uiSectorId % MAP_WORLD_X)), ((pNode.uiSectorId / MAP_WORLD_X))));
      iY = sY - MAP_GRID_Y;
      iX = sX - MAP_GRID_X;
    }
    iArrowX = iX;
    iArrowY = iY;
    if ((pPastNode.pPrev) && (pNextNode.pNext)) {
      fUTurnFlag = false;
      // check to see if out-of sector U-turn
      // for placement of arrows
      iDeltaB1 = pNextNode.uiSectorId - pNextNode.pNext.uiSectorId;
      if ((iDeltaB1 == -WORLD_MAP_X) && (iDeltaA == -WORLD_MAP_X) && (iDeltaB == -1)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == -WORLD_MAP_X) && (iDeltaA == -WORLD_MAP_X) && (iDeltaB == 1)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == WORLD_MAP_X) && (iDeltaA == WORLD_MAP_X) && (iDeltaB == 1)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == -WORLD_MAP_X) && (iDeltaA == -WORLD_MAP_X) && (iDeltaB == 1)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == -1) && (iDeltaA == -1) && (iDeltaB == -WORLD_MAP_X)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == -1) && (iDeltaA == -1) && (iDeltaB == WORLD_MAP_X)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == 1) && (iDeltaA == 1) && (iDeltaB == -WORLD_MAP_X)) {
        fUTurnFlag = true;
      } else if ((iDeltaB1 == 1) && (iDeltaA == 1) && (iDeltaB == WORLD_MAP_X)) {
        fUTurnFlag = true;
      } else
        fUTurnFlag = false;
    }

    if ((pPastNode.uiSectorId == pNextNode.uiSectorId)) {
      if (pPastNode.uiSectorId + WORLD_MAP_X == pNode.uiSectorId) {
        if (fZoomFlag) {
          iDirection = S_TO_N_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_NORTH_ARROW;
          else
            iArrow = ZOOM_NORTH_ARROW;
          iArrowX += NORTH_OFFSET_X * 2;
          iArrowY += NORTH_OFFSET_Y * 2;
        } else {
          iDirection = S_TO_N_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_NORTH_ARROW;
          else
            iArrow = NORTH_ARROW;

          iArrowX += NORTH_OFFSET_X;
          iArrowY += NORTH_OFFSET_Y;
        }
      } else if (pPastNode.uiSectorId - WORLD_MAP_X == pNode.uiSectorId) {
        if (fZoomFlag) {
          iDirection = N_TO_S_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_SOUTH_ARROW;
          else
            iArrow = ZOOM_SOUTH_ARROW;
          iArrowX += SOUTH_OFFSET_X * 2;
          iArrowY += SOUTH_OFFSET_Y * 2;
        } else {
          iDirection = N_TO_S_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_SOUTH_ARROW;
          else
            iArrow = SOUTH_ARROW;
          iArrowX += SOUTH_OFFSET_X;
          iArrowY += SOUTH_OFFSET_Y;
        }
      } else if (pPastNode.uiSectorId + 1 == pNode.uiSectorId) {
        if (fZoomFlag) {
          iDirection = E_TO_W_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_WEST_ARROW;
          else
            iArrow = ZOOM_WEST_ARROW;
          iArrowX += WEST_OFFSET_X * 2;
          iArrowY += WEST_OFFSET_Y * 2;
        } else {
          iDirection = E_TO_W_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_WEST_ARROW;
          else
            iArrow = WEST_ARROW;
          iArrowX += WEST_OFFSET_X;
          iArrowY += WEST_OFFSET_Y;
        }
      } else {
        if (fZoomFlag) {
          iDirection = W_TO_E_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_EAST_ARROW;
          else
            iArrow = ZOOM_EAST_ARROW;
          iArrowX += EAST_OFFSET_X * 2;
          iArrowY += EAST_OFFSET_Y * 2;
        } else {
          iDirection = W_TO_E_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_EAST_ARROW;
          else
            iArrow = EAST_ARROW;
          iArrowX += EAST_OFFSET_X;
          iArrowY += EAST_OFFSET_Y;
        }
      }
    } else {
      if ((iDeltaA == -1) && (iDeltaB == 1)) {
        if (fZoomFlag) {
          iDirection = WEST_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_WEST_ARROW;
          else
            iArrow = ZOOM_WEST_ARROW;

          iArrowX += WEST_OFFSET_X * 2;
          iArrowY += WEST_OFFSET_Y * 2;
        } else {
          iDirection = WEST_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_WEST_ARROW;
          else
            iArrow = WEST_ARROW;

          iArrowX += WEST_OFFSET_X;
          iArrowY += WEST_OFFSET_Y;
        }
      } else if ((iDeltaA == 1) && (iDeltaB == -1)) {
        if (fZoomFlag) {
          iDirection = EAST_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_EAST_ARROW;
          else
            iArrow = ZOOM_EAST_ARROW;

          iArrowX += EAST_OFFSET_X * 2;
          iArrowY += EAST_OFFSET_Y * 2;
        } else {
          iDirection = EAST_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_EAST_ARROW;
          else
            iArrow = EAST_ARROW;

          iArrowX += EAST_OFFSET_X;
          iArrowY += EAST_OFFSET_Y;
        }
      } else if ((iDeltaA == -WORLD_MAP_X) && (iDeltaB == WORLD_MAP_X)) {
        if (fZoomFlag) {
          iDirection = NORTH_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_NORTH_ARROW;
          else
            iArrow = ZOOM_NORTH_ARROW;

          iArrowX += NORTH_OFFSET_X * 2;
          iArrowY += NORTH_OFFSET_Y * 2;
        } else {
          iDirection = NORTH_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_NORTH_ARROW;
          else
            iArrow = NORTH_ARROW;

          iArrowX += NORTH_OFFSET_X;
          iArrowY += NORTH_OFFSET_Y;
        }
      } else if ((iDeltaA == WORLD_MAP_X) && (iDeltaB == -WORLD_MAP_X)) {
        if (fZoomFlag) {
          iDirection = SOUTH_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_SOUTH_ARROW;
          else
            iArrow = ZOOM_SOUTH_ARROW;

          iArrowX += SOUTH_OFFSET_X * 2;
          iArrowY += SOUTH_OFFSET_Y * 2;
        } else {
          iDirection = SOUTH_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_SOUTH_ARROW;
          else
            iArrow = SOUTH_ARROW;

          iArrowX += SOUTH_OFFSET_X;
          iArrowY += SOUTH_OFFSET_Y;
        }
      } else if ((iDeltaA == -WORLD_MAP_X) && (iDeltaB == -1)) {
        if (fZoomFlag) {
          iDirection = N_TO_E_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_EAST_ARROW;
          else
            iArrow = ZOOM_EAST_ARROW;

          iArrowX += EAST_OFFSET_X * 2;
          iArrowY += EAST_OFFSET_Y * 2;
        } else {
          iDirection = N_TO_E_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_EAST_ARROW;
          else
            iArrow = EAST_ARROW;

          iArrowX += EAST_OFFSET_X;
          iArrowY += EAST_OFFSET_Y;
        }
      } else if ((iDeltaA == WORLD_MAP_X) && (iDeltaB == 1)) {
        if (fZoomFlag) {
          iDirection = S_TO_W_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_WEST_ARROW;
          else
            iArrow = ZOOM_WEST_ARROW;

          iArrowX += WEST_OFFSET_X * 2;
          iArrowY += WEST_OFFSET_Y * 2;
        } else {
          iDirection = S_TO_W_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_WEST_ARROW;
          else
            iArrow = WEST_ARROW;

          iArrowX += WEST_OFFSET_X;
          iArrowY += WEST_OFFSET_Y;
        }
      } else if ((iDeltaA == 1) && (iDeltaB == -WORLD_MAP_X)) {
        if (fZoomFlag) {
          iDirection = E_TO_S_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_SOUTH_ARROW;
          else
            iArrow = ZOOM_SOUTH_ARROW;

          iArrowX += SOUTH_OFFSET_X * 2;
          iArrowY += SOUTH_OFFSET_Y * 2;
        } else {
          iDirection = E_TO_S_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_SOUTH_ARROW;
          else
            iArrow = SOUTH_ARROW;

          iArrowX += SOUTH_OFFSET_X;
          iArrowY += SOUTH_OFFSET_Y;
        }
      } else if ((iDeltaA == -1) && (iDeltaB == WORLD_MAP_X)) {
        if (fZoomFlag) {
          iDirection = W_TO_N_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_NORTH_ARROW;
          else
            iArrow = ZOOM_NORTH_ARROW;

          iArrowX += NORTH_OFFSET_X * 2;
          iArrowY += NORTH_OFFSET_Y * 2;
        } else {
          iDirection = W_TO_N_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_NORTH_ARROW;
          else
            iArrow = NORTH_ARROW;

          iArrowX += NORTH_OFFSET_X;
          iArrowY += NORTH_OFFSET_Y;
        }
      } else if ((iDeltaA == -1) && (iDeltaB == -WORLD_MAP_X)) {
        if (fZoomFlag) {
          iDirection = W_TO_S_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_SOUTH_ARROW;
          else
            iArrow = ZOOM_SOUTH_ARROW;

          iArrowX += SOUTH_OFFSET_X * 2;
          iArrowY += (SOUTH_OFFSET_Y + WEST_TO_SOUTH_OFFSET_Y) * 2;
        } else {
          iDirection = W_TO_S_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_SOUTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_SOUTH_ARROW;
          else
            iArrow = SOUTH_ARROW;
          iArrowX += SOUTH_OFFSET_X;
          iArrowY += (SOUTH_OFFSET_Y + WEST_TO_SOUTH_OFFSET_Y);
        }
      } else if ((iDeltaA == -WORLD_MAP_X) && (iDeltaB == 1)) {
        if (fZoomFlag) {
          iDirection = N_TO_W_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_WEST_ARROW;
          else
            iArrow = ZOOM_WEST_ARROW;

          iArrowX += WEST_OFFSET_X * 2;
          iArrowY += WEST_OFFSET_Y * 2;
        } else {
          iDirection = N_TO_W_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_WEST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_WEST_ARROW;
          else
            iArrow = WEST_ARROW;

          iArrowX += WEST_OFFSET_X;
          iArrowY += WEST_OFFSET_Y;
        }
      } else if ((iDeltaA == WORLD_MAP_X) && (iDeltaB == -1)) {
        if (fZoomFlag) {
          iDirection = S_TO_E_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_EAST_ARROW;
          else
            iArrow = ZOOM_EAST_ARROW;
          iArrowX += EAST_OFFSET_X * 2;
          iArrowY += EAST_OFFSET_Y * 2;
        } else {
          iDirection = S_TO_E_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_EAST_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_EAST_ARROW;
          else
            iArrow = EAST_ARROW;
          iArrowX += EAST_OFFSET_X;
          iArrowY += EAST_OFFSET_Y;
        }
      } else if ((iDeltaA == 1) && (iDeltaB == WORLD_MAP_X)) {
        if (fZoomFlag) {
          iDirection = E_TO_N_ZOOM_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = ZOOM_W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = ZOOM_Y_NORTH_ARROW;
          else
            iArrow = ZOOM_NORTH_ARROW;
          iArrowX += (NORTH_OFFSET_X * 2);
          iArrowY += (NORTH_OFFSET_Y + EAST_TO_NORTH_OFFSET_Y) * 2;
        } else {
          iDirection = E_TO_N_LINE;
          if (!TraceCharAnimatedRoute__ubCounter)
            iArrow = W_NORTH_ARROW;
          else if (fSpeedFlag)
            iArrow = Y_NORTH_ARROW;
          else
            iArrow = NORTH_ARROW;

          iArrowX += NORTH_OFFSET_X;
          iArrowY += NORTH_OFFSET_Y + EAST_TO_NORTH_OFFSET_Y;
        }
      }
    }
  }

  else {
    iX = (pNode.uiSectorId % MAP_WORLD_X);
    iY = (pNode.uiSectorId / MAP_WORLD_X);
    iX = (iX * MAP_GRID_X) + MAP_VIEW_START_X;
    iY = (iY * MAP_GRID_Y) + MAP_VIEW_START_Y;
    if (pPastNode) {
      iPastX = (pPastNode.uiSectorId % MAP_WORLD_X);
      iPastY = (pPastNode.uiSectorId / MAP_WORLD_X);
      iPastX = (iPastX * MAP_GRID_X) + MAP_VIEW_START_X;
      iPastY = (iPastY * MAP_GRID_Y) + MAP_VIEW_START_Y;
    }
    if (pNode.fSpeed)
      fSpeedFlag = true;
    else
      fSpeedFlag = false;
    iArrowX = iX;
    iArrowY = iY;
    // display enter and exit 'X's
    if (pPastNode) {
      // red 'X'
      fUTurnFlag = true;
      iDeltaA = pNode.uiSectorId - pPastNode.uiSectorId;
      if (iDeltaA == -1) {
        iDirection = RED_X_WEST;
        // iX+=RED_WEST_OFF_X;
      } else if (iDeltaA == 1) {
        iDirection = RED_X_EAST;
        // iX+=RED_EAST_OFF_X;
      } else if (iDeltaA == -WORLD_MAP_X) {
        iDirection = RED_X_NORTH;
        // iY+=RED_NORTH_OFF_Y;
      } else {
        iDirection = RED_X_SOUTH;
        //	iY+=RED_SOUTH_OFF_Y;
      }
    }
    if (pNextNode) {
      fUTurnFlag = false;
      iDeltaB = pNode.uiSectorId - pNextNode.uiSectorId;
      if (iDeltaB == -1) {
        iDirection = GREEN_X_EAST;
        if (!TraceCharAnimatedRoute__ubCounter)
          iArrow = W_EAST_ARROW;
        else if (fSpeedFlag)
          iArrow = Y_EAST_ARROW;
        else
          iArrow = EAST_ARROW;

        iArrowX += EAST_OFFSET_X;
        iArrowY += EAST_OFFSET_Y;
        // iX+=RED_EAST_OFF_X;
      } else if (iDeltaB == 1) {
        iDirection = GREEN_X_WEST;
        if (!TraceCharAnimatedRoute__ubCounter)
          iArrow = W_WEST_ARROW;
        else if (fSpeedFlag)
          iArrow = Y_WEST_ARROW;
        else
          iArrow = WEST_ARROW;

        iArrowX += WEST_OFFSET_X;
        iArrowY += WEST_OFFSET_Y;
        // iX+=RED_WEST_OFF_X;
      } else if (iDeltaB == WORLD_MAP_X) {
        iDirection = GREEN_X_NORTH;
        if (!TraceCharAnimatedRoute__ubCounter)
          iArrow = W_NORTH_ARROW;
        else if (fSpeedFlag)
          iArrow = Y_NORTH_ARROW;
        else
          iArrow = NORTH_ARROW;

        iArrowX += NORTH_OFFSET_X;
        iArrowY += NORTH_OFFSET_Y;
        // iY+=RED_NORTH_OFF_Y;
      } else {
        iDirection = GREEN_X_SOUTH;
        if (!TraceCharAnimatedRoute__ubCounter)
          iArrow = W_SOUTH_ARROW;
        else if (fSpeedFlag)
          iArrow = Y_SOUTH_ARROW;
        else
          iArrow = SOUTH_ARROW;
        iArrowX += SOUTH_OFFSET_X;
        iArrowY += SOUTH_OFFSET_Y;
        // iY+=RED_SOUTH_OFF_Y;
      }
    }
  }
  if (fNextNode) {
    if (!TraceCharAnimatedRoute__ubCounter) {
      TraceCharAnimatedRoute__pCurrentNode = TraceCharAnimatedRoute__pCurrentNode.pNext;
      if (!TraceCharAnimatedRoute__pCurrentNode)
        TraceCharAnimatedRoute__fPauseFlag = true;
    }
  }
  if ((iDirection != -1) && (iArrow != -1)) {
    if (!fUTurnFlag) {
      if ((!fZoomFlag) || ((fZoomFlag) && (iX > MAP_VIEW_START_X) && (iY > MAP_VIEW_START_Y) && (iX < 640 - MAP_GRID_X * 2) && (iY < MAP_VIEW_START_Y + MAP_VIEW_HEIGHT))) {
        // if(!fZoomFlag)
        // RestoreExternBackgroundRect(((INT16)iArrowX),((INT16)iArrowY),DMAP_GRID_X, DMAP_GRID_Y);
        // else
        // RestoreExternBackgroundRect(((INT16)iArrowX), ((INT16)iArrowY),DMAP_GRID_ZOOM_X, DMAP_GRID_ZOOM_Y);
        if (pNode != pPath) {
          BltVideoObject(FRAME_BUFFER, hMapHandle, iArrow, iArrowX, iArrowY, VO_BLT_SRCTRANSPARENCY, null);
          InvalidateRegion(iArrowX, iArrowY, iArrowX + 2 * MAP_GRID_X, iArrowY + 2 * MAP_GRID_Y);
        }
      }
      if (TraceCharAnimatedRoute__ubCounter == 1)
        TraceCharAnimatedRoute__ubCounter = 0;
      else
        TraceCharAnimatedRoute__ubCounter = 1;
      return true;
    }
    if (TraceCharAnimatedRoute__ubCounter == 1)
      TraceCharAnimatedRoute__ubCounter = 0;
    else
      TraceCharAnimatedRoute__ubCounter = 1;
  }
  // move to next arrow

  // ARM who knows what it should return here?
  return false;
}

// simply check if we want to refresh the screen to display path
/* static */ let DisplayThePotentialPathForHelicopter__fOldShowAirCraft: boolean = false;
/* static */ let DisplayThePotentialPathForHelicopter__sOldMapX: INT16;
/* static */ let DisplayThePotentialPathForHelicopter__sOldMapY: INT16;
export function DisplayThePotentialPathForHelicopter(sMapX: INT16, sMapY: INT16): void {
  let iDifference: INT32 = 0;

  if (DisplayThePotentialPathForHelicopter__fOldShowAirCraft != fShowAircraftFlag) {
    DisplayThePotentialPathForHelicopter__fOldShowAirCraft = fShowAircraftFlag;
    giPotHeliPathBaseTime = GetJA2Clock();

    DisplayThePotentialPathForHelicopter__sOldMapX = sMapX;
    DisplayThePotentialPathForHelicopter__sOldMapY = sMapY;
    fTempPathAlreadyDrawn = false;
    fDrawTempHeliPath = false;
  }

  if ((sMapX != DisplayThePotentialPathForHelicopter__sOldMapX) || (sMapY != DisplayThePotentialPathForHelicopter__sOldMapY)) {
    giPotHeliPathBaseTime = GetJA2Clock();

    DisplayThePotentialPathForHelicopter__sOldMapX = sMapX;
    DisplayThePotentialPathForHelicopter__sOldMapY = sMapY;

    // path was plotted and we moved, re draw map..to clean up mess
    if (fTempPathAlreadyDrawn) {
      fMapPanelDirty = true;
    }

    fTempPathAlreadyDrawn = false;
    fDrawTempHeliPath = false;
  }

  iDifference = GetJA2Clock() - giPotHeliPathBaseTime;

  if (fTempPathAlreadyDrawn) {
    return;
  }

  if (iDifference > MIN_WAIT_TIME_FOR_TEMP_PATH) {
    fDrawTempHeliPath = true;
    giPotHeliPathBaseTime = GetJA2Clock();
    fTempPathAlreadyDrawn = true;
  }

  return;
}

export function IsTheCursorAllowedToHighLightThisSector(sSectorX: INT16, sSectorY: INT16): boolean {
  // check to see if this sector is a blocked out sector?

  if (sBadSectorsList[sSectorX][sSectorY]) {
    return false;
  } else {
    // return cursor is allowed to highlight this sector
    return true;
  }
}

export function SetUpBadSectorsList(): void {
  // initalizes all sectors to highlighable and then the ones non highlightable are marked as such
  let bY: INT8;

  for (let i = 0; i < sBadSectorsList.length; i++) {
    sBadSectorsList[i].fill(false);
  }

  // the border regions
  for (bY = 0; bY < WORLD_MAP_X; bY++) {
    sBadSectorsList[0][bY] = sBadSectorsList[WORLD_MAP_X - 1][bY] = sBadSectorsList[bY][0] = sBadSectorsList[bY][WORLD_MAP_X - 1] = true;
  }

  sBadSectorsList[4][1] = true;
  sBadSectorsList[5][1] = true;
  sBadSectorsList[16][1] = true;
  sBadSectorsList[16][5] = true;
  sBadSectorsList[16][6] = true;

  sBadSectorsList[16][10] = true;
  sBadSectorsList[16][11] = true;
  sBadSectorsList[16][12] = true;
  sBadSectorsList[16][13] = true;
  sBadSectorsList[16][14] = true;
  sBadSectorsList[16][15] = true;
  sBadSectorsList[16][16] = true;

  sBadSectorsList[15][13] = true;
  sBadSectorsList[15][14] = true;
  sBadSectorsList[15][15] = true;
  sBadSectorsList[15][16] = true;

  sBadSectorsList[14][14] = true;
  sBadSectorsList[14][15] = true;
  sBadSectorsList[14][16] = true;

  sBadSectorsList[13][14] = true;
  return;
}

export function RestoreBackgroundForMapGrid(sMapX: INT16, sMapY: INT16): void {
  let sX: INT16;
  let sY: INT16;

  if (!fZoomFlag) {
    // screen values
    sX = (sMapX * MAP_GRID_X) + MAP_VIEW_START_X;
    sY = (sMapY * MAP_GRID_Y) + MAP_VIEW_START_Y;

    // restore background
    RestoreExternBackgroundRect(sX, sY, DMAP_GRID_X, DMAP_GRID_Y);
  } else {
    // get screen coords from map values
    ({ sX, sY } = GetScreenXYFromMapXYStationary(sMapX, sMapY));

    // is this on the screen?
    if ((sX > MapScreenRect.iLeft) && (sX < MapScreenRect.iRight) && (sY > MapScreenRect.iTop) && (sY < MapScreenRect.iBottom)) {
      // offset
      sY = sY - MAP_GRID_Y;
      sX = sX - MAP_GRID_X;

      // restore
      RestoreExternBackgroundRect(sX, sY, DMAP_GRID_ZOOM_X, DMAP_GRID_ZOOM_Y);
    }
  }
}

export function ClipBlitsToMapViewRegion(): void {
  // the standard mapscreen rectangle doesn't work for clipping while zoomed...
  let ZoomedMapScreenClipRect: SGPRect = createSGPRectFrom(MAP_VIEW_START_X + MAP_GRID_X, MAP_VIEW_START_Y + MAP_GRID_Y - 1, MAP_VIEW_START_X + MAP_VIEW_WIDTH + MAP_GRID_X, MAP_VIEW_START_Y + MAP_VIEW_HEIGHT + MAP_GRID_Y - 10);
  let pRectToUse: SGPRect;

  if (fZoomFlag)
    pRectToUse = ZoomedMapScreenClipRect;
  else
    pRectToUse = MapScreenRect;

  SetClippingRect(pRectToUse);
  copySGPRect(gOldClipRect, gDirtyClipRect);
  copySGPRect(gDirtyClipRect, pRectToUse);
}

export function RestoreClipRegionToFullScreen(): void {
  SetClippingRect(FullScreenRect);
  copySGPRect(gDirtyClipRect, gOldClipRect);
}

export function ClipBlitsToMapViewRegionForRectangleAndABit(uiDestPitchBYTES: UINT32): void {
  // clip blits to map view region
  // because MC's map coordinates system is so screwy, these had to be hand-tuned to work right...  ARM
  if (fZoomFlag)
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, MapScreenRect.iLeft + 2, MapScreenRect.iTop, MapScreenRect.iRight - MapScreenRect.iLeft, MapScreenRect.iBottom - MapScreenRect.iTop);
  else
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, MapScreenRect.iLeft - 1, MapScreenRect.iTop - 1, MapScreenRect.iRight - MapScreenRect.iLeft + 3, MapScreenRect.iBottom - MapScreenRect.iTop + 2);

  return;
}

export function RestoreClipRegionToFullScreenForRectangle(uiDestPitchBYTES: UINT32): void {
  // clip blits to map view region
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  return;
}

// mvt icon offset defines
const SOUTH_Y_MVT_OFFSET = +10;
const SOUTH_X_MVT_OFFSET = 0;
const NORTH_Y_MVT_OFFSET = -10;
const NORTH_X_MVT_OFFSET = +10;
const NORTH_SOUTH_CENTER_OFFSET = +5;

const SOUTH_Y_MVT_OFFSET_ZOOM = +30;
const SOUTH_X_MVT_OFFSET_ZOOM = +5;
const NORTH_Y_MVT_OFFSET_ZOOM = -8;
const NORTH_X_MVT_OFFSET_ZOOM = +25;
const NORTH_SOUTH_CENTER_OFFSET_ZOOM = +15;

const EAST_Y_MVT_OFFSET = +8;
const EAST_X_MVT_OFFSET = 15;
const WEST_Y_MVT_OFFSET = -2;
const WEST_X_MVT_OFFSET = -8;
const EAST_WEST_CENTER_OFFSET = +2;

const EAST_Y_MVT_OFFSET_ZOOM = +24;
const EAST_X_MVT_OFFSET_ZOOM = +36;
const WEST_Y_MVT_OFFSET_ZOOM = +5;
const WEST_X_MVT_OFFSET_ZOOM = -10;
const EAST_WEST_CENTER_OFFSET_ZOOM = +12;

const NORTH_TEXT_X_OFFSET = +1;
const NORTH_TEXT_Y_OFFSET = +4;
const SOUTH_TEXT_X_OFFSET = +1;
const SOUTH_TEXT_Y_OFFSET = +2;

const EAST_TEXT_X_OFFSET = +2;
const EAST_TEXT_Y_OFFSET = 0;
const WEST_TEXT_X_OFFSET = +4;
const WEST_TEXT_Y_OFFSET = 0;

const ICON_WIDTH = 8;

function ShowPeopleInMotion(sX: INT16, sY: INT16): void {
  let sExiting: INT32 = 0;
  let sExiting__Pointer = createPointer(() => sExiting, (v) => sExiting = v);
  let sEntering: INT32 = 0;
  let sEntering__Pointer = createPointer(() => sEntering, (v) => sEntering = v);
  let sDest: INT16 = 0;
  let sSource: INT16 = 0;
  let sOffsetX: INT16 = 0;
  let sOffsetY: INT16 = 0;
  let iX: INT16 = sX;
  let iY: INT16 = sY;
  let sXPosition: INT16 = 0;
  let sYPosition: INT16 = 0;
  let iCounter: INT32 = 0;
  let hIconHandle: SGPVObject;
  let fAboutToEnter: boolean = false;
  let fAboutToEnter__Pointer = createPointer(() => fAboutToEnter, (v) => fAboutToEnter = v);
  let sString: string /* CHAR16[32] */;
  let sTextXOffset: INT16 = 0;
  let sTextYOffset: INT16 = 0;
  let usX: INT16;
  let usY: INT16;
  let iWidth: INT32 = 0;
  let iHeight: INT32 = 0;
  let iDeltaXForError: INT32 = 0;
  let iDeltaYForError: INT32 = 0;

  if (iCurrentMapSectorZ != 0) {
    return;
  }

  // show the icons for people in motion from this sector to the next guy over
  for (iCounter = 0; iCounter < 4; iCounter++) {
    // find how many people are coming and going in this sector
    sExiting = 0;
    sEntering = 0;
    sSource = CALCULATE_STRATEGIC_INDEX(sX, sY);
    sOffsetX = 0;
    sOffsetY = 0;
    iX = sX;
    iY = sY;

    // reset fact about to enter
    fAboutToEnter = false;

    sDest = sSource;

    if ((iCounter == 0) && sY > 1) {
      sDest += NORTH_MOVE;
    } else if ((iCounter == 1) && (sX < MAP_WORLD_X - 1)) {
      sDest += EAST_MOVE;
    } else if ((iCounter == 2) && (sY < MAP_WORLD_Y - 1)) {
      sDest += SOUTH_MOVE;
    } else if ((iCounter == 3) && (sX > 1)) {
      sDest += WEST_MOVE;
    }

    // if not at edge of map
    if (sDest != sSource) {
      if (PlayersBetweenTheseSectors(SECTOR(sSource % MAP_WORLD_X, sSource / MAP_WORLD_X), SECTOR(sDest % MAP_WORLD_X, sDest / MAP_WORLD_X), sExiting__Pointer, sEntering__Pointer, fAboutToEnter__Pointer)) {
        // someone is leaving

        // now find position
        if (!(iCounter % 2)) {
          // guys going north or south
          if (sEntering > 0) {
            // more than one coming in, offset from middle
            sOffsetX = (!iCounter ? (!fZoomFlag ? NORTH_X_MVT_OFFSET : NORTH_X_MVT_OFFSET_ZOOM) : (!fZoomFlag ? SOUTH_X_MVT_OFFSET : SOUTH_X_MVT_OFFSET_ZOOM));
          } else {
            sOffsetX = (!fZoomFlag ? NORTH_SOUTH_CENTER_OFFSET : NORTH_SOUTH_CENTER_OFFSET_ZOOM);
          }

          if (!iCounter) {
            // going north
            sOffsetY = (!fZoomFlag ? NORTH_Y_MVT_OFFSET : NORTH_Y_MVT_OFFSET_ZOOM);
          } else {
            // going south
            sOffsetY = (!fZoomFlag ? SOUTH_Y_MVT_OFFSET : SOUTH_Y_MVT_OFFSET_ZOOM);
          }
        } else {
          // going east/west

          if (sEntering > 0) {
            // people also entering, offset from middle
            sOffsetY = (iCounter == 1 ? (!fZoomFlag ? EAST_Y_MVT_OFFSET : EAST_Y_MVT_OFFSET_ZOOM) : (!fZoomFlag ? WEST_Y_MVT_OFFSET : WEST_Y_MVT_OFFSET_ZOOM));
          } else {
            sOffsetY = (!fZoomFlag ? EAST_WEST_CENTER_OFFSET : EAST_WEST_CENTER_OFFSET_ZOOM);
          }

          if (iCounter == 1) {
            // going east
            sOffsetX = (!fZoomFlag ? EAST_X_MVT_OFFSET : EAST_X_MVT_OFFSET_ZOOM);
          } else {
            // going west
            sOffsetX = (!fZoomFlag ? WEST_X_MVT_OFFSET : WEST_X_MVT_OFFSET_ZOOM);
          }
        }

        switch (iCounter) {
          case 0:
            sTextXOffset = NORTH_TEXT_X_OFFSET;
            sTextYOffset = NORTH_TEXT_Y_OFFSET;
            break;
          case 1:
            sTextXOffset = EAST_TEXT_X_OFFSET;
            sTextYOffset = EAST_TEXT_Y_OFFSET;
            break;
          case 2:
            sTextXOffset = SOUTH_TEXT_X_OFFSET;
            sTextYOffset = SOUTH_TEXT_Y_OFFSET;
            break;
          case 3:
            sTextXOffset = WEST_TEXT_X_OFFSET;
            sTextYOffset = WEST_TEXT_Y_OFFSET;
            break;
        }

        // blit the text

        SetFont(MAP_MVT_ICON_FONT());

        if (!fAboutToEnter) {
          SetFontForeground(FONT_WHITE);
        } else {
          SetFontForeground(FONT_BLACK);
        }

        SetFontBackground(FONT_BLACK);

        sString = swprintf("%d", sExiting);

        // about to enter
        if (!fAboutToEnter) {
          // draw blue arrows
          hIconHandle = GetVideoObject(guiCHARBETWEENSECTORICONS);
        } else {
          // draw yellow arrows
          hIconHandle = GetVideoObject(guiCHARBETWEENSECTORICONSCLOSE);
        }

        // zoomed in or not?
        if (!fZoomFlag) {
          iX = MAP_VIEW_START_X + (iX * MAP_GRID_X) + sOffsetX;
          iY = MAP_Y_ICON_OFFSET + MAP_VIEW_START_Y + (iY * MAP_GRID_Y) + sOffsetY;

          BltVideoObject(guiSAVEBUFFER, hIconHandle, iCounter, iX, iY, VO_BLT_SRCTRANSPARENCY, null);
        } else {
          ({ sX: sXPosition, sY: sYPosition } = GetScreenXYFromMapXYStationary(((iX)), ((iY))));

          iY = sYPosition - MAP_GRID_Y + sOffsetY;
          iX = sXPosition - MAP_GRID_X + sOffsetX;

          // clip blits to mapscreen region
          ClipBlitsToMapViewRegion();

          BltVideoObject(guiSAVEBUFFER, hIconHandle, iCounter, iX, iY, VO_BLT_SRCTRANSPARENCY, null);

          // restore clip blits
          RestoreClipRegionToFullScreen();
        }

        ({ sX: usX, sY: usY } = FindFontCenterCoordinates((iX + sTextXOffset), 0, ICON_WIDTH, 0, sString, MAP_FONT()));
        SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);
        mprintf(usX, iY + sTextYOffset, sString);

        switch (iCounter % 2) {
          case 0:
            // north south
            iWidth = 10;
            iHeight = 12;
            break;
          case 1:
            // east west
            iWidth = 12;
            iHeight = 7;
            break;
        }

        // error correction for scrolling with people on the move
        if (iX < 0) {
          iDeltaXForError = 0 - iX;
          iWidth -= iDeltaXForError;
          iX = 0;
        }

        if (iY < 0) {
          iDeltaYForError = 0 - iY;
          iHeight -= iDeltaYForError;
          iY = 0;
        }

        if ((iWidth > 0) && (iHeight > 0)) {
          RestoreExternBackgroundRect(iX, iY, iWidth, iHeight);
        }
      }
    }
  }

  // restore buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
}

/* static */ let DisplayDistancesForHelicopter__sOldYPosition: INT16 = 0;
export function DisplayDistancesForHelicopter(): void {
  // calculate the distance travelled, the proposed distance, and total distance one can go
  // display these on screen
  let sDistanceToGo: INT16 = 0; //, sDistanceSoFar = 0, sTotalCanTravel = 0;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let sString: string /* CHAR16[32] */;
  let hHandle: SGPVObject;
  let sTotalOfTrip: INT16 = 0;
  let iTime: INT32 = 0;
  let sMapX: INT16 = 0;
  let sMapY: INT16 = 0;
  let sYPosition: INT16 = 0;
  let sNumSafeSectors: INT16;
  let sNumUnSafeSectors: INT16;
  let uiTripCost: UINT32;

  if (GetMouseMapXY(createPointer(() => sMapX, (v) => sMapX = v), createPointer(() => sMapY, (v) => sMapY = v)) && !fZoomFlag && (sMapY >= 13)) {
    sYPosition = MAP_HELICOPTER_UPPER_ETA_POPUP_Y;
  } else {
    sYPosition = MAP_HELICOPTER_ETA_POPUP_Y;
  }

  if ((DisplayDistancesForHelicopter__sOldYPosition != 0) && (DisplayDistancesForHelicopter__sOldYPosition != sYPosition)) {
    RestoreExternBackgroundRect(MAP_HELICOPTER_ETA_POPUP_X, DisplayDistancesForHelicopter__sOldYPosition, MAP_HELICOPTER_ETA_POPUP_WIDTH + 20, MAP_HELICOPTER_ETA_POPUP_HEIGHT);
  }

  DisplayDistancesForHelicopter__sOldYPosition = sYPosition;

  // blit in background
  hHandle = GetVideoObject(guiMapBorderHeliSectors);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, MAP_HELICOPTER_ETA_POPUP_X, sYPosition, VO_BLT_SRCTRANSPARENCY, null);

  //	sTotalCanTravel = ( INT16 )GetTotalDistanceHelicopterCanTravel( );
  sDistanceToGo = DistanceOfIntendedHelicopterPath();
  sTotalOfTrip = sDistanceToGo; // + ( INT16 ) ( DistanceToNearestRefuelPoint( ( INT16 )( LastSectorInHelicoptersPath() % MAP_WORLD_X ), ( INT16 ) ( LastSectorInHelicoptersPath() / MAP_WORLD_X ) ) );

  sNumSafeSectors = GetNumSafeSectorsInPath();
  sNumUnSafeSectors = GetNumUnSafeSectorsInPath();

  //	sDistanceSoFar = ( INT16 )HowFarHelicopterhasTravelledSinceRefueling( );
  //	 sTotalDistanceOfTrip = ( INT16 )DistanceToNearestRefuelPoint( )

  if (sDistanceToGo == 9999) {
    sDistanceToGo = 0;
  }

  // set the font stuff
  SetFont(MAP_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);

  sString = swprintf("%s", pHelicopterEtaStrings[0]);
  mprintf(MAP_HELICOPTER_ETA_POPUP_X + 5, sYPosition + 5, sString);

  /*
    if ( IsSectorOutOfTheWay( sMapX, sMapY ) )
    {
                  SetFontForeground( FONT_RED );
          }
          else
  */
  { SetFontForeground(FONT_LTGREEN); }

  sString = swprintf("%d", sTotalOfTrip);
  ({ sX, sY } = FindFontRightCoordinates(MAP_HELICOPTER_ETA_POPUP_X + 5, MAP_HELICOPTER_ETA_POPUP_Y + 5, MAP_HELICOPTER_ETA_POPUP_WIDTH, 0, sString, MAP_FONT()));
  mprintf(sX, sYPosition + 5, sString);

  SetFontForeground(FONT_LTGREEN);

  sString = swprintf("%s", pHelicopterEtaStrings[1]);
  mprintf(MAP_HELICOPTER_ETA_POPUP_X + 5, sYPosition + 5 + GetFontHeight(MAP_FONT()), sString);

  sString = swprintf("%d", sNumSafeSectors);
  ({ sX, sY } = FindFontRightCoordinates(MAP_HELICOPTER_ETA_POPUP_X + 5, (MAP_HELICOPTER_ETA_POPUP_Y + 5 + 2 * GetFontHeight(MAP_FONT())), MAP_HELICOPTER_ETA_POPUP_WIDTH, 0, sString, MAP_FONT()));
  mprintf(sX, (sYPosition + 5 + GetFontHeight(MAP_FONT())), sString);

  sString = swprintf("%s", pHelicopterEtaStrings[2]);
  mprintf(MAP_HELICOPTER_ETA_POPUP_X + 5, sYPosition + 5 + 2 * GetFontHeight(MAP_FONT()), sString);

  sString = swprintf("%d", sNumUnSafeSectors);
  ({ sX, sY } = FindFontRightCoordinates(MAP_HELICOPTER_ETA_POPUP_X + 5, (MAP_HELICOPTER_ETA_POPUP_Y + 5 + 2 * GetFontHeight(MAP_FONT())), MAP_HELICOPTER_ETA_POPUP_WIDTH, 0, sString, MAP_FONT()));
  mprintf(sX, (sYPosition + 5 + 2 * GetFontHeight(MAP_FONT())), sString);

  sString = swprintf("%s", pHelicopterEtaStrings[3]);
  mprintf(MAP_HELICOPTER_ETA_POPUP_X + 5, sYPosition + 5 + 3 * GetFontHeight(MAP_FONT()), sString);

  // calculate the cost of the trip based on the number of safe and unsafe sectors it will pass through
  uiTripCost = (sNumSafeSectors * COST_AIRSPACE_SAFE) + (sNumUnSafeSectors * COST_AIRSPACE_UNSAFE);

  sString = swprintf("%d", uiTripCost);
  sString = InsertCommasForDollarFigure(sString);
  sString = InsertDollarSignInToString(sString);
  ({ sX, sY } = FindFontRightCoordinates(MAP_HELICOPTER_ETA_POPUP_X + 5, (MAP_HELICOPTER_ETA_POPUP_Y + 5 + 3 * GetFontHeight(MAP_FONT())), MAP_HELICOPTER_ETA_POPUP_WIDTH, 0, sString, MAP_FONT()));
  mprintf(sX, (sYPosition + 5 + 3 * GetFontHeight(MAP_FONT())), sString);

  sString = swprintf("%s", pHelicopterEtaStrings[4]);
  mprintf(MAP_HELICOPTER_ETA_POPUP_X + 5, sYPosition + 5 + 4 * GetFontHeight(MAP_FONT()), sString);

  // get travel time for the last path segment
  iTime = GetPathTravelTimeDuringPlotting(pTempHelicopterPath);

  // add travel time for any prior path segments (stored in the helicopter's mercpath, but waypoints aren't built)
  iTime += GetPathTravelTimeDuringPlotting(pVehicleList[iHelicopterVehicleId].pMercPath);

  sString = swprintf("%d%s %d%s", iTime / 60, gsTimeStrings[0], iTime % 60, gsTimeStrings[1]);
  ({ sX, sY } = FindFontRightCoordinates(MAP_HELICOPTER_ETA_POPUP_X + 5, (sYPosition + 5 + 4 * GetFontHeight(MAP_FONT())), MAP_HELICOPTER_ETA_POPUP_WIDTH, 0, sString, MAP_FONT()));
  mprintf(sX, (sYPosition + 5 + 4 * GetFontHeight(MAP_FONT())), sString);

  // show # of passengers aboard the chopper
  mprintf(MAP_HELICOPTER_ETA_POPUP_X + 5, sYPosition + 5 + 5 * GetFontHeight(MAP_FONT()), pHelicopterEtaStrings[6]);
  sString = swprintf("%d", GetNumberOfPassengersInHelicopter());
  ({ sX, sY } = FindFontRightCoordinates(MAP_HELICOPTER_ETA_POPUP_X + 5, (MAP_HELICOPTER_ETA_POPUP_Y + 5 + 5 * GetFontHeight(MAP_FONT())), MAP_HELICOPTER_ETA_POPUP_WIDTH, 0, sString, MAP_FONT()));
  mprintf(sX, (sYPosition + 5 + 5 * GetFontHeight(MAP_FONT())), sString);

  InvalidateRegion(MAP_HELICOPTER_ETA_POPUP_X, DisplayDistancesForHelicopter__sOldYPosition, MAP_HELICOPTER_ETA_POPUP_X + MAP_HELICOPTER_ETA_POPUP_WIDTH + 20, DisplayDistancesForHelicopter__sOldYPosition + MAP_HELICOPTER_ETA_POPUP_HEIGHT);
  return;
}

// grab position of helicopter and blt to screen
/* static */ let DisplayPositionOfHelicopter__sOldMapX: INT16 = 0;
/* static */ let DisplayPositionOfHelicopter__sOldMapY: INT16 = 0;
export function DisplayPositionOfHelicopter(): void {
  //	INT16 sX =0, sY = 0;
  let flRatio: FLOAT = 0.0;
  let x: UINT32;
  let y: UINT32;
  let minX: UINT16;
  let minY: UINT16;
  let maxX: UINT16;
  let maxY: UINT16;
  let pGroup: GROUP;
  let hHandle: SGPVObject;
  let iNumberOfPeopleInHelicopter: INT32 = 0;
  let sString: string /* CHAR16[4] */;

  AssertMsg((DisplayPositionOfHelicopter__sOldMapX >= 0) && (DisplayPositionOfHelicopter__sOldMapX < 640), FormatString("DisplayPositionOfHelicopter: Invalid sOldMapX = %d", DisplayPositionOfHelicopter__sOldMapX));
  AssertMsg((DisplayPositionOfHelicopter__sOldMapY >= 0) && (DisplayPositionOfHelicopter__sOldMapY < 480), FormatString("DisplayPositionOfHelicopter: Invalid sOldMapY = %d", DisplayPositionOfHelicopter__sOldMapY));

  // restore background on map where it is
  if (DisplayPositionOfHelicopter__sOldMapX != 0) {
    RestoreExternBackgroundRect(DisplayPositionOfHelicopter__sOldMapX, DisplayPositionOfHelicopter__sOldMapY, HELI_ICON_WIDTH, HELI_ICON_HEIGHT);
    DisplayPositionOfHelicopter__sOldMapX = 0;
  }

  if (iHelicopterVehicleId != -1) {
    // draw the destination icon first, so when they overlap, the real one is on top!
    DisplayDestinationOfHelicopter();

    // check if mvt group
    if (pVehicleList[iHelicopterVehicleId].ubMovementGroup != 0) {
      pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);

      // this came up in one bug report!
      Assert(pGroup.uiTraverseTime != -1);

      if ((pGroup.uiTraverseTime > 0) && (pGroup.uiTraverseTime != 0xffffffff)) {
        flRatio = ((pGroup.uiTraverseTime + GetWorldTotalMin()) - pGroup.uiArrivalTime) / pGroup.uiTraverseTime;
      }

      /*
                              AssertMsg( ( flRatio >= 0 ) && ( flRatio <= 100 ), String( "DisplayPositionOfHelicopter: Invalid flRatio = %6.2f, trav %d, arr %d, time %d",
                                                                                                                                                                      flRatio, pGroup->uiTraverseTime, pGroup->uiArrivalTime, GetWorldTotalMin() ) );
      */

      if (flRatio < 0) {
        flRatio = 0;
      } else if (flRatio > 100) {
        flRatio = 100;
      }

      //			if( !fZoomFlag )
      {
        // grab min and max locations to interpolate sub sector position
        minX = MAP_VIEW_START_X + MAP_GRID_X * (pGroup.ubSectorX);
        maxX = MAP_VIEW_START_X + MAP_GRID_X * (pGroup.ubNextX);
        minY = MAP_VIEW_START_Y + MAP_GRID_Y * (pGroup.ubSectorY);
        maxY = MAP_VIEW_START_Y + MAP_GRID_Y * (pGroup.ubNextY);
      }
      /*
                              else
                              {

                                      // grab coords for nextx,y and current x,y

                                      // zoomed in, takes a little more work
                                      GetScreenXYFromMapXYStationary( ((UINT16)(pGroup->ubSectorX)),((UINT16)(pGroup->ubSectorY)) , &sX, &sY );
                                      sY=sY-MAP_GRID_Y;
                                      sX=sX-MAP_GRID_X;

                                      minX = ( sX );
                                      minY = ( sY );

                                      GetScreenXYFromMapXYStationary( ((UINT16)(pGroup->ubNextX)),((UINT16)(pGroup->ubNextY)) , &sX, &sY );
                                      sY=sY-MAP_GRID_Y;
                                      sX=sX-MAP_GRID_X;

                                      maxX = ( sX );
                                      maxY = ( sY );
                              }
      */

      AssertMsg((minX >= 0) && (minX < 640), FormatString("DisplayPositionOfHelicopter: Invalid minX = %d", minX));
      AssertMsg((maxX >= 0) && (maxX < 640), FormatString("DisplayPositionOfHelicopter: Invalid maxX = %d", maxX));
      AssertMsg((minY >= 0) && (minY < 640), FormatString("DisplayPositionOfHelicopter: Invalid minY = %d", minY));
      AssertMsg((maxY >= 0) && (maxY < 640), FormatString("DisplayPositionOfHelicopter: Invalid maxY = %d", maxY));

      // IMPORTANT: Since min can easily be larger than max, we gotta cast to as signed value
      x = (minX + flRatio * (maxX - minX));
      y = (minY + flRatio * (maxY - minY));

      /*
                              if( fZoomFlag )
                              {
                                      x += 13;
                                      y += 8;
                              }
                              else
      */
      {
        x += 1;
        y += 3;
      }

      AssertMsg((x >= 0) && (x < 640), FormatString("DisplayPositionOfHelicopter: Invalid x = %d.  At %d,%d.  Next %d,%d.  Min/Max X = %d/%d", x, pGroup.ubSectorX, pGroup.ubSectorY, pGroup.ubNextX, pGroup.ubNextY, minX, maxX));

      AssertMsg((y >= 0) && (y < 480), FormatString("DisplayPositionOfHelicopter: Invalid y = %d.  At %d,%d.  Next %d,%d.  Min/Max Y = %d/%d", y, pGroup.ubSectorX, pGroup.ubSectorY, pGroup.ubNextX, pGroup.ubNextY, minY, maxY));

      // clip blits to mapscreen region
      ClipBlitsToMapViewRegion();

      hHandle = GetVideoObject(guiHelicopterIcon);
      BltVideoObject(FRAME_BUFFER, hHandle, HELI_ICON, x, y, VO_BLT_SRCTRANSPARENCY, null);

      // now get number of people and blit that too
      iNumberOfPeopleInHelicopter = GetNumberOfPassengersInHelicopter();
      sString = swprintf("%d", iNumberOfPeopleInHelicopter);

      SetFont(MAP_MVT_ICON_FONT());
      SetFontForeground(FONT_WHITE);
      SetFontBackground(FONT_BLACK);

      mprintf(x + 5, y + 1, sString);

      InvalidateRegion(x, y, x + HELI_ICON_WIDTH, y + HELI_ICON_HEIGHT);

      RestoreClipRegionToFullScreen();

      // now store the old stuff
      DisplayPositionOfHelicopter__sOldMapX = x;
      DisplayPositionOfHelicopter__sOldMapY = y;
    }
  }

  return;
}

/* static */ let DisplayDestinationOfHelicopter__sOldMapX: INT16 = 0;
/* static */ let DisplayDestinationOfHelicopter__sOldMapY: INT16 = 0;
function DisplayDestinationOfHelicopter(): void {
  let sSector: INT16;
  let sMapX: INT16;
  let sMapY: INT16;
  let x: UINT32;
  let y: UINT32;
  let hHandle: SGPVObject;

  AssertMsg((DisplayDestinationOfHelicopter__sOldMapX >= 0) && (DisplayDestinationOfHelicopter__sOldMapX < 640), FormatString("DisplayDestinationOfHelicopter: Invalid sOldMapX = %d", DisplayDestinationOfHelicopter__sOldMapX));
  AssertMsg((DisplayDestinationOfHelicopter__sOldMapY >= 0) && (DisplayDestinationOfHelicopter__sOldMapY < 480), FormatString("DisplayDestinationOfHelicopter: Invalid sOldMapY = %d", DisplayDestinationOfHelicopter__sOldMapY));

  // restore background on map where it is
  if (DisplayDestinationOfHelicopter__sOldMapX != 0) {
    RestoreExternBackgroundRect(DisplayDestinationOfHelicopter__sOldMapX, DisplayDestinationOfHelicopter__sOldMapY, HELI_SHADOW_ICON_WIDTH, HELI_SHADOW_ICON_HEIGHT);
    DisplayDestinationOfHelicopter__sOldMapX = 0;
  }

  // if helicopter is going somewhere
  if (GetLengthOfPath(pVehicleList[iHelicopterVehicleId].pMercPath) > 1) {
    // get destination
    sSector = GetLastSectorIdInVehiclePath(iHelicopterVehicleId);
    sMapX = sSector % MAP_WORLD_X;
    sMapY = sSector / MAP_WORLD_X;

    x = MAP_VIEW_START_X + (MAP_GRID_X * sMapX) + 1;
    y = MAP_VIEW_START_Y + (MAP_GRID_Y * sMapY) + 3;

    AssertMsg((x >= 0) && (x < 640), FormatString("DisplayDestinationOfHelicopter: Invalid x = %d.  Dest %d,%d", x, sMapX, sMapY));
    AssertMsg((y >= 0) && (y < 480), FormatString("DisplayDestinationOfHelicopter: Invalid y = %d.  Dest %d,%d", y, sMapX, sMapY));

    // clip blits to mapscreen region
    ClipBlitsToMapViewRegion();

    hHandle = GetVideoObject(guiHelicopterIcon);
    BltVideoObject(FRAME_BUFFER, hHandle, HELI_SHADOW_ICON, x, y, VO_BLT_SRCTRANSPARENCY, null);
    InvalidateRegion(x, y, x + HELI_SHADOW_ICON_WIDTH, y + HELI_SHADOW_ICON_HEIGHT);

    RestoreClipRegionToFullScreen();

    // now store the old stuff
    DisplayDestinationOfHelicopter__sOldMapX = x;
    DisplayDestinationOfHelicopter__sOldMapY = y;
  }
}

export function CheckForClickOverHelicopterIcon(sClickedSectorX: INT16, sClickedSectorY: INT16): boolean {
  let iDeltaTime: INT32 = 0;
  let fIgnoreClick: boolean = false;
  let pGroup: GROUP;
  let fHelicopterOverNextSector: boolean = false;
  let flRatio: FLOAT = 0.0;
  let sSectorX: INT16;
  let sSectorY: INT16;

  iDeltaTime = GetJA2Clock() - giClickHeliIconBaseTime;
  giClickHeliIconBaseTime = GetJA2Clock();

  if (iDeltaTime < 400) {
    fIgnoreClick = true;
  }

  if (!fHelicopterAvailable || !fShowAircraftFlag) {
    return false;
  }

  if (iHelicopterVehicleId == -1) {
    return false;
  }

  // figure out over which sector the helicopter APPEARS to be to the player (because we slide it smoothly across the
  // map, unlike groups travelling on the ground, it can appear over its next sector while it's not there yet.

  pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);
  Assert(pGroup);

  if (pGroup.fBetweenSectors) {
    // this came up in one bug report!
    Assert(pGroup.uiTraverseTime != -1);

    if ((pGroup.uiTraverseTime > 0) && (pGroup.uiTraverseTime != 0xffffffff)) {
      flRatio = (pGroup.uiTraverseTime - pGroup.uiArrivalTime + GetWorldTotalMin()) / pGroup.uiTraverseTime;
    }

    // if more than halfway there, the chopper appears more over the next sector, not over its current one(!)
    if (flRatio > 0.5) {
      fHelicopterOverNextSector = true;
    }
  }

  if (fHelicopterOverNextSector) {
    // use the next sector's coordinates
    sSectorX = pGroup.ubNextX;
    sSectorY = pGroup.ubNextY;
  } else {
    // use current sector's coordinates
    sSectorX = pVehicleList[iHelicopterVehicleId].sSectorX;
    sSectorY = pVehicleList[iHelicopterVehicleId].sSectorY;
  }

  // check if helicopter appears where he clicked
  if ((sSectorX != sClickedSectorX) || (sSectorY != sClickedSectorY)) {
    return false;
  }

  return true;
}

function BlitMineIcon(sMapX: INT16, sMapY: INT16): void {
  let hHandle: SGPVObject;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf2: Pointer<UINT8>;
  let sScreenX: INT16;
  let sScreenY: INT16;

  hHandle = GetVideoObject(guiMINEICON);

  pDestBuf2 = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, MAP_VIEW_START_X + MAP_GRID_X - 1, MAP_VIEW_START_Y + MAP_GRID_Y - 1, MAP_VIEW_WIDTH + 1, MAP_VIEW_HEIGHT - 9);
  UnLockVideoSurface(guiSAVEBUFFER);

  if (fZoomFlag) {
    ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXYStationary((sMapX), (sMapY)));
    // when zoomed, the x,y returned is the CENTER of the map square in question
    BltVideoObject(guiSAVEBUFFER, hHandle, 0, sScreenX - MAP_GRID_ZOOM_X / 4, sScreenY - MAP_GRID_ZOOM_Y / 4, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY((sMapX), (sMapY)));
    // when not zoomed, the x,y returned is the top left CORNER of the map square in question
    BltVideoObject(guiSAVEBUFFER, hHandle, 1, sScreenX + MAP_GRID_X / 4, sScreenY + MAP_GRID_Y / 4, VO_BLT_SRCTRANSPARENCY, null);
  }
}

function BlitMineText(sMapX: INT16, sMapY: INT16): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let wString: string /* CHAR16[32] */;
  let wSubString: string /* CHAR16[32] */;
  let ubMineIndex: UINT8;
  let ubLineCnt: UINT8 = 0;

  if (fZoomFlag) {
    ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXYStationary((sMapX), (sMapY)));

    // set coordinates for start of mine text
    sScreenY += MAP_GRID_ZOOM_Y / 2 + 1; // slightly below
  } else {
    ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY((sMapX), (sMapY)));

    // set coordinates for start of mine text
    sScreenX += MAP_GRID_X / 2; // centered around middle of mine square
    sScreenY += MAP_GRID_Y + 1; // slightly below
  }

  // show detailed mine info (name, production rate, daily production)

  SetFontDestBuffer(guiSAVEBUFFER, MAP_VIEW_START_X, MAP_VIEW_START_Y, MAP_VIEW_START_X + MAP_VIEW_WIDTH + MAP_GRID_X, MAP_VIEW_START_Y + MAP_VIEW_HEIGHT + 7, false);

  SetFont(MAP_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);

  ubMineIndex = GetMineIndexForSector(sMapX, sMapY);

  // display associated town name, followed by "mine"
  wString = swprintf("%s %s", pTownNames[GetTownAssociatedWithMine(GetMineIndexForSector(sMapX, sMapY))], pwMineStrings[0]);
  sScreenX = AdjustXForLeftMapEdge(wString, sScreenX);
  mprintf((sScreenX - StringPixLength(wString, MAP_FONT()) / 2), sScreenY + ubLineCnt * GetFontHeight(MAP_FONT()), wString);
  ubLineCnt++;

  // check if mine is empty (abandoned) or running out
  if (gMineStatus[ubMineIndex].fEmpty) {
    wString = swprintf("%s", pwMineStrings[5]);
    sScreenX = AdjustXForLeftMapEdge(wString, sScreenX);
    mprintf((sScreenX - StringPixLength(wString, MAP_FONT()) / 2), sScreenY + ubLineCnt * GetFontHeight(MAP_FONT()), wString);
    ubLineCnt++;
  } else if (gMineStatus[ubMineIndex].fShutDown) {
    wString = swprintf("%s", pwMineStrings[6]);
    sScreenX = AdjustXForLeftMapEdge(wString, sScreenX);
    mprintf((sScreenX - StringPixLength(wString, MAP_FONT()) / 2), sScreenY + ubLineCnt * GetFontHeight(MAP_FONT()), wString);
    ubLineCnt++;
  } else if (gMineStatus[ubMineIndex].fRunningOut) {
    wString = swprintf("%s", pwMineStrings[7]);
    sScreenX = AdjustXForLeftMapEdge(wString, sScreenX);
    mprintf((sScreenX - StringPixLength(wString, MAP_FONT()) / 2), sScreenY + ubLineCnt * GetFontHeight(MAP_FONT()), wString);
    ubLineCnt++;
  }

  // only show production if player controls it and it's actually producing
  if (PlayerControlsMine(ubMineIndex) && !gMineStatus[ubMineIndex].fEmpty) {
    // show current production
    wSubString = swprintf("%d", PredictDailyIncomeFromAMine(ubMineIndex));
    wSubString = InsertCommasForDollarFigure(wSubString);
    wSubString = InsertDollarSignInToString(wSubString);
    wString = wSubString;

    /*
                    // show maximum potential production
                    swprintf( wSubString, L"%d", GetMaxDailyRemovalFromMine(ubMineIndex) );
                    InsertCommasForDollarFigure( wSubString );
                    InsertDollarSignInToString( wSubString );
                    wcscat( wString, L" / ");
                    wcscat( wString, wSubString );
    */

    // if potential is not nil, show percentage of the two
    if (GetMaxPeriodicRemovalFromMine(ubMineIndex) > 0) {
      wSubString = swprintf(" (%d%%%%)", (PredictDailyIncomeFromAMine(ubMineIndex) * 100) / GetMaxDailyRemovalFromMine(ubMineIndex));
      wString += wSubString;
    }

    sScreenX = AdjustXForLeftMapEdge(wString, sScreenX);
    mprintf((sScreenX - StringPixLengthArg(MAP_FONT(), wString.length, wString) / 2), sScreenY + ubLineCnt * GetFontHeight(MAP_FONT()), wString);
    ubLineCnt++;
  }

  SetFontDestBuffer(FRAME_BUFFER, MAP_VIEW_START_X, MAP_VIEW_START_Y, MAP_VIEW_START_X + MAP_VIEW_WIDTH + MAP_GRID_X, MAP_VIEW_START_Y + MAP_VIEW_HEIGHT + 7, false);
}

function AdjustXForLeftMapEdge(wString: string /* STR16 */, sX: INT16): INT16 {
  let sStartingX: INT16;
  let sPastEdge: INT16;

  if (fZoomFlag)
    // it's ok to cut strings off in zoomed mode
    return sX;

  sStartingX = sX - (StringPixLengthArg(MAP_FONT(), wString.length, wString) / 2);
  sPastEdge = (MAP_VIEW_START_X + 23) - sStartingX;

  if (sPastEdge > 0)
    sX += sPastEdge;

  return sX;
}

function BlitTownGridMarkers(): void {
  let sScreenX: INT16 = 0;
  let sScreenY: INT16 = 0;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usColor: UINT16 = 0;
  let iCounter: INT32 = 0;
  let sWidth: INT16 = 0;
  let sHeight: INT16 = 0;

  // get 16 bpp color
  usColor = Get16BPPColor(FROMRGB(100, 100, 100));

  // blit in the highlighted sector
  pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));

  // clip to view region
  ClipBlitsToMapViewRegionForRectangleAndABit(uiDestPitchBYTES);

  // go through list of towns and place on screen
  while (pTownNamesList[iCounter] != 0) {
    // skip Orta/Tixa until found
    if (((fFoundOrta != false) || (pTownNamesList[iCounter] != Enum135.ORTA)) && ((pTownNamesList[iCounter] != Enum135.TIXA) || (fFoundTixa != false))) {
      if (fZoomFlag) {
        ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXYStationary((pTownLocationsList[iCounter] % MAP_WORLD_X), (pTownLocationsList[iCounter] / MAP_WORLD_X)));
        sScreenX -= MAP_GRID_X - 1;
        sScreenY -= MAP_GRID_Y;

        sWidth = 2 * MAP_GRID_X;
        sHeight = 2 * MAP_GRID_Y;
      } else {
        // get location on screen
        ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY((pTownLocationsList[iCounter] % MAP_WORLD_X), (pTownLocationsList[iCounter] / MAP_WORLD_X)));
        sWidth = MAP_GRID_X - 1;
        sHeight = MAP_GRID_Y;

        sScreenX += 2;
      }

      if (StrategicMap[pTownLocationsList[iCounter] - MAP_WORLD_X].bNameId == Enum135.BLANK_SECTOR) {
        LineDraw(true, sScreenX - 1, sScreenY - 1, sScreenX + sWidth - 1, sScreenY - 1, usColor, pDestBuf);
      }

      if ((StrategicMap[pTownLocationsList[iCounter] + MAP_WORLD_X].bNameId == Enum135.BLANK_SECTOR) /* || ( StrategicMap[ pTownLocationsList[ iCounter ] + MAP_WORLD_X ].bNameId == PALACE ) */) {
        LineDraw(true, sScreenX - 1, sScreenY + sHeight - 1, sScreenX + sWidth - 1, sScreenY + sHeight - 1, usColor, pDestBuf);
      }

      if (StrategicMap[pTownLocationsList[iCounter] - 1].bNameId == Enum135.BLANK_SECTOR) {
        LineDraw(true, sScreenX - 2, sScreenY - 1, sScreenX - 2, sScreenY + sHeight - 1, usColor, pDestBuf);
      }

      if (StrategicMap[pTownLocationsList[iCounter] + 1].bNameId == Enum135.BLANK_SECTOR) {
        LineDraw(true, sScreenX + sWidth - 1, sScreenY - 1, sScreenX + sWidth - 1, sScreenY + sHeight - 1, usColor, pDestBuf);
      }
    }

    iCounter++;
  }

  // restore clips
  RestoreClipRegionToFullScreenForRectangle(uiDestPitchBYTES);

  // unlock surface
  UnLockVideoSurface(guiSAVEBUFFER);

  return;
}

function BlitMineGridMarkers(): void {
  let sScreenX: INT16 = 0;
  let sScreenY: INT16 = 0;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usColor: UINT16 = 0;
  let iCounter: INT32 = 0;
  let sWidth: INT16 = 0;
  let sHeight: INT16 = 0;

  // get 16 bpp color
  usColor = Get16BPPColor(FROMRGB(100, 100, 100));

  // blit in the highlighted sector
  pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));

  // clip to view region
  ClipBlitsToMapViewRegionForRectangleAndABit(uiDestPitchBYTES);

  for (iCounter = 0; iCounter < Enum179.MAX_NUMBER_OF_MINES; iCounter++) {
    if (fZoomFlag) {
      ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXYStationary((gMineLocation[iCounter].sSectorX), (gMineLocation[iCounter].sSectorY)));
      sScreenX -= MAP_GRID_X;
      sScreenY -= MAP_GRID_Y;

      sWidth = 2 * MAP_GRID_X;
      sHeight = 2 * MAP_GRID_Y;
    } else {
      // get location on screen
      ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY((gMineLocation[iCounter].sSectorX), (gMineLocation[iCounter].sSectorY)));
      sWidth = MAP_GRID_X;
      sHeight = MAP_GRID_Y;
    }

    // draw rectangle
    RectangleDraw(true, sScreenX, sScreenY - 1, sScreenX + sWidth, sScreenY + sHeight - 1, usColor, pDestBuf);
  }

  // restore clips
  RestoreClipRegionToFullScreenForRectangle(uiDestPitchBYTES);

  // unlock surface
  UnLockVideoSurface(guiSAVEBUFFER);

  return;
}

/*
void CheckIfAnyoneLeftInSector( INT16 sX, INT16 sY, INT16 sNewX, INT16 sNewY, INT8 bZ )
{
        // if this map sector is currently selected
        if( ( sX == sSelMapX ) && ( sY == sSelMapY ) && ( bZ == iCurrentMapSectorZ ) )
        {
                // check if anyone left in the old sector
                if( NumFriendlyInSector( (INT8)sX, (INT8)sY, bZ ) == 0)
                {
                        ChangeSelectedMapSector( sNewX, sNewY, bZ );
                        fMapScreenBottomDirty = TRUE;
                }
        }

        return;
}


UINT8 NumFriendlyInSector( INT16 sX, INT16 sY, INT8 bZ )
{
        SOLDIERTYPE *pTeamSoldier;
        INT32				cnt = 0;
        UINT8				ubNumFriendlies = 0;

        // Check if the battle is won!
        // Loop through all mercs and make go
        for ( pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++ )
        {
                if ( pTeamSoldier->bActive && pTeamSoldier->bLife > 0 )
                {
                        if ( (pTeamSoldier->bSide == gbPlayerNum ) && ( pTeamSoldier->sSectorX == sX ) && ( pTeamSoldier->sSectorY == sY ) && ( pTeamSoldier->bSectorZ == bZ ) )
                        {
                                ubNumFriendlies++;
                        }
                }
        }

        return( ubNumFriendlies );

}
*/

function DisplayLevelString(): void {
  let sString: string /* CHAR16[32] */;

  // given the current level being displayed on the map, show a sub level message

  // at the surface
  if (!iCurrentMapSectorZ) {
    return;
  }

  // otherwise we will have to display the string with the level number

  SetFontDestBuffer(guiSAVEBUFFER, MAP_VIEW_START_X, MAP_VIEW_START_Y, MAP_VIEW_START_X + MAP_VIEW_WIDTH + MAP_GRID_X, MAP_VIEW_START_Y + MAP_VIEW_HEIGHT + 7, false);

  SetFont(MAP_FONT());
  SetFontForeground(MAP_INDEX_COLOR);
  SetFontBackground(FONT_BLACK);
  sString = swprintf("%s %d", sMapLevelString[0], iCurrentMapSectorZ);

  mprintf(MAP_LEVEL_STRING_X, MAP_LEVEL_STRING_Y, sString);

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  return;
}

// function to manipulate the number of towns people on the cursor
function PickUpATownPersonFromSector(ubType: UINT8, sX: INT16, sY: INT16): boolean {
  // see if there are any militia of this type in this sector
  if (!SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[ubType]) {
    // failed, no one here
    return false;
  }

  // are they in the same town as they were pickedup from
  if (GetTownIdForSector(sX, sY) != sSelectedMilitiaTown) {
    return false;
  }

  if (!SectorOursAndPeaceful(sX, sY, 0)) {
    return false;
  }

  if (SECTOR(sX, sY) == SECTOR(gWorldSectorX, gWorldSectorY)) {
    gfStrategicMilitiaChangesMade = true;
  }

  // otherwise pick this guy up
  switch (ubType) {
    case (Enum126.GREEN_MILITIA):
      sGreensOnCursor++;
      break;
    case (Enum126.REGULAR_MILITIA):
      sRegularsOnCursor++;
      break;
    case (Enum126.ELITE_MILITIA):
      sElitesOnCursor++;
      break;
  }

  // reduce number in this sector
  SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[ubType]--;

  fMapPanelDirty = true;

  return true;
}

function DropAPersonInASector(ubType: UINT8, sX: INT16, sY: INT16): boolean {
  // are they in the same town as they were pickedup from
  if (GetTownIdForSector(sX, sY) != sSelectedMilitiaTown) {
    return false;
  }

  if (SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] >= MAX_ALLOWABLE_MILITIA_PER_SECTOR) {
    return false;
  }

  if (!SectorOursAndPeaceful(sX, sY, 0)) {
    return false;
  }

  if (SECTOR(sX, sY) == SECTOR(gWorldSectorX, gWorldSectorY)) {
    gfStrategicMilitiaChangesMade = true;
  }

  // drop the guy into this sector
  switch (ubType) {
    case (Enum126.GREEN_MILITIA):

      if (!sGreensOnCursor) {
        return false;
      }

      sGreensOnCursor--;
      break;
    case (Enum126.REGULAR_MILITIA):
      if (!sRegularsOnCursor) {
        return false;
      }
      sRegularsOnCursor--;
      break;
    case (Enum126.ELITE_MILITIA):
      if (!sElitesOnCursor) {
        return false;
      }

      sElitesOnCursor--;
      break;
  }

  // up the number in this sector of this type of militia
  SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[ubType]++;

  fMapPanelDirty = true;

  return true;
}

export function LoadMilitiaPopUpBox(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the militia pop up box
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\Militia.sti");
  if (!(guiMilitia = AddVideoObject(VObjectDesc))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\Militiamaps.sti");
  if (!(guiMilitiaMaps = AddVideoObject(VObjectDesc))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\MilitiamapsectorOutline2.sti");
  if (!(guiMilitiaSectorHighLight = AddVideoObject(VObjectDesc))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\MilitiamapsectorOutline.sti");
  if (!(guiMilitiaSectorOutline = AddVideoObject(VObjectDesc))) {
    return false;
  }

  return true;
}

export function RemoveMilitiaPopUpBox(): void {
  // delete the militia pop up box graphic
  DeleteVideoObjectFromIndex(guiMilitia);
  DeleteVideoObjectFromIndex(guiMilitiaMaps);
  DeleteVideoObjectFromIndex(guiMilitiaSectorHighLight);
  DeleteVideoObjectFromIndex(guiMilitiaSectorOutline);

  return;
}

export function DrawMilitiaPopUpBox(): boolean {
  let hVObject: SGPVObject;
  let pTrav: ETRLEObject;

  if (!fShowMilitia) {
    sSelectedMilitiaTown = 0;
  }

  // create buttons
  CreateDestroyMilitiaSectorButtons();

  // create mouse regions if we need to
  CreateDestroyMilitiaPopUPRegions();

  if (!sSelectedMilitiaTown) {
    return false;
  }

  // update states of militia selected sector buttons
  CheckAndUpdateStatesOfSelectedMilitiaSectorButtons();

  // get the properties of the militia object
  hVObject = GetVideoObject(guiMilitia);

  BltVideoObject(FRAME_BUFFER, hVObject, 0, MAP_MILITIA_BOX_POS_X, MAP_MILITIA_BOX_POS_Y, VO_BLT_SRCTRANSPARENCY, null);

  hVObject = GetVideoObject(guiMilitiaMaps);
  BltVideoObject(FRAME_BUFFER, hVObject, (sSelectedMilitiaTown - 1), MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X, MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y, VO_BLT_SRCTRANSPARENCY, null);

  // set font color for labels and "total militia" counts
  SetFontForeground(FONT_WHITE);

  // draw name of town, and the "unassigned" label
  DrawTownMilitiaName();

  // render the icons for each sector in the town
  RenderIconsPerSectorForSelectedTown();

  // shade any sectors not under our control
  RenderShadingForUnControlledSectors();

  // display anyone picked up
  DisplayUnallocatedMilitia();

  // draw the highlight last
  ShowHighLightedSectorOnMilitiaMap();

  hVObject = GetVideoObject(guiMilitia);
  pTrav = hVObject.pETRLEObject[0];

  InvalidateRegion(MAP_MILITIA_BOX_POS_X, MAP_MILITIA_BOX_POS_Y, MAP_MILITIA_BOX_POS_X + pTrav.usWidth, MAP_MILITIA_BOX_POS_Y + pTrav.usHeight);

  // set the text for the militia map sector info buttons
  SetMilitiaMapButtonsText();

  // render buttons
  MarkButtonsDirty();

  return true;
}

/* static */ let CreateDestroyMilitiaPopUPRegions__sOldTown: INT16 = 0;
export function CreateDestroyMilitiaPopUPRegions(): void {
  let iCounter: INT32 = 0;

  // create destroy militia pop up regions for mapscreen militia pop up box
  if (sSelectedMilitiaTown != 0) {
    CreateDestroyMilitiaPopUPRegions__sOldTown = sSelectedMilitiaTown;
  }

  if (fShowMilitia && sSelectedMilitiaTown && !gfMilitiaPopupCreated) {
    for (iCounter = 0; iCounter < 9; iCounter++) {
      MSYS_DefineRegion(gMapScreenMilitiaBoxRegions[iCounter], (MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + (iCounter % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH), (MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + (iCounter / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT), (MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + (((iCounter) % MILITIA_BOX_ROWS) + 1) * MILITIA_BOX_BOX_WIDTH), (MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + (((iCounter) / MILITIA_BOX_ROWS) + 1) * MILITIA_BOX_BOX_HEIGHT), MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CURSOR, MilitiaRegionMoveCallback, MilitiaRegionClickCallback);

      MSYS_SetRegionUserData(gMapScreenMilitiaBoxRegions[iCounter], 0, iCounter);
    }

    // create militia panel buttons
    CreateMilitiaPanelBottomButton();

    gfMilitiaPopupCreated = true;
  } else if (gfMilitiaPopupCreated && (!fShowMilitia || !sSelectedMilitiaTown)) {
    for (iCounter = 0; iCounter < 9; iCounter++) {
      // remove region
      MSYS_RemoveRegion(gMapScreenMilitiaBoxRegions[iCounter]);
    }

    // handle the shutdown of the panel...there maybe people on the cursor, distribute them evenly over all the sectors
    HandleShutDownOfMilitiaPanelIfPeopleOnTheCursor(CreateDestroyMilitiaPopUPRegions__sOldTown);

    DeleteMilitiaPanelBottomButton();

    gfMilitiaPopupCreated = false;
  }

  return;
}

function RenderIconsPerSectorForSelectedTown(): void {
  let sBaseSectorValue: INT16 = 0;
  let sCurrentSectorValue: INT16 = 0;
  let iCounter: INT32 = 0;
  let iNumberOfGreens: INT32 = 0;
  let iNumberOfRegulars: INT32 = 0;
  let iNumberOfElites: INT32 = 0;
  let iTotalNumberOfTroops: INT32 = 0;
  let iCurrentTroopIcon: INT32 = 0;
  let hVObject: SGPVObject;
  let iCurrentIcon: INT32 = 0;
  let sX: INT16;
  let sY: INT16;
  let sString: string /* CHAR16[32] */;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;

  // get the sector value for the upper left corner
  sBaseSectorValue = GetBaseSectorForCurrentTown();

  // get militia video object
  hVObject = GetVideoObject(guiMilitia);

  // render icons for map
  for (iCounter = 0; iCounter < 9; iCounter++) {
    // grab current sector value
    sCurrentSectorValue = sBaseSectorValue + ((iCounter % MILITIA_BOX_ROWS) + (iCounter / MILITIA_BOX_ROWS) * (16));

    sSectorX = SECTORX(sCurrentSectorValue);
    sSectorY = SECTORY(sCurrentSectorValue);

    // skip sectors not in the selected town (nearby other towns or wilderness SAM Sites)
    if (GetTownIdForSector(sSectorX, sSectorY) != sSelectedMilitiaTown) {
      continue;
    }

    // get number of each
    iNumberOfGreens = SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
    iNumberOfRegulars = SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
    iNumberOfElites = SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];

    // get total
    iTotalNumberOfTroops = iNumberOfGreens + iNumberOfRegulars + iNumberOfElites;

    // printf number of troops
    SetFont(FONT10ARIAL());
    sString = swprintf("%d", iTotalNumberOfTroops);
    ({ sX, sY } = FindFontRightCoordinates((MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((iCounter % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH)), (MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((iCounter / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT)), MILITIA_BOX_BOX_WIDTH, 0, sString, FONT10ARIAL()));

    if (StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(sCurrentSectorValue)].bNameId != Enum135.BLANK_SECTOR && !StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(sCurrentSectorValue)].fEnemyControlled) {
      if (sSectorMilitiaMapSector != iCounter) {
        mprintf(sX, (sY + MILITIA_BOX_BOX_HEIGHT - 5), sString);
      } else {
        mprintf(sX - 15, (sY + MILITIA_BOX_BOX_HEIGHT - 5), sString);
      }
    }

    // now display
    for (iCurrentTroopIcon = 0; iCurrentTroopIcon < iTotalNumberOfTroops; iCurrentTroopIcon++) {
      // get screen x and y coords
      if (sSectorMilitiaMapSector == iCounter) {
        sX = (iCurrentTroopIcon % POPUP_MILITIA_ICONS_PER_ROW) * MEDIUM_MILITIA_ICON_SPACING + MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((iCounter % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH) + 2;
        sY = (iCurrentTroopIcon / POPUP_MILITIA_ICONS_PER_ROW) * (MEDIUM_MILITIA_ICON_SPACING - 1) + MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((iCounter / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT) + 3;

        if (iCurrentTroopIcon < iNumberOfGreens) {
          iCurrentIcon = 5;
        } else if (iCurrentTroopIcon < iNumberOfGreens + iNumberOfRegulars) {
          iCurrentIcon = 6;
        } else {
          iCurrentIcon = 7;
        }
      } else {
        sX = (iCurrentTroopIcon % POPUP_MILITIA_ICONS_PER_ROW) * MEDIUM_MILITIA_ICON_SPACING + MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((iCounter % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH) + 3;
        sY = (iCurrentTroopIcon / POPUP_MILITIA_ICONS_PER_ROW) * (MEDIUM_MILITIA_ICON_SPACING) + MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((iCounter / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT) + 3;

        if (iCurrentTroopIcon < iNumberOfGreens) {
          iCurrentIcon = 8;
        } else if (iCurrentTroopIcon < iNumberOfGreens + iNumberOfRegulars) {
          iCurrentIcon = 9;
        } else {
          iCurrentIcon = 10;
        }
      }

      BltVideoObject(FRAME_BUFFER, hVObject, (iCurrentIcon), sX, sY, VO_BLT_SRCTRANSPARENCY, null);
    }
  }

  return;
}

function GetBaseSectorForCurrentTown(): INT16 {
  let sBaseSector: INT16 = 0;

  // is the current town
  if (sSelectedMilitiaTown != 0) {
    sBaseSector = sBaseSectorList[(sSelectedMilitiaTown - 1)];
  }

  // return the current sector value
  return sBaseSector;
}

function ShowHighLightedSectorOnMilitiaMap(): void {
  // show the highlighted sector on the militia map
  let hVObject: SGPVObject;
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  if (sSectorMilitiaMapSector != -1) {
    sX = MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((sSectorMilitiaMapSector % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH);
    sY = MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((sSectorMilitiaMapSector / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT);

    // get the object
    hVObject = GetVideoObject(guiMilitiaSectorHighLight);

    // blt the object
    BltVideoObject(FRAME_BUFFER, hVObject, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  }

  if (sSectorMilitiaMapSectorOutline != -1) {
    sX = MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((sSectorMilitiaMapSectorOutline % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH);
    sY = MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((sSectorMilitiaMapSectorOutline / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT);

    // get the object
    hVObject = GetVideoObject(guiMilitiaSectorOutline);

    // blt the object
    BltVideoObject(FRAME_BUFFER, hVObject, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  }

  return;
}

function MilitiaRegionClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  let iValue: INT32 = 0;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if (IsThisMilitiaTownSectorAllowable(iValue)) {
      if (sSectorMilitiaMapSector == iValue) {
        sSectorMilitiaMapSector = -1;
      } else {
        sSectorMilitiaMapSector = iValue;
      }
    } else {
      sSectorMilitiaMapSector = -1;
    }
  }

  if ((iReason & MSYS_CALLBACK_REASON_RBUTTON_UP)) {
    sSectorMilitiaMapSector = -1;
  }
}

function MilitiaRegionMoveCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  let iValue: INT32 = 0;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if ((iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE)) {
    if (IsThisMilitiaTownSectorAllowable(iValue)) {
      sSectorMilitiaMapSectorOutline = iValue;
    } else {
      sSectorMilitiaMapSectorOutline = -1;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    sSectorMilitiaMapSectorOutline = -1;
  }
}

/* static */ let CreateDestroyMilitiaSectorButtons__fCreated: boolean = false;
/* static */ let CreateDestroyMilitiaSectorButtons__sOldSectorValue: INT16 = -1;
export function CreateDestroyMilitiaSectorButtons(): void {
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let iCounter: INT32 = 0;
  let hVObject: SGPVObject;
  let pTrav: ETRLEObject;

  if (CreateDestroyMilitiaSectorButtons__sOldSectorValue == sSectorMilitiaMapSector && fShowMilitia && sSelectedMilitiaTown && !CreateDestroyMilitiaSectorButtons__fCreated && sSectorMilitiaMapSector != -1) {
    CreateDestroyMilitiaSectorButtons__fCreated = true;

    // given sector..place down the 3 buttons

    for (iCounter = 0; iCounter < 3; iCounter++) {
      // set screen x and y positions
      sX = MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((sSectorMilitiaMapSector % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH);
      sY = MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((sSectorMilitiaMapSector / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT);

      // adjust offsets
      sX += MILITIA_BTN_OFFSET_X;
      sY += (iCounter * (MILITIA_BTN_HEIGHT) + 2);

      // set the button image
      giMapMilitiaButtonImage[iCounter] = LoadButtonImage("INTERFACE\\militia.sti", -1, 3, -1, 4, -1);

      // set the button value
      giMapMilitiaButton[iCounter] = QuickCreateButton(giMapMilitiaButtonImage[iCounter], sX, sY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, MilitiaButtonCallback);

      // set button user data
      MSYS_SetBtnUserData(giMapMilitiaButton[iCounter], 0, iCounter);
      SpecifyButtonFont(giMapMilitiaButton[iCounter], FONT10ARIAL());
      SpecifyButtonUpTextColors(giMapMilitiaButton[iCounter], gsMilitiaSectorButtonColors[iCounter], FONT_BLACK);
      SpecifyButtonDownTextColors(giMapMilitiaButton[iCounter], gsMilitiaSectorButtonColors[iCounter], FONT_BLACK);

      hVObject = GetVideoObject(guiMilitia);
      pTrav = hVObject.pETRLEObject[0];

      SetButtonFastHelpText(giMapMilitiaButton[iCounter], pMilitiaButtonsHelpText[iCounter]);
    }

    // mark here the militia box left click region
    // MSYS_DefineRegion( &gMapScreenMilitiaRegion, ( INT16 ) ( MAP_MILITIA_BOX_POS_X ), ( INT16 )( MAP_MILITIA_BOX_POS_Y  ), ( INT16 )( MAP_MILITIA_BOX_POS_X + pTrav->usWidth ), ( INT16 )( MAP_MILITIA_BOX_POS_Y + pTrav->usHeight ), MSYS_PRIORITY_HIGHEST - 2,
    //				 MSYS_NO_CURSOR, MilitiaRegionMoveCallback, MilitiaBoxMaskBtnCallback );

    CreateScreenMaskForMoveBox();

    // ste the fact that the buttons were in fact created
    fMilitiaMapButtonsCreated = true;
  } else if (CreateDestroyMilitiaSectorButtons__fCreated && (CreateDestroyMilitiaSectorButtons__sOldSectorValue != sSectorMilitiaMapSector || !fShowMilitia || !sSelectedMilitiaTown || sSectorMilitiaMapSector == -1)) {
    CreateDestroyMilitiaSectorButtons__sOldSectorValue = sSectorMilitiaMapSector;
    CreateDestroyMilitiaSectorButtons__fCreated = false;

    // the militia box left click region
    //	MSYS_RemoveRegion( &gMapScreenMilitiaRegion );

    // get rid of the buttons
    for (iCounter = 0; iCounter < 3; iCounter++) {
      RemoveButton(giMapMilitiaButton[iCounter]);
      UnloadButtonImage(giMapMilitiaButtonImage[iCounter]);
    }

    if (!fShowMilitia || !sSelectedMilitiaTown) {
      sSectorMilitiaMapSector = -1;
      sSelectedMilitiaTown = 0;
    }

    RemoveScreenMaskForMoveBox();

    // set the fact that the buttons were destroyed
    fMilitiaMapButtonsCreated = false;
  }

  CreateDestroyMilitiaSectorButtons__sOldSectorValue = sSectorMilitiaMapSector;
}

function SetMilitiaMapButtonsText(): void {
  // now set the militia map button text
  let sString: string /* CHAR16[64] */;
  let iNumberOfGreens: INT32 = 0;
  let iNumberOfRegulars: INT32 = 0;
  let iNumberOfElites: INT32 = 0;
  let sBaseSectorValue: INT16 = 0;
  let sGlobalMapSector: INT16 = 0;

  if (!fMilitiaMapButtonsCreated) {
    return;
  }

  // grab the appropriate global sector value in the world
  sBaseSectorValue = GetBaseSectorForCurrentTown();
  sGlobalMapSector = sBaseSectorValue + ((sSectorMilitiaMapSector % MILITIA_BOX_ROWS) + (sSectorMilitiaMapSector / MILITIA_BOX_ROWS) * (16));

  iNumberOfGreens = SectorInfo[sGlobalMapSector].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
  iNumberOfRegulars = SectorInfo[sGlobalMapSector].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
  iNumberOfElites = SectorInfo[sGlobalMapSector].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];

  // the greens in this sector
  sString = swprintf("%d", iNumberOfGreens);
  SpecifyButtonText(giMapMilitiaButton[0], sString);

  // the regulars in this sector
  sString = swprintf("%d", iNumberOfRegulars);
  SpecifyButtonText(giMapMilitiaButton[1], sString);

  // the number of elites in this sector
  sString = swprintf("%d", iNumberOfElites);
  SpecifyButtonText(giMapMilitiaButton[2], sString);

  return;
}

function MilitiaButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  let sGlobalMapSector: INT16 = 0;
  let sBaseSectorValue: INT16 = 0;
  let iValue: INT32 = 0;

  // is the button enabled
  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  // get the value
  iValue = MSYS_GetBtnUserData(btn, 0);

  // get the sector value for the upper left corner
  sBaseSectorValue = GetBaseSectorForCurrentTown();
  sGlobalMapSector = sBaseSectorValue + ((sSectorMilitiaMapSector % MILITIA_BOX_ROWS) + (sSectorMilitiaMapSector / MILITIA_BOX_ROWS) * (16));

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      DropAPersonInASector((iValue), ((sGlobalMapSector % 16) + 1), ((sGlobalMapSector / 16) + 1));
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      PickUpATownPersonFromSector((iValue), ((sGlobalMapSector % 16) + 1), ((sGlobalMapSector / 16) + 1));
    }
  }
}

function DisplayUnallocatedMilitia(): void {
  // show the nunber on the cursor
  let iTotalNumberOfTroops: INT32 = 0;
  let iNumberOfGreens: INT32 = 0;
  let iNumberOfRegulars: INT32 = 0;
  let iNumberOfElites: INT32 = 0;
  let iCurrentTroopIcon: INT32 = 0;
  let iCurrentIcon: INT32 = 0;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let hVObject: SGPVObject;

  // get number of each
  iNumberOfGreens = sGreensOnCursor;
  iNumberOfRegulars = sRegularsOnCursor;
  iNumberOfElites = sElitesOnCursor;

  // get total
  iTotalNumberOfTroops = iNumberOfGreens + iNumberOfRegulars + iNumberOfElites;

  // get militia video object
  hVObject = GetVideoObject(guiMilitia);

  // now display
  for (iCurrentTroopIcon = 0; iCurrentTroopIcon < iTotalNumberOfTroops; iCurrentTroopIcon++) {
    // get screen x and y coords
    sX = (iCurrentTroopIcon % NUMBER_OF_MILITIA_ICONS_PER_LOWER_ROW) * MEDIUM_MILITIA_ICON_SPACING + MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + 1;
    sY = (iCurrentTroopIcon / NUMBER_OF_MILITIA_ICONS_PER_LOWER_ROW) * MEDIUM_MILITIA_ICON_SPACING + MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_LOWER_ROW_Y;

    if (iCurrentTroopIcon < iNumberOfGreens) {
      iCurrentIcon = 8;
    } else if (iCurrentTroopIcon < iNumberOfGreens + iNumberOfRegulars) {
      iCurrentIcon = 9;
    } else {
      iCurrentIcon = 10;
    }

    BltVideoObject(FRAME_BUFFER, hVObject, (iCurrentIcon), sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  }
}

function IsThisMilitiaTownSectorAllowable(sSectorIndexValue: INT16): boolean {
  let sBaseSectorValue: INT16 = 0;
  let sGlobalMapSector: INT16 = 0;
  let sSectorX: INT16;
  let sSectorY: INT16;

  // is this sector allowed to be clicked on?
  sBaseSectorValue = GetBaseSectorForCurrentTown();
  sGlobalMapSector = sBaseSectorValue + ((sSectorIndexValue % MILITIA_BOX_ROWS) + (sSectorIndexValue / MILITIA_BOX_ROWS) * 16);

  sSectorX = SECTORX(sGlobalMapSector);
  sSectorY = SECTORY(sGlobalMapSector);

  // is this in fact part of a town?
  if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].bNameId == Enum135.BLANK_SECTOR) {
    return false;
  }

  if (!SectorOursAndPeaceful(sSectorX, sSectorY, 0)) {
    return false;
  }

  // valid
  return true;
}

function DrawTownMilitiaName(): void {
  let sString: string /* CHAR16[64] */;
  let sX: INT16;
  let sY: INT16;

  // get the name for the current militia town
  sString = swprintf("%s %s", pTownNames[sSelectedMilitiaTown], pMilitiaString[0]);
  ({ sX, sY } = FindFontCenterCoordinates(MAP_MILITIA_BOX_POS_X, MAP_MILITIA_BOX_POS_Y + MILITIA_BOX_TEXT_OFFSET_Y, MILITIA_BOX_WIDTH, MILITIA_BOX_TEXT_TITLE_HEIGHT, sString, FONT10ARIAL()));
  mprintf(sX, sY, sString);

  // might as well show the unassigned string
  sString = swprintf("%s %s", pTownNames[sSelectedMilitiaTown], pMilitiaString[1]);
  ({ sX, sY } = FindFontCenterCoordinates(MAP_MILITIA_BOX_POS_X, MAP_MILITIA_BOX_POS_Y + MILITIA_BOX_UNASSIGNED_TEXT_OFFSET_Y, MILITIA_BOX_WIDTH, GetFontHeight(FONT10ARIAL()), sString, FONT10ARIAL()));
  mprintf(sX, sY, sString);

  return;
}

function HandleShutDownOfMilitiaPanelIfPeopleOnTheCursor(sTownValue: INT16): void {
  let iCounter: INT32 = 0;
  let iCounterB: INT32 = 0;
  let iNumberUnderControl: INT32 = 0;
  let iNumberThatCanFitInSector: INT32 = 0;
  let iCount: INT32 = 0;
  let fLastOne: boolean = false;

  // check if anyone still on the cursor
  if (!sGreensOnCursor && !sRegularsOnCursor && !sElitesOnCursor) {
    return;
  }

  // yep someone left
  iNumberUnderControl = GetTownSectorsUnderControl(sTownValue);

  // find number of sectors under player's control
  while (pTownNamesList[iCounter] != 0) {
    if (pTownNamesList[iCounter] == sTownValue) {
      if (SectorOursAndPeaceful((pTownLocationsList[iCounter] % MAP_WORLD_X), (pTownLocationsList[iCounter] / MAP_WORLD_X), 0)) {
        iCount = 0;
        iNumberThatCanFitInSector = MAX_ALLOWABLE_MILITIA_PER_SECTOR;
        iNumberThatCanFitInSector -= SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
        iNumberThatCanFitInSector -= SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
        iNumberThatCanFitInSector -= SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];

        while ((iCount < iNumberThatCanFitInSector) && ((sGreensOnCursor) || (sRegularsOnCursor) || (sElitesOnCursor))) {
          // green
          if ((iCount + 1 <= iNumberThatCanFitInSector) && (sGreensOnCursor)) {
            SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA]++;
            iCount++;
            sGreensOnCursor--;
          }

          // regular
          if ((iCount + 1 <= iNumberThatCanFitInSector) && (sRegularsOnCursor)) {
            SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA]++;
            iCount++;
            sRegularsOnCursor--;
          }

          // elite
          if ((iCount + 1 <= iNumberThatCanFitInSector) && (sElitesOnCursor)) {
            SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA]++;
            iCount++;
            sElitesOnCursor--;
          }
        }

        if (STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter]) == SECTOR(gWorldSectorX, gWorldSectorY)) {
          gfStrategicMilitiaChangesMade = true;
        }
      }

      fLastOne = true;

      iCounterB = iCounter + 1;

      while (pTownNamesList[iCounterB] != 0) {
        if (pTownNamesList[iCounterB] == sTownValue) {
          fLastOne = false;
        }

        iCounterB++;
      }

      if (fLastOne) {
        SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] += (sGreensOnCursor % iNumberUnderControl);
        SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] += (sRegularsOnCursor % iNumberUnderControl);
        SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] += (sElitesOnCursor % iNumberUnderControl);
      }
    }

    iCounter++;
  }

  // zero out numbers on the cursor
  sGreensOnCursor = 0;
  sRegularsOnCursor = 0;
  sElitesOnCursor = 0;

  return;
}

function HandleEveningOutOfTroopsAmongstSectors(): void {
  // even out troops among the town
  let iCounter: INT32 = 0;
  let iNumberUnderControl: INT32 = 0;
  let iNumberOfGreens: INT32 = 0;
  let iNumberOfRegulars: INT32 = 0;
  let iNumberOfElites: INT32 = 0;
  let iTotalNumberOfTroops: INT32 = 0;
  let iNumberLeftOverGreen: INT32 = 0;
  let iNumberLeftOverRegular: INT32 = 0;
  let iNumberLeftOverElite: INT32 = 0;
  let sBaseSectorValue: INT16 = 0;
  let sCurrentSectorValue: INT16 = 0;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let sSector: INT16 = 0;
  let sTotalSoFar: INT16 = 0;

  // how many sectors in the selected town do we control?
  iNumberUnderControl = GetTownSectorsUnderControl(sSelectedMilitiaTown);

  // if none, there's nothing to be done!
  if (!iNumberUnderControl) {
    return;
  }

  // get the sector value for the upper left corner
  sBaseSectorValue = GetBaseSectorForCurrentTown();

  // render icons for map
  for (iCounter = 0; iCounter < 9; iCounter++) {
    // grab current sector value
    sCurrentSectorValue = sBaseSectorValue + ((iCounter % MILITIA_BOX_ROWS) + (iCounter / MILITIA_BOX_ROWS) * (16));

    sSectorX = SECTORX(sCurrentSectorValue);
    sSectorY = SECTORY(sCurrentSectorValue);

    // skip sectors not in the selected town (nearby other towns or wilderness SAM Sites)
    if (GetTownIdForSector(sSectorX, sSectorY) != sSelectedMilitiaTown) {
      continue;
    }

    if (!StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].fEnemyControlled) {
      // get number of each
      iNumberOfGreens += SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
      iNumberOfRegulars += SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
      iNumberOfElites += SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];
    }
  }

  // now grab those on the cursor
  iNumberOfGreens += sGreensOnCursor;
  iNumberOfRegulars += sRegularsOnCursor;
  iNumberOfElites += sElitesOnCursor;

  // now get the left overs
  iNumberLeftOverGreen = iNumberOfGreens % iNumberUnderControl;
  iNumberLeftOverRegular = iNumberOfRegulars % iNumberUnderControl;
  iNumberLeftOverElite = iNumberOfElites % iNumberUnderControl;

  // get total
  iTotalNumberOfTroops = iNumberOfGreens + iNumberOfRegulars + iNumberOfElites;

  if (!iTotalNumberOfTroops) {
    return;
  }

  iCounter = 0;

  while (pTownNamesList[iCounter] != 0) {
    if (pTownNamesList[iCounter] == sSelectedMilitiaTown) {
      sSectorX = GET_X_FROM_STRATEGIC_INDEX(pTownLocationsList[iCounter]);
      sSectorY = GET_Y_FROM_STRATEGIC_INDEX(pTownLocationsList[iCounter]);

      if (!StrategicMap[pTownLocationsList[iCounter]].fEnemyControlled && !NumHostilesInSector(sSectorX, sSectorY, 0)) {
        sSector = SECTOR(sSectorX, sSectorY);

        // distribute here
        SectorInfo[sSector].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] = (iNumberOfGreens / iNumberUnderControl);
        SectorInfo[sSector].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] = (iNumberOfRegulars / iNumberUnderControl);
        SectorInfo[sSector].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] = (iNumberOfElites / iNumberUnderControl);
        sTotalSoFar = ((iNumberOfGreens / iNumberUnderControl) + (iNumberOfRegulars / iNumberUnderControl) + (iNumberOfElites / iNumberUnderControl));

        // add leftovers that weren't included in the div operation
        if ((iNumberLeftOverGreen) && (sTotalSoFar < MAX_ALLOWABLE_MILITIA_PER_SECTOR)) {
          SectorInfo[sSector].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA]++;
          sTotalSoFar++;
          iNumberLeftOverGreen--;
        }

        if ((iNumberLeftOverRegular) && (sTotalSoFar < MAX_ALLOWABLE_MILITIA_PER_SECTOR)) {
          SectorInfo[sSector].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA]++;
          sTotalSoFar++;
          iNumberLeftOverRegular--;
        }

        if ((iNumberLeftOverElite) && (sTotalSoFar < MAX_ALLOWABLE_MILITIA_PER_SECTOR)) {
          SectorInfo[sSector].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA]++;
          sTotalSoFar++;
          iNumberLeftOverElite--;
        }

        // if this sector is currently loaded
        if (sSector == SECTOR(gWorldSectorX, gWorldSectorY) && gWorldSectorY != 0) {
          gfStrategicMilitiaChangesMade = true;
        }
      }
    }

    iCounter++;
  }

  // zero out numbers on the cursor
  sGreensOnCursor = 0;
  sRegularsOnCursor = 0;
  sElitesOnCursor = 0;

  return;
}

function CreateMilitiaPanelBottomButton(): void {
  // set the button image
  giMapMilitiaButtonImage[3] = LoadButtonImage("INTERFACE\\militia.sti", -1, 1, -1, 2, -1);
  giMapMilitiaButtonImage[4] = LoadButtonImage("INTERFACE\\militia.sti", -1, 1, -1, 2, -1);

  giMapMilitiaButton[3] = QuickCreateButton(giMapMilitiaButtonImage[3], MAP_MILITIA_BOX_POS_X + MAP_MILITIA_BOX_AUTO_BOX_X, MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_BOX_AUTO_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, MilitiaAutoButtonCallback);

  giMapMilitiaButton[4] = QuickCreateButton(giMapMilitiaButtonImage[4], MAP_MILITIA_BOX_POS_X + MAP_MILITIA_BOX_DONE_BOX_X, MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_BOX_AUTO_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, MilitiaDoneButtonCallback);

  SpecifyButtonFont(giMapMilitiaButton[3], FONT10ARIAL());
  SpecifyButtonUpTextColors(giMapMilitiaButton[3], FONT_BLACK, FONT_BLACK);
  SpecifyButtonDownTextColors(giMapMilitiaButton[3], FONT_BLACK, FONT_BLACK);

  SpecifyButtonFont(giMapMilitiaButton[4], FONT10ARIAL());
  SpecifyButtonUpTextColors(giMapMilitiaButton[4], FONT_BLACK, FONT_BLACK);
  SpecifyButtonDownTextColors(giMapMilitiaButton[4], FONT_BLACK, FONT_BLACK);

  SpecifyButtonText(giMapMilitiaButton[3], pMilitiaButtonString[0]);
  SpecifyButtonText(giMapMilitiaButton[4], pMilitiaButtonString[1]);

  // AUTO button help
  SetButtonFastHelpText(giMapMilitiaButton[3], pMilitiaButtonsHelpText[3]);

  // if auto-distribution is not possible
  if (!CanMilitiaAutoDistribute()) {
    // disable the AUTO button
    DisableButton(giMapMilitiaButton[3]);
  }

  return;
}

function DeleteMilitiaPanelBottomButton(): void {
  // delete militia panel bottom
  RemoveButton(giMapMilitiaButton[3]);
  RemoveButton(giMapMilitiaButton[4]);

  UnloadButtonImage(giMapMilitiaButtonImage[3]);
  UnloadButtonImage(giMapMilitiaButtonImage[4]);

  if (sSelectedMilitiaTown != 0) {
    HandleShutDownOfMilitiaPanelIfPeopleOnTheCursor(sSelectedMilitiaTown);
  }

  // redraw the map
  fMapPanelDirty = true;
}

function MilitiaAutoButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // distribute troops over all the sectors under control
      HandleEveningOutOfTroopsAmongstSectors();
      fMapPanelDirty = true;
    }
  }

  return;
}

function MilitiaDoneButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // reset fact we are in the box
      sSelectedMilitiaTown = 0;
      fMapPanelDirty = true;
    }
  }

  return;
}

function RenderShadingForUnControlledSectors(): void {
  // now render shading over any uncontrolled sectors
  // get the sector value for the upper left corner
  let sBaseSectorValue: INT16 = 0;
  let sCurrentSectorValue: INT16 = 0;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let iCounter: INT32 = 0;

  // get the base sector value
  sBaseSectorValue = GetBaseSectorForCurrentTown();

  // render icons for map
  for (iCounter = 0; iCounter < 9; iCounter++) {
    // grab current sector value
    sCurrentSectorValue = sBaseSectorValue + ((iCounter % MILITIA_BOX_ROWS) + (iCounter / MILITIA_BOX_ROWS) * (16));

    if ((StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(sCurrentSectorValue)].bNameId != Enum135.BLANK_SECTOR) && ((StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(sCurrentSectorValue)].fEnemyControlled) || (NumHostilesInSector(SECTORX(sCurrentSectorValue), SECTORY(sCurrentSectorValue), 0)))) {
      // shade this sector, not under our control
      sX = MAP_MILITIA_BOX_POS_X + MAP_MILITIA_MAP_X + ((iCounter % MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_WIDTH);
      sY = MAP_MILITIA_BOX_POS_Y + MAP_MILITIA_MAP_Y + ((iCounter / MILITIA_BOX_ROWS) * MILITIA_BOX_BOX_HEIGHT);

      ShadowVideoSurfaceRect(FRAME_BUFFER, sX, sY, sX + MILITIA_BOX_BOX_WIDTH - 1, sY + MILITIA_BOX_BOX_HEIGHT - 1);
    }
  }

  return;
}

function DrawTownMilitiaForcesOnMap(): void {
  let iCounter: INT32 = 0;
  let iCounterB: INT32 = 0;
  let iTotalNumberOfTroops: INT32 = 0;
  let iIconValue: INT32 = 0;
  let iNumberOfGreens: INT32 = 0;
  let iNumberOfRegulars: INT32 = 0;
  let iNumberOfElites: INT32 = 0;
  let hVObject: SGPVObject;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;

  // get militia video object
  hVObject = GetVideoObject(guiMilitia);

  // clip blits to mapscreen region
  ClipBlitsToMapViewRegion();

  while (pTownNamesList[iCounter] != 0) {
    // run through each town sector and plot the icons for the militia forces in the town
    if (!StrategicMap[pTownLocationsList[iCounter]].fEnemyControlled) {
      sSectorX = GET_X_FROM_STRATEGIC_INDEX(pTownLocationsList[iCounter]);
      sSectorY = GET_Y_FROM_STRATEGIC_INDEX(pTownLocationsList[iCounter]);

      // get number of each
      iNumberOfGreens = SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
      iNumberOfRegulars = SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
      iNumberOfElites = SectorInfo[STRATEGIC_INDEX_TO_SECTOR_INFO(pTownLocationsList[iCounter])].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];

      // set the total for loop upper bound
      iTotalNumberOfTroops = iNumberOfGreens + iNumberOfRegulars + iNumberOfElites;

      for (iCounterB = 0; iCounterB < iTotalNumberOfTroops; iCounterB++) {
        if (fZoomFlag) {
          // LARGE icon offset in the .sti
          iIconValue = 11;
        } else {
          // SMALL icon offset in the .sti
          iIconValue = 5;
        }

        // get the offset further into the .sti
        if (iCounterB < iNumberOfGreens) {
          iIconValue += 0;
        } else if (iCounterB < iNumberOfGreens + iNumberOfRegulars) {
          iIconValue += 1;
        } else {
          iIconValue += 2;
        }

        DrawMapBoxIcon(hVObject, iIconValue, sSectorX, sSectorY, iCounterB);
      }
    }

    iCounter++;
  }

  // now handle militia for sam sectors
  for (iCounter = 0; iCounter < NUMBER_OF_SAMS; iCounter++) {
    sSectorX = SECTORX(pSamList[iCounter]);
    sSectorY = SECTORY(pSamList[iCounter]);

    if (!StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].fEnemyControlled) {
      // get number of each
      iNumberOfGreens = SectorInfo[pSamList[iCounter]].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
      iNumberOfRegulars = SectorInfo[pSamList[iCounter]].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
      iNumberOfElites = SectorInfo[pSamList[iCounter]].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];

      // ste the total for loop upper bound
      iTotalNumberOfTroops = iNumberOfGreens + iNumberOfRegulars + iNumberOfElites;

      for (iCounterB = 0; iCounterB < iTotalNumberOfTroops; iCounterB++) {
        if (fZoomFlag) {
          // LARGE icon offset in the .sti
          iIconValue = 11;
        } else {
          // SMALL icon offset in the .sti
          iIconValue = 5;
        }

        // get the offset further into the .sti
        if (iCounterB < iNumberOfGreens) {
          iIconValue += 0;
        } else if (iCounterB < iNumberOfGreens + iNumberOfRegulars) {
          iIconValue += 1;
        } else {
          iIconValue += 2;
        }

        DrawMapBoxIcon(hVObject, iIconValue, sSectorX, sSectorY, iCounterB);
      }
    }
  }
  // restore clip blits
  RestoreClipRegionToFullScreen();

  return;
}

function CheckAndUpdateStatesOfSelectedMilitiaSectorButtons(): void {
  // now set the militia map button text
  let iNumberOfGreens: INT32 = 0;
  let iNumberOfRegulars: INT32 = 0;
  let iNumberOfElites: INT32 = 0;
  let sBaseSectorValue: INT16 = 0;
  let sGlobalMapSector: INT16 = 0;

  if (!fMilitiaMapButtonsCreated) {
    EnableButton(giMapMilitiaButton[4]);
    return;
  }

  // grab the appropriate global sector value in the world
  sBaseSectorValue = GetBaseSectorForCurrentTown();
  sGlobalMapSector = sBaseSectorValue + ((sSectorMilitiaMapSector % MILITIA_BOX_ROWS) + (sSectorMilitiaMapSector / MILITIA_BOX_ROWS) * (16));

  iNumberOfGreens = SectorInfo[sGlobalMapSector].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + sGreensOnCursor;
  iNumberOfRegulars = SectorInfo[sGlobalMapSector].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + sRegularsOnCursor;
  iNumberOfElites = SectorInfo[sGlobalMapSector].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA] + sElitesOnCursor;

  if ((sGreensOnCursor > 0) || (sRegularsOnCursor > 0) || (sElitesOnCursor > 0)) {
    DisableButton(giMapMilitiaButton[4]); // DONE
  } else {
    EnableButton(giMapMilitiaButton[4]); // DONE
  }

  // greens button
  if (!iNumberOfGreens) {
    DisableButton(giMapMilitiaButton[0]);
  } else {
    EnableButton(giMapMilitiaButton[1]);
  }

  // regulars button
  if (!iNumberOfRegulars) {
    DisableButton(giMapMilitiaButton[1]);
  } else {
    EnableButton(giMapMilitiaButton[1]);
  }

  // elites button
  if (!iNumberOfElites) {
    DisableButton(giMapMilitiaButton[2]);
  } else {
    EnableButton(giMapMilitiaButton[2]);
  }

  return;
}

function ShadeUndergroundMapElem(sSectorX: INT16, sSectorY: INT16): boolean {
  let sScreenX: INT16;
  let sScreenY: INT16;

  ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY(sSectorX, sSectorY));

  sScreenX += 1;

  ShadowVideoSurfaceRect(guiSAVEBUFFER, sScreenX, sScreenY, sScreenX + MAP_GRID_X - 2, sScreenY + MAP_GRID_Y - 2);

  return true;
}

function ShadeSubLevelsNotVisited(): void {
  let pNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

  // obtain the 16-bit version of the same color used in the mine STIs
  gusUndergroundNearBlack = Get16BPPColor(FROMRGB(2, 2, 0));

  // run through all (real & possible) underground sectors
  while (pNode) {
    // if the sector is on the currently displayed sublevel, and has never been visited
    if (pNode.ubSectorZ == iCurrentMapSectorZ && !pNode.fVisited) {
      // remove that portion of the "mine" graphics from view
      HideExistenceOfUndergroundMapSector(pNode.ubSectorX, pNode.ubSectorY);
    }

    pNode = pNode.next;
  }
}

function HandleLowerLevelMapBlit(): void {
  let hHandle: SGPVObject;

  // blits the sub level maps
  switch (iCurrentMapSectorZ) {
    case (1):
      hHandle = GetVideoObject(guiSubLevel1);
      break;
    case (2):
      hHandle = GetVideoObject(guiSubLevel2);
      break;
    case (3):
      hHandle = GetVideoObject(guiSubLevel3);
      break;
    default:
      throw new Error('Should be unreachable');
  }

  // handle the blt of the sublevel
  BltVideoObject(guiSAVEBUFFER, hHandle, 0, MAP_VIEW_START_X + 21, MAP_VIEW_START_Y + 17, VO_BLT_SRCTRANSPARENCY, null);

  // handle shading of sublevels
  ShadeSubLevelsNotVisited();

  return;
}

function MilitiaBoxMaskBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment screen mask region
  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    sSectorMilitiaMapSector = -1;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    sSectorMilitiaMapSector = -1;
  }

  return;
}

export function GetNumberOfMilitiaInSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): INT32 {
  let iNumberInSector: INT32 = 0;

  if (!bSectorZ) {
    iNumberInSector = SectorInfo[SECTOR(sSectorX, sSectorY)].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + SectorInfo[SECTOR(sSectorX, sSectorY)].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + SectorInfo[SECTOR(sSectorX, sSectorY)].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];
  }

  return iNumberInSector;
}

// There is a special case flag used when players encounter enemies in a sector, then retreat.  The number of enemies
// will display on mapscreen until time is compressed.  When time is compressed, the flag is cleared, and
// a question mark is displayed to reflect that the player no longer knows.  This is the function that clears that
// flag.
export function ClearAnySectorsFlashingNumberOfEnemies(): void {
  let i: INT32;
  for (i = 0; i < 256; i++) {
    SectorInfo[i].uiFlags &= ~SF_PLAYER_KNOWS_ENEMIES_ARE_HERE;
  }

  // redraw map
  fMapPanelDirty = true;
}

export function WhatPlayerKnowsAboutEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT32 {
  let uiSectorFlags: UINT32 = SectorInfo[SECTOR(sSectorX, sSectorY)].uiFlags;

  // if player has militia close enough to scout this sector out, if there are mercs who can scout here, OR
  // Special case flag used when players encounter enemies in a sector, then retreat.  The number of enemies
  // will display on mapscreen until time is compressed.  When time is compressed, the flag is cleared, and
  // a question mark is displayed to reflect that the player no longer knows.
  if (CanMercsScoutThisSector(sSectorX, sSectorY, 0) || CanNearbyMilitiaScoutThisSector(sSectorX, sSectorY) || (uiSectorFlags & SF_PLAYER_KNOWS_ENEMIES_ARE_HERE)) {
    // if the enemies are stationary (i.e. mercs attacking a garrison)
    if (NumStationaryEnemiesInSector(sSectorX, sSectorY) > 0) {
      // inside a garrison - hide their # (show question mark) to match what the PBI is showing
      return Enum159.KNOWS_THEYRE_THERE;
    } else {
      // other situations - show exactly how many there are
      return Enum159.KNOWS_HOW_MANY;
    }
  }

  // if the player has visited the sector during this game
  if (GetSectorFlagStatus(sSectorX, sSectorY, 0, SF_ALREADY_VISITED) == true) {
    // then he always knows about any enemy presence for the remainder of the game, but not exact numbers
    return Enum159.KNOWS_THEYRE_THERE;
  }

  // if Skyrider noticed the enemis in the sector recently
  if (uiSectorFlags & SF_SKYRIDER_NOTICED_ENEMIES_HERE) {
    // and Skyrider is still in this sector, flying
    if (IsSkyriderIsFlyingInSector(sSectorX, sSectorY)) {
      // player remains aware of them as long as Skyrider remains in the sector
      return Enum159.KNOWS_THEYRE_THERE;
    } else {
      // Skyrider is gone, reset the flag that he noticed enemies here
      SectorInfo[SECTOR(sSectorX, sSectorY)].uiFlags &= ~SF_SKYRIDER_NOTICED_ENEMIES_HERE;
    }
  }

  // no information available
  return Enum159.KNOWS_NOTHING;
}

function CanMercsScoutThisSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let iFirstId: INT32 = 0;
  let iLastId: INT32 = 0;
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  // to speed it up a little?
  iFirstId = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  iLastId = gTacticalStatus.Team[OUR_TEAM].bLastID;

  for (iCounter = iFirstId; iCounter <= iLastId; iCounter++) {
    // get the soldier
    pSoldier = Menptr[iCounter];

    // is the soldier active
    if (pSoldier.bActive == false) {
      continue;
    }

    // vehicles can't scout!
    if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
      continue;
    }

    // POWs, dead guys, guys in transit, sleeping, and really hurt guys can't scout!
    if ((pSoldier.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.bAssignment == Enum117.ASSIGNMENT_DEAD) || (pSoldier.fMercAsleep == true) || (pSoldier.bLife < OKLIFE)) {
      continue;
    }

    // don't count mercs aboard Skyrider
    if ((pSoldier.bAssignment == Enum117.VEHICLE) && (pSoldier.iVehicleId == iHelicopterVehicleId)) {
      continue;
    }

    // mercs on the move can't scout
    if (pSoldier.fBetweenSectors) {
      continue;
    }

    // is he here?
    if ((pSoldier.sSectorX == sSectorX) && (pSoldier.sSectorY == sSectorY) && (pSoldier.bSectorZ == bSectorZ)) {
      return true;
    }
  }

  // none here who can scout
  return false;
}

function HandleShowingOfEnemyForcesInSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, ubIconPosition: UINT8): void {
  let sNumberOfEnemies: INT16 = 0;

  // ATE: If game has just started, don't do it!
  if (DidGameJustStart()) {
    return;
  }

  // never display enemies underground - sector info doesn't have support for it!
  if (bSectorZ != 0) {
    return;
  }

  // get total number of badguys here
  sNumberOfEnemies = NumEnemiesInSector(sSectorX, sSectorY);

  // anyone here?
  if (!sNumberOfEnemies) {
    // nope - display nothing
    return;
  }

  switch (WhatPlayerKnowsAboutEnemiesInSector(sSectorX, sSectorY)) {
    case Enum159.KNOWS_NOTHING:
      // display nothing
      break;

    case Enum159.KNOWS_THEYRE_THERE:
      // display a question mark
      ShowUncertainNumberEnemiesInSector(sSectorX, sSectorY);
      break;

    case Enum159.KNOWS_HOW_MANY:
      // display individual icons for each enemy, starting at the received icon position index
      ShowEnemiesInSector(sSectorX, sSectorY, sNumberOfEnemies, ubIconPosition);
      break;
  }
}

/*
UINT8 NumActiveCharactersInSector( INT16 sSectorX, INT16 sSectorY, INT16 bSectorZ )
{
        INT32 iCounter = 0;
        SOLDIERTYPE *pSoldier = NULL;
        UINT8 ubNumberOnTeam = 0;

        for( iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++ )
        {
                if( gCharactersList[ iCounter ].fValid )
                {
                        pSoldier = &( Menptr[ gCharactersList[ iCounter ].usSolID ] );

                        if( pSoldier->bActive && ( pSoldier->bLife > 0 ) &&
                                        ( pSoldier->bAssignment != ASSIGNMENT_POW ) && ( pSoldier->bAssignment != IN_TRANSIT ) )
                        {
                                if( ( pSoldier->sSectorX == sSectorX ) && ( pSoldier->sSectorY == sSectorY ) && ( pSoldier->bSectorZ == bSectorZ ) )
                                        ubNumberOnTeam++;
                        }
                }
        }

        return( ubNumberOnTeam );
}
*/

function ShowSAMSitesOnStrategicMap(): void {
  let iCounter: INT32 = 0;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let hHandle: SGPVObject;
  let ubVidObjIndex: INT8 = 0;
  let pDestBuf2: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let wString: string /* CHAR16[40] */;

  if (fShowAircraftFlag) {
    BlitSAMGridMarkers();
  }

  for (iCounter = 0; iCounter < Enum138.NUMBER_OF_SAM_SITES; iCounter++) {
    // has the sam site here been found?
    if (!fSamSiteFound[iCounter]) {
      continue;
    }

    // get the sector x and y
    sSectorX = gpSamSectorX[iCounter];
    sSectorY = gpSamSectorY[iCounter];

    if (fZoomFlag) {
      pDestBuf2 = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
      SetClippingRegionAndImageWidth(uiDestPitchBYTES, MAP_VIEW_START_X + MAP_GRID_X - 1, MAP_VIEW_START_Y + MAP_GRID_Y - 1, MAP_VIEW_WIDTH + 1, MAP_VIEW_HEIGHT - 9);
      UnLockVideoSurface(guiSAVEBUFFER);

      ({ sX, sY } = GetScreenXYFromMapXYStationary(sSectorX, sSectorY));
      sX -= 8;
      sY -= 10;
      ubVidObjIndex = 0;
    } else {
      ({ sX, sY } = GetScreenXYFromMapXY(sSectorX, sSectorY));
      sX += 5;
      sY += 3;
      ubVidObjIndex = 1;
    }

    // draw SAM site icon
    hHandle = GetVideoObject(guiSAMICON);
    BltVideoObject(guiSAVEBUFFER, hHandle, ubVidObjIndex, sX, sY, VO_BLT_SRCTRANSPARENCY, null);

    if (fShowAircraftFlag) {
      // write "SAM Site" centered underneath

      if (fZoomFlag) {
        sX += 9;
        sY += 19;
      } else {
        sX += 6;
        sY += 16;
      }

      wString = pLandTypeStrings[Enum127.SAM_SITE];

      // we're CENTERING the first string AROUND sX, so calculate the starting X value
      sX -= StringPixLength(wString, MAP_FONT()) / 2;

      // if within view region...render, else don't
      if ((sX > MAP_VIEW_START_X + MAP_VIEW_WIDTH) || (sX < MAP_VIEW_START_X) || (sY > MAP_VIEW_START_Y + MAP_VIEW_HEIGHT) || (sY < MAP_VIEW_START_Y)) {
        continue;
      }

      SetFontDestBuffer(guiSAVEBUFFER, MapScreenRect.iLeft + 2, MapScreenRect.iTop, MapScreenRect.iRight, MapScreenRect.iBottom, false);

      // clip blits to mapscreen region
      ClipBlitsToMapViewRegion();

      SetFont(MAP_FONT());
      // Green on green doesn't contrast well, use Yellow
      SetFontForeground(FONT_MCOLOR_LTYELLOW);
      SetFontBackground(FONT_MCOLOR_BLACK);

      // draw the text
      gprintfdirty(sX, sY, wString);
      mprintf(sX, sY, wString);

      // restore clip blits
      RestoreClipRegionToFullScreen();
    }
  }

  return;
}

function BlitSAMGridMarkers(): void {
  let sScreenX: INT16 = 0;
  let sScreenY: INT16 = 0;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usColor: UINT16 = 0;
  let iCounter: INT32 = 0;
  let sWidth: INT16 = 0;
  let sHeight: INT16 = 0;

  // get 16 bpp color
  usColor = Get16BPPColor(FROMRGB(100, 100, 100));

  pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));

  // clip to view region
  ClipBlitsToMapViewRegionForRectangleAndABit(uiDestPitchBYTES);

  for (iCounter = 0; iCounter < Enum138.NUMBER_OF_SAM_SITES; iCounter++) {
    // has the sam site here been found?
    if (!fSamSiteFound[iCounter]) {
      continue;
    }

    if (fZoomFlag) {
      ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXYStationary(gpSamSectorX[iCounter], gpSamSectorY[iCounter]));
      sScreenX -= MAP_GRID_X;
      sScreenY -= MAP_GRID_Y;

      sWidth = 2 * MAP_GRID_X;
      sHeight = 2 * MAP_GRID_Y;
    } else {
      // get location on screen
      ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY(gpSamSectorX[iCounter], gpSamSectorY[iCounter]));
      sWidth = MAP_GRID_X;
      sHeight = MAP_GRID_Y;
    }

    // draw rectangle
    RectangleDraw(true, sScreenX, sScreenY - 1, sScreenX + sWidth, sScreenY + sHeight - 1, usColor, pDestBuf);
  }

  // restore clips
  RestoreClipRegionToFullScreenForRectangle(uiDestPitchBYTES);

  // unlock surface
  UnLockVideoSurface(guiSAVEBUFFER);

  return;
}

function CanMilitiaAutoDistribute(): boolean {
  let iTotalTroopsOnCursor: INT32 = 0;
  let iCounter: INT32 = 0;
  let sBaseSectorValue: INT16 = 0;
  let sCurrentSectorValue: INT16 = 0;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let iTotalTroopsInTown: INT32 = 0;

  // can't auto-distribute if we don't have a town selected (this excludes SAM sites)
  if (sSelectedMilitiaTown == Enum135.BLANK_SECTOR)
    return false;

  // can't auto-distribute if we don't control any sectors in the the town
  if (!GetTownSectorsUnderControl(sSelectedMilitiaTown))
    return false;

  // get the sector value for the upper left corner
  sBaseSectorValue = GetBaseSectorForCurrentTown();

  // render icons for map
  for (iCounter = 0; iCounter < 9; iCounter++) {
    // grab current sector value
    sCurrentSectorValue = sBaseSectorValue + ((iCounter % MILITIA_BOX_ROWS) + (iCounter / MILITIA_BOX_ROWS) * (16));

    sSectorX = SECTORX(sCurrentSectorValue);
    sSectorY = SECTORY(sCurrentSectorValue);

    // skip sectors not in the selected town (nearby other towns or wilderness SAM Sites)
    if (GetTownIdForSector(sSectorX, sSectorY) != sSelectedMilitiaTown) {
      continue;
    }

    if (!StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].fEnemyControlled) {
      // get number of each
      iTotalTroopsInTown += SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + SectorInfo[sCurrentSectorValue].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];
    }
  }

  iTotalTroopsOnCursor = sGreensOnCursor + sRegularsOnCursor + sElitesOnCursor;

  // can't auto-distribute if we don't have any militia in the town
  if (!iTotalTroopsInTown)
    return false;

  // can auto-distribute
  return true;
}

function ShowItemsOnMap(): void {
  let sMapX: INT16;
  let sMapY: INT16;
  let sXCorner: INT16;
  let sYCorner: INT16;
  let usXPos: UINT16;
  let usYPos: UINT16;
  let uiItemCnt: UINT32;
  let sString: string /* CHAR16[10] */;

  // clip blits to mapscreen region
  ClipBlitsToMapViewRegion();

  SetFontDestBuffer(guiSAVEBUFFER, MapScreenRect.iLeft + 2, MapScreenRect.iTop, MapScreenRect.iRight, MapScreenRect.iBottom, false);

  SetFont(MAP_FONT());
  SetFontForeground(FONT_MCOLOR_LTGREEN);
  SetFontBackground(FONT_MCOLOR_BLACK);

  // run through sectors
  for (sMapX = 1; sMapX < (MAP_WORLD_X - 1); sMapX++) {
    for (sMapY = 1; sMapY < (MAP_WORLD_Y - 1); sMapY++) {
      // to speed this up, only look at sector that player has visited
      if (GetSectorFlagStatus(sMapX, sMapY, iCurrentMapSectorZ, SF_ALREADY_VISITED)) {
        //				uiItemCnt = GetSizeOfStashInSector( sMapX, sMapY, ( INT16 ) iCurrentMapSectorZ, FALSE );
        uiItemCnt = GetNumberOfVisibleWorldItemsFromSectorStructureForSector(sMapX, sMapY, iCurrentMapSectorZ);

        if (uiItemCnt > 0) {
          sXCorner = (MAP_VIEW_START_X + (sMapX * MAP_GRID_X));
          sYCorner = (MAP_VIEW_START_Y + (sMapY * MAP_GRID_Y));

          sString = swprintf("%d", uiItemCnt);

          ({ sX: usXPos, sY: usYPos } = FindFontCenterCoordinates(sXCorner, sYCorner, MAP_GRID_X, MAP_GRID_Y, sString, MAP_FONT()));
          //				sXPos -= StringPixLength( sString, MAP_FONT ) / 2;

          gprintfdirty(usXPos, usYPos, sString);
          mprintf(usXPos, usYPos, sString);
        }
      }
    }
  }

  // restore clip blits
  RestoreClipRegionToFullScreen();
}

function DrawMapBoxIcon(hIconHandle: SGPVObject, usVOIndex: UINT16, sMapX: INT16, sMapY: INT16, ubIconPosition: UINT8): void {
  let iRowNumber: INT32;
  let iColumnNumber: INT32;
  let iX: INT32;
  let iY: INT32;

  // don't show any more icons than will fit into one sector, to keep them from spilling into sector(s) beneath
  if (ubIconPosition >= (MERC_ICONS_PER_LINE * ROWS_PER_SECTOR)) {
    return;
  }

  iColumnNumber = ubIconPosition % MERC_ICONS_PER_LINE;
  iRowNumber = ubIconPosition / MERC_ICONS_PER_LINE;

  if (!fZoomFlag) {
    iX = MAP_VIEW_START_X + (sMapX * MAP_GRID_X) + MAP_X_ICON_OFFSET + (3 * iColumnNumber);
    iY = MAP_VIEW_START_Y + (sMapY * MAP_GRID_Y) + MAP_Y_ICON_OFFSET + (3 * iRowNumber);

    BltVideoObject(guiSAVEBUFFER, hIconHandle, usVOIndex, iX, iY, VO_BLT_SRCTRANSPARENCY, null);
    InvalidateRegion(iX, iY, iX + DMAP_GRID_X, iY + DMAP_GRID_Y);
  }
  /*
          else
          {
                  INT sX, sY;

                  GetScreenXYFromMapXYStationary( ( UINT16 ) sX,( UINT16 ) sY, &sX, &sY );
                  iY = sY-MAP_GRID_Y;
                  iX = sX-MAP_GRID_X;

                  // clip blits to mapscreen region
                  ClipBlitsToMapViewRegion( );

                  BltVideoObject(guiSAVEBUFFER, hIconHandle,BIG_YELLOW_BOX,MAP_X_ICON_OFFSET+iX+6*iColumnNumber+2,MAP_Y_ICON_OFFSET+iY+6*iRowNumber, VO_BLT_SRCTRANSPARENCY, NULL );

                  // restore clip blits
                  RestoreClipRegionToFullScreen( );

                  InvalidateRegion(MAP_X_ICON_OFFSET+iX+6*iColumnNumber+2, MAP_Y_ICON_OFFSET+iY+6*iRowNumber,MAP_X_ICON_OFFSET+iX+6*iColumnNumber+2+ DMAP_GRID_ZOOM_X, MAP_Y_ICON_OFFSET+iY+6*iRowNumber + DMAP_GRID_ZOOM_Y );
          }
  */
}

function DrawOrta(): void {
  let pDestBuf2: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let sX: INT16;
  let sY: INT16;
  let ubVidObjIndex: UINT8;
  let hHandle: SGPVObject;

  if (fZoomFlag) {
    pDestBuf2 = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, MAP_VIEW_START_X + MAP_GRID_X - 1, MAP_VIEW_START_Y + MAP_GRID_Y - 1, MAP_VIEW_WIDTH + 1, MAP_VIEW_HEIGHT - 9);
    UnLockVideoSurface(guiSAVEBUFFER);

    ({ sX, sY } = GetScreenXYFromMapXYStationary(ORTA_SECTOR_X, ORTA_SECTOR_Y));
    sX += -MAP_GRID_X + 2;
    sY += -MAP_GRID_Y - 6;
    ubVidObjIndex = 0;
  } else {
    ({ sX, sY } = GetScreenXYFromMapXY(ORTA_SECTOR_X, ORTA_SECTOR_Y));
    sX += +2;
    sY += -3;
    ubVidObjIndex = 1;
  }

  // draw Orta in its sector
  hHandle = GetVideoObject(guiORTAICON);
  BltVideoObject(guiSAVEBUFFER, hHandle, ubVidObjIndex, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
}

function DrawTixa(): void {
  let pDestBuf2: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let sX: INT16;
  let sY: INT16;
  let ubVidObjIndex: UINT8;
  let hHandle: SGPVObject;

  if (fZoomFlag) {
    pDestBuf2 = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, MAP_VIEW_START_X + MAP_GRID_X - 1, MAP_VIEW_START_Y + MAP_GRID_Y - 1, MAP_VIEW_WIDTH + 1, MAP_VIEW_HEIGHT - 9);
    UnLockVideoSurface(guiSAVEBUFFER);

    ({ sX, sY } = GetScreenXYFromMapXYStationary(TIXA_SECTOR_X, TIXA_SECTOR_Y));
    sX += -MAP_GRID_X + 3;
    sY += -MAP_GRID_Y + 6;
    ubVidObjIndex = 0;
  } else {
    ({ sX, sY } = GetScreenXYFromMapXY(TIXA_SECTOR_X, TIXA_SECTOR_Y));
    sY += +2;
    ubVidObjIndex = 1;
  }

  // draw Tixa in its sector
  hHandle = GetVideoObject(guiTIXAICON);
  BltVideoObject(guiSAVEBUFFER, hHandle, ubVidObjIndex, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
}

function DrawBullseye(): void {
  let sX: INT16;
  let sY: INT16;
  let hHandle: SGPVObject;

  ({ sX, sY } = GetScreenXYFromMapXY(gsMercArriveSectorX, gsMercArriveSectorY));
  sY -= 2;

  // draw the bullseye in that sector
  hHandle = GetVideoObject(guiBULLSEYE);
  BltVideoObject(guiSAVEBUFFER, hHandle, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
}

function HideExistenceOfUndergroundMapSector(ubSectorX: UINT8, ubSectorY: UINT8): void {
  let sScreenX: INT16;
  let sScreenY: INT16;

  ({ sX: sScreenX, sY: sScreenY } = GetScreenXYFromMapXY(ubSectorX, ubSectorY));

  // fill it with near black
  ColorFillVideoSurfaceArea(guiSAVEBUFFER, sScreenX + 1, sScreenY, sScreenX + MAP_GRID_X, sScreenY + MAP_GRID_Y - 1, gusUndergroundNearBlack);
}

export function InitMapSecrets(): void {
  let ubSamIndex: UINT8;

  fFoundTixa = false;
  fFoundOrta = false;

  for (ubSamIndex = 0; ubSamIndex < NUMBER_OF_SAMS; ubSamIndex++) {
    fSamSiteFound[ubSamIndex] = false;
  }
}

export function CanRedistributeMilitiaInSector(sClickedSectorX: INT16, sClickedSectorY: INT16, bClickedTownId: INT8): boolean {
  let iCounter: INT32 = 0;
  let sBaseSectorValue: INT16 = 0;
  let sCurrentSectorValue: INT16 = 0;
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let iTotalTroopsInTown: INT32 = 0;

  // if no world is loaded, we can't be in combat (PBI/Auto-resolve locks out normal mapscreen interface for this)
  if (!gfWorldLoaded) {
    // ok to redistribute
    return true;
  }

  // if tactically not in combat, hostile sector, or air-raid
  if (!(gTacticalStatus.uiFlags & INCOMBAT) && !(gTacticalStatus.fEnemyInSector) && !InAirRaid()) {
    // ok to redistribute
    return true;
  }

  // if the fight is underground
  if (gbWorldSectorZ != 0) {
    // ok to redistribute
    return true;
  }

  // currently loaded surface sector IS hostile - so we must check if it's also one of the sectors in this "militia map"

  // get the sector value for the upper left corner
  sBaseSectorValue = sBaseSectorList[bClickedTownId - 1];

  // render icons for map
  for (iCounter = 0; iCounter < 9; iCounter++) {
    // grab current sector value
    sCurrentSectorValue = sBaseSectorValue + ((iCounter % MILITIA_BOX_ROWS) + (iCounter / MILITIA_BOX_ROWS) * (16));

    sSectorX = SECTORX(sCurrentSectorValue);
    sSectorY = SECTORY(sCurrentSectorValue);

    // not in the same town?
    if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sSectorX, sSectorY)].bNameId != bClickedTownId) {
      continue;
    }

    // if this is the loaded sector that is currently hostile
    if ((sSectorX == gWorldSectorX) && (sSectorY == gWorldSectorY)) {
      // the fight is within this town!  Can't redistribute.
      return false;
    }
  }

  // the fight is elsewhere - ok to redistribute
  return true;
}

}
