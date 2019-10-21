// Kris:  November 10, 1997
// Please don't change this value from 10.  It will invalidate all of the maps and soldiers.
const MAXPATROLGRIDS = 10; // *** THIS IS A DUPLICATION - MUST BE MOVED !

// TEMP VALUES FOR NAMES
const MAXCIVLASTNAMES = 30;
UINT16 CivLastNames[MAXCIVLASTNAMES][10];

// ANDREW: these are defines for OKDestanation usage - please move to approprite file
const IGNOREPEOPLE = 0;
const PEOPLETOO = 1;
const ALLPEOPLE = 2;
const FALLINGTEST = 3;

const LOCKED_NO_NEWGRIDNO = 2;

const NO_PROFILE = 200;

const BATTLE_SND_LOWER_VOLUME = 1;

const TAKE_DAMAGE_GUNFIRE = 1;
const TAKE_DAMAGE_BLADE = 2;
const TAKE_DAMAGE_HANDTOHAND = 3;
const TAKE_DAMAGE_FALLROOF = 4;
const TAKE_DAMAGE_BLOODLOSS = 5;
const TAKE_DAMAGE_EXPLOSION = 6;
const TAKE_DAMAGE_ELECTRICITY = 7;
const TAKE_DAMAGE_GAS = 8;
const TAKE_DAMAGE_TENTACLES = 9;
const TAKE_DAMAGE_STRUCTURE_EXPLOSION = 10;
const TAKE_DAMAGE_OBJECT = 11;

const SOLDIER_UNBLIT_SIZE = (75 * 75 * 2);

const SOLDIER_IS_TACTICALLY_VALID = 0x00000001;
const SOLDIER_SHOULD_BE_TACTICALLY_VALID = 0x00000002;
const SOLDIER_MULTI_SELECTED = 0x00000004;
const SOLDIER_PC = 0x00000008;
const SOLDIER_ATTACK_NOTICED = 0x00000010;
const SOLDIER_PCUNDERAICONTROL = 0x00000020;
const SOLDIER_UNDERAICONTROL = 0x00000040;
const SOLDIER_DEAD = 0x00000080;
const SOLDIER_GREEN_RAY = 0x00000100;
const SOLDIER_LOOKFOR_ITEMS = 0x00000200;
const SOLDIER_ENEMY = 0x00000400;
const SOLDIER_ENGAGEDINACTION = 0x00000800;
const SOLDIER_ROBOT = 0x00001000;
const SOLDIER_MONSTER = 0x00002000;
const SOLDIER_ANIMAL = 0x00004000;
const SOLDIER_VEHICLE = 0x00008000;
const SOLDIER_MULTITILE_NZ = 0x00010000;
const SOLDIER_MULTITILE_Z = 0x00020000;
const SOLDIER_MULTITILE = (SOLDIER_MULTITILE_Z | SOLDIER_MULTITILE_NZ);
const SOLDIER_RECHECKLIGHT = 0x00040000;
const SOLDIER_TURNINGFROMHIT = 0x00080000;
const SOLDIER_BOXER = 0x00100000;
const SOLDIER_LOCKPENDINGACTIONCOUNTER = 0x00200000;
const SOLDIER_COWERING = 0x00400000;
const SOLDIER_MUTE = 0x00800000;
const SOLDIER_GASSED = 0x01000000;
const SOLDIER_OFF_MAP = 0x02000000;
const SOLDIER_PAUSEANIMOVE = 0x04000000;
const SOLDIER_DRIVER = 0x08000000;
const SOLDIER_PASSENGER = 0x10000000;
const SOLDIER_NPC_DOING_PUNCH = 0x20000000;
const SOLDIER_NPC_SHOOTING = 0x40000000;
const SOLDIER_LOOK_NEXT_TURNSOLDIER = 0x80000000;

/*
#define	SOLDIER_TRAIT_LOCKPICKING		0x0001
#define	SOLDIER_TRAIT_HANDTOHAND		0x0002
#define	SOLDIER_TRAIT_ELECTRONICS		0x0004
#define	SOLDIER_TRAIT_NIGHTOPS			0x0008
#define	SOLDIER_TRAIT_THROWING			0x0010
#define	SOLDIER_TRAIT_TEACHING			0x0020
#define	SOLDIER_TRAIT_HEAVY_WEAPS		0x0040
#define	SOLDIER_TRAIT_AUTO_WEAPS		0x0080
#define	SOLDIER_TRAIT_STEALTHY			0x0100
#define	SOLDIER_TRAIT_AMBIDEXT			0x0200
#define	SOLDIER_TRAIT_THIEF					0x0400
#define	SOLDIER_TRAIT_MARTIALARTS		0x0800
#define	SOLDIER_TRAIT_KNIFING				0x1000
*/
const HAS_SKILL_TRAIT = (s, t) => (s->ubSkillTrait1 == t || s->ubSkillTrait2 == t);
const NUM_SKILL_TRAITS = (s, t) => ((s->ubSkillTrait1 == t) ? ((s->ubSkillTrait2 == t) ? 2 : 1) : ((s->ubSkillTrait2 == t) ? 1 : 0));

