let gfUseSingleCharWordsForWordWrap: BOOLEAN = FALSE;

function UseSingleCharWordsForWordWrap(fUseSingleCharWords: BOOLEAN): void {
  gfUseSingleCharWordsForWordWrap = fUseSingleCharWords;
}

function LineWrapForSingleCharWords(ulFont: UINT32, usLineWidthPixels: UINT16, pusLineWidthIfWordIsWiderThenWidth: Pointer<UINT16>, pString: STR16, ...args: any[]): Pointer<WRAPPED_STRING> {
  let FirstWrappedString: WRAPPED_STRING;
  let pWrappedString: Pointer<WRAPPED_STRING> = NULL;
  let TempString: wchar_t[] /* [1024] */;
  //	wchar_t         pNullString[2];
  let usCurIndex: INT16;
  let usEndIndex: INT16;
  let usDestIndex: INT16;
  let DestString: wchar_t[] /* [1024] */;
  let argptr: va_list;
  let fDone: BOOLEAN = FALSE;
  let usCurrentWidthPixels: UINT16 = 0;
  //	UINT16					usCurrentLineWidthPixels=0;
  let OneChar: wchar_t[] /* [2] */;
  let fNewLine: BOOLEAN = FALSE;
  //	BOOLEAN					fTheStringIsToLong=FALSE;
  //	INT32 iCounter=0;
  //	INT32 iErrorCount = 0;
  //  pNullString[0]=L' ';
  //	pNullString[1]=0;

  memset(&FirstWrappedString, 0, sizeof(WRAPPED_STRING));

  *pusLineWidthIfWordIsWiderThenWidth = usLineWidthPixels;

  if (pString == NULL)
    return FALSE;

  va_start(argptr, pString); // Set up variable argument pointer
  vswprintf(TempString, pString, argptr); // process string (get output str)
  va_end(argptr);

  usCurIndex = usEndIndex = usDestIndex = 0;
  OneChar[1] = '\0';

  while (!fDone) {
    fNewLine = FALSE;

    DestString[usDestIndex] = TempString[usCurIndex];

    // If the new char is a newline character
    if (DestString[usDestIndex] == NEWLINE_CHAR) {
      DestString[usDestIndex] = TempString[usCurIndex] = 0;
      fNewLine = TRUE;
    }

    // Get the next char
    OneChar[0] = TempString[usCurIndex];

    usCurrentWidthPixels += WFStringPixLength(OneChar, ulFont);

    // If we are at the end of the string
    if (TempString[usCurIndex] == 0) {
      // get to next WrappedString structure
      pWrappedString = &FirstWrappedString;
      while (pWrappedString->pNextWrappedString != NULL)
        pWrappedString = pWrappedString->pNextWrappedString;

      // allocate memory for the string
      pWrappedString->pNextWrappedString = MemAlloc(sizeof(WRAPPED_STRING));
      pWrappedString->pNextWrappedString->sString = MemAlloc((wcslen(DestString) + 2) * 2);
      if (pWrappedString->pNextWrappedString->sString == NULL)
        return NULL;

      wcscpy(pWrappedString->pNextWrappedString->sString, DestString);
      pWrappedString->pNextWrappedString->pNextWrappedString = NULL;

      return FirstWrappedString.pNextWrappedString;
    }

    // if we are at the end of the line
    if (usCurrentWidthPixels >= usLineWidthPixels) {
      fNewLine = TRUE;
    }

    if (fNewLine) {
      // End the current line
      DestString[usDestIndex + 1] = '\0';

      // get to next WrappedString structure
      pWrappedString = &FirstWrappedString;
      while (pWrappedString->pNextWrappedString != NULL)
        pWrappedString = pWrappedString->pNextWrappedString;

      // allocate memory for the string
      pWrappedString->pNextWrappedString = MemAlloc(sizeof(WRAPPED_STRING));
      pWrappedString->pNextWrappedString->sString = MemAlloc((wcslen(DestString) + 2) * 2);

      // Copy the string into the new struct
      wcscpy(pWrappedString->pNextWrappedString->sString, DestString);
      pWrappedString->pNextWrappedString->pNextWrappedString = NULL;

      fNewLine = FALSE;

      usCurrentWidthPixels = 0;
      usDestIndex = 0;
      usCurIndex++;
      usEndIndex = usCurIndex;
      continue;
    }

    usCurIndex++;
    usDestIndex++;
  }

  return FirstWrappedString.pNextWrappedString;
}

