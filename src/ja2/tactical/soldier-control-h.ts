namespace ja2 {

// TEMP VALUES FOR NAMES
const MAXCIVLASTNAMES = 30;

// ANDREW: these are defines for OKDestanation usage - please move to approprite file
export const IGNOREPEOPLE = false;
export const PEOPLETOO = true;
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
  fSpeed: UINT8 /* boolean */;
  pNext: PathSt | null;
  pPrev: PathSt | null;
}

export function createPathSt(): PathSt {
  return {
    uiSectorId: 0,
    uiEta: 0,
    fSpeed: 0,
    pNext: null,
    pPrev: null,
  };
}

export const PATH_ST_SIZE = 20;

export function readPathSt(o: PathSt, buffer: Buffer, offset: number = 0): number {
  o.uiSectorId = buffer.readUInt32LE(offset); offset += 4;
  o.uiEta = buffer.readUInt32LE(offset); offset += 4;
  o.fSpeed = buffer.readUInt8(offset++);
  offset += 3; // padding
  offset += 4; // pNext (pointer)
  offset += 4; // pPrev (pointer)
  return offset;
}

export function writePathSt(o: PathSt, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiSectorId, offset);
  offset = buffer.writeUInt32LE(o.uiEta, offset);
  offset = buffer.writeUInt8(o.fSpeed, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = writePadding(buffer, offset, 4); // pNext (pointer)
  offset = writePadding(buffer, offset, 4); // pPrev (pointer)
  return offset;
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

export function createKeyOnRing(): KEY_ON_RING {
  return {
    ubKeyID: 0,
    ubNumber: 0,
  };
}

export const KEY_ON_RING_SIZE = 2;

export function readKeyOnRing(o: KEY_ON_RING, buffer: Buffer, offset: number = 0): number {
  o.ubKeyID = buffer.readUInt8(offset++);
  o.ubNumber = buffer.readUInt8(offset++);
  return offset;
}

export function writeKeyOnRing(o: KEY_ON_RING, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubKeyID, offset);
  offset = buffer.writeUInt8(o.ubNumber, offset);
  return offset;
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

export function createThrowParams(): THROW_PARAMS {
  return {
    dX: 0,
    dY: 0,
    dZ: 0,
    dForceX: 0,
    dForceY: 0,
    dForceZ: 0,
    dLifeSpan: 0,
    ubActionCode: 0,
    uiActionData: 0,
  };
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
  pTempObject: OBJECTTYPE | null /* Pointer<OBJECTTYPE> */;
  pKeyRing: KEY_ON_RING[] /* Pointer<KEY_ON_RING> */;

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
  fDelayedMovement: UINT8 /* boolean */;

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

  bCollapsed: boolean /* INT8 */; // collapsed due to being out of APs
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

  fContinueMoveAfterStanceChange: UINT8 /* boolean */;

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
  fGettingHit: UINT8 /* boolean */;
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

  p8BPPPalette: SGPPaletteEntry[] /* Pointer<SGPPaletteEntry> */; // 4
  p16BPPPalette: UINT16[] /* Pointer<UINT16> */;
  pShades: UINT16[][] /* Pointer<UINT16>[NUM_SOLDIER_SHADES] */; // Shading tables
  pGlowShades: UINT16[][] /* Pointer<UINT16>[20] */; //
  pCurrentShade: UINT16[] /* Pointer<UINT16> */;
  bMedical: INT8;
  fBeginFade: UINT8 /* boolean */;
  ubFadeLevel: UINT8;
  ubServiceCount: UINT8;
  ubServicePartner: UINT8;
  bMarksmanship: INT8;
  bExplosive: INT8;
  pThrowParams: THROW_PARAMS | null;
  fTurningFromPronePosition: UINT8 /* boolean */;
  bReverse: boolean /* INT8 */;
  pLevelNode: LEVELNODE | null /* Pointer<LEVELNODE> */;
  pExternShadowLevelNode: LEVELNODE | null /* Pointer<LEVELNODE> */;
  pRoofUILevelNode: LEVELNODE | null /* Pointer<LEVELNODE> */;

  // WALKING STUFF
  bDesiredDirection: INT8;
  sDestXPos: INT16;
  sDestYPos: INT16;
  sDesiredDest: INT16;
  sDestination: INT16;
  sFinalDestination: INT16;
  bLevel: INT8;
  bStopped: INT8;
  bNeedToLook: boolean /* INT8 */;

  // PATH STUFF
  usPathingData: UINT16[] /* [MAX_PATH_LIST_SIZE] */;
  usPathDataSize: UINT16;
  usPathIndex: UINT16;
  sBlackList: INT16;
  bAimTime: INT8;
  bShownAimTime: INT8;
  bPathStored: boolean /* INT8 */; // good for AI to reduct redundancy
  bHasKeys: INT8; // allows AI controlled dudes to open locked doors

  // UNBLIT BACKGROUND
  pBackGround: UINT16[] | null /* Pointer<UINT16> */;
  pZBackground: UINT16[] | null /* Pointer<UINT16> */;

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
  bActionInProgress: boolean /* INT8 */;
  bAlertStatus: INT8;
  bOppCnt: INT8;
  bNeutral: boolean /* INT8 */;
  bNewSituation: INT8;
  bNextTargetLevel: INT8;
  bOrders: INT8;
  bAttitude: INT8;
  bUnderFire: INT8;
  bShock: INT8;
  bUnderEscort: boolean /* INT8 */;
  bBypassToGreen: INT8;
  ubLastMercToRadio: UINT8;
  bDominantDir: INT8; // AI main direction to face...
  bPatrolCnt: INT8; // number of patrol gridnos
  bNextPatrolPnt: INT8; // index to next patrol gridno
  usPatrolGrid: INT16[] /* [MAXPATROLGRIDS] */; // AI list for ptr->orders==PATROL
  sNoiseGridno: INT16;
  ubNoiseVolume: UINT8;
  bLastAttackHit: boolean /* INT8 */;
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
  bPassedLastInterrupt: boolean /* INT8 */;
  bIntStartAPs: INT8;
  bMoved: boolean /* INT8 */;
  bHunting: boolean /* INT8 */;
  ubLastCall: UINT8;
  ubCaller: UINT8;
  sCallerGridNo: INT16;
  bCallPriority: UINT8;
  bCallActedUpon: boolean /* INT8 */;
  bFrenzied: boolean /* INT8 */;
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
  pForcedShade: UINT16[] /* Pointer<UINT16> */;

  bDisplayDamageCount: INT8;
  fDisplayDamage: boolean /* INT8 */;
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
  fCloseCall: boolean /* INT8 */;
  bLastSkillCheck: INT8;
  ubSkillCheckAttempts: INT8;

  bVocalVolume: INT8; // verbal sounds need to differ in volume

  bStartFallDir: INT8;
  fTryingToFall: boolean /* INT8 */;

  ubPendingDirection: UINT8;
  uiAnimSubFlags: UINT32;

  bAimShotLocation: UINT8;
  ubHitLocation: UINT8;

  pEffectShades: UINT16[][] /* Pointer<UINT16>[NUM_SOLDIER_EFFECTSHADES] */; // Shading tables for effects

  ubPlannedUIAPCost: UINT8;
  sPlannedTargetX: INT16;
  sPlannedTargetY: INT16;

  sSpreadLocations: INT16[] /* [6] */;
  fDoSpread: UINT8 /* boolean */;
  sStartGridNo: INT16;
  sEndGridNo: INT16;
  sForcastGridno: INT16;
  sZLevelOverride: INT16;
  bMovedPriorToInterrupt: boolean /* INT8 */;
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
  pMercPath: PathSt /* PathStPtr */; // Path Structure
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
  pAniTile: ANITILE /* Pointer<ANITILE> */;
  bCamo: INT8;
  sAbsoluteFinalDestination: INT16;
  ubHiResDirection: UINT8;
  ubHiResDesiredDirection: UINT8;
  ubLastFootPrintSound: UINT8;
  bVehicleID: INT8;
  fPastXDest: boolean /* INT8 */;
  fPastYDest: boolean /* INT8 */;
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
  bGoodContPath: boolean /* INT8 */;
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
  bUseExitGridForReentryDirection: boolean /* UINT8 */;

  uiTimeSinceLastSpoke: UINT32;
  ubContractRenewalQuoteCode: UINT8;
  sPreTraversalGridNo: INT16;
  uiXRayActivatedTime: UINT32;
  bTurningFromUI: boolean /* INT8 */;
  bPendingActionData5: INT8;

  bDelayedStrategicMoraleMod: INT8;
  ubDoorOpeningNoise: UINT8;

  pGroup: GROUP /* Pointer<GROUP> */;
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
    pKeyRing: <KEY_ON_RING[]><unknown>null,
    bOldLife: 0,
    bInSector: false,
    bFlashPortraitFrame: 0,
    sFractLife: 0,
    bBleeding: 0,
    bBreath: 0,
    bBreathMax: 0,
    bStealthMode: false,
    sBreathRed: 0,
    fDelayedMovement: 0,
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
    bCollapsed: false,
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
    fContinueMoveAfterStanceChange: 0,
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
    fGettingHit: 0,
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
    p8BPPPalette: <SGPPaletteEntry[]><unknown>null,
    p16BPPPalette: <UINT16[]><unknown>null,
    pShades: createArray(NUM_SOLDIER_SHADES, <UINT16[]><unknown>null),
    pGlowShades: createArray(20, <UINT16[]><unknown>null),
    pCurrentShade: <UINT16[]><unknown>null,
    bMedical: 0,
    fBeginFade: 0,
    ubFadeLevel: 0,
    ubServiceCount: 0,
    ubServicePartner: 0,
    bMarksmanship: 0,
    bExplosive: 0,
    pThrowParams: null,
    fTurningFromPronePosition: 0,
    bReverse: false,
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
    bNeedToLook: false,
    usPathingData: createArray(MAX_PATH_LIST_SIZE, 0),
    usPathDataSize: 0,
    usPathIndex: 0,
    sBlackList: 0,
    bAimTime: 0,
    bShownAimTime: 0,
    bPathStored: false,
    bHasKeys: 0,
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
    bActionInProgress: false,
    bAlertStatus: 0,
    bOppCnt: 0,
    bNeutral: false,
    bNewSituation: 0,
    bNextTargetLevel: 0,
    bOrders: 0,
    bAttitude: 0,
    bUnderFire: 0,
    bShock: 0,
    bUnderEscort: false,
    bBypassToGreen: 0,
    ubLastMercToRadio: 0,
    bDominantDir: 0,
    bPatrolCnt: 0,
    bNextPatrolPnt: 0,
    usPatrolGrid: createArray(MAXPATROLGRIDS, 0),
    sNoiseGridno: 0,
    ubNoiseVolume: 0,
    bLastAttackHit: false,
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
    bPassedLastInterrupt: false,
    bIntStartAPs: 0,
    bMoved: false,
    bHunting: false,
    ubLastCall: 0,
    ubCaller: 0,
    sCallerGridNo: 0,
    bCallPriority: 0,
    bCallActedUpon: false,
    bFrenzied: false,
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
    pForcedShade: <UINT16[]><unknown>null,
    bDisplayDamageCount: 0,
    fDisplayDamage: false,
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
    fCloseCall: false,
    bLastSkillCheck: 0,
    ubSkillCheckAttempts: 0,
    bVocalVolume: 0,
    bStartFallDir: 0,
    fTryingToFall: false,
    ubPendingDirection: 0,
    uiAnimSubFlags: 0,
    bAimShotLocation: 0,
    ubHitLocation: 0,
    pEffectShades: createArray(NUM_SOLDIER_EFFECTSHADES, <UINT16[]><unknown>null),
    ubPlannedUIAPCost: 0,
    sPlannedTargetX: 0,
    sPlannedTargetY: 0,
    sSpreadLocations: createArray(6, 0),
    fDoSpread: 0,
    sStartGridNo: 0,
    sEndGridNo: 0,
    sForcastGridno: 0,
    sZLevelOverride: 0,
    bMovedPriorToInterrupt: false,
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
    pMercPath: <PathSt><unknown>null,
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
    pAniTile: <ANITILE><unknown>null,
    bCamo: 0,
    sAbsoluteFinalDestination: 0,
    ubHiResDirection: 0,
    ubHiResDesiredDirection: 0,
    ubLastFootPrintSound: 0,
    bVehicleID: 0,
    fPastXDest: false,
    fPastYDest: false,
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
    bGoodContPath: false,
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
    bUseExitGridForReentryDirection: false,
    uiTimeSinceLastSpoke: 0,
    ubContractRenewalQuoteCode: 0,
    sPreTraversalGridNo: 0,
    uiXRayActivatedTime: 0,
    bTurningFromUI: false,
    bPendingActionData5: 0,
    bDelayedStrategicMoraleMod: 0,
    ubDoorOpeningNoise: 0,
    pGroup: <GROUP><unknown>null,
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

export function resetSoldierType(o: SOLDIERTYPE) {
  o.ubID = 0;
  o.bReserved1 = 0;
  o.ubBodyType = 0;
  o.bActionPoints = 0;
  o.bInitialActionPoints = 0;
  o.uiStatusFlags = 0;
  o.inv.forEach(resetObjectType);
  o.pTempObject = null;
  o.pKeyRing = <KEY_ON_RING[]><unknown>null;
  o.bOldLife = 0;
  o.bInSector = false;
  o.bFlashPortraitFrame = 0;
  o.sFractLife = 0;
  o.bBleeding = 0;
  o.bBreath = 0;
  o.bBreathMax = 0;
  o.bStealthMode = false;
  o.sBreathRed = 0;
  o.fDelayedMovement = 0;
  o.fReloading = false;
  o.ubWaitActionToDo = 0;
  o.fPauseAim = false;
  o.ubInsertionDirection = 0;
  o.bGunType = 0;
  o.ubOppNum = 0;
  o.bLastRenderVisibleValue = 0;
  o.fInMissionExitNode = false;
  o.ubAttackingHand = 0;
  o.bScientific = 0;
  o.sWeightCarriedAtTurnStart = 0;
  o.name = "";
  o.bVisible = 0;
  o.bActive = false;
  o.bTeam = 0;
  o.ubGroupID = 0;
  o.fBetweenSectors = false;
  o.ubMovementNoiseHeard = 0;
  o.dXPos = 0;
  o.dYPos = 0;
  o.dOldXPos = 0;
  o.dOldYPos = 0;
  o.sInitialGridNo = 0;
  o.sGridNo = 0;
  o.bDirection = 0;
  o.sHeightAdjustment = 0;
  o.sDesiredHeight = 0;
  o.sTempNewGridNo = 0;
  o.sRoomNo = 0;
  o.bOverTerrainType = 0;
  o.bOldOverTerrainType = 0;
  o.bCollapsed = false;
  o.bBreathCollapsed = false;
  o.ubDesiredHeight = 0;
  o.usPendingAnimation = 0;
  o.ubPendingStanceChange = 0;
  o.usAnimState = 0;
  o.fNoAPToFinishMove = false;
  o.fPausedMove = false;
  o.fUIdeadMerc = false;
  o.fUInewMerc = false;
  o.fUICloseMerc = false;
  o.fUIFirstTimeNOAP = false;
  o.fUIFirstTimeUNCON = false;
  o.UpdateCounter = 0;
  o.DamageCounter = 0;
  o.ReloadCounter = 0;
  o.FlashSelCounter = 0;
  o.AICounter = 0;
  o.FadeCounter = 0;
  o.ubSkillTrait1 = 0;
  o.ubSkillTrait2 = 0;
  o.uiAIDelay = 0;
  o.bDexterity = 0;
  o.bWisdom = 0;
  o.sReloadDelay = 0;
  o.ubAttackerID = 0;
  o.ubPreviousAttackerID = 0;
  o.fTurnInProgress = false;
  o.fIntendedTarget = false;
  o.fPauseAllAnimation = false;
  o.bExpLevel = 0;
  o.sInsertionGridNo = 0;
  o.fContinueMoveAfterStanceChange = 0;
  resetAnimationSurfaceCacheType(o.AnimCache);
  o.bLife = 0;
  o.bSide = 0;
  o.bViewRange = 0;
  o.bNewOppCnt = 0;
  o.bService = 0;
  o.usAniCode = 0;
  o.usAniFrame = 0;
  o.sAniDelay = 0;
  o.bAgility = 0;
  o.ubDelayedMovementCauseMerc = 0;
  o.sDelayedMovementCauseGridNo = 0;
  o.sReservedMovementGridNo = 0;
  o.bStrength = 0;
  o.fHoldAttackerUntilDone = false;
  o.sTargetGridNo = 0;
  o.bTargetLevel = 0;
  o.bTargetCubeLevel = 0;
  o.sLastTarget = 0;
  o.bTilesMoved = 0;
  o.bLeadership = 0;
  o.dNextBleed = 0;
  o.fWarnedAboutBleeding = false;
  o.fDyingComment = false;
  o.ubTilesMovedPerRTBreathUpdate = 0;
  o.usLastMovementAnimPerRTBreathUpdate = 0;
  o.fTurningToShoot = false;
  o.fTurningToFall = false;
  o.fTurningUntilDone = false;
  o.fGettingHit = 0;
  o.fInNonintAnim = false;
  o.fFlashLocator = false;
  o.sLocatorFrame = 0;
  o.fShowLocator = false;
  o.fFlashPortrait = 0;
  o.bMechanical = 0;
  o.bLifeMax = 0;
  o.iFaceIndex = 0;
  o.HeadPal = "";
  o.PantsPal = "";
  o.VestPal = "";
  o.SkinPal = "";
  o.MiscPal = "";
  o.usFrontArcFullTileList.fill(0);
  o.usFrontArcFullTileGridNos.fill(0);
  o.p8BPPPalette = <SGPPaletteEntry[]><unknown>null;
  o.p16BPPPalette = <UINT16[]><unknown>null;
  o.pShades.fill(<UINT16[]><unknown>null);
  o.pGlowShades.fill(<UINT16[]><unknown>null);
  o.pCurrentShade = <UINT16[]><unknown>null;
  o.bMedical = 0;
  o.fBeginFade = 0;
  o.ubFadeLevel = 0;
  o.ubServiceCount = 0;
  o.ubServicePartner = 0;
  o.bMarksmanship = 0;
  o.bExplosive = 0;
  o.pThrowParams = null;
  o.fTurningFromPronePosition = 0;
  o.bReverse = false;
  o.pLevelNode = null;
  o.pExternShadowLevelNode = null;
  o.pRoofUILevelNode = null;
  o.bDesiredDirection = 0;
  o.sDestXPos = 0;
  o.sDestYPos = 0;
  o.sDesiredDest = 0;
  o.sDestination = 0;
  o.sFinalDestination = 0;
  o.bLevel = 0;
  o.bStopped = 0;
  o.bNeedToLook = false;
  o.usPathingData.fill(0);
  o.usPathDataSize = 0;
  o.usPathIndex = 0;
  o.sBlackList = 0;
  o.bAimTime = 0;
  o.bShownAimTime = 0;
  o.bPathStored = false;
  o.bHasKeys = 0;
  o.pBackGround = null;
  o.pZBackground = null;
  o.usUnblitX = 0;
  o.usUnblitY = 0;
  o.usUnblitWidth = 0;
  o.usUnblitHeight = 0;
  o.ubStrategicInsertionCode = 0;
  o.usStrategicInsertionData = 0;
  o.iLight = 0;
  o.iMuzFlash = 0;
  o.bMuzFlashCount = 0;
  o.sX = 0;
  o.sY = 0;
  o.usOldAniState = 0;
  o.sOldAniCode = 0;
  o.bBulletsLeft = 0;
  o.ubSuppressionPoints = 0;
  o.uiTimeOfLastRandomAction = 0;
  o.usLastRandomAnim = 0;
  o.bOppList.fill(0);
  o.bLastAction = 0;
  o.bAction = 0;
  o.usActionData = 0;
  o.bNextAction = 0;
  o.usNextActionData = 0;
  o.bActionInProgress = false;
  o.bAlertStatus = 0;
  o.bOppCnt = 0;
  o.bNeutral = false;
  o.bNewSituation = 0;
  o.bNextTargetLevel = 0;
  o.bOrders = 0;
  o.bAttitude = 0;
  o.bUnderFire = 0;
  o.bShock = 0;
  o.bUnderEscort = false;
  o.bBypassToGreen = 0;
  o.ubLastMercToRadio = 0;
  o.bDominantDir = 0;
  o.bPatrolCnt = 0;
  o.bNextPatrolPnt = 0;
  o.usPatrolGrid.fill(0);
  o.sNoiseGridno = 0;
  o.ubNoiseVolume = 0;
  o.bLastAttackHit = false;
  o.ubXRayedBy = 0;
  o.dHeightAdjustment = 0;
  o.bMorale = 0;
  o.bTeamMoraleMod = 0;
  o.bTacticalMoraleMod = 0;
  o.bStrategicMoraleMod = 0;
  o.bAIMorale = 0;
  o.ubPendingAction = 0;
  o.ubPendingActionAnimCount = 0;
  o.uiPendingActionData1 = 0;
  o.sPendingActionData2 = 0;
  o.bPendingActionData3 = 0;
  o.ubDoorHandleCode = 0;
  o.uiPendingActionData4 = 0;
  o.bInterruptDuelPts = 0;
  o.bPassedLastInterrupt = false;
  o.bIntStartAPs = 0;
  o.bMoved = false;
  o.bHunting = false;
  o.ubLastCall = 0;
  o.ubCaller = 0;
  o.sCallerGridNo = 0;
  o.bCallPriority = 0;
  o.bCallActedUpon = false;
  o.bFrenzied = false;
  o.bNormalSmell = 0;
  o.bMonsterSmell = 0;
  o.bMobility = 0;
  o.bRTPCombat = 0;
  o.fAIFlags = 0;
  o.fDontChargeReadyAPs = false;
  o.usAnimSurface = 0;
  o.sZLevel = 0;
  o.fPrevInWater = false;
  o.fGoBackToAimAfterHit = false;
  o.sWalkToAttackGridNo = 0;
  o.sWalkToAttackWalkToCost = 0;
  o.fForceRenderColor = false;
  o.fForceNoRenderPaletteCycle = false;
  o.sLocatorOffX = 0;
  o.sLocatorOffY = 0;
  o.fStopPendingNextTile = false;
  o.fForceShade = false;
  o.pForcedShade = <UINT16[]><unknown>null;
  o.bDisplayDamageCount = 0;
  o.fDisplayDamage = false;
  o.sDamage = 0;
  o.sDamageX = 0;
  o.sDamageY = 0;
  o.bDamageDir = 0;
  o.bDoBurst = 0;
  o.usUIMovementMode = 0;
  o.bUIInterfaceLevel = 0;
  o.fUIMovementFast = false;
  o.BlinkSelCounter = 0;
  o.PortraitFlashCounter = 0;
  o.fDeadSoundPlayed = false;
  o.ubProfile = 0;
  o.ubQuoteRecord = 0;
  o.ubQuoteActionID = 0;
  o.ubBattleSoundID = 0;
  o.fClosePanel = false;
  o.fClosePanelToDie = false;
  o.ubClosePanelFrame = 0;
  o.fDeadPanel = false;
  o.ubDeadPanelFrame = 0;
  o.fOpenPanel = false;
  o.bOpenPanelFrame = 0;
  o.sPanelFaceX = 0;
  o.sPanelFaceY = 0;
  o.bNumHitsThisTurn = 0;
  o.usQuoteSaidFlags = 0;
  o.fCloseCall = false;
  o.bLastSkillCheck = 0;
  o.ubSkillCheckAttempts = 0;
  o.bVocalVolume = 0;
  o.bStartFallDir = 0;
  o.fTryingToFall = false;
  o.ubPendingDirection = 0;
  o.uiAnimSubFlags = 0;
  o.bAimShotLocation = 0;
  o.ubHitLocation = 0;
  o.pEffectShades.fill(<UINT16[]><unknown>null);
  o.ubPlannedUIAPCost = 0;
  o.sPlannedTargetX = 0;
  o.sPlannedTargetY = 0;
  o.sSpreadLocations.fill(0);
  o.fDoSpread = 0;
  o.sStartGridNo = 0;
  o.sEndGridNo = 0;
  o.sForcastGridno = 0;
  o.sZLevelOverride = 0;
  o.bMovedPriorToInterrupt = false;
  o.iEndofContractTime = 0;
  o.iStartContractTime = 0;
  o.iTotalContractLength = 0;
  o.iNextActionSpecialData = 0;
  o.ubWhatKindOfMercAmI = 0;
  o.bAssignment = 0;
  o.bOldAssignment = 0;
  o.fForcedToStayAwake = false;
  o.bTrainStat = 0;
  o.sSectorX = 0;
  o.sSectorY = 0;
  o.bSectorZ = 0;
  o.iVehicleId = 0;
  o.pMercPath = <PathSt><unknown>null;
  o.fHitByGasFlags = 0;
  o.usMedicalDeposit = 0;
  o.usLifeInsurance = 0;
  o.uiStartMovementTime = 0;
  o.uiOptimumMovementTime = 0;
  o.usLastUpdateTime = 0;
  o.fIsSoldierMoving = false;
  o.fIsSoldierDelayed = false;
  o.fSoldierUpdatedFromNetwork = false;
  o.uiSoldierUpdateNumber = 0;
  o.ubSoldierUpdateType = 0;
  o.iStartOfInsuranceContract = 0;
  o.uiLastAssignmentChangeMin = 0;
  o.iTotalLengthOfInsuranceContract = 0;
  o.ubSoldierClass = 0;
  o.ubAPsLostToSuppression = 0;
  o.fChangingStanceDueToSuppression = false;
  o.ubSuppressorID = 0;
  o.ubDesiredSquadAssignment = 0;
  o.ubNumTraversalsAllowedToMerge = 0;
  o.usPendingAnimation2 = 0;
  o.ubCivilianGroup = 0;
  o.uiChangeLevelTime = 0;
  o.uiChangeHealthTime = 0;
  o.uiChangeStrengthTime = 0;
  o.uiChangeDexterityTime = 0;
  o.uiChangeAgilityTime = 0;
  o.uiChangeWisdomTime = 0;
  o.uiChangeLeadershipTime = 0;
  o.uiChangeMarksmanshipTime = 0;
  o.uiChangeExplosivesTime = 0;
  o.uiChangeMedicalTime = 0;
  o.uiChangeMechanicalTime = 0;
  o.uiUniqueSoldierIdValue = 0;
  o.bBeingAttackedCount = 0;
  o.bNewItemCount.fill(0);
  o.bNewItemCycleCount.fill(0);
  o.fCheckForNewlyAddedItems = false;
  o.bEndDoorOpenCode = 0;
  o.ubScheduleID = 0;
  o.sEndDoorOpenCodeData = 0;
  o.NextTileCounter = 0;
  o.fBlockedByAnotherMerc = false;
  o.bBlockedByAnotherMercDirection = 0;
  o.usAttackingWeapon = 0;
  o.bWeaponMode = 0;
  o.ubTargetID = 0;
  o.bAIScheduleProgress = 0;
  o.sOffWorldGridNo = 0;
  o.pAniTile = <ANITILE><unknown>null;
  o.bCamo = 0;
  o.sAbsoluteFinalDestination = 0;
  o.ubHiResDirection = 0;
  o.ubHiResDesiredDirection = 0;
  o.ubLastFootPrintSound = 0;
  o.bVehicleID = 0;
  o.fPastXDest = false;
  o.fPastYDest = false;
  o.bMovementDirection = 0;
  o.sOldGridNo = 0;
  o.usDontUpdateNewGridNoOnMoveAnimChange = 0;
  o.sBoundingBoxWidth = 0;
  o.sBoundingBoxHeight = 0;
  o.sBoundingBoxOffsetX = 0;
  o.sBoundingBoxOffsetY = 0;
  o.uiTimeSameBattleSndDone = 0;
  o.bOldBattleSnd = 0;
  o.fReactingFromBeingShot = false;
  o.fContractPriceHasIncreased = false;
  o.iBurstSoundID = 0;
  o.fFixingSAMSite = false;
  o.fFixingRobot = false;
  o.bSlotItemTakenFrom = 0;
  o.fSignedAnotherContract = false;
  o.ubAutoBandagingMedic = 0;
  o.fDontChargeTurningAPs = false;
  o.ubRobotRemoteHolderID = 0;
  o.uiTimeOfLastContractUpdate = 0;
  o.bTypeOfLastContract = 0;
  o.bTurnsCollapsed = 0;
  o.bSleepDrugCounter = 0;
  o.ubMilitiaKills = 0;
  o.bFutureDrugEffect.fill(0);
  o.bDrugEffectRate.fill(0);
  o.bDrugEffect.fill(0);
  o.bDrugSideEffectRate.fill(0);
  o.bDrugSideEffect.fill(0);
  o.bTimesDrugUsedSinceSleep.fill(0);
  o.bBlindedCounter = 0;
  o.fMercCollapsedFlag = false;
  o.fDoneAssignmentAndNothingToDoFlag = false;
  o.fMercAsleep = false;
  o.fDontChargeAPsForStanceChange = false;
  o.ubHoursOnAssignment = 0;
  o.ubMercJustFired = 0;
  o.ubTurnsUntilCanSayHeardNoise = 0;
  o.usQuoteSaidExtFlags = 0;
  o.sContPathLocation = 0;
  o.bGoodContPath = false;
  o.ubPendingActionInterrupted = 0;
  o.bNoiseLevel = 0;
  o.bRegenerationCounter = 0;
  o.bRegenBoostersUsedToday = 0;
  o.bNumPelletsHitBy = 0;
  o.sSkillCheckGridNo = 0;
  o.ubLastEnemyCycledID = 0;
  o.ubPrevSectorID = 0;
  o.ubNumTilesMovesSinceLastForget = 0;
  o.bTurningIncrement = 0;
  o.uiBattleSoundID = 0;
  o.fSoldierWasMoving = false;
  o.fSayAmmoQuotePending = false;
  o.usValueGoneUp = 0;
  o.ubNumLocateCycles = 0;
  o.ubDelayedMovementFlags = 0;
  o.fMuzzleFlash = false;
  o.ubCTGTTargetID = 0;
  o.PanelAnimateCounter = 0;
  o.uiMercChecksum = 0;
  o.bCurrentCivQuote = 0;
  o.bCurrentCivQuoteDelta = 0;
  o.ubMiscSoldierFlags = 0;
  o.ubReasonCantFinishMove = 0;
  o.sLocationOfFadeStart = 0;
  o.bUseExitGridForReentryDirection = false;
  o.uiTimeSinceLastSpoke = 0;
  o.ubContractRenewalQuoteCode = 0;
  o.sPreTraversalGridNo = 0;
  o.uiXRayActivatedTime = 0;
  o.bTurningFromUI = false;
  o.bPendingActionData5 = 0;
  o.bDelayedStrategicMoraleMod = 0;
  o.ubDoorOpeningNoise = 0;
  o.pGroup = <GROUP><unknown>null;
  o.ubLeaveHistoryCode = 0;
  o.fDontUnsetLastTargetFromTurn = false;
  o.bOverrideMoveSpeed = 0;
  o.fUseMoverrideMoveSpeed = false;
  o.uiTimeSoldierWillArrive = 0;
  o.fDieSoundUsed = false;
  o.fUseLandingZoneForArrival = false;
  o.fFallClockwise = false;
  o.bVehicleUnderRepairID = 0;
  o.iTimeCanSignElsewhere = 0;
  o.bHospitalPriceModifier = 0;
  o.bFillerBytes.fill(0);
  o.uiStartTimeOfInsuranceContract = 0;
  o.fRTInNonintAnim = false;
  o.fDoingExternalDeath = false;
  o.bCorpseQuoteTolerance = 0;
  o.bYetAnotherPaddingSpace = 0;
  o.iPositionSndID = 0;
  o.iTuringSoundID = 0;
  o.ubLastDamageReason = 0;
  o.fComplainedThatTired = false;
  o.sLastTwoLocations.fill(0);
  o.bFillerDude = 0;
  o.uiTimeSinceLastBleedGrunt = 0;
  o.ubNextToPreviousAttackerID = 0;
  o.bFiller.fill(0);
}

export function copySoldierType(destination: SOLDIERTYPE, source: SOLDIERTYPE) {
  destination.ubID = source.ubID;
  destination.bReserved1 = source.bReserved1;
  destination.ubBodyType = source.ubBodyType;
  destination.bActionPoints = source.bActionPoints;
  destination.bInitialActionPoints = source.bInitialActionPoints;
  destination.uiStatusFlags = source.uiStatusFlags;
  copyObjectArray(destination.inv, source.inv, copyObjectType);
  destination.pTempObject = source.pTempObject;
  destination.pKeyRing = source.pKeyRing;
  destination.bOldLife = source.bOldLife;
  destination.bInSector = source.bInSector;
  destination.bFlashPortraitFrame = source.bFlashPortraitFrame;
  destination.sFractLife = source.sFractLife;
  destination.bBleeding = source.bBleeding;
  destination.bBreath = source.bBreath;
  destination.bBreathMax = source.bBreathMax;
  destination.bStealthMode = source.bStealthMode;
  destination.sBreathRed = source.sBreathRed;
  destination.fDelayedMovement = source.fDelayedMovement;
  destination.fReloading = source.fReloading;
  destination.ubWaitActionToDo = source.ubWaitActionToDo;
  destination.fPauseAim = source.fPauseAim;
  destination.ubInsertionDirection = source.ubInsertionDirection;
  destination.bGunType = source.bGunType;
  destination.ubOppNum = source.ubOppNum;
  destination.bLastRenderVisibleValue = source.bLastRenderVisibleValue;
  destination.fInMissionExitNode = source.fInMissionExitNode;
  destination.ubAttackingHand = source.ubAttackingHand;
  destination.bScientific = source.bScientific;
  destination.sWeightCarriedAtTurnStart = source.sWeightCarriedAtTurnStart;
  destination.name = source.name;
  destination.bVisible = source.bVisible;
  destination.bActive = source.bActive;
  destination.bTeam = source.bTeam;
  destination.ubGroupID = source.ubGroupID;
  destination.fBetweenSectors = source.fBetweenSectors;
  destination.ubMovementNoiseHeard = source.ubMovementNoiseHeard;
  destination.dXPos = source.dXPos;
  destination.dYPos = source.dYPos;
  destination.dOldXPos = source.dOldXPos;
  destination.dOldYPos = source.dOldYPos;
  destination.sInitialGridNo = source.sInitialGridNo;
  destination.sGridNo = source.sGridNo;
  destination.bDirection = source.bDirection;
  destination.sHeightAdjustment = source.sHeightAdjustment;
  destination.sDesiredHeight = source.sDesiredHeight;
  destination.sTempNewGridNo = source.sTempNewGridNo;
  destination.sRoomNo = source.sRoomNo;
  destination.bOverTerrainType = source.bOverTerrainType;
  destination.bOldOverTerrainType = source.bOldOverTerrainType;
  destination.bCollapsed = source.bCollapsed;
  destination.bBreathCollapsed = source.bBreathCollapsed;
  destination.ubDesiredHeight = source.ubDesiredHeight;
  destination.usPendingAnimation = source.usPendingAnimation;
  destination.ubPendingStanceChange = source.ubPendingStanceChange;
  destination.usAnimState = source.usAnimState;
  destination.fNoAPToFinishMove = source.fNoAPToFinishMove;
  destination.fPausedMove = source.fPausedMove;
  destination.fUIdeadMerc = source.fUIdeadMerc;
  destination.fUInewMerc = source.fUInewMerc;
  destination.fUICloseMerc = source.fUICloseMerc;
  destination.fUIFirstTimeNOAP = source.fUIFirstTimeNOAP;
  destination.fUIFirstTimeUNCON = source.fUIFirstTimeUNCON;
  destination.UpdateCounter = source.UpdateCounter;
  destination.DamageCounter = source.DamageCounter;
  destination.ReloadCounter = source.ReloadCounter;
  destination.FlashSelCounter = source.FlashSelCounter;
  destination.AICounter = source.AICounter;
  destination.FadeCounter = source.FadeCounter;
  destination.ubSkillTrait1 = source.ubSkillTrait1;
  destination.ubSkillTrait2 = source.ubSkillTrait2;
  destination.uiAIDelay = source.uiAIDelay;
  destination.bDexterity = source.bDexterity;
  destination.bWisdom = source.bWisdom;
  destination.sReloadDelay = source.sReloadDelay;
  destination.ubAttackerID = source.ubAttackerID;
  destination.ubPreviousAttackerID = source.ubPreviousAttackerID;
  destination.fTurnInProgress = source.fTurnInProgress;
  destination.fIntendedTarget = source.fIntendedTarget;
  destination.fPauseAllAnimation = source.fPauseAllAnimation;
  destination.bExpLevel = source.bExpLevel;
  destination.sInsertionGridNo = source.sInsertionGridNo;
  destination.fContinueMoveAfterStanceChange = source.fContinueMoveAfterStanceChange;
  copyAnimationSurfaceCacheType(destination.AnimCache, source.AnimCache);
  destination.bLife = source.bLife;
  destination.bSide = source.bSide;
  destination.bViewRange = source.bViewRange;
  destination.bNewOppCnt = source.bNewOppCnt;
  destination.bService = source.bService;
  destination.usAniCode = source.usAniCode;
  destination.usAniFrame = source.usAniFrame;
  destination.sAniDelay = source.sAniDelay;
  destination.bAgility = source.bAgility;
  destination.ubDelayedMovementCauseMerc = source.ubDelayedMovementCauseMerc;
  destination.sDelayedMovementCauseGridNo = source.sDelayedMovementCauseGridNo;
  destination.sReservedMovementGridNo = source.sReservedMovementGridNo;
  destination.bStrength = source.bStrength;
  destination.fHoldAttackerUntilDone = source.fHoldAttackerUntilDone;
  destination.sTargetGridNo = source.sTargetGridNo;
  destination.bTargetLevel = source.bTargetLevel;
  destination.bTargetCubeLevel = source.bTargetCubeLevel;
  destination.sLastTarget = source.sLastTarget;
  destination.bTilesMoved = source.bTilesMoved;
  destination.bLeadership = source.bLeadership;
  destination.dNextBleed = source.dNextBleed;
  destination.fWarnedAboutBleeding = source.fWarnedAboutBleeding;
  destination.fDyingComment = source.fDyingComment;
  destination.ubTilesMovedPerRTBreathUpdate = source.ubTilesMovedPerRTBreathUpdate;
  destination.usLastMovementAnimPerRTBreathUpdate = source.usLastMovementAnimPerRTBreathUpdate;
  destination.fTurningToShoot = source.fTurningToShoot;
  destination.fTurningToFall = source.fTurningToFall;
  destination.fTurningUntilDone = source.fTurningUntilDone;
  destination.fGettingHit = source.fGettingHit;
  destination.fInNonintAnim = source.fInNonintAnim;
  destination.fFlashLocator = source.fFlashLocator;
  destination.sLocatorFrame = source.sLocatorFrame;
  destination.fShowLocator = source.fShowLocator;
  destination.fFlashPortrait = source.fFlashPortrait;
  destination.bMechanical = source.bMechanical;
  destination.bLifeMax = source.bLifeMax;
  destination.iFaceIndex = source.iFaceIndex;
  destination.HeadPal = source.HeadPal;
  destination.PantsPal = source.PantsPal;
  destination.VestPal = source.VestPal;
  destination.SkinPal = source.SkinPal;
  destination.MiscPal = source.MiscPal;
  copyArray(destination.usFrontArcFullTileList, source.usFrontArcFullTileList);
  copyArray(destination.usFrontArcFullTileGridNos, source.usFrontArcFullTileGridNos);
  destination.p8BPPPalette = source.p8BPPPalette;
  destination.p16BPPPalette = source.p16BPPPalette;
  copyArray(destination.pShades, source.pShades);
  copyArray(destination.pGlowShades, source.pGlowShades);
  destination.pCurrentShade = source.pCurrentShade;
  destination.bMedical = source.bMedical;
  destination.fBeginFade = source.fBeginFade;
  destination.ubFadeLevel = source.ubFadeLevel;
  destination.ubServiceCount = source.ubServiceCount;
  destination.ubServicePartner = source.ubServicePartner;
  destination.bMarksmanship = source.bMarksmanship;
  destination.bExplosive = source.bExplosive;
  destination.pThrowParams = source.pThrowParams;
  destination.fTurningFromPronePosition = source.fTurningFromPronePosition;
  destination.bReverse = source.bReverse;
  destination.pLevelNode = source.pLevelNode;
  destination.pExternShadowLevelNode = source.pExternShadowLevelNode;
  destination.pRoofUILevelNode = source.pRoofUILevelNode;
  destination.bDesiredDirection = source.bDesiredDirection;
  destination.sDestXPos = source.sDestXPos;
  destination.sDestYPos = source.sDestYPos;
  destination.sDesiredDest = source.sDesiredDest;
  destination.sDestination = source.sDestination;
  destination.sFinalDestination = source.sFinalDestination;
  destination.bLevel = source.bLevel;
  destination.bStopped = source.bStopped;
  destination.bNeedToLook = source.bNeedToLook;
  copyArray(destination.usPathingData, source.usPathingData);
  destination.usPathDataSize = source.usPathDataSize;
  destination.usPathIndex = source.usPathIndex;
  destination.sBlackList = source.sBlackList;
  destination.bAimTime = source.bAimTime;
  destination.bShownAimTime = source.bShownAimTime;
  destination.bPathStored = source.bPathStored;
  destination.bHasKeys = source.bHasKeys;
  destination.pBackGround = source.pBackGround;
  destination.pZBackground = source.pZBackground;
  destination.usUnblitX = source.usUnblitX;
  destination.usUnblitY = source.usUnblitY;
  destination.usUnblitWidth = source.usUnblitWidth;
  destination.usUnblitHeight = source.usUnblitHeight;
  destination.ubStrategicInsertionCode = source.ubStrategicInsertionCode;
  destination.usStrategicInsertionData = source.usStrategicInsertionData;
  destination.iLight = source.iLight;
  destination.iMuzFlash = source.iMuzFlash;
  destination.bMuzFlashCount = source.bMuzFlashCount;
  destination.sX = source.sX;
  destination.sY = source.sY;
  destination.usOldAniState = source.usOldAniState;
  destination.sOldAniCode = source.sOldAniCode;
  destination.bBulletsLeft = source.bBulletsLeft;
  destination.ubSuppressionPoints = source.ubSuppressionPoints;
  destination.uiTimeOfLastRandomAction = source.uiTimeOfLastRandomAction;
  destination.usLastRandomAnim = source.usLastRandomAnim;
  copyArray(destination.bOppList, source.bOppList);
  destination.bLastAction = source.bLastAction;
  destination.bAction = source.bAction;
  destination.usActionData = source.usActionData;
  destination.bNextAction = source.bNextAction;
  destination.usNextActionData = source.usNextActionData;
  destination.bActionInProgress = source.bActionInProgress;
  destination.bAlertStatus = source.bAlertStatus;
  destination.bOppCnt = source.bOppCnt;
  destination.bNeutral = source.bNeutral;
  destination.bNewSituation = source.bNewSituation;
  destination.bNextTargetLevel = source.bNextTargetLevel;
  destination.bOrders = source.bOrders;
  destination.bAttitude = source.bAttitude;
  destination.bUnderFire = source.bUnderFire;
  destination.bShock = source.bShock;
  destination.bUnderEscort = source.bUnderEscort;
  destination.bBypassToGreen = source.bBypassToGreen;
  destination.ubLastMercToRadio = source.ubLastMercToRadio;
  destination.bDominantDir = source.bDominantDir;
  destination.bPatrolCnt = source.bPatrolCnt;
  destination.bNextPatrolPnt = source.bNextPatrolPnt;
  copyArray(destination.usPatrolGrid, source.usPatrolGrid);
  destination.sNoiseGridno = source.sNoiseGridno;
  destination.ubNoiseVolume = source.ubNoiseVolume;
  destination.bLastAttackHit = source.bLastAttackHit;
  destination.ubXRayedBy = source.ubXRayedBy;
  destination.dHeightAdjustment = source.dHeightAdjustment;
  destination.bMorale = source.bMorale;
  destination.bTeamMoraleMod = source.bTeamMoraleMod;
  destination.bTacticalMoraleMod = source.bTacticalMoraleMod;
  destination.bStrategicMoraleMod = source.bStrategicMoraleMod;
  destination.bAIMorale = source.bAIMorale;
  destination.ubPendingAction = source.ubPendingAction;
  destination.ubPendingActionAnimCount = source.ubPendingActionAnimCount;
  destination.uiPendingActionData1 = source.uiPendingActionData1;
  destination.sPendingActionData2 = source.sPendingActionData2;
  destination.bPendingActionData3 = source.bPendingActionData3;
  destination.ubDoorHandleCode = source.ubDoorHandleCode;
  destination.uiPendingActionData4 = source.uiPendingActionData4;
  destination.bInterruptDuelPts = source.bInterruptDuelPts;
  destination.bPassedLastInterrupt = source.bPassedLastInterrupt;
  destination.bIntStartAPs = source.bIntStartAPs;
  destination.bMoved = source.bMoved;
  destination.bHunting = source.bHunting;
  destination.ubLastCall = source.ubLastCall;
  destination.ubCaller = source.ubCaller;
  destination.sCallerGridNo = source.sCallerGridNo;
  destination.bCallPriority = source.bCallPriority;
  destination.bCallActedUpon = source.bCallActedUpon;
  destination.bFrenzied = source.bFrenzied;
  destination.bNormalSmell = source.bNormalSmell;
  destination.bMonsterSmell = source.bMonsterSmell;
  destination.bMobility = source.bMobility;
  destination.bRTPCombat = source.bRTPCombat;
  destination.fAIFlags = source.fAIFlags;
  destination.fDontChargeReadyAPs = source.fDontChargeReadyAPs;
  destination.usAnimSurface = source.usAnimSurface;
  destination.sZLevel = source.sZLevel;
  destination.fPrevInWater = source.fPrevInWater;
  destination.fGoBackToAimAfterHit = source.fGoBackToAimAfterHit;
  destination.sWalkToAttackGridNo = source.sWalkToAttackGridNo;
  destination.sWalkToAttackWalkToCost = source.sWalkToAttackWalkToCost;
  destination.fForceRenderColor = source.fForceRenderColor;
  destination.fForceNoRenderPaletteCycle = source.fForceNoRenderPaletteCycle;
  destination.sLocatorOffX = source.sLocatorOffX;
  destination.sLocatorOffY = source.sLocatorOffY;
  destination.fStopPendingNextTile = source.fStopPendingNextTile;
  destination.fForceShade = source.fForceShade;
  destination.pForcedShade = source.pForcedShade;
  destination.bDisplayDamageCount = source.bDisplayDamageCount;
  destination.fDisplayDamage = source.fDisplayDamage;
  destination.sDamage = source.sDamage;
  destination.sDamageX = source.sDamageX;
  destination.sDamageY = source.sDamageY;
  destination.bDamageDir = source.bDamageDir;
  destination.bDoBurst = source.bDoBurst;
  destination.usUIMovementMode = source.usUIMovementMode;
  destination.bUIInterfaceLevel = source.bUIInterfaceLevel;
  destination.fUIMovementFast = source.fUIMovementFast;
  destination.BlinkSelCounter = source.BlinkSelCounter;
  destination.PortraitFlashCounter = source.PortraitFlashCounter;
  destination.fDeadSoundPlayed = source.fDeadSoundPlayed;
  destination.ubProfile = source.ubProfile;
  destination.ubQuoteRecord = source.ubQuoteRecord;
  destination.ubQuoteActionID = source.ubQuoteActionID;
  destination.ubBattleSoundID = source.ubBattleSoundID;
  destination.fClosePanel = source.fClosePanel;
  destination.fClosePanelToDie = source.fClosePanelToDie;
  destination.ubClosePanelFrame = source.ubClosePanelFrame;
  destination.fDeadPanel = source.fDeadPanel;
  destination.ubDeadPanelFrame = source.ubDeadPanelFrame;
  destination.fOpenPanel = source.fOpenPanel;
  destination.bOpenPanelFrame = source.bOpenPanelFrame;
  destination.sPanelFaceX = source.sPanelFaceX;
  destination.sPanelFaceY = source.sPanelFaceY;
  destination.bNumHitsThisTurn = source.bNumHitsThisTurn;
  destination.usQuoteSaidFlags = source.usQuoteSaidFlags;
  destination.fCloseCall = source.fCloseCall;
  destination.bLastSkillCheck = source.bLastSkillCheck;
  destination.ubSkillCheckAttempts = source.ubSkillCheckAttempts;
  destination.bVocalVolume = source.bVocalVolume;
  destination.bStartFallDir = source.bStartFallDir;
  destination.fTryingToFall = source.fTryingToFall;
  destination.ubPendingDirection = source.ubPendingDirection;
  destination.uiAnimSubFlags = source.uiAnimSubFlags;
  destination.bAimShotLocation = source.bAimShotLocation;
  destination.ubHitLocation = source.ubHitLocation;
  copyArray(destination.pEffectShades, source.pEffectShades);
  destination.ubPlannedUIAPCost = source.ubPlannedUIAPCost;
  destination.sPlannedTargetX = source.sPlannedTargetX;
  destination.sPlannedTargetY = source.sPlannedTargetY;
  copyArray(destination.sSpreadLocations, source.sSpreadLocations);
  destination.fDoSpread = source.fDoSpread;
  destination.sStartGridNo = source.sStartGridNo;
  destination.sEndGridNo = source.sEndGridNo;
  destination.sForcastGridno = source.sForcastGridno;
  destination.sZLevelOverride = source.sZLevelOverride;
  destination.bMovedPriorToInterrupt = source.bMovedPriorToInterrupt;
  destination.iEndofContractTime = source.iEndofContractTime;
  destination.iStartContractTime = source.iStartContractTime;
  destination.iTotalContractLength = source.iTotalContractLength;
  destination.iNextActionSpecialData = source.iNextActionSpecialData;
  destination.ubWhatKindOfMercAmI = source.ubWhatKindOfMercAmI;
  destination.bAssignment = source.bAssignment;
  destination.bOldAssignment = source.bOldAssignment;
  destination.fForcedToStayAwake = source.fForcedToStayAwake;
  destination.bTrainStat = source.bTrainStat;
  destination.sSectorX = source.sSectorX;
  destination.sSectorY = source.sSectorY;
  destination.bSectorZ = source.bSectorZ;
  destination.iVehicleId = source.iVehicleId;
  destination.pMercPath = <PathSt><unknown>null;
  destination.fHitByGasFlags = source.fHitByGasFlags;
  destination.usMedicalDeposit = source.usMedicalDeposit;
  destination.usLifeInsurance = source.usLifeInsurance;
  destination.uiStartMovementTime = source.uiStartMovementTime;
  destination.uiOptimumMovementTime = source.uiOptimumMovementTime;
  destination.usLastUpdateTime = source.usLastUpdateTime;
  destination.fIsSoldierMoving = source.fIsSoldierMoving;
  destination.fIsSoldierDelayed = source.fIsSoldierDelayed;
  destination.fSoldierUpdatedFromNetwork = source.fSoldierUpdatedFromNetwork;
  destination.uiSoldierUpdateNumber = source.uiSoldierUpdateNumber;
  destination.ubSoldierUpdateType = source.ubSoldierUpdateType;
  destination.iStartOfInsuranceContract = source.iStartOfInsuranceContract;
  destination.uiLastAssignmentChangeMin = source.uiLastAssignmentChangeMin;
  destination.iTotalLengthOfInsuranceContract = source.iTotalLengthOfInsuranceContract;
  destination.ubSoldierClass = source.ubSoldierClass;
  destination.ubAPsLostToSuppression = source.ubAPsLostToSuppression;
  destination.fChangingStanceDueToSuppression = source.fChangingStanceDueToSuppression;
  destination.ubSuppressorID = source.ubSuppressorID;
  destination.ubDesiredSquadAssignment = source.ubDesiredSquadAssignment;
  destination.ubNumTraversalsAllowedToMerge = source.ubNumTraversalsAllowedToMerge;
  destination.usPendingAnimation2 = source.usPendingAnimation2;
  destination.ubCivilianGroup = source.ubCivilianGroup;
  destination.uiChangeLevelTime = source.uiChangeLevelTime;
  destination.uiChangeHealthTime = source.uiChangeHealthTime;
  destination.uiChangeStrengthTime = source.uiChangeStrengthTime;
  destination.uiChangeDexterityTime = source.uiChangeDexterityTime;
  destination.uiChangeAgilityTime = source.uiChangeAgilityTime;
  destination.uiChangeWisdomTime = source.uiChangeWisdomTime;
  destination.uiChangeLeadershipTime = source.uiChangeLeadershipTime;
  destination.uiChangeMarksmanshipTime = source.uiChangeMarksmanshipTime;
  destination.uiChangeExplosivesTime = source.uiChangeExplosivesTime;
  destination.uiChangeMedicalTime = source.uiChangeMedicalTime;
  destination.uiChangeMechanicalTime = source.uiChangeMechanicalTime;
  destination.uiUniqueSoldierIdValue = source.uiUniqueSoldierIdValue;
  destination.bBeingAttackedCount = source.bBeingAttackedCount;
  copyArray(destination.bNewItemCount, source.bNewItemCount);
  copyArray(destination.bNewItemCycleCount, source.bNewItemCycleCount);
  destination.fCheckForNewlyAddedItems = source.fCheckForNewlyAddedItems;
  destination.bEndDoorOpenCode = source.bEndDoorOpenCode;
  destination.ubScheduleID = source.ubScheduleID;
  destination.sEndDoorOpenCodeData = source.sEndDoorOpenCodeData;
  destination.NextTileCounter = source.NextTileCounter;
  destination.fBlockedByAnotherMerc = source.fBlockedByAnotherMerc;
  destination.bBlockedByAnotherMercDirection = source.bBlockedByAnotherMercDirection;
  destination.usAttackingWeapon = source.usAttackingWeapon;
  destination.bWeaponMode = source.bWeaponMode;
  destination.ubTargetID = source.ubTargetID;
  destination.bAIScheduleProgress = source.bAIScheduleProgress;
  destination.sOffWorldGridNo = source.sOffWorldGridNo;
  destination.pAniTile = source.pAniTile;
  destination.bCamo = source.bCamo;
  destination.sAbsoluteFinalDestination = source.sAbsoluteFinalDestination;
  destination.ubHiResDirection = source.ubHiResDirection;
  destination.ubHiResDesiredDirection = source.ubHiResDesiredDirection;
  destination.ubLastFootPrintSound = source.ubLastFootPrintSound;
  destination.bVehicleID = source.bVehicleID;
  destination.fPastXDest = source.fPastXDest;
  destination.fPastYDest = source.fPastYDest;
  destination.bMovementDirection = source.bMovementDirection;
  destination.sOldGridNo = source.sOldGridNo;
  destination.usDontUpdateNewGridNoOnMoveAnimChange = source.usDontUpdateNewGridNoOnMoveAnimChange;
  destination.sBoundingBoxWidth = source.sBoundingBoxWidth;
  destination.sBoundingBoxHeight = source.sBoundingBoxHeight;
  destination.sBoundingBoxOffsetX = source.sBoundingBoxOffsetX;
  destination.sBoundingBoxOffsetY = source.sBoundingBoxOffsetY;
  destination.uiTimeSameBattleSndDone = source.uiTimeSameBattleSndDone;
  destination.bOldBattleSnd = source.bOldBattleSnd;
  destination.fReactingFromBeingShot = source.fReactingFromBeingShot;
  destination.fContractPriceHasIncreased = source.fContractPriceHasIncreased;
  destination.iBurstSoundID = source.iBurstSoundID;
  destination.fFixingSAMSite = source.fFixingSAMSite;
  destination.fFixingRobot = source.fFixingRobot;
  destination.bSlotItemTakenFrom = source.bSlotItemTakenFrom;
  destination.fSignedAnotherContract = source.fSignedAnotherContract;
  destination.ubAutoBandagingMedic = source.ubAutoBandagingMedic;
  destination.fDontChargeTurningAPs = source.fDontChargeTurningAPs;
  destination.ubRobotRemoteHolderID = source.ubRobotRemoteHolderID;
  destination.uiTimeOfLastContractUpdate = source.uiTimeOfLastContractUpdate;
  destination.bTypeOfLastContract = source.bTypeOfLastContract;
  destination.bTurnsCollapsed = source.bTurnsCollapsed;
  destination.bSleepDrugCounter = source.bSleepDrugCounter;
  destination.ubMilitiaKills = source.ubMilitiaKills;
  copyArray(destination.bFutureDrugEffect, source.bFutureDrugEffect);
  copyArray(destination.bDrugEffectRate, source.bDrugEffectRate);
  copyArray(destination.bDrugEffect, source.bDrugEffect);
  copyArray(destination.bDrugSideEffectRate, source.bDrugSideEffectRate);
  copyArray(destination.bDrugSideEffect, source.bDrugSideEffect);
  copyArray(destination.bTimesDrugUsedSinceSleep, source.bTimesDrugUsedSinceSleep);
  destination.bBlindedCounter = source.bBlindedCounter;
  destination.fMercCollapsedFlag = source.fMercCollapsedFlag;
  destination.fDoneAssignmentAndNothingToDoFlag = source.fDoneAssignmentAndNothingToDoFlag;
  destination.fMercAsleep = source.fMercAsleep;
  destination.fDontChargeAPsForStanceChange = source.fDontChargeAPsForStanceChange;
  destination.ubHoursOnAssignment = source.ubHoursOnAssignment;
  destination.ubMercJustFired = source.ubMercJustFired;
  destination.ubTurnsUntilCanSayHeardNoise = source.ubTurnsUntilCanSayHeardNoise;
  destination.usQuoteSaidExtFlags = source.usQuoteSaidExtFlags;
  destination.sContPathLocation = source.sContPathLocation;
  destination.bGoodContPath = source.bGoodContPath;
  destination.ubPendingActionInterrupted = source.ubPendingActionInterrupted;
  destination.bNoiseLevel = source.bNoiseLevel;
  destination.bRegenerationCounter = source.bRegenerationCounter;
  destination.bRegenBoostersUsedToday = source.bRegenBoostersUsedToday;
  destination.bNumPelletsHitBy = source.bNumPelletsHitBy;
  destination.sSkillCheckGridNo = source.sSkillCheckGridNo;
  destination.ubLastEnemyCycledID = source.ubLastEnemyCycledID;
  destination.ubPrevSectorID = source.ubPrevSectorID;
  destination.ubNumTilesMovesSinceLastForget = source.ubNumTilesMovesSinceLastForget;
  destination.bTurningIncrement = source.bTurningIncrement;
  destination.uiBattleSoundID = source.uiBattleSoundID;
  destination.fSoldierWasMoving = source.fSoldierWasMoving;
  destination.fSayAmmoQuotePending = source.fSayAmmoQuotePending;
  destination.usValueGoneUp = source.usValueGoneUp;
  destination.ubNumLocateCycles = source.ubNumLocateCycles;
  destination.ubDelayedMovementFlags = source.ubDelayedMovementFlags;
  destination.fMuzzleFlash = source.fMuzzleFlash;
  destination.ubCTGTTargetID = source.ubCTGTTargetID;
  destination.PanelAnimateCounter = source.PanelAnimateCounter;
  destination.uiMercChecksum = source.uiMercChecksum;
  destination.bCurrentCivQuote = source.bCurrentCivQuote;
  destination.bCurrentCivQuoteDelta = source.bCurrentCivQuoteDelta;
  destination.ubMiscSoldierFlags = source.ubMiscSoldierFlags;
  destination.ubReasonCantFinishMove = source.ubReasonCantFinishMove;
  destination.sLocationOfFadeStart = source.sLocationOfFadeStart;
  destination.bUseExitGridForReentryDirection = source.bUseExitGridForReentryDirection;
  destination.uiTimeSinceLastSpoke = source.uiTimeSinceLastSpoke;
  destination.ubContractRenewalQuoteCode = source.ubContractRenewalQuoteCode;
  destination.sPreTraversalGridNo = source.sPreTraversalGridNo;
  destination.uiXRayActivatedTime = source.uiXRayActivatedTime;
  destination.bTurningFromUI = source.bTurningFromUI;
  destination.bPendingActionData5 = source.bPendingActionData5;
  destination.bDelayedStrategicMoraleMod = source.bDelayedStrategicMoraleMod;
  destination.ubDoorOpeningNoise = source.ubDoorOpeningNoise;
  destination.pGroup = source.pGroup;
  destination.ubLeaveHistoryCode = source.ubLeaveHistoryCode;
  destination.fDontUnsetLastTargetFromTurn = source.fDontUnsetLastTargetFromTurn;
  destination.bOverrideMoveSpeed = source.bOverrideMoveSpeed;
  destination.fUseMoverrideMoveSpeed = source.fUseMoverrideMoveSpeed;
  destination.uiTimeSoldierWillArrive = source.uiTimeSoldierWillArrive;
  destination.fDieSoundUsed = source.fDieSoundUsed;
  destination.fUseLandingZoneForArrival = source.fUseLandingZoneForArrival;
  destination.fFallClockwise = source.fFallClockwise;
  destination.bVehicleUnderRepairID = source.bVehicleUnderRepairID;
  destination.iTimeCanSignElsewhere = source.iTimeCanSignElsewhere;
  destination.bHospitalPriceModifier = source.bHospitalPriceModifier;
  copyArray(destination.bFillerBytes, source.bFillerBytes);
  destination.uiStartTimeOfInsuranceContract = source.uiStartTimeOfInsuranceContract;
  destination.fRTInNonintAnim = source.fRTInNonintAnim;
  destination.fDoingExternalDeath = source.fDoingExternalDeath;
  destination.bCorpseQuoteTolerance = source.bCorpseQuoteTolerance;
  destination.bYetAnotherPaddingSpace = source.bYetAnotherPaddingSpace;
  destination.iPositionSndID = source.iPositionSndID;
  destination.iTuringSoundID = source.iTuringSoundID;
  destination.ubLastDamageReason = source.ubLastDamageReason;
  destination.fComplainedThatTired = source.fComplainedThatTired;
  copyArray(destination.sLastTwoLocations, source.sLastTwoLocations);
  destination.bFillerDude = source.bFillerDude;
  destination.uiTimeSinceLastBleedGrunt = source.uiTimeSinceLastBleedGrunt;
  destination.ubNextToPreviousAttackerID = source.ubNextToPreviousAttackerID;
  copyArray(destination.bFiller, source.bFiller);
}

export const SOLDIER_TYPE_SIZE = 2328;

export function readSoldierType(o: SOLDIERTYPE, buffer: Buffer, offset: number = 0): number {
  o.ubID = buffer.readUInt8(offset++);
  o.bReserved1 = buffer.readUInt8(offset++);
  o.ubBodyType = buffer.readUInt8(offset++);
  o.bActionPoints = buffer.readInt8(offset++);
  o.bInitialActionPoints = buffer.readInt8(offset++);
  offset += 3; // padding
  o.uiStatusFlags = buffer.readUInt32LE(offset); offset += 4;
  offset = readObjectArray(o.inv, buffer, offset, readObjectType);
  o.pTempObject = null; offset += 4; // pointer
  o.pKeyRing = <KEY_ON_RING[]><unknown>null; offset += 4; // pointer
  o.bOldLife = buffer.readInt8(offset++);
  o.bInSector = Boolean(buffer.readUInt8(offset++));
  o.bFlashPortraitFrame = buffer.readInt8(offset++);
  offset++; // padding
  o.sFractLife = buffer.readInt16LE(offset); offset += 2;
  o.bBleeding = buffer.readInt8(offset++);
  o.bBreath = buffer.readInt8(offset++);
  o.bBreathMax = buffer.readInt8(offset++);
  o.bStealthMode = Boolean(buffer.readUInt8(offset++));
  o.sBreathRed = buffer.readInt16LE(offset); offset += 2;
  o.fDelayedMovement = buffer.readUInt8(offset++);
  o.fReloading = Boolean(buffer.readUInt8(offset++));
  o.ubWaitActionToDo = buffer.readUInt8(offset++);
  o.fPauseAim = Boolean(buffer.readUInt8(offset++));
  o.ubInsertionDirection = buffer.readInt8(offset++);
  o.bGunType = buffer.readInt8(offset++);
  o.ubOppNum = buffer.readUInt8(offset++);
  o.bLastRenderVisibleValue = buffer.readInt8(offset++);
  o.fInMissionExitNode = Boolean(buffer.readUInt8(offset++));
  o.ubAttackingHand = buffer.readUInt8(offset++);
  o.bScientific = buffer.readInt8(offset++);
  offset++; // padding
  o.sWeightCarriedAtTurnStart = buffer.readInt16LE(offset); offset += 2;
  o.name = readStringNL(buffer, 'utf16le', offset, offset + 20); offset += 20;
  o.bVisible = buffer.readInt8(offset++);
  o.bActive = Boolean(buffer.readUInt8(offset++));
  o.bTeam = buffer.readInt8(offset++);
  o.ubGroupID = buffer.readUInt8(offset++);
  o.fBetweenSectors = Boolean(buffer.readUInt8(offset++));
  o.ubMovementNoiseHeard = buffer.readUInt8(offset++);
  o.dXPos = buffer.readFloatLE(offset); offset += 4;
  o.dYPos = buffer.readFloatLE(offset); offset += 4;
  o.dOldXPos = buffer.readFloatLE(offset); offset += 4;
  o.dOldYPos = buffer.readFloatLE(offset); offset += 4;
  o.sInitialGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.bDirection = buffer.readInt8(offset++);
  offset++; // padding
  o.sHeightAdjustment = buffer.readInt16LE(offset); offset += 2;
  o.sDesiredHeight = buffer.readInt16LE(offset); offset += 2;
  o.sTempNewGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sRoomNo = buffer.readInt16LE(offset); offset += 2;
  o.bOverTerrainType = buffer.readInt8(offset++);
  o.bOldOverTerrainType = buffer.readInt8(offset++);
  o.bCollapsed = Boolean(buffer.readUInt8(offset++));
  o.bBreathCollapsed = Boolean(buffer.readUInt8(offset++));
  o.ubDesiredHeight = buffer.readUInt8(offset++);
  offset++; // padding
  o.usPendingAnimation = buffer.readUInt16LE(offset); offset += 2;
  o.ubPendingStanceChange = buffer.readUInt8(offset++);
  offset++; // padding
  o.usAnimState = buffer.readUInt16LE(offset); offset += 2;
  o.fNoAPToFinishMove = Boolean(buffer.readUInt8(offset++));
  o.fPausedMove = Boolean(buffer.readUInt8(offset++));
  o.fUIdeadMerc = Boolean(buffer.readUInt8(offset++));
  o.fUInewMerc = Boolean(buffer.readUInt8(offset++));
  o.fUICloseMerc = Boolean(buffer.readUInt8(offset++));
  o.fUIFirstTimeNOAP = Boolean(buffer.readUInt8(offset++));
  o.fUIFirstTimeUNCON = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.UpdateCounter = buffer.readInt32LE(offset); offset += 4;
  o.DamageCounter = buffer.readInt32LE(offset); offset += 4;
  o.ReloadCounter = buffer.readInt32LE(offset); offset += 4;
  o.FlashSelCounter = buffer.readInt32LE(offset); offset += 4;
  o.AICounter = buffer.readInt32LE(offset); offset += 4;
  o.FadeCounter = buffer.readInt32LE(offset); offset += 4;
  o.ubSkillTrait1 = buffer.readUInt8(offset++);
  o.ubSkillTrait2 = buffer.readUInt8(offset++);
  offset += 2; // padding
  o.uiAIDelay = buffer.readUInt32LE(offset); offset += 4;
  o.bDexterity = buffer.readInt8(offset++);
  o.bWisdom = buffer.readInt8(offset++);
  o.sReloadDelay = buffer.readInt16LE(offset); offset += 2;
  o.ubAttackerID = buffer.readUInt8(offset++);
  o.ubPreviousAttackerID = buffer.readUInt8(offset++);
  o.fTurnInProgress = Boolean(buffer.readUInt8(offset++));
  o.fIntendedTarget = Boolean(buffer.readUInt8(offset++));
  o.fPauseAllAnimation = Boolean(buffer.readUInt8(offset++));
  o.bExpLevel = buffer.readInt8(offset++);
  o.sInsertionGridNo = buffer.readInt16LE(offset); offset += 2;
  o.fContinueMoveAfterStanceChange = buffer.readUInt8(offset++);
  offset += 3; // padding
  offset = readAnimationSurfaceCacheType(o.AnimCache, buffer, offset);
  o.bLife = buffer.readInt8(offset++);
  o.bSide = buffer.readUInt8(offset++);
  o.bViewRange = buffer.readUInt8(offset++);
  o.bNewOppCnt = buffer.readInt8(offset++);
  o.bService = buffer.readInt8(offset++);
  offset++; // padding
  o.usAniCode = buffer.readUInt16LE(offset); offset += 2;
  o.usAniFrame = buffer.readUInt16LE(offset); offset += 2;
  o.sAniDelay = buffer.readInt16LE(offset); offset += 2;
  o.bAgility = buffer.readInt8(offset++);
  o.ubDelayedMovementCauseMerc = buffer.readUInt8(offset++);
  o.sDelayedMovementCauseGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sReservedMovementGridNo = buffer.readInt16LE(offset); offset += 2;
  o.bStrength = buffer.readInt8(offset++);
  o.fHoldAttackerUntilDone = Boolean(buffer.readUInt8(offset++));
  o.sTargetGridNo = buffer.readInt16LE(offset); offset += 2;
  o.bTargetLevel = buffer.readInt8(offset++);
  o.bTargetCubeLevel = buffer.readInt8(offset++);
  o.sLastTarget = buffer.readInt16LE(offset); offset += 2;
  o.bTilesMoved = buffer.readInt8(offset++);
  o.bLeadership = buffer.readInt8(offset++);
  o.dNextBleed = buffer.readFloatLE(offset); offset += 4;
  o.fWarnedAboutBleeding = Boolean(buffer.readUInt8(offset++));
  o.fDyingComment = Boolean(buffer.readUInt8(offset++));
  o.ubTilesMovedPerRTBreathUpdate = buffer.readUInt8(offset++);
  offset++; // padding
  o.usLastMovementAnimPerRTBreathUpdate = buffer.readUInt16LE(offset); offset += 2;
  o.fTurningToShoot = Boolean(buffer.readUInt8(offset++));
  o.fTurningToFall = Boolean(buffer.readUInt8(offset++));
  o.fTurningUntilDone = Boolean(buffer.readUInt8(offset++));
  o.fGettingHit = buffer.readUInt8(offset++);
  o.fInNonintAnim = Boolean(buffer.readUInt8(offset++));
  o.fFlashLocator = Boolean(buffer.readUInt8(offset++));
  o.sLocatorFrame = buffer.readInt16LE(offset); offset += 2;
  o.fShowLocator = Boolean(buffer.readUInt8(offset++));
  o.fFlashPortrait = buffer.readUInt8(offset++);
  o.bMechanical = buffer.readInt8(offset++);
  o.bLifeMax = buffer.readInt8(offset++);
  offset += 2; // padding
  o.iFaceIndex = buffer.readInt32LE(offset); offset += 4;
  o.HeadPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.PantsPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.VestPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.SkinPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.MiscPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  offset = readUIntArray(o.usFrontArcFullTileList, buffer, offset, 2);
  offset = readIntArray(o.usFrontArcFullTileGridNos, buffer, offset, 2);
  offset += 2; // padding
  o.p8BPPPalette = <SGPPaletteEntry[]><unknown>null; offset += 4; // pointer
  o.p16BPPPalette = <UINT16[]><unknown>null; offset += 4; // pointer
  o.pShades.fill(<UINT16[]><unknown>null); offset += 4 * NUM_SOLDIER_SHADES; // pointers
  o.pGlowShades.fill(<UINT16[]><unknown>null); offset += 4 * 20; // pointers
  o.pCurrentShade = <UINT16[]><unknown>null; offset += 4; // pointer
  o.bMedical = buffer.readInt8(offset++);
  o.fBeginFade = buffer.readUInt8(offset++);
  o.ubFadeLevel = buffer.readUInt8(offset++);
  o.ubServiceCount = buffer.readUInt8(offset++);
  o.ubServicePartner = buffer.readUInt8(offset++);
  o.bMarksmanship = buffer.readInt8(offset++);
  o.bExplosive = buffer.readInt8(offset++);
  offset++; // padding
  o.pThrowParams = null; offset += 4; // pointer
  o.fTurningFromPronePosition = buffer.readUInt8(offset++);
  o.bReverse = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  o.pLevelNode = null; offset += 4; // pointer
  o.pExternShadowLevelNode = null; offset += 4; // pointer
  o.pRoofUILevelNode = null; offset += 4; // pointer
  o.bDesiredDirection = buffer.readInt8(offset++);
  offset++; // padding
  o.sDestXPos = buffer.readInt16LE(offset); offset += 2;
  o.sDestYPos = buffer.readInt16LE(offset); offset += 2;
  o.sDesiredDest = buffer.readInt16LE(offset); offset += 2;
  o.sDestination = buffer.readInt16LE(offset); offset += 2;
  o.sFinalDestination = buffer.readInt16LE(offset); offset += 2;
  o.bLevel = buffer.readInt8(offset++);
  o.bStopped = buffer.readInt8(offset++);
  o.bNeedToLook = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  offset = readUIntArray(o.usPathingData, buffer, offset, 2);
  o.usPathDataSize = buffer.readUInt16LE(offset); offset += 2;
  o.usPathIndex = buffer.readUInt16LE(offset); offset += 2;
  o.sBlackList = buffer.readInt16LE(offset); offset += 2;
  o.bAimTime = buffer.readInt8(offset++);
  o.bShownAimTime = buffer.readInt8(offset++);
  o.bPathStored = Boolean(buffer.readUInt8(offset++));
  o.bHasKeys = buffer.readInt8(offset++);
  offset += 2; // padding
  o.pBackGround = null; offset += 4; // pointer
  o.pZBackground = null; offset += 4; // pointer
  o.usUnblitX = buffer.readUInt16LE(offset); offset += 2;
  o.usUnblitY = buffer.readUInt16LE(offset); offset += 2;
  o.usUnblitWidth = buffer.readUInt16LE(offset); offset += 2;
  o.usUnblitHeight = buffer.readUInt16LE(offset); offset += 2;
  o.ubStrategicInsertionCode = buffer.readUInt8(offset++);
  offset++; // padding
  o.usStrategicInsertionData = buffer.readUInt16LE(offset); offset += 2;
  o.iLight = buffer.readInt32LE(offset); offset += 4;
  o.iMuzFlash = buffer.readInt32LE(offset); offset += 4;
  o.bMuzFlashCount = buffer.readInt8(offset++);
  offset++; // padding
  o.sX = buffer.readInt16LE(offset); offset += 2;
  o.sY = buffer.readInt16LE(offset); offset += 2;
  o.usOldAniState = buffer.readUInt16LE(offset); offset += 2;
  o.sOldAniCode = buffer.readInt16LE(offset); offset += 2;
  o.bBulletsLeft = buffer.readInt8(offset++);
  o.ubSuppressionPoints = buffer.readUInt8(offset++);
  o.uiTimeOfLastRandomAction = buffer.readUInt32LE(offset); offset += 4;
  o.usLastRandomAnim = buffer.readInt16LE(offset); offset += 2;
  offset = readIntArray(o.bOppList, buffer, offset, 1);
  o.bLastAction = buffer.readInt8(offset++);
  o.bAction = buffer.readInt8(offset++);
  o.usActionData = buffer.readUInt16LE(offset); offset += 2;
  o.bNextAction = buffer.readInt8(offset++);
  offset++; // padding
  o.usNextActionData = buffer.readUInt16LE(offset); offset += 2;
  o.bActionInProgress = Boolean(buffer.readUInt8(offset++));
  o.bAlertStatus = buffer.readInt8(offset++);
  o.bOppCnt = buffer.readInt8(offset++);
  o.bNeutral = Boolean(buffer.readUInt8(offset++));
  o.bNewSituation = buffer.readInt8(offset++);
  o.bNextTargetLevel = buffer.readInt8(offset++);
  o.bOrders = buffer.readInt8(offset++);
  o.bAttitude = buffer.readInt8(offset++);
  o.bUnderFire = buffer.readInt8(offset++);
  o.bShock = buffer.readInt8(offset++);
  o.bUnderEscort = Boolean(buffer.readUInt8(offset++));
  o.bBypassToGreen = buffer.readInt8(offset++);
  o.ubLastMercToRadio = buffer.readUInt8(offset++);
  o.bDominantDir = buffer.readInt8(offset++);
  o.bPatrolCnt = buffer.readInt8(offset++);
  o.bNextPatrolPnt = buffer.readInt8(offset++);
  offset = readIntArray(o.usPatrolGrid, buffer, offset, 2);
  o.sNoiseGridno = buffer.readInt16LE(offset); offset += 2;
  o.ubNoiseVolume = buffer.readUInt8(offset++);
  o.bLastAttackHit = Boolean(buffer.readUInt8(offset++));
  o.ubXRayedBy = buffer.readUInt8(offset++);
  offset++; // padding
  o.dHeightAdjustment = buffer.readFloatLE(offset); offset += 4;
  o.bMorale = buffer.readInt8(offset++);
  o.bTeamMoraleMod = buffer.readInt8(offset++);
  o.bTacticalMoraleMod = buffer.readInt8(offset++);
  o.bStrategicMoraleMod = buffer.readInt8(offset++);
  o.bAIMorale = buffer.readInt8(offset++);
  o.ubPendingAction = buffer.readUInt8(offset++);
  o.ubPendingActionAnimCount = buffer.readUInt8(offset++);
  offset++; // padding
  o.uiPendingActionData1 = buffer.readUInt32LE(offset); offset += 4;
  o.sPendingActionData2 = buffer.readInt16LE(offset); offset += 2;
  o.bPendingActionData3 = buffer.readInt8(offset++);
  o.ubDoorHandleCode = buffer.readInt8(offset++);
  o.uiPendingActionData4 = buffer.readUInt32LE(offset); offset += 4;
  o.bInterruptDuelPts = buffer.readInt8(offset++);
  o.bPassedLastInterrupt = Boolean(buffer.readUInt8(offset++));
  o.bIntStartAPs = buffer.readInt8(offset++);
  o.bMoved = Boolean(buffer.readUInt8(offset++));
  o.bHunting = Boolean(buffer.readUInt8(offset++));
  o.ubLastCall = buffer.readUInt8(offset++);
  o.ubCaller = buffer.readUInt8(offset++);
  offset++; // padding
  o.sCallerGridNo = buffer.readInt16LE(offset); offset += 2;
  o.bCallPriority = buffer.readUInt8(offset++);
  o.bCallActedUpon = Boolean(buffer.readUInt8(offset++));
  o.bFrenzied = Boolean(buffer.readUInt8(offset++));
  o.bNormalSmell = buffer.readInt8(offset++);
  o.bMonsterSmell = buffer.readInt8(offset++);
  o.bMobility = buffer.readInt8(offset++);
  o.bRTPCombat = buffer.readInt8(offset++);
  o.fAIFlags = buffer.readInt8(offset++);
  o.fDontChargeReadyAPs = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.usAnimSurface = buffer.readUInt16LE(offset); offset += 2;
  o.sZLevel = buffer.readUInt16LE(offset); offset += 2;
  o.fPrevInWater = Boolean(buffer.readUInt8(offset++));
  o.fGoBackToAimAfterHit = Boolean(buffer.readUInt8(offset++));
  o.sWalkToAttackGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sWalkToAttackWalkToCost = buffer.readInt16LE(offset); offset += 2;
  o.fForceRenderColor = Boolean(buffer.readUInt8(offset++));
  o.fForceNoRenderPaletteCycle = Boolean(buffer.readUInt8(offset++));
  o.sLocatorOffX = buffer.readInt16LE(offset); offset += 2;
  o.sLocatorOffY = buffer.readInt16LE(offset); offset += 2;
  o.fStopPendingNextTile = Boolean(buffer.readUInt8(offset++));
  o.fForceShade = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  o.pForcedShade = <UINT16[]><unknown>null; offset += 4; // pointer
  o.bDisplayDamageCount = buffer.readInt8(offset++);
  o.fDisplayDamage = Boolean(buffer.readUInt8(offset++));
  o.sDamage = buffer.readInt16LE(offset); offset += 2;
  o.sDamageX = buffer.readInt16LE(offset); offset += 2;
  o.sDamageY = buffer.readInt16LE(offset); offset += 2;
  o.bDamageDir = buffer.readInt8(offset++);
  o.bDoBurst = buffer.readInt8(offset++);
  o.usUIMovementMode = buffer.readInt16LE(offset); offset += 2;
  o.bUIInterfaceLevel = buffer.readInt8(offset++);
  o.fUIMovementFast = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  o.BlinkSelCounter = buffer.readInt32LE(offset); offset += 4;
  o.PortraitFlashCounter = buffer.readInt32LE(offset); offset += 4;
  o.fDeadSoundPlayed = Boolean(buffer.readUInt8(offset++));
  o.ubProfile = buffer.readUInt8(offset++);
  o.ubQuoteRecord = buffer.readUInt8(offset++);
  o.ubQuoteActionID = buffer.readUInt8(offset++);
  o.ubBattleSoundID = buffer.readUInt8(offset++);
  o.fClosePanel = Boolean(buffer.readUInt8(offset++));
  o.fClosePanelToDie = Boolean(buffer.readUInt8(offset++));
  o.ubClosePanelFrame = buffer.readUInt8(offset++);
  o.fDeadPanel = Boolean(buffer.readUInt8(offset++));
  o.ubDeadPanelFrame = buffer.readUInt8(offset++);
  o.fOpenPanel = Boolean(buffer.readUInt8(offset++));
  o.bOpenPanelFrame = buffer.readInt8(offset++);
  o.sPanelFaceX = buffer.readInt16LE(offset); offset += 2;
  o.sPanelFaceY = buffer.readInt16LE(offset); offset += 2;
  o.bNumHitsThisTurn = buffer.readInt8(offset++);
  offset++; // padding
  o.usQuoteSaidFlags = buffer.readUInt16LE(offset); offset += 2;
  o.fCloseCall = Boolean(buffer.readUInt8(offset++));
  o.bLastSkillCheck = buffer.readInt8(offset++);
  o.ubSkillCheckAttempts = buffer.readInt8(offset++);
  o.bVocalVolume = buffer.readInt8(offset++);
  o.bStartFallDir = buffer.readInt8(offset++);
  o.fTryingToFall = Boolean(buffer.readUInt8(offset++));
  o.ubPendingDirection = buffer.readUInt8(offset++);
  offset++; // padding
  o.uiAnimSubFlags = buffer.readUInt32LE(offset); offset += 4;
  o.bAimShotLocation = buffer.readUInt8(offset++);
  o.ubHitLocation = buffer.readUInt8(offset++);
  offset += 2; // padding
  o.pEffectShades.fill(<UINT16[]><unknown>null); offset += 4 * NUM_SOLDIER_EFFECTSHADES; // pointers
  o.ubPlannedUIAPCost = buffer.readUInt8(offset++);
  offset++; // padding
  o.sPlannedTargetX = buffer.readInt16LE(offset); offset += 2;
  o.sPlannedTargetY = buffer.readInt16LE(offset); offset += 2;
  offset = readIntArray(o.sSpreadLocations, buffer, offset, 2);
  o.fDoSpread = buffer.readUInt8(offset++);
  offset++; // padding
  o.sStartGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sEndGridNo = buffer.readInt16LE(offset); offset += 2;
  o.sForcastGridno = buffer.readInt16LE(offset); offset += 2;
  o.sZLevelOverride = buffer.readInt16LE(offset); offset += 2;
  o.bMovedPriorToInterrupt = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.iEndofContractTime = buffer.readInt32LE(offset); offset += 4;
  o.iStartContractTime = buffer.readInt32LE(offset); offset += 4;
  o.iTotalContractLength = buffer.readInt32LE(offset); offset += 4;
  o.iNextActionSpecialData = buffer.readInt32LE(offset); offset += 4;
  o.ubWhatKindOfMercAmI = buffer.readUInt8(offset++);
  o.bAssignment = buffer.readInt8(offset++);
  o.bOldAssignment = buffer.readInt8(offset++);
  o.fForcedToStayAwake = Boolean(buffer.readUInt8(offset++));
  o.bTrainStat = buffer.readInt8(offset++);
  offset++; // padding
  o.sSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readInt16LE(offset); offset += 2;
  o.bSectorZ = buffer.readInt8(offset++);
  offset++; // padding
  o.iVehicleId = buffer.readInt32LE(offset); offset += 4;
  o.pMercPath = <PathSt><unknown>null; offset += 4; // pointer
  o.fHitByGasFlags = buffer.readUInt8(offset++);
  offset++; // padding
  o.usMedicalDeposit = buffer.readUInt16LE(offset); offset += 2;
  o.usLifeInsurance = buffer.readUInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.uiStartMovementTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiOptimumMovementTime = buffer.readUInt32LE(offset); offset += 4;
  o.usLastUpdateTime = buffer.readUInt32LE(offset); offset += 4;
  o.fIsSoldierMoving = Boolean(buffer.readUInt8(offset++));
  o.fIsSoldierDelayed = Boolean(buffer.readUInt8(offset++));
  o.fSoldierUpdatedFromNetwork = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.uiSoldierUpdateNumber = buffer.readUInt32LE(offset); offset += 4;
  o.ubSoldierUpdateType = buffer.readUInt8(offset++);
  offset += 3; // padding
  o.iStartOfInsuranceContract = buffer.readInt32LE(offset); offset += 4;
  o.uiLastAssignmentChangeMin = buffer.readUInt32LE(offset); offset += 4;
  o.iTotalLengthOfInsuranceContract = buffer.readInt32LE(offset); offset += 4;
  o.ubSoldierClass = buffer.readUInt8(offset++);
  o.ubAPsLostToSuppression = buffer.readUInt8(offset++);
  o.fChangingStanceDueToSuppression = Boolean(buffer.readUInt8(offset++));
  o.ubSuppressorID = buffer.readUInt8(offset++);
  o.ubDesiredSquadAssignment = buffer.readUInt8(offset++);
  o.ubNumTraversalsAllowedToMerge = buffer.readUInt8(offset++);
  o.usPendingAnimation2 = buffer.readUInt16LE(offset); offset += 2;
  o.ubCivilianGroup = buffer.readUInt8(offset++);
  offset += 3; // padding
  o.uiChangeLevelTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeHealthTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeStrengthTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeDexterityTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeAgilityTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeWisdomTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeLeadershipTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeMarksmanshipTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeExplosivesTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeMedicalTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiChangeMechanicalTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiUniqueSoldierIdValue = buffer.readUInt32LE(offset); offset += 4;
  o.bBeingAttackedCount = buffer.readInt8(offset++);
  offset = readIntArray(o.bNewItemCount, buffer, offset, 1);
  offset = readIntArray(o.bNewItemCycleCount, buffer, offset, 1);
  o.fCheckForNewlyAddedItems = Boolean(buffer.readUInt8(offset++));
  o.bEndDoorOpenCode = buffer.readInt8(offset++);
  o.ubScheduleID = buffer.readUInt8(offset++);
  o.sEndDoorOpenCodeData = buffer.readInt16LE(offset); offset += 2;
  o.NextTileCounter = buffer.readInt32LE(offset); offset += 4;
  o.fBlockedByAnotherMerc = Boolean(buffer.readUInt8(offset++));
  o.bBlockedByAnotherMercDirection = buffer.readInt8(offset++);
  o.usAttackingWeapon = buffer.readUInt16LE(offset); offset += 2;
  o.bWeaponMode = buffer.readInt8(offset++);
  o.ubTargetID = buffer.readUInt8(offset++);
  o.bAIScheduleProgress = buffer.readInt8(offset++);
  offset++; // padding
  o.sOffWorldGridNo = buffer.readInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.pAniTile = <ANITILE><unknown>null; offset += 4; // pointer
  o.bCamo = buffer.readInt8(offset++);
  offset++; // padding
  o.sAbsoluteFinalDestination = buffer.readInt16LE(offset); offset += 2;
  o.ubHiResDirection = buffer.readUInt8(offset++);
  o.ubHiResDesiredDirection = buffer.readUInt8(offset++);
  o.ubLastFootPrintSound = buffer.readUInt8(offset++);
  o.bVehicleID = buffer.readInt8(offset++);
  o.fPastXDest = Boolean(buffer.readUInt8(offset++));
  o.fPastYDest = Boolean(buffer.readUInt8(offset++));
  o.bMovementDirection = buffer.readInt8(offset++);
  offset++; // padding
  o.sOldGridNo = buffer.readInt16LE(offset); offset += 2;
  o.usDontUpdateNewGridNoOnMoveAnimChange = buffer.readUInt16LE(offset); offset += 2;
  o.sBoundingBoxWidth = buffer.readInt16LE(offset); offset += 2;
  o.sBoundingBoxHeight = buffer.readInt16LE(offset); offset += 2;
  o.sBoundingBoxOffsetX = buffer.readInt16LE(offset); offset += 2;
  o.sBoundingBoxOffsetY = buffer.readInt16LE(offset); offset += 2;
  o.uiTimeSameBattleSndDone = buffer.readUInt32LE(offset); offset += 4;
  o.bOldBattleSnd = buffer.readInt8(offset++);
  o.fReactingFromBeingShot = Boolean(buffer.readUInt8(offset++));
  o.fContractPriceHasIncreased = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.iBurstSoundID = buffer.readInt32LE(offset); offset += 4;
  o.fFixingSAMSite = Boolean(buffer.readUInt8(offset++));
  o.fFixingRobot = Boolean(buffer.readUInt8(offset++));
  o.bSlotItemTakenFrom = buffer.readInt8(offset++);
  o.fSignedAnotherContract = Boolean(buffer.readUInt8(offset++));
  o.ubAutoBandagingMedic = buffer.readUInt8(offset++);
  o.fDontChargeTurningAPs = Boolean(buffer.readUInt8(offset++));
  o.ubRobotRemoteHolderID = buffer.readUInt8(offset++);
  offset++; // padding
  o.uiTimeOfLastContractUpdate = buffer.readUInt32LE(offset); offset += 4;
  o.bTypeOfLastContract = buffer.readInt8(offset++);
  o.bTurnsCollapsed = buffer.readInt8(offset++);
  o.bSleepDrugCounter = buffer.readInt8(offset++);
  o.ubMilitiaKills = buffer.readUInt8(offset++);
  offset = readIntArray(o.bFutureDrugEffect, buffer, offset, 1);
  offset = readIntArray(o.bDrugEffectRate, buffer, offset, 1);
  offset = readIntArray(o.bDrugEffect, buffer, offset, 1);
  offset = readIntArray(o.bDrugSideEffectRate, buffer, offset, 1);
  offset = readIntArray(o.bDrugSideEffect, buffer, offset, 1);
  offset = readIntArray(o.bTimesDrugUsedSinceSleep, buffer, offset, 1);
  o.bBlindedCounter = buffer.readInt8(offset++);
  o.fMercCollapsedFlag = Boolean(buffer.readUInt8(offset++));
  o.fDoneAssignmentAndNothingToDoFlag = Boolean(buffer.readUInt8(offset++));
  o.fMercAsleep = Boolean(buffer.readUInt8(offset++));
  o.fDontChargeAPsForStanceChange = Boolean(buffer.readUInt8(offset++));
  o.ubHoursOnAssignment = buffer.readUInt8(offset++);
  o.ubMercJustFired = buffer.readUInt8(offset++);
  o.ubTurnsUntilCanSayHeardNoise = buffer.readUInt8(offset++);
  o.usQuoteSaidExtFlags = buffer.readUInt16LE(offset); offset += 2;
  o.sContPathLocation = buffer.readUInt16LE(offset); offset += 2;
  o.bGoodContPath = Boolean(buffer.readUInt8(offset++));
  o.ubPendingActionInterrupted = buffer.readUInt8(offset++);
  o.bNoiseLevel = buffer.readInt8(offset++);
  o.bRegenerationCounter = buffer.readInt8(offset++);
  o.bRegenBoostersUsedToday = buffer.readInt8(offset++);
  o.bNumPelletsHitBy = buffer.readInt8(offset++);
  o.sSkillCheckGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubLastEnemyCycledID = buffer.readUInt8(offset++);
  o.ubPrevSectorID = buffer.readUInt8(offset++);
  o.ubNumTilesMovesSinceLastForget = buffer.readUInt8(offset++);
  o.bTurningIncrement = buffer.readInt8(offset++);
  o.uiBattleSoundID = buffer.readUInt32LE(offset); offset += 4;
  o.fSoldierWasMoving = Boolean(buffer.readUInt8(offset++));
  o.fSayAmmoQuotePending = Boolean(buffer.readUInt8(offset++));
  o.usValueGoneUp = buffer.readUInt16LE(offset); offset += 2;
  o.ubNumLocateCycles = buffer.readUInt8(offset++);
  o.ubDelayedMovementFlags = buffer.readUInt8(offset++);
  o.fMuzzleFlash = Boolean(buffer.readUInt8(offset++));
  o.ubCTGTTargetID = buffer.readUInt8(offset++);
  o.PanelAnimateCounter = buffer.readInt32LE(offset); offset += 4;
  o.uiMercChecksum = buffer.readUInt32LE(offset); offset += 4;
  o.bCurrentCivQuote = buffer.readInt8(offset++);
  o.bCurrentCivQuoteDelta = buffer.readInt8(offset++);
  o.ubMiscSoldierFlags = buffer.readUInt8(offset++);
  o.ubReasonCantFinishMove = buffer.readUInt8(offset++);
  o.sLocationOfFadeStart = buffer.readInt16LE(offset); offset += 2;
  o.bUseExitGridForReentryDirection = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.uiTimeSinceLastSpoke = buffer.readUInt32LE(offset); offset += 4;
  o.ubContractRenewalQuoteCode = buffer.readUInt8(offset++);
  offset++; // padding
  o.sPreTraversalGridNo = buffer.readInt16LE(offset); offset += 2;
  o.uiXRayActivatedTime = buffer.readUInt32LE(offset); offset += 4;
  o.bTurningFromUI = Boolean(buffer.readUInt8(offset++));
  o.bPendingActionData5 = buffer.readInt8(offset++);
  o.bDelayedStrategicMoraleMod = buffer.readInt8(offset++);
  o.ubDoorOpeningNoise = buffer.readUInt8(offset++);
  o.pGroup = <GROUP><unknown>null; offset += 4; // pointer
  o.ubLeaveHistoryCode = buffer.readUInt8(offset++);
  o.fDontUnsetLastTargetFromTurn = Boolean(buffer.readUInt8(offset++));
  o.bOverrideMoveSpeed = buffer.readInt8(offset++);
  o.fUseMoverrideMoveSpeed = Boolean(buffer.readUInt8(offset++));
  o.uiTimeSoldierWillArrive = buffer.readUInt32LE(offset); offset += 4;
  o.fDieSoundUsed = Boolean(buffer.readUInt8(offset++));
  o.fUseLandingZoneForArrival = Boolean(buffer.readUInt8(offset++));
  o.fFallClockwise = Boolean(buffer.readUInt8(offset++));
  o.bVehicleUnderRepairID = buffer.readInt8(offset++);
  o.iTimeCanSignElsewhere = buffer.readInt32LE(offset); offset += 4;
  o.bHospitalPriceModifier = buffer.readInt8(offset++);
  offset = readIntArray(o.bFillerBytes, buffer, offset, 1);
  o.uiStartTimeOfInsuranceContract = buffer.readUInt32LE(offset); offset += 4;
  o.fRTInNonintAnim = Boolean(buffer.readUInt8(offset++));
  o.fDoingExternalDeath = Boolean(buffer.readUInt8(offset++));
  o.bCorpseQuoteTolerance = buffer.readInt8(offset++);
  o.bYetAnotherPaddingSpace = buffer.readInt8(offset++);
  o.iPositionSndID = buffer.readInt32LE(offset); offset += 4;
  o.iTuringSoundID = buffer.readInt32LE(offset); offset += 4;
  o.ubLastDamageReason = buffer.readUInt8(offset++);
  o.fComplainedThatTired = Boolean(buffer.readUInt8(offset++));
  offset = readIntArray(o.sLastTwoLocations, buffer, offset, 2);
  o.bFillerDude = buffer.readInt16LE(offset); offset += 2;
  o.uiTimeSinceLastBleedGrunt = buffer.readInt32LE(offset); offset += 4;
  o.ubNextToPreviousAttackerID = buffer.readUInt8(offset++);
  offset = readUIntArray(o.bFiller, buffer, offset, 1);
  return offset;
}

export function writeSoldierType(o: SOLDIERTYPE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubID, offset);
  offset = buffer.writeUInt8(o.bReserved1, offset);
  offset = buffer.writeUInt8(o.ubBodyType, offset);
  offset = buffer.writeInt8(o.bActionPoints, offset);
  offset = buffer.writeInt8(o.bInitialActionPoints, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiStatusFlags, offset);
  offset = writeObjectArray(o.inv, buffer, offset, writeObjectType);
  offset = writePadding(buffer, offset, 4); // pTempObject (pointer)
  offset = writePadding(buffer, offset, 4); // pKeyRing (pointer)
  offset = buffer.writeInt8(o.bOldLife, offset);
  offset = buffer.writeUInt8(Number(o.bInSector), offset);
  offset = buffer.writeInt8(o.bFlashPortraitFrame, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sFractLife, offset);
  offset = buffer.writeInt8(o.bBleeding, offset);
  offset = buffer.writeInt8(o.bBreath, offset);
  offset = buffer.writeInt8(o.bBreathMax, offset);
  offset = buffer.writeUInt8(Number(o.bStealthMode), offset);
  offset = buffer.writeInt16LE(o.sBreathRed, offset);
  offset = buffer.writeUInt8(o.fDelayedMovement, offset);
  offset = buffer.writeUInt8(Number(o.fReloading), offset);
  offset = buffer.writeUInt8(o.ubWaitActionToDo, offset);
  offset = buffer.writeUInt8(Number(o.fPauseAim), offset);
  offset = buffer.writeInt8(o.ubInsertionDirection, offset);
  offset = buffer.writeInt8(o.bGunType, offset);
  offset = buffer.writeUInt8(o.ubOppNum, offset);
  offset = buffer.writeInt8(o.bLastRenderVisibleValue, offset);
  offset = buffer.writeUInt8(Number(o.fInMissionExitNode), offset);
  offset = buffer.writeUInt8(o.ubAttackingHand, offset);
  offset = buffer.writeInt8(o.bScientific, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sWeightCarriedAtTurnStart, offset);
  offset = writeStringNL(o.name, buffer, offset, 20, 'utf16le');
  offset = buffer.writeInt8(o.bVisible, offset);
  offset = buffer.writeUInt8(Number(o.bActive), offset);
  offset = buffer.writeInt8(o.bTeam, offset);
  offset = buffer.writeUInt8(o.ubGroupID, offset);
  offset = buffer.writeUInt8(Number(o.fBetweenSectors), offset);
  offset = buffer.writeUInt8(o.ubMovementNoiseHeard, offset);
  offset = buffer.writeFloatLE(o.dXPos, offset);
  offset = buffer.writeFloatLE(o.dYPos, offset);
  offset = buffer.writeFloatLE(o.dOldXPos, offset);
  offset = buffer.writeFloatLE(o.dOldYPos, offset);
  offset = buffer.writeInt16LE(o.sInitialGridNo, offset);
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeInt8(o.bDirection, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sHeightAdjustment, offset);
  offset = buffer.writeInt16LE(o.sDesiredHeight, offset);
  offset = buffer.writeInt16LE(o.sTempNewGridNo, offset);
  offset = buffer.writeInt16LE(o.sRoomNo, offset);
  offset = buffer.writeInt8(o.bOverTerrainType, offset);
  offset = buffer.writeInt8(o.bOldOverTerrainType, offset);
  offset = buffer.writeUInt8(Number(o.bCollapsed), offset);
  offset = buffer.writeUInt8(Number(o.bBreathCollapsed), offset);
  offset = buffer.writeUInt8(o.ubDesiredHeight, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usPendingAnimation, offset);
  offset = buffer.writeUInt8(o.ubPendingStanceChange, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usAnimState, offset);
  offset = buffer.writeUInt8(Number(o.fNoAPToFinishMove), offset);
  offset = buffer.writeUInt8(Number(o.fPausedMove), offset);
  offset = buffer.writeUInt8(Number(o.fUIdeadMerc), offset);
  offset = buffer.writeUInt8(Number(o.fUInewMerc), offset);
  offset = buffer.writeUInt8(Number(o.fUICloseMerc), offset);
  offset = buffer.writeUInt8(Number(o.fUIFirstTimeNOAP), offset);
  offset = buffer.writeUInt8(Number(o.fUIFirstTimeUNCON), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeInt32LE(o.UpdateCounter, offset);
  offset = buffer.writeInt32LE(o.DamageCounter, offset);
  offset = buffer.writeInt32LE(o.ReloadCounter, offset);
  offset = buffer.writeInt32LE(o.FlashSelCounter, offset);
  offset = buffer.writeInt32LE(o.AICounter, offset);
  offset = buffer.writeInt32LE(o.FadeCounter, offset);
  offset = buffer.writeUInt8(o.ubSkillTrait1, offset);
  offset = buffer.writeUInt8(o.ubSkillTrait2, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeUInt32LE(o.uiAIDelay, offset);
  offset = buffer.writeInt8(o.bDexterity, offset);
  offset = buffer.writeInt8(o.bWisdom, offset);
  offset = buffer.writeInt16LE(o.sReloadDelay, offset);
  offset = buffer.writeUInt8(o.ubAttackerID, offset);
  offset = buffer.writeUInt8(o.ubPreviousAttackerID, offset);
  offset = buffer.writeUInt8(Number(o.fTurnInProgress), offset);
  offset = buffer.writeUInt8(Number(o.fIntendedTarget), offset);
  offset = buffer.writeUInt8(Number(o.fPauseAllAnimation), offset);
  offset = buffer.writeInt8(o.bExpLevel, offset);
  offset = buffer.writeInt16LE(o.sInsertionGridNo, offset);
  offset = buffer.writeUInt8(o.fContinueMoveAfterStanceChange, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = writeAnimationSurfaceCacheType(o.AnimCache, buffer, offset);
  offset = buffer.writeInt8(o.bLife, offset);
  offset = buffer.writeUInt8(o.bSide, offset);
  offset = buffer.writeUInt8(o.bViewRange, offset);
  offset = buffer.writeInt8(o.bNewOppCnt, offset);
  offset = buffer.writeInt8(o.bService, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usAniCode, offset);
  offset = buffer.writeUInt16LE(o.usAniFrame, offset);
  offset = buffer.writeInt16LE(o.sAniDelay, offset);
  offset = buffer.writeInt8(o.bAgility, offset);
  offset = buffer.writeUInt8(o.ubDelayedMovementCauseMerc, offset);
  offset = buffer.writeInt16LE(o.sDelayedMovementCauseGridNo, offset);
  offset = buffer.writeInt16LE(o.sReservedMovementGridNo, offset);
  offset = buffer.writeInt8(o.bStrength, offset);
  offset = buffer.writeUInt8(Number(o.fHoldAttackerUntilDone), offset);
  offset = buffer.writeInt16LE(o.sTargetGridNo, offset);
  offset = buffer.writeInt8(o.bTargetLevel, offset);
  offset = buffer.writeInt8(o.bTargetCubeLevel, offset);
  offset = buffer.writeInt16LE(o.sLastTarget, offset);
  offset = buffer.writeInt8(o.bTilesMoved, offset);
  offset = buffer.writeInt8(o.bLeadership, offset);
  offset = buffer.writeFloatLE(o.dNextBleed, offset);
  offset = buffer.writeUInt8(Number(o.fWarnedAboutBleeding), offset);
  offset = buffer.writeUInt8(Number(o.fDyingComment), offset);
  offset = buffer.writeUInt8(o.ubTilesMovedPerRTBreathUpdate, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usLastMovementAnimPerRTBreathUpdate, offset);
  offset = buffer.writeUInt8(Number(o.fTurningToShoot), offset);
  offset = buffer.writeUInt8(Number(o.fTurningToFall), offset);
  offset = buffer.writeUInt8(Number(o.fTurningUntilDone), offset);
  offset = buffer.writeUInt8(o.fGettingHit, offset);
  offset = buffer.writeUInt8(Number(o.fInNonintAnim), offset);
  offset = buffer.writeUInt8(Number(o.fFlashLocator), offset);
  offset = buffer.writeInt16LE(o.sLocatorFrame, offset);
  offset = buffer.writeUInt8(Number(o.fShowLocator), offset);
  offset = buffer.writeUInt8(o.fFlashPortrait, offset);
  offset = buffer.writeInt8(o.bMechanical, offset);
  offset = buffer.writeInt8(o.bLifeMax, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.iFaceIndex, offset);
  offset = writeStringNL(o.HeadPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.PantsPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.VestPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.SkinPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.MiscPal, buffer, offset, 30, 'ascii');
  offset = writeUIntArray(o.usFrontArcFullTileList, buffer, offset, 2);
  offset = writeIntArray(o.usFrontArcFullTileGridNos, buffer, offset, 2);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // p8BPPPalette (pointer)
  offset = writePadding(buffer, offset, 4); // p16BPPPalette (pointer)
  offset = writePadding(buffer, offset, 4 * NUM_SOLDIER_SHADES); // pShades (pointers)
  offset = writePadding(buffer, offset, 4 * 20); // pGlowShades (pointers)
  offset = writePadding(buffer, offset, 4); // pCurrentShade (pointer)
  offset = buffer.writeInt8(o.bMedical, offset);
  offset = buffer.writeUInt8(o.fBeginFade, offset);
  offset = buffer.writeUInt8(o.ubFadeLevel, offset);
  offset = buffer.writeUInt8(o.ubServiceCount, offset);
  offset = buffer.writeUInt8(o.ubServicePartner, offset);
  offset = buffer.writeInt8(o.bMarksmanship, offset);
  offset = buffer.writeInt8(o.bExplosive, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writePadding(buffer, offset, 4); // pThrowParams (pointer)
  offset = buffer.writeUInt8(o.fTurningFromPronePosition, offset);
  offset = buffer.writeUInt8(Number(o.bReverse), offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pLevelNode (pointer)
  offset = writePadding(buffer, offset, 4); // pExternShadowLevelNode (pointer)
  offset = writePadding(buffer, offset, 4); // pRoofUILevelNode (pointer)
  offset = buffer.writeInt8(o.bDesiredDirection, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sDestXPos, offset);
  offset = buffer.writeInt16LE(o.sDestYPos, offset);
  offset = buffer.writeInt16LE(o.sDesiredDest, offset);
  offset = buffer.writeInt16LE(o.sDestination, offset);
  offset = buffer.writeInt16LE(o.sFinalDestination, offset);
  offset = buffer.writeInt8(o.bLevel, offset);
  offset = buffer.writeInt8(o.bStopped, offset);
  offset = buffer.writeUInt8(Number(o.bNeedToLook), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writeUIntArray(o.usPathingData, buffer, offset, 2);
  offset = buffer.writeUInt16LE(o.usPathDataSize, offset);
  offset = buffer.writeUInt16LE(o.usPathIndex, offset);
  offset = buffer.writeInt16LE(o.sBlackList, offset);
  offset = buffer.writeInt8(o.bAimTime, offset);
  offset = buffer.writeInt8(o.bShownAimTime, offset);
  offset = buffer.writeUInt8(Number(o.bPathStored), offset);
  offset = buffer.writeInt8(o.bHasKeys, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pBackGround (pointer)
  offset = writePadding(buffer, offset, 4); // pZBackground (pointer)
  offset = buffer.writeUInt16LE(o.usUnblitX, offset);
  offset = buffer.writeUInt16LE(o.usUnblitY, offset);
  offset = buffer.writeUInt16LE(o.usUnblitWidth, offset);
  offset = buffer.writeUInt16LE(o.usUnblitHeight, offset);
  offset = buffer.writeUInt8(o.ubStrategicInsertionCode, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usStrategicInsertionData, offset);
  offset = buffer.writeInt32LE(o.iLight, offset);
  offset = buffer.writeInt32LE(o.iMuzFlash, offset);
  offset = buffer.writeInt8(o.bMuzFlashCount, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sX, offset);
  offset = buffer.writeInt16LE(o.sY, offset);
  offset = buffer.writeUInt16LE(o.usOldAniState, offset);
  offset = buffer.writeInt16LE(o.sOldAniCode, offset);
  offset = buffer.writeInt8(o.bBulletsLeft, offset);
  offset = buffer.writeUInt8(o.ubSuppressionPoints, offset);
  offset = buffer.writeUInt32LE(o.uiTimeOfLastRandomAction, offset);
  offset = buffer.writeInt16LE(o.usLastRandomAnim, offset);
  offset = writeIntArray(o.bOppList, buffer, offset, 1);
  offset = buffer.writeInt8(o.bLastAction, offset);
  offset = buffer.writeInt8(o.bAction, offset);
  offset = buffer.writeUInt16LE(o.usActionData, offset);
  offset = buffer.writeInt8(o.bNextAction, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usNextActionData, offset);
  offset = buffer.writeUInt8(Number(o.bActionInProgress), offset);
  offset = buffer.writeInt8(o.bAlertStatus, offset);
  offset = buffer.writeInt8(o.bOppCnt, offset);
  offset = buffer.writeUInt8(Number(o.bNeutral), offset);
  offset = buffer.writeInt8(o.bNewSituation, offset);
  offset = buffer.writeInt8(o.bNextTargetLevel, offset);
  offset = buffer.writeInt8(o.bOrders, offset);
  offset = buffer.writeInt8(o.bAttitude, offset);
  offset = buffer.writeInt8(o.bUnderFire, offset);
  offset = buffer.writeInt8(o.bShock, offset);
  offset = buffer.writeUInt8(Number(o.bUnderEscort), offset);
  offset = buffer.writeInt8(o.bBypassToGreen, offset);
  offset = buffer.writeUInt8(o.ubLastMercToRadio, offset);
  offset = buffer.writeInt8(o.bDominantDir, offset);
  offset = buffer.writeInt8(o.bPatrolCnt, offset);
  offset = buffer.writeInt8(o.bNextPatrolPnt, offset);
  offset = writeIntArray(o.usPatrolGrid, buffer, offset, 2);
  offset = buffer.writeInt16LE(o.sNoiseGridno, offset);
  offset = buffer.writeUInt8(o.ubNoiseVolume, offset);
  offset = buffer.writeUInt8(Number(o.bLastAttackHit), offset);
  offset = buffer.writeUInt8(o.ubXRayedBy, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeFloatLE(o.dHeightAdjustment, offset);
  offset = buffer.writeInt8(o.bMorale, offset);
  offset = buffer.writeInt8(o.bTeamMoraleMod, offset);
  offset = buffer.writeInt8(o.bTacticalMoraleMod, offset);
  offset = buffer.writeInt8(o.bStrategicMoraleMod, offset);
  offset = buffer.writeInt8(o.bAIMorale, offset);
  offset = buffer.writeUInt8(o.ubPendingAction, offset);
  offset = buffer.writeUInt8(o.ubPendingActionAnimCount, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiPendingActionData1, offset);
  offset = buffer.writeInt16LE(o.sPendingActionData2, offset);
  offset = buffer.writeInt8(o.bPendingActionData3, offset);
  offset = buffer.writeInt8(o.ubDoorHandleCode, offset);
  offset = buffer.writeUInt32LE(o.uiPendingActionData4, offset);
  offset = buffer.writeInt8(o.bInterruptDuelPts, offset);
  offset = buffer.writeUInt8(Number(o.bPassedLastInterrupt), offset);
  offset = buffer.writeInt8(o.bIntStartAPs, offset);
  offset = buffer.writeUInt8(Number(o.bMoved), offset);
  offset = buffer.writeUInt8(Number(o.bHunting), offset);
  offset = buffer.writeUInt8(o.ubLastCall, offset);
  offset = buffer.writeUInt8(o.ubCaller, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sCallerGridNo, offset);
  offset = buffer.writeUInt8(o.bCallPriority, offset);
  offset = buffer.writeUInt8(Number(o.bCallActedUpon), offset);
  offset = buffer.writeUInt8(Number(o.bFrenzied), offset);
  offset = buffer.writeInt8(o.bNormalSmell, offset);
  offset = buffer.writeInt8(o.bMonsterSmell, offset);
  offset = buffer.writeInt8(o.bMobility, offset);
  offset = buffer.writeInt8(o.bRTPCombat, offset);
  offset = buffer.writeInt8(o.fAIFlags, offset);
  offset = buffer.writeUInt8(Number(o.fDontChargeReadyAPs), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usAnimSurface, offset);
  offset = buffer.writeUInt16LE(o.sZLevel, offset);
  offset = buffer.writeUInt8(Number(o.fPrevInWater), offset);
  offset = buffer.writeUInt8(Number(o.fGoBackToAimAfterHit), offset);
  offset = buffer.writeInt16LE(o.sWalkToAttackGridNo, offset);
  offset = buffer.writeInt16LE(o.sWalkToAttackWalkToCost, offset);
  offset = buffer.writeUInt8(Number(o.fForceRenderColor), offset);
  offset = buffer.writeUInt8(Number(o.fForceNoRenderPaletteCycle), offset);
  offset = buffer.writeInt16LE(o.sLocatorOffX, offset);
  offset = buffer.writeInt16LE(o.sLocatorOffY, offset);
  offset = buffer.writeUInt8(Number(o.fStopPendingNextTile), offset);
  offset = buffer.writeUInt8(Number(o.fForceShade), offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pForcedShade (pointer)
  offset = buffer.writeInt8(o.bDisplayDamageCount, offset);
  offset = buffer.writeUInt8(Number(o.fDisplayDamage), offset);
  offset = buffer.writeInt16LE(o.sDamage, offset);
  offset = buffer.writeInt16LE(o.sDamageX, offset);
  offset = buffer.writeInt16LE(o.sDamageY, offset);
  offset = buffer.writeInt8(o.bDamageDir, offset);
  offset = buffer.writeInt8(o.bDoBurst, offset);
  offset = buffer.writeInt16LE(o.usUIMovementMode, offset);
  offset = buffer.writeInt8(o.bUIInterfaceLevel, offset);
  offset = buffer.writeUInt8(Number(o.fUIMovementFast), offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.BlinkSelCounter, offset);
  offset = buffer.writeInt32LE(o.PortraitFlashCounter, offset);
  offset = buffer.writeUInt8(Number(o.fDeadSoundPlayed), offset);
  offset = buffer.writeUInt8(o.ubProfile, offset);
  offset = buffer.writeUInt8(o.ubQuoteRecord, offset);
  offset = buffer.writeUInt8(o.ubQuoteActionID, offset);
  offset = buffer.writeUInt8(o.ubBattleSoundID, offset);
  offset = buffer.writeUInt8(Number(o.fClosePanel), offset);
  offset = buffer.writeUInt8(Number(o.fClosePanelToDie), offset);
  offset = buffer.writeUInt8(o.ubClosePanelFrame, offset);
  offset = buffer.writeUInt8(Number(o.fDeadPanel), offset);
  offset = buffer.writeUInt8(o.ubDeadPanelFrame, offset);
  offset = buffer.writeUInt8(Number(o.fOpenPanel), offset);
  offset = buffer.writeInt8(o.bOpenPanelFrame, offset);
  offset = buffer.writeInt16LE(o.sPanelFaceX, offset);
  offset = buffer.writeInt16LE(o.sPanelFaceY, offset);
  offset = buffer.writeInt8(o.bNumHitsThisTurn, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usQuoteSaidFlags, offset);
  offset = buffer.writeUInt8(Number(o.fCloseCall), offset);
  offset = buffer.writeInt8(o.bLastSkillCheck, offset);
  offset = buffer.writeInt8(o.ubSkillCheckAttempts, offset);
  offset = buffer.writeInt8(o.bVocalVolume, offset);
  offset = buffer.writeInt8(o.bStartFallDir, offset);
  offset = buffer.writeUInt8(Number(o.fTryingToFall), offset);
  offset = buffer.writeUInt8(o.ubPendingDirection, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiAnimSubFlags, offset);
  offset = buffer.writeUInt8(o.bAimShotLocation, offset);
  offset = buffer.writeUInt8(o.ubHitLocation, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4 * NUM_SOLDIER_EFFECTSHADES); // pEffectShades (pointers)
  offset = buffer.writeUInt8(o.ubPlannedUIAPCost, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sPlannedTargetX, offset);
  offset = buffer.writeInt16LE(o.sPlannedTargetY, offset);
  offset = writeIntArray(o.sSpreadLocations, buffer, offset, 2);
  offset = buffer.writeUInt8(o.fDoSpread, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sStartGridNo, offset);
  offset = buffer.writeInt16LE(o.sEndGridNo, offset);
  offset = buffer.writeInt16LE(o.sForcastGridno, offset);
  offset = buffer.writeInt16LE(o.sZLevelOverride, offset);
  offset = buffer.writeUInt8(Number(o.bMovedPriorToInterrupt), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeInt32LE(o.iEndofContractTime, offset);
  offset = buffer.writeInt32LE(o.iStartContractTime, offset);
  offset = buffer.writeInt32LE(o.iTotalContractLength, offset);
  offset = buffer.writeInt32LE(o.iNextActionSpecialData, offset);
  offset = buffer.writeUInt8(o.ubWhatKindOfMercAmI, offset);
  offset = buffer.writeInt8(o.bAssignment, offset);
  offset = buffer.writeInt8(o.bOldAssignment, offset);
  offset = buffer.writeUInt8(Number(o.fForcedToStayAwake), offset);
  offset = buffer.writeInt8(o.bTrainStat, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sSectorX, offset);
  offset = buffer.writeInt16LE(o.sSectorY, offset);
  offset = buffer.writeInt8(o.bSectorZ, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt32LE(o.iVehicleId, offset);
  offset = writePadding(buffer, offset, 4); // pMercPath (pointer)
  offset = buffer.writeUInt8(o.fHitByGasFlags, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usMedicalDeposit, offset);
  offset = buffer.writeUInt16LE(o.usLifeInsurance, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeUInt32LE(o.uiStartMovementTime, offset);
  offset = buffer.writeUInt32LE(o.uiOptimumMovementTime, offset);
  offset = buffer.writeUInt32LE(o.usLastUpdateTime, offset);
  offset = buffer.writeUInt8(Number(o.fIsSoldierMoving), offset);
  offset = buffer.writeUInt8(Number(o.fIsSoldierDelayed), offset);
  offset = buffer.writeUInt8(Number(o.fSoldierUpdatedFromNetwork), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiSoldierUpdateNumber, offset);
  offset = buffer.writeUInt8(o.ubSoldierUpdateType, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeInt32LE(o.iStartOfInsuranceContract, offset);
  offset = buffer.writeUInt32LE(o.uiLastAssignmentChangeMin, offset);
  offset = buffer.writeInt32LE(o.iTotalLengthOfInsuranceContract, offset);
  offset = buffer.writeUInt8(o.ubSoldierClass, offset);
  offset = buffer.writeUInt8(o.ubAPsLostToSuppression, offset);
  offset = buffer.writeUInt8(Number(o.fChangingStanceDueToSuppression), offset);
  offset = buffer.writeUInt8(o.ubSuppressorID, offset);
  offset = buffer.writeUInt8(o.ubDesiredSquadAssignment, offset);
  offset = buffer.writeUInt8(o.ubNumTraversalsAllowedToMerge, offset);
  offset = buffer.writeUInt16LE(o.usPendingAnimation2, offset);
  offset = buffer.writeUInt8(o.ubCivilianGroup, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiChangeLevelTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeHealthTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeStrengthTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeDexterityTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeAgilityTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeWisdomTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeLeadershipTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeMarksmanshipTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeExplosivesTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeMedicalTime, offset);
  offset = buffer.writeUInt32LE(o.uiChangeMechanicalTime, offset);
  offset = buffer.writeUInt32LE(o.uiUniqueSoldierIdValue, offset);
  offset = buffer.writeInt8(o.bBeingAttackedCount, offset);
  offset = writeIntArray(o.bNewItemCount, buffer, offset, 1);
  offset = writeIntArray(o.bNewItemCycleCount, buffer, offset, 1);
  offset = buffer.writeUInt8(Number(o.fCheckForNewlyAddedItems), offset);
  offset = buffer.writeInt8(o.bEndDoorOpenCode, offset);
  offset = buffer.writeUInt8(o.ubScheduleID, offset);
  offset = buffer.writeInt16LE(o.sEndDoorOpenCodeData, offset);
  offset = buffer.writeInt32LE(o.NextTileCounter, offset);
  offset = buffer.writeUInt8(Number(o.fBlockedByAnotherMerc), offset);
  offset = buffer.writeInt8(o.bBlockedByAnotherMercDirection, offset);
  offset = buffer.writeUInt16LE(o.usAttackingWeapon, offset);
  offset = buffer.writeInt8(o.bWeaponMode, offset);
  offset = buffer.writeUInt8(o.ubTargetID, offset);
  offset = buffer.writeInt8(o.bAIScheduleProgress, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sOffWorldGridNo, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pAniTile (pointer)
  offset = buffer.writeInt8(o.bCamo, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sAbsoluteFinalDestination, offset);
  offset = buffer.writeUInt8(o.ubHiResDirection, offset);
  offset = buffer.writeUInt8(o.ubHiResDesiredDirection, offset);
  offset = buffer.writeUInt8(o.ubLastFootPrintSound, offset);
  offset = buffer.writeInt8(o.bVehicleID, offset);
  offset = buffer.writeUInt8(Number(o.fPastXDest), offset);
  offset = buffer.writeUInt8(Number(o.fPastYDest), offset);
  offset = buffer.writeInt8(o.bMovementDirection, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sOldGridNo, offset);
  offset = buffer.writeUInt16LE(o.usDontUpdateNewGridNoOnMoveAnimChange, offset);
  offset = buffer.writeInt16LE(o.sBoundingBoxWidth, offset);
  offset = buffer.writeInt16LE(o.sBoundingBoxHeight, offset);
  offset = buffer.writeInt16LE(o.sBoundingBoxOffsetX, offset);
  offset = buffer.writeInt16LE(o.sBoundingBoxOffsetY, offset);
  offset = buffer.writeUInt32LE(o.uiTimeSameBattleSndDone, offset);
  offset = buffer.writeInt8(o.bOldBattleSnd, offset);
  offset = buffer.writeUInt8(Number(o.fReactingFromBeingShot), offset);
  offset = buffer.writeUInt8(Number(o.fContractPriceHasIncreased), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt32LE(o.iBurstSoundID, offset);
  offset = buffer.writeUInt8(Number(o.fFixingSAMSite), offset);
  offset = buffer.writeUInt8(Number(o.fFixingRobot), offset);
  offset = buffer.writeInt8(o.bSlotItemTakenFrom, offset);
  offset = buffer.writeUInt8(Number(o.fSignedAnotherContract), offset);
  offset = buffer.writeUInt8(o.ubAutoBandagingMedic, offset);
  offset = buffer.writeUInt8(Number(o.fDontChargeTurningAPs), offset);
  offset = buffer.writeUInt8(o.ubRobotRemoteHolderID, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiTimeOfLastContractUpdate, offset);
  offset = buffer.writeInt8(o.bTypeOfLastContract, offset);
  offset = buffer.writeInt8(o.bTurnsCollapsed, offset);
  offset = buffer.writeInt8(o.bSleepDrugCounter, offset);
  offset = buffer.writeUInt8(o.ubMilitiaKills, offset);
  offset = writeIntArray(o.bFutureDrugEffect, buffer, offset, 1);
  offset = writeIntArray(o.bDrugEffectRate, buffer, offset, 1);
  offset = writeIntArray(o.bDrugEffect, buffer, offset, 1);
  offset = writeIntArray(o.bDrugSideEffectRate, buffer, offset, 1);
  offset = writeIntArray(o.bDrugSideEffect, buffer, offset, 1);
  offset = writeIntArray(o.bTimesDrugUsedSinceSleep, buffer, offset, 1);
  offset = buffer.writeInt8(o.bBlindedCounter, offset);
  offset = buffer.writeUInt8(Number(o.fMercCollapsedFlag), offset);
  offset = buffer.writeUInt8(Number(o.fDoneAssignmentAndNothingToDoFlag), offset);
  offset = buffer.writeUInt8(Number(o.fMercAsleep), offset);
  offset = buffer.writeUInt8(Number(o.fDontChargeAPsForStanceChange), offset);
  offset = buffer.writeUInt8(o.ubHoursOnAssignment, offset);
  offset = buffer.writeUInt8(o.ubMercJustFired, offset);
  offset = buffer.writeUInt8(o.ubTurnsUntilCanSayHeardNoise, offset);
  offset = buffer.writeUInt16LE(o.usQuoteSaidExtFlags, offset);
  offset = buffer.writeUInt16LE(o.sContPathLocation, offset);
  offset = buffer.writeUInt8(Number(o.bGoodContPath), offset);
  offset = buffer.writeUInt8(o.ubPendingActionInterrupted, offset);
  offset = buffer.writeInt8(o.bNoiseLevel, offset);
  offset = buffer.writeInt8(o.bRegenerationCounter, offset);
  offset = buffer.writeInt8(o.bRegenBoostersUsedToday, offset);
  offset = buffer.writeInt8(o.bNumPelletsHitBy, offset);
  offset = buffer.writeInt16LE(o.sSkillCheckGridNo, offset);
  offset = buffer.writeUInt8(o.ubLastEnemyCycledID, offset);
  offset = buffer.writeUInt8(o.ubPrevSectorID, offset);
  offset = buffer.writeUInt8(o.ubNumTilesMovesSinceLastForget, offset);
  offset = buffer.writeInt8(o.bTurningIncrement, offset);
  offset = buffer.writeUInt32LE(o.uiBattleSoundID, offset);
  offset = buffer.writeUInt8(Number(o.fSoldierWasMoving), offset);
  offset = buffer.writeUInt8(Number(o.fSayAmmoQuotePending), offset);
  offset = buffer.writeUInt16LE(o.usValueGoneUp, offset);
  offset = buffer.writeUInt8(o.ubNumLocateCycles, offset);
  offset = buffer.writeUInt8(o.ubDelayedMovementFlags, offset);
  offset = buffer.writeUInt8(Number(o.fMuzzleFlash), offset);
  offset = buffer.writeUInt8(o.ubCTGTTargetID, offset);
  offset = buffer.writeInt32LE(o.PanelAnimateCounter, offset);
  offset = buffer.writeUInt32LE(o.uiMercChecksum, offset);
  offset = buffer.writeInt8(o.bCurrentCivQuote, offset);
  offset = buffer.writeInt8(o.bCurrentCivQuoteDelta, offset);
  offset = buffer.writeUInt8(o.ubMiscSoldierFlags, offset);
  offset = buffer.writeUInt8(o.ubReasonCantFinishMove, offset);
  offset = buffer.writeInt16LE(o.sLocationOfFadeStart, offset);
  offset = buffer.writeUInt8(Number(o.bUseExitGridForReentryDirection), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiTimeSinceLastSpoke, offset);
  offset = buffer.writeUInt8(o.ubContractRenewalQuoteCode, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sPreTraversalGridNo, offset);
  offset = buffer.writeUInt32LE(o.uiXRayActivatedTime, offset);
  offset = buffer.writeUInt8(Number(o.bTurningFromUI), offset);
  offset = buffer.writeInt8(o.bPendingActionData5, offset);
  offset = buffer.writeInt8(o.bDelayedStrategicMoraleMod, offset);
  offset = buffer.writeUInt8(o.ubDoorOpeningNoise, offset);
  offset = writePadding(buffer, offset, 4); // pGroup (pointer)
  offset = buffer.writeUInt8(o.ubLeaveHistoryCode, offset);
  offset = buffer.writeUInt8(Number(o.fDontUnsetLastTargetFromTurn), offset);
  offset = buffer.writeInt8(o.bOverrideMoveSpeed, offset);
  offset = buffer.writeUInt8(Number(o.fUseMoverrideMoveSpeed), offset);
  offset = buffer.writeUInt32LE(o.uiTimeSoldierWillArrive, offset);
  offset = buffer.writeUInt8(Number(o.fDieSoundUsed), offset);
  offset = buffer.writeUInt8(Number(o.fUseLandingZoneForArrival), offset);
  offset = buffer.writeUInt8(Number(o.fFallClockwise), offset);
  offset = buffer.writeInt8(o.bVehicleUnderRepairID, offset);
  offset = buffer.writeInt32LE(o.iTimeCanSignElsewhere, offset);
  offset = buffer.writeInt8(o.bHospitalPriceModifier, offset);
  offset = writeIntArray(o.bFillerBytes, buffer, offset, 1);
  offset = buffer.writeUInt32LE(o.uiStartTimeOfInsuranceContract, offset);
  offset = buffer.writeUInt8(Number(o.fRTInNonintAnim), offset);
  offset = buffer.writeUInt8(Number(o.fDoingExternalDeath), offset);
  offset = buffer.writeInt8(o.bCorpseQuoteTolerance, offset);
  offset = buffer.writeInt8(o.bYetAnotherPaddingSpace, offset);
  offset = buffer.writeInt32LE(o.iPositionSndID, offset);
  offset = buffer.writeInt32LE(o.iTuringSoundID, offset);
  offset = buffer.writeUInt8(o.ubLastDamageReason, offset);
  offset = buffer.writeUInt8(Number(o.fComplainedThatTired), offset);
  offset = writeIntArray(o.sLastTwoLocations, buffer, offset, 2);
  offset = buffer.writeInt16LE(o.bFillerDude, offset);
  offset = buffer.writeInt32LE(o.uiTimeSinceLastBleedGrunt, offset);
  offset = buffer.writeUInt8(o.ubNextToPreviousAttackerID, offset);
  offset = writeUIntArray(o.bFiller, buffer, offset, 1);
  return offset;
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

export function createAnimationProfileTile(): ANIM_PROF_TILE {
  return {
    usTileFlags: 0,
    bTileX: 0,
    bTileY: 0,
  };
}

export interface ANIM_PROF_DIR {
  ubNumTiles: UINT8;
  pTiles: ANIM_PROF_TILE[] /* Pointer<ANIM_PROF_TILE> */;
}

export function createAnimationProfileDirection(): ANIM_PROF_DIR {
  return {
    ubNumTiles: 0,
    pTiles: <ANIM_PROF_TILE[]><unknown>null,
  }
}

export interface ANIM_PROF {
  Dirs: ANIM_PROF_DIR[] /* [8] */;
}

export function createAnimationProfile(): ANIM_PROF {
  return {
    Dirs: createArrayFrom(8, createAnimationProfileDirection),
  };
}

// Globals
//////////

// Functions
////////////

export const PTR_CIVILIAN = (pSoldier: SOLDIERTYPE) => (pSoldier.bTeam == CIV_TEAM);
export const PTR_CROUCHED = (pSoldier: SOLDIERTYPE) => (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_CROUCH);
export const PTR_STANDING = (pSoldier: SOLDIERTYPE) => (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_STAND);
const PTR_PRONE = (pSoldier: SOLDIERTYPE) => (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_PRONE);

// VARIABLES FOR PALETTE REPLACEMENTS FOR HAIR, ETC
export let gubpNumReplacementsPerRange: Pointer<UINT8>;
export let gpPalRep: PaletteReplacementType[] /* Pointer<PaletteReplacementType> */;

}
