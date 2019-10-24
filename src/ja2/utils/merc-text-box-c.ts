const TEXT_POPUP_WINDOW_TEXT_OFFSET_X = 8;
const TEXT_POPUP_WINDOW_TEXT_OFFSET_Y = 8;
const TEXT_POPUP_STRING_WIDTH = 296;
const TEXT_POPUP_GAP_BN_LINES = 10;
const TEXT_POPUP_FONT = () => FONT12ARIAL();
const TEXT_POPUP_COLOR = FONT_MCOLOR_WHITE;

const MERC_TEXT_FONT = () => FONT12ARIAL();
const MERC_TEXT_COLOR = FONT_MCOLOR_WHITE;

const MERC_TEXT_MIN_WIDTH = 10;
const MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X = 10;
const MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_Y = 10;

const MERC_BACKGROUND_WIDTH = 350;
const MERC_BACKGROUND_HEIGHT = 200;

// the max number of pop up boxes availiable to user
const MAX_NUMBER_OF_POPUP_BOXES = 10;

// both of the below are index by the enum for thier types - background and border in
// MercTextBox.h

// filenames for border popup .sti's
let zMercBorderPopupFilenames: STR8[] /* [] */ = [
  "INTERFACE\\TactPopUp.sti",
  "INTERFACE\\TactRedPopUp.sti",
  "INTERFACE\\TactBluePopUp.sti",
  "INTERFACE\\TactPopUpMain.sti",
  "INTERFACE\\LaptopPopup.sti",
];

// filenames for background popup .pcx's
let zMercBackgroundPopupFilenames: STR8[] /* [] */ = [
  "INTERFACE\\TactPopupBackground.pcx",
  "INTERFACE\\TactPopupWhiteBackground.pcx",
  "INTERFACE\\TactPopupGreyBackground.pcx",
  "INTERFACE\\TactPopupBackgroundMain.pcx",
  "INTERFACE\\LaptopPopupBackground.pcx",
  "INTERFACE\\imp_popup_background.pcx",
];

// the pop up box structure
let gBasicPopUpTextBox: MercPopUpBox;

// the current pop up box
let gPopUpTextBox: Pointer<MercPopUpBox> = null;

// the old one
let gOldPopUpTextBox: Pointer<MercPopUpBox> = null;

// the list of boxes
let gpPopUpBoxList: Pointer<MercPopUpBox>[] /* [MAX_NUMBER_OF_POPUP_BOXES] */;

// the flags
let guiFlags: UINT32 = 0;
let guiBoxIcons: UINT32;
let guiSkullIcons: UINT32;

function SetCurrentPopUpBox(uiId: UINT32): boolean {
  // given id of the box, find it in the list and set to current

  // make sure the box id is valid
  if (uiId == -1) {
    // ScreenMsg( FONT_MCOLOR_WHITE, MSG_BETAVERSION, L"Error: Trying to set Current Popup Box using -1 as an ID" );
    return false;
  }

  // see if box inited
  if (gpPopUpBoxList[uiId] != null) {
    gPopUpTextBox = gpPopUpBoxList[uiId];
    return true;
  }
  return false;
}

function OverrideMercPopupBox(pMercBox: Pointer<MercPopUpBox>): boolean {
  // store old box and set current this passed one
  gOldPopUpTextBox = gPopUpTextBox;

  gPopUpTextBox = pMercBox;

  return true;
}

function ResetOverrideMercPopupBox(): boolean {
  gPopUpTextBox = gOldPopUpTextBox;

  return true;
}

function InitMercPopupBox(): boolean {
  let iCounter: INT32 = 0;
  let VObjectDesc: VOBJECT_DESC;

  // init the pop up box list
  for (iCounter = 0; iCounter < MAX_NUMBER_OF_POPUP_BOXES; iCounter++) {
    // set ptr to null
    gpPopUpBoxList[iCounter] = null;
  }

  // LOAD STOP ICON...
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\msgboxicons.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBoxIcons)))
    AssertMsg(0, "Missing INTERFACE\\msgboxicons.sti");

  // LOAD SKULL ICON...
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\msgboxiconskull.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSkullIcons)))
    AssertMsg(0, "Missing INTERFACE\\msgboxiconskull.sti");

  return true;
}

