// this is the amount of time, the player waits until booted back to main profileing screen

let bPersonalityEndState: UINT8 = 0;

const PERSONALITY_CONFIRM_FINISH_DELAY = 2500;

// flag set when player hits  YES/NO button
let fConfirmHasBeenSelectedFlag: BOOLEAN = FALSE;
let fConfirmIsYesFlag: BOOLEAN = FALSE;
let fOkToReturnIMPMainPageFromPersonalityFlag: BOOLEAN = FALSE;
let fCreatedOkIMPButton: BOOLEAN = FALSE;
let fExitDueFrIMPPerFinToOkButton: BOOLEAN = FALSE;
let fExitIMPPerFinAtOk: BOOLEAN = FALSE;
let fCreateFinishOkButton: BOOLEAN = FALSE;

// buttons
let giIMPPersonalityFinishButton: UINT32[] /* [2] */;
let giIMPPersonalityFinishButtonImage: UINT32[] /* [2] */;

function EnterIMPPersonalityFinish(): void {
  // reset states
  fCreateFinishOkButton = FALSE;
  bPersonalityEndState = 0;
  fConfirmIsYesFlag = FALSE;

  // create the buttons
  CreateIMPPersonalityFinishButtons();

  return;
}

function RenderIMPPersonalityFinish(): void {
  // the background
  RenderProfileBackGround();

  // indent for text
  RenderBeginIndent(110, 93);

  // check confirm flag to decide if we have to display appropriate response to button action
  if (fConfirmHasBeenSelectedFlag) {
    // confirm was yes, display yes string
    if (fConfirmIsYesFlag == TRUE) {
      // display yes string
      PrintImpText();
    } else {
      // display no string
      PrintImpText();
    }
  }
  return;
}

function ExitIMPPersonalityFinish(): void {
  // exit at IMP Ok button
  if (fExitIMPPerFinAtOk) {
    // destroy the finish ok buttons
    DestroyPersonalityFinishOkButton();
  }

  if ((fExitDueFrIMPPerFinToOkButton == FALSE) && (fExitIMPPerFinAtOk == FALSE)) {
    // exit due to cancel button, not ok or Yes/no button
    // get rid of yes no
    DestroyIMPersonalityFinishButtons();
  }

  fCreatedOkIMPButton = FALSE;
  fOkToReturnIMPMainPageFromPersonalityFlag = FALSE;
  fConfirmHasBeenSelectedFlag = FALSE;
  return;
}

function HandleIMPPersonalityFinish(): void {
  // check if confirm and delay
  CheckIfConfirmHasBeenSelectedAndTimeDelayHasPassed();

  return;
}

function CheckIfConfirmHasBeenSelectedAndTimeDelayHasPassed(): void {
  // this function will check to see if player has in fact confirmed selection and delay to
  // read text has occurred

  // if not confirm selected, return
  if (fConfirmHasBeenSelectedFlag == FALSE) {
    return;
  }

  if (fCreateFinishOkButton == TRUE) {
    fCreateFinishOkButton = FALSE;
    CreatePersonalityFinishOkButton();
    fCreatedOkIMPButton = TRUE;
  }

  // create ok button
  if (fCreatedOkIMPButton == FALSE) {
    DestroyIMPersonalityFinishButtons();
    fCreateFinishOkButton = TRUE;
    fExitIMPPerFinAtOk = TRUE;
  }

  // ok to return
  if (fOkToReturnIMPMainPageFromPersonalityFlag == TRUE) {
    DestroyPersonalityFinishOkButton();
    fCreatedOkIMPButton = FALSE;
    fOkToReturnIMPMainPageFromPersonalityFlag = FALSE;
    fConfirmHasBeenSelectedFlag = FALSE;
    fExitDueFrIMPPerFinToOkButton = TRUE;
  }

  return;
}

