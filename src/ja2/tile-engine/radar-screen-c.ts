// the squad list font
const SQUAD_FONT = () => COMPFONT();

const SQUAD_REGION_HEIGHT = 2 * RADAR_WINDOW_HEIGHT;
const SQUAD_WINDOW_TM_Y = () => RADAR_WINDOW_TM_Y + GetFontHeight(SQUAD_FONT());

// subtractor for squad list from size of radar view region height
const SUBTRACTOR_FOR_SQUAD_LIST = 0;

let gsRadarX: INT16;
let gsRadarY: INT16;
let gusRadarImage: UINT32;
let fImageLoaded: boolean = false;
let fRenderRadarScreen: boolean = true;
let sSelectedSquadLine: INT16 = -1;

let gfRadarCurrentGuyFlash: boolean = false;

let gRadarRegionSquadList: MOUSE_REGION[] /* [NUMBER_OF_SQUADS] */;

function InitRadarScreen(): boolean {
  // Add region for radar
  MSYS_DefineRegion(addressof(gRadarRegion), RADAR_WINDOW_X, RADAR_WINDOW_TM_Y, RADAR_WINDOW_X + RADAR_WINDOW_WIDTH, RADAR_WINDOW_TM_Y + RADAR_WINDOW_HEIGHT, MSYS_PRIORITY_HIGHEST, 0, RadarRegionMoveCallback, RadarRegionButtonCallback);

  // Add region
  MSYS_AddRegion(addressof(gRadarRegion));

  // disable the radar map
  MSYS_DisableRegion(addressof(gRadarRegion));

  gsRadarX = RADAR_WINDOW_X;
  gsRadarY = RADAR_WINDOW_TM_Y;

  return true;
}

function LoadRadarScreenBitmap(aFilename: Pointer<CHAR8>): boolean {
  let VObjectDesc: VOBJECT_DESC;
  let zFilename: CHAR8[] /* [260] */;
  let cnt: INT32;
  let hVObject: HVOBJECT;

  strcpy(zFilename, aFilename);

  // If we have loaded, remove old one
  if (fImageLoaded) {
    DeleteVideoObjectFromIndex(gusRadarImage);

    fImageLoaded = false;
  }

  /* ARM - Restriction removed Nov.29/98.  Must be able to view different radar maps from map screen while underground!
           // If we are in a cave or basement..... dont get a new one...
           if( !gfBasement && !gfCaves )
  */
  {
    // Remove extension
    for (cnt = strlen(zFilename) - 1; cnt >= 0; cnt--) {
      if (zFilename[cnt] == '.') {
        zFilename[cnt] = '\0';
      }
    }

    // Grab the Map image
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    sprintf(VObjectDesc.ImageFile, "RADARMAPS\\%s.STI", zFilename);

    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(gusRadarImage)));

    fImageLoaded = true;

    if (GetVideoObject(addressof(hVObject), gusRadarImage)) {
      // ATE: Add a shade table!
      hVObject.value.pShades[0] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 255, 255, 255, false);
      hVObject.value.pShades[1] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 100, 100, 100, false);
    }
  }

  // Dirty interface
  fInterfacePanelDirty = true;

  return true;
}

function ClearOutRadarMapImage(): void {
  // If we have loaded, remove old one
  if (fImageLoaded) {
    DeleteVideoObjectFromIndex(gusRadarImage);
    fImageLoaded = false;
  }
}

function MoveRadarScreen(): void {
  // check if we are allowed to do anything?
  if (fRenderRadarScreen == false) {
    return;
  }

  // Remove old region
  MSYS_RemoveRegion(addressof(gRadarRegion));

  // Add new one

  // Move based on inventory panel
  if (gsCurInterfacePanel == Enum215.SM_PANEL) {
    gsRadarY = RADAR_WINDOW_TM_Y;
  } else {
    gsRadarY = RADAR_WINDOW_TM_Y;
  }

  // Add region for radar
  MSYS_DefineRegion(addressof(gRadarRegion), RADAR_WINDOW_X, (gsRadarY), RADAR_WINDOW_X + RADAR_WINDOW_WIDTH, (gsRadarY + RADAR_WINDOW_HEIGHT), MSYS_PRIORITY_HIGHEST, 0, RadarRegionMoveCallback, RadarRegionButtonCallback);

  // Add region
  MSYS_AddRegion(addressof(gRadarRegion));
}

function RadarRegionMoveCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let sRadarX: INT16;
  let sRadarY: INT16;

  // check if we are allowed to do anything?
  if (fRenderRadarScreen == false) {
    return;
  }

  if (iReason == MSYS_CALLBACK_REASON_MOVE) {
    if (pRegion.value.ButtonState & MSYS_LEFT_BUTTON) {
      // Use relative coordinates to set center of viewport
      sRadarX = pRegion.value.RelativeXPos - (RADAR_WINDOW_WIDTH / 2);
      sRadarY = pRegion.value.RelativeYPos - (RADAR_WINDOW_HEIGHT / 2);

      AdjustWorldCenterFromRadarCoords(sRadarX, sRadarY);

      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }
}

function RadarRegionButtonCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let sRadarX: INT16;
  let sRadarY: INT16;

  // check if we are allowed to do anything?
  if (fRenderRadarScreen == false) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!InOverheadMap()) {
      // Use relative coordinates to set center of viewport
      sRadarX = pRegion.value.RelativeXPos - (RADAR_WINDOW_WIDTH / 2);
      sRadarY = pRegion.value.RelativeYPos - (RADAR_WINDOW_HEIGHT / 2);

      AdjustWorldCenterFromRadarCoords(sRadarX, sRadarY);
    } else {
      KillOverheadMap();
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (!InOverheadMap()) {
      GoIntoOverheadMap();
    } else {
      KillOverheadMap();
    }
  }
}

