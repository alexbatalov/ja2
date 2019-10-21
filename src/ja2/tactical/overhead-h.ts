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

const REASON_NORMAL_ATTACK = 1;
const REASON_EXPLOSION = 2;
