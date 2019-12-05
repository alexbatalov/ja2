namespace ja2 {

const SHADE_TABLE_DIR = "ShadeTables";

export let gfForceBuildShadeTables: boolean = false;

export function DetermineRGBDistributionSettings(): void {
  let DataDir: string /* STRING512 */;
  let ExecDir: string /* STRING512 */;
  let ShadeTableDir: string /* STRING512 */;
  let uiRBitMask: UINT32;
  let uiGBitMask: UINT32;
  let uiBBitMask: UINT32;
  let uiPrevRBitMask: UINT32 = <UINT32><unknown>undefined;
  let uiPrevGBitMask: UINT32 = <UINT32><unknown>undefined;
  let uiPrevBBitMask: UINT32 = <UINT32><unknown>undefined;
  let uiNumBytesRead: UINT32;
  let hfile: HWFILE;
  let fSaveRGBDist: boolean = false;
  let fCleanShadeTable: boolean = false;
  let fLoadedPrevRGBDist: boolean = false;
  let buffer: Buffer;

  // First, determine if we have a file saved.  If not, then this is the first time, and
  // all shade tables will have to be built and saved to disk.  This can be time consuming, adding up to
  // 3-4 seconds to the time of a map load.
  GetExecutableDirectory(ExecDir);
  ShadeTableDir = sprintf("%s\\Data\\%s", ExecDir, SHADE_TABLE_DIR);

  // Check to make sure we have a ShadeTable directory.  If we don't create one!
  if (!SetFileManCurrentDirectory(ShadeTableDir)) {
    if (!MakeFileManDirectory(ShadeTableDir)) {
      AssertMsg(0, "ShadeTable directory doesn't exist, and couldn't create one!");
    }
    if (!SetFileManCurrentDirectory(ShadeTableDir)) {
      AssertMsg(0, "Couldn't access the newly created ShadeTable directory.");
    }
    fSaveRGBDist = true;
  }

  if (!fSaveRGBDist) {
    // Load the previous RGBDist and determine if it is the same one
    if (!FileExists("RGBDist.dat") || FileExists("ResetShadeTables.txt")) {
      // Can't find the RGBDist.dat file.  The directory exists, but the file doesn't, which
      // means the user deleted the file manually.  Now, set it up to create a new one.
      fSaveRGBDist = true;
      fCleanShadeTable = true;
    } else {
      hfile = FileOpen("RGBDist.dat", FILE_ACCESS_READ, false);
      if (!hfile) {
        AssertMsg(false, "Couldn't open RGBDist.dat, even though it exists!");
      }

      buffer = Buffer.allocUnsafe(4);

      uiNumBytesRead = FileRead(hfile, buffer, 4);
      uiPrevRBitMask = buffer.readUInt32LE(0);

      uiNumBytesRead = FileRead(hfile, buffer, 4);
      uiPrevGBitMask = buffer.readUInt32LE(0);

      uiNumBytesRead = FileRead(hfile, buffer, 4);
      uiPrevBBitMask = buffer.readUInt32LE(0);

      fLoadedPrevRGBDist = true;
      FileClose(hfile);
    }
  }

  ({ usRedMask: uiRBitMask, usGreenMask: uiGBitMask, usBlueMask: uiBBitMask } = GetPrimaryRGBDistributionMasks());

  if (fLoadedPrevRGBDist) {
    if (uiRBitMask != uiPrevRBitMask || uiGBitMask != uiPrevGBitMask || uiBBitMask != uiPrevBBitMask) {
      // The user has changed modes since the last time he has played JA2.  This essentially can only happen if:
      // 1)  The video card has been changed since the last run of JA2.
      // 2)  Certain video cards have different RGB distributions in different operating systems such as
      //		the Millenium card using Windows NT or Windows 95
      // 3)  The user has physically modified the RGBDist.dat file.
      fSaveRGBDist = true;
      fCleanShadeTable = true;
    }
  }
  if (fCleanShadeTable) {
    // This means that we are going to remove all of the current shade tables, if any exist, and
    // start fresh.
    EraseDirectory(ShadeTableDir);
  }
  if (fSaveRGBDist) {
    // The RGB distribution is going to be saved in a tiny file for future reference.  As long as the
    // RGB distribution never changes, the shade table will grow until eventually, all tilesets are loaded,
    // shadetables generated and saved in this directory.
    hfile = FileOpen("RGBDist.dat", FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);
    if (!hfile) {
      AssertMsg(0, "Couldn't create RGBDist.dat for writing!");
    }

    buffer = Buffer.allocUnsafe(4);

    buffer.writeUInt32LE(uiRBitMask, 0);
    uiNumBytesRead = FileWrite(hfile, buffer, 4);

    buffer.writeUInt32LE(uiGBitMask, 0);
    uiNumBytesRead = FileWrite(hfile, buffer, 4);

    buffer.writeUInt32LE(uiBBitMask, 0);
    uiNumBytesRead = FileWrite(hfile, buffer, 4);

    FileClose(hfile);
  }

  // We're done, so restore the executable directory to JA2\Data.
  DataDir = sprintf("%s\\Data", ExecDir);
  SetFileManCurrentDirectory(DataDir);
}

export function LoadShadeTable(pObj: HVOBJECT, uiTileTypeIndex: UINT32): boolean {
  let hfile: HWFILE;
  let i: INT32;
  let uiNumBytesRead: UINT32;
  let ShadeFileName: string /* UINT8[100] */;
  let ptr: number /* Pointer<UINT8> */;
  let buffer: Buffer;

  // ASSUMPTIONS:
  // We are assuming that the uiTileTypeIndex is referring to the correct file
  // stored in the TileSurfaceFilenames[].  If it isn't, then that is a huge problem
  // and should be fixed.  Also assumes that the directory is set to Data\ShadeTables.
  ShadeFileName = TileSurfaceFilenames[uiTileTypeIndex];
  ptr = ShadeFileName.indexOf(".");
  if (ptr === -1) {
    return false;
  }
  ShadeFileName = ShadeFileName.substring(0, ptr) + '.sha';

  hfile = FileOpen(ShadeFileName, FILE_ACCESS_READ, false);
  if (!hfile) {
    // File doesn't exist, so generate it
    FileClose(hfile);
    return false;
  }

  // MISSING:  Compare time stamps.

  for (i = 0; i < 16; i++) {
    buffer = Buffer.allocUnsafe(512);
    uiNumBytesRead = FileRead(hfile, buffer, 512);
    pObj.value.pShades[i] = new Uint16Array(buffer.buffer, buffer.byteOffset, 256);
  }

  // The file exists, now make sure the
  FileClose(hfile);
  return true;
}

export function SaveShadeTable(pObj: HVOBJECT, uiTileTypeIndex: UINT32): boolean {
  let hfile: HWFILE;
  let i: INT32;
  let uiNumBytesWritten: UINT32;
  let ShadeFileName: string /* UINT8[100] */;
  let ptr: number /* Pointer<UINT8> */;
  let buffer: Buffer;

  // ASSUMPTIONS:
  // We are assuming that the uiTileTypeIndex is referring to the correct file
  // stored in the TileSurfaceFilenames[].  If it isn't, then that is a huge problem
  // and should be fixed.  Also assumes that the directory is set to Data\ShadeTables.
  ShadeFileName = TileSurfaceFilenames[uiTileTypeIndex];
  ptr = ShadeFileName.indexOf(".");
  if (ptr === -1) {
    return false;
  }
  ShadeFileName = ShadeFileName.substring(0, ptr) + '.sha';

  hfile = FileOpen(ShadeFileName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);
  if (!hfile) {
    FileClose(hfile);
    AssertMsg(0, FormatString("Can't create %s", ShadeFileName));
    return false;
  }

  for (i = 0; i < 16; i++) {
    buffer = Buffer.from(pObj.value.pShades[i].buffer, pObj.value.pShades[i].byteOffset, pObj.value.pShades[i].byteLength);
    uiNumBytesWritten = FileWrite(hfile, buffer, 512);
  }

  FileClose(hfile);
  return true;
}

export function DeleteShadeTableDir(): boolean {
  return RemoveFileManDirectory(SHADE_TABLE_DIR, true);
}

}
