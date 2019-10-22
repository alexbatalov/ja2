// NUMBER_OF_LIBRARIES

// used when doing the binary search of the libraries
let gsCurrentLibrary: INT16 = -1;

// The location of the cdrom drive
let gzCdDirectory: CHAR8[] /* [SGPFILENAME_LEN] */;

//************************************************************************
//
//	 InitializeFileDatabase():  Call this function to initialize the file
//	database.  It will use the gGameLibaries[] array for the list of libraries
//	and the define NUMBER_OF_LIBRARIES for the number of libraries.  The gGameLibaries
//	array is an array of structure, one of the fields determines if the library
//	will be initialized and game start.
//
//************************************************************************
function InitializeFileDatabase(): BOOLEAN {
  let i: INT16;
  let uiSize: UINT32;
  let fLibraryInited: BOOLEAN = FALSE;

  GetCDLocation();

  // if all the libraries exist, set them up
  gFileDataBase.usNumberOfLibraries = NUMBER_OF_LIBRARIES;

  // allocate memory for the each of the library headers
  uiSize = NUMBER_OF_LIBRARIES * sizeof(LibraryHeaderStruct);
  if (uiSize) {
    gFileDataBase.pLibraries = MemAlloc(uiSize);
    CHECKF(gFileDataBase.pLibraries);

    // set all the memrory to 0
    memset(gFileDataBase.pLibraries, 0, uiSize);

    // Load up each library
    for (i = 0; i < NUMBER_OF_LIBRARIES; i++) {
      // if you want to init the library at the begining of the game
      if (gGameLibaries[i].fInitOnStart) {
        // if the library exists
        if (OpenLibrary(i))
          fLibraryInited = TRUE;

        // else the library doesnt exist
        else {
          FastDebugMsg(String("Warning in InitializeFileDatabase( ): Library Id #%d (%s) is to be loaded but cannot be found.\n", i, gGameLibaries[i].sLibraryName));
          gFileDataBase.pLibraries[i].fLibraryOpen = FALSE;
        }
      }
    }
    // signify that the database has been initialized ( only if there was a library loaded )
    gFileDataBase.fInitialized = fLibraryInited;
  }

  // allocate memory for the handles of the 'real files' that will be open
  // This is needed because the the code wouldnt be able to tell the difference between a 'real' handle and a made up one
  uiSize = INITIAL_NUM_HANDLES * sizeof(RealFileOpenStruct);
  gFileDataBase.RealFiles.pRealFilesOpen = MemAlloc(uiSize);
  CHECKF(gFileDataBase.RealFiles.pRealFilesOpen);

  // clear the memory
  memset(gFileDataBase.RealFiles.pRealFilesOpen, 0, uiSize);

  // set the initial number how many files can be opened at the one time
  gFileDataBase.RealFiles.iSizeOfOpenFileArray = INITIAL_NUM_HANDLES;

  return TRUE;
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
function ReopenCDLibraries(): BOOLEAN {
  let i: INT16;

  // Load up each library
  for (i = 0; i < NUMBER_OF_LIBRARIES; i++) {
    if (gFileDataBase.pLibraries[i].fLibraryOpen && gGameLibaries[i].fOnCDrom)
      CloseLibrary(i);

    if (gGameLibaries[i].fOnCDrom)
      OpenLibrary(i);
  }

  return TRUE;
}

//************************************************************************
//
//	 ShutDownFileDatabase():  Call this function to close down the file
//	database.
//
//************************************************************************

function ShutDownFileDatabase(): BOOLEAN {
  let sLoop1: UINT16;

  // Free up the memory used for each library
  for (sLoop1 = 0; sLoop1 < gFileDataBase.usNumberOfLibraries; sLoop1++)
    CloseLibrary(sLoop1);

  // Free up the memory used for all the library headers
  if (gFileDataBase.pLibraries) {
    MemFree(gFileDataBase.pLibraries);
    gFileDataBase.pLibraries = NULL;
  }

  // loop through all the 'opened files' ( there should be no files open )
  for (sLoop1 = 0; sLoop1 < gFileDataBase.RealFiles.iNumFilesOpen; sLoop1++) {
    FastDebugMsg(String("ShutDownFileDatabase( ):  ERROR:  real file id still exists, wasnt closed"));
    CloseHandle(gFileDataBase.RealFiles.pRealFilesOpen[sLoop1].hRealFileHandle);
  }

  // Free up the memory used for the real files array for the opened files
  if (gFileDataBase.RealFiles.pRealFilesOpen) {
    MemFree(gFileDataBase.RealFiles.pRealFilesOpen);
    gFileDataBase.RealFiles.pRealFilesOpen = NULL;
  }

  return TRUE;
}

function CheckForLibraryExistence(pLibraryName: STR): BOOLEAN {
  let fRetVal: BOOLEAN = FALSE;
  let hFile: HANDLE;

  // try to opent the file, if we canm the library exists
  hFile = CreateFile(pLibraryName, GENERIC_READ, 0, NULL, OPEN_EXISTING, FILE_FLAG_RANDOM_ACCESS, NULL);

  // if the file was not opened
  if (hFile == INVALID_HANDLE_VALUE) {
    // the file wasnt opened
    fRetVal = FALSE;
  } else {
    CloseHandle(hFile);
    fRetVal = TRUE;
  }

  return fRetVal;
}

function InitializeLibrary(pLibraryName: STR, pLibHeader: Pointer<LibraryHeaderStruct>, fCanBeOnCDrom: BOOLEAN): BOOLEAN {
  let hFile: HANDLE;
  let usNumEntries: UINT16 = 0;
  let uiNumBytesRead: UINT32;
  let uiLoop: UINT32;
  let DirEntry: DIRENTRY;
  let LibFileHeader: LIBHEADER;
  let uiCount: UINT32 = 0;
  let zTempPath: CHAR8[] /* [SGPFILENAME_LEN] */;

  // open the library for reading ( if it exists )
  hFile = CreateFile(pLibraryName, GENERIC_READ, 0, NULL, OPEN_EXISTING, FILE_FLAG_RANDOM_ACCESS, NULL);
  if (hFile == INVALID_HANDLE_VALUE) {
    // if it failed finding the file on the hard drive, and the file can be on the cdrom
    if (fCanBeOnCDrom) {
      // Add the path of the cdrom to the path of the library file
      sprintf(zTempPath, "%s%s", gzCdDirectory, pLibraryName);

      // look on the cdrom
      hFile = CreateFile(zTempPath, GENERIC_READ, 0, NULL, OPEN_EXISTING, FILE_FLAG_RANDOM_ACCESS, NULL);
      if (hFile == INVALID_HANDLE_VALUE) {
        let uiLastError: UINT32 = GetLastError();
        let zString: char[] /* [1024] */;
        FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, 0, uiLastError, 0, zString, 1024, NULL);

        return FALSE;
      } else
        FastDebugMsg(String("CD Library %s opened.", zTempPath));
    } else {
      // error opening the library
      return FALSE;
    }
  }

  // Read in the library header ( at the begining of the library )
  if (!ReadFile(hFile, &LibFileHeader, sizeof(LIBHEADER), &uiNumBytesRead, NULL))
    return FALSE;

  if (uiNumBytesRead != sizeof(LIBHEADER)) {
    // Error Reading the file database header.
    return FALSE;
  }

  // place the file pointer at the begining of the file headers ( they are at the end of the file )
  SetFilePointer(hFile, -(LibFileHeader.iEntries * sizeof(DIRENTRY)), NULL, FILE_END);

  // loop through the library and determine the number of files that are FILE_OK
  // ie.  so we dont load the old or deleted files
  usNumEntries = 0;
  for (uiLoop = 0; uiLoop < LibFileHeader.iEntries; uiLoop++) {
    // read in the file header
    if (!ReadFile(hFile, &DirEntry, sizeof(DIRENTRY), &uiNumBytesRead, NULL))
      return FALSE;

    if (DirEntry.ubState == FILE_OK)
      usNumEntries++;
  }

  // Allocate enough memory for the library header
  pLibHeader.value.pFileHeader = MemAlloc(sizeof(FileHeaderStruct) * usNumEntries);

  // place the file pointer at the begining of the file headers ( they are at the end of the file )
  SetFilePointer(hFile, -(LibFileHeader.iEntries * sizeof(DIRENTRY)), NULL, FILE_END);

  // loop through all the entries
  uiCount = 0;
  for (uiLoop = 0; uiLoop < LibFileHeader.iEntries; uiLoop++) {
    // read in the file header
    if (!ReadFile(hFile, &DirEntry, sizeof(DIRENTRY), &uiNumBytesRead, NULL))
      return FALSE;

    if (DirEntry.ubState == FILE_OK) {
      // Check to see if the file is not longer then it should be
      if ((strlen(DirEntry.sFileName) + 1) >= FILENAME_SIZE)
        FastDebugMsg(String("\n*******InitializeLibrary():  Warning!:  '%s' from the library '%s' has name whose size (%d) is bigger then it should be (%s)", DirEntry.sFileName, pLibHeader.value.sLibraryPath, (strlen(DirEntry.sFileName) + 1), FILENAME_SIZE));

      // allocate memory for the files name
      pLibHeader.value.pFileHeader[uiCount].pFileName = MemAlloc(strlen(DirEntry.sFileName) + 1);

      // if we couldnt allocate memory
      if (!pLibHeader.value.pFileHeader[uiCount].pFileName) {
        // report an error
        return FALSE;
      }

      // copy the file name, offset and length into the header
      strcpy(pLibHeader.value.pFileHeader[uiCount].pFileName, DirEntry.sFileName);
      pLibHeader.value.pFileHeader[uiCount].uiFileOffset = DirEntry.uiOffset;
      pLibHeader.value.pFileHeader[uiCount].uiFileLength = DirEntry.uiLength;

      uiCount++;
    }
  }

  pLibHeader.value.usNumberOfEntries = usNumEntries;

  // allocate memory for the library path
  //	if( strlen( LibFileHeader.sPathToLibrary ) == 0 )
  {
    //		FastDebugMsg( String("The %s library file does not contain a path.  Use 'n' argument to name the library when you create it\n", LibFileHeader.sLibName ) );
    //		Assert( 0 );
  }

  // if the library has a path
  if (strlen(LibFileHeader.sPathToLibrary) != 0) {
    pLibHeader.value.sLibraryPath = MemAlloc(strlen(LibFileHeader.sPathToLibrary) + 1);
    strcpy(pLibHeader.value.sLibraryPath, LibFileHeader.sPathToLibrary);
  } else {
    // else the library name does not contain a path ( most likely either an error or it is the default path )
    pLibHeader.value.sLibraryPath = MemAlloc(1);
    pLibHeader.value.sLibraryPath[0] = '\0';
  }

  // allocate space for the open files array
  pLibHeader.value.pOpenFiles = MemAlloc(INITIAL_NUM_HANDLES * sizeof(FileOpenStruct));
  if (!pLibHeader.value.pOpenFiles) {
    // report an error
    return FALSE;
  }

  memset(pLibHeader.value.pOpenFiles, 0, INITIAL_NUM_HANDLES * sizeof(FileOpenStruct));

  pLibHeader.value.hLibraryHandle = hFile;
  pLibHeader.value.usNumberOfEntries = usNumEntries;
  pLibHeader.value.fLibraryOpen = TRUE;
  pLibHeader.value.iNumFilesOpen = 0;
  pLibHeader.value.iSizeOfOpenFileArray = INITIAL_NUM_HANDLES;

  return TRUE;
}

