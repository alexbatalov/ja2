namespace ja2 {

const NUM_BACKGROUND_REPS = 40;
const BACKGROUND_HEIGHT = 10;
const BACKGROUND_WIDTH = 125;
const IMAGE_BOX_X = 395;
const IMAGE_BOX_Y = LAPTOP_SCREEN_UL_Y + 24;
const IMAGE_BOX_WIDTH = 112;
const IMAGE_BOX_WITH_NO_BORDERS = 106;
const IMAGE_BOX_COUNT = 4;
const IMAGE_NAME_WIDTH = 106;
const IMAGE_FULL_NAME_OFFSET_Y = 111;
const TEXT_BOX_WIDTH = 160;
const TEXT_DELTA_OFFSET = 9;
const TEXT_BOX_Y = LAPTOP_SCREEN_UL_Y + 188;
const PAGE_BOX_X = LAPTOP_SCREEN_UL_X + 250 - 10;
const PAGE_BOX_Y = LAPTOP_SCREEN_UL_Y + 3;
const PAGE_BOX_WIDTH = 58;
const PAGE_BOX_HEIGHT = 24;
const MAX_SLOTS = 4;
const PERS_CURR_TEAM_X = LAPTOP_SCREEN_UL_X + 39 - 15;
const PERS_CURR_TEAM_Y = LAPTOP_SCREEN_UL_Y + 218;
const PERS_DEPART_TEAM_Y = LAPTOP_SCREEN_UL_Y + 247;

const BUTTON_Y = LAPTOP_SCREEN_UL_Y + 34;
const LEFT_BUTTON_X = LAPTOP_SCREEN_UL_X + 3 - 10;
const RIGHT_BUTTON_X = LAPTOP_SCREEN_UL_X + 476 - 10;
const PERS_COUNT = 15;
const MAX_STATS = 20;
const PERS_FONT = () => FONT10ARIAL();
const PERS_HEADER_FONT = () => FONT14ARIAL();
const CHAR_NAME_FONT = () => FONT12ARIAL();
const CHAR_NAME_Y = 177;
const CHAR_LOC_Y = 189;
const PERS_TEXT_FONT_COLOR = FONT_WHITE; // 146
const PERS_TEXT_FONT_ALTERNATE_COLOR = FONT_YELLOW;
const PERS_FONT_COLOR = FONT_WHITE;
const PAGE_X = PAGE_BOX_X + 2 - 10;
const PAGE_Y = PAGE_BOX_Y + 2;

const FACES_DIR = "FACES\\BIGFACES\\";
const SMALL_FACES_DIR = "FACES\\";

const NEXT_MERC_FACE_X = LAPTOP_SCREEN_UL_X + 448;
const MERC_FACE_SCROLL_Y = LAPTOP_SCREEN_UL_Y + 150;
const PREV_MERC_FACE_X = LAPTOP_SCREEN_UL_X + 285;

const DEPARTED_X = LAPTOP_SCREEN_UL_X + 29 - 10;
const DEPARTED_Y = LAPTOP_SCREEN_UL_Y + 207;

const PERSONNEL_PORTRAIT_NUMBER = 20;
const PERSONNEL_PORTRAIT_NUMBER_WIDTH = 5;

const SMALL_PORTRAIT_WIDTH = 46;
const SMALL_PORTRAIT_HEIGHT = 42;

const SMALL_PORT_WIDTH = 52;
const SMALL_PORT_HEIGHT = 45;

const SMALL_PORTRAIT_WIDTH_NO_BORDERS = 48;

const SMALL_PORTRAIT_START_X = 141 - 10;
const SMALL_PORTRAIT_START_Y = 53;

const PERS_CURR_TEAM_COST_X = LAPTOP_SCREEN_UL_X + 150 - 10;
const PERS_CURR_TEAM_COST_Y = LAPTOP_SCREEN_UL_Y + 218;

const PERS_CURR_TEAM_HIGHEST_Y = PERS_CURR_TEAM_COST_Y + 15;
const PERS_CURR_TEAM_LOWEST_Y = PERS_CURR_TEAM_HIGHEST_Y + 15;

const PERS_CURR_TEAM_WIDTH = 286 - 160;

const PERS_DEPART_TEAM_WIDTH = PERS_CURR_TEAM_WIDTH - 20;

const PERS_STAT_AVG_X = LAPTOP_SCREEN_UL_X + 157 - 10;
const PERS_STAT_AVG_Y = LAPTOP_SCREEN_UL_Y + 274;
const PERS_STAT_AVG_WIDTH = 202 - 159;
const PERS_STAT_LOWEST_X = LAPTOP_SCREEN_UL_X + 72 - 10;
const PERS_STAT_LOWEST_WIDTH = 155 - 75;
const PERS_STAT_HIGHEST_X = LAPTOP_SCREEN_UL_X + 205 - 10;
const PERS_STAT_LIST_X = LAPTOP_SCREEN_UL_X + 33 - 10;

const PERS_TOGGLE_CUR_DEPART_WIDTH = 106 - 35;
const PERS_TOGGLE_CUR_DEPART_HEIGHT = 236 - 212;

const PERS_TOGGLE_CUR_DEPART_X = LAPTOP_SCREEN_UL_X + 35 - 10;
const PERS_TOGGLE_CUR_Y = LAPTOP_SCREEN_UL_Y + 208;
const PERS_TOGGLE_DEPART_Y = LAPTOP_SCREEN_UL_Y + 238;

const PERS_DEPARTED_UP_X = LAPTOP_SCREEN_UL_X + 265 - 10;
const PERS_DEPARTED_UP_Y = LAPTOP_SCREEN_UL_Y + 210;
const PERS_DEPARTED_DOWN_Y = LAPTOP_SCREEN_UL_Y + 237;

const PERS_TITLE_X = 140;
const PERS_TITLE_Y = 33;

const ATM_UL_X = LAPTOP_SCREEN_UL_X + 397;
const ATM_UL_Y = LAPTOP_SCREEN_UL_Y + 27;

/// atm font
const ATM_FONT = () => PERS_FONT();

// departed states
const enum Enum106 {
  DEPARTED_DEAD = 0,
  DEPARTED_FIRED,
  DEPARTED_OTHER,
  DEPARTED_MARRIED,
  DEPARTED_CONTRACT_EXPIRED,
  DEPARTED_QUIT,
}

// atm button positions
const ATM_BUTTONS_START_Y = 110;
const ATM_BUTTONS_START_X = 510;
const ATM_BUTTON_WIDTH = 15;
const ATM_BUTTON_HEIGHT = 15;
const ATM_DISPLAY_X = 509;
const ATM_DISPLAY_Y = 58;
const ATM_DISPLAY_HEIGHT = 10;
const ATM_DISPLAY_WIDTH = 81;

// the number of inventory items per personnel page
const NUMBER_OF_INVENTORY_PERSONNEL = 8;
const Y_SIZE_OF_PERSONNEL_SCROLL_REGION = (422 - 219);
const X_SIZE_OF_PERSONNEL_SCROLL_REGION = (589 - 573);
const Y_OF_PERSONNEL_SCROLL_REGION = 219;
const X_OF_PERSONNEL_SCROLL_REGION = 573;
const SIZE_OF_PERSONNEL_CURSOR = 19;

// number buttons
const enum Enum107 {
  OK_ATM = 0,
  DEPOSIT_ATM,
  WIDTHDRAWL_ATM,
  CANCEL_ATM,
  CLEAR_ATM,
  NUMBER_ATM_BUTTONS,
}

// enums for the buttons in the information side bar ( used with giPersonnelATMStartButton[] )
const enum Enum108 {
  PERSONNEL_STAT_BTN,
  PERSONNEL_EMPLOYMENT_BTN,
  PERSONNEL_INV_BTN,

  PERSONNEL_NUM_BTN,
}

// enums for the current state of the information side bar ( stat panel )
const enum Enum109 {
  PRSNL_STATS,
  PRSNL_EMPLOYMENT,
  PRSNL_INV,
}
let gubPersonnelInfoState: UINT8 = Enum109.PRSNL_STATS;

// enums for the pPersonnelScreenStrings[]
const enum Enum110 {
  PRSNL_TXT_HEALTH, // HEALTH OF MERC
  PRSNL_TXT_AGILITY,
  PRSNL_TXT_DEXTERITY,
  PRSNL_TXT_STRENGTH,
  PRSNL_TXT_LEADERSHIP,
  PRSNL_TXT_WISDOM, // 5
  PRSNL_TXT_EXP_LVL, // EXPERIENCE LEVEL
  PRSNL_TXT_MARKSMANSHIP,
  PRSNL_TXT_MECHANICAL,
  PRSNL_TXT_EXPLOSIVES,
  PRSNL_TXT_MEDICAL, // 10
  PRSNL_TXT_MED_DEPOSIT, // AMOUNT OF MEDICAL DEPOSIT PUT DOWN ON THE MERC
  PRSNL_TXT_CURRENT_CONTRACT, // COST OF CURRENT CONTRACT
  PRSNL_TXT_KILLS, // NUMBER OF KILLS BY MERC
  PRSNL_TXT_ASSISTS, // NUMBER OF ASSISTS ON KILLS BY MERC
  PRSNL_TXT_DAILY_COST, // DAILY COST OF MERC			//15
  PRSNL_TXT_TOTAL_COST, // TOTAL COST OF MERC
  PRSNL_TXT_CONTRACT, // COST OF CURRENT CONTRACT
  PRSNL_TXT_TOTAL_SERVICE, // TOTAL SERVICE RENDERED BY MERC
  PRSNL_TXT_UNPAID_AMOUNT, // AMOUNT LEFT ON MERC MERC TO BE PAID
  PRSNL_TXT_HIT_PERCENTAGE, // PERCENTAGE OF SHOTS THAT HIT TARGET		//20
  PRSNL_TXT_BATTLES, // NUMBER OF BATTLES FOUGHT
  PRSNL_TXT_TIMES_WOUNDED, // NUMBER OF TIMES MERC HAS BEEN WOUNDED
  PRSNL_TXT_SKILLS,
  PRSNL_TXT_NOSKILLS,
}

// BOOLEAN fShowInventory = FALSE;
let uiCurrentInventoryIndex: UINT8 = 0;

let guiSliderPosition: UINT32;

// the transfer funds string
let sTransferString: CHAR16[] /* [32] */;

let giPersonnelATMSideButton: INT32[] /* [NUMBER_ATM_BUTTONS] */;
let giPersonnelATMSideButtonImage: INT32[] /* [NUMBER_ATM_BUTTONS] */;

let iNumberPadButtons: INT32[] /* [10] */;
let iNumberPadButtonsImages: INT32[] /* [10] */;

let pAtmSideButtonPts: POINT[] /* [] */ = [
  [ 533, 155 ],
  [ 558, 110 ],
  [ 558, 125 ],
  [ 558, 140 ],
  [ 558, 155 ],
];

const PrsnlOffSetX = (-15); //-20
const Prsnl_DATA_OffSetX = (36);
const PrsnlOffSetY = 10;

let pPersonnelScreenPoints: POINT[] /* [] */ = [
  [ 422 + PrsnlOffSetX, 205 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 215 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 225 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 235 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 245 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 255 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 315 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 270 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 280 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 290 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 300 + PrsnlOffSetY ], // 10
  [ 422 + PrsnlOffSetX, 395 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 385 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 415 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 425 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 445 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 380 + PrsnlOffSetY ], // for contract price
  [ 422 + PrsnlOffSetX, 435 + PrsnlOffSetY ],
  [ 140, 33 ], // Personnel Header
  [ 422 + PrsnlOffSetX, 330 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 340 + PrsnlOffSetY ], // 20
  [ 422 + PrsnlOffSetX, 355 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 365 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 375 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 385 + PrsnlOffSetY ],
  [ 422 + PrsnlOffSetX, 395 + PrsnlOffSetY ],
];

let guiSCREEN: UINT32;
export let guiTITLE: UINT32;
let guiFACE: UINT32;
let guiDEPARTEDTEAM: UINT32;
let guiCURRENTTEAM: UINT32;
let guiPersonnelInventory: UINT32;

let giPersonnelButton: INT32[] /* [6] */;
let giPersonnelButtonImage: INT32[] /* [6] */;
let giPersonnelInventoryButtons: INT32[] /* [2] */;
let giPersonnelInventoryButtonsImages: INT32[] /* [2] */;
let iStartPersonId: INT32; // iId of the person who is leftmost on the display
let iLastPersonId: INT32;
let giDepartedButtonImage: INT32[] /* [2] */;
let giDepartedButton: INT32[] /* [2] */;

// buttons for ATM
let giPersonnelATMStartButton: INT32[] /* [3] */;
let giPersonnelATMStartButtonImage: INT32[] /* [3] */;
let giPersonnelATMButton: INT32;
let giPersonnelATMButtonImage: INT32;

let fATMFlags: boolean = 0;
let fOldATMFlags: boolean = 0;
// the past team of the player
// INT16 ubDeadCharactersList[ 256 ];
// INT16 ubLeftCharactersList[ 256 ];
// INT16 ubOtherCharactersList[ 256 ];

// the id of currently displayed merc in right half of screen
let iCurrentPersonSelectedId: INT32 = -1;

let giCurrentUpperLeftPortraitNumber: INT32 = 0;

// which mode are we showing?..current team?...or deadly departed?
let fCurrentTeamMode: boolean = true;

// show the atm panel?
let fShowAtmPanel: boolean = false;
export let fShowAtmPanelStartButton: boolean = true;

// create buttons for scrolling departures
let fCreatePeronnelDepartureButton: boolean = false;

// waitr one frame
let fOneFrameDelayInPersonnel: boolean = false;

// whther or not we are creating mouse regions to place over portraits
let fCreatePersonnelPortraitMouseRegions: boolean = false;

// mouse regions
let gPortraitMouseRegions: MOUSE_REGION[] /* [20] */;

let gTogglePastCurrentTeam: MOUSE_REGION[] /* [2] */;

let gMouseScrollPersonnelINV: MOUSE_REGION;

let iCurPortraitId: INT32 = 0;

// create mouse regions for past/current toggles
let fCreateRegionsForPastCurrentToggle: boolean = false;

// atm misc functions

export function GameInitPersonnel(): void {
  // init past characters lists
  let iCounter: INT32 = 0;
  InitPastCharactersList();
}

export function EnterPersonnel(): void {
  fReDrawScreenFlag = true;
  iStartPersonId = -1;

  iCurrentPersonSelectedId = -1;

  uiCurrentInventoryIndex = 0;
  guiSliderPosition = 0;

  iCurPortraitId = 0;

  // load graphics for screen
  LoadPersonnelGraphics();

  // show atm panel
  fShowAtmPanelStartButton = true;

  // create buttons needed
  CreateDestroyButtonsForPersonnelDepartures();

  // load personnel
  LoadPersonnelScreenBackgroundGraphics();

  // render screen
  RenderPersonnel();

  // how many people do we have?..if you have someone set default to 0
  if (GetNumberOfMercsDeadOrAliveOnPlayersTeam() > 0) {
    iCurrentPersonSelectedId = GetIdOfFirstDisplayedMerc();
  }

  fCreatePersonnelPortraitMouseRegions = true;

  CreateDestroyMouseRegionsForPersonnelPortraits();
  // set states of en- dis able buttons
  // SetPersonnelButtonStates( );

  fCreateRegionsForPastCurrentToggle = true;

  CreateDestroyCurrentDepartedMouseRegions();

  // create buttons for screen
  CreatePersonnelButtons();

  // set states of en- dis able buttons
  SetPersonnelButtonStates();

  return;
}

export function ExitPersonnel(): void {
  if (fCurrentTeamMode == false) {
    fCurrentTeamMode = true;
    CreateDestroyButtonsForDepartedTeamList();
    fCurrentTeamMode = false;
  }

  // get rid of atm panel buttons
  fShowAtmPanelStartButton = false;
  fShowAtmPanel = false;
  fATMFlags = 0;
  CreateDestroyStartATMButton();
  CreateDestroyATMButton();

  //	fShowInventory = FALSE;
  gubPersonnelInfoState = Enum109.PRSNL_STATS;

  CreateDestroyPersonnelInventoryScrollButtons();

  // get rid of graphics
  RemovePersonnelGraphics();

  DeletePersonnelScreenBackgroundGraphics();

  CreateDestroyButtonsForPersonnelDepartures();

  // delete buttons
  DeletePersonnelButtons();

  fCreatePersonnelPortraitMouseRegions = false;

  // delete mouse regions
  CreateDestroyMouseRegionsForPersonnelPortraits();

  fCreateRegionsForPastCurrentToggle = false;

  CreateDestroyCurrentDepartedMouseRegions();

  return;
}

export function HandlePersonnel(): void {
  // RenderButtonsFastHelp( );
  CreateDestroyButtonsForPersonnelDepartures();

  // create / destroy buttons for scrolling departed list
  CreateDestroyButtonsForDepartedTeamList();

  // enable / disable departures buttons
  EnableDisableDeparturesButtons();

  // create destroy inv buttons as needed
  CreateDestroyPersonnelInventoryScrollButtons();

  // enable disable buttons as needed
  EnableDisableInventoryScrollButtons();

  HandlePersonnelKeyboard();

  // handle timed modes for ATM
  HandleTimedAtmModes();

  return;
}

function LoadPersonnelGraphics(): boolean {
  // load graphics needed for personnel screen
  let VObjectDesc: VOBJECT_DESC;

  // load graphics

  // title bar
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\programtitlebar.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiTITLE)));

  // the background grpahics
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\personnelwindow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSCREEN)));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\personnel_inventory.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiPersonnelInventory)));

  return true;
}

function RemovePersonnelGraphics(): void {
  // delete graphics needed for personnel screen

  DeleteVideoObjectFromIndex(guiSCREEN);
  DeleteVideoObjectFromIndex(guiTITLE);
  DeleteVideoObjectFromIndex(guiPersonnelInventory);

  return;
}

export function RenderPersonnel(): void {
  let hHandle: HVOBJECT;
  let iCounter: INT32 = 0;
  // re-renders personnel screen
  // render main background

  // blit title
  GetVideoObject(addressof(hHandle), guiTITLE);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y - 2, VO_BLT_SRCTRANSPARENCY, null);

  // blit screen
  GetVideoObject(addressof(hHandle), guiSCREEN);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y + 22, VO_BLT_SRCTRANSPARENCY, null);

  // render pictures of mercs on scnree
  // RenderPersonnelPictures( );

  // display header for screen
  // DisplayHeader( );

  // what page are we on?..display it
  // DrawPageNumber( );

  // display border
  // GetVideoObject(&hHandle, guiLaptopBACKGROUND);
  // BltVideoObject(FRAME_BUFFER, hHandle, 0,108, 23, VO_BLT_SRCTRANSPARENCY,NULL);

  // invalidte the region we blitted to
  // InvalidateRegion(LAPTOP_SCREEN_UL_X,LAPTOP_SCREEN_UL_Y,LAPTOP_SCREEN_LR_X,LAPTOP_SCREEN_LR_Y);

  // render personnel screen background
  RenderPersonnelScreenBackground();

  // show team
  DisplayPicturesOfCurrentTeam();

  DisplayPastMercsPortraits();

  // show selected merc
  DisplayFaceOfDisplayedMerc();

  // show current team size
  DisplayNumberOnCurrentTeam();

  // show departed team size
  DisplayNumberDeparted();

  // list stats row headers for team stats list
  DisplayPersonnelTeamStats();

  // showinventory of selected guy if applicable
  DisplayInventoryForSelectedChar();

  // the average stats for the current team
  DisplayAverageStatValuesForCurrentTeam();

  // lowest stat values
  DisplayLowestStatValuesForCurrentTeam();

  // past team
  DisplayStateOfPastTeamMembers();

  // title bar
  BlitTitleBarIcons();

  // show text on titlebar
  DisplayPersonnelTextOnTitleBar();

  // the highest stats
  DisplayHighestStatValuesForCurrentTeam();

  // render the atm panel
  RenderAtmPanel();

  DisplayAmountOnCurrentMerc();

  // en-dis-able start button
  UpDateStateOfStartButton();

  return;
}

function RenderPersonnelPictures(): boolean {
  // will render portraits of personnel onscreen
  // find person with iStartPersonId, unless it is -1, then find first bActive Merc on Staff
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fFound: boolean = false;
  let iCounter: INT32 = 0;
  let iSlot: INT32 = 0;
  let cnt: INT32 = 0;
  let iCurrentId: INT32 = 0;

  pSoldier = MercPtrs[cnt];
  pTeamSoldier = pSoldier;

  if (iStartPersonId == -1) {
    cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pSoldier++) {
      if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.bActive) {
        fFound = true;
        iStartPersonId = cnt;
        break;
      }
    }
    if (!fFound)
      return false;
  } else {
    iCurrentId = iStartPersonId;
    fFound = true;
    cnt = iCurrentId;
  }

  while (fFound) {
    // the soldier's ID is found
    // render Face
    fFound = false;
    RenderPersonnelFace(iCurrentId, iSlot, false, false, false);
    // draw stats
    RenderPersonnelStats(iCurrentId, iSlot);
    DisplayCharName(iCurrentId, iSlot);
    // find next guy
    pSoldier = MercPtrs[iCurrentId];
    cnt++;
    for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
      if (pTeamSoldier.value.bLife >= OKLIFE && pTeamSoldier.value.bActive) {
        if (pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
          return false;
        }

        fFound = true;
        iSlot++;
        break;
      }
    }
    if (iSlot >= MAX_SLOTS)
      fFound = false;
    iCurrentId = cnt;
  }

  return true;
}

