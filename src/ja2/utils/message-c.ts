namespace ja2 {

interface StringSaveStruct {
  uiFont: UINT32;
  uiTimeOfLastUpdate: UINT32;
  uiFlags: UINT32;
  uiPadding: UINT32[] /* [3] */;
  usColor: UINT16;
  fBeginningOfNewString: boolean;
}

const MAX_LINE_COUNT = 6;
const X_START = 2;
const Y_START = 330;
const MAX_AGE = 10000;
const LINE_WIDTH = 320;
const MAP_LINE_WIDTH = 300;
const WIDTH_BETWEEN_NEW_STRINGS = 5;

const BETAVERSION_COLOR = FONT_ORANGE;
const TESTVERSION_COLOR = FONT_GREEN;
const DEBUG_COLOR = FONT_RED;
const DIALOGUE_COLOR = FONT_WHITE;
const INTERFACE_COLOR = FONT_YELLOW;

const MAP_SCREEN_MESSAGE_FONT = () => TINYFONT1();

export let gubStartOfMapScreenMessageList: UINT8 = 0;
let gubEndOfMapScreenMessageList: UINT8 = 0;

// index of the current string we are looking at
export let gubCurrentMapMessageString: UINT8 = 0;

// temp position for display of marker
// UINT8 ubTempPosition = 0;

// are allowed to beep on message scroll?
export let fOkToBeepNewMessage: boolean = true;

/* static */ let gpDisplayList: ScrollStringStPtr[] /* [MAX_LINE_COUNT] */;
/* static */ let gMapScreenMessageList: ScrollStringStPtr[] /* [256] */;
/* static */ let pStringS: ScrollStringStPtr = null;

// first time adding any message to the message dialogue system
let fFirstTimeInMessageSystem: boolean = true;
let fDisableJustForIan: boolean = false;

let fScrollMessagesHidden: boolean = false;
let uiStartOfPauseTime: UINT32 = 0;

// prototypes

// functions

function SetStringFont(pStringSt: ScrollStringStPtr, uiFont: UINT32): void {
  pStringSt.value.uiFont = uiFont;
}

function GetStringFont(pStringSt: ScrollStringStPtr): UINT32 {
  return pStringSt.value.uiFont;
}

function AddString(pString: string /* STR16 */, usColor: UINT16, uiFont: UINT32, fStartOfNewString: boolean, ubPriority: UINT8): ScrollStringStPtr {
  // add a new string to the list of strings
  let pStringSt: ScrollStringStPtr = null;
  pStringSt = MemAlloc(sizeof(ScrollStringSt));

  SetString(pStringSt, pString);
  SetStringColor(pStringSt, usColor);
  pStringSt.value.uiFont = uiFont;
  pStringSt.value.fBeginningOfNewString = fStartOfNewString;
  pStringSt.value.uiFlags = ubPriority;

  SetStringNext(pStringSt, null);
  SetStringPrev(pStringSt, null);
  pStringSt.value.iVideoOverlay = -1;

  // now add string to map screen strings
  // AddStringToMapScreenMessageList(pString, usColor, uiFont, fStartOfNewString, ubPriority );

  return pStringSt;
}

function SetString(pStringSt: ScrollStringStPtr, pString: string /* STR16 */): void {
  // ARM: Why x2 + 4 ???
  pStringSt.value.pString16 = MemAlloc((pString.length * 2) + 4);
  wcsncpy(pStringSt.value.pString16, pString, pString.length);
  pStringSt.value.pString16[pString.length] = 0;
}

function SetStringPosition(pStringSt: ScrollStringStPtr, usX: UINT16, usY: UINT16): void {
  SetStringVideoOverlayPosition(pStringSt, usX, usY);
}

function SetStringColor(pStringSt: ScrollStringStPtr, usColor: UINT16): void {
  pStringSt.value.usColor = usColor;
}

function GetNextString(pStringSt: ScrollStringStPtr): ScrollStringStPtr {
  // returns pointer to next string line
  if (pStringSt == null)
    return null;
  else
    return pStringSt.value.pNext;
}

function GetPrevString(pStringSt: ScrollStringStPtr): ScrollStringStPtr {
  // returns pointer to previous string line
  if (pStringSt == null)
    return null;
  else
    return pStringSt.value.pPrev;
}

function SetStringNext(pStringSt: ScrollStringStPtr, pNext: ScrollStringStPtr): ScrollStringStPtr {
  pStringSt.value.pNext = pNext;
  return pStringSt;
}

function SetStringPrev(pStringSt: ScrollStringStPtr, pPrev: ScrollStringStPtr): ScrollStringStPtr {
  pStringSt.value.pPrev = pPrev;
  return pStringSt;
}

function CreateStringVideoOverlay(pStringSt: ScrollStringStPtr, usX: UINT16, usY: UINT16): boolean {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;

  // SET VIDEO OVERLAY
  VideoOverlayDesc.sLeft = usX;
  VideoOverlayDesc.sTop = usY;
  VideoOverlayDesc.uiFontID = pStringSt.value.uiFont;
  VideoOverlayDesc.ubFontBack = FONT_MCOLOR_BLACK;
  VideoOverlayDesc.ubFontFore = pStringSt.value.usColor;
  VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
  VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
  VideoOverlayDesc.pzText = pStringSt.value.pString16;
  VideoOverlayDesc.BltCallback = BlitString;
  pStringSt.value.iVideoOverlay = RegisterVideoOverlay((VOVERLAY_DIRTYBYTEXT), addressof(VideoOverlayDesc));

  if (pStringSt.value.iVideoOverlay == -1) {
    return false;
  }

  return true;
}

function RemoveStringVideoOverlay(pStringSt: ScrollStringStPtr): void {
  // error check, remove one not there
  if (pStringSt.value.iVideoOverlay == -1) {
    return;
  }

  RemoveVideoOverlay(pStringSt.value.iVideoOverlay);
  pStringSt.value.iVideoOverlay = -1;
}

function SetStringVideoOverlayPosition(pStringSt: ScrollStringStPtr, usX: UINT16, usY: UINT16): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;

  memset(addressof(VideoOverlayDesc), 0, sizeof(VideoOverlayDesc));

  // Donot update if not allocated!
  if (pStringSt.value.iVideoOverlay != -1) {
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_POSITION;
    VideoOverlayDesc.sLeft = usX;
    VideoOverlayDesc.sTop = usY;
    VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
    VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
    UpdateVideoOverlay(addressof(VideoOverlayDesc), pStringSt.value.iVideoOverlay, false);
  }
}

