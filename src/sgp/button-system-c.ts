/***********************************************************************************************
        Button System.c

        Rewritten mostly by Kris Morness
***********************************************************************************************/

// ATE: Added to let Wiz default creating mouse regions with no cursor, JA2 default to a cursor ( first one )
const MSYS_STARTING_CURSORVAL = 0;
const COLOR_DKGREY = 136;

const MAX_GENERIC_PICS = 40;
const MAX_BUTTON_ICONS = 40;

const GUI_BTN_NONE = 0;
const GUI_BTN_DUPLICATE_VOBJ = 1;
const GUI_BTN_EXTERNAL_VOBJ = 2;

let str: UINT8[] /* [128] */;

// Kris:  December 2, 1997
// Special internal debugging utilities that will ensure that you don't attempt to delete
// an already deleted button, or it's images, etc.  It will also ensure that you don't create
// the same button that already exists.
// TO REMOVE ALL DEBUG FUNCTIONALITY:  simply comment out BUTTONSYSTEM_DEBUGGING definition

// Kris:
// These are the variables used for the anchoring of a particular button.
// When you click on a button, it get's anchored, until you release the mouse button.
// When you move around, you don't want to select other buttons, even when you release
// it.  This follows the Windows 95 convention.
let gpAnchoredButton: Pointer<GUI_BUTTON>;
let gpPrevAnchoredButton: Pointer<GUI_BUTTON>;
let gfAnchoredState: BOOLEAN;

let gbDisabledButtonStyle: INT8;

let gpCurrentFastHelpButton: Pointer<GUI_BUTTON>;

let gfRenderHilights: BOOLEAN = TRUE;

let ButtonPictures: BUTTON_PICS[] /* [MAX_BUTTON_PICS] */;
let ButtonPicsLoaded: INT32;

let ButtonDestBuffer: UINT32 = BACKBUFFER;
let ButtonDestPitch: UINT32 = 640 * 2;
let ButtonDestBPP: UINT32 = 16;

let ButtonList: Pointer<GUI_BUTTON>[] /* [MAX_BUTTONS] */;

let ButtonsInList: INT32 = 0;

function GetWidthOfButtonPic(usButtonPicID: UINT16, iSlot: INT32): UINT16 {
  return ButtonPictures[usButtonPicID].vobj.value.pETRLEObject[iSlot].usWidth;
}

let GenericButtonGrayed: HVOBJECT[] /* [MAX_GENERIC_PICS] */;
let GenericButtonOffNormal: HVOBJECT[] /* [MAX_GENERIC_PICS] */;
let GenericButtonOffHilite: HVOBJECT[] /* [MAX_GENERIC_PICS] */;
let GenericButtonOnNormal: HVOBJECT[] /* [MAX_GENERIC_PICS] */;
let GenericButtonOnHilite: HVOBJECT[] /* [MAX_GENERIC_PICS] */;
let GenericButtonBackground: HVOBJECT[] /* [MAX_GENERIC_PICS] */;
let GenericButtonFillColors: UINT16[] /* [MAX_GENERIC_PICS] */;
let GenericButtonBackgroundIndex: UINT16[] /* [MAX_GENERIC_PICS] */;
let GenericButtonOffsetX: INT16[] /* [MAX_GENERIC_PICS] */;
let GenericButtonOffsetY: INT16[] /* [MAX_GENERIC_PICS] */;

let GenericButtonIcons: HVOBJECT[] /* [MAX_BUTTON_ICONS] */;

// flag to state we wish to render buttons on the one after the next pass through render buttons
let fPausedMarkButtonsDirtyFlag: BOOLEAN = FALSE;
let fDisableHelpTextRestoreFlag: BOOLEAN = FALSE;

let gfDelayButtonDeletion: BOOLEAN = FALSE;
let gfPendingButtonDeletion: BOOLEAN = FALSE;

//=============================================================================
//	FindFreeButtonSlot
//
//	Finds an available slot for loading button pictures
//
function FindFreeButtonSlot(): INT32 {
  let slot: int;

  // Are there any slots available?
  if (ButtonPicsLoaded >= MAX_BUTTON_PICS)
    return BUTTON_NO_SLOT;

  // Search for a slot
  for (slot = 0; slot < MAX_BUTTON_PICS; slot++) {
    if (ButtonPictures[slot].vobj == NULL)
      return slot;
  }

  return BUTTON_NO_SLOT;
}

//=============================================================================
//	LoadButtonImage
//
//	Load images for use with QuickButtons.
//
function LoadButtonImage(filename: Pointer<UINT8>, Grayed: INT32, OffNormal: INT32, OffHilite: INT32, OnNormal: INT32, OnHilite: INT32): INT32 {
  let vo_desc: VOBJECT_DESC;
  let UseSlot: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let MaxHeight: UINT32;
  let MaxWidth: UINT32;
  let ThisHeight: UINT32;
  let ThisWidth: UINT32;
  let MemBefore: UINT32;
  let MemAfter: UINT32;
  let MemUsed: UINT32;

  AssertMsg(filename != BUTTON_NO_FILENAME, "Attempting to LoadButtonImage() with null filename.");
  AssertMsg(strlen(filename), "Attempting to LoadButtonImage() with empty filename string.");

  // is there ANY file to open?
  if ((Grayed == BUTTON_NO_IMAGE) && (OffNormal == BUTTON_NO_IMAGE) && (OffHilite == BUTTON_NO_IMAGE) && (OnNormal == BUTTON_NO_IMAGE) && (OnHilite == BUTTON_NO_IMAGE)) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("No button pictures selected for %s", filename));
    return -1;
  }

  // Get a button image slot
  if ((UseSlot = FindFreeButtonSlot()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("Out of button image slots for %s", filename));
    return -1;
  }

  // Load the image
  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, filename);

  MemBefore = MemGetFree();
  if ((ButtonPictures[UseSlot].vobj = CreateVideoObject(addressof(vo_desc))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("Couldn't create VOBJECT for %s", filename));
    return -1;
  }
  MemAfter = MemGetFree();
  MemUsed = MemBefore - MemAfter;

  // Init the QuickButton image structure with indexes to use
  ButtonPictures[UseSlot].Grayed = Grayed;
  ButtonPictures[UseSlot].OffNormal = OffNormal;
  ButtonPictures[UseSlot].OffHilite = OffHilite;
  ButtonPictures[UseSlot].OnNormal = OnNormal;
  ButtonPictures[UseSlot].OnHilite = OnHilite;
  ButtonPictures[UseSlot].fFlags = GUI_BTN_NONE;

  // Fit the button size to the largest image in the set
  MaxWidth = MaxHeight = 0;
  if (Grayed != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[Grayed]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OffNormal != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OffNormal]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OffHilite != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OffHilite]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OnNormal != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OnNormal]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OnHilite != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OnHilite]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  // Set the width and height for this image set
  ButtonPictures[UseSlot].MaxHeight = MaxHeight;
  ButtonPictures[UseSlot].MaxWidth = MaxWidth;

  // return the image slot number
  ButtonPicsLoaded++;
  return UseSlot;
}

//=============================================================================
//	UseLoadedButtonImage
//
//	Uses a previously loaded quick button image for use with QuickButtons.
//	The function simply duplicates the vobj!
//
function UseLoadedButtonImage(LoadedImg: INT32, Grayed: INT32, OffNormal: INT32, OffHilite: INT32, OnNormal: INT32, OnHilite: INT32): INT32 {
  let UseSlot: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let MaxHeight: UINT32;
  let MaxWidth: UINT32;
  let ThisHeight: UINT32;
  let ThisWidth: UINT32;

  // Is button image index given valid?
  if (ButtonPictures[LoadedImg].vobj == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("Invalid button picture handle given for pre-loaded button image %d", LoadedImg));
    return -1;
  }

  // Is button image an external vobject?
  if (ButtonPictures[LoadedImg].fFlags & GUI_BTN_EXTERNAL_VOBJ) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("Invalid button picture handle given (%d), cannot use external images as duplicates.", LoadedImg));
    return -1;
  }

  // is there ANY file to open?
  if ((Grayed == BUTTON_NO_IMAGE) && (OffNormal == BUTTON_NO_IMAGE) && (OffHilite == BUTTON_NO_IMAGE) && (OnNormal == BUTTON_NO_IMAGE) && (OnHilite == BUTTON_NO_IMAGE)) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("No button pictures selected for pre-loaded button image %d", LoadedImg));
    return -1;
  }

  // Get a button image slot
  if ((UseSlot = FindFreeButtonSlot()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("Out of button image slots for pre-loaded button image %d", LoadedImg));
    return -1;
  }

  // Init the QuickButton image structure with indexes to use
  ButtonPictures[UseSlot].vobj = ButtonPictures[LoadedImg].vobj;
  ButtonPictures[UseSlot].Grayed = Grayed;
  ButtonPictures[UseSlot].OffNormal = OffNormal;
  ButtonPictures[UseSlot].OffHilite = OffHilite;
  ButtonPictures[UseSlot].OnNormal = OnNormal;
  ButtonPictures[UseSlot].OnHilite = OnHilite;
  ButtonPictures[UseSlot].fFlags = GUI_BTN_DUPLICATE_VOBJ;

  // Fit the button size to the largest image in the set
  MaxWidth = MaxHeight = 0;
  if (Grayed != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[Grayed]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OffNormal != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OffNormal]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OffHilite != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OffHilite]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OnNormal != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OnNormal]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OnHilite != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OnHilite]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  // Set the width and height for this image set
  ButtonPictures[UseSlot].MaxHeight = MaxHeight;
  ButtonPictures[UseSlot].MaxWidth = MaxWidth;

  // return the image slot number
  ButtonPicsLoaded++;
  return UseSlot;
}

//=============================================================================
//	UseVObjAsButtonImage
//
//	Uses a previously loaded VObject for use with QuickButtons.
//	The function simply duplicates the vobj pointer and uses that.
//
//		**** NOTE ****
//			The image isn't unloaded with a call to UnloadButtonImage. The internal
//			structures are simply removed from the button image list. It's up to
//			the user to actually unload the image.
//
function UseVObjAsButtonImage(hVObject: HVOBJECT, Grayed: INT32, OffNormal: INT32, OffHilite: INT32, OnNormal: INT32, OnHilite: INT32): INT32 {
  let UseSlot: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let MaxHeight: UINT32;
  let MaxWidth: UINT32;
  let ThisHeight: UINT32;
  let ThisWidth: UINT32;

  // Is button image index given valid?
  if (hVObject == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("UseVObjAsButtonImage: Invalid VObject image given"));
    return -1;
  }

  // is there ANY file to open?
  if ((Grayed == BUTTON_NO_IMAGE) && (OffNormal == BUTTON_NO_IMAGE) && (OffHilite == BUTTON_NO_IMAGE) && (OnNormal == BUTTON_NO_IMAGE) && (OnHilite == BUTTON_NO_IMAGE)) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("UseVObjAsButtonImage: No button pictures indexes selected for VObject"));
    return -1;
  }

  // Get a button image slot
  if ((UseSlot = FindFreeButtonSlot()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("UseVObjAsButtonImage: Out of button image slots for VObject"));
    return -1;
  }

  // Init the QuickButton image structure with indexes to use
  ButtonPictures[UseSlot].vobj = hVObject;
  ButtonPictures[UseSlot].Grayed = Grayed;
  ButtonPictures[UseSlot].OffNormal = OffNormal;
  ButtonPictures[UseSlot].OffHilite = OffHilite;
  ButtonPictures[UseSlot].OnNormal = OnNormal;
  ButtonPictures[UseSlot].OnHilite = OnHilite;
  ButtonPictures[UseSlot].fFlags = GUI_BTN_EXTERNAL_VOBJ;

  // Fit the button size to the largest image in the set
  MaxWidth = MaxHeight = 0;
  if (Grayed != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[Grayed]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OffNormal != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OffNormal]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OffHilite != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OffHilite]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OnNormal != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OnNormal]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  if (OnHilite != BUTTON_NO_IMAGE) {
    pTrav = addressof(ButtonPictures[UseSlot].vobj.value.pETRLEObject[OnHilite]);
    ThisHeight = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    ThisWidth = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    if (MaxWidth < ThisWidth)
      MaxWidth = ThisWidth;
    if (MaxHeight < ThisHeight)
      MaxHeight = ThisHeight;
  }

  // Set the width and height for this image set
  ButtonPictures[UseSlot].MaxHeight = MaxHeight;
  ButtonPictures[UseSlot].MaxWidth = MaxWidth;

  // return the image slot number
  ButtonPicsLoaded++;
  return UseSlot;
}

//=============================================================================
//	SetButtonDestBuffer
//
//	Sets the destination buffer for all button blits.
//
function SetButtonDestBuffer(DestBuffer: UINT32): BOOLEAN {
  if (DestBuffer != BUTTON_USE_DEFAULT)
    ButtonDestBuffer = DestBuffer;

  return TRUE;
}

// Removes a QuickButton image from the system.
function UnloadButtonImage(Index: INT32): void {
  let x: INT32;
  let fDone: BOOLEAN;

  if (Index < 0 || Index >= MAX_BUTTON_PICS) {
    sprintf(str, "Attempting to UnloadButtonImage with out of range index %d.", Index);
    AssertMsg(0, str);
  }

  if (!ButtonPictures[Index].vobj) {
      return;
    AssertMsg(0, "Attempting to UnloadButtonImage that has a null vobj (already deleted).");
  }

  // If this is a duplicated button image, then don't trash the vobject
  if (ButtonPictures[Index].fFlags & GUI_BTN_DUPLICATE_VOBJ || ButtonPictures[Index].fFlags & GUI_BTN_EXTERNAL_VOBJ) {
    ButtonPictures[Index].vobj = NULL;
    ButtonPicsLoaded--;
  } else {
    // Deleting a non-duplicate, so see if any dups present. if so, then
    // convert one of them to an original!

    fDone = FALSE;
    for (x = 0; x < MAX_BUTTON_PICS && !fDone; x++) {
      if ((x != Index) && (ButtonPictures[x].vobj == ButtonPictures[Index].vobj)) {
        if (ButtonPictures[x].fFlags & GUI_BTN_DUPLICATE_VOBJ) {
          // If we got here, then we got a duplicate object of the one we
          // want to delete, so convert it to an original!
          ButtonPictures[x].fFlags &= (~GUI_BTN_DUPLICATE_VOBJ);

          // Now remove this button, but not it's vobject
          ButtonPictures[Index].vobj = NULL;

          fDone = TRUE;
          ButtonPicsLoaded--;
        }
      }
    }
  }

  // If image slot isn't empty, delete the image
  if (ButtonPictures[Index].vobj != NULL) {
    DeleteVideoObject(ButtonPictures[Index].vobj);
    ButtonPictures[Index].vobj = NULL;
    ButtonPicsLoaded--;
  }
}

//=============================================================================
//	EnableButton
//
//	Enables an already created button.
//
function EnableButton(iButtonID: INT32): BOOLEAN {
  let b: Pointer<GUI_BUTTON>;
  let OldState: UINT32;

  if (iButtonID < 0 || iButtonID >= MAX_BUTTONS) {
    sprintf(str, "Attempting to EnableButton with out of range buttonID %d.", iButtonID);
    AssertMsg(0, str);
  }

  b = ButtonList[iButtonID];

  // If button exists, set the ENABLED flag
  if (b) {
    OldState = b.value.uiFlags & BUTTON_ENABLED;
    b.value.uiFlags |= (BUTTON_ENABLED | BUTTON_DIRTY);
  } else
    OldState = 0;

  // Return previous ENABLED state of this button
  return (OldState == BUTTON_ENABLED) ? TRUE : FALSE;
}

//=============================================================================
//	DisableButton
//
//	Disables a button. The button remains in the system list, and can be
//	reactivated by calling EnableButton.
//
//	Diabled buttons will appear "grayed out" on the screen (unless the
//	graphics for such are not available).
//
function DisableButton(iButtonID: INT32): BOOLEAN {
  let b: Pointer<GUI_BUTTON>;
  let OldState: UINT32;

  if (iButtonID < 0 || iButtonID >= MAX_BUTTONS) {
    sprintf(str, "Attempting to DisableButton with out of range buttonID %d.", iButtonID);
    AssertMsg(0, str);
  }

  b = ButtonList[iButtonID];

  // If button exists, reset the ENABLED flag
  if (b) {
    OldState = b.value.uiFlags & BUTTON_ENABLED;
    b.value.uiFlags &= (~BUTTON_ENABLED);
    b.value.uiFlags |= BUTTON_DIRTY;
  } else
    OldState = 0;

  // Return previous ENABLED state of button
  return (OldState == BUTTON_ENABLED) ? TRUE : FALSE;
}

