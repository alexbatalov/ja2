//===========================================================================

let gfErrorCatch: BOOLEAN = FALSE;
let gzErrorCatchString: UINT16[] /* [256] */ = "";
let giErrorCatchMessageBox: INT32 = 0;

const enum Enum50 {
  DIALOG_NONE,
  DIALOG_SAVE,
  DIALOG_LOAD,
  DIALOG_CANCEL,
  DIALOG_DELETE,
}

let iTotalFiles: INT32;
let iTopFileShown: INT32;
let iCurrFileShown: INT32;
let iLastFileClicked: INT32;
let iLastClickTime: INT32;

let gzFilename: UINT16[] /* [31] */;

let FileList: Pointer<FDLG_LIST> = NULL;

let iFDlgState: INT32 = DIALOG_NONE;
let gfDestroyFDlg: BOOLEAN = FALSE;
let iFileDlgButtons: INT32[] /* [7] */;

let gfLoadError: BOOLEAN;
let gfReadOnly: BOOLEAN;
let gfFileExists: BOOLEAN;
let gfIllegalName: BOOLEAN;
let gfDeleteFile: BOOLEAN;
let gfNoFiles: BOOLEAN;

let zOrigName: UINT16[] /* [60] */;
let FileInfo: GETFILESTRUCT;

let fEnteringLoadSaveScreen: BOOLEAN = TRUE;
let gfPassedSaveCheck: BOOLEAN = FALSE;

let BlanketRegion: MOUSE_REGION;

let gszCurrFilename: CHAR8[] /* [80] */;

const enum Enum51 {
  IOSTATUS_NONE,
  INITIATE_MAP_SAVE,
  SAVING_MAP,
  INITIATE_MAP_LOAD,
  LOADING_MAP,
}
let gbCurrentFileIOStatus: INT8; // 1 init saving message, 2 save, 3 init loading message, 4 load, 0 none

function LoadSaveScreenInit(): UINT32 {
  gfUpdateSummaryInfo = TRUE;
  fEnteringLoadSaveScreen = TRUE;
  return TRUE;
}

function LoadSaveScreenShutdown(): UINT32 {
  return TRUE;
}

function LoadSaveScreenEntry(): void {
  fEnteringLoadSaveScreen = FALSE;
  gbCurrentFileIOStatus = IOSTATUS_NONE;

  gfReadOnly = FALSE;
  gfFileExists = FALSE;
  gfLoadError = FALSE;
  gfIllegalName = FALSE;
  gfDeleteFile = FALSE;
  gfNoFiles = FALSE;

  // setup filename dialog box
  // (*.dat and *.map) as file filter

  // If user clicks on a filename in the window, then turn off string focus and re-init the string with the new name.
  // If user hits ENTER or presses OK, then continue with the file loading/saving

  if (FileList)
    TrashFDlgList(FileList);

  iTopFileShown = iTotalFiles = 0;
  if (GetFileFirst("MAPS\\*.dat", addressof(FileInfo))) {
    FileList = AddToFDlgList(FileList, addressof(FileInfo));
    iTotalFiles++;
    while (GetFileNext(addressof(FileInfo))) {
      FileList = AddToFDlgList(FileList, addressof(FileInfo));
      iTotalFiles++;
    }
    GetFileClose(addressof(FileInfo));
  }

  swprintf(zOrigName, "%s Map (*.dat)", iCurrentAction == ACTION_SAVE_MAP ? "Save" : "Load");

  swprintf(gzFilename, "%S", gubFilename);

  CreateFileDialog(zOrigName);

  if (!iTotalFiles) {
    gfNoFiles = TRUE;
    if (iCurrentAction == ACTION_LOAD_MAP)
      DisableButton(iFileDlgButtons[0]);
  }

  iLastFileClicked = -1;
  iLastClickTime = 0;
}

