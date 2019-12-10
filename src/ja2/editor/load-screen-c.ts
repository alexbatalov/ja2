namespace ja2 {

const fs: typeof import('fs') = require('fs');
const path: typeof import('path') = require('path');

//===========================================================================

export let gfErrorCatch: boolean = false;
export let gzErrorCatchString: string /* UINT16[256] */ = "";
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

let gzFilename: string /* UINT16[31] */;

let FileList: FDLG_LIST | null /* Pointer<FDLG_LIST> */ = null;

let iFDlgState: INT32 = Enum50.DIALOG_NONE;
let gfDestroyFDlg: boolean = false;
let iFileDlgButtons: INT32[] /* [7] */ = createArray(7, 0);

let gfLoadError: boolean;
let gfReadOnly: boolean;
let gfFileExists: boolean;
let gfIllegalName: boolean;
let gfDeleteFile: boolean;
let gfNoFiles: boolean;

let zOrigName: string /* UINT16[60] */;
let FileInfo: GETFILESTRUCT = createGetFileStruct();

let fEnteringLoadSaveScreen: boolean = true;
let gfPassedSaveCheck: boolean = false;

let BlanketRegion: MOUSE_REGION = createMouseRegion();

let gszCurrFilename: string /* CHAR8[80] */;

const enum Enum51 {
  IOSTATUS_NONE,
  INITIATE_MAP_SAVE,
  SAVING_MAP,
  INITIATE_MAP_LOAD,
  LOADING_MAP,
}
let gbCurrentFileIOStatus: INT8; // 1 init saving message, 2 save, 3 init loading message, 4 load, 0 none

export function LoadSaveScreenInit(): boolean {
  gfUpdateSummaryInfo = true;
  fEnteringLoadSaveScreen = true;
  return true;
}

export function LoadSaveScreenShutdown(): boolean {
  return true;
}

function LoadSaveScreenEntry(): void {
  fEnteringLoadSaveScreen = false;
  gbCurrentFileIOStatus = Enum51.IOSTATUS_NONE;

  gfReadOnly = false;
  gfFileExists = false;
  gfLoadError = false;
  gfIllegalName = false;
  gfDeleteFile = false;
  gfNoFiles = false;

  // setup filename dialog box
  // (*.dat and *.map) as file filter

  // If user clicks on a filename in the window, then turn off string focus and re-init the string with the new name.
  // If user hits ENTER or presses OK, then continue with the file loading/saving

  if (FileList)
    TrashFDlgList(FileList);

  iTopFileShown = iTotalFiles = 0;
  for (const fileName of fs.readdirSync('MAPS')) {
    FileInfo.zFileName = path.join('MAPS', fileName);
    FileList = AddToFDlgList(FileList, FileInfo);
    iTotalFiles++;
  }

  zOrigName = swprintf("%s Map (*.dat)", iCurrentAction == Enum37.ACTION_SAVE_MAP ? "Save" : "Load");

  gzFilename = swprintf("%S", gubFilename);

  CreateFileDialog(zOrigName);

  if (!iTotalFiles) {
    gfNoFiles = true;
    if (iCurrentAction == Enum37.ACTION_LOAD_MAP)
      DisableButton(iFileDlgButtons[0]);
  }

  iLastFileClicked = -1;
  iLastClickTime = 0;
}

function ProcessLoadSaveScreenMessageBoxResult(): UINT32 {
  let temp: FDLG_LIST | null;
  let curr: FDLG_LIST | null;
  gfRenderWorld = true;
  RemoveMessageBox();
  if (gfIllegalName) {
    fEnteringLoadSaveScreen = true;
    RemoveFileDialog();
    MarkWorldDirty();
    return gfMessageBoxResult ? Enum26.LOADSAVE_SCREEN : Enum26.EDIT_SCREEN;
  }
  if (gfDeleteFile) {
    if (gfMessageBoxResult) {
      // delete file
      let x: INT32;
      curr = FileList;
      for (x = 0; x < iCurrFileShown && x < iTotalFiles && curr; x++) {
        curr = curr.pNext;
      }
      if (curr) {
        if (gfReadOnly) {
          FileClearAttributes(gszCurrFilename);
          gfReadOnly = false;
        }
        FileDelete(gszCurrFilename);

        // File is deleted so redo the text fields so they show the
        // next file in the list.
        temp = curr.pNext;
        if (!temp)
          temp = curr.pPrev;
        if (!temp)
          gzFilename = "";
        else
          gzFilename = swprintf("%S", temp.FileInfo.zFileName);
        if (ValidFilename()) {
          SetInputFieldStringWith16BitString(0, gzFilename);
        } else {
          SetInputFieldStringWith16BitString(0, "");
          gzFilename = "";
        }
        RemoveFromFDlgList(createPointer(() => FileList, (v) => FileList = v), curr);
        iTotalFiles--;
        if (!iTotalFiles) {
          gfNoFiles = true;
          if (iCurrentAction == Enum37.ACTION_LOAD_MAP)
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
    gfDeleteFile = false;
    iFDlgState = Enum50.DIALOG_NONE;
    return Enum26.LOADSAVE_SCREEN;
  }
  if (gfLoadError) {
    fEnteringLoadSaveScreen = true;
    return gfMessageBoxResult ? Enum26.LOADSAVE_SCREEN : Enum26.EDIT_SCREEN;
  }
  if (gfReadOnly) {
    // file is readonly.  Result will determine if the file dialog stays up.
    fEnteringLoadSaveScreen = true;
    RemoveFileDialog();
    return gfMessageBoxResult ? Enum26.LOADSAVE_SCREEN : Enum26.EDIT_SCREEN;
  }
  if (gfFileExists) {
    if (gfMessageBoxResult) {
      // okay to overwrite file
      RemoveFileDialog();
      gbCurrentFileIOStatus = Enum51.INITIATE_MAP_SAVE;
      return Enum26.LOADSAVE_SCREEN;
    }
    fEnteringLoadSaveScreen = true;
    RemoveFileDialog();
    return Enum26.EDIT_SCREEN;
  }
  Assert(0);
  return Enum26.LOADSAVE_SCREEN;
}

export function LoadSaveScreenHandle(): UINT32 {
  let FListNode: FDLG_LIST | null;
  let x: INT32;
  let DialogEvent: InputAtom = createInputAtom();

  if (fEnteringLoadSaveScreen) {
    LoadSaveScreenEntry();
  }

  if (gbCurrentFileIOStatus) // loading or saving map
  {
    let uiScreen: UINT32;
    uiScreen = ProcessFileIO();
    if (uiScreen == Enum26.EDIT_SCREEN && gbCurrentFileIOStatus == Enum51.LOADING_MAP)
      RemoveProgressBar(0);
    return uiScreen;
  }

  if (gubMessageBoxStatus) {
    if (MessageBoxHandled())
      return ProcessLoadSaveScreenMessageBoxResult();
    return Enum26.LOADSAVE_SCREEN;
  }

  // handle all key input.
  while (DequeueEvent(DialogEvent)) {
    if (!HandleTextInput(DialogEvent) && (DialogEvent.usEvent == KEY_DOWN || DialogEvent.usEvent == KEY_REPEAT)) {
      HandleMainKeyEvents(DialogEvent);
    }
  }

  DrawFileDialog();

  // Skip to first filename to show
  FListNode = FileList;
  for (x = 0; x < iTopFileShown && x < iTotalFiles && FListNode != null; x++) {
    FListNode = FListNode.pNext;
  }

  // Show up to 8 filenames in the window
  SetFont(FONT12POINT1());
  if (gfNoFiles) {
    SetFontForeground(FONT_LTRED);
    SetFontBackground(142);
    mprintf(226, 126, "NO FILES IN \\MAPS DIRECTORY");
  } else
    for (x = iTopFileShown; x < (iTopFileShown + 8) && x < iTotalFiles && FListNode != null; x++) {
      if (!EditingText() && x == iCurrFileShown) {
        SetFontForeground(FONT_GRAY2);
        SetFontBackground(FONT_METALGRAY);
      } else {
        SetFontForeground(FONT_BLACK);
        SetFontBackground(142);
      }
      mprintf(186, (73 + (x - iTopFileShown) * 15), "%S", FListNode.FileInfo.zFileName);
      FListNode = FListNode.pNext;
    }

  RenderAllTextFields();

  InvalidateScreen();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  switch (iFDlgState) {
    case Enum50.DIALOG_CANCEL:
      RemoveFileDialog();
      fEnteringLoadSaveScreen = true;
      return Enum26.EDIT_SCREEN;
    case Enum50.DIALOG_DELETE:
      gszCurrFilename = path.join('MAPS', gzFilename);
      {
        let str: string /* UINT16[40] */;
        str = swprintf(" Delete file %s? ", gzFilename);
        gfDeleteFile = true;
        CreateMessageBox(str);
      }
      return Enum26.LOADSAVE_SCREEN;
    case Enum50.DIALOG_SAVE:
      if (!ExtractFilenameFromFields()) {
        CreateMessageBox(" Illegal filename.  Try another filename? ");
        gfIllegalName = true;
        iFDlgState = Enum50.DIALOG_NONE;
        return Enum26.LOADSAVE_SCREEN;
      }
      gszCurrFilename = path.join('MAPS', gzFilename);
      if (FileExists(gszCurrFilename)) {
        gfFileExists = true;
        gfReadOnly = false;
        if (gfReadOnly)
          CreateMessageBox(" File is read only!  Choose a different name? ");
        else
          CreateMessageBox(" File exists, Overwrite? ");
        return Enum26.LOADSAVE_SCREEN;
      }
      RemoveFileDialog();
      gbCurrentFileIOStatus = Enum51.INITIATE_MAP_SAVE;
      return Enum26.LOADSAVE_SCREEN;
    case Enum50.DIALOG_LOAD:
      if (!ExtractFilenameFromFields()) {
        CreateMessageBox(" Illegal filename.  Try another filename? ");
        gfIllegalName = true;
        iFDlgState = Enum50.DIALOG_NONE;
        return Enum26.LOADSAVE_SCREEN;
      }
      RemoveFileDialog();
      CreateProgressBar(0, 118, 183, 522, 202);
      DefineProgressBarPanel(0, 65, 79, 94, 100, 155, 540, 235);
      zOrigName = swprintf("Loading map:  %s", gzFilename);
      SetProgressBarTitle(0, zOrigName, BLOCKFONT2(), FONT_RED, FONT_NEARBLACK);
      gbCurrentFileIOStatus = Enum51.INITIATE_MAP_LOAD;
      return Enum26.LOADSAVE_SCREEN;
    default:
      iFDlgState = Enum50.DIALOG_NONE;
  }
  iFDlgState = Enum50.DIALOG_NONE;
  return Enum26.LOADSAVE_SCREEN;
}

function CreateFileDialog(zTitle: string /* Pointer<UINT16> */): void {
  iFDlgState = Enum50.DIALOG_NONE;

  DisableEditorTaskbar();

  MSYS_DefineRegion(BlanketRegion, 0, 0, gsVIEWPORT_END_X, gsVIEWPORT_END_Y, MSYS_PRIORITY_HIGH - 5, 0, null, null);

  // Okay and cancel buttons
  iFileDlgButtons[0] = CreateTextButton("Okay", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 354, 225, 50, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), FDlgOkCallback);
  iFileDlgButtons[1] = CreateTextButton("Cancel", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 406, 225, 50, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), FDlgCancelCallback);

  // Scroll buttons
  iFileDlgButtons[2] = CreateSimpleButton(426, 92, "EDITOR//uparrow.sti", BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, FDlgUpCallback);
  iFileDlgButtons[3] = CreateSimpleButton(426, 182, "EDITOR//downarrow.sti", BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, FDlgDwnCallback);

  // File list window
  iFileDlgButtons[4] = CreateHotSpot((179 + 4), (69 + 3), (179 + 4 + 240), (69 + 120 + 3), MSYS_PRIORITY_HIGH - 1, BUTTON_NO_CALLBACK, FDlgNamesCallback);
  // Title button
  iFileDlgButtons[5] = CreateTextButton(zTitle, HUGEFONT(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 179, 39, 281, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH - 2, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  DisableButton(iFileDlgButtons[5]);
  SpecifyDisabledButtonStyle(iFileDlgButtons[5], Enum29.DISABLED_STYLE_NONE);

  iFileDlgButtons[6] = -1;
  if (iCurrentAction == Enum37.ACTION_SAVE_MAP) {
    // checkboxes
    // The update world info checkbox
    iFileDlgButtons[6] = CreateCheckBoxButton(183, 229, "EDITOR//smcheckbox.sti", MSYS_PRIORITY_HIGH, UpdateWorldInfoCallback);
    if (gfUpdateSummaryInfo)
      ButtonList[iFileDlgButtons[6]].uiFlags |= BUTTON_CLICKED_ON;
  }

  // Add the text input fields
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);
  // field 1 (filename)
  AddTextInputField(/*233*/ 183, 195, 190, 20, MSYS_PRIORITY_HIGH, gzFilename, 30, Enum383.INPUTTYPE_EXCLUSIVE_DOSFILENAME);
  // field 2 -- user field that allows mouse/key interaction with the filename list
  AddUserInputField(FileDialogModeCallback);
}

function UpdateWorldInfoCallback(b: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    gfUpdateSummaryInfo = b.uiFlags & BUTTON_CLICKED_ON ? true : false;
}

// This is a hook into the text input code.  This callback is called whenever the user is currently
// editing text, and presses Tab to transfer to the file dialog mode.  When this happens, we set the text
// field to the currently selected file in the list which is already know.
function FileDialogModeCallback(ubID: UINT8, fEntering: boolean): void {
  let x: INT32;
  let FListNode: FDLG_LIST | null;
  if (fEntering) {
    // Skip to first filename
    FListNode = FileList;
    for (x = 0; x < iTopFileShown && x < iTotalFiles && FListNode != null; x++) {
      FListNode = FListNode.pNext;
    }
    // Find the already selected filename
    for (x = iTopFileShown; x < iTopFileShown + 8 && x < iTotalFiles && FListNode != null; x++) {
      if (iCurrFileShown == (x - iTopFileShown)) {
        FListNode.FileInfo.zFileName = FListNode.FileInfo.zFileName.substring(0, 30);
        SetInputFieldStringWith8BitString(0, FListNode.FileInfo.zFileName);
        return;
      }
      FListNode = FListNode.pNext;
    }
  }
}

function RemoveFileDialog(): void {
  let x: INT32;

  MSYS_RemoveRegion(BlanketRegion);

  for (x = 0; x < 6; x++) {
    RemoveButton(iFileDlgButtons[x]);
  }

  if (iFileDlgButtons[6] != -1) {
    RemoveButton(iFileDlgButtons[6]);
  }

  TrashFDlgList(FileList);
  FileList = null;

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

  SetFont(FONT10ARIAL());
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
  let FListNode: FDLG_LIST | null;

  sSelName = usRelativeYPos / 15;

  // This is a field in the text editmode, but clicked via mouse.
  SetActiveField(1);

  // Skip to first filename
  FListNode = FileList;
  for (x = 0; x < iTopFileShown && x < iTotalFiles && FListNode != null; x++) {
    FListNode = FListNode.pNext;
  }

  for (x = iTopFileShown; x < (iTopFileShown + 8) && x < iTotalFiles && FListNode != null; x++) {
    if (sSelName == (x - iTopFileShown)) {
      let iCurrClickTime: INT32;
      iCurrFileShown = x;
      FListNode.FileInfo.zFileName = FListNode.FileInfo.zFileName.substring(0, 30);
      gzFilename = swprintf("%S", FListNode.FileInfo.zFileName);
      if (ValidFilename()) {
        SetInputFieldStringWith16BitString(0, gzFilename);
      } else {
        SetInputFieldStringWith16BitString(0, "");
        gzFilename = "";
      }

      RenderInactiveTextField(0);

      // Calculate and process any double clicking...
      iCurrClickTime = GetJA2Clock();
      if (iCurrClickTime - iLastClickTime < 400 && x == iLastFileClicked) {
        // Considered a double click, so activate load/save this filename.
        gfDestroyFDlg = true;
        iFDlgState = iCurrentAction == Enum37.ACTION_SAVE_MAP ? Enum50.DIALOG_SAVE : Enum50.DIALOG_LOAD;
      }
      iLastClickTime = iCurrClickTime;
      iLastFileClicked = x;
    }
    FListNode = FListNode.pNext;
  }
}

export function AddToFDlgList(pList: FDLG_LIST | null, pInfo: GETFILESTRUCT): FDLG_LIST {
  let pNode: FDLG_LIST;

  // Add to start of list
  if (pList == null) {
    pNode = createFileDialogList();
    pNode.FileInfo.zFileName = pInfo.zFileName;
    pNode.pPrev = pNode.pNext = null;
    return pNode;
  }

  // Add and sort alphabetically without regard to case -- function limited to 10 chars comparison
  if (pList.FileInfo.zFileName.toLowerCase().localeCompare(pInfo.zFileName.toLowerCase()) > 0) {
    // pInfo is smaller than pList (i.e. Insert before)
    pNode = createFileDialogList();
    pNode.FileInfo = pInfo;
    pNode.pNext = pList;
    pNode.pPrev = pList.pPrev;
    pList.pPrev = pNode;
    return pNode;
  } else {
    pList.pNext = AddToFDlgList(pList.pNext, pInfo);
    pList.pNext.pPrev = pList;
  }
  return pList;
}

function RemoveFromFDlgList(head: Pointer<FDLG_LIST | null>, node: FDLG_LIST): boolean {
  let curr: FDLG_LIST | null;
  curr = head.value;
  while (curr) {
    if (curr == node) {
      if (head.value == node)
        head.value = <FDLG_LIST>(head.value).pNext;
      if (curr.pPrev)
        curr.pPrev.pNext = curr.pNext;
      if (curr.pNext)
        curr.pNext.pPrev = curr.pPrev;
      return true;
    }
    curr = curr.pNext;
  }
  return false; // wasn't deleted
}

function TrashFDlgList(pList: FDLG_LIST | null): void {
  let pNode: FDLG_LIST | null;

  while (pList != null) {
    pNode = pList;
    pList = pList.pNext;
  }
}

function SetTopFileToLetter(usLetter: UINT16): void {
  let x: UINT32;
  let curr: FDLG_LIST | null;
  let prev: FDLG_LIST | null;
  let usNodeLetter: UINT16;

  // Skip to first filename
  x = 0;
  curr = prev = FileList;
  while (curr) {
    usNodeLetter = curr.FileInfo.zFileName.charCodeAt(0); // first letter of filename.
    if (usNodeLetter < 'a'.charCodeAt(0))
      usNodeLetter += 32; // convert uppercase to lower case A=65, a=97
    if (usLetter <= usNodeLetter)
      break;
    prev = curr;
    curr = curr.pNext;
    x++;
  }
  if (FileList) {
    iCurrFileShown = x;
    iTopFileShown = x;
    if (iTopFileShown > iTotalFiles - 7)
      iTopFileShown = iTotalFiles - 7;
    SetInputFieldStringWith8BitString(0, (<FDLG_LIST>prev).FileInfo.zFileName);
  }
}

function HandleMainKeyEvents(pEvent: InputAtom): void {
  let iPrevFileShown: INT32 = iCurrFileShown;
  // Replace Alt-x press with ESC.
  if (pEvent.usKeyState & ALT_DOWN && pEvent.usParam == 'x'.charCodeAt(0))
    pEvent.usParam = ESC;
  switch (pEvent.usParam) {
    case ENTER:
      if (gfNoFiles && iCurrentAction == Enum37.ACTION_LOAD_MAP)
        break;
      gfDestroyFDlg = true;
      iFDlgState = iCurrentAction == Enum37.ACTION_SAVE_MAP ? Enum50.DIALOG_SAVE : Enum50.DIALOG_LOAD;
      break;
    case ESC:
      gfDestroyFDlg = true;
      iFDlgState = Enum50.DIALOG_CANCEL;
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
      iFDlgState = Enum50.DIALOG_DELETE;
      break;
    default:
      // This case handles jumping the file list to display the file with the letter pressed.
      if (pEvent.usParam >= 'a'.charCodeAt(0) && pEvent.usParam <= 'z'.charCodeAt(0) || pEvent.usParam >= 'A'.charCodeAt(0) && pEvent.usParam <= 'Z'.charCodeAt(0)) {
        if (pEvent.usParam >= 'A'.charCodeAt(0) && pEvent.usParam <= 'Z'.charCodeAt(0)) // convert upper case to lower case
          pEvent.usParam += 32; // A = 65, a = 97 (difference of 32)
        SetTopFileToLetter(pEvent.usParam);
      }
      break;
  }
  // Update the text field if the file value has changed.
  if (iCurrFileShown != iPrevFileShown) {
    let x: INT32;
    let curr: FDLG_LIST | null;
    x = 0;
    curr = FileList;
    while (curr && x != iCurrFileShown) {
      curr = curr.pNext;
      x++;
    }
    if (curr) {
      SetInputFieldStringWith8BitString(0, curr.FileInfo.zFileName);
      gzFilename = swprintf("%S", curr.FileInfo.zFileName);
    }
  }
}

// editor doesn't care about the z value.  It uses it's own methods.
function SetGlobalSectorValues(szFilename: string /* Pointer<UINT16> */): void {
  let pStr: number /* Pointer<UINT16> */;
  if (ValidCoordinate()) {
    // convert the coordinate string into into the actual global sector coordinates.
    if (gzFilename[0] >= 'A' && gzFilename[0] <= 'P')
      gWorldSectorY = gzFilename.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    else
      gWorldSectorY = gzFilename.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    if (gzFilename[1] == '1' && gzFilename[2] >= '0' && gzFilename[2] <= '6')
      gWorldSectorX = (gzFilename.charCodeAt(1) - 0x30) * 10 + (gzFilename.charCodeAt(2) - 0x30);
    else
      gWorldSectorX = (gzFilename.charCodeAt(1) - 0x30);
    pStr = gzFilename.indexOf("_b");
    if (pStr !== -1) {
      if (gzFilename[pStr + 2] >= '1' && gzFilename[pStr + 2] <= '3') {
        gbWorldSectorZ = (gzFilename.charCodeAt(pStr + 2) - 0x30);
      }
    }
  } else {
    gWorldSectorX = -1;
    gWorldSectorY = -1;
    gbWorldSectorZ = 0;
  }
}

function InitErrorCatchDialog(): void {
  let CenteringRect: SGPRect = createSGPRectFrom(0, 0, 639, 479);

  // do message box and return
  giErrorCatchMessageBox = DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzErrorCatchString, Enum26.EDIT_SCREEN, MSG_BOX_FLAG_OK, null, CenteringRect);
  gfErrorCatch = false;
}

// Because loading and saving the map takes a few seconds, we want to post a message
// on the screen and then update it which requires passing the screen back to the main loop.
// When we come back for the next frame, we then actually save or load the map.  So this
// process takes two full screen cycles.
function ProcessFileIO(): UINT32 {
  let usStartX: INT16;
  let usStartY: INT16;
  let ubNewFilename: string /* UINT8[50] */;
  switch (gbCurrentFileIOStatus) {
    case Enum51.INITIATE_MAP_SAVE: // draw save message
      StartFrameBufferRender();
      SaveFontSettings();
      SetFont(HUGEFONT());
      SetFontForeground(FONT_LTKHAKI);
      SetFontShadow(FONT_DKKHAKI);
      SetFontBackground(0);
      zOrigName = swprintf("Saving map:  %s", gzFilename);
      usStartX = 320 - StringPixLength(zOrigName, LARGEFONT1()) / 2;
      usStartY = 180 - GetFontHeight(LARGEFONT1()) / 2;
      mprintf(usStartX, usStartY, zOrigName);

      InvalidateScreen();
      EndFrameBufferRender();
      gbCurrentFileIOStatus = Enum51.SAVING_MAP;
      return Enum26.LOADSAVE_SCREEN;
    case Enum51.SAVING_MAP: // save map
      ubNewFilename = sprintf("%S", gzFilename);
      RaiseWorldLand();
      if (gfShowPits)
        RemoveAllPits();
      OptimizeSchedules();
      if (!SaveWorld(ubNewFilename)) {
        if (gfErrorCatch) {
          InitErrorCatchDialog();
          return Enum26.EDIT_SCREEN;
        }
        return Enum26.ERROR_SCREEN;
      }
      if (gfShowPits)
        AddAllPits();

      SetGlobalSectorValues(gzFilename);

      if (gfGlobalSummaryExists)
        UpdateSectorSummary(gzFilename, gfUpdateSummaryInfo);

      iCurrentAction = Enum37.ACTION_NULL;
      gbCurrentFileIOStatus = Enum51.IOSTATUS_NONE;
      gfRenderWorld = true;
      gfRenderTaskbar = true;
      fEnteringLoadSaveScreen = true;
      RestoreFontSettings();
      if (gfErrorCatch) {
        InitErrorCatchDialog();
        return Enum26.EDIT_SCREEN;
      }
      if (gMapInformation.ubMapVersion != gubMinorMapVersion)
        ScreenMsg(FONT_MCOLOR_RED, MSG_ERROR, "Map data has just been corrupted!!!  What did you just do?  KM : 0");
      return Enum26.EDIT_SCREEN;
    case Enum51.INITIATE_MAP_LOAD: // draw load message
      SaveFontSettings();
      gbCurrentFileIOStatus = Enum51.LOADING_MAP;
      if (gfEditMode && iCurrentTaskbar == Enum36.TASK_MERCS)
        IndicateSelectedMerc(Enum43.SELECT_NO_MERC);
      SpecifyItemToEdit(null, -1);
      return Enum26.LOADSAVE_SCREEN;
    case Enum51.LOADING_MAP: // load map
      DisableUndo();
      ubNewFilename = sprintf("%S", gzFilename);

      RemoveMercsInSector();

      if (!LoadWorld(ubNewFilename)) {
        // Want to override crash, so user can do something else.
        EnableUndo();
        SetPendingNewScreen(Enum26.LOADSAVE_SCREEN);
        gbCurrentFileIOStatus = Enum51.IOSTATUS_NONE;
        gfGlobalError = false;
        gfLoadError = true;
        // RemoveButton( iTempButton );
        CreateMessageBox(" Error loading file.  Try another filename?");
        return Enum26.LOADSAVE_SCREEN;
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
      iCurrentAction = Enum37.ACTION_NULL;
      gbCurrentFileIOStatus = Enum51.IOSTATUS_NONE;
      if (!gfCaves && !gfBasement) {
        gusLightLevel = 12;
        if (ubAmbientLightLevel != 4) {
          ubAmbientLightLevel = 4;
          LightSetBaseLevel(ubAmbientLightLevel);
        }
      } else
        gusLightLevel = (EDITOR_LIGHT_MAX - ubAmbientLightLevel);
      gEditorLightColor = gpLightColors[0];
      gfRenderWorld = true;
      gfRenderTaskbar = true;
      fEnteringLoadSaveScreen = true;
      InitJA2SelectionWindow();
      ShowEntryPoints();
      EnableUndo();
      RemoveAllFromUndoList();
      SetEditorSmoothingMode(gMapInformation.ubEditorSmoothingType);
      if (gMapInformation.ubEditorSmoothingType == Enum231.SMOOTHING_CAVES)
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

      if (iCurrentTaskbar == Enum36.TASK_MAPINFO) {
        // We have to temporarily remove the current textinput mode,
        // update the disabled text field values, then restore the current
        // text input fields.
        SaveAndRemoveCurrentTextInputMode();
        UpdateMapInfoFields();
        RestoreSavedTextInputMode();
      }
      return Enum26.EDIT_SCREEN;
  }
  gbCurrentFileIOStatus = Enum51.IOSTATUS_NONE;
  return Enum26.LOADSAVE_SCREEN;
}

// LOADSCREEN
function FDlgNamesCallback(butn: GUI_BUTTON, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    SelectFileDialogYPos(butn.Area.RelativeYPos);
  }
}

function FDlgOkCallback(butn: GUI_BUTTON, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    gfDestroyFDlg = true;
    iFDlgState = iCurrentAction == Enum37.ACTION_SAVE_MAP ? Enum50.DIALOG_SAVE : Enum50.DIALOG_LOAD;
  }
}

function FDlgCancelCallback(butn: GUI_BUTTON, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    gfDestroyFDlg = true;
    iFDlgState = Enum50.DIALOG_CANCEL;
  }
}