const SOLDIER_QUOTE_SAID_IN_SHIT = 0x0001;
const SOLDIER_QUOTE_SAID_LOW_BREATH = 0x0002;
const SOLDIER_QUOTE_SAID_BEING_PUMMELED = 0x0004;
const SOLDIER_QUOTE_SAID_NEED_SLEEP = 0x0008;
const SOLDIER_QUOTE_SAID_LOW_MORAL = 0x0010;
const SOLDIER_QUOTE_SAID_MULTIPLE_CREATURES = 0x0020;
const SOLDIER_QUOTE_SAID_ANNOYING_MERC = 0x0040;
const SOLDIER_QUOTE_SAID_LIKESGUN = 0x0080;
const SOLDIER_QUOTE_SAID_DROWNING = 0x0100;
const SOLDIER_QUOTE_SAID_ROTTINGCORPSE = 0x0200;
const SOLDIER_QUOTE_SAID_SPOTTING_CREATURE_ATTACK = 0x0400;
const SOLDIER_QUOTE_SAID_SMELLED_CREATURE = 0x0800;
const SOLDIER_QUOTE_SAID_ANTICIPATING_DANGER = 0x1000;
const SOLDIER_QUOTE_SAID_WORRIED_ABOUT_CREATURES = 0x2000;
const SOLDIER_QUOTE_SAID_PERSONALITY = 0x4000;
const SOLDIER_QUOTE_SAID_FOUND_SOMETHING_NICE = 0x8000;

const SOLDIER_QUOTE_SAID_EXT_HEARD_SOMETHING = 0x0001;
const SOLDIER_QUOTE_SAID_EXT_SEEN_CREATURE_ATTACK = 0x0002;
const SOLDIER_QUOTE_SAID_EXT_USED_BATTLESOUND_HIT = 0x0004;
const SOLDIER_QUOTE_SAID_EXT_CLOSE_CALL = 0x0008;
const SOLDIER_QUOTE_SAID_EXT_MIKE = 0x0010;
const SOLDIER_QUOTE_SAID_DONE_ASSIGNMENT = 0x0020;
const SOLDIER_QUOTE_SAID_BUDDY_1_WITNESSED = 0x0040;
const SOLDIER_QUOTE_SAID_BUDDY_2_WITNESSED = 0x0080;
const SOLDIER_QUOTE_SAID_BUDDY_3_WITNESSED = 0x0100;

const SOLDIER_CONTRACT_RENEW_QUOTE_NOT_USED = 0;
const SOLDIER_CONTRACT_RENEW_QUOTE_89_USED = 1;
const SOLDIER_CONTRACT_RENEW_QUOTE_115_USED = 2;

const SOLDIER_MISC_HEARD_GUNSHOT = 0x01;
// make sure soldiers (esp tanks) are not hurt multiple times by explosions
const SOLDIER_MISC_HURT_BY_EXPLOSION = 0x02;
// should be revealed due to xrays
const SOLDIER_MISC_XRAYED = 0x04;

const MAXBLOOD = 40;
const NOBLOOD = MAXBLOOD;
const BLOODTIME = 5;
const FOOTPRINTTIME = 2;
const MIN_BLEEDING_THRESHOLD = 12; // you're OK while <4 Yellow life bars

const BANDAGED = (s) => (s->bLifeMax - s->bLife - s->bBleeding);

// amount of time a stats is to be displayed differently, due to change
const CHANGE_STAT_RECENTLY_DURATION = 60000;

// MACROS
// #######################################################

const NO_PENDING_ACTION = 255;
const NO_PENDING_ANIMATION = 32001;
const NO_PENDING_DIRECTION = 253;
const NO_PENDING_STANCE = 254;
const NO_DESIRED_HEIGHT = 255;

const MAX_FULLTILE_DIRECTIONS = 3;

// ENUMERATIONS FOR ACTIONS
const enum Enum257 {
  MERC_OPENDOOR,
  MERC_OPENSTRUCT,
  MERC_PICKUPITEM,
  MERC_PUNCH,
  MERC_KNIFEATTACK,
  MERC_GIVEAID,
  MERC_GIVEITEM,
  MERC_WAITFOROTHERSTOTRIGGER,
  MERC_CUTFFENCE,
  MERC_DROPBOMB,
  MERC_STEAL,
  MERC_TALK,
  MERC_ENTER_VEHICLE,
  MERC_REPAIR,
  MERC_RELOADROBOT,
  MERC_TAKEBLOOD,
  MERC_ATTACH_CAN,
  MERC_FUEL_VEHICLE,
}

// ENUMERATIONS FOR THROW ACTIONS
const enum Enum258 {
  NO_THROW_ACTION,
  THROW_ARM_ITEM,
  THROW_TARGET_MERC_CATCH,
}

