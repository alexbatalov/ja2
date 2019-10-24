interface ScrollStringSt {
  pString16: STR16;
  iVideoOverlay: INT32;
  uiFont: UINT32;
  usColor: UINT16;
  uiFlags: UINT32;
  fBeginningOfNewString: boolean;
  uiTimeOfLastUpdate: UINT32;
  uiPadding: UINT32[] /* [5] */;
  pNext: Pointer<ScrollStringSt>;
  pPrev: Pointer<ScrollStringSt>;
}

const MSG_INTERFACE = 0;
const MSG_DIALOG = 1;
const MSG_CHAT = 2;
const MSG_DEBUG = 3;
const MSG_UI_FEEDBACK = 4;
const MSG_ERROR = 5;
const MSG_BETAVERSION = 6;
const MSG_TESTVERSION = 7;
const MSG_MAP_UI_POSITION_MIDDLE = 8;
const MSG_MAP_UI_POSITION_UPPER = 9;
const MSG_MAP_UI_POSITION_LOWER = 10;
const MSG_SKULL_UI_FEEDBACK = 11;

// These defines correlate to defines in font.h
const MSG_FONT_RED = FONT_MCOLOR_RED;
const MSG_FONT_YELLOW = FONT_MCOLOR_LTYELLOW;
const MSG_FONT_WHITE = FONT_MCOLOR_WHITE;

type ScrollStringStPtr = Pointer<ScrollStringSt>;

/* unused functions, written by Mr. Carter, so don't expect these to work...
UINT8 GetTheRelativePositionOfCurrentMessage( void );
void MoveCurrentMessagePointerDownList( void );
void MoveCurrentMessagePointerUpList( void );
void ScrollToHereInMapScreenMessageList( UINT8 ubPosition );
BOOLEAN IsThereAnEmptySlotInTheMapScreenMessageList( void );
UINT8 GetFirstEmptySlotInTheMapScreenMessageList( void );
void RemoveMapScreenMessageListString( ScrollStringStPtr pStringSt );
BOOLEAN AreThereASetOfStringsAfterThisIndex( UINT8 ubMsgIndex, INT32 iNumberOfStrings );
UINT8 GetCurrentMessageValue( void );
UINT8 GetCurrentTempMessageValue( void );
UINT8 GetNewMessageValueGivenPosition( UINT8 ubPosition );
BOOLEAN IsThisTheLastMessageInTheList( void );
BOOLEAN IsThisTheFirstMessageInTheList( void );
void DisplayLastMessage( void );
*/
