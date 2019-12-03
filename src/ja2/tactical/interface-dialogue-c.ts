namespace ja2 {

let sBasementEnterGridNos: INT16[] /* [] */ = [
  13362,
  13363,
  13364,
  13365,
  13525,
  13524,
];
let sBasementExitGridNos: INT16[] /* [] */ = [
  8047,
  8207,
  8208,
  8048,
  7888,
  7728,
  7727,
  7567,
];

let gusDialogueMessageBoxType: UINT16;

const TALK_PANEL_FACE_X = 6;
const TALK_PANEL_FACE_Y = 9;
const TALK_PANEL_NAME_X = 5;
const TALK_PANEL_NAME_Y = 114;
const TALK_PANEL_NAME_WIDTH = 92;
const TALK_PANEL_NAME_HEIGHT = 15;
const TALK_PANEL_REGION_STARTX = 102;
const TALK_PANEL_REGION_STARTY = 14;
const TALK_PANEL_REGION_SPACEY = 16;
const TALK_PANEL_REGION_HEIGHT = 12;
const TALK_PANEL_REGION_WIDTH = 95;

const TALK_PANEL_MENUTEXT_STARTX = 102;
const TALK_PANEL_MENUTEXT_STARTY = 16;
const TALK_PANEL_MENUTEXT_SPACEY = 16;
const TALK_PANEL_MENUTEXT_HEIGHT = 13;
const TALK_PANEL_MENUTEXT_WIDTH = 95;
const TALK_PANEL_BUTTON_X = 112;
const TALK_PANEL_BUTTON_Y = 114;
const TALK_PANEL_SHADOW_AREA_X = 97;
const TALK_PANEL_SHADOW_AREA_Y = 9;
const TALK_PANEL_SHADOW_AREA_WIDTH = 107;
const TALK_PANEL_SHADOW_AREA_HEIGHT = 102;

const TALK_PANEL_START_OFFSET_X = 10;

const TALK_PANEL_DEFAULT_SUBTITLE_WIDTH = 200;

const TALK_PANEL_CALC_SUBTITLE_WIDTH = 280;
const TALK_PANEL_CALC_SUBTITLE_HEIGHT = 125;

const TALK_PANEL_POPUP_LEFT = 0;
const TALK_PANEL_POPUP_TOP = 1;
const TALK_PANEL_POPUP_BOTTOM = 2;
const TALK_PANEL_POPUP_RIGHT = 3;

// chance vince will say random quote to player during conv.
const CHANCE_FOR_DOCTOR_TO_SAY_RANDOM_QUOTE = 20;

let ubTalkMenuApproachIDs: UINT8[] /* [] */ = [
  Enum296.APPROACH_REPEAT,
  Enum296.APPROACH_FRIENDLY,
  Enum296.APPROACH_DIRECT,
  Enum296.APPROACH_THREATEN,
  Enum296.APPROACH_BUYSELL,
  Enum296.APPROACH_RECRUIT,
];

const enum Enum211 {
  DIALOG_DONE,
  DIALOG_BUY_SELL,
}

// GLOBAL NPC STRUCT
export let gTalkPanel: NPC_DIALOGUE_TYPE;
export let gfInTalkPanel: boolean = false;
export let gpSrcSoldier: SOLDIERTYPE | null = null;
export let gpDestSoldier: SOLDIERTYPE | null = null;
export let gubSrcSoldierProfile: UINT8;
let gubNiceNPCProfile: UINT8 = NO_PROFILE;
let gubNastyNPCProfile: UINT8 = NO_PROFILE;

let gubTargetNPC: UINT8;
let gubTargetRecord: UINT8;
let gubTargetApproach: UINT8;
let gfShowDialogueMenu: boolean;
export let gfWaitingForTriggerTimer: boolean;
let guiWaitingForTriggerTime: UINT32;
export let iInterfaceDialogueBox: INT32 = -1;
let ubRecordThatTriggeredLiePrompt: UINT8;
let gfConversationPending: boolean = false;
let gpPendingDestSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
let gpPendingSrcSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
let gbPendingApproach: INT8;
let guiPendingApproachData: UINT32;

export let giHospitalTempBalance: INT32; // stores amount of money for current doctoring
export let giHospitalRefund: INT32; // stores amount of money given to hospital for doctoring that wasn't used
export let gbHospitalPriceModifier: INT8; // stores discount being offered

const enum Enum212 {
  HOSPITAL_UNSET = 0,
  HOSPITAL_NORMAL,
  HOSPITAL_BREAK,
  HOSPITAL_COST,
  HOSPITAL_FREEBIE,
  HOSPITAL_RANDOM_FREEBIE,
}

export function InitiateConversation(pDestSoldier: SOLDIERTYPE, pSrcSoldier: SOLDIERTYPE, bApproach: INT8, uiApproachData: UINT32): boolean {
  // ATE: OK, let's check the status of the Q
  // If it has something in it....delay this until after....
  if (DialogueQueueIsEmptyOrSomebodyTalkingNow()) {
    gfConversationPending = false;

    // Initiate directly....
    return InternalInitiateConversation(pDestSoldier, pSrcSoldier, bApproach, uiApproachData);
  } else {
    // Wait.....
    gfConversationPending = true;

    gpPendingDestSoldier = pDestSoldier;
    gpPendingSrcSoldier = pSrcSoldier;
    gbPendingApproach = bApproach;
    guiPendingApproachData = uiApproachData;

    // Engaged on conv...
    gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;

    // Turn off lock UI ( if on )
    guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
    HandleTacticalUI();

    // Turn on talking ui
    guiPendingOverrideEvent = Enum207.TA_TALKINGMENU;
    HandleTacticalUI();

    return false;
  }
}

export function HandlePendingInitConv(): void {
  if (gfConversationPending) {
    // OK, if pending, remove and now call........
    InternalInitiateConversation(gpPendingDestSoldier, gpPendingSrcSoldier, gbPendingApproach, guiPendingApproachData);
  }
}

function InternalInitiateConversation(pDestSoldier: SOLDIERTYPE, pSrcSoldier: SOLDIERTYPE, bApproach: INT8, uiApproachData: UINT32): boolean {
  // OK, init talking menu
  let fFromPending: boolean;

  fFromPending = gfConversationPending;

  // Set pending false
  gfConversationPending = false;

  // ATE: If we are already in menu, delete!
  if (gfInTalkPanel) {
    DeleteTalkingMenu();
  }

  if (!InitTalkingMenu(pDestSoldier.ubProfile, pDestSoldier.sGridNo)) {
    // If failed, and we were pending, unlock UI
    if (fFromPending) {
      gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);
    }

    return false;
  }

  // Set soldier pointer
  gpSrcSoldier = pSrcSoldier;
  gpDestSoldier = pDestSoldier;

  // Say first line...
  // CHRIS LOOK HERE
  if (gpSrcSoldier != null) {
    gubSrcSoldierProfile = gpSrcSoldier.ubProfile;
  } else {
    gubSrcSoldierProfile = NO_PROFILE;
  }

  // find which squad this guy is, then set selected squad to this guy
  if (pSrcSoldier.bTeam == gbPlayerNum && gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
    SetCurrentSquad(gpSrcSoldier.bAssignment, false);

    SelectSoldier(pSrcSoldier.ubID, false, false);
  }

  Converse(gTalkPanel.ubCharNum, gubSrcSoldierProfile, bApproach, uiApproachData);

  // If not from pedning...
  if (!fFromPending) {
    // Engaged on conv...
    gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;

    // Turn off lock UI ( if on )
    guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
    HandleTacticalUI();

    // Turn on talking ui
    guiPendingOverrideEvent = Enum207.TA_TALKINGMENU;
    HandleTacticalUI();
  } else {
    guiPendingOverrideEvent = Enum207.TA_TALKINGMENU;
    HandleTacticalUI();
  }

  return true;
}

function InitTalkingMenu(ubCharacterNum: UINT8, sGridNo: INT16): boolean {
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sX: INT16;
  let sY: INT16;

  // Get XY values
  {
    // Get XY locations for gridno.
    ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(sGridNo));

    // Get screen XY pos from map XY
    // Be carefull to convert to cell cords
    ({ sScreenX, sScreenY } = CellXYToScreenXY(((sXMapPos * CELL_X_SIZE)), ((sYMapPos * CELL_Y_SIZE))));

    // First get mouse xy screen location
    sX = sScreenX;
    sY = sScreenY;

    return InternalInitTalkingMenu(ubCharacterNum, sX, sY);
  }
}

export function InternalInitTalkingMenu(ubCharacterNum: UINT8, sX: INT16, sY: INT16): boolean {
  let iFaceIndex: INT32;
  let cnt: INT32;
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let pFace: FACETYPE;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let sCenterYVal: INT16;
  let sCenterXVal: INT16;
  let ubString: string /* UINT8[48] */;

  // disable scroll messages
  HideMessagesDuringNPCDialogue();

  // ATE: OK, let go of any other dialogues up.....
  EraseInterfaceMenus(false);

  gTalkPanel.ubCharNum = ubCharacterNum;
  gTalkPanel.bCurSelect = -1;
  gTalkPanel.bOldCurSelect = -1;
  gTalkPanel.fHandled = false;
  gTalkPanel.fOnName = false;

  // Load Video Object!
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "INTERFACE\\talkbox1.sti";
  // Load
  if (!(gTalkPanel.uiPanelVO = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // Get ETRLE Properties
  ({ usWidth, usHeight } = GetVideoObjectETRLESubregionProperties(gTalkPanel.uiPanelVO, 0));

  // Set values into structure
  gTalkPanel.usWidth = usWidth;
  gTalkPanel.usHeight = usHeight;

  // Check coords
  {
    // CHECK FOR LEFT/RIGHT
    sCenterXVal = gTalkPanel.usWidth / 2;

    sX -= sCenterXVal;

    // Check right
    if ((sX + gTalkPanel.usWidth) > 640) {
      sX = 640 - gTalkPanel.usWidth;
    }

    // Check left
    if (sX < 0) {
      sX = 0;
    }

    // Now check for top
    // Center in the y
    sCenterYVal = gTalkPanel.usHeight / 2;

    sY -= sCenterYVal;

    if (sY < gsVIEWPORT_WINDOW_START_Y) {
      sY = gsVIEWPORT_WINDOW_START_Y;
    }

    // Check for bottom
    if ((sY + gTalkPanel.usHeight) > 340) {
      sY = 340 - gTalkPanel.usHeight;
    }
  }

  // Set values
  gTalkPanel.sX = sX;
  gTalkPanel.sY = sY;

  CalculatePopupTextOrientation(TALK_PANEL_CALC_SUBTITLE_WIDTH, TALK_PANEL_CALC_SUBTITLE_HEIGHT);

  // Create face ( a big face! )....
  iFaceIndex = InitFace(ubCharacterNum, NOBODY, FACE_BIGFACE | FACE_POTENTIAL_KEYWAIT);

  if (iFaceIndex == -1) {
    return false;
  }

  // Set face
  gTalkPanel.iFaceIndex = iFaceIndex;

  // Init face to auto..., create video overlay....
  pFace = gFacesData[iFaceIndex];

  // Create mouse regions...
  sX = gTalkPanel.sX + TALK_PANEL_REGION_STARTX;
  sY = gTalkPanel.sY + TALK_PANEL_REGION_STARTY;

  // Define main region
  MSYS_DefineRegion(gTalkPanel.ScreenRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Add region
  MSYS_AddRegion(gTalkPanel.ScreenRegion);

  // Define main region
  MSYS_DefineRegion(gTalkPanel.BackRegion, (gTalkPanel.sX), (gTalkPanel.sY), (gTalkPanel.sX + gTalkPanel.usWidth), (gTalkPanel.sY + gTalkPanel.usHeight), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, TalkPanelBaseRegionClickCallback);
  // Add region
  MSYS_AddRegion(gTalkPanel.BackRegion);

  // Define name region
  MSYS_DefineRegion(gTalkPanel.NameRegion, (gTalkPanel.sX + TALK_PANEL_NAME_X), (gTalkPanel.sY + TALK_PANEL_NAME_Y), (gTalkPanel.sX + TALK_PANEL_NAME_WIDTH + TALK_PANEL_NAME_X), (gTalkPanel.sY + TALK_PANEL_NAME_HEIGHT + TALK_PANEL_NAME_Y), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, TalkPanelNameRegionMoveCallback, TalkPanelNameRegionClickCallback);
  // Add region
  MSYS_AddRegion(gTalkPanel.NameRegion);

  for (cnt = 0; cnt < 6; cnt++) {
    // Build a mouse region here that is over any others.....
    MSYS_DefineRegion(gTalkPanel.Regions[cnt], (sX), (sY), (sX + TALK_PANEL_REGION_WIDTH), (sY + TALK_PANEL_REGION_HEIGHT), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, TalkPanelMoveCallback, TalkPanelClickCallback);
    // Add region
    MSYS_AddRegion(gTalkPanel.Regions[cnt]);
    MSYS_SetRegionUserData(gTalkPanel.Regions[cnt], 0, cnt);

    sY += TALK_PANEL_REGION_SPACEY;
  }

  // Build save buffer
  // Create a buffer for him to go!
  // OK, ignore screen widths, height, only use BPP
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = pFace.usFaceWidth;
  vs_desc.usHeight = pFace.usFaceHeight;
  vs_desc.ubBitDepth = 16;
  if (!AddVideoSurface(addressof(vs_desc), addressof(gTalkPanel.uiSaveBuffer))) {
    return false;
  }

  // Set face to auto
  SetAutoFaceActive(gTalkPanel.uiSaveBuffer, FACE_AUTO_RESTORE_BUFFER, iFaceIndex, 0, 0);
  gFacesData[iFaceIndex].uiFlags |= FACE_INACTIVE_HANDLED_ELSEWHERE;

  // Load buttons, create button
  ubString = "INTERFACE\\talkbox2.sti";
  gTalkPanel.iButtonImages = LoadButtonImage(ubString, -1, 3, -1, 4, -1);

  gTalkPanel.uiCancelButton = CreateIconAndTextButton(gTalkPanel.iButtonImages, zDialogActions[Enum211.DIALOG_DONE], MILITARYFONT1(), 33, DEFAULT_SHADOW, 33, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gTalkPanel.sX + TALK_PANEL_BUTTON_X), (gTalkPanel.sY + TALK_PANEL_BUTTON_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), DoneTalkingButtonClickCallback);

  SpecifyButtonHilitedTextColors(gTalkPanel.uiCancelButton, FONT_MCOLOR_WHITE, DEFAULT_SHADOW);

  // Turn off dirty flags
  ButtonList[gTalkPanel.uiCancelButton].uiFlags &= (~BUTTON_DIRTY);

  // Render once!
  RenderAutoFace(gTalkPanel.iFaceIndex);

  gfInTalkPanel = true;

  gfIgnoreScrolling = true;

  // return OK....
  return true;
}

function DoneTalkingButtonClickCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, pickup item....
    gTalkPanel.fHandled = true;
    gTalkPanel.fHandledTalkingVal = gFacesData[gTalkPanel.iFaceIndex].fTalking;
    gTalkPanel.fHandledCanDeleteVal = true;
  }
}

export function DeleteTalkingMenu(): void {
  let cnt: INT32;

  if (!gfInTalkPanel)
    return;

  // Delete sound if playing....
  ShutupaYoFace(gTalkPanel.iFaceIndex);

  // Delete screen region
  MSYS_RemoveRegion(gTalkPanel.ScreenRegion);

  // Delete main region
  MSYS_RemoveRegion(gTalkPanel.BackRegion);

  // Delete name region
  MSYS_RemoveRegion(gTalkPanel.NameRegion);

  // Delete mouse regions
  for (cnt = 0; cnt < 6; cnt++) {
    MSYS_RemoveRegion(gTalkPanel.Regions[cnt]);
  }

  if (gTalkPanel.fTextRegionOn) {
    // Remove
    MSYS_RemoveRegion(gTalkPanel.TextRegion);
    gTalkPanel.fTextRegionOn = false;
  }

  // Delete save buffer
  DeleteVideoSurfaceFromIndex(gTalkPanel.uiSaveBuffer);

  // Remove video object
  DeleteVideoObjectFromIndex(gTalkPanel.uiPanelVO);

  // Remove face....
  DeleteFace(gTalkPanel.iFaceIndex);

  // Remove button
  RemoveButton(gTalkPanel.uiCancelButton);

  // Remove button images
  UnloadButtonImage(gTalkPanel.iButtonImages);

  // Set cursor back to normal mode...
  guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;

  // Rerender world
  SetRenderFlags(RENDER_FLAG_FULL);

  gfInTalkPanel = false;

  gfIgnoreScrolling = false;

  // Set this guy up as NOT engaged in conversation
  gpDestSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);

  // NOT Engaged on conv...
  if (!giNPCReferenceCount) {
    gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);
  }

  // restore scroll messages in tactical
  UnHideMessagesDuringNPCDialogue();

  if (CheckFact(Enum170.FACT_NEED_TO_SAY_SOMETHING, 0)) {
    if (DialogueQueueIsEmpty() && !gfWaitingForTriggerTimer) {
      let ubNPC: UINT8;
      let fNice: boolean = false;
      let pNPC: SOLDIERTYPE | null;

      if (gubNiceNPCProfile != NO_PROFILE) {
        ubNPC = gubNiceNPCProfile;
        fNice = true;
      } else {
        ubNPC = gubNastyNPCProfile;
      }

      if (ubNPC != NO_PROFILE) {
        pNPC = FindSoldierByProfileID(ubNPC, false);
        if (pNPC) {
          // find someone to say their "nice guy" line
          if (fNice) {
            SayQuote58FromNearbyMercInSector(pNPC.sGridNo, 10, Enum202.QUOTE_LISTEN_LIKABLE_PERSON, gMercProfiles[ubNPC].bSex);
          } else {
            SayQuoteFromNearbyMercInSector(pNPC.sGridNo, 10, Enum202.QUOTE_ANNOYING_PC);
          }
          gubNiceNPCProfile = NO_PROFILE;
          gubNastyNPCProfile = NO_PROFILE;
          SetFactFalse(Enum170.FACT_NEED_TO_SAY_SOMETHING);
        }
      }
    }
  }

  if (iInterfaceDialogueBox != -1) {
    RemoveMercPopupBoxFromIndex(iInterfaceDialogueBox);
    iInterfaceDialogueBox = -1;
  }

  // Save time for give item
  gTacticalStatus.uiTimeCounterForGiveItemSrc = GetJA2Clock();
}

