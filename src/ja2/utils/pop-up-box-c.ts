namespace ja2 {

const BORDER_WIDTH = 16;
const BORDER_HEIGHT = 8;
const TOP_LEFT_CORNER = 0;
const TOP_EDGE = 4;
const TOP_RIGHT_CORNER = 1;
const SIDE_EDGE = 5;
const BOTTOM_LEFT_CORNER = 2;
const BOTTOM_EDGE = 4;
const BOTTOM_RIGHT_CORNER = 3;

function InitPopUpBoxList(): void {
  memset(addressof(PopUpBoxList), 0, sizeof(PopUpBoxPt));
  return;
}

function InitPopUpBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  memset(PopUpBoxList[hBoxHandle], 0, sizeof(PopUpBo));
}

export function SetLineSpace(hBoxHandle: INT32, uiLineSpace: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].value.uiLineSpace = uiLineSpace;
  return;
}

export function GetLineSpace(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  // return number of pixels between lines for this box
  return PopUpBoxList[hBoxHandle].value.uiLineSpace;
}

export function SpecifyBoxMinWidth(hBoxHandle: INT32, iMinWidth: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiBoxMinWidth = iMinWidth;

  // check if the box is currently too small
  if (PopUpBoxList[hBoxHandle].value.Dimensions.iRight < iMinWidth) {
    PopUpBoxList[hBoxHandle].value.Dimensions.iRight = iMinWidth;
  }

  return;
}

export function CreatePopUpBox(phBoxHandle: Pointer<INT32>, Dimensions: SGPRect, Position: SGPPoint, uiFlags: UINT32): boolean {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pBox: PopUpBoxPt = null;

  // find first free box
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_COUNT) && (PopUpBoxList[iCounter] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_COUNT) {
    // ran out of available popup boxes - probably not freeing them up right!
    Assert(0);
    return false;
  }

  iCount = iCounter;
  phBoxHandle.value = iCount;

  pBox = MemAlloc(sizeof(PopUpBo));
  if (pBox == null) {
    return false;
  }
  PopUpBoxList[iCount] = pBox;

  InitPopUpBox(iCount);
  SetBoxPosition(iCount, Position);
  SetBoxSize(iCount, Dimensions);
  SetBoxFlags(iCount, uiFlags);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    PopUpBoxList[iCount].value.Text[iCounter] = null;
    PopUpBoxList[iCount].value.pSecondColumnString[iCounter] = null;
  }

  SetCurrentBox(iCount);
  SpecifyBoxMinWidth(iCount, 0);
  SetBoxSecondColumnMinimumOffset(iCount, 0);
  SetBoxSecondColumnCurrentOffset(iCount, 0);

  PopUpBoxList[iCount].value.fUpdated = false;

  return true;
}

function SetBoxFlags(hBoxHandle: INT32, uiFlags: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiFlags = uiFlags;
  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function SetMargins(hBoxHandle: INT32, uiLeft: UINT32, uiTop: UINT32, uiBottom: UINT32, uiRight: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiLeftMargin = uiLeft;
  PopUpBoxList[hBoxHandle].value.uiRightMargin = uiRight;
  PopUpBoxList[hBoxHandle].value.uiTopMargin = uiTop;
  PopUpBoxList[hBoxHandle].value.uiBottomMargin = uiBottom;

  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function GetTopMarginSize(hBoxHandle: INT32): UINT32 {
  // return size of top margin, for mouse region offsets

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);

  return PopUpBoxList[hBoxHandle].value.uiTopMargin;
}

export function ShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fShadeFlag = true;
  }

  return;
}

export function UnShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fShadeFlag = false;
  }

  return;
}

export function SecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fSecondaryShadeFlag = true;
  }

  return;
}

export function UnSecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fSecondaryShadeFlag = false;
  }

  return;
}

export function SetBoxBuffer(hBoxHandle: INT32, uiBuffer: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiBuffer = uiBuffer;

  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function SetBoxPosition(hBoxHandle: INT32, Position: SGPPoint): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.Position.iX = Position.iX;
  PopUpBoxList[hBoxHandle].value.Position.iY = Position.iY;

  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function GetBoxPosition(hBoxHandle: INT32, Position: Pointer<SGPPoint>): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Position.value.iX = PopUpBoxList[hBoxHandle].value.Position.iX;
  Position.value.iY = PopUpBoxList[hBoxHandle].value.Position.iY;

  return;
}

