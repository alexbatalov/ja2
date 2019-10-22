//**************************************************************************
//
// Filename :	FileMan.c
//
//	Purpose :	function definitions for the memory manager
//
// Modification history :
//
//		24sep96:HJH		-> creation
//    08Apr97:ARM   -> Assign return value from Push() calls back to HStack
//                     handle, because it may possibly do a MemRealloc()
//		29Dec97:Kris Morness
//									-> Added functionality for setting file attributes which
//									   allows for read-only attribute overriding
//									-> Also added a simple function that clears all file attributes
//										 to normal.
//
//		5 Feb 98:Dave French -> extensive modification to support libraries
//
//**************************************************************************

//**************************************************************************
//
//				Defines
//
//**************************************************************************

const FILENAME_LENGTH = 600;

const CHECKF = (exp) => {
  if (!(exp)) {
    return (FALSE);
  }
};
const CHECKV = (exp) => {
  if (!(exp)) {
    return;
  }
};
const CHECKN = (exp) => {
  if (!(exp)) {
    return (NULL);
  }
};
const CHECKBI = (exp) => {
  if (!(exp)) {
    return (-1);
  }
};

const PRINT_DEBUG_INFO = () => FileDebugPrint();

//**************************************************************************
//
//				Typedefs
//
//**************************************************************************

interface FMFileInfo {
  strFilename: CHAR[] /* [FILENAME_LENGTH] */;
  uiFileAccess: UINT8;
  uiFilePosition: UINT32;
  hFileHandle: HANDLE;
  hDBFile: HDBFILE;
} // for 'File Manager File Information'

interface FileSystem {
  pFileInfo: Pointer<FMFileInfo>;
  uiNumHandles: UINT32;
  fDebug: BOOLEAN;
  fDBInitialized: BOOLEAN;

  pcFileNames: Pointer<CHAR>;
  uiNumFilesInDirectory: UINT32;
}

//**************************************************************************
//
//				Variables
//
//**************************************************************************

// The FileDatabaseHeader
let gFileDataBase: DatabaseManagerHeaderStruct;

// FileSystem gfs;

let Win32FindInfo: WIN32_FIND_DATA[] /* [20] */;
let fFindInfoInUse: BOOLEAN[] /* [20] */ = [
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
  FALSE,
];
let hFindInfoHandle: HANDLE[] /* [20] */ = [
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
  INVALID_HANDLE_VALUE,
];

//**************************************************************************
//
//				Function Prototypes
//
//**************************************************************************

//**************************************************************************
//
//				Functions
//
//**************************************************************************

//**************************************************************************
//
// FileSystemInit
//
//		Starts up the file system.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************

function InitializeFileManager(strIndexFilename: STR): BOOLEAN {
  RegisterDebugTopic(TOPIC_FILE_MANAGER, "File Manager");
  return TRUE;
}

//**************************************************************************
//
// FileSystemShutdown
//
//		Shuts down the file system.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function ShutdownFileManager(): void {
  UnRegisterDebugTopic(TOPIC_FILE_MANAGER, "File Manager");
}

//**************************************************************************
//
// FileDebug
//
//		To set whether or not we should print debug info.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************

function FileDebug(f: BOOLEAN): void {
  //	gfs.fDebug = f;
}

//**************************************************************************
//
// FileExists
//
//		Checks if a file exists.
//
// Parameter List :
//
//		STR	-> name of file to check existence of
//
// Return Value :
//
//		BOOLEAN	-> TRUE if it exists
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileExists(strFilename: STR): BOOLEAN {
  let fExists: BOOLEAN = FALSE;
  let file: Pointer<FILE>;
  // HANDLE	hRealFile;

  // open up the file to see if it exists on the disk
  file = fopen(strFilename, "r");
  // hRealFile = CreateFile( strFilename, GENERIC_READ, 0, NULL, OPEN_EXISTING,
  //								FILE_FLAG_RANDOM_ACCESS, NULL );
  if (file)
  // if ( hRealFile != INVALID_HANDLE_VALUE )
  {
    fExists = TRUE;
    fclose(file);
    // CloseHandle( hRealFile );
  }

  // if the file wasnt on disk, check to see if its in a library
  if (fExists == FALSE) {
    // if the database is initialized
    if (gFileDataBase.fInitialized)
      fExists = CheckIfFileExistInLibrary(strFilename);
  }

  return fExists;
}

//**************************************************************************
//
// FileExistsNoDB
//
//		Checks if a file exists, but doesn't check the database files.
//
// Parameter List :
//
//		STR	-> name of file to check existence of
//
// Return Value :
//
//		BOOLEAN	-> TRUE if it exists
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************

function FileExistsNoDB(strFilename: STR): BOOLEAN {
  let fExists: BOOLEAN = FALSE;
  let file: Pointer<FILE>;
  // HANDLE	hRealFile;

  // open up the file to see if it exists on the disk
  file = fopen(strFilename, "r");
  // hRealFile = CreateFile( strFilename, GENERIC_READ, 0, NULL, OPEN_EXISTING,
  //								FILE_FLAG_RANDOM_ACCESS, NULL );
  if (file)
  // if ( hRealFile != INVALID_HANDLE_VALUE )
  {
    fExists = TRUE;
    fclose(file);
    // CloseHandle( hRealFile );
  }

  return fExists;
}

//**************************************************************************
//
// FileDelete
//
//		Deletes a file.
//
// Parameter List :
//
//		STR	-> name of file to delete
//
// Return Value :
//
//		BOOLEAN	-> TRUE if successful
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************

function FileDelete(strFilename: STR): BOOLEAN {
  return DeleteFile(strFilename);
}

