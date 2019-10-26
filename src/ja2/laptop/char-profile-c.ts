// BOOLEAN fIMPCompletedFlag = FALSE;
export let fReDrawCharProfile: boolean = false;
export let fButtonPendingFlag: boolean = false;
let fAddCreatedCharToPlayersTeam: boolean = false;
let fReEnterIMP: boolean = false;

export let iCurrentImpPage: INT32 = Enum71.IMP_HOME_PAGE;
let iPreviousImpPage: INT32 = -1;

// attributes
export let iStrength: INT32 = 55;
export let iDexterity: INT32 = 55;
export let iAgility: INT32 = 55;
export let iWisdom: INT32 = 55;
export let iLeadership: INT32 = 55;
export let iHealth: INT32 = 55;

// skills
export let iMarksmanship: INT32 = 55;
export let iMedical: INT32 = 55;
export let iExplosives: INT32 = 55;
export let iMechanical: INT32 = 55;

// gender
export let fCharacterIsMale: boolean = true;

// name and nick name
export let pFullName: CHAR16[] /* [32] */;
export let pNickName: CHAR16[] /* [32] */;

// skills
export let iSkillA: INT32 = 0;
export let iSkillB: INT32 = 0;

// personality
export let iPersonality: INT32 = 0;

// attitude
export let iAttitude: INT32 = 0;

// additives, but no preservatives
export let iAddStrength: INT32 = 0;
export let iAddDexterity: INT32 = 0;
export let iAddAgility: INT32 = 0;
export let iAddWisdom: INT32 = 0;
export let iAddHealth: INT32 = 0;
export let iAddLeadership: INT32 = 0;

export let iAddMarksmanship: INT32 = 0;
export let iAddMedical: INT32 = 0;
export let iAddExplosives: INT32 = 0;
export let iAddMechanical: INT32 = 0;

// IMP global buttons
let giIMPButton: INT32[] /* [1] */;
let giIMPButtonImage: INT32[] /* [1] */;

// visted subpages
let fVisitedIMPSubPages: boolean[] /* [IMP_NUM_PAGES] */;

export function GameInitCharProfile(): void {
  LaptopSaveInfo.iVoiceId = 0;
  iCurrentPortrait = 0;
  iCurrentVoices = 0;
  iPortraitNumber = 0;

  return;
}

export function EnterCharProfile(): void {
  // reset previous page
  iPreviousImpPage = -1;

  // grab the graphics
  LoadImpGraphics();
}

export function ExitCharProfile(): void {
  // get rid of graphics
  RemoveImpGraphics();

  // clean up past mode
  ExitOldIMPMode();
}

export function HandleCharProfile(): void {
  if (fReDrawCharProfile) {
    // re draw
    RenderCharProfile();
    fReDrawCharProfile = false;
  }

  // button pending, but not changing mode, still need a rernder, but under different circumstances
  if ((fButtonPendingFlag == true) && (iCurrentImpPage == iPreviousImpPage)) {
    RenderCharProfile();
  }

  // page has changed, handle the fact..get rid of old page, load up new, and re render
  if ((iCurrentImpPage != iPreviousImpPage)) {
    if (fDoneLoadPending == false) {
      // make sure we are not hosing memory
      Assert(iCurrentImpPage <= Enum71.IMP_NUM_PAGES);

      fFastLoadFlag = HasTheCurrentIMPPageBeenVisited();
      fVisitedIMPSubPages[iCurrentImpPage] = true;
      fConnectingToSubPage = true;

      if (iPreviousImpPage != -1) {
        fLoadPendingFlag = true;
        MarkButtonsDirty();
        return;
      } else {
        fDoneLoadPending = true;
      }
    }

    fVisitedIMPSubPages[iCurrentImpPage] = true;

    if (fButtonPendingFlag == true) {
      // render screen
      RenderCharProfile();
      return;
    }

    // exity old mode
    ExitOldIMPMode();

    // set previous page
    iPreviousImpPage = iCurrentImpPage;

    // enter new
    EnterNewIMPMode();

    // render screen
    RenderCharProfile();

    // render title bar
  }

  // handle
  switch (iCurrentImpPage) {
    case (Enum71.IMP_HOME_PAGE):
      HandleImpHomePage();
      break;
    case (Enum71.IMP_BEGIN):
      HandleIMPBeginScreen();
      break;
    case (Enum71.IMP_PERSONALITY):
      HandleIMPPersonalityEntrance();
      break;
    case (Enum71.IMP_PERSONALITY_QUIZ):
      HandleIMPPersonalityQuiz();
      break;
    case (Enum71.IMP_PERSONALITY_FINISH):
      HandleIMPPersonalityFinish();
      break;
    case (Enum71.IMP_ATTRIBUTE_ENTRANCE):
      HandleIMPAttributeEntrance();
      break;
    case (Enum71.IMP_ATTRIBUTE_PAGE):
      HandleIMPAttributeSelection();
      break;
    case (Enum71.IMP_ATTRIBUTE_FINISH):
      HandleIMPAttributeFinish();
      break;
    case (Enum71.IMP_PORTRAIT):
      HandleIMPPortraits();
      break;
    case (Enum71.IMP_VOICE):
      HandleIMPVoices();
      break;
    case (Enum71.IMP_FINISH):
      HandleIMPFinish();
      break;
    case (Enum71.IMP_ABOUT_US):
      HandleIMPAboutUs();
      break;
    case (Enum71.IMP_MAIN_PAGE):
      HandleIMPMainPage();
      break;
    case (Enum71.IMP_CONFIRM):
      HandleIMPConfirm();
      break;
  }

  return;
}

