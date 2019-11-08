namespace ja2 {

let giIMPPersonalityQuizButton: UINT32[] /* [2] */;
let giIMPPersonalityQuizButtonImage: UINT32[] /* [2] */;

// these are the buttons for the current question
let giIMPPersonalityQuizAnswerButton: INT32[] /* [10] */;
let giIMPPersonalityQuizAnswerButtonImage: INT32[] /* [10] */;

let giPreviousQuestionButton: INT32;
let giNextQuestionButton: INT32;

let giPreviousQuestionButtonImage: INT32;
let giNextQuestionButtonImage: INT32;

// this the currently highlighted answer
export let iCurrentAnswer: INT32 = -1;

// the current quiz question
export let giCurrentPersonalityQuizQuestion: INT32 = 0;
let giPreviousPersonalityQuizQuestion: INT32 = -1;
export let giMaxPersonalityQuizQuestion: INT32 = 0;

// start over flag
export let fStartOverFlag: boolean = false;

const BTN_FIRST_COLUMN_X = 15;
const BTN_SECOND_COLUMN_X = 256;

const INDENT_OFFSET = 55;

// number of IMP questions
const MAX_NUMBER_OF_IMP_QUESTIONS = 16;

// answer list
let iQuizAnswerList: INT32[] /* [MAX_NUMBER_OF_IMP_QUESTIONS] */;
// current number of buttons being shown
let iNumberOfPersonaButtons: INT32 = 0;

export function EnterIMPPersonalityQuiz(): void {
  // void answers out the quiz
  memset(addressof(iQuizAnswerList), -1, sizeof(INT32) * MAX_NUMBER_OF_IMP_QUESTIONS);

  // if we are entering for first time, reset
  if (giCurrentPersonalityQuizQuestion == MAX_NUMBER_OF_IMP_QUESTIONS) {
    giCurrentPersonalityQuizQuestion = 0;
  }
  // reset previous
  giPreviousPersonalityQuizQuestion = -1;

  // reset skills, attributes and personality
  ResetSkillsAttributesAndPersonality();

  // create/destroy buttons for  questions, if needed
  CreateIMPPersonalityQuizAnswerButtons();

  // now reset them
  ResetQuizAnswerButtons();

  // create other buttons
  CreateIMPPersonalityQuizButtons();

  return;
}

export function RenderIMPPersonalityQuiz(): void {
  // the background
  RenderProfileBackGround();

  // highlight answer
  PrintImpText();

  // indent for current and last page numbers
  // RenderAttrib2IndentFrame(BTN_FIRST_COLUMN_X + 2, 365 );

  // the current and last question numbers
  PrintQuizQuestionNumber();

  return;
}

export function ExitIMPPersonalityQuiz(): void {
  // set previous to current, we want it's buttons gone!
  giPreviousPersonalityQuizQuestion = giCurrentPersonalityQuizQuestion;

  // destroy regular quiz buttons: the done and start over buttons
  DestroyIMPersonalityQuizButtons();

  // destroy the buttons used for answers
  DestroyPersonalityQuizButtons();

  if (fStartOverFlag) {
    fStartOverFlag = false;
    giCurrentPersonalityQuizQuestion = 0;
  }
  return;
}

export function HandleIMPPersonalityQuiz(): void {
  // create/destroy buttons for  questions, if needed
  CreateIMPPersonalityQuizAnswerButtons();

  // handle keyboard input
  HandleIMPQuizKeyBoard();

  if (iCurrentAnswer == -1) {
    DisableButton(giIMPPersonalityQuizButton[0]);
  }

  return;
}

function CreateIMPPersonalityQuizButtons(): void {
  // this function will create the buttons needed for the IMP personality quiz Page

  // ths Done button
  giIMPPersonalityQuizButtonImage[0] = LoadButtonImage("LAPTOP\\button_7.sti", -1, 0, -1, 1, -1);

  /* giIMPPersonalityQuizButton[0] = QuickCreateButton( giIMPPersonalityQuizButtonImage[0], LAPTOP_SCREEN_UL_X +  ( 197 ), LAPTOP_SCREEN_WEB_UL_Y + ( 310 ),
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                                  BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPersonalityQuizAnswerConfirmCallback);
  */
  giIMPPersonalityQuizButton[0] = CreateIconAndTextButton(giIMPPersonalityQuizButtonImage[0], pImpButtonText[8], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (197), LAPTOP_SCREEN_WEB_UL_Y + (302), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityQuizAnswerConfirmCallback);

  // start over
  giIMPPersonalityQuizButtonImage[1] = LoadButtonImage("LAPTOP\\button_5.sti", -1, 0, -1, 1, -1);

  /* giIMPPersonalityQuizButton[ 1 ] = QuickCreateButton( giIMPPersonalityQuizButtonImage[1], LAPTOP_SCREEN_UL_X +  ( BTN_FIRST_COLUMN_X ), LAPTOP_SCREEN_WEB_UL_Y + ( 310 ),
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1,
                                                                          BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnIMPPersonalityQuizStartOverCallback);
*/

  giIMPPersonalityQuizButton[1] = CreateIconAndTextButton(giIMPPersonalityQuizButtonImage[1], pImpButtonText[7], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (BTN_FIRST_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (302), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPPersonalityQuizStartOverCallback);

  giPreviousQuestionButtonImage = LoadButtonImage("LAPTOP\\button_3.sti", -1, 0, -1, 1, -1);
  giPreviousQuestionButton = CreateIconAndTextButton(giPreviousQuestionButtonImage, pImpButtonText[12], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (197), LAPTOP_SCREEN_WEB_UL_Y + (361), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, PreviousQuestionButtonCallback);

  giNextQuestionButtonImage = LoadButtonImage("LAPTOP\\button_3.sti", -1, 0, -1, 1, -1);
  giNextQuestionButton = CreateIconAndTextButton(giNextQuestionButtonImage, pImpButtonText[13], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (417), LAPTOP_SCREEN_WEB_UL_Y + (361), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, NextQuestionButtonCallback);

  SpecifyButtonTextSubOffsets(giNextQuestionButton, 0, -1, false);
  SpecifyButtonTextSubOffsets(giPreviousQuestionButton, 0, -1, false);

  DisableButton(giPreviousQuestionButton);
  DisableButton(giNextQuestionButton);

  SetButtonCursor(giIMPPersonalityQuizButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPPersonalityQuizButton[1], Enum317.CURSOR_WWW);
  SetButtonCursor(giPreviousQuestionButton, Enum317.CURSOR_WWW);
  SetButtonCursor(giNextQuestionButton, Enum317.CURSOR_WWW);

  return;
}

function DestroyIMPersonalityQuizButtons(): void {
  // this function will destroy the buttons needed for the IMP personality quiz page

  // the done button
  RemoveButton(giIMPPersonalityQuizButton[0]);
  UnloadButtonImage(giIMPPersonalityQuizButtonImage[0]);

  // the start over button
  RemoveButton(giIMPPersonalityQuizButton[1]);
  UnloadButtonImage(giIMPPersonalityQuizButtonImage[1]);

  // previosu button
  RemoveButton(giPreviousQuestionButton);
  UnloadButtonImage(giPreviousQuestionButtonImage);

  // next button
  RemoveButton(giNextQuestionButton);
  UnloadButtonImage(giNextQuestionButtonImage);

  return;
}

function CreateIMPPersonalityQuizAnswerButtons(): void {
  // this function will create the buttons for the personality quiz answer selections

  if (Enum71.IMP_PERSONALITY_QUIZ != iCurrentImpPage) {
    // not valid pagre, get out
    return;
  }

  if (giCurrentPersonalityQuizQuestion == giPreviousPersonalityQuizQuestion) {
    // mode has not changed, return;
    return;
  }

  // destroy old screens buttons
  DestroyPersonalityQuizButtons();

  // re-render screen
  RenderProfileBackGround();

  switch (giCurrentPersonalityQuizQuestion) {
    case (-1):
      // do nothing
      break;
    case (0):
      // 6 buttons
      iNumberOfPersonaButtons = 6;
      break;
    case (3):
      // 5 buttons
      iNumberOfPersonaButtons = 5;
      break;
    case (5):
      // 5 buttons
      iNumberOfPersonaButtons = 5;
      break;
    case (10):
      // 5 buttons
      iNumberOfPersonaButtons = 5;
      break;
    case (11):
      // 5 buttons
      iNumberOfPersonaButtons = 8;

      break;
    default:
      // 4 buttons
      iNumberOfPersonaButtons = 4;

      break;
  }

  AddIMPPersonalityQuizAnswerButtons(iNumberOfPersonaButtons);

  ToggleQuestionNumberButtonOn(iQuizAnswerList[giCurrentPersonalityQuizQuestion]);

  // re render text
  PrintImpText();

  // the current and last question numbers
  PrintQuizQuestionNumber();

  // title bar
  RenderWWWProgramTitleBar();

  return;
}

function DestroyPersonalityQuizButtons(): void {
  // this function will destroy the buttons used in the previous personality question
  // destroy old buttons
  switch (giPreviousPersonalityQuizQuestion) {
    case (-1):
      // do nothing
      break;
    case (0):
      // 6 buttons
      DestroyIMPPersonalityQuizAnswerButtons(6);
      break;
    case (3):
      // 5 buttons
      DestroyIMPPersonalityQuizAnswerButtons(5);
      break;
    case (5):
      // 5 buttons
      DestroyIMPPersonalityQuizAnswerButtons(5);
      break;
    case (10):
      // 5 buttons
      DestroyIMPPersonalityQuizAnswerButtons(5);
      break;
    case (11):
      // 5 buttons
      DestroyIMPPersonalityQuizAnswerButtons(8);
      break;
    default:
      // 4 buttons
      DestroyIMPPersonalityQuizAnswerButtons(4);
      break;
  }

  return;
}

function AddIMPPersonalityQuizAnswerButtons(iNumberOfButtons: INT32): void {
  // will add iNumberofbuttons to the answer button list
  let iCounter: INT32 = 0;
  let sString: string /* CHAR16[32] */;

  for (iCounter = 0; iCounter < iNumberOfButtons; iCounter++) {
    switch (iCounter) {
      case (0):
        giIMPPersonalityQuizAnswerButtonImage[0] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[0] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[0], LAPTOP_SCREEN_UL_X + (BTN_FIRST_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (97), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer0Callback);

        break;
      case (1):
        giIMPPersonalityQuizAnswerButtonImage[1] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[1] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[1], LAPTOP_SCREEN_UL_X + (BTN_FIRST_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (147), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer1Callback);

        break;
      case (2):
        giIMPPersonalityQuizAnswerButtonImage[2] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[2] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[2], LAPTOP_SCREEN_UL_X + (BTN_FIRST_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (197), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer2Callback);

        break;
      case (3):
        giIMPPersonalityQuizAnswerButtonImage[3] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[3] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[3], LAPTOP_SCREEN_UL_X + (BTN_FIRST_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (247), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer3Callback);

        break;
      case (4):
        giIMPPersonalityQuizAnswerButtonImage[4] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[4] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[4], LAPTOP_SCREEN_UL_X + (BTN_SECOND_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (97), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer4Callback);

        break;
      case (5):
        giIMPPersonalityQuizAnswerButtonImage[5] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[5] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[5], LAPTOP_SCREEN_UL_X + (BTN_SECOND_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (147), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer5Callback);

        break;
      case (6):
        giIMPPersonalityQuizAnswerButtonImage[6] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[6] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[6], LAPTOP_SCREEN_UL_X + (BTN_SECOND_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (197), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer6Callback);

        break;
      case (7):
        giIMPPersonalityQuizAnswerButtonImage[7] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[7] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[7], LAPTOP_SCREEN_UL_X + (BTN_SECOND_COLUMN_X), LAPTOP_SCREEN_WEB_UL_Y + (247), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer7Callback);

        break;
      case (8):
        giIMPPersonalityQuizAnswerButtonImage[8] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[8] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[8], LAPTOP_SCREEN_UL_X + ((BTN_SECOND_COLUMN_X)), LAPTOP_SCREEN_WEB_UL_Y + (268), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer8Callback);

        break;
      case (9):
        giIMPPersonalityQuizAnswerButtonImage[9] = LoadButtonImage("LAPTOP\\button_6.sti", -1, 0, -1, 1, -1);
        giIMPPersonalityQuizAnswerButton[9] = QuickCreateButton(giIMPPersonalityQuizAnswerButtonImage[9], LAPTOP_SCREEN_UL_X + ((276 - 46) / 2), LAPTOP_SCREEN_WEB_UL_Y + (147), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 3, MSYS_NO_CALLBACK, BtnIMPPersonalityQuizAnswer9Callback);

        break;
    }
    sString = swprintf("%d", iCounter + 1);
    SpecifyButtonUpTextColors(giIMPPersonalityQuizAnswerButton[iCounter], FONT_WHITE, FONT_BLACK);
    SpecifyButtonDownTextColors(giIMPPersonalityQuizAnswerButton[iCounter], FONT_WHITE, FONT_BLACK);
    SpecifyButtonTextOffsets(giIMPPersonalityQuizAnswerButton[iCounter], +23, +12, true);
    SpecifyButtonFont(giIMPPersonalityQuizAnswerButton[iCounter], FONT12ARIAL());
    SpecifyButtonText(giIMPPersonalityQuizAnswerButton[iCounter], sString);
    SetButtonCursor(giIMPPersonalityQuizAnswerButton[iCounter], Enum317.CURSOR_WWW);
  }

  // previous is current
  giPreviousPersonalityQuizQuestion = giCurrentPersonalityQuizQuestion;
  return;
}

