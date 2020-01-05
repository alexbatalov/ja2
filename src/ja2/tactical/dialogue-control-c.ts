namespace ja2 {

const DIALOGUESIZE = 480;
const QUOTE_MESSAGE_SIZE = 520;

const TALK_PANEL_FACE_X = 6;
const TALK_PANEL_FACE_Y = 9;
const TALK_PANEL_NAME_X = 5;
const TALK_PANEL_NAME_Y = 114;
const TALK_PANEL_NAME_WIDTH = 92;
const TALK_PANEL_NAME_HEIGHT = 15;
const TALK_PANEL_MENU_STARTY = 8;
const TALK_PANEL_MENU_HEIGHT = 24;
const TALK_MENU_WIDTH = 96;
const TALK_MENU_HEIGHT = 16;

const DIALOGUE_DEFAULT_SUBTITLE_WIDTH = 200;
const TEXT_DELAY_MODIFIER = 60;

interface DIALOGUE_Q_STRUCT {
  usQuoteNum: UINT16;
  ubCharacterNum: UINT8;
  bUIHandlerID: INT8;
  iFaceIndex: INT32;
  iTimeStamp: INT32;
  uiSpecialEventFlag: UINT32;
  uiSpecialEventData: any /* UINT32 */;
  uiSpecialEventData2: any /* UINT32 */;
  uiSpecialEventData3: any /* UINT32 */;
  uiSpecialEventData4: any /* UINT32 */;
  fFromSoldier: boolean;
  fDelayed: boolean;
  fPauseTime: boolean;
}

function createDialogueQStruct(): DIALOGUE_Q_STRUCT {
  return {
    usQuoteNum: 0,
    ubCharacterNum: 0,
    bUIHandlerID: 0,
    iFaceIndex: 0,
    iTimeStamp: 0,
    uiSpecialEventFlag: 0,
    uiSpecialEventData: 0,
    uiSpecialEventData2: 0,
    uiSpecialEventData3: 0,
    uiSpecialEventData4: 0,
    fFromSoldier: false,
    fDelayed: false,
    fPauseTime: false,
  };
}

let fExternFacesLoaded: boolean = false;

export let uiExternalStaticNPCFaces: UINT32[] /* [NUMBER_OF_EXTERNAL_NPC_FACES] */ = createArray(Enum203.NUMBER_OF_EXTERNAL_NPC_FACES, 0);
export let uiExternalFaceProfileIds: UINT32[] /* [NUMBER_OF_EXTERNAL_NPC_FACES] */ = [
  97,
  106,
  148,
  156,
  157,
  158,
];

let gubMercValidPrecedentQuoteID: UINT8[] /* [NUMBER_VALID_MERC_PRECEDENT_QUOTES] */ = [
  80,
  81,
  82,
  83,
  86,
  87,
  88,
  95,
  97,
  99,
  100,
  101,
  102,
];

let gusStopTimeQuoteList: UINT16[] /* [] */ = [
  Enum202.QUOTE_BOOBYTRAP_ITEM,
  Enum202.QUOTE_SUSPICIOUS_GROUND,
];

let gubNumStopTimeQuotes: UINT8 = 2;

// QUEUE UP DIALOG!
const INITIAL_Q_SIZE = 10;
let ghDialogueQ: DIALOGUE_Q_STRUCT[];
export let gpCurrentTalkingFace: FACETYPE | null /* Pointer<FACETYPE> */ = null;
export let gubCurrentTalkingID: UINT8 = NO_PROFILE;
let gbUIHandlerID: INT8;

export let giNPCReferenceCount: INT32 = 0;
export let giNPCSpecialReferenceCount: INT32 = 0;

let gsExternPanelXPosition: INT16 = DEFAULT_EXTERN_PANEL_X_POS;
let gsExternPanelYPosition: INT16 = DEFAULT_EXTERN_PANEL_Y_POS;

let gfDialogueQueuePaused: boolean = false;
let gusSubtitleBoxWidth: UINT16;
let gusSubtitleBoxWidth__Pointer = createPointer(() => gusSubtitleBoxWidth, (v) => gusSubtitleBoxWidth = v);
let gusSubtitleBoxHeight: UINT16;
let gusSubtitleBoxHeight__Pointer = createPointer(() => gusSubtitleBoxHeight, (v) => gusSubtitleBoxHeight = v);
let giTextBoxOverlay: INT32 = -1;
export let gfFacePanelActive: boolean = false;
let guiScreenIDUsedWhenUICreated: UINT32;
let gzQuoteStr: string /* INT16[QUOTE_MESSAGE_SIZE] */;
let gzQuoteStr__Pointer = createPointer(() => gzQuoteStr, (v) => gzQuoteStr = v);
let gTextBoxMouseRegion: MOUSE_REGION = createMouseRegion();
let gFacePopupMouseRegion: MOUSE_REGION = createMouseRegion();
let gfUseAlternateDialogueFile: boolean = false;

// set the top position value for merc dialogue pop up boxes
let gsTopPosition: INT16 = 20;

export let iDialogueBox: INT32 = -1;

// the next said quote will pause time
export let fPausedTimeDuringQuote: boolean = false;
let fWasPausedDuringDialogue: boolean = false;

let gubLogForMeTooBleeds: INT8 = 0;

// has the text region been created?
export let fTextBoxMouseRegionCreated: boolean = false;
let fExternFaceBoxRegionCreated: boolean = false;

// due to last quote system?
export let fDialogueBoxDueToLastMessage: boolean = false;

// last quote timers
export let guiDialogueLastQuoteTime: UINT32 = 0;
export let guiDialogueLastQuoteDelay: UINT32 = 0;

export function UnPauseGameDuringNextQuote(): void {
  fPausedTimeDuringQuote = false;

  return;
}

function PauseTimeDuringNextQuote(): void {
  fPausedTimeDuringQuote = true;

  return;
}

export function DialogueActive(): boolean {
  if (gpCurrentTalkingFace != null) {
    return true;
  }

  return false;
}

export function InitalizeDialogueControl(): boolean {
  ghDialogueQ = [];

  // Initalize subtitle popup box
  //

  giNPCReferenceCount = 0;

  if (ghDialogueQ == null) {
    return false;
  } else {
    return true;
  }
}

export function ShutdownDialogueControl(): void {
  if (ghDialogueQ != null) {
    // Empty
    EmptyDialogueQueue();

    // Delete
    ghDialogueQ = <DIALOGUE_Q_STRUCT[]><unknown>null;
  }

  // shutdown external static NPC faces
  ShutdownStaticExternalNPCFaces();

  // gte rid of portraits for cars
  UnLoadCarPortraits();
  //
}

export function InitalizeStaticExternalNPCFaces(): void {
  let iCounter: INT32 = 0;
  // go and grab all external NPC faces that are needed for the game who won't exist as soldiertypes

  if (fExternFacesLoaded == true) {
    return;
  }

  fExternFacesLoaded = true;

  for (iCounter = 0; iCounter < Enum203.NUMBER_OF_EXTERNAL_NPC_FACES; iCounter++) {
    uiExternalStaticNPCFaces[iCounter] = InitFace((uiExternalFaceProfileIds[iCounter]), NOBODY, FACE_FORCE_SMALL);
  }

  return;
}

export function ShutdownStaticExternalNPCFaces(): void {
  let iCounter: INT32 = 0;

  if (fExternFacesLoaded == false) {
    return;
  }

  fExternFacesLoaded = false;

  // remove all external npc faces
  for (iCounter = 0; iCounter < Enum203.NUMBER_OF_EXTERNAL_NPC_FACES; iCounter++) {
    DeleteFace(uiExternalStaticNPCFaces[iCounter]);
  }
}

export function EmptyDialogueQueue(): void {
  // If we have anything left in the queue, remove!
  if (ghDialogueQ != null) {
    /*
    DEF:  commented out because the Queue system ?? uses a contiguous memory block ??? for the queue
            so you cant delete a single node.  The DeleteQueue, below, will free the entire memory block

                    numDialogueItems = QueueSize( ghDialogueQ );

                    for ( cnt = numDialogueItems-1; cnt >= 0; cnt-- )
                    {
                            if ( PeekQueue( ghDialogueQ, &QItem ) )
                            {
                                            MemFree( QItem );
                            }
                    }
    */

    // Delete list
    ghDialogueQ = <DIALOGUE_Q_STRUCT[]><unknown>null;

    // Recreate list
    ghDialogueQ = [];
  }

  gfWaitingForTriggerTimer = false;
}

export function DialogueQueueIsEmpty(): boolean {
  let numDialogueItems: INT32;

  if (ghDialogueQ != null) {
    numDialogueItems = ghDialogueQ.length;

    if (numDialogueItems == 0) {
      return true;
    }
  }

  return false;
}

export function DialogueQueueIsEmptyOrSomebodyTalkingNow(): boolean {
  if (gpCurrentTalkingFace != null) {
    return false;
  }

  if (!DialogueQueueIsEmpty()) {
    return false;
  }

  return true;
}

export function DialogueAdvanceSpeech(): void {
  // Shut them up!
  InternalShutupaYoFace((<FACETYPE>gpCurrentTalkingFace).iID, false);
}

export function StopAnyCurrentlyTalkingSpeech(): void {
  // ATE; Make sure guys stop talking....
  if (gpCurrentTalkingFace != null) {
    InternalShutupaYoFace(gpCurrentTalkingFace.iID, true);
  }
}

// ATE: Handle changes like when face goes from
// 'external' to on the team panel...
export function HandleDialogueUIAdjustments(): void {
  let pSoldier: SOLDIERTYPE | null;

  // OK, check if we are still taking
  if (gpCurrentTalkingFace != null) {
    if (gpCurrentTalkingFace.fTalking) {
      // ATE: Check for change in state for the guy currently talking on 'external' panel....
      if (gfFacePanelActive) {
        pSoldier = FindSoldierByProfileID(gubCurrentTalkingID, false);

        if (pSoldier) {
          if (0) {
            // A change in plans here...
            // We now talk through the interface panel...
            if (gpCurrentTalkingFace.iVideoOverlay != -1) {
              RemoveVideoOverlay(gpCurrentTalkingFace.iVideoOverlay);
              gpCurrentTalkingFace.iVideoOverlay = -1;
            }
            gfFacePanelActive = false;

            RemoveVideoOverlay(giTextBoxOverlay);
            giTextBoxOverlay = -1;

            if (fTextBoxMouseRegionCreated) {
              MSYS_RemoveRegion(gTextBoxMouseRegion);
              fTextBoxMouseRegionCreated = false;
            }

            // Setup UI again!
            CreateTalkingUI(gbUIHandlerID, pSoldier.iFaceIndex, pSoldier.ubProfile, pSoldier, gzQuoteStr);
          }
        }
      }
    }
  }
}

/* static */ let HandleDialogue__fOldEngagedInConvFlagOn: boolean = false;
export function HandleDialogue(): void {
  let iQSize: INT32;
  let QItem: DIALOGUE_Q_STRUCT = <DIALOGUE_Q_STRUCT><unknown>undefined;
  let fDoneTalking: boolean = false;
  let pSoldier: SOLDIERTYPE | null = null;
  let zText: string /* CHAR16[512] */;
  let zMoney: string /* CHAR16[128] */ = '';

  // we don't want to just delay action of some events, we want to pause the whole queue, regardless of the event
  if (gfDialogueQueuePaused) {
    return;
  }

  iQSize = ghDialogueQ.length;

  if (iQSize == 0 && gpCurrentTalkingFace == null) {
    HandlePendingInitConv();
  }

  HandleCivQuote();

  // Alrighty, check for a change in state, do stuff appropriately....
  // Turned on
  if (HandleDialogue__fOldEngagedInConvFlagOn == false && (gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
    // OK, we have just entered...
    HandleDialogue__fOldEngagedInConvFlagOn = true;

    // pause game..
    PauseGame();
    LockPauseState(14);
  } else if (HandleDialogue__fOldEngagedInConvFlagOn == true && !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
    // OK, we left...
    HandleDialogue__fOldEngagedInConvFlagOn = false;

    // Unpause game..
    UnLockPauseState();
    UnPauseGame();

    // if we're exiting boxing with the UI lock set then DON'T OVERRIDE THIS!
    if (!(gTacticalStatus.bBoxingState == Enum247.WON_ROUND || gTacticalStatus.bBoxingState == Enum247.LOST_ROUND || gTacticalStatus.bBoxingState == Enum247.DISQUALIFIED) && !(gTacticalStatus.uiFlags & IGNORE_ENGAGED_IN_CONV_UI_UNLOCK)) {
      guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
      HandleTacticalUI();

      // ATE: If this is NOT the player's turn.. engage AI UI lock!
      if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
        // Setup locked UI
        guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
        HandleTacticalUI();
      }
    }

    gTacticalStatus.uiFlags &= (~IGNORE_ENGAGED_IN_CONV_UI_UNLOCK);
  }

  if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
    // Are we in here because of the dialogue system up?
    if (!gfInTalkPanel) {
      // ATE: NOT if we have a message box pending....
      if (guiPendingScreen != Enum26.MSG_BOX_SCREEN && guiCurrentScreen != Enum26.MSG_BOX_SCREEN) {
        // No, so we should lock the UI!
        guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
        HandleTacticalUI();
      }
    }
  }

  // OK, check if we are still taking
  if (gpCurrentTalkingFace != null) {
    if (gpCurrentTalkingFace.fTalking) {
      // ATE: OK, MANAGE THE DISPLAY OF OUR CURRENTLY ACTIVE FACE IF WE / IT CHANGES STATUS
      // THINGS THAT CAN CHANGE STATUS:
      //		CHANGE TO MAPSCREEN
      //		CHANGE TO GAMESCREEN
      //		CHANGE IN MERC STATUS TO BE IN A SQUAD
      //    CHANGE FROM TEAM TO INV INTERFACE

      // Where are we and where did this face once exist?
      if (guiScreenIDUsedWhenUICreated == Enum26.GAME_SCREEN && guiCurrentScreen == Enum26.MAP_SCREEN) {
        // GO FROM GAMESCREEN TO MAPSCREEN
        // REMOVE OLD UI
        // Set face inactive!
        // gpCurrentTalkingFace->fCanHandleInactiveNow = TRUE;
        // SetAutoFaceInActive( gpCurrentTalkingFace->iID );
        // gfFacePanelActive = FALSE;

        // delete face panel if there is one!
        if (gfFacePanelActive) {
          // Set face inactive!
          if (gpCurrentTalkingFace.iVideoOverlay != -1) {
            RemoveVideoOverlay(gpCurrentTalkingFace.iVideoOverlay);
            gpCurrentTalkingFace.iVideoOverlay = -1;
          }

          if (fExternFaceBoxRegionCreated) {
            fExternFaceBoxRegionCreated = false;
            MSYS_RemoveRegion(gFacePopupMouseRegion);
          }

          // Set face inactive....
          gpCurrentTalkingFace.fCanHandleInactiveNow = true;
          SetAutoFaceInActive(gpCurrentTalkingFace.iID);
          HandleTacticalSpeechUI(gubCurrentTalkingID, gpCurrentTalkingFace.iID);

          // ATE: Force mapscreen to set face active again.....
          fReDrawFace = true;
          DrawFace(bSelectedInfoChar);

          gfFacePanelActive = false;
        }

        guiScreenIDUsedWhenUICreated = guiCurrentScreen;
      } else if (guiScreenIDUsedWhenUICreated == Enum26.MAP_SCREEN && guiCurrentScreen == Enum26.GAME_SCREEN) {
        HandleTacticalSpeechUI(gubCurrentTalkingID, gpCurrentTalkingFace.iID);
        guiScreenIDUsedWhenUICreated = guiCurrentScreen;
      }
      return;
    } else {
      // Check special flags
      // If we are done, check special face flag for trigger NPC!
      if (gpCurrentTalkingFace.uiFlags & FACE_PCTRIGGER_NPC) {
        // Decrement refrence count...
        giNPCReferenceCount--;

        TriggerNPCRecord(gpCurrentTalkingFace.uiUserData1, gpCurrentTalkingFace.uiUserData2);
        // Reset flag!
        gpCurrentTalkingFace.uiFlags &= (~FACE_PCTRIGGER_NPC);
      }

      if (gpCurrentTalkingFace.uiFlags & FACE_MODAL) {
        gpCurrentTalkingFace.uiFlags &= (~FACE_MODAL);

        EndModalTactical();

        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Ending Modal Tactical Quote.");
      }

      if (gpCurrentTalkingFace.uiFlags & FACE_TRIGGER_PREBATTLE_INT) {
        UnLockPauseState();
        InitPreBattleInterface(gpCurrentTalkingFace.uiUserData1, true);
        // Reset flag!
        gpCurrentTalkingFace.uiFlags &= (~FACE_TRIGGER_PREBATTLE_INT);
      }

      gpCurrentTalkingFace = null;
      gubCurrentTalkingID = NO_PROFILE;
      gTacticalStatus.ubLastQuoteProfileNUm = NO_PROFILE;
      fDoneTalking = true;
    }
  }

  if ((fDoneTalking) && (fWasPausedDuringDialogue)) {
    fWasPausedDuringDialogue = false;

    // unlock pause state
    UnLockPauseState();
    UnPauseGame();
  }

  if (iQSize == 0) {
    if (gfMikeShouldSayHi == 1) {
      let pMike: SOLDIERTYPE | null;
      let sPlayerGridNo: INT16;
      let ubPlayerID: UINT8;

      pMike = FindSoldierByProfileID(Enum268.MIKE, false);
      if (pMike) {
        sPlayerGridNo = ClosestPC(pMike, null);
        if (sPlayerGridNo != NOWHERE) {
          ubPlayerID = WhoIsThere2(sPlayerGridNo, 0);
          if (ubPlayerID != NOBODY) {
            InitiateConversation(pMike, MercPtrs[ubPlayerID], Enum296.NPC_INITIAL_QUOTE, 0);
            gMercProfiles[pMike.ubProfile].ubMiscFlags2 |= PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE;
            // JA2Gold: special hack value of 2 to prevent dialogue from coming up more than once
            gfMikeShouldSayHi = 2;
          }
        }
      }
    }

    return;
  }

  // ATE: Remove any civ quotes....
  // ShutDownQuoteBoxIfActive( TRUE );

  // If here, pick current one from queue and play

  // Get new one
  QItem = <DIALOGUE_Q_STRUCT>ghDialogueQ.shift();

  // If we are in auto bandage, ignore any quotes!
  if (gTacticalStatus.fAutoBandageMode) {
    if (QItem.fPauseTime) {
      UnLockPauseState();
      UnPauseGame();
    }

    // Delete memory
    return;
  }

  // Check time delay

  // Alrighty, check if this one is to be delayed until we gain control.
  // If so, place it back in!
  if (QItem.fDelayed) {
    // Are we not in our turn and not interrupted
    if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
      // Place back in!
      // Add to queue
      ghDialogueQ.push(QItem);

      return;
    }
  }

  // ATE: OK: If a battle sound, and delay value was given, set time stamp
  // now...
  if (QItem.uiSpecialEventFlag == DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND) {
    if (QItem.uiSpecialEventData2 != 0) {
      if ((GetJA2Clock() - QItem.iTimeStamp) < QItem.uiSpecialEventData2) {
        // Place back in!
        // Add to queue
        ghDialogueQ.push(QItem);

        return;
      }
    }
  }

  // Try to find soldier...
  pSoldier = FindSoldierByProfileID(QItem.ubCharacterNum, true);

  if (pSoldier != null) {
    if (SoundIsPlaying(pSoldier.uiBattleSoundID)) {
      // Place back in!
      // Add to queue
      ghDialogueQ.push(QItem);

      return;
    }
  }

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) && (QItem.uiSpecialEventFlag == 0)) {
    QItem.fPauseTime = true;
  }

  if (QItem.fPauseTime) {
    if (GamePaused() == false) {
      PauseGame();
      LockPauseState(15);
      fWasPausedDuringDialogue = true;
    }
  }

  // Now play first item in queue
  // If it's not a 'special' dialogue event, continue
  if (QItem.uiSpecialEventFlag == 0) {
    if (pSoldier) {
      // wake grunt up to say
      if (pSoldier.fMercAsleep) {
        pSoldier.fMercAsleep = false;

        // refresh map screen
        fCharacterInfoPanelDirty = true;
        fTeamPanelDirty = true;

        // allow them to go back to sleep
        TacticalCharacterDialogueWithSpecialEvent(pSoldier, QItem.usQuoteNum, DIALOGUE_SPECIAL_EVENT_SLEEP, 1, 0);
      }
    }

    gTacticalStatus.ubLastQuoteSaid = QItem.usQuoteNum;
    gTacticalStatus.ubLastQuoteProfileNUm = QItem.ubCharacterNum;

    // Setup face pointer
    gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
    gubCurrentTalkingID = QItem.ubCharacterNum;

    ExecuteCharacterDialogue(QItem.ubCharacterNum, QItem.usQuoteNum, QItem.iFaceIndex, QItem.bUIHandlerID, QItem.fFromSoldier);
  } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SKIP_A_FRAME) {
  } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_LOCK_INTERFACE) {
    // locking or unlocking?
    if (QItem.uiSpecialEventData) {
      switch (QItem.uiSpecialEventData2) {
        case (Enum26.MAP_SCREEN):
          fLockOutMapScreenInterface = true;
          break;
      }
    } else {
      switch (QItem.uiSpecialEventData2) {
        case (Enum26.MAP_SCREEN):
          fLockOutMapScreenInterface = false;
          break;
      }
    }
  } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_REMOVE_EPC) {
    gMercProfiles[QItem.uiSpecialEventData].ubMiscFlags &= ~PROFILE_MISC_FLAG_FORCENPCQUOTE;
    UnRecruitEPC(QItem.uiSpecialEventData);
    ReBuildCharactersList();
  } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_CONTRACT_WANTS_TO_RENEW) {
    HandleMercIsWillingToRenew(QItem.uiSpecialEventData);
  } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_CONTRACT_NOGO_TO_RENEW) {
    HandleMercIsNotWillingToRenew(QItem.uiSpecialEventData);
  } else {
    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_USE_ALTERNATE_FILES) {
      gfUseAlternateDialogueFile = true;

      // Setup face pointer
      gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
      gubCurrentTalkingID = QItem.ubCharacterNum;

      ExecuteCharacterDialogue(QItem.ubCharacterNum, QItem.usQuoteNum, QItem.iFaceIndex, QItem.bUIHandlerID, QItem.fFromSoldier);

      gfUseAlternateDialogueFile = false;
    }
    // We could have a special flag, but dialogue as well
    else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_PCTRIGGERNPC) {
      // Setup face pointer
      gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
      gubCurrentTalkingID = QItem.ubCharacterNum;

      ExecuteCharacterDialogue(QItem.ubCharacterNum, QItem.usQuoteNum, QItem.iFaceIndex, QItem.bUIHandlerID, QItem.fFromSoldier);

      // Setup face with data!
      gpCurrentTalkingFace.uiFlags |= FACE_PCTRIGGER_NPC;
      gpCurrentTalkingFace.uiUserData1 = QItem.uiSpecialEventData;
      gpCurrentTalkingFace.uiUserData2 = QItem.uiSpecialEventData2;
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SHOW_CONTRACT_MENU) {
      // Setup face pointer
      // ATE: THis is working with MARK'S STUFF :(
      // Need this stuff so that bSelectedInfoChar is set...
      SetInfoChar((<SOLDIERTYPE>pSoldier).ubID);

      fShowContractMenu = true;
      RebuildContractBoxForMerc(<SOLDIERTYPE>pSoldier);
      bSelectedContractChar = bSelectedInfoChar;
      pProcessingSoldier = pSoldier;
      fProcessingAMerc = true;
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND) {
      // grab soldier ptr from profile ID
      pSoldier = FindSoldierByProfileID(QItem.ubCharacterNum, false);

      // Do battle snounds......
      if (pSoldier) {
        InternalDoMercBattleSound(pSoldier, QItem.uiSpecialEventData, 0);
      }
    }

    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SIGNAL_ITEM_LOCATOR_START) {
      // Turn off item lock for locators...
      gTacticalStatus.fLockItemLocators = false;

      // Slide to location!
      SlideToLocation(0, QItem.uiSpecialEventData);

      gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
      gubCurrentTalkingID = QItem.ubCharacterNum;

      ExecuteCharacterDialogue(QItem.ubCharacterNum, QItem.usQuoteNum, QItem.iFaceIndex, QItem.bUIHandlerID, QItem.fFromSoldier);
    }

    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_ENABLE_AI) {
      // OK, allow AI to work now....
      UnPauseAI();
    }

    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_TRIGGERPREBATTLEINTERFACE) {
      UnLockPauseState();
      InitPreBattleInterface(QItem.uiSpecialEventData, true);
    }
    if (QItem.uiSpecialEventFlag & DIALOGUE_ADD_EVENT_FOR_SOLDIER_UPDATE_BOX) {
      let iReason: INT32 = 0;
      let pUpdateSoldier: SOLDIERTYPE;

      iReason = QItem.uiSpecialEventData;

      switch (iReason) {
        case (Enum204.UPDATE_BOX_REASON_ADDSOLDIER):
          pUpdateSoldier = Menptr[QItem.uiSpecialEventData2];
          if (pUpdateSoldier.bActive == true) {
            AddSoldierToUpdateBox(pUpdateSoldier);
          }
          break;
        case (Enum204.UPDATE_BOX_REASON_SET_REASON):
          SetSoldierUpdateBoxReason(QItem.uiSpecialEventData2);
          break;
        case (Enum204.UPDATE_BOX_REASON_SHOW_BOX):
          ShowUpdateBox();
          break;
      }
    }
    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_BEGINPREBATTLEINTERFACE) {
      // Setup face pointer
      gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
      gubCurrentTalkingID = QItem.ubCharacterNum;

      ExecuteCharacterDialogue(QItem.ubCharacterNum, QItem.usQuoteNum, QItem.iFaceIndex, QItem.bUIHandlerID, QItem.fFromSoldier);

      // Setup face with data!
      gpCurrentTalkingFace.uiFlags |= FACE_TRIGGER_PREBATTLE_INT;
      gpCurrentTalkingFace.uiUserData1 = QItem.uiSpecialEventData;
      gpCurrentTalkingFace.uiUserData2 = QItem.uiSpecialEventData2;
    }

    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SHOPKEEPER) {
      if (QItem.uiSpecialEventData < 3) {
        // post a notice if the player wants to withdraw money from thier account to cover the difference?
        zMoney = swprintf("%d", QItem.uiSpecialEventData2);
        zMoney = InsertCommasForDollarFigure(zMoney);
        zMoney = InsertDollarSignInToString(zMoney);
      }

      switch (QItem.uiSpecialEventData) {
        case (0):
          zText = swprintf(SkiMessageBoxText[Enum370.SKI_SHORT_FUNDS_TEXT], zMoney);

          // popup a message stating the player doesnt have enough money
          DoSkiMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zText, Enum26.SHOPKEEPER_SCREEN, MSG_BOX_FLAG_OK, ConfirmDontHaveEnoughForTheDealerMessageBoxCallBack);
          break;
        case (1):
          // if the player is trading items
          zText = swprintf(SkiMessageBoxText[Enum370.SKI_QUESTION_TO_DEDUCT_MONEY_FROM_PLAYERS_ACCOUNT_TO_COVER_DIFFERENCE], zMoney);

          // ask them if we should deduct money out the players account to cover the difference
          DoSkiMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zText, Enum26.SHOPKEEPER_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmToDeductMoneyFromPlayersAccountMessageBoxCallBack);

          break;
        case (2):
          zText = swprintf(SkiMessageBoxText[Enum370.SKI_QUESTION_TO_DEDUCT_MONEY_FROM_PLAYERS_ACCOUNT_TO_COVER_COST], zMoney);

          // ask them if we should deduct money out the players account to cover the difference
          DoSkiMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zText, Enum26.SHOPKEEPER_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmToDeductMoneyFromPlayersAccountMessageBoxCallBack);
          break;
        case (3):
          // this means a dialogue event is in progress
          giShopKeepDialogueEventinProgress = QItem.uiSpecialEventData2;
          break;
        case (4):
          // this means a dialogue event has ended
          giShopKeepDialogueEventinProgress = -1;
          break;
        case (5):
          // this means a dialogue event has ended
          gfSKIScreenExit = true;
          break;

        case (6):
          if (guiCurrentScreen == Enum26.SHOPKEEPER_SCREEN) {
            DisableButton(guiSKI_TransactionButton);
          }
          break;
        case (7):
          if (guiCurrentScreen == Enum26.SHOPKEEPER_SCREEN) {
            EnableButton(guiSKI_TransactionButton);
          }
          break;
      }
    }

    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_EXIT_MAP_SCREEN) {
      // select sector
      ChangeSelectedMapSector(QItem.uiSpecialEventData, QItem.uiSpecialEventData2, QItem.uiSpecialEventData3);
      RequestTriggerExitFromMapscreen(Enum144.MAP_EXIT_TO_TACTICAL);
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_DISPLAY_STAT_CHANGE) {
      // grab soldier ptr from profile ID
      pSoldier = FindSoldierByProfileID(QItem.ubCharacterNum, false);

      if (pSoldier) {
        let wTempString: string /* CHAR16[128] */;

        // tell player about stat increase
        wTempString = BuildStatChangeString(pSoldier.name, QItem.uiSpecialEventData, QItem.uiSpecialEventData2, QItem.uiSpecialEventData3);
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, wTempString);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_UNSET_ARRIVES_FLAG) {
      gTacticalStatus.bMercArrivingQuoteBeingUsed = false;
    }

    /*
    else if( QItem->uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_DISPLAY_INVASION_MESSAGE )
    {
            HandlePlayerNotifyInvasionByEnemyForces( (INT16)(QItem->uiSpecialEventData % MAP_WORLD_X), (INT16)(QItem->uiSpecialEventData / MAP_WORLD_X), 0, NULL );
    }
    */
    else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SKYRIDERMAPSCREENEVENT) {
      // Setup face pointer
      gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
      gubCurrentTalkingID = QItem.ubCharacterNum;

      // handle the monologue event
      HandleSkyRiderMonologueEvent(QItem.uiSpecialEventData, QItem.uiSpecialEventData2);
    }

    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_MINESECTOREVENT) {
      // Setup face pointer
      gpCurrentTalkingFace = gFacesData[QItem.iFaceIndex];
      gubCurrentTalkingID = QItem.ubCharacterNum;

      // set up the mine highlgith events
      SetUpAnimationOfMineSectors(QItem.uiSpecialEventData);
    }

    // Switch on our special events
    if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_GIVE_ITEM) {
      if (QItem.bUIHandlerID == DIALOGUE_NPC_UI) {
        HandleNPCItemGiven(QItem.uiSpecialEventData, QItem.uiSpecialEventData2, QItem.uiSpecialEventData3);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_TRIGGER_NPC) {
      if (QItem.bUIHandlerID == DIALOGUE_NPC_UI) {
        HandleNPCTriggerNPC(QItem.uiSpecialEventData, QItem.uiSpecialEventData2, QItem.uiSpecialEventData3, QItem.uiSpecialEventData4);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_GOTO_GRIDNO) {
      if (QItem.bUIHandlerID == DIALOGUE_NPC_UI) {
        HandleNPCGotoGridNo(QItem.uiSpecialEventData, QItem.uiSpecialEventData2, QItem.uiSpecialEventData3);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_DO_ACTION) {
      if (QItem.bUIHandlerID == DIALOGUE_NPC_UI) {
        HandleNPCDoAction(QItem.uiSpecialEventData, QItem.uiSpecialEventData2, QItem.uiSpecialEventData3);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_CLOSE_PANEL) {
      if (QItem.bUIHandlerID == DIALOGUE_NPC_UI) {
        HandleNPCClosePanel();
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SHOW_UPDATE_MENU) {
      SetUpdateBoxFlag(true);
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_CONTINUE_TRAINING_MILITIA) {
      // grab soldier ptr from profile ID
      pSoldier = FindSoldierByProfileID((QItem.uiSpecialEventData), false);

      // if soldier valid...
      if (pSoldier != null) {
        HandleInterfaceMessageForContinuingTrainingMilitia(pSoldier);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_ENTER_MAPSCREEN) {
      if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
        gfEnteringMapScreen = 1;
        fEnterMapDueToContract = true;
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING) {
      // grab soldier ptr from profile ID
      pSoldier = FindSoldierByProfileID(QItem.ubCharacterNum, false);

      // if soldier valid...
      if (pSoldier != null) {
        // .. remove the fired soldier again
        BeginStrategicRemoveMerc(pSoldier, QItem.uiSpecialEventData);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_CONTRACT_ENDING_NO_ASK_EQUIP) {
      // grab soldier ptr from profile ID
      pSoldier = FindSoldierByProfileID(QItem.ubCharacterNum, false);

      // if soldier valid...
      if (pSoldier != null) {
        // .. remove the fired soldier again
        StrategicRemoveMerc(pSoldier);
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_MULTIPURPOSE) {
      if (QItem.uiSpecialEventData & MULTIPURPOSE_SPECIAL_EVENT_DONE_KILLING_DEIDRANNA) {
        HandleDoneLastKilledQueenQuote();
      } else if (QItem.uiSpecialEventData & MULTIPURPOSE_SPECIAL_EVENT_TEAM_MEMBERS_DONE_TALKING) {
        HandleDoneLastEndGameQuote();
      }
    } else if (QItem.uiSpecialEventFlag & DIALOGUE_SPECIAL_EVENT_SLEEP) {
      // no soldier, leave now
      if (pSoldier == null) {
        return;
      }

      // wake merc up or put them back down?
      if (QItem.uiSpecialEventData == 1) {
        pSoldier.fMercAsleep = true;
      } else {
        pSoldier.fMercAsleep = false;
      }

      // refresh map screen
      fCharacterInfoPanelDirty = true;
      fTeamPanelDirty = true;
    }
  }

  // grab soldier ptr from profile ID
  pSoldier = FindSoldierByProfileID(QItem.ubCharacterNum, false);

  if (pSoldier && pSoldier.bTeam == gbPlayerNum) {
    CheckForStopTimeQuotes(QItem.usQuoteNum);
  }

  if (QItem.fPauseTime) {
    fWasPausedDuringDialogue = true;
  }
}

export function DelayedTacticalCharacterDialogue(pSoldier: SOLDIERTYPE, usQuoteNum: UINT16): boolean {
  if (pSoldier.ubProfile == NO_PROFILE) {
    return false;
  }

  if (pSoldier.bLife < CONSCIOUSNESS)
    return false;

  if (pSoldier.uiStatusFlags & SOLDIER_GASSED)
    return false;

  if ((AM_A_ROBOT(pSoldier))) {
    return false;
  }

  if (pSoldier.bLife < OKLIFE && usQuoteNum != Enum202.QUOTE_SERIOUSLY_WOUNDED)
    return false;

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    return false;
  }

  return CharacterDialogue(pSoldier.ubProfile, usQuoteNum, pSoldier.iFaceIndex, DIALOGUE_TACTICAL_UI, true, true);
}

export function TacticalCharacterDialogueWithSpecialEvent(pSoldier: SOLDIERTYPE, usQuoteNum: UINT16, uiFlag: UINT32, uiData1: any, uiData2: any): boolean {
  if (pSoldier.ubProfile == NO_PROFILE) {
    return false;
  }

  if (uiFlag != DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND && uiData1 != Enum259.BATTLE_SOUND_DIE1) {
    if (pSoldier.bLife < CONSCIOUSNESS)
      return false;

    if (pSoldier.uiStatusFlags & SOLDIER_GASSED)
      return false;
  }

  return CharacterDialogueWithSpecialEvent(pSoldier.ubProfile, usQuoteNum, pSoldier.iFaceIndex, DIALOGUE_TACTICAL_UI, true, false, uiFlag, uiData1, uiData2);
}

export function TacticalCharacterDialogueWithSpecialEventEx(pSoldier: SOLDIERTYPE, usQuoteNum: UINT16, uiFlag: UINT32, uiData1: UINT32, uiData2: UINT32, uiData3: UINT32): boolean {
  if (pSoldier.ubProfile == NO_PROFILE) {
    return false;
  }

  if (uiFlag != DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND && uiData1 != Enum259.BATTLE_SOUND_DIE1) {
    if (pSoldier.bLife < CONSCIOUSNESS)
      return false;

    if (pSoldier.uiStatusFlags & SOLDIER_GASSED)
      return false;

    if ((AM_A_ROBOT(pSoldier))) {
      return false;
    }

    if (pSoldier.bLife < OKLIFE && usQuoteNum != Enum202.QUOTE_SERIOUSLY_WOUNDED)
      return false;

    if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
      return false;
    }
  }

  return CharacterDialogueWithSpecialEventEx(pSoldier.ubProfile, usQuoteNum, pSoldier.iFaceIndex, DIALOGUE_TACTICAL_UI, true, false, uiFlag, uiData1, uiData2, uiData3);
}

export function TacticalCharacterDialogue(pSoldier: SOLDIERTYPE, usQuoteNum: UINT16): boolean {
  if (pSoldier.ubProfile == NO_PROFILE) {
    return false;
  }

  if (AreInMeanwhile()) {
    return false;
  }

  if (pSoldier.bLife < CONSCIOUSNESS)
    return false;

  if (pSoldier.bLife < OKLIFE && usQuoteNum != Enum202.QUOTE_SERIOUSLY_WOUNDED)
    return false;

  if (pSoldier.uiStatusFlags & SOLDIER_GASSED)
    return false;

  if ((AM_A_ROBOT(pSoldier))) {
    return false;
  }

  if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
    return false;
  }

  // OK, let's check if this is the exact one we just played, if so, skip.
  if (pSoldier.ubProfile == gTacticalStatus.ubLastQuoteProfileNUm && usQuoteNum == gTacticalStatus.ubLastQuoteSaid) {
    return false;
  }

  // If we are a robot, play the controller's quote!
  if (pSoldier.uiStatusFlags & SOLDIER_ROBOT) {
    if (CanRobotBeControlled(pSoldier)) {
      return TacticalCharacterDialogue(MercPtrs[pSoldier.ubRobotRemoteHolderID], usQuoteNum);
    } else {
      return false;
    }
  }

  if (AM_AN_EPC(pSoldier) && !(gMercProfiles[pSoldier.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_FORCENPCQUOTE))
    return false;

  // Check for logging of me too bleeds...
  if (usQuoteNum == Enum202.QUOTE_STARTING_TO_BLEED) {
    if (gubLogForMeTooBleeds) {
      // If we are greater than one...
      if (gubLogForMeTooBleeds > 1) {
        // Replace with me too....
        usQuoteNum = Enum202.QUOTE_ME_TOO;
      }
      gubLogForMeTooBleeds++;
    }
  }

  return CharacterDialogue(pSoldier.ubProfile, usQuoteNum, pSoldier.iFaceIndex, DIALOGUE_TACTICAL_UI, true, false);
}

// This function takes a profile num, quote num, faceindex and a UI hander ID.
// What it does is queues up the dialog to be ultimately loaded/displayed
//				FACEINDEX
//						The face index is an index into an ACTIVE face. The face is considered to
//						be active, and if it's not, either that has to be handled by the UI handler
//						ir nothing will show.  What this function does is set the face to talking,
//						and the face sprite system should handle the rest.
//				bUIHandlerID
//						Because this could be used in any place, the UI handleID is used to differentiate
//						places in the game. For example, specific things happen in the tactical engine
//						that may not be the place where in the AIM contract screen uses.....

// NB;				The queued system is not yet implemented, but will be transpatent to the caller....

export function CharacterDialogueWithSpecialEvent(ubCharacterNum: UINT8, usQuoteNum: UINT16, iFaceIndex: INT32, bUIHandlerID: UINT8, fFromSoldier: boolean, fDelayed: boolean, uiFlag: UINT32, uiData1: any, uiData2: any): boolean {
  let QItem: DIALOGUE_Q_STRUCT;

  // Allocate new item
  QItem = createDialogueQStruct();

  QItem.ubCharacterNum = ubCharacterNum;
  QItem.usQuoteNum = usQuoteNum;
  QItem.iFaceIndex = iFaceIndex;
  QItem.bUIHandlerID = bUIHandlerID;
  QItem.iTimeStamp = GetJA2Clock();
  QItem.fFromSoldier = fFromSoldier;
  QItem.fDelayed = fDelayed;

  // Set flag for special event
  QItem.uiSpecialEventFlag = uiFlag;
  QItem.uiSpecialEventData = uiData1;
  QItem.uiSpecialEventData2 = uiData2;

  // Add to queue
  ghDialogueQ.push(QItem);

  if (uiFlag & DIALOGUE_SPECIAL_EVENT_PCTRIGGERNPC) {
    // Increment refrence count...
    giNPCReferenceCount++;
  }

  return true;
}

function CharacterDialogueWithSpecialEventEx(ubCharacterNum: UINT8, usQuoteNum: UINT16, iFaceIndex: INT32, bUIHandlerID: UINT8, fFromSoldier: boolean, fDelayed: boolean, uiFlag: UINT32, uiData1: UINT32, uiData2: UINT32, uiData3: UINT32): boolean {
  let QItem: DIALOGUE_Q_STRUCT;

  // Allocate new item
  QItem = createDialogueQStruct();

  QItem.ubCharacterNum = ubCharacterNum;
  QItem.usQuoteNum = usQuoteNum;
  QItem.iFaceIndex = iFaceIndex;
  QItem.bUIHandlerID = bUIHandlerID;
  QItem.iTimeStamp = GetJA2Clock();
  QItem.fFromSoldier = fFromSoldier;
  QItem.fDelayed = fDelayed;

  // Set flag for special event
  QItem.uiSpecialEventFlag = uiFlag;
  QItem.uiSpecialEventData = uiData1;
  QItem.uiSpecialEventData2 = uiData2;
  QItem.uiSpecialEventData3 = uiData3;

  // Add to queue
  ghDialogueQ.push(QItem);

  if (uiFlag & DIALOGUE_SPECIAL_EVENT_PCTRIGGERNPC) {
    // Increment refrence count...
    giNPCReferenceCount++;
  }

  return true;
}

export function CharacterDialogue(ubCharacterNum: UINT8, usQuoteNum: UINT16, iFaceIndex: INT32, bUIHandlerID: UINT8, fFromSoldier: boolean, fDelayed: boolean): boolean {
  let QItem: DIALOGUE_Q_STRUCT;

  // Allocate new item
  QItem = createDialogueQStruct();

  QItem.ubCharacterNum = ubCharacterNum;
  QItem.usQuoteNum = usQuoteNum;
  QItem.iFaceIndex = iFaceIndex;
  QItem.bUIHandlerID = bUIHandlerID;
  QItem.iTimeStamp = GetJA2Clock();
  QItem.fFromSoldier = fFromSoldier;
  QItem.fDelayed = fDelayed;

  // check if pause already locked, if so, then don't mess with it
  if (gfLockPauseState == false) {
    QItem.fPauseTime = fPausedTimeDuringQuote;
  }

  fPausedTimeDuringQuote = false;

  // Add to queue
  ghDialogueQ.push(QItem);

  return true;
}

export function SpecialCharacterDialogueEvent(uiSpecialEventFlag: UINT32, uiSpecialEventData1: any, uiSpecialEventData2: any, uiSpecialEventData3: any, iFaceIndex: INT32, bUIHandlerID: UINT8): boolean {
  let QItem: DIALOGUE_Q_STRUCT;

  // Allocate new item
  QItem = createDialogueQStruct();

  QItem.uiSpecialEventFlag = uiSpecialEventFlag;
  QItem.uiSpecialEventData = uiSpecialEventData1;
  QItem.uiSpecialEventData2 = uiSpecialEventData2;
  QItem.uiSpecialEventData3 = uiSpecialEventData3;
  QItem.iFaceIndex = iFaceIndex;
  QItem.bUIHandlerID = bUIHandlerID;
  QItem.iTimeStamp = GetJA2Clock();

  // if paused state not already locked
  if (gfLockPauseState == false) {
    QItem.fPauseTime = fPausedTimeDuringQuote;
  }

  fPausedTimeDuringQuote = false;

  // Add to queue
  ghDialogueQ.push(QItem);

  return true;
}

export function SpecialCharacterDialogueEventWithExtraParam(uiSpecialEventFlag: UINT32, uiSpecialEventData1: any, uiSpecialEventData2: any, uiSpecialEventData3: any, uiSpecialEventData4: any, iFaceIndex: INT32, bUIHandlerID: UINT8): boolean {
  let QItem: DIALOGUE_Q_STRUCT;

  // Allocate new item
  QItem = createDialogueQStruct();

  QItem.uiSpecialEventFlag = uiSpecialEventFlag;
  QItem.uiSpecialEventData = uiSpecialEventData1;
  QItem.uiSpecialEventData2 = uiSpecialEventData2;
  QItem.uiSpecialEventData3 = uiSpecialEventData3;
  QItem.uiSpecialEventData4 = uiSpecialEventData4;
  QItem.iFaceIndex = iFaceIndex;
  QItem.bUIHandlerID = bUIHandlerID;
  QItem.iTimeStamp = GetJA2Clock();

  // if paused state not already locked
  if (gfLockPauseState == false) {
    QItem.fPauseTime = fPausedTimeDuringQuote;
  }

  fPausedTimeDuringQuote = false;

  // Add to queue
  ghDialogueQ.push(QItem);

  return true;
}

function ExecuteCharacterDialogue(ubCharacterNum: UINT8, usQuoteNum: UINT16, iFaceIndex: INT32, bUIHandlerID: UINT8, fFromSoldier: boolean): boolean {
  let zSoundString: string /* CHAR8[164] */ = '';
  let uiSoundID: UINT32 = 0;
  let pSoldier: SOLDIERTYPE | null;

  // Check if we are dead now or not....( if from a soldier... )

  // Try to find soldier...
  pSoldier = FindSoldierByProfileID(ubCharacterNum, true);

  if (pSoldier != null) {
    // Check vital stats
    if (pSoldier.bLife < CONSCIOUSNESS) {
      return false;
    }

    if (pSoldier.uiStatusFlags & SOLDIER_GASSED)
      return false;

    if ((AM_A_ROBOT(pSoldier))) {
      return false;
    }

    if (pSoldier.bLife < OKLIFE && usQuoteNum != Enum202.QUOTE_SERIOUSLY_WOUNDED) {
      return false;
    }

    if (pSoldier.bAssignment == Enum117.ASSIGNMENT_POW) {
      return false;
    }

    // sleeping guys don't talk.. go to standby to talk
    if (pSoldier.fMercAsleep == true) {
      // check if the soldier was compaining about lack of sleep and was alseep, if so, leave them alone
      if ((usQuoteNum == Enum202.QUOTE_NEED_SLEEP) || (usQuoteNum == Enum202.QUOTE_OUT_OF_BREATH)) {
        // leave them alone
        return true;
      }

      // may want to wake up any character that has VERY important dialogue to say
      // MC to flesh out
    }

    // now being used in a different way...
    /*
    if ( ( (usQuoteNum == QUOTE_PERSONALITY_TRAIT &&
                            (gMercProfiles[ubCharacterNum].bPersonalityTrait == FORGETFUL ||
                             gMercProfiles[ubCharacterNum].bPersonalityTrait == CLAUSTROPHOBIC ||
                             gMercProfiles[ubCharacterNum].bPersonalityTrait == NERVOUS ||
                             gMercProfiles[ubCharacterNum].bPersonalityTrait == NONSWIMMER ||
                             gMercProfiles[ubCharacterNum].bPersonalityTrait == FEAR_OF_INSECTS))
                            //usQuoteNum == QUOTE_STARTING_TO_WHINE ||
#ifdef JA2BETAVERSION
                            || usQuoteNum == QUOTE_WHINE_EQUIPMENT) && (guiCurrentScreen != QUEST_DEBUG_SCREEN) )
#else
) )
#endif

    {
            // This quote might spawn another quote from someone
            iLoop = 0;
            for ( pTeamSoldier = MercPtrs[ iLoop ]; iLoop <= gTacticalStatus.Team[ gbPlayerNum ].bLastID; iLoop++,pTeamSoldier++ )
            {
                    if ( (pTeamSoldier->ubProfile != ubCharacterNum) && (OK_INSECTOR_MERC( pTeamSoldier )) && (SpacesAway( pSoldier->sGridNo, pTeamSoldier->sGridNo ) < 5) )
                    {
                            // if this merc disliked the whining character sufficiently and hasn't already retorted
                            if ( gMercProfiles[ pTeamSoldier->ubProfile ].bMercOpinion[ ubCharacterNum ] < -2 && !( pTeamSoldier->usQuoteSaidFlags & SOLDIER_QUOTE_SAID_ANNOYING_MERC ) )
                            {
                                    // make a comment!
                                    TacticalCharacterDialogue( pTeamSoldier, QUOTE_ANNOYING_PC );
                                    pTeamSoldier->usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_ANNOYING_MERC;
                                    break;
                            }
                    }
            }
    }
    */
  } else {
    // If from a soldier, and he does not exist anymore, donot play!
    if (fFromSoldier) {
      return false;
    }
  }

  // Check face index
  if (iFaceIndex == -1) {
    return false;
  }

  if (!GetDialogue(ubCharacterNum, usQuoteNum, DIALOGUESIZE, gzQuoteStr__Pointer, createPointer(() => uiSoundID, (v) => uiSoundID = v), createPointer(() => zSoundString, (v) => zSoundString = v))) {
    return false;
  }

  if (bUIHandlerID == DIALOGUE_EXTERNAL_NPC_UI) {
    // external NPC
    SetFaceTalking(iFaceIndex, zSoundString, gzQuoteStr, RATE_11025, 30, 1, MIDDLEPAN);
  } else {
    // start "talking" system (portrait animation and start wav sample)
    SetFaceTalking(iFaceIndex, zSoundString, gzQuoteStr, RATE_11025, 30, 1, MIDDLEPAN);
  }
  // pSoldier can be null here... ( if NOT from an alive soldier )
  CreateTalkingUI(bUIHandlerID, iFaceIndex, ubCharacterNum, <SOLDIERTYPE>pSoldier, gzQuoteStr);

  // Set global handleer ID value, used when face desides it's done...
  gbUIHandlerID = bUIHandlerID;

  guiScreenIDUsedWhenUICreated = guiCurrentScreen;

  return true;
}

function CreateTalkingUI(bUIHandlerID: INT8, iFaceIndex: INT32, ubCharacterNum: UINT8, pSoldier: SOLDIERTYPE, zQuoteStr: string /* Pointer<INT16> */): void {
  // Show text, if on
  if (gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES] || !gFacesData[iFaceIndex].fValidSpeech) {
    switch (bUIHandlerID) {
      case DIALOGUE_TACTICAL_UI:

        HandleTacticalTextUI(iFaceIndex, pSoldier, zQuoteStr);
        break;

      case DIALOGUE_NPC_UI:

        HandleTacticalNPCTextUI(ubCharacterNum, zQuoteStr);
        break;

      case DIALOGUE_CONTACTPAGE_UI:
        DisplayTextForMercFaceVideoPopUp(zQuoteStr);
        break;

      case DIALOGUE_SPECK_CONTACT_PAGE_UI:
        DisplayTextForSpeckVideoPopUp(zQuoteStr);
        break;
      case DIALOGUE_EXTERNAL_NPC_UI:

        DisplayTextForExternalNPC(ubCharacterNum, zQuoteStr);
        break;

      case DIALOGUE_SHOPKEEPER_UI:
        InitShopKeeperSubTitledText(zQuoteStr);
        break;
    }
  }

  if (gGameSettings.fOptions[Enum8.TOPTION_SPEECH]) {
    switch (bUIHandlerID) {
      case DIALOGUE_TACTICAL_UI:

        HandleTacticalSpeechUI(ubCharacterNum, iFaceIndex);
        break;

      case DIALOGUE_CONTACTPAGE_UI:
        break;

      case DIALOGUE_SPECK_CONTACT_PAGE_UI:
        break;
      case DIALOGUE_EXTERNAL_NPC_UI:
        HandleExternNPCSpeechFace(iFaceIndex);
        break;
    }
  }
}

/* static */ let GetDialogueDataFilename__zFileName: string /* UINT8[164] */;
function GetDialogueDataFilename(ubCharacterNum: UINT8, usQuoteNum: UINT16, fWavFile: boolean): string /* Pointer<INT8> */ {
  let ubFileNumID: UINT8;

  // Are we an NPC OR an RPC that has not been recruited?
  // ATE: Did the || clause here to allow ANY RPC that talks while the talking menu is up to use an npc quote file
  if (gfUseAlternateDialogueFile) {
    if (fWavFile) {
// build name of wav file (characternum + quotenum)
// FIXME: Language-specific code
// #ifdef RUSSIAN
//       sprintf(zFileName, "NPC_SPEECH\\g_%03d_%03d.wav", ubCharacterNum, usQuoteNum);
// #else
      GetDialogueDataFilename__zFileName = sprintf("NPC_SPEECH\\d_%s_%s.wav", ubCharacterNum.toString().padStart(3, '0'), usQuoteNum.toString().padStart(3, '0'));
// #endif
    } else {
      // assume EDT files are in EDT directory on HARD DRIVE
      GetDialogueDataFilename__zFileName = sprintf("NPCDATA\\d_%s.EDT", ubCharacterNum.toString().padStart(3, '0'));
    }
  } else if (ubCharacterNum >= FIRST_RPC && (!(gMercProfiles[ubCharacterNum].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) || ProfileCurrentlyTalkingInDialoguePanel(ubCharacterNum) || (gMercProfiles[ubCharacterNum].ubMiscFlags & PROFILE_MISC_FLAG_FORCENPCQUOTE))) {
    ubFileNumID = ubCharacterNum;

    // ATE: If we are merc profile ID #151-154, all use 151's data....
    if (ubCharacterNum >= 151 && ubCharacterNum <= 154) {
      ubFileNumID = 151;
    }

    // If we are character #155, check fact!
    if (ubCharacterNum == 155 && !gubFact[220]) {
      ubFileNumID = 155;
    }

    if (fWavFile) {
      GetDialogueDataFilename__zFileName = sprintf("NPC_SPEECH\\%s_%s.wav", ubFileNumID.toString().padStart(3, '0'), usQuoteNum.toString().padStart(3, '0'));
    } else {
      // assume EDT files are in EDT directory on HARD DRIVE
      GetDialogueDataFilename__zFileName = sprintf("NPCDATA\\%s.EDT", ubFileNumID.toString().padStart(3, '0'));
    }
  } else {
    if (fWavFile) {
// FIXME: Language-specific code
// #ifdef RUSSIAN
//       if (ubCharacterNum >= FIRST_RPC && gMercProfiles[ubCharacterNum].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) {
//         sprintf(zFileName, "SPEECH\\r_%03d_%03d.wav", ubCharacterNum, usQuoteNum);
//       } else
// #endif
      {
        // build name of wav file (characternum + quotenum)
        GetDialogueDataFilename__zFileName = sprintf("SPEECH\\%s_%s.wav", ubCharacterNum.toString().padStart(3, '0'), usQuoteNum.toString().padStart(3, '0'));
      }
    } else {
      // assume EDT files are in EDT directory on HARD DRIVE
      GetDialogueDataFilename__zFileName = sprintf("MERCEDT\\%s.EDT", ubCharacterNum.toString().padStart(3, '0'));
    }
  }

  return GetDialogueDataFilename__zFileName;
}

// Used to see if the dialog text file exists
export function DialogueDataFileExistsForProfile(ubCharacterNum: UINT8, usQuoteNum: UINT16, fWavFile: boolean, ppStr: Pointer<string> | null): boolean {
  let pFilename: string /* Pointer<UINT8> */;

  pFilename = GetDialogueDataFilename(ubCharacterNum, usQuoteNum, fWavFile);

  if (ppStr) {
    (ppStr.value) = pFilename;
  }

  return FileExists(pFilename);
}

function GetDialogue(ubCharacterNum: UINT8, usQuoteNum: UINT16, iDataSize: UINT32, zDialogueText: Pointer<string> /* Pointer<UINT16> */, puiSoundID: Pointer<UINT32>, zSoundString: Pointer<string> /* Pointer<CHAR8> */): boolean {
  let pFilename: string /* Pointer<UINT8> */ = '';

  // first things first  - grab the text (if player has SUBTITLE PREFERENCE ON)
  // if ( gGameSettings.fOptions[ TOPTION_SUBTITLES ] )
  {
    if (DialogueDataFileExistsForProfile(ubCharacterNum, 0, false, createPointer(() => pFilename, (v) => pFilename = v))) {
      zDialogueText.value = LoadEncryptedDataFromFile(pFilename, usQuoteNum * iDataSize, iDataSize);
      if (zDialogueText.value == '') {
        zDialogueText.value = swprintf("I have no text in the EDT file ( %d ) %s", usQuoteNum, pFilename);

        return false;
      }
    } else {
      zDialogueText.value = swprintf("I have no text in the file ( %d ) %s", usQuoteNum, pFilename);

      return false;
    }
  }

  // CHECK IF THE FILE EXISTS, IF NOT, USE DEFAULT!
  pFilename = GetDialogueDataFilename(ubCharacterNum, usQuoteNum, true);

  // Copy
  zSoundString.value = pFilename;

  // Double check it exists....

  //#ifndef JA2TESTVERSION

  /*
    if ( !FileExists( pFilename ) )
    {
                  CHAR8 sString[512];

                  sprintf( sString, "ERROR: Missing file for character # %d, quote # %d", ubCharacterNum, usQuoteNum );
      ShowCursor(TRUE);
      ShowCursor(TRUE);
      ShutdownWithErrorBox( sString );
    }
  */

  //#endif

  // get speech if applicable
  if (gGameSettings.fOptions[Enum8.TOPTION_SPEECH]) {
    // Load it into memory!
    puiSoundID.value = SoundLoadSample(pFilename);
  }

  return true;
}

// Handlers for tactical UI stuff
function HandleTacticalNPCTextUI(ubCharacterNum: UINT8, zQuoteStr: string /* Pointer<INT16> */): void {
  let zText: string /* INT16[QUOTE_MESSAGE_SIZE] */;

  // Setup dialogue text box
  if (guiCurrentScreen != Enum26.MAP_SCREEN) {
    gTalkPanel.fRenderSubTitlesNow = true;
    gTalkPanel.fSetupSubTitles = true;
  }

  // post message to mapscreen message system
  gTalkPanel.zQuoteStr = swprintf("\"%s\"", zQuoteStr);
  zText = swprintf("%s: \"%s\"", gMercProfiles[ubCharacterNum].zNickname, zQuoteStr);
  MapScreenMessage(FONT_MCOLOR_WHITE, MSG_DIALOG, "%s", zText);
}

// Handlers for tactical UI stuff
function DisplayTextForExternalNPC(ubCharacterNum: UINT8, zQuoteStr: string /* STR16 */): void {
  let zText: string /* INT16[QUOTE_MESSAGE_SIZE] */;
  let sLeft: INT16;

  // Setup dialogue text box
  if (guiCurrentScreen != Enum26.MAP_SCREEN) {
    gTalkPanel.fRenderSubTitlesNow = true;
    gTalkPanel.fSetupSubTitles = true;
  }

  // post message to mapscreen message system
  gTalkPanel.zQuoteStr = swprintf("\"%s\"", zQuoteStr);
  zText = swprintf("%s: \"%s\"", gMercProfiles[ubCharacterNum].zNickname, zQuoteStr);
  MapScreenMessage(FONT_MCOLOR_WHITE, MSG_DIALOG, "%s", zText);

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    sLeft = (gsExternPanelXPosition + 97);
    gsTopPosition = gsExternPanelYPosition;
  } else {
    sLeft = (110);
  }

  ExecuteTacticalTextBox(sLeft, gTalkPanel.zQuoteStr);

  return;
}

function HandleTacticalTextUI(iFaceIndex: INT32, pSoldier: SOLDIERTYPE, zQuoteStr: string /* Pointer<INT16> */): void {
  let zText: string /* INT16[QUOTE_MESSAGE_SIZE] */;
  let sLeft: INT16 = 0;

  // BUild text
  // How do we do this with defines?
  // swprintf( zText, L"\xb4\xa2 %s: \xb5 \"%s\"", gMercProfiles[ ubCharacterNum ].zNickname, zQuoteStr );
  zText = swprintf("\"%s\"", zQuoteStr);
  sLeft = 110;

  // previous version
  // sLeft = 110;

  ExecuteTacticalTextBox(sLeft, zText);

  zText = swprintf("%s: \"%s\"", gMercProfiles[pSoldier.ubProfile].zNickname, zQuoteStr);
  MapScreenMessage(FONT_MCOLOR_WHITE, MSG_DIALOG, "%s", zText);
}

function ExecuteTacticalTextBoxForLastQuote(sLeftPosition: INT16, pString: string /* STR16 */): void {
  let uiDelay: UINT32 = FindDelayForString(pString);

  fDialogueBoxDueToLastMessage = true;

  guiDialogueLastQuoteTime = GetJA2Clock();

  guiDialogueLastQuoteDelay = ((uiDelay < FINAL_TALKING_DURATION) ? FINAL_TALKING_DURATION : uiDelay);

  // now execute box
  ExecuteTacticalTextBox(sLeftPosition, pString);
}

function ExecuteTacticalTextBox(sLeftPosition: INT16, pString: string /* STR16 */): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  // check if mouse region created, if so, do not recreate
  if (fTextBoxMouseRegionCreated == true) {
    return;
  }

  // Prepare text box
  SET_USE_WINFONTS(true);
  SET_WINFONT(giSubTitleWinFont);
  iDialogueBox = PrepareMercPopupBox(iDialogueBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, pString, DIALOGUE_DEFAULT_SUBTITLE_WIDTH, 0, 0, 0, gusSubtitleBoxWidth__Pointer, gusSubtitleBoxHeight__Pointer);
  SET_USE_WINFONTS(false);

  VideoOverlayDesc.sLeft = sLeftPosition;
  VideoOverlayDesc.sTop = gsTopPosition;
  VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + gusSubtitleBoxWidth;
  VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + gusSubtitleBoxHeight;
  VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
  VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
  VideoOverlayDesc.BltCallback = RenderSubtitleBoxOverlay;

  giTextBoxOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);

  gsTopPosition = 20;

  // Define main region
  MSYS_DefineRegion(gTextBoxMouseRegion, VideoOverlayDesc.sLeft, VideoOverlayDesc.sTop, VideoOverlayDesc.sRight, VideoOverlayDesc.sBottom, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, TextOverlayClickCallback);
  // Add region
  MSYS_AddRegion(gTextBoxMouseRegion);

  fTextBoxMouseRegionCreated = true;
}

