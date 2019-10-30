namespace ja2 {

export let gfTacticalTraversal: boolean = false;
export let gpTacticalTraversalGroup: Pointer<GROUP> = null;
export let gpTacticalTraversalChosenSoldier: Pointer<SOLDIERTYPE> = null;

export let gfAutomaticallyStartAutoResolve: boolean = false;
export let gfAutoAmbush: boolean = false;
export let gfHighPotentialForAmbush: boolean = false;
export let gfGotoSectorTransition: boolean = false;
let gfEnterAutoResolveMode: boolean = false;
export let gfEnteringMapScreenToEnterPreBattleInterface: boolean = false;
let gfIgnoreAllInput: boolean = true;

// GraphicIDs for the panel
const enum Enum162 {
  MAINPANEL,
  TITLE_BAR_PIECE,
  TOP_COLUMN,
  BOTTOM_COLUMN,
  UNINVOLVED_HEADER,
}

// The start of the black space
const TOP_Y = 113;
// The end of the black space
const BOTTOM_Y = 349;
// The internal height of the uninvolved panel
const INTERNAL_HEIGHT = 27;
// The actual height of the uninvolved panel
const ACTUAL_HEIGHT = 34;
// The height of each row
const ROW_HEIGHT = 10;

export let gfDisplayPotentialRetreatPaths: boolean = false;
let gusRetreatButtonLeft: UINT16;
let gusRetreatButtonTop: UINT16;
let gusRetreatButtonRight: UINT16;
let gusRetreatButtonBottom: UINT16;

export let gpBattleGroup: Pointer<GROUP> = null;

/*
void InvolvedMoveCallback( MOUSE_REGION *reg, INT32 reason );
void InvolvedClickCallback( MOUSE_REGION *reg, INT32 reason );
void UninvolvedMoveCallback( MOUSE_REGION *reg, INT32 reason );
void UninvolvedClickCallback( MOUSE_REGION *reg, INT32 reason );

SOLDIERTYPE* InvolvedSoldier( INT32 index );
SOLDIERTYPE* UninvolvedSoldier( INT32 index );
*/

let PBInterfaceBlanket: MOUSE_REGION;
export let gfPreBattleInterfaceActive: boolean = false;
let iPBButton: UINT32[] /* [3] */;
let iPBButtonImage: UINT32[] /* [3] */;
let uiInterfaceImages: UINT32;
export let gfRenderPBInterface: boolean;
let gfPBButtonsHidden: boolean;
export let fDisableMapInterfaceDueToBattle: boolean = false;

let gfBlinkHeader: boolean;

let guiNumInvolved: UINT32;
let guiNumUninvolved: UINT32;

// SAVE START

// Using the ESC key in the PBI will get rid of the PBI and go back to mapscreen, but
// only if the PBI isn't persistant (!gfPersistantPBI).
export let gfPersistantPBI: boolean = false;

// Contains general information about the type of encounter the player is faced with.  This
// determines whether or not you can autoresolve the battle or even retreat.  This code
// dictates the header that is used at the top of the PBI.
export let gubEnemyEncounterCode: UINT8 = Enum164.NO_ENCOUNTER_CODE;

// The autoresolve during tactical battle option needs more detailed information than the
// gubEnemyEncounterCode can provide.  The explicit version contains possibly unique codes
// for reasons not normally used in the PBI.  For example, if we were fighting the enemy
// in a normal situation, then shot at a civilian, the civilians associated with the victim
// would turn hostile, which would disable the ability to autoresolve the battle.
export let gubExplicitEnemyEncounterCode: boolean = Enum164.NO_ENCOUNTER_CODE;

// Location of the current battle (determines where the animated icon is blitted) and if the
// icon is to be blitted.
export let gfBlitBattleSectorLocator: boolean = false;

export let gubPBSectorX: UINT8 = 0;
export let gubPBSectorY: UINT8 = 0;
export let gubPBSectorZ: UINT8 = 0;

export let gfCantRetreatInPBI: boolean = false;
// SAVE END

export let gfUsePersistantPBI: boolean;

let giHilitedInvolved: INT32;
let giHilitedUninvolved: INT32;

export function InitPreBattleInterface(pBattleGroup: Pointer<GROUP>, fPersistantPBI: boolean): void {
  let VObjectDesc: VOBJECT_DESC;
  let i: INT32;
  let ubGroupID: UINT8 = 0;
  let ubNumStationaryEnemies: UINT8 = 0;
  let ubNumMobileEnemies: UINT8 = 0;
  let ubNumMercs: UINT8;
  let fUsePluralVersion: boolean = false;
  let bBestExpLevel: INT8 = 0;
  let fRetreatAnOption: boolean = true;
  let pSector: Pointer<SECTORINFO>;

  // ARM: Feb01/98 - Cancel out of mapscreen movement plotting if PBI subscreen is coming up
  if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
    AbortMovementPlottingMode();
  }

  if (gfPreBattleInterfaceActive)
    return;

  gfPersistantPBI = fPersistantPBI;

  if (gfPersistantPBI) {
    gfBlitBattleSectorLocator = true;
    gfBlinkHeader = false;

    //	InitializeTacticalStatusAtBattleStart();
    // CJC, Oct 5 98: this is all we should need from InitializeTacticalStatusAtBattleStart()
    if (gubEnemyEncounterCode != Enum164.BLOODCAT_AMBUSH_CODE && gubEnemyEncounterCode != Enum164.ENTERING_BLOODCAT_LAIR_CODE) {
      if (CheckFact(Enum170.FACT_FIRST_BATTLE_FOUGHT, 0) == false) {
        SetFactTrue(Enum170.FACT_FIRST_BATTLE_BEING_FOUGHT);
      }
    }

    // ATE: Added check for fPersistantPBI = TRUE if pBattleGroup == NULL
    // Searched code and saw that this condition only happens for creatures
    // fixing a bug
    // if( guiCurrentScreen == GAME_SCREEN && pBattleGroup )
    if (guiCurrentScreen == Enum26.GAME_SCREEN && (pBattleGroup || fPersistantPBI)) {
      gpBattleGroup = pBattleGroup;
      gfEnteringMapScreen = true;
      gfEnteringMapScreenToEnterPreBattleInterface = true;
      gfUsePersistantPBI = true;
      return;
    }

    if (gfTacticalTraversal && (pBattleGroup == gpTacticalTraversalGroup || gbWorldSectorZ > 0)) {
      return;
    }

    // reset the help text for mouse regions
    SetRegionFastHelpText(addressof(gCharInfoHandRegion), "");
    SetRegionFastHelpText(addressof(gMapStatusBarsRegion), "");

    gfDisplayPotentialRetreatPaths = false;

    gpBattleGroup = pBattleGroup;

    // calc sector values
    if (gpBattleGroup) {
      gubPBSectorX = gpBattleGroup.value.ubSectorX;
      gubPBSectorY = gpBattleGroup.value.ubSectorY;
      gubPBSectorZ = gpBattleGroup.value.ubSectorZ;

      // get number of enemies thought to be here
      SectorInfo[SECTOR(gubPBSectorX, gubPBSectorY)].bLastKnownEnemies = NumEnemiesInSector(gubPBSectorX, gubPBSectorY);
      fMapPanelDirty = true;
    } else {
      gubPBSectorX = SECTORX(gubSectorIDOfCreatureAttack);
      gubPBSectorY = SECTORY(gubSectorIDOfCreatureAttack);
      gubPBSectorZ = 0;
    }
  } else {
    // calculate the non-persistant situation
    gfBlinkHeader = true;

    if (HostileCiviliansPresent()) {
      // There are hostile civilians, so no autoresolve allowed.
      gubExplicitEnemyEncounterCode = Enum164.HOSTILE_CIVILIANS_CODE;
    } else if (HostileBloodcatsPresent()) {
      // There are bloodcats in the sector, so no autoresolve allowed
      gubExplicitEnemyEncounterCode = Enum164.HOSTILE_BLOODCATS_CODE;
    } else if (gbWorldSectorZ) {
      // We are underground, so no autoresolve allowed
      pSector = addressof(SectorInfo[SECTOR(gubPBSectorX, gubPBSectorY)]);
      if (pSector.value.ubCreaturesInBattle) {
        gubExplicitEnemyEncounterCode = Enum164.FIGHTING_CREATURES_CODE;
      } else if (pSector.value.ubAdminsInBattle || pSector.value.ubTroopsInBattle || pSector.value.ubElitesInBattle) {
        gubExplicitEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;
      }
    } else if (gubEnemyEncounterCode == Enum164.ENTERING_ENEMY_SECTOR_CODE || gubEnemyEncounterCode == Enum164.ENEMY_ENCOUNTER_CODE || gubEnemyEncounterCode == Enum164.ENEMY_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.ENEMY_INVASION_CODE || gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE || gubEnemyEncounterCode == Enum164.CREATURE_ATTACK_CODE) {
      // use same code
      gubExplicitEnemyEncounterCode = gubEnemyEncounterCode;
    } else {
      gfBlitBattleSectorLocator = false;
      return;
    }
  }

  fMapScreenBottomDirty = true;
  ChangeSelectedMapSector(gubPBSectorX, gubPBSectorY, gubPBSectorZ);
  RenderMapScreenInterfaceBottom();

  // If we are currently in tactical, then set the flag to automatically bring up the mapscreen.
  if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    gfEnteringMapScreen = true;
  }

  if (!fShowTeamFlag) {
    ToggleShowTeamsMode();
  }

  // Define the blanket region to cover all of the other regions used underneath the panel.
  MSYS_DefineRegion(addressof(PBInterfaceBlanket), 0, 0, 261, 359, MSYS_PRIORITY_HIGHEST - 5, 0, 0, 0);

  // Create the panel
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_PREBATTLEPANEL);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(uiInterfaceImages)))
    AssertMsg(0, "Failed to load interface\\PreBattlePanel.sti");

  // Create the 3 buttons
  iPBButtonImage[0] = LoadButtonImage("INTERFACE\\PreBattleButton.sti", -1, 0, -1, 1, -1);
  if (iPBButtonImage[0] == -1)
    AssertMsg(0, "Failed to load interface\\PreBattleButton.sti");
  iPBButtonImage[1] = UseLoadedButtonImage(iPBButtonImage[0], -1, 0, -1, 1, -1);
  iPBButtonImage[2] = UseLoadedButtonImage(iPBButtonImage[0], -1, 0, -1, 1, -1);
  iPBButton[0] = QuickCreateButton(iPBButtonImage[0], 27, 54, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, DEFAULT_MOVE_CALLBACK(), AutoResolveBattleCallback);
  iPBButton[1] = QuickCreateButton(iPBButtonImage[1], 98, 54, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, DEFAULT_MOVE_CALLBACK(), GoToSectorCallback);
  iPBButton[2] = QuickCreateButton(iPBButtonImage[2], 169, 54, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, DEFAULT_MOVE_CALLBACK(), RetreatMercsCallback);

  SpecifyGeneralButtonTextAttributes(iPBButton[0], gpStrategicString[Enum365.STR_PB_AUTORESOLVE_BTN], BLOCKFONT(), FONT_BEIGE, 141);
  SpecifyGeneralButtonTextAttributes(iPBButton[1], gpStrategicString[Enum365.STR_PB_GOTOSECTOR_BTN], BLOCKFONT(), FONT_BEIGE, 141);
  SpecifyGeneralButtonTextAttributes(iPBButton[2], gpStrategicString[Enum365.STR_PB_RETREATMERCS_BTN], BLOCKFONT(), FONT_BEIGE, 141);
  SpecifyButtonHilitedTextColors(iPBButton[0], FONT_WHITE, FONT_NEARBLACK);
  SpecifyButtonHilitedTextColors(iPBButton[1], FONT_WHITE, FONT_NEARBLACK);
  SpecifyButtonHilitedTextColors(iPBButton[2], FONT_WHITE, FONT_NEARBLACK);
  SpecifyButtonTextOffsets(iPBButton[0], 8, 7, true);
  SpecifyButtonTextOffsets(iPBButton[1], 8, 7, true);
  SpecifyButtonTextOffsets(iPBButton[2], 8, 7, true);
  SpecifyButtonTextWrappedWidth(iPBButton[0], 51);
  SpecifyButtonTextWrappedWidth(iPBButton[1], 51);
  SpecifyButtonTextWrappedWidth(iPBButton[2], 51);
  SpecifyButtonTextJustification(iPBButton[0], BUTTON_TEXT_CENTER);
  SpecifyButtonTextJustification(iPBButton[1], BUTTON_TEXT_CENTER);
  SpecifyButtonTextJustification(iPBButton[2], BUTTON_TEXT_CENTER);
  AllowDisabledButtonFastHelp(iPBButton[0], true);
  AllowDisabledButtonFastHelp(iPBButton[1], true);
  AllowDisabledButtonFastHelp(iPBButton[2], true);

  gusRetreatButtonLeft = ButtonList[iPBButton[2]].value.Area.RegionTopLeftX;
  gusRetreatButtonTop = ButtonList[iPBButton[2]].value.Area.RegionTopLeftY;
  gusRetreatButtonRight = ButtonList[iPBButton[2]].value.Area.RegionBottomRightX;
  gusRetreatButtonBottom = ButtonList[iPBButton[2]].value.Area.RegionBottomRightY;

  SetButtonCursor(iPBButtonImage[0], MSYS_NO_CURSOR);
  SetButtonCursor(iPBButtonImage[1], MSYS_NO_CURSOR);
  SetButtonCursor(iPBButtonImage[2], MSYS_NO_CURSOR);

  HideButton(iPBButton[0]);
  HideButton(iPBButton[1]);
  HideButton(iPBButton[2]);
  gfPBButtonsHidden = true;

  // ARM: this must now be set before any calls utilizing the GetCurrentBattleSectorXYZ() function
  gfPreBattleInterfaceActive = true;

  CheckForRobotAndIfItsControlled();

  // wake everyone up
  WakeUpAllMercsInSectorUnderAttack();

  // Count the number of players involved or not involved in this battle
  guiNumUninvolved = 0;
  guiNumInvolved = 0;
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && !(MercPtrs[i].value.uiStatusFlags & SOLDIER_VEHICLE)) {
      if (PlayerMercInvolvedInThisCombat(MercPtrs[i])) {
        // involved
        if (!ubGroupID) {
          // Record the first groupID.  If there are more than one group in this battle, we
          // can detect it by comparing the first value with future values.  If we do, then
          // we set a flag which determines whether to use the singular help text or plural version
          // for the retreat button.
          ubGroupID = MercPtrs[i].value.ubGroupID;
          if (!gpBattleGroup)
            gpBattleGroup = GetGroup(ubGroupID);
          if (bBestExpLevel > MercPtrs[i].value.bExpLevel)
            bBestExpLevel = MercPtrs[i].value.bExpLevel;
          if (MercPtrs[i].value.ubPrevSectorID == 255) {
            // Not able to retreat (calculate it for group)
            let pTempGroup: Pointer<GROUP>;
            pTempGroup = GetGroup(ubGroupID);
            Assert(pTempGroup);
            CalculateGroupRetreatSector(pTempGroup);
          }
        } else if (ubGroupID != MercPtrs[i].value.ubGroupID) {
          fUsePluralVersion = true;
        }
        guiNumInvolved++;
      } else
        guiNumUninvolved++;
    }
  }

  ubNumStationaryEnemies = NumStationaryEnemiesInSector(gubPBSectorX, gubPBSectorY);
  ubNumMobileEnemies = NumMobileEnemiesInSector(gubPBSectorX, gubPBSectorY);
  ubNumMercs = PlayerMercsInSector(gubPBSectorX, gubPBSectorY, gubPBSectorZ);

  if (gfPersistantPBI) {
    if (!pBattleGroup) {
      // creature's attacking!
      gubEnemyEncounterCode = Enum164.CREATURE_ATTACK_CODE;
    } else if (gpBattleGroup.value.fPlayer) {
      if (gubEnemyEncounterCode != Enum164.BLOODCAT_AMBUSH_CODE && gubEnemyEncounterCode != Enum164.ENTERING_BLOODCAT_LAIR_CODE) {
        if (ubNumStationaryEnemies) {
          gubEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;
        } else {
          gubEnemyEncounterCode = Enum164.ENEMY_ENCOUNTER_CODE;

          // Don't consider ambushes until the player has reached 25% (normal) progress
          if (gfHighPotentialForAmbush) {
            if (Chance(90)) {
              gubEnemyEncounterCode = Enum164.ENEMY_AMBUSH_CODE;
            }
          } else if (gfAutoAmbush && ubNumMobileEnemies > ubNumMercs) {
            gubEnemyEncounterCode = Enum164.ENEMY_AMBUSH_CODE;
          } else if (WhatPlayerKnowsAboutEnemiesInSector(gubPBSectorX, gubPBSectorY) == Enum159.KNOWS_NOTHING && CurrentPlayerProgressPercentage() >= 30 - gGameOptions.ubDifficultyLevel * 5) {
            // if the enemy outnumbers the players, then there is a small chance of the enemies ambushing the group
            if (ubNumMobileEnemies > ubNumMercs) {
              let iChance: INT32;
              pSector = addressof(SectorInfo[SECTOR(gubPBSectorX, gubPBSectorY)]);
              if (!(pSector.value.uiFlags & SF_ALREADY_VISITED)) {
                iChance = (4 - bBestExpLevel + 2 * gGameOptions.ubDifficultyLevel + CurrentPlayerProgressPercentage() / 10);
                if (pSector.value.uiFlags & SF_ENEMY_AMBUSH_LOCATION) {
                  iChance += 20;
                }
                if (gfCantRetreatInPBI) {
                  iChance += 20;
                }
                if (PreRandom(100) < iChance) {
                  gubEnemyEncounterCode = Enum164.ENEMY_AMBUSH_CODE;
                }
              }
            }
          }
        }
      }
    } else {
      // Are enemies invading a town, or just encountered the player.
      if (GetTownIdForSector(gubPBSectorX, gubPBSectorY)) {
        gubEnemyEncounterCode = Enum164.ENEMY_INVASION_CODE;
      } else {
        switch (SECTOR(gubPBSectorX, gubPBSectorY)) {
          case Enum123.SEC_D2:
          case Enum123.SEC_D15:
          case Enum123.SEC_G8:
            // SAM sites not in towns will also be considered to be important
            gubEnemyEncounterCode = Enum164.ENEMY_INVASION_CODE;
            break;
          default:
            gubEnemyEncounterCode = Enum164.ENEMY_ENCOUNTER_CODE;
            break;
        }
      }
    }
  }

  gfHighPotentialForAmbush = false;

  if (gfAutomaticallyStartAutoResolve) {
    DisableButton(iPBButton[1]);
    DisableButton(iPBButton[2]);
  }

  gfRenderPBInterface = true;
  giHilitedInvolved = giHilitedUninvolved = -1;
  MSYS_SetCurrentCursor(Enum317.CURSOR_NORMAL);
  StopTimeCompression();

  // hide all visible boxes
  HideAllBoxes();
  fShowAssignmentMenu = false;
  fShowContractMenu = false;
  DisableTeamInfoPanels();
  if (ButtonList[giMapContractButton]) {
    HideButton(giMapContractButton);
  }
  if (ButtonList[giCharInfoButton[0]]) {
    HideButton(giCharInfoButton[0]);
  }
  if (ButtonList[giCharInfoButton[1]]) {
    HideButton(giCharInfoButton[1]);
  }
  HideButton(giMapContractButton);

  if (gubEnemyEncounterCode == Enum164.ENEMY_ENCOUNTER_CODE) {
    // we know how many enemies are here, so until we leave the sector, we will continue to display the value.
    // the flag will get cleared when time advances after the fEnemyInSector flag is clear.
    pSector = addressof(SectorInfo[SECTOR(gubPBSectorX, gubPBSectorY)]);

    // ALWAYS use these 2 statements together, without setting the boolean, the flag will never be cleaned up!
    pSector.value.uiFlags |= SF_PLAYER_KNOWS_ENEMIES_ARE_HERE;
    gfResetAllPlayerKnowsEnemiesFlags = true;
  }

  // Set up fast help for buttons depending on the state of the button, and disable buttons
  // when necessary.
  if (gfPersistantPBI) {
    if (gubEnemyEncounterCode == Enum164.ENTERING_ENEMY_SECTOR_CODE || gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE) {
      // Don't allow autoresolve for player initiated invasion battle types
      DisableButton(iPBButton[0]);
      SetButtonFastHelpText(iPBButton[0], gpStrategicString[Enum365.STR_PB_DISABLED_AUTORESOLVE_FASTHELP]);
    } else if (gubEnemyEncounterCode == Enum164.ENEMY_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE) {
      // Don't allow autoresolve for ambushes
      DisableButton(iPBButton[0]);
      SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[3]);
    } else {
      SetButtonFastHelpText(iPBButton[0], gpStrategicString[Enum365.STR_PB_AUTORESOLVE_FASTHELP]);
    }
    SetButtonFastHelpText(iPBButton[1], gpStrategicString[Enum365.STR_PB_GOTOSECTOR_FASTHELP]);
    if (gfAutomaticallyStartAutoResolve) {
      DisableButton(iPBButton[1]);
    }
    if (gfCantRetreatInPBI) {
      gfCantRetreatInPBI = false;
      fRetreatAnOption = false;
    }
    if (gfAutomaticallyStartAutoResolve || !fRetreatAnOption || gubEnemyEncounterCode == Enum164.ENEMY_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.CREATURE_ATTACK_CODE) {
      DisableButton(iPBButton[2]);
      SetButtonFastHelpText(iPBButton[2], gzNonPersistantPBIText[9]);
    } else {
      if (!fUsePluralVersion) {
        SetButtonFastHelpText(iPBButton[2], gpStrategicString[Enum365.STR_BP_RETREATSINGLE_FASTHELP]);
      } else {
        SetButtonFastHelpText(iPBButton[2], gpStrategicString[Enum365.STR_BP_RETREATPLURAL_FASTHELP]);
      }
    }
  } else {
    // use the explicit encounter code to determine what get's disable and the associated help text that is used.

    // First of all, the retreat button is always disabled seeing a battle is in progress.
    DisableButton(iPBButton[2]);
    SetButtonFastHelpText(iPBButton[2], gzNonPersistantPBIText[0]);
    SetButtonFastHelpText(iPBButton[1], gzNonPersistantPBIText[1]);
    switch (gubExplicitEnemyEncounterCode) {
      case Enum164.CREATURE_ATTACK_CODE:
      case Enum164.ENEMY_ENCOUNTER_CODE:
      case Enum164.ENEMY_INVASION_CODE:
        SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[2]);
        break;
      case Enum164.ENTERING_ENEMY_SECTOR_CODE:
        DisableButton(iPBButton[0]);
        SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[3]);
        break;
      case Enum164.ENEMY_AMBUSH_CODE:
        DisableButton(iPBButton[0]);
        SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[4]);
        break;
      case Enum164.FIGHTING_CREATURES_CODE:
        DisableButton(iPBButton[0]);
        SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[5]);
        break;
      case Enum164.HOSTILE_CIVILIANS_CODE:
        DisableButton(iPBButton[0]);
        SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[6]);
        break;
      case Enum164.HOSTILE_BLOODCATS_CODE:
      case Enum164.BLOODCAT_AMBUSH_CODE:
      case Enum164.ENTERING_BLOODCAT_LAIR_CODE:
        DisableButton(iPBButton[0]);
        SetButtonFastHelpText(iPBButton[0], gzNonPersistantPBIText[7]);
        break;
    }
  }

  // Disable the options button when the auto resolve  screen comes up
  EnableDisAbleMapScreenOptionsButton(false);

  SetMusicMode(Enum328.MUSIC_TACTICAL_ENEMYPRESENT);

  DoTransitionFromMapscreenToPreBattleInterface();
}

