namespace ja2 {

const MAP_BOTTOM_X = 0;
const MAP_BOTTOM_Y = 359;

const MESSAGE_SCROLL_AREA_START_X = 330;
const MESSAGE_SCROLL_AREA_END_X = 344;
const MESSAGE_SCROLL_AREA_WIDTH = (MESSAGE_SCROLL_AREA_END_X - MESSAGE_SCROLL_AREA_START_X + 1);

const MESSAGE_SCROLL_AREA_START_Y = 390;
const MESSAGE_SCROLL_AREA_END_Y = 448;
const MESSAGE_SCROLL_AREA_HEIGHT = (MESSAGE_SCROLL_AREA_END_Y - MESSAGE_SCROLL_AREA_START_Y + 1);

const SLIDER_HEIGHT = 11;
const SLIDER_WIDTH = 11;

const SLIDER_BAR_RANGE = (MESSAGE_SCROLL_AREA_HEIGHT - SLIDER_HEIGHT);

const MESSAGE_BTN_SCROLL_TIME = 100;

// delay for paused flash
const PAUSE_GAME_TIMER = 500;

const MAP_BOTTOM_FONT_COLOR = (32 * 4 - 9);

/*
// delay to start auto message scroll
#define DELAY_TO_START_MESSAGE_SCROLL 3000
// delay per auto message scroll
#define DELAY_PER_MESSAGE_SCROLL 300
*/

// button enums
const enum Enum142 {
  MAP_SCROLL_MESSAGE_UP = 0,
  MAP_SCROLL_MESSAGE_DOWN,
}

const enum Enum143 {
  MAP_TIME_COMPRESS_MORE = 0,
  MAP_TIME_COMPRESS_LESS,
}

// GLOBALS

// the dirty state of the mapscreen interface bottom
export let fMapScreenBottomDirty: boolean = true;

let fMapBottomDirtied: boolean = false;

// Used to flag the transition animation from mapscreen to laptop.
export let gfStartMapScreenToLaptopTransition: boolean = false;

// leaving map screen
export let fLeavingMapScreen: boolean = false;

// don't start transition from laptop to tactical stuff
export let gfDontStartTransitionFromLaptop: boolean = false;

// exiting to laptop?
export let fLapTop: boolean = false;

let gfOneFramePauseOnExit: boolean = false;

// we've just scrolled to a new message (for autoscrolling only)
// BOOLEAN gfNewScrollMessage = FALSE;

// exit states
let gbExitingMapScreenToWhere: INT8 = -1;

let gubFirstMapscreenMessageIndex: UINT8 = 0;

export let guiCompressionStringBaseTime: UINT32 = 0;

// graphics
let guiMAPBOTTOMPANEL: UINT32;
let guiSliderBar: UINT32;

// buttons
let guiMapMessageScrollButtons: UINT32[] /* [2] */;
export let guiMapBottomExitButtons: UINT32[] /* [3] */;
let guiMapBottomTimeButtons: UINT32[] /* [2] */;

// buttons images
let guiMapMessageScrollButtonsImage: UINT32[] /* [2] */;
let guiMapBottomExitButtonsImage: UINT32[] /* [3] */;
let guiMapBottomTimeButtonsImage: UINT32[] /* [2] */;

// mouse regions
let gMapMessageScrollBarRegion: MOUSE_REGION = createMouseRegion();
let gMapPauseRegion: MOUSE_REGION = createMouseRegion();

let gTimeCompressionMask: MOUSE_REGION[] /* [3] */ = createArrayFrom(3, createMouseRegion);

// EXTERNS

// PROTOTYPES

// void CheckForAndHandleAutoMessageScroll( void );

// FUNCTIONS

export function HandleLoadOfMapBottomGraphics(): void {
  // will load the graphics needed for the mapscreen interface bottom
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // will create buttons for interface bottom
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\map_screen_bottom.sti");
  if (!(guiMAPBOTTOMPANEL = AddVideoObject(VObjectDesc)))
    return;

  // load slider bar icon
  LoadMessageSliderBar();

  return;
}

export function LoadMapScreenInterfaceBottom(): boolean {
  CreateButtonsForMapScreenInterfaceBottom();
  CreateMapScreenBottomMessageScrollBarRegion();

  // create pause region
  CreateCompressModePause();

  return true;
}

export function DeleteMapBottomGraphics(): void {
  DeleteVideoObjectFromIndex(guiMAPBOTTOMPANEL);

  // delete slider bar icon
  DeleteMessageSliderBar();

  return;
}

export function DeleteMapScreenInterfaceBottom(): void {
  // will delete graphics loaded for the mapscreen interface bottom

  DestroyButtonsForMapScreenInterfaceBottom();
  DeleteMapScreenBottomMessageScrollRegion();

  // remove comrpess mode pause
  RemoveCompressModePause();

  return;
}

export function RenderMapScreenInterfaceBottom(): void {
  // will render the map screen bottom interface
  let hHandle: HVOBJECT;
  let bFilename: string /* CHAR8[32] */;

  // render whole panel
  if (fMapScreenBottomDirty == true) {
    // get and blt panel
    hHandle = GetVideoObject(guiMAPBOTTOMPANEL);
    BltVideoObject(guiSAVEBUFFER, hHandle, 0, MAP_BOTTOM_X, MAP_BOTTOM_Y, VO_BLT_SRCTRANSPARENCY, null);

    if (GetSectorFlagStatus(sSelMapX, sSelMapY, iCurrentMapSectorZ, SF_ALREADY_VISITED) == true) {
      GetMapFileName(sSelMapX, sSelMapY, iCurrentMapSectorZ, bFilename, true, true);
      LoadRadarScreenBitmap(bFilename);
    } else {
      ClearOutRadarMapImage();
    }

    fInterfacePanelDirty = DIRTYLEVEL2;

    // display title
    DisplayCurrentBalanceTitleForMapBottom();

    // dirty buttons
    MarkButtonsDirty();

    // invalidate region
    RestoreExternBackgroundRect(MAP_BOTTOM_X, MAP_BOTTOM_Y, 640 - MAP_BOTTOM_X, 480 - MAP_BOTTOM_Y);

    // re render radar map
    RenderRadarScreen();

    // reset dirty flag
    fMapScreenBottomDirty = false;
    fMapBottomDirtied = true;
  }

  DisplayCompressMode();

  DisplayCurrentBalanceForMapBottom();
  DisplayProjectedDailyMineIncome();

  // draw the name of the loaded sector
  DrawNameOfLoadedSector();

  // display slider on the scroll bar
  DisplayScrollBarSlider();

  // display messages that can be scrolled through
  DisplayStringsInMapScreenMessageList();

  // handle auto scroll
  // CheckForAndHandleAutoMessageScroll( );

  EnableDisableMessageScrollButtonsAndRegions();

  EnableDisableBottomButtonsAndRegions();

  fMapBottomDirtied = false;
  return;
}

function CreateButtonsForMapScreenInterfaceBottom(): boolean {
  // laptop
  guiMapBottomExitButtonsImage[Enum144.MAP_EXIT_TO_LAPTOP] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 6, -1, 15, -1);
  guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_LAPTOP] = QuickCreateButton(guiMapBottomExitButtonsImage[Enum144.MAP_EXIT_TO_LAPTOP], 456, 410, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnLaptopCallback);

  // tactical
  guiMapBottomExitButtonsImage[Enum144.MAP_EXIT_TO_TACTICAL] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 7, -1, 16, -1);

  guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_TACTICAL] = QuickCreateButton(guiMapBottomExitButtonsImage[Enum144.MAP_EXIT_TO_TACTICAL], 496, 410, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnTacticalCallback);

  // options
  guiMapBottomExitButtonsImage[Enum144.MAP_EXIT_TO_OPTIONS] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 18, -1, 19, -1);
  guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_OPTIONS] = QuickCreateButton(guiMapBottomExitButtonsImage[Enum144.MAP_EXIT_TO_OPTIONS], 458, 372, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnOptionsFromMapScreenCallback);

  SetButtonFastHelpText(guiMapBottomExitButtons[0], pMapScreenBottomFastHelp[0]);
  SetButtonFastHelpText(guiMapBottomExitButtons[1], pMapScreenBottomFastHelp[1]);
  SetButtonFastHelpText(guiMapBottomExitButtons[2], pMapScreenBottomFastHelp[2]);

  SetButtonCursor(guiMapBottomExitButtons[0], MSYS_NO_CURSOR);
  SetButtonCursor(guiMapBottomExitButtons[1], MSYS_NO_CURSOR);
  SetButtonCursor(guiMapBottomExitButtons[2], MSYS_NO_CURSOR);

  // time compression buttons
  guiMapBottomTimeButtonsImage[Enum143.MAP_TIME_COMPRESS_MORE] = LoadButtonImage("INTERFACE\\map_screen_bottom_arrows.sti", 10, 1, -1, 3, -1);
  guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_MORE] = QuickCreateButton(guiMapBottomTimeButtonsImage[Enum143.MAP_TIME_COMPRESS_MORE], 528, 456, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, BtnGenericMouseMoveButtonCallback, BtnTimeCompressMoreMapScreenCallback);

  guiMapBottomTimeButtonsImage[Enum143.MAP_TIME_COMPRESS_LESS] = LoadButtonImage("INTERFACE\\map_screen_bottom_arrows.sti", 9, 0, -1, 2, -1);
  guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_LESS] = QuickCreateButton(guiMapBottomTimeButtonsImage[Enum143.MAP_TIME_COMPRESS_LESS], 466, 456, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, BtnGenericMouseMoveButtonCallback, BtnTimeCompressLessMapScreenCallback);

  SetButtonFastHelpText(guiMapBottomTimeButtons[0], pMapScreenBottomFastHelp[3]);
  SetButtonFastHelpText(guiMapBottomTimeButtons[1], pMapScreenBottomFastHelp[4]);

  SetButtonCursor(guiMapBottomTimeButtons[0], MSYS_NO_CURSOR);
  SetButtonCursor(guiMapBottomTimeButtons[1], MSYS_NO_CURSOR);

  // scroll buttons

  guiMapMessageScrollButtonsImage[Enum142.MAP_SCROLL_MESSAGE_UP] = LoadButtonImage("INTERFACE\\map_screen_bottom_arrows.sti", 11, 4, -1, 6, -1);
  guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_UP] = QuickCreateButton(guiMapMessageScrollButtonsImage[Enum142.MAP_SCROLL_MESSAGE_UP], 331, 371, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnMessageUpMapScreenCallback);

  guiMapMessageScrollButtonsImage[Enum142.MAP_SCROLL_MESSAGE_DOWN] = LoadButtonImage("INTERFACE\\map_screen_bottom_arrows.sti", 12, 5, -1, 7, -1);
  guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_DOWN] = QuickCreateButton(guiMapMessageScrollButtonsImage[Enum142.MAP_SCROLL_MESSAGE_DOWN], 331, 452, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnMessageDownMapScreenCallback);

  SetButtonFastHelpText(guiMapMessageScrollButtons[0], pMapScreenBottomFastHelp[5]);
  SetButtonFastHelpText(guiMapMessageScrollButtons[1], pMapScreenBottomFastHelp[6]);
  SetButtonCursor(guiMapMessageScrollButtons[0], MSYS_NO_CURSOR);
  SetButtonCursor(guiMapMessageScrollButtons[1], MSYS_NO_CURSOR);

  return true;
}

