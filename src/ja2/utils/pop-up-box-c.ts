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
  memset(&PopUpBoxList, 0, sizeof(PopUpBoxPt));
  return;
}

function InitPopUpBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  memset(PopUpBoxList[hBoxHandle], 0, sizeof(PopUpBo));
}

function SetLineSpace(hBoxHandle: INT32, uiLineSpace: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].value.uiLineSpace = uiLineSpace;
  return;
}

function GetLineSpace(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  // return number of pixels between lines for this box
  return PopUpBoxList[hBoxHandle].value.uiLineSpace;
}

function SpecifyBoxMinWidth(hBoxHandle: INT32, iMinWidth: INT32): void {
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

function CreatePopUpBox(phBoxHandle: Pointer<INT32>, Dimensions: SGPRect, Position: SGPPoint, uiFlags: UINT32): BOOLEAN {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pBox: PopUpBoxPt = NULL;

  // find first free box
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_COUNT) && (PopUpBoxList[iCounter] != NULL); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_COUNT) {
    // ran out of available popup boxes - probably not freeing them up right!
    Assert(0);
    return FALSE;
  }

  iCount = iCounter;
  *phBoxHandle = iCount;

  pBox = MemAlloc(sizeof(PopUpBo));
  if (pBox == NULL) {
    return FALSE;
  }
  PopUpBoxList[iCount] = pBox;

  InitPopUpBox(iCount);
  SetBoxPosition(iCount, Position);
  SetBoxSize(iCount, Dimensions);
  SetBoxFlags(iCount, uiFlags);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    PopUpBoxList[iCount].value.Text[iCounter] = NULL;
    PopUpBoxList[iCount].value.pSecondColumnString[iCounter] = NULL;
  }

  SetCurrentBox(iCount);
  SpecifyBoxMinWidth(iCount, 0);
  SetBoxSecondColumnMinimumOffset(iCount, 0);
  SetBoxSecondColumnCurrentOffset(iCount, 0);

  PopUpBoxList[iCount].value.fUpdated = FALSE;

  return TRUE;
}

function SetBoxFlags(hBoxHandle: INT32, uiFlags: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiFlags = uiFlags;
  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function SetMargins(hBoxHandle: INT32, uiLeft: UINT32, uiTop: UINT32, uiBottom: UINT32, uiRight: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiLeftMargin = uiLeft;
  PopUpBoxList[hBoxHandle].value.uiRightMargin = uiRight;
  PopUpBoxList[hBoxHandle].value.uiTopMargin = uiTop;
  PopUpBoxList[hBoxHandle].value.uiBottomMargin = uiBottom;

  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function GetTopMarginSize(hBoxHandle: INT32): UINT32 {
  // return size of top margin, for mouse region offsets

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);

  return PopUpBoxList[hBoxHandle].value.uiTopMargin;
}

function ShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fShadeFlag = TRUE;
  }

  return;
}

function UnShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fShadeFlag = FALSE;
  }

  return;
}

function SecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fSecondaryShadeFlag = TRUE;
  }

  return;
}

function UnSecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fSecondaryShadeFlag = FALSE;
  }

  return;
}

function SetBoxBuffer(hBoxHandle: INT32, uiBuffer: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.uiBuffer = uiBuffer;

  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function SetBoxPosition(hBoxHandle: INT32, Position: SGPPoint): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.Position.iX = Position.iX;
  PopUpBoxList[hBoxHandle].value.Position.iY = Position.iY;

  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function GetBoxPosition(hBoxHandle: INT32, Position: Pointer<SGPPoint>): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Position.value.iX = PopUpBoxList[hBoxHandle].value.Position.iX;
  Position.value.iY = PopUpBoxList[hBoxHandle].value.Position.iY;

  return;
}

function SetBoxSize(hBoxHandle: INT32, Dimensions: SGPRect): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle].value.Dimensions.iLeft = Dimensions.iLeft;
  PopUpBoxList[hBoxHandle].value.Dimensions.iBottom = Dimensions.iBottom;
  PopUpBoxList[hBoxHandle].value.Dimensions.iRight = Dimensions.iRight;
  PopUpBoxList[hBoxHandle].value.Dimensions.iTop = Dimensions.iTop;

  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function GetBoxSize(hBoxHandle: INT32, Dimensions: Pointer<SGPRect>): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Dimensions.value.iLeft = PopUpBoxList[hBoxHandle].value.Dimensions.iLeft;
  Dimensions.value.iBottom = PopUpBoxList[hBoxHandle].value.Dimensions.iBottom;
  Dimensions.value.iRight = PopUpBoxList[hBoxHandle].value.Dimensions.iRight;
  Dimensions.value.iTop = PopUpBoxList[hBoxHandle].value.Dimensions.iTop;

  return;
}