function HandleExternNPCSpeechFace(iIndex: INT32): void {
  let iFaceIndex: INT32;
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
  let iFaceOverlay: INT32;

  // grab face index
  iFaceIndex = iIndex;

  // Enable it!
  SetAutoFaceActive(FACE_AUTO_DISPLAY_BUFFER, FACE_AUTO_RESTORE_BUFFER, iFaceIndex, 0, 0);

  // Set flag to say WE control when to set inactive!
  gFacesData[iFaceIndex].uiFlags |= FACE_INACTIVE_HANDLED_ELSEWHERE;

  if (guiCurrentScreen != Enum26.MAP_SCREEN) {
    // Setup video overlay!
    VideoOverlayDesc.sLeft = 10;
    VideoOverlayDesc.sTop = 20;
    VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + 99;
    VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + 98;
    VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
    VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
    VideoOverlayDesc.BltCallback = RenderFaceOverlay;
  } else {
    // Setup video overlay!

    VideoOverlayDesc.sLeft = gsExternPanelXPosition;
    VideoOverlayDesc.sTop = gsExternPanelYPosition;

    VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + 99;
    VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + 98;
    VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
    VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
    VideoOverlayDesc.BltCallback = RenderFaceOverlay;
  }

  iFaceOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);
  (<FACETYPE>gpCurrentTalkingFace).iVideoOverlay = iFaceOverlay;

  RenderAutoFace(iFaceIndex);

  // ATE: Create mouse region.......
  if (!fExternFaceBoxRegionCreated) {
    fExternFaceBoxRegionCreated = true;

    // Define main region
    MSYS_DefineRegion(gFacePopupMouseRegion, VideoOverlayDesc.sLeft, VideoOverlayDesc.sTop, VideoOverlayDesc.sRight, VideoOverlayDesc.sBottom, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, FaceOverlayClickCallback);
    // Add region
    MSYS_AddRegion(gFacePopupMouseRegion);
  }

  gfFacePanelActive = true;

  return;
}