function BlitString(pBlitter: Pointer<VIDEO_OVERLAY>): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;

  // gprintfdirty(pBlitter->sX,pBlitter->sY, pBlitter->zText);
  // RestoreExternBackgroundRect(pBlitter->sX,pBlitter->sY, pBlitter->sX+StringPixLength(pBlitter->zText,pBlitter->uiFontID ), pBlitter->sY+GetFontHeight(pBlitter->uiFontID ));

  if (fScrollMessagesHidden == true) {
    return;
  }

  pDestBuf = LockVideoSurface(pBlitter.value.uiDestBuff, addressof(uiDestPitchBYTES));
  SetFont(pBlitter.value.uiFontID);

  SetFontBackground(pBlitter.value.ubFontBack);
  SetFontForeground(pBlitter.value.ubFontFore);
  SetFontShadow(DEFAULT_SHADOW);
  mprintf_buffer_coded(pDestBuf, uiDestPitchBYTES, pBlitter.value.uiFontID, pBlitter.value.sX, pBlitter.value.sY, pBlitter.value.zText);
  UnLockVideoSurface(pBlitter.value.uiDestBuff);
}

function EnableStringVideoOverlay(pStringSt: ScrollStringStPtr, fEnable: boolean): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;

  memset(addressof(VideoOverlayDesc), 0, sizeof(VideoOverlayDesc));

  if (pStringSt.value.iVideoOverlay != -1) {
    VideoOverlayDesc.fDisabled = !fEnable;
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;
    UpdateVideoOverlay(addressof(VideoOverlayDesc), pStringSt.value.iVideoOverlay, false);
  }
}

export function ClearDisplayedListOfTacticalStrings(): void {
  // this function will go through list of display strings and clear them all out
  let cnt: UINT32;

  for (cnt = 0; cnt < MAX_LINE_COUNT; cnt++) {
    if (gpDisplayList[cnt] != null) {
      // CHECK IF WE HAVE AGED

      // Remove our sorry ass
      RemoveStringVideoOverlay(gpDisplayList[cnt]);
      MemFree(gpDisplayList[cnt].value.pString16);
      MemFree(gpDisplayList[cnt]);

      // Free slot
      gpDisplayList[cnt] = null;
    }
  }

  return;
}

export function ScrollString(): void {
  let pStringSt: ScrollStringStPtr = pStringS;
  let suiTimer: UINT32 = 0;
  let cnt: UINT32;
  let iNumberOfNewStrings: INT32 = 0; // the count of new strings, so we can update position by WIDTH_BETWEEN_NEW_STRINGS pixels in the y
  let iNumberOfMessagesOnQueue: INT32 = 0;
  let iMaxAge: INT32 = 0;
  let fDitchLastMessage: boolean = false;

  // UPDATE TIMER
  suiTimer = GetJA2Clock();

  // might have pop up text timer
  HandleLastQuotePopUpTimer();

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    return;
  }

  // DONOT UPDATE IF WE ARE SCROLLING!
  if (gfScrollPending || gfScrollInertia) {
    return;
  }

  // messages hidden
  if (fScrollMessagesHidden) {
    return;
  }

  iNumberOfMessagesOnQueue = GetMessageQueueSize();
  iMaxAge = MAX_AGE;

  if ((iNumberOfMessagesOnQueue > 0) && (gpDisplayList[MAX_LINE_COUNT - 1] != null)) {
    fDitchLastMessage = true;
  } else {
    fDitchLastMessage = false;
  }

  if ((iNumberOfMessagesOnQueue * 1000) >= iMaxAge) {
    iNumberOfMessagesOnQueue = (iMaxAge / 1000);
  } else if (iNumberOfMessagesOnQueue < 0) {
    iNumberOfMessagesOnQueue = 0;
  }

  // AGE
  for (cnt = 0; cnt < MAX_LINE_COUNT; cnt++) {
    if (gpDisplayList[cnt] != null) {
      if ((fDitchLastMessage) && (cnt == MAX_LINE_COUNT - 1)) {
        gpDisplayList[cnt].value.uiTimeOfLastUpdate = iMaxAge;
      }
      // CHECK IF WE HAVE AGED
      if ((suiTimer - gpDisplayList[cnt].value.uiTimeOfLastUpdate) > (iMaxAge - (1000 * iNumberOfMessagesOnQueue))) {
        // Remove our sorry ass
        RemoveStringVideoOverlay(gpDisplayList[cnt]);
        MemFree(gpDisplayList[cnt].value.pString16);
        MemFree(gpDisplayList[cnt]);

        // Free slot
        gpDisplayList[cnt] = null;
      }
    }
  }

  // CHECK FOR FREE SPOTS AND ADD ANY STRINGS IF WE HAVE SOME TO ADD!

  // FIRST CHECK IF WE HAVE ANY IN OUR QUEUE
  if (pStringS != null) {
    // CHECK IF WE HAVE A SLOT!
    // CHECK OUR LAST SLOT!
    if (gpDisplayList[MAX_LINE_COUNT - 1] == null) {
      // MOVE ALL UP!

      // cpy, then move
      for (cnt = MAX_LINE_COUNT - 1; cnt > 0; cnt--) {
        gpDisplayList[cnt] = gpDisplayList[cnt - 1];
      }

      // now add in the new string
      cnt = 0;
      gpDisplayList[cnt] = pStringS;
      CreateStringVideoOverlay(pStringS, X_START, Y_START);
      if (pStringS.value.fBeginningOfNewString == true) {
        iNumberOfNewStrings++;
      }

      // set up age
      pStringS.value.uiTimeOfLastUpdate = GetJA2Clock();

      // now move
      for (cnt = 0; cnt <= MAX_LINE_COUNT - 1; cnt++) {
        // Adjust position!
        if (gpDisplayList[cnt] != null) {
          SetStringVideoOverlayPosition(gpDisplayList[cnt], X_START, ((Y_START - ((cnt)*GetFontHeight(SMALLFONT1()))) - (WIDTH_BETWEEN_NEW_STRINGS * (iNumberOfNewStrings))));

          // start of new string, increment count of new strings, for spacing purposes
          if (gpDisplayList[cnt].value.fBeginningOfNewString == true) {
            iNumberOfNewStrings++;
          }
        }
      }

      // WE NOW HAVE A FREE SPACE, INSERT!

      // Adjust head!
      pStringS = pStringS.value.pNext;
      if (pStringS) {
        pStringS.value.pPrev = null;
      }

      // check if new meesage we have not seen since mapscreen..if so, beep
      if ((fOkToBeepNewMessage == true) && (gpDisplayList[MAX_LINE_COUNT - 2] == null) && ((guiCurrentScreen == Enum26.GAME_SCREEN) || (guiCurrentScreen == Enum26.MAP_SCREEN)) && (gfFacePanelActive == false)) {
        PlayNewMessageSound();
      }
    }
  }
}

