namespace ja2 {

export const NUM_PROFILES = 170;
export const FIRST_RPC = 57;
export const FIRST_NPC = 75;

const NAME_LENGTH = 30;
export const NICKNAME_LENGTH = 10;

// ONLY HAVE 8 MISC FLAGS.. SHOULD BE ENOUGH
export const PROFILE_MISC_FLAG_RECRUITED = 0x01;
export const PROFILE_MISC_FLAG_HAVESEENCREATURE = 0x02;
export const PROFILE_MISC_FLAG_FORCENPCQUOTE = 0x04;
export const PROFILE_MISC_FLAG_WOUNDEDBYPLAYER = 0x08;
export const PROFILE_MISC_FLAG_TEMP_NPC_QUOTE_DATA_EXISTS = 0x10;
export const PROFILE_MISC_FLAG_SAID_HOSTILE_QUOTE = 0x20;
export const PROFILE_MISC_FLAG_EPCACTIVE = 0x40;
export const PROFILE_MISC_FLAG_ALREADY_USED_ITEMS = 0x80; // The player has already purchased the mercs items.

export const PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR = 0x01;
export const PROFILE_MISC_FLAG2_LEFT_COUNTRY = 0x02;
export const PROFILE_MISC_FLAG2_BANDAGED_TODAY = 0x04;
export const PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE = 0x08;
export const PROFILE_MISC_FLAG2_NEEDS_TO_SAY_HOSTILE_QUOTE = 0x10;
export const PROFILE_MISC_FLAG2_MARRIED_TO_HICKS = 0x20;
export const PROFILE_MISC_FLAG2_ASKED_BY_HICKS = 0x40;

export const PROFILE_MISC_FLAG3_PLAYER_LEFT_MSG_FOR_MERC_AT_AIM = 0x01; // In the aimscreen, the merc was away and the player left a message
export const PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE = 0x02;
export const PROFILE_MISC_FLAG3_PLAYER_HAD_CHANCE_TO_HIRE = 0x04; // player's had a chance to hire this merc
export const PROFILE_MISC_FLAG3_HANDLE_DONE_TRAVERSAL = 0x08;

export const PROFILE_MISC_FLAG3_NPC_PISSED_OFF = 0x10;
export const PROFILE_MISC_FLAG3_MERC_MERC_IS_DEAD_AND_QUOTE_SAID = 0x20; // In the merc site, the merc has died and Speck quote for the dead merc has been said

export const PROFILE_MISC_FLAG3_TOWN_DOESNT_CARE_ABOUT_DEATH = 0x40;
export const PROFILE_MISC_FLAG3_GOODGUY = 0x80;
//
// The following variables are used with the 'bMercStatus' variable
//
//

// Merc is ready
export const MERC_OK = 0;

// if the merc doesnt have a EDT file
export const MERC_HAS_NO_TEXT_FILE = -1;

// used in the aim video conferencing screen
export const MERC_ANNOYED_BUT_CAN_STILL_CONTACT = -2;
export const MERC_ANNOYED_WONT_CONTACT = -3;
export const MERC_HIRED_BUT_NOT_ARRIVED_YET = -4;

// self explanatory
export const MERC_IS_DEAD = -5;

// set when the merc is returning home.  A delay for 1,2 or 3 days
export const MERC_RETURNING_HOME = -6;

// used when merc starts game on assignment, goes on assignment later, or leaves to go on another contract
export const MERC_WORKING_ELSEWHERE = -7;

// When the merc was fired, they were a POW, make sure they dont show up in AIM, or MERC as available
export const MERC_FIRED_AS_A_POW = -8;

// the values for categories of stats
export const SUPER_STAT_VALUE = 80;
export const NEEDS_TRAINING_STAT_VALUE = 50;
export const NO_CHANCE_IN_HELL_STAT_VALUE = 40;

export const SUPER_SKILL_VALUE = 80;
export const NEEDS_TRAINING_SKILL_VALUE = 50;
export const NO_CHANCE_IN_HELL_SKILL_VALUE = 0;

export const enum Enum269 {
  NO_SKILLTRAIT = 0,
  LOCKPICKING,
  HANDTOHAND,
  ELECTRONICS,
  NIGHTOPS,
  THROWING,
  TEACHING,
  HEAVY_WEAPS,
  AUTO_WEAPS,
  STEALTHY,
  AMBIDEXT,
  THIEF,
  MARTIALARTS,
  KNIFING,
  ONROOF,
  CAMOUFLAGED,
  NUM_SKILLTRAITS,
}

export const enum Enum270 {
  NO_PERSONALITYTRAIT = 0,
  HEAT_INTOLERANT,
  NERVOUS,
  CLAUSTROPHOBIC,
  NONSWIMMER,
  FEAR_OF_INSECTS,
  FORGETFUL,
  PSYCHO,
}

export const NERVOUS_RADIUS = 10;

export const enum Enum271 {
  ATT_NORMAL = 0,
  ATT_FRIENDLY,
  ATT_LONER,
  ATT_OPTIMIST,
  ATT_PESSIMIST,
  ATT_AGGRESSIVE,
  ATT_ARROGANT,
  ATT_BIG_SHOT,
  ATT_ASSHOLE,
  ATT_COWARD,
  NUM_ATTITUDES,
}

export const enum Enum272 {
  MALE = 0,
  FEMALE,
}

export const enum Enum273 {
  NOT_SEXIST = 0,
  SOMEWHAT_SEXIST,
  VERY_SEXIST,
  GENTLEMAN,
}

// training defines for evolution, no stat increase, stat decrease( de-evolve )
export const enum Enum274 {
  NORMAL_EVOLUTION = 0,
  NO_EVOLUTION,
  DEVOLVE,
}

export const BUDDY_MERC = (prof: MERCPROFILESTRUCT, bud: number) => ((prof).bBuddy[0] == (bud) || (prof).bBuddy[1] == (bud) || (prof).bBuddy[2] == (bud));
export const HATED_MERC = (prof: MERCPROFILESTRUCT, hat: number) => ((prof).bHated[0] == (hat) || (prof).bHated[1] == (hat) || (prof).bHated[2] == (hat));

export const BUDDY_OPINION = +25;
export const HATED_OPINION = -25;

export interface MERCPROFILESTRUCT {
  zName: string /* UINT16[NAME_LENGTH] */;
  zNickname: string /* UINT16[NICKNAME_LENGTH] */;
  uiAttnSound: UINT32;
  uiCurseSound: UINT32;
  uiDieSound: UINT32;
  uiGoodSound: UINT32;
  uiGruntSound: UINT32;
  uiGrunt2Sound: UINT32;
  uiOkSound: UINT32;
  ubFaceIndex: UINT8;
  PANTS: PaletteRepID;
  VEST: PaletteRepID;
  SKIN: PaletteRepID;
  HAIR: PaletteRepID;
  bSex: INT8;
  bArmourAttractiveness: INT8;
  ubMiscFlags2: UINT8;
  bEvolution: INT8;
  ubMiscFlags: UINT8;
  bSexist: UINT8;
  bLearnToHate: INT8;

