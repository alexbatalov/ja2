namespace ja2 {

// min time btween frames of animation
const ANIMATE_MIN_TIME = 200;

// buttons
let giIMPFinishButton: INT32[] /* [6] */;
let giIMPFinishButtonImage: INT32[] /* [6] */;

// we are in fact done
export let fFinishedCharGeneration: boolean = false;

// portrait position
let sFaceX: INT16 = 253;
let sFaceY: INT16 = 245;

// what voice are we playing?
let uiVoiceSound: UINT32 = 0;

// image handle
let guiCHARACTERPORTRAIT: UINT32;

export function EnterIMPFinish(): void {
  // load graphic for portrait
  LoadCharacterPortrait();

  //	CREATE buttons for IMP finish screen
  CreateIMPFinishButtons();

  // set review mode
  fReviewStats = true;
  iCurrentProfileMode = 5;

  // note that we are in fact done char generation
  fFinishedCharGeneration = true;

  return;
}

export function RenderIMPFinish(): void {
  // the background
  RenderProfileBackGround();

  // render merc fullname
  RenderCharFullName();

  // indent for text
  RenderBeginIndent(110, 50);

  return;
}

export function ExitIMPFinish(): void {
  // remove buttons for IMP finish screen
  DeleteIMPFinishButtons();

  // get rid of graphic for portrait
  DestroyCharacterPortrait();

  return;
}

export function HandleIMPFinish(): void {
  return;
}

function CreateIMPFinishButtons(): void {
  let sString: CHAR16[] /* [128] */;

  // this function will create the buttons needed for th IMP about us page
  // the start over button button
  giIMPFinishButtonImage[0] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  /*giIMPFinishButton[0] = QuickCreateButton( giIMPFinishButtonImage[0], LAPTOP_SCREEN_UL_X + 136 , LAPTOP_SCREEN_WEB_UL_Y + ( 114 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPFinishStartOverCallback);
*/
  giIMPFinishButton[0] = CreateIconAndTextButton(giIMPFinishButtonImage[0], pImpButtonText[7], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 136, LAPTOP_SCREEN_WEB_UL_Y + (174), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPFinishStartOverCallback);

  // the done button
  giIMPFinishButtonImage[1] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  /*	giIMPFinishButton[1] = QuickCreateButton( giIMPFinishButtonImage[1], LAPTOP_SCREEN_UL_X + 136 , LAPTOP_SCREEN_WEB_UL_Y + ( 174 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPFinishDoneCallback);
  */
  giIMPFinishButton[1] = CreateIconAndTextButton(giIMPFinishButtonImage[1], pImpButtonText[6], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 136, LAPTOP_SCREEN_WEB_UL_Y + (114), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPFinishDoneCallback);

  // the personality button
  giIMPFinishButtonImage[2] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);

  /*	giIMPFinishButton[2] = QuickCreateButton( giIMPFinishButtonImage[2], LAPTOP_SCREEN_UL_X + 13 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPFinishPersonalityCallback);
  */
  giIMPFinishButton[2] = CreateIconAndTextButton(giIMPFinishButtonImage[2], pImpButtonText[2], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 13, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPFinishPersonalityCallback);

  SpecifyButtonIcon(giIMPFinishButton[2], guiANALYSE, 0, 33, 23, false);

  // the attribs button
  giIMPFinishButtonImage[3] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);
  /*	giIMPFinishButton[3] = QuickCreateButton( giIMPFinishButtonImage[3], LAPTOP_SCREEN_UL_X + 133 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPFinishAttributesCallback);
  */
  giIMPFinishButton[3] = CreateIconAndTextButton(giIMPFinishButtonImage[3], pImpButtonText[3], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 133, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPFinishAttributesCallback);

  SpecifyButtonIcon(giIMPFinishButton[3], guiATTRIBUTEGRAPH, 0, 25, 25, false);

  // the portrait button
  giIMPFinishButtonImage[4] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);
  /*	giIMPFinishButton[4] = QuickCreateButton( giIMPFinishButtonImage[4], LAPTOP_SCREEN_UL_X + 253 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPFinishPortraitCallback);
   */
  giIMPFinishButton[4] = CreateIconAndTextButton(giIMPFinishButtonImage[4], pImpButtonText[4], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 253, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPagePortraitCallback);

  SpecifyButtonIcon(giIMPFinishButton[4], guiCHARACTERPORTRAIT, 0, 33, 23, false);

  swprintf(sString, pImpButtonText[5], iCurrentVoices + 1);

  // the voice button
  giIMPFinishButtonImage[5] = LoadButtonImage("LAPTOP\\button_8.sti", -1, 0, -1, 1, -1);
  /* giIMPFinishButton[5] = QuickCreateButton( giIMPFinishButtonImage[5], LAPTOP_SCREEN_UL_X + 373 , LAPTOP_SCREEN_WEB_UL_Y + ( 245 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPFinishVoiceCallback);
*/
  giIMPFinishButton[5] = CreateIconAndTextButton(giIMPFinishButtonImage[5], sString, FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 373, LAPTOP_SCREEN_WEB_UL_Y + (245), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPMainPageVoiceCallback);

  SpecifyButtonIcon(giIMPFinishButton[5], guiSMALLSILHOUETTE, 0, 33, 23, false);

  SetButtonCursor(giIMPFinishButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPFinishButton[1], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPFinishButton[2], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPFinishButton[3], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPFinishButton[4], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPFinishButton[5], Enum317.CURSOR_WWW);

  return;
}

