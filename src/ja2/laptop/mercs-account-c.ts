const MERC_ACCOUNT_TEXT_FONT = () => FONT14ARIAL();
const MERC_ACCOUNT_TEXT_COLOR = FONT_MCOLOR_WHITE;

const MERC_ACCOUNT_DYNAMIC_TEXT_FONT = () => FONT12ARIAL();
const MERC_ACCOUNT_DYNAMIC_TEXT_COLOR = FONT_MCOLOR_WHITE;
const MERC_ACCOUNT_DEAD_TEXT_COLOR = FONT_MCOLOR_RED;

const MERC_AC_ORDER_GRID_X = LAPTOP_SCREEN_UL_X + 23;
const MERC_AC_ORDER_GRID_Y = LAPTOP_SCREEN_WEB_UL_Y + 59;

const MERC_AC_ACCOUNT_NUMBER_X = LAPTOP_SCREEN_UL_X + 23;
const MERC_AC_ACCOUNT_NUMBER_Y = LAPTOP_SCREEN_WEB_UL_Y + 13;

const MERC_AC_AUTHORIZE_BUTTON_X = 128;
const MERC_AC_AUTHORIZE_BUTTON_Y = 380;

const MERC_AC_CANCEL_BUTTON_X = 490;
const MERC_AC_CANCEL_BUTTON_Y = MERC_AC_AUTHORIZE_BUTTON_Y;

const MERC_AC_ACCOUNT_NUMBER_TEXT_X = MERC_AC_ACCOUNT_NUMBER_X + 5;
const MERC_AC_ACCOUNT_NUMBER_TEXT_Y = MERC_AC_ACCOUNT_NUMBER_Y + 12;

const MERC_AC_MERC_TITLE_Y = MERC_AC_ORDER_GRID_Y + 14;
const MERC_AC_TOTAL_COST_Y = MERC_AC_ORDER_GRID_Y + 242;

const MERC_AC_FIRST_COLUMN_X = MERC_AC_ORDER_GRID_X + 2;
const MERC_AC_SECOND_COLUMN_X = MERC_AC_ORDER_GRID_X + 222;
const MERC_AC_THIRD_COLUMN_X = MERC_AC_ORDER_GRID_X + 292;
const MERC_AC_FOURTH_COLUMN_X = MERC_AC_ORDER_GRID_X + 382;

const MERC_AC_FIRST_COLUMN_WIDTH = 218;
const MERC_AC_SECOND_COLUMN_WIDTH = 68;
const MERC_AC_THIRD_COLUMN_WIDTH = 88;
const MERC_AC_FOURTH_COLUMN_WIDTH = 76;

const MERC_AC_FIRST_ROW_Y = MERC_AC_ORDER_GRID_Y + 42;
const MERC_AC_ROW_SIZE = 16;

let guiMercOrderGrid: UINT32;
let guiAccountNumberGrid: UINT32;

let giMercTotalContractCharge: INT32;

let gfMercPlayerDoesntHaveEnoughMoney_DisplayWarning: boolean = false;

let guiMercAuthorizeBoxButton: UINT32;
let guiMercAuthorizeButtonImage: INT32;

let guiMercBackBoxButton: UINT32;

function GameInitMercsAccount(): void {
}

function EnterMercsAccount(): boolean {
  let VObjectDesc: VOBJECT_DESC;

  InitMercBackGround();

  // load the Arrow graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_ORDERGRID);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiMercOrderGrid)));

  // load the Arrow graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\AccountNumber.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiAccountNumberGrid)));

  guiMercAuthorizeButtonImage = LoadButtonImage("LAPTOP\\BigButtons.sti", -1, 0, -1, 1, -1);

  guiMercAuthorizeBoxButton = CreateIconAndTextButton(guiMercAuthorizeButtonImage, MercAccountText[Enum340.MERC_ACCOUNT_AUTHORIZE], FONT12ARIAL(), MERC_BUTTON_UP_COLOR, DEFAULT_SHADOW, MERC_BUTTON_DOWN_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, MERC_AC_AUTHORIZE_BUTTON_X, MERC_AC_AUTHORIZE_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnMercAuthorizeButtonCallback);
  SetButtonCursor(guiMercAuthorizeBoxButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiMercAuthorizeBoxButton, Enum29.DISABLED_STYLE_SHADED);

  guiMercBackBoxButton = CreateIconAndTextButton(guiMercAuthorizeButtonImage, MercAccountText[Enum340.MERC_ACCOUNT_HOME], FONT12ARIAL(), MERC_BUTTON_UP_COLOR, DEFAULT_SHADOW, MERC_BUTTON_DOWN_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, MERC_AC_CANCEL_BUTTON_X, MERC_AC_CANCEL_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnMercBackButtonCallback);
  SetButtonCursor(guiMercBackBoxButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiMercBackBoxButton, Enum29.DISABLED_STYLE_SHADED);

  //	RenderMercsAccount();

  // if true, will display a msgbox telling user that they dont have enough funds
  gfMercPlayerDoesntHaveEnoughMoney_DisplayWarning = false;

  return true;
}