  // skills
  bStealRate: INT8;
  bVocalVolume: INT8;
  ubQuoteRecord: UINT8;
  bDeathRate: INT8;
  bScientific: INT8;

  sExpLevelGain: INT16;
  sLifeGain: INT16;
  sAgilityGain: INT16;
  sDexterityGain: INT16;
  sWisdomGain: INT16;
  sMarksmanshipGain: INT16;
  sMedicalGain: INT16;
  sMechanicGain: INT16;
  sExplosivesGain: INT16;

  ubBodyType: UINT8;
  bMedical: INT8;

  usEyesX: UINT16;
  usEyesY: UINT16;
  usMouthX: UINT16;
  usMouthY: UINT16;
  uiEyeDelay: UINT32;
  uiMouthDelay: UINT32;
  uiBlinkFrequency: UINT32;
  uiExpressionFrequency: UINT32;
  sSectorX: UINT16;
  sSectorY: UINT16;

  uiDayBecomesAvailable: UINT32; // day the merc will be available.  used with the bMercStatus

  bStrength: INT8;

  bLifeMax: INT8;
  bExpLevelDelta: INT8;
  bLifeDelta: INT8;
  bAgilityDelta: INT8;
  bDexterityDelta: INT8;
  bWisdomDelta: INT8;
  bMarksmanshipDelta: INT8;
  bMedicalDelta: INT8;
  bMechanicDelta: INT8;
  bExplosivesDelta: INT8;
  bStrengthDelta: INT8;
  bLeadershipDelta: INT8;
  usKills: UINT16;
  usAssists: UINT16;
  usShotsFired: UINT16;
  usShotsHit: UINT16;
  usBattlesFought: UINT16;
  usTimesWounded: UINT16;
  usTotalDaysServed: UINT16;

  sLeadershipGain: INT16;
  sStrengthGain: INT16;

  // BODY TYPE SUBSITUTIONS
  uiBodyTypeSubFlags: UINT32;

  sSalary: INT16;
  bLife: INT8;
  bDexterity: INT8; // dexterity (hand coord) value
  bPersonalityTrait: INT8;
  bSkillTrait: INT8;

  bReputationTolerance: INT8;
  bExplosive: INT8;
  bSkillTrait2: INT8;
  bLeadership: INT8;

  bBuddy: INT8[] /* [5] */;
  bHated: INT8[] /* [5] */;
  bExpLevel: INT8; // general experience level

  bMarksmanship: INT8;
  bMinService: UINT8;
  bWisdom: INT8;
  bResigned: UINT8;
  bActive: UINT8;

  bInvStatus: UINT8[] /* [19] */;
  bInvNumber: UINT8[] /* [19] */;
  usApproachFactor: UINT16[] /* [4] */;

  bMainGunAttractiveness: INT8;
  bAgility: INT8; // agility (speed) value

  fUseProfileInsertionInfo: boolean; // Set to various flags, ( contained in TacticalSave.h )
  sGridNo: INT16; // The Gridno the NPC was in before leaving the sector
  ubQuoteActionID: UINT8;
  bMechanical: INT8;

  ubInvUndroppable: UINT8;
  ubRoomRangeStart: UINT8[] /* [2] */;
  inv: UINT16[] /* [19] */;
  bMercTownReputation: INT8[] /* [20] */;

  usStatChangeChances: UINT16[] /* [12] */; // used strictly for balancing, never shown!
  usStatChangeSuccesses: UINT16[] /* [12] */; // used strictly for balancing, never shown!

  ubStrategicInsertionCode: UINT8;

  ubRoomRangeEnd: UINT8[] /* [2] */;

  bPadding: INT8[] /* [4] */;

  ubLastQuoteSaid: UINT8;

