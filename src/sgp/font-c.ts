namespace ja2 {

//*******************************************************
//
//   Defines
//
//*******************************************************

const PALETTE_SIZE = 768;
const STRING_DELIMITER = 0;
const ID_BLACK = 0;
const MAX_FONTS = 25;

//*******************************************************
//
//   Typedefs
//
//*******************************************************

interface FontManager {
  usDefaultPixelDepth: UINT16;
  pTranslationTable: FontTranslationTable /* Pointer<FontTranslationTable> */;
}

function createFontManager(): FontManager {
  return {
    usDefaultPixelDepth: 0,
    pTranslationTable: <FontTranslationTable><unknown>null,
  };
}

let pFManager: FontManager /* Pointer<FontManager> */;
let FontObjs: SGPVObject[] /* [MAX_FONTS] */ = createArray(MAX_FONTS, <SGPVObject><unknown>null);
let FontsLoaded: INT32 = 0;

// Destination printing parameters
export let FontDefault: INT32 = (-1);
export let FontDestBuffer: UINT32 = BACKBUFFER;
let FontDestPitch: UINT32 = 640 * 2;
let FontDestBPP: UINT32 = 16;
export let FontDestRegion: SGPRect = createSGPRectFrom(0, 0, 640, 480);
export let FontDestWrap: boolean = false;
let FontForeground16: UINT16 = 0;
let FontBackground16: UINT16 = 0;
let FontShadow16: UINT16 = DEFAULT_SHADOW;
let FontForeground8: UINT8 = 0;
let FontBackground8: UINT8 = 0;

// Temp, for saving printing parameters
let SaveFontDefault: INT32 = (-1);
let SaveFontDestBuffer: UINT32 = BACKBUFFER;
let SaveFontDestPitch: UINT32 = 640 * 2;
let SaveFontDestBPP: UINT32 = 16;
let SaveFontDestRegion: SGPRect = createSGPRectFrom(0, 0, 640, 480);
let SaveFontDestWrap: boolean = false;
let SaveFontForeground16: UINT16 = 0;
let SaveFontShadow16: UINT16 = 0;
let SaveFontBackground16: UINT16 = 0;
let SaveFontForeground8: UINT8 = 0;
let SaveFontBackground8: UINT8 = 0;

//*****************************************************************************
// SetFontColors
//
//	Sets both the foreground and the background colors of the current font. The
// top byte of the parameter word is the background color, and the bottom byte
// is the foreground.
//
//*****************************************************************************
export function SetFontColors(usColors: UINT16): void {
  let ubForeground: UINT8;
  let ubBackground: UINT8;

  ubForeground = (usColors & 0xff);
  ubBackground = ((usColors & 0xff00) >> 8);

  SetFontForeground(ubForeground);
  SetFontBackground(ubBackground);
}

//*****************************************************************************
// SetFontForeground
//
//	Sets the foreground color of the currently selected font. The parameter is
// the index into the 8-bit palette. In 8BPP mode, that index number is used
// for the pixel value to be drawn for nontransparent pixels. In 16BPP mode,
// the RGB values from the palette are used to create the pixel color. Note
// that if you change fonts, the selected foreground/background colors will
// stay at what they are currently set to.
//
//*****************************************************************************
export function SetFontForeground(ubForeground: UINT8): void {
  let uiRed: UINT32;
  let uiGreen: UINT32;
  let uiBlue: UINT32;

  if ((FontDefault < 0) || (FontDefault > MAX_FONTS))
    return;

  FontForeground8 = ubForeground;

  uiRed = FontObjs[FontDefault].pPaletteEntry[ubForeground].peRed;
  uiGreen = FontObjs[FontDefault].pPaletteEntry[ubForeground].peGreen;
  uiBlue = FontObjs[FontDefault].pPaletteEntry[ubForeground].peBlue;

  FontForeground16 = Get16BPPColor(FROMRGB(uiRed, uiGreen, uiBlue));
}

export function SetFontShadow(ubShadow: UINT8): void {
  let uiRed: UINT32;
  let uiGreen: UINT32;
  let uiBlue: UINT32;

  if ((FontDefault < 0) || (FontDefault > MAX_FONTS))
    return;

  // FontForeground8=ubForeground;

  uiRed = FontObjs[FontDefault].pPaletteEntry[ubShadow].peRed;
  uiGreen = FontObjs[FontDefault].pPaletteEntry[ubShadow].peGreen;
  uiBlue = FontObjs[FontDefault].pPaletteEntry[ubShadow].peBlue;

  FontShadow16 = Get16BPPColor(FROMRGB(uiRed, uiGreen, uiBlue));

  if (ubShadow != 0) {
    if (FontShadow16 == 0) {
      FontShadow16 = 1;
    }
  }
}

//*****************************************************************************
// SetFontBackground
//
//	Sets the Background color of the currently selected font. The parameter is
// the index into the 8-bit palette. In 8BPP mode, that index number is used
// for the pixel value to be drawn for nontransparent pixels. In 16BPP mode,
// the RGB values from the palette are used to create the pixel color. If the
// background value is zero, the background of the font will be transparent.
// Note that if you change fonts, the selected foreground/background colors will
// stay at what they are currently set to.
//
//*****************************************************************************
export function SetFontBackground(ubBackground: UINT8): void {
  let uiRed: UINT32;
  let uiGreen: UINT32;
  let uiBlue: UINT32;

  if ((FontDefault < 0) || (FontDefault > MAX_FONTS))
    return;

  FontBackground8 = ubBackground;

  uiRed = FontObjs[FontDefault].pPaletteEntry[ubBackground].peRed;
  uiGreen = FontObjs[FontDefault].pPaletteEntry[ubBackground].peGreen;
  uiBlue = FontObjs[FontDefault].pPaletteEntry[ubBackground].peBlue;

  FontBackground16 = Get16BPPColor(FROMRGB(uiRed, uiGreen, uiBlue));
}

// Kris:  These are new counterparts to the above functions.  They won't
//			 effect an 8BPP font, only 16.
function SetRGBFontForeground(uiRed: UINT32, uiGreen: UINT32, uiBlue: UINT32): void {
  if ((FontDefault < 0) || (FontDefault > MAX_FONTS))
    return;
  FontForeground16 = Get16BPPColor(FROMRGB(uiRed, uiGreen, uiBlue));
}

function SetRGBFontBackground(uiRed: UINT32, uiGreen: UINT32, uiBlue: UINT32): void {
  if ((FontDefault < 0) || (FontDefault > MAX_FONTS))
    return;
  FontBackground16 = Get16BPPColor(FROMRGB(uiRed, uiGreen, uiBlue));
}

function SetRGBFontShadow(uiRed: UINT32, uiGreen: UINT32, uiBlue: UINT32): void {
  if ((FontDefault < 0) || (FontDefault > MAX_FONTS))
    return;
  FontShadow16 = Get16BPPColor(FROMRGB(uiRed, uiGreen, uiBlue));
}
// end Kris

//*****************************************************************************
// ResetFontObjectPalette
//
//	Sets the palette of a font, using an 8 bit palette (which is converted to
// the appropriate 16-bit palette, and assigned to the HVOBJECT).
//
//*****************************************************************************
function ResetFontObjectPalette(iFont: INT32): boolean {
  Assert(iFont >= 0);
  Assert(iFont <= MAX_FONTS);
  Assert(FontObjs[iFont] != null);

  SetFontObjectPalette8BPP(iFont, FontObjs[iFont].pPaletteEntry);

  return true;
}

//*****************************************************************************
// SetFontObjectPalette8BPP
//
//	Sets the palette of a font, using an 8 bit palette (which is converted to
// the appropriate 16-bit palette, and assigned to the HVOBJECT).
//
//*****************************************************************************
function SetFontObjectPalette8BPP(iFont: INT32, pPal8: SGPPaletteEntry[]): Uint16Array {
  let pPal16: Uint16Array | null;

  Assert(iFont >= 0);
  Assert(iFont <= MAX_FONTS);
  Assert(FontObjs[iFont] != null);

  if ((pPal16 = Create16BPPPalette(pPal8)) == null)
    return <Uint16Array><unknown>null;

  FontObjs[iFont].p16BPPPalette = pPal16;
  FontObjs[iFont].pShadeCurrent = pPal16;

  return pPal16;
}

//*****************************************************************************
// SetFontObjectPalette16BPP
//
//	Sets the palette of a font, using a 16 bit palette.
//
//*****************************************************************************
function SetFontObjectPalette16BPP(iFont: INT32, pPal16: Uint16Array): Uint16Array {
  Assert(iFont >= 0);
  Assert(iFont <= MAX_FONTS);
  Assert(FontObjs[iFont] != null);

  FontObjs[iFont].p16BPPPalette = pPal16;
  FontObjs[iFont].pShadeCurrent = pPal16;

  return pPal16;
}

//*****************************************************************************
// GetFontObjectPalette16BPP
//
//	Sets the palette of a font, using a 16 bit palette.
//
//*****************************************************************************
function GetFontObjectPalette16BPP(iFont: INT32): Uint16Array {
  Assert(iFont >= 0);
  Assert(iFont <= MAX_FONTS);
  Assert(FontObjs[iFont] != null);

  return FontObjs[iFont].p16BPPPalette;
}

//*****************************************************************************
// GetFontObject
//
//	Returns the VOBJECT pointer of a font.
//
//*****************************************************************************
export function GetFontObject(iFont: INT32): SGPVObject {
  Assert(iFont >= 0);
  Assert(iFont <= MAX_FONTS);
  Assert(FontObjs[iFont] != null);

  return FontObjs[iFont];
}

//*****************************************************************************
// FindFreeFont
//
//	Locates an empty slot in the font table.
//
//*****************************************************************************
function FindFreeFont(): INT32 {
  let count: number;

  for (count = 0; count < MAX_FONTS; count++)
    if (FontObjs[count] == null)
      return count;

  return -1;
}

//*****************************************************************************
// LoadFontFile
//
//	Loads a font from an ETRLE file, and inserts it into one of the font slots.
//  This function returns (-1) if it fails, and debug msgs for a reason.
//  Otherwise the font number is returned.
//*****************************************************************************
export function LoadFontFile(filename: string /* Pointer<UINT8> */): INT32 {
  let vo_desc: VOBJECT_DESC = createVObjectDesc();
  let LoadIndex: UINT32;

  Assert(filename != null);
  Assert(filename.length);

  if ((LoadIndex = FindFreeFont()) == (-1)) {
    DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, FormatString("Out of font slots (%s)", filename));
    FatalError("Cannot init FONT file %s", filename);
    return -1;
  }

  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  vo_desc.ImageFile = filename;

  if ((FontObjs[LoadIndex] = CreateVideoObject(vo_desc)) == null) {
    DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, FormatString("Error creating VOBJECT (%s)", filename));
    FatalError("Cannot init FONT file %s", filename);
    return -1;
  }

  if (FontDefault == (-1))
    FontDefault = LoadIndex;

  return LoadIndex;
}

