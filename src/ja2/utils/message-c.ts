namespace ja2 {

interface StringSaveStruct {
  uiFont: UINT32;
  uiTimeOfLastUpdate: UINT32;
  uiFlags: UINT32;
  uiPadding: UINT32[] /* [3] */;
  usColor: UINT16;
  fBeginningOfNewString: boolean;
}

function createStringSaveStruct(): StringSaveStruct {
  return {
    uiFont: 0,
    uiTimeOfLastUpdate: 0,
    uiFlags: 0,
    uiPadding: createArray(3, 0),
    usColor: 0,
    fBeginningOfNewString: false,
  };
}

const STRING_SAVE_STRUCT_SIZE = 28;

function readStringSaveStruct(o: StringSaveStruct, buffer: Buffer, offset: number = 0): number {
  o.uiFont = buffer.readUInt32LE(offset); offset += 4;
  o.uiTimeOfLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  offset = readUIntArray(o.uiPadding, buffer, offset, 4);
  o.usColor = buffer.readUInt16LE(offset); offset += 2;
  o.fBeginningOfNewString = Boolean(buffer.readUInt32LE(offset));
  offset++; // padding
  return offset;
}

function writeStringSaveStruct(o: StringSaveStruct, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiFont, offset);
  offset = buffer.writeUInt32LE(o.uiTimeOfLastUpdate, offset);
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = writeUIntArray(o.uiPadding, buffer, offset, 4);
  offset = buffer.writeUInt16LE(o.usColor, offset);
  offset = buffer.writeUInt8(Number(o.fBeginningOfNewString), offset);
  buffer.fill(0, offset, offset + 1); offset++; // padding
  return offset;
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

/* static */ let gpDisplayList: ScrollStringSt[] /* ScrollStringStPtr[MAX_LINE_COUNT] */ = createArray(MAX_LINE_COUNT, <ScrollStringSt><unknown>null);
/* static */ let gMapScreenMessageList: ScrollStringSt[] /* ScrollStringStPtr[256] */ = createArray(256, <ScrollStringSt><unknown>null);
/* static */ let pStringS: ScrollStringSt | null = null;

// first time adding any message to the message dialogue system
let fFirstTimeInMessageSystem: boolean = true;
let fDisableJustForIan: boolean = false;

let fScrollMessagesHidden: boolean = false;
let uiStartOfPauseTime: UINT32 = 0;

// prototypes

// functions

function SetStringFont(pStringSt: ScrollStringSt, uiFont: UINT32): void {
  pStringSt.uiFont = uiFont;
}

function GetStringFont(pStringSt: ScrollStringSt): UINT32 {
  return pStringSt.uiFont;
}

function AddString(pString: string /* STR16 */, usColor: UINT16, uiFont: UINT32, fStartOfNewString: boolean, ubPriority: UINT8): ScrollStringSt {
  // add a new string to the list of strings
  let pStringSt: ScrollStringSt = createScrollStringSt();

  SetString(pStringSt, pString);
  SetStringColor(pStringSt, usColor);
  pStringSt.uiFont = uiFont;
  pStringSt.fBeginningOfNewString = fStartOfNewString;
  pStringSt.uiFlags = ubPriority;

  SetStringNext(pStringSt, null);
  SetStringPrev(pStringSt, null);
  pStringSt.iVideoOverlay = -1;

  // now add string to map screen strings
  // AddStringToMapScreenMessageList(pString, usColor, uiFont, fStartOfNewString, ubPriority );

  return pStringSt;
}

function SetString(pStringSt: ScrollStringSt, pString: string /* STR16 */): void {
  pStringSt.pString16 = pString;
}

function SetStringPosition(pStringSt: ScrollStringSt, usX: UINT16, usY: UINT16): void {
  SetStringVideoOverlayPosition(pStringSt, usX, usY);
}

function SetStringColor(pStringSt: ScrollStringSt, usColor: UINT16): void {
  pStringSt.usColor = usColor;
}

function GetNextString(pStringSt: ScrollStringSt | null): ScrollStringSt | null {
  // returns pointer to next string line
  if (pStringSt == null)
    return null;
  else
    return pStringSt.pNext;
}

function GetPrevString(pStringSt: ScrollStringSt): ScrollStringSt | null {
  // returns pointer to previous string line
  if (pStringSt == null)
    return null;
  else
    return pStringSt.pPrev;
}

function SetStringNext(pStringSt: ScrollStringSt, pNext: ScrollStringSt | null): ScrollStringSt {
  pStringSt.pNext = pNext;
  return pStringSt;
}

function SetStringPrev(pStringSt: ScrollStringSt, pPrev: ScrollStringSt | null): ScrollStringSt {
  pStringSt.pPrev = pPrev;
  return pStringSt;
}

function CreateStringVideoOverlay(pStringSt: ScrollStringSt, usX: UINT16, usY: UINT16): boolean {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  // SET VIDEO OVERLAY
  VideoOverlayDesc.sLeft = usX;
  VideoOverlayDesc.sTop = usY;
  VideoOverlayDesc.uiFontID = pStringSt.uiFont;
  VideoOverlayDesc.ubFontBack = FONT_MCOLOR_BLACK;
  VideoOverlayDesc.ubFontFore = pStringSt.usColor;
  VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
  VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
  VideoOverlayDesc.pzText = pStringSt.pString16;
  VideoOverlayDesc.BltCallback = BlitString;
  pStringSt.iVideoOverlay = RegisterVideoOverlay((VOVERLAY_DIRTYBYTEXT), VideoOverlayDesc);

  if (pStringSt.iVideoOverlay == -1) {
    return false;
  }

  return true;
}

function RemoveStringVideoOverlay(pStringSt: ScrollStringSt): void {
  // error check, remove one not there
  if (pStringSt.iVideoOverlay == -1) {
    return;
  }

  RemoveVideoOverlay(pStringSt.iVideoOverlay);
  pStringSt.iVideoOverlay = -1;
}

function SetStringVideoOverlayPosition(pStringSt: ScrollStringSt, usX: UINT16, usY: UINT16): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  // Donot update if not allocated!
  if (pStringSt.iVideoOverlay != -1) {
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_POSITION;
    VideoOverlayDesc.sLeft = usX;
    VideoOverlayDesc.sTop = usY;
    VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
    VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
    UpdateVideoOverlay(VideoOverlayDesc, pStringSt.iVideoOverlay, false);
  }
}