function DestroyButtonsForMapScreenInterfaceBottom(): void {
  // will destroy the buttons for the mapscreen bottom interface

  RemoveButton(guiMapBottomExitButtons[0]);
  RemoveButton(guiMapBottomExitButtons[1]);
  RemoveButton(guiMapBottomExitButtons[2]);
  RemoveButton(guiMapMessageScrollButtons[0]);
  RemoveButton(guiMapMessageScrollButtons[1]);
  RemoveButton(guiMapBottomTimeButtons[0]);
  RemoveButton(guiMapBottomTimeButtons[1]);

  UnloadButtonImage(guiMapBottomExitButtonsImage[0]);
  UnloadButtonImage(guiMapBottomExitButtonsImage[1]);
  UnloadButtonImage(guiMapBottomExitButtonsImage[2]);
  UnloadButtonImage(guiMapMessageScrollButtonsImage[0]);
  UnloadButtonImage(guiMapMessageScrollButtonsImage[1]);
  UnloadButtonImage(guiMapBottomTimeButtonsImage[0]);
  UnloadButtonImage(guiMapBottomTimeButtonsImage[1]);

  // reset dirty flag
  fMapScreenBottomDirty = true;

  return;
}

function BtnLaptopCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }

    // redraw region
    if (btn.Area.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }

    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON | BUTTON_DIRTY);
      DrawButton(btn.IDNum);

      RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_LAPTOP);
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
    }
  }
}

function BtnTacticalCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    // redraw region
    if (btn.Area.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_TACTICAL);
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }
  }
}

function BtnOptionsFromMapScreenCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    // redraw region
    if (btn.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      fMapScreenBottomDirty = true;

      RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_OPTIONS);
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }
  }
}

function DrawNameOfLoadedSector(): void {
  let sString: string /* CHAR16[128] */;
  let sFontX: INT16;
  let sFontY: INT16;

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  SetFont(COMPFONT());
  SetFontForeground(183);
  SetFontBackground(FONT_BLACK);

  sString = GetSectorIDString(sSelMapX, sSelMapY, (iCurrentMapSectorZ), true);
  ReduceStringLength(sString, 80, COMPFONT());

  ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(548, 426, 80, 16, COMPFONT(), sString));
  mprintf(sFontX, sFontY, "%s", sString);
}

function CompressModeClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & (MSYS_CALLBACK_REASON_RBUTTON_UP | MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if (CommonTimeCompressionChecks() == true)
      return;

    RequestToggleTimeCompression();
  }
}

function BtnTimeCompressMoreMapScreenCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (CommonTimeCompressionChecks() == true)
      return;

    // redraw region
    if (btn.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      fMapScreenBottomDirty = true;

      RequestIncreaseInTimeCompression();
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (CommonTimeCompressionChecks() == true)
      return;
  }
}

function BtnTimeCompressLessMapScreenCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (CommonTimeCompressionChecks() == true)
      return;

    // redraw region
    if (btn.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      fMapScreenBottomDirty = true;

      RequestDecreaseInTimeCompression();
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (CommonTimeCompressionChecks() == true)
      return;
  }
}

function BtnMessageDownMapScreenCallback(btn: GUI_BUTTON, reason: INT32): void {
  /* static */ let iLastRepeatScrollTime: INT32 = 0;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    // redraw region
    if (btn.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);

    iLastRepeatScrollTime = 0;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // redraw region
      if (btn.uiFlags & MSYS_HAS_BACKRECT) {
        fMapScreenBottomDirty = true;
      }

      // down a line
      MapScreenMsgScrollDown(1);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    if (GetJA2Clock() - iLastRepeatScrollTime >= MESSAGE_BTN_SCROLL_TIME) {
      // down a line
      MapScreenMsgScrollDown(1);

      iLastRepeatScrollTime = GetJA2Clock();
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    // redraw region
    if (btn.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);

    iLastRepeatScrollTime = 0;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // redraw region
      if (btn.uiFlags & MSYS_HAS_BACKRECT) {
        fMapScreenBottomDirty = true;
      }

      // down a page
      MapScreenMsgScrollDown(MAX_MESSAGES_ON_MAP_BOTTOM);
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_REPEAT) {
    if (GetJA2Clock() - iLastRepeatScrollTime >= MESSAGE_BTN_SCROLL_TIME) {
      // down a page
      MapScreenMsgScrollDown(MAX_MESSAGES_ON_MAP_BOTTOM);

      iLastRepeatScrollTime = GetJA2Clock();
    }
  }
}

