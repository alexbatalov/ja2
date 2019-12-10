namespace ja2 {

interface MERCPLACEMENT {
  pSoldier: SOLDIERTYPE;
  uiVObjectID: UINT32;
  region: MOUSE_REGION;
  ubStrategicInsertionCode: UINT8;
  fPlaced: boolean;
}

function createMercPlacement(): MERCPLACEMENT {
  return {
    pSoldier: <SOLDIERTYPE><unknown>null,
    uiVObjectID: 0,
    region: createMouseRegion(),
    ubStrategicInsertionCode: 0,
    fPlaced: false,
  };
}

let gMercPlacement: MERCPLACEMENT[] /* Pointer<MERCPLACEMENT> */ = <MERCPLACEMENT[]><unknown>null;

const enum Enum310 {
  DONE_BUTTON,
  SPREAD_BUTTON,
  GROUP_BUTTON,
  CLEAR_BUTTON,
  NUM_TP_BUTTONS,
}
let iTPButtons: UINT32[] /* [NUM_TP_BUTTONS] */ = createArray(Enum310.NUM_TP_BUTTONS, 0);

export let gubDefaultButton: UINT8 = Enum310.CLEAR_BUTTON;
export let gfTacticalPlacementGUIActive: boolean = false;
let gfTacticalPlacementFirstTime: boolean = false;
export let gfEnterTacticalPlacementGUI: boolean = false;
let gfKillTacticalGUI: UINT8 /* boolean */ = 0;
let giOverheadPanelImage: INT32 = 0;
let giOverheadButtonImages: INT32[] /* [NUM_TP_BUTTONS] */ = createArray(Enum310.NUM_TP_BUTTONS, 0);
export let giMercPanelImage: INT32 = 0;
let giPlacements: INT32 = 0;
export let gfTacticalPlacementGUIDirty: boolean = false;
export let gfValidLocationsChanged: UINT8 /* boolean */ = 0;
let gTPClipRect: SGPRect = createSGPRectFrom(0, 0, 0, 0);
let gfValidCursor: boolean = false;
let gfEveryonePlaced: boolean = false;

let gubSelectedGroupID: UINT8 = 0;
let gubHilightedGroupID: UINT8 = 0;
let gubCursorGroupID: UINT8 = 0;
let gbSelectedMercID: INT8 = -1;
let gbHilightedMercID: INT8 = -1;
let gbCursorMercID: INT8 = -1;
export let gpTacticalPlacementSelectedSoldier: SOLDIERTYPE | null /* Pointer<SOLDIERTYPE> */ = null;
export let gpTacticalPlacementHilightedSoldier: SOLDIERTYPE | null /* Pointer<SOLDIERTYPE> */ = null;

let gfNorth: boolean;
let gfEast: boolean;
let gfSouth: boolean;
let gfWest: boolean;

export function InitTacticalPlacementGUI(): void {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let i: INT32;
  let xp: INT32;
  let yp: INT32;
  let ubFaceIndex: UINT8;
  gfTacticalPlacementGUIActive = true;
  gfTacticalPlacementGUIDirty = true;
  gfValidLocationsChanged = 1;
  gfTacticalPlacementFirstTime = true;
  gfNorth = gfEast = gfSouth = gfWest = false;

  // Enter overhead map
  GoIntoOverheadMap();

  // Load the images
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = "Interface\\OverheadInterface.sti";
  if (!(giOverheadPanelImage = AddVideoObject(VObjectDesc))) {
    AssertMsg(0, "Failed to load Interface\\OverheadInterface.sti");
  }
  VObjectDesc.ImageFile = "Interface\\panels.sti";
  if (!(giMercPanelImage = AddVideoObject(VObjectDesc))) {
    AssertMsg(0, "Failed to load Interface\\panels.sti");
  }

  giOverheadButtonImages[Enum310.DONE_BUTTON] = LoadButtonImage("Interface\\OverheadUIButtons.sti", -1, 0, -1, 1, -1);
  if (giOverheadButtonImages[Enum310.DONE_BUTTON] == -1) {
    AssertMsg(0, "Failed to load Interface\\OverheadUIButtons.sti");
  }
  giOverheadButtonImages[Enum310.SPREAD_BUTTON] = UseLoadedButtonImage(giOverheadButtonImages[Enum310.DONE_BUTTON], -1, 0, -1, 1, -1);
  giOverheadButtonImages[Enum310.GROUP_BUTTON] = UseLoadedButtonImage(giOverheadButtonImages[Enum310.DONE_BUTTON], -1, 0, -1, 1, -1);
  giOverheadButtonImages[Enum310.CLEAR_BUTTON] = UseLoadedButtonImage(giOverheadButtonImages[Enum310.DONE_BUTTON], -1, 0, -1, 1, -1);

  // Create the buttons which provide automatic placements.
  iTPButtons[Enum310.CLEAR_BUTTON] = QuickCreateButton(giOverheadButtonImages[Enum310.CLEAR_BUTTON], 11, 332, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), ClearPlacementsCallback);
  SpecifyGeneralButtonTextAttributes(iTPButtons[Enum310.CLEAR_BUTTON], gpStrategicString[Enum365.STR_TP_CLEAR], BLOCKFONT(), FONT_BEIGE, 141);
  SetButtonFastHelpText(iTPButtons[Enum310.CLEAR_BUTTON], gpStrategicString[Enum365.STR_TP_CLEARHELP]);
  SetBtnHelpEndCallback(iTPButtons[Enum310.CLEAR_BUTTON], FastHelpRemoved2Callback);
  iTPButtons[Enum310.SPREAD_BUTTON] = QuickCreateButton(giOverheadButtonImages[Enum310.SPREAD_BUTTON], 11, 367, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), SpreadPlacementsCallback);
  SpecifyGeneralButtonTextAttributes(iTPButtons[Enum310.SPREAD_BUTTON], gpStrategicString[Enum365.STR_TP_SPREAD], BLOCKFONT(), FONT_BEIGE, 141);
  SetButtonFastHelpText(iTPButtons[Enum310.SPREAD_BUTTON], gpStrategicString[Enum365.STR_TP_SPREADHELP]);
  SetBtnHelpEndCallback(iTPButtons[Enum310.SPREAD_BUTTON], FastHelpRemovedCallback);
  iTPButtons[Enum310.GROUP_BUTTON] = QuickCreateButton(giOverheadButtonImages[Enum310.GROUP_BUTTON], 11, 402, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), GroupPlacementsCallback);
  SpecifyGeneralButtonTextAttributes(iTPButtons[Enum310.GROUP_BUTTON], gpStrategicString[Enum365.STR_TP_GROUP], BLOCKFONT(), FONT_BEIGE, 141);
  SetButtonFastHelpText(iTPButtons[Enum310.GROUP_BUTTON], gpStrategicString[Enum365.STR_TP_GROUPHELP]);
  SetBtnHelpEndCallback(iTPButtons[Enum310.GROUP_BUTTON], FastHelpRemovedCallback);
  iTPButtons[Enum310.DONE_BUTTON] = QuickCreateButton(giOverheadButtonImages[Enum310.DONE_BUTTON], 11, 437, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoneOverheadPlacementClickCallback);
  SpecifyGeneralButtonTextAttributes(iTPButtons[Enum310.DONE_BUTTON], gpStrategicString[Enum365.STR_TP_DONE], BLOCKFONT(), FONT_BEIGE, 141);
  SetButtonFastHelpText(iTPButtons[Enum310.DONE_BUTTON], gpStrategicString[Enum365.STR_TP_DONEHELP]);
  SetBtnHelpEndCallback(iTPButtons[Enum310.DONE_BUTTON], FastHelpRemovedCallback);
  AllowDisabledButtonFastHelp(iTPButtons[Enum310.DONE_BUTTON], true);

  SpecifyButtonHilitedTextColors(iTPButtons[Enum310.CLEAR_BUTTON], FONT_WHITE, FONT_NEARBLACK);
  SpecifyButtonHilitedTextColors(iTPButtons[Enum310.SPREAD_BUTTON], FONT_WHITE, FONT_NEARBLACK);
  SpecifyButtonHilitedTextColors(iTPButtons[Enum310.GROUP_BUTTON], FONT_WHITE, FONT_NEARBLACK);
  SpecifyButtonHilitedTextColors(iTPButtons[Enum310.DONE_BUTTON], FONT_WHITE, FONT_NEARBLACK);

  Assert(gpBattleGroup);

  // First pass:  Count the number of mercs that are going to be placed by the player.
  //             This determines the size of the array we will allocate.
  giPlacements = 0;
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    if (MercPtrs[i].bActive && !MercPtrs[i].fBetweenSectors && MercPtrs[i].sSectorX == gpBattleGroup.ubSectorX && MercPtrs[i].sSectorY == gpBattleGroup.ubSectorY && !(MercPtrs[i].uiStatusFlags & (SOLDIER_VEHICLE)) && // ATE Ignore vehicles
        MercPtrs[i].bAssignment != Enum117.ASSIGNMENT_POW && MercPtrs[i].bAssignment != Enum117.IN_TRANSIT && !MercPtrs[i].bSectorZ) {
      giPlacements++;
    }
  }
  // Allocate the array based on how many mercs there are.
  gMercPlacement = createArrayFrom(giPlacements, createMercPlacement);
  Assert(gMercPlacement);
  // Second pass:  Assign the mercs to their respective slots.
  giPlacements = 0;
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    if (MercPtrs[i].bActive && MercPtrs[i].bLife && !MercPtrs[i].fBetweenSectors && MercPtrs[i].sSectorX == gpBattleGroup.ubSectorX && MercPtrs[i].sSectorY == gpBattleGroup.ubSectorY && MercPtrs[i].bAssignment != Enum117.ASSIGNMENT_POW && MercPtrs[i].bAssignment != Enum117.IN_TRANSIT && !(MercPtrs[i].uiStatusFlags & (SOLDIER_VEHICLE)) && // ATE Ignore vehicles
        !MercPtrs[i].bSectorZ) {
      // ATE: If we are in a vehicle - remove ourselves from it!
      // if ( MercPtrs[ i ]->uiStatusFlags & ( SOLDIER_DRIVER | SOLDIER_PASSENGER ) )
      //{
      //	RemoveSoldierFromVehicle( MercPtrs[ i ], MercPtrs[ i ]->bVehicleID );
      //}

      if (MercPtrs[i].ubStrategicInsertionCode == Enum175.INSERTION_CODE_PRIMARY_EDGEINDEX || MercPtrs[i].ubStrategicInsertionCode == Enum175.INSERTION_CODE_SECONDARY_EDGEINDEX) {
        MercPtrs[i].ubStrategicInsertionCode = MercPtrs[i].usStrategicInsertionData;
      }
      gMercPlacement[giPlacements].pSoldier = MercPtrs[i];
      gMercPlacement[giPlacements].ubStrategicInsertionCode = MercPtrs[i].ubStrategicInsertionCode;
      gMercPlacement[giPlacements].fPlaced = false;
      switch (MercPtrs[i].ubStrategicInsertionCode) {
        case Enum175.INSERTION_CODE_NORTH:
          gfNorth = true;
          break;
        case Enum175.INSERTION_CODE_EAST:
          gfEast = true;
          break;
        case Enum175.INSERTION_CODE_SOUTH:
          gfSouth = true;
          break;
        case Enum175.INSERTION_CODE_WEST:
          gfWest = true;
          break;
      }
      giPlacements++;
    }
  }
  // add all the faces now
  for (i = 0; i < giPlacements; i++) {
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;

    // Load the faces
    {
      ubFaceIndex = gMercProfiles[gMercPlacement[i].pSoldier.ubProfile].ubFaceIndex;
      if (ubFaceIndex < 100)
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%02d.sti", ubFaceIndex);
      else
        VObjectDesc.ImageFile = sprintf("Faces\\65Face\\%03d.sti", ubFaceIndex);
    }

    if (!(gMercPlacement[i].uiVObjectID = AddVideoObject(VObjectDesc))) {
      VObjectDesc.ImageFile = "Faces\\65Face\\speck.sti";
      if (!(gMercPlacement[i].uiVObjectID = AddVideoObject(VObjectDesc))) {
        AssertMsg(0, FormatString("Failed to load %Faces\\65Face\\%03d.sti or it's placeholder, speck.sti", gMercProfiles[gMercPlacement[i].pSoldier.ubProfile].ubFaceIndex));
      }
    }
    xp = 91 + (i / 2) * 54;
    yp = (i % 2) ? 412 : 361;
    MSYS_DefineRegion(gMercPlacement[i].region, xp, yp, (xp + 54), (yp + 62), MSYS_PRIORITY_HIGH, 0, MercMoveCallback, MercClickCallback);
  }

  PlaceMercs();

  if (gubDefaultButton == Enum310.GROUP_BUTTON) {
    ButtonList[iTPButtons[Enum310.GROUP_BUTTON]].uiFlags |= BUTTON_CLICKED_ON;
    for (i = 0; i < giPlacements; i++) {
      // go from the currently selected soldier to the end
      if (!gMercPlacement[i].fPlaced) {
        // Found an unplaced merc.  Select him.
        gbSelectedMercID = i;
        if (gubDefaultButton == Enum310.GROUP_BUTTON)
          gubSelectedGroupID = gMercPlacement[i].pSoldier.ubGroupID;
        gfTacticalPlacementGUIDirty = true;
        SetCursorMerc(i);
        gpTacticalPlacementSelectedSoldier = gMercPlacement[i].pSoldier;
        break;
      }
    }
  }
}

