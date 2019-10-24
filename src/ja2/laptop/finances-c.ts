// the global defines

// graphical positions
const TOP_X = 0 + LAPTOP_SCREEN_UL_X;
const TOP_Y = LAPTOP_SCREEN_UL_Y;
const BLOCK_HEIGHT = 10;
const TOP_DIVLINE_Y = 102;
const DIVLINE_X = 130;
const MID_DIVLINE_Y = 205;
const BOT_DIVLINE_Y = 180;
const MID_DIVLINE_Y2 = 263 + 20;
const BOT_DIVLINE_Y2 = MID_DIVLINE_Y2 + MID_DIVLINE_Y - BOT_DIVLINE_Y;
const TITLE_X = 140;
const TITLE_Y = 33;
const TEXT_X = 140;
const PAGE_SIZE = 17;

// yesterdyas/todays income and balance text positions
const YESTERDAYS_INCOME = 114;
const YESTERDAYS_OTHER = 138;
const YESTERDAYS_DEBITS = 162;
const YESTERDAYS_BALANCE = 188;
const TODAYS_INCOME = 215;
const TODAYS_OTHER = 239;
const TODAYS_DEBITS = 263;
const TODAYS_CURRENT_BALANCE = 263 + 28;
const TODAYS_CURRENT_FORCAST_INCOME = 330;
const TODAYS_CURRENT_FORCAST_BALANCE = 354;
const FINANCE_HEADER_FONT = () => FONT14ARIAL();
const FINANCE_TEXT_FONT = () => FONT12ARIAL();
const NUM_RECORDS_PER_PAGE = PAGE_SIZE;

// records text positions
const RECORD_CREDIT_WIDTH = 106 - 47;
const RECORD_DEBIT_WIDTH = RECORD_CREDIT_WIDTH;
const RECORD_DATE_X = TOP_X + 10;
const RECORD_TRANSACTION_X = RECORD_DATE_X + RECORD_DATE_WIDTH;
const RECORD_TRANSACTION_WIDTH = 500 - 280;
const RECORD_DEBIT_X = RECORD_TRANSACTION_X + RECORD_TRANSACTION_WIDTH;
const RECORD_CREDIT_X = RECORD_DEBIT_X + RECORD_DEBIT_WIDTH;
const RECORD_Y = 107 - 10;
const RECORD_DATE_WIDTH = 47;
const RECORD_BALANCE_X = RECORD_DATE_X + 385;
const RECORD_BALANCE_WIDTH = 479 - 385;
const RECORD_HEADER_Y = 90;

const PAGE_NUMBER_X = TOP_X + 297; // 345
const PAGE_NUMBER_Y = TOP_Y + 33;

// BUTTON defines
const enum Enum79 {
  PREV_PAGE_BUTTON = 0,
  NEXT_PAGE_BUTTON,
  FIRST_PAGE_BUTTON,
  LAST_PAGE_BUTTON,
}

// button positions

const FIRST_PAGE_X = 505;
const NEXT_BTN_X = 553; // 577
const PREV_BTN_X = 529; // 553
const LAST_PAGE_X = 577;
const BTN_Y = 53;

// sizeof one record
const RECORD_SIZE = () => (sizeof(UINT32) + sizeof(INT32) + sizeof(INT32) + sizeof(UINT8) + sizeof(UINT8));

// the financial record list
let pFinanceListHead: FinanceUnitPtr = NULL;

// current players balance
// INT32 iCurrentBalance=0;

// current page displayed
let iCurrentPage: INT32 = 0;

// current financial record (the one at the top of the current page)
let pCurrentFinance: FinanceUnitPtr = NULL;

// video object id's
let guiTITLE: UINT32;
let guiGREYFRAME: UINT32;
let guiTOP: UINT32;
let guiMIDDLE: UINT32;
let guiBOTTOM: UINT32;
let guiLINE: UINT32;
let guiLONGLINE: UINT32;
let guiLISTCOLUMNS: UINT32;

// are in the financial system right now?
let fInFinancialMode: BOOLEAN = FALSE;

// the last page loaded
let guiLastPageLoaded: UINT32 = 0;

// the last page altogether
let guiLastPageInRecordsList: UINT32 = 0;

// finance screen buttons
let giFinanceButton: INT32[] /* [4] */;
let giFinanceButtonImage: INT32[] /* [4] */;

function AddTransactionToPlayersBook(ubCode: UINT8, ubSecondCode: UINT8, uiDate: UINT32, iAmount: INT32): UINT32 {
  // adds transaction to player's book(Financial List), returns unique id number of it
  // outside of the financial system(the code in this .c file), this is the only function you'll ever need

  let iCurPage: INT32 = iCurrentPage;
  let uiId: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  // read in balance from file

  GetBalanceFromDisk();
  // process the actual data

  //
  // If this transaction is for the hiring/extending of a mercs contract
  //
  if (ubCode == Enum80.HIRED_MERC || ubCode == Enum80.IMP_PROFILE || ubCode == Enum80.PAYMENT_TO_NPC || ubCode == Enum80.EXTENDED_CONTRACT_BY_1_DAY || ubCode == Enum80.EXTENDED_CONTRACT_BY_1_WEEK || ubCode == Enum80.EXTENDED_CONTRACT_BY_2_WEEKS) {
    gMercProfiles[ubSecondCode].uiTotalCostToDate += -iAmount;
  }

  // clear list
  ClearFinanceList();

  pFinance = pFinanceListHead;

  // update balance
  LaptopSaveInfo.iCurrentBalance += iAmount;

  uiId = ProcessAndEnterAFinacialRecord(ubCode, uiDate, iAmount, ubSecondCode, LaptopSaveInfo.iCurrentBalance);

  // write balance to disk
  WriteBalanceToDisk();

  // append to end of file
  AppendFinanceToEndOfFile(pFinance);

  // set number of pages
  SetLastPageInRecords();

  if (!fInFinancialMode) {
    ClearFinanceList();
  } else {
    SetFinanceButtonStates();

    // force update
    fPausedReDrawScreenFlag = TRUE;
  }

  fMapScreenBottomDirty = TRUE;

  // return unique id of this transaction
  return uiId;
}

function GetFinance(uiId: UINT32): FinanceUnitPtr {
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  // get a finance object and return a pointer to it, the obtaining of the
  // finance object is via a unique ID the programmer must store
  // , it is returned on addition of a financial transaction

  // error check
  if (!pFinance)
    return NULL;

  // look for finance object with Id
  while (pFinance) {
    if (pFinance.value.uiIdNumber == uiId)
      break;

    // next finance record
    pFinance = pFinance.value.Next;
  }

  return pFinance;
}

function GetTotalDebits(): UINT32 {
  // returns the total of the debits
  let uiDebits: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  // run to end of list
  while (pFinance) {
    // if a debit, add to debit total
    if (pFinance.value.iAmount > 0)
      uiDebits += ((pFinance.value.iAmount));

    // next finance record
    pFinance = pFinance.value.Next;
  }

  return uiDebits;
}

function GetTotalCredits(): UINT32 {
  // returns the total of the credits
  let uiCredits: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  // run to end of list
  while (pFinance) {
    // if a credit, add to credit total
    if (pFinance.value.iAmount < 0)
      uiCredits += ((pFinance.value.iAmount));

    // next finance record
    pFinance = pFinance.value.Next;
  }

  return uiCredits;
}

function GetDayCredits(usDayNumber: UINT32): UINT32 {
  // returns the total of the credits for day( note resolution of usDayNumber is days)
  let uiCredits: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  while (pFinance) {
    // if a credit and it occurs on day passed
    if ((pFinance.value.iAmount < 0) && ((pFinance.value.uiDate / (60 * 24)) == usDayNumber))
      uiCredits += ((pFinance.value.iAmount));

    // next finance record
    pFinance = pFinance.value.Next;
  }

  return uiCredits;
}

function GetDayDebits(usDayNumber: UINT32): UINT32 {
  // returns the total of the debits
  let uiDebits: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  while (pFinance) {
    if ((pFinance.value.iAmount > 0) && ((pFinance.value.uiDate / (60 * 24)) == usDayNumber))
      uiDebits += ((pFinance.value.iAmount));

    // next finance record
    pFinance = pFinance.value.Next;
  }

  return uiDebits;
}