function LineWrap(ulFont: UINT32, usLineWidthPixels: UINT16, pusLineWidthIfWordIsWiderThenWidth: Pointer<UINT16>, pString: STR16, ...args: any[]): Pointer<WRAPPED_STRING> {
  let FirstWrappedString: WRAPPED_STRING;
  let pWrappedString: Pointer<WRAPPED_STRING> = NULL;
  let TempString: wchar_t[] /* [1024] */;
  let pNullString: wchar_t[] /* [2] */;
  let usCurIndex: INT16;
  let usEndIndex: INT16;
  let usDestIndex: INT16;
  let pCurrentStringLoc: STR16;
  let DestString: wchar_t[] /* [1024] */;
  let argptr: va_list;
  let fDone: BOOLEAN = FALSE;
  let usCurrentWidthPixels: UINT16 = 0;
  let usCurrentLineWidthPixels: UINT16 = 0;
  let OneChar: wchar_t[] /* [2] */;
  let fNewLine: BOOLEAN = FALSE;
  let fTheStringIsToLong: BOOLEAN = FALSE;
  let iCounter: INT32 = 0;
  let iErrorCount: INT32 = 0;
  pNullString[0] = ' ';
  pNullString[1] = 0;

  memset(&FirstWrappedString, 0, sizeof(WRAPPED_STRING));

  *pusLineWidthIfWordIsWiderThenWidth = usLineWidthPixels;

  if (pString == NULL)
    return FALSE;

  va_start(argptr, pString); // Set up variable argument pointer
  vswprintf(TempString, pString, argptr); // process string (get output str)
  va_end(argptr);

  usCurIndex = usEndIndex = usDestIndex = 0;
  OneChar[1] = '\0';

  while (!fDone) {
    // Kris:
    // This is TEMPORARY!!!  Dave, I've added this to get out of the infinite loop by slowing increasing the
    // line width!
    iErrorCount++;
    if (iErrorCount > 300) {
      iErrorCount = 0;
      usLineWidthPixels++;
    }

    fNewLine = FALSE;

    DestString[usDestIndex] = TempString[usCurIndex];
    if (DestString[usDestIndex] == NEWLINE_CHAR) {
      DestString[usDestIndex] = TempString[usCurIndex] = 0;
      fNewLine = TRUE;
    }
    OneChar[0] = TempString[usCurIndex];

    usCurrentWidthPixels += WFStringPixLength(OneChar, ulFont);

    // If we are at the end of the string
    if (TempString[usCurIndex] == 0) {
      // get to next WrappedString structure
      pWrappedString = &FirstWrappedString;
      while (pWrappedString->pNextWrappedString != NULL)
        pWrappedString = pWrappedString->pNextWrappedString;

      // allocate memory for the string
      pWrappedString->pNextWrappedString = MemAlloc(sizeof(WRAPPED_STRING));
      pWrappedString->pNextWrappedString->sString = MemAlloc((wcslen(DestString) + 2) * 2);
      if (pWrappedString->pNextWrappedString->sString == NULL)
        return NULL;

      wcscpy(pWrappedString->pNextWrappedString->sString, DestString);
      pWrappedString->pNextWrappedString->pNextWrappedString = NULL;

      return FirstWrappedString.pNextWrappedString;
    }

    if ((usCurrentWidthPixels > usLineWidthPixels)) //||(DestString[ usDestIndex ]==NEWLINE_CHAR )||(fNewLine))
    {
      // if an error has occured, and the string is too long
      if (fTheStringIsToLong)
        DestString[usDestIndex] = ' ';

      // Go back to begining of word
      while ((DestString[usDestIndex] != ' ') && (usCurIndex > 0)) {
        OneChar[0] = DestString[usDestIndex];

        usCurrentWidthPixels -= WFStringPixLength(OneChar, ulFont);

        usCurIndex--;
        usDestIndex--;
      }
      usEndIndex = usDestIndex;

      if (usEndIndex < 0)
        usEndIndex = 0;

      // put next line into temp buffer
      DestString[usEndIndex] = 0;

      // get to next WrappedString structure
      pWrappedString = &FirstWrappedString;
      while (pWrappedString->pNextWrappedString != NULL)
        pWrappedString = pWrappedString->pNextWrappedString;

      if (wcslen(DestString) != 0) {
        // allocate memory for the string
        pWrappedString->pNextWrappedString = MemAlloc(sizeof(WRAPPED_STRING));
        pWrappedString->pNextWrappedString->sString = MemAlloc((wcslen(DestString) + 2) * 2);
        if (pWrappedString->pNextWrappedString->sString == NULL)
          return NULL;

        wcscpy(pWrappedString->pNextWrappedString->sString, DestString);
        pWrappedString->pNextWrappedString->pNextWrappedString = NULL;

        usCurrentWidthPixels = 0;
        usDestIndex = 0;
        usCurIndex++;
        usEndIndex = usCurIndex;

        pCurrentStringLoc = &TempString[usEndIndex];
        // if last line, put line into string structure
        if (WFStringPixLength(pCurrentStringLoc, ulFont) < usLineWidthPixels) {
          // run until end of DestString
          wcscpy(DestString, pCurrentStringLoc);
          iCounter = 0;
          while (DestString[iCounter] != 0) {
            if (DestString[iCounter] == NEWLINE_CHAR) {
              DestString[iCounter] = 0;
              fNewLine = TRUE;
              break;
            }
            iCounter++;
          }

          // get to next WrappedString structure
          pWrappedString = &FirstWrappedString;
          while (pWrappedString->pNextWrappedString != NULL)
            pWrappedString = pWrappedString->pNextWrappedString;

          // allocate memory for the string
          pWrappedString->pNextWrappedString = MemAlloc(sizeof(WRAPPED_STRING));
          pWrappedString->pNextWrappedString->sString = MemAlloc((wcslen(DestString) + 2) * 2);
          if (pWrappedString->pNextWrappedString->sString == NULL)
            return NULL;

          wcscpy(pWrappedString->pNextWrappedString->sString, DestString);
          pWrappedString->pNextWrappedString->pNextWrappedString = NULL;
          if (fNewLine) {
            pWrappedString = &FirstWrappedString;
            while (pWrappedString->pNextWrappedString != NULL)
              pWrappedString = pWrappedString->pNextWrappedString;

            // allocate memory for the string
            pWrappedString->pNextWrappedString = MemAlloc(sizeof(WRAPPED_STRING));
            pWrappedString->pNextWrappedString->sString = MemAlloc((wcslen(pNullString) + 2) * 2);
            wcscpy(pWrappedString->pNextWrappedString->sString, pNullString);
            pWrappedString->pNextWrappedString->pNextWrappedString = NULL;
          }

          fDone = TRUE;
        }
        usCurIndex--;
        usDestIndex = -1;
      } else {
        let zText: CHAR[] /* [1024] */;

        sprintf(zText, "LineWrap() Error!  The string ( %S ) has a word ( %S ) that is too long to fit into the required width of %d!  Please fix!!", pString, &TempString[usCurIndex], usLineWidthPixels);

        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, zText);

        // error
        usLineWidthPixels = 1 + WFStringPixLength(&TempString[usCurIndex], ulFont);

        *pusLineWidthIfWordIsWiderThenWidth = usLineWidthPixels;

        fTheStringIsToLong = TRUE;

        usCurIndex--;
        usDestIndex--;
      }
    }
    usCurIndex++;
    usDestIndex++;
  }
  return FirstWrappedString.pNextWrappedString;
}

//
// Pass in, the x,y location for the start of the string,
//					the width of the buffer
//					the gap in between the lines
//

function DisplayWrappedString(usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, ubGap: UINT8, uiFont: UINT32, ubColor: UINT8, pString: STR16, ubBackGroundColor: UINT8, fDirty: BOOLEAN, uiFlags: UINT32): UINT16 {
  let pFirstWrappedString: Pointer<WRAPPED_STRING>;
  let pTempWrappedString: Pointer<WRAPPED_STRING>;
  let uiCounter: UINT16 = 0;
  let usLineWidthIfWordIsWiderThenWidth: UINT16 = 0;
  let usHeight: UINT16;

  usHeight = WFGetFontHeight(uiFont);

  // If we are to a Single char for a word ( like in Taiwan )
  if (gfUseSingleCharWordsForWordWrap) {
    pFirstWrappedString = LineWrapForSingleCharWords(uiFont, usWidth, &usLineWidthIfWordIsWiderThenWidth, pString);
  } else {
    pFirstWrappedString = LineWrap(uiFont, usWidth, &usLineWidthIfWordIsWiderThenWidth, pString);
  }

  // if an error occured and a word was bigger then the width passed in, reset the width
  if (usLineWidthIfWordIsWiderThenWidth != usWidth)
    usWidth = usLineWidthIfWordIsWiderThenWidth;

  while (pFirstWrappedString != NULL) {
    DrawTextToScreen(pFirstWrappedString->sString, usPosX, usPosY, usWidth, uiFont, ubColor, ubBackGroundColor, fDirty, uiFlags);

    pTempWrappedString = pFirstWrappedString;
    pFirstWrappedString = pTempWrappedString->pNextWrappedString;
    MemFree(pTempWrappedString->sString);
    pTempWrappedString->sString = NULL;
    MemFree(pTempWrappedString);
    pTempWrappedString = NULL;

    uiCounter++;

    usPosY += usHeight + ubGap;
  }

  return uiCounter * (WFGetFontHeight(uiFont) + ubGap);
}

