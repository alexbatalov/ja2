namespace ja2 {

// enum used for the different help screens that can come up
export const enum Enum17 {
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

export interface HELP_SCREEN_STRUCT {
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
  fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen: boolean;

  bDelayEnteringHelpScreenBy1FrameCount: INT8;
  usLeftMarginPosX: UINT16;

  usCursor: UINT16;

  fWasTheGamePausedPriorToEnteringHelpScreen: boolean;

  // scroll variables
  usTotalNumberOfPixelsInBuffer: UINT16;
  iLineAtTopOfTextBuffer: INT32;
  usTotalNumberOfLinesInBuffer: UINT16;
  fForceHelpScreenToComeUp: boolean;
}

export function createHelpScreenStruct(): HELP_SCREEN_STRUCT {
  return {
    bCurrentHelpScreen: 0,
    uiFlags: 0,
    usHasPlayerSeenHelpScreenInCurrentScreen: 0,
    ubHelpScreenDirty: 0,
    usScreenLocX: 0,
    usScreenLocY: 0,
    usScreenWidth: 0,
    usScreenHeight: 0,
    iLastMouseClickY: 0,
    bCurrentHelpScreenActiveSubPage: 0,
    bNumberOfButtons: 0,
    fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen: false,
    bDelayEnteringHelpScreenBy1FrameCount: 0,
    usLeftMarginPosX: 0,
    usCursor: 0,
    fWasTheGamePausedPriorToEnteringHelpScreen: false,
    usTotalNumberOfPixelsInBuffer: 0,
    iLineAtTopOfTextBuffer: 0,
    usTotalNumberOfLinesInBuffer: 0,
    fForceHelpScreenToComeUp: false,
  };
}

export function resetHelpScreenStruct(o: HELP_SCREEN_STRUCT) {
  o.bCurrentHelpScreen = 0;
  o.uiFlags = 0;
  o.usHasPlayerSeenHelpScreenInCurrentScreen = 0;
  o.ubHelpScreenDirty = 0;
  o.usScreenLocX = 0;
  o.usScreenLocY = 0;
  o.usScreenWidth = 0;
  o.usScreenHeight = 0;
  o.iLastMouseClickY = 0;
  o.bCurrentHelpScreenActiveSubPage = 0;
  o.bNumberOfButtons = 0;
  o.fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen = false;
  o.bDelayEnteringHelpScreenBy1FrameCount = 0;
  o.usLeftMarginPosX = 0;
  o.usCursor = 0;
  o.fWasTheGamePausedPriorToEnteringHelpScreen = false;
  o.usTotalNumberOfPixelsInBuffer = 0;
  o.iLineAtTopOfTextBuffer = 0;
  o.usTotalNumberOfLinesInBuffer = 0;
  o.fForceHelpScreenToComeUp = false;
}

}
