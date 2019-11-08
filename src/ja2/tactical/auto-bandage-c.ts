namespace ja2 {

// max number of merc faces per row in autobandage box
const NUMBER_MERC_FACES_AUTOBANDAGE_BOX = 4;

let sAutoBandageString: string /* STR16 */ = null;
let giBoxId: INT32 = -1;
let gusTextBoxWidth: UINT16 = 0;
let gusTextBoxHeight: UINT16 = 0;
let gfBeginningAutoBandage: boolean = false;
let gsX: INT16 = 0;
let gsY: INT16 = 0;
let guiAutoBandageSeconds: UINT32 = 0;
let fAutoBandageComplete: boolean = false;
let fEndAutoBandage: boolean = false;

export let gfAutoBandageFailed: boolean;

// the button and associated image for ending autobandage
let iEndAutoBandageButton: INT32[] /* [2] */;
let iEndAutoBandageButtonImage: INT32[] /* [2] */;

let gAutoBandageRegion: MOUSE_REGION = createMouseRegion();

// the lists of the doctor and patient
let iDoctorList: INT32[] /* [MAX_CHARACTER_COUNT] */;
let iPatientList: INT32[] /* [MAX_CHARACTER_COUNT] */;

// faces for update panel
let giAutoBandagesSoldierFaces: INT32[] /* [2 * MAX_CHARACTER_COUNT] */;

// has the button for autobandage end been setup yet
let fAutoEndBandageButtonCreated: boolean = false;

export function BeginAutoBandage(): void {
  let cnt: INT32;
  let fFoundAGuy: boolean = false;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fFoundAMedKit: boolean = false;

  // If we are in combat, we con't...
  if ((gTacticalStatus.uiFlags & INCOMBAT) || (NumEnemyInSector() != 0)) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, Message[Enum334.STR_SECTOR_NOT_CLEARED], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
    return;
  }

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  // check for anyone needing bandages
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // if the soldier isn't active or in sector, we have problems..leave
    if (!(pSoldier.value.bActive) || !(pSoldier.value.bInSector) || (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.value.bAssignment == Enum117.VEHICLE)) {
      continue;
    }

    // can this character be helped out by a teammate?
    if (CanCharacterBeAutoBandagedByTeammate(pSoldier) == true) {
      fFoundAGuy = true;
      if (fFoundAGuy && fFoundAMedKit) {
        break;
      }
    }
    if (FindObjClass(pSoldier, IC_MEDKIT) != NO_SLOT) {
      fFoundAMedKit = true;
      if (fFoundAGuy && fFoundAMedKit) {
        break;
      }
    }
  }

  if (!fFoundAGuy) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.AUTOBANDAGE_NOT_NEEDED], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
  } else if (!fFoundAMedKit) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzLateLocalizedString[9], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
  } else {
    if (!CanAutoBandage(false)) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.CANT_AUTOBANDAGE_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
    } else {
      // Confirm if we want to start or not....
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.BEGIN_AUTOBANDAGE_PROMPT_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, BeginAutoBandageCallBack, null);
    }
  }
}

export function HandleAutoBandagePending(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // OK, if we have a pending autobandage....
  // check some conditions
  if (gTacticalStatus.fAutoBandagePending) {
    // All dailogue done, music, etc...
    // if ( gubMusicMode != MUSIC_TACTICAL_VICTORY && DialogueQueueIsEmpty( ) )
    if (!DialogueQueueIsEmpty()) {
      return;
    }

    // If there is no actively talking guy...
    if (gpCurrentTalkingFace != null) {
      return;
    }

    // Do any guys have pending actions...?
    cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier++) {
      // Are we in sector?
      if (pSoldier.value.bActive) {
        if (pSoldier.value.sSectorX == gWorldSectorX && pSoldier.value.sSectorY == gWorldSectorY && pSoldier.value.bSectorZ == gbWorldSectorZ && !pSoldier.value.fBetweenSectors) {
          if (pSoldier.value.ubPendingAction != NO_PENDING_ACTION) {
            return;
          }
        }
      }
    }

    // Do was have any menus up?
    if (AreWeInAUIMenu()) {
      return;
    }

    // If here, all's a go!
    gTacticalStatus.fAutoBandagePending = false;
    BeginAutoBandage();
  }
}

export function SetAutoBandagePending(fSet: boolean): void {
  gTacticalStatus.fAutoBandagePending = fSet;
}

// Should we ask buddy ti auto bandage...?
export function ShouldBeginAutoBandage(): void {
  // If we are in combat, we con't...
  if (gTacticalStatus.uiFlags & INCOMBAT) {
    return;
  }

  // ATE: If not in endgame
  if ((gTacticalStatus.uiFlags & IN_DEIDRANNA_ENDGAME)) {
    return;
  }

  if (CanAutoBandage(false)) {
    // OK, now setup as a pending event...
    SetAutoBandagePending(true);
  }
}