//=============================================================================
//	InitializeButtonImageManager
//
//	Initializes the button image sub-system. This function is called by
//	InitButtonSystem.
//
function InitializeButtonImageManager(DefaultBuffer: INT32, DefaultPitch: INT32, DefaultBPP: INT32): BOOLEAN {
  let vo_desc: VOBJECT_DESC;
  let Pix: UINT8;
  let x: int;

  // Set up the default settings
  if (DefaultBuffer != BUTTON_USE_DEFAULT)
    ButtonDestBuffer = DefaultBuffer;
  else
    ButtonDestBuffer = FRAME_BUFFER;

  if (DefaultPitch != BUTTON_USE_DEFAULT)
    ButtonDestPitch = DefaultPitch;
  else
    ButtonDestPitch = 640 * 2;

  if (DefaultBPP != BUTTON_USE_DEFAULT)
    ButtonDestBPP = DefaultBPP;
  else
    ButtonDestBPP = 16;

  // Blank out all QuickButton images
  for (x = 0; x < MAX_BUTTON_PICS; x++) {
    ButtonPictures[x].vobj = NULL;
    ButtonPictures[x].Grayed = -1;
    ButtonPictures[x].OffNormal = -1;
    ButtonPictures[x].OffHilite = -1;
    ButtonPictures[x].OnNormal = -1;
    ButtonPictures[x].OnHilite = -1;
  }
  ButtonPicsLoaded = 0;

  // Blank out all Generic button data
  for (x = 0; x < MAX_GENERIC_PICS; x++) {
    GenericButtonGrayed[x] = NULL;
    GenericButtonOffNormal[x] = NULL;
    GenericButtonOffHilite[x] = NULL;
    GenericButtonOnNormal[x] = NULL;
    GenericButtonOnHilite[x] = NULL;
    GenericButtonBackground[x] = NULL;
    GenericButtonBackgroundIndex[x] = 0;
    GenericButtonFillColors[x] = 0;
    GenericButtonBackgroundIndex[x] = 0;
    GenericButtonOffsetX[x] = 0;
    GenericButtonOffsetY[x] = 0;
  }

  // Blank out all icon images
  for (x = 0; x < MAX_BUTTON_ICONS; x++)
    GenericButtonIcons[x] = NULL;

  // Load the default generic button images
  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, DEFAULT_GENERIC_BUTTON_OFF);

  if ((GenericButtonOffNormal[0] = CreateVideoObject(addressof(vo_desc))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "Couldn't create VOBJECT for " + DEFAULT_GENERIC_BUTTON_OFF);
    return FALSE;
  }

  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, DEFAULT_GENERIC_BUTTON_ON);

  if ((GenericButtonOnNormal[0] = CreateVideoObject(addressof(vo_desc))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "Couldn't create VOBJECT for " + DEFAULT_GENERIC_BUTTON_ON);
    return FALSE;
  }

  // Load up the off hilite and on hilite images. We won't check for errors because if the file
  // doesn't exists, the system simply ignores that file. These are only here as extra images, they
  // aren't required for operation (only OFF Normal and ON Normal are required).
  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, DEFAULT_GENERIC_BUTTON_OFF_HI);
  GenericButtonOffHilite[0] = CreateVideoObject(addressof(vo_desc));

  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, DEFAULT_GENERIC_BUTTON_ON_HI);
  GenericButtonOnHilite[0] = CreateVideoObject(addressof(vo_desc));

  Pix = 0;
  if (!GetETRLEPixelValue(addressof(Pix), GenericButtonOffNormal[0], 8, 0, 0)) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "Couldn't get generic button's background pixel value");
    return FALSE;
  }

  if (GETPIXELDEPTH() == 16)
    GenericButtonFillColors[0] = GenericButtonOffNormal[0].value.p16BPPPalette[Pix];
  else if (GETPIXELDEPTH() == 8)
    GenericButtonFillColors[0] = COLOR_DKGREY;

  return TRUE;
}

//=============================================================================
//	FindFreeGenericSlot
//
//	Finds the next available slot for generic (TEXT and/or ICONIC) buttons.
//
function FindFreeGenericSlot(): INT16 {
  let slot: INT16;
  let x: INT16;

  slot = BUTTON_NO_SLOT;
  for (x = 0; x < MAX_GENERIC_PICS && slot < 0; x++) {
    if (GenericButtonOffNormal[x] == NULL)
      slot = x;
  }

  return slot;
}

//=============================================================================
//	FindFreeIconSlot
//
//	Finds the next available slot for button icon images.
//
function FindFreeIconSlot(): INT16 {
  let slot: INT16;
  let x: INT16;

  slot = BUTTON_NO_SLOT;
  for (x = 0; x < MAX_BUTTON_ICONS && slot < 0; x++) {
    if (GenericButtonIcons[x] == NULL)
      slot = x;
  }

  return slot;
}