export function RenderCharProfile(): void {
  // button is waiting to go up?...do nothing,

  if (fButtonPendingFlag) {
    fPausedReDrawScreenFlag = true;
    fButtonPendingFlag = false;
    return;
  }

  switch (iCurrentImpPage) {
    case (Enum71.IMP_HOME_PAGE):
      RenderImpHomePage();
      break;
    case (Enum71.IMP_BEGIN):
      RenderIMPBeginScreen();
      break;
    case (Enum71.IMP_PERSONALITY):
      RenderIMPPersonalityEntrance();
      break;
    case (Enum71.IMP_PERSONALITY_QUIZ):
      RenderIMPPersonalityQuiz();
      break;
    case (Enum71.IMP_PERSONALITY_FINISH):
      RenderIMPPersonalityFinish();
      break;
    case (Enum71.IMP_ATTRIBUTE_ENTRANCE):
      RenderIMPAttributeEntrance();
      break;
    case (Enum71.IMP_ATTRIBUTE_PAGE):
      RenderIMPAttributeSelection();
      break;
    case (Enum71.IMP_ATTRIBUTE_FINISH):
      RenderIMPAttributeFinish();
      break;
    case (Enum71.IMP_PORTRAIT):
      RenderIMPPortraits();
      break;
    case (Enum71.IMP_VOICE):
      RenderIMPVoices();
      break;
    case (Enum71.IMP_FINISH):
      RenderIMPFinish();
      break;
    case (Enum71.IMP_ABOUT_US):
      RenderIMPAboutUs();
      break;
    case (Enum71.IMP_MAIN_PAGE):
      RenderIMPMainPage();
      break;
    case (Enum71.IMP_CONFIRM):
      RenderIMPConfirm();
      break;
  }

  // render title bar
  // RenderWWWProgramTitleBar( );

  // render the text
  PrintImpText();

  RenderWWWProgramTitleBar();

  DisplayProgramBoundingBox(true);

  // InvalidateRegion( 0, 0, 640, 480 );
  return;
}

function ExitOldIMPMode(): void {
  // exit old mode

  if (iPreviousImpPage == -1) {
    // don't both, leave
    return;
  }
  // remove old mode
  switch (iPreviousImpPage) {
    case (Enum71.IMP_HOME_PAGE):
      ExitImpHomePage();
      break;
    case (Enum71.IMP_BEGIN):
      DestroyIMPButtons();
      ExitIMPBeginScreen();
      break;
    case (Enum71.IMP_FINISH):
      DestroyIMPButtons();
      ExitIMPFinish();
      break;
    case (Enum71.IMP_PERSONALITY):
      DestroyIMPButtons();
      ExitIMPPersonalityEntrance();
      break;
    case (Enum71.IMP_PERSONALITY_QUIZ):
      DestroyIMPButtons();
      ExitIMPPersonalityQuiz();
      break;
    case (Enum71.IMP_PERSONALITY_FINISH):
      DestroyIMPButtons();
      ExitIMPPersonalityFinish();
      break;
    case (Enum71.IMP_ATTRIBUTE_ENTRANCE):
      DestroyIMPButtons();
      ExitIMPAttributeEntrance();
      break;
    case (Enum71.IMP_ATTRIBUTE_PAGE):
      DestroyIMPButtons();
      ExitIMPAttributeSelection();
      break;
    case (Enum71.IMP_ATTRIBUTE_FINISH):
      DestroyIMPButtons();
      ExitIMPAttributeFinish();
      break;
    case (Enum71.IMP_PORTRAIT):
      DestroyIMPButtons();
      ExitIMPPortraits();
      break;
    case (Enum71.IMP_VOICE):
      DestroyIMPButtons();
      ExitIMPVoices();
      break;
    case (Enum71.IMP_ABOUT_US):
      ExitIMPAboutUs();
      break;
    case (Enum71.IMP_MAIN_PAGE):
      ExitIMPMainPage();
      break;
    case (Enum71.IMP_CONFIRM):
      ExitIMPConfirm();
      break;
  }

  return;
}