export function DisableScrollMessages(): void {
  // will stop the scroll of messages in tactical and hide them during an NPC's dialogue
  // disble video overlay for tatcitcal scroll messages
  EnableDisableScrollStringVideoOverlay(false);
  return;
}

export function EnableScrollMessages(): void {
  EnableDisableScrollStringVideoOverlay(true);
  return;
}

export function HideMessagesDuringNPCDialogue(): void {
  // will stop the scroll of messages in tactical and hide them during an NPC's dialogue
  let cnt: INT32;

  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;

  memset(addressof(VideoOverlayDesc), 0, sizeof(VideoOverlayDesc));

  VideoOverlayDesc.fDisabled = true;
  VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;

  fScrollMessagesHidden = true;
  uiStartOfPauseTime = GetJA2Clock();

  for (cnt = 0; cnt < MAX_LINE_COUNT; cnt++) {
    if (gpDisplayList[cnt] != null) {
      RestoreExternBackgroundRectGivenID(gVideoOverlays[gpDisplayList[cnt].value.iVideoOverlay].uiBackground);
      UpdateVideoOverlay(addressof(VideoOverlayDesc), gpDisplayList[cnt].value.iVideoOverlay, false);
    }
  }

  return;
}

export function UnHideMessagesDuringNPCDialogue(): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;
  let cnt: INT32 = 0;

  memset(addressof(VideoOverlayDesc), 0, sizeof(VideoOverlayDesc));

  VideoOverlayDesc.fDisabled = false;
  VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;
  fScrollMessagesHidden = false;

  for (cnt = 0; cnt < MAX_LINE_COUNT; cnt++) {
    if (gpDisplayList[cnt] != null) {
      gpDisplayList[cnt].value.uiTimeOfLastUpdate += GetJA2Clock() - uiStartOfPauseTime;
      UpdateVideoOverlay(addressof(VideoOverlayDesc), gpDisplayList[cnt].value.iVideoOverlay, false);
    }
  }

  return;
}

// new screen message
export function ScreenMsg(usColor: UINT16, ubPriority: UINT8, pStringA: string /* STR16 */, ...args: any[]): void {
  let DestString: string /* wchar_t[512] */;
  let argptr: va_list;

  if (fDisableJustForIan == true) {
    if (ubPriority == MSG_BETAVERSION) {
      return;
    } else if (ubPriority == MSG_TESTVERSION) {
      return;
    } else if (ubPriority == MSG_DEBUG) {
      return;
    }
  }

  if (ubPriority == MSG_DEBUG) {
    usColor = DEBUG_COLOR;
    return;
  }

  if (ubPriority == MSG_BETAVERSION) {
    usColor = BETAVERSION_COLOR;
    return;
  }

  if (ubPriority == MSG_TESTVERSION) {
    usColor = TESTVERSION_COLOR;

    return;
  }

  va_start(argptr, pStringA);
  vswprintf(DestString, pStringA, argptr);
  va_end(argptr);

  // pass onto tactical message and mapscreen message
  TacticalScreenMsg(usColor, ubPriority, DestString);

  //	if( ( ubPriority != MSG_DEBUG ) && ( ubPriority != MSG_TESTVERSION ) )
  { MapScreenMessage(usColor, ubPriority, DestString); }

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    PlayNewMessageSound();
  } else {
    fOkToBeepNewMessage = true;
  }

  return;
}

function ClearWrappedStrings(pStringWrapperHead: Pointer<WRAPPED_STRING>): void {
  let pNode: Pointer<WRAPPED_STRING> = pStringWrapperHead;
  let pDeleteNode: Pointer<WRAPPED_STRING> = null;
  // clear out a link list of wrapped string structures

  // error check, is there a node to delete?
  if (pNode == null) {
    // leave,
    return;
  }

  do {
    // set delete node as current node
    pDeleteNode = pNode;

    // set current node as next node
    pNode = pNode.value.pNextWrappedString;

    // delete the string
    MemFree(pDeleteNode.value.sString);
    pDeleteNode.value.sString = null;

    // clear out delete node
    MemFree(pDeleteNode);
    pDeleteNode = null;
  } while (pNode);

  //	MemFree( pNode );

  pStringWrapperHead = null;
}