//*****************************************************************************
// UnloadFont - Delete the font structure
//
//	Deletes the video object of a particular font. Frees up the memory and
// resources allocated for it.
//
//*****************************************************************************
export function UnloadFont(FontIndex: UINT32): void {
  Assert(FontIndex >= 0);
  Assert(FontIndex <= MAX_FONTS);
  Assert(FontObjs[FontIndex] != null);

  DeleteVideoObject(FontObjs[FontIndex]);
  FontObjs[FontIndex] = <SGPVObject><unknown>null;
}

//*****************************************************************************
// GetWidth
//
//	Returns the width of a given character in the font.
//
//*****************************************************************************
export function GetWidth(hSrcVObject: SGPVObject, ssIndex: INT16): UINT32 {
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);

  if (ssIndex < 0 || ssIndex > 92) {
    let i: number = 0;
  }

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[ssIndex];
  return (pTrav.usWidth + pTrav.sOffsetX);
}

//*****************************************************************************
// StringPixLengthArg
//
//		Returns the length of a string with a variable number of arguments, in
// pixels, using the current font. Maximum length in characters the string can
// evaluate to is 512.
//    'uiCharCount' specifies how many characters of the string are counted.
//*****************************************************************************
export function StringPixLengthArg(usUseFont: INT32, uiCharCount: UINT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): INT16 {
  let string: string /* wchar_t[512] */;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  // make sure the character count is legal
  if (uiCharCount > string.length) {
    uiCharCount = string.length;
  } else {
    if (uiCharCount < string.length) {
      // less than the full string, so whack off the end of it (it's temporary anyway)
      string = string.substring(0, uiCharCount);
    }
  }

  return StringPixLength(string, usUseFont);
}

//*****************************************************************************
// StringPixLengthArg
//
// Returns the length of a string with a variable number of arguments, in
// pixels, using the current font. Maximum length in characters the string can
// evaluate to is 512.  Because this is for fast help text, all '|' characters are ignored for the
// width calculation.
// 'uiCharCount' specifies how many characters of the string are counted.
// YOU HAVE TO PREBUILD THE FAST HELP STRING!
//*****************************************************************************
export function StringPixLengthArgFastHelp(usUseFont: INT32, usBoldFont: INT32, uiCharCount: UINT32, pFontString: string /* Pointer<UINT16> */): INT16 {
  let string: string /* wchar_t[512] */;
  let i: UINT32;
  let index: UINT32;
  let sBoldDiff: INT16 = 0;
  let str: string /* UINT16[2] */;

  Assert(pFontString != null);

  string = pFontString;

  // make sure the character count is legal
  if (uiCharCount > string.length) {
    uiCharCount = string.length;
  } else {
    if (uiCharCount < string.length) {
      // less than the full string, so whack off the end of it (it's temporary anyway)
      string = string.substring(0, uiCharCount);
    }
  }
  // now eliminate all '|' characters from the string.
  i = 0;
  while (i < uiCharCount) {
    if (string[i] == '|') {
      string = string.substring(0, i) + string.substring(i + 1);
      uiCharCount--;
      // now we have eliminated the '|' character, so now calculate the size difference of the
      // bolded character.
      str = string[i];
      sBoldDiff += StringPixLength(str, usBoldFont) - StringPixLength(str, usUseFont);
    }
    i++;
  }
  return StringPixLength(string, usUseFont) + sBoldDiff;
}

//*****************************************************************************************
//
//  StringNPixLength
//
//  Return the length of the of the string or count characters in the
//  string, which ever comes first.
//
//  Returns INT16
//
//  Created by:     Gilles Beauparlant
//  Created on:     12/1/99
//
//*****************************************************************************************
function StringNPixLength(string: string /* Pointer<UINT16> */, uiMaxCount: UINT32, UseFont: INT32): INT16 {
  let Cur: UINT32;
  let uiCharCount: UINT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;

  Cur = 0;
  uiCharCount = 0;
  curletter = 0;

  while (curletter < string.length && uiCharCount < uiMaxCount) {
    transletter = GetIndex(string.charCodeAt(curletter++));
    Cur += GetWidth(FontObjs[UseFont], transletter);
    uiCharCount++;
  }
  return Cur;
}

//*****************************************************************************
//
// StringPixLength
//
//	Returns the length of a string in pixels, depending on the font given.
//
//*****************************************************************************
export function StringPixLength(string: string /* Pointer<UINT16> */, UseFont: INT32): INT16 {
  let Cur: UINT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;

  if (string == null) {
    return 0;
  }

  Cur = 0;
  curletter = 0;

  while (curletter < string.length) {
    transletter = GetIndex(string.charCodeAt(curletter++));
    Cur += GetWidth(FontObjs[UseFont], transletter);
  }
  return Cur;
}

//*****************************************************************************
//
// SaveFontSettings
//
//	Saves the current font printing settings into temporary locations.
//
//*****************************************************************************
export function SaveFontSettings(): void {
  SaveFontDefault = FontDefault;
  SaveFontDestBuffer = FontDestBuffer;
  SaveFontDestPitch = FontDestPitch;
  SaveFontDestBPP = FontDestBPP;
  copySGPRect(SaveFontDestRegion, FontDestRegion);
  SaveFontDestWrap = FontDestWrap;
  SaveFontForeground16 = FontForeground16;
  SaveFontShadow16 = FontShadow16;
  SaveFontBackground16 = FontBackground16;
  SaveFontForeground8 = FontForeground8;
  SaveFontBackground8 = FontBackground8;
}