//=============================================================================
//	LoadGenericButtonIcon
//
//	Loads an image file for use as a button icon.
//
function LoadGenericButtonIcon(filename: Pointer<UINT8>): INT16 {
  let ImgSlot: INT16;
  let vo_desc: VOBJECT_DESC;

  AssertMsg(filename != BUTTON_NO_FILENAME, "Attempting to LoadGenericButtonIcon() with null filename.");

  // Get slot for icon image
  if ((ImgSlot = FindFreeIconSlot()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "LoadGenericButtonIcon: Out of generic button icon slots");
    return -1;
  }

  // Load the icon
  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, filename);

  if ((GenericButtonIcons[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonIcon: Couldn't create VOBJECT for %s", filename));
    return -1;
  }

  // Return the slot number
  return ImgSlot;
}

//=============================================================================
//	UnloadGenericButtonIcon
//
//	Removes a button icon graphic from the system
//
function UnloadGenericButtonIcon(GenImg: INT16): BOOLEAN {
  if (GenImg < 0 || GenImg >= MAX_BUTTON_ICONS) {
    sprintf(str, "Attempting to UnloadGenericButtonIcon with out of range index %d.", GenImg);
    AssertMsg(0, str);
  }

  if (!GenericButtonIcons[GenImg]) {
      return FALSE;
    AssertMsg(0, "Attempting to UnloadGenericButtonIcon that has no icon (already deleted).");
  }
  // If an icon is present in the slot, remove it.
  DeleteVideoObject(GenericButtonIcons[GenImg]);
  GenericButtonIcons[GenImg] = NULL;
  return TRUE;
}

//=============================================================================
//	UnloadGenericButtonImage
//
//	Removes the images associated with a generic button. Except the icon
//	image of iconic buttons. See above.
//
function UnloadGenericButtonImage(GenImg: INT16): BOOLEAN {
  let fDeletedSomething: BOOLEAN = FALSE;
  if (GenImg < 0 || GenImg >= MAX_GENERIC_PICS) {
    sprintf(str, "Attempting to UnloadGenericButtonImage with out of range index %d.", GenImg);
    AssertMsg(0, str);
  }

  // For each possible image type in a generic button, check if it's
  // present, and if so, remove it.
  if (GenericButtonGrayed[GenImg] != NULL) {
    DeleteVideoObject(GenericButtonGrayed[GenImg]);
    GenericButtonGrayed[GenImg] = NULL;
    fDeletedSomething = TRUE;
  }

  if (GenericButtonOffNormal[GenImg] != NULL) {
    DeleteVideoObject(GenericButtonOffNormal[GenImg]);
    GenericButtonOffNormal[GenImg] = NULL;
    fDeletedSomething = TRUE;
  }

  if (GenericButtonOffHilite[GenImg] != NULL) {
    DeleteVideoObject(GenericButtonOffHilite[GenImg]);
    GenericButtonOffHilite[GenImg] = NULL;
    fDeletedSomething = TRUE;
  }

  if (GenericButtonOnNormal[GenImg] != NULL) {
    DeleteVideoObject(GenericButtonOnNormal[GenImg]);
    GenericButtonOnNormal[GenImg] = NULL;
    fDeletedSomething = TRUE;
  }

  if (GenericButtonOnHilite[GenImg] != NULL) {
    DeleteVideoObject(GenericButtonOnHilite[GenImg]);
    GenericButtonOnHilite[GenImg] = NULL;
    fDeletedSomething = TRUE;
  }

  if (GenericButtonBackground[GenImg] != NULL) {
    DeleteVideoObject(GenericButtonBackground[GenImg]);
    GenericButtonBackground[GenImg] = NULL;
    fDeletedSomething = TRUE;
  }

  // Reset the remaining variables
  GenericButtonFillColors[GenImg] = 0;
  GenericButtonBackgroundIndex[GenImg] = 0;
  GenericButtonOffsetX[GenImg] = 0;
  GenericButtonOffsetY[GenImg] = 0;

  return TRUE;
}

//=============================================================================
//	LoadGenericButtonImages
//
//	Loads the image files required for displaying a generic button.
//
function LoadGenericButtonImages(GrayName: Pointer<UINT8>, OffNormName: Pointer<UINT8>, OffHiliteName: Pointer<UINT8>, OnNormName: Pointer<UINT8>, OnHiliteName: Pointer<UINT8>, BkGrndName: Pointer<UINT8>, Index: INT16, OffsetX: INT16, OffsetY: INT16): INT16 {
  let ImgSlot: INT16;
  let vo_desc: VOBJECT_DESC;
  let Pix: UINT8;

  // if the images for Off-Normal and On-Normal don't exist, abort call
  if ((OffNormName == BUTTON_NO_FILENAME) || (OnNormName == BUTTON_NO_FILENAME)) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "LoadGenericButtonImages: No filenames for OFFNORMAL and/or ONNORMAL images");
    return -1;
  }

  // Get a slot number for these images
  if ((ImgSlot = FindFreeGenericSlot()) == -1) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "LoadGenericButtonImages: Out of generic button slots");
    return -1;
  }

  // Load the image for the Off-Normal button state (required)
  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, OffNormName);

  if ((GenericButtonOffNormal[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonImages: Couldn't create VOBJECT for %s", OffNormName));
    return -1;
  }

  // Load the image for the On-Normal button state (required)
  vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  strcpy(vo_desc.ImageFile, OnNormName);

  if ((GenericButtonOnNormal[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonImages: Couldn't create VOBJECT for %s", OnNormName));
    return -1;
  }

  // For the optional button state images, see if a filename was given, and
  // if so, load it.

  if (GrayName != BUTTON_NO_FILENAME) {
    vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(vo_desc.ImageFile, GrayName);

    if ((GenericButtonGrayed[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
      DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonImages: Couldn't create VOBJECT for %s", GrayName));
      return -1;
    }
  } else
    GenericButtonGrayed[ImgSlot] = NULL;

  if (OffHiliteName != BUTTON_NO_FILENAME) {
    vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(vo_desc.ImageFile, OffHiliteName);

    if ((GenericButtonOffHilite[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
      DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonImages: Couldn't create VOBJECT for %s", OffHiliteName));
      return -1;
    }
  } else
    GenericButtonOffHilite[ImgSlot] = NULL;

  if (OnHiliteName != BUTTON_NO_FILENAME) {
    vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(vo_desc.ImageFile, OnHiliteName);

    if ((GenericButtonOnHilite[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
      DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonImages: Couldn't create VOBJECT for %s", OnHiliteName));
      return -1;
    }
  } else
    GenericButtonOnHilite[ImgSlot] = NULL;

  if (BkGrndName != BUTTON_NO_FILENAME) {
    vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(vo_desc.ImageFile, BkGrndName);

    if ((GenericButtonBackground[ImgSlot] = CreateVideoObject(addressof(vo_desc))) == NULL) {
      DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, String("LoadGenericButtonImages: Couldn't create VOBJECT for %s", BkGrndName));
      return -1;
    }
  } else
    GenericButtonBackground[ImgSlot] = NULL;

  GenericButtonBackgroundIndex[ImgSlot] = Index;

  // Get the background fill color from the last (9th) sub-image in the
  // Off-Normal image.
  Pix = 0;
  if (!GetETRLEPixelValue(addressof(Pix), GenericButtonOffNormal[ImgSlot], 8, 0, 0)) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "LoadGenericButtonImages: Couldn't get generic button's background pixel value");
    return -1;
  }

  GenericButtonFillColors[ImgSlot] = GenericButtonOffNormal[ImgSlot].value.p16BPPPalette[Pix];

  // Set the button's background image adjustement offsets
  GenericButtonOffsetX[ImgSlot] = OffsetX;
  GenericButtonOffsetY[ImgSlot] = OffsetY;

  // Return the slot number used.
  return ImgSlot;
}

//=============================================================================
//	ShutdownButtonImageManager
//
//	Cleans up, and shuts down the button image manager sub-system.
//
//	This function is called by ShutdownButtonSystem.
//
function ShutdownButtonImageManager(): void {
  let x: int;

  // Remove all QuickButton images
  for (x = 0; x < MAX_BUTTON_PICS; x++)
    UnloadButtonImage(x);

  // Remove all GenericButton images
  for (x = 0; x < MAX_GENERIC_PICS; x++) {
    if (GenericButtonGrayed[x] != NULL) {
      DeleteVideoObject(GenericButtonGrayed[x]);
      GenericButtonGrayed[x] = NULL;
    }

    if (GenericButtonOffNormal[x] != NULL) {
      DeleteVideoObject(GenericButtonOffNormal[x]);
      GenericButtonOffNormal[x] = NULL;
    }

    if (GenericButtonOffHilite[x] != NULL) {
      DeleteVideoObject(GenericButtonOffHilite[x]);
      GenericButtonOffHilite[x] = NULL;
    }

    if (GenericButtonOnNormal[x] != NULL) {
      DeleteVideoObject(GenericButtonOnNormal[x]);
      GenericButtonOnNormal[x] = NULL;
    }

    if (GenericButtonOnHilite[x] != NULL) {
      DeleteVideoObject(GenericButtonOnHilite[x]);
      GenericButtonOnHilite[x] = NULL;
    }

    if (GenericButtonBackground[x] != NULL) {
      DeleteVideoObject(GenericButtonBackground[x]);
      GenericButtonBackground[x] = NULL;
    }

    GenericButtonFillColors[x] = 0;
    GenericButtonBackgroundIndex[x] = 0;
    GenericButtonOffsetX[x] = 0;
    GenericButtonOffsetY[x] = 0;
  }

  // Remove all button icons
  for (x = 0; x < MAX_BUTTON_ICONS; x++) {
    if (GenericButtonIcons[x] != NULL)
      GenericButtonIcons[x] = NULL;
  }
}

//=============================================================================
//	InitButtonSystem
//
//	Initializes the GUI button system for use. Must be called before using
//	any other button functions.
//
function InitButtonSystem(): BOOLEAN {
  let x: INT32;

  RegisterDebugTopic(TOPIC_BUTTON_HANDLER, "Button System & Button Image Manager");

  // Clear out button list
  for (x = 0; x < MAX_BUTTONS; x++) {
    ButtonList[x] = NULL;
  }

  // Initialize the button image manager sub-system
  if (InitializeButtonImageManager(-1, -1, -1) == FALSE) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "Failed button image manager init\n");
    return FALSE;
  }

  ButtonsInList = 0;

  return TRUE;
}

//=============================================================================
//	ShutdownButtonSystem
//
//	Shuts down and cleans up the GUI button system. Must be called before
//	exiting the program. Button functions should not be used after calling
//	this function.
//
function ShutdownButtonSystem(): void {
  let x: int;

  // Kill off all buttons in the system
  for (x = 0; x < MAX_BUTTONS; x++) {
    if (ButtonList[x] != NULL)
      RemoveButton(x);
  }
  // Shutdown the button image manager sub-system
  ShutdownButtonImageManager();

  UnRegisterDebugTopic(TOPIC_BUTTON_HANDLER, "Button System & Button Image Manager");
}

function RemoveButtonsMarkedForDeletion(): void {
  let i: INT32;
  for (i = 0; i < MAX_BUTTONS; i++) {
    if (ButtonList[i] && ButtonList[i].value.uiFlags & BUTTON_DELETION_PENDING) {
      RemoveButton(i);
    }
  }
}

//=============================================================================
//	RemoveButton
//
//	Removes a button from the system's list. All memory associated with the
//	button is released.
//
function RemoveButton(iButtonID: INT32): void {
  let b: Pointer<GUI_BUTTON>;

  if (iButtonID < 0 || iButtonID >= MAX_BUTTONS) {
    sprintf(str, "Attempting to RemoveButton with out of range buttonID %d.", iButtonID);
    AssertMsg(0, str);
  }

  b = ButtonList[iButtonID];

  // If button exists...
  if (!b) {
      return;
    AssertMsg(0, "Attempting to remove a button that has already been deleted.");
  }

  // If we happen to be in the middle of a callback, and attempt to delete a button,
  // like deleting a node during list processing, then we delay it till after the callback
  // is completed.
  if (gfDelayButtonDeletion) {
    b.value.uiFlags |= BUTTON_DELETION_PENDING;
    gfPendingButtonDeletion = TRUE;
    return;
  }

  // Kris:
  if (b.value.uiFlags & BUTTON_SELFDELETE_IMAGE) {
    // checkboxes and simple create buttons have their own graphics associated with them,
    // and it is handled internally.  We delete it here.  This provides the advantage of less
    // micromanagement, but with the disadvantage of wasting more memory if you have lots of
    // buttons using the same graphics.
    UnloadButtonImage(b.value.ImageNum);
  }

  // ...kill it!!!
  MSYS_RemoveRegion(addressof(b.value.Area));

  if (b.value.uiFlags & BUTTON_SAVEBACKGROUND) {
    FreeBackgroundRectPending(b.value.BackRect);
  }

  // Get rid of the text string
  if (b.value.string != NULL)
    MemFree(b.value.string);

  if (b == gpAnchoredButton)
    gpAnchoredButton = NULL;
  if (b == gpPrevAnchoredButton)
    gpPrevAnchoredButton = NULL;

  MemFree(b);
  b = NULL;
  ButtonList[iButtonID] = NULL;
}

//=============================================================================
//	GetNextButtonNumber
//
//	Finds the next available button slot.
//
function GetNextButtonNumber(): INT32 {
  let x: INT32;

  for (x = 0; x < MAX_BUTTONS; x++) {
    if (ButtonList[x] == NULL)
      return x;
  }

  return BUTTON_NO_SLOT;
}

//=============================================================================
//	ResizeButton
//
//	Changes the size of a generic button.
//
//	QuickButtons cannot be resized, therefore this function ignores the
//	call if a QuickButton is given.
//
function ResizeButton(iButtonID: INT32, w: INT16, h: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  let xloc: INT32;
  let yloc: INT32;

  if (iButtonID < 0 || iButtonID >= MAX_BUTTONS) {
    sprintf(str, "Attempting to resize button with out of range buttonID %d.", iButtonID);
    AssertMsg(0, str);
  }

  // if button size is too small, adjust it.
  if (w < 4)
    w = 4;
  if (h < 3)
    h = 3;

  b = ButtonList[iButtonID];

  if (!b) {
    sprintf(str, "Attempting to resize deleted button with buttonID %d", iButtonID);
    AssertMsg(0, str);
  }

  // If this is a QuickButton, ignore this call
  if ((b.value.uiFlags & BUTTON_TYPES) == BUTTON_QUICK)
    return;

  // Get current button screen location
  xloc = b.value.XLoc;
  yloc = b.value.YLoc;

  // Set the new MOUSE_REGION area values to reflect change in size.
  b.value.Area.RegionTopLeftX = xloc;
  b.value.Area.RegionTopLeftY = yloc;
  b.value.Area.RegionBottomRightX = (xloc + w);
  b.value.Area.RegionBottomRightY = (yloc + h);
  b.value.uiFlags |= BUTTON_DIRTY;

  if (b.value.uiFlags & BUTTON_SAVEBACKGROUND) {
    FreeBackgroundRectPending(b.value.BackRect);
    b.value.BackRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT | BGND_FLAG_SAVERECT, NULL, xloc, yloc, (xloc + w), (yloc + h));
  }
}

//=============================================================================
//	SetButtonPosition
//
//	Sets the position of a button on the screen. The position is relative
//	to the top left corner of the button.
//
function SetButtonPosition(iButtonID: INT32, x: INT16, y: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  let xloc: INT32;
  let yloc: INT32;
  let w: INT32;
  let h: INT32;

  if (iButtonID < 0 || iButtonID >= MAX_BUTTONS) {
    sprintf(str, "Attempting to set button position with out of range buttonID %d.", iButtonID);
    AssertMsg(0, str);
  }

  b = ButtonList[iButtonID];

  if (!b) {
    sprintf(str, "Attempting to set button position with buttonID %d", iButtonID);
    AssertMsg(0, str);
  }

  // Get new screen position
  xloc = x;
  yloc = y;
  // Compute current width and height of this button
  w = b.value.Area.RegionBottomRightX - b.value.Area.RegionTopLeftX;
  h = b.value.Area.RegionBottomRightY - b.value.Area.RegionTopLeftY;

  // Set button to new location
  b.value.XLoc = x;
  b.value.YLoc = y;
  // Set the buttons MOUSE_REGION to appropriate area
  b.value.Area.RegionTopLeftX = xloc;
  b.value.Area.RegionTopLeftY = yloc;
  b.value.Area.RegionBottomRightX = (xloc + w);
  b.value.Area.RegionBottomRightY = (yloc + h);
  b.value.uiFlags |= BUTTON_DIRTY;

  if (b.value.uiFlags & BUTTON_SAVEBACKGROUND) {
    FreeBackgroundRectPending(b.value.BackRect);
    b.value.BackRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT | BGND_FLAG_SAVERECT, NULL, xloc, yloc, (xloc + w), (yloc + h));
  }
}

//=============================================================================
//	SetButtonIcon
//
//	Sets the icon to be displayed on a IconicButton.
//
//	Calling this function with a button type other than Iconic has no effect.
//
function SetButtonIcon(iButtonID: INT32, Icon: INT16, IconIndex: INT16): INT32 {
  let b: Pointer<GUI_BUTTON>;

  if (iButtonID < 0 || iButtonID >= MAX_BUTTONS) {
    sprintf(str, "Attempting to set button icon with out of range buttonID %d.", iButtonID);
    AssertMsg(0, str);
    return -1;
  }
  if (Icon < 0 || Icon >= MAX_BUTTON_ICONS) {
    sprintf(str, "Attempting to set button[%d] icon with out of range icon index %d.", iButtonID, Icon);
    AssertMsg(0, str);
    return -1;
  }

  b = ButtonList[iButtonID];

  if (!b) {
    sprintf(str, "Attempting to set deleted button icon with buttonID %d", iButtonID);
    AssertMsg(0, str);
    return -1;
  }

  // If button isn't an icon button, ignore this call
  if (((b.value.uiFlags & BUTTON_TYPES) == BUTTON_QUICK) || ((b.value.uiFlags & BUTTON_TYPES) == BUTTON_HOT_SPOT) || ((b.value.uiFlags & BUTTON_TYPES) == BUTTON_GENERIC)) {
    return -1;
  }

  // Set the icon number and index to use for this button
  b.value.iIconID = Icon;
  b.value.usIconIndex = IconIndex;

  return Icon;
}

//=============================================================================
//	CreateIconButton
//
//	Creates an Iconic type button.
//
function CreateIconButton(Icon: INT16, IconIndex: INT16, GenImg: INT16, xloc: INT16, yloc: INT16, w: INT16, h: INT16, Type: INT32, Priority: INT16, MoveCallback: GUI_CALLBACK, ClickCallback: GUI_CALLBACK): INT32 {
  let b: Pointer<GUI_BUTTON>;
  let ButtonNum: INT32;
  let BType: INT32;
  let x: INT32;

  if (xloc < 0 || yloc < 0) {
    sprintf(str, "Attempting to CreateIconButton with invalid position of %d,%d", xloc, yloc);
    AssertMsg(0, str);
  }
  if (GenImg < -1 || GenImg >= MAX_GENERIC_PICS) {
    sprintf(str, "Attempting to CreateIconButton with out of range iconID %d.", GenImg);
    AssertMsg(0, str);
  }

  // if button size is too small, adjust it.
  if (w < 4)
    w = 4;
  if (h < 3)
    h = 3;

  // Strip off any extraneous bits from button type
  BType = Type & (BUTTON_TYPE_MASK | BUTTON_NEWTOGGLE);

  // Get a button number (slot) for this new button
  if ((ButtonNum = GetNextButtonNumber()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateIconButton: No more button slots");
    return -1;
  }

  // Allocate memory for the GUI_BUTTON structure
  if ((b = MemAlloc(sizeof(GUI_BUTTON))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateIconButton: Can't alloc mem for button struct");
    return -1;
  }

  // Init the values in the struct
  b.value.uiFlags = BUTTON_DIRTY;
  b.value.uiOldFlags = 0;
  b.value.IDNum = ButtonNum;
  b.value.XLoc = xloc;
  b.value.YLoc = yloc;

  if (GenImg < 0)
    b.value.ImageNum = 0;
  else
    b.value.ImageNum = GenImg;

  for (x = 0; x < 4; x++)
    b.value.UserData[x] = 0;
  b.value.Group = -1;

  b.value.bDefaultStatus = Enum28.DEFAULT_STATUS_NONE;
  b.value.bDisabledStyle = Enum29.DISABLED_STYLE_DEFAULT;
  // Init text
  b.value.string = NULL;
  b.value.usFont = 0;
  b.value.fMultiColor = FALSE;
  b.value.sForeColor = 0;
  b.value.sWrappedWidth = -1;
  b.value.sShadowColor = -1;
  b.value.sForeColorDown = -1;
  b.value.sShadowColorDown = -1;
  b.value.sForeColorHilited = -1;
  b.value.sShadowColorHilited = -1;
  b.value.bJustification = BUTTON_TEXT_CENTER;
  b.value.bTextXOffset = -1;
  b.value.bTextYOffset = -1;
  b.value.bTextXSubOffSet = 0;
  b.value.bTextYSubOffSet = 0;
  b.value.fShiftText = TRUE;
  // Init icon
  b.value.iIconID = Icon;
  b.value.usIconIndex = IconIndex;
  b.value.bIconXOffset = -1;
  b.value.bIconYOffset = -1;
  b.value.fShiftImage = TRUE;

  // Set the click callback function (if any)
  if (ClickCallback != BUTTON_NO_CALLBACK) {
    b.value.ClickCallback = ClickCallback;
    BType |= BUTTON_CLICK_CALLBACK;
  } else
    b.value.ClickCallback = BUTTON_NO_CALLBACK;

  // Set the move callback function (if any)
  if (MoveCallback != BUTTON_NO_CALLBACK) {
    b.value.MoveCallback = MoveCallback;
    BType |= BUTTON_MOVE_CALLBACK;
  } else
    b.value.MoveCallback = BUTTON_NO_CALLBACK;

  // Define a mouse region for this button
  MSYS_DefineRegion(addressof(b.value.Area), xloc, yloc, (xloc + w), (yloc + h), Priority, MSYS_STARTING_CURSORVAL, QuickButtonCallbackMMove, QuickButtonCallbackMButn);

  // Link the mouse region to this button (for callback purposes)
  MSYS_SetRegionUserData(addressof(b.value.Area), 0, ButtonNum);

  // Set this button's flags
  b.value.uiFlags |= (BUTTON_ENABLED | BType | BUTTON_GENERIC);

  b.value.BackRect = -1;

// Add button to the button list
  ButtonList[ButtonNum] = b;

  SpecifyButtonSoundScheme(b.value.IDNum, Enum27.BUTTON_SOUND_SCHEME_GENERIC);

  // return this button's slot number
  return ButtonNum;
}

// Creates a generic button with text on it.
function CreateTextButton(string: Pointer<UINT16>, uiFont: UINT32, sForeColor: INT16, sShadowColor: INT16, GenImg: INT16, xloc: INT16, yloc: INT16, w: INT16, h: INT16, Type: INT32, Priority: INT16, MoveCallback: GUI_CALLBACK, ClickCallback: GUI_CALLBACK): INT32 {
  let b: Pointer<GUI_BUTTON>;
  let ButtonNum: INT32;
  let BType: INT32;
  let x: INT32;

  if (xloc < 0 || yloc < 0) {
    sprintf(str, "Attempting to CreateTextButton with invalid position of %d,%d", xloc, yloc);
    AssertMsg(0, str);
  }
  if (GenImg < -1 || GenImg >= MAX_GENERIC_PICS) {
    sprintf(str, "Attempting to CreateTextButton with out of range iconID %d.", GenImg);
    AssertMsg(0, str);
  }

  // if button size is too small, adjust it.
  if (w < 4)
    w = 4;
  if (h < 3)
    h = 3;

  // Strip off any extraneous bits from button type
  BType = Type & (BUTTON_TYPE_MASK | BUTTON_NEWTOGGLE);

  // Get a button number for this new button
  if ((ButtonNum = GetNextButtonNumber()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateTextButton: No more button slots");
    return -1;
  }

  // Allocate memory for a GUI_BUTTON structure
  if ((b = MemAlloc(sizeof(GUI_BUTTON))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateTextButton: Can't alloc mem for button struct");
    return -1;
  }

  // Allocate memory for the button's text string...
  b.value.string = NULL;
  if (string && wcslen(string)) {
    b.value.string = MemAlloc((wcslen(string) + 1) * sizeof(UINT16));
    AssertMsg(b.value.string, "Out of memory error:  Couldn't allocate string in CreateTextButton.");
    wcscpy(b.value.string, string);
  }

  // Init the button structure variables
  b.value.uiFlags = BUTTON_DIRTY;
  b.value.uiOldFlags = 0;
  b.value.IDNum = ButtonNum;
  b.value.XLoc = xloc;
  b.value.YLoc = yloc;

  if (GenImg < 0)
    b.value.ImageNum = 0;
  else
    b.value.ImageNum = GenImg;

  for (x = 0; x < 4; x++)
    b.value.UserData[x] = 0;
  b.value.Group = -1;
  b.value.bDefaultStatus = Enum28.DEFAULT_STATUS_NONE;
  b.value.bDisabledStyle = Enum29.DISABLED_STYLE_DEFAULT;
  // Init string
  b.value.usFont = uiFont;
  b.value.fMultiColor = FALSE;
  b.value.sForeColor = sForeColor;
  b.value.sWrappedWidth = -1;
  b.value.sShadowColor = sShadowColor;
  b.value.sForeColorDown = -1;
  b.value.sShadowColorDown = -1;
  b.value.sForeColorHilited = -1;
  b.value.sShadowColorHilited = -1;
  b.value.bJustification = BUTTON_TEXT_CENTER;
  b.value.bTextXOffset = -1;
  b.value.bTextYOffset = -1;
  b.value.bTextXSubOffSet = 0;
  b.value.bTextYSubOffSet = 0;
  b.value.fShiftText = TRUE;
  // Init icon
  b.value.iIconID = -1;
  b.value.usIconIndex = -1;
  b.value.bIconXOffset = -1;
  b.value.bIconYOffset = -1;
  b.value.fShiftImage = TRUE;

  // Set the button click callback function (if any)
  if (ClickCallback != BUTTON_NO_CALLBACK) {
    b.value.ClickCallback = ClickCallback;
    BType |= BUTTON_CLICK_CALLBACK;
  } else
    b.value.ClickCallback = BUTTON_NO_CALLBACK;

  // Set the button's mouse movement callback function (if any)
  if (MoveCallback != BUTTON_NO_CALLBACK) {
    b.value.MoveCallback = MoveCallback;
    BType |= BUTTON_MOVE_CALLBACK;
  } else
    b.value.MoveCallback = BUTTON_NO_CALLBACK;

  // Define a MOUSE_REGION for this button
  MSYS_DefineRegion(addressof(b.value.Area), xloc, yloc, (xloc + w), (yloc + h), Priority, MSYS_STARTING_CURSORVAL, QuickButtonCallbackMMove, QuickButtonCallbackMButn);

  // Link the MOUSE_REGION to this button
  MSYS_SetRegionUserData(addressof(b.value.Area), 0, ButtonNum);

  // Set the flags for this button
  b.value.uiFlags |= (BUTTON_ENABLED | BType | BUTTON_GENERIC);

  b.value.BackRect = -1;

// Add this button to the button list
  ButtonList[ButtonNum] = b;

  SpecifyButtonSoundScheme(b.value.IDNum, Enum27.BUTTON_SOUND_SCHEME_GENERIC);

  // return the slot number
  return ButtonNum;
}

//=============================================================================
//	CreateHotSpot
//
//	Creates a button like HotSpot. HotSpots have no graphics associated with
//	them.
//
function CreateHotSpot(xloc: INT16, yloc: INT16, Width: INT16, Height: INT16, Priority: INT16, MoveCallback: GUI_CALLBACK, ClickCallback: GUI_CALLBACK): INT32 {
  let b: Pointer<GUI_BUTTON>;
  let ButtonNum: INT32;
  let BType: INT16;
  let x: INT16;

  if (xloc < 0 || yloc < 0 || Width < 0 || Height < 0) {
    sprintf(str, "Attempting to CreateHotSpot with invalid coordinates: %d,%d, width: %d, and height: %d.", xloc, yloc, Width, Height);
    AssertMsg(0, str);
  }

  BType = 0;

  // Get a button number for this hotspot
  if ((ButtonNum = GetNextButtonNumber()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateHotSpot: No more button slots");
    return -1;
  }

  // Allocate memory for the GUI_BUTTON structure
  if ((b = MemAlloc(sizeof(GUI_BUTTON))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateHotSpot: Can't alloc mem for button struct");
    return -1;
  }

  // Init the structure values
  b.value.uiFlags = 0;
  b.value.uiOldFlags = 0;
  b.value.IDNum = ButtonNum;
  b.value.XLoc = xloc;
  b.value.YLoc = yloc;
  b.value.ImageNum = 0xffffffff;
  for (x = 0; x < 4; x++)
    b.value.UserData[x] = 0;
  b.value.Group = -1;
  b.value.string = NULL;

  // Set the hotspot click callback function (if any)
  if (ClickCallback != BUTTON_NO_CALLBACK) {
    b.value.ClickCallback = ClickCallback;
    BType |= BUTTON_CLICK_CALLBACK;
  } else
    b.value.ClickCallback = BUTTON_NO_CALLBACK;

  // Set the hotspot's mouse movement callback function (if any)
  if (MoveCallback != BUTTON_NO_CALLBACK) {
    b.value.MoveCallback = MoveCallback;
    BType |= BUTTON_MOVE_CALLBACK;
  } else
    b.value.MoveCallback = BUTTON_NO_CALLBACK;

  // define a MOUSE_REGION for this hotspot
  MSYS_DefineRegion(addressof(b.value.Area), xloc, yloc, (xloc + Width), (yloc + Height), Priority, MSYS_STARTING_CURSORVAL, QuickButtonCallbackMMove, QuickButtonCallbackMButn);

  // Link the MOUSE_REGION to this hotspot
  MSYS_SetRegionUserData(addressof(b.value.Area), 0, ButtonNum);

  // Set the flags entry for this hotspot
  b.value.uiFlags |= (BUTTON_ENABLED | BType | BUTTON_HOT_SPOT);

  b.value.BackRect = -1;

// Add this button (hotspot) to the button list
  ButtonList[ButtonNum] = b;

  SpecifyButtonSoundScheme(b.value.IDNum, Enum27.BUTTON_SOUND_SCHEME_GENERIC);

  // return the button slot number
  return ButtonNum;
}

// ============================================================================
// Addition Oct15/97, Carter
// SetButtonCursor
// will simply set the cursor for the mouse region the button occupies
function SetButtonCursor(iBtnId: INT32, crsr: UINT16): BOOLEAN {
  let b: Pointer<GUI_BUTTON>;
  b = ButtonList[iBtnId];
  if (!b)
    return FALSE;
  b.value.Area.Cursor = crsr;
  return TRUE;
}

//=============================================================================
//	QuickCreateButton
//
//	Creates a QuickButton. QuickButtons only have graphics associated with
//	them. They cannot be re-sized, nor can the graphic be changed.
//
function QuickCreateButton(Image: UINT32, xloc: INT16, yloc: INT16, Type: INT32, Priority: INT16, MoveCallback: GUI_CALLBACK, ClickCallback: GUI_CALLBACK): INT32 {
  let b: Pointer<GUI_BUTTON>;
  let ButtonNum: INT32;
  let BType: INT32;
  let x: INT32;

  if (xloc < 0 || yloc < 0) {
    sprintf(str, "Attempting to QuickCreateButton with invalid position of %d,%d", xloc, yloc);
    AssertMsg(0, str);
  }
  if (Image < 0 || Image >= MAX_BUTTON_PICS) {
    sprintf(str, "Attempting to QuickCreateButton with out of range ImageID %d.", Image);
    AssertMsg(0, str);
  }

  // Strip off any extraneous bits from button type
  BType = Type & (BUTTON_TYPE_MASK | BUTTON_NEWTOGGLE);

  // Is there a QuickButton image in the given image slot?
  if (ButtonPictures[Image].vobj == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "QuickCreateButton: Invalid button image number");
    return -1;
  }

  // Get a new button number
  if ((ButtonNum = GetNextButtonNumber()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "QuickCreateButton: No more button slots");
    return -1;
  }

  // Allocate memory for a GUI_BUTTON structure
  if ((b = MemAlloc(sizeof(GUI_BUTTON))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "QuickCreateButton: Can't alloc mem for button struct");
    return -1;
  }

  // Set the values for this buttn
  b.value.uiFlags = BUTTON_DIRTY;
  b.value.uiOldFlags = 0;

  // Set someflags if of s certain type....
  if (Type & BUTTON_NEWTOGGLE) {
    b.value.uiFlags |= BUTTON_NEWTOGGLE;
  }

  // shadow style
  b.value.bDefaultStatus = Enum28.DEFAULT_STATUS_NONE;
  b.value.bDisabledStyle = Enum29.DISABLED_STYLE_DEFAULT;

  b.value.Group = -1;
  // Init string
  b.value.string = NULL;
  b.value.usFont = 0;
  b.value.fMultiColor = FALSE;
  b.value.sForeColor = 0;
  b.value.sWrappedWidth = -1;
  b.value.sShadowColor = -1;
  b.value.sForeColorDown = -1;
  b.value.sShadowColorDown = -1;
  b.value.sForeColorHilited = -1;
  b.value.sShadowColorHilited = -1;
  b.value.bJustification = BUTTON_TEXT_CENTER;
  b.value.bTextXOffset = -1;
  b.value.bTextYOffset = -1;
  b.value.bTextXSubOffSet = 0;
  b.value.bTextYSubOffSet = 0;
  b.value.fShiftText = TRUE;
  // Init icon
  b.value.iIconID = -1;
  b.value.usIconIndex = -1;
  b.value.bIconXOffset = -1;
  b.value.bIconYOffset = -1;
  b.value.fShiftImage = TRUE;
  // Init quickbutton
  b.value.IDNum = ButtonNum;
  b.value.ImageNum = Image;
  for (x = 0; x < 4; x++)
    b.value.UserData[x] = 0;

  b.value.XLoc = xloc;
  b.value.YLoc = yloc;

  b.value.ubToggleButtonOldState = 0;
  b.value.ubToggleButtonActivated = FALSE;

  // Set the button click callback function (if any)
  if (ClickCallback != BUTTON_NO_CALLBACK) {
    b.value.ClickCallback = ClickCallback;
    BType |= BUTTON_CLICK_CALLBACK;
  } else
    b.value.ClickCallback = BUTTON_NO_CALLBACK;

  // Set the button's mouse movement callback function (if any)
  if (MoveCallback != BUTTON_NO_CALLBACK) {
    b.value.MoveCallback = MoveCallback;
    BType |= BUTTON_MOVE_CALLBACK;
  } else
    b.value.MoveCallback = BUTTON_NO_CALLBACK;

  memset(addressof(b.value.Area), 0, sizeof(MOUSE_REGION));
  // Define a MOUSE_REGION for this QuickButton
  MSYS_DefineRegion(addressof(b.value.Area), xloc, yloc, (xloc + ButtonPictures[Image].MaxWidth), (yloc + ButtonPictures[Image].MaxHeight), Priority, MSYS_STARTING_CURSORVAL, QuickButtonCallbackMMove, QuickButtonCallbackMButn);

  // Link the MOUSE_REGION with this QuickButton
  MSYS_SetRegionUserData(addressof(b.value.Area), 0, ButtonNum);

  // Set the flags for this button
  b.value.uiFlags |= BUTTON_ENABLED | BType | BUTTON_QUICK;
  b.value.BackRect = -1;

// Add this QuickButton to the button list
  ButtonList[ButtonNum] = b;

  SpecifyButtonSoundScheme(b.value.IDNum, Enum27.BUTTON_SOUND_SCHEME_GENERIC);

  // return the button number (slot)
  return ButtonNum;
}

// A hybrid of QuickCreateButton.  Takes a lot less parameters, but makes more assumptions.  It self manages the
// loading, and deleting of the image.  The size of the image determines the size of the button.  It also uses
// the default move callback which emulates Win95.  Finally, it sets the priority to normal.  The function you
// choose also determines the type of button (toggle, notoggle, or newtoggle)
function CreateEasyNoToggleButton(x: INT32, y: INT32, filename: Pointer<UINT8>, ClickCallback: GUI_CALLBACK): INT32 {
  return CreateSimpleButton(x, y, filename, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, ClickCallback);
}

function CreateEasyToggleButton(x: INT32, y: INT32, filename: Pointer<UINT8>, ClickCallback: GUI_CALLBACK): INT32 {
  return CreateSimpleButton(x, y, filename, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, ClickCallback);
}

function CreateEasyNewToggleButton(x: INT32, y: INT32, filename: Pointer<UINT8>, ClickCallback: GUI_CALLBACK): INT32 {
  return CreateSimpleButton(x, y, filename, BUTTON_NEWTOGGLE, MSYS_PRIORITY_NORMAL, ClickCallback);
}

// Same as above, but accepts specify toggle type
function CreateEasyButton(x: INT32, y: INT32, filename: Pointer<UINT8>, Type: INT32, ClickCallback: GUI_CALLBACK): INT32 {
  return CreateSimpleButton(x, y, filename, Type, MSYS_PRIORITY_NORMAL, ClickCallback);
}

// Same as above, but accepts priority specification.
function CreateSimpleButton(x: INT32, y: INT32, filename: Pointer<UINT8>, Type: INT32, Priority: INT16, ClickCallback: GUI_CALLBACK): INT32 {
  let ButPic: INT32;
  let ButNum: INT32;

  if (!filename || !strlen(filename))
    AssertMsg(0, "Attempting to CreateSimpleButton with null filename.");

  if ((ButPic = LoadButtonImage(filename, -1, 1, 2, 3, 4)) == -1) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "Can't load button image");
    return -1;
  }

  ButNum = QuickCreateButton(ButPic, x, y, Type, Priority, DEFAULT_MOVE_CALLBACK(), ClickCallback);

  AssertMsg(ButNum != -1, "Failed to CreateSimpleButton.");

  ButtonList[ButNum].value.uiFlags |= BUTTON_SELFDELETE_IMAGE;

  SpecifyDisabledButtonStyle(ButNum, Enum29.DISABLED_STYLE_SHADED);

  return ButNum;
}

function CreateIconAndTextButton(Image: INT32, string: Pointer<UINT16>, uiFont: UINT32, sForeColor: INT16, sShadowColor: INT16, sForeColorDown: INT16, sShadowColorDown: INT16, bJustification: INT8, xloc: INT16, yloc: INT16, Type: INT32, Priority: INT16, MoveCallback: GUI_CALLBACK, ClickCallback: GUI_CALLBACK): INT32 {
  let b: Pointer<GUI_BUTTON>;
  let iButtonID: INT32;
  let BType: INT32;
  let x: INT32;

  if (xloc < 0 || yloc < 0) {
    sprintf(str, "Attempting to CreateIconAndTextButton with invalid position of %d,%d", xloc, yloc);
    AssertMsg(0, str);
  }
  if (Image < 0 || Image >= MAX_BUTTON_PICS) {
    sprintf(str, "Attemting to CreateIconAndTextButton with out of range ImageID %d.", Image);
    AssertMsg(0, str);
  }

  // Strip off any extraneous bits from button type
  BType = Type & (BUTTON_TYPE_MASK | BUTTON_NEWTOGGLE);

  // Is there a QuickButton image in the given image slot?
  if (ButtonPictures[Image].vobj == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "QuickCreateButton: Invalid button image number");
    return -1;
  }

  // Get a new button number
  if ((iButtonID = GetNextButtonNumber()) == BUTTON_NO_SLOT) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "QuickCreateButton: No more button slots");
    return -1;
  }

  // Allocate memory for a GUI_BUTTON structure
  if ((b = MemAlloc(sizeof(GUI_BUTTON))) == NULL) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "QuickCreateButton: Can't alloc mem for button struct");
    return -1;
  }

  // Set the values for this button
  b.value.uiFlags = BUTTON_DIRTY;
  b.value.uiOldFlags = 0;
  b.value.IDNum = iButtonID;
  b.value.XLoc = xloc;
  b.value.YLoc = yloc;
  b.value.ImageNum = Image;
  for (x = 0; x < 4; x++)
    b.value.UserData[x] = 0;
  b.value.Group = -1;
  b.value.bDefaultStatus = Enum28.DEFAULT_STATUS_NONE;
  b.value.bDisabledStyle = Enum29.DISABLED_STYLE_DEFAULT;

  // Allocate memory for the button's text string...
  b.value.string = NULL;
  if (string) {
    b.value.string = MemAlloc((wcslen(string) + 1) * sizeof(UINT16));
    AssertMsg(b.value.string, "Out of memory error:  Couldn't allocate string in CreateIconAndTextButton.");
    wcscpy(b.value.string, string);
  }

  b.value.bJustification = bJustification;
  b.value.usFont = uiFont;
  b.value.fMultiColor = FALSE;
  b.value.sForeColor = sForeColor;
  b.value.sWrappedWidth = -1;
  b.value.sShadowColor = sShadowColor;
  b.value.sForeColorDown = sForeColorDown;
  b.value.sShadowColorDown = sShadowColorDown;
  b.value.sForeColorHilited = -1;
  b.value.sShadowColorHilited = -1;
  b.value.bTextXOffset = -1;
  b.value.bTextYOffset = -1;
  b.value.bTextXSubOffSet = 0;
  b.value.bTextYSubOffSet = 0;
  b.value.fShiftText = TRUE;

  b.value.iIconID = -1;
  b.value.usIconIndex = 0;

  // Set the button click callback function (if any)
  if (ClickCallback != BUTTON_NO_CALLBACK) {
    b.value.ClickCallback = ClickCallback;
    BType |= BUTTON_CLICK_CALLBACK;
  } else
    b.value.ClickCallback = BUTTON_NO_CALLBACK;

  // Set the button's mouse movement callback function (if any)
  if (MoveCallback != BUTTON_NO_CALLBACK) {
    b.value.MoveCallback = MoveCallback;
    BType |= BUTTON_MOVE_CALLBACK;
  } else
    b.value.MoveCallback = BUTTON_NO_CALLBACK;

  // Define a MOUSE_REGION for this QuickButton
  MSYS_DefineRegion(addressof(b.value.Area), xloc, yloc, (xloc + ButtonPictures[Image].MaxWidth), (yloc + ButtonPictures[Image].MaxHeight), Priority, MSYS_STARTING_CURSORVAL, QuickButtonCallbackMMove, QuickButtonCallbackMButn);

  // Link the MOUSE_REGION with this QuickButton
  MSYS_SetRegionUserData(addressof(b.value.Area), 0, iButtonID);

  // Set the flags for this button
  b.value.uiFlags |= (BUTTON_ENABLED | BType | BUTTON_QUICK);

  b.value.BackRect = -1;

// Add this QuickButton to the button list
  ButtonList[iButtonID] = b;

  SpecifyButtonSoundScheme(b.value.IDNum, Enum27.BUTTON_SOUND_SCHEME_GENERIC);

  // return the button number (slot)
  return iButtonID;
}