// new tactical and mapscreen message system
function TacticalScreenMsg(usColor: UINT16, ubPriority: UINT8, pStringA: string /* STR16 */, ...args: any[]): void {
  // this function sets up the string into several single line structures

  let pStringSt: ScrollStringStPtr;
  let uiFont: UINT32 = TINYFONT1();
  let usPosition: UINT16 = 0;
  let usCount: UINT16 = 0;
  let usStringLength: UINT16 = 0;
  let usCurrentSPosition: UINT16 = 0;
  let usCurrentLookup: UINT16 = 0;
  // wchar_t *pString;
  let fLastLine: boolean = false;
  let argptr: va_list;

  let DestString: string /* wchar_t[512] */;
  let DestStringA: string /* wchar_t[512] */;
  // wchar_t *pStringBuffer;
  let fMultiLine: boolean = false;
  let pTempStringSt: ScrollStringStPtr = null;
  let pStringWrapper: Pointer<WRAPPED_STRING> = null;
  let pStringWrapperHead: Pointer<WRAPPED_STRING> = null;
  let fNewString: boolean = false;
  let usLineWidthIfWordIsWiderThenWidth: UINT16 = 0;

  if (giTimeCompressMode > Enum130.TIME_COMPRESS_X1) {
    return;
  }

  if (fDisableJustForIan == true && ubPriority != MSG_ERROR && ubPriority != MSG_INTERFACE) {
    return;
  }

  if (ubPriority == MSG_BETAVERSION) {
    usColor = BETAVERSION_COLOR;
    return;
    WriteMessageToFile(DestString);
  }

  if (ubPriority == MSG_TESTVERSION) {
    usColor = TESTVERSION_COLOR;

    return;

    WriteMessageToFile(DestString);
  }

  if (fFirstTimeInMessageSystem) {
    // Init display array!
    memset(gpDisplayList, 0, sizeof(gpDisplayList));
    fFirstTimeInMessageSystem = false;
    // if(!(InitializeMutex(SCROLL_MESSAGE_MUTEX,"ScrollMessageMutex" )))
    //	return;
  }

  pStringSt = pStringS;
  while (GetNextString(pStringSt))
    pStringSt = GetNextString(pStringSt);

  va_start(argptr, pStringA); // Set up variable argument pointer
  vswprintf(DestString, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);

  if (ubPriority == MSG_DEBUG) {
    return;
    usColor = DEBUG_COLOR;
    DestStringA = DestString;
    DestString = swprintf("Debug: %s", DestStringA);
    WriteMessageToFile(DestStringA);
  }

  if (ubPriority == MSG_DIALOG) {
    usColor = DIALOGUE_COLOR;
  }

  if (ubPriority == MSG_INTERFACE) {
    usColor = INTERFACE_COLOR;
  }

  pStringWrapperHead = LineWrap(uiFont, LINE_WIDTH, addressof(usLineWidthIfWordIsWiderThenWidth), DestString);
  pStringWrapper = pStringWrapperHead;
  if (!pStringWrapper)
    return;

  fNewString = true;
  while (pStringWrapper.value.pNextWrappedString != null) {
    if (!pStringSt) {
      pStringSt = AddString(pStringWrapper.value.sString, usColor, uiFont, fNewString, ubPriority);
      fNewString = false;
      pStringSt.value.pNext = null;
      pStringSt.value.pPrev = null;
      pStringS = pStringSt;
    } else {
      pTempStringSt = AddString(pStringWrapper.value.sString, usColor, uiFont, fNewString, ubPriority);
      fNewString = false;
      pTempStringSt.value.pPrev = pStringSt;
      pStringSt.value.pNext = pTempStringSt;
      pStringSt = pTempStringSt;
      pTempStringSt.value.pNext = null;
    }
    pStringWrapper = pStringWrapper.value.pNextWrappedString;
  }
  pTempStringSt = AddString(pStringWrapper.value.sString, usColor, uiFont, fNewString, ubPriority);
  if (pStringSt) {
    pStringSt.value.pNext = pTempStringSt;
    pTempStringSt.value.pPrev = pStringSt;
    pStringSt = pTempStringSt;
    pStringSt.value.pNext = null;
  } else {
    pStringSt = pTempStringSt;
    pStringSt.value.pNext = null;
    pStringSt.value.pPrev = null;
    pStringS = pStringSt;
  }

  // clear up list of wrapped strings
  ClearWrappedStrings(pStringWrapperHead);

  // LeaveMutex(SCROLL_MESSAGE_MUTEX, __LINE__, __FILE__);
  return;
}

export function MapScreenMessage(usColor: UINT16, ubPriority: UINT8, pStringA: string /* STR16 */, ...args: any[]): void {
  // this function sets up the string into several single line structures

  let pStringSt: ScrollStringStPtr;
  let uiFont: UINT32 = MAP_SCREEN_MESSAGE_FONT();
  let usPosition: UINT16 = 0;
  let usCount: UINT16 = 0;
  let usStringLength: UINT16 = 0;
  let usCurrentSPosition: UINT16 = 0;
  let usCurrentLookup: UINT16 = 0;
  // wchar_t *pString;
  let fLastLine: boolean = false;
  let argptr: va_list;
  let DestString: string /* wchar_t[512] */;
  let DestStringA: string /* wchar_t[512] */;
  // wchar_t *pStringBuffer;
  let fMultiLine: boolean = false;
  let pStringWrapper: Pointer<WRAPPED_STRING> = null;
  let pStringWrapperHead: Pointer<WRAPPED_STRING> = null;
  let fNewString: boolean = false;
  let usLineWidthIfWordIsWiderThenWidth: UINT16;

  if (fDisableJustForIan == true) {
    if (ubPriority == MSG_BETAVERSION) {
      return;
    } else if (ubPriority == MSG_TESTVERSION) {
      return;
    } else if (ubPriority == MSG_DEBUG) {
      return;
    }
  }

  if (ubPriority == MSG_BETAVERSION) {
    usColor = BETAVERSION_COLOR;
    return;

    WriteMessageToFile(DestString);
  }

  if (ubPriority == MSG_TESTVERSION) {
    usColor = TESTVERSION_COLOR;

    return;
    WriteMessageToFile(DestString);
  }
  // OK, check if we are ani imeediate feedback message, if so, do something else!
  if (ubPriority == MSG_UI_FEEDBACK) {
    va_start(argptr, pStringA); // Set up variable argument pointer
    vswprintf(DestString, pStringA, argptr); // process gprintf string (get output str)
    va_end(argptr);

    BeginUIMessage(DestString);
    return;
  }

  if (ubPriority == MSG_SKULL_UI_FEEDBACK) {
    va_start(argptr, pStringA); // Set up variable argument pointer
    vswprintf(DestString, pStringA, argptr); // process gprintf string (get output str)
    va_end(argptr);

    InternalBeginUIMessage(true, DestString);
    return;
  }

  // check if error
  if (ubPriority == MSG_ERROR) {
    va_start(argptr, pStringA); // Set up variable argument pointer
    vswprintf(DestString, pStringA, argptr); // process gprintf string (get output str)
    va_end(argptr);

    DestStringA = swprintf("DEBUG: %s", DestString);

    BeginUIMessage(DestStringA);
    WriteMessageToFile(DestStringA);

    return;
  }

  // OK, check if we are an immediate MAP feedback message, if so, do something else!
  if ((ubPriority == MSG_MAP_UI_POSITION_UPPER) || (ubPriority == MSG_MAP_UI_POSITION_MIDDLE) || (ubPriority == MSG_MAP_UI_POSITION_LOWER)) {
    va_start(argptr, pStringA); // Set up variable argument pointer
    vswprintf(DestString, pStringA, argptr); // process gprintf string (get output str)
    va_end(argptr);

    BeginMapUIMessage(ubPriority, DestString);
    return;
  }

  if (fFirstTimeInMessageSystem) {
    // Init display array!
    memset(gpDisplayList, 0, sizeof(gpDisplayList));
    fFirstTimeInMessageSystem = false;
    // if(!(InitializeMutex(SCROLL_MESSAGE_MUTEX,"ScrollMessageMutex" )))
    //	return;
  }

  pStringSt = pStringS;
  while (GetNextString(pStringSt))
    pStringSt = GetNextString(pStringSt);

  va_start(argptr, pStringA); // Set up variable argument pointer
  vswprintf(DestString, pStringA, argptr); // process gprintf string (get output str)
  va_end(argptr);

  if (ubPriority == MSG_DEBUG) {
    return;
    usColor = DEBUG_COLOR;
    DestStringA = DestString;
    DestString = swprintf("Debug: %s", DestStringA);
  }

  if (ubPriority == MSG_DIALOG) {
    usColor = DIALOGUE_COLOR;
  }

  if (ubPriority == MSG_INTERFACE) {
    usColor = INTERFACE_COLOR;
  }

  pStringWrapperHead = LineWrap(uiFont, MAP_LINE_WIDTH, addressof(usLineWidthIfWordIsWiderThenWidth), DestString);
  pStringWrapper = pStringWrapperHead;
  if (!pStringWrapper)
    return;

  fNewString = true;

  while (pStringWrapper.value.pNextWrappedString != null) {
    AddStringToMapScreenMessageList(pStringWrapper.value.sString, usColor, uiFont, fNewString, ubPriority);
    fNewString = false;

    pStringWrapper = pStringWrapper.value.pNextWrappedString;
  }

  AddStringToMapScreenMessageList(pStringWrapper.value.sString, usColor, uiFont, fNewString, ubPriority);

  // clear up list of wrapped strings
  ClearWrappedStrings(pStringWrapperHead);

  // play new message beep
  // PlayNewMessageSound( );

  MoveToEndOfMapScreenMessageList();

  // LeaveMutex(SCROLL_MESSAGE_MUTEX, __LINE__, __FILE__);
}

