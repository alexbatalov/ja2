const SHADE_TABLE_DIR = "ShadeTables";

let TileSurfaceFilenames: CHAR8[][] /* [NUMBEROFTILETYPES][32] */;
let gfForceBuildShadeTables: BOOLEAN = FALSE;

function DetermineRGBDistributionSettings(): void {
  let DataDir: STRING512;
  let ExecDir: STRING512;
  let ShadeTableDir: STRING512;
  let uiRBitMask: UINT32;
  let uiGBitMask: UINT32;
  let uiBBitMask: UINT32;
  let uiPrevRBitMask: UINT32;
  let uiPrevGBitMask: UINT32;
  let uiPrevBBitMask: UINT32;
  let uiNumBytesRead: UINT32;
  let hfile: HWFILE;
  let fSaveRGBDist: BOOLEAN = FALSE;
  let fCleanShadeTable: BOOLEAN = FALSE;
  let fLoadedPrevRGBDist: BOOLEAN = FALSE;

  // First, determine if we have a file saved.  If not, then this is the first time, and
  // all shade tables will have to be built and saved to disk.  This can be time consuming, adding up to
  // 3-4 seconds to the time of a map load.
  GetExecutableDirectory(ExecDir);
  sprintf(ShadeTableDir, "%s\\Data\\%s", ExecDir, SHADE_TABLE_DIR);

  // Check to make sure we have a ShadeTable directory.  If we don't create one!
  if (!SetFileManCurrentDirectory(ShadeTableDir)) {
    if (!MakeFileManDirectory(ShadeTableDir)) {
      AssertMsg(0, "ShadeTable directory doesn't exist, and couldn't create one!");
    }
    if (!SetFileManCurrentDirectory(ShadeTableDir)) {
      AssertMsg(0, "Couldn't access the newly created ShadeTable directory.");
    }
    fSaveRGBDist = TRUE;
  }

  if (!fSaveRGBDist) {
    // Load the previous RGBDist and determine if it is the same one
    if (!FileExists("RGBDist.dat") || FileExists("ResetShadeTables.txt")) {
      // Can't find the RGBDist.dat file.  The directory exists, but the file doesn't, which
      // means the user deleted the file manually.  Now, set it up to create a new one.
      fSaveRGBDist = TRUE;
      fCleanShadeTable = TRUE;
    } else {
      hfile = FileOpen("RGBDist.dat", FILE_ACCESS_READ, FALSE);
      if (!hfile) {
        AssertMsg(0, "Couldn't open RGBDist.dat, even though it exists!");
      }
      FileRead(hfile, addressof(uiPrevRBitMask), sizeof(UINT32), addressof(uiNumBytesRead));
      FileRead(hfile, addressof(uiPrevGBitMask), sizeof(UINT32), addressof(uiNumBytesRead));
      FileRead(hfile, addressof(uiPrevBBitMask), sizeof(UINT32), addressof(uiNumBytesRead));
      fLoadedPrevRGBDist = TRUE;
      FileClose(hfile);
    }
  }

  if (!GetPrimaryRGBDistributionMasks(addressof(uiRBitMask), addressof(uiGBitMask), addressof(uiBBitMask))) {
    AssertMsg(0, "Failed to extract the current RGB distribution masks.");
  }
  if (fLoadedPrevRGBDist) {
    if (uiRBitMask != uiPrevRBitMask || uiGBitMask != uiPrevGBitMask || uiBBitMask != uiPrevBBitMask) {
      // The user has changed modes since the last time he has played JA2.  This essentially can only happen if:
      // 1)  The video card has been changed since the last run of JA2.
      // 2)  Certain video cards have different RGB distributions in different operating systems such as
      //		the Millenium card using Windows NT or Windows 95
      // 3)  The user has physically modified the RGBDist.dat file.
      fSaveRGBDist = TRUE;
      fCleanShadeTable = TRUE;
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
    hfile = FileOpen("RGBDist.dat", FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);
    if (!hfile) {
      AssertMsg(0, "Couldn't create RGBDist.dat for writing!");
    }
    FileWrite(hfile, addressof(uiRBitMask), sizeof(UINT32), addressof(uiNumBytesRead));
    FileWrite(hfile, addressof(uiGBitMask), sizeof(UINT32), addressof(uiNumBytesRead));
    FileWrite(hfile, addressof(uiBBitMask), sizeof(UINT32), addressof(uiNumBytesRead));
    FileClose(hfile);
  }

  // We're done, so restore the executable directory to JA2\Data.
  sprintf(DataDir, "%s\\Data", ExecDir);
  SetFileManCurrentDirectory(DataDir);
}

function LoadShadeTable(pObj: HVOBJECT, uiTileTypeIndex: UINT32): BOOLEAN {
  let hfile: HWFILE;
  let i: INT32;
  let uiNumBytesRead: UINT32;
  let ShadeFileName: UINT8[] /* [100] */;
  let ptr: Pointer<UINT8>;
  // ASSUMPTIONS:
  // We are assuming that the uiTileTypeIndex is referring to the correct file
  // stored in the TileSurfaceFilenames[].  If it isn't, then that is a huge problem
  // and should be fixed.  Also assumes that the directory is set to Data\ShadeTables.
  strcpy(ShadeFileName, TileSurfaceFilenames[uiTileTypeIndex]);
  ptr = strstr(ShadeFileName, ".");
  if (!ptr) {
    return FALSE;
  }
  ptr++;
  sprintf(ptr, "sha");

  hfile = FileOpen(ShadeFileName, FILE_ACCESS_READ, FALSE);
  if (!hfile) {
    // File doesn't exist, so generate it
    FileClose(hfile);
    return FALSE;
  }

  // MISSING:  Compare time stamps.

  for (i = 0; i < 16; i++) {
    pObj.value.pShades[i] = MemAlloc(512);
    Assert(pObj.value.pShades[i]);
    FileRead(hfile, pObj.value.pShades[i], 512, addressof(uiNumBytesRead));
  }

  // The file exists, now make sure the
  FileClose(hfile);
  return TRUE;
}

function SaveShadeTable(pObj: HVOBJECT, uiTileTypeIndex: UINT32): BOOLEAN {
  let hfile: HWFILE;
  let i: INT32;
  let uiNumBytesWritten: UINT32;
  let ShadeFileName: UINT8[] /* [100] */;
  let ptr: Pointer<UINT8>;
  // ASSUMPTIONS:
  // We are assuming that the uiTileTypeIndex is referring to the correct file
  // stored in the TileSurfaceFilenames[].  If it isn't, then that is a huge problem
  // and should be fixed.  Also assumes that the directory is set to Data\ShadeTables.
  strcpy(ShadeFileName, TileSurfaceFilenames[uiTileTypeIndex]);
  ptr = strstr(ShadeFileName, ".");
  if (!ptr) {
    return FALSE;
  }
  ptr++;
  sprintf(ptr, "sha");

  hfile = FileOpen(ShadeFileName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);
  if (!hfile) {
    FileClose(hfile);
    AssertMsg(0, String("Can't create %s", ShadeFileName));
    return FALSE;
  }
  for (i = 0; i < 16; i++) {
    FileWrite(hfile, pObj.value.pShades[i], 512, addressof(uiNumBytesWritten));
  }

  FileClose(hfile);
  return TRUE;
}

function DeleteShadeTableDir(): BOOLEAN {
  return RemoveFileManDirectory(SHADE_TABLE_DIR, TRUE);
}
