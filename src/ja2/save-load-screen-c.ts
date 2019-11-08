namespace ja2 {

export let gfSchedulesHosed: boolean = false;

//////////////////////////////////////////////////////
//
//  Defines
//
//////////////////////////////////////////////////////

const SAVE_LOAD_TITLE_FONT = () => FONT14ARIAL();
const SAVE_LOAD_TITLE_COLOR = FONT_MCOLOR_WHITE;

const SAVE_LOAD_NORMAL_FONT = () => FONT12ARIAL();
const SAVE_LOAD_NORMAL_COLOR = 2; // FONT_MCOLOR_DKWHITE//2//FONT_MCOLOR_WHITE
const SAVE_LOAD_NORMAL_SHADOW_COLOR = 118; // 121//118//125
/*#define		SAVE_LOAD_NORMAL_FONT								FONT12ARIAL
#define		SAVE_LOAD_NORMAL_COLOR							FONT_MCOLOR_DKWHITE//2//FONT_MCOLOR_WHITE
#define		SAVE_LOAD_NORMAL_SHADOW_COLOR				2//125
*/

const SAVE_LOAD_QUICKSAVE_FONT = () => FONT12ARIAL();
const SAVE_LOAD_QUICKSAVE_COLOR = 2; // FONT_MCOLOR_DKGRAY//FONT_MCOLOR_WHITE
const SAVE_LOAD_QUICKSAVE_SHADOW_COLOR = 189; // 248//2

const SAVE_LOAD_EMPTYSLOT_FONT = () => FONT12ARIAL();
const SAVE_LOAD_EMPTYSLOT_COLOR = 2; // 125//FONT_MCOLOR_WHITE
const SAVE_LOAD_EMPTYSLOT_SHADOW_COLOR = 121; // 118

const SAVE_LOAD_HIGHLIGHTED_FONT = () => FONT12ARIAL();
const SAVE_LOAD_HIGHLIGHTED_COLOR = FONT_MCOLOR_WHITE;
const SAVE_LOAD_HIGHLIGHTED_SHADOW_COLOR = 2;

const SAVE_LOAD_SELECTED_FONT = () => FONT12ARIAL();
const SAVE_LOAD_SELECTED_COLOR = 2; // 145//FONT_MCOLOR_WHITE
const SAVE_LOAD_SELECTED_SHADOW_COLOR = 130; // 2

const SAVE_LOAD_NUMBER_FONT = () => FONT12ARIAL();
const SAVE_LOAD_NUMBER_COLOR = FONT_MCOLOR_WHITE;

const SLG_SELECTED_COLOR = FONT_MCOLOR_WHITE;
const SLG_UNSELECTED_COLOR = FONT_MCOLOR_DKWHITE;

const SLG_SAVELOCATION_WIDTH = 605;
const SLG_SAVELOCATION_HEIGHT = 30; // 46
const SLG_FIRST_SAVED_SPOT_X = 17;
const SLG_FIRST_SAVED_SPOT_Y = 49;
const SLG_GAP_BETWEEN_LOCATIONS = 35; // 47

const SLG_DATE_OFFSET_X = 13;
const SLG_DATE_OFFSET_Y = 11;

const SLG_SECTOR_OFFSET_X = 95; // 105//114
const SLG_SECTOR_OFFSET_Y = SLG_DATE_OFFSET_Y;
const SLG_SECTOR_WIDTH = 98;

const SLG_NUM_MERCS_OFFSET_X = 196; // 190//SLG_DATE_OFFSET_X
const SLG_NUM_MERCS_OFFSET_Y = SLG_DATE_OFFSET_Y; // 26

const SLG_BALANCE_OFFSET_X = 260; // SLG_SECTOR_OFFSET_X
const SLG_BALANCE_OFFSET_Y = SLG_DATE_OFFSET_Y; // SLG_NUM_MERCS_OFFSET_Y

const SLG_SAVE_GAME_DESC_X = 318; // 320//204
const SLG_SAVE_GAME_DESC_Y = SLG_DATE_OFFSET_Y; // SLG_DATE_OFFSET_Y + 7

const SLG_TITLE_POS_X = 0;
const SLG_TITLE_POS_Y = 0;

const SLG_SAVE_CANCEL_POS_X = 226; // 329
const SLG_LOAD_CANCEL_POS_X = 329;
const SLG_CANCEL_POS_Y = 438;

const SLG_SAVE_LOAD_BTN_POS_X = 123;
const SLG_SAVE_LOAD_BTN_POS_Y = 438;

const SLG_SELECTED_SLOT_GRAPHICS_NUMBER = 3;
const SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER = 2;

const SLG_DOUBLE_CLICK_DELAY = 500;

// defines for saved game version status
const enum Enum25 {
  SLS_HEADER_OK,
  SLS_SAVED_GAME_VERSION_OUT_OF_DATE,
  SLS_GAME_VERSION_OUT_OF_DATE,
  SLS_BOTH_SAVE_GAME_AND_GAME_VERSION_OUT_OF_DATE,
}

// ddd

//////////////////////////////////////////////////////
//
//  Global Variables
//
//////////////////////////////////////////////////////

let gfSaveLoadScreenEntry: boolean = true;
let gfSaveLoadScreenExit: boolean = false;
export let gfRedrawSaveLoadScreen: boolean = true;

let gfExitAfterMessageBox: boolean = false;
let giSaveLoadMessageBox: INT32 = -1; // SaveLoad pop up messages index value

let guiSaveLoadExitScreen: UINT32 = Enum26.SAVE_LOAD_SCREEN;

// Contains the array of valid save game locations
export let gbSaveGameArray: boolean[] /* [NUM_SAVE_GAMES] */;

let gfDoingQuickLoad: boolean = false;

export let gfFailedToSaveGameWhenInsideAMessageBox: boolean = false;

// This flag is used to diferentiate between loading a game and saveing a game.
// gfSaveGame=TRUE		For saving a game
// gfSaveGame=FALSE		For loading a game
export let gfSaveGame: boolean = true;

let gfSaveLoadScreenButtonsCreated: boolean = false;

let gbSaveGameSelectedLocation: INT8[] /* [NUM_SAVE_GAMES] */;
let gbSelectedSaveLocation: INT8 = -1;
let gbHighLightedLocation: INT8 = -1;
let gbLastHighLightedLocation: INT8 = -1;
let gbSetSlotToBeSelected: INT8 = -1;

let guiSlgBackGroundImage: UINT32;
let guiBackGroundAddOns: UINT32;

// The string that will contain the game desc text
let gzGameDescTextField: string /* wchar_t[SIZE_OF_SAVE_GAME_DESC] */ = [ 0 ];

let gfUserInTextInputMode: boolean = false;
let gubSaveGameNextPass: UINT8 = 0;

let gfStartedFadingOut: boolean = false;

export let gfCameDirectlyFromGame: boolean = false;

export let gfLoadedGame: boolean = false; // Used to know when a game has been loaded, the flag in gtacticalstatus might have been reset already

export let gfLoadGameUponEntry: boolean = false;

let gfHadToMakeBasementLevels: boolean = false;

export let gfGettingNameFromSaveLoadScreen: boolean = false;

// ggg

//
// Buttons
//
let guiSlgButtonImage: INT32;

let guiSlgCancelBtn: UINT32;

let guiSlgSaveLoadBtn: UINT32;
let guiSaveLoadImage: INT32;

// Mouse regions for the currently selected save game
let gSelectedSaveRegion: MOUSE_REGION[] /* [NUM_SAVE_GAMES] */;

let gSLSEntireScreenRegion: MOUSE_REGION;

//////////////////////////////////////////////////////
//
//  Function Prototypes
//
//////////////////////////////////////////////////////

// ppp

//////////////////////////////////////////////////////
//
//  Code
//
//////////////////////////////////////////////////////

export function SaveLoadScreenInit(): UINT32 {
  // Set so next time we come in, we can set up
  gfSaveLoadScreenEntry = true;

  memset(gbSaveGameArray, -1, NUM_SAVE_GAMES);

  ClearSelectedSaveSlot();

  gbHighLightedLocation = -1;

  return true;
}

export function SaveLoadScreenHandle(): UINT32 {
  StartFrameBufferRender();

  if (gfSaveLoadScreenEntry) {
    EnterSaveLoadScreen();
    gfSaveLoadScreenEntry = false;
    gfSaveLoadScreenExit = false;

    PauseGame();

    // save the new rect
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, 0, 0, 639, 439);
  }

  RestoreBackgroundRects();

  // to guarentee that we do not accept input when we are fading out
  if (!gfStartedFadingOut) {
    GetSaveLoadScreenUserInput();
  } else
    gfRedrawSaveLoadScreen = false;

  // if we have exited the save load screen, exit
  if (!gfSaveLoadScreenButtonsCreated)
    return guiSaveLoadExitScreen;

  RenderAllTextFields();

  HandleSaveLoadScreen();

  if (gfRedrawSaveLoadScreen) {
    RenderSaveLoadScreen();
    MarkButtonsDirty();
    RenderButtons();

    gfRedrawSaveLoadScreen = false;
  }

  if (gubSaveGameNextPass != 0) {
    gubSaveGameNextPass++;

    if (gubSaveGameNextPass == 5) {
      gubSaveGameNextPass = 0;
      SaveLoadGameNumber(gbSelectedSaveLocation);
    }
  }

  // If we are not exiting the screen, render the buttons
  if (!gfSaveLoadScreenExit && guiSaveLoadExitScreen == Enum26.SAVE_LOAD_SCREEN) {
    // render buttons marked dirty
    RenderButtons();
  }

  // ATE: Put here to save RECTS before any fast help being drawn...
  SaveBackgroundRects();
  RenderButtonsFastHelp();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  if (HandleFadeOutCallback()) {
    return guiSaveLoadExitScreen;
  }

  if (HandleBeginFadeOut(Enum26.SAVE_LOAD_SCREEN)) {
    return Enum26.SAVE_LOAD_SCREEN;
  }

  if (gfSaveLoadScreenExit) {
    ExitSaveLoadScreen();
  }

  if (HandleFadeInCallback()) {
    // Re-render the scene!
    RenderSaveLoadScreen();
  }

  if (HandleBeginFadeIn(Enum26.SAVE_LOAD_SCREEN)) {
  }

  return guiSaveLoadExitScreen;
}

