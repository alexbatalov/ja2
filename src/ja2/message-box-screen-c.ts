const MSGBOX_DEFAULT_WIDTH = 300;

const MSGBOX_BUTTON_WIDTH = 61;
const MSGBOX_BUTTON_HEIGHT = 20;
const MSGBOX_BUTTON_X_SEP = 15;

const MSGBOX_SMALL_BUTTON_WIDTH = 31;
const MSGBOX_SMALL_BUTTON_X_SEP = 8;

type MSGBOX_CALLBACK = (bExitValue: UINT8) => void;

// old mouse x and y positions
let pOldMousePosition: SGPPoint;
let MessageBoxRestrictedCursorRegion: SGPRect;

// if the cursor was locked to a region
let fCursorLockedToArea: BOOLEAN = FALSE;
let gfInMsgBox: BOOLEAN = FALSE;

let gOldCursorLimitRectangle: SGPRect;

let gMsgBox: MESSAGE_BOX_STRUCT;
let gfNewMessageBox: BOOLEAN = FALSE;
let gfStartedFromGameScreen: BOOLEAN = FALSE;
let gfStartedFromMapScreen: BOOLEAN = FALSE;
let fRestoreBackgroundForMessageBox: BOOLEAN = FALSE;
let gfDontOverRideSaveBuffer: BOOLEAN = TRUE; // this variable can be unset if ur in a non gamescreen and DONT want the msg box to use the save buffer

let gzUserDefinedButton1: CHAR16[] /* [128] */;
let gzUserDefinedButton2: CHAR16[] /* [128] */;

