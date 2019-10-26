namespace ja2 {

// the buttons
let giIMPAttributeEntranceButtonImage: UINT32[] /* [1] */;
let giIMPAttributeEntranceButton: UINT32[] /* [1] */;

export function EnterIMPAttributeEntrance(): void {
  CreateIMPAttributeEntranceButtons();

  return;
}

export function RenderIMPAttributeEntrance(): void {
  // the background
  RenderProfileBackGround();

  // avg merc indent
  RenderAvgMercIndentFrame(90, 40);

  return;
}

export function ExitIMPAttributeEntrance(): void {
  // destroy the finish buttons
  DestroyIMPAttributeEntranceButtons();

  return;
}

export function HandleIMPAttributeEntrance(): void {
  return;
}

function CreateIMPAttributeEntranceButtons(): void {
  // the begin button
  giIMPAttributeEntranceButtonImage[0] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  /*
  giIMPAttributeEntranceButton[0] = QuickCreateButton( giIMPAttributeEntranceButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 136 ), LAPTOP_SCREEN_WEB_UL_Y + ( 314 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPAttributeBeginCallback ); */

  giIMPAttributeEntranceButton[0] = CreateIconAndTextButton(giIMPAttributeEntranceButtonImage[0], pImpButtonText[13], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (136), LAPTOP_SCREEN_WEB_UL_Y + (314), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPAttributeBeginCallback);

  SetButtonCursor(giIMPAttributeEntranceButton[0], Enum317.CURSOR_WWW);
  return;
}

function DestroyIMPAttributeEntranceButtons(): void {
  // this function will destroy the buttons needed for the IMP attrib enter page

  // the begin  button
  RemoveButton(giIMPAttributeEntranceButton[0]);
  UnloadButtonImage(giIMPAttributeEntranceButtonImage[0]);

  return;
}

function BtnIMPAttributeBeginCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP attrbite begin button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_ATTRIBUTE_PAGE;
      fButtonPendingFlag = true;
    }
  }
}

}
