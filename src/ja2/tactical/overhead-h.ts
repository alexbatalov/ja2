const ADD_SOLDIER_NO_PROFILE_ID = 200;

const MAX_REALTIME_SPEED_VAL = 10;

/*
enum
{
        TOPTION_SUBTITLES,
        TOPTION_SPEECH,
        TOPTION_KEY_ADVANCE_SPEECH,
        TOPTION_RTCONFIRM,
        TOPTION_HIDE_BULLETS,
        TOPTION_TRACKING_MODE,
        TOPTION_CONFIRM_MOVE,
        TOPTION_MUTE_CONFIRMATIONS,
        TOPTION_SHADOWS,
        TOPTION_BLOOD_N_GORE,

        NUM_TOPTIONS
};
*/

// Enums for waiting for mercs to finish codes
const enum Enum238 {
  NO_WAIT_EVENT = 0,
  WAIT_FOR_MERCS_TO_WALKOFF_SCREEN,
  WAIT_FOR_MERCS_TO_WALKON_SCREEN,
  WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO,
}

// TACTICAL ENGINE STATUS FLAGS
interface TacticalTeamType {
  bFirstID: UINT8;
  bLastID: UINT8;
  RadarColor: COLORVAL;
  bSide: INT8;
  bMenInSector: INT8;
  ubLastMercToRadio: UINT8;
  bTeamActive: INT8;
  bAwareOfOpposition: INT8;
  bHuman: INT8;
}

// for use with TacticalStatusType.ubEnemyIntention
const enum Enum239 {
  INTENTION_SCOUTING,
  INTENTION_PATROLLING,
  INTENTION_ATTACKING,
  INTENTION_DEFENDING,
  INTENTION_RETREATING,
}

// for use with TacticalStatusType.ubEnemyIntendedRetreatDirection
const enum Enum240 {
  RETREAT_NORTH,
  RETREAT_EAST,
  RETREAT_SOUTH,
  RETREAT_WEST,
}

const PANIC_BOMBS_HERE = 0x01;
const PANIC_TRIGGERS_HERE = 0x02;

const NUM_PANIC_TRIGGERS = 3;

const ENEMY_OFFERED_SURRENDER = 0x01;

interface TacticalStatusType {
  uiFlags: UINT32;
  Team: TacticalTeamType[] /* [MAXTEAMS] */;
  ubCurrentTeam: UINT8;
  sSlideTarget: INT16;
  sSlideReason: INT16;
  uiTimeSinceMercAIStart: UINT32;
  fPanicFlags: INT8;
  sPanicTriggerGridnoUnused: INT16;
  sHandGrid: INT16;
  ubSpottersCalledForBy: UINT8;
  ubTheChosenOne: UINT8;
  uiTimeOfLastInput: UINT32;
  uiTimeSinceDemoOn: UINT32;
  uiCountdownToRestart: UINT32;
  fGoingToEnterDemo: BOOLEAN;
  fNOTDOLASTDEMO: BOOLEAN;
  fMultiplayer: BOOLEAN;
  fCivGroupHostile: BOOLEAN[] /* [NUM_CIV_GROUPS] */;
  ubLastBattleSectorX: UINT8;
  ubLastBattleSectorY: UINT8;
  fLastBattleWon: BOOLEAN;
  bOriginalSizeOfEnemyForce: INT8;
  bPanicTriggerIsAlarmUnused: INT8;
  fVirginSector: BOOLEAN;
  fEnemyInSector: BOOLEAN;
  fInterruptOccurred: BOOLEAN;
  bRealtimeSpeed: INT8;
  ubEnemyIntention: UINT8;
  ubEnemyIntendedRetreatDirection: UINT8;
  ubEnemySightingOnTheirTurnEnemyID: UINT8;
  ubEnemySightingOnTheirTurnPlayerID: UINT8;
  fEnemySightingOnTheirTurn: BOOLEAN;
  fAutoBandageMode: BOOLEAN;
  ubAttackBusyCount: UINT8;
  bNumEnemiesFoughtInBattleUnused: INT8;
  ubEngagedInConvFromActionMercID: UINT8;
  usTactialTurnLimitCounter: UINT16;
  fInTopMessage: BOOLEAN;
  ubTopMessageType: UINT8;
  zTopMessageString: INT16[] /* [20] */;
  usTactialTurnLimitMax: UINT16;
  uiTactialTurnLimitClock: UINT32;
  fTactialTurnLimitStartedBeep: BOOLEAN;
  bBoxingState: INT8;
  bConsNumTurnsNotSeen: INT8;
  ubArmyGuysKilled: UINT8;