export function SetBoxSize(hBoxHandle: INT32, Dimensions: SGPRect): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.Dimensions.iLeft = Dimensions.iLeft;
  PopUpBoxList[hBoxHandle].value.Dimensions.iBottom = Dimensions.iBottom;
  PopUpBoxList[hBoxHandle].value.Dimensions.iRight = Dimensions.iRight;
  PopUpBoxList[hBoxHandle].value.Dimensions.iTop = Dimensions.iTop;

  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function GetBoxSize(hBoxHandle: INT32, Dimensions: Pointer<SGPRect>): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Dimensions.value.iLeft = PopUpBoxList[hBoxHandle].value.Dimensions.iLeft;
  Dimensions.value.iBottom = PopUpBoxList[hBoxHandle].value.Dimensions.iBottom;
  Dimensions.value.iRight = PopUpBoxList[hBoxHandle].value.Dimensions.iRight;
  Dimensions.value.iTop = PopUpBoxList[hBoxHandle].value.Dimensions.iTop;

  return;
}

export function SetBorderType(hBoxHandle: INT32, iBorderObjectIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].value.iBorderObjectIndex = iBorderObjectIndex;
  return;
}

export function SetBackGroundSurface(hBoxHandle: INT32, iBackGroundSurfaceIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].value.iBackGroundSurface = iBackGroundSurfaceIndex;
  return;
}

// adds a FIRST column string to the CURRENT popup box
export function AddMonoString(hStringHandle: Pointer<INT32>, pString: string /* STR16 */): void {
  let pLocalString: string /* STR16 */ = null;
  let pStringSt: POPUPSTRINGPTR = null;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  // find first free slot in list
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].value.Text[iCounter] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return;
  }

  pStringSt = (MemAlloc(sizeof(POPUPSTRING)));
  if (pStringSt == null)
    return;

  pLocalString = (MemAlloc(pString.length * 2 + 2));
  if (pLocalString == null)
    return;

  pLocalString = pString;

  RemoveCurrentBoxPrimaryText(iCounter);

  PopUpBoxList[guiCurrentBox].value.Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fColorFlag = false;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.pString = pLocalString;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fShadeFlag = false;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fHighLightFlag = false;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fSecondaryShadeFlag = false;

  hStringHandle.value = iCounter;

  PopUpBoxList[guiCurrentBox].value.fUpdated = false;

  return;
}

// adds a SECOND column string to the CURRENT popup box
export function AddSecondColumnMonoString(hStringHandle: Pointer<INT32>, pString: string /* STR16 */): void {
  let pLocalString: string /* STR16 */ = null;
  let pStringSt: POPUPSTRINGPTR = null;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  // find the LAST USED text string index
  for (iCounter = 0; (iCounter + 1 < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].value.Text[iCounter + 1] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return;
  }

  pStringSt = (MemAlloc(sizeof(POPUPSTRING)));
  if (pStringSt == null)
    return;

  pLocalString = (MemAlloc(pString.length * 2 + 2));
  if (pLocalString == null)
    return;

  pLocalString = pString;

  RemoveCurrentBoxSecondaryText(iCounter);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.fColorFlag = false;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.pString = pLocalString;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.fShadeFlag = false;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.fHighLightFlag = false;

  hStringHandle.value = iCounter;

  return;
}

// Adds a COLORED first column string to the CURRENT box
function AddColorString(hStringHandle: Pointer<INT32>, pString: string /* STR16 */): void {
  let pLocalString: string /* STR16 */;
  let pStringSt: POPUPSTRINGPTR = null;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  // find first free slot in list
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].value.Text[iCounter] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return;
  }

  pStringSt = (MemAlloc(sizeof(POPUPSTRING)));
  if (pStringSt == null)
    return;

  pLocalString = (MemAlloc(pString.length * 2 + 2));
  if (pLocalString == null)
    return;

  pLocalString = pString;

  RemoveCurrentBoxPrimaryText(iCounter);

  PopUpBoxList[guiCurrentBox].value.Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fColorFlag = true;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.pString = pLocalString;

  hStringHandle.value = iCounter;

  PopUpBoxList[guiCurrentBox].value.fUpdated = false;

  return;
}

