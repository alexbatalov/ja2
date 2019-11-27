namespace ja2 {

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

export const PROFILE_X_SIZE = 5;
export const PROFILE_Y_SIZE = 5;
export const PROFILE_Z_SIZE = 4;

// these values should be compared for less than rather than less
// than or equal to
export const STRUCTURE_ON_GROUND = 0;
export const STRUCTURE_ON_ROOF = PROFILE_Z_SIZE;
export const STRUCTURE_ON_GROUND_MAX = PROFILE_Z_SIZE;
export const STRUCTURE_ON_ROOF_MAX = PROFILE_Z_SIZE * 2;

export type PROFILE = UINT8[][] /* [PROFILE_X_SIZE][PROFILE_Y_SIZE] */;

export function createProfile(): UINT8[][] {
  return createArrayFrom(PROFILE_X_SIZE, () => createArray(PROFILE_Y_SIZE, 0));
}

export function copyProfile(destination: PROFILE, source: PROFILE) {
  for (let x = 0; x < PROFILE_X_SIZE; x++) {
    for (let y = 0; y < PROFILE_Y_SIZE; y++) {
      destination[x][y] = source[x][y];
    }
  }
}

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
export const STRUCTURE_BASE_TILE = 0x00000001;
export const STRUCTURE_OPEN = 0x00000002;
export const STRUCTURE_OPENABLE = 0x00000004;
// synonyms for STRUCTURE_OPENABLE
const STRUCTURE_CLOSEABLE = 0x00000004;
const STRUCTURE_SEARCHABLE = 0x00000004;
export const STRUCTURE_HIDDEN = 0x00000008;

export const STRUCTURE_MOBILE = 0x00000010;
// STRUCTURE_PASSABLE is set for each structure instance where
// the tile flag TILE_PASSABLE is set
export const STRUCTURE_PASSABLE = 0x00000020;
export const STRUCTURE_EXPLOSIVE = 0x00000040;
export const STRUCTURE_TRANSPARENT = 0x00000080;

export const STRUCTURE_GENERIC = 0x00000100;
export const STRUCTURE_TREE = 0x00000200;
export const STRUCTURE_FENCE = 0x00000400;
export const STRUCTURE_WIREFENCE = 0x00000800;

export const STRUCTURE_HASITEMONTOP = 0x00001000; // ATE: HASITEM: struct has item on top of it
export const STRUCTURE_SPECIAL = 0x00002000;
const STRUCTURE_LIGHTSOURCE = 0x00004000;
export const STRUCTURE_VEHICLE = 0x00008000;

export const STRUCTURE_WALL = 0x00010000;
export const STRUCTURE_WALLNWINDOW = 0x00020000;
export const STRUCTURE_SLIDINGDOOR = 0x00040000;
export const STRUCTURE_DOOR = 0x00080000;

// a "multi" structure (as opposed to multitiled) is composed of multiple graphics & structures
export const STRUCTURE_MULTI = 0x00100000;
export const STRUCTURE_CAVEWALL = 0x00200000;
export const STRUCTURE_DDOOR_LEFT = 0x00400000;
export const STRUCTURE_DDOOR_RIGHT = 0x00800000;

export const STRUCTURE_NORMAL_ROOF = 0x01000000;
export const STRUCTURE_SLANTED_ROOF = 0x02000000;
const STRUCTURE_TALL_ROOF = 0x04000000;
export const STRUCTURE_SWITCH = 0x08000000;

export const STRUCTURE_ON_LEFT_WALL = 0x10000000;
export const STRUCTURE_ON_RIGHT_WALL = 0x20000000;
export const STRUCTURE_CORPSE = 0x40000000;
export const STRUCTURE_PERSON = 0x80000000;

// COMBINATION FLAGS
export const STRUCTURE_ANYFENCE = 0x00000C00;
export const STRUCTURE_ANYDOOR = 0x00CC0000;
export const STRUCTURE_OBSTACLE = 0x00008F00;
export const STRUCTURE_WALLSTUFF = 0x00CF0000;
export const STRUCTURE_BLOCKSMOVES = 0x00208F00;
const STRUCTURE_TYPE_DEFINED = 0x8FEF8F00;
export const STRUCTURE_ROOF = 0x07000000;

export const TILE_ON_ROOF = 0x01;
export const TILE_PASSABLE = 0x02;

export interface DB_STRUCTURE_TILE {
  sPosRelToBase: INT16; // "single-axis"
  bXPosRelToBase: INT8;
  bYPosRelToBase: INT8;
  Shape: PROFILE; // 25 bytes
  fFlags: UINT8;
  ubVehicleHitLocation: UINT8;
  bUnused: BYTE[] /* [1] */;
} // 32 bytes

export function createDbStructureTile(): DB_STRUCTURE_TILE {
  return {
    sPosRelToBase: 0,
    bXPosRelToBase: 0,
    bYPosRelToBase: 0,
    Shape: createProfile(),
    fFlags: 0,
    ubVehicleHitLocation: 0,
    bUnused: createArray(1, 0),
  };
}

export function copyDbStructureTile(destination: DB_STRUCTURE_TILE, source: DB_STRUCTURE_TILE) {
  destination.sPosRelToBase = source.sPosRelToBase;
  destination.bXPosRelToBase = source.bXPosRelToBase;
  destination.bYPosRelToBase = source.bYPosRelToBase;
  copyProfile(destination.Shape, source.Shape);
  destination.fFlags = source.fFlags;
  destination.ubVehicleHitLocation = source.ubVehicleHitLocation;
  copyArray(destination.bUnused, source.bUnused);
}

export const DB_STRUCTURE_TILE_SIZE = 32;

export function readDbStructureTile(o: DB_STRUCTURE_TILE, buffer: Buffer, offset: number = 0): number {
  o.sPosRelToBase = buffer.readInt16LE(offset); offset += 2;
  o.bXPosRelToBase = buffer.readInt8(offset++);
  o.bYPosRelToBase = buffer.readInt8(offset++);

  for (let i = 0; i < o.Shape.length; i++) {
    offset = readUIntArray(o.Shape[i], buffer, offset, 1);
  }

  o.fFlags = buffer.readUInt8(offset++);
  o.ubVehicleHitLocation = buffer.readUInt8(offset++);
  offset = readUIntArray(o.bUnused, buffer, offset, 1);
  return offset;
}

export function writeDbStructureTile(o: DB_STRUCTURE_TILE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sPosRelToBase, offset);
  offset = buffer.writeInt8(o.bXPosRelToBase, offset);
  offset = buffer.writeInt8(o.bYPosRelToBase, offset);

  for (let i = 0; i < o.Shape.length; i++) {
    offset = writeUIntArray(o.Shape[i], buffer, offset, 1);
  }

  offset = buffer.writeUInt8(o.fFlags, offset);
  offset = buffer.writeUInt8(o.ubVehicleHitLocation, offset);
  offset = writeUIntArray(o.bUnused, buffer, offset, 1);
  return offset;
}