function RenderRadarScreen(): void {
  let sRadarTLX: INT16;
  let sRadarTLY: INT16;
  let sRadarBRX: INT16;
  let sRadarBRY: INT16;
  let sRadarCX: INT16;
  let sRadarCY: INT16;
  let iItemNumber: INT32 = 0;

  let sX_S: INT16;
  let sY_S: INT16;
  let sScreenCenterX: INT16;
  let sScreenCenterY: INT16;
  let sDistToCenterY: INT16;
  let sDistToCenterX: INT16;
  let sTopLeftWorldX: INT16;
  let sTopLeftWorldY: INT16;
  let sTopRightWorldX: INT16;
  let sTopRightWorldY: INT16;
  let sBottomLeftWorldX: INT16;
  let sBottomLeftWorldY: INT16;
  let sBottomRightWorldX: INT16;
  let sBottomRightWorldY: INT16;

  let pSoldier: Pointer<SOLDIERTYPE>;

  let sXSoldPos: INT16;
  let sYSoldPos: INT16;
  let sXSoldScreen: INT16;
  let sYSoldScreen: INT16;
  let sXSoldRadar: INT16;
  let sYSoldRadar: INT16;

  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;
  let cnt: UINT32;
  let sHeight: INT16;
  let sWidth: INT16;
  let sX: INT16;
  let sY: INT16;
  let iCounter: INT32 = 0;

  // create / destroy squad list regions as nessacary
  CreateDestroyMouseRegionsForSquadList();

  // check if we are allowed to do anything?
  if (fRenderRadarScreen == false) {
    RenderSquadList();
    return;
  }

  if (AreInMeanwhile() == true) {
    // in a meanwhile, don't render any map
    fImageLoaded = false;
  }

  if (fInterfacePanelDirty == DIRTYLEVEL2 && fImageLoaded) {
    // Set to default
    SetObjectHandleShade(gusRadarImage, 0);

    // If night time and on surface, darken the radarmap.
    if (NightTime()) {
      if (guiCurrentScreen == Enum26.MAP_SCREEN && !iCurrentMapSectorZ || guiCurrentScreen == Enum26.GAME_SCREEN && !gbWorldSectorZ) {
        SetObjectHandleShade(gusRadarImage, 1);
      }
    }

    BltVideoObjectFromIndex(guiSAVEBUFFER, gusRadarImage, 0, RADAR_WINDOW_X, gsRadarY, VO_BLT_SRCTRANSPARENCY, null);
  }

  // FIRST DELETE WHAT'S THERE
  RestoreExternBackgroundRect(RADAR_WINDOW_X, gsRadarY, RADAR_WINDOW_WIDTH + 1, RADAR_WINDOW_HEIGHT + 1);

  // Determine scale factors

  // Find the diustance from render center to true world center
  sDistToCenterX = gsRenderCenterX - gCenterWorldX;
  sDistToCenterY = gsRenderCenterY - gCenterWorldY;

  // From render center in world coords, convert to render center in "screen" coords
  FromCellToScreenCoordinates(sDistToCenterX, sDistToCenterY, addressof(sScreenCenterX), addressof(sScreenCenterY));

  // Subtract screen center
  sScreenCenterX += gsCX;
  sScreenCenterY += gsCY;

  // Get corners in screen coords
  // TOP LEFT
  sX_S = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
  sY_S = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

  sTopLeftWorldX = sScreenCenterX - sX_S;
  sTopLeftWorldY = sScreenCenterY - sY_S;

  sTopRightWorldX = sScreenCenterX + sX_S;
  sTopRightWorldY = sScreenCenterY - sY_S;

  sBottomLeftWorldX = sScreenCenterX - sX_S;
  sBottomLeftWorldY = sScreenCenterY + sY_S;

  sBottomRightWorldX = sScreenCenterX + sX_S;
  sBottomRightWorldY = sScreenCenterY + sY_S;

  // Determine radar coordinates
  sRadarCX = (gsCX * gdScaleX);
  sRadarCY = (gsCY * gdScaleY);

  sWidth = (RADAR_WINDOW_WIDTH);
  sHeight = (RADAR_WINDOW_HEIGHT);
  sX = RADAR_WINDOW_X;
  sY = gsRadarY;

  sRadarTLX = ((sTopLeftWorldX * gdScaleX) - sRadarCX + sX + (sWidth / 2));
  sRadarTLY = ((sTopLeftWorldY * gdScaleY) - sRadarCY + gsRadarY + (sHeight / 2));
  sRadarBRX = ((sBottomRightWorldX * gdScaleX) - sRadarCX + sX + (sWidth / 2));
  sRadarBRY = ((sBottomRightWorldY * gdScaleY) - sRadarCY + gsRadarY + (sHeight / 2));

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

  SetClippingRegionAndImageWidth(uiDestPitchBYTES, RADAR_WINDOW_X, gsRadarY, (RADAR_WINDOW_X + RADAR_WINDOW_WIDTH - 1), (gsRadarY + RADAR_WINDOW_HEIGHT - 1));

  if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    if (gbPixelDepth == 16) {
      usLineColor = Get16BPPColor(FROMRGB(0, 255, 0));
      RectangleDraw(true, sRadarTLX, sRadarTLY, sRadarBRX, sRadarBRY - 1, usLineColor, pDestBuf);
    } else if (gbPixelDepth == 8) {
      // DB Need to change this to a color from the 8-but standard palette
      usLineColor = COLOR_GREEN;
      RectangleDraw8(true, sRadarTLX + 1, sRadarTLY + 1, sRadarBRX + 1, sRadarBRY + 1, usLineColor, pDestBuf);
    }
  }

  // Cycle fFlash variable
  if (COUNTERDONE(Enum386.RADAR_MAP_BLINK)) {
    RESETCOUNTER(Enum386.RADAR_MAP_BLINK);

    gfRadarCurrentGuyFlash = !gfRadarCurrentGuyFlash;
  }

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) && (fShowMapInventoryPool == true)) {
    let iNumberOfItems: INT32 = 0;

    iNumberOfItems = GetTotalNumberOfItems();

    for (iCounter = 0; iCounter < MAP_INVENTORY_POOL_SLOT_COUNT; iCounter++) {
      iItemNumber = iCounter + iCurrentInventoryPoolPage * MAP_INVENTORY_POOL_SLOT_COUNT;
      // stolen item
      if ((pInventoryPoolList[iItemNumber].o.ubNumberOfObjects == 0) || (pInventoryPoolList[iItemNumber].sGridNo == 0)) {
        // yep, continue on
        continue;
      }

      ConvertGridNoToXY(pInventoryPoolList[iItemNumber].sGridNo, addressof(sXSoldPos), addressof(sYSoldPos));
      GetWorldXYAbsoluteScreenXY(sXSoldPos, sYSoldPos, addressof(sXSoldScreen), addressof(sYSoldScreen));

      // get radar x and y postion
      sXSoldRadar = (sXSoldScreen * gdScaleX);
      sYSoldRadar = (sYSoldScreen * gdScaleY);

      // Add starting relative to interface
      sXSoldRadar += RADAR_WINDOW_X;
      sYSoldRadar += gsRadarY;

      // if we are in 16 bit mode....kind of redundant
      if (gbPixelDepth == 16) {
        if ((fFlashHighLightInventoryItemOnradarMap)) {
          usLineColor = Get16BPPColor(FROMRGB(0, 255, 0));
        } else {
          // DB Need to add a radar color for 8-bit
          usLineColor = Get16BPPColor(FROMRGB(255, 255, 255));
        }

        if (iCurrentlyHighLightedItem == iCounter) {
          RectangleDraw(true, sXSoldRadar, sYSoldRadar, sXSoldRadar + 1, sYSoldRadar + 1, usLineColor, pDestBuf);
        }
      }
    }
  }

  if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    // RE-RENDER RADAR
    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pSoldier = MercSlots[cnt];

      if (pSoldier != null) {
        // Don't place guys in radar until visible!
        if (pSoldier.value.bVisible == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS) && !(pSoldier.value.ubMiscSoldierFlags & SOLDIER_MISC_XRAYED)) {
          continue;
        }

        // Don't render guys if they are dead!
        if ((pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
          continue;
        }

        // Don't render crows
        if (pSoldier.value.ubBodyType == Enum194.CROW) {
          continue;
        }

        // Get FULL screen coordinate for guy's position
        // Getxy from gridno
        ConvertGridNoToXY(pSoldier.value.sGridNo, addressof(sXSoldPos), addressof(sYSoldPos));
        GetWorldXYAbsoluteScreenXY(sXSoldPos, sYSoldPos, addressof(sXSoldScreen), addressof(sYSoldScreen));

        sXSoldRadar = (sXSoldScreen * gdScaleX);
        sYSoldRadar = (sYSoldScreen * gdScaleY);

        if (!SoldierOnVisibleWorldTile(pSoldier)) {
          continue;
        }

        // Add starting relative to interface
        sXSoldRadar += RADAR_WINDOW_X;
        sYSoldRadar += gsRadarY;

        if (gbPixelDepth == 16) {
          // DB Need to add a radar color for 8-bit

          // Are we a selected guy?
          if (pSoldier.value.ubID == gusSelectedSoldier) {
            if (gfRadarCurrentGuyFlash) {
              usLineColor = 0;
            } else {
              // If on roof, make darker....
              if (pSoldier.value.bLevel > 0) {
                usLineColor = Get16BPPColor(FROMRGB(150, 150, 0));
              } else {
                usLineColor = Get16BPPColor(gTacticalStatus.Team[pSoldier.value.bTeam].RadarColor);
              }
            }
          } else {
            usLineColor = Get16BPPColor(gTacticalStatus.Team[pSoldier.value.bTeam].RadarColor);

            // Override civ team with red if hostile...
            if (pSoldier.value.bTeam == CIV_TEAM && !pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum)) {
              usLineColor = Get16BPPColor(FROMRGB(255, 0, 0));
            }

            // Render different color if an enemy and he's unconscious
            if (pSoldier.value.bTeam != gbPlayerNum && pSoldier.value.bLife < OKLIFE) {
              usLineColor = Get16BPPColor(FROMRGB(128, 128, 128));
            }

            // If on roof, make darker....
            if (pSoldier.value.bTeam == gbPlayerNum && pSoldier.value.bLevel > 0) {
              usLineColor = Get16BPPColor(FROMRGB(150, 150, 0));
            }
          }

          RectangleDraw(true, sXSoldRadar, sYSoldRadar, sXSoldRadar + 1, sYSoldRadar + 1, usLineColor, pDestBuf);
        } else if (gbPixelDepth == 8) {
          // DB Need to change this to a color from the 8-but standard palette
          usLineColor = COLOR_BLUE;
          RectangleDraw8(true, sXSoldRadar, sYSoldRadar, sXSoldRadar + 1, sYSoldRadar + 1, usLineColor, pDestBuf);
        }
      }
    }
  }
  UnLockVideoSurface(FRAME_BUFFER);

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) && (fShowMapInventoryPool == true)) {
    InvalidateRegion(RADAR_WINDOW_X, gsRadarY, RADAR_WINDOW_X + RADAR_WINDOW_WIDTH, gsRadarY + RADAR_WINDOW_HEIGHT);
  }

  return;
}