function LoadDataFromLibrary(sLibraryID: INT16, uiFileNum: UINT32, pData: PTR, uiBytesToRead: UINT32, pBytesRead: Pointer<UINT32>): BOOLEAN {
  let uiOffsetInLibrary: UINT32;
  let uiLength: UINT32;
  let hLibraryFile: HANDLE;
  let uiNumBytesRead: UINT32;
  let uiCurPos: UINT32;

  // get the offset into the library, the length and current position of the file pointer.
  uiOffsetInLibrary = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.value.uiFileOffset;
  uiLength = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.value.uiFileLength;
  hLibraryFile = gFileDataBase.pLibraries[sLibraryID].hLibraryHandle;
  uiCurPos = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;

  // set the file pointer to the right location
  SetFilePointer(hLibraryFile, (uiOffsetInLibrary + uiCurPos), NULL, FILE_BEGIN);

  // if we are trying to read more data then the size of the file, return an error
  if (uiBytesToRead + uiCurPos > uiLength) {
    *pBytesRead = 0;
    return FALSE;
  }

  // get the data
  if (!ReadFile(hLibraryFile, pData, uiBytesToRead, &uiNumBytesRead, NULL))
    return FALSE;

  if (uiBytesToRead != uiNumBytesRead) {
    //		Gets the reason why the function failed
    //		UINT32 uiLastError = GetLastError();
    //		char zString[1024];
    //		FormatMessage( FORMAT_MESSAGE_FROM_SYSTEM, 0, uiLastError, 0, zString, 1024, NULL);

    return FALSE;
  }

  gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile += uiNumBytesRead;

  //	CloseHandle( hLibraryFile );

  *pBytesRead = uiNumBytesRead;

  return TRUE;
}