export function HandleAutoBandage(): boolean {
  let InputEvent: InputAtom = createInputAtom();

  if (gTacticalStatus.fAutoBandageMode) {
    if (gfBeginningAutoBandage) {
      // Shadow area
      ShadowVideoSurfaceRect(FRAME_BUFFER, 0, 0, 640, 480);
      InvalidateScreen();
      RefreshScreen(null);
    }

    DisplayAutoBandageUpdatePanel();

    // RenderMercPopUpBoxFromIndex( giBoxId, gsX, gsY,  FRAME_BUFFER );

    // InvalidateRegion( gsX, gsY, gsX + gusTextBoxWidth, gsY + gusTextBoxHeight );

    EndFrameBufferRender();

    // Handle strategic engine
    HandleStrategicTurn();

    HandleTeamServices(OUR_TEAM);

    if (guiAutoBandageSeconds <= 120) {
      guiAutoBandageSeconds += 5;
    }

    // Execute Tactical Overhead
    ExecuteOverhead();

    // Deque all game events
    DequeAllGameEvents(true);

    while (DequeueEvent(addressof(InputEvent)) == true) {
      if (InputEvent.usEvent == KEY_UP) {
        if (((InputEvent.usParam == ESC) && (fAutoBandageComplete == false)) || (((InputEvent.usParam == ENTER) || (InputEvent.usParam == SPACE)) && (fAutoBandageComplete == true))) {
          AutoBandage(false);
        }
      }
    }

    gfBeginningAutoBandage = false;

    if (fEndAutoBandage) {
      AutoBandage(false);
      fEndAutoBandage = false;
    }

    return true;
  }

  return false;
}

function CreateAutoBandageString(): boolean {
  let cnt: INT32;
  let ubDoctor: UINT8[] /* [20] */;
  let ubDoctors: UINT8 = 0;
  let uiDoctorNameStringLength: UINT32 = 1; // for end-of-string character
  let sTemp: string /* STR16 */;
  let pSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE && !(pSoldier.value.bCollapsed) && pSoldier.value.bMedical > 0 && FindObjClass(pSoldier, IC_MEDKIT) != NO_SLOT) {
      ubDoctor[ubDoctors] = pSoldier.value.ubID;
      ubDoctors++;
      // increase the length of the string by the size of the name
      // plus 2, one for the comma and one for the space after that
      uiDoctorNameStringLength += pSoldier.value.name.length + 2;
    }
  }
  if (ubDoctors == 0) {
    return false;
  }

  if (ubDoctors == 1) {
    uiDoctorNameStringLength += Message[Enum334.STR_IS_APPLYING_FIRST_AID].length;
  } else {
    uiDoctorNameStringLength += Message[Enum334.STR_ARE_APPLYING_FIRST_AID].length;
  }

  sAutoBandageString = MemRealloc(sAutoBandageString, uiDoctorNameStringLength * sizeof(CHAR16));
  if (!sAutoBandageString) {
    return false;
  }

  if (ubDoctors == 1) {
    sAutoBandageString = swprintf(Message[Enum334.STR_IS_APPLYING_FIRST_AID], MercPtrs[ubDoctor[0]].value.name);
  } else {
    // make a temporary string to hold most of the doctors names joined by commas
    sTemp = MemAlloc(uiDoctorNameStringLength * sizeof(CHAR16));
    //	sTemp = MemAlloc( 1000 );
    if (!sTemp) {
      return false;
    }
    sTemp = "";
    for (cnt = 0; cnt < ubDoctors - 1; cnt++) {
      sTemp += MercPtrs[ubDoctor[cnt]].value.name;
      if (ubDoctors > 2) {
        if (cnt == ubDoctors - 2) {
          sTemp += ",";
        } else {
          sTemp += ", ";
        }
      }
    }
    sAutoBandageString = swprintf(Message[Enum334.STR_ARE_APPLYING_FIRST_AID], sTemp, MercPtrs[ubDoctor[ubDoctors - 1]].value.name);
    MemFree(sTemp);
  }
  return true;
}

export function SetAutoBandageComplete(): void {
  // this will set the fact autobandage is complete
  fAutoBandageComplete = true;

  return;
}

