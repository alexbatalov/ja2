let GlowColorsList: INT32[][] /* [][3] */ = [
  [ 0, 0, 0 ],
  [ 0, 25, 0 ],
  [ 0, 50, 0 ],
  [ 0, 75, 0 ],
  [ 0, 100, 0 ],
  [ 0, 125, 0 ],
  [ 0, 150, 0 ],
  [ 0, 175, 0 ],
  [ 0, 200, 0 ],
  [ 0, 225, 0 ],
  [ 0, 255, 0 ],
];

// position defines
const IMP_PLAYER_ACTIVATION_STRING_X = LAPTOP_SCREEN_UL_X + 261;
const IMP_PLAYER_ACTIVATION_STRING_Y = LAPTOP_SCREEN_WEB_UL_Y + 336;
const CURSOR_Y = IMP_PLAYER_ACTIVATION_STRING_Y - 5;
const CURSOR_HEIGHT = () => GetFontHeight(FONT14ARIAL()) + 6;

// IMP homepage buttons
let giIMPHomePageButton: INT32[] /* [1] */;
let giIMPHomePageButtonImage: INT32[] /* [1] */;

// the player activation string
let pPlayerActivationString: CHAR16[] /* [32] */;

// position within player activation string
let iStringPos: INT32 = 0;
let uiCursorPosition: UINT16 = IMP_PLAYER_ACTIVATION_STRING_X;

// has a new char been added or deleted?
let fNewCharInActivationString: BOOLEAN = FALSE;

function EnterImpHomePage(): void {
  // upon entry to Imp home page
  memset(pPlayerActivationString, 0, sizeof(pPlayerActivationString));

  // reset string position
  iStringPos = 0;

  // reset activation  cursor position
  uiCursorPosition = IMP_PLAYER_ACTIVATION_STRING_X;

  // load buttons
  CreateIMPHomePageButtons();

  // we have now vsisited IMP, reset fact we haven't
  fNotVistedImpYet = FALSE;

  // render screen once
  RenderImpHomePage();
  return;
}

function RenderImpHomePage(): void {
  // the background
  RenderProfileBackGround();

  // the IMP symbol
  RenderIMPSymbol(107, 45);

  // the second button image
  RenderButton2Image(134, 314);

  // render the indents

  // activation indents
  RenderActivationIndent(257, 328);

  // the two font page indents
  RenderFrontPageIndent(3, 64);
  RenderFrontPageIndent(396, 64);

  // render the  activation string
  DisplayPlayerActivationString();

  return;
}

function ExitImpHomePage(): void {
  // remove buttons
  RemoveIMPHomePageButtons();

  return;
}

function HandleImpHomePage(): void {
  // handle keyboard input for this screen
  GetPlayerKeyBoardInputForIMPHomePage();

  // has a new char been added to activation string
  if (fNewCharInActivationString) {
    // display string
    DisplayPlayerActivationString();
  }

  // render the cursor
  DisplayActivationStringCursor();

  return;
}

function DisplayPlayerActivationString(): void {
  // this function will grab the string that the player will enter for activation
  let iCounter: INT32 = 0;

  // player gone too far, move back
  if (iStringPos > 64) {
    iStringPos = 64;
  }

  // restore background
  RenderActivationIndent(257, 328);

  // setup the font stuff
  SetFont(FONT14ARIAL);
  SetFontForeground(184);
  SetFontBackground(FONT_BLACK);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);
  mprintf(IMP_PLAYER_ACTIVATION_STRING_X, IMP_PLAYER_ACTIVATION_STRING_Y, pPlayerActivationString);

  fNewCharInActivationString = FALSE;
  fReDrawScreenFlag = TRUE;
  return;
}

