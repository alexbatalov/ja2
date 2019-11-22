namespace ja2 {

const NETWORK_PATH_DATA_SIZE = 6;
// Enumerate all events for JA2
export const enum Enum319 {
  E_PLAYSOUND,
  S_CHANGEDEST,
  //	S_GETNEWPATH,
  S_BEGINTURN,
  S_CHANGESTANCE,
  S_SETDESIREDDIRECTION,
  S_BEGINFIREWEAPON,
  S_FIREWEAPON,
  S_WEAPONHIT,
  S_STRUCTUREHIT,
  S_WINDOWHIT,
  S_MISS,
  S_NOISE,
  S_STOP_MERC,

  EVENTS_LOCAL_AND_NETWORK, // Events above here are sent locally and over network

  S_GETNEWPATH,
  S_SETPOSITION,
  S_CHANGESTATE,
  S_SETDIRECTION,
  EVENTS_ONLY_USED_LOCALLY, // Events above are only used locally

  S_SENDPATHTONETWORK,
  S_UPDATENETWORKSOLDIER,
  EVENTS_ONLY_SENT_OVER_NETWORK, // Events above are only sent to the network

  NUM_EVENTS,
}

// This definition is used to denote events with a special delay value;
// it indicates that these events will not be processed until specifically
// called for in a special loop.
export const DEMAND_EVENT_DELAY = 0xFFFF;

// Enumerate all structures for events
export interface EV_E_PLAYSOUND {
  usIndex: UINT16;
  usRate: UINT16;
  ubVolume: UINT8;
  ubLoops: UINT8;
  uiPan: UINT32;
}

export const EV_E_PLAYSOUND_SIZE = 12;

export function createEvEPlaySound(): EV_E_PLAYSOUND {
  return {
    usIndex: 0,
    usRate: 0,
    ubVolume: 0,
    ubLoops: 0,
    uiPan: 0,
  };
}

export function copyEvEPlaySound(destination: EV_E_PLAYSOUND, source: EV_E_PLAYSOUND) {
  destination.usIndex = source.usIndex;
  destination.usRate = source.usRate;
  destination.ubVolume = source.ubVolume;
  destination.ubLoops = source.ubLoops;
  destination.uiPan = source.uiPan;
}

export interface EV_S_CHANGESTATE {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usNewState: UINT16;
  sXPos: INT16;
  sYPos: INT16;
  usStartingAniCode: UINT16;
  fForce: boolean;
}

export const EV_S_CHANGESTATE_SIZE = 20;

export function createEvSChangeState(): EV_S_CHANGESTATE {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    usNewState: 0,
    sXPos: 0,
    sYPos: 0,
    usStartingAniCode: 0,
    fForce: false,
  };
}

export function copyEvSChangeState(destination: EV_S_CHANGESTATE, source: EV_S_CHANGESTATE) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.usNewState = source.usNewState;
  destination.sXPos = source.sXPos;
  destination.sYPos = source.sYPos;
  destination.usStartingAniCode = source.usStartingAniCode;
  destination.fForce = source.fForce;
}

export interface EV_S_CHANGEDEST {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usNewDestination: UINT16;
}

export const EV_S_CHANGEDEST_SIZE = 12;

export function createEvSChangeDest(): EV_S_CHANGEDEST {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    usNewDestination: 0,
  };
}

export function copyEvSChangeDest(destination: EV_S_CHANGEDEST, source: EV_S_CHANGEDEST) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.usNewDestination = source.usNewDestination;
}

export interface EV_S_SETPOSITION {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  dNewXPos: FLOAT;
  dNewYPos: FLOAT;
}

export const EV_S_SETPOSITION_SIZE = 16;

export function createEvSSetPosition(): EV_S_SETPOSITION {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    dNewXPos: 0,
    dNewYPos: 0,
  };
}

export function copyEvSSetPosition(destination: EV_S_SETPOSITION, source: EV_S_SETPOSITION) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.dNewXPos = source.dNewXPos;
  destination.dNewYPos = source.dNewYPos;
}

export interface EV_S_GETNEWPATH {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  sDestGridNo: INT16;
  usMovementAnim: UINT16;
}

export const EV_S_GETNEWPATH_SIZE = 12;

export function createEvSGetNewPath(): EV_S_GETNEWPATH {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    sDestGridNo: 0,
    usMovementAnim: 0,
  };
}

export function copyEvSGetNewPath(destination: EV_S_GETNEWPATH, source: EV_S_GETNEWPATH) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.sDestGridNo = source.sDestGridNo;
  destination.usMovementAnim = source.usMovementAnim;
}

export interface EV_S_BEGINTURN {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
}

export const EV_S_BEGINTURN_SIZE = 8;

export function createEvSBeginTurn(): EV_S_BEGINTURN {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
  };
}

export function copyEvSBeginTurn(destination: EV_S_BEGINTURN, source: EV_S_BEGINTURN) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
}

export interface EV_S_CHANGESTANCE {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  ubNewStance: UINT8;
  sXPos: INT16;
  sYPos: INT16;
}

export const EV_S_CHANGESTANCE_SIZE = 16;

