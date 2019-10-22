// static EmailPtr pEmailList;
let pEmailList: EmailPtr;
/* static */ let pPageList: PagePtr;
/* static */ let iLastPage: INT32 = -1;
/* static */ let iCurrentPage: INT32 = 0;
let iDeleteId: INT32 = 0;
let fUnReadMailFlag: BOOLEAN = FALSE;
let fOldUnreadFlag: BOOLEAN = TRUE;
let fNewMailFlag: BOOLEAN = FALSE;
let fOldNewMailFlag: BOOLEAN = FALSE;
let fDisplayMessageFlag: BOOLEAN = FALSE;
let fOldDisplayMessageFlag: BOOLEAN = FALSE;
let fReDraw: BOOLEAN = FALSE;
let fDeleteMailFlag: BOOLEAN = FALSE;
let fReDrawMessageFlag: BOOLEAN = FALSE;
let fOnLastPageFlag: BOOLEAN = FALSE;
let fJustStartedEmail: BOOLEAN = FALSE;
let fDeleteInternal: BOOLEAN = FALSE;
let fOpenMostRecentUnReadFlag: BOOLEAN = FALSE;
let iViewerPositionY: INT32 = 0;

let giMessageId: INT32 = -1;
let giPrevMessageId: INT32 = -1;
let giMessagePage: INT32 = -1;
let giNumberOfPagesToCurrentEmail: INT32 = -1;
let guiEmailWarning: UINT32;

const EMAIL_TOP_BAR_HEIGHT = 22;

const LIST_MIDDLE_COUNT = 18;
// object positions
const TITLE_X = 0 + LAPTOP_SCREEN_UL_X;
const TITLE_Y = 0 + LAPTOP_SCREEN_UL_Y;

const STAMP_X = 344 + LAPTOP_SCREEN_UL_X;
const STAMP_Y = 0 + LAPTOP_SCREEN_UL_Y;
/*
#define TOP_X 0+LAPTOP_SCREEN_UL_X
#define TOP_Y 62+LAPTOP_SCREEN_UL_Y

#define BOTTOM_X 0+LAPTOP_SCREEN_UL_X
#define BOTTOM_Y 359+LAPTOP_SCREEN_UL_Y
*/
const MIDDLE_X = 0 + LAPTOP_SCREEN_UL_X;
const MIDDLE_Y = 72 + EMAIL_TOP_BAR_HEIGHT;
const MIDDLE_WIDTH = 19;

// new graphics
const EMAIL_LIST_WINDOW_Y = 22;
const EMAIL_TITLE_BAR_X = 5;

// email columns
const SENDER_X = LAPTOP_SCREEN_UL_X + 65;
const SENDER_WIDTH = 246 - 158;

const DATE_X = LAPTOP_SCREEN_UL_X + 428;
const DATE_WIDTH = 592 - 527;

const SUBJECT_X = LAPTOP_SCREEN_UL_X + 175;
const SUBJECT_WIDTH = 254; // 526-245
const INDIC_X = 128;
const INDIC_WIDTH = 155 - 123;
const INDIC_HEIGHT = 145 - 128;

const LINE_WIDTH = 592 - 121;

const MESSAGE_X = 5; // 17
const MESSAGE_Y = 35;
const MESSAGE_WIDTH = 528 - 125; // 150
const MESSAGE_COLOR = FONT_BLACK;
const MESSAGE_GAP = 2;

const MESSAGE_HEADER_WIDTH = 209 - 151;
const MESSAGE_HEADER_X = VIEWER_X + 4;

const VIEWER_HEAD_X = 140;
const VIEWER_HEAD_Y = 9;
const VIEWER_HEAD_WIDTH = 445 - VIEWER_HEAD_X;
const MAX_BUTTON_COUNT = 1;
const VIEWER_WIDTH = 500;
const VIEWER_HEIGHT = 195;

const MESSAGEX_X = 425;
const MESSAGEX_Y = 6;

const EMAIL_WARNING_X = 210;
const EMAIL_WARNING_Y = 140;
const EMAIL_WARNING_WIDTH = 254;
const EMAIL_WARNING_HEIGHT = 138;

const NEW_BTN_X = EMAIL_WARNING_X + (338 - 245);
const NEW_BTN_Y = EMAIL_WARNING_Y + (278 - 195);

const EMAIL_TEXT_FONT = () => FONT10ARIAL();
const TRAVERSE_EMAIL_FONT = () => FONT14ARIAL();
const EMAIL_BOX_FONT = () => FONT14ARIAL();
const MESSAGE_FONT = () => EMAIL_TEXT_FONT();
const EMAIL_HEADER_FONT = () => FONT14ARIAL();
const EMAIL_WARNING_FONT = () => FONT12ARIAL();

// the max number of pages to an email
const MAX_NUMBER_EMAIL_PAGES = 100;

const PREVIOUS_PAGE = 0;
const NEXT_PAGE = 1;

const NEXT_PAGE_X = LAPTOP_UL_X + 562;
const NEXT_PAGE_Y = 51;

const PREVIOUS_PAGE_X = NEXT_PAGE_X - 21;
const PREVIOUS_PAGE_Y = NEXT_PAGE_Y;

const ENVELOPE_BOX_X = 116;

const FROM_BOX_X = 166;
const FROM_BOX_WIDTH = 246 - 160;

const SUBJECT_BOX_X = 276;
const SUBJECT_BOX_WIDTH = 528 - 249;

const DATE_BOX_X = 530;
const DATE_BOX_WIDTH = 594 - 530;

const FROM_BOX_Y = 51 + EMAIL_TOP_BAR_HEIGHT;
const TOP_HEIGHT = 118 - 95;

const EMAIL_TITLE_FONT = () => FONT14ARIAL();
const EMAIL_TITLE_X = 140;
const EMAIL_TITLE_Y = 33;
const VIEWER_MESSAGE_BODY_START_Y = VIEWER_Y + 72;
const MIN_MESSAGE_HEIGHT_IN_LINES = 5;

const INDENT_Y_OFFSET = 310;
const INDENT_X_OFFSET = 325;
const INDENT_X_WIDTH = (544 - 481);

// the position of the page number being displayed in the email program
const PAGE_NUMBER_X = 516;
const PAGE_NUMBER_Y = 58;

// defines for location of message 'title'/'headers'

const MESSAGE_FROM_Y = VIEWER_Y + 28;

const MESSAGE_DATE_Y = MESSAGE_FROM_Y;

const MESSAGE_SUBJECT_Y = MESSAGE_DATE_Y + 16;

const SUBJECT_LINE_X = VIEWER_X + 47;
const SUBJECT_LINE_Y = VIEWER_Y + 42;
const SUBJECT_LINE_WIDTH = 278 - 47;

// maximum size of a email message page, so not to overrun the bottom of the screen
const MAX_EMAIL_MESSAGE_PAGE_SIZE = () => (GetFontHeight(MESSAGE_FONT()) + MESSAGE_GAP) * 20;
const enum Enum72 {
  PREVIOUS_BUTTON = 0,
  NEXT_BUTTON,
}

// X button position
const BUTTON_X = VIEWER_X + 396;
const BUTTON_Y = VIEWER_Y + 3; // was + 25
const BUTTON_LOWER_Y = BUTTON_Y + 22;
const PREVIOUS_PAGE_BUTTON_X = VIEWER_X + 302;
const NEXT_PAGE_BUTTON_X = VIEWER_X + 395;
const DELETE_BUTTON_X = NEXT_PAGE_BUTTON_X;
const LOWER_BUTTON_Y = BUTTON_Y + 299;

let fSortDateUpwards: BOOLEAN = FALSE;
let fSortSenderUpwards: BOOLEAN = FALSE;
let fSortSubjectUpwards: BOOLEAN = FALSE;
let gfPageButtonsWereCreated: BOOLEAN = FALSE;

// mouse regions
let pEmailRegions: MOUSE_REGION[] /* [MAX_MESSAGES_PAGE] */;
let pScreenMask: MOUSE_REGION;
let pDeleteScreenMask: MOUSE_REGION;

// the email info struct to speed up email
let pEmailPageInfo: EmailPageInfoStruct[] /* [MAX_NUMBER_EMAIL_PAGES] */;

// buttons
let giMessageButton: INT32[] /* [MAX_BUTTON_COUNT] */;
let giMessageButtonImage: INT32[] /* [MAX_BUTTON_COUNT] */;
let giDeleteMailButton: INT32[] /* [2] */;
let giDeleteMailButtonImage: INT32[] /* [2] */;
let giSortButton: INT32[] /* [4] */;
let giSortButtonImage: INT32[] /* [4] */;
let giNewMailButton: INT32[] /* [1] */;
let giNewMailButtonImage: INT32[] /* [1] */;
let giMailMessageButtons: INT32[] /* [3] */;
let giMailMessageButtonsImage: INT32[] /* [3] */;
let giMailPageButtons: INT32[] /* [2] */;
let giMailPageButtonsImage: INT32[] /* [2] */;

// mouse regions
let pEmailMoveRegions: MOUSE_REGION[] /* [NEXT_BUTTON + 1] */;
let pSortMailRegions: MOUSE_REGION[] /* [3] */;

// the message record list, for the currently displayed message
let pMessageRecordList: RecordPtr = NULL;

// video handles
let guiEmailTitle: UINT32;
let guiEmailStamp: UINT32;
let guiEmailBackground: UINT32;
let guiEmailIndicator: UINT32;
let guiEmailMessage: UINT32;
let guiMAILDIVIDER: UINT32;

// the enumeration of headers
const enum Enum73 {
  FROM_HEADER = 0,
  SUBJECT_HEADER,
  RECD_HEADER,
}

// position of header text on the email list
const FROM_X = 205;
const FROM_Y = FROM_BOX_Y + 5;
const SUBJECTHEAD_X = 368;
const RECD_X = 550;

// size of prev/next strings
const PREVIOUS_WIDTH = () => StringPixLength(pTraverseStrings[PREVIOUS_BUTTON], TRAVERSE_EMAIL_FONT());
const NEXT_WIDTH = () => StringPixLength(pTraverseStrings[NEXT_BUTTON], TRAVERSE_EMAIL_FONT());
const PREVIOUS_HEIGHT = () => GetFontHeight(TRAVERSE_EMAIL_FONT());
const NEXT_HEIGHT = () => GetFontHeight(TRAVERSE_EMAIL_FONT());

// current line in the email list that is highlighted, -1 is no line highlighted
let iHighLightLine: INT32 = -1;

// whther or not we need to redraw the new mail box
let fReDrawNewMailFlag: BOOLEAN = FALSE;
let giNumberOfMessageToEmail: INT32 = 0;
let iTotalHeight: INT32 = 0;

let fFirstTime: BOOLEAN = TRUE;

function InitializeMouseRegions(): void {
  let iCounter: INT32 = 0;

  // init mouseregions
  for (iCounter = 0; iCounter < MAX_MESSAGES_PAGE; iCounter++) {
    MSYS_DefineRegion(&pEmailRegions[iCounter], MIDDLE_X, ((MIDDLE_Y + iCounter * MIDDLE_WIDTH)), MIDDLE_X + LINE_WIDTH, (MIDDLE_Y + iCounter * MIDDLE_WIDTH + MIDDLE_WIDTH), MSYS_PRIORITY_NORMAL + 2, MSYS_NO_CURSOR, EmailMvtCallBack, EmailBtnCallBack);
    MSYS_AddRegion(&pEmailRegions[iCounter]);
    MSYS_SetRegionUserData(&pEmailRegions[iCounter], 0, iCounter);
  }

  // SetUpSortRegions();

  CreateDestroyNextPreviousRegions();
}

function DeleteEmailMouseRegions(): void {
  // this function will remove the mouse regions added
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < MAX_MESSAGES_PAGE; iCounter++) {
    MSYS_RemoveRegion(&pEmailRegions[iCounter]);
  }
  // DeleteSortRegions();
  CreateDestroyNextPreviousRegions();
}
function GameInitEmail(): void {
  pEmailList = NULL;
  pPageList = NULL;

  iLastPage = -1;

  iCurrentPage = 0;
  iDeleteId = 0;

  // reset display message flag
  fDisplayMessageFlag = FALSE;

  // reset page being displayed
  giMessagePage = 0;
}

function EnterEmail(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  // load graphics

  iCurrentPage = LaptopSaveInfo.iCurrentEmailPage;

  // title bar
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\programtitlebar.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiEmailTitle));

  // the list background
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Mailwindow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiEmailBackground));

  // the indication/notification box
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\MailIndicator.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiEmailIndicator));

  // the message background
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\emailviewer.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiEmailMessage));

  // the message background
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\maillistdivider.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiMAILDIVIDER));

  // AddEmail(IMP_EMAIL_PROFILE_RESULTS, IMP_EMAIL_PROFILE_RESULTS_LENGTH, IMP_PROFILE_RESULTS, GetWorldTotalMin( ) );
  // initialize mouse regions
  InitializeMouseRegions();

  // just started email
  fJustStartedEmail = TRUE;

  // create buttons
  CreateMailScreenButtons();

  // marks these buttons dirty
  MarkButtonsDirty();

  // no longer fitrst time in email
  fFirstTime = FALSE;

  // reset current page of the message being displayed
  giMessagePage = 0;

  // render email background and text
  RenderEmail();

  // AddEmail( MERC_REPLY_GRIZZLY, MERC_REPLY_LENGTH_GRIZZLY, GRIZZLY_MAIL, GetWorldTotalMin() );
  // RenderButtons( );

  return TRUE;
}

function ExitEmail(): void {
  LaptopSaveInfo.iCurrentEmailPage = iCurrentPage;

  // clear out message record list
  ClearOutEmailMessageRecordsList();

  // displayed message?...get rid of it
  if (fDisplayMessageFlag) {
    fDisplayMessageFlag = FALSE;
    AddDeleteRegionsToMessageRegion(0);
    fDisplayMessageFlag = TRUE;
    fReDrawMessageFlag = TRUE;
  } else {
    giMessageId = -1;
  }

  // delete mail notice?...get rid of it
  if (fDeleteMailFlag) {
    fDeleteMailFlag = FALSE;
    CreateDestroyDeleteNoticeMailButton();
  }

  // remove all mouse regions in use in email
  DeleteEmailMouseRegions();

  // reset flags of new messages
  SetUnNewMessages();

  // remove video objects being used by email screen
  DeleteVideoObjectFromIndex(guiEmailTitle);
  DeleteVideoObjectFromIndex(guiEmailBackground);
  DeleteVideoObjectFromIndex(guiMAILDIVIDER);
  DeleteVideoObjectFromIndex(guiEmailIndicator);
  DeleteVideoObjectFromIndex(guiEmailMessage);

  // remove buttons
  DestroyMailScreenButtons();
}

function HandleEmail(): void {
  let iViewerY: INT32 = 0;
  /* static */ let fEmailListBeenDrawAlready: BOOLEAN = FALSE;
  // RenderButtonsFastHelp( );

  // check if email message record list needs to be updated
  UpDateMessageRecordList();

  // does email list need to be draw, or can be drawn
  if (((!fDisplayMessageFlag) && (!fNewMailFlag) && (!fDeleteMailFlag)) && (fEmailListBeenDrawAlready == FALSE)) {
    DisplayEmailList();
    fEmailListBeenDrawAlready = TRUE;
  }
  // if the message flag, show message
  else if ((fDisplayMessageFlag) && (fReDrawMessageFlag)) {
    // redisplay list
    DisplayEmailList();

    // this simply redraws message without button manipulation
    iViewerY = DisplayEmailMessage(GetEmailMessage(giMessageId));
    fEmailListBeenDrawAlready = FALSE;
  } else if ((fDisplayMessageFlag) && (!fOldDisplayMessageFlag)) {
    // redisplay list
    DisplayEmailList();

    // this simply redraws message with button manipulation
    iViewerY = DisplayEmailMessage(GetEmailMessage(giMessageId));
    AddDeleteRegionsToMessageRegion(iViewerY);
    fEmailListBeenDrawAlready = FALSE;
  }

  // not displaying anymore?
  if ((fDisplayMessageFlag == FALSE) && (fOldDisplayMessageFlag)) {
    // then clear it out
    ClearOutEmailMessageRecordsList();
  }

  // if new message is being displayed...check to see if it's buttons need to be created or destroyed
  AddDeleteRegionsToMessageRegion(0);

  // same with delete notice
  CreateDestroyDeleteNoticeMailButton();

  // if delete notice needs to be displayed?...display it
  if (fDeleteMailFlag)
    DisplayDeleteNotice(GetEmailMessage(iDeleteId));

  // update buttons
  HandleEmailViewerButtonStates();

  // set up icons for buttons
  SetUpIconForButton();

  // redraw screen
  // ReDraw();

  // redraw headers to sort buttons
  DisplayEmailHeaders();

  // handle buttons states
  UpdateStatusOfNextPreviousButtons();

  if (fOpenMostRecentUnReadFlag == TRUE) {
    // enter email due to email icon on program panel
    OpenMostRecentUnreadEmail();
    fOpenMostRecentUnReadFlag = FALSE;
  }

  return;
}