function GetTotalToDay(sTimeInMins: INT32): INT32 {
  // gets the total amount to this day
  let uiTotal: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  while (pFinance) {
    if (((pFinance.value.uiDate / (60 * 24)) <= sTimeInMins / (24 * 60)))
      uiTotal += ((pFinance.value.iAmount));

    // next finance record
    pFinance = pFinance.value.Next;
  }

  return uiTotal;
}
function GetYesterdaysIncome(): INT32 {
  // get income for yesterday
  return GetDayDebits(((GetWorldTotalMin() - (24 * 60)) / (24 * 60))) + GetDayCredits(((GetWorldTotalMin() - (24 * 60)) / (24 * 60)));
}

function GetCurrentBalance(): INT32 {
  // get balance to this minute
  return LaptopSaveInfo.iCurrentBalance;

  // return(GetTotalDebits((GetWorldTotalMin()))+GetTotalCredits((GetWorldTotalMin())));
}

function GetTodaysIncome(): INT32 {
  // get income
  return GetCurrentBalance() - GetTotalToDay(GetWorldTotalMin() - (24 * 60));
}

function GetProjectedTotalDailyIncome(): INT32 {
  // return total  projected income, including what is earned today already

  // CJC: I DON'T THINK SO!
  // The point is:  PredictIncomeFromPlayerMines isn't dependant on the time of day
  // (anymore) and this would report income of 0 at midnight!
  /*
if (GetWorldMinutesInDay() <= 0)
  {
          return ( 0 );
  }
  */
  // look at we earned today

  // then there is how many deposits have been made, now look at how many mines we have, thier rate, amount of ore left and predict if we still
  // had these mines how much more would we get?

  return PredictIncomeFromPlayerMines();
}

function GetProjectedBalance(): INT32 {
  // return the projected balance for tommorow - total for today plus the total income, projected.
  return GetProjectedTotalDailyIncome() + GetCurrentBalance();
}

function GetConfidenceValue(): INT32 {
  // return confidence that the projected income is infact correct
  return (GetWorldMinutesInDay() * 100) / (60 * 24);
}

function GameInitFinances(): void {
  // initialize finances on game start up
  // unlink Finances data file
  if ((FileExists(FINANCES_DATA_FILE))) {
    FileClearAttributes(FINANCES_DATA_FILE);
    FileDelete(FINANCES_DATA_FILE);
  }
  GetBalanceFromDisk();
}

function EnterFinances(): void {
  // entry into finanacial system, load graphics, set variables..draw screen once
  // set the fact we are in the financial display system

  fInFinancialMode = TRUE;
  // build finances list
  // OpenAndReadFinancesFile( );

  // reset page we are on
  iCurrentPage = LaptopSaveInfo.iCurrentFinancesPage;

  // get the balance
  GetBalanceFromDisk();

  // clear the list
  ClearFinanceList();

  // force redraw of the entire screen
  fReDrawScreenFlag = TRUE;

  // set number of pages
  SetLastPageInRecords();

  // load graphics into memory
  LoadFinances();

  // create buttons
  CreateFinanceButtons();

  // set button state
  SetFinanceButtonStates();

  // draw finance
  RenderFinances();

  //  DrawSummary( );

  // draw page number
  DisplayFinancePageNumberAndDateRange();

  // InvalidateRegion(0,0,640,480);
  return;
}

function ExitFinances(): void {
  LaptopSaveInfo.iCurrentFinancesPage = iCurrentPage;

  // not in finance system anymore
  fInFinancialMode = FALSE;

  // destroy buttons
  DestroyFinanceButtons();

  // clear out list
  ClearFinanceList();

  // remove graphics
  RemoveFinances();
  return;
}

function HandleFinances(): void {
}

function RenderFinances(): void {
  let hHandle: HVOBJECT;

  // draw background
  RenderBackGround();

  // if we are on the first page, draw the summary
  if (iCurrentPage == 0)
    DrawSummary();
  else
    DrawAPageOfRecords();

  // title
  DrawFinanceTitleText();

  // draw pages and dates
  DisplayFinancePageNumberAndDateRange();

  // display border
  GetVideoObject(addressof(hHandle), guiLaptopBACKGROUND);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, 108, 23, VO_BLT_SRCTRANSPARENCY, NULL);

  // title bar icon
  BlitTitleBarIcons();

  return;
}

function LoadFinances(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  // load Finance video objects into memory

  // title bar
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\programtitlebar.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiTITLE)));

  // top portion of the screen background
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Financeswindow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiTOP)));

  // black divider line - long ( 480 length)
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\divisionline480.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLONGLINE)));

  // the records columns
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\recordcolumns.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLISTCOLUMNS)));

  // black divider line - long ( 480 length)
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\divisionline.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLINE)));

  return TRUE;
}

function RemoveFinances(): void {
  // delete Finance video objects from memory
  DeleteVideoObjectFromIndex(guiLONGLINE);
  DeleteVideoObjectFromIndex(guiLINE);
  DeleteVideoObjectFromIndex(guiLISTCOLUMNS);
  DeleteVideoObjectFromIndex(guiTOP);
  DeleteVideoObjectFromIndex(guiTITLE);

  return;
}

function RenderBackGround(): void {
  // render generic background for Finance system
  let hHandle: HVOBJECT;
  let iCounter: INT32 = 0;

  // get title bar object
  GetVideoObject(addressof(hHandle), guiTITLE);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X, TOP_Y - 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // get and blt the top part of the screen, video object and blt to screen
  GetVideoObject(addressof(hHandle), guiTOP);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X, TOP_Y + 22, VO_BLT_SRCTRANSPARENCY, NULL);
  DrawFinanceTitleText();
  return;
}

function DrawSummary(): void {
  // draw day's summary to screen
  DrawSummaryLines();
  DrawSummaryText();
  DrawFinanceTitleText();
  return;
}

function DrawSummaryLines(): void {
  // draw divider lines on screen
  let hHandle: HVOBJECT;

  // the summary LINE object handle
  GetVideoObject(addressof(hHandle), guiLINE);

  // blit summary LINE object to screen
  BltVideoObject(FRAME_BUFFER, hHandle, 0, DIVLINE_X, TOP_DIVLINE_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, DIVLINE_X, TOP_DIVLINE_Y + 2, VO_BLT_SRCTRANSPARENCY, NULL);
  // BltVideoObject(FRAME_BUFFER, hHandle, 0,DIVLINE_X, MID_DIVLINE_Y, VO_BLT_SRCTRANSPARENCY,NULL);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, DIVLINE_X, BOT_DIVLINE_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, DIVLINE_X, MID_DIVLINE_Y2, VO_BLT_SRCTRANSPARENCY, NULL);
  // BltVideoObject(FRAME_BUFFER, hHandle, 0,DIVLINE_X, BOT_DIVLINE_Y2, VO_BLT_SRCTRANSPARENCY,NULL);

  return;
}

function DrawAPageOfRecords(): void {
  // this procedure will draw a series of financial records to the screen
  let iCurPage: INT32 = 1;
  let iCount: INT32 = 0;
  pCurrentFinance = pFinanceListHead;

  // (re-)render background
  DrawRecordsBackGround();

  // error check
  if (iCurrentPage == -1)
    return;

  // current page is found, render  from here
  DrawRecordsText();
  DisplayFinancePageNumberAndDateRange();
  return;
}

function DrawRecordsBackGround(): void {
  // proceudre will draw the background for the list of financial records
  let iCounter: INT32 = 6;
  let hHandle: HVOBJECT;

  // render the generic background
  RenderBackGround();

  // now the columns
  for (iCounter; iCounter < 35; iCounter++) {
    // get and blt middle background to screen
    GetVideoObject(addressof(hHandle), guiLISTCOLUMNS);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X + 10, TOP_Y + 18 + (iCounter * BLOCK_HEIGHT) + 1, VO_BLT_SRCTRANSPARENCY, NULL);
  }

  // the divisorLines
  GetVideoObject(addressof(hHandle), guiLONGLINE);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X + 10, TOP_Y + 17 + (6 * (BLOCK_HEIGHT)), VO_BLT_SRCTRANSPARENCY, NULL);
  GetVideoObject(addressof(hHandle), guiLONGLINE);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X + 10, TOP_Y + 19 + (6 * (BLOCK_HEIGHT)), VO_BLT_SRCTRANSPARENCY, NULL);
  GetVideoObject(addressof(hHandle), guiLONGLINE);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, TOP_X + 10, TOP_Y + 19 + ((iCounter) * (BLOCK_HEIGHT)), VO_BLT_SRCTRANSPARENCY, NULL);

  // the header text
  DrawRecordsColumnHeadersText();

  return;
}