// An enumeration for playing battle sounds
const enum Enum259 {
  BATTLE_SOUND_OK1,
  BATTLE_SOUND_OK2,
  BATTLE_SOUND_COOL1,
  BATTLE_SOUND_CURSE1,
  BATTLE_SOUND_HIT1,
  BATTLE_SOUND_HIT2,
  BATTLE_SOUND_LAUGH1,
  BATTLE_SOUND_ATTN1,
  BATTLE_SOUND_DIE1,
  BATTLE_SOUND_HUMM,
  BATTLE_SOUND_NOTHING,
  BATTLE_SOUND_GOTIT,
  BATTLE_SOUND_LOWMARALE_OK1,
  BATTLE_SOUND_LOWMARALE_OK2,
  BATTLE_SOUND_LOWMARALE_ATTN1,
  BATTLE_SOUND_LOCKED,
  BATTLE_SOUND_ENEMY,
  NUM_MERC_BATTLE_SOUNDS,
}

// different kinds of merc
const enum Enum260 {
  MERC_TYPE__PLAYER_CHARACTER,
  MERC_TYPE__AIM_MERC,
  MERC_TYPE__MERC,
  MERC_TYPE__NPC,
  MERC_TYPE__EPC,
  MERC_TYPE__NPC_WITH_UNEXTENDABLE_CONTRACT,
  MERC_TYPE__VEHICLE,
}

// I don't care if this isn't intuitive!  The hand positions go right
// before the big pockets so we can loop through them that way. --CJC
const NO_SLOT = -1;

// vehicle/human path structure
interface PathSt {
  uiSectorId: UINT32;
  uiEta: UINT32;
  fSpeed: BOOLEAN;
  pNext: Pointer<PathSt>;
  pPrev: Pointer<PathSt>;
}

type PathStPtr = Pointer<PathSt>;
const enum Enum261 {
  HELMETPOS = 0,
  VESTPOS,
  LEGPOS,
  HEAD1POS,
  HEAD2POS,
  HANDPOS,
  SECONDHANDPOS,
  BIGPOCK1POS,
  BIGPOCK2POS,
  BIGPOCK3POS,
  BIGPOCK4POS,
  SMALLPOCK1POS,
  SMALLPOCK2POS,
  SMALLPOCK3POS,
  SMALLPOCK4POS,
  SMALLPOCK5POS,
  SMALLPOCK6POS,
  SMALLPOCK7POS,
  SMALLPOCK8POS, // = 18, so 19 pockets needed

  NUM_INV_SLOTS,
}

// used for color codes, but also shows the enemy type for debugging purposes
const enum Enum262 {
  SOLDIER_CLASS_NONE,
  SOLDIER_CLASS_ADMINISTRATOR,
  SOLDIER_CLASS_ELITE,
  SOLDIER_CLASS_ARMY,
  SOLDIER_CLASS_GREEN_MILITIA,
  SOLDIER_CLASS_REG_MILITIA,
  SOLDIER_CLASS_ELITE_MILITIA,
  SOLDIER_CLASS_CREATURE,
  SOLDIER_CLASS_MINER,
}

const SOLDIER_CLASS_ENEMY = (bSoldierClass) => ((bSoldierClass >= SOLDIER_CLASS_ADMINISTRATOR) && (bSoldierClass <= SOLDIER_CLASS_ARMY));
const SOLDIER_CLASS_MILITIA = (bSoldierClass) => ((bSoldierClass >= SOLDIER_CLASS_GREEN_MILITIA) && (bSoldierClass <= SOLDIER_CLASS_ELITE_MILITIA));

// This macro should be used whenever we want to see if someone is neutral
// IF WE ARE CONSIDERING ATTACKING THEM.  Creatures & bloodcats will attack neutrals
// but they can't attack empty vehicles!!
const CONSIDERED_NEUTRAL = (me, them) => ((them->bNeutral) && (me->bTeam != CREATURE_TEAM || (them->uiStatusFlags & SOLDIER_VEHICLE)));

interface KEY_ON_RING {
  ubKeyID: UINT8;
  ubNumber: UINT8;
}

interface THROW_PARAMS {
  dX: float;
  dY: float;
  dZ: float;
  dForceX: float;
  dForceY: float;
  dForceZ: float;
  dLifeSpan: float;
  ubActionCode: UINT8;
  uiActionData: UINT32;
}

const DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE = 0x01;

// reasons for being unable to continue movement
const enum Enum263 {
  REASON_STOPPED_NO_APS,
  REASON_STOPPED_SIGHT,
}

const enum Enum264 {
  HIT_BY_TEARGAS = 0x01,
  HIT_BY_MUSTARDGAS = 0x02,
  HIT_BY_CREATUREGAS = 0x04,
}

interface SOLDIERTYPE {
  // ID
  ubID: UINT8;
  bReserved1: UINT8;

  // DESCRIPTION / STATS, ETC
  ubBodyType: UINT8;
  bActionPoints: INT8;
  bInitialActionPoints: INT8;

  uiStatusFlags: UINT32;

  inv: OBJECTTYPE[] /* [NUM_INV_SLOTS] */;
  pTempObject: Pointer<OBJECTTYPE>;
  pKeyRing: Pointer<KEY_ON_RING>;

  bOldLife: INT8; // life at end of last turn, recorded for monster AI
  // attributes
  bInSector: UINT8;
  bFlashPortraitFrame: INT8;
  sFractLife: INT16; // fraction of life pts (in hundreths)
  bBleeding: INT8; // blood loss control variable
  bBreath: INT8; // current breath value
  bBreathMax: INT8; // max breath, affected by fatigue/sleep
  bStealthMode: INT8;