//*****************************************************************************
//
// RestoreFontSettings
//
//	Restores the last saved font printing settings from the temporary lactions
//
//*****************************************************************************
export function RestoreFontSettings(): void {
  FontDefault = SaveFontDefault;
  FontDestBuffer = SaveFontDestBuffer;
  FontDestPitch = SaveFontDestPitch;
  FontDestBPP = SaveFontDestBPP;
  copySGPRect(FontDestRegion, SaveFontDestRegion);
  FontDestWrap = SaveFontDestWrap;
  FontForeground16 = SaveFontForeground16;
  FontShadow16 = SaveFontShadow16;
  FontBackground16 = SaveFontBackground16;
  FontForeground8 = SaveFontForeground8;
  FontBackground8 = SaveFontBackground8;
}

//*****************************************************************************
// GetHeight
//
//	Returns the height of a given character in the font.
//
//*****************************************************************************
function GetHeight(hSrcVObject: SGPVObject, ssIndex: INT16): UINT32 {
  let pTrav: ETRLEObject;

  // Assertions
  Assert(hSrcVObject != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[ssIndex];
  return (pTrav.usHeight + pTrav.sOffsetY);
}

//*****************************************************************************
//
// GetFontHeight
//
//	Returns the height of the first character in a font.
//
//*****************************************************************************
export function GetFontHeight(FontNum: INT32): UINT16 {
  Assert(FontNum >= 0);
  Assert(FontNum <= MAX_FONTS);
  Assert(FontObjs[FontNum] != null);

  return GetHeight(FontObjs[FontNum], 0);
}

//*****************************************************************************
// GetIndex
//
//		Given a word-sized character, this function returns the index of the
//	cell in the font to print to the screen. The conversion table is built by
//	CreateEnglishTransTable()
//
//*****************************************************************************
export function GetIndex(siChar: UINT16): INT16 {
  let pTrav: UINT16;
  let ssCount: UINT16 = 0;
  let usNumberOfSymbols: UINT16 = pFManager.pTranslationTable.usNumberOfSymbols;

  // search the Translation Table and return the index for the font
  while (ssCount < usNumberOfSymbols) {
    pTrav = pFManager.pTranslationTable.DynamicArrayOf16BitValues[ssCount];
    if (siChar == pTrav) {
      return ssCount;
    }
    ssCount++;
  }

  // If here, present warning and give the first index
  DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, FormatString("Error: Invalid character given %d", siChar));

  // Return 0 here, NOT -1 - we should see A's here now...
  return 0;
}

//*****************************************************************************
// SetFont
//
//	Sets the current font number.
//
//*****************************************************************************
export function SetFont(iFontIndex: INT32): boolean {
  Assert(iFontIndex >= 0);
  Assert(iFontIndex <= MAX_FONTS);
  Assert(FontObjs[iFontIndex] != null);

  FontDefault = iFontIndex;
  return true;
}

//*****************************************************************************
// SetFontDestBuffer
//
//	Sets the destination buffer for printing to, the clipping rectangle, and
// sets the line wrap on/off. DestBuffer is a VOBJECT handle, not a pointer.
//
//*****************************************************************************
export function SetFontDestBuffer(DestBuffer: UINT32, x1: INT32, y1: INT32, x2: INT32, y2: INT32, wrap: boolean): boolean {
  Assert(x2 > x1);
  Assert(y2 > y1);

  FontDestBuffer = DestBuffer;

  FontDestRegion.iLeft = x1;
  FontDestRegion.iTop = y1;
  FontDestRegion.iRight = x2;
  FontDestRegion.iBottom = y2;
  FontDestWrap = wrap;

  return true;
}

//*****************************************************************************
// mprintf
//
//	Prints to the currently selected destination buffer, at the X/Y coordinates
// specified, using the currently selected font. Other than the X/Y coordinates,
// the parameters are identical to printf. The resulting string may be no longer
// than 512 word-characters. Uses monochrome font color settings
//*****************************************************************************
export function mprintf(x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;
  let uiDestPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = Math.floor(x);
  desty = Math.floor(y);

  // Lock the dest buffer
  pDestBuf = LockVideoSurface(FontDestBuffer, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));

  while (curletter < string.length)  {
    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontDefault], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontDefault], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground8, FontBackground8);
    } else {
      Blt8BPPDataTo16BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground16, FontBackground16, FontShadow16);
    }
    destx += GetWidth(FontObjs[FontDefault], transletter);
  }

  // Unlock buffer
  UnLockVideoSurface(FontDestBuffer);

  return 0;
}

export function VarFindFontRightCoordinates(sLeft: INT16, sTop: INT16, sWidth: INT16, sHeight: INT16, iFontIndex: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): { sX: INT16, sY: INT16 } {
  let string: string /* wchar_t[512] */;

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  return FindFontRightCoordinates(sLeft, sTop, sWidth, sHeight, string, iFontIndex);
}

export function VarFindFontCenterCoordinates(sLeft: INT16, sTop: INT16, sWidth: INT16, sHeight: INT16, iFontIndex: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): { sX: INT16, sY: INT16 } {
  let string: string /* wchar_t[512] */;

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  return FindFontCenterCoordinates(sLeft, sTop, sWidth, sHeight, string, iFontIndex);
}

export function FindFontRightCoordinates(sLeft: INT16, sTop: INT16, sWidth: INT16, sHeight: INT16, pStr: string /* Pointer<UINT16> */, iFontIndex: INT32): { sX: INT16, sY: INT16 } {
  let xp: INT16;
  let yp: INT16;

  // Compute the coordinates to right justify the text
  xp = ((sWidth - StringPixLength(pStr, iFontIndex))) + sLeft;
  yp = ((sHeight - GetFontHeight(iFontIndex)) / 2) + sTop;

  return { sX: xp, sY: yp };
}

export function FindFontCenterCoordinates(sLeft: INT16, sTop: INT16, sWidth: INT16, sHeight: INT16, pStr: string /* Pointer<UINT16> */, iFontIndex: INT32): { sX: INT16, sY: INT16 } {
  let xp: INT16;
  let yp: INT16;

  // Compute the coordinates to center the text
  xp = ((sWidth - StringPixLength(pStr, iFontIndex) + 1) / 2) + sLeft;
  yp = ((sHeight - GetFontHeight(iFontIndex)) / 2) + sTop;

  return { sX: xp, sY: yp };
}

//*****************************************************************************
// gprintf
//
//	Prints to the currently selected destination buffer, at the X/Y coordinates
// specified, using the currently selected font. Other than the X/Y coordinates,
// the parameters are identical to printf. The resulting string may be no longer
// than 512 word-characters.
//*****************************************************************************
export function gprintf(x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;
  let uiDestPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = x;
  desty = y;

  // Lock the dest buffer
  pDestBuf = LockVideoSurface(FontDestBuffer, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));

  while (curletter < string.length) {
    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontDefault], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontDefault], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion);
    } else {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion);
    }
    destx += GetWidth(FontObjs[FontDefault], transletter);
  }

  // Unlock buffer
  UnLockVideoSurface(FontDestBuffer);

  return 0;
}

function gprintfDirty(x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;
  let uiDestPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = x;
  desty = y;

  // Lock the dest buffer
  pDestBuf = LockVideoSurface(FontDestBuffer, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));

  while (curletter < string.length) {
    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontDefault], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontDefault], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion);
    } else {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion);
    }
    destx += GetWidth(FontObjs[FontDefault], transletter);
  }

  // Unlock buffer
  UnLockVideoSurface(FontDestBuffer);

  InvalidateRegion(x, y, x + StringPixLength(string, FontDefault), y + GetFontHeight(FontDefault));

  return 0;
}
//*****************************************************************************
// gprintf_buffer
//
//	Prints to the currently selected destination buffer, at the X/Y coordinates
// specified, using the currently selected font. Other than the X/Y coordinates,
// the parameters are identical to printf. The resulting string may be no longer
// than 512 word-characters.
//*****************************************************************************
function gprintf_buffer(pDestBuf: Uint8ClampedArray, uiDestPitchBYTES: UINT32, FontType: UINT32, x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = x;
  desty = y;

  while (curletter < string.length) {
    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontType], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontType], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion);
    } else {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion);
    }

    destx += GetWidth(FontObjs[FontType], transletter);
  }

  return 0;
}

