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

/* static */ let PopUpBoxList: PopUpBo[] /* POPUPSTRINGPTR[MAX_POPUP_BOX_COUNT] */ = createArray(MAX_POPUP_BOX_COUNT, <PopUpBo><unknown>null);
/* static */ let guiCurrentBox: UINT32;

export function SetLineSpace(hBoxHandle: INT32, uiLineSpace: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].uiLineSpace = uiLineSpace;
  return;
}

export function GetLineSpace(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  // return number of pixels between lines for this box
  return PopUpBoxList[hBoxHandle].uiLineSpace;
}

export function SpecifyBoxMinWidth(hBoxHandle: INT32, iMinWidth: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].uiBoxMinWidth = iMinWidth;

  // check if the box is currently too small
  if (PopUpBoxList[hBoxHandle].Dimensions.iRight < iMinWidth) {
    PopUpBoxList[hBoxHandle].Dimensions.iRight = iMinWidth;
  }

  return;
}

export function CreatePopUpBox(Dimensions: SGPRect, Position: SGPPoint, uiFlags: UINT32): INT32 {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pBox: PopUpBo;

  // find first free box
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_COUNT) && (PopUpBoxList[iCounter] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_COUNT) {
    // ran out of available popup boxes - probably not freeing them up right!
    Assert(0);
    return -1;
  }

  iCount = iCounter;

  pBox = createPopUpBo();
  PopUpBoxList[iCount] = pBox;

  SetBoxPosition(iCount, Position);
  SetBoxSize(iCount, Dimensions);
  SetBoxFlags(iCount, uiFlags);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    PopUpBoxList[iCount].Text[iCounter] = <POPUPSTRING><unknown>null;
    PopUpBoxList[iCount].pSecondColumnString[iCounter] = <POPUPSTRING><unknown>null;
  }

  SetCurrentBox(iCount);
  SpecifyBoxMinWidth(iCount, 0);
  SetBoxSecondColumnMinimumOffset(iCount, 0);
  SetBoxSecondColumnCurrentOffset(iCount, 0);

  PopUpBoxList[iCount].fUpdated = false;

  return iCount;
}

function SetBoxFlags(hBoxHandle: INT32, uiFlags: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].uiFlags = uiFlags;
  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function SetMargins(hBoxHandle: INT32, uiLeft: UINT32, uiTop: UINT32, uiBottom: UINT32, uiRight: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].uiLeftMargin = uiLeft;
  PopUpBoxList[hBoxHandle].uiRightMargin = uiRight;
  PopUpBoxList[hBoxHandle].uiTopMargin = uiTop;
  PopUpBoxList[hBoxHandle].uiBottomMargin = uiBottom;

  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function GetTopMarginSize(hBoxHandle: INT32): UINT32 {
  // return size of top margin, for mouse region offsets

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);

  return PopUpBoxList[hBoxHandle].uiTopMargin;
}

export function ShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].Text[iLineNumber].fShadeFlag = true;
  }

  return;
}

export function UnShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].Text[iLineNumber].fShadeFlag = false;
  }

  return;
}

export function SecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].Text[iLineNumber].fSecondaryShadeFlag = true;
  }

  return;
}

export function UnSecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].Text[iLineNumber].fSecondaryShadeFlag = false;
  }

  return;
}

export function SetBoxBuffer(hBoxHandle: INT32, uiBuffer: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].uiBuffer = uiBuffer;

  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function SetBoxPosition(hBoxHandle: INT32, Position: SGPPoint): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].Position.iX = Position.iX;
  PopUpBoxList[hBoxHandle].Position.iY = Position.iY;

  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function GetBoxPosition(hBoxHandle: INT32, Position: SGPPoint): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Position.iX = PopUpBoxList[hBoxHandle].Position.iX;
  Position.iY = PopUpBoxList[hBoxHandle].Position.iY;

  return;
}