function BlitString(pBlitter: VIDEO_OVERLAY): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;

  // gprintfdirty(pBlitter->sX,pBlitter->sY, pBlitter->zText);
  // RestoreExternBackgroundRect(pBlitter->sX,pBlitter->sY, pBlitter->sX+StringPixLength(pBlitter->zText,pBlitter->uiFontID ), pBlitter->sY+GetFontHeight(pBlitter->uiFontID ));

  if (fScrollMessagesHidden == true) {
    return;
  }

  pDestBuf = LockVideoSurface(pBlitter.uiDestBuff, addressof(uiDestPitchBYTES));
  SetFont(pBlitter.uiFontID);

  SetFontBackground(pBlitter.ubFontBack);
  SetFontForeground(pBlitter.ubFontFore);
  SetFontShadow(DEFAULT_SHADOW);
  mprintf_buffer_coded(pDestBuf, uiDestPitchBYTES, pBlitter.uiFontID, pBlitter.sX, pBlitter.sY, pBlitter.zText);
  UnLockVideoSurface(pBlitter.uiDestBuff);
}

function EnableStringVideoOverlay(pStringSt: ScrollStringSt, fEnable: boolean): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  if (pStringSt.iVideoOverlay != -1) {
    VideoOverlayDesc.fDisabled = !fEnable;
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;
    UpdateVideoOverlay(VideoOverlayDesc, pStringSt.iVideoOverlay, false);
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
      MemFree(gpDisplayList[cnt].pString16);
      MemFree(gpDisplayList[cnt]);

      // Free slot
      gpDisplayList[cnt] = <ScrollStringSt><unknown>null;
    }
  }

  return;
}

