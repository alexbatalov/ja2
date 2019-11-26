namespace ja2 {

const MAX_MEANWHILE_PROFILES = 10;

let gzMeanwhileStr: string[] /* INT8[][30] */ = [
  "End of player's first battle",
  "Drassen Lib. ",
  "Cambria Lib.",
  "Alma Lib.",
  "Grumm lib.",
  "Chitzena Lib.",
  "NW SAM",
  "NE SAM",
  "Central SAM",
  "Flowers",
  "Lost town",
  "Interrogation",
  "Creatures",
  "Kill Chopper",
  "AWOL Madlab",
  "Outskirts Meduna",
  "Balime Lib.",
];

// the snap to grid nos for meanwhile scenes
let gusMeanWhileGridNo: UINT16[] /* [] */ = [
  12248,
  12248,
  12248,
  12248,
  12248,
  12248,
  12248,
  12248,
  12248,
  12248,
  12248,
  8075,
  12248,
  12248,
  12248,
  12248,
  12248,
];

interface NPC_SAVE_INFO {
  ubProfile: UINT8;
  sX: INT16;
  sY: INT16;
  sZ: INT16;
  sGridNo: INT16;
}

function createNpcSaveInfo(): NPC_SAVE_INFO {
  return {
    ubProfile: 0,
    sX: 0,
    sY: 0,
    sZ: 0,
    sGridNo: 0,
  };
}

// BEGIN SERALIZATION
export let gCurrentMeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
export let gMeanwhileDef: MEANWHILE_DEFINITION[] /* [NUM_MEANWHILES] */ = createArrayFrom(Enum160.NUM_MEANWHILES, createMeanwhileDefinition);
export let gfMeanwhileTryingToStart: boolean = false;
export let gfInMeanwhile: boolean = false;
// END SERIALIZATION
let gsOldSectorX: INT16;
let gsOldSectorY: INT16;
let gsOldSectorZ: INT16;
let gsOldSelectedSectorX: INT16;
let gsOldSelectedSectorY: INT16;
let gsOldSelectedSectorZ: INT16;

let guiOldScreen: UINT32;
let gNPCSaveData: NPC_SAVE_INFO[] /* [MAX_MEANWHILE_PROFILES] */ = createArrayFrom(MAX_MEANWHILE_PROFILES, createNpcSaveInfo);
let guiNumNPCSaves: UINT32 = 0;
let gfReloadingScreenFromMeanwhile: boolean = false;
let gsOldCurInterfacePanel: INT16 = 0;
let gfWorldWasLoaded: boolean = false;
let ubCurrentMeanWhileId: UINT8 = 0;

export let uiMeanWhileFlags: UINT32 = 0;

// meanwhile flag defines
const END_OF_PLAYERS_FIRST_BATTLE_FLAG = 0x00000001;
const DRASSEN_LIBERATED_FLAG = 0x00000002;
const CAMBRIA_LIBERATED_FLAG = 0x00000004;
const ALMA_LIBERATED_FLAG = 0x00000008;
const GRUMM_LIBERATED_FLAG = 0x00000010;
const CHITZENA_LIBERATED_FLAG = 0x00000020;
const NW_SAM_FLAG = 0x00000040;
const NE_SAM_FLAG = 0x00000080;
const CENTRAL_SAM_FLAG = 0x00000100;
const FLOWERS_FLAG = 0x00000200;
const LOST_TOWN_FLAG = 0x00000400;
const CREATURES_FLAG = 0x00000800;
const KILL_CHOPPER_FLAG = 0x00001000;
const AWOL_SCIENTIST_FLAG = 0x00002000;
const OUTSKIRTS_MEDUNA_FLAG = 0x00004000;
const INTERROGATION_FLAG = 0x00008000;
const BALIME_LIBERATED_FLAG = 0x00010000;

// set flag for this event
function SetMeanWhileFlag(ubMeanwhileID: UINT8): void {
  switch (ubMeanwhileID) {
    case Enum160.END_OF_PLAYERS_FIRST_BATTLE:
      uiMeanWhileFlags |= END_OF_PLAYERS_FIRST_BATTLE_FLAG;
      break;
    case Enum160.DRASSEN_LIBERATED:
      uiMeanWhileFlags |= DRASSEN_LIBERATED_FLAG;
      break;
    case Enum160.CAMBRIA_LIBERATED:
      uiMeanWhileFlags |= CAMBRIA_LIBERATED_FLAG;
      break;
    case Enum160.ALMA_LIBERATED:
      uiMeanWhileFlags |= ALMA_LIBERATED_FLAG;
      break;
    case Enum160.GRUMM_LIBERATED:
      uiMeanWhileFlags |= GRUMM_LIBERATED_FLAG;
      break;
    case Enum160.CHITZENA_LIBERATED:
      uiMeanWhileFlags |= CHITZENA_LIBERATED_FLAG;
      break;
    case Enum160.BALIME_LIBERATED:
      uiMeanWhileFlags |= BALIME_LIBERATED_FLAG;
      break;
    case Enum160.NW_SAM:
      uiMeanWhileFlags |= NW_SAM_FLAG;
      break;
    case Enum160.NE_SAM:
      uiMeanWhileFlags |= NE_SAM_FLAG;
      break;
    case Enum160.CENTRAL_SAM:
      uiMeanWhileFlags |= CENTRAL_SAM_FLAG;
      break;
    case Enum160.FLOWERS:
      uiMeanWhileFlags |= FLOWERS_FLAG;
      break;
    case Enum160.LOST_TOWN:
      uiMeanWhileFlags |= LOST_TOWN_FLAG;
      break;
    case Enum160.CREATURES:
      uiMeanWhileFlags |= CREATURES_FLAG;
      break;
    case Enum160.KILL_CHOPPER:
      uiMeanWhileFlags |= KILL_CHOPPER_FLAG;
      break;
    case Enum160.AWOL_SCIENTIST:
      uiMeanWhileFlags |= AWOL_SCIENTIST_FLAG;
      break;
    case Enum160.OUTSKIRTS_MEDUNA:
      uiMeanWhileFlags |= OUTSKIRTS_MEDUNA_FLAG;
      break;
    case Enum160.INTERROGATION:
      uiMeanWhileFlags |= INTERROGATION_FLAG;
      break;
  }
}

// is this flag set?
function GetMeanWhileFlag(ubMeanwhileID: UINT8): boolean {
  let uiTrue: UINT32 = 0;
  switch (ubMeanwhileID) {
    case Enum160.END_OF_PLAYERS_FIRST_BATTLE:
      uiTrue = (uiMeanWhileFlags & END_OF_PLAYERS_FIRST_BATTLE_FLAG);
      break;
    case Enum160.DRASSEN_LIBERATED:
      uiTrue = (uiMeanWhileFlags & DRASSEN_LIBERATED_FLAG);
      break;
    case Enum160.CAMBRIA_LIBERATED:
      uiTrue = (uiMeanWhileFlags & CAMBRIA_LIBERATED_FLAG);
      break;
    case Enum160.ALMA_LIBERATED:
      uiTrue = (uiMeanWhileFlags & ALMA_LIBERATED_FLAG);
      break;
    case Enum160.GRUMM_LIBERATED:
      uiTrue = (uiMeanWhileFlags & GRUMM_LIBERATED_FLAG);
      break;
    case Enum160.CHITZENA_LIBERATED:
      uiTrue = (uiMeanWhileFlags & CHITZENA_LIBERATED_FLAG);
      break;
    case Enum160.BALIME_LIBERATED:
      uiTrue = (uiMeanWhileFlags & BALIME_LIBERATED_FLAG);
      break;
    case Enum160.NW_SAM:
      uiTrue = (uiMeanWhileFlags & NW_SAM_FLAG);
      break;
    case Enum160.NE_SAM:
      uiTrue = (uiMeanWhileFlags & NE_SAM_FLAG);
      break;
    case Enum160.CENTRAL_SAM:
      uiTrue = (uiMeanWhileFlags & CENTRAL_SAM_FLAG);
      break;
    case Enum160.FLOWERS:
      uiTrue = (uiMeanWhileFlags & FLOWERS_FLAG);
      break;
    case Enum160.LOST_TOWN:
      uiTrue = (uiMeanWhileFlags & LOST_TOWN_FLAG);
      break;
    case Enum160.CREATURES:
      uiTrue = (uiMeanWhileFlags & CREATURES_FLAG);
      break;
    case Enum160.KILL_CHOPPER:
      uiTrue = (uiMeanWhileFlags & KILL_CHOPPER_FLAG);
      break;
    case Enum160.AWOL_SCIENTIST:
      uiTrue = (uiMeanWhileFlags & AWOL_SCIENTIST_FLAG);
      break;
    case Enum160.OUTSKIRTS_MEDUNA:
      uiTrue = (uiMeanWhileFlags & OUTSKIRTS_MEDUNA_FLAG);
      break;
    case Enum160.INTERROGATION:
      uiTrue = (uiMeanWhileFlags & INTERROGATION_FLAG);
      break;
  }

  if (uiTrue) {
    return true;
  } else {
    return false;
  }
}

function GetFreeNPCSave(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumNPCSaves; uiCount++) {
    if ((gNPCSaveData[uiCount].ubProfile == NO_PROFILE))
      return uiCount;
  }

  if (guiNumNPCSaves < MAX_MEANWHILE_PROFILES)
    return guiNumNPCSaves++;

  return -1;
}