export function SetBoxSize(hBoxHandle: INT32, Dimensions: SGPRect): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].Dimensions.iLeft = Dimensions.iLeft;
  PopUpBoxList[hBoxHandle].Dimensions.iBottom = Dimensions.iBottom;
  PopUpBoxList[hBoxHandle].Dimensions.iRight = Dimensions.iRight;
  PopUpBoxList[hBoxHandle].Dimensions.iTop = Dimensions.iTop;

  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function GetBoxSize(hBoxHandle: INT32, Dimensions: SGPRect): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Dimensions.iLeft = PopUpBoxList[hBoxHandle].Dimensions.iLeft;
  Dimensions.iBottom = PopUpBoxList[hBoxHandle].Dimensions.iBottom;
  Dimensions.iRight = PopUpBoxList[hBoxHandle].Dimensions.iRight;
  Dimensions.iTop = PopUpBoxList[hBoxHandle].Dimensions.iTop;

  return;
}

export function SetBorderType(hBoxHandle: INT32, iBorderObjectIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].iBorderObjectIndex = iBorderObjectIndex;
  return;
}

export function SetBackGroundSurface(hBoxHandle: INT32, iBackGroundSurfaceIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].iBackGroundSurface = iBackGroundSurfaceIndex;
  return;
}

// adds a FIRST column string to the CURRENT popup box
export function AddMonoString(pString: string /* STR16 */): INT32 {
  let pLocalString: string /* STR16 */;
  let pStringSt: POPUPSTRING;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return -1;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  // find first free slot in list
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].Text[iCounter] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return -1;
  }

  pStringSt = createPopUpString();

  pLocalString = pString;

  RemoveCurrentBoxPrimaryText(iCounter);

  PopUpBoxList[guiCurrentBox].Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].Text[iCounter].fColorFlag = false;
  PopUpBoxList[guiCurrentBox].Text[iCounter].pString = pLocalString;
  PopUpBoxList[guiCurrentBox].Text[iCounter].fShadeFlag = false;
  PopUpBoxList[guiCurrentBox].Text[iCounter].fHighLightFlag = false;
  PopUpBoxList[guiCurrentBox].Text[iCounter].fSecondaryShadeFlag = false;

  PopUpBoxList[guiCurrentBox].fUpdated = false;

  return iCounter;
}

// adds a SECOND column string to the CURRENT popup box
export function AddSecondColumnMonoString(pString: string /* STR16 */): INT32 {
  let pLocalString: string /* STR16 */;
  let pStringSt: POPUPSTRING;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return -1;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  // find the LAST USED text string index
  for (iCounter = 0; (iCounter + 1 < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].Text[iCounter + 1] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return -1;
  }

  pStringSt = createPopUpString();

  pLocalString = pString;

  RemoveCurrentBoxSecondaryText(iCounter);

  PopUpBoxList[guiCurrentBox].pSecondColumnString[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].pSecondColumnString[iCounter].fColorFlag = false;
  PopUpBoxList[guiCurrentBox].pSecondColumnString[iCounter].pString = pLocalString;
  PopUpBoxList[guiCurrentBox].pSecondColumnString[iCounter].fShadeFlag = false;
  PopUpBoxList[guiCurrentBox].pSecondColumnString[iCounter].fHighLightFlag = false;

  return iCounter;
}

// Adds a COLORED first column string to the CURRENT box
function AddColorString(pString: string /* STR16 */): INT32 {
  let pLocalString: string /* STR16 */;
  let pStringSt: POPUPSTRING;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return -1;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  // find first free slot in list
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].Text[iCounter] != null); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return -1;
  }

  pStringSt = createPopUpString();

  pLocalString = pString;

  RemoveCurrentBoxPrimaryText(iCounter);

  PopUpBoxList[guiCurrentBox].Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].Text[iCounter].fColorFlag = true;
  PopUpBoxList[guiCurrentBox].Text[iCounter].pString = pLocalString;

  PopUpBoxList[guiCurrentBox].fUpdated = false;

  return iCounter;
}