function DestroyIMPPersonalityQuizAnswerButtons(iNumberOfButtons: INT32): void {
  let iCounter: INT32 = 0;
  for (iCounter = 0; iCounter < iNumberOfButtons; iCounter++) {
    RemoveButton(giIMPPersonalityQuizAnswerButton[iCounter]);
    UnloadButtonImage(giIMPPersonalityQuizAnswerButtonImage[iCounter]);
    giIMPPersonalityQuizAnswerButton[iCounter] = -1;
  }

  return;
}

function BtnIMPPersonalityQuizAnswer0Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 0;
      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // highlight answer
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 1;

      // highlight answer
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 2;

      // highlight answer
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 3;

      // highlight answer
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer4Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 4;

      // highlight answer
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer5Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 5;

      // highlight answer
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer6Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 6;

      // highlight answer
      PrintIMPPersonalityQuizQuestionAndAnsers();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer7Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 7;

      // redraw text
      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer8Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 8;

      PrintImpText();

      // the current and last question numbers
      PrintQuizQuestionNumber();

      fReDrawCharProfile = true;
    }
  }
}

function BtnIMPPersonalityQuizAnswer9Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset buttons
      ResetQuizAnswerButtons();

      // now set this button on
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);

      // ok, check to see if button was disabled, if so, re enable
      CheckStateOfTheConfirmButton();

      iCurrentAnswer = 9;

      // highlight answer
      PrintIMPPersonalityQuizQuestionAndAnsers();

      // the current and last question numbers
      PrintQuizQuestionNumber();
    }
  }
}

