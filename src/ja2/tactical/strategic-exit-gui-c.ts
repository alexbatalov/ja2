let gfInSectorExitMenu: boolean = false;

interface EXIT_DIALOG_STRUCT {
  BackRegion: MOUSE_REGION;
  SingleRegion: MOUSE_REGION;
  LoadRegion: MOUSE_REGION;
  AllRegion: MOUSE_REGION;
  uiLoadCheckButton: UINT32;
  uiSingleMoveButton: UINT32;
  uiAllMoveButton: UINT32;
  uiOKButton: UINT32;
  uiCancelButton: UINT32;
  iBoxId: INT32;
  iButtonImages: INT32;
  usWidth: UINT16;
  usHeight: UINT16;
  sX: INT16;
  sY: INT16;
  sAdditionalData: INT16;
  ubFlags: UINT8;
  ubLeaveSectorType: UINT8;
  ubLeaveSectorCode: UINT8;
  ubDirection: UINT8;
  ubNumPeopleOnSquad: UINT8;
  bSingleMoveWillIsolateEPC: INT8; // if not -1, then that means the slot number is an EPC
  bHandled: INT8;
  fRender: boolean;
  fGotoSector: boolean;
  fGotoSectorText: boolean;
  fSingleMove: boolean;
  fAllMove: boolean;
  fSingleMoveDisabled: boolean;
  fGotoSectorDisabled: boolean;
  fAllMoveDisabled: boolean;
  fGotoSectorHilighted: boolean;
  fSingleMoveHilighted: boolean;
  fAllMoveHilighted: boolean;
  fMultipleSquadsInSector: boolean;
  fSingleMoveOn: boolean;
  fAllMoveOn: boolean;
  fSelectedMercIsEPC: boolean;
  fSquadHasMultipleEPCs: boolean;
  fUncontrolledRobotInSquad: boolean;
}

let gExitDialog: EXIT_DIALOG_STRUCT;

let gubExitGUIDirection: UINT8;
let gsExitGUIAdditionalData: INT16;
let gsWarpWorldX: INT16;
let gsWarpWorldY: INT16;
let gbWarpWorldZ: INT8;
let gsWarpGridNo: INT16;

