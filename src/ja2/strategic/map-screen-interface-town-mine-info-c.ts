const BOX_BUTTON_WIDTH = 100;
const BOX_BUTTON_HEIGHT = 20;

// flag to say if we are showing town/mine box at all
let fShowTownInfo: BOOLEAN = FALSE;

let ghTownMineBox: INT32 = -1;
let TownMinePosition: SGPPoint = [ 300, 150 ];
let TownMineDimensions: SGPRect = [ 0, 0, 240, 60 ];

let bCurrentTownMineSectorX: INT8 = 0;
let bCurrentTownMineSectorY: INT8 = 0;
let bCurrentTownMineSectorZ: INT8 = 0;

// inventory button
let guiMapButtonInventoryImage: UINT32[] /* [2] */;
let guiMapButtonInventory: UINT32[] /* [2] */;

let sTotalButtonWidth: UINT16 = 0;

// extern UINT8 gubMonsterMineInfestation[];

function DisplayTownInfo(sMapX: INT16, sMapY: INT16, bMapZ: INT8): void {
  // will display town info for a particular town

  // set current sector
  if ((bCurrentTownMineSectorX != sMapX) || (bCurrentTownMineSectorY != sMapY) || (bCurrentTownMineSectorZ != bMapZ)) {
    bCurrentTownMineSectorX = sMapX;
    bCurrentTownMineSectorY = sMapY;
    bCurrentTownMineSectorZ = bMapZ;
  }

  // create destroy the box
  CreateDestroyTownInfoBox();
}

function CreateDestroyTownInfoBox(): void {
  // create destroy pop up box for town/mine info
  /* static */ let fCreated: BOOLEAN = FALSE;
  let pDimensions: SGPRect;
  let pPosition: SGPPoint;
  let sButtonX: INT16 = 0;
  let sButtonY: INT16 = 0;
  let bTownId: INT8 = 0;

  if ((fCreated == FALSE) && (fShowTownInfo == TRUE)) {
    // create pop up box
    CreateTownInfoBox();

    // decide what kind of text to add to display

    if (bCurrentTownMineSectorZ == 0) {
      // only show the mine info when mines button is selected, otherwise we need to see the sector's regular town info
      if ((IsThereAMineInThisSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY) == TRUE) && fShowMineFlag) {
        AddTextToMineBox();
      } else {
        bTownId = GetTownIdForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

        // do we add text for the town box?
        if (bTownId != BLANK_SECTOR) {
          // add text for town box
          AddTextToTownBox();
        } else {
          // just a blank sector (handles SAM sites if visible)
          AddTextToBlankSectorBox();
        }
      }

      // add "militia", "militia training", "control" "enemy forces", etc. lines text to any popup box
      AddCommonInfoToBox();
    } else // underground
    {
      // sector
      AddSectorToBox();
    }

    AddItemsInSectorToBox();

    // set font type
    SetBoxFont(ghTownMineBox, BLOCKFONT2);

    // set highlight color
    SetBoxHighLight(ghTownMineBox, FONT_WHITE);

    SetBoxSecondColumnForeground(ghTownMineBox, FONT_WHITE);
    SetBoxSecondColumnBackground(ghTownMineBox, FONT_BLACK);
    SetBoxSecondColumnHighLight(ghTownMineBox, FONT_WHITE);
    SetBoxSecondColumnShade(ghTownMineBox, FONT_BLACK);
    SetBoxSecondColumnFont(ghTownMineBox, BLOCKFONT2);
    SetBoxSecondColumnMinimumOffset(ghTownMineBox, 20);

    // unhighlighted color
    SetBoxForeground(ghTownMineBox, FONT_YELLOW);

    // background color
    SetBoxBackground(ghTownMineBox, FONT_BLACK);

    // shaded color..for darkened text
    SetBoxShade(ghTownMineBox, FONT_BLACK);

    // give title line (0) different color from the rest
    SetBoxLineForeground(ghTownMineBox, 0, FONT_LTGREEN);

    // ressize box to text
    ResizeBoxToText(ghTownMineBox);

    // make box bigger to this size
    GetBoxSize(ghTownMineBox, &pDimensions);

    if (pDimensions.iRight < BOX_BUTTON_WIDTH) {
      // resize box to fit button
      pDimensions.iRight += BOX_BUTTON_WIDTH;
    }

    pDimensions.iBottom += BOX_BUTTON_HEIGHT;

    SetBoxSize(ghTownMineBox, pDimensions);

    ShowBox(ghTownMineBox);

    // now position box
    MinWidthOfTownMineInfoBox();
    PositionTownMineInfoBox();

    // now add the button
    AddInventoryButtonForMapPopUpBox();

    // now position box
    PositionTownMineInfoBox();

    fCreated = TRUE;
  } else if ((fCreated == TRUE) && (fShowTownInfo == FALSE)) {
    // get box size
    GetBoxSize(ghTownMineBox, &pDimensions);

    // get position
    GetBoxPosition(ghTownMineBox, &pPosition);

    // destroy pop up box
    RemoveBox(ghTownMineBox);
    ghTownMineBox = -1;

    // remove inventory button
    RemoveInventoryButtonForMapPopUpBox();

    // restore background
    RestoreExternBackgroundRect(pPosition.iX, pPosition.iY, (pDimensions.iRight - pDimensions.iLeft), (pDimensions.iBottom - pDimensions.iTop + 3));

    fCreated = FALSE;
  }

  return;
}