function DoTransitionFromMapscreenToPreBattleInterface(): void {
  let DstRect: SGPRect;
  let PBIRect: SGPRect;
  let uiStartTime: UINT32;
  let uiCurrTime: UINT32;
  let iPercentage: INT32;
  let iFactor: INT32;
  let uiTimeRange: UINT32;
  let sStartLeft: INT16;
  let sEndLeft: INT16;
  let sStartTop: INT16;
  let sEndTop: INT16;
  let iLeft: INT32;
  let iTop: INT32;
  let iWidth: INT32;
  let iHeight: INT32;
  let fEnterAutoResolveMode: boolean = false;

  if (!gfExtraBuffer)
    return;

  PauseTime(false);

  PBIRect.iLeft = 0;
  PBIRect.iTop = 0;
  PBIRect.iRight = 261;
  PBIRect.iBottom = 359;
  iWidth = 261;
  iHeight = 359;

  uiTimeRange = 1000;
  iPercentage = 0;
  uiStartTime = GetJA2Clock();

  GetScreenXYFromMapXY(gubPBSectorX, gubPBSectorY, addressof(sStartLeft), addressof(sStartTop));
  sStartLeft += MAP_GRID_X / 2;
  sStartTop += MAP_GRID_Y / 2;
  sEndLeft = 131;
  sEndTop = 180;

  // save the mapscreen buffer
  BlitBufferToBuffer(FRAME_BUFFER, guiEXTRABUFFER, 0, 0, 640, 480);

  if (gfEnterAutoResolveMode) {
    // If we are intending on immediately entering autoresolve, change the global flag so that it will actually
    // render the interface once.  If gfEnterAutoResolveMode is clear, then RenderPreBattleInterface() won't do
    // anything.
    fEnterAutoResolveMode = true;
    gfEnterAutoResolveMode = false;
  }
  // render the prebattle interface
  RenderPreBattleInterface();

  gfIgnoreAllInput = true;

  if (fEnterAutoResolveMode) {
    // Change it back
    gfEnterAutoResolveMode = true;
  }

  BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, 27, 54, 209, 32);
  RenderButtons();
  BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 27, 54, 209, 32);
  gfRenderPBInterface = true;

  // hide the prebattle interface
  BlitBufferToBuffer(guiEXTRABUFFER, FRAME_BUFFER, 0, 0, 261, 359);
  PlayJA2SampleFromFile("SOUNDS\\Laptop power up (8-11).wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  InvalidateScreen();
  RefreshScreen(null);

  while (iPercentage < 100) {
    uiCurrTime = GetJA2Clock();
    iPercentage = (uiCurrTime - uiStartTime) * 100 / uiTimeRange;
    iPercentage = Math.min(iPercentage, 100);

    // Factor the percentage so that it is modified by a gravity falling acceleration effect.
    iFactor = (iPercentage - 50) * 2;
    if (iPercentage < 50)
      iPercentage = (iPercentage + iPercentage * iFactor * 0.01 + 0.5);
    else
      iPercentage = (iPercentage + (100 - iPercentage) * iFactor * 0.01 + 0.05);

    // Calculate the center point.
    iLeft = sStartLeft - (sStartLeft - sEndLeft + 1) * iPercentage / 100;
    if (sStartTop > sEndTop)
      iTop = sStartTop - (sStartTop - sEndTop + 1) * iPercentage / 100;
    else
      iTop = sStartTop + (sEndTop - sStartTop + 1) * iPercentage / 100;

    DstRect.iLeft = iLeft - iWidth * iPercentage / 200;
    DstRect.iRight = DstRect.iLeft + Math.max(iWidth * iPercentage / 100, 1);
    DstRect.iTop = iTop - iHeight * iPercentage / 200;
    DstRect.iBottom = DstRect.iTop + Math.max(iHeight * iPercentage / 100, 1);

    BltStretchVideoSurface(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 0, addressof(PBIRect), addressof(DstRect));

    InvalidateScreen();
    RefreshScreen(null);

    // Restore the previous rect.
    BlitBufferToBuffer(guiEXTRABUFFER, FRAME_BUFFER, DstRect.iLeft, DstRect.iTop, (DstRect.iRight - DstRect.iLeft + 1), (DstRect.iBottom - DstRect.iTop + 1));
  }
  BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 640, 480);
}

