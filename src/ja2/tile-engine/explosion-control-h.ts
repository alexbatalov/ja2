export const MAX_DISTANCE_EXPLOSIVE_CAN_DESTROY_STRUCTURES = 2;

export const EXPLOSION_FLAG_USEABSPOS = 0x00000001;
export const EXPLOSION_FLAG_DISPLAYONLY = 0x00000002;

// Explosion Data
export interface EXPLOSION_PARAMS {
  uiFlags: UINT32;

  ubOwner: UINT8;
  ubTypeID: UINT8;

  usItem: UINT16;

  sX: INT16; // World X ( optional )
  sY: INT16; // World Y ( optional )
  sZ: INT16; // World Z ( optional )
  sGridNo: INT16; // World GridNo
  fLocate: boolean;
  bLevel: INT8; // World level
  ubUnsed: UINT8[] /* [1] */;
}

export interface EXPLOSIONTYPE {
  Params: EXPLOSION_PARAMS;
  fAllocated: boolean;
  sCurrentFrame: INT16;
  iID: INT32;
  iLightID: INT32;
  ubUnsed: UINT8[] /* [2] */;
}

export const enum Enum304 {
  NO_BLAST,
  BLAST_1,
  BLAST_2,
  BLAST_3,
  STUN_BLAST,
  WATER_BLAST,
  TARGAS_EXP,
  SMOKE_EXP,
  MUSTARD_EXP,

  NUM_EXP_TYPES,
}

export interface ExplosionQueueElement {
  uiWorldBombIndex: UINT32;
  uiTimeStamp: UINT32;
  fExists: UINT8;
}

export const ERASE_SPREAD_EFFECT = 2;
export const BLOOD_SPREAD_EFFECT = 3;
export const REDO_SPREAD_EFFECT = 4;

const NUM_EXPLOSION_SLOTS = 100;

export const GASMASK_MIN_STATUS = 70;
