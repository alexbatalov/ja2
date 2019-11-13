namespace ja2 {

const path: typeof import('path') = require('path');

// NUMBER_OF_LIBRARIES

// used when doing the binary search of the libraries
let gsCurrentLibrary: INT16 = -1;

// The location of the cdrom drive
export let gzCdDirectory: string /* CHAR8[SGPFILENAME_LEN] */;

//************************************************************************
//
//	 InitializeFileDatabase():  Call this function to initialize the file
//	database.  It will use the gGameLibaries[] array for the list of libraries
//	and the define NUMBER_OF_LIBRARIES for the number of libraries.  The gGameLibaries
//	array is an array of structure, one of the fields determines if the library
//	will be initialized and game start.
//
//************************************************************************
export function InitializeFileDatabase(): boolean {
  let i: INT16;
  let uiSize: UINT32;
  let fLibraryInited: boolean = false;

  // if all the libraries exist, set them up
  gFileDataBase.usNumberOfLibraries = Enum30.NUMBER_OF_LIBRARIES;

  // allocate memory for the each of the library headers
  uiSize = Enum30.NUMBER_OF_LIBRARIES;
  if (uiSize) {
    gFileDataBase.pLibraries = createArrayFrom(uiSize, createLibraryHeaderStruct);

    // Load up each library
    for (i = 0; i < Enum30.NUMBER_OF_LIBRARIES; i++) {
      // if you want to init the library at the begining of the game
      if (gGameLibaries[i].fInitOnStart) {
        // if the library exists
        if (OpenLibrary(i))
          fLibraryInited = true;

        // else the library doesnt exist
        else {
          FastDebugMsg(FormatString("Warning in InitializeFileDatabase( ): Library Id #%d (%s) is to be loaded but cannot be found.\n", i, gGameLibaries[i].sLibraryName));
          gFileDataBase.pLibraries[i].fLibraryOpen = false;
        }
      }
    }
    // signify that the database has been initialized ( only if there was a library loaded )
    gFileDataBase.fInitialized = fLibraryInited;
  }

  // allocate memory for the handles of the 'real files' that will be open
  // This is needed because the the code wouldnt be able to tell the difference between a 'real' handle and a made up one
  uiSize = INITIAL_NUM_HANDLES;
  gFileDataBase.RealFiles.pRealFilesOpen = createArrayFrom(uiSize, createRealFileOpenStruct);

  // set the initial number how many files can be opened at the one time
  gFileDataBase.RealFiles.iSizeOfOpenFileArray = INITIAL_NUM_HANDLES;

  return true;
}

//*****************************************************************************************
// ReopenCDLibraries
//
// Closes all CD libraries, then reopens them. This function needs to be called when CDs
// are changed.
//
// Returns BOOLEAN            - TRUE, always
//
// Created:  3/21/00 Derek Beland
//*****************************************************************************************
function ReopenCDLibraries(): boolean {
  let i: INT16;

  // Load up each library
  for (i = 0; i < Enum30.NUMBER_OF_LIBRARIES; i++) {
    if (gFileDataBase.pLibraries[i].fLibraryOpen && gGameLibaries[i].fOnCDrom)
      CloseLibrary(i);

    if (gGameLibaries[i].fOnCDrom)
      OpenLibrary(i);
  }

  return true;
}

//************************************************************************
//
//	 ShutDownFileDatabase():  Call this function to close down the file
//	database.
//
//************************************************************************

export function ShutDownFileDatabase(): boolean {
  let sLoop1: UINT16;

  // Free up the memory used for each library
  for (sLoop1 = 0; sLoop1 < gFileDataBase.usNumberOfLibraries; sLoop1++)
    CloseLibrary(sLoop1);

  // Free up the memory used for all the library headers
  if (gFileDataBase.pLibraries) {
    gFileDataBase.pLibraries = <LibraryHeaderStruct[]><unknown>null;
  }

  // loop through all the 'opened files' ( there should be no files open )
  for (sLoop1 = 0; sLoop1 < gFileDataBase.RealFiles.iNumFilesOpen; sLoop1++) {
    FastDebugMsg(FormatString("ShutDownFileDatabase( ):  ERROR:  real file id still exists, wasnt closed"));
    CloseHandle(gFileDataBase.RealFiles.pRealFilesOpen[sLoop1].hRealFileHandle);
  }

  // Free up the memory used for the real files array for the opened files
  if (gFileDataBase.RealFiles.pRealFilesOpen) {
    gFileDataBase.RealFiles.pRealFilesOpen = <RealFileOpenStruct[]><unknown>null;
  }

  return true;
}

function CheckForLibraryExistence(pLibraryName: string /* STR */): boolean {
  let fRetVal: boolean = false;
  let hFile: HANDLE;

  // try to opent the file, if we canm the library exists
  hFile = CreateFile(pLibraryName, GENERIC_READ, 0, null, OPEN_EXISTING, FILE_FLAG_RANDOM_ACCESS, null);

  // if the file was not opened
  if (hFile == INVALID_HANDLE_VALUE) {
    // the file wasnt opened
    fRetVal = false;
  } else {
    CloseHandle(hFile);
    fRetVal = true;
  }

  return fRetVal;
}

function InitializeLibrary(pLibraryName: string /* STR */, pLibHeader: LibraryHeaderStruct, fCanBeOnCDrom: boolean): boolean {
  let hFile: HANDLE;
  let usNumEntries: UINT16 = 0;
  let uiNumBytesRead: UINT32;
  let uiLoop: UINT32;
  let DirEntry: DIRENTRY = createDirEntry();
  let LibFileHeader: LIBHEADER = createLibHeader();
  let uiCount: UINT32 = 0;
  let zTempPath: string /* CHAR8[SGPFILENAME_LEN] */;

  let buffer: Buffer;

  // open the library for reading ( if it exists )
  hFile = CreateFile(pLibraryName, GENERIC_READ, 0, null, OPEN_EXISTING, FILE_FLAG_RANDOM_ACCESS, null);
  if (hFile == INVALID_HANDLE_VALUE) {
    // error opening the library
    return false;
  }

  // Read in the library header ( at the begining of the library )
  buffer = Buffer.allocUnsafe(LIBHEADER_SIZE);
  if ((uiNumBytesRead = ReadFile(hFile, buffer, LIBHEADER_SIZE)) === -1)
    return false;

  if (uiNumBytesRead != LIBHEADER_SIZE) {
    // Error Reading the file database header.
    return false;
  }

  readLibHeader(LibFileHeader, buffer);

  // place the file pointer at the begining of the file headers ( they are at the end of the file )
  SetFilePointer(hFile, -(LibFileHeader.iEntries * DIRENTRY_SIZE), null, FILE_END);

  // loop through the library and determine the number of files that are FILE_OK
  // ie.  so we dont load the old or deleted files
  usNumEntries = 0;
  buffer = Buffer.allocUnsafe(DIRENTRY_SIZE);
  for (uiLoop = 0; uiLoop < LibFileHeader.iEntries; uiLoop++) {
    // read in the file header
    if ((uiNumBytesRead = ReadFile(hFile, buffer, DIRENTRY_SIZE)) === -1)
      return false;

    readDirEntry(DirEntry, buffer);

    if (DirEntry.ubState == FILE_OK)
      usNumEntries++;
  }

  // Allocate enough memory for the library header
  pLibHeader.pFileHeader = createArrayFrom(usNumEntries, createFileHeaderStruct);

  // place the file pointer at the begining of the file headers ( they are at the end of the file )
  SetFilePointer(hFile, -(LibFileHeader.iEntries * DIRENTRY_SIZE), null, FILE_END);

  // loop through all the entries
  uiCount = 0;
  buffer = Buffer.allocUnsafe(DIRENTRY_SIZE);
  for (uiLoop = 0; uiLoop < LibFileHeader.iEntries; uiLoop++) {
    // read in the file header
    if ((uiNumBytesRead = ReadFile(hFile, buffer, DIRENTRY_SIZE)) === -1)
      return false;

    readDirEntry(DirEntry, buffer);

    if (DirEntry.ubState == FILE_OK) {
      // Check to see if the file is not longer then it should be
      if ((DirEntry.sFileName.length + 1) >= FILENAME_SIZE)
        FastDebugMsg(FormatString("\n*******InitializeLibrary():  Warning!:  '%s' from the library '%s' has name whose size (%d) is bigger then it should be (%s)", DirEntry.sFileName, pLibHeader.sLibraryPath, (DirEntry.sFileName.length + 1), FILENAME_SIZE));

      // copy the file name, offset and length into the header
      pLibHeader.pFileHeader[uiCount].pFileName = DirEntry.sFileName;
      pLibHeader.pFileHeader[uiCount].uiFileOffset = DirEntry.uiOffset;
      pLibHeader.pFileHeader[uiCount].uiFileLength = DirEntry.uiLength;

      uiCount++;
    }
  }

  pLibHeader.usNumberOfEntries = usNumEntries;

  // allocate memory for the library path
  //	if( strlen( LibFileHeader.sPathToLibrary ) == 0 )
  {
    //		FastDebugMsg( String("The %s library file does not contain a path.  Use 'n' argument to name the library when you create it\n", LibFileHeader.sLibName ) );
    //		Assert( 0 );
  }

  // if the library has a path
  if (LibFileHeader.sPathToLibrary.length != 0) {
    pLibHeader.sLibraryPath = LibFileHeader.sPathToLibrary;
  } else {
    // else the library name does not contain a path ( most likely either an error or it is the default path )
    pLibHeader.sLibraryPath = "";
  }

  // allocate space for the open files array
  pLibHeader.pOpenFiles = createArrayFrom(INITIAL_NUM_HANDLES, createFileOpenStruct);

  pLibHeader.hLibraryHandle = hFile;
  pLibHeader.usNumberOfEntries = usNumEntries;
  pLibHeader.fLibraryOpen = true;
  pLibHeader.iNumFilesOpen = 0;
  pLibHeader.iSizeOfOpenFileArray = INITIAL_NUM_HANDLES;

  return true;
}

export function LoadDataFromLibrary(sLibraryID: INT16, uiFileNum: UINT32, pData: PTR, uiBytesToRead: UINT32): UINT32 {
  let uiOffsetInLibrary: UINT32;
  let uiLength: UINT32;
  let hLibraryFile: HANDLE;
  let uiNumBytesRead: UINT32;
  let uiCurPos: UINT32;

  // get the offset into the library, the length and current position of the file pointer.
  uiOffsetInLibrary = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.uiFileOffset;
  uiLength = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.uiFileLength;
  hLibraryFile = gFileDataBase.pLibraries[sLibraryID].hLibraryHandle;
  uiCurPos = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;

  // set the file pointer to the right location
  SetFilePointer(hLibraryFile, (uiOffsetInLibrary + uiCurPos), null, FILE_BEGIN);

  // if we are trying to read more data then the size of the file, return an error
  if (uiBytesToRead + uiCurPos > uiLength) {
    return -1;
  }

  // get the data
  if ((uiNumBytesRead = ReadFile(hLibraryFile, pData, uiBytesToRead)) === -1)
    return -1;

  if (uiBytesToRead != uiNumBytesRead) {
    //		Gets the reason why the function failed
    //		UINT32 uiLastError = GetLastError();
    //		char zString[1024];
    //		FormatMessage( FORMAT_MESSAGE_FROM_SYSTEM, 0, uiLastError, 0, zString, 1024, NULL);

    return -1;
  }

  gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile += uiNumBytesRead;

  //	CloseHandle( hLibraryFile );

  return uiNumBytesRead;
}

//************************************************************************
//
// CheckIfFileExistInLibrary() determines if a file exists in a library.
//
//************************************************************************

export function CheckIfFileExistInLibrary(pFileName: string /* STR */): boolean {
  let sLibraryID: INT16;
  let pFileHeader: FileHeaderStruct | null;

  // get thelibrary that file is in
  sLibraryID = GetLibraryIDFromFileName(pFileName);
  if (sLibraryID == -1) {
    // not in any library
    return false;
  }

  if ((pFileHeader = GetFileHeaderFromLibrary(sLibraryID, pFileName)) !== null)
    return true;
  else
    return false;
}

//************************************************************************
//
//	This function finds out if the file CAN be in a library.  It determines
//	if the library that the file MAY be in is open.
//	( eg. File is  Laptop\Test.sti, if the Laptop\ library is open, it returns true
//
//************************************************************************
function GetLibraryIDFromFileName(pFileName: string /* STR */): INT16 {
  let sLoop1: INT16;
  let sBestMatch: INT16 = -1;

  // loop through all the libraries to check which library the file is in
  for (sLoop1 = 0; sLoop1 < gFileDataBase.usNumberOfLibraries; sLoop1++) {
    // if the library is not loaded, dont try to access the array
    if (IsLibraryOpened(sLoop1)) {
      // if the library path name is of size zero, ( the library is for the default path )
      if (gFileDataBase.pLibraries[sLoop1].sLibraryPath.length == 0) {
        // determine if there is a directory in the file name
        if (pFileName.indexOf('\\') == -1 && pFileName.indexOf('//') == -1) {
          // There is no directory in the file name
          return sLoop1;
        }
      }

      // compare the library name to the file name that is passed in
      else {
        // if the directory paths are the same, to the length of the lib's path
        if (pFileName.toLowerCase().startsWith(gFileDataBase.pLibraries[sLoop1].sLibraryPath.toLowerCase())) {
          // if we've never matched, or this match's path is longer than the previous match (meaning it's more exact)
          if ((sBestMatch == (-1)) || (gFileDataBase.pLibraries[sLoop1].sLibraryPath.length > gFileDataBase.pLibraries[sBestMatch].sLibraryPath.length))
            sBestMatch = sLoop1;
        }
      }
    }
  }

  // no library was found, return an error
  return sBestMatch;
}

//************************************************************************
//
//	GetFileHeaderFromLibrary() performsperforms a binary search of the
//	library.  It adds the libraries path to the file in the
//	library and then string compared that to the name that we are
//	searching for.
//
//************************************************************************

function GetFileHeaderFromLibrary(sLibraryID: INT16, pstrFileName: string /* STR */): FileHeaderStruct | null {
  let ppFileHeader: FileHeaderStruct | null = null;
  let sFileNameWithPath: string /* CHAR8[FILENAME_SIZE] */;

  // combine the library path to the file name (need it for the search of the library )
  sFileNameWithPath = pstrFileName;

  gsCurrentLibrary = sLibraryID;

  /* try to find the filename using a binary search algorithm: */
  for (let i = 0; i < gFileDataBase.pLibraries[sLibraryID].pFileHeader.length; i++) {
    if (CompareFileNames(sFileNameWithPath, gFileDataBase.pLibraries[sLibraryID].pFileHeader[i])) {
      ppFileHeader = gFileDataBase.pLibraries[sLibraryID].pFileHeader[i];
    }
  }

  return ppFileHeader;
}

//************************************************************************
//
//	CompareFileNames() gets called by the binary search function.
//
//************************************************************************

function CompareFileNames(arg1: string /* Pointer<CHAR8>[] */, arg2: FileHeaderStruct): boolean {
  let sSearchKey: string /* CHAR8[FILENAME_SIZE] */;
  let sFileNameWithPath: string /* CHAR8[FILENAME_SIZE] */;
  let TempFileHeader: FileHeaderStruct;

  TempFileHeader = arg2;

  sSearchKey = arg1;

  sFileNameWithPath = gFileDataBase.pLibraries[gsCurrentLibrary].sLibraryPath + TempFileHeader.pFileName;

  /* Compare all of both strings: */
  return sSearchKey.toLowerCase() == sFileNameWithPath.toLowerCase();
}

//************************************************************************
//
// This function will see if a file is in a library.  If it is, the file will be opened and a file
// handle will be created for it.
//
//************************************************************************

export function OpenFileFromLibrary(pName: string /* STR */): HWFILE {
  let pFileHeader: FileHeaderStruct | null;
  let hLibFile: HWFILE;
  let sLibraryID: INT16;
  let uiLoop1: UINT16;
  let uiFileNum: UINT32 = 0;

  let uiNewFilePosition: UINT32 = 0;

  // Check if the file can be contained from an open library ( the path to the file a library path )
  sLibraryID = GetLibraryIDFromFileName(pName);

  if (sLibraryID != -1) {
    // Check if another file is already open in the library ( report a warning if so )

    //		if( gFileDataBase.pLibraries[ sLibraryID ].fAnotherFileAlreadyOpenedLibrary )
    if (gFileDataBase.pLibraries[sLibraryID].uiIdOfOtherFileAlreadyOpenedLibrary != 0) {
      // Temp removed
      //			FastDebugMsg(String("\n*******\nOpenFileFromLibrary():  Warning!:  Trying to load file '%s' from the library '%s' which already has a file open\n", pName, gGameLibaries[ sLibraryID ].sLibraryName ) );
      //			FastDebugMsg(String("\n*******\nOpenFileFromLibrary():  Warning!:  Trying to load file '%s' from the library '%s' which already has a file open ( file open is '%s')\n", pName, gGameLibaries[ sLibraryID ].sLibraryName, gFileDataBase.pLibraries[ sLibraryID ].pOpenFiles[ gFileDataBase.pLibraries[ sLibraryID ].uiIdOfOtherFileAlreadyOpenedLibrary ].pFileHeader->pFileName ) );
    }

    // check if the file is already open
    if (CheckIfFileIsAlreadyOpen(pName, sLibraryID))
      return 0;

    // if the file is in a library, get the file
    if ((pFileHeader = GetFileHeaderFromLibrary(sLibraryID, pName)) !== null) {
      // increment the number of open files
      gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen++;

      // if there isnt enough space to put the file, realloc more space
      if (gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen >= gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray) {
        let pOpenFiles: FileOpenStruct[];

        // reallocate more space for the array
        pOpenFiles = gFileDataBase.pLibraries[sLibraryID].pOpenFiles.concat(createArrayFrom(NUM_FILES_TO_ADD_AT_A_TIME, createFileOpenStruct));

        // increment the number of open files that we can have open
        gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray += NUM_FILES_TO_ADD_AT_A_TIME;

        gFileDataBase.pLibraries[sLibraryID].pOpenFiles = pOpenFiles;
      }

      // loop through to find a new spot in the array
      uiFileNum = 0;
      for (uiLoop1 = 1; uiLoop1 < gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray; uiLoop1++) {
        if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiLoop1].uiFileID == 0) {
          uiFileNum = uiLoop1;
          break;
        }
      }

      // if for some reason we couldnt find a spot, return an error
      if (uiFileNum == 0)
        return 0;

      // Create a library handle for the new file
      hLibFile = CreateLibraryFileHandle(sLibraryID, uiFileNum);

      // Set the current file data into the array of open files
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID = hLibFile;
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile = 0;
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader = pFileHeader;

      // Save the current file position in the library
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiActualPositionInLibrary = SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, 0, null, FILE_CURRENT);

      // Set the file position in the library to the begining of the 'file' in the library
      uiNewFilePosition = SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.uiFileOffset, null, FILE_BEGIN);

      uiNewFilePosition = GetFileSize(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, null);
    } else {
      // Failed to find the file in a library
      return 0;
    }
  } else {
    // Library is not open, or doesnt exist
    return 0;
  }

  // Set the fact the a file is currently open in the library
  //	gFileDataBase.pLibraries[ sLibraryID ].fAnotherFileAlreadyOpenedLibrary = TRUE;
  gFileDataBase.pLibraries[sLibraryID].uiIdOfOtherFileAlreadyOpenedLibrary = uiFileNum;

  return hLibFile;
}