function AdjustWorldCenterFromRadarCoords(sRadarX: INT16, sRadarY: INT16): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sTempX_W: INT16;
  let sTempY_W: INT16;
  let sNewCenterWorldX: INT16;
  let sNewCenterWorldY: INT16;
  let sNumXSteps: INT16;
  let sNumYSteps: INT16;

  // Use radar scale values to get screen values, then convert ot map values, rounding to nearest middle tile
  sScreenX = (sRadarX / gdScaleX);
  sScreenY = (sRadarY / gdScaleY);

  // Adjust to viewport start!
  sScreenX -= ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
  sScreenY -= ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

  // Make sure these coordinates are multiples of scroll steps
  sNumXSteps = sScreenX / SCROLL_X_STEP;
  sNumYSteps = sScreenY / SCROLL_Y_STEP;

  sScreenX = (sNumXSteps * SCROLL_X_STEP);
  sScreenY = (sNumYSteps * SCROLL_Y_STEP);

  // Adjust back
  sScreenX += ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2);
  sScreenY += ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2);

  // Subtract world center
  // sScreenX += gsCX;
  // sScreenY += gsCY;

  // Convert these into world coordinates
  FromScreenToCellCoordinates(sScreenX, sScreenY, addressof(sTempX_W), addressof(sTempY_W));

  // Adjust these to world center
  sNewCenterWorldX = (gCenterWorldX + sTempX_W);
  sNewCenterWorldY = (gCenterWorldY + sTempY_W);

  SetRenderCenter(sNewCenterWorldX, sNewCenterWorldY);
}

