// Flags for DrawTextToScreen()

// Defines for coded text For use with IanDisplayWrappedString()
const TEXT_SPACE = 32;
const TEXT_CODE_NEWLINE = 177;
const TEXT_CODE_BOLD = 178;
const TEXT_CODE_CENTER = 179;
const TEXT_CODE_NEWCOLOR = 180;
const TEXT_CODE_DEFCOLOR = 181;

const LEFT_JUSTIFIED = 0x00000001;
const CENTER_JUSTIFIED = 0x00000002;
const RIGHT_JUSTIFIED = 0x00000004;
const TEXT_SHADOWED = 0x00000008;

const INVALIDATE_TEXT = 0x00000010;
const DONT_DISPLAY_TEXT = 0x00000020; // Wont display the text.  Used if you just want to get how many lines will be displayed

const IAN_WRAP_NO_SHADOW = 32;

const NEWLINE_CHAR = 177;

interface WRAPPED_STRING {
  sString: STR16;
  pNextWrappedString: Pointer<WRAPPED_STRING>;
}