function RenderTacticalPlacementGUI(): void {
  let i: INT32;
  let xp: INT32;
  let yp: INT32;
  let width: INT32;
  let height: INT32;
  let iStartY: INT32;
  let pSoldier: SOLDIERTYPE;
  let uiDestPitchBYTES: UINT32 = 0;
  let usHatchColor: UINT16;
  let str: string /* UINT16[128] */;
  let pDestBuf: Uint8ClampedArray;
  let ubColor: UINT8;
  if (gfTacticalPlacementFirstTime) {
    gfTacticalPlacementFirstTime = false;
    DisableScrollMessages();
  }
  // Check to make sure that if we have a hilighted merc (not selected) and the mouse has moved out
  // of it's region, then we will clear the hilighted ID, and refresh the display.
  if (!gfTacticalPlacementGUIDirty && gbHilightedMercID != -1) {
    xp = 91 + (gbHilightedMercID / 2) * 54;
    yp = (gbHilightedMercID % 2) ? 412 : 361;
    if (gusMouseXPos < xp || gusMouseXPos > xp + 54 || gusMouseYPos < yp || gusMouseYPos > yp + 62) {
      gbHilightedMercID = -1;
      gubHilightedGroupID = 0;
      SetCursorMerc(gbSelectedMercID);
      gpTacticalPlacementHilightedSoldier = null;
    }
  }
  // If the display is dirty render the entire panel.
  if (gfTacticalPlacementGUIDirty) {
    BltVideoObjectFromIndex(FRAME_BUFFER, giOverheadPanelImage, 0, 0, 320, VO_BLT_SRCTRANSPARENCY, null);
    InvalidateRegion(0, 0, 320, 480);
    gfTacticalPlacementGUIDirty = false;
    MarkButtonsDirty();
    // DisableHilightsAndHelpText();
    // RenderButtons();
    // EnableHilightsAndHelpText();
    for (i = 0; i < giPlacements; i++) {
      // Render the mercs
      pSoldier = gMercPlacement[i].pSoldier;
      xp = 95 + (i / 2) * 54;
      yp = (i % 2) ? 422 : 371;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 36, yp + 2, xp + 44, yp + 30, 0);
      BltVideoObjectFromIndex(FRAME_BUFFER, giMercPanelImage, 0, xp, yp, VO_BLT_SRCTRANSPARENCY, null);
      BltVideoObjectFromIndex(FRAME_BUFFER, gMercPlacement[i].uiVObjectID, 0, xp + 2, yp + 2, VO_BLT_SRCTRANSPARENCY, null);
      // HEALTH BAR
      if (!pSoldier.bLife)
        continue;
      // yellow one for bleeding
      iStartY = yp + 29 - 27 * pSoldier.bLifeMax / 100;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 36, iStartY, xp + 37, yp + 29, Get16BPPColor(FROMRGB(107, 107, 57)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 37, iStartY, xp + 38, yp + 29, Get16BPPColor(FROMRGB(222, 181, 115)));
      // pink one for bandaged.
      iStartY += 27 * pSoldier.bBleeding / 100;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 36, iStartY, xp + 37, yp + 29, Get16BPPColor(FROMRGB(156, 57, 57)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 37, iStartY, xp + 38, yp + 29, Get16BPPColor(FROMRGB(222, 132, 132)));
      // red one for actual health
      iStartY = yp + 29 - 27 * pSoldier.bLife / 100;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 36, iStartY, xp + 37, yp + 29, Get16BPPColor(FROMRGB(107, 8, 8)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 37, iStartY, xp + 38, yp + 29, Get16BPPColor(FROMRGB(206, 0, 0)));
      // BREATH BAR
      iStartY = yp + 29 - 27 * pSoldier.bBreathMax / 100;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 39, iStartY, xp + 40, yp + 29, Get16BPPColor(FROMRGB(8, 8, 132)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 40, iStartY, xp + 41, yp + 29, Get16BPPColor(FROMRGB(8, 8, 107)));
      // MORALE BAR
      iStartY = yp + 29 - 27 * pSoldier.bMorale / 100;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 42, iStartY, xp + 43, yp + 29, Get16BPPColor(FROMRGB(8, 156, 8)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, xp + 43, iStartY, xp + 44, yp + 29, Get16BPPColor(FROMRGB(8, 107, 8)));
    }
    SetFont(BLOCKFONT());
    SetFontForeground(FONT_BEIGE);
    SetFontShadow(141);

    str = GetSectorIDString(gubPBSectorX, gubPBSectorY, gubPBSectorZ, true);

    mprintf(120, 335, "%s %s -- %s...", gpStrategicString[Enum365.STR_TP_SECTOR], str, gpStrategicString[Enum365.STR_TP_CHOOSEENTRYPOSITIONS]);

    // Shade out the part of the tactical map that isn't considered placable.
    BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 320, 640, 160);
  }
  if (gfValidLocationsChanged) {
    if (DayTime()) {
      // 6AM to 9PM is black
      usHatchColor = 0; // Black
    } else {
      // 9PM to 6AM is gray (black is too dark to distinguish)
      usHatchColor = Get16BPPColor(FROMRGB(63, 31, 31));
    }
    gfValidLocationsChanged--;
    BlitBufferToBuffer(guiSAVEBUFFER, FRAME_BUFFER, 4, 4, 636, 320);
    InvalidateRegion(4, 4, 636, 320);
    if (gbCursorMercID == -1) {
      gTPClipRect.iLeft = gfWest ? 30 : 4;
      gTPClipRect.iTop = gfNorth ? 30 : 4;
      gTPClipRect.iRight = gfEast ? 610 : 636;
      gTPClipRect.iBottom = gfSouth ? 290 : 320;
    } else {
      gTPClipRect.iLeft = 4;
      gTPClipRect.iTop = 4;
      gTPClipRect.iRight = 636;
      gTPClipRect.iBottom = 320;
      switch (gMercPlacement[gbCursorMercID].ubStrategicInsertionCode) {
        case Enum175.INSERTION_CODE_NORTH:
          gTPClipRect.iTop = 30;
          break;
        case Enum175.INSERTION_CODE_EAST:
          gTPClipRect.iRight = 610;
          break;
        case Enum175.INSERTION_CODE_SOUTH:
          gTPClipRect.iBottom = 290;
          break;
        case Enum175.INSERTION_CODE_WEST:
          gTPClipRect.iLeft = 30;
          break;
      }
    }
    pDestBuf = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
    Blt16BPPBufferLooseHatchRectWithColor(pDestBuf, uiDestPitchBYTES, gTPClipRect, usHatchColor);
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
    RectangleDraw(true, gTPClipRect.iLeft, gTPClipRect.iTop, gTPClipRect.iRight, gTPClipRect.iBottom, usHatchColor, pDestBuf);
    UnLockVideoSurface(FRAME_BUFFER);
  }
  for (i = 0; i < giPlacements; i++) {
    // Render the merc's names
    pSoldier = gMercPlacement[i].pSoldier;
    xp = 95 + (i / 2) * 54;
    yp = (i % 2) ? 422 : 371;
    // NAME
    if (gubDefaultButton == Enum310.GROUP_BUTTON && gMercPlacement[i].pSoldier.ubGroupID == gubSelectedGroupID || gubDefaultButton != Enum310.GROUP_BUTTON && i == gbSelectedMercID) {
      ubColor = FONT_YELLOW;
    } else if (gubDefaultButton == Enum310.GROUP_BUTTON && gMercPlacement[i].pSoldier.ubGroupID == gubHilightedGroupID || gubDefaultButton != Enum310.GROUP_BUTTON && i == gbHilightedMercID) {
      ubColor = FONT_WHITE;
    } else {
      ubColor = FONT_GRAY3;
    }
    SetFont(FONT10ARIALBOLD());
    SetFontForeground(ubColor);
    SetFontShadow(141);
    // Render the question mark over the face if the merc hasn't yet been placed.
    if (gMercPlacement[i].fPlaced) {
      RegisterBackgroundRect(BGND_FLAG_SINGLE, null, (xp + 16), (yp + 14), (xp + 24), (yp + 22));
    } else {
      mprintf(xp + 16, yp + 14, "?");
      InvalidateRegion(xp + 16, yp + 14, xp + 24, yp + 22);
    }
    SetFont(BLOCKFONT());
    width = StringPixLength(pSoldier.name, BLOCKFONT());
    height = GetFontHeight(BLOCKFONT());
    xp = xp + (48 - width) / 2;
    yp = yp + 33;
    mprintf(xp, yp, pSoldier.name);
    InvalidateRegion(xp, yp, xp + width, yp + width);
  }
}