export const BASE_TILE = 0;

export const NO_PARTNER_STRUCTURE = 0;

export interface DB_STRUCTURE {
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

export function createDbStructure(): DB_STRUCTURE {
  return {
    ubArmour: 0,
    ubHitPoints: 0,
    ubDensity: 0,
    ubNumberOfTiles: 0,
    fFlags: 0,
    usStructureNumber: 0,
    ubWallOrientation: 0,
    bDestructionPartner: 0,
    bPartnerDelta: 0,
    bZTileOffsetX: 0,
    bZTileOffsetY: 0,
    bUnused: createArray(1, 0),
  };
}

export const DB_STRUCTURE_SIZE = 16;

export function readDbStructure(o: DB_STRUCTURE, buffer: Buffer, offset: number = 0): number {
  o.ubArmour = buffer.readUInt8(offset++);
  o.ubHitPoints = buffer.readUInt8(offset++);
  o.ubDensity = buffer.readUInt8(offset++);
  o.ubNumberOfTiles = buffer.readUInt8(offset++);
  o.fFlags = buffer.readUInt32LE(offset); offset += 4;
  o.usStructureNumber = buffer.readUInt16LE(offset); offset += 2;
  o.ubWallOrientation = buffer.readUInt8(offset++);
  o.bDestructionPartner = buffer.readInt8(offset++);
  o.bPartnerDelta = buffer.readInt8(offset++);
  o.bZTileOffsetX = buffer.readInt8(offset++);
  o.bZTileOffsetY = buffer.readInt8(offset++);
  offset = readUIntArray(o.bUnused, buffer, offset, 1);
  return offset;
}

export function writeDbStructure(o: DB_STRUCTURE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubArmour, offset);
  offset = buffer.writeUInt8(o.ubHitPoints, offset);
  offset = buffer.writeUInt8(o.ubDensity, offset);
  offset = buffer.writeUInt8(o.ubNumberOfTiles, offset);
  offset = buffer.writeUInt32LE(o.fFlags, offset);
  offset = buffer.writeUInt16LE(o.usStructureNumber, offset);
  offset = buffer.writeUInt8(o.ubWallOrientation, offset);
  offset = buffer.writeInt8(o.bDestructionPartner, offset);
  offset = buffer.writeInt8(o.bPartnerDelta, offset);
  offset = buffer.writeInt8(o.bZTileOffsetX, offset);
  offset = buffer.writeInt8(o.bZTileOffsetY, offset);
  offset = writeUIntArray(o.bUnused, buffer, offset, 1);
  return offset;
}

