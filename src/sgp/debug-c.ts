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

BOOLEAN gfRecordToFile = FALSE;
BOOLEAN gfRecordToDebugger = TRUE;

// moved from header file: 24mar98:HJH
UINT32 guiProfileStart, guiExecutions, guiProfileTime;
INT32 giProfileCount;

// Had to move these outside the ifdef SGP_DEBUG below, because
// they are required for the String() function, which is NOT a
// debug-mode only function, it's used in release-mode as well! -- DB

UINT8 gubAssertString[128];

#define MAX_MSG_LENGTH2 512
UINT8 gbTmpDebugString[8][MAX_MSG_LENGTH2];
UINT8 gubStringIndex = 0;

// This is NOT a _DEBUG only function! It is also needed in
// release mode builds. -- DB
UINT8 *String(const char *String, ...) {
  va_list ArgPtr;
  UINT8 usIndex;

  // Record string index. This index is used since we live in a multitasking environment.
  // It is still not bulletproof, but it's better than a single string
  usIndex = gubStringIndex++;
  if (gubStringIndex == 8) {
    // reset string pointer
    gubStringIndex = 0;
  }

  va_start(ArgPtr, String);
  vsprintf(gbTmpDebugString[usIndex], String, ArgPtr);
  va_end(ArgPtr);

  return gbTmpDebugString[usIndex];
}