function CreateLibraryFileHandle(sLibraryID: INT16, uiFileNum: UINT32): HWFILE {
  let hLibFile: HWFILE;

  hLibFile = uiFileNum;
  hLibFile |= DB_ADD_LIBRARY_ID(sLibraryID);

  return hLibFile;
}

export function CreateRealFileHandle(hFile: HANDLE): HWFILE {
  let hLibFile: HWFILE;
  let iLoop1: INT32;
  let uiFileNum: UINT32 = 0;
  let uiSize: UINT32;

  // if there isnt enough space to put the file, realloc more space
  if (gFileDataBase.RealFiles.iNumFilesOpen >= (gFileDataBase.RealFiles.iSizeOfOpenFileArray - 1)) {
    uiSize = NUM_FILES_TO_ADD_AT_A_TIME;

    gFileDataBase.RealFiles.pRealFilesOpen = gFileDataBase.RealFiles.pRealFilesOpen.concat(createArrayFrom(uiSize, createRealFileOpenStruct));

    gFileDataBase.RealFiles.iSizeOfOpenFileArray += NUM_FILES_TO_ADD_AT_A_TIME;
  }

  // loop through to find a new spot in the array
  uiFileNum = 0;
  for (iLoop1 = 1; iLoop1 < gFileDataBase.RealFiles.iSizeOfOpenFileArray; iLoop1++) {
    if (gFileDataBase.RealFiles.pRealFilesOpen[iLoop1].uiFileID == 0) {
      uiFileNum = iLoop1;
      break;
    }
  }

  // if for some reason we couldnt find a spot, return an error
  if (uiFileNum == 0)
    return 0;

  hLibFile = uiFileNum;
  hLibFile |= DB_ADD_LIBRARY_ID(REAL_FILE_LIBRARY_ID);

  gFileDataBase.RealFiles.pRealFilesOpen[iLoop1].uiFileID = hLibFile;
  gFileDataBase.RealFiles.pRealFilesOpen[iLoop1].hRealFileHandle = hFile;

  gFileDataBase.RealFiles.iNumFilesOpen++;

  return hLibFile;
}