function ResizeBoxForSecondStrings(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;
  let pBox: PopUpBo;
  let uiBaseWidth: UINT32;
  let uiThisWidth: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  pBox = (PopUpBoxList[hBoxHandle]);
  Assert(pBox);

  uiBaseWidth = pBox.uiLeftMargin + pBox.uiSecondColumnMinimunOffset;

  // check string sizes
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (pBox.Text[iCounter]) {
      uiThisWidth = uiBaseWidth + StringPixLength(pBox.Text[iCounter].pString, pBox.Text[iCounter].uiFont);

      if (uiThisWidth > pBox.uiSecondColumnCurrentOffset) {
        pBox.uiSecondColumnCurrentOffset = uiThisWidth;
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
    if (PopUpBoxList[hBoxHandle].Text[iCounter] == null) {
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
    if (PopUpBoxList[hBoxHandle].Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].Text[uiCounter].uiFont = uiFont;
    }
  }

  // set up the 2nd column font
  SetBoxSecondColumnFont(hBoxHandle, uiFont);

  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function SetBoxSecondColumnMinimumOffset(hBoxHandle: INT32, uiWidth: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  PopUpBoxList[hBoxHandle].uiSecondColumnMinimunOffset = uiWidth;
  return;
}

function SetBoxSecondColumnCurrentOffset(hBoxHandle: INT32, uiCurrentOffset: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  PopUpBoxList[hBoxHandle].uiSecondColumnCurrentOffset = uiCurrentOffset;
  return;
}

export function SetBoxSecondColumnFont(hBoxHandle: INT32, uiFont: UINT32): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter].uiFont = uiFont;
    }
  }

  PopUpBoxList[hBoxHandle].fUpdated = false;

  return;
}

export function GetBoxFont(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  Assert(PopUpBoxList[hBoxHandle].Text[0]);

  // return font id of first line of text of box
  return PopUpBoxList[hBoxHandle].Text[0].uiFont;
}

// set the foreground color of this string in this pop up box
export function SetBoxLineForeground(iBox: INT32, iStringValue: INT32, ubColor: UINT8): void {
  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);
  Assert(PopUpBoxList[iBox].Text[iStringValue]);

  PopUpBoxList[iBox].Text[iStringValue].ubForegroundColor = ubColor;
  return;
}

export function SetBoxSecondaryShade(iBox: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[iBox].Text[uiCounter] != null) {
      PopUpBoxList[iBox].Text[uiCounter].ubSecondaryShade = ubColor;
    }
  }
  return;
}

// The following functions operate on the CURRENT box

function SetPopUpStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].Text[hStringHandle].uiFont = uiFont;
  return;
}

function SetPopUpSecondColumnStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle].uiFont = uiFont;
  return;
}

function SetStringSecondaryShade(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].Text[hStringHandle].ubSecondaryShade = ubColor;
  return;
}

function SetStringForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].Text[hStringHandle].ubForegroundColor = ubColor;
  return;
}

function SetStringBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].Text[hStringHandle].ubBackgroundColor = ubColor;
  return;
}

function SetStringHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].Text[hStringHandle].ubHighLight = ubColor;
  return;
}

function SetStringShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].Text[hStringHandle].ubShade = ubShade;
  return;
}

function SetStringSecondColumnForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle].ubForegroundColor = ubColor;
  return;
}

function SetStringSecondColumnBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle].ubBackgroundColor = ubColor;
  return;
}

function SetStringSecondColumnHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle].ubHighLight = ubColor;
  return;
}

function SetStringSecondColumnShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle].ubShade = ubShade;
  return;
}

export function SetBoxForeground(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != null);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].Text[uiCounter].ubForegroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle].Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].Text[uiCounter].ubBackgroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle].Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].Text[uiCounter].ubHighLight = ubColor;
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
    if (PopUpBoxList[hBoxHandle].Text[uiCounter] != null) {
      PopUpBoxList[hBoxHandle].Text[uiCounter].ubShade = ubColor;
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
    if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter].ubForegroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter].ubBackgroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter].ubHighLight = ubColor;
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
    if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter].ubShade = ubColor;
    }
  }
  return;
}

function HighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox].Text[hStringHandle].fHighLightFlag = true;
  return;
}

function GetShadeFlag(hStringHandle: INT32): boolean {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].Text[hStringHandle])
    return false;

  return PopUpBoxList[guiCurrentBox].Text[hStringHandle].fShadeFlag;
}

function GetSecondaryShadeFlag(hStringHandle: INT32): boolean {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].Text[hStringHandle])
    return false;

  return PopUpBoxList[guiCurrentBox].Text[hStringHandle].fSecondaryShadeFlag;
}

export function HighLightBoxLine(hBoxHandle: INT32, iLineNumber: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  // highlight iLineNumber Line in box indexed by hBoxHandle

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
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

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
    return PopUpBoxList[hBoxHandle].Text[iLineNumber].fShadeFlag;
  }

  return false;
}

function GetBoxSecondaryShadeFlag(hBoxHandle: INT32, iLineNumber: INT32): boolean {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return false;

  if (PopUpBoxList[hBoxHandle].Text[iLineNumber] != null) {
    return PopUpBoxList[hBoxHandle].Text[iLineNumber].fSecondaryShadeFlag;
  }

  return false;
}

export function UnHighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox].Text[hStringHandle].fHighLightFlag = false;
  return;
}

export function UnHighLightBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].Text[iCounter])
      PopUpBoxList[hBoxHandle].Text[iCounter].fHighLightFlag = false;
  }
}

function UnHighLightSecondColumnLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);

  if (!PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle])
    return;

  PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle].fHighLightFlag = false;
  return;
}

function UnHighLightSecondColumnBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter])
      PopUpBoxList[hBoxHandle].pSecondColumnString[iCounter].fHighLightFlag = false;
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
      PopUpBoxList[guiCurrentBox].Text[uiCounter] = PopUpBoxList[guiCurrentBox].Text[uiCounter + 1];
      PopUpBoxList[guiCurrentBox].pSecondColumnString[uiCounter] = PopUpBoxList[guiCurrentBox].pSecondColumnString[uiCounter + 1];
    }
  }

  PopUpBoxList[guiCurrentBox].fUpdated = false;
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

  hOldBoxHandle = GetCurrentBox();
  SetCurrentBox(hBoxHandle);

  RemoveAllCurrentBoxStrings();

  PopUpBoxList[hBoxHandle] = <PopUpBo><unknown>null;

  if (hOldBoxHandle != hBoxHandle)
    SetCurrentBox(hOldBoxHandle);

  return;
}

export function ShowBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != null) {
    if (PopUpBoxList[hBoxHandle].fShowBox == false) {
      PopUpBoxList[hBoxHandle].fShowBox = true;
      PopUpBoxList[hBoxHandle].fUpdated = false;
    }
  }
}

export function HideBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != null) {
    if (PopUpBoxList[hBoxHandle].fShowBox == true) {
      PopUpBoxList[hBoxHandle].fShowBox = false;
      PopUpBoxList[hBoxHandle].fUpdated = false;
    }
  }
}

export function SetCurrentBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  guiCurrentBox = hBoxHandle;
}

function GetCurrentBox(): INT32 {
  return guiCurrentBox;
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
    if ((PopUpBoxList[uiIndex].uiBuffer == uiBuffer) && (PopUpBoxList[uiIndex].fShowBox)) {
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
    PopUpBoxList[uiIndex].fUpdated = false;
  }
}