//**************************************************************************
//
// FileOpen
//
//		Opens a file.
//
// Parameter List :
//
//		STR	   -> filename
//		UIN32		-> access - read or write, or both
//		BOOLEAN	-> delete on close
//
// Return Value :
//
//		HWFILE	-> handle of opened file
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileOpen(strFilename: STR, uiOptions: UINT32, fDeleteOnClose: BOOLEAN): HWFILE {
  let hFile: HWFILE;
  let hRealFile: HANDLE;
  let dwAccess: DWORD;
  let dwFlagsAndAttributes: DWORD;
  let hDBFile: HDBFILE;
  let fExists: BOOLEAN;
  let dwCreationFlags: DWORD;
  let hLibFile: HWFILE;

  hFile = 0;
  hDBFile = 0;
  dwCreationFlags = 0;

  // check if the file exists - note that we use the function FileExistsNoDB
  // because it doesn't check the databases, and we don't want to do that here
  fExists = FileExistsNoDB(strFilename);

  dwAccess = 0;
  if (uiOptions & FILE_ACCESS_READ)
    dwAccess |= GENERIC_READ;
  if (uiOptions & FILE_ACCESS_WRITE)
    dwAccess |= GENERIC_WRITE;

  dwFlagsAndAttributes = FILE_FLAG_RANDOM_ACCESS;
  if (fDeleteOnClose)
    dwFlagsAndAttributes |= FILE_FLAG_DELETE_ON_CLOSE;

  // if the file is on the disk
  if (fExists) {
    hRealFile = CreateFile(strFilename, dwAccess, 0, NULL, OPEN_ALWAYS, dwFlagsAndAttributes, NULL);

    if (hRealFile == INVALID_HANDLE_VALUE) {
      return 0;
    }

    // create a file handle for the 'real file'
    hFile = CreateRealFileHandle(hRealFile);
  }

  // if the file did not exist, try to open it from the database
  else if (gFileDataBase.fInitialized) {
    // if the file is to be opened for writing, return an error cause you cant write a file that is in the database library
    if (fDeleteOnClose) {
      return 0;
    }

    // if the file doesnt exist on the harddrive, but it is to be created, dont try to load it from the file database
    if (uiOptions & FILE_ACCESS_WRITE) {
      // if the files is to be written to
      if ((uiOptions & FILE_CREATE_NEW) || (uiOptions & FILE_OPEN_ALWAYS) || (uiOptions & FILE_CREATE_ALWAYS) || (uiOptions & FILE_TRUNCATE_EXISTING)) {
        hFile = 0;
      }
    }
    // else if the file is to be opened using FILE_OPEN_EXISTING, and the file doesnt exists, fail out of the function)
    //		else if( uiOptions & FILE_OPEN_EXISTING )
    //		{
    // fail out of the function
    //			return( 0 );
    //		}
    else {
      // If the file is in the library, get a handle to it.
      hLibFile = OpenFileFromLibrary(strFilename);

      // tried to open a file that wasnt in the database
      if (!hLibFile)
        return 0;
      else
        return (hLibFile); // return the file handle
    }
  }

  if (!hFile) {
    if (uiOptions & FILE_CREATE_NEW) {
      dwCreationFlags = CREATE_NEW;
    } else if (uiOptions & FILE_CREATE_ALWAYS) {
      dwCreationFlags = CREATE_ALWAYS;
    } else if (uiOptions & FILE_OPEN_EXISTING || uiOptions & FILE_ACCESS_READ) {
      dwCreationFlags = OPEN_EXISTING;
    } else if (uiOptions & FILE_OPEN_ALWAYS) {
      dwCreationFlags = OPEN_ALWAYS;
    } else if (uiOptions & FILE_TRUNCATE_EXISTING) {
      dwCreationFlags = TRUNCATE_EXISTING;
    } else {
      dwCreationFlags = OPEN_ALWAYS;
    }

    hRealFile = CreateFile(strFilename, dwAccess, 0, NULL, dwCreationFlags, dwFlagsAndAttributes, NULL);
    if (hRealFile == INVALID_HANDLE_VALUE) {
      let uiLastError: UINT32 = GetLastError();
      let zString: char[] /* [1024] */;
      FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, 0, uiLastError, 0, zString, 1024, NULL);

      return 0;
    }

    hFile = CreateRealFileHandle(hRealFile);
  }

  if (!hFile)
    return 0;

  return hFile;
}

//**************************************************************************
//
// FileClose
//
//
// Parameter List :
//
//		HWFILE hFile	-> handle to file to close
//
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileClose(hFile: HWFILE): void {
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its the 'real file' library
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // if its not already closed
    if (gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].uiFileID != 0) {
      CloseHandle(gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle);
      gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].uiFileID = 0;
      gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle = 0;
      gFileDataBase.RealFiles.iNumFilesOpen--;
      if (gFileDataBase.RealFiles.iNumFilesOpen < 0) {
        // if for some reason we are below 0, report an error ( should never be )
        Assert(0);
      }
    }
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized)
      CloseLibraryFile(sLibraryID, uiFileNum);
  }
}

//**************************************************************************
//
// FileRead
//
//		To read a file.
//
// Parameter List :
//
//		HWFILE		-> handle to file to read from
//		void	*	-> source buffer
//		UINT32	-> num bytes to read
//		UINT32	-> num bytes read
//
// Return Value :
//
//		BOOLEAN	-> TRUE if successful
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//		08Dec97:ARM		-> return FALSE if bytes to read != bytes read
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileRead(hFile: HWFILE, pDest: PTR, uiBytesToRead: UINT32, puiBytesRead: Pointer<UINT32>): BOOLEAN {
  let hRealFile: HANDLE;
  let dwNumBytesToRead: DWORD;
  let dwNumBytesRead: DWORD;
  let fRet: BOOLEAN = FALSE;
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  // init the variables
  dwNumBytesToRead = dwNumBytesRead = 0;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  dwNumBytesToRead = uiBytesToRead;

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // if the file is opened
    if (uiFileNum != 0) {
      hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

      fRet = ReadFile(hRealFile, pDest, dwNumBytesToRead, &dwNumBytesRead, NULL);
      if (dwNumBytesToRead != dwNumBytesRead) {
        let uiLastError: UINT32 = GetLastError();
        let zString: char[] /* [1024] */;
        FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, 0, uiLastError, 0, zString, 1024, NULL);

        fRet = FALSE;
      }

      if (puiBytesRead)
        *puiBytesRead = dwNumBytesRead;
    }
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized) {
      // if the library is open
      if (IsLibraryOpened(sLibraryID)) {
        // if the file is opened
        if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
          // read the data from the library
          fRet = LoadDataFromLibrary(sLibraryID, uiFileNum, pDest, dwNumBytesToRead, &dwNumBytesRead);
          if (puiBytesRead) {
            *puiBytesRead = dwNumBytesRead;
          }
        }
      }
    }
  }

  return fRet;
}

