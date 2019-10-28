namespace ja2 {

// Kris:  November 10, 1997
// Please don't change this value from 10.  It will invalidate all of the maps and soldiers.
export const MAXPATROLGRIDS = 10; // *** THIS IS A DUPLICATION - MUST BE MOVED !

// TEMP VALUES FOR NAMES
const MAXCIVLASTNAMES = 30;

// ANDREW: these are defines for OKDestanation usage - please move to approprite file
export const IGNOREPEOPLE = 0;
export const PEOPLETOO = 1;
const ALLPEOPLE = 2;
const FALLINGTEST = 3;

export const LOCKED_NO_NEWGRIDNO = 2;

export const NO_PROFILE = 200;

export const BATTLE_SND_LOWER_VOLUME = 1;

export const TAKE_DAMAGE_GUNFIRE = 1;
export const TAKE_DAMAGE_BLADE = 2;
export const TAKE_DAMAGE_HANDTOHAND = 3;
export const TAKE_DAMAGE_FALLROOF = 4;
export const TAKE_DAMAGE_BLOODLOSS = 5;
export const TAKE_DAMAGE_EXPLOSION = 6;
export const TAKE_DAMAGE_ELECTRICITY = 7;
export const TAKE_DAMAGE_GAS = 8;
export const TAKE_DAMAGE_TENTACLES = 9;
export const TAKE_DAMAGE_STRUCTURE_EXPLOSION = 10;
export const TAKE_DAMAGE_OBJECT = 11;

const SOLDIER_UNBLIT_SIZE = (75 * 75 * 2);

export const SOLDIER_IS_TACTICALLY_VALID = 0x00000001;
export const SOLDIER_SHOULD_BE_TACTICALLY_VALID = 0x00000002;
export const SOLDIER_MULTI_SELECTED = 0x00000004;
export const SOLDIER_PC = 0x00000008;
export const SOLDIER_ATTACK_NOTICED = 0x00000010;
export const SOLDIER_PCUNDERAICONTROL = 0x00000020;
export const SOLDIER_UNDERAICONTROL = 0x00000040;
export const SOLDIER_DEAD = 0x00000080;
export const SOLDIER_GREEN_RAY = 0x00000100;
export const SOLDIER_LOOKFOR_ITEMS = 0x00000200;
export const SOLDIER_ENEMY = 0x00000400;
export const SOLDIER_ENGAGEDINACTION = 0x00000800;
export const SOLDIER_ROBOT = 0x00001000;
export const SOLDIER_MONSTER = 0x00002000;
export const SOLDIER_ANIMAL = 0x00004000;
export const SOLDIER_VEHICLE = 0x00008000;
const SOLDIER_MULTITILE_NZ = 0x00010000;
export const SOLDIER_MULTITILE_Z = 0x00020000;
export const SOLDIER_MULTITILE = (SOLDIER_MULTITILE_Z | SOLDIER_MULTITILE_NZ);
export const SOLDIER_RECHECKLIGHT = 0x00040000;
export const SOLDIER_TURNINGFROMHIT = 0x00080000;
export const SOLDIER_BOXER = 0x00100000;
export const SOLDIER_LOCKPENDINGACTIONCOUNTER = 0x00200000;
export const SOLDIER_COWERING = 0x00400000;
export const SOLDIER_MUTE = 0x00800000;
export const SOLDIER_GASSED = 0x01000000;
export const SOLDIER_OFF_MAP = 0x02000000;
export const SOLDIER_PAUSEANIMOVE = 0x04000000;
export const SOLDIER_DRIVER = 0x08000000;
export const SOLDIER_PASSENGER = 0x10000000;
export const SOLDIER_NPC_DOING_PUNCH = 0x20000000;
export const SOLDIER_NPC_SHOOTING = 0x40000000;
export const SOLDIER_LOOK_NEXT_TURNSOLDIER = 0x80000000;

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
export const HAS_SKILL_TRAIT = (s, t) => (s.value.ubSkillTrait1 == t || s.value.ubSkillTrait2 == t);
export const NUM_SKILL_TRAITS = (s, t) => ((s.value.ubSkillTrait1 == t) ? ((s.value.ubSkillTrait2 == t) ? 2 : 1) : ((s.value.ubSkillTrait2 == t) ? 1 : 0));

export const SOLDIER_QUOTE_SAID_IN_SHIT = 0x0001;
export const SOLDIER_QUOTE_SAID_LOW_BREATH = 0x0002;
export const SOLDIER_QUOTE_SAID_BEING_PUMMELED = 0x0004;
const SOLDIER_QUOTE_SAID_NEED_SLEEP = 0x0008;
export const SOLDIER_QUOTE_SAID_LOW_MORAL = 0x0010;
export const SOLDIER_QUOTE_SAID_MULTIPLE_CREATURES = 0x0020;
export const SOLDIER_QUOTE_SAID_ANNOYING_MERC = 0x0040;
export const SOLDIER_QUOTE_SAID_LIKESGUN = 0x0080;
export const SOLDIER_QUOTE_SAID_DROWNING = 0x0100;
export const SOLDIER_QUOTE_SAID_ROTTINGCORPSE = 0x0200;
export const SOLDIER_QUOTE_SAID_SPOTTING_CREATURE_ATTACK = 0x0400;
export const SOLDIER_QUOTE_SAID_SMELLED_CREATURE = 0x0800;
const SOLDIER_QUOTE_SAID_ANTICIPATING_DANGER = 0x1000;
export const SOLDIER_QUOTE_SAID_WORRIED_ABOUT_CREATURES = 0x2000;
export const SOLDIER_QUOTE_SAID_PERSONALITY = 0x4000;
export const SOLDIER_QUOTE_SAID_FOUND_SOMETHING_NICE = 0x8000;

const SOLDIER_QUOTE_SAID_EXT_HEARD_SOMETHING = 0x0001;
const SOLDIER_QUOTE_SAID_EXT_SEEN_CREATURE_ATTACK = 0x0002;
const SOLDIER_QUOTE_SAID_EXT_USED_BATTLESOUND_HIT = 0x0004;
export const SOLDIER_QUOTE_SAID_EXT_CLOSE_CALL = 0x0008;
export const SOLDIER_QUOTE_SAID_EXT_MIKE = 0x0010;
export const SOLDIER_QUOTE_SAID_DONE_ASSIGNMENT = 0x0020;
export const SOLDIER_QUOTE_SAID_BUDDY_1_WITNESSED = 0x0040;
export const SOLDIER_QUOTE_SAID_BUDDY_2_WITNESSED = 0x0080;
export const SOLDIER_QUOTE_SAID_BUDDY_3_WITNESSED = 0x0100;

export const SOLDIER_CONTRACT_RENEW_QUOTE_NOT_USED = 0;
export const SOLDIER_CONTRACT_RENEW_QUOTE_89_USED = 1;
export const SOLDIER_CONTRACT_RENEW_QUOTE_115_USED = 2;

export const SOLDIER_MISC_HEARD_GUNSHOT = 0x01;
// make sure soldiers (esp tanks) are not hurt multiple times by explosions
export const SOLDIER_MISC_HURT_BY_EXPLOSION = 0x02;
// should be revealed due to xrays
export const SOLDIER_MISC_XRAYED = 0x04;

const MAXBLOOD = 40;
export const NOBLOOD = MAXBLOOD;
const BLOODTIME = 5;
const FOOTPRINTTIME = 2;
export const MIN_BLEEDING_THRESHOLD = 12; // you're OK while <4 Yellow life bars

const BANDAGED = (s) => (s.value.bLifeMax - s.value.bLife - s.value.bBleeding);

// amount of time a stats is to be displayed differently, due to change
export const CHANGE_STAT_RECENTLY_DURATION = 60000;

// MACROS
// #######################################################

export const NO_PENDING_ACTION = 255;
export const NO_PENDING_ANIMATION = 32001;
export const NO_PENDING_DIRECTION = 253;
export const NO_PENDING_STANCE = 254;
export const NO_DESIRED_HEIGHT = 255;

export const MAX_FULLTILE_DIRECTIONS = 3;

// ENUMERATIONS FOR ACTIONS
export const enum Enum257 {
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
export const enum Enum258 {
  NO_THROW_ACTION,
  THROW_ARM_ITEM,
  THROW_TARGET_MERC_CATCH,
}

// An enumeration for playing battle sounds
export const enum Enum259 {
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
export const enum Enum260 {
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
export const NO_SLOT = -1;

// vehicle/human path structure
export interface PathSt {
  uiSectorId: UINT32;
  uiEta: UINT32;
  fSpeed: boolean;
  pNext: Pointer<PathSt>;
  pPrev: Pointer<PathSt>;
}

export type PathStPtr = Pointer<PathSt>;
export const enum Enum261 {
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
export const enum Enum262 {
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

export const SOLDIER_CLASS_ENEMY = (bSoldierClass) => ((bSoldierClass >= Enum262.SOLDIER_CLASS_ADMINISTRATOR) && (bSoldierClass <= Enum262.SOLDIER_CLASS_ARMY));
export const SOLDIER_CLASS_MILITIA = (bSoldierClass) => ((bSoldierClass >= Enum262.SOLDIER_CLASS_GREEN_MILITIA) && (bSoldierClass <= Enum262.SOLDIER_CLASS_ELITE_MILITIA));

// This macro should be used whenever we want to see if someone is neutral
// IF WE ARE CONSIDERING ATTACKING THEM.  Creatures & bloodcats will attack neutrals
// but they can't attack empty vehicles!!
export const CONSIDERED_NEUTRAL = (me, them) => ((them.value.bNeutral) && (me.value.bTeam != CREATURE_TEAM || (them.value.uiStatusFlags & SOLDIER_VEHICLE)));

export interface KEY_ON_RING {
  ubKeyID: UINT8;
  ubNumber: UINT8;
}

export interface THROW_PARAMS {
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

export const DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE = 0x01;

// reasons for being unable to continue movement
export const enum Enum263 {
  REASON_STOPPED_NO_APS,
  REASON_STOPPED_SIGHT,
}

export const enum Enum264 {
  HIT_BY_TEARGAS = 0x01,
  HIT_BY_MUSTARDGAS = 0x02,
  HIT_BY_CREATUREGAS = 0x04,
}

export interface SOLDIERTYPE {
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
  fDelayedMovement: boolean;

  fReloading: boolean;
  ubWaitActionToDo: UINT8;
  fPauseAim: boolean;
  ubInsertionDirection: INT8;
  bGunType: INT8;
  // skills
  ubOppNum: UINT8;
  bLastRenderVisibleValue: INT8;
  fInMissionExitNode: boolean;
  ubAttackingHand: UINT8;
  bScientific: INT8;
  // traits
  sWeightCarriedAtTurnStart: INT16;
  name: string /* UINT16[10] */;

  bVisible: INT8; // to render or not to render...

  bActive: INT8;

  bTeam: INT8; // Team identifier

  // NEW MOVEMENT INFORMATION for Strategic Movement
  ubGroupID: UINT8; // the movement group the merc is currently part of.
  fBetweenSectors: boolean; // set when the group isn't actually in a sector.
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
  fNoAPToFinishMove: boolean;
  fPausedMove: boolean;
  fUIdeadMerc: boolean; // UI Flags for removing a newly dead merc
  fUInewMerc: boolean; // UI Flags for adding newly created merc ( panels, etc )
  fUICloseMerc: boolean; // UI Flags for closing panels
  fUIFirstTimeNOAP: boolean; // UI Flag for diming guys when no APs ( dirty flags )
  fUIFirstTimeUNCON: boolean; // UI FLAG For unconscious dirty

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
  fTurnInProgress: boolean;

  fIntendedTarget: boolean; // intentionally shot?
  fPauseAllAnimation: boolean;

  bExpLevel: INT8; // general experience level
  sInsertionGridNo: INT16;

  fContinueMoveAfterStanceChange: boolean;

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
  fHoldAttackerUntilDone: boolean;
  sTargetGridNo: INT16;
  bTargetLevel: INT8;
  bTargetCubeLevel: INT8;
  sLastTarget: INT16;
  bTilesMoved: INT8;
  bLeadership: INT8;
  dNextBleed: FLOAT;
  fWarnedAboutBleeding: boolean;
  fDyingComment: boolean;

  ubTilesMovedPerRTBreathUpdate: UINT8;
  usLastMovementAnimPerRTBreathUpdate: UINT16;

  fTurningToShoot: boolean;
  fTurningToFall: boolean;
  fTurningUntilDone: boolean;
  fGettingHit: boolean;
  fInNonintAnim: boolean;
  fFlashLocator: boolean;
  sLocatorFrame: INT16;
  fShowLocator: boolean;
  fFlashPortrait: boolean;
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
  fBeginFade: boolean;
  ubFadeLevel: UINT8;
  ubServiceCount: UINT8;
  ubServicePartner: UINT8;
  bMarksmanship: INT8;
  bExplosive: INT8;
  pThrowParams: Pointer<THROW_PARAMS>;
  fTurningFromPronePosition: boolean;
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

  fDontChargeReadyAPs: boolean;
  usAnimSurface: UINT16;
  sZLevel: UINT16;
  fPrevInWater: boolean;
  fGoBackToAimAfterHit: boolean;

  sWalkToAttackGridNo: INT16;
  sWalkToAttackWalkToCost: INT16;

  fForceRenderColor: boolean;
  fForceNoRenderPaletteCycle: boolean;

  sLocatorOffX: INT16;
  sLocatorOffY: INT16;
  fStopPendingNextTile: boolean;

  fForceShade: boolean;
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
  fUIMovementFast: boolean;

  BlinkSelCounter: TIMECOUNTER;
  PortraitFlashCounter: TIMECOUNTER;
  fDeadSoundPlayed: boolean;
  ubProfile: UINT8;
  ubQuoteRecord: UINT8;
  ubQuoteActionID: UINT8;
  ubBattleSoundID: UINT8;

  fClosePanel: boolean;
  fClosePanelToDie: boolean;
  ubClosePanelFrame: UINT8;
  fDeadPanel: boolean;
  ubDeadPanelFrame: UINT8;
  fOpenPanel: boolean;
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
  fDoSpread: boolean;
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
  fForcedToStayAwake: boolean; // forced by player to stay awake, reset to false, the moment they are set to rest or sleep
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

  fIsSoldierMoving: boolean; // ie.  Record time is on
  fIsSoldierDelayed: boolean; // Is the soldier delayed Soldier
  fSoldierUpdatedFromNetwork: boolean;
  uiSoldierUpdateNumber: UINT32;
  ubSoldierUpdateType: BYTE;
  iStartOfInsuranceContract: INT32;
  uiLastAssignmentChangeMin: UINT32; // timestamp of last assignment change in minutes
  iTotalLengthOfInsuranceContract: INT32;

  ubSoldierClass: UINT8; // admin, elite, troop (creature types?)
  ubAPsLostToSuppression: UINT8;
  fChangingStanceDueToSuppression: boolean;
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
  fCheckForNewlyAddedItems: boolean;
  bEndDoorOpenCode: INT8;

  ubScheduleID: UINT8;
  sEndDoorOpenCodeData: INT16;
  NextTileCounter: TIMECOUNTER;
  fBlockedByAnotherMerc: boolean;
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
  fReactingFromBeingShot: boolean;
  fContractPriceHasIncreased: boolean;
  iBurstSoundID: INT32;
  fFixingSAMSite: boolean;
  fFixingRobot: boolean;
  bSlotItemTakenFrom: INT8;
  fSignedAnotherContract: boolean;
  ubAutoBandagingMedic: UINT8;
  fDontChargeTurningAPs: boolean;
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
  fMercCollapsedFlag: boolean;
  fDoneAssignmentAndNothingToDoFlag: boolean;
  fMercAsleep: boolean;
  fDontChargeAPsForStanceChange: boolean;

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

  fSoldierWasMoving: boolean;
  fSayAmmoQuotePending: boolean;
  usValueGoneUp: UINT16;

  ubNumLocateCycles: UINT8;
  ubDelayedMovementFlags: UINT8;
  fMuzzleFlash: boolean;
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
  fDontUnsetLastTargetFromTurn: boolean;
  bOverrideMoveSpeed: INT8;
  fUseMoverrideMoveSpeed: boolean;

  uiTimeSoldierWillArrive: UINT32;
  fDieSoundUsed: boolean;
  fUseLandingZoneForArrival: boolean;
  fFallClockwise: boolean;
  bVehicleUnderRepairID: INT8;
  iTimeCanSignElsewhere: INT32;
  bHospitalPriceModifier: INT8;
  bFillerBytes: INT8[] /* [3] */;
  uiStartTimeOfInsuranceContract: UINT32;
  fRTInNonintAnim: boolean;
  fDoingExternalDeath: boolean;
  bCorpseQuoteTolerance: INT8;
  bYetAnotherPaddingSpace: INT8;
  iPositionSndID: INT32;
  iTuringSoundID: INT32;
  ubLastDamageReason: UINT8;
  fComplainedThatTired: boolean;
  sLastTwoLocations: INT16[] /* [2] */;
  bFillerDude: INT16;
  uiTimeSinceLastBleedGrunt: INT32;
  ubNextToPreviousAttackerID: UINT8;

  bFiller: UINT8[] /* [39] */;
}

export const HEALTH_INCREASE = 0x0001;
export const STRENGTH_INCREASE = 0x0002;
export const DEX_INCREASE = 0x0004;
export const AGIL_INCREASE = 0x0008;
export const WIS_INCREASE = 0x0010;
export const LDR_INCREASE = 0x0020;

export const MRK_INCREASE = 0x0040;
export const MED_INCREASE = 0x0080;
export const EXP_INCREASE = 0x0100;
export const MECH_INCREASE = 0x0200;

export const LVL_INCREASE = 0x0400;

export const enum Enum265 {
  WM_NORMAL = 0,
  WM_BURST,
  WM_ATTACHED,
  NUM_WEAPON_MODES,
}

// TYPEDEFS FOR ANIMATION PROFILES
export interface ANIM_PROF_TILE {
  usTileFlags: UINT16;
  bTileX: INT8;
  bTileY: INT8;
}

export interface ANIM_PROF_DIR {
  ubNumTiles: UINT8;
  pTiles: Pointer<ANIM_PROF_TILE>;
}

export interface ANIM_PROF {
  Dirs: ANIM_PROF_DIR[] /* [8] */;
}

// Globals
//////////

// Functions
////////////

export const PTR_CIVILIAN = () => (pSoldier.value.bTeam == CIV_TEAM);
export const PTR_CROUCHED = () => (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_CROUCH);
export const PTR_STANDING = () => (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND);
const PTR_PRONE = () => (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_PRONE);

}