// New functions
function SpecifyButtonText(iButtonID: INT32, string: Pointer<UINT16>): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);

  b = ButtonList[iButtonID];

  // free the previous strings memory if applicable
  if (b.value.string)
    MemFree(b.value.string);
  b.value.string = NULL;

  if (string && wcslen(string)) {
    // allocate memory for the new string
    b.value.string = MemAlloc((wcslen(string) + 1) * sizeof(UINT16));
    Assert(b.value.string);
    // copy the string to the button
    wcscpy(b.value.string, string);
    b.value.uiFlags |= BUTTON_DIRTY;
  }
}

function SpecifyButtonMultiColorFont(iButtonID: INT32, fMultiColor: BOOLEAN): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  b.value.fMultiColor = fMultiColor;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyButtonFont(iButtonID: INT32, uiFont: UINT32): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  b.value.usFont = uiFont;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyButtonUpTextColors(iButtonID: INT32, sForeColor: INT16, sShadowColor: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  b.value.sForeColor = sForeColor;
  b.value.sShadowColor = sShadowColor;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyButtonDownTextColors(iButtonID: INT32, sForeColorDown: INT16, sShadowColorDown: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  b.value.sForeColorDown = sForeColorDown;
  b.value.sShadowColorDown = sShadowColorDown;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyButtonHilitedTextColors(iButtonID: INT32, sForeColorHilited: INT16, sShadowColorHilited: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  b.value.sForeColorHilited = sForeColorHilited;
  b.value.sShadowColorHilited = sShadowColorHilited;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyButtonTextJustification(iButtonID: INT32, bJustification: INT8): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Range check:  if invalid, then set it to center justified.
  if (bJustification < BUTTON_TEXT_LEFT || bJustification > BUTTON_TEXT_RIGHT)
    bJustification = BUTTON_TEXT_CENTER;
  b.value.bJustification = bJustification;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyFullButtonTextAttributes(iButtonID: INT32, string: Pointer<UINT16>, uiFont: INT32, sForeColor: INT16, sShadowColor: INT16, sForeColorDown: INT16, sShadowColorDown: INT16, bJustification: INT8): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Copy over information
  SpecifyButtonText(iButtonID, string);
  b.value.usFont = uiFont;
  b.value.sForeColor = sForeColor;
  b.value.sShadowColor = sShadowColor;
  b.value.sForeColorDown = sForeColorDown;
  b.value.sShadowColorDown = sShadowColorDown;
  // Range check:  if invalid, then set it to center justified.
  if (bJustification < BUTTON_TEXT_LEFT || bJustification > BUTTON_TEXT_RIGHT)
    bJustification = BUTTON_TEXT_CENTER;
  b.value.bJustification = bJustification;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyGeneralButtonTextAttributes(iButtonID: INT32, string: Pointer<UINT16>, uiFont: INT32, sForeColor: INT16, sShadowColor: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Copy over information
  SpecifyButtonText(iButtonID, string);
  b.value.usFont = uiFont;
  b.value.sForeColor = sForeColor;
  b.value.sShadowColor = sShadowColor;
  b.value.uiFlags |= BUTTON_DIRTY;
}

function SpecifyButtonTextOffsets(iButtonID: INT32, bTextXOffset: INT8, bTextYOffset: INT8, fShiftText: BOOLEAN): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Copy over information
  b.value.bTextXOffset = bTextXOffset;
  b.value.bTextYOffset = bTextYOffset;
  b.value.fShiftText = fShiftText;
}

function SpecifyButtonTextSubOffsets(iButtonID: INT32, bTextXOffset: INT8, bTextYOffset: INT8, fShiftText: BOOLEAN): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Copy over information
  b.value.bTextXSubOffSet = bTextXOffset;
  b.value.bTextYSubOffSet = bTextYOffset;
  b.value.fShiftText = fShiftText;
}

function SpecifyButtonTextWrappedWidth(iButtonID: INT32, sWrappedWidth: INT16): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  b.value.sWrappedWidth = sWrappedWidth;
}