//**************************************************************************
//
// FileWrite
//
//		To write a file.
//
// Parameter List :
//
//		HWFILE		-> handle to file to write to
//		void	*	-> destination buffer
//		UINT32	-> num bytes to write
//		UINT32	-> num bytes written
//
// Return Value :
//
//		BOOLEAN	-> TRUE if successful
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//		08Dec97:ARM		-> return FALSE if dwNumBytesToWrite != dwNumBytesWritten
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileWrite(hFile: HWFILE, pDest: PTR, uiBytesToWrite: UINT32, puiBytesWritten: Pointer<UINT32>): BOOLEAN {
  let hRealFile: HANDLE;
  let dwNumBytesToWrite: DWORD;
  let dwNumBytesWritten: DWORD;
  let fRet: BOOLEAN;
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    dwNumBytesToWrite = uiBytesToWrite;

    // get the real file handle to the file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    fRet = WriteFile(hRealFile, pDest, dwNumBytesToWrite, &dwNumBytesWritten, NULL);

    if (dwNumBytesToWrite != dwNumBytesWritten)
      fRet = FALSE;

    if (puiBytesWritten)
      *puiBytesWritten = dwNumBytesWritten;
  } else {
    // we cannot write to a library file
    if (puiBytesWritten)
      *puiBytesWritten = 0;
    return FALSE;
  }

  return fRet;
}

//**************************************************************************
//
// FileLoad
//
//		To open, read, and close a file.
//
// Parameter List :
//
//
// Return Value :
//
//		BOOLEAN	-> TRUE if successful
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//		08Dec97:ARM		-> return FALSE if bytes to read != bytes read (CHECKF is inappropriate?)
//
//**************************************************************************

function FileLoad(strFilename: STR, pDest: PTR, uiBytesToRead: UINT32, puiBytesRead: Pointer<UINT32>): BOOLEAN {
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let fRet: BOOLEAN;

  hFile = FileOpen(strFilename, FILE_ACCESS_READ, FALSE);
  if (hFile) {
    fRet = FileRead(hFile, pDest, uiBytesToRead, &uiNumBytesRead);
    FileClose(hFile);

    if (uiBytesToRead != uiNumBytesRead)
      fRet = FALSE;

    if (puiBytesRead)
      *puiBytesRead = uiNumBytesRead;

    CHECKF(uiNumBytesRead == uiBytesToRead);
  } else
    fRet = FALSE;

  return fRet;
}

//**************************************************************************
//
// FilePrintf
//
//		To printf to a file.
//
// Parameter List :
//
//		HWFILE	-> handle to file to seek in
//		...		-> arguments, 1st of which should be a string
//
// Return Value :
//
//		BOOLEAN	-> TRUE if successful
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FilePrintf(hFile: HWFILE, strFormatted: Pointer<UINT8>, ...args: any[]): BOOLEAN {
  let strToSend: UINT8[] /* [80] */;
  let argptr: va_list;
  let fRetVal: BOOLEAN = FALSE;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    va_start(argptr, strFormatted);
    vsprintf(strToSend, strFormatted, argptr);
    va_end(argptr);

    fRetVal = FileWrite(hFile, strToSend, strlen(strToSend), NULL);
  } else {
    // its a library file, cant write to it so return an error
    fRetVal = FALSE;
  }

  return fRetVal;
}

//**************************************************************************
//
// FileSeek
//
//		To seek to a position in a file.
//
// Parameter List :
//
//		HWFILE	-> handle to file to seek in
//		UINT32	-> distance to seek
//		UINT8		-> how to seek
//
// Return Value :
//
//		BOOLEAN	-> TRUE if successful
//					-> FALSE if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileSeek(hFile: HWFILE, uiDistance: UINT32, uiHow: UINT8): BOOLEAN {
  let hRealFile: HANDLE;
  let lDistanceToMove: LONG;
  let dwMoveMethod: DWORD;
  let iDistance: INT32 = 0;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to the real file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    iDistance = uiDistance;

    if (uiHow == FILE_SEEK_FROM_START)
      dwMoveMethod = FILE_BEGIN;
    else if (uiHow == FILE_SEEK_FROM_END) {
      dwMoveMethod = FILE_END;
      if (iDistance > 0)
        iDistance = -(iDistance);
    } else
      dwMoveMethod = FILE_CURRENT;

    lDistanceToMove = uiDistance;

    if (SetFilePointer(hRealFile, iDistance, NULL, dwMoveMethod) == 0xFFFFFFFF)
      return FALSE;
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized)
      LibraryFileSeek(sLibraryID, uiFileNum, uiDistance, uiHow);
  }

  return TRUE;
}

//**************************************************************************
//
// FileGetPos
//
//		To get the current position in a file.
//
// Parameter List :
//
//		HWFILE	-> handle to file
//
// Return Value :
//
//		INT32		-> current offset in file if successful
//					-> -1 if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileGetPos(hFile: HWFILE): INT32 {
  let hRealFile: HANDLE;
  let uiPositionInFile: UINT32 = 0;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to the real file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    uiPositionInFile = SetFilePointer(hRealFile, 0, NULL, FILE_CURRENT);
    if (uiPositionInFile == 0xFFFFFFFF) {
      uiPositionInFile = 0;
    }
    return uiPositionInFile;
  } else {
    // if the library is open
    if (IsLibraryOpened(sLibraryID)) {
      // check if the file is open
      if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
        uiPositionInFile = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;
        return uiPositionInFile;
      }
    }
  }

  return BAD_INDEX;
}

//**************************************************************************
//
// FileGetSize
//
//		To get the current file size.
//
// Parameter List :
//
//		HWFILE	-> handle to file
//
// Return Value :
//
//		INT32		-> file size in file if successful
//					-> 0 if not
//
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function FileGetSize(hFile: HWFILE): UINT32 {
  let hRealHandle: HANDLE;
  let uiFileSize: UINT32 = 0xFFFFFFFF;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to a real file
    hRealHandle = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    uiFileSize = GetFileSize(hRealHandle, NULL);
  } else {
    // if the library is open
    if (IsLibraryOpened(sLibraryID))
      uiFileSize = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader->uiFileLength;
  }

  if (uiFileSize == 0xFFFFFFFF)
    return 0;
  else
    return uiFileSize;
}

//**************************************************************************
//
// FileDebugPrint
//
//		To print the state of memory to output.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************

function FileDebugPrint(): void {
}

//**************************************************************************
//
// GetHandleToRealFile
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//		9 Feb 98	DEF - modified to work with the library system
//
//**************************************************************************

function GetHandleToRealFile(hFile: HWFILE, pfDatabaseFile: Pointer<BOOLEAN>): HANDLE {
  let hRealFile: HANDLE;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to the real file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;
    *pfDatabaseFile = FALSE;
  } else {
    *pfDatabaseFile = TRUE;
    hRealFile = hFile;
  }

  return hRealFile;
}