export function RenderTalkingMenu(): void {
  let cnt: INT32;
  let pFace: FACETYPE;
  let sFontX: INT16;
  let sFontY: INT16;
  let sX: INT16;
  let sY: INT16;
  let ubCharacterNum: UINT8 = gTalkPanel.ubCharNum;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let usTextBoxWidth: UINT16;
  let usTextBoxHeight: UINT16;
  let zTempString: string /* CHAR16[128] */;

  if (!gfInTalkPanel) {
    return;
  }

  pFace = gFacesData[gTalkPanel.iFaceIndex];

  if (gTalkPanel.fDirtyLevel == DIRTYLEVEL2) {
    SetFont(MILITARYFONT1());

    // Render box!
    BltVideoObjectFromIndex(FRAME_BUFFER, gTalkPanel.uiPanelVO, 0, gTalkPanel.sX, gTalkPanel.sY, VO_BLT_SRCTRANSPARENCY, null);

    // Render name
    if (gTalkPanel.fOnName) {
      SetFontBackground(FONT_MCOLOR_BLACK);
      SetFontForeground(FONT_WHITE);
    } else {
      SetFontBackground(FONT_MCOLOR_BLACK);
      SetFontForeground(33);
    }
    ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates((gTalkPanel.sX + TALK_PANEL_NAME_X), (gTalkPanel.sY + TALK_PANEL_NAME_Y), TALK_PANEL_NAME_WIDTH, TALK_PANEL_NAME_HEIGHT, MILITARYFONT1(), "%s", gMercProfiles[gTalkPanel.ubCharNum].zNickname));
    mprintf(sFontX, sFontY, "%s", gMercProfiles[ubCharacterNum].zNickname);

    // Set font settings back
    SetFontShadow(DEFAULT_SHADOW);

    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    pSrcBuf = LockVideoSurface(gTalkPanel.uiSaveBuffer, addressof(uiSrcPitchBYTES));

    Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, (gTalkPanel.sX + TALK_PANEL_FACE_X), (gTalkPanel.sY + TALK_PANEL_FACE_Y), 0, 0, pFace.usFaceWidth, pFace.usFaceHeight);

    UnLockVideoSurface(FRAME_BUFFER);
    UnLockVideoSurface(gTalkPanel.uiSaveBuffer);

    MarkButtonsDirty();

    // If guy is talking.... shadow area
    if (pFace.fTalking || !DialogueQueueIsEmpty()) {
      ShadowVideoSurfaceRect(FRAME_BUFFER, (gTalkPanel.sX + TALK_PANEL_SHADOW_AREA_X), (gTalkPanel.sY + TALK_PANEL_SHADOW_AREA_Y), (gTalkPanel.sX + TALK_PANEL_SHADOW_AREA_X + TALK_PANEL_SHADOW_AREA_WIDTH), (gTalkPanel.sY + TALK_PANEL_SHADOW_AREA_Y + TALK_PANEL_SHADOW_AREA_HEIGHT));

      // Disable mouse regions....
      for (cnt = 0; cnt < 6; cnt++) {
        MSYS_DisableRegion(gTalkPanel.Regions[cnt]);
      }

      DisableButton(gTalkPanel.uiCancelButton);

      gTalkPanel.bCurSelect = -1;
    } else {
      // Enable mouse regions....
      for (cnt = 0; cnt < 6; cnt++) {
        MSYS_EnableRegion(gTalkPanel.Regions[cnt]);
      }

      // Restore selection....
      gTalkPanel.bCurSelect = gTalkPanel.bOldCurSelect;

      EnableButton(gTalkPanel.uiCancelButton);
    }

    InvalidateRegion(gTalkPanel.sX, gTalkPanel.sY, gTalkPanel.sX + gTalkPanel.usWidth, gTalkPanel.sY + gTalkPanel.usHeight);

    if (gTalkPanel.fSetupSubTitles) {
      if (iInterfaceDialogueBox != -1) {
        // Remove any old ones....
        RemoveMercPopupBoxFromIndex(iInterfaceDialogueBox);
        iInterfaceDialogueBox = -1;
      }

      SET_USE_WINFONTS(true);
      SET_WINFONT(giSubTitleWinFont);
      iInterfaceDialogueBox = PrepareMercPopupBox(iInterfaceDialogueBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, gTalkPanel.zQuoteStr, TALK_PANEL_DEFAULT_SUBTITLE_WIDTH, 0, 0, 0, addressof(usTextBoxWidth), addressof(usTextBoxHeight));
      SET_USE_WINFONTS(false);

      gTalkPanel.fSetupSubTitles = false;

      CalculatePopupTextOrientation(usTextBoxWidth, usTextBoxHeight);
      CalculatePopupTextPosition(usTextBoxWidth, usTextBoxHeight);

      // Define main region
      if (gTalkPanel.fTextRegionOn) {
        // Remove
        MSYS_RemoveRegion(gTalkPanel.TextRegion);
        gTalkPanel.fTextRegionOn = false;
      }

      MSYS_DefineRegion(gTalkPanel.TextRegion, gTalkPanel.sPopupX, gTalkPanel.sPopupY, (gTalkPanel.sPopupX + usTextBoxWidth), (gTalkPanel.sPopupY + usTextBoxHeight), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, TextRegionClickCallback);
      // Add region
      MSYS_AddRegion(gTalkPanel.TextRegion);

      // Set to true
      gTalkPanel.fTextRegionOn = true;
    }

    if (gTalkPanel.fRenderSubTitlesNow) {
      RenderMercPopUpBoxFromIndex(iInterfaceDialogueBox, gTalkPanel.sPopupX, gTalkPanel.sPopupY, FRAME_BUFFER);
    }
  }

  if (gTalkPanel.fDirtyLevel > DIRTYLEVEL0) {
    SetFont(MILITARYFONT1());

    // Set some font settings
    SetFontForeground(FONT_BLACK);
    SetFontShadow(MILITARY_SHADOW);

    // Create menu selections....
    sX = gTalkPanel.sX + TALK_PANEL_MENUTEXT_STARTX;
    sY = gTalkPanel.sY + TALK_PANEL_MENUTEXT_STARTY;

    for (cnt = 0; cnt < 6; cnt++) {
      if (gTalkPanel.bCurSelect == cnt) {
        SetFontForeground(FONT_WHITE);
        SetFontShadow(DEFAULT_SHADOW);
      } else {
        SetFontForeground(FONT_BLACK);
        SetFontShadow(MILITARY_SHADOW);
      }

      {
        if (CHEATER_CHEAT_LEVEL() && gubSrcSoldierProfile != NO_PROFILE && ubCharacterNum != NO_PROFILE)
        {
          switch (cnt) {
            case 0:
              ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(sX, sY, TALK_PANEL_MENUTEXT_WIDTH, TALK_PANEL_MENUTEXT_HEIGHT, MILITARYFONT1(), "%s", zTalkMenuStrings[cnt]));
              mprintf(sFontX, sFontY, "%s", zTalkMenuStrings[cnt]);
              break;
            case 4:
              // if its an arms dealer
              if (IsMercADealer(ubCharacterNum)) {
                let ubType: UINT8;

                // determine the 'kind' of arms dealer
                ubType = GetTypeOfArmsDealer(GetArmsDealerIDFromMercID(ubCharacterNum));

                zTempString = zDealerStrings[ubType];
              } else
                zTempString = zTalkMenuStrings[cnt];

              ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(sX, sY, TALK_PANEL_MENUTEXT_WIDTH, TALK_PANEL_MENUTEXT_HEIGHT, MILITARYFONT1(), "%s", zTempString));
              mprintf(sFontX, sFontY, "%s", zTempString);
              break;
            default:
              ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(sX, sY, TALK_PANEL_MENUTEXT_WIDTH, TALK_PANEL_MENUTEXT_HEIGHT, MILITARYFONT1(), "%s (%d)", zTalkMenuStrings[cnt], ubTalkMenuApproachIDs[cnt]));
              mprintf(sFontX, sFontY, "%s (%d)", zTalkMenuStrings[cnt], CalcDesireToTalk(ubCharacterNum, gubSrcSoldierProfile, ubTalkMenuApproachIDs[cnt]));
              break;
          }
        } else {
          if (cnt == 4) {
            // if its an arms dealer
            if (IsMercADealer(ubCharacterNum)) {
              let ubType: UINT8;

              // determine the 'kind' of arms dealer
              ubType = GetTypeOfArmsDealer(GetArmsDealerIDFromMercID(ubCharacterNum));

              zTempString = zDealerStrings[ubType];
            } else
              zTempString = zTalkMenuStrings[cnt];

            ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(sX, sY, TALK_PANEL_MENUTEXT_WIDTH, TALK_PANEL_MENUTEXT_HEIGHT, MILITARYFONT1(), "%s", zTempString));
            mprintf(sFontX, sFontY, "%s", zTempString);
          } else {
            ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates(sX, sY, TALK_PANEL_MENUTEXT_WIDTH, TALK_PANEL_MENUTEXT_HEIGHT, MILITARYFONT1(), "%s", zTalkMenuStrings[cnt]));
            mprintf(sFontX, sFontY, "%s", zTalkMenuStrings[cnt]);
          }
        }
      }

      sY += TALK_PANEL_MENUTEXT_SPACEY;
    }
  }

  // Set font settings back
  SetFontShadow(DEFAULT_SHADOW);

  gTalkPanel.fDirtyLevel = 0;
}

function TalkPanelMoveCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  let uiItemPos: UINT32;

  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    // Set current selected guy....
    gTalkPanel.bCurSelect = uiItemPos;
    gTalkPanel.bOldCurSelect = gTalkPanel.bCurSelect;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gTalkPanel.bCurSelect = -1;
    gTalkPanel.bOldCurSelect = -1;
  }
}

function TalkPanelClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  let uiItemPos: UINT32;
  let fDoConverse: boolean = true;
  uiItemPos = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Donot do this if we are talking already
    if (!gFacesData[gTalkPanel.iFaceIndex].fTalking) {
      if (ubTalkMenuApproachIDs[uiItemPos] == Enum296.APPROACH_BUYSELL) {
        // if its an arms dealer
        if (IsMercADealer(gTalkPanel.ubCharNum)) {
          if (NPCHasUnusedRecordWithGivenApproach(gTalkPanel.ubCharNum, Enum296.APPROACH_BUYSELL)) {
            TriggerNPCWithGivenApproach(gTalkPanel.ubCharNum, Enum296.APPROACH_BUYSELL, true);
          } else {
            DeleteTalkingMenu();

            // Enter the shopkeeper interface
            EnterShopKeeperInterfaceScreen(gTalkPanel.ubCharNum);
          }

          /*
          // check if this is a shopkeeper who has been shutdown
          if( HandleShopKeepHasBeenShutDown( gTalkPanel.ubCharNum ) == FALSE )
          {
                  DeleteTalkingMenu( );

                  EnterShopKeeperInterfaceScreen( gTalkPanel.ubCharNum );
          }
          */
        } else {
          // Do something different if we selected the 'give' approach
          // Close panel, set UI guy to wait a sec, open inv if not done so yet
          gTalkPanel.fHandled = true;
          gTalkPanel.fHandledTalkingVal = gFacesData[gTalkPanel.iFaceIndex].fTalking;
          gTalkPanel.fHandledCanDeleteVal = true;

          // open inv panel...
          gfSwitchPanel = true;
          gbNewPanel = Enum215.SM_PANEL;
          gubNewPanelParam = (<SOLDIERTYPE>gpSrcSoldier).ubID;

          // Wait!
          (<SOLDIERTYPE>gpDestSoldier).bNextAction = Enum289.AI_ACTION_WAIT;
          (<SOLDIERTYPE>gpDestSoldier).usNextActionData = 10000;

          // UNless he's has a pending action, delete what he was doing!
          // Cancel anything he was doing
          if ((<SOLDIERTYPE>gpDestSoldier).bAction != Enum289.AI_ACTION_PENDING_ACTION) {
            CancelAIAction((<SOLDIERTYPE>gpDestSoldier), 1);
          }
        }
      } else {
        if (fDoConverse) {
          // Speak
          Converse(gTalkPanel.ubCharNum, gubSrcSoldierProfile, ubTalkMenuApproachIDs[uiItemPos], 0);
        }
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

/* static */ let TalkPanelBaseRegionClickCallback__fLButtonDown: boolean = false;
function TalkPanelBaseRegionClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    TalkPanelBaseRegionClickCallback__fLButtonDown = true;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP && TalkPanelBaseRegionClickCallback__fLButtonDown) {
    // Only do this if we are talking already
    if (gFacesData[gTalkPanel.iFaceIndex].fTalking) {
      // Stop speech, cancel
      InternalShutupaYoFace(gTalkPanel.iFaceIndex, false);

      TalkPanelBaseRegionClickCallback__fLButtonDown = false;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    TalkPanelBaseRegionClickCallback__fLButtonDown = false;
  }
}

function TalkPanelNameRegionClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Donot do this if we are talking already
    if (!gFacesData[gTalkPanel.iFaceIndex].fTalking) {
      // Say who are you?
      Converse(gTalkPanel.ubCharNum, gubSrcSoldierProfile, Enum296.NPC_WHOAREYOU, 0);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function TalkPanelNameRegionMoveCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // Donot do this if we are talking already
  if (gFacesData[gTalkPanel.iFaceIndex].fTalking) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    // Set current selected guy....
    gTalkPanel.fOnName = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gTalkPanel.fOnName = false;
  }
}

// Dirty menu
export function SetTalkingMenuDirty(fDirtyLevel: boolean): void {
  gTalkPanel.fDirtyLevel = fDirtyLevel;
}

export function HandleTalkingMenu(): boolean {
  if (!gfInTalkPanel) {
    return false;
  }

  if (gTalkPanel.fHandled) {
    return HandleTalkingMenuEscape(gTalkPanel.fHandledCanDeleteVal, false);
  }

  return false;
}

export function TalkingMenuDialogue(usQuoteNum: UINT16): boolean {
  // Set back current select....
  gTalkPanel.bCurSelect = -1;
  gTalkPanel.fOnName = false;
  // gTalkPanel.fHandled		= FALSE;

  if (CharacterDialogue(gTalkPanel.ubCharNum, usQuoteNum, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI, false, false) == false) {
    return false;
  }
  return true;
}

export function ProfileCurrentlyTalkingInDialoguePanel(ubProfile: UINT8): boolean {
  if (gfInTalkPanel) {
    if (gpDestSoldier != null) {
      if (gpDestSoldier.ubProfile == ubProfile) {
        return true;
      }
    }
  }

  return false;
}

export function HandleTalkingMenuEscape(fCanDelete: boolean, fFromEscKey: boolean): boolean {
  let pFace: FACETYPE;
  let fTalking: boolean = false;

  if (!gfInTalkPanel) {
    return false;
  }

  pFace = gFacesData[gTalkPanel.iFaceIndex];

  // If we are in the process of speaking, stop this quote an move on...
  // If we have been 'handled' by an outside source, check what was our talking value at the time
  if (gTalkPanel.fHandled) {
    fTalking = gTalkPanel.fHandledTalkingVal;
  } else {
    fTalking = pFace.fTalking;
  }

  // Set to false
  gTalkPanel.fHandled = false;

  if (!fFromEscKey) {
    if (fTalking) {
      ShutupaYoFace(gTalkPanel.iFaceIndex);
    }
    // Else if our queue is empty, delete emnu
    else {
      if (DialogueQueueIsEmpty() && fCanDelete) {
        // Delete panel
        DeleteTalkingMenu();
        // reset records which are on a can-say-once-per-convo basis
        ResetOncePerConvoRecordsForNPC(gpDestSoldier.ubProfile);
        return true;
      }
    }
  } else {
    if (DialogueQueueIsEmpty() && fCanDelete) {
      // Delete panel
      DeleteTalkingMenu();
      // reset records which are on a can-say-once-per-convo basis
      ResetOncePerConvoRecordsForNPC(gpDestSoldier.ubProfile);
      return true;
    }
  }
  return false;
}

export function HandleTalkingMenuBackspace(): void {
  let pFace: FACETYPE;
  let fTalking: boolean = false;

  if (!gfInTalkPanel) {
    return;
  }

  pFace = gFacesData[gTalkPanel.iFaceIndex];

  // If we are in the process of speaking, stop this quote an move on...
  // If we have been 'handled' by an outside source, check what was our talking value at the time
  /*
  if ( gTalkPanel.fHandled )
  {
          fTalking = gTalkPanel.fHandledTalkingVal;
  }
  else
  {
          fTalking = pFace->fTalking;
  }

  // Set to false
  gTalkPanel.fHandled = FALSE;


  if ( fTalking )
  */
  if (pFace.fTalking) {
    ShutupaYoFace(gTalkPanel.iFaceIndex);
  }
}

function CalculatePopupTextOrientation(sWidth: INT16, sHeight: INT16): void {
  let fOKLeft: boolean = false;
  let fOKTop: boolean = false;
  let fOKBottom: boolean = false;
  let fOK: boolean = false;
  let sX: INT16;
  let sY: INT16;

  // Check Left
  sX = gTalkPanel.sX - sWidth;

  if (sX > 0) {
    fOKLeft = true;
  }

  // Check bottom
  sY = gTalkPanel.sY + sHeight + gTalkPanel.usHeight;

  if (sY < 340) {
    fOKBottom = true;
  }

  // Check top
  sY = gTalkPanel.sY - sHeight;

  if (sY > gsVIEWPORT_WINDOW_START_Y) {
    fOKTop = true;
  }

  // OK, now decide where to put it!

  // First precidence is bottom
  if (fOKBottom) {
    gTalkPanel.ubPopupOrientation = TALK_PANEL_POPUP_BOTTOM;

    fOK = true;
  }

  if (!fOK) {
    // Try left
    if (fOKLeft) {
      // Our panel should not be heigher than our dialogue talking panel, so don't bother with the height checks!
      gTalkPanel.ubPopupOrientation = TALK_PANEL_POPUP_LEFT;
      fOK = true;
    }
  }

  // Now at least top should work
  if (!fOK) {
    // Try top!
    if (fOKTop) {
      gTalkPanel.ubPopupOrientation = TALK_PANEL_POPUP_TOP;

      fOK = true;
    }
  }

  // failed all the above
  if (!fOK) {
    // when all else fails go right
    gTalkPanel.ubPopupOrientation = TALK_PANEL_POPUP_RIGHT;
    fOK = true;
  }
  // If we don't have anything here... our viewport/box is too BIG! ( which should never happen
  // DebugMsg
}

function CalculatePopupTextPosition(sWidth: INT16, sHeight: INT16): void {
  switch (gTalkPanel.ubPopupOrientation) {
    case TALK_PANEL_POPUP_LEFT:

      // Set it here!
      gTalkPanel.sPopupX = gTalkPanel.sX - sWidth;
      // Center in height!
      gTalkPanel.sPopupY = gTalkPanel.sY + (gTalkPanel.usHeight / 2) - (sHeight / 2);
      break;
    case TALK_PANEL_POPUP_RIGHT:
      // Set it here!
      gTalkPanel.sPopupX = gTalkPanel.sX + gTalkPanel.usWidth + 1;
      // Center in height!
      gTalkPanel.sPopupY = gTalkPanel.sY + (gTalkPanel.usHeight / 2) - (sHeight / 2);
      break;
    case TALK_PANEL_POPUP_BOTTOM:

      // Center in X
      gTalkPanel.sPopupX = gTalkPanel.sX + (gTalkPanel.usWidth / 2) - (sWidth / 2);
      // Calc height
      gTalkPanel.sPopupY = gTalkPanel.sY + gTalkPanel.usHeight;
      break;

    case TALK_PANEL_POPUP_TOP:

      // Center in X
      gTalkPanel.sPopupX = gTalkPanel.sX + (gTalkPanel.usWidth / 2) - (sWidth / 2);
      // Calc height
      gTalkPanel.sPopupY = gTalkPanel.sY - sHeight;
      break;
  }
}

export function TalkingMenuGiveItem(ubNPC: UINT8, pObject: OBJECTTYPE, bInvPos: INT8): boolean {
  if (SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_GIVE_ITEM, ubNPC, pObject, bInvPos, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI) == false) {
    return false;
  }

  return true;
}

export function NPCTriggerNPC(ubTargetNPC: UINT8, ubTargetRecord: UINT8, ubTargetApproach: UINT8, fShowDialogueMenu: boolean): boolean {
  // CHECKF( SpecialCharacterDialogueEvent( DIALOGUE_SPECIAL_EVENT_TRIGGER_NPC, ubTargetNPC, ubTargetRecord, fShowDialogueMenu, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI ) != FALSE );
  if (SpecialCharacterDialogueEventWithExtraParam(DIALOGUE_SPECIAL_EVENT_TRIGGER_NPC, ubTargetNPC, ubTargetRecord, fShowDialogueMenu, ubTargetApproach, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI) == false) {
    return false;
  }

  return true;
}

export function NPCGotoGridNo(ubTargetNPC: UINT8, usGridNo: UINT16, ubRecordNum: UINT8): boolean {
  if (SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_GOTO_GRIDNO, ubTargetNPC, usGridNo, ubRecordNum, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI) == false) {
    return false;
  }

  return true;
}

export function NPCDoAction(ubTargetNPC: UINT8, usActionCode: UINT16, ubQuoteNum: UINT8): boolean {
  if (SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_DO_ACTION, ubTargetNPC, usActionCode, ubQuoteNum, gTalkPanel.iFaceIndex, DIALOGUE_NPC_UI) == false) {
    return false;
  }

  return true;
}

export function NPCClosePanel(): boolean {
  if (SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_CLOSE_PANEL, 0, 0, 0, 0, DIALOGUE_NPC_UI) == false) {
    return false;
  }

  return true;
}