//************************************************************************
//
// CheckIfFileExistInLibrary() determines if a file exists in a library.
//
//************************************************************************

function CheckIfFileExistInLibrary(pFileName: STR): BOOLEAN {
  let sLibraryID: INT16;
  let pFileHeader: Pointer<FileHeaderStruct>;

  // get thelibrary that file is in
  sLibraryID = GetLibraryIDFromFileName(pFileName);
  if (sLibraryID == -1) {
    // not in any library
    return FALSE;
  }

  if (GetFileHeaderFromLibrary(sLibraryID, pFileName, &pFileHeader))
    return TRUE;
  else
    return FALSE;
}

//************************************************************************
//
//	This function finds out if the file CAN be in a library.  It determines
//	if the library that the file MAY be in is open.
//	( eg. File is  Laptop\Test.sti, if the Laptop\ library is open, it returns true
//
//************************************************************************
function GetLibraryIDFromFileName(pFileName: STR): INT16 {
  let sLoop1: INT16;
  let sBestMatch: INT16 = -1;

  // loop through all the libraries to check which library the file is in
  for (sLoop1 = 0; sLoop1 < gFileDataBase.usNumberOfLibraries; sLoop1++) {
    // if the library is not loaded, dont try to access the array
    if (IsLibraryOpened(sLoop1)) {
      // if the library path name is of size zero, ( the library is for the default path )
      if (strlen(gFileDataBase.pLibraries[sLoop1].sLibraryPath) == 0) {
        // determine if there is a directory in the file name
        if (strchr(pFileName, '\\') == NULL && strchr(pFileName, '//') == NULL) {
          // There is no directory in the file name
          return sLoop1;
        }
      }

      // compare the library name to the file name that is passed in
      else {
        // if the directory paths are the same, to the length of the lib's path
        if (_strnicmp(gFileDataBase.pLibraries[sLoop1].sLibraryPath, pFileName, strlen(gFileDataBase.pLibraries[sLoop1].sLibraryPath)) == 0) {
          // if we've never matched, or this match's path is longer than the previous match (meaning it's more exact)
          if ((sBestMatch == (-1)) || (strlen(gFileDataBase.pLibraries[sLoop1].sLibraryPath) > strlen(gFileDataBase.pLibraries[sBestMatch].sLibraryPath)))
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

function GetFileHeaderFromLibrary(sLibraryID: INT16, pstrFileName: STR, pFileHeader: Pointer<Pointer<FileHeaderStruct>>): BOOLEAN {
  let ppFileHeader: Pointer<Pointer<FileHeaderStruct>>;
  let sFileNameWithPath: CHAR8[] /* [FILENAME_SIZE] */;

  // combine the library path to the file name (need it for the search of the library )
  strcpy(sFileNameWithPath, pstrFileName);

  gsCurrentLibrary = sLibraryID;

  /* try to find the filename using a binary search algorithm: */
  ppFileHeader = bsearch(&sFileNameWithPath, gFileDataBase.pLibraries[sLibraryID].pFileHeader, gFileDataBase.pLibraries[sLibraryID].usNumberOfEntries, sizeof(FileHeaderStruct), CompareFileNames);

  if (ppFileHeader) {
    *pFileHeader = ppFileHeader;
    return TRUE;
  } else {
    pFileHeader = NULL;
    return FALSE;
  }
}

//************************************************************************
//
//	CompareFileNames() gets called by the binary search function.
//
//************************************************************************

function CompareFileNames(arg1: Pointer<CHAR8>[] /* [] */, arg2: Pointer<Pointer<FileHeaderStruct>>): INT {
  let sSearchKey: CHAR8[] /* [FILENAME_SIZE] */;
  let sFileNameWithPath: CHAR8[] /* [FILENAME_SIZE] */;
  let TempFileHeader: Pointer<FileHeaderStruct>;

  TempFileHeader = arg2;

  sprintf(sSearchKey, "%s", arg1);

  sprintf(sFileNameWithPath, "%s%s", gFileDataBase.pLibraries[gsCurrentLibrary].sLibraryPath, TempFileHeader.value.pFileName);

  /* Compare all of both strings: */
  return _stricmp(sSearchKey, sFileNameWithPath);
}

function AddSlashToPath(pName: STR): void {
  let uiLoop: UINT32;
  let uiCounter: UINT32;
  let fDone: BOOLEAN = FALSE;
  let fFound: BOOLEAN = FALSE;
  let sNewName: CHAR8[] /* [FILENAME_SIZE] */;

  // find out if there is a '\' in the file name

  uiCounter = 0;
  for (uiLoop = 0; uiLoop < strlen(pName) && !fDone; uiLoop++) {
    if (pName[uiLoop] == '\\') {
      sNewName[uiCounter] = pName[uiLoop];
      uiCounter++;
      sNewName[uiCounter] = '\\';
    } else
      sNewName[uiCounter] = pName[uiLoop];

    uiCounter++;
  }
  sNewName[uiCounter] = '\0';

  strcpy(pName, sNewName);
}

//************************************************************************
//
// This function will see if a file is in a library.  If it is, the file will be opened and a file
// handle will be created for it.
//
//************************************************************************

function OpenFileFromLibrary(pName: STR): HWFILE {
  let pFileHeader: Pointer<FileHeaderStruct>;
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
    if (GetFileHeaderFromLibrary(sLibraryID, pName, &pFileHeader)) {
      // increment the number of open files
      gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen++;

      // if there isnt enough space to put the file, realloc more space
      if (gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen >= gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray) {
        let pOpenFiles: Pointer<FileOpenStruct>;

        // reallocate more space for the array
        pOpenFiles = MemRealloc(gFileDataBase.pLibraries[sLibraryID].pOpenFiles, gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray + NUM_FILES_TO_ADD_AT_A_TIME);

        if (!pOpenFiles)
          return 0;

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
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiActualPositionInLibrary = SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, 0, NULL, FILE_CURRENT);

      // Set the file position in the library to the begining of the 'file' in the library
      uiNewFilePosition = SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.value.uiFileOffset, NULL, FILE_BEGIN);

      uiNewFilePosition = GetFileSize(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, NULL);
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

function CreateRealFileHandle(hFile: HANDLE): HWFILE {
  let hLibFile: HWFILE;
  let iLoop1: INT32;
  let uiFileNum: UINT32 = 0;
  let uiSize: UINT32;

  // if there isnt enough space to put the file, realloc more space
  if (gFileDataBase.RealFiles.iNumFilesOpen >= (gFileDataBase.RealFiles.iSizeOfOpenFileArray - 1)) {
    uiSize = (gFileDataBase.RealFiles.iSizeOfOpenFileArray + NUM_FILES_TO_ADD_AT_A_TIME) * sizeof(RealFileOpenStruct);

    gFileDataBase.RealFiles.pRealFilesOpen = MemRealloc(gFileDataBase.RealFiles.pRealFilesOpen, uiSize);
    CHECKF(gFileDataBase.RealFiles.pRealFilesOpen);

    // Clear out the new part of the array
    memset(&gFileDataBase.RealFiles.pRealFilesOpen[gFileDataBase.RealFiles.iSizeOfOpenFileArray], 0, (NUM_FILES_TO_ADD_AT_A_TIME * sizeof(RealFileOpenStruct)));

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

function GetLibraryAndFileIDFromLibraryFileHandle(hlibFile: HWFILE, pLibraryID: Pointer<INT16>, pFileNum: Pointer<UINT32>): BOOLEAN {
  *pFileNum = DB_EXTRACT_FILE_ID(hlibFile);
  *pLibraryID = DB_EXTRACT_LIBRARY(hlibFile);

  // TEST: qq
  /*	if( *pLibraryID == LIBRARY_SOUNDS )
          {
                  int q=5;
          }
  */
  return TRUE;
}

//************************************************************************
//
//	Close an individual file that is contained in the library
//
//************************************************************************

function CloseLibraryFile(sLibraryID: INT16, uiFileID: UINT32): BOOLEAN {
  if (IsLibraryOpened(sLibraryID)) {
    // if the uiFileID is invalid
    if ((uiFileID >= gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray))
      return FALSE;

    // if the file is not opened, dont close it
    if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiFileID != 0) {
      // reset the variables
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiFileID = 0;
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiFilePosInFile = 0;
      gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].pFileHeader = NULL;

      // reset the libraries file pointer to the positon it was in prior to opening the current file
      SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileID].uiActualPositionInLibrary, NULL, FILE_CURRENT);

      // decrement the number of files that are open
      gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen--;

      // Reset the fact that a file is accessing the library
      //			gFileDataBase.pLibraries[ sLibraryID ].fAnotherFileAlreadyOpenedLibrary = FALSE;
      gFileDataBase.pLibraries[sLibraryID].uiIdOfOtherFileAlreadyOpenedLibrary = 0;
    }
  }

  return TRUE;
}

function LibraryFileSeek(sLibraryID: INT16, uiFileNum: UINT32, uiDistance: UINT32, uiHowToSeek: UINT8): BOOLEAN {
  let uiCurPos: UINT32;
  let uiSize: UINT32;

  // if the library is not open, return an error
  if (!IsLibraryOpened(sLibraryID))
    return FALSE;

  uiCurPos = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;
  uiSize = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.value.uiFileLength;

  if (uiHowToSeek == FILE_SEEK_FROM_START)
    uiCurPos = uiDistance;
  else if (uiHowToSeek == FILE_SEEK_FROM_END)
    uiCurPos = uiSize - uiDistance;
  else if (uiHowToSeek == FILE_SEEK_FROM_CURRENT)
    uiCurPos += uiDistance;
  else
    return FALSE;

  gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile = uiCurPos;
  return TRUE;
}

//************************************************************************
//
//	OpenLibrary() Opens a library from the 'array' of library names
//	that was passd in at game initialization.  Pass in an enum for the
//	library.
//
//************************************************************************

function OpenLibrary(sLibraryID: INT16): BOOLEAN {
  // if the library is already opened, report an error
  if (gFileDataBase.pLibraries[sLibraryID].fLibraryOpen)
    return FALSE;

  // if we are trying to do something with an invalid library id
  if (sLibraryID >= gFileDataBase.usNumberOfLibraries)
    return FALSE;

  // if we cant open the library
  if (!InitializeLibrary(gGameLibaries[sLibraryID].sLibraryName, &gFileDataBase.pLibraries[sLibraryID], gGameLibaries[sLibraryID].fOnCDrom))
    return FALSE;

  return TRUE;
}

function CloseLibrary(sLibraryID: INT16): BOOLEAN {
  let uiLoop1: UINT32;

  // if the library isnt loaded, dont close it
  if (!IsLibraryOpened(sLibraryID))
    return FALSE;

  // if there are any open files, loop through the library and close down whatever file is still open
  if (gFileDataBase.pLibraries[sLibraryID].iNumFilesOpen) {
    // loop though the array of open files to see if any are still open
    for (uiLoop1 = 0; uiLoop1 < gFileDataBase.pLibraries[sLibraryID].usNumberOfEntries; uiLoop1++) {
      if (CheckIfFileIsAlreadyOpen(gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName, sLibraryID)) {
        FastDebugMsg(String("CloseLibrary():  ERROR:  %s library file id still exists, wasnt closed, closing now.", gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName));
        CloseLibraryFile(sLibraryID, uiLoop1);

        //	Removed because the memory gets freed in the next for loop.  Would only enter here if files were still open
        //	gFileDataBase.pLibraries[ sLibraryID ].pFileHeader[ uiLoop1 ].pFileName = NULL;
      }
    }
  }

  // Free up the memory used for each file name
  for (uiLoop1 = 0; uiLoop1 < gFileDataBase.pLibraries[sLibraryID].usNumberOfEntries; uiLoop1++) {
    MemFree(gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName);
    gFileDataBase.pLibraries[sLibraryID].pFileHeader[uiLoop1].pFileName = NULL;
  }

  // Free up the memory needed for the Library File Headers
  if (gFileDataBase.pLibraries[sLibraryID].pFileHeader) {
    MemFree(gFileDataBase.pLibraries[sLibraryID].pFileHeader);
    gFileDataBase.pLibraries[sLibraryID].pFileHeader = NULL;
  }

  // Free up the memory used for the library name
  if (gFileDataBase.pLibraries[sLibraryID].sLibraryPath) {
    MemFree(gFileDataBase.pLibraries[sLibraryID].sLibraryPath);
    gFileDataBase.pLibraries[sLibraryID].sLibraryPath = NULL;
  }

  // Free up the space requiered for the open files array
  if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles) {
    MemFree(gFileDataBase.pLibraries[sLibraryID].pOpenFiles);
    gFileDataBase.pLibraries[sLibraryID].pOpenFiles = NULL;
  }

  // set that the library isnt open
  gFileDataBase.pLibraries[sLibraryID].fLibraryOpen = FALSE;

  // close the file ( note libraries are to be closed by the Windows close function )
  CloseHandle(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle);

  return TRUE;
}

function IsLibraryOpened(sLibraryID: INT16): BOOLEAN {
  // if the database is not initialized
  if (!gFileDataBase.fInitialized)
    return FALSE;

  // if we are trying to do something with an invalid library id
  if (sLibraryID >= gFileDataBase.usNumberOfLibraries)
    return FALSE;

  // if the library is opened
  if (gFileDataBase.pLibraries[sLibraryID].fLibraryOpen)
    return TRUE;
  else
    return FALSE;
}

function CheckIfFileIsAlreadyOpen(pFileName: STR, sLibraryID: INT16): BOOLEAN {
  let usLoop1: UINT16 = 0;

  let sName: CHAR8[] /* [60] */;
  let sPath: CHAR8[] /* [90] */;
  let sDrive: CHAR8[] /* [60] */;
  let sExt: CHAR8[] /* [6] */;

  let sTempName: CHAR8[] /* [70] */;

  _splitpath(pFileName, sDrive, sPath, sName, sExt);

  strcpy(sTempName, sName);
  strcat(sTempName, sExt);

  // loop through all the open files to see if 'new' file to open is already open
  for (usLoop1 = 1; usLoop1 < gFileDataBase.pLibraries[sLibraryID].iSizeOfOpenFileArray; usLoop1++) {
    // check if the file is open
    if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[usLoop1].uiFileID != 0) {
      // Check if the file already exists
      if (_stricmp(sTempName, gFileDataBase.pLibraries[sLibraryID].pOpenFiles[usLoop1].pFileHeader.value.pFileName) == 0)
        return TRUE;
    }
  }
  return FALSE;
}

function GetLibraryFileTime(sLibraryID: INT16, uiFileNum: UINT32, pLastWriteTime: Pointer<SGP_FILETIME>): BOOLEAN {
  let usNumEntries: UINT16 = 0;
  let uiNumBytesRead: UINT32;
  let pDirEntry: Pointer<DIRENTRY>;
  let LibFileHeader: LIBHEADER;
  let fDone: BOOLEAN = FALSE;
  //	UINT32	cnt;
  let iFilePos: INT32 = 0;

  let ppDirEntry: Pointer<Pointer<DIRENTRY>>;

  let pAllEntries: Pointer<DIRENTRY>;

  memset(pLastWriteTime, 0, sizeof(SGP_FILETIME));

  SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, 0, NULL, FILE_BEGIN);

  // Read in the library header ( at the begining of the library )
  if (!ReadFile(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, &LibFileHeader, sizeof(LIBHEADER), &uiNumBytesRead, NULL))
    return FALSE;
  if (uiNumBytesRead != sizeof(LIBHEADER)) {
    // Error Reading the file database header.
    return FALSE;
  }

  // If the file number is greater then the number in the lirary, return false
  if (uiFileNum >= LibFileHeader.iEntries)
    return FALSE;

  pAllEntries = MemAlloc(sizeof(DIRENTRY) * LibFileHeader.iEntries);
  if (pAllEntries == NULL)
    return FALSE;
  memset(pAllEntries, 0, sizeof(DIRENTRY));

  iFilePos = -(LibFileHeader.iEntries * sizeof(DIRENTRY));

  // set the file pointer to the right location
  SetFilePointer(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, iFilePos, NULL, FILE_END);

  // Read in the library header ( at the begining of the library )
  if (!ReadFile(gFileDataBase.pLibraries[sLibraryID].hLibraryHandle, pAllEntries, (sizeof(DIRENTRY) * LibFileHeader.iEntries), &uiNumBytesRead, NULL))
    return FALSE;
  if (uiNumBytesRead != (sizeof(DIRENTRY) * LibFileHeader.iEntries)) {
    // Error Reading the file database header.
    return FALSE;
  }

  /* try to find the filename using a binary search algorithm: */
  ppDirEntry = bsearch(gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.value.pFileName, pAllEntries, LibFileHeader.iEntries, sizeof(DIRENTRY), CompareDirEntryFileNames);

  if (ppDirEntry)
    pDirEntry = ppDirEntry;
  else
    return FALSE;

  // Copy the dir entry time over to the passed in time
  memcpy(pLastWriteTime, &pDirEntry.value.sFileTime, sizeof(SGP_FILETIME));

  MemFree(pAllEntries);
  pAllEntries = NULL;

  return TRUE;
}

//************************************************************************
//
//	CompareFileNames() gets called by the binary search function.
//
//************************************************************************

function CompareDirEntryFileNames(arg1: Pointer<CHAR8>[] /* [] */, arg2: Pointer<Pointer<DIRENTRY>>): INT32 {
  let sSearchKey: CHAR8[] /* [FILENAME_SIZE] */;
  let sFileNameWithPath: CHAR8[] /* [FILENAME_SIZE] */;
  let TempDirEntry: Pointer<DIRENTRY>;

  TempDirEntry = arg2;

  sprintf(sSearchKey, "%s", arg1);

  sprintf(sFileNameWithPath, "%s", TempDirEntry.value.sFileName);

  /* Compare all of both strings: */
  return _stricmp(sSearchKey, sFileNameWithPath);
}