//**************************************************************************
//
// CreateFileHandle
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************
/*

        not needed anymore

HWFILE CreateFileHandle( HANDLE hRealFile, BOOLEAN fDatabaseFile )
{
        UINT32		i, uiOldNumHandles;
        FMFileInfo		*pNewFileInfo;

        Assert( !fDatabaseFile || (fDatabaseFile && gfs.fDBInitialized) );

        // don't use 1st position - it'll confuse the users
        for ( i=1 ; i<gfs.uiNumHandles ; i++ )
        {
                if ( gfs.pFileInfo[i].hFileHandle == 0 && gfs.pFileInfo[i].hDBFile == 0 )
                {
                        if ( fDatabaseFile )
                                gfs.pFileInfo[i].hDBFile = (HDBFILE)hRealFile;
                        else
                                gfs.pFileInfo[i].hFileHandle = hRealFile;
                        return( i );
                }
        }

        uiOldNumHandles = gfs.uiNumHandles;

        pNewFileInfo = (FMFileInfo *)MemRealloc( gfs.pFileInfo, gfs.uiNumHandles + NUM_FILES_TO_ADD_AT_A_TIME );
        if ( !pNewFileInfo )
        {
                // TBD: error error error
                return(0);
        }
        gfs.pFileInfo = (FMFileInfo *)pNewFileInfo;
        gfs.uiNumHandles = gfs.uiNumHandles + NUM_FILES_TO_ADD_AT_A_TIME;

        for ( i=uiOldNumHandles ; i<gfs.uiNumHandles ; i++ )
        {
                gfs.pFileInfo[i].hFileHandle = 0;
                gfs.pFileInfo[i].hDBFile = 0;
        }

        if ( fDatabaseFile )
                gfs.pFileInfo[uiOldNumHandles].hDBFile = (HDBFILE)hRealFile;
        else
                gfs.pFileInfo[uiOldNumHandles].hFileHandle = hRealFile;

        return(uiOldNumHandles);
}
*/

//**************************************************************************
//
// DestroyFileHandle
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		24sep96:HJH		-> creation
//
//**************************************************************************
/*
void DestroyFileHandle( HWFILE hFile )
{
        if ( hFile < gfs.uiNumHandles && hFile )
        {
                gfs.pFileInfo[hFile].hFileHandle = 0;
                gfs.pFileInfo[hFile].hDBFile = 0;
        }
}
*/

//**************************************************************************
//
// BuildFileDirectory
//
//
//
// Parameter List :
// Return Value :
// Modification history :
//
//		??nov96:HJH		-> creation
//
//**************************************************************************

function BuildFileDirectory(): void {
  return; // temporary until container stuff is fixed
  /*
          INT32					i, iNumFiles = 0;
          HANDLE				hFile, hFileIn;
          WIN32_FIND_DATA	find, inFind;
          BOOLEAN				fMore = TRUE;
          CHAR					cName[FILENAME_LENGTH], cDir[FILENAME_LENGTH], cSubDir[FILENAME_LENGTH];
          HCONTAINER			hStack;



          //
          //	First, push all the file names in the directory (and subdirectories)
          //	onto the stack.
          //

          GetProfileChar( "Startup", "InstPath", "", cDir );

          if ( strlen( cDir ) == 0 )
                  return;

          hStack = CreateStack( 100, FILENAME_LENGTH );
          if (hStack == NULL)
          {
                  FastDebugMsg(String("BuildFileDirectory: CreateStack Failed for the filename stack"));
                  return;
          }

          find.dwFileAttributes = FILE_ATTRIBUTE_NORMAL | FILE_ATTRIBUTE_DIRECTORY;

          strcpy( &(cDir[strlen(cDir)]), "\\*.*\0" );
          hFile = FindFirstFile( cDir, &find );
          while ( fMore )
          {
                  if ( find.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
                  {
                          if ( strcmp( find.cFileName, "." ) != 0 && strcmp( find.cFileName, ".." ) != 0 )
                          {
                                  // a valid directory
                                  inFind.dwFileAttributes = FILE_ATTRIBUTE_NORMAL | FILE_ATTRIBUTE_DIRECTORY;
                                  strcpy( cSubDir, cDir );
                                  strcpy( &(cSubDir[strlen(cDir)-3]), find.cFileName );
                                  strcpy( &(cSubDir[strlen(cSubDir)]), "\\*.*\0" );
                                  hFileIn = FindFirstFile( cSubDir, &inFind );
                                  iNumFiles += GetFilesInDirectory( hStack, cSubDir, hFileIn, &inFind );
                                  FindClose( hFileIn );
                          }
                  }
                  else
                  {
                          iNumFiles++;
                          strcpy( cName, cDir );
                          strcpy( &(cName[strlen(cName)-3]), find.cFileName );
                          CharLower( cName );
                          hStack = Push( hStack, cName );
                  }
                  find.dwFileAttributes = FILE_ATTRIBUTE_NORMAL | FILE_ATTRIBUTE_DIRECTORY;
                  fMore = FindNextFile( hFile, &find );
          }
          FindClose( hFile );

          //
          //	Okay, we have all the files in the stack, now put them in place.
          //
          gfs.uiNumFilesInDirectory = iNumFiles;

          gfs.pcFileNames = (CHAR *)MemAlloc( iNumFiles * FILENAME_LENGTH );

          if ( gfs.pcFileNames )
          {
                  for ( i=0 ; i<iNumFiles ; i++ )
                  {
                          Pop( hStack, (void *)(&gfs.pcFileNames[i*FILENAME_LENGTH]) );
                  }
          }

          //
          //	Clean up.
          //

          DeleteStack( hStack );
  */
}

//**************************************************************************
//
// GetFilesInDirectory
//
//		Gets the files in a directory and the subdirectories.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		??nov96:HJH		-> creation
//
//**************************************************************************