function ProcessLoadSaveScreenMessageBoxResult(): UINT32 {
  let curr: Pointer<FDLG_LIST>;
  let temp: Pointer<FDLG_LIST>;
  gfRenderWorld = TRUE;
  RemoveMessageBox();
  if (gfIllegalName) {
    fEnteringLoadSaveScreen = TRUE;
    RemoveFileDialog();
    MarkWorldDirty();
    return gfMessageBoxResult ? LOADSAVE_SCREEN : EDIT_SCREEN;
  }
  if (gfDeleteFile) {
    if (gfMessageBoxResult) {
      // delete file
      let x: INT32;
      curr = FileList;
      for (x = 0; x < iCurrFileShown && x < iTotalFiles && curr; x++) {
        curr = curr.value.pNext;
      }
      if (curr) {
        if (gfReadOnly) {
          FileClearAttributes(gszCurrFilename);
          gfReadOnly = FALSE;
        }
        FileDelete(gszCurrFilename);

        // File is deleted so redo the text fields so they show the
        // next file in the list.
        temp = curr.value.pNext;
        if (!temp)
          temp = curr.value.pPrev;
        if (!temp)
          wcscpy(gzFilename, "");
        else
          swprintf(gzFilename, "%S", temp.value.FileInfo.zFileName);
        if (ValidFilename()) {
          SetInputFieldStringWith16BitString(0, gzFilename);
        } else {
          SetInputFieldStringWith16BitString(0, "");
          wcscpy(gzFilename, "");
        }
        RemoveFromFDlgList(addressof(FileList), curr);
        iTotalFiles--;
        if (!iTotalFiles) {
          gfNoFiles = TRUE;
          if (iCurrentAction == ACTION_LOAD_MAP)
            DisableButton(iFileDlgButtons[0]);
        }
        if (iCurrFileShown >= iTotalFiles)
          iCurrFileShown--;
        if (iCurrFileShown < iTopFileShown)
          iTopFileShown -= 8;
        if (iTopFileShown < 0)
          iTopFileShown = 0;
      }
    }
    MarkWorldDirty();
    RenderWorld();
    gfDeleteFile = FALSE;
    iFDlgState = DIALOG_NONE;
    return LOADSAVE_SCREEN;
  }
  if (gfLoadError) {
    fEnteringLoadSaveScreen = TRUE;
    return gfMessageBoxResult ? LOADSAVE_SCREEN : EDIT_SCREEN;
  }
  if (gfReadOnly) {
    // file is readonly.  Result will determine if the file dialog stays up.
    fEnteringLoadSaveScreen = TRUE;
    RemoveFileDialog();
    return gfMessageBoxResult ? LOADSAVE_SCREEN : EDIT_SCREEN;
  }
  if (gfFileExists) {
    if (gfMessageBoxResult) {
      // okay to overwrite file
      RemoveFileDialog();
      gbCurrentFileIOStatus = INITIATE_MAP_SAVE;
      return LOADSAVE_SCREEN;
    }
    fEnteringLoadSaveScreen = TRUE;
    RemoveFileDialog();
    return EDIT_SCREEN;
  }
  Assert(0);
  return LOADSAVE_SCREEN;
}