export function AutoBandage(fStart: boolean): void {
  let aRect: SGPRect = createSGPRect();
  let ubLoop: UINT8;
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (fStart) {
    gTacticalStatus.fAutoBandageMode = true;
    gTacticalStatus.uiFlags |= OUR_MERCS_AUTO_MOVE;

    gfAutoBandageFailed = false;

    // ste up the autobandage panel
    SetUpAutoBandageUpdatePanel();

    // Lock UI!
    // guiPendingOverrideEvent = LU_BEGINUILOCK;
    HandleTacticalUI();

    PauseGame();
    // Compress time...
    // SetGameTimeCompressionLevel( TIME_COMPRESS_5MINS );

    cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier++) {
      if (pSoldier.value.bActive) {
        pSoldier.value.bSlotItemTakenFrom = NO_SLOT;
        pSoldier.value.ubAutoBandagingMedic = NOBODY;
      }
    }

    ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "Begin auto bandage.");

    if (CreateAutoBandageString()) {
      giBoxId = PrepareMercPopupBox(-1, Enum324.DIALOG_MERC_POPUP_BACKGROUND, Enum325.DIALOG_MERC_POPUP_BORDER, sAutoBandageString, 200, 40, 10, 30, addressof(gusTextBoxWidth), addressof(gusTextBoxHeight));
    }

    aRect.iTop = 0;
    aRect.iLeft = 0;
    aRect.iBottom = INV_INTERFACE_START_Y;
    aRect.iRight = 640;

    // Determine position ( centered in rect )
    gsX = ((((aRect.iRight - aRect.iLeft) - gusTextBoxWidth) / 2) + aRect.iLeft);
    gsY = ((((aRect.iBottom - aRect.iTop) - gusTextBoxHeight) / 2) + aRect.iTop);

    // build a mask
    MSYS_DefineRegion(addressof(gAutoBandageRegion), 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 1, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

    gfBeginningAutoBandage = true;
  } else {
    gTacticalStatus.fAutoBandageMode = false;
    gTacticalStatus.uiFlags &= (~OUR_MERCS_AUTO_MOVE);

    // make sure anyone under AI control has their action cancelled
    cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier++) {
      if (pSoldier.value.bActive) {
        ActionDone(pSoldier);
        if (pSoldier.value.bSlotItemTakenFrom != NO_SLOT) {
          // swap our old hand item back to the main hand
          SwapObjs(addressof(pSoldier.value.inv[Enum261.HANDPOS]), addressof(pSoldier.value.inv[pSoldier.value.bSlotItemTakenFrom]));
        }

        // ATE: Mkae everyone stand up!
        if (pSoldier.value.bLife >= OKLIFE && !pSoldier.value.bCollapsed) {
          if (gAnimControl[pSoldier.value.usAnimState].ubHeight != ANIM_STAND) {
            ChangeSoldierStance(pSoldier, ANIM_STAND);
          }
        }
      }
    }

    ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++) {
      ActionDone(MercPtrs[ubLoop]);

      // If anyone is still doing aid animation, stop!
      if (MercPtrs[ubLoop].value.usAnimState == Enum193.GIVING_AID) {
        SoldierGotoStationaryStance(MercPtrs[ubLoop]);
      }
    }

    // UnLock UI!
    guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
    HandleTacticalUI();

    UnPauseGame();
    // Bring time back...
    // SetGameTimeCompressionLevel( TIME_COMPRESS_X1 );

    // Warp game time by the amount of time it took to autobandage.
    WarpGameTime(guiAutoBandageSeconds, Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);

    DestroyTerminateAutoBandageButton();

    // Delete popup!
    RemoveMercPopupBoxFromIndex(giBoxId);
    giBoxId = -1;
    ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "End auto bandage.");

    // build a mask
    MSYS_RemoveRegion(addressof(gAutoBandageRegion));

    // clear faces for auto bandage
    RemoveFacesForAutoBandage();

    SetRenderFlags(RENDER_FLAG_FULL);
    fInterfacePanelDirty = DIRTYLEVEL2;

    if (gfAutoBandageFailed) {
      // inform player some mercs could not be bandaged
      DoScreenIndependantMessageBox(pDoctorWarningString[1], MSG_BOX_FLAG_OK, null);
      gfAutoBandageFailed = false;
    }
  }
  guiAutoBandageSeconds = 0;

  ResetAllMercSpeeds();
}

function BeginAutoBandageCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    fRestoreBackgroundForMessageBox = true;
    AutoBandage(true);
  }
}