  sPanicTriggerGridNo: INT16[] /* [NUM_PANIC_TRIGGERS] */;
  bPanicTriggerIsAlarm: INT8[] /* [NUM_PANIC_TRIGGERS] */;
  ubPanicTolerance: UINT8[] /* [NUM_PANIC_TRIGGERS] */;
  fAtLeastOneGuyOnMultiSelect: BOOLEAN;
  fSaidCreatureFlavourQuote: BOOLEAN;
  fHaveSeenCreature: BOOLEAN;
  fKilledEnemyOnAttack: BOOLEAN;
  ubEnemyKilledOnAttack: UINT8;
  bEnemyKilledOnAttackLevel: INT8;
  ubEnemyKilledOnAttackLocation: UINT16;
  fItemsSeenOnAttack: BOOLEAN;
  ubItemsSeenOnAttackSoldier: BOOLEAN;
  fBeenInCombatOnce: BOOLEAN;
  fSaidCreatureSmellQuote: BOOLEAN;
  usItemsSeenOnAttackGridNo: UINT16;
  fLockItemLocators: BOOLEAN;
  ubLastQuoteSaid: UINT8;
  ubLastQuoteProfileNUm: UINT8;
  fCantGetThrough: BOOLEAN;
  sCantGetThroughGridNo: INT16;
  sCantGetThroughSoldierGridNo: INT16;
  ubCantGetThroughID: UINT8;
  fDidGameJustStart: BOOLEAN;
  fStatChangeCheatOn: BOOLEAN;
  ubLastRequesterTargetID: UINT8;
  fGoodToAllowCrows: BOOLEAN;
  ubNumCrowsPossible: UINT8;
  uiTimeCounterForGiveItemSrc: UINT32;
  fUnLockUIAfterHiddenInterrupt: BOOLEAN;
  bNumFoughtInBattle: INT8[] /* [MAXTEAMS] */;
  uiDecayBloodLastUpdate: UINT32;
  uiTimeSinceLastInTactical: UINT32;
  fHasAGameBeenStarted: BOOLEAN;
  bConsNumTurnsWeHaventSeenButEnemyDoes: INT8;
  fSomeoneHit: BOOLEAN;
  ubPaddingSmall: UINT8;
  uiTimeSinceLastOpplistDecay: UINT32;
  bMercArrivingQuoteBeingUsed: INT8;
  ubEnemyKilledOnAttackKiller: UINT8;
  fCountingDownForGuideDescription: BOOLEAN;
  bGuideDescriptionCountDown: INT8;
  ubGuideDescriptionToUse: UINT8;
  bGuideDescriptionSectorX: INT8;
  bGuideDescriptionSectorY: INT8;
  fEnemyFlags: INT8;
  fAutoBandagePending: BOOLEAN;
  fHasEnteredCombatModeSinceEntering: BOOLEAN;
  fDontAddNewCrows: BOOLEAN;
  ubMorePadding: UINT8;
  sCreatureTenseQuoteDelay: UINT16;
  uiCreatureTenseQuoteLastUpdate: UINT32;
}

UINT8 gbPlayerNum;
INT8 gbShowEnemies;

UINT16 gusSelectedSoldier;
UINT16 gusOldSelectedSoldier;

CHAR8 gzAlertStr[][30];
CHAR8 gzActionStr[][30];
CHAR8 gzDirectionStr[][30];