  sBreathRed: INT16; // current breath value
  fDelayedMovement: BOOLEAN;

  fReloading: BOOLEAN;
  ubWaitActionToDo: UINT8;
  fPauseAim: BOOLEAN;
  ubInsertionDirection: INT8;
  bGunType: INT8;
  // skills
  ubOppNum: UINT8;
  bLastRenderVisibleValue: INT8;
  fInMissionExitNode: BOOLEAN;
  ubAttackingHand: UINT8;
  bScientific: INT8;
  // traits
  sWeightCarriedAtTurnStart: INT16;
  name: UINT16[] /* [10] */;

  bVisible: INT8; // to render or not to render...

  bActive: INT8;

  bTeam: INT8; // Team identifier

  // NEW MOVEMENT INFORMATION for Strategic Movement
  ubGroupID: UINT8; // the movement group the merc is currently part of.
  fBetweenSectors: BOOLEAN; // set when the group isn't actually in a sector.
                            // sSectorX and sSectorY will reflect the sector the
                            // merc was at last.
  ubMovementNoiseHeard: UINT8; // 8 flags by direction

  // WORLD POSITION STUFF
  dXPos: FLOAT;
  dYPos: FLOAT;
  dOldXPos: FLOAT;
  dOldYPos: FLOAT;
  sInitialGridNo: INT16;
  sGridNo: INT16;
  bDirection: INT8;
  sHeightAdjustment: INT16;
  sDesiredHeight: INT16;
  sTempNewGridNo: INT16; // New grid no for advanced animations
  sRoomNo: INT16;
  bOverTerrainType: INT8;
  bOldOverTerrainType: INT8;

  bCollapsed: INT8; // collapsed due to being out of APs
  bBreathCollapsed: INT8; // collapsed due to being out of APs
  ubDesiredHeight: UINT8;
  usPendingAnimation: UINT16;
  ubPendingStanceChange: UINT8;
  usAnimState: UINT16;
  fNoAPToFinishMove: BOOLEAN;
  fPausedMove: BOOLEAN;
  fUIdeadMerc: BOOLEAN; // UI Flags for removing a newly dead merc
  fUInewMerc: BOOLEAN; // UI Flags for adding newly created merc ( panels, etc )
  fUICloseMerc: BOOLEAN; // UI Flags for closing panels
  fUIFirstTimeNOAP: BOOLEAN; // UI Flag for diming guys when no APs ( dirty flags )
  fUIFirstTimeUNCON: BOOLEAN; // UI FLAG For unconscious dirty

  UpdateCounter: TIMECOUNTER;
  DamageCounter: TIMECOUNTER;
  ReloadCounter: TIMECOUNTER;
  FlashSelCounter: TIMECOUNTER;
  AICounter: TIMECOUNTER;
  FadeCounter: TIMECOUNTER;

  ubSkillTrait1: UINT8;
  ubSkillTrait2: UINT8;

  uiAIDelay: UINT32;
  bDexterity: INT8; // dexterity (hand coord) value
  bWisdom: INT8;
  sReloadDelay: INT16;
  ubAttackerID: UINT8;
  ubPreviousAttackerID: UINT8;
  fTurnInProgress: BOOLEAN;

  fIntendedTarget: BOOLEAN; // intentionally shot?
  fPauseAllAnimation: BOOLEAN;

  bExpLevel: INT8; // general experience level
  sInsertionGridNo: INT16;

  fContinueMoveAfterStanceChange: BOOLEAN;

  // 60
  AnimCache: AnimationSurfaceCacheType; // will be 9 bytes once changed to pointers

  bLife: INT8; // current life (hit points or health)
  bSide: UINT8;
  bViewRange: UINT8;
  bNewOppCnt: INT8;
  bService: INT8; // first aid, or other time consuming process

  usAniCode: UINT16;
  usAniFrame: UINT16;
  sAniDelay: INT16;

  // MOVEMENT TO NEXT TILE HANDLING STUFF
  bAgility: INT8; // agility (speed) value
  ubDelayedMovementCauseMerc: UINT8;
  sDelayedMovementCauseGridNo: INT16;
  sReservedMovementGridNo: INT16;

  bStrength: INT8;

  // Weapon Stuff
  fHoldAttackerUntilDone: BOOLEAN;
  sTargetGridNo: INT16;
  bTargetLevel: INT8;
  bTargetCubeLevel: INT8;
  sLastTarget: INT16;
  bTilesMoved: INT8;
  bLeadership: INT8;
  dNextBleed: FLOAT;
  fWarnedAboutBleeding: BOOLEAN;
  fDyingComment: BOOLEAN;

  ubTilesMovedPerRTBreathUpdate: UINT8;
  usLastMovementAnimPerRTBreathUpdate: UINT16;