function SetUpAutoBandageUpdatePanel(): void {
  let iNumberDoctoring: INT32 = 0;
  let iNumberPatienting: INT32 = 0;
  let iNumberOnTeam: INT32 = 0;
  let iCounterA: INT32 = 0;

  // reset the tables of merc ids
  memset(iDoctorList, -1, sizeof(INT32) * MAX_CHARACTER_COUNT);
  memset(iPatientList, -1, sizeof(INT32) * MAX_CHARACTER_COUNT);

  // grab number of potential grunts on players team
  iNumberOnTeam = gTacticalStatus.Team[gbPlayerNum].bLastID;

  // run through mercs on squad...if they can doctor, add to list
  for (iCounterA = 0; iCounterA < iNumberOnTeam; iCounterA++) {
    if (CanCharacterAutoBandageTeammate(addressof(Menptr[iCounterA]))) {
      // add to list, up the count
      iDoctorList[iNumberDoctoring] = iCounterA;
      iNumberDoctoring++;
    }
  }

  // run through mercs on squad, if they can patient, add to list
  for (iCounterA = 0; iCounterA < iNumberOnTeam; iCounterA++) {
    if (CanCharacterBeAutoBandagedByTeammate(addressof(Menptr[iCounterA]))) {
      // add to list, up the count
      iPatientList[iNumberPatienting] = iCounterA;
      iNumberPatienting++;
    }
  }

  // makes sure there is someone to doctor and patient...
  if ((iNumberDoctoring == 0) || (iNumberPatienting == 0)) {
    // reset the tables of merc ids
    memset(iDoctorList, -1, sizeof(INT32) * MAX_CHARACTER_COUNT);
    memset(iPatientList, -1, sizeof(INT32) * MAX_CHARACTER_COUNT);
  }

  // now add the faces
  AddFacesToAutoBandageBox();

  fAutoBandageComplete = false;

  return;
}