function DrawRecordsColumnHeadersText(): void {
  // write the headers text for each column
  let usX: UINT16;
  let usY: UINT16;

  // font stuff
  SetFont(FINANCE_TEXT_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // the date header
  FindFontCenterCoordinates(RECORD_DATE_X, 0, RECORD_DATE_WIDTH, 0, pFinanceHeaders[0], FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, RECORD_HEADER_Y, pFinanceHeaders[0]);

  // debit header
  FindFontCenterCoordinates(RECORD_DEBIT_X, 0, RECORD_DEBIT_WIDTH, 0, pFinanceHeaders[1], FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, RECORD_HEADER_Y, pFinanceHeaders[1]);

  // credit header
  FindFontCenterCoordinates(RECORD_CREDIT_X, 0, RECORD_CREDIT_WIDTH, 0, pFinanceHeaders[2], FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, RECORD_HEADER_Y, pFinanceHeaders[2]);

  // balance header
  FindFontCenterCoordinates(RECORD_BALANCE_X, 0, RECORD_BALANCE_WIDTH, 0, pFinanceHeaders[4], FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, RECORD_HEADER_Y, pFinanceHeaders[4]);

  // transaction header
  FindFontCenterCoordinates(RECORD_TRANSACTION_X, 0, RECORD_TRANSACTION_WIDTH, 0, pFinanceHeaders[3], FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, RECORD_HEADER_Y, pFinanceHeaders[3]);

  SetFontShadow(DEFAULT_SHADOW);
  return;
}

function DrawRecordsText(): void {
  // draws the text of the records
  let pCurFinance: FinanceUnitPtr = pCurrentFinance;
  let pTempFinance: FinanceUnitPtr = pFinanceListHead;
  let sString: wchar_t[] /* [512] */;
  let iCounter: INT32 = 0;
  let usX: UINT16;
  let usY: UINT16;
  let iBalance: INT32 = 0;

  // setup the font stuff
  SetFont(FINANCE_TEXT_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // anything to print
  if (pCurrentFinance == NULL) {
    // nothing to print
    return;
  }

  // get balance to this point
  while (pTempFinance != pCurFinance) {
    // increment balance by amount of transaction
    iBalance += pTempFinance.value.iAmount;

    // next element
    pTempFinance = pTempFinance.value.Next;
  }

  // loop through record list
  for (iCounter; iCounter < NUM_RECORDS_PER_PAGE; iCounter++) {
    // get and write the date
    swprintf(sString, "%d", pCurFinance.value.uiDate / (24 * 60));

    FindFontCenterCoordinates(RECORD_DATE_X, 0, RECORD_DATE_WIDTH, 0, sString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
    mprintf(usX, 12 + RECORD_Y + (iCounter * (GetFontHeight(FINANCE_TEXT_FONT) + 6)), sString);

    // get and write debit/ credit
    if (pCurFinance.value.iAmount >= 0) {
      // increase in asset - debit
      swprintf(sString, "%d", pCurFinance.value.iAmount);
      // insert commas
      InsertCommasForDollarFigure(sString);
      // insert dollar sight for first record in the list
      // DEF: 3/19/99: removed cause we want to see the dollar sign on ALL entries
      //		 if( iCounter == 0 )
      { InsertDollarSignInToString(sString); }

      FindFontCenterCoordinates(RECORD_DEBIT_X, 0, RECORD_DEBIT_WIDTH, 0, sString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
      mprintf(usX, 12 + RECORD_Y + (iCounter * (GetFontHeight(FINANCE_TEXT_FONT) + 6)), sString);
    } else {
      // decrease in asset - credit
      swprintf(sString, "%d", pCurFinance.value.iAmount * (-1));
      SetFontForeground(FONT_RED);
      InsertCommasForDollarFigure(sString);
      // insert dollar sight for first record in the list
      // DEF: 3/19/99: removed cause we want to see the dollar sign on ALL entries
      //		 if( iCounter == 0 )
      { InsertDollarSignInToString(sString); }

      FindFontCenterCoordinates(RECORD_CREDIT_X, 0, RECORD_CREDIT_WIDTH, 0, sString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
      mprintf(usX, 12 + RECORD_Y + (iCounter * (GetFontHeight(FINANCE_TEXT_FONT) + 6)), sString);
      SetFontForeground(FONT_BLACK);
    }

    // the balance to this point
    iBalance = pCurFinance.value.iBalanceToDate;

    // set font based on balance
    if (iBalance >= 0) {
      SetFontForeground(FONT_BLACK);
    } else {
      SetFontForeground(FONT_RED);
      iBalance = (iBalance) * (-1);
    }

    // transaction string
    ProcessTransactionString(sString, pCurFinance);
    FindFontCenterCoordinates(RECORD_TRANSACTION_X, 0, RECORD_TRANSACTION_WIDTH, 0, sString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
    mprintf(usX, 12 + RECORD_Y + (iCounter * (GetFontHeight(FINANCE_TEXT_FONT) + 6)), sString);

    // print the balance string
    swprintf(sString, "%d", iBalance);
    InsertCommasForDollarFigure(sString);
    // insert dollar sight for first record in the list
    // DEF: 3/19/99: removed cause we want to see the dollar sign on ALL entries
    //		if( iCounter == 0 )
    { InsertDollarSignInToString(sString); }

    FindFontCenterCoordinates(RECORD_BALANCE_X, 0, RECORD_BALANCE_WIDTH, 0, sString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
    mprintf(usX, 12 + RECORD_Y + (iCounter * (GetFontHeight(FINANCE_TEXT_FONT) + 6)), sString);

    // restore font color
    SetFontForeground(FONT_BLACK);

    // next finance
    pCurFinance = pCurFinance.value.Next;

    // last page, no finances left, return
    if (!pCurFinance) {
      // restore shadow
      SetFontShadow(DEFAULT_SHADOW);
      return;
    }
  }

  // restore shadow
  SetFontShadow(DEFAULT_SHADOW);
  return;
}
function DrawFinanceTitleText(): void {
  // setup the font stuff
  SetFont(FINANCE_HEADER_FONT);
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  // draw the pages title
  mprintf(TITLE_X, TITLE_Y, pFinanceTitle[0]);

  return;
}

function InvalidateLapTopScreen(): void {
  // invalidates blit region to force refresh of screen

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_LR_Y);

  return;
}

function DrawSummaryText(): void {
  let usX: INT16;
  let usY: INT16;
  let pString: wchar_t[] /* [100] */;
  let iBalance: INT32 = 0;

  // setup the font stuff
  SetFont(FINANCE_TEXT_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // draw summary text to the screen
  mprintf(TEXT_X, YESTERDAYS_INCOME, pFinanceSummary[2]);
  mprintf(TEXT_X, YESTERDAYS_OTHER, pFinanceSummary[3]);
  mprintf(TEXT_X, YESTERDAYS_DEBITS, pFinanceSummary[4]);
  mprintf(TEXT_X, YESTERDAYS_BALANCE, pFinanceSummary[5]);
  mprintf(TEXT_X, TODAYS_INCOME, pFinanceSummary[6]);
  mprintf(TEXT_X, TODAYS_OTHER, pFinanceSummary[7]);
  mprintf(TEXT_X, TODAYS_DEBITS, pFinanceSummary[8]);
  mprintf(TEXT_X, TODAYS_CURRENT_BALANCE, pFinanceSummary[9]);
  mprintf(TEXT_X, TODAYS_CURRENT_FORCAST_INCOME, pFinanceSummary[10]);
  mprintf(TEXT_X, TODAYS_CURRENT_FORCAST_BALANCE, pFinanceSummary[11]);

  // draw the actual numbers

  // yesterdays income
  iBalance = GetPreviousDaysIncome();
  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);

  if (iBalance != 0)
    InsertDollarSignInToString(pString);

  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, YESTERDAYS_INCOME, pString);

  SetFontForeground(FONT_BLACK);

  // yesterdays other
  iBalance = GetYesterdaysOtherDeposits();
  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, YESTERDAYS_OTHER, pString);

  SetFontForeground(FONT_RED);

  // yesterdays debits
  iBalance = GetYesterdaysDebits();
  if (iBalance < 0) {
    SetFontForeground(FONT_RED);
    iBalance *= -1;
  }

  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, YESTERDAYS_DEBITS, pString);

  SetFontForeground(FONT_BLACK);

  // yesterdays balance..ending balance..so todays balance then
  iBalance = GetTodaysBalance();

  if (iBalance < 0) {
    SetFontForeground(FONT_RED);
    iBalance *= -1;
  }

  swprintf(pString, "%d", iBalance);
  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, YESTERDAYS_BALANCE, pString);

  SetFontForeground(FONT_BLACK);

  // todays income
  iBalance = GetTodaysDaysIncome();
  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, TODAYS_INCOME, pString);

  SetFontForeground(FONT_BLACK);

  // todays other
  iBalance = GetTodaysOtherDeposits();
  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, TODAYS_OTHER, pString);

  SetFontForeground(FONT_RED);

  // todays debits
  iBalance = GetTodaysDebits();

  // absolute value
  if (iBalance < 0) {
    iBalance *= (-1);
  }

  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, TODAYS_DEBITS, pString);

  SetFontForeground(FONT_BLACK);

  // todays current balance
  iBalance = GetCurrentBalance();
  if (iBalance < 0) {
    iBalance *= -1;
    SetFontForeground(FONT_RED);
    swprintf(pString, "%d", iBalance);
    iBalance *= -1;
  } else {
    swprintf(pString, "%d", iBalance);
  }

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, TODAYS_CURRENT_BALANCE, pString);
  SetFontForeground(FONT_BLACK);

  // todays forcast income
  iBalance = GetProjectedTotalDailyIncome();
  swprintf(pString, "%d", iBalance);

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));

  mprintf(usX, TODAYS_CURRENT_FORCAST_INCOME, pString);

  SetFontForeground(FONT_BLACK);

  // todays forcast balance
  iBalance = GetCurrentBalance() + GetProjectedTotalDailyIncome();
  if (iBalance < 0) {
    iBalance *= -1;
    SetFontForeground(FONT_RED);
    swprintf(pString, "%d", iBalance);
    iBalance *= -1;
  } else {
    swprintf(pString, "%d", iBalance);
  }

  InsertCommasForDollarFigure(pString);
  if (iBalance != 0)
    InsertDollarSignInToString(pString);
  FindFontRightCoordinates(0, 0, 580, 0, pString, FINANCE_TEXT_FONT, addressof(usX), addressof(usY));
  mprintf(usX, TODAYS_CURRENT_FORCAST_BALANCE, pString);
  SetFontForeground(FONT_BLACK);

  // reset the shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function OpenAndReadFinancesFile(): void {
  // this procedure will open and read in data to the finance list
  let hFileHandle: HWFILE;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let iBytesRead: INT32 = 0;
  let uiByteCount: UINT32 = 0;

  // clear out the old list
  ClearFinanceList();

  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return;
  }

  // make sure file is more than 0 length
  if (FileGetSize(hFileHandle) == 0) {
    FileClose(hFileHandle);
    return;
  }

  // read in balance
  // write balance to disk first
  FileRead(hFileHandle, addressof(LaptopSaveInfo.iCurrentBalance), sizeof(INT32), addressof(iBytesRead));
  uiByteCount += sizeof(INT32);

  AssertMsg(iBytesRead, "Failed To Read Data Entry");

  // file exists, read in data, continue until file end
  while (FileGetSize(hFileHandle) > uiByteCount) {
    // read in other data
    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");

    // add transaction
    ProcessAndEnterAFinacialRecord(ubCode, uiDate, iAmount, ubSecondCode, iBalanceToDate);

    // increment byte counter
    uiByteCount += sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32);
  }

  // close file
  FileClose(hFileHandle);

  return;
}