export function SaveLoadScreenShutdown(): UINT32 {
  return true;
}

function SetSaveLoadExitScreen(uiScreen: UINT32): void {
  if (uiScreen == Enum26.GAME_SCREEN) {
    EnterTacticalScreen();
  }

  // If we are currently in the Message box loop
  //	if( gfExitAfterMessageBox )
  //		ExitSaveLoadScreen();

  gfSaveLoadScreenExit = true;

  guiSaveLoadExitScreen = uiScreen;

  SetPendingNewScreen(uiScreen);

  if (gfDoingQuickLoad) {
    fFirstTimeInGameScreen = true;
    SetPendingNewScreen(uiScreen);
  }

  ExitSaveLoadScreen();

  DestroySaveLoadTextInputBoxes();
}

function EnterSaveLoadScreen(): boolean {
  let i: INT8;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let usPosX: UINT16 = SLG_FIRST_SAVED_SPOT_X;
  let usPosY: UINT16 = SLG_FIRST_SAVED_SPOT_Y;

  //	if( guiPreviousOptionScreen != MAINMENU_SCREEN )
  //		gbSetSlotToBeSelected = -1;

  // This is a hack to get sector names , but... if the underground sector is NOT loaded
  if (!gpUndergroundSectorInfoHead) {
    BuildUndergroundSectorInfoList();
    gfHadToMakeBasementLevels = true;
  } else {
    gfHadToMakeBasementLevels = false;
  }

  guiSaveLoadExitScreen = Enum26.SAVE_LOAD_SCREEN;
  // init the list
  InitSaveGameArray();

  // Clear out all the saved background rects
  EmptyBackgroundRects();

  // if the user has asked to load the selected save
  if (gfLoadGameUponEntry) {
    // make sure the save is valid
    if (gGameSettings.bLastSavedGameSlot != -1 && gbSaveGameArray[gGameSettings.bLastSavedGameSlot]) {
      gbSelectedSaveLocation = gGameSettings.bLastSavedGameSlot;

      // load the saved game
      ConfirmLoadSavedGameMessageBoxCallBack(MSG_BOX_RETURN_YES);
    } else {
      // else the save isnt valid, so dont load it
      gfLoadGameUponEntry = false;
    }
  }

  // load Main background  graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\LoadScreen.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSlgBackGroundImage))) {
    return false;
  }

  // load Load Screen Add ons graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_LOADSAVEHEADER);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBackGroundAddOns))) {
    return false;
  }

  guiSlgButtonImage = LoadButtonImage("INTERFACE\\LoadScreenAddOns.sti", -1, 6, -1, 9, -1);
  //	guiSlgButtonImage = UseLoadedButtonImage( guiBackGroundAddOns, -1,9,-1,6,-1 );

  // Cancel button
  //	if( gfSaveGame )
  //		usPosX = SLG_SAVE_CANCEL_POS_X;
  //	else
  usPosX = SLG_LOAD_CANCEL_POS_X;

  guiSlgCancelBtn = CreateIconAndTextButton(guiSlgButtonImage, zSaveLoadText[Enum371.SLG_CANCEL], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, SLG_CANCEL_POS_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnSlgCancelCallback);

  // Either the save or load button
  if (gfSaveGame) {
    // If we are saving, dont have the save game button
    guiSaveLoadImage = UseLoadedButtonImage(guiSlgButtonImage, -1, 5, -1, 8, -1);

    guiSlgSaveLoadBtn = CreateIconAndTextButton(guiSaveLoadImage, zSaveLoadText[Enum371.SLG_SAVE_GAME], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, SLG_SAVE_LOAD_BTN_POS_X, SLG_SAVE_LOAD_BTN_POS_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnSlgSaveLoadCallback);
  } else {
    guiSaveLoadImage = UseLoadedButtonImage(guiSlgButtonImage, -1, 4, -1, 7, -1);

    guiSlgSaveLoadBtn = CreateIconAndTextButton(guiSaveLoadImage, zSaveLoadText[Enum371.SLG_LOAD_GAME], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, SLG_SAVE_LOAD_BTN_POS_X, SLG_SAVE_LOAD_BTN_POS_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnSlgSaveLoadCallback);
  }

  // if we are loading, disable the load button
  //	if( !gfSaveGame )
  {
    SpecifyDisabledButtonStyle(guiSlgSaveLoadBtn, Enum29.DISABLED_STYLE_HATCHED);

    if (gbSetSlotToBeSelected == -1)
      DisableButton(guiSlgSaveLoadBtn);
  }

  usPosX = SLG_FIRST_SAVED_SPOT_X;
  usPosY = SLG_FIRST_SAVED_SPOT_Y;
  for (i = 0; i < NUM_SAVE_GAMES; i++) {
    MSYS_DefineRegion(addressof(gSelectedSaveRegion[i]), usPosX, usPosY, (usPosX + SLG_SAVELOCATION_WIDTH), (usPosY + SLG_SAVELOCATION_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, SelectedSaveRegionMovementCallBack, SelectedSaveRegionCallBack);
    MSYS_AddRegion(addressof(gSelectedSaveRegion[i]));
    MSYS_SetRegionUserData(addressof(gSelectedSaveRegion[i]), 0, i);

    // if we are to Load a game
    if (!gfSaveGame) {
      // We cannot load a game that hasnt been saved
      if (!gbSaveGameArray[i])
        MSYS_DisableRegion(addressof(gSelectedSaveRegion[i]));
    }

    usPosY += SLG_GAP_BETWEEN_LOCATIONS;
  }

  /*
  Removed so that the user can click on it and get displayed a message that the quick save slot is for the tactical screen
          if( gfSaveGame )
          {
                  MSYS_DisableRegion( &gSelectedSaveRegion[0] );
          }
  */

  // Create the screen mask to enable ability to righ click to cancel the sace game
  MSYS_DefineRegion(addressof(gSLSEntireScreenRegion), 0, 0, 639, 479, MSYS_PRIORITY_HIGH - 10, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, SelectedSLSEntireRegionCallBack);
  MSYS_AddRegion(addressof(gSLSEntireScreenRegion));

  // Reset the regions
  //	for( i=0; i<NUM_SAVE_GAMES; i++)
  //		gbSaveGameSelectedLocation[i] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;
  //	gbSelectedSaveLocation=-1;
  ClearSelectedSaveSlot();

  // Remove the mouse region over the clock
  RemoveMouseRegionForPauseOfClock();

  // Draw the screen
  //	gfRedrawSaveLoadScreen = TRUE;	DEF:

  // Reset the highlight
  gbHighLightedLocation = -1;

  gzGameDescTextField[0] = '\0';

  // if we are loading
  //	if( !gfSaveGame )
  {
    SpecifyDisabledButtonStyle(guiSlgSaveLoadBtn, Enum29.DISABLED_STYLE_HATCHED);

    // if the last saved game slot is ok, set the selected slot to the last saved slot]
    if (gGameSettings.bLastSavedGameSlot != -1) {
      // if the slot is valid
      if (gbSaveGameArray[gGameSettings.bLastSavedGameSlot]) {
        let SaveGameHeader: SAVED_GAME_HEADER = createSaveGameHeader();

        memset(addressof(SaveGameHeader), 0, sizeof(SAVED_GAME_HEADER));

        // if it is not the Quick Save slot, and we are loading
        if (!gfSaveGame || gfSaveGame && gGameSettings.bLastSavedGameSlot != 0) {
          gbSelectedSaveLocation = gGameSettings.bLastSavedGameSlot;
          gbSaveGameSelectedLocation[gbSelectedSaveLocation] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;

          // load the save gamed header string

          // Get the heade for the saved game
          if (!LoadSavedGameHeader(gbSelectedSaveLocation, addressof(SaveGameHeader))) {
            memset(addressof(SaveGameHeader), 0, sizeof(SAVED_GAME_HEADER));
            gbSaveGameSelectedLocation[gbSelectedSaveLocation] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;
            gbSaveGameArray[gbSelectedSaveLocation] = false;
            gbSelectedSaveLocation = gGameSettings.bLastSavedGameSlot = -1;
          }

          gzGameDescTextField = SaveGameHeader.sSavedGameDesc;
        }
      }
    }

    // if we are loading and the there is no slot selected
    if (gbSelectedSaveLocation == -1)
      DisableButton(guiSlgSaveLoadBtn);
    else
      EnableButton(guiSlgSaveLoadBtn);
  }

  /*
          if( gbSetSlotToBeSelected != -1 )
          {
                  gbSelectedSaveLocation = gbSetSlotToBeSelected;
                  gbSetSlotToBeSelected = -1;

                  //Set the selected slot background graphic
                  gbSaveGameSelectedLocation[ gbSelectedSaveLocation ] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;
          }
  */

  RenderSaveLoadScreen();

  // Save load buttons are created
  gfSaveLoadScreenButtonsCreated = true;

  gfDoingQuickLoad = false;

  // reset
  gfStartedFadingOut = false;

  DisableScrollMessages();

  gfLoadedGame = false;

  if (gfLoadGameUponEntry) {
    let uiDestPitchBYTES: UINT32;
    let pDestBuf: Pointer<UINT8>;

    // unmark the 2 buttons from being dirty
    ButtonList[guiSlgCancelBtn].value.uiFlags |= BUTTON_FORCE_UNDIRTY;
    ButtonList[guiSlgSaveLoadBtn].value.uiFlags |= BUTTON_FORCE_UNDIRTY;

    // CLEAR THE FRAME BUFFER
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    memset(pDestBuf, 0, SCREEN_HEIGHT * uiDestPitchBYTES);
    UnLockVideoSurface(FRAME_BUFFER);

    // CLEAR THE guiRENDERBUFFER
    pDestBuf = LockVideoSurface(guiRENDERBUFFER, addressof(uiDestPitchBYTES));
    memset(pDestBuf, 0, SCREEN_HEIGHT * uiDestPitchBYTES);
    UnLockVideoSurface(guiRENDERBUFFER);
  }

  gfGettingNameFromSaveLoadScreen = false;

  return true;
}