export function mprintf_buffer(pDestBuf: Uint8ClampedArray, uiDestPitchBYTES: UINT32, FontType: UINT32, x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = x;
  desty = y;

  while (curletter < string.length) {
    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontDefault], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontDefault], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground8, FontBackground8);
    } else {
      Blt8BPPDataTo16BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground16, FontBackground16, FontShadow16);
    }
    destx += GetWidth(FontObjs[FontDefault], transletter);
  }

  return 0;
}

export function mprintf_buffer_coded(pDestBuf: Uint8ClampedArray, uiDestPitchBYTES: UINT32, FontType: UINT32, x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;
  let usOldForeColor: UINT16;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = x;
  desty = y;

  usOldForeColor = FontForeground16;

  while (curletter < string.length) {
    if (string.charCodeAt(curletter) == 180) {
      curletter++;
      SetFontForeground(string.charCodeAt(curletter));
      curletter++;
    } else if (string.charCodeAt(curletter) == 181) {
      FontForeground16 = usOldForeColor;
      curletter++;
    }

    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontDefault], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontDefault], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground8, FontBackground8);
    } else {
      Blt8BPPDataTo16BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground16, FontBackground16, FontShadow16);
    }
    destx += GetWidth(FontObjs[FontDefault], transletter);
  }

  return 0;
}

export function mprintf_coded(x: INT32, y: INT32, pFontString: string /* Pointer<UINT16> */, ...args: any[]): UINT32 {
  let destx: INT32;
  let desty: INT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let string: string /* wchar_t[512] */;
  let usOldForeColor: UINT16;
  let uiDestPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;

  Assert(pFontString != null);

  string = swprintf(pFontString, ...args); // process gprintf string (get output str)

  curletter = 0;

  destx = x;
  desty = y;

  usOldForeColor = FontForeground16;

  // Lock the dest buffer
  pDestBuf = LockVideoSurface(FontDestBuffer, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));

  while (curletter < string.length) {
    if (string.charCodeAt(curletter) == 180) {
      curletter++;
      SetFontForeground(string.charCodeAt(curletter));
      curletter++;
    } else if (string.charCodeAt(curletter) == 181) {
      FontForeground16 = usOldForeColor;
      curletter++;
    }

    transletter = GetIndex(string.charCodeAt(curletter++));

    if (FontDestWrap && BltIsClipped(FontObjs[FontDefault], destx, desty, transletter, FontDestRegion)) {
      destx = x;
      desty += GetHeight(FontObjs[FontDefault], transletter);
    }

    // Blit directly
    if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground8, FontBackground8);
    } else {
      Blt8BPPDataTo16BPPBufferMonoShadowClip(pDestBuf, uiDestPitchBYTES, FontObjs[FontDefault], destx, desty, transletter, FontDestRegion, FontForeground16, FontBackground16, FontShadow16);
    }
    destx += GetWidth(FontObjs[FontDefault], transletter);
  }

  // Unlock buffer
  UnLockVideoSurface(FontDestBuffer);

  return 0;
}

//*****************************************************************************
// InitializeFontManager
//
//	Starts up the font manager system with the appropriate translation table.
//
//*****************************************************************************
export function InitializeFontManager(usDefaultPixelDepth: UINT16, pTransTable: FontTranslationTable): boolean {
  let pTransTab: FontTranslationTable;
  let count: number;
  let uiRight: UINT16;
  let uiBottom: UINT16;
  let uiPixelDepth: UINT8;

  FontDefault = (-1);
  FontDestBuffer = BACKBUFFER;
  FontDestPitch = 0;

  //	FontDestBPP=0;

  ({ usWidth: uiRight, usHeight: uiBottom, ubBitDepth: uiPixelDepth } = GetCurrentVideoSettings());
  FontDestRegion.iLeft = 0;
  FontDestRegion.iTop = 0;
  FontDestRegion.iRight = uiRight;
  FontDestRegion.iBottom = uiBottom;
  FontDestBPP = uiPixelDepth;

  FontDestWrap = false;

  // register the appropriate debug topics
  RegisterDebugTopic(TOPIC_FONT_HANDLER, "Font Manager");

  pFManager = createFontManager();

  pTransTab = createFontTranslationTable();

  pFManager.pTranslationTable = pTransTab;
  pFManager.usDefaultPixelDepth = usDefaultPixelDepth;
  pTransTab.usNumberOfSymbols = pTransTable.usNumberOfSymbols;
  pTransTab.DynamicArrayOf16BitValues = pTransTable.DynamicArrayOf16BitValues;

  // Mark all font slots as empty
  for (count = 0; count < MAX_FONTS; count++)
    FontObjs[count] = <SGPVObject><unknown>null;

  return true;
}

//*****************************************************************************
// ShutdownFontManager
//
//	Shuts down, and deallocates all fonts.
//*****************************************************************************
export function ShutdownFontManager(): void {
  let count: INT32;

  UnRegisterDebugTopic(TOPIC_FONT_HANDLER, "Font Manager");
  if (pFManager)
    MemFree(pFManager);

  for (count = 0; count < MAX_FONTS; count++) {
    if (FontObjs[count] != null)
      UnloadFont(count);
  }
}

//*****************************************************************************
// DestroyEnglishTransTable
//
// Destroys the English text->font map table.
//*****************************************************************************
export function DestroyEnglishTransTable(): void {
  if (pFManager) {
    if (pFManager.pTranslationTable != null) {
      if (pFManager.pTranslationTable.DynamicArrayOf16BitValues != null) {
        pFManager.pTranslationTable.DynamicArrayOf16BitValues = <Uint16Array><unknown>null;
      }

      pFManager.pTranslationTable = <FontTranslationTable><unknown>null;
    }
  }
}