function DisplayEmailHeaders(): void {
  // draw the text at the top of the screen

  // font stuff
  SetFont(EMAIL_WARNING_FONT);
  SetFontShadow(NO_SHADOW);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  // draw headers to the email list the player sees

  // sender text
  // mprintf(FROM_X, FROM_Y, pEmailHeaders[FROM_HEADER]);

  // subject text
  // mprintf(SUBJECTHEAD_X, FROM_Y, pEmailHeaders[SUBJECT_HEADER]);

  // date re'vd
  // mprintf(RECD_X, FROM_Y, pEmailHeaders[RECD_HEADER]);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function RenderEmail(): void {
  let hHandle: HVOBJECT;
  let iCounter: INT32 = 0;

  // get and blt the email list background
  GetVideoObject(&hHandle, guiEmailBackground);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X, EMAIL_LIST_WINDOW_Y + LAPTOP_SCREEN_UL_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // get and blt the email title bar
  GetVideoObject(&hHandle, guiEmailTitle);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y - 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // show text on titlebar
  DisplayTextOnTitleBar();

  // redraw list if no graphics are being displayed on top of it
  // if((!fDisplayMessageFlag)&&(!fNewMailFlag))
  //{
  DisplayEmailList();
  //}

  // redraw line dividers
  DrawLineDividers();

  // show next/prev page buttons depending if there are next/prev page
  // DetermineNextPrevPageDisplay( );

  // draw headers for buttons
  DisplayEmailHeaders();

  // display border
  GetVideoObject(&hHandle, guiLaptopBACKGROUND);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, 108, 23, VO_BLT_SRCTRANSPARENCY, NULL);

  ReDisplayBoxes();

  BlitTitleBarIcons();

  // show which page we are on
  DisplayWhichPageOfEmailProgramIsDisplayed();

  InvalidateRegion(0, 0, 640, 480);
  // invalidate region to force update
  return;
}

function AddEmailWithSpecialData(iMessageOffset: INT32, iMessageLength: INT32, ubSender: UINT8, iDate: INT32, iFirstData: INT32, uiSecondData: UINT32): void {
  let pSubject: wchar_t[] /* [320] */;
  // MessagePtr pMessageList;
  // MessagePtr pMessage;
  // wchar_t pMessageString[320];
  let iPosition: INT32 = 0;
  let iCounter: INT32 = 1;
  let FakeEmail: Email;

  // starts at iSubjectOffset amd goes iSubjectLength, reading in string
  LoadEncryptedDataFromFile("BINARYDATA\\Email.edt", pSubject, 640 * (iMessageOffset), 640);

  // Make a fake email that will contain the codes ( ie the merc ID )
  FakeEmail.iFirstData = iFirstData;
  FakeEmail.uiSecondData = uiSecondData;

  // Replace the $mercname$ with the actual mercname
  ReplaceMercNameAndAmountWithProperData(pSubject, &FakeEmail);

  // add message to list
  AddEmailMessage(iMessageOffset, iMessageLength, pSubject, iDate, ubSender, FALSE, iFirstData, uiSecondData);

  // if we are in fact int he laptop, redraw icons, might be change in mail status

  if (fCurrentlyInLaptop == TRUE) {
    // redraw icons, might be new mail
    DrawLapTopIcons();
  }

  return;
}

function AddEmail(iMessageOffset: INT32, iMessageLength: INT32, ubSender: UINT8, iDate: INT32): void {
  let pSubject: wchar_t[] /* [320] */;
  // MessagePtr pMessageList;
  // MessagePtr pMessage;
  // wchar_t pMessageString[320];
  let iPosition: INT32 = 0;
  let iCounter: INT32 = 1;

  // starts at iSubjectOffset amd goes iSubjectLength, reading in string
  LoadEncryptedDataFromFile("BINARYDATA\\Email.edt", pSubject, 640 * (iMessageOffset), 640);

  // add message to list
  AddEmailMessage(iMessageOffset, iMessageLength, pSubject, iDate, ubSender, FALSE, 0, 0);

  // if we are in fact int he laptop, redraw icons, might be change in mail status

  if (fCurrentlyInLaptop == TRUE) {
    // redraw icons, might be new mail
    DrawLapTopIcons();
  }

  return;
}

function AddPreReadEmail(iMessageOffset: INT32, iMessageLength: INT32, ubSender: UINT8, iDate: INT32): void {
  let pSubject: wchar_t[] /* [320] */;
  // MessagePtr pMessageList;
  // MessagePtr pMessage;
  // wchar_t pMessageString[320];
  let iPosition: INT32 = 0;
  let iCounter: INT32 = 1;

  // starts at iSubjectOffset amd goes iSubjectLength, reading in string
  LoadEncryptedDataFromFile("BINARYDATA\\Email.edt", pSubject, 640 * (iMessageOffset), 640);

  // add message to list
  AddEmailMessage(iMessageOffset, iMessageLength, pSubject, iDate, ubSender, TRUE, 0, 0);

  // if we are in fact int he laptop, redraw icons, might be change in mail status

  if (fCurrentlyInLaptop == TRUE) {
    // redraw icons, might be new mail
    DrawLapTopIcons();
  }

  return;
}

function AddEmailMessage(iMessageOffset: INT32, iMessageLength: INT32, pSubject: STR16, iDate: INT32, ubSender: UINT8, fAlreadyRead: BOOLEAN, iFirstData: INT32, uiSecondData: UINT32): void {
  // will add a message to the list of messages
  let pEmail: EmailPtr = pEmailList;
  let pTempEmail: EmailPtr = NULL;
  let iCounter: UINT32 = 0;
  let iId: INT32 = 0;

  // run through list of messages, get id of oldest message
  if (pEmail) {
    while (pEmail) {
      if (pEmail.value.iId > iId)
        iId = pEmail.value.iId;
      pEmail = pEmail.value.Next;
    }
  }

  // reset pEmail
  pEmail = pEmailList;

  // move to end of list
  if (pEmail) {
    while (pEmail.value.Next)
      pEmail = pEmail.value.Next;
  }

  // add new element onto list
  pTempEmail = MemAlloc(sizeof(Email));
  // add in strings
  // while(pMessage !=NULL)
  //{
  // pTempEmail->pText[iCounter]=MemAlloc((wcslen(pMessage->pString)+2)*2);
  // wcscpy(pTempEmail->pText[iCounter],pMessage->pString);
  // pMessage=pMessage->Next;
  // iCounter++;
  //}
  // pTempEmail->pText[iCounter]=NULL;

  // copy subject
  pTempEmail.value.pSubject = MemAlloc(128 * 2);
  memset(pTempEmail.value.pSubject, 0, sizeof(CHAR16) * 128);
  wcscpy(pTempEmail.value.pSubject, pSubject);

  // copy offset and length of the actual message in email.edt
  pTempEmail.value.usOffset = iMessageOffset;
  pTempEmail.value.usLength = iMessageLength;

  // null out last byte of subject
  pTempEmail.value.pSubject[wcslen(pSubject) + 1] = 0;

  // set date and sender, Id
  if (pEmail)
    pTempEmail.value.iId = iId + 1;
  else
    pTempEmail.value.iId = 0;

  // copy date and sender id's
  pTempEmail.value.iDate = iDate;
  pTempEmail.value.ubSender = ubSender;

  // the special data
  pTempEmail.value.iFirstData = iFirstData;
  pTempEmail.value.uiSecondData = uiSecondData;

  // place into list
  if (pEmail) {
    // list exists, place at end
    pEmail.value.Next = pTempEmail;
    pTempEmail.value.Prev = pEmail;
  } else {
    // no list, becomes head of a new list
    pEmail = pTempEmail;
    pTempEmail.value.Prev = NULL;
    pEmailList = pEmail;
  }

  // reset Next ptr
  pTempEmail.value.Next = NULL;

  // set flag that new mail has arrived
  fNewMailFlag = TRUE;

  // add this message to the pages of email
  AddMessageToPages(pTempEmail.value.iId);

  // reset read flag of this particular message
  pTempEmail.value.fRead = fAlreadyRead;

  // set fact this message is new
  pTempEmail.value.fNew = TRUE;
  return;
}

function RemoveEmailMessage(iId: INT32): void {
  // run through list and remove message, update everyone afterwards
  let pEmail: EmailPtr = pEmailList;
  let pTempEmail: EmailPtr = NULL;
  let iCounter: INT32 = 0;

  // error check
  if (!pEmail)
    return;

  // look for message
  pEmail = GetEmailMessage(iId);
  // while((pEmail->iId !=iId)&&(pEmail -> Next))
  //	pEmail=pEmail->Next;

  // end of list, no mail found, leave
  if (!pEmail)
    return;
  // found

  // set tempt o current
  pTempEmail = pEmail;

  // check position of message in list
  if ((pEmail.value.Prev) && (pTempEmail.value.Next)) {
    // in the middle of the list
    pEmail = pEmail.value.Prev;
    pTempEmail = pTempEmail.value.Next;
    MemFree(pEmail.value.Next.value.pSubject);
    // while(pEmail->Next->pText[iCounter])
    //{
    // MemFree(pEmail->Next->pText[iCounter]);
    // iCounter++;
    //}
    MemFree(pEmail.value.Next);
    pEmail.value.Next = pTempEmail;
    pTempEmail.value.Prev = pEmail;
  } else if (pEmail.value.Prev) {
    // end of the list
    pEmail = pEmail.value.Prev;
    MemFree(pEmail.value.Next.value.pSubject);
    // while(pEmail->Next->pText[iCounter])
    //{
    // MemFree(pEmail->Next->pText[iCounter]);
    // iCounter++;
    //}
    MemFree(pEmail.value.Next);
    pEmail.value.Next = NULL;
  } else if (pTempEmail.value.Next) {
    // beginning of the list
    pEmail = pTempEmail;
    pTempEmail = pTempEmail.value.Next;
    MemFree(pEmail.value.pSubject);
    // while(pEmail->pText[iCounter])
    //{
    // MemFree(pEmail->pText[iCounter]);
    // iCounter++;
    //}
    MemFree(pEmail);
    pTempEmail.value.Prev = NULL;
    pEmailList = pTempEmail;
  } else {
    // all alone
    MemFree(pEmail.value.pSubject);
    //	while(pEmail->pText[iCounter])
    //{
    // MemFree(pEmail->pText[iCounter]);
    // iCounter++;
    //}
    MemFree(pEmail);
    pEmailList = NULL;
  }
}

function GetEmailMessage(iId: INT32): EmailPtr {
  let pEmail: EmailPtr = pEmailList;
  // return pointer to message with iId

  // invalid id
  if (iId == -1)
    return NULL;

  // invalid list
  if (pEmail == NULL) {
    return NULL;
  }

  // look for message
  while ((pEmail.value.iId != iId) && (pEmail.value.Next))
    pEmail = pEmail.value.Next;

  if ((pEmail.value.iId != iId) && (pEmail.value.Next == NULL)) {
    pEmail = NULL;
  }

  // no message, or is there?
  if (!pEmail)
    return NULL;
  else
    return pEmail;
}

function AddEmailPage(): void {
  // simple adds a page to the list
  let pPage: PagePtr = pPageList;
  if (pPage) {
    while (pPage.value.Next)
      pPage = pPage.value.Next;
  }

  if (pPage) {
    // there is a page, add current page after it
    pPage.value.Next = MemAlloc(sizeof(Page));
    pPage.value.Next.value.Prev = pPage;
    pPage = pPage.value.Next;
    pPage.value.Next = NULL;
    pPage.value.iPageId = pPage.value.Prev.value.iPageId + 1;
    memset(pPage.value.iIds, -1, sizeof(INT32) * MAX_MESSAGES_PAGE);
  } else {
    // page becomes head of page list
    pPageList = MemAlloc(sizeof(Page));
    pPage = pPageList;
    pPage.value.Prev = NULL;
    pPage.value.Next = NULL;
    pPage.value.iPageId = 0;
    memset(pPage.value.iIds, -1, sizeof(INT32) * MAX_MESSAGES_PAGE);
    pPageList = pPage;
  }
  iLastPage++;
  return;
}

function RemoveEmailPage(iPageId: INT32): void {
  let pPage: PagePtr = pPageList;
  let pTempPage: PagePtr = NULL;

  // run through list until page is matched, or out of pages
  while ((pPage.value.iPageId != iPageId) && (pPage))
    pPage = pPage.value.Next;

  // error check
  if (!pPage)
    return;

  // found
  pTempPage = pPage;
  if ((pPage.value.Prev) && (pTempPage.value.Next)) {
    // in the middle of the list
    pPage = pPage.value.Prev;
    pTempPage = pTempPage.value.Next;
    MemFree(pPage.value.Next);
    pPage.value.Next = pTempPage;
    pTempPage.value.Prev = pPage;
  } else if (pPage.value.Prev) {
    // end of the list
    pPage = pPage.value.Prev;
    MemFree(pPage.value.Next);
    pPage.value.Next = NULL;
  } else if (pTempPage.value.Next) {
    // beginning of the list
    pPage = pTempPage;
    pTempPage = pTempPage.value.Next;
    MemFree(pPage);
    pTempPage.value.Prev = NULL;
  } else {
    // all alone

    MemFree(pPage);
    pPageList = NULL;
  }
  if (iLastPage != 0)
    iLastPage--;
}

function AddMessageToPages(iMessageId: INT32): void {
  // go to end of page list
  let pPage: PagePtr = pPageList;
  let iCounter: INT32 = 0;
  if (!pPage)
    AddEmailPage();
  pPage = pPageList;
  while ((pPage.value.Next) && (pPage.value.iIds[MAX_MESSAGES_PAGE - 1] != -1))
    pPage = pPage.value.Next;
  // if list is full, add new page
  while (iCounter < MAX_MESSAGES_PAGE) {
    if (pPage.value.iIds[iCounter] == -1)
      break;
    iCounter++;
  }
  if (iCounter == MAX_MESSAGES_PAGE) {
    AddEmailPage();
    AddMessageToPages(iMessageId);
    return;
  } else {
    pPage.value.iIds[iCounter] = iMessageId;
  }
  return;
}

function SortMessages(iCriteria: INT32): void {
  let pA: EmailPtr = pEmailList;
  let pB: EmailPtr = pEmailList;
  let pSubjectA: CHAR16[] /* [256] */;
  let pSubjectB: CHAR16[] /* [256] */;
  let iId: INT32 = 0;

  // no messages to sort?
  if ((pA == NULL) || (pB == NULL)) {
    return;
  }

  // nothing here either?
  if (!pA.value.Next)
    return;

  pB = pA.value.Next;
  switch (iCriteria) {
    case RECEIVED:
      while (pA) {
        // set B to next in A
        pB = pA.value.Next;
        while (pB) {
          if (fSortDateUpwards) {
            // if date is lesser, swap
            if (pA.value.iDate > pB.value.iDate)
              SwapMessages(pA.value.iId, pB.value.iId);
          } else {
            // if date is lesser, swap
            if (pA.value.iDate < pB.value.iDate)
              SwapMessages(pA.value.iId, pB.value.iId);
          }

          // next in B's list
          pB = pB.value.Next;
        }

        // next in A's List
        pA = pA.value.Next;
      }
      break;
    case SENDER:
      while (pA) {
        pB = pA.value.Next;
        while (pB) {
          // lesser string?...need sorting
          if (fSortSenderUpwards) {
            if ((wcscmp(pSenderNameList[pA.value.ubSender], pSenderNameList[pB.value.ubSender])) < 0)
              SwapMessages(pA.value.iId, pB.value.iId);
          } else {
            if ((wcscmp(pSenderNameList[pA.value.ubSender], pSenderNameList[pB.value.ubSender])) > 0)
              SwapMessages(pA.value.iId, pB.value.iId);
          }
          // next in B's list
          pB = pB.value.Next;
        }
        // next in A's List
        pA = pA.value.Next;
      }
      break;
    case SUBJECT:
      while (pA) {
        pB = pA.value.Next;
        while (pB) {
          // clear out control codes
          CleanOutControlCodesFromString(pA.value.pSubject, pSubjectA);
          CleanOutControlCodesFromString(pB.value.pSubject, pSubjectB);

          // lesser string?...need sorting
          if (fSortSubjectUpwards) {
            if ((wcscmp(pA.value.pSubject, pB.value.pSubject)) < 0)
              SwapMessages(pA.value.iId, pB.value.iId);
          } else {
            if ((wcscmp(pA.value.pSubject, pB.value.pSubject)) > 0)
              SwapMessages(pA.value.iId, pB.value.iId);
          }
          // next in B's list
          pB = pB.value.Next;
        }
        // next in A's List
        pA = pA.value.Next;
      }
      break;

    case READ:
      while (pA) {
        pB = pA.value.Next;
        while (pB) {
          // one read and another not?...need sorting
          if ((pA.value.fRead) && (!(pB.value.fRead)))
            SwapMessages(pA.value.iId, pB.value.iId);

          // next in B's list
          pB = pB.value.Next;
        }
        // next in A's List
        pA = pA.value.Next;
      }
      break;
  }

  // place new list into pages of email
  // PlaceMessagesinPages();

  // redraw the screen
  fReDrawScreenFlag = TRUE;
}