function RecountNPCSaves(): void {
  let uiCount: INT32;

  for (uiCount = guiNumNPCSaves - 1; (uiCount >= 0); uiCount--) {
    if ((gNPCSaveData[uiCount].ubProfile != NO_PROFILE)) {
      guiNumNPCSaves = (uiCount + 1);
      break;
    }
  }
}

export function ScheduleMeanwhileEvent(pMeanwhileDef: MEANWHILE_DEFINITION, uiTime: UINT32): void {
  // event scheduled to happen before, ignore
  if (GetMeanWhileFlag(pMeanwhileDef.ubMeanwhileID) == true) {
    return;
  }

  // set the meanwhile flag for this event
  SetMeanWhileFlag(pMeanwhileDef.ubMeanwhileID);

  // set the id value
  ubCurrentMeanWhileId = pMeanwhileDef.ubMeanwhileID;

  // Copy definiaiotn structure into position in global array....
  copyMeanWhileDefinition(gMeanwhileDef[pMeanwhileDef.ubMeanwhileID], pMeanwhileDef);

  // A meanwhile.. poor elliot!
  // increment his slapped count...

  // We need to do it here 'cause they may skip it...
  if (gMercProfiles[Enum268.ELLIOT].bNPCData != 17) {
    gMercProfiles[Enum268.ELLIOT].bNPCData++;
  }

  AddStrategicEvent(Enum132.EVENT_MEANWHILE, uiTime, pMeanwhileDef.ubMeanwhileID);
}