function RenderPersonnelStats(iId: INT32, iSlot: INT32): void {
  let iCounter: INT32 = 0;
  // will render the stats of person iId in slot iSlot
  SetFont(PERS_FONT());
  SetFontForeground(PERS_TEXT_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  // for(iCounter=0; iCounter <PERS_COUNT; iCounter++)
  // mprintf((INT16)(pPersonnelScreenPoints[iCounter].x+(iSlot*IMAGE_BOX_WIDTH)),pPersonnelScreenPoints[iCounter].y,pPersonnelScreenStrings[iCounter]);

  if (gubPersonnelInfoState == Enum108.PERSONNEL_STAT_BTN) {
    DisplayCharStats(iId, iSlot);
  } else if (gubPersonnelInfoState == Enum108.PERSONNEL_EMPLOYMENT_BTN) {
    DisplayEmploymentinformation(iId, iSlot);
  }
}

function RenderPersonnelFace(iId: INT32, iSlot: INT32, fDead: boolean, fFired: boolean, fOther: boolean): boolean {
  let sTemp: char[] /* [100] */;
  let hFaceHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;
  let iCounter: INT32 = 7;

  // draw face to soldier iId in slot iSlot

  // special case?..player generated merc
  if (fCurrentTeamMode == true) {
    if ((50 < MercPtrs[iId].value.ubProfile) && (57 > MercPtrs[iId].value.ubProfile)) {
      sprintf(sTemp, "%s%03d.sti", FACES_DIR, gMercProfiles[MercPtrs[iId].value.ubProfile].ubFaceIndex);
    } else {
      sprintf(sTemp, "%s%02d.sti", FACES_DIR, Menptr[iId].ubProfile);
    }
  } else {
    // if this is not a valid merc
    if (!fDead && !fFired && !fOther) {
      return true;
    }

    if ((50 < iId) && (57 > iId)) {
      sprintf(sTemp, "%s%03d.sti", FACES_DIR, gMercProfiles[iId].ubFaceIndex);
    } else {
      sprintf(sTemp, "%s%02d.sti", FACES_DIR, iId);
    }
  }

  if (fCurrentTeamMode == true) {
    if (MercPtrs[iId].value.uiStatusFlags & SOLDIER_VEHICLE) {
      return true;
    }
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP(sTemp, VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFACE)));

  // Blt face to screen to
  GetVideoObject(addressof(hFaceHandle), guiFACE);

  if (fCurrentTeamMode == true) {
    if (MercPtrs[iId].value.bLife <= 0) {
      hFaceHandle.value.pShades[0] = Create16BPPPaletteShaded(hFaceHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, true);

      // set the red pallete to the face
      SetObjectHandleShade(guiFACE, 0);
    }
  } else {
    if (fDead == true) {
      hFaceHandle.value.pShades[0] = Create16BPPPaletteShaded(hFaceHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, true);

      // set the red pallete to the face
      SetObjectHandleShade(guiFACE, 0);
    }
  }

  BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, IMAGE_BOX_X + (iSlot * IMAGE_BOX_WIDTH), IMAGE_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // if the merc is dead, display it
  if (!fCurrentTeamMode) {
    let iHeightOfText: INT32;

    iHeightOfText = DisplayWrappedString(IMAGE_BOX_X, (IMAGE_BOX_Y + IMAGE_FULL_NAME_OFFSET_Y), IMAGE_NAME_WIDTH, 1, PERS_FONT(), PERS_FONT_COLOR, gMercProfiles[iId].zName, 0, false, CENTER_JUSTIFIED | DONT_DISPLAY_TEXT);

    // if the string will rap
    if ((iHeightOfText - 2) > GetFontHeight(PERS_FONT())) {
      // raise where we display it, and rap it
      DisplayWrappedString(IMAGE_BOX_X, (IMAGE_BOX_Y + IMAGE_FULL_NAME_OFFSET_Y - GetFontHeight(PERS_FONT())), IMAGE_NAME_WIDTH, 1, PERS_FONT(), PERS_FONT_COLOR, gMercProfiles[iId].zName, 0, false, CENTER_JUSTIFIED);
    } else {
      DrawTextToScreen(gMercProfiles[iId].zName, IMAGE_BOX_X, (IMAGE_BOX_Y + IMAGE_FULL_NAME_OFFSET_Y), IMAGE_NAME_WIDTH, PERS_FONT(), PERS_FONT_COLOR, 0, false, CENTER_JUSTIFIED);
    }
    //		DrawTextToScreen(gMercProfiles[ iId  ].zName, ( INT16 ) ( IMAGE_BOX_X+(iSlot*IMAGE_BOX_WIDTH) ), ( INT16 ) ( IMAGE_BOX_Y + 107 ), IMAGE_BOX_WITH_NO_BORDERS, PERS_FONT, PERS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
  }

  /*
  removed cause we already show this under the picture, instead display the mercs FULL name ( above )
          if( fCurrentTeamMode == TRUE )
          {
                  if( Menptr[ iId ].bLife <= 0 )
                  {
                          //if the merc is dead, display it
                          DrawTextToScreen(pDepartedMercPortraitStrings[0], ( INT16 ) ( IMAGE_BOX_X+(iSlot*IMAGE_BOX_WIDTH) ), ( INT16 ) ( IMAGE_BOX_Y + 107 ), IMAGE_BOX_WITH_NO_BORDERS, FONT14ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
                  }
          }
          else
          {
                  if( fDead )
                  {
                          //if the merc is dead, display it
                          DrawTextToScreen(pDepartedMercPortraitStrings[0], ( INT16 ) ( IMAGE_BOX_X+(iSlot*IMAGE_BOX_WIDTH) ), ( INT16 ) ( IMAGE_BOX_Y + 107 ), IMAGE_BOX_WITH_NO_BORDERS, FONT14ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
  //			DrawTextToScreen( AimPopUpText[ AIM_MEMBER_DEAD ], ( INT16 ) ( IMAGE_BOX_X+(iSlot*IMAGE_BOX_WIDTH) ), ( INT16 ) ( IMAGE_BOX_Y + 107 ), IMAGE_BOX_WITH_NO_BORDERS, FONT14ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
                  }
                  else if( fFired )
                  {
                          //if the merc is dead, display it
                          DrawTextToScreen(pDepartedMercPortraitStrings[1], ( INT16 ) ( IMAGE_BOX_X+(iSlot*IMAGE_BOX_WIDTH) ), ( INT16 ) ( IMAGE_BOX_Y + 107 ), IMAGE_BOX_WITH_NO_BORDERS, FONT14ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
                  }
                  else if( fOther )
                  {
                          //if the merc is dead, display it
                          DrawTextToScreen(pDepartedMercPortraitStrings[2], ( INT16 ) ( IMAGE_BOX_X+(iSlot*IMAGE_BOX_WIDTH) ), ( INT16 ) ( IMAGE_BOX_Y + 107 ), IMAGE_BOX_WITH_NO_BORDERS, FONT14ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
                  }
          }

  */

  DeleteVideoObjectFromIndex(guiFACE);

  return true;
}

function NextPersonnelFace(): boolean {
  if (iCurrentPersonSelectedId == -1) {
    return true;
  }

  if (fCurrentTeamMode == true) {
    // wrap around?
    if (iCurrentPersonSelectedId == GetNumberOfMercsDeadOrAliveOnPlayersTeam() - 1) {
      iCurrentPersonSelectedId = 0;
      return (false); // def added 3/14/99 to enable disable buttons properly
    } else {
      iCurrentPersonSelectedId++;
    }
  } else {
    if (((iCurPortraitId + 1) == (GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam()) - giCurrentUpperLeftPortraitNumber)) {
      // about to go off the end
      giCurrentUpperLeftPortraitNumber = 0;
      iCurPortraitId = 0;
    } else if (iCurPortraitId == 19) {
      giCurrentUpperLeftPortraitNumber += 20;
      iCurPortraitId = 0;
    } else {
      iCurPortraitId++;
    }
    // get of this merc in this slot

    iCurrentPersonSelectedId = iCurPortraitId;
    fReDrawScreenFlag = true;
  }

  return true;
}

function PrevPersonnelFace(): boolean {
  if (iCurrentPersonSelectedId == -1) {
    return true;
  }

  if (fCurrentTeamMode == true) {
    // wrap around?
    if (iCurrentPersonSelectedId == 0) {
      iCurrentPersonSelectedId = GetNumberOfMercsDeadOrAliveOnPlayersTeam() - 1;

      if (iCurrentPersonSelectedId == 0) {
        return (false); // def added 3/14/99 to enable disable buttons properly
      }
    } else {
      iCurrentPersonSelectedId--;
    }
  } else {
    if ((iCurPortraitId == 0) && (giCurrentUpperLeftPortraitNumber == 0)) {
      // about to go off the end
      giCurrentUpperLeftPortraitNumber = (GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam()) - (GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam()) % 20;
      iCurPortraitId = (GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam()) % 20;
      iCurPortraitId--;
    } else if (iCurPortraitId == 0) {
      giCurrentUpperLeftPortraitNumber -= 20;
      iCurPortraitId = 19;
    } else {
      iCurPortraitId--;
    }
    // get of this merc in this slot

    iCurrentPersonSelectedId = iCurPortraitId;
    fReDrawScreenFlag = true;
  }

  return true;
}

function CreatePersonnelButtons(): void {
  // left button
  giPersonnelButtonImage[0] = LoadButtonImage("LAPTOP\\personnelbuttons.sti", -1, 0, -1, 1, -1);
  giPersonnelButton[0] = QuickCreateButton(giPersonnelButtonImage[0], PREV_MERC_FACE_X, MERC_FACE_SCROLL_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, LeftButtonCallBack);

  // right button
  giPersonnelButtonImage[1] = LoadButtonImage("LAPTOP\\personnelbuttons.sti", -1, 2, -1, 3, -1);
  giPersonnelButton[1] = QuickCreateButton(giPersonnelButtonImage[1], NEXT_MERC_FACE_X, MERC_FACE_SCROLL_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, RightButtonCallBack);

  /*
  // left button
  giPersonnelButtonImage[0]=  LoadButtonImage( "LAPTOP\\arrows.sti" ,-1,0,-1,1,-1 );
  giPersonnelButton[0] = QuickCreateButton( giPersonnelButtonImage[0], LEFT_BUTTON_X, BUTTON_Y,
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)LeftButtonCallBack);

  // right button
  giPersonnelButtonImage[1]=  LoadButtonImage( "LAPTOP\\arrows.sti" ,-1,6,-1,7,-1 );
  giPersonnelButton[1] = QuickCreateButton( giPersonnelButtonImage[1], RIGHT_BUTTON_X, BUTTON_Y,
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)RightButtonCallBack);

  // left FF button
  giPersonnelButtonImage[2]=  LoadButtonImage( "LAPTOP\\arrows.sti" ,-1,3,-1,4,-1 );
  giPersonnelButton[2] = QuickCreateButton( giPersonnelButtonImage[2], LEFT_BUTTON_X, BUTTON_Y + 22,
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)LeftFFButtonCallBack);

  // right ff button
  giPersonnelButtonImage[3]=  LoadButtonImage( "LAPTOP\\arrows.sti" ,-1,9,-1,10,-1 );
  giPersonnelButton[3] = QuickCreateButton( giPersonnelButtonImage[3], RIGHT_BUTTON_X, BUTTON_Y + 22,
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)RightFFButtonCallBack);
*/
  // set up cursors
  SetButtonCursor(giPersonnelButton[0], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(giPersonnelButton[1], Enum317.CURSOR_LAPTOP_SCREEN);
  // SetButtonCursor(giPersonnelButton[2], CURSOR_LAPTOP_SCREEN);
  // SetButtonCursor(giPersonnelButton[3], CURSOR_LAPTOP_SCREEN);

  return;
}

function DeletePersonnelButtons(): void {
  RemoveButton(giPersonnelButton[0]);
  UnloadButtonImage(giPersonnelButtonImage[0]);
  RemoveButton(giPersonnelButton[1]);
  UnloadButtonImage(giPersonnelButtonImage[1]);
  /*RemoveButton(giPersonnelButton[2] );
  UnloadButtonImage( giPersonnelButtonImage[2] );
  RemoveButton(giPersonnelButton[3] );
  UnloadButtonImage( giPersonnelButtonImage[3] );
  */
  return;
}

function LeftButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fReDrawScreenFlag = true;
      PrevPersonnelFace();
      uiCurrentInventoryIndex = 0;
      guiSliderPosition = 0;
    }
  }
}

function LeftFFButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fReDrawScreenFlag = true;
      PrevPersonnelFace();
      PrevPersonnelFace();
      PrevPersonnelFace();
      PrevPersonnelFace();

      // set states
      SetPersonnelButtonStates();
    }
  }
}

function RightButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fReDrawScreenFlag = true;
      NextPersonnelFace();
      uiCurrentInventoryIndex = 0;
      guiSliderPosition = 0;
    }
  }
}

function RightFFButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fReDrawScreenFlag = true;
      NextPersonnelFace();
      NextPersonnelFace();
      NextPersonnelFace();
      NextPersonnelFace();

      // set states
      SetPersonnelButtonStates();
    }
  }
}

function DisplayHeader(): void {
  SetFont(PERS_HEADER_FONT());
  SetFontForeground(PERS_FONT_COLOR);
  SetFontBackground(0);

  mprintf(pPersonnelScreenPoints[18].x, pPersonnelScreenPoints[18].y, pPersonnelTitle[0]);

  return;
}

function DisplayCharName(iId: INT32, iSlot: INT32): void {
  // get merc's nickName, assignment, and sector location info
  let sX: INT16;
  let sY: INT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sString: CHAR16[] /* [64] */;
  let sTownName: CHAR16[] /* [256] */;
  let bTownId: INT8 = -1;
  let iHeightOfText: INT32;

  sTownName[0] = '\0';

  pSoldier = MercPtrs[iId];

  SetFont(CHAR_NAME_FONT());
  SetFontForeground(PERS_TEXT_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  if (Menptr[iId].bAssignment == Enum117.ASSIGNMENT_POW) {
  } else if (Menptr[iId].bAssignment == Enum117.IN_TRANSIT) {
  } else {
    // name of town, if any
    bTownId = GetTownIdForSector(Menptr[iId].sSectorX, Menptr[iId].sSectorY);

    if (bTownId != Enum135.BLANK_SECTOR) {
      swprintf(sTownName, "%s", pTownNames[bTownId]);
    }
  }

  if (sTownName[0] != '\0') {
    // nick name - town name
    swprintf(sString, "%s - %s", gMercProfiles[Menptr[iId].ubProfile].zNickname, sTownName);
  } else {
    // nick name
    swprintf(sString, "%s", gMercProfiles[Menptr[iId].ubProfile].zNickname);
  }

  // nick name - assignment
  FindFontCenterCoordinates(IMAGE_BOX_X - 5, 0, IMAGE_BOX_WIDTH + 90, 0, sString, CHAR_NAME_FONT(), addressof(sX), addressof(sY));

  // check to see if we are going to go off the left edge
  if (sX < pPersonnelScreenPoints[0].x) {
    sX = pPersonnelScreenPoints[0].x;
  }

  // Display the mercs name
  mprintf(sX + iSlot * IMAGE_BOX_WIDTH, CHAR_NAME_Y, sString);

  swprintf(sString, "%s", pPersonnelAssignmentStrings[Menptr[iId].bAssignment]);

  // nick name - assignment
  FindFontCenterCoordinates(IMAGE_BOX_X - 5, 0, IMAGE_BOX_WIDTH + 90, 0, sString, CHAR_NAME_FONT(), addressof(sX), addressof(sY));

  // check to see if we are going to go off the left edge
  if (sX < pPersonnelScreenPoints[0].x) {
    sX = pPersonnelScreenPoints[0].x;
  }

  mprintf(sX + iSlot * IMAGE_BOX_WIDTH, CHAR_LOC_Y, sString);

  //
  // Display the mercs FULL name over top of their portrait
  //

  // first get height of text to be displayed
  iHeightOfText = DisplayWrappedString(IMAGE_BOX_X, (IMAGE_BOX_Y + IMAGE_FULL_NAME_OFFSET_Y), IMAGE_NAME_WIDTH, 1, PERS_FONT(), PERS_FONT_COLOR, gMercProfiles[Menptr[iId].ubProfile].zName, 0, false, CENTER_JUSTIFIED | DONT_DISPLAY_TEXT);

  // if the string will rap
  if ((iHeightOfText - 2) > GetFontHeight(PERS_FONT())) {
    // raise where we display it, and rap it
    DisplayWrappedString(IMAGE_BOX_X, (IMAGE_BOX_Y + IMAGE_FULL_NAME_OFFSET_Y - GetFontHeight(PERS_FONT())), IMAGE_NAME_WIDTH, 1, PERS_FONT(), PERS_FONT_COLOR, gMercProfiles[Menptr[iId].ubProfile].zName, 0, false, CENTER_JUSTIFIED);
  } else {
    DrawTextToScreen(gMercProfiles[Menptr[iId].ubProfile].zName, IMAGE_BOX_X, (IMAGE_BOX_Y + IMAGE_FULL_NAME_OFFSET_Y), IMAGE_NAME_WIDTH, PERS_FONT(), PERS_FONT_COLOR, 0, false, CENTER_JUSTIFIED);
  }

  /*
  Moved so the name of the town will be in the same line as the name


          if( Menptr[iId].bAssignment == ASSIGNMENT_POW )
          {
  //		FindFontCenterCoordinates(IMAGE_BOX_X-5,0,IMAGE_BOX_WIDTH, 0,pPOWStrings[ 1 ],CHAR_NAME_FONT, &sX, &sY );
  //	  mprintf(sX+iSlot*IMAGE_BOX_WIDTH, CHAR_NAME_Y+20,pPOWStrings[ 1 ] );
          }
          else if( Menptr[iId].bAssignment == IN_TRANSIT )
          {
                  return;
          }
          else
    {
                  // name of town, if any
                  bTownId = GetTownIdForSector( Menptr[iId].sSectorX, Menptr[iId].sSectorY );

                  if( bTownId != BLANK_SECTOR )
                  {
                          FindFontCenterCoordinates( IMAGE_BOX_X - 5, 0, IMAGE_BOX_WIDTH, 0, pTownNames[ bTownId ], CHAR_NAME_FONT, &sX, &sY );
                          mprintf( sX + ( iSlot * IMAGE_BOX_WIDTH ), CHAR_NAME_Y + 20, pTownNames[ bTownId ]);
                  }
          }
  */

  return;
}

function DisplayCharStats(iId: INT32, iSlot: INT32): void {
  let iCounter: INT32 = 0;
  let sString: wchar_t[] /* [50] */;
  //	wchar_t sStringA[ 50 ];
  let sX: INT16;
  let sY: INT16;
  let uiHits: UINT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = addressof(Menptr[iId]);
  let fAmIaRobot: boolean = AM_A_ROBOT(pSoldier);

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  // display the stats for a char
  for (iCounter = 0; iCounter < MAX_STATS; iCounter++) {
    switch (iCounter) {
      case 0:
        // health
        if (Menptr[iId].bAssignment != Enum117.ASSIGNMENT_POW) {
          if (gMercProfiles[Menptr[iId].ubProfile].bLifeDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bLifeDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }

          // else
          //{
          swprintf(sString, "%d/%d", Menptr[iId].bLife, Menptr[iId].bLifeMax);
          //}
        } else {
          swprintf(sString, pPOWStrings[1]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_HEALTH]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 1:
        // agility
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bAgilityDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bAgilityDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bAgility);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 2:
        // dexterity
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bDexterityDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bDexterityDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bDexterity);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 3:
        // strength
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bStrengthDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bStrengthDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bStrength);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 4:
        // leadership
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bLeadershipDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bLeadershipDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bLeadership);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 5:
        // wisdom
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bWisdomDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bWisdomDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bWisdom);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 6:
        // exper
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bExpLevelDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bExpLevelDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bExpLevel);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 7:
        // mrkmanship
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bMarksmanshipDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bMarksmanshipDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bMarksmanship);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 8:
        // mech
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bMechanicDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bMechanicDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bMechanical);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 9:
        // exp
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bExplosivesDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bExplosivesDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bExplosive);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 10:
        // med
        if (!fAmIaRobot) {
          if (gMercProfiles[Menptr[iId].ubProfile].bMedicalDelta > 0) {
            swprintf(sString, "( %+d )", gMercProfiles[Menptr[iId].ubProfile].bMedicalDelta);
            FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
            mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
          }
          // else
          //{
          swprintf(sString, "%d", Menptr[iId].bMedical);
          //}
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;

      case 14:
        // kills
        mprintf((pPersonnelScreenPoints[21].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[21].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_KILLS]);
        swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].usKills);
        FindFontRightCoordinates((pPersonnelScreenPoints[21].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[21].y, sString);
        break;
      case 15:
        // assists
        mprintf((pPersonnelScreenPoints[22].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[22].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_ASSISTS]);
        swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].usAssists);
        FindFontRightCoordinates((pPersonnelScreenPoints[22].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[22].y, sString);
        break;
      case 16:
        // shots/hits
        mprintf((pPersonnelScreenPoints[23].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[23].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_HIT_PERCENTAGE]);
        uiHits = gMercProfiles[Menptr[iId].ubProfile].usShotsHit;
        uiHits *= 100;

        // check we have shot at least once
        if (gMercProfiles[Menptr[iId].ubProfile].usShotsFired > 0) {
          uiHits /= gMercProfiles[Menptr[iId].ubProfile].usShotsFired;
        } else {
          // no, set hit % to 0
          uiHits = 0;
        }

        swprintf(sString, "%d %%%%", uiHits);
        FindFontRightCoordinates((pPersonnelScreenPoints[23].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        sX += StringPixLength("%", PERS_FONT());
        mprintf(sX, pPersonnelScreenPoints[23].y, sString);
        break;
      case 17:
        // battles
        mprintf((pPersonnelScreenPoints[24].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[24].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_BATTLES]);
        swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].usBattlesFought);
        FindFontRightCoordinates((pPersonnelScreenPoints[24].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[24].y, sString);
        break;
      case 18:
        // wounds
        mprintf((pPersonnelScreenPoints[25].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[25].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_TIMES_WOUNDED]);
        swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].usTimesWounded);
        FindFontRightCoordinates((pPersonnelScreenPoints[25].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[25].y, sString);
        break;

      // The Mercs Skills
      case 19: {
        let iWidth: INT32;
        let iMinimumX: INT32;
        let bScreenLocIndex: INT8 = 19; // if you change the '19', change it below in the if statement

        // Display the 'Skills' text
        mprintf((pPersonnelScreenPoints[bScreenLocIndex].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[bScreenLocIndex].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_SKILLS]);

        // KM: April 16, 1999
        // Added support for the German version, which has potential string overrun problems.  For example, the text "Skills:" can
        // overlap "NightOps (Expert)" because the German strings are much longer.  In these cases, I ensure that the right
        // justification of the traits don't overlap.  If it would, I move it over to the right.
        iWidth = StringPixLength(pPersonnelScreenStrings[Enum110.PRSNL_TXT_SKILLS], PERS_FONT());
        iMinimumX = iWidth + pPersonnelScreenPoints[bScreenLocIndex].x + iSlot * TEXT_BOX_WIDTH + 2;

        if (!fAmIaRobot) {
          let bSkill1: INT8 = gMercProfiles[Menptr[iId].ubProfile].bSkillTrait;
          let bSkill2: INT8 = gMercProfiles[Menptr[iId].ubProfile].bSkillTrait2;

          // if the 2 skills are the same, add the '(expert)' at the end
          if (bSkill1 == bSkill2 && bSkill1 != Enum269.NO_SKILLTRAIT) {
            swprintf(sString, "%s %s", gzMercSkillText[bSkill1], gzMercSkillText[Enum269.NUM_SKILLTRAITS]);

            FindFontRightCoordinates((pPersonnelScreenPoints[bScreenLocIndex].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

            // KM: April 16, 1999
            // Perform the potential overrun check
            if (sX <= iMinimumX) {
              FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + TEXT_BOX_WIDTH - 20 + TEXT_DELTA_OFFSET), 0, 30, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
              sX = Math.max(sX, iMinimumX);
            }

            mprintf(sX, pPersonnelScreenPoints[bScreenLocIndex].y, sString);
          } else {
            // Display the first skill
            if (bSkill1 != Enum269.NO_SKILLTRAIT) {
              swprintf(sString, "%s", gzMercSkillText[bSkill1]);

              FindFontRightCoordinates((pPersonnelScreenPoints[bScreenLocIndex].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

              // KM: April 16, 1999
              // Perform the potential overrun check
              sX = Math.max(sX, iMinimumX);

              mprintf(sX, pPersonnelScreenPoints[bScreenLocIndex].y, sString);

              bScreenLocIndex++;
            }

            // Display the second skill
            if (bSkill2 != Enum269.NO_SKILLTRAIT) {
              swprintf(sString, "%s", gzMercSkillText[bSkill2]);

              FindFontRightCoordinates((pPersonnelScreenPoints[bScreenLocIndex].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

              // KM: April 16, 1999
              // Perform the potential overrun check
              sX = Math.max(sX, iMinimumX);

              mprintf(sX, pPersonnelScreenPoints[bScreenLocIndex].y, sString);

              bScreenLocIndex++;
            }

            // if no skill was displayed
            if (bScreenLocIndex == 19) {
              swprintf(sString, "%s", pPersonnelScreenStrings[Enum110.PRSNL_TXT_NOSKILLS]);

              FindFontRightCoordinates((pPersonnelScreenPoints[bScreenLocIndex].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
              mprintf(sX, pPersonnelScreenPoints[bScreenLocIndex].y, sString);
            }
          }
        } else {
          swprintf(sString, "%s", gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
        }
      } break;
        /*
                         case 19:
                                 // total contract time served
                                mprintf((INT16)(pPersonnelScreenPoints[24].x+(iSlot*TEXT_BOX_WIDTH)),pPersonnelScreenPoints[24].y,pPersonnelScreenStrings[18]);
                                if( gMercProfiles[Menptr[iId].ubProfile].usTotalDaysServed > 0 )
                                {
                                        swprintf(sString, L"%d %s",gMercProfiles[Menptr[iId].ubProfile].usTotalDaysServed - 1, gpStrategicString[ STR_PB_DAYS_ABBREVIATION ] );
                                }
                                else
                                {
                                        swprintf(sString, L"%d %s",gMercProfiles[Menptr[iId].ubProfile].usTotalDaysServed, gpStrategicString[ STR_PB_DAYS_ABBREVIATION ] );
                                }
              FindFontRightCoordinates((INT16)(pPersonnelScreenPoints[24].x+(iSlot*TEXT_BOX_WIDTH)),0,TEXT_BOX_WIDTH-20,0,sString, PERS_FONT,  &sX, &sY);
              mprintf(sX,pPersonnelScreenPoints[24].y,sString);
                         break;
        */
    }
  }
  return;
}

function GetLastMercId(): INT32 {
  // rolls through list of mercs and returns how many on team
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  pSoldier = MercPtrs[0];

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if ((pTeamSoldier.value.bActive) && (pTeamSoldier.value.bLife > 0))
      iCounter++;
  }
  return iCounter;
}

function DrawPageNumber(): void {
  // draws the page number

  let sString: wchar_t[] /* [10] */;
  let sX: INT16;
  let sY: INT16;
  let iPageNumber: INT32;
  let iLastPage: INT32;

  return;

  // get last page number, and current page too
  iLastPage = GetLastMercId() / MAX_SLOTS;
  iPageNumber = iStartPersonId / MAX_SLOTS;
  iPageNumber++;
  if (iLastPage == 0)
    iLastPage++;

  // get current and last pages
  swprintf(sString, "%d/%d", iPageNumber, iLastPage);

  // set up font
  SetFont(PERS_FONT());
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // center
  FindFontCenterCoordinates(PAGE_X, PAGE_Y, PAGE_BOX_WIDTH, PAGE_BOX_HEIGHT, sString, PERS_FONT(), addressof(sX), addressof(sY));

  // print page number
  mprintf(sX, sY, sString);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function SetPersonnelButtonStates(): void {
  // this function will look at what page we are viewing, enable and disable buttons as needed

  if (!PrevPersonnelFace()) {
    // first page, disable left buttons

    //		DisableButton( 	giPersonnelButton[ 2 ] );
    DisableButton(giPersonnelButton[0]);
  } else {
    // enable buttons
    NextPersonnelFace();

    // enable buttons
    //		EnableButton( giPersonnelButton[ 2 ] );
    EnableButton(giPersonnelButton[0]);
  }

  if (!NextPersonnelFace()) {
    //		DisableButton( 	giPersonnelButton[ 3 ] );
    DisableButton(giPersonnelButton[1]);
  } else {
    // decrement page
    PrevPersonnelFace();
    // enable buttons
    //		EnableButton( giPersonnelButton[ 3 ] );
    EnableButton(giPersonnelButton[1]);
  }

  return;
}

function RenderPersonnelScreenBackground(): void {
  let hHandle: HVOBJECT;

  // this fucntion will render the background for the personnel screen
  if (fCurrentTeamMode == true) {
    // blit title
    GetVideoObject(addressof(hHandle), guiCURRENTTEAM);
  } else {
    // blit title
    GetVideoObject(addressof(hHandle), guiDEPARTEDTEAM);
  }

  BltVideoObject(FRAME_BUFFER, hHandle, 0, DEPARTED_X, DEPARTED_Y, VO_BLT_SRCTRANSPARENCY, null);

  return;
}

function LoadPersonnelScreenBackgroundGraphics(): boolean {
  // will load the graphics for the personeel screen background
  let VObjectDesc: VOBJECT_DESC;

  // departed bar
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\departed.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiDEPARTEDTEAM)));

  // current bar
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\CurrentTeam.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiCURRENTTEAM)));

  return true;
}

