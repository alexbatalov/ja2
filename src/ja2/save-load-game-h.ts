export const BYTESINMEGABYTE = 1048576; // 1024*1024
export const REQUIRED_FREE_SPACE = (20 * BYTESINMEGABYTE);

export const SIZE_OF_SAVE_GAME_DESC = 128;

export const GAME_VERSION_LENGTH = 16;

export const SAVE__ERROR_NUM = 99;
export const SAVE__END_TURN_NUM = 98;

export interface SAVED_GAME_HEADER {
  uiSavedGameVersion: UINT32;
  zGameVersionNumber: INT8[] /* [GAME_VERSION_LENGTH] */;

  sSavedGameDesc: CHAR16[] /* [SIZE_OF_SAVE_GAME_DESC] */;

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
