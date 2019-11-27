namespace ja2 {

const ADD_SOLDIER_NO_PROFILE_ID = 200;

export const MAX_REALTIME_SPEED_VAL = 10;

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
export const enum Enum238 {
  NO_WAIT_EVENT = 0,
  WAIT_FOR_MERCS_TO_WALKOFF_SCREEN,
  WAIT_FOR_MERCS_TO_WALKON_SCREEN,
  WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO,
}

// TACTICAL ENGINE STATUS FLAGS
export interface TacticalTeamType {
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

export function createTacticalTeamType(): TacticalTeamType {
  return {
    bFirstID: 0,
    bLastID: 0,
    RadarColor: 0,
    bSide: 0,
    bMenInSector: 0,
    ubLastMercToRadio: 0,
    bTeamActive: 0,
    bAwareOfOpposition: 0,
    bHuman: 0,
  };
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

export const PANIC_BOMBS_HERE = 0x01;
export const PANIC_TRIGGERS_HERE = 0x02;

export const NUM_PANIC_TRIGGERS = 3;

export const ENEMY_OFFERED_SURRENDER = 0x01;

export interface TacticalStatusType {
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
  fGoingToEnterDemo: boolean;
  fNOTDOLASTDEMO: boolean;
  fMultiplayer: boolean;
  fCivGroupHostile: UINT8[] /* BOOLEAN[NUM_CIV_GROUPS] */;
  ubLastBattleSectorX: UINT8;
  ubLastBattleSectorY: UINT8;
  fLastBattleWon: boolean;
  bOriginalSizeOfEnemyForce: INT8;
  bPanicTriggerIsAlarmUnused: INT8;
  fVirginSector: boolean;
  fEnemyInSector: boolean;
  fInterruptOccurred: boolean;
  bRealtimeSpeed: INT8;
  ubEnemyIntention: UINT8;
  ubEnemyIntendedRetreatDirection: UINT8;
  ubEnemySightingOnTheirTurnEnemyID: UINT8;
  ubEnemySightingOnTheirTurnPlayerID: UINT8;
  fEnemySightingOnTheirTurn: boolean;
  fAutoBandageMode: boolean;
  ubAttackBusyCount: UINT8;
  bNumEnemiesFoughtInBattleUnused: INT8;
  ubEngagedInConvFromActionMercID: UINT8;
  usTactialTurnLimitCounter: UINT16;
  fInTopMessage: boolean;
  ubTopMessageType: UINT8;
  zTopMessageString: string /* INT16[20] */;
  usTactialTurnLimitMax: UINT16;
  uiTactialTurnLimitClock: UINT32;
  fTactialTurnLimitStartedBeep: boolean;
  bBoxingState: INT8;
  bConsNumTurnsNotSeen: INT8;
  ubArmyGuysKilled: UINT8;

  sPanicTriggerGridNo: INT16[] /* [NUM_PANIC_TRIGGERS] */;
  bPanicTriggerIsAlarm: boolean[] /* INT8[NUM_PANIC_TRIGGERS] */;
  ubPanicTolerance: UINT8[] /* [NUM_PANIC_TRIGGERS] */;
  fAtLeastOneGuyOnMultiSelect: boolean;
  fSaidCreatureFlavourQuote: boolean;
  fHaveSeenCreature: boolean;
  fKilledEnemyOnAttack: boolean;
  ubEnemyKilledOnAttack: UINT8;
  bEnemyKilledOnAttackLevel: INT8;
  ubEnemyKilledOnAttackLocation: UINT16;
  fItemsSeenOnAttack: boolean;
  ubItemsSeenOnAttackSoldier: boolean;
  fBeenInCombatOnce: boolean;
  fSaidCreatureSmellQuote: boolean;
  usItemsSeenOnAttackGridNo: UINT16;
  fLockItemLocators: boolean;
  ubLastQuoteSaid: UINT8;
  ubLastQuoteProfileNUm: UINT8;
  fCantGetThrough: boolean;
  sCantGetThroughGridNo: INT16;
  sCantGetThroughSoldierGridNo: INT16;
  ubCantGetThroughID: UINT8;
  fDidGameJustStart: boolean;
  fStatChangeCheatOn: boolean;
  ubLastRequesterTargetID: UINT8;
  fGoodToAllowCrows: boolean;
  ubNumCrowsPossible: UINT8;
  uiTimeCounterForGiveItemSrc: UINT32;
  fUnLockUIAfterHiddenInterrupt: boolean;
  bNumFoughtInBattle: INT8[] /* [MAXTEAMS] */;
  uiDecayBloodLastUpdate: UINT32;
  uiTimeSinceLastInTactical: UINT32;
  fHasAGameBeenStarted: boolean;
  bConsNumTurnsWeHaventSeenButEnemyDoes: INT8;
  fSomeoneHit: boolean;
  ubPaddingSmall: UINT8;
  uiTimeSinceLastOpplistDecay: UINT32;
  bMercArrivingQuoteBeingUsed: boolean /* INT8 */;
  ubEnemyKilledOnAttackKiller: UINT8;
  fCountingDownForGuideDescription: boolean;
  bGuideDescriptionCountDown: INT8;
  ubGuideDescriptionToUse: UINT8;
  bGuideDescriptionSectorX: INT8;
  bGuideDescriptionSectorY: INT8;
  fEnemyFlags: INT8;
  fAutoBandagePending: boolean;
  fHasEnteredCombatModeSinceEntering: boolean;
  fDontAddNewCrows: boolean;
  ubMorePadding: UINT8;
  sCreatureTenseQuoteDelay: UINT16;
  uiCreatureTenseQuoteLastUpdate: UINT32;
}

export function createTacticalStatusType(): TacticalStatusType {
  return {
    uiFlags: 0,
    Team: createArrayFrom(MAXTEAMS, createTacticalTeamType),
    ubCurrentTeam: 0,
    sSlideTarget: 0,
    sSlideReason: 0,
    uiTimeSinceMercAIStart: 0,
    fPanicFlags: 0,
    sPanicTriggerGridnoUnused: 0,
    sHandGrid: 0,
    ubSpottersCalledForBy: 0,
    ubTheChosenOne: 0,
    uiTimeOfLastInput: 0,
    uiTimeSinceDemoOn: 0,
    uiCountdownToRestart: 0,
    fGoingToEnterDemo: false,
    fNOTDOLASTDEMO: false,
    fMultiplayer: false,
    fCivGroupHostile: createArray(Enum246.NUM_CIV_GROUPS, 0),
    ubLastBattleSectorX: 0,
    ubLastBattleSectorY: 0,
    fLastBattleWon: false,
    bOriginalSizeOfEnemyForce: 0,
    bPanicTriggerIsAlarmUnused: 0,
    fVirginSector: false,
    fEnemyInSector: false,
    fInterruptOccurred: false,
    bRealtimeSpeed: 0,
    ubEnemyIntention: 0,
    ubEnemyIntendedRetreatDirection: 0,
    ubEnemySightingOnTheirTurnEnemyID: 0,
    ubEnemySightingOnTheirTurnPlayerID: 0,
    fEnemySightingOnTheirTurn: false,
    fAutoBandageMode: false,
    ubAttackBusyCount: 0,
    bNumEnemiesFoughtInBattleUnused: 0,
    ubEngagedInConvFromActionMercID: 0,
    usTactialTurnLimitCounter: 0,
    fInTopMessage: false,
    ubTopMessageType: 0,
    zTopMessageString: '',
    usTactialTurnLimitMax: 0,
    uiTactialTurnLimitClock: 0,
    fTactialTurnLimitStartedBeep: false,
    bBoxingState: 0,
    bConsNumTurnsNotSeen: 0,
    ubArmyGuysKilled: 0,

    sPanicTriggerGridNo: createArray(NUM_PANIC_TRIGGERS, 0),
    bPanicTriggerIsAlarm: createArray(NUM_PANIC_TRIGGERS, false),
    ubPanicTolerance: createArray(NUM_PANIC_TRIGGERS, 0),
    fAtLeastOneGuyOnMultiSelect: false,
    fSaidCreatureFlavourQuote: false,
    fHaveSeenCreature: false,
    fKilledEnemyOnAttack: false,
    ubEnemyKilledOnAttack: 0,
    bEnemyKilledOnAttackLevel: 0,
    ubEnemyKilledOnAttackLocation: 0,
    fItemsSeenOnAttack: false,
    ubItemsSeenOnAttackSoldier: false,
    fBeenInCombatOnce: false,
    fSaidCreatureSmellQuote: false,
    usItemsSeenOnAttackGridNo: 0,
    fLockItemLocators: false,
    ubLastQuoteSaid: 0,
    ubLastQuoteProfileNUm: 0,
    fCantGetThrough: false,
    sCantGetThroughGridNo: 0,
    sCantGetThroughSoldierGridNo: 0,
    ubCantGetThroughID: 0,
    fDidGameJustStart: false,
    fStatChangeCheatOn: false,
    ubLastRequesterTargetID: 0,
    fGoodToAllowCrows: false,
    ubNumCrowsPossible: 0,
    uiTimeCounterForGiveItemSrc: 0,
    fUnLockUIAfterHiddenInterrupt: false,
    bNumFoughtInBattle: createArray(MAXTEAMS, 0),
    uiDecayBloodLastUpdate: 0,
    uiTimeSinceLastInTactical: 0,
    fHasAGameBeenStarted: false,
    bConsNumTurnsWeHaventSeenButEnemyDoes: 0,
    fSomeoneHit: false,
    ubPaddingSmall: 0,
    uiTimeSinceLastOpplistDecay: 0,
    bMercArrivingQuoteBeingUsed: false,
    ubEnemyKilledOnAttackKiller: 0,
    fCountingDownForGuideDescription: false,
    bGuideDescriptionCountDown: 0,
    ubGuideDescriptionToUse: 0,
    bGuideDescriptionSectorX: 0,
    bGuideDescriptionSectorY: 0,
    fEnemyFlags: 0,
    fAutoBandagePending: false,
    fHasEnteredCombatModeSinceEntering: false,
    fDontAddNewCrows: false,
    ubMorePadding: 0,
    sCreatureTenseQuoteDelay: 0,
    uiCreatureTenseQuoteLastUpdate: 0,
  };
}

export const REASON_NORMAL_ATTACK = 1;
export const REASON_EXPLOSION = 2;

export let gTacticalStatus: TacticalStatusType = createTacticalStatusType();

}