export function KillPreBattleInterface(): void {
  if (!gfPreBattleInterfaceActive)
    return;

  fDisableMapInterfaceDueToBattle = false;
  MSYS_RemoveRegion(addressof(PBInterfaceBlanket));

  // The panel
  DeleteVideoObjectFromIndex(uiInterfaceImages);

  // The 3 buttons
  RemoveButton(iPBButton[0]);
  RemoveButton(iPBButton[1]);
  RemoveButton(iPBButton[2]);
  UnloadButtonImage(iPBButtonImage[0]);
  UnloadButtonImage(iPBButtonImage[1]);
  UnloadButtonImage(iPBButtonImage[2]);

  /*
  MSYS_RemoveRegion( &InvolvedRegion );
  if( guiNumUninvolved )
          MSYS_RemoveRegion( &UninvolvedRegion );
  */

  gfPreBattleInterfaceActive = false;

  // UpdateCharRegionHelpText( );

  // re draw affected regions
  fMapPanelDirty = true;
  fTeamPanelDirty = true;
  fMapScreenBottomDirty = true;
  fCharacterInfoPanelDirty = true;
  gfDisplayPotentialRetreatPaths = false;

  // Enable the options button when the auto resolve  screen comes up
  EnableDisAbleMapScreenOptionsButton(true);

  ColorFillVideoSurfaceArea(guiSAVEBUFFER, 0, 0, 261, 359, 0);

  EnableTeamInfoPanels();
  if (ButtonList[giMapContractButton]) {
    ShowButton(giMapContractButton);
  }
  if (ButtonList[giCharInfoButton[0]]) {
    ShowButton(giCharInfoButton[0]);
  }
  if (ButtonList[giCharInfoButton[1]]) {
    ShowButton(giCharInfoButton[1]);
  }
}