  bRace: INT8;
  bNationality: INT8;
  bAppearance: INT8;
  bAppearanceCareLevel: INT8;
  bRefinement: INT8;
  bRefinementCareLevel: INT8;
  bHatedNationality: INT8;
  bHatedNationalityCareLevel: INT8;
  bRacist: INT8;
  uiWeeklySalary: UINT32;
  uiBiWeeklySalary: UINT32;
  bMedicalDeposit: INT8;
  bAttitude: INT8;
  bBaseMorale: INT8;
  sMedicalDepositAmount: UINT16;

  bLearnToLike: INT8;
  ubApproachVal: UINT8[] /* [4] */;
  ubApproachMod: UINT8[][] /* [3][4] */;
  bTown: INT8;
  bTownAttachment: INT8;
  usOptionalGearCost: UINT16;
  bMercOpinion: INT8[] /* [75] */;
  bApproached: INT8;
  bMercStatus: INT8; // The status of the merc.  If negative, see flags at the top of this file.  Positive:  The number of days the merc is away for.  0:  Not hired but ready to be.
  bHatedTime: INT8[] /* [5] */;
  bLearnToLikeTime: INT8;
  bLearnToHateTime: INT8;
  bHatedCount: INT8[] /* [5] */;
  bLearnToLikeCount: INT8;
  bLearnToHateCount: INT8;
  ubLastDateSpokenTo: UINT8;
  bLastQuoteSaidWasSpecial: UINT8;
  bSectorZ: INT8;
  usStrategicInsertionData: UINT16;
  bFriendlyOrDirectDefaultResponseUsedRecently: INT8;
  bRecruitDefaultResponseUsedRecently: INT8;
  bThreatenDefaultResponseUsedRecently: INT8;
  bNPCData: INT8; // NPC specific
  iBalance: INT32;
  sTrueSalary: INT16; // for use when the person is working for us for free but has a positive salary value
  ubCivilianGroup: UINT8;
  ubNeedForSleep: UINT8;
  uiMoney: UINT32;
  bNPCData2: INT8; // NPC specific

  ubMiscFlags3: UINT8;

  ubDaysOfMoraleHangover: UINT8; // used only when merc leaves team while having poor morale
  ubNumTimesDrugUseInLifetime: UINT8; // The # times a drug has been used in the player's lifetime...

  // Flags used for the precedent to repeating oneself in Contract negotiations.  Used for quote 80 -  ~107.  Gets reset every day
  uiPrecedentQuoteSaid: UINT32;
  uiProfileChecksum: UINT32;
  sPreCombatGridNo: INT16;
  ubTimeTillNextHatedComplaint: UINT8;
  ubSuspiciousDeath: UINT8;

  iMercMercContractLength: INT32; // Used for MERC mercs, specifies how many days the merc has gone since last page