function EnsureDoneButtonStatus(): void {
  let i: INT32;
  // static BOOLEAN fInside = FALSE;
  // BOOLEAN fChanged = FALSE;
  for (i = 0; i < giPlacements; i++) {
    if (!gMercPlacement[i].fPlaced) {
      if (ButtonList[iTPButtons[Enum310.DONE_BUTTON]].uiFlags & BUTTON_ENABLED) {
        DisableButton(iTPButtons[Enum310.DONE_BUTTON]);
        SetButtonFastHelpText(iTPButtons[Enum310.DONE_BUTTON], gpStrategicString[Enum365.STR_TP_DISABLED_DONEHELP]);
      }
      return;
    }
  }
  if (!(ButtonList[iTPButtons[Enum310.DONE_BUTTON]].uiFlags & BUTTON_ENABLED)) {
    // only enable it when it is disabled, otherwise the button will stay down!
    EnableButton(iTPButtons[Enum310.DONE_BUTTON]);
    SetButtonFastHelpText(iTPButtons[Enum310.DONE_BUTTON], gpStrategicString[Enum365.STR_TP_DONEHELP]);
  }
}

export function TacticalPlacementHandle(): void {
  let InputEvent: InputAtom = createInputAtom();

  EnsureDoneButtonStatus();

  RenderTacticalPlacementGUI();

  if (gfRightButtonState) {
    gbSelectedMercID = -1;
    gubSelectedGroupID = 0;
    gpTacticalPlacementSelectedSoldier = null;
  }

  while (DequeueEvent(InputEvent)) {
    if (InputEvent.usEvent == KEY_DOWN) {
      switch (InputEvent.usParam) {
        case ENTER:
          if (ButtonList[iTPButtons[Enum310.DONE_BUTTON]].uiFlags & BUTTON_ENABLED) {
            KillTacticalPlacementGUI();
          }
          break;
        case 'c'.charCodeAt(0):
          ClearPlacementsCallback(ButtonList[iTPButtons[Enum310.CLEAR_BUTTON]], MSYS_CALLBACK_REASON_LBUTTON_UP);
          break;
        case 'g'.charCodeAt(0):
          GroupPlacementsCallback(ButtonList[iTPButtons[Enum310.GROUP_BUTTON]], MSYS_CALLBACK_REASON_LBUTTON_UP);
          break;
        case 's'.charCodeAt(0):
          SpreadPlacementsCallback(ButtonList[iTPButtons[Enum310.SPREAD_BUTTON]], MSYS_CALLBACK_REASON_LBUTTON_UP);
          break;
        case 'x'.charCodeAt(0):
          if (InputEvent.usKeyState & ALT_DOWN) {
            HandleShortCutExitState();
          }
          break;
      }
    }
  }
  gfValidCursor = false;
  if (gbSelectedMercID != -1 && gusMouseYPos < 320) {
    switch (gMercPlacement[gbCursorMercID].ubStrategicInsertionCode) {
      case Enum175.INSERTION_CODE_NORTH:
        if (gusMouseYPos <= 40)
          gfValidCursor = true;
        break;
      case Enum175.INSERTION_CODE_EAST:
        if (gusMouseXPos >= 600)
          gfValidCursor = true;
        break;
      case Enum175.INSERTION_CODE_SOUTH:
        if (gusMouseYPos >= 280)
          gfValidCursor = true;
        break;
      case Enum175.INSERTION_CODE_WEST:
        if (gusMouseXPos <= 40)
          gfValidCursor = true;
        break;
    }
    if (gubDefaultButton == Enum310.GROUP_BUTTON) {
      if (gfValidCursor) {
        SetCurrentCursorFromDatabase(Enum317.CURSOR_PLACEGROUP);
      } else {
        SetCurrentCursorFromDatabase(Enum317.CURSOR_DPLACEGROUP);
      }
    } else {
      if (gfValidCursor) {
        SetCurrentCursorFromDatabase(Enum317.CURSOR_PLACEMERC);
      } else {
        SetCurrentCursorFromDatabase(Enum317.CURSOR_DPLACEMERC);
      }
    }
  } else {
    SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);
  }
  if (gfKillTacticalGUI == 1) {
    KillTacticalPlacementGUI();
  } else if (gfKillTacticalGUI == 2) {
    gfKillTacticalGUI = 1;
  }
}