// add string to the map screen message list
function AddStringToMapScreenMessageList(pString: string /* STR16 */, usColor: UINT16, uiFont: UINT32, fStartOfNewString: boolean, ubPriority: UINT8): void {
  let ubSlotIndex: UINT8 = 0;
  let pStringSt: ScrollStringStPtr = null;

  pStringSt = MemAlloc(sizeof(ScrollStringSt));

  SetString(pStringSt, pString);
  SetStringColor(pStringSt, usColor);
  pStringSt.value.uiFont = uiFont;
  pStringSt.value.fBeginningOfNewString = fStartOfNewString;
  pStringSt.value.uiFlags = ubPriority;
  pStringSt.value.iVideoOverlay = -1;

  // next/previous are not used, it's strictly a wraparound queue
  SetStringNext(pStringSt, null);
  SetStringPrev(pStringSt, null);

  // Figure out which queue slot index we're going to use to store this
  // If queue isn't full, this is easy, if is is full, we'll re-use the oldest slot
  // Must always keep the wraparound in mind, although this is easy enough with a static, fixed-size queue.

  // always store the new message at the END index

  // check if slot is being used, if so, clear it up
  if (gMapScreenMessageList[gubEndOfMapScreenMessageList] != null) {
    MemFree(gMapScreenMessageList[gubEndOfMapScreenMessageList].value.pString16);
    MemFree(gMapScreenMessageList[gubEndOfMapScreenMessageList]);
  }

  // store the new message there
  gMapScreenMessageList[gubEndOfMapScreenMessageList] = pStringSt;

  // increment the end
  gubEndOfMapScreenMessageList = (gubEndOfMapScreenMessageList + 1) % 256;

  // if queue is full, end will now match the start
  if (gubEndOfMapScreenMessageList == gubStartOfMapScreenMessageList) {
    // if that's so, increment the start
    gubStartOfMapScreenMessageList = (gubStartOfMapScreenMessageList + 1) % 256;
  }
}

export function DisplayStringsInMapScreenMessageList(): void {
  let ubCurrentStringIndex: UINT8;
  let ubLinesPrinted: UINT8;
  let sY: INT16;
  let usSpacing: UINT16;

  SetFontDestBuffer(FRAME_BUFFER, 17, 360 + 6, 407, 360 + 101, false);

  SetFont(MAP_SCREEN_MESSAGE_FONT()); // no longer supports variable fonts
  SetFontBackground(FONT_BLACK);
  SetFontShadow(DEFAULT_SHADOW);

  ubCurrentStringIndex = gubCurrentMapMessageString;

  sY = 377;
  usSpacing = GetFontHeight(MAP_SCREEN_MESSAGE_FONT());

  for (ubLinesPrinted = 0; ubLinesPrinted < MAX_MESSAGES_ON_MAP_BOTTOM; ubLinesPrinted++) {
    // reached the end of the list?
    if (ubCurrentStringIndex == gubEndOfMapScreenMessageList) {
      break;
    }

    // nothing stored there?
    if (gMapScreenMessageList[ubCurrentStringIndex] == null) {
      break;
    }

    // set font color
    SetFontForeground((gMapScreenMessageList[ubCurrentStringIndex].value.usColor));

    // print this line
    mprintf_coded(20, sY, gMapScreenMessageList[ubCurrentStringIndex].value.pString16);

    sY += usSpacing;

    // next message index to print (may wrap around)
    ubCurrentStringIndex = (ubCurrentStringIndex + 1) % 256;
  }

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
}

export function EnableDisableScrollStringVideoOverlay(fEnable: boolean): void {
  // will go through the list of video overlays for the tactical scroll message system, and enable/disable
  // video overlays depending on fEnable
  let bCounter: INT8 = 0;

  for (bCounter = 0; bCounter < MAX_LINE_COUNT; bCounter++) {
    // if valid, enable/disable
    if (gpDisplayList[bCounter] != null) {
      EnableVideoOverlay(fEnable, gpDisplayList[bCounter].value.iVideoOverlay);
    }
  }

  return;
}