function CreateTownInfoBox(): void {
  // create basic box
  CreatePopUpBox(&ghTownMineBox, TownMineDimensions, TownMinePosition, (POPUP_BOX_FLAG_CLIP_TEXT));

  // which buffer will box render to
  SetBoxBuffer(ghTownMineBox, FRAME_BUFFER);

  // border type?
  SetBorderType(ghTownMineBox, guiPOPUPBORDERS);

  // background texture
  SetBackGroundSurface(ghTownMineBox, guiPOPUPTEX);

  // margin sizes
  SetMargins(ghTownMineBox, 6, 6, 8, 6);

  // space between lines
  SetLineSpace(ghTownMineBox, 2);

  // set current box to this one
  SetCurrentBox(ghTownMineBox);

  return;
}

// adds text to town info box
function AddTextToTownBox(): void {
  let hStringHandle: UINT32 = 0;
  let wString: CHAR16[] /* [64] */;
  let ubTownId: UINT8 = 0;
  let usTownSectorIndex: UINT16;
  let sMineSector: INT16 = 0;

  // remember town id
  ubTownId = GetTownIdForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);
  Assert((ubTownId >= FIRST_TOWN) && (ubTownId < NUM_TOWNS));

  usTownSectorIndex = SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  switch (usTownSectorIndex) {
    case SEC_B13:
      AddMonoString(&hStringHandle, pLandTypeStrings[DRASSEN_AIRPORT_SITE]);
      break;
    case SEC_F8:
      AddMonoString(&hStringHandle, pLandTypeStrings[CAMBRIA_HOSPITAL_SITE]);
      break;
    case SEC_J9: // Tixa
      if (!fFoundTixa)
        AddMonoString(&hStringHandle, pLandTypeStrings[SAND]);
      else
        AddMonoString(&hStringHandle, pTownNames[TIXA]);
      break;
    case SEC_K4: // Orta
      if (!fFoundOrta)
        AddMonoString(&hStringHandle, pLandTypeStrings[SWAMP]);
      else
        AddMonoString(&hStringHandle, pTownNames[ORTA]);
      break;
    case SEC_N3:
      AddMonoString(&hStringHandle, pLandTypeStrings[MEDUNA_AIRPORT_SITE]);
      break;
    default:
      if (usTownSectorIndex == SEC_N4 && fSamSiteFound[SAM_SITE_FOUR]) {
        // Meduna's SAM site
        AddMonoString(&hStringHandle, pLandTypeStrings[MEDUNA_SAM_SITE]);
      } else {
        // town name
        swprintf(wString, "%s", pTownNames[ubTownId]);
        AddMonoString(&hStringHandle, wString);
      }
      break;
  }
  // blank line
  AddMonoString(&hStringHandle, "");

  // sector
  AddSectorToBox();

  // town size
  swprintf(wString, "%s:", pwTownInfoStrings[0]);
  AddMonoString(&hStringHandle, wString);
  swprintf(wString, "%d", GetTownSectorSize(ubTownId));
  AddSecondColumnMonoString(&hStringHandle, wString);

  // main facilities
  swprintf(wString, "%s:", pwTownInfoStrings[8]);
  AddMonoString(&hStringHandle, wString);
  wcscpy(wString, "");
  GetSectorFacilitiesFlags(bCurrentTownMineSectorX, bCurrentTownMineSectorY, wString);
  AddSecondColumnMonoString(&hStringHandle, wString);

  // the concept of control is only meaningful in sectors where militia can be trained
  if (MilitiaTrainingAllowedInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY, 0)) {
    // town control
    swprintf(wString, "%s:", pwTownInfoStrings[2]);
    AddMonoString(&hStringHandle, wString);
    swprintf(wString, "%d%%%%", (GetTownSectorsUnderControl(ubTownId) * 100) / GetTownSectorSize(ubTownId));
    AddSecondColumnMonoString(&hStringHandle, wString);
  }

  // the concept of town loyalty is only meaningful in towns where loyalty is tracked
  if (gTownLoyalty[ubTownId].fStarted && gfTownUsesLoyalty[ubTownId]) {
    // town loyalty
    swprintf(wString, "%s:", pwTownInfoStrings[5]);
    AddMonoString(&hStringHandle, wString);
    swprintf(wString, "%d%%%%", gTownLoyalty[ubTownId].ubRating);
    AddSecondColumnMonoString(&hStringHandle, wString);
  }

  // if the town has a mine
  sMineSector = GetMineSectorForTown(ubTownId);
  if (sMineSector != -1) {
    // Associated Mine: Sector
    swprintf(wString, "%s:", pwTownInfoStrings[4]);
    AddMonoString(&hStringHandle, wString);
    GetShortSectorString((sMineSector % MAP_WORLD_X), (sMineSector / MAP_WORLD_X), wString);
    AddSecondColumnMonoString(&hStringHandle, wString);
  }
}

