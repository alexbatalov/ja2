//*****************************************************************************************************
//	Button System.h
//
//	by Kris Morness (originally created by Bret Rowden)
//*****************************************************************************************************

// Moved here from Button System.c by DB 99/01/07
// Names of the default generic button image files.
const DEFAULT_GENERIC_BUTTON_OFF = "GENBUTN.STI";
const DEFAULT_GENERIC_BUTTON_ON = "GENBUTN2.STI";
const DEFAULT_GENERIC_BUTTON_OFF_HI = "GENBUTN3.STI";
const DEFAULT_GENERIC_BUTTON_ON_HI = "GENBUTN4.STI";

const BUTTON_TEXT_LEFT = -1;
const BUTTON_TEXT_CENTER = 0;
const BUTTON_TEXT_RIGHT = 1;

const TEXT_LJUSTIFIED = BUTTON_TEXT_LEFT;
const TEXT_CJUSTIFIED = BUTTON_TEXT_CENTER;
const TEXT_RJUSTIFIED = BUTTON_TEXT_RIGHT;

// Some GUI_BUTTON system defines
const BUTTON_USE_DEFAULT = -1;
const BUTTON_NO_FILENAME = NULL;
const BUTTON_NO_CALLBACK = NULL;
const BUTTON_NO_IMAGE = -1;
const BUTTON_NO_SLOT = -1;

const BUTTON_INIT = 1;
const BUTTON_WAS_CLICKED = 2;

// effects how the button is rendered.
const BUTTON_TYPES = (BUTTON_QUICK | BUTTON_GENERIC | BUTTON_HOT_SPOT | BUTTON_CHECKBOX);
// effects how the button is processed
const BUTTON_TYPE_MASK = (BUTTON_NO_TOGGLE | BUTTON_ALLOW_DISABLED_CALLBACK | BUTTON_CHECKBOX | BUTTON_IGNORE_CLICKS);

// button flags
const BUTTON_TOGGLE = 0x00000000;
const BUTTON_QUICK = 0x00000000;
const BUTTON_ENABLED = 0x00000001;
const BUTTON_CLICKED_ON = 0x00000002;
const BUTTON_NO_TOGGLE = 0x00000004;
const BUTTON_CLICK_CALLBACK = 0x00000008;
const BUTTON_MOVE_CALLBACK = 0x00000010;
const BUTTON_GENERIC = 0x00000020;
const BUTTON_HOT_SPOT = 0x00000040;
const BUTTON_SELFDELETE_IMAGE = 0x00000080;
const BUTTON_DELETION_PENDING = 0x00000100;
const BUTTON_ALLOW_DISABLED_CALLBACK = 0x00000200;
const BUTTON_DIRTY = 0x00000400;
const BUTTON_SAVEBACKGROUND = 0x00000800;
const BUTTON_CHECKBOX = 0x00001000;
const BUTTON_NEWTOGGLE = 0x00002000;
const BUTTON_FORCE_UNDIRTY = 0x00004000; // no matter what happens this buttons does NOT get marked dirty
const BUTTON_IGNORE_CLICKS = 0x00008000; // Ignore any clicks on this button
const BUTTON_DISABLED_CALLBACK = 0x80000000;

const BUTTON_SOUND_NONE = 0x00;
const BUTTON_SOUND_CLICKED_ON = 0x01;
const BUTTON_SOUND_CLICKED_OFF = 0x02;
const BUTTON_SOUND_MOVED_ONTO = 0x04;
const BUTTON_SOUND_MOVED_OFF_OF = 0x08;
const BUTTON_SOUND_DISABLED_CLICK = 0x10;
const BUTTON_SOUND_DISABLED_MOVED_ONTO = 0x20;
const BUTTON_SOUND_DISABLED_MOVED_OFF_OF = 0x40;
const BUTTON_SOUND_ALREADY_PLAYED = 0X80;

const BUTTON_SOUND_ALL_EVENTS = 0xff;

