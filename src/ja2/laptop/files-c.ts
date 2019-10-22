const TOP_X = 0 + LAPTOP_SCREEN_UL_X;
const TOP_Y = LAPTOP_SCREEN_UL_Y;
const BLOCK_FILE_HEIGHT = 10;
const BOX_HEIGHT = 14;
const TITLE_X = 140;
const TITLE_Y = 33;
const TEXT_X = 140;
const PAGE_SIZE = 22;
const FILES_TITLE_FONT = () => FONT14ARIAL();
const FILES_TEXT_FONT = () => FONT10ARIAL(); // FONT12ARIAL
const BLOCK_HEIGHT = 10;
const FILES_SENDER_TEXT_X = TOP_X + 15;
const MAX_FILES_LIST_LENGTH = 28;
const NUMBER_OF_FILES_IN_FILE_MANAGER = 20;
const FILE_VIEWER_X = 236;
const FILE_VIEWER_Y = 85;
const FILE_VIEWER_WIDTH = 598 - 240;
const FILE_GAP = 2;
const FILE_TEXT_COLOR = FONT_BLACK;
const FILE_STRING_SIZE = 400;
const MAX_FILES_PAGE = MAX_FILES_LIST_LENGTH;
const FILES_LIST_X = FILES_SENDER_TEXT_X;
const FILES_LIST_Y = (9 * BLOCK_HEIGHT);
const FILES_LIST_WIDTH = 100;
const LENGTH_OF_ENRICO_FILE = 68;
const MAX_FILE_MESSAGE_PAGE_SIZE = 325;
const VIEWER_MESSAGE_BODY_START_Y = FILES_LIST_Y;
const PREVIOUS_FILE_PAGE_BUTTON_X = 553;
const PREVIOUS_FILE_PAGE_BUTTON_Y = 53;
const NEXT_FILE_PAGE_BUTTON_X = 577;
const NEXT_FILE_PAGE_BUTTON_Y = PREVIOUS_FILE_PAGE_BUTTON_Y;

const FILES_COUNTER_1_WIDTH = 7;
const FILES_COUNTER_2_WIDTH = 43;
const FILES_COUNTER_3_WIDTH = 45;

// the highlighted line
let iHighLightFileLine: INT32 = -1;

// the files record list
let pFilesListHead: FilesUnitPtr = NULL;

let pFileStringList: FileStringPtr = NULL;

// are we in files mode
let fInFilesMode: BOOLEAN = FALSE;
let fOnLastFilesPageFlag: BOOLEAN = FALSE;

//. did we enter due to new file icon?
let fEnteredFileViewerFromNewFileIcon: BOOLEAN = FALSE;
let fWaitAFrame: BOOLEAN = FALSE;

// are there any new files
let fNewFilesInFileViewer: BOOLEAN = FALSE;

// graphics handles
let guiTITLE: UINT32;
let guiFileBack: UINT32;
let guiTOP: UINT32;
let guiHIGHLIGHT: UINT32;

// currewnt page of multipage files we are on
let giFilesPage: INT32 = 0;
// strings

const SLAY_LENGTH = 12;
const ENRICO_LENGTH = 0;

let ubFileRecordsLength: UINT8[] /* [] */ = [
  ENRICO_LENGTH,
  SLAY_LENGTH,
  SLAY_LENGTH,
  SLAY_LENGTH,
  SLAY_LENGTH,
  SLAY_LENGTH,
  SLAY_LENGTH,
];

let ubFileOffsets: UINT16[] /* [] */ = [
  0,
  ENRICO_LENGTH,
  SLAY_LENGTH + ENRICO_LENGTH,
  2 * SLAY_LENGTH + ENRICO_LENGTH,
  3 * SLAY_LENGTH + ENRICO_LENGTH,
  4 * SLAY_LENGTH + ENRICO_LENGTH,
  5 * SLAY_LENGTH + ENRICO_LENGTH,
];

let usProfileIdsForTerroristFiles: UINT16[] /* [] */ = [
  0, // no body
  112, // elgin
  64, // slay
  82, // mom
  83, // imposter
  110, // tiff
  111, // t-rex
  112, // elgin
];
// buttons for next and previous pages
let giFilesPageButtons: UINT32[] /* [2] */;
let giFilesPageButtonsImage: UINT32[] /* [2] */;

// the previous and next pages buttons

const enum Enum76 {
  PREVIOUS_FILES_PAGE_BUTTON = 0,
  NEXT_FILES_PAGE_BUTTON,
}
// mouse regions
let pFilesRegions: MOUSE_REGION[] /* [MAX_FILES_PAGE] */;

function AddFilesToPlayersLog(ubCode: UINT8, uiDate: UINT32, ubFormat: UINT8, pFirstPicFile: STR8, pSecondPicFile: STR8): UINT32 {
  // adds Files item to player's log(Files List), returns unique id number of it
  // outside of the Files system(the code in this .c file), this is the only function you'll ever need
  let uiId: UINT32 = 0;

  // if not in Files mode, read in from file
  if (!fInFilesMode)
    OpenAndReadFilesFile();

  // process the actual data
  uiId = ProcessAndEnterAFilesRecord(ubCode, uiDate, ubFormat, pFirstPicFile, pSecondPicFile, FALSE);

  // set unread flag, if nessacary
  CheckForUnreadFiles();

  // write out to file if not in Files mode
  if (!fInFilesMode)
    OpenAndWriteFilesFile();

  // return unique id of this transaction
  return uiId;
}
function GameInitFiles(): void {
  if ((FileExists(FILES_DAT_FILE) == TRUE)) {
    FileClearAttributes(FILES_DAT_FILE);
    FileDelete(FILES_DAT_FILE);
  }

  ClearFilesList();

  // add background check by RIS
  AddFilesToPlayersLog(ENRICO_BACKGROUND, 0, 255, NULL, NULL);
}