// TEMP FOR E3
UINT8 gubCurrentScene;
CHAR8 *GetSceneFilename();
INT8 ubLevelMoveLink[10];

// Soldier List used for all soldier overhead interaction
SOLDIERTYPE Menptr[TOTAL_SOLDIERS];
SOLDIERTYPE *MercPtrs[TOTAL_SOLDIERS];

// MERC SLOTS - A LIST OF ALL ACTIVE MERCS
SOLDIERTYPE *MercSlots[TOTAL_SOLDIERS];
UINT32 guiNumMercSlots;

BOOLEAN gfMovingAnimation;

TacticalStatusType gTacticalStatus;

BOOLEAN InitTacticalEngine();
void ShutdownTacticalEngine();

BOOLEAN InitOverhead();
BOOLEAN ShutdownOverhead();
BOOLEAN GetSoldier(SOLDIERTYPE **ppSoldier, UINT16 usSoldierIndex);

INT16 NewOKDestination(SOLDIERTYPE *pCurrSoldier, INT16 sGridNo, BOOLEAN fPeopleToo, INT8 bLevel);

// Simple check to see if a (one-tiled) soldier can occupy a given location on the ground or roof.
extern BOOLEAN IsLocationSittable(INT32 iMapIndex, BOOLEAN fOnRoof);
extern BOOLEAN IsLocationSittableExcludingPeople(INT32 iMapIndex, BOOLEAN fOnRoof);
extern BOOLEAN FlatRoofAboveGridNo(INT32 iMapIndex);

BOOLEAN ExecuteOverhead();
BOOLEAN ResetAllAnimationCache();

void EndTurn();
void StartPlayerTeamTurn(BOOLEAN fDoBattleSnd, BOOLEAN fEnteringCombatMode);
void EndTacticalDemo();

void SelectSoldier(UINT16 usSoldierID, BOOLEAN fAcknowledge, BOOLEAN fForceReselect);

void LocateGridNo(UINT16 sGridNo);
void LocateSoldier(UINT16 usID, BOOLEAN fSetLocator);

void BeginTeamTurn(UINT8 ubTeam);
void SlideTo(INT16 sGridno, UINT16 usSoldierID, UINT16 usReasonID, BOOLEAN fSetLocator);
void SlideToLocation(UINT16 usReasonID, INT16 sDestGridNo);

void RebuildAllSoldierShadeTables();
void HandlePlayerTeamMemberDeath(SOLDIERTYPE *pSoldier);
UINT8 LastActiveTeamMember(UINT8 ubTeam);
BOOLEAN SoldierOnVisibleWorldTile(SOLDIERTYPE *pSoldier);

UINT8 FindNextActiveAndAliveMerc(SOLDIERTYPE *pSoldier, BOOLEAN fGoodForLessOKLife, BOOLEAN fOnlyRegularMercs);
UINT8 FindPrevActiveAndAliveMerc(SOLDIERTYPE *pSoldier, BOOLEAN fGoodForLessOKLife, BOOLEAN fOnlyRegularMercs);

BOOLEAN CheckForPlayerTeamInMissionExit();
void HandleNPCTeamMemberDeath(SOLDIERTYPE *pSoldier);

void StopMercAnimation(BOOLEAN fStop);

UINT32 EnterTacticalDemoMode();

BOOLEAN UIOKMoveDestination(SOLDIERTYPE *pSoldier, UINT16 usMapPos);

INT16 FindAdjacentGridEx(SOLDIERTYPE *pSoldier, INT16 sGridNo, UINT8 *pubDirection, INT16 *psAdjustedGridNo, BOOLEAN fForceToPerson, BOOLEAN fDoor);
INT16 FindNextToAdjacentGridEx(SOLDIERTYPE *pSoldier, INT16 sGridNo, UINT8 *pubDirection, INT16 *psAdjustedGridNo, BOOLEAN fForceToPerson, BOOLEAN fDoor);

void SelectNextAvailSoldier(SOLDIERTYPE *pSoldier);
BOOLEAN TeamMemberNear(INT8 bTeam, INT16 sGridNo, INT32 iRange);
BOOLEAN IsValidTargetMerc(UINT8 ubSoldierID);

