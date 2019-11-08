namespace ja2 {

export const FILENAME_SIZE = 256;

//#define	FILENAME_SIZE									40 + PATH_SIZE
const PATH_SIZE = 80;

export const NUM_FILES_TO_ADD_AT_A_TIME = 20;
export const INITIAL_NUM_HANDLES = 20;

export const REAL_FILE_LIBRARY_ID = 1022;

const DB_BITS_FOR_LIBRARY = 10;
const DB_BITS_FOR_FILE_ID = 22;

export const DB_EXTRACT_LIBRARY = (exp) => (exp >> DB_BITS_FOR_FILE_ID);
export const DB_EXTRACT_FILE_ID = (exp) => (exp & 0x3FFFFF);

export const DB_ADD_LIBRARY_ID = (exp) => (exp << DB_BITS_FOR_FILE_ID);
const DB_ADD_FILE_ID = (exp) => (exp & 0xC00000);

export type HWFILE = UINT32;

export interface LibraryInitHeader {
  sLibraryName: string /* CHAR8[FILENAME_SIZE] */; // The name of the library file on the disk
  fOnCDrom: boolean; // A flag specifying if its a cdrom library ( not implemented yet )
  fInitOnStart: boolean; // Flag specifying if the library is to Initialized at the begining of the game
}

export function createLibraryInitHeaderFrom(sLibraryName: string, fOnCDrom: boolean, fInitOnStart: boolean): LibraryInitHeader {
  return {
    sLibraryName,
    fOnCDrom,
    fInitOnStart,
  };
}

const REAL_LIBRARY_FILE = "RealFiles.slf";

export interface RealFileOpenStruct {
  uiFileID: UINT32; // id of the file ( they start at 1 )
  hRealFileHandle: HANDLE; // if the file is a Real File, this its handle
}

export interface FileHeaderStruct {
  pFileName: string /* STR */;
  uiFileLength: UINT32;
  uiFileOffset: UINT32;
}

export interface FileOpenStruct {
  uiFileID: UINT32; // id of the file ( they start at 1 )
  uiFilePosInFile: UINT32; // current position in the file
  uiActualPositionInLibrary: UINT32; // Current File pointer position in actuall library
  pFileHeader: Pointer<FileHeaderStruct>;
}

export interface LibraryHeaderStruct {
  sLibraryPath: string /* STR */;
  hLibraryHandle: HANDLE;
  usNumberOfEntries: UINT16;
  fLibraryOpen: boolean;
  //	BOOLEAN	fAnotherFileAlreadyOpenedLibrary;				//this variable is set when a file is opened from the library and reset when the file is close.  No 2 files can have access to the library at 1 time.
  uiIdOfOtherFileAlreadyOpenedLibrary: UINT32; // this variable is set when a file is opened from the library and reset when the file is close.  No 2 files can have access to the library at 1 time.
  iNumFilesOpen: INT32;
  iSizeOfOpenFileArray: INT32;
  pFileHeader: Pointer<FileHeaderStruct>;
  pOpenFiles: Pointer<FileOpenStruct>;
}

export interface RealFileHeaderStruct {
  iNumFilesOpen: INT32;
  iSizeOfOpenFileArray: INT32;
  pRealFilesOpen: Pointer<RealFileOpenStruct>;
}

export interface DatabaseManagerHeaderStruct {
  sManagerName: string /* STR */;
  pLibraries: Pointer<LibraryHeaderStruct>;
  usNumberOfLibraries: UINT16;
  fInitialized: boolean;
  RealFiles: RealFileHeaderStruct;
}

// typedef UINT32	HLIBFILE;

//*************************************************************************
//
//  NOTE!  The following structs are also used by the datalib98 utility
//
//*************************************************************************

export const FILE_OK = 0;
const FILE_DELETED = 0xff;
const FILE_OLD = 1;
const FILE_DOESNT_EXIST = 0xfe;

export interface LIBHEADER {
  sLibName: string /* CHAR8[FILENAME_SIZE] */;
  sPathToLibrary: string /* CHAR8[FILENAME_SIZE] */;
  iEntries: INT32;
  iUsed: INT32;
  iSort: UINT16;
  iVersion: UINT16;
  fContainsSubDirectories: boolean;
  iReserved: INT32;
}

export interface DIRENTRY {
  sFileName: string /* CHAR8[FILENAME_SIZE] */;
  uiOffset: UINT32;
  uiLength: UINT32;
  ubState: UINT8;
  ubReserved: UINT8;
  sFileTime: FILETIME;
  usReserved2: UINT16;
}

// Function Prototypes

}