export function BeginMeanwhile(ubMeanwhileID: UINT8): boolean {
  let cnt: INT32;

  // copy meanwhile data from array to structure for current
  copyMeanWhileDefinition(gCurrentMeanwhileDef, gMeanwhileDef[ubMeanwhileID]);

  gfMeanwhileTryingToStart = true;
  PauseGame();
  // prevent anyone from messing with the pause!
  LockPauseState(6);

  // Set NO_PROFILE info....
  for (cnt = 0; cnt < MAX_MEANWHILE_PROFILES; cnt++) {
    gNPCSaveData[cnt].ubProfile = NO_PROFILE;
  }

  return true;
}

function BringupMeanwhileBox(): void {
  let zStr: string /* INT16[256] */;

  zStr = swprintf("%s.....", pMessageStrings[Enum333.MSG_MEANWHILE]);

  if (gCurrentMeanwhileDef.ubMeanwhileID != Enum160.INTERROGATION && MeanwhileSceneSeen(gCurrentMeanwhileDef.ubMeanwhileID))
  {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zStr, guiCurrentScreen, MSG_BOX_FLAG_OKSKIP, BeginMeanwhileCallBack, null);
  } else {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zStr, guiCurrentScreen, MSG_BOX_FLAG_OK, BeginMeanwhileCallBack, null);
  }
}

export function CheckForMeanwhileOKStart(): void {
  if (gfMeanwhileTryingToStart) {
    // Are we in prebattle interface?
    if (gfPreBattleInterfaceActive) {
      return;
    }

    if (!InterfaceOKForMeanwhilePopup()) {
      return;
    }

    if (!DialogueQueueIsEmptyOrSomebodyTalkingNow()) {
      return;
    }

    gfMeanwhileTryingToStart = false;

    guiOldScreen = guiCurrentScreen;

    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      LeaveTacticalScreen(Enum26.GAME_SCREEN);
    }

    // We need to make sure we have no item - at least in tactical
    // In mapscreen, time is paused when manipulating items...
    CancelItemPointer();

    BringupMeanwhileBox();
  }
}