function DeletePersonnelScreenBackgroundGraphics(): void {
  // delete background V/O's

  DeleteVideoObjectFromIndex(guiCURRENTTEAM);
  DeleteVideoObjectFromIndex(guiDEPARTEDTEAM);
}

function CreateDestroyButtonsForPersonnelDepartures(): void {
  /* static */ let fCreated: boolean = false;

  // create/ destroy personnel departures buttons as needed

  // create button?..if not created
  if ((fCreatePeronnelDepartureButton == true) && (fCreated == false)) {
    fCreated = true;
  } else if ((fCreatePeronnelDepartureButton == false) && (fCreated == true)) {
    fCreated = false;
  }

  return;
}

function GetNumberOfMercsOnPlayersTeam(): INT32 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;

  // grab number on team
  pSoldier = MercPtrs[0];

  // no soldiers

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if ((pTeamSoldier.value.bActive) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && (pTeamSoldier.value.bLife > 0))
      iCounter++;
  }

  return iCounter;
}

function GetNumberOfMercsDeadOrAliveOnPlayersTeam(): INT32 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;

  // grab number on team
  pSoldier = MercPtrs[0];

  // no soldiers

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if ((pTeamSoldier.value.bActive) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE))
      iCounter++;
  }

  return iCounter;
}

function CreateDestroyMouseRegionsForPersonnelPortraits(): void {
  // creates/ destroys mouse regions for portraits

  /* static */ let fCreated: boolean = false;
  let sCounter: INT16 = 0;

  if ((fCreated == false) && (fCreatePersonnelPortraitMouseRegions == true)) {
    // create regions
    for (sCounter = 0; sCounter < PERSONNEL_PORTRAIT_NUMBER; sCounter++) {
      MSYS_DefineRegion(addressof(gPortraitMouseRegions[sCounter]), (SMALL_PORTRAIT_START_X + (sCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_WIDTH), (SMALL_PORTRAIT_START_Y + (sCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_HEIGHT), ((SMALL_PORTRAIT_START_X) + ((sCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_WIDTH) + SMALL_PORTRAIT_WIDTH), (SMALL_PORTRAIT_START_Y + (sCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_HEIGHT + SMALL_PORTRAIT_HEIGHT), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, PersonnelPortraitCallback);
      MSYS_SetRegionUserData(addressof(gPortraitMouseRegions[sCounter]), 0, sCounter);
      MSYS_AddRegion(addressof(gPortraitMouseRegions[sCounter]));
    }

    fCreated = true;
  } else if ((fCreated == true) && (fCreatePersonnelPortraitMouseRegions == false)) {
    // destroy regions
    for (sCounter = 0; sCounter < PERSONNEL_PORTRAIT_NUMBER; sCounter++) {
      MSYS_RemoveRegion(addressof(gPortraitMouseRegions[sCounter]));
    }

    fCreated = false;
  }
  return;
}

function DisplayPicturesOfCurrentTeam(): boolean {
  let iCounter: INT32 = 0;
  let iTotalOnTeam: INT32 = 0;
  let sTemp: char[] /* [100] */;
  let hFaceHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let iId: INT32 = 0;
  let iCnt: INT32 = 0;

  // will display the 20 small portraits of the current team

  // get number of mercs on team
  iTotalOnTeam = GetNumberOfMercsDeadOrAliveOnPlayersTeam();

  if ((iTotalOnTeam == 0) || (fCurrentTeamMode == false)) {
    // nobody on team, leave
    return true;
  }

  pSoldier = MercPtrs[iCounter];

  // start id
  iId = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;

  for (iCounter = 0; iCounter < iTotalOnTeam; iCnt++) {
    if ((MercPtrs[iId + iCnt].value.bActive == true)) {
      // found the next actual guy
      if ((50 < MercPtrs[iId + iCnt].value.ubProfile) && (57 > MercPtrs[iId + iCnt].value.ubProfile)) {
        sprintf(sTemp, "%s%03d.sti", SMALL_FACES_DIR, gMercProfiles[MercPtrs[iId + iCnt].value.ubProfile].ubFaceIndex);
      } else {
        if (Menptr[iId + iCnt].ubProfile < 100) {
          sprintf(sTemp, "%s%02d.sti", SMALL_FACES_DIR, Menptr[iId + iCnt].ubProfile);
        } else {
          sprintf(sTemp, "%s%03d.sti", SMALL_FACES_DIR, Menptr[iId + iCnt].ubProfile);
        }
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP(sTemp, VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFACE)));

      // Blt face to screen to
      GetVideoObject(addressof(hFaceHandle), guiFACE);

      if (Menptr[iId + iCnt].bLife <= 0) {
        hFaceHandle.value.pShades[0] = Create16BPPPaletteShaded(hFaceHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, true);

        // set the red pallete to the face
        SetObjectHandleShade(guiFACE, 0);
      }

      BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, (SMALL_PORTRAIT_START_X + (iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_WIDTH), (SMALL_PORTRAIT_START_Y + (iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);

      if (Menptr[iId + iCnt].bLife <= 0) {
        // if the merc is dead, display it
        DrawTextToScreen(AimPopUpText[Enum357.AIM_MEMBER_DEAD], (SMALL_PORTRAIT_START_X + (iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_WIDTH), (SMALL_PORTRAIT_START_Y + (iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_HEIGHT + SMALL_PORT_HEIGHT / 2), SMALL_PORTRAIT_WIDTH_NO_BORDERS, FONT10ARIAL(), 145, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      }

      DeleteVideoObjectFromIndex(guiFACE);
      iCounter++;
    }
  }

  return true;
}

function PersonnelPortraitCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iPortraitId: INT32 = 0;
  let iOldPortraitId: INT32;

  iPortraitId = MSYS_GetRegionUserData(pRegion, 0);
  iOldPortraitId = iCurrentPersonSelectedId;

  // callback handler for the minize region that is attatched to the laptop program icon
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // get id of portrait

    if (fCurrentTeamMode == true) {
      // valid portrait, set up id
      if (iPortraitId >= GetNumberOfMercsDeadOrAliveOnPlayersTeam()) {
        // not a valid id, leave
        return;
      }

      iCurrentPersonSelectedId = iPortraitId;
      fReDrawScreenFlag = true;
    } else {
      if (iPortraitId >= GetNumberOfPastMercsOnPlayersTeam()) {
        return;
      }
      iCurrentPersonSelectedId = iPortraitId;
      fReDrawScreenFlag = true;
      iCurPortraitId = iPortraitId;
    }

    // if the selected merc is valid, and they are a POW, change to the inventory display
    if (iCurrentPersonSelectedId != -1 && Menptr[GetIdOfThisSlot(iCurrentPersonSelectedId)].bAssignment == Enum117.ASSIGNMENT_POW && gubPersonnelInfoState == Enum108.PERSONNEL_INV_BTN) {
      gubPersonnelInfoState = Enum108.PERSONNEL_STAT_BTN;
    }

    if (iOldPortraitId != iPortraitId) {
      uiCurrentInventoryIndex = 0;
      guiSliderPosition = 0;
    }
  }

  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (fCurrentTeamMode == true) {
      // valid portrait, set up id
      if (iPortraitId >= GetNumberOfMercsDeadOrAliveOnPlayersTeam()) {
        // not a valid id, leave
        return;
      }

      // if the user is rigt clicking on the same face
      if (iCurrentPersonSelectedId == iPortraitId) {
        // increment the info page when the user right clicks
        if (gubPersonnelInfoState < Enum108.PERSONNEL_NUM_BTN - 1)
          gubPersonnelInfoState++;
        else
          gubPersonnelInfoState = Enum108.PERSONNEL_STAT_BTN;
      }

      iCurrentPersonSelectedId = iPortraitId;
      fReDrawScreenFlag = true;

      uiCurrentInventoryIndex = 0;
      guiSliderPosition = 0;

      // if the selected merc is valid, and they are a POW, change to the inventory display
      if (iCurrentPersonSelectedId != -1 && Menptr[GetIdOfThisSlot(iCurrentPersonSelectedId)].bAssignment == Enum117.ASSIGNMENT_POW && gubPersonnelInfoState == Enum108.PERSONNEL_INV_BTN) {
        gubPersonnelInfoState = Enum108.PERSONNEL_STAT_BTN;
      }
    }
  }
}

function DisplayFaceOfDisplayedMerc(): void {
  // valid person?, display

  if (iCurrentPersonSelectedId != -1) {
    // highlight it
    DisplayHighLightBox();

    // if showing inventory, leave

    if (fCurrentTeamMode == true) {
      RenderPersonnelFace(GetIdOfThisSlot(iCurrentPersonSelectedId), 0, false, false, false);
      DisplayCharName(GetIdOfThisSlot(iCurrentPersonSelectedId), 0);

      //			if( fShowInventory == TRUE )
      if (gubPersonnelInfoState == Enum109.PRSNL_INV) {
        return;
      }

      RenderPersonnelStats(GetIdOfThisSlot(iCurrentPersonSelectedId), 0);
    } else {
      RenderPersonnelFace(GetIdOfPastMercInSlot(iCurrentPersonSelectedId), 0, IsPastMercDead(iCurrentPersonSelectedId), IsPastMercFired(iCurrentPersonSelectedId), IsPastMercOther(iCurrentPersonSelectedId));
      DisplayDepartedCharName(GetIdOfPastMercInSlot(iCurrentPersonSelectedId), 0, GetTheStateOfDepartedMerc(GetIdOfPastMercInSlot(iCurrentPersonSelectedId)));

      //			if( fShowInventory == TRUE )
      if (gubPersonnelInfoState == Enum109.PRSNL_INV) {
        return;
      }

      DisplayDepartedCharStats(GetIdOfPastMercInSlot(iCurrentPersonSelectedId), 0, GetTheStateOfDepartedMerc(GetIdOfPastMercInSlot(iCurrentPersonSelectedId)));
    }
  }

  return;
}

function DisplayInventoryForSelectedChar(): void {
  // display the inventory for this merc
  //	if( fShowInventory == FALSE )
  if (gubPersonnelInfoState != Enum109.PRSNL_INV) {
    return;
  }

  CreateDestroyPersonnelInventoryScrollButtons();

  if (fCurrentTeamMode == true) {
    RenderInventoryForCharacter(GetIdOfThisSlot(iCurrentPersonSelectedId), 0);
  } else {
    RenderInventoryForCharacter(GetIdOfPastMercInSlot(iCurrentPersonSelectedId), 0);
  }

  return;
}

function RenderInventoryForCharacter(iId: INT32, iSlot: INT32): void {
  let ubCounter: UINT8 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sIndex: INT16;
  let hHandle: HVOBJECT;
  let pTrav: Pointer<ETRLEObject>;
  let pItem: Pointer<INVTYPE>;
  let PosX: INT16;
  let PosY: INT16;
  let sCenX: INT16;
  let sCenY: INT16;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let ubItemCount: UINT8 = 0;
  let ubUpToCount: UINT8 = 0;
  let sX: INT16;
  let sY: INT16;
  let sString: CHAR16[] /* [128] */;
  let cnt: INT32 = 0;
  let iTotalAmmo: INT32 = 0;

  GetVideoObject(addressof(hHandle), guiPersonnelInventory);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, (397), (200), VO_BLT_SRCTRANSPARENCY, null);

  if (fCurrentTeamMode == false) {
    return;
  }

  // render the bar for the character
  RenderSliderBarForPersonnelInventory();

  pSoldier = addressof(Menptr[iId]);

  // if this is a robot, dont display any inventory
  if (AM_A_ROBOT(pSoldier)) {
    return;
  }

  for (ubCounter = 0; ubCounter < Enum261.NUM_INV_SLOTS; ubCounter++) {
    PosX = 397 + 3;
    PosY = 200 + 8 + (ubItemCount * (29));

    // if the character is a robot, only display the inv for the hand pos
    if (pSoldier.value.ubProfile == Enum268.ROBOT && ubCounter != Enum261.HANDPOS) {
      continue;
    }

    if (pSoldier.value.inv[ubCounter].ubNumberOfObjects) {
      if (uiCurrentInventoryIndex > ubUpToCount) {
        ubUpToCount++;
      } else {
        sIndex = (pSoldier.value.inv[ubCounter].usItem);
        pItem = addressof(Item[sIndex]);

        GetVideoObject(addressof(hHandle), GetInterfaceGraphicForItem(pItem));
        pTrav = addressof(hHandle.value.pETRLEObject[pItem.value.ubGraphicNum]);

        usHeight = pTrav.value.usHeight;
        usWidth = pTrav.value.usWidth;

        sCenX = PosX + (Math.abs(57 - usWidth) / 2) - pTrav.value.sOffsetX;
        sCenY = PosY + (Math.abs(22 - usHeight) / 2) - pTrav.value.sOffsetY;

        // shadow
        // BltVideoObjectOutlineShadowFromIndex( FRAME_BUFFER, GetInterfaceGraphicForItem( pItem ), pItem->ubGraphicNum, sCenX-2, sCenY+2);

        // blt the item
        BltVideoObjectOutlineFromIndex(FRAME_BUFFER, GetInterfaceGraphicForItem(pItem), pItem.value.ubGraphicNum, sCenX, sCenY, 0, false);

        SetFont(FONT10ARIAL());
        SetFontForeground(FONT_WHITE);
        SetFontBackground(FONT_BLACK);
        SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

        // grab item name
        LoadItemInfo(sIndex, sString, null);

        // shorten if needed
        if (StringPixLength(sString, FONT10ARIAL()) > (171 - 75)) {
          ReduceStringLength(sString, (171 - 75), FONT10ARIAL());
        }

        // print name
        mprintf(PosX + 65, PosY + 3, sString);

        // condition
        if (Item[pSoldier.value.inv[ubCounter].usItem].usItemClass & IC_AMMO) {
          // Ammo
          iTotalAmmo = 0;
          if (pSoldier.value.inv[ubCounter].ubNumberOfObjects > 1) {
            for (cnt = 0; cnt < pSoldier.value.inv[ubCounter].ubNumberOfObjects; cnt++) {
              // get total ammo
              iTotalAmmo += pSoldier.value.inv[ubCounter].ubShotsLeft[cnt];
            }
          } else {
            iTotalAmmo = pSoldier.value.inv[ubCounter].ubShotsLeft[0];
          }

          swprintf(sString, "%d/%d", iTotalAmmo, (pSoldier.value.inv[ubCounter].ubNumberOfObjects * Magazine[Item[pSoldier.value.inv[ubCounter].usItem].ubClassIndex].ubMagSize));
          FindFontRightCoordinates((PosX + 65), (PosY + 15), (171 - 75), (GetFontHeight(FONT10ARIAL())), sString, FONT10ARIAL(), addressof(sX), addressof(sY));
        } else {
          swprintf(sString, "%2d%%%%", pSoldier.value.inv[ubCounter].bStatus[0]);
          FindFontRightCoordinates((PosX + 65), (PosY + 15), (171 - 75), (GetFontHeight(FONT10ARIAL())), sString, FONT10ARIAL(), addressof(sX), addressof(sY));

          sX += StringPixLength("%", FONT10ARIAL());
        }

        mprintf(sX, sY, sString);

        if (Item[pSoldier.value.inv[ubCounter].usItem].usItemClass & IC_GUN) {
          swprintf(sString, "%s", AmmoCaliber[Weapon[Item[pSoldier.value.inv[ubCounter].usItem].ubClassIndex].ubCalibre]);

          // shorten if needed
          if (StringPixLength(sString, FONT10ARIAL()) > (171 - 75)) {
            ReduceStringLength(sString, (171 - 75), FONT10ARIAL());
          }

          // print name
          mprintf(PosX + 65, PosY + 15, sString);
        }

        // if more than 1?
        if (pSoldier.value.inv[ubCounter].ubNumberOfObjects > 1) {
          swprintf(sString, "x%d", pSoldier.value.inv[ubCounter].ubNumberOfObjects);
          FindFontRightCoordinates((PosX), (PosY + 15), (58), (GetFontHeight(FONT10ARIAL())), sString, FONT10ARIAL(), addressof(sX), addressof(sY));
          mprintf(sX, sY, sString);
        }

        // display info about it

        ubItemCount++;
      }
    }

    if (ubItemCount == NUMBER_OF_INVENTORY_PERSONNEL) {
      ubCounter = Enum261.NUM_INV_SLOTS;
    }
  }

  return;
}

function InventoryUpButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[0];
  let cnt: INT32 = 0;
  let iId: INT32 = 0;

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & (BUTTON_CLICKED_ON)) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (uiCurrentInventoryIndex == 0) {
        return;
      }

      // up one element
      uiCurrentInventoryIndex--;
      fReDrawScreenFlag = true;

      FindPositionOfPersInvSlider();
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    if (uiCurrentInventoryIndex == 0) {
      return;
    }

    // up one element
    uiCurrentInventoryIndex--;
    fReDrawScreenFlag = true;
    FindPositionOfPersInvSlider();
  }
}

function InventoryDownButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[0];
  let cnt: INT32 = 0;
  let iId: INT32 = 0;

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    if (uiCurrentInventoryIndex >= (GetNumberOfInventoryItemsOnCurrentMerc() - NUMBER_OF_INVENTORY_PERSONNEL)) {
      return;
    }

    // up one element
    uiCurrentInventoryIndex++;
    fReDrawScreenFlag = true;
    FindPositionOfPersInvSlider();
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & (BUTTON_CLICKED_ON)) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (uiCurrentInventoryIndex >= (GetNumberOfInventoryItemsOnCurrentMerc() - NUMBER_OF_INVENTORY_PERSONNEL)) {
        return;
      }

      // up one element
      uiCurrentInventoryIndex++;
      fReDrawScreenFlag = true;

      FindPositionOfPersInvSlider();
    }
  }
}