// Internal use!
const GUI_SND_CLK_ON = BUTTON_SOUND_CLICKED_ON;
const GUI_SND_CLK_OFF = BUTTON_SOUND_CLICKED_OFF;
const GUI_SND_MOV_ON = BUTTON_SOUND_MOVED_ONTO;
const GUI_SND_MOV_OFF = BUTTON_SOUND_MOVED_OFF_OF;
const GUI_SND_DCLK = BUTTON_SOUND_DISABLED_CLICK;
const GUI_SND_DMOV = BUTTON_SOUND_DISABLED_MOVED_ONTO;

extern UINT32 ButtonDestBuffer;

// GUI_BUTTON callback function type
typedef void (*GUI_CALLBACK)(struct _GUI_BUTTON *, INT32);

// GUI_BUTTON structure definitions.
interface GUI_BUTTON {
  IDNum: INT32; // ID Number, contains it's own button number
  ImageNum: UINT32; // Image number to use (see DOCs for details)
  Area: MOUSE_REGION; // Mouse System's mouse region to use for this button
  ClickCallback: GUI_CALLBACK; // Button Callback when button is clicked
  MoveCallback: GUI_CALLBACK; // Button Callback when mouse moved on this region
  Cursor: INT16; // Cursor to use for this button
  uiFlags: UINT32; // Button state flags etc.( 32-bit )
  uiOldFlags: UINT32; // Old flags from previous render loop
  XLoc: INT16; // Coordinates where button is on the screen
  YLoc: INT16;
  UserData: INT32[] /* [4] */; // Place holder for user data etc.
  Group: INT16; // Group this button belongs to (see DOCs)
  bDefaultStatus: INT8;
  // Button disabled style
  bDisabledStyle: INT8;
  // For buttons with text
  string: Pointer<UINT16>; // the string
  usFont: UINT16; // font for text
  fMultiColor: BOOLEAN; // font is a multi-color font
  sForeColor: INT16; // text colors if there is text
  sShadowColor: INT16;
  sForeColorDown: INT16; // text colors when button is down (optional)
  sShadowColorDown: INT16;
  sForeColorHilited: INT16; // text colors when button is down (optional)
  sShadowColorHilited: INT16;
  bJustification: INT8; // BUTTON_TEXT_LEFT, BUTTON_TEXT_CENTER, BUTTON_TEXT_RIGHT
  bTextXOffset: INT8;
  bTextYOffset: INT8;
  bTextXSubOffSet: INT8;
  bTextYSubOffSet: INT8;
  fShiftText: BOOLEAN;
  sWrappedWidth: INT16;
  // For buttons with icons (don't confuse this with quickbuttons which have up to 5 states )
  iIconID: INT32;
  usIconIndex: INT16;
  bIconXOffset: INT8; //-1 means horizontally centered
  bIconYOffset: INT8; //-1 means vertically centered
  fShiftImage: BOOLEAN; // if true, icon is shifted +1,+1 when button state is down.

  ubToggleButtonOldState: UINT8; // Varibles for new toggle buttons that work
  ubToggleButtonActivated: UINT8;

  BackRect: INT32; // Handle to a Background Rectangle
  ubSoundSchemeID: UINT8;
}

const MAX_BUTTONS = 400;

extern GUI_BUTTON *ButtonList[MAX_BUTTONS]; // Button System's Main Button List

const GetButtonPtr = (x) => (((x >= 0) && (x < MAX_BUTTONS)) ? ButtonList[x] : NULL);

// Struct definition for the QuickButton pictures.
interface BUTTON_PICS {
  vobj: HVOBJECT; // The Image itself
  Grayed: INT32; // Index to use for a "Grayed-out" button
  OffNormal: INT32; // Index to use when button is OFF
  OffHilite: INT32; // Index to use when button is OFF w/ hilite on it
  OnNormal: INT32; // Index to use when button is ON
  OnHilite: INT32; // Index to use when button is ON w/ hilite on it
  MaxWidth: UINT32; // Width of largest image in use
  MaxHeight: UINT32; // Height of largest image in use
  fFlags: UINT32; // Special image flags
}