function RenderPBHeader(piX: Pointer<INT32>, piWidth: Pointer<INT32>): void {
  let str: string /* UINT16[100] */;
  let x: INT32;
  let width: INT32;
  SetFont(FONT10ARIALBOLD());
  if (gfBlinkHeader) {
    if (GetJA2Clock() % 1000 < 667) {
      SetFontForeground(FONT_WHITE);
    } else {
      SetFontForeground(FONT_LTRED);
    }
  } else {
    SetFontForeground(FONT_BEIGE);
  }
  SetFontShadow(FONT_NEARBLACK);
  if (!gfPersistantPBI) {
    str = gzNonPersistantPBIText[8];
  } else
    switch (gubEnemyEncounterCode) {
      case Enum164.ENEMY_INVASION_CODE:
        str = gpStrategicString[Enum365.STR_PB_ENEMYINVASION_HEADER];
        break;
      case Enum164.ENEMY_ENCOUNTER_CODE:
        str = gpStrategicString[Enum365.STR_PB_ENEMYENCOUNTER_HEADER];
        break;
      case Enum164.ENEMY_AMBUSH_CODE:
        str = gpStrategicString[Enum365.STR_PB_ENEMYAMBUSH_HEADER];
        gfBlinkHeader = true;
        break;
      case Enum164.ENTERING_ENEMY_SECTOR_CODE:
        str = gpStrategicString[Enum365.STR_PB_ENTERINGENEMYSECTOR_HEADER];
        break;
      case Enum164.CREATURE_ATTACK_CODE:
        str = gpStrategicString[Enum365.STR_PB_CREATUREATTACK_HEADER];
        gfBlinkHeader = true;
        break;
      case Enum164.BLOODCAT_AMBUSH_CODE:
        str = gpStrategicString[Enum365.STR_PB_BLOODCATAMBUSH_HEADER];
        gfBlinkHeader = true;
        break;
      case Enum164.ENTERING_BLOODCAT_LAIR_CODE:
        str = gpStrategicString[Enum365.STR_PB_ENTERINGBLOODCATLAIR_HEADER];
        break;
    }
  width = StringPixLength(str, FONT10ARIALBOLD());
  x = 130 - width / 2;
  mprintf(x, 4, str);
  InvalidateRegion(0, 0, 231, 12);
  piX.value = x;
  piWidth.value = width;
}