function DeleteIMPFinishButtons(): void {
  // this function destroys the buttons needed for the IMP about Us Page

  // the back  button
  RemoveButton(giIMPFinishButton[0]);
  UnloadButtonImage(giIMPFinishButtonImage[0]);

  // begin profiling button
  RemoveButton(giIMPFinishButton[1]);
  UnloadButtonImage(giIMPFinishButtonImage[1]);

  // begin personna button
  RemoveButton(giIMPFinishButton[2]);
  UnloadButtonImage(giIMPFinishButtonImage[2]);

  // begin attribs button
  RemoveButton(giIMPFinishButton[3]);
  UnloadButtonImage(giIMPFinishButtonImage[3]);

  // begin portrait button
  RemoveButton(giIMPFinishButton[4]);
  UnloadButtonImage(giIMPFinishButtonImage[4]);

  // begin voice button
  RemoveButton(giIMPFinishButton[5]);
  UnloadButtonImage(giIMPFinishButtonImage[5]);

  return;
}

function BtnIMPFinishStartOverCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP Homepage About US button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      DoLapTopMessageBox(Enum24.MSG_BOX_IMP_STYLE, pImpPopUpStrings[1], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_YESNO, FinishMessageBoxCallBack);
    }
  }
}

function BtnIMPFinishDoneCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_CONFIRM;
      CreateACharacterFromPlayerEnteredStats();
      fButtonPendingFlag = true;
      iCurrentProfileMode = 0;
      fFinishedCharGeneration = false;
      // ResetCharacterStats( );
    }
  }
}

function BtnIMPFinishPersonalityCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for Main Page Begin Profiling
  /* static */ let fAnimateFlag: boolean = false;
  /* static */ let uiBaseTime: UINT32 = 0;
  /* static */ let fState: boolean = 0;
  let iDifference: INT32 = 0;

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
    uiBaseTime = GetJA2Clock();
    SpecifyButtonText(giIMPFinishButton[2], pImpButtonText[23]);
    fAnimateFlag = true;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fButtonPendingFlag = true;
      uiBaseTime = 0;
      fAnimateFlag = false;
      SpecifyButtonText(giIMPFinishButton[2], pImpButtonText[2]);
    }
  }

  // get amount of time between callbacks
  iDifference = GetJA2Clock() - uiBaseTime;

  if (fAnimateFlag) {
    if (iDifference > ANIMATE_MIN_TIME) {
      uiBaseTime = GetJA2Clock();
      if (fState) {
        SpecifyButtonIcon(giIMPFinishButton[2], guiANALYSE, 1, 33, 23, false);

        fState = false;
      } else {
        SpecifyButtonIcon(giIMPFinishButton[2], guiANALYSE, 0, 33, 23, false);

        fState = true;
      }
    }
  }
}

function BtnIMPFinishAttributesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;
  // if not this far in char generation, don't alot ANY action
  if (iCurrentProfileMode < 2) {
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_ATTRIBUTE_PAGE;
      fButtonPendingFlag = true;
      SpecifyButtonText(giIMPFinishButton[2], pImpButtonText[2]);
    }
  }
}

function BtnIMPFinishPortraitCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;
  // if not this far in char generation, don't alot ANY action
  if (iCurrentProfileMode < 3) {
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
    sFaceX = 253;
    sFaceY = 247;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      sFaceX = 253;
      sFaceY = 245;
    }
  }
}

function BtnIMPFinishVoiceCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for Main Page Begin Profiling

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;
  // if not this far in char generation, don't alot ANY action
  if (iCurrentProfileMode < 4) {
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    fButtonPendingFlag = true;
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // play voice
      if (!SoundIsPlaying(uiVoiceSound)) {
        uiVoiceSound = PlayVoice();
      }
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fButtonPendingFlag = true;
    }
  }
}

