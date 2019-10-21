//#define UNICODE

BOOLEAN gfEnumSucceed = FALSE;

const MAX_WIN_FONTS = 10;

// Private struct not to be exported
// to other modules
interface HWINFONT {
  hFont: HFONT;
  ForeColor: COLORVAL;
  BackColor: COLORVAL;
}

LOGFONT gLogFont;

HWINFONT WinFonts[MAX_WIN_FONTS];

function Convert16BitStringTo8BitChineseBig5String(dst: Pointer<UINT8>, src: Pointer<UINT16>): void {
  INT32 i, j;
  char *ptr;

  i = j = 0;
  ptr = (char *)src;
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
  INT32 iCount;

  for (iCount = 0; iCount < MAX_WIN_FONTS; iCount++) {
    if (WinFonts[iCount].hFont == NULL) {
      return iCount;
    }
  }

  return -1;
}

function GetWinFont(iFont: INT32): Pointer<HWINFONT> {
  if (iFont == -1) {
    return NULL;
  }

  if (WinFonts[iFont].hFont == NULL) {
    return NULL;
  } else {
    return &(WinFonts[iFont]);
  }
}

UINT16 gzFontName[32];

function CreateWinFont(iHeight: INT32, iWidth: INT32, iEscapement: INT32, iWeight: INT32, fItalic: BOOLEAN, fUnderline: BOOLEAN, fStrikeOut: BOOLEAN, szFontName: STR16, iCharSet: INT32): INT32 {
  INT32 iFont;
  HFONT hFont;
  UINT8 szCharFontName[32]; // 32 characters including null terminator (matches max font name length)
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
    hFont = CreateFontIndirect(&gLogFont);
  } else {
    FatalError("Cannot load subtitle Windows Font: %S.", szFontName);
    return -1;
  }

  if (hFont == NULL) {
    return -1;
  }

  // Set font....
  WinFonts[iFont].hFont = hFont;

  return iFont;
}

function DeleteWinFont(iFont: INT32): void {
  HWINFONT *pWinFont;

  pWinFont = GetWinFont(iFont);

  if (pWinFont != NULL) {
    DeleteObject(pWinFont->hFont);
  }
}

function SetWinFontForeColor(iFont: INT32, pColor: Pointer<COLORVAL>): void {
  HWINFONT *pWinFont;

  pWinFont = GetWinFont(iFont);

  if (pWinFont != NULL) {
    pWinFont->ForeColor = (*pColor);
  }
}

function SetWinFontBackColor(iFont: INT32, pColor: Pointer<COLORVAL>): void {
  HWINFONT *pWinFont;

  pWinFont = GetWinFont(iFont);

  if (pWinFont != NULL) {
    pWinFont->BackColor = (*pColor);
  }
}

function PrintWinFont(uiDestBuf: UINT32, iFont: INT32, x: INT32, y: INT32, pFontString: Pointer<UINT16>, ...args: any[]): void {
  va_list argptr;
  wchar_t string2[512];
  char string[512];
  HVSURFACE hVSurface;
  LPDIRECTDRAWSURFACE2 pDDSurface;
  HDC hdc;
  RECT rc;
  HWINFONT *pWinFont;
  int len;
  SIZE RectSize;

  pWinFont = GetWinFont(iFont);

  if (pWinFont == NULL) {
    return;
  }

  va_start(argptr, pFontString); // Set up variable argument pointer
  len = vswprintf(string2, pFontString, argptr); // process gprintf string (get output str)
  va_end(argptr);

  sprintf(string, "%S", string2);

  // Get surface...
  GetVideoSurface(&hVSurface, uiDestBuf);

  pDDSurface = GetVideoSurfaceDDSurface(hVSurface);

  IDirectDrawSurface2_GetDC(pDDSurface, &hdc);

  SelectObject(hdc, pWinFont->hFont);
  SetTextColor(hdc, pWinFont->ForeColor);
  SetBkColor(hdc, pWinFont->BackColor);
  SetBkMode(hdc, TRANSPARENT);

  GetTextExtentPoint32(hdc, string, len, &RectSize);
  SetRect(&rc, x, y, x + RectSize.cx, y + RectSize.cy);
  ExtTextOut(hdc, x, y, ETO_OPAQUE, &rc, string, len, NULL);
  IDirectDrawSurface2_ReleaseDC(pDDSurface, hdc);
}

function WinFontStringPixLength(string2: Pointer<UINT16>, iFont: INT32): INT16 {
  HWINFONT *pWinFont;
  HDC hdc;
  SIZE RectSize;
  char string[512];

  pWinFont = GetWinFont(iFont);

  if (pWinFont == NULL) {
    return 0;
  }

  sprintf(string, "%S", string2);

  hdc = GetDC(NULL);
  SelectObject(hdc, pWinFont->hFont);
  GetTextExtentPoint32(hdc, string, strlen(string), &RectSize);
  ReleaseDC(NULL, hdc);

  return (INT16)RectSize.cx;
}

function GetWinFontHeight(string2: Pointer<UINT16>, iFont: INT32): INT16 {
  HWINFONT *pWinFont;
  HDC hdc;
  SIZE RectSize;
  char string[512];

  pWinFont = GetWinFont(iFont);

  if (pWinFont == NULL) {
    return 0;
  }

  sprintf(string, "%S", string2);

  hdc = GetDC(NULL);
  SelectObject(hdc, pWinFont->hFont);
  GetTextExtentPoint32(hdc, string, strlen(string), &RectSize);
  ReleaseDC(NULL, hdc);

  return (INT16)RectSize.cy;
}

function WinFont_mprintf(iFont: INT32, x: INT32, y: INT32, pFontString: Pointer<UINT16>, ...args: any[]): UINT32 {
  va_list argptr;
  wchar_t string[512];

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
  UINT8 szFontName[32];

  sprintf(szFontName, "%S", gzFontName);
  if (!strcmp(szFontName, lpelfe->elfFullName)) {
    gfEnumSucceed = TRUE;
    memcpy(&gLogFont, &(lpelfe->elfLogFont), sizeof(LOGFONT));
  }

  return TRUE;
}

function DoesWinFontExistOnSystem(pTypeFaceName: STR16, iCharSet: INT32): BOOLEAN {
  HDC hdc;
  char string[512];
  LOGFONT LogFont;
  hdc = GetDC(NULL);

  gfEnumSucceed = FALSE;
  // Copy into 8-bit!
  sprintf(string, "%S", pTypeFaceName);

  memset(&LogFont, 0, sizeof(LOGFONT));
  LogFont.lfCharSet = iCharSet;
  lstrcpy((LPSTR)&LogFont.lfFaceName, string);

  EnumFontFamiliesEx(hdc, &LogFont, EnumFontFamExProc, 0, 0);

  ReleaseDC(NULL, hdc);

  return gfEnumSucceed;
}