function GetFilesInDirectory(hStack: HCONTAINER, pcDir: Pointer<CHAR>, hFile: HANDLE, pFind: Pointer<WIN32_FIND_DATA>): INT32 {
  let iNumFiles: INT32;
  let inFind: WIN32_FIND_DATA;
  let fMore: BOOLEAN;
  let cName: CHAR[] /* [FILENAME_LENGTH] */;
  let cDir: CHAR[] /* [FILENAME_LENGTH] */;
  let hFileIn: HANDLE;

  fMore = TRUE;
  iNumFiles = 0;

  while (fMore) {
    if (pFind->dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
      if (strcmp(pFind->cFileName, ".") != 0 && strcmp(pFind->cFileName, "..") != 0) {
        // a valid directory - recurse and find the files in that directory

        inFind.dwFileAttributes = FILE_ATTRIBUTE_NORMAL | FILE_ATTRIBUTE_DIRECTORY;
        strcpy(cDir, pcDir);
        strcpy(&(cDir[strlen(cDir) - 3]), pFind->cFileName);
        strcpy(&(cDir[strlen(cDir)]), "\\*.*\0");
        hFileIn = FindFirstFile(cDir, &inFind);
        iNumFiles += GetFilesInDirectory(hStack, cDir, hFileIn, &inFind);
        FindClose(hFileIn);
      }
    } else {
      iNumFiles++;
      strcpy(cName, pcDir);
      strcpy(&(cName[strlen(cName) - 3]), pFind->cFileName);
      CharLower(cName);
      hStack = Push(hStack, cName);
    }
    pFind->dwFileAttributes = FILE_ATTRIBUTE_NORMAL | FILE_ATTRIBUTE_DIRECTORY;
    fMore = FindNextFile(hFile, pFind);
  }

  return iNumFiles;
}

function SetFileManCurrentDirectory(pcDirectory: STR): BOOLEAN {
  return SetCurrentDirectory(pcDirectory);
}

function GetFileManCurrentDirectory(pcDirectory: STRING512): BOOLEAN {
  if (GetCurrentDirectory(512, pcDirectory) == 0) {
    return FALSE;
  }
  return TRUE;
}

function DirectoryExists(pcDirectory: STRING512): BOOLEAN {
  let uiAttribs: UINT32;
  let uiLastError: DWORD;

  uiAttribs = GetFileAttributes(pcDirectory);

  if (uiAttribs == 0xFFFFFFFF) {
    // an error, make sure it's the right error
    uiLastError = GetLastError();

    if (uiLastError != ERROR_FILE_NOT_FOUND) {
      FastDebugMsg(String("DirectoryExists: ERROR - GetFileAttributes failed, error #%d on file %s", uiLastError, pcDirectory));
    }
  } else {
    // something's there, make sure it's a directory
    if (uiAttribs & FILE_ATTRIBUTE_DIRECTORY) {
      return TRUE;
    }
  }

  // this could also mean that the name given is that of a file, or that an error occurred
  return FALSE;
}

