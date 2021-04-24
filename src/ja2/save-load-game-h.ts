namespace ja2 {

export const BYTESINMEGABYTE = 1048576; // 1024*1024
export const REQUIRED_FREE_SPACE = (20 * BYTESINMEGABYTE);

export const SIZE_OF_SAVE_GAME_DESC = 128;

export const GAME_VERSION_LENGTH = 16;

export const SAVE__ERROR_NUM = 99;
export const SAVE__END_TURN_NUM = 98;

export interface SAVED_GAME_HEADER {
  uiSavedGameVersion: UINT32;
  zGameVersionNumber: string /* INT8[GAME_VERSION_LENGTH] */;

  sSavedGameDesc: string /* CHAR16[SIZE_OF_SAVE_GAME_DESC] */;

  uiFlags: UINT32;

  // The following will be used to quickly access info to display in the save/load screen
  uiDay: UINT32;
  ubHour: UINT8;
  ubMin: UINT8;
  sSectorX: INT16;
  sSectorY: INT16;
  bSectorZ: INT8;
  ubNumOfMercsOnPlayersTeam: UINT8;
  iCurrentBalance: INT32;

  uiCurrentScreen: UINT32;

  fAlternateSector: boolean;

  fWorldLoaded: boolean;

  ubLoadScreenID: UINT8; // The load screen that should be used when loading the saved game

  sInitialGameOptions: GAME_OPTIONS; // need these in the header so we can get the info from it on the save load screen.

  uiRandom: UINT32;

  ubFiller: UINT8[] /* [110] */;
}

export function createSavedGameHeader(): SAVED_GAME_HEADER {
  return {
    uiSavedGameVersion: 0,
    zGameVersionNumber: "",
    sSavedGameDesc: "",
    uiFlags: 0,
    uiDay: 0,
    ubHour: 0,
    ubMin: 0,
    sSectorX: 0,
    sSectorY: 0,
    bSectorZ: 0,
    ubNumOfMercsOnPlayersTeam: 0,
    iCurrentBalance: 0,
    uiCurrentScreen: 0,
    fAlternateSector: false,
    fWorldLoaded: false,
    ubLoadScreenID: 0,
    sInitialGameOptions: createGameOptions(),
    uiRandom: 0,
    ubFiller: createArray(110, 0),
  };
}

export function resetSavedGameHeader(o: SAVED_GAME_HEADER) {
  o.uiSavedGameVersion = 0;
  o.zGameVersionNumber = "";
  o.sSavedGameDesc = "";
  o.uiFlags = 0;
  o.uiDay = 0;
  o.ubHour = 0;
  o.ubMin = 0;
  o.sSectorX = 0;
  o.sSectorY = 0;
  o.bSectorZ = 0;
  o.ubNumOfMercsOnPlayersTeam = 0;
  o.iCurrentBalance = 0;
  o.uiCurrentScreen = 0;
  o.fAlternateSector = false;
  o.fWorldLoaded = false;
  o.ubLoadScreenID = 0;
  resetGameOptions(o.sInitialGameOptions);
  o.uiRandom = 0;
  o.ubFiller.fill(0);
}

export const SAVED_GAME_HEADER_SIZE = 432;

export function readSavedGameHeader(o: SAVED_GAME_HEADER, buffer: Buffer, offset: number = 0): number {
  o.uiSavedGameVersion = buffer.readUInt32LE(offset); offset += 4;
  o.zGameVersionNumber = readStringNL(buffer, 'ascii', offset, offset + GAME_VERSION_LENGTH); offset += GAME_VERSION_LENGTH;
  o.sSavedGameDesc = readStringNL(buffer, 'utf16le', offset, offset + SIZE_OF_SAVE_GAME_DESC * 2); offset += SIZE_OF_SAVE_GAME_DESC * 2;
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  o.uiDay = buffer.readUInt32LE(offset); offset += 4;
  o.ubHour = buffer.readUInt8(offset++);
  o.ubMin = buffer.readUInt8(offset++);
  o.sSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readInt16LE(offset); offset += 2;
  o.bSectorZ = buffer.readInt8(offset++);
  o.ubNumOfMercsOnPlayersTeam = buffer.readUInt8(offset++);
  o.iCurrentBalance = buffer.readInt32LE(offset); offset += 4;
  o.uiCurrentScreen = buffer.readUInt32LE(offset); offset += 4;
  o.fAlternateSector = Boolean(buffer.readUInt8(offset++));
  o.fWorldLoaded = Boolean(buffer.readUInt8(offset++));
  o.ubLoadScreenID = buffer.readUInt8(offset++);
  offset = readGameOptions(o.sInitialGameOptions, buffer, offset);
  offset++; // padding
  o.uiRandom = buffer.readUInt32LE(offset); offset += 4;
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  offset += 2; // padding
  return offset;
}

export function writeSavedGameHeader(o: SAVED_GAME_HEADER, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiSavedGameVersion, offset);
  offset = writeStringNL(o.zGameVersionNumber, buffer, offset, GAME_VERSION_LENGTH, 'ascii');
  offset = writeStringNL(o.sSavedGameDesc, buffer, offset, SIZE_OF_SAVE_GAME_DESC * 2, 'utf16le');
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = buffer.writeUInt32LE(o.uiDay, offset);
  offset = buffer.writeUInt8(o.ubHour, offset);
  offset = buffer.writeUInt8(o.ubMin, offset);
  offset = buffer.writeInt16LE(o.sSectorX, offset);
  offset = buffer.writeInt16LE(o.sSectorY, offset);
  offset = buffer.writeInt8(o.bSectorZ, offset);
  offset = buffer.writeUInt8(o.ubNumOfMercsOnPlayersTeam, offset);
  offset = buffer.writeInt32LE(o.iCurrentBalance, offset);
  offset = buffer.writeUInt32LE(o.uiCurrentScreen, offset);
  offset = buffer.writeUInt8(Number(o.fAlternateSector), offset);
  offset = buffer.writeUInt8(Number(o.fWorldLoaded), offset);
  offset = buffer.writeUInt8(o.ubLoadScreenID, offset);
  offset = writeGameOptions(o.sInitialGameOptions, buffer, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiRandom, offset);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  offset = writePadding(buffer, offset, 2); // padding
  return offset;
}

}
