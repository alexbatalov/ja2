namespace ja2 {

// External globals
export let gubFilename: string /* UINT8[200] */;
export let gfEditMode: boolean = false;
export let gDebugStr: string /* INT8[128] */;
export let gSystemDebugStr: string /* INT8[128] */;
export let gbFPSDisplay: INT8 = SHOW_MIN_FPS;
let gfResetInputCheck: boolean = false;
export let gfGlobalError: boolean = false;

export let guiGameCycleCounter: UINT32 = 0;

export function SET_ERROR(String: string /* Pointer<char> */, ...args: any[]): boolean {
  let ArgPtr: va_list;

  va_start(ArgPtr, String);
  vsprintf(gubErrorText, String, ArgPtr);
  va_end(ArgPtr);

  SetPendingNewScreen(Enum26.ERROR_SCREEN);

  gfGlobalError = true;

  return false;
}

}