function KillTacticalPlacementGUI(): void {
  let i: INT32;

  gbHilightedMercID = -1;
  gbSelectedMercID = -1;
  gubSelectedGroupID = 0;
  gubHilightedGroupID = 0;
  gbCursorMercID = -1;
  gpTacticalPlacementHilightedSoldier = null;
  gpTacticalPlacementSelectedSoldier = null;

  // Destroy the tactical placement gui.
  gfEnterTacticalPlacementGUI = false;
  gfTacticalPlacementGUIActive = false;
  gfKillTacticalGUI = 0;
  // Delete video objects
  DeleteVideoObjectFromIndex(giOverheadPanelImage);
  DeleteVideoObjectFromIndex(giMercPanelImage);
  // Delete buttons
  for (i = 0; i < Enum310.NUM_TP_BUTTONS; i++) {
    UnloadButtonImage(giOverheadButtonImages[i]);
    RemoveButton(iTPButtons[i]);
  }
  // Delete faces and regions
  for (i = 0; i < giPlacements; i++) {
    DeleteVideoObjectFromIndex(gMercPlacement[i].uiVObjectID);
    MSYS_RemoveRegion(gMercPlacement[i].region);
  }

  if (gsCurInterfacePanel < 0 || gsCurInterfacePanel >= Enum215.NUM_UI_PANELS)
    gsCurInterfacePanel = Enum215.TEAM_PANEL;

  SetCurrentInterfacePanel(gsCurInterfacePanel);

  // Leave the overhead map.
  KillOverheadMap();
  // Recreate the tactical panel.
  MSYS_EnableRegion(gRadarRegion);
  SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
  // Initialize the rest of the map (AI, enemies, civs, etc.)

  for (i = 0; i < giPlacements; i++) {
    PickUpMercPiece(i);
  }

  PrepareLoadedSector();
  EnableScrollMessages();
}

