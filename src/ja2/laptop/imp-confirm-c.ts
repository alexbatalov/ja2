namespace ja2 {

const IMP_MERC_FILE = "IMP.dat";

let giIMPConfirmButton: UINT32[] /* [2] */;
let giIMPConfirmButtonImage: UINT32[] /* [2] */;
let fNoAlreadySelected: boolean = false;
let uiEyeXPositions: UINT16[] /* [] */ = [
  8,
  9,
  8,
  6,
  13,
  11,
  8,
  8,
  4, // 208
  5, // 209
  7,
  5, // 211
  7,
  11,
  8, // 214
  5,
];

let uiEyeYPositions: UINT16[] /* [] */ = [
  5,
  4,
  5,
  6,
  5,
  5,
  4,
  4,
  4, // 208
  5,
  5, // 210
  7,
  6, // 212
  5,
  5, // 214
  6,
];

let uiMouthXPositions: UINT16[] /* [] */ = [
  8,
  9,
  7,
  7,
  11,
  10,
  8,
  8,
  5, // 208
  6,
  7, // 210
  6,
  7, // 212
  9,
  7, // 214
  5,
];

let uiMouthYPositions: UINT16[] /* [] */ = [
  21,
  23,
  24,
  25,
  23,
  24,
  24,
  24,
  25, // 208
  24,
  24, // 210
  26,
  24, // 212
  23,
  24, // 214
  26,
];

export let fLoadingCharacterForPreviousImpProfile: boolean = false;

export function EnterIMPConfirm(): void {
  // create buttons
  CreateConfirmButtons();
  return;
}

export function RenderIMPConfirm(): void {
  // the background
  RenderProfileBackGround();

  // indent
  RenderAvgMercIndentFrame(90, 40);

  // highlight answer
  PrintImpText();

  return;
}

export function ExitIMPConfirm(): void {
  // destroy buttons
  DestroyConfirmButtons();
  return;
}

export function HandleIMPConfirm(): void {
  return;
}

function CreateConfirmButtons(): void {
  // create buttons for confirm screen

  giIMPConfirmButtonImage[0] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  giIMPConfirmButton[0] = CreateIconAndTextButton(giIMPConfirmButtonImage[0], pImpButtonText[16], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (136), LAPTOP_SCREEN_WEB_UL_Y + (254), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPConfirmYes);

  giIMPConfirmButtonImage[1] = LoadButtonImage("LAPTOP\\button_2.sti", -1, 0, -1, 1, -1);
  giIMPConfirmButton[1] = CreateIconAndTextButton(giIMPConfirmButtonImage[1], pImpButtonText[17], FONT12ARIAL(), FONT_WHITE, DEFAULT_SHADOW, FONT_WHITE, DEFAULT_SHADOW, TEXT_CJUSTIFIED, LAPTOP_SCREEN_UL_X + (136), LAPTOP_SCREEN_WEB_UL_Y + (314), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnIMPConfirmNo);

  SetButtonCursor(giIMPConfirmButton[0], Enum317.CURSOR_WWW);
  SetButtonCursor(giIMPConfirmButton[1], Enum317.CURSOR_WWW);

  return;
}

function DestroyConfirmButtons(): void {
  // destroy buttons for confirm screen

  RemoveButton(giIMPConfirmButton[0]);
  UnloadButtonImage(giIMPConfirmButtonImage[0]);

  RemoveButton(giIMPConfirmButton[1]);
  UnloadButtonImage(giIMPConfirmButtonImage[1]);
  return;
}

function AddCharacterToPlayersTeam(): boolean {
  let HireMercStruct: MERC_HIRE_STRUCT = createMercHireStruct();

  // last minute chage to make sure merc with right facehas not only the right body but body specific skills...
  // ie..small mercs have martial arts..but big guys and women don't don't

  HandleMercStatsForChangesInFace();

  memset(addressof(HireMercStruct), 0, sizeof(MERC_HIRE_STRUCT));

  HireMercStruct.ubProfileID = (PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId);

  if (fLoadingCharacterForPreviousImpProfile == false) {
    // give them items
    GiveItemsToPC(HireMercStruct.ubProfileID);
  }

  HireMercStruct.sSectorX = gsMercArriveSectorX;
  HireMercStruct.sSectorY = gsMercArriveSectorY;
  HireMercStruct.fUseLandingZoneForArrival = true;

  HireMercStruct.fCopyProfileItemsOver = true;

  // indefinite contract length
  HireMercStruct.iTotalContractLength = -1;

  HireMercStruct.ubInsertionCode = Enum175.INSERTION_CODE_ARRIVING_GAME;
  HireMercStruct.uiTimeTillMercArrives = GetMercArrivalTimeOfDay();

  SetProfileFaceData(HireMercStruct.ubProfileID, (200 + iPortraitNumber), uiEyeXPositions[iPortraitNumber], uiEyeYPositions[iPortraitNumber], uiMouthXPositions[iPortraitNumber], uiMouthYPositions[iPortraitNumber]);

  // if we succesfully hired the merc
  if (!HireMerc(addressof(HireMercStruct))) {
    return false;
  } else {
    return true;
  }
}

function BtnIMPConfirmYes(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP Homepage About US button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // reset button
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (LaptopSaveInfo.fIMPCompletedFlag) {
        // already here, leave
        return;
      }

      if (LaptopSaveInfo.iCurrentBalance < COST_OF_PROFILE) {
        // not enough
        return;
      }

      // line moved by CJC Nov 28 2002 to AFTER the check for money
      LaptopSaveInfo.fIMPCompletedFlag = true;

      // charge the player
      AddTransactionToPlayersBook(Enum80.IMP_PROFILE, (PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId), GetWorldTotalMin(), -(COST_OF_PROFILE));
      AddHistoryToPlayersLog(Enum83.HISTORY_CHARACTER_GENERATED, 0, GetWorldTotalMin(), -1, -1);
      AddCharacterToPlayersTeam();

      // write the created imp merc
      WriteOutCurrentImpCharacter((PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId));

      fButtonPendingFlag = true;
      iCurrentImpPage = Enum71.IMP_HOME_PAGE;

      // send email notice
      // AddEmail(IMP_EMAIL_PROFILE_RESULTS, IMP_EMAIL_PROFILE_RESULTS_LENGTH, IMP_PROFILE_RESULTS, GetWorldTotalMin( ) );
      AddFutureDayStrategicEvent(Enum132.EVENT_DAY2_ADD_EMAIL_FROM_IMP, 60 * 7, 0, 2);
      // RenderCharProfile( );

      ResetCharacterStats();

      // Display a popup msg box telling the user when and where the merc will arrive
      // DisplayPopUpBoxExplainingMercArrivalLocationAndTime( PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId );

      // reset the id of the last merc so we dont get the DisplayPopUpBoxExplainingMercArrivalLocationAndTime() pop up box in another screen by accident
      LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = -1;
    }
  }
}