// KM:  New method is coded for more sophistocated rules.  All the information is stored within the gExitDialog struct
//		 and calculated upon entry to this function instead of passing in multiple arguments and calculating it prior.
function InternalInitSectorExitMenu(ubDirection: UINT8, sAdditionalData: INT16): boolean {
  let uiTraverseTimeInMinutes: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;
  let aRect: SGPRect;
  let usTextBoxWidth: UINT16;
  let usTextBoxHeight: UINT16;
  let usMapPos: UINT16 = 0;
  let bExitCode: INT8 = -1;
  let OkExitCode: boolean;

  // STEP 1:  Calculate the information for the exit gui
  memset(addressof(gExitDialog), 0, sizeof(EXIT_DIALOG_STRUCT));
  gExitDialog.bSingleMoveWillIsolateEPC = -1;

  // OK, bring up dialogue... first determine some logic here...
  switch (ubDirection) {
    case Enum245.EAST:
      bExitCode = Enum186.EAST_STRATEGIC_MOVE;
      break;
    case Enum245.WEST:
      bExitCode = Enum186.WEST_STRATEGIC_MOVE;
      break;
    case Enum245.NORTH:
      bExitCode = Enum186.NORTH_STRATEGIC_MOVE;
      break;
    case Enum245.SOUTH:
      bExitCode = Enum186.SOUTH_STRATEGIC_MOVE;
      break;
    case Enum245.DIRECTION_EXITGRID:
      bExitCode = -1;
      usMapPos = sAdditionalData;
      break;
  }

  OkExitCode = OKForSectorExit(bExitCode, usMapPos, addressof(uiTraverseTimeInMinutes));

  if (uiTraverseTimeInMinutes <= 5) {
    // if the traverse time is short, then traversal is percieved to be instantaneous.
    gExitDialog.fGotoSectorText = true;
  }

  if (OkExitCode == 1) {
    gExitDialog.fAllMoveDisabled = true;
    gExitDialog.fSingleMoveOn = true;
    gExitDialog.fSingleMove = true;
    if (gfRobotWithoutControllerAttemptingTraversal) {
      gfRobotWithoutControllerAttemptingTraversal = false;
      gExitDialog.fUncontrolledRobotInSquad = true;
    }
  } else if (OkExitCode == 2) {
    gExitDialog.fAllMoveOn = true;
    gExitDialog.fAllMove = true;
  }

  if (gTacticalStatus.uiFlags & INCOMBAT) {
    let i: INT32;
    let cnt: INT32 = 0;
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      if (OK_INSECTOR_MERC(MercPtrs[i]))
        cnt++;
    }
    if (cnt != 1) {
      gExitDialog.fGotoSectorDisabled = true;
    }
  }

  // STEP 2:  Setup the exit gui

  EnterModalTactical(TACTICAL_MODAL_WITHMOUSE);
  gfIgnoreScrolling = true;

  aRect.iTop = 0;
  aRect.iLeft = 0;
  aRect.iBottom = INV_INTERFACE_START_Y;
  aRect.iRight = 640;

  if (gExitDialog.fAllMoveOn) {
    // either an all-move in non-combat, or the last concious guy in combat.
    gExitDialog.fGotoSector = true;
  }

  gExitDialog.ubNumPeopleOnSquad = NumberOfPlayerControllableMercsInSquad(MercPtrs[gusSelectedSoldier].value.bAssignment);

  // Determine
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (i == gusSelectedSoldier) {
      continue;
    }
    if (!pSoldier.value.fBetweenSectors && pSoldier.value.sSectorX == gWorldSectorX && pSoldier.value.sSectorY == gWorldSectorY && pSoldier.value.bSectorZ == gbWorldSectorZ && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bAssignment != MercPtrs[gusSelectedSoldier].value.bAssignment && pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW && pSoldier.value.bAssignment != Enum117.IN_TRANSIT && pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD) {
      // KM:  We need to determine if there are more than one squad (meaning other concious mercs in a different squad or assignment)
      //		 These conditions were done to the best of my knowledge, so if there are other situations that require modification,
      //		 then feel free to do so.
      gExitDialog.fMultipleSquadsInSector = true;
      break;
    }
  }

  // Double check that ...
  // if we are a EPC and are the selected guy, make single move off and disable it....
  if (AM_AN_EPC(MercPtrs[gusSelectedSoldier])) {
    // Check if there are more than one in this squad
    if (gExitDialog.ubNumPeopleOnSquad > 1) {
      gExitDialog.fSingleMoveOn = false;
      gExitDialog.fAllMoveOn = true;
      gExitDialog.fSelectedMercIsEPC = true;
    }
    gExitDialog.fSingleMoveDisabled = true;
  } else {
    // check to see if we have one selected merc and one or more EPCs.
    // If so, don't allow the selected merc to leave by himself.
    // Assuming that the matching squad assignment is in the same sector.
    let ubNumMercs: UINT8 = 1; // selected soldier is a merc
    let ubNumEPCs: UINT8 = 0;
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      if (i == gusSelectedSoldier) {
        continue;
      }
      if (MercPtrs[i].value.bAssignment == MercPtrs[gusSelectedSoldier].value.bAssignment) {
        if (AM_AN_EPC(MercPtrs[i])) {
          ubNumEPCs++;
          // record the slot of the epc.  If there are more than one EPCs, then
          // it doesn't matter.  This is used in building the text message explaining
          // why the selected merc can't leave.  This is how we extract the EPC's name.
          gExitDialog.bSingleMoveWillIsolateEPC = i;
        } else {
          // We have more than one merc, so we will allow the selected merc to leave alone if
          // the user so desired.
          ubNumMercs++;
          break;
        }
      }
    }

    if (ubNumMercs == 1 && ubNumEPCs >= 1) {
      gExitDialog.fSingleMoveOn = false;
      gExitDialog.fAllMoveOn = true;
      gExitDialog.fSingleMoveDisabled = true;
      if (ubNumEPCs > 1) {
        gExitDialog.fSquadHasMultipleEPCs = true;
        ;
      }
    }
  }

  if (gTacticalStatus.fEnemyInSector) {
    if (gExitDialog.fMultipleSquadsInSector) {
      // We have multiple squads in a hostile sector.  That means that we can't load the adjacent sector.
      gExitDialog.fGotoSectorDisabled = true;
      gExitDialog.fGotoSector = false;
    } else if (GetNumberOfMilitiaInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
      // Leaving this sector will result in militia being forced to fight the battle, can't load adjacent sector.
      gExitDialog.fGotoSectorDisabled = true;
      gExitDialog.fGotoSector = false;
    }
    if (!gExitDialog.fMultipleSquadsInSector && !gExitDialog.fAllMoveOn) {
      gExitDialog.fGotoSectorDisabled = true;
      gExitDialog.fGotoSector = false;
    }
  }

  if (!gExitDialog.fMultipleSquadsInSector && gExitDialog.fAllMoveOn) {
    gExitDialog.fGotoSectorDisabled = true;
  }

  gExitDialog.ubDirection = ubDirection;
  gExitDialog.sAdditionalData = sAdditionalData;

  gExitDialog.iBoxId = PrepareMercPopupBox(-1, Enum324.DIALOG_MERC_POPUP_BACKGROUND, Enum325.DIALOG_MERC_POPUP_BORDER, TacticalStr[Enum335.EXIT_GUI_TITLE_STR], 100, 85, 2, 75, addressof(usTextBoxWidth), addressof(usTextBoxHeight));

  gExitDialog.sX = ((((aRect.iRight - aRect.iLeft) - usTextBoxWidth) / 2) + aRect.iLeft);
  gExitDialog.sY = ((((aRect.iBottom - aRect.iTop) - usTextBoxHeight) / 2) + aRect.iTop);
  gExitDialog.usWidth = usTextBoxWidth;
  gExitDialog.usHeight = usTextBoxHeight;

  guiPendingOverrideEvent = Enum207.EX_EXITSECTORMENU;
  HandleTacticalUI();

  gfInSectorExitMenu = true;

  MSYS_DefineRegion(addressof(gExitDialog.BackRegion), 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 1, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, SectorExitBackgroundCallback);

  gExitDialog.iButtonImages = LoadButtonImage("INTERFACE\\popupbuttons.sti", -1, 0, -1, 1, -1);

  MSYS_DefineRegion(addressof(gExitDialog.SingleRegion), (gExitDialog.sX + 20), (gExitDialog.sY + 37), (gExitDialog.sX + 45 + 120), (gExitDialog.sY + 37 + 12), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, SingleRegionMoveCallback, SingleRegionCallback);
  MSYS_AllowDisabledRegionFastHelp(addressof(gExitDialog.SingleRegion), true);

  MSYS_DefineRegion(addressof(gExitDialog.AllRegion), (gExitDialog.sX + 20), (gExitDialog.sY + 57), (gExitDialog.sX + 45 + 120), (gExitDialog.sY + 57 + 12), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, AllRegionMoveCallback, AllRegionCallback);
  MSYS_AllowDisabledRegionFastHelp(addressof(gExitDialog.AllRegion), true);

  MSYS_DefineRegion(addressof(gExitDialog.LoadRegion), (gExitDialog.sX + 155), (gExitDialog.sY + 45), (gExitDialog.sX + 180 + 85), (gExitDialog.sY + 45 + 15), MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, LoadRegionMoveCallback, LoadRegionCallback);
  MSYS_AllowDisabledRegionFastHelp(addressof(gExitDialog.LoadRegion), true);

  gExitDialog.uiLoadCheckButton = CreateCheckBoxButton((gExitDialog.sX + 155), (gExitDialog.sY + 43), "INTERFACE\\popupcheck.sti", MSYS_PRIORITY_HIGHEST, CheckLoadMapCallback);

  gExitDialog.uiSingleMoveButton = CreateCheckBoxButton((gExitDialog.sX + 20), (gExitDialog.sY + 35), "INTERFACE\\popupradiobuttons.sti", MSYS_PRIORITY_HIGHEST, SingleMoveCallback);

  gExitDialog.uiAllMoveButton = CreateCheckBoxButton((gExitDialog.sX + 20), (gExitDialog.sY + 55), "INTERFACE\\popupradiobuttons.sti", MSYS_PRIORITY_HIGHEST, AllMoveCallback);

  gExitDialog.uiOKButton = CreateIconAndTextButton(gExitDialog.iButtonImages, TacticalStr[Enum335.OK_BUTTON_TEXT_STR], FONT12ARIAL(), FONT_MCOLOR_WHITE, DEFAULT_SHADOW, FONT_MCOLOR_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gExitDialog.sX + 65), (gExitDialog.sY + 78), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), OKCallback);

  gExitDialog.uiCancelButton = CreateIconAndTextButton(gExitDialog.iButtonImages, TacticalStr[Enum335.CANCEL_BUTTON_TEXT_STR], FONT12ARIAL(), FONT_MCOLOR_WHITE, DEFAULT_SHADOW, FONT_MCOLOR_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, (gExitDialog.sX + 135), (gExitDialog.sY + 78), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), CancelCallback);

  gfIgnoreScrolling = true;

  InterruptTime();
  PauseGame();
  LockPauseState(21);

  return true;
}