function SpecifyDisabledButtonStyle(iButtonID: INT32, bStyle: INT8): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  Assert(bStyle >= Enum29.DISABLED_STYLE_NONE && bStyle <= Enum29.DISABLED_STYLE_SHADED);

  b.value.bDisabledStyle = bStyle;
}

// Note:  Text is always on top
// If fShiftImage is true, then the image will shift down one pixel and right one pixel
// just like the text does.
function SpecifyButtonIcon(iButtonID: INT32, iVideoObjectID: INT32, usVideoObjectIndex: UINT16, bXOffset: INT8, bYOffset: INT8, fShiftImage: BOOLEAN): BOOLEAN {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  b.value.iIconID = iVideoObjectID;
  b.value.usIconIndex = usVideoObjectIndex;

  if (b.value.iIconID == -1)
    return FALSE;

  b.value.bIconXOffset = bXOffset;
  b.value.bIconYOffset = bYOffset;
  b.value.fShiftImage = TRUE;

  b.value.uiFlags |= BUTTON_DIRTY;

  return TRUE;
}

function RemoveTextFromButton(iButtonID: INT32): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Init string
  if (b.value.string)
    MemFree(b.value.string);
  b.value.string = NULL;
  b.value.usFont = 0;
  b.value.sForeColor = 0;
  b.value.sWrappedWidth = -1;
  b.value.sShadowColor = -1;
  b.value.sForeColorDown = -1;
  b.value.sShadowColorDown = -1;
  b.value.sForeColorHilited = -1;
  b.value.sShadowColorHilited = -1;
  b.value.bJustification = BUTTON_TEXT_CENTER;
  b.value.bTextXOffset = -1;
  b.value.bTextYOffset = -1;
  b.value.bTextXSubOffSet = 0;
  b.value.bTextYSubOffSet = 0;
  b.value.fShiftText = TRUE;
}

function RemoveIconFromButton(iButtonID: INT32): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);
  // Clear icon
  b.value.iIconID = -1;
  b.value.usIconIndex = -1;
  b.value.bIconXOffset = -1;
  b.value.bIconYOffset = -1;
  b.value.fShiftImage = TRUE;
}

function AllowDisabledButtonFastHelp(iButtonID: INT32, fAllow: BOOLEAN): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  b.value.Area.uiFlags |= MSYS_ALLOW_DISABLED_FASTHELP;
}

//=============================================================================
//	SetButtonFastHelpText
//
//	Set the text that will be displayed as the FastHelp
//
function SetButtonFastHelpText(iButton: INT32, Text: Pointer<UINT16>): void {
  let b: Pointer<GUI_BUTTON>;
  if (iButton < 0 || iButton > MAX_BUTTONS)
    return;
  b = ButtonList[iButton];
  AssertMsg(b, "Called SetButtonFastHelpText() with a non-existant button.");
  SetRegionFastHelpText(addressof(b.value.Area), Text);
}

function SetBtnHelpEndCallback(iButton: INT32, CallbackFxn: MOUSE_HELPTEXT_DONE_CALLBACK): void {
  let b: Pointer<GUI_BUTTON>;
  if (iButton < 0 || iButton > MAX_BUTTONS)
    return;
  b = ButtonList[iButton];
  AssertMsg(b, "Called SetBtnHelpEndCallback() with a non-existant button.");

  SetRegionHelpEndCallback(addressof(b.value.Area), CallbackFxn);
}

//=============================================================================
//	QuickButtonCallbackMMove
//
//	Dispatches all button callbacks for mouse movement. This function gets
//	called by the Mouse System. *DO NOT CALL DIRECTLY*
//
function QuickButtonCallbackMMove(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  let iButtonID: INT32;

  Assert(reg != NULL);

  iButtonID = MSYS_GetRegionUserData(reg, 0);

  sprintf(str, "QuickButtonCallbackMMove: Mouse Region #%d (%d,%d to %d,%d) has invalid buttonID %d", reg.value.IDNumber, reg.value.RegionTopLeftX, reg.value.RegionTopLeftY, reg.value.RegionBottomRightX, reg.value.RegionBottomRightY, iButtonID);

  AssertMsg(iButtonID >= 0, str);
  AssertMsg(iButtonID < MAX_BUTTONS, str);

  b = ButtonList[iButtonID];

  AssertMsg(b != NULL, str);

  if (!b)
    return; // This is getting called when Adding new regions...

  if (b.value.uiFlags & BUTTON_ENABLED && reason & (MSYS_CALLBACK_REASON_LOST_MOUSE | MSYS_CALLBACK_REASON_GAIN_MOUSE)) {
    b.value.uiFlags |= BUTTON_DIRTY;
  }

  // Mouse moved on the button, so reset it's timer to maximum.
  if (b.value.Area.uiFlags & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    // check for sound playing stuff
    if (b.value.ubSoundSchemeID) {
      if (addressof(b.value.Area == MSYS_PrevRegion) && !gpAnchoredButton) {
        if (b.value.uiFlags & BUTTON_ENABLED) {
          PlayButtonSound(iButtonID, BUTTON_SOUND_MOVED_ONTO);
        } else {
          PlayButtonSound(iButtonID, BUTTON_SOUND_DISABLED_MOVED_ONTO);
        }
      }
    }
  } else {
    // Check if we should play a sound
    if (b.value.ubSoundSchemeID) {
      if (b.value.uiFlags & BUTTON_ENABLED) {
        if (addressof(b.value.Area == MSYS_PrevRegion) && !gpAnchoredButton) {
          PlayButtonSound(iButtonID, BUTTON_SOUND_MOVED_OFF_OF);
        }
      } else {
        PlayButtonSound(iButtonID, BUTTON_SOUND_DISABLED_MOVED_OFF_OF);
      }
    }
  }

  // ATE: New stuff for toggle buttons that work with new Win95 paridigm
  if ((b.value.uiFlags & BUTTON_NEWTOGGLE)) {
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      if (b.value.ubToggleButtonActivated) {
        b.value.ubToggleButtonActivated = FALSE;

        if (!b.value.ubToggleButtonOldState) {
          b.value.uiFlags &= (~BUTTON_CLICKED_ON);
        } else {
          b.value.uiFlags |= BUTTON_CLICKED_ON;
        }
      }
    }
  }

  // If this button is enabled and there is a callback function associated with it,
  // call the callback function.
  if ((b.value.uiFlags & BUTTON_ENABLED) && (b.value.uiFlags & BUTTON_MOVE_CALLBACK))
    (b.value.MoveCallback)(b, reason);
}

//=============================================================================
//	QuickButtonCallbackMButn
//
//	Dispatches all button callbacks for button presses. This function is
//	called by the Mouse System. *DO NOT CALL DIRECTLY*
//
function QuickButtonCallbackMButn(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  let iButtonID: INT32;
  let MouseBtnDown: BOOLEAN;
  let StateBefore: BOOLEAN;
  let StateAfter: BOOLEAN;

  Assert(reg != NULL);

  iButtonID = MSYS_GetRegionUserData(reg, 0);

  sprintf(str, "QuickButtonCallbackMButn: Mouse Region #%d (%d,%d to %d,%d) has invalid buttonID %d", reg.value.IDNumber, reg.value.RegionTopLeftX, reg.value.RegionTopLeftY, reg.value.RegionBottomRightX, reg.value.RegionBottomRightY, iButtonID);

  AssertMsg(iButtonID >= 0, str);
  AssertMsg(iButtonID < MAX_BUTTONS, str);

  b = ButtonList[iButtonID];

  AssertMsg(b != NULL, str);

  if (!b)
    return;

  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_DWN | MSYS_CALLBACK_REASON_RBUTTON_DWN))
    MouseBtnDown = TRUE;
  else
    MouseBtnDown = FALSE;

  StateBefore = (b.value.uiFlags & BUTTON_CLICKED_ON) ? (TRUE) : (FALSE);

  // ATE: New stuff for toggle buttons that work with new Win95 paridigm
  if (b.value.uiFlags & BUTTON_NEWTOGGLE && b.value.uiFlags & BUTTON_ENABLED) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      if (!b.value.ubToggleButtonActivated) {
        if (!(b.value.uiFlags & BUTTON_CLICKED_ON)) {
          b.value.ubToggleButtonOldState = FALSE;
          b.value.uiFlags |= BUTTON_CLICKED_ON;
        } else {
          b.value.ubToggleButtonOldState = TRUE;
          b.value.uiFlags &= (~BUTTON_CLICKED_ON);
        }
        b.value.ubToggleButtonActivated = TRUE;
      }
    } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      b.value.ubToggleButtonActivated = FALSE;
    }
  }

  // Kris:
  // Set the anchored button incase the user moves mouse off region while still holding
  // down the button, but only if the button is up.  In Win95, buttons that are already
  // down, and anchored never change state, unless you release the mouse in the button area.

  if (b.value.MoveCallback == DEFAULT_MOVE_CALLBACK() && b.value.uiFlags & BUTTON_ENABLED) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      gpAnchoredButton = b;
      gfAnchoredState = StateBefore;
      b.value.uiFlags |= BUTTON_CLICKED_ON;
    } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP && b.value.uiFlags & BUTTON_NO_TOGGLE) {
      b.value.uiFlags &= (~BUTTON_CLICKED_ON);
    }
  } else if (b.value.uiFlags & BUTTON_CHECKBOX) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      // the check box button gets anchored, though it doesn't actually use the anchoring move callback.
      // The effect is different, we don't want to toggle the button state, but we do want to anchor this
      // button so that we don't effect any other buttons while we move the mouse around in anchor mode.
      gpAnchoredButton = b;
      gfAnchoredState = StateBefore;

      // Trick the before state of the button to be different so the sound will play properly as checkbox buttons
      // are processed differently.
      StateBefore = (b.value.uiFlags & BUTTON_CLICKED_ON) ? FALSE : TRUE;
      StateAfter = !StateBefore;
    } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      b.value.uiFlags ^= BUTTON_CLICKED_ON; // toggle the checkbox state upon release inside button area.
      // Trick the before state of the button to be different so the sound will play properly as checkbox buttons
      // are processed differently.
      StateBefore = (b.value.uiFlags & BUTTON_CLICKED_ON) ? FALSE : TRUE;
      StateAfter = !StateBefore;
    }
  }

  // Should we play a sound if clicked on while disabled?
  if (b.value.ubSoundSchemeID && !(b.value.uiFlags & BUTTON_ENABLED) && MouseBtnDown) {
    PlayButtonSound(iButtonID, BUTTON_SOUND_DISABLED_CLICK);
  }

  // If this button is disabled, and no callbacks allowed when disabled
  // callback
  if (!(b.value.uiFlags & BUTTON_ENABLED) && !(b.value.uiFlags & BUTTON_ALLOW_DISABLED_CALLBACK))
    return;

  // Button not enabled but allowed to use callback, then do that!
  if (!(b.value.uiFlags & BUTTON_ENABLED) && (b.value.uiFlags & BUTTON_ALLOW_DISABLED_CALLBACK)) {
    if (b.value.uiFlags & BUTTON_CLICK_CALLBACK) {
      (b.value.ClickCallback)(b, reason | BUTTON_DISABLED_CALLBACK);
    }
    return;
  }

  // If there is a callback function with this button, call it
  if (b.value.uiFlags & BUTTON_CLICK_CALLBACK) {
    // Kris:  January 6, 1998
    // Added these checks to avoid a case where it was possible to process a leftbuttonup message when
    // the button wasn't anchored, and should have been.
    gfDelayButtonDeletion = TRUE;
    if (!(reason & MSYS_CALLBACK_REASON_LBUTTON_UP) || b.value.MoveCallback != DEFAULT_MOVE_CALLBACK() || b.value.MoveCallback == DEFAULT_MOVE_CALLBACK() && gpPrevAnchoredButton == b)
      (b.value.ClickCallback)(b, reason);
    gfDelayButtonDeletion = FALSE;
  } else if ((reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) && !(b.value.uiFlags & BUTTON_IGNORE_CLICKS)) {
    // Otherwise, do default action with this button.
    b.value.uiFlags ^= BUTTON_CLICKED_ON;
  }

  if (b.value.uiFlags & BUTTON_CHECKBOX) {
    StateAfter = (b.value.uiFlags & BUTTON_CLICKED_ON) ? (TRUE) : (FALSE);
  }

  // Play sounds for this enabled button (disabled sounds have already been done)
  if (b.value.ubSoundSchemeID && b.value.uiFlags & BUTTON_ENABLED) {
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (b.value.ubSoundSchemeID && StateBefore && !StateAfter) {
        PlayButtonSound(iButtonID, BUTTON_SOUND_CLICKED_OFF);
      }
    } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      if (b.value.ubSoundSchemeID && !StateBefore && StateAfter) {
        PlayButtonSound(iButtonID, BUTTON_SOUND_CLICKED_ON);
      }
    }
  }

  if (StateBefore != StateAfter) {
    InvalidateRegion(b.value.Area.RegionTopLeftX, b.value.Area.RegionTopLeftY, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY);
  }

  if (gfPendingButtonDeletion) {
    RemoveButtonsMarkedForDeletion();
  }
}

