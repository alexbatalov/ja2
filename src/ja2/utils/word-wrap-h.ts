// Flags for DrawTextToScreen()

// Defines for coded text For use with IanDisplayWrappedString()
const TEXT_SPACE = 32;
const TEXT_CODE_NEWLINE = 177;
const TEXT_CODE_BOLD = 178;
const TEXT_CODE_CENTER = 179;
const TEXT_CODE_NEWCOLOR = 180;
const TEXT_CODE_DEFCOLOR = 181;

UINT16 IanDisplayWrappedString(UINT16 usPosX, UINT16 usPosY, UINT16 usWidth, UINT8 ubGap, UINT32 uiFont, UINT8 ubColor, STR16 pString, UINT8 ubBackGroundColor, BOOLEAN fDirty, UINT32 uiFlags);

const LEFT_JUSTIFIED = 0x00000001;
const CENTER_JUSTIFIED = 0x00000002;
const RIGHT_JUSTIFIED = 0x00000004;
const TEXT_SHADOWED = 0x00000008;

const INVALIDATE_TEXT = 0x00000010;
const DONT_DISPLAY_TEXT = 0x00000020; // Wont display the text.  Used if you just want to get how many lines will be displayed

const IAN_WRAP_NO_SHADOW = 32;

const NEWLINE_CHAR = 177;

typedef struct _WRAPPEDSTRING {
  STR16 sString;
  struct _WRAPPEDSTRING *pNextWrappedString;
} WRAPPED_STRING;

WRAPPED_STRING *LineWrap(UINT32 ulFont, UINT16 usLineWidthPixels, UINT16 *pusLineWidthIfWordIsWiderThenWidth, STR16 pString, ...);
UINT16 DisplayWrappedString(UINT16 usPosX, UINT16 usPosY, UINT16 usWidth, UINT8 ubGap, UINT32 uiFont, UINT8 ubColor, STR16 pString, UINT8 ubBackGroundColor, BOOLEAN fDirty, UINT32 ulFlags);
UINT16 DeleteWrappedString(WRAPPED_STRING *pWrappedString);
void CleanOutControlCodesFromString(STR16 pSourceString, STR16 pDestString);
INT16 IanDisplayWrappedStringToPages(UINT16 usPosX, UINT16 usPosY, UINT16 usWidth, UINT16 usPageHeight, UINT16 usTotalHeight, UINT16 usPageNumber, UINT8 ubGap, UINT32 uiFont, UINT8 ubColor, STR16 pString, UINT8 ubBackGroundColor, BOOLEAN fDirty, UINT32 uiFlags, BOOLEAN *fOnLastPageFlag);
BOOLEAN DrawTextToScreen(STR16 pStr, UINT16 LocX, UINT16 LocY, UINT16 usWidth, UINT32 ulFont, UINT8 ubColor, UINT8 ubBackGroundColor, BOOLEAN fDirty, UINT32 FLAGS);
UINT16 IanWrappedStringHeight(UINT16 usPosX, UINT16 usPosY, UINT16 usWidth, UINT8 ubGap, UINT32 uiFont, UINT8 ubColor, STR16 pString, UINT8 ubBackGroundColor, BOOLEAN fDirty, UINT32 uiFlags);

BOOLEAN WillThisStringGetCutOff(INT32 iCurrentYPosition, INT32 iBottomOfPage, INT32 iWrapWidth, UINT32 uiFont, STR16 pString, INT32 iGap, INT32 iPage);
BOOLEAN IsThisStringBeforeTheCurrentPage(INT32 iTotalYPosition, INT32 iPageSize, INT32 iCurrentPage, INT32 iWrapWidth, UINT32 uiFont, STR16 pString, INT32 iGap);
INT32 GetNewTotalYPositionOfThisString(INT32 iTotalYPosition, INT32 iPageSize, INT32 iCurrentPage, INT32 iWrapWidth, UINT32 uiFont, STR16 pString, INT32 iGap);
RecordPtr GetFirstRecordOnThisPage(RecordPtr RecordList, UINT32 uiFont, UINT16 usWidth, UINT8 ubGap, INT32 iPage, INT32 iPageSize);
FileStringPtr GetFirstStringOnThisPage(FileStringPtr RecordList, UINT32 uiFont, UINT16 usWidth, UINT8 ubGap, INT32 iPage, INT32 iPageSize, FileRecordWidthPtr iWidthArray);

// Places a shadow the width an height of the string, to PosX, posY
void ShadowText(UINT32 uiDestVSurface, STR16 pString, UINT32 uiFont, UINT16 usPosX, UINT16 usPosY);

BOOLEAN ReduceStringLength(STR16 pString, UINT32 uiWidth, UINT32 uiFont);

void UseSingleCharWordsForWordWrap(BOOLEAN fUseSingleCharWords);
WRAPPED_STRING *LineWrapForSingleCharWords(UINT32 ulFont, UINT16 usLineWidthPixels, UINT16 *pusLineWidthIfWordIsWiderThenWidth, STR16 pString, ...);