// fixed? by CJC Nov 28 2002
function BtnIMPConfirmNo(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // btn callback for IMP Homepage About US button
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      iCurrentImpPage = Enum71.IMP_FINISH;

      /*

      LaptopSaveInfo.fIMPCompletedFlag = FALSE;
      ResetCharacterStats();

      fButtonPendingFlag = TRUE;
      iCurrentImpPage = IMP_HOME_PAGE;
      */
      /*
      if( fNoAlreadySelected == TRUE )
      {
              // already selected no
              fButtonPendingFlag = TRUE;
              iCurrentImpPage = IMP_HOME_PAGE;
      }
fNoAlreadySelected = TRUE;
      */
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    }
  }
}

/*
void BtnIMPConfirmNo( GUI_BUTTON *btn,INT32 reason )
{


        // btn callback for IMP Homepage About US button
        if (!(btn->uiFlags & BUTTON_ENABLED))
                return;

        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                 btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
        {
                if( btn->uiFlags & BUTTON_CLICKED_ON )
                {
                        LaptopSaveInfo.fIMPCompletedFlag = TRUE;
                        if( fNoAlreadySelected == TRUE )
                        {
                                // already selected no
                                fButtonPendingFlag = TRUE;
                                iCurrentImpPage = IMP_HOME_PAGE;
                        }
      fNoAlreadySelected = TRUE;
      btn->uiFlags&=~(BUTTON_CLICKED_ON);
                }
        }
}
*/

const PROFILE_HAS_SKILL_TRAIT = (p, t) => ((p.value.bSkillTrait == t) || (p.value.bSkillTrait2 == t));