function BtnIMPPersonalityQuizAnswerConfirmCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (iCurrentAnswer != -1) {
        // reset all the buttons
        ResetQuizAnswerButtons();

        // copy the answer into the list
        iQuizAnswerList[giCurrentPersonalityQuizQuestion] = iCurrentAnswer;

        // reset answer for next question
        iCurrentAnswer = -1;

        // next question, JOHNNY!
        if (giCurrentPersonalityQuizQuestion == giMaxPersonalityQuizQuestion) {
          giMaxPersonalityQuizQuestion++;
        }

        giCurrentPersonalityQuizQuestion++;
        CheckAndUpdateNextPreviousIMPQuestionButtonStates();

        // OPPS!, done..time to finish up
        if (giCurrentPersonalityQuizQuestion > 15) {
          iCurrentImpPage = Enum71.IMP_PERSONALITY_FINISH;
          // process
          CompileQuestionsInStatsAndWhatNot();
        }
      }
    }
  }
}

function BtnIMPPersonalityQuizStartOverCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP personality quiz answer button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      giPreviousPersonalityQuizQuestion = giCurrentPersonalityQuizQuestion;
      giMaxPersonalityQuizQuestion = 0;
      fStartOverFlag = true;

      iCurrentImpPage = Enum71.IMP_PERSONALITY;
      fButtonPendingFlag = true;
      iCurrentAnswer = -1;
    }
  }
}

