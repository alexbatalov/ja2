namespace ja2 {

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
export const HAS_SKILL_TRAIT = (s: SOLDIERTYPE, t: number) => (s.ubSkillTrait1 == t || s.ubSkillTrait2 == t);
export const NUM_SKILL_TRAITS = (s: SOLDIERTYPE, t: number) => ((s.ubSkillTrait1 == t) ? ((s.ubSkillTrait2 == t) ? 2 : 1) : ((s.ubSkillTrait2 == t) ? 1 : 0));

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

const BANDAGED = (s: SOLDIERTYPE) => (s.bLifeMax - s.bLife - s.bBleeding);

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

export const SOLDIER_CLASS_ENEMY = (bSoldierClass: number) => ((bSoldierClass >= Enum262.SOLDIER_CLASS_ADMINISTRATOR) && (bSoldierClass <= Enum262.SOLDIER_CLASS_ARMY));
export const SOLDIER_CLASS_MILITIA = (bSoldierClass: number) => ((bSoldierClass >= Enum262.SOLDIER_CLASS_GREEN_MILITIA) && (bSoldierClass <= Enum262.SOLDIER_CLASS_ELITE_MILITIA));

// This macro should be used whenever we want to see if someone is neutral
// IF WE ARE CONSIDERING ATTACKING THEM.  Creatures & bloodcats will attack neutrals
// but they can't attack empty vehicles!!
export const CONSIDERED_NEUTRAL = (me: SOLDIERTYPE, them: SOLDIERTYPE) => ((them.bNeutral) && (me.bTeam != CREATURE_TEAM || (them.uiStatusFlags & SOLDIER_VEHICLE)));

export interface KEY_ON_RING {
  ubKeyID: UINT8;
  ubNumber: UINT8;
}

export interface THROW_PARAMS {
  dX: FLOAT;
  dY: FLOAT;
  dZ: FLOAT;
  dForceX: FLOAT;
  dForceY: FLOAT;
  dForceZ: FLOAT;
  dLifeSpan: FLOAT;
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
  bInSector: boolean /* UINT8 */;
  bFlashPortraitFrame: INT8;
  sFractLife: INT16; // fraction of life pts (in hundreths)
  bBleeding: INT8; // blood loss control variable
  bBreath: INT8; // current breath value
  bBreathMax: INT8; // max breath, affected by fatigue/sleep
  bStealthMode: boolean /* INT8 */;

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

  bActive: boolean /* INT8 */;

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
  bBreathCollapsed: boolean /* INT8 */; // collapsed due to being out of APs
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
  fFlashPortrait: UINT8 /* boolean */;
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
  fTurningFromPronePosition: UINT8 /* boolean */;
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
  bPathStored: boolean /* INT8 */; // good for AI to reduct redundancy
  bHasKeys: boolean /* INT8 */; // allows AI controlled dudes to open locked doors

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
  bNeutral: boolean /* INT8 */;
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
  bMoved: boolean /* INT8 */;
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

export function createSoldierType(): SOLDIERTYPE {
  return {
    ubID: 0,
    bReserved1: 0,
    ubBodyType: 0,
    bActionPoints: 0,
    bInitialActionPoints: 0,
    uiStatusFlags: 0,
    inv: createArrayFrom(Enum261.NUM_INV_SLOTS, createObjectType),
    pTempObject: null,
    pKeyRing: null,
    bOldLife: 0,
    bInSector: false,
    bFlashPortraitFrame: 0,
    sFractLife: 0,
    bBleeding: 0,
    bBreath: 0,
    bBreathMax: 0,
    bStealthMode: false,
    sBreathRed: 0,
    fDelayedMovement: false,
    fReloading: false,
    ubWaitActionToDo: 0,
    fPauseAim: false,
    ubInsertionDirection: 0,
    bGunType: 0,
    ubOppNum: 0,
    bLastRenderVisibleValue: 0,
    fInMissionExitNode: false,
    ubAttackingHand: 0,
    bScientific: 0,
    sWeightCarriedAtTurnStart: 0,
    name: "",
    bVisible: 0,
    bActive: false,
    bTeam: 0,
    ubGroupID: 0,
    fBetweenSectors: false,
    ubMovementNoiseHeard: 0,
    dXPos: 0,
    dYPos: 0,
    dOldXPos: 0,
    dOldYPos: 0,
    sInitialGridNo: 0,
    sGridNo: 0,
    bDirection: 0,
    sHeightAdjustment: 0,
    sDesiredHeight: 0,
    sTempNewGridNo: 0,
    sRoomNo: 0,
    bOverTerrainType: 0,
    bOldOverTerrainType: 0,
    bCollapsed: 0,
    bBreathCollapsed: false,
    ubDesiredHeight: 0,
    usPendingAnimation: 0,
    ubPendingStanceChange: 0,
    usAnimState: 0,
    fNoAPToFinishMove: false,
    fPausedMove: false,
    fUIdeadMerc: false,
    fUInewMerc: false,
    fUICloseMerc: false,
    fUIFirstTimeNOAP: false,
    fUIFirstTimeUNCON: false,
    UpdateCounter: 0,
    DamageCounter: 0,
    ReloadCounter: 0,
    FlashSelCounter: 0,
    AICounter: 0,
    FadeCounter: 0,
    ubSkillTrait1: 0,
    ubSkillTrait2: 0,
    uiAIDelay: 0,
    bDexterity: 0,
    bWisdom: 0,
    sReloadDelay: 0,
    ubAttackerID: 0,
    ubPreviousAttackerID: 0,
    fTurnInProgress: false,
    fIntendedTarget: false,
    fPauseAllAnimation: false,
    bExpLevel: 0,
    sInsertionGridNo: 0,
    fContinueMoveAfterStanceChange: false,
    AnimCache: createAnimationSurfaceCacheType(),
    bLife: 0,
    bSide: 0,
    bViewRange: 0,
    bNewOppCnt: 0,
    bService: 0,
    usAniCode: 0,
    usAniFrame: 0,
    sAniDelay: 0,
    bAgility: 0,
    ubDelayedMovementCauseMerc: 0,
    sDelayedMovementCauseGridNo: 0,
    sReservedMovementGridNo: 0,
    bStrength: 0,
    fHoldAttackerUntilDone: false,
    sTargetGridNo: 0,
    bTargetLevel: 0,
    bTargetCubeLevel: 0,
    sLastTarget: 0,
    bTilesMoved: 0,
    bLeadership: 0,
    dNextBleed: 0,
    fWarnedAboutBleeding: false,
    fDyingComment: false,
    ubTilesMovedPerRTBreathUpdate: 0,
    usLastMovementAnimPerRTBreathUpdate: 0,
    fTurningToShoot: false,
    fTurningToFall: false,
    fTurningUntilDone: false,
    fGettingHit: false,
    fInNonintAnim: false,
    fFlashLocator: false,
    sLocatorFrame: 0,
    fShowLocator: false,
    fFlashPortrait: 0,
    bMechanical: 0,
    bLifeMax: 0,
    iFaceIndex: 0,
    HeadPal: "",
    PantsPal: "",
    VestPal: "",
    SkinPal: "",
    MiscPal: "",
    usFrontArcFullTileList: createArray(MAX_FULLTILE_DIRECTIONS, 0),
    usFrontArcFullTileGridNos: createArray(MAX_FULLTILE_DIRECTIONS, 0),
    p8BPPPalette: null,
    p16BPPPalette: null,
    pShades: createArray(NUM_SOLDIER_SHADES, null),
    pGlowShades: createArray(20, null),
    pCurrentShade: null,
    bMedical: 0,
    fBeginFade: false,
    ubFadeLevel: 0,
    ubServiceCount: 0,
    ubServicePartner: 0,
    bMarksmanship: 0,
    bExplosive: 0,
    pThrowParams: null,
    fTurningFromPronePosition: 0,
    bReverse: 0,
    pLevelNode: null,
    pExternShadowLevelNode: null,
    pRoofUILevelNode: null,
    bDesiredDirection: 0,
    sDestXPos: 0,
    sDestYPos: 0,
    sDesiredDest: 0,
    sDestination: 0,
    sFinalDestination: 0,
    bLevel: 0,
    bStopped: 0,
    bNeedToLook: 0,
    usPathingData: createArray(MAX_PATH_LIST_SIZE, 0),
    usPathDataSize: 0,
    usPathIndex: 0,
    sBlackList: 0,
    bAimTime: 0,
    bShownAimTime: 0,
    bPathStored: false,
    bHasKeys: false,
    pBackGround: null,
    pZBackground: null,
    usUnblitX: 0,
    usUnblitY: 0,
    usUnblitWidth: 0,
    usUnblitHeight: 0,
    ubStrategicInsertionCode: 0,
    usStrategicInsertionData: 0,
    iLight: 0,
    iMuzFlash: 0,
    bMuzFlashCount: 0,
    sX: 0,
    sY: 0,
    usOldAniState: 0,
    sOldAniCode: 0,
    bBulletsLeft: 0,
    ubSuppressionPoints: 0,
    uiTimeOfLastRandomAction: 0,
    usLastRandomAnim: 0,
    bOppList: createArray(MAX_NUM_SOLDIERS, 0),
    bLastAction: 0,
    bAction: 0,
    usActionData: 0,
    bNextAction: 0,
    usNextActionData: 0,
    bActionInProgress: 0,
    bAlertStatus: 0,
    bOppCnt: 0,
    bNeutral: 0,
    bNewSituation: 0,
    bNextTargetLevel: 0,
    bOrders: 0,
    bAttitude: 0,
    bUnderFire: 0,
    bShock: 0,
    bUnderEscort: 0,
    bBypassToGreen: 0,
    ubLastMercToRadio: 0,
    bDominantDir: 0,
    bPatrolCnt: 0,
    bNextPatrolPnt: 0,
    usPatrolGrid: createArray(MAXPATROLGRIDS, 0),
    sNoiseGridno: 0,
    ubNoiseVolume: 0,
    bLastAttackHit: 0,
    ubXRayedBy: 0,
    dHeightAdjustment: 0,
    bMorale: 0,
    bTeamMoraleMod: 0,
    bTacticalMoraleMod: 0,
    bStrategicMoraleMod: 0,
    bAIMorale: 0,
    ubPendingAction: 0,
    ubPendingActionAnimCount: 0,
    uiPendingActionData1: 0,
    sPendingActionData2: 0,
    bPendingActionData3: 0,
    ubDoorHandleCode: 0,
    uiPendingActionData4: 0,
    bInterruptDuelPts: 0,
    bPassedLastInterrupt: 0,
    bIntStartAPs: 0,
    bMoved: false,
    bHunting: 0,
    ubLastCall: 0,
    ubCaller: 0,
    sCallerGridNo: 0,
    bCallPriority: 0,
    bCallActedUpon: 0,
    bFrenzied: 0,
    bNormalSmell: 0,
    bMonsterSmell: 0,
    bMobility: 0,
    bRTPCombat: 0,
    fAIFlags: 0,
    fDontChargeReadyAPs: false,
    usAnimSurface: 0,
    sZLevel: 0,
    fPrevInWater: false,
    fGoBackToAimAfterHit: false,
    sWalkToAttackGridNo: 0,
    sWalkToAttackWalkToCost: 0,
    fForceRenderColor: false,
    fForceNoRenderPaletteCycle: false,
    sLocatorOffX: 0,
    sLocatorOffY: 0,
    fStopPendingNextTile: false,
    fForceShade: false,
    pForcedShade: null,
    bDisplayDamageCount: 0,
    fDisplayDamage: 0,
    sDamage: 0,
    sDamageX: 0,
    sDamageY: 0,
    bDamageDir: 0,
    bDoBurst: 0,
    usUIMovementMode: 0,
    bUIInterfaceLevel: 0,
    fUIMovementFast: false,
    BlinkSelCounter: 0,
    PortraitFlashCounter: 0,
    fDeadSoundPlayed: false,
    ubProfile: 0,
    ubQuoteRecord: 0,
    ubQuoteActionID: 0,
    ubBattleSoundID: 0,
    fClosePanel: false,
    fClosePanelToDie: false,
    ubClosePanelFrame: 0,
    fDeadPanel: false,
    ubDeadPanelFrame: 0,
    fOpenPanel: false,
    bOpenPanelFrame: 0,
    sPanelFaceX: 0,
    sPanelFaceY: 0,
    bNumHitsThisTurn: 0,
    usQuoteSaidFlags: 0,
    fCloseCall: 0,
    bLastSkillCheck: 0,
    ubSkillCheckAttempts: 0,
    bVocalVolume: 0,
    bStartFallDir: 0,
    fTryingToFall: 0,
    ubPendingDirection: 0,
    uiAnimSubFlags: 0,
    bAimShotLocation: 0,
    ubHitLocation: 0,
    pEffectShades: createArray(NUM_SOLDIER_EFFECTSHADES, null),
    ubPlannedUIAPCost: 0,
    sPlannedTargetX: 0,
    sPlannedTargetY: 0,
    sSpreadLocations: createArray(6, 0),
    fDoSpread: false,
    sStartGridNo: 0,
    sEndGridNo: 0,
    sForcastGridno: 0,
    sZLevelOverride: 0,
    bMovedPriorToInterrupt: 0,
    iEndofContractTime: 0,
    iStartContractTime: 0,
    iTotalContractLength: 0,
    iNextActionSpecialData: 0,
    ubWhatKindOfMercAmI: 0,
    bAssignment: 0,
    bOldAssignment: 0,
    fForcedToStayAwake: false,
    bTrainStat: 0,
    sSectorX: 0,
    sSectorY: 0,
    bSectorZ: 0,
    iVehicleId: 0,
    pMercPath: null,
    fHitByGasFlags: 0,
    usMedicalDeposit: 0,
    usLifeInsurance: 0,
    uiStartMovementTime: 0,
    uiOptimumMovementTime: 0,
    usLastUpdateTime: 0,
    fIsSoldierMoving: false,
    fIsSoldierDelayed: false,
    fSoldierUpdatedFromNetwork: false,
    uiSoldierUpdateNumber: 0,
    ubSoldierUpdateType: 0,
    iStartOfInsuranceContract: 0,
    uiLastAssignmentChangeMin: 0,
    iTotalLengthOfInsuranceContract: 0,
    ubSoldierClass: 0,
    ubAPsLostToSuppression: 0,
    fChangingStanceDueToSuppression: false,
    ubSuppressorID: 0,
    ubDesiredSquadAssignment: 0,
    ubNumTraversalsAllowedToMerge: 0,
    usPendingAnimation2: 0,
    ubCivilianGroup: 0,
    uiChangeLevelTime: 0,
    uiChangeHealthTime: 0,
    uiChangeStrengthTime: 0,
    uiChangeDexterityTime: 0,
    uiChangeAgilityTime: 0,
    uiChangeWisdomTime: 0,
    uiChangeLeadershipTime: 0,
    uiChangeMarksmanshipTime: 0,
    uiChangeExplosivesTime: 0,
    uiChangeMedicalTime: 0,
    uiChangeMechanicalTime: 0,
    uiUniqueSoldierIdValue: 0,
    bBeingAttackedCount: 0,
    bNewItemCount: createArray(Enum261.NUM_INV_SLOTS, 0),
    bNewItemCycleCount: createArray(Enum261.NUM_INV_SLOTS, 0),
    fCheckForNewlyAddedItems: false,
    bEndDoorOpenCode: 0,
    ubScheduleID: 0,
    sEndDoorOpenCodeData: 0,
    NextTileCounter: 0,
    fBlockedByAnotherMerc: false,
    bBlockedByAnotherMercDirection: 0,
    usAttackingWeapon: 0,
    bWeaponMode: 0,
    ubTargetID: 0,
    bAIScheduleProgress: 0,
    sOffWorldGridNo: 0,
    pAniTile: null,
    bCamo: 0,
    sAbsoluteFinalDestination: 0,
    ubHiResDirection: 0,
    ubHiResDesiredDirection: 0,
    ubLastFootPrintSound: 0,
    bVehicleID: 0,
    fPastXDest: 0,
    fPastYDest: 0,
    bMovementDirection: 0,
    sOldGridNo: 0,
    usDontUpdateNewGridNoOnMoveAnimChange: 0,
    sBoundingBoxWidth: 0,
    sBoundingBoxHeight: 0,
    sBoundingBoxOffsetX: 0,
    sBoundingBoxOffsetY: 0,
    uiTimeSameBattleSndDone: 0,
    bOldBattleSnd: 0,
    fReactingFromBeingShot: false,
    fContractPriceHasIncreased: false,
    iBurstSoundID: 0,
    fFixingSAMSite: false,
    fFixingRobot: false,
    bSlotItemTakenFrom: 0,
    fSignedAnotherContract: false,
    ubAutoBandagingMedic: 0,
    fDontChargeTurningAPs: false,
    ubRobotRemoteHolderID: 0,
    uiTimeOfLastContractUpdate: 0,
    bTypeOfLastContract: 0,
    bTurnsCollapsed: 0,
    bSleepDrugCounter: 0,
    ubMilitiaKills: 0,
    bFutureDrugEffect: createArray(2, 0),
    bDrugEffectRate: createArray(2, 0),
    bDrugEffect: createArray(2, 0),
    bDrugSideEffectRate: createArray(2, 0),
    bDrugSideEffect: createArray(2, 0),
    bTimesDrugUsedSinceSleep: createArray(2, 0),
    bBlindedCounter: 0,
    fMercCollapsedFlag: false,
    fDoneAssignmentAndNothingToDoFlag: false,
    fMercAsleep: false,
    fDontChargeAPsForStanceChange: false,
    ubHoursOnAssignment: 0,
    ubMercJustFired: 0,
    ubTurnsUntilCanSayHeardNoise: 0,
    usQuoteSaidExtFlags: 0,
    sContPathLocation: 0,
    bGoodContPath: 0,
    ubPendingActionInterrupted: 0,
    bNoiseLevel: 0,
    bRegenerationCounter: 0,
    bRegenBoostersUsedToday: 0,
    bNumPelletsHitBy: 0,
    sSkillCheckGridNo: 0,
    ubLastEnemyCycledID: 0,
    ubPrevSectorID: 0,
    ubNumTilesMovesSinceLastForget: 0,
    bTurningIncrement: 0,
    uiBattleSoundID: 0,
    fSoldierWasMoving: false,
    fSayAmmoQuotePending: false,
    usValueGoneUp: 0,
    ubNumLocateCycles: 0,
    ubDelayedMovementFlags: 0,
    fMuzzleFlash: false,
    ubCTGTTargetID: 0,
    PanelAnimateCounter: 0,
    uiMercChecksum: 0,
    bCurrentCivQuote: 0,
    bCurrentCivQuoteDelta: 0,
    ubMiscSoldierFlags: 0,
    ubReasonCantFinishMove: 0,
    sLocationOfFadeStart: 0,
    bUseExitGridForReentryDirection: 0,
    uiTimeSinceLastSpoke: 0,
    ubContractRenewalQuoteCode: 0,
    sPreTraversalGridNo: 0,
    uiXRayActivatedTime: 0,
    bTurningFromUI: 0,
    bPendingActionData5: 0,
    bDelayedStrategicMoraleMod: 0,
    ubDoorOpeningNoise: 0,
    pGroup: null,
    ubLeaveHistoryCode: 0,
    fDontUnsetLastTargetFromTurn: false,
    bOverrideMoveSpeed: 0,
    fUseMoverrideMoveSpeed: false,
    uiTimeSoldierWillArrive: 0,
    fDieSoundUsed: false,
    fUseLandingZoneForArrival: false,
    fFallClockwise: false,
    bVehicleUnderRepairID: 0,
    iTimeCanSignElsewhere: 0,
    bHospitalPriceModifier: 0,
    bFillerBytes: createArray(3, 0),
    uiStartTimeOfInsuranceContract: 0,
    fRTInNonintAnim: false,
    fDoingExternalDeath: false,
    bCorpseQuoteTolerance: 0,
    bYetAnotherPaddingSpace: 0,
    iPositionSndID: 0,
    iTuringSoundID: 0,
    ubLastDamageReason: 0,
    fComplainedThatTired: false,
    sLastTwoLocations: createArray(2, 0),
    bFillerDude: 0,
    uiTimeSinceLastBleedGrunt: 0,
    ubNextToPreviousAttackerID: 0,
    bFiller: createArray(39, 0),
  };
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

// VARIABLES FOR PALETTE REPLACEMENTS FOR HAIR, ETC
export let gubpNumReplacementsPerRange: Pointer<UINT8>;
export let gpPalRep: PaletteReplacementType[] /* Pointer<PaletteReplacementType> */;

}