// decide which buttons can and can't be accessed based on what the current item is
function EnableDisableInventoryScrollButtons(): void {
  //	if( fShowInventory == FALSE )
  if (gubPersonnelInfoState != Enum109.PRSNL_INV) {
    return;
  }

  if (uiCurrentInventoryIndex == 0) {
    ButtonList[giPersonnelInventoryButtons[0]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    DisableButton(giPersonnelInventoryButtons[0]);
  } else {
    EnableButton(giPersonnelInventoryButtons[0]);
  }

  if (uiCurrentInventoryIndex >= (GetNumberOfInventoryItemsOnCurrentMerc() - NUMBER_OF_INVENTORY_PERSONNEL)) {
    ButtonList[giPersonnelInventoryButtons[1]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    DisableButton(giPersonnelInventoryButtons[1]);
  } else {
    EnableButton(giPersonnelInventoryButtons[1]);
  }

  return;
}

function GetNumberOfInventoryItemsOnCurrentMerc(): INT32 {
  let iId: INT32 = 0;
  let ubCounter: UINT8 = 0;
  let ubCount: UINT8 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // in current team mode?..nope...move on
  if (fCurrentTeamMode == false) {
    return 0;
  }

  iId = GetIdOfThisSlot(iCurrentPersonSelectedId);

  pSoldier = addressof(Menptr[iId]);

  for (ubCounter = 0; ubCounter < Enum261.NUM_INV_SLOTS; ubCounter++) {
    if ((pSoldier.value.inv[ubCounter].ubNumberOfObjects) && (pSoldier.value.inv[ubCounter].usItem)) {
      ubCount++;
    }
  }

  return ubCount;
}

function CreateDestroyPersonnelInventoryScrollButtons(): void {
  /* static */ let fCreated: boolean = false;

  //	if( ( fShowInventory == TRUE ) && ( fCreated == FALSE ) )
  if ((gubPersonnelInfoState == Enum109.PRSNL_INV) && (fCreated == false)) {
    // create buttons
    giPersonnelInventoryButtonsImages[0] = LoadButtonImage("LAPTOP\\personnel_inventory.sti", -1, 1, -1, 2, -1);
    giPersonnelInventoryButtons[0] = QuickCreateButton(giPersonnelInventoryButtonsImages[0], 176 + 397, 2 + 200, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, InventoryUpButtonCallback);

    giPersonnelInventoryButtonsImages[1] = LoadButtonImage("LAPTOP\\personnel_inventory.sti", -1, 3, -1, 4, -1);
    giPersonnelInventoryButtons[1] = QuickCreateButton(giPersonnelInventoryButtonsImages[1], 397 + 176, 200 + 223, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, InventoryDownButtonCallback);

    // set up cursors for these buttons
    SetButtonCursor(giPersonnelInventoryButtons[0], Enum317.CURSOR_LAPTOP_SCREEN);
    SetButtonCursor(giPersonnelInventoryButtons[1], Enum317.CURSOR_LAPTOP_SCREEN);

    MSYS_DefineRegion(addressof(gMouseScrollPersonnelINV), X_OF_PERSONNEL_SCROLL_REGION, Y_OF_PERSONNEL_SCROLL_REGION, X_OF_PERSONNEL_SCROLL_REGION + X_SIZE_OF_PERSONNEL_SCROLL_REGION, Y_OF_PERSONNEL_SCROLL_REGION + Y_SIZE_OF_PERSONNEL_SCROLL_REGION, MSYS_PRIORITY_HIGHEST - 3, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, HandleSliderBarClickCallback);

    fCreated = true;
  }
  //	else if( ( fCreated == TRUE ) && ( fShowInventory == FALSE ) )
  else if ((fCreated == true) && (gubPersonnelInfoState != Enum108.PERSONNEL_INV_BTN)) {
    // destroy buttons
    RemoveButton(giPersonnelInventoryButtons[0]);
    UnloadButtonImage(giPersonnelInventoryButtonsImages[0]);
    RemoveButton(giPersonnelInventoryButtons[1]);
    UnloadButtonImage(giPersonnelInventoryButtonsImages[1]);

    MSYS_RemoveRegion(addressof(gMouseScrollPersonnelINV));

    fCreated = false;
  }
}

function DisplayNumberOnCurrentTeam(): void {
  // display number on team
  let sString: CHAR16[] /* [32] */;
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  if (fCurrentTeamMode == true) {
    swprintf(sString, "%s ( %d )", pPersonelTeamStrings[0], GetNumberOfMercsDeadOrAliveOnPlayersTeam());
    sX = PERS_CURR_TEAM_X;
  } else {
    swprintf(sString, "%s", pPersonelTeamStrings[0]);
    FindFontCenterCoordinates(PERS_CURR_TEAM_X, 0, 65, 0, sString, FONT10ARIAL(), addressof(sX), addressof(sY));
  }

  mprintf(sX, PERS_CURR_TEAM_Y, sString);

  // now the cost of the current team, if applicable
  DisplayCostOfCurrentTeam();

  return;
}

function DisplayNumberDeparted(): void {
  // display number departed from team
  let sString: CHAR16[] /* [32] */;
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  if (fCurrentTeamMode == false) {
    swprintf(sString, "%s ( %d )", pPersonelTeamStrings[1], GetNumberOfPastMercsOnPlayersTeam());
    sX = PERS_CURR_TEAM_X;
  } else {
    swprintf(sString, "%s", pPersonelTeamStrings[1]);
    FindFontCenterCoordinates(PERS_CURR_TEAM_X, 0, 65, 0, sString, FONT10ARIAL(), addressof(sX), addressof(sY));
  }

  mprintf(sX, PERS_DEPART_TEAM_Y, sString);

  return;
}

function GetTotalDailyCostOfCurrentTeam(): INT32 {
  // will return the total daily cost of the current team

  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let iCostOfTeam: INT32 = 0;

  // first grunt
  pSoldier = MercPtrs[0];

  // not active?..return cost of zero

  // run through active soldiers
  for (pSoldier = MercPtrs[0]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];

    if ((pSoldier.value.bActive) && (pSoldier.value.bLife > 0)) {
      // valid soldier, get cost
      if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
        // daily rate
        if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_2_WEEK) {
          // 2 week contract
          iCostOfTeam += gMercProfiles[pSoldier.value.ubProfile].uiBiWeeklySalary / 14;
        } else if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_1_WEEK) {
          // 1 week contract
          iCostOfTeam += gMercProfiles[pSoldier.value.ubProfile].uiWeeklySalary / 7;
        } else {
          iCostOfTeam += gMercProfiles[pSoldier.value.ubProfile].sSalary;
        }
      } else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
        // MERC Merc
        iCostOfTeam += gMercProfiles[pSoldier.value.ubProfile].sSalary;
      } else {
        // no cost
        iCostOfTeam += 0;
      }
    }
  }
  return iCostOfTeam;
}

function GetLowestDailyCostOfCurrentTeam(): INT32 {
  // will return the lowest daily cost of the current team

  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let iLowest: INT32 = 999999;
  //	INT32 iId =0;
  let iCost: INT32 = 0;

  // first grunt
  pSoldier = MercPtrs[0];

  // not active?..return cost of zero

  // run through active soldiers
  for (pSoldier = MercPtrs[0]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];

    if ((pSoldier.value.bActive) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier.value.bLife > 0)) {
      // valid soldier, get cost
      if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
        // daily rate
        if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_2_WEEK) {
          // 2 week contract
          iCost = gMercProfiles[pSoldier.value.ubProfile].uiBiWeeklySalary / 14;
        } else if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_1_WEEK) {
          // 1 week contract
          iCost = gMercProfiles[pSoldier.value.ubProfile].uiWeeklySalary / 7;
        } else {
          iCost = gMercProfiles[pSoldier.value.ubProfile].sSalary;
        }
      } else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
        // MERC Merc
        iCost = gMercProfiles[pSoldier.value.ubProfile].sSalary;
      } else {
        // no cost
        iCost = 0;
      }

      if (iCost <= iLowest) {
        iLowest = iCost;
      }
    }
  }

  // if no mercs, send 0
  if (iLowest == 999999) {
    iLowest = 0;
  }

  return iLowest;
}

function GetHighestDailyCostOfCurrentTeam(): INT32 {
  // will return the lowest daily cost of the current team

  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let iHighest: INT32 = 0;
  //	INT32 iId =0;
  let iCost: INT32 = 0;

  // first grunt
  pSoldier = MercPtrs[0];

  // not active?..return cost of zero

  // run through active soldiers
  for (pSoldier = MercPtrs[0]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];

    if ((pSoldier.value.bActive) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && (pSoldier.value.bLife > 0)) {
      // valid soldier, get cost
      if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
        // daily rate
        if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_2_WEEK) {
          // 2 week contract
          iCost = gMercProfiles[pSoldier.value.ubProfile].uiBiWeeklySalary / 14;
        } else if (pSoldier.value.bTypeOfLastContract == Enum161.CONTRACT_EXTEND_1_WEEK) {
          // 1 week contract
          iCost = gMercProfiles[pSoldier.value.ubProfile].uiWeeklySalary / 7;
        } else {
          iCost = gMercProfiles[pSoldier.value.ubProfile].sSalary;
        }
      } else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
        // MERC Merc
        iCost = gMercProfiles[pSoldier.value.ubProfile].sSalary;
      } else {
        // no cost
        iCost = 0;
      }

      if (iCost >= iHighest) {
        iHighest = iCost;
      }
    }
  }
  return iHighest;
}

function DisplayCostOfCurrentTeam(): void {
  // display number on team
  let sString: CHAR16[] /* [32] */;
  let sX: INT16;
  let sY: INT16;

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  if (fCurrentTeamMode == true) {
    // daily cost
    mprintf(PERS_CURR_TEAM_COST_X, PERS_CURR_TEAM_COST_Y, pPersonelTeamStrings[2]);

    swprintf(sString, "%d", GetTotalDailyCostOfCurrentTeam());
    InsertCommasForDollarFigure(sString);
    InsertDollarSignInToString(sString);

    FindFontRightCoordinates((PERS_CURR_TEAM_COST_X), 0, PERS_CURR_TEAM_WIDTH, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_CURR_TEAM_COST_Y, sString);

    // highest cost
    mprintf(PERS_CURR_TEAM_COST_X, PERS_CURR_TEAM_HIGHEST_Y, pPersonelTeamStrings[3]);

    swprintf(sString, "%d", GetHighestDailyCostOfCurrentTeam());
    InsertCommasForDollarFigure(sString);
    InsertDollarSignInToString(sString);

    FindFontRightCoordinates((PERS_CURR_TEAM_COST_X), 0, PERS_CURR_TEAM_WIDTH, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_CURR_TEAM_HIGHEST_Y, sString);

    // the lowest cost
    mprintf(PERS_CURR_TEAM_COST_X, PERS_CURR_TEAM_LOWEST_Y, pPersonelTeamStrings[4]);

    swprintf(sString, "%d", GetLowestDailyCostOfCurrentTeam());
    InsertCommasForDollarFigure(sString);
    InsertDollarSignInToString(sString);

    FindFontRightCoordinates((PERS_CURR_TEAM_COST_X), 0, PERS_CURR_TEAM_WIDTH, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_CURR_TEAM_LOWEST_Y, sString);
  } else {
    // do nothing
    return;
  }
}

function GetIdOfDepartedMercWithHighestStat(iStat: INT32): INT32 {
  // will return the id value of the merc on the players team with highest in this stat
  // -1 means error
  let iId: INT32 = -1;
  let iValue: INT32 = 0;
  let pTeamSoldier: Pointer<MERCPROFILESTRUCT>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let bCurrentList: INT8 = 0;
  let bCurrentListValue: Pointer<INT16> = LaptopSaveInfo.ubDeadCharactersList;
  let fNotDone: boolean = true;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiLoopCounter: UINT32;

  // run through active soldiers
  //	while( fNotDone )
  for (uiLoopCounter = 0; fNotDone; uiLoopCounter++) {
    /*
                    // check if we are in fact not done
                    if( ( bCurrentList == 2 ) && ( *bCurrentListValue == -1 ) )
                    {
                            fNotDone = FALSE;
                            continue;
                    }
    */
    // if we are at the end of
    if (uiLoopCounter == 255 && bCurrentList == 2) {
      fNotDone = false;
      continue;
    }

    // check if we need to move to the next list
    //		if( *bCurrentListValue == -1 )
    if (uiLoopCounter == 255) {
      if (bCurrentList == 0) {
        bCurrentList = 1;
        bCurrentListValue = LaptopSaveInfo.ubLeftCharactersList;
      } else if (bCurrentList == 1) {
        bCurrentList = 2;
        bCurrentListValue = LaptopSaveInfo.ubOtherCharactersList;
      }

      // reset the loop counter
      uiLoopCounter = 0;
    }

    // get the id of the grunt
    cnt = bCurrentListValue.value;

    // do we need to reset the count?
    if (cnt == -1) {
      bCurrentListValue++;
      continue;
    }

    pTeamSoldier = addressof(gMercProfiles[cnt]);

    switch (iStat) {
      case 0:
        // health

        // if the soldier is a pow, dont use the health cause it aint known
        pSoldier = FindSoldierByProfileID(cnt, false);
        if (pSoldier && pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
          continue;
        }

        if (pTeamSoldier.value.bLife >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bLife;
        }
        break;
      case 1:
        // agility
        if (pTeamSoldier.value.bAgility >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bAgility;
        }
        break;
      case 2:
        // dexterity
        if (pTeamSoldier.value.bDexterity >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bDexterity;
        }
        break;
      case 3:
        // strength
        if (pTeamSoldier.value.bStrength >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bStrength;
        }
        break;
      case 4:
        // leadership
        if (pTeamSoldier.value.bLeadership >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bLeadership;
        }
        break;
      case 5:
        // wisdom
        if (pTeamSoldier.value.bWisdom >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bWisdom;
        }
        break;
      case 6:
        // exper
        if (pTeamSoldier.value.bExpLevel >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bExpLevel;
        }

        break;
      case 7:
        // mrkmanship
        if (pTeamSoldier.value.bMarksmanship >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bMarksmanship;
        }

        break;
      case 8:
        // mech
        if (pTeamSoldier.value.bMechanical >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bMechanical;
        }
        break;
      case 9:
        // exp
        if (pTeamSoldier.value.bExplosive >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bExplosive;
        }
        break;
      case 10:
        // med
        if (pTeamSoldier.value.bMedical >= iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bMedical;
        }
        break;
    }

    bCurrentListValue++;
  }

  return iId;
}

function GetIdOfDepartedMercWithLowestStat(iStat: INT32): INT32 {
  // will return the id value of the merc on the players team with highest in this stat
  // -1 means error
  let iId: INT32 = -1;
  let iValue: INT32 = 9999999;
  let pTeamSoldier: Pointer<MERCPROFILESTRUCT>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let bCurrentList: INT8 = 0;
  let bCurrentListValue: Pointer<INT16> = LaptopSaveInfo.ubDeadCharactersList;
  let fNotDone: boolean = true;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiLoopCounter: UINT32;

  // run through active soldiers
  //	while( fNotDone )
  for (uiLoopCounter = 0; fNotDone; uiLoopCounter++) {
    /*
                    // check if we are in fact not done
                    if( ( bCurrentList == 2 ) && ( *bCurrentListValue == -1 ) )
                    {
                            fNotDone = FALSE;
                            continue;
                    }
    */
    // if we are at the end of
    if (uiLoopCounter == 255 && bCurrentList == 2) {
      fNotDone = false;
      continue;
    }

    // check if we need to move to the next list
    //		if( *bCurrentListValue == -1 )
    if (uiLoopCounter == 255) {
      if (bCurrentList == 0) {
        bCurrentList = 1;
        bCurrentListValue = LaptopSaveInfo.ubLeftCharactersList;
      } else if (bCurrentList == 1) {
        bCurrentList = 2;
        bCurrentListValue = LaptopSaveInfo.ubOtherCharactersList;
      }

      // reset the loop counter
      uiLoopCounter = 0;
    }

    // get the id of the grunt
    cnt = bCurrentListValue.value;

    // do we need to reset the count?
    if (cnt == -1) {
      bCurrentListValue++;
      continue;
    }

    pTeamSoldier = addressof(gMercProfiles[cnt]);

    switch (iStat) {
      case 0:
        // health

        pSoldier = FindSoldierByProfileID(cnt, false);
        if (pSoldier && pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
          continue;
        }

        if (pTeamSoldier.value.bLife < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bLife;
        }
        break;
      case 1:
        // agility
        if (pTeamSoldier.value.bAgility < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bAgility;
        }
        break;
      case 2:
        // dexterity
        if (pTeamSoldier.value.bDexterity < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bDexterity;
        }
        break;
      case 3:
        // strength
        if (pTeamSoldier.value.bStrength < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bStrength;
        }
        break;
      case 4:
        // leadership
        if (pTeamSoldier.value.bLeadership < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bLeadership;
        }
        break;
      case 5:
        // wisdom
        if (pTeamSoldier.value.bWisdom < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bWisdom;
        }
        break;
      case 6:
        // exper
        if (pTeamSoldier.value.bExpLevel < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bExpLevel;
        }

        break;
      case 7:
        // mrkmanship
        if (pTeamSoldier.value.bMarksmanship < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bMarksmanship;
        }

        break;
      case 8:
        // mech
        if (pTeamSoldier.value.bMechanical < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bMechanical;
        }
        break;
      case 9:
        // exp
        if (pTeamSoldier.value.bExplosive < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bExplosive;
        }
        break;
      case 10:
        // med
        if (pTeamSoldier.value.bMedical < iValue) {
          iId = cnt;
          iValue = pTeamSoldier.value.bMedical;
        }
        break;
    }

    bCurrentListValue++;
  }

  return iId;
}

function GetIdOfMercWithHighestStat(iStat: INT32): INT32 {
  // will return the id value of the merc on the players team with highest in this stat
  // -1 means error
  let iId: INT32 = -1;
  let iValue: INT32 = 0;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;

  // first grunt
  pSoldier = MercPtrs[0];

  // run through active soldiers
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if ((pTeamSoldier.value.bActive) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && (pTeamSoldier.value.bLife > 0) && !AM_A_ROBOT(pTeamSoldier)) {
      switch (iStat) {
        case 0:
          // health
          if (pTeamSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
            continue;
          }

          if (pTeamSoldier.value.bLifeMax >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bLifeMax;
          }
          break;
        case 1:
          // agility
          if (pTeamSoldier.value.bAgility >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bAgility;
          }
          break;
        case 2:
          // dexterity
          if (pTeamSoldier.value.bDexterity >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bDexterity;
          }
          break;
        case 3:
          // strength
          if (pTeamSoldier.value.bStrength >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bStrength;
          }
          break;
        case 4:
          // leadership
          if (pTeamSoldier.value.bLeadership >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bLeadership;
          }
          break;
        case 5:
          // wisdom
          if (pTeamSoldier.value.bWisdom >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bWisdom;
          }
          break;
        case 6:
          // exper
          if (pTeamSoldier.value.bExpLevel >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bExpLevel;
          }

          break;
        case 7:
          // mrkmanship
          if (pTeamSoldier.value.bMarksmanship >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bMarksmanship;
          }

          break;
        case 8:
          // mech
          if (pTeamSoldier.value.bMechanical >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bMechanical;
          }
          break;
        case 9:
          // exp
          if (pTeamSoldier.value.bExplosive >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bExplosive;
          }
          break;
        case 10:
          // med
          if (pTeamSoldier.value.bMedical >= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bMedical;
          }
          break;
      }
    }
  }

  return iId;
}

function GetIdOfMercWithLowestStat(iStat: INT32): INT32 {
  // will return the id value of the merc on the players team with highest in this stat
  // -1 means error
  let iId: INT32 = -1;
  let iValue: INT32 = 999999;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;

  // first grunt
  pSoldier = MercPtrs[0];

  // run through active soldiers
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if ((pTeamSoldier.value.bActive) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && (pTeamSoldier.value.bLife > 0) && !AM_A_ROBOT(pTeamSoldier)) {
      switch (iStat) {
        case 0:
          // health

          if (pTeamSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
            continue;
          }

          if (pTeamSoldier.value.bLifeMax <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bLifeMax;
          }
          break;
        case 1:
          // agility
          if (pTeamSoldier.value.bAgility <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bAgility;
          }
          break;
        case 2:
          // dexterity
          if (pTeamSoldier.value.bDexterity <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bDexterity;
          }
          break;
        case 3:
          // strength
          if (pTeamSoldier.value.bStrength <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bStrength;
          }
          break;
        case 4:
          // leadership
          if (pTeamSoldier.value.bLeadership <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bLeadership;
          }
          break;
        case 5:
          // wisdom
          if (pTeamSoldier.value.bWisdom <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bWisdom;
          }
          break;
        case 6:
          // exper
          if (pTeamSoldier.value.bExpLevel <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bExpLevel;
          }

          break;
        case 7:
          // mrkmanship
          if (pTeamSoldier.value.bMarksmanship <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bMarksmanship;
          }

          break;
        case 8:
          // mech
          if (pTeamSoldier.value.bMechanical <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bMechanical;
          }
          break;
        case 9:
          // exp
          if (pTeamSoldier.value.bExplosive <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bExplosive;
          }
          break;
        case 10:
          // med
          if (pTeamSoldier.value.bMedical <= iValue) {
            iId = cnt;
            iValue = pTeamSoldier.value.bMedical;
          }
          break;
      }
    }
  }

  return iId;
}

function GetAvgStatOfCurrentTeamStat(iStat: INT32): INT32 {
  // will return the id value of the merc on the players team with highest in this stat
  // -1 means error
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iTotalStatValue: INT32 = 0;
  let bNumberOfPows: INT8 = 0;
  let ubNumberOfMercsInCalculation: UINT8 = 0;

  // first grunt
  pSoldier = MercPtrs[0];

  // run through active soldiers
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if ((pTeamSoldier.value.bActive) && (pTeamSoldier.value.bLife > 0) && !AM_A_ROBOT(pTeamSoldier)) {
      switch (iStat) {
        case 0:
          // health

          // if this is a pow, dont count his stats
          if (pTeamSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
            bNumberOfPows++;
            continue;
          }

          iTotalStatValue += pTeamSoldier.value.bLifeMax;

          break;
        case 1:
          // agility
          iTotalStatValue += pTeamSoldier.value.bAgility;

          break;
        case 2:
          // dexterity
          iTotalStatValue += pTeamSoldier.value.bDexterity;

          break;
        case 3:
          // strength
          iTotalStatValue += pTeamSoldier.value.bStrength;

          break;
        case 4:
          // leadership
          iTotalStatValue += pTeamSoldier.value.bLeadership;

          break;
        case 5:
          // wisdom

          iTotalStatValue += pTeamSoldier.value.bWisdom;
          break;
        case 6:
          // exper

          iTotalStatValue += pTeamSoldier.value.bExpLevel;

          break;
        case 7:
          // mrkmanship

          iTotalStatValue += pTeamSoldier.value.bMarksmanship;

          break;
        case 8:
          // mech

          iTotalStatValue += pTeamSoldier.value.bMechanical;
          break;
        case 9:
          // exp

          iTotalStatValue += pTeamSoldier.value.bExplosive;
          break;
        case 10:
          // med

          iTotalStatValue += pTeamSoldier.value.bMedical;
          break;
      }

      ubNumberOfMercsInCalculation++;
    }
  }

  // if the stat is health, and there are only pow's
  if (GetNumberOfMercsOnPlayersTeam() != 0 && GetNumberOfMercsOnPlayersTeam() == bNumberOfPows && iStat == 0) {
    return -1;
  } else if ((ubNumberOfMercsInCalculation - bNumberOfPows) > 0) {
    return iTotalStatValue / (ubNumberOfMercsInCalculation - bNumberOfPows);
  } else {
    return 0;
  }
}