function SourceSoldierPointerIsValidAndReachableForGive(pGiver: SOLDIERTYPE | null): boolean {
  let sAdjGridNo: INT16;

  if (!gpSrcSoldier) {
    return false;
  }
  if (!gpSrcSoldier.bActive || !gpSrcSoldier.bInSector) {
    return false;
  }
  if (gpSrcSoldier.bLife < OKLIFE || (gpSrcSoldier.bBreath < OKBREATH && gpSrcSoldier.bCollapsed)) {
    return false;
  }

  if (!pGiver) {
    return false;
  }

  // pointer should always be valid anyhow
  if (PythSpacesAway(pGiver.sGridNo, gpSrcSoldier.sGridNo) > MaxDistanceVisible()) {
    return false;
  }

  sAdjGridNo = FindAdjacentGridEx(pGiver, gpSrcSoldier.sGridNo, null, null, false, false);
  if (sAdjGridNo == -1) {
    return false;
  }

  return true;
}

export function HandleNPCItemGiven(ubNPC: UINT8, pObject: OBJECTTYPE, bInvPos: INT8): void {
  // Give it to the NPC soldier
  //	AutoPlaceObject( gpDestSoldier, pObject, FALSE );

  // OK< if the timer is < 5000, use who was last in the talk panel box.
  if (!SourceSoldierPointerIsValidAndReachableForGive(gpDestSoldier)) {
    // just drop it

    // have to walk up to the merc closest to ubNPC

    let pNPC: SOLDIERTYPE | null;

    pNPC = FindSoldierByProfileID(ubNPC, false);
    if (pNPC) {
      AddItemToPool(pNPC.sGridNo, pNPC.inv[bInvPos], 1, 0, 0, 0);
      TriggerNPCWithGivenApproach(ubNPC, Enum296.APPROACH_DONE_GIVING_ITEM, true);
    }
  } else {
    // Remove dialogue!
    DeleteTalkingMenu();

    // Give this to buddy!
    SoldierGiveItem(<SOLDIERTYPE>gpDestSoldier, <SOLDIERTYPE>gpSrcSoldier, pObject, bInvPos);
  }
}

export function HandleNPCTriggerNPC(ubTargetNPC: UINT8, ubTargetRecord: UINT8, fShowDialogueMenu: boolean, ubTargetApproach: UINT8): void {
  let pSoldier: SOLDIERTYPE | null;

  pSoldier = FindSoldierByProfileID(ubTargetNPC, false);

  if (pSoldier == null) {
    return;
  }

  // Save values for trigger function
  gubTargetNPC = ubTargetNPC;
  gubTargetRecord = ubTargetRecord;
  gubTargetApproach = ubTargetApproach;
  gfShowDialogueMenu = fShowDialogueMenu;

  if (pSoldier.bTeam == gbPlayerNum) {
    // make sure they are in the right alert status to receive orders (it's a bug that
    // this could be set for the player...)
    pSoldier.bAlertStatus = Enum243.STATUS_GREEN;
    pSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
  }

  // OH BOY, CHECK IF THIS IS THE SAME PERSON WHO IS ON THE MENU
  // RIGHT NOW, IF SO , HANDLE DIRECTLY WITHOUT THIS DELAY!
  // IF WE ARE TO DISPLAY MENU AS WELL....
  if (gfInTalkPanel) {
    if (gpDestSoldier == pSoldier && fShowDialogueMenu) {
      HandleNPCTrigger();
      return;
    }
  }

  if (fShowDialogueMenu) {
    // ALRIGHTY, NOW DO THIS!
    // WAIT IN NON-INTERACTIVE MODE UNTIL TIMER IS DONE
    // SO WE CAN SEE NPC RADIO LOCATOR
    // THEN AFTER THIS IS DONE, DO THE STUFF
    // Setup timer!
    gfWaitingForTriggerTimer = true;
    guiWaitingForTriggerTime = GetJA2Clock();

    // Setup locator!
    ShowRadioLocator(pSoldier.ubID, SHOW_LOCATOR_FAST);

    // If he's visible, locate...
    if (pSoldier.bVisible != -1) {
      LocateSoldier(pSoldier.ubID, 0);
    }

    guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
  } else {
    HandleNPCTrigger();
  }

  // Being already here, we know that this is not the guy whose panel is up.
  // Only close the panel if dialogue is involved in the new record.
  if (RecordHasDialogue(ubTargetNPC, ubTargetRecord)) {
    // Shutdown any panel we had up...
    DeleteTalkingMenu();
  }
}

function HandleNPCTrigger(): void {
  let pSoldier: SOLDIERTYPE | null;
  let sPlayerGridNo: INT16;
  let ubPlayerID: UINT8;

  pSoldier = FindSoldierByProfileID(gubTargetNPC, false);
  if (!pSoldier) {
    return;
  }

  if (gfInTalkPanel) {
    if (pSoldier == gpDestSoldier) {
      if (gfShowDialogueMenu) {
        // Converse another way!
        Converse(gubTargetNPC, NO_PROFILE, gubTargetApproach, gubTargetRecord);
      } else if (gpSrcSoldier != null) // if we can, reinitialize menu
      {
        InitiateConversation(gpDestSoldier, gpSrcSoldier, gubTargetApproach, gubTargetRecord);
      }
    } else {
      Converse(gubTargetNPC, NO_PROFILE, gubTargetApproach, gubTargetRecord);
    }
  } else {
    // Now start new one...
    if (gfShowDialogueMenu) {
      if (SourceSoldierPointerIsValidAndReachableForGive(pSoldier)) {
        InitiateConversation(pSoldier, gpSrcSoldier, gubTargetApproach, gubTargetRecord);
        return;
      } else {
        sPlayerGridNo = ClosestPC(pSoldier, null);
        if (sPlayerGridNo != NOWHERE) {
          ubPlayerID = WhoIsThere2(sPlayerGridNo, 0);
          if (ubPlayerID != NOBODY) {
            InitiateConversation(pSoldier, MercPtrs[ubPlayerID], gubTargetApproach, gubTargetRecord);
            return;
          }
        }
      }
      // else
      InitiateConversation(pSoldier, pSoldier, gubTargetApproach, gubTargetRecord);
    } else {
      // Converse another way!
      Converse(gubTargetNPC, NO_PROFILE, gubTargetApproach, gubTargetRecord);
    }
  }
}

export function HandleWaitTimerForNPCTrigger(): void {
  if (gfWaitingForTriggerTimer) {
    if ((GetJA2Clock() - guiWaitingForTriggerTime) > 500) {
      guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;

      UIHandleLUIEndLock(null);

      HandleNPCTrigger();

      gfWaitingForTriggerTimer = false;
    }
  }
}

export function HandleNPCGotoGridNo(ubTargetNPC: UINT8, usGridNo: UINT16, ubQuoteNum: UINT8): void {
  let pSoldier: SOLDIERTYPE | null;
  // OK, Move to gridNo!

  // Shotdown any panel we had up...
  DeleteTalkingMenu();

  // Get merc id for NPC
  pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
  if (!pSoldier) {
    return;
  }

  // zap any delay in this soldier
  pSoldier.AICounter = ZEROTIMECOUNTER();
  if (pSoldier.bNextAction == Enum289.AI_ACTION_WAIT) {
    pSoldier.bNextAction = Enum289.AI_ACTION_NONE;
    pSoldier.usNextActionData = 0;
  }

  // if player controlled, set under AI control flag
  if (pSoldier.bTeam == gbPlayerNum) {
    pSoldier.uiStatusFlags |= SOLDIER_PCUNDERAICONTROL;
  }

  // OK, set in motion!
  pSoldier.bNextAction = Enum289.AI_ACTION_WALK;

  // Set dest!
  pSoldier.usNextActionData = usGridNo;

  // UNless he's has a pending action, delete what he was doing!
  // Cancel anything he was doing
  if (pSoldier.bAction != Enum289.AI_ACTION_PENDING_ACTION) {
    CancelAIAction(pSoldier, 1);
  }
  // Go for it!

  // Set flags to do stuff once there...
  pSoldier.ubQuoteRecord = (ubQuoteNum + 1);
  pSoldier.ubQuoteActionID = ActionIDForMovementRecord(ubTargetNPC, ubQuoteNum);

  // Set absolute dest
  pSoldier.sAbsoluteFinalDestination = usGridNo;

  // handle this guy's AI right away so that we can get him moving
  pSoldier.fAIFlags |= AI_HANDLE_EVERY_FRAME;
}

export function HandleNPCClosePanel(): void {
  // Remove dialogue!
  DeleteTalkingMenu();
}

function HandleStuffForNPCEscorted(ubNPC: UINT8): void {
  let pSoldier: SOLDIERTYPE | null;

  switch (ubNPC) {
    case Enum268.MARIA:
      break;
    case Enum268.JOEY:
      break;
    case Enum268.SKYRIDER:
      SetFactTrue(Enum170.FACT_SKYRIDER_EVER_ESCORTED);
      if (gubQuest[Enum169.QUEST_ESCORT_SKYRIDER] == QUESTNOTSTARTED) {
        StartQuest(Enum169.QUEST_ESCORT_SKYRIDER, gWorldSectorX, gWorldSectorY);
      }
      break;
    case Enum268.JOHN:
      // recruit Mary as well
      RecruitEPC(Enum268.MARY);

      pSoldier = FindSoldierByProfileID(Enum268.MARY, true);
      if (pSoldier) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.NOW_BING_ESCORTED_STR], gMercProfiles[Enum268.MARY].zNickname, (pSoldier.bAssignment + 1));
      }

      if (gubQuest[Enum169.QUEST_ESCORT_TOURISTS] == QUESTNOTSTARTED) {
        StartQuest(Enum169.QUEST_ESCORT_TOURISTS, gWorldSectorX, gWorldSectorY);
      }
      break;
    case Enum268.MARY:
      // recruit John as well
      RecruitEPC(Enum268.JOHN);

      pSoldier = FindSoldierByProfileID(Enum268.JOHN, true);
      if (pSoldier) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.NOW_BING_ESCORTED_STR], gMercProfiles[Enum268.JOHN].zNickname, (pSoldier.bAssignment + 1));
      }

      if (gubQuest[Enum169.QUEST_ESCORT_TOURISTS] == QUESTNOTSTARTED) {
        StartQuest(Enum169.QUEST_ESCORT_TOURISTS, gWorldSectorX, gWorldSectorY);
      }
      break;
  }
}

export function HandleFactForNPCUnescorted(ubNPC: UINT8): void {
  // obsolete!
  /*
  switch( ubNPC )
  {
          case MARIA:
                  SetFactFalse( FACT_MARIA_ESCORTED );
                  break;
          case JOEY:
                  SetFactFalse( FACT_JOEY_ESCORTED );
                  break;
          case SKYRIDER:
                  SetFactFalse( FACT_ESCORTING_SKYRIDER );
                  break;
          case MARY:
                  SetFactFalse( FACT_JOHN_AND_MARY_EPCS );
                  break;
          case JOHN:
                  SetFactFalse( FACT_JOHN_AND_MARY_EPCS );
                  break;
  }
  */
}