function HandleTacticalSpeechUI(ubCharacterNum: UINT8, iFaceIndex: INT32): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
  let iFaceOverlay: INT32;
  let pSoldier: SOLDIERTYPE | null;
  let fDoExternPanel: boolean = false;

  // Get soldier pointer, if there is one...
  // Try to find soldier...
  pSoldier = FindSoldierByProfileID(ubCharacterNum, false);

  // PLEASE NOTE:  pSoldier may legally be NULL (e.g. Skyrider) !!!

  if (pSoldier == null) {
    fDoExternPanel = true;
  } else {
    // If we are not an active face!
    if (guiCurrentScreen != Enum26.MAP_SCREEN) {
      fDoExternPanel = true;
    }
  }

  if (fDoExternPanel) {
    // Enable it!
    SetAutoFaceActive(FACE_AUTO_DISPLAY_BUFFER, FACE_AUTO_RESTORE_BUFFER, iFaceIndex, 0, 0);

    // Set flag to say WE control when to set inactive!
    gFacesData[iFaceIndex].uiFlags |= (FACE_INACTIVE_HANDLED_ELSEWHERE | FACE_MAKEACTIVE_ONCE_DONE);

    // IF we are in tactical and this soldier is on the current squad
    if ((guiCurrentScreen == Enum26.GAME_SCREEN) && (pSoldier != null) && (pSoldier.bAssignment == iCurrentTacticalSquad)) {
      // Make the interface panel dirty..
      // This will dirty the panel next frame...
      gfRerenderInterfaceFromHelpText = true;
    }

    // Setup video overlay!
    VideoOverlayDesc.sLeft = 10;
    VideoOverlayDesc.sTop = 20;
    VideoOverlayDesc.sRight = VideoOverlayDesc.sLeft + 99;
    VideoOverlayDesc.sBottom = VideoOverlayDesc.sTop + 98;
    VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
    VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
    VideoOverlayDesc.BltCallback = RenderFaceOverlay;

    iFaceOverlay = RegisterVideoOverlay(0, VideoOverlayDesc);
    (<FACETYPE>gpCurrentTalkingFace).iVideoOverlay = iFaceOverlay;

    RenderAutoFace(iFaceIndex);

    // ATE: Create mouse region.......
    if (!fExternFaceBoxRegionCreated) {
      fExternFaceBoxRegionCreated = true;

      // Define main region
      MSYS_DefineRegion(gFacePopupMouseRegion, VideoOverlayDesc.sLeft, VideoOverlayDesc.sTop, VideoOverlayDesc.sRight, VideoOverlayDesc.sBottom, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, FaceOverlayClickCallback);
      // Add region
      MSYS_AddRegion(gFacePopupMouseRegion);
    }

    gfFacePanelActive = true;
  } else if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    // Are we in mapscreen?
    // If so, set current guy active to talk.....
    if (pSoldier != null) {
      ContinueDialogue(pSoldier, false);
    }
  }
}

