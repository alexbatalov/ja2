namespace ja2 {

// current and last pages
export let iCurrentPortrait: INT32 = 0;
let iLastPicture: INT32 = 7;

// buttons needed for the IMP portrait screen
let giIMPPortraitButton: INT32[] /* [3] */ = createArray(3, 0);
let giIMPPortraitButtonImage: INT32[] /* [3] */ = createArray(3, 0);

// redraw protrait screen
let fReDrawPortraitScreenFlag: boolean = false;

// face index
export let iPortraitNumber: INT32 = 0;

// function definitions

export function EnterIMPPortraits(): void {
  // create buttons
  CreateIMPPortraitButtons();

  // render background
  RenderIMPPortraits();

  return;
}

export function RenderIMPPortraits(): void {
  // render background
  RenderProfileBackGround();

  // the Voices frame
  RenderPortraitFrame(191, 167);

  // render the current portrait
  RenderPortrait(200, 176);

  // indent for the text
  RenderAttrib1IndentFrame(128, 65);

  // text
  PrintImpText();

  return;
}

export function ExitIMPPortraits(): void {
  // destroy buttons for IMP portrait page
  DestroyIMPPortraitButtons();

  return;
}

export function HandleIMPPortraits(): void {
  // do we need to re write screen
  if (fReDrawPortraitScreenFlag == true) {
    RenderIMPPortraits();

    // reset redraw flag
    fReDrawPortraitScreenFlag = false;
  }
  return;
}

function RenderPortrait(sX: INT16, sY: INT16): boolean {
  // render the portrait of the current picture
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let hHandle: HVOBJECT;
  let uiGraphicHandle: UINT32;

  if (fCharacterIsMale) {
    // load it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP(pPlayerSelectedBigFaceFileNames[iCurrentPortrait]);
    if (!(uiGraphicHandle = AddVideoObject(VObjectDesc))) {
      return false;
    }

    // show it
    hHandle = GetVideoObject(uiGraphicHandle);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

    // and kick it's sorry ..umm never mind, outta here
    DeleteVideoObjectFromIndex(uiGraphicHandle);
  } else {
    // load it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP(pPlayerSelectedBigFaceFileNames[iCurrentPortrait + 8]);
    if (!(uiGraphicHandle = AddVideoObject(VObjectDesc))) {
      return false;
    }

    // show it
    hHandle = GetVideoObject(uiGraphicHandle);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X + sX, LAPTOP_SCREEN_WEB_UL_Y + sY, VO_BLT_SRCTRANSPARENCY, null);

    // and kick it's sorry ..umm never mind, outta here
    DeleteVideoObjectFromIndex(uiGraphicHandle);
  }

  return true;
}

function IncrementPictureIndex(): void {
  // cycle to next picture

  iCurrentPortrait++;

  // gone too far?
  if (iCurrentPortrait > iLastPicture) {
    iCurrentPortrait = 0;
  }

  return;
}

function DecrementPicture(): void {
  // cycle to previous picture

  iCurrentPortrait--;

  // gone too far?
  if (iCurrentPortrait < 0) {
    iCurrentPortrait = iLastPicture;
  }

  return;
}

function CreateIMPPortraitButtons(): void {
  // will create buttons need for the IMP portrait screen

  // next button
  giIMPPortraitButtonImage[0] = LoadButtonImage("LAPTOP\\voicearrows.sti", -1, 1, -1, 3, -1);
  /*giIMPPortraitButton[0] = QuickCreateButton( giIMPPortraitButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 18 ), LAPTOP_SCREEN_WEB_UL_Y + ( 184 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPortraitNextCallback );
*/
  giIMPPortraitButton[0] = CreateIconAndTextButton(giIMPPortraitButtonImage[0], pImpButtonText[13], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (343), LAPTOP_SCREEN_WEB_UL_Y + (205), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPortraitNextCallback);

  // previous button
  giIMPPortraitButtonImage[1] = LoadButtonImage("LAPTOP\\voicearrows.sti", -1, 0, -1, 2, -1);
  /*	giIMPPortraitButton[ 1 ] = QuickCreateButton( giIMPPortraitButtonImage[ 1 ], LAPTOP_SCREEN_UL_X +  ( 18 ), LAPTOP_SCREEN_WEB_UL_Y + ( 254 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPortraitPreviousCallback );
    */
  giIMPPortraitButton[1] = CreateIconAndTextButton(giIMPPortraitButtonImage[1], pImpButtonText[12], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (93), LAPTOP_SCREEN_WEB_UL_Y + (205), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPortraitPreviousCallback);

  // done button
  giIMPPortraitButtonImage[2] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  /* giIMPPortraitButton[ 2 ] = QuickCreateButton( giIMPPortraitButtonImage[ 1 ], LAPTOP_SCREEN_UL_X +  ( 349 ), LAPTOP_SCREEN_WEB_UL_Y + ( 220 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPortraitDoneCallback );
*/
  giIMPPortraitButton[2] = CreateIconAndTextButton(giIMPPortraitButtonImage[2], pImpButtonText[11], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (187), LAPTOP_SCREEN_WEB_UL_Y + (330), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPortraitDoneCallback);

  SetButtonCursor(giIMPPortraitButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPPortraitButton[1], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPPortraitButton[2], Enum317.CURSOR_WWW);
}

function DestroyIMPPortraitButtons(): void {
  // will destroy buttons created for IMP Portrait screen

  // the next button
  RemoveButton(giIMPPortraitButton[0]);
  UnloadButtonImage(giIMPPortraitButtonImage[0]);

  // the previous button
  RemoveButton(giIMPPortraitButton[1]);
  UnloadButtonImage(giIMPPortraitButtonImage[1]);

  // the done button
  RemoveButton(giIMPPortraitButton[2]);
  UnloadButtonImage(giIMPPortraitButtonImage[2]);

  return;
}

function BtnIMPPortraitNextCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // next picture!!
      IncrementPictureIndex();

      fReDrawPortraitScreenFlag = true;
    }
  }
}

function BtnIMPPortraitPreviousCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // previous picture, please!!!
      DecrementPicture();

      fReDrawPortraitScreenFlag = true;
    }
  }
}

function BtnIMPPortraitDoneCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // go to main page
      iCurrentImpPage = Enum71.IMP_MAIN_PAGE;

      // current mode now is voice
      if (iCurrentProfileMode < 4) {
        iCurrentProfileMode = 4;
      }

      // if we are already done, leave
      if (iCurrentProfileMode == 5) {
        iCurrentImpPage = Enum71.IMP_FINISH;
      }

      // grab picture number
      if (fCharacterIsMale) {
        // male
        iPortraitNumber = iCurrentPortrait;
      } else {
        // female
        iPortraitNumber = iCurrentPortrait + (8);
      }

      fButtonPendingFlag = true;
    }
  }
}

}