function DeleteWrappedString(pWrappedString: Pointer<WRAPPED_STRING>): UINT16 {
  let pTempWrappedString: Pointer<WRAPPED_STRING>;
  let uiCounter: UINT16 = 0;

  while (pWrappedString != NULL) {
    pTempWrappedString = pWrappedString;
    pWrappedString = pTempWrappedString->pNextWrappedString;
    MemFree(pTempWrappedString->sString);
    pTempWrappedString->sString = NULL;
    MemFree(pTempWrappedString);
    pTempWrappedString = NULL;

    uiCounter++;
  }
  return uiCounter;
}

// DrawTextToScreen	Parameters:
//			The string,
//			X position
//			Y position
//			The width of the area you are drawing in.  It can be 0 for left justified
//			The font
//			the color you want the font
//			the color of the background
//			do you want to display it using dirty rects, TRUE or FALSE
//			flags for either LEFT_JUSTIFIED, CENTER_JUSTIFIED, RIGHT_JUSTIFIED

function DrawTextToScreen(pStr: STR16, usLocX: UINT16, usLocY: UINT16, usWidth: UINT16, ulFont: UINT32, ubColor: UINT8, ubBackGroundColor: UINT8, fDirty: BOOLEAN, ulFlags: UINT32): BOOLEAN {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usFontHeight: UINT16 = 0;
  let usStringWidth: UINT16 = 0;

  if (ulFlags & DONT_DISPLAY_TEXT)
    return TRUE;

  if (ulFlags == 0)
    ulFlags = LEFT_JUSTIFIED;

  // FONT_MCOLOR_BLACK, FALSE
  if (ulFlags & LEFT_JUSTIFIED) {
    usPosX = usLocX;
    usPosY = usLocY;
  } else if (ulFlags & CENTER_JUSTIFIED) {
    VarFindFontCenterCoordinates(usLocX, usLocY, usWidth, WFGetFontHeight(ulFont), ulFont, &usPosX, &usPosY, pStr);
  } else if (ulFlags & RIGHT_JUSTIFIED) {
    VarFindFontRightCoordinates(usLocX, usLocY, usWidth, WFGetFontHeight(ulFont), ulFont, &usPosX, &usPosY, pStr);
  }

  SetFont(ulFont);

  if (USE_WINFONTS()) {
    let Color: COLORVAL = FROMRGB(255, 255, 255);
    SetWinFontForeColor(GET_WINFONT(), &Color);
  } else {
    SetFontForeground(ubColor);
    SetFontBackground(ubBackGroundColor);
  }

  if (ulFlags & TEXT_SHADOWED)
    ShadowText(FRAME_BUFFER, pStr, ulFont, (usPosX - 1), (usPosY - 1));

  if (USE_WINFONTS()) {
    if (fDirty) {
      gprintfdirty(usPosX, usPosY, pStr);
      WinFont_mprintf(GET_WINFONT(), usPosX, usPosY, pStr);
    } else {
      WinFont_mprintf(GET_WINFONT(), usPosX, usPosY, pStr);
    }
  } else {
    if (fDirty) {
      gprintfdirty(usPosX, usPosY, pStr);
      mprintf(usPosX, usPosY, pStr);
    } else {
      mprintf(usPosX, usPosY, pStr);
    }
  }

  if (IAN_WRAP_NO_SHADOW & ulFlags) {
    // reset shadow
    SetFontShadow(DEFAULT_SHADOW);
  }

  if (ulFlags & INVALIDATE_TEXT) {
    usFontHeight = WFGetFontHeight(ulFont);
    usStringWidth = WFStringPixLength(pStr, ulFont);

    InvalidateRegion(usPosX, usPosY, usPosX + usStringWidth, usPosY + usFontHeight);
  }

  return TRUE;
}

//
// Pass in, the x,y location for the start of the string,
//					the width of the buffer (how many pixels wide for word wrapping)
//					the gap in between the lines
//

