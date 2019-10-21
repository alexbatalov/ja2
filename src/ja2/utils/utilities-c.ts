const DATA_8_BIT_DIR = "8-Bit\\";

//#define	TIME_LIMITED_VERSION

function FilenameForBPP(pFilename: STR, pDestination: STR): void {
  let Drive: UINT8[] /* [128] */;
  let Dir: UINT8[] /* [128] */;
  let Name: UINT8[] /* [128] */;
  let Ext: UINT8[] /* [128] */;

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

function CreateSGPPaletteFromCOLFile(pPalette: Pointer<SGPPaletteEntry>, ColFile: SGPFILENAME): BOOLEAN {
  let hFileHandle: HWFILE;
  let bColHeader: BYTE[] /* [8] */;
  let cnt: UINT32;

  // See if files exists, if not, return error
  if (!FileExists(ColFile)) {
    // Return FALSE w/ debug
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot find COL file");
    return FALSE;
  }

  // Open and read in the file
  if ((hFileHandle = FileOpen(ColFile, FILE_ACCESS_READ, FALSE)) == 0) {
    // Return FALSE w/ debug
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Cannot open COL file");
    return FALSE;
  }

  // Skip header
  FileRead(hFileHandle, bColHeader, sizeof(bColHeader), NULL);

  // Read in a palette entry at a time
  for (cnt = 0; cnt < 256; cnt++) {
    FileRead(hFileHandle, &pPalette[cnt].peRed, sizeof(UINT8), NULL);
    FileRead(hFileHandle, &pPalette[cnt].peGreen, sizeof(UINT8), NULL);
    FileRead(hFileHandle, &pPalette[cnt].peBlue, sizeof(UINT8), NULL);
  }

  // Close file
  FileClose(hFileHandle);

  return TRUE;
}

function DisplayPaletteRep(aPalRep: PaletteRepID, ubXPos: UINT8, ubYPos: UINT8, uiDestSurface: UINT32): BOOLEAN {
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
  CHECKF(GetPaletteRepIndexFromID(aPalRep, &ubPaletteRep));

  SetFont(LARGEFONT1);

  ubType = gpPalRep[ubPaletteRep].ubType;
  ubSize = gpPalRep[ubPaletteRep].ubPaletteSize;

  for (cnt1 = 0; cnt1 < ubSize; cnt1++) {
    sTLX = ubXPos + (UINT16)((cnt1 % 16) * 20);
    sTLY = ubYPos + (UINT16)((cnt1 / 16) * 20);
    sBRX = sTLX + 20;
    sBRY = sTLY + 20;

    us16BPPColor = Get16BPPColor(FROMRGB(gpPalRep[ubPaletteRep].r[cnt1], gpPalRep[ubPaletteRep].g[cnt1], gpPalRep[ubPaletteRep].b[cnt1]));

    ColorFillVideoSurfaceArea(uiDestSurface, sTLX, sTLY, sBRX, sBRY, us16BPPColor);
  }

  gprintf(ubXPos + (16 * 20), ubYPos, L"%S", gpPalRep[ubPaletteRep].ID);

  return TRUE;
}

function WrapString(pStr: Pointer<INT16>, pStr2: Pointer<INT16>, usWidth: UINT16, uiFont: INT32): BOOLEAN {
  let Cur: UINT32;
  let uiLet: UINT32;
  let uiNewLet: UINT32;
  let uiHyphenLet: UINT32;
  let curletter: Pointer<UINT16>;
  let transletter: UINT16;
  let fLineSplit: BOOLEAN = FALSE;
  let hFont: HVOBJECT;

  // CHECK FOR WRAP
  Cur = 0;
  uiLet = 0;
  curletter = pStr;

  // GET FONT
  hFont = GetFontObject(uiFont);

  // LOOP FORWARDS AND COUNT
  while ((*curletter) != 0) {
    transletter = GetIndex(*curletter);
    Cur += GetWidth(hFont, transletter);

    if (Cur > usWidth) {
      // We are here, loop backwards to find a space
      // Generate second string, and exit upon completion.
      uiHyphenLet = uiLet; // Save the hyphen location as it won't change.
      uiNewLet = uiLet;
      while ((*curletter) != 0) {
        if ((*curletter) == 32) {
          // Split Line!
          fLineSplit = TRUE;

          pStr[uiNewLet] = (INT16)'\0';

          wcscpy(pStr2, &(pStr[uiNewLet + 1]));
        }

        if (fLineSplit)
          break;

        uiNewLet--;
        curletter--;
      }
      if (!fLineSplit) {
        // We completed the check for a space, but failed, so use the hyphen method.
        swprintf(pStr2, L"-%s", &(pStr[uiHyphenLet]));
        pStr[uiHyphenLet] = (INT16)'/0';
        fLineSplit = TRUE; // hyphen method
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

function IfWinNT(): BOOLEAN {
  let OsVerInfo: OSVERSIONINFO;

  OsVerInfo.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);

  GetVersionEx(&OsVerInfo);

  if (OsVerInfo.dwPlatformId == VER_PLATFORM_WIN32_NT)
    return TRUE;
  else
    return FALSE;
}

function IfWin95(): BOOLEAN {
  let OsVerInfo: OSVERSIONINFO;

  OsVerInfo.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);

  GetVersionEx(&OsVerInfo);

  if (OsVerInfo.dwPlatformId == VER_PLATFORM_WIN32_WINDOWS)
    return TRUE;
  else
    return FALSE;
}

function HandleLimitedNumExecutions(): void {
  // Get system directory
  let hFileHandle: HWFILE;
  let ubSysDir: UINT8[] /* [512] */;
  let bNumRuns: INT8;

  GetSystemDirectory(ubSysDir, sizeof(ubSysDir));

  // Append filename
  strcat(ubSysDir, "\\winaese.dll");

  // Open file and check # runs...
  if (FileExists(ubSysDir)) {
    // Open and read
    if ((hFileHandle = FileOpen(ubSysDir, FILE_ACCESS_READ, FALSE)) == 0) {
      return;
    }

    // Read value
    FileRead(hFileHandle, &bNumRuns, sizeof(bNumRuns), NULL);

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
  if ((hFileHandle = FileOpen(ubSysDir, FILE_ACCESS_WRITE, FALSE)) == 0) {
    return;
  }

  // Write value
  FileWrite(hFileHandle, &bNumRuns, sizeof(bNumRuns), NULL);

  // Close file
  FileClose(hFileHandle);
}

let gCheckFilenames: SGPFILENAME[] /* [] */ = {
  "DATA\\INTRO.SLF",
  "DATA\\LOADSCREENS.SLF",
  "DATA\\MAPS.SLF",
  "DATA\\NPC_SPEECH.SLF",
  "DATA\\SPEECH.SLF",
};

let gCheckFileMinSizes: UINT32[] /* [] */ = {
  68000000,
  36000000,
  87000000,
  187000000,
  236000000,
};

function HandleJA2CDCheck(): BOOLEAN {
  return TRUE;
}

function HandleJA2CDCheckTwo(): BOOLEAN {
  return TRUE;

  return FALSE;
}

function PerformTimeLimitedCheck(): BOOLEAN {
  return TRUE;
}

function DoJA2FilesExistsOnDrive(zCdLocation: Pointer<CHAR8>): BOOLEAN {
  let fFailed: BOOLEAN = FALSE;
  let zCdFile: CHAR8[] /* [SGPFILENAME_LEN] */;
  let cnt: INT32;
  let hFile: HWFILE;

  for (cnt = 0; cnt < 4; cnt++) {
    // OK, build filename
    sprintf(zCdFile, "%s%s", zCdLocation, gCheckFilenames[cnt]);

    hFile = FileOpen(zCdFile, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);

    // Check if it exists...
    if (!hFile) {
      fFailed = TRUE;
      FileClose(hFile);
      break;
    }
    FileClose(hFile);
  }

  return !fFailed;
}
