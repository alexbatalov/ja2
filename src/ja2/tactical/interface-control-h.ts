const INTERFACE_MAPSCREEN = 0x00000001;
const INTERFACE_NORENDERBUTTONS = 0x00000002;
const INTERFACE_LOCKEDLEVEL1 = 0x00000004;
const INTERFACE_SHOPKEEP_INTERFACE = 0x00000008;

UINT32 guiTacticalInterfaceFlags;

void SetTacticalInterfaceFlags(UINT32 uiFlags);

void SetUpInterface();
void ResetInterface();
void RenderTopmostTacticalInterface();
void RenderTacticalInterface();

void StartViewportOverlays();
void EndViewportOverlays();

void LockTacticalInterface();
void UnLockTacticalInterface();

void RenderTacticalInterfaceWhileScrolling();

void EraseInterfaceMenus(BOOLEAN fIgnoreUIUnLock);

// handle paused render of tactical panel, if flag set, OR it in with tactical render flags
// then reset
void HandlePausedTacticalRender(void);

void ResetInterfaceAndUI();

BOOLEAN AreWeInAUIMenu();

void HandleTacticalPanelSwitch();

BOOLEAN InterfaceOKForMeanwhilePopup();