function RenderCharProfileFinishFace(): boolean {
  // render the portrait of the current picture
  let VObjectDesc: VOBJECT_DESC;
  let hHandle: HVOBJECT;
  let uiGraphicHandle: UINT32;

  if (fCharacterIsMale == true) {
    switch (LaptopSaveInfo.iVoiceId) {
      case (0):
        // first portrait

        // load it
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        FilenameForBPP("Faces\\SmallFaces\\00.sti", VObjectDesc.ImageFile);
        CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiGraphicHandle)));

        // show it
        GetVideoObject(addressof(hHandle), uiGraphicHandle);
        BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sFaceX, LAPTOP_SCREEN_WEB_UL_Y + sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // and kick it's sorry ..umm never mind, outta here
        DeleteVideoObjectFromIndex(uiGraphicHandle);

        break;
      case (1):
        // first portrait

        // load it
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        FilenameForBPP("Faces\\SmallFaces\\01.sti", VObjectDesc.ImageFile);
        CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiGraphicHandle)));

        // show it
        GetVideoObject(addressof(hHandle), uiGraphicHandle);
        BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sFaceX, LAPTOP_SCREEN_WEB_UL_Y + sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // and kick it's sorry ..umm never mind, outta here
        DeleteVideoObjectFromIndex(uiGraphicHandle);

        break;
      case (2):
        // first portrait

        // load it
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        FilenameForBPP("Faces\\SmallFaces\\02.sti", VObjectDesc.ImageFile);
        CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiGraphicHandle)));

        // show it
        GetVideoObject(addressof(hHandle), uiGraphicHandle);
        BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sFaceX, LAPTOP_SCREEN_WEB_UL_Y + sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // and kick it's sorry ..umm never mind, outta here
        DeleteVideoObjectFromIndex(uiGraphicHandle);

        break;
    }
  } else {
    switch (LaptopSaveInfo.iVoiceId) {
      case (0):
        // first portrait

        // load it
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        FilenameForBPP("Faces\\SmallFaces\\03.sti", VObjectDesc.ImageFile);
        CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiGraphicHandle)));

        // show it
        GetVideoObject(addressof(hHandle), uiGraphicHandle);
        BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sFaceX, LAPTOP_SCREEN_WEB_UL_Y + sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // and kick it's sorry ..umm never mind, outta here
        DeleteVideoObjectFromIndex(uiGraphicHandle);

        break;
      case (1):
        // first portrait

        // load it
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        FilenameForBPP("Faces\\SmallFaces\\04.sti", VObjectDesc.ImageFile);
        CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiGraphicHandle)));

        // show it
        GetVideoObject(addressof(hHandle), uiGraphicHandle);
        BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sFaceX, LAPTOP_SCREEN_WEB_UL_Y + sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // and kick it's sorry ..umm never mind, outta here
        DeleteVideoObjectFromIndex(uiGraphicHandle);

        break;
      case (2):
        // first portrait

        // load it
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        FilenameForBPP("Faces\\SmallFaces\\05.sti", VObjectDesc.ImageFile);
        CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiGraphicHandle)));

        // show it
        GetVideoObject(addressof(hHandle), uiGraphicHandle);
        BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sFaceX, LAPTOP_SCREEN_WEB_UL_Y + sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // and kick it's sorry ..umm never mind, outta here
        DeleteVideoObjectFromIndex(uiGraphicHandle);

        break;
    }
  }

  // render the nickname
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFont(FONT12ARIAL());

  mprintf(253, 350, pNickName);

  return true;
}

function RenderCharFullName(): void {
  let sString: CHAR16[] /* [64] */;
  let sX: INT16;
  let sY: INT16;

  // render the characters full name
  SetFont(FONT14ARIAL());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  swprintf(sString, pIMPFinishStrings[0], pFullName);

  FindFontCenterCoordinates(LAPTOP_SCREEN_UL_X, 0, LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X, 0, sString, FONT14ARIAL(), addressof(sX), addressof(sY));
  mprintf(sX, LAPTOP_SCREEN_WEB_DELTA_Y + 33, sString);
  return;
}

function LoadCharacterPortrait(): boolean {
  // this function will load the character's portrait, to be used on portrait button
  let VObjectDesc: VOBJECT_DESC;

  // load it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP(pPlayerSelectedFaceFileNames[iPortraitNumber], VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiCHARACTERPORTRAIT)));

  return true;
}

function DestroyCharacterPortrait(): void {
  // remove the portrait that was loaded by loadcharacterportrait
  DeleteVideoObjectFromIndex(guiCHARACTERPORTRAIT);

  return;
}

function FinishMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, so start over, else stay here and do nothing for now
  if (bExitValue == MSG_BOX_RETURN_YES) {
    iCurrentImpPage = Enum71.IMP_HOME_PAGE;
    fButtonPendingFlag = true;
    iCurrentProfileMode = 0;
    fFinishedCharGeneration = false;
    ResetCharacterStats();
  }

  if (bExitValue == MSG_BOX_RETURN_NO) {
    MarkButtonsDirty();
  }

  return;
}

}