function IanDisplayWrappedString(usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, ubGap: UINT8, uiFont: UINT32, ubColor: UINT8, pString: STR16, ubBackGroundColor: UINT8, fDirty: BOOLEAN, uiFlags: UINT32): UINT16 {
  let usHeight: UINT16;
  let usSourceCounter: UINT16 = 0;
  let usDestCounter: UINT16 = 0;
  let usWordLengthPixels: UINT16;
  let usLineLengthPixels: UINT16 = 0;
  let usPhraseLengthPixels: UINT16 = 0;
  let usLinesUsed: UINT16 = 1;
  let usLocalWidth: UINT16 = usWidth;
  let uiLocalFont: UINT32 = uiFont;
  let usJustification: UINT16 = LEFT_JUSTIFIED;
  let usLocalPosX: UINT16 = usPosX;
  let ubLocalColor: UINT8 = ubColor;
  let fBoldOn: BOOLEAN = FALSE;

  let zLineString: CHAR16[] /* [128] */ = "";
  let zWordString: CHAR16[] /* [64] */ = "";

  usHeight = WFGetFontHeight(uiFont);

  do {
    // each character goes towards building a new word
    if (pString[usSourceCounter] != TEXT_SPACE && pString[usSourceCounter] != 0) {
      zWordString[usDestCounter++] = pString[usSourceCounter];
    } else {
      // we hit a space (or end of record), so this is the END of a word!

      // is this a special CODE?
      if (zWordString[0] >= TEXT_CODE_NEWLINE && zWordString[0] <= TEXT_CODE_DEFCOLOR) {
        switch (zWordString[0]) {
          case TEXT_CODE_CENTER:

            if (usJustification != CENTER_JUSTIFIED) {
              usJustification = CENTER_JUSTIFIED;

              // erase this word string we've been building - it was just a code
              memset(zWordString, 0, sizeof(zWordString));

              // erase the line string, we're starting from scratch
              memset(zLineString, 0, sizeof(zLineString));

              // reset the line length - we're starting from scratch
              usLineLengthPixels = 0;

              // reset dest char counter
              usDestCounter = 0;
            } else // turn OFF centering...
            {
              // shadow control
              if (IAN_WRAP_NO_SHADOW & uiFlags) {
                // turn off shadow
                SetFontShadow(NO_SHADOW);
              }

              // time to draw this line of text (centered)!
              DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

              // shadow control
              if (IAN_WRAP_NO_SHADOW & uiFlags) {
                // turn on shadow
                SetFontShadow(DEFAULT_SHADOW);
              }

              // increment Y position for next time
              usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap; //; // +ubGap

              // we just used a line, so note that
              usLinesUsed++;

              // reset x position
              usLocalPosX = usPosX;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // reset the line length
              usLineLengthPixels = 0;

              // reset dest char counter
              usDestCounter = 0;

              // turn off centering...
              usJustification = LEFT_JUSTIFIED;
            }

            break;

          case TEXT_CODE_NEWLINE:

            // NEWLINE character!

            // shadow control
            if (IAN_WRAP_NO_SHADOW & uiFlags) {
              // turn off shadow
              SetFontShadow(NO_SHADOW);
            }

            // Display what we have up to now
            DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

            // shadow control
            if (IAN_WRAP_NO_SHADOW & uiFlags) {
              // turn on shadow
              SetFontShadow(DEFAULT_SHADOW);
            }

            // increment Y position for next time
            usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap; //; // +ubGap

            // we just used a line, so note that
            usLinesUsed++;

            // reset x position
            usLocalPosX = usPosX;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // reset the line length
            usLineLengthPixels = 0;

            // reset width
            usLocalWidth = usWidth;

            // reset dest char counter
            usDestCounter = 0;

            break;

          case TEXT_CODE_BOLD:

            if (!fBoldOn) {
              // shadow control
              if (IAN_WRAP_NO_SHADOW & uiFlags) {
                // turn off shadow
                SetFontShadow(NO_SHADOW);
              }

              // turn bold ON.... but first, write whatever we have in normal now...
              DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubColor, ubBackGroundColor, fDirty, usJustification);

              // shadow control
              if (IAN_WRAP_NO_SHADOW & uiFlags) {
                // turn on shadow
                SetFontShadow(DEFAULT_SHADOW);
              }

              // calc length of what we just wrote
              usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

              // calculate new x position for next time
              usLocalPosX += usPhraseLengthPixels;

              // shorten width for next time
              usLocalWidth -= usLineLengthPixels;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // turn bold ON
              uiLocalFont = FONT10ARIALBOLD;
              SetFontShadow(NO_SHADOW);
              fBoldOn = TRUE;

              // reset dest char counter
              usDestCounter = 0;
            } else {
              // shadow control
              if (IAN_WRAP_NO_SHADOW & uiFlags) {
                // turn off shadow
                SetFontShadow(NO_SHADOW);
              }

              // turn bold OFF - write whatever we have in bold now...
              DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubColor, ubBackGroundColor, fDirty, usJustification);

              // shadow control
              if (IAN_WRAP_NO_SHADOW & uiFlags) {
                // turn on shadow
                SetFontShadow(DEFAULT_SHADOW);
              }

              // calc length of what we just wrote
              usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

              // calculate new x position for next time
              usLocalPosX += usPhraseLengthPixels;

              // shorten width for next time
              usLocalWidth -= usLineLengthPixels;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // new by Ian Nov 30th, 1998

              /*
              DEF: commented out for Beta.  Nov 30

                                                                      // measure length of WordString and if length > 1, then we have a word to deal with
                                                                      if (wcslen(zWordString) > 1)
                                                                      {
                                                                              // need to reduce the usSourceCounter by the true word length (not counting the code char)
                                                                              usSourceCounter -= (wcslen(zWordString) - 1);
                                                                      }

              */
              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // turn bold OFF
              uiLocalFont = uiFont;
              fBoldOn = FALSE;

              // reset dest char counter
              usDestCounter = 0;
            }

            break;

          case TEXT_CODE_NEWCOLOR:

            // shadow control
            if (IAN_WRAP_NO_SHADOW & uiFlags) {
              // turn off shadow
              SetFontShadow(NO_SHADOW);
            }

            // change to new color.... but first, write whatever we have in normal now...
            DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

            // shadow control
            if (IAN_WRAP_NO_SHADOW & uiFlags) {
              // turn on shadow
              SetFontShadow(DEFAULT_SHADOW);
            }

            // the new color value is the next character in the word
            if (zWordString[1] != TEXT_SPACE && zWordString[1] < 256)
              ubLocalColor = zWordString[1];

            ubLocalColor = 184;
            ;

            // calc length of what we just wrote
            usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

            // calculate new x position for next time
            usLocalPosX += usPhraseLengthPixels;

            // shorten width for next time
            usLocalWidth -= usLineLengthPixels;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // reset dest char counter
            usDestCounter = 0;
            break;

          case TEXT_CODE_DEFCOLOR:

            // shadow control
            if (IAN_WRAP_NO_SHADOW & uiFlags) {
              // turn off shadow
              SetFontShadow(NO_SHADOW);
            }

            // turn color back to default - write whatever we have in bold now...
            DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

            // shadow control
            if (IAN_WRAP_NO_SHADOW & uiFlags) {
              // turn on shadow
              SetFontShadow(DEFAULT_SHADOW);
            }

            // calc length of what we just wrote
            usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

            // calculate new x position for next time
            usLocalPosX += usPhraseLengthPixels;

            // shorten width for next time
            usLocalWidth -= usLineLengthPixels;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // change color back to default color
            ubLocalColor = ubColor;

            // reset dest char counter
            usDestCounter = 0;
            break;
        } // end of switch of CODES
      } else // not a special character
      {
        // terminate the string TEMPORARILY
        zWordString[usDestCounter] = 0;

        // get the length (in pixels) of this word
        usWordLengthPixels = WFStringPixLength(zWordString, uiLocalFont);

        // add a space (in case we add another word to it)
        zWordString[usDestCounter++] = 32;

        // RE-terminate the string
        zWordString[usDestCounter] = 0;

        // can we fit it onto the length of our "line" ?
        if ((usLineLengthPixels + usWordLengthPixels) < usWidth) {
          // yes we can fit this word.

          // get the length AGAIN (in pixels with the SPACE) for this word
          usWordLengthPixels = WFStringPixLength(zWordString, uiLocalFont);

          // calc new pixel length for the line
          usLineLengthPixels += usWordLengthPixels;

          // reset dest char counter
          usDestCounter = 0;

          // add the word (with the space) to the line
          wcscat(zLineString, zWordString);
        } else {
          // can't fit this word!

          // shadow control
          if (IAN_WRAP_NO_SHADOW & uiFlags) {
            // turn off shadow
            SetFontShadow(NO_SHADOW);
          }

          // Display what we have up to now
          DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

          // shadow control
          if (IAN_WRAP_NO_SHADOW & uiFlags) {
            // turn off shadow
            SetFontShadow(DEFAULT_SHADOW);
          }

          // increment Y position for next time
          usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap; //; // +ubGap

          // reset x position
          usLocalPosX = usPosX;

          // we just used a line, so note that
          usLinesUsed++;

          // start off next line string with the word we couldn't fit
          wcscpy(zLineString, zWordString);

          // remeasure the line length
          usLineLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

          // reset dest char counter
          usDestCounter = 0;

          // reset width
          usLocalWidth = usWidth;
        }
      } // end of this word was NOT a special code
    }
  } while (pString[usSourceCounter++] != 0);

  // terminate the entire paragraph with a null string (null character guaranteed)
  wcscat(zLineString, "");

  // shadow control
  if (IAN_WRAP_NO_SHADOW & uiFlags) {
    // turn off shadow
    SetFontShadow(NO_SHADOW);
  }

  // draw the paragraph
  DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

  // shadow control
  if (IAN_WRAP_NO_SHADOW & uiFlags) {
    // turn on shadow
    SetFontShadow(DEFAULT_SHADOW);
  }

  // return how many Y pixels we used
  return (usLinesUsed * (WFGetFontHeight(uiFont) + ubGap)); // +ubGap
}

