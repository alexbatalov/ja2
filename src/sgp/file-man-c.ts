namespace ja2 {

const fs: typeof import('fs') = require('fs');
const path: typeof import('path') = require('path');

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

const PRINT_DEBUG_INFO = () => FileDebugPrint();

//**************************************************************************
//
//				Typedefs
//
//**************************************************************************

//**************************************************************************
//
//				Variables
//
//**************************************************************************

// The FileDatabaseHeader
export let gFileDataBase: DatabaseManagerHeaderStruct = createDatabaseManagerHeaderStruct();

// FileSystem gfs;

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

export function InitializeFileManager(strIndexFilename: string /* STR */): boolean {
  RegisterDebugTopic(TOPIC_FILE_MANAGER, "File Manager");
  return true;
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

export function ShutdownFileManager(): void {
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

function FileDebug(f: boolean): void {
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

export function FileExists(strFilename: string /* STR */): boolean {
  let fExists: boolean = false;
  // HANDLE	hRealFile;

  fExists = fs.existsSync(strFilename);

  // if the file wasnt on disk, check to see if its in a library
  if (fExists == false) {
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

export function FileExistsNoDB(strFilename: string /* STR */): boolean {
  let fExists: boolean = false;
  // HANDLE	hRealFile;

  fExists = fs.existsSync(strFilename);

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

export function FileDelete(strFilename: string /* STR */): boolean {
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

export function FileOpen(strFilename: string /* STR */, uiOptions: UINT32, fDeleteOnClose: boolean): HWFILE {
  let hFile: HWFILE;
  let hRealFile: HANDLE;
  let dwAccess: number;
  let dwFlagsAndAttributes: number;
  let fExists: boolean;
  let dwCreationFlags: number;
  let hLibFile: HWFILE;

  hFile = 0;
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
    hRealFile = CreateFile(strFilename, dwAccess, 0, null, OPEN_ALWAYS, dwFlagsAndAttributes, null);

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

    hRealFile = CreateFile(strFilename, dwAccess, 0, null, dwCreationFlags, dwFlagsAndAttributes, null);
    if (hRealFile == INVALID_HANDLE_VALUE) {
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

export function FileClose(hFile: HWFILE): void {
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

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

export function FileRead(hFile: HWFILE, pDest: Buffer, uiBytesToRead: UINT32): UINT32 {
  let hRealFile: HANDLE;
  let dwNumBytesToRead: number;
  let dwNumBytesRead: number;
  let fRet: boolean = false;
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  // init the variables
  dwNumBytesToRead = dwNumBytesRead = 0;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

  dwNumBytesToRead = uiBytesToRead;

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // if the file is opened
    if (uiFileNum != 0) {
      hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

      fRet = (dwNumBytesRead = ReadFile(hRealFile, pDest, dwNumBytesToRead)) !== -1;
      if (dwNumBytesToRead != dwNumBytesRead) {
        fRet = false;
      }

      if (fRet)
        return dwNumBytesRead;
    }
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized) {
      // if the library is open
      if (IsLibraryOpened(sLibraryID)) {
        // if the file is opened
        if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
          // read the data from the library
          fRet = (dwNumBytesRead = LoadDataFromLibrary(sLibraryID, uiFileNum, pDest, dwNumBytesToRead)) !== -1;
          if (fRet)
            return dwNumBytesRead;
        }
      }
    }
  }

  return -1;
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

export function FileWrite(hFile: HWFILE, pDest: Buffer, uiBytesToWrite: UINT32): UINT32 {
  let hRealFile: HANDLE;
  let dwNumBytesToWrite: number;
  let dwNumBytesWritten: number;
  let fRet: boolean;
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    dwNumBytesToWrite = uiBytesToWrite;

    // get the real file handle to the file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    fRet = (dwNumBytesWritten = WriteFile(hRealFile, pDest, dwNumBytesToWrite)) !== -1;

    if (dwNumBytesToWrite != dwNumBytesWritten)
      fRet = false;

    if (fRet)
      return dwNumBytesWritten;
  } else {
    // we cannot write to a library file
    return -1;
  }

  return -1;
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

export function FileSeek(hFile: HWFILE, uiDistance: UINT32, uiHow: UINT8): boolean {
  let hRealFile: HANDLE;
  let lDistanceToMove: number;
  let dwMoveMethod: number;
  let iDistance: INT32 = 0;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

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

    if (SetFilePointer(hRealFile, iDistance, null, dwMoveMethod) == 0xFFFFFFFF)
      return false;
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized)
      LibraryFileSeek(sLibraryID, uiFileNum, uiDistance, uiHow);
  }

  return true;
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

export function FileGetPos(hFile: HWFILE): INT32 {
  let hRealFile: HANDLE;
  let uiPositionInFile: UINT32 = 0;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to the real file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    uiPositionInFile = SetFilePointer(hRealFile, 0, null, FILE_CURRENT);
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

export function FileGetSize(hFile: HWFILE): UINT32 {
  let hRealHandle: HANDLE;
  let uiFileSize: UINT32 = 0xFFFFFFFF;

  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to a real file
    hRealHandle = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    uiFileSize = GetFileSize(hRealHandle, null);
  } else {
    // if the library is open
    if (IsLibraryOpened(sLibraryID))
      uiFileSize = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.uiFileLength;
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

export function SetFileManCurrentDirectory(pcDirectory: string /* STR */): boolean {
  try {
    process.chdir(pcDirectory);
    return true;
  } catch {
    return false;
  }
}

export function GetFileManCurrentDirectory(): string {
  return process.cwd();
}

export function MakeFileManDirectory(pcDirectory: string /* STRING512 */): boolean {
  return CreateDirectory(pcDirectory, null);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Removes ALL FILES in the specified directory (and all subdirectories with their files if fRecursive is TRUE)
// Use EraseDirectory() to simply delete directory contents without deleting the directory itself
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function RemoveFileManDirectory(pcDirectory: string /* STRING512 */, fRecursive: boolean): boolean {
  console.log('RemoveFileManDirectory:', pcDirectory);

  return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Removes ALL FILES in the specified directory but leaves the directory alone.  Does not affect any subdirectories!
// Use RemoveFilemanDirectory() to also delete the directory itself, or to recursively delete subdirectories.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function EraseDirectory(pcDirectory: string /* STRING512 */): boolean {
  const fileNames = fs.readdirSync(pcDirectory);
  for (let i = 0; i < fileNames.length; i++) {
    const filePath = path.join(pcDirectory, fileNames[i]);

    // if it's a file, not a directory
    if (FileGetAttributes(filePath) != FILE_ATTRIBUTES_DIRECTORY) {
      FileDelete(filePath);
    }
  }

  return true;
}

export function GetExecutableDirectory(): string {
  return '';
}

export function FileGetAttributes(strFilename: string /* STR */): UINT32 {
  let uiAttribs: UINT32 = 0;
  let uiFileAttrib: UINT32 = 0;

  try {
    const stats = fs.statSync(strFilename);

    if (stats.isFile()) {
      uiAttribs |= FILE_ATTRIBUTE_NORMAL;
    }

    if (stats.isDirectory()) {
      uiAttribs |= FILE_ATTRIBUTE_DIRECTORY;
    }
  } catch {
    uiAttribs = 0xFFFFFFFF;
  }

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

export function FileClearAttributes(strFilename: string /* STR */): boolean {
  return true;
}

// returns true if at end of file, else false
export function FileCheckEndOfFile(hFile: HWFILE): boolean {
  let sLibraryID: INT16;
  let uiFileNum: UINT32;
  let hRealFile: HANDLE;
  //	UINT8		Data;
  let uiNumberOfBytesRead: UINT32 = 0;
  let uiOldFilePtrLoc: UINT32 = 0;
  let uiEndOfFilePtrLoc: UINT32 = 0;
  let temp: UINT32 = 0;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // Get the handle to the real file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    // Get the current position of the file pointer
    uiOldFilePtrLoc = SetFilePointer(hRealFile, 0, null, FILE_CURRENT);

    // Get the end of file ptr location
    uiEndOfFilePtrLoc = SetFilePointer(hRealFile, 0, null, FILE_END);

    // reset back to the original location
    temp = SetFilePointer(hRealFile, -((uiEndOfFilePtrLoc - uiOldFilePtrLoc)), null, FILE_END);

    // if the 2 pointers are the same, we are at the end of a file
    if (uiEndOfFilePtrLoc <= uiOldFilePtrLoc) {
      return true;
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

          uiLength = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].pFileHeader.uiFileLength;
          uiCurPos = gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFilePosInFile;

          // if we are trying to read more data then the size of the file, return an error
          if (uiCurPos >= uiLength) {
            return true;
          }
        }
      }
    }
  }

  // we are not and the end of a file
  return false;
}

export function GetFileManFileTime(hFile: HWFILE, pCreationTime: SGP_FILETIME, pLastAccessedTime: SGP_FILETIME, pLastWriteTime: SGP_FILETIME): boolean {
  let hRealFile: HANDLE;
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  let sCreationUtcFileTime: FILETIME;
  let sLastAccessedUtcFileTime: FILETIME;
  let sLastWriteUtcFileTime: FILETIME;

  // Initialize the passed in variables
  pCreationTime.dwLowDateTime = 0;
  pCreationTime.dwHighDateTime = 0;
  pLastAccessedTime.dwLowDateTime = 0;
  pLastAccessedTime.dwHighDateTime = 0;
  pLastWriteTime.dwLowDateTime = 0;
  pLastWriteTime.dwHighDateTime = 0;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

  // if its a real file, read the data from the file
  if (sLibraryID == REAL_FILE_LIBRARY_ID) {
    // get the real file handle to the file
    hRealFile = gFileDataBase.RealFiles.pRealFilesOpen[uiFileNum].hRealFileHandle;

    // Gets the UTC file time for the 'real' file
    const stats = fs.fstatSync(hRealFile);

    // converts the creation UTC file time to the current time used for the file
    pCreationTime.dwLowDateTime = stats.birthtimeMs;

    // converts the accessed UTC file time to the current time used for the file
    pLastAccessedTime.dwLowDateTime = stats.atimeMs;

    // converts the write UTC file time to the current time used for the file
    pLastWriteTime.dwLowDateTime = stats.ctimeMs;
  } else {
    // if the database is initialized
    if (gFileDataBase.fInitialized) {
      // if the library is open
      if (IsLibraryOpened(sLibraryID)) {
        // if the file is opened
        if (gFileDataBase.pLibraries[sLibraryID].pOpenFiles[uiFileNum].uiFileID != 0) {
          if (!GetLibraryFileTime(sLibraryID, uiFileNum, pLastWriteTime)) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

export function CompareSGPFileTimes(pFirstFileTime: SGP_FILETIME, pSecondFileTime: SGP_FILETIME): INT32 {
  if (pFirstFileTime.dwLowDateTime > pSecondFileTime.dwLowDateTime) {
    return 1;
  } else if (pFirstFileTime.dwLowDateTime < pSecondFileTime.dwLowDateTime) {
    return -1;
  }
  return 0;
}

export function FileSize(strFilename: string /* STR */): UINT32 {
  let hFile: HWFILE;
  let uiSize: UINT32;

  if ((hFile = FileOpen(strFilename, FILE_OPEN_EXISTING | FILE_ACCESS_READ, false)) == 0)
    return 0;

  uiSize = FileGetSize(hFile);
  FileClose(hFile);

  return uiSize;
}

export function GetRealFileHandleFromFileManFileHandle(hFile: HWFILE): HANDLE {
  let sLibraryID: INT16;
  let uiFileNum: UINT32;

  sLibraryID = DB_EXTRACT_LIBRARY(hFile);
  uiFileNum = DB_EXTRACT_FILE_ID(hFile);

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

}