function ResetQuizAnswerButtons(): void {
  let iCounter: INT32 = 0;
  let iCnt: INT32 = 0;

  // how many buttons to reset?
  switch (giCurrentPersonalityQuizQuestion) {
    case (-1):
      // do nothing
      return;
      break;
    case (0):
      // 6 buttons
      iCounter = 6;
      break;
    case (3):
      // 5 buttons
      iCounter = 5;
      break;
    case (5):
      // 6 buttons
      iCounter = 5;
      break;
    case (10):
      // 6 buttons
      iCounter = 5;
      break;
    case (11):
      // 9 buttons
      iCounter = 8;
      break;
    default:
      // 4 buttons
      iCounter = 4;
      break;
  }

  // now run through and reset the buttons
  for (iCnt = 0; iCnt < iCounter; iCnt++) {
    ButtonList[giIMPPersonalityQuizAnswerButton[iCnt]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
  }

  return;
}

function CompileQuestionsInStatsAndWhatNot(): void {
  // one BIG case/switch statement to determine what values are added where
  let iCurrentQuestion: INT32 = 0;

  for (iCurrentQuestion = 0; iCurrentQuestion < MAX_NUMBER_OF_IMP_QUESTIONS; iCurrentQuestion++) {
    switch (iCurrentQuestion) {
      // ok, run throught he list of questions
      case (0):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            if (fCharacterIsMale) {
              // Martial arts
              AddSkillToSkillList(Enum269.MARTIALARTS);
            } else {
              // for women, ambidexterious
              AddSkillToSkillList(Enum269.AMBIDEXT);
            }
            break;
          case (1):
            AddAnAttitudeToAttitudeList(Enum271.ATT_LONER);
            break;
          case (2):
            // hand to hand
            AddSkillToSkillList(Enum269.HANDTOHAND);
            break;
          case (3):
            // lock picking
            AddSkillToSkillList(Enum269.LOCKPICKING);
            break;
          case (4):
            // throwing
            AddSkillToSkillList(Enum269.THROWING);
            break;
          case (5):
            // optimist
            AddAnAttitudeToAttitudeList(Enum271.ATT_OPTIMIST);
            break;
        }
        break;
      case (1):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // teaching
            AddSkillToSkillList(Enum269.TEACHING);
            break;
          case (1):
            AddSkillToSkillList(Enum269.STEALTHY);
            break;
          case (2):
            // psycho
            AddAPersonalityToPersonalityList(Enum270.PSYCHO);
            break;
          case (3):
            AddAnAttitudeToAttitudeList(Enum271.ATT_FRIENDLY);
            break;
        }
        break;
      case (2):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // lock picking
            AddSkillToSkillList(Enum269.LOCKPICKING);
            break;
          case (1):
            // arrogant
            AddAnAttitudeToAttitudeList(Enum271.ATT_ARROGANT);
            break;
          case (2):
            AddSkillToSkillList(Enum269.STEALTHY);
            break;
          case (3):
            // normal
            AddAnAttitudeToAttitudeList(Enum271.ATT_NORMAL);
            break;
        }
        break;
      case (3):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // automatic weapons
            AddSkillToSkillList(Enum269.AUTO_WEAPS);
            break;
          case (1):
            // friendly
            AddAnAttitudeToAttitudeList(Enum271.ATT_FRIENDLY);

            break;
          case (2):
            // normal
            AddAnAttitudeToAttitudeList(Enum271.ATT_NORMAL);
            break;
          case (3):
            // asshole
            AddAnAttitudeToAttitudeList(Enum271.ATT_ASSHOLE);
            break;
          case (4):
            AddAnAttitudeToAttitudeList(Enum271.ATT_LONER);
            break;
        }
        break;
      case (4):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // coward
            AddAnAttitudeToAttitudeList(Enum271.ATT_COWARD);
            break;
          case (1):
            // none
            break;
          case (2):
            // aggressive
            AddAnAttitudeToAttitudeList(Enum271.ATT_AGGRESSIVE);
            break;
          case (3):
            // none
            break;
        }
        break;
      case (5):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // coward
            AddAnAttitudeToAttitudeList(Enum271.ATT_COWARD);
            break;
          case (1):
            AddSkillToSkillList(Enum269.NIGHTOPS);
            break;
          case (2):
            // dont like boxes much
            AddAPersonalityToPersonalityList(Enum270.CLAUSTROPHOBIC);
            break;
          case (3):
            // none
            break;
          case (4):
            // none
            break;
        }
        break;
      case (6):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // electronics
            AddSkillToSkillList(Enum269.ELECTRONICS);
            break;
          case (1):
            // knifing
            AddSkillToSkillList(Enum269.KNIFING);
            break;
          case (2):
            AddSkillToSkillList(Enum269.NIGHTOPS);
            break;
          case (3):
            // none
            break;
        }
        break;
      case (7):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // ambidexterous
            AddSkillToSkillList(Enum269.AMBIDEXT);
            break;
          case (1):
            // none
            break;
          case (2):
            // optimist
            AddAnAttitudeToAttitudeList(Enum271.ATT_OPTIMIST);
            break;
          case (3):
            // psycho
            AddAPersonalityToPersonalityList(Enum270.PSYCHO);
            break;
        }
        break;
      case (8):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // forgetful
            AddAPersonalityToPersonalityList(Enum270.FORGETFUL);
            break;
          case (1):
            // none
          case (2):
            // pessimist
            AddAnAttitudeToAttitudeList(Enum271.ATT_PESSIMIST);
            break;
          case (3):
            // nervous
            AddAPersonalityToPersonalityList(Enum270.NERVOUS);
            break;
        }
        break;
      case (9):

        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // none
            break;
          case (1):
            // pessimist
            AddAnAttitudeToAttitudeList(Enum271.ATT_PESSIMIST);
            break;
          case (2):
            // asshole
            AddAnAttitudeToAttitudeList(Enum271.ATT_ASSHOLE);
            break;
          case (3):
            // nervous
            AddAPersonalityToPersonalityList(Enum270.NERVOUS);
            break;
        }
        break;
      case (10):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // none
            break;
          case (1):
            // teaching
            AddSkillToSkillList(Enum269.TEACHING);
            break;
          case (2):
            // aggressive
            AddAnAttitudeToAttitudeList(Enum271.ATT_AGGRESSIVE);
            break;
          case (3):
            // normal
            AddAnAttitudeToAttitudeList(Enum271.ATT_NORMAL);
            break;
          case (4):
            // none
            break;
        }
        break;
      case (11):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            if (fCharacterIsMale) {
              // Martial arts
              AddSkillToSkillList(Enum269.MARTIALARTS);
            } else {
              // for women, ambidexterious
              AddSkillToSkillList(Enum269.AMBIDEXT);
            }
            break;
          case (1):
            // knifing
            AddSkillToSkillList(Enum269.KNIFING);
            break;
          case (2):
            // none
            break;
          case (3):
            // automatic weapons
            AddSkillToSkillList(Enum269.AUTO_WEAPS);
            break;
          case (4):
            // hand to hand
            AddSkillToSkillList(Enum269.HANDTOHAND);
            break;
          case (5):
            // electronics
            AddSkillToSkillList(Enum269.ELECTRONICS);
            break;
          case (6):
            // ashole
            break;
          case (7):
            // none
            break;
        }
        break;
      case (12):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // forgetful
            AddAPersonalityToPersonalityList(Enum270.FORGETFUL);
            break;
          case (1):
            // normal
            AddAnAttitudeToAttitudeList(Enum271.ATT_NORMAL);
            break;
          case (2):
            // normal
            AddAnAttitudeToAttitudeList(Enum271.ATT_NORMAL);
            break;
          case (3):
            // heat problems
            AddAPersonalityToPersonalityList(Enum270.HEAT_INTOLERANT);
            break;
        }
        break;
      case (13):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // dont like boxes much
            AddAPersonalityToPersonalityList(Enum270.CLAUSTROPHOBIC);
            break;
          case (1):
            // normal
            AddAnAttitudeToAttitudeList(Enum271.ATT_NORMAL);
            break;
          case (2):
            // heat problems
            AddAPersonalityToPersonalityList(Enum270.HEAT_INTOLERANT);
            break;
          case (3):
            // none
            break;
        }
        break;
      case (14):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // throwing
            AddSkillToSkillList(Enum269.THROWING);
            break;
          case (1):
            // ambidexterous
            AddSkillToSkillList(Enum269.AMBIDEXT);
            break;
          case (3):
            // none
            break;
          case (2):
            AddAnAttitudeToAttitudeList(Enum271.ATT_ARROGANT);
            break;
        }
        break;
      case (15):
        switch (iQuizAnswerList[iCurrentQuestion]) {
          case (0):
            // none !
            break;
          case (1):
            // none !
            break;
          case (2):
            // none !
            break;
          case (3):
            // none !
            break;
        }
        break;
    }
  }
}

