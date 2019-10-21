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
  PopUpBoxList[hBoxHandle]->uiLineSpace = uiLineSpace;
  return;
}

function GetLineSpace(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  // return number of pixels between lines for this box
  return PopUpBoxList[hBoxHandle]->uiLineSpace;
}

function SpecifyBoxMinWidth(hBoxHandle: INT32, iMinWidth: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle]->uiBoxMinWidth = iMinWidth;

  // check if the box is currently too small
  if (PopUpBoxList[hBoxHandle]->Dimensions.iRight < iMinWidth) {
    PopUpBoxList[hBoxHandle]->Dimensions.iRight = iMinWidth;
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
    PopUpBoxList[iCount]->Text[iCounter] = NULL;
    PopUpBoxList[iCount]->pSecondColumnString[iCounter] = NULL;
  }

  SetCurrentBox(iCount);
  SpecifyBoxMinWidth(iCount, 0);
  SetBoxSecondColumnMinimumOffset(iCount, 0);
  SetBoxSecondColumnCurrentOffset(iCount, 0);

  PopUpBoxList[iCount]->fUpdated = FALSE;

  return TRUE;
}

function SetBoxFlags(hBoxHandle: INT32, uiFlags: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle]->uiFlags = uiFlags;
  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function SetMargins(hBoxHandle: INT32, uiLeft: UINT32, uiTop: UINT32, uiBottom: UINT32, uiRight: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle]->uiLeftMargin = uiLeft;
  PopUpBoxList[hBoxHandle]->uiRightMargin = uiRight;
  PopUpBoxList[hBoxHandle]->uiTopMargin = uiTop;
  PopUpBoxList[hBoxHandle]->uiBottomMargin = uiBottom;

  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function GetTopMarginSize(hBoxHandle: INT32): UINT32 {
  // return size of top margin, for mouse region offsets

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);

  return PopUpBoxList[hBoxHandle]->uiTopMargin;
}

function ShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle]->Text[iLineNumber]->fShadeFlag = TRUE;
  }

  return;
}

function UnShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle]->Text[iLineNumber]->fShadeFlag = FALSE;
  }

  return;
}

function SecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // shade iLineNumber Line in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle]->Text[iLineNumber]->fSecondaryShadeFlag = TRUE;
  }

  return;
}

function UnSecondaryShadeStringInBox(hBoxHandle: INT32, iLineNumber: INT32): void {
  // unshade iLineNumber in box indexed by hBoxHandle

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
    // set current box
    SetCurrentBox(hBoxHandle);

    // shade line
    PopUpBoxList[hBoxHandle]->Text[iLineNumber]->fSecondaryShadeFlag = FALSE;
  }

  return;
}

function SetBoxBuffer(hBoxHandle: INT32, uiBuffer: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle]->uiBuffer = uiBuffer;

  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function SetBoxPosition(hBoxHandle: INT32, Position: SGPPoint): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle]->Position.iX = Position.iX;
  PopUpBoxList[hBoxHandle]->Position.iY = Position.iY;

  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function GetBoxPosition(hBoxHandle: INT32, Position: Pointer<SGPPoint>): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Position->iX = PopUpBoxList[hBoxHandle]->Position.iX;
  Position->iY = PopUpBoxList[hBoxHandle]->Position.iY;

  return;
}

function SetBoxSize(hBoxHandle: INT32, Dimensions: SGPRect): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  PopUpBoxList[hBoxHandle]->Dimensions.iLeft = Dimensions.iLeft;
  PopUpBoxList[hBoxHandle]->Dimensions.iBottom = Dimensions.iBottom;
  PopUpBoxList[hBoxHandle]->Dimensions.iRight = Dimensions.iRight;
  PopUpBoxList[hBoxHandle]->Dimensions.iTop = Dimensions.iTop;

  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function GetBoxSize(hBoxHandle: INT32, Dimensions: Pointer<SGPRect>): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);

  Dimensions->iLeft = PopUpBoxList[hBoxHandle]->Dimensions.iLeft;
  Dimensions->iBottom = PopUpBoxList[hBoxHandle]->Dimensions.iBottom;
  Dimensions->iRight = PopUpBoxList[hBoxHandle]->Dimensions.iRight;
  Dimensions->iTop = PopUpBoxList[hBoxHandle]->Dimensions.iTop;

  return;
}

