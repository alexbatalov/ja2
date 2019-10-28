namespace ja2 {

//*****************************************************************************************************
//	Button System.h
//
//	by Kris Morness (originally created by Bret Rowden)
//*****************************************************************************************************

// Moved here from Button System.c by DB 99/01/07
// Names of the default generic button image files.
export const DEFAULT_GENERIC_BUTTON_OFF = "GENBUTN.STI";
export const DEFAULT_GENERIC_BUTTON_ON = "GENBUTN2.STI";
export const DEFAULT_GENERIC_BUTTON_OFF_HI = "GENBUTN3.STI";
export const DEFAULT_GENERIC_BUTTON_ON_HI = "GENBUTN4.STI";

export const BUTTON_TEXT_LEFT = -1;
export const BUTTON_TEXT_CENTER = 0;
export const BUTTON_TEXT_RIGHT = 1;

export const TEXT_LJUSTIFIED = BUTTON_TEXT_LEFT;
export const TEXT_CJUSTIFIED = BUTTON_TEXT_CENTER;
const TEXT_RJUSTIFIED = BUTTON_TEXT_RIGHT;

// Some GUI_BUTTON system defines
export const BUTTON_USE_DEFAULT = -1;
export const BUTTON_NO_FILENAME = null;
export const BUTTON_NO_CALLBACK = null;
export const BUTTON_NO_IMAGE = -1;
export const BUTTON_NO_SLOT = -1;

const BUTTON_INIT = 1;
const BUTTON_WAS_CLICKED = 2;

// effects how the button is rendered.
export const BUTTON_TYPES = (BUTTON_QUICK | BUTTON_GENERIC | BUTTON_HOT_SPOT | BUTTON_CHECKBOX);
// effects how the button is processed
export const BUTTON_TYPE_MASK = (BUTTON_NO_TOGGLE | BUTTON_ALLOW_DISABLED_CALLBACK | BUTTON_CHECKBOX | BUTTON_IGNORE_CLICKS);

// button flags
export const BUTTON_TOGGLE = 0x00000000;
export const BUTTON_QUICK = 0x00000000;
export const BUTTON_ENABLED = 0x00000001;
export const BUTTON_CLICKED_ON = 0x00000002;
export const BUTTON_NO_TOGGLE = 0x00000004;
export const BUTTON_CLICK_CALLBACK = 0x00000008;
export const BUTTON_MOVE_CALLBACK = 0x00000010;
export const BUTTON_GENERIC = 0x00000020;
export const BUTTON_HOT_SPOT = 0x00000040;
export const BUTTON_SELFDELETE_IMAGE = 0x00000080;
export const BUTTON_DELETION_PENDING = 0x00000100;
export const BUTTON_ALLOW_DISABLED_CALLBACK = 0x00000200;
export const BUTTON_DIRTY = 0x00000400;
export const BUTTON_SAVEBACKGROUND = 0x00000800;
export const BUTTON_CHECKBOX = 0x00001000;
export const BUTTON_NEWTOGGLE = 0x00002000;
export const BUTTON_FORCE_UNDIRTY = 0x00004000; // no matter what happens this buttons does NOT get marked dirty
export const BUTTON_IGNORE_CLICKS = 0x00008000; // Ignore any clicks on this button
export const BUTTON_DISABLED_CALLBACK = 0x80000000;

const BUTTON_SOUND_NONE = 0x00;
export const BUTTON_SOUND_CLICKED_ON = 0x01;
export const BUTTON_SOUND_CLICKED_OFF = 0x02;
export const BUTTON_SOUND_MOVED_ONTO = 0x04;
export const BUTTON_SOUND_MOVED_OFF_OF = 0x08;
export const BUTTON_SOUND_DISABLED_CLICK = 0x10;
export const BUTTON_SOUND_DISABLED_MOVED_ONTO = 0x20;
export const BUTTON_SOUND_DISABLED_MOVED_OFF_OF = 0x40;
const BUTTON_SOUND_ALREADY_PLAYED = 0X80;

const BUTTON_SOUND_ALL_EVENTS = 0xff;

// Internal use!
const GUI_SND_CLK_ON = BUTTON_SOUND_CLICKED_ON;
const GUI_SND_CLK_OFF = BUTTON_SOUND_CLICKED_OFF;
const GUI_SND_MOV_ON = BUTTON_SOUND_MOVED_ONTO;
const GUI_SND_MOV_OFF = BUTTON_SOUND_MOVED_OFF_OF;
const GUI_SND_DCLK = BUTTON_SOUND_DISABLED_CLICK;
const GUI_SND_DMOV = BUTTON_SOUND_DISABLED_MOVED_ONTO;

// GUI_BUTTON callback function type
export type GUI_CALLBACK = (a: Pointer<GUI_BUTTON>, b: INT32) => void;

// GUI_BUTTON structure definitions.
export interface GUI_BUTTON {
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
  string: string /* Pointer<UINT16> */; // the string
  usFont: UINT16; // font for text
  fMultiColor: boolean; // font is a multi-color font
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
  fShiftText: boolean;
  sWrappedWidth: INT16;
  // For buttons with icons (don't confuse this with quickbuttons which have up to 5 states )
  iIconID: INT32;
  usIconIndex: INT16;
  bIconXOffset: INT8; //-1 means horizontally centered
  bIconYOffset: INT8; //-1 means vertically centered
  fShiftImage: boolean; // if true, icon is shifted +1,+1 when button state is down.

  ubToggleButtonOldState: UINT8; // Varibles for new toggle buttons that work
  ubToggleButtonActivated: UINT8;

  BackRect: INT32; // Handle to a Background Rectangle
  ubSoundSchemeID: UINT8;
}

export const MAX_BUTTONS = 400;

const GetButtonPtr = (x) => (((x >= 0) && (x < MAX_BUTTONS)) ? ButtonList[x] : null);

// Struct definition for the QuickButton pictures.
export interface BUTTON_PICS {
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

export const MAX_BUTTON_PICS = 256;

export const RenderButtonsFastHelp = () => RenderFastHelp();

const EnableHilightsAndHelpText = () => gfRenderHilights = true;
const DisableHilightsAndHelpText = () => gfRenderHilights = false;

export const enum Enum28 {
  DEFAULT_STATUS_NONE,
  DEFAULT_STATUS_DARKBORDER, // shades the borders 2 pixels deep
  DEFAULT_STATUS_DOTTEDINTERIOR, // draws the familiar dotted line in the interior portion of the button.
  DEFAULT_STATUS_WINDOWS95, // both DARKBORDER and DOTTEDINTERIOR
}

// for use with SpecifyDisabledButtonStyle
export const enum Enum29 {
  DISABLED_STYLE_NONE, // for dummy buttons, panels, etc.  Always displays normal state.
  DISABLED_STYLE_DEFAULT, // if button has text then shade, else hatch
  DISABLED_STYLE_HATCHED, // always hatches the disabled button
  DISABLED_STYLE_SHADED, // always shades the disabled button 25% darker
}

export const DEFAULT_MOVE_CALLBACK = () => BtnGenericMouseMoveButtonCallback;

}