  uiTotalCostToDate: UINT32; // The total amount of money that has been paid to the merc for their salary
  ubBuffer: UINT8[] /* [4] */;
}

export function createMercProfileStruct(): MERCPROFILESTRUCT {
  return {
    zName: '',
    zNickname: '',
    uiAttnSound: 0,
    uiCurseSound: 0,
    uiDieSound: 0,
    uiGoodSound: 0,
    uiGruntSound: 0,
    uiGrunt2Sound: 0,
    uiOkSound: 0,
    ubFaceIndex: 0,
    PANTS: '',
    VEST: '',
    SKIN: '',
    HAIR: '',
    bSex: 0,
    bArmourAttractiveness: 0,
    ubMiscFlags2: 0,
    bEvolution: 0,
    ubMiscFlags: 0,
    bSexist: 0,
    bLearnToHate: 0,

    bStealRate: 0,
    bVocalVolume: 0,
    ubQuoteRecord: 0,
    bDeathRate: 0,
    bScientific: 0,

    sExpLevelGain: 0,
    sLifeGain: 0,
    sAgilityGain: 0,
    sDexterityGain: 0,
    sWisdomGain: 0,
    sMarksmanshipGain: 0,
    sMedicalGain: 0,
    sMechanicGain: 0,
    sExplosivesGain: 0,

    ubBodyType: 0,
    bMedical: 0,

    usEyesX: 0,
    usEyesY: 0,
    usMouthX: 0,
    usMouthY: 0,
    uiEyeDelay: 0,
    uiMouthDelay: 0,
    uiBlinkFrequency: 0,
    uiExpressionFrequency: 0,
    sSectorX: 0,
    sSectorY: 0,

    uiDayBecomesAvailable: 0,

    bStrength: 0,

    bLifeMax: 0,
    bExpLevelDelta: 0,
    bLifeDelta: 0,
    bAgilityDelta: 0,
    bDexterityDelta: 0,
    bWisdomDelta: 0,
    bMarksmanshipDelta: 0,
    bMedicalDelta: 0,
    bMechanicDelta: 0,
    bExplosivesDelta: 0,
    bStrengthDelta: 0,
    bLeadershipDelta: 0,
    usKills: 0,
    usAssists: 0,
    usShotsFired: 0,
    usShotsHit: 0,
    usBattlesFought: 0,
    usTimesWounded: 0,
    usTotalDaysServed: 0,

    sLeadershipGain: 0,
    sStrengthGain: 0,

    uiBodyTypeSubFlags: 0,

    sSalary: 0,
    bLife: 0,
    bDexterity: 0,
    bPersonalityTrait: 0,
    bSkillTrait: 0,

    bReputationTolerance: 0,
    bExplosive: 0,
    bSkillTrait2: 0,
    bLeadership: 0,

    bBuddy: createArray(5, 0),
    bHated: createArray(5, 0),
    bExpLevel: 0,

    bMarksmanship: 0,
    bMinService: 0,
    bWisdom: 0,
    bResigned: 0,
    bActive: 0,

    bInvStatus: createArray(19, 0),
    bInvNumber: createArray(19, 0),
    usApproachFactor: createArray(4, 0),

    bMainGunAttractiveness: 0,
    bAgility: 0,

    fUseProfileInsertionInfo: false,
    sGridNo: 0,
    ubQuoteActionID: 0,
    bMechanical: 0,

    ubInvUndroppable: 0,
    ubRoomRangeStart: createArray(2, 0),
    inv: createArray(19, 0),
    bMercTownReputation: createArray(20, 0),

    usStatChangeChances: createArray(12, 0),
    usStatChangeSuccesses: createArray(12, 0),

    ubStrategicInsertionCode: 0,

    ubRoomRangeEnd: createArray(2, 0),

    bPadding: createArray(4, 0),

    ubLastQuoteSaid: 0,

    bRace: 0,
    bNationality: 0,
    bAppearance: 0,
    bAppearanceCareLevel: 0,
    bRefinement: 0,
    bRefinementCareLevel: 0,
    bHatedNationality: 0,
    bHatedNationalityCareLevel: 0,
    bRacist: 0,
    uiWeeklySalary: 0,
    uiBiWeeklySalary: 0,
    bMedicalDeposit: 0,
    bAttitude: 0,
    bBaseMorale: 0,
    sMedicalDepositAmount: 0,

    bLearnToLike: 0,
    ubApproachVal: createArray(4, 0),
    ubApproachMod: createArrayFrom(3, () => createArray(4, 0)),
    bTown: 0,
    bTownAttachment: 0,
    usOptionalGearCost: 0,
    bMercOpinion: createArray(75, 0),
    bApproached: 0,
    bMercStatus: 0,
    bHatedTime: createArray(5, 0),
    bLearnToLikeTime: 0,
    bLearnToHateTime: 0,
    bHatedCount: createArray(5, 0),
    bLearnToLikeCount: 0,
    bLearnToHateCount: 0,
    ubLastDateSpokenTo: 0,
    bLastQuoteSaidWasSpecial: 0,
    bSectorZ: 0,
    usStrategicInsertionData: 0,
    bFriendlyOrDirectDefaultResponseUsedRecently: 0,
    bRecruitDefaultResponseUsedRecently: 0,
    bThreatenDefaultResponseUsedRecently: 0,
    bNPCData: 0,
    iBalance: 0,
    sTrueSalary: 0,
    ubCivilianGroup: 0,
    ubNeedForSleep: 0,
    uiMoney: 0,
    bNPCData2: 0,

    ubMiscFlags3: 0,

    ubDaysOfMoraleHangover: 0,
    ubNumTimesDrugUseInLifetime: 0,

    uiPrecedentQuoteSaid: 0,
    uiProfileChecksum: 0,
    sPreCombatGridNo: 0,
    ubTimeTillNextHatedComplaint: 0,
    ubSuspiciousDeath: 0,

    iMercMercContractLength: 0,

    uiTotalCostToDate: 0,
    ubBuffer: createArray(4, 0),
  };
}

export const MERC_PROFILE_STRUCT_SIZE = 716;

export function readMercProfileStruct(o:  MERCPROFILESTRUCT, buffer: Buffer, offset: number = 0): number {
  o.zName = readStringNL(buffer, 'utf16le', offset, offset + 60); offset += 60;
  o.zNickname = readStringNL(buffer, 'utf16le', offset, offset + 20); offset += 20;
  o.uiAttnSound = buffer.readUInt32LE(offset); offset += 4;
  o.uiCurseSound = buffer.readUInt32LE(offset); offset += 4;
  o.uiDieSound = buffer.readUInt32LE(offset); offset += 4;
  o.uiGoodSound = buffer.readUInt32LE(offset); offset += 4;
  o.uiGruntSound = buffer.readUInt32LE(offset); offset += 4;
  o.uiGrunt2Sound = buffer.readUInt32LE(offset); offset += 4;
  o.uiOkSound = buffer.readUInt32LE(offset); offset += 4;
  o.ubFaceIndex = buffer.readUInt8(offset++);
  o.PANTS = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.VEST = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.SKIN = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.HAIR = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.bSex = buffer.readInt8(offset++);
  o.bArmourAttractiveness = buffer.readInt8(offset++);
  o.ubMiscFlags2 = buffer.readUInt8(offset++);
  o.bEvolution = buffer.readInt8(offset++);
  o.ubMiscFlags = buffer.readUInt8(offset++);
  o.bSexist = buffer.readUInt8(offset++);
  o.bLearnToHate = buffer.readInt8(offset++);

  o.bStealRate = buffer.readInt8(offset++);
  o.bVocalVolume = buffer.readInt8(offset++);
  o.ubQuoteRecord = buffer.readUInt8(offset++);
  o.bDeathRate = buffer.readInt8(offset++);
  o.bScientific = buffer.readInt8(offset++);

  offset++; // padding

  o.sExpLevelGain = buffer.readInt16LE(offset); offset += 2;
  o.sLifeGain = buffer.readInt16LE(offset); offset += 2;
  o.sAgilityGain = buffer.readInt16LE(offset); offset += 2;
  o.sDexterityGain = buffer.readInt16LE(offset); offset += 2;
  o.sWisdomGain = buffer.readInt16LE(offset); offset += 2;
  o.sMarksmanshipGain = buffer.readInt16LE(offset); offset += 2;
  o.sMedicalGain = buffer.readInt16LE(offset); offset += 2;
  o.sMechanicGain = buffer.readInt16LE(offset); offset += 2;
  o.sExplosivesGain = buffer.readInt16LE(offset); offset += 2;

  o.ubBodyType = buffer.readUInt8(offset++);
  o.bMedical = buffer.readInt8(offset++);

  o.usEyesX = buffer.readUInt16LE(offset); offset += 2;
  o.usEyesY = buffer.readUInt16LE(offset); offset += 2;
  o.usMouthX = buffer.readUInt16LE(offset); offset += 2;
  o.usMouthY = buffer.readUInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.uiEyeDelay = buffer.readUInt32LE(offset); offset += 4;
  o.uiMouthDelay = buffer.readUInt32LE(offset); offset += 4;
  o.uiBlinkFrequency = buffer.readUInt32LE(offset); offset += 4;
  o.uiExpressionFrequency = buffer.readUInt32LE(offset); offset += 4;
  o.sSectorX = buffer.readUInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readUInt16LE(offset); offset += 2;

  o.uiDayBecomesAvailable = buffer.readUInt32LE(offset); offset += 4;

  o.bStrength = buffer.readInt8(offset++);

  o.bLifeMax = buffer.readInt8(offset++);
  o.bExpLevelDelta = buffer.readInt8(offset++);
  o.bLifeDelta = buffer.readInt8(offset++);
  o.bAgilityDelta = buffer.readInt8(offset++);
  o.bDexterityDelta = buffer.readInt8(offset++);
  o.bWisdomDelta = buffer.readInt8(offset++);
  o.bMarksmanshipDelta = buffer.readInt8(offset++);
  o.bMedicalDelta = buffer.readInt8(offset++);
  o.bMechanicDelta = buffer.readInt8(offset++);
  o.bExplosivesDelta = buffer.readInt8(offset++);
  o.bStrengthDelta = buffer.readInt8(offset++);
  o.bLeadershipDelta = buffer.readInt8(offset++);
  offset++; // padding
  o.usKills = buffer.readUInt16LE(offset); offset += 2;
  o.usAssists = buffer.readUInt16LE(offset); offset += 2;
  o.usShotsFired = buffer.readUInt16LE(offset); offset += 2;
  o.usShotsHit = buffer.readUInt16LE(offset); offset += 2;
  o.usBattlesFought = buffer.readUInt16LE(offset); offset += 2;
  o.usTimesWounded = buffer.readUInt16LE(offset); offset += 2;
  o.usTotalDaysServed = buffer.readUInt16LE(offset); offset += 2;

  o.sLeadershipGain = buffer.readInt16LE(offset); offset += 2;
  o.sStrengthGain = buffer.readInt16LE(offset); offset += 2;

  o.uiBodyTypeSubFlags = buffer.readUInt32LE(offset); offset += 4;

  o.sSalary = buffer.readInt16LE(offset); offset += 2;
  o.bLife = buffer.readInt8(offset++);
  o.bDexterity = buffer.readInt8(offset++);
  o.bPersonalityTrait = buffer.readInt8(offset++);
  o.bSkillTrait = buffer.readInt8(offset++);

  o.bReputationTolerance = buffer.readInt8(offset++);
  o.bExplosive = buffer.readInt8(offset++);
  o.bSkillTrait2 = buffer.readInt8(offset++);
  o.bLeadership = buffer.readInt8(offset++);

  offset = readIntArray(o.bBuddy, buffer, offset, 1);
  offset = readIntArray(o.bHated, buffer, offset, 1);
  o.bExpLevel = buffer.readInt8(offset++);

  o.bMarksmanship = buffer.readInt8(offset++);
  o.bMinService = buffer.readUInt8(offset++);
  o.bWisdom = buffer.readInt8(offset++);
  o.bResigned = buffer.readUInt8(offset++);
  o.bActive = buffer.readUInt8(offset++);

  offset = readUIntArray(o.bInvStatus, buffer, offset, 1);
  offset = readUIntArray(o.bInvNumber, buffer, offset, 1);
  offset = readUIntArray(o.usApproachFactor, buffer, offset, 2);

  o.bMainGunAttractiveness = buffer.readInt8(offset++);
  o.bAgility = buffer.readInt8(offset++);

  o.fUseProfileInsertionInfo = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubQuoteActionID = buffer.readUInt8(offset++);
  o.bMechanical = buffer.readInt8(offset++);

  o.ubInvUndroppable = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubRoomRangeStart, buffer, offset, 1);
  offset++; // padding
  offset = readUIntArray(o.inv, buffer, offset, 2);
  offset = readIntArray(o.bMercTownReputation, buffer, offset, 1);

