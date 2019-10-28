namespace ja2 {

const DATA_8_BIT_DIR = "8-Bit\\";

//#define	TIME_LIMITED_VERSION

export function FilenameForBPP(pFilename: string /* STR */, pDestination: Pointer<string> /* STR */): void {
  let Drive: string /* UINT8[128] */;
  let Dir: string /* UINT8[128] */;
  let Name: string /* UINT8[128] */;
  let Ext: string /* UINT8[128] */;

  if (GETPIXELDEPTH() == 16) {
    // no processing for 16 bit names
    strcpy(pDestination, pFilename);
  } else {
    _splitpath(pFilename, Drive, Dir, Name, Ext);

    strcat(Name, "_8");

    strcpy(pDestination, Drive);
    // strcat(pDestination, Dir);
    strcat(pDestination, DATA_8_BIT_DIR);
    strcat(pDestination, Name);
    strcat(pDestination, Ext);
  }
}

export function CreateSGPPaletteFromCOLFile(pPalette: Pointer<SGPPaletteEntry>, ColFile: string /* SGPFILENAME */): boolean {
  let hFileHandle: HWFILE;
  let bColHeader: BYTE[] /* [8] */;
  let cnt: UINT32;

  // See if files exists, if not, return error
  if (!FileExists(ColFile)) {
    // Return FALSE w/ debug
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot find COL file");
    return false;
  }

  // Open and read in the file
  if ((hFileHandle = FileOpen(ColFile, FILE_ACCESS_READ, false)) == 0) {
    // Return FALSE w/ debug
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot open COL file");
    return false;
  }

  // Skip header
  FileRead(hFileHandle, bColHeader, sizeof(bColHeader), null);

  // Read in a palette entry at a time
  for (cnt = 0; cnt < 256; cnt++) {
    FileRead(hFileHandle, addressof(pPalette[cnt].peRed), sizeof(UINT8), null);
    FileRead(hFileHandle, addressof(pPalette[cnt].peGreen), sizeof(UINT8), null);
    FileRead(hFileHandle, addressof(pPalette[cnt].peBlue), sizeof(UINT8), null);
  }

  // Close file
  FileClose(hFileHandle);

  return true;
}

export function DisplayPaletteRep(aPalRep: PaletteRepID, ubXPos: UINT8, ubYPos: UINT8, uiDestSurface: UINT32): boolean {
  let us16BPPColor: UINT16;
  let cnt1: UINT32;
  let ubSize: UINT8;
  let ubType: UINT8;
  let sTLX: INT16;
  let sTLY: INT16;
  let sBRX: INT16;
  let sBRY: INT16;
  let ubPaletteRep: UINT8;

  // Create 16BPP Palette
  CHECKF(GetPaletteRepIndexFromID(aPalRep, addressof(ubPaletteRep)));

  SetFont(LARGEFONT1());

  ubType = gpPalRep[ubPaletteRep].ubType;
  ubSize = gpPalRep[ubPaletteRep].ubPaletteSize;

  for (cnt1 = 0; cnt1 < ubSize; cnt1++) {
    sTLX = ubXPos + ((cnt1 % 16) * 20);
    sTLY = ubYPos + ((cnt1 / 16) * 20);
    sBRX = sTLX + 20;
    sBRY = sTLY + 20;

    us16BPPColor = Get16BPPColor(FROMRGB(gpPalRep[ubPaletteRep].r[cnt1], gpPalRep[ubPaletteRep].g[cnt1], gpPalRep[ubPaletteRep].b[cnt1]));

    ColorFillVideoSurfaceArea(uiDestSurface, sTLX, sTLY, sBRX, sBRY, us16BPPColor);
  }

  gprintf(ubXPos + (16 * 20), ubYPos, "%S", gpPalRep[ubPaletteRep].ID);

  return true;
}

export function WrapString(pStr: string /* Pointer<INT16> */, pStr2: Pointer<string> /* Pointer<INT16> */, usWidth: UINT16, uiFont: INT32): boolean {
  let Cur: UINT32;
  let uiLet: UINT32;
  let uiNewLet: UINT32;
  let uiHyphenLet: UINT32;
  let curletter: string /* Pointer<UINT16> */;
  let transletter: UINT16;
  let fLineSplit: boolean = false;
  let hFont: HVOBJECT;

  // CHECK FOR WRAP
  Cur = 0;
  uiLet = 0;
  curletter = pStr;

  // GET FONT
  hFont = GetFontObject(uiFont);

  // LOOP FORWARDS AND COUNT
  while ((curletter.value) != 0) {
    transletter = GetIndex(curletter.value);
    Cur += GetWidth(hFont, transletter);

    if (Cur > usWidth) {
      // We are here, loop backwards to find a space
      // Generate second string, and exit upon completion.
      uiHyphenLet = uiLet; // Save the hyphen location as it won't change.
      uiNewLet = uiLet;
      while ((curletter.value) != 0) {
        if ((curletter.value) == 32) {
          // Split Line!
          fLineSplit = true;

          pStr[uiNewLet] = '\0';

          wcscpy(pStr2, addressof(pStr[uiNewLet + 1]));
        }

        if (fLineSplit)
          break;

        uiNewLet--;
        curletter--;
      }
      if (!fLineSplit) {
        // We completed the check for a space, but failed, so use the hyphen method.
        swprintf(pStr2, "-%s", addressof(pStr[uiHyphenLet]));
        pStr[uiHyphenLet] = '/0';
        fLineSplit = true; // hyphen method
        break;
      }
    }

    //		if ( fLineSplit )
    //			break;

    uiLet++;
    curletter++;
  }

  return fLineSplit;
}

function IfWinNT(): boolean {
  let OsVerInfo: OSVERSIONINFO;

  OsVerInfo.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);

  GetVersionEx(addressof(OsVerInfo));

  if (OsVerInfo.dwPlatformId == VER_PLATFORM_WIN32_NT)
    return true;
  else
    return false;
}