function StartMeanwhile(): void {
  let iIndex: INT32;
  let bNumDone: INT8 = 0;

  // OK, save old position...
  if (gfWorldLoaded) {
    gsOldSectorX = gWorldSectorX;
    gsOldSectorY = gWorldSectorY;
    gsOldSectorZ = gbWorldSectorZ;
  }

  gsOldSelectedSectorX = sSelMapX;
  gsOldSelectedSectorY = sSelMapY;
  gsOldSelectedSectorZ = iCurrentMapSectorZ;

  gfInMeanwhile = true;

  // ATE: Change music before load
  SetMusicMode(Enum328.MUSIC_MAIN_MENU);

  gfWorldWasLoaded = gfWorldLoaded;

  // OK, we have been told to start.....
  SetCurrentInterfacePanel(Enum215.TEAM_PANEL);

  // Setup NPC locations, depending on meanwhile type...
  switch (gCurrentMeanwhileDef.ubMeanwhileID) {
    case Enum160.END_OF_PLAYERS_FIRST_BATTLE:
    case Enum160.DRASSEN_LIBERATED:
    case Enum160.CAMBRIA_LIBERATED:
    case Enum160.ALMA_LIBERATED:
    case Enum160.GRUMM_LIBERATED:
    case Enum160.CHITZENA_LIBERATED:
    case Enum160.BALIME_LIBERATED:
    case Enum160.NW_SAM:
    case Enum160.NE_SAM:
    case Enum160.CENTRAL_SAM:
    case Enum160.FLOWERS:
    case Enum160.LOST_TOWN:
    case Enum160.CREATURES:
    case Enum160.KILL_CHOPPER:
    case Enum160.AWOL_SCIENTIST:
    case Enum160.OUTSKIRTS_MEDUNA:

      // SAVE QUEEN!
      iIndex = GetFreeNPCSave();
      if (iIndex != -1) {
        gNPCSaveData[iIndex].ubProfile = Enum268.QUEEN;
        gNPCSaveData[iIndex].sX = gMercProfiles[Enum268.QUEEN].sSectorX;
        gNPCSaveData[iIndex].sY = gMercProfiles[Enum268.QUEEN].sSectorY;
        gNPCSaveData[iIndex].sZ = gMercProfiles[Enum268.QUEEN].bSectorZ;
        gNPCSaveData[iIndex].sGridNo = gMercProfiles[Enum268.QUEEN].sGridNo;

        // Force reload of NPC files...
        ReloadQuoteFile(Enum268.QUEEN);

        ChangeNpcToDifferentSector(Enum268.QUEEN, 3, 16, 0);
      }

      // SAVE MESSANGER!
      iIndex = GetFreeNPCSave();
      if (iIndex != -1) {
        gNPCSaveData[iIndex].ubProfile = Enum268.ELLIOT;
        gNPCSaveData[iIndex].sX = gMercProfiles[Enum268.ELLIOT].sSectorX;
        gNPCSaveData[iIndex].sY = gMercProfiles[Enum268.ELLIOT].sSectorY;
        gNPCSaveData[iIndex].sZ = gMercProfiles[Enum268.ELLIOT].bSectorZ;
        gNPCSaveData[iIndex].sGridNo = gMercProfiles[Enum268.ELLIOT].sGridNo;

        // Force reload of NPC files...
        ReloadQuoteFile(Enum268.ELLIOT);

        ChangeNpcToDifferentSector(Enum268.ELLIOT, 3, 16, 0);
      }

      if (gCurrentMeanwhileDef.ubMeanwhileID == Enum160.OUTSKIRTS_MEDUNA) {
        // SAVE JOE!
        iIndex = GetFreeNPCSave();
        if (iIndex != -1) {
          gNPCSaveData[iIndex].ubProfile = Enum268.JOE;
          gNPCSaveData[iIndex].sX = gMercProfiles[Enum268.JOE].sSectorX;
          gNPCSaveData[iIndex].sY = gMercProfiles[Enum268.JOE].sSectorY;
          gNPCSaveData[iIndex].sZ = gMercProfiles[Enum268.JOE].bSectorZ;
          gNPCSaveData[iIndex].sGridNo = gMercProfiles[Enum268.JOE].sGridNo;

          // Force reload of NPC files...
          ReloadQuoteFile(Enum268.JOE);

          ChangeNpcToDifferentSector(Enum268.JOE, 3, 16, 0);
        }
      }

      break;

    case Enum160.INTERROGATION:

      // SAVE QUEEN!
      iIndex = GetFreeNPCSave();
      if (iIndex != -1) {
        gNPCSaveData[iIndex].ubProfile = Enum268.QUEEN;
        gNPCSaveData[iIndex].sX = gMercProfiles[Enum268.QUEEN].sSectorX;
        gNPCSaveData[iIndex].sY = gMercProfiles[Enum268.QUEEN].sSectorY;
        gNPCSaveData[iIndex].sZ = gMercProfiles[Enum268.QUEEN].bSectorZ;
        gNPCSaveData[iIndex].sGridNo = gMercProfiles[Enum268.QUEEN].sGridNo;

        // Force reload of NPC files...
        ReloadQuoteFile(Enum268.QUEEN);

        ChangeNpcToDifferentSector(Enum268.QUEEN, 7, 14, 0);
      }

      // SAVE MESSANGER!
      iIndex = GetFreeNPCSave();
      if (iIndex != -1) {
        gNPCSaveData[iIndex].ubProfile = Enum268.ELLIOT;
        gNPCSaveData[iIndex].sX = gMercProfiles[Enum268.ELLIOT].sSectorX;
        gNPCSaveData[iIndex].sY = gMercProfiles[Enum268.ELLIOT].sSectorY;
        gNPCSaveData[iIndex].sZ = gMercProfiles[Enum268.ELLIOT].bSectorZ;
        gNPCSaveData[iIndex].sGridNo = gMercProfiles[Enum268.ELLIOT].sGridNo;

        // Force reload of NPC files...
        ReloadQuoteFile(Enum268.ELLIOT);

        ChangeNpcToDifferentSector(Enum268.ELLIOT, 7, 14, 0);
      }

      // SAVE JOE!
      iIndex = GetFreeNPCSave();
      if (iIndex != -1) {
        gNPCSaveData[iIndex].ubProfile = Enum268.JOE;
        gNPCSaveData[iIndex].sX = gMercProfiles[Enum268.JOE].sSectorX;
        gNPCSaveData[iIndex].sY = gMercProfiles[Enum268.JOE].sSectorY;
        gNPCSaveData[iIndex].sZ = gMercProfiles[Enum268.JOE].bSectorZ;
        gNPCSaveData[iIndex].sGridNo = gMercProfiles[Enum268.JOE].sGridNo;

        // Force reload of NPC files...
        ReloadQuoteFile(Enum268.JOE);

        ChangeNpcToDifferentSector(Enum268.JOE, 7, 14, 0);
      }

      break;
  }

  // fade out old screen....
  FadeOutNextFrame();

  // Load new map....
  gFadeOutDoneCallback = DoneFadeOutMeanwhile;
}