function DoneFadeInWarp(): void {
}

function DoneFadeOutWarpCallback(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Warp!

  // Set insertion data...
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // Are we in this sector, On the current squad?
    if (pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bInSector) {
      gfTacticalTraversal = true;
      SetGroupSectorValue(gsWarpWorldX, gsWarpWorldY, gbWarpWorldZ, pSoldier.value.ubGroupID);

      // Set next sectore
      pSoldier.value.sSectorX = gsWarpWorldX;
      pSoldier.value.sSectorY = gsWarpWorldY;
      pSoldier.value.bSectorZ = gbWarpWorldZ;

      // Set gridno
      pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      pSoldier.value.usStrategicInsertionData = gsWarpGridNo;
      // Set direction to face....
      pSoldier.value.ubInsertionDirection = 100 + Enum245.NORTHWEST;
    }
  }

  // OK, insertion data found, enter sector!
  SetCurrentWorldSector(gsWarpWorldX, gsWarpWorldY, gbWarpWorldZ);

  // OK, once down here, adjust the above map with crate info....
  gfTacticalTraversal = false;
  gpTacticalTraversalGroup = null;
  gpTacticalTraversalChosenSoldier = null;

  gFadeInDoneCallback = DoneFadeInWarp;

  FadeInGameScreen();
}