function IfWin95(): boolean {
  let OsVerInfo: OSVERSIONINFO;

  OsVerInfo.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);

  GetVersionEx(addressof(OsVerInfo));

  if (OsVerInfo.dwPlatformId == VER_PLATFORM_WIN32_WINDOWS)
    return true;
  else
    return false;
}

function HandleLimitedNumExecutions(): void {
  // Get system directory
  let hFileHandle: HWFILE;
  let ubSysDir: string /* UINT8[512] */;
  let bNumRuns: INT8;

  GetSystemDirectory(ubSysDir, sizeof(ubSysDir));

  // Append filename
  strcat(ubSysDir, "\\winaese.dll");

  // Open file and check # runs...
  if (FileExists(ubSysDir)) {
    // Open and read
    if ((hFileHandle = FileOpen(ubSysDir, FILE_ACCESS_READ, false)) == 0) {
      return;
    }

    // Read value
    FileRead(hFileHandle, addressof(bNumRuns), sizeof(bNumRuns), null);

    // Close file
    FileClose(hFileHandle);

    if (bNumRuns <= 0) {
      // Fail!
      SET_ERROR("Error 1054: Cannot execute - contact Sir-Tech Software.");
      return;
    }
  } else {
    bNumRuns = 10;
  }

  // OK, decrement # runs...
  bNumRuns--;

  // Open and write
  if ((hFileHandle = FileOpen(ubSysDir, FILE_ACCESS_WRITE, false)) == 0) {
    return;
  }

  // Write value
  FileWrite(hFileHandle, addressof(bNumRuns), sizeof(bNumRuns), null);

  // Close file
  FileClose(hFileHandle);
}

export let gCheckFilenames: string[] /* SGPFILENAME[] */ = [
  "DATA\\INTRO.SLF",
  "DATA\\LOADSCREENS.SLF",
  "DATA\\MAPS.SLF",
  "DATA\\NPC_SPEECH.SLF",
  "DATA\\SPEECH.SLF",
];

let gCheckFileMinSizes: UINT32[] /* [] */ = [
  68000000,
  36000000,
  87000000,
  187000000,
  236000000,
];

export function HandleJA2CDCheck(): boolean {
  return true;
}

function HandleJA2CDCheckTwo(): boolean {
  return true;

  return false;
}

function PerformTimeLimitedCheck(): boolean {
  return true;
}

export function DoJA2FilesExistsOnDrive(zCdLocation: string /* Pointer<CHAR8> */): boolean {
  let fFailed: boolean = false;
  let zCdFile: string /* CHAR8[SGPFILENAME_LEN] */;
  let cnt: INT32;
  let hFile: HWFILE;

  for (cnt = 0; cnt < 4; cnt++) {
    // OK, build filename
    sprintf(zCdFile, "%s%s", zCdLocation, gCheckFilenames[cnt]);

    hFile = FileOpen(zCdFile, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);

    // Check if it exists...
    if (!hFile) {
      fFailed = true;
      FileClose(hFile);
      break;
    }
    FileClose(hFile);
  }

  return !fFailed;
}

}