function FDlgUpCallback(butn: GUI_BUTTON, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if (iTopFileShown > 0)
      iTopFileShown--;
  }
}

function FDlgDwnCallback(butn: GUI_BUTTON, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    if ((iTopFileShown + 7) < iTotalFiles)
      iTopFileShown++;
  }
}

function ExtractFilenameFromFields(): boolean {
  gzFilename = Get16BitStringFromField(0);
  return ValidFilename();
}

function ValidCoordinate(): boolean {
  if (gzFilename[0] >= 'A' && gzFilename[0] <= 'P' || gzFilename[0] >= 'a' && gzFilename[0] <= 'p') {
    let usTotal: UINT16 = 0;
    if (gzFilename[1] == '1' && gzFilename[2] >= '0' && gzFilename[2] <= '6') {
      usTotal = (gzFilename.charCodeAt(1) - 0x30) * 10 + (gzFilename.charCodeAt(2) - 0x30);
    } else if (gzFilename[1] >= '1' && gzFilename[1] <= '9') {
      if (gzFilename[2] < '0' || gzFilename[2] > '9') {
        usTotal = (gzFilename.charCodeAt(1) - 0x30);
      } else {
        return false;
      }
    }
    if (usTotal >= 1 && usTotal <= 16) {
      return true;
    }
  }
  return false;
}

