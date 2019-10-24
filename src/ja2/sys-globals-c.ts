// External globals
let gubFilename: UINT8[] /* [200] */;
let gfEditMode: boolean = false;
let gDebugStr: INT8[] /* [128] */;
let gSystemDebugStr: INT8[] /* [128] */;
let gbFPSDisplay: INT8 = SHOW_MIN_FPS;
let gfResetInputCheck: boolean = false;
let gfGlobalError: boolean = false;

let guiGameCycleCounter: UINT32 = 0;

function SET_ERROR(String: Pointer<char>, ...args: any[]): boolean {
  let ArgPtr: va_list;

  va_start(ArgPtr, String);
  vsprintf(gubErrorText, String, ArgPtr);
  va_end(ArgPtr);

  SetPendingNewScreen(Enum26.ERROR_SCREEN);

  gfGlobalError = true;

  return false;
}