function RenderButtons(): void {
  let iButtonID: INT32;
  let fOldButtonDown: BOOLEAN;
  let fOldEnabled: BOOLEAN;
  let b: Pointer<GUI_BUTTON>;

  SaveFontSettings();
  for (iButtonID = 0; iButtonID < MAX_BUTTONS; iButtonID++) {
    // If the button exists, and it's not owned by another object, draw it
    // Kris:  and make sure that the button isn't hidden.
    b = ButtonList[iButtonID];
    if (b && b.value.Area.uiFlags & MSYS_REGION_ENABLED) {
      // Check for buttonchanged status
      fOldButtonDown = (b.value.uiFlags & BUTTON_CLICKED_ON);

      if (fOldButtonDown != (b.value.uiOldFlags & BUTTON_CLICKED_ON)) {
        // Something is different, set dirty!
        b.value.uiFlags |= BUTTON_DIRTY;
      }

      // Check for button dirty flags
      fOldEnabled = (b.value.uiFlags & BUTTON_ENABLED);

      if (fOldEnabled != (b.value.uiOldFlags & BUTTON_ENABLED)) {
        // Something is different, set dirty!
        b.value.uiFlags |= BUTTON_DIRTY;
      }

      // If we ABSOLUTELY want to render every frame....
      if (b.value.uiFlags & BUTTON_SAVEBACKGROUND) {
        b.value.uiFlags |= BUTTON_DIRTY;
      }

      // Set old flags
      b.value.uiOldFlags = b.value.uiFlags;

      if (b.value.uiFlags & BUTTON_FORCE_UNDIRTY) {
        b.value.uiFlags &= ~(BUTTON_DIRTY);
        b.value.uiFlags &= ~(BUTTON_FORCE_UNDIRTY);
      }

      // Check if we need to update!
      if (b.value.uiFlags & BUTTON_DIRTY) {
        // Turn off dirty flag
        b.value.uiFlags &= (~BUTTON_DIRTY);
        DrawButtonFromPtr(b);

        InvalidateRegion(b.value.Area.RegionTopLeftX, b.value.Area.RegionTopLeftY, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY);
//#else
//				InvalidateRegion(b->Area.RegionTopLeftX, b->Area.RegionTopLeftY, b->Area.RegionBottomRightX, b->Area.RegionBottomRightY, FALSE);
      }
    }
  }

  // check if we want to render 1 frame later?
  if ((fPausedMarkButtonsDirtyFlag == TRUE) && (fDisableHelpTextRestoreFlag == FALSE)) {
    fPausedMarkButtonsDirtyFlag = FALSE;
    MarkButtonsDirty();
  }

  RestoreFontSettings();
}

//*****************************************************************************
// MarkAButtonDirty
//
function MarkAButtonDirty(iButtonNum: INT32): void {
  // surgical dirtying -> marks a user specified button dirty, without dirty the whole lot of them

  // If the button exists, and it's not owned by another object, draw it
  if (ButtonList[iButtonNum]) {
    // Turn on dirty flag
    ButtonList[iButtonNum].value.uiFlags |= BUTTON_DIRTY;
  }
}

//=============================================================================
//	MarkButtonsDirty
//
function MarkButtonsDirty(): void {
  let x: INT32;
  for (x = 0; x < MAX_BUTTONS; x++) {
    // If the button exists, and it's not owned by another object, draw it
    if (ButtonList[x]) {
      // Turn on dirty flag
      ButtonList[x].value.uiFlags |= BUTTON_DIRTY;
    }
  }
}

function UnMarkButtonDirty(iButtonIndex: INT32): void {
  if (ButtonList[iButtonIndex]) {
    ButtonList[iButtonIndex].value.uiFlags &= ~(BUTTON_DIRTY);
  }
}

function UnmarkButtonsDirty(): void {
  let x: INT32;
  for (x = 0; x < MAX_BUTTONS; x++) {
    // If the button exists, and it's not owned by another object, draw it
    if (ButtonList[x]) {
      UnMarkButtonDirty(x);
    }
  }
}

function ForceButtonUnDirty(iButtonIndex: INT32): void {
  ButtonList[iButtonIndex].value.uiFlags &= ~(BUTTON_DIRTY);
  ButtonList[iButtonIndex].value.uiFlags |= BUTTON_FORCE_UNDIRTY;
}

//=============================================================================
// PauseMarkButtonsDirty
//

function PausedMarkButtonsDirty(): void {
  // set flag for frame after the next rendering of buttons
  fPausedMarkButtonsDirtyFlag = TRUE;

  return;
}

//=============================================================================
//	DrawButton
//
//	Draws a single button on the screen.
//
function DrawButton(iButtonID: INT32): BOOLEAN {
  // Fail if button handle out of range
  if (iButtonID < 0 || iButtonID > MAX_BUTTONS)
    return FALSE;

  // Fail if button handle is invalid
  if (!ButtonList[iButtonID])
    return FALSE;

  if (ButtonList[iButtonID].value.string)
    SaveFontSettings();
  // Draw this button
  if (ButtonList[iButtonID].value.Area.uiFlags & MSYS_REGION_ENABLED) {
    DrawButtonFromPtr(ButtonList[iButtonID]);
  }

  if (ButtonList[iButtonID].value.string)
    RestoreFontSettings();
  return TRUE;
}

//=============================================================================
//	DrawButtonFromPtr
//
//	Given a pointer to a GUI_BUTTON structure, draws the button on the
//	screen.
//
function DrawButtonFromPtr(b: Pointer<GUI_BUTTON>): void {
  Assert(b);
  // Draw the appropriate button according to button type
  gbDisabledButtonStyle = Enum29.DISABLED_STYLE_NONE;
  switch (b.value.uiFlags & BUTTON_TYPES) {
    case BUTTON_QUICK:
      DrawQuickButton(b);
      break;
    case BUTTON_GENERIC:
      DrawGenericButton(b);
      break;
    case BUTTON_HOT_SPOT:
      if (b.value.uiFlags & BUTTON_NO_TOGGLE)
        b.value.uiFlags &= (~BUTTON_CLICKED_ON);
      return; // hotspots don't have text, but if you want to, change this to a break!
    case BUTTON_CHECKBOX:
      DrawCheckBoxButton(b);
      break;
  }
  // If button has an icon, overlay it on current button.
  if (b.value.iIconID != -1)
    DrawIconOnButton(b);
  // If button has text, draw it now
  if (b.value.string)
    DrawTextOnButton(b);
  // If the button is disabled, and a style has been calculated, then
  // draw the style last.
  switch (gbDisabledButtonStyle) {
    case Enum29.DISABLED_STYLE_HATCHED:
      DrawHatchOnButton(b);
      break;
    case Enum29.DISABLED_STYLE_SHADED:
      DrawShadeOnButton(b);
      break;
  }
  if (b.value.bDefaultStatus) {
    DrawDefaultOnButton(b);
  }
}

//=============================================================================
//	DrawQuickButton
//
//	Draws a QuickButton type button on the screen.
//
function DrawQuickButton(b: Pointer<GUI_BUTTON>): void {
  let UseImage: INT32;
  UseImage = 0;
  // Is button Enabled, or diabled but no "Grayed" image associated with this QuickButton?
  if (b.value.uiFlags & BUTTON_ENABLED) {
    // Is the button's state ON?
    if (b.value.uiFlags & BUTTON_CLICKED_ON) {
      // Is the mouse over this area, and we have a hilite image?
      if ((b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA) && gfRenderHilights && (ButtonPictures[b.value.ImageNum].OnHilite != -1))
        UseImage = ButtonPictures[b.value.ImageNum].OnHilite; // Use On-Hilite image
      else if (ButtonPictures[b.value.ImageNum].OnNormal != -1)
        UseImage = ButtonPictures[b.value.ImageNum].OnNormal; // Use On-Normal image
    } else {
      // Is the mouse over the button, and do we have hilite image?
      if ((b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA) && gfRenderHilights && (ButtonPictures[b.value.ImageNum].OffHilite != -1))
        UseImage = ButtonPictures[b.value.ImageNum].OffHilite; // Use Off-Hilite image
      else if (ButtonPictures[b.value.ImageNum].OffNormal != -1)
        UseImage = ButtonPictures[b.value.ImageNum].OffNormal; // Use Off-Normal image
    }
  } else if (ButtonPictures[b.value.ImageNum].Grayed != -1) {
    // Button is diabled so use the "Grayed-out" image
    UseImage = ButtonPictures[b.value.ImageNum].Grayed;
  } else {
    UseImage = ButtonPictures[b.value.ImageNum].OffNormal;
    switch (b.value.bDisabledStyle) {
      case Enum29.DISABLED_STYLE_DEFAULT:
        gbDisabledButtonStyle = b.value.string ? Enum29.DISABLED_STYLE_SHADED : Enum29.DISABLED_STYLE_HATCHED;
        break;
      case Enum29.DISABLED_STYLE_HATCHED:
      case Enum29.DISABLED_STYLE_SHADED:
        gbDisabledButtonStyle = b.value.bDisabledStyle;
        break;
    }
  }

  // Display the button image
  BltVideoObject(ButtonDestBuffer, ButtonPictures[b.value.ImageNum].vobj, UseImage, b.value.XLoc, b.value.YLoc, VO_BLT_SRCTRANSPARENCY, NULL);
}

function DrawHatchOnButton(b: Pointer<GUI_BUTTON>): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let ClipRect: SGPRect;
  ClipRect.iLeft = b.value.Area.RegionTopLeftX;
  ClipRect.iRight = b.value.Area.RegionBottomRightX - 1;
  ClipRect.iTop = b.value.Area.RegionTopLeftY;
  ClipRect.iBottom = b.value.Area.RegionBottomRightY - 1;
  pDestBuf = LockVideoSurface(ButtonDestBuffer, addressof(uiDestPitchBYTES));
  Blt16BPPBufferHatchRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
  UnLockVideoSurface(ButtonDestBuffer);
}

function DrawShadeOnButton(b: Pointer<GUI_BUTTON>): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let ClipRect: SGPRect;
  ClipRect.iLeft = b.value.Area.RegionTopLeftX;
  ClipRect.iRight = b.value.Area.RegionBottomRightX - 1;
  ClipRect.iTop = b.value.Area.RegionTopLeftY;
  ClipRect.iBottom = b.value.Area.RegionBottomRightY - 1;
  pDestBuf = LockVideoSurface(ButtonDestBuffer, addressof(uiDestPitchBYTES));
  Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
  UnLockVideoSurface(ButtonDestBuffer);
}