function ChooseRandomEdgepoints(): void {
  let i: INT32;
  for (i = 0; i < giPlacements; i++) {
    if (!(gMercPlacement[i].pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
      gMercPlacement[i].pSoldier.usStrategicInsertionData = ChooseMapEdgepoint(gMercPlacement[i].ubStrategicInsertionCode);
      if (gMercPlacement[i].pSoldier.usStrategicInsertionData != NOWHERE) {
        gMercPlacement[i].pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      } else {
        if (gMercPlacement[i].pSoldier.usStrategicInsertionData < 0 || gMercPlacement[i].pSoldier.usStrategicInsertionData > WORLD_MAX) {
          i = i;
        }
        gMercPlacement[i].pSoldier.ubStrategicInsertionCode = gMercPlacement[i].ubStrategicInsertionCode;
      }
    }

    PutDownMercPiece(i);
  }
  gfEveryonePlaced = true;
}

function PlaceMercs(): void {
  let i: INT32;
  switch (gubDefaultButton) {
    case Enum310.SPREAD_BUTTON: // Place mercs randomly along their side using map edgepoints.
      ChooseRandomEdgepoints();
      break;
    case Enum310.CLEAR_BUTTON:
      for (i = 0; i < giPlacements; i++) {
        PickUpMercPiece(i);
      }
      gubSelectedGroupID = 0;
      gbSelectedMercID = 0;
      SetCursorMerc(0);
      gfEveryonePlaced = false;
      break;
    default:
      return;
  }
  gfTacticalPlacementGUIDirty = true;
}

function DoneOverheadPlacementClickCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfKillTacticalGUI = 2;
  }
}

function SpreadPlacementsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubDefaultButton = Enum310.SPREAD_BUTTON;
    ButtonList[iTPButtons[Enum310.GROUP_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iTPButtons[Enum310.GROUP_BUTTON]].uiFlags |= BUTTON_DIRTY;
    PlaceMercs();
    gubSelectedGroupID = 0;
    gbSelectedMercID = -1;
    SetCursorMerc(-1);
  }
}

function GroupPlacementsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubDefaultButton == Enum310.GROUP_BUTTON) {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;
      btn.uiFlags |= BUTTON_DIRTY;
      gubDefaultButton = Enum310.CLEAR_BUTTON;
      gubSelectedGroupID = 0;
    } else {
      btn.uiFlags |= BUTTON_CLICKED_ON | BUTTON_DIRTY;
      gubDefaultButton = Enum310.GROUP_BUTTON;
      gbSelectedMercID = 0;
      SetCursorMerc(gbSelectedMercID);
      gubSelectedGroupID = gMercPlacement[gbSelectedMercID].pSoldier.ubGroupID;
    }
  }
}

function ClearPlacementsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ButtonList[iTPButtons[Enum310.GROUP_BUTTON]].uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[iTPButtons[Enum310.GROUP_BUTTON]].uiFlags |= BUTTON_DIRTY;
    gubDefaultButton = Enum310.CLEAR_BUTTON;
    PlaceMercs();
  }
}

