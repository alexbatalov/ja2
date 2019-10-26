namespace ja2 {

// current and last pages
export let iCurrentVoices: INT32 = 0;
let iLastVoice: INT32 = 2;

// INT32 iVoiceId = 0;

let uiVocVoiceSound: UINT32 = 0;
// buttons needed for the IMP Voices screen
let giIMPVoicesButton: INT32[] /* [3] */;
let giIMPVoicesButtonImage: INT32[] /* [3] */;

// hacks to be removeed later
let fVoiceAVisited: boolean = false;
let fVoiceBVisited: boolean = false;
let fVoiceCVisited: boolean = false;

// redraw protrait screen
let fReDrawVoicesScreenFlag: boolean = false;

// the portrait region, for player to click on and re-hear voice
let gVoicePortraitRegion: MOUSE_REGION;

export function EnterIMPVoices(): void {
  fVoiceAVisited = false;
  fVoiceBVisited = false;
  fVoiceCVisited = false;

  // create buttons
  CreateIMPVoicesButtons();

  // create mouse regions
  CreateIMPVoiceMouseRegions();

  // render background
  RenderIMPVoices();

  // play voice once
  uiVocVoiceSound = PlayVoice();

  return;
}

export function RenderIMPVoices(): void {
  // render background
  RenderProfileBackGround();

  // the Voices frame
  RenderPortraitFrame(191, 167);

  // the sillouette
  RenderLargeSilhouette(200, 176);

  // indent for the text
  RenderAttrib1IndentFrame(128, 65);

  // render voice index value
  RenderVoiceIndex();

  // text
  PrintImpText();

  return;
}

export function ExitIMPVoices(): void {
  // destroy buttons for IMP Voices page
  DestroyIMPVoicesButtons();

  // destroy mouse regions for this screen
  DestroyIMPVoiceMouseRegions();

  return;
}

export function HandleIMPVoices(): void {
  // do we need to re write screen
  if (fReDrawVoicesScreenFlag == true) {
    RenderIMPVoices();

    // reset redraw flag
    fReDrawVoicesScreenFlag = false;
  }
  return;
}

function IncrementVoice(): void {
  // cycle to next voice

  iCurrentVoices++;

  // gone too far?
  if (iCurrentVoices > iLastVoice) {
    iCurrentVoices = 0;
  }

  return;
}

function DecrementVoice(): void {
  // cycle to previous voice

  iCurrentVoices--;

  // gone too far?
  if (iCurrentVoices < 0) {
    iCurrentVoices = iLastVoice;
  }

  return;
}

function CreateIMPVoicesButtons(): void {
  // will create buttons need for the IMP Voices screen

  // next button
  giIMPVoicesButtonImage[0] = LoadButtonImage("LAPTOP\\voicearrows.sti", -1, 1, -1, 3, -1);
  /*giIMPVoicesButton[0] = QuickCreateButton( giIMPVoicesButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 18 ), LAPTOP_SCREEN_WEB_UL_Y + ( 184 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPVoicesNextCallback );
*/
  giIMPVoicesButton[0] = CreateIconAndTextButton(giIMPVoicesButtonImage[0], pImpButtonText[13], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (343), LAPTOP_SCREEN_WEB_UL_Y + (205), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPVoicesNextCallback);

  // previous button
  giIMPVoicesButtonImage[1] = LoadButtonImage("LAPTOP\\voicearrows.sti", -1, 0, -1, 2, -1);
  /*	giIMPVoicesButton[ 1 ] = QuickCreateButton( giIMPVoicesButtonImage[ 1 ], LAPTOP_SCREEN_UL_X +  ( 18 ), LAPTOP_SCREEN_WEB_UL_Y + ( 254 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPVoicesPreviousCallback );
    */
  giIMPVoicesButton[1] = CreateIconAndTextButton(giIMPVoicesButtonImage[1], pImpButtonText[12], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (93), LAPTOP_SCREEN_WEB_UL_Y + (205), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPVoicesPreviousCallback);

  // done button
  giIMPVoicesButtonImage[2] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  /* giIMPVoicesButton[ 2 ] = QuickCreateButton( giIMPVoicesButtonImage[ 1 ], LAPTOP_SCREEN_UL_X +  ( 349 ), LAPTOP_SCREEN_WEB_UL_Y + ( 220 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPVoicesDoneCallback );
*/
  giIMPVoicesButton[2] = CreateIconAndTextButton(giIMPVoicesButtonImage[2], pImpButtonText[11], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (187), LAPTOP_SCREEN_WEB_UL_Y + (330), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPVoicesDoneCallback);

  SetButtonCursor(giIMPVoicesButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPVoicesButton[1], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPVoicesButton[2], Enum317.CURSOR_WWW);
}

function DestroyIMPVoicesButtons(): void {
  // will destroy buttons created for IMP Voices screen

  // the next button
  RemoveButton(giIMPVoicesButton[0]);
  UnloadButtonImage(giIMPVoicesButtonImage[0]);

  // the previous button
  RemoveButton(giIMPVoicesButton[1]);
  UnloadButtonImage(giIMPVoicesButtonImage[1]);

  // the done button
  RemoveButton(giIMPVoicesButton[2]);
  UnloadButtonImage(giIMPVoicesButtonImage[2]);

  return;
}

function BtnIMPVoicesNextCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // next voice!!
      IncrementVoice();
      // play voice
      if (!SoundIsPlaying(uiVocVoiceSound)) {
        uiVocVoiceSound = PlayVoice();
      } else {
        SoundStop(uiVocVoiceSound);
        uiVocVoiceSound = PlayVoice();
      }

      fReDrawVoicesScreenFlag = true;
    }
  }
}

function BtnIMPVoicesPreviousCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // previous voice, please!!!
      DecrementVoice();
      // play voice
      if (!SoundIsPlaying(uiVocVoiceSound)) {
        uiVocVoiceSound = PlayVoice();
      } else {
        SoundStop(uiVocVoiceSound);
        uiVocVoiceSound = PlayVoice();
      }

      fReDrawVoicesScreenFlag = true;
    }
  }
}

function BtnIMPVoicesDoneCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // go to main page
      iCurrentImpPage = Enum71.IMP_MAIN_PAGE;

      // if we are already done, leave
      if (iCurrentProfileMode == 5) {
        iCurrentImpPage = Enum71.IMP_FINISH;
      }

      // current mode now is voice
      else if (iCurrentProfileMode < 4) {
        iCurrentProfileMode = 4;
      } else if (iCurrentProfileMode == 4) {
        // all done profiling
        iCurrentProfileMode = 5;
        iCurrentImpPage = Enum71.IMP_FINISH;
      }

      // set voice id, to grab character slot
      if (fCharacterIsMale == true) {
        LaptopSaveInfo.iVoiceId = iCurrentVoices;
      } else {
        LaptopSaveInfo.iVoiceId = iCurrentVoices + 3;
      }

      // set button up image  pending
      fButtonPendingFlag = true;
    }
  }
}

export function PlayVoice(): UINT32 {
  //	CHAR16 sString[ 64 ];

  // gender?

  if (fCharacterIsMale == true) {
    switch (iCurrentVoices) {
      case (0):
        // fVoiceAVisited = TRUE;
        // swprintf( sString, L"Voice # %d is not done yet", iCurrentVoices + 1 );
        // DoLapTopSystemMessageBox( MSG_BOX_LAPTOP_DEFAULT, sString, LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL );
        return PlayJA2SampleFromFile("Speech\\051_001.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
        break;
      case (1):
        return PlayJA2SampleFromFile("Speech\\052_001.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
        break;
      case (2):
        return PlayJA2SampleFromFile("Speech\\053_001.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
        break;
    }
  } else {
    switch (iCurrentVoices) {
      case (0):
        //	swprintf( sString, L"Voice # %d is not done yet", iCurrentVoices + 1 );
        // DoLapTopSystemMessageBox( MSG_BOX_LAPTOP_DEFAULT, sString, LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL );
        return PlayJA2SampleFromFile("Speech\\054_001.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

        break;
      case (1):
        return PlayJA2SampleFromFile("Speech\\055_001.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
        break;
      case (2):
        return PlayJA2SampleFromFile("Speech\\056_001.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
        break;
    }
  }
  return 0;
}

function CreateIMPVoiceMouseRegions(): void {
  // will create mouse regions needed for the IMP voices page
  MSYS_DefineRegion(addressof(gVoicePortraitRegion), LAPTOP_SCREEN_UL_X + 200, LAPTOP_SCREEN_WEB_UL_Y + 176, LAPTOP_SCREEN_UL_X + 200 + 100, LAPTOP_SCREEN_WEB_UL_Y + 176 + 100, MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, IMPPortraitRegionButtonCallback);

  MSYS_AddRegion(addressof(gVoicePortraitRegion));

  return;
}

function DestroyIMPVoiceMouseRegions(): void {
  // will destroy already created mouse reiogns for IMP voices page
  MSYS_RemoveRegion(addressof(gVoicePortraitRegion));

  return;
}

function IMPPortraitRegionButtonCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // callback handler for imp portrait region button events

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (!SoundIsPlaying(uiVocVoiceSound)) {
      uiVocVoiceSound = PlayVoice();
    }
  }

  return;
}

function RenderVoiceIndex(): void {
  let sString: CHAR16[] /* [32] */;
  let sX: INT16;
  let sY: INT16;

  // render the voice index value on the the blank portrait
  swprintf(sString, "%s %d", pIMPVoicesStrings[0], iCurrentVoices + 1);

  FindFontCenterCoordinates(290 + LAPTOP_UL_X, 0, 100, 0, sString, FONT12ARIAL(), addressof(sX), addressof(sY));

  SetFont(FONT12ARIAL());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  mprintf(sX, 320, sString);

  return;
}

}