function SetBorderType(hBoxHandle: INT32, iBorderObjectIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle]->iBorderObjectIndex = iBorderObjectIndex;
  return;
}

function SetBackGroundSurface(hBoxHandle: INT32, iBackGroundSurfaceIndex: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle]);
  PopUpBoxList[hBoxHandle]->iBackGroundSurface = iBackGroundSurfaceIndex;
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
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox]->Text[iCounter] != NULL); iCounter++)
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

  PopUpBoxList[guiCurrentBox]->Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->fColorFlag = FALSE;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->pString = pLocalString;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->fShadeFlag = FALSE;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->fHighLightFlag = FALSE;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->fSecondaryShadeFlag = FALSE;

  *hStringHandle = iCounter;

  PopUpBoxList[guiCurrentBox]->fUpdated = FALSE;

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
  for (iCounter = 0; (iCounter + 1 < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox]->Text[iCounter + 1] != NULL); iCounter++)
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

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox]->pSecondColumnString[iCounter]->fColorFlag = FALSE;
  PopUpBoxList[guiCurrentBox]->pSecondColumnString[iCounter]->pString = pLocalString;
  PopUpBoxList[guiCurrentBox]->pSecondColumnString[iCounter]->fShadeFlag = FALSE;
  PopUpBoxList[guiCurrentBox]->pSecondColumnString[iCounter]->fHighLightFlag = FALSE;

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
  for (iCounter = 0; (iCounter < MAX_POPUP_BOX_STRING_COUNT) && (PopUpBoxList[guiCurrentBox]->Text[iCounter] != NULL); iCounter++)
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

  PopUpBoxList[guiCurrentBox]->Text[iCounter] = pStringSt;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->fColorFlag = TRUE;
  PopUpBoxList[guiCurrentBox]->Text[iCounter]->pString = pLocalString;

  *hStringHandle = iCounter;

  PopUpBoxList[guiCurrentBox]->fUpdated = FALSE;

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

  uiBaseWidth = pBox->uiLeftMargin + pBox->uiSecondColumnMinimunOffset;

  // check string sizes
  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (pBox->Text[iCounter]) {
      uiThisWidth = uiBaseWidth + StringPixLength(pBox->Text[iCounter]->pString, pBox->Text[iCounter]->uiFont);

      if (uiThisWidth > pBox->uiSecondColumnCurrentOffset) {
        pBox->uiSecondColumnCurrentOffset = uiThisWidth;
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
    if (PopUpBoxList[hBoxHandle]->Text[iCounter] == NULL) {
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
    if (PopUpBoxList[hBoxHandle]->Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle]->Text[uiCounter]->uiFont = uiFont;
    }
  }

  // set up the 2nd column font
  SetBoxSecondColumnFont(hBoxHandle, uiFont);

  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function SetBoxSecondColumnMinimumOffset(hBoxHandle: INT32, uiWidth: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  PopUpBoxList[hBoxHandle]->uiSecondColumnMinimunOffset = uiWidth;
  return;
}

function SetBoxSecondColumnCurrentOffset(hBoxHandle: INT32, uiCurrentOffset: UINT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  PopUpBoxList[hBoxHandle]->uiSecondColumnCurrentOffset = uiCurrentOffset;
  return;
}

function SetBoxSecondColumnFont(hBoxHandle: INT32, uiFont: UINT32): void {
  let iCounter: UINT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]->uiFont = uiFont;
    }
  }

  PopUpBoxList[hBoxHandle]->fUpdated = FALSE;

  return;
}