function EnterFiles(): void {
  // load grpahics for files system
  LoadFiles();

  // AddFilesToPlayersLog(1, 0, 0,"LAPTOP\\portrait.sti", "LAPTOP\\portrait.sti");
  // AddFilesToPlayersLog(0, 0, 3,"LAPTOP\\portrait.sti", "LAPTOP\\portrait.sti");
  // AddFilesToPlayersLog(2, 0, 1,"LAPTOP\\portrait.sti", "LAPTOP\\portrait.sti");
  // in files mode now, set the fact
  fInFilesMode = TRUE;

  // initialize mouse regions
  InitializeFilesMouseRegions();

  // create buttons
  CreateButtonsForFilesPage();

  // now set start states
  HandleFileViewerButtonStates();

  // build files list
  OpenAndReadFilesFile();

  // render files system
  RenderFiles();

  // entered due to icon
  if (fEnteredFileViewerFromNewFileIcon == TRUE) {
    OpenFirstUnreadFile();
    fEnteredFileViewerFromNewFileIcon = FALSE;
  }
}

function ExitFiles(): void {
  // write files list out to disk
  OpenAndWriteFilesFile();

  // remove mouse regions
  RemoveFilesMouseRegions();

  // delete buttons
  DeleteButtonsForFilesPage();

  fInFilesMode = FALSE;

  // remove files
  RemoveFiles();
}

function HandleFiles(): void {
  CheckForUnreadFiles();
}

function RenderFiles(): void {
  let hHandle: HVOBJECT;

  // render the background
  RenderFilesBackGround();

  // draw the title bars text
  DrawFilesTitleText();

  // the columns
  DrawFilesListBackGround();

  // display the list of senders
  DisplayFilesList();

  // draw the highlighted file
  DisplayFileMessage();

  // title bar icon
  BlitTitleBarIcons();

  // display border
  GetVideoObject(&hHandle, guiLaptopBACKGROUND);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, 108, 23, VO_BLT_SRCTRANSPARENCY, NULL);
}

function RenderFilesBackGround(): void {
  // render generic background for file system
  let hHandle: HVOBJECT;
  let iCounter: INT32 = 0;

  // get title bar object
  GetVideoObject(&hHandle, guiTITLE);

  // blt title bar to screen
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X, TOP_Y - 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // get and blt the top part of the screen, video object and blt to screen
  GetVideoObject(&hHandle, guiTOP);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X, TOP_Y + 22, VO_BLT_SRCTRANSPARENCY, NULL);

  return;
}

function DrawFilesTitleText(): void {
  // setup the font stuff
  SetFont(FILES_TITLE_FONT);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  // draw the pages title
  mprintf(TITLE_X, TITLE_Y, pFilesTitle[0]);

  return;
}

function LoadFiles(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  // load files video objects into memory

  // title bar
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\programtitlebar.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiTITLE));

  // top portion of the screen background
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\fileviewer.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiTOP));

  // the highlight
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\highlight.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiHIGHLIGHT));

  // top portion of the screen background
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\fileviewerwhite.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiFileBack));

  return TRUE;
}

function RemoveFiles(): void {
  // delete files video objects from memory

  DeleteVideoObjectFromIndex(guiTOP);
  DeleteVideoObjectFromIndex(guiTITLE);
  DeleteVideoObjectFromIndex(guiHIGHLIGHT);
  DeleteVideoObjectFromIndex(guiFileBack);

  return;
}

function ProcessAndEnterAFilesRecord(ubCode: UINT8, uiDate: UINT32, ubFormat: UINT8, pFirstPicFile: STR8, pSecondPicFile: STR8, fRead: BOOLEAN): UINT32 {
  let uiId: UINT32 = 0;
  let pFiles: FilesUnitPtr = pFilesListHead;

  // add to Files list
  if (pFiles) {
    while (pFiles) {
      // check to see if the file is already there
      if (pFiles->ubCode == ubCode) {
        // if so, return it's id number
        return pFiles->uiIdNumber;
      }

      // next in the list
      pFiles = pFiles->Next;
    }

    // reset pointer
    pFiles = pFilesListHead;

    // go to end of list
    while (pFiles->Next) {
      pFiles = pFiles->Next;
    }
    // alloc space
    pFiles->Next = MemAlloc(sizeof(FilesUnit));

    // increment id number
    uiId = pFiles->uiIdNumber + 1;

    // set up information passed
    pFiles = pFiles->Next;
    pFiles->Next = NULL;
    pFiles->ubCode = ubCode;
    pFiles->uiDate = uiDate;
    pFiles->uiIdNumber = uiId;
    pFiles->ubFormat = ubFormat;
    pFiles->fRead = fRead;
  } else {
    // alloc space
    pFiles = MemAlloc(sizeof(FilesUnit));

    // setup info passed
    pFiles->Next = NULL;
    pFiles->ubCode = ubCode;
    pFiles->uiDate = uiDate;
    pFiles->uiIdNumber = uiId;
    pFilesListHead = pFiles;
    pFiles->ubFormat = ubFormat;
    pFiles->fRead = fRead;
  }

  // null out ptr's to picture file names
  pFiles->pPicFileNameList[0] = NULL;
  pFiles->pPicFileNameList[1] = NULL;

  // copy file name strings

  // first file
  if (pFirstPicFile) {
    if ((pFirstPicFile[0]) != 0) {
      pFiles->pPicFileNameList[0] = MemAlloc(strlen(pFirstPicFile) + 1);
      strcpy(pFiles->pPicFileNameList[0], pFirstPicFile);
      pFiles->pPicFileNameList[0][strlen(pFirstPicFile)] = 0;
    }
  }

  // second file

  if (pSecondPicFile) {
    if ((pSecondPicFile[0]) != 0) {
      pFiles->pPicFileNameList[1] = MemAlloc(strlen(pSecondPicFile) + 1);
      strcpy(pFiles->pPicFileNameList[1], pSecondPicFile);
      pFiles->pPicFileNameList[1][strlen(pSecondPicFile)] = 0;
    }
  }

  // return unique id
  return uiId;
}