function DisplayActivationStringCursor(): void {
  // this procdure will draw the activation string cursor on the screen at position cursorx cursory
  let uiDestPitchBYTES: UINT32;
  /* static */ let uiBaseTime: UINT32 = 0;
  let uiDeltaTime: UINT32 = 0;
  let pDestBuf: Pointer<UINT8>;
  /* static */ let iCurrentState: UINT32 = 0;
  /* static */ let fIncrement: BOOLEAN = TRUE;

  if (uiBaseTime == 0) {
    uiBaseTime = GetJA2Clock();
  }

  // get difference
  uiDeltaTime = GetJA2Clock() - uiBaseTime;

  // if difference is long enough, rotate colors
  if (uiDeltaTime > MIN_GLOW_DELTA) {
    if (iCurrentState == 10) {
      // start rotating downward
      fIncrement = FALSE;
    }
    if (iCurrentState == 0) {
      // rotate colors upward
      fIncrement = TRUE;
    }
    // if increment upward, increment iCurrentState
    if (fIncrement) {
      iCurrentState++;
    } else {
      // else downwards
      iCurrentState--;
    }
    // reset basetime to current clock
    uiBaseTime = GetJA2Clock();
  }

  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // draw line in current state
  LineDraw(TRUE, uiCursorPosition, CURSOR_Y, uiCursorPosition, CURSOR_Y + CURSOR_HEIGHT, Get16BPPColor(FROMRGB(GlowColorsList[iCurrentState][0], GlowColorsList[iCurrentState][1], GlowColorsList[iCurrentState][2])), pDestBuf);

  // unlock frame buffer
  UnLockVideoSurface(FRAME_BUFFER);

  InvalidateRegion(uiCursorPosition, CURSOR_Y, uiCursorPosition + 1, CURSOR_Y + CURSOR_HEIGHT + 1);

  return;
}

function GetPlayerKeyBoardInputForIMPHomePage(): void {
  let InputEvent: InputAtom;
  let MousePos: POINT;

  GetCursorPos(&MousePos);

  while (DequeueEvent(&InputEvent) == TRUE) {
    // HOOK INTO MOUSE HOOKS
    /*
    switch(InputEvent.usEvent)
{
            case LEFT_BUTTON_DOWN:
                    MouseSystemHook(LEFT_BUTTON_DOWN, (INT16)MousePos.x, (INT16)MousePos.y,_LeftButtonDown, _RightButtonDown);
                    break;
            case LEFT_BUTTON_UP:
                    MouseSystemHook(LEFT_BUTTON_UP, (INT16)MousePos.x, (INT16)MousePos.y ,_LeftButtonDown, _RightButtonDown);
                    break;
            case RIGHT_BUTTON_DOWN:
                    MouseSystemHook(RIGHT_BUTTON_DOWN, (INT16)MousePos.x, (INT16)MousePos.y,_LeftButtonDown, _RightButtonDown);
                    break;
            case RIGHT_BUTTON_UP:
                    MouseSystemHook(RIGHT_BUTTON_UP, (INT16)MousePos.x, (INT16)MousePos.y,_LeftButtonDown, _RightButtonDown);
                    break;
}
*/
    if (!HandleTextInput(&InputEvent) && (InputEvent.usEvent == KEY_DOWN || InputEvent.usEvent == KEY_REPEAT || InputEvent.usEvent == KEY_UP)) {
      switch (InputEvent.usParam) {
        case ((ENTER)):
          if ((InputEvent.usEvent == KEY_UP)) {
            // return hit, check to see if current player activation string is a valid one
            ProcessPlayerInputActivationString();

            fNewCharInActivationString = TRUE;
          }
          break;
        case ((ESC)):
          LeaveLapTopScreen();
          break;
        default:
          if (InputEvent.usEvent == KEY_DOWN || InputEvent.usEvent == KEY_REPEAT) {
            HandleTextEvent(InputEvent.usParam);
          }
          break;
      }
    }
  }

  return;
}