function GetBoxFont(hBoxHandle: INT32): UINT32 {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return 0;

  Assert(PopUpBoxList[hBoxHandle]);
  Assert(PopUpBoxList[hBoxHandle]->Text[0]);

  // return font id of first line of text of box
  return PopUpBoxList[hBoxHandle]->Text[0]->uiFont;
}

// set the foreground color of this string in this pop up box
function SetBoxLineForeground(iBox: INT32, iStringValue: INT32, ubColor: UINT8): void {
  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);
  Assert(PopUpBoxList[iBox]->Text[iStringValue]);

  PopUpBoxList[iBox]->Text[iStringValue]->ubForegroundColor = ubColor;
  return;
}

function SetBoxSecondaryShade(iBox: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((iBox < 0) || (iBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[iBox]);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[iBox]->Text[uiCounter] != NULL) {
      PopUpBoxList[iBox]->Text[uiCounter]->ubSecondaryShade = ubColor;
    }
  }
  return;
}

// The following functions operate on the CURRENT box

function SetPopUpStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->uiFont = uiFont;
  return;
}

function SetPopUpSecondColumnStringFont(hStringHandle: INT32, uiFont: UINT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->uiFont = uiFont;
  return;
}

function SetStringSecondaryShade(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->ubSecondaryShade = ubColor;
  return;
}

function SetStringForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->ubForegroundColor = ubColor;
  return;
}

function SetStringBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->ubBackgroundColor = ubColor;
  return;
}

function SetStringHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->ubHighLight = ubColor;
  return;
}

function SetStringShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->ubShade = ubShade;
  return;
}

function SetStringSecondColumnForeground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->ubForegroundColor = ubColor;
  return;
}

function SetStringSecondColumnBackground(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->ubBackgroundColor = ubColor;
  return;
}

function SetStringSecondColumnHighLight(hStringHandle: INT32, ubColor: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->ubHighLight = ubColor;
  return;
}

function SetStringSecondColumnShade(hStringHandle: INT32, ubShade: UINT8): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]);

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->ubShade = ubShade;
  return;
}

function SetBoxForeground(hBoxHandle: INT32, ubColor: UINT8): void {
  let uiCounter: UINT32;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[hBoxHandle] != NULL);

  for (uiCounter = 0; uiCounter < MAX_POPUP_BOX_STRING_COUNT; uiCounter++) {
    if (PopUpBoxList[hBoxHandle]->Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle]->Text[uiCounter]->ubForegroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle]->Text[uiCounter]->ubBackgroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle]->Text[uiCounter]->ubHighLight = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->Text[uiCounter] != NULL) {
      PopUpBoxList[hBoxHandle]->Text[uiCounter]->ubShade = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]->ubForegroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]->ubBackgroundColor = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]->ubHighLight = ubColor;
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
    if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]) {
      PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]->ubShade = ubColor;
    }
  }
  return;
}

function HighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox]->Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->fHighLightFlag = TRUE;
  return;
}

function GetShadeFlag(hStringHandle: INT32): BOOLEAN {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox]->Text[hStringHandle])
    return FALSE;

  return PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->fShadeFlag;
}

function GetSecondaryShadeFlag(hStringHandle: INT32): BOOLEAN {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox]->Text[hStringHandle])
    return FALSE;

  return PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->fSecondaryShadeFlag;
}

function HighLightBoxLine(hBoxHandle: INT32, iLineNumber: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  // highlight iLineNumber Line in box indexed by hBoxHandle

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
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

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
    return PopUpBoxList[hBoxHandle]->Text[iLineNumber]->fShadeFlag;
  }

  return FALSE;
}

function GetBoxSecondaryShadeFlag(hBoxHandle: INT32, iLineNumber: INT32): BOOLEAN {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  if (PopUpBoxList[hBoxHandle]->Text[iLineNumber] != NULL) {
    return PopUpBoxList[hBoxHandle]->Text[iLineNumber]->fSecondaryShadeFlag;
  }

  return FALSE;
}

function UnHighLightLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox]->Text[hStringHandle])
    return;
  PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->fHighLightFlag = FALSE;
  return;
}

function UnHighLightBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle]->Text[iCounter])
      PopUpBoxList[hBoxHandle]->Text[iCounter]->fHighLightFlag = FALSE;
  }
}

function UnHighLightSecondColumnLine(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);

  if (!PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle])
    return;

  PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->fHighLightFlag = FALSE;
  return;
}

function UnHighLightSecondColumnBox(hBoxHandle: INT32): void {
  let iCounter: INT32 = 0;

  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  for (iCounter = 0; iCounter < MAX_POPUP_BOX_STRING_COUNT; iCounter++) {
    if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter])
      PopUpBoxList[hBoxHandle]->pSecondColumnString[iCounter]->fHighLightFlag = FALSE;
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
      PopUpBoxList[guiCurrentBox]->Text[uiCounter] = PopUpBoxList[guiCurrentBox]->Text[uiCounter + 1];
      PopUpBoxList[guiCurrentBox]->pSecondColumnString[uiCounter] = PopUpBoxList[guiCurrentBox]->pSecondColumnString[uiCounter + 1];
    }
  }

  PopUpBoxList[guiCurrentBox]->fUpdated = FALSE;
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
    if (PopUpBoxList[hBoxHandle]->fShowBox == FALSE) {
      PopUpBoxList[hBoxHandle]->fShowBox = TRUE;
      PopUpBoxList[hBoxHandle]->fUpdated = FALSE;
    }
  }
}