function GiveItemsToPC(ubProfileId: UINT8): void {
  let pProfile: Pointer<MERCPROFILESTRUCT>;

  // gives starting items to merc
  // NOTE: Any guns should probably be from those available in regular gun set

  pProfile = addressof(gMercProfiles[ubProfileId]);

  // STANDARD EQUIPMENT

  // kevlar vest, leggings, & helmet
  MakeProfileInvItemThisSlot(pProfile, Enum261.VESTPOS, Enum225.FLAK_JACKET, 100, 1);
  if (PreRandom(100) < pProfile.value.bWisdom) {
    MakeProfileInvItemThisSlot(pProfile, Enum261.HELMETPOS, Enum225.STEEL_HELMET, 100, 1);
  }

  // canteen
  MakeProfileInvItemThisSlot(pProfile, Enum261.SMALLPOCK4POS, Enum225.CANTEEN, 100, 1);

  if (pProfile.value.bMarksmanship >= 80) {
    // good shooters get a better & matching ammo
    MakeProfileInvItemThisSlot(pProfile, Enum261.HANDPOS, Enum225.MP5K, 100, 1);
    MakeProfileInvItemThisSlot(pProfile, Enum261.SMALLPOCK1POS, Enum225.CLIP9_30, 100, 2);
  } else {
    // Automatic pistol, with matching ammo
    MakeProfileInvItemThisSlot(pProfile, Enum261.HANDPOS, Enum225.BERETTA_93R, 100, 1);
    MakeProfileInvItemThisSlot(pProfile, Enum261.SMALLPOCK1POS, Enum225.CLIP9_15, 100, 3);
  }

  // OPTIONAL EQUIPMENT: depends on skills & special skills

  if (pProfile.value.bMedical >= 60) {
    // strong medics get full medic kit
    MakeProfileInvItemAnySlot(pProfile, Enum225.MEDICKIT, 100, 1);
  } else if (pProfile.value.bMedical >= 30) {
    // passable medics get first aid kit
    MakeProfileInvItemAnySlot(pProfile, Enum225.FIRSTAIDKIT, 100, 1);
  }

  if (pProfile.value.bMechanical >= 50) {
    // mechanics get toolkit
    MakeProfileInvItemAnySlot(pProfile, Enum225.TOOLKIT, 100, 1);
  }

  if (pProfile.value.bExplosive >= 50) {
    // loonies get TNT & Detonator
    MakeProfileInvItemAnySlot(pProfile, Enum225.TNT, 100, 1);
    MakeProfileInvItemAnySlot(pProfile, Enum225.DETONATOR, 100, 1);
  }

  // check for special skills
  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.LOCKPICKING) && (iMechanical)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.LOCKSMITHKIT, 100, 1);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.HANDTOHAND)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.BRASS_KNUCKLES, 100, 1);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.ELECTRONICS) && (iMechanical)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.METALDETECTOR, 100, 1);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.NIGHTOPS)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.BREAK_LIGHT, 100, 2);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.THROWING)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.THROWING_KNIFE, 100, 1);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.STEALTHY)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.SILENCER, 100, 1);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.KNIFING)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.COMBAT_KNIFE, 100, 1);
  }

  if (PROFILE_HAS_SKILL_TRAIT(pProfile, Enum269.CAMOUFLAGED)) {
    MakeProfileInvItemAnySlot(pProfile, Enum225.CAMOUFLAGEKIT, 100, 1);
  }
}

function MakeProfileInvItemAnySlot(pProfile: Pointer<MERCPROFILESTRUCT>, usItem: UINT16, ubStatus: UINT8, ubHowMany: UINT8): void {
  let iSlot: INT32;

  iSlot = FirstFreeBigEnoughPocket(pProfile, usItem);

  if (iSlot == -1) {
    // no room, item not received
    return;
  }

  // put the item into that slot
  MakeProfileInvItemThisSlot(pProfile, iSlot, usItem, ubStatus, ubHowMany);
}

function MakeProfileInvItemThisSlot(pProfile: Pointer<MERCPROFILESTRUCT>, uiPos: UINT32, usItem: UINT16, ubStatus: UINT8, ubHowMany: UINT8): void {
  pProfile.value.inv[uiPos] = usItem;
  pProfile.value.bInvStatus[uiPos] = ubStatus;
  pProfile.value.bInvNumber[uiPos] = ubHowMany;
}