function WarpToSurfaceCallback(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    gFadeOutDoneCallback = DoneFadeOutWarpCallback;

    FadeOutGameScreen();
  } else {
    InternalInitSectorExitMenu(gubExitGUIDirection, gsExitGUIAdditionalData);
  }
}

function InitSectorExitMenu(ubDirection: UINT8, sAdditionalData: INT16): boolean {
  gubExitGUIDirection = ubDirection;
  gsExitGUIAdditionalData = sAdditionalData;

  if (gbWorldSectorZ >= 2 && gubQuest[Enum169.QUEST_CREATURES] == QUESTDONE) {
    if (GetWarpOutOfMineCodes(addressof(gsWarpWorldX), addressof(gsWarpWorldY), addressof(gbWarpWorldZ), addressof(gsWarpGridNo))) {
      // ATE: Check if we are in a creature lair and bring up box if so....
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzLateLocalizedString[33], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, WarpToSurfaceCallback, null);

      return true;
    }
  }

  return InternalInitSectorExitMenu(ubDirection, sAdditionalData);
}

function UpdateSectorExitMenu(): void {
  if (gExitDialog.fGotoSector) {
    ButtonList[gExitDialog.uiLoadCheckButton].value.uiFlags |= BUTTON_CLICKED_ON;
  } else {
    ButtonList[gExitDialog.uiLoadCheckButton].value.uiFlags &= (~BUTTON_CLICKED_ON);
  }

  if (gExitDialog.fSingleMove) {
    ButtonList[gExitDialog.uiSingleMoveButton].value.uiFlags |= BUTTON_CLICKED_ON;
  } else {
    ButtonList[gExitDialog.uiSingleMoveButton].value.uiFlags &= (~BUTTON_CLICKED_ON);
  }

  if (gExitDialog.fAllMove) {
    ButtonList[gExitDialog.uiAllMoveButton].value.uiFlags |= BUTTON_CLICKED_ON;
  } else {
    ButtonList[gExitDialog.uiAllMoveButton].value.uiFlags &= (~BUTTON_CLICKED_ON);
  }

  if (gExitDialog.fGotoSectorDisabled) {
    DisableButton(gExitDialog.uiLoadCheckButton);
    MSYS_DisableRegion(addressof(gExitDialog.LoadRegion));
    if (gExitDialog.fMultipleSquadsInSector && gExitDialog.fGotoSectorText && gTacticalStatus.fEnemyInSector) {
      // We have multiple squads in a hostile sector.  That means that we can't load the adjacent sector.
      SetButtonFastHelpText(gExitDialog.uiLoadCheckButton, pExitingSectorHelpText[Enum336.EXIT_GUI_CANT_LEAVE_HOSTILE_SECTOR_HELPTEXT]);
      SetRegionFastHelpText(addressof(gExitDialog.LoadRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_CANT_LEAVE_HOSTILE_SECTOR_HELPTEXT]);
    } else if (gExitDialog.fGotoSectorText) {
      // travesal is quick enough to allow the player to "warp" to the next sector and we MUST load it.
      SetButtonFastHelpText(gExitDialog.uiLoadCheckButton, pExitingSectorHelpText[Enum336.EXIT_GUI_MUST_LOAD_ADJACENT_SECTOR_HELPTEXT]);
      SetRegionFastHelpText(addressof(gExitDialog.LoadRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_MUST_LOAD_ADJACENT_SECTOR_HELPTEXT]);
    } else {
      // traversal takes too long to warrant instant travel (we MUST go to mapscreen)
      SetButtonFastHelpText(gExitDialog.uiLoadCheckButton, pExitingSectorHelpText[Enum336.EXIT_GUI_MUST_GOTO_MAPSCREEN_HELPTEXT]);
      SetRegionFastHelpText(addressof(gExitDialog.LoadRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_MUST_GOTO_MAPSCREEN_HELPTEXT]);
    }
  } else {
    EnableButton(gExitDialog.uiLoadCheckButton);
    MSYS_EnableRegion(addressof(gExitDialog.LoadRegion));
    if (gExitDialog.fGotoSectorText) {
      // travesal is quick enough to allow the player to "warp" to the next sector and we load it.
      SetButtonFastHelpText(gExitDialog.uiLoadCheckButton, pExitingSectorHelpText[Enum336.EXIT_GUI_LOAD_ADJACENT_SECTOR_HELPTEXT]);
      SetRegionFastHelpText(addressof(gExitDialog.LoadRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_LOAD_ADJACENT_SECTOR_HELPTEXT]);
    } else {
      // traversal takes too long to warrant instant travel (we go to mapscreen)
      SetButtonFastHelpText(gExitDialog.uiLoadCheckButton, pExitingSectorHelpText[Enum336.EXIT_GUI_GOTO_MAPSCREEN_HELPTEXT]);
      SetRegionFastHelpText(addressof(gExitDialog.LoadRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_GOTO_MAPSCREEN_HELPTEXT]);
    }
  }

  if (gExitDialog.fSingleMoveDisabled) {
    DisableButton(gExitDialog.uiSingleMoveButton);
    MSYS_DisableRegion(addressof(gExitDialog.SingleRegion));
    if (gExitDialog.fSelectedMercIsEPC) {
      // EPCs cannot leave the sector alone and must be escorted
      let str: UINT16[] /* [256] */;
      swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_ESCORTED_CHARACTERS_MUST_BE_ESCORTED_HELPTEXT], MercPtrs[gusSelectedSoldier].value.name);
      SetButtonFastHelpText(gExitDialog.uiSingleMoveButton, str);
      SetRegionFastHelpText(addressof(gExitDialog.SingleRegion), str);
    } else if (gExitDialog.bSingleMoveWillIsolateEPC != -1) {
      // It has been previously determined that there are only two mercs in the squad, the selected merc
      // isn't an EPC, but the other merc is.  That means that this merc cannot leave the sector alone
      // as he would isolate the EPC.
      let str: UINT16[] /* [256] */;
      if (!gExitDialog.fSquadHasMultipleEPCs) {
        if (gMercProfiles[MercPtrs[gusSelectedSoldier].value.ubProfile].bSex == Enum272.MALE) {
          // male singular
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_SINGULAR], MercPtrs[gusSelectedSoldier].value.name, MercPtrs[gExitDialog.bSingleMoveWillIsolateEPC].value.name);
        } else {
          // female singular
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_SINGULAR], MercPtrs[gusSelectedSoldier].value.name, MercPtrs[gExitDialog.bSingleMoveWillIsolateEPC].value.name);
        }
      } else {
        if (gMercProfiles[MercPtrs[gusSelectedSoldier].value.ubProfile].bSex == Enum272.MALE) {
          // male plural
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_PLURAL], MercPtrs[gusSelectedSoldier].value.name);
        } else {
          // female plural
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_PLURAL], MercPtrs[gusSelectedSoldier].value.name);
        }
      }
      SetButtonFastHelpText(gExitDialog.uiSingleMoveButton, str);
      SetRegionFastHelpText(addressof(gExitDialog.SingleRegion), str);
    }
  } else {
    let str: UINT16[] /* [256] */;
    EnableButton(gExitDialog.uiSingleMoveButton);
    MSYS_EnableRegion(addressof(gExitDialog.SingleRegion));
    swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_SINGLE_TRAVERSAL_WILL_SEPARATE_SQUADS_HELPTEXT], MercPtrs[gusSelectedSoldier].value.name);
    SetButtonFastHelpText(gExitDialog.uiSingleMoveButton, str);
    SetRegionFastHelpText(addressof(gExitDialog.SingleRegion), str);
  }

  if (gExitDialog.fAllMoveDisabled) {
    DisableButton(gExitDialog.uiAllMoveButton);
    MSYS_DisableRegion(addressof(gExitDialog.AllRegion));
    if (gExitDialog.fUncontrolledRobotInSquad) {
      SetButtonFastHelpText(gExitDialog.uiAllMoveButton, gzLateLocalizedString[1]);
      SetRegionFastHelpText(addressof(gExitDialog.AllRegion), gzLateLocalizedString[1]);
    } else {
      SetButtonFastHelpText(gExitDialog.uiAllMoveButton, pExitingSectorHelpText[Enum336.EXIT_GUI_ALL_MERCS_MUST_BE_TOGETHER_TO_ALLOW_HELPTEXT]);
      SetRegionFastHelpText(addressof(gExitDialog.AllRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_ALL_MERCS_MUST_BE_TOGETHER_TO_ALLOW_HELPTEXT]);
    }
  } else {
    EnableButton(gExitDialog.uiAllMoveButton);
    MSYS_EnableRegion(addressof(gExitDialog.AllRegion));
    SetButtonFastHelpText(gExitDialog.uiAllMoveButton, pExitingSectorHelpText[Enum336.EXIT_GUI_ALL_TRAVERSAL_WILL_MOVE_CURRENT_SQUAD_HELPTEXT]);
    SetRegionFastHelpText(addressof(gExitDialog.AllRegion), pExitingSectorHelpText[Enum336.EXIT_GUI_ALL_TRAVERSAL_WILL_MOVE_CURRENT_SQUAD_HELPTEXT]);
  }
}