function SwapMessages(iIdA: INT32, iIdB: INT32): void {
  // swaps locations of messages in the linked list
  let pA: EmailPtr = pEmailList;
  let pB: EmailPtr = pEmailList;
  let pTemp: EmailPtr = MemAlloc(sizeof(Email));
  pTemp.value.pSubject = MemAlloc(128 * 2);

  memset(pTemp.value.pSubject, 0, sizeof(CHAR16) * 128);

  if (!pA.value.Next)
    return;
  // find pA
  while (pA.value.iId != iIdA)
    pA = pA.value.Next;
  // find pB
  while (pB.value.iId != iIdB)
    pB = pB.value.Next;

  // swap

  // pTemp becomes pA
  pTemp.value.iId = pA.value.iId;
  pTemp.value.fRead = pA.value.fRead;
  pTemp.value.fNew = pA.value.fNew;
  pTemp.value.usOffset = pA.value.usOffset;
  pTemp.value.usLength = pA.value.usLength;
  pTemp.value.iDate = pA.value.iDate;
  pTemp.value.ubSender = pA.value.ubSender;
  wcscpy(pTemp.value.pSubject, pA.value.pSubject);

  // pA becomes pB
  pA.value.iId = pB.value.iId;
  pA.value.fRead = pB.value.fRead;
  pA.value.fNew = pB.value.fNew;
  pA.value.usOffset = pB.value.usOffset;
  pA.value.usLength = pB.value.usLength;
  pA.value.iDate = pB.value.iDate;
  pA.value.ubSender = pB.value.ubSender;
  wcscpy(pA.value.pSubject, pB.value.pSubject);

  // pB becomes pTemp
  pB.value.iId = pTemp.value.iId;
  pB.value.fRead = pTemp.value.fRead;
  pB.value.fNew = pTemp.value.fNew;
  pB.value.usOffset = pTemp.value.usOffset;
  pB.value.usLength = pTemp.value.usLength;
  pB.value.iDate = pTemp.value.iDate;
  pB.value.ubSender = pTemp.value.ubSender;
  wcscpy(pB.value.pSubject, pTemp.value.pSubject);

  // free up memory
  MemFree(pTemp.value.pSubject);
  MemFree(pTemp);
  return;
}

function ClearPages(): void {
  // run through list of message pages and set to -1
  let pPage: PagePtr = pPageList;

  // error check
  if (pPageList == NULL) {
    return;
  }

  while (pPage.value.Next) {
    pPage = pPage.value.Next;
    MemFree(pPage.value.Prev);
  }
  if (pPage)
    MemFree(pPage);
  pPageList = NULL;
  iLastPage = -1;

  return;
}

function PlaceMessagesinPages(): void {
  let pEmail: EmailPtr = pEmailList;
  // run through the list of messages and add to pages
  ClearPages();
  while (pEmail) {
    AddMessageToPages(pEmail.value.iId);
    pEmail = pEmail.value.Next;
  }
  if (iCurrentPage > iLastPage)
    iCurrentPage = iLastPage;
  return;
}

function DisplayMessageList(iPageNum: INT32): void {
  // will display page with idNumber iPageNum
  let pPage: PagePtr = pPageList;
  while (pPage.value.iPageId != iPageNum) {
    pPage = pPage.value.Next;
    if (!pPage)
      return;
  }
  // found page show it
  return;
}

function DrawLetterIcon(iCounter: INT32, fRead: BOOLEAN): void {
  let hHandle: HVOBJECT;
  // will draw the icon for letter in mail list depending if the mail has been read or not

  // grab video object
  GetVideoObject(&hHandle, guiEmailIndicator);

  // is it read or not?
  if (fRead)
    BltVideoObject(FRAME_BUFFER, hHandle, 0, INDIC_X, (MIDDLE_Y + iCounter * MIDDLE_WIDTH + 2), VO_BLT_SRCTRANSPARENCY, NULL);
  else
    BltVideoObject(FRAME_BUFFER, hHandle, 1, INDIC_X, (MIDDLE_Y + iCounter * MIDDLE_WIDTH + 2), VO_BLT_SRCTRANSPARENCY, NULL);
  return;
}

function DrawSubject(iCounter: INT32, pSubject: STR16, fRead: BOOLEAN): void {
  let pTempSubject: wchar_t[] /* [320] */;

  // draw subject line of mail being viewed in viewer

  // lock buffer to prevent overwrite
  SetFontDestBuffer(FRAME_BUFFER, SUBJECT_X, ((MIDDLE_Y + iCounter * MIDDLE_WIDTH)), SUBJECT_X + SUBJECT_WIDTH, ((MIDDLE_Y + iCounter * MIDDLE_WIDTH)) + MIDDLE_WIDTH, FALSE);
  SetFontShadow(NO_SHADOW);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  wcscpy(pTempSubject, pSubject);

  if (fRead) {
    // if the subject will be too long, cap it, and add the '...'
    if (StringPixLength(pTempSubject, MESSAGE_FONT) >= SUBJECT_WIDTH - 10) {
      ReduceStringLength(pTempSubject, SUBJECT_WIDTH - 10, MESSAGE_FONT);
    }

    // display string subject
    IanDisplayWrappedString(SUBJECT_X, ((4 + MIDDLE_Y + iCounter * MIDDLE_WIDTH)), SUBJECT_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR, pTempSubject, 0, FALSE, LEFT_JUSTIFIED);
  } else {
    // if the subject will be too long, cap it, and add the '...'
    if (StringPixLength(pTempSubject, FONT10ARIALBOLD) >= SUBJECT_WIDTH - 10) {
      ReduceStringLength(pTempSubject, SUBJECT_WIDTH - 10, FONT10ARIALBOLD);
    }

    // display string subject
    IanDisplayWrappedString(SUBJECT_X, ((4 + MIDDLE_Y + iCounter * MIDDLE_WIDTH)), SUBJECT_WIDTH, MESSAGE_GAP, FONT10ARIALBOLD, MESSAGE_COLOR, pTempSubject, 0, FALSE, LEFT_JUSTIFIED);
  }
  SetFontShadow(DEFAULT_SHADOW);
  // reset font dest buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);

  return;
}

function DrawSender(iCounter: INT32, ubSender: UINT8, fRead: BOOLEAN): void {
  // draw name of sender in mail viewer
  SetFontShadow(NO_SHADOW);

  SetFontShadow(NO_SHADOW);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  if (fRead) {
    SetFont(MESSAGE_FONT);
  } else {
    SetFont(FONT10ARIALBOLD);
  }

  mprintf(SENDER_X, ((4 + MIDDLE_Y + iCounter * MIDDLE_WIDTH)), pSenderNameList[ubSender]);

  SetFont(MESSAGE_FONT);
  SetFontShadow(DEFAULT_SHADOW);
  return;
}

function DrawDate(iCounter: INT32, iDate: INT32, fRead: BOOLEAN): void {
  let sString: wchar_t[] /* [20] */;

  SetFontShadow(NO_SHADOW);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  if (fRead) {
    SetFont(MESSAGE_FONT);
  } else {
    SetFont(FONT10ARIALBOLD);
  }
  // draw date of message being displayed in mail viewer
  swprintf(sString, "%s %d", pDayStrings[0], iDate / (24 * 60));
  mprintf(DATE_X, ((4 + MIDDLE_Y + iCounter * MIDDLE_WIDTH)), sString);

  SetFont(MESSAGE_FONT);
  SetFontShadow(DEFAULT_SHADOW);
  return;
}

function DisplayEmailList(): void {
  let iCounter: INT32 = 0;
  // look at current page, and display
  let pPage: PagePtr = pPageList;
  let pEmail: EmailPtr = NULL;

  // error check, if no page, return
  if (!pPage)
    return;

  // if current page ever ends up negative, reset to 0
  if (iCurrentPage == -1)
    iCurrentPage = 0;

  // loop until we get to the current page
  while ((pPage.value.iPageId != iCurrentPage) && (iCurrentPage <= iLastPage))
    pPage = pPage.value.Next;

  // now we have current page, display it
  pEmail = GetEmailMessage(pPage.value.iIds[iCounter]);
  SetFontShadow(NO_SHADOW);
  SetFont(EMAIL_TEXT_FONT);

  // draw each line of the list for this page
  while (pEmail) {
    // highlighted message, set text of message in list to blue
    if (iCounter == iHighLightLine) {
      SetFontForeground(FONT_BLUE);
    } else if (pEmail.value.fRead) {
      // message has been read, reset color to black
      SetFontForeground(FONT_BLACK);
      // SetFontBackground(FONT_BLACK);
    } else {
      // defualt, message is not read, set font red
      SetFontForeground(FONT_RED);
      // SetFontBackground(FONT_BLACK);
    }
    SetFontBackground(FONT_BLACK);

    // draw the icon, sender, date, subject
    DrawLetterIcon(iCounter, pEmail.value.fRead);
    DrawSubject(iCounter, pEmail.value.pSubject, pEmail.value.fRead);
    DrawSender(iCounter, pEmail.value.ubSender, pEmail.value.fRead);
    DrawDate(iCounter, pEmail.value.iDate, pEmail.value.fRead);

    iCounter++;

    // too many messages onthis page, reset pEmail, so no more are drawn
    if (iCounter >= MAX_MESSAGES_PAGE)
      pEmail = NULL;
    else
      pEmail = GetEmailMessage(pPage.value.iIds[iCounter]);
  }

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_LR_Y);

  SetFontShadow(DEFAULT_SHADOW);
  return;
}

function LookForUnread(): void {
  let fStatusOfNewEmailFlag: BOOLEAN = fUnReadMailFlag;

  // simply runrs through list of messages, if any unread, set unread flag

  let pA: EmailPtr = pEmailList;

  // reset unread flag
  fUnReadMailFlag = FALSE;

  // look for unread mail
  while (pA) {
    // unread mail found, set flag
    if (!(pA.value.fRead))
      fUnReadMailFlag = TRUE;
    pA = pA.value.Next;
  }

  if (fStatusOfNewEmailFlag != fUnReadMailFlag) {
    // Since there is no new email, get rid of the hepl text
    CreateFileAndNewEmailIconFastHelpText(LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_MAIL, !fUnReadMailFlag);
  }

  return;
}

function EmailBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iCount: INT32;
  let pPage: PagePtr = pPageList;
  let iId: INT32 = 0;
  let pEmail: EmailPtr = NULL;
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (fDisplayMessageFlag)
    return;
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // error check
    iCount = MSYS_GetRegionUserData(pRegion, 0);
    // check for valid email
    // find surrent page
    if (!pPage)
      return;
    while ((pPage.value.Next) && (pPage.value.iPageId != iCurrentPage))
      pPage = pPage.value.Next;
    if (!pPage)
      return;
    // found page

    // get id for element iCount
    iId = pPage.value.iIds[iCount];

    // invalid message
    if (iId == -1) {
      fDisplayMessageFlag = FALSE;
      return;
    }
    // Get email and display
    fDisplayMessageFlag = TRUE;
    giMessagePage = 0;
    giPrevMessageId = giMessageId;
    giMessageId = iId;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    iCount = MSYS_GetRegionUserData(pRegion, 0);

    // error check
    if (!pPage) {
      HandleRightButtonUpEvent();
      return;
    }

    giMessagePage = 0;

    while ((pPage.value.Next) && (pPage.value.iPageId != iCurrentPage))
      pPage = pPage.value.Next;
    if (!pPage) {
      HandleRightButtonUpEvent();
      return;
    }
    // found page
    // get id for element iCount
    iId = pPage.value.iIds[iCount];
    if (!GetEmailMessage(iId)) {
      // no mail here, handle right button up event
      HandleRightButtonUpEvent();
      return;
    } else {
      fDeleteMailFlag = TRUE;
      iDeleteId = iId;
      // DisplayDeleteNotice(GetEmailMessage(iDeleteId));
      // DeleteEmail();
    }
  }
}
function EmailMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (fDisplayMessageFlag)
    return;
  if (iReason == MSYS_CALLBACK_REASON_MOVE) {
    // set highlight to current regions data, this is the message to display
    iHighLightLine = MSYS_GetRegionUserData(pRegion, 0);
  }
  if (iReason == MSYS_CALLBACK_REASON_LOST_MOUSE) {
    // reset highlight line to invalid message
    iHighLightLine = -1;
  }
}

function BtnMessageXCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if ((reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) || (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN)) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_UP) || (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // X button has been pressed and let up, this means to stop displaying the currently displayed message

      // reset display message flag
      fDisplayMessageFlag = FALSE;

      // reset button flag
      btn.value.uiFlags &= ~BUTTON_CLICKED_ON;

      // reset page being displayed
      giMessagePage = 0;

      // redraw icons
      DrawLapTopIcons();

      // force update of entire screen
      fPausedReDrawScreenFlag = TRUE;

      // rerender email
      // RenderEmail();
    }
  }
}

function SetUnNewMessages(): void {
  // on exit from the mailer, set all new messages as 'un'new
  let pEmail: EmailPtr = pEmailList;
  // run through the list of messages and add to pages

  while (pEmail) {
    pEmail.value.fNew = FALSE;
    pEmail = pEmail.value.Next;
  }
  return;
}

function DisplayEmailMessage(pMail: EmailPtr): INT32 {
  let hHandle: HVOBJECT;
  let iCnt: INT32 = 0;
  let iHeight: INT32 = 0;
  let iCounter: INT32 = 1;
  //	wchar_t pString[MAIL_STRING_SIZE/2 + 1];
  let pString: wchar_t[] /* [MAIL_STRING_SIZE] */;
  let iOffSet: INT32 = 0;
  let iHeightTemp: INT32 = 0;
  let iHeightSoFar: INT32 = 0;
  let pTempRecord: RecordPtr;
  let iPageSize: INT32 = 0;
  let iPastHeight: INT32 = 0;
  let iYPositionOnPage: INT32 = 0;
  let iTotalYPosition: INT32 = 0;
  let fGoingOffCurrentPage: BOOLEAN = FALSE;
  let fDonePrintingMessage: BOOLEAN = FALSE;

  if (!pMail)
    return 0;

  iOffSet = pMail.value.usOffset;

  // reset redraw email message flag
  fReDrawMessageFlag = FALSE;

  // we KNOW the player is going to "read" this, so mark it as so
  pMail.value.fRead = TRUE;

  // draw text for title bar
  // swprintf(pString, L"%s / %s", pSenderNameList[pMail->ubSender],pMail->pSubject);
  // DisplayWrappedString(VIEWER_X+VIEWER_HEAD_X+4, VIEWER_Y+VIEWER_HEAD_Y+4, VIEWER_HEAD_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR, pString, 0,FALSE,0);

  // increment height for size of one line
  iHeight += GetFontHeight(MESSAGE_FONT);

  // is there any special event meant for this mail?..if so, handle it
  HandleAnySpecialEmailMessageEvents(iOffSet);

  HandleMailSpecialMessages((iOffSet), &iViewerPositionY, pMail);

  PreProcessEmail(pMail);

  pTempRecord = pMessageRecordList;

  // blt in top line of message as a blank graphic
  // get a handle to the bitmap of EMAIL VIEWER Background
  GetVideoObject(&hHandle, guiEmailMessage);

  // place the graphic on the frame buffer
  BltVideoObject(FRAME_BUFFER, hHandle, 1, VIEWER_X, VIEWER_MESSAGE_BODY_START_Y + iViewerPositionY, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(FRAME_BUFFER, hHandle, 1, VIEWER_X, VIEWER_MESSAGE_BODY_START_Y + GetFontHeight(MESSAGE_FONT) + iViewerPositionY, VO_BLT_SRCTRANSPARENCY, NULL);

  // set shadow
  SetFontShadow(NO_SHADOW);

  // get a handle to the bitmap of EMAIL VIEWER
  GetVideoObject(&hHandle, guiEmailMessage);

  // place the graphic on the frame buffer
  BltVideoObject(FRAME_BUFFER, hHandle, 0, VIEWER_X, VIEWER_Y + iViewerPositionY, VO_BLT_SRCTRANSPARENCY, NULL);

  // the icon for the title of this box
  GetVideoObject(&hHandle, guiTITLEBARICONS);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, VIEWER_X + 5, VIEWER_Y + iViewerPositionY + 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // display header text
  DisplayEmailMessageSubjectDateFromLines(pMail, iViewerPositionY);

  // display title text
  DrawEmailMessageDisplayTitleText(iViewerPositionY);

  iCounter = 0;
  // now blit the text background based on height
  for (iCounter = 2; iCounter < ((iTotalHeight) / (GetFontHeight(MESSAGE_FONT))); iCounter++) {
    // get a handle to the bitmap of EMAIL VIEWER Background
    GetVideoObject(&hHandle, guiEmailMessage);

    // place the graphic on the frame buffer
    BltVideoObject(FRAME_BUFFER, hHandle, 1, VIEWER_X, iViewerPositionY + VIEWER_MESSAGE_BODY_START_Y + ((GetFontHeight(MESSAGE_FONT)) * (iCounter)), VO_BLT_SRCTRANSPARENCY, NULL);
  }

  // now the bottom piece to the message viewer
  GetVideoObject(&hHandle, guiEmailMessage);

  if (giNumberOfPagesToCurrentEmail <= 2) {
    // place the graphic on the frame buffer
    BltVideoObject(FRAME_BUFFER, hHandle, 2, VIEWER_X, iViewerPositionY + VIEWER_MESSAGE_BODY_START_Y + ((GetFontHeight(MESSAGE_FONT)) * (iCounter)), VO_BLT_SRCTRANSPARENCY, NULL);
  } else {
    // place the graphic on the frame buffer
    BltVideoObject(FRAME_BUFFER, hHandle, 3, VIEWER_X, iViewerPositionY + VIEWER_MESSAGE_BODY_START_Y + ((GetFontHeight(MESSAGE_FONT)) * (iCounter)), VO_BLT_SRCTRANSPARENCY, NULL);
  }

  // reset iCounter and iHeight
  iCounter = 1;
  iHeight = GetFontHeight(MESSAGE_FONT);

  // draw body of text. Any particular email can encompass more than one "record" in the
  // email file. Draw each record (length is number of records)

  // now place the text

  // reset ptemprecord to head of list
  pTempRecord = pMessageRecordList;
  // reset shadow
  SetFontShadow(NO_SHADOW);

  pTempRecord = pEmailPageInfo[giMessagePage].pFirstRecord;

  if (pTempRecord) {
    while (fDonePrintingMessage == FALSE) {
      // copy over string
      wcscpy(pString, pTempRecord.value.pRecord);

      // get the height of the string, ONLY!...must redisplay ON TOP OF background graphic
      iHeight += IanDisplayWrappedString(VIEWER_X + MESSAGE_X + 4, (VIEWER_MESSAGE_BODY_START_Y + iHeight + iViewerPositionY), MESSAGE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR, pString, 0, FALSE, IAN_WRAP_NO_SHADOW);

      // increment email record ptr
      pTempRecord = pTempRecord.value.Next;

      if (pTempRecord == NULL) {
        fDonePrintingMessage = TRUE;
      } else if ((pTempRecord == pEmailPageInfo[giMessagePage].pLastRecord) && (pEmailPageInfo[giMessagePage + 1].pFirstRecord != NULL)) {
        fDonePrintingMessage = TRUE;
      }
    }
  }

  /*
  if(iTotalHeight < MAX_EMAIL_MESSAGE_PAGE_SIZE)
  {
          fOnLastPageFlag = TRUE;
    while( pTempRecord )
          {
// copy over string
            wcscpy( pString, pTempRecord -> pRecord );

      // get the height of the string, ONLY!...must redisplay ON TOP OF background graphic
      iHeight += IanDisplayWrappedString(VIEWER_X + MESSAGE_X + 4, ( UINT16 )( VIEWER_MESSAGE_BODY_START_Y + iHeight + iViewerPositionY), MESSAGE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR,pString,0,FALSE, IAN_WRAP_NO_SHADOW);

                  // increment email record ptr
            pTempRecord = pTempRecord -> Next;
          }


  }
  else
  {

          iYPositionOnPage = 0;
          // go to the right record
          pTempRecord = GetFirstRecordOnThisPage( pMessageRecordList, MESSAGE_FONT, MESSAGE_WIDTH, MESSAGE_GAP, giMessagePage, MAX_EMAIL_MESSAGE_PAGE_SIZE );
while( pTempRecord )
          {
                  // copy over string
            wcscpy( pString, pTempRecord -> pRecord );

                  if( pString[ 0 ] == 0 )
                  {
                          // on last page
                          fOnLastPageFlag = TRUE;
                  }


                  if( ( iYPositionOnPage + IanWrappedStringHeight(0, 0, MESSAGE_WIDTH, MESSAGE_GAP,
                                                                                                                    MESSAGE_FONT, 0, pTempRecord->pRecord,
                                                                                                                   0, 0, 0 ) )  <= MAX_EMAIL_MESSAGE_PAGE_SIZE  )
                  {
    // now print it
              iYPositionOnPage += IanDisplayWrappedString(VIEWER_X + MESSAGE_X + 4, ( UINT16 )( VIEWER_MESSAGE_BODY_START_Y + 10 +iYPositionOnPage + iViewerPositionY), MESSAGE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR,pString,0,FALSE, IAN_WRAP_NO_SHADOW);
                          fGoingOffCurrentPage = FALSE;
                  }
                  else
                  {
                          // gonna get cut off...end now
                          fGoingOffCurrentPage = TRUE;
                  }


                  pTempRecord = pTempRecord ->Next;


                  if( ( pTempRecord == NULL ) && ( fGoingOffCurrentPage == FALSE ) )
                  {
                          // on last page
                          fOnLastPageFlag = TRUE;
                  }
                  else
                  {
                          fOnLastPageFlag = FALSE;
                  }

                  // record get cut off?...end now

                  if( fGoingOffCurrentPage == TRUE )
                  {
                          pTempRecord = NULL;
                  }
          }

  }

  */
  // show number of pages to this email
  DisplayNumberOfPagesToThisEmail(iViewerPositionY);

  // mark this area dirty
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_LR_Y);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return iViewerPositionY;
}