function DoMessageBox(ubStyle: UINT8, zString: Pointer<INT16>, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK, pCenteringRect: Pointer<SGPRect>): INT32 {
  let vs_desc: VSURFACE_DESC;
  let usTextBoxWidth: UINT16;
  let usTextBoxHeight: UINT16;
  let aRect: SGPRect;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let sButtonX: INT16;
  let sButtonY: INT16;
  let sBlankSpace: INT16;
  let ubMercBoxBackground: UINT8 = Enum324.BASIC_MERC_POPUP_BACKGROUND;
  let ubMercBoxBorder: UINT8 = Enum325.BASIC_MERC_POPUP_BORDER;
  let ubFontColor: UINT8;
  let ubFontShadowColor: UINT8;
  let usCursor: UINT16;
  let iId: INT32 = -1;

  GetMousePos(addressof(pOldMousePosition));

  // this variable can be unset if ur in a non gamescreen and DONT want the msg box to use the save buffer
  gfDontOverRideSaveBuffer = TRUE;

  SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);

  if (gMsgBox.BackRegion.uiFlags & MSYS_REGION_EXISTS) {
    return 0;
  }

  // Based on style....
  switch (ubStyle) {
    // default
    case Enum24.MSG_BOX_BASIC_STYLE:

      ubMercBoxBackground = Enum324.DIALOG_MERC_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.DIALOG_MERC_POPUP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\popupbuttons.sti", -1, 0, -1, 1, -1);
      ubFontColor = FONT_MCOLOR_WHITE;
      ubFontShadowColor = DEFAULT_SHADOW;
      usCursor = Enum317.CURSOR_NORMAL;

      break;

    case Enum24.MSG_BOX_RED_ON_WHITE:
      ubMercBoxBackground = Enum324.WHITE_MERC_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.RED_MERC_POPUP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\msgboxRedButtons.sti", -1, 0, -1, 1, -1);

      ubFontColor = 2;
      ubFontShadowColor = NO_SHADOW;
      usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
      break;

    case Enum24.MSG_BOX_BLUE_ON_GREY:
      ubMercBoxBackground = Enum324.GREY_MERC_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.BLUE_MERC_POPUP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\msgboxGreyButtons.sti", -1, 0, -1, 1, -1);

      ubFontColor = 2;
      ubFontShadowColor = FONT_MCOLOR_WHITE;
      usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
      break;
    case Enum24.MSG_BOX_IMP_STYLE:
      ubMercBoxBackground = Enum324.IMP_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.DIALOG_MERC_POPUP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\msgboxGreyButtons.sti", -1, 0, -1, 1, -1);

      ubFontColor = 2;
      ubFontShadowColor = FONT_MCOLOR_WHITE;
      usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
      break;
    case Enum24.MSG_BOX_BASIC_SMALL_BUTTONS:

      ubMercBoxBackground = Enum324.DIALOG_MERC_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.DIALOG_MERC_POPUP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\popupbuttons.sti", -1, 2, -1, 3, -1);
      ubFontColor = FONT_MCOLOR_WHITE;
      ubFontShadowColor = DEFAULT_SHADOW;
      usCursor = Enum317.CURSOR_NORMAL;

      break;

    case Enum24.MSG_BOX_LAPTOP_DEFAULT:
      ubMercBoxBackground = Enum324.LAPTOP_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.LAPTOP_POP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\popupbuttons.sti", -1, 0, -1, 1, -1);
      ubFontColor = FONT_MCOLOR_WHITE;
      ubFontShadowColor = DEFAULT_SHADOW;
      usCursor = Enum317.CURSOR_LAPTOP_SCREEN;
      break;

    default:
      ubMercBoxBackground = Enum324.BASIC_MERC_POPUP_BACKGROUND;
      ubMercBoxBorder = Enum325.BASIC_MERC_POPUP_BORDER;

      // Add button images
      gMsgBox.iButtonImages = LoadButtonImage("INTERFACE\\msgboxbuttons.sti", -1, 0, -1, 1, -1);
      ubFontColor = FONT_MCOLOR_WHITE;
      ubFontShadowColor = DEFAULT_SHADOW;
      usCursor = Enum317.CURSOR_NORMAL;
      break;
  }

  if (usFlags & MSG_BOX_FLAG_USE_CENTERING_RECT && pCenteringRect != NULL) {
    aRect.iTop = pCenteringRect.value.iTop;
    aRect.iLeft = pCenteringRect.value.iLeft;
    aRect.iBottom = pCenteringRect.value.iBottom;
    aRect.iRight = pCenteringRect.value.iRight;
  } else {
    // Use default!
    aRect.iTop = 0;
    aRect.iLeft = 0;
    aRect.iBottom = 480;
    aRect.iRight = 640;
  }

  // Set some values!
  gMsgBox.usFlags = usFlags;
  gMsgBox.uiExitScreen = uiExitScreen;
  gMsgBox.ExitCallback = ReturnCallback;
  gMsgBox.fRenderBox = TRUE;
  gMsgBox.bHandled = 0;

  // Init message box
  gMsgBox.iBoxId = PrepareMercPopupBox(iId, ubMercBoxBackground, ubMercBoxBorder, zString, MSGBOX_DEFAULT_WIDTH, 40, 10, 30, addressof(usTextBoxWidth), addressof(usTextBoxHeight));

  if (gMsgBox.iBoxId == -1) {
    return 0;
  }

  // Save height,width
  gMsgBox.usWidth = usTextBoxWidth;
  gMsgBox.usHeight = usTextBoxHeight;

  // Determine position ( centered in rect )
  gMsgBox.sX = ((((aRect.iRight - aRect.iLeft) - usTextBoxWidth) / 2) + aRect.iLeft);
  gMsgBox.sY = ((((aRect.iBottom - aRect.iTop) - usTextBoxHeight) / 2) + aRect.iTop);

  if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    gfStartedFromGameScreen = TRUE;
  }

  if ((fInMapMode == TRUE)) {
    //		fMapExitDueToMessageBox = TRUE;
    gfStartedFromMapScreen = TRUE;
    fMapPanelDirty = TRUE;
  }

  // Set pending screen
  SetPendingNewScreen(Enum26.MSG_BOX_SCREEN);

  // Init save buffer
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = usTextBoxWidth;
  vs_desc.usHeight = usTextBoxHeight;
  vs_desc.ubBitDepth = 16;

  if (AddVideoSurface(addressof(vs_desc), addressof(gMsgBox.uiSaveBuffer)) == FALSE) {
    return -1;
  }

  // Save what we have under here...
  pDestBuf = LockVideoSurface(gMsgBox.uiSaveBuffer, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiSrcPitchBYTES));

  Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, 0, 0, gMsgBox.sX, gMsgBox.sY, usTextBoxWidth, usTextBoxHeight);

  UnLockVideoSurface(gMsgBox.uiSaveBuffer);
  UnLockVideoSurface(FRAME_BUFFER);

  // Create top-level mouse region
  MSYS_DefineRegion(addressof(gMsgBox.BackRegion), 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, usCursor, MSYS_NO_CALLBACK, MsgBoxClickCallback);

  if (gGameSettings.fOptions[Enum8.TOPTION_DONT_MOVE_MOUSE] == FALSE) {
    if (usFlags & MSG_BOX_FLAG_OK) {
      SimulateMouseMovement((gMsgBox.sX + (usTextBoxWidth / 2) + 27), (gMsgBox.sY + (usTextBoxHeight - 10)));
    } else {
      SimulateMouseMovement(gMsgBox.sX + usTextBoxWidth / 2, gMsgBox.sY + usTextBoxHeight - 4);
    }
  }

  // Add region
  MSYS_AddRegion(addressof(gMsgBox.BackRegion));

  // findout if cursor locked, if so, store old params and store, restore when done
  if (IsCursorRestricted()) {
    fCursorLockedToArea = TRUE;
    GetRestrictedClipCursor(addressof(MessageBoxRestrictedCursorRegion));
    FreeMouseCursor();
  }

  // Create four numbered buttons
  if (usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
    // This is exclusive of any other buttons... no ok, no cancel, no nothing

    sBlankSpace = usTextBoxWidth - MSGBOX_SMALL_BUTTON_WIDTH * 4 - MSGBOX_SMALL_BUTTON_X_SEP * 3;
    sButtonX = sBlankSpace / 2;
    sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

    gMsgBox.uiButton[0] = CreateIconAndTextButton(gMsgBox.iButtonImages, "1", FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NumberedMsgBoxCallback);
    MSYS_SetBtnUserData(gMsgBox.uiButton[0], 0, 1);
    SetButtonCursor(gMsgBox.uiButton[0], usCursor);

    sButtonX += MSGBOX_SMALL_BUTTON_WIDTH + MSGBOX_SMALL_BUTTON_X_SEP;
    gMsgBox.uiButton[1] = CreateIconAndTextButton(gMsgBox.iButtonImages, "2", FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NumberedMsgBoxCallback);
    MSYS_SetBtnUserData(gMsgBox.uiButton[1], 0, 2);
    SetButtonCursor(gMsgBox.uiButton[1], usCursor);

    sButtonX += MSGBOX_SMALL_BUTTON_WIDTH + MSGBOX_SMALL_BUTTON_X_SEP;
    gMsgBox.uiButton[2] = CreateIconAndTextButton(gMsgBox.iButtonImages, "3", FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NumberedMsgBoxCallback);
    MSYS_SetBtnUserData(gMsgBox.uiButton[2], 0, 3);
    SetButtonCursor(gMsgBox.uiButton[2], usCursor);

    sButtonX += MSGBOX_SMALL_BUTTON_WIDTH + MSGBOX_SMALL_BUTTON_X_SEP;
    gMsgBox.uiButton[3] = CreateIconAndTextButton(gMsgBox.iButtonImages, "4", FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NumberedMsgBoxCallback);
    MSYS_SetBtnUserData(gMsgBox.uiButton[3], 0, 4);
    SetButtonCursor(gMsgBox.uiButton[3], usCursor);
    ForceButtonUnDirty(gMsgBox.uiButton[3]);
    ForceButtonUnDirty(gMsgBox.uiButton[2]);
    ForceButtonUnDirty(gMsgBox.uiButton[1]);
    ForceButtonUnDirty(gMsgBox.uiButton[0]);
  } else {
    // Create text button
    if (usFlags & MSG_BOX_FLAG_OK) {
      //			sButtonX = ( usTextBoxWidth - MSGBOX_BUTTON_WIDTH ) / 2;
      sButtonX = (usTextBoxWidth - GetMSgBoxButtonWidth(gMsgBox.iButtonImages)) / 2;

      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiOKButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_OK], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), OKMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiOKButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiOKButton);
    }

    // Create text button
    if (usFlags & MSG_BOX_FLAG_CANCEL) {
      sButtonX = (usTextBoxWidth - GetMSgBoxButtonWidth(gMsgBox.iButtonImages)) / 2;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiOKButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_CANCEL], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), OKMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiOKButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiOKButton);
    }

    if (usFlags & MSG_BOX_FLAG_YESNO) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 2;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_YES], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);

      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_NO], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);
    }

    if (usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 2;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pUpdatePanelButtons[0], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);

      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pUpdatePanelButtons[1], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);
    }

    if (usFlags & MSG_BOX_FLAG_OKCONTRACT) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 2;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_OK], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), OKMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);

      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_REHIRE], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), ContractMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);
    }

    if (usFlags & MSG_BOX_FLAG_YESNOCONTRACT) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 3;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_YES], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_NO], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);

      gMsgBox.uiOKButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_REHIRE], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + 2 * (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), ContractMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiOKButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiOKButton);
    }

    if (usFlags & MSG_BOX_FLAG_GENERICCONTRACT) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 3;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, gzUserDefinedButton1, FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, gzUserDefinedButton2, FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);

      gMsgBox.uiOKButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_REHIRE], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + 2 * (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), ContractMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiOKButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiOKButton);
    }

    if (usFlags & MSG_BOX_FLAG_GENERIC) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 2;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, gzUserDefinedButton1, FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, gzUserDefinedButton2, FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);
    }

    if (usFlags & MSG_BOX_FLAG_YESNOLIE) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 3;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_YES], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_NO], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);

      gMsgBox.uiOKButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_LIE], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + 2 * (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), LieMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiOKButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiOKButton);
    }

    if (usFlags & MSG_BOX_FLAG_OKSKIP) {
      sButtonX = (usTextBoxWidth - (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)) / 2;
      sButtonY = usTextBoxHeight - MSGBOX_BUTTON_HEIGHT - 10;

      gMsgBox.uiYESButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_OK], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), YESMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiYESButton, usCursor);

      ForceButtonUnDirty(gMsgBox.uiYESButton);

      gMsgBox.uiNOButton = CreateIconAndTextButton(gMsgBox.iButtonImages, pMessageStrings[Enum333.MSG_SKIP], FONT12ARIAL(), ubFontColor, ubFontShadowColor, ubFontColor, ubFontShadowColor, TEXT_CJUSTIFIED, (gMsgBox.sX + sButtonX + (MSGBOX_BUTTON_WIDTH + MSGBOX_BUTTON_X_SEP)), (gMsgBox.sY + sButtonY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), NOMsgBoxCallback);
      SetButtonCursor(gMsgBox.uiNOButton, usCursor);
      ForceButtonUnDirty(gMsgBox.uiNOButton);
    }
  }

  InterruptTime();
  PauseGame();
  LockPauseState(1);
  // Pause timers as well....
  PauseTime(TRUE);

  // Save mouse restriction region...
  GetRestrictedClipCursor(addressof(gOldCursorLimitRectangle));
  FreeMouseCursor();

  gfNewMessageBox = TRUE;

  gfInMsgBox = TRUE;

  return iId;
}

function MsgBoxClickCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /// if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP)
  //{
  //	gMsgBox.bHandled = MSG_BOX_RETURN_NO;
  //}
  //
}

function OKMsgBoxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fLButtonDown: BOOLEAN = FALSE;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    fLButtonDown = TRUE;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_UP) && fLButtonDown) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    gMsgBox.bHandled = MSG_BOX_RETURN_OK;
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = FALSE;
  }
}

function YESMsgBoxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fLButtonDown: BOOLEAN = FALSE;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    fLButtonDown = TRUE;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_UP) && fLButtonDown) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    gMsgBox.bHandled = MSG_BOX_RETURN_YES;
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = FALSE;
  }
}

function NOMsgBoxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fLButtonDown: BOOLEAN = FALSE;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    fLButtonDown = TRUE;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_UP) && fLButtonDown) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    gMsgBox.bHandled = MSG_BOX_RETURN_NO;
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = FALSE;
  }
}

function ContractMsgBoxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fLButtonDown: BOOLEAN = FALSE;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    fLButtonDown = TRUE;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_UP) && fLButtonDown) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    gMsgBox.bHandled = MSG_BOX_RETURN_CONTRACT;
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = FALSE;
  }
}

function LieMsgBoxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fLButtonDown: BOOLEAN = FALSE;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    fLButtonDown = TRUE;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_UP) && fLButtonDown) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    gMsgBox.bHandled = MSG_BOX_RETURN_LIE;
  } else if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = FALSE;
  }
}

function NumberedMsgBoxCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    gMsgBox.bHandled = MSYS_GetBtnUserData(btn, 0);
  }
}

function ExitMsgBox(ubExitCode: INT8): UINT32 {
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let pPosition: SGPPoint;

  // Delete popup!
  RemoveMercPopupBoxFromIndex(gMsgBox.iBoxId);
  gMsgBox.iBoxId = -1;

  // Delete buttons!
  if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
    RemoveButton(gMsgBox.uiButton[0]);
    RemoveButton(gMsgBox.uiButton[1]);
    RemoveButton(gMsgBox.uiButton[2]);
    RemoveButton(gMsgBox.uiButton[3]);
  } else {
    if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
      RemoveButton(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_OKCONTRACT) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOCONTRACT) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
      RemoveButton(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERICCONTRACT) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
      RemoveButton(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERIC) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOLIE) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
      RemoveButton(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_OKSKIP) {
      RemoveButton(gMsgBox.uiYESButton);
      RemoveButton(gMsgBox.uiNOButton);
    }
  }

  // Delete button images
  UnloadButtonImage(gMsgBox.iButtonImages);

  // Unpause game....
  UnLockPauseState();
  UnPauseGame();
  // UnPause timers as well....
  PauseTime(FALSE);

  // Restore mouse restriction region...
  RestrictMouseCursor(addressof(gOldCursorLimitRectangle));

  gfInMsgBox = FALSE;

  // Call done callback!
  if (gMsgBox.ExitCallback != NULL) {
    ((gMsgBox.ExitCallback).value)(ubExitCode);
  }

  // if ur in a non gamescreen and DONT want the msg box to use the save buffer, unset gfDontOverRideSaveBuffer in ur callback
  if (((gMsgBox.uiExitScreen != Enum26.GAME_SCREEN) || (fRestoreBackgroundForMessageBox == TRUE)) && gfDontOverRideSaveBuffer) {
    // restore what we have under here...
    pSrcBuf = LockVideoSurface(gMsgBox.uiSaveBuffer, addressof(uiSrcPitchBYTES));
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

    Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, gMsgBox.sX, gMsgBox.sY, 0, 0, gMsgBox.usWidth, gMsgBox.usHeight);

    UnLockVideoSurface(gMsgBox.uiSaveBuffer);
    UnLockVideoSurface(FRAME_BUFFER);

    InvalidateRegion(gMsgBox.sX, gMsgBox.sY, (gMsgBox.sX + gMsgBox.usWidth), (gMsgBox.sY + gMsgBox.usHeight));
  }

  fRestoreBackgroundForMessageBox = FALSE;
  gfDontOverRideSaveBuffer = TRUE;

  if (fCursorLockedToArea == TRUE) {
    GetMousePos(addressof(pPosition));

    if ((pPosition.iX > MessageBoxRestrictedCursorRegion.iRight) || (pPosition.iX > MessageBoxRestrictedCursorRegion.iLeft) && (pPosition.iY < MessageBoxRestrictedCursorRegion.iTop) && (pPosition.iY > MessageBoxRestrictedCursorRegion.iBottom)) {
      SimulateMouseMovement(pOldMousePosition.iX, pOldMousePosition.iY);
    }

    fCursorLockedToArea = FALSE;
    RestrictMouseCursor(addressof(MessageBoxRestrictedCursorRegion));
  }

  // Remove region
  MSYS_RemoveRegion(addressof(gMsgBox.BackRegion));

  // Remove save buffer!
  DeleteVideoSurfaceFromIndex(gMsgBox.uiSaveBuffer);

  switch (gMsgBox.uiExitScreen) {
    case Enum26.GAME_SCREEN:

      if (InOverheadMap()) {
        gfOverheadMapDirty = TRUE;
      } else {
        SetRenderFlags(RENDER_FLAG_FULL);
      }
      break;
    case Enum26.MAP_SCREEN:
      fMapPanelDirty = TRUE;
      break;
  }

  if (gfFadeInitialized) {
    SetPendingNewScreen(Enum26.FADE_SCREEN);
    return Enum26.FADE_SCREEN;
  }

  return gMsgBox.uiExitScreen;
}

