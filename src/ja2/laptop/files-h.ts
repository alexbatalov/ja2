namespace ja2 {

export const FILES_DAT_FILE = "TEMP\\files.dat";

export interface FilesUnit {
  ubCode: UINT8; // the code index in the files code table
  ubFormat: UINT8; // layout format
  uiIdNumber: UINT32; // unique id number
  uiDate: UINT32; // time in the world in global time (resolution, minutes)
  fRead: boolean;
  pPicFileNameList: string[] /* STR8[2] */;

  Next: Pointer<FilesUnit>; // next unit in the list
}

export interface FileString {
  pString: string /* STR16 */;
  Next: Pointer<FileString>;
}

export type FileStringPtr = Pointer<FileString>;

// files codes
const enum Enum77 {
  FILES_WELCOME_NOTICE,
}

// special codes for special files
export const enum Enum78 {
  ENRICO_BACKGROUND = 0,
  SLAY_BACKGROUND,
  MATRON_BACKGROUND,
  IMPOSTER_BACKGROUND,
  TIFFANY_BACKGROUND,
  REXALL_BACKGROUND,
  ELGIN_BACKGROUND,
}

export type FilesUnitPtr = Pointer<FilesUnit>;

export interface FileRecordWidth {
  iRecordNumber: INT32;
  iRecordWidth: INT32;
  iRecordHeightAdjustment: INT32;
  ubFlags: UINT8;
  Next: Pointer<FileRecordWidth>;
}

export type FileRecordWidthPtr = Pointer<FileRecordWidth>;

}