function SetBorderType(hBoxHandle: INT32, iBorderObjectIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].value.iBorderObjectIndex = iBorderObjectIndex;
  return;
}

function SetBackGroundSurface(hBoxHandle: INT32, iBackGroundSurfaceIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle].value.iBackGroundSurface = iBackGroundSurfaceIndex;
  return;
}

// adds a FIRST column string to the CURRENT popup box
function AddMonoString(hStringHandle: Pointer<INT32>, pString: STR16): void {
  let pLocalString: STR16 = NULL;
  let pStringSt: POPUPSTRINGPTR = NULL;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  // find first free slot in list
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].value.Text[iCounter] != NULL); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return;
  }

  pStringSt = (MemAlloc(sizeof(POPUPSTRING)));
  if (pStringSt == NULL)
    return;

  pLocalString = (MemAlloc(wcslen(pString) * 2 + 2));
  if (pLocalString == NULL)
    return;

  wcscpy(pLocalString, pString);

  RemoveCurrentBoxPrimaryText(iCounter);

  PopUpBoxList[guiCurrentBox].value.Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fColorFlag = FALSE;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.pString = pLocalString;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fShadeFlag = FALSE;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fHighLightFlag = FALSE;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fSecondaryShadeFlag = FALSE;

  *hStringHandle = iCounter;

  PopUpBoxList[guiCurrentBox].value.fUpdated = FALSE;

  return;
}

// adds a SECOND column string to the CURRENT popup box
function AddSecondColumnMonoString(hStringHandle: Pointer<INT32>, pString: STR16): void {
  let pLocalString: STR16 = NULL;
  let pStringSt: POPUPSTRINGPTR = NULL;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  // find the LAST USED text string index
  for (iCounter = 0; (iCounter + 1 < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].value.Text[iCounter + 1] != NULL); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return;
  }

  pStringSt = (MemAlloc(sizeof(POPUPSTRING)));
  if (pStringSt == NULL)
    return;

  pLocalString = (MemAlloc(wcslen(pString) * 2 + 2));
  if (pLocalString == NULL)
    return;

  wcscpy(pLocalString, pString);

  RemoveCurrentBoxSecondaryText(iCounter);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.fColorFlag = FALSE;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.pString = pLocalString;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.fShadeFlag = FALSE;
  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[iCounter].value.fHighLightFlag = FALSE;

  *hStringHandle = iCounter;

  return;
}

// Adds a COLORED first column string to the CURRENT box
function AddColorString(hStringHandle: Pointer<INT32>, pString: STR16): void {
  let pLocalString: STR16;
  let pStringSt: POPUPSTRINGPTR = NULL;
  let iCounter: INT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  // find first free slot in list
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox].value.Text[iCounter] != NULL); iCounter++)
    ;

  if (iCounter >= MAX_POPUP_BOX_STRING_COUNT) {
    // using too many text lines, or not freeing them up properly
    Assert(0);
    return;
  }

  pStringSt = (MemAlloc(sizeof(POPUPSTRING)));
  if (pStringSt == NULL)
    return;

  pLocalString = (MemAlloc(wcslen(pString) * 2 + 2));
  if (pLocalString == NULL)
    return;

  wcscpy(pLocalString, pString);

  RemoveCurrentBoxPrimaryText(iCounter);

  PopUpBoxList[guiCurrentBox].value.Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.fColorFlag = TRUE;
  PopUpBoxList[guiCurrentBox].value.Text[iCounter].value.pString = pLocalString;

  *hStringHandle = iCounter;

  PopUpBoxList[guiCurrentBox].value.fUpdated = FALSE;

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

function GetNumberOfLinesOfTextInBox(hBoxHandle: INT32): UINT32 {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  // count number of lines
  // check string size
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[iCounter] == NULL) {
      break;
    }
  }

  return iCounter;
}

function SetBoxFont(hBoxHandle: INT32, uiFont: UINT32): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.uiFont = uiFont;
    }
  }

  // set up the 2nd column font
  SetBoxSecondColumnFont(hBoxHandle, uiFont);

  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function SetBoxSecondColumnMinimumOffset(hBoxHandle: INT32, uiWidth: UINT32): void {
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

function SetBoxSecondColumnFont(hBoxHandle: INT32, uiFont: UINT32): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.uiFont = uiFont;
    }
  }

  PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;

  return;
}

function GetBoxFont(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  Assert(PopUpBoxList[hBoxHandle].value.Text[0]);

  // return font id of first line of text of box
  return PopUpBoxList[hBoxHandle].value.Text[0].value.uiFont;
}