function FirstFreeBigEnoughPocket(pProfile: Pointer<MERCPROFILESTRUCT>, usItem: UINT16): INT32 {
  let uiPos: UINT32;

  // if it fits into a small pocket
  if (Item[usItem].ubPerPocket != 0) {
    // check small pockets first
    for (uiPos = Enum261.SMALLPOCK1POS; uiPos <= Enum261.SMALLPOCK8POS; uiPos++) {
      if (pProfile.value.inv[uiPos] == Enum225.NONE) {
        return uiPos;
      }
    }
  }

  // check large pockets
  for (uiPos = Enum261.BIGPOCK1POS; uiPos <= Enum261.BIGPOCK4POS; uiPos++) {
    if (pProfile.value.inv[uiPos] == Enum225.NONE) {
      return uiPos;
    }
  }

  return -1;
}

function WriteOutCurrentImpCharacter(iProfileId: INT32): void {
  // grab the profile number and write out what is contained there in
  let hFile: HWFILE;
  let uiBytesWritten: UINT32 = 0;

  // open the file for writing
  hFile = FileOpen(IMP_MERC_FILE, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);

  // write out the profile id
  if (!FileWrite(hFile, addressof(iProfileId), sizeof(INT32), addressof(uiBytesWritten))) {
    return;
  }

  // write out the portrait id
  if (!FileWrite(hFile, addressof(iPortraitNumber), sizeof(INT32), addressof(uiBytesWritten))) {
    return;
  }

  // write out the profile itself
  if (!FileWrite(hFile, addressof(gMercProfiles[iProfileId]), sizeof(MERCPROFILESTRUCT), addressof(uiBytesWritten))) {
    return;
  }

  // close file
  FileClose(hFile);

  return;
}

function LoadInCurrentImpCharacter(): void {
  let iProfileId: INT32 = 0;
  let hFile: HWFILE;
  let uiBytesRead: UINT32 = 0;

  // open the file for writing
  hFile = FileOpen(IMP_MERC_FILE, FILE_ACCESS_READ, false);

  // valid file?
  if (hFile == -1) {
    return;
  }

  // read in the profile
  if (!FileRead(hFile, addressof(iProfileId), sizeof(INT32), addressof(uiBytesRead))) {
    return;
  }

  // read in the portrait
  if (!FileRead(hFile, addressof(iPortraitNumber), sizeof(INT32), addressof(uiBytesRead))) {
    return;
  }

  // read in the profile
  if (!FileRead(hFile, addressof(gMercProfiles[iProfileId]), sizeof(MERCPROFILESTRUCT), addressof(uiBytesRead))) {
    return;
  }

  // close file
  FileClose(hFile);

  if (LaptopSaveInfo.iCurrentBalance < COST_OF_PROFILE) {
    // not enough
    return;
  }

  // charge the player
  // is the character male?
  fCharacterIsMale = (gMercProfiles[iProfileId].bSex == Enum272.MALE);
  fLoadingCharacterForPreviousImpProfile = true;
  AddTransactionToPlayersBook(Enum80.IMP_PROFILE, 0, GetWorldTotalMin(), -(COST_OF_PROFILE));
  AddHistoryToPlayersLog(Enum83.HISTORY_CHARACTER_GENERATED, 0, GetWorldTotalMin(), -1, -1);
  LaptopSaveInfo.iVoiceId = iProfileId - PLAYER_GENERATED_CHARACTER_ID;
  AddCharacterToPlayersTeam();
  AddFutureDayStrategicEvent(Enum132.EVENT_DAY2_ADD_EMAIL_FROM_IMP, 60 * 7, 0, 2);
  LaptopSaveInfo.fIMPCompletedFlag = true;
  fPausedReDrawScreenFlag = true;
  fLoadingCharacterForPreviousImpProfile = false;

  return;
}

export function ResetIMPCharactersEyesAndMouthOffsets(ubMercProfileID: UINT8): void {
  // ATE: Check boundary conditions!
  if (((gMercProfiles[ubMercProfileID].ubFaceIndex - 200) > 16) || (ubMercProfileID >= Enum268.PROF_HUMMER)) {
    return;
  }

  gMercProfiles[ubMercProfileID].usEyesX = uiEyeXPositions[gMercProfiles[ubMercProfileID].ubFaceIndex - 200];
  gMercProfiles[ubMercProfileID].usEyesY = uiEyeYPositions[gMercProfiles[ubMercProfileID].ubFaceIndex - 200];

  gMercProfiles[ubMercProfileID].usMouthX = uiMouthXPositions[gMercProfiles[ubMercProfileID].ubFaceIndex - 200];
  gMercProfiles[ubMercProfileID].usMouthY = uiMouthYPositions[gMercProfiles[ubMercProfileID].ubFaceIndex - 200];
}

}