// adds text to mine info box
function AddTextToMineBox(): void {
  let ubMineIndex: UINT8;
  let ubTown: UINT8;
  let hStringHandle: UINT32;
  let wString: CHAR16[] /* [64] */;

  ubMineIndex = GetMineIndexForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  // name of town followed by "mine"
  swprintf(wString, "%s %s", pTownNames[GetTownAssociatedWithMine(ubMineIndex)], pwMineStrings[0]);
  AddMonoString(&hStringHandle, wString);

  // blank line
  AddMonoString(&hStringHandle, "");

  // sector
  AddSectorToBox();

  // mine status
  swprintf(wString, "%s:", pwMineStrings[9]);
  AddMonoString(&hStringHandle, wString);

  // check if mine is empty (abandoned) or running out
  if (gMineStatus[ubMineIndex].fEmpty) {
    // abandonded
    wcscpy(wString, pwMineStrings[5]);
  } else if (gMineStatus[ubMineIndex].fShutDown) {
    // shut down
    wcscpy(wString, pwMineStrings[6]);
  } else if (gMineStatus[ubMineIndex].fRunningOut) {
    // running out
    wcscpy(wString, pwMineStrings[7]);
  } else {
    // producing
    wcscpy(wString, pwMineStrings[8]);
  }
  AddSecondColumnMonoString(&hStringHandle, wString);

  // if still producing
  if (!gMineStatus[ubMineIndex].fEmpty) {
    // current production
    swprintf(wString, "%s:", pwMineStrings[3]);
    AddMonoString(&hStringHandle, wString);

    swprintf(wString, "%d", PredictDailyIncomeFromAMine(ubMineIndex));
    InsertCommasForDollarFigure(wString);
    InsertDollarSignInToString(wString);
    AddSecondColumnMonoString(&hStringHandle, wString);

    // potential production
    swprintf(wString, "%s:", pwMineStrings[4]);
    AddMonoString(&hStringHandle, wString);

    swprintf(wString, "%d", GetMaxDailyRemovalFromMine(ubMineIndex));
    InsertCommasForDollarFigure(wString);
    InsertDollarSignInToString(wString);
    AddSecondColumnMonoString(&hStringHandle, wString);

    // if potential is not nil
    if (GetMaxPeriodicRemovalFromMine(ubMineIndex) > 0) {
      // production rate (current production as a percentage of potential production)
      swprintf(wString, "%s:", pwMineStrings[10]);
      AddMonoString(&hStringHandle, wString);
      swprintf(wString, "%d%%%%", (PredictDailyIncomeFromAMine(ubMineIndex) * 100) / GetMaxDailyRemovalFromMine(ubMineIndex));
      AddSecondColumnMonoString(&hStringHandle, wString);
    }

    // town control percentage
    swprintf(wString, "%s:", pwMineStrings[12]);
    AddMonoString(&hStringHandle, wString);
    swprintf(wString, "%d%%%%", (GetTownSectorsUnderControl(gMineLocation[ubMineIndex].bAssociatedTown) * 100) / GetTownSectorSize(gMineLocation[ubMineIndex].bAssociatedTown));
    AddSecondColumnMonoString(&hStringHandle, wString);

    ubTown = gMineLocation[ubMineIndex].bAssociatedTown;
    if (gTownLoyalty[ubTown].fStarted && gfTownUsesLoyalty[ubTown]) {
      // town loyalty percentage
      swprintf(wString, "%s:", pwMineStrings[13]);
      AddMonoString(&hStringHandle, wString);
      swprintf(wString, "%d%%%%", gTownLoyalty[gMineLocation[ubMineIndex].bAssociatedTown].ubRating);
      AddSecondColumnMonoString(&hStringHandle, wString);
    }

    /* gradual monster infestation concept was ditched, now simply IN PRODUCTION or SHUT DOWN
                    // percentage of miners working
                    swprintf( wString, L"%s:", pwMineStrings[ 14 ]);
                    AddMonoString( &hStringHandle, wString );
                    swprintf( wString, L"%d%%%%", gubMonsterMineInfestation[ gMineStatus[ ubMineIndex ].bMonsters ]);
                    AddSecondColumnMonoString( &hStringHandle, wString );
    */

    // ore type (silver/gold
    swprintf(wString, "%s:", pwMineStrings[11]);
    AddMonoString(&hStringHandle, wString);
    AddSecondColumnMonoString(&hStringHandle, (gMineStatus[ubMineIndex].ubMineType == SILVER_MINE) ? pwMineStrings[1] : pwMineStrings[2]);
  }
}