export function BltAnswerIndents(iNumberOfIndents: INT32): void {
  let iCounter: INT32 = 0;

  // the question indent
  RenderQtnIndentFrame(15, 20);

  // the answers

  for (iCounter = 0; iCounter < iNumberOfIndents; iCounter++) {
    switch (iCounter) {
      case (0):
        if (iNumberOfIndents < 5) {
          RenderQtnLongIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 93);

          if (iCurrentAnswer == iCounter) {
            RenderQtnLongIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 93);
          }
        } else {
          RenderQtnShortIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 93);

          if (iCurrentAnswer == iCounter) {
            RenderQtnShortIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 93);
          }
        }
        break;
      case (1):
        if (iNumberOfIndents < 5) {
          RenderQtnLongIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 143);

          if (iCurrentAnswer == iCounter) {
            RenderQtnLongIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 143);
          }
        } else {
          RenderQtnShortIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 143);

          if (iCurrentAnswer == iCounter) {
            RenderQtnShortIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 143);
          }
        }
        break;
      case (2):
        if (iNumberOfIndents < 5) {
          RenderQtnLongIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 193);

          if (iCurrentAnswer == iCounter) {
            RenderQtnLongIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 193);
          }
        } else {
          RenderQtnShortIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 193);

          if (iCurrentAnswer == iCounter) {
            RenderQtnShortIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 193);
          }
        }
        break;
      case (3):

        // is this question # 6 ..if so, need longer answer box
        if ((giCurrentPersonalityQuizQuestion == 5)) {
          // render longer frame
          RenderQtnShort2IndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 243);

          // is this answer currently selected?
          if (iCurrentAnswer == iCounter) {
            // need to highlight
            RenderQtnShort2IndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 243);
          }
          // done
          break;
        }

        if (iNumberOfIndents < 5) {
          RenderQtnLongIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 243);

          if (iCurrentAnswer == iCounter) {
            RenderQtnLongIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 243);
          }
        } else {
          RenderQtnShortIndentFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 243);

          if (iCurrentAnswer == iCounter) {
            RenderQtnShortIndentHighFrame(BTN_FIRST_COLUMN_X + INDENT_OFFSET, 243);
          }
        }
        break;
      case (4):

        // is this question # 14 or 21?..if so, need longer answer box
        if ((giCurrentPersonalityQuizQuestion == 10) || (giCurrentPersonalityQuizQuestion == 5)) {
          // render longer frame
          RenderQtnShort2IndentFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 93);

          // is this answer currently selected?
          if (iCurrentAnswer == iCounter) {
            // need to highlight
            RenderQtnShort2IndentHighFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 93);
          }
          // done
          break;
        }

        RenderQtnShortIndentFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 93);

        if (iCurrentAnswer == iCounter) {
          RenderQtnShortIndentHighFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 93);
        }
        break;
      case (5):

        // special case?..longer frame needed if so
        if ((giCurrentPersonalityQuizQuestion == 19)) {
          // render longer frame
          RenderQtnShort2IndentFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 143);

          // is this answer currently selected?
          if (iCurrentAnswer == iCounter) {
            // need to highlight
            RenderQtnShort2IndentHighFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 143);
          }
          // done
          break;
        }
        RenderQtnShortIndentFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 143);
        if (iCurrentAnswer == iCounter) {
          RenderQtnShortIndentHighFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 143);
        }
        break;
      case (6):
        RenderQtnShortIndentFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 193);
        if (iCurrentAnswer == iCounter) {
          RenderQtnShortIndentHighFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 193);
        }
        break;
      case (7):
        RenderQtnShortIndentFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 243);
        if (iCurrentAnswer == iCounter) {
          RenderQtnShortIndentHighFrame(BTN_SECOND_COLUMN_X + INDENT_OFFSET, 243);
        }
        break;
      case (8):
        break;
    }
  }
}