function HandleTextEvent(uiKey: UINT32): void {
  // this function checks to see if a letter or a backspace was pressed, if so, either put char to screen
  // or delete it

  switch (uiKey) {
    case (BACKSPACE):

      if (iStringPos >= 0) {
        if (iStringPos > 0) {
          // decrement iStringPosition
          iStringPos -= 1;
        }

        // null out char
        pPlayerActivationString[iStringPos] = 0;

        // move back cursor
        uiCursorPosition = StringPixLength(pPlayerActivationString, FONT14ARIAL) + IMP_PLAYER_ACTIVATION_STRING_X;

        // string has been altered, redisplay
        fNewCharInActivationString = TRUE;
      }

      break;

    default:
      if (uiKey >= 'A' && uiKey <= 'Z' || uiKey >= 'a' && uiKey <= 'z' || uiKey >= '0' && uiKey <= '9' || uiKey == '_' || uiKey == '.') {
        // if the current string position is at max or great, do nothing
        if (iStringPos >= 6) {
          break;
        } else {
          if (iStringPos < 0) {
            iStringPos = 0;
          }
          // valid char, capture and convert to CHAR16
          pPlayerActivationString[iStringPos] = uiKey;

          // null out next char position
          pPlayerActivationString[iStringPos + 1] = 0;

          // move cursor position ahead
          uiCursorPosition = StringPixLength(pPlayerActivationString, FONT14ARIAL) + IMP_PLAYER_ACTIVATION_STRING_X;

          // increment string position
          iStringPos += 1;

          // string has been altered, redisplay
          fNewCharInActivationString = TRUE;
        }
      }

      break;
  }

  return;
}

function ProcessPlayerInputActivationString(): void {
  // prcess string to see if it matches activation string
  if (((wcscmp(pPlayerActivationString, "XEP624") == 0) || (wcscmp(pPlayerActivationString, "xep624") == 0)) && (LaptopSaveInfo.fIMPCompletedFlag == FALSE) && (LaptopSaveInfo.gfNewGameLaptop < 2)) {
    iCurrentImpPage = IMP_MAIN_PAGE;
  }
  /*
          else if( ( wcscmp(pPlayerActivationString, L"90210") == 0 ) && ( LaptopSaveInfo.fIMPCompletedFlag == FALSE ) )
          {
                  LoadInCurrentImpCharacter( );
          }
  */
  else {
    if (((wcscmp(pPlayerActivationString, "XEP624") != 0) && (wcscmp(pPlayerActivationString, "xep624") != 0))) {
      DoLapTopMessageBox(MSG_BOX_IMP_STYLE, pImpPopUpStrings[0], LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL);
    } else if (LaptopSaveInfo.fIMPCompletedFlag == TRUE) {
      DoLapTopMessageBox(MSG_BOX_IMP_STYLE, pImpPopUpStrings[6], LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL);
    }
  }
  return;
}

function CreateIMPHomePageButtons(): void {
  // this procedure will create the buttons needed for the IMP homepage

  // ths about us button
  giIMPHomePageButtonImage[0] = LoadButtonImage("LAPTOP\\button_1.sti", -1, 0, -1, 1, -1);
  /*  giIMPHomePageButton[0] = QuickCreateButton( giIMPHomePageButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 286 - 106 ), LAPTOP_SCREEN_WEB_UL_Y + ( 248 - 48 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPAboutUsCallback);
*/

  giIMPHomePageButton[0] = CreateIconAndTextButton(giIMPHomePageButtonImage[0], pImpButtonText[0], FONT12ARIAL, FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (286 - 106), LAPTOP_SCREEN_WEB_UL_Y + (248 - 48), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPAboutUsCallback);

  SetButtonCursor(giIMPHomePageButton[0], CURSOR_WWW);

  return;
}

function RemoveIMPHomePageButtons(): void {
  // this procedure will destroy the already created buttosn for the IMP homepage

  // the about us button
  RemoveButton(giIMPHomePageButton[0]);
  UnloadButtonImage(giIMPHomePageButtonImage[0]);

  return;
}

function BtnIMPAboutUsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP Homepage About US button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      iCurrentImpPage = IMP_ABOUT_US;
      fButtonPendingFlag = TRUE;
    }
  }
}