function AddTextToBlankSectorBox(): void {
  let hStringHandle: UINT32;
  let usSectorValue: UINT16 = 0;

  // get the sector value
  usSectorValue = SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  switch (usSectorValue) {
    case SEC_D2: // Chitzena SAM
      if (!fSamSiteFound[SAM_SITE_ONE])
        AddMonoString(&hStringHandle, pLandTypeStrings[TROPICS]);
      else
        AddMonoString(&hStringHandle, pLandTypeStrings[TROPICS_SAM_SITE]);
      break;
    case SEC_D15: // Drassen SAM
      if (!fSamSiteFound[SAM_SITE_TWO])
        AddMonoString(&hStringHandle, pLandTypeStrings[SPARSE]);
      else
        AddMonoString(&hStringHandle, pLandTypeStrings[SPARSE_SAM_SITE]);
      break;
    case SEC_I8: // Cambria SAM
      if (!fSamSiteFound[SAM_SITE_THREE])
        AddMonoString(&hStringHandle, pLandTypeStrings[SAND]);
      else
        AddMonoString(&hStringHandle, pLandTypeStrings[SAND_SAM_SITE]);
      break;
      // SAM Site 4 in Meduna is within town limits, so it's handled in AddTextToTownBox()

    default:
      AddMonoString(&hStringHandle, pLandTypeStrings[(SectorInfo[usSectorValue].ubTraversability[4])]);
      break;
  }

  // blank line
  AddMonoString(&hStringHandle, "");

  // sector
  AddSectorToBox();
}

