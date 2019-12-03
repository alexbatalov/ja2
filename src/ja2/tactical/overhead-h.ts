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
  bTeamActive: boolean /* INT8 */;
  bAwareOfOpposition: boolean /* INT8 */;
  bHuman: boolean /* INT8 */;
}

export function createTacticalTeamType(): TacticalTeamType {
  return {
    bFirstID: 0,
    bLastID: 0,
    RadarColor: 0,
    bSide: 0,
    bMenInSector: 0,
    ubLastMercToRadio: 0,
    bTeamActive: false,
    bAwareOfOpposition: false,
    bHuman: false,
  };
}

export function resetTacticalTeamType(o: TacticalTeamType) {
  o.bFirstID = 0;
  o.bLastID = 0;
  o.RadarColor = 0;
  o.bSide = 0;
  o.bMenInSector = 0;
  o.ubLastMercToRadio = 0;
  o.bTeamActive = false;
  o.bAwareOfOpposition = false;
  o.bHuman = false;
}

export function readTacticalTeamType(o: TacticalTeamType, buffer: Buffer, offset: number = 0): number {
  o.bFirstID = buffer.readUInt8(offset++);
  o.bLastID = buffer.readUInt8(offset++);
  offset += 2; // padding
  o.RadarColor = buffer.readUInt32LE(offset); offset += 4;
  o.bSide = buffer.readInt8(offset++);
  o.bMenInSector = buffer.readInt8(offset++);
  o.ubLastMercToRadio = buffer.readUInt8(offset++);
  o.bTeamActive = Boolean(buffer.readUInt8(offset++));
  o.bAwareOfOpposition = Boolean(buffer.readUInt8(offset++));
  o.bHuman = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  return offset;
}