function PrintQuizQuestionNumber(): void {
  // this function will print the number of the current question and the numebr of questions

  let sString: string /* CHAR16[10] */;

  // setup font
  SetFont(FONT12ARIAL());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // get current question number into a string
  sString = swprintf("%d", giCurrentPersonalityQuizQuestion + 1);

  // print current question number
  mprintf(LAPTOP_SCREEN_UL_X + 345, LAPTOP_SCREEN_WEB_UL_Y + 370, sString);

  // total number of questions
  mprintf(LAPTOP_SCREEN_UL_X + 383, LAPTOP_SCREEN_WEB_UL_Y + 370, "16");
  return;
}

function CheckStateOfTheConfirmButton(): void {
  // will check the state of the confirm button, should it be enabled or disabled?
  if (iCurrentAnswer == -1) {
    // was disabled, enable
    EnableButton(giIMPPersonalityQuizButton[0]);
  }

  return;
}

function HandleIMPQuizKeyBoard(): void {
  let InputEvent: InputAtom;
  let MousePos: POINT = createPoint();
  let fSkipFrame: boolean = false;

  GetCursorPos(addressof(MousePos));

  while ((DequeueEvent(addressof(InputEvent)) == true)) {
    if (fSkipFrame == false) {
      // HOOK INTO MOUSE HOOKS

      /*
      if( (InputEvent.usEvent == KEY_DOWN ) && ( InputEvent.usParam >= '1' ) && ( InputEvent.usParam <= '9') )
      {
              if( ( UINT16 )( iNumberOfPersonaButtons ) >= InputEvent.usParam - '0' )
              {
                      // reset buttons
                      ResetQuizAnswerButtons( );

                      // ok, check to see if button was disabled, if so, re enable
                      CheckStateOfTheConfirmButton( );

                      // toggle this button on
                      ButtonList[ giIMPPersonalityQuizAnswerButton[ InputEvent.usParam - '1' ] ]->uiFlags |= (BUTTON_CLICKED_ON);

                      iCurrentAnswer = InputEvent.usParam - '1';

                      PrintImpText( );

                      // the current and last question numbers
                      PrintQuizQuestionNumber( );

                      fReDrawCharProfile = TRUE;
                      fSkipFrame = TRUE;
              }
      }
      else if( ( iCurrentAnswer != -1 ) && ( InputEvent.usEvent == KEY_DOWN ) && ( InputEvent.usParam == ENTER ) )
      {
              // reset all the buttons
              ResetQuizAnswerButtons( );

              // copy the answer into the list
              iQuizAnswerList[ giCurrentPersonalityQuizQuestion ] = iCurrentAnswer;

              // reset answer for next question
              iCurrentAnswer = -1;

              // next question, JOHNNY!
              giCurrentPersonalityQuizQuestion++;
              giMaxPersonalityQuizQuestion++;


              // OPPS!, done..time to finish up
              if( giCurrentPersonalityQuizQuestion > 15)
              {
                      iCurrentImpPage = IMP_PERSONALITY_FINISH;
                      // process
                      CompileQuestionsInStatsAndWhatNot( );
              }

              fSkipFrame = TRUE;
      }
      else if( ( InputEvent.usEvent == KEY_DOWN ) && ( InputEvent.usParam == '=' ) )
      {
              MoveAheadAQuestion( );
              fSkipFrame = TRUE;
      }
      else if( ( InputEvent.usEvent == KEY_DOWN ) && ( InputEvent.usParam == '-' ) )
      {
              MoveBackAQuestion( );
              fSkipFrame = TRUE;
      }
      else
      {

*/ switch (InputEvent.usEvent) {
        case LEFT_BUTTON_DOWN:
          MouseSystemHook(LEFT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());

          break;
        case LEFT_BUTTON_UP:
          MouseSystemHook(LEFT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());

          break;
        case RIGHT_BUTTON_DOWN:
          MouseSystemHook(RIGHT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());

          break;
        case RIGHT_BUTTON_UP:
          MouseSystemHook(RIGHT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());

          break;
        case RIGHT_BUTTON_REPEAT:
          MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());

          break;
        case LEFT_BUTTON_REPEAT:
          MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());

          break;
        default:
          HandleKeyBoardShortCutsForLapTop(InputEvent.usEvent, InputEvent.usParam, InputEvent.usKeyState);
          break;
          //			}
      }
    }
  }
  return;
}