export function createEvSChangeStance(): EV_S_CHANGESTANCE {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    ubNewStance: 0,
    sXPos: 0,
    sYPos: 0,
  };
}

export function copyEvSChangeStance(destination: EV_S_CHANGESTANCE, source: EV_S_CHANGESTANCE) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.ubNewStance = source.ubNewStance;
  destination.sXPos = source.sXPos;
  destination.sYPos = source.sYPos;
}

export interface EV_S_SETDIRECTION {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usNewDirection: UINT16;
}

export const EV_S_SETDIRECTION_SIZE = 12;

export function createEvSSetDirection(): EV_S_SETDIRECTION {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    usNewDirection: 0,
  };
}

export function copyEvSSetDirection(destination: EV_S_SETDIRECTION, source: EV_S_SETDIRECTION) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.usNewDirection = source.usNewDirection;
}

export interface EV_S_SETDESIREDDIRECTION {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usDesiredDirection: UINT16;
}

export const EV_S_SETDESIREDDIRECTION_SIZE = 12;

export function createEvSSetDesiredDirection(): EV_S_SETDESIREDDIRECTION {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    usDesiredDirection: 0,
  };
}

export function copyEvSSetDesiredDirection(destination: EV_S_SETDESIREDDIRECTION, source: EV_S_SETDESIREDDIRECTION) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.usDesiredDirection = source.usDesiredDirection;
}

export interface EV_S_BEGINFIREWEAPON {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  sTargetGridNo: INT16;
  bTargetLevel: INT8;
  bTargetCubeLevel: INT8;
}

export function createEvSBeginFireWeapon(): EV_S_BEGINFIREWEAPON {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    sTargetGridNo: 0,
    bTargetLevel: 0,
    bTargetCubeLevel: 0,
  };
}

export const EV_S_BEGINFIREWEAPON_SIZE = 12;

export function copyEvSBeginFireWeapon(destination: EV_S_BEGINFIREWEAPON, source: EV_S_BEGINFIREWEAPON) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.sTargetGridNo = source.sTargetGridNo;
  destination.bTargetLevel = source.bTargetLevel;
  destination.bTargetCubeLevel = source.bTargetCubeLevel;
}

export interface EV_S_FIREWEAPON {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  sTargetGridNo: INT16;
  bTargetLevel: INT8;
  bTargetCubeLevel: INT8;
}

export const EV_S_FIREWEAPON_SIZE = 12;

export function createEvSFireWeapon(): EV_S_FIREWEAPON {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    sTargetGridNo: 0,
    bTargetLevel: 0,
    bTargetCubeLevel: 0,
  };
}

export function copyEvSFireWeapon(destination: EV_S_FIREWEAPON, source: EV_S_FIREWEAPON) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.sTargetGridNo = source.sTargetGridNo;
  destination.bTargetLevel = source.bTargetLevel;
  destination.bTargetCubeLevel = source.bTargetCubeLevel;
}

export interface EV_S_WEAPONHIT {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usWeaponIndex: UINT16;
  sDamage: INT16;
  sBreathLoss: INT16;
  usDirection: UINT16;
  sXPos: INT16;
  sYPos: INT16;
  sZPos: INT16;
  sRange: INT16;
  ubAttackerID: UINT8;
  fHit: boolean;
  ubSpecial: UINT8;
  ubLocation: UINT8;
}

export const EV_S_WEAPONHIT_SIZE = 28;

export function createEvSWeaponHit(): EV_S_WEAPONHIT {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    usWeaponIndex: 0,
    sDamage: 0,
    sBreathLoss: 0,
    usDirection: 0,
    sXPos: 0,
    sYPos: 0,
    sZPos: 0,
    sRange: 0,
    ubAttackerID: 0,
    fHit: false,
    ubSpecial: 0,
    ubLocation: 0,
  };
}

export function copyEvSWeaponHit(destination: EV_S_WEAPONHIT, source: EV_S_WEAPONHIT) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.usWeaponIndex = source.usWeaponIndex;
  destination.sDamage = source.sDamage;
  destination.sBreathLoss = source.sBreathLoss;
  destination.usDirection = source.usDirection;
  destination.sXPos = source.sXPos;
  destination.sYPos = source.sYPos;
  destination.sZPos = source.sZPos;
  destination.sRange = source.sRange;
  destination.ubAttackerID = source.ubAttackerID;
  destination.fHit = source.fHit;
  destination.ubSpecial = source.ubSpecial;
  destination.ubLocation = source.ubLocation;
}

export interface EV_S_STRUCTUREHIT {
  sXPos: INT16;
  sYPos: INT16;
  sZPos: INT16;
  usWeaponIndex: UINT16;
  bWeaponStatus: INT8;
  ubAttackerID: UINT8;
  usStructureID: UINT16;
  iImpact: INT32;
  iBullet: INT32;
}

export const EV_S_STRUCTUREHIT_SIZE = 20;

export function createEvSStructureHit(): EV_S_STRUCTUREHIT {
  return {
    sXPos: 0,
    sYPos: 0,
    sZPos: 0,
    usWeaponIndex: 0,
    bWeaponStatus: 0,
    ubAttackerID: 0,
    usStructureID: 0,
    iImpact: 0,
    iBullet: 0,
  };
}

