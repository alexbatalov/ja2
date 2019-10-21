const MAX_MESSAGES_ON_MAP_BOTTOM = 9;

// exit to where defines
const enum Enum144 {
  MAP_EXIT_TO_LAPTOP = 0,
  MAP_EXIT_TO_TACTICAL,
  MAP_EXIT_TO_OPTIONS,
  MAP_EXIT_TO_LOAD,
  MAP_EXIT_TO_SAVE,
}

// there's no button for entering SAVE/LOAD screen directly...
extern UINT32 guiMapBottomExitButtons[3];

extern BOOLEAN fLapTop;
extern BOOLEAN fLeavingMapScreen;
extern BOOLEAN gfDontStartTransitionFromLaptop;
extern BOOLEAN gfStartMapScreenToLaptopTransition;

// function prototypes