// set the foreground color of this string in this pop up box
function SetBoxLineForeground(iBox: INT32, iStringValue: INT32, ubColor: UINT8): void {
  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);
  Assert(PopUpBoxList[iBox].value.Text[iStringValue]);

  PopUpBoxList[iBox].value.Text[iStringValue].value.ubForegroundColor = ubColor;
  return;
}

function SetBoxSecondaryShade(iBox: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[iBox].value.Text[uiCounter] != NULL) {
      PopUpBoxList[iBox].value.Text[uiCounter].value.ubSecondaryShade = ubColor;
    }
  }
  return;
}

// The following functions operate on the CURRENT box

function SetPopUpStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.uiFont = uiFont;
  return;
}

function SetPopUpSecondColumnStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.uiFont = uiFont;
  return;
}

function SetStringSecondaryShade(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubSecondaryShade = ubColor;
  return;
}

function SetStringForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubForegroundColor = ubColor;
  return;
}

function SetStringBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubBackgroundColor = ubColor;
  return;
}

function SetStringHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubHighLight = ubColor;
  return;
}

function SetStringShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.ubShade = ubShade;
  return;
}

function SetStringSecondColumnForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubForegroundColor = ubColor;
  return;
}

function SetStringSecondColumnBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubBackgroundColor = ubColor;
  return;
}

function SetStringSecondColumnHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubHighLight = ubColor;
  return;
}

function SetStringSecondColumnShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.ubShade = ubShade;
  return;
}

function SetBoxForeground(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubForegroundColor = ubColor;
    }
  }
  return;
}

function SetBoxBackground(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubBackgroundColor = ubColor;
    }
  }
  return;
}

function SetBoxHighLight(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubHighLight = ubColor;
    }
  }
  return;
}

function SetBoxShade(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle].value.Text[uiCounter].value.ubShade = ubColor;
    }
  }
  return;
}

function SetBoxSecondColumnForeground(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubForegroundColor = ubColor;
    }
  }

  return;
}

function SetBoxSecondColumnBackground(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubBackgroundColor = ubColor;
    }
  }

  return;
}

function SetBoxSecondColumnHighLight(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.ubHighLight = ubColor;
    }
  }

  return;
}

function SetBoxSecondColumnShade(hBoxHandle: INT32, ubColor: UINT8): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

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

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fHighLightFlag = TRUE;
  return;
}

function GetShadeFlag(hStringHandle: INT32): BOOLEAN {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return FALSE;

  return PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fShadeFlag;
}

function GetSecondaryShadeFlag(hStringHandle: INT32): BOOLEAN {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return FALSE;

  return PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fSecondaryShadeFlag;
}

function HighLightBoxLine(hBoxHandle: INT32, iLineNumber: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  // highlight iLineNumber Line in box indexed by hBoxHandle

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // highlight line
    HighLightLine(iLineNumber);
  }

  return;
}

function GetBoxShadeFlag(hBoxHandle: INT32, iLineNumber: INT32): BOOLEAN {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    return PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fShadeFlag;
  }

  return FALSE;
}

function GetBoxSecondaryShadeFlag(hBoxHandle: INT32, iLineNumber: INT32): BOOLEAN {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  if (PopUpBoxList[hBoxHandle].value.Text[iLineNumber] != NULL) {
    return PopUpBoxList[hBoxHandle].value.Text[iLineNumber].value.fSecondaryShadeFlag;
  }

  return FALSE;
}

function UnHighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox].value.Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.fHighLightFlag = FALSE;
  return;
}

function UnHighLightBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.Text[iCounter])
      PopUpBoxList[hBoxHandle].value.Text[iCounter].value.fHighLightFlag = FALSE;
  }
}

function UnHighLightSecondColumnLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle])
    return;

  PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.fHighLightFlag = FALSE;
  return;
}

function UnHighLightSecondColumnBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter])
      PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCounter].value.fHighLightFlag = FALSE;
  }
}

function RemoveOneCurrentBoxString(hStringHandle: INT32, fFillGaps: BOOLEAN): void {
  let uiCounter: UINT32 = 0;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
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

  PopUpBoxList[guiCurrentBox].value.fUpdated = FALSE;
}

function RemoveAllCurrentBoxStrings(): void {
  let uiCounter: UINT32;

  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++)
    RemoveOneCurrentBoxString(uiCounter, FALSE);
}