function DoneFadeOutMeanwhile(): void {
  // OK, insertion data found, enter sector!

  SetCurrentWorldSector(gCurrentMeanwhileDef.sSectorX, gCurrentMeanwhileDef.sSectorY, 0);

  // LocateToMeanwhileCharacter( );
  LocateMeanWhileGrid();

  gFadeInDoneCallback = DoneFadeInMeanwhile;

  FadeInNextFrame();
}

function DoneFadeInMeanwhile(): void {
  // ATE: double check that we are in meanwhile
  // this is if we cancel right away.....
  if (gfInMeanwhile) {
    giNPCReferenceCount = 1;

    if (gCurrentMeanwhileDef.ubMeanwhileID != Enum160.INTERROGATION) {
      gTacticalStatus.uiFlags |= SHOW_ALL_MERCS;
    }

    TriggerNPCRecordImmediately(gCurrentMeanwhileDef.ubNPCNumber, gCurrentMeanwhileDef.usTriggerEvent);
  }
}

function BeginMeanwhileCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_OK || bExitValue == MSG_BOX_RETURN_YES) {
    gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
    // Increment reference count...
    giNPCReferenceCount = 1;

    StartMeanwhile();
  } else {
    // skipped scene!
    ProcessImplicationsOfMeanwhile();
    UnLockPauseState();
    UnPauseGame();
  }
}

export function AreInMeanwhile(): boolean {
  let curr: STRATEGICEVENT | null;

  // KM:  April 6, 1999
  // Tactical traversal needs to take precedence over meanwhile events.  When tactically traversing, we
  // expect to make it to the other side without interruption.
  if (gfTacticalTraversal) {
    return false;
  }

  if (gfInMeanwhile) {
    return true;
  }
  // Check to make sure a meanwhile scene isn't in the event list occurring at the exact same time as this call.  Meanwhile
  // scenes have precedence over a new battle if they occur in the same second.
  curr = gpEventList;
  while (curr) {
    if (curr.uiTimeStamp == GetWorldTotalSeconds()) {
      if (curr.ubCallbackID == Enum132.EVENT_MEANWHILE) {
        return true;
      }
    } else {
      return false;
    }
    curr = curr.next;
  }

  return false;
}