export function HandleNPCDoAction(ubTargetNPC: UINT8, usActionCode: UINT16, ubQuoteNum: UINT8): void {
  let cnt: INT32;
  let pSoldier: SOLDIERTYPE | null;
  let pSoldier2: SOLDIERTYPE | null;
  let bNumDone: INT8 = 0;
  let sGridNo: INT16 = NOWHERE;
  let sAdjustedGridNo: INT16;
  let bItemIn: INT8;
  let ubDesiredMercDir: UINT8;
  let ExitGrid: EXITGRID = createExitGrid();
  let iRandom: INT32 = 0;
  let ubMineIndex: UINT8;

  pSoldier2 = null;
  // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"Handling %s, action %d at %ld", gMercProfiles[ ubTargetNPC ].zNickname, usActionCode, GetJA2Clock() );

  // Switch on action code!
  if (usActionCode > Enum213.NPC_ACTION_TURN_TO_FACE_NEAREST_MERC && usActionCode < Enum213.NPC_ACTION_LAST_TURN_TO_FACE_PROFILE) {
    pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
    pSoldier2 = FindSoldierByProfileID((usActionCode - Enum213.NPC_ACTION_TURN_TO_FACE_NEAREST_MERC), false);
    if (pSoldier && pSoldier2) {
      // see if we are facing this person
      ubDesiredMercDir = atan8(CenterX(pSoldier.sGridNo), CenterY(pSoldier.sGridNo), CenterX(pSoldier2.sGridNo), CenterY(pSoldier2.sGridNo));
      // if not already facing in that direction,
      if (pSoldier.bDirection != ubDesiredMercDir) {
        EVENT_SetSoldierDesiredDirection(pSoldier, ubDesiredMercDir);
      }
    }
  } else {
    switch (usActionCode) {
      case Enum213.NPC_ACTION_DONT_ACCEPT_ITEM:
        // do nothing; this is just to skip annoying debug msgs
        break;

      case Enum213.NPC_ACTION_GOTO_HIDEOUT:

        // OK, we want to goto the basement level!

        // DEF: First thing, Add the exit grid to the map temps file

        ExitGrid.ubGotoSectorX = 10;
        ExitGrid.ubGotoSectorY = 1;
        ExitGrid.ubGotoSectorZ = 1;
        ExitGrid.usGridNo = 12722;

        ApplyMapChangesToMapTempFile(true);
        AddExitGridToWorld(7887, ExitGrid);
        ApplyMapChangesToMapTempFile(false);

        // For one, loop through our current squad and move them over
        cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

        // ATE:Alrighty, instead of being a dufuss here, let's actually use the current
        // Squad here to search for...

        // look for all mercs on the same team,
        for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
          // Are we in this sector, On the current squad?
          if (pSoldier.bActive && pSoldier.bLife >= OKLIFE && pSoldier.bInSector && pSoldier.bAssignment == CurrentSquad()) {
            gfTacticalTraversal = true;
            SetGroupSectorValue(10, 1, 1, pSoldier.ubGroupID);

            // Set insertion gridno
            if (bNumDone < 6) {
              // Set next sectore
              pSoldier.sSectorX = 10;
              pSoldier.sSectorY = 1;
              pSoldier.bSectorZ = 1;

              // Set gridno
              pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
              pSoldier.usStrategicInsertionData = sBasementEnterGridNos[bNumDone];
            }
            bNumDone++;
          }
        }

        // MOVE NPCS!
        // Fatima
        /*				gMercProfiles[ 101 ].sSectorX = 10;
                                        gMercProfiles[ 101 ].sSectorY = 1;
                                        gMercProfiles[ 101 ].bSectorZ = 1;
        */
        ChangeNpcToDifferentSector(Enum268.FATIMA, 10, 1, 1);

        // Dimitri
        /*				gMercProfiles[ 60 ].sSectorX = 10;
                                        gMercProfiles[ 60 ].sSectorY = 1;
                                        gMercProfiles[ 60 ].bSectorZ = 1;
        */
        ChangeNpcToDifferentSector(Enum268.DIMITRI, 10, 1, 1);

        gFadeOutDoneCallback = DoneFadeOutActionBasement;

        FadeOutGameScreen();
        break;

      case Enum213.NPC_ACTION_FATIMA_GIVE_LETTER:

        // Delete menu, give item to megual
        DeleteTalkingMenu();

        // Get pointer for Fatima
        pSoldier = FindSoldierByProfileID(101, false);

        // Get pointer for meguel
        pSoldier2 = FindSoldierByProfileID(57, false);

        // Give item!
        if (!pSoldier || !pSoldier2) {
          return;
        }

        // Look for letter....
        {
          let bInvPos: INT8;

          // Look for item....
          bInvPos = FindObj(pSoldier, 227);

          AssertMsg(bInvPos != NO_SLOT, "Interface Dialogue.C:  Gift item does not exist in NPC.");

          SoldierGiveItem(pSoldier, pSoldier2, pSoldier.inv[bInvPos], bInvPos);
        }
        break;

      case Enum213.NPC_ACTION_FACE_CLOSEST_PLAYER:

        // Get pointer for player
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        pSoldier.ubQuoteRecord = ubQuoteNum;
        pSoldier.ubQuoteActionID = Enum290.QUOTE_ACTION_ID_TURNTOWARDSPLAYER;

        // handle AI for this person every frame until a player merc is near
        pSoldier.fAIFlags |= AI_HANDLE_EVERY_FRAME;
        break;

      case Enum213.NPC_ACTION_OPEN_CLOSEST_DOOR:

        // Delete menu
        DeleteTalkingMenu();

        // Get pointer to NPC
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        // FInd, open Closest Door
        NPCOpenThing(pSoldier, true);

        break;

      case Enum213.NPC_ACTION_LOWER_GUN:
        // Get pointer for player
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        if (pSoldier.inv[Enum261.HANDPOS].usItem != NOTHING) {
          let usGun: UINT16;
          let bNewSlot: INT8;
          let bOldSlot: INT8;

          usGun = pSoldier.inv[Enum261.HANDPOS].usItem;

          ReLoadSoldierAnimationDueToHandItemChange(pSoldier, pSoldier.inv[Enum261.HANDPOS].usItem, NOTHING);
          AutoPlaceObject(pSoldier, pSoldier.inv[Enum261.HANDPOS], false);

          bNewSlot = FindObj(pSoldier, usGun);
          if (bNewSlot != NO_SLOT && gMercProfiles[ubTargetNPC].inv[bNewSlot] == NOTHING) {
            // find where the gun is stored in the profile data and
            // move it to the new location
            bOldSlot = FindObjectInSoldierProfile(ubTargetNPC, usGun);
            if (bOldSlot != NO_SLOT) {
              // rearrange profile... NB # of guns can only be 1 so this is easy
              gMercProfiles[ubTargetNPC].inv[bOldSlot] = NOTHING;
              gMercProfiles[ubTargetNPC].bInvNumber[bOldSlot] = 0;

              gMercProfiles[ubTargetNPC].inv[bNewSlot] = usGun;
              gMercProfiles[ubTargetNPC].bInvNumber[bNewSlot] = 1;
            }
          }
        }
        break;

      case Enum213.NPC_ACTION_READY_GUN:
        // Get pointer for player
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier && pSoldier.inv[Enum261.HANDPOS].usItem != NOTHING) {
          sGridNo = pSoldier.sGridNo + DirectionInc(pSoldier.bDirection);
          SoldierReadyWeapon(pSoldier, (sGridNo % WORLD_COLS), (sGridNo / WORLD_COLS), false);
        }
        break;

      case Enum213.NPC_ACTION_START_RUNNING:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          pSoldier.fUIMovementFast = true;
        }
        break;

      case Enum213.NPC_ACTION_STOP_RUNNING:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          pSoldier.fUIMovementFast = false;
        }
        break;

      case Enum213.NPC_ACTION_BOOST_TOWN_LOYALTY:
        HandleLoyaltyChangeForNPCAction(ubTargetNPC);
        break;

        // case NPC_ACTION_PENALIZE_TOWN_LOYALTY:
        // break;

      case Enum213.NPC_ACTION_STOP_PLAYER_GIVING_FIRST_AID:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          ReceivingSoldierCancelServices(pSoldier);
        }
        break;

      case Enum213.NPC_ACTION_FACE_NORTH:
        // handle this separately to keep the code clean...
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          SendSoldierSetDesiredDirectionEvent(pSoldier, Enum245.NORTHWEST);
        }
        break;

      case Enum213.NPC_ACTION_FACE_NORTH_EAST:
      case Enum213.NPC_ACTION_FACE_EAST:
      case Enum213.NPC_ACTION_FACE_SOUTH_EAST:
      case Enum213.NPC_ACTION_FACE_SOUTH:
      case Enum213.NPC_ACTION_FACE_SOUTH_WEST:
      case Enum213.NPC_ACTION_FACE_WEST:
      case Enum213.NPC_ACTION_FACE_NORTH_WEST:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          // screen NORTHEAST corresponds to in-game NORTH
          SendSoldierSetDesiredDirectionEvent(pSoldier, (Enum245.NORTH + (usActionCode - Enum213.NPC_ACTION_FACE_NORTH_EAST)));
        }
        break;

      case Enum213.NPC_ACTION_RECRUIT:
        // gonna work for free!
        gMercProfiles[ubTargetNPC].sTrueSalary = gMercProfiles[ubTargetNPC].sSalary;
        gMercProfiles[ubTargetNPC].sSalary = 0;
        // and fall through

      case Enum213.NPC_ACTION_RECRUIT_WITH_SALARY:

        // Delete menu
        DeleteTalkingMenu();

        if (PlayerTeamFull()) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_RECRUIT_TEAM_FULL]);
        } else {
          RecruitRPC(ubTargetNPC);
          // OK, update UI with message that we have been recruited
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.HAS_BEEN_RECRUITED_STR], gMercProfiles[ubTargetNPC].zNickname);
        }
        break;

      case Enum213.NPC_ACTION_BECOME_ENEMY:
        // CJC: disable because of new system?
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        if (pSoldier.ubCivilianGroup) {
          CivilianGroupMemberChangesSides(pSoldier);
        } else {
          // MakeCivHostile( pSoldier, 2 );
        }
        if (pSoldier.ubProfile != NO_PROFILE && pSoldier.bLife >= OKLIFE) {
          // trigger quote!
          // TriggerNPCWithIHateYouQuote( pSoldier->ubProfile );
          AddToShouldBecomeHostileOrSayQuoteList(pSoldier.ubID);
        }
        break;

      case Enum213.NPC_ACTION_CLOSE_DIALOGUE_PANEL:
        DeleteTalkingMenu();
        break;

      case Enum213.NPC_ACTION_TRIGGER_FRIEND_WITH_HOSTILE_QUOTE:
        // CJC: disabled because of new system
        // TriggerFriendWithHostileQuote( ubTargetNPC );
        DeleteTalkingMenu();
        break;

      case Enum213.NPC_ACTION_LEAVE_HIDEOUT:

        // Delete menu, give item to megual
        DeleteTalkingMenu();

        // if we are already leaving the sector, dont leave the sector again
        if (gubWaitingForAllMercsToExitCode != 0)
          return;

        // OK, we want to goto the basement level!
        // For one, loop through our current squad and move them over
        cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

        // look for all mercs on the same team,
        for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
          // Are we in this sector, On the current squad?
          if (pSoldier.bActive && pSoldier.bLife >= OKLIFE && pSoldier.bInSector) {
            gfTacticalTraversal = true;
            SetGroupSectorValue(10, 1, 0, pSoldier.ubGroupID);

            // Set insertion gridno
            if (bNumDone < 8) {
              // Set next sectore
              pSoldier.sSectorX = 10;
              pSoldier.sSectorY = 1;
              pSoldier.bSectorZ = 0;

              // Set gridno
              pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
              pSoldier.usStrategicInsertionData = sBasementExitGridNos[bNumDone];
            }
            bNumDone++;
          }
        }

        gFadeOutDoneCallback = DoneFadeOutActionLeaveBasement;

        FadeOutGameScreen();

        // turn off engaged in conv stuff
        gTacticalStatus.uiFlags &= ~ENGAGED_IN_CONV;
        // Decrement refrence count...
        giNPCReferenceCount = 0;

        break;

      case Enum213.NPC_ACTION_TRAVERSE_MAP_EAST:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        pSoldier.ubQuoteActionID = Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST;
        break;

      case Enum213.NPC_ACTION_TRAVERSE_MAP_SOUTH:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        pSoldier.ubQuoteActionID = Enum290.QUOTE_ACTION_ID_TRAVERSE_SOUTH;
        break;

      case Enum213.NPC_ACTION_TRAVERSE_MAP_WEST:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        pSoldier.ubQuoteActionID = Enum290.QUOTE_ACTION_ID_TRAVERSE_WEST;
        break;

      case Enum213.NPC_ACTION_TRAVERSE_MAP_NORTH:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        pSoldier.ubQuoteActionID = Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH;
        break;

      case Enum213.NPC_ACTION_REPORT_SHIPMENT_SIZE:
        // for now, hard-coded to small shipment...
        // medium is quote 14, large is 15
        if (CheckFact(Enum170.FACT_MEDIUM_SIZED_SHIPMENT_WAITING, 0)) {
          TalkingMenuDialogue(14);
        } else if (CheckFact(Enum170.FACT_LARGE_SIZED_SHIPMENT_WAITING, 0)) {
          TalkingMenuDialogue(15);
        } else {
          TalkingMenuDialogue(13);
        }
        if (CheckFact(Enum170.FACT_PABLOS_BRIBED, 0) && Random(100) < 75) {
          TalkingMenuDialogue(16);
          if (Random(100) < 75) {
            TalkingMenuDialogue(21);
          }
        }
        break;

      case Enum213.NPC_ACTION_RETURN_STOLEN_SHIPMENT_ITEMS:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, 480 + Random(60), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_RETURN_STOLEN_SHIPMENT_ITEMS, 1);
        // also make Pablo neutral again and exit combat if we're in combat
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }
        if (!pSoldier.bNeutral) {
          DeleteTalkingMenu();
          SetSoldierNeutral(pSoldier);
          pSoldier.bBleeding = 0; // make sure he doesn't bleed now...
          RecalculateOppCntsDueToBecomingNeutral(pSoldier);
          if (gTacticalStatus.uiFlags & INCOMBAT) {
            CheckForEndOfCombatMode(false);
          }
        }
        break;

      case Enum213.NPC_ACTION_THREATENINGLY_RAISE_GUN:

        // Get pointer for NPC
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (!pSoldier) {
          return;
        }

        bItemIn = FindAIUsableObjClass(pSoldier, IC_GUN);
        if (bItemIn != NO_SLOT && bItemIn != Enum261.HANDPOS) {
          SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[bItemIn]);
          sGridNo = pSoldier.sGridNo + DirectionInc(pSoldier.bDirection);
          SoldierReadyWeapon(pSoldier, (sGridNo % WORLD_COLS), (sGridNo / WORLD_COLS), false);
        }
        // fall through so that the person faces the nearest merc!
      case Enum213.NPC_ACTION_TURN_TO_FACE_NEAREST_MERC:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          sGridNo = ClosestPC(pSoldier, null);
          if (sGridNo != NOWHERE) {
            // see if we are facing this person
            ubDesiredMercDir = atan8(CenterX(pSoldier.sGridNo), CenterY(pSoldier.sGridNo), CenterX(sGridNo), CenterY(sGridNo));
            // if not already facing in that direction,
            if (pSoldier.bDirection != ubDesiredMercDir) {
              EVENT_SetSoldierDesiredDirection(pSoldier, ubDesiredMercDir);
            }
          }
        }
        break;

      case Enum213.NPC_ACTION_SEND_PACOS_INTO_HIDING:
        pSoldier = FindSoldierByProfileID(114, false);
        sGridNo = 16028;
        if (pSoldier) {
          if (NewOKDestination(pSoldier, sGridNo, true, 0)) {
            // go for it!
            NPCGotoGridNo(114, sGridNo, ubQuoteNum);
          } else {
            sAdjustedGridNo = FindAdjacentGridEx(pSoldier, sGridNo, null, null, false, false);
            if (sAdjustedGridNo != -1) {
              NPCGotoGridNo(114, sAdjustedGridNo, ubQuoteNum);
            }
          }
        }
        break;
      case Enum213.NPC_ACTION_HAVE_PACOS_FOLLOW:
        pSoldier = FindSoldierByProfileID(114, false);
        sGridNo = 18193;
        if (pSoldier) {
          if (NewOKDestination(pSoldier, sGridNo, true, 0)) {
            // go for it!
            NPCGotoGridNo(114, sGridNo, ubQuoteNum);
          } else {
            sAdjustedGridNo = FindAdjacentGridEx(pSoldier, sGridNo, null, null, false, false);
            if (sAdjustedGridNo != -1) {
              NPCGotoGridNo(114, sAdjustedGridNo, ubQuoteNum);
            }
          }
        }
        break;
      case Enum213.NPC_ACTION_SET_DELAYED_PACKAGE_TIMER:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), Enum170.FACT_SHIPMENT_DELAYED_24_HOURS, 1);
        break;

      case Enum213.NPC_ACTION_SET_RANDOM_PACKAGE_DAMAGE_TIMER:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_SET_RANDOM_PACKAGE_DAMAGE_TIMER, 1);
        break;

      case Enum213.NPC_ACTION_ENABLE_CAMBRIA_DOCTOR_BONUS:
        // add event in a
        iRandom = Random(24);
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, (GetWorldMinutesInDay() + ((24 + iRandom) * 60)), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_ENABLE_CAMBRIA_DOCTOR_BONUS, 1);
        break;
      case Enum213.NPC_ACTION_TRIGGER_END_OF_FOOD_QUEST:
        AddHistoryToPlayersLog(Enum83.HISTORY_TALKED_TO_FATHER_WALKER, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_TRIGGER_END_OF_FOOD_QUEST, 1);
        break;

      case Enum213.NPC_ACTION_REMOVE_CONRAD:
        break;

      case Enum213.NPC_ACTION_REDUCE_CONRAD_SALARY_CONDITIONS:
        gMercProfiles[Enum268.CONRAD].sSalary = 3300;
        // and fall through
      case Enum213.NPC_ACTION_ASK_ABOUT_ESCORTING_EPC:
        // Confirm if we want to start escorting or not....
      case Enum213.NPC_ACTION_ASK_ABOUT_PAYING_RPC:
      case Enum213.NPC_ACTION_ASK_ABOUT_PAYING_RPC_WITH_DAILY_SALARY:
        // Ask whether the player will pay the RPC
      case Enum213.NPC_ACTION_DARREN_REQUESTOR:
        // Darren asks if the player wants to fight
      case Enum213.NPC_ACTION_FIGHT_AGAIN_REQUESTOR:
        // Darren asks if the player wants to fight again
      case Enum213.NPC_ACTION_BUY_LEATHER_KEVLAR_VEST: // from Angel
      case Enum213.NPC_ACTION_MEDICAL_REQUESTOR: // at hospital
      case Enum213.NPC_ACTION_MEDICAL_REQUESTOR_2: // at hospital
      case Enum213.NPC_ACTION_BUY_VEHICLE_REQUESTOR: // from Dave
      case Enum213.NPC_ACTION_KROTT_REQUESTOR:
        // Vince or Willis asks about payment? for medical attention
        if (ubTargetNPC != (<SOLDIERTYPE>gpDestSoldier).ubProfile) {
        } else {
          DeleteTalkingMenu();
          StartDialogueMessageBox(ubTargetNPC, usActionCode);
        }
        break;

      case Enum213.NPC_ACTION_REPORT_BALANCE:
        ScreenMsg(FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.BALANCE_OWED_STR], gMercProfiles[ubTargetNPC].zNickname, -gMercProfiles[ubTargetNPC].iBalance);
        break;

      case Enum213.NPC_ACTION_DELAYED_MAKE_BRENDA_LEAVE:
        // set event to invoke Brenda's (#85) record 9 a minute from
        // now
        DeleteTalkingMenu();
        AddSameDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay() + 360, NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_DELAYED_MAKE_BRENDA_LEAVE);
        break;

      case Enum213.NPC_ACTION_SEX:
        // Delete menu
        // DeleteTalkingMenu( );
        // gFadeOutDoneCallback = DoneFadeOutActionSex;
        // FadeOutGameScreen( );
        SetPendingNewScreen(Enum26.SEX_SCREEN);
        break;

      case Enum213.NPC_ACTION_KYLE_GETS_MONEY:
        // add a money item with $10000 to the tile in front of Kyle
        // and then have him pick it up
        {
          let Object: OBJECTTYPE = createObjectType();
          let sGridNo: INT16 = 14952;
          let iWorldItem: INT32;

          pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
          if (pSoldier) {
            CreateItem(Enum225.MONEY, 1, Object);
            Object.uiMoneyAmount = 10000;
            AddItemToPoolAndGetIndex(sGridNo, Object, -1, pSoldier.bLevel, 0, 0, addressof(iWorldItem));

            // shouldn't have any current action but make sure everything
            // is clear... and set pending action so the guy won't move
            // until the pickup is completed
            CancelAIAction(pSoldier, FORCE);
            pSoldier.bAction = Enum289.AI_ACTION_PENDING_ACTION;
            pSoldier.ubQuoteRecord = Enum213.NPC_ACTION_KYLE_GETS_MONEY;

            SoldierPickupItem(pSoldier, iWorldItem, sGridNo, ITEM_IGNORE_Z_LEVEL);
          }
        }
        break;

      case Enum213.NPC_ACTION_DRINK_DRINK_DRINK:
        gMercProfiles[ubTargetNPC].bNPCData++;
        break;

      case Enum213.NPC_ACTION_MARTHA_DIES:
        pSoldier = FindSoldierByProfileID(Enum268.MARTHA, false);
        if (pSoldier) {
          DeleteTalkingMenu();
          EVENT_SoldierGotHit(pSoldier, 1, 100, 10, pSoldier.bDirection, 320, NOBODY, FIRE_WEAPON_NO_SPECIAL, AIM_SHOT_TORSO, 0, NOWHERE);
        }
        break;

        // case NPC_ACTION_DARREN_GIVEN_CASH:
        // Handled in NPC.c
        //	break;

      case Enum213.NPC_ACTION_START_BOXING_MATCH:
        if (CheckOnBoxers()) {
          DeleteTalkingMenu();
          PlayJA2Sample(Enum330.BOXING_BELL, RATE_11025, SoundVolume(MIDVOLUME, 11237), 5, SoundDir(11237));
          ClearAllBoxerFlags();
          SetBoxingState(Enum247.BOXING_WAITING_FOR_PLAYER);
        }
        break;

      case Enum213.NPC_ACTION_ADD_JOEY_TO_WORLD:
        gMercProfiles[Enum268.JOEY].sSectorX = 4;
        gMercProfiles[Enum268.JOEY].sSectorY = MAP_ROW_D;
        gMercProfiles[Enum268.JOEY].bSectorZ = 1;
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_ADD_JOEY_TO_WORLD, 3);
        break;

      case Enum213.NPC_ACTION_MARK_KINGPIN_QUOTE_0_USED:
        // set Kingpin's quote 0 as used so he doesn't introduce himself
        gMercProfiles[86].ubLastDateSpokenTo = GetWorldDay();
        break;

      case Enum213.NPC_ACTION_TRIGGER_LAYLA_13_14_OR_15:
        if (CheckFact(Enum170.FACT_CARLA_AVAILABLE, 0)) {
          TriggerNPCRecord(107, 13);
        } else if (CheckFact(Enum170.FACT_CINDY_AVAILABLE, 0)) {
          TriggerNPCRecord(107, 14);
        } else if (CheckFact(Enum170.FACT_BAMBI_AVAILABLE, 0)) {
          TriggerNPCRecord(107, 15);
        }
        break;

      case Enum213.NPC_ACTION_OPEN_CARLAS_DOOR:
        if (usActionCode == Enum213.NPC_ACTION_OPEN_CARLAS_DOOR) {
          sGridNo = 12290;
        }
        // fall through
      case Enum213.NPC_ACTION_OPEN_CINDYS_DOOR:
        if (usActionCode == Enum213.NPC_ACTION_OPEN_CINDYS_DOOR) {
          sGridNo = 13413;
        }
        // fall through
      case Enum213.NPC_ACTION_OPEN_BAMBIS_DOOR:
        if (usActionCode == Enum213.NPC_ACTION_OPEN_BAMBIS_DOOR) {
          sGridNo = 11173;
        }
        // fall through
      case Enum213.NPC_ACTION_OPEN_MARIAS_DOOR:
        if (usActionCode == Enum213.NPC_ACTION_OPEN_MARIAS_DOOR) {
          sGridNo = 10852;
        }
        // JA3Gold: unlock the doors instead of opening them
        {
          let pDoor: DOOR | null;

          pDoor = FindDoorInfoAtGridNo(sGridNo);
          if (pDoor) {
            pDoor.fLocked = false;
          }
        }
        /*
        // handle door opening here
        {
                STRUCTURE * pStructure;
                pStructure = FindStructure( sGridNo, STRUCTURE_ANYDOOR );
                if (pStructure)
                {



                        pStructure->

                        if (pStructure->fFlags & STRUCTURE_OPEN)
                        {
                                // it's already open - this MIGHT be an error but probably not
                                // because we are basically just ensuring that the door is open
                        }
                        else
                        {
                                if (pStructure->fFlags & STRUCTURE_BASE_TILE)
                                {
                                        HandleDoorChangeFromGridNo( NULL, sGridNo, FALSE );
                                }
                                else
                                {
                                        HandleDoorChangeFromGridNo( NULL, pStructure->sBaseGridNo, FALSE );
                                }
                        }
                }
        }
        */
        break;

      case Enum213.NPC_ACTION_POSSIBLY_ADVERTISE_CINDY:
        if (CheckFact(Enum170.FACT_CINDY_AVAILABLE, 0)) {
          TriggerNPCRecord(Enum268.MADAME, 14);
        }
        // else fall through
      case Enum213.NPC_ACTION_POSSIBLY_ADVERTISE_BAMBI:
        if (CheckFact(Enum170.FACT_BAMBI_AVAILABLE, 0)) {
          TriggerNPCRecord(Enum268.MADAME, 15);
        }
        break;

      case Enum213.NPC_ACTION_LAYLA_GIVEN_WRONG_AMOUNT_OF_CASH:
        if (CheckFact(Enum170.FACT_NO_GIRLS_AVAILABLE, 0)) {
          TriggerNPCRecord(Enum268.MADAME, 27);
        }
        // else mention girls available...
        else if (CheckFact(Enum170.FACT_CARLA_AVAILABLE, 0)) {
          // Mention Carla
          TriggerNPCRecord(Enum268.MADAME, 28);
          break;
        }
        // else fall through
      case Enum213.NPC_ACTION_LAYLAS_NEXT_LINE_AFTER_CARLA:
        if (CheckFact(Enum170.FACT_CINDY_AVAILABLE, 0)) {
          // Mention Cindy
          TriggerNPCRecord(Enum268.MADAME, 29);
          break;
        }
      case Enum213.NPC_ACTION_LAYLAS_NEXT_LINE_AFTER_CINDY:
        // else fall through
        if (CheckFact(Enum170.FACT_BAMBI_AVAILABLE, 0)) {
          // Mention Bambi
          TriggerNPCRecord(Enum268.MADAME, 30);
          break;
        }
      case Enum213.NPC_ACTION_LAYLAS_NEXT_LINE_AFTER_BAMBI:
        // else fall through
        if (gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTINPROGRESS) {
          // Mention Maria
          TriggerNPCRecord(Enum268.MADAME, 31);
          break;
        }
      case Enum213.NPC_ACTION_LAYLAS_NEXT_LINE_AFTER_MARIA:
        // else fall through
        if (CheckFact(Enum170.FACT_MULTIPLE_MERCS_CLOSE, Enum268.MADAME)) {
          // if more than 1 merc nearby, say comment about 2 guys pergirl
          TriggerNPCRecord(Enum268.MADAME, 32);
        }

        break;

      case Enum213.NPC_ACTION_PROMPT_PLAYER_TO_LIE:
        //
        ubRecordThatTriggeredLiePrompt = ubQuoteNum;
        DeleteTalkingMenu();

        StartDialogueMessageBox(ubTargetNPC, usActionCode);
        break;

      case Enum213.NPC_ACTION_REMOVE_JOE_QUEEN:

        // Find queen and joe and remove from sector...
        pSoldier = FindSoldierByProfileID(Enum268.QUEEN, false);

        if (pSoldier != null) {
          TacticalRemoveSoldier(pSoldier.ubID);
        }

        // Find queen and joe and remove from sector...
        pSoldier = FindSoldierByProfileID(Enum268.JOE, false);

        if (pSoldier != null) {
          TacticalRemoveSoldier(pSoldier.ubID);
        }
        break;

      case Enum213.NPC_ACTION_REMOVE_ELLIOT_END_MEANWHILE:

        // Find queen and joe and remove from sector...
        pSoldier = FindSoldierByProfileID(Enum268.ELLIOT, false);

        if (pSoldier != null) {
          TacticalRemoveSoldier(pSoldier.ubID);
        }

        // End meanwhile....
        // End meanwhile....
        DeleteTalkingMenu();
        EndMeanwhile();
        break;
      case Enum213.NPC_ACTION_NO_SCI_FI_END_MEANWHILE:

        if (!(gGameOptions.fSciFi)) {
          // End meanwhile....
          // End meanwhile....
          DeleteTalkingMenu();
          EndMeanwhile();
        } else {
          TriggerNPCRecord(Enum268.QUEEN, 8);
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_MARRY_DARYL_PROMPT:
        DeleteTalkingMenu();
        StartDialogueMessageBox(ubTargetNPC, usActionCode);
        break;
      case Enum213.NPC_ACTION_HAVE_MARRIED_NPC_LEAVE_TEAM:

        // get the soldier
        pSoldier = FindSoldierByProfileID(gMercProfiles[Enum268.DARYL].bNPCData, false);
        pSoldier2 = gpDestSoldier;

        if (!pSoldier || !pSoldier2) {
          return;
        }

        // set the fact that the merc is being married ( used in the personnel screen )
        gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 |= PROFILE_MISC_FLAG2_MARRIED_TO_HICKS;

        AddHistoryToPlayersLog(Enum83.HISTORY_MERC_MARRIED_OFF, pSoldier.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);

        // if Flo is going off with Daryl, then set that fact true
        if (pSoldier.ubProfile == 44) {
          SetFactTrue(Enum170.FACT_PC_MARRYING_DARYL_IS_FLO);
        }

        HandleMoraleEvent(pSoldier, Enum234.MORALE_MERC_MARRIED, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        UpdateDarrelScriptToGoTo(pSoldier);
        TriggerNPCRecord(Enum268.DARREL, 10);

        // Since the married merc is leaving the team, add them to the departed list for the personnel screen
        AddCharacterToOtherList(pSoldier);

        break;
      case Enum213.NPC_ACTION_TRIGGER_ANGEL_17_OR_18:
        if (CheckFact(Enum170.FACT_ANGEL_SOLD_VEST, Enum268.ANGEL)) {
          TriggerNPCRecord(Enum268.ANGEL, 18);
        } else {
          TriggerNPCRecord(Enum268.ANGEL, 17);
        }
        break;

      case Enum213.NPC_ACTION_TRIGGER_ANGEL_16_OR_19:
        if (CheckFact(Enum170.FACT_PLAYER_IN_SAME_ROOM, Enum268.ANGEL)) {
          TriggerNPCRecord(Enum268.ANGEL, 16);
        } else {
          TriggerNPCRecord(Enum268.ANGEL, 19);
        }
        break;

      case Enum213.NPC_ACTION_TRIGGER_ANGEL_21_OR_22:
        if (CheckFact(Enum170.FACT_PLAYER_IN_SAME_ROOM, Enum268.ANGEL)) {
          TriggerNPCRecord(Enum268.ANGEL, 22);
        } else {
          TriggerNPCRecord(Enum268.ANGEL, 21);
        }
        break;

      case Enum213.NPC_ACTION_TRIGGER_MARIA:
        if (CheckFact(Enum170.FACT_MARIA_ESCAPE_NOTICED, Enum268.MARIA) == false) {
          TriggerNPCRecord(Enum268.MARIA, 8);
        } else {
          if (CheckFact(Enum170.FACT_PLAYER_IN_SAME_ROOM, Enum268.MARIA)) {
            TriggerNPCRecord(Enum268.MARIA, 9);
          } else {
            TriggerNPCRecord(Enum268.MARIA, 10);
          }
        }
        break;

      case Enum213.NPC_ACTION_ANGEL_LEAVES_DEED:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          bItemIn = FindObj(pSoldier, Enum225.DEED);
          if (bItemIn != NO_SLOT) {
            AddItemToPool(12541, pSoldier.inv[bItemIn], -1, 0, 0, 0);
            DeleteObj(pSoldier.inv[bItemIn]);
            RemoveObjectFromSoldierProfile(ubTargetNPC, Enum225.DEED);
          }
        }
        DeleteTalkingMenu();
        NPCDoAction(ubTargetNPC, Enum213.NPC_ACTION_UN_RECRUIT_EPC, 0);
        NPCDoAction(ubTargetNPC, Enum213.NPC_ACTION_GRANT_EXPERIENCE_3, 0);
        TriggerNPCRecord(Enum268.ANGEL, 24);
        break;

      case Enum213.NPC_ACTION_SET_GIRLS_AVAILABLE:

        // Initially assume none available
        SetFactTrue(Enum170.FACT_NO_GIRLS_AVAILABLE);

        // Carla... available 66% of the time
        if (Random(3)) {
          SetFactTrue(Enum170.FACT_CARLA_AVAILABLE);
          SetFactFalse(Enum170.FACT_NO_GIRLS_AVAILABLE);
        } else {
          SetFactFalse(Enum170.FACT_CARLA_AVAILABLE);
        }
        // Cindy... available 50% of time
        if (Random(2)) {
          SetFactTrue(Enum170.FACT_CINDY_AVAILABLE);
          SetFactFalse(Enum170.FACT_NO_GIRLS_AVAILABLE);
        } else {
          SetFactFalse(Enum170.FACT_CINDY_AVAILABLE);
        }
        // Bambi... available 50% of time
        if (Random(2)) {
          SetFactTrue(Enum170.FACT_BAMBI_AVAILABLE);
          SetFactFalse(Enum170.FACT_NO_GIRLS_AVAILABLE);
        } else {
          SetFactFalse(Enum170.FACT_BAMBI_AVAILABLE);
        }
        break;

      case Enum213.NPC_ACTION_SET_DELAY_TILL_GIRLS_AVAILABLE:
        AddSameDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay() + 1 + Random(2), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_SET_DELAY_TILL_GIRLS_AVAILABLE);
        break;

      case Enum213.NPC_ACTION_SET_WAITED_FOR_GIRL_FALSE:
        SetFactFalse(Enum170.FACT_PLAYER_WAITED_FOR_GIRL);
        break;

      case Enum213.NPC_ACTION_UN_RECRUIT_EPC:
      case Enum213.NPC_ACTION_SET_EPC_TO_NPC:
        if (ubTargetNPC == Enum268.ANGEL) {
          // hack to Mari!
          ubTargetNPC = Enum268.MARIA;
        }
        UnRecruitEPC(ubTargetNPC);
        HandleFactForNPCUnescorted(ubTargetNPC);
        switch (ubTargetNPC) {
          case Enum268.MARY:
            UnRecruitEPC(Enum268.JOHN);
            break;
          case Enum268.JOHN:
            UnRecruitEPC(Enum268.MARY);
            break;
        }
        break;

      case Enum213.NPC_ACTION_REMOVE_DOREEN:
        // make Doreen disappear next time we do a sector traversal
        gMercProfiles[Enum268.DOREEN].sSectorX = 0;
        gMercProfiles[Enum268.DOREEN].sSectorY = 0;
        gMercProfiles[Enum268.DOREEN].bSectorZ = 0;
        break;

      case Enum213.NPC_ACTION_FREE_KIDS:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, 420, NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_FREE_KIDS, 1);
        break;

      case Enum213.NPC_ACTION_TRIGGER_FATHER_18_20_OR_15:
        if (CheckFact(132, Enum268.FATHER) == false) {
          TriggerNPCRecord(Enum268.FATHER, 18);
        } else if (CheckFact(133, Enum268.FATHER) == false) {
          TriggerNPCRecord(Enum268.FATHER, 20);
        } else if (CheckFact(134, Enum268.FATHER) == false) {
          TriggerNPCRecord(Enum268.FATHER, 15);
        } else {
          TriggerNPCRecord(Enum268.FATHER, 26);
        }
        break;

      case Enum213.NPC_ACTION_ENTER_COMBAT:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          if (pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP) {
            if (gTacticalStatus.fCivGroupHostile[pSoldier.ubCivilianGroup] == CIV_GROUP_NEUTRAL) {
              CivilianGroupMemberChangesSides(pSoldier);
            }
          } else {
            // make hostile
            MakeCivHostile(pSoldier, 2);
          }
          DeleteTalkingMenu();
          if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
            EnterCombatMode(pSoldier.bTeam);
          }
        }
        break;

      case Enum213.NPC_ACTION_DECIDE_ACTIVE_TERRORISTS: {
        // only (now) add all terrorist files to laptop
        let ubLoop: UINT8;

        // one terrorist will always be Elgin
        // determine how many more terrorists - 2 to 4 more

        ubLoop = 0;
        while (gubTerrorists[ubLoop] != 0) {
          AddFileAboutTerrorist(gubTerrorists[ubLoop]);
          ubLoop++;
        }

        // Carmen has received 0 terrorist heads recently
        gMercProfiles[78].bNPCData2 = 0;
      } break;

      case Enum213.NPC_ACTION_CHECK_LAST_TERRORIST_HEAD:
        // decrement head count
        gMercProfiles[78].bNPCData--;
        // increment number of heads on hand
        gMercProfiles[78].bNPCData2++;

        if (gWorldSectorX == 13 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0) {
          TriggerNPCRecord(78, 20);
        } else {
          TriggerNPCRecord(78, 21);
        }
        // CJC Nov 28 2002 - fixed history record which didn't have location specified
        AddHistoryToPlayersLog(Enum83.HISTORY_GAVE_CARMEN_HEAD, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;

      case Enum213.NPC_ACTION_CARMEN_LEAVES_FOR_GOOD:
        gMercProfiles[ubTargetNPC].ubMiscFlags2 |= PROFILE_MISC_FLAG2_LEFT_COUNTRY;
        // fall through!
      case Enum213.NPC_ACTION_CARMEN_LEAVES_FOR_C13:
        // set "don't add to sector" cause he'll only appear after an event...
        gMercProfiles[ubTargetNPC].ubMiscFlags2 |= PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR;

        SetCustomizableTimerCallbackAndDelay(10000, CarmenLeavesSectorCallback, true);
        break;

      case Enum213.NPC_ACTION_CARMEN_LEAVES_ON_NEXT_SECTOR_LOAD:
        if (gMercProfiles[Enum268.CARMEN].bNPCData == 0) {
          SetFactTrue(Enum170.FACT_ALL_TERRORISTS_KILLED);
          // the next time we change sectors, quest 2 will be set to done

          IncrementTownLoyaltyEverywhere(LOYALTY_BONUS_TERRORISTS_DEALT_WITH);
        }
        // anyhow Carmen has given the player money so reset his balance to 0.
        gMercProfiles[Enum268.CARMEN].uiMoney = 0;
        break;

      case Enum213.NPC_ACTION_END_COMBAT:
        ExitCombatMode();
        break;

      case Enum213.NPC_ACTION_BECOME_FRIENDLY_END_COMBAT:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          DeleteTalkingMenu();

          SetSoldierNeutral(pSoldier);
          RecalculateOppCntsDueToBecomingNeutral(pSoldier);
          if (gTacticalStatus.bNumFoughtInBattle[CIV_TEAM] == 0) {
            gTacticalStatus.fEnemyInSector = false;
          }
          if (!gTacticalStatus.fEnemyInSector) {
            ExitCombatMode();
          }

          CancelAIAction(pSoldier, FORCE);
          // make stand up if not standing already
          if (ubTargetNPC == Enum268.SLAY && pSoldier.ubBodyType == Enum194.CRIPPLECIV) {
            HandleNPCDoAction(Enum268.SLAY, Enum213.NPC_ACTION_GET_OUT_OF_WHEELCHAIR, ubQuoteNum);
          } else if (!PTR_STANDING(pSoldier)) {
            pSoldier.bNextAction = Enum289.AI_ACTION_CHANGE_STANCE;
            pSoldier.usNextActionData = ANIM_STAND;
          }
        }
        break;

      case Enum213.NPC_ACTION_TERRORIST_REVEALS_SELF:
        // WAS swap names in profile
        // NOW overwrite name with true name in profile
        // copy new nickname into soldier structure
        {
          // INT16	zTemp[ NICKNAME_LENGTH ];
          // wcsncpy( zTemp, gMercProfiles[ ubTargetNPC ].zNickname, NICKNAME_LENGTH );
          gMercProfiles[ubTargetNPC].zNickname = gMercProfiles[ubTargetNPC].zName.substring(0, NICKNAME_LENGTH);
          // wcsncpy( gMercProfiles[ ubTargetNPC ].zName, zTemp, NICKNAME_LENGTH );
          pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
          if (pSoldier) {
            pSoldier.name = gMercProfiles[ubTargetNPC].zNickname.substring(0, 10);
          }
        }
        break;

      case Enum213.NPC_ACTION_END_MEANWHILE:

        // End meanwhile....
        DeleteTalkingMenu();
        EndMeanwhile();
        break;

      case Enum213.NPC_ACTION_START_BLOODCAT_QUEST:
        StartQuest(Enum169.QUEST_BLOODCATS, gWorldSectorX, gWorldSectorY);
        break;

      case Enum213.NPC_ACTION_START_MINE:
        ubMineIndex = GetHeadMinersMineIndex(ubTargetNPC);

        // record the fact that player has spoken with this head miner so he can now get production from that mine
        PlayerSpokeToHeadMiner(ubTargetNPC);

        if (IsMineShutDown(ubMineIndex)) {
          RestartMineProduction(ubMineIndex);
        }
        break;

      case Enum213.NPC_ACTION_STOP_MINE:
        ubMineIndex = GetHeadMinersMineIndex(ubTargetNPC);

        if (!IsMineShutDown(ubMineIndex)) {
          ShutOffMineProduction(ubMineIndex);
        }
        break;

      case Enum213.NPC_ACTION_RESET_MINE_CAPTURED:
        ResetQueenRetookMine(ubTargetNPC);
        break;

      case Enum213.NPC_ACTION_SET_OSWALD_RECORD_13_USED:
      case Enum213.NPC_ACTION_SET_CALVIN_RECORD_13_USED:
      case Enum213.NPC_ACTION_SET_CARL_RECORD_13_USED:
      case Enum213.NPC_ACTION_SET_FRED_RECORD_13_USED:
      case Enum213.NPC_ACTION_SET_MATT_RECORD_13_USED:
        SetQuoteRecordAsUsed(ubTargetNPC, 13);
        break;

      case Enum213.NPC_ACTION_TRIGGER_MATT:
        if (CheckFact(Enum170.FACT_DYNAMO_IN_J9, Enum268.MATT)) {
          TriggerNPCRecord(Enum268.MATT, 15);
        } else if (CheckFact(Enum170.FACT_DYNAMO_ALIVE, Enum268.MATT)) {
          TriggerNPCRecord(Enum268.MATT, 16);
        }
        break;

      case Enum213.NPC_ACTION_MADLAB_GIVEN_GUN:
        SetFactFalse(Enum170.FACT_MADLAB_EXPECTING_FIREARM);
        if (CheckFact(Enum170.FACT_MADLAB_EXPECTING_VIDEO_CAMERA, 0)) {
          TriggerNPCRecord(ubTargetNPC, 14);
        } else {
          TriggerNPCRecord(ubTargetNPC, 18);
        }
        break;

      case Enum213.NPC_ACTION_MADLAB_GIVEN_CAMERA:
        SetFactFalse(Enum170.FACT_MADLAB_EXPECTING_VIDEO_CAMERA);
        if (CheckFact(Enum170.FACT_MADLAB_EXPECTING_FIREARM, 0)) {
          TriggerNPCRecord(ubTargetNPC, 17);
        } else {
          TriggerNPCRecord(ubTargetNPC, 18);
        }
        break;

      case Enum213.NPC_ACTION_MADLAB_ATTACHES_GOOD_CAMERA:
        SetFactFalse(Enum170.FACT_MADLAB_HAS_GOOD_CAMERA);
        pSoldier = FindSoldierByProfileID(Enum268.MADLAB, false);
        pSoldier2 = FindSoldierByProfileID(Enum268.ROBOT, false);
        if (pSoldier && pSoldier2) {
          // Give weapon to robot
          let bSlot: INT8;

          bSlot = FindObjClass(pSoldier, IC_GUN);
          if (bSlot != NO_SLOT) {
            AutoPlaceObject(pSoldier2, pSoldier.inv[bSlot], false);
          }
        }
        // Allow robot to be controlled by remote!
        RecruitEPC(Enum268.ROBOT);
        break;

      case Enum213.NPC_ACTION_READY_ROBOT:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, 420, NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_READY_ROBOT, 1);
        break;

      case Enum213.NPC_ACTION_HANDLE_END_OF_FIGHT:
        ExitBoxing();
        DeleteTalkingMenu();
        /*
        switch( gTacticalStatus.bBoxingState )
        {
                case WON_ROUND:
                        TriggerNPCRecord( DARREN, 23 );
                        break;
                case LOST_ROUND:
                        TriggerNPCRecord( DARREN, 24 );
                        break;
                default:
                        break;
        }
        */
        break;

      case Enum213.NPC_ACTION_DARREN_PAYS_PLAYER:
        // should change to split up cash
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);

        if (pSoldier) {
          let sNearestPC: INT16;
          let ubID: UINT8;
          let bMoneySlot: INT8;
          let bEmptySlot: INT8;

          sNearestPC = ClosestPC(pSoldier, null);

          if (sNearestPC != NOWHERE) {
            ubID = WhoIsThere2(sNearestPC, 0);
            if (ubID != NOBODY) {
              pSoldier2 = MercPtrs[ubID];
            }
          }

          if (pSoldier2) {
            bMoneySlot = FindObjClass(pSoldier, IC_MONEY);
            bEmptySlot = FindObj(pSoldier, NOTHING);

            // have to separate out money from Darren's stash equal to the amount of the bet
            // times 2 (returning the player's money, after all!)
            if (bMoneySlot != NO_SLOT && bEmptySlot != NO_SLOT) {
              CreateMoney(gMercProfiles[ubTargetNPC].iBalance * 2, pSoldier.inv[bEmptySlot]);
              pSoldier.inv[bMoneySlot].uiMoneyAmount -= gMercProfiles[ubTargetNPC].iBalance * 2;
              if (bMoneySlot < bEmptySlot) {
                // move main stash to later in inventory!
                SwapObjs(pSoldier.inv[bEmptySlot], pSoldier.inv[bMoneySlot]);
                SoldierGiveItem(pSoldier, pSoldier2, pSoldier.inv[bMoneySlot], bMoneySlot);
              } else {
                SoldierGiveItem(pSoldier, pSoldier2, pSoldier.inv[bEmptySlot], bEmptySlot);
              }
            }
          }
        }

        break;

      case Enum213.NPC_ACTION_TRIGGER_SPIKE_OR_DARREN:
        pSoldier = FindSoldierByProfileID(Enum268.KINGPIN, false);
        if (pSoldier) {
          let ubRoom: UINT8;

          if ((ubRoom = InARoom(pSoldier.sGridNo)) !== -1 && (ubRoom == 1 || ubRoom == 2 || ubRoom == 3)) {
            // Kingpin is in the club
            TriggerNPCRecord(Enum268.DARREN, 31);
            break;
          }
        }
        // Kingpin not in club
        TriggerNPCRecord(Enum268.SPIKE, 11);
        break;

      case Enum213.NPC_ACTION_OPEN_CLOSEST_CABINET:

        // Delete menu
        DeleteTalkingMenu();

        // Get pointer to NPC
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);

        if (!pSoldier) {
          return;
        }

        // FInd, open Closest non-door
        NPCOpenThing(pSoldier, false);

        break;

      case Enum213.NPC_ACTION_GET_ITEMS_FROM_CLOSEST_CABINET:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          // shouldn't have any current action but make sure everything
          // is clear... and set pending action so the guy won't move
          // until the pickup is completed
          CancelAIAction(pSoldier, FORCE);
          pSoldier.bAction = Enum289.AI_ACTION_PENDING_ACTION;

          // make sure the pickup starts dammit!
          pSoldier.fInNonintAnim = false;
          pSoldier.fRTInNonintAnim = false;

          if (pSoldier.ubProfile == Enum268.ARMAND) {
            sGridNo = 6968;
          } else {
            sGridNo = FindNearestOpenableNonDoor(pSoldier.sGridNo);
          }

          SoldierPickupItem(pSoldier, ITEM_PICKUP_ACTION_ALL, sGridNo, ITEM_IGNORE_Z_LEVEL);
        }

        break;
      case Enum213.NPC_ACTION_SHOW_TIXA:
        SetTixaAsFound();
        AddHistoryToPlayersLog(Enum83.HISTORY_DISCOVERED_TIXA, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_SHOW_ORTA:
        SetOrtaAsFound();
        AddHistoryToPlayersLog(Enum83.HISTORY_DISCOVERED_ORTA, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_SLAP:

        // OK, LET'S FIND THE QUEEN AND MAKE HER DO SLAP ANIMATION
        pSoldier = FindSoldierByProfileID(Enum268.QUEEN, false);
        if (pSoldier) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_SLAP, 0, false);
        }
        break;

      case Enum213.NPC_ACTION_PUNCH_PC_SLOT_0:
      case Enum213.NPC_ACTION_PUNCH_PC_SLOT_1:
      case Enum213.NPC_ACTION_PUNCH_PC_SLOT_2:

        DeleteTalkingMenu();
        // OK, LET'S FIND THE QUEEN AND MAKE HER DO SLAP ANIMATION
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          let ubTargetID: UINT8;
          let pTarget: SOLDIERTYPE | null;

          // Target a different merc....
          if (usActionCode == Enum213.NPC_ACTION_PUNCH_PC_SLOT_0) {
            sGridNo = gsInterrogationGridNo[0];
            // pTarget = MercPtrs[ 0 ];
          } else if (usActionCode == Enum213.NPC_ACTION_PUNCH_PC_SLOT_1) {
            // pTarget = MercPtrs[ 1 ];
            sGridNo = gsInterrogationGridNo[1];
          } else // if ( usActionCode == NPC_ACTION_PUNCH_PC_SLOT_2 )
          {
            // pTarget = MercPtrs[ 2 ];
            sGridNo = gsInterrogationGridNo[2];
          }

          ubTargetID = WhoIsThere2(sGridNo, 0);
          if (ubTargetID == NOBODY) {
            pTarget = null;
          } else {
            pTarget = MercPtrs[ubTargetID];
          }

          // Use a different approach....
          if (usActionCode == Enum213.NPC_ACTION_PUNCH_PC_SLOT_0) {
            pSoldier.uiPendingActionData4 = Enum296.APPROACH_DONE_PUNCH_0;
          } else if (usActionCode == Enum213.NPC_ACTION_PUNCH_PC_SLOT_1) {
            pSoldier.uiPendingActionData4 = Enum296.APPROACH_DONE_PUNCH_1;
          } else if (usActionCode == Enum213.NPC_ACTION_PUNCH_PC_SLOT_2) {
            pSoldier.uiPendingActionData4 = Enum296.APPROACH_DONE_PUNCH_2;
          }

          if (pTarget && pTarget.bActive && pTarget.bInSector && pTarget.bLife != 0) {
            pSoldier.bNextAction = Enum289.AI_ACTION_KNIFE_MOVE;
            pSoldier.usNextActionData = pTarget.sGridNo;
            pSoldier.fAIFlags |= AI_HANDLE_EVERY_FRAME;

            // UNless he's has a pending action, delete what he was doing!
            // Cancel anything he was doing
            if (pSoldier.bAction != Enum289.AI_ACTION_PENDING_ACTION) {
              CancelAIAction(pSoldier, 1);
            }

            // HandleItem( pSoldier, pTarget->sGridNo, 0, NOTHING, FALSE );

            pSoldier.uiStatusFlags |= SOLDIER_NPC_DOING_PUNCH;
          } else {
            TriggerNPCWithGivenApproach(pSoldier.ubProfile, pSoldier.uiPendingActionData4, false);
          }
        }
        break;

      case Enum213.NPC_ACTION_SHOOT_ELLIOT:

        DeleteTalkingMenu();

        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          let pTarget: SOLDIERTYPE | null;

          pTarget = FindSoldierByProfileID(Enum268.ELLIOT, false);

          if (pTarget) {
            // Set special flag....
            pTarget.uiStatusFlags |= SOLDIER_NPC_SHOOTING;
            pSoldier.uiStatusFlags |= SOLDIER_NPC_SHOOTING;

            pSoldier.bAimShotLocation = AIM_SHOT_HEAD;

            // Add gun to inventory.....
            CreateItem((Enum225.DESERTEAGLE), 100, pSoldier.inv[Enum261.HANDPOS]);

            // Make shoot
            pSoldier.bNextAction = Enum289.AI_ACTION_FIRE_GUN;
            pSoldier.usNextActionData = pTarget.sGridNo;
            pSoldier.fAIFlags |= AI_HANDLE_EVERY_FRAME;

            // UNless he's has a pending action, delete what he was doing!
            // Cancel anything he was doing
            if (pSoldier.bAction != Enum289.AI_ACTION_PENDING_ACTION) {
              CancelAIAction(pSoldier, 1);
            }

            // change elliot portrait...
            gMercProfiles[Enum268.ELLIOT].bNPCData = 17;
          }
        }
        break;

        // Emmons: is this line of code part of something missing
        // or no longer necessary?  CJC
        // if ( pSoldier->uiStatusFlags & SOLDIER_NPC_SHOOTING )

      case Enum213.NPC_ACTION_PUNCH_FIRST_LIVING_PC:

        // Punch first living pc....
        // OK, LET'S FIND THE QUEEN AND MAKE HER DO SLAP ANIMATION
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          let ubTargetID: UINT8;
          let pTarget: SOLDIERTYPE;
          let cnt: INT32;
          let fGoodTarget: boolean = false;

          for (cnt = 0; cnt < 3; cnt++) {
            ubTargetID = WhoIsThere2(gsInterrogationGridNo[cnt], 0);
            if (ubTargetID == NOBODY) {
              continue;
            } else {
              pTarget = MercPtrs[ubTargetID];
            }

            pSoldier.uiPendingActionData4 = Enum296.APPROACH_DONE_PUNCH_1;

            // If we are elliot, we can't do unconocious guys....
            if (pSoldier.ubProfile == Enum268.ELLIOT) {
              if (pTarget.bActive && pTarget.bInSector && pTarget.bLife >= OKLIFE) {
                fGoodTarget = true;
              }
            } else {
              if (pTarget.bActive && pTarget.bInSector && pTarget.bLife != 0) {
                fGoodTarget = true;
              }
            }

            if (fGoodTarget) {
              pSoldier.bNextAction = Enum289.AI_ACTION_KNIFE_MOVE;
              pSoldier.usNextActionData = pTarget.sGridNo;
              pSoldier.fAIFlags |= AI_HANDLE_EVERY_FRAME;

              // UNless he's has a pending action, delete what he was doing!
              // Cancel anything he was doing
              if (pSoldier.bAction != Enum289.AI_ACTION_PENDING_ACTION) {
                CancelAIAction(pSoldier, 1);
              }

              pSoldier.uiStatusFlags |= SOLDIER_NPC_DOING_PUNCH;
              break;
            }
          }

          if (cnt == 3) {
            // If here, nobody was found...
            TriggerNPCWithGivenApproach(pSoldier.ubProfile, pSoldier.uiPendingActionData4, false);
          }
        }
        break;

      case Enum213.NPC_ACTION_FRUSTRATED_SLAP:

        // OK, LET'S FIND THE QUEEN AND MAKE HER DO SLAP ANIMATION
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_FRUSTRATED_SLAP, 0, false);
        }
        break;
      case Enum213.NPC_ACTION_START_TIMER_ON_KEITH_GOING_OUT_OF_BUSINESS:
        // start timer to place keith out of business
        AddStrategicEvent(Enum132.EVENT_KEITH_GOING_OUT_OF_BUSINESS, GetWorldTotalMin() + (6 * 24 * 60), 0);
        break;

      case Enum213.NPC_ACTION_KEITH_GOING_BACK_IN_BUSINESS:
        // keith is back in business
        SetFactFalse(Enum170.FACT_KEITH_OUT_OF_BUSINESS);
        break;
      case Enum213.NPC_ACTION_TRIGGER_QUEEN_BY_CITIES_CONTROLLED:
        switch (GetNumberOfWholeTownsUnderControlButExcludeCity(Enum135.OMERTA)) {
          case 0:
          case 1:
            TriggerNPCRecord(Enum268.QUEEN, 11);
            break;
          case 2:
            TriggerNPCRecord(Enum268.QUEEN, 7);
            break;
          case 3:
            TriggerNPCRecord(Enum268.QUEEN, 8);
            break;
          case 4:
            TriggerNPCRecord(Enum268.QUEEN, 9);
            break;
          case 5:
            TriggerNPCRecord(Enum268.QUEEN, 10);
            break;
          default:
            TriggerNPCRecord(Enum268.QUEEN, 11);
            break;
        }
        break;

      case Enum213.NPC_ACTION_SEND_SOLDIERS_TO_DRASSEN:
      case Enum213.NPC_ACTION_SEND_SOLDIERS_TO_BATTLE_LOCATION:
      case Enum213.NPC_ACTION_SEND_SOLDIERS_TO_OMERTA:
      case Enum213.NPC_ACTION_ADD_MORE_ELITES:
      case Enum213.NPC_ACTION_GIVE_KNOWLEDGE_OF_ALL_MERCS:
        break;

      case Enum213.NPC_ACTION_TRIGGER_QUEEN_BY_SAM_SITES_CONTROLLED:
        switch (GetNumberOfSAMSitesUnderPlayerControl()) {
          case 0:
          case 1:
            TriggerNPCRecord(Enum268.QUEEN, 7);
            break;
          case 2:
            TriggerNPCRecord(Enum268.QUEEN, 8);
            break;
          case 3:
            TriggerNPCRecord(Enum268.QUEEN, 9);
            break;
          default:
            break;
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_ELLIOT_BY_BATTLE_RESULT:
        if (gTacticalStatus.fLastBattleWon) {
          TriggerNPCRecord(Enum268.ELLIOT, 6);
        } else {
          TriggerNPCRecord(Enum268.ELLIOT, 8);
        }
        break;

      case Enum213.NPC_ACTION_TRIGGER_ELLIOT_BY_SAM_DISABLED:
        if (IsThereAFunctionalSAMSiteInSector(gTacticalStatus.ubLastBattleSectorX, gTacticalStatus.ubLastBattleSectorY, 0)) {
          TriggerNPCRecord(Enum268.QUEEN, 6);
        } else {
          TriggerNPCRecord(Enum268.ELLIOT, 2);
        }
        break;

      case Enum213.NPC_ACTION_TRIGGER_VINCE_BY_LOYALTY:
        if (CheckFact(Enum170.FACT_NPC_OWED_MONEY, ubTargetNPC) && (ubTargetNPC == Enum268.VINCE)) {
          // check if we owe vince cash
          TriggerNPCRecord(ubTargetNPC, 21);
        } else if (CheckFact(Enum170.FACT_VINCE_EXPLAINED_HAS_TO_CHARGE, ubTargetNPC) == false) {
          TriggerNPCRecord(ubTargetNPC, 15);
        } else {
          if (CheckFact(Enum170.FACT_LOYALTY_LOW, ubTargetNPC)) {
            gbHospitalPriceModifier = Enum212.HOSPITAL_NORMAL;
            TriggerNPCRecord(ubTargetNPC, 16);
          } else if (CheckFact(Enum170.FACT_LOYALTY_OKAY, ubTargetNPC)) {
            gbHospitalPriceModifier = Enum212.HOSPITAL_BREAK;
            TriggerNPCRecord(ubTargetNPC, 17);
          } else {
            iRandom = PreRandom(100);
            if (ubTargetNPC == Enum268.VINCE) {
              if ((gbHospitalPriceModifier == Enum212.HOSPITAL_RANDOM_FREEBIE || gbHospitalPriceModifier == Enum212.HOSPITAL_FREEBIE) || (CheckFact(Enum170.FACT_HOSPITAL_FREEBIE_DECISION_MADE, 0) == false && iRandom < CHANCE_FOR_DOCTOR_TO_SAY_RANDOM_QUOTE)) {
                SetFactTrue(Enum170.FACT_HOSPITAL_FREEBIE_DECISION_MADE);
                if (CheckFact(Enum170.FACT_LOYALTY_HIGH, ubTargetNPC) && CheckFact(Enum170.FACT_24_HOURS_SINCE_DOCTOR_TALKED_TO, ubTargetNPC)) {
                  // loyalty high... freebie
                  gbHospitalPriceModifier = Enum212.HOSPITAL_FREEBIE;
                  TriggerNPCRecord(ubTargetNPC, 19);
                } else {
                  // random vince quote
                  gbHospitalPriceModifier = Enum212.HOSPITAL_RANDOM_FREEBIE;
                  TriggerNPCRecord(ubTargetNPC, 20);
                }
              } else // loyalty good
              {
                gbHospitalPriceModifier = Enum212.HOSPITAL_COST;
                TriggerNPCRecord(ubTargetNPC, 18);
              }
            } else {
              // it's steve willis

              // in discount mode?
              if (CheckFact(Enum170.FACT_WILLIS_GIVES_DISCOUNT, ubTargetNPC)) {
                // yep inform player
                gbHospitalPriceModifier = Enum212.HOSPITAL_COST;
                TriggerNPCRecord(ubTargetNPC, 21);
              } else if (CheckFact(Enum170.FACT_WILLIS_HEARD_ABOUT_JOEY_RESCUE, ubTargetNPC)) {
                // joey rescued.... note this will set FACT_WILLIS_GIVES_DISCOUNT so this will only ever be handled once
                gbHospitalPriceModifier = Enum212.HOSPITAL_FREEBIE;
                TriggerNPCRecord(ubTargetNPC, 20);
              } else if (CheckFact(Enum170.FACT_LOYALTY_HIGH, ubTargetNPC) && CheckFact(Enum170.FACT_24_HOURS_SINCE_DOCTOR_TALKED_TO, ubTargetNPC) && ((gbHospitalPriceModifier == Enum212.HOSPITAL_FREEBIE) || (CheckFact(Enum170.FACT_HOSPITAL_FREEBIE_DECISION_MADE, 0) == false && iRandom < CHANCE_FOR_DOCTOR_TO_SAY_RANDOM_QUOTE))) {
                // loyalty high... freebie
                gbHospitalPriceModifier = Enum212.HOSPITAL_FREEBIE;
                TriggerNPCRecord(ubTargetNPC, 19);
              } else // loyalty good
              {
                gbHospitalPriceModifier = Enum212.HOSPITAL_COST;
                TriggerNPCRecord(ubTargetNPC, 18);
              }
            }
          }
        }
        break;
      case Enum213.NPC_ACTION_CHECK_DOCTORING_MONEY_GIVEN:
        break;
      case Enum213.NPC_ACTION_DOCTOR_ESCORT_PATIENTS:
        // find anyone in sector who is wounded; set to hospital patient
        pSoldier2 = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier2) {
          // HOSPITAL_PATIENT_DISTANCE
          cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
          for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
            // Are we in this sector, On the current squad?
            if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife > 0 && pSoldier.bLife < pSoldier.bLifeMax && pSoldier.bAssignment != Enum117.ASSIGNMENT_HOSPITAL && PythSpacesAway(pSoldier.sGridNo, pSoldier2.sGridNo) < HOSPITAL_PATIENT_DISTANCE) {
              SetSoldierAssignment(pSoldier, Enum117.ASSIGNMENT_HOSPITAL, 0, 0, 0);
              TriggerNPCRecord(pSoldier.ubProfile, 2);
              pSoldier.bHospitalPriceModifier = gbHospitalPriceModifier;
              // make sure this person doesn't have an absolute dest any more
              pSoldier.sAbsoluteFinalDestination = NOWHERE;
            }
          }

          SetFactFalse(Enum170.FACT_HOSPITAL_FREEBIE_DECISION_MADE);
          gbHospitalPriceModifier = Enum212.HOSPITAL_NORMAL;
        }
        break;
      case Enum213.NPC_ACTION_START_DOCTORING: {
        // reset fact he is expecting money fromt he player
        SetFactFalse(Enum170.FACT_VINCE_EXPECTING_MONEY);

        // check fact
        if (CheckFact(Enum170.FACT_PLAYER_STOLE_MEDICAL_SUPPLIES, ubTargetNPC)) {
          TriggerNPCRecord(ubTargetNPC, 28);
        } else {
          TriggerNPCRecord(ubTargetNPC, 35);
        }
      } break;

      case Enum213.NPC_ACTION_VINCE_UNRECRUITABLE:
        SetFactFalse(Enum170.FACT_VINCE_RECRUITABLE);
        break;
      case Enum213.NPC_ACTION_ELLIOT_DECIDE_WHICH_QUOTE_FOR_PLAYER_ATTACK:
        if (DidFirstBattleTakePlaceInThisTown(Enum135.DRASSEN)) {
          TriggerNPCRecord(Enum268.ELLIOT, 2);
        } else if (DidFirstBattleTakePlaceInThisTown(Enum135.CAMBRIA)) {
          TriggerNPCRecord(Enum268.ELLIOT, 3);
        } else {
          TriggerNPCRecord(Enum268.ELLIOT, 1);
        }
        break;
      case Enum213.NPC_ACTION_QUEEN_DECIDE_WHICH_QUOTE_FOR_PLAYER_ATTACK:
        if (DidFirstBattleTakePlaceInThisTown(Enum135.DRASSEN)) {
          TriggerNPCRecord(Enum268.QUEEN, 8);
        } else {
          TriggerNPCRecord(Enum268.QUEEN, 9);
        }

        break;
      case Enum213.NPC_ACTION_KROTT_ALIVE_LOYALTY_BOOST:
        /* Delayed loyalty effects elimininated.  Sep.12/98.  ARM
                                        AddFutureDayStrategicEvent( EVENT_SET_BY_NPC_SYSTEM, 480 + Random( 60 ), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + NPC_ACTION_KROTT_ALIVE_LOYALTY_BOOST, 1 );
        */
        if (gMercProfiles[Enum268.SERGEANT].bMercStatus != MERC_IS_DEAD) {
          // give loyalty bonus to Alma
          IncrementTownLoyalty(Enum135.ALMA, LOYALTY_BONUS_FOR_SERGEANT_KROTT);
        }
        break;

      case Enum213.NPC_ACTION_MAKE_NPC_FIRST_BARTENDER:
        gMercProfiles[ubTargetNPC].bNPCData = 1;
        break;
      case Enum213.NPC_ACTION_MAKE_NPC_SECOND_BARTENDER:
        gMercProfiles[ubTargetNPC].bNPCData = 2;
        break;
      case Enum213.NPC_ACTION_MAKE_NPC_THIRD_BARTENDER:
        gMercProfiles[ubTargetNPC].bNPCData = 3;
        break;
      case Enum213.NPC_ACTION_MAKE_NPC_FOURTH_BARTENDER:
        gMercProfiles[ubTargetNPC].bNPCData = 4;
        break;

      case Enum213.NPC_ACTION_END_DEMO:
        DeleteTalkingMenu();
        // hack!!
        EndGameMessageBoxCallBack(MSG_BOX_RETURN_YES);
        break;

      case Enum213.NPC_ACTION_SEND_ENRICO_MIGUEL_EMAIL:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, 390 + Random(60), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_SEND_ENRICO_MIGUEL_EMAIL, 1);
        break;

      case Enum213.NPC_ACTION_PLAYER_SAYS_NICE_LATER:
        SetFactTrue(Enum170.FACT_NEED_TO_SAY_SOMETHING);
        gubNiceNPCProfile = gpDestSoldier.ubProfile;
        break;

      case Enum213.NPC_ACTION_PLAYER_SAYS_NASTY_LATER:
        SetFactTrue(Enum170.FACT_NEED_TO_SAY_SOMETHING);
        gubNastyNPCProfile = gpDestSoldier.ubProfile;
        break;

      case Enum213.NPC_ACTION_CHOOSE_DOCTOR:
        // find doctors available and trigger record 12 or 13
        pSoldier = FindSoldierByProfileID(Enum268.STEVE, false); // Steve Willis, 80
        if (pSoldier) {
          if (!pSoldier.bActive || !pSoldier.bInSector || !(pSoldier.bTeam == CIV_TEAM) || !(pSoldier.bNeutral) || (pSoldier.bLife < OKLIFE)) {
            pSoldier = null;
          }
        }

        pSoldier2 = FindSoldierByProfileID(Enum268.VINCE, false); // Vince, 69
        if (pSoldier2) {
          if (!pSoldier2.bActive || !pSoldier2.bInSector || !(pSoldier2.bTeam == CIV_TEAM) || !(pSoldier2.bNeutral) || (pSoldier2.bLife < OKLIFE)) {
            pSoldier2 = null;
          }
        }

        if (pSoldier == null && pSoldier2 == null) {
          // uh oh
          break;
        }

        if ((pSoldier) && (pSoldier2)) {
          if (pSoldier.sGridNo == 10343) {
            pSoldier2 = null;
          } else if (pSoldier2.sGridNo == 10343) {
            pSoldier = null;
          }
        }

        if (pSoldier && pSoldier2) {
          // both doctors available... turn one off randomly
          if (Random(2)) {
            pSoldier = null;
          } else {
            pSoldier2 = null;
          }
        }

        // only one pointer left...

        if (pSoldier) {
          TriggerNPCRecord(ubTargetNPC, 12);
        } else {
          TriggerNPCRecord(ubTargetNPC, 13);
        }

        break;

      case Enum213.NPC_ACTION_INVOKE_CONVERSATION_MODE:
        if (!gfInTalkPanel) {
          let sNearestPC: INT16;
          let ubID: UINT8;

          pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
          if (pSoldier) {
            pSoldier2 = null;

            sNearestPC = ClosestPC(pSoldier, null);
            if (sNearestPC != NOWHERE) {
              ubID = WhoIsThere2(sNearestPC, 0);
              if (ubID != NOBODY) {
                pSoldier2 = MercPtrs[ubID];
              }
            }

            if (pSoldier2) {
              InitiateConversation(pSoldier, pSoldier2, Enum296.NPC_INITIAL_QUOTE, 0);
            }
          }
        }
        break;

      case Enum213.NPC_ACTION_KINGPIN_TRIGGER_25_OR_14:
        if (CheckFact(Enum170.FACT_KINGPIN_INTRODUCED_SELF, ubTargetNPC) == true) {
          TriggerNPCRecord(ubTargetNPC, 25);
        } else {
          TriggerNPCRecord(ubTargetNPC, 14);
        }
        break;

      case Enum213.NPC_ACTION_INITIATE_SHOPKEEPER_INTERFACE:
        // check if this is a shopkeeper who has been shutdown
        if (HandleShopKeepHasBeenShutDown(gTalkPanel.ubCharNum) == false) {
          DeleteTalkingMenu();

          EnterShopKeeperInterfaceScreen(gTalkPanel.ubCharNum);
        }
        break;

      case Enum213.NPC_ACTION_DRINK_WINE:
        gMercProfiles[ubTargetNPC].bNPCData += 2;
        break;

      case Enum213.NPC_ACTION_DRINK_BOOZE:
        gMercProfiles[ubTargetNPC].bNPCData += 4;
        break;

      case Enum213.NPC_ACTION_TRIGGER_ANGEL_22_OR_24:
        if (CheckFact(120, ubTargetNPC)) // NB fact 120 is Angel left deed on counter
        {
          TriggerNPCRecord(ubTargetNPC, 22);
        } else {
          TriggerNPCRecord(ubTargetNPC, 24);
        }
        break;

      case Enum213.NPC_ACTION_GRANT_EXPERIENCE_1:
        AwardExperienceBonusToActiveSquad(Enum200.EXP_BONUS_MINIMUM);
        break;
      case Enum213.NPC_ACTION_GRANT_EXPERIENCE_2:
        AwardExperienceBonusToActiveSquad(Enum200.EXP_BONUS_SMALL);
        break;
      case Enum213.NPC_ACTION_GRANT_EXPERIENCE_3:
        AwardExperienceBonusToActiveSquad(Enum200.EXP_BONUS_AVERAGE);
        break;
      case Enum213.NPC_ACTION_GRANT_EXPERIENCE_4:
        AwardExperienceBonusToActiveSquad(Enum200.EXP_BONUS_LARGE);
        break;
      case Enum213.NPC_ACTION_GRANT_EXPERIENCE_5:
        AwardExperienceBonusToActiveSquad(Enum200.EXP_BONUS_MAXIMUM);
        break;
      case Enum213.NPC_ACTION_TRIGGER_YANNI:
        if (CheckFact(Enum170.FACT_CHALICE_STOLEN, 0) == true) {
          TriggerNPCRecord(Enum268.YANNI, 8);
        } else {
          TriggerNPCRecord(Enum268.YANNI, 7);
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_MARY_OR_JOHN_RECORD_9:
        pSoldier = FindSoldierByProfileID(Enum268.MARY, false);
        if (pSoldier && pSoldier.bLife >= OKLIFE) {
          TriggerNPCRecord(Enum268.MARY, 9);
        } else {
          TriggerNPCRecord(Enum268.JOHN, 9);
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_MARY_OR_JOHN_RECORD_10:
        pSoldier = FindSoldierByProfileID(Enum268.MARY, false);
        if (pSoldier && pSoldier.bLife >= OKLIFE) {
          TriggerNPCRecord(Enum268.MARY, 10);
        } else {
          TriggerNPCRecord(Enum268.JOHN, 10);
        }
        break;

      case Enum213.NPC_ACTION_GET_OUT_OF_WHEELCHAIR:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier && pSoldier.ubBodyType == Enum194.CRIPPLECIV) {
          DeleteTalkingMenu();
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRIPPLE_KICKOUT, 0, true);
        }
        break;

      case Enum213.NPC_ACTION_GET_OUT_OF_WHEELCHAIR_AND_BECOME_HOSTILE:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier && pSoldier.ubBodyType == Enum194.CRIPPLECIV) {
          DeleteTalkingMenu();
          EVENT_InitNewSoldierAnim(pSoldier, Enum193.CRIPPLE_KICKOUT, 0, true);
        }
        TriggerFriendWithHostileQuote(ubTargetNPC);
        break;

      case Enum213.NPC_ACTION_ADD_JOHNS_GUN_SHIPMENT:
        AddJohnsGunShipment();
        // also close panel
        DeleteTalkingMenu();
        break;

      case Enum213.NPC_ACTION_SET_FACT_105_FALSE:
        SetFactFalse(Enum170.FACT_FRANK_HAS_BEEN_BRIBED);
        break;

      case Enum213.NPC_ACTION_CANCEL_WAYPOINTS:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          pSoldier.bOrders = Enum241.ONGUARD;
        }
        break;

      case Enum213.NPC_ACTION_MAKE_RAT_DISAPPEAR:
        // hack a flag to determine when RAT should leave
        gMercProfiles[Enum268.RAT].bNPCData = 1;
        break;

      case Enum213.NPC_ACTION_TRIGGER_MICKY_BY_SCI_FI:
        if (gGameOptions.fSciFi) {
          TriggerNPCRecord(Enum268.MICKY, 7);
        } else {
          TriggerNPCRecord(Enum268.MICKY, 8);
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_KROTT_11_OR_12:
        if (CheckFact(Enum170.FACT_KROTT_GOT_ANSWER_NO, Enum268.SERGEANT)) {
          TriggerNPCRecord(Enum268.SERGEANT, 11);
        } else {
          TriggerNPCRecord(Enum268.SERGEANT, 12);
        }
        break;

      case Enum213.NPC_ACTION_CHANGE_MANNY_POSITION:
        gMercProfiles[Enum268.MANNY].ubMiscFlags3 |= PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;
        gMercProfiles[Enum268.MANNY].ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        gMercProfiles[Enum268.MANNY].usStrategicInsertionData = 19904;
        gMercProfiles[Enum268.MANNY].fUseProfileInsertionInfo = true;
        pSoldier = FindSoldierByProfileID(Enum268.MANNY, false);
        if (pSoldier) {
          pSoldier.bOrders = Enum241.STATIONARY;
        }
        // close his panel too
        DeleteTalkingMenu();
        break;

      case Enum213.NPC_ACTION_MAKE_BRENDA_STATIONARY:
        pSoldier = FindSoldierByProfileID(Enum268.BRENDA, false);
        if (pSoldier) {
          gMercProfiles[Enum268.BRENDA].ubMiscFlags3 |= PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;
          gMercProfiles[Enum268.BRENDA].ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
          gMercProfiles[Enum268.BRENDA].usStrategicInsertionData = pSoldier.sGridNo;
          gMercProfiles[Enum268.BRENDA].fUseProfileInsertionInfo = true;
          pSoldier.bOrders = Enum241.STATIONARY;
        }
        break;

      case Enum213.NPC_ACTION_MAKE_MIGUEL_STATIONARY:
        pSoldier = FindSoldierByProfileID(Enum268.MIGUEL, false);
        if (pSoldier) {
          gMercProfiles[Enum268.MIGUEL].ubMiscFlags3 |= PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE;
          gMercProfiles[Enum268.MIGUEL].ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
          gMercProfiles[Enum268.MIGUEL].usStrategicInsertionData = pSoldier.sGridNo;
          gMercProfiles[Enum268.MIGUEL].fUseProfileInsertionInfo = true;
          pSoldier.bOrders = Enum241.STATIONARY;
        }
        break;

      case Enum213.NPC_ACTION_TRIGGER_DARREN_OR_KINGPIN_IMPRESSED:
        if (BoxerAvailable()) {
          TriggerNPCRecord(Enum268.DARREN, 25);
        }
        // else FALL THROUGH to check for Kingpin being impressed
      case Enum213.NPC_ACTION_TRIGGER_KINGPIN_IMPRESSED:
        if (gfLastBoxingMatchWonByPlayer && !BoxerAvailable()) {
          TriggerNPCRecord(Enum268.KINGPIN, 15);
        }
        break;

      case Enum213.NPC_ACTION_ADD_RAT:
        // add Rat
        gMercProfiles[Enum268.RAT].sSectorX = 9;
        gMercProfiles[Enum268.RAT].sSectorY = MAP_ROW_G;
        gMercProfiles[Enum268.RAT].bSectorZ = 0;
        break;

      case Enum213.NPC_ACTION_ENDGAME_STATE_1:

        // What is the status of fact for creatures?
        if (gubQuest[15] == QUESTINPROGRESS) {
          // This is not the end, 'cause momma creature is still alive
          TriggerNPCRecordImmediately(136, 8);
          EndQueenDeathEndgame();
        } else {
          // Continue with endgame cimematic..
          DeleteTalkingMenu();
          EndQueenDeathEndgameBeginEndCimenatic();
        }
        break;

      case Enum213.NPC_ACTION_ENDGAME_STATE_2:

        // Just end queen killed dequence.......
        DeleteTalkingMenu();
        EndQueenDeathEndgame();
        break;

      case Enum213.NPC_ACTION_MAKE_ESTONI_A_FUEL_SITE:
        // Jake's script also sets the fact, but we need to be sure it happens before updating availability
        SetFactTrue(Enum170.FACT_ESTONI_REFUELLING_POSSIBLE);
        UpdateRefuelSiteAvailability();
        break;

      case Enum213.NPC_ACTION_24_HOURS_SINCE_JOEY_RESCUED:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), Enum170.FACT_24_HOURS_SINCE_JOEY_RESCUED, 1);
        break;

      case Enum213.NPC_ACTION_24_HOURS_SINCE_DOCTORS_TALKED_TO:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), Enum170.FACT_24_HOURS_SINCE_DOCTOR_TALKED_TO, 1);
        break;

      case Enum213.NPC_ACTION_REMOVE_MERC_FOR_MARRIAGE:
        pSoldier = <SOLDIERTYPE>FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          pSoldier = ChangeSoldierTeam(pSoldier, CIV_TEAM);
        }
        // remove profile from map
        gMercProfiles[pSoldier.ubProfile].sSectorX = 0;
        gMercProfiles[pSoldier.ubProfile].sSectorY = 0;
        pSoldier.ubProfile = NO_PROFILE;
        // set to 0 civ group
        pSoldier.ubCivilianGroup = 0;
        break;

      case Enum213.NPC_ACTION_TIMER_FOR_VEHICLE:
        AddFutureDayStrategicEvent(Enum132.EVENT_SET_BY_NPC_SYSTEM, GetWorldMinutesInDay(), NPC_SYSTEM_EVENT_ACTION_PARAM_BONUS + Enum213.NPC_ACTION_TIMER_FOR_VEHICLE, 1);
        break;

      case Enum213.NPC_ACTION_RESET_SHIPMENT_ARRIVAL_STUFF:
        break;

      case Enum213.NPC_ACTION_TRIGGER_JOE_32_OR_33:
        if (gbWorldSectorZ > 0) {
          TriggerNPCRecord(Enum268.JOE, 32);
        } else {
          TriggerNPCRecord(Enum268.JOE, 33);
        }
        break;
      case Enum213.NPC_ACTION_REMOVE_NPC:
        pSoldier = FindSoldierByProfileID(ubTargetNPC, false);
        if (pSoldier) {
          EndAIGuysTurn(pSoldier);
          RemoveManAsTarget(pSoldier);
          TacticalRemoveSoldier(pSoldier.ubID);
          gMercProfiles[ubTargetNPC].sSectorX = 0;
          gMercProfiles[ubTargetNPC].sSectorY = 0;
          CheckForEndOfBattle(true);
        }
        break;

      case Enum213.NPC_ACTION_HISTORY_GOT_ROCKET_RIFLES:
        AddHistoryToPlayersLog(Enum83.HISTORY_GOT_ROCKET_RIFLES, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_DEIDRANNA_DEAD_BODIES:
        AddHistoryToPlayersLog(Enum83.HISTORY_DEIDRANNA_DEAD_BODIES, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_BOXING_MATCHES:
        AddHistoryToPlayersLog(Enum83.HISTORY_BOXING_MATCHES, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_SOMETHING_IN_MINES:
        AddHistoryToPlayersLog(Enum83.HISTORY_SOMETHING_IN_MINES, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_DEVIN:
        AddHistoryToPlayersLog(Enum83.HISTORY_DEVIN, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_MIKE:
        AddHistoryToPlayersLog(Enum83.HISTORY_MIKE, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_TONY:
        AddHistoryToPlayersLog(Enum83.HISTORY_TONY, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_KROTT:
        AddHistoryToPlayersLog(Enum83.HISTORY_KROTT, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_KYLE:
        AddHistoryToPlayersLog(Enum83.HISTORY_KYLE, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_MADLAB:
        AddHistoryToPlayersLog(Enum83.HISTORY_MADLAB, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_GABBY:
        AddHistoryToPlayersLog(Enum83.HISTORY_GABBY, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_KEITH_OUT_OF_BUSINESS:
        AddHistoryToPlayersLog(Enum83.HISTORY_KEITH_OUT_OF_BUSINESS, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_HOWARD_CYANIDE:
        AddHistoryToPlayersLog(Enum83.HISTORY_HOWARD_CYANIDE, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_KEITH:
        AddHistoryToPlayersLog(Enum83.HISTORY_KEITH, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_HOWARD:
        AddHistoryToPlayersLog(Enum83.HISTORY_HOWARD, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_PERKO:
        AddHistoryToPlayersLog(Enum83.HISTORY_PERKO, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_SAM:
        AddHistoryToPlayersLog(Enum83.HISTORY_SAM, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_FRANZ:
        AddHistoryToPlayersLog(Enum83.HISTORY_FRANZ, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_ARNOLD:
        AddHistoryToPlayersLog(Enum83.HISTORY_ARNOLD, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_FREDO:
        AddHistoryToPlayersLog(Enum83.HISTORY_FREDO, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_RICHGUY_BALIME:
        AddHistoryToPlayersLog(Enum83.HISTORY_RICHGUY_BALIME, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_JAKE:
        AddHistoryToPlayersLog(Enum83.HISTORY_JAKE, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_BUM_KEYCARD:
        AddHistoryToPlayersLog(Enum83.HISTORY_BUM_KEYCARD, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_WALTER:
        AddHistoryToPlayersLog(Enum83.HISTORY_WALTER, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_DAVE:
        AddHistoryToPlayersLog(Enum83.HISTORY_DAVE, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_PABLO:
        AddHistoryToPlayersLog(Enum83.HISTORY_PABLO, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_HISTORY_KINGPIN_MONEY:
        AddHistoryToPlayersLog(Enum83.HISTORY_KINGPIN_MONEY, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_SEND_TROOPS_TO_SAM:
        break;
      case Enum213.NPC_ACTION_PUT_PACOS_IN_BASEMENT:
        gMercProfiles[Enum268.PACOS].sSectorX = 10;
        gMercProfiles[Enum268.PACOS].sSectorY = MAP_ROW_A;
        gMercProfiles[Enum268.PACOS].bSectorZ = 0;
        break;
      case Enum213.NPC_ACTION_HISTORY_ASSASSIN:
        AddHistoryToPlayersLog(Enum83.HISTORY_ASSASSIN, 0, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
      case Enum213.NPC_ACTION_TRIGGER_HANS_BY_ROOM: {
        if (gpSrcSoldier) {
          let ubRoom: UINT8;

          if ((ubRoom = InARoom(gpSrcSoldier.sGridNo)) !== -1 && (ubRoom == 49)) {
            TriggerNPCRecord(Enum268.HANS, 18);
          } else {
            TriggerNPCRecord(Enum268.HANS, 14);
          }
        }
      } break;
      case Enum213.NPC_ACTION_TRIGGER_MADLAB_31:
        if (PlayerTeamFull()) {
          DeleteTalkingMenu();
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_RECRUIT_TEAM_FULL]);
        } else {
          TriggerNPCRecord(Enum268.MADLAB, 31);
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_MADLAB_32:
        if (PlayerTeamFull()) {
          DeleteTalkingMenu();
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_RECRUIT_TEAM_FULL]);
        } else {
          TriggerNPCRecord(Enum268.MADLAB, 32);
        }
        break;
      case Enum213.NPC_ACTION_TRIGGER_BREWSTER_BY_WARDEN_PROXIMITY:
        pSoldier = FindSoldierByProfileID(Enum268.BREWSTER, false);
        if (pSoldier) {
          sGridNo = GetGridNoOfCorpseGivenProfileID(Enum268.WARDEN);
          if (sGridNo != NOWHERE && PythSpacesAway(pSoldier.sGridNo, sGridNo) <= 10) {
            TriggerNPCRecord(Enum268.BREWSTER, 16);
          } else {
            TriggerNPCRecord(Enum268.BREWSTER, 17);
          }
        }
        break;
      case Enum213.NPC_ACTION_FILL_UP_CAR:
        pSoldier = FindSoldierByProfileID(Enum268.PROF_HUMMER, true);
        if (!pSoldier) {
          // ice cream truck?
          pSoldier = FindSoldierByProfileID(Enum268.PROF_ICECREAM, true);
        } else if (pSoldier.sBreathRed == 10000) {
          pSoldier2 = FindSoldierByProfileID(Enum268.PROF_ICECREAM, true);
          if (pSoldier2) {
            // try refueling this vehicle instead
            pSoldier = pSoldier2;
          }
        }
        if (pSoldier) {
          pSoldier.sBreathRed = 10000;
          pSoldier.bBreath = 100;
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[50]);
        }
        break;
      case Enum213.NPC_ACTION_WALTER_GIVEN_MONEY_INITIALLY:
        if (gMercProfiles[Enum268.WALTER].iBalance >= WALTER_BRIBE_AMOUNT) {
          TriggerNPCRecord(Enum268.WALTER, 16);
        } else {
          TriggerNPCRecord(Enum268.WALTER, 14);
        }
        break;
      case Enum213.NPC_ACTION_WALTER_GIVEN_MONEY:
        if (gMercProfiles[Enum268.WALTER].iBalance >= WALTER_BRIBE_AMOUNT) {
          TriggerNPCRecord(Enum268.WALTER, 16);
        } else {
          TriggerNPCRecord(Enum268.WALTER, 15);
        }
        break;
      default:
        ScreenMsg(FONT_MCOLOR_RED, MSG_TESTVERSION, "No code support for NPC action %d", usActionCode);
        break;
    }
  }
}

export function CalcPatientMedicalCost(pSoldier: SOLDIERTYPE | null): UINT32 {
  let uiCost: UINT32;

  if (!pSoldier) {
    return 0;
  }

  if (pSoldier.bHospitalPriceModifier == Enum212.HOSPITAL_FREEBIE || pSoldier.bHospitalPriceModifier == Enum212.HOSPITAL_RANDOM_FREEBIE) {
    return 0;
  }

  uiCost = 10 * (pSoldier.bLifeMax - pSoldier.bLife);

  if (pSoldier.bLife < OKLIFE) {
    // charge additional $25 for every point below OKLIFE he is
    uiCost += (25 * (OKLIFE - pSoldier.bLife));
  }

  // also charge $2 for each point of bleeding that must be stopped
  if (pSoldier.bBleeding > 0) {
    uiCost += (2 * pSoldier.bBleeding);
  }

  if (pSoldier.bHospitalPriceModifier == Enum212.HOSPITAL_BREAK) {
    uiCost = (uiCost * 85) / 100;
  } else if (pSoldier.bHospitalPriceModifier == Enum212.HOSPITAL_COST) {
    // 30% discount
    uiCost = (uiCost * 70) / 100;
  } else if (pSoldier.bHospitalPriceModifier == Enum212.HOSPITAL_UNSET) {
    if (gbHospitalPriceModifier == Enum212.HOSPITAL_BREAK) {
      // 15% discount
      uiCost = (uiCost * 85) / 100;
    } else if (gbHospitalPriceModifier == Enum212.HOSPITAL_COST) {
      // 30% discount
      uiCost = (uiCost * 70) / 100;
    }
  }

  return uiCost;
}

export function CalcMedicalCost(ubId: UINT8): UINT32 {
  let cnt: INT32;
  let uiCostSoFar: UINT32;
  let sGridNo: INT16 = 0;
  let pSoldier: SOLDIERTYPE;
  let pNPC: SOLDIERTYPE | null;

  uiCostSoFar = 0;

  // find the doctor's soldiertype to get his position
  pNPC = FindSoldierByProfileID(ubId, false);
  if (!pNPC) {
    return 0;
  }

  sGridNo = pNPC.sGridNo;

  for (cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];
    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife > 0 && pSoldier.bAssignment != Enum117.ASSIGNMENT_HOSPITAL) {
      if (pSoldier.bLife < pSoldier.bLifeMax) {
        if (PythSpacesAway(sGridNo, pSoldier.sGridNo) <= HOSPITAL_PATIENT_DISTANCE) {
          uiCostSoFar += CalcPatientMedicalCost(pSoldier);
        }
      }
    }
  }

  // round up to nearest 10 dollars
  uiCostSoFar = ((uiCostSoFar + 9) / 10);
  uiCostSoFar *= 10;

  // always ask for at least $10
  uiCostSoFar = Math.max(10, uiCostSoFar);

  return uiCostSoFar;
}

function PlayerTeamHasTwoSpotsLeft(): boolean {
  let cnt: UINT32;
  let uiCount: UINT32 = 0;
  let pSoldier: SOLDIERTYPE;

  for (cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID, pSoldier = MercPtrs[cnt]; cnt <= (gTacticalStatus.Team[gbPlayerNum].bLastID - 2); cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive) {
      uiCount++;
    }
  }

  if (uiCount <= (gTacticalStatus.Team[gbPlayerNum].bLastID - 2) - 2) {
    return true;
  } else {
    return false;
  }
}

function StartDialogueMessageBox(ubProfileID: UINT8, usMessageBoxType: UINT16): void {
  let iTemp: INT32;
  let zTemp: string /* UINT16[256] */;
  let zTemp2: string /* UINT16[256] */;

  gusDialogueMessageBoxType = usMessageBoxType;
  switch (gusDialogueMessageBoxType) {
    case Enum213.NPC_ACTION_ASK_ABOUT_ESCORTING_EPC:
      if ((ubProfileID == Enum268.JOHN && gMercProfiles[Enum268.MARY].bMercStatus != MERC_IS_DEAD) || (ubProfileID == Enum268.MARY && gMercProfiles[Enum268.JOHN].bMercStatus != MERC_IS_DEAD)) {
        zTemp = gzLateLocalizedString[59];
      } else {
        zTemp = swprintf(TacticalStr[Enum335.ESCORT_PROMPT], gMercProfiles[ubProfileID].zNickname);
      }
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_ASK_ABOUT_PAYING_RPC:
    case Enum213.NPC_ACTION_ASK_ABOUT_PAYING_RPC_WITH_DAILY_SALARY:
    case Enum213.NPC_ACTION_REDUCE_CONRAD_SALARY_CONDITIONS:
      zTemp2 = swprintf("%d", gMercProfiles[ubProfileID].sSalary);
      zTemp2 = InsertDollarSignInToString(zTemp2);
      zTemp = swprintf(TacticalStr[Enum335.HIRE_PROMPT], gMercProfiles[ubProfileID].zNickname, zTemp2);
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_DARREN_REQUESTOR:
    case Enum213.NPC_ACTION_FIGHT_AGAIN_REQUESTOR:
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.BOXING_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_BUY_LEATHER_KEVLAR_VEST:
      zTemp2 = swprintf("%d", Item[Enum225.LEATHER_JACKET_W_KEVLAR].usPrice);
      zTemp2 = InsertDollarSignInToString(zTemp2);
      zTemp = swprintf(TacticalStr[Enum335.BUY_VEST_PROMPT], ItemNames[Enum225.LEATHER_JACKET_W_KEVLAR], zTemp2);
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_PROMPT_PLAYER_TO_LIE:
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.YESNOLIE_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNOLIE, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_MEDICAL_REQUESTOR_2:
      zTemp = TacticalStr[Enum335.FREE_MEDICAL_PROMPT];
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_MEDICAL_REQUESTOR:
      iTemp = CalcMedicalCost(ubProfileID);
      if (giHospitalRefund > iTemp) {
        iTemp = 10;
      } else {
        iTemp -= giHospitalRefund;
      }
      zTemp2 = swprintf("%ld", iTemp);
      zTemp2 = InsertDollarSignInToString(zTemp2);
      zTemp = swprintf(TacticalStr[Enum335.PAY_MONEY_PROMPT], zTemp2);

      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_BUY_VEHICLE_REQUESTOR:
      zTemp2 = swprintf("%ld", 10000);
      zTemp2 = InsertDollarSignInToString(zTemp2);
      zTemp = swprintf(TacticalStr[Enum335.PAY_MONEY_PROMPT], zTemp2);

      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_TRIGGER_MARRY_DARYL_PROMPT:
      zTemp = TacticalStr[Enum335.MARRY_DARYL_PROMPT];
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    case Enum213.NPC_ACTION_KROTT_REQUESTOR:
      zTemp = TacticalStr[Enum335.SPARE_KROTT_PROMPT];
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zTemp, Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, DialogueMessageBoxCallBack, null);
      break;
    default:
      break;
  }
}

function DialogueMessageBoxCallBack(ubExitValue: UINT8): void {
  let ubProfile: UINT8;
  let pSoldier: SOLDIERTYPE | null;

  Assert(gpDestSoldier);

  ubProfile = gpDestSoldier.ubProfile;

  switch (gusDialogueMessageBoxType) {
    case Enum213.NPC_ACTION_ASK_ABOUT_ESCORTING_EPC:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        // Delete menu
        DeleteTalkingMenu();

        if (PlayerTeamFull()) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_RECRUIT_TEAM_FULL]);
        } else {
          if (ubProfile == Enum268.JOHN) {
            // Mary might be alive, and if so we need to ensure two places
            pSoldier = FindSoldierByProfileID(Enum268.MARY, true);
            if (pSoldier && !PlayerTeamHasTwoSpotsLeft()) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_RECRUIT_TEAM_FULL]);
              break;
            }
          }

          RecruitEPC(ubProfile);

          // Get soldier pointer
          pSoldier = FindSoldierByProfileID(ubProfile, false);
          if (!pSoldier) {
            return;
          }

          // OK, update UI with message that we have been recruited
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.NOW_BING_ESCORTED_STR], gMercProfiles[ubProfile].zNickname, (pSoldier.bAssignment + 1));

          // Change Squads....
          SetCurrentSquad(pSoldier.bAssignment, false);

          HandleStuffForNPCEscorted(ubProfile);
        }
      }
      break;
    case Enum213.NPC_ACTION_ASK_ABOUT_PAYING_RPC:
    case Enum213.NPC_ACTION_ASK_ABOUT_PAYING_RPC_WITH_DAILY_SALARY:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(ubProfile, 1);
      } else {
        TriggerNPCRecord(ubProfile, 0);
      }
      break;
    case Enum213.NPC_ACTION_REDUCE_CONRAD_SALARY_CONDITIONS:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(ubProfile, 1);
      } else {
        TriggerNPCRecord(ubProfile, 2);
      }
      break;
      break;
    case Enum213.NPC_ACTION_DARREN_REQUESTOR:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(ubProfile, 13);
      } else {
        TriggerNPCRecord(ubProfile, 12);
      }
      break;
    case Enum213.NPC_ACTION_FIGHT_AGAIN_REQUESTOR:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(ubProfile, 30);
      } else {
        TriggerNPCRecord(ubProfile, 12);
      }
      break;
    case Enum213.NPC_ACTION_BUY_LEATHER_KEVLAR_VEST:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(ubProfile, 27);
      } else {
        TriggerNPCRecord(ubProfile, 28);
      }
      break;
    case Enum213.NPC_ACTION_PROMPT_PLAYER_TO_LIE:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(ubProfile, (ubRecordThatTriggeredLiePrompt + 1));
      } else if (ubExitValue == MSG_BOX_RETURN_NO) {
        TriggerNPCRecord(ubProfile, (ubRecordThatTriggeredLiePrompt + 2));
      } else {
        // He tried to lie.....
        // Find the best conscious merc with a chance....
        let cnt: UINT8;
        let pLier: SOLDIERTYPE | null = null;
        let pSoldier: SOLDIERTYPE;

        cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
        for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
          if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE && pSoldier.bBreath >= OKBREATH) {
            if (!pLier || (EffectiveWisdom(pSoldier) + EffectiveLeadership(pSoldier) > EffectiveWisdom(pLier) + EffectiveLeadership(pSoldier))) {
              pLier = pSoldier;
            }
          }
        }

        if (pLier && SkillCheck(pLier, Enum255.LIE_TO_QUEEN_CHECK, 0) >= 0) {
          // SUCCESS..
          TriggerNPCRecord(ubProfile, (ubRecordThatTriggeredLiePrompt + 4));
        } else {
          // NAUGHY BOY
          TriggerNPCRecord(ubProfile, (ubRecordThatTriggeredLiePrompt + 3));
        }
      }
      break;
    case Enum213.NPC_ACTION_MEDICAL_REQUESTOR:
    case Enum213.NPC_ACTION_MEDICAL_REQUESTOR_2:
      if (ubProfile == Enum268.VINCE) {
        if (gusDialogueMessageBoxType == Enum213.NPC_ACTION_MEDICAL_REQUESTOR) {
          if (ubExitValue == MSG_BOX_RETURN_YES) {
            // give the guy the cash
            TriggerNPCRecord(Enum268.VINCE, 23);
          } else {
            // no cash, no help
            TriggerNPCRecord(Enum268.VINCE, 24);
          }
        } else {
          if (ubExitValue == MSG_BOX_RETURN_YES) {
            // HandleNPCDoAction( VINCE, NPC_ACTION_CHECK_DOCTORING_MONEY_GIVEN, 0 );
            if (CheckFact(Enum170.FACT_WOUNDED_MERCS_NEARBY, Enum268.VINCE)) {
              TriggerNPCRecord(Enum268.VINCE, 26);
            } else if (CheckFact(Enum170.FACT_ONE_WOUNDED_MERC_NEARBY, Enum268.VINCE)) {
              TriggerNPCRecord(Enum268.VINCE, 25);
            }
            giHospitalTempBalance = 0;
          } else {
            // just don't want the help
            TriggerNPCRecord(Enum268.VINCE, 34);
          }
        }

        DeleteTalkingMenu();
      } else // Steven Willis
      {
        if (gusDialogueMessageBoxType == Enum213.NPC_ACTION_MEDICAL_REQUESTOR) {
          if (ubExitValue == MSG_BOX_RETURN_YES) {
            // give the guy the cash
            TriggerNPCRecord(Enum268.STEVE, 23);
          } else {
            // no cahs, no help
            TriggerNPCRecord(Enum268.STEVE, 24);
          }
        } else {
          if (ubExitValue == MSG_BOX_RETURN_YES) {
            // HandleNPCDoAction( STEVE, NPC_ACTION_CHECK_DOCTORING_MONEY_GIVEN, 0 );
            if (CheckFact(Enum170.FACT_WOUNDED_MERCS_NEARBY, Enum268.STEVE)) {
              TriggerNPCRecord(Enum268.STEVE, 26);
            } else if (CheckFact(Enum170.FACT_ONE_WOUNDED_MERC_NEARBY, Enum268.STEVE)) {
              TriggerNPCRecord(Enum268.STEVE, 25);
            }
            gMercProfiles[Enum268.VINCE].iBalance = 0;
          } else {
            // just don't want the help
            TriggerNPCRecord(Enum268.STEVE, 30);
          }
        }

        DeleteTalkingMenu();
      }
      break;
    case Enum213.NPC_ACTION_BUY_VEHICLE_REQUESTOR:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(Enum268.GERARD, 9); // Dave Gerard
      } else {
        TriggerNPCRecord(Enum268.GERARD, 8);
      }
      break;
    case Enum213.NPC_ACTION_KROTT_REQUESTOR:
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        TriggerNPCRecord(Enum268.SERGEANT, 7);
      } else {
        TriggerNPCRecord(Enum268.SERGEANT, 6);
      }
      break;
    case Enum213.NPC_ACTION_TRIGGER_MARRY_DARYL_PROMPT:
      Assert(gpSrcSoldier);
      gMercProfiles[gpSrcSoldier.ubProfile].ubMiscFlags2 |= PROFILE_MISC_FLAG2_ASKED_BY_HICKS;
      if (ubExitValue == MSG_BOX_RETURN_YES) {
        gMercProfiles[Enum268.DARYL].bNPCData = gpSrcSoldier.ubProfile;

        // create key for Daryl to give to player
        pSoldier = FindSoldierByProfileID(Enum268.DARYL, false);
        if (pSoldier) {
          let Key: OBJECTTYPE = createObjectType();

          CreateKeyObject(Key, 1, 38);
          AutoPlaceObject(pSoldier, Key, false);
        }
        TriggerNPCRecord(Enum268.DARYL, 11);
      } else {
        TriggerNPCRecord(Enum268.DARYL, 12);
      }
      break;
    default:
      break;
  }
}