function BtnMessageUpMapScreenCallback(btn: GUI_BUTTON, reason: INT32): void {
  /* static */ let iLastRepeatScrollTime: INT32 = 0;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);

    // redraw region
    if (btn.Area.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    iLastRepeatScrollTime = 0;
  }

  else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // redraw region
      if (btn.uiFlags & MSYS_HAS_BACKRECT) {
        fMapScreenBottomDirty = true;
      }

      // up a line
      MapScreenMsgScrollUp(1);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    if (GetJA2Clock() - iLastRepeatScrollTime >= MESSAGE_BTN_SCROLL_TIME) {
      // up a line
      MapScreenMsgScrollUp(1);

      iLastRepeatScrollTime = GetJA2Clock();
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (IsMapScreenHelpTextUp()) {
      // stop mapscreen text
      StopMapScreenHelpText();
      return;
    }

    // redraw region
    if (btn.uiFlags & MSYS_HAS_BACKRECT) {
      fMapScreenBottomDirty = true;
    }

    btn.uiFlags |= (BUTTON_CLICKED_ON);

    iLastRepeatScrollTime = 0;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // redraw region
      if (btn.uiFlags & MSYS_HAS_BACKRECT) {
        fMapScreenBottomDirty = true;
      }

      // up a page
      MapScreenMsgScrollUp(MAX_MESSAGES_ON_MAP_BOTTOM);
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_REPEAT) {
    if (GetJA2Clock() - iLastRepeatScrollTime >= MESSAGE_BTN_SCROLL_TIME) {
      // up a page
      MapScreenMsgScrollUp(MAX_MESSAGES_ON_MAP_BOTTOM);

      iLastRepeatScrollTime = GetJA2Clock();
    }
  }
}

function EnableDisableMessageScrollButtonsAndRegions(): void {
  let ubNumMessages: UINT8;

  ubNumMessages = GetRangeOfMapScreenMessages();

  // if no scrolling required, or already showing the topmost message
  if ((ubNumMessages <= MAX_MESSAGES_ON_MAP_BOTTOM) || (gubFirstMapscreenMessageIndex == 0)) {
    DisableButton(guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_UP]);
    ButtonList[guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_UP]].uiFlags &= ~(BUTTON_CLICKED_ON);
  } else {
    EnableButton(guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_UP]);
  }

  // if no scrolling required, or already showing the last message
  if ((ubNumMessages <= MAX_MESSAGES_ON_MAP_BOTTOM) || ((gubFirstMapscreenMessageIndex + MAX_MESSAGES_ON_MAP_BOTTOM) >= ubNumMessages)) {
    DisableButton(guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_DOWN]);
    ButtonList[guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_DOWN]].uiFlags &= ~(BUTTON_CLICKED_ON);
  } else {
    EnableButton(guiMapMessageScrollButtons[Enum142.MAP_SCROLL_MESSAGE_DOWN]);
  }

  if (ubNumMessages <= MAX_MESSAGES_ON_MAP_BOTTOM) {
    MSYS_DisableRegion(gMapMessageScrollBarRegion);
  } else {
    MSYS_EnableRegion(gMapMessageScrollBarRegion);
  }
}

function DisplayCompressMode(): void {
  let sX: INT16;
  let sY: INT16;
  let sString: string /* CHAR16[128] */;
  /* static */ let usColor: UINT8 = FONT_LTGREEN;

  // get compress speed
  if (giTimeCompressMode != Enum130.NOT_USING_TIME_COMPRESSION) {
    if (IsTimeBeingCompressed()) {
      sString = swprintf("%s", sTimeStrings[giTimeCompressMode]);
    } else {
      sString = swprintf("%s", sTimeStrings[0]);
    }
  }

  RestoreExternBackgroundRect(489, 456, 522 - 489, 467 - 454);
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
  SetFont(COMPFONT());

  if (GetJA2Clock() - guiCompressionStringBaseTime >= PAUSE_GAME_TIMER) {
    if (usColor == FONT_LTGREEN) {
      usColor = FONT_WHITE;
    } else {
      usColor = FONT_LTGREEN;
    }

    guiCompressionStringBaseTime = GetJA2Clock();
  }

  if ((giTimeCompressMode != 0) && (GamePaused() == false)) {
    usColor = FONT_LTGREEN;
  }

  SetFontForeground(usColor);
  SetFontBackground(FONT_BLACK);
  ({ sX, sY } = FindFontCenterCoordinates(489, 456, 522 - 489, 467 - 454, sString, COMPFONT()));
  mprintf(sX, sY, sString);

  return;
}

function CreateCompressModePause(): void {
  MSYS_DefineRegion(gMapPauseRegion, 487, 456, 522, 467, MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, CompressModeClickCallback);

  SetRegionFastHelpText(gMapPauseRegion, pMapScreenBottomFastHelp[7]);
}

function RemoveCompressModePause(): void {
  MSYS_RemoveRegion(gMapPauseRegion);
}

function LoadMessageSliderBar(): void {
  // this function will load the message slider bar
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\map_screen_bottom_arrows.sti");
  if (!(guiSliderBar = AddVideoObject(VObjectDesc)))
    return;
}

function DeleteMessageSliderBar(): void {
  // this function will delete message slider bar
  DeleteVideoObjectFromIndex(guiSliderBar);
}

function CreateMapScreenBottomMessageScrollBarRegion(): void {
  MSYS_DefineRegion(gMapMessageScrollBarRegion, MESSAGE_SCROLL_AREA_START_X, MESSAGE_SCROLL_AREA_START_Y, MESSAGE_SCROLL_AREA_END_X, MESSAGE_SCROLL_AREA_END_Y, MSYS_PRIORITY_NORMAL, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, MapScreenMessageScrollBarCallBack);
}

function DeleteMapScreenBottomMessageScrollRegion(): void {
  MSYS_RemoveRegion(gMapMessageScrollBarRegion);
}

function MapScreenMessageScrollBarCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  let MousePos: POINT = createPoint();
  let ubMouseYOffset: UINT8;
  let ubDesiredSliderOffset: UINT8;
  let ubDesiredMessageIndex: UINT8;
  let ubNumMessages: UINT8;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  if (iReason & (MSYS_CALLBACK_REASON_LBUTTON_DWN | MSYS_CALLBACK_REASON_LBUTTON_REPEAT)) {
    // how many messages are there?
    ubNumMessages = GetRangeOfMapScreenMessages();

    // region is supposed to be disabled if there aren't enough messages to scroll.  Formulas assume this
    if (ubNumMessages > MAX_MESSAGES_ON_MAP_BOTTOM) {
      // where is the mouse?
      GetCursorPos(MousePos);

      ubMouseYOffset = MousePos.y - MESSAGE_SCROLL_AREA_START_Y;

      // if clicking in the top 5 pixels of the slider bar
      if (ubMouseYOffset < (SLIDER_HEIGHT / 2)) {
        // scroll all the way to the top
        ubDesiredMessageIndex = 0;
      }
      // if clicking in the bottom 6 pixels of the slider bar
      else if (ubMouseYOffset >= (MESSAGE_SCROLL_AREA_HEIGHT - (SLIDER_HEIGHT / 2))) {
        // scroll all the way to the bottom
        ubDesiredMessageIndex = ubNumMessages - MAX_MESSAGES_ON_MAP_BOTTOM;
      } else {
        // somewhere in between
        ubDesiredSliderOffset = ubMouseYOffset - (SLIDER_HEIGHT / 2);

        Assert(ubDesiredSliderOffset <= SLIDER_BAR_RANGE);

        // calculate what the index should be to place the slider at this offset (round fractions of .5+ up)
        ubDesiredMessageIndex = ((ubDesiredSliderOffset * (ubNumMessages - MAX_MESSAGES_ON_MAP_BOTTOM)) + (SLIDER_BAR_RANGE / 2)) / SLIDER_BAR_RANGE;
      }

      // if it's a change
      if (ubDesiredMessageIndex != gubFirstMapscreenMessageIndex) {
        ChangeCurrentMapscreenMessageIndex(ubDesiredMessageIndex);
      }
    }
  }
}

function DisplayScrollBarSlider(): void {
  // will display the scroll bar icon
  let ubNumMessages: UINT8;
  let ubSliderOffset: UINT8;
  let hHandle: HVOBJECT;

  ubNumMessages = GetRangeOfMapScreenMessages();

  // only show the slider if there are more messages than will fit on screen
  if (ubNumMessages > MAX_MESSAGES_ON_MAP_BOTTOM) {
    // calculate where slider should be positioned
    ubSliderOffset = (SLIDER_BAR_RANGE * gubFirstMapscreenMessageIndex) / (ubNumMessages - MAX_MESSAGES_ON_MAP_BOTTOM);

    hHandle = GetVideoObject(guiSliderBar);
    BltVideoObject(FRAME_BUFFER, hHandle, 8, MESSAGE_SCROLL_AREA_START_X + 2, MESSAGE_SCROLL_AREA_START_Y + ubSliderOffset, VO_BLT_SRCTRANSPARENCY, null);
  }
}

/*
void CheckForAndHandleAutoMessageScroll( void )
{
        // will check if we are not at the most recent message, if not, scroll to it
        static INT32 iBaseScrollTime =0;
        static INT32 iBaseScrollDelay =0;
        static BOOLEAN fScrollMessage = FALSE;

        // check if we are at the last message, if so, leave
        if( IsThisTheLastMessageInTheList( ) )
        {
                // leave
                // reset flag
                fScrollMessage = FALSE;
                return;
        }

        // we are not, check how long we have been here?
        if( gfNewScrollMessage == TRUE )
        {
                // we just scrolled to a new message, reset timer
                iBaseScrollTime = GetJA2Clock( );

                // reset flag
                gfNewScrollMessage = FALSE;
                fScrollMessage = FALSE;
        }

        // check timer

        if( GetJA2Clock( ) - iBaseScrollTime > DELAY_TO_START_MESSAGE_SCROLL )
        {

                if( fScrollMessage == FALSE )
                {
                  // set up scroll delay
                 iBaseScrollDelay = GetJA2Clock( );

                 // start scroll
                fScrollMessage = TRUE;

                }

                iBaseScrollTime = GetJA2Clock( );
        }

        if( fScrollMessage == TRUE )
        {
                if( GetJA2Clock( ) - iBaseScrollDelay > DELAY_PER_MESSAGE_SCROLL )
                {
                        // scroll to next message
                        MoveCurrentMessagePointerDownList( );

                        // dirty region
                        fMapScreenBottomDirty = TRUE;

                        // reset delay timer
                        iBaseScrollDelay = GetJA2Clock( );
                }
        }


        return;
}
*/

function EnableDisableBottomButtonsAndRegions(): void {
  let iExitButtonIndex: INT8;

  // this enables and disables the buttons MAP_EXIT_TO_LAPTOP, MAP_EXIT_TO_TACTICAL, and MAP_EXIT_TO_OPTIONS
  for (iExitButtonIndex = 0; iExitButtonIndex < 3; iExitButtonIndex++) {
    if (AllowedToExitFromMapscreenTo(iExitButtonIndex)) {
      EnableButton(guiMapBottomExitButtons[iExitButtonIndex]);
    } else {
      DisableButton(guiMapBottomExitButtons[iExitButtonIndex]);
    }
  }

  // enable/disable time compress buttons and region masks
  EnableDisableTimeCompressButtons();
  CreateDestroyMouseRegionMasksForTimeCompressionButtons();

  // Enable/Disable map inventory panel buttons

  // if in merc inventory panel
  if (fShowInventoryFlag) {
    // and an item is in the cursor
    if ((gMPanelRegion.Cursor == EXTERN_CURSOR) || (InKeyRingPopup() == true) || InItemStackPopup()) {
      DisableButton(giMapInvDoneButton);
    } else {
      EnableButton(giMapInvDoneButton);
    }

    if (fShowDescriptionFlag) {
      ForceButtonUnDirty(giMapInvDoneButton);
    }
  }
}

