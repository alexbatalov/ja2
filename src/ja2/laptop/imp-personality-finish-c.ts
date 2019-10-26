namespace ja2 {

// this is the amount of time, the player waits until booted back to main profileing screen

export let bPersonalityEndState: UINT8 = 0;

const PERSONALITY_CONFIRM_FINISH_DELAY = 2500;

// flag set when player hits  YES/NO button
let fConfirmHasBeenSelectedFlag: boolean = false;
let fConfirmIsYesFlag: boolean = false;
let fOkToReturnIMPMainPageFromPersonalityFlag: boolean = false;
let fCreatedOkIMPButton: boolean = false;
let fExitDueFrIMPPerFinToOkButton: boolean = false;
let fExitIMPPerFinAtOk: boolean = false;
let fCreateFinishOkButton: boolean = false;

// buttons
let giIMPPersonalityFinishButton: UINT32[] /* [2] */;
let giIMPPersonalityFinishButtonImage: UINT32[] /* [2] */;

export function EnterIMPPersonalityFinish(): void {
  // reset states
  fCreateFinishOkButton = false;
  bPersonalityEndState = 0;
  fConfirmIsYesFlag = false;

  // create the buttons
  CreateIMPPersonalityFinishButtons();

  return;
}

export function RenderIMPPersonalityFinish(): void {
  // the background
  RenderProfileBackGround();

  // indent for text
  RenderBeginIndent(110, 93);

  // check confirm flag to decide if we have to display appropriate response to button action
  if (fConfirmHasBeenSelectedFlag) {
    // confirm was yes, display yes string
    if (fConfirmIsYesFlag == true) {
      // display yes string
      PrintImpText();
    } else {
      // display no string
      PrintImpText();
    }
  }
  return;
}

export function ExitIMPPersonalityFinish(): void {
  // exit at IMP Ok button
  if (fExitIMPPerFinAtOk) {
    // destroy the finish ok buttons
    DestroyPersonalityFinishOkButton();
  }

  if ((fExitDueFrIMPPerFinToOkButton == false) && (fExitIMPPerFinAtOk == false)) {
    // exit due to cancel button, not ok or Yes/no button
    // get rid of yes no
    DestroyIMPersonalityFinishButtons();
  }

  fCreatedOkIMPButton = false;
  fOkToReturnIMPMainPageFromPersonalityFlag = false;
  fConfirmHasBeenSelectedFlag = false;
  return;
}

export function HandleIMPPersonalityFinish(): void {
  // check if confirm and delay
  CheckIfConfirmHasBeenSelectedAndTimeDelayHasPassed();

  return;
}

function CheckIfConfirmHasBeenSelectedAndTimeDelayHasPassed(): void {
  // this function will check to see if player has in fact confirmed selection and delay to
  // read text has occurred

  // if not confirm selected, return
  if (fConfirmHasBeenSelectedFlag == false) {
    return;
  }

  if (fCreateFinishOkButton == true) {
    fCreateFinishOkButton = false;
    CreatePersonalityFinishOkButton();
    fCreatedOkIMPButton = true;
  }

  // create ok button
  if (fCreatedOkIMPButton == false) {
    DestroyIMPersonalityFinishButtons();
    fCreateFinishOkButton = true;
    fExitIMPPerFinAtOk = true;
  }

  // ok to return
  if (fOkToReturnIMPMainPageFromPersonalityFlag == true) {
    DestroyPersonalityFinishOkButton();
    fCreatedOkIMPButton = false;
    fOkToReturnIMPMainPageFromPersonalityFlag = false;
    fConfirmHasBeenSelectedFlag = false;
    fExitDueFrIMPPerFinToOkButton = true;
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
  giIMPPersonalityFinishButton[0] = CreateIconAndTextButton(giIMPPersonalityFinishButtonImage[0], pImpButtonText[9], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (90), LAPTOP_SCREEN_WEB_UL_Y + (224), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityFinishYesCallback);

  // the no Button
  giIMPPersonalityFinishButtonImage[1] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  /*	giIMPPersonalityFinishButton[ 1 ] = QuickCreateButton( giIMPPersonalityFinishButtonImage[1], LAPTOP_SCREEN_UL_X +  ( 276 ), LAPTOP_SCREEN_WEB_UL_Y + ( 224 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPersonalityFinishNoCallback);
    */
  giIMPPersonalityFinishButton[1] = CreateIconAndTextButton(giIMPPersonalityFinishButtonImage[1], pImpButtonText[10], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (276), LAPTOP_SCREEN_WEB_UL_Y + (224), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityFinishNoCallback);

  SetButtonCursor(giIMPPersonalityFinishButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPPersonalityFinishButton[1], Enum317.CURSOR_WWW);

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
      fConfirmIsYesFlag = true;

      // set fact that confirmation has been done
      fConfirmHasBeenSelectedFlag = true;

      // now make skill, personality and attitude
      CreatePlayersPersonalitySkillsAndAttitude();
      fButtonPendingFlag = true;
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
      fConfirmIsYesFlag = false;

      // set fact that confirmation has been done
      fConfirmHasBeenSelectedFlag = true;
      CreatePlayersPersonalitySkillsAndAttitude();

      bPersonalityEndState = 2;
      fButtonPendingFlag = true;
    }
  }
}

function CreatePersonalityFinishOkButton(): void {
  // create personality button finish button
  giIMPPersonalityFinishButtonImage[0] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);
  giIMPPersonalityFinishButton[0] = CreateIconAndTextButton(giIMPPersonalityFinishButtonImage[0], pImpButtonText[24], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (186), LAPTOP_SCREEN_WEB_UL_Y + (224), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityFinishOkCallback);

  SetButtonCursor(giIMPPersonalityFinishButton[0], Enum317.CURSOR_WWW);

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
      fButtonPendingFlag = true;
      iCurrentImpPage = Enum71.IMP_MAIN_PAGE;
    }
  }
}

}