function CleanOutControlCodesFromString(pSourceString: STR16, pDestString: STR16): void {
  let iSourceCounter: INT32 = 0;
  let iDestCounter: INT32 = 0;

  let fRemoveCurrentChar: BOOLEAN;
  let fRemoveCurrentCharAndNextChar: BOOLEAN;

  // this procedure will run through a STR16 and strip out all control characters. This is a nessacary as wcscmp and the like tend not to like control chars in thier strings

  fRemoveCurrentChar = FALSE;
  fRemoveCurrentCharAndNextChar = FALSE;

  // while not end of source string,
  while (pSourceString[iSourceCounter] != 0) {
    if (pSourceString[iSourceCounter + 1] == 0) {
      fRemoveCurrentCharAndNextChar = FALSE;
      fRemoveCurrentChar = TRUE;
    } else {
      switch (pSourceString[iSourceCounter]) {
        case TEXT_CODE_CENTER:
        case TEXT_CODE_NEWCOLOR:
        case TEXT_CODE_BOLD:
        case TEXT_CODE_DEFCOLOR:

          if (pSourceString[iSourceCounter + 1] == TEXT_SPACE) {
            fRemoveCurrentCharAndNextChar = TRUE;
            fRemoveCurrentChar = FALSE;
          } else {
            fRemoveCurrentCharAndNextChar = FALSE;
            fRemoveCurrentChar = TRUE;
          }

          break;

        case TEXT_CODE_NEWLINE:
          fRemoveCurrentCharAndNextChar = FALSE;
          fRemoveCurrentChar = TRUE;
          break;

        default:
          fRemoveCurrentCharAndNextChar = FALSE;
          fRemoveCurrentChar = FALSE;
          break;
      }
    }

    if (fRemoveCurrentChar) {
      iSourceCounter++;
    } else if (fRemoveCurrentCharAndNextChar) {
      if (pSourceString[iSourceCounter + 2] != 0)
        iSourceCounter += 2;
      else
        iSourceCounter++;
    } else {
      pDestString[iDestCounter] = pSourceString[iSourceCounter];

      iDestCounter++;
      iSourceCounter++;
    }

    fRemoveCurrentCharAndNextChar = FALSE;
    fRemoveCurrentChar = FALSE;
  }

  pDestString[iDestCounter] = '\0';

  return;
}

//
// Pass in, the x,y location for the start of the string,
//					the width of the buffer (how many pixels wide for word wrapping)
//					the gap in between the lines, the height of buffer and which page you want the text displayed for, and the total height to date
//