function DrawBox(uiCounter: UINT32): boolean {
  // will build pop up box in usTopX, usTopY with dimensions usWidth and usHeight
  let uiNumTilesWide: UINT32;
  let uiNumTilesHigh: UINT32;
  let uiCount: UINT32 = 0;
  let hBoxHandle: SGPVObject;
  let hSrcVSurface: SGPVSurface;
  let uiDestPitchBYTES: UINT32 = 0;
  let uiSrcPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;
  let pSrcBuf: Uint8ClampedArray;
  let clip: SGPRect = createSGPRect();
  let usTopX: UINT16;
  let usTopY: UINT16;
  let usWidth: UINT16;
  let usHeight: UINT16;

  if ((uiCounter < 0) || (uiCounter >= MAX_POPUP_BOX_COUNT))
    return false;

  Assert(PopUpBoxList[uiCounter] != null);

  // only update if we need to

  if (PopUpBoxList[uiCounter].fUpdated == true) {
    return false;
  }

  PopUpBoxList[uiCounter].fUpdated = true;

  if (PopUpBoxList[uiCounter].uiFlags & POPUP_BOX_FLAG_RESIZE) {
    ResizeBoxToText(uiCounter);
  }

  usTopX = PopUpBoxList[uiCounter].Position.iX;
  usTopY = PopUpBoxList[uiCounter].Position.iY;
  usWidth = ((PopUpBoxList[uiCounter].Dimensions.iRight - PopUpBoxList[uiCounter].Dimensions.iLeft));
  usHeight = ((PopUpBoxList[uiCounter].Dimensions.iBottom - PopUpBoxList[uiCounter].Dimensions.iTop));

  // check if we have a min width, if so then update box for such
  if ((PopUpBoxList[uiCounter].uiBoxMinWidth) && (usWidth < PopUpBoxList[uiCounter].uiBoxMinWidth)) {
    usWidth = (PopUpBoxList[uiCounter].uiBoxMinWidth);
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
  pDestBuf = LockVideoSurface(PopUpBoxList[uiCounter].uiBuffer, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
  if ((hSrcVSurface = GetVideoSurface(PopUpBoxList[uiCounter].iBackGroundSurface)) === null) {
    return false;
  }
  pSrcBuf = LockVideoSurface(PopUpBoxList[uiCounter].iBackGroundSurface, createPointer(() => uiSrcPitchBYTES, (v) => uiSrcPitchBYTES = v));
  Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, usTopX, usTopY, clip);
  UnLockVideoSurface(PopUpBoxList[uiCounter].iBackGroundSurface);
  UnLockVideoSurface(PopUpBoxList[uiCounter].uiBuffer);
  hBoxHandle = GetVideoObject(PopUpBoxList[uiCounter].iBorderObjectIndex);

  // blit in 4 corners (they're 2x2 pixels)
  BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, TOP_LEFT_CORNER, usTopX, usTopY, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, TOP_RIGHT_CORNER, usTopX + usWidth - 2, usTopY, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, BOTTOM_RIGHT_CORNER, usTopX + usWidth - 2, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, BOTTOM_LEFT_CORNER, usTopX, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);

  // blit in edges
  if (uiNumTilesWide > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesWide; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, TOP_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY, VO_BLT_SRCTRANSPARENCY, null);
      BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, TOP_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, null);
  }
  if (uiNumTilesHigh > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesHigh; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
      BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, null);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    BltVideoObject(PopUpBoxList[uiCounter].uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
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
  if (PopUpBoxList[uiCounter].uiFlags & POPUP_BOX_FLAG_CLIP_TEXT) {
    SetFontDestBuffer(PopUpBoxList[uiCounter].uiBuffer, PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].uiLeftMargin - 1, PopUpBoxList[uiCounter].Position.iY + PopUpBoxList[uiCounter].uiTopMargin, PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].Dimensions.iRight - PopUpBoxList[uiCounter].uiRightMargin, PopUpBoxList[uiCounter].Position.iY + PopUpBoxList[uiCounter].Dimensions.iBottom - PopUpBoxList[uiCounter].uiBottomMargin, false);
  }

  for (uiCount = 0; uiCount < MAX_POPUP_BOX_STRING_COUNT; uiCount++) {
    // there is text in this line?
    if (PopUpBoxList[uiCounter].Text[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter].Text[uiCount].uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter].Text[uiCount].fHighLightFlag == false) && (PopUpBoxList[uiCounter].Text[uiCount].fShadeFlag == false) && (PopUpBoxList[uiCounter].Text[uiCount].fSecondaryShadeFlag == false)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter].Text[uiCount].ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter].Text[uiCount].fHighLightFlag == true)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter].Text[uiCount].ubHighLight);
      } else if ((PopUpBoxList[uiCounter].Text[uiCount].fSecondaryShadeFlag == true)) {
        SetFontForeground(PopUpBoxList[uiCounter].Text[uiCount].ubSecondaryShade);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter].Text[uiCount].ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter].Text[uiCount].ubBackgroundColor);

      // copy string
      sString = PopUpBoxList[uiCounter].Text[uiCount].pString;

      // cnetering?
      if (PopUpBoxList[uiCounter].uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        ({ sX: uX, sY: uY } = FindFontCenterCoordinates(((PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].uiLeftMargin)), ((PopUpBoxList[uiCounter].Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].Text[uiCount].uiFont) + PopUpBoxList[uiCounter].uiTopMargin + uiCount * PopUpBoxList[uiCounter].uiLineSpace)), ((PopUpBoxList[uiCounter].Dimensions.iRight - (PopUpBoxList[uiCounter].uiRightMargin + PopUpBoxList[uiCounter].uiLeftMargin + 2))), (GetFontHeight(PopUpBoxList[uiCounter].Text[uiCount].uiFont)), (sString), (PopUpBoxList[uiCounter].Text[uiCount].uiFont)));
      } else {
        uX = ((PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].uiLeftMargin));
        uY = ((PopUpBoxList[uiCounter].Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].Text[uiCount].uiFont) + PopUpBoxList[uiCounter].uiTopMargin + uiCount * PopUpBoxList[uiCounter].uiLineSpace));
      }

      // print
      // gprintfdirty(uX,uY,PopUpBoxList[uiCounter]->Text[uiCount]->pString );
      mprintf(uX, uY, PopUpBoxList[uiCounter].Text[uiCount].pString);
    }

    // there is secondary text in this line?
    if (PopUpBoxList[uiCounter].pSecondColumnString[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter].pSecondColumnString[uiCount].fHighLightFlag == false) && (PopUpBoxList[uiCounter].pSecondColumnString[uiCount].fShadeFlag == false)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter].pSecondColumnString[uiCount].fHighLightFlag == true)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].ubHighLight);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].ubBackgroundColor);

      // copy string
      sString = PopUpBoxList[uiCounter].pSecondColumnString[uiCount].pString;

      // cnetering?
      if (PopUpBoxList[uiCounter].uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        ({ sX: uX, sY: uY } = FindFontCenterCoordinates(((PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].uiLeftMargin)), ((PopUpBoxList[uiCounter].Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].uiFont) + PopUpBoxList[uiCounter].uiTopMargin + uiCount * PopUpBoxList[uiCounter].uiLineSpace)), ((PopUpBoxList[uiCounter].Dimensions.iRight - (PopUpBoxList[uiCounter].uiRightMargin + PopUpBoxList[uiCounter].uiLeftMargin + 2))), (GetFontHeight(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].uiFont)), (sString), (PopUpBoxList[uiCounter].pSecondColumnString[uiCount].uiFont)));
      } else {
        uX = ((PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].uiLeftMargin + PopUpBoxList[uiCounter].uiSecondColumnCurrentOffset));
        uY = ((PopUpBoxList[uiCounter].Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].pSecondColumnString[uiCount].uiFont) + PopUpBoxList[uiCounter].uiTopMargin + uiCount * PopUpBoxList[uiCounter].uiLineSpace));
      }

      // print
      // gprintfdirty(uX,uY,PopUpBoxList[uiCounter]->Text[uiCount]->pString );
      mprintf(uX, uY, PopUpBoxList[uiCounter].pSecondColumnString[uiCount].pString);
    }
  }

  if (PopUpBoxList[uiCounter].uiBuffer != guiSAVEBUFFER) {
    InvalidateRegion(PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].uiLeftMargin - 1, PopUpBoxList[uiCounter].Position.iY + PopUpBoxList[uiCounter].uiTopMargin, PopUpBoxList[uiCounter].Position.iX + PopUpBoxList[uiCounter].Dimensions.iRight - PopUpBoxList[uiCounter].uiRightMargin, PopUpBoxList[uiCounter].Position.iY + PopUpBoxList[uiCounter].Dimensions.iBottom - PopUpBoxList[uiCounter].uiBottomMargin);
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

  iHeight = PopUpBoxList[hBoxHandle].uiTopMargin + PopUpBoxList[hBoxHandle].uiBottomMargin;

  for (iCurrString = 0; iCurrString < MAX_POPUP_BOX_STRING_COUNT; iCurrString++) {
    if (PopUpBoxList[hBoxHandle].Text[iCurrString] != null) {
      if (PopUpBoxList[hBoxHandle].pSecondColumnString[iCurrString] != null) {
        iSecondColumnLength = StringPixLength(PopUpBoxList[hBoxHandle].pSecondColumnString[iCurrString].pString, PopUpBoxList[hBoxHandle].pSecondColumnString[iCurrString].uiFont);
        if (PopUpBoxList[hBoxHandle].uiSecondColumnCurrentOffset + iSecondColumnLength + PopUpBoxList[hBoxHandle].uiLeftMargin + PopUpBoxList[hBoxHandle].uiRightMargin > (iWidth)) {
          iWidth = PopUpBoxList[hBoxHandle].uiSecondColumnCurrentOffset + iSecondColumnLength + PopUpBoxList[hBoxHandle].uiLeftMargin + PopUpBoxList[hBoxHandle].uiRightMargin;
        }
      }

      if ((StringPixLength(PopUpBoxList[hBoxHandle].Text[iCurrString].pString, PopUpBoxList[hBoxHandle].Text[iCurrString].uiFont) + PopUpBoxList[hBoxHandle].uiLeftMargin + PopUpBoxList[hBoxHandle].uiRightMargin) > (iWidth))
        iWidth = StringPixLength(PopUpBoxList[hBoxHandle].Text[iCurrString].pString, PopUpBoxList[hBoxHandle].Text[iCurrString].uiFont) + PopUpBoxList[hBoxHandle].uiLeftMargin + PopUpBoxList[hBoxHandle].uiRightMargin;

      // vertical
      iHeight += GetFontHeight(PopUpBoxList[hBoxHandle].Text[iCurrString].uiFont) + PopUpBoxList[hBoxHandle].uiLineSpace;
    } else {
      // doesn't support gaps in text array...
      break;
    }
  }
  PopUpBoxList[hBoxHandle].Dimensions.iBottom = iHeight;
  PopUpBoxList[hBoxHandle].Dimensions.iRight = iWidth;
}

export function IsBoxShown(uiHandle: UINT32): boolean {
  if ((uiHandle < 0) || (uiHandle >= MAX_POPUP_BOX_COUNT))
    return false;

  if (PopUpBoxList[uiHandle] == null) {
    return false;
  }

  return PopUpBoxList[uiHandle].fShowBox;
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
  if (PopUpBoxList[guiCurrentBox].Text[hStringHandle] != null) {
    PopUpBoxList[guiCurrentBox].Text[hStringHandle] = <POPUPSTRING><unknown>null;
  }
}

function RemoveCurrentBoxSecondaryText(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != null);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  // remove & release secondary strings
  if (PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle] != null) {
    PopUpBoxList[guiCurrentBox].pSecondColumnString[hStringHandle] = <POPUPSTRING><unknown>null;
  }
}

}