  fTurningToShoot: BOOLEAN;
  fTurningToFall: BOOLEAN;
  fTurningUntilDone: BOOLEAN;
  fGettingHit: BOOLEAN;
  fInNonintAnim: BOOLEAN;
  fFlashLocator: BOOLEAN;
  sLocatorFrame: INT16;
  fShowLocator: BOOLEAN;
  fFlashPortrait: BOOLEAN;
  bMechanical: INT8;
  bLifeMax: INT8; // maximum life for this merc

  iFaceIndex: INT32;

  // PALETTE MANAGEMENT STUFF
  HeadPal: PaletteRepID; // 30
  PantsPal: PaletteRepID; // 30
  VestPal: PaletteRepID; // 30
  SkinPal: PaletteRepID; // 30
  MiscPal: PaletteRepID; // 30

  // FULL 3-d TILE STUFF ( keep records of three tiles infront )
  usFrontArcFullTileList: UINT16[] /* [MAX_FULLTILE_DIRECTIONS] */;
  usFrontArcFullTileGridNos: INT16[] /* [MAX_FULLTILE_DIRECTIONS] */;

  p8BPPPalette: Pointer<SGPPaletteEntry>; // 4
  p16BPPPalette: Pointer<UINT16>;
  pShades: Pointer<UINT16>[] /* [NUM_SOLDIER_SHADES] */; // Shading tables
  pGlowShades: Pointer<UINT16>[] /* [20] */; //
  pCurrentShade: Pointer<UINT16>;
  bMedical: INT8;
  fBeginFade: BOOLEAN;
  ubFadeLevel: UINT8;
  ubServiceCount: UINT8;
  ubServicePartner: UINT8;
  bMarksmanship: INT8;
  bExplosive: INT8;
  pThrowParams: Pointer<THROW_PARAMS>;
  fTurningFromPronePosition: BOOLEAN;
  bReverse: INT8;
  pLevelNode: Pointer<LEVELNODE>;
  pExternShadowLevelNode: Pointer<LEVELNODE>;
  pRoofUILevelNode: Pointer<LEVELNODE>;

  // WALKING STUFF
  bDesiredDirection: INT8;
  sDestXPos: INT16;
  sDestYPos: INT16;
  sDesiredDest: INT16;
  sDestination: INT16;
  sFinalDestination: INT16;
  bLevel: INT8;
  bStopped: INT8;
  bNeedToLook: INT8;

  // PATH STUFF
  usPathingData: UINT16[] /* [MAX_PATH_LIST_SIZE] */;
  usPathDataSize: UINT16;
  usPathIndex: UINT16;
  sBlackList: INT16;
  bAimTime: INT8;
  bShownAimTime: INT8;
  bPathStored: INT8; // good for AI to reduct redundancy
  bHasKeys: INT8; // allows AI controlled dudes to open locked doors

  // UNBLIT BACKGROUND
  pBackGround: Pointer<UINT16>;
  pZBackground: Pointer<UINT16>;

  usUnblitX: UINT16;
  usUnblitY: UINT16;

  usUnblitWidth: UINT16;
  usUnblitHeight: UINT16;

  ubStrategicInsertionCode: UINT8;
  usStrategicInsertionData: UINT16;

  iLight: INT32;
  iMuzFlash: INT32;
  bMuzFlashCount: INT8;

  sX: INT16;
  sY: INT16;

  usOldAniState: UINT16;
  sOldAniCode: INT16;

  bBulletsLeft: INT8;
  ubSuppressionPoints: UINT8;

  // STUFF FOR RANDOM ANIMATIONS
  uiTimeOfLastRandomAction: UINT32;
  usLastRandomAnim: INT16;

  // AI STUFF
  bOppList: INT8[] /* [MAX_NUM_SOLDIERS] */; // AI knowledge database
  bLastAction: INT8;
  bAction: INT8;
  usActionData: UINT16;
  bNextAction: INT8;
  usNextActionData: UINT16;
  bActionInProgress: INT8;
  bAlertStatus: INT8;
  bOppCnt: INT8;
  bNeutral: INT8;
  bNewSituation: INT8;
  bNextTargetLevel: INT8;
  bOrders: INT8;
  bAttitude: INT8;
  bUnderFire: INT8;
  bShock: INT8;
  bUnderEscort: INT8;
  bBypassToGreen: INT8;
  ubLastMercToRadio: UINT8;
  bDominantDir: INT8; // AI main direction to face...
  bPatrolCnt: INT8; // number of patrol gridnos
  bNextPatrolPnt: INT8; // index to next patrol gridno
  usPatrolGrid: INT16[] /* [MAXPATROLGRIDS] */; // AI list for ptr->orders==PATROL
  sNoiseGridno: INT16;
  ubNoiseVolume: UINT8;
  bLastAttackHit: INT8;
  ubXRayedBy: UINT8;
  dHeightAdjustment: FLOAT;
  bMorale: INT8;
  bTeamMoraleMod: INT8;
  bTacticalMoraleMod: INT8;
  bStrategicMoraleMod: INT8;
  bAIMorale: INT8;
  ubPendingAction: UINT8;
  ubPendingActionAnimCount: UINT8;
  uiPendingActionData1: UINT32;
  sPendingActionData2: INT16;
  bPendingActionData3: INT8;
  ubDoorHandleCode: INT8;
  uiPendingActionData4: UINT32;
  bInterruptDuelPts: INT8;
  bPassedLastInterrupt: INT8;
  bIntStartAPs: INT8;
  bMoved: INT8;
  bHunting: INT8;
  ubLastCall: UINT8;
  ubCaller: UINT8;
  sCallerGridNo: INT16;
  bCallPriority: UINT8;
  bCallActedUpon: INT8;
  bFrenzied: INT8;
  bNormalSmell: INT8;
  bMonsterSmell: INT8;
  bMobility: INT8;
  bRTPCombat: INT8;
  fAIFlags: INT8;

