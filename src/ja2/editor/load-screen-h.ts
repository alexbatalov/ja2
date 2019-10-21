interface FDLG_LIST {
  FileInfo: GETFILESTRUCT;
  pNext: Pointer<FDLG_LIST>;
  pPrev: Pointer<FDLG_LIST>;
}

extern INT32 iFDlgState;
extern INT32 iFDlgSelectedSlot;

extern BOOLEAN gfAskForName;
extern BOOLEAN gfCreatedFDlg;
extern BOOLEAN gfDestroyFDlg;

extern BOOLEAN gfErrorCatch;
extern UINT16 gzErrorCatchString[256];