//************************************************************************
//
//	Close an individual file that is contained in the library
//
//************************************************************************

export function CloseLibraryFile(sLibraryID: INT16, uiFileID: UINT32): boolean {
  if (IsLibraryOpened(sLibraryID)) {
    // if the uiFileID is invalid
    if ((uiFileID >= gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray))
      return false;

    // if the file is not opened, dont close it
    if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiFileID != 0) {
      // reset the variables
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiFileID = 0;
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiFilePosInFile = 0;
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].pFileHeader = <FileHeaderStruct><unknown>null;

      // reset the libraries file pointer to the positon it was in prior to opening the current file
      SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiActualPositionInLibrary, null, FILE_CURRENT);

      // decrement the number of files that are open
      gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen--;

      // Reset the fact that a file is accessing the library
      //			gFileDataBase.pLibraries[ sLibraryID ].fAnotherFileAlreadyOpenedLibrary = FALSE;
      gFileDataBase.pLibraries[sLibraryID].uiIdOfOtherFileAlreadyOpenedLibrary = 0;
    }
  }

  return true;
}

export function LibraryFileSeek(sLibraryID: INT16, uiFileNum: UINT32, uiDistance: UINT32, uiHowToSeek: UINT8): boolean {
  let uiCurPos: UINT32;
  let uiSize: UINT32;

  // if the library is not open, return an error
  if (!IsLibraryOpened(sLibraryID))
    return false;

  uiCurPos = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;
  uiSize = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.uiFileLength;

  if (uiHowToSeek == FILE_SEEK_FROM_START)
    uiCurPos = uiDistance;
  else if (uiHowToSeek == FILE_SEEK_FROM_END)
    uiCurPos = uiSize - uiDistance;
  else if (uiHowToSeek == FILE_SEEK_FROM_CURRENT)
    uiCurPos += uiDistance;
  else
    return false;

  gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile = uiCurPos;
  return true;
}