function MakeFileManDirectory(pcDirectory: STRING512): BOOLEAN {
  return CreateDirectory(pcDirectory, NULL);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Removes ALL FILES in the specified directory (and all subdirectories with their files if fRecursive is TRUE)
// Use EraseDirectory() to simply delete directory contents without deleting the directory itself
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RemoveFileManDirectory(pcDirectory: STRING512, fRecursive: BOOLEAN): BOOLEAN {
  let sFindData: WIN32_FIND_DATA;
  let SearchHandle: HANDLE;
  const pFileSpec: Pointer<CHAR8> = "*.*";
  let fDone: BOOLEAN = FALSE;
  let fRetval: BOOLEAN = FALSE;
  let zOldDir: CHAR8[] /* [512] */;
  let zSubdirectory: CHAR8[] /* [512] */;

  GetFileManCurrentDirectory(zOldDir);

  if (!SetFileManCurrentDirectory(pcDirectory)) {
    FastDebugMsg(String("RemoveFileManDirectory: ERROR - SetFileManCurrentDirectory on %s failed, error %d", pcDirectory, GetLastError()));
    return (FALSE); // Error going into directory
  }

  // If there are files in the directory, DELETE THEM
  SearchHandle = FindFirstFile(pFileSpec, &sFindData);
  if (SearchHandle != INVALID_HANDLE_VALUE) {
    fDone = FALSE;
    do {
      // if the object is a directory
      if (GetFileAttributes(sFindData.cFileName) == FILE_ATTRIBUTE_DIRECTORY) {
        // only go in if the fRecursive flag is TRUE (like Deltree)
        if (fRecursive) {
          sprintf(zSubdirectory, "%s\\%s", pcDirectory, sFindData.cFileName);

          if ((strcmp(sFindData.cFileName, ".") != 0) && (strcmp(sFindData.cFileName, "..") != 0)) {
            if (!RemoveFileManDirectory(zSubdirectory, TRUE)) {
              FastDebugMsg(String("RemoveFileManDirectory: ERROR - Recursive call on %s failed", zSubdirectory));
              break;
            }
          }
        }
        // otherwise, all the individual files will be deleted, but the subdirectories remain, causing
        // RemoveDirectory() at the end to fail, thus this function will return FALSE in that event (failure)
      } else {
        FileDelete(sFindData.cFileName);
      }

      // find the next file in the directory
      fRetval = FindNextFile(SearchHandle, &sFindData);
      if (fRetval == 0) {
        fDone = TRUE;
      }
    } while (!fDone);

    // very important: close the find handle, or subsequent RemoveDirectory() calls will fail
    FindClose(SearchHandle);
  }

  if (!SetFileManCurrentDirectory(zOldDir)) {
    FastDebugMsg(String("RemoveFileManDirectory: ERROR - SetFileManCurrentDirectory on %s failed, error %d", zOldDir, GetLastError()));
    return (FALSE); // Error returning from subdirectory
  }

  // The directory MUST be empty
  fRetval = RemoveDirectory(pcDirectory);
  if (!fRetval) {
    FastDebugMsg(String("RemoveFileManDirectory: ERROR - RemoveDirectory on %s failed, error %d", pcDirectory, GetLastError()));
  }

  return fRetval;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Removes ALL FILES in the specified directory but leaves the directory alone.  Does not affect any subdirectories!
// Use RemoveFilemanDirectory() to also delete the directory itself, or to recursively delete subdirectories.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function EraseDirectory(pcDirectory: STRING512): BOOLEAN {
  let sFindData: WIN32_FIND_DATA;
  let SearchHandle: HANDLE;
  const pFileSpec: Pointer<CHAR8> = "*.*";
  let fDone: BOOLEAN = FALSE;
  let zOldDir: CHAR8[] /* [512] */;

  GetFileManCurrentDirectory(zOldDir);

  if (!SetFileManCurrentDirectory(pcDirectory)) {
    FastDebugMsg(String("EraseDirectory: ERROR - SetFileManCurrentDirectory on %s failed, error %d", pcDirectory, GetLastError()));
    return (FALSE); // Error going into directory
  }

  // If there are files in the directory, DELETE THEM
  SearchHandle = FindFirstFile(pFileSpec, &sFindData);
  if (SearchHandle != INVALID_HANDLE_VALUE) {
    fDone = FALSE;
    do {
      // if it's a file, not a directory
      if (GetFileAttributes(sFindData.cFileName) != FILE_ATTRIBUTES_DIRECTORY) {
        FileDelete(sFindData.cFileName);
      }

      // find the next file in the directory
      if (!FindNextFile(SearchHandle, &sFindData)) {
        fDone = TRUE;
      }
    } while (!fDone);

    // very important: close the find handle, or subsequent RemoveDirectory() calls will fail
    FindClose(SearchHandle);
  }

  if (!SetFileManCurrentDirectory(zOldDir)) {
    FastDebugMsg(String("EraseDirectory: ERROR - SetFileManCurrentDirectory on %s failed, error %d", zOldDir, GetLastError()));
    return (FALSE); // Error returning from directory
  }

  return TRUE;
}

function GetExecutableDirectory(pcDirectory: STRING512): BOOLEAN {
  let ModuleFilename: SGPFILENAME;
  let cnt: UINT32;

  if (GetModuleFileName(NULL, ModuleFilename, sizeof(ModuleFilename)) == 0) {
    return FALSE;
  }

  // Now get directory
  strcpy(pcDirectory, ModuleFilename);

  for (cnt = strlen(pcDirectory) - 1; cnt >= 0; cnt--) {
    if (pcDirectory[cnt] == '\\') {
      pcDirectory[cnt] = '\0';
      break;
    }
  }

  return TRUE;
}

function GetFileFirst(pSpec: Pointer<CHAR8>, pGFStruct: Pointer<GETFILESTRUCT>): BOOLEAN {
  let x: INT32;
  let iWhich: INT32 = 0;
  let fFound: BOOLEAN;

  CHECKF(pSpec != NULL);
  CHECKF(pGFStruct != NULL);

  fFound = FALSE;
  for (x = 0; x < 20 && !fFound; x++) {
    if (!fFindInfoInUse[x]) {
      iWhich = x;
      fFound = TRUE;
    }
  }

  if (!fFound)
    return FALSE;

  pGFStruct->iFindHandle = iWhich;

  hFindInfoHandle[iWhich] = FindFirstFile(pSpec, &Win32FindInfo[iWhich]);

  if (hFindInfoHandle[iWhich] == INVALID_HANDLE_VALUE)
    return FALSE;
  fFindInfoInUse[iWhich] = TRUE;

  W32toSGPFileFind(pGFStruct, &Win32FindInfo[iWhich]);

  return TRUE;
}

function GetFileNext(pGFStruct: Pointer<GETFILESTRUCT>): BOOLEAN {
  CHECKF(pGFStruct != NULL);

  if (FindNextFile(hFindInfoHandle[pGFStruct->iFindHandle], &Win32FindInfo[pGFStruct->iFindHandle])) {
    W32toSGPFileFind(pGFStruct, &Win32FindInfo[pGFStruct->iFindHandle]);
    return TRUE;
  }
  return FALSE;
}

function GetFileClose(pGFStruct: Pointer<GETFILESTRUCT>): void {
  if (pGFStruct == NULL)
    return;

  FindClose(hFindInfoHandle[pGFStruct->iFindHandle]);
  hFindInfoHandle[pGFStruct->iFindHandle] = INVALID_HANDLE_VALUE;
  fFindInfoInUse[pGFStruct->iFindHandle] = FALSE;

  return;
}

function W32toSGPFileFind(pGFStruct: Pointer<GETFILESTRUCT>, pW32Struct: Pointer<WIN32_FIND_DATA>): void {
  let uiAttribMask: UINT32;

  // Copy the filename
  strcpy(pGFStruct->zFileName, pW32Struct->cFileName);

  // Get file size
  if (pW32Struct->nFileSizeHigh != 0)
    pGFStruct->uiFileSize = 0xffffffff;
  else
    pGFStruct->uiFileSize = pW32Struct->nFileSizeLow;

  // Copy the file attributes
  pGFStruct->uiFileAttribs = 0;

  for (uiAttribMask = 0x80000000; uiAttribMask > 0; uiAttribMask >>= 1) {
    switch (pW32Struct->dwFileAttributes & uiAttribMask) {
      case FILE_ATTRIBUTE_ARCHIVE:
        pGFStruct->uiFileAttribs |= FILE_IS_ARCHIVE;
        break;

      case FILE_ATTRIBUTE_DIRECTORY:
        pGFStruct->uiFileAttribs |= FILE_IS_DIRECTORY;
        break;

      case FILE_ATTRIBUTE_HIDDEN:
        pGFStruct->uiFileAttribs |= FILE_IS_HIDDEN;
        break;

      case FILE_ATTRIBUTE_NORMAL:
        pGFStruct->uiFileAttribs |= FILE_IS_NORMAL;
        break;

      case FILE_ATTRIBUTE_READONLY:
        pGFStruct->uiFileAttribs |= FILE_IS_READONLY;
        break;

      case FILE_ATTRIBUTE_SYSTEM:
        pGFStruct->uiFileAttribs |= FILE_IS_SYSTEM;
        break;

      case FILE_ATTRIBUTE_TEMPORARY:
        pGFStruct->uiFileAttribs |= FILE_IS_TEMPORARY;
        break;

      case FILE_ATTRIBUTE_COMPRESSED:
        pGFStruct->uiFileAttribs |= FILE_IS_COMPRESSED;
        break;

      case FILE_ATTRIBUTE_OFFLINE:
        pGFStruct->uiFileAttribs |= FILE_IS_OFFLINE;
        break;
    }
  }
}

function FileCopy(strSrcFile: STR, strDstFile: STR, fFailIfExists: BOOLEAN): BOOLEAN {
  return CopyFile(strSrcFile, strDstFile, fFailIfExists);

  // Not needed, use Windows CopyFile
  /*
          HWFILE hFile;
          UINT32 uiSize;
          CHAR *pBuffer;
          UINT32 uiBytesRead, uiBytesWritten;


          // open source file
    hFile = FileOpen(strSrcFile, FILE_ACCESS_READ, FALSE);
    if (hFile == 0)
    {
          FastDebugMsg(String("FileCopy: FileOpen failed on Src file %s", strSrcFile));
      return(FALSE);
    }

          // get its size
          uiSize = FileGetSize(hFile);
          if (uiSize == 0)
          {
          FastDebugMsg(String("FileCopy: size is 0, Src file %s", strSrcFile));
      FileClose(hFile);
      return(FALSE);
          }

          // allocate a buffer big enough to hold the entire file
          pBuffer = MemAlloc(uiSize);
          if (pBuffer == NULL)
          {
                  FastDebugMsg(String("FileCopy: ERROR - MemAlloc pBuffer failed, size %d", uiSize));
      FileClose(hFile);
                  return(FALSE);
          }

          // read the file into memory
    if (!FileRead(hFile, pBuffer, uiSize, &uiBytesRead))
    {
          FastDebugMsg(String("FileCopy: FileRead failed, file %s", strSrcFile));
      FileClose(hFile);
      return(FALSE);
    }

          // close source file
    FileClose(hFile);


          // open destination file
    hFile = FileOpen(strDstFile, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);
    if (hFile == 0)
    {
          FastDebugMsg(String("FileCopy: FileOpen failed on Dst file %s", strDstFile));
      return(FALSE);
    }

          // write buffer to the destination file
    if (!FileWrite(hFile, pBuffer, uiSize, &uiBytesWritten))
    {
          FastDebugMsg(String("FileCopy: FileWrite failed, file %s", strDstFile));
      FileClose(hFile);
      return(FALSE);
    }

          // close destination file
    FileClose(hFile);


    MemFree(pBuffer);
    pBuffer = NULL;
          return(TRUE);
  */
}

function FileMove(strOldName: STR, strNewName: STR): BOOLEAN {
  // rename
  return MoveFile(strOldName, strNewName);
}

// Additions by Kris Morness
function FileSetAttributes(strFilename: STR, uiNewAttribs: UINT32): BOOLEAN {
  let uiFileAttrib: UINT32 = 0;

  if (uiNewAttribs & FILE_ATTRIBUTES_ARCHIVE)
    uiFileAttrib |= FILE_ATTRIBUTE_ARCHIVE;

  if (uiNewAttribs & FILE_ATTRIBUTES_HIDDEN)
    uiFileAttrib |= FILE_ATTRIBUTE_HIDDEN;

  if (uiNewAttribs & FILE_ATTRIBUTES_NORMAL)
    uiFileAttrib |= FILE_ATTRIBUTE_NORMAL;

  if (uiNewAttribs & FILE_ATTRIBUTES_OFFLINE)
    uiFileAttrib |= FILE_ATTRIBUTE_OFFLINE;

  if (uiNewAttribs & FILE_ATTRIBUTES_READONLY)
    uiFileAttrib |= FILE_ATTRIBUTE_READONLY;

  if (uiNewAttribs & FILE_ATTRIBUTES_SYSTEM)
    uiFileAttrib |= FILE_ATTRIBUTE_SYSTEM;

  if (uiNewAttribs & FILE_ATTRIBUTES_TEMPORARY)
    uiFileAttrib |= FILE_ATTRIBUTE_TEMPORARY;

  return SetFileAttributes(strFilename, uiFileAttrib);
}

function FileGetAttributes(strFilename: STR): UINT32 {
  let uiAttribs: UINT32 = 0;
  let uiFileAttrib: UINT32 = 0;

  uiAttribs = GetFileAttributes(strFilename);

  if (uiAttribs == 0xFFFFFFFF)
    return uiAttribs;

  if (uiAttribs & FILE_ATTRIBUTE_ARCHIVE)
    uiFileAttrib |= FILE_ATTRIBUTES_ARCHIVE;

  if (uiAttribs & FILE_ATTRIBUTE_HIDDEN)
    uiFileAttrib |= FILE_ATTRIBUTES_HIDDEN;

  if (uiAttribs & FILE_ATTRIBUTE_NORMAL)
    uiFileAttrib |= FILE_ATTRIBUTES_NORMAL;

  if (uiAttribs & FILE_ATTRIBUTE_OFFLINE)
    uiFileAttrib |= FILE_ATTRIBUTES_OFFLINE;

  if (uiAttribs & FILE_ATTRIBUTE_READONLY)
    uiFileAttrib |= FILE_ATTRIBUTES_READONLY;

  if (uiAttribs & FILE_ATTRIBUTE_SYSTEM)
    uiFileAttrib |= FILE_ATTRIBUTES_SYSTEM;

  if (uiAttribs & FILE_ATTRIBUTE_TEMPORARY)
    uiFileAttrib |= FILE_ATTRIBUTES_TEMPORARY;

  if (uiAttribs & FILE_ATTRIBUTE_DIRECTORY)
    uiFileAttrib |= FILE_ATTRIBUTES_DIRECTORY;

  return uiFileAttrib;
}

function FileClearAttributes(strFilename: STR): BOOLEAN {
  return SetFileAttributes(strFilename, FILE_ATTRIBUTE_NORMAL);
}

// returns true if at end of file, else false
function FileCheckEndOfFile(hFile: HWFILE): BOOLEAN {
  let sLibraryID: INT16;
  let uiFileNum: UINT32;
  let hRealFile: HANDLE;
  //	UINT8		Data;
  let uiNumberOfBytesRead: UINT32 = 0;
  let uiOldFilePtrLoc: UINT32 = 0;
  let uiEndOfFilePtrLoc: UINT32 = 0;
  let temp: UINT32 = 0;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to the real file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    // Get the current position of the file pointer
    uiOldFilePtrLoc = SetFilePointer(hRealFile, 0, NULL, FILE_CURRENT);

    // Get the end of file ptr location
    uiEndOfFilePtrLoc = SetFilePointer(hRealFile, 0, NULL, FILE_END);

    // reset back to the original location
    temp = SetFilePointer(hRealFile, -((uiEndOfFilePtrLoc - uiOldFilePtrLoc)), NULL, FILE_END);

    // if the 2 pointers are the same, we are at the end of a file
    if (uiEndOfFilePtrLoc <= uiOldFilePtrLoc) {
      return 1;
    }
  }

  // else it is a library file
  else {
    // if the database is initialized
    if (gFileDataBase.fInitialized) {
      // if the library is open
      if (IsLibraryOpened(sLibraryID)) {
        // if the file is opened
        if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
          let uiLength: UINT32; // uiOffsetInLibrary
          //					HANDLE	hLibraryFile;
          //					UINT32	uiNumBytesRead;
          let uiCurPos: UINT32;

          uiLength = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader->uiFileLength;
          uiCurPos = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;

          // if we are trying to read more data then the size of the file, return an error
          if (uiCurPos >= uiLength) {
            return TRUE;
          }
        }
      }
    }
  }

  // we are not and the end of a file
  return 0;
}

