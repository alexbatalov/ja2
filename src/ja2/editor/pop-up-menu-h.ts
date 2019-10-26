// popupmenu.h
// Author:  Kris Morness
// Created:  Sept 4, 1997

/*
POPUP MENU

DESIGN CONSIDERATIONS
There is currently no support for nested popup menus.  Let Kris know if
you need this.

USER INSTRUCTIONS
The goal of this popup menu system is to create a quick and intuitive
interface system which is functionally similar to Win95 and MacOS.
As soon as you click on a button which activates the popup menu, the user
will choose a selection in one of three ways:

        1) KEYBOARD - at anytime, the user can use the keyboard regardless of mouse
                 mode.  The up/down arrow keys will cycle through the choices and enter will
                 accept the choice.  ESC will cancel the menu without making a choice.
        2) When the mousedown event activates the menu, the user releases the mouse before
                 entering the popup menu region.  The menu mode will change and become persistant.
                 Clicking on the hilighted item will close the popup and activate the choice.
                 Clicking elsewhere, the popup will be closed without making a selection.  This
                 is functionally equivalent to Win95.
        3) When the mousedown event activates the menu, the user holds the mouse down and
                 moves the cursor over the popup region.  At this moment the menu becomes
                 non-persistant and a choice is made by releasing the mouse.  If the mouse is
                 released on a highlighted choice, that choice is selected, otherwise the popup
                 is cancelled.  This is functionally equivalent to MacOS.  The small diffence is
                 that under Win95's standard convention, the release of the mouse outside of the
                 region doesn't kill the menu, but in MacOS, it does.
*/

export const enum Enum53 {
  CHANGETSET_POPUP,
  CHANGECIVGROUP_POPUP,
  SCHEDULEACTION_POPUP,
  ACTIONITEM_POPUP,
  OWNERSHIPGROUP_POPUP,
}

// The direction of the popup menu relative to the button
// pressed to activate it or mouse position.  In editor mode,
// this will attempt to go up and to the right of the button.
const UPMASK = 0x00;
const DNMASK = 0x10;
const RTMASK = 0x00;
const LTMASK = 0x01;
export const DIR_UPRIGHT = (UPMASK + RTMASK);
export const DIR_UPLEFT = (UPMASK + LTMASK);
export const DIR_DOWNRIGHT = (DNMASK + RTMASK);
export const DIR_DOWNLEFT = (DNMASK + LTMASK);

export const POPUP_ACTIVETYPE_NOT_YET_DETERMINED = 0;
export const POPUP_ACTIVETYPE_PERSISTANT = 1;
export const POPUP_ACTIVETYPE_NONPERSISTANT = 2;

export const MAX_COLUMNS = 8;

// This structure contains all the required information for rendering
// the popup menu while in
export interface CurrentPopupMenuInformation {
  ubPopupMenuID: UINT8;
  ubSelectedIndex: UINT8; // current popup menu index hilited.
  ubNumEntries: UINT8;
  ubColumns: UINT8;
  ubMaxEntriesPerColumn: UINT8;
  ubColumnWidth: UINT8[] /* [MAX_COLUMNS] */;
  ubActiveType: UINT8;
  usFont: UINT16;
  fActive: boolean;
  fUseKeyboardInfoUntilMouseMoves: boolean;

  // popup region coords.
  usLeft: UINT16;
  usTop: UINT16;
  usRight: UINT16;
  usBottom: UINT16;

  usLastMouseX: UINT16;
  usLastMouseY: UINT16;
}