//************************************************************************
//
//	OpenLibrary() Opens a library from the 'array' of library names
//	that was passd in at game initialization.  Pass in an enum for the
//	library.
//
//************************************************************************

function OpenLibrary(sLibraryID: INT16): boolean {
  // if the library is already opened, report an error
  if (gFileDataBase.pLibraries[sLibraryID].fLibraryOpen)
    return false;

  // if we are trying to do something with an invalid library id
  if (sLibraryID >= gFileDataBase.usNumberOfLibraries)
    return false;

  // if we cant open the library
  if (!InitializeLibrary(gGameLibaries[sLibraryID].sLibraryName, gFileDataBase.pLibraries[sLibraryID], gGameLibaries[sLibraryID].fOnCDrom))
    return false;

  return true;
}

function CloseLibrary(sLibraryID: INT16): boolean {
  let uiLoop1: UINT32;

  // if the library isnt loaded, dont close it
  if (!IsLibraryOpened(sLibraryID))
    return false;

  // if there are any open files, loop through the library and close down whatever file is still open
  if (gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen) {
    // loop though the array of open files to see if any are still open
    for (uiLoop1 = 0; uiLoop1 < gFileDataBase.pLibraries[sLibraryID].usNumberOfEntries; uiLoop1++) {
      if (CheckIfFileIsAlreadyOpen(gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName, sLibraryID)) {
        FastDebugMsg(FormatString("CloseLibrary():  ERROR:  %s library file id still exists, wasnt closed, closing now.", gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName));
        CloseLibraryFile(sLibraryID, uiLoop1);

        //	Removed because the memory gets freed in the next for loop.  Would only enter here if files were still open
        //	gFileDataBase.pLibraries[ sLibraryID ].pFileHeader[ uiLoop1 ].pFileName = NULL;
      }
    }
  }

  // Free up the memory used for each file name
  for (uiLoop1 = 0; uiLoop1 < gFileDataBase.pLibraries[sLibraryID].usNumberOfEntries; uiLoop1++) {
    gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName = "";
  }

  // Free up the memory needed for the Library File Headers
  if (gFileDataBase.pLibraries[sLibraryID].pFileHeader) {
    gFileDataBase.pLibraries[sLibraryID].pFileHeader = <FileHeaderStruct[]><unknown>null;
  }

  // Free up the memory used for the library name
  if (gFileDataBase.pLibraries[sLibraryID].sLibraryPath) {
    gFileDataBase.pLibraries[sLibraryID].sLibraryPath = "";
  }

  // Free up the space requiered for the open files array
  if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles) {
    gFileDataBase.pLibraries[sLibraryID].pOpenFiles = <FileOpenStruct[]><unknown>null;
  }

  // set that the library isnt open
  gFileDataBase.pLibraries[sLibraryID].fLibraryOpen = false;

  // close the file ( note libraries are to be closed by the Windows close function )
  CloseHandle(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle);

  return true;
}

