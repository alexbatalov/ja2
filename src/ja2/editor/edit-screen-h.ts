const EDITOR_LIGHT_MAX = (SHADE_MIN + SHADE_MAX);
const EDITOR_LIGHT_FAKE = (EDITOR_LIGHT_MAX - SHADE_MAX - 2);

extern BOOLEAN gfFakeLights;
extern GUI_BUTTON *gpPersistantButton;

extern UINT16 GenericButtonFillColors[40];

extern BOOLEAN gfMercResetUponEditorEntry;

extern UINT16 GenericButtonFillColors[40];

// These go together.  The taskbar has a specific color scheme.
extern UINT16 gusEditorTaskbarColor;
extern UINT16 gusEditorTaskbarHiColor;
extern UINT16 gusEditorTaskbarLoColor;

extern INT32 iOldTaskMode;
extern INT32 iCurrentTaskbar;
extern INT32 iTaskMode;

extern BOOLEAN gfConfirmExitFirst;
extern BOOLEAN gfConfirmExitPending;
extern BOOLEAN gfIntendOnEnteringEditor;
