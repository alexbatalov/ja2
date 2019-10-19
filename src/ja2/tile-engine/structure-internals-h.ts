//
// If you wish to use the structure database functions, include
// structure_extern.h, not structure.h!
//

// A few words about the overall structure scheme:
//
// Large structures are split into multiple sections,
// one for each tile.
//
// Each section is treated as a separate object,
// except that it does NOT record information about
// hit points, but instead stores a pointer to the
// base object (section).
//
// Each section has a line of sight profile.  These
// profiles are split into 5 in each horizontal direction
// and 4 vertically, forming 100 "cubes".  In real
// world terms, each section represents a volume
// with a height of 8 feet (and width and length
// of what?)
//
// It is important to note that the vertical
// position of each section is measured in individual
// cubes (rather than, as it were, groups of 4 vertical
// cubes)

const PROFILE_X_SIZE = 5;
const PROFILE_Y_SIZE = 5;
const PROFILE_Z_SIZE = 4;

// these values should be compared for less than rather than less
// than or equal to
const STRUCTURE_ON_GROUND = 0;
const STRUCTURE_ON_ROOF = PROFILE_Z_SIZE;
const STRUCTURE_ON_GROUND_MAX = PROFILE_Z_SIZE;
const STRUCTURE_ON_ROOF_MAX = PROFILE_Z_SIZE * 2;

typedef UINT8 PROFILE[PROFILE_X_SIZE][PROFILE_Y_SIZE];

extern UINT8 AtHeight[PROFILE_Z_SIZE];

// MAP_ELEMENT may get later:
// PROFILE *		CombinedLOSProfile;
// PROFILE *		CombinedProtectionProfile;
//
// LEVELNODE gets a pointer to a STRUCTURE or
// a union between its soldier pointer and a
// STRUCTURE pointer

// if (fFlags & STRUCTURE_BASE_TILE)
// then the structure is the "base" of the object
// and its hitpoint value is the one for the object
//
//															        vv    generic flags for all structures
//															     vvv      type flags
//

// how to handle explodable structures

// NOT used in DB structures!
const STRUCTURE_BASE_TILE = 0x00000001;
const STRUCTURE_OPEN = 0x00000002;
const STRUCTURE_OPENABLE = 0x00000004;
// synonyms for STRUCTURE_OPENABLE
const STRUCTURE_CLOSEABLE = 0x00000004;
const STRUCTURE_SEARCHABLE = 0x00000004;
const STRUCTURE_HIDDEN = 0x00000008;

const STRUCTURE_MOBILE = 0x00000010;
// STRUCTURE_PASSABLE is set for each structure instance where
// the tile flag TILE_PASSABLE is set
const STRUCTURE_PASSABLE = 0x00000020;
const STRUCTURE_EXPLOSIVE = 0x00000040;
const STRUCTURE_TRANSPARENT = 0x00000080;

const STRUCTURE_GENERIC = 0x00000100;
const STRUCTURE_TREE = 0x00000200;
const STRUCTURE_FENCE = 0x00000400;
const STRUCTURE_WIREFENCE = 0x00000800;

const STRUCTURE_HASITEMONTOP = 0x00001000; // ATE: HASITEM: struct has item on top of it
const STRUCTURE_SPECIAL = 0x00002000;
const STRUCTURE_LIGHTSOURCE = 0x00004000;
const STRUCTURE_VEHICLE = 0x00008000;

const STRUCTURE_WALL = 0x00010000;
const STRUCTURE_WALLNWINDOW = 0x00020000;
const STRUCTURE_SLIDINGDOOR = 0x00040000;
const STRUCTURE_DOOR = 0x00080000;

// a "multi" structure (as opposed to multitiled) is composed of multiple graphics & structures
const STRUCTURE_MULTI = 0x00100000;
const STRUCTURE_CAVEWALL = 0x00200000;
const STRUCTURE_DDOOR_LEFT = 0x00400000;
const STRUCTURE_DDOOR_RIGHT = 0x00800000;

const STRUCTURE_NORMAL_ROOF = 0x01000000;
const STRUCTURE_SLANTED_ROOF = 0x02000000;
const STRUCTURE_TALL_ROOF = 0x04000000;
const STRUCTURE_SWITCH = 0x08000000;

const STRUCTURE_ON_LEFT_WALL = 0x10000000;
const STRUCTURE_ON_RIGHT_WALL = 0x20000000;
const STRUCTURE_CORPSE = 0x40000000;
const STRUCTURE_PERSON = 0x80000000;