function MessageBoxScreenInit(): UINT32 {
  return TRUE;
}

function MessageBoxScreenHandle(): UINT32 {
  let InputEvent: InputAtom;

  if (gfNewMessageBox) {
    // If in game screen....
    if ((gfStartedFromGameScreen) || (gfStartedFromMapScreen)) {
      // UINT32 uiDestPitchBYTES, uiSrcPitchBYTES;
      // UINT8	 *pDestBuf, *pSrcBuf;

      if (gfStartedFromGameScreen) {
        HandleTacticalUILoseCursorFromOtherScreen();
      } else {
        HandleMAPUILoseCursorFromOtherScreen();
      }

      gfStartedFromGameScreen = FALSE;
      gfStartedFromMapScreen = FALSE;
      /*
                              // Save what we have under here...
                              pDestBuf = LockVideoSurface( gMsgBox.uiSaveBuffer, &uiDestPitchBYTES);
                              pSrcBuf = LockVideoSurface( FRAME_BUFFER, &uiSrcPitchBYTES);

                              Blt16BPPTo16BPP((UINT16 *)pDestBuf, uiDestPitchBYTES,
                                                      (UINT16 *)pSrcBuf, uiSrcPitchBYTES,
                                                      0 , 0,
                                                      gMsgBox.sX , gMsgBox.sY,
                                                      gMsgBox.usWidth, gMsgBox.usHeight );

                              UnLockVideoSurface( gMsgBox.uiSaveBuffer );
                              UnLockVideoSurface( FRAME_BUFFER );
      */
    }

    gfNewMessageBox = FALSE;

    return Enum26.MSG_BOX_SCREEN;
  }

  UnmarkButtonsDirty();

  // Render the box!
  if (gMsgBox.fRenderBox) {
    if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
      MarkAButtonDirty(gMsgBox.uiButton[0]);
      MarkAButtonDirty(gMsgBox.uiButton[1]);
      MarkAButtonDirty(gMsgBox.uiButton[2]);
      MarkAButtonDirty(gMsgBox.uiButton[3]);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
      MarkAButtonDirty(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_CANCEL) {
      MarkAButtonDirty(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_OKCONTRACT) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOCONTRACT) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
      MarkAButtonDirty(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERICCONTRACT) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
      MarkAButtonDirty(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_GENERIC) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
      // Exit messagebox
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNOLIE) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
      MarkAButtonDirty(gMsgBox.uiOKButton);
    }

    if (gMsgBox.usFlags & MSG_BOX_FLAG_OKSKIP) {
      MarkAButtonDirty(gMsgBox.uiYESButton);
      MarkAButtonDirty(gMsgBox.uiNOButton);
    }

    RenderMercPopUpBoxFromIndex(gMsgBox.iBoxId, gMsgBox.sX, gMsgBox.sY, FRAME_BUFFER);
    // gMsgBox.fRenderBox = FALSE;
    // ATE: Render each frame...
  }

  // Render buttons
  RenderButtons();

  EndFrameBufferRender();

  // carter, need key shortcuts for clearing up message boxes
  // Check for esc
  while (DequeueEvent(addressof(InputEvent)) == TRUE) {
    if (InputEvent.usEvent == KEY_UP) {
      if ((InputEvent.usParam == ESC) || (InputEvent.usParam == 'n')) {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
          // Exit messagebox
          gMsgBox.bHandled = MSG_BOX_RETURN_NO;
        }
      }

      if (InputEvent.usParam == ENTER) {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
          // Exit messagebox
          gMsgBox.bHandled = MSG_BOX_RETURN_YES;
        } else if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
          // Exit messagebox
          gMsgBox.bHandled = MSG_BOX_RETURN_OK;
        } else if (gMsgBox.usFlags & MSG_BOX_FLAG_CONTINUESTOP) {
          // Exit messagebox
          gMsgBox.bHandled = MSG_BOX_RETURN_OK;
        }
      }
      if (InputEvent.usParam == 'o') {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_OK) {
          // Exit messagebox
          gMsgBox.bHandled = MSG_BOX_RETURN_OK;
        }
      }
      if (InputEvent.usParam == 'y') {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_YESNO) {
          // Exit messagebox
          gMsgBox.bHandled = MSG_BOX_RETURN_YES;
        }
      }
      if (InputEvent.usParam == '1') {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
          // Exit messagebox
          gMsgBox.bHandled = 1;
        }
      }
      if (InputEvent.usParam == '2') {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
          // Exit messagebox
          gMsgBox.bHandled = 1;
        }
      }
      if (InputEvent.usParam == '3') {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
          // Exit messagebox
          gMsgBox.bHandled = 1;
        }
      }
      if (InputEvent.usParam == '4') {
        if (gMsgBox.usFlags & MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS) {
          // Exit messagebox
          gMsgBox.bHandled = 1;
        }
      }
    }
  }

  if (gMsgBox.bHandled) {
    SetRenderFlags(RENDER_FLAG_FULL);
    return ExitMsgBox(gMsgBox.bHandled);
  }

  return Enum26.MSG_BOX_SCREEN;
}

