const FILES_DAT_FILE = "TEMP\\files.dat";

void GameInitFiles();
void EnterFiles();
void ExitFiles();
void HandleFiles();
void RenderFiles();

interface FilesUnit {
  ubCode: UINT8; // the code index in the files code table
  ubFormat: UINT8; // layout format
  uiIdNumber: UINT32; // unique id number
  uiDate: UINT32; // time in the world in global time (resolution, minutes)
  fRead: BOOLEAN;
  pPicFileNameList: STR8[] /* [2] */;

  Next: Pointer<FilesUnit>; // next unit in the list
}

interface FileString {
  pString: STR16;
  Next: Pointer<FileString>;
}

typedef FileString *FileStringPtr;

// files codes
const enum Enum77 {
  FILES_WELCOME_NOTICE,
}

// special codes for special files
const enum Enum78 {
  ENRICO_BACKGROUND = 0,
  SLAY_BACKGROUND,
  MATRON_BACKGROUND,
  IMPOSTER_BACKGROUND,
  TIFFANY_BACKGROUND,
  REXALL_BACKGROUND,
  ELGIN_BACKGROUND,
}
extern UINT8 ubFileRecordsLength[];
extern BOOLEAN fEnteredFileViewerFromNewFileIcon;
extern BOOLEAN fNewFilesInFileViewer;

typedef FilesUnit *FilesUnitPtr;

extern FilesUnitPtr pFilesListHead;

interface FileRecordWidth {
  iRecordNumber: INT32;
  iRecordWidth: INT32;
  iRecordHeightAdjustment: INT32;
  ubFlags: UINT8;
  Next: Pointer<FileRecordWidth>;
}

typedef FileRecordWidth *FileRecordWidthPtr;
UINT32 AddFilesToPlayersLog(UINT8 ubCode, UINT32 uiDate, UINT8 ubFormat, STR8 pFirstPicFile, STR8 pSecondPicFile);

// add a file about this terrorist
BOOLEAN AddFileAboutTerrorist(INT32 iProfileId);