function ResizeBoxForSecondStrings(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;
  let pBox: PopUpBoxPt;
  let uiBaseWidth: UINT32;
  let uiThisWidth: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  pBox = (PopUpBoxList[hBoxHandle]);
  Assert(pBox);

  uiBaseWidth = pBox.value.uiLeftMargin + pBox.value.uiSecondColumnMinimunOffset;

  // check string sizes
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (pBox.value.Text[iCounter]) {
      uiThisWidth = uiBaseWidth + StringPixLength(pBox.value.Text[iCounter].value.pString, pBox.value.Text[iCounter].value.uiFont);

      if (uiThisWidth > pBox.value.uiSecondColumnCurrentOffset) {
        pBox.value.uiSecondColumnCurrentOffset = uiThisWidth;
      }
    }
  }
}

export function GetNumberOfLinesOfTextInBox(hBoxHandle: INT32): UINT32 {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  // count number of lines
  // check string size
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[iCounter] == null) {
      break;
    }
  }

  return iCounter;
}

export function SetBoxFont(hBoxHandle: INT32, uiFont: UINT32): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.uiFont = uiFont;
    }
  }

  // set up the 2nd column font
  SetBoxSecondColumnFont(hBoxHandle, uiFont);

  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function SetBoxSecondColumnMinimumOffset(hBoxHandle: INT32, uiWidth: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  PopUpBoxList[hBoxHandle].value.uiSecondColumnMinimunOffset = uiWidth;
  return;
}

function SetBoxSecondColumnCurrentOffset(hBoxHandle: INT32, uiCurrentOffset: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  PopUpBoxList[hBoxHandle].value.uiSecondColumnCurrentOffset = uiCurrentOffset;
  return;
}

export function SetBoxSecondColumnFont(hBoxHandle: INT32, uiFont: UINT32): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.uiFont = uiFont;
    }
  }

  PopUpBoxList[hBoxHandle].value.fUpdated = false;

  return;
}

export function GetBoxFont(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  Assert(PopUpBoxList[hBoxHandle].value.Text[0]);

  // return font id of first line of text of box
  return PopUpBoxList[hBoxHandle].value.Text[0].value.uiFont;
}

// set the foreground color of this string in this pop up box
export function SetBoxLineForeground(iBox: INT32, iStringValue: INT32, ubColor: UINT8): void {
  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);
  Assert(PopUpBoxList[iBox].value.Text[iStringValue]);

  PopUpBoxList[iBox].value.Text[iStringValue].value.ubForegroundColor = ubColor;
  return;
}

export function SetBoxSecondaryShade(iBox: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[iBox].value.Text[uiCounter] != null) {
      PopUpBoxList[iBox].value.Text[uiCounter].value.ubSecondaryShade = ubColor;
    }
  }
  return;
}

// The following functions operate on the CURRENT box

function SetPopUpStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.uiFont = uiFont;
  return;
}

function SetPopUpSecondColumnStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.uiFont = uiFont;
  return;
}

function SetStringSecondaryShade(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubSecondaryShade = ubColor;
  return;
}

function SetStringForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubForegroundColor = ubColor;
  return;
}

function SetStringBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubBackgroundColor = ubColor;
  return;
}

function SetStringHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubHighLight = ubColor;
  return;
}

function SetStringShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubShade = ubShade;
  return;
}

function SetStringSecondColumnForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubForegroundColor = ubColor;
  return;
}

function SetStringSecondColumnBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubBackgroundColor = ubColor;
  return;
}

function SetStringSecondColumnHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubHighLight = ubColor;
  return;
}

function SetStringSecondColumnShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubShade = ubShade;
  return;
}

export function SetBoxForeground(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubForegroundColor = ubColor;
    }
  }
  return;
}

export function SetBoxBackground(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubBackgroundColor = ubColor;
    }
  }
  return;
}

export function SetBoxHighLight(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubHighLight = ubColor;
    }
  }
  return;
}

export function SetBoxShade(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubShade = ubColor;
    }
  }
  return;
}

export function SetBoxSecondColumnForeground(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubForegroundColor = ubColor;
    }
  }

  return;
}

export function SetBoxSecondColumnBackground(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubBackgroundColor = ubColor;
    }
  }

  return;
}

export function SetBoxSecondColumnHighLight(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubHighLight = ubColor;
    }
  }

  return;
}

export function SetBoxSecondColumnShade(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubShade = ubColor;
    }
  }
  return;
}

function HighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fHighLightFlag = true;
  return;
}

function GetShadeFlag(hStringHandle: INT32): boolean {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return false;

  return PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fShadeFlag;
}

function GetSecondaryShadeFlag(hStringHandle: INT32): boolean {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return false;

  return PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fSecondaryShadeFlag;
}

export function HighLightBoxLine(hBoxHandle: INT32, iLineNumber: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  // highlight iLineNumber Line in box indexed by hBoxHandle

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // highlight line
    HighLightLine(iLineNumber);
  }

  return;
}

export function GetBoxShadeFlag(hBoxHandle: INT32, iLineNumber: INT32): boolean {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return false;

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    return PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fShadeFlag;
  }

  return false;
}

function GetBoxSecondaryShadeFlag(hBoxHandle: INT32, iLineNumber: INT32): boolean {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return false;

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != null) {
    return PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fSecondaryShadeFlag;
  }

  return false;
}

export function UnHighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fHighLightFlag = false;
  return;
}

export function UnHighLightBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[iCounter])
      PopUpBoxList[hBoxHandle].value.Text[iCounter].value.fHighLightFlag = false;
  }
}

function UnHighLightSecondColumnLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle])
    return;

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.fHighLightFlag = false;
  return;
}

function UnHighLightSecondColumnBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter])
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.fHighLightFlag = false;
  }
}

function RemoveOneCurrentBoxString(hStringHandle: INT32, fFillGaps: boolean): void {
  let uiCounter: UINT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  RemoveCurrentBoxPrimaryText(hStringHandle);
  RemoveCurrentBoxSecondaryText(hStringHandle);

  if (fFillGaps) {
    // shuffle all strings down a slot to fill in the gap
    for (uiCounter = hStringHandle; uiCounter < (MAX_POPUP_BOX_STRING_COUNT - 1); uiCounter++) {
      PopUpBoxList[guiCurrentBox].value.Text[uiCounter] = PopUpBoxList[guiCurrentBox].value.Text[uiCounter + 1];
      PopUpBoxList[guiCurrentBox].value.pSecondColumnString[uiCounter] = PopUpBoxList[guiCurrentBox].value.pSecondColumnString[uiCounter + 1];
    }
  }

  PopUpBoxList[guiCurrentBox].value.fUpdated = false;
}

export function RemoveAllCurrentBoxStrings(): void {
  let uiCounter: UINT32;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++)
    RemoveOneCurrentBoxString(uiCounter, false);
}

export function RemoveBox(hBoxHandle: INT32): void {
  let hOldBoxHandle: INT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  GetCurrentBox(addressof(hOldBoxHandle));
  SetCurrentBox(hBoxHandle);

  RemoveAllCurrentBoxStrings();

  MemFree(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle] = null;

  if (hOldBoxHandle != hBoxHandle)
    SetCurrentBox(hOldBoxHandle);

  return;
}

export function ShowBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != null) {
    if (PopUpBoxList[hBoxHandle].value.fShowBox == false) {
      PopUpBoxList[hBoxHandle].value.fShowBox = true;
      PopUpBoxList[hBoxHandle].value.fUpdated = false;
    }
  }
}

export function HideBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != null) {
    if (PopUpBoxList[hBoxHandle].value.fShowBox == true) {
      PopUpBoxList[hBoxHandle].value.fShowBox = false;
      PopUpBoxList[hBoxHandle].value.fUpdated = false;
    }
  }
}

export function SetCurrentBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  guiCurrentBox = hBoxHandle;
}

function GetCurrentBox(hBoxHandle: Pointer<INT32>): void {
  hBoxHandle.value = guiCurrentBox;
}

export function DisplayBoxes(uiBuffer: UINT32): void {
  let uiCounter: UINT32;

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_COUNT; uiCounter++) {
    DisplayOnePopupBox(uiCounter, uiBuffer);
  }
  return;
}