function EnterNewIMPMode(): void {
  // enter new mode

  switch (iCurrentImpPage) {
    case (Enum71.IMP_HOME_PAGE):
      EnterImpHomePage();
      break;
    case (Enum71.IMP_BEGIN):
      CreateIMPButtons();
      EnterIMPBeginScreen();
      break;
    case (Enum71.IMP_FINISH):
      CreateIMPButtons();
      EnterIMPFinish();
      break;
    case (Enum71.IMP_PERSONALITY):
      CreateIMPButtons();
      EnterIMPPersonalityEntrance();
      break;
    case (Enum71.IMP_PERSONALITY_QUIZ):
      CreateIMPButtons();
      EnterIMPPersonalityQuiz();
      break;
    case (Enum71.IMP_PERSONALITY_FINISH):
      CreateIMPButtons();
      EnterIMPPersonalityFinish();
      break;
    case (Enum71.IMP_ATTRIBUTE_ENTRANCE):
      CreateIMPButtons();
      EnterIMPAttributeEntrance();
      break;
    case (Enum71.IMP_ATTRIBUTE_PAGE):
      CreateIMPButtons();
      EnterIMPAttributeSelection();
      break;
    case (Enum71.IMP_ATTRIBUTE_FINISH):
      CreateIMPButtons();
      EnterIMPAttributeFinish();
      break;
    case (Enum71.IMP_PORTRAIT):
      CreateIMPButtons();
      EnterIMPPortraits();
      break;
    case (Enum71.IMP_VOICE):
      CreateIMPButtons();
      EnterIMPVoices();
      break;
    case (Enum71.IMP_ABOUT_US):
      EnterIMPAboutUs();
      break;
    case (Enum71.IMP_MAIN_PAGE):
      EnterIMPMainPage();
      break;
    case (Enum71.IMP_CONFIRM):
      EnterIMPConfirm();
      break;
  }

  return;
}

export function ResetCharacterStats(): void {
  // attributes
  iStrength = 55;
  iDexterity = 55;
  iAgility = 55;
  iWisdom = 55;
  iLeadership = 55;
  iHealth = 55;

  // skills
  iMarksmanship = 55;
  iMedical = 55;
  iExplosives = 55;
  iMechanical = 55;

  // skills
  iSkillA = 0;
  iSkillB = 0;

  // personality
  iPersonality = 0;

  // attitude
  iAttitude = 0;

  // names
  memset(addressof(pFullName), 0, sizeof(pFullName));
  memset(addressof(pNickName), 0, sizeof(pNickName));
}

function LoadImpGraphics(): void {
  // load all graphics needed for IMP

  LoadProfileBackGround();
  LoadIMPSymbol();
  LoadBeginIndent();
  LoadActivationIndent();
  LoadFrontPageIndent();
  LoadAnalyse();
  LoadAttributeGraph();
  LoadAttributeGraphBar();

  LoadFullNameIndent();
  LoadNameIndent();
  LoadGenderIndent();
  LoadNickNameIndent();

  // LoadSmallFrame( );

  LoadSmallSilhouette();
  LoadLargeSilhouette();

  LoadAttributeFrame();
  LoadSliderBar();

  LoadButton2Image();
  LoadButton4Image();
  LoadButton1Image();

  LoadPortraitFrame();
  LoadMainIndentFrame();

  LoadQtnLongIndentFrame();
  LoadQtnShortIndentFrame();
  LoadQtnLongIndentHighFrame();
  LoadQtnShortIndentHighFrame();
  LoadQtnShort2IndentFrame();
  LoadQtnShort2IndentHighFrame();

  LoadQtnIndentFrame();
  LoadAttrib1IndentFrame();
  LoadAttrib2IndentFrame();
  LoadAvgMercIndentFrame();
  LoadAboutUsIndentFrame();

  return;
}