function LoadSaveScreenHandle(): UINT32 {
  let FListNode: Pointer<FDLG_LIST>;
  let x: INT32;
  let DialogEvent: InputAtom;

  if (fEnteringLoadSaveScreen) {
    LoadSaveScreenEntry();
  }

  if (gbCurrentFileIOStatus) // loading or saving map
  {
    let uiScreen: UINT32;
    uiScreen = ProcessFileIO();
    if (uiScreen == EDIT_SCREEN && gbCurrentFileIOStatus == LOADING_MAP)
      RemoveProgressBar(0);
    return uiScreen;
  }

  if (gubMessageBoxStatus) {
    if (MessageBoxHandled())
      return ProcessLoadSaveScreenMessageBoxResult();
    return LOADSAVE_SCREEN;
  }

  // handle all key input.
  while (DequeueEvent(addressof(DialogEvent))) {
    if (!HandleTextInput(addressof(DialogEvent)) && (DialogEvent.usEvent == KEY_DOWN || DialogEvent.usEvent == KEY_REPEAT)) {
      HandleMainKeyEvents(addressof(DialogEvent));
    }
  }

  DrawFileDialog();

  // Skip to first filename to show
  FListNode = FileList;
  for (x = 0; x < iTopFileShown && x < iTotalFiles && FListNode != NULL; x++) {
    FListNode = FListNode.value.pNext;
  }

  // Show up to 8 filenames in the window
  SetFont(FONT12POINT1);
  if (gfNoFiles) {
    SetFontForeground(FONT_LTRED);
    SetFontBackground(142);
    mprintf(226, 126, "NO FILES IN \\MAPS DIRECTORY");
  } else
    for (x = iTopFileShown; x < (iTopFileShown + 8) && x < iTotalFiles && FListNode != NULL; x++) {
      if (!EditingText() && x == iCurrFileShown) {
        SetFontForeground(FONT_GRAY2);
        SetFontBackground(FONT_METALGRAY);
      } else {
        SetFontForeground(FONT_BLACK);
        SetFontBackground(142);
      }
      mprintf(186, (73 + (x - iTopFileShown) * 15), "%S", FListNode.value.FileInfo.zFileName);
      FListNode = FListNode.value.pNext;
    }

  RenderAllTextFields();

  InvalidateScreen();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  switch (iFDlgState) {
    case DIALOG_CANCEL:
      RemoveFileDialog();
      fEnteringLoadSaveScreen = TRUE;
      return EDIT_SCREEN;
    case DIALOG_DELETE:
      sprintf(gszCurrFilename, "MAPS\\%S", gzFilename);
      if (GetFileFirst(gszCurrFilename, addressof(FileInfo))) {
        let str: UINT16[] /* [40] */;
        if (FileInfo.uiFileAttribs & (FILE_IS_READONLY | FILE_IS_HIDDEN | FILE_IS_SYSTEM)) {
          swprintf(str, " Delete READ-ONLY file %s? ", gzFilename);
          gfReadOnly = TRUE;
        } else
          swprintf(str, " Delete file %s? ", gzFilename);
        gfDeleteFile = TRUE;
        CreateMessageBox(str);
      }
      return LOADSAVE_SCREEN;
    case DIALOG_SAVE:
      if (!ExtractFilenameFromFields()) {
        CreateMessageBox(" Illegal filename.  Try another filename? ");
        gfIllegalName = TRUE;
        iFDlgState = DIALOG_NONE;
        return LOADSAVE_SCREEN;
      }
      sprintf(gszCurrFilename, "MAPS\\%S", gzFilename);
      if (FileExists(gszCurrFilename)) {
        gfFileExists = TRUE;
        gfReadOnly = FALSE;
        if (GetFileFirst(gszCurrFilename, addressof(FileInfo))) {
          if (FileInfo.uiFileAttribs & (FILE_IS_READONLY | FILE_IS_DIRECTORY | FILE_IS_HIDDEN | FILE_IS_SYSTEM | FILE_IS_OFFLINE | FILE_IS_TEMPORARY))
            gfReadOnly = TRUE;
          GetFileClose(addressof(FileInfo));
        }
        if (gfReadOnly)
          CreateMessageBox(" File is read only!  Choose a different name? ");
        else
          CreateMessageBox(" File exists, Overwrite? ");
        return LOADSAVE_SCREEN;
      }
      RemoveFileDialog();
      gbCurrentFileIOStatus = INITIATE_MAP_SAVE;
      return LOADSAVE_SCREEN;
    case DIALOG_LOAD:
      if (!ExtractFilenameFromFields()) {
        CreateMessageBox(" Illegal filename.  Try another filename? ");
        gfIllegalName = TRUE;
        iFDlgState = DIALOG_NONE;
        return LOADSAVE_SCREEN;
      }
      RemoveFileDialog();
      CreateProgressBar(0, 118, 183, 522, 202);
      DefineProgressBarPanel(0, 65, 79, 94, 100, 155, 540, 235);
      swprintf(zOrigName, "Loading map:  %s", gzFilename);
      SetProgressBarTitle(0, zOrigName, BLOCKFONT2, FONT_RED, FONT_NEARBLACK);
      gbCurrentFileIOStatus = INITIATE_MAP_LOAD;
      return LOADSAVE_SCREEN;
    default:
      iFDlgState = DIALOG_NONE;
  }
  iFDlgState = DIALOG_NONE;
  return LOADSAVE_SCREEN;
}

