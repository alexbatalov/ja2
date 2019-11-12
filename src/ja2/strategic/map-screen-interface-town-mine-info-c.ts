namespace ja2 {

const BOX_BUTTON_WIDTH = 100;
const BOX_BUTTON_HEIGHT = 20;

// flag to say if we are showing town/mine box at all
export let fShowTownInfo: boolean = false;

export let ghTownMineBox: INT32 = -1;
let TownMinePosition: SGPPoint = createSGPPointFrom(300, 150);
let TownMineDimensions: SGPRect = createSGPRectFrom(0, 0, 240, 60);

let bCurrentTownMineSectorX: INT8 = 0;
let bCurrentTownMineSectorY: INT8 = 0;
let bCurrentTownMineSectorZ: INT8 = 0;

// inventory button
let guiMapButtonInventoryImage: UINT32[] /* [2] */;
let guiMapButtonInventory: UINT32[] /* [2] */;

let sTotalButtonWidth: UINT16 = 0;

// extern UINT8 gubMonsterMineInfestation[];

export function DisplayTownInfo(sMapX: INT16, sMapY: INT16, bMapZ: INT8): void {
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

export function CreateDestroyTownInfoBox(): void {
  // create destroy pop up box for town/mine info
  /* static */ let fCreated: boolean = false;
  let pDimensions: SGPRect = createSGPRect();
  let pPosition: SGPPoint = createSGPPoint();
  let sButtonX: INT16 = 0;
  let sButtonY: INT16 = 0;
  let bTownId: INT8 = 0;

  if ((fCreated == false) && (fShowTownInfo == true)) {
    // create pop up box
    CreateTownInfoBox();

    // decide what kind of text to add to display

    if (bCurrentTownMineSectorZ == 0) {
      // only show the mine info when mines button is selected, otherwise we need to see the sector's regular town info
      if ((IsThereAMineInThisSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY) == true) && fShowMineFlag) {
        AddTextToMineBox();
      } else {
        bTownId = GetTownIdForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

        // do we add text for the town box?
        if (bTownId != Enum135.BLANK_SECTOR) {
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
    SetBoxFont(ghTownMineBox, BLOCKFONT2());

    // set highlight color
    SetBoxHighLight(ghTownMineBox, FONT_WHITE);

    SetBoxSecondColumnForeground(ghTownMineBox, FONT_WHITE);
    SetBoxSecondColumnBackground(ghTownMineBox, FONT_BLACK);
    SetBoxSecondColumnHighLight(ghTownMineBox, FONT_WHITE);
    SetBoxSecondColumnShade(ghTownMineBox, FONT_BLACK);
    SetBoxSecondColumnFont(ghTownMineBox, BLOCKFONT2());
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
    GetBoxSize(ghTownMineBox, addressof(pDimensions));

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

    fCreated = true;
  } else if ((fCreated == true) && (fShowTownInfo == false)) {
    // get box size
    GetBoxSize(ghTownMineBox, addressof(pDimensions));

    // get position
    GetBoxPosition(ghTownMineBox, addressof(pPosition));

    // destroy pop up box
    RemoveBox(ghTownMineBox);
    ghTownMineBox = -1;

    // remove inventory button
    RemoveInventoryButtonForMapPopUpBox();

    // restore background
    RestoreExternBackgroundRect(pPosition.iX, pPosition.iY, (pDimensions.iRight - pDimensions.iLeft), (pDimensions.iBottom - pDimensions.iTop + 3));

    fCreated = false;
  }

  return;
}

function CreateTownInfoBox(): void {
  // create basic box
  CreatePopUpBox(addressof(ghTownMineBox), TownMineDimensions, TownMinePosition, (POPUP_BOX_FLAG_CLIP_TEXT));

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
  let wString: string /* CHAR16[64] */;
  let ubTownId: UINT8 = 0;
  let usTownSectorIndex: UINT16;
  let sMineSector: INT16 = 0;

  // remember town id
  ubTownId = GetTownIdForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);
  Assert((ubTownId >= FIRST_TOWN) && (ubTownId < Enum135.NUM_TOWNS));

  usTownSectorIndex = SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  switch (usTownSectorIndex) {
    case Enum123.SEC_B13:
      AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.DRASSEN_AIRPORT_SITE]);
      break;
    case Enum123.SEC_F8:
      AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.CAMBRIA_HOSPITAL_SITE]);
      break;
    case Enum123.SEC_J9: // Tixa
      if (!fFoundTixa)
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.SAND]);
      else
        AddMonoString(addressof(hStringHandle), pTownNames[Enum135.TIXA]);
      break;
    case Enum123.SEC_K4: // Orta
      if (!fFoundOrta)
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.SWAMP]);
      else
        AddMonoString(addressof(hStringHandle), pTownNames[Enum135.ORTA]);
      break;
    case Enum123.SEC_N3:
      AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.MEDUNA_AIRPORT_SITE]);
      break;
    default:
      if (usTownSectorIndex == Enum123.SEC_N4 && fSamSiteFound[Enum138.SAM_SITE_FOUR]) {
        // Meduna's SAM site
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.MEDUNA_SAM_SITE]);
      } else {
        // town name
        wString = swprintf("%s", pTownNames[ubTownId]);
        AddMonoString(addressof(hStringHandle), wString);
      }
      break;
  }
  // blank line
  AddMonoString(addressof(hStringHandle), "");

  // sector
  AddSectorToBox();

  // town size
  wString = swprintf("%s:", pwTownInfoStrings[0]);
  AddMonoString(addressof(hStringHandle), wString);
  wString = swprintf("%d", GetTownSectorSize(ubTownId));
  AddSecondColumnMonoString(addressof(hStringHandle), wString);

  // main facilities
  wString = swprintf("%s:", pwTownInfoStrings[8]);
  AddMonoString(addressof(hStringHandle), wString);
  wString = GetSectorFacilitiesFlags(bCurrentTownMineSectorX, bCurrentTownMineSectorY);
  AddSecondColumnMonoString(addressof(hStringHandle), wString);

  // the concept of control is only meaningful in sectors where militia can be trained
  if (MilitiaTrainingAllowedInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY, 0)) {
    // town control
    wString = swprintf("%s:", pwTownInfoStrings[2]);
    AddMonoString(addressof(hStringHandle), wString);
    wString = swprintf("%d%%%%", (GetTownSectorsUnderControl(ubTownId) * 100) / GetTownSectorSize(ubTownId));
    AddSecondColumnMonoString(addressof(hStringHandle), wString);
  }

  // the concept of town loyalty is only meaningful in towns where loyalty is tracked
  if (gTownLoyalty[ubTownId].fStarted && gfTownUsesLoyalty[ubTownId]) {
    // town loyalty
    wString = swprintf("%s:", pwTownInfoStrings[5]);
    AddMonoString(addressof(hStringHandle), wString);
    wString = swprintf("%d%%%%", gTownLoyalty[ubTownId].ubRating);
    AddSecondColumnMonoString(addressof(hStringHandle), wString);
  }

  // if the town has a mine
  sMineSector = GetMineSectorForTown(ubTownId);
  if (sMineSector != -1) {
    // Associated Mine: Sector
    wString = swprintf("%s:", pwTownInfoStrings[4]);
    AddMonoString(addressof(hStringHandle), wString);
    GetShortSectorString((sMineSector % MAP_WORLD_X), (sMineSector / MAP_WORLD_X), wString);
    AddSecondColumnMonoString(addressof(hStringHandle), wString);
  }
}