  offset = readUIntArray(o.usStatChangeChances, buffer, offset, 2);
  offset = readUIntArray(o.usStatChangeSuccesses, buffer, offset, 2);

  o.ubStrategicInsertionCode = buffer.readUInt8(offset++);

  offset = readUIntArray(o.ubRoomRangeEnd, buffer, offset, 1);

  offset = readIntArray(o.bPadding, buffer, offset, 1);

  o.ubLastQuoteSaid = buffer.readUInt8(offset++);

  o.bRace = buffer.readInt8(offset++);
  o.bNationality = buffer.readInt8(offset++);
  o.bAppearance = buffer.readInt8(offset++);
  o.bAppearanceCareLevel = buffer.readInt8(offset++);
  o.bRefinement = buffer.readInt8(offset++);
  o.bRefinementCareLevel = buffer.readInt8(offset++);
  o.bHatedNationality = buffer.readInt8(offset++);
  o.bHatedNationalityCareLevel = buffer.readInt8(offset++);
  o.bRacist = buffer.readInt8(offset++);
  offset++; // padding
  o.uiWeeklySalary = buffer.readUInt32LE(offset); offset += 4;
  o.uiBiWeeklySalary = buffer.readUInt32LE(offset); offset += 4;
  o.bMedicalDeposit = buffer.readInt8(offset++);
  o.bAttitude = buffer.readInt8(offset++);
  o.bBaseMorale = buffer.readInt8(offset++);
  offset++; // padding
  o.sMedicalDepositAmount = buffer.readUInt16LE(offset); offset += 2;