function ProcessImplicationsOfMeanwhile(): void {
  switch (gCurrentMeanwhileDef.ubMeanwhileID) {
    case Enum160.END_OF_PLAYERS_FIRST_BATTLE:
      if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_HARD) {
        // Wake up the queen earlier to punish the good players!
        ExecuteStrategicAIAction(Enum173.STRATEGIC_AI_ACTION_WAKE_QUEEN, 0, 0);
      }
      HandleNPCDoAction(Enum268.QUEEN, Enum213.NPC_ACTION_SEND_SOLDIERS_TO_BATTLE_LOCATION, 0);
      break;
    case Enum160.CAMBRIA_LIBERATED:
    case Enum160.ALMA_LIBERATED:
    case Enum160.GRUMM_LIBERATED:
    case Enum160.CHITZENA_LIBERATED:
    case Enum160.BALIME_LIBERATED:
      ExecuteStrategicAIAction(Enum173.STRATEGIC_AI_ACTION_WAKE_QUEEN, 0, 0);
      break;
    case Enum160.DRASSEN_LIBERATED:
      ExecuteStrategicAIAction(Enum173.STRATEGIC_AI_ACTION_WAKE_QUEEN, 0, 0);
      HandleNPCDoAction(Enum268.QUEEN, Enum213.NPC_ACTION_SEND_SOLDIERS_TO_DRASSEN, 0);
      break;
    case Enum160.CREATURES:
      // add Rat
      HandleNPCDoAction(Enum268.QUEEN, Enum213.NPC_ACTION_ADD_RAT, 0);
      break;
    case Enum160.AWOL_SCIENTIST: {
      let sSectorX: INT16;
      let sSectorY: INT16;

      StartQuest(Enum169.QUEST_FIND_SCIENTIST, -1, -1);
      // place Madlab and robot!
      if (SectorInfo[SECTOR(7, MAP_ROW_H)].uiFlags & SF_USE_ALTERNATE_MAP) {
        sSectorX = 7;
        sSectorY = MAP_ROW_H;
      } else if (SectorInfo[SECTOR(16, MAP_ROW_H)].uiFlags & SF_USE_ALTERNATE_MAP) {
        sSectorX = 16;
        sSectorY = MAP_ROW_H;
      } else if (SectorInfo[SECTOR(11, MAP_ROW_I)].uiFlags & SF_USE_ALTERNATE_MAP) {
        sSectorX = 11;
        sSectorY = MAP_ROW_I;
      } else if (SectorInfo[SECTOR(4, MAP_ROW_E)].uiFlags & SF_USE_ALTERNATE_MAP) {
        sSectorX = 4;
        sSectorY = MAP_ROW_E;
      } else {
        Assert(false);
      }
      gMercProfiles[Enum268.MADLAB].sSectorX = sSectorX;
      gMercProfiles[Enum268.MADLAB].sSectorY = sSectorY;
      gMercProfiles[Enum268.MADLAB].bSectorZ = 0;

      gMercProfiles[Enum268.ROBOT].sSectorX = sSectorX;
      gMercProfiles[Enum268.ROBOT].sSectorY = sSectorY;
      gMercProfiles[Enum268.ROBOT].bSectorZ = 0;
    } break;
    case Enum160.NW_SAM:
      ExecuteStrategicAIAction(Enum213.NPC_ACTION_SEND_TROOPS_TO_SAM, SAM_1_X, SAM_1_Y);
      break;
    case Enum160.NE_SAM:
      ExecuteStrategicAIAction(Enum213.NPC_ACTION_SEND_TROOPS_TO_SAM, SAM_2_X, SAM_2_Y);
      break;
    case Enum160.CENTRAL_SAM:
      ExecuteStrategicAIAction(Enum213.NPC_ACTION_SEND_TROOPS_TO_SAM, SAM_3_X, SAM_3_X);
      break;

    default:
      break;
  }
}

export function EndMeanwhile(): void {
  let cnt: UINT32;
  let ubProfile: UINT8;

  EmptyDialogueQueue();
  ProcessImplicationsOfMeanwhile();
  SetMeanwhileSceneSeen(gCurrentMeanwhileDef.ubMeanwhileID);

  gfInMeanwhile = false;
  giNPCReferenceCount = 0;

  gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);

  UnLockPauseState();
  UnPauseGame();

  // ATE: Make sure!
  TurnOffSectorLocator();

  if (gCurrentMeanwhileDef.ubMeanwhileID != Enum160.INTERROGATION) {
    gTacticalStatus.uiFlags &= (~SHOW_ALL_MERCS);

    // OK, load old sector again.....
    FadeOutNextFrame();

    // Load new map....
    gFadeOutDoneCallback = DoneFadeOutMeanwhileOnceDone;
  } else {
    // We leave this sector open for our POWs to escape!
    // Set music mode to enemy present!
    SetMusicMode(Enum328.MUSIC_TACTICAL_ENEMYPRESENT);

    // ATE: Restore people to saved positions...
    // OK, restore NPC save info...
    for (cnt = 0; cnt < guiNumNPCSaves; cnt++) {
      ubProfile = gNPCSaveData[cnt].ubProfile;

      if (ubProfile != NO_PROFILE) {
        gMercProfiles[ubProfile].sSectorX = gNPCSaveData[cnt].sX;
        gMercProfiles[ubProfile].sSectorY = gNPCSaveData[cnt].sY;
        gMercProfiles[ubProfile].bSectorZ = gNPCSaveData[cnt].sZ;
        gMercProfiles[ubProfile].sGridNo = gNPCSaveData[cnt].sGridNo;

        // Ensure NPC files loaded...
        ReloadQuoteFile(ubProfile);
      }
    }
  }
}