function DrawDefaultOnButton(b: Pointer<GUI_BUTTON>): void {
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  pDestBuf = LockVideoSurface(ButtonDestBuffer, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
  if (b.value.bDefaultStatus == Enum28.DEFAULT_STATUS_DARKBORDER || b.value.bDefaultStatus == Enum28.DEFAULT_STATUS_WINDOWS95) {
    // left (one thick)
    LineDraw(TRUE, b.value.Area.RegionTopLeftX - 1, b.value.Area.RegionTopLeftY - 1, b.value.Area.RegionTopLeftX - 1, b.value.Area.RegionBottomRightY + 1, 0, pDestBuf);
    // top (one thick)
    LineDraw(TRUE, b.value.Area.RegionTopLeftX - 1, b.value.Area.RegionTopLeftY - 1, b.value.Area.RegionBottomRightX + 1, b.value.Area.RegionTopLeftY - 1, 0, pDestBuf);
    // right (two thick)
    LineDraw(TRUE, b.value.Area.RegionBottomRightX, b.value.Area.RegionTopLeftY - 1, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY + 1, 0, pDestBuf);
    LineDraw(TRUE, b.value.Area.RegionBottomRightX + 1, b.value.Area.RegionTopLeftY - 1, b.value.Area.RegionBottomRightX + 1, b.value.Area.RegionBottomRightY + 1, 0, pDestBuf);
    // bottom (two thick)
    LineDraw(TRUE, b.value.Area.RegionTopLeftX - 1, b.value.Area.RegionBottomRightY, b.value.Area.RegionBottomRightX + 1, b.value.Area.RegionBottomRightY, 0, pDestBuf);
    LineDraw(TRUE, b.value.Area.RegionTopLeftX - 1, b.value.Area.RegionBottomRightY + 1, b.value.Area.RegionBottomRightX + 1, b.value.Area.RegionBottomRightY + 1, 0, pDestBuf);
    InvalidateRegion(b.value.Area.RegionTopLeftX - 1, b.value.Area.RegionTopLeftY - 1, b.value.Area.RegionBottomRightX + 1, b.value.Area.RegionBottomRightY + 1);
  }
  if (b.value.bDefaultStatus == Enum28.DEFAULT_STATUS_DOTTEDINTERIOR || b.value.bDefaultStatus == Enum28.DEFAULT_STATUS_WINDOWS95) {
    // Draw an internal dotted rectangle.
  }
  UnLockVideoSurface(ButtonDestBuffer);
}

function DrawCheckBoxButtonOn(iButtonID: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  let fLeftButtonState: BOOLEAN = gfLeftButtonState;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  gfLeftButtonState = TRUE;
  b.value.Area.uiFlags |= MSYS_MOUSE_IN_AREA;

  DrawButton(iButtonID);

  gfLeftButtonState = fLeftButtonState;
}

function DrawCheckBoxButtonOff(iButtonID: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  let fLeftButtonState: BOOLEAN = gfLeftButtonState;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  gfLeftButtonState = FALSE;
  b.value.Area.uiFlags |= MSYS_MOUSE_IN_AREA;

  DrawButton(iButtonID);

  gfLeftButtonState = fLeftButtonState;
}

function DrawCheckBoxButton(b: Pointer<GUI_BUTTON>): void {
  let UseImage: INT32;

  UseImage = 0;
  // Is button Enabled, or diabled but no "Grayed" image associated with this QuickButton?
  if (b.value.uiFlags & BUTTON_ENABLED) {
    // Is the button's state ON?
    if (b.value.uiFlags & BUTTON_CLICKED_ON) {
      // Is the mouse over this area, and we have a hilite image?
      if (b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA && gfRenderHilights && gfLeftButtonState && ButtonPictures[b.value.ImageNum].OnHilite != -1)
        UseImage = ButtonPictures[b.value.ImageNum].OnHilite; // Use On-Hilite image
      else if (ButtonPictures[b.value.ImageNum].OnNormal != -1)
        UseImage = ButtonPictures[b.value.ImageNum].OnNormal; // Use On-Normal image
    } else {
      // Is the mouse over the button, and do we have hilite image?
      if (b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA && gfRenderHilights && gfLeftButtonState && ButtonPictures[b.value.ImageNum].OffHilite != -1)
        UseImage = ButtonPictures[b.value.ImageNum].OffHilite; // Use Off-Hilite image
      else if (ButtonPictures[b.value.ImageNum].OffNormal != -1)
        UseImage = ButtonPictures[b.value.ImageNum].OffNormal; // Use Off-Normal image
    }
  } else if (ButtonPictures[b.value.ImageNum].Grayed != -1) {
    // Button is disabled so use the "Grayed-out" image
    UseImage = ButtonPictures[b.value.ImageNum].Grayed;
  } else // use the disabled style
  {
    if (b.value.uiFlags & BUTTON_CLICKED_ON)
      UseImage = ButtonPictures[b.value.ImageNum].OnHilite;
    else
      UseImage = ButtonPictures[b.value.ImageNum].OffHilite;
    switch (b.value.bDisabledStyle) {
      case Enum29.DISABLED_STYLE_DEFAULT:
        gbDisabledButtonStyle = Enum29.DISABLED_STYLE_HATCHED;
        break;
      case Enum29.DISABLED_STYLE_HATCHED:
      case Enum29.DISABLED_STYLE_SHADED:
        gbDisabledButtonStyle = b.value.bDisabledStyle;
        break;
    }
  }

  // Display the button image
  BltVideoObject(ButtonDestBuffer, ButtonPictures[b.value.ImageNum].vobj, UseImage, b.value.XLoc, b.value.YLoc, VO_BLT_SRCTRANSPARENCY, NULL);
}

function DrawIconOnButton(b: Pointer<GUI_BUTTON>): void {
  let xp: INT32;
  let yp: INT32;
  let width: INT32;
  let height: INT32;
  let IconX: INT32;
  let IconY: INT32;
  let IconW: INT32;
  let IconH: INT32;
  let NewClip: SGPRect;
  let OldClip: SGPRect;
  let pTrav: Pointer<ETRLEObject>;
  let hvObject: HVOBJECT;

  // If there's an actual icon on this button, try to show it.
  if (b.value.iIconID >= 0) {
    // Get width and height of button area
    width = b.value.Area.RegionBottomRightX - b.value.Area.RegionTopLeftX;
    height = b.value.Area.RegionBottomRightY - b.value.Area.RegionTopLeftY;

    // Compute viewable area (inside borders)
    NewClip.iLeft = b.value.XLoc + 3;
    NewClip.iRight = b.value.XLoc + width - 3;
    NewClip.iTop = b.value.YLoc + 2;
    NewClip.iBottom = b.value.YLoc + height - 2;

    // Get Icon's blit start coordinates
    IconX = NewClip.iLeft;
    IconY = NewClip.iTop;

    // Get current clip area
    GetClippingRect(addressof(OldClip));

    // Clip button's viewable area coords to screen
    if (NewClip.iLeft < OldClip.iLeft)
      NewClip.iLeft = OldClip.iLeft;

    // Is button right off the right side of the screen?
    if (NewClip.iLeft > OldClip.iRight)
      return;

    if (NewClip.iRight > OldClip.iRight)
      NewClip.iRight = OldClip.iRight;

    // Is button completely off the left side of the screen?
    if (NewClip.iRight < OldClip.iLeft)
      return;

    if (NewClip.iTop < OldClip.iTop)
      NewClip.iTop = OldClip.iTop;

    // Are we right off the bottom of the screen?
    if (NewClip.iTop > OldClip.iBottom)
      return;

    if (NewClip.iBottom > OldClip.iBottom)
      NewClip.iBottom = OldClip.iBottom;

    // Are we off the top?
    if (NewClip.iBottom < OldClip.iTop)
      return;

    // Did we clip the viewable area out of existance?
    if ((NewClip.iRight <= NewClip.iLeft) || (NewClip.iBottom <= NewClip.iTop))
      return;

    // Get the width and height of the icon itself
    if (b.value.uiFlags & BUTTON_GENERIC)
      pTrav = addressof(GenericButtonIcons[b.value.iIconID].value.pETRLEObject[b.value.usIconIndex]);
    else {
      GetVideoObject(addressof(hvObject), b.value.iIconID);
      pTrav = addressof(hvObject.value.pETRLEObject[b.value.usIconIndex]);
    }
    IconH = (pTrav.value.usHeight + pTrav.value.sOffsetY);
    IconW = (pTrav.value.usWidth + pTrav.value.sOffsetX);

    // Compute coordinates for centering the icon on the button or
    // use the offset system.
    if (b.value.bIconXOffset == -1)
      xp = (((width - 6) - IconW) / 2) + IconX;
    else
      xp = b.value.Area.RegionTopLeftX + b.value.bIconXOffset;
    if (b.value.bIconYOffset == -1)
      yp = (((height - 4) - IconH) / 2) + IconY;
    else
      yp = b.value.Area.RegionTopLeftY + b.value.bIconYOffset;

    // Was the button clicked on? if so, move the image slightly for the illusion
    // that the image moved into the screen.
    if (b.value.uiFlags & BUTTON_CLICKED_ON && b.value.fShiftImage) {
      xp++;
      yp++;
    }

    // Set the clipping rectangle to the viewable area of the button
    SetClippingRect(addressof(NewClip));
    // Blit the icon
    if (b.value.uiFlags & BUTTON_GENERIC)
      BltVideoObject(ButtonDestBuffer, GenericButtonIcons[b.value.iIconID], b.value.usIconIndex, xp, yp, VO_BLT_SRCTRANSPARENCY, NULL);
    else
      BltVideoObject(ButtonDestBuffer, hvObject, b.value.usIconIndex, xp, yp, VO_BLT_SRCTRANSPARENCY, NULL);
    // Restore previous clip region
    SetClippingRect(addressof(OldClip));
  }
}

// If a button has text attached to it, then it'll draw it last.
function DrawTextOnButton(b: Pointer<GUI_BUTTON>): void {
  let xp: INT32;
  let yp: INT32;
  let width: INT32;
  let height: INT32;
  let TextX: INT32;
  let TextY: INT32;
  let NewClip: SGPRect;
  let OldClip: SGPRect;
  let sForeColor: INT16;

  // If this button actually has a string to print
  if (b.value.string) {
    // Get the width and height of this button
    width = b.value.Area.RegionBottomRightX - b.value.Area.RegionTopLeftX;
    height = b.value.Area.RegionBottomRightY - b.value.Area.RegionTopLeftY;

    // Compute the viewable area on this button
    NewClip.iLeft = b.value.XLoc + 3;
    NewClip.iRight = b.value.XLoc + width - 3;
    NewClip.iTop = b.value.YLoc + 2;
    NewClip.iBottom = b.value.YLoc + height - 2;

    // Get the starting coordinates to print
    TextX = NewClip.iLeft;
    TextY = NewClip.iTop;

    // Get the current clipping area
    GetClippingRect(addressof(OldClip));

    // Clip the button's viewable area to the screen
    if (NewClip.iLeft < OldClip.iLeft)
      NewClip.iLeft = OldClip.iLeft;

    // Are we off hte right side?
    if (NewClip.iLeft > OldClip.iRight)
      return;

    if (NewClip.iRight > OldClip.iRight)
      NewClip.iRight = OldClip.iRight;

    // Are we off the left side?
    if (NewClip.iRight < OldClip.iLeft)
      return;

    if (NewClip.iTop < OldClip.iTop)
      NewClip.iTop = OldClip.iTop;

    // Are we off the bottom of the screen?
    if (NewClip.iTop > OldClip.iBottom)
      return;

    if (NewClip.iBottom > OldClip.iBottom)
      NewClip.iBottom = OldClip.iBottom;

    // Are we off the top?
    if (NewClip.iBottom < OldClip.iTop)
      return;

    // Did we clip the viewable area out of existance?
    if ((NewClip.iRight <= NewClip.iLeft) || (NewClip.iBottom <= NewClip.iTop))
      return;

    // Set the font printing settings to the buttons viewable area
    SetFontDestBuffer(ButtonDestBuffer, NewClip.iLeft, NewClip.iTop, NewClip.iRight, NewClip.iBottom, FALSE);

    // Compute the coordinates to center the text
    if (b.value.bTextYOffset == -1)
      yp = (((height)-GetFontHeight(b.value.usFont)) / 2) + TextY - 1;
    else
      yp = b.value.Area.RegionTopLeftY + b.value.bTextYOffset;
    if (b.value.bTextXOffset == -1) {
      switch (b.value.bJustification) {
        case BUTTON_TEXT_LEFT:
          xp = TextX + 3;
          break;
        case BUTTON_TEXT_RIGHT:
          xp = NewClip.iRight - StringPixLength(b.value.string, b.value.usFont) - 3;
          break;
        case BUTTON_TEXT_CENTER:
        default:
          xp = (((width - 6) - StringPixLength(b.value.string, b.value.usFont)) / 2) + TextX;
          break;
      }
    } else
      xp = b.value.Area.RegionTopLeftX + b.value.bTextXOffset;

    // Set the printing font to the button text font
    SetFont(b.value.usFont);

    // print the text
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(b.value.sForeColor);
    sForeColor = b.value.sForeColor;
    if (b.value.sShadowColor != -1)
      SetFontShadow(b.value.sShadowColor);
    // Override the colors if necessary.
    if (b.value.uiFlags & BUTTON_ENABLED && b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA && b.value.sForeColorHilited != -1) {
      SetFontForeground(b.value.sForeColorHilited);
      sForeColor = b.value.sForeColorHilited;
    } else if (b.value.uiFlags & BUTTON_CLICKED_ON && b.value.sForeColorDown != -1) {
      SetFontForeground(b.value.sForeColorDown);
      sForeColor = b.value.sForeColorDown;
    }
    if (b.value.uiFlags & BUTTON_ENABLED && b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA && b.value.sShadowColorHilited != -1) {
      SetFontShadow(b.value.sShadowColorHilited);
    } else if (b.value.uiFlags & BUTTON_CLICKED_ON && b.value.sShadowColorDown != -1) {
      SetFontShadow(b.value.sShadowColorDown);
    }
    if (b.value.uiFlags & BUTTON_CLICKED_ON && b.value.fShiftText) {
      // Was the button clicked on? if so, move the text slightly for the illusion
      // that the text moved into the screen.
      xp++;
      yp++;
    }
    if (b.value.sWrappedWidth != -1) {
      let bJustified: UINT8 = 0;
      switch (b.value.bJustification) {
        case BUTTON_TEXT_LEFT:
          bJustified = LEFT_JUSTIFIED;
          break;
        case BUTTON_TEXT_RIGHT:
          bJustified = RIGHT_JUSTIFIED;
          break;
        case BUTTON_TEXT_CENTER:
          bJustified = CENTER_JUSTIFIED;
          break;
        default:
          Assert(0);
          break;
      }
      if (b.value.bTextXOffset == -1) {
        // Kris:
        // There needs to be recalculation of the start positions based on the
        // justification and the width specified wrapped width.  I was drawing a
        // double lined word on the right side of the button to find it drawing way
        // over to the left.  I've added the necessary code for the right and center
        // justification.
        yp = b.value.Area.RegionTopLeftY + 2;

        switch (b.value.bJustification) {
          case BUTTON_TEXT_RIGHT:
            xp = b.value.Area.RegionBottomRightX - 3 - b.value.sWrappedWidth;

            if (b.value.fShiftText && b.value.uiFlags & BUTTON_CLICKED_ON)
              xp++, yp++;
            break;
          case BUTTON_TEXT_CENTER:
            xp = b.value.Area.RegionTopLeftX + 3 + b.value.sWrappedWidth / 2;

            if (b.value.fShiftText && b.value.uiFlags & BUTTON_CLICKED_ON)
              xp++, yp++;
            break;
        }
      }
      yp += b.value.bTextYSubOffSet;
      xp += b.value.bTextXSubOffSet;
      DisplayWrappedString(xp, yp, b.value.sWrappedWidth, 1, b.value.usFont, sForeColor, b.value.string, FONT_MCOLOR_BLACK, FALSE, bJustified);
    } else {
      yp += b.value.bTextYSubOffSet;
      xp += b.value.bTextXSubOffSet;
      mprintf(xp, yp, b.value.string);
    }
    // Restore the old text printing settings
  }
}

//=============================================================================
//	DrawGenericButton
//
//	This function is called by the DrawIconicButton and DrawTextButton
//	routines to draw the borders and background of the buttons.
//
function DrawGenericButton(b: Pointer<GUI_BUTTON>): void {
  let NumChunksWide: INT32;
  let NumChunksHigh: INT32;
  let cx: INT32;
  let cy: INT32;
  let width: INT32;
  let height: INT32;
  let hremain: INT32;
  let wremain: INT32;
  let q: INT32;
  let ImgNum: INT32;
  let ox: INT32;
  let oy: INT32;
  let iBorderHeight: INT32;
  let iBorderWidth: INT32;
  let BPic: HVOBJECT;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let ClipRect: SGPRect;
  let pTrav: Pointer<ETRLEObject>;

  // Select the graphics to use depending on the current state of the button
  if (b.value.uiFlags & BUTTON_ENABLED) {
    if (!(b.value.uiFlags & BUTTON_ENABLED) && (GenericButtonGrayed[b.value.ImageNum] == NULL))
      BPic = GenericButtonOffNormal[b.value.ImageNum];
    else if (b.value.uiFlags & BUTTON_CLICKED_ON) {
      if ((b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA) && (GenericButtonOnHilite[b.value.ImageNum] != NULL) && gfRenderHilights)
        BPic = GenericButtonOnHilite[b.value.ImageNum];
      else
        BPic = GenericButtonOnNormal[b.value.ImageNum];
    } else {
      if ((b.value.Area.uiFlags & MSYS_MOUSE_IN_AREA) && (GenericButtonOffHilite[b.value.ImageNum] != NULL) && gfRenderHilights)
        BPic = GenericButtonOffHilite[b.value.ImageNum];
      else
        BPic = GenericButtonOffNormal[b.value.ImageNum];
    }
  } else if (GenericButtonGrayed[b.value.ImageNum])
    BPic = GenericButtonGrayed[b.value.ImageNum];
  else {
    BPic = GenericButtonOffNormal[b.value.ImageNum];
    switch (b.value.bDisabledStyle) {
      case Enum29.DISABLED_STYLE_DEFAULT:
        gbDisabledButtonStyle = b.value.string ? Enum29.DISABLED_STYLE_SHADED : Enum29.DISABLED_STYLE_HATCHED;
        break;
      case Enum29.DISABLED_STYLE_HATCHED:
      case Enum29.DISABLED_STYLE_SHADED:
        gbDisabledButtonStyle = b.value.bDisabledStyle;
        break;
    }
  }

  iBorderWidth = 3;
  iBorderHeight = 2;
  pTrav = NULL;

  // DB - Added this to support more flexible sizing of border images
  // The 3x2 size was a bit limiting. JA2 should default to the original
  // size, unchanged

  // Compute the number of button "chunks" needed to be blitted
  width = b.value.Area.RegionBottomRightX - b.value.Area.RegionTopLeftX;
  height = b.value.Area.RegionBottomRightY - b.value.Area.RegionTopLeftY;
  NumChunksWide = width / iBorderWidth;
  NumChunksHigh = height / iBorderHeight;
  hremain = height % iBorderHeight;
  wremain = width % iBorderWidth;

  cx = (b.value.XLoc + ((NumChunksWide - 1) * iBorderWidth) + wremain);
  cy = (b.value.YLoc + ((NumChunksHigh - 1) * iBorderHeight) + hremain);

  // Fill the button's area with the button's background color
  ColorFillVideoSurfaceArea(ButtonDestBuffer, b.value.Area.RegionTopLeftX, b.value.Area.RegionTopLeftY, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY, GenericButtonFillColors[b.value.ImageNum]);

  // If there is a background image, fill the button's area with it
  if (GenericButtonBackground[b.value.ImageNum] != NULL) {
    ox = oy = 0;
    // if the button was clicked on, adjust the background image so that we get
    // the illusion that it is sunk into the screen.
    if (b.value.uiFlags & BUTTON_CLICKED_ON)
      ox = oy = 1;

    // Fill the area with the image, tilling it if need be.
    ImageFillVideoSurfaceArea(ButtonDestBuffer, b.value.Area.RegionTopLeftX + ox, b.value.Area.RegionTopLeftY + oy, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY, GenericButtonBackground[b.value.ImageNum], GenericButtonBackgroundIndex[b.value.ImageNum], GenericButtonOffsetX[b.value.ImageNum], GenericButtonOffsetY[b.value.ImageNum]);
  }

  // Lock the dest buffer
  pDestBuf = LockVideoSurface(ButtonDestBuffer, addressof(uiDestPitchBYTES));

  GetClippingRect(addressof(ClipRect));

  // Draw the button's borders and corners (horizontally)
  for (q = 0; q < NumChunksWide; q++) {
    if (q == 0)
      ImgNum = 0;
    else
      ImgNum = 1;

    if (gbPixelDepth == 16) {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, (b.value.XLoc + (q * iBorderWidth)), b.value.YLoc, ImgNum, addressof(ClipRect));
    } else if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, (b.value.XLoc + (q * iBorderWidth)), b.value.YLoc, ImgNum, addressof(ClipRect));
    }

    if (q == 0)
      ImgNum = 5;
    else
      ImgNum = 6;

    if (gbPixelDepth == 16) {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, (b.value.XLoc + (q * iBorderWidth)), cy, ImgNum, addressof(ClipRect));
    } else if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, (b.value.XLoc + (q * iBorderWidth)), cy, ImgNum, addressof(ClipRect));
    }
  }
  // Blit the right side corners
  if (gbPixelDepth == 16) {
    Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, b.value.YLoc, 2, addressof(ClipRect));
  } else if (gbPixelDepth == 8) {
    Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, b.value.YLoc, 2, addressof(ClipRect));
  }

  if (gbPixelDepth == 16) {
    Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, cy, 7, addressof(ClipRect));
  } else if (gbPixelDepth == 8) {
    Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, cy, 7, addressof(ClipRect));
  }
  // Draw the vertical members of the button's borders
  NumChunksHigh--;

  if (hremain != 0) {
    q = NumChunksHigh;
    if (gbPixelDepth == 16) {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, b.value.XLoc, (b.value.YLoc + (q * iBorderHeight) - (iBorderHeight - hremain)), 3, addressof(ClipRect));
    } else if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, b.value.XLoc, (b.value.YLoc + (q * iBorderHeight) - (iBorderHeight - hremain)), 3, addressof(ClipRect));
    }

    if (gbPixelDepth == 16) {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, (b.value.YLoc + (q * iBorderHeight) - (iBorderHeight - hremain)), 4, addressof(ClipRect));
    } else if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, (b.value.YLoc + (q * iBorderHeight) - (iBorderHeight - hremain)), 4, addressof(ClipRect));
    }
  }

  for (q = 1; q < NumChunksHigh; q++) {
    if (gbPixelDepth == 16) {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, b.value.XLoc, (b.value.YLoc + (q * iBorderHeight)), 3, addressof(ClipRect));
    } else if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, b.value.XLoc, (b.value.YLoc + (q * iBorderHeight)), 3, addressof(ClipRect));
    }

    if (gbPixelDepth == 16) {
      Blt8BPPDataTo16BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, (b.value.YLoc + (q * iBorderHeight)), 4, addressof(ClipRect));
    } else if (gbPixelDepth == 8) {
      Blt8BPPDataTo8BPPBufferTransparentClip(pDestBuf, uiDestPitchBYTES, BPic, cx, (b.value.YLoc + (q * iBorderHeight)), 4, addressof(ClipRect));
    }
  }

  // Unlock buffer
  UnLockVideoSurface(ButtonDestBuffer);
}