// adds text to mine info box
function AddTextToMineBox(): void {
  let ubMineIndex: UINT8;
  let ubTown: UINT8;
  let hStringHandle: UINT32;
  let wString: string /* CHAR16[64] */;

  ubMineIndex = GetMineIndexForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  // name of town followed by "mine"
  wString = swprintf("%s %s", pTownNames[GetTownAssociatedWithMine(ubMineIndex)], pwMineStrings[0]);
  AddMonoString(addressof(hStringHandle), wString);

  // blank line
  AddMonoString(addressof(hStringHandle), "");

  // sector
  AddSectorToBox();

  // mine status
  wString = swprintf("%s:", pwMineStrings[9]);
  AddMonoString(addressof(hStringHandle), wString);

  // check if mine is empty (abandoned) or running out
  if (gMineStatus[ubMineIndex].fEmpty) {
    // abandonded
    wString = pwMineStrings[5];
  } else if (gMineStatus[ubMineIndex].fShutDown) {
    // shut down
    wString = pwMineStrings[6];
  } else if (gMineStatus[ubMineIndex].fRunningOut) {
    // running out
    wString = pwMineStrings[7];
  } else {
    // producing
    wString = pwMineStrings[8];
  }
  AddSecondColumnMonoString(addressof(hStringHandle), wString);

  // if still producing
  if (!gMineStatus[ubMineIndex].fEmpty) {
    // current production
    wString = swprintf("%s:", pwMineStrings[3]);
    AddMonoString(addressof(hStringHandle), wString);

    wString = swprintf("%d", PredictDailyIncomeFromAMine(ubMineIndex));
    InsertCommasForDollarFigure(wString);
    InsertDollarSignInToString(wString);
    AddSecondColumnMonoString(addressof(hStringHandle), wString);

    // potential production
    wString = swprintf("%s:", pwMineStrings[4]);
    AddMonoString(addressof(hStringHandle), wString);

    wString = swprintf("%d", GetMaxDailyRemovalFromMine(ubMineIndex));
    InsertCommasForDollarFigure(wString);
    InsertDollarSignInToString(wString);
    AddSecondColumnMonoString(addressof(hStringHandle), wString);

    // if potential is not nil
    if (GetMaxPeriodicRemovalFromMine(ubMineIndex) > 0) {
      // production rate (current production as a percentage of potential production)
      wString = swprintf("%s:", pwMineStrings[10]);
      AddMonoString(addressof(hStringHandle), wString);
      wString = swprintf("%d%%%%", (PredictDailyIncomeFromAMine(ubMineIndex) * 100) / GetMaxDailyRemovalFromMine(ubMineIndex));
      AddSecondColumnMonoString(addressof(hStringHandle), wString);
    }

    // town control percentage
    wString = swprintf("%s:", pwMineStrings[12]);
    AddMonoString(addressof(hStringHandle), wString);
    wString = swprintf("%d%%%%", (GetTownSectorsUnderControl(gMineLocation[ubMineIndex].bAssociatedTown) * 100) / GetTownSectorSize(gMineLocation[ubMineIndex].bAssociatedTown));
    AddSecondColumnMonoString(addressof(hStringHandle), wString);

    ubTown = gMineLocation[ubMineIndex].bAssociatedTown;
    if (gTownLoyalty[ubTown].fStarted && gfTownUsesLoyalty[ubTown]) {
      // town loyalty percentage
      wString = swprintf("%s:", pwMineStrings[13]);
      AddMonoString(addressof(hStringHandle), wString);
      wString = swprintf("%d%%%%", gTownLoyalty[gMineLocation[ubMineIndex].bAssociatedTown].ubRating);
      AddSecondColumnMonoString(addressof(hStringHandle), wString);
    }

    /* gradual monster infestation concept was ditched, now simply IN PRODUCTION or SHUT DOWN
                    // percentage of miners working
                    swprintf( wString, L"%s:", pwMineStrings[ 14 ]);
                    AddMonoString( &hStringHandle, wString );
                    swprintf( wString, L"%d%%%%", gubMonsterMineInfestation[ gMineStatus[ ubMineIndex ].bMonsters ]);
                    AddSecondColumnMonoString( &hStringHandle, wString );
    */

    // ore type (silver/gold
    wString = swprintf("%s:", pwMineStrings[11]);
    AddMonoString(addressof(hStringHandle), wString);
    AddSecondColumnMonoString(addressof(hStringHandle), (gMineStatus[ubMineIndex].ubMineType == Enum181.SILVER_MINE) ? pwMineStrings[1] : pwMineStrings[2]);
  }
}