function DoneFadeOutActionBasement(): void {
  // OK, insertion data found, enter sector!
  SetCurrentWorldSector(10, 1, 1);

  // OK, once down here, adjust the above map with crate info....
  gfTacticalTraversal = false;
  gpTacticalTraversalGroup = null;
  gpTacticalTraversalChosenSoldier = null;

  // Remove crate
  RemoveStructFromUnLoadedMapTempFile(7887, Enum312.SECONDOSTRUCT1, 10, 1, 0);
  // Add crate
  AddStructToUnLoadedMapTempFile(8207, Enum312.SECONDOSTRUCT1, 10, 1, 0);

  // Add trapdoor
  AddStructToUnLoadedMapTempFile(7887, Enum312.DEBRIS2MISC1, 10, 1, 0);

  gFadeInDoneCallback = DoneFadeInActionBasement;

  FadeInGameScreen();
}

function DoneFadeOutActionSex(): void {
  SetPendingNewScreen(Enum26.SEX_SCREEN);
}

function DoneFadeInActionBasement(): void {
  // Start conversation, etc
  let pSoldier: SOLDIERTYPE;
  let pNPCSoldier: SOLDIERTYPE | null;
  let cnt: INT32;

  // Look for someone to talk to
  // look for all mercs on the same team,
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // Are we in this sector, On the current squad?
    if (pSoldier.bActive && pSoldier.bLife >= OKLIFE && pSoldier.bInSector && pSoldier.bAssignment == CurrentSquad()) {
      break;
    }
  }

  // Get merc id for carlos!
  pNPCSoldier = FindSoldierByProfileID(58, false);
  if (!pNPCSoldier) {
    return;
  }

  // Converse!
  // InitiateConversation( pNPCSoldier, pSoldier, 0, 1 );
  TriggerNPCRecordImmediately(pNPCSoldier.ubProfile, 1);
}