export function RenderPreBattleInterface(): void {
  let pGroup: Pointer<GROUP>;
  let hVObject: HVOBJECT;
  let i: INT32;
  let x: INT32;
  let y: INT32;
  let line: INT32;
  let width: INT32;
  let str: string /* UINT16[100] */;
  let pSectorName: string /* UINT16[128] */;
  let ubHPPercent: UINT8;
  let ubBPPercent: UINT8;
  let fMouseInRetreatButtonArea: boolean;
  let ubJunk: UINT8;
  // PLAYERGROUP *pPlayer;

  // This code determines if the cursor is inside the rectangle consisting of the
  // retreat button.  If it is inside, then we set up the variables so that the retreat
  // arrows get drawn in the mapscreen.
  if (ButtonList[iPBButton[2]].value.uiFlags & BUTTON_ENABLED) {
    if (gusMouseXPos < gusRetreatButtonLeft || gusMouseXPos > gusRetreatButtonRight || gusMouseYPos < gusRetreatButtonTop || gusMouseYPos > gusRetreatButtonBottom)
      fMouseInRetreatButtonArea = false;
    else
      fMouseInRetreatButtonArea = true;
    if (fMouseInRetreatButtonArea != gfDisplayPotentialRetreatPaths) {
      gfDisplayPotentialRetreatPaths = fMouseInRetreatButtonArea;
      fMapPanelDirty = true;
    }
  }

  if (gfRenderPBInterface) {
    // set font destinanation buffer to the save buffer
    SetFontDestBuffer(guiSAVEBUFFER, 0, 0, 640, 480, false);

    if (gfPBButtonsHidden) {
      ShowButton(iPBButton[0]);
      ShowButton(iPBButton[1]);
      ShowButton(iPBButton[2]);
      gfPBButtonsHidden = false;
    } else {
      MarkAButtonDirty(iPBButton[0]);
      MarkAButtonDirty(iPBButton[1]);
      MarkAButtonDirty(iPBButton[2]);
    }

    gfRenderPBInterface = false;
    GetVideoObject(addressof(hVObject), uiInterfaceImages);
    // main panel
    BltVideoObject(guiSAVEBUFFER, hVObject, Enum162.MAINPANEL, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
    // main title

    RenderPBHeader(addressof(x), addressof(width));
    // now draw the title bars up to the text.
    for (i = x - 12; i > 20; i -= 10) {
      BltVideoObject(guiSAVEBUFFER, hVObject, Enum162.TITLE_BAR_PIECE, i, 6, VO_BLT_SRCTRANSPARENCY, null);
    }
    for (i = x + width + 2; i < 231; i += 10) {
      BltVideoObject(guiSAVEBUFFER, hVObject, Enum162.TITLE_BAR_PIECE, i, 6, VO_BLT_SRCTRANSPARENCY, null);
    }

    y = BOTTOM_Y - ACTUAL_HEIGHT - ROW_HEIGHT * Math.max(guiNumUninvolved, 1);
    BltVideoObject(guiSAVEBUFFER, hVObject, Enum162.UNINVOLVED_HEADER, 8, y, VO_BLT_SRCTRANSPARENCY, null);

    SetFont(BLOCKFONT());
    SetFontForeground(FONT_BEIGE);
    str = gpStrategicString[Enum365.STR_PB_LOCATION];
    width = StringPixLength(str, BLOCKFONT());
    if (width > 64) {
      SetFont(BLOCKFONTNARROW());
      width = StringPixLength(str, BLOCKFONTNARROW());
    }
    mprintf(65 - width, 17, str);

    SetFont(BLOCKFONT());
    if (gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE) {
      str = gpStrategicString[Enum365.STR_PB_ENEMIES];
    } else if (gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE) {
      str = gpStrategicString[Enum365.STR_PB_BLOODCATS];
    } else {
      str = gpStrategicString[Enum365.STR_PB_CREATURES];
    }
    width = StringPixLength(str, BLOCKFONT());
    if (width > 52) {
      SetFont(BLOCKFONTNARROW());
      width = StringPixLength(str, BLOCKFONTNARROW());
    }
    mprintf(54 - width, 38, str);

    SetFont(BLOCKFONT());
    str = gpStrategicString[Enum365.STR_PB_MERCS];
    width = StringPixLength(str, BLOCKFONT());
    if (width > 52) {
      SetFont(BLOCKFONTNARROW());
      width = StringPixLength(str, BLOCKFONTNARROW());
    }
    mprintf(139 - width, 38, str);

    SetFont(BLOCKFONT());
    str = gpStrategicString[Enum365.STR_PB_MILITIA];
    width = StringPixLength(str, BLOCKFONT());
    if (width > 52) {
      SetFont(BLOCKFONTNARROW());
      width = StringPixLength(str, BLOCKFONTNARROW());
    }
    mprintf(224 - width, 38, str);

    // Draw the bottom columns
    for (i = 0; i < Math.max(guiNumUninvolved, 1); i++) {
      y = BOTTOM_Y - ROW_HEIGHT * (i + 1) + 1;
      BltVideoObject(guiSAVEBUFFER, hVObject, Enum162.BOTTOM_COLUMN, 161, y, VO_BLT_SRCTRANSPARENCY, null);
    }

    for (i = 0; i < (21 - Math.max(guiNumUninvolved, 1)); i++) {
      y = TOP_Y + ROW_HEIGHT * i;
      BltVideoObject(guiSAVEBUFFER, hVObject, Enum162.TOP_COLUMN, 186, y, VO_BLT_SRCTRANSPARENCY, null);
    }

    // location
    SetFont(FONT10ARIAL());
    SetFontForeground(FONT_YELLOW);
    SetFontShadow(FONT_NEARBLACK);

    GetSectorIDString(gubPBSectorX, gubPBSectorY, gubPBSectorZ, pSectorName, true);
    mprintf(70, 17, "%s %s", gpStrategicString[Enum365.STR_PB_SECTOR], pSectorName);

    // enemy
    SetFont(FONT14ARIAL());
    if (gubEnemyEncounterCode == Enum164.CREATURE_ATTACK_CODE || gubEnemyEncounterCode == Enum164.BLOODCAT_AMBUSH_CODE || gubEnemyEncounterCode == Enum164.ENTERING_BLOODCAT_LAIR_CODE || WhatPlayerKnowsAboutEnemiesInSector(gubPBSectorX, gubPBSectorY) != Enum159.KNOWS_HOW_MANY) {
      // don't know how many
      str = "?";
      SectorInfo[SECTOR(gubPBSectorX, gubPBSectorY)].bLastKnownEnemies = -2;
    } else {
      // know exactly how many
      i = NumEnemiesInSector(gubPBSectorX, gubPBSectorY);
      str = swprintf("%d", i);
      SectorInfo[SECTOR(gubPBSectorX, gubPBSectorY)].bLastKnownEnemies = i;
    }
    x = 57 + (27 - StringPixLength(str, FONT14ARIAL())) / 2;
    y = 36;
    mprintf(x, y, str);
    // player
    str = swprintf("%d", guiNumInvolved);
    x = 142 + (27 - StringPixLength(str, FONT14ARIAL())) / 2;
    mprintf(x, y, str);
    // militia
    str = swprintf("%d", CountAllMilitiaInSector(gubPBSectorX, gubPBSectorY));
    x = 227 + (27 - StringPixLength(str, FONT14ARIAL())) / 2;
    mprintf(x, y, str);
    SetFontShadow(FONT_NEARBLACK);

    SetFont(BLOCKFONT2());
    SetFontForeground(FONT_YELLOW);

    // print out the participants of the battle.
    // |  NAME  | ASSIGN |  COND  |   HP   |   BP   |
    line = 0;
    y = TOP_Y + 1;
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && !(MercPtrs[i].value.uiStatusFlags & SOLDIER_VEHICLE)) {
        if (PlayerMercInvolvedInThisCombat(MercPtrs[i])) {
          // involved
          if (line == giHilitedInvolved)
            SetFontForeground(FONT_WHITE);
          else
            SetFontForeground(FONT_YELLOW);
          // NAME
          str = MercPtrs[i].value.name;
          x = 17 + (52 - StringPixLength(str, BLOCKFONT2())) / 2;
          mprintf(x, y, str);
          // ASSIGN
          GetMapscreenMercAssignmentString(MercPtrs[i], str);
          x = 72 + (54 - StringPixLength(str, BLOCKFONT2())) / 2;
          mprintf(x, y, str);
          // COND
          GetSoldierConditionInfo(MercPtrs[i], str, addressof(ubHPPercent), addressof(ubBPPercent));
          x = 129 + (58 - StringPixLength(str, BLOCKFONT2())) / 2;
          mprintf(x, y, str);
          // HP
          str = swprintf("%d%%", ubHPPercent);
          x = 189 + (25 - StringPixLength(str, BLOCKFONT2())) / 2;
          str += "%";
          mprintf(x, y, str);
          // BP
          str = swprintf("%d%%", ubBPPercent);
          x = 217 + (25 - StringPixLength(str, BLOCKFONT2())) / 2;
          str += "%";
          mprintf(x, y, str);

          line++;
          y += ROW_HEIGHT;
        }
      }
    }

    // print out the uninvolved members of the battle
    // |  NAME  | ASSIGN |  LOC   |  DEST  |  DEP   |
    if (!guiNumUninvolved) {
      SetFontForeground(FONT_YELLOW);
      str = gpStrategicString[Enum365.STR_PB_NONE];
      x = 17 + (52 - StringPixLength(str, BLOCKFONT2())) / 2;
      y = BOTTOM_Y - ROW_HEIGHT + 2;
      mprintf(x, y, str);
    } else {
      pGroup = gpGroupList;
      y = BOTTOM_Y - ROW_HEIGHT * guiNumUninvolved + 2;
      for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
        if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && !(MercPtrs[i].value.uiStatusFlags & SOLDIER_VEHICLE)) {
          if (!PlayerMercInvolvedInThisCombat(MercPtrs[i])) {
            // uninvolved
            if (line == giHilitedUninvolved)
              SetFontForeground(FONT_WHITE);
            else
              SetFontForeground(FONT_YELLOW);
            // NAME
            str = MercPtrs[i].value.name;
            x = 17 + (52 - StringPixLength(str, BLOCKFONT2())) / 2;
            mprintf(x, y, str);
            // ASSIGN
            GetMapscreenMercAssignmentString(MercPtrs[i], str);
            x = 72 + (54 - StringPixLength(str, BLOCKFONT2())) / 2;
            mprintf(x, y, str);
            // LOC
            GetMapscreenMercLocationString(MercPtrs[i], str);
            x = 128 + (33 - StringPixLength(str, BLOCKFONT2())) / 2;
            mprintf(x, y, str);
            // DEST
            GetMapscreenMercDestinationString(MercPtrs[i], str);
            if (str.length > 0) {
              x = 164 + (41 - StringPixLength(str, BLOCKFONT2())) / 2;
              mprintf(x, y, str);
            }
            // DEP
            GetMapscreenMercDepartureString(MercPtrs[i], str, addressof(ubJunk));
            x = 208 + (34 - StringPixLength(str, BLOCKFONT2())) / 2;
            mprintf(x, y, str);
            line++;
            y += ROW_HEIGHT;
          }
        }
      }
    }

    // mark any and ALL pop up boxes as altered
    MarkAllBoxesAsAltered();
    RestoreExternBackgroundRect(0, 0, 261, 359);

    // restore font destinanation buffer to the frame buffer
    SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
  } else if (gfBlinkHeader) {
    RenderPBHeader(addressof(x), addressof(width)); // the text is important enough to blink.
  }

  // InvalidateRegion( 0, 0, 261, 359 );
  if (gfEnterAutoResolveMode) {
    gfEnterAutoResolveMode = false;
    EnterAutoResolveMode(gubPBSectorX, gubPBSectorY);
    // return;
  }

  gfIgnoreAllInput = false;
}

function AutoResolveBattleCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!gfIgnoreAllInput) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (_KeyDown(ALT) && CHEATER_CHEAT_LEVEL())
      {
        if (!gfPersistantPBI) {
          return;
        }
        PlayJA2Sample(Enum330.EXPLOSION_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        gStrategicStatus.usPlayerKills += NumEnemiesInSector(gubPBSectorX, gubPBSectorY);
        EliminateAllEnemies(gubPBSectorX, gubPBSectorY);
        SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);
        btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
        DrawButton(btn.value.IDNum);
        InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
        ExecuteBaseDirtyRectQueue();
        EndFrameBufferRender();
        RefreshScreen(null);
        KillPreBattleInterface();
        StopTimeCompression();
        SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
        return;
      }
      gfEnterAutoResolveMode = true;
    }
  }
}

function GoToSectorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!gfIgnoreAllInput) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (_KeyDown(ALT) && CHEATER_CHEAT_LEVEL())
      {
        if (!gfPersistantPBI) {
          return;
        }
        PlayJA2Sample(Enum330.EXPLOSION_1, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        gStrategicStatus.usPlayerKills += NumEnemiesInSector(gubPBSectorX, gubPBSectorY);
        EliminateAllEnemies(gubPBSectorX, gubPBSectorY);
        SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);
        btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
        DrawButton(btn.value.IDNum);
        InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
        ExecuteBaseDirtyRectQueue();
        EndFrameBufferRender();
        RefreshScreen(null);
        KillPreBattleInterface();
        StopTimeCompression();
        SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
        return;
      }
      if (gfPersistantPBI && gpBattleGroup && gpBattleGroup.value.fPlayer && gubEnemyEncounterCode != Enum164.ENEMY_AMBUSH_CODE && gubEnemyEncounterCode != Enum164.CREATURE_ATTACK_CODE && gubEnemyEncounterCode != Enum164.BLOODCAT_AMBUSH_CODE) {
        gfEnterTacticalPlacementGUI = true;
      }
      btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
      DrawButton(btn.value.IDNum);
      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
      ExecuteBaseDirtyRectQueue();
      EndFrameBufferRender();
      RefreshScreen(null);
      if (gubPBSectorX == gWorldSectorX && gubPBSectorY == gWorldSectorY && !gbWorldSectorZ) {
        gfGotoSectorTransition = true;
      }

      // first time going to the sector?
      if (gfPersistantPBI) {
        // put everyone on duty, and remove mercs from vehicles, too
        PutNonSquadMercsInBattleSectorOnSquads(true);

        // we nuke the groups existing route & destination in advance
        ClearMovementForAllInvolvedPlayerGroups();
      } else {
        // Clear the battlegroup pointer.
        gpBattleGroup = null;
      }

      // must come AFTER anything that needs gpBattleGroup, as it wipes it out
      SetCurrentWorldSector(gubPBSectorX, gubPBSectorY, gubPBSectorZ);

      KillPreBattleInterface();
      SetTacticalInterfaceFlags(0);
    }
  }
}

function RetreatMercsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!gfIgnoreAllInput) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      // get them outta here!
      RetreatAllInvolvedPlayerGroups();

      // NOTE: this code assumes you can never retreat while underground
      HandleLoyaltyImplicationsOfMercRetreat(RETREAT_PBI, gubPBSectorX, gubPBSectorY, 0);
      if (CountAllMilitiaInSector(gubPBSectorX, gubPBSectorY)) {
        // Mercs retreat, but enemies still need to fight the militia
        gfEnterAutoResolveMode = true;
        return;
      }

      // Warp time by 5 minutes so that player can't just go back into the sector he left.
      WarpGameTime(300, Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);
      ResetMovementForEnemyGroupsInLocation(gubPBSectorX, gubPBSectorY);

      btn.value.uiFlags &= ~BUTTON_CLICKED_ON;
      DrawButton(btn.value.IDNum);
      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
      ExecuteBaseDirtyRectQueue();
      EndFrameBufferRender();
      RefreshScreen(null);
      KillPreBattleInterface();
      StopTimeCompression();
      gpBattleGroup = null;
      gfBlitBattleSectorLocator = false;

      SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
    }
  }
}

const enum Enum163 {
  COND_EXCELLENT,
  COND_GOOD,
  COND_FAIR,
  COND_WOUNDED,
  COND_FATIGUED,
  COND_BLEEDING,
  COND_UNCONCIOUS,
  COND_DYING,
  COND_DEAD,
}

function GetSoldierConditionInfo(pSoldier: Pointer<SOLDIERTYPE>, szCondition: Pointer<string> /* Pointer<UINT16> */, pubHPPercent: Pointer<UINT8>, pubBPPercent: Pointer<UINT8>): void {
  Assert(pSoldier);
  pubHPPercent.value = (pSoldier.value.bLife * 100 / pSoldier.value.bLifeMax);
  pubBPPercent.value = pSoldier.value.bBreath;
  // Go from the worst condition to the best.
  if (!pSoldier.value.bLife) {
    // 0 life
    szCondition = pConditionStrings[Enum163.COND_DEAD];
  } else if (pSoldier.value.bLife < OKLIFE && pSoldier.value.bBleeding) {
    // life less than OKLIFE and bleeding
    szCondition = pConditionStrings[Enum163.COND_DYING];
  } else if (pSoldier.value.bBreath < OKBREATH && pSoldier.value.bCollapsed) {
    // breath less than OKBREATH
    szCondition = pConditionStrings[Enum163.COND_UNCONCIOUS];
  } else if (pSoldier.value.bBleeding > MIN_BLEEDING_THRESHOLD) {
    // bleeding
    szCondition = pConditionStrings[Enum163.COND_BLEEDING];
  } else if (pSoldier.value.bLife * 100 < pSoldier.value.bLifeMax * 50) {
    // less than 50% life
    szCondition = pConditionStrings[Enum163.COND_WOUNDED];
  } else if (pSoldier.value.bBreath < 50) {
    // breath less than half
    szCondition = pConditionStrings[Enum163.COND_FATIGUED];
  } else if (pSoldier.value.bLife * 100 < pSoldier.value.bLifeMax * 67) {
    // less than 67% life
    szCondition = pConditionStrings[Enum163.COND_FAIR];
  } else if (pSoldier.value.bLife * 100 < pSoldier.value.bLifeMax * 86) {
    // less than 86% life
    szCondition = pConditionStrings[Enum163.COND_GOOD];
  } else {
    // 86%+ life
    szCondition = pConditionStrings[Enum163.COND_EXCELLENT];
  }
}

