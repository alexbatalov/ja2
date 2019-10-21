// External globals
UINT8 gubFilename[200];
BOOLEAN gfEditMode = FALSE;
INT8 gDebugStr[128];
INT8 gSystemDebugStr[128];
INT8 gbFPSDisplay = SHOW_MIN_FPS;
BOOLEAN gfResetInputCheck = FALSE;
BOOLEAN gfGlobalError = FALSE;

UINT32 guiGameCycleCounter = 0;

function SET_ERROR(String: Pointer<char>, ...args: any[]): BOOLEAN {
  va_list ArgPtr;

  va_start(ArgPtr, String);
  vsprintf(gubErrorText, String, ArgPtr);
  va_end(ArgPtr);

  SetPendingNewScreen(ERROR_SCREEN);

  gfGlobalError = TRUE;

  return FALSE;
}