function ValidFilename(): boolean {
  let pDest: number;
  if (gzFilename != '')
  {
    pDest = gzFilename.indexOf(".dat");
    if (pDest === -1)
      pDest = gzFilename.indexOf(".DAT");
    if (pDest !== -1 && pDest != 0 && pDest + 4 == gzFilename.length)
      return true;
  }
  return false;
}

export function ExternalLoadMap(szFilename: string /* Pointer<UINT16> */): boolean {
  Assert(szFilename);
  if (!szFilename.length)
    return false;
  gzFilename = szFilename;
  if (!ValidFilename())
    return false;
  gbCurrentFileIOStatus = Enum51.INITIATE_MAP_LOAD;
  ProcessFileIO(); // always returns loadsave_screen and changes iostatus to loading_map.
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  RefreshScreen();
  if (ProcessFileIO() == Enum26.EDIT_SCREEN)
    return true;
  return false;
}

export function ExternalSaveMap(szFilename: string /* Pointer<UINT16> */): boolean {
  Assert(szFilename);
  if (!szFilename.length)
    return false;
  gzFilename = szFilename;
  if (!ValidFilename())
    return false;
  gbCurrentFileIOStatus = Enum51.INITIATE_MAP_SAVE;
  if (ProcessFileIO() == Enum26.ERROR_SCREEN)
    return false;
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
  RefreshScreen();
  if (ProcessFileIO() == Enum26.EDIT_SCREEN)
    return true;
  return false;
}

}