//*****************************************************************************
// CreateEnglishTransTable
//
// Creates the English text->font map table.
//*****************************************************************************
export function CreateEnglishTransTable(): FontTranslationTable {
  let pTable: FontTranslationTable;
  let temp: number /* Pointer<UINT16> */;

  pTable = createFontTranslationTable();
  // ha ha, we have more than Wizardry now (again)
  pTable.usNumberOfSymbols = 172;
  pTable.DynamicArrayOf16BitValues = new Uint16Array(pTable.usNumberOfSymbols);
  temp = 0;

  pTable.DynamicArrayOf16BitValues[temp++] = 'A'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'B'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'C'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'D'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'E'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'F'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'G'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'H'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'I'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'J'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'K'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'L'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'M'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'N'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'O'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'P'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'Q'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'R'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'S'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'T'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'U'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'V'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'W'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'X'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'Y'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'Z'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'a'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'b'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'c'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'd'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'e'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'f'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'g'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'h'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'i'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'j'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'k'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'l'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'm'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'n'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'o'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'p'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'q'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'r'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 's'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 't'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'u'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'v'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'w'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'x'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'y'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = 'z'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '0'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '1'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '2'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '3'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '4'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '5'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '6'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '7'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '8'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '9'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '!'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '@'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '#'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '$'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '%'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '^'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '&'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '*'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '('.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = ')'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '-'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '_'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '+'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '='.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '|'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '\\'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '{'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '}'.charCodeAt(0); // 80
  pTable.DynamicArrayOf16BitValues[temp++] = '['.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = ']'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = ':'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '.charCodeAt(0);'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '"'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '\''.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '<'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '>'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = ','.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '.'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '?'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = '/'.charCodeAt(0);
  pTable.DynamicArrayOf16BitValues[temp++] = ' '.charCodeAt(0); // 93

  pTable.DynamicArrayOf16BitValues[temp++] = 196; // "A" umlaut
  pTable.DynamicArrayOf16BitValues[temp++] = 214; // "O" umlaut
  pTable.DynamicArrayOf16BitValues[temp++] = 220; // "U" umlaut
  pTable.DynamicArrayOf16BitValues[temp++] = 228; // "a" umlaut
  pTable.DynamicArrayOf16BitValues[temp++] = 246; // "o" umlaut
  pTable.DynamicArrayOf16BitValues[temp++] = 252; // "u" umlaut
  pTable.DynamicArrayOf16BitValues[temp++] = 223; // double-s that looks like a beta/B  // 100
  // START OF FUNKY RUSSIAN STUFF
  pTable.DynamicArrayOf16BitValues[temp++] = 1101;
  pTable.DynamicArrayOf16BitValues[temp++] = 1102;
  pTable.DynamicArrayOf16BitValues[temp++] = 1103;
  pTable.DynamicArrayOf16BitValues[temp++] = 1104;
  pTable.DynamicArrayOf16BitValues[temp++] = 1105;
  pTable.DynamicArrayOf16BitValues[temp++] = 1106;
  pTable.DynamicArrayOf16BitValues[temp++] = 1107;
  pTable.DynamicArrayOf16BitValues[temp++] = 1108;
  pTable.DynamicArrayOf16BitValues[temp++] = 1109;
  pTable.DynamicArrayOf16BitValues[temp++] = 1110;
  pTable.DynamicArrayOf16BitValues[temp++] = 1111;
  pTable.DynamicArrayOf16BitValues[temp++] = 1112;
  pTable.DynamicArrayOf16BitValues[temp++] = 1113;
  pTable.DynamicArrayOf16BitValues[temp++] = 1114;
  pTable.DynamicArrayOf16BitValues[temp++] = 1115;
  pTable.DynamicArrayOf16BitValues[temp++] = 1116;
  pTable.DynamicArrayOf16BitValues[temp++] = 1117;
  pTable.DynamicArrayOf16BitValues[temp++] = 1118;
  pTable.DynamicArrayOf16BitValues[temp++] = 1119;
  pTable.DynamicArrayOf16BitValues[temp++] = 1120;
  pTable.DynamicArrayOf16BitValues[temp++] = 1121;
  pTable.DynamicArrayOf16BitValues[temp++] = 1122;
  pTable.DynamicArrayOf16BitValues[temp++] = 1123;
  pTable.DynamicArrayOf16BitValues[temp++] = 1124;
  pTable.DynamicArrayOf16BitValues[temp++] = 1125;
  pTable.DynamicArrayOf16BitValues[temp++] = 1126;
  pTable.DynamicArrayOf16BitValues[temp++] = 1127;
  pTable.DynamicArrayOf16BitValues[temp++] = 1128;
  pTable.DynamicArrayOf16BitValues[temp++] = 1129;
  pTable.DynamicArrayOf16BitValues[temp++] = 1130; // 130
  pTable.DynamicArrayOf16BitValues[temp++] = 1131;
  pTable.DynamicArrayOf16BitValues[temp++] = 1132;
  // END OF FUNKY RUSSIAN STUFF
  pTable.DynamicArrayOf16BitValues[temp++] = 196; // Д
  pTable.DynamicArrayOf16BitValues[temp++] = 192; // А
  pTable.DynamicArrayOf16BitValues[temp++] = 193; // Б
  pTable.DynamicArrayOf16BitValues[temp++] = 194; // В
  pTable.DynamicArrayOf16BitValues[temp++] = 199; // З
  pTable.DynamicArrayOf16BitValues[temp++] = 203; // Л
  pTable.DynamicArrayOf16BitValues[temp++] = 200; // И
  pTable.DynamicArrayOf16BitValues[temp++] = 201; // Й				140
  pTable.DynamicArrayOf16BitValues[temp++] = 202; // К
  pTable.DynamicArrayOf16BitValues[temp++] = 207; // П
  pTable.DynamicArrayOf16BitValues[temp++] = 214; // Ц
  pTable.DynamicArrayOf16BitValues[temp++] = 210; // Т
  pTable.DynamicArrayOf16BitValues[temp++] = 211; // У
  pTable.DynamicArrayOf16BitValues[temp++] = 212; // Ф
  pTable.DynamicArrayOf16BitValues[temp++] = 220; // Ь
  pTable.DynamicArrayOf16BitValues[temp++] = 217; // Щ
  pTable.DynamicArrayOf16BitValues[temp++] = 218; // Ъ
  pTable.DynamicArrayOf16BitValues[temp++] = 219; // Ы				150

  pTable.DynamicArrayOf16BitValues[temp++] = 228; // д
  pTable.DynamicArrayOf16BitValues[temp++] = 224; // а
  pTable.DynamicArrayOf16BitValues[temp++] = 225; // б
  pTable.DynamicArrayOf16BitValues[temp++] = 226; // в
  pTable.DynamicArrayOf16BitValues[temp++] = 231; // з
  pTable.DynamicArrayOf16BitValues[temp++] = 235; // л
  pTable.DynamicArrayOf16BitValues[temp++] = 232; // и
  pTable.DynamicArrayOf16BitValues[temp++] = 233; // й
  pTable.DynamicArrayOf16BitValues[temp++] = 234; // к
  pTable.DynamicArrayOf16BitValues[temp++] = 239; // п				160
  pTable.DynamicArrayOf16BitValues[temp++] = 246; // ц
  pTable.DynamicArrayOf16BitValues[temp++] = 242; // т
  pTable.DynamicArrayOf16BitValues[temp++] = 243; // у
  pTable.DynamicArrayOf16BitValues[temp++] = 244; // ф
  pTable.DynamicArrayOf16BitValues[temp++] = 252; // ь
  pTable.DynamicArrayOf16BitValues[temp++] = 249; // щ
  pTable.DynamicArrayOf16BitValues[temp++] = 250; // ъ
  pTable.DynamicArrayOf16BitValues[temp++] = 251; // ы
  pTable.DynamicArrayOf16BitValues[temp++] = 204; // М
  pTable.DynamicArrayOf16BitValues[temp++] = 206; // О				170
  pTable.DynamicArrayOf16BitValues[temp++] = 236; // м
  pTable.DynamicArrayOf16BitValues[temp++] = 238; // о

  return pTable;
}

