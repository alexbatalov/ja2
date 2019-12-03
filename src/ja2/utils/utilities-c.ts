namespace ja2 {

const path: typeof import('path') = require('path');

const DATA_8_BIT_DIR = "8-Bit\\";

//#define	TIME_LIMITED_VERSION

export function FilenameForBPP(pFilename: string /* STR */): string {
  let pDestination: string;

  let Drive: string /* UINT8[128] */;
  let Dir: string /* UINT8[128] */;
  let Name: string /* UINT8[128] */;
  let Ext: string /* UINT8[128] */;

  if (GETPIXELDEPTH() == 16) {
    // no processing for 16 bit names
    pDestination = pFilename;
  } else {
    ({ root: Drive, dir: Dir, name: Name, ext: Ext } = path.parse(pFilename));

    Name += "_8";

    pDestination = Drive;
    // strcat(pDestination, Dir);
    pDestination += DATA_8_BIT_DIR;
    pDestination += Name;
    pDestination += Ext;
  }

  return pDestination;
}

export function CreateSGPPaletteFromCOLFile(pPalette: SGPPaletteEntry[], ColFile: string /* SGPFILENAME */): boolean {
  let hFileHandle: HWFILE;
  let bColHeader: BYTE[] /* [8] */ = createArray(8, 0);
  let cnt: UINT32;
  let buffer: Buffer;

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
  buffer = Buffer.allocUnsafe(8);
  FileRead(hFileHandle, buffer, 8);

  // Read in a palette entry at a time
  buffer = Buffer.allocUnsafe(3);
  for (cnt = 0; cnt < 256; cnt++) {
    FileRead(hFileHandle, buffer, 3);
    pPalette[cnt].peRed = buffer.readUInt8(0);
    pPalette[cnt].peGreen = buffer.readUInt8(1);
    pPalette[cnt].peBlue = buffer.readUInt8(2);
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
  if ((ubPaletteRep = GetPaletteRepIndexFromID(aPalRep)) === -1) {
    return false;
  }

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

export function WrapString(pStr: string /* Pointer<INT16> */, usWidth: UINT16, uiFont: INT32): { pStr: string, pStr2: string } {
  let pStr2: string = '';

  let Cur: UINT32;
  let uiLet: UINT32;
  let uiNewLet: UINT32;
  let uiHyphenLet: UINT32;
  let curletter: number /* Pointer<UINT16> */;
  let transletter: UINT16;
  let fLineSplit: boolean = false;
  let hFont: HVOBJECT;

  // CHECK FOR WRAP
  Cur = 0;
  uiLet = 0;
  curletter = 0;

  // GET FONT
  hFont = GetFontObject(uiFont);

  // LOOP FORWARDS AND COUNT
  while (curletter < pStr.length) {
    transletter = GetIndex(pStr.charCodeAt(curletter));
    Cur += GetWidth(hFont, transletter);

    if (Cur > usWidth) {
      // We are here, loop backwards to find a space
      // Generate second string, and exit upon completion.
      uiHyphenLet = uiLet; // Save the hyphen location as it won't change.
      uiNewLet = uiLet;
      while (curletter >= 0) {
        if (pStr.charCodeAt(curletter) == 32) {
          // Split Line!
          fLineSplit = true;

          pStr2 = pStr.substring(uiNewLet + 1);
          pStr = pStr.substring(0, uiNewLet);
        }

        if (fLineSplit)
          break;

        uiNewLet--;
        curletter--;
      }
      if (!fLineSplit) {
        // We completed the check for a space, but failed, so use the hyphen method.
        pStr2 = swprintf("-%s", pStr.substring(uiHyphenLet));
        pStr = pStr.substring(0, uiHyphenLet);
        fLineSplit = true; // hyphen method
        break;
      }
    }

    //		if ( fLineSplit )
    //			break;

    uiLet++;
    curletter++;
  }

  return { pStr, pStr2 };
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
    zCdFile = sprintf("%s%s", zCdLocation, gCheckFilenames[cnt]);

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