function BtnNewOkback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fNewMailFlag = FALSE;
    }
  }
}

function AddDeleteRegionsToMessageRegion(iViewerY: INT32): void {
  // will create/destroy mouse region for message display

  if ((fDisplayMessageFlag) && (!fOldDisplayMessageFlag)) {
    // set old flag
    fOldDisplayMessageFlag = TRUE;

    // add X button
    giMessageButtonImage[0] = LoadButtonImage("LAPTOP\\X.sti", -1, 0, -1, 1, -1);
    giMessageButton[0] = QuickCreateButton(giMessageButtonImage[0], BUTTON_X + 2, (BUTTON_Y + iViewerY + 1), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnMessageXCallback);
    SetButtonCursor(giMessageButton[0], CURSOR_LAPTOP_SCREEN);

    if (giNumberOfPagesToCurrentEmail > 2) {
      // add next and previous mail page buttons
      giMailMessageButtonsImage[0] = LoadButtonImage("LAPTOP\\NewMailButtons.sti", -1, 0, -1, 3, -1);
      giMailMessageButtons[0] = QuickCreateButton(giMailMessageButtonsImage[0], PREVIOUS_PAGE_BUTTON_X, (LOWER_BUTTON_Y + iViewerY + 2), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnPreviousEmailPageCallback);

      giMailMessageButtonsImage[1] = LoadButtonImage("LAPTOP\\NewMailButtons.sti", -1, 1, -1, 4, -1);
      giMailMessageButtons[1] = QuickCreateButton(giMailMessageButtonsImage[1], NEXT_PAGE_BUTTON_X, (LOWER_BUTTON_Y + iViewerY + 2), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnNextEmailPageCallback);

      gfPageButtonsWereCreated = TRUE;
    }

    giMailMessageButtonsImage[2] = LoadButtonImage("LAPTOP\\NewMailButtons.sti", -1, 2, -1, 5, -1);
    giMailMessageButtons[2] = QuickCreateButton(giMailMessageButtonsImage[2], DELETE_BUTTON_X, (BUTTON_LOWER_Y + iViewerY + 2), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnDeleteCallback);
    /*
                    // set up disable methods
                    SpecifyDisabledButtonStyle( giMailMessageButtons[1], DISABLED_STYLE_SHADED );
        SpecifyDisabledButtonStyle( giMailMessageButtons[0], DISABLED_STYLE_SHADED );
    */
    // set cursors
    SetButtonCursor(giMailMessageButtons[0], CURSOR_LAPTOP_SCREEN);
    SetButtonCursor(giMailMessageButtons[1], CURSOR_LAPTOP_SCREEN);
    SetButtonCursor(giMailMessageButtons[2], CURSOR_LAPTOP_SCREEN);
    SetButtonCursor(giMessageButton[0], CURSOR_LAPTOP_SCREEN);

    // force update of screen
    fReDrawScreenFlag = TRUE;
  } else if ((!fDisplayMessageFlag) && (fOldDisplayMessageFlag)) {
    // delete region
    fOldDisplayMessageFlag = FALSE;
    RemoveButton(giMessageButton[0]);
    UnloadButtonImage(giMessageButtonImage[0]);

    // net/previous email page buttons
    if (gfPageButtonsWereCreated) {
      RemoveButton(giMailMessageButtons[0]);
      UnloadButtonImage(giMailMessageButtonsImage[0]);
      RemoveButton(giMailMessageButtons[1]);
      UnloadButtonImage(giMailMessageButtonsImage[1]);
      gfPageButtonsWereCreated = FALSE;
    }
    RemoveButton(giMailMessageButtons[2]);
    UnloadButtonImage(giMailMessageButtonsImage[2]);
    // force update of screen
    fReDrawScreenFlag = TRUE;
  }
}

function CreateDestroyNewMailButton(): void {
  /* static */ let fOldNewMailFlag: BOOLEAN = FALSE;

  // check if we are video conferencing, if so, do nothing
  if (gubVideoConferencingMode != 0) {
    return;
  }

  if ((fNewMailFlag) && (!fOldNewMailFlag)) {
    // create new mail dialog box button

    // set old flag (stating button has been created)
    fOldNewMailFlag = TRUE;

    // load image and setup button
    giNewMailButtonImage[0] = LoadButtonImage("LAPTOP\\YesNoButtons.sti", -1, 0, -1, 1, -1);
    giNewMailButton[0] = QuickCreateButton(giNewMailButtonImage[0], NEW_BTN_X + 10, NEW_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, BtnGenericMouseMoveButtonCallback, BtnNewOkback);

    // set cursor
    SetButtonCursor(giNewMailButton[0], CURSOR_LAPTOP_SCREEN);

    // set up screen mask region
    MSYS_DefineRegion(&pScreenMask, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 3, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, LapTopScreenCallBack);
    MSYS_AddRegion(&pScreenMask);
    MarkAButtonDirty(giNewMailButton[0]);
    fReDrawScreenFlag = TRUE;
  } else if ((!fNewMailFlag) && (fOldNewMailFlag)) {
    // reset old flag
    fOldNewMailFlag = FALSE;

    // remove the button
    RemoveButton(giNewMailButton[0]);
    UnloadButtonImage(giNewMailButtonImage[0]);

    // remove screen mask
    MSYS_RemoveRegion(&pScreenMask);

    // re draw screen
    fReDraw = TRUE;

    // redraw screen
    fPausedReDrawScreenFlag = TRUE;
  }
}

function DisplayNewMailBox(): BOOLEAN {
  let hHandle: HVOBJECT;
  /* static */ let fOldNewMailFlag: BOOLEAN = FALSE;
  // will display a new mail box whenever new mail has arrived

  // check if we are video conferencing, if so, do nothing
  if (gubVideoConferencingMode != 0) {
    return FALSE;
  }

  // just stopped displaying box, reset old flag
  if ((!fNewMailFlag) && (fOldNewMailFlag)) {
    fOldNewMailFlag = FALSE;
    return FALSE;
  }

  // not even set, leave NOW!
  if (!fNewMailFlag)
    return FALSE;

  // is set but already drawn, LEAVE NOW!
  // if( ( fNewMailFlag ) && ( fOldNewMailFlag ) )
  //	return ( FALSE );

  GetVideoObject(&hHandle, guiEmailWarning);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, EMAIL_WARNING_X, EMAIL_WARNING_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // the icon for the title of this box
  GetVideoObject(&hHandle, guiTITLEBARICONS);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, EMAIL_WARNING_X + 5, EMAIL_WARNING_Y + 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // font stuff
  SetFont(EMAIL_HEADER_FONT);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(DEFAULT_SHADOW);

  // print warning
  mprintf(EMAIL_WARNING_X + 30, EMAIL_WARNING_Y + 8, pEmailTitleText[0]);

  // font stuff
  SetFontShadow(NO_SHADOW);
  SetFont(EMAIL_WARNING_FONT);
  SetFontForeground(FONT_BLACK);

  // printf warning string
  mprintf(EMAIL_WARNING_X + 60, EMAIL_WARNING_Y + 63, pNewMailStrings[0]);
  DrawLapTopIcons();

  // invalidate region
  InvalidateRegion(EMAIL_WARNING_X, EMAIL_WARNING_Y, EMAIL_WARNING_X + 270, EMAIL_WARNING_Y + 200);

  // mark button
  MarkAButtonDirty(giNewMailButton[0]);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  // redraw icons

  // set box as displayed
  fOldNewMailFlag = TRUE;

  // return
  return TRUE;
}

function ReDrawNewMailBox(): void {
  // this function will check to see if the new mail region needs to be redrawn
  if (fReDrawNewMailFlag == TRUE) {
    if (fNewMailFlag) {
      // set display flag back to orginal
      fNewMailFlag = FALSE;

      // display new mail box
      DisplayNewMailBox();

      // dirty buttons
      MarkAButtonDirty(giNewMailButton[0]);

      // set display flag back to orginal
      fNewMailFlag = TRUE;

      // time to redraw
      DisplayNewMailBox();
    }

    // return;

    // reset flag for redraw
    fReDrawNewMailFlag = FALSE;

    return;
  }
}

function SwitchEmailPages(): void {
  // this function will switch current page

  // gone too far, reset page to start
  if (iCurrentPage > iLastPage)
    iCurrentPage = 0;

  // set to last page
  if (iCurrentPage < 0)
    iCurrentPage = iLastPage;
  return;
}

function DetermineNextPrevPageDisplay(): void {
  // will determine which of previous and next page graphics to display

  if (iCurrentPage > 0) {
    // display Previous graphic

    // font stuff
    SetFont(TRAVERSE_EMAIL_FONT);
    SetFontForeground(FONT_RED);
    SetFontBackground(FONT_BLACK);

    // print previous string
    mprintf(PREVIOUS_PAGE_X, PREVIOUS_PAGE_Y, pTraverseStrings[PREVIOUS_PAGE]);
  }

  // less than last page, so there is a next page
  if (iCurrentPage < iLastPage) {
    // display Next graphic

    // font stuff
    SetFont(TRAVERSE_EMAIL_FONT);
    SetFontForeground(FONT_RED);
    SetFontBackground(FONT_BLACK);

    // next string
    mprintf(NEXT_PAGE_X, NEXT_PAGE_Y, pTraverseStrings[NEXT_PAGE]);
  }
}

function NextRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      // not on last page, move ahead one
      if (iCurrentPage < iLastPage) {
        iCurrentPage++;
        fReDraw = TRUE;
        RenderEmail();
        MarkButtonsDirty();
      }
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function BtnPreviousEmailPageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      if (giMessagePage > 0) {
        giMessagePage--;
      }

      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      fReDraw = TRUE;
      RenderEmail();
      MarkButtonsDirty();
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function BtnNextEmailPageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // not on last page, move ahead one
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

    if ((giNumberOfPagesToCurrentEmail - 1) <= giMessagePage) {
      return;
    }

    if (!(fOnLastPageFlag)) {
      if ((giNumberOfPagesToCurrentEmail - 1) > (giMessagePage + 1))
        giMessagePage++;
    }

    MarkButtonsDirty();
    fReDrawScreenFlag = TRUE;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function PreviousRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      // if we are not on forst page, more back one
      if (iCurrentPage > 0) {
        iCurrentPage--;
        fReDraw = TRUE;
        RenderEmail();
        MarkButtonsDirty();
      }
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function BtnDeleteNoback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fDeleteMailFlag = FALSE;
      fReDrawScreenFlag = TRUE;
    }
  }
}

function BtnDeleteYesback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fReDrawScreenFlag = TRUE;
      DeleteEmail();
    }
  }
}

function CreateDestroyNextPreviousRegions(): void {
  /* static */ let fCreated: BOOLEAN = FALSE;
  if (fCreated) {
    // destroy already create next, previous mouse regions
    fCreated = FALSE;

    RemoveButton(giMailPageButtons[1]);
    UnloadButtonImage(giMailPageButtonsImage[1]);

    RemoveButton(giMailPageButtons[0]);
    UnloadButtonImage(giMailPageButtonsImage[0]);
  } else {
    // create uncreated mouse regions
    fCreated = TRUE;

    CreateNextPreviousEmailPageButtons();

    /*
    // ' next' region
MSYS_DefineRegion(&pEmailMoveRegions[NEXT_BUTTON],NEXT_PAGE_X, NEXT_PAGE_Y,(INT16) (NEXT_PAGE_X+NEXT_WIDTH), (INT16)(NEXT_PAGE_Y+NEXT_HEIGHT),
            MSYS_PRIORITY_NORMAL+2,MSYS_NO_CURSOR, MSYS_NO_CALLBACK, NextRegionButtonCallback);

    // ' previous ' region
MSYS_DefineRegion(&pEmailMoveRegions[PREVIOUS_BUTTON],PREVIOUS_PAGE_X,PREVIOUS_PAGE_Y, (INT16)(PREVIOUS_PAGE_X+PREVIOUS_WIDTH),(INT16)(PREVIOUS_PAGE_Y+PREVIOUS_HEIGHT),
            MSYS_PRIORITY_NORMAL+2,MSYS_NO_CURSOR, MSYS_NO_CALLBACK, PreviousRegionButtonCallback );

    // add regions
    MSYS_AddRegion(&pEmailMoveRegions[PREVIOUS_BUTTON]);
MSYS_AddRegion(&pEmailMoveRegions[NEXT_BUTTON]);
    */
  }
}

function ReDraw(): void {
  // forces update of entire laptop screen
  if (fReDraw) {
    RenderLaptop();
    // EnterNewLaptopMode();
    DrawLapTopText();
    ReDrawHighLight();
    MarkButtonsDirty();
    fReDraw = FALSE;
  }
}

