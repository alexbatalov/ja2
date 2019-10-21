interface FDLG_LIST {
  FileInfo: GETFILESTRUCT;
  pNext: Pointer<FDLG_LIST>;
  pPrev: Pointer<FDLG_LIST>;
}