const MAX_BUTTON_PICS = 256;

extern BUTTON_PICS ButtonPictures[MAX_BUTTON_PICS];

// Function protos for button system
BOOLEAN InitializeButtonImageManager(INT32 DefaultBuffer, INT32 DefaultPitch, INT32 DefaultBPP);
void ShutdownButtonImageManager(void);
BOOLEAN InitButtonSystem(void);
void ShutdownButtonSystem(void);

INT16 FindFreeIconSlot(void);
INT32 FindFreeButtonSlot(void);
INT16 FindFreeGenericSlot(void);
INT16 FindFreeIconSlot(void);
INT32 GetNextButtonNumber(void);

// Now used by Wizardry -- DB
void SetButtonFastHelpText(INT32 iButton, UINT16 *Text);

void SetBtnHelpEndCallback(INT32 iButton, MOUSE_HELPTEXT_DONE_CALLBACK CallbackFxn);
// void DisplayFastHelp(GUI_BUTTON *b);
void RenderButtonsFastHelp(void);

const RenderButtonsFastHelp = () => RenderFastHelp();

BOOLEAN SetButtonSavedRect(INT32 iButton);
void FreeButtonSavedRect(INT32 iButton);

INT16 LoadGenericButtonIcon(UINT8 *filename);
BOOLEAN UnloadGenericButtonIcon(INT16 GenImg);
INT32 LoadButtonImage(UINT8 *filename, INT32 Grayed, INT32 OffNormal, INT32 OffHilite, INT32 OnNormal, INT32 OnHilite);
INT32 UseLoadedButtonImage(INT32 LoadedImg, INT32 Grayed, INT32 OffNormal, INT32 OffHilite, INT32 OnNormal, INT32 OnHilite);
INT32 UseVObjAsButtonImage(HVOBJECT hVObject, INT32 Grayed, INT32 OffNormal, INT32 OffHilite, INT32 OnNormal, INT32 OnHilite);
void UnloadButtonImage(INT32 Index);
INT16 LoadGenericButtonImages(UINT8 *GrayName, UINT8 *OffNormName, UINT8 *OffHiliteName, UINT8 *OnNormName, UINT8 *OnHiliteName, UINT8 *BkGrndName, INT16 Index, INT16 OffsetX, INT16 OffsetY);
BOOLEAN UnloadGenericButtonImage(INT16 GenImg);

BOOLEAN SetButtonDestBuffer(UINT32 DestBuffer);

BOOLEAN EnableButton(INT32 iButtonID);
BOOLEAN DisableButton(INT32 iButtonID);
void RemoveButton(INT32 iButtonID);
void HideButton(INT32 iButtonID);
void ShowButton(INT32 iButton);

void RenderButtons(void);
BOOLEAN DrawButton(INT32 iButtonID);
void DrawButtonFromPtr(GUI_BUTTON *b);

// Base button types
void DrawGenericButton(GUI_BUTTON *b);
void DrawQuickButton(GUI_BUTTON *b);
void DrawCheckBoxButton(GUI_BUTTON *b);
// Additional layers on buttons that can exist in any combination on generic or quick buttons
// To do so, use the new specify functions below.
void DrawIconOnButton(GUI_BUTTON *b);
void DrawTextOnButton(GUI_BUTTON *b);

extern BOOLEAN gfRenderHilights;
const EnableHilightsAndHelpText = () => gfRenderHilights = TRUE;
const DisableHilightsAndHelpText = () => gfRenderHilights = FALSE;

// Providing you have allocated your own image, this is a somewhat simplified function.
INT32 QuickCreateButton(UINT32 Image, INT16 xloc, INT16 yloc, INT32 Type, INT16 Priority, GUI_CALLBACK MoveCallback, GUI_CALLBACK ClickCallback);