function CreateFileDialog(zTitle: Pointer<UINT16>): void {
  iFDlgState = DIALOG_NONE;

  DisableEditorTaskbar();

  MSYS_DefineRegion(addressof(BlanketRegion), 0, 0, gsVIEWPORT_END_X, gsVIEWPORT_END_Y, MSYS_PRIORITY_HIGH - 5, 0, 0, 0);

  // Okay and cancel buttons
  iFileDlgButtons[0] = CreateTextButton("Okay", FONT12POINT1, FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 354, 225, 50, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, FDlgOkCallback);
  iFileDlgButtons[1] = CreateTextButton("Cancel", FONT12POINT1, FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 406, 225, 50, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, FDlgCancelCallback);

  // Scroll buttons
  iFileDlgButtons[2] = CreateSimpleButton(426, 92, "EDITOR//uparrow.sti", BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, FDlgUpCallback);
  iFileDlgButtons[3] = CreateSimpleButton(426, 182, "EDITOR//downarrow.sti", BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, FDlgDwnCallback);

  // File list window
  iFileDlgButtons[4] = CreateHotSpot((179 + 4), (69 + 3), (179 + 4 + 240), (69 + 120 + 3), MSYS_PRIORITY_HIGH - 1, BUTTON_NO_CALLBACK, FDlgNamesCallback);
  // Title button
  iFileDlgButtons[5] = CreateTextButton(zTitle, HUGEFONT, FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 179, 39, 281, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH - 2, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  DisableButton(iFileDlgButtons[5]);
  SpecifyDisabledButtonStyle(iFileDlgButtons[5], DISABLED_STYLE_NONE);

  iFileDlgButtons[6] = -1;
  if (iCurrentAction == ACTION_SAVE_MAP) {
    // checkboxes
    // The update world info checkbox
    iFileDlgButtons[6] = CreateCheckBoxButton(183, 229, "EDITOR//smcheckbox.sti", MSYS_PRIORITY_HIGH, UpdateWorldInfoCallback);
    if (gfUpdateSummaryInfo)
      ButtonList[iFileDlgButtons[6]].value.uiFlags |= BUTTON_CLICKED_ON;
  }

  // Add the text input fields
  InitTextInputModeWithScheme(DEFAULT_SCHEME);
  // field 1 (filename)
  AddTextInputField(/*233*/ 183, 195, 190, 20, MSYS_PRIORITY_HIGH, gzFilename, 30, INPUTTYPE_EXCLUSIVE_DOSFILENAME);
  // field 2 -- user field that allows mouse/key interaction with the filename list
  AddUserInputField(FileDialogModeCallback);
}

function UpdateWorldInfoCallback(b: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    gfUpdateSummaryInfo = b.value.uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
}

// This is a hook into the text input code.  This callback is called whenever the user is currently
// editing text, and presses Tab to transfer to the file dialog mode.  When this happens, we set the text
// field to the currently selected file in the list which is already know.
function FileDialogModeCallback(ubID: UINT8, fEntering: BOOLEAN): void {
  let x: INT32;
  let FListNode: Pointer<FDLG_LIST>;
  if (fEntering) {
    // Skip to first filename
    FListNode = FileList;
    for (x = 0; x < iTopFileShown && x < iTotalFiles && FListNode != NULL; x++) {
      FListNode = FListNode.value.pNext;
    }
    // Find the already selected filename
    for (x = iTopFileShown; x < iTopFileShown + 8 && x < iTotalFiles && FListNode != NULL; x++) {
      if (iCurrFileShown == (x - iTopFileShown)) {
        FListNode.value.FileInfo.zFileName[30] = 0;
        SetInputFieldStringWith8BitString(0, FListNode.value.FileInfo.zFileName);
        return;
      }
      FListNode = FListNode.value.pNext;
    }
  }
}

function RemoveFileDialog(): void {
  let x: INT32;

  MSYS_RemoveRegion(addressof(BlanketRegion));

  for (x = 0; x < 6; x++) {
    RemoveButton(iFileDlgButtons[x]);
  }

  if (iFileDlgButtons[6] != -1) {
    RemoveButton(iFileDlgButtons[6]);
  }

  TrashFDlgList(FileList);
  FileList = NULL;

  InvalidateScreen();

  EnableEditorTaskbar();
  KillTextInputMode();
  MarkWorldDirty();
  RenderWorld();
  EndFrameBufferRender();
}

function DrawFileDialog(): void {
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 179, 69, (179 + 281), 261, Get16BPPColor(FROMRGB(136, 138, 135)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 180, 70, (179 + 281), 261, Get16BPPColor(FROMRGB(24, 61, 81)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 180, 70, (179 + 280), 260, Get16BPPColor(FROMRGB(65, 79, 94)));

  ColorFillVideoSurfaceArea(FRAME_BUFFER, (179 + 4), (69 + 3), (179 + 4 + 240), (69 + 123), Get16BPPColor(FROMRGB(24, 61, 81)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, (179 + 5), (69 + 4), (179 + 4 + 240), (69 + 123), Get16BPPColor(FROMRGB(136, 138, 135)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, (179 + 5), (69 + 4), (179 + 3 + 240), (69 + 122), Get16BPPColor(FROMRGB(250, 240, 188)));

  MarkButtonsDirty();
  RenderButtons();
  RenderButtonsFastHelp();

  SetFont(FONT10ARIAL);
  SetFontForeground(FONT_LTKHAKI);
  SetFontShadow(FONT_DKKHAKI);
  SetFontBackground(FONT_BLACK);
  mprintf(183, 217, "Filename");

  if (iFileDlgButtons[6] != -1) {
    mprintf(200, 231, "Update world info");
  }
}

// The callback calls this function passing the relative y position of where
// the user clicked on the hot spot.
function SelectFileDialogYPos(usRelativeYPos: UINT16): void {
  let sSelName: INT16;
  let x: INT32;
  let FListNode: Pointer<FDLG_LIST>;

  sSelName = usRelativeYPos / 15;

  // This is a field in the text editmode, but clicked via mouse.
  SetActiveField(1);

  // Skip to first filename
  FListNode = FileList;
  for (x = 0; x < iTopFileShown && x < iTotalFiles && FListNode != NULL; x++) {
    FListNode = FListNode.value.pNext;
  }

  for (x = iTopFileShown; x < (iTopFileShown + 8) && x < iTotalFiles && FListNode != NULL; x++) {
    if (sSelName == (x - iTopFileShown)) {
      let iCurrClickTime: INT32;
      iCurrFileShown = x;
      FListNode.value.FileInfo.zFileName[30] = 0;
      swprintf(gzFilename, "%S", FListNode.value.FileInfo.zFileName);
      if (ValidFilename()) {
        SetInputFieldStringWith16BitString(0, gzFilename);
      } else {
        SetInputFieldStringWith16BitString(0, "");
        wcscpy(gzFilename, "");
      }

      RenderInactiveTextField(0);

      // Calculate and process any double clicking...
      iCurrClickTime = GetJA2Clock();
      if (iCurrClickTime - iLastClickTime < 400 && x == iLastFileClicked) {
        // Considered a double click, so activate load/save this filename.
        gfDestroyFDlg = TRUE;
        iFDlgState = iCurrentAction == ACTION_SAVE_MAP ? DIALOG_SAVE : DIALOG_LOAD;
      }
      iLastClickTime = iCurrClickTime;
      iLastFileClicked = x;
    }
    FListNode = FListNode.value.pNext;
  }
}

function AddToFDlgList(pList: Pointer<FDLG_LIST>, pInfo: Pointer<GETFILESTRUCT>): Pointer<FDLG_LIST> {
  let pNode: Pointer<FDLG_LIST>;

  // Add to start of list
  if (pList == NULL) {
    pNode = MemAlloc(sizeof(FDLG_LIST));
    pNode.value.FileInfo = pInfo.value;
    pNode.value.pPrev = pNode.value.pNext = NULL;
    return pNode;
  }

  // Add and sort alphabetically without regard to case -- function limited to 10 chars comparison
  if (stricmp(pList.value.FileInfo.zFileName, pInfo.value.zFileName) > 0) {
    // pInfo is smaller than pList (i.e. Insert before)
    pNode = MemAlloc(sizeof(FDLG_LIST));
    pNode.value.FileInfo = pInfo.value;
    pNode.value.pNext = pList;
    pNode.value.pPrev = pList.value.pPrev;
    pList.value.pPrev = pNode;
    return pNode;
  } else {
    pList.value.pNext = AddToFDlgList(pList.value.pNext, pInfo);
    pList.value.pNext.value.pPrev = pList;
  }
  return pList;
}

function RemoveFromFDlgList(head: Pointer<Pointer<FDLG_LIST>>, node: Pointer<FDLG_LIST>): BOOLEAN {
  let curr: Pointer<FDLG_LIST>;
  curr = head.value;
  while (curr) {
    if (curr == node) {
      if (head.value == node)
        head.value = (head.value).value.pNext;
      if (curr.value.pPrev)
        curr.value.pPrev.value.pNext = curr.value.pNext;
      if (curr.value.pNext)
        curr.value.pNext.value.pPrev = curr.value.pPrev;
      MemFree(node);
      node = NULL;
      return TRUE;
    }
    curr = curr.value.pNext;
  }
  return FALSE; // wasn't deleted
}

function TrashFDlgList(pList: Pointer<FDLG_LIST>): void {
  let pNode: Pointer<FDLG_LIST>;

  while (pList != NULL) {
    pNode = pList;
    pList = pList.value.pNext;
    MemFree(pNode);
  }
}

function SetTopFileToLetter(usLetter: UINT16): void {
  let x: UINT32;
  let curr: Pointer<FDLG_LIST>;
  let prev: Pointer<FDLG_LIST>;
  let usNodeLetter: UINT16;

  // Skip to first filename
  x = 0;
  curr = prev = FileList;
  while (curr) {
    usNodeLetter = curr.value.FileInfo.zFileName[0]; // first letter of filename.
    if (usNodeLetter < 'a')
      usNodeLetter += 32; // convert uppercase to lower case A=65, a=97
    if (usLetter <= usNodeLetter)
      break;
    prev = curr;
    curr = curr.value.pNext;
    x++;
  }
  if (FileList) {
    iCurrFileShown = x;
    iTopFileShown = x;
    if (iTopFileShown > iTotalFiles - 7)
      iTopFileShown = iTotalFiles - 7;
    SetInputFieldStringWith8BitString(0, prev.value.FileInfo.zFileName);
  }
}

function HandleMainKeyEvents(pEvent: Pointer<InputAtom>): void {
  let iPrevFileShown: INT32 = iCurrFileShown;
  // Replace Alt-x press with ESC.
  if (pEvent.value.usKeyState & ALT_DOWN && pEvent.value.usParam == 'x')
    pEvent.value.usParam = ESC;
  switch (pEvent.value.usParam) {
    case ENTER:
      if (gfNoFiles && iCurrentAction == ACTION_LOAD_MAP)
        break;
      gfDestroyFDlg = TRUE;
      iFDlgState = iCurrentAction == ACTION_SAVE_MAP ? DIALOG_SAVE : DIALOG_LOAD;
      break;
    case ESC:
      gfDestroyFDlg = TRUE;
      iFDlgState = DIALOG_CANCEL;
      break;
    case PGUP:
      if (iTopFileShown > 7) {
        iTopFileShown -= 7;
        iCurrFileShown -= 7;
      } else {
        iTopFileShown = 0;
        iCurrFileShown = 0;
      }
      break;
    case PGDN:
      iTopFileShown += 7;
      iCurrFileShown += 7;
      if (iTopFileShown > iTotalFiles - 7)
        iTopFileShown = iTotalFiles - 7;
      if (iCurrFileShown >= iTotalFiles)
        iCurrFileShown = iTotalFiles - 1;
      break;
    case UPARROW:
      if (iCurrFileShown > 0)
        iCurrFileShown--;
      if (iTopFileShown > iCurrFileShown)
        iTopFileShown = iCurrFileShown;
      break;
    case DNARROW:
      iCurrFileShown++;
      if (iCurrFileShown >= iTotalFiles)
        iCurrFileShown = iTotalFiles - 1;
      else if (iTopFileShown < iCurrFileShown - 7)
        iTopFileShown++;
      break;
    case HOME:
    case CTRL_HOME:
      iTopFileShown = 0;
      iCurrFileShown = 0;
      break;
    case END:
    case CTRL_END:
      iTopFileShown = iTotalFiles - 7;
      iCurrFileShown = iTotalFiles - 1;
      break;
    case DEL:
      iFDlgState = DIALOG_DELETE;
      break;
    default:
      // This case handles jumping the file list to display the file with the letter pressed.
      if (pEvent.value.usParam >= 'a' && pEvent.value.usParam <= 'z' || pEvent.value.usParam >= 'A' && pEvent.value.usParam <= 'Z') {
        if (pEvent.value.usParam >= 'A' && pEvent.value.usParam <= 'Z') // convert upper case to lower case
          pEvent.value.usParam += 32; // A = 65, a = 97 (difference of 32)
        SetTopFileToLetter(pEvent.value.usParam);
      }
      break;
  }
  // Update the text field if the file value has changed.
  if (iCurrFileShown != iPrevFileShown) {
    let x: INT32;
    let curr: Pointer<FDLG_LIST>;
    x = 0;
    curr = FileList;
    while (curr && x != iCurrFileShown) {
      curr = curr.value.pNext;
      x++;
    }
    if (curr) {
      SetInputFieldStringWith8BitString(0, curr.value.FileInfo.zFileName);
      swprintf(gzFilename, "%S", curr.value.FileInfo.zFileName);
    }
  }
}

// editor doesn't care about the z value.  It uses it's own methods.
function SetGlobalSectorValues(szFilename: Pointer<UINT16>): void {
  let pStr: Pointer<UINT16>;
  if (ValidCoordinate()) {
    // convert the coordinate string into into the actual global sector coordinates.
    if (gzFilename[0] >= 'A' && gzFilename[0] <= 'P')
      gWorldSectorY = gzFilename[0] - 'A' + 1;
    else
      gWorldSectorY = gzFilename[0] - 'a' + 1;
    if (gzFilename[1] == '1' && gzFilename[2] >= '0' && gzFilename[2] <= '6')
      gWorldSectorX = (gzFilename[1] - 0x30) * 10 + (gzFilename[2] - 0x30);
    else
      gWorldSectorX = (gzFilename[1] - 0x30);
    pStr = wcsstr(gzFilename, "_b");
    if (pStr) {
      if (pStr[2] >= '1' && pStr[2] <= '3') {
        gbWorldSectorZ = (pStr[2] - 0x30);
      }
    }
  } else {
    gWorldSectorX = -1;
    gWorldSectorY = -1;
    gbWorldSectorZ = 0;
  }
}

function InitErrorCatchDialog(): void {
  let CenteringRect: SGPRect = [ 0, 0, 639, 479 ];

  // do message box and return
  giErrorCatchMessageBox = DoMessageBox(MSG_BOX_BASIC_STYLE, gzErrorCatchString, EDIT_SCREEN, MSG_BOX_FLAG_OK, NULL, addressof(CenteringRect));
  gfErrorCatch = FALSE;
}

// Because loading and saving the map takes a few seconds, we want to post a message
// on the screen and then update it which requires passing the screen back to the main loop.
// When we come back for the next frame, we then actually save or load the map.  So this
// process takes two full screen cycles.
function ProcessFileIO(): UINT32 {
  let usStartX: INT16;
  let usStartY: INT16;
  let ubNewFilename: UINT8[] /* [50] */;
  switch (gbCurrentFileIOStatus) {
    case INITIATE_MAP_SAVE: // draw save message
      StartFrameBufferRender();
      SaveFontSettings();
      SetFont(HUGEFONT);
      SetFontForeground(FONT_LTKHAKI);
      SetFontShadow(FONT_DKKHAKI);
      SetFontBackground(0);
      swprintf(zOrigName, "Saving map:  %s", gzFilename);
      usStartX = 320 - StringPixLength(zOrigName, LARGEFONT1) / 2;
      usStartY = 180 - GetFontHeight(LARGEFONT1) / 2;
      mprintf(usStartX, usStartY, zOrigName);

      InvalidateScreen();
      EndFrameBufferRender();
      gbCurrentFileIOStatus = SAVING_MAP;
      return LOADSAVE_SCREEN;
    case SAVING_MAP: // save map
      sprintf(ubNewFilename, "%S", gzFilename);
      RaiseWorldLand();
      if (gfShowPits)
        RemoveAllPits();
      OptimizeSchedules();
      if (!SaveWorld(ubNewFilename)) {
        if (gfErrorCatch) {
          InitErrorCatchDialog();
          return EDIT_SCREEN;
        }
        return ERROR_SCREEN;
      }
      if (gfShowPits)
        AddAllPits();

      SetGlobalSectorValues(gzFilename);

      if (gfGlobalSummaryExists)
        UpdateSectorSummary(gzFilename, gfUpdateSummaryInfo);

      iCurrentAction = ACTION_NULL;
      gbCurrentFileIOStatus = IOSTATUS_NONE;
      gfRenderWorld = TRUE;
      gfRenderTaskbar = TRUE;
      fEnteringLoadSaveScreen = TRUE;
      RestoreFontSettings();
      if (gfErrorCatch) {
        InitErrorCatchDialog();
        return EDIT_SCREEN;
      }
      if (gMapInformation.ubMapVersion != gubMinorMapVersion)
        ScreenMsg(FONT_MCOLOR_RED, MSG_ERROR, "Map data has just been corrupted!!!  What did you just do?  KM : 0");
      return EDIT_SCREEN;
    case INITIATE_MAP_LOAD: // draw load message
      SaveFontSettings();
      gbCurrentFileIOStatus = LOADING_MAP;
      if (gfEditMode && iCurrentTaskbar == TASK_MERCS)
        IndicateSelectedMerc(SELECT_NO_MERC);
      SpecifyItemToEdit(NULL, -1);
      return LOADSAVE_SCREEN;
    case LOADING_MAP: // load map
      DisableUndo();
      sprintf(ubNewFilename, "%S", gzFilename);

      RemoveMercsInSector();

      if (!LoadWorld(ubNewFilename)) {
        // Want to override crash, so user can do something else.
        EnableUndo();
        SetPendingNewScreen(LOADSAVE_SCREEN);
        gbCurrentFileIOStatus = IOSTATUS_NONE;
        gfGlobalError = FALSE;
        gfLoadError = TRUE;
        // RemoveButton( iTempButton );
        CreateMessageBox(" Error loading file.  Try another filename?");
        return LOADSAVE_SCREEN;
      }
      SetGlobalSectorValues(gzFilename);

      RestoreFontSettings();

      // Load successful, update necessary information.

      // ATE: Any current mercs are transfered here...
      // UpdateMercsInSector( gWorldSectorX, gWorldSectorY, gbWorldSectorZ );

      AddSoldierInitListTeamToWorld(ENEMY_TEAM, 255);
      AddSoldierInitListTeamToWorld(CREATURE_TEAM, 255);
      AddSoldierInitListTeamToWorld(MILITIA_TEAM, 255);
      AddSoldierInitListTeamToWorld(CIV_TEAM, 255);
      iCurrentAction = ACTION_NULL;
      gbCurrentFileIOStatus = IOSTATUS_NONE;
      if (!gfCaves && !gfBasement) {
        gusLightLevel = 12;
        if (ubAmbientLightLevel != 4) {
          ubAmbientLightLevel = 4;
          LightSetBaseLevel(ubAmbientLightLevel);
        }
      } else
        gusLightLevel = (EDITOR_LIGHT_MAX - ubAmbientLightLevel);
      gEditorLightColor = gpLightColors[0];
      gfRenderWorld = TRUE;
      gfRenderTaskbar = TRUE;
      fEnteringLoadSaveScreen = TRUE;
      InitJA2SelectionWindow();
      ShowEntryPoints();
      EnableUndo();
      RemoveAllFromUndoList();
      SetEditorSmoothingMode(gMapInformation.ubEditorSmoothingType);
      if (gMapInformation.ubEditorSmoothingType == SMOOTHING_CAVES)
        AnalyseCaveMapForStructureInfo();

      AddLockedDoorCursors();
      gubCurrRoomNumber = gubMaxRoomNumber;
      UpdateRoofsView();
      UpdateWallsView();
      ShowLightPositionHandles();
      SetMercTeamVisibility(ENEMY_TEAM, gfShowEnemies);
      SetMercTeamVisibility(CREATURE_TEAM, gfShowCreatures);
      SetMercTeamVisibility(MILITIA_TEAM, gfShowRebels);
      SetMercTeamVisibility(CIV_TEAM, gfShowCivilians);
      BuildItemPoolList();
      if (gfShowPits)
        AddAllPits();

      if (iCurrentTaskbar == TASK_MAPINFO) {
        // We have to temporarily remove the current textinput mode,
        // update the disabled text field values, then restore the current
        // text input fields.
        SaveAndRemoveCurrentTextInputMode();
        UpdateMapInfoFields();
        RestoreSavedTextInputMode();
      }
      return EDIT_SCREEN;
  }
  gbCurrentFileIOStatus = IOSTATUS_NONE;
  return LOADSAVE_SCREEN;
}

// LOADSCREEN
function FDlgNamesCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    SelectFileDialogYPos(butn.value.Area.RelativeYPos);
  }
}

function FDlgOkCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    gfDestroyFDlg = TRUE;
    iFDlgState = iCurrentAction == ACTION_SAVE_MAP ? DIALOG_SAVE : DIALOG_LOAD;
  }
}

function FDlgCancelCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    gfDestroyFDlg = TRUE;
    iFDlgState = DIALOG_CANCEL;
  }
}

function FDlgUpCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if (iTopFileShown > 0)
      iTopFileShown--;
  }
}

function FDlgDwnCallback(butn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if ((iTopFileShown + 7) < iTotalFiles)
      iTopFileShown++;
  }
}

function ExtractFilenameFromFields(): BOOLEAN {
  Get16BitStringFromField(0, gzFilename);
  return ValidFilename();
}

function ValidCoordinate(): BOOLEAN {
  if (gzFilename[0] >= 'A' && gzFilename[0] <= 'P' || gzFilename[0] >= 'a' && gzFilename[0] <= 'p') {
    let usTotal: UINT16;
    if (gzFilename[1] == '1' && gzFilename[2] >= '0' && gzFilename[2] <= '6') {
      usTotal = (gzFilename[1] - 0x30) * 10 + (gzFilename[2] - 0x30);
    } else if (gzFilename[1] >= '1' && gzFilename[1] <= '9') {
      if (gzFilename[2] < '0' || gzFilename[2] > '9') {
        usTotal = (gzFilename[1] - 0x30);
      } else {
        return FALSE;
      }
    }
    if (usTotal >= 1 && usTotal <= 16) {
      return TRUE;
    }
  }
  return FALSE;
}