function CreateIMPPersonalityFinishButtons(): void {
  // this function will create the buttons needed for the IMP personality Finish Page

  // ths Yes button
  giIMPPersonalityFinishButtonImage[0] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  /*	giIMPPersonalityFinishButton[0] = QuickCreateButton( giIMPPersonalityFinishButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 90 ), LAPTOP_SCREEN_WEB_UL_Y + ( 224 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPersonalityFinishYesCallback);
  */
  giIMPPersonalityFinishButton[0] = CreateIconAndTextButton(giIMPPersonalityFinishButtonImage[0], pImpButtonText[9], FONT12ARIAL, FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (90), LAPTOP_SCREEN_WEB_UL_Y + (224), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityFinishYesCallback);

  // the no Button
  giIMPPersonalityFinishButtonImage[1] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  /*	giIMPPersonalityFinishButton[ 1 ] = QuickCreateButton( giIMPPersonalityFinishButtonImage[1], LAPTOP_SCREEN_UL_X +  ( 276 ), LAPTOP_SCREEN_WEB_UL_Y + ( 224 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPersonalityFinishNoCallback);
    */
  giIMPPersonalityFinishButton[1] = CreateIconAndTextButton(giIMPPersonalityFinishButtonImage[1], pImpButtonText[10], FONT12ARIAL, FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (276), LAPTOP_SCREEN_WEB_UL_Y + (224), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityFinishNoCallback);

  SetButtonCursor(giIMPPersonalityFinishButton[0], CURSOR_WWW);
  SetButtonCursor(giIMPPersonalityFinishButton[1], CURSOR_WWW);

  return;
}

function DestroyIMPersonalityFinishButtons(): void {
  // this function will destroy the buttons needed for the IMP personality Finish page

  // the yes button
  RemoveButton(giIMPPersonalityFinishButton[0]);
  UnloadButtonImage(giIMPPersonalityFinishButtonImage[0]);

  // the no button
  RemoveButton(giIMPPersonalityFinishButton[1]);
  UnloadButtonImage(giIMPPersonalityFinishButtonImage[1]);

  return;
}

function BtnIMPPersonalityFinishYesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    // confirm flag set, get out of HERE!
    if (fConfirmHasBeenSelectedFlag) {
      // now set this button off
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      return;
    }

    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // now set this button off
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // set fact yes was selected
      fConfirmIsYesFlag = TRUE;

      // set fact that confirmation has been done
      fConfirmHasBeenSelectedFlag = TRUE;

      // now make skill, personality and attitude
      CreatePlayersPersonalitySkillsAndAttitude();
      fButtonPendingFlag = TRUE;
      bPersonalityEndState = 1;
    }
  }
}

function BtnIMPPersonalityFinishNoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    // confirm flag set, get out of HERE!
    if (fConfirmHasBeenSelectedFlag) {
      // now set this button off
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      return;
    }

    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // now set this button on
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // set fact yes was selected
      fConfirmIsYesFlag = FALSE;

      // set fact that confirmation has been done
      fConfirmHasBeenSelectedFlag = TRUE;
      CreatePlayersPersonalitySkillsAndAttitude();

      bPersonalityEndState = 2;
      fButtonPendingFlag = TRUE;
    }
  }
}

function CreatePersonalityFinishOkButton(): void {
  // create personality button finish button
  giIMPPersonalityFinishButtonImage[0] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  giIMPPersonalityFinishButton[0] = CreateIconAndTextButton(giIMPPersonalityFinishButtonImage[0], pImpButtonText[24], FONT12ARIAL, FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (186), LAPTOP_SCREEN_WEB_UL_Y + (224), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityFinishOkCallback);

  SetButtonCursor(giIMPPersonalityFinishButton[0], CURSOR_WWW);

  return;
}

function DestroyPersonalityFinishOkButton(): void {
  // the ok button
  RemoveButton(giIMPPersonalityFinishButton[0]);
  UnloadButtonImage(giIMPPersonalityFinishButtonImage[0]);
}

function BtnIMPPersonalityFinishOkCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // now set this button on
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (iCurrentProfileMode < 2) {
        iCurrentProfileMode = 2;
      }

      // button pending, wait a frame
      fButtonPendingFlag = TRUE;
      iCurrentImpPage = IMP_MAIN_PAGE;
    }
  }
}
