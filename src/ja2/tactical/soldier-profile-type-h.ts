const NUM_PROFILES = 170;
const FIRST_RPC = 57;
const FIRST_NPC = 75;

const NAME_LENGTH = 30;
const NICKNAME_LENGTH = 10;

// ONLY HAVE 8 MISC FLAGS.. SHOULD BE ENOUGH
const PROFILE_MISC_FLAG_RECRUITED = 0x01;
const PROFILE_MISC_FLAG_HAVESEENCREATURE = 0x02;
const PROFILE_MISC_FLAG_FORCENPCQUOTE = 0x04;
const PROFILE_MISC_FLAG_WOUNDEDBYPLAYER = 0x08;
const PROFILE_MISC_FLAG_TEMP_NPC_QUOTE_DATA_EXISTS = 0x10;
const PROFILE_MISC_FLAG_SAID_HOSTILE_QUOTE = 0x20;
const PROFILE_MISC_FLAG_EPCACTIVE = 0x40;
const PROFILE_MISC_FLAG_ALREADY_USED_ITEMS = 0x80; // The player has already purchased the mercs items.

const PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR = 0x01;
const PROFILE_MISC_FLAG2_LEFT_COUNTRY = 0x02;
const PROFILE_MISC_FLAG2_BANDAGED_TODAY = 0x04;
const PROFILE_MISC_FLAG2_SAID_FIRSTSEEN_QUOTE = 0x08;
const PROFILE_MISC_FLAG2_NEEDS_TO_SAY_HOSTILE_QUOTE = 0x10;
const PROFILE_MISC_FLAG2_MARRIED_TO_HICKS = 0x20;
const PROFILE_MISC_FLAG2_ASKED_BY_HICKS = 0x40;

const PROFILE_MISC_FLAG3_PLAYER_LEFT_MSG_FOR_MERC_AT_AIM = 0x01; // In the aimscreen, the merc was away and the player left a message
const PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE = 0x02;
const PROFILE_MISC_FLAG3_PLAYER_HAD_CHANCE_TO_HIRE = 0x04; // player's had a chance to hire this merc
const PROFILE_MISC_FLAG3_HANDLE_DONE_TRAVERSAL = 0x08;

const PROFILE_MISC_FLAG3_NPC_PISSED_OFF = 0x10;
const PROFILE_MISC_FLAG3_MERC_MERC_IS_DEAD_AND_QUOTE_SAID = 0x20; // In the merc site, the merc has died and Speck quote for the dead merc has been said

const PROFILE_MISC_FLAG3_TOWN_DOESNT_CARE_ABOUT_DEATH = 0x40;
const PROFILE_MISC_FLAG3_GOODGUY = 0x80;
//
// The following variables are used with the 'bMercStatus' variable
//
//

// Merc is ready
const MERC_OK = 0;

// if the merc doesnt have a EDT file
const MERC_HAS_NO_TEXT_FILE = -1;

// used in the aim video conferencing screen
const MERC_ANNOYED_BUT_CAN_STILL_CONTACT = -2;
const MERC_ANNOYED_WONT_CONTACT = -3;
const MERC_HIRED_BUT_NOT_ARRIVED_YET = -4;

// self explanatory
const MERC_IS_DEAD = -5;

// set when the merc is returning home.  A delay for 1,2 or 3 days
const MERC_RETURNING_HOME = -6;

// used when merc starts game on assignment, goes on assignment later, or leaves to go on another contract
const MERC_WORKING_ELSEWHERE = -7;

// When the merc was fired, they were a POW, make sure they dont show up in AIM, or MERC as available
const MERC_FIRED_AS_A_POW = -8;

// the values for categories of stats
const SUPER_STAT_VALUE = 80;
const NEEDS_TRAINING_STAT_VALUE = 50;
const NO_CHANCE_IN_HELL_STAT_VALUE = 40;

const SUPER_SKILL_VALUE = 80;
const NEEDS_TRAINING_SKILL_VALUE = 50;
const NO_CHANCE_IN_HELL_SKILL_VALUE = 0;

const enum Enum269 {
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

const enum Enum270 {
  NO_PERSONALITYTRAIT = 0,
  HEAT_INTOLERANT,
  NERVOUS,
  CLAUSTROPHOBIC,
  NONSWIMMER,
  FEAR_OF_INSECTS,
  FORGETFUL,
  PSYCHO,
}

const NERVOUS_RADIUS = 10;

const enum Enum271 {
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

const enum Enum272 {
  MALE = 0,
  FEMALE,
}

const enum Enum273 {
  NOT_SEXIST = 0,
  SOMEWHAT_SEXIST,
  VERY_SEXIST,
  GENTLEMAN,
}

// training defines for evolution, no stat increase, stat decrease( de-evolve )
const enum Enum274 {
  NORMAL_EVOLUTION = 0,
  NO_EVOLUTION,
  DEVOLVE,
}

const BUDDY_MERC = (prof, bud) => ((prof).value.bBuddy[0] == (bud) || (prof).value.bBuddy[1] == (bud) || (prof).value.bBuddy[2] == (bud));
const HATED_MERC = (prof, hat) => ((prof).value.bHated[0] == (hat) || (prof).value.bHated[1] == (hat) || (prof).value.bHated[2] == (hat));

const BUDDY_OPINION = +25;
const HATED_OPINION = -25;

interface MERCPROFILESTRUCT {
  zName: UINT16[] /* [NAME_LENGTH] */;
  zNickname: UINT16[] /* [NICKNAME_LENGTH] */;
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

const TIME_BETWEEN_HATED_COMPLAINTS = 24;

const SUSPICIOUS_DEATH = 1;
const VERY_SUSPICIOUS_DEATH = 2;