function ExitSaveLoadScreen(): void {
  let i: INT8;

  gfLoadGameUponEntry = false;

  if (!gfSaveLoadScreenButtonsCreated)
    return;

  gfSaveLoadScreenExit = false;
  gfSaveLoadScreenEntry = true;
  gfExitAfterMessageBox = false;

  UnloadButtonImage(guiSlgButtonImage);

  RemoveButton(guiSlgCancelBtn);

  // Remove the save / load button
  //	if( !gfSaveGame )
  {
    RemoveButton(guiSlgSaveLoadBtn);
    UnloadButtonImage(guiSaveLoadImage);
  }

  for (i = 0; i < NUM_SAVE_GAMES; i++) {
    MSYS_RemoveRegion(addressof(gSelectedSaveRegion[i]));
  }

  DeleteVideoObjectFromIndex(guiSlgBackGroundImage);
  DeleteVideoObjectFromIndex(guiBackGroundAddOns);

  // Destroy the text fields ( if created )
  DestroySaveLoadTextInputBoxes();

  MSYS_RemoveRegion(addressof(gSLSEntireScreenRegion));

  gfSaveLoadScreenEntry = true;
  gfSaveLoadScreenExit = false;

  if (!gfLoadedGame) {
    UnLockPauseState();
    UnPauseGame();
  }

  gfSaveLoadScreenButtonsCreated = false;

  gfCameDirectlyFromGame = false;

  // unload the basement sectors
  if (gfHadToMakeBasementLevels)
    TrashUndergroundSectorInfo();

  gfGettingNameFromSaveLoadScreen = false;
}

function RenderSaveLoadScreen(): void {
  let hPixHandle: HVOBJECT;

  // if we are going to be instantly leaving the screen, dont draw the numbers
  if (gfLoadGameUponEntry) {
    return;
  }

  GetVideoObject(addressof(hPixHandle), guiSlgBackGroundImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);

  if (gfSaveGame) {
    // If we are saving a game

    // Display the Title
    //		DrawTextToScreen( zSaveLoadText[SLG_SAVE_GAME], 0, 10, 639, SAVE_LOAD_TITLE_FONT, SAVE_LOAD_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED	);
    GetVideoObject(addressof(hPixHandle), guiBackGroundAddOns);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, SLG_TITLE_POS_X, SLG_TITLE_POS_Y, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    // If we are Loading a game

    // Display the Title
    GetVideoObject(addressof(hPixHandle), guiBackGroundAddOns);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, SLG_TITLE_POS_X, SLG_TITLE_POS_Y, VO_BLT_SRCTRANSPARENCY, null);
  }

  DisplaySaveGameList();

  InvalidateRegion(0, 0, 639, 479);
}

function HandleSaveLoadScreen(): void {
  // If the game failed when in a message box, pop up a message box stating this
  if (gfFailedToSaveGameWhenInsideAMessageBox) {
    gfFailedToSaveGameWhenInsideAMessageBox = false;

    DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_SAVE_GAME_ERROR], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, RedrawSaveLoadScreenAfterMessageBox);

    //		gbSelectedSaveLocation = -1;
    gbHighLightedLocation = -1;

    //		for( i=0; i<NUM_SAVE_GAMES; i++)
    //			gbSaveGameSelectedLocation[i] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;
    ClearSelectedSaveSlot();
  }
}

function GetSaveLoadScreenUserInput(): void {
  let Event: InputAtom;
  let MousePos: POINT = createPoint();
  let bActiveTextField: INT8;
  /* static */ let fWasCtrlHeldDownLastFrame: boolean = false;

  GetCursorPos(addressof(MousePos));

  // if we are going to be instantly leaving the screen, dont draw the numbers
  if (gfLoadGameUponEntry) {
    return;
  }

  if (gfKeyState[ALT]) {
    DisplayOnScreenNumber(false);
  } else {
    DisplayOnScreenNumber(true);
  }

  if (gfKeyState[CTRL] || fWasCtrlHeldDownLastFrame) {
    DisplaySaveGameEntry(gbSelectedSaveLocation);
  }

  fWasCtrlHeldDownLastFrame = gfKeyState[CTRL];

  while (DequeueEvent(addressof(Event))) {
    // HOOK INTO MOUSE HOOKS
    switch (Event.usEvent) {
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

    if (!HandleTextInput(addressof(Event)) && Event.usEvent == KEY_DOWN) {
      switch (Event.usParam) {
        case '1':
          SetSelection(1);
          break;
        case '2':
          SetSelection(2);
          break;
        case '3':
          SetSelection(3);
          break;
        case '4':
          SetSelection(4);
          break;
        case '5':
          SetSelection(5);
          break;
        case '6':
          SetSelection(6);
          break;
        case '7':
          SetSelection(7);
          break;
        case '8':
          SetSelection(8);
          break;
        case '9':
          SetSelection(9);
          break;
        case '0':
          SetSelection(10);
          break;
      }
    }

    if (Event.usEvent == KEY_UP) {
      switch (Event.usParam) {
        case 'a':
          if (gfKeyState[ALT] && !gfSaveGame) {
            let iFile: INT8 = GetNumberForAutoSave(true);

            if (iFile == -1)
              break;

            guiLastSaveGameNum = iFile;

            gbSelectedSaveLocation = SAVE__END_TURN_NUM;
            StartFadeOutForSaveLoadScreen();
          }
          break;

        case 'b':
          if (gfKeyState[ALT] && !gfSaveGame) {
            let iFile: INT8 = GetNumberForAutoSave(false);

            if (iFile == -1)
              break;
            else if (iFile == 0)
              guiLastSaveGameNum = 1;
            else if (iFile == 1)
              guiLastSaveGameNum = 0;

            gbSelectedSaveLocation = SAVE__END_TURN_NUM;
            StartFadeOutForSaveLoadScreen();
          }
          break;

        case UPARROW:
          MoveSelectionUpOrDown(true);
          break;

        case DNARROW:
          MoveSelectionUpOrDown(false);
          break;

        case ESC:
          if (gbSelectedSaveLocation == -1) {
            if (gfCameDirectlyFromGame)
              SetSaveLoadExitScreen(guiPreviousOptionScreen);

            else if (guiPreviousOptionScreen == Enum26.MAINMENU_SCREEN)
              SetSaveLoadExitScreen(Enum26.MAINMENU_SCREEN);
            else
              SetSaveLoadExitScreen(Enum26.OPTIONS_SCREEN);
          } else {
            // Reset the selected slot background graphic
            gbSaveGameSelectedLocation[gbSelectedSaveLocation] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;

            // reset selected slot
            gbSelectedSaveLocation = -1;
            gfRedrawSaveLoadScreen = true;
            DestroySaveLoadTextInputBoxes();

            //						if( !gfSaveGame )
            DisableButton(guiSlgSaveLoadBtn);
          }
          break;

        case ENTER:

          if (gfSaveGame) {
            bActiveTextField = GetActiveFieldID();
            if (bActiveTextField && bActiveTextField != -1) {
              Get16BitStringFromField(bActiveTextField, gzGameDescTextField);
              SetActiveField(0);

              DestroySaveLoadTextInputBoxes();

              SaveLoadGameNumber(gbSelectedSaveLocation);
              return;
            } else {
              if (gbSelectedSaveLocation != -1) {
                SaveLoadGameNumber(gbSelectedSaveLocation);
                return;
              }
            }
            // Enable the save/load button
            if (gbSelectedSaveLocation != -1)
              if (!gfSaveGame)
                EnableButton(guiSlgSaveLoadBtn);

            gfRedrawSaveLoadScreen = true;
          } else
            SaveLoadGameNumber(gbSelectedSaveLocation);

          break;
      }
    }
  }
}

function SaveLoadGameNumber(bSaveGameID: INT8): void {
  //	CHAR16	zTemp[128];
  let ubRetVal: UINT8 = 0;

  if (bSaveGameID >= NUM_SAVE_GAMES || bSaveGameID < 0) {
    return;
  }

  if (gfSaveGame) {
    let bActiveTextField: INT8;

    bActiveTextField = GetActiveFieldID();
    if (bActiveTextField && bActiveTextField != -1) {
      Get16BitStringFromField(bActiveTextField, gzGameDescTextField);
    }

    // if there is save game in the slot, ask for confirmation before overwriting
    if (gbSaveGameArray[bSaveGameID]) {
      let sText: string /* CHAR16[512] */;

      sText = swprintf(zSaveLoadText[Enum371.SLG_CONFIRM_SAVE], bSaveGameID);

      DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, sText, Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmSavedGameMessageBoxCallBack);
    } else {
      // else do NOT put up a confirmation

      // Save the game
      SaveGameToSlotNum();
    }
  } else {
    // Check to see if the save game headers are the same
    ubRetVal = CompareSaveGameVersion(bSaveGameID);
    if (ubRetVal != Enum25.SLS_HEADER_OK) {
      if (ubRetVal == Enum25.SLS_GAME_VERSION_OUT_OF_DATE) {
        DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_GAME_VERSION_DIF], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_YESNO, LoadSavedGameWarningMessageBoxCallBack);
      } else if (ubRetVal == Enum25.SLS_SAVED_GAME_VERSION_OUT_OF_DATE) {
        DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_SAVED_GAME_VERSION_DIF], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_YESNO, LoadSavedGameWarningMessageBoxCallBack);
      } else {
        DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_BOTH_GAME_AND_SAVED_GAME_DIF], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_YESNO, LoadSavedGameWarningMessageBoxCallBack);
      }
    } else {
      /*
                              IF YOU UNCOMMENT THIS -- LOCALIZE IT!!!
                              CHAR16	sText[512];

                              swprintf( sText, L"%s%d?", zSaveLoadText[SLG_CONFIRM_LOAD], bSaveGameID );

                              DoSaveLoadMessageBox( MSG_BOX_BASIC_STYLE, sText, SAVE_LOAD_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmLoadSavedGameMessageBoxCallBack );
      */
      // Setup up the fade routines
      StartFadeOutForSaveLoadScreen();
    }
  }
}