/*
void InvolvedMoveCallback( MOUSE_REGION *reg, INT32 reason )
{
        gfRenderPBInterface = TRUE;
        if( reason & MSYS_CALLBACK_REASON_LOST_MOUSE )
        {
                giHilitedInvolved = giHilitedUninvolved = -1;
                return;
        }
        giHilitedInvolved = reg->RelativeYPos / 10;
        giHilitedUninvolved = -1;
}

void InvolvedClickCallback( MOUSE_REGION *reg, INT32 reason )
{
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                SOLDIERTYPE *pSoldier;
                INT16 y;
                pSoldier = InvolvedSoldier( giHilitedInvolved );
                if( !pSoldier )
                        return;
                y = (INT16)(reg->RegionTopLeftY + giHilitedUninvolved * ROW_HEIGHT + 5);
                if( y + 102 >= 360 )
                        y -= 102;
                if( gusMouseXPos >= 76 && gusMouseXPos <= 129 )
                        ActivateSoldierPopup( pSoldier, ASSIGNMENT_POPUP, 102, y );
                gfRenderPBInterface = TRUE;
        }
}

void UninvolvedMoveCallback( MOUSE_REGION *reg, INT32 reason )
{
        gfRenderPBInterface = TRUE;
        if( reason & MSYS_CALLBACK_REASON_LOST_MOUSE )
        {
                giHilitedInvolved = giHilitedUninvolved = -1;
                return;
        }
        giHilitedUninvolved = reg->RelativeYPos / 10;
        giHilitedInvolved = -1;
}

void UninvolvedClickCallback( MOUSE_REGION *reg, INT32 reason )
{
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                SOLDIERTYPE *pSoldier;
                INT16 y;
                pSoldier = UninvolvedSoldier( giHilitedUninvolved );
                if( !pSoldier )
                        return;
                y = (INT16)(reg->RegionTopLeftY + giHilitedUninvolved * ROW_HEIGHT + 5);
                if( y + 102 >= 360 )
                        y -= 102;
                if( gusMouseXPos >= 76 && gusMouseXPos <= 129 )
                {
                        ActivateSoldierPopup( pSoldier, ASSIGNMENT_POPUP, 102, y );
                }
                else if( gusMouseXPos >= 169 && gusMouseXPos <= 204 )
                {
                        ActivateSoldierPopup( pSoldier, DESTINATION_POPUP, 186, y );
                }
                else if( gusMouseXPos >= 208 && gusMouseXPos <= 236 )
                {
                        ActivateSoldierPopup( pSoldier, CONTRACT_POPUP, 172, y );
                }
                gfRenderPBInterface = TRUE;
        }
}

SOLDIERTYPE* InvolvedSoldier( INT32 index )
{
        GROUP *pGroup;
        PLAYERGROUP *pPlayer=NULL;
        BOOLEAN fFound = FALSE;
        if( index < 0 || index > 19 )
                return NULL;
        pGroup = gpGroupList;
        while( pGroup && !fFound )
        {
                if ( PlayerGroupInvolvedInThisCombat( pGroup ) )
                {
                        pPlayer = pGroup->pPlayerList;
                        while( pPlayer )
                        {
                                index--;
                                if( index <= 0 )
                                {
                                        fFound = TRUE;
                                        break;
                                }
                                pPlayer = pPlayer->next;
                        }
                }
                pGroup = pGroup->next;
        }
        if( !fFound )
                return NULL;
        return pPlayer->pSoldier;
}

SOLDIERTYPE* UninvolvedSoldier( INT32 index )
{
        GROUP *pGroup;
        PLAYERGROUP *pPlayer=NULL;
        BOOLEAN fFound = FALSE;
        if( index < 0 || index > 19 )
                return NULL;
        pGroup = gpGroupList;
        while( pGroup && !fFound )
        {
                if ( pGroup->fPlayer && !PlayerGroupInvolvedInThisCombat( pGroup ) )
                {
                        pPlayer = pGroup->pPlayerList;
                        while( pPlayer )
                        {
                                index--;
                                if( index <= 0 )
                                {
                                        fFound = TRUE;
                                        break;
                                }
                                pPlayer = pPlayer->next;
                        }
                }
                pGroup = pGroup->next;
        }
        if( !fFound )
                return NULL;
        return pPlayer->pSoldier;
}
*/

export function ActivatePreBattleAutoresolveAction(): void {
  if (ButtonList[iPBButton[0]].value.uiFlags & BUTTON_ENABLED) {
    // Feign call the autoresolve button using the callback
    AutoResolveBattleCallback(ButtonList[iPBButton[0]], MSYS_CALLBACK_REASON_LBUTTON_UP);
  }
}

export function ActivatePreBattleEnterSectorAction(): void {
  if (ButtonList[iPBButton[1]].value.uiFlags & BUTTON_ENABLED) {
    // Feign call the enter sector button using the callback
    GoToSectorCallback(ButtonList[iPBButton[1]], MSYS_CALLBACK_REASON_LBUTTON_UP);
  }
}

export function ActivatePreBattleRetreatAction(): void {
  if (ButtonList[iPBButton[2]].value.uiFlags & BUTTON_ENABLED) {
    // Feign call the retreat button using the callback
    RetreatMercsCallback(ButtonList[iPBButton[2]], MSYS_CALLBACK_REASON_LBUTTON_UP);
  }
}

function ActivateAutomaticAutoResolveStart(): void {
  ButtonList[iPBButton[0]].value.uiFlags |= BUTTON_CLICKED_ON;
  gfIgnoreAllInput = false;
  AutoResolveBattleCallback(ButtonList[iPBButton[0]], MSYS_CALLBACK_REASON_LBUTTON_UP);
}

export function CalculateNonPersistantPBIInfo(): void {
  // We need to set up the non-persistant PBI
  if (!gfBlitBattleSectorLocator || gubPBSectorX != gWorldSectorX || gubPBSectorY != gWorldSectorY || gubPBSectorZ != gbWorldSectorZ) {
    // Either the locator isn't on or the locator info is in a different sector

    // Calculated the encounter type
    gubEnemyEncounterCode = Enum164.NO_ENCOUNTER_CODE;
    gubExplicitEnemyEncounterCode = Enum164.NO_ENCOUNTER_CODE;
    if (HostileCiviliansPresent()) {
      // There are hostile civilians, so no autoresolve allowed.
      gubExplicitEnemyEncounterCode = Enum164.HOSTILE_CIVILIANS_CODE;
    } else if (HostileBloodcatsPresent()) {
      // There are bloodcats in the sector, so no autoresolve allowed
      gubExplicitEnemyEncounterCode = Enum164.HOSTILE_BLOODCATS_CODE;
    } else if (gbWorldSectorZ) {
      let pSector: Pointer<UNDERGROUND_SECTORINFO> = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      Assert(pSector);
      if (pSector.value.ubCreaturesInBattle) {
        gubExplicitEnemyEncounterCode = Enum164.FIGHTING_CREATURES_CODE;
      } else if (pSector.value.ubAdminsInBattle || pSector.value.ubTroopsInBattle || pSector.value.ubElitesInBattle) {
        gubExplicitEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;
        gubEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;
      }
    } else {
      let pSector: Pointer<SECTORINFO> = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
      Assert(pSector);
      if (pSector.value.ubCreaturesInBattle) {
        gubExplicitEnemyEncounterCode = Enum164.FIGHTING_CREATURES_CODE;
      } else if (pSector.value.ubAdminsInBattle || pSector.value.ubTroopsInBattle || pSector.value.ubElitesInBattle) {
        gubExplicitEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;
        gubEnemyEncounterCode = Enum164.ENTERING_ENEMY_SECTOR_CODE;
      }
    }
    if (gubExplicitEnemyEncounterCode != Enum164.NO_ENCOUNTER_CODE) {
      // Set up the location as well as turning on the blit flag.
      gubPBSectorX = gWorldSectorX;
      gubPBSectorY = gWorldSectorY;
      gubPBSectorZ = gbWorldSectorZ;
      gfBlitBattleSectorLocator = true;
    }
  }
}

function ClearNonPersistantPBIInfo(): void {
  gfBlitBattleSectorLocator = false;
}

function PutNonSquadMercsInBattleSectorOnSquads(fExitVehicles: boolean): void {
  let pGroup: Pointer<GROUP>;
  let pNextGroup: Pointer<GROUP>;

  // IMPORTANT: Have to do this by group, so everyone inside vehicles gets assigned to the same squad.  Needed for
  // the tactical placement interface to work in case of simultaneous multi-vehicle arrivals!

  pGroup = gpGroupList;
  while (pGroup) {
    // store ptr to next group in list, temporary groups will get deallocated as soon as the merc in it is put on a squad!
    pNextGroup = pGroup.value.next;

    if (PlayerGroupInvolvedInThisCombat(pGroup)) {
      // the helicopter group CAN be involved, if it's on the ground, in which case everybody must get out of it
      if (IsGroupTheHelicopterGroup(pGroup)) {
        // only happens if chopper is on the ground...
        Assert(!fHelicopterIsAirBorne);

        // put anyone in it into movement group
        MoveAllInHelicopterToFootMovementGroup();
      } else {
        PutNonSquadMercsInPlayerGroupOnSquads(pGroup, fExitVehicles);
      }
    }

    pGroup = pNextGroup;
  }
}

