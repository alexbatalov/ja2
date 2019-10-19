// main game loop systems
const INIT_SYSTEM = 0;

const NO_PENDING_SCREEN = 0xFFFF;

extern BOOLEAN InitializeGame(void);
extern void ShutdownGame(void);
extern void GameLoop(void);

// handle exit from game due to shortcut key
void HandleShortCutExitState(void);

void SetPendingNewScreen(UINT32 uiNewScreen);