export function ScrollString(): void {
  let pStringSt: ScrollStringSt | null = pStringS;
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
        gpDisplayList[cnt].uiTimeOfLastUpdate = iMaxAge;
      }
      // CHECK IF WE HAVE AGED
      if ((suiTimer - gpDisplayList[cnt].uiTimeOfLastUpdate) > (iMaxAge - (1000 * iNumberOfMessagesOnQueue))) {
        // Remove our sorry ass
        RemoveStringVideoOverlay(gpDisplayList[cnt]);
        MemFree(gpDisplayList[cnt].pString16);
        MemFree(gpDisplayList[cnt]);

        // Free slot
        gpDisplayList[cnt] = <ScrollStringSt><unknown>null;
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
      if (pStringS.fBeginningOfNewString == true) {
        iNumberOfNewStrings++;
      }

      // set up age
      pStringS.uiTimeOfLastUpdate = GetJA2Clock();

      // now move
      for (cnt = 0; cnt <= MAX_LINE_COUNT - 1; cnt++) {
        // Adjust position!
        if (gpDisplayList[cnt] != null) {
          SetStringVideoOverlayPosition(gpDisplayList[cnt], X_START, ((Y_START - ((cnt)*GetFontHeight(SMALLFONT1()))) - (WIDTH_BETWEEN_NEW_STRINGS * (iNumberOfNewStrings))));

          // start of new string, increment count of new strings, for spacing purposes
          if (gpDisplayList[cnt].fBeginningOfNewString == true) {
            iNumberOfNewStrings++;
          }
        }
      }

      // WE NOW HAVE A FREE SPACE, INSERT!

      // Adjust head!
      pStringS = pStringS.pNext;
      if (pStringS) {
        pStringS.pPrev = null;
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

  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  VideoOverlayDesc.fDisabled = true;
  VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;

  fScrollMessagesHidden = true;
  uiStartOfPauseTime = GetJA2Clock();

  for (cnt = 0; cnt < MAX_LINE_COUNT; cnt++) {
    if (gpDisplayList[cnt] != null) {
      RestoreExternBackgroundRectGivenID(gVideoOverlays[gpDisplayList[cnt].iVideoOverlay].uiBackground);
      UpdateVideoOverlay(VideoOverlayDesc, gpDisplayList[cnt].iVideoOverlay, false);
    }
  }

  return;
}

export function UnHideMessagesDuringNPCDialogue(): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();
  let cnt: INT32 = 0;

  VideoOverlayDesc.fDisabled = false;
  VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;
  fScrollMessagesHidden = false;

  for (cnt = 0; cnt < MAX_LINE_COUNT; cnt++) {
    if (gpDisplayList[cnt] != null) {
      gpDisplayList[cnt].uiTimeOfLastUpdate += GetJA2Clock() - uiStartOfPauseTime;
      UpdateVideoOverlay(VideoOverlayDesc, gpDisplayList[cnt].iVideoOverlay, false);
    }
  }

  return;
}

// new screen message
export function ScreenMsg(usColor: UINT16, ubPriority: UINT8, pStringA: string /* STR16 */, ...args: any[]): void {
  let DestString: string /* wchar_t[512] */;

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

  DestString = swprintf(pStringA, ...args);

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

function ClearWrappedStrings(pStringWrapperHead: WRAPPED_STRING | null): void {
  let pNode: WRAPPED_STRING | null = pStringWrapperHead;
  let pDeleteNode: WRAPPED_STRING | null = null;
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
    pNode = pNode.pNextWrappedString;

    // delete the string
    pDeleteNode.sString = '';

    // clear out delete node
    pDeleteNode = null;
  } while (pNode);

  //	MemFree( pNode );

  pStringWrapperHead = null;
}

// new tactical and mapscreen message system
function TacticalScreenMsg(usColor: UINT16, ubPriority: UINT8, pStringA: string /* STR16 */, ...args: any[]): void {
  // this function sets up the string into several single line structures

  let pStringSt: ScrollStringSt | null;
  let uiFont: UINT32 = TINYFONT1();
  let usPosition: UINT16 = 0;
  let usCount: UINT16 = 0;
  let usStringLength: UINT16 = 0;
  let usCurrentSPosition: UINT16 = 0;
  let usCurrentLookup: UINT16 = 0;
  // wchar_t *pString;
  let fLastLine: boolean = false;

  let DestString: string /* wchar_t[512] */;
  let DestStringA: string /* wchar_t[512] */;
  // wchar_t *pStringBuffer;
  let fMultiLine: boolean = false;
  let pTempStringSt: ScrollStringSt;
  let pStringWrapper: WRAPPED_STRING | null = null;
  let pStringWrapperHead: WRAPPED_STRING | null = null;
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
    gpDisplayList.fill(<ScrollStringSt><unknown>null);
    fFirstTimeInMessageSystem = false;
    // if(!(InitializeMutex(SCROLL_MESSAGE_MUTEX,"ScrollMessageMutex" )))
    //	return;
  }

  pStringSt = pStringS;
  while (GetNextString(pStringSt))
    pStringSt = GetNextString(pStringSt);

  DestString = swprintf(pStringA, ...args); // process gprintf string (get output str)

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

  pStringWrapperHead = LineWrap(uiFont, LINE_WIDTH, createPointer(() => usLineWidthIfWordIsWiderThenWidth, (v) => usLineWidthIfWordIsWiderThenWidth = v), DestString);
  pStringWrapper = pStringWrapperHead;
  if (!pStringWrapper)
    return;

  fNewString = true;
  while (pStringWrapper.pNextWrappedString != null) {
    if (!pStringSt) {
      pStringSt = AddString(pStringWrapper.sString, usColor, uiFont, fNewString, ubPriority);
      fNewString = false;
      pStringSt.pNext = null;
      pStringSt.pPrev = null;
      pStringS = pStringSt;
    } else {
      pTempStringSt = AddString(pStringWrapper.sString, usColor, uiFont, fNewString, ubPriority);
      fNewString = false;
      pTempStringSt.pPrev = pStringSt;
      pStringSt.pNext = pTempStringSt;
      pStringSt = pTempStringSt;
      pTempStringSt.pNext = null;
    }
    pStringWrapper = pStringWrapper.pNextWrappedString;
  }
  pTempStringSt = AddString(pStringWrapper.sString, usColor, uiFont, fNewString, ubPriority);
  if (pStringSt) {
    pStringSt.pNext = pTempStringSt;
    pTempStringSt.pPrev = pStringSt;
    pStringSt = pTempStringSt;
    pStringSt.pNext = null;
  } else {
    pStringSt = pTempStringSt;
    pStringSt.pNext = null;
    pStringSt.pPrev = null;
    pStringS = pStringSt;
  }

  // clear up list of wrapped strings
  ClearWrappedStrings(pStringWrapperHead);

  // LeaveMutex(SCROLL_MESSAGE_MUTEX, __LINE__, __FILE__);
  return;
}