export function HandleDialogueEnd(pFace: FACETYPE): void {
  if (gGameSettings.fOptions[Enum8.TOPTION_SPEECH]) {
    if (pFace != gpCurrentTalkingFace) {
      // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"HandleDialogueEnd() face mismatch." );
      return;
    }

    if (pFace.fTalking) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "HandleDialogueEnd() face still talking.");
      return;
    }

    switch (gbUIHandlerID) {
      case DIALOGUE_TACTICAL_UI:

        if (gfFacePanelActive) {
          // Set face inactive!
          pFace.fCanHandleInactiveNow = true;
          SetAutoFaceInActive(pFace.iID);
          gfFacePanelActive = false;

          if (fExternFaceBoxRegionCreated) {
            fExternFaceBoxRegionCreated = false;
            MSYS_RemoveRegion(gFacePopupMouseRegion);
          }
        }
        break;
      case DIALOGUE_NPC_UI:
        break;
      case DIALOGUE_EXTERNAL_NPC_UI:
        pFace.fCanHandleInactiveNow = true;
        SetAutoFaceInActive(pFace.iID);
        gfFacePanelActive = false;

        if (fExternFaceBoxRegionCreated) {
          fExternFaceBoxRegionCreated = false;
          MSYS_RemoveRegion(gFacePopupMouseRegion);
        }

        break;
    }
  }

  if (gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES] || !pFace.fValidSpeech) {
    switch (gbUIHandlerID) {
      case DIALOGUE_TACTICAL_UI:
      case DIALOGUE_EXTERNAL_NPC_UI:
        // Remove if created
        if (giTextBoxOverlay != -1) {
          RemoveVideoOverlay(giTextBoxOverlay);
          giTextBoxOverlay = -1;

          if (fTextBoxMouseRegionCreated) {
            RemoveMercPopupBoxFromIndex(iDialogueBox);

            // reset box id
            iDialogueBox = -1;
            MSYS_RemoveRegion(gTextBoxMouseRegion);
            fTextBoxMouseRegionCreated = false;
          }
        }

        break;

      case DIALOGUE_NPC_UI:

        // Remove region
        if (gTalkPanel.fTextRegionOn) {
          MSYS_RemoveRegion(gTalkPanel.TextRegion);
          gTalkPanel.fTextRegionOn = false;
        }

        SetRenderFlags(RENDER_FLAG_FULL);
        gTalkPanel.fRenderSubTitlesNow = false;

        // Delete subtitle box
        gTalkPanel.fDirtyLevel = DIRTYLEVEL2;
        RemoveMercPopupBoxFromIndex(iInterfaceDialogueBox);
        iInterfaceDialogueBox = -1;
        break;

      case DIALOGUE_CONTACTPAGE_UI:
        break;

      case DIALOGUE_SPECK_CONTACT_PAGE_UI:
        break;
    }
  }

  TurnOffSectorLocator();

  gsExternPanelXPosition = DEFAULT_EXTERN_PANEL_X_POS;
  gsExternPanelYPosition = DEFAULT_EXTERN_PANEL_Y_POS;
}