  fDontChargeReadyAPs: BOOLEAN;
  usAnimSurface: UINT16;
  sZLevel: UINT16;
  fPrevInWater: BOOLEAN;
  fGoBackToAimAfterHit: BOOLEAN;

  sWalkToAttackGridNo: INT16;
  sWalkToAttackWalkToCost: INT16;

  fForceRenderColor: BOOLEAN;
  fForceNoRenderPaletteCycle: BOOLEAN;

  sLocatorOffX: INT16;
  sLocatorOffY: INT16;
  fStopPendingNextTile: BOOLEAN;

  fForceShade: BOOLEAN;
  pForcedShade: Pointer<UINT16>;

  bDisplayDamageCount: INT8;
  fDisplayDamage: INT8;
  sDamage: INT16;
  sDamageX: INT16;
  sDamageY: INT16;
  bDamageDir: INT8;
  bDoBurst: INT8;
  usUIMovementMode: INT16;
  bUIInterfaceLevel: INT8;
  fUIMovementFast: BOOLEAN;

  BlinkSelCounter: TIMECOUNTER;
  PortraitFlashCounter: TIMECOUNTER;
  fDeadSoundPlayed: BOOLEAN;
  ubProfile: UINT8;
  ubQuoteRecord: UINT8;
  ubQuoteActionID: UINT8;
  ubBattleSoundID: UINT8;

  fClosePanel: BOOLEAN;
  fClosePanelToDie: BOOLEAN;
  ubClosePanelFrame: UINT8;
  fDeadPanel: BOOLEAN;
  ubDeadPanelFrame: UINT8;
  fOpenPanel: BOOLEAN;
  bOpenPanelFrame: INT8;

  sPanelFaceX: INT16;
  sPanelFaceY: INT16;

  // QUOTE STUFF
  bNumHitsThisTurn: INT8;
  usQuoteSaidFlags: UINT16;
  fCloseCall: INT8;
  bLastSkillCheck: INT8;
  ubSkillCheckAttempts: INT8;

  bVocalVolume: INT8; // verbal sounds need to differ in volume

  bStartFallDir: INT8;
  fTryingToFall: INT8;

  ubPendingDirection: UINT8;
  uiAnimSubFlags: UINT32;

  bAimShotLocation: UINT8;
  ubHitLocation: UINT8;

  pEffectShades: Pointer<UINT16>[] /* [NUM_SOLDIER_EFFECTSHADES] */; // Shading tables for effects

  ubPlannedUIAPCost: UINT8;
  sPlannedTargetX: INT16;
  sPlannedTargetY: INT16;

  sSpreadLocations: INT16[] /* [6] */;
  fDoSpread: BOOLEAN;
  sStartGridNo: INT16;
  sEndGridNo: INT16;
  sForcastGridno: INT16;
  sZLevelOverride: INT16;
  bMovedPriorToInterrupt: INT8;
  iEndofContractTime: INT32; // time, in global time(resolution, minutes) that merc will leave, or if its a M.E.R.C. merc it will be set to -1.  -2 for NPC and player generated
  iStartContractTime: INT32;
  iTotalContractLength: INT32; // total time of AIM mercs contract	or the time since last paid for a M.E.R.C. merc
  iNextActionSpecialData: INT32; // AI special action data record for the next action
  ubWhatKindOfMercAmI: UINT8; // Set to the type of character it is
  bAssignment: INT8; // soldiers current assignment
  bOldAssignment: INT8; // old assignment, for autosleep purposes
  fForcedToStayAwake: BOOLEAN; // forced by player to stay awake, reset to false, the moment they are set to rest or sleep
  bTrainStat: INT8; // current stat soldier is training
  sSectorX: INT16; // X position on the Stategic Map
  sSectorY: INT16; // Y position on the Stategic Map
  bSectorZ: INT8; // Z sector location
  iVehicleId: INT32; // the id of the vehicle the char is in
  pMercPath: PathStPtr; // Path Structure
  fHitByGasFlags: UINT8; // flags
  usMedicalDeposit: UINT16; // is there a medical deposit on merc
  usLifeInsurance: UINT16; // is there life insurance taken out on merc

  // DEF:  Used for the communications
  uiStartMovementTime: UINT32; // the time since the merc first started moving
  uiOptimumMovementTime: UINT32; // everytime in ececute overhead the time for the current ani will be added to this total
  usLastUpdateTime: UINT32; // The last time the soldier was in ExecuteOverhead