function CheckAndUpdateNextPreviousIMPQuestionButtonStates(): void {
  if (giCurrentPersonalityQuizQuestion >= giMaxPersonalityQuizQuestion) {
    DisableButton(giNextQuestionButton);
  } else {
    EnableButton(giNextQuestionButton);
  }

  if (giCurrentPersonalityQuizQuestion == 0) {
    DisableButton(giPreviousQuestionButton);
  } else {
    EnableButton(giPreviousQuestionButton);
  }
}

function MoveAheadAQuestion(): void {
  // move ahead a question in the personality question list
  if (giCurrentPersonalityQuizQuestion < giMaxPersonalityQuizQuestion) {
    giCurrentPersonalityQuizQuestion++;

    iCurrentAnswer = -1;
    CheckStateOfTheConfirmButton();

    iCurrentAnswer = iQuizAnswerList[giCurrentPersonalityQuizQuestion];
  }

  CheckAndUpdateNextPreviousIMPQuestionButtonStates();

  /*
          EnableButton( giPreviousQuestionButton );

          if( giCurrentPersonalityQuizQuestion >= giMaxPersonalityQuizQuestion )
          {
                  DisableButton( giNextQuestionButton );
                  iCurrentAnswer = -1;
          }
          else
          {
                  EnableButton( giNextQuestionButton );
          }
  */
  return;
}