function DisplayAutoBandageUpdatePanel(): void {
  let iNumberDoctors: INT32 = 0;
  let iNumberPatients: INT32 = 0;
  let iNumberDoctorsHigh: INT32 = 0;
  let iNumberPatientsHigh: INT32 = 0;
  let iNumberDoctorsWide: INT32 = 0;
  let iNumberPatientsWide: INT32 = 0;
  let iTotalPixelsHigh: INT32 = 0;
  let iTotalPixelsWide: INT32 = 0;
  let iCurPixelY: INT32 = 0;
  let sXPosition: INT16 = 0;
  let sYPosition: INT16 = 0;
  let hBackGroundHandle: HVOBJECT;
  let iCounterA: INT32 = 0;
  let iCounterB: INT32 = 0;
  let iIndex: INT32 = 0;
  let sCurrentXPosition: INT16 = 0;
  let sCurrentYPosition: INT16 = 0;
  let sString: string /* CHAR16[64] */;
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  // are even in autobandage mode?
  if (gTacticalStatus.fAutoBandageMode == false) {
    // nope,
    return;
  }

  // make sure there is someone to doctor and patient
  if ((iDoctorList[0] == -1) || (iPatientList[0] == -1)) {
    // nope, nobody here
    return;
  }

  // grab number of doctors
  for (iCounterA = 0; iDoctorList[iCounterA] != -1; iCounterA++) {
    iNumberDoctors++;
  }

  // grab number of patients
  for (iCounterA = 0; iPatientList[iCounterA] != -1; iCounterA++) {
    iNumberPatients++;
  }

  // build dimensions of box

  if (iNumberDoctors < NUMBER_MERC_FACES_AUTOBANDAGE_BOX) {
    // nope, get the base amount
    iNumberDoctorsWide = (iNumberDoctors % NUMBER_MERC_FACES_AUTOBANDAGE_BOX);
  } else {
    iNumberDoctorsWide = NUMBER_MERC_FACES_AUTOBANDAGE_BOX;
  }

  // set the min number of mercs
  if (iNumberDoctorsWide < 3) {
    iNumberDoctorsWide = 2;
  } else {
    // a full row
    iNumberDoctorsWide = NUMBER_MERC_FACES_AUTOBANDAGE_BOX;
  }

  // the doctors
  iNumberDoctorsHigh = (iNumberDoctors / (NUMBER_MERC_FACES_AUTOBANDAGE_BOX) + 1);

  if (iNumberDoctors % NUMBER_MERC_FACES_AUTOBANDAGE_BOX) {
    // now the patients
    iNumberDoctorsHigh = (iNumberDoctors / (NUMBER_MERC_FACES_AUTOBANDAGE_BOX) + 1);
  } else {
    // now the patients
    iNumberDoctorsHigh = (iNumberDoctors / (NUMBER_MERC_FACES_AUTOBANDAGE_BOX));
  }

  if (iNumberPatients < NUMBER_MERC_FACES_AUTOBANDAGE_BOX) {
    // nope, get the base amount
    iNumberPatientsWide = (iNumberPatients % NUMBER_MERC_FACES_AUTOBANDAGE_BOX);
  } else {
    iNumberPatientsWide = NUMBER_MERC_FACES_AUTOBANDAGE_BOX;
  }

  // set the min number of mercs
  if (iNumberPatientsWide < 3) {
    iNumberPatientsWide = 2;
  } else {
    // a full row
    iNumberPatientsWide = NUMBER_MERC_FACES_AUTOBANDAGE_BOX;
  }

  if (iNumberPatients % NUMBER_MERC_FACES_AUTOBANDAGE_BOX) {
    // now the patients
    iNumberPatientsHigh = (iNumberPatients / (NUMBER_MERC_FACES_AUTOBANDAGE_BOX) + 1);
  } else {
    // now the patients
    iNumberPatientsHigh = (iNumberPatients / (NUMBER_MERC_FACES_AUTOBANDAGE_BOX));
  }

  // now the actual pixel dimensions

  iTotalPixelsHigh = (iNumberPatientsHigh + iNumberDoctorsHigh) * TACT_UPDATE_MERC_FACE_X_HEIGHT;

  // see which is wider, and set to this
  if (iNumberDoctorsWide > iNumberPatientsWide) {
    iNumberPatientsWide = iNumberDoctorsWide;
  } else {
    iNumberDoctorsWide = iNumberPatientsWide;
  }

  iTotalPixelsWide = TACT_UPDATE_MERC_FACE_X_WIDTH * iNumberDoctorsWide;

  // now get the x and y position for the box
  sXPosition = (640 - iTotalPixelsWide) / 2;
  sYPosition = (INV_INTERFACE_START_Y - iTotalPixelsHigh) / 2;

  // now blit down the background
  GetVideoObject(addressof(hBackGroundHandle), guiUpdatePanelTactical);

  // first the doctors on top
  for (iCounterA = 0; iCounterA < iNumberDoctorsHigh; iCounterA++) {
    for (iCounterB = 0; iCounterB < iNumberDoctorsWide; iCounterB++) {
      sCurrentXPosition = sXPosition + (iCounterB * TACT_UPDATE_MERC_FACE_X_WIDTH);
      sCurrentYPosition = sYPosition + (iCounterA * TACT_UPDATE_MERC_FACE_X_HEIGHT);

      // slap down background piece
      BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 15, sCurrentXPosition, sCurrentYPosition, VO_BLT_SRCTRANSPARENCY, null);

      iIndex = iCounterA * iNumberDoctorsWide + iCounterB;

      if (iDoctorList[iIndex] != -1) {
        sCurrentXPosition += TACT_UPDATE_MERC_FACE_X_OFFSET;
        sCurrentYPosition += TACT_UPDATE_MERC_FACE_Y_OFFSET;

        // there is a face
        RenderSoldierSmallFaceForAutoBandagePanel(iIndex, sCurrentXPosition, sCurrentYPosition);

        // display the mercs name
        sString = swprintf("%s", (Menptr[iDoctorList[iCounterA * iNumberDoctorsWide + iCounterB]]).name);
        FindFontCenterCoordinates((sCurrentXPosition), (sCurrentYPosition), (TACT_UPDATE_MERC_FACE_X_WIDTH - 25), 0, sString, TINYFONT1(), addressof(sX), addressof(sY));
        SetFont(TINYFONT1());
        SetFontForeground(FONT_LTRED);
        SetFontBackground(FONT_BLACK);

        sY += 35;
        sCurrentXPosition -= TACT_UPDATE_MERC_FACE_X_OFFSET;
        sCurrentYPosition -= TACT_UPDATE_MERC_FACE_Y_OFFSET;

        // print name
        mprintf(sX, sY, sString);
        // sCurrentYPosition-= TACT_UPDATE_MERC_FACE_Y_OFFSET;
      }
    }
  }

  for (iCounterB = 0; iCounterB < iNumberPatientsWide; iCounterB++) {
    // slap down background piece
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 16, sXPosition + (iCounterB * TACT_UPDATE_MERC_FACE_X_WIDTH), sCurrentYPosition + (TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 16, sXPosition + (iCounterB * TACT_UPDATE_MERC_FACE_X_WIDTH), sYPosition - 9, VO_BLT_SRCTRANSPARENCY, null);
  }

  // bordering patient title
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 11, sXPosition - 4, sYPosition + ((iNumberDoctorsHigh)*TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 13, sXPosition + iTotalPixelsWide, sYPosition + ((iNumberDoctorsHigh)*TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);

  SetFont(TINYFONT1());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  //	iCurPixelY = sYPosition;
  iCurPixelY = sYPosition + ((iCounterA - 1) * TACT_UPDATE_MERC_FACE_X_HEIGHT);

  sString = swprintf("%s", zMarksMapScreenText[13]);
  FindFontCenterCoordinates((sXPosition), (sCurrentYPosition), (iTotalPixelsWide), 0, sString, TINYFONT1(), addressof(sX), addressof(sY));
  // print medic
  mprintf(sX, sYPosition - 7, sString);

  // DisplayWrappedString( ( INT16 )( sXPosition ),  ( INT16 )( sCurrentYPosition - 40 ), ( INT16 )( iTotalPixelsWide ), 0, TINYFONT1, FONT_WHITE, pUpdateMercStrings[ 0 ], FONT_BLACK, 0, 0 );

  sYPosition += 9;

  // now the patients
  for (iCounterA = 0; iCounterA < iNumberPatientsHigh; iCounterA++) {
    for (iCounterB = 0; iCounterB < iNumberPatientsWide; iCounterB++) {
      sCurrentXPosition = sXPosition + (iCounterB * TACT_UPDATE_MERC_FACE_X_WIDTH);
      sCurrentYPosition = sYPosition + ((iCounterA + iNumberDoctorsHigh) * TACT_UPDATE_MERC_FACE_X_HEIGHT);

      // slap down background piece
      BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 15, sCurrentXPosition, sCurrentYPosition, VO_BLT_SRCTRANSPARENCY, null);

      iIndex = iCounterA * iNumberPatientsWide + iCounterB;

      if (iPatientList[iIndex] != -1) {
        sCurrentXPosition += TACT_UPDATE_MERC_FACE_X_OFFSET;
        sCurrentYPosition += TACT_UPDATE_MERC_FACE_Y_OFFSET;

        // there is a face
        RenderSoldierSmallFaceForAutoBandagePanel(iIndex + iNumberDoctors, sCurrentXPosition, sCurrentYPosition);

        // display the mercs name
        sString = swprintf("%s", (Menptr[iPatientList[iIndex]]).name);
        FindFontCenterCoordinates((sCurrentXPosition), (sCurrentYPosition), (TACT_UPDATE_MERC_FACE_X_WIDTH - 25), 0, sString, TINYFONT1(), addressof(sX), addressof(sY));
        SetFont(TINYFONT1());
        SetFontForeground(FONT_LTRED);
        SetFontBackground(FONT_BLACK);
        sY += 35;

        // print name
        mprintf(sX, sY, sString);
      }
    }
  }

  // BORDER PIECES!!!!

  // bordering patients squares
  for (iCounterA = 0; iCounterA < iNumberPatientsHigh; iCounterA++) {
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 3, sXPosition - 4, sYPosition + ((iCounterA + iNumberDoctorsHigh) * TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 5, sXPosition + iTotalPixelsWide, sYPosition + ((iCounterA + iNumberDoctorsHigh) * TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
  }

  // back up 11 pixels
  sYPosition -= 9;

  // pieces bordering doctor squares
  for (iCounterA = 0; iCounterA < iNumberDoctorsHigh; iCounterA++) {
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 3, sXPosition - 4, sYPosition + ((iCounterA)*TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 5, sXPosition + iTotalPixelsWide, sYPosition + ((iCounterA)*TACT_UPDATE_MERC_FACE_X_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
  }

  // bordering doctor title
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 11, sXPosition - 4, sYPosition - 9, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 13, sXPosition + iTotalPixelsWide, sYPosition - 9, VO_BLT_SRCTRANSPARENCY, null);

  // now the top pieces
  for (iCounterA = 0; iCounterA < iNumberPatientsWide; iCounterA++) {
    // the top bottom
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 1, sXPosition + TACT_UPDATE_MERC_FACE_X_WIDTH * (iCounterA), sYPosition - 13, VO_BLT_SRCTRANSPARENCY, null);
  }

  // the top corners
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 0, sXPosition - 4, sYPosition - 13, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 2, sXPosition + iTotalPixelsWide, sYPosition - 13, VO_BLT_SRCTRANSPARENCY, null);

  iTotalPixelsHigh += 9;

  // the bottom
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 17, sXPosition - 4, sYPosition + iTotalPixelsHigh, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 18, sXPosition + iTotalPixelsWide - TACT_UPDATE_MERC_FACE_X_WIDTH, sYPosition + iTotalPixelsHigh, VO_BLT_SRCTRANSPARENCY, null);

  if (iNumberPatientsWide == 2) {
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 6, sXPosition - 4, sYPosition + iTotalPixelsHigh, VO_BLT_SRCTRANSPARENCY, null);
    CreateTerminateAutoBandageButton((sXPosition), (sYPosition + iTotalPixelsHigh + 3));
  } else {
    BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 6, sXPosition + TACT_UPDATE_MERC_FACE_X_WIDTH - 4, sYPosition + iTotalPixelsHigh, VO_BLT_SRCTRANSPARENCY, null);
    CreateTerminateAutoBandageButton((sXPosition + TACT_UPDATE_MERC_FACE_X_WIDTH), (sYPosition + iTotalPixelsHigh + 3));
  }

  SetFont(TINYFONT1());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  sString = swprintf("%s", zMarksMapScreenText[14]);
  FindFontCenterCoordinates((sXPosition), (sCurrentYPosition), (iTotalPixelsWide), 0, sString, TINYFONT1(), addressof(sX), addressof(sY));
  // print patient
  mprintf(sX, iCurPixelY + (TACT_UPDATE_MERC_FACE_X_HEIGHT) + 2, sString);

  MarkAButtonDirty(iEndAutoBandageButton[0]);
  MarkAButtonDirty(iEndAutoBandageButton[1]);

  DrawButton(iEndAutoBandageButton[0]);
  DrawButton(iEndAutoBandageButton[1]);

  iTotalPixelsHigh += 35;

  // if autobandage is complete, set the fact by enabling the done button
  if (fAutoBandageComplete == false) {
    DisableButton(iEndAutoBandageButton[0]);
    EnableButton(iEndAutoBandageButton[1]);
  } else {
    DisableButton(iEndAutoBandageButton[1]);
    EnableButton(iEndAutoBandageButton[0]);
  }

  // now make sure it goes to the screen
  InvalidateRegion(sXPosition - 4, sYPosition - 18, (sXPosition + iTotalPixelsWide + 4), (sYPosition + iTotalPixelsHigh));

  return;
}