  o.bLearnToLike = buffer.readInt8(offset++);
  offset = readUIntArray(o.ubApproachVal, buffer, offset, 1);
  for (let i = 0; i < o.ubApproachMod.length; i++) {
    offset = readUIntArray(o.ubApproachMod[i], buffer, offset, 1);
  }
  o.bTown = buffer.readInt8(offset++);
  o.bTownAttachment = buffer.readInt8(offset++);
  offset++; // padding
  o.usOptionalGearCost = buffer.readUInt16LE(offset); offset += 2;
  offset = readIntArray(o.bMercOpinion, buffer, offset, 1);
  o.bApproached = buffer.readInt8(offset++);
  o.bMercStatus = buffer.readInt8(offset++);
  offset = readIntArray(o.bHatedTime, buffer, offset, 1);
  o.bLearnToLikeTime = buffer.readInt8(offset++);
  o.bLearnToHateTime = buffer.readInt8(offset++);
  offset = readIntArray(o.bHatedCount, buffer, offset, 1);
  o.bLearnToLikeCount = buffer.readInt8(offset++);
  o.bLearnToHateCount = buffer.readInt8(offset++);
  o.ubLastDateSpokenTo = buffer.readUInt8(offset++);
  o.bLastQuoteSaidWasSpecial = buffer.readUInt8(offset++);
  o.bSectorZ = buffer.readInt8(offset++);
  o.usStrategicInsertionData = buffer.readUInt16LE(offset); offset += 2;
  o.bFriendlyOrDirectDefaultResponseUsedRecently = buffer.readInt8(offset++);
  o.bRecruitDefaultResponseUsedRecently = buffer.readInt8(offset++);
  o.bThreatenDefaultResponseUsedRecently = buffer.readInt8(offset++);
  o.bNPCData = buffer.readInt8(offset++);
  o.iBalance = buffer.readInt32LE(offset); offset += 4;
  o.sTrueSalary = buffer.readInt16LE(offset); offset += 2;
  o.ubCivilianGroup = buffer.readUInt8(offset++);
  o.ubNeedForSleep = buffer.readUInt8(offset++);
  o.uiMoney = buffer.readUInt32LE(offset); offset += 4;
  o.bNPCData2 = buffer.readInt8(offset++);

  o.ubMiscFlags3 = buffer.readUInt8(offset++);

  o.ubDaysOfMoraleHangover = buffer.readUInt8(offset++);
  o.ubNumTimesDrugUseInLifetime = buffer.readUInt8(offset++);

  o.uiPrecedentQuoteSaid = buffer.readUInt32LE(offset); offset += 4;
  o.uiProfileChecksum = buffer.readUInt32LE(offset); offset += 4;
  o.sPreCombatGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubTimeTillNextHatedComplaint = buffer.readUInt8(offset++);
  o.ubSuspiciousDeath = buffer.readUInt8(offset++);

  o.iMercMercContractLength = buffer.readInt32LE(offset); offset += 4;

  o.uiTotalCostToDate = buffer.readUInt32LE(offset); offset += 4;
  offset = readUIntArray(o.ubBuffer, buffer, offset, 1);

  return offset;
}