export function MapScreenMessage(usColor: UINT16, ubPriority: UINT8, pStringA: string /* STR16 */, ...args: any[]): void {
  // this function sets up the string into several single line structures

  let pStringSt: ScrollStringSt | null;
  let uiFont: UINT32 = MAP_SCREEN_MESSAGE_FONT();
  let usPosition: UINT16 = 0;
  let usCount: UINT16 = 0;
  let usStringLength: UINT16 = 0;
  let usCurrentSPosition: UINT16 = 0;
  let usCurrentLookup: UINT16 = 0;
  // wchar_t *pString;
  let fLastLine: boolean = false;
  let DestString: string /* wchar_t[512] */;
  let DestStringA: string /* wchar_t[512] */;
  // wchar_t *pStringBuffer;
  let fMultiLine: boolean = false;
  let pStringWrapper: WRAPPED_STRING | null = null;
  let pStringWrapperHead: WRAPPED_STRING | null = null;
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
    DestString = swprintf(pStringA, ...args); // process gprintf string (get output str)

    BeginUIMessage(DestString);
    return;
  }

  if (ubPriority == MSG_SKULL_UI_FEEDBACK) {
    DestString = swprintf(pStringA, ...args); // process gprintf string (get output str)

    InternalBeginUIMessage(true, DestString);
    return;
  }

  // check if error
  if (ubPriority == MSG_ERROR) {
    DestString = swprintf(pStringA, ...args); // process gprintf string (get output str)

    DestStringA = swprintf("DEBUG: %s", DestString);

    BeginUIMessage(DestStringA);
    WriteMessageToFile(DestStringA);

    return;
  }

  // OK, check if we are an immediate MAP feedback message, if so, do something else!
  if ((ubPriority == MSG_MAP_UI_POSITION_UPPER) || (ubPriority == MSG_MAP_UI_POSITION_MIDDLE) || (ubPriority == MSG_MAP_UI_POSITION_LOWER)) {
    DestString = swprintf(pStringA, ...args); // process gprintf string (get output str)

    BeginMapUIMessage(ubPriority, DestString);
    return;
  }

  if (fFirstTimeInMessageSystem) {
    // Init display array!
    gpDisplayList.fill(<ScrollStringSt><unknown>null);
    fFirstTimeInMessageSystem = false;
    // if(!(InitializeMutex(SCROLL_MESSAGE_MUTEX,"ScrollMessageMutex" )))
    //	return;
  }

  pStringSt = pStringS;
  while (GetNextString(pStringSt))
    pStringSt = GetNextString(pStringSt);

  DestString = swprintf(pStringA, ...args); // process gprintf string (get output str)

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

  pStringWrapperHead = LineWrap(uiFont, MAP_LINE_WIDTH, createPointer(() => usLineWidthIfWordIsWiderThenWidth, (v) => usLineWidthIfWordIsWiderThenWidth = v), DestString);
  pStringWrapper = pStringWrapperHead;
  if (!pStringWrapper)
    return;

  fNewString = true;

  while (pStringWrapper.pNextWrappedString != null) {
    AddStringToMapScreenMessageList(pStringWrapper.sString, usColor, uiFont, fNewString, ubPriority);
    fNewString = false;

    pStringWrapper = pStringWrapper.pNextWrappedString;
  }

  AddStringToMapScreenMessageList(pStringWrapper.sString, usColor, uiFont, fNewString, ubPriority);

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
  let pStringSt: ScrollStringSt;

  pStringSt = createScrollStringSt();

  SetString(pStringSt, pString);
  SetStringColor(pStringSt, usColor);
  pStringSt.uiFont = uiFont;
  pStringSt.fBeginningOfNewString = fStartOfNewString;
  pStringSt.uiFlags = ubPriority;
  pStringSt.iVideoOverlay = -1;

  // next/previous are not used, it's strictly a wraparound queue
  SetStringNext(pStringSt, null);
  SetStringPrev(pStringSt, null);

  // Figure out which queue slot index we're going to use to store this
  // If queue isn't full, this is easy, if is is full, we'll re-use the oldest slot
  // Must always keep the wraparound in mind, although this is easy enough with a static, fixed-size queue.

  // always store the new message at the END index

  // check if slot is being used, if so, clear it up
  if (gMapScreenMessageList[gubEndOfMapScreenMessageList] != null) {
    MemFree(gMapScreenMessageList[gubEndOfMapScreenMessageList].pString16);
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
    SetFontForeground((gMapScreenMessageList[ubCurrentStringIndex].usColor));

    // print this line
    mprintf_coded(20, sY, gMapScreenMessageList[ubCurrentStringIndex].pString16);

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
      EnableVideoOverlay(fEnable, gpDisplayList[bCounter].iVideoOverlay);
    }
  }

  return;
}