function ShutDownPopUpBoxes(): boolean {
  let iCounter: INT32 = 0;
  for (iCounter = 0; iCounter < MAX_NUMBER_OF_POPUP_BOXES; iCounter++) {
    // now attempt to remove this box
    RemoveMercPopupBoxFromIndex(iCounter);
  }

  return true;
}

// Tactical Popup
function LoadTextMercPopupImages(ubBackgroundIndex: UINT8, ubBorderIndex: UINT8): boolean {
  let vs_desc: VSURFACE_DESC;
  let VObjectDesc: VOBJECT_DESC;

  // this function will load the graphics associated with the background and border index values

  // the background
  vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
  strcpy(vs_desc.ImageFile, zMercBackgroundPopupFilenames[ubBackgroundIndex]);
  CHECKF(AddVideoSurface(addressof(vs_desc), addressof(gPopUpTextBox.value.uiMercTextPopUpBackground)));

  // border
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP(zMercBorderPopupFilenames[ubBorderIndex], VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(gPopUpTextBox.value.uiMercTextPopUpBorder)));

  gPopUpTextBox.value.fMercTextPopupInitialized = true;

  // so far so good, return successful
  gPopUpTextBox.value.ubBackgroundIndex = ubBackgroundIndex;
  gPopUpTextBox.value.ubBorderIndex = ubBorderIndex;

  return true;
}

function RemoveTextMercPopupImages(): void {
  // this procedure will remove the background and border video surface/object from the indecies
  if (gPopUpTextBox) {
    if (gPopUpTextBox.value.fMercTextPopupInitialized) {
      // the background
      DeleteVideoSurfaceFromIndex(gPopUpTextBox.value.uiMercTextPopUpBackground);

      // the border
      DeleteVideoObjectFromIndex(gPopUpTextBox.value.uiMercTextPopUpBorder);

      gPopUpTextBox.value.fMercTextPopupInitialized = false;
    }
  }

  // done
  return;
}

function RenderMercPopUpBoxFromIndex(iBoxId: INT32, sDestX: INT16, sDestY: INT16, uiBuffer: UINT32): boolean {
  // set the current box
  if (SetCurrentPopUpBox(iBoxId) == false) {
    return false;
  }

  // now attempt to render the box
  return RenderMercPopupBox(sDestX, sDestY, uiBuffer);
}

function RenderMercPopupBox(sDestX: INT16, sDestY: INT16, uiBuffer: UINT32): boolean {
  //	UINT32  uiDestPitchBYTES;
  //	UINT32  uiSrcPitchBYTES;
  //  UINT16  *pDestBuf;
  //	UINT16  *pSrcBuf;

  // will render/transfer the image from the buffer in the data structure to the buffer specified by user
  let fReturnValue: boolean = true;

  // grab the destination buffer
  //	pDestBuf = ( UINT16* )LockVideoSurface( uiBuffer, &uiDestPitchBYTES );

  // now lock it
  //	pSrcBuf = ( UINT16* )LockVideoSurface( gPopUpTextBox->uiSourceBufferIndex, &uiSrcPitchBYTES);

  // check to see if we are wanting to blit a transparent background
  if (gPopUpTextBox.value.uiFlags & MERC_POPUP_PREPARE_FLAGS_TRANS_BACK)
    BltVideoSurface(uiBuffer, gPopUpTextBox.value.uiSourceBufferIndex, 0, sDestX, sDestY, VS_BLT_FAST | VS_BLT_USECOLORKEY, null);
  else
    BltVideoSurface(uiBuffer, gPopUpTextBox.value.uiSourceBufferIndex, 0, sDestX, sDestY, VS_BLT_FAST, null);

  // blt, and grab return value
  //	fReturnValue = Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, sDestX, sDestY, 0, 0, gPopUpTextBox->sWidth, gPopUpTextBox->sHeight);

  // Invalidate!
  if (uiBuffer == FRAME_BUFFER) {
    InvalidateRegion(sDestX, sDestY, (sDestX + gPopUpTextBox.value.sWidth), (sDestY + gPopUpTextBox.value.sHeight));
  }

  // unlock the video surfaces

  // source
  //	UnLockVideoSurface( gPopUpTextBox->uiSourceBufferIndex );

  // destination
  //	UnLockVideoSurface( uiBuffer );

  // return success or failure
  return fReturnValue;
}