function RenderFaceOverlay(pBlitter: VIDEO_OVERLAY): void {
  let uiDestPitchBYTES: UINT32 = 0;
  let uiSrcPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;
  let pSrcBuf: Uint8ClampedArray;
  let sFontX: INT16;
  let sFontY: INT16;
  let pSoldier: SOLDIERTYPE | null;
  let zTownIDString: string /* INT16[50] */;

  if (gpCurrentTalkingFace == null) {
    return;
  }

  if (gfFacePanelActive) {
    pSoldier = FindSoldierByProfileID(gpCurrentTalkingFace.ubCharacterNum, false);

    // a living soldier?..or external NPC?..choose panel based on this
    if (pSoldier) {
      BltVideoObjectFromIndex(pBlitter.uiDestBuff, guiCOMPANEL, 0, pBlitter.sX, pBlitter.sY, VO_BLT_SRCTRANSPARENCY, null);
    } else {
      BltVideoObjectFromIndex(pBlitter.uiDestBuff, guiCOMPANELB, 0, pBlitter.sX, pBlitter.sY, VO_BLT_SRCTRANSPARENCY, null);
    }

    // Display name, location ( if not current )
    SetFont(BLOCKFONT2());
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_LTGRAY);

    if (pSoldier) {
      // reset the font dest buffer
      SetFontDestBuffer(pBlitter.uiDestBuff, 0, 0, 640, 480, false);

      ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates((pBlitter.sX + 12), (pBlitter.sY + 55), 73, 9, BLOCKFONT2(), "%s", pSoldier.name));
      mprintf(sFontX, sFontY, "%s", pSoldier.name);

      // What sector are we in, ( and is it the same as ours? )
      if (pSoldier.sSectorX != gWorldSectorX || pSoldier.sSectorY != gWorldSectorY || pSoldier.bSectorZ != gbWorldSectorZ || pSoldier.fBetweenSectors) {
        zTownIDString = GetSectorIDString(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ, false);

        zTownIDString = ReduceStringLength(zTownIDString, 64, BLOCKFONT2());

        ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates((pBlitter.sX + 12), (pBlitter.sY + 68), 73, 9, BLOCKFONT2(), "%s", zTownIDString));
        mprintf(sFontX, sFontY, "%s", zTownIDString);
      }

      // reset the font dest buffer
      SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

      // Display bars
      DrawLifeUIBarEx(pSoldier, (pBlitter.sX + 69), (pBlitter.sY + 47), 3, 42, false, pBlitter.uiDestBuff);
      DrawBreathUIBarEx(pSoldier, (pBlitter.sX + 75), (pBlitter.sY + 47), 3, 42, false, pBlitter.uiDestBuff);
      DrawMoraleUIBarEx(pSoldier, (pBlitter.sX + 81), (pBlitter.sY + 47), 3, 42, false, pBlitter.uiDestBuff);
    } else {
      ({ sX: sFontX, sY: sFontY } = VarFindFontCenterCoordinates((pBlitter.sX + 9), (pBlitter.sY + 55), 73, 9, BLOCKFONT2(), "%s", gMercProfiles[gpCurrentTalkingFace.ubCharacterNum].zNickname));
      mprintf(sFontX, sFontY, "%s", gMercProfiles[gpCurrentTalkingFace.ubCharacterNum].zNickname);
    }

    // RenderAutoFace( gpCurrentTalkingFace->iID );
    // BlinkAutoFace( gpCurrentTalkingFace->iID );
    // MouthAutoFace( gpCurrentTalkingFace->iID );

    pDestBuf = LockVideoSurface(pBlitter.uiDestBuff, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
    pSrcBuf = LockVideoSurface(gpCurrentTalkingFace.uiAutoDisplayBuffer, createPointer(() => uiSrcPitchBYTES, (v) => uiSrcPitchBYTES = v));

    Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, (pBlitter.sX + 14), (pBlitter.sY + 6), 0, 0, gpCurrentTalkingFace.usFaceWidth, gpCurrentTalkingFace.usFaceHeight);

    UnLockVideoSurface(pBlitter.uiDestBuff);
    UnLockVideoSurface(gpCurrentTalkingFace.uiAutoDisplayBuffer);

    InvalidateRegion(pBlitter.sX, pBlitter.sY, pBlitter.sX + 99, pBlitter.sY + 98);
  }
}