function RemoveBox(hBoxHandle: INT32): void {
  let hOldBoxHandle: INT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  GetCurrentBox(&hOldBoxHandle);
  SetCurrentBox(hBoxHandle);

  RemoveAllCurrentBoxStrings();

  MemFree(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle] = NULL;

  if (hOldBoxHandle != hBoxHandle)
    SetCurrentBox(hOldBoxHandle);

  return;
}

function ShowBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != NULL) {
    if (PopUpBoxList[hBoxHandle].value.fShowBox == FALSE) {
      PopUpBoxList[hBoxHandle].value.fShowBox = TRUE;
      PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;
    }
  }
}

function HideBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != NULL) {
    if (PopUpBoxList[hBoxHandle].value.fShowBox == TRUE) {
      PopUpBoxList[hBoxHandle].value.fShowBox = FALSE;
      PopUpBoxList[hBoxHandle].value.fUpdated = FALSE;
    }
  }
}

function SetCurrentBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  guiCurrentBox = hBoxHandle;
}

function GetCurrentBox(hBoxHandle: Pointer<INT32>): void {
  *hBoxHandle = guiCurrentBox;
}

function DisplayBoxes(uiBuffer: UINT32): void {
  let uiCounter: UINT32;

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_COUNT; uiCounter++) {
    DisplayOnePopupBox(uiCounter, uiBuffer);
  }
  return;
}

function DisplayOnePopupBox(uiIndex: UINT32, uiBuffer: UINT32): void {
  if ((uiIndex < 0) || (uiIndex >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[uiIndex] != NULL) {
    if ((PopUpBoxList[uiIndex].value.uiBuffer == uiBuffer) && (PopUpBoxList[uiIndex].value.fShowBox)) {
      DrawBox(uiIndex);
      DrawBoxText(uiIndex);
    }
  }
}

// force an update of this box
function ForceUpDateOfBox(uiIndex: UINT32): void {
  if ((uiIndex < 0) || (uiIndex >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[uiIndex] != NULL) {
    PopUpBoxList[uiIndex].value.fUpdated = FALSE;
  }
}

function DrawBox(uiCounter: UINT32): BOOLEAN {
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
    return FALSE;

  Assert(PopUpBoxList[uiCounter] != NULL);

  // only update if we need to

  if (PopUpBoxList[uiCounter].value.fUpdated == TRUE) {
    return FALSE;
  }

  PopUpBoxList[uiCounter].value.fUpdated = TRUE;

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
  pDestBuf = LockVideoSurface(PopUpBoxList[uiCounter].value.uiBuffer, &uiDestPitchBYTES);
  CHECKF(GetVideoSurface(&hSrcVSurface, PopUpBoxList[uiCounter].value.iBackGroundSurface));
  pSrcBuf = LockVideoSurface(PopUpBoxList[uiCounter].value.iBackGroundSurface, &uiSrcPitchBYTES);
  Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, usTopX, usTopY, &clip);
  UnLockVideoSurface(PopUpBoxList[uiCounter].value.iBackGroundSurface);
  UnLockVideoSurface(PopUpBoxList[uiCounter].value.uiBuffer);
  GetVideoObject(&hBoxHandle, PopUpBoxList[uiCounter].value.iBorderObjectIndex);

  // blit in 4 corners (they're 2x2 pixels)
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_LEFT_CORNER, usTopX, usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_RIGHT_CORNER, usTopX + usWidth - 2, usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_RIGHT_CORNER, usTopX + usWidth - 2, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_LEFT_CORNER, usTopX, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // blit in edges
  if (uiNumTilesWide > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesWide; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, TOP_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);
  }
  if (uiNumTilesHigh > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesHigh; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, NULL);
      BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(PopUpBoxList[uiCounter].value.uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
  }

  InvalidateRegion(usTopX, usTopY, usTopX + usWidth, usTopY + usHeight);
  return TRUE;
}