function PlayNewMessageSound(): void {
  // play a new message sound, if there is one playing, do nothing
  /* static */ let uiSoundId: UINT32 = NO_SAMPLE;

  if (uiSoundId != NO_SAMPLE) {
    // is sound playing?..don't play new one
    if (SoundIsPlaying(uiSoundId) == true) {
      return;
    }
  }

  // otherwise no sound playing, play one
  uiSoundId = PlayJA2SampleFromFile("Sounds\\newbeep.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

  return;
}

export function SaveMapScreenMessagesToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let uiCount: UINT32;
  let uiSizeOfString: UINT32;
  let StringSave: StringSaveStruct;

  //	write to the begining of the message list
  FileWrite(hFile, addressof(gubEndOfMapScreenMessageList), sizeof(UINT8), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT8)) {
    return false;
  }

  FileWrite(hFile, addressof(gubStartOfMapScreenMessageList), sizeof(UINT8), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT8)) {
    return false;
  }

  //	write the current message string
  FileWrite(hFile, addressof(gubCurrentMapMessageString), sizeof(UINT8), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT8)) {
    return false;
  }

  // Loopthrough all the messages
  for (uiCount = 0; uiCount < 256; uiCount++) {
    if (gMapScreenMessageList[uiCount]) {
      uiSizeOfString = (gMapScreenMessageList[uiCount].value.pString16.length + 1) * 2;
    } else
      uiSizeOfString = 0;

    //	write to the file the size of the message
    FileWrite(hFile, addressof(uiSizeOfString), sizeof(UINT32), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(UINT32)) {
      return false;
    }

    // if there is a message
    if (uiSizeOfString) {
      //	write the message to the file
      FileWrite(hFile, gMapScreenMessageList[uiCount].value.pString16, uiSizeOfString, addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != uiSizeOfString) {
        return false;
      }

      // Create  the saved string struct
      StringSave.uiFont = gMapScreenMessageList[uiCount].value.uiFont;
      StringSave.usColor = gMapScreenMessageList[uiCount].value.usColor;
      StringSave.fBeginningOfNewString = gMapScreenMessageList[uiCount].value.fBeginningOfNewString;
      StringSave.uiTimeOfLastUpdate = gMapScreenMessageList[uiCount].value.uiTimeOfLastUpdate;
      StringSave.uiFlags = gMapScreenMessageList[uiCount].value.uiFlags;

      // Write the rest of the message information to the saved game file
      FileWrite(hFile, addressof(StringSave), sizeof(StringSaveStruct), addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != sizeof(StringSaveStruct)) {
        return false;
      }
    }
  }

  return true;
}

export function LoadMapScreenMessagesFromSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let uiCount: UINT32;
  let uiSizeOfString: UINT32;
  let StringSave: StringSaveStruct;
  let SavedString: string /* CHAR16[512] */;

  // clear tactical message queue
  ClearTacticalMessageQueue();

  gubEndOfMapScreenMessageList = 0;
  gubStartOfMapScreenMessageList = 0;
  gubCurrentMapMessageString = 0;

  //	Read to the begining of the message list
  FileRead(hFile, addressof(gubEndOfMapScreenMessageList), sizeof(UINT8), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT8)) {
    return false;
  }

  //	Read the current message string
  FileRead(hFile, addressof(gubStartOfMapScreenMessageList), sizeof(UINT8), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT8)) {
    return false;
  }

  //	Read the current message string
  FileRead(hFile, addressof(gubCurrentMapMessageString), sizeof(UINT8), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT8)) {
    return false;
  }

  // Loopthrough all the messages
  for (uiCount = 0; uiCount < 256; uiCount++) {
    //	Read to the file the size of the message
    FileRead(hFile, addressof(uiSizeOfString), sizeof(UINT32), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(UINT32)) {
      return false;
    }

    // if there is a message
    if (uiSizeOfString) {
      //	Read the message from the file
      FileRead(hFile, SavedString, uiSizeOfString, addressof(uiNumBytesRead));
      if (uiNumBytesRead != uiSizeOfString) {
        return false;
      }

      // if there is an existing string,delete it
      if (gMapScreenMessageList[uiCount]) {
        if (gMapScreenMessageList[uiCount].value.pString16) {
          MemFree(gMapScreenMessageList[uiCount].value.pString16);
          gMapScreenMessageList[uiCount].value.pString16 = null;
        }
      } else {
        // There is now message here, add one
        let sScroll: Pointer<ScrollStringSt>;

        sScroll = MemAlloc(sizeof(ScrollStringSt));
        if (sScroll == null)
          return false;

        memset(sScroll, 0, sizeof(ScrollStringSt));

        gMapScreenMessageList[uiCount] = sScroll;
      }

      // allocate space for the new string
      gMapScreenMessageList[uiCount].value.pString16 = MemAlloc(uiSizeOfString);
      if (gMapScreenMessageList[uiCount].value.pString16 == null)
        return false;

      memset(gMapScreenMessageList[uiCount].value.pString16, 0, uiSizeOfString);

      // copy the string over
      gMapScreenMessageList[uiCount].value.pString16 = SavedString;

      // Read the rest of the message information to the saved game file
      FileRead(hFile, addressof(StringSave), sizeof(StringSaveStruct), addressof(uiNumBytesRead));
      if (uiNumBytesRead != sizeof(StringSaveStruct)) {
        return false;
      }

      // Create  the saved string struct
      gMapScreenMessageList[uiCount].value.uiFont = StringSave.uiFont;
      gMapScreenMessageList[uiCount].value.usColor = StringSave.usColor;
      gMapScreenMessageList[uiCount].value.uiFlags = StringSave.uiFlags;
      gMapScreenMessageList[uiCount].value.fBeginningOfNewString = StringSave.fBeginningOfNewString;
      gMapScreenMessageList[uiCount].value.uiTimeOfLastUpdate = StringSave.uiTimeOfLastUpdate;
    } else
      gMapScreenMessageList[uiCount] = null;
  }

  // this will set a valid value for gubFirstMapscreenMessageIndex, which isn't being saved/restored
  MoveToEndOfMapScreenMessageList();

  return true;
}

function HandleLastQuotePopUpTimer(): void {
  if ((fTextBoxMouseRegionCreated == false) || (fDialogueBoxDueToLastMessage == false)) {
    return;
  }

  // check if timed out
  if (GetJA2Clock() - guiDialogueLastQuoteTime > guiDialogueLastQuoteDelay) {
    // done clear up
    ShutDownLastQuoteTacticalTextBox();
    guiDialogueLastQuoteTime = 0;
    guiDialogueLastQuoteDelay = 0;
  }
}

