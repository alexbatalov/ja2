const FILES_DAT_FILE = "TEMP\\files.dat";

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

type FileStringPtr = Pointer<FileString>;

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

type FilesUnitPtr = Pointer<FilesUnit>;

interface FileRecordWidth {
  iRecordNumber: INT32;
  iRecordWidth: INT32;
  iRecordHeightAdjustment: INT32;
  ubFlags: UINT8;
  Next: Pointer<FileRecordWidth>;
}

type FileRecordWidthPtr = Pointer<FileRecordWidth>;