function CreateDestroyDeleteNoticeMailButton(): void {
  /* static */ let fOldDeleteMailFlag: BOOLEAN = FALSE;
  if ((fDeleteMailFlag) && (!fOldDeleteMailFlag)) {
    // confirm delete email buttons

    // YES button
    fOldDeleteMailFlag = TRUE;
    giDeleteMailButtonImage[0] = LoadButtonImage("LAPTOP\\YesNoButtons.sti", -1, 0, -1, 1, -1);
    giDeleteMailButton[0] = QuickCreateButton(giDeleteMailButtonImage[0], NEW_BTN_X + 1, NEW_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, BtnGenericMouseMoveButtonCallback, BtnDeleteYesback);

    // NO button
    giDeleteMailButtonImage[1] = LoadButtonImage("LAPTOP\\YesNoButtons.sti", -1, 2, -1, 3, -1);
    giDeleteMailButton[1] = QuickCreateButton(giDeleteMailButtonImage[1], NEW_BTN_X + 40, NEW_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 2, BtnGenericMouseMoveButtonCallback, BtnDeleteNoback);

    // set up cursors
    SetButtonCursor(giDeleteMailButton[0], CURSOR_LAPTOP_SCREEN);
    SetButtonCursor(giDeleteMailButton[1], CURSOR_LAPTOP_SCREEN);

    // set up screen mask to prevent other actions while delete mail box is destroyed
    MSYS_DefineRegion(&pDeleteScreenMask, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 3, CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, LapTopScreenCallBack);
    MSYS_AddRegion(&pDeleteScreenMask);

    // force update
    fReDrawScreenFlag = TRUE;
  } else if ((!fDeleteMailFlag) && (fOldDeleteMailFlag)) {
    // clear out the buttons and screen mask
    fOldDeleteMailFlag = FALSE;
    RemoveButton(giDeleteMailButton[0]);
    UnloadButtonImage(giDeleteMailButtonImage[0]);
    RemoveButton(giDeleteMailButton[1]);
    UnloadButtonImage(giDeleteMailButtonImage[1]);

    // the region
    MSYS_RemoveRegion(&pDeleteScreenMask);

    // force refresh
    fReDrawScreenFlag = TRUE;
  }
  return;
}
function DisplayDeleteNotice(pMail: EmailPtr): BOOLEAN {
  let hHandle: HVOBJECT;
  // will display a delete mail box whenever delete mail has arrived
  if (!fDeleteMailFlag)
    return FALSE;

  if (!fReDrawScreenFlag) {
    // no redraw flag, leave
    return FALSE;
  }

  // error check.. no valid message passed
  if (pMail == NULL) {
    return FALSE;
  }

  // load graphics

  GetVideoObject(&hHandle, guiEmailWarning);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, EMAIL_WARNING_X, EMAIL_WARNING_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // font stuff
  SetFont(EMAIL_HEADER_FONT);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(DEFAULT_SHADOW);

  // the icon for the title of this box
  GetVideoObject(&hHandle, guiTITLEBARICONS);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, EMAIL_WARNING_X + 5, EMAIL_WARNING_Y + 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // title
  mprintf(EMAIL_WARNING_X + 30, EMAIL_WARNING_Y + 8, pEmailTitleText[0]);

  // shadow, font, and foreground
  SetFontShadow(NO_SHADOW);
  SetFont(EMAIL_WARNING_FONT);
  SetFontForeground(FONT_BLACK);

  // draw text based on mail being read or not
  if ((pMail.value.fRead))
    mprintf(EMAIL_WARNING_X + 95, EMAIL_WARNING_Y + 65, pDeleteMailStrings[0]);
  else
    mprintf(EMAIL_WARNING_X + 70, EMAIL_WARNING_Y + 65, pDeleteMailStrings[1]);

  // invalidate screen area, for refresh

  if (!fNewMailFlag) {
    // draw buttons
    MarkButtonsDirty();
    InvalidateRegion(EMAIL_WARNING_X, EMAIL_WARNING_Y, EMAIL_WARNING_X + EMAIL_WARNING_WIDTH, EMAIL_WARNING_Y + EMAIL_WARNING_HEIGHT);
  }

  // reset font shadow
  SetFontShadow(DEFAULT_SHADOW);

  return TRUE;
}

function DeleteEmail(): void {
  // error check, invalid mail, or not time to delete mail
  if (fDeleteInternal != TRUE) {
    if ((iDeleteId == -1) || (!fDeleteMailFlag))
      return;
  }
  // remove the message
  RemoveEmailMessage(iDeleteId);

  // stop displaying message, if so
  fDisplayMessageFlag = FALSE;

  // upadte list
  PlaceMessagesinPages();

  // redraw icons (if deleted message was last unread, remove checkmark)
  DrawLapTopIcons();

  // if all of a sudden we are beyond last page, move back one
  if (iCurrentPage > iLastPage)
    iCurrentPage = iLastPage;

  // rerender mail list
  RenderEmail();

  // nolong time to delete mail
  fDeleteMailFlag = FALSE;
  fReDrawScreenFlag = TRUE;
  // refresh screen (get rid of dialog box image)
  // ReDraw();

  // invalidate
  InvalidateRegion(0, 0, 640, 480);
}

function FromCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // sort messages based on sender name, then replace into pages of email
    fSortSenderUpwards = !fSortSenderUpwards;

    SortMessages(SENDER);

    // SpecifyButtonIcon( giSortButton[1] , giArrowsForEmail, UINT16 usVideoObjectIndex,  INT8 bXOffset, INT8 bYOffset, TRUE );

    fJustStartedEmail = FALSE;

    PlaceMessagesinPages();
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
  }

  else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function SubjectCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // sort message on subject and reorder list
    fSortSubjectUpwards = !fSortSubjectUpwards;

    SortMessages(SUBJECT);
    fJustStartedEmail = FALSE;
    PlaceMessagesinPages();

    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function BtnDeleteCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    iDeleteId = giMessageId;
    fDeleteMailFlag = TRUE;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function DateCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // sort messages based on date recieved and reorder lsit
    fSortDateUpwards = !fSortDateUpwards;
    SortMessages(RECEIVED);
    PlaceMessagesinPages();

    fJustStartedEmail = FALSE;

    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function ReadCallback(btn: Pointer<GUI_BUTTON>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // sort messages based on date recieved and reorder lsit
    SortMessages(READ);
    PlaceMessagesinPages();

    fJustStartedEmail = FALSE;

    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // nothing yet
  }
}

function SetUpSortRegions(): void {
  // have been replaced by buttons
  return;

  // will set up sort mail regions

  // from region
  /*
        MSYS_DefineRegion(&pSortMailRegions[0],FROM_BOX_X ,FROM_BOX_Y, FROM_BOX_X+FROM_BOX_WIDTH ,FROM_BOX_Y+TOP_HEIGHT,
                        MSYS_PRIORITY_NORMAL+2,MSYS_NO_CURSOR,MSYS_NO_CALLBACK, FromCallback );

        // subject region
        MSYS_DefineRegion(&pSortMailRegions[1],SUBJECT_X ,FROM_BOX_Y, SUBJECT_BOX_X+SUBJECT_WIDTH ,FROM_BOX_Y+TOP_HEIGHT,
                        MSYS_PRIORITY_NORMAL+2,MSYS_NO_CURSOR,MSYS_NO_CALLBACK, SubjectCallback );

        // date region
        MSYS_DefineRegion(&pSortMailRegions[2],DATE_X ,FROM_BOX_Y, DATE_BOX_X+DATE_WIDTH ,FROM_BOX_Y+TOP_HEIGHT,
                        MSYS_PRIORITY_NORMAL+2,MSYS_NO_CURSOR,MSYS_NO_CALLBACK, DateCallback );

        //add regions
        MSYS_AddRegion(&pSortMailRegions[0]);
  MSYS_AddRegion(&pSortMailRegions[1]);
  MSYS_AddRegion(&pSortMailRegions[2]);

        return;
        */
}

function DeleteSortRegions(): void {
  // have been replaced by buttons
  return;
  /*
  MSYS_RemoveRegion(&pSortMailRegions[0]);
  MSYS_RemoveRegion(&pSortMailRegions[1]);
  MSYS_RemoveRegion(&pSortMailRegions[2]);
  */
}

function DisplayTextOnTitleBar(): void {
  // draw email screen title text

  // font stuff
  SetFont(EMAIL_TITLE_FONT);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // printf the title
  mprintf(EMAIL_TITLE_X, EMAIL_TITLE_Y, pEmailTitleText[0]);

  // reset the shadow
}

function DestroyMailScreenButtons(): void {
  // this function will destory the buttons used in the email screen

  // the sort email buttons
  RemoveButton(giSortButton[0]);
  UnloadButtonImage(giSortButtonImage[0]);
  RemoveButton(giSortButton[1]);
  UnloadButtonImage(giSortButtonImage[1]);
  RemoveButton(giSortButton[2]);
  UnloadButtonImage(giSortButtonImage[2]);
  RemoveButton(giSortButton[3]);
  UnloadButtonImage(giSortButtonImage[3]);

  return;
}

function CreateMailScreenButtons(): void {
  // create sort buttons, right now - not finished

  // read sort
  giSortButtonImage[0] = LoadButtonImage("LAPTOP\\mailbuttons.sti", -1, 0, -1, 4, -1);
  giSortButton[0] = QuickCreateButton(giSortButtonImage[0], ENVELOPE_BOX_X, FROM_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, ReadCallback);
  SetButtonCursor(giSortButton[0], CURSOR_LAPTOP_SCREEN);

  // subject sort
  giSortButtonImage[1] = LoadButtonImage("LAPTOP\\mailbuttons.sti", -1, 1, -1, 5, -1);
  giSortButton[1] = QuickCreateButton(giSortButtonImage[1], FROM_BOX_X, FROM_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, FromCallback);
  SetButtonCursor(giSortButton[1], CURSOR_LAPTOP_SCREEN);
  SpecifyFullButtonTextAttributes(giSortButton[1], pEmailHeaders[FROM_HEADER], EMAIL_WARNING_FONT, FONT_BLACK, FONT_BLACK, FONT_BLACK, FONT_BLACK, TEXT_CJUSTIFIED);

  // sender sort
  giSortButtonImage[2] = LoadButtonImage("LAPTOP\\mailbuttons.sti", -1, 2, -1, 6, -1);
  giSortButton[2] = QuickCreateButton(giSortButtonImage[2], SUBJECT_BOX_X, FROM_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, SubjectCallback);
  SetButtonCursor(giSortButton[2], CURSOR_LAPTOP_SCREEN);
  SpecifyFullButtonTextAttributes(giSortButton[2], pEmailHeaders[SUBJECT_HEADER], EMAIL_WARNING_FONT, FONT_BLACK, FONT_BLACK, FONT_BLACK, FONT_BLACK, TEXT_CJUSTIFIED);

  // date sort
  giSortButtonImage[3] = LoadButtonImage("LAPTOP\\mailbuttons.sti", -1, 3, -1, 7, -1);
  giSortButton[3] = QuickCreateButton(giSortButtonImage[3], DATE_BOX_X, FROM_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, DateCallback);
  SetButtonCursor(giSortButton[3], CURSOR_LAPTOP_SCREEN);
  SpecifyFullButtonTextAttributes(giSortButton[3], pEmailHeaders[RECD_HEADER], EMAIL_WARNING_FONT, FONT_BLACK, FONT_BLACK, FONT_BLACK, FONT_BLACK, TEXT_CJUSTIFIED);

  return;
}

function DisplayEmailMessageSubjectDateFromLines(pMail: EmailPtr, iViewerY: INT32): void {
  // this procedure will draw the title/headers to From, Subject, Date fields in the display
  // message box
  let usX: UINT16;
  let usY: UINT16;
  let sString: wchar_t[] /* [100] */;

  // font stuff
  SetFont(MESSAGE_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // all headers, but not info are right justified

  // print from
  FindFontRightCoordinates(MESSAGE_HEADER_X - 20, (MESSAGE_FROM_Y + iViewerY), MESSAGE_HEADER_WIDTH, (MESSAGE_FROM_Y + GetFontHeight(MESSAGE_FONT)), pEmailHeaders[0], MESSAGE_FONT, &usX, &usY);
  mprintf(usX, MESSAGE_FROM_Y + iViewerY, pEmailHeaders[0]);

  // the actual from info
  mprintf(MESSAGE_HEADER_X + MESSAGE_HEADER_WIDTH - 13, MESSAGE_FROM_Y + iViewerY, pSenderNameList[pMail.value.ubSender]);

  // print date
  FindFontRightCoordinates(MESSAGE_HEADER_X + 168, (MESSAGE_DATE_Y + iViewerY), MESSAGE_HEADER_WIDTH, (MESSAGE_DATE_Y + GetFontHeight(MESSAGE_FONT)), pEmailHeaders[2], MESSAGE_FONT, &usX, &usY);
  mprintf(usX, MESSAGE_DATE_Y + iViewerY, pEmailHeaders[2]);

  // the actual date info
  swprintf(sString, "%d", ((pMail.value.iDate) / (24 * 60)));
  mprintf(MESSAGE_HEADER_X + 235, MESSAGE_DATE_Y + iViewerY, sString);

  // print subject
  FindFontRightCoordinates(MESSAGE_HEADER_X - 20, MESSAGE_SUBJECT_Y, MESSAGE_HEADER_WIDTH, (MESSAGE_SUBJECT_Y + GetFontHeight(MESSAGE_FONT)), pEmailHeaders[1], MESSAGE_FONT, &usX, &usY);
  mprintf(usX, MESSAGE_SUBJECT_Y + iViewerY, pEmailHeaders[1]);

  // the actual subject info
  // mprintf( , MESSAGE_SUBJECT_Y, pMail->pSubject);
  IanDisplayWrappedString(SUBJECT_LINE_X + 2, (SUBJECT_LINE_Y + 2 + iViewerY), SUBJECT_LINE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR, pMail.value.pSubject, 0, FALSE, 0);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);
  return;
}

function DrawEmailMessageDisplayTitleText(iViewerY: INT32): void {
  // this procedure will display the title of the email message display box

  // font stuff
  SetFont(EMAIL_HEADER_FONT);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // dsiplay mail viewer title on message viewer
  mprintf(VIEWER_X + 30, VIEWER_Y + 8 + iViewerY, pEmailTitleText[0]);

  return;
}

function DrawLineDividers(): void {
  // this function draws divider lines between lines of text
  let iCounter: INT32 = 0;
  let hHandle: HVOBJECT;

  for (iCounter = 1; iCounter < 19; iCounter++) {
    GetVideoObject(&hHandle, guiMAILDIVIDER);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, INDIC_X - 10, (MIDDLE_Y + iCounter * MIDDLE_WIDTH - 1), VO_BLT_SRCTRANSPARENCY, NULL);
  }

  return;
}

function ClearOutEmailMessageRecordsList(): void {
  let pTempRecord: RecordPtr;
  let iCounter: INT32 = 0;

  // runt hrough list freeing records up
  while (pMessageRecordList) {
    // set temp to current
    pTempRecord = pMessageRecordList;

    // next element
    pMessageRecordList = pMessageRecordList.value.Next;

    MemFree(pTempRecord);
  }

  for (iCounter = 0; iCounter < MAX_NUMBER_EMAIL_PAGES; iCounter++) {
    pEmailPageInfo[iCounter].pFirstRecord = NULL;
    pEmailPageInfo[iCounter].pLastRecord = NULL;
    pEmailPageInfo[iCounter].iPageNumber = iCounter;
  }

  // null out list
  pMessageRecordList = NULL;

  return;
}

function AddEmailRecordToList(pString: STR16): void {
  let pTempRecord: RecordPtr;

  // set to head of list
  pTempRecord = pMessageRecordList;

  if (!pTempRecord) {
    // list empty, set this node to head
    pTempRecord = MemAlloc(sizeof(Record));
    pMessageRecordList = pTempRecord;
  } else {
    // run to end of list
    while (pTempRecord.value.Next) {
      pTempRecord = pTempRecord.value.Next;
    }

    // found, alloc
    pTempRecord.value.Next = MemAlloc(sizeof(Record));

    // move to node
    pTempRecord = pTempRecord.value.Next;
  }

  // set next to null
  pTempRecord.value.Next = NULL;

  // copy in string
  wcscpy(pTempRecord.value.pRecord, pString);

  // done return

  return;
}

function UpDateMessageRecordList(): void {
  // simply checks to see if old and new message ids are the same, if so, do nothing
  // otherwise clear list

  if (giMessageId != giPrevMessageId) {
    // if chenged, clear list
    ClearOutEmailMessageRecordsList();

    // set prev to current
    giPrevMessageId = giMessageId;
  }
}

function HandleAnySpecialEmailMessageEvents(iMessageId: INT32): void {
  // handles any special message events

  switch (iMessageId) {
    case (IMP_EMAIL_AGAIN):
      SetBookMark(IMP_BOOKMARK);
      break;
    case (IMP_EMAIL_INTRO):
      SetBookMark(IMP_BOOKMARK);
      break;
  }
}

function ReDisplayBoxes(): void {
  // the email message itself
  if (fDisplayMessageFlag) {
    // this simply redraws message with button manipulation
    DisplayEmailMessage(GetEmailMessage(giMessageId));
  }

  if (fDeleteMailFlag) {
    // delete message, redisplay
    DisplayDeleteNotice(GetEmailMessage(iDeleteId));
  }

  if (fNewMailFlag) {
    // if new mail, redisplay box
    DisplayNewMailBox();
  }
}