// COMBINATION FLAGS
const STRUCTURE_ANYFENCE = 0x00000C00;
const STRUCTURE_ANYDOOR = 0x00CC0000;
const STRUCTURE_OBSTACLE = 0x00008F00;
const STRUCTURE_WALLSTUFF = 0x00CF0000;
const STRUCTURE_BLOCKSMOVES = 0x00208F00;
const STRUCTURE_TYPE_DEFINED = 0x8FEF8F00;
const STRUCTURE_ROOF = 0x07000000;

const TILE_ON_ROOF = 0x01;
const TILE_PASSABLE = 0x02;

interface DB_STRUCTURE_TILE {
  sPosRelToBase: INT16; // "single-axis"
  bXPosRelToBase: INT8;
  bYPosRelToBase: INT8;
  Shape: PROFILE; // 25 bytes
  fFlags: UINT8;
  ubVehicleHitLocation: UINT8;
  bUnused: BYTE[] /* [1] */;
} // 32 bytes

const BASE_TILE = 0;

const NO_PARTNER_STRUCTURE = 0;

interface DB_STRUCTURE {
  ubArmour: UINT8;
  ubHitPoints: UINT8;
  ubDensity: UINT8;
  ubNumberOfTiles: UINT8;
  fFlags: UINT32;
  usStructureNumber: UINT16;
  ubWallOrientation: UINT8;
  bDestructionPartner: INT8; // >0 = debris number (bDP - 1), <0 = partner graphic
  bPartnerDelta: INT8; // opened/closed version, etc... 0 for unused
  bZTileOffsetX: INT8;
  bZTileOffsetY: INT8;
  bUnused: BYTE[] /* [1] */;
} // 16 bytes

interface DB_STRUCTURE_REF {
  pDBStructure: Pointer<DB_STRUCTURE>;
  ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>; // dynamic array
} // 8 bytes

interface STRUCTURE {
  pPrev: Pointer<STRUCTURE>;
  pNext: Pointer<STRUCTURE>;
  sGridNo: INT16;
  usStructureID: UINT16;
  pDBStructureRef: Pointer<DB_STRUCTURE_REF>;
  /* union { */
  /*   struct { */
  ubHitPoints: UINT8;
  ubLockStrength: UINT8;
  /*   } */
  /*   struct { */
  sBaseGridNo: INT16;
  /*   } */
  /* } */
  sCubeOffset: INT16; // height of bottom of object in profile "cubes"
  fFlags: UINT32; // need to have something to indicate base tile/not
  pShape: Pointer<PROFILE>;
  ubWallOrientation: UINT8;
  ubVehicleHitLocation: UINT8;
  ubStructureHeight: UINT8; // if 0, then unset; otherwise stores height of structure when last calculated
  ubUnused: UINT8[] /* [1] */;
} // 32 bytes

interface STRUCTURE_FILE_REF {
  pPrev: Pointer<STRUCTURE_FILE_REF>;
  pNext: Pointer<STRUCTURE_FILE_REF>;
  pAuxData: Pointer<AuxObjectData>;
  pTileLocData: Pointer<RelTileLoc>;
  pubStructureData: Pointer<UINT8>;
  pDBStructureRef: Pointer<DB_STRUCTURE_REF>; // dynamic array
  usNumberOfStructures: UINT16;
  usNumberOfStructuresStored: UINT16;
} // 24 bytes

// IMPORTANT THING TO REMEMBER
//
// Although the number of structures and images about which information
// may be stored in a file, the two are stored very differently.
//
// The structure data stored amounts to a sparse array, with no data
// saved for any structures that are not defined.
//
// For image information, however, an array is stored with every entry
// filled regardless of whether there is non-zero data defined for
// that graphic!
interface STRUCTURE_FILE_HEADER {
  szId: CHAR8[] /* [4] */;
  /* union { */
  /*   struct { */
  usNumberOfStructures: UINT16;
  /*   } */
  /*   struct { */
  usNumberOfImages: UINT16;
  /*   } */
  /* } */
  usNumberOfStructuresStored: UINT16;
  usStructureDataSize: UINT16;
  fFlags: UINT8;
  bUnused: UINT8[] /* [3] */;
  usNumberOfImageTileLocsStored: UINT16;
} // 16 bytes

// "J2SD" = Jagged 2 Structure Data
const STRUCTURE_FILE_ID = "J2SD";
const STRUCTURE_FILE_ID_LEN = 4;

const STRUCTURE_SCRIPT_FILE_EXTENSION = "JSS";
const STRUCTURE_FILE_EXTENSION = "JSD";

const STRUCTURE_FILE_CONTAINS_AUXIMAGEDATA = 0x01;
const STRUCTURE_FILE_CONTAINS_STRUCTUREDATA = 0x02;