export function DisplayOnePopupBox(uiIndex: UINT32, uiBuffer: UINT32): void {
  if ((uiIndex < 0) || (uiIndex >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[uiIndex] != null) {
    if ((PopUpBoxList[uiIndex].value.uiBuffer == uiBuffer) && (PopUpBoxList[uiIndex].value.fShowBox)) {
      DrawBox(uiIndex);
      DrawBoxText(uiIndex);
    }
  }
}

// force an update of this box
export function ForceUpDateOfBox(uiIndex: UINT32): void {
  if ((uiIndex < 0) || (uiIndex >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[uiIndex] != null) {
    PopUpBoxList[uiIndex].value.fUpdated = false;
  }
}

function DrawBox(uiCounter: UINT32): boolean {
  // will build pop up box in usTopX, usTopY with dimensions usWidth and usHeight
  let uiNumTilesWide: UINT32;
  let uiNumTilesHigh: UINT32;
  let uiCount: UINT32 = 0;
  let hBoxHandle: HVOBJECT;
  let hSrcVSurface: HVSURFACE;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let pSrcBuf: Pointer<UINT8>;
  let clip: SGPRect;
  let usTopX: UINT16;
  let usTopY: UINT16;
  let usWidth: UINT16;
  let usHeight: UINT16;

  if ((uiCounter < 0) || (uiCounter >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[uiCounter] != null);

  // only update if we need to

  if (PopUpBoxList[uiCounter].value.fUpdated == true) {
    return false;
  }

  PopUpBoxList[uiCounter].value.fUpdated = true;

  if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_RESIZE) {
    ResizeBoxToText(uiCounter);
  }

  usTopX = PopUpBoxList[uiCounter].value.Position.iX;
  usTopY = PopUpBoxList[uiCounter].value.Position.iY;
  usWidth = ((PopUpBoxList[uiCounter].value.Dimensions.iRight - PopUpBoxList[uiCounter].value.Dimensions.iLeft));
  usHeight = ((PopUpBoxList[uiCounter].value.Dimensions.iBottom - PopUpBoxList[uiCounter].value.Dimensions.iTop));

  // check if we have a min width, if so then update box for such
  if ((PopUpBoxList[uiCounter].value.uiBoxMinWidth) && (usWidth < PopUpBoxList[uiCounter].value.uiBoxMinWidth)) {
    usWidth = (PopUpBoxList[uiCounter].value.uiBoxMinWidth);
  }

  // make sure it will fit on screen!
  Assert(usTopX + usWidth <= 639);
  Assert(usTopY + usHeight <= 479);

  // subtract 4 because the 2 2-pixel corners are handled separately
  uiNumTilesWide = ((usWidth - 4) / BORDER_WIDTH);
  uiNumTilesHigh = ((usHeight - 4) / BORDER_HEIGHT);

  clip.iLeft = 0;
  clip.iRight = clip.iLeft + usWidth;
  clip.iTop = 0;
  clip.iBottom = clip.iTop + usHeight;

  // blit in texture first, then borders
  // blit in surface
  pDestBuf = LockVideoSurface(PopUpBoxList[uiCounter].value.uiBuffer, addressof(uiDestPitchBYTES));
  CHECKF(GetVideoSurface(addressof(hSrcVSurface), PopUpBoxList[uiCounter].value.iBackGroundSurface));
  pSrcBuf = LockVideoSurface(PopUpBoxList[uiCounter].value.iBackGroundSurface, addressof(uiSrcPitchBYTES));
  Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, usTopX, usTopY, addressof(clip));
  UnLockVideoSurface(PopUpBoxList[uiCounter].value.iBackGroundSurface);
  UnLockVideoSurface(PopUpBoxList[uiCounter].value.uiBuffer);
  GetVideoObject(addressof(hBoxHandle), PopUpBoxList[uiCounter].value.iBorderObjectIndex);

  // blit in 4 corners (they're 2x2 pixels)
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_LEFT_CORNER, usTopX, usTopY, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_RIGHT_CORNER, usTopX + usWidth - 2, usTopY, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_RIGHT_CORNER, usTopX + usWidth - 2, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_LEFT_CORNER, usTopX, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);

  // blit in edges
  if (uiNumTilesWide > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesWide; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY, VO_BLT_SRCTRANSPARENCY, null);
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);
  }
  if (uiNumTilesHigh > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesHigh; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
  }

  InvalidateRegion(usTopX, usTopY, usTopX + usWidth, usTopY + usHeight);
  return true;
}

