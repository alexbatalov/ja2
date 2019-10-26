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

export interface EV_S_CHANGESTATE {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usNewState: UINT16;
  sXPos: INT16;
  sYPos: INT16;
  usStartingAniCode: UINT16;
  fForce: boolean;
}

export interface EV_S_CHANGEDEST {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usNewDestination: UINT16;
}

export interface EV_S_SETPOSITION {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  dNewXPos: FLOAT;
  dNewYPos: FLOAT;
}

export interface EV_S_GETNEWPATH {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  sDestGridNo: INT16;
  usMovementAnim: UINT16;
}

export interface EV_S_BEGINTURN {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
}

export interface EV_S_CHANGESTANCE {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  ubNewStance: UINT8;
  sXPos: INT16;
  sYPos: INT16;
}

export interface EV_S_SETDIRECTION {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usNewDirection: UINT16;
}

export interface EV_S_SETDESIREDDIRECTION {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  usDesiredDirection: UINT16;
}

export interface EV_S_BEGINFIREWEAPON {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  sTargetGridNo: INT16;
  bTargetLevel: INT8;
  bTargetCubeLevel: INT8;
}

export interface EV_S_FIREWEAPON {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  sTargetGridNo: INT16;
  bTargetLevel: INT8;
  bTargetCubeLevel: INT8;
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

export interface EV_S_WINDOWHIT {
  sGridNo: INT16;
  usStructureID: UINT16;
  fBlowWindowSouth: boolean;
  fLargeForce: boolean;
}

export interface EV_S_MISS {
  ubAttackerID: UINT8;
}

export interface EV_S_NOISE {
  ubNoiseMaker: UINT8;
  sGridNo: INT16;
  bLevel: UINT8;
  ubTerrType: UINT8;
  ubVolume: UINT8;
  ubNoiseType: UINT8;
}

export interface EV_S_STOP_MERC {
  usSoldierID: UINT16;
  uiUniqueId: UINT32;
  bDirection: INT8;
  sGridNo: INT16;
  sXPos: INT16;
  sYPos: INT16;
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

interface EV_S_UPDATENETWORKSOLDIER {
  usSoldierID: UINT8;
  uiUniqueId: UINT32;
  sAtGridNo: INT16; // Owner merc is at this tile when sending packet
  bActionPoints: INT8; // current A.P. value
  bBreath: INT8; // current breath value
}

}