function EnableDisableTimeCompressButtons(): void {
  if (AllowedToTimeCompress() == false) {
    DisableButton(guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_MORE]);
    DisableButton(guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_LESS]);
  } else {
    // disable LESS if time compression is at minimum or OFF
    if (!IsTimeCompressionOn() || giTimeCompressMode == Enum130.TIME_COMPRESS_X0) {
      DisableButton(guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_LESS]);
    } else {
      EnableButton(guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_LESS]);
    }

    // disable MORE if we're not paused and time compression is at maximum
    // only disable MORE if we're not paused and time compression is at maximum
    if (IsTimeCompressionOn() && (giTimeCompressMode == Enum130.TIME_COMPRESS_60MINS)) {
      DisableButton(guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_MORE]);
    } else {
      EnableButton(guiMapBottomTimeButtons[Enum143.MAP_TIME_COMPRESS_MORE]);
    }
  }
}

export function EnableDisAbleMapScreenOptionsButton(fEnable: boolean): void {
  if (fEnable) {
    EnableButton(guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_OPTIONS]);
  } else {
    DisableButton(guiMapBottomExitButtons[Enum144.MAP_EXIT_TO_OPTIONS]);
  }
}

export function AllowedToTimeCompress(): boolean {
  // if already leaving, disallow any other attempts to exit
  if (fLeavingMapScreen) {
    return false;
  }

  // if already going someplace
  if (gbExitingMapScreenToWhere != -1) {
    return false;
  }

  // if we're locked into paused time compression by some event that enforces that
  if (PauseStateLocked()) {
    return false;
  }

  // meanwhile coming up
  if (gfMeanwhileTryingToStart) {
    return false;
  }

  // someone has something to say
  if (!DialogueQueueIsEmpty()) {
    return false;
  }

  // moving / confirming movement
  if ((bSelectedDestChar != -1) || fPlotForHelicopter || gfInConfirmMapMoveMode || fShowMapScreenMovementList) {
    return false;
  }

  if (fShowAssignmentMenu || fShowTrainingMenu || fShowAttributeMenu || fShowSquadMenu || fShowContractMenu || fShowRemoveMenu) {
    return false;
  }

  if (fShowUpdateBox || fShowTownInfo || (sSelectedMilitiaTown != 0)) {
    return false;
  }

  // renewing contracts
  if (gfContractRenewalSquenceOn) {
    return false;
  }

  // disabled due to battle?
  if ((fDisableMapInterfaceDueToBattle) || (fDisableDueToBattleRoster)) {
    return false;
  }

  // if holding an inventory item
  if (fMapInventoryItem) {
    return false;
  }

  // show the inventory pool?
  if (fShowMapInventoryPool) {
    // prevent time compress (items get stolen over time, etc.)
    return false;
  }

  // no mercs have ever been hired
  if (gfAtLeastOneMercWasHired == false) {
    return false;
  }

  /*
          //in air raid
          if( InAirRaid( ) == TRUE )
          {
                  return( FALSE );
          }
  */

  // no usable mercs on team!
  if (!AnyUsableRealMercenariesOnTeam()) {
    return false;
  }

  // must wait till bombs go off
  if (ActiveTimedBombExists()) {
    return false;
  }

  // hostile sector / in battle
  if ((gTacticalStatus.uiFlags & INCOMBAT) || (gTacticalStatus.fEnemyInSector)) {
    return false;
  }

  if (PlayerGroupIsInACreatureInfestedMine()) {
    return false;
  }

  return true;
}

function DisplayCurrentBalanceTitleForMapBottom(): void {
  let sString: string /* CHAR16[128] */;
  let sFontX: INT16;
  let sFontY: INT16;

  // ste the font buffer
  SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);

  SetFont(COMPFONT());
  SetFontForeground(MAP_BOTTOM_FONT_COLOR);
  SetFontBackground(FONT_BLACK);

  sString = swprintf("%s", pMapScreenBottomText[0]);

  // center it
  ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(359, 387 - 14, 437 - 359, 10, COMPFONT(), sString));

  // print it
  mprintf(sFontX, sFontY, "%s", sString);

  sString = swprintf("%s", zMarksMapScreenText[2]);

  // center it
  ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(359, 433 - 14, 437 - 359, 10, COMPFONT(), sString));

  // print it
  mprintf(sFontX, sFontY, "%s", sString);

  // ste the font buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
  return;
}

function DisplayCurrentBalanceForMapBottom(): void {
  // show the current balance for the player on the map panel bottom
  let sString: string /* CHAR16[128] */;
  let sFontX: INT16;
  let sFontY: INT16;

  // ste the font buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // set up the font
  SetFont(COMPFONT());
  SetFontForeground(183);
  SetFontBackground(FONT_BLACK);

  sString = swprintf("%d", LaptopSaveInfo.iCurrentBalance);

  // insert

  sString = InsertCommasForDollarFigure(sString);
  sString = InsertDollarSignInToString(sString);

  // center it
  ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(359, 387 + 2, 437 - 359, 10, COMPFONT(), sString));

  // print it
  mprintf(sFontX, sFontY, "%s", sString);

  return;
}