function RenderSectorExitMenu(): void {
  let Event: InputAtom;

  RestoreBackgroundRects();
  // ATE: Reset mouse Y
  gsGlobalCursorYOffset = 0;
  SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);

  while (DequeueEvent(addressof(Event))) {
    if (Event.usEvent == KEY_DOWN) {
      switch (Event.usParam) {
        case ESC:
          RemoveSectorExitMenu(false);
          return;
        case ENTER:
          RemoveSectorExitMenu(true);
          return;
      }
    }
  }

  UpdateSectorExitMenu();

  RenderMercPopUpBoxFromIndex(gExitDialog.iBoxId, gExitDialog.sX, gExitDialog.sY, FRAME_BUFFER);
  InvalidateRegion(gExitDialog.sX, gExitDialog.sY, gExitDialog.usWidth, gExitDialog.usHeight);

  SetFont(FONT12ARIAL());
  SetFontBackground(FONT_MCOLOR_BLACK);

  if (gExitDialog.fSingleMoveDisabled) {
    SetFontForeground(FONT_MCOLOR_DKGRAY);
  } else if (gExitDialog.fSingleMoveHilighted) {
    SetFontForeground(FONT_MCOLOR_LTYELLOW);
  } else {
    SetFontForeground(FONT_MCOLOR_WHITE);
  }
  mprintf(gExitDialog.sX + 45, gExitDialog.sY + 37, TacticalStr[Enum335.EXIT_GUI_SELECTED_MERC_STR]);

  if (gExitDialog.fAllMoveDisabled) {
    SetFontForeground(FONT_MCOLOR_DKGRAY);
  } else if (gExitDialog.fAllMoveHilighted) {
    SetFontForeground(FONT_MCOLOR_LTYELLOW);
  } else {
    SetFontForeground(FONT_MCOLOR_WHITE);
  }
  mprintf(gExitDialog.sX + 45, gExitDialog.sY + 57, TacticalStr[Enum335.EXIT_GUI_ALL_MERCS_IN_SQUAD_STR]);

  if (gExitDialog.fGotoSectorDisabled) {
    SetFontForeground(FONT_MCOLOR_DKGRAY);
  } else if (gExitDialog.fGotoSectorHilighted) {
    SetFontForeground(FONT_MCOLOR_LTYELLOW);
  } else {
    SetFontForeground(FONT_MCOLOR_WHITE);
  }

  if (gExitDialog.fGotoSectorText) {
    // only if tactical traversal is from one town sector to another town sector (5 minute convenience warp)
    mprintf(gExitDialog.sX + 180, gExitDialog.sY + 45, TacticalStr[Enum335.EXIT_GUI_GOTO_SECTOR_STR]);
  } else {
    // most sectors don't allow tactical traversal.  Exiting results in entering the mapscreen.
    mprintf(gExitDialog.sX + 180, gExitDialog.sY + 45, TacticalStr[Enum335.EXIT_GUI_GOTO_MAP_STR]);
  }

  SaveBackgroundRects();
  RenderFastHelp();

  MarkAButtonDirty(gExitDialog.uiLoadCheckButton);
  MarkAButtonDirty(gExitDialog.uiSingleMoveButton);
  MarkAButtonDirty(gExitDialog.uiAllMoveButton);
  MarkAButtonDirty(gExitDialog.uiOKButton);
  MarkAButtonDirty(gExitDialog.uiCancelButton);
}