function DrawBoxText(uiCounter: UINT32): BOOLEAN {
  let uiCount: UINT32 = 0;
  let uX: INT16;
  let uY: INT16;
  let sString: wchar_t[] /* [100] */;

  if ((uiCounter < 0) || (uiCounter >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  Assert(PopUpBoxList[uiCounter] != NULL);

  // clip text?
  if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_CLIP_TEXT) {
    SetFontDestBuffer(PopUpBoxList[uiCounter].value.uiBuffer, PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin - 1, PopUpBoxList[uiCounter].value.Position.iY + PopUpBoxList[uiCounter].value.uiTopMargin, PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.Dimensions.iRight - PopUpBoxList[uiCounter].value.uiRightMargin, PopUpBoxList[uiCounter].value.Position.iY + PopUpBoxList[uiCounter].value.Dimensions.iBottom - PopUpBoxList[uiCounter].value.uiBottomMargin, FALSE);
  }

  for (uiCount = 0; uiCount < MAX_POPUP_BOX_STRING_COUNT; uiCount++) {
    // there is text in this line?
    if (PopUpBoxList[uiCounter].value.Text[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter].value.Text[uiCount].value.fHighLightFlag == FALSE) && (PopUpBoxList[uiCounter].value.Text[uiCount].value.fShadeFlag == FALSE) && (PopUpBoxList[uiCounter].value.Text[uiCount].value.fSecondaryShadeFlag == FALSE)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter].value.Text[uiCount].value.fHighLightFlag == TRUE)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubHighLight);
      } else if ((PopUpBoxList[uiCounter].value.Text[uiCount].value.fSecondaryShadeFlag == TRUE)) {
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubSecondaryShade);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter].value.Text[uiCount].value.ubBackgroundColor);

      // copy string
      wcsncpy(sString, PopUpBoxList[uiCounter].value.Text[uiCount].value.pString, wcslen(PopUpBoxList[uiCounter].value.Text[uiCount].value.pString) + 1);

      // cnetering?
      if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        FindFontCenterCoordinates(((PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin)), ((PopUpBoxList[uiCounter].value.Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont) + PopUpBoxList[uiCounter].value.uiTopMargin + uiCount * PopUpBoxList[uiCounter].value.uiLineSpace)), ((PopUpBoxList[uiCounter].value.Dimensions.iRight - (PopUpBoxList[uiCounter].value.uiRightMargin + PopUpBoxList[uiCounter].value.uiLeftMargin + 2))), (GetFontHeight(PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont)), (sString), (PopUpBoxList[uiCounter].value.Text[uiCount].value.uiFont), &uX, &uY);
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
      if ((PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.fHighLightFlag == FALSE) && (PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.fShadeFlag == FALSE)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.fHighLightFlag == TRUE)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubHighLight);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.ubBackgroundColor);

      // copy string
      wcsncpy(sString, PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.pString, wcslen(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.pString) + 1);

      // cnetering?
      if (PopUpBoxList[uiCounter].value.uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        FindFontCenterCoordinates(((PopUpBoxList[uiCounter].value.Position.iX + PopUpBoxList[uiCounter].value.uiLeftMargin)), ((PopUpBoxList[uiCounter].value.Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont) + PopUpBoxList[uiCounter].value.uiTopMargin + uiCount * PopUpBoxList[uiCounter].value.uiLineSpace)), ((PopUpBoxList[uiCounter].value.Dimensions.iRight - (PopUpBoxList[uiCounter].value.uiRightMargin + PopUpBoxList[uiCounter].value.uiLeftMargin + 2))), (GetFontHeight(PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont)), (sString), (PopUpBoxList[uiCounter].value.pSecondColumnString[uiCount].value.uiFont), &uX, &uY);
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

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, FALSE);

  return TRUE;
}

function ResizeBoxToText(hBoxHandle: INT32): void {
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
    if (PopUpBoxList[hBoxHandle].value.Text[iCurrString] != NULL) {
      if (PopUpBoxList[hBoxHandle].value.pSecondColumnString[iCurrString] != NULL) {
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

function IsBoxShown(uiHandle: UINT32): BOOLEAN {
  if ((uiHandle < 0) || (uiHandle >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  if (PopUpBoxList[uiHandle] == NULL) {
    return FALSE;
  }

  return PopUpBoxList[uiHandle].value.fShowBox;
}

function MarkAllBoxesAsAltered(): void {
  let iCounter: INT32 = 0;

  // mark all boxes as altered
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_COUNT; iCounter++) {
    ForceUpDateOfBox(iCounter);
  }

  return;
}

function HideAllBoxes(): void {
  let iCounter: INT32 = 0;

  // hide all the boxes that are shown
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_COUNT; iCounter++) {
    HideBox(iCounter);
  }
}

function RemoveCurrentBoxPrimaryText(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  // remove & release primary text
  if (PopUpBoxList[guiCurrentBox].value.Text[hStringHandle] != NULL) {
    if (PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.pString) {
      MemFree(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle].value.pString);
    }

    MemFree(PopUpBoxList[guiCurrentBox].value.Text[hStringHandle]);
    PopUpBoxList[guiCurrentBox].value.Text[hStringHandle] = NULL;
  }
}

function RemoveCurrentBoxSecondaryText(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  // remove & release secondary strings
  if (PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle] != NULL) {
    if (PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.pString) {
      MemFree(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle].value.pString);
    }

    MemFree(PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle]);
    PopUpBoxList[guiCurrentBox].value.pSecondColumnString[hStringHandle] = NULL;
  }
}