function DrawBoxText(uiCounter: UINT32): boolean {
  let uiCount: UINT32 = 0;
  let uX: INT16;
  let uY: INT16;
  let sString: string /* wchar_t[100] */;

  if ((uiCounter < 0) || (uiCounter >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[uiCounter] != null);

  // clip text?
  if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_CLIP_TEXT) {
    SetFontDestBuffer(PopUpBoxList[uiCounter].value.uiBuffer, PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin - 1, PopUpBoxList[uiCounter].value.Position.iY + PopUpBoxList[uiCounter].value.uiTopMargin, PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.Dimensions.iRight - PopUpBoxList[uiCounter].value.uiRightMargin, PopUpBoxList[uiCounter].value.Position.iY + PopUpBoxList[uiCounter].value.Dimensions.iBottom - PopUpBoxList[uiCounter].value.uiBottomMargin, false);
  }

  for (uiCount = 0; uiCount < MAX_POPUP_BOX_STRING_COUNT; uiCount++) {
    // there is text in this line?
    if (PopUpBoxList[uiCounter].value.Text[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter].value.Text[uiCount].value.fHighLightFlag == false) && (PopUpBoxList[uiCounter].value.Text[uiCount].value.fShadeFlag == false) && (PopUpBoxList[uiCounter].value.Text[uiCount].value.fSecondaryShadeFlag == false)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter].value.Text[uiCount].value.fHighLightFlag == true)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubHighLight);
      } else if ((PopUpBoxList[uiCounter].value.Text[uiCount].value.fSecondaryShadeFlag == true)) {
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubSecondaryShade);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubBackgroundColor);

      // copy string
      wcsncpy(sString, PopUpBoxList[uiCounter].value.Text[uiCount].value.pString, PopUpBoxList[uiCounter].value.Text[uiCount].value.pString.length + 1);

      // cnetering?
      if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        FindFontCenterCoordinates(((PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin)), ((PopUpBoxList[uiCounter].value.Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont) + PopUpBoxList[uiCounter].value.uiTopMargin + uiCount * PopUpBoxList[uiCounter].value.uiLineSpace)), ((PopUpBoxList[uiCounter].value.Dimensions.iRight - (PopUpBoxList[uiCounter].value.uiRightMargin + PopUpBoxList[uiCounter].value.uiLeftMargin + 2))), (GetFontHeight(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont)), (sString), (PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont), addressof(uX), addressof(uY));
      } else {
        uX = ((PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin));
        uY = ((PopUpBoxList[uiCounter].value.Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont) + PopUpBoxList[uiCounter].value.uiTopMargin + uiCount * PopUpBoxList[uiCounter].value.uiLineSpace));
      }

      // print
      // gprintfdirty(uX,uY,PopUpBoxList[uiCounter]->Text[uiCount]->pString );
      mprintf(uX, uY, PopUpBoxList[uiCounter].value.Text[uiCount].value.pString);
    }

    // there is secondary text in this line?
    if (PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.fHighLightFlag == false) && (PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.fShadeFlag == false)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.fHighLightFlag == true)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubHighLight);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubBackgroundColor);

      // copy string
      wcsncpy(sString, PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.pString, PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.pString.length + 1);

      // cnetering?
      if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        FindFontCenterCoordinates(((PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin)), ((PopUpBoxList[uiCounter].value.Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont) + PopUpBoxList[uiCounter].value.uiTopMargin + uiCount * PopUpBoxList[uiCounter].value.uiLineSpace)), ((PopUpBoxList[uiCounter].value.Dimensions.iRight - (PopUpBoxList[uiCounter].value.uiRightMargin + PopUpBoxList[uiCounter].value.uiLeftMargin + 2))), (GetFontHeight(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont)), (sString), (PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont), addressof(uX), addressof(uY));
      } else {
        uX = ((PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin + PopUpBoxList[uiCounter].value.uiSecondColumnCurrentOffset));
        uY = ((PopUpBoxList[uiCounter].value.Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont) + PopUpBoxList[uiCounter].value.uiTopMargin + uiCount * PopUpBoxList[uiCounter].value.uiLineSpace));
      }

      // print
      // gprintfdirty(uX,uY,PopUpBoxList[uiCounter]->Text[uiCount]->pString );
      mprintf(uX, uY, PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.pString);
    }
  }

  if (PopUpBoxList[uiCounter].value.uiBuffer != guiSAVEBUFFER) {
    InvalidateRegion(PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin - 1, PopUpBoxList[uiCounter].value.Position.iY + PopUpBoxList[uiCounter].value.uiTopMargin, PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.Dimensions.iRight - PopUpBoxList[uiCounter].value.uiRightMargin, PopUpBoxList[uiCounter].value.Position.iY + PopUpBoxList[uiCounter].value.Dimensions.iBottom - PopUpBoxList[uiCounter].value.uiBottomMargin);
  }

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  return true;
}