export function DoSaveLoadMessageBoxWithRect(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK, pCenteringRect: Pointer<SGPRect>): boolean {
  // do message box and return
  giSaveLoadMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, pCenteringRect);

  // send back return state
  return giSaveLoadMessageBox != -1;
}

function DoSaveLoadMessageBox(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): boolean {
  let CenteringRect: SGPRect = createSGPRectFrom(0, 0, 639, 479);

  // do message box and return
  giSaveLoadMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, addressof(CenteringRect));

  // send back return state
  return giSaveLoadMessageBox != -1;
}

export function InitSaveGameArray(): boolean {
  let cnt: INT8;
  let zSaveGameName: string /* CHAR8[512] */;
  let SaveGameHeader: SAVED_GAME_HEADER = createSaveGameHeader();

  for (cnt = 0; cnt < NUM_SAVE_GAMES; cnt++) {
    CreateSavedGameFileNameFromNumber(cnt, zSaveGameName);

    if (FileExists(zSaveGameName)) {
      // Get the header for the saved game
      if (!LoadSavedGameHeader(cnt, addressof(SaveGameHeader)))
        gbSaveGameArray[cnt] = false;
      else
        gbSaveGameArray[cnt] = true;
    } else
      gbSaveGameArray[cnt] = false;
  }

  return true;
}

function DisplaySaveGameList(): boolean {
  let bLoop1: INT8;
  //	UINT16 usPosX = SLG_FIRST_SAVED_SPOT_X;
  let usPosY: UINT16 = SLG_FIRST_SAVED_SPOT_Y;

  for (bLoop1 = 0; bLoop1 < NUM_SAVE_GAMES; bLoop1++) {
    // display all the information from the header
    DisplaySaveGameEntry(bLoop1); // usPosY );

    usPosY += SLG_GAP_BETWEEN_LOCATIONS;
  }

  return true;
}