function CreateTerminateAutoBandageButton(sX: INT16, sY: INT16): void {
  // create the kill autobandage button
  if (fAutoEndBandageButtonCreated) {
    // button created, leave
    return;
  }

  fAutoEndBandageButtonCreated = true;

  // the continue button

  // grab the image
  iEndAutoBandageButtonImage[0] = LoadButtonImage("INTERFACE\\group_confirm_tactical.sti", -1, 7, -1, 8, -1);

  // grab the button
  iEndAutoBandageButton[0] = QuickCreateButton(iEndAutoBandageButtonImage[0], sX, sY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, StopAutoBandageButtonCallback);

  // the cancel button
  // grab the image
  iEndAutoBandageButtonImage[1] = LoadButtonImage("INTERFACE\\group_confirm_tactical.sti", -1, 7, -1, 8, -1);

  // grab the button
  iEndAutoBandageButton[1] = QuickCreateButton(iEndAutoBandageButtonImage[1], (sX + 70), sY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, StopAutoBandageButtonCallback);

  SpecifyButtonText(iEndAutoBandageButton[0], zMarksMapScreenText[15]);
  SpecifyButtonFont(iEndAutoBandageButton[0], MAP_SCREEN_FONT());
  SpecifyButtonUpTextColors(iEndAutoBandageButton[0], FONT_MCOLOR_BLACK, FONT_BLACK);
  SpecifyButtonDownTextColors(iEndAutoBandageButton[0], FONT_MCOLOR_BLACK, FONT_BLACK);

  SpecifyButtonText(iEndAutoBandageButton[1], zMarksMapScreenText[16]);
  SpecifyButtonFont(iEndAutoBandageButton[1], MAP_SCREEN_FONT());
  SpecifyButtonUpTextColors(iEndAutoBandageButton[1], FONT_MCOLOR_BLACK, FONT_BLACK);
  SpecifyButtonDownTextColors(iEndAutoBandageButton[1], FONT_MCOLOR_BLACK, FONT_BLACK);

  return;
}

function StopAutoBandageButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fEndAutoBandage = true;
    }
  }

  return;
}

function DestroyTerminateAutoBandageButton(): void {
  // destroy the kill autobandage button
  if (fAutoEndBandageButtonCreated == false) {
    // not around, don't destroy what ain't there
    return;
  }

  fAutoEndBandageButtonCreated = false;

  // remove button
  RemoveButton(iEndAutoBandageButton[0]);
  RemoveButton(iEndAutoBandageButton[1]);

  // unload image
  UnloadButtonImage(iEndAutoBandageButtonImage[0]);
  UnloadButtonImage(iEndAutoBandageButtonImage[1]);

  return;
}

function AddFacesToAutoBandageBox(): boolean {
  let iCounter: INT32 = 0;
  let iNumberOfDoctors: INT32 = 0;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // reset
  memset(addressof(giAutoBandagesSoldierFaces), -1, 2 * MAX_CHARACTER_COUNT);

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // find a free slot
    if (iDoctorList[iCounter] != -1) {
      if (gMercProfiles[(Menptr[iDoctorList[iCounter]]).ubProfile].ubFaceIndex < 100) {
        // grab filename of face
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%02d.sti", gMercProfiles[(Menptr[iDoctorList[iCounter]]).ubProfile].ubFaceIndex);
      } else {
        // grab filename of face
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%03d.sti", gMercProfiles[(Menptr[iDoctorList[iCounter]]).ubProfile].ubFaceIndex);
      }

      // load the face
      AddVideoObject(addressof(VObjectDesc), addressof(giAutoBandagesSoldierFaces[iCounter]));
      iNumberOfDoctors++;
    }
  }

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // find a free slot
    if (iPatientList[iCounter] != -1) {
      if (gMercProfiles[(Menptr[iPatientList[iCounter]]).ubProfile].ubFaceIndex < 100) {
        // grab filename of face
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%02d.sti", gMercProfiles[(Menptr[iPatientList[iCounter]]).ubProfile].ubFaceIndex);
      } else {
        // grab filename of face
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%03d.sti", gMercProfiles[(Menptr[iPatientList[iCounter]]).ubProfile].ubFaceIndex);
      }

      // load the face
      AddVideoObject(addressof(VObjectDesc), addressof(giAutoBandagesSoldierFaces[iCounter + iNumberOfDoctors]));
    }
  }

  // grab panels
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "Interface\\panels.sti";
  if (!AddVideoObject(addressof(VObjectDesc), addressof(giMercPanelImage))) {
    AssertMsg(0, "Failed to load Interface\\panels.sti");
  }

  return true;
}

