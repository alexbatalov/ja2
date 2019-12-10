namespace ja2 {

// JA2

//**************************************************************************
//
// Filename :	debug.c
//
//	Purpose :	debug manager implementation
//
// Modification history :
//
//		xxxxx96:LH				- Creation
//		xxnov96:HJH				- made it work
//
//**************************************************************************

let gfRecordToFile: boolean = false;
let gfRecordToDebugger: boolean = true;

// moved from header file: 24mar98:HJH
export let guiProfileStart: UINT32;
export let guiExecutions: UINT32;
export let guiProfileTime: UINT32;
export let giProfileCount: INT32;

// Had to move these outside the ifdef SGP_DEBUG below, because
// they are required for the String() function, which is NOT a
// debug-mode only function, it's used in release-mode as well! -- DB

let gubAssertString: string /* UINT8[128] */;

const MAX_MSG_LENGTH2 = 512;
let gbTmpDebugString: string[] /* UINT8[8][MAX_MSG_LENGTH2] */ = createArray(8, '');
let gubStringIndex: UINT8 = 0;

// This is NOT a _DEBUG only function! It is also needed in
// release mode builds. -- DB
export function FormatString(string: string /* Pointer<char> */, ...args: any[]): string /* Pointer<UINT8> */ {
  let usIndex: UINT8;

  // Record string index. This index is used since we live in a multitasking environment.
  // It is still not bulletproof, but it's better than a single string
  usIndex = gubStringIndex++;
  if (gubStringIndex == 8) {
    // reset string pointer
    gubStringIndex = 0;
  }

  gbTmpDebugString[usIndex] = sprintf(string, ...args);

  return gbTmpDebugString[usIndex];
}

}
