//#define UNICODE

let gfEnumSucceed: BOOLEAN = FALSE;

const MAX_WIN_FONTS = 10;

// Private struct not to be exported
// to other modules
interface HWINFONT {
  hFont: HFONT;
  ForeColor: COLORVAL;
  BackColor: COLORVAL;
}

let gLogFont: LOGFONT;

let WinFonts: HWINFONT[] /* [MAX_WIN_FONTS] */;

function Convert16BitStringTo8BitChineseBig5String(dst: Pointer<UINT8>, src: Pointer<UINT16>): void {
  let i: INT32;
  let j: INT32;
  let ptr: Pointer<char>;

  i = j = 0;
  ptr = src;
  while (ptr[j] || ptr[j + 1]) {
    if (ptr[j]) {
      dst[i] = ptr[j];
      dst[i + 1] = '\0';
      i++;
    }
    j++;
  }
}

function InitWinFonts(): void {
  memset(WinFonts, 0, sizeof(WinFonts));
}

function ShutdownWinFonts(): void {
}

function FindFreeWinFont(): INT32 {
  let iCount: INT32;

  for (iCount = 0; iCount < MAX_WIN_FONTS; iCount++) {
    if (WinFonts[iCount].hFont == null) {
      return iCount;
    }
  }

  return -1;
}

function GetWinFont(iFont: INT32): Pointer<HWINFONT> {
  if (iFont == -1) {
    return null;
  }

  if (WinFonts[iFont].hFont == null) {
    return null;
  } else {
    return addressof(WinFonts[iFont]);
  }
}

let gzFontName: UINT16[] /* [32] */;

function CreateWinFont(iHeight: INT32, iWidth: INT32, iEscapement: INT32, iWeight: INT32, fItalic: BOOLEAN, fUnderline: BOOLEAN, fStrikeOut: BOOLEAN, szFontName: STR16, iCharSet: INT32): INT32 {
  let iFont: INT32;
  let hFont: HFONT;
  let szCharFontName: UINT8[] /* [32] */; // 32 characters including null terminator (matches max font name length)
  // Find free slot
  iFont = FindFreeWinFont();

  if (iFont == -1) {
    return iFont;
  }

  // SET UP FONT WE WANT TO LOAD HERE
  wcscpy(gzFontName, szFontName);

  // ATTEMPT TO LOAD THE FONT NOW
  sprintf(szCharFontName, "%S", szFontName);
  if (DoesWinFontExistOnSystem(szFontName, iCharSet)) {
    gLogFont.lfHeight = iHeight;
    gLogFont.lfWidth = 0;
    hFont = CreateFontIndirect(addressof(gLogFont));
  } else {
    FatalError("Cannot load subtitle Windows Font: %S.", szFontName);
    return -1;
  }

  if (hFont == null) {
    return -1;
  }

  // Set font....
  WinFonts[iFont].hFont = hFont;

  return iFont;
}

function DeleteWinFont(iFont: INT32): void {
  let pWinFont: Pointer<HWINFONT>;

  pWinFont = GetWinFont(iFont);

  if (pWinFont != null) {
    DeleteObject(pWinFont.value.hFont);
  }
}

function SetWinFontForeColor(iFont: INT32, pColor: Pointer<COLORVAL>): void {
  let pWinFont: Pointer<HWINFONT>;

  pWinFont = GetWinFont(iFont);

  if (pWinFont != null) {
    pWinFont.value.ForeColor = (pColor.value);
  }
}

function SetWinFontBackColor(iFont: INT32, pColor: Pointer<COLORVAL>): void {
  let pWinFont: Pointer<HWINFONT>;

  pWinFont = GetWinFont(iFont);

  if (pWinFont != null) {
    pWinFont.value.BackColor = (pColor.value);
  }
}