function ExitMercsAccount(): void {
  DeleteVideoObjectFromIndex(guiMercOrderGrid);
  DeleteVideoObjectFromIndex(guiAccountNumberGrid);

  UnloadButtonImage(guiMercAuthorizeButtonImage);
  RemoveButton(guiMercAuthorizeBoxButton);
  RemoveButton(guiMercBackBoxButton);

  RemoveMercBackGround();
}

function HandleMercsAccount(): void {
  // if true, will display a msgbox telling user that they dont have enough funds
  if (gfMercPlayerDoesntHaveEnoughMoney_DisplayWarning) {
    gfMercPlayerDoesntHaveEnoughMoney_DisplayWarning = false;

    DoLapTopMessageBox(Enum24.MSG_BOX_BLUE_ON_GREY, "Transfer failed.  No funds available.", Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
  }
}

function RenderMercsAccount(): void {
  let sText: wchar_t[] /* [100] */;
  let hPixHandle: HVOBJECT;

  DrawMecBackGround();

  // Account Number Grid
  GetVideoObject(addressof(hPixHandle), guiMercOrderGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_AC_ORDER_GRID_X, MERC_AC_ORDER_GRID_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Merc Order Grid
  GetVideoObject(addressof(hPixHandle), guiAccountNumberGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_AC_ACCOUNT_NUMBER_X, MERC_AC_ACCOUNT_NUMBER_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Display Players account number
  swprintf(sText, "%s %05d", MercAccountText[Enum340.MERC_ACCOUNT_ACCOUNT], LaptopSaveInfo.guiPlayersMercAccountNumber);
  DrawTextToScreen(sText, MERC_AC_ACCOUNT_NUMBER_TEXT_X, MERC_AC_ACCOUNT_NUMBER_TEXT_Y, 0, MERC_ACCOUNT_TEXT_FONT(), MERC_ACCOUNT_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Display the order grid titles
  DrawTextToScreen(MercAccountText[Enum340.MERC_ACCOUNT_MERC], MERC_AC_FIRST_COLUMN_X, MERC_AC_MERC_TITLE_Y, MERC_AC_FIRST_COLUMN_WIDTH, MERC_ACCOUNT_TEXT_FONT(), MERC_ACCOUNT_TEXT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DrawTextToScreen(MercAccountText[Enum340.MERC_ACCOUNT_DAYS], MERC_AC_SECOND_COLUMN_X, MERC_AC_MERC_TITLE_Y, MERC_AC_SECOND_COLUMN_WIDTH, MERC_ACCOUNT_TEXT_FONT(), MERC_ACCOUNT_TEXT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DrawTextToScreen(MercAccountText[Enum340.MERC_ACCOUNT_RATE], MERC_AC_THIRD_COLUMN_X, MERC_AC_MERC_TITLE_Y, MERC_AC_THIRD_COLUMN_WIDTH, MERC_ACCOUNT_TEXT_FONT(), MERC_ACCOUNT_TEXT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DrawTextToScreen(MercAccountText[Enum340.MERC_ACCOUNT_CHARGE], MERC_AC_FOURTH_COLUMN_X, MERC_AC_MERC_TITLE_Y, MERC_AC_FOURTH_COLUMN_WIDTH, MERC_ACCOUNT_TEXT_FONT(), MERC_ACCOUNT_TEXT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DrawTextToScreen(MercAccountText[Enum340.MERC_ACCOUNT_TOTAL], MERC_AC_THIRD_COLUMN_X, MERC_AC_TOTAL_COST_Y, MERC_AC_THIRD_COLUMN_WIDTH, MERC_ACCOUNT_TEXT_FONT(), MERC_ACCOUNT_TEXT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  DisplayHiredMercs();

  // giMercTotalContractCharge  gets set with the price in DisplayHiredMercs(), so if there is currently no charge, disable the button
  if (giMercTotalContractCharge == 0) {
    DisableButton(guiMercAuthorizeBoxButton);
  }

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnMercAuthorizeButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let wzAuthorizeString: CHAR16[] /* [512] */;
      let wzDollarAmount: CHAR16[] /* [128] */;

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      swprintf(wzDollarAmount, "%d", giMercTotalContractCharge);

      InsertCommasForDollarFigure(wzDollarAmount);
      InsertDollarSignInToString(wzDollarAmount);

      // create the string to show to the user
      swprintf(wzAuthorizeString, MercAccountText[Enum340.MERC_ACCOUNT_AUTHORIZE_CONFIRMATION], wzDollarAmount);

      DoLapTopMessageBox(Enum24.MSG_BOX_BLUE_ON_GREY, wzAuthorizeString, Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_YESNO, MercAuthorizePaymentMessageBoxCallBack);

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnMercBackButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
      gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_ACCOUNTS_PAGE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayHiredMercs(): void {
  let usPosY: UINT16;
  let uiContractCharge: UINT32;
  let sTemp: wchar_t[] /* [20] */;
  let i: UINT8;
  let usMercID: UINT8;
  let ubFontColor: UINT8;

  giMercTotalContractCharge = 0;

  usPosY = MERC_AC_FIRST_ROW_Y + 3;
  for (i = 0; i <= 10; i++) {
    // if it larry Roach burn advance.  ( cause larry is in twice, a sober larry and a stoned larry )
    if (i == MERC_LARRY_ROACHBURN)
      continue;

    usMercID = GetMercIDFromMERCArray(i);

    // is the merc on the team, or is owed money
    if (IsMercOnTeam(usMercID) || gMercProfiles[usMercID].iMercMercContractLength != 0) {
      // if the merc is dead, make the color red, else white
      if (IsMercDead(usMercID))
        ubFontColor = MERC_ACCOUNT_DEAD_TEXT_COLOR;
      else
        ubFontColor = MERC_ACCOUNT_DYNAMIC_TEXT_COLOR;

      uiContractCharge = 0;

      // Display Mercs Name
      DrawTextToScreen(gMercProfiles[usMercID].zName, MERC_AC_FIRST_COLUMN_X + 5, usPosY, MERC_AC_FIRST_COLUMN_WIDTH, MERC_ACCOUNT_DYNAMIC_TEXT_FONT(), ubFontColor, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

      // Display The # of days the merc has worked since last paid

      swprintf(sTemp, "%d", gMercProfiles[usMercID].iMercMercContractLength);
      DrawTextToScreen(sTemp, MERC_AC_SECOND_COLUMN_X, usPosY, MERC_AC_SECOND_COLUMN_WIDTH, MERC_ACCOUNT_DYNAMIC_TEXT_FONT(), ubFontColor, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

      // Display the mercs rate
      swprintf(sTemp, "$%6d", gMercProfiles[usMercID].sSalary);
      DrawTextToScreen(sTemp, MERC_AC_THIRD_COLUMN_X, usPosY, MERC_AC_THIRD_COLUMN_WIDTH, MERC_ACCOUNT_DYNAMIC_TEXT_FONT(), ubFontColor, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

      // Display the total charge
      uiContractCharge = gMercProfiles[usMercID].sSalary * gMercProfiles[usMercID].iMercMercContractLength;
      swprintf(sTemp, "$%6d", uiContractCharge);
      DrawTextToScreen(sTemp, MERC_AC_FOURTH_COLUMN_X, usPosY, MERC_AC_FOURTH_COLUMN_WIDTH, MERC_ACCOUNT_DYNAMIC_TEXT_FONT(), ubFontColor, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

      giMercTotalContractCharge += uiContractCharge;
      usPosY += MERC_AC_ROW_SIZE;
    }
  }

  swprintf(sTemp, "$%6d", giMercTotalContractCharge);
  DrawTextToScreen(sTemp, MERC_AC_FOURTH_COLUMN_X, MERC_AC_TOTAL_COST_Y, MERC_AC_FOURTH_COLUMN_WIDTH, MERC_ACCOUNT_DYNAMIC_TEXT_FONT(), MERC_ACCOUNT_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
}

function SettleMercAccounts(): void {
  //	SOLDIERTYPE *pSoldier;
  let i: INT16;
  let ubMercID: UINT8;
  let iPartialPayment: INT32 = 0;
  let iContractCharge: INT32 = 0;

  // loop through all the MERC mercs the player has on the team
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    ubMercID = GetMercIDFromMERCArray(i);

    // if the merc is on the team, or does the player owe money for a fired merc
    if (IsMercOnTeam(ubMercID) || (gMercProfiles[ubMercID].iMercMercContractLength != 0)) {
      // Calc the contract charge
      iContractCharge = gMercProfiles[ubMercID].sSalary * gMercProfiles[ubMercID].iMercMercContractLength;

      // if the player can afford to pay this merc
      if (LaptopSaveInfo.iCurrentBalance >= iPartialPayment + iContractCharge) {
        // Increment the counter that keeps track of the of the number of days the player has paid for merc services
        LaptopSaveInfo.guiNumberOfMercPaymentsInDays += gMercProfiles[ubMercID].iMercMercContractLength;

        // Then reset the merc contract counter
        gMercProfiles[ubMercID].iMercMercContractLength = 0;

        // Add this mercs contract charge to the total
        iPartialPayment += iContractCharge;

        gMercProfiles[ubMercID].uiTotalCostToDate += iContractCharge;
      }
    }
  }

  if (iPartialPayment == 0) {
    // if true, will display a msgbox telling user that they dont have enough funds
    gfMercPlayerDoesntHaveEnoughMoney_DisplayWarning = true;
    return;
  }

  // add the transaction to the finance page
  AddTransactionToPlayersBook(Enum80.PAY_SPECK_FOR_MERC, GetMercIDFromMERCArray(gubCurMercIndex), GetWorldTotalMin(), -iPartialPayment);
  AddHistoryToPlayersLog(Enum83.HISTORY_SETTLED_ACCOUNTS_AT_MERC, GetMercIDFromMERCArray(gubCurMercIndex), GetWorldTotalMin(), -1, -1);

  // Increment the amount of money paid to speck
  LaptopSaveInfo.uiTotalMoneyPaidToSpeck += iPartialPayment;

  // If the player only made a partial payment
  if (iPartialPayment != giMercTotalContractCharge)
    gusMercVideoSpeckSpeech = Enum111.SPECK_QUOTE_PLAYER_MAKES_PARTIAL_PAYMENT;
  else {
    gusMercVideoSpeckSpeech = Enum111.SPECK_QUOTE_PLAYER_MAKES_FULL_PAYMENT;

    // if the merc's account was in suspense, re-enable it
    // CJC Dec 1 2002: an invalid account become valid again.
    // if( LaptopSaveInfo.gubPlayersMercAccountStatus != MERC_ACCOUNT_INVALID )
    LaptopSaveInfo.gubPlayersMercAccountStatus = Enum104.MERC_ACCOUNT_VALID;

    // Since the player has paid, make sure speck wont complain about the lack of payment
    LaptopSaveInfo.uiSpeckQuoteFlags &= ~SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT;
  }

  // Go to the merc homepage to say the quote
  guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
  gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_ACCOUNTS_PAGE;

  /*

          //if the player doesnt have enough money to fully pay for the all the mercs contract
          if( LaptopSaveInfo.iCurrentBalance < giMercTotalContractCharge )
          {
                  INT32	iPartialPayment=0;
                  INT32	iContractCharge=0;
                  SOLDIERTYPE *pSoldier;

                  //try to make a partial payment by looping through all the mercs and settling them 1 at a time
                  for(i=0; i<NUMBER_OF_MERCS; i++)
                  {
                          ubMercID = GetMercIDFromMERCArray( (UINT8) i );

                          //if the merc is on the team
                          if( IsMercOnTeam( ubMercID ) )
                          {

                                  pSoldier = FindSoldierByProfileID( ubMercID, TRUE );

                                  //if we can get the soldier pointer
                                  if( pSoldier == NULL )
                                          continue;

                                  //Calc the contract charge
                                  iContractCharge = gMercProfiles[ ubMercID ].sSalary * pSoldier->iTotalContractLength;

                                  //if the player can afford to pay this merc
                                  if( LaptopSaveInfo.iCurrentBalance > iContractCharge )
                                  {
                                          sSoldierID = GetSoldierIDFromMercID( ubMercID );
                                          pSoldier = MercPtrs[ sSoldierID ];

                                          LaptopSaveInfo.guiNumberOfMercPaymentsInDays += pSoldier->iTotalContractLength;

                                          pSoldier->iTotalContractLength = 0;

                                          iPartialPayment += iContractCharge;
                                  }
                          }
                  }

                  if( iPartialPayment != 0 )
                  {
                          // add the transaction to the finance page
                          AddTransactionToPlayersBook( PAY_SPECK_FOR_MERC, GetMercIDFromMERCArray( gubCurMercIndex ), GetWorldTotalMin(), -iPartialPayment );
                          AddHistoryToPlayersLog( HISTORY_SETTLED_ACCOUNTS_AT_MERC, GetMercIDFromMERCArray( gubCurMercIndex ), GetWorldTotalMin(), -1, -1 );
                  }


  //		DoLapTopMessageBox( MSG_BOX_BLUE_ON_GREY, MercAccountText[MERC_ACCOUNT_NOT_ENOUGH_MONEY], LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL);
                  //return to the main page and have speck say quote
                  guiCurrentLaptopMode = LAPTOP_MODE_MERC;
                  gubArrivedFromMercSubSite = MERC_CAME_FROM_ACCOUNTS_PAGE;

                  gusMercVideoSpeckSpeech = SPECK_QUOTE_PLAYER_MAKES_PARTIAL_PAYMENT;

                  return;
          }

          // add the transaction to the finance page
          AddTransactionToPlayersBook( PAY_SPECK_FOR_MERC, GetMercIDFromMERCArray( gubCurMercIndex ), GetWorldTotalMin(), -giMercTotalContractCharge);
          AddHistoryToPlayersLog( HISTORY_SETTLED_ACCOUNTS_AT_MERC, GetMercIDFromMERCArray( gubCurMercIndex ), GetWorldTotalMin(), -1, -1 );

          //reset all the mercs time
          for(i=0; i<NUMBER_OF_MERCS; i++)
          {
                  ubMercID = GetMercIDFromMERCArray( (UINT8) i );

                  if( IsMercOnTeam( ubMercID ) )
                  {
                          sSoldierID = GetSoldierIDFromMercID( ubMercID );
                          pSoldier = MercPtrs[ sSoldierID ];

                          LaptopSaveInfo.guiNumberOfMercPaymentsInDays += pSoldier->iTotalContractLength;

                          pSoldier->iTotalContractLength = 0;
                  }
          }

          //if the merc's account was in suspense, re-enable it
          if( LaptopSaveInfo.gubPlayersMercAccountStatus != MERC_ACCOUNT_INVALID )
                  LaptopSaveInfo.gubPlayersMercAccountStatus = MERC_ACCOUNT_VALID;


          //Go to the merc homepage to say the quote
          guiCurrentLaptopMode = LAPTOP_MODE_MERC;
          gubArrivedFromMercSubSite = MERC_CAME_FROM_ACCOUNTS_PAGE;
          gusMercVideoSpeckSpeech = SPECK_QUOTE_PLAYER_MAKES_FULL_PAYMENT;
  */
}

function MercAuthorizePaymentMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, clear the form
  if (bExitValue == MSG_BOX_RETURN_YES) {
    // if the player owes Speck money, then settle the accounts
    if (giMercTotalContractCharge)
      SettleMercAccounts();
  }
}

function CalculateHowMuchPlayerOwesSpeck(): UINT32 {
  let i: UINT8 = 0;
  let uiContractCharge: UINT32 = 0;
  let usMercID: UINT16;

  for (i = 0; i < 10; i++) {
    // if it larry Roach burn advance.  ( cause larry is in twice, a sober larry and a stoned larry )
    if (i == MERC_LARRY_ROACHBURN)
      continue;

    usMercID = GetMercIDFromMERCArray(i);
    // if( IsMercOnTeam( (UINT8)usMercID ) )
    {
      // Calc salary for the # of days the merc has worked since last paid
      uiContractCharge += gMercProfiles[usMercID].sSalary * gMercProfiles[usMercID].iMercMercContractLength;
    }
  }

  return uiContractCharge;
}
