namespace ja2 {

// internal variables.
let iMsgBoxNum: INT32;
let iMsgBoxOkImg: INT32;
let iMsgBoxCancelImg: INT32;
let iMsgBoxBgrnd: INT32;
let iMsgBoxOk: INT32;
let iMsgBoxCancel: INT32;
let MsgBoxRect: SGPRect;

export let gfMessageBoxResult: boolean = false;
export let gubMessageBoxStatus: UINT8 = Enum52.MESSAGEBOX_NONE;

export function CreateMessageBox(wzString: Pointer<UINT16>): void {
  let sPixLen: INT16;
  let sStartX: INT16;
  let sStartY: INT16;

  sPixLen = StringPixLength(wzString, gpLargeFontType1) + 10;
  if (sPixLen > 600)
    sPixLen = 600;

  sStartX = (640 - sPixLen) / 2;
  sStartY = (480 - 96) / 2;

  gfMessageBoxResult = false;

  // Fake button for background w/ text
  iMsgBoxBgrnd = CreateTextButton(wzString, gpLargeFontType1, FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, sStartX, sStartY, sPixLen, 96, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  DisableButton(iMsgBoxBgrnd);
  SpecifyDisabledButtonStyle(iMsgBoxBgrnd, Enum29.DISABLED_STYLE_NONE);

  iMsgBoxOkImg = LoadButtonImage("EDITOR//ok.sti", 0, 1, 2, 3, 4);
  iMsgBoxCancelImg = LoadButtonImage("EDITOR//cancel.sti", 0, 1, 2, 3, 4);

  iMsgBoxOk = QuickCreateButton(iMsgBoxOkImg, (sStartX + (sPixLen / 2) - 35), (sStartY + 58), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BUTTON_NO_CALLBACK, MsgBoxOkClkCallback);

  iMsgBoxCancel = QuickCreateButton(iMsgBoxCancelImg, (sStartX + (sPixLen / 2) + 5), (sStartY + 58), BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BUTTON_NO_CALLBACK, MsgBoxCnclClkCallback);

  MsgBoxRect.iLeft = sStartX;
  MsgBoxRect.iTop = sStartY;
  MsgBoxRect.iRight = sStartX + sPixLen;
  MsgBoxRect.iBottom = sStartY + 96;

  RestrictMouseCursor(addressof(MsgBoxRect));

  gubMessageBoxStatus = Enum52.MESSAGEBOX_WAIT;
}

export function MessageBoxHandled(): boolean {
  let DummyEvent: InputAtom;

  while (DequeueEvent(addressof(DummyEvent))) {
    if (DummyEvent.usEvent == KEY_DOWN) {
      switch (DummyEvent.usParam) {
        case ENTER:
        case 'y':
        case 'Y':
          gubMessageBoxStatus = Enum52.MESSAGEBOX_DONE;
          gfMessageBoxResult = true;
          break;
        case ESC:
        case 'n':
        case 'N':
          gubMessageBoxStatus = Enum52.MESSAGEBOX_DONE;
          gfMessageBoxResult = false;
          break;
      }
    }
  }

  if (gubMessageBoxStatus == Enum52.MESSAGEBOX_DONE) {
    while (DequeueEvent(addressof(DummyEvent)))
      continue;
  }
  MarkButtonsDirty();
  RenderButtons();
  //	InvalidateScreen( );
  //	ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  return gubMessageBoxStatus == Enum52.MESSAGEBOX_DONE;
}

export function RemoveMessageBox(): void {
  FreeMouseCursor();
  RemoveButton(iMsgBoxCancel);
  RemoveButton(iMsgBoxOk);
  RemoveButton(iMsgBoxBgrnd);
  UnloadButtonImage(iMsgBoxOkImg);
  UnloadButtonImage(iMsgBoxCancelImg);
  gubMessageBoxStatus = Enum52.MESSAGEBOX_NONE;
}

//----------------------------------------------------------------------------------------------
//	Quick Message Box button callback functions.
//----------------------------------------------------------------------------------------------

function MsgBoxOkClkCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    butn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubMessageBoxStatus = Enum52.MESSAGEBOX_DONE;
    gfMessageBoxResult = true;
  }
}

function MsgBoxCnclClkCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    butn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubMessageBoxStatus = Enum52.MESSAGEBOX_DONE;
    gfMessageBoxResult = false;
  }
}

//----------------------------------------------------------------------------------------------
//	End of the quick message box callback functions
//----------------------------------------------------------------------------------------------

}