// A hybrid of QuickCreateButton.  Takes a lot less parameters, but makes more assumptions.  It self manages the
// loading, and deleting of the image.  The size of the image determines the size of the button.  It also uses
// the default move callback which emulates Win95.  Finally, it sets the priority to normal.  The function you
// choose also determines the type of button (toggle, notoggle, or newtoggle)
INT32 CreateEasyNoToggleButton(INT32 x, INT32 y, UINT8 *filename, GUI_CALLBACK ClickCallback);
INT32 CreateEasyToggleButton(INT32 x, INT32 y, UINT8 *filename, GUI_CALLBACK ClickCallback);
INT32 CreateEasyNewToggleButton(INT32 x, INT32 y, UINT8 *filename, GUI_CALLBACK ClickCallback);
// Same as above, but accepts specify toggle type
INT32 CreateEasyButton(INT32 x, INT32 y, UINT8 *filename, INT32 Type, GUI_CALLBACK ClickCallback);
// Same as above, but accepts priority specification.
INT32 CreateSimpleButton(INT32 x, INT32 y, UINT8 *filename, INT32 Type, INT16 Priority, GUI_CALLBACK ClickCallback);

INT32 CreateCheckBoxButton(INT16 x, INT16 y, UINT8 *filename, INT16 Priority, GUI_CALLBACK ClickCallback);
INT32 CreateIconButton(INT16 Icon, INT16 IconIndex, INT16 GenImg, INT16 xloc, INT16 yloc, INT16 w, INT16 h, INT32 Type, INT16 Priority, GUI_CALLBACK MoveCallback, GUI_CALLBACK ClickCallback);
INT32 CreateHotSpot(INT16 xloc, INT16 yloc, INT16 Width, INT16 Height, INT16 Priority, GUI_CALLBACK MoveCallback, GUI_CALLBACK ClickCallback);

INT32 CreateTextButton(UINT16 *string, UINT32 uiFont, INT16 sForeColor, INT16 sShadowColor, INT16 GenImg, INT16 xloc, INT16 yloc, INT16 w, INT16 h, INT32 Type, INT16 Priority, GUI_CALLBACK MoveCallback, GUI_CALLBACK ClickCallback);
INT32 CreateIconAndTextButton(INT32 Image, UINT16 *string, UINT32 uiFont, INT16 sForeColor, INT16 sShadowColor, INT16 sForeColorDown, INT16 sShadowColorDown, INT8 bJustification, INT16 xloc, INT16 yloc, INT32 Type, INT16 Priority, GUI_CALLBACK MoveCallback, GUI_CALLBACK ClickCallback);

// New functions
void SpecifyButtonText(INT32 iButtonID, UINT16 *string);
void SpecifyButtonFont(INT32 iButtonID, UINT32 uiFont);
void SpecifyButtonMultiColorFont(INT32 iButtonID, BOOLEAN fMultiColor);
void SpecifyButtonUpTextColors(INT32 iButtonID, INT16 sForeColor, INT16 sShadowColor);
void SpecifyButtonDownTextColors(INT32 iButtonID, INT16 sForeColorDown, INT16 sShadowColorDown);
void SpecifyButtonHilitedTextColors(INT32 iButtonID, INT16 sForeColorHilited, INT16 sShadowColorHilited);
void SpecifyButtonTextJustification(INT32 iButtonID, INT8 bJustification);
void SpecifyGeneralButtonTextAttributes(INT32 iButtonID, UINT16 *string, INT32 uiFont, INT16 sForeColor, INT16 sShadowColor);
void SpecifyFullButtonTextAttributes(INT32 iButtonID, UINT16 *string, INT32 uiFont, INT16 sForeColor, INT16 sShadowColor, INT16 sForeColorDown, INT16 sShadowColorDown, INT8 bJustification);
void SpecifyGeneralButtonTextAttributes(INT32 iButtonID, UINT16 *string, INT32 uiFont, INT16 sForeColor, INT16 sShadowColor);
void SpecifyButtonTextOffsets(INT32 iButtonID, INT8 bTextXOffset, INT8 bTextYOffset, BOOLEAN fShiftText);
void SpecifyButtonTextSubOffsets(INT32 iButtonID, INT8 bTextXOffset, INT8 bTextYOffset, BOOLEAN fShiftText);
void SpecifyButtonTextWrappedWidth(INT32 iButtonID, INT16 sWrappedWidth);

