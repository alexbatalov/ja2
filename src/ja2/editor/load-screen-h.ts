namespace ja2 {

export interface FDLG_LIST {
  FileInfo: GETFILESTRUCT;
  pNext: FDLG_LIST | null /* Pointer<FDLG_LIST> */;
  pPrev: FDLG_LIST | null /* Pointer<FDLG_LIST> */;
}

export function createFileDialogList(): FDLG_LIST {
  return {
    FileInfo: createGetFileStruct(),
    pNext: null,
    pPrev: null,
  };
}

}