function DisplaySaveGameEntry(bEntryID: INT8): boolean //, UINT16 usPosY )
{
  let zDateString: string /* CHAR16[128] */;
  let zLocationString: string /* CHAR16[128] */;
  let zNumMercsString: string /* CHAR16[128] */;
  let zBalanceString: string /* CHAR16[128] */;
  let SaveGameHeader: SAVED_GAME_HEADER = createSaveGameHeader();
  let hPixHandle: HVOBJECT;
  let usPosX: UINT16 = SLG_FIRST_SAVED_SPOT_X;
  let uiFont: UINT32 = SAVE_LOAD_TITLE_FONT();
  let ubFontColor: UINT8 = SAVE_LOAD_TITLE_COLOR;
  let usPosY: UINT16 = SLG_FIRST_SAVED_SPOT_Y + (SLG_GAP_BETWEEN_LOCATIONS * bEntryID);

  // if we are going to be instantly leaving the screen, dont draw the numbers
  if (gfLoadGameUponEntry) {
    return true;
  }

  if (bEntryID == -1)
    return true;

  // if we are currently fading out, leave
  if (gfStartedFadingOut)
    return true;

  // background
  GetVideoObject(addressof(hPixHandle), guiBackGroundAddOns);
  BltVideoObject(FRAME_BUFFER, hPixHandle, gbSaveGameSelectedLocation[bEntryID], usPosX, usPosY, VO_BLT_SRCTRANSPARENCY, null);

  //
  // Set the shadow color
  //

  // if its the QuickSave slot
  if (bEntryID == 0 && gfSaveGame) {
    SetFontShadow(SAVE_LOAD_QUICKSAVE_SHADOW_COLOR);
    ubFontColor = SAVE_LOAD_QUICKSAVE_COLOR;
    uiFont = SAVE_LOAD_QUICKSAVE_FONT();

    // Shadow the slot
    //		if( !gbSaveGameArray[ bEntryID ] )
    ShadowVideoSurfaceRect(FRAME_BUFFER, usPosX, usPosY, usPosX + SLG_SAVELOCATION_WIDTH, usPosY + SLG_SAVELOCATION_HEIGHT);
  }

  // else if its the currently selected location
  else if (bEntryID == gbSelectedSaveLocation) {
    SetFontShadow(SAVE_LOAD_SELECTED_SHADOW_COLOR); // 130
    ubFontColor = SAVE_LOAD_SELECTED_COLOR; // SAVE_LOAD_NORMAL_COLOR;
    uiFont = SAVE_LOAD_SELECTED_FONT();
  }

  // else it is the highlighted slot
  else if (bEntryID == gbHighLightedLocation) {
    SetFontShadow(SAVE_LOAD_HIGHLIGHTED_SHADOW_COLOR);
    ubFontColor = SAVE_LOAD_HIGHLIGHTED_COLOR;
    uiFont = SAVE_LOAD_HIGHLIGHTED_FONT();
  }

  // if the file doesnt exists
  else if (!gbSaveGameArray[bEntryID]) {
    // if we are loading a game
    if (!gfSaveGame) {
      SetFontShadow(SAVE_LOAD_QUICKSAVE_SHADOW_COLOR);
      ubFontColor = SAVE_LOAD_QUICKSAVE_COLOR;
      uiFont = SAVE_LOAD_QUICKSAVE_FONT();

      // Shadow the surface
      ShadowVideoSurfaceRect(FRAME_BUFFER, usPosX, usPosY, usPosX + SLG_SAVELOCATION_WIDTH, usPosY + SLG_SAVELOCATION_HEIGHT);
    } else {
      SetFontShadow(SAVE_LOAD_EMPTYSLOT_SHADOW_COLOR);
      ubFontColor = SAVE_LOAD_EMPTYSLOT_COLOR;
      uiFont = SAVE_LOAD_EMPTYSLOT_FONT();
    }
  } else {
    SetFontShadow(SAVE_LOAD_NORMAL_SHADOW_COLOR);
    ubFontColor = SAVE_LOAD_NORMAL_COLOR;
    uiFont = SAVE_LOAD_NORMAL_FONT();
  }

  // if the file exists
  if (gbSaveGameArray[bEntryID] || gbSelectedSaveLocation == bEntryID) {
    //
    // Setup the strings to be displayed
    //

    // if we are saving AND it is the currently selected slot
    if (gfSaveGame && gbSelectedSaveLocation == bEntryID) {
      // the user has selected a spot to save.  Fill out all the required information
      SaveGameHeader.uiDay = GetWorldDay();
      SaveGameHeader.ubHour = GetWorldHour();
      SaveGameHeader.ubMin = guiMin;

      // Get the sector value to save.
      GetBestPossibleSectorXYZValues(addressof(SaveGameHeader.sSectorX), addressof(SaveGameHeader.sSectorY), addressof(SaveGameHeader.bSectorZ));

      //			SaveGameHeader.sSectorX = gWorldSectorX;
      //			SaveGameHeader.sSectorY = gWorldSectorY;
      //			SaveGameHeader.bSectorZ = gbWorldSectorZ;
      SaveGameHeader.ubNumOfMercsOnPlayersTeam = NumberOfMercsOnPlayerTeam();
      SaveGameHeader.iCurrentBalance = LaptopSaveInfo.iCurrentBalance;
      SaveGameHeader.sSavedGameDesc = gzGameDescTextField;

      // copy over the initial game options
      memcpy(addressof(SaveGameHeader.sInitialGameOptions), addressof(gGameOptions), sizeof(GAME_OPTIONS));
    } else {
      // Get the header for the specified saved game
      if (!LoadSavedGameHeader(bEntryID, addressof(SaveGameHeader))) {
        memset(addressof(SaveGameHeader), 0, sizeof(SaveGameHeader));
        return false;
      }
    }

    // if this is the currently selected location, move the text down a bit
    if (gbSelectedSaveLocation == bEntryID) {
      usPosX++;
      usPosY--;
    }

    // if the user is LOADING and holding down the CTRL key, display the additional info
    if (!gfSaveGame && gfKeyState[CTRL] && gbSelectedSaveLocation == bEntryID) {
      let zMouseHelpTextString: string /* CHAR16[256] */;
      let zDifString: string /* CHAR16[256] */;

      // Create a string for difficulty level
      zDifString = swprintf("%s %s", gzGIOScreenText[Enum375.GIO_EASY_TEXT + SaveGameHeader.sInitialGameOptions.ubDifficultyLevel - 1], zSaveLoadText[Enum371.SLG_DIFF]);

      // make a string containing the extended options
      zMouseHelpTextString = swprintf("%20s     %22s     %22s     %22s", zDifString, SaveGameHeader.sInitialGameOptions.fIronManMode ? gzGIOScreenText[Enum375.GIO_IRON_MAN_TEXT] : gzGIOScreenText[Enum375.GIO_SAVE_ANYWHERE_TEXT], SaveGameHeader.sInitialGameOptions.fGunNut ? zSaveLoadText[Enum371.SLG_ADDITIONAL_GUNS] : zSaveLoadText[Enum371.SLG_NORMAL_GUNS], SaveGameHeader.sInitialGameOptions.fSciFi ? zSaveLoadText[Enum371.SLG_SCIFI] : zSaveLoadText[Enum371.SLG_REALISTIC]);

      // The date
      DrawTextToScreen(zMouseHelpTextString, (usPosX + SLG_DATE_OFFSET_X), (usPosY + SLG_DATE_OFFSET_Y), 0, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    } else {
      // Create the string for the Data
      zDateString = swprintf("%s %d, %02d:%02d", pMessageStrings[Enum333.MSG_DAY], SaveGameHeader.uiDay, SaveGameHeader.ubHour, SaveGameHeader.ubMin);

      // Create the string for the current location
      if (SaveGameHeader.sSectorX == -1 && SaveGameHeader.sSectorY == -1 || SaveGameHeader.bSectorZ < 0) {
        if ((SaveGameHeader.uiDay * NUM_SEC_IN_DAY + SaveGameHeader.ubHour * NUM_SEC_IN_HOUR + SaveGameHeader.ubMin * NUM_SEC_IN_MIN) <= STARTING_TIME)
          zLocationString = gpStrategicString[Enum365.STR_PB_NOTAPPLICABLE_ABBREVIATION];
        else
          zLocationString = gzLateLocalizedString[14];
      } else {
        gfGettingNameFromSaveLoadScreen = true;

        GetSectorIDString(SaveGameHeader.sSectorX, SaveGameHeader.sSectorY, SaveGameHeader.bSectorZ, zLocationString, false);

        gfGettingNameFromSaveLoadScreen = false;
      }

      //
      // Number of mercs on the team
      //

      // if only 1 merc is on the team
      if (SaveGameHeader.ubNumOfMercsOnPlayersTeam == 1) {
        // use "merc"
        zNumMercsString = swprintf("%d %s", SaveGameHeader.ubNumOfMercsOnPlayersTeam, MercAccountText[Enum340.MERC_ACCOUNT_MERC]);
      } else {
        // use "mercs"
        zNumMercsString = swprintf("%d %s", SaveGameHeader.ubNumOfMercsOnPlayersTeam, pMessageStrings[Enum333.MSG_MERCS]);
      }

      // Get the current balance
      zBalanceString = swprintf("%d", SaveGameHeader.iCurrentBalance);
      InsertCommasForDollarFigure(zBalanceString);
      InsertDollarSignInToString(zBalanceString);

      //
      // Display the Saved game information
      //

      // The date
      DrawTextToScreen(zDateString, (usPosX + SLG_DATE_OFFSET_X), (usPosY + SLG_DATE_OFFSET_Y), 0, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

      // if the sector string exceeds the width, and the ...
      ReduceStringLength(zLocationString, SLG_SECTOR_WIDTH, uiFont);

      // The Sector
      DrawTextToScreen(zLocationString, (usPosX + SLG_SECTOR_OFFSET_X), (usPosY + SLG_SECTOR_OFFSET_Y), 0, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

      // The Num of mercs
      DrawTextToScreen(zNumMercsString, (usPosX + SLG_NUM_MERCS_OFFSET_X), (usPosY + SLG_NUM_MERCS_OFFSET_Y), 0, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

      // The balance
      DrawTextToScreen(zBalanceString, (usPosX + SLG_BALANCE_OFFSET_X), (usPosY + SLG_BALANCE_OFFSET_Y), 0, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

      if (gbSaveGameArray[bEntryID] || (gfSaveGame && !gfUserInTextInputMode && (gbSelectedSaveLocation == bEntryID))) {
        // The Saved Game description
        DrawTextToScreen(SaveGameHeader.sSavedGameDesc, (usPosX + SLG_SAVE_GAME_DESC_X), (usPosY + SLG_SAVE_GAME_DESC_Y), 0, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
      }
    }
  } else {
    // if this is the quick save slot
    if (bEntryID == 0) {
      // display the empty spot
      DrawTextToScreen(pMessageStrings[Enum333.MSG_EMPTY_QUICK_SAVE_SLOT], usPosX, (usPosY + SLG_DATE_OFFSET_Y), 609, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
    } else {
      // display the empty spot
      DrawTextToScreen(pMessageStrings[Enum333.MSG_EMPTYSLOT], usPosX, (usPosY + SLG_DATE_OFFSET_Y), 609, uiFont, ubFontColor, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
    }
  }

  // REset the shadow color
  SetFontShadow(DEFAULT_SHADOW);

  usPosX = SLG_FIRST_SAVED_SPOT_X;
  usPosY = SLG_FIRST_SAVED_SPOT_Y + (SLG_GAP_BETWEEN_LOCATIONS * bEntryID);

  InvalidateRegion(usPosX, usPosY, usPosX + SLG_SAVELOCATION_WIDTH, usPosY + SLG_SAVELOCATION_HEIGHT);

  return true;
}

function LoadSavedGameHeader(bEntry: INT8, pSaveGameHeader: Pointer<SAVED_GAME_HEADER>): boolean {
  let hFile: HWFILE;
  let zSavedGameName: string /* CHAR8[512] */;
  let uiNumBytesRead: UINT32;

  // make sure the entry is valid
  if (bEntry < 0 || bEntry > NUM_SAVE_GAMES) {
    memset(addressof(pSaveGameHeader), 0, sizeof(SAVED_GAME_HEADER));
    return false;
  }

  // Get the name of the file
  CreateSavedGameFileNameFromNumber(bEntry, zSavedGameName);

  if (FileExists(zSavedGameName)) {
    // create the save game file
    hFile = FileOpen(zSavedGameName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
    if (!hFile) {
      FileClose(hFile);
      gbSaveGameArray[bEntry] = false;
      return false;
    }

    // Load the Save Game header file
    FileRead(hFile, pSaveGameHeader, sizeof(SAVED_GAME_HEADER), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(SAVED_GAME_HEADER)) {
      FileClose(hFile);
      gbSaveGameArray[bEntry] = false;
      return false;
    }

    FileClose(hFile);

    //
    // Do some Tests on the header to make sure it is valid
    //

    // Check to see if the desc field is bigger then it should be, ie no null char
    if (pSaveGameHeader.value.sSavedGameDesc.length >= SIZE_OF_SAVE_GAME_DESC) {
      memset(pSaveGameHeader, 0, sizeof(SAVED_GAME_HEADER));
      gbSaveGameArray[bEntry] = false;
      return false;
    }

    // Check to see if the version # field is bigger then it should be, ie no null char
    if (pSaveGameHeader.value.zGameVersionNumber.length >= GAME_VERSION_LENGTH) {
      memset(pSaveGameHeader, 0, sizeof(SAVED_GAME_HEADER));
      gbSaveGameArray[bEntry] = false;
      return false;
    }
  } else {
    memset(addressof(pSaveGameHeader), 0, sizeof(SAVED_GAME_HEADER));
  }

  return true;
}

function BtnSlgCancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // Exit back
    if (gfCameDirectlyFromGame)
      SetSaveLoadExitScreen(guiPreviousOptionScreen);

    else if (guiPreviousOptionScreen == Enum26.MAINMENU_SCREEN)
      SetSaveLoadExitScreen(Enum26.MAINMENU_SCREEN);

    else
      SetSaveLoadExitScreen(Enum26.OPTIONS_SCREEN);

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnSlgSaveLoadCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    SaveLoadGameNumber(gbSelectedSaveLocation);

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

/*
void BtnSlgLoadCallback(GUI_BUTTON *btn,INT32 reason)
{
        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                btn->uiFlags |= BUTTON_CLICKED_ON;
                InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
        }
        if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
        {
                btn->uiFlags &= (~BUTTON_CLICKED_ON );

                SaveLoadGameNumber( gbSelectedSaveLocation );

                InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
        }
        if(reason & MSYS_CALLBACK_REASON_LOST_MOUSE)
        {
                btn->uiFlags &= (~BUTTON_CLICKED_ON );
                InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
        }
}
*/

function SelectedSaveRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let bActiveTextField: INT8;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let bSelected: UINT8 = MSYS_GetRegionUserData(pRegion, 0);
    /* static */ let uiLastTime: UINT32 = 0;
    let uiCurTime: UINT32 = GetJA2Clock();
    let i: INT32;

    /*
                    //If we are saving and this is the quick save slot
                    if( gfSaveGame && bSelected == 0 )
                    {
                            //Display a pop up telling user what the quick save slot is
                            DoSaveLoadMessageBox( MSG_BOX_BASIC_STYLE, pMessageStrings[ MSG_QUICK_SAVE_RESERVED_FOR_TACTICAL ], SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, RedrawSaveLoadScreenAfterMessageBox );
                            return;
                    }

                    SetSelection( bSelected );
    */

    // If we are saving and this is the quick save slot
    if (gfSaveGame && bSelected == 0) {
      // Display a pop up telling user what the quick save slot is
      DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMessageStrings[Enum333.MSG_QUICK_SAVE_RESERVED_FOR_TACTICAL], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, RedrawSaveLoadScreenAfterMessageBox);
      return;
    }

    // Reset the regions
    for (i = 0; i < NUM_SAVE_GAMES; i++)
      gbSaveGameSelectedLocation[i] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;

    // if the user is selecting an unselected saved game slot
    if (gbSelectedSaveLocation != bSelected) {
      // Destroy the previous region
      DestroySaveLoadTextInputBoxes();

      gbSelectedSaveLocation = bSelected;

      // Reset the global string
      gzGameDescTextField[0] = '\0';

      // Init the text field for the game desc
      InitSaveLoadScreenTextInputBoxes();

      // If we are Loading the game
      //			if( !gfSaveGame )
      {
        // Enable the save/load button
        EnableButton(guiSlgSaveLoadBtn);
      }

      // If we are saving the game, disbale the button
      //			if( gfSaveGame )
      //					DisableButton( guiSlgSaveLoadBtn );
      //			else
      {
        // Set the time in which the button was first pressed
        uiLastTime = GetJA2Clock();
      }

      // Set the selected region to be highlighted
      gbSaveGameSelectedLocation[bSelected] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;

      gfRedrawSaveLoadScreen = true;

      uiLastTime = GetJA2Clock();
    }

    // the user is selecting the selected save game slot
    else {
      // if we are saving a game
      if (gfSaveGame) {
        // if the user is not currently editing the game desc
        if (!gfUserInTextInputMode) {
          //					SaveLoadGameNumber( gbSelectedSaveLocation );

          if ((uiCurTime - uiLastTime) < SLG_DOUBLE_CLICK_DELAY) {
            // Load the saved game
            SaveLoadGameNumber(gbSelectedSaveLocation);
          } else {
            uiLastTime = GetJA2Clock();
          }

          InitSaveLoadScreenTextInputBoxes();

          // Set the selected region to be highlighted
          gbSaveGameSelectedLocation[bSelected] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;

          gfRedrawSaveLoadScreen = true;
        } else {
          bActiveTextField = GetActiveFieldID();
          if (bActiveTextField && bActiveTextField != -1) {
            Get16BitStringFromField(bActiveTextField, gzGameDescTextField);
            SetActiveField(0);

            DestroySaveLoadTextInputBoxes();

            //						gfRedrawSaveLoadScreen = TRUE;

            //						EnableButton( guiSlgSaveLoadBtn );

            DisplaySaveGameEntry(gbLastHighLightedLocation);

            gfRedrawSaveLoadScreen = true;

            if ((uiCurTime - uiLastTime) < SLG_DOUBLE_CLICK_DELAY) {
              gubSaveGameNextPass = 1;
            } else {
              uiLastTime = GetJA2Clock();
            }
          }
        }
        // Set the selected region to be highlighted
        gbSaveGameSelectedLocation[bSelected] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;
      }
      // else we are loading
      else {
        if ((uiCurTime - uiLastTime) < SLG_DOUBLE_CLICK_DELAY) {
          // Load the saved game
          SaveLoadGameNumber(bSelected);
        } else {
          uiLastTime = GetJA2Clock();
        }
      }
    }
    // Set the selected region to be highlighted
    gbSaveGameSelectedLocation[bSelected] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    DisableSelectedSlot();
  }
}

function SelectedSaveRegionMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    let bTemp: INT8;
    pRegion.value.uiFlags &= (~BUTTON_CLICKED_ON);

    bTemp = gbHighLightedLocation;
    gbHighLightedLocation = -1;
    //		DisplaySaveGameList();
    DisplaySaveGameEntry(bTemp);

    InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    pRegion.value.uiFlags |= BUTTON_CLICKED_ON;

    // If we are saving and this is the quick save slot, leave
    if (gfSaveGame && MSYS_GetRegionUserData(pRegion, 0) != 0) {
      return;
    }

    gbLastHighLightedLocation = gbHighLightedLocation;
    gbHighLightedLocation = MSYS_GetRegionUserData(pRegion, 0);

    DisplaySaveGameEntry(gbLastHighLightedLocation);
    DisplaySaveGameEntry(gbHighLightedLocation); //, usPosY );

    InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
  }
}

function InitSaveLoadScreenTextInputBoxes(): void {
  let uiStartLoc: UINT32 = 0;
  let usPosY: UINT16;
  let SaveGameHeader: SAVED_GAME_HEADER = createSaveGameHeader();

  if (gbSelectedSaveLocation == -1)
    return;

  if (!gfSaveGame)
    return;

  // if we are exiting, dont create the fields
  if (gfSaveLoadScreenExit || guiSaveLoadExitScreen != Enum26.SAVE_LOAD_SCREEN)
    return;

  InitTextInputMode();

  SetTextInputCursor(Enum317.CUROSR_IBEAM_WHITE);
  SetTextInputFont(FONT12ARIALFIXEDWIDTH()); // FONT12ARIAL //FONT12ARIALFIXEDWIDTH
  Set16BPPTextFieldColor(Get16BPPColor(FROMRGB(0, 0, 0)));
  SetBevelColors(Get16BPPColor(FROMRGB(136, 138, 135)), Get16BPPColor(FROMRGB(24, 61, 81)));
  SetTextInputRegularColors(FONT_WHITE, 2);
  SetTextInputHilitedColors(2, FONT_WHITE, FONT_WHITE);
  SetCursorColor(Get16BPPColor(FROMRGB(255, 255, 255)));

  AddUserInputField(null);

  usPosY = SLG_FIRST_SAVED_SPOT_Y + SLG_GAP_BETWEEN_LOCATIONS * gbSelectedSaveLocation;

  // if there is already a string here, use its string
  if (gbSaveGameArray[gbSelectedSaveLocation]) {
    // if we are modifying a previously modifed string, use it
    if (gzGameDescTextField[0] != '\0') {
    } else {
      // Get the header for the specified saved game
      LoadSavedGameHeader(gbSelectedSaveLocation, addressof(SaveGameHeader));
      gzGameDescTextField = SaveGameHeader.sSavedGameDesc;
    }
  } else
    gzGameDescTextField[0] = '\0';

  // Game Desc Field
  AddTextInputField(SLG_FIRST_SAVED_SPOT_X + SLG_SAVE_GAME_DESC_X, (usPosY + SLG_SAVE_GAME_DESC_Y - 5), SLG_SAVELOCATION_WIDTH - SLG_SAVE_GAME_DESC_X - 7, 17, MSYS_PRIORITY_HIGH + 2, gzGameDescTextField, 46, INPUTTYPE_ASCII); // 23

  SetActiveField(1);

  gfUserInTextInputMode = true;
}

function DestroySaveLoadTextInputBoxes(): void {
  gfUserInTextInputMode = false;
  KillAllTextInputModes();
  SetTextInputCursor(Enum317.CURSOR_IBEAM);
}

function SetSelection(ubNewSelection: UINT8): void {
  //	CHAR16		zMouseHelpTextString[256];
  //	SAVED_GAME_HEADER SaveGameHeader;

  // if we are loading and there is no entry, return
  if (!gfSaveGame) {
    if (!gbSaveGameArray[ubNewSelection])
      return;
  }

  // Reset the selected slot background graphic
  if (gbSelectedSaveLocation != -1) {
    gbSaveGameSelectedLocation[gbSelectedSaveLocation] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;

    // reset the slots help text
    SetRegionFastHelpText(addressof(gSelectedSaveRegion[gbSelectedSaveLocation]), "\0");
  }

  gfRedrawSaveLoadScreen = true;
  DestroySaveLoadTextInputBoxes();

  // if we are loading,
  if (!gfSaveGame) {
    // Enable the save/load button
    EnableButton(guiSlgSaveLoadBtn);
  }

  // if we are to save
  if (gfSaveGame) {
    if (gbSelectedSaveLocation != ubNewSelection) {
      // Destroy the previous region
      DestroySaveLoadTextInputBoxes();

      // reset selected slot
      gbSelectedSaveLocation = ubNewSelection;

      // Null out the currently selected save game
      gzGameDescTextField[0] = '\0';

      // Init the text field for the game desc
      InitSaveLoadScreenTextInputBoxes();
    }

    // Enable the save/load button
    EnableButton(guiSlgSaveLoadBtn);
  }

  // reset selected slot
  gbSelectedSaveLocation = ubNewSelection;

  // Set the selected slot background graphic
  gbSaveGameSelectedLocation[gbSelectedSaveLocation] = SLG_SELECTED_SLOT_GRAPHICS_NUMBER;

  /*
          //if we are saving AND it is the currently selected slot
          if( gfSaveGame && gbSelectedSaveLocation == ubNewSelection )
          {
                  //copy over the initial game options
                  memcpy( &SaveGameHeader.sInitialGameOptions, &gGameOptions, sizeof( GAME_OPTIONS ) );
          }
          else
          {
                  //Get the header for the specified saved game
                  if( !LoadSavedGameHeader( ubNewSelection, &SaveGameHeader ) )
                  {
                          memset( &SaveGameHeader, 0, sizeof( SaveGameHeader ) );
                  }
          }

          swprintf( zMouseHelpTextString, L"%s: %s\n%s: %s\n%s: %s\n%s: %s", gzGIOScreenText[ GIO_DIF_LEVEL_TEXT ],
                  gzGIOScreenText[ GIO_DIF_LEVEL_TEXT + SaveGameHeader.sInitialGameOptions.ubDifficultyLevel + 1 ],

                  gzGIOScreenText[ GIO_TIMED_TURN_TITLE_TEXT ],
                  gzGIOScreenText[ GIO_TIMED_TURN_TITLE_TEXT + SaveGameHeader.sInitialGameOptions.fTurnTimeLimit + 1],

                  gzGIOScreenText[ GIO_GUN_OPTIONS_TEXT ],
                  gzGIOScreenText[ GIO_GUN_OPTIONS_TEXT + 2 - SaveGameHeader.sInitialGameOptions.fGunNut ],

                  gzGIOScreenText[ GIO_GAME_STYLE_TEXT ],
                  gzGIOScreenText[ GIO_GAME_STYLE_TEXT + SaveGameHeader.sInitialGameOptions.fSciFi + 1 ] );

          //set the slots help text
          SetRegionFastHelpText( &gSelectedSaveRegion[ gbSelectedSaveLocation ], zMouseHelpTextString );
          */
}

function CompareSaveGameVersion(bSaveGameID: INT8): UINT8 {
  let ubRetVal: UINT8 = Enum25.SLS_HEADER_OK;

  let SaveGameHeader: SAVED_GAME_HEADER = createSaveGameHeader();

  // Get the heade for the saved game
  LoadSavedGameHeader(bSaveGameID, addressof(SaveGameHeader));

  // check to see if the saved game version in the header is the same as the current version
  if (SaveGameHeader.uiSavedGameVersion != guiSavedGameVersion) {
    ubRetVal = Enum25.SLS_SAVED_GAME_VERSION_OUT_OF_DATE;
  }

  if (strcmp(SaveGameHeader.zGameVersionNumber, czVersionNumber) != 0) {
    if (ubRetVal == Enum25.SLS_SAVED_GAME_VERSION_OUT_OF_DATE)
      ubRetVal = Enum25.SLS_BOTH_SAVE_GAME_AND_GAME_VERSION_OUT_OF_DATE;
    else
      ubRetVal = Enum25.SLS_GAME_VERSION_OUT_OF_DATE;
  }

  return ubRetVal;
}

function LoadSavedGameWarningMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, load the game
  if (bExitValue == MSG_BOX_RETURN_YES) {
    // Setup up the fade routines
    StartFadeOutForSaveLoadScreen();
  }

  // The user does NOT want to continue..
  else {
    // ask if the user wants to delete all the saved game files
    DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_DELETE_ALL_SAVE_GAMES], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_YESNO, LoadSavedGameDeleteAllSaveGameMessageBoxCallBack);
  }
}

function LoadSavedGameDeleteAllSaveGameMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, Delete all the save game files
  if (bExitValue == MSG_BOX_RETURN_YES) {
    DeleteAllSaveGameFile();
    gfSaveLoadScreenExit = true;
  }

  gfExitAfterMessageBox = true;

  SetSaveLoadExitScreen(Enum26.OPTIONS_SCREEN);

  gbSelectedSaveLocation = -1;
}

