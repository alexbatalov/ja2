// enum used for the different help screens that can come up
const enum Enum17 {
  HELP_SCREEN_LAPTOP,
  HELP_SCREEN_MAPSCREEN,
  HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED,
  HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO,
  HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY,
  HELP_SCREEN_TACTICAL,
  HELP_SCREEN_OPTIONS,
  HELP_SCREEN_LOAD_GAME,

  HELP_SCREEN_NUMBER_OF_HELP_SCREENS,
}

interface HELP_SCREEN_STRUCT {
  bCurrentHelpScreen: INT8;
  uiFlags: UINT32;

  usHasPlayerSeenHelpScreenInCurrentScreen: UINT16;

  ubHelpScreenDirty: UINT8;

  usScreenLocX: UINT16;
  usScreenLocY: UINT16;
  usScreenWidth: UINT16;
  usScreenHeight: UINT16;

  iLastMouseClickY: INT32; // last position the mouse was clicked ( if != -1 )

  bCurrentHelpScreenActiveSubPage: INT8; // used to keep track of the current page being displayed

  bNumberOfButtons: INT8;

  // used so if the user checked the box to show the help, it doesnt automatically come up every frame
  fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen: BOOLEAN;

  bDelayEnteringHelpScreenBy1FrameCount: INT8;
  usLeftMarginPosX: UINT16;

  usCursor: UINT16;

  fWasTheGamePausedPriorToEnteringHelpScreen: BOOLEAN;

  // scroll variables
  usTotalNumberOfPixelsInBuffer: UINT16;
  iLineAtTopOfTextBuffer: INT32;
  usTotalNumberOfLinesInBuffer: UINT16;
  fForceHelpScreenToComeUp: BOOLEAN;
}

extern HELP_SCREEN_STRUCT gHelpScreen;

BOOLEAN ShouldTheHelpScreenComeUp(UINT8 ubScreenID, BOOLEAN fForceHelpScreenToComeUp);
void HelpScreenHandler();
void InitHelpScreenSystem();
void NewScreenSoResetHelpScreen();
INT8 HelpScreenDetermineWhichMapScreenHelpToShow();
