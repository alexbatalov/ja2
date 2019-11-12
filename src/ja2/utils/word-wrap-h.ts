namespace ja2 {

// Flags for DrawTextToScreen()

// Defines for coded text For use with IanDisplayWrappedString()
export const TEXT_SPACE = 32;
export const TEXT_CODE_NEWLINE = 177;
export const TEXT_CODE_BOLD = 178;
export const TEXT_CODE_CENTER = 179;
export const TEXT_CODE_NEWCOLOR = 180;
export const TEXT_CODE_DEFCOLOR = 181;

export const LEFT_JUSTIFIED = 0x00000001;
export const CENTER_JUSTIFIED = 0x00000002;
export const RIGHT_JUSTIFIED = 0x00000004;
export const TEXT_SHADOWED = 0x00000008;

export const INVALIDATE_TEXT = 0x00000010;
export const DONT_DISPLAY_TEXT = 0x00000020; // Wont display the text.  Used if you just want to get how many lines will be displayed

export const IAN_WRAP_NO_SHADOW = 32;

export const NEWLINE_CHAR = 177;

export interface WRAPPED_STRING {
  sString: string /* STR16 */;
  pNextWrappedString: WRAPPED_STRING | null /* Pointer<WRAPPED_STRING> */;
}

}
