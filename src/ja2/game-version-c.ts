//
//	Keeps track of the game version
//

// RELEASE BUILD VERSION
INT16 zVersionLabel[16] = { L"Release v1.12" };

INT8 czVersionNumber[16] = { "Build 04.12.02" };
INT16 zTrackingNumber[16] = { L"Z" };

//
//		Keeps track of the saved game version.  Increment the saved game version whenever
//	you will invalidate the saved game file

const SAVE_GAME_VERSION = 99;

const UINT32 guiSavedGameVersion = SAVE_GAME_VERSION;