function DoneFadeOutMeanwhileOnceDone(): void {
  let cnt: UINT32;
  let ubProfile: UINT8;

  // OK, insertion data found, enter sector!
  gfReloadingScreenFromMeanwhile = true;

  if (gfWorldWasLoaded) {
    SetCurrentWorldSector(gsOldSectorX, gsOldSectorY, gsOldSectorZ);

    ExamineCurrentSquadLights();
  } else {
    TrashWorld();
    // NB no world is loaded!
    gWorldSectorX = 0;
    gWorldSectorY = 0;
    gbWorldSectorZ = -1;
  }

  ChangeSelectedMapSector(gsOldSelectedSectorX, gsOldSelectedSectorY, gsOldSelectedSectorZ);

  gfReloadingScreenFromMeanwhile = false;

  // OK, restore NPC save info...
  for (cnt = 0; cnt < guiNumNPCSaves; cnt++) {
    ubProfile = gNPCSaveData[cnt].ubProfile;

    if (ubProfile != NO_PROFILE) {
      gMercProfiles[ubProfile].sSectorX = gNPCSaveData[cnt].sX;
      gMercProfiles[ubProfile].sSectorY = gNPCSaveData[cnt].sY;
      gMercProfiles[ubProfile].bSectorZ = gNPCSaveData[cnt].sZ;
      gMercProfiles[ubProfile].sGridNo = gNPCSaveData[cnt].sGridNo;

      // Ensure NPC files loaded...
      ReloadQuoteFile(ubProfile);
    }
  }

  gFadeInDoneCallback = DoneFadeInMeanwhileOnceDone;

  // OK, based on screen we were in....
  switch (guiOldScreen) {
    case Enum26.MAP_SCREEN:
      InternalLeaveTacticalScreen(Enum26.MAP_SCREEN);
      // gfEnteringMapScreen = TRUE;
      break;

    case Enum26.GAME_SCREEN:
      // restore old interface panel flag
      SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
      break;
  }

  FadeInNextFrame();
}

function DoneFadeInMeanwhileOnceDone(): void {
}

function LocateMeanWhileGrid(): void {
  let sGridNo: INT16 = 0;

  // go to the approp. gridno
  sGridNo = gusMeanWhileGridNo[ubCurrentMeanWhileId];

  InternalLocateGridNo(sGridNo, true);

  return;
}

export function LocateToMeanwhileCharacter(): void {
  let pSoldier: SOLDIERTYPE | null;

  if (gfInMeanwhile) {
    pSoldier = FindSoldierByProfileID(gCurrentMeanwhileDef.ubNPCNumber, false);

    if (pSoldier != null) {
      LocateSoldier(pSoldier.ubID, 0);
    }
  }
}

export function AreReloadingFromMeanwhile(): boolean {
  return gfReloadingScreenFromMeanwhile;
}

export function GetMeanwhileID(): UINT8 {
  return gCurrentMeanwhileDef.ubMeanwhileID;
}