function OpenAndReadFilesFile(): void {
  // this procedure will open and read in data to the finance list
  let hFileHandle: HWFILE;
  let ubCode: UINT8;
  let uiDate: UINT32;
  let iBytesRead: INT32 = 0;
  let uiByteCount: UINT32 = 0;
  let pFirstFilePath: CHAR8[] /* [128] */;
  let pSecondFilePath: CHAR8[] /* [128] */;
  let ubFormat: UINT8;
  let fRead: BOOLEAN;

  // clear out the old list
  ClearFilesList();

  // no file, return
  if (!(FileExists(FILES_DAT_FILE)))
    return;

  // open file
  hFileHandle = FileOpen(FILES_DAT_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    return;
  }

  // make sure file is more than 0 length
  if (FileGetSize(hFileHandle) == 0) {
    FileClose(hFileHandle);
    return;
  }

  // file exists, read in data, continue until file end
  while (FileGetSize(hFileHandle) > uiByteCount) {
    // read in data
    FileRead(hFileHandle, &ubCode, sizeof(UINT8), &iBytesRead);

    FileRead(hFileHandle, &uiDate, sizeof(UINT32), &iBytesRead);

    FileRead(hFileHandle, &pFirstFilePath, 128, &iBytesRead);

    FileRead(hFileHandle, &pSecondFilePath, 128, &iBytesRead);

    FileRead(hFileHandle, &ubFormat, sizeof(UINT8), &iBytesRead);

    FileRead(hFileHandle, &fRead, sizeof(UINT8), &iBytesRead);
    // add transaction
    ProcessAndEnterAFilesRecord(ubCode, uiDate, ubFormat, pFirstFilePath, pSecondFilePath, fRead);

    // increment byte counter
    uiByteCount += sizeof(UINT32) + sizeof(UINT8) + 128 + 128 + sizeof(UINT8) + sizeof(BOOLEAN);
  }

  // close file
  FileClose(hFileHandle);

  return;
}

function OpenAndWriteFilesFile(): BOOLEAN {
  // this procedure will open and write out data from the finance list
  let hFileHandle: HWFILE;
  let iBytesWritten: INT32 = 0;
  let pFilesList: FilesUnitPtr = pFilesListHead;
  let pFirstFilePath: CHAR8[] /* [128] */;
  let pSecondFilePath: CHAR8[] /* [128] */;

  memset(&pFirstFilePath, 0, sizeof(pFirstFilePath));
  memset(&pSecondFilePath, 0, sizeof(pSecondFilePath));

  if (pFilesList != NULL) {
    if (pFilesList->pPicFileNameList[0]) {
      strcpy(pFirstFilePath, pFilesList->pPicFileNameList[0]);
    }
    if (pFilesList->pPicFileNameList[1]) {
      strcpy(pSecondFilePath, pFilesList->pPicFileNameList[1]);
    }
  }

  // open file
  hFileHandle = FileOpen(FILES_DAT_FILE, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);

  // if no file exits, do nothing
  if (!hFileHandle) {
    return FALSE;
  }
  // write info, while there are elements left in the list
  while (pFilesList) {
    // now write date and amount, and code
    FileWrite(hFileHandle, &(pFilesList->ubCode), sizeof(UINT8), NULL);
    FileWrite(hFileHandle, &(pFilesList->uiDate), sizeof(UINT32), NULL);
    FileWrite(hFileHandle, &(pFirstFilePath), 128, NULL);
    FileWrite(hFileHandle, &(pSecondFilePath), 128, NULL);
    FileWrite(hFileHandle, &(pFilesList->ubFormat), sizeof(UINT8), NULL);
    FileWrite(hFileHandle, &(pFilesList->fRead), sizeof(UINT8), NULL);

    // next element in list
    pFilesList = pFilesList->Next;
  }

  // close file
  FileClose(hFileHandle);
  // clear out the old list
  ClearFilesList();

  return TRUE;
}

function ClearFilesList(): void {
  // remove each element from list of transactions
  let pFilesList: FilesUnitPtr = pFilesListHead;
  let pFilesNode: FilesUnitPtr = pFilesList;

  // while there are elements in the list left, delete them
  while (pFilesList) {
    // set node to list head
    pFilesNode = pFilesList;

    // set list head to next node
    pFilesList = pFilesList->Next;

    // if present, dealloc string
    if (pFilesNode->pPicFileNameList[0]) {
      MemFree(pFilesNode->pPicFileNameList[0]);
    }

    if (pFilesNode->pPicFileNameList[1]) {
      MemFree(pFilesNode->pPicFileNameList[1]);
    }
    // delete current node
    MemFree(pFilesNode);
  }
  pFilesListHead = NULL;
  return;
}

function DrawFilesListBackGround(): void {
  // proceudre will draw the background for the list of files
  let iCounter: INT32 = 7;
  // HVOBJECT hHandle;

  // now the columns

  return;
}

