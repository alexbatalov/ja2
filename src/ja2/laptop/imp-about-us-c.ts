// IMP AboutUs buttons
let giIMPAboutUsButton: INT32[] /* [1] */;
let giIMPAboutUsButtonImage: INT32[] /* [1] */;
;

function EnterIMPAboutUs(): void {
  // create buttons
  CreateIMPAboutUsButtons();

  // entry into IMP about us page
  RenderIMPAboutUs();

  return;
}

function ExitIMPAboutUs(): void {
  // exit from IMP About us page

  // delete Buttons
  DeleteIMPAboutUsButtons();

  return;
}

function RenderIMPAboutUs(): void {
  // rneders the IMP about us page

  // the background
  RenderProfileBackGround();

  // the IMP symbol
  RenderIMPSymbol(106, 1);

  // about us indent
  RenderAboutUsIndentFrame(8, 130);
  // about us indent
  RenderAboutUsIndentFrame(258, 130);

  return;
}

function HandleIMPAboutUs(): void {
  // handles the IMP about us page

  return;
}

function CreateIMPAboutUsButtons(): void {
  // this function will create the buttons needed for th IMP about us page
  // the back button button
  giIMPAboutUsButtonImage[0] = LoadButtonImage("LAPTOP\\button_3.sti", -1, 0, -1, 1, -1);
  /*giIMPAboutUsButton[0] = QuickCreateButton( giIMPAboutUsButtonImage[0], LAPTOP_SCREEN_UL_X +  426 , LAPTOP_SCREEN_WEB_UL_Y + ( 360 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPBackCallback); */

  giIMPAboutUsButton[0] = CreateIconAndTextButton(giIMPAboutUsButtonImage[0], pImpButtonText[6], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 216, LAPTOP_SCREEN_WEB_UL_Y + (360), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPBackCallback);

  SetButtonCursor(giIMPAboutUsButton[0], Enum317.CURSOR_WWW);

  return;
}

function DeleteIMPAboutUsButtons(): void {
  // this function destroys the buttons needed for the IMP about Us Page

  // the about back button
  RemoveButton(giIMPAboutUsButton[0]);
  UnloadButtonImage(giIMPAboutUsButtonImage[0]);

  return;
}

function BtnIMPBackCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP Homepage About US button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = Enum71.IMP_HOME_PAGE;
    }
  }
}