export function IsLibraryOpened(sLibraryID: INT16): boolean {
  // if the database is not initialized
  if (!gFileDataBase.fInitialized)
    return false;

  // if we are trying to do something with an invalid library id
  if (sLibraryID >= gFileDataBase.usNumberOfLibraries)
    return false;

  // if the library is opened
  if (gFileDataBase.pLibraries[sLibraryID].fLibraryOpen)
    return true;
  else
    return false;
}

function CheckIfFileIsAlreadyOpen(pFileName: string /* STR */, sLibraryID: INT16): boolean {
  let usLoop1: UINT16 = 0;

  let sName: string /* CHAR8[60] */;
  let sPath: string /* CHAR8[90] */;
  let sDrive: string /* CHAR8[60] */;
  let sExt: string /* CHAR8[6] */;

  let sTempName: string /* CHAR8[70] */;

  ({ root: sDrive, dir: sPath, name: sName, ext: sExt } = path.parse(pFileName));

  sTempName = sName;
  sTempName += sExt;

  // loop through all the open files to see if 'new' file to open is already open
  for (usLoop1 = 1; usLoop1 < gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray; usLoop1++) {
    // check if the file is open
    if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[usLoop1].uiFileID != 0) {
      // Check if the file already exists
      if (sTempName.toLowerCase() == gFileDataBase.pLibraries[sLibraryID].pOpenFiles[usLoop1].pFileHeader.pFileName.toLowerCase())
        return true;
    }
  }
  return false;
}