// FUNCTIONS FOR MANIPULATING MERC SLOTS - A LIST OF ALL ACTIVE MERCS
INT32 GetFreeMercSlot(void);
void RecountMercSlots(void);
INT32 AddMercSlot(SOLDIERTYPE *pSoldier);
BOOLEAN RemoveMercSlot(SOLDIERTYPE *pSoldier);

INT32 AddAwaySlot(SOLDIERTYPE *pSoldier);
BOOLEAN RemoveAwaySlot(SOLDIERTYPE *pSoldier);
INT32 MoveSoldierFromMercToAwaySlot(SOLDIERTYPE *pSoldier);
INT32 MoveSoldierFromAwayToMercSlot(SOLDIERTYPE *pSoldier);

void EnterCombatMode(UINT8 ubStartingTeam);
void ExitCombatMode();

void HandleTeamServices(UINT8 ubTeamNum);
void HandlePlayerServices(SOLDIERTYPE *pTeamSoldier);

void SetEnemyPresence();

void CycleThroughKnownEnemies();

BOOLEAN CheckForEndOfCombatMode(BOOLEAN fIncrementTurnsNotSeen);

SOLDIERTYPE *FreeUpAttacker(UINT8 ubID);

BOOLEAN PlayerTeamFull();

void SetActionToDoOnceMercsGetToLocation(UINT8 ubActionCode, INT8 bNumMercsWaiting, UINT32 uiData1, UINT32 uiData2, UINT32 uiData3);

void ResetAllMercSpeeds();

BOOLEAN HandleGotoNewGridNo(SOLDIERTYPE *pSoldier, BOOLEAN *pfKeepMoving, BOOLEAN fInitialMove, UINT16 usAnimState);

SOLDIERTYPE *ReduceAttackBusyCount(UINT8 ubID, BOOLEAN fCalledByAttacker);

void CommonEnterCombatModeCode();

void CheckForPotentialAddToBattleIncrement(SOLDIERTYPE *pSoldier);

void CencelAllActionsForTimeCompression(void);

BOOLEAN CheckForEndOfBattle(BOOLEAN fAnEnemyRetreated);

void AddManToTeam(INT8 bTeam);

void RemoveManFromTeam(INT8 bTeam);

void RemoveSoldierFromTacticalSector(SOLDIERTYPE *pSoldier, BOOLEAN fAdjustSelected);

void MakeCivHostile(SOLDIERTYPE *pSoldier, INT8 bNewSide);

const REASON_NORMAL_ATTACK = 1;
const REASON_EXPLOSION = 2;

BOOLEAN ProcessImplicationsOfPCAttack(SOLDIERTYPE *pSoldier, SOLDIERTYPE **ppTarget, INT8 bReason);

INT16 FindAdjacentPunchTarget(SOLDIERTYPE *pSoldier, SOLDIERTYPE *pTargetSoldier, INT16 *psAdjustedTargetGridNo, UINT8 *pubDirection);

SOLDIERTYPE *CivilianGroupMemberChangesSides(SOLDIERTYPE *pAttacked);
void CivilianGroupChangesSides(UINT8 ubCivilianGroup);

void CycleVisibleEnemies(SOLDIERTYPE *pSrcSoldier);
UINT8 CivilianGroupMembersChangeSidesWithinProximity(SOLDIERTYPE *pAttacked);

void PauseAITemporarily(void);
void PauseAIUntilManuallyUnpaused(void);
void UnPauseAI(void);

void DoPOWPathChecks(void);

BOOLEAN HostileCiviliansWithGunsPresent(void);
BOOLEAN HostileCiviliansPresent(void);
BOOLEAN HostileBloodcatsPresent(void);
UINT8 NumPCsInSector(void);

void SetSoldierNonNeutral(SOLDIERTYPE *pSoldier);
void SetSoldierNeutral(SOLDIERTYPE *pSoldier);