function GetAvgStatOfPastTeamStat(iStat: INT32): INT32 {
  // will return the id value of the merc on the players team with highest in this stat
  // -1 means error
  let cnt: INT32 = 0;
  let iTotalStatValue: INT32 = 0;
  let iId: INT32 = -1;
  let pTeamSoldier: Pointer<MERCPROFILESTRUCT>;
  let iCounter: INT32 = 0;
  let bCurrentList: INT8 = 0;
  let bCurrentListValue: Pointer<INT16> = LaptopSaveInfo.ubDeadCharactersList;
  let fNotDone: boolean = true;
  let uiLoopCounter: UINT32;

  // run through active soldiers

  // while( fNotDone )
  for (uiLoopCounter = 0; fNotDone; uiLoopCounter++) {
    /*
                    // check if we are in fact not done
                    if( ( bCurrentList == 2 ) && ( *bCurrentListValue == -1 ) )
                    {
                            fNotDone = FALSE;
                            continue;
                    }
    */

    // if we are at the end of
    if (uiLoopCounter == 255 && bCurrentList == 2) {
      fNotDone = false;
      continue;
    }

    // check if we need to move to the next list
    //		if( *bCurrentListValue == -1 )
    if (uiLoopCounter == 255) {
      if (bCurrentList == 0) {
        bCurrentList = 1;
        bCurrentListValue = LaptopSaveInfo.ubLeftCharactersList;
      } else if (bCurrentList == 1) {
        bCurrentList = 2;
        bCurrentListValue = LaptopSaveInfo.ubOtherCharactersList;
      }

      // reset the loop counter
      uiLoopCounter = 0;
    }

    // get the id of the grunt
    cnt = bCurrentListValue.value;

    // do we need to reset the count?
    if (cnt == -1) {
      bCurrentListValue++;
      continue;
    }

    pTeamSoldier = addressof(gMercProfiles[cnt]);

    switch (iStat) {
      case 0:
        // health

        iTotalStatValue += pTeamSoldier.value.bLife;

        break;
      case 1:
        // agility

        iTotalStatValue += pTeamSoldier.value.bAgility;

        break;
      case 2:
        // dexterity

        iTotalStatValue += pTeamSoldier.value.bDexterity;

        break;
      case 3:
        // strength

        iTotalStatValue += pTeamSoldier.value.bStrength;

        break;
      case 4:
        // leadership

        iTotalStatValue += pTeamSoldier.value.bLeadership;

        break;
      case 5:
        // wisdom

        iTotalStatValue += pTeamSoldier.value.bWisdom;

        break;
      case 6:
        // exper

        iTotalStatValue += pTeamSoldier.value.bExpLevel;

        break;
      case 7:
        // mrkmanship

        iId = cnt;
        iTotalStatValue += pTeamSoldier.value.bMarksmanship;

        break;
      case 8:
        // mech

        iTotalStatValue += pTeamSoldier.value.bMechanical;

        break;
      case 9:
        // exp

        iTotalStatValue += pTeamSoldier.value.bExplosive;

        break;
      case 10:
        // med

        iTotalStatValue += pTeamSoldier.value.bMedical;
        break;
    }

    bCurrentListValue++;
  }

  if (GetNumberOfPastMercsOnPlayersTeam() > 0) {
    return iTotalStatValue / GetNumberOfPastMercsOnPlayersTeam();
  } else {
    return 0;
  }
}

function DisplayAverageStatValuesForCurrentTeam(): void {
  // will display the average values for stats for the current team
  let sX: INT16;
  let sY: INT16;
  let iCounter: INT32 = 0;
  let sString: CHAR16[] /* [32] */;

  // set up font
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  // display header

  // center
  FindFontCenterCoordinates(PERS_STAT_AVG_X, 0, PERS_STAT_AVG_WIDTH, 0, pPersonnelCurrentTeamStatsStrings[1], FONT10ARIAL(), addressof(sX), addressof(sY));

  mprintf(sX, PERS_STAT_AVG_Y, pPersonnelCurrentTeamStatsStrings[1]);

  // nobody on team leave
  if ((GetNumberOfMercsDeadOrAliveOnPlayersTeam() == 0) && (fCurrentTeamMode == true)) {
    return;
  }

  // check if in past team and nobody on past team
  if ((GetNumberOfPastMercsOnPlayersTeam() == 0) && (fCurrentTeamMode == false)) {
    return;
  }

  for (iCounter = 0; iCounter < 11; iCounter++) {
    // even or odd?..color black or yellow?
    if (iCounter % 2 == 0) {
      SetFontForeground(PERS_TEXT_FONT_ALTERNATE_COLOR);
    } else {
      SetFontForeground(PERS_TEXT_FONT_COLOR);
    }

    if (fCurrentTeamMode == true) {
      let iValue: INT32 = GetAvgStatOfCurrentTeamStat(iCounter);

      // if there are no values
      if (iValue == -1)
        swprintf(sString, "%s", pPOWStrings[1]);
      else
        swprintf(sString, "%d", iValue);
    } else {
      swprintf(sString, "%d", GetAvgStatOfPastTeamStat(iCounter));
    }
    // center
    FindFontCenterCoordinates(PERS_STAT_AVG_X, 0, PERS_STAT_AVG_WIDTH, 0, sString, FONT10ARIAL(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_STAT_AVG_Y + (iCounter + 1) * (GetFontHeight(FONT10ARIAL()) + 3), sString);
  }

  return;
}

function DisplayLowestStatValuesForCurrentTeam(): void {
  // will display the average values for stats for the current team
  let sX: INT16;
  let sY: INT16;
  let iCounter: INT32 = 0;
  let sString: CHAR16[] /* [32] */;
  let iStat: INT32 = 0;
  let iDepartedId: INT32 = 0;
  let iId: INT32 = 0;

  // set up font
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  // display header

  // center
  FindFontCenterCoordinates(PERS_STAT_LOWEST_X, 0, PERS_STAT_LOWEST_WIDTH, 0, pPersonnelCurrentTeamStatsStrings[0], FONT10ARIAL(), addressof(sX), addressof(sY));

  mprintf(sX, PERS_STAT_AVG_Y, pPersonnelCurrentTeamStatsStrings[0]);

  // nobody on team leave
  if ((GetNumberOfMercsOnPlayersTeam() == 0) && (fCurrentTeamMode == true)) {
    return;
  }

  if ((GetNumberOfPastMercsOnPlayersTeam() == 0) && (fCurrentTeamMode == false)) {
    return;
  }

  for (iCounter = 0; iCounter < 11; iCounter++) {
    if (fCurrentTeamMode == true) {
      iId = GetIdOfMercWithLowestStat(iCounter);
      //			if( iId == -1 )
      //				continue;
    } else {
      iDepartedId = GetIdOfDepartedMercWithLowestStat(iCounter);
      if (iDepartedId == -1)
        continue;
    }

    // even or odd?..color black or yellow?
    if (iCounter % 2 == 0) {
      SetFontForeground(PERS_TEXT_FONT_ALTERNATE_COLOR);
    } else {
      SetFontForeground(PERS_TEXT_FONT_COLOR);
    }

    if (fCurrentTeamMode == true) {
      // get name
      if (iId == -1)
        swprintf(sString, "%s", pPOWStrings[1]);
      else
        swprintf(sString, "%s", MercPtrs[iId].value.name);
    } else {
      // get name
      swprintf(sString, "%s", gMercProfiles[iDepartedId].zNickname);
    }
    // print name
    mprintf(PERS_STAT_LOWEST_X, PERS_STAT_AVG_Y + (iCounter + 1) * (GetFontHeight(FONT10ARIAL()) + 3), sString);

    switch (iCounter) {
      case 0:
        // health
        if (fCurrentTeamMode == true) {
          if (iId == -1)
            iStat = -1;
          else
            iStat = MercPtrs[iId].value.bLifeMax;
        } else {
          iStat = gMercProfiles[iDepartedId].bLife;
        }
        break;
      case 1:
        // agility
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bAgility;
        } else {
          iStat = gMercProfiles[iDepartedId].bAgility;
        }

        break;
      case 2:
        // dexterity
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bDexterity;
        } else {
          iStat = gMercProfiles[iDepartedId].bDexterity;
        }

        break;
      case 3:
        // strength
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bStrength;
        } else {
          iStat = gMercProfiles[iDepartedId].bStrength;
        }

        break;
      case 4:
        // leadership
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bLeadership;
        } else {
          iStat = gMercProfiles[iDepartedId].bLeadership;
        }
        break;
      case 5:
        // wisdom
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bWisdom;
        } else {
          iStat = gMercProfiles[iDepartedId].bWisdom;
        }
        break;
      case 6:
        // exper
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bExpLevel;
        } else {
          iStat = gMercProfiles[iDepartedId].bExpLevel;
        }
        break;
      case 7:
        // mrkmanship
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bMarksmanship;
        } else {
          iStat = gMercProfiles[iDepartedId].bMarksmanship;
        }
        break;
      case 8:
        // mech
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bMechanical;
        } else {
          iStat = gMercProfiles[iDepartedId].bMechanical;
        }
        break;
      case 9:
        // exp
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bExplosive;
        } else {
          iStat = gMercProfiles[iDepartedId].bExplosive;
        }
        break;
      case 10:
        // med
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bMedical;
        } else {
          iStat = gMercProfiles[iDepartedId].bMedical;
        }
        break;
    }

    if (iStat == -1)
      swprintf(sString, "%s", pPOWStrings[1]);
    else
      swprintf(sString, "%d", iStat);

    // right justify
    FindFontRightCoordinates(PERS_STAT_LOWEST_X, 0, PERS_STAT_LOWEST_WIDTH, 0, sString, FONT10ARIAL(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_STAT_AVG_Y + (iCounter + 1) * (GetFontHeight(FONT10ARIAL()) + 3), sString);
  }

  return;
}

function DisplayHighestStatValuesForCurrentTeam(): void {
  // will display the average values for stats for the current team
  let sX: INT16;
  let sY: INT16;
  let iCounter: INT32 = 0;
  let sString: CHAR16[] /* [32] */;
  let iStat: INT32 = 0;
  let iId: INT32 = 0;

  // set up font
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  // display header

  // center
  FindFontCenterCoordinates(PERS_STAT_HIGHEST_X, 0, PERS_STAT_LOWEST_WIDTH, 0, pPersonnelCurrentTeamStatsStrings[2], FONT10ARIAL(), addressof(sX), addressof(sY));

  mprintf(sX, PERS_STAT_AVG_Y, pPersonnelCurrentTeamStatsStrings[2]);

  // nobody on team leave
  if ((GetNumberOfMercsOnPlayersTeam() == 0) && (fCurrentTeamMode == true)) {
    return;
  }

  if ((GetNumberOfPastMercsOnPlayersTeam() == 0) && (fCurrentTeamMode == false)) {
    return;
  }

  for (iCounter = 0; iCounter < 11; iCounter++) {
    if (fCurrentTeamMode == true)
      iId = GetIdOfMercWithHighestStat(iCounter);
    else
      iId = GetIdOfDepartedMercWithHighestStat(iCounter);

    //		if( iId == -1 )
    //			continue;

    // even or odd?..color black or yellow?
    if (iCounter % 2 == 0) {
      SetFontForeground(PERS_TEXT_FONT_ALTERNATE_COLOR);
    } else {
      SetFontForeground(PERS_TEXT_FONT_COLOR);
    }

    if (fCurrentTeamMode == true) {
      // get name
      if (iId == -1)
        swprintf(sString, "%s", pPOWStrings[1]);
      else
        swprintf(sString, "%s", MercPtrs[iId].value.name);
    } else {
      // get name
      swprintf(sString, "%s", gMercProfiles[iId].zNickname);
    }
    // print name
    mprintf(PERS_STAT_HIGHEST_X, PERS_STAT_AVG_Y + (iCounter + 1) * (GetFontHeight(FONT10ARIAL()) + 3), sString);

    switch (iCounter) {
      case 0:
        // health
        if (fCurrentTeamMode == true) {
          if (iId == -1)
            iStat = -1;
          else
            iStat = MercPtrs[iId].value.bLifeMax;
        } else {
          iStat = gMercProfiles[iId].bLife;
        }
        break;
      case 1:
        // agility
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bAgility;
        } else {
          iStat = gMercProfiles[iId].bAgility;
        }

        break;
      case 2:
        // dexterity
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bDexterity;
        } else {
          iStat = gMercProfiles[iId].bDexterity;
        }

        break;
      case 3:
        // strength
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bStrength;
        } else {
          iStat = gMercProfiles[iId].bStrength;
        }

        break;
      case 4:
        // leadership
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bLeadership;
        } else {
          iStat = gMercProfiles[iId].bLeadership;
        }
        break;
      case 5:
        // wisdom
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bWisdom;
        } else {
          iStat = gMercProfiles[iId].bWisdom;
        }
        break;
      case 6:
        // exper
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bExpLevel;
        } else {
          iStat = gMercProfiles[iId].bExpLevel;
        }
        break;
      case 7:
        // mrkmanship
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bMarksmanship;
        } else {
          iStat = gMercProfiles[iId].bMarksmanship;
        }
        break;
      case 8:
        // mech
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bMechanical;
        } else {
          iStat = gMercProfiles[iId].bMechanical;
        }
        break;
      case 9:
        // exp
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bExplosive;
        } else {
          iStat = gMercProfiles[iId].bExplosive;
        }
        break;
      case 10:
        // med
        if (fCurrentTeamMode == true) {
          iStat = MercPtrs[iId].value.bMedical;
        } else {
          iStat = gMercProfiles[iId].bMedical;
        }
        break;
    }

    if (iStat == -1)
      swprintf(sString, "%s", pPOWStrings[1]);
    else
      swprintf(sString, "%d", iStat);

    // right justify
    FindFontRightCoordinates(PERS_STAT_HIGHEST_X, 0, PERS_STAT_LOWEST_WIDTH, 0, sString, FONT10ARIAL(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_STAT_AVG_Y + (iCounter + 1) * (GetFontHeight(FONT10ARIAL()) + 3), sString);
  }

  return;
}

function DisplayPersonnelTeamStats(): void {
  // displays the stat title for each row in the team stat list
  let iCounter: INT32 = 0;

  // set up font
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(FONT_WHITE);

  // display titles for each row
  for (iCounter = 0; iCounter < 11; iCounter++) {
    // even or odd?..color black or yellow?
    if (iCounter % 2 == 0) {
      SetFontForeground(PERS_TEXT_FONT_ALTERNATE_COLOR);
    } else {
      SetFontForeground(PERS_TEXT_FONT_COLOR);
    }

    mprintf(PERS_STAT_LIST_X, PERS_STAT_AVG_Y + (iCounter + 1) * (GetFontHeight(FONT10ARIAL()) + 3), pPersonnelTeamStatsStrings[iCounter]);
  }

  return;
}

function GetNumberOfPastMercsOnPlayersTeam(): INT32 {
  let iPastNumberOfMercs: INT32 = 0;
  let iCounter: INT32 = 0;
  // will run through the alist of past mercs on the players team and return thier number

  // dead
  iPastNumberOfMercs += GetNumberOfDeadOnPastTeam();

  // left
  iPastNumberOfMercs += GetNumberOfLeftOnPastTeam();

  // other
  iPastNumberOfMercs += GetNumberOfOtherOnPastTeam();

  return iPastNumberOfMercs;
}

function InitPastCharactersList(): void {
  // inits the past characters list
  memset(addressof(LaptopSaveInfo.ubDeadCharactersList), -1, sizeof(LaptopSaveInfo.ubDeadCharactersList));
  memset(addressof(LaptopSaveInfo.ubLeftCharactersList), -1, sizeof(LaptopSaveInfo.ubLeftCharactersList));
  memset(addressof(LaptopSaveInfo.ubOtherCharactersList), -1, sizeof(LaptopSaveInfo.ubOtherCharactersList));

  return;
}

function GetNumberOfDeadOnPastTeam(): INT32 {
  let iNumberDead: INT32 = 0;
  let iCounter: INT32 = 0;

  //	for( iCounter = 0; ( ( iCounter < 256) && ( LaptopSaveInfo.ubDeadCharactersList[ iCounter ] != -1 ) ) ; iCounter ++ )
  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubDeadCharactersList[iCounter] != -1)
      iNumberDead++;
  }

  return iNumberDead;
}

function GetNumberOfLeftOnPastTeam(): INT32 {
  let iNumberLeft: INT32 = 0;
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubLeftCharactersList[iCounter] != -1)
      iNumberLeft++;
  }

  return iNumberLeft;
}

function GetNumberOfOtherOnPastTeam(): INT32 {
  let iNumberOther: INT32 = 0;
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubOtherCharactersList[iCounter] != -1)
      iNumberOther++;
  }

  return iNumberOther;
}

function DisplayStateOfPastTeamMembers(): void {
  let sX: INT16;
  let sY: INT16;
  let sString: CHAR16[] /* [32] */;

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  // diplsya numbers fired, dead and othered
  if (fCurrentTeamMode == false) {
    // dead
    mprintf(PERS_CURR_TEAM_COST_X, PERS_CURR_TEAM_COST_Y, pPersonelTeamStrings[5]);
    swprintf(sString, "%d", GetNumberOfDeadOnPastTeam());

    FindFontRightCoordinates((PERS_CURR_TEAM_COST_X), 0, PERS_DEPART_TEAM_WIDTH, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_CURR_TEAM_COST_Y, sString);

    // fired
    mprintf(PERS_CURR_TEAM_COST_X, PERS_CURR_TEAM_HIGHEST_Y, pPersonelTeamStrings[6]);
    swprintf(sString, "%d", GetNumberOfLeftOnPastTeam());

    FindFontRightCoordinates((PERS_CURR_TEAM_COST_X), 0, PERS_DEPART_TEAM_WIDTH, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_CURR_TEAM_HIGHEST_Y, sString);

    // other
    mprintf(PERS_CURR_TEAM_COST_X, PERS_CURR_TEAM_LOWEST_Y, pPersonelTeamStrings[7]);
    swprintf(sString, "%d", GetNumberOfOtherOnPastTeam());

    FindFontRightCoordinates((PERS_CURR_TEAM_COST_X), 0, PERS_DEPART_TEAM_WIDTH, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, PERS_CURR_TEAM_LOWEST_Y, sString);
  } else {
    // do nothing
  }
  return;
}

function CreateDestroyCurrentDepartedMouseRegions(): void {
  /* static */ let fCreated: boolean = false;

  // will arbitrate the creation/deletion of mouse regions for current/past team toggles

  if ((fCreateRegionsForPastCurrentToggle == true) && (fCreated == false)) {
    // not created, create
    MSYS_DefineRegion(addressof(gTogglePastCurrentTeam[0]), PERS_TOGGLE_CUR_DEPART_X, PERS_TOGGLE_CUR_Y, PERS_TOGGLE_CUR_DEPART_X + PERS_TOGGLE_CUR_DEPART_WIDTH, PERS_TOGGLE_CUR_Y + PERS_TOGGLE_CUR_DEPART_HEIGHT, MSYS_PRIORITY_HIGHEST - 3, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, PersonnelCurrentTeamCallback);

    MSYS_AddRegion(addressof(gTogglePastCurrentTeam[0]));

    MSYS_DefineRegion(addressof(gTogglePastCurrentTeam[1]), PERS_TOGGLE_CUR_DEPART_X, PERS_TOGGLE_DEPART_Y, PERS_TOGGLE_CUR_DEPART_X + PERS_TOGGLE_CUR_DEPART_WIDTH, PERS_TOGGLE_DEPART_Y + PERS_TOGGLE_CUR_DEPART_HEIGHT, MSYS_PRIORITY_HIGHEST - 3, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, PersonnelDepartedTeamCallback);

    MSYS_AddRegion(addressof(gTogglePastCurrentTeam[1]));

    fCreated = true;
  } else if ((fCreateRegionsForPastCurrentToggle == false) && (fCreated == true)) {
    // created, get rid of

    MSYS_RemoveRegion(addressof(gTogglePastCurrentTeam[0]));
    MSYS_RemoveRegion(addressof(gTogglePastCurrentTeam[1]));
    fCreated = false;
  }

  return;
}

function PersonnelCurrentTeamCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    fCurrentTeamMode = true;

    if (fCurrentTeamMode == true) {
      iCurrentPersonSelectedId = -1;

      // how many people do we have?..if you have someone set default to 0
      if (GetNumberOfMercsDeadOrAliveOnPlayersTeam() > 0) {
        // get id of first merc in list

        iCurrentPersonSelectedId = GetIdOfFirstDisplayedMerc();
      }
    }

    fCurrentTeamMode = true;
    fReDrawScreenFlag = true;
  }
}

function PersonnelDepartedTeamCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    fCurrentTeamMode = false;

    if (fCurrentTeamMode == false) {
      iCurrentPersonSelectedId = -1;

      // how many departed people?
      if (GetNumberOfPastMercsOnPlayersTeam() > 0) {
        iCurrentPersonSelectedId = 0;
      }

      // Switch the panel on the right to be the stat panel
      gubPersonnelInfoState = Enum108.PERSONNEL_STAT_BTN;
    }

    fReDrawScreenFlag = true;
  }
}

function CreateDestroyButtonsForDepartedTeamList(): void {
  // creates/ destroys the buttons for cdeparted team list
  /* static */ let fCreated: boolean = false;

  if ((fCurrentTeamMode == false) && (fCreated == false)) {
    // not created. create
    giPersonnelButtonImage[4] = LoadButtonImage("LAPTOP\\departuresbuttons.sti", -1, 0, -1, 2, -1);
    giPersonnelButton[4] = QuickCreateButton(giPersonnelButtonImage[4], PERS_DEPARTED_UP_X, PERS_DEPARTED_UP_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, DepartedUpCallBack);

    // right button
    giPersonnelButtonImage[5] = LoadButtonImage("LAPTOP\\departuresbuttons.sti", -1, 1, -1, 3, -1);
    giPersonnelButton[5] = QuickCreateButton(giPersonnelButtonImage[5], PERS_DEPARTED_UP_X, PERS_DEPARTED_DOWN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, DepartedDownCallBack);

    // set up cursors for these buttons
    SetButtonCursor(giPersonnelButton[4], Enum317.CURSOR_LAPTOP_SCREEN);
    SetButtonCursor(giPersonnelButton[5], Enum317.CURSOR_LAPTOP_SCREEN);

    fCreated = true;
  } else if ((fCurrentTeamMode == true) && (fCreated == true)) {
    // created. destroy
    RemoveButton(giPersonnelButton[4]);
    UnloadButtonImage(giPersonnelButtonImage[4]);
    RemoveButton(giPersonnelButton[5]);
    UnloadButtonImage(giPersonnelButtonImage[5]);
    fCreated = false;
    fReDrawScreenFlag = true;
  }
}

function DepartedUpCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (giCurrentUpperLeftPortraitNumber - 20 >= 0) {
        giCurrentUpperLeftPortraitNumber -= 20;
        fReDrawScreenFlag = true;
      }
    }
  }
}

function DepartedDownCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      if ((giCurrentUpperLeftPortraitNumber + 20) < (GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam())) {
        giCurrentUpperLeftPortraitNumber += 20;
        fReDrawScreenFlag = true;
      }
    }
  }
}

function DisplayPastMercsPortraits(): void {
  // display past mercs portraits, starting at giCurrentUpperLeftPortraitNumber and going up 20 mercs
  // start at dead mercs, then fired, then other

  let iCounter: INT32 = 0;
  let iCounterA: INT32 = 0;
  let iStartArray: INT32 = 0; // 0 = dead list, 1 = fired list, 2 = other list
  let fFound: boolean = false;

  // not time to display
  if (fCurrentTeamMode == true) {
    return;
  }

  // go through dead list
  //	for( iCounterA = 0; ( ( LaptopSaveInfo.ubDeadCharactersList[ iCounterA ] != -1 ) && ( iCounter < giCurrentUpperLeftPortraitNumber ) ); iCounter++, iCounterA++ );
  for (iCounterA = 0; (iCounter < giCurrentUpperLeftPortraitNumber); iCounterA++) {
    if (LaptopSaveInfo.ubDeadCharactersList[iCounterA] != -1)
      iCounter++;
  }

  if (iCounter < giCurrentUpperLeftPortraitNumber) {
    // now the fired list
    //			for( iCounterA = 0; ( ( LaptopSaveInfo.ubLeftCharactersList[ iCounterA ] != -1 ) && ( iCounter < giCurrentUpperLeftPortraitNumber ) ); iCounter++, iCounterA++ );
    for (iCounterA = 0; ((iCounter < giCurrentUpperLeftPortraitNumber)); iCounterA++) {
      if (LaptopSaveInfo.ubLeftCharactersList[iCounterA] != -1) {
        iCounter++;
      }
    }

    if (iCounter < 20) {
      iStartArray = 0;
    } else {
      iStartArray = 1;
    }
  } else {
    iStartArray = 0;
  }

  if ((iCounter < giCurrentUpperLeftPortraitNumber) && (iStartArray != 0)) {
    // now the fired list
    //			for( iCounterA = 0; ( ( LaptopSaveInfo.ubOtherCharactersList[ iCounterA ] != -1 ) && ( iCounter < giCurrentUpperLeftPortraitNumber ) ); iCounter++, iCounterA++ );
    for (iCounterA = 0; (iCounter < giCurrentUpperLeftPortraitNumber); iCounterA++) {
      if (LaptopSaveInfo.ubOtherCharactersList[iCounterA] != -1)
        iCounter++;
    }

    if (iCounter < 20) {
      iStartArray = 1;
    } else {
      iStartArray = 2;
    }
  } else if (iStartArray != 0) {
    iStartArray = 1;
  }

  //; we now have the array to start in, the position

  iCounter = 0;

  if (iStartArray == 0) {
    // run through list and display
    //	  for( iCounterA ; ( ( iCounter < 20 ) && ( LaptopSaveInfo.ubDeadCharactersList[ iCounterA ] != -1 ) ); iCounter++, iCounterA++ )
    for (iCounterA; iCounter < 20 && iCounterA < 256; iCounterA++) {
      // show dead pictures
      if (LaptopSaveInfo.ubDeadCharactersList[iCounterA] != -1) {
        DisplayPortraitOfPastMerc(LaptopSaveInfo.ubDeadCharactersList[iCounterA], iCounter, true, false, false);
        iCounter++;
      }
    }

    // reset counter A for the next array, if applicable
    iCounterA = 0;
  }
  if (iStartArray <= 1) {
    //		for( iCounterA ; ( ( iCounter < 20 ) && ( LaptopSaveInfo.ubLeftCharactersList[ iCounterA ] != -1 ) ); iCounter++, iCounterA++  )
    for (iCounterA; (iCounter < 20 && iCounterA < 256); iCounterA++) {
      // show fired pics
      if (LaptopSaveInfo.ubLeftCharactersList[iCounterA] != -1) {
        DisplayPortraitOfPastMerc(LaptopSaveInfo.ubLeftCharactersList[iCounterA], iCounter, false, true, false);
        iCounter++;
      }
    }
    // reset counter A for the next array, if applicable
    iCounterA = 0;
  }

  if (iStartArray <= 2) {
    //		for( iCounterA ; ( ( iCounter < 20 ) && ( LaptopSaveInfo.ubOtherCharactersList[ iCounterA ] != -1 ) ) ; iCounter++, iCounterA++ )
    for (iCounterA; (iCounter < 20 && iCounterA < 256); iCounterA++) {
      // show other pics
      if (LaptopSaveInfo.ubOtherCharactersList[iCounterA] != -1) {
        DisplayPortraitOfPastMerc(LaptopSaveInfo.ubOtherCharactersList[iCounterA], iCounter, false, false, true);
        iCounter++;
      }
    }
    // reset counter A for the next array, if applicable
    iCounterA = 0;
  }

  return;
}

function GetIdOfPastMercInSlot(iSlot: INT32): INT32 {
  let iCounter: INT32 = -1;
  let iCounterA: INT32 = 0;
  // returns ID of Merc in this slot

  // not time to display
  if (fCurrentTeamMode == true) {
    return -1;
  }

  if (iSlot > ((GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam()) - giCurrentUpperLeftPortraitNumber)) {
    // invalid slot
    return iCurrentPersonSelectedId;
  }
  // go through dead list
  for (iCounterA = 0; ((iCounter) < iSlot + giCurrentUpperLeftPortraitNumber); iCounterA++) {
    if (LaptopSaveInfo.ubDeadCharactersList[iCounterA] != -1)
      iCounter++;
  }

  if (iSlot + giCurrentUpperLeftPortraitNumber == iCounter) {
    return LaptopSaveInfo.ubDeadCharactersList[iCounterA - 1];
  }

  // now the fired list
  iCounterA = 0;
  for (iCounterA = 0; (((iCounter) < iSlot + giCurrentUpperLeftPortraitNumber)); iCounterA++) {
    if (LaptopSaveInfo.ubLeftCharactersList[iCounterA] != -1)
      iCounter++;
  }

  if (iSlot + giCurrentUpperLeftPortraitNumber == iCounter) {
    return LaptopSaveInfo.ubLeftCharactersList[iCounterA - 1];
  }

  // now the fired list
  iCounterA = 0;
  for (iCounterA = 0; (((iCounter) < (iSlot + giCurrentUpperLeftPortraitNumber))); iCounterA++) {
    if (LaptopSaveInfo.ubOtherCharactersList[iCounterA] != -1)
      iCounter++;
  }

  return LaptopSaveInfo.ubOtherCharactersList[iCounterA - 1];
}

function DisplayPortraitOfPastMerc(iId: INT32, iCounter: INT32, fDead: boolean, fFired: boolean, fOther: boolean): boolean {
  let sTemp: char[] /* [100] */;
  let hFaceHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;

  if ((50 < iId) && (57 > iId)) {
    sprintf(sTemp, "%s%03d.sti", SMALL_FACES_DIR, gMercProfiles[iId].ubFaceIndex);
  } else {
    if (iId < 100) {
      sprintf(sTemp, "%s%02d.sti", SMALL_FACES_DIR, iId);
    } else {
      sprintf(sTemp, "%s%03d.sti", SMALL_FACES_DIR, iId);
    }
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP(sTemp, VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFACE)));

  // Blt face to screen to
  GetVideoObject(addressof(hFaceHandle), guiFACE);

  if (fDead) {
    hFaceHandle.value.pShades[0] = Create16BPPPaletteShaded(hFaceHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, true);

    // set the red pallete to the face
    SetObjectHandleShade(guiFACE, 0);
  }

  BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, (SMALL_PORTRAIT_START_X + (iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_WIDTH), (SMALL_PORTRAIT_START_Y + (iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);

  /*
   text on the Small portrait
          if( fDead )
          {
                  //if the merc is dead, display it
  //		DrawTextToScreen(pDepartedMercPortraitStrings[0], ( INT16 ) ( SMALL_PORTRAIT_START_X+ ( iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_WIDTH ), ( INT16 ) ( SMALL_PORTRAIT_START_Y + ( iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_HEIGHT + SMALL_PORT_HEIGHT / 2 ), SMALL_PORTRAIT_WIDTH_NO_BORDERS, FONT10ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
                  DrawTextToScreen( AimPopUpText[ AIM_MEMBER_DEAD ], ( INT16 ) ( SMALL_PORTRAIT_START_X+ ( iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_WIDTH ), ( INT16 ) ( SMALL_PORTRAIT_START_Y + ( iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_HEIGHT + SMALL_PORT_HEIGHT / 2 ), SMALL_PORTRAIT_WIDTH_NO_BORDERS, FONT10ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
          }
          else if( fFired )
          {
                  DrawTextToScreen(pDepartedMercPortraitStrings[1], ( INT16 ) ( SMALL_PORTRAIT_START_X+ ( iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_WIDTH ), ( INT16 ) ( SMALL_PORTRAIT_START_Y + ( iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_HEIGHT + SMALL_PORT_HEIGHT / 2 ), SMALL_PORTRAIT_WIDTH_NO_BORDERS, FONT10ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
          }
          else if( fOther )
          {
                  DrawTextToScreen(pDepartedMercPortraitStrings[2], ( INT16 ) ( SMALL_PORTRAIT_START_X+ ( iCounter % PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_WIDTH ), ( INT16 ) ( SMALL_PORTRAIT_START_Y + ( iCounter / PERSONNEL_PORTRAIT_NUMBER_WIDTH ) * SMALL_PORT_HEIGHT + SMALL_PORT_HEIGHT / 2 ), SMALL_PORTRAIT_WIDTH_NO_BORDERS, FONT10ARIAL, 145, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
          }
  */

  DeleteVideoObjectFromIndex(guiFACE);

  return true;
}

function DisplayDepartedCharStats(iId: INT32, iSlot: INT32, iState: INT32): void {
  let iCounter: INT32 = 0;
  let sString: wchar_t[] /* [50] */;
  let sX: INT16;
  let sY: INT16;
  let uiHits: UINT32 = 0;

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontBackground(FONT_BLACK);
  SetFontForeground(PERS_TEXT_FONT_COLOR);

  // display the stats for a char
  for (iCounter = 0; iCounter < MAX_STATS; iCounter++) {
    switch (iCounter) {
      case 0:
        // health

        // dead?
        if (iState == 0) {
          swprintf(sString, "%d/%d", 0, gMercProfiles[iId].bLife);
        } else {
          swprintf(sString, "%d/%d", gMercProfiles[iId].bLife, gMercProfiles[iId].bLife);
        }

        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 1:
        // agility
        swprintf(sString, "%d", gMercProfiles[iId].bAgility);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 2:
        // dexterity
        swprintf(sString, "%d", gMercProfiles[iId].bDexterity);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 3:
        // strength
        swprintf(sString, "%d", gMercProfiles[iId].bStrength);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 4:
        // leadership
        swprintf(sString, "%d", gMercProfiles[iId].bLeadership);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 5:
        // wisdom
        swprintf(sString, "%d", gMercProfiles[iId].bWisdom);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 6:
        // exper
        swprintf(sString, "%d", gMercProfiles[iId].bExpLevel);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 7:
        // mrkmanship
        swprintf(sString, "%d", gMercProfiles[iId].bMarksmanship);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 8:
        // mech
        swprintf(sString, "%d", gMercProfiles[iId].bMechanical);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 9:
        // exp
        swprintf(sString, "%d", gMercProfiles[iId].bExplosive);
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);
        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;
      case 10:
        // med
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[iCounter]);

        swprintf(sString, "%d", gMercProfiles[iId].bMedical);

        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;

      case 14:
        // kills
        mprintf((pPersonnelScreenPoints[21].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[21].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_KILLS]);
        swprintf(sString, "%d", gMercProfiles[iId].usKills);
        FindFontRightCoordinates((pPersonnelScreenPoints[21].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[21].y, sString);
        break;
      case 15:
        // assists
        mprintf((pPersonnelScreenPoints[22].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[22].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_ASSISTS]);
        swprintf(sString, "%d", gMercProfiles[iId].usAssists);
        FindFontRightCoordinates((pPersonnelScreenPoints[22].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[22].y, sString);
        break;
      case 16:
        // shots/hits
        mprintf((pPersonnelScreenPoints[23].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[23].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_HIT_PERCENTAGE]);
        uiHits = gMercProfiles[iId].usShotsHit;
        uiHits *= 100;

        // check we have shot at least once
        if (gMercProfiles[iId].usShotsFired > 0) {
          uiHits /= gMercProfiles[iId].usShotsFired;
        } else {
          // no, set hit % to 0
          uiHits = 0;
        }

        swprintf(sString, "%d %%%%", uiHits);
        FindFontRightCoordinates((pPersonnelScreenPoints[23].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        sX += StringPixLength("%", PERS_FONT());
        mprintf(sX, pPersonnelScreenPoints[23].y, sString);
        break;
      case 17:
        // battles
        mprintf((pPersonnelScreenPoints[24].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[24].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_BATTLES]);
        swprintf(sString, "%d", gMercProfiles[iId].usBattlesFought);
        FindFontRightCoordinates((pPersonnelScreenPoints[24].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[24].y, sString);
        break;
      case 18:
        // wounds
        mprintf((pPersonnelScreenPoints[25].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[25].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_TIMES_WOUNDED]);
        swprintf(sString, "%d", gMercProfiles[iId].usTimesWounded);
        FindFontRightCoordinates((pPersonnelScreenPoints[25].x + (iSlot * TEXT_BOX_WIDTH)), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[25].y, sString);
        break;
    }
  }

  return;
}

function EnableDisableDeparturesButtons(): void {
  // will enable or disable departures buttons based on upperleft picutre index value
  if ((fCurrentTeamMode == true) || (fNewMailFlag == true)) {
    return;
  }

  // disable both buttons
  DisableButton(giPersonnelButton[4]);
  DisableButton(giPersonnelButton[5]);

  if (giCurrentUpperLeftPortraitNumber != 0) {
    // enable up button
    EnableButton(giPersonnelButton[4]);
  }
  if ((GetNumberOfDeadOnPastTeam() + GetNumberOfLeftOnPastTeam() + GetNumberOfOtherOnPastTeam()) - giCurrentUpperLeftPortraitNumber >= 20) {
    // enable down button
    EnableButton(giPersonnelButton[5]);
  }

  return;
}

function DisplayDepartedCharName(iId: INT32, iSlot: INT32, iState: INT32): void {
  // get merc's nickName, assignment, and sector location info
  let sX: INT16;
  let sY: INT16;
  let sString: CHAR16[] /* [32] */;

  SetFont(CHAR_NAME_FONT());
  SetFontForeground(PERS_TEXT_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  if ((iState == -1) || (iId == -1)) {
    return;
  }

  swprintf(sString, "%s", gMercProfiles[iId].zNickname);

  // nick name - assignment
  FindFontCenterCoordinates(IMAGE_BOX_X - 5, 0, IMAGE_BOX_WIDTH + 90, 0, sString, CHAR_NAME_FONT(), addressof(sX), addressof(sY));

  // cehck to se eif we are going to go off the left edge
  if (sX < pPersonnelScreenPoints[0].x) {
    sX = pPersonnelScreenPoints[0].x;
  }

  mprintf(sX + iSlot * IMAGE_BOX_WIDTH, CHAR_NAME_Y, sString);

  // state
  if (gMercProfiles[iId].ubMiscFlags2 & PROFILE_MISC_FLAG2_MARRIED_TO_HICKS) {
    // displaye 'married'
    swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_MARRIED]);
  } else if (iState == Enum106.DEPARTED_DEAD) {
    swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_DEAD]);
  }

  // if the merc is an AIM merc
  else if (iId < Enum268.BIFF) {
    // if dismissed
    if (iState == Enum106.DEPARTED_FIRED)
      swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_FIRED]);
    else
      swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_CONTRACT_EXPIRED]);
  }

  // else if its a MERC merc
  else if (iId >= Enum268.BIFF && iId <= Enum268.BUBBA) {
    if (iState == Enum106.DEPARTED_FIRED)
      swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_FIRED]);
    else
      swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_QUIT]);
  }
  // must be a RPC
  else {
    if (iState == Enum106.DEPARTED_FIRED)
      swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_FIRED]);
    else
      swprintf(sString, "%s", pPersonnelDepartedStateStrings[Enum106.DEPARTED_QUIT]);
  }

  //	swprintf( sString, L"%s", pPersonnelDepartedStateStrings[ iState ] );

  // nick name - assignment
  FindFontCenterCoordinates(IMAGE_BOX_X - 5, 0, IMAGE_BOX_WIDTH + 90, 0, sString, CHAR_NAME_FONT(), addressof(sX), addressof(sY));

  // cehck to se eif we are going to go off the left edge
  if (sX < pPersonnelScreenPoints[0].x) {
    sX = pPersonnelScreenPoints[0].x;
  }

  mprintf(sX + iSlot * IMAGE_BOX_WIDTH, CHAR_NAME_Y + 10, sString);

  return;
}

function GetTheStateOfDepartedMerc(iId: INT32): INT32 {
  let iCounter: INT32 = 0;
  // will runt hrough each list until merc is found, if not a -1 is returned

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubDeadCharactersList[iCounter] == iId) {
      return Enum106.DEPARTED_DEAD;
    }
  }

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubLeftCharactersList[iCounter] == iId) {
      return Enum106.DEPARTED_FIRED;
    }
  }

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubOtherCharactersList[iCounter] == iId) {
      return Enum106.DEPARTED_OTHER;
    }
  }

  return -1;
}

function DisplayPersonnelTextOnTitleBar(): void {
  // draw email screen title text

  // font stuff
  SetFont(FONT14ARIAL());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // printf the title
  mprintf(PERS_TITLE_X, PERS_TITLE_Y, pPersTitleText[0]);

  // reset the shadow
}

function DisplayHighLightBox(): boolean {
  // will display highlight box around selected merc
  let VObjectDesc: VOBJECT_DESC;
  let uiBox: UINT32 = 0;
  let hHandle: HVOBJECT;

  // load graphics

  // is the current selected face valid?
  if (iCurrentPersonSelectedId == -1) {
    // no, leave
    return false;
  }

  // bounding
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\PicBorde.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiBox)));

  // blit it
  GetVideoObject(addressof(hHandle), uiBox);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, (SMALL_PORTRAIT_START_X + (iCurrentPersonSelectedId % PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_WIDTH - 2), (SMALL_PORTRAIT_START_Y + (iCurrentPersonSelectedId / PERSONNEL_PORTRAIT_NUMBER_WIDTH) * SMALL_PORT_HEIGHT - 3), VO_BLT_SRCTRANSPARENCY, null);

  // deleteit
  DeleteVideoObjectFromIndex(uiBox);

  return true;
}

// add to dead list
export function AddCharacterToDeadList(pSoldier: Pointer<SOLDIERTYPE>): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubDeadCharactersList[iCounter] == -1) {
      // valid slot, merc not found yet, inset here
      LaptopSaveInfo.ubDeadCharactersList[iCounter] = pSoldier.value.ubProfile;

      // leave
      return;
    }

    // are they already in the list?
    if (LaptopSaveInfo.ubDeadCharactersList[iCounter] == pSoldier.value.ubProfile) {
      return;
    }
  }
}

export function AddCharacterToFiredList(pSoldier: Pointer<SOLDIERTYPE>): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubLeftCharactersList[iCounter] == -1) {
      // valid slot, merc not found yet, inset here
      LaptopSaveInfo.ubLeftCharactersList[iCounter] = pSoldier.value.ubProfile;

      // leave
      return;
    }

    // are they already in the list?
    if (LaptopSaveInfo.ubLeftCharactersList[iCounter] == pSoldier.value.ubProfile) {
      return;
    }
  }
}

export function AddCharacterToOtherList(pSoldier: Pointer<SOLDIERTYPE>): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    if (LaptopSaveInfo.ubOtherCharactersList[iCounter] == -1) {
      // valid slot, merc not found yet, inset here
      LaptopSaveInfo.ubOtherCharactersList[iCounter] = pSoldier.value.ubProfile;

      // leave
      return;
    }

    // are they already in the list?
    if (LaptopSaveInfo.ubOtherCharactersList[iCounter] == pSoldier.value.ubProfile) {
      return;
    }
  }
}

// If you have hired a merc before, then the they left for whatever reason, and now you are hiring them again,
// we must get rid of them from the departed section in the personnel screen.  ( wouldnt make sense for them
// to be on your team list, and departed list )
export function RemoveNewlyHiredMercFromPersonnelDepartedList(ubProfile: UINT8): boolean {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    // are they already in the Dead list?
    if (LaptopSaveInfo.ubDeadCharactersList[iCounter] == ubProfile) {
      // Reset the fact that they were once hired
      LaptopSaveInfo.ubDeadCharactersList[iCounter] = -1;
      return true;
    }

    // are they already in the other list?
    if (LaptopSaveInfo.ubLeftCharactersList[iCounter] == ubProfile) {
      // Reset the fact that they were once hired
      LaptopSaveInfo.ubLeftCharactersList[iCounter] = -1;
      return true;
    }

    // are they already in the list?
    if (LaptopSaveInfo.ubOtherCharactersList[iCounter] == ubProfile) {
      // Reset the fact that they were once hired
      LaptopSaveInfo.ubOtherCharactersList[iCounter] = -1;
      return true;
    }
  }

  return false;
}

// grab the id of the first merc being displayed
function GetIdOfFirstDisplayedMerc(): INT32 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;

  // set current soldier
  pSoldier = MercPtrs[cnt];

  if (fCurrentTeamMode == true) {
    // run through list of soldiers on players current team
    // cnt = gTacticalStatus.Team[ pSoldier->bTeam ].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pSoldier++) {
      if ((pSoldier.value.bActive) && (pSoldier.value.bLife > 0)) {
        return 0;
      }
    }
    return -1;
  } else {
    // run through list of soldier on players old team...the slot id will be translated
    return 0;
  }
}

function GetIdOfThisSlot(iSlot: INT32): INT32 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;

  // set current soldier
  pSoldier = MercPtrs[cnt];

  if (fCurrentTeamMode == true) {
    // run through list of soldiers on players current team
    cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pSoldier++) {
      if ((pSoldier.value.bActive)) {
        // same character as slot, return this value
        if (iCounter == iSlot) {
          return cnt;
        }

        // found another soldier
        iCounter++;
      }
    }
  } else {
    // run through list of soldier on players old team...the slot id will be translated
    return iSlot;
  }

  return 0;
}