function AddTextToBlankSectorBox(): void {
  let hStringHandle: UINT32;
  let usSectorValue: UINT16 = 0;

  // get the sector value
  usSectorValue = SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  switch (usSectorValue) {
    case Enum123.SEC_D2: // Chitzena SAM
      if (!fSamSiteFound[Enum138.SAM_SITE_ONE])
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.TROPICS]);
      else
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.TROPICS_SAM_SITE]);
      break;
    case Enum123.SEC_D15: // Drassen SAM
      if (!fSamSiteFound[Enum138.SAM_SITE_TWO])
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.SPARSE]);
      else
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.SPARSE_SAM_SITE]);
      break;
    case Enum123.SEC_I8: // Cambria SAM
      if (!fSamSiteFound[Enum138.SAM_SITE_THREE])
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.SAND]);
      else
        AddMonoString(addressof(hStringHandle), pLandTypeStrings[Enum127.SAND_SAM_SITE]);
      break;
      // SAM Site 4 in Meduna is within town limits, so it's handled in AddTextToTownBox()

    default:
      AddMonoString(addressof(hStringHandle), pLandTypeStrings[(SectorInfo[usSectorValue].ubTraversability[4])]);
      break;
  }

  // blank line
  AddMonoString(addressof(hStringHandle), "");

  // sector
  AddSectorToBox();
}