function IanDisplayWrappedStringToPages(usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usPageHeight: UINT16, usTotalHeight: UINT16, usPageNumber: UINT16, ubGap: UINT8, uiFont: UINT32, ubColor: UINT8, pString: STR16, ubBackGroundColor: UINT8, fDirty: BOOLEAN, uiFlags: UINT32, fOnLastPageFlag: Pointer<BOOLEAN>): INT16 {
  let usHeight: UINT16;
  let usSourceCounter: UINT16 = 0;
  let usDestCounter: UINT16 = 0;
  let usWordLengthPixels: UINT16;
  let usLineLengthPixels: UINT16 = 0;
  let usPhraseLengthPixels: UINT16 = 0;
  let usLinesUsed: UINT16 = 1;
  let usLocalWidth: UINT16 = usWidth;
  let uiLocalFont: UINT32 = uiFont;
  let usJustification: UINT16 = LEFT_JUSTIFIED;
  let usLocalPosX: UINT16 = usPosX;
  let ubLocalColor: UINT8 = ubColor;
  let fBoldOn: BOOLEAN = FALSE;
  let iTotalHeight: UINT32 = 0;
  let zLineString: CHAR16[] /* [640] */ = "";
  let zWordString: CHAR16[] /* [640] */ = "";

  usHeight = WFGetFontHeight(uiFont);

  // identical to ianwordwrap, but this one lets the user to specify the page they want to display, if the text takes more than one page
  // multiple calls to this function will allow one to work out how many pages there are

  do {
    // last page is not true, YET!
    *fOnLastPageFlag = FALSE;
    // each character goes towards building a new word
    if (pString[usSourceCounter] != TEXT_SPACE && pString[usSourceCounter] != 0) {
      zWordString[usDestCounter++] = pString[usSourceCounter];
    } else {
      // we hit a space (or end of record), so this is the END of a word!

      // is this a special CODE?
      if (zWordString[0] >= TEXT_CODE_NEWLINE && zWordString[0] <= TEXT_CODE_DEFCOLOR) {
        switch (zWordString[0]) {
          case TEXT_CODE_CENTER:

            if (usJustification != CENTER_JUSTIFIED) {
              usJustification = CENTER_JUSTIFIED;

              // erase this word string we've been building - it was just a code
              memset(zWordString, 0, sizeof(zWordString));

              // erase the line string, we're starting from scratch
              memset(zLineString, 0, sizeof(zLineString));

              // reset the line length - we're starting from scratch
              usLineLengthPixels = 0;

              // reset dest char counter
              usDestCounter = 0;
            } else // turn OFF centering...
            {
              // time to draw this line of text (centered)!
              DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

              // increment Y position for next time
              usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap;

              // we just used a line, so note that
              usLinesUsed++;

              // reset x position
              usLocalPosX = usPosX;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // reset the line length
              usLineLengthPixels = 0;

              // reset dest char counter
              usDestCounter = 0;

              // turn off centering...
              usJustification = LEFT_JUSTIFIED;
            }

            break;

          case TEXT_CODE_NEWLINE:

            // NEWLINE character!

            // Display what we have up to now
            DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

            // increment Y position for next time
            usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap;

            // we just used a line, so note that
            usLinesUsed++;

            // reset x position
            usLocalPosX = usPosX;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // reset the line length
            usLineLengthPixels = 0;

            // reset width
            usLocalWidth = usWidth;

            // reset dest char counter
            usDestCounter = 0;

            break;

          case TEXT_CODE_BOLD:

            if (!fBoldOn) {
              // turn bold ON.... but first, write whatever we have in normal now...
              DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubColor, ubBackGroundColor, fDirty, usJustification);

              // calc length of what we just wrote
              usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

              // calculate new x position for next time
              usLocalPosX += usPhraseLengthPixels;

              // shorten width for next time
              usLocalWidth -= usLineLengthPixels;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // turn bold ON
              uiLocalFont = FONT10ARIALBOLD;
              SetFontShadow(NO_SHADOW);
              fBoldOn = TRUE;

              // reset dest char counter
              usDestCounter = 0;
            } else {
              // turn bold OFF - write whatever we have in bold now...
              DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubColor, ubBackGroundColor, fDirty, usJustification);

              // calc length of what we just wrote
              usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

              // calculate new x position for next time
              usLocalPosX += usPhraseLengthPixels;

              // shorten width for next time
              usLocalWidth -= usLineLengthPixels;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // turn bold OFF
              uiLocalFont = uiFont;
              fBoldOn = FALSE;

              // reset dest char counter
              usDestCounter = 0;
            }

            break;

          case TEXT_CODE_NEWCOLOR:

            // change to new color.... but first, write whatever we have in normal now...
            DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

            // the new color value is the next character in the word
            if (zWordString[1] != TEXT_SPACE && zWordString[1] < 256)
              ubLocalColor = zWordString[1];

            ubLocalColor = 184;
            ;

            // calc length of what we just wrote
            usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

            // calculate new x position for next time
            usLocalPosX += usPhraseLengthPixels;

            // shorten width for next time
            usLocalWidth -= usLineLengthPixels;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // reset dest char counter
            usDestCounter = 0;
            break;

          case TEXT_CODE_DEFCOLOR:

            // turn color back to default - write whatever we have in bold now...
            DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

            // calc length of what we just wrote
            usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

            // calculate new x position for next time
            usLocalPosX += usPhraseLengthPixels;

            // shorten width for next time
            usLocalWidth -= usLineLengthPixels;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // change color back to default color
            ubLocalColor = ubColor;

            // reset dest char counter
            usDestCounter = 0;
            break;
        } // end of switch of CODES
      } else // not a special character
      {
        // terminate the string TEMPORARILY
        zWordString[usDestCounter] = 0;

        // get the length (in pixels) of this word
        usWordLengthPixels = WFStringPixLength(zWordString, uiLocalFont);

        // add a space (in case we add another word to it)
        zWordString[usDestCounter++] = 32;

        // RE-terminate the string
        zWordString[usDestCounter] = 0;

        // can we fit it onto the length of our "line" ?
        if ((usLineLengthPixels + usWordLengthPixels) < usWidth) {
          // yes we can fit this word.

          // get the length AGAIN (in pixels with the SPACE) for this word
          usWordLengthPixels = WFStringPixLength(zWordString, uiLocalFont);

          // calc new pixel length for the line
          usLineLengthPixels += usWordLengthPixels;

          // reset dest char counter
          usDestCounter = 0;

          // add the word (with the space) to the line
          wcscat(zLineString, zWordString);
        } else {
          // Display what we have up to now
          DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

          // reset x position
          usLocalPosX = usPosX;

          // increment Y position for next time
          usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap;

          // we just used a line, so note that
          usLinesUsed++;

          // start off next line string with the word we couldn't fit
          wcscpy(zLineString, zWordString);

          // remeasure the line length
          usLineLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

          // reset dest char counter
          usDestCounter = 0;

          // reset width
          usLocalWidth = usWidth;
        }
      } // end of this word was NOT a special code
    }
  } while (pString[usSourceCounter++] != 0);

  // terminate the entire paragraph with a null string (null character guaranteed)
  wcscat(zLineString, "");

  // draw the paragraph
  DrawTextToScreen(zLineString, usLocalPosX, usPosY, usLocalWidth, uiLocalFont, ubLocalColor, ubBackGroundColor, fDirty, usJustification);

  // return how many Y pixels we used
  return (usLinesUsed * (WFGetFontHeight(uiFont) + ubGap)); // +ubGap
}

