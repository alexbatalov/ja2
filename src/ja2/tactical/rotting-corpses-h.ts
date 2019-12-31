namespace ja2 {

export const NUM_CORPSE_SHADES = 17;

export const enum Enum249 {
  NO_CORPSE,
  SMERC_JFK,
  SMERC_BCK,
  SMERC_FWD,
  SMERC_DHD,
  SMERC_PRN,
  SMERC_WTR,
  SMERC_FALL,
  SMERC_FALLF,

  MMERC_JFK,
  MMERC_BCK,
  MMERC_FWD,
  MMERC_DHD,
  MMERC_PRN,
  MMERC_WTR,
  MMERC_FALL,
  MMERC_FALLF,

  FMERC_JFK,
  FMERC_BCK,
  FMERC_FWD,
  FMERC_DHD,
  FMERC_PRN,
  FMERC_WTR,
  FMERC_FALL,
  FMERC_FALLF,

  // CIVS
  M_DEAD1,
  K_DEAD1,
  H_DEAD1,
  FT_DEAD1,
  S_DEAD1,
  W_DEAD1,
  C_DEAD1,
  M_DEAD2,
  K_DEAD2,
  H_DEAD2,

  FT_DEAD2,
  S_DEAD2,
  W_DEAD2,
  C_DEAD2,
  BLOODCAT_DEAD,
  COW_DEAD,
  ADULTMONSTER_DEAD,
  INFANTMONSTER_DEAD,
  LARVAEMONSTER_DEAD,
  ROTTING_STAGE2,

  TANK1_DEAD,
  TANK2_DEAD,
  HUMMER_DEAD,
  ICECREAM_DEAD,
  QUEEN_MONSTER_DEAD,
  ROBOT_DEAD,
  BURNT_DEAD,
  EXPLODE_DEAD,

  NUM_CORPSES,
}

export const ROTTING_CORPSE_FIND_SWEETSPOT_FROM_GRIDNO = 0x01; // Find the closest spot to the given gridno
export const ROTTING_CORPSE_USE_NORTH_ENTRY_POINT = 0x02; // Find the spot closest to the north entry grid
export const ROTTING_CORPSE_USE_SOUTH_ENTRY_POINT = 0x04; // Find the spot closest to the south entry grid
export const ROTTING_CORPSE_USE_EAST_ENTRY_POINT = 0x08; // Find the spot closest to the east entry grid
export const ROTTING_CORPSE_USE_WEST_ENTRY_POINT = 0x10; // Find the spot closest to the west entry grid
export const ROTTING_CORPSE_USE_CAMMO_PALETTE = 0x20; // We use cammo palette here....
export const ROTTING_CORPSE_VEHICLE = 0x40; // Vehicle Corpse

export interface ROTTING_CORPSE_DEFINITION {
  ubType: UINT8;
  ubBodyType: UINT8;
  sGridNo: INT16;
  dXPos: FLOAT;
  dYPos: FLOAT;
  sHeightAdjustment: INT16;

  HeadPal: PaletteRepID; // Palette reps
  PantsPal: PaletteRepID;
  VestPal: PaletteRepID;
  SkinPal: PaletteRepID;

  bDirection: INT8;
  uiTimeOfDeath: UINT32;

  usFlags: UINT16;

  bLevel: INT8;

  bVisible: INT8;
  bNumServicingCrows: INT8;
  ubProfile: UINT8;
  fHeadTaken: boolean;
  ubAIWarningValue: UINT8;

  ubFiller: UINT8[] /* [12] */;
}

export function createRottingCorpseDefinition(): ROTTING_CORPSE_DEFINITION {
  return {
    ubType: 0,
    ubBodyType: 0,
    sGridNo: 0,
    dXPos: 0,
    dYPos: 0,
    sHeightAdjustment: 0,
    HeadPal: "",
    PantsPal: "",
    VestPal: "",
    SkinPal: "",
    bDirection: 0,
    uiTimeOfDeath: 0,
    usFlags: 0,
    bLevel: 0,
    bVisible: 0,
    bNumServicingCrows: 0,
    ubProfile: 0,
    fHeadTaken: false,
    ubAIWarningValue: 0,
    ubFiller: createArray(12, 0),
  };
}

export function copyRottingCorpseDefinition(destination: ROTTING_CORPSE_DEFINITION, source: ROTTING_CORPSE_DEFINITION) {
  destination.ubType = source.ubType;
  destination.ubBodyType = source.ubBodyType;
  destination.sGridNo = source.sGridNo;
  destination.dXPos = source.dXPos;
  destination.dYPos = source.dYPos;
  destination.sHeightAdjustment = source.sHeightAdjustment;
  destination.HeadPal = source.HeadPal;
  destination.PantsPal = source.PantsPal;
  destination.VestPal = source.VestPal;
  destination.SkinPal = source.SkinPal;
  destination.bDirection = source.bDirection;
  destination.uiTimeOfDeath = source.uiTimeOfDeath;
  destination.usFlags = source.usFlags;
  destination.bLevel = source.bLevel;
  destination.bVisible = source.bVisible;
  destination.bNumServicingCrows = source.bNumServicingCrows;
  destination.ubProfile = source.ubProfile;
  destination.fHeadTaken = source.fHeadTaken;
  destination.ubAIWarningValue = source.ubAIWarningValue;
  copyArray(destination.ubFiller, source.ubFiller);
}

export const ROTTING_CORPSE_DEFINITION_SIZE = 160;

export function readRottingCorpseDefinition(o: ROTTING_CORPSE_DEFINITION, buffer: Buffer, offset: number = 0): number {
  o.ubType = buffer.readUInt8(offset++);
  o.ubBodyType = buffer.readUInt8(offset++);
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.dXPos = buffer.readFloatLE(offset); offset += 4;
  o.dYPos = buffer.readFloatLE(offset); offset += 4;
  o.sHeightAdjustment = buffer.readInt16LE(offset); offset += 2;
  o.HeadPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.PantsPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.VestPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.SkinPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.bDirection = buffer.readInt8(offset++);
  offset++; // padding
  o.uiTimeOfDeath = buffer.readUInt32LE(offset); offset += 4;
  o.usFlags = buffer.readUInt16LE(offset); offset += 2;
  o.bLevel = buffer.readInt8(offset++);
  o.bVisible = buffer.readInt8(offset++);
  o.bNumServicingCrows = buffer.readInt8(offset++);
  o.ubProfile = buffer.readUInt8(offset++);
  o.fHeadTaken = Boolean(buffer.readUInt8(offset++));
  o.ubAIWarningValue = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export function writeRottingCorpseDefinition(o: ROTTING_CORPSE_DEFINITION, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubType, offset);
  offset = buffer.writeUInt8(o.ubBodyType, offset);
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeFloatLE(o.dXPos, offset);
  offset = buffer.writeFloatLE(o.dYPos, offset);
  offset = buffer.writeInt16LE(o.sHeightAdjustment, offset);
  offset = writeStringNL(o.HeadPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.PantsPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.VestPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.SkinPal, buffer, offset, 30, 'ascii');
  offset = buffer.writeInt8(o.bDirection, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiTimeOfDeath, offset);
  offset = buffer.writeUInt16LE(o.usFlags, offset);
  offset = buffer.writeInt8(o.bLevel, offset);
  offset = buffer.writeInt8(o.bVisible, offset);
  offset = buffer.writeInt8(o.bNumServicingCrows, offset);
  offset = buffer.writeUInt8(o.ubProfile, offset);
  offset = buffer.writeUInt8(Number(o.fHeadTaken), offset);
  offset = buffer.writeUInt8(o.ubAIWarningValue, offset);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export interface ROTTING_CORPSE {
  def: ROTTING_CORPSE_DEFINITION;
  fActivated: boolean;

  pAniTile: ANITILE | null /* Pointer<ANITILE> */;

  p8BPPPalette: SGPPaletteEntry[] /* Pointer<SGPPaletteEntry> */;
  p16BPPPalette: Uint16Array /* Pointer<UINT16> */;
  pShades: Uint16Array[] /* Pointer<UINT16>[NUM_CORPSE_SHADES] */;
  sGraphicNum: INT16;
  iCachedTileID: INT32;
  dXPos: FLOAT;
  dYPos: FLOAT;

  fAttractCrowsOnlyWhenOnScreen: boolean;
  iID: INT32;
}

export function createRottingCorpse(): ROTTING_CORPSE {
  return {
    def: createRottingCorpseDefinition(),
    fActivated: false,
    pAniTile: null,
    p8BPPPalette: <SGPPaletteEntry[]><unknown>null,
    p16BPPPalette: <Uint16Array><unknown>null,
    pShades: createArray(NUM_CORPSE_SHADES, <Uint16Array><unknown>null),
    sGraphicNum: 0,
    iCachedTileID: 0,
    dXPos: 0,
    dYPos: 0,
    fAttractCrowsOnlyWhenOnScreen: false,
    iID: 0,
  };
}

export const MAX_ROTTING_CORPSES = 100;

}