export function CreateDestroyMouseRegionMasksForTimeCompressionButtons(): void {
  let fDisabled: boolean = false;
  /* static */ let fCreated: boolean = false;

  // allowed to time compress?
  if (AllowedToTimeCompress() == false) {
    // no, disable buttons
    fDisabled = true;
  }

  if (fInMapMode == false) {
    fDisabled = false;
  }

  // check if disabled and not created, create
  if ((fDisabled) && (fCreated == false)) {
    // mask over compress more button
    MSYS_DefineRegion(gTimeCompressionMask[0], 528, 456, 528 + 13, 456 + 14, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, CompressMaskClickCallback);

    // mask over compress less button
    MSYS_DefineRegion(gTimeCompressionMask[1], 466, 456, 466 + 13, 456 + 14, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, CompressMaskClickCallback);

    // mask over pause game button
    MSYS_DefineRegion(gTimeCompressionMask[2], 487, 456, 522, 467, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, CompressMaskClickCallback);

    fCreated = true;
  } else if ((fDisabled == false) && (fCreated)) {
    // created and no longer need to disable
    MSYS_RemoveRegion(gTimeCompressionMask[0]);
    MSYS_RemoveRegion(gTimeCompressionMask[1]);
    MSYS_RemoveRegion(gTimeCompressionMask[2]);
    fCreated = false;
  }
}

function CompressMaskClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    TellPlayerWhyHeCantCompressTime();
  }
}

function DisplayProjectedDailyMineIncome(): void {
  let iRate: INT32 = 0;
  /* static */ let iOldRate: INT32 = -1;
  let sString: string /* CHAR16[128] */;
  let sFontX: INT16;
  let sFontY: INT16;

  // grab the rate from the financial system
  iRate = GetProjectedTotalDailyIncome();

  if (iRate != iOldRate) {
    iOldRate = iRate;
    fMapScreenBottomDirty = true;

    // if screen was not dirtied, leave
    if (fMapBottomDirtied == false) {
      return;
    }
  }
  // ste the font buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // set up the font
  SetFont(COMPFONT());
  SetFontForeground(183);
  SetFontBackground(FONT_BLACK);

  sString = swprintf("%d", iRate);

  // insert
  sString = InsertCommasForDollarFigure(sString);
  sString = InsertDollarSignInToString(sString);

  // center it
  ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(359, 433 + 2, 437 - 359, 10, COMPFONT(), sString));

  // print it
  mprintf(sFontX, sFontY, "%s", sString);

  return;
}

export function CommonTimeCompressionChecks(): boolean {
  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
    return true;
  }

  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    // abort plotting movement
    AbortMovementPlottingMode();
    return true;
  }

  return false;
}

export function AnyUsableRealMercenariesOnTeam(): boolean {
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iCounter: INT32 = 0;
  let iNumberOnTeam: INT32 = 0;

  // this is for speed, this runs once/frame
  iNumberOnTeam = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // get number of mercs on team who are not vehicles or robot, POWs or EPCs
  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pSoldier = addressof(Menptr[iCounter]);

    if ((pSoldier.value.bActive) && (pSoldier.value.bLife > 0) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD) && (pSoldier.value.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__EPC)) {
      return true;
    }
  }

  return false;
}

export function RequestTriggerExitFromMapscreen(bExitToWhere: INT8): void {
  Assert((bExitToWhere >= Enum144.MAP_EXIT_TO_LAPTOP) && (bExitToWhere <= Enum144.MAP_EXIT_TO_SAVE));

  // if allowed to do so
  if (AllowedToExitFromMapscreenTo(bExitToWhere)) {
    // if the screen to exit to is the SAVE screen
    if (bExitToWhere == Enum144.MAP_EXIT_TO_SAVE) {
      // if the game CAN NOT be saved
      if (!CanGameBeSaved()) {
        // Display a message saying the player cant save now
        DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zNewTacticalMessages[Enum320.TCTL_MSG__IRON_MAN_CANT_SAVE_NOW], Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, null);
        return;
      }
    }

    // permit it, and get the ball rolling
    gbExitingMapScreenToWhere = bExitToWhere;

    // delay until mapscreen has had a chance to render at least one full frame
    gfOneFramePauseOnExit = true;
  }
}

export function AllowedToExitFromMapscreenTo(bExitToWhere: INT8): boolean {
  Assert((bExitToWhere >= Enum144.MAP_EXIT_TO_LAPTOP) && (bExitToWhere <= Enum144.MAP_EXIT_TO_SAVE));

  // if already leaving, disallow any other attempts to exit
  if (fLeavingMapScreen) {
    return false;
  }

  // if already going someplace else
  if ((gbExitingMapScreenToWhere != -1) && (gbExitingMapScreenToWhere != bExitToWhere)) {
    return false;
  }

  // someone has something to say
  if (!DialogueQueueIsEmpty()) {
    return false;
  }

  // meanwhile coming up
  if (gfMeanwhileTryingToStart) {
    return false;
  }

  // if we're locked into paused time compression by some event that enforces that
  if (PauseStateLocked()) {
    return false;
  }

  // if holding an inventory item
  if (fMapInventoryItem || (gMPanelRegion.Cursor == EXTERN_CURSOR)) {
    return false;
  }

  if (fShowUpdateBox || fShowTownInfo || (sSelectedMilitiaTown != 0)) {
    return false;
  }

  // renewing contracts
  if (gfContractRenewalSquenceOn) {
    return false;
  }

  // battle about to occur?
  if ((fDisableDueToBattleRoster) || (fDisableMapInterfaceDueToBattle)) {
    return false;
  }

  /*
          // air raid starting
          if( gubAirRaidMode == AIR_RAID_START )
          {
                  // nope
                  return( FALSE );
          }
  */

  // the following tests apply to going tactical screen only
  if (bExitToWhere == Enum144.MAP_EXIT_TO_TACTICAL) {
    // if in battle or air raid, the ONLY sector we can go tactical in is the one that's loaded
    if (((gTacticalStatus.uiFlags & INCOMBAT) || (gTacticalStatus.fEnemyInSector) /*|| InAirRaid( )*/) && ((sSelMapX != gWorldSectorX) || (sSelMapY != gWorldSectorY) || (iCurrentMapSectorZ) != gbWorldSectorZ)) {
      return false;
    }

    // must have some mercs there
    if (!CanGoToTacticalInSector(sSelMapX, sSelMapY, iCurrentMapSectorZ)) {
      return false;
    }
  }

  // if we are map screen sector inventory
  if (fShowMapInventoryPool) {
    // dont allow it
    return false;
  }

  // OK to go there, passed all the checks
  return true;
}