export function GetLibraryFileTime(sLibraryID: INT16, uiFileNum: UINT32, pLastWriteTime: SGP_FILETIME): boolean {
  let usNumEntries: UINT16 = 0;
  let uiNumBytesRead: UINT32;
  let pDirEntry: DIRENTRY | undefined;
  let LibFileHeader: LIBHEADER = createLibHeader();
  let fDone: boolean = false;
  //	UINT32	cnt;
  let iFilePos: INT32 = 0;

  let ppDirEntry: DIRENTRY | undefined;

  let pAllEntries: DIRENTRY[];

  let buffer: Buffer;

  pLastWriteTime.dwLowDateTime = 0;
  pLastWriteTime.dwHighDateTime = 0;

  SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, 0, null, FILE_BEGIN);

  // Read in the library header ( at the begining of the library )
  buffer = Buffer.allocUnsafe(LIBHEADER_SIZE);
  if ((uiNumBytesRead = ReadFile(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, buffer, LIBHEADER_SIZE)) === -1)
    return false;
  if (uiNumBytesRead != LIBHEADER_SIZE) {
    // Error Reading the file database header.
    return false;
  }

  readLibHeader(LibFileHeader, buffer);

  // If the file number is greater then the number in the lirary, return false
  if (uiFileNum >= LibFileHeader.iEntries)
    return false;

  pAllEntries = createArrayFrom(LibFileHeader.iEntries, createDirEntry);

  iFilePos = -(LibFileHeader.iEntries * DIRENTRY_SIZE);

  // set the file pointer to the right location
  SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, iFilePos, null, FILE_END);

  // Read in the library header ( at the begining of the library )
  buffer = Buffer.allocUnsafe(DIRENTRY_SIZE * LibFileHeader.iEntries);
  if ((uiNumBytesRead = ReadFile(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, buffer, (DIRENTRY_SIZE * LibFileHeader.iEntries))) === -1)
    return false;
  if (uiNumBytesRead != (DIRENTRY_SIZE * LibFileHeader.iEntries)) {
    // Error Reading the file database header.
    return false;
  }

  for (let i = 0; i < pAllEntries.length; i++) {
    readDirEntry(pAllEntries[i], buffer, i * DIRENTRY_SIZE);
  }

  /* try to find the filename using a binary search algorithm: */
  for (let i = 0; i < pAllEntries.length; i++) {
    if (CompareDirEntryFileNames(gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.pFileName, pAllEntries[i])) {
      ppDirEntry = pAllEntries[i];
    }
  }

  if (ppDirEntry)
    pDirEntry = ppDirEntry;
  else
    return false;

  // Copy the dir entry time over to the passed in time
  pLastWriteTime.dwLowDateTime = ((pDirEntry.sFileTime.dwHighDateTime * 0xFFFFFFFFFF + pDirEntry.sFileTime.dwLowDateTime) - 116444736000000000) / 10000000;

  return true;
}

//************************************************************************
//
//	CompareFileNames() gets called by the binary search function.
//
//************************************************************************

function CompareDirEntryFileNames(arg1: string /* Pointer<CHAR8>[] */, arg2: DIRENTRY): boolean {
  let sSearchKey: string /* CHAR8[FILENAME_SIZE] */;
  let sFileNameWithPath: string /* CHAR8[FILENAME_SIZE] */;
  let TempDirEntry: DIRENTRY;

  TempDirEntry = arg2;

  sSearchKey = arg1;

  sFileNameWithPath = TempDirEntry.sFileName;

  /* Compare all of both strings: */
  return sSearchKey.toLowerCase() == sFileNameWithPath.toLowerCase();
}

}
