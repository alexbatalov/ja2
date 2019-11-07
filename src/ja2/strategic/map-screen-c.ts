namespace ja2 {

// DEFINES

const MAX_SORT_METHODS = 6;

// Cursors
const SCREEN_CURSOR = Enum317.CURSOR_NORMAL;

// Fonts
const CHAR_FONT = () => BLOCKFONT2(); // COMPFONT
const ETA_FONT = () => BLOCKFONT2();

// Colors
const CHAR_INFO_PANEL_BLOCK_COLOR = 60;

const FONT_MAP_DKYELLOW = 170;

const CHAR_TITLE_FONT_COLOR = 6;
const CHAR_TEXT_FONT_COLOR = 5;

const STARTING_COLOR_NUM = 5;

const MAP_TIME_UNDER_THIS_DISPLAY_AS_HOURS = (3 * 24 * 60);

const MIN_KB_TO_DO_PRE_LOAD = (32 * 1024);

const DELAY_PER_FLASH_FOR_DEPARTING_PERSONNEL = 500;
const GLOW_DELAY = 70;
const ASSIGNMENT_DONE_FLASH_TIME = 500;

const MINS_TO_FLASH_CONTRACT_TIME = (4 * 60);

// Coordinate defines

const TOWN_INFO_X = 0;
const TOWN_INFO_Y = 1;

const PLAYER_INFO_X = 0;
const PLAYER_INFO_Y = 107;

// item description
const MAP_ITEMDESC_START_X = 0;
const MAP_ITEMDESC_START_Y = PLAYER_INFO_Y;

const INV_REGION_X = PLAYER_INFO_X;
const INV_REGION_Y = PLAYER_INFO_Y;
const INV_REGION_WIDTH = 261;
const INV_REGION_HEIGHT = 359 - 94;
const INV_BTN_X = PLAYER_INFO_X + 217;
const INV_BTN_Y = PLAYER_INFO_Y + 210;

const MAP_ARMOR_LABEL_X = 208;
const MAP_ARMOR_LABEL_Y = 180;
const MAP_ARMOR_X = 209;
const MAP_ARMOR_Y = 189;
const MAP_ARMOR_PERCENT_X = 229;
const MAP_ARMOR_PERCENT_Y = 190;

const MAP_WEIGHT_LABEL_X = 173;
const MAP_WEIGHT_LABEL_Y = 256;
const MAP_WEIGHT_X = 176;
const MAP_WEIGHT_Y = 266;
const MAP_WEIGHT_PERCENT_X = 196;
const MAP_WEIGHT_PERCENT_Y = 266;

const MAP_CAMMO_LABEL_X = 178;
const MAP_CAMMO_LABEL_Y = 283;
const MAP_CAMMO_X = 176;
const MAP_CAMMO_Y = 292;
const MAP_CAMMO_PERCENT_X = 196;
const MAP_CAMMO_PERCENT_Y = 293;

const MAP_PERCENT_WIDTH = 20;
const MAP_PERCENT_HEIGHT = 10;

const MAP_INV_STATS_TITLE_FONT_COLOR = 6;
const MAP_INV_STATS_TEXT_FONT_COLOR = 5;

const PLAYER_INFO_FACE_START_X = 9;
const PLAYER_INFO_FACE_START_Y = 17;
const PLAYER_INFO_FACE_END_X = 60;
const PLAYER_INFO_FACE_END_Y = 76;

const INV_BODY_X = 71;
const INV_BODY_Y = 116;

const NAME_X = 11;
const NAME_WIDTH = 62 - NAME_X;
const ASSIGN_X = 67;
const ASSIGN_WIDTH = 118 - ASSIGN_X;
const SLEEP_X = 123;
const SLEEP_WIDTH = 142 - SLEEP_X;
const LOC_X = 147;
const LOC_WIDTH = 179 - LOC_X;
const DEST_ETA_X = 184;
const DEST_ETA_WIDTH = 217 - DEST_ETA_X;
const TIME_REMAINING_X = 222;
const TIME_REMAINING_WIDTH = 250 - TIME_REMAINING_X;
const CLOCK_X_START = 463 - 18;
const CLOCK_Y_START = 298;
const DEST_PLOT_X = 463;
const DEST_PLOT_Y = 345;
const CLOCK_ETA_X = 463 - 15 + 6 + 30;
const CLOCK_HOUR_X_START = 463 + 25 + 30;
const CLOCK_MIN_X_START = 463 + 45 + 30;

// contract
const CONTRACT_X = 185;
const CONTRACT_Y = 50;
//#define CONTRACT_WIDTH  63
//#define CONTRACT_HEIGHT 10

// trash can
const TRASH_CAN_X = 176;
const TRASH_CAN_Y = 211 + PLAYER_INFO_Y;
const TRASH_CAN_WIDTH = 193 - 165;
const TRASH_CAN_HEIGHT = 239 - 217;

// Text offsets
const Y_OFFSET = 2;

// The boxes defines
const TRAIN_Y_OFFSET = 53;
const TRAIN_X_OFF = 65;
const TRAIN_WID = 80;
const TRAIN_HEIG = 47;
const STRING_X_OFFSET = 10;
const STRING_Y_OFFSET = 5;
const POP_UP_BOX_X = 120;
const POP_UP_BOX_Y = 0;
const POP_UP_BOX_WIDTH = 60;
const POP_UP_BOX_HEIGHT = 100;
const MOUSE_PTR_Y_OFFSET = 3;
const POP_UP_Y_OFFSET = 3;
const TRAIN_TEXT_Y_OFFSET = 4;

// char stat positions
const STR_X = (112);
const STR_Y = 42;
const DEX_X = STR_X;
const DEX_Y = 32;
const AGL_X = STR_X;
const AGL_Y = 22;
const LDR_X = STR_X;
const LDR_Y = 52;
const WIS_X = STR_X;
const WIS_Y = 62;
const LVL_X = (159);
const LVL_Y = AGL_Y;
const MRK_X = LVL_X;
const MRK_Y = DEX_Y;
const EXP_X = LVL_X;
const EXP_Y = STR_Y;
const MEC_X = LVL_X;
const MEC_Y = LDR_Y;
const MED_X = LVL_X;
const MED_Y = WIS_Y;

const STAT_WID = 15;
const STAT_HEI = () => GetFontHeight(CHAR_FONT());

const PIC_NAME_X = 8;
const PIC_NAME_Y = (66 + 3);
const PIC_NAME_WID = 60 - PIC_NAME_X;
const PIC_NAME_HEI = 75 - PIC_NAME_Y;
const CHAR_NAME_X = 14;
const CHAR_NAME_Y = (2 + 3);
const CHAR_NAME_WID = 164 - CHAR_NAME_X;
const CHAR_NAME_HEI = 11 - CHAR_NAME_Y;
const CHAR_LOC_X = 76;
const CHAR_LOC_Y = 84;
const CHAR_LOC_WID = 16;
const CHAR_LOC_HEI = 9;
const CHAR_TIME_REMAINING_X = 207;
const CHAR_TIME_REMAINING_Y = 65;
const CHAR_TIME_REMAINING_WID = 258 - CHAR_TIME_REMAINING_X;
const CHAR_TIME_REMAINING_HEI = () => GetFontHeight(CHAR_FONT());
const CHAR_SALARY_X = CHAR_TIME_REMAINING_X;
const CHAR_SALARY_Y = 79;
const CHAR_SALARY_WID = CHAR_TIME_REMAINING_WID - 8; // for right justify
const CHAR_SALARY_HEI = () => CHAR_TIME_REMAINING_HEI();
const CHAR_MEDICAL_X = CHAR_TIME_REMAINING_X;
const CHAR_MEDICAL_Y = 93;
const CHAR_MEDICAL_WID = CHAR_TIME_REMAINING_WID - 8; // for right justify
const CHAR_MEDICAL_HEI = () => CHAR_TIME_REMAINING_HEI();
const CHAR_ASSIGN_X = 182;
const CHAR_ASSIGN1_Y = 18;
const CHAR_ASSIGN2_Y = 31;
const CHAR_ASSIGN_WID = 257 - 178;
const CHAR_ASSIGN_HEI = 39 - 29;
const CHAR_HP_X = 133;
const CHAR_HP_Y = 77 + 3;
const CHAR_HP_WID = 175 - CHAR_HP_X;
const CHAR_HP_HEI = 90 - CHAR_HP_Y;
const CHAR_MORALE_X = 133;
const CHAR_MORALE_Y = 91 + 3;
const CHAR_MORALE_WID = 175 - CHAR_MORALE_X;
const CHAR_MORALE_HEI = 101 - CHAR_MORALE_Y;

const CROSS_X = 195;
const CROSS_Y = 83;
const CROSS_HEIGHT = 20;
const CROSS_WIDTH = 20;
const CHAR_PAY_X = 150;
const CHAR_PAY_Y = 80 + 4;
const CHAR_PAY_HEI = () => GetFontHeight(CHAR_FONT());
const CHAR_PAY_WID = CROSS_X - CHAR_PAY_X;
const SOLDIER_PIC_X = 9;
const SOLDIER_PIC_Y = 20;
const SOLDIER_HAND_X = 6;
const SOLDIER_HAND_Y = 81;
//#define	TM_INV_WIDTH								58
//#define	TM_INV_HEIGHT								23

const CLOCK_X = 554;
const CLOCK_Y = 459;

const RGB_WHITE = () => (FROMRGB(255, 255, 255));
const RGB_YELLOW = () => (FROMRGB(255, 255, 0));
const RGB_NEAR_BLACK = () => (FROMRGB(0, 0, 1));

// ENUMS

// ARM: NOTE that these map "events" are never actually saved in a player's game in any way
const enum Enum134 {
  MAP_EVENT_NONE,
  MAP_EVENT_CLICK_SECTOR,
  MAP_EVENT_PLOT_PATH,
  MAP_EVENT_CANCEL_PATH,
}

// STRUCTURES / TYPEDEFS

interface RGBCOLOR {
  ubRed: UINT8;
  ubGreen: UINT8;
  ubBlue: UINT8;
}

interface LineText {
  pLineText: string /* STR16 */;
  uiFont: UINT32;
  pNext: Pointer<LineText>;
}

type LineTextPtr = Pointer<LineText>;

interface PopUpBox {
  usTopX: UINT16;
  usTopY: UINT16;
  usWidth: UINT16;
  usHeight: UINT16;
  pBoxText: LineTextPtr;
  pNext: Pointer<PopUpBox>;
}

type PopUpBoxPtr = Pointer<PopUpBox>;

// TABLES

let GlowColorsA: RGBCOLOR[] /* [] */ = [
  [ 0, 0, 0 ],
  [ 25, 0, 0 ],
  [ 50, 0, 0 ],
  [ 75, 0, 0 ],
  [ 100, 0, 0 ],
  [ 125, 0, 0 ],
  [ 150, 0, 0 ],
  [ 175, 0, 0 ],
  [ 200, 0, 0 ],
  [ 225, 0, 0 ],
  [ 250, 0, 0 ],
];
/* unused
RGBCOLOR GlowColorsB[]={
        {0,0,0},
        {25,25,0},
        {50,50,0},
        {75,75,0},
        {100,100,0},
        {125,125,0},
        {150,150,0},
        {175,175,0},
        {200,200,0},
        {225,225,0},
        {255,255,0},
};
RGBCOLOR GlowColorsC[]={
        {0,0,0},
        {25,0,25},
        {50,0,50},
        {75,0,75},
        {100,0,100},
        {125,0,125},
        {150,0,150},
        {175,0,175},
        {200,0,200},
        {225,0,225},
        {255,0,255},
};
*/

let gMapSortButtons: SGPPoint[] /* [MAX_SORT_METHODS] */ = [
  createSGPPointFrom(12, 125),
  createSGPPointFrom(68, 125),
  createSGPPointFrom(124, 125),
  createSGPPointFrom(148, 125),
  createSGPPointFrom(185, 125),
  createSGPPointFrom(223, 125),
];

// map screen's inventory panel pockets - top right corner coordinates
let gMapScreenInvPocketXY: INV_REGION_DESC[] /* [] */ = [
  [ 204, 116 ], // HELMETPOS
  [ 204, 145 ], // VESTPOS
  [ 204, 205 ], // LEGPOS,
  [ 21, 116 ], // HEAD1POS
  [ 21, 140 ], // HEAD2POS
  [ 21, 194 ], // HANDPOS,
  [ 21, 218 ], // SECONDHANDPOS
  [ 98, 251 ], // BIGPOCK1
  [ 98, 275 ], // BIGPOCK2
  [ 98, 299 ], // BIGPOCK3
  [ 98, 323 ], // BIGPOCK4
  [ 22, 251 ], // SMALLPOCK1
  [ 22, 275 ], // SMALLPOCK2
  [ 22, 299 ], // SMALLPOCK3
  [ 22, 323 ], // SMALLPOCK4
  [ 60, 251 ], // SMALLPOCK5
  [ 60, 275 ], // SMALLPOCK6
  [ 60, 299 ], // SMALLPOCK7
  [ 60, 323 ], // SMALLPOCK8
];

let gSCamoXY: INV_REGION_DESC = [
  INV_BODY_X, INV_BODY_Y // X, Y Location of Map screen's Camouflage region
];

// GLOBAL VARIABLES (OURS)

let fFlashAssignDone: boolean = false;
export let fInMapMode: boolean = false;
export let fMapPanelDirty: boolean = true;
export let fTeamPanelDirty: boolean = true;
export let fCharacterInfoPanelDirty: boolean = true;
let gfLoadPending: boolean = false;
export let fReDrawFace: boolean = false;
export let fFirstTimeInMapScreen: boolean = true;
export let fShowInventoryFlag: boolean = false;
export let fMapInventoryItem: boolean = false;
export let fShowDescriptionFlag: boolean = false;

// are the graphics for mapscreen preloaded?
let fPreLoadedMapGraphics: boolean = false;

let gfHotKeyEnterSector: boolean = false;
let fOneFrame: boolean = false;
let fShowFaceHightLight: boolean = false;
let fShowItemHighLight: boolean = false;
let gfAllowSkyriderTooFarQuote: boolean = false;
let fJustFinishedPlotting: boolean = false;

// for the flashing of the contract departure time...for when mercs are leaving in an hour or less
let fFlashContractFlag: boolean = false;

let fShowTrashCanHighLight: boolean = false;

// the flags for display of pop up boxes/menus
let fEndPlotting: boolean = false;

export let gfInConfirmMapMoveMode: boolean = false;
export let gfInChangeArrivalSectorMode: boolean = false;

// redraw character list
export let fDrawCharacterList: boolean = true;

// was the cursor set to the checkmark?
let fCheckCursorWasSet: boolean = false;

let fShowingMapDisableBox: boolean = false;
let fShowFrameRate: boolean = false;
// BOOLEAN fMapExitDueToMessageBox = FALSE;
let fEndShowInventoryFlag: boolean = false;

// draw the temp path
let fDrawTempPath: boolean = true;

let gfCharacterListInited: boolean = false;

let gfGlowTimerExpired: boolean = false;

// not required to be saved.  The flag is set to allow mapscreen to render once, then transition the
// current tactical battle into autoresolve.
export let gfTransitionMapscreenToAutoResolve: boolean = false;

export let gfSkyriderEmptyHelpGiven: boolean = false;

let gfRequestGiveSkyriderNewDestination: boolean = false;

let gfFirstMapscreenFrame: boolean = false;

let gfMapPanelWasRedrawn: boolean = false;

let gubMAP_HandInvDispText: UINT8[] /* [NUM_INV_SLOTS] */;

// currently selected character's list index
export let bSelectedInfoChar: INT8 = -1;

// map sort button images
let giMapSortButtonImage: INT32[] /* [MAX_SORT_METHODS] */ = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
];
let giMapSortButton: INT32[] /* [MAX_SORT_METHODS] */ = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
];

let giCharInfoButtonImage: INT32[] /* [2] */;
export let giCharInfoButton: INT32[] /* [2] */ = [
  -1,
  -1,
];

let giMapInvButtonDoneImage: INT32;
export let giMapInvDoneButton: INT32 = -1;

export let giMapContractButton: INT32 = -1;
let giMapContractButtonImage: INT32;

// INT32 giMapInvButton = -1;
// INT32 giMapInvButtonImage;

export let giSortStateForMapScreenList: INT32 = 0;

export let giCommonGlowBaseTime: INT32 = 0;
export let giFlashAssignBaseTime: INT32 = 0;
export let giFlashContractBaseTime: INT32 = 0;
export let guiFlashCursorBaseTime: UINT32 = 0;
export let giPotCharPathBaseTime: INT32 = 0;

let guiCHARLIST: UINT32;
let guiCHARINFO: UINT32;
let guiSleepIcon: UINT32;
let guiCROSS: UINT32;
let guiMAPINV: UINT32;
export let guiMapInvSecondHandBlockout: UINT32;
let guiULICONS: UINT32;
let guiNewMailIcons: UINT32;
export let guiLEVELMARKER: UINT32; // the white rectangle highlighting the current level on the map border

// misc mouse regions
let gCharInfoFaceRegion: MOUSE_REGION;
export let gCharInfoHandRegion: MOUSE_REGION;
export let gMPanelRegion: MOUSE_REGION;
let gMapViewRegion: MOUSE_REGION;
let gMapScreenMaskRegion: MOUSE_REGION;
let gTrashCanRegion: MOUSE_REGION;

// mouse regions for team info panel
let gTeamListNameRegion: MOUSE_REGION[] /* [MAX_CHARACTER_COUNT] */;
let gTeamListAssignmentRegion: MOUSE_REGION[] /* [MAX_CHARACTER_COUNT] */;
let gTeamListSleepRegion: MOUSE_REGION[] /* [MAX_CHARACTER_COUNT] */;
let gTeamListLocationRegion: MOUSE_REGION[] /* [MAX_CHARACTER_COUNT] */;
let gTeamListDestinationRegion: MOUSE_REGION[] /* [MAX_CHARACTER_COUNT] */;
let gTeamListContractRegion: MOUSE_REGION[] /* [MAX_CHARACTER_COUNT] */;

export let gItemPointer: OBJECTTYPE;
export let gpItemPointerSoldier: Pointer<SOLDIERTYPE>;

let gpCharacterPreviousMercPath: PathStPtr[] /* [MAX_CHARACTER_COUNT] */;
let gpHelicopterPreviousMercPath: PathStPtr = null;

// GLOBAL VARIABLES (EXTERNAL)

// extern BOOLEAN	gfFacePanelActive;

// PROTOTYPES

// The Mouse/Btn Creation/Destruction

// Mouse Region Callbacks

// the tries to select a mapscreen character by his soldier ID
export function SetInfoChar(ubID: UINT8): boolean {
  let bCounter: INT8;

  for (bCounter = 0; bCounter < MAX_CHARACTER_COUNT; bCounter++) {
    // skip invalid characters
    if (gCharactersList[bCounter].fValid == true) {
      if (gCharactersList[bCounter].usSolID == ubID) {
        ChangeSelectedInfoChar(bCounter, true);
        return true;
      }
    }
  }

  return false;
}

function DisplayDestinationOfCurrentDestMerc(): void {
  // will display the dest of the current dest merc
  let sString: string /* CHAR16[32] */;
  let sX: INT16;
  let sY: INT16;
  let sSector: INT16;

  SetFont(MAP_SCREEN_FONT());

  sSector = GetLastSectorIdInCharactersPath(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]));

  SetBoxForeground(ghVehicleBox, FONT_LTGREEN);
  SetBoxBackground(ghVehicleBox, FONT_BLACK);

  sString = swprintf("%s%s", pMapVertIndex[sSector / MAP_WORLD_X], pMapHortIndex[sSector % MAP_WORLD_X]);
  FindFontCenterCoordinates(DEST_PLOT_X, DEST_PLOT_Y, 70, GetFontHeight(MAP_SCREEN_FONT()), sString, MAP_SCREEN_FONT(), addressof(sX), addressof(sY));

  RestoreExternBackgroundRect(DEST_PLOT_X, DEST_PLOT_Y, 70, GetFontHeight(MAP_SCREEN_FONT()));
  mprintf(sX, sY, sString);
}

function ContractBoxGlow(): void {
  /* Why not?
   static INT32 iColorNum=10;
   static BOOLEAN fDelta=FALSE;
   static BOOLEAN fOldContractGlow = FALSE;
   UINT16 usColor;
   UINT32 uiDestPitchBYTES;
   UINT8	*pDestBuf;


          // stopped glowing?
          if( ( fGlowContractRegion == FALSE )&&( ( fOldContractGlow == TRUE )||( fResetContractGlow== TRUE ) ) )
          {
                  // restore background
                  // RestoreExternBackgroundRect( CONTRACT_X, CONTRACT_Y, CONTRACT_WIDTH+1, CONTRACT_HEIGHT+1 );

                  // reset old
                  fOldContractGlow = FALSE;
          }

          // not glowing right now, leave
          if( ( fGlowContractRegion == FALSE )||( fResetContractGlow == TRUE ) )
          {
                  // reset color rotation
                  iColorNum =0;
                  fDelta = TRUE;

                  // reset
                  fResetContractGlow = FALSE;
                  return;
          }

          // if not ready to change glow phase yet, leave
          if ( !gfGlowTimerExpired )
                  return;


          // change direction of glow?
          if((iColorNum==0)||(iColorNum==10))
          {
           fDelta=!fDelta;
          }

          // increment color
          if(!fDelta)
                  iColorNum++;
          else
                  iColorNum--;

          usColor=Get16BPPColor( FROMRGB( GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue ) );
          pDestBuf = LockVideoSurface( FRAME_BUFFER, &uiDestPitchBYTES );
          SetClippingRegionAndImageWidth( uiDestPitchBYTES, 0, 0, 640, 480);
          RectangleDraw( TRUE, CONTRACT_X, CONTRACT_Y, CONTRACT_X+CONTRACT_WIDTH, CONTRACT_Y+CONTRACT_HEIGHT, usColor, pDestBuf );
          InvalidateRegion(CONTRACT_X, CONTRACT_Y, CONTRACT_X+CONTRACT_WIDTH+1, CONTRACT_Y+CONTRACT_HEIGHT+1);
          UnLockVideoSurface( FRAME_BUFFER );

          // restore background
          if((iColorNum==0)||(iColorNum==1))
                  RestoreExternBackgroundRect( CONTRACT_X, CONTRACT_Y, CONTRACT_WIDTH+1, CONTRACT_HEIGHT+1 );
  */
}

function ContractListRegionBoxGlow(usCount: UINT16): void {
  /* static */ let iColorNum: INT32 = 10;
  /* static */ let fDelta: boolean = false;
  let usColor: UINT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usY: INT16 = 0;
  let sYAdd: INT16 = 0;

  // if not glowing right now, leave
  if ((giContractHighLine == -1) || (fResetContractGlow == true) || fShowInventoryFlag) {
    iColorNum = 0;
    fDelta = true;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  // change direction of glow?
  if ((iColorNum == 0) || (iColorNum == 10)) {
    fDelta = !fDelta;
  }

  // increment color
  if (!fDelta)
    iColorNum++;
  else
    iColorNum--;

  if (usCount >= FIRST_VEHICLE) {
    sYAdd = 6;
  } else {
    sYAdd = 0;
  }

  // y start position of box
  usY = (Y_OFFSET * usCount - 1) + (Y_START + (usCount * Y_SIZE()) + sYAdd);

  // glow contract box
  usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, TIME_REMAINING_X, usY, TIME_REMAINING_X + TIME_REMAINING_WIDTH, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
  InvalidateRegion(TIME_REMAINING_X - 1, usY, TIME_REMAINING_X + TIME_REMAINING_WIDTH + 1, usY + GetFontHeight(MAP_SCREEN_FONT()) + 3);
  UnLockVideoSurface(FRAME_BUFFER);

  /*
          // restore background
          if((iColorNum==0)||(iColorNum==1))
                  RestoreExternBackgroundRect( CONTRACT_X, CONTRACT_Y, CONTRACT_WIDTH+1, CONTRACT_HEIGHT+1 );
  */
}

function GlowFace(): void {
  /* static */ let iColorNum: INT32 = 10;
  /* static */ let fDelta: boolean = false;
  /* static */ let fOldFaceGlow: boolean = false;
  let usColor: UINT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usY: INT16 = 0;

  // not glowing right now, leave
  if (fShowFaceHightLight == false) {
    iColorNum = 0;
    fDelta = true;

    if (fOldFaceGlow == true) {
      RestoreExternBackgroundRect(9, 18, (61 - 9), (64 - 18));
    }

    fOldFaceGlow = false;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  fOldFaceGlow = true;

  // change direction of glow?
  if ((iColorNum == 0) || (iColorNum == 10)) {
    fDelta = !fDelta;
  }

  // increment color
  if (!fDelta)
    iColorNum++;
  else
    iColorNum--;

  // glow contract box
  usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, 9, 18, 60, 63, usColor, pDestBuf);
  InvalidateRegion(9, 18, 61, 64);
  UnLockVideoSurface(FRAME_BUFFER);

  // restore background
  if ((iColorNum == 0) || (iColorNum == 1))
    RestoreExternBackgroundRect(9, 18, (61 - 9), (64 - 18));
}

function GlowItem(): void {
  /* static */ let iColorNum: INT32 = 10;
  /* static */ let fDelta: boolean = false;
  /* static */ let fOldItemGlow: boolean = false;
  let usColor: UINT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usY: INT16 = 0;

  // not glowing right now, leave
  if (fShowItemHighLight == false) {
    iColorNum = 0;
    fDelta = true;

    if (fOldItemGlow == true) {
      RestoreExternBackgroundRect(3, 80, (65 - 3), (105 - 80));
    }

    fOldItemGlow = false;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  fOldItemGlow = true;

  // change direction of glow?
  if ((iColorNum == 0) || (iColorNum == 10)) {
    fDelta = !fDelta;
  }

  // increment color
  if (!fDelta)
    iColorNum++;
  else
    iColorNum--;

  // restore background
  if ((iColorNum == 0) || (iColorNum == 1)) {
    RestoreExternBackgroundRect(3, 80, (65 - 3), (105 - 80));
    RenderHandPosItem();
  }

  // glow contract box
  usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, 3, 80, 64, 104, usColor, pDestBuf);
  InvalidateRegion(3, 80, 65, 105);
  UnLockVideoSurface(FRAME_BUFFER);
}

function GlowTrashCan(): void {
  /* static */ let iColorNum: INT32 = 10;
  /* static */ let fDelta: boolean = false;
  /* static */ let fOldTrashCanGlow: boolean = false;
  let usColor: UINT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usY: INT16 = 0;

  if (fShowInventoryFlag == false) {
    fShowTrashCanHighLight = false;
  }

  // not glowing right now, leave
  if (fShowTrashCanHighLight == false) {
    iColorNum = 0;
    fDelta = true;

    if (fOldTrashCanGlow == true) {
      RestoreExternBackgroundRect(TRASH_CAN_X, TRASH_CAN_Y, (TRASH_CAN_WIDTH + 2), (TRASH_CAN_HEIGHT + 2));
    }

    fOldTrashCanGlow = false;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  fOldTrashCanGlow = true;

  // glow contract box
  usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  RectangleDraw(true, TRASH_CAN_X, TRASH_CAN_Y, TRASH_CAN_X + TRASH_CAN_WIDTH, TRASH_CAN_Y + TRASH_CAN_HEIGHT, usColor, pDestBuf);
  InvalidateRegion(TRASH_CAN_X, TRASH_CAN_Y, TRASH_CAN_X + TRASH_CAN_WIDTH + 1, TRASH_CAN_Y + TRASH_CAN_HEIGHT + 1);
  UnLockVideoSurface(FRAME_BUFFER);

  // restore background
  if ((iColorNum == 0) || (iColorNum == 1))
    RestoreExternBackgroundRect(TRASH_CAN_X, TRASH_CAN_Y, (TRASH_CAN_WIDTH + 2), (TRASH_CAN_HEIGHT + 2));
}

export function DrawFace(sCharNumber: INT16): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  /* static */ let sOldId: INT16 = -1;

  // draws the face of the currently selected merc, being displayed int he upper left hand corner

  // grab the soldier
  if (bSelectedInfoChar != -1) {
    if (gCharactersList[bSelectedInfoChar].fValid) {
      GetSoldier(addressof(pSoldier), gCharactersList[bSelectedInfoChar].usSolID);
    }
  }

  if (pSoldier == null) {
    return;
  }

  if ((gCharactersList[bSelectedInfoChar].usSolID == sOldId) && (fReDrawFace == false)) {
    // are the same, return
    return;
  }

  // get old id value
  sOldId = gCharactersList[bSelectedInfoChar].usSolID;

  // reset redraw of face
  fReDrawFace = false;

  // render their face
  RenderSoldierFace(pSoldier, SOLDIER_PIC_X, SOLDIER_PIC_Y, true);

  return;
}

function RenderHandPosItem(): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  // renders the inventory item in char's right hand

  // ARM: if already in the inventory panel, don't show the item again here, seeing it twice is confusing
  if (fShowInventoryFlag) {
    return;
  }

  // grab the soldier
  if (bSelectedInfoChar != -1) {
    if (gCharactersList[bSelectedInfoChar].fValid) {
      GetSoldier(addressof(pSoldier), gCharactersList[bSelectedInfoChar].usSolID);
    }
  }

  if (pSoldier == null) {
    return;
  }

  // check if still alive?
  if (pSoldier.value.bLife == 0) {
    return;
  }

  SetFont(BLOCKFONT2());
  SetFontForeground(CHAR_INFO_PANEL_BLOCK_COLOR);
  SetFontBackground(FONT_BLACK);

  INVRenderItem(guiSAVEBUFFER, pSoldier, addressof(pSoldier.value.inv[Enum261.HANDPOS]), SOLDIER_HAND_X, SOLDIER_HAND_Y, 58, 23, DIRTYLEVEL2, null, 0, false, 0);
}

function RenderIconsForUpperLeftCornerPiece(bCharNumber: INT8): void {
  let hHandle: HVOBJECT;

  GetVideoObject(addressof(hHandle), guiULICONS);

  // if merc is an AIM merc
  if (Menptr[gCharactersList[bCharNumber].usSolID].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
    // finite contract length icon
    BltVideoObject(guiSAVEBUFFER, hHandle, 0, CHAR_ICON_X, CHAR_ICON_CONTRACT_Y, VO_BLT_SRCTRANSPARENCY, null);
  }

  // if merc has life insurance
  if (Menptr[gCharactersList[bCharNumber].usSolID].usLifeInsurance > 0) {
    // draw life insurance icon
    BltVideoObject(guiSAVEBUFFER, hHandle, 2, CHAR_ICON_X, CHAR_ICON_CONTRACT_Y + CHAR_ICON_SPACING, VO_BLT_SRCTRANSPARENCY, null);
  }

  // if merc has a medical deposit
  if (Menptr[gCharactersList[bCharNumber].usSolID].usMedicalDeposit > 0) {
    // draw medical deposit icon
    BltVideoObject(guiSAVEBUFFER, hHandle, 1, CHAR_ICON_X, CHAR_ICON_CONTRACT_Y + (2 * CHAR_ICON_SPACING), VO_BLT_SRCTRANSPARENCY, null);
  }
}

function DrawPay(sCharNumber: INT16): void {
  // will draw the pay
  let uiSalary: INT32;
  let sString: string /* wchar_t[7] */;
  let usX: UINT16;
  let usY: UINT16;
  let usMercProfileID: INT16;

  // get merc id
  usMercProfileID = MercPtrs[gCharactersList[sCharNumber].usSolID].value.ubProfile;

  // grab salary
  uiSalary = (gMercProfiles[usMercProfileID].sSalary);

  // font stuff
  SetFontForeground(CHAR_TITLE_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  // parse salary
  sString = swprintf("%d", uiSalary);

  // right justify salary
  FindFontRightCoordinates(CHAR_PAY_X, CHAR_PAY_Y, CHAR_PAY_WID, CHAR_PAY_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));

  // draw salary
  DrawString(sString, usX, usY, CHAR_FONT());
}

function DrawCharBars(): void {
  let usSoldierID: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // will draw the heath, morale and breath bars for a character being displayed in the upper left hand corner

  if ((bSelectedInfoChar == -1) && (bSelectedDestChar == -1)) {
    // error, no character to display right now
    return;
  } else {
    // valid character
    if (bSelectedInfoChar != -1) {
      usSoldierID = gCharactersList[bSelectedInfoChar].usSolID;
    } else {
      usSoldierID = gCharactersList[bSelectedDestChar].usSolID;
    }

    // grab soldier's id number
    GetSoldier(addressof(pSoldier), usSoldierID);

    if (pSoldier == null) {
      // no soldier
      return;
    }

    // skip POWs, dead guys
    if ((pSoldier.value.bLife == 0) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_DEAD) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
      return;
    }

    // current health
    DrawLifeUIBarEx(pSoldier, BAR_INFO_X, BAR_INFO_Y, 3, 42, true, FRAME_BUFFER);

    // robot doesn't have energy/fuel
    if (!AM_A_ROBOT(pSoldier)) {
      // current energy/fuel
      DrawBreathUIBarEx(pSoldier, BAR_INFO_X + 6, BAR_INFO_Y, 3, 42, true, FRAME_BUFFER);
    }

    // vehicles and robot don't have morale
    if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier)) {
      // draw morale bar
      DrawMoraleUIBarEx(pSoldier, BAR_INFO_X + 12, BAR_INFO_Y, 3, 42, true, FRAME_BUFFER);
    }
  }

  return;
}

function DrawCharStats(sCharNum: INT16): void {
  // will draw the characters stats, max life, strength, dex, and skills
  let sString: string /* wchar_t[9] */;
  let usX: UINT16;
  let usY: UINT16;
  // HVOBJECT hCrossHandle;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  pSoldier = addressof(Menptr[gCharactersList[sCharNum].usSolID]);

  // set up font
  SetFont(CHAR_FONT());
  SetFontForeground(CHAR_TEXT_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  // strength
  sString = swprintf("%d", pSoldier.value.bStrength);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeStrengthTime) && (pSoldier.value.uiChangeStrengthTime != 0)) {
    if (pSoldier.value.usValueGoneUp & STRENGTH_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(STR_X, STR_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, STR_Y, CHAR_FONT());

  // dexterity
  sString = swprintf("%d", pSoldier.value.bDexterity);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeDexterityTime) && (pSoldier.value.uiChangeDexterityTime != 0)) {
    if (pSoldier.value.usValueGoneUp & DEX_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(DEX_X, DEX_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, DEX_Y, CHAR_FONT());

  // agility
  sString = swprintf("%d", pSoldier.value.bAgility);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeAgilityTime) && (pSoldier.value.uiChangeAgilityTime != 0)) {
    if (pSoldier.value.usValueGoneUp & AGIL_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(AGL_X, AGL_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, AGL_Y, CHAR_FONT());

  // wisdom
  sString = swprintf("%d", pSoldier.value.bWisdom);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeWisdomTime) && (pSoldier.value.uiChangeWisdomTime != 0)) {
    if (pSoldier.value.usValueGoneUp & WIS_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(WIS_X, WIS_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, WIS_Y, CHAR_FONT());

  // leadership
  sString = swprintf("%d", pSoldier.value.bLeadership);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeLeadershipTime) && (pSoldier.value.uiChangeLeadershipTime != 0)) {
    if (pSoldier.value.usValueGoneUp & LDR_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(LDR_X, LDR_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, LDR_Y, CHAR_FONT());

  // experience level
  sString = swprintf("%d", pSoldier.value.bExpLevel);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeLevelTime) && (pSoldier.value.uiChangeLevelTime != 0)) {
    if (pSoldier.value.usValueGoneUp & LVL_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(LVL_X, LVL_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, LVL_Y, CHAR_FONT());

  // marksmanship
  sString = swprintf("%d", pSoldier.value.bMarksmanship);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeMarksmanshipTime) && (pSoldier.value.uiChangeMarksmanshipTime != 0)) {
    if (pSoldier.value.usValueGoneUp & MRK_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(MRK_X, MRK_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, MRK_Y, CHAR_FONT());

  // explosives
  sString = swprintf("%d", pSoldier.value.bExplosive);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeExplosivesTime) && (pSoldier.value.uiChangeExplosivesTime != 0)) {
    if (pSoldier.value.usValueGoneUp & EXP_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(EXP_X, EXP_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, EXP_Y, CHAR_FONT());

  // mechanical
  sString = swprintf("%d", pSoldier.value.bMechanical);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeMechanicalTime) && (pSoldier.value.uiChangeMechanicalTime != 0)) {
    if (pSoldier.value.usValueGoneUp & MECH_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(MEC_X, MEC_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, MEC_Y, CHAR_FONT());

  // medical
  sString = swprintf("%d", pSoldier.value.bMedical);

  if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeMedicalTime) && (pSoldier.value.uiChangeMedicalTime != 0)) {
    if (pSoldier.value.usValueGoneUp & MED_INCREASE) {
      SetFontForeground(FONT_LTGREEN);
    } else {
      SetFontForeground(FONT_RED);
    }
  } else {
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
  }

  // right justify
  FindFontRightCoordinates(MED_X, MED_Y, STAT_WID, STAT_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, MED_Y, CHAR_FONT());

  SetFontForeground(CHAR_TEXT_FONT_COLOR);

  return;
}

function DrawCharHealth(sCharNum: INT16): void {
  let uiHealthPercent: UINT32 = 0;
  let sString: string /* wchar_t[9] */;
  let usX: UINT16;
  let usY: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  pSoldier = addressof(Menptr[gCharactersList[sCharNum].usSolID]);

  if (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) {
    // find starting X coordinate by centering all 3 substrings together, then print them separately (different colors)!
    sString = swprintf("%d/%d", pSoldier.value.bLife, pSoldier.value.bLifeMax);
    FindFontCenterCoordinates(CHAR_HP_X, CHAR_HP_Y, CHAR_HP_WID, CHAR_HP_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));

    if (pSoldier.value.bLifeMax > 0) {
      uiHealthPercent = (pSoldier.value.bLife * 100) / pSoldier.value.bLifeMax;
    }

    // how is characters life?
    if (uiHealthPercent == 0) {
      // he's dead, Jim
      SetFontForeground(FONT_METALGRAY);
    } else if (uiHealthPercent < 25) {
      // very bad
      SetFontForeground(FONT_RED);
    } else if (uiHealthPercent < 50) {
      // not good
      SetFontForeground(FONT_YELLOW);
    } else {
      // ok
      SetFontForeground(CHAR_TEXT_FONT_COLOR);
    }

    // current life
    sString = swprintf("%d", pSoldier.value.bLife);
    DrawString(sString, usX, CHAR_HP_Y, CHAR_FONT());
    usX += StringPixLength(sString, CHAR_FONT());

    // slash
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
    sString = "/";
    DrawString(sString, usX, CHAR_HP_Y, CHAR_FONT());
    usX += StringPixLength(sString, CHAR_FONT());

    if ((GetJA2Clock() < CHANGE_STAT_RECENTLY_DURATION + pSoldier.value.uiChangeHealthTime) && (pSoldier.value.uiChangeHealthTime != 0)) {
      if (pSoldier.value.usValueGoneUp & HEALTH_INCREASE) {
        SetFontForeground(FONT_LTGREEN);
      } else {
        SetFontForeground(FONT_RED);
      }
    } else {
      SetFontForeground(CHAR_TEXT_FONT_COLOR);
    }

    // maximum life
    sString = swprintf("%d", pSoldier.value.bLifeMax);
    DrawString(sString, usX, CHAR_HP_Y, CHAR_FONT());
  } else {
    // POW - health unknown
    SetFontForeground(CHAR_TEXT_FONT_COLOR);
    sString = pPOWStrings[1];
    FindFontCenterCoordinates(CHAR_HP_X, CHAR_HP_Y, CHAR_HP_WID, CHAR_HP_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));
    DrawString(sString, usX, CHAR_HP_Y, CHAR_FONT());
  }

  SetFontForeground(CHAR_TEXT_FONT_COLOR);
}

// "character" refers to hired people AND vehicles
function DrawCharacterInfo(sCharNumber: INT16): void {
  let sString: string /* wchar_t[80] */;
  let usX: UINT16;
  let usY: UINT16;
  let usMercProfileID: INT16;
  let iTimeRemaining: INT32 = 0;
  let bMorale: INT8 = 0;
  let iDailyCost: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let uiArrivalTime: UINT32;

  if (gCharactersList[sCharNumber].fValid == false) {
    return;
  }

  pSoldier = MercPtrs[gCharactersList[sCharNumber].usSolID];

  if (pSoldier.value.ubProfile == NO_PROFILE) {
    return;
  }

  // draw particular info about a character that are neither attributes nor skills

  // get profile information
  usMercProfileID = pSoldier.value.ubProfile;

  // set font stuff
  SetFont(CHAR_FONT());
  SetFontForeground(CHAR_TEXT_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  // Nickname (beneath Picture)
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    // vehicle
    sString = pShortVehicleStrings[pVehicleList[pSoldier.value.bVehicleID].ubVehicleType];
  } else {
    // soldier
    sString = gMercProfiles[usMercProfileID].zNickname;
  }

  FindFontCenterCoordinates(PIC_NAME_X, PIC_NAME_Y, PIC_NAME_WID, PIC_NAME_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, usY, CHAR_FONT());

  // Full name (Top Box)
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    // vehicle
    sString = pVehicleStrings[pVehicleList[pSoldier.value.bVehicleID].ubVehicleType];
  } else {
    // soldier
    sString = gMercProfiles[usMercProfileID].zName;
  }

  FindFontCenterCoordinates(CHAR_NAME_X, CHAR_NAME_Y, CHAR_NAME_WID, CHAR_NAME_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, usY, CHAR_FONT());

  // Assignment
  if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
    // show vehicle type
    sString = pShortVehicleStrings[pVehicleList[pSoldier.value.iVehicleId].ubVehicleType];
  } else {
    sString = pAssignmentStrings[pSoldier.value.bAssignment];
  }

  FindFontCenterCoordinates(CHAR_ASSIGN_X, CHAR_ASSIGN1_Y, CHAR_ASSIGN_WID, CHAR_ASSIGN_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, usY, CHAR_FONT());

  // second assignment line

  // train self / teammate / by other ?
  if ((pSoldier.value.bAssignment == Enum117.TRAIN_SELF) || (pSoldier.value.bAssignment == Enum117.TRAIN_TEAMMATE) || (pSoldier.value.bAssignment == Enum117.TRAIN_BY_OTHER)) {
    sString = pAttributeMenuStrings[pSoldier.value.bTrainStat];
  }
  // train town?
  else if (pSoldier.value.bAssignment == Enum117.TRAIN_TOWN) {
    sString = pTownNames[GetTownIdForSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY)];
  }
  // repairing?
  else if (pSoldier.value.bAssignment == Enum117.REPAIR) {
    if (pSoldier.value.fFixingRobot) {
      // robot
      sString = pRepairStrings[3];
    }
    /*
                    else if ( pSoldier->fFixingSAMSite )
                    {
                            // SAM site
                            wcscpy( sString, pRepairStrings[ 1 ] );
                    }
    */
    else if (pSoldier.value.bVehicleUnderRepairID != -1) {
      // vehicle
      sString = pShortVehicleStrings[pVehicleList[pSoldier.value.bVehicleUnderRepairID].ubVehicleType];
    } else {
      // items
      sString = pRepairStrings[0];
    }
  }
  // in transit?
  else if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) {
    // show ETA
    ConvertMinTimeToETADayHourMinString(pSoldier.value.uiTimeSoldierWillArrive, sString);
  }
  // traveling ?
  else if (PlayerIDGroupInMotion(GetSoldierGroupId(pSoldier))) {
    // show ETA
    uiArrivalTime = GetWorldTotalMin() + CalculateTravelTimeOfGroupId(GetSoldierGroupId(pSoldier));
    ConvertMinTimeToETADayHourMinString(uiArrivalTime, sString);
  } else {
    // show location
    GetMapscreenMercLocationString(pSoldier, sString);
  }

  if (sString.length > 0) {
    FindFontCenterCoordinates(CHAR_ASSIGN_X, CHAR_ASSIGN2_Y, CHAR_ASSIGN_WID, CHAR_ASSIGN_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));
    DrawString(sString, usX, usY, CHAR_FONT());
  }

  // draw health/condition
  DrawCharHealth(sCharNumber);

  // if a vehicle or robot
  if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier)) {
    // we're done - the remainder applies only to people
    return;
  }

  // draw attributes & skills for currently displayed character
  DrawCharStats(sCharNumber);

  // remaining contract length

  // dead?
  if (pSoldier.value.bLife <= 0) {
    sString = swprintf("%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
  }
  // what kind of merc
  else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC || pSoldier.value.ubProfile == Enum268.SLAY) {
    let dTimeLeft: FLOAT = 0.0;

    // amount of time left on contract
    iTimeRemaining = pSoldier.value.iEndofContractTime - GetWorldTotalMin();

    // if the merc is in transit
    if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) {
      // and if the ttime left on the cotract is greater then the contract time
      if (iTimeRemaining > (pSoldier.value.iTotalContractLength * NUM_MIN_IN_DAY)) {
        iTimeRemaining = (pSoldier.value.iTotalContractLength * NUM_MIN_IN_DAY);
      }
    }

    if (iTimeRemaining >= (24 * 60)) {
      // calculate the exact time left on the contract ( ex 1.8 days )
      dTimeLeft = (iTimeRemaining / (60 * 24.0));

      // more than a day, display in green
      iTimeRemaining /= (60 * 24);
      if (pSoldier.value.bLife > 0) {
        SetFontForeground(FONT_LTGREEN);
      }

      sString = swprintf("%.1f%s/%d%s", dTimeLeft, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION], pSoldier.value.iTotalContractLength, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);
    } else {
      // less than a day, display hours left in red
      if (iTimeRemaining > 5) {
        let fNeedToIncrement: boolean = false;

        if (iTimeRemaining % 60 != 0)
          fNeedToIncrement = true;

        iTimeRemaining /= 60;

        if (fNeedToIncrement)
          iTimeRemaining++;
      } else {
        iTimeRemaining /= 60;
      }

      if (pSoldier.value.bLife > 0) {
        SetFontForeground(FONT_RED);
      }

      sString = swprintf("%d%s/%d%s", iTimeRemaining, gpStrategicString[Enum365.STR_PB_HOURS_ABBREVIATION], pSoldier.value.iTotalContractLength, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);
    }
  } else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
    let iBeenHiredFor: INT32 = (GetWorldTotalMin() / NUM_MIN_IN_DAY) - pSoldier.value.iStartContractTime;

    sString = swprintf("%d%s/%d%s", gMercProfiles[pSoldier.value.ubProfile].iMercMercContractLength, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION], iBeenHiredFor, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);
  } else {
    sString = swprintf("%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
  }

  // set font stuff
  SetFontForeground(CHAR_TEXT_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  // center and draw
  FindFontCenterCoordinates(CHAR_TIME_REMAINING_X, CHAR_TIME_REMAINING_Y, CHAR_TIME_REMAINING_WID, CHAR_TIME_REMAINING_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, usY, CHAR_FONT());

  // salary
  if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
    // daily rate
    if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_2_WEEK) {
      iDailyCost = (gMercProfiles[pSoldier.value.ubProfile].uiBiWeeklySalary / 14);
    }
    if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_1_WEEK) {
      iDailyCost = (gMercProfiles[pSoldier.value.ubProfile].uiWeeklySalary / 7);
    } else {
      iDailyCost = gMercProfiles[pSoldier.value.ubProfile].sSalary;
    }
  } else {
    iDailyCost = gMercProfiles[pSoldier.value.ubProfile].sSalary;
  }

  sString = swprintf("%d", iDailyCost);

  // insert commas and dollar sign
  InsertCommasForDollarFigure(sString);
  InsertDollarSignInToString(sString);

  FindFontRightCoordinates(CHAR_SALARY_X, CHAR_SALARY_Y, CHAR_SALARY_WID, CHAR_SALARY_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, usY, CHAR_FONT());

  // medical deposit
  if (gMercProfiles[Menptr[gCharactersList[sCharNumber].usSolID].ubProfile].sMedicalDepositAmount > 0) {
    sString = swprintf("%d", gMercProfiles[Menptr[gCharactersList[sCharNumber].usSolID].ubProfile].sMedicalDepositAmount);

    // insert commas and dollar sign
    InsertCommasForDollarFigure(sString);
    InsertDollarSignInToString(sString);

    FindFontRightCoordinates(CHAR_MEDICAL_X, CHAR_MEDICAL_Y, CHAR_MEDICAL_WID, CHAR_MEDICAL_HEI(), sString, CHAR_FONT(), addressof(usX), addressof(usY));
    DrawString(sString, usX, CHAR_MEDICAL_Y, CHAR_FONT());
  }

  /*
          // life insurance
          swprintf(sString, L"%d", Menptr[ gCharactersList[ sCharNumber ].usSolID ].usLifeInsuranceAmount );
          InsertCommasForDollarFigure( sString );
          InsertDollarSignInToString( sString );
          FindFontRightCoordinates(CHAR_LIFE_INSUR_X, CHAR_LIFE_INSUR_Y, CHAR_LIFE_INSUR_WID, CHAR_LIFE_INSUR_HEI, sString, CHAR_FONT, &usX, &usY);
          DrawString(sString,usX,usY, CHAR_FONT);
  */

  // morale
  if (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) {
    if (pSoldier.value.bLife != 0) {
      GetMoraleString(MercPtrs[gCharactersList[sCharNumber].usSolID], sString);
    } else {
      sString = "";
    }
  } else {
    // POW - morale unknown
    sString = pPOWStrings[1];
  }

  FindFontCenterCoordinates(CHAR_MORALE_X, CHAR_MORALE_Y, CHAR_MORALE_WID, CHAR_MORALE_HEI, sString, CHAR_FONT(), addressof(usX), addressof(usY));
  DrawString(sString, usX, CHAR_MORALE_Y, CHAR_FONT());

  return;
}

// this character is in transit has an item picked up
function CharacterIsInTransitAndHasItemPickedUp(bCharacterNumber: INT8): boolean {
  // valid character?
  if (bCharacterNumber == -1) {
    // nope
    return false;
  }

  // second validity check
  if (gCharactersList[bCharacterNumber].fValid == false) {
    // nope
    return false;
  }

  // character in transit?
  if (Menptr[gCharactersList[bCharacterNumber].usSolID].bAssignment != Enum117.IN_TRANSIT) {
    // nope
    return false;
  }

  // item picked up?
  if (gMPanelRegion.Cursor != EXTERN_CURSOR) {
    return false;
  }

  return true;
}

function DisplayCharacterInfo(): void {
  Assert(bSelectedInfoChar < MAX_CHARACTER_COUNT);
  Assert(gCharactersList[bSelectedInfoChar].fValid);

  // set font buffer
  SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);

  // draw character info and face
  DrawCharacterInfo(bSelectedInfoChar);

  RenderHandPosItem();

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  RenderIconsForUpperLeftCornerPiece(bSelectedInfoChar);

  // mark all pop ups as dirty
  MarkAllBoxesAsAltered();
}

export function GetPathTravelTimeDuringPlotting(pPath: PathStPtr): INT32 {
  let iTravelTime: INT32 = 0;
  let pCurrent: WAYPOINT;
  let pNext: WAYPOINT;
  let pGroup: Pointer<GROUP>;
  let ubGroupId: UINT8 = 0;
  let fSkipFirstNode: boolean = false;

  if ((bSelectedDestChar == -1) && (fPlotForHelicopter == false)) {
    return 0;
  }

  if (fTempPathAlreadyDrawn == false) {
    return 0;
  }

  if (pPath == null) {
    return 0;
  }

  pPath = MoveToBeginningOfPathList(pPath);

  if (fPlotForHelicopter == false) {
    // plotting for a character...
    if (Menptr[gCharactersList[bSelectedDestChar].usSolID].bAssignment == Enum117.VEHICLE) {
      ubGroupId = pVehicleList[Menptr[gCharactersList[bSelectedDestChar].usSolID].iVehicleId].ubMovementGroup;
      pGroup = GetGroup(ubGroupId);

      if (pGroup == null) {
        SetUpMvtGroupForVehicle(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]));

        // get vehicle id
        ubGroupId = pVehicleList[Menptr[gCharactersList[bSelectedDestChar].usSolID].iVehicleId].ubMovementGroup;
        pGroup = GetGroup(ubGroupId);
      }
    } else if (Menptr[gCharactersList[bSelectedDestChar].usSolID].uiStatusFlags & SOLDIER_VEHICLE) {
      ubGroupId = pVehicleList[Menptr[gCharactersList[bSelectedDestChar].usSolID].bVehicleID].ubMovementGroup;
      pGroup = GetGroup(ubGroupId);

      if (pGroup == null) {
        SetUpMvtGroupForVehicle(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]));

        // get vehicle id
        ubGroupId = pVehicleList[Menptr[gCharactersList[bSelectedDestChar].usSolID].bVehicleID].ubMovementGroup;
        pGroup = GetGroup(ubGroupId);
      }
    } else {
      ubGroupId = Menptr[gCharactersList[bSelectedDestChar].usSolID].ubGroupID;
      pGroup = GetGroup((ubGroupId));
    }
  } else {
    ubGroupId = pVehicleList[iHelicopterVehicleId].ubMovementGroup;
    pGroup = GetGroup(ubGroupId);
  }

  Assert(pGroup);

  // if between sectors
  if (pGroup.value.fBetweenSectors) {
    // arrival time should always be legal!
    Assert(pGroup.value.uiArrivalTime >= GetWorldTotalMin());

    // start with time to finish arriving in any traversal already in progress
    iTravelTime = pGroup.value.uiArrivalTime - GetWorldTotalMin();
    fSkipFirstNode = true;
  } else {
    iTravelTime = 0;
  }

  while (pPath.value.pNext) {
    if (!fSkipFirstNode) {
      // grab the current location
      pCurrent.x = (pPath.value.uiSectorId % MAP_WORLD_X);
      pCurrent.y = (pPath.value.uiSectorId / MAP_WORLD_X);

      // grab the next location
      pNext.x = (pPath.value.pNext.value.uiSectorId % MAP_WORLD_X);
      pNext.y = (pPath.value.pNext.value.uiSectorId / MAP_WORLD_X);

      iTravelTime += FindTravelTimeBetweenWaypoints(addressof(pCurrent), addressof(pNext), pGroup);
    } else {
      fSkipFirstNode = false;
    }

    pPath = pPath.value.pNext;
  }

  return iTravelTime;
}

function DisplayGroundEta(): void {
  let iTotalTime: UINT32 = 0;

  if (fPlotForHelicopter == true) {
    return;
  }

  if (bSelectedDestChar == -1) {
    return;
  }

  if (!gCharactersList[bSelectedDestChar].fValid) {
    return;
  }

  iTotalTime = GetGroundTravelTimeOfCharacter(bSelectedDestChar);

  // now display it
  SetFont(ETA_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);
  mprintf(CLOCK_ETA_X, CLOCK_Y_START, pEtaString[0]);

  // if less than one day
  if ((iTotalTime / (60 * 24)) < 1) {
    // show hours and minutes
    SetClockMin("%d", iTotalTime % 60);
    SetClockHour("%d", iTotalTime / 60);
  } else {
    // show days and hours
    SetHourAlternate("%d", (iTotalTime / 60) % 24);
    SetDayAlternate("%d", iTotalTime / (60 * 24));
  }
}

function HighLightAssignLine(): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usColor: UINT16;
  /* static */ let iColorNum: INT32 = STARTING_COLOR_NUM;
  /* static */ let fDelta: boolean = false;
  /* static */ let uiOldHighlight: INT32 = MAX_CHARACTER_COUNT + 1;
  let usCount: INT16 = 0;
  let usX: UINT16;
  let usY: UINT16;

  // is this a valid line?
  if ((giAssignHighLine == -1) || fShowInventoryFlag) {
    uiOldHighlight = MAX_CHARACTER_COUNT + 1;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  // check if we have moved lines, if so, reset
  if (uiOldHighlight != giAssignHighLine) {
    iColorNum = STARTING_COLOR_NUM;
    fDelta = false;

    uiOldHighlight = giAssignHighLine;
  }

  if ((iColorNum == 0) || (iColorNum == 10)) {
    fDelta = !fDelta;
  }
  if (!fDelta)
    iColorNum++;
  else
    iColorNum--;

  // usY=Y_START+(giHighLine*GetFontHeight((MAP_SCREEN_FONT)));
  usY = (Y_OFFSET * giAssignHighLine - 1) + (Y_START + (giAssignHighLine * Y_SIZE()));

  if (giAssignHighLine >= FIRST_VEHICLE) {
    usY += 6;
  }

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  for (usCount = 0; usCount < MAX_CHARACTER_COUNT; usCount++) {
    if (IsCharacterSelectedForAssignment(usCount) == true) {
      usX = ASSIGN_X;
      // usY=Y_START+(giHighLine*GetFontHeight((MAP_SCREEN_FONT)));
      usY = (Y_OFFSET * usCount - 1) + (Y_START + (usCount * Y_SIZE()));
      if (usCount >= FIRST_VEHICLE) {
        usY += 6;
      }

      usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));

      LineDraw(true, usX, usY, usX, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      LineDraw(true, usX + ASSIGN_WIDTH, usY, usX + ASSIGN_WIDTH, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      if ((usCount == 0) || (usCount != 0 ? !(IsCharacterSelectedForAssignment((usCount - 1))) : 0) || (usCount == FIRST_VEHICLE)) {
        LineDraw(true, usX, usY, usX + ASSIGN_WIDTH, usY, usColor, pDestBuf);
      }

      if (((usCount == MAX_CHARACTER_COUNT - 1)) || (usCount != (MAX_CHARACTER_COUNT - 1) ? !(IsCharacterSelectedForAssignment((usCount + 1))) : 0) || (usCount == FIRST_VEHICLE - 1)) {
        LineDraw(true, usX, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usX + ASSIGN_WIDTH, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      }

      InvalidateRegion(usX, usY, usX + ASSIGN_WIDTH + 1, usY + GetFontHeight(MAP_SCREEN_FONT()) + 3);
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);
}

function HighLightDestLine(): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usColor: UINT16;
  /* static */ let iColorNum: INT32 = STARTING_COLOR_NUM;
  /* static */ let fDelta: boolean = false;
  /* static */ let uiOldHighlight: INT32 = MAX_CHARACTER_COUNT + 1;
  let usCount: UINT16 = 0;
  let usX: UINT16;
  let usY: UINT16;

  if ((giDestHighLine == -1) || fShowInventoryFlag) {
    uiOldHighlight = MAX_CHARACTER_COUNT + 1;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  // check if we have moved lines, if so, reset
  if (uiOldHighlight != giDestHighLine) {
    iColorNum = STARTING_COLOR_NUM;
    fDelta = false;

    uiOldHighlight = giDestHighLine;
  }

  if ((iColorNum == 0) || (iColorNum == 10)) {
    fDelta = !fDelta;
  }
  if (!fDelta)
    iColorNum++;
  else
    iColorNum--;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  for (usCount = 0; usCount < MAX_CHARACTER_COUNT; usCount++) {
    if (CharacterIsGettingPathPlotted(usCount) == true) {
      usX = DEST_ETA_X - 4;
      // usY=Y_START+(giHighLine*GetFontHeight((MAP_SCREEN_FONT)));
      usY = (Y_OFFSET * usCount - 1) + (Y_START + (usCount * Y_SIZE()));
      if (usCount >= FIRST_VEHICLE) {
        usY += 6;
      }

      usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));

      if ((usCount == 0) || (usCount != 0 ? !(CharacterIsGettingPathPlotted((usCount - 1))) : 0) || (usCount == FIRST_VEHICLE)) {
        LineDraw(true, usX + 4, usY, usX + DEST_ETA_WIDTH + 4, usY, usColor, pDestBuf);
      }
      if (((usCount == MAX_CHARACTER_COUNT - 1)) || (usCount != (MAX_CHARACTER_COUNT - 1) ? !(CharacterIsGettingPathPlotted((usCount + 1))) : 0) || (usCount == FIRST_VEHICLE - 1)) {
        LineDraw(true, usX + 4, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usX + DEST_ETA_WIDTH + 4, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      }

      LineDraw(true, usX + 4, usY, usX + 4, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      LineDraw(true, usX + DEST_ETA_WIDTH + 4, usY, usX + DEST_ETA_WIDTH + 4, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);

      InvalidateRegion(usX, usY, usX + DEST_ETA_WIDTH + 5, usY + GetFontHeight(MAP_SCREEN_FONT()) + 3);
    }
  }
  // InvalidateRegion( usX+4, usY, DEST_ETA_WIDTH-10, usY+GetFontHeight(MAP_SCREEN_FONT)+3);
  // InvalidateRegion( usX+10, usY, usX+ASSIGN_WIDTH, usY+GetFontHeight(MAP_SCREEN_FONT)+3);
  UnLockVideoSurface(FRAME_BUFFER);
}

function HighLightSleepLine(): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usColor: UINT16;
  /* static */ let iColorNum: INT32 = STARTING_COLOR_NUM;
  /* static */ let fDelta: boolean = false;
  /* static */ let uiOldHighlight: INT32 = MAX_CHARACTER_COUNT + 1;
  let usCount: UINT16 = 0;
  let usX: UINT16;
  let usX2: UINT16;
  let usY: UINT16;

  // is this a valid line?
  if ((giSleepHighLine == -1) || fShowInventoryFlag) {
    uiOldHighlight = MAX_CHARACTER_COUNT + 1;
    return;
  }

  // if not ready to change glow phase yet, leave
  if (!gfGlowTimerExpired)
    return;

  // check if we have moved lines, if so, reset
  if (uiOldHighlight != giSleepHighLine) {
    iColorNum = STARTING_COLOR_NUM;
    fDelta = false;

    uiOldHighlight = giSleepHighLine;
  }

  if ((iColorNum == 0) || (iColorNum == 10)) {
    fDelta = !fDelta;
  }
  if (!fDelta)
    iColorNum++;
  else
    iColorNum--;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  for (usCount = 0; usCount < MAX_CHARACTER_COUNT; usCount++) {
    if (IsCharacterSelectedForSleep(usCount) == true) {
      usX = SLEEP_X - 4;
      usX2 = SLEEP_X + SLEEP_WIDTH;

      // usY=Y_START+(giHighLine*GetFontHeight((MAP_SCREEN_FONT)));
      usY = (Y_OFFSET * usCount - 1) + (Y_START + (usCount * Y_SIZE()));
      if (usCount >= FIRST_VEHICLE) {
        usY += 6;
      }

      usColor = Get16BPPColor(FROMRGB(GlowColorsA[iColorNum].ubRed, GlowColorsA[iColorNum].ubGreen, GlowColorsA[iColorNum].ubBlue));

      if ((usCount == 0) || (usCount != 0 ? !(IsCharacterSelectedForSleep((usCount - 1))) : 0) || (usCount == FIRST_VEHICLE)) {
        LineDraw(true, usX + 4, usY, usX2, usY, usColor, pDestBuf);
      }
      if (((usCount == MAX_CHARACTER_COUNT - 1)) || (usCount != (MAX_CHARACTER_COUNT - 1) ? !(IsCharacterSelectedForSleep((usCount + 1))) : 0) || (usCount == FIRST_VEHICLE - 1)) {
        LineDraw(true, usX + 4, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usX2, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      }

      LineDraw(true, usX + 4, usY, usX + 4, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);
      LineDraw(true, usX2, usY, usX2, usY + GetFontHeight(MAP_SCREEN_FONT()) + 2, usColor, pDestBuf);

      InvalidateRegion(usX, usY, usX2 + 5, usY + GetFontHeight(MAP_SCREEN_FONT()) + 3);
    }
  }
  UnLockVideoSurface(FRAME_BUFFER);
}

function AddCharacter(pCharacter: Pointer<SOLDIERTYPE>): void {
  let usCount: UINT16 = 0;
  let usVehicleCount: UINT16 = 0;
  let usVehicleLoop: UINT16 = 0;

  // is character valid?
  if (pCharacter == null) {
    // not valid, leave
    return;
  }

  // valid character?
  if (pCharacter.value.bActive == false) {
    return;
  }

  // adding a vehicle?
  if (pCharacter.value.uiStatusFlags & SOLDIER_VEHICLE) {
    while (usVehicleLoop < MAX_CHARACTER_COUNT) {
      if (gCharactersList[usVehicleLoop].fValid) {
        if (Menptr[usVehicleLoop].uiStatusFlags & SOLDIER_VEHICLE) {
          usVehicleCount++;
        }
      }
      usVehicleLoop++;
    }

    usCount = FIRST_VEHICLE + usVehicleCount;
  } else {
    // go through character list until a blank is reached
    while ((gCharactersList[usCount].fValid) && (usCount < MAX_CHARACTER_COUNT)) {
      usCount++;
    }
  }

  Assert(usCount < MAX_CHARACTER_COUNT);
  if (usCount >= MAX_CHARACTER_COUNT) {
    return;
  }

  // copy over soldier id value
  gCharactersList[usCount].usSolID = pCharacter.value.ubID;

  // valid character
  gCharactersList[usCount].fValid = true;

  return;
}

/*
void MoveCharacter(UINT16 uiInitialPosition, UINT16 uiFinalPosition)
{
        if (!gCharactersList[uiInitialPosition].fValid)
                return;
        else
                memcpy(&gCharactersList[uiFinalPosition], &gCharactersList[uiInitialPosition], sizeof(MapScreenCharacterSt));
}


void SwapCharacters(UINT16 uiInitialPosition, UINT16 uiFinalPosition)
{
        MapScreenCharacterSt pTempChar;
        memcpy(&pTempChar, &gCharactersList[uiInitialPosition], sizeof(MapScreenCharacterSt));
        memcpy(&gCharactersList[uiInitialPosition], &gCharactersList[uiFinalPosition], sizeof(MapScreenCharacterSt));
        memcpy(&gCharactersList[uiFinalPosition], &pTempChar, sizeof(MapScreenCharacterSt));
}


void RemoveCharacter(UINT16 uiCharPosition)
{
 memset(&gCharactersList[uiCharPosition], 0, sizeof( MapScreenCharacterSt ));
}
*/

function LoadCharacters(): void {
  let uiCount: UINT16 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;

  pSoldier = MercPtrs[0];

  // fills array with pressence of player controlled characters
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive) {
      AddCharacter(pTeamSoldier);
      uiCount++;
    }
  }

  // set info char if no selected
  if (bSelectedInfoChar == -1) {
    if (DialogueActive() == false) {
      ChangeSelectedInfoChar(0, true);
    }
  }

  // check if ANYONE was available
  if (uiCount == 0) {
    // no one to show
    ChangeSelectedInfoChar(-1, true);
    bSelectedDestChar = -1;
    bSelectedAssignChar = -1;
    bSelectedContractChar = -1;
    fPlotForHelicopter = false;
  }
}

function DisplayCharacterList(): void {
  let sCount: INT16 = 0;
  let ubForegroundColor: UINT8 = 0;

  if ((fShowAssignmentMenu == true) && (fTeamPanelDirty == false)) {
    SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
    return;
  }

  // set dest buffer
  SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);
  SetFont(MAP_SCREEN_FONT());
  SetFontBackground(FONT_BLACK);

  for (sCount = 0; sCount < MAX_CHARACTER_COUNT; sCount++) {
    // skip invalid characters
    if (gCharactersList[sCount].fValid == true) {
      if (sCount == giHighLine) {
        ubForegroundColor = FONT_WHITE;
      }
      // check to see if character is still alive
      else if (Menptr[gCharactersList[sCount].usSolID].bLife == 0) {
        ubForegroundColor = FONT_METALGRAY;
      } else if (CharacterIsGettingPathPlotted(sCount) == true) {
        ubForegroundColor = FONT_LTBLUE;
      }
      // in current sector?
      else if ((Menptr[gCharactersList[sCount].usSolID].sSectorX == sSelMapX) && (Menptr[gCharactersList[sCount].usSolID].sSectorY == sSelMapY) && (Menptr[gCharactersList[sCount].usSolID].bSectorZ == iCurrentMapSectorZ)) {
        // mobile ?
        if ((Menptr[gCharactersList[sCount].usSolID].bAssignment < Enum117.ON_DUTY) || (Menptr[gCharactersList[sCount].usSolID].bAssignment == Enum117.VEHICLE))
          ubForegroundColor = FONT_YELLOW;
        else
          ubForegroundColor = FONT_MAP_DKYELLOW;
      } else {
        // not in current sector
        ubForegroundColor = 5;
      }

      SetFontForeground(ubForegroundColor);

      DrawName(Menptr[gCharactersList[sCount].usSolID].name, sCount, MAP_SCREEN_FONT());
      DrawLocation(sCount, sCount, MAP_SCREEN_FONT());
      DrawDestination(sCount, sCount, MAP_SCREEN_FONT());
      DrawAssignment(sCount, sCount, MAP_SCREEN_FONT());
      DrawTimeRemaining(sCount, MAP_SCREEN_FONT(), ubForegroundColor);
    }
  }

  HandleDisplayOfSelectedMercArrows();
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  EnableDisableTeamListRegionsAndHelpText();

  // mark all pop ups as dirty, so that any open assigment menus get reblitted over top of the team list
  MarkAllBoxesAsAltered();

  return;
}

// THIS IS STUFF THAT RUNS *ONCE* DURING APPLICATION EXECUTION, AT INITIAL STARTUP
export function MapScreenInit(): UINT32 {
  let VObjectDesc: VOBJECT_DESC;

  SetUpBadSectorsList();

  // setup message box system
  InitGlobalMessageList();

  // init palettes for big map
  InitializePalettesForMap();

  // set up mapscreen fast help text
  SetUpMapScreenFastHelpText();

  // set up leave list arrays for dismissed mercs
  InitLeaveList();

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\group_confirm.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiUpdatePanel))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\group_confirm_tactical.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiUpdatePanelTactical))) {
    return false;
  }

  return true;
}

export function MapScreenShutdown(): UINT32 {
  // free up alloced mapscreen messages
  FreeGlobalMessageList();

  ShutDownPalettesForMap();

  // free memory for leave list arrays for dismissed mercs
  ShutDownLeaveList();

  DeleteVideoObjectFromIndex(guiUpdatePanel);
  DeleteVideoObjectFromIndex(guiUpdatePanelTactical);

  return true;
}

export function MapScreenHandle(): UINT32 {
  let uiNewScreen: UINT32;
  let found: INT32 = false;
  let uiMins: UINT32 = 0;
  let uiHours: UINT32 = 0;
  let uiDays: UINT32 = 0;
  let vs_desc: VSURFACE_DESC;
  let VObjectDesc: VOBJECT_DESC;
  //	static BOOLEAN fSecondFrame = FALSE;
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // DO NOT MOVE THIS FUNCTION CALL!!!
  // This determines if the help screen should be active
  if (ShouldTheHelpScreenComeUp(HelpScreenDetermineWhichMapScreenHelpToShow(), false)) {
    // handle the help screen
    HelpScreenHandler();
    return Enum26.MAP_SCREEN;
  }

  // shaded screen, leave
  if (gfLoadPending == 2) {
    gfLoadPending = false;

    // Load Sector
    // BigCheese
    if (!SetCurrentWorldSector(sSelMapX, sSelMapY, iCurrentMapSectorZ)) {
      // Cannot load!
    } else {
      CreateDestroyMapInvButton();
      // define our progress bar
      // CreateProgressBar( 0, 118, 183, 522, 202 );
    }
    return Enum26.MAP_SCREEN;
  }

  //	if ( (fInMapMode == FALSE ) && ( fMapExitDueToMessageBox == FALSE ) )
  if (!fInMapMode) {
    gfFirstMapscreenFrame = true;

    InitPreviousPaths();

    // if arrival sector is invalid, reset to A9
    if ((gsMercArriveSectorX < 1) || (gsMercArriveSectorY < 1) || (gsMercArriveSectorX > 16) || (gsMercArriveSectorY > 16)) {
      gsMercArriveSectorX = 9;
      gsMercArriveSectorY = 1;
    }

    gfInConfirmMapMoveMode = false;
    gfInChangeArrivalSectorMode = false;

    fLeavingMapScreen = false;
    fResetTimerForFirstEntryIntoMapScreen = true;
    fFlashAssignDone = false;
    gfEnteringMapScreen = 0;

    guiTacticalInterfaceFlags |= INTERFACE_MAPSCREEN;

    //		fDisabledMapBorder = FALSE;

    // handle the sort buttons
    AddTeamPanelSortButtonsForMapScreen();

    // load bottom graphics
    LoadMapScreenInterfaceBottom();

    MoveToEndOfMapScreenMessageList();

    // if the current time compression mode is something legal in mapscreen, keep it
    if ((giTimeCompressMode >= Enum130.TIME_COMPRESS_5MINS) && (giTimeCompressMode <= Enum130.TIME_COMPRESS_60MINS)) {
      // leave the current time compression mode set, but DO stop it
      StopTimeCompression();
    } else {
      // set compressed mode to X0 (which also stops time compression)
      SetGameTimeCompressionLevel(Enum130.TIME_COMPRESS_X0);
    }

    // disable video overlay for tactical scroll messages
    EnableDisableScrollStringVideoOverlay(false);

    CreateDestroyInsuranceMouseRegionForMercs(true);

    // ATE: Init tactical interface interface ( always to team panel )
    // SetCurrentInterfacePanel( TEAM_PANEL );
    // Do some things to this now that it's initialized
    // MSYS_DisableRegion( &gViewportRegion );
    // MSYS_DisableRegion( &gRadarRegion );
    // Disable all faces
    SetAllAutoFacesInactive();

    if (fPreLoadedMapGraphics == false) {
      // load border graphics
      LoadMapBorderGraphics();

      // fInterfacePanelDirty=DIRTYLEVEL2;
      // RenderTacticalInterface();
      vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
      // Grab the Map image

      vs_desc.ImageFile = "INTERFACE\\b_map.pcx";
      if (!AddVideoSurface(addressof(vs_desc), addressof(guiBIGMAP))) {
        return false;
      }

      vs_desc.ImageFile = "INTERFACE\\popupbackground.pcx";
      if (!AddVideoSurface(addressof(vs_desc), addressof(guiPOPUPTEX))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\SAM.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSAMICON))) {
        return false;
      }

      // VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      // FilenameForBPP("INTERFACE\\s_map.sti", VObjectDesc.ImageFile);
      // CHECKF( AddVideoObject( &VObjectDesc, &guiMAP ) );
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\mapcursr.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMAPCURSORS))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\Mine_1.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSubLevel1))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\Mine_2.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSubLevel2))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\Mine_3.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSubLevel3))) {
        return false;
      }
      // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
      // FilenameForBPP("INTERFACE\\addonslcp.sti", VObjectDesc.ImageFile);
      // CHECKF(AddVideoObject(&VObjectDesc, &guiCORNERADDONS));

      // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
      // FilenameForBPP("INTERFACE\\mapborder.sti", VObjectDesc.ImageFile);
      // CHECKF(AddVideoObject(&VObjectDesc, &guiMAPBORDER));

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\sleepicon.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSleepIcon))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\charinfo.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARINFO))) {
        return false;
      }
      /*strcpy(vs_desc.ImageFile, "INTERFACE\\playlist3.pcx");
      CHECKF(AddVideoSurface( &vs_desc, &guiCHARLIST ));*/

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\newgoldpiece3.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARLIST))) {
        return false;
      }

      // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
      // FilenameForBPP("INTERFACE\\mapbordercorner.sti", VObjectDesc.ImageFile);
      // CHECKF(AddVideoObject(&VObjectDesc, &guiMAPCORNER));

      // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
      // FilenameForBPP("INTERFACE\\popup.sti", VObjectDesc.ImageFile);
      // CHECKF(AddVideoObject(&VObjectDesc, &guiPOPUPBORDERS));

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\boxes.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARICONS))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\incross.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCROSS))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\mapinv.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMAPINV))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\map_inv_2nd_gun_cover.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapInvSecondHandBlockout))) {
        return false;
      }

      // the upper left corner piece icons
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\top_left_corner_icons.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiULICONS))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\map_item.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiORTAICON))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\prison.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiTIXAICON))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\merc_between_sector_icons.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARBETWEENSECTORICONS))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\merc_mvt_green_arrows.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARBETWEENSECTORICONSCLOSE))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\GreenArr.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLEVELMARKER))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\Helicop.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiHelicopterIcon))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\eta_pop_up.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapBorderEtaPopUp))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\pos2.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapBorderHeliSectors))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\secondary_gun_hidden.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSecItemHiddenVO))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\selectedchararrow.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSelectedCharArrow))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\mine.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMINEICON))) {
        return false;
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      VObjectDesc.ImageFile = "INTERFACE\\hilite.sti";
      AddVideoObject(addressof(VObjectDesc), addressof(guiSectorLocatorGraphicID));

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("INTERFACE\\BullsEye.sti", VObjectDesc.ImageFile);
      if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBULLSEYE))) {
        return false;
      }

      HandleLoadOfMapBottomGraphics();

      // load the militia pop up box
      LoadMilitiaPopUpBox();

      // graphic for pool inventory
      LoadInventoryPoolGraphic();

      // Kris:  Added this because I need to blink the icons button.
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      VObjectDesc.ImageFile = "INTERFACE\\newemail.sti";
      AddVideoObject(addressof(VObjectDesc), addressof(guiNewMailIcons));
    }

    // create buttons
    CreateButtonsForMapBorder();

    // create mouse regions for level markers
    CreateMouseRegionsForLevelMarkers();

    // change selected sector/level if necessary
    // NOTE: Must come after border buttons are created, since it may toggle them!
    if (AnyMercsHired() == false) {
      // select starting sector (A9 - Omerta)
      ChangeSelectedMapSector(9, 1, 0);
    } else if ((gWorldSectorX > 0) && (gWorldSectorY > 0) && (gbWorldSectorZ != -1)) {
      // select currently loaded sector as the map sector
      ChangeSelectedMapSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    } else // no loaded sector
    {
      // only select A9 - Omerta IF there is no current selection, otherwise leave it as is
      if ((sSelMapX == 0) || (sSelMapY == 0) || (iCurrentMapSectorZ == -1)) {
        ChangeSelectedMapSector(9, 1, 0);
      }
    }

    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("INTERFACE\\Bars.sti", VObjectDesc.ImageFile);
    if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBrownBackgroundForTeamPanel))) {
      return false;
    }

    // we are in fact in the map, do not repeat this sequence
    fInMapMode = true;

    // dirty map
    fMapPanelDirty = true;

    // dirty team region
    fTeamPanelDirty = true;

    // dirty info region
    fCharacterInfoPanelDirty = true;

    // direty map bottom region
    fMapScreenBottomDirty = true;

    // tactical scroll of messages not allowed to beep until new message is added in tactical
    fOkToBeepNewMessage = false;

    // not in laptop, not about to go there either
    fLapTop = false;

    // reset show aircraft flag
    // fShowAircraftFlag = FALSE;

    // reset fact we are showing white bounding box around face
    fShowFaceHightLight = false;
    fShowItemHighLight = false;

    // reset all selected character flags
    ResetAllSelectedCharacterModes();

    if (fFirstTimeInMapScreen == true) {
      fFirstTimeInMapScreen = false;
      //			fShowMapScreenHelpText = TRUE;
    }

    fShowMapInventoryPool = false;

    // init character list - set all values in the list to 0
    InitalizeVehicleAndCharacterList();

    // deselect all entries
    ResetSelectedListForMapScreen();

    LoadCharacters();

    // set up regions
    MSYS_DefineRegion(addressof(gMapViewRegion), MAP_VIEW_START_X + MAP_GRID_X, MAP_VIEW_START_Y + MAP_GRID_Y, MAP_VIEW_START_X + MAP_VIEW_WIDTH + MAP_GRID_X - 1, MAP_VIEW_START_Y + MAP_VIEW_HEIGHT - 1 + 8, MSYS_PRIORITY_HIGH - 3, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
    MSYS_DefineRegion(addressof(gCharInfoHandRegion), ((4)), ((81)), ((62)), ((103)), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, ItemRegionMvtCallback, ItemRegionBtnCallback);
    MSYS_DefineRegion(addressof(gCharInfoFaceRegion), PLAYER_INFO_FACE_START_X, PLAYER_INFO_FACE_START_Y, PLAYER_INFO_FACE_END_X, PLAYER_INFO_FACE_END_Y, MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, FaceRegionBtnCallback);

    MSYS_DefineRegion(addressof(gMPanelRegion), INV_REGION_X, INV_REGION_Y, INV_REGION_X + INV_REGION_WIDTH, INV_REGION_Y + INV_REGION_HEIGHT, MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, InvmaskRegionBtnCallBack);
    // screen mask for animated cursors
    MSYS_DefineRegion(addressof(gMapScreenMaskRegion), 0, 0, 640, 480, MSYS_PRIORITY_LOW, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MapScreenMarkRegionBtnCallback);

    // set help text for item glow region
    SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[0]);

    // init the timer menus
    InitTimersForMoveMenuMouseRegions();

    giMapContractButtonImage = LoadButtonImage("INTERFACE\\contractbutton.sti", -1, 0, -1, 1, -1);

    // buttonmake
    giMapContractButton = QuickCreateButton(giMapContractButtonImage, CONTRACT_X + 5, CONTRACT_Y - 1, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 5, BtnGenericMouseMoveButtonCallback, ContractButtonCallback);

    SpecifyButtonText(giMapContractButton, pContractButtonString[0]);
    SpecifyButtonFont(giMapContractButton, MAP_SCREEN_FONT());
    SpecifyButtonUpTextColors(giMapContractButton, CHAR_TEXT_FONT_COLOR, FONT_BLACK);
    SpecifyButtonDownTextColors(giMapContractButton, CHAR_TEXT_FONT_COLOR, FONT_BLACK);

    // create mouse region for pause clock
    CreateMouseRegionForPauseOfClock(CLOCK_REGION_START_X, CLOCK_REGION_START_Y);

    // create mouse regions
    CreateMouseRegionsForTeamList();

    ReBuildCharactersList();

    // create status bar region
    CreateMapStatusBarsRegion();

    // Add region
    MSYS_AddRegion(addressof(gMapViewRegion));
    MSYS_AddRegion(addressof(gCharInfoFaceRegion));
    MSYS_AddRegion(addressof(gMPanelRegion));

    if (!gfFadeOutDone && !gfFadeIn) {
      MSYS_SetCurrentCursor(SCREEN_CURSOR);
    }
    MSYS_DisableRegion(addressof(gMPanelRegion));

    // create contract box
    CreateContractBox(null);

    // create the permanent boxes for assignment and its submenus
    fShowAssignmentMenu = true;
    CreateDestroyAssignmentPopUpBoxes();
    fShowAssignmentMenu = false;

    // create merc remove box
    CreateMercRemoveAssignBox();

    // test message
    // TestMessageSystem( );

    // fill in
    ColorFillVideoSurfaceArea(guiSAVEBUFFER, 0, 0, 640, 480, Get16BPPColor(RGB_NEAR_BLACK()));
    ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(RGB_NEAR_BLACK()));

    if ((fFirstTimeInMapScreen == true) && (AnyMercsHired() == false)) {
      // render both panels for the restore
      RenderMapRegionBackground();
      RenderTeamRegionBackground();

      // now do the warning box
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMapErrorString[4], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
    }

    fFirstTimeInMapScreen = false;

    if (gpCurrentTalkingFace != null) {
      // GO FROM GAMESCREEN TO MAPSCREEN
      // REMOVE OLD UI
      // Set face inactive!
      // gpCurrentTalkingFace->fCanHandleInactiveNow = TRUE;
      // SetAutoFaceInActive( gpCurrentTalkingFace->iID );
      // gfFacePanelActive = FALSE;

      // make him continue talking
      ContinueDialogue(MercPtrs[gpCurrentTalkingFace.value.ubSoldierID], false);

      // reset diabled flag
      // gpCurrentTalkingFace->fDisabled = FALSE;

      // Continue his talking!
    }

    fOneFrame = false;

    if (fEnterMapDueToContract == true) {
      if (pContractReHireSoldier) {
        FindAndSetThisContractSoldier(pContractReHireSoldier);
      }
      fEnterMapDueToContract = false;
    }
  }

  // if not going anywhere else
  if (guiPendingScreen == NO_PENDING_SCREEN) {
    if (HandleFadeOutCallback()) {
      // force mapscreen to be reinitialized even though we're already in it
      EndMapScreen(true);
      return Enum26.MAP_SCREEN;
    }

    if (HandleBeginFadeOut(Enum26.MAP_SCREEN)) {
      return Enum26.MAP_SCREEN;
    }
  }

  // check to see if we need to rebuild the characterlist for map screen
  HandleRebuildingOfMapScreenCharacterList();

  HandleStrategicTurn();

  /*
          // update cursor based on state
          if( ( bSelectedDestChar == -1 ) && ( fPlotForHelicopter == FALSE ) && ( gfInChangeArrivalSectorMode == FALSE ) )
          {
                  // reset cursor
      if ( !gfFadeIn )
      {
                    ChangeMapScreenMaskCursor( CURSOR_NORMAL );
      }
          }
  */

  // check if we are going to create or destroy map border graphics?
  CreateDestroyMapInventoryPoolButtons(false);

  // set up buttons for mapscreen scroll
  //	HandleMapScrollButtonStates( );

  // don't process any input until we've been through here once
  if (gfFirstMapscreenFrame == false) {
    // Handle Interface
    uiNewScreen = HandleMapUI();
    if (uiNewScreen != Enum26.MAP_SCREEN) {
      return Enum26.MAP_SCREEN;
    }
  }

  // handle flashing of contract column for any mercs leaving very soon
  HandleContractTimeFlashForMercThatIsAboutLeave();

  if ((fShownAssignmentMenu == false) && (fShowAssignmentMenu == true)) {
    // need a one frame pause
    fShownAssignmentMenu = fShowAssignmentMenu;
    fShowAssignmentMenu = false;
    fOneFrame = true;
  } else if ((fShownContractMenu == false) && (fShowContractMenu == true)) {
    fShownContractMenu = fShowContractMenu;
    fShowContractMenu = false;
    fOneFrame = true;
  } else if (fOneFrame) {
    // one frame passed
    fShowContractMenu = fShownContractMenu;
    fShowAssignmentMenu = fShownAssignmentMenu;
    fOneFrame = false;
  }

  if ((fShownAssignmentMenu == false) && (fShowAssignmentMenu == false)) {
    bSelectedAssignChar = -1;
  }

  HandlePostAutoresolveMessages();

  //	UpdateLevelButtonStates( );

  // NOTE: This must happen *before* UpdateTheStateOfTheNextPrevMapScreenCharacterButtons()
  CreateDestroyMapCharacterScrollButtons();

  // update the prev next merc buttons
  UpdateTheStateOfTheNextPrevMapScreenCharacterButtons();

  // handle for inventory
  HandleCursorOverRifleAmmo();

  // check contract times, update screen if they do change
  CheckAndUpdateBasedOnContractTimes();

  // handle flashing of assignment strings when merc's assignment is done
  HandleAssignmentsDoneAndAwaitingFurtherOrders();

  // handle timing for the various glowing higlights
  HandleCommonGlowTimer();

  // are we attempting to plot a foot/vehicle path during aircraft mode..if so, stop it
  CheckIfPlottingForCharacterWhileAirCraft();

  // check to see if helicopter is available
  // CheckIfHelicopterAvailable( );
  if (fShowMapInventoryPool) {
    HandleFlashForHighLightedItem();
  }

  //	CreateDestroyMovementBox( 0,0,0 );

  // Deque all game events
  DequeAllGameEvents(true);

  // Handle Interface Stuff
  SetUpInterface();

  // reset time compress has occured
  ResetTimeCompressHasOccured();

  // handle change in info char
  HandleChangeOfInfoChar();

  // update status of contract box
  UpDateStatusOfContractBox();

  // error check of assignments
  UpdateBadAssignments();

  // if cursor has left map..will need to update temp path plotting and cursor
  CheckToSeeIfMouseHasLeftMapRegionDuringPathPlotting();

  // update assignment menus and submenus
  HandleShadingOfLinesForAssignmentMenus();

  // check which menus can be shown right now
  DetermineWhichAssignmentMenusCanBeShown();

  // determine if contract menu can be shown
  DetermineIfContractMenuCanBeShown();

  // if pre battle and inventory up?..get rid of inventory
  HandlePreBattleInterfaceWithInventoryPanelUp();

  // create destroy trash can region
  CreateDestroyTrashCanRegion();

  // update these buttons
  UpdateStatusOfMapSortButtons();

  // if in inventory mode, make sure it's still ok
  CheckForInventoryModeCancellation();

  // restore background rects
  RestoreBackgroundRects();

  InterruptTimeForMenus();

  // place down background
  BlitBackgroundToSaveBuffer();

  if (fLeavingMapScreen == true) {
    return Enum26.MAP_SCREEN;
  }

  if (fDisableDueToBattleRoster == false) {
    /*
                    // ATE: OK mark is rendering the item every frame - which isn't good
        // however, don't want to break the world here..
        // this line was added so that when the ItemGlow() is on,
        // we're not rendering also, else glow looks bad
        if ( !fShowItemHighLight )
        {
                      RenderHandPosItem();
        }
    */

    if (fDrawCharacterList) {
      if (!fShowInventoryFlag) {
        // if we are not in inventory mode, show character list
        HandleHighLightingOfLinesInTeamPanel();

        DisplayCharacterList();
      }

      fDrawCharacterList = false;
    }
  }

  if (!fShowMapInventoryPool && !gfPauseDueToPlayerGamePause && !IsMapScreenHelpTextUp() /* && !fDisabledMapBorder */) {
    RenderMapCursorsIndexesAnims();
  }

  if (fDisableDueToBattleRoster == false) {
    // render status bar
    HandleCharBarRender();
  }

  if (fShowInventoryFlag || fDisableDueToBattleRoster) {
    for (iCounter = 0; iCounter < MAX_SORT_METHODS; iCounter++) {
      UnMarkButtonDirty(giMapSortButton[iCounter]);
    }
  }

  if (fShowContractMenu || fDisableDueToBattleRoster) {
    UnMarkButtonDirty(giMapContractButton);
  }

  // handle any old messages
  ScrollString();

  HandleSpontanousTalking();

  if ((fDisableDueToBattleRoster == false)) {
    // remove the move box once user leaves it
    CreateDestroyMovementBox(0, 0, 0);

    // this updates the move box contents when changes took place
    ReBuildMoveBox();
  }

  if ((fDisableDueToBattleRoster == false) && ((fShowAssignmentMenu == true) || (fShowContractMenu == true))) {
    // highlight lines?
    HandleHighLightingOfLinesInTeamPanel();

    // render glow for contract region
    ContractBoxGlow();
    GlowTrashCan();

    // handle changing of highlighted lines
    HandleChangeOfHighLightedLine();
  }

  if (fDisableDueToBattleRoster == false) {
    // render face of current info char, for animation
    DrawFace(bSelectedInfoChar);

    // handle autofaces
    HandleAutoFaces();
    HandleTalkingAutoFaces();
    /*
                    GlowFace( );
                    GlowItem( );
    */
  }

  // automatically turns off mapscreen ui overlay messages when appropriate
  MonitorMapUIMessage();

  // if heli is around, show it
  if (fHelicopterAvailable && fShowAircraftFlag && (iCurrentMapSectorZ == 0) && !fShowMapInventoryPool) {
    // this is done on EVERY frame, I guess it beats setting entire map dirty all the time while he's moving...
    DisplayPositionOfHelicopter();
  }

  // display town info
  DisplayTownInfo(sSelMapX, sSelMapY, iCurrentMapSectorZ);

  if (fShowTownInfo == true) {
    // force update of town mine info boxes
    ForceUpDateOfBox(ghTownMineBox);
    MapscreenMarkButtonsDirty();
  }

  // update town mine pop up display
  UpdateTownMinePopUpDisplay();

  if (fShowAttributeMenu) {
    // mark all popups as dirty
    MarkAllBoxesAsAltered();
  }

  // if plotting path
  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    // plot out paths
    PlotPermanentPaths();
    PlotTemporaryPaths();

    // show ETA
    RenderMapBorderEtaPopUp();
    DisplayGroundEta();

    // DisplayDestinationOfCurrentDestMerc( );
  }

  HandleContractRenewalSequence();

  // handle dialog
  HandleDialogue();

  // now the border corner piece
  //	RenderMapBorderCorner( );

  // handle display of inventory pop up
  HandleDisplayOfItemPopUpForSector(9, 1, 0);

  // Display Framerate
  DisplayFrameRate();

  // update paused states
  UpdatePausedStatesDueToTimeCompression();

  // is there a description to be displayed?
  RenderItemDescriptionBox();

  // render clock
  RenderClock(CLOCK_X, CLOCK_Y + 1);

  if (fEndShowInventoryFlag == true) {
    if (InKeyRingPopup() == true) {
      DeleteKeyRingPopup();
    } else {
      fShowInventoryFlag = false;
      // set help text for item glow region
      SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[0]);
    }

    fTeamPanelDirty = true;
    fEndShowInventoryFlag = false;
  }

  // handle animated cursor update
  if (!gfFadeIn) {
    HandleAnimatedCursorsForMapScreen();
  }

  // if inventory is being manipulated, update cursor
  HandleMapInventoryCursor();

  if (fShowDescriptionFlag == true) {
    // unmark done button
    if (gpItemDescObject.value.usItem == Enum225.MONEY) {
      MapscreenMarkButtonsDirty();
    }

    if (Item[gpItemDescObject.value.usItem].usItemClass & IC_GUN) {
      MapscreenMarkButtonsDirty();
    }

    UnMarkButtonDirty(giMapInvDoneButton);
    // UnMarkButtonDirty( giCharInfoButton[ 0 ] );
    // UnMarkButtonDirty( giCharInfoButton[ 1 ] );
    MarkAButtonDirty(giMapInvDescButton);
  } else {
    if (fShowInventoryFlag == true) {
      MarkAButtonDirty(giMapInvDoneButton);
      MarkAButtonDirty(giCharInfoButton[1]);
      MarkAButtonDirty(giCharInfoButton[0]);
    }
  }

  DrawMilitiaPopUpBox();

  if (fDisableDueToBattleRoster == false) {
    CreateDestroyTheUpdateBox();
    DisplaySoldierUpdateBox();
  }

  // pop up display boxes
  DisplayBoxes(FRAME_BUFFER);

  // render buttons
  RenderButtons();

  if (fShowMapScreenMovementList) {
    // redisplay Movement box to blit it over any border buttons, since if long enough it can overlap them
    ForceUpDateOfBox(ghMoveBox);
    DisplayOnePopupBox(ghMoveBox, FRAME_BUFFER);
  }

  if (fShowContractMenu) {
    // redisplay Contract box to blit it over any map sort buttons, since they overlap
    ForceUpDateOfBox(ghContractBox);
    DisplayOnePopupBox(ghContractBox, FRAME_BUFFER);
  }

  // If we have new email, blink the email icon on top of the laptop button.
  CheckForAndRenderNewMailOverlay();

  // handle video overlays
  ExecuteVideoOverlays();

  if (InItemStackPopup()) {
    RenderItemStackPopup(false);
  }

  if (InKeyRingPopup()) {
    RenderKeyRingPopup(false);
  }

  CheckForMeanwhileOKStart();

  // save background rects
  // ATE: DO this BEFORE rendering help text....
  SaveBackgroundRects();

  if ((fDisableDueToBattleRoster == false) && (fShowAssignmentMenu == false) && (fShowContractMenu == false)) {
    // highlight lines?
    HandleHighLightingOfLinesInTeamPanel();

    // render glow for contract region
    ContractBoxGlow();
    GlowTrashCan();

    // handle changing of highlighted lines
    HandleChangeOfHighLightedLine();

    GlowFace();
    GlowItem();
  }

  if (fShowMapScreenHelpText) {
    // display map screen fast help
    DisplayMapScreenFastHelpList();
  } else {
    // render help
    RenderButtonsFastHelp();
  }

  /*
          if( fSecondFrame )
          {
                  if( gTacticalStatus.fDidGameJustStart )
                  {
                          // game just started, check what state player is in......
                          HandlePlayerEnteringMapScreenBeforeGoingToTactical( );
                  }
          }
          fSecondFrame = FALSE;
  */

  // execute dirty
  ExecuteBaseDirtyRectQueue();

  // update cursor
  UpdateCursorIfInLastSector();

  // about to leave for new map
  if (gfLoadPending == 1) {
    gfLoadPending++;

    // Shade this frame!
    // Remove cursor
    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

    // Shadow area
    ShadowVideoSurfaceRect(FRAME_BUFFER, 0, 0, 640, 480);
    InvalidateScreen();
  }

  // InvalidateRegion( 0,0, 640, 480);
  EndFrameBufferRender();

  // if not going anywhere else
  if (guiPendingScreen == NO_PENDING_SCREEN) {
    if (HandleFadeInCallback()) {
      // force mapscreen to be reinitialized even though we're already in it
      EndMapScreen(true);
    }

    if (HandleBeginFadeIn(Enum26.MAP_SCREEN)) {
    }
  }

  HandlePreBattleInterfaceStates();

  if (gfHotKeyEnterSector) {
    gfHotKeyEnterSector = false;
    ActivatePreBattleEnterSectorAction();
  }

  if (gfRequestGiveSkyriderNewDestination) {
    RequestGiveSkyriderNewDestination();
    gfRequestGiveSkyriderNewDestination = false;
  }

  if (gfFirstMapscreenFrame) {
    //		fSecondFrame = TRUE;
    gfFirstMapscreenFrame = false;
  } else {
    // handle exiting from mapscreen due to both exit button clicks and keyboard equivalents
    HandleExitsFromMapScreen();
  }

  return Enum26.MAP_SCREEN;
}

function DrawString(pString: string /* STR16 */, uiX: UINT16, uiY: UINT16, uiFont: UINT32): void {
  // draw monochrome string
  SetFont(uiFont);
  gprintfdirty(uiX, uiY, pString);
  mprintf(uiX, uiY, pString);
}

function SetDayAlternate(pStringA: string /* STR16 */, ...args: any[]): void {
  // this sets the clock counter, unwind loop
  let uiX: UINT16 = 0;
  let uiY: UINT16 = 0;
  let String: string /* wchar_t[80] */;
  let argptr: va_list;

  va_start(argptr, pStringA); // Set up variable argument pointer
  vswprintf(String, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);

  if (String[1] == 0) {
    String[1] = String[0];
    String[0] = ' ';
  }
  String[2] = gsTimeStrings[3][0];
  String[3] = ' ';
  String[4] = 0;

  uiX = CLOCK_HOUR_X_START - 9;
  uiY = CLOCK_Y_START;

  SetFont(ETA_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);

  // RestoreExternBackgroundRect( uiX, uiY, 20 ,GetFontHeight( ETA_FONT ) );
  mprintf(uiX, uiY, String);
}

function SetHourAlternate(pStringA: string /* STR16 */, ...args: any[]): void {
  // this sets the clock counter, unwind loop
  let uiX: UINT16 = 0;
  let uiY: UINT16 = 0;
  let String: string /* wchar_t[80] */;
  let argptr: va_list;

  va_start(argptr, pStringA); // Set up variable argument pointer
  vswprintf(String, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);

  if (String[1] == 0) {
    String[1] = String[0];
    String[0] = ' ';
  }

  String[2] = gsTimeStrings[0][0];
  String[3] = ' ';
  String[4] = 0;
  uiX = CLOCK_MIN_X_START - 5;
  uiY = CLOCK_Y_START;
  DrawString(String, uiX, uiY, ETA_FONT());

  SetFont(ETA_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);

  // RestoreExternBackgroundRect( uiX, uiY, 20 ,GetFontHeight( ETA_FONT ) );
  mprintf(uiX, uiY, String);
}

function SetClockHour(pStringA: string /* STR16 */, ...args: any[]): void {
  // this sets the clock counter, unwind loop
  let uiX: UINT16 = 0;
  let uiY: UINT16 = 0;
  let String: string /* wchar_t[80] */;
  let argptr: va_list;

  va_start(argptr, pStringA); // Set up variable argument pointer
  vswprintf(String, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);
  if (String[1] == 0) {
    String[1] = String[0];
    String[0] = ' ';
  }
  String[2] = gsTimeStrings[0][0];
  String[3] = ' ';
  String[4] = 0;
  uiX = CLOCK_HOUR_X_START - 8;
  uiY = CLOCK_Y_START;

  SetFont(ETA_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);

  // RestoreExternBackgroundRect( uiX, uiY, 20 ,GetFontHeight( ETA_FONT ) );
  mprintf(uiX, uiY, String);
}

function SetClockMin(pStringA: string /* STR16 */, ...args: any[]): void {
  // this sets the clock counter, unwind loop
  let String: string /* wchar_t[10] */;
  let argptr: va_list;

  va_start(argptr, pStringA); // Set up variable argument pointer
  vswprintf(String, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);

  if (String[1] == 0) {
    String[1] = String[0];
    String[0] = ' ';
  }
  String[2] = gsTimeStrings[1][0];
  String[3] = ' ';
  String[4] = 0;

  SetFont(ETA_FONT());
  SetFontForeground(FONT_LTGREEN);
  SetFontBackground(FONT_BLACK);

  // RestoreExternBackgroundRect( CLOCK_MIN_X_START - 5, CLOCK_Y_START, 20 ,GetFontHeight( ETA_FONT ) );
  mprintf(CLOCK_MIN_X_START - 5, CLOCK_Y_START, String);
}

function DrawName(pName: string /* STR16 */, sRowIndex: INT16, iFont: INT32): void {
  let usX: UINT16 = 0;
  let usY: UINT16 = 0;

  if (sRowIndex < FIRST_VEHICLE) {
    FindFontCenterCoordinates(NAME_X + 1, (Y_START + (sRowIndex * Y_SIZE())), NAME_WIDTH, Y_SIZE(), pName, iFont, addressof(usX), addressof(usY));
  } else {
    FindFontCenterCoordinates(NAME_X + 1, (Y_START + (sRowIndex * Y_SIZE()) + 6), NAME_WIDTH, Y_SIZE(), pName, iFont, addressof(usX), addressof(usY));
  }

  // RestoreExternBackgroundRect(NAME_X, ((UINT16)(usY+(Y_OFFSET*sRowIndex+1))), NAME_WIDTH, Y_SIZE);
  DrawString(pName, usX, ((usY + (Y_OFFSET * sRowIndex + 1))), iFont);
}

function DrawAssignment(sCharNumber: INT16, sRowIndex: INT16, iFont: INT32): void {
  let usX: UINT16 = 0;
  let usY: UINT16 = 0;
  let sString: string /* wchar_t[32] */;

  GetMapscreenMercAssignmentString(MercPtrs[gCharactersList[sCharNumber].usSolID], sString);

  if (sRowIndex < FIRST_VEHICLE) {
    FindFontCenterCoordinates(ASSIGN_X + 1, (Y_START + (sRowIndex * Y_SIZE())), ASSIGN_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  } else {
    FindFontCenterCoordinates(ASSIGN_X + 1, (Y_START + (sRowIndex * Y_SIZE()) + 6), ASSIGN_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  }

  if (fFlashAssignDone == true) {
    if (Menptr[gCharactersList[sCharNumber].usSolID].fDoneAssignmentAndNothingToDoFlag) {
      SetFontForeground(FONT_RED);
    }
  }

  // RestoreExternBackgroundRect(ASSIGN_X-2, ((UINT16)(usY+(Y_OFFSET*sRowIndex+1))), ASSIGN_WIDTH+2, Y_SIZE);
  DrawString(sString, usX, ((usY + (Y_OFFSET * sRowIndex + 1))), iFont);
}

function DrawLocation(sCharNumber: INT16, sRowIndex: INT16, iFont: INT32): void {
  let usX: UINT16 = 0;
  let usY: UINT16 = 0;
  let sString: string /* wchar_t[32] */;

  GetMapscreenMercLocationString(MercPtrs[gCharactersList[sCharNumber].usSolID], sString);

  if (sRowIndex < FIRST_VEHICLE) {
    // center
    FindFontCenterCoordinates(LOC_X + 1, (Y_START + (sRowIndex * Y_SIZE())), LOC_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  } else {
    FindFontCenterCoordinates(LOC_X + 1, (Y_START + (sRowIndex * Y_SIZE()) + 6), LOC_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  }
  // restore background
  // RestoreExternBackgroundRect(LOC_X, ((UINT16)(usY+(Y_OFFSET*sRowIndex+1))), LOC_WIDTH, Y_SIZE);

  // draw string
  DrawString(sString, ((usX)), ((usY + (Y_OFFSET * sRowIndex + 1))), (iFont));
}

function DrawDestination(sCharNumber: INT16, sRowIndex: INT16, iFont: INT32): void {
  let usX: UINT16 = 0;
  let usY: UINT16 = 0;
  let sString: string /* wchar_t[32] */;

  GetMapscreenMercDestinationString(MercPtrs[gCharactersList[sCharNumber].usSolID], sString);

  if (sString.length == 0) {
    return;
  }

  if (sRowIndex < FIRST_VEHICLE) {
    FindFontCenterCoordinates(DEST_ETA_X + 1, (Y_START + (sRowIndex * Y_SIZE())), DEST_ETA_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  } else {
    FindFontCenterCoordinates(DEST_ETA_X + 1, (Y_START + (sRowIndex * Y_SIZE()) + 6), DEST_ETA_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  }

  // RestoreExternBackgroundRect(DEST_ETA_X+1, ((UINT16)(usY+(Y_OFFSET*sRowIndex+1))), DEST_ETA_WIDTH-1, Y_SIZE);
  // ShowDestinationOfPlottedPath( sString );
  DrawString(sString, ((usX)), ((usY + (Y_OFFSET * sRowIndex + 1))), (iFont));
}

function DrawTimeRemaining(sCharNumber: INT16, iFont: INT32, ubFontColor: UINT8): void {
  let usX: UINT16 = 0;
  let usY: UINT16 = 0;
  let sString: string /* wchar_t[32] */;

  GetMapscreenMercDepartureString(MercPtrs[gCharactersList[sCharNumber].usSolID], sString, addressof(ubFontColor));

  // if merc is highlighted, override the color decided above with bright white
  if (sCharNumber == giHighLine) {
    ubFontColor = FONT_WHITE;
  }

  SetFont(iFont);
  SetFontForeground(ubFontColor);

  if (sCharNumber < FIRST_VEHICLE) {
    FindFontCenterCoordinates(TIME_REMAINING_X + 1, (Y_START + (sCharNumber * Y_SIZE())), TIME_REMAINING_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  } else {
    FindFontCenterCoordinates(TIME_REMAINING_X + 1, (Y_START + (sCharNumber * Y_SIZE()) + 6), TIME_REMAINING_WIDTH, Y_SIZE(), sString, iFont, addressof(usX), addressof(usY));
  }

  // RestoreExternBackgroundRect(TIME_REMAINING_X, ((UINT16)(usY+(Y_OFFSET*sCharNumber+1))), TIME_REMAINING_WIDTH, Y_SIZE);
  DrawString(sString, ((usX)), ((usY + (Y_OFFSET * sCharNumber + 1))), (iFont));
}

function RenderMapCursorsIndexesAnims(): void {
  let fSelectedSectorHighlighted: boolean = false;
  let fSelectedCursorIsYellow: boolean = true;
  let usCursorColor: UINT16;
  let uiDeltaTime: UINT32;
  /* static */ let sPrevHighlightedMapX: INT16 = -1;
  /* static */ let sPrevHighlightedMapY: INT16 = -1;
  /* static */ let sPrevSelectedMapX: INT16 = -1;
  /* static */ let sPrevSelectedMapY: INT16 = -1;
  /* static */ let fFlashCursorIsYellow: boolean = false;
  let fDrawCursors: boolean;
  let fHighlightChanged: boolean = false;

  HandleAnimationOfSectors();

  if (gfBlitBattleSectorLocator) {
    HandleBlitOfSectorLocatorIcon(gubPBSectorX, gubPBSectorY, gubPBSectorZ, Enum156.LOCATOR_COLOR_RED);
  }

  fDrawCursors = CanDrawSectorCursor();

  // if mouse cursor is over a map sector
  if (fDrawCursors && (GetMouseMapXY(addressof(gsHighlightSectorX), addressof(gsHighlightSectorY)))) {
    // handle highlighting of sector pointed at ( WHITE )

    // if we're over a different sector than when we previously blitted this
    if ((gsHighlightSectorX != sPrevHighlightedMapX) || (gsHighlightSectorY != sPrevHighlightedMapY) || gfMapPanelWasRedrawn) {
      if (sPrevHighlightedMapX != -1 && sPrevHighlightedMapY != -1) {
        RestoreMapSectorCursor(sPrevHighlightedMapX, sPrevHighlightedMapY);
      }

      // draw WHITE highlight rectangle
      RenderMapHighlight(gsHighlightSectorX, gsHighlightSectorY, Get16BPPColor(RGB_WHITE()), false);

      sPrevHighlightedMapX = gsHighlightSectorX;
      sPrevHighlightedMapY = gsHighlightSectorY;

      fHighlightChanged = true;
    }
  } else {
    // nothing now highlighted
    gsHighlightSectorX = -1;
    gsHighlightSectorY = -1;

    if (sPrevHighlightedMapX != -1 && sPrevHighlightedMapY != -1) {
      RestoreMapSectorCursor(sPrevHighlightedMapX, sPrevHighlightedMapY);
      fHighlightChanged = true;
    }

    sPrevHighlightedMapX = -1;
    sPrevHighlightedMapY = -1;
  }

  // handle highlighting of selected sector ( YELLOW ) - don't show it while plotting movement
  if (fDrawCursors && (bSelectedDestChar == -1) && (fPlotForHelicopter == false)) {
    // if mouse cursor is over the currently selected sector
    if ((gsHighlightSectorX == sSelMapX) && (gsHighlightSectorY == sSelMapY)) {
      fSelectedSectorHighlighted = true;

      // do we need to flash the cursor?  get the delta in time
      uiDeltaTime = GetJA2Clock() - guiFlashCursorBaseTime;

      if (uiDeltaTime > 300) {
        guiFlashCursorBaseTime = GetJA2Clock();
        fFlashCursorIsYellow = !fFlashCursorIsYellow;

        fHighlightChanged = true;
      }
    }

    if (!fSelectedSectorHighlighted || fFlashCursorIsYellow) {
      // draw YELLOW highlight rectangle
      usCursorColor = Get16BPPColor(RGB_YELLOW());
    } else {
      // draw WHITE highlight rectangle
      usCursorColor = Get16BPPColor(RGB_WHITE());

      // index letters will also be white instead of yellow so that they flash in synch with the cursor
      fSelectedCursorIsYellow = false;
    }

    // always render this one, it's too much of a pain detecting overlaps with the white cursor otherwise
    RenderMapHighlight(sSelMapX, sSelMapY, usCursorColor, true);

    if ((sPrevSelectedMapX != sSelMapX) || (sPrevSelectedMapY != sSelMapY)) {
      sPrevSelectedMapX = sSelMapX;
      sPrevSelectedMapY = sSelMapY;

      fHighlightChanged = true;
    }
  } else {
    // erase yellow highlight cursor
    if (sPrevSelectedMapX != -1 && sPrevSelectedMapY != -1) {
      RestoreMapSectorCursor(sPrevSelectedMapX, sPrevSelectedMapY);
      fHighlightChanged = true;
    }

    sPrevSelectedMapX = -1;
    sPrevSelectedMapY = -1;
  }

  if (fHighlightChanged || gfMapPanelWasRedrawn) {
    // redraw sector index letters and numbers
    /*
                    if( fZoomFlag )
                            DrawMapIndexSmallMap( fSelectedCursorIsYellow );
                    else
    */
    DrawMapIndexBigMap(fSelectedCursorIsYellow);
  }
}

function HandleMapUI(): UINT32 {
  let uiNewEvent: UINT32 = Enum134.MAP_EVENT_NONE;
  let sMapX: INT16 = 0;
  let sMapY: INT16 = 0;
  let bMapZ: INT8 = 0;
  let sX: INT16;
  let sY: INT16;
  let ubCount: UINT8 = 0;
  let pNode: PathStPtr = null;
  let fVehicle: boolean = false;
  let MousePos: POINT;
  let uiNewScreen: UINT32 = Enum26.MAP_SCREEN;
  let fWasAlreadySelected: boolean;

  // Get Input from keyboard
  GetMapKeyboardInput(addressof(uiNewEvent));

  CreateDestroyMapInvButton();

  // Get mouse
  PollLeftButtonInMapView(addressof(uiNewEvent));
  PollRightButtonInMapView(addressof(uiNewEvent));

  // Switch on event
  switch (uiNewEvent) {
    case Enum134.MAP_EVENT_NONE:
      break;

    case Enum134.MAP_EVENT_PLOT_PATH:
      GetMouseMapXY(addressof(sMapX), addressof(sMapY));

      /*
                                                       // translate screen values to map grid values for zoomed in
                                                       if(fZoomFlag)
                                                       {
                                                                       sMapX=(UINT16)iZoomX/MAP_GRID_X+sMapX;
                                                                       sMapX=sMapX/2;
                                                                       sMapY=(UINT16)iZoomY/MAP_GRID_Y+sMapY;
                                                                       sMapY=sMapY/2;
                                                       }
      */

      // plotting for the chopper?
      if (fPlotForHelicopter == true) {
        /*
                                                                 if( IsSectorOutOfTheWay( sMapX, sMapY ) == TRUE )
                                                                 {
                                                                         if( gfAllowSkyriderTooFarQuote == TRUE )
                                                                         {
                                                                                 SkyRiderTalk( DESTINATION_TOO_FAR );
                                                                         }

                                                                         return( MAP_SCREEN );
                                                                 }
        */

        PlotPathForHelicopter(sMapX, sMapY);
        fTeamPanelDirty = true;
      } else {
        // plot for character

        // check for valid character
        Assert(bSelectedDestChar != -1);
        if (bSelectedDestChar == -1)
          break;

        // check if last sector in character's path is same as where mouse is
        if (GetLastSectorIdInCharactersPath(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID])) != (sMapX + (sMapY * MAP_WORLD_X))) {
          sX = (GetLastSectorIdInCharactersPath(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID])) % MAP_WORLD_X);
          sY = (GetLastSectorIdInCharactersPath(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID])) / MAP_WORLD_X);
          GetCursorPos(addressof(MousePos));
          RestoreBackgroundForMapGrid(sX, sY);
          // fMapPanelDirty = TRUE;
        }

        // SetFontDestBuffer( FRAME_BUFFER, 0, 0, 640, 480, FALSE );

        if ((IsTheCursorAllowedToHighLightThisSector(sMapX, sMapY) == true) && (SectorInfo[(SECTOR(sMapX, sMapY))].ubTraversability[Enum186.THROUGH_STRATEGIC_MOVE] != Enum127.GROUNDBARRIER)) {
          // Can we get go there?  (NULL temp character path)
          if (GetLengthOfPath(pTempCharacterPath) > 0) {
            PlotPathForCharacter(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]), sMapX, sMapY, false);

            // copy the path to every other selected character
            CopyPathToAllSelectedCharacters(GetSoldierMercPathPtr(MercPtrs[gCharactersList[bSelectedDestChar].usSolID]));

            StartConfirmMapMoveMode(sMapY);
            fMapPanelDirty = true;
            fTeamPanelDirty = true; // update team panel desinations
          } else {
            // means it's a vehicle and we've clicked an off-road sector
            MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapErrorString[40]);
          }
        }
      }
      break;

    case Enum134.MAP_EVENT_CANCEL_PATH:
      CancelOrShortenPlottedPath();
      break;

      /*
          case MAP_EVENT_SELECT_SECTOR:
                              // will select the sector the selected merc is in

                              sMapX=Menptr[gCharactersList[bSelectedInfoChar].usSolID].sSectorX;
                              sMapY=Menptr[gCharactersList[bSelectedInfoChar].usSolID].sSectorY;
                              bMapZ=Menptr[gCharactersList[bSelectedInfoChar].usSolID].bSectorZ;

                              if( ( sSelMapX != sMapX || sSelMapY != sMapY || iCurrentMapSectorZ != bMapZ ) &&
                                              ( gTacticalStatus.fDidGameJustStart == FALSE ) && ( gfPreBattleInterfaceActive == FALSE ) )
                              {
                                      ChangeSelectedMapSector( sMapX, sMapY, bMapZ );

                                      fTeamPanelDirty = TRUE;

                                      fMapScreenBottomDirty = TRUE;
              bSelectedDestChar=-1;
                              }

                              break;
      */

    case Enum134.MAP_EVENT_CLICK_SECTOR:

      // Get Current mouse position
      if (GetMouseMapXY(addressof(sMapX), addressof(sMapY))) {
        /*
                                        if( fZoomFlag == TRUE )
                                        {
                                                // convert to zoom out coords from screen coords
                              sMapX = ( INT16 )( iZoomX / MAP_GRID_X + sMapX ) / 2;
                              sMapY = ( INT16 )( iZoomY / MAP_GRID_Y + sMapY ) / 2;
                                                //sMapX = ( INT16 ) ( ( ( iZoomX ) / ( MAP_GRID_X * 2) ) + sMapX / 2 );
                                                //sMapX = ( INT16 ) ( ( ( iZoomY ) / ( MAP_GRID_Y * 2) ) + sMapY / 2 );
                                        }
        */

        // not zoomed out, make sure this is a valid sector
        if (IsTheCursorAllowedToHighLightThisSector(sMapX, sMapY) == false) {
          // do nothing, return
          return Enum26.MAP_SCREEN;
        }

        // while item in hand
        if (fMapInventoryItem) {
          // if not showing item counts on the map
          if (!fShowItemsFlag) {
            // turn that on
            ToggleItemsFilter();
          }

          // if item's owner is known
          if (gpItemPointerSoldier != null) {
            // make sure it's the owner's sector that's selected
            if ((gpItemPointerSoldier.value.sSectorX != sSelMapX) || (gpItemPointerSoldier.value.sSectorY != sSelMapY) || (gpItemPointerSoldier.value.bSectorZ != iCurrentMapSectorZ)) {
              ChangeSelectedMapSector(gpItemPointerSoldier.value.sSectorX, gpItemPointerSoldier.value.sSectorY, gpItemPointerSoldier.value.bSectorZ);
            }
          }

          // if not already in sector inventory
          if (!fShowMapInventoryPool) {
            // start it up ( NOTE: for the item OWNER'S sector, regardless of which sector player clicks )
            fShowMapInventoryPool = true;
            CreateDestroyMapInventoryPoolButtons(true);
          }

          return Enum26.MAP_SCREEN;
        }

        // don't permit other click handling while item is in cursor (entering PBI would permit item teleports, etc.)
        Assert(!fMapInventoryItem);

        // this doesn't change selected sector
        if (gfInChangeArrivalSectorMode) {
          if (SectorInfo[(SECTOR(sMapX, sMapY))].ubTraversability[Enum186.THROUGH_STRATEGIC_MOVE] != Enum127.GROUNDBARRIER) {
            // if it's not enemy air controlled
            if (StrategicMap[CALCULATE_STRATEGIC_INDEX(sMapX, sMapY)].fEnemyAirControlled == false) {
              let sMsgString: string /* CHAR16[128] */;
              let sMsgSubString: string /* CHAR16[64] */;

              // move the landing zone over here
              gsMercArriveSectorX = sMapX;
              gsMercArriveSectorY = sMapY;

              // change arrival sector for all mercs currently in transit who are showing up at the landing zone
              UpdateAnyInTransitMercsWithGlobalArrivalSector();

              // we're done, cancel this mode
              CancelChangeArrivalSectorMode();

              // get the name of the sector
              GetSectorIDString(sMapX, sMapY, 0, sMsgSubString, false);

              // now build the string
              sMsgString = swprintf(pBullseyeStrings[1], sMsgSubString);

              // confirm the change with overlay message
              MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, sMsgString);

              // update destination column for any mercs in transit
              fTeamPanelDirty = true;
            } else {
              // message: not allowed, don't have airspace secured
              MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pBullseyeStrings[2]);
            }
          }

          return Enum26.MAP_SCREEN;
        } else // not already changing arrival sector
        {
          if (CanMoveBullseyeAndClickedOnIt(sMapX, sMapY)) {
            // if the click is ALSO over the helicopter icon
            // NOTE: The helicopter icon is NOT necessarily directly over the helicopter's current sector!!!
            if (CheckForClickOverHelicopterIcon(sMapX, sMapY) == true) {
              CreateBullsEyeOrChopperSelectionPopup();
            } else {
              StartChangeSectorArrivalMode();
            }

            return Enum26.MAP_SCREEN;
          }
        }

        // if new map sector was clicked on
        if ((sSelMapX != sMapX) || (sSelMapY != sMapY)) {
          fWasAlreadySelected = false;

          // select the clicked sector, retaining the same sublevel depth
          ChangeSelectedMapSector(sMapX, sMapY, iCurrentMapSectorZ);
        } else {
          fWasAlreadySelected = true;
        }

        // if showing item counts on the map, and not already in sector inventory
        if (fShowItemsFlag && !fShowMapInventoryPool) {
          // show sector inventory for this clicked sector
          ChangeSelectedMapSector(sMapX, sMapY, iCurrentMapSectorZ);

          fShowMapInventoryPool = true;
          CreateDestroyMapInventoryPoolButtons(true);

          return Enum26.MAP_SCREEN;
        }

        if (gfBlitBattleSectorLocator && sMapX == gubPBSectorX && sMapY == gubPBSectorY && iCurrentMapSectorZ == gubPBSectorZ) {
          // Bring up a non-persistant version of mapscreen if the user clicks on the sector where a
          // battle is taking place.
          InitPreBattleInterface(null, false);
          return Enum26.MAP_SCREEN;
        }

        // if we're in airspace mode
        if (fShowAircraftFlag == true) {
          // if not moving soldiers, and not yet plotting the helicopter
          if ((bSelectedDestChar == -1) && (fPlotForHelicopter == false)) {
            // if we're on the surface level, and the click is over the helicopter icon
            // NOTE: The helicopter icon is NOT necessarily directly over the helicopter's current sector!!!
            if ((iCurrentMapSectorZ == 0) && CheckForClickOverHelicopterIcon(sMapX, sMapY) == true) {
              RequestGiveSkyriderNewDestination();
              return Enum26.MAP_SCREEN;
            }
          }
        } else // not in airspace mode
        {
          // sector must be already selected to initiate movement plotting!  This is to allow selecting sectors with
          // mercs in them without necessarily initiating movement right away.
          if (fWasAlreadySelected) {
            // if there are any movable characters here
            if (AnyMovableCharsInOrBetweenThisSector(sMapX, sMapY, iCurrentMapSectorZ)) {
              // if showing the surface level map
              if (iCurrentMapSectorZ == 0) {
                TurnOnShowTeamsMode();

                // NOTE: must allow move box to come up, since there may be movable characters between sectors which are
                // unaffected by combat / hostiles / air raid in the sector proper itself!!
                // This also allows all strategic movement error handling to be centralized in CanCharacterMoveInStrategic()

                // start the move box menu
                SetUpMovingListsForSector(sMapX, sMapY, iCurrentMapSectorZ);
              } else {
                // no strategic movement is possible from underground sectors
                DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMapErrorString[1], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
                return Enum26.MAP_SCREEN;
              }
            }
          }
        }
      }
      break;
  }

  // if we pressed something that will cause a screen change
  if (guiPendingScreen != NO_PENDING_SCREEN) {
    uiNewScreen = guiPendingScreen;
  }

  return uiNewScreen;
}

function GetMapKeyboardInput(puiNewEvent: Pointer<UINT32>): void {
  let InputEvent: InputAtom;
  let MousePos: POINT;
  let bSquadNumber: INT8;
  let ubGroupId: UINT8 = 0;
  let fCtrl: boolean;
  let fAlt: boolean;

  let sMapX: INT16;
  let sMapY: INT16;

  fCtrl = _KeyDown(CTRL);
  fAlt = _KeyDown(ALT);

  while (DequeueEvent(addressof(InputEvent)))
  //		while( DequeueSpecificEvent( &InputEvent, KEY_DOWN ) )		// doesn't work for some reason
  {
    GetCursorPos(addressof(MousePos));

    // HOOK INTO MOUSE HOOKS
    switch (InputEvent.usEvent) {
      case LEFT_BUTTON_DOWN:
        MouseSystemHook(LEFT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_UP:
        MouseSystemHook(LEFT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_DOWN:
        MouseSystemHook(RIGHT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_UP:
        MouseSystemHook(RIGHT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_REPEAT:
        MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_REPEAT:
        MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
    }

    if (InputEvent.usEvent == KEY_DOWN) {
      // if game is paused because of player, unpause with any key
      if (gfPauseDueToPlayerGamePause) {
        HandlePlayerPauseUnPauseOfGame();
        continue;
      }

      if (IsMapScreenHelpTextUp()) {
        // stop mapscreen text
        StopMapScreenHelpText();
        continue;
      }

      // handle for fast help text for interface stuff
      if (IsTheInterfaceFastHelpTextActive()) {
        ShutDownUserDefineHelpTextRegions();
      }

      switch (InputEvent.usParam) {
        case ESC:
          gfDontStartTransitionFromLaptop = true;

          if (gfPreBattleInterfaceActive && !gfPersistantPBI) {
            // Non persistant PBI.  Allow ESC to close it and return to mapscreen.
            KillPreBattleInterface();
            gpBattleGroup = null;
            return;
          }

          if (gfInChangeArrivalSectorMode) {
            CancelChangeArrivalSectorMode();
            MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pBullseyeStrings[3]);
          }
          // ESC cancels MAP UI messages, unless we're in confirm map move mode
          else if ((giUIMessageOverlay != -1) && !gfInConfirmMapMoveMode) {
            CancelMapUIMessage();
          } else if (IsMapScreenHelpTextUp()) {
            StopMapScreenHelpText();
          } else if (gpCurrentTalkingFace != null && gpCurrentTalkingFace.value.fTalking) {
            // ATE: We want to stop speech if somebody is talking...
            StopAnyCurrentlyTalkingSpeech();
          } else if (fShowUpdateBox) {
            if (fShowUpdateBox) {
              EndUpdateBox(false); // stop time compression
            }
          } else if (fShowDescriptionFlag) {
            DeleteItemDescriptionBox();
          }
          // plotting movement?
          else if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
            AbortMovementPlottingMode();
          } else if (fShowAssignmentMenu) {
            // dirty region
            fTeamPanelDirty = true;
            fMapPanelDirty = true;
            fCharacterInfoPanelDirty = true;

            // stop showing current assignment box
            if (fShowAttributeMenu == true) {
              fShowAttributeMenu = false;
              fMapPanelDirty = true;
            } else if (fShowTrainingMenu == true) {
              fShowTrainingMenu = false;
            } else if (fShowSquadMenu == true) {
              fShowSquadMenu = false;
            } else if (fShowRepairMenu == true) {
              fShowRepairMenu = false;
            } else {
              fShowAssignmentMenu = false;
            }
            giAssignHighLine = -1;
            // restore background to glow region
            RestoreBackgroundForAssignmentGlowRegionList();
          } else if (fShowContractMenu == true) {
            fShowContractMenu = false;

            // restore contract glow region
            RestoreBackgroundForContractGlowRegionList();
            fTeamPanelDirty = true;
            fCharacterInfoPanelDirty = true;
            giContractHighLine = -1;
          }
          // in militia popup?
          else if ((sSelectedMilitiaTown != 0) && (sGreensOnCursor == 0) && (sRegularsOnCursor == 0) && (sElitesOnCursor == 0)) {
            sSelectedMilitiaTown = 0;
            fMapPanelDirty = true;
          } else if (fShowTownInfo == true) {
            fShowTownInfo = false;
            CreateDestroyScreenMaskForAssignmentAndContractMenus();
          } else if (fShowDescriptionFlag) {
            if (gMPanelRegion.Cursor != EXTERN_CURSOR) {
              DeleteItemDescriptionBox();
            }
          } else if (InKeyRingPopup() == true) {
            DeleteKeyRingPopup();
            fTeamPanelDirty = true;
          } else if (fShowInventoryFlag == true) {
            if (gMPanelRegion.Cursor != EXTERN_CURSOR && !InItemStackPopup()) {
              fEndShowInventoryFlag = true;
            }
          } else if (MultipleCharacterListEntriesSelected()) {
            ResetSelectedListForMapScreen();
            if (bSelectedInfoChar != -1) {
              SetEntryInSelectedCharacterList(bSelectedInfoChar);
            }
            fTeamPanelDirty = true;
            fCharacterInfoPanelDirty = true;
          } else {
            RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_TACTICAL);
          }
          break; // end of ESC

        case PAUSE:
          // Pause game!
          HandlePlayerPauseUnPauseOfGame();
          break;

        case LEFTARROW:
          // previous character
          GoToPrevCharacterInList();
          break;
        case RIGHTARROW:
          // next character
          GoToNextCharacterInList();
          break;

        case UPARROW:
          // up a line
          MapScreenMsgScrollUp(1);
          break;
        case DNARROW:
          // down a line
          MapScreenMsgScrollDown(1);
          break;

        case PGUP:
          // up a page
          MapScreenMsgScrollUp(MAX_MESSAGES_ON_MAP_BOTTOM);
          break;
        case PGDN:
          // down a page
          MapScreenMsgScrollDown(MAX_MESSAGES_ON_MAP_BOTTOM);
          break;

        case HOME:
          // jump to top of message list
          ChangeCurrentMapscreenMessageIndex(0);
          break;

        case END:
          // jump to bottom of message list
          MoveToEndOfMapScreenMessageList();
          break;

        case INSERT:
          // up one sublevel
          GoUpOneLevelInMap();
          break;

        case DEL:
          // down one sublevel
          GoDownOneLevelInMap();
          break;

        case ENTER:
          RequestToggleMercInventoryPanel();
          break;

        case BACKSPACE:
          StopAnyCurrentlyTalkingSpeech();
          break;

        case F1:
        case F2:
        case F3:
        case F4:
        case F5:
        case F6:
          ChangeCharacterListSortMethod(InputEvent.usParam - F1);
          break;

        case F7:
          break;

        case F8:
          break;

        case F9:
          break;

        case F10:
          break;

          /*
                                          case F11:
                                                  #ifdef JA2TESTVERSION
                                                          if( fAlt )
                                                          {
                                                                  // ALT-F11: make all sectors player controlled
                                                                  ClearMapControlledFlags( );
                                                                  fMapPanelDirty = TRUE;
                                                          }
                                                  #endif
                                                  break;
          */

        case F12:
          break;

        case '+':
        case '=':
          if (CommonTimeCompressionChecks() == false)
            RequestIncreaseInTimeCompression();
          break;

        case '-':
        case '_':
          if (CommonTimeCompressionChecks() == false)
            RequestDecreaseInTimeCompression();
          break;

        case SPACE:
          if (fShowUpdateBox) {
            EndUpdateBox(true); // restart time compression
          } else {
            // toggle time compression
            if (CommonTimeCompressionChecks() == false)
              RequestToggleTimeCompression();
          }
          break;

        case '`':
          break;

        case '\\':
          break;

        case '>':
          break;

        case '?':
          break;

        case '/':
          break;

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          // multi-selects all characters in that squad.  SHIFT key and 1-0 for squads 11-20
          bSquadNumber = (InputEvent.usParam - '1'); // internal squad #s start at 0
          SelectAllCharactersInSquad(bSquadNumber);
          break;

        case '0':
          SelectAllCharactersInSquad(9); // internal squad #s start at 0
          break;

        case '!':
          SelectAllCharactersInSquad(10); // internal squad #s start at 0
          break;
        case '@':
          SelectAllCharactersInSquad(11); // internal squad #s start at 0
          break;
        case '#':
          SelectAllCharactersInSquad(12); // internal squad #s start at 0
          break;
        case '$':
          SelectAllCharactersInSquad(13); // internal squad #s start at 0
          break;
        case '%':
          SelectAllCharactersInSquad(14); // internal squad #s start at 0
          break;
        case '^':
          SelectAllCharactersInSquad(15); // internal squad #s start at 0
          break;
        case '&':
          SelectAllCharactersInSquad(16); // internal squad #s start at 0
          break;
        case '*':
          SelectAllCharactersInSquad(17); // internal squad #s start at 0
          break;
        case '(':
          SelectAllCharactersInSquad(18); // internal squad #s start at 0
          break;
        case ')':
          SelectAllCharactersInSquad(19); // internal squad #s start at 0
          break;

        case 'a':
          if (fAlt) {
            if (giHighLine != -1) {
              if (gCharactersList[giHighLine].fValid == true) {
                bSelectedAssignChar = giHighLine;
                RebuildAssignmentsBox();
                ChangeSelectedInfoChar(giHighLine, false);
                fShowAssignmentMenu = true;
              }
            } else if (bSelectedInfoChar != -1) {
              if (gCharactersList[bSelectedInfoChar].fValid == true) {
                bSelectedAssignChar = bSelectedInfoChar;
                RebuildAssignmentsBox();
                fShowAssignmentMenu = true;
              }
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              if (gfAutoAmbush ^= 1)
                ScreenMsg(FONT_WHITE, MSG_TESTVERSION, "Enemy ambush test mode enabled.");
              else
                ScreenMsg(FONT_WHITE, MSG_TESTVERSION, "Enemy ambush test mode disabled.");
            }
          } else {
            if (gfPreBattleInterfaceActive) {
              // activate autoresolve in prebattle interface.
              ActivatePreBattleAutoresolveAction();
            } else {
              // only handle border button keyboard equivalents if the button is visible!
              if (!fShowMapInventoryPool) {
                ToggleAirspaceMode();
              }
            }
          }
          break;

        case 'b':
          /*
                                                  #ifndef JA2DEMO
                                                          // CTRL-B: make player's perception of all sectors correct!
                                                          if( ( fCtrl )&&( CHEATER_CHEAT_LEVEL( ) ) )
                                                          {
                                                                  for ( sMapX = 1; sMapX <= 16; sMapX++ )
                                                                  {
                                                                          for ( sMapY = 1; sMapY <= 16; sMapY++ )
                                                                          {
                                                                                  MakePlayerPerceptionOfSectorControlCorrect( sMapX, sMapY, 0 );
                                                                          }
                                                                  }
                                                          }
                                                  #endif
          */
          break;

        case 'c':
          RequestContractMenu();
          break;

        case 'd':
          break;

        case 'e':
          if (gfPreBattleInterfaceActive) {
            // activate enter sector in prebattle interface.
            gfHotKeyEnterSector = true;
          }
          break;
        case 'f':
          if (fAlt) {
            if (INFORMATION_CHEAT_LEVEL()) {
              // Toggle Frame Rate Display
              gbFPSDisplay = !gbFPSDisplay;
              DisableFPSOverlay(!gbFPSDisplay);
            }
          }
          break;
        case 'h':
          {
            // ARM: Feb01/98 - Cancel out of mapscreen movement plotting if Help subscreen is coming up
            if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
              AbortMovementPlottingMode();
            }

            ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_MAPSCREEN, true);
          }

          //					fShowMapScreenHelpText = TRUE;
          break;

        case 'i':
          // only handle border button keyboard equivalents if the button is visible!
          if (!fShowMapInventoryPool) {
            ToggleItemsFilter();
          }

          break;
        case 'l':
          if (fAlt) {
            // although we're not actually going anywhere, we must still be in a state where this is permitted
            if (AllowedToExitFromMapscreenTo(Enum144.MAP_EXIT_TO_LOAD)) {
              DoQuickLoad();
            }
          } else if (fCtrl) {
            // go to LOAD screen
            gfSaveGame = false;
            RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_LOAD);
          } else {
            // go to LAPTOP
            RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_LAPTOP);
          }
          break;
        case 'm':
          // only handle border button keyboard equivalents if the button is visible!
          if (!fShowMapInventoryPool) {
            // toggle show mines flag
            ToggleShowMinesMode();
          }

          break;
        case 'n':
          break;
        case 'o':
          if (fAlt) {
            // toggle if Orta & Tixa have been found
          } else {
            // go to OPTIONS screen
            RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_OPTIONS);
          }
          break;

        case 'p':

          break;

        case 'q':
          break;
        case 'r':
          if (gfPreBattleInterfaceActive) {
            // activate autoresolve in prebattle interface.
            ActivatePreBattleRetreatAction();
          }
          break;
        case 's':
          if (fAlt) {
            // although we're not actually going anywhere, we must still be in a state where this is permitted
            if (AllowedToExitFromMapscreenTo(Enum144.MAP_EXIT_TO_SAVE)) {
              // if the game CAN be saved
              if (CanGameBeSaved()) {
                guiPreviousOptionScreen = guiCurrentScreen;
                DoQuickSave();
              } else {
                // Display a message saying the player cant save now
                DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zNewTacticalMessages[Enum320.TCTL_MSG__IRON_MAN_CANT_SAVE_NOW], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, null);
              }
            }
          } else if (fCtrl) {
            // go to SAVE screen
            gfSaveGame = true;
            RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_SAVE);
          }
          break;
        case 't':
          // Teleport: CTRL-T
          if ((fCtrl) && (CHEATER_CHEAT_LEVEL())) {
            // check if selected dest char,
            if ((bSelectedDestChar != -1) && (fPlotForHelicopter == false) && (iCurrentMapSectorZ == 0) && (GetMouseMapXY(addressof(sMapX), addressof(sMapY)))) {
              let sDeltaX: INT16;
              let sDeltaY: INT16;
              let sPrevX: INT16;
              let sPrevY: INT16;
              let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[gCharactersList[bSelectedDestChar].usSolID];

              // can't teleport to where we already are
              if ((sMapX == pSoldier.value.sSectorX) && (sMapY == pSoldier.value.sSectorY))
                break;

              /*
                                                                      if( fZoomFlag == TRUE )
                                                                      {
                                                                              // convert to zoom out coords from screen coords
                                                                              sMapX = ( INT16 )( iZoomX / MAP_GRID_X + sMapX ) / 2;
                                                                              sMapY = ( INT16 )( iZoomY / MAP_GRID_Y + sMapY ) / 2;
                                                                      }
              */

              // cancel movement plotting
              AbortMovementPlottingMode();

              // nuke the UI message generated by this
              CancelMapUIMessage();

              // clear their strategic movement (mercpaths and waypoints)
              ClearMvtForThisSoldierAndGang(pSoldier);

              // select this sector
              ChangeSelectedMapSector(sMapX, sMapY, 0);

              // check to see if this person is moving, if not...then assign them to mvt group
              if (pSoldier.value.ubGroupID == 0) {
                ubGroupId = CreateNewPlayerGroupDepartingFromSector((pSoldier.value.sSectorX), (pSoldier.value.sSectorY));
                // assign to a group
                AddPlayerToGroup(ubGroupId, pSoldier);
              }

              // figure out where they would've come from
              sDeltaX = sMapX - pSoldier.value.sSectorX;
              sDeltaY = sMapY - pSoldier.value.sSectorY;

              if (Math.abs(sDeltaX) >= Math.abs(sDeltaY)) {
                // use East or West
                if (sDeltaX > 0) {
                  // came in from the West
                  sPrevX = sMapX - 1;
                  sPrevY = sMapY;
                } else {
                  // came in from the East
                  sPrevX = sMapX + 1;
                  sPrevY = sMapY;
                }
              } else {
                // use North or South
                if (sDeltaY > 0) {
                  // came in from the North
                  sPrevX = sMapX;
                  sPrevY = sMapY - 1;
                } else {
                  // came in from the South
                  sPrevX = sMapX;
                  sPrevY = sMapY + 1;
                }
              }

              // set where they are, were/are going, then make them arrive there and check for battle
              PlaceGroupInSector(pSoldier.value.ubGroupID, sPrevX, sPrevY, sMapX, sMapY, 0, true);

              // unload the sector they teleported out of
              CheckAndHandleUnloadingOfCurrentWorld();
            }
          } else {
            // only handle border button keyboard equivalents if the button is visible!
            if (!fShowMapInventoryPool) {
              // Toggle show teams flag
              ToggleShowTeamsMode();
            }
          }
          break;
        case 'u':
        break;
        case 'v':
          if (fCtrl) {
          } else {
            DisplayGameSettings();
          }
          break;
        case 'w':
          // only handle border button keyboard equivalents if the button is visible!
          if (!fShowMapInventoryPool) {
            // toggle show towns filter
            ToggleShowTownsMode();
          }
          break;
        case 'x':
          if (fAlt) {
            HandleShortCutExitState();
          }
          break;

        case 'y':
          // ALT-Y: toggles SAM sites disable
          if (fAlt) {
          }
          break;

        case 'z':
          // only handle border button keyboard equivalents if the button is visible!
          if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              if (gfAutoAIAware ^= 1)
                ScreenMsg(FONT_WHITE, MSG_TESTVERSION, "Strategic AI awareness maxed.");
              else
                ScreenMsg(FONT_WHITE, MSG_TESTVERSION, "Strategic AI awareness normal.");
            }
          } else if (!fShowMapInventoryPool) {
            // Toggle Show Militia ON/OFF
            ToggleShowMilitiaMode();
          }
          break;
      }
    } else if (InputEvent.usEvent == KEY_REPEAT) {
      switch (InputEvent.usParam) {
        case LEFTARROW:
          // previous character
          GoToPrevCharacterInList();
          break;
        case RIGHTARROW:
          // next character
          GoToNextCharacterInList();
          break;

        case UPARROW:
          // up a line
          MapScreenMsgScrollUp(1);
          break;
        case DNARROW:
          // down a line
          MapScreenMsgScrollDown(1);
          break;

        case PGUP:
          // up a page
          MapScreenMsgScrollUp(MAX_MESSAGES_ON_MAP_BOTTOM);
          break;
        case PGDN:
          // down a page
          MapScreenMsgScrollDown(MAX_MESSAGES_ON_MAP_BOTTOM);
          break;
      }
    }
  }
}

export function EndMapScreen(fDuringFade: boolean): void {
  if (fInMapMode == false) {
    // shouldn't be here
    return;
  }

  /*
          // exit is called due to message box, leave
          if( fMapExitDueToMessageBox )
          {
                  fMapExitDueToMessageBox = FALSE;
                  return;
          }
  */

  fLeavingMapScreen = false;

  SetRenderFlags(RENDER_FLAG_FULL);
  // MSYS_EnableRegion( &gViewportRegion );
  // MSYS_EnableRegion( &gRadarRegion );
  // ATE: Shutdown tactical interface panel
  //	ShutdownCurrentPanel( );

  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();

    return;
  }

  // still plotting movement?
  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  DestroyMouseRegionsForTeamList();

  MSYS_RemoveRegion(addressof(gMapViewRegion));
  MSYS_RemoveRegion(addressof(gCharInfoFaceRegion));
  MSYS_RemoveRegion(addressof(gCharInfoHandRegion));
  MSYS_RemoveRegion(addressof(gMPanelRegion));
  MSYS_RemoveRegion(addressof(gMapScreenMaskRegion));
  fInMapMode = false;

  // remove team panel sort button
  RemoveTeamPanelSortButtonsForMapScreen();

  // for th merc insurance help text
  CreateDestroyInsuranceMouseRegionForMercs(false);

  // gonna need to remove the screen mask regions
  CreateDestroyMouseRegionMasksForTimeCompressionButtons();

  UnloadButtonImage(giMapContractButtonImage);
  RemoveButton(giMapContractButton);

  HandleShutDownOfMapScreenWhileExternfaceIsTalking();

  fShowInventoryFlag = false;
  CreateDestroyMapInvButton();

  // no longer can we show assignments menu
  fShowAssignmentMenu = false;

  // clear out mouse regions for pop up boxes
  DetermineWhichAssignmentMenusCanBeShown();

  sSelectedMilitiaTown = 0;
  CreateDestroyMilitiaPopUPRegions();
  CreateDestroyMilitiaSectorButtons();

  // stop showing contract menu
  fShowContractMenu = false;
  // clear out contract menu
  DetermineIfContractMenuCanBeShown();
  // remove contract pop up box (always created upon mapscreen entry)
  RemoveBox(ghContractBox);
  ghContractBox = -1;

  CreateDestroyAssignmentPopUpBoxes();

  // shutdown movement box
  if (fShowMapScreenMovementList) {
    fShowMapScreenMovementList = false;
    CreateDestroyMovementBox(0, 0, 0);
  }

  // the remove merc from team box
  RemoveBox(ghRemoveMercAssignBox);
  ghRemoveMercAssignBox = -1;

  // clear screen mask if needed
  ClearScreenMaskForMapScreenExit();

  // get rid of pause clock area
  RemoveMouseRegionForPauseOfClock();

  // get rid of pop up for town info, if being shown
  fShowTownInfo = false;
  CreateDestroyTownInfoBox();

  // build squad list
  RebuildCurrentSquad();

  //
  DeleteMouseRegionsForLevelMarkers();

  if (fShowMapInventoryPool == false) {
    // delete buttons
    DeleteMapBorderButtons();
  }

  if (fShowDescriptionFlag) {
    DeleteItemDescriptionBox();
  }

  fShowInventoryFlag = false;
  CreateDestroyTrashCanRegion();

  if (!fDuringFade) {
    MSYS_SetCurrentCursor(SCREEN_CURSOR);
  }

  if (fPreLoadedMapGraphics == false) {
    DeleteMapBottomGraphics();

    DeleteVideoObjectFromIndex(guiSubLevel1);
    DeleteVideoObjectFromIndex(guiSubLevel2);
    DeleteVideoObjectFromIndex(guiSubLevel3);
    DeleteVideoObjectFromIndex(guiSleepIcon);
    DeleteVideoObjectFromIndex(guiMAPCURSORS);
    // DeleteVideoObjectFromIndex(guiMAPBORDER);
    DeleteVideoObjectFromIndex(guiCHARLIST);
    // DeleteVideoObjectFromIndex(guiCORNERADDONS);
    // DeleteVideoObjectFromIndex(guiMAPCORNER);
    // DeleteVideoObjectFromIndex(guiPOPUPBORDERS);
    DeleteVideoObjectFromIndex(guiCHARINFO);
    DeleteVideoObjectFromIndex(guiCHARICONS);
    DeleteVideoObjectFromIndex(guiCROSS);
    DeleteVideoSurfaceFromIndex(guiBIGMAP);
    //	DeleteVideoSurfaceFromIndex(guiPOPUPTEX);
    DeleteVideoObjectFromIndex(guiSAMICON);
    DeleteVideoObjectFromIndex(guiMAPINV);
    DeleteVideoObjectFromIndex(guiMapInvSecondHandBlockout);
    DeleteVideoObjectFromIndex(guiULICONS);
    DeleteVideoObjectFromIndex(guiORTAICON);
    DeleteVideoObjectFromIndex(guiTIXAICON);
    DeleteVideoObjectFromIndex(guiCHARBETWEENSECTORICONS);
    DeleteVideoObjectFromIndex(guiCHARBETWEENSECTORICONSCLOSE);
    DeleteVideoObjectFromIndex(guiLEVELMARKER);
    DeleteVideoObjectFromIndex(guiMapBorderEtaPopUp);

    DeleteVideoObjectFromIndex(guiSecItemHiddenVO);
    DeleteVideoObjectFromIndex(guiSelectedCharArrow);
    DeleteVideoObjectFromIndex(guiMapBorderHeliSectors);
    DeleteVideoObjectFromIndex(guiHelicopterIcon);
    DeleteVideoObjectFromIndex(guiMINEICON);
    DeleteVideoObjectFromIndex(guiSectorLocatorGraphicID);

    DeleteVideoObjectFromIndex(guiBULLSEYE);

    // remove the militia pop up box
    RemoveMilitiaPopUpBox();

    // remove inventory pool graphic
    RemoveInventoryPoolGraphic();

    // get rid of border stuff
    DeleteMapBorderGraphics();

    // Kris:  Remove the email icons.
    DeleteVideoObjectFromIndex(guiNewMailIcons);
  }

  DeleteVideoObjectFromIndex(guiBrownBackgroundForTeamPanel);

  RemoveMapStatusBarsRegion();

  fShowUpdateBox = false;
  CreateDestroyTheUpdateBox();

  // get rid of mapscreen bottom
  DeleteMapScreenInterfaceBottom();

  // shutdown any mapscreen UI overlay message
  CancelMapUIMessage();

  CreateDestroyMapCharacterScrollButtons();

  // if time was ever compressed while we were in mapscreen
  if (HasTimeCompressOccured()) {
    // make sure everything tactical got cleared out
    ClearTacticalStuffDueToTimeCompression();
  }

  CancelSectorInventoryDisplayIfOn(true);

  SetAllAutoFacesInactive();
  if (fLapTop) {
    StopAnyCurrentlyTalkingSpeech();
    guiCurrentScreen = Enum26.LAPTOP_SCREEN;
  } else {
    guiCurrentScreen = Enum26.GAME_SCREEN;

    // remove the progress bar
    RemoveProgressBar(0);

    // enable scroll string video overlays
    EnableDisableScrollStringVideoOverlay(true);
  }

  // if going to tactical next
  if (guiPendingScreen == Enum26.GAME_SCREEN) {
    // set compressed mode to Normal (X1)
    SetGameTimeCompressionLevel(Enum130.TIME_COMPRESS_X1);
  } else // going to another screen (options, laptop, save/load)
  {
    StopTimeCompression();
  }

  // update paused states, we are exiting...need to reset for any pathing or menus displayed
  UnLockPauseState();
  UpdatePausedStatesDueToTimeCompression();

  if (!gfDontStartTransitionFromLaptop) {
    let VObjectDesc: VOBJECT_DESC;
    let uiLaptopOn: UINT32;

    // Load a tiny graphic of the on screen and draw it to the buffer.
    PlayJA2SampleFromFile("SOUNDS\\Initial Power Up (8-11).wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = "INTERFACE\\LaptopOn.sti";
    if (!AddVideoObject(addressof(VObjectDesc), addressof(uiLaptopOn)))
      AssertMsg(0, "Failed to load data\\Interface\\LaptopOn.sti");
    BltVideoObjectFromIndex(FRAME_BUFFER, uiLaptopOn, 0, 465, 417, VO_BLT_SRCTRANSPARENCY, null);
    InvalidateRegion(465, 417, 480, 427);
    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
    DeleteVideoObjectFromIndex(uiLaptopOn);
    RefreshScreen(null);
  }

  // Kris:  Removes the pre battle interface, but only if it exists.
  //		   It is internally considered.
  KillPreBattleInterface();

  // cancel request if we somehow leave first
  gfRequestGiveSkyriderNewDestination = false;
}

export function GetMouseMapXY(psMapWorldX: Pointer<INT16>, psMapWorldY: Pointer<INT16>): boolean {
  let MousePos: POINT;

  if (IsMapScreenHelpTextUp()) {
    // don't show highlight while global help text is up
    return false;
  }

  GetCursorPos(addressof(MousePos));

  if (fZoomFlag) {
    if (MousePos.x > MAP_GRID_X + MAP_VIEW_START_X)
      MousePos.x -= MAP_GRID_X;
    if (MousePos.x > MAP_VIEW_START_X + MAP_VIEW_WIDTH)
      MousePos.x = -1;
    if (MousePos.y > MAP_GRID_Y + MAP_VIEW_START_Y)
      MousePos.y -= MAP_GRID_Y;
    if (MousePos.y > MAP_VIEW_START_Y + MAP_VIEW_HEIGHT - 11)
      MousePos.y = -11;
    if (MousePos.y < MAP_VIEW_START_Y)
      MousePos.y = -1;
  }

  return GetMapXY(MousePos.x, MousePos.y, psMapWorldX, psMapWorldY);
}

function GetMapXY(sX: INT16, sY: INT16, psMapWorldX: Pointer<INT16>, psMapWorldY: Pointer<INT16>): boolean {
  let sMapX: INT16;
  let sMapY: INT16;

  // Subtract start of map view
  sMapX = sX - MAP_VIEW_START_X; //+2*MAP_GRID_X;
  sMapY = sY - MAP_VIEW_START_Y;

  if (!fZoomFlag) {
    if (sMapX < MAP_GRID_X || sMapY < MAP_GRID_Y) {
      return false;
    }
  }
  if (sMapX < 0 || sMapY < 0) {
    return false;
  }

  if (sMapX > MAP_VIEW_WIDTH + MAP_GRID_X - 1 || sMapY > MAP_VIEW_HEIGHT + 7 /* +MAP_VIEW_HEIGHT */) {
    return false;
  }
  if (sMapX < 1 || sMapY < 1) {
    return false;
  }

  psMapWorldX.value = (sMapX / MAP_GRID_X);
  psMapWorldY.value = (sMapY / MAP_GRID_Y);

  return true;
}

function RenderMapHighlight(sMapX: INT16, sMapY: INT16, usLineColor: UINT16, fStationary: boolean): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;

  Assert((sMapX >= 1) && (sMapX <= 16));
  Assert((sMapY >= 1) && (sMapY <= 16));

  /*
          if((fZoomFlag)&&((sMapX > MAP_WORLD_X-1)||(sMapY> MAP_WORLD_Y-1)))
     return;
  */

  // if we are not allowed to highlight, leave
  if ((IsTheCursorAllowedToHighLightThisSector(sMapX, sMapY) == false) && (fZoomFlag == false)) {
    return;
  }
  /*
          else if( ( IsTheCursorAllowedToHighLightThisSector( sMapX , sMapY ) == FALSE )&&( fZoomFlag == TRUE ) && ( fStationary == TRUE ) )
          {
                  return;
          }
          else if( ( IsTheCursorAllowedToHighLightThisSector( ( INT16 ) ( ( ( iZoomX ) / ( MAP_GRID_X * 2 ) ) + sMapX / 2 ) ,( INT16 ) ( ( ( iZoomY ) / ( MAP_GRID_Y * 2 ) ) + sMapY / 2 ) ) == FALSE ) && ( fZoomFlag == TRUE ) &&( fStationary == FALSE ) )
    {
                  return;
          }
  */

  //	if((!fStationary)||(!fZoomFlag))
  { GetScreenXYFromMapXY(sMapX, sMapY, addressof(sScreenX), addressof(sScreenY)); }
  /*
    else
          {
      GetScreenXYFromMapXYStationary( sMapX, sMapY, &sScreenX, &sScreenY );
          }
  */

  // blit in the highlighted sector
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

  // clip to view region
  ClipBlitsToMapViewRegionForRectangleAndABit(uiDestPitchBYTES);

  if (gbPixelDepth == 16) {
    // DB Need to add a radar color for 8-bit
    /*
                    if (fZoomFlag)
                    {
                            // draw rectangle for zoom in
                      RectangleDraw( TRUE, sScreenX-MAP_GRID_X,     sScreenY-MAP_GRID_Y - 1, sScreenX +  MAP_GRID_ZOOM_X - MAP_GRID_X, sScreenY +  MAP_GRID_ZOOM_Y - MAP_GRID_Y - 1, usLineColor, pDestBuf );
                      InvalidateRegion(    sScreenX-MAP_GRID_X - 3, sScreenY-MAP_GRID_Y - 4, sScreenX + DMAP_GRID_ZOOM_X - MAP_GRID_X, sScreenY + DMAP_GRID_ZOOM_Y - MAP_GRID_Y - 1 );
                    }
              else
    */
    {
      // draw rectangle for zoom out
      RectangleDraw(true, sScreenX, sScreenY - 1, sScreenX + MAP_GRID_X, sScreenY + MAP_GRID_Y - 1, usLineColor, pDestBuf);
      InvalidateRegion(sScreenX, sScreenY - 2, sScreenX + DMAP_GRID_X + 1, sScreenY + DMAP_GRID_Y - 1);
    }
  }

  RestoreClipRegionToFullScreenForRectangle(uiDestPitchBYTES);
  UnLockVideoSurface(FRAME_BUFFER);
}

function PollLeftButtonInMapView(puiNewEvent: Pointer<UINT32>): void {
  /* static */ let fLBBeenPressedInMapView: boolean = false;
  let sMapX: INT16;
  let sMapY: INT16;

  // if the mouse is currently over the MAP area
  if (gMapViewRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    // if L-button is down at the moment
    if (gMapViewRegion.ButtonState & MSYS_LEFT_BUTTON) {
      if (!fLBBeenPressedInMapView) {
        fLBBeenPressedInMapView = true;
        RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);

        gfAllowSkyriderTooFarQuote = false;
      }
    } else // L-button is NOT down at the moment
    {
      if (fLBBeenPressedInMapView) {
        fLBBeenPressedInMapView = false;
        RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);

        // if we are showing help text in mapscreen
        if (fShowMapScreenHelpText) {
          fShowMapScreenHelpText = false;
          fCharacterInfoPanelDirty = true;
          fMapPanelDirty = true;
          return;
        }

        // if in militia redistribution popup
        if (sSelectedMilitiaTown != 0) {
          // ignore clicks outside the box
          return;
        }

        // left click cancels MAP UI messages, unless we're in confirm map move mode
        if ((giUIMessageOverlay != -1) && !gfInConfirmMapMoveMode) {
          CancelMapUIMessage();

          // return unless moving the bullseye
          if (!gfInChangeArrivalSectorMode)
            return;
        }

        // ignore left clicks in the map screen if:
        // game just started or we're in the prebattle interface or if we are about to hit pre-battle
        if ((gTacticalStatus.fDidGameJustStart == true) || (gfPreBattleInterfaceActive == true) || (fDisableMapInterfaceDueToBattle == true)) {
          return;
        }

        // if in "plot route" mode
        if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
          fEndPlotting = false;

          GetMouseMapXY(addressof(sMapX), addressof(sMapY));

          /*
                                                  // translate screen values to map grid values for zoomed in
                                                  if(fZoomFlag)
                                                  {
                                                          sMapX=(UINT16)iZoomX/MAP_GRID_X+sMapX;
                                                          sMapX=sMapX/2;
                                                          sMapY=(UINT16)iZoomY/MAP_GRID_Y+sMapY;
                                                          sMapY=sMapY/2;
                                                  }
          */

          // if he clicked on the last sector in his current path
          if (CheckIfClickOnLastSectorInPath(sMapX, sMapY)) {
            DestinationPlottingCompleted();
          } else // clicked on a new sector
          {
            gfAllowSkyriderTooFarQuote = true;

            // draw new map route
            puiNewEvent.value = Enum134.MAP_EVENT_PLOT_PATH;
          }
        } else // not plotting movement
        {
          // if not plotting a path
          if ((fEndPlotting == false) && (fJustFinishedPlotting == false)) {
            // make this sector selected / trigger movement box / start helicopter plotting / changing arrival sector
            puiNewEvent.value = Enum134.MAP_EVENT_CLICK_SECTOR;
          }

          fEndPlotting = false;
        }

        // reset town info flag
        fShowTownInfo = false;
      }
    }
  }

  fJustFinishedPlotting = false;
}

function PollRightButtonInMapView(puiNewEvent: Pointer<UINT32>): void {
  /* static */ let fRBBeenPressedInMapView: boolean = false;
  let sMapX: INT16;
  let sMapY: INT16;

  // if the mouse is currently over the MAP area
  if (gMapViewRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    // if R-button is down at the moment
    if (gMapViewRegion.ButtonState & MSYS_RIGHT_BUTTON) {
      if (!fRBBeenPressedInMapView) {
        fRBBeenPressedInMapView = true;
        RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
      }
    } else // R-button is NOT down at the moment
    {
      if (fRBBeenPressedInMapView) {
        fRBBeenPressedInMapView = false;
        RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);

        // if we are showing help text in mapscreen
        if (fShowMapScreenHelpText) {
          fShowMapScreenHelpText = false;
          fCharacterInfoPanelDirty = true;
          fMapPanelDirty = true;
          return;
        }

        // if in militia redistribution popup
        if (sSelectedMilitiaTown != 0) {
          // ignore clicks outside the box
          return;
        }

        if (gfInChangeArrivalSectorMode) {
          CancelChangeArrivalSectorMode();
          MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pBullseyeStrings[3]);
          return;
        }

        // right click cancels MAP UI messages, unless we're in confirm map move mode
        if ((giUIMessageOverlay != -1) && !gfInConfirmMapMoveMode) {
          CancelMapUIMessage();
          return;
        }

        // ignore right clicks in the map area if:
        // game just started or we're in the prebattle interface or if we are about to hit pre-battle
        if ((gTacticalStatus.fDidGameJustStart == true) || (gfPreBattleInterfaceActive == true) || (fDisableMapInterfaceDueToBattle == true)) {
          return;
        }

        if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
          // cancel/shorten the path
          puiNewEvent.value = Enum134.MAP_EVENT_CANCEL_PATH;
        } else {
          if (GetMouseMapXY(addressof(sMapX), addressof(sMapY))) {
            /*
                                                            if(fZoomFlag)
                                                            {
                                                                    sMapX=(UINT16)iZoomX/MAP_GRID_X+sMapX;
                                                                    sMapX=sMapX/2;
                                                                    sMapY=(UINT16)iZoomY/MAP_GRID_Y+sMapY;
                                                                    sMapY=sMapY/2;
                                                            }
            */

            if ((sSelMapX != sMapX) || (sSelMapY != sMapY)) {
              ChangeSelectedMapSector(sMapX, sMapY, iCurrentMapSectorZ);
            }
          }

          // sector must be selected to bring up militia or town info boxes for it
          if ((sMapX == sSelMapX) && (sSelMapY == sMapY)) {
            if (fShowMilitia == true) {
              HandleMilitiaRedistributionClick();
            } else // show militia is OFF
            {
              // if on the surface, or a real underground sector (we've visited it)
              if ((iCurrentMapSectorZ == 0) || (GetSectorFlagStatus(sMapX, sMapY, iCurrentMapSectorZ, SF_ALREADY_VISITED) == true)) {
                // toggle sector info for this sector
                fShowTownInfo = !fShowTownInfo;
                fMapPanelDirty = true;
              }
            }

            //						fMapScreenBottomDirty = TRUE;

            CreateDestroyScreenMaskForAssignmentAndContractMenus();
            if (fShowTownInfo == false) {
              // destroy town info box
              CreateDestroyTownInfoBox();
            }
          }
        }
      }
    }
  }
}

function PopupText(pFontString: string /* Pointer<UINT16> */, ...args: any[]): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let argptr: va_list;
  let sX: INT16;
  let sY: INT16;
  let PopupString: string /* wchar_t[512] */;

  va_start(argptr, pFontString); // Set up variable argument pointer
  vswprintf(PopupString, pFontString, argptr); // process gprintf string (get output str)
  va_end(argptr);

  FindFontCenterCoordinates(0, 0, SCREEN_WIDTH, INTERFACE_START_Y, PopupString, LARGEFONT1(), addressof(sX), addressof(sY));

  BltVideoSurface(FRAME_BUFFER, guiINTEXT, 0, 85, 160, VS_BLT_FAST | VS_BLT_USECOLORKEY, null);

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

  SetFont(LARGEFONT1());
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_DKGRAY);

  mprintf_buffer(pDestBuf, uiDestPitchBYTES, LARGEFONT1(), sX, sY, PopupString);

  UnLockVideoSurface(FRAME_BUFFER);

  InvalidateScreen();
}

/*
void BtnINVCallback(GUI_BUTTON *btn,INT32 reason)
{
        if (!(btn->uiFlags & BUTTON_ENABLED))
                return;

        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                if(fMapInventoryItem)
                        return;
                if(!(btn->uiFlags & BUTTON_CLICKED_ON))
                {
                 fCharacterInfoPanelDirty = TRUE;
                }
    btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
        {
                if(btn->uiFlags & BUTTON_CLICKED_ON)
                {
                 btn->uiFlags&= ~(BUTTON_CLICKED_ON);

                 if(!fMapInventoryItem)
                 {
                   fShowInventoryFlag = FALSE;
                 }

                 // set help text for item glow region
                 if( fShowInventoryFlag )
                 {
                         SetRegionFastHelpText( &gCharInfoHandRegion, pMiscMapScreenMouseRegionHelpText[ 2 ] );
                 }
                 else
                 {
                         SetRegionFastHelpText( &gCharInfoHandRegion, pMiscMapScreenMouseRegionHelpText[ 0 ] );
                 }

                 fTeamPanelDirty = TRUE;
                }
        }
}
*/

export function CreateDestroyMapInvButton(): void {
  /* static */ let fOldShowInventoryFlag: boolean = false;

  if (fShowInventoryFlag && !fOldShowInventoryFlag) {
    // create inventory button
    fOldShowInventoryFlag = true;
    // giMapInvButtonImage=  LoadButtonImage( "INTERFACE\\mapinv.sti" ,-1,1,-1,2,-1 );
    // giMapInvButton= QuickCreateButton( giMapInvButtonImage, INV_BTN_X-1, INV_BTN_Y,
    //				BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
    //				BUTTON_NO_CALLBACK, (GUI_CALLBACK)BtnINVCallback);
    // disable allmouse regions in this space
    fTeamPanelDirty = true;

    InitInvSlotInterface(gMapScreenInvPocketXY, addressof(gSCamoXY), MAPInvMoveCallback, MAPInvClickCallback, MAPInvMoveCamoCallback, MAPInvClickCamoCallback, false);
    MSYS_EnableRegion(addressof(gMPanelRegion));

    // switch hand region help text to "Exit Inventory"
    SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[2]);

    // reset inventory item help text
    memset(gubMAP_HandInvDispText, 0, sizeof(gubMAP_HandInvDispText));

    // dirty character info panel  ( Why? ARM )
    fCharacterInfoPanelDirty = true;
  } else if (!fShowInventoryFlag && fOldShowInventoryFlag) {
    // destroy inventory button
    ShutdownInvSlotInterface();
    fOldShowInventoryFlag = false;
    // RemoveButton( giMapInvButton );
    // UnloadButtonImage( giMapInvButtonImage );
    fTeamPanelDirty = true;
    MSYS_DisableRegion(addressof(gMPanelRegion));

    // switch hand region help text to "Enter Inventory"
    SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[0]);

    // force immediate reblit of item in HANDPOS now that it's not blitted while in inventory mode
    fCharacterInfoPanelDirty = true;
  }
}

function BltCharInvPanel(): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let hCharListHandle: HVOBJECT;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sString: string /* CHAR16[32] */;
  let usX: UINT16;
  let usY: UINT16;
  let iCounter: INT32 = 0;

  // make sure we're here legally
  Assert(MapCharacterHasAccessibleInventory(bSelectedInfoChar));

  GetSoldier(addressof(pSoldier), gCharactersList[bSelectedInfoChar].usSolID);

  pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));
  GetVideoObject(addressof(hCharListHandle), guiMAPINV);
  Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hCharListHandle, PLAYER_INFO_X, PLAYER_INFO_Y, 0);
  UnLockVideoSurface(guiSAVEBUFFER);

  Assert(pSoldier);
  CreateDestroyMapInvButton();

  if (gbCheckForMouseOverItemPos != -1) {
    if (HandleCompatibleAmmoUIForMapScreen(pSoldier, gbCheckForMouseOverItemPos, true, true) == true) {
      fMapPanelDirty = true;
    }
  }

  if ((fShowMapInventoryPool)) {
    if (iCurrentlyHighLightedItem != -1) {
      HandleCompatibleAmmoUIForMapScreen(pSoldier, (iCurrentlyHighLightedItem + (iCurrentInventoryPoolPage * MAP_INVENTORY_POOL_SLOT_COUNT)), true, false);
    }
  }

  RenderInvBodyPanel(pSoldier, INV_BODY_X, INV_BODY_Y);

  // reset font destination buffer to the save buffer
  SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);

  // render items in each of chars slots
  HandleRenderInvSlots(pSoldier, DIRTYLEVEL2);

  // reset font destination buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  SetFont(BLOCKFONT2());

  // Render Values for stats!
  // Set font drawing to saved buffer
  SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);

  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(MAP_INV_STATS_TITLE_FONT_COLOR);

  // print armor/weight/camo labels
  mprintf(MAP_ARMOR_LABEL_X, MAP_ARMOR_LABEL_Y, pInvPanelTitleStrings[0]);
  mprintf(MAP_ARMOR_PERCENT_X, MAP_ARMOR_PERCENT_Y, "%%");

  mprintf(MAP_WEIGHT_LABEL_X, MAP_WEIGHT_LABEL_Y, pInvPanelTitleStrings[1]);
  mprintf(MAP_WEIGHT_PERCENT_X, MAP_WEIGHT_PERCENT_Y, "%%");

  mprintf(MAP_CAMMO_LABEL_X, MAP_CAMMO_LABEL_Y, pInvPanelTitleStrings[2]);
  mprintf(MAP_CAMMO_PERCENT_X, MAP_CAMMO_PERCENT_Y, "%%");

  // display armor value
  sString = swprintf("%3d", ArmourPercent(pSoldier));
  FindFontRightCoordinates(MAP_ARMOR_X, MAP_ARMOR_Y, MAP_PERCENT_WIDTH, MAP_PERCENT_HEIGHT, sString, BLOCKFONT2(), addressof(usX), addressof(usY));
  mprintf(usX, usY, sString);

  // Display weight value
  sString = swprintf("%3d", CalculateCarriedWeight(pSoldier));
  FindFontRightCoordinates(MAP_WEIGHT_X, MAP_WEIGHT_Y, MAP_PERCENT_WIDTH, MAP_PERCENT_HEIGHT, sString, BLOCKFONT2(), addressof(usX), addressof(usY));
  mprintf(usX, usY, sString);

  // Display camo value
  sString = swprintf("%3d", pSoldier.value.bCamo);
  FindFontRightCoordinates(MAP_CAMMO_X, MAP_CAMMO_Y, MAP_PERCENT_WIDTH, MAP_PERCENT_HEIGHT, sString, BLOCKFONT2(), addressof(usX), addressof(usY));
  mprintf(usX, usY, sString);

  if (InKeyRingPopup()) {
    // shade the background
    ShadowVideoSurfaceRect(guiSAVEBUFFER, PLAYER_INFO_X, PLAYER_INFO_Y, PLAYER_INFO_X + 261, PLAYER_INFO_Y + (359 - 107));
  } else {
    // blit gold key on top of key ring if key ring is not empty
  }

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
}

// check for and highlight any ammo
function HandleCursorOverRifleAmmo(): void {
  if (fShowInventoryFlag == false) {
    return;
  }

  if (gbCheckForMouseOverItemPos == -1) {
    return;
  }

  if (gfCheckForMouseOverItem) {
    if (HandleCompatibleAmmoUI(addressof(Menptr[gCharactersList[bSelectedInfoChar].usSolID]), gbCheckForMouseOverItemPos, true)) {
      if ((GetJA2Clock() - guiMouseOverItemTime) > 100) {
        fTeamPanelDirty = true;
      }
    }
  }
}

function MAPInvClickCamoCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
}

function MAPInvMoveCamoCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
}

// this is Map Screen's version of SMInvMoveCallback()
function MAPInvMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiHandPos: UINT32;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  // make sure we're here legally
  Assert(MapCharacterHasAccessibleInventory(bSelectedInfoChar));

  GetSoldier(addressof(pSoldier), gCharactersList[bSelectedInfoChar].usSolID);

  uiHandPos = MSYS_GetRegionUserData(pRegion, 0);

  // gbCheckForMouseOverItemPos = -1;

  if (pSoldier.value.inv[uiHandPos].usItem == NOTHING)
    return;

  if (iReason == MSYS_CALLBACK_REASON_MOVE) {
  } else if (iReason == MSYS_CALLBACK_REASON_GAIN_MOUSE)
  //  if( ( iReason == MSYS_CALLBACK_REASON_MOVE ) || ( iReason == MSYS_CALLBACK_REASON_GAIN_MOUSE ) )
  {
    gubMAP_HandInvDispText[uiHandPos] = 2;
    guiMouseOverItemTime = GetJA2Clock();
    gfCheckForMouseOverItem = true;
    HandleCompatibleAmmoUI(pSoldier, uiHandPos, false);
    gbCheckForMouseOverItemPos = uiHandPos;
  }
  if (iReason == MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gubMAP_HandInvDispText[uiHandPos] = 1;
    HandleCompatibleAmmoUI(pSoldier, uiHandPos, false);
    gfCheckForMouseOverItem = false;
    fTeamPanelDirty = true;
    gbCheckForMouseOverItemPos = -1;
  }
}

// mapscreen wrapper to init the item description box
export function MAPInternalInitItemDescriptionBox(pObject: Pointer<OBJECTTYPE>, ubStatusIndex: UINT8, pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let fRet: boolean;

  fRet = InternalInitItemDescriptionBox(pObject, MAP_ITEMDESC_START_X, MAP_ITEMDESC_START_Y, ubStatusIndex, pSoldier);

  fShowDescriptionFlag = true;
  fTeamPanelDirty = true;
  fInterfacePanelDirty = DIRTYLEVEL2;

  return fRet;
}

// this is Map Screen's version of SMInvClickCallback()
function MAPInvClickCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiHandPos: UINT32;
  let usOldItemIndex: UINT16;
  let usNewItemIndex: UINT16;
  /* static */ let fRightDown: boolean = false;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  // make sure we're here legally
  Assert(MapCharacterHasAccessibleInventory(bSelectedInfoChar));

  GetSoldier(addressof(pSoldier), gCharactersList[bSelectedInfoChar].usSolID);

  uiHandPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // If we do not have an item in hand, start moving it
    if (gpItemPointer == null) {
      // Return if empty
      if (pSoldier.value.inv[uiHandPos].usItem == NOTHING) {
        return;
      }

      // ATE: Put this here to handle Nails refusal....
      if (HandleNailsVestFetish(pSoldier, uiHandPos, NOTHING)) {
        return;
      }

      if (_KeyDown(CTRL)) {
        CleanUpStack(addressof(pSoldier.value.inv[uiHandPos]), null);
      }

      // remember what it was
      usOldItemIndex = pSoldier.value.inv[uiHandPos].usItem;

      // pick it up
      MAPBeginItemPointer(pSoldier, uiHandPos);

      // remember which gridno the object came from
      sObjectSourceGridNo = pSoldier.value.sGridNo;

      HandleTacticalEffectsOfEquipmentChange(pSoldier, uiHandPos, usOldItemIndex, NOTHING);

      fInterfacePanelDirty = DIRTYLEVEL2;
      fCharacterInfoPanelDirty = true;
    } else // item in cursor
    {
      // can we pass this part due to booby traps
      if (ContinuePastBoobyTrapInMapScreen(gpItemPointer, pSoldier) == false) {
        return;
      }

      usOldItemIndex = pSoldier.value.inv[uiHandPos].usItem;
      usNewItemIndex = gpItemPointer.value.usItem;

      // ATE: Put this here to handle Nails refusal....
      if (HandleNailsVestFetish(pSoldier, uiHandPos, usNewItemIndex)) {
        return;
      }

      if (_KeyDown(CTRL)) {
        CleanUpStack(addressof(pSoldier.value.inv[uiHandPos]), gpItemPointer);
        if (gpItemPointer.value.ubNumberOfObjects == 0) {
          MAPEndItemPointer();
        }
        return;
      }

      // !!! ATTACHING/MERGING ITEMS IN MAP SCREEN IS NOT SUPPORTED !!!
      if (uiHandPos == Enum261.HANDPOS || uiHandPos == Enum261.SECONDHANDPOS || uiHandPos == Enum261.HELMETPOS || uiHandPos == Enum261.VESTPOS || uiHandPos == Enum261.LEGPOS) {
        // if ( ValidAttachmentClass( usNewItemIndex, usOldItemIndex ) )
        if (ValidAttachment(usNewItemIndex, usOldItemIndex)) {
          // it's an attempt to attach; bring up the inventory panel
          if (!InItemDescriptionBox()) {
            MAPInternalInitItemDescriptionBox(addressof(pSoldier.value.inv[uiHandPos]), 0, pSoldier);
          }
          return;
        } else if (ValidMerge(usNewItemIndex, usOldItemIndex)) {
          // bring up merge requestor
          // TOO PAINFUL TO DO!! --CC
          if (!InItemDescriptionBox()) {
            MAPInternalInitItemDescriptionBox(addressof(pSoldier.value.inv[uiHandPos]), 0, pSoldier);
          }

          /*
          gubHandPos = (UINT8) uiHandPos;
          gusOldItemIndex = usOldItemIndex;
          gusNewItemIndex = usNewItemIndex;
          gfDeductPoints = fDeductPoints;

          DoScreenIndependantMessageBox( Message[ STR_MERGE_ITEMS ], MSG_BOX_FLAG_YESNO, MergeMessageBoxCallBack );
          return;
          */
        }
        // else handle normally
      }

      // Else, try to place here
      if (PlaceObject(pSoldier, uiHandPos, gpItemPointer)) {
        HandleTacticalEffectsOfEquipmentChange(pSoldier, uiHandPos, usOldItemIndex, usNewItemIndex);

        // Dirty
        fInterfacePanelDirty = DIRTYLEVEL2;
        fCharacterInfoPanelDirty = true;
        fMapPanelDirty = true;

        // Check if cursor is empty now
        if (gpItemPointer.value.ubNumberOfObjects == 0) {
          MAPEndItemPointer();
        } else // items swapped
        {
          // Update mouse cursor
          guiExternVo = GetInterfaceGraphicForItem(addressof(Item[gpItemPointer.value.usItem]));
          gusExternVoSubIndex = Item[gpItemPointer.value.usItem].ubGraphicNum;

          MSYS_ChangeRegionCursor(addressof(gMPanelRegion), EXTERN_CURSOR);
          MSYS_SetCurrentCursor(EXTERN_CURSOR);
          fMapInventoryItem = true;
          fTeamPanelDirty = true;

          // remember which gridno the object came from
          sObjectSourceGridNo = pSoldier.value.sGridNo;
          // and who owned it last
          gpItemPointerSoldier = pSoldier;

          ReevaluateItemHatches(pSoldier, false);
        }

        // re-evaluate repairs
        gfReEvaluateEveryonesNothingToDo = true;

        // if item came from another merc
        if (gpItemPointerSoldier != pSoldier) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_ITEM_PASSED_TO_MERC], ShortItemNames[usNewItemIndex], pSoldier.value.name);
        }
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    // if there is a map UI message being displayed
    if (giUIMessageOverlay != -1) {
      CancelMapUIMessage();
      return;
    }

    fRightDown = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP && fRightDown) {
    fRightDown = false;

    // Return if empty
    if (pSoldier.value.inv[uiHandPos].usItem == NOTHING) {
      return;
    }

    // Some global stuff here - for esc, etc
    // Check for # of slots in item
    if ((pSoldier.value.inv[uiHandPos].ubNumberOfObjects > 1) && (ItemSlotLimit(pSoldier.value.inv[uiHandPos].usItem, uiHandPos) > 0)) {
      if (!InItemStackPopup()) {
        InitItemStackPopup(pSoldier, uiHandPos, 0, INV_REGION_Y, 261, 248);
        fTeamPanelDirty = true;
        fInterfacePanelDirty = DIRTYLEVEL2;
      }
    } else {
      if (!InItemDescriptionBox()) {
        InitItemDescriptionBox(pSoldier, uiHandPos, MAP_ITEMDESC_START_X, MAP_ITEMDESC_START_Y, 0);
        fShowDescriptionFlag = true;
        fTeamPanelDirty = true;
        fInterfacePanelDirty = DIRTYLEVEL2;
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fRightDown = false;
  }
}

export function InternalMAPBeginItemPointer(pSoldier: Pointer<SOLDIERTYPE>): void {
  // If not null return
  if (gpItemPointer != null) {
    return;
  }

  // Set global indicator
  gpItemPointer = addressof(gItemPointer);
  gpItemPointerSoldier = pSoldier;

  // Set mouse
  guiExternVo = GetInterfaceGraphicForItem(addressof(Item[gpItemPointer.value.usItem]));
  gusExternVoSubIndex = Item[gpItemPointer.value.usItem].ubGraphicNum;

  MSYS_ChangeRegionCursor(addressof(gMPanelRegion), EXTERN_CURSOR);
  MSYS_SetCurrentCursor(EXTERN_CURSOR);
  fMapInventoryItem = true;
  fTeamPanelDirty = true;

  // hatch out incompatible inventory slots
  ReevaluateItemHatches(pSoldier, false);

  // re-evaluate repairs
  gfReEvaluateEveryonesNothingToDo = true;
}

function MAPBeginItemPointer(pSoldier: Pointer<SOLDIERTYPE>, ubHandPos: UINT8): void {
  let fOk: boolean;

  // If not null return
  if (gpItemPointer != null) {
    return;
  }

  if (_KeyDown(SHIFT)) {
    // Remove all from soldier's slot
    fOk = RemoveObjectFromSlot(pSoldier, ubHandPos, addressof(gItemPointer));
  } else {
    GetObjFrom(addressof(pSoldier.value.inv[ubHandPos]), 0, addressof(gItemPointer));
    fOk = (gItemPointer.ubNumberOfObjects == 1);
  }

  if (fOk) {
    InternalMAPBeginItemPointer(pSoldier);
  }
}

function MAPBeginKeyRingItemPointer(pSoldier: Pointer<SOLDIERTYPE>, uiKeySlot: UINT8): void {
  // If not null return
  if (gpItemPointer != null) {
    return;
  }

  // Set mouse
  guiExternVo = GetInterfaceGraphicForItem(addressof(Item[gpItemPointer.value.usItem]));
  gusExternVoSubIndex = Item[gpItemPointer.value.usItem].ubGraphicNum;

  MSYS_ChangeRegionCursor(addressof(gMPanelRegion), EXTERN_CURSOR);
  MSYS_SetCurrentCursor(EXTERN_CURSOR);
  fMapInventoryItem = true;
  fTeamPanelDirty = true;
}

export function MAPEndItemPointer(): void {
  if (gpItemPointer != null) {
    gpItemPointer = null;
    MSYS_ChangeRegionCursor(addressof(gMPanelRegion), Enum317.CURSOR_NORMAL);
    MSYS_SetCurrentCursor(Enum317.CURSOR_NORMAL);
    fMapInventoryItem = false;
    fTeamPanelDirty = true;

    if (fShowMapInventoryPool) {
      HandleButtonStatesWhileMapInventoryActive();
    }

    if (fShowInventoryFlag && bSelectedInfoChar >= 0) {
      ReevaluateItemHatches(MercPtrs[gCharactersList[bSelectedInfoChar].usSolID], false);
    }
  }
}

function HandleMapInventoryCursor(): void {
  if (fMapInventoryItem)
    MSYS_SetCurrentCursor(EXTERN_CURSOR);
  return;
}

// will place down the upper left hand corner attribute strings
function RenderAttributeStringsForUpperLeftHandCorner(uiBufferToRenderTo: UINT32): void {
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if ((bSelectedInfoChar != -1) && (gCharactersList[bSelectedInfoChar].fValid)) {
    pSoldier = MercPtrs[gCharactersList[bSelectedInfoChar].usSolID];
  }

  SetFont(CHAR_FONT());
  SetFontForeground(CHAR_TITLE_FONT_COLOR);
  SetFontBackground(FONT_BLACK);
  SetFontDestBuffer(uiBufferToRenderTo, 0, 0, 640, 480, false);

  // assignment strings
  DrawString(pUpperLeftMapScreenStrings[0], (220 - StringPixLength(pUpperLeftMapScreenStrings[0], CHAR_FONT()) / 2), 6, CHAR_FONT());

  // vehicles and robot don't have attributes, contracts, or morale
  if ((pSoldier == null) || (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier))) {
    // health
    DrawString(pUpperLeftMapScreenStrings[2], 87, 80, CHAR_FONT());

    for (iCounter = 0; iCounter < 5; iCounter++) {
      DrawString(pShortAttributeStrings[iCounter], 88, (22 + iCounter * 10), CHAR_FONT());
      DrawString(pShortAttributeStrings[iCounter + 5], 133, (22 + iCounter * 10), CHAR_FONT());
    }

    // contract
    // DrawString(pUpperLeftMapScreenStrings[ 1 ], 194, 52,  CHAR_FONT);

    // morale
    DrawString(pUpperLeftMapScreenStrings[3], 87, 94, CHAR_FONT());
  } else {
    // condition
    DrawString(pUpperLeftMapScreenStrings[4], 96, 80, CHAR_FONT());
  }

  // restore buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
}

function DisplayThePotentialPathForCurrentDestinationCharacterForMapScreenInterface(sMapX: INT16, sMapY: INT16): void {
  // simply check if we want to refresh the screen to display path
  /* static */ let bOldDestChar: INT8 = -1;
  /* static */ let sPrevMapX: INT16;
  /* static */ let sPrevMapY: INT16;
  let iDifference: INT32 = 0;

  if (bOldDestChar != bSelectedDestChar) {
    bOldDestChar = bSelectedDestChar;
    giPotCharPathBaseTime = GetJA2Clock();

    sPrevMapX = sMapX;
    sPrevMapY = sMapY;
    fTempPathAlreadyDrawn = false;
    fDrawTempPath = false;
  }

  if ((sMapX != sPrevMapX) || (sMapY != sPrevMapY)) {
    giPotCharPathBaseTime = GetJA2Clock();

    sPrevMapX = sMapX;
    sPrevMapY = sMapY;

    // path was plotted and we moved, re draw map..to clean up mess
    if (fTempPathAlreadyDrawn == true) {
      fMapPanelDirty = true;
    }

    fTempPathAlreadyDrawn = false;
    fDrawTempPath = false;
  }

  iDifference = GetJA2Clock() - giPotCharPathBaseTime;

  if (fTempPathAlreadyDrawn == true) {
    return;
  }

  if (iDifference > MIN_WAIT_TIME_FOR_TEMP_PATH) {
    fDrawTempPath = true;
    giPotCharPathBaseTime = GetJA2Clock();
    fTempPathAlreadyDrawn = true;
  }

  return;
}

export function SetUpCursorForStrategicMap(): void {
  if (gfInChangeArrivalSectorMode == false) {
    // check if character is in destination plotting mode
    if (fPlotForHelicopter == false) {
      if (bSelectedDestChar == -1) {
        // no plot mode, reset cursor to normal
        ChangeMapScreenMaskCursor(Enum317.CURSOR_NORMAL);
      } else // yes - by character
      {
        // set cursor based on foot or vehicle
        if ((Menptr[gCharactersList[bSelectedDestChar].usSolID].bAssignment != Enum117.VEHICLE) && !(Menptr[gCharactersList[bSelectedDestChar].usSolID].uiStatusFlags & SOLDIER_VEHICLE)) {
          ChangeMapScreenMaskCursor(Enum317.CURSOR_STRATEGIC_FOOT);
        } else {
          ChangeMapScreenMaskCursor(Enum317.CURSOR_STRATEGIC_VEHICLE);
        }
      }
    } else // yes - by helicopter
    {
      // set cursor to chopper
      ChangeMapScreenMaskCursor(Enum317.CURSOR_CHOPPER);
    }
  } else {
    // set cursor to bullseye
    ChangeMapScreenMaskCursor(Enum317.CURSOR_STRATEGIC_BULLSEYE);
  }
}

function HandleAnimatedCursorsForMapScreen(): void {
  if (COUNTERDONE(Enum386.CURSORCOUNTER)) {
    RESETCOUNTER(Enum386.CURSORCOUNTER);
    UpdateAnimatedCursorFrames(gMapScreenMaskRegion.Cursor);
    SetCurrentCursorFromDatabase(gMapScreenMaskRegion.Cursor);
  }
}

export function AbortMovementPlottingMode(): void {
  // invalid if we're not plotting movement
  Assert((bSelectedDestChar != -1) || (fPlotForHelicopter == true));

  // make everybody go back to where they were going before this plotting session started
  RestorePreviousPaths();

  // don't need the previous paths any more
  ClearPreviousPaths();

  // clear the character's temporary path (this is the route being constantly updated on the map)
  if (pTempCharacterPath) {
    // make sure we're at the beginning
    pTempCharacterPath = MoveToBeginningOfPathList(pTempCharacterPath);
    pTempCharacterPath = ClearStrategicPathList(pTempCharacterPath, 0);
  }

  // clear the helicopter's temporary path (this is the route being constantly updated on the map)
  if (pTempHelicopterPath) {
    // make sure we're at the beginning
    pTempHelicopterPath = MoveToBeginningOfPathList(pTempHelicopterPath);
    pTempHelicopterPath = ClearStrategicPathList(pTempHelicopterPath, 0);
  }

  EndConfirmMapMoveMode();

  // cancel destination line highlight
  giDestHighLine = -1;

  // cancel movement mode
  bSelectedDestChar = -1;
  fPlotForHelicopter = false;

  // tell player the route was UNCHANGED
  MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[2]);

  // reset cursors
  ChangeMapScreenMaskCursor(Enum317.CURSOR_NORMAL);
  SetUpCursorForStrategicMap();

  // restore glow region
  RestoreBackgroundForDestinationGlowRegionList();

  // we might be on the map, redraw to remove old path stuff
  fMapPanelDirty = true;
  fTeamPanelDirty = true;

  gfRenderPBInterface = true;
}

function CheckToSeeIfMouseHasLeftMapRegionDuringPathPlotting(): void {
  /* static */ let fInArea: boolean = false;

  if ((gMapViewRegion.uiFlags & MSYS_MOUSE_IN_AREA) == 0) {
    if (fInArea == true) {
      fInArea = false;

      // plotting path, clean up
      if (((bSelectedDestChar != -1) || (fPlotForHelicopter == true) || (fDrawTempHeliPath == true)) && (fTempPathAlreadyDrawn == true)) {
        fDrawTempHeliPath = false;
        fMapPanelDirty = true;
        gfRenderPBInterface = true;

        // clear the temp path
        if (pTempCharacterPath) {
          pTempCharacterPath = ClearStrategicPathList(pTempCharacterPath, 0);
        }
      }

      // reset fact temp path has been drawn
      fTempPathAlreadyDrawn = false;
    }
  } else {
    fInArea = true;
  }

  return;
}

function BlitBackgroundToSaveBuffer(): void {
  let bTempDestChar: INT8 = -1;

  // render map
  RenderMapRegionBackground();

  if (fDisableDueToBattleRoster == false) {
    // render team
    RenderTeamRegionBackground();

    // render character info
    RenderCharacterInfoBackground();
  } else if (gfPreBattleInterfaceActive) {
    ForceButtonUnDirty(giMapContractButton);
    ForceButtonUnDirty(giCharInfoButton[0]);
    ForceButtonUnDirty(giCharInfoButton[1]);
    RenderPreBattleInterface();
  }

  // now render lower panel
  RenderMapScreenInterfaceBottom();
}

function CreateMouseRegionsForTeamList(): void {
  // will create mouse regions for assignments, path plotting, character info selection
  let sCounter: INT16 = 0;
  let sYAdd: INT16 = 0;

  // the info region...is the background for the list itself

  for (sCounter = 0; sCounter < MAX_CHARACTER_COUNT; sCounter++) {
    if (sCounter >= FIRST_VEHICLE) {
      sYAdd = 6;
    } else {
      sYAdd = 0;
    }

    // name region
    MSYS_DefineRegion(addressof(gTeamListNameRegion[sCounter]), NAME_X, (Y_START + (sCounter) * (Y_SIZE() + 2) + sYAdd), NAME_X + NAME_WIDTH, (145 + (sCounter + 1) * (Y_SIZE() + 2) + sYAdd), MSYS_PRIORITY_NORMAL, MSYS_NO_CURSOR, TeamListInfoRegionMvtCallBack, TeamListInfoRegionBtnCallBack);

    // assignment region
    MSYS_DefineRegion(addressof(gTeamListAssignmentRegion[sCounter]), ASSIGN_X, (Y_START + (sCounter) * (Y_SIZE() + 2) + sYAdd), ASSIGN_X + ASSIGN_WIDTH, (145 + (sCounter + 1) * (Y_SIZE() + 2) + sYAdd), MSYS_PRIORITY_NORMAL + 1, MSYS_NO_CURSOR, TeamListAssignmentRegionMvtCallBack, TeamListAssignmentRegionBtnCallBack);

    // location region (same function as name regions, so uses the same callbacks)
    MSYS_DefineRegion(addressof(gTeamListLocationRegion[sCounter]), LOC_X, (Y_START + (sCounter) * (Y_SIZE() + 2) + sYAdd), LOC_X + LOC_WIDTH, (145 + (sCounter + 1) * (Y_SIZE() + 2) + sYAdd), MSYS_PRIORITY_NORMAL + 1, MSYS_NO_CURSOR, TeamListInfoRegionMvtCallBack, TeamListInfoRegionBtnCallBack);

    // destination region
    MSYS_DefineRegion(addressof(gTeamListDestinationRegion[sCounter]), DEST_ETA_X, (Y_START + (sCounter) * (Y_SIZE() + 2) + sYAdd), DEST_ETA_X + DEST_ETA_WIDTH, (145 + (sCounter + 1) * (Y_SIZE() + 2) + sYAdd), MSYS_PRIORITY_NORMAL + 1, MSYS_NO_CURSOR, TeamListDestinationRegionMvtCallBack, TeamListDestinationRegionBtnCallBack);

    // contract region
    MSYS_DefineRegion(addressof(gTeamListContractRegion[sCounter]), TIME_REMAINING_X, (Y_START + (sCounter) * (Y_SIZE() + 2) + sYAdd), TIME_REMAINING_X + TIME_REMAINING_WIDTH, (145 + (sCounter + 1) * (Y_SIZE() + 2) + sYAdd), MSYS_PRIORITY_NORMAL + 1, MSYS_NO_CURSOR, TeamListContractRegionMvtCallBack, TeamListContractRegionBtnCallBack);

    // contract region
    MSYS_DefineRegion(addressof(gTeamListSleepRegion[sCounter]), SLEEP_X, (Y_START + (sCounter) * (Y_SIZE() + 2) + sYAdd), SLEEP_X + SLEEP_WIDTH, (145 + (sCounter + 1) * (Y_SIZE() + 2) + sYAdd), MSYS_PRIORITY_NORMAL + 1, MSYS_NO_CURSOR, TeamListSleepRegionMvtCallBack, TeamListSleepRegionBtnCallBack);

    MSYS_SetRegionUserData(addressof(gTeamListNameRegion[sCounter]), 0, sCounter);
    MSYS_SetRegionUserData(addressof(gTeamListAssignmentRegion[sCounter]), 0, sCounter);
    MSYS_SetRegionUserData(addressof(gTeamListSleepRegion[sCounter]), 0, sCounter);
    MSYS_SetRegionUserData(addressof(gTeamListLocationRegion[sCounter]), 0, sCounter);
    MSYS_SetRegionUserData(addressof(gTeamListDestinationRegion[sCounter]), 0, sCounter);
    MSYS_SetRegionUserData(addressof(gTeamListContractRegion[sCounter]), 0, sCounter);

    // set up help boxes
    SetRegionFastHelpText(addressof(gTeamListNameRegion[sCounter]), pMapScreenMouseRegionHelpText[0]);
    SetRegionFastHelpText(addressof(gTeamListAssignmentRegion[sCounter]), pMapScreenMouseRegionHelpText[1]);
    SetRegionFastHelpText(addressof(gTeamListSleepRegion[sCounter]), pMapScreenMouseRegionHelpText[5]);
    SetRegionFastHelpText(addressof(gTeamListLocationRegion[sCounter]), pMapScreenMouseRegionHelpText[0]);
    SetRegionFastHelpText(addressof(gTeamListDestinationRegion[sCounter]), pMapScreenMouseRegionHelpText[2]);
    SetRegionFastHelpText(addressof(gTeamListContractRegion[sCounter]), pMapScreenMouseRegionHelpText[3]);
  }

  return;
}

function DestroyMouseRegionsForTeamList(): void {
  // will destroy mouse regions overlaying the team list area
  let sCounter: INT32 = 0;

  for (sCounter = 0; sCounter < MAX_CHARACTER_COUNT; sCounter++) {
    MSYS_RemoveRegion(addressof(gTeamListNameRegion[sCounter]));
    MSYS_RemoveRegion(addressof(gTeamListAssignmentRegion[sCounter]));
    MSYS_RemoveRegion(addressof(gTeamListSleepRegion[sCounter]));
    MSYS_RemoveRegion(addressof(gTeamListDestinationRegion[sCounter]));
    MSYS_RemoveRegion(addressof(gTeamListLocationRegion[sCounter]));
    MSYS_RemoveRegion(addressof(gTeamListContractRegion[sCounter]));
  }
}

// mask for mapscreen region
function MapScreenMarkRegionBtnCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function ContractButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if ((iDialogueBox != -1)) {
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }

    /*
                    if( ( bSelectedDestChar != -1 ) || ( fPlotForHelicopter == TRUE ) )
                    {
                            AbortMovementPlottingMode( );
                            return;
                    }
    */

    // redraw region
    if (btn.value.Area.uiFlags & MSYS_HAS_BACKRECT) {
      fCharacterInfoPanelDirty = true;
    }

    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      RequestContractMenu();
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }
  }
}

function TeamListInfoRegionBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // set to new info character...make sure is valid
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if (gCharactersList[iValue].fValid == true) {
      if (HandleCtrlOrShiftInTeamPanel(iValue)) {
        return;
      }

      ChangeSelectedInfoChar(iValue, true);

      pSoldier = addressof(Menptr[gCharactersList[iValue].usSolID]);

      // highlight
      giDestHighLine = -1;

      // reset character
      bSelectedAssignChar = -1;
      bSelectedDestChar = -1;
      bSelectedContractChar = -1;
      fPlotForHelicopter = false;

      // if not dead or POW, select his sector
      if ((pSoldier.value.bLife > 0) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW)) {
        ChangeSelectedMapSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
      }

      // unhilight contract line
      giContractHighLine = -1;

      // can't assign highlight line
      giAssignHighLine = -1;

      // dirty team and map regions
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      // fMapScreenBottomDirty = TRUE;
      gfRenderPBInterface = true;
    } else {
      // reset selected characters
      ResetAllSelectedCharacterModes();
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if (gCharactersList[iValue].fValid == true) {
      pSoldier = addressof(Menptr[gCharactersList[iValue].usSolID]);

      // select this character
      ChangeSelectedInfoChar(iValue, true);

      RequestToggleMercInventoryPanel();

      // highlight
      giDestHighLine = -1;

      // reset character
      bSelectedAssignChar = -1;
      bSelectedDestChar = -1;
      bSelectedContractChar = -1;
      fPlotForHelicopter = false;

      // if not dead or POW, select his sector
      if ((pSoldier.value.bLife > 0) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW)) {
        ChangeSelectedMapSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
      }

      // unhilight contract line
      giContractHighLine = -1;

      // can't assign highlight line
      giAssignHighLine = -1;

      // dirty team and map regions
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      //			fMapScreenBottomDirty = TRUE;
      gfRenderPBInterface = true;
    }
  }
}

function TeamListInfoRegionMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    if (gCharactersList[iValue].fValid == true) {
      giHighLine = iValue;
    } else {
      giHighLine = -1;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    giHighLine = -1;
  }
}

function TeamListAssignmentRegionBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // set to new info character...make sure is valid
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if (gCharactersList[iValue].fValid == true) {
      if (HandleCtrlOrShiftInTeamPanel(iValue)) {
        return;
      }

      // reset list if the clicked character isn't also selected
      ChangeSelectedInfoChar(iValue, (IsEntryInSelectedListSet(iValue) == false));

      pSoldier = addressof(Menptr[gCharactersList[iValue].usSolID]);

      // if alive (dead guys keep going, use remove menu instead),
      // and it's between sectors and it can be reassigned (non-vehicles)
      if ((pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD) && (pSoldier.value.bLife > 0) && (pSoldier.value.fBetweenSectors) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
        // can't reassign mercs while between sectors
        DoScreenIndependantMessageBox(pMapErrorString[41], MSG_BOX_FLAG_OK, null);
        return;
      }

      bSelectedAssignChar = iValue;
      RebuildAssignmentsBox();

      // reset dest character
      bSelectedDestChar = -1;
      fPlotForHelicopter = false;

      // reset contract char
      bSelectedContractChar = -1;
      giContractHighLine = -1;

      // can't highlight line, anymore..if we were
      giDestHighLine = -1;

      // dirty team and map regions
      fTeamPanelDirty = true;
      fMapPanelDirty = true;
      gfRenderPBInterface = true;

      // if this thing can be re-assigned
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
        giAssignHighLine = iValue;

        fShowAssignmentMenu = true;

        if ((pSoldier.value.bLife == 0) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
          fShowRemoveMenu = true;
        }
      } else {
        // can't highlight line
        giAssignHighLine = -1;

        // we can't highlight this line
        //				giHighLine = -1;
      }
    } else {
      // reset selected characters
      ResetAllSelectedCharacterModes();
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function TeamListAssignmentRegionMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    if (gCharactersList[iValue].fValid == true) {
      giHighLine = iValue;

      if (!(Menptr[gCharactersList[iValue].usSolID].uiStatusFlags & SOLDIER_VEHICLE)) {
        giAssignHighLine = iValue;
      } else {
        giAssignHighLine = -1;
      }
    } else {
      // can't highlight line
      giHighLine = -1;
      giAssignHighLine = -1;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    giHighLine = -1;

    if (bSelectedAssignChar == -1) {
      giAssignHighLine = -1;
    }

    // restore background
    RestoreBackgroundForAssignmentGlowRegionList();
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if ((gCharactersList[iValue].fValid == true) && !(Menptr[gCharactersList[iValue].usSolID].uiStatusFlags & SOLDIER_VEHICLE)) {
      // play click
      PlayGlowRegionSound();
    }
  }
}

function TeamListDestinationRegionBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive || fShowMapInventoryPool) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if (gCharactersList[iValue].fValid == true) {
      if (HandleCtrlOrShiftInTeamPanel(iValue)) {
        return;
      }

      // reset list if the clicked character isn't also selected
      ChangeSelectedInfoChar(iValue, (IsEntryInSelectedListSet(iValue) == false));

      // deselect any characters/vehicles that can't accompany the clicked merc
      DeselectSelectedListMercsWhoCantMoveWithThisGuy(addressof(Menptr[gCharactersList[iValue].usSolID]));

      // select all characters/vehicles that MUST accompany the clicked merc (same squad/vehicle)
      SelectUnselectedMercsWhoMustMoveWithThisGuy();

      // Find out if this guy and everyone travelling with him is allowed to move strategically
      // NOTE: errors are reported within...
      if (CanChangeDestinationForCharSlot(iValue, true)) {
        // turn off sector inventory, turn on show teams filter, etc.
        MakeMapModesSuitableForDestPlotting(iValue);

        // check if person is in a vehicle
        if (Menptr[gCharactersList[iValue].usSolID].bAssignment == Enum117.VEHICLE) {
          // if he's in the helicopter
          if (Menptr[gCharactersList[iValue].usSolID].iVehicleId == iHelicopterVehicleId) {
            TurnOnAirSpaceMode();
            if (RequestGiveSkyriderNewDestination() == false) {
              // not allowed to change destination of the helicopter
              return;
            }
          }
        }

        // select this character as the one plotting strategic movement
        bSelectedDestChar = iValue;

        // remember the current paths for all selected characters so we can restore them if need be
        RememberPreviousPathForAllSelectedChars();

        // check each person in this mvt group, if any bleeding, have them complain
        // CheckMembersOfMvtGroupAndComplainAboutBleeding( &( Menptr[ gCharactersList[ bSelectedDestChar ].usSolID ] ) );

        // highlight
        giDestHighLine = iValue;

        // can't assign highlight line
        giAssignHighLine = -1;

        // reset assign character
        bSelectedAssignChar = -1;

        // reset contract char
        bSelectedContractChar = -1;
        giContractHighLine = -1;

        // dirty team and map regions
        fTeamPanelDirty = true;
        fMapPanelDirty = true;
        gfRenderPBInterface = true;

        // set cursor
        SetUpCursorForStrategicMap();
      } else // problem - this guy can't move
      {
        // cancel destination highlight
        giDestHighLine = -1;
      }
    } else // empty char list slot
    {
      // reset selected characters
      ResetAllSelectedCharacterModes();
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    MakeMapModesSuitableForDestPlotting(iValue);

    // reset list if the clicked character isn't also selected
    ChangeSelectedInfoChar(iValue, (IsEntryInSelectedListSet(iValue) == false));

    CancelPathsOfAllSelectedCharacters();

    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function TeamListDestinationRegionMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = -1;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    if (gCharactersList[iValue].fValid == true) {
      giHighLine = iValue;
      giDestHighLine = iValue;
    } else {
      // can't highlight line
      giHighLine = -1;
      giDestHighLine = -1;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    giHighLine = -1;

    if (bSelectedDestChar == -1) {
      giDestHighLine = -1;
    }

    // restore background
    RestoreBackgroundForDestinationGlowRegionList();
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (gCharactersList[iValue].fValid == true) {
      // play click
      PlayGlowRegionSound();
    }
  }
}

function TeamListSleepRegionBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // set to new info character...make sure is valid.. not in transit and alive and concious

    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if ((gCharactersList[iValue].fValid == true)) {
      if (HandleCtrlOrShiftInTeamPanel(iValue)) {
        return;
      }

      // reset list if the clicked character isn't also selected
      ChangeSelectedInfoChar(iValue, (IsEntryInSelectedListSet(iValue) == false));

      // if this slot's sleep status can be changed
      if (CanChangeSleepStatusForCharSlot(iValue)) {
        pSoldier = addressof(Menptr[gCharactersList[iValue].usSolID]);

        if (pSoldier.value.fMercAsleep == true) {
          // try to wake him up
          if (SetMercAwake(pSoldier, true, false)) {
            // propagate
            HandleSelectedMercsBeingPutAsleep(true, true);
            return;
          } else {
            HandleSelectedMercsBeingPutAsleep(true, false);
          }
        } else // awake
        {
          // try to put him to sleep
          if (SetMercAsleep(pSoldier, true)) {
            // propagate
            HandleSelectedMercsBeingPutAsleep(false, true);
            return;
          } else {
            HandleSelectedMercsBeingPutAsleep(false, false);
          }
        }
      }
    } else {
      // reset selected characters
      ResetAllSelectedCharacterModes();
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function TeamListSleepRegionMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = -1;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    if (gCharactersList[iValue].fValid == true) {
      giHighLine = iValue;

      if (CanChangeSleepStatusForCharSlot(iValue)) {
        giSleepHighLine = iValue;
      } else {
        giSleepHighLine = -1;
      }
    } else {
      // can't highlight line
      giHighLine = -1;
      giSleepHighLine = -1;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    giHighLine = -1;
    giSleepHighLine = -1;

    // restore background
    RestoreBackgroundForSleepGlowRegionList();
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (CanChangeSleepStatusForCharSlot(iValue)) {
      // play click
      PlayGlowRegionSound();
    }
  }
}

function TeamListContractRegionBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (gCharactersList[iValue].fValid == true) {
    if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // select ONLY this dude
      ChangeSelectedInfoChar(iValue, true);

      // reset character
      giDestHighLine = -1;
      bSelectedAssignChar = -1;
      bSelectedDestChar = -1;
      bSelectedContractChar = -1;
      fPlotForHelicopter = false;

      fTeamPanelDirty = true;
    }

    ContractRegionBtnCallback(pRegion, iReason);
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function TeamListContractRegionMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = -1;

  if (fLockOutMapScreenInterface || gfPreBattleInterfaceActive) {
    return;
  }

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    if (gCharactersList[iValue].fValid == true) {
      giHighLine = iValue;

      if (CanExtendContractForCharSlot(iValue)) {
        giContractHighLine = iValue;
      } else {
        giContractHighLine = -1;
      }
    } else {
      // can't highlight line
      giHighLine = -1;
      giContractHighLine = -1;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    giHighLine = -1;

    // no longer valid char?...reset display of highlight boxes
    if (fShowContractMenu == false) {
      giContractHighLine = -1;
    }

    // restore background
    RestoreBackgroundForContractGlowRegionList();
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (CanExtendContractForCharSlot(iValue)) {
      // play click
      PlayGlowRegionSound();
    }
  }
}

function GetIndexForThisSoldier(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iLastGuy: INT32;
  let iIndex: INT32 = 0;
  let iCounter: INT32 = 0;

  // get the index into the characters list for this soldier type
  iLastGuy = gTacticalStatus.Team[OUR_TEAM].bLastID;

  for (iCounter = 0; iCounter < iLastGuy; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      if ((addressof(Menptr[gCharactersList[iCounter].usSolID])) == pSoldier) {
        iIndex = iCounter;
        iCounter = iLastGuy;
      }
    }
  }
  return iIndex;
}

function IsCursorWithInRegion(sLeft: INT16, sRight: INT16, sTop: INT16, sBottom: INT16): boolean {
  let MousePos: POINT;

  // get cursor position
  GetCursorPos(addressof(MousePos));

  // is it within region?

  if ((sLeft < MousePos.x) && (sRight > MousePos.x) && (sTop < MousePos.y) && (sBottom > MousePos.y)) {
    return true;
  } else {
    return false;
  }
}

function HandleHighLightingOfLinesInTeamPanel(): void {
  if (fShowInventoryFlag) {
    return;
  }

  // will highlight or restore backgrounds to highlighted lines

  // restore backgrounds, if need be
  RestoreBackgroundForAssignmentGlowRegionList();
  RestoreBackgroundForDestinationGlowRegionList();
  RestoreBackgroundForContractGlowRegionList();
  RestoreBackgroundForSleepGlowRegionList();

  HighLightAssignLine(giAssignHighLine);
  HighLightDestLine(giDestHighLine);
  HighLightSleepLine(giSleepHighLine);

  // contracts?
  if (giContractHighLine != -1) {
    ContractListRegionBoxGlow(giContractHighLine);
  }
}

function PlotPermanentPaths(): void {
  if (fPlotForHelicopter == true) {
    DisplayHelicopterPath();
  } else if (bSelectedDestChar != -1) {
    DisplaySoldierPath(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]));
  }
}

function PlotTemporaryPaths(): void {
  let sMapX: INT16;
  let sMapY: INT16;

  // check to see if we have in fact moved are are plotting a path?
  if (GetMouseMapXY(addressof(sMapX), addressof(sMapY))) {
    if (fPlotForHelicopter == true) {
      Assert(fShowAircraftFlag == true);
      /*
                              if( fZoomFlag )
                              {
                                      sMapX =  ( INT16 )( ( ( iZoomX ) / ( WORLD_MAP_X ) ) + sMapX );
                                      sMapX /= 2;

                                      sMapY =  ( INT16 )( ( ( iZoomY ) / ( WORLD_MAP_X ) ) + sMapY );
                                      sMapY /= 2;
                              }
      */

      // plot temp path
      PlotATemporaryPathForHelicopter(sMapX, sMapY);

      // check if potential path is allowed
      DisplayThePotentialPathForHelicopter(sMapX, sMapY);

      if (fDrawTempHeliPath == true) {
        // clip region
        ClipBlitsToMapViewRegion();
        // display heli temp path
        DisplayHelicopterTempPath();
        // restore
        RestoreClipRegionToFullScreen();
      }
    } else
        // dest char has been selected,
        if (bSelectedDestChar != -1) {
      /*
                              if( fZoomFlag )
                              {
                                      sMapX =  ( INT16 )( ( ( iZoomX ) / ( MAP_GRID_X ) ) + sMapX );
                                      sMapX /= 2;

                                      sMapY =  ( INT16 )( ( ( iZoomY ) / ( MAP_GRID_Y ) ) + sMapY );
                                      sMapY /= 2;
                              }
      */

      PlotATemporaryPathForCharacter(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]), sMapX, sMapY);

      // check to see if we are drawing path
      DisplayThePotentialPathForCurrentDestinationCharacterForMapScreenInterface(sMapX, sMapY);

      // if we need to draw path, do it
      if (fDrawTempPath == true) {
        // clip region
        ClipBlitsToMapViewRegion();
        // blit
        DisplaySoldierTempPath(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]));
        // restore
        RestoreClipRegionToFullScreen();
      }
    }
  }
}

export function RenderMapRegionBackground(): void {
  // renders to save buffer when dirty flag set

  if (fMapPanelDirty == false) {
    gfMapPanelWasRedrawn = false;

    // not dirty, leave
    return;
  }

  // don't bother if showing sector inventory instead of the map!!!
  if (!fShowMapInventoryPool) {
    // draw map
    DrawMap();
  }

  // blit in border
  RenderMapBorder();

  if (ghAttributeBox != -1) {
    ForceUpDateOfBox(ghAttributeBox);
  }

  if (ghTownMineBox != -1) {
    // force update of town mine info boxes
    ForceUpDateOfBox(ghTownMineBox);
  }

  MapscreenMarkButtonsDirty();

  RestoreExternBackgroundRect(261, 0, 640 - 261, 359);

  // don't bother if showing sector inventory instead of the map!!!
  if (!fShowMapInventoryPool) {
    // if Skyrider can and wants to talk to us
    if (IsHelicopterPilotAvailable()) {
      // see if Skyrider has anything new to tell us
      CheckAndHandleSkyriderMonologues();
    }
  }

  // reset dirty flag
  fMapPanelDirty = false;

  gfMapPanelWasRedrawn = true;

  return;
}

function RenderTeamRegionBackground(): void {
  let hHandle: HVOBJECT;

  // renders to save buffer when dirty flag set
  if (fTeamPanelDirty == false) {
    // not dirty, leave
    return;
  }

  // show inventory or the team list?
  if (fShowInventoryFlag == false) {
    GetVideoObject(addressof(hHandle), guiCHARLIST);
    BltVideoObject(guiSAVEBUFFER, hHandle, 0, PLAYER_INFO_X, PLAYER_INFO_Y, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    BltCharInvPanel();
  }

  if (!fShowInventoryFlag) {
    // if we are not in inventory mode, show character list
    HandleHighLightingOfLinesInTeamPanel();

    DisplayCharacterList();
  }

  fDrawCharacterList = false;

  // display arrows by selected people
  HandleDisplayOfSelectedMercArrows();
  DisplayIconsForMercsAsleep();

  // reset dirty flag
  fTeamPanelDirty = false;
  gfRenderPBInterface = true;

  // mark all pop ups as dirty
  MarkAllBoxesAsAltered();

  // restore background for area
  RestoreExternBackgroundRect(0, 107, 261 - 0, 359 - 107);

  MapscreenMarkButtonsDirty();

  return;
}

function RenderCharacterInfoBackground(): void {
  let hHandle: HVOBJECT;

  // will render the background for the character info panel

  if (fCharacterInfoPanelDirty == false) {
    // not dirty, leave
    return;
  }

  // the upleft hand corner character info panel
  GetVideoObject(addressof(hHandle), guiCHARINFO);
  BltVideoObject(guiSAVEBUFFER, hHandle, 0, TOWN_INFO_X, TOWN_INFO_Y, VO_BLT_SRCTRANSPARENCY, null);

  UpdateHelpTextForMapScreenMercIcons();

  if ((bSelectedInfoChar != -1) && (fDisableDueToBattleRoster == false)) {
    // valid char to display
    DisplayCharacterInfo();
  }

  if ((fDisableDueToBattleRoster == false)) {
    // draw attributes
    RenderAttributeStringsForUpperLeftHandCorner(guiSAVEBUFFER);
  }

  // reset dirty flag
  fCharacterInfoPanelDirty = false;

  // redraw face
  fReDrawFace = true;

  MapscreenMarkButtonsDirty();

  // mark all pop ups as dirty
  MarkAllBoxesAsAltered();

  // restore background for area
  RestoreExternBackgroundRect(0, 0, 261, 107);
}

function DetermineIfContractMenuCanBeShown(): void {
  if (fShowContractMenu == false) {
    // destroy menus for contract region
    CreateDestroyMouseRegionsForContractMenu();

    // hide all boxes
    HideBox(ghContractBox);

    // make sure, absolutly sure we want to hide this box
    if (fShowAssignmentMenu == false) {
      HideBox(ghRemoveMercAssignBox);
    }

    return;
  }

  // create mask, if needed
  CreateDestroyScreenMaskForAssignmentAndContractMenus();

  // create mouse regions for contract region
  CreateDestroyMouseRegionsForContractMenu();

  // determine which lines selectable
  HandleShadingOfLinesForContractMenu();

  if (Menptr[gCharactersList[bSelectedInfoChar].usSolID].bLife == 0) {
    // show basic assignment menu
    ShowBox(ghRemoveMercAssignBox);
  } else {
    // show basic contract menu
    ShowBox(ghContractBox);
  }
}

function CheckIfPlottingForCharacterWhileAirCraft(): void {
  // if we are in aircraft mode and plotting for character, reset plotting character

  if (fShowAircraftFlag == true) {
    // if plotting, but not for heli
    if ((bSelectedDestChar != -1) && (fPlotForHelicopter == false)) {
      // abort
      AbortMovementPlottingMode();
    }
  } else // not in airspace mode
  {
    if (fPlotForHelicopter == true) {
      // abort
      AbortMovementPlottingMode();
    }
  }
}

function ContractRegionBtnCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // btn callback handler for contract region

  if ((iDialogueBox != -1)) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if (CanExtendContractForCharSlot(bSelectedInfoChar)) {
      pSoldier = MercPtrs[gCharactersList[bSelectedInfoChar].usSolID];

      // create
      RebuildContractBoxForMerc(pSoldier);

      // reset selected characters
      ResetAllSelectedCharacterModes();

      bSelectedContractChar = bSelectedInfoChar;
      giContractHighLine = bSelectedContractChar;

      // if not triggered internally
      if (CheckIfSalaryIncreasedAndSayQuote(pSoldier, true) == false) {
        // show contract box
        fShowContractMenu = true;

        // stop any active dialogue
        StopAnyCurrentlyTalkingSpeech();
      }

      // fCharacterInfoPanelDirty = TRUE;
    } else {
      // reset selected characters
      ResetAllSelectedCharacterModes();
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function ContractRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // mvt callback handler for contract region
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    if (fGlowContractRegion == true) {
      // not showing box and lost mouse?..stop glowing
      if (fShowContractMenu == false) {
        fGlowContractRegion = false;
        fCharacterInfoPanelDirty = true;
        giContractHighLine = -1;

        // reset glow
        fResetContractGlow = true;
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (bSelectedInfoChar != -1) {
      if (gCharactersList[bSelectedInfoChar].fValid == true) {
        if (fShowContractMenu == false) {
          // glow region
          fGlowContractRegion = true;

          giContractHighLine = bSelectedInfoChar;

          PlayGlowRegionSound();
        }
      }
    }
  }
}

function HandleShadingOfLinesForContractMenu(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pProfile: Pointer<MERCPROFILESTRUCT>;

  if ((fShowContractMenu == false) || (ghContractBox == -1)) {
    return;
  }

  // error check, return if not a valid character
  if (bSelectedContractChar == -1) {
    return;
  }

  // check if this character is a valid character
  if (gCharactersList[bSelectedContractChar].fValid == false) {
    return;
  }

  Assert(CanExtendContractForCharSlot(bSelectedContractChar));

  // grab the character
  pSoldier = addressof(Menptr[gCharactersList[bSelectedContractChar].usSolID]);

  // is guy in AIM? and well enough to talk and make such decisions?
  if ((pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) && (pSoldier.value.bLife >= OKLIFE)) {
    pProfile = addressof(gMercProfiles[pSoldier.value.ubProfile]);

    // one day
    if (pProfile.value.sSalary > LaptopSaveInfo.iCurrentBalance) {
      ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_DAY);
    } else {
      UnShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_DAY);
    }

    // one week
    if ((pProfile.value.uiWeeklySalary) > LaptopSaveInfo.iCurrentBalance) {
      ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_WEEK);
    } else {
      UnShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_WEEK);
    }

    // two weeks
    if ((pProfile.value.uiBiWeeklySalary) > LaptopSaveInfo.iCurrentBalance) {
      ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_TWO_WEEKS);
    } else {
      UnShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_TWO_WEEKS);
    }
  } else {
    // can't extend contract duration
    ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_DAY);
    ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_WEEK);
    ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_TWO_WEEKS);
  }

  // if THIS soldier is involved in a fight (dismissing in a hostile sector IS ok...)
  if ((gTacticalStatus.uiFlags & INCOMBAT) && pSoldier.value.bInSector) {
    ShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_TERMINATE);
  } else {
    UnShadeStringInBox(ghContractBox, Enum152.CONTRACT_MENU_TERMINATE);
  }
}

export function ReBuildCharactersList(): void {
  // rebuild character's list
  let sCount: INT16 = 0;

  // add in characters
  for (sCount = 0; sCount < MAX_CHARACTER_COUNT; sCount++) {
    // clear this slot
    gCharactersList[sCount].fValid = false;
    gCharactersList[sCount].usSolID = 0;
  }

  for (sCount = 0; sCount < MAX_CHARACTER_COUNT; sCount++) {
    // add character into the cleared slot
    AddCharacter(addressof(Menptr[gTacticalStatus.Team[OUR_TEAM].bFirstID + sCount]));
  }

  // sort them according to current sorting method
  SortListOfMercsInTeamPanel(false);

  // if nobody is selected, or the selected merc has somehow become invalid
  if ((bSelectedInfoChar == -1) || (!gCharactersList[bSelectedInfoChar].fValid)) {
    // is the first character in the list valid?
    if (gCharactersList[0].fValid) {
      // select him
      ChangeSelectedInfoChar(0, true);
    } else {
      // select no one
      ChangeSelectedInfoChar(-1, true);
    }
  }

  // exit inventory mode
  fShowInventoryFlag = false;
  // switch hand region help text to "Enter Inventory"
  SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[0]);
}

function HandleChangeOfInfoChar(): void {
  /* static */ let bOldInfoChar: INT8 = -1;

  if (bSelectedInfoChar != bOldInfoChar) {
    // set auto faces inactive

    // valid character?
    if (bOldInfoChar != -1) {
      if (gCharactersList[bOldInfoChar].fValid == true) {
        // set face in active
        SetAutoFaceInActiveFromSoldier(Menptr[gCharactersList[bOldInfoChar].usSolID].ubID);
      }
    }

    // stop showing contract box
    // fShowContractMenu = FALSE;

    // update old info char value
    bOldInfoChar = bSelectedInfoChar;
  }
}

export function RebuildContractBoxForMerc(pCharacter: Pointer<SOLDIERTYPE>): void {
  // rebuild contractbox for this merc
  RemoveBox(ghContractBox);
  ghContractBox = -1;

  // recreate
  CreateContractBox(pCharacter);

  return;
}

function TestMessageSystem(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 300; iCounter++) {
    MapScreenMessage(FONT_MCOLOR_DKRED, MSG_INTERFACE, "%d", iCounter);
  }
  MapScreenMessage(FONT_MCOLOR_DKRED, MSG_INTERFACE, "%d", iCounter);

  return;
}

function EnableDisableTeamListRegionsAndHelpText(): void {
  // check if valid character here, if so, then do nothing..other wise set help text timer to a gazillion
  let bCharNum: INT8;

  for (bCharNum = 0; bCharNum < MAX_CHARACTER_COUNT; bCharNum++) {
    if (gCharactersList[bCharNum].fValid == false) {
      // disable regions in all team list columns
      MSYS_DisableRegion(addressof(gTeamListNameRegion[bCharNum]));
      MSYS_DisableRegion(addressof(gTeamListAssignmentRegion[bCharNum]));
      MSYS_DisableRegion(addressof(gTeamListLocationRegion[bCharNum]));
      MSYS_DisableRegion(addressof(gTeamListSleepRegion[bCharNum]));
      MSYS_DisableRegion(addressof(gTeamListDestinationRegion[bCharNum]));
      MSYS_DisableRegion(addressof(gTeamListContractRegion[bCharNum]));
    } else {
      // always enable Name and Location regions
      MSYS_EnableRegion(addressof(gTeamListNameRegion[bCharNum]));
      MSYS_EnableRegion(addressof(gTeamListLocationRegion[bCharNum]));

      // valid character.  If it's a vehicle, however
      if (Menptr[gCharactersList[bCharNum].usSolID].uiStatusFlags & SOLDIER_VEHICLE) {
        // Can't change assignment for vehicles
        MSYS_DisableRegion(addressof(gTeamListAssignmentRegion[bCharNum]));
      } else {
        MSYS_EnableRegion(addressof(gTeamListAssignmentRegion[bCharNum]));

        // POW or dead ?
        if ((Menptr[gCharactersList[bCharNum].usSolID].bAssignment == Enum117.ASSIGNMENT_POW) || (Menptr[gCharactersList[bCharNum].usSolID].bLife == 0)) {
          // "Remove Merc"
          SetRegionFastHelpText(addressof(gTeamListAssignmentRegion[bCharNum]), pRemoveMercStrings[0]);

          SetRegionFastHelpText(addressof(gTeamListDestinationRegion[bCharNum]), "");
        } else {
          // "Assign Merc"
          SetRegionFastHelpText(addressof(gTeamListAssignmentRegion[bCharNum]), pMapScreenMouseRegionHelpText[1]);
          // "Plot Travel Route"
          SetRegionFastHelpText(addressof(gTeamListDestinationRegion[bCharNum]), pMapScreenMouseRegionHelpText[2]);
        }
      }

      if (CanExtendContractForCharSlot(bCharNum)) {
        MSYS_EnableRegion(addressof(gTeamListContractRegion[bCharNum]));
      } else {
        MSYS_DisableRegion(addressof(gTeamListContractRegion[bCharNum]));
      }

      if (CanChangeSleepStatusForCharSlot(bCharNum)) {
        MSYS_EnableRegion(addressof(gTeamListSleepRegion[bCharNum]));
      } else {
        MSYS_DisableRegion(addressof(gTeamListSleepRegion[bCharNum]));
      }

      // destination region is always enabled for all valid character slots.
      // if the character can't move at this time, then the region handler must be able to tell the player why not
      MSYS_EnableRegion(addressof(gTeamListDestinationRegion[bCharNum]));
    }
  }
}

function ResetAllSelectedCharacterModes(): void {
  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
    return;
  }

  // if in militia redistribution popup
  if (sSelectedMilitiaTown != 0) {
    sSelectedMilitiaTown = 0;
  }

  // cancel destination line highlight
  giDestHighLine = -1;

  // cancel assign line highlight
  giAssignHighLine = -1;

  // unhilight contract line
  giContractHighLine = -1;

  // if we were plotting movement
  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  // reset assign character
  bSelectedAssignChar = -1;

  // reset contract character
  bSelectedContractChar = -1;

  // reset map cursor to normal
  if (!gfFadeOutDone && !gfFadeIn) {
    SetUpCursorForStrategicMap();
  }

  return;
}

function UpdatePausedStatesDueToTimeCompression(): void {
  // this executes every frame, so keep it optimized for speed!

  // if time is being compressed
  if (IsTimeBeingCompressed()) {
    // but it shouldn't be
    if (!AllowedToTimeCompress()) {
      // pause game to (temporarily) stop time compression
      PauseGame();
    }
  } else // time is NOT being compressed
  {
    // but the player would like it to be compressing
    if (IsTimeCompressionOn() && !gfPauseDueToPlayerGamePause) {
      // so check if it's legal to start time compressing again
      if (AllowedToTimeCompress()) {
        // unpause game to restart time compresssion
        UnPauseGame();
      }
    }
  }

  return;
}

export function ContinueDialogue(pSoldier: Pointer<SOLDIERTYPE>, fDone: boolean): boolean {
  // continue this grunts dialogue, restore when done
  /* static */ let bOldSelectedInfoChar: INT8 = -1;
  /* static */ let fTalkingingGuy: boolean = false;

  let bCounter: INT8 = 0;

  if (fDone == true) {
    if (fTalkingingGuy == true) {
      /*
      // done, restore
      if( bOldSelectedInfoChar != -1 )
      {
              ChangeSelectedInfoChar( bOldSelectedInfoChar, TRUE );

              SetAutoFaceInActive( MercPtrs[ gCharactersList[ bSelectedInfoChar ].usSolID ]->iFaceIndex );
      }

*/
      fCharacterInfoPanelDirty = true;
      fTalkingingGuy = false;
    }

    return true;
  }

  // check if valid character talking?
  if (pSoldier == null) {
    return false;
  }

  // otherwise, find this character
  for (bCounter = 0; bCounter < MAX_CHARACTER_COUNT; bCounter++) {
    if (gCharactersList[bCounter].fValid == true) {
      if ((addressof(Menptr[gCharactersList[bCounter].usSolID])) == pSoldier) {
        if (bSelectedInfoChar != bCounter) {
          bOldSelectedInfoChar = bSelectedInfoChar;
          ChangeSelectedInfoChar(bCounter, true);
        }
        fTalkingingGuy = true;
        return false;
      }
    }
  }

  return false;
}

function HandleSpontanousTalking(): void {
  // simply polls if the talking guy is done, if so...send an end command to continue dialogue

  if (DialogueActive() == false) {
    if ((bSelectedInfoChar != -1) && (bSelectedInfoChar < MAX_CHARACTER_COUNT)) {
      ContinueDialogue((addressof(Menptr[gCharactersList[bSelectedInfoChar].usSolID])), true);
    }
  }

  return;
}

function CheckIfClickOnLastSectorInPath(sX: INT16, sY: INT16): boolean {
  let ppMovePath: Pointer<PathStPtr> = null;
  let fLastSectorInPath: boolean = false;
  let iVehicleId: INT32 = -1;
  let pPreviousMercPath: PathStPtr = null;

  // see if we have clicked on the last sector in the characters path

  // check if helicopter
  if (fPlotForHelicopter == true) {
    if (sX + (sY * MAP_WORLD_X) == GetLastSectorOfHelicoptersPath()) {
      // helicopter route confirmed - take off
      TakeOffHelicopter();

      // rebuild waypoints - helicopter
      ppMovePath = addressof(pVehicleList[iHelicopterVehicleId].pMercPath);
      RebuildWayPointsForGroupPath(ppMovePath.value, pVehicleList[iHelicopterVehicleId].ubMovementGroup);

      // pointer to previous helicopter path
      pPreviousMercPath = gpHelicopterPreviousMercPath;

      fLastSectorInPath = true;
    }
  } else // not doing helicopter movement
  {
    // if not doing a soldier either, we shouldn't be here!
    if (bSelectedDestChar == -1) {
      return false;
    }

    // invalid soldier?  we shouldn't be here!
    if (gCharactersList[bSelectedDestChar].fValid == false) {
      bSelectedDestChar = -1;
      return false;
    }

    if (sX + (sY * MAP_WORLD_X) == GetLastSectorIdInCharactersPath((addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID])))) {
      // clicked on last sector, reset plotting mode

      // if he's IN a vehicle or IS a vehicle
      if ((Menptr[gCharactersList[bSelectedDestChar].usSolID].bAssignment == Enum117.VEHICLE) || (Menptr[gCharactersList[bSelectedDestChar].usSolID].uiStatusFlags & SOLDIER_VEHICLE)) {
        if (Menptr[gCharactersList[bSelectedDestChar].usSolID].bAssignment == Enum117.VEHICLE) {
          // IN a vehicle
          iVehicleId = Menptr[gCharactersList[bSelectedDestChar].usSolID].iVehicleId;
        } else {
          // IS a vehicle
          iVehicleId = Menptr[gCharactersList[bSelectedDestChar].usSolID].bVehicleID;
        }

        // rebuild waypoints - vehicles
        ppMovePath = addressof(pVehicleList[iVehicleId].pMercPath);
      } else {
        // rebuild waypoints - mercs on foot
        ppMovePath = addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID].pMercPath);
      }

      RebuildWayPointsForAllSelectedCharsGroups();

      // pointer to previous character path
      pPreviousMercPath = gpCharacterPreviousMercPath[bSelectedDestChar];

      fLastSectorInPath = true;
    }
  }

  // if the click was over the last sector
  if (fLastSectorInPath) {
    // route has been confirmed
    EndConfirmMapMoveMode();

    // if we really did plot a path (this will skip message if left click on current sector with no path)
    if (GetLengthOfPath(ppMovePath.value) > 0) {
      // then verbally confirm this destination!
      HandleNewDestConfirmation(sX, sY);
    } else // NULL path confirmed
    {
      // if previously there was a path
      if (pPreviousMercPath != null) {
        // then this means we've CANCELED it
        MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[3]);
      } else // no previous path
      {
        // then it means the route was UNCHANGED
        MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[2]);
      }
    }
  }

  return fLastSectorInPath;
}

function RebuildWayPointsForAllSelectedCharsGroups(): void {
  // rebuild the waypoints for everyone in the selected character list
  let iCounter: INT32 = 0;
  let fGroupIDRebuilt: boolean[] /* [256] */;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iVehicleId: INT32;
  let ppMovePath: Pointer<PathStPtr> = null;
  let ubGroupId: UINT8;

  memset(fGroupIDRebuilt, false, sizeof(fGroupIDRebuilt));

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((fSelectedListOfMercsForMapScreen[iCounter] == true)) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      // if he's IN a vehicle or IS a vehicle
      if ((pSoldier.value.bAssignment == Enum117.VEHICLE) || (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
        if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
          // IN a vehicle
          iVehicleId = pSoldier.value.iVehicleId;
        } else {
          // IS a vehicle
          iVehicleId = pSoldier.value.bVehicleID;
        }

        // vehicles
        ppMovePath = addressof(pVehicleList[iVehicleId].pMercPath);
        ubGroupId = pVehicleList[iVehicleId].ubMovementGroup;
      } else {
        // mercs on foot
        ppMovePath = addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID].pMercPath);
        ubGroupId = pSoldier.value.ubGroupID;
      }

      // if we haven't already rebuilt this group
      if (!fGroupIDRebuilt[ubGroupId]) {
        // rebuild it now
        RebuildWayPointsForGroupPath(ppMovePath.value, ubGroupId);

        // mark it as rebuilt
        fGroupIDRebuilt[ubGroupId] = true;
      }
    }
  }
}

function UpdateCursorIfInLastSector(): void {
  let sMapX: INT16 = 0;
  let sMapY: INT16 = 0;

  // check to see if we are plotting a path, if so, see if we are highlighting the last sector int he path, if so, change the cursor
  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    GetMouseMapXY(addressof(sMapX), addressof(sMapY));

    // translate screen values to map grid values for zoomed in
    if (fZoomFlag) {
      sMapX = iZoomX / MAP_GRID_X + sMapX;
      sMapX = sMapX / 2;
      sMapY = iZoomY / MAP_GRID_Y + sMapY;
      sMapY = sMapY / 2;
    }

    if (fShowAircraftFlag == false) {
      if (bSelectedDestChar != -1) {
        // c heck if we are in the last sector of the characters path?
        if (sMapX + (sMapY * MAP_WORLD_X) == GetLastSectorIdInCharactersPath((addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID])))) {
          // set cursor to checkmark
          ChangeMapScreenMaskCursor(Enum317.CURSOR_CHECKMARK);
        } else if (fCheckCursorWasSet) {
          // reset to walking guy/vehicle
          SetUpCursorForStrategicMap();
        }
      }
    } else {
      // check for helicopter
      if (fPlotForHelicopter) {
        if (sMapX + (sMapY * MAP_WORLD_X) == GetLastSectorOfHelicoptersPath()) {
          // set cursor to checkmark
          ChangeMapScreenMaskCursor(Enum317.CURSOR_CHECKMARK);
        } else if (fCheckCursorWasSet) {
          // reset to walking guy/vehicle
          SetUpCursorForStrategicMap();
        }
      } else {
        // reset to walking guy/vehicle
        SetUpCursorForStrategicMap();
      }
    }
  }

  return;
}

function FaceRegionBtnCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // error checking, make sure someone is there
  if (bSelectedInfoChar == -1) {
    return;
  } else if (gCharactersList[bSelectedInfoChar].fValid == false) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    if (gfPreBattleInterfaceActive == true) {
      return;
    }

    // now stop any dialogue in progress
    StopAnyCurrentlyTalkingSpeech();
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    RequestToggleMercInventoryPanel();
  }
}

function FaceRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (bSelectedInfoChar == -1) {
    fShowFaceHightLight = false;
    return;
  } else if (gCharactersList[bSelectedInfoChar].fValid == false) {
    fShowFaceHightLight = false;
    return;
  }

  if ((iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE)) {
    fShowFaceHightLight = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fShowFaceHightLight = false;
  }
}

function ItemRegionBtnCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // left AND right button are handled the same way
  if (iReason & (MSYS_CALLBACK_REASON_RBUTTON_UP | MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    RequestToggleMercInventoryPanel();
  }
}

function ItemRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (!CanToggleSelectedCharInventory()) {
    fShowItemHighLight = false;
    return;
  }

  if ((iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE)) {
    fShowItemHighLight = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fShowItemHighLight = false;
  }
}

function HandleChangeOfHighLightedLine(): void {
  /* static */ let iOldHighLine: INT32;

  if (fShowInventoryFlag) {
    return;
  }

  // check if change in highlight line
  if (giHighLine != iOldHighLine) {
    iOldHighLine = giHighLine;

    if (giHighLine == -1) {
      giSleepHighLine = -1;
      giAssignHighLine = -1;
      giContractHighLine = -1;
      giSleepHighLine = -1;

      // don't do during plotting, allowing selected character to remain highlighted and their destination column to glow!
      if ((bSelectedDestChar == -1) && (fPlotForHelicopter == false)) {
        giDestHighLine = -1;
      }
    }

    fDrawCharacterList = true;
  }
}

function UpdateTownMinePopUpDisplay(): void {
  if (gMapViewRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    ForceUpDateOfBox(ghTownMineBox);
    MapscreenMarkButtonsDirty();
  }
}

function HandleCharBarRender(): void {
  // check if the panel is disbled, if so, do not render
  if ((bSelectedInfoChar != -1) && (fDisableDueToBattleRoster == false)) {
    // valid character?...render
    if (gCharactersList[bSelectedInfoChar].fValid == true) {
      // if( !( ( fShowContractMenu)||( fShowAssignmentMenu ) ) )
      //{
      // draw bars for them
      DrawCharBars();

      UpdateCharRegionHelpText();
      //}
    }
  }
}

// update the status of the contract box
function UpDateStatusOfContractBox(): void {
  if (fShowContractMenu == true) {
    ForceUpDateOfBox(ghContractBox);

    if ((Menptr[gCharactersList[bSelectedInfoChar].usSolID].bLife == 0) || (Menptr[gCharactersList[bSelectedInfoChar].usSolID].bAssignment == Enum117.ASSIGNMENT_POW)) {
      ForceUpDateOfBox(ghRemoveMercAssignBox);
    }
  }

  return;
}

function DestroyTheItemInCursor(): void {
  // actually destroy this item
  // End Item pickup
  MAPEndItemPointer();
  gpItemPointer = null;
}

function TrashItemMessageBoxCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    // find the item and get rid of it

    DestroyTheItemInCursor();

    // reset cursor
    MSYS_ChangeRegionCursor(addressof(gSMPanelRegion), Enum317.CURSOR_NORMAL);
    SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);

    HandleButtonStatesWhileMapInventoryActive();
  }
}

function TrashCanBtnCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    // check if an item is in the cursor, if so, warn player
    if (gpItemPointer != null) {
      // set up for mapscreen
      if (gpItemPointer.value.ubMission) {
        DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pTrashItemText[1], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, TrashItemMessageBoxCallBack);
      } else {
        DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pTrashItemText[0], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, TrashItemMessageBoxCallBack);
      }
    }
  }
}

function TrashCanMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (gMPanelRegion.Cursor == EXTERN_CURSOR) {
      fShowTrashCanHighLight = true;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fShowTrashCanHighLight = false;
  }
}

function MapInvDoneButtonfastHelpCall(): void {
  SetPendingNewScreen(Enum26.LAPTOP_SCREEN);
}

function UpdateStatusOfMapSortButtons(): void {
  let iCounter: INT32 = 0;
  /* static */ let fShownLastTime: boolean = false;

  if ((gfPreBattleInterfaceActive) || fShowInventoryFlag) {
    if (fShownLastTime) {
      for (iCounter = 0; iCounter < MAX_SORT_METHODS; iCounter++) {
        HideButton(giMapSortButton[iCounter]);
      }
      if (gfPreBattleInterfaceActive) {
        HideButton(giCharInfoButton[0]);
        HideButton(giCharInfoButton[1]);
      }

      fShownLastTime = false;
    }
  } else {
    if (!fShownLastTime) {
      for (iCounter = 0; iCounter < MAX_SORT_METHODS; iCounter++) {
        ShowButton(giMapSortButton[iCounter]);
      }

      ShowButton(giCharInfoButton[0]);
      ShowButton(giCharInfoButton[1]);

      fShownLastTime = true;
    }
  }
}

function GetLastValidCharacterInTeamPanelList(): INT8 {
  let iCounter: INT8 = 0;
  let iValue: INT8 = 0;

  // run through the list and find the last valid guy in the list
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      if ((Menptr[gCharactersList[iCounter].usSolID].bLife >= OKLIFE)) {
        if (fShowMapInventoryPool) {
          if (Menptr[gCharactersList[iCounter].usSolID].sSectorX == sSelMapX && Menptr[gCharactersList[iCounter].usSolID].sSectorY == sSelMapY && Menptr[gCharactersList[iCounter].usSolID].bSectorZ == (iCurrentMapSectorZ)) {
            iValue = iCounter;
          }
        } else {
          if (fShowInventoryFlag && (gMPanelRegion.Cursor == EXTERN_CURSOR)) {
            if (bSelectedInfoChar != -1) {
              if (gCharactersList[bSelectedInfoChar].fValid == true) {
                if (Menptr[gCharactersList[iCounter].usSolID].sSectorX == Menptr[gCharactersList[bSelectedInfoChar].usSolID].sSectorX && Menptr[gCharactersList[iCounter].usSolID].sSectorY == Menptr[gCharactersList[bSelectedInfoChar].usSolID].sSectorY && Menptr[gCharactersList[iCounter].usSolID].bSectorZ == Menptr[gCharactersList[bSelectedInfoChar].usSolID].bSectorZ) {
                  iValue = iCounter;
                }
              }
            }
          } else {
            iValue = iCounter;
          }
        }
      }
    }
  }

  // return the character
  return iValue;
}

/*
// NB These functions weren't being called anywhere!  Use GoToNextCharacterInList etc instead
INT8 GetPrevValidCharacterInTeamPanelList( INT8 bCurrentIndex )
{
        INT8 iCounter = bCurrentIndex, iValue = 0;

        // run through the list and find the last valid guy in the list
        for( iCounter = bCurrentIndex; iCounter > 0; iCounter-- )
        {
                if( gCharactersList[ iCounter ].fValid == TRUE )
                {
                        if( ( Menptr[ gCharactersList[ iCounter ].usSolID ].bLife >= OKLIFE ) )
                        {
                                if( fShowMapInventoryPool )
                                {
                                        if(  Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorX == sSelMapX &&  Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorY == sSelMapY && Menptr[ gCharactersList[ iCounter ].usSolID ].bSectorZ == ( INT8 )( iCurrentMapSectorZ ) )
                                        {
                                                iValue = iCounter;
                                        }
                                }
                                else
                                {
                                        if( fShowInventoryFlag && ( gMPanelRegion.Cursor == EXTERN_CURSOR ) )
                                        {
                                                if( bSelectedInfoChar != -1 )
                                                {
                                                        if( gCharactersList[ bSelectedInfoChar ].fValid == TRUE )
                                                        {
                                                                if( Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorX == Menptr[ gCharactersList[ bSelectedInfoChar ].usSolID ].sSectorX &&  Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorY == Menptr[ gCharactersList[ bSelectedInfoChar ].usSolID ].sSectorY && Menptr[ gCharactersList[ iCounter ].usSolID ].bSectorZ ==Menptr[ gCharactersList[ bSelectedInfoChar ].usSolID ].bSectorZ )
                                                                {
                                                                        iValue = iCounter;
                                                                        iCounter = 0;
                                                                }
                                                        }
                                                }
                                        }
                                        else
                                        {
                                                iValue = iCounter;
                                        }
                                }
                        }
                }
        }

        // return the character
        return( iValue );
}

INT8 GetNextValidCharacterInTeamPanelList( INT8 bCurrentIndex )
{
        INT8 iCounter = bCurrentIndex, iValue = 0;

        // run through the list and find the last valid guy in the list
        for( iCounter = bCurrentIndex; iCounter < MAX_CHARACTER_COUNT; iCounter++ )
        {
                if( gCharactersList[ iCounter ].fValid == TRUE )
                {
                        if( ( Menptr[ gCharactersList[ iCounter ].usSolID ].bLife >= OKLIFE ) )
                        {
                                if( fShowMapInventoryPool )
                                {
                                        if(  Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorX == sSelMapX &&  Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorY == sSelMapY && Menptr[ gCharactersList[ iCounter ].usSolID ].bSectorZ == ( INT8 )( iCurrentMapSectorZ ) )
                                        {
                                                iValue = iCounter;
                                        }
                                }
                                else
                                {
                                        if( fShowInventoryFlag && ( gMPanelRegion.Cursor == EXTERN_CURSOR ) )
                                        {
                                                if( bSelectedInfoChar != -1 )
                                                {
                                                        if( gCharactersList[ bSelectedInfoChar ].fValid == TRUE )
                                                        {
                                                                if( Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorX == Menptr[ gCharactersList[ bSelectedInfoChar ].usSolID ].sSectorX &&  Menptr[ gCharactersList[ iCounter ].usSolID ].sSectorY == Menptr[ gCharactersList[ bSelectedInfoChar ].usSolID ].sSectorY && Menptr[ gCharactersList[ iCounter ].usSolID ].bSectorZ ==Menptr[ gCharactersList[ bSelectedInfoChar ].usSolID ].bSectorZ )
                                                                {
                                                                        iValue = iCounter;
                                                                }
                                                        }
                                                }
                                        }
                                        else
                                        {
                                                iValue = iCounter;
                                        }
                                }
                        }
                }
        }

        // return the character
        return( iValue );
}
*/

function CreateDestroyTrashCanRegion(): void {
  /* static */ let fCreated: boolean = false;

  if (fShowInventoryFlag && (fCreated == false)) {
    fCreated = true;

    // trash can
    MSYS_DefineRegion(addressof(gTrashCanRegion), TRASH_CAN_X, TRASH_CAN_Y, TRASH_CAN_X + TRASH_CAN_WIDTH, TRASH_CAN_Y + TRASH_CAN_HEIGHT, MSYS_PRIORITY_HIGHEST - 4, MSYS_NO_CURSOR, TrashCanMoveCallback, TrashCanBtnCallback);

    // done inventory button define
    giMapInvButtonDoneImage = LoadButtonImage("INTERFACE\\done_button2.sti", -1, 0, -1, 1, -1);
    giMapInvDoneButton = QuickCreateButton(giMapInvButtonDoneImage, INV_BTN_X, INV_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, DoneInventoryMapBtnCallback);

    SetButtonFastHelpText(giMapInvDoneButton, pMiscMapScreenMouseRegionHelpText[2]);
    SetRegionFastHelpText(addressof(gTrashCanRegion), pMiscMapScreenMouseRegionHelpText[1]);

    InitMapKeyRingInterface(KeyRingItemPanelButtonCallback);
    /*
                    giMapInvNextImage=  LoadButtonImage( "INTERFACE\\inventory_buttons.sti" ,-1,20,-1,22,-1 );
        giMapInvNext= QuickCreateButton( giMapInvNextImage, ( 2 ), ( 79 ) ,
                                                                                    BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                    ( GUI_CALLBACK )BtnGenericMouseMoveButtonCallback, ( GUI_CALLBACK)NextInventoryMapBtnCallback );


                    giMapInvPrevImage=  LoadButtonImage( "INTERFACE\\inventory_buttons.sti" ,-1,21,-1,23,-1 );
        giMapInvPrev= QuickCreateButton( giMapInvPrevImage, ( 30 ) , ( 79 ),
                                                                                    BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                    ( GUI_CALLBACK )BtnGenericMouseMoveButtonCallback, ( GUI_CALLBACK)PrevInventoryMapBtnCallback );

            */

    // reset the compatable item array at this point
    ResetCompatibleItemArray();
  } else if ((fShowInventoryFlag == false) && (fCreated == true)) {
    // trash can region
    fCreated = false;
    MSYS_RemoveRegion(addressof(gTrashCanRegion));

    // map inv done button
    RemoveButton(giMapInvDoneButton);

    // get rid of button image
    UnloadButtonImage(giMapInvButtonDoneImage);

    ShutdownKeyRingInterface();

    if (fShowDescriptionFlag == true) {
      // kill description
      DeleteItemDescriptionBox();
    }
  }
}

function InvmaskRegionBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // CJC, December 15 1998: do NOTHING for clicks here
}

function DoneInventoryMapBtnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // prevent inventory from being closed while stack popup up!
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (gMPanelRegion.Cursor != EXTERN_CURSOR && !InItemStackPopup()) {
        fEndShowInventoryFlag = true;
      }
    }
  }
}

function StartConfirmMapMoveMode(sMapY: INT16): void {
  let ubPosition: UINT8 = (sMapY < 8) ? MSG_MAP_UI_POSITION_LOWER : MSG_MAP_UI_POSITION_UPPER;

  // tell player what to do - to click again to confirm move
  MapScreenMessage(FONT_MCOLOR_LTYELLOW, ubPosition, pMapPlotStrings[0]);

  gfInConfirmMapMoveMode = true;
}

export function EndConfirmMapMoveMode(): void {
  CancelMapUIMessage();

  gfInConfirmMapMoveMode = false;
}

export function CancelMapUIMessage(): void {
  // and kill the message overlay
  EndUIMessage();

  fMapPanelDirty = true;
}

// automatically turns off mapscreen ui overlay messages when appropriate
function MonitorMapUIMessage(): void {
  // if there is a map UI message being displayed
  if (giUIMessageOverlay != -1) {
    // and if we're not in the middle of the "confirm move" sequence
    //		if( !gfInConfirmMapMoveMode || bSelectedDestChar == -1 )
    {
      // and we've now exceed its period of maximum persistance (without user input)
      if ((GetJA2Clock() - guiUIMessageTime) > guiUIMessageTimeDelay) {
        // then cancel the message now
        CancelMapUIMessage();
      }
    }
  }
}

function HandlePreBattleInterfaceWithInventoryPanelUp(): void {
  if ((gfPreBattleInterfaceActive == true) && (fShowInventoryFlag == true)) {
    if (fShowDescriptionFlag == true) {
      // kill description
      DeleteItemDescriptionBox();
    }

    // kill inventory panel
    fShowInventoryFlag = false;
    CreateDestroyMapInvButton();
  }
}

// this puts anyone who is on NO_ASSIGNMENT onto a free squad
function UpdateBadAssignments(): void {
  let iCounter: UINT32;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      CheckIfSoldierUnassigned(addressof(Menptr[gCharactersList[iCounter].usSolID]));
    }
  }

  return;
}

function InterruptTimeForMenus(): void {
  if ((fShowAssignmentMenu == true) || (fShowContractMenu == true)) {
    InterruptTime();
    PauseTimeForInterupt();
  } else if (fOneFrame) {
    InterruptTime();
    PauseTimeForInterupt();
  }

  return;
}

function HandleContractTimeFlashForMercThatIsAboutLeave(): void {
  let iCurrentTime: INT32;

  // grab the current time
  iCurrentTime = GetJA2Clock();

  // only bother checking once flash interval has elapsed
  if ((iCurrentTime - giFlashContractBaseTime) >= DELAY_PER_FLASH_FOR_DEPARTING_PERSONNEL) {
    // update timer so that we only run check so often
    giFlashContractBaseTime = iCurrentTime;
    fFlashContractFlag = !fFlashContractFlag;

    // don't redraw unless we have to!
    if (AnyMercsLeavingRealSoon()) {
      // redraw character list
      fDrawCharacterList = true;
    }
  }
}

function AnyMercsLeavingRealSoon(): boolean {
  let uiCounter: UINT32 = 0;
  let uiTimeInMin: UINT32 = GetWorldTotalMin();
  let fFoundOne: boolean = false;

  for (uiCounter = 0; uiCounter < MAX_CHARACTER_COUNT; uiCounter++) {
    if (gCharactersList[uiCounter].fValid == true) {
      if ((Menptr[gCharactersList[uiCounter].usSolID].iEndofContractTime - uiTimeInMin) <= MINS_TO_FLASH_CONTRACT_TIME) {
        fFoundOne = true;
        break;
      }
    }
  }

  return fFoundOne;
}

export function HandlePreloadOfMapGraphics(): boolean {
  // check amt of memory, if above required amt...use it
  let vs_desc: VSURFACE_DESC;
  let VObjectDesc: VOBJECT_DESC;

  fPreLoadedMapGraphics = true;

  vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.ImageFile = "INTERFACE\\b_map.pcx";
  if (!AddVideoSurface(addressof(vs_desc), addressof(guiBIGMAP))) {
    return false;
  }
  // strcpy(vs_desc.ImageFile, "INTERFACE\\popupbackground.pcx");
  // CHECKF(AddVideoSurface(&vs_desc, &guiPOPUPTEX));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mapcursr.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMAPCURSORS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\SAM.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSAMICON))) {
    return false;
  }

  // VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  // FilenameForBPP("INTERFACE\\s_map.sti", VObjectDesc.ImageFile);
  // CHECKF( AddVideoObject( &VObjectDesc, &guiMAP ) );
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mapcursr.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMAPCURSORS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\sleepicon.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSleepIcon))) {
    return false;
  }

  // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
  // FilenameForBPP("INTERFACE\\addonslcp.sti", VObjectDesc.ImageFile);
  // CHECKF(AddVideoObject(&VObjectDesc, &guiCORNERADDONS));

  // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
  // FilenameForBPP("INTERFACE\\mapborder.sti", VObjectDesc.ImageFile);
  // CHECKF(AddVideoObject(&VObjectDesc, &guiMAPBORDER));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\charinfo.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARINFO))) {
    return false;
  }
  /*strcpy(vs_desc.ImageFile, "INTERFACE\\playlist3.pcx");
  CHECKF(AddVideoSurface( &vs_desc, &guiCHARLIST ));*/

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\newgoldpiece3.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARLIST))) {
    return false;
  }

  // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
  // FilenameForBPP("INTERFACE\\mapbordercorner.sti", VObjectDesc.ImageFile);
  // CHECKF(AddVideoObject(&VObjectDesc, &guiMAPCORNER));

  // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
  // FilenameForBPP("INTERFACE\\popup.sti", VObjectDesc.ImageFile);
  // CHECKF(AddVideoObject(&VObjectDesc, &guiPOPUPBORDERS));

  // the sublevels
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\Mine_1.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSubLevel1))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\Mine_2.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSubLevel2))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\Mine_3.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSubLevel3))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\boxes.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARICONS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\incross.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCROSS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mapinv.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMAPINV))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\map_inv_2nd_gun_cover.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapInvSecondHandBlockout))) {
    return false;
  }

  // the upper left corner piece icons
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\top_left_corner_icons.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiULICONS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\prison.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiTIXAICON))) {
    return false;
  }

  HandleLoadOfMapBottomGraphics();

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\map_item.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiORTAICON))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mapcursr.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMAPCURSORS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\merc_between_sector_icons.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARBETWEENSECTORICONS))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\merc_mvt_green_arrows.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARBETWEENSECTORICONSCLOSE))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\GreenArr.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLEVELMARKER))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\Helicop.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiHelicopterIcon))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\eta_pop_up.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapBorderEtaPopUp))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\pos2.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapBorderHeliSectors))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\secondary_gun_hidden.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSecItemHiddenVO))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\selectedchararrow.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSelectedCharArrow))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mine.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMINEICON))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "INTERFACE\\hilite.sti";
  AddVideoObject(addressof(VObjectDesc), addressof(guiSectorLocatorGraphicID));

  // Kris:  Added this because I need to blink the icons button.
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "INTERFACE\\newemail.sti";
  AddVideoObject(addressof(VObjectDesc), addressof(guiNewMailIcons));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\BullsEye.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBULLSEYE))) {
    return false;
  }

  // graphic for pool inventory
  LoadInventoryPoolGraphic();

  // load border graphics
  LoadMapBorderGraphics();

  // load the pop up for the militia pop up box
  LoadMilitiaPopUpBox();

  return true;
}

export function HandleRemovalOfPreLoadedMapGraphics(): void {
  if (fPreLoadedMapGraphics == true) {
    DeleteMapBottomGraphics();
    DeleteVideoObjectFromIndex(guiMAPCURSORS);
    DeleteVideoObjectFromIndex(guiSleepIcon);

    // DeleteVideoObjectFromIndex(guiMAPBORDER);
    DeleteVideoObjectFromIndex(guiCHARLIST);
    // DeleteVideoObjectFromIndex(guiCORNERADDONS);
    // DeleteVideoObjectFromIndex(guiMAPCORNER);
    //	DeleteVideoObjectFromIndex(guiPOPUPBORDERS);
    DeleteVideoObjectFromIndex(guiCHARINFO);
    DeleteVideoObjectFromIndex(guiCHARICONS);
    DeleteVideoObjectFromIndex(guiCROSS);
    DeleteVideoSurfaceFromIndex(guiBIGMAP);
    DeleteVideoObjectFromIndex(guiSubLevel1);
    DeleteVideoObjectFromIndex(guiSubLevel2);
    DeleteVideoObjectFromIndex(guiSubLevel3);

    //	DeleteVideoSurfaceFromIndex(guiPOPUPTEX);
    DeleteVideoObjectFromIndex(guiSAMICON);
    DeleteVideoObjectFromIndex(guiMAPINV);
    DeleteVideoObjectFromIndex(guiMapInvSecondHandBlockout);
    DeleteVideoObjectFromIndex(guiULICONS);
    DeleteVideoObjectFromIndex(guiORTAICON);
    DeleteVideoObjectFromIndex(guiTIXAICON);
    DeleteVideoObjectFromIndex(guiCHARBETWEENSECTORICONS);
    DeleteVideoObjectFromIndex(guiCHARBETWEENSECTORICONSCLOSE);
    DeleteVideoObjectFromIndex(guiLEVELMARKER);
    DeleteVideoObjectFromIndex(guiMapBorderEtaPopUp);
    DeleteVideoObjectFromIndex(guiSecItemHiddenVO);
    DeleteVideoObjectFromIndex(guiSelectedCharArrow);
    DeleteVideoObjectFromIndex(guiMapBorderHeliSectors);
    DeleteVideoObjectFromIndex(guiHelicopterIcon);
    DeleteVideoObjectFromIndex(guiMINEICON);
    DeleteVideoObjectFromIndex(guiSectorLocatorGraphicID);

    // Kris:  Remove the email icons.
    DeleteVideoObjectFromIndex(guiNewMailIcons);

    DeleteVideoObjectFromIndex(guiBULLSEYE);

    // remove the graphic for the militia pop up box
    RemoveMilitiaPopUpBox();

    // remove inventory pool graphic
    RemoveInventoryPoolGraphic();

    // get rid of border stuff
    DeleteMapBorderGraphics();
  }

  return;
}

function CharacterIsInLoadedSectorAndWantsToMoveInventoryButIsNotAllowed(bCharId: INT8): boolean {
  let usSoldierId: UINT16 = 0;

  // invalid char id
  if (bCharId == -1) {
    return false;
  }

  // valid char?
  if (gCharactersList[bCharId].fValid == false) {
    return false;
  }

  // get the soldier id
  usSoldierId = gCharactersList[bCharId].usSolID;

  // char is in loaded sector
  if (Menptr[usSoldierId].sSectorX != gWorldSectorX || Menptr[usSoldierId].sSectorY != gWorldSectorY || Menptr[usSoldierId].bSectorZ != gbWorldSectorZ) {
    return false;
  }

  // not showing inventory?
  if (fShowInventoryFlag == false) {
    // nope
    return false;
  }

  // picked something up?
  if (gMPanelRegion.Cursor != EXTERN_CURSOR) {
    // nope
    return false;
  }

  // only disallow when enemies in sector
  if (!gTacticalStatus.fEnemyInSector) {
    return false;
  }

  return true;
}

function UpdateTheStateOfTheNextPrevMapScreenCharacterButtons(): void {
  if (gfPreBattleInterfaceActive) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }
  } else if (bSelectedInfoChar == -1) {
    DisableButton(giCharInfoButton[0]);
    DisableButton(giCharInfoButton[1]);
    DisableButton(giMapContractButton);
  }
  /* ARM: Commented out at KM's request, it won't reenabled them when coming back from PBI, on Feb. 22, 99
          else if ( fShowInventoryFlag == FALSE ) // make sure that we are in fact showing the mapscreen inventory
          {
                  return;
          }
  */
  else {
    // standard checks
    if ((GetNumberOfPeopleInCharacterList() < 2) || (CharacterIsInLoadedSectorAndWantsToMoveInventoryButIsNotAllowed(bSelectedInfoChar)) || (CharacterIsInTransitAndHasItemPickedUp(bSelectedInfoChar)) || (fShowDescriptionFlag)) {
      DisableButton(giCharInfoButton[0]);
      DisableButton(giCharInfoButton[1]);
    } else {
      EnableButton(giCharInfoButton[0]);
      EnableButton(giCharInfoButton[1]);
    }
  }
}

function PrevInventoryMapBtnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      GoToPrevCharacterInList();
    }
  }
}

function NextInventoryMapBtnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      GoToNextCharacterInList();
    }
  }
}

function CreateDestroyMapCharacterScrollButtons(): void {
  /* static */ let fCreated: boolean = false;

  if ((fInMapMode == true) && (fCreated == false)) {
    // set the button image
    giCharInfoButtonImage[0] = LoadButtonImage("INTERFACE\\map_screen_bottom_arrows.sti", 11, 4, -1, 6, -1);

    // set the button value
    giCharInfoButton[0] = QuickCreateButton(giCharInfoButtonImage[0], 67, 69, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 5, BtnGenericMouseMoveButtonCallback, PrevInventoryMapBtnCallback);
    // set the button image
    giCharInfoButtonImage[1] = LoadButtonImage("INTERFACE\\map_screen_bottom_arrows.sti", 12, 5, -1, 7, -1);

    // set the button value
    giCharInfoButton[1] = QuickCreateButton(giCharInfoButtonImage[1], 67, 87, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 5, BtnGenericMouseMoveButtonCallback, NextInventoryMapBtnCallback);

    SetButtonFastHelpText(giCharInfoButton[0], pMapScreenPrevNextCharButtonHelpText[0]);
    SetButtonFastHelpText(giCharInfoButton[1], pMapScreenPrevNextCharButtonHelpText[1]);

    fCreated = true;
  } else if (((fInMapMode == false)) && (fCreated == true)) {
    UnloadButtonImage(giCharInfoButtonImage[0]);
    UnloadButtonImage(giCharInfoButtonImage[1]);
    RemoveButton(giCharInfoButton[0]);
    RemoveButton(giCharInfoButton[1]);

    fCreated = false;
  }
}

export function TellPlayerWhyHeCantCompressTime(): void {
  // if we're locked into paused time compression by some event that enforces that
  if (PauseStateLocked()) {
  } else if (gfAtLeastOneMercWasHired == false) {
    // no mercs hired, ever
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMapScreenJustStartedHelpText[0], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  } else if (!AnyUsableRealMercenariesOnTeam()) {
    // no usable mercs left on team
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMapErrorString[39], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  } else if (ActiveTimedBombExists()) {
    // can't time compress when a bomb is about to go off!
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzLateLocalizedString[2], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  } else if (gfContractRenewalSquenceOn) {
  } else if (fDisableMapInterfaceDueToBattle) {
  } else if (fDisableDueToBattleRoster) {
  } else if (fMapInventoryItem) {
  } else if (fShowMapInventoryPool) {
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzLateLocalizedString[55], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  }
  // ARM: THIS TEST SHOULD BE THE LAST ONE, BECAUSE IT ACTUALLY RESULTS IN SOMETHING HAPPENING NOW.
  // KM:  Except if we are in a creature lair and haven't loaded the sector yet (no battle yet)
  else if (gTacticalStatus.uiFlags & INCOMBAT || gTacticalStatus.fEnemyInSector) {
    if (OnlyHostileCivsInSector()) {
      let str: string /* UINT16[256] */;
      let pSectorString: string /* UINT16[128] */;
      GetSectorIDString(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, pSectorString, true);
      str = swprintf(gzLateLocalizedString[27], pSectorString);
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, str, Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
    } else {
      // The NEW non-persistant PBI is used instead of a dialog box explaining why we can't compress time.
      InitPreBattleInterface(null, false);
    }
  } else if (PlayerGroupIsInACreatureInfestedMine()) {
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzLateLocalizedString[28], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  }
}

export function MapScreenDefaultOkBoxCallback(bExitValue: UINT8): void {
  // yes, load the game
  if (bExitValue == MSG_BOX_RETURN_OK) {
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  }

  return;
}

function MapSortBtnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = 0;

  // grab the button index value for the sort buttons
  iValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      ChangeCharacterListSortMethod(iValue);
    }
  }
}

function AddTeamPanelSortButtonsForMapScreen(): void {
  let iCounter: INT32 = 0;
  let filename: string /* SGPFILENAME */;
  let iImageIndex: INT32[] /* [MAX_SORT_METHODS] */ = [
    0,
    1,
    5,
    2,
    3,
    4,
  ]; // sleep image is out or order (last)

  GetMLGFilename(filename, Enum326.MLG_GOLDPIECEBUTTONS);

  for (iCounter = 0; iCounter < MAX_SORT_METHODS; iCounter++) {
    giMapSortButtonImage[iCounter] = LoadButtonImage(filename, -1, iImageIndex[iCounter], -1, iImageIndex[iCounter] + 6, -1);

    // buttonmake
    giMapSortButton[iCounter] = QuickCreateButton(giMapSortButtonImage[iCounter], (gMapSortButtons[iCounter].iX), (gMapSortButtons[iCounter].iY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 5, BtnGenericMouseMoveButtonCallback, MapSortBtnCallback);

    MSYS_SetBtnUserData(giMapSortButton[iCounter], 0, iCounter);

    SetButtonFastHelpText(giMapSortButton[iCounter], wMapScreenSortButtonHelpText[iCounter]);
  }
  return;
}

function SortListOfMercsInTeamPanel(fRetainSelectedMercs: boolean): void {
  let iCounter: INT32 = 0;
  let iCounterA: INT32 = 0;
  let sEndSectorA: INT16;
  let sEndSectorB: INT16;
  let iExpiryTime: INT32;
  let iExpiryTimeA: INT32;
  let fEntrySelected: boolean = false;
  let pSelectedSoldier: Pointer<SOLDIERTYPE>[] /* [MAX_CHARACTER_COUNT] */;
  let pCurrentSoldier: Pointer<SOLDIERTYPE> = null;
  let pPreviousSelectedInfoChar: Pointer<SOLDIERTYPE> = null;

  if (fRetainSelectedMercs) {
    // if we have anyone valid selected
    if ((bSelectedInfoChar != -1) && (gCharactersList[bSelectedInfoChar].fValid)) {
      pPreviousSelectedInfoChar = addressof(Menptr[gCharactersList[bSelectedInfoChar].usSolID]);
    }

    for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
      // set current entry to null
      pSelectedSoldier[iCounter] = null;

      // is this entry even valid
      if (gCharactersList[iCounter].fValid == false) {
        continue;
      }

      // get soldier assoc. with entry
      pCurrentSoldier = addressof(Menptr[gCharactersList[iCounter].usSolID]);

      // check if soldier is active
      if (pCurrentSoldier.value.bActive == false) {
        continue;
      }

      // are they selected?...
      if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
        // yes, store pointer to them
        pSelectedSoldier[iCounter] = pCurrentSoldier;
      }
    }
  }

  // do the sort
  for (iCounter = 1; iCounter < FIRST_VEHICLE; iCounter++) {
    // have we gone too far
    if (gCharactersList[iCounter].fValid == false) {
      break;
    }

    switch (giSortStateForMapScreenList) {
      case (0):
        // by name
        for (iCounterA = 0; iCounterA < FIRST_VEHICLE; iCounterA++) {
          if (gCharactersList[iCounterA].fValid == false) {
            break;
          }

          if ((wcscmp(Menptr[gCharactersList[iCounterA].usSolID].name, Menptr[gCharactersList[iCounter].usSolID].name) > 0) && (iCounterA < iCounter)) {
            SwapCharactersInList(iCounter, iCounterA);
          }
        }
        break;

      case (1):
        // by assignment
        for (iCounterA = 0; iCounterA < FIRST_VEHICLE; iCounterA++) {
          if (gCharactersList[iCounterA].fValid == false) {
            break;
          }

          if ((Menptr[gCharactersList[iCounterA].usSolID].bAssignment > Menptr[gCharactersList[iCounter].usSolID].bAssignment) && (iCounterA < iCounter)) {
            SwapCharactersInList(iCounter, iCounterA);
          } else if ((Menptr[gCharactersList[iCounterA].usSolID].bAssignment == Menptr[gCharactersList[iCounter].usSolID].bAssignment) && (iCounterA < iCounter)) {
            // same assignment

            // if it's in a vehicle
            if (Menptr[gCharactersList[iCounterA].usSolID].bAssignment == Enum117.VEHICLE) {
              // then also compare vehicle IDs
              if ((Menptr[gCharactersList[iCounterA].usSolID].iVehicleId > Menptr[gCharactersList[iCounter].usSolID].iVehicleId) && (iCounterA < iCounter)) {
                SwapCharactersInList(iCounter, iCounterA);
              }
            }
          }
        }
        break;

      case (2):
        // by sleep status
        for (iCounterA = 0; iCounterA < FIRST_VEHICLE; iCounterA++) {
          if (gCharactersList[iCounterA].fValid == false) {
            break;
          }

          if ((Menptr[gCharactersList[iCounterA].usSolID].fMercAsleep == true) && (Menptr[gCharactersList[iCounter].usSolID].fMercAsleep == false) && (iCounterA < iCounter)) {
            SwapCharactersInList(iCounter, iCounterA);
          }
        }
        break;

      case (3):
        // by location

        sEndSectorA = CalcLocationValueForChar(iCounter);

        for (iCounterA = 0; iCounterA < FIRST_VEHICLE; iCounterA++) {
          if (gCharactersList[iCounterA].fValid == false) {
            break;
          }

          sEndSectorB = CalcLocationValueForChar(iCounterA);

          if ((sEndSectorB > sEndSectorA) && (iCounterA < iCounter)) {
            SwapCharactersInList(iCounter, iCounterA);
          }
        }
        break;

      case (4):
        // by destination sector
        if (GetLengthOfMercPath(MercPtrs[gCharactersList[iCounter].usSolID]) == 0) {
          sEndSectorA = 9999;
        } else {
          sEndSectorA = GetLastSectorIdInCharactersPath(addressof(Menptr[gCharactersList[iCounter].usSolID]));
        }

        for (iCounterA = 0; iCounterA < FIRST_VEHICLE; iCounterA++) {
          if (gCharactersList[iCounterA].fValid == false) {
            break;
          }

          if (GetLengthOfMercPath(MercPtrs[gCharactersList[iCounterA].usSolID]) == 0) {
            sEndSectorB = 9999;
          } else {
            sEndSectorB = GetLastSectorIdInCharactersPath(addressof(Menptr[gCharactersList[iCounterA].usSolID]));
          }

          if ((sEndSectorB > sEndSectorA) && (iCounterA < iCounter)) {
            SwapCharactersInList(iCounter, iCounterA);
          }
        }
        break;

      case (5):
        iExpiryTime = GetContractExpiryTime(addressof(Menptr[gCharactersList[iCounter].usSolID]));

        // by contract expiry
        for (iCounterA = 0; iCounterA < FIRST_VEHICLE; iCounterA++) {
          if (gCharactersList[iCounterA].fValid == false) {
            break;
          }

          iExpiryTimeA = GetContractExpiryTime(addressof(Menptr[gCharactersList[iCounterA].usSolID]));

          if ((iExpiryTimeA > iExpiryTime) && (iCounterA < iCounter)) {
            SwapCharactersInList(iCounter, iCounterA);
          }
        }
        break;

      default:
        Assert(0);
        return;
    }
  }

  if (fRetainSelectedMercs) {
    // select nobody & reset the selected list
    ChangeSelectedInfoChar(-1, true);

    // now select all the soldiers that were selected before
    for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
      if (pSelectedSoldier[iCounter]) {
        for (iCounterA = 0; iCounterA < MAX_CHARACTER_COUNT; iCounterA++) {
          // is this entry even valid
          if (gCharactersList[iCounterA].fValid == false) {
            continue;
          }

          // grab current soldier
          pCurrentSoldier = addressof(Menptr[gCharactersList[iCounterA].usSolID]);

          // check if soldier is active
          if (pCurrentSoldier.value.bActive == false) {
            continue;
          }

          // this guy is selected
          if (pSelectedSoldier[iCounter] == pCurrentSoldier) {
            SetEntryInSelectedCharacterList(iCounterA);
          }

          // update who the currently selected info guy is
          if (pPreviousSelectedInfoChar == pCurrentSoldier) {
            ChangeSelectedInfoChar(iCounterA, false);
          }
        }
      }
    }
  } else {
    // keep currently selected merc, but reset the selected list (which isn't saved/restored, that's why)
    ResetSelectedListForMapScreen();
  }

  // reset blinking animations
  SetAllAutoFacesInactive();

  // dirty the screen parts affected
  fTeamPanelDirty = true;
  fCharacterInfoPanelDirty = true;
}

function SwapCharactersInList(iCharA: INT32, iCharB: INT32): void {
  let usTempSoldID: UINT16;

  // swap
  usTempSoldID = gCharactersList[iCharA].usSolID;
  gCharactersList[iCharA].usSolID = gCharactersList[iCharB].usSolID;
  gCharactersList[iCharB].usSolID = usTempSoldID;
}

function RemoveTeamPanelSortButtonsForMapScreen(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_SORT_METHODS; iCounter++) {
    UnloadButtonImage(giMapSortButtonImage[iCounter]);
    RemoveButton(giMapSortButton[iCounter]);

    giMapSortButtonImage[iCounter] = -1;
    giMapSortButton[iCounter] = -1;
  }
  return;
}

function HandleCommonGlowTimer(): void {
  let iCurrentTime: INT32 = 0;

  // grab the current time
  iCurrentTime = GetJA2Clock();

  // only bother checking once flash interval has elapsed
  if ((iCurrentTime - giCommonGlowBaseTime) >= GLOW_DELAY) {
    // update timer so that we only run check so often
    giCommonGlowBaseTime = iCurrentTime;

    // set flag to trigger glow higlight updates
    gfGlowTimerExpired = true;
  } else {
    gfGlowTimerExpired = false;
  }
}

function HandleAssignmentsDoneAndAwaitingFurtherOrders(): void {
  // run through list of grunts and handle awating further orders
  let iCounter: INT32 = 0;
  let iCurrentTime: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // update "nothing to do" flags if necessary
  if (gfReEvaluateEveryonesNothingToDo) {
    ReEvaluateEveryonesNothingToDo();
  }

  // grab the current time
  iCurrentTime = GetJA2Clock();

  // only bother checking once flash interval has elapsed
  if ((iCurrentTime - giFlashAssignBaseTime) >= ASSIGNMENT_DONE_FLASH_TIME) {
    // update timer so that we only run check so often
    giFlashAssignBaseTime = iCurrentTime;

    for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
      if (gCharactersList[iCounter].fValid == false) {
        break;
      }

      pSoldier = addressof(Menptr[gCharactersList[iCounter].usSolID]);

      // toggle and redraw if flash was left ON even though the flag is OFF
      if (pSoldier.value.fDoneAssignmentAndNothingToDoFlag || fFlashAssignDone) {
        fFlashAssignDone = !fFlashAssignDone;
        fDrawCharacterList = true;

        // only need to find one
        break;
      }
    }
  }
}

function DisplayIconsForMercsAsleep(): void {
  // run throught he list of grunts to see who is asleep and who isn't
  let hHandle: HVOBJECT;
  let iCounter: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // if we are in inventory
  if (fShowInventoryFlag == true) {
    return;
  }

  GetVideoObject(addressof(hHandle), guiSleepIcon);

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (gCharactersList[iCounter].fValid == true) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];
      if (pSoldier.value.bActive && pSoldier.value.fMercAsleep && CanChangeSleepStatusForSoldier(pSoldier)) {
        BltVideoObject(guiSAVEBUFFER, hHandle, 0, 125, (Y_START + (iCounter * (Y_SIZE() + 2))), VO_BLT_SRCTRANSPARENCY, null);
      }
    }
  }
  return;
}

// Kris:  Added this function to blink the email icon on top of the laptop button whenever we are in
//       mapscreen and we have new email to read.
function CheckForAndRenderNewMailOverlay(): void {
  if (fNewMailFlag) {
    if (GetJA2Clock() % 1000 < 667) {
      if (ButtonList[guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_LAPTOP]].value.uiFlags & BUTTON_CLICKED_ON) {
        // button is down, so offset the icon
        BltVideoObjectFromIndex(FRAME_BUFFER, guiNewMailIcons, 1, 465, 418, VO_BLT_SRCTRANSPARENCY, null);
        InvalidateRegion(465, 418, 480, 428);
      } else {
        // button is up, so draw the icon normally
        BltVideoObjectFromIndex(FRAME_BUFFER, guiNewMailIcons, 0, 464, 417, VO_BLT_SRCTRANSPARENCY, null);
        if (!(ButtonList[guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_LAPTOP]].value.uiFlags & BUTTON_ENABLED)) {
          let uiDestPitchBYTES: UINT32;
          let pDestBuf: Pointer<UINT8>;
          let area: SGPRect = createSGPRectFrom(463, 417, 477, 425);

          pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
          Blt16BPPBufferHatchRect(pDestBuf, uiDestPitchBYTES, addressof(area));
          UnLockVideoSurface(FRAME_BUFFER);
        }
        InvalidateRegion(463, 417, 481, 430);
      }
    } else {
      // The blink is now off, so mark the button dirty so that it'll render next frame.
      MarkAButtonDirty(guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_LAPTOP]);
    }
  }
}

export function CanToggleSelectedCharInventory(): boolean {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (gfPreBattleInterfaceActive == true) {
    return false;
  }

  // already in inventory and an item picked up?
  if (fShowInventoryFlag && (gMPanelRegion.Cursor == EXTERN_CURSOR)) {
    return false;
  }

  // nobody selected?
  if (bSelectedInfoChar == -1) {
    return false;
  }

  // does the selected guy have inventory and can we get at it?
  if (!MapCharacterHasAccessibleInventory(bSelectedInfoChar)) {
    return false;
  }

  pSoldier = MercPtrs[gCharactersList[bSelectedInfoChar].usSolID];

  // if not in inventory, and holding an item from sector inventory
  if (!fShowInventoryFlag && ((gMPanelRegion.Cursor == EXTERN_CURSOR) || gpItemPointer || fMapInventoryItem) && (gpItemPointerSoldier == null)) {
    // make sure he's in that sector
    if ((pSoldier.value.sSectorX != sSelMapX) || (pSoldier.value.sSectorY != sSelMapY) || (pSoldier.value.bSectorZ != iCurrentMapSectorZ) || pSoldier.value.fBetweenSectors) {
      return false;
    }
  }

  // passed!
  return true;
}

export function MapCharacterHasAccessibleInventory(bCharNumber: INT8): boolean {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  Assert(bCharNumber >= 0);
  Assert(bCharNumber < MAX_CHARACTER_COUNT);

  // invalid character slot selected?
  if (gCharactersList[bCharNumber].fValid == false) {
    return false;
  }

  pSoldier = MercPtrs[gCharactersList[bCharNumber].usSolID];

  if ((pSoldier.value.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (AM_A_ROBOT(pSoldier)) || (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) || (pSoldier.value.bLife < OKLIFE)) {
    return false;
  }

  return true;
}

function CheckForInventoryModeCancellation(): void {
  if (fShowInventoryFlag || fShowDescriptionFlag) {
    // can't bail while player has an item in hand...
    if (gMPanelRegion.Cursor == EXTERN_CURSOR) {
      return;
    }

    if (!CanToggleSelectedCharInventory()) {
      // get out of inventory mode if it's on!  (could have just bled below OKLIFE)
      if (fShowInventoryFlag) {
        fShowInventoryFlag = false;
        SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[0]);
        fTeamPanelDirty = true;
      }

      // get out of inventory description if it's on!
      if (fShowDescriptionFlag) {
        DeleteItemDescriptionBox();
      }
    }
  }
}

export function ChangeSelectedMapSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8): void {
  // ignore while map inventory pool is showing, or else items can be replicated, since sector inventory always applies
  // only to the currently selected sector!!!
  if (fShowMapInventoryPool)
    return;

  if (gfPreBattleInterfaceActive)
    return;

  if (!IsTheCursorAllowedToHighLightThisSector(sMapX, sMapY))
    return;

  // disallow going underground while plotting (surface) movement
  if ((bMapZ != 0) && ((bSelectedDestChar != -1) || fPlotForHelicopter))
    return;

  sSelMapX = sMapX;
  sSelMapY = sMapY;
  iCurrentMapSectorZ = bMapZ;

  // if going underground while in airspace mode
  if ((bMapZ > 0) && (fShowAircraftFlag == true)) {
    // turn off airspace mode
    ToggleAirspaceMode();
  }

  fMapPanelDirty = true;
  fMapScreenBottomDirty = true;

  // also need this, to update the text coloring of mercs in this sector
  fTeamPanelDirty = true;
}

function CanChangeDestinationForCharSlot(bCharNumber: INT8, fShowErrorMessage: boolean): boolean {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let bErrorNumber: INT8 = -1;

  if (bCharNumber == -1)
    return false;

  if (gCharactersList[bCharNumber].fValid == false)
    return false;

  pSoldier = MercPtrs[gCharactersList[bCharNumber].usSolID];

  // valid soldier?
  Assert(pSoldier);
  Assert(pSoldier.value.bActive);

  if (CanEntireMovementGroupMercIsInMove(pSoldier, addressof(bErrorNumber))) {
    return true;
  } else {
    // function may fail without returning any specific error # (-1).
    // if it gave us the # of an error msg, and we were told to display it
    if ((bErrorNumber != -1) && fShowErrorMessage) {
      ReportMapScreenMovementError(bErrorNumber);
    }

    return false;
  }
}

export function CanExtendContractForCharSlot(bCharNumber: INT8): boolean {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (bCharNumber == -1)
    return false;

  if (gCharactersList[bCharNumber].fValid == false)
    return false;

  pSoldier = MercPtrs[gCharactersList[bCharNumber].usSolID];

  // valid soldier?
  Assert(pSoldier);
  Assert(pSoldier.value.bActive);

  // if a vehicle, in transit, or a POW
  if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
    // can't extend contracts at this time
    return false;
  }

  // mercs below OKLIFE, M.E.R.C. mercs, EPCs, and the Robot use the Contract menu so they can be DISMISSED/ABANDONED!

  // everything OK
  return true;
}

export function CanChangeSleepStatusForCharSlot(bCharNumber: INT8): boolean {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (bCharNumber == -1)
    return false;

  if (gCharactersList[bCharNumber].fValid == false)
    return false;

  pSoldier = MercPtrs[gCharactersList[bCharNumber].usSolID];

  return CanChangeSleepStatusForSoldier(pSoldier);
}

export function CanChangeSleepStatusForSoldier(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  // valid soldier?
  Assert(pSoldier);
  Assert(pSoldier.value.bActive);

  // if a vehicle, robot, in transit, or a POW
  if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier) || (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
    // can't change the sleep status of such mercs
    return false;
  }

  // if dead
  if ((pSoldier.value.bLife <= 0) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_DEAD)) {
    return false;
  }

  // this merc MAY be able to sleep/wake up - we'll allow player to click and find out
  return true;
}

function ChangeMapScreenMaskCursor(usCursor: UINT16): void {
  MSYS_SetCurrentCursor(usCursor);
  MSYS_ChangeRegionCursor(addressof(gMapScreenMaskRegion), usCursor);

  if (usCursor == Enum317.CURSOR_CHECKMARK)
    fCheckCursorWasSet = true;
  else
    fCheckCursorWasSet = false;

  if (usCursor == Enum317.CURSOR_NORMAL) {
    if (!InItemStackPopup()) {
      // cancel mouse restriction
      FreeMouseCursor();
    }
  } else {
    // restrict mouse cursor to the map area
    RestrictMouseCursor(addressof(MapScreenRect));
  }
}

function CancelOrShortenPlottedPath(): void {
  let sMapX: INT16;
  let sMapY: INT16;
  let uiReturnValue: UINT32;

  GetMouseMapXY(addressof(sMapX), addressof(sMapY));

  /*
          // translate zoom in to zoom out coords
          if(fZoomFlag)
          {
                  sMapX=(UINT16)iZoomX/MAP_GRID_X+sMapX;
                  sMapX=sMapX/2;
                  sMapY=(UINT16)iZoomY/MAP_GRID_Y+sMapY;
                  sMapY=sMapY/2;
           }
  */

  // check if we are in aircraft mode
  if (fShowAircraftFlag == true) {
    // check for helicopter path being plotted
    if (!fPlotForHelicopter)
      return;

    // if player can't redirect it
    if (CanHelicopterFly() == false) {
      // explain & ignore
      ExplainWhySkyriderCantFly();
      return;
    }

    // try to delete portion of path AFTER the current sector for the helicopter
    uiReturnValue = ClearPathAfterThisSectorForHelicopter(sMapX, sMapY);
  } else {
    // check for character path being plotted
    if (bSelectedDestChar == -1)
      return;

    // try to delete portion of path AFTER the current sector for the helicopter
    uiReturnValue = ClearPathAfterThisSectorForCharacter(addressof(Menptr[gCharactersList[bSelectedDestChar].usSolID]), sMapX, sMapY);
  }

  switch (uiReturnValue) {
    case Enum158.ABORT_PLOTTING:
      AbortMovementPlottingMode();
      break;

    case Enum158.PATH_CLEARED: // movement was canceled
      // message was already issued when path was cleared
      DestinationPlottingCompleted();
      break;

    case Enum158.PATH_SHORTENED: // route was shortened but isn't completely gone
      // display "route shortened" message
      MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[4]);
      break;

    default:
      Assert(false);
      break;
  }

  // this triggers the path node animation to reset itself back to the first node
  fDeletedNode = true;

  fMapPanelDirty = true;

  fTeamPanelDirty = true;
  fCharacterInfoPanelDirty = true; // to update ETAs if path reversed or shortened
}

function HandleCtrlOrShiftInTeamPanel(bCharNumber: INT8): boolean {
  // check if shift or ctrl held down, if so, set values in list
  if (_KeyDown(CTRL)) {
    ToggleEntryInSelectedList(bCharNumber);

    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;

    return true;
  } else if (_KeyDown(SHIFT)) {
    // build a list from the bSelectedInfoChar To here, reset everyone

    // empty the list
    ResetSelectedListForMapScreen();
    // rebuild the list
    BuildSelectedListFromAToB(bSelectedInfoChar, bCharNumber);

    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;

    return true;
  }

  return false;
}

function GetContractExpiryTime(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  if ((pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) || (pSoldier.value.ubProfile == Enum268.SLAY)) {
    return pSoldier.value.iEndofContractTime;
  } else {
    // never - really high number
    return 999999;
  }
}

export function ChangeSelectedInfoChar(bCharNumber: INT8, fResetSelectedList: boolean): void {
  Assert((bCharNumber >= -1) && (bCharNumber < MAX_CHARACTER_COUNT));

  if ((bCharNumber != -1) && (gCharactersList[bCharNumber].fValid == false))
    return;

  // if holding an item
  if ((gMPanelRegion.Cursor == EXTERN_CURSOR) || gpItemPointer || fMapInventoryItem) {
    // make sure we can give it to this guy, otherwise don't allow the change
    if (!MapscreenCanPassItemToCharNum(bCharNumber)) {
      return;
    }
  }

  if (fResetSelectedList) {
    // reset selections of all listed characters.  Do this even if this guy is already selected.
    // NOTE: this keeps the currently selected info char selected
    ResetSelectedListForMapScreen();
  }

  // if this is really a change
  if (bSelectedInfoChar != bCharNumber) {
    // if resetting, and another guy was selected
    if (fResetSelectedList && (bSelectedInfoChar != -1)) {
      // deselect previously selected character
      ResetEntryForSelectedList(bSelectedInfoChar);
    }

    bSelectedInfoChar = bCharNumber;

    if (bCharNumber != -1) {
      // the selected guy must always be ON in the list of selected chars
      SetEntryInSelectedCharacterList(bCharNumber);
    }

    // if we're in the inventory panel
    if (fShowInventoryFlag) {
      // and we're changing to nobody or a guy whose inventory can't be accessed
      if ((bCharNumber == -1) || !MapCharacterHasAccessibleInventory(bCharNumber)) {
        // then get out of inventory mode
        fShowInventoryFlag = false;
      }
    }

    fCharacterInfoPanelDirty = true;

    // if showing sector inventory
    if (fShowMapInventoryPool) {
      // redraw right side to update item hatches
      fMapPanelDirty = true;
    }
  }

  fTeamPanelDirty = true;
}

export function CopyPathToAllSelectedCharacters(pPath: PathStPtr): void {
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // run through list and copy paths for each selected character
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      // skip itself!
      if (GetSoldierMercPathPtr(pSoldier) != pPath) {
        if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
          pVehicleList[pSoldier.value.bVehicleID].pMercPath = CopyPaths(pPath, pVehicleList[pSoldier.value.bVehicleID].pMercPath);
        } else if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
          pVehicleList[pSoldier.value.iVehicleId].pMercPath = CopyPaths(pPath, pVehicleList[pSoldier.value.iVehicleId].pMercPath);
        } else {
          pSoldier.value.pMercPath = CopyPaths(pPath, pSoldier.value.pMercPath);
        }

        // don't use CopyPathToCharactersSquadIfInOne(), it will whack the original pPath by replacing that merc's path!
      }
    }
  }
}

export function CancelPathsOfAllSelectedCharacters(): void {
  let bCounter: INT8 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let fSkyriderMsgShown: boolean = false;

  // cancel destination for the clicked and ALL other valid & selected characters with a route set
  for (bCounter = 0; bCounter < MAX_CHARACTER_COUNT; bCounter++) {
    // if we've clicked on a selected valid character
    if ((gCharactersList[bCounter].fValid == true) && IsEntryInSelectedListSet(bCounter)) {
      pSoldier = MercPtrs[gCharactersList[bCounter].usSolID];

      // and he has a route set
      if (GetLengthOfMercPath(pSoldier) > 0) {
        // if he's in the chopper, but player can't redirect it
        if ((pSoldier.value.bAssignment == Enum117.VEHICLE) && (pSoldier.value.iVehicleId == iHelicopterVehicleId) && (CanHelicopterFly() == false)) {
          if (!fSkyriderMsgShown) {
            // explain
            ExplainWhySkyriderCantFly();
            fSkyriderMsgShown = true;
          }

          // don't cancel, ignore
          continue;
        }

        // cancel the entire path (also clears vehicles for any passengers selected, and handles reversing directions)
        if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
          CancelPathForVehicle(addressof(pVehicleList[pSoldier.value.bVehicleID]), false);
        } else {
          CancelPathForCharacter(pSoldier);
        }
      }
    }
  }
}

function ConvertMinTimeToETADayHourMinString(uiTimeInMin: UINT32, sString: Pointer<string> /* STR16 */): void {
  let uiDay: UINT32;
  let uiHour: UINT32;
  let uiMin: UINT32;

  uiDay = (uiTimeInMin / NUM_MIN_IN_DAY);
  uiHour = (uiTimeInMin - (uiDay * NUM_MIN_IN_DAY)) / NUM_MIN_IN_HOUR;
  uiMin = uiTimeInMin - ((uiDay * NUM_MIN_IN_DAY) + (uiHour * NUM_MIN_IN_HOUR));

  // there ain't enough room to show both the day and ETA: and without ETA it's confused as the current time
  //	swprintf( sString, L"%s %s %d, %02d:%02d", pEtaString[ 0 ], pDayStrings[ 0 ], uiDay, uiHour, uiMin );
  //	swprintf( sString, L"%s %d, %02d:%02d", pDayStrings[ 0 ], uiDay, uiHour, uiMin );
  sString = swprintf("%s %02d:%02d", pEtaString[0], uiHour, uiMin);
}

function GetGroundTravelTimeOfCharacter(bCharNumber: INT8): INT32 {
  let iTravelTime: INT32 = 0;

  if (bCharNumber == -1)
    return 0;

  if (!gCharactersList[bCharNumber].fValid)
    return 0;

  // get travel time for the last path segment (stored in pTempCharacterPath)
  iTravelTime = GetPathTravelTimeDuringPlotting(pTempCharacterPath);

  // add travel time for any prior path segments (stored in the selected character's mercpath, but waypoints aren't built)
  iTravelTime += GetPathTravelTimeDuringPlotting(GetSoldierMercPathPtr(MercPtrs[gCharactersList[bCharNumber].usSolID]));

  return iTravelTime;
}

function CalcLocationValueForChar(iCounter: INT32): INT16 {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let sLocValue: INT16 = 0;

  Assert(iCounter < MAX_CHARACTER_COUNT);

  if (gCharactersList[iCounter].fValid == false)
    return sLocValue;

  pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

  // don't reveal location of POWs!
  if (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) {
    sLocValue = SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY);
    // underground: add 1000 per sublevel
    sLocValue += 1000 * (pSoldier.value.bSectorZ);
  }

  return sLocValue;
}

function CancelChangeArrivalSectorMode(): void {
  // "put him in change arrival sector" mode
  gfInChangeArrivalSectorMode = false;

  // change the cursor to that mode
  SetUpCursorForStrategicMap();

  fMapPanelDirty = true;
}

function MakeMapModesSuitableForDestPlotting(bCharNumber: INT8): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  if (gCharactersList[bCharNumber].fValid == true) {
    pSoldier = MercPtrs[gCharactersList[bCharNumber].usSolID];

    CancelSectorInventoryDisplayIfOn(false);

    TurnOnShowTeamsMode();

    if ((pSoldier.value.bAssignment == Enum117.VEHICLE) && (pSoldier.value.iVehicleId == iHelicopterVehicleId)) {
      if (fShowAircraftFlag == false) {
        // turn on airspace mode automatically
        ToggleAirspaceMode();
      }
    } else {
      if (fShowAircraftFlag == true) {
        // turn off airspace mode automatically
        ToggleAirspaceMode();
      }
    }

    // if viewing a different sublevel
    if (iCurrentMapSectorZ != pSoldier.value.bSectorZ) {
      // switch to that merc's sublevel
      JumpToLevel(pSoldier.value.bSectorZ);
    }
  }
}

function AnyMovableCharsInOrBetweenThisSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let iFirstId: INT32 = 0;
  let iLastId: INT32 = 0;
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // to speed it up a little?
  iFirstId = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  iLastId = gTacticalStatus.Team[OUR_TEAM].bLastID;

  for (iCounter = iFirstId; iCounter <= iLastId; iCounter++) {
    // get the soldier
    pSoldier = addressof(Menptr[iCounter]);

    // is the soldier active
    if (pSoldier.value.bActive == false) {
      continue;
    }

    // POWs, dead guys, guys in transit can't move
    if ((pSoldier.value.bAssignment == Enum117.IN_TRANSIT) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_DEAD) || (pSoldier.value.bLife == 0)) {
      continue;
    }

    // don't count mercs aboard Skyrider
    if ((pSoldier.value.bAssignment == Enum117.VEHICLE) && (pSoldier.value.iVehicleId == iHelicopterVehicleId)) {
      continue;
    }

    // don't count vehicles - in order for them to move, somebody must be in the sector with them
    if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
      continue;
    }

    // is he here?
    if ((pSoldier.value.sSectorX == sSectorX) && (pSoldier.value.sSectorY == sSectorY) && (pSoldier.value.bSectorZ == bSectorZ)) {
      // NOTE that we consider mercs between sectors, mercs < OKLIFE, and sleeping mercs to be "movable".
      // This lets CanCharacterMoveInStrategic() itself report the appropriate error message when character is clicked
      return true;
    }
  }

  return false;
}

function RequestGiveSkyriderNewDestination(): boolean {
  // should we allow it?
  if (CanHelicopterFly() == true) {
    // if not warned already, and chopper empty, but mercs are in this sector
    if (!gfSkyriderEmptyHelpGiven && (GetNumberOfPassengersInHelicopter() == 0) && (PlayerMercsInHelicopterSector() > 0)) {
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pSkyriderText[6], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
      gfSkyriderEmptyHelpGiven = true;
      return false;
    }

    // say Yo!
    SkyRiderTalk(SKYRIDER_SAYS_HI);

    // start plotting helicopter movement
    fPlotForHelicopter = true;

    // change cursor to the helicopter
    SetUpCursorForStrategicMap();

    // remember the helicopter's current path so we can restore it if need be
    gpHelicopterPreviousMercPath = CopyPaths(pVehicleList[iHelicopterVehicleId].pMercPath, gpHelicopterPreviousMercPath);

    // affects Skyrider's dialogue
    SetFactTrue(Enum170.FACT_SKYRIDER_USED_IN_MAPSCREEN);

    return true;
  } else // not allowed to reroute the chopper right now
  {
    // tell player why not
    ExplainWhySkyriderCantFly();

    return false;
  }
}

export function ExplainWhySkyriderCantFly(): void {
  // do we owe him money?
  if (gMercProfiles[Enum268.SKYRIDER].iBalance < 0) {
    // overdue cash
    SkyRiderTalk(OWED_MONEY_TO_SKYRIDER);
    return;
  }

  // is he returning to base?
  if (fHeliReturnStraightToBase) {
    // returning to base
    SkyRiderTalk(RETURN_TO_BASE);
    return;
  }

  // grounded by enemies in sector?
  if (CanHelicopterTakeOff() == false) {
    SkyRiderTalk(CHOPPER_NOT_ACCESSIBLE);
    //		DoMapMessageBox( MSG_BOX_BASIC_STYLE, pSkyriderText[ 4 ], MAP_SCREEN, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback );
    return;
  }

  // Drassen too disloyal to wanna help player?
  if (CheckFact(Enum170.FACT_LOYALTY_LOW, Enum268.SKYRIDER)) {
    SkyRiderTalk(DOESNT_WANT_TO_FLY);
    return;
  }

  // no explainable reason
}

function PlayerMercsInHelicopterSector(): UINT8 {
  let pGroup: Pointer<GROUP> = null;

  Assert(iHelicopterVehicleId != -1);
  pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);

  if (pGroup.value.fBetweenSectors) {
    return 0;
  }

  return PlayerMercsInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY, 0);
}

function HandleNewDestConfirmation(sMapX: INT16, sMapY: INT16): void {
  let ubCurrentProgress: UINT8;

  // if moving the chopper itself, or moving a character aboard the chopper
  if (fPlotForHelicopter) {
    // if there are no enemies in destination sector, or we don't know
    if ((NumEnemiesInSector(sMapX, sMapY) == 0) || (WhatPlayerKnowsAboutEnemiesInSector(sMapX, sMapY) == Enum159.KNOWS_NOTHING)) {
      // no problem

      // get current player progress
      ubCurrentProgress = CurrentPlayerProgressPercentage();

      // if we're doing a lot better than last time he said anything
      if ((ubCurrentProgress > gubPlayerProgressSkyriderLastCommentedOn) && ((ubCurrentProgress - gubPlayerProgressSkyriderLastCommentedOn) >= MIN_PROGRESS_FOR_SKYRIDER_QUOTE_DOING_WELL)) {
        // kicking ass!
        SkyRiderTalk(THINGS_ARE_GOING_WELL);

        gubPlayerProgressSkyriderLastCommentedOn = ubCurrentProgress;
      }
      // if we're doing noticably worse than last time he said anything
      else if ((ubCurrentProgress < gubPlayerProgressSkyriderLastCommentedOn) && ((gubPlayerProgressSkyriderLastCommentedOn - ubCurrentProgress) >= MIN_REGRESS_FOR_SKYRIDER_QUOTE_DOING_BADLY)) {
        // sucking rocks!
        SkyRiderTalk(THINGS_ARE_GOING_BADLY);

        gubPlayerProgressSkyriderLastCommentedOn = ubCurrentProgress;
      } else {
        // ordinary confirmation quote
        SkyRiderTalk(CONFIRM_DESTINATION);
      }
    } else {
      // ok, but... you know there are enemies there...
      SkyRiderTalk(BELIEVED_ENEMY_SECTOR);
    }
  } else {
    RandomAwakeSelectedMercConfirmsStrategicMove();

    // tell player the route was CONFIRMED
    // NOTE: We don't this this for the helicopter any more, since it clashes with Skyrider's own confirmation msg
    MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pMapPlotStrings[1]);
  }

  // wake up anybody who needs to be awake to travel
  WakeUpAnySleepingSelectedMercsOnFootOrDriving();
}

function RandomAwakeSelectedMercConfirmsStrategicMove(): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iCounter: INT32;
  let ubSelectedMercID: UINT8[] /* [20] */;
  let ubSelectedMercIndex: UINT8[] /* [20] */;
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((fSelectedListOfMercsForMapScreen[iCounter] == true)) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      if (pSoldier.value.bLife >= OKLIFE && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier) && !AM_AN_EPC(pSoldier) && !pSoldier.value.fMercAsleep) {
        ubSelectedMercID[ubNumMercs] = pSoldier.value.ubID;
        ubSelectedMercIndex[ubNumMercs] = iCounter;

        ubNumMercs++;
      }
    }
  }

  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    // select that merc so that when he speaks we're showing his portrait and not someone else
    ChangeSelectedInfoChar(ubSelectedMercIndex[ubChosenMerc], false);

    DoMercBattleSound(MercPtrs[ubSelectedMercID[ubChosenMerc]], (Random(2) ? Enum259.BATTLE_SOUND_OK1 : Enum259.BATTLE_SOUND_OK2));
    // TacticalCharacterDialogue( MercPtrs[ ubSelectedMercID[ ubChosenMerc ] ], ubQuoteNum );
  }
}

function DestinationPlottingCompleted(): void {
  // clear previous paths for selected characters and helicopter
  ClearPreviousPaths();

  fPlotForHelicopter = false;
  bSelectedDestChar = -1;
  giDestHighLine = -1;

  fMapPanelDirty = true;

  // reset cursor
  SetUpCursorForStrategicMap();

  fJustFinishedPlotting = true;
  fEndPlotting = true;
}

function HandleMilitiaRedistributionClick(): void {
  let bTownId: INT8;
  let fTownStillHidden: boolean;
  let sString: string /* CHAR16[128] */;

  // if on the surface
  if (iCurrentMapSectorZ == 0) {
    bTownId = GetTownIdForSector(sSelMapX, sSelMapY);
    fTownStillHidden = ((bTownId == Enum135.TIXA) && !fFoundTixa) || ((bTownId == Enum135.ORTA) && !fFoundOrta);

    if ((bTownId != Enum135.BLANK_SECTOR) && !fTownStillHidden) {
      if (MilitiaTrainingAllowedInSector(sSelMapX, sSelMapY, iCurrentMapSectorZ)) {
        if (fShowTownInfo == true) {
          fShowTownInfo = false;
        }
        fMapPanelDirty = true;

        // check if there's combat in any of the town's sectors
        if (CanRedistributeMilitiaInSector(sSelMapX, sSelMapY, bTownId)) {
          // Nope, ok, set selected militia town
          sSelectedMilitiaTown = bTownId;
        } else {
          // can't redistribute militia during combat!
          DoScreenIndependantMessageBox(pMilitiaString[2], MSG_BOX_FLAG_OK, null);
        }
      } else {
        // can't have militia in this town
        sString = swprintf(pMapErrorString[31], pTownNames[bTownId]);
        DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, null);
      }
    } else if (IsThisSectorASAMSector(sSelMapX, sSelMapY, 0) && fSamSiteFound[GetSAMIdFromSector(sSelMapX, sSelMapY, 0)]) {
      // can't move militia around sam sites
      DoScreenIndependantMessageBox(pMapErrorString[30], MSG_BOX_FLAG_OK, null);
    }
  }
}

function StartChangeSectorArrivalMode(): void {
  // "put him in change arrival sector" mode
  gfInChangeArrivalSectorMode = true;

  // redraw map with bullseye removed
  fMapPanelDirty = true;

  // change the cursor to that mode
  SetUpCursorForStrategicMap();

  // give instructions as overlay message
  MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pBullseyeStrings[0]);
}

function CanMoveBullseyeAndClickedOnIt(sMapX: INT16, sMapY: INT16): boolean {
  // if in airspace mode, and not plotting paths
  if ((fShowAircraftFlag == true) && (bSelectedDestChar == -1) && (fPlotForHelicopter == false)) {
    // don't allow moving bullseye until after initial arrival
    if (gTacticalStatus.fDidGameJustStart == false) {
      // if he clicked on the bullseye, and we're on the surface level
      if ((sMapX == gsMercArriveSectorX) && (sMapY == gsMercArriveSectorY) && (iCurrentMapSectorZ == 0)) {
        return true;
      }
    }
  }

  return false;
}

function CreateBullsEyeOrChopperSelectionPopup(): void {
  gzUserDefinedButton1 = pHelicopterEtaStrings[8];
  gzUserDefinedButton2 = pHelicopterEtaStrings[9];

  // do a BULLSEYE/CHOPPER message box
  DoScreenIndependantMessageBox(pHelicopterEtaStrings[7], MSG_BOX_FLAG_GENERIC, BullsEyeOrChopperSelectionPopupCallback);
}

function BullsEyeOrChopperSelectionPopupCallback(ubExitValue: UINT8): void {
  // button 1 pressed?
  if (ubExitValue == MSG_BOX_RETURN_YES) {
    // chose chopper
    // have to set a flag 'cause first call to RequestGiveSkyriderNewDestination() triggers another msg box & won't work
    gfRequestGiveSkyriderNewDestination = true;
  }
  // button 2 pressed?
  else if (ubExitValue == MSG_BOX_RETURN_NO) {
    // chose bullseye
    StartChangeSectorArrivalMode();
  }
}

// wake up anybody who needs to be awake to travel
function WakeUpAnySleepingSelectedMercsOnFootOrDriving(): void {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iCounter: INT32;
  let fSuccess: boolean = false;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if ((fSelectedListOfMercsForMapScreen[iCounter] == true)) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      // if asleep
      if (pSoldier.value.fMercAsleep) {
        // and on foot or driving
        if ((pSoldier.value.bAssignment < Enum117.ON_DUTY) || ((pSoldier.value.bAssignment == Enum117.VEHICLE) && SoldierMustDriveVehicle(pSoldier, pSoldier.value.iVehicleId, false))) {
          // we should be guaranteed that he CAN wake up to get this far, so report errors, but don't force it
          fSuccess = SetMercAwake(pSoldier, true, false);
          Assert(fSuccess);
        }
      }
    }
  }
}

function HandlePostAutoresolveMessages(): void {
  // KM: Autoresolve sets up this global sector value whenever the enemy gains control of a sector.  As soon as
  // we leave autoresolve and enter mapscreen, then this gets called and handles ownership change for the sector.
  // It also brings up a dialog stating to the player what happened, however, the internals of those functions
  // breaks autoresolve and the game crashes after autoresolve is finished.  The value doesn't need to be saved.
  //
  // An additional case is when creatures kill all opposition in the sector.  For each surviving monster, civilians
  // are "virtually" murdered and loyalty hits will be processed.
  if (gsCiviliansEatenByMonsters >= 1) {
    AdjustLoyaltyForCivsEatenByMonsters(SECTORX(gsEnemyGainedControlOfSectorID), SECTORY(gsEnemyGainedControlOfSectorID), gsCiviliansEatenByMonsters);
    gsCiviliansEatenByMonsters = -2;
  } else if (gsCiviliansEatenByMonsters == -2) {
    fMapPanelDirty = true;
    gsCiviliansEatenByMonsters = -1;
    gsEnemyGainedControlOfSectorID = -1;
  } else if (gsEnemyGainedControlOfSectorID >= 0) {
    // bring up the dialog box
    SetThisSectorAsEnemyControlled(SECTORX(gsEnemyGainedControlOfSectorID), SECTORY(gsEnemyGainedControlOfSectorID), 0, true);
    gsEnemyGainedControlOfSectorID = -2;
  } else if (gsEnemyGainedControlOfSectorID == -2) {
    // dirty the mapscreen after the dialog box goes away.
    fMapPanelDirty = true;
    gsEnemyGainedControlOfSectorID = -1;
  } else if (gbMilitiaPromotions) {
    let str: string /* UINT16[512] */;
    BuildMilitiaPromotionsString(str);
    DoScreenIndependantMessageBox(str, MSG_BOX_FLAG_OK, MapScreenDefaultOkBoxCallback);
  }
}

export function GetMapscreenMercAssignmentString(pSoldier: Pointer<SOLDIERTYPE>, sString: Pointer<string> /* wchar_t[] */ /* [] */): void {
  if (pSoldier.value.bAssignment != Enum117.VEHICLE) {
    sString = pAssignmentStrings[pSoldier.value.bAssignment];
  } else {
    sString = pShortVehicleStrings[pVehicleList[pSoldier.value.iVehicleId].ubVehicleType];
  }
}

export function GetMapscreenMercLocationString(pSoldier: Pointer<SOLDIERTYPE>, sString: Pointer<string> /* wchar_t[] */ /* [] */): void {
  let pTempString: string /* wchar_t[32] */;

  if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) {
    // show blank
    sString = "--";
  } else {
    if (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
      // POW - location unknown
      sString = swprintf("%s", pPOWStrings[1]);
    } else {
      pTempString = swprintf("%s%s%s", pMapVertIndex[pSoldier.value.sSectorY], pMapHortIndex[pSoldier.value.sSectorX], pMapDepthIndex[pSoldier.value.bSectorZ]);

      if (pSoldier.value.fBetweenSectors) {
        // put brackets around it when he's between sectors!
        sString = swprintf("(%s)", pTempString);
      } else {
        sString = pTempString;
      }
    }
  }
}

export function GetMapscreenMercDestinationString(pSoldier: Pointer<SOLDIERTYPE>, sString: Pointer<string> /* wchar_t[] */ /* [] */): void {
  let iSectorX: INT32;
  let iSectorY: INT32;
  let sSector: INT16 = 0;
  let pGroup: Pointer<GROUP> = null;

  // by default, show nothing
  sString = "";

  // if dead or POW - has no destination (no longer part of a group, for that matter)
  if ((pSoldier.value.bAssignment == Enum117.ASSIGNMENT_DEAD) || (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) || (pSoldier.value.bLife == 0)) {
    return;
  }

  if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) {
    // show the sector he'll be arriving in
    iSectorX = gsMercArriveSectorX;
    iSectorY = gsMercArriveSectorY;
  } else {
    // if he's going somewhere
    if (GetLengthOfMercPath(pSoldier) > 0) {
      sSector = GetLastSectorIdInCharactersPath(pSoldier);
      // convert
      iSectorX = sSector % MAP_WORLD_X;
      iSectorY = sSector / MAP_WORLD_Y;
    } else // no movement path is set...
    {
      if (pSoldier.value.fBetweenSectors) {
        // he must be returning to his previous (reversed so as to be the next) sector, so show that as his destination
        // individual soldiers don't store previous/next sector coordinates, must go to his group for that
        pGroup = GetGroup(GetSoldierGroupId(pSoldier));
        Assert(pGroup);
        iSectorX = pGroup.value.ubNextX;
        iSectorY = pGroup.value.ubNextY;
      } else {
        // show nothing
        return;
      }
    }
  }

  sString = swprintf("%s%s", pMapVertIndex[iSectorY], pMapHortIndex[iSectorX]);
}

export function GetMapscreenMercDepartureString(pSoldier: Pointer<SOLDIERTYPE>, sString: Pointer<string> /* wchar_t[] */ /* [] */, pubFontColor: Pointer<UINT8>): void {
  let iMinsRemaining: INT32 = 0;
  let iDaysRemaining: INT32 = 0;
  let iHoursRemaining: INT32 = 0;

  if ((pSoldier.value.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__AIM_MERC && pSoldier.value.ubProfile != Enum268.SLAY) || pSoldier.value.bLife == 0) {
    sString = swprintf("%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
  } else {
    iMinsRemaining = pSoldier.value.iEndofContractTime - GetWorldTotalMin();

    // if the merc is in transit
    if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) {
      // and if the time left on the cotract is greater then the contract time
      if (iMinsRemaining > (pSoldier.value.iTotalContractLength * NUM_MIN_IN_DAY)) {
        iMinsRemaining = (pSoldier.value.iTotalContractLength * NUM_MIN_IN_DAY);
      }
    }

    // if 3 or more days remain
    if (iMinsRemaining >= MAP_TIME_UNDER_THIS_DISPLAY_AS_HOURS) {
      iDaysRemaining = iMinsRemaining / (24 * 60);

      pubFontColor.value = FONT_LTGREEN;

      sString = swprintf("%d%s", iDaysRemaining, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);
    } else // less than 3 days
    {
      if (iMinsRemaining > 5) {
        iHoursRemaining = (iMinsRemaining + 59) / 60;
      } else {
        iHoursRemaining = 0;
      }

      // last 3 days is Red, last 4 hours start flashing red/white!
      if ((iMinsRemaining <= MINS_TO_FLASH_CONTRACT_TIME) && (fFlashContractFlag == true)) {
        pubFontColor.value = FONT_WHITE;
      } else {
        pubFontColor.value = FONT_RED;
      }

      sString = swprintf("%d%s", iHoursRemaining, gpStrategicString[Enum365.STR_PB_HOURS_ABBREVIATION]);
    }
  }
}

function InitPreviousPaths(): void {
  let iCounter: INT32 = 0;

  // init character previous paths
  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    gpCharacterPreviousMercPath[iCounter] = null;
  }

  // init helicopter previous path
  gpHelicopterPreviousMercPath = null;
}

export function RememberPreviousPathForAllSelectedChars(): void {
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
      pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

      // remember his previous path by copying it to his slot in the array kept for that purpose
      gpCharacterPreviousMercPath[iCounter] = CopyPaths(GetSoldierMercPathPtr(MercPtrs[gCharactersList[iCounter].usSolID]), gpCharacterPreviousMercPath[iCounter]);
    }
  }
}

function RestorePreviousPaths(): void {
  let iCounter: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let ppMovePath: Pointer<PathStPtr> = null;
  let ubGroupId: UINT8 = 0;
  let fPathChanged: boolean = false;

  // invalid if we're not plotting movement
  Assert((bSelectedDestChar != -1) || (fPlotForHelicopter == true));

  if (fPlotForHelicopter == true) {
    ppMovePath = addressof(pVehicleList[iHelicopterVehicleId].pMercPath);
    ubGroupId = pVehicleList[iHelicopterVehicleId].ubMovementGroup;

    // if the helicopter had a previous path
    if (gpHelicopterPreviousMercPath != null) {
      gpHelicopterPreviousMercPath = MoveToBeginningOfPathList(gpHelicopterPreviousMercPath);

      // clear current path
      ppMovePath.value = ClearStrategicPathList(ppMovePath.value, ubGroupId);
      // replace it with the previous one
      ppMovePath.value = CopyPaths(gpHelicopterPreviousMercPath, ppMovePath.value);
      // will need to rebuild waypoints
      fPathChanged = true;
    } else // no previous path
    {
      // if he currently has a path
      if (ppMovePath.value) {
        // wipe it out!
        ppMovePath.value = MoveToBeginningOfPathList(ppMovePath.value);
        ppMovePath.value = ClearStrategicPathList(ppMovePath.value, ubGroupId);
        // will need to rebuild waypoints
        fPathChanged = true;
      }
    }

    if (fPathChanged) {
      // rebuild waypoints
      RebuildWayPointsForGroupPath(ppMovePath.value, ubGroupId);

      // copy his path to all selected characters
      CopyPathToAllSelectedCharacters(ppMovePath.value);
    }
  } else // character(s) plotting
  {
    for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
      // if selected
      if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
        pSoldier = MercPtrs[gCharactersList[iCounter].usSolID];

        if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
          ppMovePath = addressof(pVehicleList[pSoldier.value.bVehicleID].pMercPath);
          ubGroupId = pVehicleList[pSoldier.value.bVehicleID].ubMovementGroup;
        } else if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
          ppMovePath = addressof(pVehicleList[pSoldier.value.iVehicleId].pMercPath);
          ubGroupId = pVehicleList[pSoldier.value.iVehicleId].ubMovementGroup;
        } else if (pSoldier.value.bAssignment < Enum117.ON_DUTY) {
          ppMovePath = addressof(pSoldier.value.pMercPath);
          ubGroupId = pSoldier.value.ubGroupID;
        } else {
          // invalid pSoldier - that guy can't possibly be moving, he's on a non-vehicle assignment!
          Assert(0);
          continue;
        }

        fPathChanged = false;

        // if we have the previous path stored for the dest char
        if (gpCharacterPreviousMercPath[iCounter]) {
          gpCharacterPreviousMercPath[iCounter] = MoveToBeginningOfPathList(gpCharacterPreviousMercPath[iCounter]);

          // clear current path
          ppMovePath.value = ClearStrategicPathList(ppMovePath.value, ubGroupId);
          // replace it with the previous one
          ppMovePath.value = CopyPaths(gpCharacterPreviousMercPath[iCounter], ppMovePath.value);
          // will need to rebuild waypoints
          fPathChanged = true;
        } else // no previous path stored
        {
          // if he has one now, wipe it out
          if (ppMovePath.value) {
            // wipe it out!
            ppMovePath.value = MoveToBeginningOfPathList(ppMovePath.value);
            ppMovePath.value = ClearStrategicPathList(ppMovePath.value, ubGroupId);
            // will need to rebuild waypoints
            fPathChanged = true;
          }
        }

        if (fPathChanged) {
          // rebuild waypoints
          RebuildWayPointsForGroupPath(ppMovePath.value, ubGroupId);
        }
      }
    }
  }
}

function ClearPreviousPaths(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    if (fSelectedListOfMercsForMapScreen[iCounter] == true) {
      gpCharacterPreviousMercPath[iCounter] = ClearStrategicPathList(gpCharacterPreviousMercPath[iCounter], 0);
    }
  }
  gpHelicopterPreviousMercPath = ClearStrategicPathList(gpHelicopterPreviousMercPath, 0);
}

function SelectAllCharactersInSquad(bSquadNumber: INT8): void {
  let bCounter: INT8;
  let fFirstOne: boolean = true;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // ignore if that squad is empty
  if (SquadIsEmpty(bSquadNumber) == true) {
    return;
  }

  // select nobody & reset the selected list
  ChangeSelectedInfoChar(-1, true);

  // now select all the soldiers that are in this squad
  for (bCounter = 0; bCounter < MAX_CHARACTER_COUNT; bCounter++) {
    // is this entry is valid
    if (gCharactersList[bCounter].fValid == true) {
      pSoldier = MercPtrs[gCharactersList[bCounter].usSolID];

      // if this guy is on that squad or in a vehicle which is assigned to that squad
      // NOTE: There's no way to select everyone aboard Skyrider with this function...
      if ((pSoldier.value.bAssignment == bSquadNumber) || IsSoldierInThisVehicleSquad(pSoldier, bSquadNumber)) {
        if (fFirstOne) {
          // make the first guy in the list who is in this squad the selected info char
          ChangeSelectedInfoChar(bCounter, false);

          // select his sector
          ChangeSelectedMapSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);

          fFirstOne = false;
        }

        SetEntryInSelectedCharacterList(bCounter);
      }
    }
  }
}

export function CanDrawSectorCursor(): boolean {
  if (/*( fCursorIsOnMapScrollButtons == FALSE ) && */
      (fShowTownInfo == false) && (ghTownMineBox == -1) && (fShowUpdateBox == false) && (GetNumberOfMercsInUpdateList() == 0) && (sSelectedMilitiaTown == 0) && (gfMilitiaPopupCreated == false) && (gfStartedFromMapScreen == false) && (fShowMapScreenMovementList == false) && (ghMoveBox == -1) && (fMapInventoryItem == false)) {
    return true;
  }

  return false;
}

function RestoreMapSectorCursor(sMapX: INT16, sMapY: INT16): void {
  let sScreenX: INT16;
  let sScreenY: INT16;

  Assert((sMapX >= 1) && (sMapX <= 16));
  Assert((sMapY >= 1) && (sMapY <= 16));

  GetScreenXYFromMapXY(sMapX, sMapY, addressof(sScreenX), addressof(sScreenY));

  sScreenY -= 1;

  /*
          if(fZoomFlag)
                  RestoreExternBackgroundRect( ((INT16)( sScreenX - MAP_GRID_X )), ((INT16)( sScreenY - MAP_GRID_Y )), DMAP_GRID_ZOOM_X, DMAP_GRID_ZOOM_Y);
          else
  */
  RestoreExternBackgroundRect(sScreenX, sScreenY, DMAP_GRID_X, DMAP_GRID_Y);
}

function RequestToggleMercInventoryPanel(): void {
  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
    return;
  }

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  if (!CanToggleSelectedCharInventory()) {
    return;
  }

  if (fShowDescriptionFlag == true) {
    // turn off item description
    DeleteItemDescriptionBox();
  } else {
    // toggle inventory mode
    fShowInventoryFlag = !fShowInventoryFlag;

    // set help text for item glow region
    if (fShowInventoryFlag) {
      SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[2]);
    } else {
      SetRegionFastHelpText(addressof(gCharInfoHandRegion), pMiscMapScreenMouseRegionHelpText[0]);
    }
  }

  fTeamPanelDirty = true;
}

function RequestContractMenu(): void {
  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
    return;
  }

  if (gfPreBattleInterfaceActive == true) {
    return;
  }

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  // in case we have multiple guys selected, turn off everyone but the guy we're negotiating with
  ChangeSelectedInfoChar(bSelectedInfoChar, true);

  if (CanExtendContractForCharSlot(bSelectedInfoChar)) {
    // create
    RebuildContractBoxForMerc(addressof(Menptr[gCharactersList[bSelectedInfoChar].usSolID]));

    // reset selected characters
    ResetAllSelectedCharacterModes();

    bSelectedContractChar = bSelectedInfoChar;
    giContractHighLine = bSelectedContractChar;

    // if not triggered internally
    if (CheckIfSalaryIncreasedAndSayQuote(MercPtrs[gCharactersList[bSelectedInfoChar].usSolID], true) == false) {
      // show contract box
      fShowContractMenu = true;

      // stop any dialogue by character
      StopAnyCurrentlyTalkingSpeech();
    }

    // fCharacterInfoPanelDirty = TRUE;
  } else {
    // reset selected characters
    ResetAllSelectedCharacterModes();
  }
}

function ChangeCharacterListSortMethod(iValue: INT32): void {
  Assert(iValue >= 0);
  Assert(iValue < MAX_SORT_METHODS);

  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
    return;
  }

  if (gfPreBattleInterfaceActive == true) {
    return;
  }

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  giSortStateForMapScreenList = iValue;
  SortListOfMercsInTeamPanel(true);
}

function MapscreenMarkButtonsDirty(): void {
  // redraw buttons
  MarkButtonsDirty();

  // if border buttons are created
  if (!fShowMapInventoryPool) {
    // if the attribute assignment menu is showing
    if (fShowAttributeMenu) {
      // don't redraw the town button, it would wipe out a chunk of the attribute menu
      UnMarkButtonDirty(giMapBorderButtons[Enum141.MAP_BORDER_TOWN_BTN]);
    }
  }
}

}
