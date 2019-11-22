namespace ja2 {

export interface ScrollStringSt {
  pString16: string /* STR16 */;
  iVideoOverlay: INT32;
  uiFont: UINT32;
  usColor: UINT16;
  uiFlags: UINT32;
  fBeginningOfNewString: boolean;
  uiTimeOfLastUpdate: UINT32;
  uiPadding: UINT32[] /* [5] */;
  pNext: ScrollStringSt | null /* Pointer<ScrollStringSt> */;
  pPrev: ScrollStringSt | null /* Pointer<ScrollStringSt> */;
}

export function createScrollStringSt(): ScrollStringSt {
  return {
    pString16: '',
    iVideoOverlay: 0,
    uiFont: 0,
    usColor: 0,
    uiFlags: 0,
    fBeginningOfNewString: false,
    uiTimeOfLastUpdate: 0,
    uiPadding: createArray(5, 0),
    pNext: null,
    pPrev: null,
  };
}

export const MSG_INTERFACE = 0;
export const MSG_DIALOG = 1;
const MSG_CHAT = 2;
export const MSG_DEBUG = 3;
export const MSG_UI_FEEDBACK = 4;
export const MSG_ERROR = 5;
export const MSG_BETAVERSION = 6;
export const MSG_TESTVERSION = 7;
export const MSG_MAP_UI_POSITION_MIDDLE = 8;
export const MSG_MAP_UI_POSITION_UPPER = 9;
export const MSG_MAP_UI_POSITION_LOWER = 10;
export const MSG_SKULL_UI_FEEDBACK = 11;

// These defines correlate to defines in font.h
export const MSG_FONT_RED = FONT_MCOLOR_RED;
export const MSG_FONT_YELLOW = FONT_MCOLOR_LTYELLOW;
const MSG_FONT_WHITE = FONT_MCOLOR_WHITE;

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

}