function MoveToBeginningOfMessageQueue(): ScrollStringStPtr {
  let pStringSt: ScrollStringStPtr = pStringS;

  if (pStringSt == null) {
    return null;
  }

  while (pStringSt.value.pPrev) {
    pStringSt = pStringSt.value.pPrev;
  }

  return pStringSt;
}

function GetMessageQueueSize(): INT32 {
  let pStringSt: ScrollStringStPtr = pStringS;
  let iCounter: INT32 = 0;

  pStringSt = MoveToBeginningOfMessageQueue();

  while (pStringSt) {
    iCounter++;
    pStringSt = pStringSt.value.pNext;
  }

  return iCounter;
}

export function ClearTacticalMessageQueue(): void {
  let pStringSt: ScrollStringStPtr = pStringS;
  let pOtherStringSt: ScrollStringStPtr = pStringS;

  ClearDisplayedListOfTacticalStrings();

  // now run through all the tactical messages
  while (pStringSt) {
    pOtherStringSt = pStringSt;
    pStringSt = pStringSt.value.pNext;
    MemFree(pOtherStringSt.value.pString16);
    MemFree(pOtherStringSt);
  }

  pStringS = null;

  return;
}

function WriteMessageToFile(pString: string /* STR16 */): void {
}

export function InitGlobalMessageList(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    gMapScreenMessageList[iCounter] = null;
  }

  gubEndOfMapScreenMessageList = 0;
  gubStartOfMapScreenMessageList = 0;
  gubCurrentMapMessageString = 0;
  //	ubTempPosition = 0;

  return;
}

export function FreeGlobalMessageList(): void {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < 256; iCounter++) {
    // check if next unit is empty, if not...clear it up
    if (gMapScreenMessageList[iCounter] != null) {
      MemFree(gMapScreenMessageList[iCounter].value.pString16);
      MemFree(gMapScreenMessageList[iCounter]);
    }
  }

  InitGlobalMessageList();

  return;
}

export function GetRangeOfMapScreenMessages(): UINT8 {
  let ubRange: UINT8 = 0;

  // NOTE: End is non-inclusive, so start/end 0/0 means no messages, 0/1 means 1 message, etc.
  if (gubStartOfMapScreenMessageList <= gubEndOfMapScreenMessageList) {
    ubRange = gubEndOfMapScreenMessageList - gubStartOfMapScreenMessageList;
  } else {
    // this should always be 255 now, since this only happens when queue fills up, and we never remove any messages
    ubRange = (gubEndOfMapScreenMessageList + 256) - gubStartOfMapScreenMessageList;
  }

  return ubRange;
}

