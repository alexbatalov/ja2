namespace ja2 {

const MAIN_PAGE_BUTTON_TEXT_WIDTH = 95;

// main page buttons
let giIMPMainPageButton: INT32[] /* [6] */;
let giIMPMainPageButtonImage: INT32[] /* [6] */;

// mouse regions for not entablable warning
let pIMPMainPageMouseRegions: MOUSE_REGION[] /* [4] */ = createArrayFrom(4, createMouseRegion);

let guiCHARACTERPORTRAITFORMAINPAGE: UINT32;

// this is the current state of profiling the player is in.
/*
  0 - Beginning
        1 - Personnality
        2 - Attributes and Skills
        3 - Portrait
        4 - Voice
        5 - Done
        */
export let iCurrentProfileMode: INT32 = 0;

export function EnterIMPMainPage(): void {
  // turn off review mode
  fReviewStats = false;

  // create buttons
  CreateIMPMainPageButtons();

  // load portrait for face button, if applicable
  LoadCharacterPortraitForMainPage();

  // create button masks for this screen
  CreateMouseRegionsForIMPMainPageBasedOnCharGenStatus();

  // alter states
  UpDateIMPMainPageButtons();

  // entry into IMP about us page
  RenderIMPMainPage();

  return;
}

export function ExitIMPMainPage(): void {
  // exit from IMP About us page

  // delete Buttons
  DeleteIMPMainPageButtons();
  DestoryMouseRegionsForIMPMainPageBasedOnCharGenStatus();

  return;
}

export function RenderIMPMainPage(): void {
  // rneders the IMP about us page

  // the background
  RenderProfileBackGround();

  // the IMP symbol
  // RenderIMPSymbol( 106, 1 );
  // indent
  RenderMainIndentFrame(164, 74);

  return;
}

export function HandleIMPMainPage(): void {
  // handles the IMP about main page

  if (CheckIfFinishedCharacterGeneration()) {
    iCurrentImpPage = Enum71.IMP_FINISH;
  }
  // shade out buttons that should be shaded/unselectable
  // ShadeUnSelectableButtons( );
  return;
}

function CreateIMPMainPageButtons(): void {
  // this function will create the buttons needed for th IMP about us page
  let sString: string /* CHAR16[128] */;

  // the back button button
  giIMPMainPageButtonImage[0] = LoadButtonImage("LAPTOP\\button_3.sti", -1, 0, -1, 1, -1);

  /* giIMPMainPageButton[0] = QuickCreateButton( giIMPMainPageButtonImage[0], LAPTOP_SCREEN_UL_X + 10 , LAPTOP_SCREEN_WEB_UL_Y + ( 360 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPMainPageBackCallback);

          */
  giIMPMainPageButton[0] = CreateIconAndTextButton(giIMPMainPageButtonImage[0], pImpButtonText[19], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 15, LAPTOP_SCREEN_WEB_UL_Y + (360), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPageBackCallback);

  SpecifyButtonTextSubOffsets(giIMPMainPageButton[0], 0, -1, false);

  // the begin profiling button
  giIMPMainPageButtonImage[1] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  /*giIMPMainPageButton[1] = QuickCreateButton( giIMPMainPageButtonImage[1], LAPTOP_SCREEN_UL_X + 136 , LAPTOP_SCREEN_WEB_UL_Y + ( 174 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPMainPageBeginCallback);
*/
  if ((iCurrentProfileMode == 0) || (iCurrentProfileMode > 2)) {
    giIMPMainPageButton[1] = CreateIconAndTextButton(giIMPMainPageButtonImage[1], pImpButtonText[1], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 136, LAPTOP_SCREEN_WEB_UL_Y + (174), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPageBeginCallback);
  } else {
    giIMPMainPageButton[1] = CreateIconAndTextButton(giIMPMainPageButtonImage[1], pImpButtonText[22], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 136, LAPTOP_SCREEN_WEB_UL_Y + (174), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPageBeginCallback);
  }
  // the personality button
  giIMPMainPageButtonImage[2] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);

  /*
  giIMPMainPageButton[2] = QuickCreateButton( giIMPMainPageButtonImage[2], LAPTOP_SCREEN_UL_X + 13 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPMainPagePersonalityCallback);
*/
  giIMPMainPageButton[2] = CreateIconAndTextButton(giIMPMainPageButtonImage[2], pImpButtonText[2], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 13, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPagePersonalityCallback);

  // the attribs button
  giIMPMainPageButtonImage[3] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);

  /*
  giIMPMainPageButton[3] = QuickCreateButton( giIMPMainPageButtonImage[3], LAPTOP_SCREEN_UL_X + 133 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPMainPageAttributesCallback);
*/
  giIMPMainPageButton[3] = CreateIconAndTextButton(giIMPMainPageButtonImage[3], pImpButtonText[3], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 133, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPageAttributesCallback);

  // the portrait button
  giIMPMainPageButtonImage[4] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);

  /*giIMPMainPageButton[4] = QuickCreateButton( giIMPMainPageButtonImage[4], LAPTOP_SCREEN_UL_X + 253 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPMainPagePortraitCallback);
*/

  giIMPMainPageButton[4] = CreateIconAndTextButton(giIMPMainPageButtonImage[4], pImpButtonText[4], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 253, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPagePortraitCallback);

  // the voice button
  giIMPMainPageButtonImage[5] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);
  /*giIMPMainPageButton[5] = QuickCreateButton( giIMPMainPageButtonImage[5], LAPTOP_SCREEN_UL_X + 373 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPMainPageVoiceCallback);
*/

  if (iCurrentProfileMode == 5) {
    sString = swprintf(pImpButtonText[5], iCurrentVoices + 1);
  } else {
    sString = pImpButtonText[25];
  }
  giIMPMainPageButton[5] = CreateIconAndTextButton(giIMPMainPageButtonImage[5], sString, FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 373, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPageVoiceCallback);

  SetButtonCursor(giIMPMainPageButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPMainPageButton[1], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPMainPageButton[2], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPMainPageButton[3], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPMainPageButton[4], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPMainPageButton[5], Enum317.CURSOR_WWW);

  SpecifyButtonTextOffsets(giIMPMainPageButton[2], 10, 40, true);
  SpecifyButtonTextOffsets(giIMPMainPageButton[3], 10, 40, true);
  SpecifyButtonTextOffsets(giIMPMainPageButton[4], 10, 40, true);
  SpecifyButtonTextOffsets(giIMPMainPageButton[5], 10, 40, true);

  SpecifyButtonTextWrappedWidth(giIMPMainPageButton[2], MAIN_PAGE_BUTTON_TEXT_WIDTH);
  SpecifyButtonTextWrappedWidth(giIMPMainPageButton[3], MAIN_PAGE_BUTTON_TEXT_WIDTH);
  SpecifyButtonTextWrappedWidth(giIMPMainPageButton[4], MAIN_PAGE_BUTTON_TEXT_WIDTH);
  SpecifyButtonTextWrappedWidth(giIMPMainPageButton[5], MAIN_PAGE_BUTTON_TEXT_WIDTH);
  return;
}