  fIsSoldierMoving: BOOLEAN; // ie.  Record time is on
  fIsSoldierDelayed: BOOLEAN; // Is the soldier delayed Soldier
  fSoldierUpdatedFromNetwork: BOOLEAN;
  uiSoldierUpdateNumber: UINT32;
  ubSoldierUpdateType: BYTE;
  iStartOfInsuranceContract: INT32;
  uiLastAssignmentChangeMin: UINT32; // timestamp of last assignment change in minutes
  iTotalLengthOfInsuranceContract: INT32;

  ubSoldierClass: UINT8; // admin, elite, troop (creature types?)
  ubAPsLostToSuppression: UINT8;
  fChangingStanceDueToSuppression: BOOLEAN;
  ubSuppressorID: UINT8;

  // Squad merging vars
  ubDesiredSquadAssignment: UINT8;
  ubNumTraversalsAllowedToMerge: UINT8;

  usPendingAnimation2: UINT16;
  ubCivilianGroup: UINT8;

  // time changes...when a stat was changed according to GetJA2Clock();
  uiChangeLevelTime: UINT32;
  uiChangeHealthTime: UINT32;
  uiChangeStrengthTime: UINT32;
  uiChangeDexterityTime: UINT32;
  uiChangeAgilityTime: UINT32;
  uiChangeWisdomTime: UINT32;
  uiChangeLeadershipTime: UINT32;
  uiChangeMarksmanshipTime: UINT32;
  uiChangeExplosivesTime: UINT32;
  uiChangeMedicalTime: UINT32;
  uiChangeMechanicalTime: UINT32;

  uiUniqueSoldierIdValue: UINT32; // the unique value every instance of a soldier gets - 1 is the first valid value
  bBeingAttackedCount: INT8; // Being attacked counter

  bNewItemCount: INT8[] /* [NUM_INV_SLOTS] */;
  bNewItemCycleCount: INT8[] /* [NUM_INV_SLOTS] */;
  fCheckForNewlyAddedItems: BOOLEAN;
  bEndDoorOpenCode: INT8;

  ubScheduleID: UINT8;
  sEndDoorOpenCodeData: INT16;
  NextTileCounter: TIMECOUNTER;
  fBlockedByAnotherMerc: BOOLEAN;
  bBlockedByAnotherMercDirection: INT8;
  usAttackingWeapon: UINT16;
  bWeaponMode: INT8;
  ubTargetID: UINT8;
  bAIScheduleProgress: INT8;
  sOffWorldGridNo: INT16;
  pAniTile: Pointer<ANITILE>;
  bCamo: INT8;
  sAbsoluteFinalDestination: INT16;
  ubHiResDirection: UINT8;
  ubHiResDesiredDirection: UINT8;
  ubLastFootPrintSound: UINT8;
  bVehicleID: INT8;
  fPastXDest: INT8;
  fPastYDest: INT8;
  bMovementDirection: INT8;
  sOldGridNo: INT16;
  usDontUpdateNewGridNoOnMoveAnimChange: UINT16;
  sBoundingBoxWidth: INT16;
  sBoundingBoxHeight: INT16;
  sBoundingBoxOffsetX: INT16;
  sBoundingBoxOffsetY: INT16;
  uiTimeSameBattleSndDone: UINT32;
  bOldBattleSnd: INT8;
  fReactingFromBeingShot: BOOLEAN;
  fContractPriceHasIncreased: BOOLEAN;
  iBurstSoundID: INT32;
  fFixingSAMSite: BOOLEAN;
  fFixingRobot: BOOLEAN;
  bSlotItemTakenFrom: INT8;
  fSignedAnotherContract: BOOLEAN;
  ubAutoBandagingMedic: UINT8;
  fDontChargeTurningAPs: BOOLEAN;
  ubRobotRemoteHolderID: UINT8;
  uiTimeOfLastContractUpdate: UINT32;
  bTypeOfLastContract: INT8;
  bTurnsCollapsed: INT8;
  bSleepDrugCounter: INT8;
  ubMilitiaKills: UINT8;

  bFutureDrugEffect: INT8[] /* [2] */; // value to represent effect of a needle
  bDrugEffectRate: INT8[] /* [2] */; // represents rate of increase and decrease of effect
  bDrugEffect: INT8[] /* [2] */; // value that affects AP & morale calc ( -ve is poorly )
  bDrugSideEffectRate: INT8[] /* [2] */; // duration of negative AP and morale effect
  bDrugSideEffect: INT8[] /* [2] */; // duration of negative AP and morale effect
  bTimesDrugUsedSinceSleep: INT8[] /* [2] */;

  bBlindedCounter: INT8;
  fMercCollapsedFlag: BOOLEAN;
  fDoneAssignmentAndNothingToDoFlag: BOOLEAN;
  fMercAsleep: BOOLEAN;
  fDontChargeAPsForStanceChange: BOOLEAN;

  ubHoursOnAssignment: UINT8; // used for assignments handled only every X hours

  ubMercJustFired: UINT8; // the merc was just fired..there may be dialogue events occuring, this flag will prevent any interaction with contracts
                          // until after the merc leaves
  ubTurnsUntilCanSayHeardNoise: UINT8;
  usQuoteSaidExtFlags: UINT16;