function DeleteAllSaveGameFile(): void {
  let cnt: UINT8;

  for (cnt = 0; cnt < NUM_SAVE_GAMES; cnt++) {
    DeleteSaveGameNumber(cnt);
  }

  gGameSettings.bLastSavedGameSlot = -1;

  InitSaveGameArray();
}

export function DeleteSaveGameNumber(ubSaveGameSlotID: UINT8): void {
  let zSaveGameName: string /* CHAR8[512] */;

  // Create the name of the file
  CreateSavedGameFileNameFromNumber(ubSaveGameSlotID, zSaveGameName);

  // Delete the saved game file
  FileDelete(zSaveGameName);
}

function DisplayOnScreenNumber(fErase: boolean): void {
  let zTempString: string /* wchar_t[16] */;
  let usPosX: UINT16 = 6;
  let usPosY: UINT16;
  let bLoopNum: INT8;
  let bNum: INT8 = 0;

  usPosY = SLG_FIRST_SAVED_SPOT_Y;

  for (bLoopNum = 0; bLoopNum < NUM_SAVE_GAMES; bLoopNum++) {
    // Dont diplay it for the quicksave
    if (bLoopNum == 0) {
      usPosY += SLG_GAP_BETWEEN_LOCATIONS;
      continue;
    }

    BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, usPosX, (usPosY + SLG_DATE_OFFSET_Y), 10, 10);

    if (bLoopNum != 10) {
      bNum = bLoopNum;
      zTempString = swprintf("%2d", bNum);
    } else {
      bNum = 0;
      zTempString = swprintf("%2d", bNum);
    }

    if (!fErase)
      DrawTextToScreen(zTempString, usPosX, (usPosY + SLG_DATE_OFFSET_Y), 0, SAVE_LOAD_NUMBER_FONT(), SAVE_LOAD_NUMBER_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

    InvalidateRegion(usPosX, usPosY + SLG_DATE_OFFSET_Y, usPosX + 10, usPosY + SLG_DATE_OFFSET_Y + 10);

    usPosY += SLG_GAP_BETWEEN_LOCATIONS;
  }
}