export interface DB_STRUCTURE_REF {
  pDBStructure: DB_STRUCTURE /* Pointer<DB_STRUCTURE> */;
  ppTile: DB_STRUCTURE_TILE[] /* Pointer<Pointer<DB_STRUCTURE_TILE>> */; // dynamic array
} // 8 bytes

export function createDbStructureRef(): DB_STRUCTURE_REF {
  return {
    pDBStructure: <DB_STRUCTURE><unknown>null,
    ppTile: <DB_STRUCTURE_TILE[]><unknown>null,
  };
}

export interface STRUCTURE {
  pPrev: STRUCTURE | null;
  pNext: STRUCTURE | null;
  sGridNo: INT16;
  usStructureID: UINT16;
  pDBStructureRef: DB_STRUCTURE_REF;
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
  pShape: PROFILE | null;
  ubWallOrientation: UINT8;
  ubVehicleHitLocation: UINT8;
  ubStructureHeight: UINT8; // if 0, then unset; otherwise stores height of structure when last calculated
  ubUnused: UINT8[] /* [1] */;
} // 32 bytes

export function createStructure(): STRUCTURE {
  return {
    pPrev: null,
    pNext: null,
    sGridNo: 0,
    usStructureID: 0,
    pDBStructureRef: <DB_STRUCTURE_REF><unknown>null,
    ubHitPoints: 0,
    ubLockStrength: 0,
    sBaseGridNo: 0,
    sCubeOffset: 0,
    fFlags: 0,
    pShape: null,
    ubWallOrientation: 0,
    ubVehicleHitLocation: 0,
    ubStructureHeight: 0,
    ubUnused: createArray(1, 0),
  };
}

export interface STRUCTURE_FILE_REF {
  pPrev: STRUCTURE_FILE_REF | null;
  pNext: STRUCTURE_FILE_REF | null;
  pAuxData: AuxObjectData[] /* Pointer<AuxObjectData> */;
  pTileLocData: RelTileLoc[] /* Pointer<RelTileLoc> */;
  pubStructureData: Buffer;
  pDBStructureRef: DB_STRUCTURE_REF[] /* Pointer<DB_STRUCTURE_REF> */; // dynamic array
  usNumberOfStructures: UINT16;
  usNumberOfStructuresStored: UINT16;
} // 24 bytes

export function createStructureFileRef(): STRUCTURE_FILE_REF {
  return {
    pPrev: null,
    pNext: null,
    pAuxData: <AuxObjectData[]><unknown>null,
    pTileLocData: <RelTileLoc[]><unknown>null,
    pubStructureData: <Buffer><unknown>null,
    pDBStructureRef: <DB_STRUCTURE_REF[]><unknown>null,
    usNumberOfStructures: 0,
    usNumberOfStructuresStored: 0,
  }
}

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
export interface STRUCTURE_FILE_HEADER {
  szId: string /* CHAR8[4] */;
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

export function createStructureFileHeader(): STRUCTURE_FILE_HEADER {
  return {
    szId: '',
    usNumberOfStructures: 0,
    usNumberOfImages: 0,
    usNumberOfStructuresStored: 0,
    usStructureDataSize: 0,
    fFlags: 0,
    bUnused: createArray(3, 0),
    usNumberOfImageTileLocsStored: 0,
  };
}

export const STRUCTURE_FILE_HEADER_SIZE = 16;

export function readStructureFileHeader(o: STRUCTURE_FILE_HEADER, buffer: Buffer, offset: number = 0): number {
  o.szId = readStringNL(buffer, 'ascii', offset, offset + 4); offset += 4;

  o.usNumberOfStructures = buffer.readUInt16LE(offset);
  o.usNumberOfImages = buffer.readUInt16LE(offset);
  offset += 2; // union

  o.usNumberOfStructuresStored = buffer.readUInt16LE(offset); offset += 2;
  o.usStructureDataSize = buffer.readUInt16LE(offset); offset += 2;
  o.fFlags = buffer.readUInt8(offset++);
  offset = readUIntArray(o.bUnused, buffer, offset, 1);
  o.usNumberOfImageTileLocsStored = buffer.readUInt16LE(offset); offset += 2;

  return offset;
}

// "J2SD" = Jagged 2 Structure Data
export const STRUCTURE_FILE_ID = "J2SD";
export const STRUCTURE_FILE_ID_LEN = 4;

const STRUCTURE_SCRIPT_FILE_EXTENSION = "JSS";
export const STRUCTURE_FILE_EXTENSION = "JSD";

export const STRUCTURE_FILE_CONTAINS_AUXIMAGEDATA = 0x01;
export const STRUCTURE_FILE_CONTAINS_STRUCTUREDATA = 0x02;

}