  sContPathLocation: UINT16;
  bGoodContPath: INT8;
  ubPendingActionInterrupted: UINT8;
  bNoiseLevel: INT8;
  bRegenerationCounter: INT8;
  bRegenBoostersUsedToday: INT8;
  bNumPelletsHitBy: INT8;
  sSkillCheckGridNo: INT16;
  ubLastEnemyCycledID: UINT8;

  ubPrevSectorID: UINT8;
  ubNumTilesMovesSinceLastForget: UINT8;
  bTurningIncrement: INT8;
  uiBattleSoundID: UINT32;

  fSoldierWasMoving: BOOLEAN;
  fSayAmmoQuotePending: BOOLEAN;
  usValueGoneUp: UINT16;

  ubNumLocateCycles: UINT8;
  ubDelayedMovementFlags: UINT8;
  fMuzzleFlash: BOOLEAN;
  ubCTGTTargetID: UINT8;

  PanelAnimateCounter: TIMECOUNTER;
  uiMercChecksum: UINT32;

  bCurrentCivQuote: INT8;
  bCurrentCivQuoteDelta: INT8;
  ubMiscSoldierFlags: UINT8;
  ubReasonCantFinishMove: UINT8;

  sLocationOfFadeStart: INT16;
  bUseExitGridForReentryDirection: UINT8;

  uiTimeSinceLastSpoke: UINT32;
  ubContractRenewalQuoteCode: UINT8;
  sPreTraversalGridNo: INT16;
  uiXRayActivatedTime: UINT32;
  bTurningFromUI: INT8;
  bPendingActionData5: INT8;

  bDelayedStrategicMoraleMod: INT8;
  ubDoorOpeningNoise: UINT8;

  pGroup: Pointer<GROUP>;
  ubLeaveHistoryCode: UINT8;
  fDontUnsetLastTargetFromTurn: BOOLEAN;
  bOverrideMoveSpeed: INT8;
  fUseMoverrideMoveSpeed: BOOLEAN;

  uiTimeSoldierWillArrive: UINT32;
  fDieSoundUsed: BOOLEAN;
  fUseLandingZoneForArrival: BOOLEAN;
  fFallClockwise: BOOLEAN;
  bVehicleUnderRepairID: INT8;
  iTimeCanSignElsewhere: INT32;
  bHospitalPriceModifier: INT8;
  bFillerBytes: INT8[] /* [3] */;
  uiStartTimeOfInsuranceContract: UINT32;
  fRTInNonintAnim: BOOLEAN;
  fDoingExternalDeath: BOOLEAN;
  bCorpseQuoteTolerance: INT8;
  bYetAnotherPaddingSpace: INT8;
  iPositionSndID: INT32;
  iTuringSoundID: INT32;
  ubLastDamageReason: UINT8;
  fComplainedThatTired: BOOLEAN;
  sLastTwoLocations: INT16[] /* [2] */;
  bFillerDude: INT16;
  uiTimeSinceLastBleedGrunt: INT32;
  ubNextToPreviousAttackerID: UINT8;

  bFiller: UINT8[] /* [39] */;
}

const HEALTH_INCREASE = 0x0001;
const STRENGTH_INCREASE = 0x0002;
const DEX_INCREASE = 0x0004;
const AGIL_INCREASE = 0x0008;
const WIS_INCREASE = 0x0010;
const LDR_INCREASE = 0x0020;

const MRK_INCREASE = 0x0040;
const MED_INCREASE = 0x0080;
const EXP_INCREASE = 0x0100;
const MECH_INCREASE = 0x0200;

const LVL_INCREASE = 0x0400;

const enum Enum265 {
  WM_NORMAL = 0,
  WM_BURST,
  WM_ATTACHED,
  NUM_WEAPON_MODES,
}

// TYPEDEFS FOR ANIMATION PROFILES
interface ANIM_PROF_TILE {
  usTileFlags: UINT16;
  bTileX: INT8;
  bTileY: INT8;
}

interface ANIM_PROF_DIR {
  ubNumTiles: UINT8;
  pTiles: Pointer<ANIM_PROF_TILE>;
}

interface ANIM_PROF {
  Dirs: ANIM_PROF_DIR[] /* [8] */;
}

// Globals
//////////

// VARIABLES FOR PALETTE REPLACEMENTS FOR HAIR, ETC
UINT32 guiNumPaletteSubRanges;
UINT8 *gubpNumReplacementsPerRange;
PaletteSubRangeType *gpPaletteSubRanges;
UINT32 guiNumReplacements;
PaletteReplacementType *gpPalRep;

UINT8 bHealthStrRanges[];

// Functions
////////////

const PTR_CIVILIAN = () => (pSoldier->bTeam == CIV_TEAM);
const PTR_CROUCHED = () => (gAnimControl[pSoldier->usAnimState].ubHeight == ANIM_CROUCH);
const PTR_STANDING = () => (gAnimControl[pSoldier->usAnimState].ubHeight == ANIM_STAND);
const PTR_PRONE = () => (gAnimControl[pSoldier->usAnimState].ubHeight == ANIM_PRONE);
