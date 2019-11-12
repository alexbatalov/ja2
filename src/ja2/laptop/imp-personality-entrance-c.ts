namespace ja2 {

// IMP personality entrance buttons
let giIMPPersonalityEntranceButton: INT32[] /* [1] */;
let giIMPPersonalityEntranceButtonImage: INT32[] /* [1] */;

export function EnterIMPPersonalityEntrance(): void {
  // create buttons needed
  CreateIMPPersonalityEntranceButtons();

  return;
}

export function RenderIMPPersonalityEntrance(): void {
  // the background
  RenderProfileBackGround();

  // the IMP symbol
  // RenderIMPSymbol( 112, 30 );

  // indent
  RenderAvgMercIndentFrame(90, 40);
  return;
}

export function ExitIMPPersonalityEntrance(): void {
  // destroy buttons needed
  DestroyIMPPersonalityEntranceButtons();

  return;
}

export function HandleIMPPersonalityEntrance(): void {
  return;
}

function CreateIMPPersonalityEntranceButtons(): void {
  // this function will create the buttons needed for the IMP personality Page

  // ths begin button
  giIMPPersonalityEntranceButtonImage[0] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  /*giIMPPersonalityEntranceButton[0] = QuickCreateButton( giIMPPersonalityEntranceButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 136 ), LAPTOP_SCREEN_WEB_UL_Y + ( 314 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPersonalityEntranceDoneCallback);
*/
  giIMPPersonalityEntranceButton[0] = CreateIconAndTextButton(giIMPPersonalityEntranceButtonImage[0], pImpButtonText[1], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (136), LAPTOP_SCREEN_WEB_UL_Y + (314), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityEntranceDoneCallback);

  SetButtonCursor(giIMPPersonalityEntranceButton[0], Enum317.CURSOR_WWW);

  return;
}

function DestroyIMPPersonalityEntranceButtons(): void {
  // this function will destroy the buttons needed for the IMP personality page

  // the begin button
  RemoveButton(giIMPPersonalityEntranceButton[0]);
  UnloadButtonImage(giIMPPersonalityEntranceButtonImage[0]);

  return;
}

function BtnIMPPersonalityEntranceDoneCallback(btn: GUI_BUTTON, reason: INT32): void {
  // btn callback for IMP Begin Screen done button
  if (!(btn.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);
      // done with begin screen, next screen
      iCurrentImpPage = Enum71.IMP_PERSONALITY_QUIZ;
      fButtonPendingFlag = true;
    }
  }
}

}