function HandleMailSpecialMessages(usMessageId: UINT16, iResults: Pointer<INT32>, pMail: EmailPtr): BOOLEAN {
  let fSpecialCase: BOOLEAN = FALSE;

  // this procedure will handle special cases of email messages that are not stored in email.edt, or need special processing
  switch (usMessageId) {
    case (IMP_EMAIL_PROFILE_RESULTS):

      HandleIMPCharProfileResultsMessage();
      fSpecialCase = TRUE;

      break;
    case (MERC_INTRO):
      SetBookMark(MERC_BOOKMARK);
      fReDrawScreenFlag = TRUE;
      break;

    case INSUR_PAYMENT:
    case INSUR_SUSPIC:
    case INSUR_SUSPIC_2:
    case INSUR_INVEST_OVER:
      ModifyInsuranceEmails(usMessageId, iResults, pMail, INSUR_PAYMENT_LENGTH);
      break;

    case INSUR_1HOUR_FRAUD:
      ModifyInsuranceEmails(usMessageId, iResults, pMail, INSUR_1HOUR_FRAUD_LENGTH);
      break;

    case MERC_NEW_SITE_ADDRESS:
      // Set the book mark so the player can access the site
      SetBookMark(MERC_BOOKMARK);
      break;

    case MERC_DIED_ON_OTHER_ASSIGNMENT:
      ModifyInsuranceEmails(usMessageId, iResults, pMail, MERC_DIED_ON_OTHER_ASSIGNMENT_LENGTH);
      break;

    case AIM_MEDICAL_DEPOSIT_REFUND:
    case AIM_MEDICAL_DEPOSIT_NO_REFUND:
    case AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND:
      ModifyInsuranceEmails(usMessageId, iResults, pMail, AIM_MEDICAL_DEPOSIT_REFUND_LENGTH);
      break;
  }

  return fSpecialCase;
}

const IMP_RESULTS_INTRO_LENGTH = 9;

const IMP_RESULTS_PERSONALITY_INTRO = IMP_RESULTS_INTRO_LENGTH;
const IMP_RESULTS_PERSONALITY_INTRO_LENGTH = 5;
const IMP_PERSONALITY_NORMAL = IMP_RESULTS_PERSONALITY_INTRO + IMP_RESULTS_PERSONALITY_INTRO_LENGTH;
const IMP_PERSONALITY_LENGTH = 4;
const IMP_PERSONALITY_HEAT = IMP_PERSONALITY_NORMAL + IMP_PERSONALITY_LENGTH;
const IMP_PERSONALITY_NERVOUS = IMP_PERSONALITY_HEAT + IMP_PERSONALITY_LENGTH;
const IMP_PERSONALITY_CLAUSTROPHOBIC = IMP_PERSONALITY_NERVOUS + IMP_PERSONALITY_LENGTH;
const IMP_PERSONALITY_NONSWIMMER = IMP_PERSONALITY_CLAUSTROPHOBIC + IMP_PERSONALITY_LENGTH;
const IMP_PERSONALITY_FEAR_OF_INSECTS = IMP_PERSONALITY_NONSWIMMER + IMP_PERSONALITY_LENGTH;
const IMP_PERSONALITY_FORGETFUL = IMP_PERSONALITY_FEAR_OF_INSECTS + IMP_PERSONALITY_LENGTH + 1;
const IMP_PERSONALITY_PSYCHO = IMP_PERSONALITY_FORGETFUL + IMP_PERSONALITY_LENGTH;
const IMP_RESULTS_ATTITUDE_INTRO = IMP_PERSONALITY_PSYCHO + IMP_PERSONALITY_LENGTH + 1;
const IMP_RESULTS_ATTITUDE_LENGTH = 5;
const IMP_ATTITUDE_LENGTH = 5;
const IMP_ATTITUDE_NORMAL = IMP_RESULTS_ATTITUDE_INTRO + IMP_RESULTS_ATTITUDE_LENGTH;
const IMP_ATTITUDE_FRIENDLY = IMP_ATTITUDE_NORMAL + IMP_ATTITUDE_LENGTH;
const IMP_ATTITUDE_LONER = IMP_ATTITUDE_FRIENDLY + IMP_ATTITUDE_LENGTH + 1;
const IMP_ATTITUDE_OPTIMIST = IMP_ATTITUDE_LONER + IMP_ATTITUDE_LENGTH + 1;
const IMP_ATTITUDE_PESSIMIST = IMP_ATTITUDE_OPTIMIST + IMP_ATTITUDE_LENGTH + 1;
const IMP_ATTITUDE_AGGRESSIVE = IMP_ATTITUDE_PESSIMIST + IMP_ATTITUDE_LENGTH + 1;
const IMP_ATTITUDE_ARROGANT = IMP_ATTITUDE_AGGRESSIVE + IMP_ATTITUDE_LENGTH + 1;
const IMP_ATTITUDE_ASSHOLE = IMP_ATTITUDE_ARROGANT + IMP_ATTITUDE_LENGTH + 1;
const IMP_ATTITUDE_COWARD = IMP_ATTITUDE_ASSHOLE + IMP_ATTITUDE_LENGTH;
const IMP_RESULTS_SKILLS = IMP_ATTITUDE_COWARD + IMP_ATTITUDE_LENGTH + 1;
const IMP_RESULTS_SKILLS_LENGTH = 7;
const IMP_SKILLS_IMPERIAL_SKILLS = IMP_RESULTS_SKILLS + IMP_RESULTS_SKILLS_LENGTH + 1;
const IMP_SKILLS_IMPERIAL_MARK = IMP_SKILLS_IMPERIAL_SKILLS + 1;
const IMP_SKILLS_IMPERIAL_MECH = IMP_SKILLS_IMPERIAL_SKILLS + 2;
const IMP_SKILLS_IMPERIAL_EXPL = IMP_SKILLS_IMPERIAL_SKILLS + 3;
const IMP_SKILLS_IMPERIAL_MED = IMP_SKILLS_IMPERIAL_SKILLS + 4;

const IMP_SKILLS_NEED_TRAIN_SKILLS = IMP_SKILLS_IMPERIAL_MED + 1;
const IMP_SKILLS_NEED_TRAIN_MARK = IMP_SKILLS_NEED_TRAIN_SKILLS + 1;
const IMP_SKILLS_NEED_TRAIN_MECH = IMP_SKILLS_NEED_TRAIN_SKILLS + 2;
const IMP_SKILLS_NEED_TRAIN_EXPL = IMP_SKILLS_NEED_TRAIN_SKILLS + 3;
const IMP_SKILLS_NEED_TRAIN_MED = IMP_SKILLS_NEED_TRAIN_SKILLS + 4;

const IMP_SKILLS_NO_SKILL = IMP_SKILLS_NEED_TRAIN_MED + 1;
const IMP_SKILLS_NO_SKILL_MARK = IMP_SKILLS_NO_SKILL + 1;
const IMP_SKILLS_NO_SKILL_MECH = IMP_SKILLS_NO_SKILL + 2;
const IMP_SKILLS_NO_SKILL_EXPL = IMP_SKILLS_NO_SKILL + 3;
const IMP_SKILLS_NO_SKILL_MED = IMP_SKILLS_NO_SKILL + 4;

const IMP_SKILLS_SPECIAL_INTRO = IMP_SKILLS_NO_SKILL_MED + 1;
const IMP_SKILLS_SPECIAL_INTRO_LENGTH = 2;
const IMP_SKILLS_SPECIAL_LOCK = IMP_SKILLS_SPECIAL_INTRO + IMP_SKILLS_SPECIAL_INTRO_LENGTH;
const IMP_SKILLS_SPECIAL_HAND = IMP_SKILLS_SPECIAL_LOCK + 1;
const IMP_SKILLS_SPECIAL_ELEC = IMP_SKILLS_SPECIAL_HAND + 1;
const IMP_SKILLS_SPECIAL_NIGHT = IMP_SKILLS_SPECIAL_ELEC + 1;
const IMP_SKILLS_SPECIAL_THROW = IMP_SKILLS_SPECIAL_NIGHT + 1;
const IMP_SKILLS_SPECIAL_TEACH = IMP_SKILLS_SPECIAL_THROW + 1;
const IMP_SKILLS_SPECIAL_HEAVY = IMP_SKILLS_SPECIAL_TEACH + 1;
const IMP_SKILLS_SPECIAL_AUTO = IMP_SKILLS_SPECIAL_HEAVY + 1;
const IMP_SKILLS_SPECIAL_STEALTH = IMP_SKILLS_SPECIAL_AUTO + 1;
const IMP_SKILLS_SPECIAL_AMBI = IMP_SKILLS_SPECIAL_STEALTH + 1;
const IMP_SKILLS_SPECIAL_THIEF = IMP_SKILLS_SPECIAL_AMBI + 1;
const IMP_SKILLS_SPECIAL_MARTIAL = IMP_SKILLS_SPECIAL_THIEF + 1;
const IMP_SKILLS_SPECIAL_KNIFE = IMP_SKILLS_SPECIAL_MARTIAL + 1;

const IMP_RESULTS_PHYSICAL = IMP_SKILLS_SPECIAL_KNIFE + 1;
const IMP_RESULTS_PHYSICAL_LENGTH = 7;

const IMP_PHYSICAL_SUPER = IMP_RESULTS_PHYSICAL + IMP_RESULTS_PHYSICAL_LENGTH;
const IMP_PHYSICAL_SUPER_LENGTH = 1;

const IMP_PHYSICAL_SUPER_HEALTH = IMP_PHYSICAL_SUPER + IMP_PHYSICAL_SUPER_LENGTH;
const IMP_PHYSICAL_SUPER_AGILITY = IMP_PHYSICAL_SUPER_HEALTH + 1;
const IMP_PHYSICAL_SUPER_DEXTERITY = IMP_PHYSICAL_SUPER_AGILITY + 1;
const IMP_PHYSICAL_SUPER_STRENGTH = IMP_PHYSICAL_SUPER_DEXTERITY + 1;
const IMP_PHYSICAL_SUPER_LEADERSHIP = IMP_PHYSICAL_SUPER_STRENGTH + 1;
const IMP_PHYSICAL_SUPER_WISDOM = IMP_PHYSICAL_SUPER_LEADERSHIP + 1;

const IMP_PHYSICAL_LOW = IMP_PHYSICAL_SUPER_WISDOM + 1;
const IMP_PHYSICAL_LOW_LENGTH = 1;

const IMP_PHYSICAL_LOW_HEALTH = IMP_PHYSICAL_LOW + IMP_PHYSICAL_LOW_LENGTH;
const IMP_PHYSICAL_LOW_AGILITY = IMP_PHYSICAL_LOW_HEALTH + 1;
const IMP_PHYSICAL_LOW_DEXTERITY = IMP_PHYSICAL_LOW_AGILITY + 2;
const IMP_PHYSICAL_LOW_STRENGTH = IMP_PHYSICAL_LOW_DEXTERITY + 1;
const IMP_PHYSICAL_LOW_LEADERSHIP = IMP_PHYSICAL_LOW_STRENGTH + 1;
const IMP_PHYSICAL_LOW_WISDOM = IMP_PHYSICAL_LOW_LEADERSHIP + 1;

const IMP_PHYSICAL_VERY_LOW = IMP_PHYSICAL_LOW_WISDOM + 1;
const IMP_PHYSICAL_VERY_LOW_LENGTH = 1;

const IMP_PHYSICAL_VERY_LOW_HEALTH = IMP_PHYSICAL_VERY_LOW + IMP_PHYSICAL_VERY_LOW_LENGTH;
const IMP_PHYSICAL_VERY_LOW_AGILITY = IMP_PHYSICAL_VERY_LOW_HEALTH + 1;
const IMP_PHYSICAL_VERY_LOW_DEXTERITY = IMP_PHYSICAL_VERY_LOW_AGILITY + 1;
const IMP_PHYSICAL_VERY_LOW_STRENGTH = IMP_PHYSICAL_VERY_LOW_DEXTERITY + 1;
const IMP_PHYSICAL_VERY_LOW_LEADERSHIP = IMP_PHYSICAL_VERY_LOW_STRENGTH + 1;
const IMP_PHYSICAL_VERY_LOW_WISDOM = IMP_PHYSICAL_VERY_LOW_LEADERSHIP + 1;

const IMP_PHYSICAL_END = IMP_PHYSICAL_VERY_LOW_WISDOM + 1;
const IMP_PHYSICAL_END_LENGTH = 3;

const IMP_RESULTS_PORTRAIT = IMP_PHYSICAL_END + IMP_PHYSICAL_END_LENGTH;
const IMP_RESULTS_PORTRAIT_LENGTH = 6;

const IMP_PORTRAIT_MALE_1 = IMP_RESULTS_PORTRAIT + IMP_RESULTS_PORTRAIT_LENGTH;
const IMP_PORTRAIT_MALE_2 = IMP_PORTRAIT_MALE_1 + 4;
const IMP_PORTRAIT_MALE_3 = IMP_PORTRAIT_MALE_2 + 4;
const IMP_PORTRAIT_MALE_4 = IMP_PORTRAIT_MALE_3 + 4;
const IMP_PORTRAIT_MALE_5 = IMP_PORTRAIT_MALE_4 + 4;
const IMP_PORTRAIT_MALE_6 = IMP_PORTRAIT_MALE_5 + 4;

const IMP_PORTRAIT_FEMALE_1 = IMP_PORTRAIT_MALE_6 + 4;
const IMP_PORTRAIT_FEMALE_2 = IMP_PORTRAIT_FEMALE_1 + 4;
const IMP_PORTRAIT_FEMALE_3 = IMP_PORTRAIT_FEMALE_2 + 4;
const IMP_PORTRAIT_FEMALE_4 = IMP_PORTRAIT_FEMALE_3 + 4;
const IMP_PORTRAIT_FEMALE_5 = IMP_PORTRAIT_FEMALE_4 + 4;
const IMP_PORTRAIT_FEMALE_6 = IMP_PORTRAIT_FEMALE_5 + 4;

const IMP_RESULTS_END = IMP_PORTRAIT_FEMALE_6 + 1;
const IMP_RESULTS_END_LENGTH = 3;