function DoneFadeOutForSaveLoadScreen(): void {
  // Make sure we DONT reset the levels if we are loading a game
  gfHadToMakeBasementLevels = false;

  if (!LoadSavedGame(gbSelectedSaveLocation)) {
    if (guiBrokenSaveGameVersion < 95 && !gfSchedulesHosed) {
      // Hack problem with schedules getting misaligned.
      gfSchedulesHosed = true;
      if (!LoadSavedGame(gbSelectedSaveLocation)) {
        DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_LOAD_GAME_ERROR], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, FailedLoadingGameCallBack);
        NextLoopCheckForEnoughFreeHardDriveSpace();
      } else {
        gfSchedulesHosed = false;
        goto("SUCCESSFULLY_CORRECTED_SAVE");
      }
      gfSchedulesHosed = false;
    } else {
      DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_LOAD_GAME_ERROR], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, FailedLoadingGameCallBack);
      NextLoopCheckForEnoughFreeHardDriveSpace();
    }
  } else {
  SUCCESSFULLY_CORRECTED_SAVE:
      // If we are to go to map screen after loading the game
      if (guiScreenToGotoAfterLoadingSavedGame == Enum26.MAP_SCREEN) {
        gFadeInDoneCallback = DoneFadeInForSaveLoadScreen;

        SetSaveLoadExitScreen(guiScreenToGotoAfterLoadingSavedGame);

        //			LeaveTacticalScreen( MAP_SCREEN );

        FadeInNextFrame();
      }

      else {
        // if we are to go to the Tactical screen after loading
        gFadeInDoneCallback = DoneFadeInForSaveLoadScreen;

        SetSaveLoadExitScreen(guiScreenToGotoAfterLoadingSavedGame);

        PauseTime(false);

        //			EnterTacticalScreen( );
        FadeInGameScreen();
      }
  }
  gfStartedFadingOut = false;
}

function DoneFadeInForSaveLoadScreen(): void {
  // Leave the screen
  // if we are supposed to stay in tactical, due nothing,
  // if we are supposed to goto mapscreen, leave tactical and go to mapscreen

  if (guiScreenToGotoAfterLoadingSavedGame == Enum26.MAP_SCREEN) {
    if (!gfPauseDueToPlayerGamePause) {
      UnLockPauseState();
      UnPauseGame();
    }
  }

  else {
    // if the game is currently paused
    if (GamePaused()) {
      // need to call it twice
      HandlePlayerPauseUnPauseOfGame();
      HandlePlayerPauseUnPauseOfGame();
    }

    //		UnLockPauseState( );
    //		UnPauseGame( );
  }
}

function SelectedSLSEntireRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    DisableSelectedSlot();
  }
}

function DisableSelectedSlot(): void {
  // reset selected slot
  gbSelectedSaveLocation = -1;
  gfRedrawSaveLoadScreen = true;
  DestroySaveLoadTextInputBoxes();

  if (!gfSaveGame)
    DisableButton(guiSlgSaveLoadBtn);

  // reset the selected graphic
  ClearSelectedSaveSlot();
}