function RemoveImpGraphics(): void {
  // remove all graphics needed for IMP

  RemoveProfileBackGround();
  DeleteIMPSymbol();
  DeleteBeginIndent();
  DeleteActivationIndent();
  DeleteFrontPageIndent();
  DeleteAnalyse();
  DeleteAttributeGraph();
  DeleteAttributeBarGraph();

  DeleteFullNameIndent();
  DeleteNameIndent();
  DeleteGenderIndent();
  DeleteNickNameIndent();

  // DeleteSmallFrame( );

  DeleteSmallSilhouette();
  DeleteLargeSilhouette();

  DeleteAttributeFrame();
  DeleteSliderBar();

  DeleteButton2Image();
  DeleteButton4Image();
  DeleteButton1Image();

  DeletePortraitFrame();
  DeleteMainIndentFrame();

  DeleteQtnLongIndentFrame();
  DeleteQtnShortIndentFrame();
  DeleteQtnLongIndentHighFrame();
  DeleteQtnShortIndentHighFrame();
  DeleteQtnShort2IndentFrame();
  DeleteQtnShort2IndentHighFrame();

  DeleteQtnIndentFrame();
  DeleteAttrib1IndentFrame();
  DeleteAttrib2IndentFrame();
  DeleteAvgMercIndentFrame();
  DeleteAboutUsIndentFrame();
  return;
}

function CreateIMPButtons(): void {
  // create all the buttons global to the IMP system

  giIMPButtonImage[0] = LoadButtonImage("LAPTOP\\button_3.sti", -1, 0, -1, 1, -1);

  // cancel
  giIMPButton[0] = CreateIconAndTextButton(giIMPButtonImage[0], pImpButtonText[19], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + 15, LAPTOP_SCREEN_WEB_UL_Y + (360), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPCancelCallback);

  SpecifyButtonTextSubOffsets(giIMPButton[0], 0, -1, false);

  // set up generic www cursor
  SetButtonCursor(giIMPButton[0], Enum317.CURSOR_WWW);

  return;
}

function DestroyIMPButtons(): void {
  // destroy the buttons we created
  RemoveButton(giIMPButton[0]);
  UnloadButtonImage(giIMPButtonImage[0]);

  return;
}

function BtnIMPCancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP cancel button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  }

  else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // back to the main page, otherwise, back to home page
      if (iCurrentImpPage == Enum71.IMP_MAIN_PAGE) {
        iCurrentImpPage = Enum71.IMP_HOME_PAGE;
        fButtonPendingFlag = true;
        iCurrentProfileMode = 0;
        fFinishedCharGeneration = false;
        ResetCharacterStats();
      } else if (iCurrentImpPage == Enum71.IMP_FINISH) {
        iCurrentImpPage = Enum71.IMP_MAIN_PAGE;
        iCurrentProfileMode = 4;
        fFinishedCharGeneration = false;
        fButtonPendingFlag = true;
        // iCurrentProfileMode = 0;
        // fFinishedCharGeneration = FALSE;
        // ResetCharacterStats( );
      }

      else if (iCurrentImpPage == Enum71.IMP_PERSONALITY_QUIZ || iCurrentImpPage == Enum71.IMP_PERSONALITY_FINISH) {
        giMaxPersonalityQuizQuestion = 0;
        fStartOverFlag = true;
        iCurrentAnswer = -1;
        iCurrentImpPage = Enum71.IMP_PERSONALITY;
        fButtonPendingFlag = true;
      }

      else {
        if (iCurrentImpPage == Enum71.IMP_ATTRIBUTE_PAGE) {
          SetAttributes();
        }
        iCurrentImpPage = Enum71.IMP_MAIN_PAGE;
        iCurrentAnswer = -1;
      }
    }
  }

  return;
}

export function InitIMPSubPageList(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < Enum71.IMP_CONFIRM; iCounter++) {
    fVisitedIMPSubPages[iCounter] = false;
  }

  return;
}

function HasTheCurrentIMPPageBeenVisited(): boolean {
  // returns if we have vsisted the current IMP PageAlready

  // make sure we are not hosing memory
  Assert(iCurrentImpPage <= Enum71.IMP_NUM_PAGES);

  return fVisitedIMPSubPages[iCurrentImpPage];
}