export function HandleCreatureRelease(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  MeanwhileDef.ubMeanwhileID = Enum160.CREATURES;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

export function HandleMeanWhileEventPostingForTownLiberation(bTownId: UINT8): void {
  // post event for meanwhile whithin the next 6 hours if it still will be daylight, otherwise the next morning
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;
  let fHandled: boolean = false;

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  // which town iberated?
  switch (bTownId) {
    case Enum135.DRASSEN:
      ubId = Enum160.DRASSEN_LIBERATED;
      fHandled = true;
      break;
    case Enum135.CAMBRIA:
      ubId = Enum160.CAMBRIA_LIBERATED;
      fHandled = true;
      break;
    case Enum135.ALMA:
      ubId = Enum160.ALMA_LIBERATED;
      fHandled = true;
      break;
    case Enum135.GRUMM:
      ubId = Enum160.GRUMM_LIBERATED;
      fHandled = true;
      break;
    case Enum135.CHITZENA:
      ubId = Enum160.CHITZENA_LIBERATED;
      fHandled = true;
      break;
    case Enum135.BALIME:
      ubId = Enum160.BALIME_LIBERATED;
      fHandled = true;
      break;
  }

  if (fHandled) {
    MeanwhileDef.ubMeanwhileID = ubId;

    // schedule the event
    ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
  }
}

export function HandleMeanWhileEventPostingForTownLoss(bTownId: UINT8): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();

  // make sure scene hasn't been used before
  if (GetMeanWhileFlag(Enum160.LOST_TOWN)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  MeanwhileDef.ubMeanwhileID = Enum160.LOST_TOWN;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

export function HandleMeanWhileEventPostingForSAMLiberation(bSamId: INT8): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;
  let fHandled: boolean = false;

  if (bSamId == -1) {
    // invalid parameter!
    return;
  } else if (bSamId == 3) {
    // no meanwhile scene for this SAM site
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  // which SAM iberated?
  switch (bSamId) {
    case 0:
      ubId = Enum160.NW_SAM;
      fHandled = true;
      break;
    case 1:
      ubId = Enum160.NE_SAM;
      fHandled = true;
      break;
    case 2:
      ubId = Enum160.CENTRAL_SAM;
      fHandled = true;
      break;
    default:
      // wtf?
      break;
  }

  if (fHandled) {
    MeanwhileDef.ubMeanwhileID = ubId;

    // schedule the event
    ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
  }
}

export function HandleFlowersMeanwhileScene(bTimeCode: INT8): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  // make sure scene hasn't been used before
  if (GetMeanWhileFlag(Enum160.FLOWERS)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  // time delay should be based on time code, 0 next day, 1 seeral days (random)
  if (bTimeCode == 0) {
    // 20-24 hours later
    uiTime = GetWorldTotalMin() + 60 * (20 + Random(5));
  } else {
    // 2-4 days later
    uiTime = GetWorldTotalMin() + 60 * (24 + Random(48));
  }

  MeanwhileDef.ubMeanwhileID = Enum160.FLOWERS;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

export function HandleOutskirtsOfMedunaMeanwhileScene(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  // make sure scene hasn't been used before
  if (GetMeanWhileFlag(Enum160.OUTSKIRTS_MEDUNA)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  MeanwhileDef.ubMeanwhileID = Enum160.OUTSKIRTS_MEDUNA;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

export function HandleKillChopperMeanwhileScene(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  // make sure scene hasn't been used before
  if (GetMeanWhileFlag(Enum160.KILL_CHOPPER)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 55 + Random(10);

  MeanwhileDef.ubMeanwhileID = Enum160.KILL_CHOPPER;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

export function HandleScientistAWOLMeanwhileScene(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  // make sure scene hasn't been used before
  if (GetMeanWhileFlag(Enum160.AWOL_SCIENTIST)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  MeanwhileDef.ubMeanwhileID = Enum160.AWOL_SCIENTIST;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

function HandleInterrogationMeanwhileScene(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  // make sure scene hasn't been used before
  if (GetMeanWhileFlag(Enum160.INTERROGATION)) {
    return;
  }

  MeanwhileDef.sSectorX = 7; // what sector?
  MeanwhileDef.sSectorY = MAP_ROW_N;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 60;

  MeanwhileDef.ubMeanwhileID = Enum160.INTERROGATION;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

function HandleFirstBattleVictory(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  if (GetMeanWhileFlag(Enum160.END_OF_PLAYERS_FIRST_BATTLE)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  uiTime = GetWorldTotalMin() + 5;

  ubId = Enum160.END_OF_PLAYERS_FIRST_BATTLE;

  MeanwhileDef.ubMeanwhileID = ubId;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

function HandleDelayedFirstBattleVictory(): void {
  let uiTime: UINT32 = 0;
  let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();
  let ubId: UINT8 = 0;

  if (GetMeanWhileFlag(Enum160.END_OF_PLAYERS_FIRST_BATTLE)) {
    return;
  }

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;

  /*
  //It is theoretically impossible to liberate a town within 60 minutes of the first battle (which is supposed to
  //occur outside of a town in this scenario).  The delay is attributed to the info taking longer to reach the queen.
  uiTime = GetWorldTotalMin() + 60;
  */
  uiTime = GetWorldTotalMin() + 5;

  ubId = Enum160.END_OF_PLAYERS_FIRST_BATTLE;

  MeanwhileDef.ubMeanwhileID = ubId;

  // schedule the event
  ScheduleMeanwhileEvent(MeanwhileDef, uiTime);
}

export function HandleFirstBattleEndingWhileInTown(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT16, fFromAutoResolve: boolean): void {
  let bTownId: INT8 = 0;
  let sSector: INT16 = 0;

  if (GetMeanWhileFlag(Enum160.END_OF_PLAYERS_FIRST_BATTLE)) {
    return;
  }

  // if this is in fact a town and it is the first battle, then set gfFirstBattleMeanwhileScenePending true
  // if  is true then this is the end of the second battle, post the first meanwhile OR, on call to trash world, that
  // means player is leaving sector

  // grab sector value
  sSector = sSectorX + sSectorY * MAP_WORLD_X;

  // get town name id
  bTownId = StrategicMap[sSector].bNameId;

  if (bTownId == Enum135.BLANK_SECTOR) {
    // invalid town
    HandleDelayedFirstBattleVictory();
    gfFirstBattleMeanwhileScenePending = false;
  } else if (gfFirstBattleMeanwhileScenePending || fFromAutoResolve) {
    HandleFirstBattleVictory();
    gfFirstBattleMeanwhileScenePending = false;
  } else {
    gfFirstBattleMeanwhileScenePending = true;
  }

  return;
}

export function HandleFirstMeanWhileSetUpWithTrashWorld(): void {
  // exiting sector after first battle fought
  if (gfFirstBattleMeanwhileScenePending) {
    HandleFirstBattleVictory();
    gfFirstBattleMeanwhileScenePending = false;
  }
}

}