function AddSectorToBox(): void {
  let wString: CHAR16[] /* [64] */;
  let wString2: CHAR16[] /* [10] */;
  let hStringHandle: UINT32 = 0;

  // sector
  swprintf(wString, "%s:", pwMiscSectorStrings[1]);
  AddMonoString(&hStringHandle, wString);

  GetShortSectorString(bCurrentTownMineSectorX, bCurrentTownMineSectorY, wString);
  if (bCurrentTownMineSectorZ != 0) {
    swprintf(wString2, "-%d", bCurrentTownMineSectorZ);
    wcscat(wString, wString2);
  }

  AddSecondColumnMonoString(&hStringHandle, wString);
}

function AddCommonInfoToBox(): void {
  let wString: CHAR16[] /* [64] */;
  let hStringHandle: UINT32 = 0;
  let fUnknownSAMSite: BOOLEAN = FALSE;
  let ubMilitiaTotal: UINT8 = 0;
  let ubNumEnemies: UINT8;

  switch (SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY)) {
    case SEC_D2: // Chitzena SAM
      if (!fSamSiteFound[SAM_SITE_ONE])
        fUnknownSAMSite = TRUE;
      break;
    case SEC_D15: // Drassen SAM
      if (!fSamSiteFound[SAM_SITE_TWO])
        fUnknownSAMSite = TRUE;
      break;
    case SEC_I8: // Cambria SAM
      if (!fSamSiteFound[SAM_SITE_THREE])
        fUnknownSAMSite = TRUE;
      break;
    // SAM Site 4 in Meduna is within town limits, so it's always controllable
    default:
      break;
  }

  // in sector where militia can be trained,
  // control of the sector matters, display who controls this sector.  Map brightness no longer gives this!
  if (MilitiaTrainingAllowedInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY, 0) && !fUnknownSAMSite) {
    // controlled:
    swprintf(wString, "%s:", pwMiscSectorStrings[4]);
    AddMonoString(&hStringHandle, wString);

    // No/Yes
    swprintf(wString, "%s", pwMiscSectorStrings[(StrategicMap[CALCULATE_STRATEGIC_INDEX(bCurrentTownMineSectorX, bCurrentTownMineSectorY)].fEnemyControlled) ? 6 : 5]);
    AddSecondColumnMonoString(&hStringHandle, wString);

    // militia - is there any?
    swprintf(wString, "%s:", pwTownInfoStrings[11]);
    AddMonoString(&hStringHandle, wString);

    ubMilitiaTotal = CountAllMilitiaInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);
    if (ubMilitiaTotal > 0) {
      // some militia, show total & their breakdown by level
      swprintf(wString, "%d  (%d/%d/%d)", ubMilitiaTotal, MilitiaInSectorOfRank(bCurrentTownMineSectorX, bCurrentTownMineSectorY, GREEN_MILITIA), MilitiaInSectorOfRank(bCurrentTownMineSectorX, bCurrentTownMineSectorY, REGULAR_MILITIA), MilitiaInSectorOfRank(bCurrentTownMineSectorX, bCurrentTownMineSectorY, ELITE_MILITIA));
      AddSecondColumnMonoString(&hStringHandle, wString);
    } else {
      // no militia: don't bother displaying level breakdown
      wcscpy(wString, "0");
      AddSecondColumnMonoString(&hStringHandle, wString);
    }

    // percentage of current militia squad training completed
    swprintf(wString, "%s:", pwTownInfoStrings[10]);
    AddMonoString(&hStringHandle, wString);
    swprintf(wString, "%d%%%%", SectorInfo[SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY)].ubMilitiaTrainingPercentDone);
    AddSecondColumnMonoString(&hStringHandle, wString);
  }

  // enemy forces
  swprintf(wString, "%s:", pwMiscSectorStrings[0]);
  AddMonoString(&hStringHandle, wString);

  // how many are there, really?
  ubNumEnemies = NumEnemiesInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  switch (WhatPlayerKnowsAboutEnemiesInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY)) {
    case KNOWS_NOTHING:
      // show "Unknown"
      wcscpy(wString, pwMiscSectorStrings[3]);
      break;

    case KNOWS_THEYRE_THERE:
      // if there are any there
      if (ubNumEnemies > 0) {
        // show "?", but not exactly how many
        wcscpy(wString, "?");
      } else {
        // we know there aren't any (or we'd be seing them on map, too)
        wcscpy(wString, "0");
      }
      break;

    case KNOWS_HOW_MANY:
      // show exactly how many
      swprintf(wString, "%d", ubNumEnemies);
      break;
  }

  AddSecondColumnMonoString(&hStringHandle, wString);
}