// now variant for grabbing height
function IanWrappedStringHeight(usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, ubGap: UINT8, uiFont: UINT32, ubColor: UINT8, pString: STR16, ubBackGroundColor: UINT8, fDirty: BOOLEAN, uiFlags: UINT32): UINT16 {
  let usHeight: UINT16;
  let usSourceCounter: UINT16 = 0;
  let usDestCounter: UINT16 = 0;
  let usWordLengthPixels: UINT16;
  let usLineLengthPixels: UINT16 = 0;
  let usPhraseLengthPixels: UINT16 = 0;
  let usLinesUsed: UINT16 = 1;
  let usLocalWidth: UINT16 = usWidth;
  let uiLocalFont: UINT32 = uiFont;
  let usJustification: UINT16 = LEFT_JUSTIFIED;
  let usLocalPosX: UINT16 = usPosX;
  let ubLocalColor: UINT8 = ubColor;
  let fBoldOn: BOOLEAN = FALSE;
  let iTotalHeight: UINT32 = 0;
  let zLineString: CHAR16[] /* [640] */ = "";
  let zWordString: CHAR16[] /* [640] */ = "";

  usHeight = WFGetFontHeight(uiFont);

  // simply a cut and paste operation on Ian Display Wrapped, but will not write string to screen
  // since this all we want to do, everything IanWrapped will do but without displaying string

  do {
    // each character goes towards building a new word
    if (pString[usSourceCounter] != TEXT_SPACE && pString[usSourceCounter] != 0) {
      zWordString[usDestCounter++] = pString[usSourceCounter];
    } else {
      // we hit a space (or end of record), so this is the END of a word!

      // is this a special CODE?
      if (zWordString[0] >= TEXT_CODE_NEWLINE && zWordString[0] <= TEXT_CODE_DEFCOLOR) {
        switch (zWordString[0]) {
          case TEXT_CODE_CENTER:

            if (usJustification != CENTER_JUSTIFIED) {
              usJustification = CENTER_JUSTIFIED;

              // erase this word string we've been building - it was just a code
              memset(zWordString, 0, sizeof(zWordString));

              // erase the line string, we're starting from scratch
              memset(zLineString, 0, sizeof(zLineString));

              // reset the line length - we're starting from scratch
              usLineLengthPixels = 0;

              // reset dest char counter
              usDestCounter = 0;
            } else // turn OFF centering...
            {
              // increment Y position for next time
              usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap;

              // we just used a line, so note that
              usLinesUsed++;

              // reset x position
              usLocalPosX = usPosX;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // reset the line length
              usLineLengthPixels = 0;

              // reset dest char counter
              usDestCounter = 0;

              // turn off centering...
              usJustification = LEFT_JUSTIFIED;
            }

            break;

          case TEXT_CODE_NEWLINE:

            // NEWLINE character!

            // increment Y position for next time
            usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap;

            // we just used a line, so note that
            usLinesUsed++;

            // reset x position
            usLocalPosX = usPosX;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // reset the line length
            usLineLengthPixels = 0;

            // reset width
            usLocalWidth = usWidth;

            // reset dest char counter
            usDestCounter = 0;

            break;

          case TEXT_CODE_BOLD:

            if (!fBoldOn) {
              // calc length of what we just wrote
              usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);
              // calculate new x position for next time
              usLocalPosX += usPhraseLengthPixels;

              // shorten width for next time
              usLocalWidth -= usLineLengthPixels;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // turn bold ON
              uiLocalFont = FONT10ARIALBOLD;
              SetFontShadow(NO_SHADOW);
              fBoldOn = TRUE;

              // reset dest char counter
              usDestCounter = 0;
            } else {
              // calc length of what we just wrote
              usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

              // calculate new x position for next time
              usLocalPosX += usPhraseLengthPixels;

              // shorten width for next time
              usLocalWidth -= usLineLengthPixels;

              // erase line string
              memset(zLineString, 0, sizeof(zLineString));

              // erase word string
              memset(zWordString, 0, sizeof(zWordString));

              // turn bold OFF
              uiLocalFont = uiFont;
              fBoldOn = FALSE;

              // reset dest char counter
              usDestCounter = 0;
            }

            break;

          case TEXT_CODE_NEWCOLOR:

            // the new color value is the next character in the word
            if (zWordString[1] != TEXT_SPACE && zWordString[1] < 256)
              ubLocalColor = zWordString[1];

            ubLocalColor = 184;
            ;

            // calc length of what we just wrote
            usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

            // calculate new x position for next time
            usLocalPosX += usPhraseLengthPixels;

            // shorten width for next time
            usLocalWidth -= usLineLengthPixels;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // reset dest char counter
            usDestCounter = 0;
            break;

          case TEXT_CODE_DEFCOLOR:

            // calc length of what we just wrote
            usPhraseLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

            // calculate new x position for next time
            usLocalPosX += usPhraseLengthPixels;

            // shorten width for next time
            usLocalWidth -= usLineLengthPixels;

            // erase line string
            memset(zLineString, 0, sizeof(zLineString));

            // erase word string
            memset(zWordString, 0, sizeof(zWordString));

            // change color back to default color
            ubLocalColor = ubColor;

            // reset dest char counter
            usDestCounter = 0;
            break;
        } // end of switch of CODES
      } else // not a special character
      {
        // terminate the string TEMPORARILY
        zWordString[usDestCounter] = 0;

        // get the length (in pixels) of this word
        usWordLengthPixels = WFStringPixLength(zWordString, uiLocalFont);

        // add a space (in case we add another word to it)
        zWordString[usDestCounter++] = 32;

        // RE-terminate the string
        zWordString[usDestCounter] = 0;

        // can we fit it onto the length of our "line" ?
        if ((usLineLengthPixels + usWordLengthPixels) <= usWidth) {
          // yes we can fit this word.

          // get the length AGAIN (in pixels with the SPACE) for this word
          usWordLengthPixels = WFStringPixLength(zWordString, uiLocalFont);

          // calc new pixel length for the line
          usLineLengthPixels += usWordLengthPixels;

          // reset dest char counter
          usDestCounter = 0;

          // add the word (with the space) to the line
          wcscat(zLineString, zWordString);
        } else {
          // can't fit this word!

          // increment Y position for next time
          usPosY += (WFGetFontHeight(uiLocalFont)) + ubGap;

          // reset x position
          usLocalPosX = usPosX;

          // we just used a line, so note that
          usLinesUsed++;

          // start off next line string with the word we couldn't fit
          wcscpy(zLineString, zWordString);

          // remeasure the line length
          usLineLengthPixels = WFStringPixLength(zLineString, uiLocalFont);

          // reset dest char counter
          usDestCounter = 0;

          // reset width
          usLocalWidth = usWidth;
        }
      } // end of this word was NOT a special code
    }
  } while (pString[usSourceCounter++] != 0);

  SetFontShadow(DEFAULT_SHADOW);

  // return how many Y pixels we used
  return (usLinesUsed * (WFGetFontHeight(uiFont) + ubGap)); // +ubGap
}

function WillThisStringGetCutOff(iTotalYPosition: INT32, iBottomOfPage: INT32, iWrapWidth: INT32, uiFont: UINT32, pString: STR16, iGap: INT32, iPage: INT32): BOOLEAN {
  let fGetCutOff: BOOLEAN = FALSE;
  let iHeight: INT32;
  // Will return if this string will get cut off

  iHeight = IanWrappedStringHeight(0, 0, iWrapWidth, (iGap), uiFont, 0, pString, 0, FALSE, 0);

  if (iHeight + iTotalYPosition >= ((iPage + 1) * iBottomOfPage)) {
    fGetCutOff = TRUE;
  }

  return fGetCutOff;
}

function IsThisStringBeforeTheCurrentPage(iTotalYPosition: INT32, iPageSize: INT32, iCurrentPage: INT32, iWrapWidth: INT32, uiFont: UINT32, pString: STR16, iGap: INT32): BOOLEAN {
  // check to see if the current string will appear on the current page
  let fBeforeCurrentPage: BOOLEAN = FALSE;

  if (iTotalYPosition + IanWrappedStringHeight(0, 0, iWrapWidth, (iGap), uiFont, 0, pString, 0, FALSE, 0) > (iPageSize * iCurrentPage)) {
    fBeforeCurrentPage = FALSE;
  } else if (iTotalYPosition <= (iPageSize * iCurrentPage)) {
    fBeforeCurrentPage = TRUE;
  }

  return fBeforeCurrentPage;
}

function GetNewTotalYPositionOfThisString(iTotalYPosition: INT32, iPageSize: INT32, iCurrentPage: INT32, iWrapWidth: INT32, uiFont: UINT32, pString: STR16, iGap: INT32): INT32 {
  let iNewYPosition: INT32 = 0;
  // will returnt he new total y value of this string

  iNewYPosition = iTotalYPosition + IanWrappedStringHeight(0, 0, iWrapWidth, (iGap), uiFont, 0, pString, 0, FALSE, 0);

  return iNewYPosition;
}