void SpecifyButtonSoundScheme(INT32 iButtonID, INT8 bSoundScheme);
void PlayButtonSound(INT32 iButtonID, INT32 iSoundType);

void AllowDisabledButtonFastHelp(INT32 iButtonID, BOOLEAN fAllow);

const enum Enum28 {
  DEFAULT_STATUS_NONE,
  DEFAULT_STATUS_DARKBORDER, // shades the borders 2 pixels deep
  DEFAULT_STATUS_DOTTEDINTERIOR, // draws the familiar dotted line in the interior portion of the button.
  DEFAULT_STATUS_WINDOWS95, // both DARKBORDER and DOTTEDINTERIOR
}
void GiveButtonDefaultStatus(INT32 iButtonID, INT32 iDefaultStatus);
void RemoveButtonDefaultStatus(INT32 iButtonID);

// for use with SpecifyDisabledButtonStyle
const enum Enum29 {
  DISABLED_STYLE_NONE, // for dummy buttons, panels, etc.  Always displays normal state.
  DISABLED_STYLE_DEFAULT, // if button has text then shade, else hatch
  DISABLED_STYLE_HATCHED, // always hatches the disabled button
  DISABLED_STYLE_SHADED, // always shades the disabled button 25% darker
}
void SpecifyDisabledButtonStyle(INT32 iButtonID, INT8 bStyle);

void RemoveTextFromButton(INT32 iButtonID);
void RemoveIconFromButton(INT32 iButtonID);

// Note:  Text is always on top
// If fShiftImage is true, then the image will shift down one pixel and right one pixel
// just like the text does.
BOOLEAN SpecifyButtonIcon(INT32 iButtonID, INT32 iVideoObjectID, UINT16 usVideoObjectIndex, INT8 bXOffset, INT8 bYOffset, BOOLEAN fShiftImage);

void SetButtonPosition(INT32 iButtonID, INT16 x, INT16 y);
void ResizeButton(INT32 iButtonID, INT16 w, INT16 h);

void QuickButtonCallbackMMove(MOUSE_REGION *reg, INT32 reason);
void QuickButtonCallbackMButn(MOUSE_REGION *reg, INT32 reason);

BOOLEAN SetButtonCursor(INT32 iBtnId, UINT16 crsr);
void MSYS_SetBtnUserData(INT32 iButtonNum, INT32 index, INT32 userdata);
INT32 MSYS_GetBtnUserData(GUI_BUTTON *b, INT32 index);
void MarkAButtonDirty(INT32 iButtonNum); // will mark only selected button dirty
void MarkButtonsDirty(void); // Function to mark buttons dirty ( all will redraw at next RenderButtons )
void PausedMarkButtonsDirty(void); // mark buttons dirty for button render the frame after the next
void UnMarkButtonDirty(INT32 iButtonIndex); // unmark button
void UnmarkButtonsDirty(void); // unmark ALL the buttoms on the screen dirty
void ForceButtonUnDirty(INT32 iButtonIndex); // forces button undirty no matter the reason, only lasts one frame

// DB 98-05-05
BOOLEAN GetButtonArea(INT32 iButtonID, SGPRect *pRect);
// DB 99-01-13
INT32 GetButtonWidth(INT32 iButtonID);
INT32 GetButtonHeight(INT32 iButtonID);

// DB 99-08-27
INT32 GetButtonX(INT32 iButtonID);
INT32 GetButtonY(INT32 iButtonID);

void BtnGenericMouseMoveButtonCallback(GUI_BUTTON *btn, INT32 reason);
const DEFAULT_MOVE_CALLBACK = () => BtnGenericMouseMoveButtonCallback;

void DrawCheckBoxButtonOn(INT32 iButtonID);

void DrawCheckBoxButtonOff(INT32 iButtonID);

extern UINT16 GetWidthOfButtonPic(UINT16 usButtonPicID, INT32 iSlot);