function ConfirmSavedGameMessageBoxCallBack(bExitValue: UINT8): void {
  Assert(gbSelectedSaveLocation != -1);

  // yes, load the game
  if (bExitValue == MSG_BOX_RETURN_YES) {
    SaveGameToSlotNum();
  }
}

function ConfirmLoadSavedGameMessageBoxCallBack(bExitValue: UINT8): void {
  Assert(gbSelectedSaveLocation != -1);

  // yes, load the game
  if (bExitValue == MSG_BOX_RETURN_YES) {
    // Setup up the fade routines
    StartFadeOutForSaveLoadScreen();
  } else {
    gfExitAfterMessageBox = false;
  }
}

function FailedLoadingGameCallBack(bExitValue: UINT8): void {
  // yes
  if (bExitValue == MSG_BOX_RETURN_OK) {
    // if the current screen is tactical
    if (guiPreviousOptionScreen == Enum26.MAP_SCREEN) {
      SetPendingNewScreen(Enum26.MAINMENU_SCREEN);
    } else {
      LeaveTacticalScreen(Enum26.MAINMENU_SCREEN);
    }

    SetSaveLoadExitScreen(Enum26.MAINMENU_SCREEN);

    // We want to reinitialize the game
    ReStartingGame();
  }
}

export function DoQuickSave(): boolean {
  gzGameDescTextField[0] = '\0';

  /*
          // Make sure the user has enough hard drive space
          if( !DoesUserHaveEnoughHardDriveSpace() )
          {
                  CHAR16	zText[512];
                  CHAR16	zSpaceOnDrive[512];
                  UINT32	uiSpaceOnDrive;
                  CHAR16	zSizeNeeded[512];

                  swprintf( zSizeNeeded, L"%d", REQUIRED_FREE_SPACE / BYTESINMEGABYTE );
                  InsertCommasForDollarFigure( zSizeNeeded );

                  uiSpaceOnDrive = GetFreeSpaceOnHardDriveWhereGameIsRunningFrom( );

                  swprintf( zSpaceOnDrive, L"%.2f", uiSpaceOnDrive / (FLOAT)BYTESINMEGABYTE );

                  swprintf( zText, pMessageStrings[ MSG_LOWDISKSPACE_WARNING ], zSpaceOnDrive, zSizeNeeded );

                  if( guiPreviousOptionScreen == MAP_SCREEN )
                          DoMapMessageBox( MSG_BOX_BASIC_STYLE, zText, MAP_SCREEN, MSG_BOX_FLAG_OK, NotEnoughHardDriveSpaceForQuickSaveMessageBoxCallBack );
                  else
                          DoMessageBox( MSG_BOX_BASIC_STYLE, zText, GAME_SCREEN, MSG_BOX_FLAG_OK, NotEnoughHardDriveSpaceForQuickSaveMessageBoxCallBack, NULL );

                  return( FALSE );
          }
  */

  if (!SaveGame(0, gzGameDescTextField)) {
    // Unset the fact that we are saving a game
    gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;

    if (guiPreviousOptionScreen == Enum26.MAP_SCREEN)
      DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_SAVE_GAME_ERROR], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, null);
    else
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_SAVE_GAME_ERROR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
  }

  return true;
}

export function DoQuickLoad(): boolean {
  // Build the save game array
  InitSaveGameArray();

  // if there is no save in the quick save slot
  if (!gbSaveGameArray[0])
    return false;

  // Set the selection to be the quick save slot
  gbSelectedSaveLocation = 0;

  // if the game is paused, and we are in tactical, unpause
  if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    PauseTime(false);
  }

  // Do a fade out before we load the game
  gFadeOutDoneCallback = DoneFadeOutForSaveLoadScreen;

  FadeOutNextFrame();
  gfStartedFadingOut = true;
  gfDoingQuickLoad = true;

  return true;
}

export function IsThereAnySavedGameFiles(): boolean {
  let cnt: INT8;
  let zSaveGameName: string /* CHAR8[512] */;

  for (cnt = 0; cnt < NUM_SAVE_GAMES; cnt++) {
    CreateSavedGameFileNameFromNumber(cnt, zSaveGameName);

    if (FileExists(zSaveGameName))
      return true;
  }

  return false;
}

function NotEnoughHardDriveSpaceForQuickSaveMessageBoxCallBack(bExitValue: UINT8): void {
  if (!SaveGame(0, gzGameDescTextField)) {
    // Unset the fact that we are saving a game
    gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;

    // Set a flag indicating that the save failed ( cant initiate a message box from within a mb callback )
    gfFailedToSaveGameWhenInsideAMessageBox = true;
  }
}

function NotEnoughHardDriveSpaceForNormalSaveMessageBoxCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_OK) {
    // If the game failed to save
    if (!SaveGame(gbSelectedSaveLocation, gzGameDescTextField)) {
      // Unset the fact that we are saving a game
      gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;

      // Set a flag indicating that the save failed ( cant initiate a message box from within a mb callback )
      gfFailedToSaveGameWhenInsideAMessageBox = true;
    } else {
      SetSaveLoadExitScreen(guiPreviousOptionScreen);
    }
  }
}

function RedrawSaveLoadScreenAfterMessageBox(bExitValue: UINT8): void {
  gfRedrawSaveLoadScreen = true;
}

function MoveSelectionUpOrDown(fUp: boolean): void {
  let i: INT32;

  // if we are saving, any slot otgher then the quick save slot is valid
  if (gfSaveGame) {
    if (fUp) {
      // if there is no selected slot, get out
      if (gbSelectedSaveLocation == -1)
        return;

      // if the selected slot is above the first slot
      if (gbSelectedSaveLocation > 1) {
        SetSelection((gbSelectedSaveLocation - 1));
      }
    } else {
      // if the selected slot is invalid
      if (gbSelectedSaveLocation == -1) {
        SetSelection(1);
      } else {
        if (gbSelectedSaveLocation >= 1 && gbSelectedSaveLocation < NUM_SAVE_GAMES - 1) {
          SetSelection((gbSelectedSaveLocation + 1));
        }
      }
    }
  }

  else {
    if (fUp) {
      for (i = gbSelectedSaveLocation - 1; i >= 0; i--) {
        if (gbSaveGameArray[i]) {
          ClearSelectedSaveSlot();

          SetSelection(i);
          break;
        }
      }
    } else {
      // if there is no selected slot, move the selected slot to the first slot
      if (gbSelectedSaveLocation == -1) {
        ClearSelectedSaveSlot();

        SetSelection(0);
      } else {
        for (i = gbSelectedSaveLocation + 1; i < NUM_SAVE_GAMES; i++) {
          if (gbSaveGameArray[i]) {
            ClearSelectedSaveSlot();

            SetSelection(i);
            break;
          }
        }
      }
    }
  }
}

function ClearSelectedSaveSlot(): void {
  let i: INT32;
  for (i = 0; i < NUM_SAVE_GAMES; i++)
    gbSaveGameSelectedLocation[i] = SLG_UNSELECTED_SLOT_GRAPHICS_NUMBER;

  gbSelectedSaveLocation = -1;
}

function SaveGameToSlotNum(): void {
  /*
          // Make sure the user has enough hard drive space
          if( !DoesUserHaveEnoughHardDriveSpace() )
          {
                  CHAR16	zText[512];
                  CHAR16	zSizeNeeded[512];
                  CHAR16	zSpaceOnDrive[512];
                  UINT32	uiSpaceOnDrive;

                  swprintf( zSizeNeeded, L"%d", REQUIRED_FREE_SPACE / BYTESINMEGABYTE );
                  InsertCommasForDollarFigure( zSizeNeeded );

                  uiSpaceOnDrive = GetFreeSpaceOnHardDriveWhereGameIsRunningFrom( );

                  swprintf( zSpaceOnDrive, L"%.2f", uiSpaceOnDrive / (FLOAT)BYTESINMEGABYTE );

                  swprintf( zText, pMessageStrings[ MSG_LOWDISKSPACE_WARNING ], zSpaceOnDrive, zSizeNeeded );

                  DoSaveLoadMessageBox( MSG_BOX_BASIC_STYLE, zText, SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, NotEnoughHardDriveSpaceForNormalSaveMessageBoxCallBack );

                  return;
          }
  */

  // Redraw the save load screen
  RenderSaveLoadScreen();

  // render the buttons
  MarkButtonsDirty();
  RenderButtons();

  if (!SaveGame(gbSelectedSaveLocation, gzGameDescTextField)) {
    // Unset the fact that we are saving a game
    gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;

    DoSaveLoadMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zSaveLoadText[Enum371.SLG_SAVE_GAME_ERROR], Enum26.SAVE_LOAD_SCREEN, MSG_BOX_FLAG_OK, null);
  }

  //			gfExitAfterMessageBox = TRUE;

  SetSaveLoadExitScreen(guiPreviousOptionScreen);
}

function StartFadeOutForSaveLoadScreen(): void {
  // if the game is paused, and we are in tactical, unpause
  if (guiPreviousOptionScreen == Enum26.GAME_SCREEN) {
    PauseTime(false);
  }

  gFadeOutDoneCallback = DoneFadeOutForSaveLoadScreen;

  FadeOutNextFrame();
  gfStartedFadingOut = true;
  gfExitAfterMessageBox = true;
}

}