export function ResizeBoxToText(hBoxHandle: INT32): void {
  // run through lines of text in box and size box width to longest line plus margins
  // height is sum of getfontheight of each line+ spacing
  let iWidth: INT32 = 0;
  let iHeight: INT32 = 0;
  let iCurrString: INT32 = 0;
  let iSecondColumnLength: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (!PopUpBoxList[hBoxHandle])
    return;

  ResizeBoxForSecondStrings(hBoxHandle);

  iHeight = PopUpBoxList[hBoxHandle].value.uiTopMargin + PopUpBoxList[hBoxHandle].value.uiBottomMargin;

  for (iCurrString = 0; iCurrString < MAX_POPUP_BOX_STRING_COUNT; iCurrString++) {
    if (PopUpBoxList[hBoxHandle].value.Text[iCurrString] != null) {
      if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCurrString] != null) {
        iSecondColumnLength = StringPixLength(PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCurrString].value.pString, PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCurrString].value.uiFont);
        if (PopUpBoxList[hBoxHandle].value.uiSecondColumnCurrentOffset + iSecondColumnLength + PopUpBoxList[hBoxHandle].value.uiLeftMargin + PopUpBoxList[hBoxHandle].value.uiRightMargin > (iWidth)) {
          iWidth = PopUpBoxList[hBoxHandle].value.uiSecondColumnCurrentOffset + iSecondColumnLength + PopUpBoxList[hBoxHandle].value.uiLeftMargin + PopUpBoxList[hBoxHandle].value.uiRightMargin;
        }
      }

      if ((StringPixLength(PopUpBoxList[hBoxHandle].value.Text[iCurrString].value.pString, PopUpBoxList[hBoxHandle].value.Text[iCurrString].value.uiFont) + PopUpBoxList[hBoxHandle].value.uiLeftMargin + PopUpBoxList[hBoxHandle].value.uiRightMargin) > (iWidth))
        iWidth = StringPixLength(PopUpBoxList[hBoxHandle].value.Text[iCurrString].value.pString, PopUpBoxList[hBoxHandle].value.Text[iCurrString].value.uiFont) + PopUpBoxList[hBoxHandle].value.uiLeftMargin + PopUpBoxList[hBoxHandle].value.uiRightMargin;

      // vertical
      iHeight += GetFontHeight(PopUpBoxList[hBoxHandle].value.Text[iCurrString].value.uiFont) + PopUpBoxList[hBoxHandle].value.uiLineSpace;
    } else {
      // doesn't support gaps in text array...
      break;
    }
  }
  PopUpBoxList[hBoxHandle].value.Dimensions.iBottom = iHeight;
  PopUpBoxList[hBoxHandle].value.Dimensions.iRight = iWidth;
}

export function IsBoxShown(uiHandle: UINT32): boolean {
  if ((uiHandle < 0) || (uiHandle >= MAX_POPUP_BOX_COUNT))
    return false;

  if (PopUpBoxList[uiHandle] == null) {
    return false;
  }

  return PopUpBoxList[uiHandle].value.fShowBox;
}

export function MarkAllBoxesAsAltered(): void {
  let iCounter: INT32 = 0;

  // mark all boxes as altered
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_COUNT; iCounter++) {
    ForceUpDateOfBox(iCounter);
  }

  return;
}

export function HideAllBoxes(): void {
  let iCounter: INT32 = 0;

  // hide all the boxes that are shown
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_COUNT; iCounter++) {
    HideBox(iCounter);
  }
}

function RemoveCurrentBoxPrimaryText(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  // remove & release primary text
  if (PopUpBoxList[guiCurrentBox].value.Text[hStringHandle] != null) {
    if (PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.pString) {
      MemFree(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.pString);
    }

    MemFree(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);
    PopUpBoxList[guiCurrentBox].value.Text[hStringHandle] = null;
  }
}

function RemoveCurrentBoxSecondaryText(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  // remove & release secondary strings
  if (PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle] != null) {
    if (PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.pString) {
      MemFree(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.pString);
    }

    MemFree(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);
    PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle] = null;
  }
}

}