//=======================================================================================================
// Dialog box code
//

//=======================================================================================================
//=======================================================================================================
//
//	Very preliminary stuff follows
//
//=======================================================================================================
//=======================================================================================================

interface CreateDlgInfo {
  iFlags: INT32; // Holds the creation flags

  iPosX: INT32; // Screen position of dialog box
  iPosY: INT32;
  iWidth: INT32; // Dimensions of dialog box (if needed)
  iHeight: INT32;

  iAreaWidth: INT32; // Dimensions of area the dialog box will be
  iAreaHeight: INT32; // placed (for auto-sizing and auto-placement
  iAreaOffsetX: INT32; // only)
  iAreaOffsetY: INT32;

  zDlgText: Pointer<UINT16>; // Text to be displayed (if any)
  iTextFont: INT32; // Font to be used for text (if any)
  usTextCols: UINT16; // Font colors (for mono fonts only)

  iTextAreaX: INT32; // Area in dialog box where text is to be
  iTextAreaY: INT32; // put (for non-auto placed text)
  iTextAreaWidth: INT32;
  iTextAreaHeight: INT32;

  hBackImg: HVOBJECT; // Background pic for dialog box (if any)
  iBackImgIndex: INT32; // Sub-image index to use for image
  iBackOffsetX: INT32; // Offset on dialog box where to put image
  iBackOffsetY: INT32;

  hIconImg: HVOBJECT; // Icon image pic and index.
  iIconImgIndex: INT32;
  iIconPosX: INT32;
  iIconPosY: INT32;

  iBtnTypes: INT32;

  iOkPosX: INT32; // Ok button info
  iOkPosY: INT32;
  iOkWidth: INT32;
  iOkHeight: INT32;
  iOkImg: INT32;

  iCnclPosX: INT32; // Cancel button info
  iCnclPosY: INT32;
  iCnclWidth: INT32;
  iCnclHeight: INT32;
  iCnclImg: INT32;
}

const DLG_RESTRICT_MOUSE = 1;
const DLG_OK_BUTTON = 2;
const DLG_CANCEL_BUTTON = 4;
const DLG_AUTOSIZE = 8;
const DLG_RECREATE = 16;
const DLG_AUTOPOSITION = 32;
const DLG_TEXT_IN_AREA = 64;
const DLG_USE_BKGRND_IMAGE = 128;
const DLG_USE_BORDERS = 256;
const DLG_USE_BTN_HOTSPOTS = 512;
const DLG_USE_MONO_FONTS = 1024;
const DLG_IS_ACTIVE = 2048;

const DLG_MANUAL_RENDER = 0;
const DLG_START_RENDER = 1;
const DLG_STOP_RENDER = 2;
const DLG_AUTO_RENDER = 3;

const DLG_GET_STATUS = 0;
const DLG_WAIT_FOR_RESPONSE = 1;

const DLG_STATUS_NONE = 0;
const DLG_STATUS_OK = 1;
const DLG_STATUS_CANCEL = 2;
const DLG_STATUS_PENDING = 3;

const DLG_CLEARALL = 0;
const DLG_POSITION = 1;
const DLG_AREA = 2;
const DLG_TEXT = 3;
const DLG_TEXTAREA = 4;
const DLG_BACKPIC = 5;
const DLG_ICON = 6;
const DLG_OKBUTTON = 7;
const DLG_CANCELBUTTON = 8;
const DLG_OPTIONS = 9;
const DLG_SIZE = 10;

function SetDialogAttributes(pDlgInfo: Pointer<CreateDlgInfo>, iAttrib: INT32, ...args: any[]): BOOLEAN {
  let arg: va_list;
  let iFont: INT32;
  let iFontOptions: INT32;
  let zString: Pointer<UINT16>;
  let iX: INT32;
  let iY: INT32;
  let iW: INT32;
  let iH: INT32;
  let iIndex: INT32;
  let hVObj: HVOBJECT;
  let iButnImg: INT32;
  let iFlags: INT32;
  let ubFGrnd: UINT8;
  let ubBGrnd: UINT8;

  // Set up for var args
  va_start(arg, iAttrib); // Init variable argument list

  switch (iAttrib) {
    case DLG_CLEARALL:
      // Check to make sure it's not enabled, if so either abort or trash it!
      memset(pDlgInfo, 0, sizeof(CreateDlgInfo));
      break;

    case DLG_POSITION:
      // Screen X/Y position of dialog box
      iFlags = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);

      iW = va_arg(arg, INT32);
      iH = va_arg(arg, INT32);
      break;

    case DLG_SIZE:
      // Width and height of doalog box
      iFlags = va_arg(arg, INT32);
      iW = va_arg(arg, INT32);
      iH = va_arg(arg, INT32);
      break;

    case DLG_AREA:
      // Area where dialog box should be placed in (if not screen)
      iFlags = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);
      iW = va_arg(arg, INT32);
      iH = va_arg(arg, INT32);
      break;

    case DLG_TEXT:
      // Set text and font for this dialog box
      iFontOptions = va_arg(arg, INT32);

      iFont = va_arg(arg, INT32);
      pDlgInfo.value.iTextFont = iFont;

      zString = va_arg(arg, UINT32);

      if (pDlgInfo.value.zDlgText != NULL)
        MemFree(pDlgInfo.value.zDlgText);

      if (zString == NULL)
        pDlgInfo.value.zDlgText = NULL;
      else {
        pDlgInfo.value.zDlgText = NULL; // Temp
      }

      if (iFontOptions & DLG_USE_MONO_FONTS) {
        ubFGrnd = va_arg(arg, UINT8);
        ubBGrnd = va_arg(arg, UINT8);
        pDlgInfo.value.usTextCols = (((ubBGrnd) << 8) | ubFGrnd);
      }
      break;

    case DLG_TEXTAREA:
      // Area on dialog box where the text should go!
      iFlags = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);
      iW = va_arg(arg, INT32);
      iH = va_arg(arg, INT32);
      break;

    case DLG_BACKPIC:
      iFlags = va_arg(arg, INT32);
      hVObj = va_arg(arg, UINT32);
      iIndex = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);
      break;

    case DLG_ICON:
      // Icon
      iFlags = va_arg(arg, INT32);
      hVObj = va_arg(arg, UINT32);
      iIndex = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);
      break;

    case DLG_OKBUTTON:
      // Ok button options
      iFlags = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);
      iW = va_arg(arg, INT32);
      iH = va_arg(arg, INT32);
      iButnImg = va_arg(arg, INT32);
      break;

    case DLG_CANCELBUTTON:
      // Cancel button options
      iFlags = va_arg(arg, INT32);
      iX = va_arg(arg, INT32);
      iY = va_arg(arg, INT32);
      iW = va_arg(arg, INT32);
      iH = va_arg(arg, INT32);
      iButnImg = va_arg(arg, INT32);
      break;

    case DLG_OPTIONS:
      iFlags = va_arg(arg, INT32);
      break;
  }

  va_end(arg); // Must have this for proper exit

  return TRUE;
}

function CreateDialogBox(pDlgInfo: Pointer<CreateDlgInfo>): INT32 {
  return -1;
}

function RemoveDialogBox(): void {
}

function DrawDialogBox(iDlgBox: INT32): void {
}

//------------------------------------------------------------------------------------------------------

function CreateCheckBoxButton(x: INT16, y: INT16, filename: Pointer<UINT8>, Priority: INT16, ClickCallback: GUI_CALLBACK): INT32 {
  let b: Pointer<GUI_BUTTON>;
  let ButPic: INT32;
  let iButtonID: INT32;
  Assert(filename != NULL);
  Assert(strlen(filename));
  if ((ButPic = LoadButtonImage(filename, -1, 0, 1, 2, 3)) == -1) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateCheckBoxButton: Can't load button image");
    return -1;
  }
  iButtonID = QuickCreateButton(ButPic, x, y, BUTTON_CHECKBOX, Priority, MSYS_NO_CALLBACK, ClickCallback);
  if (iButtonID == -1) {
    DbgMessage(TOPIC_BUTTON_HANDLER, DBG_LEVEL_0, "CreateCheckBoxButton: Can't create button");
    return -1;
  }

  // change the flags so that it isn't a quick button anymore
  b = ButtonList[iButtonID];
  b.value.uiFlags &= (~BUTTON_QUICK);
  b.value.uiFlags |= (BUTTON_CHECKBOX | BUTTON_SELFDELETE_IMAGE);

  return iButtonID;
}

// Added Oct17, 97 Carter - kind of mindless, but might as well have it
function MSYS_SetBtnUserData(iButtonNum: INT32, index: INT32, userdata: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  b = ButtonList[iButtonNum];
  if (index < 0 || index > 3)
    return;
  b.value.UserData[index] = userdata;
}

function MSYS_GetBtnUserData(b: Pointer<GUI_BUTTON>, index: INT32): INT32 {
  if (index < 0 || index > 3)
    return 0;

  return b.value.UserData[index];
}

// Generic Button Movement Callback to reset the mouse button if the mouse is no longer
// in the button region.
function BtnGenericMouseMoveButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // If the button isn't the anchored button, then we don't want to modify the button state.
  if (btn != gpAnchoredButton)
    return;
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    if (!gfAnchoredState) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      if (btn.value.ubSoundSchemeID) {
        PlayButtonSound(btn.value.IDNum, BUTTON_SOUND_CLICKED_OFF);
      }
    }
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    if (btn.value.ubSoundSchemeID) {
      PlayButtonSound(btn.value.IDNum, BUTTON_SOUND_CLICKED_ON);
    }
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function ReleaseAnchorMode(): void {
  if (!gpAnchoredButton)
    return;

  if (gusMouseXPos < gpAnchoredButton.value.Area.RegionTopLeftX || gusMouseXPos > gpAnchoredButton.value.Area.RegionBottomRightX || gusMouseYPos < gpAnchoredButton.value.Area.RegionTopLeftY || gusMouseYPos > gpAnchoredButton.value.Area.RegionBottomRightY) {
    // released outside button area, so restore previous button state.
    if (gfAnchoredState)
      gpAnchoredButton.value.uiFlags |= BUTTON_CLICKED_ON;
    else
      gpAnchoredButton.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(gpAnchoredButton.value.Area.RegionTopLeftX, gpAnchoredButton.value.Area.RegionTopLeftY, gpAnchoredButton.value.Area.RegionBottomRightX, gpAnchoredButton.value.Area.RegionBottomRightY);
  }
  gpPrevAnchoredButton = gpAnchoredButton;
  gpAnchoredButton = NULL;
}

// Used to setup a dirtysaved region for buttons
function SetButtonSavedRect(iButton: INT32): BOOLEAN {
  let b: Pointer<GUI_BUTTON>;
  let xloc: INT32;
  let yloc: INT32;
  let w: INT32;
  let h: INT32;

  Assert(iButton >= 0);
  Assert(iButton < MAX_BUTTONS);

  b = ButtonList[iButton];

  xloc = b.value.XLoc;
  yloc = b.value.YLoc;
  w = (b.value.Area.RegionBottomRightX - b.value.Area.RegionTopLeftX);
  h = (b.value.Area.RegionBottomRightY - b.value.Area.RegionTopLeftY);

  if (!(b.value.uiFlags & BUTTON_SAVEBACKGROUND)) {
    b.value.uiFlags |= BUTTON_SAVEBACKGROUND;

    b.value.BackRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT | BGND_FLAG_SAVERECT, NULL, xloc, yloc, (xloc + w), (yloc + h));
  }

  return TRUE;
}

function FreeButtonSavedRect(iButton: INT32): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButton >= 0);
  Assert(iButton < MAX_BUTTONS);

  b = ButtonList[iButton];

  if ((b.value.uiFlags & BUTTON_SAVEBACKGROUND)) {
    b.value.uiFlags &= (~BUTTON_SAVEBACKGROUND);
    FreeBackgroundRectPending(b.value.BackRect);
  }
}

// Kris:
// Yet new logical additions to the winbart library.
function HideButton(iButtonNum: INT32): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonNum >= 0);
  Assert(iButtonNum < MAX_BUTTONS);

  b = ButtonList[iButtonNum];

  Assert(b);

  b.value.Area.uiFlags &= (~MSYS_REGION_ENABLED);
  b.value.uiFlags |= BUTTON_DIRTY;
  InvalidateRegion(b.value.Area.RegionTopLeftX, b.value.Area.RegionTopLeftY, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY);
}

function ShowButton(iButtonNum: INT32): void {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonNum >= 0);
  Assert(iButtonNum < MAX_BUTTONS);

  b = ButtonList[iButtonNum];

  Assert(b);

  b.value.Area.uiFlags |= MSYS_REGION_ENABLED;
  b.value.uiFlags |= BUTTON_DIRTY;
  InvalidateRegion(b.value.Area.RegionTopLeftX, b.value.Area.RegionTopLeftY, b.value.Area.RegionBottomRightX, b.value.Area.RegionBottomRightY);
}

function DisableButtonHelpTextRestore(): void {
  fDisableHelpTextRestoreFlag = TRUE;
}

function EnableButtonHelpTextRestore(): void {
  fDisableHelpTextRestoreFlag = TRUE;
}

function GiveButtonDefaultStatus(iButtonID: INT32, iDefaultStatus: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  // If new default status added, then this assert may need to be adjusted.
  AssertMsg(iDefaultStatus >= Enum28.DEFAULT_STATUS_NONE && iDefaultStatus <= Enum28.DEFAULT_STATUS_WINDOWS95, String("Illegal button default status of %d", iDefaultStatus));
  Assert(b);

  if (b.value.bDefaultStatus != iDefaultStatus) {
    b.value.bDefaultStatus = iDefaultStatus;
    b.value.uiFlags |= BUTTON_DIRTY;
  }
}

function RemoveButtonDefaultStatus(iButtonID: INT32): void {
  let b: Pointer<GUI_BUTTON>;
  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  b = ButtonList[iButtonID];
  Assert(b);

  if (b.value.bDefaultStatus) {
    b.value.bDefaultStatus = Enum28.DEFAULT_STATUS_NONE;
    b.value.uiFlags |= BUTTON_DIRTY;
  }
}

function GetButtonArea(iButtonID: INT32, pRect: Pointer<SGPRect>): BOOLEAN {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);
  Assert(pRect);

  b = ButtonList[iButtonID];
  Assert(b);

  if ((pRect == NULL) || (b == NULL))
    return FALSE;

  pRect.value.iLeft = b.value.Area.RegionTopLeftX;
  pRect.value.iTop = b.value.Area.RegionTopLeftY;
  pRect.value.iRight = b.value.Area.RegionBottomRightX;
  pRect.value.iBottom = b.value.Area.RegionBottomRightY;

  return TRUE;
}

function GetButtonWidth(iButtonID: INT32): INT32 {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);

  b = ButtonList[iButtonID];
  Assert(b);

  if (b == NULL)
    return -1;

  return b.value.Area.RegionBottomRightX - b.value.Area.RegionTopLeftX;
}

function GetButtonHeight(iButtonID: INT32): INT32 {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);

  b = ButtonList[iButtonID];
  Assert(b);

  if (b == NULL)
    return -1;

  return b.value.Area.RegionBottomRightY - b.value.Area.RegionTopLeftY;
}

function GetButtonX(iButtonID: INT32): INT32 {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);

  b = ButtonList[iButtonID];
  Assert(b);

  if (b == NULL)
    return 0;

  return b.value.Area.RegionTopLeftX;
}

function GetButtonY(iButtonID: INT32): INT32 {
  let b: Pointer<GUI_BUTTON>;

  Assert(iButtonID >= 0);
  Assert(iButtonID < MAX_BUTTONS);

  b = ButtonList[iButtonID];
  Assert(b);

  if (b == NULL)
    return 0;

  return b.value.Area.RegionTopLeftY;
}