function AddItemsInSectorToBox(): void {
  let wString: CHAR16[] /* [64] */;
  let hStringHandle: UINT32 = 0;

  // items in sector (this works even for underground)

  swprintf(wString, "%s:", pwMiscSectorStrings[2]);
  AddMonoString(&hStringHandle, wString);

  //	swprintf( wString, L"%d", GetSizeOfStashInSector( bCurrentTownMineSectorX, bCurrentTownMineSectorY, bCurrentTownMineSectorZ, FALSE ));
  swprintf(wString, "%d", GetNumberOfVisibleWorldItemsFromSectorStructureForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY, bCurrentTownMineSectorZ));
  AddSecondColumnMonoString(&hStringHandle, wString);
}

function PositionTownMineInfoBox(): void {
  // position town mine info box
  let pDimensions: SGPRect;
  let pPosition: SGPPoint;
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let sNewMargin: INT16 = 0;

  // position the box based on x and y of the selected sector
  GetScreenXYFromMapXY(bCurrentTownMineSectorX, bCurrentTownMineSectorY, &sX, &sY);

  // set box position
  pPosition.iX = sX;
  pPosition.iY = sY;

  // set new position
  SetBoxPosition(ghTownMineBox, pPosition);

  // get box size
  GetBoxSize(ghTownMineBox, &pDimensions);

  // get position
  GetBoxPosition(ghTownMineBox, &pPosition);

  if (pDimensions.iRight < (sTotalButtonWidth + 30)) {
    SpecifyBoxMinWidth(ghTownMineBox, (sTotalButtonWidth + 30));
    pDimensions.iRight = sTotalButtonWidth + 30;
  }

  // now position box - the x axis
  if (pPosition.iX < MapScreenRect.iLeft) {
    pPosition.iX = MapScreenRect.iLeft + 5;
  }

  if (pPosition.iX + pDimensions.iRight > MapScreenRect.iRight) {
    pPosition.iX = MapScreenRect.iRight - pDimensions.iRight - 5;
  }

  // position - the y axis
  if (pPosition.iY < MapScreenRect.iTop) {
    pPosition.iY = MapScreenRect.iTop + 5;
  }

  if (pPosition.iY + pDimensions.iBottom > MapScreenRect.iBottom) {
    pPosition.iY = MapScreenRect.iBottom - pDimensions.iBottom - 8;
  }

  // reset position
  SetBoxPosition(ghTownMineBox, pPosition);

  return;
}