function MessageBoxScreenShutdown(): UINT32 {
  return FALSE;
}

// a basic box that don't care what screen we came from
function DoScreenIndependantMessageBox(zString: Pointer<INT16>, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): void {
  let CenteringRect: SGPRect = [ 0, 0, 640, INV_INTERFACE_START_Y ];
  DoScreenIndependantMessageBoxWithRect(zString, usFlags, ReturnCallback, addressof(CenteringRect));
}

// a basic box that don't care what screen we came from
function DoUpperScreenIndependantMessageBox(zString: Pointer<INT16>, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): void {
  let CenteringRect: SGPRect = [ 0, 0, 640, INV_INTERFACE_START_Y / 2 ];
  DoScreenIndependantMessageBoxWithRect(zString, usFlags, ReturnCallback, addressof(CenteringRect));
}

// a basic box that don't care what screen we came from
function DoLowerScreenIndependantMessageBox(zString: Pointer<INT16>, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): void {
  let CenteringRect: SGPRect = [ 0, INV_INTERFACE_START_Y / 2, 640, INV_INTERFACE_START_Y ];
  DoScreenIndependantMessageBoxWithRect(zString, usFlags, ReturnCallback, addressof(CenteringRect));
}

function DoScreenIndependantMessageBoxWithRect(zString: Pointer<INT16>, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK, pCenteringRect: Pointer<SGPRect>): void {
  /// which screen are we in?

  // Map Screen (excluding AI Viewer)
  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN))
  {
    // auto resolve is a special case
    if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zString, Enum26.AUTORESOLVE_SCREEN, usFlags, ReturnCallback, pCenteringRect);
    } else {
      // set up for mapscreen
      DoMapMessageBoxWithRect(Enum24.MSG_BOX_BASIC_STYLE, zString, Enum26.MAP_SCREEN, usFlags, ReturnCallback, pCenteringRect);
    }
  }

  // Laptop
  else if (guiCurrentScreen == Enum26.LAPTOP_SCREEN) {
    // set up for laptop
    DoLapTopSystemMessageBoxWithRect(Enum24.MSG_BOX_LAPTOP_DEFAULT, zString, Enum26.LAPTOP_SCREEN, usFlags, ReturnCallback, pCenteringRect);
  }

  // Save Load Screen
  else if (guiCurrentScreen == Enum26.SAVE_LOAD_SCREEN) {
    DoSaveLoadMessageBoxWithRect(Enum24.MSG_BOX_BASIC_STYLE, zString, Enum26.SAVE_LOAD_SCREEN, usFlags, ReturnCallback, pCenteringRect);
  }

  // Options Screen
  else if (guiCurrentScreen == Enum26.OPTIONS_SCREEN) {
    DoOptionsMessageBoxWithRect(Enum24.MSG_BOX_BASIC_STYLE, zString, Enum26.OPTIONS_SCREEN, usFlags, ReturnCallback, pCenteringRect);
  }

  // Tactical
  else if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zString, guiCurrentScreen, usFlags, ReturnCallback, pCenteringRect);
  }
}

function GetMSgBoxButtonWidth(iButtonImage: INT32): UINT16 {
  return GetWidthOfButtonPic(iButtonImage, ButtonPictures[iButtonImage].OnNormal);
}