export function HandleExitsFromMapScreen(): void {
  // if going somewhere
  if (gbExitingMapScreenToWhere != -1) {
    // delay all exits by one frame...
    if (gfOneFramePauseOnExit == true) {
      gfOneFramePauseOnExit = false;
      return;
    }

    // make sure it's still legal to do this!
    if (AllowedToExitFromMapscreenTo(gbExitingMapScreenToWhere)) {
      // see where we're trying to go
      switch (gbExitingMapScreenToWhere) {
        case Enum144.MAP_EXIT_TO_LAPTOP:
          fLapTop = true;
          SetPendingNewScreen(Enum26.LAPTOP_SCREEN);

          if (gfExtraBuffer) {
            // Then initiate the transition animation from the mapscreen to laptop...
            BlitBufferToBuffer(FRAME_BUFFER, guiEXTRABUFFER, 0, 0, 640, 480);
            gfStartMapScreenToLaptopTransition = true;
          }
          break;

        case Enum144.MAP_EXIT_TO_TACTICAL:
          SetCurrentWorldSector(sSelMapX, sSelMapY, iCurrentMapSectorZ);

          break;

        case Enum144.MAP_EXIT_TO_OPTIONS:
          guiPreviousOptionScreen = guiCurrentScreen;
          SetPendingNewScreen(Enum26.OPTIONS_SCREEN);
          break;

        case Enum144.MAP_EXIT_TO_SAVE:
        case Enum144.MAP_EXIT_TO_LOAD:
          gfCameDirectlyFromGame = true;
          guiPreviousOptionScreen = guiCurrentScreen;
          SetPendingNewScreen(Enum26.SAVE_LOAD_SCREEN);
          break;

        default:
          // invalid exit type
          Assert(false);
      }

      // time compression during mapscreen exit doesn't seem to cause any problems, but turn it off as early as we can
      StopTimeCompression();

      // now leaving mapscreen
      fLeavingMapScreen = true;
    }

    // cancel exit, either we're on our way, or we're not allowed to go
    gbExitingMapScreenToWhere = -1;
  }
}

export function MapScreenMsgScrollDown(ubLinesDown: UINT8): void {
  let ubNumMessages: UINT8;

  ubNumMessages = GetRangeOfMapScreenMessages();

  // check if we can go that far, only go as far as we can
  if ((gubFirstMapscreenMessageIndex + MAX_MESSAGES_ON_MAP_BOTTOM + ubLinesDown) > ubNumMessages) {
    ubLinesDown = ubNumMessages - gubFirstMapscreenMessageIndex - Math.min(ubNumMessages, MAX_MESSAGES_ON_MAP_BOTTOM);
  }

  if (ubLinesDown > 0) {
    ChangeCurrentMapscreenMessageIndex((gubFirstMapscreenMessageIndex + ubLinesDown));
  }
}

export function MapScreenMsgScrollUp(ubLinesUp: UINT8): void {
  let ubNumMessages: UINT8;

  ubNumMessages = GetRangeOfMapScreenMessages();

  // check if we can go that far, only go as far as we can
  if (gubFirstMapscreenMessageIndex < ubLinesUp) {
    ubLinesUp = gubFirstMapscreenMessageIndex;
  }

  if (ubLinesUp > 0) {
    ChangeCurrentMapscreenMessageIndex((gubFirstMapscreenMessageIndex - ubLinesUp));
  }
}

export function MoveToEndOfMapScreenMessageList(): void {
  let ubDesiredMessageIndex: UINT8;
  let ubNumMessages: UINT8;

  ubNumMessages = GetRangeOfMapScreenMessages();

  ubDesiredMessageIndex = ubNumMessages - Math.min(ubNumMessages, MAX_MESSAGES_ON_MAP_BOTTOM);
  ChangeCurrentMapscreenMessageIndex(ubDesiredMessageIndex);
}

export function ChangeCurrentMapscreenMessageIndex(ubNewMessageIndex: UINT8): void {
  Assert(ubNewMessageIndex + MAX_MESSAGES_ON_MAP_BOTTOM <= Math.max(MAX_MESSAGES_ON_MAP_BOTTOM, GetRangeOfMapScreenMessages()));

  gubFirstMapscreenMessageIndex = ubNewMessageIndex;
  gubCurrentMapMessageString = (gubStartOfMapScreenMessageList + gubFirstMapscreenMessageIndex) % 256;

  // set fact we just went to a new message
  //	gfNewScrollMessage = TRUE;

  // refresh screen
  fMapScreenBottomDirty = true;
}

}