function GetFileManFileTime(hFile: HWFILE, pCreationTime: Pointer<SGP_FILETIME>, pLastAccessedTime: Pointer<SGP_FILETIME>, pLastWriteTime: Pointer<SGP_FILETIME>): BOOLEAN {
  let hRealFile: HANDLE;
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  let sCreationUtcFileTime: FILETIME;
  let sLastAccessedUtcFileTime: FILETIME;
  let sLastWriteUtcFileTime: FILETIME;

  // Initialize the passed in variables
  memset(pCreationTime, 0, sizeof(SGP_FILETIME));
  memset(pLastAccessedTime, 0, sizeof(SGP_FILETIME));
  memset(pLastWriteTime, 0, sizeof(SGP_FILETIME));

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // get the real file handle to the file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    // Gets the UTC file time for the 'real' file
    GetFileTime(hRealFile, &sCreationUtcFileTime, &sLastAccessedUtcFileTime, &sLastWriteUtcFileTime);

    // converts the creation UTC file time to the current time used for the file
    FileTimeToLocalFileTime(&sCreationUtcFileTime, pCreationTime);

    // converts the accessed UTC file time to the current time used for the file
    FileTimeToLocalFileTime(&sLastAccessedUtcFileTime, pLastAccessedTime);

    // converts the write UTC file time to the current time used for the file
    FileTimeToLocalFileTime(&sLastWriteUtcFileTime, pLastWriteTime);
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized) {
      // if the library is open
      if (IsLibraryOpened(sLibraryID)) {
        // if the file is opened
        if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
          if (!GetLibraryFileTime(sLibraryID, uiFileNum, pLastWriteTime)) {
            return FALSE;
          }
        }
      }
    }
  }

  return TRUE;
}

