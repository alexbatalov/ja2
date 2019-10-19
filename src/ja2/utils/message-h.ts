struct stringstruct {
  STR16 pString16;
  INT32 iVideoOverlay;
  UINT32 uiFont;
  UINT16 usColor;
  UINT32 uiFlags;
  BOOLEAN fBeginningOfNewString;
  UINT32 uiTimeOfLastUpdate;
  UINT32 uiPadding[5];
  struct stringstruct *pNext;
  struct stringstruct *pPrev;
};

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

typedef struct stringstruct ScrollStringSt;
typedef ScrollStringSt *ScrollStringStPtr;

extern ScrollStringStPtr pStringS;
extern UINT32 StringCount;
extern UINT8 gubCurrentMapMessageString;
extern BOOLEAN fDisableJustForIan;

// are we allowed to beep on message scroll in tactical
extern BOOLEAN fOkToBeepNewMessage;

void ScreenMsg(UINT16 usColor, UINT8 ubPriority, STR16 pStringA, ...);

// same as screen message, but only display to mapscreen message system, not tactical
void MapScreenMessage(UINT16 usColor, UINT8 ubPriority, STR16 pStringA, ...);

void ScrollString(void);
void DisplayStringsInMapScreenMessageList(void);

void InitGlobalMessageList(void);
void FreeGlobalMessageList(void);

UINT8 GetRangeOfMapScreenMessages(void);

void EnableDisableScrollStringVideoOverlay(BOOLEAN fEnable);

// will go and clear all displayed strings off the screen
void ClearDisplayedListOfTacticalStrings(void);

// clear ALL strings in the tactical Message Queue
void ClearTacticalMessageQueue(void);

BOOLEAN LoadMapScreenMessagesFromSaveGameFile(HWFILE hFile);
BOOLEAN SaveMapScreenMessagesToSaveGameFile(HWFILE hFile);

// use these if you are not Kris
void HideMessagesDuringNPCDialogue(void);
void UnHideMessagesDuringNPCDialogue(void);

// disable and enable scroll string, only to be used by Kris
void DisableScrollMessages(void);
void EnableScrollMessages(void);

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