//*****************************************************************************
//
// LoadFontFile
//
// Parameter List : filename - File created by the utility tool to open
//
// Return Value  pointer to the base structure
//
// Modification History :
// Dec 15th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*FontBase *LoadFontFile(UINT8 *pFilename)
{
  HWFILE           hFileHandle;
  UINT32           uiFileSize;
  UINT32           uiHeightEach;
  UINT32           uiTotalSymbol;
  UINT32           uiNewoffst, uiOldoffst;
  FontBase        *pFontBase;
  SGPPaletteEntry *pNewPalette;
  UINT8           *pPalette;

  if (pFManager == NULL)
  {
    DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Did not Initialize Font Manager");
    return NULL;
  }

  // Open and read in the file
  if ((hFileHandle = FileOpen(pFilename, FILE_ACCESS_READ, FALSE)) == 0)
  { // damn we failed to open the file
    DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Cannot open font file");
    return NULL;
  }

  uiFileSize = FileGetSize(hFileHandle);
  if (uiFileSize == 0)
  { // we failed to size up the file
    DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Font file is empty");
    FileClose(hFileHandle);
    return NULL;
  }

  // Allocate memory for the font header file
  if ((pFontBase = (FontBase *)MemAlloc(sizeof(FontBase))) == NULL)
  {
    DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not malloc memory");
          FileClose(hFileHandle);
  }

  // read in these values from the file
  if (FileRead(hFileHandle, &uiHeightEach, sizeof(UINT32), NULL) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not read Height from File");
          FileClose(hFileHandle);
          return NULL;
  }

  if (FileRead(hFileHandle, &uiTotalSymbol, sizeof(UINT32), NULL) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not read Total Symbol from File");
          FileClose(hFileHandle);
          return NULL;
  }

  // Assign the proper values to the Base structure
  pFontBase->uiHeightEach = uiHeightEach;
  pFontBase->uiTotalElements = uiTotalSymbol;
  pFontBase->pFontObject = (FontObject *)MemAlloc(uiTotalSymbol * sizeof(FontHeader));
  pPalette = (UINT8 *)MemAlloc(PALETTE_SIZE);
  uiOldoffst = (sizeof(FontHeader) + sizeof(FontObject)*pFontBase->uiTotalElements);
  uiNewoffst = uiFileSize - uiOldoffst;
  pFontBase->pPixData8 = (UINT8 *)MemAlloc(uiNewoffst);

  //seek past the FontHeader
  if (FileSeek(hFileHandle, sizeof(FontHeader), FILE_SEEK_FROM_START) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not seek FileHeader");
          FileClose(hFileHandle);
          return NULL;
  }

  //read in the FontObject
  if (FileRead(hFileHandle, pFontBase->pFontObject, (uiTotalSymbol)*sizeof(FontHeader), NULL) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not seek Font Objects");
          FileClose(hFileHandle);
          return NULL;
  }

  if (FileSeek(hFileHandle, uiOldoffst, FILE_SEEK_FROM_START) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not seek Old offset");
          FileClose(hFileHandle);
          return NULL;
  }

  // read in the Pixel data
  if (FileRead(hFileHandle, pFontBase->pPixData8, uiNewoffst, NULL) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not seek Pixel data");
          FileClose(hFileHandle);
          return NULL;
  }

  // seek proper position to read in Palette
  if (FileSeek(hFileHandle, sizeof(UINT32)*3, FILE_SEEK_FROM_START) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not seek Palette Start");
          FileClose(hFileHandle);
          return NULL;
  }

  // read in Palette
  if (FileRead(hFileHandle, pPalette, PALETTE_SIZE, NULL) == FALSE)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not read Palette");
          FileClose(hFileHandle);
          return NULL;
  }

  // set the default pixel depth
  pFontBase->siPixelDepth = pFManager->usDefaultPixelDepth;
  FileClose(hFileHandle);

  // convert from RGB to SGPPaletteEntry
  pNewPalette = ConvertToPaletteEntry(0, 255, pPalette);
  pFontBase->pPalette = pNewPalette;

  // create the 16BPer Pixel palette
  if ((pFontBase->pPalet16 = Create16BPPPalette(pNewPalette)) == NULL)
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Could not create 16 bit palette");
          return NULL;
  }
  // return the FontBase structure
  return pFontBase;
}	*/

/*void UnloadFont(FontBase *pFontBase)
{
        // free allocated memory in FontBase
        if(pFontBase!=NULL)
        {
                if(pFontBase->pPalette!=NULL)
                        MemFree(pFontBase->pPalette);
                if(pFontBase->pPalet16!=NULL)
                        MemFree(pFontBase->pPalet16);
                if(pFontBase->pFontObject!=NULL)
                        MemFree(pFontBase->pFontObject);
                if(pFontBase->pPixData8!=NULL)
                        MemFree(pFontBase->pPixData8);
                if(pFontBase->pPixData16!=NULL)
                        MemFree(pFontBase->pPixData16);
                MemFree(pFontBase);
        }
}	*/

//*****************************************************************************
//
// GetMaxFontWidth - Gets the maximum font width
//
// Parameter List : pointer to the base structure
//
// Return Value  Maximum font width
//
// Modification History :
// Dec 15th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*UINT16 GetMaxFontWidth(FontBase *pFontBase)
{
        FontObject *pWidth;
        UINT32 siBiggest = 0;
        UINT16 siCount;

  Assert(pFontBase != NULL);
        pWidth = pFontBase->pFontObject;
        // traverse the FontObject structure to find the biggest width
        for(siCount = 0; siCount < pFontBase->uiTotalElements; siCount++)
        {
                if( pWidth->uiFontWidth > siBiggest)
                {
      siBiggest = pWidth->uiFontWidth;
    }
                pWidth++;
        }
        // return the max width
        return (UINT16)siBiggest;
} */

//*****************************************************************************
//
// ConvertToPaletteEntry
//
// Parameter List : Converts from RGB to SGPPaletteEntry
//
// Return Value  pointer to the SGPPaletteEntry
//
// Modification History :
// Dec 15th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*
SGPPaletteEntry *ConvertToPaletteEntry(UINT8 sbStart, UINT8 sbEnd, UINT8 *pOldPalette)
{
        UINT16 Index;
  SGPPaletteEntry *pPalEntry;
        SGPPaletteEntry *pInitEntry;

        pPalEntry = (SGPPaletteEntry *)MemAlloc(sizeof(SGPPaletteEntry) * 256);
        pInitEntry = pPalEntry;
  DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Converting RGB palette to SGPPaletteEntry");
  for(Index=0; Index <= (sbEnd-sbStart);Index++)
  {
    pPalEntry->peRed = *(pOldPalette + (Index*3));
          pPalEntry->peGreen = *(pOldPalette + (Index*3) + 1);
          pPalEntry->peBlue = *(pOldPalette + (Index*3) + 2);
    pPalEntry->peFlags = 0;
          pPalEntry++;
  }
  return pInitEntry;
} */

//*****************************************************************************
//
// SetFontPalette - Sets the Palette
//
// Parameter List : pointer to the base structure
//                  new pixel depth
//                  new Palette size
//                  pointer to palette data
//
// Return Value  BOOLEAN
//
// Modification History :
// Dec 15th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*BOOLEAN SetFontPalette(FontBase *pFontBase, UINT16 siPixelDepth, SGPPaletteEntry *pPalData)
{
        Assert(pFontBase != NULL);
        Assert(pPalData != NULL);
        MemFree(pFontBase->pPalette);

        // assign the new palette to the Base structure
        pFontBase->pPalette = pPalData;
        pFontBase->siPixelDepth = siPixelDepth;
        return TRUE;
}	*/

//*****************************************************************************
//
// SetFont16BitData - Sets the font structure to hold 16 bit data
//
// Parameter List : pointer to the base structure
//                  pointer to new 16 bit data
//
// Return Value  BOOLEAN
//
// Modification History :
// Dec 15th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*BOOLEAN SetFont16BitData(FontBase *pFontBase, UINT16 *pData16)
{
        Assert(pFontBase != NULL);
        Assert(pData16 != NULL);
        MemFree(pFontBase->pPixData16);
        pFontBase->pPixData16 = pData16;
        return TRUE;
}	*/