function HandleSectorExitMenu(): boolean {
  return (false); // Why???
}

function RemoveSectorExitMenu(fOk: boolean): void {
  let Str: INT16[] /* [50] */;

  if (gfInSectorExitMenu) {
    guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;

    RemoveButton(gExitDialog.uiLoadCheckButton);
    RemoveButton(gExitDialog.uiSingleMoveButton);
    RemoveButton(gExitDialog.uiAllMoveButton);
    RemoveButton(gExitDialog.uiOKButton);
    RemoveButton(gExitDialog.uiCancelButton);

    UnloadButtonImage(gExitDialog.iButtonImages);

    MSYS_RemoveRegion(addressof(gExitDialog.BackRegion));
    MSYS_RemoveRegion(addressof(gExitDialog.SingleRegion));
    MSYS_RemoveRegion(addressof(gExitDialog.AllRegion));
    MSYS_RemoveRegion(addressof(gExitDialog.LoadRegion));

    // Remove the popup box
    RemoveMercPopupBoxFromIndex(gExitDialog.iBoxId);
    gExitDialog.iBoxId = -1;

    gfIgnoreScrolling = false;

    SetRenderFlags(RENDER_FLAG_FULL);

    gfInSectorExitMenu = false;

    UnLockPauseState();
    UnPauseGame();
    EndModalTactical();
    gfIgnoreScrolling = false;

    // if we are an EPC, don't allow this if nobody else on squad
    if (fOk && AM_AN_EPC(MercPtrs[gusSelectedSoldier])) {
      // Check if there are more than one in this squad
      if (gExitDialog.ubNumPeopleOnSquad == 0) {
        swprintf(Str, pMessageStrings[Enum333.MSG_EPC_CANT_TRAVERSE], MercPtrs[gusSelectedSoldier].value.name);

        DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, Str, Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
        return;
      }
    }

    if (fOk) {
      // Handle the effects here!
      if (gExitDialog.fAllMove && gExitDialog.fGotoSector && gExitDialog.fGotoSectorText) {
        JumpIntoAdjacentSector(gExitDialog.ubDirection, Enum177.JUMP_ALL_LOAD_NEW, gExitDialog.sAdditionalData);
        return;
      }

      // KM : August 6, 1999 Patch fix
      //     Added the !gExitDialog.fGotoSectorText to the conditions to prevent the player from LOADING an
      //     adjacent sector (this only happens when instant traversal is overriden because of a battle in progress
      //     in the previous sector
      if (gExitDialog.fAllMove && (!gExitDialog.fGotoSector || !gExitDialog.fGotoSectorText)) {
        // Here, move all men out of sector but don't load new one...
        JumpIntoAdjacentSector(gExitDialog.ubDirection, Enum177.JUMP_ALL_NO_LOAD, gExitDialog.sAdditionalData);
      }

      if (gExitDialog.fSingleMove && gExitDialog.fGotoSector && gExitDialog.fGotoSectorText) {
        JumpIntoAdjacentSector(gExitDialog.ubDirection, Enum177.JUMP_SINGLE_LOAD_NEW, gExitDialog.sAdditionalData);
        return;
      }

      // KM : August 6, 1999 Patch fix
      //     Added the !gExitDialog.fGotoSectorText to the conditions to prevent the player from LOADING an
      //     adjacent sector (this only happens when instant traversal is overriden because of a battle in progress
      //     in the previous sector
      if (gExitDialog.fSingleMove && (!gExitDialog.fGotoSector || !gExitDialog.fGotoSectorText)) {
        // Here, move all men out of sector but don't load new one...
        JumpIntoAdjacentSector(gExitDialog.ubDirection, Enum177.JUMP_SINGLE_NO_LOAD, gExitDialog.sAdditionalData);
      }
    }
  }
}

function CheckLoadMapCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gExitDialog.fGotoSector = !gExitDialog.fGotoSector;
  }
}

function SingleMoveAction(): void {
  // KM: New logic Mar2 '99
  if (!gExitDialog.fMultipleSquadsInSector) {
    if (gTacticalStatus.fEnemyInSector) {
      // if enemy in sector, and mercs will be left behind, prevent user from selecting load
      gExitDialog.fGotoSectorDisabled = true;
      gExitDialog.fGotoSector = false;
    } else {
      // freedom to load or not load
      gExitDialog.fGotoSectorDisabled = false;
    }
  } else {
    gExitDialog.fGotoSector = false;
  }
  gExitDialog.fSingleMove = true;
  gExitDialog.fAllMove = false;
  // end

  // previous logic
  /*
  gExitDialog.fGotoSector = FALSE;
  gExitDialog.fSingleMove = TRUE;
  gExitDialog.fAllMove		= FALSE;
  */
}

function AllMoveAction(): void {
  // KM: New logic Mar2 '99
  if (!gExitDialog.fMultipleSquadsInSector) {
    gExitDialog.fGotoSectorDisabled = true;
    gExitDialog.fGotoSector = true;
  }
  gExitDialog.fSingleMove = false;
  gExitDialog.fAllMove = true;
  // end

  // previous logic
  /*
  gExitDialog.fSingleMove = FALSE;
  gExitDialog.fAllMove		= TRUE;
  */
}

function SingleMoveCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SingleMoveAction();
  }
}

function AllMoveCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    AllMoveAction();
  }
}

function OKCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    RemoveSectorExitMenu(true);
  }
}

function CancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // OK, exit
    RemoveSectorExitMenu(false);
  }
}

function SectorExitBackgroundCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // gMsgBox.bHandled = MSG_BOX_RETURN_NO;
  }
}

function SingleRegionCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SingleMoveAction();
  }
}

function AllRegionCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    AllMoveAction();
  }
}

function LoadRegionCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gExitDialog.fGotoSector = !gExitDialog.fGotoSector;
  }
}

function SingleRegionMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    gExitDialog.fSingleMoveHilighted = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gExitDialog.fSingleMoveHilighted = false;
  }
}

function AllRegionMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    gExitDialog.fAllMoveHilighted = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gExitDialog.fAllMoveHilighted = false;
  }
}

function LoadRegionMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    gExitDialog.fGotoSectorHilighted = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gExitDialog.fGotoSectorHilighted = false;
  }
}