function ClearFinanceList(): void {
  // remove each element from list of transactions
  let pFinanceList: FinanceUnitPtr = pFinanceListHead;
  let pFinanceNode: FinanceUnitPtr = pFinanceList;

  // while there are elements in the list left, delete them
  while (pFinanceList) {
    // set node to list head
    pFinanceNode = pFinanceList;

    // set list head to next node
    pFinanceList = pFinanceList.value.Next;

    // delete current node
    MemFree(pFinanceNode);
  }
  pCurrentFinance = NULL;
  pFinanceListHead = NULL;
  return;
}

function ProcessAndEnterAFinacialRecord(ubCode: UINT8, uiDate: UINT32, iAmount: INT32, ubSecondCode: UINT8, iBalanceToDate: INT32): UINT32 {
  let uiId: UINT32 = 0;
  let pFinance: FinanceUnitPtr = pFinanceListHead;

  // add to finance list
  if (pFinance) {
    // go to end of list
    while (pFinance.value.Next)
      pFinance = pFinance.value.Next;

    // alloc space
    pFinance.value.Next = MemAlloc(sizeof(FinanceUnit));

    // increment id number
    uiId = pFinance.value.uiIdNumber + 1;

    // set up information passed
    pFinance = pFinance.value.Next;
    pFinance.value.Next = NULL;
    pFinance.value.ubCode = ubCode;
    pFinance.value.ubSecondCode = ubSecondCode;
    pFinance.value.uiDate = uiDate;
    pFinance.value.iAmount = iAmount;
    pFinance.value.uiIdNumber = uiId;
    pFinance.value.iBalanceToDate = iBalanceToDate;
  } else {
    // alloc space
    uiId = ReadInLastElementOfFinanceListAndReturnIdNumber();
    pFinance = MemAlloc(sizeof(FinanceUnit));

    // setup info passed
    pFinance.value.Next = NULL;
    pFinance.value.ubCode = ubCode;
    pFinance.value.ubSecondCode = ubSecondCode;
    pFinance.value.uiDate = uiDate;
    pFinance.value.iAmount = iAmount;
    pFinance.value.uiIdNumber = uiId;
    pFinance.value.iBalanceToDate = iBalanceToDate;
    pFinanceListHead = pFinance;
  }
  pCurrentFinance = pFinanceListHead;

  return uiId;
}

function CreateFinanceButtons(): void {
  giFinanceButtonImage[Enum79.PREV_PAGE_BUTTON] = LoadButtonImage("LAPTOP\\arrows.sti", -1, 0, -1, 1, -1);
  giFinanceButton[Enum79.PREV_PAGE_BUTTON] = QuickCreateButton(giFinanceButtonImage[Enum79.PREV_PAGE_BUTTON], PREV_BTN_X, BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnFinanceDisplayPrevPageCallBack);

  giFinanceButtonImage[Enum79.NEXT_PAGE_BUTTON] = UseLoadedButtonImage(giFinanceButtonImage[Enum79.PREV_PAGE_BUTTON], -1, 6, -1, 7, -1);
  giFinanceButton[Enum79.NEXT_PAGE_BUTTON] = QuickCreateButton(giFinanceButtonImage[Enum79.NEXT_PAGE_BUTTON], NEXT_BTN_X, BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnFinanceDisplayNextPageCallBack);

  // button to go to the first page
  giFinanceButtonImage[Enum79.FIRST_PAGE_BUTTON] = UseLoadedButtonImage(giFinanceButtonImage[Enum79.PREV_PAGE_BUTTON], -1, 3, -1, 4, -1);
  giFinanceButton[Enum79.FIRST_PAGE_BUTTON] = QuickCreateButton(giFinanceButtonImage[Enum79.FIRST_PAGE_BUTTON], FIRST_PAGE_X, BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnFinanceFirstLastPageCallBack);

  MSYS_SetBtnUserData(giFinanceButton[Enum79.FIRST_PAGE_BUTTON], 0, 0);

  // button to go to the last page
  giFinanceButtonImage[Enum79.LAST_PAGE_BUTTON] = UseLoadedButtonImage(giFinanceButtonImage[Enum79.PREV_PAGE_BUTTON], -1, 9, -1, 10, -1);
  giFinanceButton[Enum79.LAST_PAGE_BUTTON] = QuickCreateButton(giFinanceButtonImage[Enum79.LAST_PAGE_BUTTON], LAST_PAGE_X, BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, BtnGenericMouseMoveButtonCallback, BtnFinanceFirstLastPageCallBack);
  MSYS_SetBtnUserData(giFinanceButton[Enum79.LAST_PAGE_BUTTON], 0, 1);

  SetButtonCursor(giFinanceButton[0], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(giFinanceButton[1], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(giFinanceButton[2], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(giFinanceButton[3], Enum317.CURSOR_LAPTOP_SCREEN);
  return;
}

function DestroyFinanceButtons(): void {
  let uiCnt: UINT32;

  for (uiCnt = 0; uiCnt < 4; uiCnt++) {
    RemoveButton(giFinanceButton[uiCnt]);
    UnloadButtonImage(giFinanceButtonImage[uiCnt]);
  }
}
function BtnFinanceDisplayPrevPageCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

    // if greater than page zero, we can move back, decrement iCurrentPage counter
    LoadPreviousPage();
    pCurrentFinance = pFinanceListHead;

    // set button state
    SetFinanceButtonStates();
    fReDrawScreenFlag = TRUE;
  }
}

function BtnFinanceDisplayNextPageCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
    // increment currentPage
    // IncrementCurrentPageFinancialDisplay( );
    LoadNextPage();

    // set button state
    SetFinanceButtonStates();

    pCurrentFinance = pFinanceListHead;
    // redraw screen
    fReDrawScreenFlag = TRUE;
  }
}

function BtnFinanceFirstLastPageCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiButton: UINT32 = MSYS_GetBtnUserData(btn, 0);

    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

    // if its the first page button
    if (uiButton == 0) {
      iCurrentPage = 0;
      LoadInRecords(iCurrentPage);
    }

    // else its the last page button
    else {
      LoadInRecords(guiLastPageInRecordsList + 1);

      iCurrentPage = guiLastPageInRecordsList + 1;
    }

    // set button state
    SetFinanceButtonStates();

    pCurrentFinance = pFinanceListHead;
    // redraw screen
    fReDrawScreenFlag = TRUE;
  }
}

function IncrementCurrentPageFinancialDisplay(): void {
  // run through list, from pCurrentFinance, to NUM_RECORDS_PER_PAGE +1 FinancialUnits
  let pTempFinance: FinanceUnitPtr = pCurrentFinance;
  let fOkToIncrementPage: BOOLEAN = FALSE;
  let iCounter: INT32 = 0;

  // on the overview page, simply set iCurrent to head of list, and page to 1
  if (iCurrentPage == 0) {
    pCurrentFinance = pFinanceListHead;
    iCurrentPage = 1;

    return;
  }

  // no list, we are on page 2
  if (pTempFinance == NULL) {
    iCurrentPage = 2;
    return;
  }

  // haven't reached end of list and not yet at beginning of next page
  while ((pTempFinance) && (!fOkToIncrementPage)) {
    // found the next page,  first record thereof
    if (iCounter == NUM_RECORDS_PER_PAGE + 1) {
      fOkToIncrementPage = TRUE;
      pCurrentFinance = pTempFinance.value.Next;
    }

    // next record
    pTempFinance = pTempFinance.value.Next;
    iCounter++;
  }

  // if ok to increment, increment
  if (fOkToIncrementPage) {
    iCurrentPage++;
  }

  return;
}