function HideBox(hBoxHandle: INT32): void {
  if ((hBoxHandle < 0) || (hBoxHandle >= MAX_POPUP_BOX_COUNT))
    return;

  if (PopUpBoxList[hBoxHandle] != NULL) {
    if (PopUpBoxList[hBoxHandle]->fShowBox == TRUE) {
      PopUpBoxList[hBoxHandle]->fShowBox = FALSE;
      PopUpBoxList[hBoxHandle]->fUpdated = FALSE;
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
    if ((PopUpBoxList[uiIndex]->uiBuffer == uiBuffer) && (PopUpBoxList[uiIndex]->fShowBox)) {
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
    PopUpBoxList[uiIndex]->fUpdated = FALSE;
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

  if (PopUpBoxList[uiCounter]->fUpdated == TRUE) {
    return FALSE;
  }

  PopUpBoxList[uiCounter]->fUpdated = TRUE;

  if (PopUpBoxList[uiCounter]->uiFlags & POPUP_BOX_FLAG_RESIZE) {
    ResizeBoxToText(uiCounter);
  }

  usTopX = (UINT16)PopUpBoxList[uiCounter]->Position.iX;
  usTopY = (UINT16)PopUpBoxList[uiCounter]->Position.iY;
  usWidth = ((UINT16)(PopUpBoxList[uiCounter]->Dimensions.iRight - PopUpBoxList[uiCounter]->Dimensions.iLeft));
  usHeight = ((UINT16)(PopUpBoxList[uiCounter]->Dimensions.iBottom - PopUpBoxList[uiCounter]->Dimensions.iTop));

  // check if we have a min width, if so then update box for such
  if ((PopUpBoxList[uiCounter]->uiBoxMinWidth) && (usWidth < PopUpBoxList[uiCounter]->uiBoxMinWidth)) {
    usWidth = (INT16)(PopUpBoxList[uiCounter]->uiBoxMinWidth);
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
  pDestBuf = (UINT16 *)LockVideoSurface(PopUpBoxList[uiCounter]->uiBuffer, &uiDestPitchBYTES);
  CHECKF(GetVideoSurface(&hSrcVSurface, PopUpBoxList[uiCounter]->iBackGroundSurface));
  pSrcBuf = LockVideoSurface(PopUpBoxList[uiCounter]->iBackGroundSurface, &uiSrcPitchBYTES);
  Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, usTopX, usTopY, &clip);
  UnLockVideoSurface(PopUpBoxList[uiCounter]->iBackGroundSurface);
  UnLockVideoSurface(PopUpBoxList[uiCounter]->uiBuffer);
  GetVideoObject(&hBoxHandle, PopUpBoxList[uiCounter]->iBorderObjectIndex);

  // blit in 4 corners (they're 2x2 pixels)
  BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, TOP_LEFT_CORNER, usTopX, usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, TOP_RIGHT_CORNER, usTopX + usWidth - 2, usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, BOTTOM_RIGHT_CORNER, usTopX + usWidth - 2, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, BOTTOM_LEFT_CORNER, usTopX, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);

  // blit in edges
  if (uiNumTilesWide > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesWide; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, TOP_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
      BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + 2 + (uiCount * BORDER_WIDTH), usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, TOP_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, BOTTOM_EDGE, usTopX + usWidth - 2 - BORDER_WIDTH, usTopY + usHeight - 2, VO_BLT_SRCTRANSPARENCY, NULL);
  }
  if (uiNumTilesHigh > 0) {
    // full pieces
    for (uiCount = 0; uiCount < uiNumTilesHigh; uiCount++) {
      BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, NULL);
      BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + 2 + (uiCount * BORDER_HEIGHT), VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // partial pieces
    BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, SIDE_EDGE, usTopX, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
    BltVideoObject(PopUpBoxList[uiCounter]->uiBuffer, hBoxHandle, SIDE_EDGE, usTopX + usWidth - 2, usTopY + usHeight - 2 - BORDER_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
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
  if (PopUpBoxList[uiCounter]->uiFlags & POPUP_BOX_FLAG_CLIP_TEXT) {
    SetFontDestBuffer(PopUpBoxList[uiCounter]->uiBuffer, PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->uiLeftMargin - 1, PopUpBoxList[uiCounter]->Position.iY + PopUpBoxList[uiCounter]->uiTopMargin, PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->Dimensions.iRight - PopUpBoxList[uiCounter]->uiRightMargin, PopUpBoxList[uiCounter]->Position.iY + PopUpBoxList[uiCounter]->Dimensions.iBottom - PopUpBoxList[uiCounter]->uiBottomMargin, FALSE);
  }

  for (uiCount = 0; uiCount < MAX_POPUP_BOX_STRING_COUNT; uiCount++) {
    // there is text in this line?
    if (PopUpBoxList[uiCounter]->Text[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter]->Text[uiCount]->uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter]->Text[uiCount]->fHighLightFlag == FALSE) && (PopUpBoxList[uiCounter]->Text[uiCount]->fShadeFlag == FALSE) && (PopUpBoxList[uiCounter]->Text[uiCount]->fSecondaryShadeFlag == FALSE)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter]->Text[uiCount]->ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter]->Text[uiCount]->fHighLightFlag == TRUE)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter]->Text[uiCount]->ubHighLight);
      } else if ((PopUpBoxList[uiCounter]->Text[uiCount]->fSecondaryShadeFlag == TRUE)) {
        SetFontForeground(PopUpBoxList[uiCounter]->Text[uiCount]->ubSecondaryShade);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter]->Text[uiCount]->ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter]->Text[uiCount]->ubBackgroundColor);

      // copy string
      wcsncpy(sString, PopUpBoxList[uiCounter]->Text[uiCount]->pString, wcslen(PopUpBoxList[uiCounter]->Text[uiCount]->pString) + 1);

      // cnetering?
      if (PopUpBoxList[uiCounter]->uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        FindFontCenterCoordinates(((INT16)(PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->uiLeftMargin)), ((INT16)(PopUpBoxList[uiCounter]->Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter]->Text[uiCount]->uiFont) + PopUpBoxList[uiCounter]->uiTopMargin + uiCount * PopUpBoxList[uiCounter]->uiLineSpace)), ((INT16)(PopUpBoxList[uiCounter]->Dimensions.iRight - (PopUpBoxList[uiCounter]->uiRightMargin + PopUpBoxList[uiCounter]->uiLeftMargin + 2))), ((INT16)GetFontHeight(PopUpBoxList[uiCounter]->Text[uiCount]->uiFont)), (sString), ((INT32)PopUpBoxList[uiCounter]->Text[uiCount]->uiFont), &uX, &uY);
      } else {
        uX = ((INT16)(PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->uiLeftMargin));
        uY = ((INT16)(PopUpBoxList[uiCounter]->Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter]->Text[uiCount]->uiFont) + PopUpBoxList[uiCounter]->uiTopMargin + uiCount * PopUpBoxList[uiCounter]->uiLineSpace));
      }

      // print
      // gprintfdirty(uX,uY,PopUpBoxList[uiCounter]->Text[uiCount]->pString );
      mprintf(uX, uY, PopUpBoxList[uiCounter]->Text[uiCount]->pString);
    }

    // there is secondary text in this line?
    if (PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]) {
      // set font
      SetFont(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->uiFont);

      // are we highlighting?...shading?..or neither
      if ((PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->fHighLightFlag == FALSE) && (PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->fShadeFlag == FALSE)) {
        // neither
        SetFontForeground(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->ubForegroundColor);
      } else if ((PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->fHighLightFlag == TRUE)) {
        // highlight
        SetFontForeground(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->ubHighLight);
      } else {
        // shading
        SetFontForeground(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->ubShade);
      }

      // set background
      SetFontBackground(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->ubBackgroundColor);

      // copy string
      wcsncpy(sString, PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->pString, wcslen(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->pString) + 1);

      // cnetering?
      if (PopUpBoxList[uiCounter]->uiFlags & POPUP_BOX_FLAG_CENTER_TEXT) {
        FindFontCenterCoordinates(((INT16)(PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->uiLeftMargin)), ((INT16)(PopUpBoxList[uiCounter]->Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->uiFont) + PopUpBoxList[uiCounter]->uiTopMargin + uiCount * PopUpBoxList[uiCounter]->uiLineSpace)), ((INT16)(PopUpBoxList[uiCounter]->Dimensions.iRight - (PopUpBoxList[uiCounter]->uiRightMargin + PopUpBoxList[uiCounter]->uiLeftMargin + 2))), ((INT16)GetFontHeight(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->uiFont)), (sString), ((INT32)PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->uiFont), &uX, &uY);
      } else {
        uX = ((INT16)(PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->uiLeftMargin + PopUpBoxList[uiCounter]->uiSecondColumnCurrentOffset));
        uY = ((INT16)(PopUpBoxList[uiCounter]->Position.iY + uiCount * GetFontHeight(PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->uiFont) + PopUpBoxList[uiCounter]->uiTopMargin + uiCount * PopUpBoxList[uiCounter]->uiLineSpace));
      }

      // print
      // gprintfdirty(uX,uY,PopUpBoxList[uiCounter]->Text[uiCount]->pString );
      mprintf(uX, uY, PopUpBoxList[uiCounter]->pSecondColumnString[uiCount]->pString);
    }
  }

  if (PopUpBoxList[uiCounter]->uiBuffer != guiSAVEBUFFER) {
    InvalidateRegion(PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->uiLeftMargin - 1, PopUpBoxList[uiCounter]->Position.iY + PopUpBoxList[uiCounter]->uiTopMargin, PopUpBoxList[uiCounter]->Position.iX + PopUpBoxList[uiCounter]->Dimensions.iRight - PopUpBoxList[uiCounter]->uiRightMargin, PopUpBoxList[uiCounter]->Position.iY + PopUpBoxList[uiCounter]->Dimensions.iBottom - PopUpBoxList[uiCounter]->uiBottomMargin);
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

  iHeight = PopUpBoxList[hBoxHandle]->uiTopMargin + PopUpBoxList[hBoxHandle]->uiBottomMargin;

  for (iCurrString = 0; iCurrString < MAX_POPUP_BOX_STRING_COUNT; iCurrString++) {
    if (PopUpBoxList[hBoxHandle]->Text[iCurrString] != NULL) {
      if (PopUpBoxList[hBoxHandle]->pSecondColumnString[iCurrString] != NULL) {
        iSecondColumnLength = StringPixLength(PopUpBoxList[hBoxHandle]->pSecondColumnString[iCurrString]->pString, PopUpBoxList[hBoxHandle]->pSecondColumnString[iCurrString]->uiFont);
        if (PopUpBoxList[hBoxHandle]->uiSecondColumnCurrentOffset + iSecondColumnLength + PopUpBoxList[hBoxHandle]->uiLeftMargin + PopUpBoxList[hBoxHandle]->uiRightMargin > ((UINT32)iWidth)) {
          iWidth = PopUpBoxList[hBoxHandle]->uiSecondColumnCurrentOffset + iSecondColumnLength + PopUpBoxList[hBoxHandle]->uiLeftMargin + PopUpBoxList[hBoxHandle]->uiRightMargin;
        }
      }

      if ((StringPixLength(PopUpBoxList[hBoxHandle]->Text[iCurrString]->pString, PopUpBoxList[hBoxHandle]->Text[iCurrString]->uiFont) + PopUpBoxList[hBoxHandle]->uiLeftMargin + PopUpBoxList[hBoxHandle]->uiRightMargin) > ((UINT32)iWidth))
        iWidth = StringPixLength(PopUpBoxList[hBoxHandle]->Text[iCurrString]->pString, PopUpBoxList[hBoxHandle]->Text[iCurrString]->uiFont) + PopUpBoxList[hBoxHandle]->uiLeftMargin + PopUpBoxList[hBoxHandle]->uiRightMargin;

      // vertical
      iHeight += GetFontHeight(PopUpBoxList[hBoxHandle]->Text[iCurrString]->uiFont) + PopUpBoxList[hBoxHandle]->uiLineSpace;
    } else {
      // doesn't support gaps in text array...
      break;
    }
  }
  PopUpBoxList[hBoxHandle]->Dimensions.iBottom = iHeight;
  PopUpBoxList[hBoxHandle]->Dimensions.iRight = iWidth;
}