function RenderSubtitleBoxOverlay(pBlitter: VIDEO_OVERLAY): void {
  if (giTextBoxOverlay != -1) {
    RenderMercPopUpBoxFromIndex(iDialogueBox, pBlitter.sX, pBlitter.sY, pBlitter.uiDestBuff);

    InvalidateRegion(pBlitter.sX, pBlitter.sY, pBlitter.sX + gusSubtitleBoxWidth, pBlitter.sY + gusSubtitleBoxHeight);
  }
}

export function SayQuoteFromAnyBodyInSector(usQuoteNum: UINT16): void {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier) && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.fMercAsleep) {
      if (gTacticalStatus.bNumFoughtInBattle[ENEMY_TEAM] == 0) {
        // quotes referring to Deidranna's men so we skip quote if there were no army guys fought
        if ((usQuoteNum == Enum202.QUOTE_SECTOR_SAFE) && (pTeamSoldier.ubProfile == Enum268.IRA || pTeamSoldier.ubProfile == Enum268.MIGUEL || pTeamSoldier.ubProfile == Enum268.SHANK)) {
          continue;
        }
        if ((usQuoteNum == Enum202.QUOTE_ENEMY_PRESENCE) && (pTeamSoldier.ubProfile == Enum268.IRA || pTeamSoldier.ubProfile == Enum268.DIMITRI || pTeamSoldier.ubProfile == Enum268.DYNAMO || pTeamSoldier.ubProfile == Enum268.SHANK)) {
          continue;
        }
      }

      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    // If we are air raid, AND red exists somewhere...
    if (usQuoteNum == Enum202.QUOTE_AIR_RAID) {
      for (cnt = 0; cnt < ubNumMercs; cnt++) {
        if (ubMercsInSector[cnt] == 11) {
          ubChosenMerc = cnt;
          break;
        }
      }
    }

    TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], usQuoteNum);
  }
}

export function SayQuoteFromAnyBodyInThisSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, usQuoteNum: UINT16): void {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      // Add guy if he's a candidate...
      if (pTeamSoldier.sSectorX == sSectorX && pTeamSoldier.sSectorY == sSectorY && pTeamSoldier.bSectorZ == bSectorZ && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.fMercAsleep) {
        ubMercsInSector[ubNumMercs] = cnt;
        ubNumMercs++;
      }
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    // If we are air raid, AND red exists somewhere...
    if (usQuoteNum == Enum202.QUOTE_AIR_RAID) {
      for (cnt = 0; cnt < ubNumMercs; cnt++) {
        if (ubMercsInSector[cnt] == 11) {
          ubChosenMerc = cnt;
          break;
        }
      }
    }

    TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], usQuoteNum);
  }
}

export function SayQuoteFromNearbyMercInSector(sGridNo: INT16, bDistance: INT8, usQuoteNum: UINT16): void {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier) && PythSpacesAway(sGridNo, pTeamSoldier.sGridNo) < bDistance && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.fMercAsleep && SoldierTo3DLocationLineOfSightTest(pTeamSoldier, sGridNo, 0, 0, MaxDistanceVisible(), true)) {
      if (usQuoteNum == 66 && Random(100) > EffectiveWisdom(pTeamSoldier)) {
        continue;
      }
      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    if (usQuoteNum == 66) {
      SetFactTrue(Enum170.FACT_PLAYER_FOUND_ITEMS_MISSING);
    }
    TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], usQuoteNum);
  }
}

