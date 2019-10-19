interface FDLG_LIST {
  FileInfo: GETFILESTRUCT;
  pNext: Pointer<FDLG_LIST>;
  pPrev: Pointer<FDLG_LIST>;
}

extern FDLG_LIST *AddToFDlgList(FDLG_LIST *pList, GETFILESTRUCT *pInfo);

extern void TrashFDlgList(FDLG_LIST *pList);

extern INT32 iFDlgState;
extern INT32 iFDlgSelectedSlot;

extern BOOLEAN gfAskForName;
extern BOOLEAN gfCreatedFDlg;
extern BOOLEAN gfDestroyFDlg;

UINT32 WaitForFileName(void);
void RemoveFileDialog(void);
void CreateFileDialog(UINT16 *zTitle);

void SelectFileDialogYPos(UINT16 usRelativeYPos);

void BuildFilenameWithCoordinate();
void BuildCoordinateWithFilename();
BOOLEAN ExtractFilenameFromFields();
BOOLEAN ValidCoordinate();
BOOLEAN ValidFilename();

BOOLEAN ExternalLoadMap(UINT16 *szFilename);
BOOLEAN ExternalSaveMap(UINT16 *szFilename);

extern BOOLEAN gfErrorCatch;
extern UINT16 gzErrorCatchString[256];