function CompareSGPFileTimes(pFirstFileTime: Pointer<SGP_FILETIME>, pSecondFileTime: Pointer<SGP_FILETIME>): INT32 {
  return CompareFileTime(pFirstFileTime, pSecondFileTime);
}

function FileSize(strFilename: STR): UINT32 {
  let hFile: HWFILE;
  let uiSize: UINT32;

  if ((hFile = FileOpen(strFilename, FILE_OPEN_EXISTING | FILE_ACCESS_READ, FALSE)) == 0)
    return 0;

  uiSize = FileGetSize(hFile);
  FileClose(hFile);

  return uiSize;
}

function GetRealFileHandleFromFileManFileHandle(hFile: HWFILE): HANDLE {
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  GetLibraryAndFileIDFromLibraryFileHandle(hFile, &sLibraryID, &uiFileNum);

  // if its the 'real file' library
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // if its not already closed
    if (gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].uiFileID != 0) {
      return gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;
    }
  } else {
    // if the file is not opened, dont close it
    if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
      return gFileDataBase.pLibraries[sLibraryID].hLibraryHandle;
    }
  }
  return 0;
}

//**************************************************************************
//
// AddSubdirectoryToPath
//
//		Puts a subdirectory of the current working directory into the current
// task's system path.
//
// Parameter List :
// Return Value :
// Modification history :
//
//		10June98:DB		-> creation
//
//**************************************************************************
function AddSubdirectoryToPath(pDirectory: Pointer<CHAR8>): BOOLEAN {
  let pSystemPath: Pointer<CHAR8>;
  let pPath: Pointer<CHAR8>;
  let uiPathLen: UINT32;

  // Check for NULL
  if (!pDirectory)
    return FALSE;

  // Check for zero length string
  if (!strlen(pDirectory))
    return FALSE;

  if ((pSystemPath = MemAlloc(_MAX_PATH)) == NULL)
    return FALSE;

  memset(pSystemPath, 0, _MAX_PATH);

  if ((pPath = MemAlloc(_MAX_PATH)) == NULL) {
    MemFree(pSystemPath);
    return FALSE;
  }

  memset(pPath, 0, _MAX_PATH);

  // Builds a path to the directory with the SR DLL files.
  _getcwd(pPath, _MAX_PATH);
  uiPathLen = strlen(pPath);
  if (uiPathLen)
    uiPathLen--;
  if (pPath[uiPathLen] != '\\')
    strcat(pPath, "\\");

  strcat(pPath, pDirectory);

  // Appends it to the path for the current task
  if (GetEnvironmentVariable("PATH", pSystemPath, _MAX_PATH)) {
    strcat(pSystemPath, ";");
    strcat(pSystemPath, pPath);
    SetEnvironmentVariable("PATH", pSystemPath);
    MemFree(pSystemPath);
    MemFree(pPath);
    return TRUE;
  } else {
    MemFree(pSystemPath);
    MemFree(pPath);
    return FALSE;
  }
}

function GetFreeSpaceOnHardDriveWhereGameIsRunningFrom(): UINT32 {
  let zExecDir: STRING512;
  let zDrive: STRING512;
  let zDir: STRING512;
  let zFileName: STRING512;
  let zExt: STRING512;

  let uiFreeSpace: UINT32 = 0;

  GetExecutableDirectory(zExecDir);

  // get the drive letter from the exec dir
  _splitpath(zExecDir, zDrive, zDir, zFileName, zExt);

  sprintf(zDrive, "%s\\", zDrive);

  uiFreeSpace = GetFreeSpaceOnHardDrive(zDrive);

  return uiFreeSpace;
}

function GetFreeSpaceOnHardDrive(pzDriveLetter: STR): UINT32 {
  let uiBytesFree: UINT32 = 0;

  let uiSectorsPerCluster: UINT32 = 0;
  let uiBytesPerSector: UINT32 = 0;
  let uiNumberOfFreeClusters: UINT32 = 0;
  let uiTotalNumberOfClusters: UINT32 = 0;

  if (!GetDiskFreeSpace(pzDriveLetter, &uiSectorsPerCluster, &uiBytesPerSector, &uiNumberOfFreeClusters, &uiTotalNumberOfClusters)) {
    let uiLastError: UINT32 = GetLastError();
    let zString: char[] /* [1024] */;
    FormatMessage(FORMAT_MESSAGE_FROM_SYSTEM, 0, uiLastError, 0, zString, 1024, NULL);

    return TRUE;
  }

  uiBytesFree = uiBytesPerSector * uiNumberOfFreeClusters * uiSectorsPerCluster;

  return uiBytesFree;
}