function ProcessTransactionString(pString: STR16, pFinance: FinanceUnitPtr): void {
  switch (pFinance.value.ubCode) {
    case Enum80.ACCRUED_INTEREST:
      swprintf(pString, "%s", pTransactionText[Enum80.ACCRUED_INTEREST]);
      break;

    case Enum80.ANONYMOUS_DEPOSIT:
      swprintf(pString, "%s", pTransactionText[Enum80.ANONYMOUS_DEPOSIT]);
      break;

    case Enum80.TRANSACTION_FEE:
      swprintf(pString, "%s", pTransactionText[Enum80.TRANSACTION_FEE]);
      break;

    case Enum80.HIRED_MERC:
      swprintf(pString, pMessageStrings[Enum333.MSG_HIRED_MERC], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.BOBBYR_PURCHASE:
      swprintf(pString, "%s", pTransactionText[Enum80.BOBBYR_PURCHASE]);
      break;

    case Enum80.PAY_SPECK_FOR_MERC:
      swprintf(pString, "%s", pTransactionText[Enum80.PAY_SPECK_FOR_MERC], gMercProfiles[pFinance.value.ubSecondCode].zName);
      break;

    case Enum80.MEDICAL_DEPOSIT:
      swprintf(pString, pTransactionText[Enum80.MEDICAL_DEPOSIT], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.IMP_PROFILE:
      swprintf(pString, "%s", pTransactionText[Enum80.IMP_PROFILE]);
      break;

    case Enum80.PURCHASED_INSURANCE:
      swprintf(pString, pTransactionText[Enum80.PURCHASED_INSURANCE], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.REDUCED_INSURANCE:
      swprintf(pString, pTransactionText[Enum80.REDUCED_INSURANCE], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.EXTENDED_INSURANCE:
      swprintf(pString, pTransactionText[Enum80.EXTENDED_INSURANCE], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.CANCELLED_INSURANCE:
      swprintf(pString, pTransactionText[Enum80.CANCELLED_INSURANCE], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.INSURANCE_PAYOUT:
      swprintf(pString, pTransactionText[Enum80.INSURANCE_PAYOUT], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.EXTENDED_CONTRACT_BY_1_DAY:
      swprintf(pString, pTransactionAlternateText[1], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.EXTENDED_CONTRACT_BY_1_WEEK:
      swprintf(pString, pTransactionAlternateText[2], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.EXTENDED_CONTRACT_BY_2_WEEKS:
      swprintf(pString, pTransactionAlternateText[3], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.DEPOSIT_FROM_GOLD_MINE:
    case Enum80.DEPOSIT_FROM_SILVER_MINE:
      swprintf(pString, pTransactionText[16]);
      break;

    case Enum80.PURCHASED_FLOWERS:
      swprintf(pString, "%s", pTransactionText[Enum80.PURCHASED_FLOWERS]);
      break;

    case Enum80.FULL_MEDICAL_REFUND:
      swprintf(pString, pTransactionText[Enum80.FULL_MEDICAL_REFUND], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.PARTIAL_MEDICAL_REFUND:
      swprintf(pString, pTransactionText[Enum80.PARTIAL_MEDICAL_REFUND], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.NO_MEDICAL_REFUND:
      swprintf(pString, pTransactionText[Enum80.NO_MEDICAL_REFUND], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case Enum80.TRANSFER_FUNDS_TO_MERC:
      swprintf(pString, pTransactionText[Enum80.TRANSFER_FUNDS_TO_MERC], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;
    case Enum80.TRANSFER_FUNDS_FROM_MERC:
      swprintf(pString, pTransactionText[Enum80.TRANSFER_FUNDS_FROM_MERC], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;
    case Enum80.PAYMENT_TO_NPC:
      swprintf(pString, pTransactionText[Enum80.PAYMENT_TO_NPC], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;
    case (Enum80.TRAIN_TOWN_MILITIA): {
      let str: UINT16[] /* [128] */;
      let ubSectorX: UINT8;
      let ubSectorY: UINT8;
      ubSectorX = SECTORX(pFinance.value.ubSecondCode);
      ubSectorY = SECTORY(pFinance.value.ubSecondCode);
      GetSectorIDString(ubSectorX, ubSectorY, 0, str, TRUE);
      swprintf(pString, pTransactionText[Enum80.TRAIN_TOWN_MILITIA], str);
    } break;

    case (Enum80.PURCHASED_ITEM_FROM_DEALER):
      swprintf(pString, pTransactionText[Enum80.PURCHASED_ITEM_FROM_DEALER], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;

    case (Enum80.MERC_DEPOSITED_MONEY_TO_PLAYER_ACCOUNT):
      swprintf(pString, pTransactionText[Enum80.MERC_DEPOSITED_MONEY_TO_PLAYER_ACCOUNT], gMercProfiles[pFinance.value.ubSecondCode].zNickname);
      break;
  }
}

function DisplayFinancePageNumberAndDateRange(): void {
  // this function will go through the list of 'histories' starting at current until end or
  // MAX_PER_PAGE...it will get the date range and the page number
  let iLastPage: INT32 = 0;
  let iCounter: INT32 = 0;
  let uiLastDate: UINT32;
  let pTempFinance: FinanceUnitPtr = pFinanceListHead;
  let sString: wchar_t[] /* [50] */;

  // setup the font stuff
  SetFont(FINANCE_TEXT_FONT);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  if (!pCurrentFinance) {
    pCurrentFinance = pFinanceListHead;
    if (!pCurrentFinance) {
      swprintf(sString, "%s %d / %d", pFinanceHeaders[5], iCurrentPage + 1, guiLastPageInRecordsList + 2);
      mprintf(PAGE_NUMBER_X, PAGE_NUMBER_Y, sString);
      return;
    }
  }

  uiLastDate = pCurrentFinance.value.uiDate;
  // find last page
  while (pTempFinance) {
    iCounter++;
    pTempFinance = pTempFinance.value.Next;
  }

  // get the last page

  swprintf(sString, "%s %d / %d", pFinanceHeaders[5], iCurrentPage + 1, guiLastPageInRecordsList + 2);
  mprintf(PAGE_NUMBER_X, PAGE_NUMBER_Y, sString);

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);
}

function WriteBalanceToDisk(): BOOLEAN {
  // will write the current balance to disk
  let hFileHandle: HWFILE;
  let iBytesWritten: INT32 = 0;
  let pFinanceList: FinanceUnitPtr = pFinanceListHead;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);

  // write balance to disk
  FileWrite(hFileHandle, addressof(LaptopSaveInfo.iCurrentBalance), sizeof(INT32), NULL);

  // close file
  FileClose(hFileHandle);

  return TRUE;
}

function GetBalanceFromDisk(): void {
  // will grab the current blanace from disk
  // assuming file already openned
  // this procedure will open and read in data to the finance list
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    LaptopSaveInfo.iCurrentBalance = 0;
    // close file
    FileClose(hFileHandle);
    return;
  }

  // start at beginning
  FileSeek(hFileHandle, 0, FILE_SEEK_FROM_START);

  // get balance from disk first
  FileRead(hFileHandle, addressof(LaptopSaveInfo.iCurrentBalance), sizeof(INT32), addressof(iBytesRead));

  AssertMsg(iBytesRead, "Failed To Read Data Entry");

  // close file
  FileClose(hFileHandle);

  return;
}

function AppendFinanceToEndOfFile(pFinance: FinanceUnitPtr): BOOLEAN {
  // will write the current finance to disk
  let hFileHandle: HWFILE;
  let iBytesWritten: INT32 = 0;
  let pFinanceList: FinanceUnitPtr = pFinanceListHead;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);

  // if no file exits, do nothing
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return FALSE;
  }

  // go to the end
  if (FileSeek(hFileHandle, 0, FILE_SEEK_FROM_END) == FALSE) {
    // error
    FileClose(hFileHandle);
    return FALSE;
  }

  // write finance to disk
  // now write date and amount, and code
  FileWrite(hFileHandle, addressof(pFinanceList.value.ubCode), sizeof(UINT8), NULL);
  FileWrite(hFileHandle, addressof(pFinanceList.value.ubSecondCode), sizeof(UINT8), NULL);
  FileWrite(hFileHandle, addressof(pFinanceList.value.uiDate), sizeof(UINT32), NULL);
  FileWrite(hFileHandle, addressof(pFinanceList.value.iAmount), sizeof(INT32), NULL);
  FileWrite(hFileHandle, addressof(pFinanceList.value.iBalanceToDate), sizeof(INT32), NULL);

  // close file
  FileClose(hFileHandle);

  return TRUE;
}

function ReadInLastElementOfFinanceListAndReturnIdNumber(): UINT32 {
  // this function will read in the last unit in the finance list, to grab it's id number

  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iFileSize: INT32 = 0;

  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // make sure file is more than balance size + length of 1 record - 1 byte
  if (FileGetSize(hFileHandle) < sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32)) {
    FileClose(hFileHandle);
    return 0;
  }

  // size is?
  iFileSize = FileGetSize(hFileHandle);

  // done with file, close it
  FileClose(hFileHandle);

  // file size -1 / sizeof record in bytes is id
  return (iFileSize - 1) / (sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32));
}

function SetLastPageInRecords(): void {
  // grabs the size of the file and interprets number of pages it will take up
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;

  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    LaptopSaveInfo.iCurrentBalance = 0;

    return;
  }

  // make sure file is more than 0 length
  if (FileGetSize(hFileHandle) == 0) {
    FileClose(hFileHandle);
    guiLastPageInRecordsList = 1;
    return;
  }

  // done with file, close it
  FileClose(hFileHandle);

  guiLastPageInRecordsList = (ReadInLastElementOfFinanceListAndReturnIdNumber() - 1) / NUM_RECORDS_PER_PAGE;

  return;
}

function LoadPreviousPage(): BOOLEAN {
  // clear out old list of records, and load in previous page worth of records
  ClearFinanceList();

  // load previous page
  if ((iCurrentPage == 1) || (iCurrentPage == 0)) {
    iCurrentPage = 0;
    return FALSE;
  }

  // now load in previous page's records, if we can
  if (LoadInRecords(iCurrentPage - 1)) {
    iCurrentPage--;
    return TRUE;
  } else {
    LoadInRecords(iCurrentPage);
    return FALSE;
  }
}

function LoadNextPage(): BOOLEAN {
  // clear out old list of records, and load in previous page worth of records
  ClearFinanceList();

  // now load in previous page's records, if we can
  if (LoadInRecords(iCurrentPage + 1)) {
    iCurrentPage++;
    return TRUE;
  } else {
    LoadInRecords(iCurrentPage);
    return FALSE;
  }
}

function LoadInRecords(uiPage: UINT32): BOOLEAN {
  // loads in records belogning, to page uiPage
  // no file, return
  let fOkToContinue: BOOLEAN = TRUE;
  let iCount: INT32 = 0;
  let hFileHandle: HWFILE;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let iBalanceToDate: INT32;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBytesRead: INT32 = 0;
  let uiByteCount: UINT32 = 0;

  // check if bad page
  if (uiPage == 0) {
    return FALSE;
  }

  if (!(FileExists(FINANCES_DATA_FILE)))
    return FALSE;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return FALSE;
  }

  // make sure file is more than 0 length
  if (FileGetSize(hFileHandle) == 0) {
    FileClose(hFileHandle);
    return FALSE;
  }

  // is the file long enough?
  if ((FileGetSize(hFileHandle) - sizeof(INT32) - 1) / (NUM_RECORDS_PER_PAGE * (sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32))) + 1 < uiPage) {
    // nope
    FileClose(hFileHandle);
    return FALSE;
  }

  FileSeek(hFileHandle, sizeof(INT32) + (uiPage - 1) * NUM_RECORDS_PER_PAGE * (sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32)), FILE_SEEK_FROM_START);

  uiByteCount = sizeof(INT32) + (uiPage - 1) * NUM_RECORDS_PER_PAGE * (sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32));
  // file exists, read in data, continue until end of page
  while ((iCount < NUM_RECORDS_PER_PAGE) && (fOkToContinue) && (uiByteCount < FileGetSize(hFileHandle))) {
    // read in data
    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");

    // add transaction
    ProcessAndEnterAFinacialRecord(ubCode, uiDate, iAmount, ubSecondCode, iBalanceToDate);

    // increment byte counter
    uiByteCount += sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32);

    // we've overextended our welcome, and bypassed end of file, get out
    if (uiByteCount >= FileGetSize(hFileHandle)) {
      // not ok to continue
      fOkToContinue = FALSE;
    }

    iCount++;
  }

  // close file
  FileClose(hFileHandle);

  // check to see if we in fact have a list to display
  if (pFinanceListHead == NULL) {
    // got no records, return false
    return FALSE;
  }

  // set up current finance
  pCurrentFinance = pFinanceListHead;

  return TRUE;
}

function InsertCommasForDollarFigure(pString: STR16): void {
  let sCounter: INT16 = 0;
  let sZeroCount: INT16 = 0;
  let sTempCounter: INT16 = 0;
  let sEndPosition: INT16 = 0;

  // go to end of dollar figure
  while (pString[sCounter] != 0) {
    sCounter++;
  }

  // negative?
  if (pString[0] == '-') {
    // stop one slot in advance of normal
    sEndPosition = 1;
  }

  // is there under $1,000?
  if (sCounter < 4) {
    // can't do anything, return
    return;
  }

  // at end, start backing up until beginning
  while (sCounter > sEndPosition) {
    // enough for a comma?
    if (sZeroCount == 3) {
      // reset count
      sZeroCount = 0;
      // set tempcounter to current counter
      sTempCounter = sCounter;

      // run until end
      while (pString[sTempCounter] != 0) {
        sTempCounter++;
      }
      // now shift everything over ot the right one place until sTempCounter = sCounter
      while (sTempCounter >= sCounter) {
        pString[sTempCounter + 1] = pString[sTempCounter];
        sTempCounter--;
      }
      // now insert comma
      pString[sCounter] = ',';
    }

    // increment count of digits
    sZeroCount++;

    // decrement counter
    sCounter--;
  }

  return;
}

function InsertDollarSignInToString(pString: STR16): void {
  // run to end of string, copy everything in string 2 places right, insert a space at pString[ 1 ] and a L'$' at pString[ 0 ]

  let iCounter: INT32 = 0;

  // run to end of string
  while (pString[iCounter] != 0) {
    iCounter++;
  }

  // now copy over
  while (iCounter >= 0) {
    pString[iCounter + 1] = pString[iCounter];
    iCounter--;
  }

  pString[0] = '$';

  return;
}

function GetPreviousBalanceToDate(): INT32 {
  // will grab balance to date of previous record
  // grabs the size of the file and interprets number of pages it will take up
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iBalanceToDate: INT32 = 0;

  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  if (FileGetSize(hFileHandle) < sizeof(INT32) + sizeof(UINT32) + sizeof(UINT8) + sizeof(UINT8) + sizeof(INT32)) {
    FileClose(hFileHandle);
    return 0;
  }

  FileSeek(hFileHandle, (sizeof(INT32)), FILE_SEEK_FROM_END);

  // get balnce to date
  FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

  FileClose(hFileHandle);

  return iBalanceToDate;
}

function GetPreviousDaysBalance(): INT32 {
  // find out what today is, then go back 2 days, get balance for that day
  let iPreviousDaysBalance: INT32 = 0;
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iDateInMinutes: UINT32 = 0;
  let fOkToContinue: BOOLEAN = FALSE;
  let iByteCount: UINT32 = 0;
  let iCounter: INT32 = 1;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let fGoneTooFar: BOOLEAN = FALSE;
  let iFileSize: INT32 = 0;

  // what day is it?
  iDateInMinutes = GetWorldTotalMin() - (60 * 24);

  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // start at the end, move back until Date / 24 * 60 on the record is =  ( iDateInMinutes /  ( 24 * 60 ) ) - 2
  iByteCount += sizeof(INT32);
  // loop, make sure we don't pass beginning of file, if so, we have an error, and check for condifition above
  while ((iByteCount < FileGetSize(hFileHandle)) && (!fOkToContinue) && (!fGoneTooFar)) {
    FileSeek(hFileHandle, RECORD_SIZE * iCounter, FILE_SEEK_FROM_END);

    // incrment byte count
    iByteCount += RECORD_SIZE;

    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    // check to see if we are far enough
    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 2) {
      fOkToContinue = TRUE;
    }

    if (iDateInMinutes / (24 * 60) >= 2) {
      // there are no entries for the previous day
      if ((uiDate / (24 * 60)) < (iDateInMinutes / (24 * 60)) - 2) {
        fGoneTooFar = TRUE;
      }
    } else {
      fGoneTooFar = TRUE;
    }
    iCounter++;
  }

  if (fOkToContinue == FALSE) {
    // reached beginning of file, nothing found, return 0
    // close file
    FileClose(hFileHandle);
    return 0;
  }

  FileClose(hFileHandle);

  // reached 3 days ago, or beginning of file
  return iBalanceToDate;
}

function GetTodaysBalance(): INT32 {
  // find out what today is, then go back 2 days, get balance for that day
  let iPreviousDaysBalance: INT32 = 0;
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iDateInMinutes: UINT32 = 0;
  let fOkToContinue: BOOLEAN = FALSE;
  let iByteCount: UINT32 = 0;
  let iCounter: INT32 = 1;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let fGoneTooFar: BOOLEAN = FALSE;

  // what day is it?
  iDateInMinutes = GetWorldTotalMin();

  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // start at the end, move back until Date / 24 * 60 on the record is =  ( iDateInMinutes /  ( 24 * 60 ) ) - 2
  iByteCount += sizeof(INT32);

  // loop, make sure we don't pass beginning of file, if so, we have an error, and check for condifition above
  while ((iByteCount < FileGetSize(hFileHandle)) && (!fOkToContinue) && (!fGoneTooFar)) {
    FileSeek(hFileHandle, RECORD_SIZE * iCounter, FILE_SEEK_FROM_END);

    // incrment byte count
    iByteCount += RECORD_SIZE;

    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");
    // check to see if we are far enough
    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 1) {
      fOkToContinue = TRUE;
    }

    iCounter++;
  }

  FileClose(hFileHandle);

  // not found ?
  if (fOkToContinue == FALSE) {
    iBalanceToDate = 0;
  }

  // reached 3 days ago, or beginning of file
  return iBalanceToDate;
}

function GetPreviousDaysIncome(): INT32 {
  // will return the income from the previous day
  // which is todays starting balance - yesterdays starting balance
  let iPreviousDaysBalance: INT32 = 0;
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iDateInMinutes: UINT32 = 0;
  let fOkToContinue: BOOLEAN = FALSE;
  let fOkToIncrement: BOOLEAN = FALSE;
  let iByteCount: UINT32 = 0;
  let iCounter: INT32 = 1;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let fGoneTooFar: BOOLEAN = FALSE;
  let iTotalPreviousIncome: INT32 = 0;

  // what day is it?
  iDateInMinutes = GetWorldTotalMin();

  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // start at the end, move back until Date / 24 * 60 on the record is =  ( iDateInMinutes /  ( 24 * 60 ) ) - 2
  iByteCount += sizeof(INT32);

  // loop, make sure we don't pass beginning of file, if so, we have an error, and check for condifition above
  while ((iByteCount < FileGetSize(hFileHandle)) && (!fOkToContinue) && (!fGoneTooFar)) {
    FileGetPos(hFileHandle);

    FileSeek(hFileHandle, RECORD_SIZE * iCounter, FILE_SEEK_FROM_END);

    // incrment byte count
    iByteCount += RECORD_SIZE;

    FileGetPos(hFileHandle);

    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");
    // check to see if we are far enough
    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 2) {
      fOkToContinue = TRUE;
    }

    // there are no entries for the previous day
    if ((uiDate / (24 * 60)) < (iDateInMinutes / (24 * 60)) - 2) {
      fGoneTooFar = TRUE;
    }

    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 1) {
      // now ok to increment amount
      fOkToIncrement = TRUE;
    }

    if ((fOkToIncrement) && ((ubCode == Enum80.DEPOSIT_FROM_GOLD_MINE) || (ubCode == Enum80.DEPOSIT_FROM_SILVER_MINE))) {
      // increment total
      iTotalPreviousIncome += iAmount;
    }

    iCounter++;
  }

  // now run back one more day and add up the total of deposits

  // close file
  FileClose(hFileHandle);

  return iTotalPreviousIncome;
}