export function writeMercProfileStruct(o: MERCPROFILESTRUCT, buffer: Buffer, offset: number = 0) {
  offset = writeStringNL(o.zName, buffer, offset, 60, 'utf16le');
  offset = writeStringNL(o.zNickname, buffer, offset, 20, 'utf16le');
  offset = buffer.writeUInt32LE(o.uiAttnSound, offset);
  offset = buffer.writeUInt32LE(o.uiCurseSound, offset);
  offset = buffer.writeUInt32LE(o.uiDieSound, offset);
  offset = buffer.writeUInt32LE(o.uiGoodSound, offset);
  offset = buffer.writeUInt32LE(o.uiGruntSound, offset);
  offset = buffer.writeUInt32LE(o.uiGrunt2Sound, offset);
  offset = buffer.writeUInt32LE(o.uiOkSound, offset);
  offset = buffer.writeUInt8(o.ubFaceIndex, offset);
  offset = writeStringNL(o.PANTS, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.VEST, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.SKIN, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.HAIR, buffer, offset, 30, 'ascii');
  offset = buffer.writeInt8(o.bSex, offset);
  offset = buffer.writeInt8(o.bArmourAttractiveness, offset);
  offset = buffer.writeUInt8(o.ubMiscFlags2, offset);
  offset = buffer.writeInt8(o.bEvolution, offset);
  offset = buffer.writeUInt8(o.ubMiscFlags, offset);
  offset = buffer.writeUInt8(o.bSexist, offset);
  offset = buffer.writeInt8(o.bLearnToHate, offset);

  offset = buffer.writeInt8(o.bStealRate, offset);
  offset = buffer.writeInt8(o.bVocalVolume, offset);
  offset = buffer.writeUInt8(o.ubQuoteRecord, offset);
  offset = buffer.writeInt8(o.bDeathRate, offset);
  offset = buffer.writeInt8(o.bScientific, offset);

  offset = buffer.writeUIntLE(0, offset, 1); // padding

  offset = buffer.writeInt16LE(o.sExpLevelGain, offset);
  offset = buffer.writeInt16LE(o.sLifeGain, offset);
  offset = buffer.writeInt16LE(o.sAgilityGain, offset);
  offset = buffer.writeInt16LE(o.sDexterityGain, offset);
  offset = buffer.writeInt16LE(o.sWisdomGain, offset);
  offset = buffer.writeInt16LE(o.sMarksmanshipGain, offset);
  offset = buffer.writeInt16LE(o.sMedicalGain, offset);
  offset = buffer.writeInt16LE(o.sMechanicGain, offset);
  offset = buffer.writeInt16LE(o.sExplosivesGain, offset);

  offset = buffer.writeUInt8(o.ubBodyType, offset);
  offset = buffer.writeInt8(o.bMedical, offset);

  offset = buffer.writeUInt16LE(o.usEyesX, offset);
  offset = buffer.writeUInt16LE(o.usEyesY, offset);
  offset = buffer.writeUInt16LE(o.usMouthX, offset);
  offset = buffer.writeUInt16LE(o.usMouthY, offset);
  offset = buffer.writeUIntLE(0, offset, 2); // padding
  offset = buffer.writeUInt32LE(o.uiEyeDelay, offset);
  offset = buffer.writeUInt32LE(o.uiMouthDelay, offset);
  offset = buffer.writeUInt32LE(o.uiBlinkFrequency, offset);
  offset = buffer.writeUInt32LE(o.uiExpressionFrequency, offset);
  offset = buffer.writeUInt16LE(o.sSectorX, offset);
  offset = buffer.writeUInt16LE(o.sSectorY, offset);

  offset = buffer.writeUInt32LE(o.uiDayBecomesAvailable, offset);

  offset = buffer.writeInt8(o.bStrength, offset);

  offset = buffer.writeInt8(o.bLifeMax, offset);
  offset = buffer.writeInt8(o.bExpLevelDelta, offset);
  offset = buffer.writeInt8(o.bLifeDelta, offset);
  offset = buffer.writeInt8(o.bAgilityDelta, offset);
  offset = buffer.writeInt8(o.bDexterityDelta, offset);
  offset = buffer.writeInt8(o.bWisdomDelta, offset);
  offset = buffer.writeInt8(o.bMarksmanshipDelta, offset);
  offset = buffer.writeInt8(o.bMedicalDelta, offset);
  offset = buffer.writeInt8(o.bMechanicDelta, offset);
  offset = buffer.writeInt8(o.bExplosivesDelta, offset);
  offset = buffer.writeInt8(o.bStrengthDelta, offset);
  offset = buffer.writeInt8(o.bLeadershipDelta, offset);
  offset = buffer.writeUIntLE(0, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usKills, offset);
  offset = buffer.writeUInt16LE(o.usAssists, offset);
  offset = buffer.writeUInt16LE(o.usShotsFired, offset);
  offset = buffer.writeUInt16LE(o.usShotsHit, offset);
  offset = buffer.writeUInt16LE(o.usBattlesFought, offset);
  offset = buffer.writeUInt16LE(o.usTimesWounded, offset);
  offset = buffer.writeUInt16LE(o.usTotalDaysServed, offset);

  offset = buffer.writeInt16LE(o.sLeadershipGain, offset);
  offset = buffer.writeInt16LE(o.sStrengthGain, offset);

  offset = buffer.writeUInt32LE(o.uiBodyTypeSubFlags, offset);

  offset = buffer.writeInt16LE(o.sSalary, offset);
  offset = buffer.writeInt8(o.bLife, offset);
  offset = buffer.writeInt8(o.bDexterity, offset);
  offset = buffer.writeInt8(o.bPersonalityTrait, offset);
  offset = buffer.writeInt8(o.bSkillTrait, offset);

  offset = buffer.writeInt8(o.bReputationTolerance, offset);
  offset = buffer.writeInt8(o.bExplosive, offset);
  offset = buffer.writeInt8(o.bSkillTrait2, offset);
  offset = buffer.writeInt8(o.bLeadership, offset);

  offset = writeIntArray(o.bBuddy, buffer, offset, 1);
  offset = writeIntArray(o.bHated, buffer, offset, 1);
  offset = buffer.writeInt8(o.bExpLevel, offset);

  offset = buffer.writeInt8(o.bMarksmanship, offset);
  offset = buffer.writeUInt8(o.bMinService, offset);
  offset = buffer.writeInt8(o.bWisdom, offset);
  offset = buffer.writeUInt8(o.bResigned, offset);
  offset = buffer.writeUInt8(o.bActive, offset);

  offset = writeUIntArray(o.bInvStatus, buffer, offset, 1);
  offset = writeUIntArray(o.bInvNumber, buffer, offset, 1);
  offset = writeUIntArray(o.usApproachFactor, buffer, offset, 2);

  offset = buffer.writeInt8(o.bMainGunAttractiveness, offset);
  offset = buffer.writeInt8(o.bAgility, offset);

  offset = buffer.writeUInt8(Number(o.fUseProfileInsertionInfo), offset);
  offset = buffer.writeUIntLE(0, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(o.ubQuoteActionID, offset);
  offset = buffer.writeInt8(o.bMechanical, offset);

  offset = buffer.writeUInt8(o.ubInvUndroppable, offset);
  offset = writeUIntArray(o.ubRoomRangeStart, buffer, offset, 1);
  offset = buffer.writeUIntLE(0, offset, 1); // padding
  offset = writeUIntArray(o.inv, buffer, offset, 2);
  offset = writeIntArray(o.bMercTownReputation, buffer, offset, 1);

  offset = writeUIntArray(o.usStatChangeChances, buffer, offset, 2);
  offset = writeUIntArray(o.usStatChangeSuccesses, buffer, offset, 2);

  offset = buffer.writeUInt8(o.ubStrategicInsertionCode, offset);

  offset = writeUIntArray(o.ubRoomRangeEnd, buffer, offset, 1);

  offset = writeIntArray(o.bPadding, buffer, offset, 1);

  offset = buffer.writeUInt8(o.ubLastQuoteSaid, offset);

  offset = buffer.writeInt8(o.bRace, offset);
  offset = buffer.writeInt8(o.bNationality, offset);
  offset = buffer.writeInt8(o.bAppearance, offset);
  offset = buffer.writeInt8(o.bAppearanceCareLevel, offset);
  offset = buffer.writeInt8(o.bRefinement, offset);
  offset = buffer.writeInt8(o.bRefinementCareLevel, offset);
  offset = buffer.writeInt8(o.bHatedNationality, offset);
  offset = buffer.writeInt8(o.bHatedNationalityCareLevel, offset);
  offset = buffer.writeInt8(o.bRacist, offset);
  offset = buffer.writeUIntLE(0, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiWeeklySalary, offset);
  offset = buffer.writeUInt32LE(o.uiBiWeeklySalary, offset);
  offset = buffer.writeInt8(o.bMedicalDeposit, offset);
  offset = buffer.writeInt8(o.bAttitude, offset);
  offset = buffer.writeInt8(o.bBaseMorale, offset);
  offset = buffer.writeUIntLE(0, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.sMedicalDepositAmount, offset);

  offset = buffer.writeInt8(o.bLearnToLike, offset);
  offset = writeUIntArray(o.ubApproachVal, buffer, offset, 1);
  for (let i = 0; i < o.ubApproachMod.length; i++) {
    offset = writeUIntArray(o.ubApproachMod[i], buffer, offset, 1);
  }
  offset = buffer.writeInt8(o.bTown, offset);
  offset = buffer.writeInt8(o.bTownAttachment, offset);
  offset = buffer.writeUIntLE(0, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usOptionalGearCost, offset);
  offset = writeIntArray(o.bMercOpinion, buffer, offset, 1);
  offset = buffer.writeInt8(o.bApproached, offset);
  offset = buffer.writeInt8(o.bMercStatus, offset);
  offset = writeIntArray(o.bHatedTime, buffer, offset, 1);
  offset = buffer.writeInt8(o.bLearnToLikeTime, offset);
  offset = buffer.writeInt8(o.bLearnToHateTime, offset);
  offset = writeIntArray(o.bHatedCount, buffer, offset, 1);
  offset = buffer.writeInt8(o.bLearnToLikeCount, offset);
  offset = buffer.writeInt8(o.bLearnToHateCount, offset);
  offset = buffer.writeUInt8(o.ubLastDateSpokenTo, offset);
  offset = buffer.writeUInt8(o.bLastQuoteSaidWasSpecial, offset);
  offset = buffer.writeInt8(o.bSectorZ, offset);
  offset = buffer.writeUInt16LE(o.usStrategicInsertionData, offset);
  offset = buffer.writeInt8(o.bFriendlyOrDirectDefaultResponseUsedRecently, offset);
  offset = buffer.writeInt8(o.bRecruitDefaultResponseUsedRecently, offset);
  offset = buffer.writeInt8(o.bThreatenDefaultResponseUsedRecently, offset);
  offset = buffer.writeInt8(o.bNPCData, offset);
  offset = buffer.writeInt32LE(o.iBalance, offset);
  offset = buffer.writeInt16LE(o.sTrueSalary, offset);
  offset = buffer.writeUInt8(o.ubCivilianGroup, offset);
  offset = buffer.writeUInt8(o.ubNeedForSleep, offset);
  offset = buffer.writeUInt32LE(o.uiMoney, offset);
  offset = buffer.writeInt8(o.bNPCData2, offset);

  offset = buffer.writeUInt8(o.ubMiscFlags3, offset);

  offset = buffer.writeUInt8(o.ubDaysOfMoraleHangover, offset);
  offset = buffer.writeUInt8(o.ubNumTimesDrugUseInLifetime, offset);

  offset = buffer.writeUInt32LE(o.uiPrecedentQuoteSaid, offset);
  offset = buffer.writeUInt32LE(o.uiProfileChecksum, offset);
  offset = buffer.writeInt16LE(o.sPreCombatGridNo, offset);
  offset = buffer.writeUInt8(o.ubTimeTillNextHatedComplaint, offset);
  offset = buffer.writeUInt8(o.ubSuspiciousDeath, offset);

  offset = buffer.writeInt32LE(o.iMercMercContractLength, offset);

  offset = buffer.writeUInt32LE(o.uiTotalCostToDate, offset);
  offset = writeUIntArray(o.ubBuffer, buffer, offset, 1);

  return offset;
}

export const TIME_BETWEEN_HATED_COMPLAINTS = 24;

export const SUSPICIOUS_DEATH = 1;
export const VERY_SUSPICIOUS_DEATH = 2;

}