function DisableRadarScreenRender(): void {
  fRenderRadarScreen = false;
  return;
}

function EnableRadarScreenRender(): void {
  fRenderRadarScreen = true;
  return;
}

function ToggleRadarScreenRender(): void {
  fRenderRadarScreen = !fRenderRadarScreen;
  return;
}

function CreateDestroyMouseRegionsForSquadList(): boolean {
  // will check the state of renderradarscreen flag and decide if we need to create mouse regions for
  /* static */ let fCreated: boolean = false;
  let sCounter: INT16 = 0;
  let VObjectDesc: VOBJECT_DESC;
  let hHandle: HVOBJECT;
  let uiHandle: UINT32;

  if ((fRenderRadarScreen == false) && (fCreated == false)) {
    // create regions
    // load graphics
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("INTERFACE\\squadpanel.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiHandle)));

    GetVideoObject(addressof(hHandle), uiHandle);
    BltVideoObject(guiSAVEBUFFER, hHandle, 0, 538, 0 + gsVIEWPORT_END_Y, VO_BLT_SRCTRANSPARENCY, null);

    RestoreExternBackgroundRect(538, gsVIEWPORT_END_Y, (640 - 538), (480 - gsVIEWPORT_END_Y));

    for (sCounter = 0; sCounter < Enum275.NUMBER_OF_SQUADS; sCounter++) {
      // run through list of squads and place appropriatly
      if (sCounter < Enum275.NUMBER_OF_SQUADS / 2) {
        // left half of list
        MSYS_DefineRegion(addressof(gRadarRegionSquadList[sCounter]), RADAR_WINDOW_X, (SQUAD_WINDOW_TM_Y() + (sCounter * ((SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / (Enum275.NUMBER_OF_SQUADS / 2)))), RADAR_WINDOW_X + RADAR_WINDOW_WIDTH / 2 - 1, (SQUAD_WINDOW_TM_Y() + ((sCounter + 1) * ((SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / (Enum275.NUMBER_OF_SQUADS / 2)))), MSYS_PRIORITY_HIGHEST, 0, TacticalSquadListMvtCallback, TacticalSquadListBtnCallBack);
      } else {
        // right half of list
        MSYS_DefineRegion(addressof(gRadarRegionSquadList[sCounter]), RADAR_WINDOW_X + RADAR_WINDOW_WIDTH / 2, (SQUAD_WINDOW_TM_Y() + ((sCounter - (Enum275.NUMBER_OF_SQUADS / 2)) * (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / Enum275.NUMBER_OF_SQUADS))), RADAR_WINDOW_X + RADAR_WINDOW_WIDTH - 1, (SQUAD_WINDOW_TM_Y() + (((sCounter + 1) - (Enum275.NUMBER_OF_SQUADS / 2)) * (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / Enum275.NUMBER_OF_SQUADS))), MSYS_PRIORITY_HIGHEST, 0, TacticalSquadListMvtCallback, TacticalSquadListBtnCallBack);
      }

      // set user data
      MSYS_SetRegionUserData(addressof(gRadarRegionSquadList[sCounter]), 0, sCounter);
    }

    DeleteVideoObjectFromIndex(uiHandle);

    // reset the highlighted line
    sSelectedSquadLine = -1;

    // set fact regions are created
    fCreated = true;
  } else if ((fRenderRadarScreen == true) && (fCreated == true)) {
    // destroy regions

    for (sCounter = 0; sCounter < Enum275.NUMBER_OF_SQUADS; sCounter++) {
      MSYS_RemoveRegion(addressof(gRadarRegionSquadList[sCounter]));
    }

    // set fact regions are destroyed
    fCreated = false;

    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      // dirty region
      fInterfacePanelDirty = DIRTYLEVEL2;

      MarkButtonsDirty();

      // re render region
      RenderTacticalInterface();

      RenderButtons();

      // if game is paused, then render paused game text
      RenderPausedGameBox();
    }
  }

  return true;
}

function RenderSquadList(): void {
  // show list of squads
  let sCounter: INT16 = 0;
  let sX: INT16;
  let sY: INT16;

  // clear region
  RestoreExternBackgroundRect(RADAR_WINDOW_X, gsRadarY, RADAR_WINDOW_WIDTH, SQUAD_REGION_HEIGHT);

  // fill area
  ColorFillVideoSurfaceArea(FRAME_BUFFER, RADAR_WINDOW_X, RADAR_WINDOW_TM_Y, RADAR_WINDOW_X + RADAR_WINDOW_WIDTH, RADAR_WINDOW_TM_Y + SQUAD_REGION_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  // set font
  SetFont(SQUAD_FONT());

  for (sCounter = 0; sCounter < Enum275.NUMBER_OF_SQUADS; sCounter++) {
    // run through list of squads and place appropriatly
    if (sCounter < Enum275.NUMBER_OF_SQUADS / 2) {
      FindFontCenterCoordinates(RADAR_WINDOW_X, (SQUAD_WINDOW_TM_Y() + (sCounter * (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / Enum275.NUMBER_OF_SQUADS))), RADAR_WINDOW_WIDTH / 2 - 1, (((2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / Enum275.NUMBER_OF_SQUADS))), pSquadMenuStrings[sCounter], SQUAD_FONT(), addressof(sX), addressof(sY));
    } else {
      FindFontCenterCoordinates(RADAR_WINDOW_X + RADAR_WINDOW_WIDTH / 2, (SQUAD_WINDOW_TM_Y() + ((sCounter - (Enum275.NUMBER_OF_SQUADS / 2)) * (2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / Enum275.NUMBER_OF_SQUADS))), RADAR_WINDOW_WIDTH / 2 - 1, (((2 * (SQUAD_REGION_HEIGHT - SUBTRACTOR_FOR_SQUAD_LIST) / Enum275.NUMBER_OF_SQUADS))), pSquadMenuStrings[sCounter], SQUAD_FONT(), addressof(sX), addressof(sY));
    }

    // highlight line?
    if (sSelectedSquadLine == sCounter) {
      SetFontForeground(FONT_WHITE);
    } else {
      if (IsSquadOnCurrentTacticalMap(sCounter) == true) {
        if (CurrentSquad() == sCounter) {
          SetFontForeground(FONT_LTGREEN);
        } else {
          SetFontForeground(FONT_DKGREEN);
        }
      } else {
        SetFontForeground(FONT_BLACK);
      }
    }

    SetFontBackground(FONT_BLACK);

    if (sCounter < Enum275.NUMBER_OF_SQUADS / 2) {
      sX = RADAR_WINDOW_X + 2;
    } else {
      sX = RADAR_WINDOW_X + (RADAR_WINDOW_WIDTH / 2) - 2;
    }
    mprintf(sX, sY, pSquadMenuStrings[sCounter]);
  }
}

function TacticalSquadListMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iValue: INT32 = -1;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (IsSquadOnCurrentTacticalMap(iValue) == true) {
      sSelectedSquadLine = iValue;
    }
  }
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    sSelectedSquadLine = -1;
  }

  return;
}

function TacticalSquadListBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // btn callback handler for team list info region
  let iValue: INT32 = 0;

  iValue = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // find out if this squad is valid and on this map..if so, set as selected
    if (IsSquadOnCurrentTacticalMap(iValue) == true) {
      // ok, squad is here, set as selected
      SetCurrentSquad(iValue, false);

      // stop showing
      fRenderRadarScreen = true;
    }
  }

  return;
}