function HandleIMPCharProfileResultsMessage(): void {
  // special case, IMP profile return
  let iTotalHeight: INT32 = 0;
  let iCnt: INT32 = 0;
  let iHeight: INT32 = 0;
  let iCounter: INT32 = 0;
  //	wchar_t pString[MAIL_STRING_SIZE/2 + 1];
  let pString: wchar_t[] /* [MAIL_STRING_SIZE] */;
  let iOffSet: INT32 = 0;
  let iViewerY: INT32 = 0;
  let iHeightTemp: INT32 = 0;
  let iHeightSoFar: INT32 = 0;
  let pTempRecord: RecordPtr;
  let iEndOfSection: INT32 = 0;
  let iRand: INT32 = 0;
  let fSufficientMechSkill: BOOLEAN = FALSE;
  let fSufficientMarkSkill: BOOLEAN = FALSE;
  let fSufficientMedSkill: BOOLEAN = FALSE;
  let fSufficientExplSkill: BOOLEAN = FALSE;
  let fSufficientHlth: BOOLEAN = FALSE;
  let fSufficientStr: BOOLEAN = FALSE;
  let fSufficientWis: BOOLEAN = FALSE;
  let fSufficientAgi: BOOLEAN = FALSE;
  let fSufficientDex: BOOLEAN = FALSE;
  let fSufficientLdr: BOOLEAN = FALSE;

  iRand = Random(32767);

  // set record ptr to head of list
  pTempRecord = pMessageRecordList;

  // increment height for size of one line
  iHeight += GetFontHeight(MESSAGE_FONT);

  // load intro
  iEndOfSection = IMP_RESULTS_INTRO_LENGTH;

  // list doesn't exist, reload
  if (!pTempRecord) {
    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // have to place players name into string for first record
      if (iCounter == 0) {
        let zTemp: wchar_t[] /* [512] */;

        swprintf(zTemp, " %s", gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].zName);
        wcscat(pString, zTemp);
      }

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // now the personality intro
    iOffSet = IMP_RESULTS_PERSONALITY_INTRO;
    iEndOfSection = IMP_RESULTS_PERSONALITY_INTRO_LENGTH + 1;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // personality itself
    switch (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bPersonalityTrait) {
        // normal as can be
      case (NO_PERSONALITYTRAIT):
        iOffSet = IMP_PERSONALITY_NORMAL;
        break;
      case (HEAT_INTOLERANT):
        iOffSet = IMP_PERSONALITY_HEAT;
        break;
      case (NERVOUS):
        iOffSet = IMP_PERSONALITY_NERVOUS;
        break;
      case (CLAUSTROPHOBIC):
        iOffSet = IMP_PERSONALITY_CLAUSTROPHOBIC;
        break;
      case (NONSWIMMER):
        iOffSet = IMP_PERSONALITY_NONSWIMMER;
        break;
      case (FEAR_OF_INSECTS):
        iOffSet = IMP_PERSONALITY_FEAR_OF_INSECTS;
        break;
      case (FORGETFUL):
        iOffSet = IMP_PERSONALITY_FORGETFUL;
        break;
      case (PSYCHO):
        iOffSet = IMP_PERSONALITY_PSYCHO;
        break;
    }

    // personality tick
    //  DEF: removed 1/12/99, cause it was changing the length of email that were already calculated
    //		LoadEncryptedDataFromFile( "BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * ( iOffSet + Random( IMP_PERSONALITY_LENGTH - 1 ) + 1 ), MAIL_STRING_SIZE );
    LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + 1), MAIL_STRING_SIZE);
    // add to list
    AddEmailRecordToList(pString);

    // persoanlity paragraph
    LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + IMP_PERSONALITY_LENGTH), MAIL_STRING_SIZE);
    // add to list
    AddEmailRecordToList(pString);

    // extra paragraph for bugs
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bPersonalityTrait == FEAR_OF_INSECTS) {
      // persoanlity paragraph
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + IMP_PERSONALITY_LENGTH + 1), MAIL_STRING_SIZE);
      // add to list
      AddEmailRecordToList(pString);
    }

    // attitude intro
    // now the personality intro
    iOffSet = IMP_RESULTS_ATTITUDE_INTRO;
    iEndOfSection = IMP_RESULTS_ATTITUDE_LENGTH;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // personality itself
    switch (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAttitude) {
        // normal as can be
      case (ATT_NORMAL):
        iOffSet = IMP_ATTITUDE_NORMAL;
        break;
      case (ATT_FRIENDLY):
        iOffSet = IMP_ATTITUDE_FRIENDLY;
        break;
      case (ATT_LONER):
        iOffSet = IMP_ATTITUDE_LONER;
        break;
      case (ATT_OPTIMIST):
        iOffSet = IMP_ATTITUDE_OPTIMIST;
        break;
      case (ATT_PESSIMIST):
        iOffSet = IMP_ATTITUDE_PESSIMIST;
        break;
      case (ATT_AGGRESSIVE):
        iOffSet = IMP_ATTITUDE_AGGRESSIVE;
        break;
      case (ATT_ARROGANT):
        iOffSet = IMP_ATTITUDE_ARROGANT;
        break;
      case (ATT_ASSHOLE):
        iOffSet = IMP_ATTITUDE_ASSHOLE;
        break;
      case (ATT_COWARD):
        iOffSet = IMP_ATTITUDE_COWARD;
        break;
    }

    // attitude title
    LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet), MAIL_STRING_SIZE);
    // add to list
    AddEmailRecordToList(pString);

    // attitude tick
    //  DEF: removed 1/12/99, cause it was changing the length of email that were already calculated
    //		LoadEncryptedDataFromFile( "BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * ( iOffSet + Random( IMP_ATTITUDE_LENGTH - 2 ) + 1 ), MAIL_STRING_SIZE );
    LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + 1), MAIL_STRING_SIZE);
    // add to list
    AddEmailRecordToList(pString);

    // attitude paragraph
    LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + IMP_ATTITUDE_LENGTH - 1), MAIL_STRING_SIZE);
    // add to list
    AddEmailRecordToList(pString);

    // check for second paragraph
    if (iOffSet != IMP_ATTITUDE_NORMAL) {
      // attitude paragraph
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + IMP_ATTITUDE_LENGTH), MAIL_STRING_SIZE);
      // add to list
      AddEmailRecordToList(pString);
    }

    // skills
    // now the skills intro
    iOffSet = IMP_RESULTS_SKILLS;
    iEndOfSection = IMP_RESULTS_SKILLS_LENGTH;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // imperial skills
    iOffSet = IMP_SKILLS_IMPERIAL_SKILLS;
    iEndOfSection = 0;
    iCounter = 0;

    // marksmanship
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMarksmanship >= SUPER_SKILL_VALUE) {
      fSufficientMarkSkill = TRUE;
      iEndOfSection = 1;
    }

    // medical
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMedical >= SUPER_SKILL_VALUE) {
      fSufficientMedSkill = TRUE;
      iEndOfSection = 1;
    }

    // mechanical
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMechanical >= SUPER_SKILL_VALUE) {
      fSufficientMechSkill = TRUE;
      iEndOfSection = 1;
    }

    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bExplosive >= SUPER_SKILL_VALUE) {
      fSufficientExplSkill = TRUE;
      iEndOfSection = 1;
    }

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // now handle skills
    if (fSufficientMarkSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_IMPERIAL_MARK), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientMedSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_IMPERIAL_MED), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientMechSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_IMPERIAL_MECH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // explosives
    if (fSufficientExplSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_IMPERIAL_EXPL), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    fSufficientMechSkill = FALSE;
    fSufficientMarkSkill = FALSE;
    fSufficientExplSkill = FALSE;
    fSufficientMedSkill = FALSE;

    // imperial skills
    iOffSet = IMP_SKILLS_NEED_TRAIN_SKILLS;
    iEndOfSection = 0;
    iCounter = 0;

    // now the needs training values
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMarksmanship > NO_CHANCE_IN_HELL_SKILL_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMarksmanship <= NEEDS_TRAINING_SKILL_VALUE)) {
      fSufficientMarkSkill = TRUE;
      iEndOfSection = 1;
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMedical > NO_CHANCE_IN_HELL_SKILL_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMedical <= NEEDS_TRAINING_SKILL_VALUE)) {
      fSufficientMedSkill = TRUE;
      iEndOfSection = 1;
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMechanical > NO_CHANCE_IN_HELL_SKILL_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMechanical <= NEEDS_TRAINING_SKILL_VALUE)) {
      fSufficientMechSkill = TRUE;
      iEndOfSection = 1;
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bExplosive > NO_CHANCE_IN_HELL_SKILL_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bExplosive <= NEEDS_TRAINING_SKILL_VALUE)) {
      fSufficientExplSkill = TRUE;
      iEndOfSection = 1;
    }

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    if (fSufficientMarkSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NEED_TRAIN_MARK), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientMedSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NEED_TRAIN_MED), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientMechSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NEED_TRAIN_MECH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientExplSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NEED_TRAIN_EXPL), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    fSufficientMechSkill = FALSE;
    fSufficientMarkSkill = FALSE;
    fSufficientExplSkill = FALSE;
    fSufficientMedSkill = FALSE;

    // and the no chance in hell of doing anything useful values

    // no skill
    iOffSet = IMP_SKILLS_NO_SKILL;
    iEndOfSection = 0;
    iCounter = 0;

    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMarksmanship <= NO_CHANCE_IN_HELL_SKILL_VALUE) {
      fSufficientMarkSkill = TRUE;
      iEndOfSection = 1;
    }

    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMedical <= NO_CHANCE_IN_HELL_SKILL_VALUE) {
      fSufficientMedSkill = TRUE;
      iEndOfSection = 1;
    }

    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bMechanical <= NO_CHANCE_IN_HELL_SKILL_VALUE) {
      fSufficientMechSkill = TRUE;
      iEndOfSection = 1;
    }

    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bExplosive <= NO_CHANCE_IN_HELL_SKILL_VALUE) {
      fSufficientExplSkill = TRUE;
      iEndOfSection = 1;
    }

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    if (fSufficientMechSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NO_SKILL_MECH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientMarkSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NO_SKILL_MARK), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientMedSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NO_SKILL_MED), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }
    if (fSufficientExplSkill) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_NO_SKILL_EXPL), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // now the specialized skills
    // imperial skills
    iOffSet = IMP_SKILLS_SPECIAL_INTRO;
    iEndOfSection = IMP_SKILLS_SPECIAL_INTRO_LENGTH;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == KNIFING) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == KNIFING)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_KNIFE), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // lockpick
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == LOCKPICKING) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == LOCKPICKING)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_LOCK), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // hand to hand
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == HANDTOHAND) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == HANDTOHAND)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_HAND), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // electronics
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == ELECTRONICS) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == ELECTRONICS)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_ELEC), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == NIGHTOPS) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == NIGHTOPS)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_NIGHT), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == THROWING) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == THROWING)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_THROW), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == TEACHING) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == TEACHING)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_TEACH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == HEAVY_WEAPS) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == HEAVY_WEAPS)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_HEAVY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == AUTO_WEAPS) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == AUTO_WEAPS)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_AUTO), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == STEALTHY) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == STEALTHY)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_STEALTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == AMBIDEXT) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == AMBIDEXT)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_AMBI), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == THIEF) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == THIEF)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_THIEF), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait == MARTIALARTS) || (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bSkillTrait2 == MARTIALARTS)) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_SKILLS_SPECIAL_MARTIAL), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // now the physical
    // imperial physical
    iOffSet = IMP_RESULTS_PHYSICAL;
    iEndOfSection = IMP_RESULTS_PHYSICAL_LENGTH;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // super physical
    iOffSet = IMP_PHYSICAL_SUPER;
    iEndOfSection = 0;
    iCounter = 0;

    // health
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLife >= SUPER_STAT_VALUE) {
      fSufficientHlth = TRUE;
      iEndOfSection = 1;
    }

    // dex
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bDexterity >= SUPER_STAT_VALUE) {
      fSufficientDex = TRUE;
      iEndOfSection = 1;
    }

    // agility
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAgility >= SUPER_STAT_VALUE) {
      fSufficientAgi = TRUE;
      iEndOfSection = 1;
    }

    // strength
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bStrength >= SUPER_STAT_VALUE) {
      fSufficientStr = TRUE;
      iEndOfSection = 1;
    }

    // wisdom
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bWisdom >= SUPER_STAT_VALUE) {
      fSufficientWis = TRUE;
      iEndOfSection = 1;
    }

    // leadership
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLeadership >= SUPER_STAT_VALUE) {
      fSufficientLdr = TRUE;
      iEndOfSection = 1;
    }

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    if (fSufficientHlth) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_SUPER_HEALTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientDex) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_SUPER_DEXTERITY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientStr) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_SUPER_STRENGTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientAgi) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_SUPER_AGILITY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientWis) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_SUPER_WISDOM), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientLdr) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_SUPER_LEADERSHIP), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    fSufficientHlth = FALSE;
    fSufficientStr = FALSE;
    fSufficientWis = FALSE;
    fSufficientAgi = FALSE;
    fSufficientDex = FALSE;
    fSufficientLdr = FALSE;

    // now the low attributes
    // super physical
    iOffSet = IMP_PHYSICAL_LOW;
    iEndOfSection = 0;
    iCounter = 0;

    // health
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLife < NEEDS_TRAINING_STAT_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLife > NO_CHANCE_IN_HELL_STAT_VALUE)) {
      fSufficientHlth = TRUE;
      iEndOfSection = 1;
    }

    // strength
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bStrength < NEEDS_TRAINING_STAT_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bStrength > NO_CHANCE_IN_HELL_STAT_VALUE)) {
      fSufficientStr = TRUE;
      iEndOfSection = 1;
    }

    // agility
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAgility < NEEDS_TRAINING_STAT_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAgility <= NO_CHANCE_IN_HELL_STAT_VALUE)) {
      fSufficientAgi = TRUE;
      iEndOfSection = 1;
    }

    // wisdom
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bWisdom < NEEDS_TRAINING_STAT_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bWisdom > NO_CHANCE_IN_HELL_STAT_VALUE)) {
      fSufficientWis = TRUE;
      iEndOfSection = 1;
    }

    // leadership
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLeadership < NEEDS_TRAINING_STAT_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLeadership > NO_CHANCE_IN_HELL_STAT_VALUE)) {
      fSufficientLdr = TRUE;
      iEndOfSection = 1;
    }

    // dex
    if ((gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bDexterity < NEEDS_TRAINING_STAT_VALUE) && (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bDexterity > NO_CHANCE_IN_HELL_STAT_VALUE)) {
      fSufficientDex = TRUE;
      iEndOfSection = 1;
    }

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    if (fSufficientHlth) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_LOW_HEALTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientDex) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_LOW_DEXTERITY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientStr) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_LOW_STRENGTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientAgi) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_LOW_AGILITY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientWis) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_LOW_WISDOM), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientLdr) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_LOW_LEADERSHIP), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // very low physical
    iOffSet = IMP_PHYSICAL_VERY_LOW;
    iEndOfSection = 0;
    iCounter = 0;

    fSufficientHlth = FALSE;
    fSufficientStr = FALSE;
    fSufficientWis = FALSE;
    fSufficientAgi = FALSE;
    fSufficientDex = FALSE;
    fSufficientLdr = FALSE;

    // health
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLife <= NO_CHANCE_IN_HELL_STAT_VALUE) {
      fSufficientHlth = TRUE;
      iEndOfSection = 1;
    }

    // dex
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bDexterity <= NO_CHANCE_IN_HELL_STAT_VALUE) {
      fSufficientDex = TRUE;
      iEndOfSection = 1;
    }

    // strength
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bStrength <= NO_CHANCE_IN_HELL_STAT_VALUE) {
      fSufficientStr = TRUE;
      iEndOfSection = 1;
    }

    // agility
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bAgility <= NO_CHANCE_IN_HELL_STAT_VALUE) {
      fSufficientAgi = TRUE;
      iEndOfSection = 1;
    }

    // wisdom
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bWisdom <= NO_CHANCE_IN_HELL_STAT_VALUE) {
      fSufficientWis = TRUE;
      iEndOfSection = 1;
    }

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    if (fSufficientHlth) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_VERY_LOW_HEALTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientDex) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_VERY_LOW_DEXTERITY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientStr) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_VERY_LOW_STRENGTH), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientAgi) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_VERY_LOW_AGILITY), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    if (fSufficientWis) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_VERY_LOW_WISDOM), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // leadership
    if (gMercProfiles[PLAYER_GENERATED_CHARACTER_ID + LaptopSaveInfo.iVoiceId].bLeadership <= NO_CHANCE_IN_HELL_STAT_VALUE) {
      fSufficientLdr = TRUE;
    }

    if (fSufficientLdr) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (IMP_PHYSICAL_VERY_LOW_LEADERSHIP), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);
    }

    // very low physical
    iOffSet = IMP_RESULTS_PORTRAIT;
    iEndOfSection = IMP_RESULTS_PORTRAIT_LENGTH;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    // portraits

    switch (iPortraitNumber) {
      case (0):
        iOffSet = IMP_PORTRAIT_MALE_1;
        break;
      case (1):
        iOffSet = IMP_PORTRAIT_MALE_2;
        break;
      case (2):
        iOffSet = IMP_PORTRAIT_MALE_3;
        break;
      case (3):
        iOffSet = IMP_PORTRAIT_MALE_4;
        break;
      case (4):
      case (5):
        iOffSet = IMP_PORTRAIT_MALE_5;
        break;
      case (6):
      case (7):
        iOffSet = IMP_PORTRAIT_MALE_6;
        break;
      case (8):
        iOffSet = IMP_PORTRAIT_FEMALE_1;
        break;
      case (9):
        iOffSet = IMP_PORTRAIT_FEMALE_2;
        break;
      case (10):
        iOffSet = IMP_PORTRAIT_FEMALE_3;
        break;
      case (11):
      case (12):
        iOffSet = IMP_PORTRAIT_FEMALE_4;
        break;
      case (13):
      case (14):
        iOffSet = IMP_PORTRAIT_FEMALE_5;
        break;
    }

    if ((iRand % 2) == 0) {
      iOffSet += 2;
    }

    iEndOfSection = 2;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    iOffSet = IMP_RESULTS_END;
    iEndOfSection = IMP_RESULTS_END_LENGTH;
    iCounter = 0;

    while (iEndOfSection > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Impass.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }

    giPrevMessageId = giMessageId;
  }

  pTempRecord = pMessageRecordList;
}

function HandleEmailViewerButtonStates(): void {
  // handle state of email viewer buttons

  if (fDisplayMessageFlag == FALSE) {
    // not displaying message, leave
    return;
  }

  if (giNumberOfPagesToCurrentEmail <= 2) {
    return;
  }

  // turn off previous page button
  if (giMessagePage == 0) {
    DisableButton(giMailMessageButtons[0]);
  } else {
    EnableButton(giMailMessageButtons[0]);
  }

  // turn off next page button
  if (pEmailPageInfo[giMessagePage + 1].pFirstRecord == NULL) {
    DisableButton(giMailMessageButtons[1]);
  } else {
    EnableButton(giMailMessageButtons[1]);
  }

  return;
}

function SetUpIconForButton(): void {
  // if we just got in, return, don't set any

  if (fJustStartedEmail == TRUE) {
    return;
  }

  return;
}

function DeleteCurrentMessage(): void {
  // will delete the currently displayed message

  // set current message to be deleted
  iDeleteId = giMessageId;

  // set the currently displayed message to none
  giMessageId = -1;

  // reset display message flag
  fDisplayMessageFlag = FALSE;

  // reset page being displayed
  giMessagePage = 0;

  fDeleteInternal = TRUE;

  // delete message
  DeleteEmail();

  fDeleteInternal = FALSE;

  // force update of entire screen
  fReDrawScreenFlag = TRUE;

  // rerender email
  RenderEmail();

  return;
}

function CreateNextPreviousEmailPageButtons(): void {
  // this function will create the buttons to advance and go back email pages

  // next button
  giMailPageButtonsImage[0] = LoadButtonImage("LAPTOP\\NewMailButtons.sti", -1, 1, -1, 4, -1);
  giMailPageButtons[0] = QuickCreateButton(giMailPageButtonsImage[0], NEXT_PAGE_X, NEXT_PAGE_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, NextRegionButtonCallback);
  SetButtonCursor(giMailPageButtons[0], CURSOR_LAPTOP_SCREEN);

  // previous button
  giMailPageButtonsImage[1] = LoadButtonImage("LAPTOP\\NewMailButtons.sti", -1, 0, -1, 3, -1);
  giMailPageButtons[1] = QuickCreateButton(giMailPageButtonsImage[1], PREVIOUS_PAGE_X, NEXT_PAGE_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, PreviousRegionButtonCallback);
  SetButtonCursor(giMailPageButtons[1], CURSOR_LAPTOP_SCREEN);

  /*
  // set up disable methods
SpecifyDisabledButtonStyle( giMailPageButtons[1], DISABLED_STYLE_SHADED );
SpecifyDisabledButtonStyle( giMailPageButtons[0], DISABLED_STYLE_SHADED );
*/

  return;
}