function ValidFilename(): BOOLEAN {
  let pDest: Pointer<UINT16>;
  if (gzFilename[0] != '\0')
    ;
  {
    pDest = wcsstr(gzFilename, ".dat");
    if (!pDest)
      pDest = wcsstr(gzFilename, ".DAT");
    if (pDest && pDest != gzFilename && pDest[4] == '\0')
      return TRUE;
  }
  return FALSE;
}

function ExternalLoadMap(szFilename: Pointer<UINT16>): BOOLEAN {
  Assert(szFilename);
  if (!wcslen(szFilename))
    return FALSE;
  wcscpy(gzFilename, szFilename);
  if (!ValidFilename())
    return FALSE;
  gbCurrentFileIOStatus = INITIATE_MAP_LOAD;
  ProcessFileIO(); // always returns loadsave_screen and changes iostatus to loading_map.
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  RefreshScreen(NULL);
  if (ProcessFileIO() == EDIT_SCREEN)
    return TRUE;
  return FALSE;
}

function ExternalSaveMap(szFilename: Pointer<UINT16>): BOOLEAN {
  Assert(szFilename);
  if (!wcslen(szFilename))
    return FALSE;
  wcscpy(gzFilename, szFilename);
  if (!ValidFilename())
    return FALSE;
  gbCurrentFileIOStatus = INITIATE_MAP_SAVE;
  if (ProcessFileIO() == ERROR_SCREEN)
    return FALSE;
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  RefreshScreen(NULL);
  if (ProcessFileIO() == EDIT_SCREEN)
    return TRUE;
  return FALSE;
}