function PrintWinFont(uiDestBuf: UINT32, iFont: INT32, x: INT32, y: INT32, pFontString: Pointer<UINT16>, ...args: any[]): void {
  let argptr: va_list;
  let string2: wchar_t[] /* [512] */;
  let string: char[] /* [512] */;
  let hVSurface: HVSURFACE;
  let pDDSurface: LPDIRECTDRAWSURFACE2;
  let hdc: HDC;
  let rc: RECT;
  let pWinFont: Pointer<HWINFONT>;
  let len: int;
  let RectSize: SIZE;

  pWinFont = GetWinFont(iFont);

  if (pWinFont == null) {
    return;
  }

  va_start(argptr, pFontString); // Set up variable argument pointer
  len = vswprintf(string2, pFontString, argptr); // process gprintf string (get output str)
  va_end(argptr);

  sprintf(string, "%S", string2);

  // Get surface...
  GetVideoSurface(addressof(hVSurface), uiDestBuf);

  pDDSurface = GetVideoSurfaceDDSurface(hVSurface);

  IDirectDrawSurface2_GetDC(pDDSurface, addressof(hdc));

  SelectObject(hdc, pWinFont.value.hFont);
  SetTextColor(hdc, pWinFont.value.ForeColor);
  SetBkColor(hdc, pWinFont.value.BackColor);
  SetBkMode(hdc, TRANSPARENT);

  GetTextExtentPoint32(hdc, string, len, addressof(RectSize));
  SetRect(addressof(rc), x, y, x + RectSize.cx, y + RectSize.cy);
  ExtTextOut(hdc, x, y, ETO_OPAQUE, addressof(rc), string, len, null);
  IDirectDrawSurface2_ReleaseDC(pDDSurface, hdc);
}

function WinFontStringPixLength(string2: Pointer<UINT16>, iFont: INT32): INT16 {
  let pWinFont: Pointer<HWINFONT>;
  let hdc: HDC;
  let RectSize: SIZE;
  let string: char[] /* [512] */;

  pWinFont = GetWinFont(iFont);

  if (pWinFont == null) {
    return 0;
  }

  sprintf(string, "%S", string2);

  hdc = GetDC(null);
  SelectObject(hdc, pWinFont.value.hFont);
  GetTextExtentPoint32(hdc, string, strlen(string), addressof(RectSize));
  ReleaseDC(null, hdc);

  return RectSize.cx;
}

function GetWinFontHeight(string2: Pointer<UINT16>, iFont: INT32): INT16 {
  let pWinFont: Pointer<HWINFONT>;
  let hdc: HDC;
  let RectSize: SIZE;
  let string: char[] /* [512] */;

  pWinFont = GetWinFont(iFont);

  if (pWinFont == null) {
    return 0;
  }

  sprintf(string, "%S", string2);

  hdc = GetDC(null);
  SelectObject(hdc, pWinFont.value.hFont);
  GetTextExtentPoint32(hdc, string, strlen(string), addressof(RectSize));
  ReleaseDC(null, hdc);

  return RectSize.cy;
}

function WinFont_mprintf(iFont: INT32, x: INT32, y: INT32, pFontString: Pointer<UINT16>, ...args: any[]): UINT32 {
  let argptr: va_list;
  let string: wchar_t[] /* [512] */;

  va_start(argptr, pFontString); // Set up variable argument pointer
  vswprintf(string, pFontString, argptr); // process gprintf string (get output str)
  va_end(argptr);

  PrintWinFont(FontDestBuffer, iFont, x, y, string);

  return 1;
}

function EnumFontFamProc(lplf: Pointer<LOGFONT>, lptm: Pointer<TEXTMETRIC>, dwType: DWORD, lpData: LPARAM): int {
  gfEnumSucceed = TRUE;

  return TRUE;
}

function EnumFontFamExProc(lpelfe: Pointer<ENUMLOGFONTEX>, lpntme: Pointer<NEWTEXTMETRICEX>, FontType: int, lParam: LPARAM): int {
  let szFontName: UINT8[] /* [32] */;

  sprintf(szFontName, "%S", gzFontName);
  if (!strcmp(szFontName, lpelfe.value.elfFullName)) {
    gfEnumSucceed = TRUE;
    memcpy(addressof(gLogFont), addressof(lpelfe.value.elfLogFont), sizeof(LOGFONT));
  }

  return TRUE;
}

function DoesWinFontExistOnSystem(pTypeFaceName: STR16, iCharSet: INT32): BOOLEAN {
  let hdc: HDC;
  let string: char[] /* [512] */;
  let LogFont: LOGFONT;
  hdc = GetDC(null);

  gfEnumSucceed = FALSE;
  // Copy into 8-bit!
  sprintf(string, "%S", pTypeFaceName);

  memset(addressof(LogFont), 0, sizeof(LOGFONT));
  LogFont.lfCharSet = iCharSet;
  lstrcpy(addressof(LogFont.lfFaceName), string);

  EnumFontFamiliesEx(hdc, addressof(LogFont), EnumFontFamExProc, 0, 0);

  ReleaseDC(null, hdc);

  return gfEnumSucceed;
}