function MoveBackAQuestion(): void {
  if (giCurrentPersonalityQuizQuestion > 0) {
    giCurrentPersonalityQuizQuestion--;

    iCurrentAnswer = -1;
    CheckStateOfTheConfirmButton();

    iCurrentAnswer = iQuizAnswerList[giCurrentPersonalityQuizQuestion];
  }

  EnableButton(giNextQuestionButton);

  CheckAndUpdateNextPreviousIMPQuestionButtonStates();
  /*
          if( giCurrentPersonalityQuizQuestion == 0 )
          {
                  DisableButton( giPreviousQuestionButton );
          }
          else
          {
                  EnableButton( giPreviousQuestionButton );
          }
  */
  return;
}

function ToggleQuestionNumberButtonOn(iAnswerNumber: INT32): void {
  if ((giCurrentPersonalityQuizQuestion <= giMaxPersonalityQuizQuestion) && (iAnswerNumber != -1)) {
    // reset buttons
    ResetQuizAnswerButtons();

    // toggle this button on
    ButtonList[giIMPPersonalityQuizAnswerButton[iAnswerNumber]].value.uiFlags |= (BUTTON_CLICKED_ON);
    iCurrentAnswer = iAnswerNumber;
  }

  return;
}

function PreviousQuestionButtonCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      MoveBackAQuestion();
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    }
  }
  return;
}

function NextQuestionButtonCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      MoveAheadAQuestion();
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    }
  }
  return;
}

}