function RemoveFacesForAutoBandage(): boolean {
  let iCounter: INT32 = 0;
  let iNumberOfDoctors: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // find a free slot
    if (iDoctorList[iCounter] != -1) {
      // load the face
      DeleteVideoObjectFromIndex(giAutoBandagesSoldierFaces[iCounter]);
      iNumberOfDoctors++;
    }
  }

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // find a free slot
    if (iPatientList[iCounter] != -1) {
      // load the face
      DeleteVideoObjectFromIndex(giAutoBandagesSoldierFaces[iCounter + iNumberOfDoctors]);
    }
  }

  DeleteVideoObjectFromIndex(giMercPanelImage);

  return true;
}

function RenderSoldierSmallFaceForAutoBandagePanel(iIndex: INT32, sCurrentXPosition: INT16, sCurrentYPosition: INT16): boolean {
  let iStartY: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let iCounter: INT32 = 0;
  let iIndexCount: INT32 = 0;
  let hHandle: HVOBJECT;

  // grab the video object
  GetVideoObject(addressof(hHandle), giAutoBandagesSoldierFaces[iIndex]);

  // fill the background for the info bars black
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 36, sCurrentYPosition + 2, sCurrentXPosition + 44, sCurrentYPosition + 30, 0);

  // put down the background
  BltVideoObjectFromIndex(FRAME_BUFFER, giMercPanelImage, 0, sCurrentXPosition, sCurrentYPosition, VO_BLT_SRCTRANSPARENCY, null);

  // grab the face
  BltVideoObject(FRAME_BUFFER, hHandle, 0, sCurrentXPosition + 2, sCurrentYPosition + 2, VO_BLT_SRCTRANSPARENCY, null);

  for (iCounter = 0; iCounter < MAX_CHARACTER_COUNT; iCounter++) {
    // find a free slot
    if (iDoctorList[iCounter] != -1) {
      iIndexCount++;
    }
  }

  // see if we are looking into doctor or patient lists?
  if (iIndexCount > iIndex) {
    // HEALTH BAR
    pSoldier = addressof(Menptr[iDoctorList[iIndex]]);
  } else {
    // HEALTH BAR
    pSoldier = addressof(Menptr[iPatientList[iIndex - iIndexCount]]);
  }

  // is the merc alive?
  if (!pSoldier.value.bLife)
    return false;

  // yellow one for bleeding
  iStartY = sCurrentYPosition + 29 - 27 * pSoldier.value.bLifeMax / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 36, iStartY, sCurrentXPosition + 37, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(107, 107, 57)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 37, iStartY, sCurrentXPosition + 38, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(222, 181, 115)));

  // pink one for bandaged.
  iStartY += 27 * pSoldier.value.bBleeding / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 36, iStartY, sCurrentXPosition + 37, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(156, 57, 57)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 37, iStartY, sCurrentXPosition + 38, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(222, 132, 132)));

  // red one for actual health
  iStartY = sCurrentYPosition + 29 - 27 * pSoldier.value.bLife / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 36, iStartY, sCurrentXPosition + 37, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(107, 8, 8)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 37, iStartY, sCurrentXPosition + 38, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(206, 0, 0)));

  // BREATH BAR
  iStartY = sCurrentYPosition + 29 - 27 * pSoldier.value.bBreathMax / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 39, iStartY, sCurrentXPosition + 40, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(8, 8, 132)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 40, iStartY, sCurrentXPosition + 41, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(8, 8, 107)));

  // MORALE BAR
  iStartY = sCurrentYPosition + 29 - 27 * pSoldier.value.bMorale / 100;
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 42, iStartY, sCurrentXPosition + 43, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(8, 156, 8)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, sCurrentXPosition + 43, iStartY, sCurrentXPosition + 44, sCurrentYPosition + 29, Get16BPPColor(FROMRGB(8, 107, 8)));

  return true;
}

}