function UpdateStatusOfNextPreviousButtons(): void {
  // set the states of the page advance buttons

  DisableButton(giMailPageButtons[0]);
  DisableButton(giMailPageButtons[1]);

  if (iCurrentPage > 0) {
    EnableButton(giMailPageButtons[1]);
  }

  if (iCurrentPage < iLastPage) {
    EnableButton(giMailPageButtons[0]);
  }
}

function DisplayWhichPageOfEmailProgramIsDisplayed(): void {
  // will draw the number of the email program we are viewing right now
  let sString: CHAR16[] /* [10] */;

  // font stuff
  SetFont(MESSAGE_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // page number
  if (iLastPage < 0)
    swprintf(sString, "%d / %d", 1, 1);
  else
    swprintf(sString, "%d / %d", iCurrentPage + 1, iLastPage + 1);

  // print it
  mprintf(PAGE_NUMBER_X, PAGE_NUMBER_Y, sString);

  // restore shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function OpenMostRecentUnreadEmail(): void {
  // will open the most recent email the player has recieved and not read
  let iMostRecentMailId: INT32 = -1;
  let pB: EmailPtr = pEmailList;
  let iLowestDate: UINT32 = 9999999;

  while (pB) {
    // if date is lesser and unread , swap
    if ((pB.value.iDate < iLowestDate) && (pB.value.fRead == FALSE)) {
      iMostRecentMailId = pB.value.iId;
      iLowestDate = pB.value.iDate;
    }

    // next in B's list
    pB = pB.value.Next;
  }

  // set up id
  giMessageId = iMostRecentMailId;

  // valid message, show it
  if (giMessageId != -1) {
    fDisplayMessageFlag = TRUE;
  }

  return;
}

function DisplayNumberOfPagesToThisEmail(iViewerY: INT32): BOOLEAN {
  // display the indent for the display of pages to this email..along with the current page/number of pages

  let iCounter: INT32 = 0;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let sString: CHAR16[] /* [32] */;

  // get and blt the email list background
  // load, blt and delete graphics
  // VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
  //	FilenameForBPP( "LAPTOP\\mailindent.sti", VObjectDesc.ImageFile );
  // CHECKF( AddVideoObject( &VObjectDesc, &uiMailIndent ) );
  // GetVideoObject( &hHandle, uiMailIndent );
  // BltVideoObject( FRAME_BUFFER, hHandle, 0,VIEWER_X + INDENT_X_OFFSET, VIEWER_Y + iViewerY + INDENT_Y_OFFSET - 10, VO_BLT_SRCTRANSPARENCY,NULL );
  // DeleteVideoObjectFromIndex( uiMailIndent );

  giNumberOfPagesToCurrentEmail = (giNumberOfPagesToCurrentEmail);

  // parse current page and max number of pages to email
  swprintf(sString, "%d / %d", (giMessagePage + 1), (giNumberOfPagesToCurrentEmail - 1));

  SetFont(FONT12ARIAL);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  // turn off the shadows
  SetFontShadow(NO_SHADOW);

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);

  FindFontCenterCoordinates(VIEWER_X + INDENT_X_OFFSET, 0, INDENT_X_WIDTH, 0, sString, FONT12ARIAL, &sX, &sY);
  mprintf(sX, VIEWER_Y + iViewerY + INDENT_Y_OFFSET - 2, sString);

  // restore shadows
  SetFontShadow(DEFAULT_SHADOW);

  return TRUE;
}

function GetNumberOfPagesToEmail(): INT32 {
  let pTempRecord: RecordPtr;
  let iNumberOfPagesToEmail: INT32 = 0;

  // set temp record to head of list
  pTempRecord = pMessageRecordList;

  // run through messages, and find out how many
  while (pTempRecord) {
    pTempRecord = GetFirstRecordOnThisPage(pMessageRecordList, MESSAGE_FONT, MESSAGE_WIDTH, MESSAGE_GAP, iNumberOfPagesToEmail, MAX_EMAIL_MESSAGE_PAGE_SIZE);
    iNumberOfPagesToEmail++;
  }

  return iNumberOfPagesToEmail;
}

function ShutDownEmailList(): void {
  let pEmail: EmailPtr = pEmailList;
  let pTempEmail: EmailPtr = NULL;

  // loop through all the emails to delete them
  while (pEmail) {
    pTempEmail = pEmail;

    pEmail = pEmail.value.Next;

    MemFree(pTempEmail.value.pSubject);
    pTempEmail.value.pSubject = NULL;

    MemFree(pTempEmail);
    pTempEmail = NULL;
  }
  pEmailList = NULL;

  ClearPages();
}

function PreProcessEmail(pMail: EmailPtr): void {
  let pTempRecord: RecordPtr;
  let pCurrentRecord: RecordPtr;
  let pLastRecord: RecordPtr;
  let pTempList: RecordPtr;
  let pString: CHAR16[] /* [512] */;
  let iCounter: INT32 = 0;
  let iHeight: INT32 = 0;
  let iOffSet: INT32 = 0;
  let fGoingOffCurrentPage: BOOLEAN = FALSE;
  let iYPositionOnPage: INT32 = 0;

  iOffSet = pMail.value.usOffset;

  // set record ptr to head of list
  pTempRecord = pMessageRecordList;

  if (pEmailPageInfo[0].pFirstRecord != NULL) {
    // already processed
    return;
  }

  // list doesn't exist, reload
  if (!pTempRecord) {
    while (pMail.value.usLength > iCounter) {
      // read one record from email file
      LoadEncryptedDataFromFile("BINARYDATA\\Email.edt", pString, MAIL_STRING_SIZE * (iOffSet + iCounter), MAIL_STRING_SIZE);

      // add to list
      AddEmailRecordToList(pString);

      // increment email record counter
      iCounter++;
    }
    giPrevMessageId = giMessageId;
  }

  // set record ptr to head of list
  pTempRecord = pMessageRecordList;
  // def removed
  // pass the subject line
  if (pTempRecord && pMail.value.usOffset != IMP_EMAIL_PROFILE_RESULTS) {
    pTempRecord = pTempRecord.value.Next;
  }

  // get number of pages to this email
  giNumberOfPagesToCurrentEmail = GetNumberOfPagesToEmail();

  while (pTempRecord) {
    // copy over string
    wcscpy(pString, pTempRecord.value.pRecord);

    // get the height of the string, ONLY!...must redisplay ON TOP OF background graphic
    iHeight += IanWrappedStringHeight(VIEWER_X + MESSAGE_X + 4, (VIEWER_MESSAGE_BODY_START_Y + iHeight + GetFontHeight(MESSAGE_FONT)), MESSAGE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR, pString, 0, FALSE, 0);

    // next message record string
    pTempRecord = pTempRecord.value.Next;
  }

  // set iViewerY so to center the viewer
  iViewerPositionY = (LAPTOP_SCREEN_LR_Y - 2 * VIEWER_Y - 2 * VIEWER_MESSAGE_BODY_START_Y - iHeight) / 2;

  if (iViewerPositionY < 0) {
    iViewerPositionY = 0;
  }

  // set total height to height of records displayed
  iTotalHeight = iHeight;

  // if the message background is less than MIN_MESSAGE_HEIGHT_IN_LINES, set to that number
  if ((iTotalHeight / GetFontHeight(MESSAGE_FONT)) < MIN_MESSAGE_HEIGHT_IN_LINES) {
    iTotalHeight = GetFontHeight(MESSAGE_FONT) * MIN_MESSAGE_HEIGHT_IN_LINES;
  }

  if (iTotalHeight > MAX_EMAIL_MESSAGE_PAGE_SIZE) {
    // if message to big to fit on page
    iTotalHeight = MAX_EMAIL_MESSAGE_PAGE_SIZE + 10;
  } else {
    iTotalHeight += 10;
  }

  pTempRecord = pMessageRecordList;

  if (iTotalHeight < MAX_EMAIL_MESSAGE_PAGE_SIZE) {
    fOnLastPageFlag = TRUE;

    if (pTempRecord && pMail.value.usOffset != IMP_EMAIL_PROFILE_RESULTS) {
      pTempRecord = pTempRecord.value.Next;
    }

    /*
    //Def removed
                    if( pTempRecord )
                    {
                            pTempRecord = pTempRecord->Next;
                    }
    */

    pEmailPageInfo[0].pFirstRecord = pTempRecord;
    pEmailPageInfo[0].iPageNumber = 0;

    Assert(pTempRecord); // required, otherwise we're testing pCurrentRecord when undefined later

    while (pTempRecord) {
      pCurrentRecord = pTempRecord;

      // increment email record ptr
      pTempRecord = pTempRecord.value.Next;
    }

    // only one record to this email?..then set next to null
    if (pCurrentRecord == pEmailPageInfo[0].pFirstRecord) {
      pCurrentRecord = NULL;
    }

    // set up the last record for the page
    pEmailPageInfo[0].pLastRecord = pCurrentRecord;

    // now set up the next page
    pEmailPageInfo[1].pFirstRecord = NULL;
    pEmailPageInfo[1].pLastRecord = NULL;
    pEmailPageInfo[1].iPageNumber = 1;
  } else {
    fOnLastPageFlag = FALSE;
    pTempList = pMessageRecordList;

    if (pTempList && pMail.value.usOffset != IMP_EMAIL_PROFILE_RESULTS) {
      pTempList = pTempList.value.Next;
    }

    /*
    //def removed
                    // skip the subject
                    if( pTempList )
                    {
                            pTempList = pTempList->Next;
                    }

    */
    iCounter = 0;

    // more than one page
    // for( iCounter = 0; iCounter < giNumberOfPagesToCurrentEmail; iCounter++ )
    while (pTempRecord = GetFirstRecordOnThisPage(pTempList, MESSAGE_FONT, MESSAGE_WIDTH, MESSAGE_GAP, iCounter, MAX_EMAIL_MESSAGE_PAGE_SIZE)) {
      iYPositionOnPage = 0;

      pEmailPageInfo[iCounter].pFirstRecord = pTempRecord;
      pEmailPageInfo[iCounter].iPageNumber = iCounter;
      pLastRecord = NULL;

      // go to the right record
      while (pTempRecord) {
        // copy over string
        wcscpy(pString, pTempRecord.value.pRecord);

        if (pString[0] == 0) {
          // on last page
          fOnLastPageFlag = TRUE;
        }

        if ((iYPositionOnPage + IanWrappedStringHeight(0, 0, MESSAGE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, 0, pTempRecord.value.pRecord, 0, 0, 0)) <= MAX_EMAIL_MESSAGE_PAGE_SIZE) {
          // now print it
          iYPositionOnPage += IanWrappedStringHeight(VIEWER_X + MESSAGE_X + 4, (VIEWER_MESSAGE_BODY_START_Y + 10 + iYPositionOnPage + iViewerPositionY), MESSAGE_WIDTH, MESSAGE_GAP, MESSAGE_FONT, MESSAGE_COLOR, pString, 0, FALSE, IAN_WRAP_NO_SHADOW);
          fGoingOffCurrentPage = FALSE;
        } else {
          // gonna get cut off...end now
          fGoingOffCurrentPage = TRUE;
        }

        pCurrentRecord = pTempRecord;
        pTempRecord = pTempRecord.value.Next;

        if (fGoingOffCurrentPage == FALSE) {
          pLastRecord = pTempRecord;
        }
        // record get cut off?...end now

        if (fGoingOffCurrentPage == TRUE) {
          pTempRecord = NULL;
        }
      }

      if (pLastRecord == pEmailPageInfo[iCounter].pFirstRecord) {
        pLastRecord = NULL;
      }

      pEmailPageInfo[iCounter].pLastRecord = pLastRecord;
      iCounter++;
    }

    pEmailPageInfo[iCounter].pFirstRecord = NULL;
    pEmailPageInfo[iCounter].pLastRecord = NULL;
    pEmailPageInfo[iCounter].iPageNumber = iCounter;
  }
}

function ModifyInsuranceEmails(usMessageId: UINT16, iResults: Pointer<INT32>, pMail: EmailPtr, ubNumberOfRecords: UINT8): void {
  let iHeight: INT32 = 0;
  let pTempRecord: RecordPtr;
  //	wchar_t pString[MAIL_STRING_SIZE/2 + 1];
  let pString: wchar_t[] /* [MAIL_STRING_SIZE] */;
  let ubCnt: UINT8;

  // Replace the name in the subject line
  //	swprintf( pMail->pSubject, gMercProfiles[ pMail->ubFirstData ].zNickname );

  // set record ptr to head of list
  pTempRecord = pMessageRecordList;

  // increment height for size of one line
  iHeight += GetFontHeight(MESSAGE_FONT);

  for (ubCnt = 0; ubCnt < ubNumberOfRecords; ubCnt++) {
    // read one record from email file
    LoadEncryptedDataFromFile("BINARYDATA\\Email.edt", pString, MAIL_STRING_SIZE * usMessageId, MAIL_STRING_SIZE);

    // Replace the $MERCNAME$ and $AMOUNT$ with the mercs name and the amountm if the string contains the keywords.
    ReplaceMercNameAndAmountWithProperData(pString, pMail);

    // add to list
    AddEmailRecordToList(pString);

    usMessageId++;
  }

  //
  giPrevMessageId = giMessageId;
}

function ReplaceMercNameAndAmountWithProperData(pFinishedString: Pointer<CHAR16>, pMail: EmailPtr): BOOLEAN {
  //	wchar_t		pTempString[MAIL_STRING_SIZE/2 + 1];
  let pTempString: wchar_t[] /* [MAIL_STRING_SIZE] */;
  let iLength: INT32 = 0;
  let iCurLocInSourceString: INT32 = 0;
  let iLengthOfSourceString: INT32 = wcslen(pFinishedString); // Get the length of the source string
  let pMercNameString: Pointer<CHAR16> = NULL;
  let pAmountString: Pointer<CHAR16> = NULL;
  let pSubString: Pointer<CHAR16> = NULL;
  let fReplacingMercName: BOOLEAN = TRUE;

  let sMercName: CHAR16[] /* [32] */ = "$MERCNAME$"; // Doesnt need to be translated, inside Email.txt and will be replaced by the mercs name
  let sAmount: CHAR16[] /* [32] */ = "$AMOUN$"; // Doesnt need to be translated, inside Email.txt and will be replaced by a dollar amount
  let sSearchString: CHAR16[] /* [32] */;

  // Copy the original string over to the temp string
  wcscpy(pTempString, pFinishedString);

  // Null out the string
  pFinishedString[0] = '\0';

  // Keep looping through to replace all references to the keyword
  while (iCurLocInSourceString < iLengthOfSourceString) {
    iLength = 0;
    pSubString = NULL;

    // Find out if the $MERCNAME$ is in the string
    pMercNameString = wcsstr(&pTempString[iCurLocInSourceString], sMercName);

    pAmountString = wcsstr(&pTempString[iCurLocInSourceString], sAmount);

    if (pMercNameString != NULL && pAmountString != NULL) {
      if (pMercNameString < pAmountString) {
        fReplacingMercName = TRUE;
        pSubString = pMercNameString;
        wcscpy(sSearchString, sMercName);
      } else {
        fReplacingMercName = FALSE;
        pSubString = pAmountString;
        wcscpy(sSearchString, sAmount);
      }
    } else if (pMercNameString != NULL) {
      fReplacingMercName = TRUE;
      pSubString = pMercNameString;
      wcscpy(sSearchString, sMercName);
    } else if (pAmountString != NULL) {
      fReplacingMercName = FALSE;
      pSubString = pAmountString;
      wcscpy(sSearchString, sAmount);
    } else {
      pSubString = NULL;
    }

    // if there is a substring
    if (pSubString != NULL) {
      iLength = pSubString - &pTempString[iCurLocInSourceString];

      // Copy the part of the source string upto the keyword
      wcsncat(pFinishedString, &pTempString[iCurLocInSourceString], iLength);

      // increment the source string counter by how far in the keyword is and by the length of the keyword
      iCurLocInSourceString += iLength + wcslen(sSearchString);

      if (fReplacingMercName) {
        // add the mercs name to the string
        wcscat(pFinishedString, gMercProfiles[pMail.value.uiSecondData].zName);
      } else {
        let sDollarAmount: CHAR16[] /* [64] */;

        swprintf(sDollarAmount, "%d", pMail.value.iFirstData);

        InsertCommasForDollarFigure(sDollarAmount);
        InsertDollarSignInToString(sDollarAmount);

        // add the mercs name to the string
        wcscat(pFinishedString, sDollarAmount);
      }
    } else {
      // add the rest of the string
      wcscat(pFinishedString, &pTempString[iCurLocInSourceString]);

      iCurLocInSourceString += wcslen(&pTempString[iCurLocInSourceString]);
    }
  }

  return TRUE;
}
