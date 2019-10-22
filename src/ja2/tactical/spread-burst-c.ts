const MAX_BURST_LOCATIONS = 50;

interface BURST_LOCATIONS {
  sX: INT16;
  sY: INT16;
  sGridNo: INT16;
}

let gsBurstLocations: BURST_LOCATIONS[] /* [MAX_BURST_LOCATIONS] */;
let gbNumBurstLocations: INT8 = 0;

function ResetBurstLocations(): void {
  gbNumBurstLocations = 0;
}

function AccumulateBurstLocation(sGridNo: INT16): void {
  let cnt: INT32;

  if (gbNumBurstLocations < MAX_BURST_LOCATIONS) {
    // Check if it already exists!
    for (cnt = 0; cnt < gbNumBurstLocations; cnt++) {
      if (gsBurstLocations[cnt].sGridNo == sGridNo) {
        return;
      }
    }

    gsBurstLocations[gbNumBurstLocations].sGridNo = sGridNo;

    // Get cell X, Y from mouse...
    GetMouseWorldCoords(addressof(gsBurstLocations[gbNumBurstLocations].sX), addressof(gsBurstLocations[gbNumBurstLocations].sY));

    gbNumBurstLocations++;
  }
}

function PickBurstLocations(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubShotsPerBurst: UINT8;
  let dAccululator: FLOAT = 0;
  let dStep: FLOAT = 0;
  let cnt: INT32;
  let ubLocationNum: UINT8;

  // OK, using the # of locations, spread them evenly between our current weapon shots per burst value

  // Get shots per burst
  ubShotsPerBurst = Weapon[pSoldier.value.inv[HANDPOS].usItem].ubShotsPerBurst;

  // Use # gridnos accululated and # burst shots to determine accululator
  dStep = gbNumBurstLocations / ubShotsPerBurst;

  // Loop through our shots!
  for (cnt = 0; cnt < ubShotsPerBurst; cnt++) {
    // Get index into list
    ubLocationNum = (dAccululator);

    // Add to merc location
    pSoldier.value.sSpreadLocations[cnt] = gsBurstLocations[ubLocationNum].sGridNo;

    // Acculuate index value
    dAccululator += dStep;
  }

  // OK, they have been added
}

function AIPickBurstLocations(pSoldier: Pointer<SOLDIERTYPE>, bTargets: INT8, pTargets: Pointer<SOLDIERTYPE>[] /* [5] */): void {
  let ubShotsPerBurst: UINT8;
  let dAccululator: FLOAT = 0;
  let dStep: FLOAT = 0;
  let cnt: INT32;
  let ubLocationNum: UINT8;

  // OK, using the # of locations, spread them evenly between our current weapon shots per burst value

  // Get shots per burst
  ubShotsPerBurst = Weapon[pSoldier.value.inv[HANDPOS].usItem].ubShotsPerBurst;

  // Use # gridnos accululated and # burst shots to determine accululator
  // dStep = gbNumBurstLocations / (FLOAT)ubShotsPerBurst;
  // CJC: tweak!
  dStep = bTargets / ubShotsPerBurst;

  // Loop through our shots!
  for (cnt = 0; cnt < ubShotsPerBurst; cnt++) {
    // Get index into list
    ubLocationNum = (dAccululator);

    // Add to merc location
    pSoldier.value.sSpreadLocations[cnt] = pTargets[ubLocationNum].value.sGridNo;

    // Acculuate index value
    dAccululator += dStep;
  }

  // OK, they have been added
}

function RenderAccumulatedBurstLocations(): void {
  let cnt: INT32;
  let sGridNo: INT16;
  let hVObject: HVOBJECT;

  if (!gfBeginBurstSpreadTracking) {
    return;
  }

  if (gbNumBurstLocations == 0) {
    return;
  }

  // Loop through each location...
  GetVideoObject(addressof(hVObject), guiBURSTACCUM);

  // If on screen, render

  // Check if it already exists!
  for (cnt = 0; cnt < gbNumBurstLocations; cnt++) {
    sGridNo = gsBurstLocations[cnt].sGridNo;

    if (GridNoOnScreen(sGridNo)) {
      let dOffsetX: FLOAT;
      let dOffsetY: FLOAT;
      let dTempX_S: FLOAT;
      let dTempY_S: FLOAT;
      let sXPos: INT16;
      let sYPos: INT16;
      let iBack: INT32;

      dOffsetX = (gsBurstLocations[cnt].sX - gsRenderCenterX);
      dOffsetY = (gsBurstLocations[cnt].sY - gsRenderCenterY);

      // Calculate guy's position
      FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, addressof(dTempX_S), addressof(dTempY_S));

      sXPos = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
      sYPos = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S - gpWorldLevelData[sGridNo].sHeight;

      // Adjust for offset position on screen
      sXPos -= gsRenderWorldOffsetX;
      sYPos -= gsRenderWorldOffsetY;

      // Adjust for render height
      sYPos += gsRenderHeight;

      // sScreenY -= gpWorldLevelData[ sGridNo ].sHeight;

      // Center circle!
      // sXPos -= 10;
      // sYPos -= 10;

      iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, sXPos, sYPos, (sXPos + 40), (sYPos + 40));
      if (iBack != -1) {
        SetBackgroundRectFilled(iBack);
      }

      BltVideoObject(FRAME_BUFFER, hVObject, 1, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, NULL);
    }
  }
}