function AddSectorToBox(): void {
  let wString: string /* CHAR16[64] */;
  let wString2: string /* CHAR16[10] */;
  let hStringHandle: UINT32 = 0;

  // sector
  wString = swprintf("%s:", pwMiscSectorStrings[1]);
  AddMonoString(addressof(hStringHandle), wString);

  GetShortSectorString(bCurrentTownMineSectorX, bCurrentTownMineSectorY, wString);
  if (bCurrentTownMineSectorZ != 0) {
    wString2 = swprintf("-%d", bCurrentTownMineSectorZ);
    wString += wString2;
  }

  AddSecondColumnMonoString(addressof(hStringHandle), wString);
}

function AddCommonInfoToBox(): void {
  let wString: string /* CHAR16[64] */;
  let hStringHandle: UINT32 = 0;
  let fUnknownSAMSite: boolean = false;
  let ubMilitiaTotal: UINT8 = 0;
  let ubNumEnemies: UINT8;

  switch (SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY)) {
    case Enum123.SEC_D2: // Chitzena SAM
      if (!fSamSiteFound[Enum138.SAM_SITE_ONE])
        fUnknownSAMSite = true;
      break;
    case Enum123.SEC_D15: // Drassen SAM
      if (!fSamSiteFound[Enum138.SAM_SITE_TWO])
        fUnknownSAMSite = true;
      break;
    case Enum123.SEC_I8: // Cambria SAM
      if (!fSamSiteFound[Enum138.SAM_SITE_THREE])
        fUnknownSAMSite = true;
      break;
    // SAM Site 4 in Meduna is within town limits, so it's always controllable
    default:
      break;
  }

  // in sector where militia can be trained,
  // control of the sector matters, display who controls this sector.  Map brightness no longer gives this!
  if (MilitiaTrainingAllowedInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY, 0) && !fUnknownSAMSite) {
    // controlled:
    wString = swprintf("%s:", pwMiscSectorStrings[4]);
    AddMonoString(addressof(hStringHandle), wString);

    // No/Yes
    wString = swprintf("%s", pwMiscSectorStrings[(StrategicMap[CALCULATE_STRATEGIC_INDEX(bCurrentTownMineSectorX, bCurrentTownMineSectorY)].fEnemyControlled) ? 6 : 5]);
    AddSecondColumnMonoString(addressof(hStringHandle), wString);

    // militia - is there any?
    wString = swprintf("%s:", pwTownInfoStrings[11]);
    AddMonoString(addressof(hStringHandle), wString);

    ubMilitiaTotal = CountAllMilitiaInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);
    if (ubMilitiaTotal > 0) {
      // some militia, show total & their breakdown by level
      wString = swprintf("%d  (%d/%d/%d)", ubMilitiaTotal, MilitiaInSectorOfRank(bCurrentTownMineSectorX, bCurrentTownMineSectorY, Enum126.GREEN_MILITIA), MilitiaInSectorOfRank(bCurrentTownMineSectorX, bCurrentTownMineSectorY, Enum126.REGULAR_MILITIA), MilitiaInSectorOfRank(bCurrentTownMineSectorX, bCurrentTownMineSectorY, Enum126.ELITE_MILITIA));
      AddSecondColumnMonoString(addressof(hStringHandle), wString);
    } else {
      // no militia: don't bother displaying level breakdown
      wString = "0";
      AddSecondColumnMonoString(addressof(hStringHandle), wString);
    }

    // percentage of current militia squad training completed
    wString = swprintf("%s:", pwTownInfoStrings[10]);
    AddMonoString(addressof(hStringHandle), wString);
    wString = swprintf("%d%%%%", SectorInfo[SECTOR(bCurrentTownMineSectorX, bCurrentTownMineSectorY)].ubMilitiaTrainingPercentDone);
    AddSecondColumnMonoString(addressof(hStringHandle), wString);
  }

  // enemy forces
  wString = swprintf("%s:", pwMiscSectorStrings[0]);
  AddMonoString(addressof(hStringHandle), wString);

  // how many are there, really?
  ubNumEnemies = NumEnemiesInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY);

  switch (WhatPlayerKnowsAboutEnemiesInSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY)) {
    case Enum159.KNOWS_NOTHING:
      // show "Unknown"
      wString = pwMiscSectorStrings[3];
      break;

    case Enum159.KNOWS_THEYRE_THERE:
      // if there are any there
      if (ubNumEnemies > 0) {
        // show "?", but not exactly how many
        wString = "?";
      } else {
        // we know there aren't any (or we'd be seing them on map, too)
        wString = "0";
      }
      break;

    case Enum159.KNOWS_HOW_MANY:
      // show exactly how many
      wString = swprintf("%d", ubNumEnemies);
      break;
  }

  AddSecondColumnMonoString(addressof(hStringHandle), wString);
}