export function SayQuote58FromNearbyMercInSector(sGridNo: INT16, bDistance: INT8, usQuoteNum: UINT16, bSex: INT8): void {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier) && PythSpacesAway(sGridNo, pTeamSoldier.sGridNo) < bDistance && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.fMercAsleep && SoldierTo3DLocationLineOfSightTest(pTeamSoldier, sGridNo, 0, 0, MaxDistanceVisible(), true)) {
      // ATE: This is to check gedner for this quote...
      if (QuoteExp_GenderCode[pTeamSoldier.ubProfile] == 0 && bSex == Enum272.FEMALE) {
        continue;
      }

      if (QuoteExp_GenderCode[pTeamSoldier.ubProfile] == 1 && bSex == Enum272.MALE) {
        continue;
      }

      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);
    TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], usQuoteNum);
  }
}

function TextOverlayClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  /* static */ let fLButtonDown: boolean = false;

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fLButtonDown = true;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP && fLButtonDown) {
    if (gpCurrentTalkingFace != null) {
      InternalShutupaYoFace(gpCurrentTalkingFace.iID, false);

      // Did we succeed in shutting them up?
      if (!gpCurrentTalkingFace.fTalking) {
        // shut down last quote box
        ShutDownLastQuoteTacticalTextBox();
      }
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = false;
  }
}

function FaceOverlayClickCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  /* static */ let fLButtonDown: boolean = false;

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    fLButtonDown = true;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP && fLButtonDown) {
    if (gpCurrentTalkingFace != null) {
      InternalShutupaYoFace(gpCurrentTalkingFace.iID, false);
    }
  } else if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    fLButtonDown = false;
  }
}

export function ShutDownLastQuoteTacticalTextBox(): void {
  if (fDialogueBoxDueToLastMessage) {
    RemoveVideoOverlay(giTextBoxOverlay);
    giTextBoxOverlay = -1;

    if (fTextBoxMouseRegionCreated) {
      MSYS_RemoveRegion(gTextBoxMouseRegion);
      fTextBoxMouseRegionCreated = false;
    }

    fDialogueBoxDueToLastMessage = false;
  }
}

export function FindDelayForString(sString: string /* STR16 */): UINT32 {
  return sString.length * TEXT_DELAY_MODIFIER;
}

export function BeginLoggingForBleedMeToos(fStart: boolean): void {
  gubLogForMeTooBleeds = Number(fStart);
}

export function SetEngagedInConvFromPCAction(pSoldier: SOLDIERTYPE): void {
  // OK, If a good give, set engaged in conv...
  gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
  gTacticalStatus.ubEngagedInConvFromActionMercID = pSoldier.ubID;
}

export function UnSetEngagedInConvFromPCAction(pSoldier: SOLDIERTYPE): void {
  if (gTacticalStatus.ubEngagedInConvFromActionMercID == pSoldier.ubID) {
    // OK, If a good give, set engaged in conv...
    gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);
  }
}

function IsStopTimeQuote(usQuoteNum: UINT16): boolean {
  let cnt: INT32;

  for (cnt = 0; cnt < gubNumStopTimeQuotes; cnt++) {
    if (gusStopTimeQuoteList[cnt] == usQuoteNum) {
      return true;
    }
  }

  return false;
}

function CheckForStopTimeQuotes(usQuoteNum: UINT16): void {
  if (IsStopTimeQuote(usQuoteNum)) {
    // Stop Time, game
    EnterModalTactical(TACTICAL_MODAL_NOMOUSE);

    (<FACETYPE>gpCurrentTalkingFace).uiFlags |= FACE_MODAL;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Starting Modal Tactical Quote.");
  }
}

export function SetStopTimeQuoteCallback(pCallBack: MODAL_HOOK): void {
  gModalDoneCallback = pCallBack;
}

export function IsMercSayingDialogue(ubProfileID: UINT8): boolean {
  if (gpCurrentTalkingFace != null && gubCurrentTalkingID == ubProfileID) {
    return true;
  }
  return false;
}

function ShouldMercSayPrecedentToRepeatOneSelf(ubMercID: UINT8, uiQuoteID: UINT32): boolean {
  let ubQuoteBit: UINT8 = 0;

  // If the quote is not in the array
  if (!IsQuoteInPrecedentArray(uiQuoteID)) {
    return false;
  }

  ubQuoteBit = GetQuoteBitNumberFromQuoteID(uiQuoteID);
  if (ubQuoteBit == 0)
    return false;

  if (GetMercPrecedentQuoteBitStatus(ubMercID, ubQuoteBit)) {
    return true;
  } else {
    SetMercPrecedentQuoteBitStatus(ubMercID, ubQuoteBit);
  }

  return false;
}

export function GetMercPrecedentQuoteBitStatus(ubMercID: UINT8, ubQuoteBit: UINT8): boolean {
  if (gMercProfiles[ubMercID].uiPrecedentQuoteSaid & (1 << (ubQuoteBit - 1)))
    return true;
  else
    return false;
}

export function SetMercPrecedentQuoteBitStatus(ubMercID: UINT8, ubBitToSet: UINT8): boolean {
  // Set the bit
  gMercProfiles[ubMercID].uiPrecedentQuoteSaid |= 1 << (ubBitToSet - 1);

  return true;
}

function IsQuoteInPrecedentArray(uiQuoteID: UINT32): boolean {
  let ubCnt: UINT8;

  // If the quote id is above or below the ones in the array
  if (uiQuoteID < gubMercValidPrecedentQuoteID[0] || uiQuoteID > gubMercValidPrecedentQuoteID[NUMBER_VALID_MERC_PRECEDENT_QUOTES - 1]) {
    return false;
  }

  // loop through all the quotes
  for (ubCnt = 0; ubCnt < NUMBER_VALID_MERC_PRECEDENT_QUOTES; ubCnt++) {
    if (gubMercValidPrecedentQuoteID[ubCnt] == uiQuoteID) {
      return true;
    }
  }

  return false;
}

export function GetQuoteBitNumberFromQuoteID(uiQuoteID: UINT32): UINT8 {
  let ubCnt: UINT8;

  // loop through all the quotes
  for (ubCnt = 0; ubCnt < NUMBER_VALID_MERC_PRECEDENT_QUOTES; ubCnt++) {
    if (gubMercValidPrecedentQuoteID[ubCnt] == uiQuoteID) {
      return ubCnt;
    }
  }

  return 0;
}

export function HandleShutDownOfMapScreenWhileExternfaceIsTalking(): void {
  if ((fExternFaceBoxRegionCreated) && (gpCurrentTalkingFace)) {
    RemoveVideoOverlay(gpCurrentTalkingFace.iVideoOverlay);
    gpCurrentTalkingFace.iVideoOverlay = -1;
  }
}

export function HandleImportantMercQuote(pSoldier: SOLDIERTYPE, usQuoteNumber: UINT16): void {
  // wake merc up for THIS quote
  if (pSoldier.fMercAsleep) {
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, usQuoteNumber, DIALOGUE_SPECIAL_EVENT_SLEEP, 0, 0);
    TacticalCharacterDialogue(pSoldier, usQuoteNumber);
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, usQuoteNumber, DIALOGUE_SPECIAL_EVENT_SLEEP, 1, 0);
  } else {
    TacticalCharacterDialogue(pSoldier, usQuoteNumber);
  }
}

// handle pausing of the dialogue queue
export function PauseDialogueQueue(): void {
  gfDialogueQueuePaused = true;
  return;
}

// unpause the dialogue queue
export function UnPauseDialogueQueue(): void {
  gfDialogueQueuePaused = false;
  return;
}

export function SetExternMapscreenSpeechPanelXY(sXPos: INT16, sYPos: INT16): void {
  gsExternPanelXPosition = sXPos;
  gsExternPanelYPosition = sYPos;
}

}
