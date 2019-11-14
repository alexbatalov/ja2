namespace ja2 {

export const FILES_DAT_FILE = "TEMP\\files.dat";

export interface FilesUnit {
  ubCode: UINT8; // the code index in the files code table
  ubFormat: UINT8; // layout format
  uiIdNumber: UINT32; // unique id number
  uiDate: UINT32; // time in the world in global time (resolution, minutes)
  fRead: boolean;
  pPicFileNameList: string[] /* STR8[2] */;

  Next: FilesUnit | null /* Pointer<FilesUnit> */; // next unit in the list
}

export function createFilesUnit(): FilesUnit {
  return {
    ubCode: 0,
    ubFormat: 0,
    uiIdNumber: 0,
    uiDate: 0,
    fRead: false,
    pPicFileNameList: createArray(2, ''),
    Next: null,
  };
}

export const FILES_UNIT_SIZE = 263;

export interface FileString {
  pString: string /* STR16 */;
  Next: FileString | null /* Pointer<FileString> */;
}

export function createFileString(): FileString {
  return {
    pString: '',
    Next: null,
  };
}

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

export interface FileRecordWidth {
  iRecordNumber: INT32;
  iRecordWidth: INT32;
  iRecordHeightAdjustment: INT32;
  ubFlags: UINT8;
  Next: FileRecordWidth | null /* Pointer<FileRecordWidth> */;
}

export function createFileRecordWidth(): FileRecordWidth {
  return {
    iRecordNumber: 0,
    iRecordWidth: 0,
    iRecordHeightAdjustment: 0,
    ubFlags: 0,
    Next: null,
  };
}

}