function DeleteIMPMainPageButtons(): void {
  // this function destroys the buttons needed for the IMP about Us Page

  // the back  button
  RemoveButton(giIMPMainPageButton[0]);
  UnloadButtonImage(giIMPMainPageButtonImage[0]);

  // begin profiling button
  RemoveButton(giIMPMainPageButton[1]);
  UnloadButtonImage(giIMPMainPageButtonImage[1]);

  // begin personna button
  RemoveButton(giIMPMainPageButton[2]);
  UnloadButtonImage(giIMPMainPageButtonImage[2]);

  // begin attribs button
  RemoveButton(giIMPMainPageButton[3]);
  UnloadButtonImage(giIMPMainPageButtonImage[3]);

  // begin portrait button
  RemoveButton(giIMPMainPageButton[4]);
  UnloadButtonImage(giIMPMainPageButtonImage[4]);

  // begin voice button
  RemoveButton(giIMPMainPageButton[5]);
  UnloadButtonImage(giIMPMainPageButtonImage[5]);

  return;
}

function BtnIMPMainPageBackCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for IMP Homepage About US button
  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_HOME_PAGE;
      fButtonPendingFlag = true;
      iCurrentProfileMode = 0;
      fFinishedCharGeneration = false;
      ResetCharacterStats();
    }
  }
}

function BtnIMPMainPageBeginCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  // too far along to change gender

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // are we going to change name, or do we have to start over from scratch
      if (iCurrentProfileMode > 2) {
        // too far along, restart
        DoLapTopMessageBox(Enum24.MSG_BOX_IMP_STYLE, pImpPopUpStrings[1], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_YESNO, BeginMessageBoxCallBack);
      } else {
        if (LaptopSaveInfo.iCurrentBalance < COST_OF_PROFILE) {
          DoLapTopMessageBox(Enum24.MSG_BOX_IMP_STYLE, pImpPopUpStrings[3], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, BeginMessageBoxCallBack);
        } else if (NumberOfMercsOnPlayerTeam() >= 18) {
          DoLapTopMessageBox(Enum24.MSG_BOX_IMP_STYLE, pImpPopUpStrings[5], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, BeginMessageBoxCallBack);
        } else {
          // change name
          iCurrentImpPage = Enum71.IMP_BEGIN;
          fButtonPendingFlag = true;
        }
      }
    }
  }
}

function BtnIMPMainPagePersonalityCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  // if not this far in char generation, don't alot ANY action
  if (iCurrentProfileMode != 1) {
    btn.uiFlags &= ~(BUTTON_CLICKED_ON);
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_PERSONALITY;
      fButtonPendingFlag = true;
    }
  }
}

function BtnIMPMainPageAttributesCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;
  // if not this far in char generation, don't alot ANY action
  if (iCurrentProfileMode < 2) {
    btn.uiFlags &= ~(BUTTON_CLICKED_ON);
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_ATTRIBUTE_ENTRANCE;
      fButtonPendingFlag = true;
    }
  }
}

export function BtnIMPMainPagePortraitCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;
  // if not this far in char generation, don't alot ANY action
  if ((iCurrentProfileMode != 3) && (iCurrentProfileMode != 4) && (iCurrentProfileMode > 5)) {
    btn.uiFlags &= ~(BUTTON_CLICKED_ON);
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_PORTRAIT;
      fButtonPendingFlag = true;
    }
  }
}

export function BtnIMPMainPageVoiceCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;
  // if not this far in char generation, don't alot ANY action
  if ((iCurrentProfileMode != 4) && (iCurrentProfileMode > 5)) {
    btn.uiFlags &= ~(BUTTON_CLICKED_ON);
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_VOICE;
      fButtonPendingFlag = true;
    }
  }
}

function NextProfilingMode(): void {
  // this function will change to mode the player is in for profiling

  // if less than done
  if (iCurrentProfileMode < 5)
    iCurrentProfileMode++;

  return;
}

function CheckIfFinishedCharacterGeneration(): boolean {
  // this function checks to see if character is done character generation

  // are we done character generation
  if (iCurrentProfileMode == 5) {
    // yes
    return true;
  } else {
    // no
    return false;
  }
}

function ShadeUnSelectableButtons(): void {
  let iCounter: INT32 = 0;
  // this function looks at the status ofiCurrentProfileMode and decides which buttons
  // should be shaded ( unselectable )

  for (iCounter = iCurrentProfileMode; iCounter < 5; iCounter++) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, 13 + (iCounter)*120 + 114, 245, 13 + (iCounter + 1) * 120 + 90, 245 + 92);
    InvalidateRegion(13 + (iCounter)*120 + 114, 245, 13 + (iCounter)*120 + 114, 245 + 92);
  }

  fMarkButtonsDirtyFlag = false;
  return;
}

function UpDateIMPMainPageButtons(): void {
  // update mainpage button states
  let iCount: INT32 = 0;

  // disable all
  for (iCount = 2; iCount < 6; iCount++) {
    DisableButton(giIMPMainPageButton[iCount]);
  }

  for (iCount = 0; iCount < 4; iCount++) {
    MSYS_DisableRegion(pIMPMainPageMouseRegions[iCount]);
  }
  // enable
  switch (iCurrentProfileMode) {
    case 0:
      MSYS_EnableRegion(pIMPMainPageMouseRegions[0]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[1]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[2]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[3]);
      break;
    case (1):
      EnableButton(giIMPMainPageButton[2]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[1]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[2]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[3]);
      break;
    case (2):
      EnableButton(giIMPMainPageButton[3]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[0]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[2]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[3]);
      break;
    case (3):
      EnableButton(giIMPMainPageButton[3]);
      EnableButton(giIMPMainPageButton[4]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[0]);
      // MSYS_EnableRegion( &pIMPMainPageMouseRegions[ 1 ]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[3]);

      break;
    case (4):
      // MSYS_EnableRegion( &pIMPMainPageMouseRegions[ 1 ]);
      MSYS_EnableRegion(pIMPMainPageMouseRegions[0]);
      EnableButton(giIMPMainPageButton[3]);
      EnableButton(giIMPMainPageButton[4]);
      EnableButton(giIMPMainPageButton[5]);
      break;
  }

  return;
}

function BeginMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, so start over, else stay here and do nothing for now
  if (bExitValue == MSG_BOX_RETURN_YES) {
    iCurrentImpPage = Enum71.IMP_BEGIN;
    iCurrentProfileMode = 0;
  }

  else if (bExitValue == MSG_BOX_RETURN_OK) {
    // if ok, then we are coming from financial warning, allow continue
  }
  return;
}

function CreateMouseRegionsForIMPMainPageBasedOnCharGenStatus(): void {
  // this procedure will create masks for the char generation main page

  // mask for personality page button
  MSYS_DefineRegion(pIMPMainPageMouseRegions[0], LAPTOP_SCREEN_UL_X + 13, LAPTOP_SCREEN_WEB_UL_Y + (245), LAPTOP_SCREEN_UL_X + 13 + 115, LAPTOP_SCREEN_WEB_UL_Y + (245) + 93, MSYS_PRIORITY_HIGH + 5, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, IMPMainPageNotSelectableBtnCallback);

  // mask for attrib page button
  MSYS_DefineRegion(pIMPMainPageMouseRegions[1], LAPTOP_SCREEN_UL_X + 133, LAPTOP_SCREEN_WEB_UL_Y + (245), LAPTOP_SCREEN_UL_X + 133 + 115, LAPTOP_SCREEN_WEB_UL_Y + (245) + 93, MSYS_PRIORITY_HIGH + 5, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, IMPMainPageNotSelectableBtnCallback);

  // mask for portrait page button
  MSYS_DefineRegion(pIMPMainPageMouseRegions[2], LAPTOP_SCREEN_UL_X + 253, LAPTOP_SCREEN_WEB_UL_Y + (245), LAPTOP_SCREEN_UL_X + 253 + 115, LAPTOP_SCREEN_WEB_UL_Y + (245) + 93, MSYS_PRIORITY_HIGH + 5, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, IMPMainPageNotSelectableBtnCallback);

  // mask for voice page button
  MSYS_DefineRegion(pIMPMainPageMouseRegions[3], LAPTOP_SCREEN_UL_X + 373, LAPTOP_SCREEN_WEB_UL_Y + (245), LAPTOP_SCREEN_UL_X + 373 + 115, LAPTOP_SCREEN_WEB_UL_Y + (245) + 93, MSYS_PRIORITY_HIGH + 5, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, IMPMainPageNotSelectableBtnCallback);

  return;
}

function DestoryMouseRegionsForIMPMainPageBasedOnCharGenStatus(): void {
  // will destroy button masks for the char gen pages

  MSYS_RemoveRegion(pIMPMainPageMouseRegions[0]);

  MSYS_RemoveRegion(pIMPMainPageMouseRegions[1]);

  MSYS_RemoveRegion(pIMPMainPageMouseRegions[2]);

  MSYS_RemoveRegion(pIMPMainPageMouseRegions[3]);

  return;
}

function IMPMainPageNotSelectableBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    DoLapTopMessageBox(Enum24.MSG_BOX_IMP_STYLE, pImpPopUpStrings[4], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, BeginMessageBoxCallBack);
  }

  return;
}

function LoadCharacterPortraitForMainPage(): boolean {
  // this function will load the character's portrait, to be used on portrait button
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  if (iCurrentProfileMode >= 4) {
    // load it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP(pPlayerSelectedFaceFileNames[iPortraitNumber]);
    if (!AddVideoObject(addressof(VObjectDesc), addressof(guiCHARACTERPORTRAITFORMAINPAGE))) {
      return false;
    }

    // now specify
    SpecifyButtonIcon(giIMPMainPageButton[4], guiCHARACTERPORTRAITFORMAINPAGE, 0, 33, 23, false);
  }

  return true;
}

}