//*****************************************************************************
//
// Blt8Imageto16Dest
//
// Parameter List : Start offset
//                  End Offset
//                  Dest x, y
//                  Font Width
//                  Pointer to Base structure
//                  Pointer to destination buffer
//                  Destination Pitch
//                  Height of Each element
//
// Return Value  : BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*BOOLEAN Blt8Imageto16Dest(UINT32 uiOffStart, UINT32 uiOffEnd, UINT16 siX, UINT16 siY, UINT32 uiWidth, FontBase *pFontBase, UINT8 *pFrameBuffer, UINT16 siDestPitch, UINT16 siHeightEach)
{
        UINT8  *pTrav;
        UINT16 *pFrameTrav;
        UINT16 *p16BPPPalette;
        UINT16  usEffectiveWidth;
        UINT32  uiFrameCount;
        UINT8   amount;
        UINT32  row, count;
    UINT16  modamount, divamount;
        UINT32 trace,modtrace;
        UINT8 sub=0;


        pTrav = pFontBase->pPixData8;
        pFrameTrav = (UINT16 *)pFrameBuffer;
        p16BPPPalette = pFontBase->pPalet16;
    trace = 0;
        modtrace = 0;
        // effective width is pitch/2 as 16 bits per pixel
        usEffectiveWidth = (UINT16)(siDestPitch / 2);
        uiFrameCount = siY*usEffectiveWidth + siX;
        trace += uiFrameCount;
        modtrace = trace % 640;
        pFrameTrav += uiFrameCount;
        pTrav += uiOffStart;

        count = 0;
        row = 0;
        amount = 0;
        while (count < (uiOffEnd-uiOffStart))
        {
          amount = 0;
    if (*pTrav == ID_BLACK)
          {
                  pTrav++;
                  count++;
                  amount = *pTrav;
                  modamount = (UINT8)(amount) % (UINT8) uiWidth;
                  divamount = (UINT8)(amount) / (UINT8) uiWidth;
      if ((divamount == 0) && ((row+amount) < (UINT16)uiWidth))
                  {
                          pFrameTrav += amount;
                          trace += amount;
                  modtrace = trace % 640;
                          row += amount;
                          row++;
                  }
                  else
                  {
        if (((row+amount) >= (UINT16)uiWidth) && (divamount ==0))
                    {
                pFrameTrav -= row;
                                trace -= row;
                    modtrace = trace % 640;
                            row = amount-((UINT16)uiWidth-row);
                            pFrameTrav += usEffectiveWidth+row;
                                trace += usEffectiveWidth+row;
                                modtrace = trace % 640;
                            row++;
                    }
                    else
                    {
                            pFrameTrav += (divamount*usEffectiveWidth);
                                trace += (divamount*usEffectiveWidth);
                                modtrace = trace % 640;
                                if(row+modamount > uiWidth)
                                {
                                        sub = (UINT8)((row+modamount) % uiWidth);
                                        pFrameTrav -= row;
                                    trace -= row;
                                    modtrace = trace % 640;
                                        pFrameTrav += usEffectiveWidth+sub;
                                    trace += usEffectiveWidth + sub;
                                    modtrace = trace % 640;
                                row = sub;
                                row++;
                                }else
                                {
                                        pFrameTrav += modamount;
                                    trace += modamount;
                                    modtrace = trace % 640;
                                row = modamount;
                                row++;
                                }
                    }
      }
          } else
          {
                  if(row >= uiWidth)
                  {
            pFrameTrav += (usEffectiveWidth-uiWidth);
                        trace += (usEffectiveWidth-uiWidth);
                        modtrace = trace % 640;
            *pFrameTrav = p16BPPPalette[*pTrav];
                    row = 1;
                  }
                  else
                  {
            *pFrameTrav = p16BPPPalette[*pTrav];
                    row++;
                  }
    }

    pFrameTrav++;
        trace++;
        modtrace = trace % 640;
    pTrav++;
    count++;
        }

        return TRUE;
}	*/

//*****************************************************************************
//
// Blt8Imageto8Dest
//
// Parameter List : Start offset
//                  End Offset
//                  Dest x, y
//                  Font Width
//                  Pointer to Base structure
//                  Pointer to destination buffer
//                  Destination Pitch
//                  Height of Each element
//
// Return Value  : BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*BOOLEAN Blt8Imageto8Dest(UINT32 uiOffStart, UINT32 uiOffEnd, UINT16 siX, UINT16 siY, UINT32 uiWidth, FontBase *pFontBase, UINT8 *pFrameBuffer, UINT16 siDestPitch, UINT16 siHeightEach)
{
        UINT8  *pTrav;
        UINT32  uiFrameCount;
        UINT8  *pFrameTrav;
        UINT8   amount;
        UINT32  row,count;
  UINT16  modamount,divamount;

        DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Blitting 8 to 8");
  Assert(pFontBase != NULL);
        Assert(pFrameBuffer != NULL);

        // get the pointers
        pTrav = pFontBase->pPixData8;
        pFrameTrav = (UINT8 *)pFrameBuffer;

        uiFrameCount = siY*siDestPitch + siX;
        pFrameTrav +=uiFrameCount;
        pTrav += uiOffStart;
  // perform blitting

        count=0;
        row = 0;
        amount = 0;
        while (count < (uiOffEnd-uiOffStart))
        {
          amount = 0;
    if (*pTrav == ID_BLACK)
          {
                  pTrav++;
                  count++;
                  amount = *pTrav;
                  modamount = amount % (UINT8) uiWidth;
                  divamount = amount / (UINT8) uiWidth;
      if ((divamount == 0) && ((row+amount) < (UINT16)uiWidth))
                  {
                          pFrameTrav += amount;
                          row += amount;
                          row++;
                  }
                  else
                  {
        if (((row+amount) >= (UINT16)uiWidth) && (divamount ==0))
                    {
          pFrameTrav -= row;
                            row = amount-((UINT16)uiWidth-row);
                            pFrameTrav += siDestPitch+row;
                            row++;
                    }
                    else
                    {
                            pFrameTrav += (divamount*siDestPitch)+modamount;
                            row = modamount;
                            row++;
                    }
      }
          } else
          {
                  if (row >= uiWidth)
                  {
        pFrameTrav += (siDestPitch-uiWidth);
       *pFrameTrav = *pTrav;
                    row = 1;
                  }
                  else
                  {
       *pFrameTrav = *pTrav;
                    row++;
                  }
    }

    pFrameTrav++;
    pTrav++;
                count++;
        }

        return TRUE;
} */

//*****************************************************************************
//
// Blt16Imageto16Dest
//
// Parameter List : Start offset
//                  End Offset
//                  Dest x, y
//                  Font Width
//                  Pointer to Base structure
//                  Pointer to destination buffer
//                  Destination Pitch
//                  Height of Each element
//
// Return Value  : BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
/*BOOLEAN Blt16Imageto16Dest(UINT32 uiOffStart, UINT32 uiOffEnd, UINT16 siX, UINT16 siY, UINT32 uiWidth, FontBase *pFontBase, UINT8 *pFrameBuffer, UINT16 siDestPitch, UINT16 siHeightEach)
{
        UINT16 *pTrav;
        UINT32  uiFrameCount;
        UINT16 *pFrameTrav;
        UINT16  amount;
        UINT32  row,count;
  UINT16  modamount,divamount;
        UINT16  usEffectiveWidth;

        DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Blitting 16 to 16");
  Assert(pFontBase != NULL);
        Assert(pFrameBuffer != NULL);

        //get the pointers
        pTrav = pFontBase->pPixData16;
        pFrameTrav = (UINT16 *)pFrameBuffer;

        // effective width is pitch/2 as 16 bits per pixel
        usEffectiveWidth = (UINT16)(siDestPitch / 2);
        uiFrameCount = siY*usEffectiveWidth + siX;
        pFrameTrav +=uiFrameCount;
        pTrav += uiOffStart;

        count=0;
        row = 0;
        amount = 0;
        while (count < (uiOffEnd-uiOffStart))
        {
    amount = 0;
    if (*pTrav == ID_BLACK)
          {
                  pTrav++;
                  count++;
                  amount = *pTrav;
                  modamount = amount % (UINT8) uiWidth;
                  divamount = amount / (UINT8) uiWidth;
      if ((divamount == 0) && ((row+amount) < (UINT16)uiWidth))
                  {
                          pFrameTrav += amount;
                          row += amount;
                          row++;
                  }
                  else
                  {
        if (((row+amount) >= (UINT16)uiWidth) && (divamount ==0))
                    {
          pFrameTrav -= row;
                            row = amount-((UINT16)uiWidth-row);
                            pFrameTrav += usEffectiveWidth+row;
                            row++;
                    }
                    else
                    {
                            pFrameTrav += (divamount*usEffectiveWidth)+modamount;
                            row = modamount;
                            row++;
                    }
      }
          } else
          {
                  if(row >= uiWidth)
                  {
        pFrameTrav += (usEffectiveWidth-uiWidth);
        *pFrameTrav = *pTrav;
                    row = 1;
                  }
                  else
                  {
        *pFrameTrav = *pTrav;
                    row++;
                  }
    }

    pFrameTrav++;
                pTrav++;
                count++;
        }

        return TRUE;
}	*/

//*****************************************************************************
//
// GetOffset
//
// Parameter List : Given the index, gets the corresponding offset
//
// Return Value  : offset
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*UINT32 GetOffset(FontBase *pFontBase, INT16 ssIndex)
{
  FontObject *pTrav;
  UINT16 siCount=0;

  Assert(pFontBase != NULL);
  // gets the offset based on the index
  if (((UINT32)ssIndex > pFontBase->uiTotalElements) || (ssIndex < 0))
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Incorrect index value passed");
    return 0;
  }
  pTrav = pFontBase->pFontObject;
  while (siCount != ssIndex)
  {
          siCount++;
          pTrav++;
  }

  return pTrav->uiFontOffset;
} */