/* static */ let PlayNewMessageSound__uiSoundId: UINT32 = NO_SAMPLE;
function PlayNewMessageSound(): void {
  // play a new message sound, if there is one playing, do nothing

  if (PlayNewMessageSound__uiSoundId != NO_SAMPLE) {
    // is sound playing?..don't play new one
    if (SoundIsPlaying(PlayNewMessageSound__uiSoundId) == true) {
      return;
    }
  }

  // otherwise no sound playing, play one
  PlayNewMessageSound__uiSoundId = PlayJA2SampleFromFile("Sounds\\newbeep.wav", RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

  return;
}

export function SaveMapScreenMessagesToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let uiCount: UINT32;
  let uiSizeOfString: UINT32;
  let StringSave: StringSaveStruct = createStringSaveStruct();
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(1);

  //	write to the begining of the message list
  buffer.writeUInt8(gubEndOfMapScreenMessageList, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    return false;
  }

  buffer.writeUInt8(gubStartOfMapScreenMessageList, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    return false;
  }

  //	write the current message string
  buffer.writeUInt8(gubCurrentMapMessageString, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    return false;
  }

  // Loopthrough all the messages
  for (uiCount = 0; uiCount < 256; uiCount++) {
    if (gMapScreenMessageList[uiCount]) {
      uiSizeOfString = (gMapScreenMessageList[uiCount].pString16.length + 1) * 2;
    } else
      uiSizeOfString = 0;

    //	write to the file the size of the message
    buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32LE(uiSizeOfString, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) {
      return false;
    }

    // if there is a message
    if (uiSizeOfString) {
      //	write the message to the file
      buffer = Buffer.allocUnsafe(uiSizeOfString);
      writeStringNL(gMapScreenMessageList[uiCount].pString16, buffer, 0, uiSizeOfString, 'utf16le');
      uiNumBytesWritten = FileWrite(hFile, buffer, uiSizeOfString);
      if (uiNumBytesWritten != uiSizeOfString) {
        return false;
      }

      // Create  the saved string struct
      StringSave.uiFont = gMapScreenMessageList[uiCount].uiFont;
      StringSave.usColor = gMapScreenMessageList[uiCount].usColor;
      StringSave.fBeginningOfNewString = gMapScreenMessageList[uiCount].fBeginningOfNewString;
      StringSave.uiTimeOfLastUpdate = gMapScreenMessageList[uiCount].uiTimeOfLastUpdate;
      StringSave.uiFlags = gMapScreenMessageList[uiCount].uiFlags;

      // Write the rest of the message information to the saved game file
      buffer = Buffer.allocUnsafe(STRING_SAVE_STRUCT_SIZE);
      writeStringSaveStruct(StringSave, buffer);
      uiNumBytesWritten = FileWrite(hFile, buffer, STRING_SAVE_STRUCT_SIZE);
      if (uiNumBytesWritten != STRING_SAVE_STRUCT_SIZE) {
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
  let StringSave: StringSaveStruct = createStringSaveStruct();
  let SavedString: string /* CHAR16[512] */;
  let buffer: Buffer;

  // clear tactical message queue
  ClearTacticalMessageQueue();

  gubEndOfMapScreenMessageList = 0;
  gubStartOfMapScreenMessageList = 0;
  gubCurrentMapMessageString = 0;

  buffer = Buffer.allocUnsafe(1);

  //	Read to the begining of the message list
  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    return false;
  }

  gubEndOfMapScreenMessageList = buffer.readUInt8(0);

  //	Read the current message string
  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    return false;
  }

  gubStartOfMapScreenMessageList = buffer.readUInt8(0);

  //	Read the current message string
  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    return false;
  }

  gubCurrentMapMessageString = buffer.readUInt8(0);

  // Loopthrough all the messages
  for (uiCount = 0; uiCount < 256; uiCount++) {
    //	Read to the file the size of the message
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      return false;
    }

    uiSizeOfString = buffer.readUInt32LE(0);

    // if there is a message
    if (uiSizeOfString) {
      //	Read the message from the file
      buffer = Buffer.allocUnsafe(uiSizeOfString);
      uiNumBytesRead = FileRead(hFile, buffer, uiSizeOfString);
      if (uiNumBytesRead != uiSizeOfString) {
        return false;
      }

      SavedString = readStringNL(buffer, 'utf16le', 0, uiSizeOfString);

      // if there is an existing string,delete it
      if (gMapScreenMessageList[uiCount]) {
        if (gMapScreenMessageList[uiCount].pString16) {
          gMapScreenMessageList[uiCount].pString16 = '';
        }
      } else {
        // There is now message here, add one
        let sScroll: ScrollStringSt = createScrollStringSt();

        gMapScreenMessageList[uiCount] = sScroll;
      }

      // copy the string over
      gMapScreenMessageList[uiCount].pString16 = SavedString;

      // Read the rest of the message information to the saved game file
      buffer = Buffer.allocUnsafe(STRING_SAVE_STRUCT_SIZE);
      uiNumBytesRead = FileRead(hFile, buffer, STRING_SAVE_STRUCT_SIZE);
      if (uiNumBytesRead != STRING_SAVE_STRUCT_SIZE) {
        return false;
      }

      readStringSaveStruct(StringSave, buffer);

      // Create  the saved string struct
      gMapScreenMessageList[uiCount].uiFont = StringSave.uiFont;
      gMapScreenMessageList[uiCount].usColor = StringSave.usColor;
      gMapScreenMessageList[uiCount].uiFlags = StringSave.uiFlags;
      gMapScreenMessageList[uiCount].fBeginningOfNewString = StringSave.fBeginningOfNewString;
      gMapScreenMessageList[uiCount].uiTimeOfLastUpdate = StringSave.uiTimeOfLastUpdate;
    } else
      gMapScreenMessageList[uiCount] = <ScrollStringSt><unknown>null;
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

function MoveToBeginningOfMessageQueue(): ScrollStringSt | null {
  let pStringSt: ScrollStringSt | null = pStringS;

  if (pStringSt == null) {
    return null;
  }

  while (pStringSt.pPrev) {
    pStringSt = pStringSt.pPrev;
  }

  return pStringSt;
}

function GetMessageQueueSize(): INT32 {
  let pStringSt: ScrollStringSt | null = pStringS;
  let iCounter: INT32 = 0;

  pStringSt = MoveToBeginningOfMessageQueue();

  while (pStringSt) {
    iCounter++;
    pStringSt = pStringSt.pNext;
  }

  return iCounter;
}

export function ClearTacticalMessageQueue(): void {
  let pStringSt: ScrollStringSt | null = pStringS;
  let pOtherStringSt: ScrollStringSt | null = pStringS;

  ClearDisplayedListOfTacticalStrings();

  // now run through all the tactical messages
  while (pStringSt) {
    pOtherStringSt = pStringSt;
    pStringSt = pStringSt.pNext;
    MemFree(pOtherStringSt.pString16);
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
    gMapScreenMessageList[iCounter] = <ScrollStringSt><unknown>null;
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
      MemFree(gMapScreenMessageList[iCounter].pString16);
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