function RenderAtmPanel(): boolean {
  let VObjectDesc: VOBJECT_DESC;
  let uiBox: UINT32 = 0;
  let hHandle: HVOBJECT;

  // render the ATM panel
  if (fShowAtmPanel) {
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("LAPTOP\\AtmButtons.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiBox)));

    // blit it
    GetVideoObject(addressof(hHandle), uiBox);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, (ATM_UL_X), (ATM_UL_Y), VO_BLT_SRCTRANSPARENCY, null);

    DeleteVideoObjectFromIndex(uiBox);

    // show amount
    DisplayATMAmount();
    RenderRectangleForPersonnelTransactionAmount();

    // create destroy
    CreateDestroyStartATMButton();
    CreateDestroyATMButton();

    // display strings for ATM
    DisplayATMStrings();

    // handle states
    HandleStateOfATMButtons();

    // DisplayAmountOnCurrentMerc( );
  } else {
    // just show basic panel
    // bounding
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("LAPTOP\\AtmButtons.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiBox)));

    GetVideoObject(addressof(hHandle), uiBox);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, (ATM_UL_X), (ATM_UL_Y), VO_BLT_SRCTRANSPARENCY, null);

    // blit it
    GetVideoObject(addressof(hHandle), uiBox);
    BltVideoObject(FRAME_BUFFER, hHandle, 1, (ATM_UL_X + 1), (ATM_UL_Y + 18), VO_BLT_SRCTRANSPARENCY, null);

    DeleteVideoObjectFromIndex(uiBox);

    // display strings for ATM
    DisplayATMStrings();

    // DisplayAmountOnCurrentMerc( );

    // create destroy
    CreateDestroyStartATMButton();
    CreateDestroyATMButton();
  }
  return true;
}

function CreateDestroyStartATMButton(): void {
  /* static */ let fCreated: boolean = false;
  // create/destroy atm start button as needed

  if ((fCreated == false) && (fShowAtmPanelStartButton == true)) {
    // not created, must create

    /*
    // the ATM start button
    giPersonnelATMStartButtonImage[ 0 ]=  LoadButtonImage( "LAPTOP\\AtmButtons.sti" ,-1,2,-1,3,-1 );
    giPersonnelATMStartButton[ 0 ] = QuickCreateButton( giPersonnelATMStartButtonImage[ 0 ] , 519,87,
                                                                    BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                    BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)ATMStartButtonCallback );

    // set text and what not
    SpecifyButtonText( giPersonnelATMStartButton[ 0 ] ,gsAtmStartButtonText[ 0 ] );
    SpecifyButtonUpTextColors( giPersonnelATMStartButton[ 0 ], FONT_BLACK, FONT_BLACK );
    SpecifyButtonFont( giPersonnelATMStartButton[ 0 ], PERS_FONT );
    SetButtonCursor(giPersonnelATMStartButton[ 0 ], CURSOR_LAPTOP_SCREEN);
*/
    // the stats button
    giPersonnelATMStartButtonImage[Enum108.PERSONNEL_STAT_BTN] = LoadButtonImage("LAPTOP\\AtmButtons.sti", -1, 2, -1, 3, -1);
    giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN] = QuickCreateButton(giPersonnelATMStartButtonImage[Enum108.PERSONNEL_STAT_BTN], 519, 80, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CALLBACK, PersonnelStatStartButtonCallback);

    // set text and what not
    SpecifyButtonText(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN], gsAtmStartButtonText[1]);
    SpecifyButtonUpTextColors(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN], FONT_BLACK, FONT_BLACK);
    SpecifyButtonFont(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN], PERS_FONT());
    SetButtonCursor(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN], Enum317.CURSOR_LAPTOP_SCREEN);

    // the Employment selection button
    giPersonnelATMStartButtonImage[Enum108.PERSONNEL_EMPLOYMENT_BTN] = LoadButtonImage("LAPTOP\\AtmButtons.sti", -1, 2, -1, 3, -1);
    giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN] = QuickCreateButton(giPersonnelATMStartButtonImage[Enum108.PERSONNEL_EMPLOYMENT_BTN], 519, 110, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CALLBACK, EmployementInfoButtonCallback);

    // set text and what not
    SpecifyButtonText(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN], gsAtmStartButtonText[3]);
    SpecifyButtonUpTextColors(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN], FONT_BLACK, FONT_BLACK);
    SpecifyButtonFont(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN], PERS_FONT());
    SetButtonCursor(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN], Enum317.CURSOR_LAPTOP_SCREEN);

    // the inventory selection button
    giPersonnelATMStartButtonImage[Enum108.PERSONNEL_INV_BTN] = LoadButtonImage("LAPTOP\\AtmButtons.sti", -1, 2, -1, 3, -1);
    giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN] = QuickCreateButton(giPersonnelATMStartButtonImage[Enum108.PERSONNEL_INV_BTN], 519, 140, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CALLBACK, PersonnelINVStartButtonCallback);

    // set text and what not
    SpecifyButtonText(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN], gsAtmStartButtonText[2]);
    SpecifyButtonUpTextColors(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN], FONT_BLACK, FONT_BLACK);
    SpecifyButtonFont(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN], PERS_FONT());
    SetButtonCursor(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN], Enum317.CURSOR_LAPTOP_SCREEN);

    fCreated = true;
  } else if ((fCreated == true) && (fShowAtmPanelStartButton == false)) {
    // stop showing
    /*
    RemoveButton( giPersonnelATMStartButton[ 0 ] );
    UnloadButtonImage( giPersonnelATMStartButtonImage[ 0 ] );
    */
    RemoveButton(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]);
    UnloadButtonImage(giPersonnelATMStartButtonImage[Enum108.PERSONNEL_STAT_BTN]);
    RemoveButton(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]);
    UnloadButtonImage(giPersonnelATMStartButtonImage[Enum108.PERSONNEL_EMPLOYMENT_BTN]);
    RemoveButton(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]);
    UnloadButtonImage(giPersonnelATMStartButtonImage[Enum108.PERSONNEL_INV_BTN]);

    fCreated = false;
  }
}

function FindPositionOfPersInvSlider(): void {
  let iValue: INT32 = 0;
  let iNumberOfItems: INT32 = 0;
  let sSizeOfEachSubRegion: INT16 = 0;
  let sYPositionOnBar: INT16 = 0;
  let iCurrentItemValue: INT16 = 0;

  // find out how many there are
  iValue = (GetNumberOfInventoryItemsOnCurrentMerc());

  // otherwise there are more than one item
  iNumberOfItems = iValue - NUMBER_OF_INVENTORY_PERSONNEL;

  if (iValue <= 0) {
    iValue = 1;
  }

  // get the subregion sizes
  sSizeOfEachSubRegion = ((Y_SIZE_OF_PERSONNEL_SCROLL_REGION - SIZE_OF_PERSONNEL_CURSOR) / (iNumberOfItems));

  // get slider position
  guiSliderPosition = uiCurrentInventoryIndex * sSizeOfEachSubRegion;
}

function HandleSliderBarClickCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = 0;
  let iNumberOfItems: INT32 = 0;
  let MousePos: POINT;
  let sSizeOfEachSubRegion: INT16 = 0;
  let sYPositionOnBar: INT16 = 0;
  let iCurrentItemValue: INT16 = 0;

  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) || (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT)) {
    // find out how many there are
    iValue = (GetNumberOfInventoryItemsOnCurrentMerc());

    // make sure there are more than one page
    if (uiCurrentInventoryIndex >= iValue - NUMBER_OF_INVENTORY_PERSONNEL + 1) {
      return;
    }

    // otherwise there are more than one item
    iNumberOfItems = iValue - NUMBER_OF_INVENTORY_PERSONNEL;

    // number of items is 0
    if (iNumberOfItems == 0) {
      return;
    }

    // find the x,y on the slider bar
    GetCursorPos(addressof(MousePos));

    // get the subregion sizes
    sSizeOfEachSubRegion = ((Y_SIZE_OF_PERSONNEL_SCROLL_REGION - SIZE_OF_PERSONNEL_CURSOR) / (iNumberOfItems));

    // get the cursor placement
    sYPositionOnBar = MousePos.y - Y_OF_PERSONNEL_SCROLL_REGION;

    if (sSizeOfEachSubRegion == 0) {
      return;
    }

    // get the actual item position
    iCurrentItemValue = sYPositionOnBar / sSizeOfEachSubRegion;

    if (uiCurrentInventoryIndex != iCurrentItemValue) {
      // get slider position
      guiSliderPosition = iCurrentItemValue * sSizeOfEachSubRegion;

      // set current inventory value
      uiCurrentInventoryIndex = iCurrentItemValue;

      // force update
      fReDrawScreenFlag = true;
    }
  }
}

function RenderSliderBarForPersonnelInventory(): void {
  let hHandle: HVOBJECT;

  // render slider bar for personnel
  GetVideoObject(addressof(hHandle), guiPersonnelInventory);
  BltVideoObject(FRAME_BUFFER, hHandle, 5, (X_OF_PERSONNEL_SCROLL_REGION), (guiSliderPosition + Y_OF_PERSONNEL_SCROLL_REGION), VO_BLT_SRCTRANSPARENCY, null);
}

function CreateDestroyATMButton(): void {
  /*
  static BOOLEAN fCreated = FALSE;
  CHAR16 sString[ 32 ];



  // create/destroy atm start button as needed
  INT32 iCounter = 0;

  if( ( fCreated == FALSE ) && ( fShowAtmPanel == TRUE ) )
  {

          for( iCounter = 0; iCounter < 10; iCounter++ )
          {
                  if( iCounter != 9 )
                  {
                          iNumberPadButtonsImages[ iCounter ]=LoadButtonImage( "LAPTOP\\AtmButtons.sti" ,-1,4,-1,6,-1 );
                          swprintf( sString, L"%d", iCounter+1 );
                  }
                  else
                  {
                          iNumberPadButtonsImages[ iCounter ]=LoadButtonImage( "LAPTOP\\AtmButtons.sti" ,-1,7,-1,9,-1 );
                          swprintf( sString, L"%d", iCounter - 9 );
                  }

                  iNumberPadButtons[ iCounter ] = QuickCreateButton( iNumberPadButtonsImages[ iCounter ], ( INT16 )( ATM_BUTTONS_START_X + ( ATM_BUTTON_WIDTH * ( INT16 )( iCounter % 3 )) ), ( INT16 )( ATM_BUTTONS_START_Y + ( INT16 )( ATM_BUTTON_HEIGHT * ( iCounter / 3 ))) ,
                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)ATMNumberButtonCallback );

                  if( iCounter != 9)
                  {
                          MSYS_SetBtnUserData(iNumberPadButtons[iCounter],0,iCounter + 1 );
                  }
                  else
                  {
                          MSYS_SetBtnUserData(iNumberPadButtons[iCounter],0, 0 );
                  }
                  SetButtonCursor(iNumberPadButtons[iCounter], CURSOR_LAPTOP_SCREEN);
                  SpecifyButtonFont( iNumberPadButtons[iCounter], PERS_FONT );
                  SpecifyButtonText( iNumberPadButtons[iCounter], sString );
                  SpecifyButtonUpTextColors( iNumberPadButtons[iCounter], FONT_BLACK, FONT_BLACK );

          }


          // now slap down done, cancel, dep, withdraw
          for( iCounter = OK_ATM; iCounter < NUMBER_ATM_BUTTONS ;iCounter++ )
          {
                  if( iCounter == OK_ATM )
                  {
                          giPersonnelATMSideButtonImage[ iCounter ]=  LoadButtonImage( "LAPTOP\\AtmButtons.sti" ,-1,7,-1,9,-1 );
                  }
                  else
                  {
                          giPersonnelATMSideButtonImage[ iCounter ]=  LoadButtonImage( "LAPTOP\\AtmButtons.sti" ,-1,10,-1,12,-1 );
                  }

                  if( ( iCounter != DEPOSIT_ATM ) && ( iCounter != WIDTHDRAWL_ATM ) )
                  {
                          giPersonnelATMSideButton[ iCounter ] = QuickCreateButton( giPersonnelATMSideButtonImage[ iCounter ], ( INT16 )( pAtmSideButtonPts[ iCounter ].x ), ( INT16 )( pAtmSideButtonPts[ iCounter ].y ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)ATMOtherButtonCallback );
                  }
                  else
                  {
                          giPersonnelATMSideButton[ iCounter ] = QuickCreateButton( giPersonnelATMSideButtonImage[ iCounter ], ( INT16 )( pAtmSideButtonPts[ iCounter ].x ), ( INT16 )( pAtmSideButtonPts[ iCounter ].y ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)ATMOther2ButtonCallback );
                  }
                  MSYS_SetBtnUserData(giPersonnelATMSideButton[iCounter],0,iCounter );
                  SpecifyButtonFont( giPersonnelATMSideButton[iCounter], PERS_FONT );
                  SetButtonCursor(giPersonnelATMSideButton[iCounter], CURSOR_LAPTOP_SCREEN);
                  SpecifyButtonUpTextColors( giPersonnelATMSideButton[iCounter], FONT_BLACK, FONT_BLACK );
                  SpecifyButtonText( giPersonnelATMSideButton[iCounter], gsAtmSideButtonText[ iCounter ] );
          }


          //SetButtonCursor(giPersonnelATMStartButton, CURSOR_LAPTOP_SCREEN);
          fCreated = TRUE;
  }
  else if( ( fCreated == TRUE ) && ( fShowAtmPanel == FALSE ) )
  {
          // stop showing
          //RemoveButton( giPersonnelATMButton );
          //UnloadButtonImage( giPersonnelATMButtonImage );

          for( iCounter = 0; iCounter < 10; iCounter++ )
          {
                  UnloadButtonImage( iNumberPadButtonsImages[ iCounter ] );
                  RemoveButton( iNumberPadButtons[ iCounter ] );
          }

          for( iCounter = OK_ATM; iCounter < NUMBER_ATM_BUTTONS ;iCounter++ )
          {
                  RemoveButton( giPersonnelATMSideButton[ iCounter ]  );
                  UnloadButtonImage( giPersonnelATMSideButtonImage[ iCounter ] );
          }

          fCreated = FALSE;
  }

  */
}

function ATMStartButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fReDrawScreenFlag = true;
      fShowAtmPanel = true;
      fShowAtmPanelStartButton = false;
      fATMFlags = 0;
    }
  }
}

function PersonnelINVStartButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fReDrawScreenFlag = true;
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    //		fShowInventory = TRUE;
    gubPersonnelInfoState = Enum109.PRSNL_INV;
  }
}

function PersonnelStatStartButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fReDrawScreenFlag = true;
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    //		fShowInventory = FALSE;
    gubPersonnelInfoState = Enum109.PRSNL_STATS;
  }
}

function EmployementInfoButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fReDrawScreenFlag = true;
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    gubPersonnelInfoState = Enum109.PRSNL_EMPLOYMENT;
  }
}

function ATMOther2ButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[0];
  let cnt: INT32 = 0;
  let iId: INT32 = 0;

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  iValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    switch (iValue) {
      case (Enum107.DEPOSIT_ATM):
        fATMFlags = 2;
        fReDrawScreenFlag = true;
        ButtonList[giPersonnelATMSideButton[Enum107.WIDTHDRAWL_ATM]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
        break;
      case (Enum107.WIDTHDRAWL_ATM):
        fATMFlags = 3;
        fReDrawScreenFlag = true;
        ButtonList[giPersonnelATMSideButton[Enum107.DEPOSIT_ATM]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
        break;
    }
  }
}

function ATMOtherButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[0];
  let cnt: INT32 = 0;
  let iId: INT32 = 0;

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  iValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (iCurrentPersonSelectedId != -1) {
        if (fCurrentTeamMode == true) {
          iId = GetIdOfThisSlot(iCurrentPersonSelectedId);
          cnt = 0;

          // set soldier
          pSoldier = MercPtrs[iId];

          switch (iValue) {
            case (Enum107.OK_ATM):
              if (fATMFlags == 0) {
                fATMFlags = 1;
                fReDrawScreenFlag = true;
                fOneFrameDelayInPersonnel = true;
              } else if (fATMFlags == 2) {
                // deposit from merc to account
                if (GetFundsOnMerc(pSoldier) >= wcstol(sTransferString, null, 10)) {
                  if ((wcstol(sTransferString, null, 10) % 10) != 0) {
                    fOldATMFlags = fATMFlags;
                    fATMFlags = 5;

                    iValue = (wcstol(sTransferString, null, 10) - (wcstol(sTransferString, null, 10) % 10));
                    swprintf(sTransferString, "%d", iValue);
                    fReDrawScreenFlag = true;
                  } else {
                    // transfer
                    TransferFundsFromMercToBank(pSoldier, wcstol(sTransferString, null, 10));
                    sTransferString[0] = 0;
                    fReDrawScreenFlag = true;
                  }
                } else {
                  fOldATMFlags = fATMFlags;
                  fATMFlags = 4;
                  iValue = GetFundsOnMerc(pSoldier);
                  swprintf(sTransferString, "%d", iValue);
                  fReDrawScreenFlag = true;
                }
              } else if (fATMFlags == 3) {
                // deposit from merc to account
                if (LaptopSaveInfo.iCurrentBalance >= wcstol(sTransferString, null, 10)) {
                  if ((wcstol(sTransferString, null, 10) % 10) != 0) {
                    fOldATMFlags = fATMFlags;
                    fATMFlags = 5;

                    iValue = (wcstol(sTransferString, null, 10) - (wcstol(sTransferString, null, 10) % 10));
                    swprintf(sTransferString, "%d", iValue);
                    fReDrawScreenFlag = true;
                  } else {
                    // transfer
                    TransferFundsFromBankToMerc(pSoldier, wcstol(sTransferString, null, 10));
                    sTransferString[0] = 0;
                    fReDrawScreenFlag = true;
                  }
                } else {
                  fOldATMFlags = fATMFlags;
                  fATMFlags = 4;
                  iValue = LaptopSaveInfo.iCurrentBalance;
                  swprintf(sTransferString, "%d", iValue);
                  fReDrawScreenFlag = true;
                }
              } else if (fATMFlags == 4) {
                fATMFlags = fOldATMFlags;
                fReDrawScreenFlag = true;
              }
              break;
            case (Enum107.DEPOSIT_ATM):
              fATMFlags = 2;
              fReDrawScreenFlag = true;

              break;
            case (Enum107.WIDTHDRAWL_ATM):
              fATMFlags = 3;
              fReDrawScreenFlag = true;
              break;
            case (Enum107.CANCEL_ATM):
              if (sTransferString[0] != 0) {
                sTransferString[0] = 0;
              } else if (fATMFlags != 0) {
                fATMFlags = 0;
                ButtonList[giPersonnelATMSideButton[Enum107.WIDTHDRAWL_ATM]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
                ButtonList[giPersonnelATMSideButton[Enum107.DEPOSIT_ATM]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
              } else {
                fShowAtmPanel = false;
                fShowAtmPanelStartButton = true;
              }
              fReDrawScreenFlag = true;
              break;
            case (Enum107.CLEAR_ATM):
              sTransferString[0] = 0;
              fReDrawScreenFlag = true;
              break;
          }
        }
      }
    }
  }
}

function ATMNumberButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let iValue: INT32 = 0;
  let iCounter: INT32 = 0;
  let sZero: CHAR16[] /* [2] */ = "0";

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  iValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      fReDrawScreenFlag = true;
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      // find position in value string, append character at end
      for (iCounter = 0; iCounter < wcslen(sTransferString); iCounter++)
        ;
      sTransferString[iCounter] = (sZero[0] + iValue);
      sTransferString[iCounter + 1] = 0;
      fReDrawScreenFlag = true;

      // gone too far
      if (StringPixLength(sTransferString, ATM_FONT()) >= ATM_DISPLAY_WIDTH - 10) {
        sTransferString[iCounter] = 0;
      }
    }
  }
}

function DisplayATMAmount(): void {
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let sTempString: CHAR16[] /* [32] */;
  let sZero: CHAR16[] /* [2] */ = "0";
  let iCounter: INT32 = 0;

  if (fShowAtmPanel == false) {
    return;
  }

  wcscpy(sTempString, sTransferString);

  if ((sTempString[0] == 48) && (sTempString[1] != 0)) {
    // strip the zero from the beginning
    for (iCounter = 1; iCounter < wcslen(sTempString); iCounter++) {
      sTempString[iCounter - 1] = sTempString[iCounter];
    }
  }

  // insert commas and dollar sign
  InsertCommasForDollarFigure(sTempString);
  InsertDollarSignInToString(sTempString);

  // set font
  SetFont(ATM_FONT());

  // set back and foreground
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // right justify
  FindFontRightCoordinates(ATM_DISPLAY_X, ATM_DISPLAY_Y + 37, ATM_DISPLAY_WIDTH, ATM_DISPLAY_HEIGHT, sTempString, ATM_FONT(), addressof(sX), addressof(sY));

  // print string
  mprintf(sX, sY, sTempString);

  return;
}

function HandleStateOfATMButtons(): void {
  let iCounter: INT32 = 0;

  // disable buttons based on state
  if ((fATMFlags == 0)) {
    for (iCounter = 0; iCounter < 10; iCounter++) {
      DisableButton(iNumberPadButtons[iCounter]);
    }

    for (iCounter = 0; iCounter < Enum107.NUMBER_ATM_BUTTONS; iCounter++) {
      if ((iCounter != Enum107.DEPOSIT_ATM) && (iCounter != Enum107.WIDTHDRAWL_ATM) && (iCounter != Enum107.CANCEL_ATM)) {
        DisableButton(giPersonnelATMSideButton[iCounter]);
      }
    }
  } else {
    for (iCounter = 0; iCounter < 10; iCounter++) {
      EnableButton(iNumberPadButtons[iCounter]);
    }

    for (iCounter = 0; iCounter < Enum107.NUMBER_ATM_BUTTONS; iCounter++) {
      EnableButton(giPersonnelATMSideButton[iCounter]);
    }
  }
}

export function GetFundsOnMerc(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iCurrentAmount: INT32 = 0;
  let iCurrentPocket: INT32 = 0;
  // run through mercs pockets, if any money in them, add to total

  // error check
  if (pSoldier == null) {
    return 0;
  }

  // run through grunts pockets and count all the spare change
  for (iCurrentPocket = 0; iCurrentPocket < Enum261.NUM_INV_SLOTS; iCurrentPocket++) {
    if (Item[pSoldier.value.inv[iCurrentPocket].usItem].usItemClass == IC_MONEY) {
      iCurrentAmount += pSoldier.value.inv[iCurrentPocket].uiMoneyAmount;
    }
  }

  return iCurrentAmount;
}