//*****************************************************************************
//
// GetOffLen
//
// Parameter List : Given the index, gets the corresponding offset
// length which is the number of compressed pixels
//
// Return Value  : offset
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
/*UINT32 GetOffLen(FontBase *pFontBase, INT16 ssIndex)
{
  FontObject *pTrav;
  UINT16 siCount=0;

  Assert(pFontBase != NULL);
  // gets the offset based on the index
  if (((UINT32)ssIndex > pFontBase->uiTotalElements) || (ssIndex < 0))
  {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Incorrect index value passed");
    return 0;
  }
  pTrav = pFontBase->pFontObject;
  while(siCount != ssIndex)
  {
          siCount++;
          pTrav++;
  }

  return pTrav->uiOffLen;
} */

//*****************************************************************************
//
// PrintFontString
//
// Parameter List : pointer to \0 (NULL) terminated font string
//                  x,y,TotalWidth, TotalHeight is the bounding rectangle where
//                  the font is to be printed
//                  Multiline if true will print on multiple lines otherwise on 1 line
//                  Pointer to base structure
//
// Return Value  : BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

/*BOOLEAN PrintFontString(UINT16 *pFontString, UINT8 *pDestBuffer, UINT16 siDestWidth, UINT16 siDestPixelDepth, UINT16 siDestPitch, UINT16 siDestHeight, UINT16 siX, UINT16 siY, UINT16 siTotalWidth, UINT16 siTotalHeight, BOOLEAN fMultiLine, FontBase *pFontBase)
{
  UINT16  siScreenHt;
        UINT16  siScreenWt;
        UINT16  siChar, siHeightEach;
        INT16   ssIndex;
        UINT32  uiWidth, uiOffsetSt, uiOffsetEnd, uiOldoffst;
        UINT16 *pTempFStr;
        UINT16  siNewX, siNewY;
        UINT16  siInitX, siInitY;
        UINT32  uiLen;

        // check for NULL pointers passed in
        Assert(pFontBase != NULL);
        Assert(pFontString != NULL);
        Assert(pDestBuffer != NULL);

        siScreenWt = siDestWidth;
        siScreenHt = siDestHeight;

        // check for invalid coordinates
        if((siX<0) || (siX>siScreenWt) || (siY<0) || (siY>siScreenHt) || (siTotalWidth<0) || (siTotalWidth>siScreenWt) ||	(siTotalHeight<0) || (siTotalHeight>siScreenHt))
        {
          DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Invalid coordinates passed in");
    return FALSE;
  }
        pTempFStr = pFontString;

        siNewX = siX;
        siNewY = siY;
        siInitX = siX;
  siInitY = siY;

        // Get the height of each font and the offset
        siHeightEach = GetFontHeight(pFontBase);
        uiOldoffst = (sizeof(FontHeader) + sizeof(FontObject)*pFontBase->uiTotalElements);

        // calls the blt routine until the string != to \0
        while(*pTempFStr != STRING_DELIMITER)
        {
          siChar = *pTempFStr;
          // get the index value for the font
          if((ssIndex = GetIndex(siChar)) == -1)
                {
      return FALSE;
    }

          // get the width of the font
          uiWidth = GetWidth(pFontBase, ssIndex);

          // get the font offset
          uiOffsetSt = GetOffset(pFontBase, ssIndex);

          uiLen = GetOffLen(pFontBase,ssIndex);

          // uiOffsetSt -= uiOldoffst;
          uiOffsetEnd = uiOffsetSt + uiLen;

          // if Multiline = FALSE and reached the end of line - cannot continue
          if ((((siNewX+uiWidth) > siScreenWt) || ((siNewX+uiWidth) >= siTotalWidth)) && (fMultiLine == FALSE))
          {
            DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Cannot continue writing");
      return FALSE;
    }

          // check if boundary is reached
          if ((((siNewX+uiWidth) >= siScreenWt) || ((siNewX+uiWidth) >= siTotalWidth)) && (fMultiLine == TRUE))
          {
                  if (((siInitY+siHeightEach) > siScreenHt) || ((siInitY+siHeightEach) >= siTotalHeight))
                  {
              DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Cannot continue writing");
        return FALSE;
      }
                  //call the appropriate blit routines
      siNewX = siInitX;
                  siNewY += siHeightEach;
                  siInitY = siNewY;
      if ((siDestPixelDepth == 16) && (pFontBase->siPixelDepth == 16))
                {
        Blt16Imageto16Dest(uiOffsetSt, uiOffsetEnd, siNewX, siNewY, uiWidth, pFontBase, pDestBuffer, siDestPitch, siHeightEach);
      }
                  else
            {
        if ((siDestPixelDepth == 16) && (pFontBase->siPixelDepth == 8))
        {
                      Blt8Imageto16Dest(uiOffsetSt, uiOffsetEnd, siNewX, siNewY, uiWidth, pFontBase, pDestBuffer, siDestPitch, siHeightEach);
        }
                    else
              {
          if ((siDestPixelDepth == 8) && (pFontBase->siPixelDepth == 8))
                      { // if(SetPalette(pFontBase->pPalette) == FALSE)
                  //		    return FALSE;
                        Blt8Imageto8Dest(uiOffsetSt, uiOffsetEnd, siNewX, siNewY, uiWidth, pFontBase, pDestBuffer, siDestPitch, siHeightEach);
                      }
                      else
                      {
                  DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Invalid pixel depth / destination surface depth");
            return FALSE;
                      }
        }
              siNewX += (UINT16)uiWidth;
      }
          } else
          { // if it isnt end of boundary copy at current location
            if((siDestPixelDepth == 16) && (pFontBase->siPixelDepth == 16))
            {
        Blt16Imageto16Dest(uiOffsetSt, uiOffsetEnd, siNewX, siNewY, uiWidth, pFontBase, pDestBuffer, siDestPitch, siHeightEach);
      }
                  else
            {
        if((siDestPixelDepth == 16) && (pFontBase->siPixelDepth == 8))
                    {
          Blt8Imageto16Dest(uiOffsetSt, uiOffsetEnd, siNewX, siNewY, uiWidth, pFontBase, pDestBuffer, siDestPitch, siHeightEach);
        }
              else
                    {
          if ((siDestPixelDepth == 8) && (pFontBase->siPixelDepth == 8))
                      {
            Blt8Imageto8Dest(uiOffsetSt, uiOffsetEnd, siNewX, siNewY, uiWidth, pFontBase, pDestBuffer, siDestPitch, siHeightEach);
          }
          else
                      {
                  DbgMessage(TOPIC_FONT_HANDLER, DBG_LEVEL_0, "Invalid pixel depth / destination surface depth");
            return FALSE;
                      }
              }
                  siNewX += (UINT16)uiWidth;
            }
    }
    // increment string pointer
          pTempFStr++;
  }
        return TRUE;
}

*/

/*BOOLEAN InitializeFontManager(UINT16 usDefaultPixelDepth, FontTranslationTable *pTransTable)
{
FontTranslationTable *pTransTab;

        // register the appropriate debug topics
        if(pTransTable == NULL)
        {
    return FALSE;
  }
        RegisterDebugTopic(TOPIC_FONT_HANDLER, "Font Manager");

        if ((pFManager = (FontManager *)MemAlloc(sizeof(FontManager)))==NULL)
        {
    return FALSE;
  }

        if((pTransTab = (FontTranslationTable *)MemAlloc(sizeof(FontTranslationTable)))==NULL)
        {
    return FALSE;
  }

        pFManager->pTranslationTable = pTransTab;
        pFManager->usDefaultPixelDepth = usDefaultPixelDepth;
        pTransTab->usNumberOfSymbols = pTransTable->usNumberOfSymbols;
  pTransTab->DynamicArrayOf16BitValues = pTransTable->DynamicArrayOf16BitValues;

        return TRUE;
}	*/

/*void ShutdownFontManager(void)
{
  UnRegisterDebugTopic(TOPIC_FONT_HANDLER, "Font Manager");
  MemFree(pFManager);
}	*/

}