function AddInventoryButtonForMapPopUpBox(): void {
  let sX: INT16;
  let sY: INT16;
  let pDimensions: SGPRect;
  let pPosition: SGPPoint;
  let VObjectDesc: VOBJECT_DESC;
  let uiObject: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let sWidthA: INT16 = 0;
  let sWidthB: INT16 = 0;
  let sTotalBoxWidth: INT16 = 0;
  let hHandle: HVOBJECT;

  // load the button
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mapinvbtns.sti", VObjectDesc.ImageFile);
  AddVideoObject(&VObjectDesc, &uiObject);

  // Calculate smily face positions...
  GetVideoObject(&hHandle, uiObject);
  pTrav = &(hHandle->pETRLEObject[0]);

  sWidthA = pTrav->usWidth;

  pTrav = &(hHandle->pETRLEObject[1]);
  sWidthB = pTrav->usWidth;

  sTotalBoxWidth = sTotalButtonWidth;

  GetBoxSize(ghTownMineBox, &pDimensions);
  GetBoxPosition(ghTownMineBox, &pPosition);

  sX = pPosition.iX + (pDimensions.iRight - sTotalBoxWidth) / 3;
  sY = pPosition.iY + pDimensions.iBottom - ((BOX_BUTTON_HEIGHT + 5));

  guiMapButtonInventoryImage[0] = LoadButtonImage("INTERFACE\\mapinvbtns.sti", -1, 0, -1, 2, -1);

  guiMapButtonInventory[0] = CreateIconAndTextButton(guiMapButtonInventoryImage[0], pMapPopUpInventoryText[0], BLOCKFONT2, FONT_WHITE, FONT_BLACK, FONT_WHITE, FONT_BLACK, TEXT_CJUSTIFIED, (sX), (sY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK, MapTownMineInventoryButtonCallBack);

  sX = sX + sWidthA + (pDimensions.iRight - sTotalBoxWidth) / 3;
  sY = pPosition.iY + pDimensions.iBottom - ((BOX_BUTTON_HEIGHT + 5));

  guiMapButtonInventoryImage[1] = LoadButtonImage("INTERFACE\\mapinvbtns.sti", -1, 1, -1, 3, -1);

  guiMapButtonInventory[1] = CreateIconAndTextButton(guiMapButtonInventoryImage[1], pMapPopUpInventoryText[1], BLOCKFONT2, FONT_WHITE, FONT_BLACK, FONT_WHITE, FONT_BLACK, TEXT_CJUSTIFIED, (sX), (sY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK, MapTownMineExitButtonCallBack);

  // delete video object
  DeleteVideoObjectFromIndex(uiObject);

  /*
          // if below ground disable
          if( iCurrentMapSectorZ )
          {
                  DisableButton( guiMapButtonInventory[ 0 ] );
          }
  */

  return;
}

function RemoveInventoryButtonForMapPopUpBox(): void {
  // get rid of button
  RemoveButton(guiMapButtonInventory[0]);
  UnloadButtonImage(guiMapButtonInventoryImage[0]);

  RemoveButton(guiMapButtonInventory[1]);
  UnloadButtonImage(guiMapButtonInventoryImage[1]);

  return;
}

function MapTownMineInventoryButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON) {
      btn->uiFlags &= ~(BUTTON_CLICKED_ON);

      // done
      fShowMapInventoryPool = TRUE;
      fMapPanelDirty = TRUE;
      fMapScreenBottomDirty = TRUE;
      fShowTownInfo = FALSE;

      // since we are bring up the sector inventory, check to see if the help screen should come up
      if (ShouldTheHelpScreenComeUp(HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY, FALSE)) {
        // normally this is handled in the screen handler, we have to set up a little different this time around
        ShouldTheHelpScreenComeUp(HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY, TRUE);
      }
    }
  }
}

function MapTownMineExitButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON) {
      btn->uiFlags &= ~(BUTTON_CLICKED_ON);

      // done
      fMapPanelDirty = TRUE;
      fMapScreenBottomDirty = TRUE;
      fShowTownInfo = FALSE;
    }
  }
}

// get the min width of the town mine info pop up box
function MinWidthOfTownMineInfoBox(): void {
  let hHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;
  let sWidthA: INT16 = 0;
  let sWidthB: INT16 = 0;
  let sTotalBoxWidth: INT16 = 0;
  let uiObject: UINT32;
  let pTrav: Pointer<ETRLEObject>;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\mapinvbtns.sti", VObjectDesc.ImageFile);
  AddVideoObject(&VObjectDesc, &uiObject);

  // Calculate smily face positions...
  GetVideoObject(&hHandle, uiObject);
  pTrav = &(hHandle->pETRLEObject[0]);

  sWidthA = pTrav->usWidth;

  pTrav = &(hHandle->pETRLEObject[1]);
  sWidthB = pTrav->usWidth;

  sTotalBoxWidth = sWidthA + sWidthB;
  sTotalButtonWidth = sTotalBoxWidth;

  // delete video object
  DeleteVideoObjectFromIndex(uiObject);

  return;
}