export function TransferFundsFromMercToBank(pSoldier: Pointer<SOLDIERTYPE>, iCurrentBalance: INT32): boolean {
  let iCurrentPocket: INT32 = 0;
  let iAmountLeftToTake: INT32 = iCurrentBalance;
  let ObjectToRemove: OBJECTTYPE;

  // move this amount of money from the grunt to the bank
  // error check
  if (pSoldier == null) {
    return false;
  }

  // run through grunts pockets and count all the spare change
  for (iCurrentPocket = 0; iCurrentPocket < Enum261.NUM_INV_SLOTS; iCurrentPocket++) {
    if (Item[pSoldier.value.inv[iCurrentPocket].usItem].usItemClass == IC_MONEY) {
      // is there more left to go, or does this pocket finish it off?
      if (pSoldier.value.inv[iCurrentPocket].uiMoneyAmount > iAmountLeftToTake) {
        pSoldier.value.inv[iCurrentPocket].uiMoneyAmount -= iAmountLeftToTake;
        iAmountLeftToTake = 0;
      } else {
        iAmountLeftToTake -= pSoldier.value.inv[iCurrentPocket].uiMoneyAmount;
        pSoldier.value.inv[iCurrentPocket].uiMoneyAmount = 0;

        // Remove the item out off the merc
        RemoveObjectFromSlot(pSoldier, iCurrentPocket, addressof(ObjectToRemove));
      }
    }
  }

  if (iAmountLeftToTake != 0) {
    // something wrong
    AddTransactionToPlayersBook(Enum80.TRANSFER_FUNDS_FROM_MERC, pSoldier.value.ubProfile, GetWorldTotalMin(), (iCurrentBalance - iAmountLeftToTake));
    return false;
  } else {
    // everything ok
    AddTransactionToPlayersBook(Enum80.TRANSFER_FUNDS_FROM_MERC, pSoldier.value.ubProfile, GetWorldTotalMin(), (iCurrentBalance));
    return true;
  }
}

export function TransferFundsFromBankToMerc(pSoldier: Pointer<SOLDIERTYPE>, iCurrentBalance: INT32): boolean {
  let pMoneyObject: OBJECTTYPE;

  // move this amount of money from the grunt to the bank
  // error check
  if (pSoldier == null) {
    return false;
  }

  // make sure we are giving them some money
  if (iCurrentBalance <= 0) {
    return false;
  }

  // current balance
  if (iCurrentBalance > LaptopSaveInfo.iCurrentBalance) {
    iCurrentBalance = LaptopSaveInfo.iCurrentBalance;
  }

  // set up object
  memset(addressof(pMoneyObject), 0, sizeof(OBJECTTYPE));

  // set up money object
  pMoneyObject.usItem = Enum225.MONEY;
  pMoneyObject.ubNumberOfObjects = 1;
  pMoneyObject.bMoneyStatus = 100;
  pMoneyObject.bStatus[0] = 100;
  pMoneyObject.uiMoneyAmount = iCurrentBalance;

  // now auto place money object
  if (AutoPlaceObject(pSoldier, addressof(pMoneyObject), true) == true) {
    // now place transaction
    AddTransactionToPlayersBook(Enum80.TRANSFER_FUNDS_TO_MERC, pSoldier.value.ubProfile, GetWorldTotalMin(), -(iCurrentBalance));
  } else {
    // error, notify player that merc doesn't have the spce for this much cash
  }

  return true;
}

function DisplayATMStrings(): void {
  // display strings for ATM

  switch (fATMFlags) {
    case (0):
      if (fShowAtmPanelStartButton == false) {
        DisplayWrappedString(509, (80), 81, 2, ATM_FONT(), FONT_WHITE, sATMText[3], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      }
      break;
    case (2):
      if (sTransferString[0] != 0) {
        DisplayWrappedString(509, 80, 81, 2, ATM_FONT(), FONT_WHITE, sATMText[0], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
        // DisplayWrappedString(509, ( INT16 )( 80 + GetFontHeight( ATM_FONT ) ), 81, 2, ATM_FONT, FONT_WHITE, sATMText[ 1 ], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED );
      } else {
        DisplayWrappedString(509, 80, 81, 2, ATM_FONT(), FONT_WHITE, sATMText[2], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      }
      break;
    case (3):
      if (sTransferString[0] != 0) {
        DisplayWrappedString(509, 80, 81, 2, ATM_FONT(), FONT_WHITE, sATMText[0], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
        // DisplayWrappedString(509, ( INT16 )( 80 + GetFontHeight( ATM_FONT ) ), 81, 2, ATM_FONT, FONT_WHITE, sATMText[ 1 ], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED );
      } else {
        DisplayWrappedString(509, 80, 81, 2, ATM_FONT(), FONT_WHITE, sATMText[2], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      }
      break;
    case (4):
      // not enough money
      DisplayWrappedString(509, 80, 81, 2, ATM_FONT(), FONT_WHITE, sATMText[4], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      break;
    case (5):
      // not enough money
      DisplayWrappedString(509, 73, 81, 2, ATM_FONT(), FONT_WHITE, sATMText[5], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      break;
  }
}

function UpDateStateOfStartButton(): void {
  let iId: INT32 = 0;

  // start button being shown?
  if (fShowAtmPanelStartButton == false) {
    return;
  }

  //	if( fShowInventory == TRUE )
  if (gubPersonnelInfoState == Enum109.PRSNL_INV) {
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]].value.uiFlags |= BUTTON_CLICKED_ON;
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
  } else if (gubPersonnelInfoState == Enum109.PRSNL_STATS) {
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]].value.uiFlags |= BUTTON_CLICKED_ON;
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
  } else {
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
    ButtonList[giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]].value.uiFlags |= BUTTON_CLICKED_ON;
  }

  // if in current mercs and the currently selected guy is valid, enable button, else disable it
  if (fCurrentTeamMode == true) {
    // is the current guy valid
    if (GetNumberOfMercsDeadOrAliveOnPlayersTeam() > 0) {
      // EnableButton( giPersonnelATMStartButton[ 0 ] );
      EnableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]);
      EnableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]);
      EnableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]);

      iId = GetIdOfThisSlot(iCurrentPersonSelectedId);

      if (iId != -1) {
        if (Menptr[iId].bAssignment == Enum117.ASSIGNMENT_POW) {
          // DisableButton( giPersonnelATMStartButton[ 0 ] );
          DisableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]);

          //					if( fShowInventory == TRUE )
          if (gubPersonnelInfoState == Enum109.PRSNL_INV) {
            //						fShowInventory = FALSE;
            gubPersonnelInfoState = Enum109.PRSNL_STATS;

            fPausedReDrawScreenFlag = true;
          }

          if (fATMFlags) {
            fATMFlags = 0;
            fPausedReDrawScreenFlag = true;
          }
        }
      }
    } else {
      // not valid, disable
      // DisableButton( giPersonnelATMStartButton[ 0 ] );
      DisableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]);
      DisableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]);
      DisableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]);
    }
  } else {
    // disable button
    // DisableButton( giPersonnelATMStartButton[ 0 ] );
    EnableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_STAT_BTN]);
    DisableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_INV_BTN]);
    DisableButton(giPersonnelATMStartButton[Enum108.PERSONNEL_EMPLOYMENT_BTN]);
  }
}

function DisplayAmountOnCurrentMerc(): void {
  // will display the amount that the merc is carrying on him or herself
  let iId: INT32;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iFunds: INT32;
  let sString: CHAR16[] /* [64] */;
  let sX: INT16;
  let sY: INT16;

  iId = GetIdOfThisSlot(iCurrentPersonSelectedId);

  if (iId == -1) {
    pSoldier = null;
  } else {
    // set soldier
    pSoldier = MercPtrs[iId];
  }

  iFunds = GetFundsOnMerc(pSoldier);

  swprintf(sString, "%d", iFunds);

  // insert commas and dollar sign
  InsertCommasForDollarFigure(sString);
  InsertDollarSignInToString(sString);

  // set font
  SetFont(ATM_FONT());

  // set back and foreground
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // right justify
  FindFontRightCoordinates(ATM_DISPLAY_X, ATM_DISPLAY_Y, ATM_DISPLAY_WIDTH, ATM_DISPLAY_HEIGHT, sString, ATM_FONT(), addressof(sX), addressof(sY));

  // print string
  mprintf(sX, sY, sString);

  return;
}

function HandlePersonnelKeyboard(): void {
  let iCounter: INT32 = 0;
  let iValue: INT32 = 0;
  let sZero: CHAR16[] /* [2] */ = "0";

  let InputEvent: InputAtom;
  let MousePos: POINT;

  GetCursorPos(addressof(MousePos));

  while (DequeueEvent(addressof(InputEvent)) == true) {
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam >= '0') && (InputEvent.usParam <= '9')) {
      if ((fShowAtmPanel) && (fATMFlags != 0)) {
        iValue = (InputEvent.usParam - '0');

        for (iCounter = 0; iCounter < wcslen(sTransferString); iCounter++)
          ;
        sTransferString[iCounter] = (sZero[0] + iValue);
        sTransferString[iCounter + 1] = 0;
        fPausedReDrawScreenFlag = true;

        // gone too far
        if (StringPixLength(sTransferString, ATM_FONT()) >= ATM_DISPLAY_WIDTH - 10) {
          sTransferString[iCounter] = 0;
        }
      }
    }

    HandleKeyBoardShortCutsForLapTop(InputEvent.usEvent, InputEvent.usParam, InputEvent.usKeyState);
  }
}

function RenderRectangleForPersonnelTransactionAmount(): void {
  let iLength: INT32 = 0;
  let iHeight: INT32 = GetFontHeight(ATM_FONT());
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let sTempString: CHAR16[] /* [32] */;
  let sZero: CHAR16[] /* [2] */ = "0";
  let iCounter: INT32 = 0;

  wcscpy(sTempString, sTransferString);

  if ((sTempString[0] == 48) && (sTempString[1] != 0)) {
    // strip the zero from the beginning
    for (iCounter = 1; iCounter < wcslen(sTempString); iCounter++) {
      sTempString[iCounter - 1] = sTempString[iCounter];
    }
  }

  // insert commas and dollar sign
  InsertCommasForDollarFigure(sTempString);
  InsertDollarSignInToString(sTempString);

  // string not worth worrying about?
  if (wcslen(sTempString) < 2) {
    return;
  }

  // grab total length
  iLength = StringPixLength(sTempString, ATM_FONT());

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  RestoreClipRegionToFullScreenForRectangle(uiDestPitchBYTES);
  RectangleDraw(true, (ATM_DISPLAY_X + ATM_DISPLAY_WIDTH) - iLength - 2, ATM_DISPLAY_Y + 35, ATM_DISPLAY_X + ATM_DISPLAY_WIDTH + 1, ATM_DISPLAY_Y + iHeight + 36, Get16BPPColor(FROMRGB(255, 255, 255)), pDestBuf);
  UnLockVideoSurface(FRAME_BUFFER);
}

function HandleTimedAtmModes(): void {
  /* static */ let fOldAtmMode: boolean = 0;
  /* static */ let uiBaseTime: UINT32 = 0;

  if (fShowAtmPanel == false) {
    return;
  }

  // update based on modes
  if (fATMFlags != fOldAtmMode) {
    uiBaseTime = GetJA2Clock();
    fOldAtmMode = fATMFlags;
    fPausedReDrawScreenFlag = true;
  }

  if ((GetJA2Clock() - uiBaseTime) > DELAY_PER_MODE_CHANGE_IN_ATM) {
    switch (fATMFlags) {
      case (4):
      case (5):
        // insufficient funds ended
        fATMFlags = fOldATMFlags;
        fPausedReDrawScreenFlag = true;
        break;
    }
  }
}

function IsPastMercDead(iId: INT32): boolean {
  if (GetTheStateOfDepartedMerc(GetIdOfPastMercInSlot(iId)) == Enum106.DEPARTED_DEAD) {
    return true;
  } else {
    return false;
  }
}

function IsPastMercFired(iId: INT32): boolean {
  if (GetTheStateOfDepartedMerc(GetIdOfPastMercInSlot(iId)) == Enum106.DEPARTED_FIRED) {
    return true;
  } else {
    return false;
  }
}

function IsPastMercOther(iId: INT32): boolean {
  if (GetTheStateOfDepartedMerc(GetIdOfPastMercInSlot(iId)) == Enum106.DEPARTED_OTHER) {
    return true;
  } else {
    return false;
  }
}

function DisplayEmploymentinformation(iId: INT32, iSlot: INT32): void {
  let iCounter: INT32 = 0;
  let sString: wchar_t[] /* [50] */;
  let sStringA: wchar_t[] /* [50] */;
  let sX: INT16;
  let sY: INT16;
  let uiHits: UINT32 = 0;

  if (Menptr[iId].uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  // display the stats for a char
  for (iCounter = 0; iCounter < MAX_STATS; iCounter++) {
    switch (iCounter) {
        //		 case 12:

      // Remaining Contract:
      case 0: {
        let uiTimeUnderThisDisplayAsHours: UINT32 = 24 * 60;
        let uiMinutesInDay: UINT32 = 24 * 60;

        if (Menptr[iId].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC || Menptr[iId].ubProfile == Enum268.SLAY) {
          let iTimeLeftOnContract: INT32 = CalcTimeLeftOnMercContract(addressof(Menptr[iId]));

          // if the merc is in transit
          if (Menptr[iId].bAssignment == Enum117.IN_TRANSIT) {
            // and if the ttime left on the cotract is greater then the contract time
            if (iTimeLeftOnContract > (Menptr[iId].iTotalContractLength * uiMinutesInDay)) {
              iTimeLeftOnContract = (Menptr[iId].iTotalContractLength * uiMinutesInDay);
            }
          }
          // if there is going to be a both days and hours left on the contract
          if (iTimeLeftOnContract / uiMinutesInDay) {
            swprintf(sString, "%d%s %d%s / %d%s", (iTimeLeftOnContract / uiMinutesInDay), gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION], (iTimeLeftOnContract % uiMinutesInDay) / 60, gpStrategicString[Enum365.STR_PB_HOURS_ABBREVIATION], Menptr[iId].iTotalContractLength, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);
            mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_CURRENT_CONTRACT]);
          }

          // else there is under a day left
          else {
            // DEF: removed 2/7/99
            swprintf(sString, "%d%s / %d%s", (iTimeLeftOnContract % uiMinutesInDay) / 60, gpStrategicString[Enum365.STR_PB_HOURS_ABBREVIATION], Menptr[iId].iTotalContractLength, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);
            mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_CURRENT_CONTRACT]);
          }
        } else if (Menptr[iId].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
          //					swprintf(sString, L"%d%s / %d%s",Menptr[iId].iTotalContractLength, gpStrategicString[ STR_PB_DAYS_ABBREVIATION ], ( GetWorldTotalMin( ) -Menptr[iId].iStartContractTime ) / ( 24 * 60 ), gpStrategicString[ STR_PB_DAYS_ABBREVIATION ] );

          wcscpy(sString, gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
          mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_CURRENT_CONTRACT]);
        } else {
          wcscpy(sString, gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION]);
          mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_CURRENT_CONTRACT]);
        }

        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + Prsnl_DATA_OffSetX), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
      } break;

        //		 case 11:
        //		 case 19:
      case 1:

        // total contract time served
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_TOTAL_SERVICE]);

        //./DEF 2/4/99: total service days used to be calced as 'days -1'

        swprintf(sString, "%d %s", gMercProfiles[Menptr[iId].ubProfile].usTotalDaysServed, gpStrategicString[Enum365.STR_PB_DAYS_ABBREVIATION]);

        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + Prsnl_DATA_OffSetX), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf(sX, pPersonnelScreenPoints[iCounter].y, sString);
        break;

        //		 case 13:
      case 3:
        // cost (PRSNL_TXT_TOTAL_COST)

        /*
                                 if( Menptr[iId].ubWhatKindOfMercAmI == MERC_TYPE__AIM_MERC)
                                 {
                                         UINT32 uiDailyCost = 0;

                                         if( Menptr[iId].bTypeOfLastContract == CONTRACT_EXTEND_2_WEEK )
                                         {
                                                 // 2 week contract
                                                 uiDailyCost = gMercProfiles[ Menptr[ iId ].ubProfile ].uiBiWeeklySalary / 14;
                                         }
                                         else if( Menptr[iId].bTypeOfLastContract == CONTRACT_EXTEND_1_WEEK )
                                         {
                                                 // 1 week contract
                                                 uiDailyCost = gMercProfiles[ Menptr[ iId ].ubProfile ].uiWeeklySalary / 7;
                                         }
                                         else
                                         {
                                                 uiDailyCost = gMercProfiles[ Menptr[ iId ].ubProfile ].sSalary;
                                         }

        //				 swprintf( sString, L"%d",uiDailyCost * Menptr[ iId ].iTotalContractLength );
                                         swprintf( sString, L"%d", gMercProfiles[ Menptr[ iId ].ubProfile ].uiTotalCostToDate );
                                 }
                                 else if( Menptr[iId].ubWhatKindOfMercAmI == MERC_TYPE__MERC)
                                 {
        //					swprintf( sString, L"%d",gMercProfiles[ Menptr[ iId ].ubProfile ].sSalary * gMercProfiles[ Menptr[ iId ].ubProfile ].iMercMercContractLength );
                                                swprintf( sString, L"%d", gMercProfiles[ Menptr[ iId ].ubProfile ].uiTotalCostToDate );
                                 }
                                 else
                                 {
                                         //Display a $0 amount
        //				 swprintf( sString, L"0" );

                                         swprintf( sString, L"%d", gMercProfiles[ Menptr[ iId ].ubProfile ].uiTotalCostToDate );
                                 }
        */
        swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].uiTotalCostToDate);

        // insert commas and dollar sign
        InsertCommasForDollarFigure(sString);
        InsertDollarSignInToString(sString);

        /*
        DEF:3/19/99:
                                 if( Menptr[iId].ubWhatKindOfMercAmI == MERC_TYPE__MERC )
                                 {
                                   swprintf( sStringA, L"%s", pPersonnelScreenStrings[ PRSNL_TXT_UNPAID_AMOUNT ] );
                                 }
                                 else
        */
        { swprintf(sStringA, "%s", pPersonnelScreenStrings[Enum110.PRSNL_TXT_TOTAL_COST]); }

        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + Prsnl_DATA_OffSetX), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
        mprintf((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter].y, sStringA);

        // print contract cost
        mprintf((sX), pPersonnelScreenPoints[iCounter].y, sString);

        if (Menptr[iId].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
          // daily rate
          if (Menptr[iId].bTypeOfLastContract == Enum161.CONTRACT_EXTEND_2_WEEK) {
            // 2 week contract
            swprintf(sStringA, "%d", gMercProfiles[Menptr[iId].ubProfile].uiBiWeeklySalary / 14);
            InsertCommasForDollarFigure(sStringA);
            InsertDollarSignInToString(sStringA);
            swprintf(sString, "%s", sStringA);
          } else if (Menptr[iId].bTypeOfLastContract == Enum161.CONTRACT_EXTEND_1_WEEK) {
            // 1 week contract
            swprintf(sStringA, "%d", gMercProfiles[Menptr[iId].ubProfile].uiWeeklySalary / 7);
            InsertCommasForDollarFigure(sStringA);
            InsertDollarSignInToString(sStringA);
            swprintf(sString, "%s", sStringA);
          } else {
            swprintf(sStringA, "%d", gMercProfiles[Menptr[iId].ubProfile].sSalary);
            InsertCommasForDollarFigure(sStringA);
            InsertDollarSignInToString(sStringA);
            swprintf(sString, "%s", sStringA);
          }
        } else if (Menptr[iId].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
          // DEF: 99/2/7
          //				 swprintf( sStringA, L"%d", gMercProfiles[Menptr[ iId ].ubProfile].sSalary * Menptr[ iId ].iTotalContractLength);
          swprintf(sStringA, "%d", gMercProfiles[Menptr[iId].ubProfile].sSalary);
          InsertCommasForDollarFigure(sStringA);
          InsertDollarSignInToString(sStringA);
          swprintf(sString, "%s", sStringA);
        }

        else {
          // Display a $0 amount
          //				 swprintf( sString, L"0" );
          //				 InsertDollarSignInToString( sString );
          swprintf(sStringA, "%d", gMercProfiles[Menptr[iId].ubProfile].sSalary);
          InsertCommasForDollarFigure(sStringA);
          InsertDollarSignInToString(sStringA);
          swprintf(sString, "%s", sStringA);
        }

        FindFontRightCoordinates((pPersonnelScreenPoints[iCounter].x + (iSlot * TEXT_BOX_WIDTH) + Prsnl_DATA_OffSetX), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));

        //			 iCounter++;
        iCounter++;

        // now print daily rate
        mprintf((sX), pPersonnelScreenPoints[iCounter + 1].y, sString);
        mprintf((pPersonnelScreenPoints[iCounter + 1].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter + 1].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_DAILY_COST]);

        break;

      case 5:
        // medical deposit

        // if its a merc merc, display the salary oweing
        if (Menptr[iId].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
          mprintf((pPersonnelScreenPoints[iCounter - 1].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter - 1].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_UNPAID_AMOUNT]);

          swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].sSalary * gMercProfiles[Menptr[iId].ubProfile].iMercMercContractLength);
          InsertCommasForDollarFigure(sString);
          InsertDollarSignInToString(sString);

          FindFontRightCoordinates((pPersonnelScreenPoints[iCounter - 1].x + (iSlot * TEXT_BOX_WIDTH) + Prsnl_DATA_OffSetX), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
          mprintf(sX, pPersonnelScreenPoints[iCounter - 1].y, sString);
        } else {
          mprintf((pPersonnelScreenPoints[iCounter - 1].x + (iSlot * TEXT_BOX_WIDTH)), pPersonnelScreenPoints[iCounter - 1].y, pPersonnelScreenStrings[Enum110.PRSNL_TXT_MED_DEPOSIT]);

          swprintf(sString, "%d", gMercProfiles[Menptr[iId].ubProfile].sMedicalDepositAmount);

          // insert commas and dollar sign
          InsertCommasForDollarFigure(sString);
          InsertDollarSignInToString(sString);

          FindFontRightCoordinates((pPersonnelScreenPoints[iCounter - 1].x + (iSlot * TEXT_BOX_WIDTH) + Prsnl_DATA_OffSetX), 0, TEXT_BOX_WIDTH - 20, 0, sString, PERS_FONT(), addressof(sX), addressof(sY));
          mprintf(sX, pPersonnelScreenPoints[iCounter - 1].y, sString);
        }

        break;
    }
  }
}

// AIM merc:  Returns the amount of time left on mercs contract
// MERC merc: Returns the amount of time the merc has worked
// IMP merc:	Returns the amount of time the merc has worked
// else:			returns -1
function CalcTimeLeftOnMercContract(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iTimeLeftOnContract: INT32 = -1;

  if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
    iTimeLeftOnContract = pSoldier.value.iEndofContractTime - GetWorldTotalMin();

    if (iTimeLeftOnContract < 0)
      iTimeLeftOnContract = 0;
  } else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
    iTimeLeftOnContract = gMercProfiles[pSoldier.value.ubProfile].iMercMercContractLength;
  }

  else if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__PLAYER_CHARACTER) {
    iTimeLeftOnContract = pSoldier.value.iTotalContractLength;
  }

  else {
    iTimeLeftOnContract = -1;
  }

  return iTimeLeftOnContract;
}

}