function DisplayFilesList(): void {
  // this function will run through the list of files of files and display the 'sender'
  let pFilesList: FilesUnitPtr = pFilesListHead;
  let iCounter: INT32 = 0;
  let hHandle: HVOBJECT;

  // font stuff
  SetFont(FILES_TEXT_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // runt hrough list displaying 'sender'
  while ((pFilesList)) //&&(iCounter < MAX_FILES_LIST_LENGTH))
  {
    if (iCounter == iHighLightFileLine) {
      // render highlight
      GetVideoObject(&hHandle, guiHIGHLIGHT);
      BltVideoObject(FRAME_BUFFER, hHandle, 0, FILES_SENDER_TEXT_X - 5, ((iCounter + 9) * BLOCK_HEIGHT) + (iCounter * 2) - 4, VO_BLT_SRCTRANSPARENCY, NULL);
    }
    mprintf(FILES_SENDER_TEXT_X, ((iCounter + 9) * BLOCK_HEIGHT) + (iCounter * 2) - 2, pFilesSenderList[pFilesList->ubCode]);
    iCounter++;
    pFilesList = pFilesList->Next;
  }

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function DisplayFileMessage(): void {
  // get the currently selected message
  if (iHighLightFileLine != -1) {
    // display text
    DisplayFormattedText();
  } else {
    HandleFileViewerButtonStates();
  }

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function InitializeFilesMouseRegions(): void {
  let iCounter: INT32 = 0;
  // init mouseregions
  for (iCounter = 0; iCounter < MAX_FILES_PAGE; iCounter++) {
    MSYS_DefineRegion(&pFilesRegions[iCounter], FILES_LIST_X, (FILES_LIST_Y + iCounter * (BLOCK_HEIGHT + 2)), FILES_LIST_X + FILES_LIST_WIDTH, (FILES_LIST_Y + (iCounter + 1) * (BLOCK_HEIGHT + 2)), MSYS_PRIORITY_NORMAL + 2, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, FilesBtnCallBack);
    MSYS_AddRegion(&pFilesRegions[iCounter]);
    MSYS_SetRegionUserData(&pFilesRegions[iCounter], 0, iCounter);
  }

  return;
}

function RemoveFilesMouseRegions(): void {
  let iCounter: INT32 = 0;
  for (iCounter = 0; iCounter < MAX_FILES_PAGE; iCounter++) {
    MSYS_RemoveRegion(&pFilesRegions[iCounter]);
  }
}

function FilesBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iFileId: INT32 = -1;
  let iCounter: INT32 = 0;
  let pFilesList: FilesUnitPtr = pFilesListHead;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // left button
    iFileId = MSYS_GetRegionUserData(pRegion, 0);

    // reset iHighLightListLine
    iHighLightFileLine = -1;

    if (iHighLightFileLine == iFileId) {
      return;
    }

    // make sure is a valid
    while (pFilesList) {
      // if iCounter = iFileId, is a valid file
      if (iCounter == iFileId) {
        giFilesPage = 0;
        iHighLightFileLine = iFileId;
      }

      // next element in list
      pFilesList = pFilesList->Next;

      // increment counter
      iCounter++;
    }

    fReDrawScreenFlag = TRUE;

    return;
  }
}

function DisplayFormattedText(): BOOLEAN {
  let pFilesList: FilesUnitPtr = pFilesListHead;

  let usFirstWidth: UINT16 = 0;
  let usFirstHeight: UINT16 = 0;
  let usSecondWidth: UINT16;
  let usSecondHeight: UINT16;
  let sTextWidth: INT16 = 0;
  let iCounter: INT32 = 0;
  let iLength: INT32 = 0;
  let iHeight: INT32 = 0;
  let iOffSet: INT32 = 0;
  let iMessageCode: INT32;
  let sString: wchar_t[] /* [2048] */;
  let hHandle: HVOBJECT;
  let uiFirstTempPicture: UINT32;
  let uiSecondTempPicture: UINT32;
  let VObjectDesc: VOBJECT_DESC;
  let usFreeSpace: INT16 = 0;
  /* static */ let iOldMessageCode: INT32 = 0;

  fWaitAFrame = FALSE;

  // get the file that was highlighted
  while (iCounter < iHighLightFileLine) {
    iCounter++;
    pFilesList = pFilesList->Next;
  }

  // message code found, reset counter
  iMessageCode = pFilesList->ubCode;
  iCounter = 0;

  // set file as read
  pFilesList->fRead = TRUE;

  // clear the file string structure list
  // get file background object
  GetVideoObject(&hHandle, guiFileBack);

  // blt background to screen
  BltVideoObject(FRAME_BUFFER, hHandle, 0, FILE_VIEWER_X, FILE_VIEWER_Y - 4, VO_BLT_SRCTRANSPARENCY, NULL);

  // get the offset in the file
  while (iCounter < iMessageCode) {
    // increment increment offset
    iOffSet += ubFileRecordsLength[iCounter];

    // increment counter
    iCounter++;
  }

  iLength = ubFileRecordsLength[pFilesList->ubCode];

  if (pFilesList->ubFormat < ENRICO_BACKGROUND) {
    LoadEncryptedDataFromFile("BINARYDATA\\Files.edt", sString, FILE_STRING_SIZE * (iOffSet)*2, FILE_STRING_SIZE * iLength * 2);
  }

  // reset counter
  iCounter = 0;

  // no shadow
  SetFontShadow(NO_SHADOW);

  switch (pFilesList->ubFormat) {
    case 0:

      // no format, all text

      while (iLength > iCounter) {
        // read one record from file manager file
        LoadEncryptedDataFromFile("BINARYDATA\\Files.edt", sString, FILE_STRING_SIZE * (iOffSet + iCounter) * 2, FILE_STRING_SIZE * 2);

        // display string and get height
        iHeight += IanDisplayWrappedString(FILE_VIEWER_X + 4, (FILE_VIEWER_Y + iHeight), FILE_VIEWER_WIDTH, FILE_GAP, FILES_TEXT_FONT, FILE_TEXT_COLOR, sString, 0, FALSE, 0);

        // increment file record counter
        iCounter++;
      }
      break;

    case 1:

      // second format, one picture, all text below

      // load graphic
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP(pFilesList->pPicFileNameList[0], VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(&VObjectDesc, &uiFirstTempPicture));

      GetVideoObjectETRLESubregionProperties(uiFirstTempPicture, 0, &usFirstWidth, &usFirstHeight);

      // get file background object
      GetVideoObject(&hHandle, uiFirstTempPicture);

      // blt background to screen
      BltVideoObject(FRAME_BUFFER, hHandle, 0, FILE_VIEWER_X + 4 + (FILE_VIEWER_WIDTH - usFirstWidth) / 2, FILE_VIEWER_Y + 10, VO_BLT_SRCTRANSPARENCY, NULL);

      iHeight = usFirstHeight + 20;

      while (iLength > iCounter) {
        // read one record from file manager file
        LoadEncryptedDataFromFile("BINARYDATA\\Files.edt", sString, FILE_STRING_SIZE * (iOffSet + iCounter) * 2, FILE_STRING_SIZE * 2);

        // display string and get height
        iHeight += IanDisplayWrappedString(FILE_VIEWER_X + 4, (FILE_VIEWER_Y + iHeight), FILE_VIEWER_WIDTH, FILE_GAP, FILES_TEXT_FONT, FILE_TEXT_COLOR, sString, 0, FALSE, 0);

        // increment file record counter
        iCounter++;
      }

      // delete video object
      DeleteVideoObjectFromIndex(uiFirstTempPicture);

      break;
    case 2:

      // third format, two pictures, side by side with all text below

      // load first graphic
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP(pFilesList->pPicFileNameList[0], VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(&VObjectDesc, &uiFirstTempPicture));

      // load second graphic
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP(pFilesList->pPicFileNameList[1], VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(&VObjectDesc, &uiSecondTempPicture));

      GetVideoObjectETRLESubregionProperties(uiFirstTempPicture, 0, &usFirstWidth, &usFirstHeight);
      GetVideoObjectETRLESubregionProperties(uiSecondTempPicture, 0, &usSecondWidth, &usSecondHeight);

      // get free space;
      usFreeSpace = FILE_VIEWER_WIDTH - usFirstWidth - usSecondWidth;

      usFreeSpace /= 3;
      // get file background object
      GetVideoObject(&hHandle, uiFirstTempPicture);

      // blt background to screen
      BltVideoObject(FRAME_BUFFER, hHandle, 0, FILE_VIEWER_X + usFreeSpace, FILE_VIEWER_Y + 10, VO_BLT_SRCTRANSPARENCY, NULL);

      // get file background object
      GetVideoObject(&hHandle, uiSecondTempPicture);

      // get position for second picture
      usFreeSpace *= 2;
      usFreeSpace += usFirstWidth;

      // blt background to screen
      BltVideoObject(FRAME_BUFFER, hHandle, 0, FILE_VIEWER_X + usFreeSpace, FILE_VIEWER_Y + 10, VO_BLT_SRCTRANSPARENCY, NULL);

      // delete video object
      DeleteVideoObjectFromIndex(uiFirstTempPicture);
      DeleteVideoObjectFromIndex(uiSecondTempPicture);

      // put in text
      iHeight = usFirstHeight + 20;

      while (iLength > iCounter) {
        // read one record from file manager file
        LoadEncryptedDataFromFile("BINARYDATA\\Files.edt", sString, FILE_STRING_SIZE * (iOffSet + iCounter) * 2, FILE_STRING_SIZE * 2);

        // display string and get height
        iHeight += IanDisplayWrappedString(FILE_VIEWER_X + 4, (FILE_VIEWER_Y + iHeight), FILE_VIEWER_WIDTH, FILE_GAP, FILES_TEXT_FONT, FILE_TEXT_COLOR, sString, 0, FALSE, 0);

        // increment file record counter
        iCounter++;
      }

      break;

    case 3:
      // picture on the left, with text on right and below
      // load first graphic
      HandleSpecialTerroristFile(pFilesList->ubCode, pFilesList->pPicFileNameList[0]);
      break;
    default:
      HandleSpecialFiles(pFilesList->ubFormat);
      break;
  }

  HandleFileViewerButtonStates();
  SetFontShadow(DEFAULT_SHADOW);

  return TRUE;
}

function HandleSpecialFiles(ubFormat: UINT8): BOOLEAN {
  let iCounter: INT32 = 0;
  let sString: wchar_t[] /* [2048] */;
  let pTempString: FileStringPtr = NULL;
  let pLocatorString: FileStringPtr = NULL;
  let iTotalYPosition: INT32 = 0;
  let iYPositionOnPage: INT32 = 0;
  let iFileLineWidth: INT32 = 0;
  let iFileStartX: INT32 = 0;
  let uiFlags: UINT32 = 0;
  let uiFont: UINT32 = 0;
  let fGoingOffCurrentPage: BOOLEAN = FALSE;
  let WidthList: FileRecordWidthPtr = NULL;

  let uiPicture: UINT32;
  let hHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;

  ClearFileStringList();

  switch (ubFormat) {
    case (255):
      // load data
      // read one record from file manager file

      WidthList = CreateWidthRecordsForAruloIntelFile();
      while (iCounter < LENGTH_OF_ENRICO_FILE) {
        LoadEncryptedDataFromFile("BINARYDATA\\RIS.EDT", sString, FILE_STRING_SIZE * (iCounter)*2, FILE_STRING_SIZE * 2);
        AddStringToFilesList(sString);
        iCounter++;
      }

      pTempString = pFileStringList;

      iYPositionOnPage = 0;
      iCounter = 0;
      pLocatorString = pTempString;

      pTempString = GetFirstStringOnThisPage(pFileStringList, FILES_TEXT_FONT, 350, FILE_GAP, giFilesPage, MAX_FILE_MESSAGE_PAGE_SIZE, WidthList);

      // find out where this string is
      while (pLocatorString != pTempString) {
        iCounter++;
        pLocatorString = pLocatorString->Next;
      }

      // move through list and display
      while (pTempString) {
        uiFlags = IAN_WRAP_NO_SHADOW;
        // copy over string
        wcscpy(sString, pTempString->pString);

        if (sString[0] == 0) {
          // on last page
          fOnLastFilesPageFlag = TRUE;
        }

        // set up font
        uiFont = FILES_TEXT_FONT;
        if (giFilesPage == 0) {
          switch (iCounter) {
            case (0):
              uiFont = FILES_TITLE_FONT;
              break;
          }
        }

        // reset width
        iFileLineWidth = 350;
        iFileStartX = (FILE_VIEWER_X + 10);

        // based on the record we are at, selected X start position and the width to wrap the line, to fit around pictures

        if (iCounter == 0) {
          // title
          iFileLineWidth = 350;
          iFileStartX = (FILE_VIEWER_X + 10);
        } else if (iCounter == 1) {
          // opening on first page
          iFileLineWidth = 350;
          iFileStartX = (FILE_VIEWER_X + 10);
        } else if ((iCounter > 1) && (iCounter < FILES_COUNTER_1_WIDTH)) {
          iFileLineWidth = 350;
          iFileStartX = (FILE_VIEWER_X + 10);
        } else if (iCounter == FILES_COUNTER_1_WIDTH) {
          if (giFilesPage == 0) {
            iYPositionOnPage += (MAX_FILE_MESSAGE_PAGE_SIZE - iYPositionOnPage);
          }
          iFileLineWidth = 350;
          iFileStartX = (FILE_VIEWER_X + 10);
        }

        else if (iCounter == FILES_COUNTER_2_WIDTH) {
          iFileLineWidth = 200;
          iFileStartX = (FILE_VIEWER_X + 150);
        } else if (iCounter == FILES_COUNTER_3_WIDTH) {
          iFileLineWidth = 200;
          iFileStartX = (FILE_VIEWER_X + 150);
        }

        else {
          iFileLineWidth = 350;
          iFileStartX = (FILE_VIEWER_X + 10);
        }
        // not far enough, advance

        if ((iYPositionOnPage + IanWrappedStringHeight(0, 0, iFileLineWidth, FILE_GAP, uiFont, 0, sString, 0, 0, 0)) < MAX_FILE_MESSAGE_PAGE_SIZE) {
          // now print it
          iYPositionOnPage += IanDisplayWrappedString((iFileStartX), (FILE_VIEWER_Y + iYPositionOnPage), iFileLineWidth, FILE_GAP, uiFont, FILE_TEXT_COLOR, sString, 0, FALSE, uiFlags);

          fGoingOffCurrentPage = FALSE;
        } else {
          // gonna get cut off...end now
          fGoingOffCurrentPage = TRUE;
        }

        pTempString = pTempString->Next;

        if (pTempString == NULL) {
          // on last page
          fOnLastFilesPageFlag = TRUE;
        } else {
          fOnLastFilesPageFlag = FALSE;
        }

        // going over the edge, stop now
        if (fGoingOffCurrentPage == TRUE) {
          pTempString = NULL;
        }
        iCounter++;
      }
      ClearOutWidthRecordsList(WidthList);
      ClearFileStringList();
      break;
  }

  // place pictures
  // page 1 picture of country
  if (giFilesPage == 0) {
    // title bar
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("LAPTOP\\ArucoFilesMap.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(&VObjectDesc, &uiPicture));

    // get title bar object
    GetVideoObject(&hHandle, uiPicture);

    // blt title bar to screen
    BltVideoObject(FRAME_BUFFER, hHandle, 0, 300, 270, VO_BLT_SRCTRANSPARENCY, NULL);

    DeleteVideoObjectFromIndex(uiPicture);
  } else if (giFilesPage == 4) {
    // kid pic
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("LAPTOP\\Enrico_Y.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(&VObjectDesc, &uiPicture));

    // get title bar object
    GetVideoObject(&hHandle, uiPicture);

    // blt title bar to screen
    BltVideoObject(FRAME_BUFFER, hHandle, 0, 260, 225, VO_BLT_SRCTRANSPARENCY, NULL);

    DeleteVideoObjectFromIndex(uiPicture);
  } else if (giFilesPage == 5) {
    // wedding pic
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("LAPTOP\\Enrico_W.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(&VObjectDesc, &uiPicture));

    // get title bar object
    GetVideoObject(&hHandle, uiPicture);

    // blt title bar to screen
    BltVideoObject(FRAME_BUFFER, hHandle, 0, 260, 85, VO_BLT_SRCTRANSPARENCY, NULL);

    DeleteVideoObjectFromIndex(uiPicture);
  }

  return TRUE;
}

function AddStringToFilesList(pString: STR16): void {
  let pFileString: FileStringPtr;
  let pTempString: FileStringPtr = pFileStringList;

  // create string structure
  pFileString = MemAlloc(sizeof(FileString));

  // alloc string and copy
  pFileString->pString = MemAlloc((wcslen(pString) * 2) + 2);
  wcscpy(pFileString->pString, pString);
  pFileString->pString[wcslen(pString)] = 0;

  // set Next to NULL

  pFileString->Next = NULL;
  if (pFileStringList == NULL) {
    pFileStringList = pFileString;
  } else {
    while (pTempString->Next) {
      pTempString = pTempString->Next;
    }
    pTempString->Next = pFileString;
  }

  return;
}

function ClearFileStringList(): void {
  let pFileString: FileStringPtr;
  let pDeleteFileString: FileStringPtr;

  pFileString = pFileStringList;

  if (pFileString == NULL) {
    return;
  }
  while (pFileString->Next) {
    pDeleteFileString = pFileString;
    pFileString = pFileString->Next;
    MemFree(pDeleteFileString);
  }

  // last one
  MemFree(pFileString);

  pFileStringList = NULL;
}

function CreateButtonsForFilesPage(): void {
  // will create buttons for the files page
  giFilesPageButtonsImage[0] = LoadButtonImage("LAPTOP\\arrows.sti", -1, 0, -1, 1, -1);
  giFilesPageButtons[0] = QuickCreateButton(giFilesPageButtonsImage[0], PREVIOUS_FILE_PAGE_BUTTON_X, PREVIOUS_FILE_PAGE_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnPreviousFilePageCallback);

  giFilesPageButtonsImage[1] = LoadButtonImage("LAPTOP\\arrows.sti", -1, 6, -1, 7, -1);
  giFilesPageButtons[1] = QuickCreateButton(giFilesPageButtonsImage[1], NEXT_FILE_PAGE_BUTTON_X, NEXT_FILE_PAGE_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnNextFilePageCallback);

  SetButtonCursor(giFilesPageButtons[0], CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(giFilesPageButtons[1], CURSOR_LAPTOP_SCREEN);

  return;
}

function DeleteButtonsForFilesPage(): void {
  // destroy buttons for the files page

  RemoveButton(giFilesPageButtons[0]);
  UnloadButtonImage(giFilesPageButtonsImage[0]);

  RemoveButton(giFilesPageButtons[1]);
  UnloadButtonImage(giFilesPageButtonsImage[1]);

  return;
}

// callbacks
function BtnPreviousFilePageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn->uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (fWaitAFrame == TRUE) {
      return;
    }

    if (!(btn->uiFlags & BUTTON_CLICKED_ON)) {
      btn->uiFlags |= (BUTTON_CLICKED_ON);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fWaitAFrame == TRUE) {
      return;
    }

    if ((btn->uiFlags & BUTTON_CLICKED_ON)) {
      if (giFilesPage > 0) {
        giFilesPage--;
        fWaitAFrame = TRUE;
      }

      fReDrawScreenFlag = TRUE;
      btn->uiFlags &= ~(BUTTON_CLICKED_ON);
      MarkButtonsDirty();
    }
  }

  return;
}

function BtnNextFilePageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn->uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (fWaitAFrame == TRUE) {
      return;
    }

    if (!(btn->uiFlags & BUTTON_CLICKED_ON)) {
      btn->uiFlags |= (BUTTON_CLICKED_ON);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fWaitAFrame == TRUE) {
      return;
    }

    if ((btn->uiFlags & BUTTON_CLICKED_ON)) {
      if ((fOnLastFilesPageFlag) == FALSE) {
        fWaitAFrame = TRUE;
        giFilesPage++;
      }

      fReDrawScreenFlag = TRUE;
      btn->uiFlags &= ~(BUTTON_CLICKED_ON);
      MarkButtonsDirty();
    }
  }

  return;
}

function HandleFileViewerButtonStates(): void {
  // handle state of email viewer buttons

  if (iHighLightFileLine == -1) {
    // not displaying message, leave
    DisableButton(giFilesPageButtons[0]);
    DisableButton(giFilesPageButtons[1]);
    ButtonList[giFilesPageButtons[0]]->uiFlags &= ~(BUTTON_CLICKED_ON);
    ButtonList[giFilesPageButtons[1]]->uiFlags &= ~(BUTTON_CLICKED_ON);

    return;
  }

  // turn off previous page button
  if (giFilesPage == 0) {
    DisableButton(giFilesPageButtons[0]);
    ButtonList[giFilesPageButtons[0]]->uiFlags &= ~(BUTTON_CLICKED_ON);
  } else {
    EnableButton(giFilesPageButtons[0]);
  }

  // turn off next page button
  if (fOnLastFilesPageFlag == TRUE) {
    DisableButton(giFilesPageButtons[1]);
    ButtonList[giFilesPageButtons[1]]->uiFlags &= ~(BUTTON_CLICKED_ON);
  } else {
    EnableButton(giFilesPageButtons[1]);
  }

  return;
}

function CreateRecordWidth(iRecordNumber: INT32, iRecordWidth: INT32, iRecordHeightAdjustment: INT32, ubFlags: UINT8): FileRecordWidthPtr {
  let pTempRecord: FileRecordWidthPtr = NULL;

  // allocs and inits a width info record for the multipage file viewer...this will tell the procedure that does inital computation on which record is the start of the current page
  // how wide special records are ( ones that share space with pictures )
  pTempRecord = MemAlloc(sizeof(FileRecordWidth));

  pTempRecord->Next = NULL;
  pTempRecord->iRecordNumber = iRecordNumber;
  pTempRecord->iRecordWidth = iRecordWidth;
  pTempRecord->iRecordHeightAdjustment = iRecordHeightAdjustment;
  pTempRecord->ubFlags = ubFlags;

  return pTempRecord;
}

function CreateWidthRecordsForAruloIntelFile(): FileRecordWidthPtr {
  // this fucntion will create the width list for the Arulco intelligence file
  let pTempRecord: FileRecordWidthPtr = NULL;
  let pRecordListHead: FileRecordWidthPtr = NULL;

  // first record width
  //	pTempRecord = CreateRecordWidth( 7, 350, 200,0 );
  pTempRecord = CreateRecordWidth(FILES_COUNTER_1_WIDTH, 350, MAX_FILE_MESSAGE_PAGE_SIZE, 0);

  // set up head of list now
  pRecordListHead = pTempRecord;

  // next record
  //	pTempRecord -> Next = CreateRecordWidth( 43, 200,0, 0 );
  pTempRecord->Next = CreateRecordWidth(FILES_COUNTER_2_WIDTH, 200, 0, 0);
  pTempRecord = pTempRecord->Next;

  // and the next..
  //	pTempRecord -> Next = CreateRecordWidth( 45, 200,0, 0 );
  pTempRecord->Next = CreateRecordWidth(FILES_COUNTER_3_WIDTH, 200, 0, 0);
  pTempRecord = pTempRecord->Next;

  return pRecordListHead;
}

function CreateWidthRecordsForTerroristFile(): FileRecordWidthPtr {
  // this fucntion will create the width list for the Arulco intelligence file
  let pTempRecord: FileRecordWidthPtr = NULL;
  let pRecordListHead: FileRecordWidthPtr = NULL;

  // first record width
  pTempRecord = CreateRecordWidth(4, 170, 0, 0);

  // set up head of list now
  pRecordListHead = pTempRecord;

  // next record
  pTempRecord->Next = CreateRecordWidth(5, 170, 0, 0);
  pTempRecord = pTempRecord->Next;

  pTempRecord->Next = CreateRecordWidth(6, 170, 0, 0);
  pTempRecord = pTempRecord->Next;

  return pRecordListHead;
}

function ClearOutWidthRecordsList(pFileRecordWidthList: FileRecordWidthPtr): void {
  let pTempRecord: FileRecordWidthPtr = NULL;
  let pDeleteRecord: FileRecordWidthPtr = NULL;

  // set up to head of the list
  pTempRecord = pDeleteRecord = pFileRecordWidthList;

  // error check
  if (pFileRecordWidthList == NULL) {
    return;
  }

  while (pTempRecord->Next) {
    // set up delete record
    pDeleteRecord = pTempRecord;

    // move to next record
    pTempRecord = pTempRecord->Next;

    MemFree(pDeleteRecord);
  }

  // now get the last element
  MemFree(pTempRecord);

  // null out passed ptr
  pFileRecordWidthList = NULL;

  return;
}

function OpenFirstUnreadFile(): void {
  // open the first unread file in the list
  let iCounter: INT32 = 0;
  let pFilesList: FilesUnitPtr = pFilesListHead;

  // make sure is a valid
  while (pFilesList) {
    // if iCounter = iFileId, is a valid file
    if (pFilesList->fRead == FALSE) {
      iHighLightFileLine = iCounter;
    }

    // next element in list
    pFilesList = pFilesList->Next;

    // increment counter
    iCounter++;
  }

  return;
}

function CheckForUnreadFiles(): void {
  let fStatusOfNewFileFlag: BOOLEAN = fNewFilesInFileViewer;

  // willc heck for any unread files and set flag if any
  let pFilesList: FilesUnitPtr = pFilesListHead;

  fNewFilesInFileViewer = FALSE;

  while (pFilesList) {
    // unread?...if so, set flag
    if (pFilesList->fRead == FALSE) {
      fNewFilesInFileViewer = TRUE;
    }
    // next element in list
    pFilesList = pFilesList->Next;
  }

  // if the old flag and the new flag arent the same, either create or destory the fast help region
  if (fNewFilesInFileViewer != fStatusOfNewFileFlag) {
    CreateFileAndNewEmailIconFastHelpText(LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_FILE, !fNewFilesInFileViewer);
  }
}

function HandleSpecialTerroristFile(iFileNumber: INT32, sPictureName: STR): BOOLEAN {
  let iCounter: INT32 = 0;
  let sString: wchar_t[] /* [2048] */;
  let pTempString: FileStringPtr = NULL;
  let pLocatorString: FileStringPtr = NULL;
  let iTotalYPosition: INT32 = 0;
  let iYPositionOnPage: INT32 = 0;
  let iFileLineWidth: INT32 = 0;
  let iFileStartX: INT32 = 0;
  let uiFlags: UINT32 = 0;
  let uiFont: UINT32 = 0;
  let fGoingOffCurrentPage: BOOLEAN = FALSE;
  let WidthList: FileRecordWidthPtr = NULL;
  let iOffset: INT32 = 0;
  let uiPicture: UINT32;
  let hHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;
  let sTemp: CHAR[] /* [128] */;

  iOffset = ubFileOffsets[iFileNumber];

  // grab width list
  WidthList = CreateWidthRecordsForTerroristFile();

  while (iCounter < ubFileRecordsLength[iFileNumber]) {
    LoadEncryptedDataFromFile("BINARYDATA\\files.EDT", sString, FILE_STRING_SIZE * (iOffset + iCounter) * 2, FILE_STRING_SIZE * 2);
    AddStringToFilesList(sString);
    iCounter++;
  }

  pTempString = pFileStringList;

  iYPositionOnPage = 0;
  iCounter = 0;
  pLocatorString = pTempString;

  pTempString = GetFirstStringOnThisPage(pFileStringList, FILES_TEXT_FONT, 350, FILE_GAP, giFilesPage, MAX_FILE_MESSAGE_PAGE_SIZE, WidthList);

  // find out where this string is
  while (pLocatorString != pTempString) {
    iCounter++;
    pLocatorString = pLocatorString->Next;
  }

  // move through list and display
  while (pTempString) {
    uiFlags = IAN_WRAP_NO_SHADOW;
    // copy over string
    wcscpy(sString, pTempString->pString);

    if (sString[0] == 0) {
      // on last page
      fOnLastFilesPageFlag = TRUE;
    }

    // set up font
    uiFont = FILES_TEXT_FONT;
    if (giFilesPage == 0) {
      switch (iCounter) {
        case (0):
          uiFont = FILES_TITLE_FONT;
          break;
      }
    }

    if ((iCounter > 3) && (iCounter < 7)) {
      iFileLineWidth = 170;
      iFileStartX = (FILE_VIEWER_X + 180);
    } else {
      // reset width
      iFileLineWidth = 350;
      iFileStartX = (FILE_VIEWER_X + 10);
    }

    // based on the record we are at, selected X start position and the width to wrap the line, to fit around pictures
    if ((iYPositionOnPage + IanWrappedStringHeight(0, 0, iFileLineWidth, FILE_GAP, uiFont, 0, sString, 0, 0, 0)) < MAX_FILE_MESSAGE_PAGE_SIZE) {
      // now print it
      iYPositionOnPage += IanDisplayWrappedString((iFileStartX), (FILE_VIEWER_Y + iYPositionOnPage), iFileLineWidth, FILE_GAP, uiFont, FILE_TEXT_COLOR, sString, 0, FALSE, uiFlags);

      fGoingOffCurrentPage = FALSE;
    } else {
      // gonna get cut off...end now
      fGoingOffCurrentPage = TRUE;
    }

    pTempString = pTempString->Next;

    if ((pTempString == NULL) && (fGoingOffCurrentPage == FALSE)) {
      // on last page
      fOnLastFilesPageFlag = TRUE;
    } else {
      fOnLastFilesPageFlag = FALSE;
    }

    // going over the edge, stop now
    if (fGoingOffCurrentPage == TRUE) {
      pTempString = NULL;
    }

    // show picture
    if ((giFilesPage == 0) && (iCounter == 5)) {
      if (usProfileIdsForTerroristFiles[iFileNumber + 1] < 100) {
        sprintf(sTemp, "%s%02d.sti", "FACES\\BIGFACES\\", usProfileIdsForTerroristFiles[iFileNumber + 1]);
      } else {
        sprintf(sTemp, "%s%03d.sti", "FACES\\BIGFACES\\", usProfileIdsForTerroristFiles[iFileNumber + 1]);
      }

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP(sTemp, VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(&VObjectDesc, &uiPicture));

      // Blt face to screen to
      GetVideoObject(&hHandle, uiPicture);

      // def: 3/24/99
      //				BltVideoObject(FRAME_BUFFER, hHandle, 0,( INT16 ) (  FILE_VIEWER_X +  30 ), ( INT16 ) ( iYPositionOnPage + 5), VO_BLT_SRCTRANSPARENCY,NULL);
      BltVideoObject(FRAME_BUFFER, hHandle, 0, (FILE_VIEWER_X + 30), (iYPositionOnPage + 21), VO_BLT_SRCTRANSPARENCY, NULL);

      DeleteVideoObjectFromIndex(uiPicture);

      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("LAPTOP\\InterceptBorder.sti", VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(&VObjectDesc, &uiPicture));

      // Blt face to screen to
      GetVideoObject(&hHandle, uiPicture);

      BltVideoObject(FRAME_BUFFER, hHandle, 0, (FILE_VIEWER_X + 25), (iYPositionOnPage + 16), VO_BLT_SRCTRANSPARENCY, NULL);

      DeleteVideoObjectFromIndex(uiPicture);
    }

    iCounter++;
  }

  ClearOutWidthRecordsList(WidthList);
  ClearFileStringList();

  return TRUE;
}

// add a file about this terrorist
function AddFileAboutTerrorist(iProfileId: INT32): BOOLEAN {
  let iCounter: INT32 = 0;

  for (iCounter = 1; iCounter < 7; iCounter++) {
    if (usProfileIdsForTerroristFiles[iCounter] == iProfileId) {
      // checked, and this file is there
      AddFilesToPlayersLog(iCounter, 0, 3, NULL, NULL);
      return TRUE;
    }
  }

  return FALSE;
}