function AddPopUpBoxToList(pPopUpTextBox: Pointer<MercPopUpBox>): INT32 {
  let iCounter: INT32 = 0;

  // make sure is a valid box
  if (pPopUpTextBox == null) {
    return -1;
  }

  // attempt to add box to list
  for (iCounter = 0; iCounter < MAX_NUMBER_OF_POPUP_BOXES; iCounter++) {
    if (gpPopUpBoxList[iCounter] == null) {
      // found a spot, inset
      gpPopUpBoxList[iCounter] = pPopUpTextBox;

      // set as current
      SetCurrentPopUpBox(iCounter);

      // return index value
      return iCounter;
    }
  }

  // return failure
  return -1;
}

// get box with this id
function GetPopUpBoxIndex(iId: INT32): Pointer<MercPopUpBox> {
  return gpPopUpBoxList[iId];
}

function PrepareMercPopupBox(iBoxId: INT32, ubBackgroundIndex: UINT8, ubBorderIndex: UINT8, pString: STR16, usWidth: UINT16, usMarginX: UINT16, usMarginTopY: UINT16, usMarginBottomY: UINT16, pActualWidth: Pointer<UINT16>, pActualHeight: Pointer<UINT16>): INT32 {
  let usNumberVerticalPixels: UINT16;
  let usNumberOfLines: UINT16;
  let usTextWidth: UINT16;
  let usHeight: UINT16;
  let i: UINT16;
  let hImageHandle: HVOBJECT;
  let usPosY: UINT16;
  let usPosX: UINT16;
  let vs_desc: VSURFACE_DESC;
  let usStringPixLength: UINT16;
  let DestRect: SGPRect;
  let hSrcVSurface: HVSURFACE;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let pSrcBuf: Pointer<UINT8>;
  let ubFontColor: UINT8;
  let ubFontShadowColor: UINT8;
  let usColorVal: UINT16;
  let usLoopEnd: UINT16;
  let sDispTextXPos: INT16;
  let pPopUpTextBox: Pointer<MercPopUpBox> = null;

  if (usWidth >= 640)
    return -1;

  if (usWidth <= MERC_TEXT_MIN_WIDTH)
    usWidth = MERC_TEXT_MIN_WIDTH;

  // check id value, if -1, box has not been inited yet
  if (iBoxId == -1) {
    // no box yet

    // create box
    pPopUpTextBox = MemAlloc(sizeof(MercPopUpBox));

    // copy over ptr
    gPopUpTextBox = pPopUpTextBox;

    // Load appropriate images
    if (LoadTextMercPopupImages(ubBackgroundIndex, ubBorderIndex) == false) {
      MemFree(pPopUpTextBox);
      return -1;
    }
  } else {
    // has been created already,
    // Check if these images are different

    // grab box
    pPopUpTextBox = GetPopUpBoxIndex(iBoxId);

    // box has valid id and no instance?..error
    Assert(pPopUpTextBox);

    // copy over ptr
    gPopUpTextBox = pPopUpTextBox;

    if (ubBackgroundIndex != pPopUpTextBox.value.ubBackgroundIndex || ubBorderIndex != pPopUpTextBox.value.ubBorderIndex || !pPopUpTextBox.value.fMercTextPopupInitialized) {
      // Remove old, set new
      RemoveTextMercPopupImages();
      if (LoadTextMercPopupImages(ubBackgroundIndex, ubBorderIndex) == false) {
        return -1;
      }
    }
  }

  gPopUpTextBox.value.uiFlags = guiFlags;
  // reset flags
  guiFlags = 0;

  usStringPixLength = WFStringPixLength(pString, TEXT_POPUP_FONT());

  if (usStringPixLength < (usWidth - (MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X)*2)) {
    usWidth = usStringPixLength + MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X * 2;
    usTextWidth = usWidth - (MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X)*2 + 1;
  } else {
    usTextWidth = usWidth - (MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X)*2 + 1 - usMarginX;
  }

  usNumberVerticalPixels = IanWrappedStringHeight(0, 0, usTextWidth, 2, TEXT_POPUP_FONT(), MERC_TEXT_COLOR, pString, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  usNumberOfLines = usNumberVerticalPixels / TEXT_POPUP_GAP_BN_LINES;

  usHeight = usNumberVerticalPixels + MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X * 2;

  // Add height for margins
  usHeight += usMarginTopY + usMarginBottomY;

  // Add width for margins
  usWidth += (usMarginX * 2);

  // Add width for iconic...
  if ((pPopUpTextBox.value.uiFlags & (MERC_POPUP_PREPARE_FLAGS_STOPICON | MERC_POPUP_PREPARE_FLAGS_SKULLICON))) {
    // Make minimun height for box...
    if (usHeight < 45) {
      usHeight = 45;
    }
    usWidth += 35;
  }

  if (usWidth >= MERC_BACKGROUND_WIDTH)
    usWidth = MERC_BACKGROUND_WIDTH - 1;
  // make sure the area isnt bigger then the background texture
  if ((usWidth >= MERC_BACKGROUND_WIDTH) || usHeight >= MERC_BACKGROUND_HEIGHT) {
    if (iBoxId == -1) {
      MemFree(pPopUpTextBox);
    }

    return -1;
  }
  // Create a background video surface to blt the face onto
  memset(addressof(vs_desc), 0, sizeof(VSURFACE_DESC));
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = usWidth;
  vs_desc.usHeight = usHeight;
  vs_desc.ubBitDepth = 16;
  CHECKF(AddVideoSurface(addressof(vs_desc), addressof(pPopUpTextBox.value.uiSourceBufferIndex)));
  pPopUpTextBox.value.fMercTextPopupSurfaceInitialized = true;

  pPopUpTextBox.value.sWidth = usWidth;
  pPopUpTextBox.value.sHeight = usHeight;

  pActualWidth.value = usWidth;
  pActualHeight.value = usHeight;

  DestRect.iLeft = 0;
  DestRect.iTop = 0;
  DestRect.iRight = DestRect.iLeft + usWidth;
  DestRect.iBottom = DestRect.iTop + usHeight;

  if (pPopUpTextBox.value.uiFlags & MERC_POPUP_PREPARE_FLAGS_TRANS_BACK) {
    // Zero with yellow,
    // Set source transparcenty
    SetVideoSurfaceTransparency(pPopUpTextBox.value.uiSourceBufferIndex, FROMRGB(255, 255, 0));

    pDestBuf = LockVideoSurface(pPopUpTextBox.value.uiSourceBufferIndex, addressof(uiDestPitchBYTES));

    usColorVal = Get16BPPColor(FROMRGB(255, 255, 0));
    usLoopEnd = (usWidth * usHeight);

    for (i = 0; i < usLoopEnd; i++) {
      pDestBuf[i] = usColorVal;
    }

    UnLockVideoSurface(pPopUpTextBox.value.uiSourceBufferIndex);
  } else {
    if (!GetVideoSurface(addressof(hSrcVSurface), pPopUpTextBox.value.uiMercTextPopUpBackground)) {
      AssertMsg(0, String("Failed to GetVideoSurface for PrepareMercPopupBox.  VSurfaceID:  %d", pPopUpTextBox.value.uiMercTextPopUpBackground));
    }

    pDestBuf = LockVideoSurface(pPopUpTextBox.value.uiSourceBufferIndex, addressof(uiDestPitchBYTES));
    pSrcBuf = LockVideoSurface(pPopUpTextBox.value.uiMercTextPopUpBackground, addressof(uiSrcPitchBYTES));

    Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, 0, 0, addressof(DestRect));

    UnLockVideoSurface(pPopUpTextBox.value.uiMercTextPopUpBackground);
    UnLockVideoSurface(pPopUpTextBox.value.uiSourceBufferIndex);
  }

  GetVideoObject(addressof(hImageHandle), pPopUpTextBox.value.uiMercTextPopUpBorder);

  usPosX = usPosY = 0;
  // blit top row of images
  for (i = TEXT_POPUP_GAP_BN_LINES; i < usWidth - TEXT_POPUP_GAP_BN_LINES; i += TEXT_POPUP_GAP_BN_LINES) {
    // TOP ROW
    BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 1, i, usPosY, VO_BLT_SRCTRANSPARENCY, null);
    // BOTTOM ROW
    BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 6, i, usHeight - TEXT_POPUP_GAP_BN_LINES + 6, VO_BLT_SRCTRANSPARENCY, null);
  }

  // blit the left and right row of images
  usPosX = 0;
  for (i = TEXT_POPUP_GAP_BN_LINES; i < usHeight - TEXT_POPUP_GAP_BN_LINES; i += TEXT_POPUP_GAP_BN_LINES) {
    BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 3, usPosX, i, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 4, usPosX + usWidth - 4, i, VO_BLT_SRCTRANSPARENCY, null);
  }

  // blt the corner images for the row
  // top left
  BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 0, 0, usPosY, VO_BLT_SRCTRANSPARENCY, null);
  // top right
  BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 2, usWidth - TEXT_POPUP_GAP_BN_LINES, usPosY, VO_BLT_SRCTRANSPARENCY, null);
  // bottom left
  BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 5, 0, usHeight - TEXT_POPUP_GAP_BN_LINES, VO_BLT_SRCTRANSPARENCY, null);
  // bottom right
  BltVideoObject(pPopUpTextBox.value.uiSourceBufferIndex, hImageHandle, 7, usWidth - TEXT_POPUP_GAP_BN_LINES, usHeight - TEXT_POPUP_GAP_BN_LINES, VO_BLT_SRCTRANSPARENCY, null);

  // Icon if ness....
  if (pPopUpTextBox.value.uiFlags & MERC_POPUP_PREPARE_FLAGS_STOPICON) {
    BltVideoObjectFromIndex(pPopUpTextBox.value.uiSourceBufferIndex, guiBoxIcons, 0, 5, 4, VO_BLT_SRCTRANSPARENCY, null);
  }
  if (pPopUpTextBox.value.uiFlags & MERC_POPUP_PREPARE_FLAGS_SKULLICON) {
    BltVideoObjectFromIndex(pPopUpTextBox.value.uiSourceBufferIndex, guiSkullIcons, 0, 9, 4, VO_BLT_SRCTRANSPARENCY, null);
  }

  // Get the font and shadow colors
  GetMercPopupBoxFontColor(ubBackgroundIndex, addressof(ubFontColor), addressof(ubFontShadowColor));

  SetFontShadow(ubFontShadowColor);
  SetFontDestBuffer(pPopUpTextBox.value.uiSourceBufferIndex, 0, 0, usWidth, usHeight, false);

  // Display the text
  sDispTextXPos = ((MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_X + usMarginX));

  if (pPopUpTextBox.value.uiFlags & (MERC_POPUP_PREPARE_FLAGS_STOPICON | MERC_POPUP_PREPARE_FLAGS_SKULLICON)) {
    sDispTextXPos += 30;
  }

  {
    // Display the text
    DisplayWrappedString(sDispTextXPos, ((MERC_TEXT_POPUP_WINDOW_TEXT_OFFSET_Y + usMarginTopY)), usTextWidth, 2, MERC_TEXT_FONT(), ubFontColor, pString, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
  SetFontShadow(DEFAULT_SHADOW);

  if (iBoxId == -1) {
    // now return attemp to add to pop up box list, if successful will return index
    return AddPopUpBoxToList(pPopUpTextBox);
  } else {
    // set as current box
    SetCurrentPopUpBox(iBoxId);

    return iBoxId;
  }
}

// Deletes the surface thats contains the border, background and the text.
function RemoveMercPopupBox(): boolean {
  let iCounter: INT32 = 0;

  // make sure the current box does in fact exist
  if (gPopUpTextBox == null) {
    // failed..
    return false;
  }

  // now check to see if inited...
  if (gPopUpTextBox.value.fMercTextPopupSurfaceInitialized) {
    // now find this box in the list
    for (iCounter = 0; iCounter < MAX_NUMBER_OF_POPUP_BOXES; iCounter++) {
      if (gpPopUpBoxList[iCounter] == gPopUpTextBox) {
        gpPopUpBoxList[iCounter] = null;
        iCounter = MAX_NUMBER_OF_POPUP_BOXES;
      }
    }
    // yep, get rid of the bloody...
    DeleteVideoSurfaceFromIndex(gPopUpTextBox.value.uiSourceBufferIndex);

    // DEF Added 5/26
    // Delete the background and the border
    RemoveTextMercPopupImages();

    MemFree(gPopUpTextBox);

    // reset current ptr
    gPopUpTextBox = null;
  }

  return true;
}

function RemoveMercPopupBoxFromIndex(uiId: UINT32): boolean {
  // find this box, set it to current, and delete it
  if (SetCurrentPopUpBox(uiId) == false) {
    // failed
    return false;
  }

  // now try to remove it
  return RemoveMercPopupBox();
}

// Pass in the background index, and pointers to the font and shadow color
function GetMercPopupBoxFontColor(ubBackgroundIndex: UINT8, pubFontColor: Pointer<UINT8>, pubFontShadowColor: Pointer<UINT8>): void {
  switch (ubBackgroundIndex) {
    case Enum324.BASIC_MERC_POPUP_BACKGROUND:
      pubFontColor.value = TEXT_POPUP_COLOR;
      pubFontShadowColor.value = DEFAULT_SHADOW;
      break;

    case Enum324.WHITE_MERC_POPUP_BACKGROUND:
      pubFontColor.value = 2;
      pubFontShadowColor.value = FONT_MCOLOR_WHITE;
      break;

    case Enum324.GREY_MERC_POPUP_BACKGROUND:
      pubFontColor.value = 2;
      pubFontShadowColor.value = NO_SHADOW;
      break;

    case Enum324.LAPTOP_POPUP_BACKGROUND:
      pubFontColor.value = TEXT_POPUP_COLOR;
      pubFontShadowColor.value = DEFAULT_SHADOW;
      break;

    default:
      pubFontColor.value = TEXT_POPUP_COLOR;
      pubFontShadowColor.value = DEFAULT_SHADOW;
      break;
  }
}

function SetPrepareMercPopupFlags(uiFlags: UINT32): boolean {
  guiFlags |= uiFlags;
  return true;
}

function SetPrepareMercPopUpFlagsFromIndex(uiFlags: UINT32, uiId: UINT32): boolean {
  // find this box, set it to current, and delete it
  if (SetCurrentPopUpBox(uiId) == false) {
    // failed
    return false;
  }

  // now try to remove it
  return SetPrepareMercPopupFlags(uiFlags);
}