function GetTodaysDaysIncome(): INT32 {
  // will return the income from the previous day
  // which is todays starting balance - yesterdays starting balance
  let iPreviousDaysBalance: INT32 = 0;
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iDateInMinutes: UINT32 = 0;
  let fOkToContinue: BOOLEAN = FALSE;
  let fOkToIncrement: BOOLEAN = FALSE;
  let iByteCount: UINT32 = 0;
  let iCounter: INT32 = 1;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let fGoneTooFar: BOOLEAN = FALSE;
  let iTotalIncome: INT32 = 0;

  // what day is it?
  iDateInMinutes = GetWorldTotalMin();

  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // start at the end, move back until Date / 24 * 60 on the record is =  ( iDateInMinutes /  ( 24 * 60 ) ) - 2
  iByteCount += sizeof(INT32);

  // loop, make sure we don't pass beginning of file, if so, we have an error, and check for condifition above
  while ((iByteCount < FileGetSize(hFileHandle)) && (!fOkToContinue) && (!fGoneTooFar)) {
    FileSeek(hFileHandle, RECORD_SIZE * iCounter, FILE_SEEK_FROM_END);

    // incrment byte count
    iByteCount += RECORD_SIZE;

    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");
    // check to see if we are far enough
    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 1) {
      fOkToContinue = TRUE;
    }

    if ((uiDate / (24 * 60)) > (iDateInMinutes / (24 * 60)) - 1) {
      // now ok to increment amount
      fOkToIncrement = TRUE;
    }

    if ((fOkToIncrement) && ((ubCode == Enum80.DEPOSIT_FROM_GOLD_MINE) || (ubCode == Enum80.DEPOSIT_FROM_SILVER_MINE))) {
      // increment total
      iTotalIncome += iAmount;
      fOkToIncrement = FALSE;
    }

    iCounter++;
  }

  // no entries, return nothing - no income for the day
  if (fGoneTooFar == TRUE) {
    FileClose(hFileHandle);
    return 0;
  }

  // now run back one more day and add up the total of deposits

  // close file
  FileClose(hFileHandle);

  return iTotalIncome;
}