export function copyEvSStructureHit(destination: EV_S_STRUCTUREHIT, source: EV_S_STRUCTUREHIT) {
  destination.sXPos = source.sXPos;
  destination.sYPos = source.sYPos;
  destination.sZPos = source.sZPos;
  destination.usWeaponIndex = source.usWeaponIndex;
  destination.bWeaponStatus = source.bWeaponStatus;
  destination.ubAttackerID = source.ubAttackerID;
  destination.usStructureID = source.usStructureID;
  destination.iImpact = source.iImpact;
  destination.iBullet = source.iBullet;
}

export interface EV_S_WINDOWHIT {
  sGridNo: INT16;
  usStructureID: UINT16;
  fBlowWindowSouth: boolean;
  fLargeForce: boolean;
}

export const EV_S_WINDOWHIT_SIZE = 6;

export function createEvSWindowHit(): EV_S_WINDOWHIT {
  return {
    sGridNo: 0,
    usStructureID: 0,
    fBlowWindowSouth: false,
    fLargeForce: false,
  };
}

export function copyEvSWindowHit(destination: EV_S_WINDOWHIT, source: EV_S_WINDOWHIT) {
  destination.sGridNo = source.sGridNo;
  destination.usStructureID = source.usStructureID;
  destination.fBlowWindowSouth = source.fBlowWindowSouth;
  destination.fLargeForce = source.fLargeForce;
}

export interface EV_S_MISS {
  ubAttackerID: UINT8;
}

export const EV_S_MISS_SIZE = 1;

export function createEvSMiss(): EV_S_MISS {
  return {
    ubAttackerID: 0,
  };
}

export const EV_S_NOISE_SIZE = 8;

export function copyEvSMiss(destination: EV_S_MISS, source: EV_S_MISS) {
  destination.ubAttackerID = source.ubAttackerID;
}

export interface EV_S_NOISE {
  ubNoiseMaker: UINT8;
  sGridNo: INT16;
  bLevel: UINT8;
  ubTerrType: UINT8;
  ubVolume: UINT8;
  ubNoiseType: UINT8;
}

export function createEvSNoise(): EV_S_NOISE {
  return {
    ubNoiseMaker: 0,
    sGridNo: 0,
    bLevel: 0,
    ubTerrType: 0,
    ubVolume: 0,
    ubNoiseType: 0,
  };
}

export function copyEvSNoise(destination: EV_S_NOISE, source: EV_S_NOISE) {
  destination.ubNoiseMaker = source.ubNoiseMaker;
  destination.sGridNo = source.sGridNo;
  destination.bLevel = source.bLevel;
  destination.ubTerrType = source.ubTerrType;
  destination.ubVolume = source.ubVolume;
  destination.ubNoiseType = source.ubNoiseType;
}

export interface EV_S_STOP_MERC {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  bDirection: INT8;
  sGridNo: INT16;
  sXPos: INT16;
  sYPos: INT16;
}

export const EV_S_STOP_MERC_SIZE = 16;

export function createEvSStopMerc(): EV_S_STOP_MERC {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    bDirection: 0,
    sGridNo: 0,
    sXPos: 0,
    sYPos: 0,
  };
}

export function copyEvSStopMerc(destination: EV_S_STOP_MERC, source: EV_S_STOP_MERC) {
  destination.usSoldierID = source.usSoldierID;
  destination.uiUniqueId = source.uiUniqueId;
  destination.bDirection = source.bDirection;
  destination.sGridNo = source.sGridNo;
  destination.sXPos = source.sXPos;
  destination.sYPos = source.sYPos;
}

export interface EV_S_SENDPATHTONETWORK {
  usSoldierID: UINT8;
  uiUniqueId: UINT32;
  usPathDataSize: UINT8; // Size of Path
  sAtGridNo: INT16; // Owner merc is at this tile when sending packet
  usCurrentPathIndex: UINT8; // Index the owner of the merc is at when sending packet
  usPathData: UINT8[] /* [NETWORK_PATH_DATA_SIZE] */; // make define  // Next X tile to go to
  ubNewState: UINT8; // new movment Anim
}

export const EV_S_SENDPATHTONETWORK_SIZE = 20;

export function createEvSSendPathToNetwork(): EV_S_SENDPATHTONETWORK {
  return {
    usSoldierID: 0,
    uiUniqueId: 0,
    usPathDataSize: 0,
    sAtGridNo: 0,
    usCurrentPathIndex: 0,
    usPathData: createArray(NETWORK_PATH_DATA_SIZE, 0),
    ubNewState: 0,
  };
}

interface EV_S_UPDATENETWORKSOLDIER {
  usSoldierID: UINT8;
  uiUniqueId: UINT32;
  sAtGridNo: INT16; // Owner merc is at this tile when sending packet
  bActionPoints: INT8; // current A.P. value
  bBreath: INT8; // current breath value
}

export const EV_S_UPDATENETWORKSOLDIER_SIZE = 12;

}
