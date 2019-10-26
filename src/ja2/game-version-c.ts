namespace ja2 {

//
//	Keeps track of the game version
//

// RELEASE BUILD VERSION
export let zVersionLabel: INT16[] /* [16] */ = [ "Release v1.12" ];

export let czVersionNumber: INT8[] /* [16] */ = [ "Build 04.12.02" ];
export let zTrackingNumber: INT16[] /* [16] */ = [ "Z" ];

//
//		Keeps track of the saved game version.  Increment the saved game version whenever
//	you will invalidate the saved game file

const SAVE_GAME_VERSION = 99;

const guiSavedGameVersion: UINT32 = SAVE_GAME_VERSION;

}