export function writeTacticalTeamType(o: TacticalTeamType, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.bFirstID, offset);
  offset = buffer.writeUInt8(o.bLastID, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeUInt32LE(o.RadarColor, offset);
  offset = buffer.writeInt8(o.bSide, offset);
  offset = buffer.writeInt8(o.bMenInSector, offset);
  offset = buffer.writeUInt8(o.ubLastMercToRadio, offset);
  offset = buffer.writeUInt8(Number(o.bTeamActive), offset);
  offset = buffer.writeUInt8(Number(o.bAwareOfOpposition), offset);
  offset = buffer.writeUInt8(Number(o.bHuman), offset);
  offset = writePadding(buffer, offset, 2); // padding
  return offset;
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
  ubItemsSeenOnAttackSoldier: UINT8 /* boolean */;
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
    ubItemsSeenOnAttackSoldier: 0,
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

export function resetTacticalStatusType(o: TacticalStatusType) {
  o.uiFlags = 0;
  o.Team.forEach(resetTacticalTeamType);
  o.ubCurrentTeam = 0;
  o.sSlideTarget = 0;
  o.sSlideReason = 0;
  o.uiTimeSinceMercAIStart = 0;
  o.fPanicFlags = 0;
  o.sPanicTriggerGridnoUnused = 0;
  o.sHandGrid = 0;
  o.ubSpottersCalledForBy = 0;
  o.ubTheChosenOne = 0;
  o.uiTimeOfLastInput = 0;
  o.uiTimeSinceDemoOn = 0;
  o.uiCountdownToRestart = 0;
  o.fGoingToEnterDemo = false;
  o.fNOTDOLASTDEMO = false;
  o.fMultiplayer = false;
  o.fCivGroupHostile.fill(0);
  o.ubLastBattleSectorX = 0;
  o.ubLastBattleSectorY = 0;
  o.fLastBattleWon = false;
  o.bOriginalSizeOfEnemyForce = 0;
  o.bPanicTriggerIsAlarmUnused = 0;
  o.fVirginSector = false;
  o.fEnemyInSector = false;
  o.fInterruptOccurred = false;
  o.bRealtimeSpeed = 0;
  o.ubEnemyIntention = 0;
  o.ubEnemyIntendedRetreatDirection = 0;
  o.ubEnemySightingOnTheirTurnEnemyID = 0;
  o.ubEnemySightingOnTheirTurnPlayerID = 0;
  o.fEnemySightingOnTheirTurn = false;
  o.fAutoBandageMode = false;
  o.ubAttackBusyCount = 0;
  o.bNumEnemiesFoughtInBattleUnused = 0;
  o.ubEngagedInConvFromActionMercID = 0;
  o.usTactialTurnLimitCounter = 0;
  o.fInTopMessage = false;
  o.ubTopMessageType = 0;
  o.zTopMessageString = '';
  o.usTactialTurnLimitMax = 0;
  o.uiTactialTurnLimitClock = 0;
  o.fTactialTurnLimitStartedBeep = false;
  o.bBoxingState = 0;
  o.bConsNumTurnsNotSeen = 0;
  o.ubArmyGuysKilled = 0;

  o.sPanicTriggerGridNo.fill(0);
  o.bPanicTriggerIsAlarm.fill(false);
  o.ubPanicTolerance.fill(0);
  o.fAtLeastOneGuyOnMultiSelect = false;
  o.fSaidCreatureFlavourQuote = false;
  o.fHaveSeenCreature = false;
  o.fKilledEnemyOnAttack = false;
  o.ubEnemyKilledOnAttack = 0;
  o.bEnemyKilledOnAttackLevel = 0;
  o.ubEnemyKilledOnAttackLocation = 0;
  o.fItemsSeenOnAttack = false;
  o.ubItemsSeenOnAttackSoldier = 0;
  o.fBeenInCombatOnce = false;
  o.fSaidCreatureSmellQuote = false;
  o.usItemsSeenOnAttackGridNo = 0;
  o.fLockItemLocators = false;
  o.ubLastQuoteSaid = 0;
  o.ubLastQuoteProfileNUm = 0;
  o.fCantGetThrough = false;
  o.sCantGetThroughGridNo = 0;
  o.sCantGetThroughSoldierGridNo = 0;
  o.ubCantGetThroughID = 0;
  o.fDidGameJustStart = false;
  o.fStatChangeCheatOn = false;
  o.ubLastRequesterTargetID = 0;
  o.fGoodToAllowCrows = false;
  o.ubNumCrowsPossible = 0;
  o.uiTimeCounterForGiveItemSrc = 0;
  o.fUnLockUIAfterHiddenInterrupt = false;
  o.bNumFoughtInBattle.fill(0);
  o.uiDecayBloodLastUpdate = 0;
  o.uiTimeSinceLastInTactical = 0;
  o.fHasAGameBeenStarted = false;
  o.bConsNumTurnsWeHaventSeenButEnemyDoes = 0;
  o.fSomeoneHit = false;
  o.ubPaddingSmall = 0;
  o.uiTimeSinceLastOpplistDecay = 0;
  o.bMercArrivingQuoteBeingUsed = false;
  o.ubEnemyKilledOnAttackKiller = 0;
  o.fCountingDownForGuideDescription = false;
  o.bGuideDescriptionCountDown = 0;
  o.ubGuideDescriptionToUse = 0;
  o.bGuideDescriptionSectorX = 0;
  o.bGuideDescriptionSectorY = 0;
  o.fEnemyFlags = 0;
  o.fAutoBandagePending = false;
  o.fHasEnteredCombatModeSinceEntering = false;
  o.fDontAddNewCrows = false;
  o.ubMorePadding = 0;
  o.sCreatureTenseQuoteDelay = 0;
  o.uiCreatureTenseQuoteLastUpdate = 0;
}

export const TACTICAL_STATUS_TYPE_SIZE = 316;

export function readTacticalStatusType(o: TacticalStatusType, buffer: Buffer, offset: number = 0): number {
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  offset = readObjectArray(o.Team, buffer, offset, readTacticalTeamType);
  o.ubCurrentTeam = buffer.readUInt8(offset++);
  offset++; // padding
  o.sSlideTarget = buffer.readInt16LE(offset); offset += 2;
  o.sSlideReason = buffer.readInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.uiTimeSinceMercAIStart = buffer.readUInt32LE(offset); offset += 4;
  o.fPanicFlags = buffer.readInt8(offset++);
  offset++; // padding
  o.sPanicTriggerGridnoUnused = buffer.readInt16LE(offset); offset += 2;
  o.sHandGrid = buffer.readInt16LE(offset); offset += 2;
  o.ubSpottersCalledForBy = buffer.readUInt8(offset++);
  o.ubTheChosenOne = buffer.readUInt8(offset++);
  o.uiTimeOfLastInput = buffer.readUInt32LE(offset); offset += 4;
  o.uiTimeSinceDemoOn = buffer.readUInt32LE(offset); offset += 4;
  o.uiCountdownToRestart = buffer.readUInt32LE(offset); offset += 4;
  o.fGoingToEnterDemo = Boolean(buffer.readUInt8(offset++));
  o.fNOTDOLASTDEMO = Boolean(buffer.readUInt8(offset++));
  o.fMultiplayer = Boolean(buffer.readUInt8(offset++));
  offset = readUIntArray(o.fCivGroupHostile, buffer, offset, 1);
  o.ubLastBattleSectorX = buffer.readUInt8(offset++);
  o.ubLastBattleSectorY = buffer.readUInt8(offset++);
  o.fLastBattleWon = Boolean(buffer.readUInt8(offset++));
  o.bOriginalSizeOfEnemyForce = buffer.readInt8(offset++);
  o.bPanicTriggerIsAlarmUnused = buffer.readInt8(offset++);
  o.fVirginSector = Boolean(buffer.readUInt8(offset++));
  o.fEnemyInSector = Boolean(buffer.readUInt8(offset++));
  o.fInterruptOccurred = Boolean(buffer.readUInt8(offset++));
  o.bRealtimeSpeed = buffer.readInt8(offset++);
  o.ubEnemyIntention = buffer.readUInt8(offset++);
  o.ubEnemyIntendedRetreatDirection = buffer.readUInt8(offset++);
  o.ubEnemySightingOnTheirTurnEnemyID = buffer.readUInt8(offset++);
  o.ubEnemySightingOnTheirTurnPlayerID = buffer.readUInt8(offset++);
  o.fEnemySightingOnTheirTurn = Boolean(buffer.readUInt8(offset++));
  o.fAutoBandageMode = Boolean(buffer.readUInt8(offset++));
  o.ubAttackBusyCount = buffer.readUInt8(offset++);
  o.bNumEnemiesFoughtInBattleUnused = buffer.readInt8(offset++);
  o.ubEngagedInConvFromActionMercID = buffer.readUInt8(offset++);
  offset++; // padding
  o.usTactialTurnLimitCounter = buffer.readUInt16LE(offset); offset += 2;
  o.fInTopMessage = Boolean(buffer.readUInt8(offset++));
  o.ubTopMessageType = buffer.readUInt8(offset++);
  o.zTopMessageString = readStringNL(buffer, 'utf16le', offset, offset + 40); offset += 40;
  o.usTactialTurnLimitMax = buffer.readUInt16LE(offset); offset += 2;
  o.uiTactialTurnLimitClock = buffer.readUInt32LE(offset); offset += 4;
  o.fTactialTurnLimitStartedBeep = Boolean(buffer.readUInt8(offset++));
  o.bBoxingState = buffer.readInt8(offset++);
  o.bConsNumTurnsNotSeen = buffer.readInt8(offset++);
  o.ubArmyGuysKilled = buffer.readUInt8(offset++);

  offset = readIntArray(o.sPanicTriggerGridNo, buffer, offset, 2);
  offset = readBooleanArray(o.bPanicTriggerIsAlarm, buffer, offset);
  offset = readUIntArray(o.ubPanicTolerance, buffer, offset, 1);
  o.fAtLeastOneGuyOnMultiSelect = Boolean(buffer.readUInt8(offset++));
  o.fSaidCreatureFlavourQuote = Boolean(buffer.readUInt8(offset++));
  o.fHaveSeenCreature = Boolean(buffer.readUInt8(offset++));
  o.fKilledEnemyOnAttack = Boolean(buffer.readUInt8(offset++));
  o.ubEnemyKilledOnAttack = buffer.readUInt8(offset++);
  o.bEnemyKilledOnAttackLevel = buffer.readInt8(offset++);
  o.ubEnemyKilledOnAttackLocation = buffer.readUInt16LE(offset); offset += 2;
  o.fItemsSeenOnAttack = Boolean(buffer.readUInt8(offset++));
  o.ubItemsSeenOnAttackSoldier = buffer.readUInt8(offset++);
  o.fBeenInCombatOnce = Boolean(buffer.readUInt8(offset++));
  o.fSaidCreatureSmellQuote = Boolean(buffer.readUInt8(offset++));
  o.usItemsSeenOnAttackGridNo = buffer.readUInt16LE(offset); offset += 2;
  o.fLockItemLocators = Boolean(buffer.readUInt8(offset++));
  o.ubLastQuoteSaid = buffer.readUInt8(offset++);
  o.ubLastQuoteProfileNUm = buffer.readUInt8(offset++);
  o.fCantGetThrough = Boolean(buffer.readUInt8(offset++));
  o.sCantGetThroughGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sCantGetThroughSoldierGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubCantGetThroughID = buffer.readUInt8(offset++);
  o.fDidGameJustStart = Boolean(buffer.readUInt8(offset++));
  o.fStatChangeCheatOn = Boolean(buffer.readUInt8(offset++));
  o.ubLastRequesterTargetID = buffer.readUInt8(offset++);
  o.fGoodToAllowCrows = Boolean(buffer.readUInt8(offset++));
  o.ubNumCrowsPossible = buffer.readUInt8(offset++);
  o.uiTimeCounterForGiveItemSrc = buffer.readUInt32LE(offset); offset += 4;
  o.fUnLockUIAfterHiddenInterrupt = Boolean(buffer.readUInt8(offset++));
  offset = readIntArray(o.bNumFoughtInBattle, buffer, offset, 1);
  offset++; // padding
  o.uiDecayBloodLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  o.uiTimeSinceLastInTactical = buffer.readUInt32LE(offset); offset += 4;
  o.fHasAGameBeenStarted = Boolean(buffer.readUInt8(offset++));
  o.bConsNumTurnsWeHaventSeenButEnemyDoes = buffer.readInt8(offset++);
  o.fSomeoneHit = Boolean(buffer.readUInt8(offset++));
  o.ubPaddingSmall = buffer.readUInt8(offset++);
  o.uiTimeSinceLastOpplistDecay = buffer.readUInt32LE(offset); offset += 4;
  o.bMercArrivingQuoteBeingUsed = Boolean(buffer.readUInt8(offset++));
  o.ubEnemyKilledOnAttackKiller = buffer.readUInt8(offset++);
  o.fCountingDownForGuideDescription = Boolean(buffer.readUInt8(offset++));
  o.bGuideDescriptionCountDown = buffer.readInt8(offset++);
  o.ubGuideDescriptionToUse = buffer.readUInt8(offset++);
  o.bGuideDescriptionSectorX = buffer.readInt8(offset++);
  o.bGuideDescriptionSectorY = buffer.readInt8(offset++);
  o.fEnemyFlags = buffer.readInt8(offset++);
  o.fAutoBandagePending = Boolean(buffer.readUInt8(offset++));
  o.fHasEnteredCombatModeSinceEntering = Boolean(buffer.readUInt8(offset++));
  o.fDontAddNewCrows = Boolean(buffer.readUInt8(offset++));
  o.ubMorePadding = buffer.readUInt8(offset++);
  o.sCreatureTenseQuoteDelay = buffer.readUInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.uiCreatureTenseQuoteLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  return offset;
}

export function writeTacticalStatusType(o: TacticalStatusType, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = writeObjectArray(o.Team, buffer, offset, writeTacticalTeamType);
  offset = buffer.writeUInt8(o.ubCurrentTeam, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sSlideTarget, offset);
  offset = buffer.writeInt16LE(o.sSlideReason, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeUInt32LE(o.uiTimeSinceMercAIStart, offset);
  offset = buffer.writeInt8(o.fPanicFlags, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sPanicTriggerGridnoUnused, offset);
  offset = buffer.writeInt16LE(o.sHandGrid, offset);
  offset = buffer.writeUInt8(o.ubSpottersCalledForBy, offset);
  offset = buffer.writeUInt8(o.ubTheChosenOne, offset);
  offset = buffer.writeUInt32LE(o.uiTimeOfLastInput, offset);
  offset = buffer.writeUInt32LE(o.uiTimeSinceDemoOn, offset);
  offset = buffer.writeUInt32LE(o.uiCountdownToRestart, offset);
  offset = buffer.writeUInt8(Number(o.fGoingToEnterDemo), offset);
  offset = buffer.writeUInt8(Number(o.fNOTDOLASTDEMO), offset);
  offset = buffer.writeUInt8(Number(o.fMultiplayer), offset);
  offset = writeUIntArray(o.fCivGroupHostile, buffer, offset, 1);
  offset = buffer.writeUInt8(o.ubLastBattleSectorX, offset);
  offset = buffer.writeUInt8(o.ubLastBattleSectorY, offset);
  offset = buffer.writeUInt8(Number(o.fLastBattleWon), offset);
  offset = buffer.writeInt8(o.bOriginalSizeOfEnemyForce, offset);
  offset = buffer.writeInt8(o.bPanicTriggerIsAlarmUnused, offset);
  offset = buffer.writeUInt8(Number(o.fVirginSector), offset);
  offset = buffer.writeUInt8(Number(o.fEnemyInSector), offset);
  offset = buffer.writeUInt8(Number(o.fInterruptOccurred), offset);
  offset = buffer.writeInt8(o.bRealtimeSpeed, offset);
  offset = buffer.writeUInt8(o.ubEnemyIntention, offset);
  offset = buffer.writeUInt8(o.ubEnemyIntendedRetreatDirection, offset);
  offset = buffer.writeUInt8(o.ubEnemySightingOnTheirTurnEnemyID, offset);
  offset = buffer.writeUInt8(o.ubEnemySightingOnTheirTurnPlayerID, offset);
  offset = buffer.writeUInt8(Number(o.fEnemySightingOnTheirTurn), offset);
  offset = buffer.writeUInt8(Number(o.fAutoBandageMode), offset);
  offset = buffer.writeUInt8(o.ubAttackBusyCount, offset);
  offset = buffer.writeInt8(o.bNumEnemiesFoughtInBattleUnused, offset);
  offset = buffer.writeUInt8(o.ubEngagedInConvFromActionMercID, offset);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeUInt16LE(o.usTactialTurnLimitCounter, offset);
  offset = buffer.writeUInt8(Number(o.fInTopMessage), offset);
  offset = buffer.writeUInt8(o.ubTopMessageType, offset);
  offset = writeStringNL(o.zTopMessageString, buffer, offset, 40, 'utf16le');
  offset = buffer.writeUInt16LE(o.usTactialTurnLimitMax, offset);
  offset = buffer.writeUInt32LE(o.uiTactialTurnLimitClock, offset);
  offset = buffer.writeUInt8(Number(o.fTactialTurnLimitStartedBeep), offset);
  offset = buffer.writeInt8(o.bBoxingState, offset);
  offset = buffer.writeInt8(o.bConsNumTurnsNotSeen, offset);
  offset = buffer.writeUInt8(o.ubArmyGuysKilled, offset);

  offset = writeIntArray(o.sPanicTriggerGridNo, buffer, offset, 2);
  offset = writeBooleanArray(o.bPanicTriggerIsAlarm, buffer, offset);
  offset = writeUIntArray(o.ubPanicTolerance, buffer, offset, 1);
  offset = buffer.writeUInt8(Number(o.fAtLeastOneGuyOnMultiSelect), offset);
  offset = buffer.writeUInt8(Number(o.fSaidCreatureFlavourQuote), offset);
  offset = buffer.writeUInt8(Number(o.fHaveSeenCreature), offset);
  offset = buffer.writeUInt8(Number(o.fKilledEnemyOnAttack), offset);
  offset = buffer.writeUInt8(o.ubEnemyKilledOnAttack, offset);
  offset = buffer.writeInt8(o.bEnemyKilledOnAttackLevel, offset);
  offset = buffer.writeUInt16LE(o.ubEnemyKilledOnAttackLocation, offset);
  offset = buffer.writeUInt8(Number(o.fItemsSeenOnAttack), offset);
  offset = buffer.writeUInt8(o.ubItemsSeenOnAttackSoldier, offset);
  offset = buffer.writeUInt8(Number(o.fBeenInCombatOnce), offset);
  offset = buffer.writeUInt8(Number(o.fSaidCreatureSmellQuote), offset);
  offset = buffer.writeUInt16LE(o.usItemsSeenOnAttackGridNo, offset);
  offset = buffer.writeUInt8(Number(o.fLockItemLocators), offset);
  offset = buffer.writeUInt8(o.ubLastQuoteSaid, offset);
  offset = buffer.writeUInt8(o.ubLastQuoteProfileNUm, offset);
  offset = buffer.writeUInt8(Number(o.fCantGetThrough), offset);
  offset = buffer.writeInt16LE(o.sCantGetThroughGridNo, offset);
  offset = buffer.writeInt16LE(o.sCantGetThroughSoldierGridNo, offset);
  offset = buffer.writeUInt8(o.ubCantGetThroughID, offset);
  offset = buffer.writeUInt8(Number(o.fDidGameJustStart), offset);
  offset = buffer.writeUInt8(Number(o.fStatChangeCheatOn), offset);
  offset = buffer.writeUInt8(o.ubLastRequesterTargetID, offset);
  offset = buffer.writeUInt8(Number(o.fGoodToAllowCrows), offset);
  offset = buffer.writeUInt8(o.ubNumCrowsPossible, offset);
  offset = buffer.writeUInt32LE(o.uiTimeCounterForGiveItemSrc, offset);
  offset = buffer.writeUInt8(Number(o.fUnLockUIAfterHiddenInterrupt), offset);
  offset = writeIntArray(o.bNumFoughtInBattle, buffer, offset, 1);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeUInt32LE(o.uiDecayBloodLastUpdate, offset);
  offset = buffer.writeUInt32LE(o.uiTimeSinceLastInTactical, offset);
  offset = buffer.writeUInt8(Number(o.fHasAGameBeenStarted), offset);
  offset = buffer.writeInt8(o.bConsNumTurnsWeHaventSeenButEnemyDoes, offset);
  offset = buffer.writeUInt8(Number(o.fSomeoneHit), offset);
  offset = buffer.writeUInt8(o.ubPaddingSmall, offset);
  offset = buffer.writeUInt32LE(o.uiTimeSinceLastOpplistDecay, offset);
  offset = buffer.writeUInt8(Number(o.bMercArrivingQuoteBeingUsed), offset);
  offset = buffer.writeUInt8(o.ubEnemyKilledOnAttackKiller, offset);
  offset = buffer.writeUInt8(Number(o.fCountingDownForGuideDescription), offset);
  offset = buffer.writeInt8(o.bGuideDescriptionCountDown, offset);
  offset = buffer.writeUInt8(o.ubGuideDescriptionToUse, offset);
  offset = buffer.writeInt8(o.bGuideDescriptionSectorX, offset);
  offset = buffer.writeInt8(o.bGuideDescriptionSectorY, offset);
  offset = buffer.writeInt8(o.fEnemyFlags, offset);
  offset = buffer.writeUInt8(Number(o.fAutoBandagePending), offset);
  offset = buffer.writeUInt8(Number(o.fHasEnteredCombatModeSinceEntering), offset);
  offset = buffer.writeUInt8(Number(o.fDontAddNewCrows), offset);
  offset = buffer.writeUInt8(o.ubMorePadding, offset);
  offset = buffer.writeUInt16LE(o.sCreatureTenseQuoteDelay, offset);
  offset = writePadding(buffer, offset, 2);
  offset = buffer.writeUInt32LE(o.uiCreatureTenseQuoteLastUpdate, offset);
  return offset;
}

export const REASON_NORMAL_ATTACK = 1;
export const REASON_EXPLOSION = 2;

export let gTacticalStatus: TacticalStatusType = createTacticalStatusType();

}