function ShadowText(uiDestVSurface: UINT32, pString: STR16, uiFont: UINT32, usPosX: UINT16, usPosY: UINT16): void {
  let uiLength: UINT32 = StringPixLength(pString, uiFont);
  let usFontHeight: UINT16 = WFGetFontHeight(uiFont);

  ShadowVideoSurfaceRect(uiDestVSurface, usPosX, usPosY, usPosX + uiLength + 1, usPosY + usFontHeight + 1);
}

// for email
function GetFirstRecordOnThisPage(RecordList: RecordPtr, uiFont: UINT32, usWidth: UINT16, ubGap: UINT8, iPage: INT32, iPageSize: INT32): RecordPtr {
  // get the first record on this page - build pages up until this point

  let CurrentRecord: RecordPtr = NULL;

  let iCurrentPositionOnThisPage: INT32 = 0;
  let iCurrentPage: INT32 = 0;

  // null record list, nothing to do
  if (RecordList == NULL) {
    return CurrentRecord;
  }

  CurrentRecord = RecordList;

  // while we are not on the current page
  while (iCurrentPage < iPage) {
    // build record list to this point
    while ((iCurrentPositionOnThisPage + IanWrappedStringHeight(0, 0, usWidth, ubGap, uiFont, 0, CurrentRecord->pRecord, 0, 0, 0)) <= iPageSize) {
      // still room on this page
      iCurrentPositionOnThisPage += IanWrappedStringHeight(0, 0, usWidth, ubGap, uiFont, 0, CurrentRecord->pRecord, 0, 0, 0);

      // next record
      CurrentRecord = CurrentRecord->Next;

      // check if we have gone too far?
      if (CurrentRecord == NULL) {
        return CurrentRecord;
      }
    }

    // reset position
    iCurrentPositionOnThisPage = 0;

    // next page
    iCurrentPage++;
  }

  return CurrentRecord;
}

// for file viewer
function GetFirstStringOnThisPage(RecordList: FileStringPtr, uiFont: UINT32, usWidth: UINT16, ubGap: UINT8, iPage: INT32, iPageSize: INT32, WidthList: FileRecordWidthPtr): FileStringPtr {
  // get the first record on this page - build pages up until this point

  let CurrentRecord: FileStringPtr = NULL;

  let iCurrentPositionOnThisPage: INT32 = 0;
  let iCurrentPage: INT32 = 0;
  let iCounter: INT32 = 0;
  let pWidthList: FileRecordWidthPtr = WidthList;
  let usCurrentWidth: UINT16 = usWidth;

  // null record list, nothing to do
  if (RecordList == NULL) {
    return CurrentRecord;
  }

  CurrentRecord = RecordList;

  // while we are not on the current page
  while (iCurrentPage < iPage) {
    usCurrentWidth = usWidth;
    pWidthList = WidthList;

    while (pWidthList) {
      if (iCounter == pWidthList->iRecordNumber) {
        usCurrentWidth = pWidthList->iRecordWidth;
        //				iCurrentPositionOnThisPage += pWidthList->iRecordHeightAdjustment;

        if (pWidthList->iRecordHeightAdjustment == iPageSize) {
          if (iCurrentPositionOnThisPage != 0)
            iCurrentPositionOnThisPage += iPageSize - iCurrentPositionOnThisPage;
        } else
          iCurrentPositionOnThisPage += pWidthList->iRecordHeightAdjustment;
      }
      pWidthList = pWidthList->Next;
    }

    // build record list to this point
    while ((iCurrentPositionOnThisPage + IanWrappedStringHeight(0, 0, usCurrentWidth, ubGap, uiFont, 0, CurrentRecord->pString, 0, 0, 0)) < iPageSize) {
      // still room on this page
      iCurrentPositionOnThisPage += IanWrappedStringHeight(0, 0, usCurrentWidth, ubGap, uiFont, 0, CurrentRecord->pString, 0, 0, 0);

      // next record
      CurrentRecord = CurrentRecord->Next;
      iCounter++;

      usCurrentWidth = usWidth;
      pWidthList = WidthList;
      while (pWidthList) {
        if (iCounter == pWidthList->iRecordNumber) {
          usCurrentWidth = pWidthList->iRecordWidth;

          if (pWidthList->iRecordHeightAdjustment == iPageSize) {
            if (iCurrentPositionOnThisPage != 0)
              iCurrentPositionOnThisPage += iPageSize - iCurrentPositionOnThisPage;
          } else
            iCurrentPositionOnThisPage += pWidthList->iRecordHeightAdjustment;
        }
        pWidthList = pWidthList->Next;
      }
    }

    // reset position
    iCurrentPositionOnThisPage = 0;

    // next page
    iCurrentPage++;
    //		iCounter++;
  }

  return CurrentRecord;
}

function ReduceStringLength(pString: STR16, uiWidthToFitIn: UINT32, uiFont: UINT32): BOOLEAN {
  let OneChar: wchar_t[] /* [2] */;
  let zTemp: UINT16[] /* [1024] */;
  let zStrDots: wchar_t[] /* [16] */;
  let uiDotWidth: UINT32;
  let uiTempStringPixWidth: UINT32 = 0;
  let uiStringPixWidth: UINT32;
  let fDone: BOOLEAN = FALSE;
  let uiSrcStringCntr: UINT32 = 0;
  let uiOneCharWidth: UINT32 = 0;

  uiStringPixWidth = WFStringPixLength(pString, uiFont);

  OneChar[1] = '\0';
  zTemp[0] = '\0';

  // if the string is wider then the loaction
  if (uiStringPixWidth <= uiWidthToFitIn) {
    // leave
    return TRUE;
  }

  // addd the '...' to the string
  wcscpy(zStrDots, "...");

  // get the width of the '...'
  uiDotWidth = StringPixLength(zStrDots, uiFont);

  // since the temp strig will contain the '...' add the '...' width to the temp string now
  uiTempStringPixWidth = uiDotWidth;

  // loop through and add each character, 1 at a time
  while (!fDone) {
    // get the next char
    OneChar[0] = pString[uiSrcStringCntr];

    // get the width of the character
    uiOneCharWidth = StringPixLength(OneChar, uiFont);

    // will the new char + the old string be too wide for the width
    if ((uiTempStringPixWidth + uiOneCharWidth) <= uiWidthToFitIn) {
      // add the new char to the string
      wcscat(zTemp, OneChar);

      // add the new char width to the string width
      uiTempStringPixWidth += uiOneCharWidth;

      // increment to the next string
      uiSrcStringCntr++;
    }

    // yes the string would be too long if we add the new char, stop adding characters
    else {
      // we are done
      fDone = TRUE;
    }
  }

  // combine the temp string and the '...' to form the finished string
  swprintf(pString, "%s%s", zTemp, zStrDots);

  return TRUE;
}