function AddItemsInSectorToBox(): void {
  let wString: string /* CHAR16[64] */;
  let hStringHandle: UINT32 = 0;

  // items in sector (this works even for underground)

  wString = swprintf("%s:", pwMiscSectorStrings[2]);
  AddMonoString(addressof(hStringHandle), wString);

  //	swprintf( wString, L"%d", GetSizeOfStashInSector( bCurrentTownMineSectorX, bCurrentTownMineSectorY, bCurrentTownMineSectorZ, FALSE ));
  wString = swprintf("%d", GetNumberOfVisibleWorldItemsFromSectorStructureForSector(bCurrentTownMineSectorX, bCurrentTownMineSectorY, bCurrentTownMineSectorZ));
  AddSecondColumnMonoString(addressof(hStringHandle), wString);
}

function PositionTownMineInfoBox(): void {
  // position town mine info box
  let pDimensions: SGPRect = createSGPRect();
  let pPosition: SGPPoint = createSGPPoint();
  let sX: INT16 = 0;
  let sY: INT16 = 0;
  let sNewMargin: INT16 = 0;

  // position the box based on x and y of the selected sector
  GetScreenXYFromMapXY(bCurrentTownMineSectorX, bCurrentTownMineSectorY, addressof(sX), addressof(sY));

  // set box position
  pPosition.iX = sX;
  pPosition.iY = sY;

  // set new position
  SetBoxPosition(ghTownMineBox, pPosition);

  // get box size
  GetBoxSize(ghTownMineBox, addressof(pDimensions));

  // get position
  GetBoxPosition(ghTownMineBox, addressof(pPosition));

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
  let pDimensions: SGPRect = createSGPRect();
  let pPosition: SGPPoint = createSGPPoint();
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let uiObject: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let sWidthA: INT16 = 0;
  let sWidthB: INT16 = 0;
  let sTotalBoxWidth: INT16 = 0;
  let hHandle: HVOBJECT;

  // load the button
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\mapinvbtns.sti");
  uiObject = AddVideoObject(VObjectDesc);

  // Calculate smily face positions...
  GetVideoObject(addressof(hHandle), uiObject);
  pTrav = addressof(hHandle.value.pETRLEObject[0]);

  sWidthA = pTrav.value.usWidth;

  pTrav = addressof(hHandle.value.pETRLEObject[1]);
  sWidthB = pTrav.value.usWidth;

  sTotalBoxWidth = sTotalButtonWidth;

  GetBoxSize(ghTownMineBox, addressof(pDimensions));
  GetBoxPosition(ghTownMineBox, addressof(pPosition));

  sX = pPosition.iX + (pDimensions.iRight - sTotalBoxWidth) / 3;
  sY = pPosition.iY + pDimensions.iBottom - ((BOX_BUTTON_HEIGHT + 5));

  guiMapButtonInventoryImage[0] = LoadButtonImage("INTERFACE\\mapinvbtns.sti", -1, 0, -1, 2, -1);

  guiMapButtonInventory[0] = CreateIconAndTextButton(guiMapButtonInventoryImage[0], pMapPopUpInventoryText[0], BLOCKFONT2(), FONT_WHITE, FONT_BLACK, FONT_WHITE, FONT_BLACK, TEXT_CJUSTIFIED, (sX), (sY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), MapTownMineInventoryButtonCallBack);

  sX = sX + sWidthA + (pDimensions.iRight - sTotalBoxWidth) / 3;
  sY = pPosition.iY + pDimensions.iBottom - ((BOX_BUTTON_HEIGHT + 5));

  guiMapButtonInventoryImage[1] = LoadButtonImage("INTERFACE\\mapinvbtns.sti", -1, 1, -1, 3, -1);

  guiMapButtonInventory[1] = CreateIconAndTextButton(guiMapButtonInventoryImage[1], pMapPopUpInventoryText[1], BLOCKFONT2(), FONT_WHITE, FONT_BLACK, FONT_WHITE, FONT_BLACK, TEXT_CJUSTIFIED, (sX), (sY), BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST - 1, DEFAULT_MOVE_CALLBACK(), MapTownMineExitButtonCallBack);

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

function MapTownMineInventoryButtonCallBack(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // done
      fShowMapInventoryPool = true;
      fMapPanelDirty = true;
      fMapScreenBottomDirty = true;
      fShowTownInfo = false;

      // since we are bring up the sector inventory, check to see if the help screen should come up
      if (ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY, false)) {
        // normally this is handled in the screen handler, we have to set up a little different this time around
        ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY, true);
      }
    }
  }
}

function MapTownMineExitButtonCallBack(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= ~(BUTTON_CLICKED_ON);

      // done
      fMapPanelDirty = true;
      fMapScreenBottomDirty = true;
      fShowTownInfo = false;
    }
  }
}

// get the min width of the town mine info pop up box
function MinWidthOfTownMineInfoBox(): void {
  let hHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let sWidthA: INT16 = 0;
  let sWidthB: INT16 = 0;
  let sTotalBoxWidth: INT16 = 0;
  let uiObject: UINT32;
  let pTrav: Pointer<ETRLEObject>;

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\mapinvbtns.sti");
  uiObject = AddVideoObject(VObjectDesc);

  // Calculate smily face positions...
  GetVideoObject(addressof(hHandle), uiObject);
  pTrav = addressof(hHandle.value.pETRLEObject[0]);

  sWidthA = pTrav.value.usWidth;

  pTrav = addressof(hHandle.value.pETRLEObject[1]);
  sWidthB = pTrav.value.usWidth;

  sTotalBoxWidth = sWidthA + sWidthB;
  sTotalButtonWidth = sTotalBoxWidth;

  // delete video object
  DeleteVideoObjectFromIndex(uiObject);

  return;
}

}