function MercMoveCallback(reg: MOUSE_REGION, reason: INT32): void {
  if (reg.uiFlags & MSYS_MOUSE_IN_AREA) {
    let i: INT8;
    for (i = 0; i < giPlacements; i++) {
      if (gMercPlacement[i].region == reg) {
        if (gbHilightedMercID != i) {
          gbHilightedMercID = i;
          if (gubDefaultButton == Enum310.GROUP_BUTTON)
            gubHilightedGroupID = gMercPlacement[i].pSoldier.ubGroupID;
          SetCursorMerc(i);
          gpTacticalPlacementHilightedSoldier = gMercPlacement[i].pSoldier;
        }
        return;
      }
    }
  }
}

function MercClickCallback(reg: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    let i: INT8;
    for (i = 0; i < giPlacements; i++) {
      if (gMercPlacement[i].region == reg) {
        if (gbSelectedMercID != i) {
          gbSelectedMercID = i;
          gpTacticalPlacementSelectedSoldier = gMercPlacement[i].pSoldier;
          if (gubDefaultButton == Enum310.GROUP_BUTTON) {
            gubSelectedGroupID = gpTacticalPlacementSelectedSoldier.ubGroupID;
          }
        }
        return;
      }
    }
  }
}

function SelectNextUnplacedUnit(): void {
  let i: INT32;
  if (gbSelectedMercID == -1)
    return;
  for (i = gbSelectedMercID; i < giPlacements; i++) {
    // go from the currently selected soldier to the end
    if (!gMercPlacement[i].fPlaced) {
      // Found an unplaced merc.  Select him.
      gbSelectedMercID = i;
      if (gubDefaultButton == Enum310.GROUP_BUTTON)
        gubSelectedGroupID = gMercPlacement[i].pSoldier.ubGroupID;
      gfTacticalPlacementGUIDirty = true;
      SetCursorMerc(i);
      gpTacticalPlacementSelectedSoldier = gMercPlacement[i].pSoldier;
      return;
    }
  }
  for (i = 0; i < gbSelectedMercID; i++) {
    // go from the beginning to the currently selected soldier
    if (!gMercPlacement[i].fPlaced) {
      // Found an unplaced merc.  Select him.
      gbSelectedMercID = i;
      if (gubDefaultButton == Enum310.GROUP_BUTTON)
        gubSelectedGroupID = gMercPlacement[i].pSoldier.ubGroupID;
      gfTacticalPlacementGUIDirty = true;
      SetCursorMerc(i);
      gpTacticalPlacementSelectedSoldier = gMercPlacement[i].pSoldier;
      return;
    }
  }
  // checked the whole array, and everybody has been placed.  Select nobody.
  if (!gfEveryonePlaced) {
    gfEveryonePlaced = true;
    SetCursorMerc(-1);
    gbSelectedMercID = -1;
    gubSelectedGroupID = 0;
    gfTacticalPlacementGUIDirty = true;
    gfValidLocationsChanged = 1;
    gpTacticalPlacementSelectedSoldier = gMercPlacement[i].pSoldier;
  }
}