function DoneFadeOutActionLeaveBasement(): void {
  // OK, insertion data found, enter sector!
  SetCurrentWorldSector(10, 1, 0);

  gfTacticalTraversal = false;
  gpTacticalTraversalGroup = null;
  gpTacticalTraversalChosenSoldier = null;

  gFadeInDoneCallback = DoneFadeInActionLeaveBasement;

  FadeInGameScreen();
}

function DoneFadeInActionLeaveBasement(): void {
  // Start conversation, etc
}

function NPCOpenThing(pSoldier: SOLDIERTYPE, fDoor: boolean): boolean {
  let pStructure: STRUCTURE | null;
  let sStructGridNo: INT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let sGridNo: INT16;
  let pDoor: DOOR | null;

  // Find closest door and get struct data for it!
  if (fDoor) {
    sStructGridNo = FindClosestDoor(pSoldier);

    if (sStructGridNo == NOWHERE) {
      return false;
    }

    pStructure = FindStructure(sStructGridNo, STRUCTURE_ANYDOOR);
  } else {
    // for Armand, hard code to tile 6968
    if (pSoldier.ubProfile == Enum268.ARMAND) {
      sStructGridNo = 6968;
    } else {
      sStructGridNo = FindNearestOpenableNonDoor(pSoldier.sGridNo);
    }

    if (sStructGridNo == NOWHERE) {
      return false;
    }

    pStructure = FindStructure(sStructGridNo, STRUCTURE_OPENABLE);
  }

  if (pStructure == null) {
    return false;
  }

  if (pStructure.fFlags & STRUCTURE_OPEN) {
    // it's already open!
    TriggerNPCWithGivenApproach(pSoldier.ubProfile, Enum296.APPROACH_DONE_OPEN_STRUCTURE, false);
    return false;
  }

  // anything that an NPC opens this way should become unlocked!

  pDoor = FindDoorInfoAtGridNo(sStructGridNo);
  if (pDoor) {
    pDoor.fLocked = false;
  }

  sActionGridNo = FindAdjacentGridEx(pSoldier, sStructGridNo, addressof(ubDirection), null, false, true);
  if (sActionGridNo == -1) {
    return false;
  }

  // Set dest gridno
  sGridNo = sActionGridNo;

  StartInteractiveObject(sStructGridNo, pStructure.usStructureID, pSoldier, ubDirection);

  // check if we are at this location
  if (pSoldier.sGridNo == sGridNo) {
    InteractWithInteractiveObject(pSoldier, pStructure, ubDirection);
  } else {
    SendGetNewSoldierPathEvent(pSoldier, sGridNo, pSoldier.usUIMovementMode);
  }

  pSoldier.bAction = Enum289.AI_ACTION_PENDING_ACTION;

  return true;
}

/* static */ let TextRegionClickCallback__fLButtonDown: boolean = false;
function TextRegionClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    TextRegionClickCallback__fLButtonDown = true;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP && TextRegionClickCallback__fLButtonDown) {
    InternalShutupaYoFace(gTalkPanel.iFaceIndex, false);
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    TextRegionClickCallback__fLButtonDown = false;
  }
}

function CarmenLeavesSectorCallback(): void {
  if (gWorldSectorX == 13 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0) {
    TriggerNPCRecord(78, 34);
  } else if (gWorldSectorX == 9 && gWorldSectorY == MAP_ROW_G && gbWorldSectorZ == 0) {
    TriggerNPCRecord(78, 35);
  } else if (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0) {
    TriggerNPCRecord(78, 36);
  }
}

}