/*
BOOLEAN IsThereAnEmptySlotInTheMapScreenMessageList( void )
{
        // find if there is an empty slot

        if( gMapScreenMessageList[ ( UINT8 )( gubEndOfMapScreenMessageList + 1 ) ] != NULL )
        {
                return ( FALSE );
        }
        else
        {
                return( TRUE );
        }
}


UINT8 GetFirstEmptySlotInTheMapScreenMessageList( void )
{
        UINT8 ubSlotId = 0;

        // find first empty slot in list

        if( IsThereAnEmptySlotInTheMapScreenMessageList(  ) == FALSE)
        {
                ubSlotId = gubEndOfMapScreenMessageList;
                return( ubSlotId );
        }
        else
        {
                // start at head of list
                ubSlotId = gubEndOfMapScreenMessageList;

                // run through list
                while( gMapScreenMessageList[ ubSlotId ] != NULL )
                {
                        ubSlotId++;
                }

        }
        return( ubSlotId );
}



void SetCurrentMapScreenMessageString( UINT8 ubCurrentStringPosition )
{
        // will attempt to set current string to this value, or the closest one
  UINT8 ubCounter = 0;

        if( gMapScreenMessageList[ ubCurrentStringPosition ] == NULL )
        {
                // no message here, run down to nearest
                ubCounter = ubCurrentStringPosition;
                ubCounter--;

                while(  ( gMapScreenMessageList[ ubCounter ] == NULL )&&( ubCounter != ubCurrentStringPosition ) )
                {
                        if( ubCounter == 0 )
                        {
                                ubCounter = 255;
                        }
                        else
                        {
                                ubCounter--;
                        }
                }

                ubCurrentStringPosition = ubCounter;

        }
        return;
}


UINT8 GetTheRelativePositionOfCurrentMessage( void )
{
        UINT8 ubPosition = 0;

        if( gubEndOfMapScreenMessageList > gubStartOfMapScreenMessageList)
        {
                ubPosition = gubCurrentMapMessageString - gubStartOfMapScreenMessageList;
        }
        else
        {
                ubPosition = ( 255 - gubStartOfMapScreenMessageList ) + gubCurrentMapMessageString;
        }


        return( ubPosition );
}




void MoveCurrentMessagePointerDownList( void )
{
        // check to see if we can move 'down' to newer messages?
        if( gMapScreenMessageList[ ( UINT8 )( gubCurrentMapMessageString  + 1 )  ] != NULL )
        {
                if(  ( UINT8 ) ( gubCurrentMapMessageString + 1 ) != gubEndOfMapScreenMessageList )
                {
                        if( ( AreThereASetOfStringsAfterThisIndex( gubCurrentMapMessageString, MAX_MESSAGES_ON_MAP_BOTTOM ) == TRUE ) )
                        {
                                gubCurrentMapMessageString++;
                        }
                }
        }
}


void MoveCurrentMessagePointerUpList(void )
{
                // check to see if we can move 'down' to newer messages?
        if( gMapScreenMessageList[ ( UINT8 )( gubCurrentMapMessageString  - 1 )  ] != NULL )
        {
                if( ( UINT8 ) ( gubCurrentMapMessageString - 1 ) != gubEndOfMapScreenMessageList )
                {
                        gubCurrentMapMessageString--;
                }
        }

}



void ScrollToHereInMapScreenMessageList( UINT8 ubPosition )
{
        // a position ranging from 0 to 255 where 0 is top and 255 is bottom
        // get the range of messages, * ubPosition /255 and set current to this position
        UINT8 ubTestPosition = gubCurrentMapMessageString;
        UINT8 ubRange = 0;

        ubRange = GetRangeOfMapScreenMessages( );

        if( ubRange > 1 )
        {
                ubRange += 9;
        }

        ubTestPosition = ( UINT8 )( gubEndOfMapScreenMessageList - ( UINT8 )(  ubRange  ) + (  ( ( UINT8 )( ubRange )  * ubPosition ) / 256 ) );

        if( AreThereASetOfStringsAfterThisIndex( ubTestPosition, MAX_MESSAGES_ON_MAP_BOTTOM ) == TRUE )
        {
                gubCurrentMapMessageString = ubTestPosition;
        }

        ubTempPosition = ubTestPosition;

        return;
}


BOOLEAN AreThereASetOfStringsAfterThisIndex( UINT8 ubMsgIndex, INT32 iNumberOfStrings )
{
        INT32 iCounter;

        // go through this number of strings, if they pass, then we have at least iNumberOfStrings after index ubMsgIndex
        for( iCounter = 0; iCounter < iNumberOfStrings; iCounter++ )
        {
                // start checking AFTER this index, so skip ahead to the next index BEFORE checking
                if( ubMsgIndex < 255 )
                {
                        ubMsgIndex++;
                }
                else
                {
                        ubMsgIndex = 0;
                }

                if( gMapScreenMessageList[ ubMsgIndex ] == NULL )
                {
                        return ( FALSE );
                }

                if( ubMsgIndex == gubEndOfMapScreenMessageList )
                {
                        return( FALSE );
                }
        }

        return( TRUE );
}



UINT8 GetCurrentMessageValue( void )
{
        // return the value of the current message in the list, relative to the start of the list

        if( GetRangeOfMapScreenMessages( ) >= 255  )
        {
          return( gubCurrentMapMessageString - gubStartOfMapScreenMessageList );
        }
        else
        {
                return( gubCurrentMapMessageString );
        }
}



UINT8 GetCurrentTempMessageValue( void )
{
        if( GetRangeOfMapScreenMessages( ) >= 255  )
        {
                return( ubTempPosition - gubEndOfMapScreenMessageList );
        }
        else
        {
                return( ubTempPosition );
        }
}


UINT8 GetNewMessageValueGivenPosition( UINT8 ubPosition )
{
        // if we were to scroll to this position, what would current message index value be?

        return( ( UINT8 )( ( gubEndOfMapScreenMessageList - ( UINT8 )( GetRangeOfMapScreenMessages( ) ) ) + ( UINT8 )( ( GetRangeOfMapScreenMessages( ) * ubPosition ) / 255 ) ) );

}


BOOLEAN IsThisTheLastMessageInTheList( void )
{
        // is the current message the last message in the list?

        if( ( ( UINT8 )( gubCurrentMapMessageString + 1 ) ) == ( gubEndOfMapScreenMessageList ) && ( GetRangeOfMapScreenMessages( ) < 255 ) )
        {
                return( TRUE );
        }
        else if( gMapScreenMessageList[ ( UINT8 )( gubCurrentMapMessageString + 1 ) ] == NULL )
        {
                return( TRUE );
        }
        else
        {
                if( AreThereASetOfStringsAfterThisIndex( gubCurrentMapMessageString, MAX_MESSAGES_ON_MAP_BOTTOM ) == FALSE )
                {
                        return( TRUE );
                }
                else
                {
                        return ( FALSE );
                }
        }
}


BOOLEAN IsThisTheFirstMessageInTheList( void )
{
        // is the current message the first message in the list?

        if( ( gubCurrentMapMessageString ) == ( gubEndOfMapScreenMessageList ) )
        {
                return( TRUE );
        }
        else
        {
                return ( FALSE );
        }
}


void DisplayLastMessage( void )
{
        // start at end of list go back until message flag says dialogue
        UINT8 ubCounter = 0;
        BOOLEAN fNotDone = TRUE;
        BOOLEAN fFound = FALSE;
        BOOLEAN fSecondNewString = FALSE;
        CHAR16 sString[ 256 ];

        sString[ 0 ] = 0;


        // set counter to end of list
        while( ( gMapScreenMessageList[ ( UINT8 )( ubCounter  + 1 )  ] != NULL ) && ( ( UINT8 ) ( ubCounter + 1 ) != gubEndOfMapScreenMessageList ) )
        {
                ubCounter++;
        }

        // now start moving back until dialogue is found
        while( fNotDone )
        {
                if( ubCounter == gubEndOfMapScreenMessageList )
                {
                        fNotDone = FALSE;
                        fFound = FALSE;
                        continue;
                }

                if( gMapScreenMessageList[ ubCounter ] == NULL )
                {
                        fNotDone = FALSE;
                        fFound = FALSE;
                        continue;
                }
                // check if message if dialogue
                if( gMapScreenMessageList[ ubCounter ]->uiFlags == MSG_DIALOG )
                {
                        if( gMapScreenMessageList[ ubCounter ]-> fBeginningOfNewString == TRUE )
                        {
                                // yup
                                fNotDone = FALSE;
                                fFound = TRUE;

                                // now display message
                                continue;
                        }
                }

                ubCounter--;
        }

        if( fFound == TRUE )
        {
                fNotDone = TRUE;

                while( fNotDone )
                {
                        if( gMapScreenMessageList[ ubCounter ] )
                        {
                                if( ( fSecondNewString ) && ( gMapScreenMessageList[ ubCounter ] ->  fBeginningOfNewString ) )
                                {
                                        fNotDone = FALSE;
                                }
                                else if( gMapScreenMessageList[ ubCounter ]->uiFlags == MSG_DIALOG )
                                {
                                        wcscat( sString, gMapScreenMessageList[ ubCounter ]->pString16 );
                                        wcscat( sString, L" " );
                                }

                                if( ( gMapScreenMessageList[ ubCounter ] ->  fBeginningOfNewString ) )
                                {
                                        fSecondNewString = TRUE;
                                }

                        }
                        else
                        {
                                fNotDone = FALSE;
                        }

                        // the next string
                        ubCounter++;
                }
                // execute text box
                ExecuteTacticalTextBoxForLastQuote( ( INT16 )( ( 640 - gusSubtitleBoxWidth ) / 2 ),  sString );
        }

        return;
}

*/

}