function PutNonSquadMercsInPlayerGroupOnSquads(pGroup: Pointer<GROUP>, fExitVehicles: boolean): void {
  let pPlayer: Pointer<PLAYERGROUP>;
  let pNextPlayer: Pointer<PLAYERGROUP>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bUniqueVehicleSquad: INT8 = -1;
  let fSuccess: boolean;

  if (pGroup.value.fVehicle) {
    // put these guys on their own squad (we need to return their group ID, and can only return one, so they need a unique one
    bUniqueVehicleSquad = GetFirstEmptySquad();
    if (bUniqueVehicleSquad == -1) {
      return;
    }
  }

  pPlayer = pGroup.value.pPlayerList;

  while (pPlayer) {
    pSoldier = pPlayer.value.pSoldier;
    Assert(pSoldier);

    // store ptr to next soldier in group, once removed from group, his info will get memfree'd!
    pNextPlayer = pPlayer.value.next;

    if (pSoldier.value.bActive && pSoldier.value.bLife && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
      // if involved, but off-duty (includes mercs inside vehicles!)
      if (PlayerMercInvolvedInThisCombat(pSoldier) && (pSoldier.value.bAssignment >= Enum117.ON_DUTY)) {
        // if in a vehicle, pull him out
        if (pSoldier.value.bAssignment == Enum117.VEHICLE) {
          if (fExitVehicles) {
            TakeSoldierOutOfVehicle(pSoldier);

            // put them on the unique squad assigned to people leaving this vehicle.  Can't add them to existing squads,
            // because if this is a simultaneous group attack, the mercs could be coming from different sides, and the
            // placement screen can't handle mercs on the same squad arriving from difference edges!
            fSuccess = AddCharacterToSquad(pSoldier, bUniqueVehicleSquad);
          }
        } else {
          // add him to ANY on duty foot squad
          fSuccess = AddCharacterToAnySquad(pSoldier);
        }

        // it better work...
        Assert(fSuccess);

        // clear any desired squad assignments
        pSoldier.value.ubNumTraversalsAllowedToMerge = 0;
        pSoldier.value.ubDesiredSquadAssignment = NO_ASSIGNMENT;

        // stand him up
        MakeSoldiersTacticalAnimationReflectAssignment(pSoldier);
      }
    }

    pPlayer = pNextPlayer;
  }
}

export function WakeUpAllMercsInSectorUnderAttack(): void {
  let iCounter: INT32 = 0;
  let iNumberOfMercsOnTeam: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // get number of possible grunts on team
  iNumberOfMercsOnTeam = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // any mercs not on duty should be added to the first avail squad
  for (iCounter = 0; iCounter < iNumberOfMercsOnTeam; iCounter++) {
    pSoldier = addressof(Menptr[iCounter]);

    if (pSoldier.value.bActive && pSoldier.value.bLife && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
      // if involved, but asleep
      if (PlayerMercInvolvedInThisCombat(pSoldier) && (pSoldier.value.fMercAsleep == true)) {
        // FORCE him wake him up
        SetMercAwake(pSoldier, false, true);
      }
    }
  }
}

// we are entering the sector, clear out all mvt orders for grunts
function ClearMovementForAllInvolvedPlayerGroups(): void {
  let pGroup: Pointer<GROUP>;

  pGroup = gpGroupList;
  while (pGroup) {
    if (PlayerGroupInvolvedInThisCombat(pGroup)) {
      // clear their strategic movement (mercpaths and waypoints)
      ClearMercPathsAndWaypointsForAllInGroup(pGroup);
    }
    pGroup = pGroup.value.next;
  }
}

export function RetreatAllInvolvedPlayerGroups(): void {
  let pGroup: Pointer<GROUP>;

  // make sure guys stop their off duty assignments, like militia training!
  // but don't exit vehicles - drive off in them!
  PutNonSquadMercsInBattleSectorOnSquads(false);

  pGroup = gpGroupList;
  while (pGroup) {
    if (PlayerGroupInvolvedInThisCombat(pGroup)) {
      // don't retreat empty vehicle groups!
      if (!pGroup.value.fVehicle || (pGroup.value.fVehicle && DoesVehicleGroupHaveAnyPassengers(pGroup))) {
        ClearMercPathsAndWaypointsForAllInGroup(pGroup);
        RetreatGroupToPreviousSector(pGroup);
      }
    }
    pGroup = pGroup.value.next;
  }
}

export function PlayerMercInvolvedInThisCombat(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  Assert(pSoldier);
  Assert(pSoldier.value.bActive);

  if (!pSoldier.value.fBetweenSectors && pSoldier.value.bAssignment != Enum117.IN_TRANSIT && pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW && pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) &&
      // Robot is involved if it has a valid controller with it, uninvolved otherwise
      (!AM_A_ROBOT(pSoldier) || (pSoldier.value.ubRobotRemoteHolderID != NOBODY)) && !SoldierAboardAirborneHeli(pSoldier)) {
    if (CurrentBattleSectorIs(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ)) {
      // involved
      return true;
    }
  }

  // not involved
  return false;
}

export function PlayerGroupInvolvedInThisCombat(pGroup: Pointer<GROUP>): boolean {
  Assert(pGroup);

  // player group, non-empty, not between sectors, in the right sector, isn't a group of in transit, dead, or POW mercs,
  // and either not the helicopter group, or the heli is on the ground
  if (pGroup.value.fPlayer && pGroup.value.ubGroupSize && !pGroup.value.fBetweenSectors && !GroupHasInTransitDeadOrPOWMercs(pGroup) && (!IsGroupTheHelicopterGroup(pGroup) || !fHelicopterIsAirBorne)) {
    if (CurrentBattleSectorIs(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ)) {
      // involved
      return true;
    }
  }

  // not involved
  return false;
}

function CurrentBattleSectorIs(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): boolean {
  let sBattleSectorX: INT16;
  let sBattleSectorY: INT16;
  let sBattleSectorZ: INT16;
  let fSuccess: boolean;

  fSuccess = GetCurrentBattleSectorXYZ(addressof(sBattleSectorX), addressof(sBattleSectorY), addressof(sBattleSectorZ));
  Assert(fSuccess);

  if ((sSectorX == sBattleSectorX) && (sSectorY == sBattleSectorY) && (sSectorZ == sBattleSectorZ)) {
    // yup!
    return true;
  } else {
    // wrong sector, no battle here
    return false;
  }
}

function CheckForRobotAndIfItsControlled(): void {
  let i: INT32;

  // search for the robot on player's team
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife && AM_A_ROBOT(MercPtrs[i])) {
      // check whether it has a valid controller with it. This sets its ubRobotRemoteHolderID field.
      UpdateRobotControllerGivenRobot(MercPtrs[i]);

      // if he has a controller, set controllers
      if (MercPtrs[i].value.ubRobotRemoteHolderID != NOBODY) {
        UpdateRobotControllerGivenController(MercPtrs[MercPtrs[i].value.ubRobotRemoteHolderID]);
      }

      break;
    }
  }
}

export function LogBattleResults(ubVictoryCode: UINT8): void {
  let sSectorX: INT16;
  let sSectorY: INT16;
  let sSectorZ: INT16;
  GetCurrentBattleSectorXYZ(addressof(sSectorX), addressof(sSectorY), addressof(sSectorZ));
  if (ubVictoryCode == Enum165.LOG_VICTORY) {
    switch (gubEnemyEncounterCode) {
      case Enum164.ENEMY_INVASION_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_DEFENDEDTOWNSECTOR, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.ENEMY_ENCOUNTER_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_WONBATTLE, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.ENEMY_AMBUSH_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_WIPEDOUTENEMYAMBUSH, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.ENTERING_ENEMY_SECTOR_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_SUCCESSFULATTACK, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.CREATURE_ATTACK_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_CREATURESATTACKED, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.BLOODCAT_AMBUSH_CODE:
      case Enum164.ENTERING_BLOODCAT_LAIR_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_SLAUGHTEREDBLOODCATS, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
    }
  } else {
    switch (gubEnemyEncounterCode) {
      case Enum164.ENEMY_INVASION_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_LOSTTOWNSECTOR, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.ENEMY_ENCOUNTER_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_LOSTBATTLE, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.ENEMY_AMBUSH_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_FATALAMBUSH, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.ENTERING_ENEMY_SECTOR_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_UNSUCCESSFULATTACK, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.CREATURE_ATTACK_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_CREATURESATTACKED, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
      case Enum164.BLOODCAT_AMBUSH_CODE:
      case Enum164.ENTERING_BLOODCAT_LAIR_CODE:
        AddHistoryToPlayersLog(Enum83.HISTORY_KILLEDBYBLOODCATS, 0, GetWorldTotalMin(), sSectorX, sSectorY);
        break;
    }
  }
}

export function HandlePreBattleInterfaceStates(): void {
  if (gfEnteringMapScreenToEnterPreBattleInterface && !gfEnteringMapScreen) {
    gfEnteringMapScreenToEnterPreBattleInterface = false;
    if (!gfUsePersistantPBI) {
      InitPreBattleInterface(null, false);
      gfUsePersistantPBI = true;
    } else {
      InitPreBattleInterface(gpBattleGroup, true);
    }
  } else if (gfDelayAutoResolveStart && gfPreBattleInterfaceActive) {
    gfDelayAutoResolveStart = false;
    gfAutomaticallyStartAutoResolve = true;
  } else if (gfAutomaticallyStartAutoResolve) {
    gfAutomaticallyStartAutoResolve = false;
    ActivateAutomaticAutoResolveStart();
  } else if (gfTransitionMapscreenToAutoResolve) {
    gfTransitionMapscreenToAutoResolve = false;
  }
}

}