function IsBoxShown(uiHandle: UINT32): BOOLEAN {
  if ((uiHandle < 0) || (uiHandle >= MAX_POPUP_BOX_COUNT))
    return FALSE;

  if (PopUpBoxList[uiHandle] == NULL) {
    return FALSE;
  }

  return PopUpBoxList[uiHandle]->fShowBox;
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
  if (PopUpBoxList[guiCurrentBox]->Text[hStringHandle] != NULL) {
    if (PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->pString) {
      MemFree(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]->pString);
    }

    MemFree(PopUpBoxList[guiCurrentBox]->Text[hStringHandle]);
    PopUpBoxList[guiCurrentBox]->Text[hStringHandle] = NULL;
  }
}

function RemoveCurrentBoxSecondaryText(hStringHandle: INT32): void {
  if ((guiCurrentBox < 0) || (guiCurrentBox >= MAX_POPUP_BOX_COUNT))
    return;

  Assert(PopUpBoxList[guiCurrentBox] != NULL);
  Assert(hStringHandle < MAX_POPUP_BOX_STRING_COUNT);

  // remove & release secondary strings
  if (PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle] != NULL) {
    if (PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->pString) {
      MemFree(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]->pString);
    }

    MemFree(PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle]);
    PopUpBoxList[guiCurrentBox]->pSecondColumnString[hStringHandle] = NULL;
  }
}