export function HandleTacticalPlacementClicksInOverheadMap(reg: MOUSE_REGION, reason: INT32): void {
  let i: INT32;
  let sGridNo: INT16 = 0;
  let fInvalidArea: boolean = false;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // if we have a selected merc, move him to the new closest map edgepoint of his side.
    if (gfValidCursor) {
      if (gbSelectedMercID != -1) {
        if (GetOverheadMouseGridNo(createPointer(() => sGridNo, (v) => sGridNo = v))) {
          // we have clicked within a valid part of the map.
          BeginMapEdgepointSearch();

          if (gubDefaultButton == Enum310.GROUP_BUTTON) {
            // We are placing a whole group.
            for (i = 0; i < giPlacements; i++) {
              // Find locations of each member of the group, but don't place them yet.  If
              // one of the mercs can't be placed, then we won't place any, and tell the user
              // the problem.  If everything's okay, we will place them all.
              if (gMercPlacement[i].pSoldier.ubGroupID == gubSelectedGroupID) {
                gMercPlacement[i].pSoldier.usStrategicInsertionData = SearchForClosestPrimaryMapEdgepoint(sGridNo, gMercPlacement[i].ubStrategicInsertionCode);
                if (gMercPlacement[i].pSoldier.usStrategicInsertionData == NOWHERE) {
                  fInvalidArea = true;
                  break;
                }
              }
            }
            if (!fInvalidArea) {
              // One or more of the mercs in the group didn't get gridno assignments, so we
              // report an error.
              for (i = 0; i < giPlacements; i++) {
                gMercPlacement[i].pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
                if (gMercPlacement[i].pSoldier.ubGroupID == gubSelectedGroupID) {
                  PutDownMercPiece(i);
                }
              }
            }
          } else {
            // This is a single merc placement.  If valid, then place him, else report error.
            gMercPlacement[gbSelectedMercID].pSoldier.usStrategicInsertionData = SearchForClosestPrimaryMapEdgepoint(sGridNo, gMercPlacement[gbSelectedMercID].ubStrategicInsertionCode);
            if (gMercPlacement[gbSelectedMercID].pSoldier.usStrategicInsertionData != NOWHERE) {
              gMercPlacement[gbSelectedMercID].pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
              PutDownMercPiece(gbSelectedMercID);
            } else {
              fInvalidArea = true;
            }

            // gbSelectedMercID++;
            // if( gbSelectedMercID == giPlacements )
            //	gbSelectedMercID = 0;
            // gpTacticalPlacementSelectedSoldier = gMercPlacement[ gbSelectedMercID ].pSoldier;
            gfTacticalPlacementGUIDirty = true;
            // SetCursorMerc( gbSelectedMercID );
          }
          EndMapEdgepointSearch();

          if (fInvalidArea) {
            // Report error due to invalid placement.
            let CenterRect: SGPRect = createSGPRectFrom(220, 120, 420, 200);
            DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gpStrategicString[Enum365.STR_TP_INACCESSIBLE_MESSAGE], guiCurrentScreen, MSG_BOX_FLAG_OK | MSG_BOX_FLAG_USE_CENTERING_RECT, DialogRemoved, CenterRect);
          } else {
            // Placement successful, so select the next unplaced unit (single or group).
            SelectNextUnplacedUnit();
          }
        }
      }
    } else {
      // not a valid cursor location...
      if (gbCursorMercID != -1) {
        let CenterRect: SGPRect = createSGPRectFrom(220, 120, 420, 200);
        DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gpStrategicString[Enum365.STR_TP_INVALID_MESSAGE], guiCurrentScreen, MSG_BOX_FLAG_OK | MSG_BOX_FLAG_USE_CENTERING_RECT, DialogRemoved, CenterRect);
      }
    }
  }
}

function SetCursorMerc(bPlacementID: INT8): void {
  if (gbCursorMercID != bPlacementID) {
    if (gbCursorMercID == -1 || bPlacementID == -1 || gMercPlacement[gbCursorMercID].ubStrategicInsertionCode != gMercPlacement[bPlacementID].ubStrategicInsertionCode)
      gfValidLocationsChanged = 1;
    gbCursorMercID = bPlacementID;
  }
}

function PutDownMercPiece(iPlacement: INT32): void {
  let sGridNo: INT16;
  let sCellX: INT16;
  let sCellY: INT16;
  let ubDirection: UINT8 = 0;

  let pSoldier: SOLDIERTYPE;
  pSoldier = gMercPlacement[iPlacement].pSoldier;
  switch (pSoldier.ubStrategicInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      pSoldier.sInsertionGridNo = gMapInformation.sNorthGridNo;
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      pSoldier.sInsertionGridNo = gMapInformation.sSouthGridNo;
      break;
    case Enum175.INSERTION_CODE_EAST:
      pSoldier.sInsertionGridNo = gMapInformation.sEastGridNo;
      break;
    case Enum175.INSERTION_CODE_WEST:
      pSoldier.sInsertionGridNo = gMapInformation.sWestGridNo;
      break;
    case Enum175.INSERTION_CODE_GRIDNO:
      pSoldier.sInsertionGridNo = pSoldier.usStrategicInsertionData;
      break;
    default:
      Assert(0);
      break;
  }
  if (gMercPlacement[iPlacement].fPlaced)
    PickUpMercPiece(iPlacement);
  sGridNo = FindGridNoFromSweetSpot(pSoldier, pSoldier.sInsertionGridNo, 4, createPointer(() => ubDirection, (v) => ubDirection = v));
  if (sGridNo != NOWHERE) {
    ({ sCellX, sCellY } = ConvertGridNoToCellXY(sGridNo));
    EVENT_SetSoldierPosition(pSoldier, sCellX, sCellY);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);
    pSoldier.ubInsertionDirection = pSoldier.bDirection;
    gMercPlacement[iPlacement].fPlaced = true;
    gMercPlacement[iPlacement].pSoldier.bInSector = true;
  }
}

function PickUpMercPiece(iPlacement: INT32): void {
  RemoveSoldierFromGridNo(gMercPlacement[iPlacement].pSoldier);
  gMercPlacement[iPlacement].fPlaced = false;
  gMercPlacement[iPlacement].pSoldier.bInSector = false;
}

function FastHelpRemovedCallback(): void {
  gfTacticalPlacementGUIDirty = true;
}

function FastHelpRemoved2Callback(): void {
  gfTacticalPlacementGUIDirty = true;
  gfValidLocationsChanged = 2; // because fast help text covers it.
}

function DialogRemoved(ubResult: UINT8): void {
  gfTacticalPlacementGUIDirty = true;
  gfValidLocationsChanged = 1;
}

}