function SetFinanceButtonStates(): void {
  // this function will look at what page we are viewing, enable and disable buttons as needed

  if (iCurrentPage == 0) {
    // first page, disable left buttons
    DisableButton(giFinanceButton[Enum79.PREV_PAGE_BUTTON]);
    DisableButton(giFinanceButton[Enum79.FIRST_PAGE_BUTTON]);
  } else {
    // enable buttons
    EnableButton(giFinanceButton[Enum79.PREV_PAGE_BUTTON]);
    EnableButton(giFinanceButton[Enum79.FIRST_PAGE_BUTTON]);
  }

  if (LoadNextPage()) {
    // decrement page
    LoadPreviousPage();

    // enable buttons
    EnableButton(giFinanceButton[Enum79.NEXT_PAGE_BUTTON]);
    EnableButton(giFinanceButton[Enum79.LAST_PAGE_BUTTON]);
  } else {
    DisableButton(giFinanceButton[Enum79.NEXT_PAGE_BUTTON]);
    DisableButton(giFinanceButton[Enum79.LAST_PAGE_BUTTON]);
  }
}

function GetTodaysOtherDeposits(): INT32 {
  // grab todays other deposits

  let iPreviousDaysBalance: INT32 = 0;
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iDateInMinutes: UINT32 = 0;
  let fOkToContinue: BOOLEAN = FALSE;
  let fOkToIncrement: BOOLEAN = FALSE;
  let iByteCount: UINT32 = 0;
  let iCounter: INT32 = 1;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let fGoneTooFar: BOOLEAN = FALSE;
  let iTotalIncome: INT32 = 0;

  // what day is it?
  iDateInMinutes = GetWorldTotalMin();

  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // start at the end, move back until Date / 24 * 60 on the record is =  ( iDateInMinutes /  ( 24 * 60 ) ) - 2
  iByteCount += sizeof(INT32);

  // loop, make sure we don't pass beginning of file, if so, we have an error, and check for condifition above
  while ((iByteCount < FileGetSize(hFileHandle)) && (!fOkToContinue) && (!fGoneTooFar)) {
    FileSeek(hFileHandle, RECORD_SIZE * iCounter, FILE_SEEK_FROM_END);

    // incrment byte count
    iByteCount += RECORD_SIZE;

    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");
    // check to see if we are far enough
    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 1) {
      fOkToContinue = TRUE;
    }

    if ((uiDate / (24 * 60)) > (iDateInMinutes / (24 * 60)) - 1) {
      // now ok to increment amount
      fOkToIncrement = TRUE;
    }

    if ((fOkToIncrement) && ((ubCode != Enum80.DEPOSIT_FROM_GOLD_MINE) && (ubCode != Enum80.DEPOSIT_FROM_SILVER_MINE))) {
      if (iAmount > 0) {
        // increment total
        iTotalIncome += iAmount;
        fOkToIncrement = FALSE;
      }
    }

    iCounter++;
  }

  // no entries, return nothing - no income for the day
  if (fGoneTooFar == TRUE) {
    FileClose(hFileHandle);
    return 0;
  }

  // now run back one more day and add up the total of deposits

  // close file
  FileClose(hFileHandle);

  return iTotalIncome;
}

function GetYesterdaysOtherDeposits(): INT32 {
  let iPreviousDaysBalance: INT32 = 0;
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;
  let iDateInMinutes: UINT32 = 0;
  let fOkToContinue: BOOLEAN = FALSE;
  let fOkToIncrement: BOOLEAN = FALSE;
  let iByteCount: UINT32 = 0;
  let iCounter: INT32 = 1;
  let ubCode: UINT8;
  let ubSecondCode: UINT8;
  let uiDate: UINT32;
  let iAmount: INT32;
  let iBalanceToDate: INT32;
  let fGoneTooFar: BOOLEAN = FALSE;
  let iTotalPreviousIncome: INT32 = 0;

  // what day is it?
  iDateInMinutes = GetWorldTotalMin();

  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE)))
    return 0;

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    // close file
    FileClose(hFileHandle);

    return 0;
  }

  // start at the end, move back until Date / 24 * 60 on the record is =  ( iDateInMinutes /  ( 24 * 60 ) ) - 2
  iByteCount += sizeof(INT32);

  // loop, make sure we don't pass beginning of file, if so, we have an error, and check for condifition above
  while ((iByteCount < FileGetSize(hFileHandle)) && (!fOkToContinue) && (!fGoneTooFar)) {
    FileSeek(hFileHandle, RECORD_SIZE * iCounter, FILE_SEEK_FROM_END);

    // incrment byte count
    iByteCount += RECORD_SIZE;

    FileRead(hFileHandle, addressof(ubCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(ubSecondCode), sizeof(UINT8), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(uiDate), sizeof(UINT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iAmount), sizeof(INT32), addressof(iBytesRead));
    FileRead(hFileHandle, addressof(iBalanceToDate), sizeof(INT32), addressof(iBytesRead));

    AssertMsg(iBytesRead, "Failed To Read Data Entry");
    // check to see if we are far enough
    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 2) {
      fOkToContinue = TRUE;
    }

    // there are no entries for the previous day
    if ((uiDate / (24 * 60)) < (iDateInMinutes / (24 * 60)) - 2) {
      fGoneTooFar = TRUE;
    }

    if ((uiDate / (24 * 60)) == (iDateInMinutes / (24 * 60)) - 1) {
      // now ok to increment amount
      fOkToIncrement = TRUE;
    }

    if ((fOkToIncrement) && ((ubCode != Enum80.DEPOSIT_FROM_GOLD_MINE) && (ubCode != Enum80.DEPOSIT_FROM_SILVER_MINE))) {
      if (iAmount > 0) {
        // increment total
        iTotalPreviousIncome += iAmount;
      }
    }

    iCounter++;
  }

  // close file
  FileClose(hFileHandle);

  return iTotalPreviousIncome;
}

function GetTodaysDebits(): INT32 {
  // return the expenses for today

  // currentbalance - todays balance - Todays income - other deposits

  return GetCurrentBalance() - GetTodaysBalance() - GetTodaysDaysIncome() - GetTodaysOtherDeposits();
}

function GetYesterdaysDebits(): INT32 {
  // return the expenses for yesterday

  return GetTodaysBalance() - GetPreviousDaysBalance() - GetPreviousDaysIncome() - GetYesterdaysOtherDeposits();
}

function LoadCurrentBalance(): void {
  // will load the current balance from finances.dat file
  let hFileHandle: HWFILE;
  let iBytesRead: INT32 = 0;

  // is the first record in the file
  // error checking
  // no file, return
  if (!(FileExists(FINANCES_DATA_FILE))) {
    LaptopSaveInfo.iCurrentBalance = 0;
    return;
  }

  // open file
  hFileHandle = FileOpen(FINANCES_DATA_FILE, (FILE_OPEN_EXISTING | FILE_ACCESS_READ), FALSE);

  // failed to get file, return
  if (!hFileHandle) {
    LaptopSaveInfo.iCurrentBalance = 0;

    // close file
    FileClose(hFileHandle);

    return;
  }

  FileSeek(hFileHandle, 0, FILE_SEEK_FROM_START);
  FileRead(hFileHandle, addressof(LaptopSaveInfo.iCurrentBalance), sizeof(INT32), addressof(iBytesRead));

  AssertMsg(iBytesRead, "Failed To Read Data Entry");
  // close file
  FileClose(hFileHandle);

  return;
}
