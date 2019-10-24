const MAX_DISTANCE_EXPLOSIVE_CAN_DESTROY_STRUCTURES = 2;

const EXPLOSION_FLAG_USEABSPOS = 0x00000001;
const EXPLOSION_FLAG_DISPLAYONLY = 0x00000002;

// Explosion Data
interface EXPLOSION_PARAMS {
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

interface EXPLOSIONTYPE {
  Params: EXPLOSION_PARAMS;
  fAllocated: boolean;
  sCurrentFrame: INT16;
  iID: INT32;
  iLightID: INT32;
  ubUnsed: UINT8[] /* [2] */;
}

const enum Enum304 {
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

interface ExplosionQueueElement {
  uiWorldBombIndex: UINT32;
  uiTimeStamp: UINT32;
  fExists: UINT8;
}

const ERASE_SPREAD_EFFECT = 2;
const BLOOD_SPREAD_EFFECT = 3;
const REDO_SPREAD_EFFECT = 4;

const NUM_EXPLOSION_SLOTS = 100;

const GASMASK_MIN_STATUS = 70;
