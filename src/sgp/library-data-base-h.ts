const FILENAME_SIZE = 256;

//#define	FILENAME_SIZE									40 + PATH_SIZE
const PATH_SIZE = 80;

const NUM_FILES_TO_ADD_AT_A_TIME = 20;
const INITIAL_NUM_HANDLES = 20;

const REAL_FILE_LIBRARY_ID = 1022;

const DB_BITS_FOR_LIBRARY = 10;
const DB_BITS_FOR_FILE_ID = 22;

const DB_EXTRACT_LIBRARY = (exp) => (exp >> DB_BITS_FOR_FILE_ID);
const DB_EXTRACT_FILE_ID = (exp) => (exp & 0x3FFFFF);

const DB_ADD_LIBRARY_ID = (exp) => (exp << DB_BITS_FOR_FILE_ID);
const DB_ADD_FILE_ID = (exp) => (exp & 0xC00000);

type HWFILE = UINT32;

interface LibraryInitHeader {
  sLibraryName: CHAR8[] /* [FILENAME_SIZE] */; // The name of the library file on the disk
  fOnCDrom: BOOLEAN; // A flag specifying if its a cdrom library ( not implemented yet )
  fInitOnStart: BOOLEAN; // Flag specifying if the library is to Initialized at the begining of the game
}

extern LibraryInitHeader gGameLibaries[];
extern CHAR8 gzCdDirectory[SGPFILENAME_LEN];

const REAL_LIBRARY_FILE = "RealFiles.slf";

interface RealFileOpenStruct {
  uiFileID: UINT32; // id of the file ( they start at 1 )
  hRealFileHandle: HANDLE; // if the file is a Real File, this its handle
}

interface FileHeaderStruct {
  pFileName: STR;
  uiFileLength: UINT32;
  uiFileOffset: UINT32;
}

interface FileOpenStruct {
  uiFileID: UINT32; // id of the file ( they start at 1 )
  uiFilePosInFile: UINT32; // current position in the file
  uiActualPositionInLibrary: UINT32; // Current File pointer position in actuall library
  pFileHeader: Pointer<FileHeaderStruct>;
}

interface LibraryHeaderStruct {
  sLibraryPath: STR;
  hLibraryHandle: HANDLE;
  usNumberOfEntries: UINT16;
  fLibraryOpen: BOOLEAN;
  //	BOOLEAN	fAnotherFileAlreadyOpenedLibrary;				//this variable is set when a file is opened from the library and reset when the file is close.  No 2 files can have access to the library at 1 time.
  uiIdOfOtherFileAlreadyOpenedLibrary: UINT32; // this variable is set when a file is opened from the library and reset when the file is close.  No 2 files can have access to the library at 1 time.
  iNumFilesOpen: INT32;
  iSizeOfOpenFileArray: INT32;
  pFileHeader: Pointer<FileHeaderStruct>;
  pOpenFiles: Pointer<FileOpenStruct>;
}

interface RealFileHeaderStruct {
  iNumFilesOpen: INT32;
  iSizeOfOpenFileArray: INT32;
  pRealFilesOpen: Pointer<RealFileOpenStruct>;
}

interface DatabaseManagerHeaderStruct {
  sManagerName: STR;
  pLibraries: Pointer<LibraryHeaderStruct>;
  usNumberOfLibraries: UINT16;
  fInitialized: BOOLEAN;
  RealFiles: RealFileHeaderStruct;
}

// typedef UINT32	HLIBFILE;

//*************************************************************************
//
//  NOTE!  The following structs are also used by the datalib98 utility
//
//*************************************************************************

const FILE_OK = 0;
const FILE_DELETED = 0xff;
const FILE_OLD = 1;
const FILE_DOESNT_EXIST = 0xfe;

interface LIBHEADER {
  sLibName: CHAR8[] /* [FILENAME_SIZE] */;
  sPathToLibrary: CHAR8[] /* [FILENAME_SIZE] */;
  iEntries: INT32;
  iUsed: INT32;
  iSort: UINT16;
  iVersion: UINT16;
  fContainsSubDirectories: BOOLEAN;
  iReserved: INT32;
}

interface DIRENTRY {
  sFileName: CHAR8[] /* [FILENAME_SIZE] */;
  uiOffset: UINT32;
  uiLength: UINT32;
  ubState: UINT8;
  ubReserved: UINT8;
  sFileTime: FILETIME;
  usReserved2: UINT16;
}

// The FileDatabaseHeader
extern DatabaseManagerHeaderStruct gFileDataBase;

// Function Prototypes

BOOLEAN CheckForLibraryExistence(STR pLibraryName);
BOOLEAN InitializeLibrary(STR pLibraryName, LibraryHeaderStruct *pLibheader, BOOLEAN fCanBeOnCDrom);

BOOLEAN InitializeFileDatabase();
BOOLEAN ReopenCDLibraries(void);
BOOLEAN ShutDownFileDatabase();
BOOLEAN CheckIfFileExistInLibrary(STR pFileName);
INT16 GetLibraryIDFromFileName(STR pFileName);
HWFILE OpenFileFromLibrary(STR pName);
HWFILE CreateRealFileHandle(HANDLE hFile);
BOOLEAN CloseLibraryFile(INT16 sLibraryID, UINT32 uiFileID);
BOOLEAN GetLibraryAndFileIDFromLibraryFileHandle(HWFILE hlibFile, INT16 *pLibraryID, UINT32 *pFileNum);
BOOLEAN LoadDataFromLibrary(INT16 sLibraryID, UINT32 uiFileIndex, PTR pData, UINT32 uiBytesToRead, UINT32 *pBytesRead);
BOOLEAN LibraryFileSeek(INT16 sLibraryID, UINT32 uiFileNum, UINT32 uiDistance, UINT8 uiHowToSeek);

// used to open and close libraries during the game
BOOLEAN CloseLibrary(INT16 sLibraryID);
BOOLEAN OpenLibrary(INT16 sLibraryID);

BOOLEAN IsLibraryOpened(INT16 sLibraryID);

BOOLEAN GetLibraryFileTime(INT16 sLibraryID, UINT32 uiFileNum, SGP_FILETIME *pLastWriteTime);
