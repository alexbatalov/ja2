namespace ja2 {

const MAX_BURST_LOCATIONS = 50;

interface BURST_LOCATIONS {
  sX: INT16;
  sY: INT16;
  sGridNo: INT16;
}

function createBurstLocations(): BURST_LOCATIONS {
  return {
    sX: 0,
    sY: 0,
    sGridNo: 0,
  };
}

let gsBurstLocations: BURST_LOCATIONS[] /* [MAX_BURST_LOCATIONS] */ = createArrayFrom(MAX_BURST_LOCATIONS, createBurstLocations);
let gbNumBurstLocations: INT8 = 0;

export function ResetBurstLocations(): void {
  gbNumBurstLocations = 0;
}

export function AccumulateBurstLocation(sGridNo: INT16): void {
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

export function PickBurstLocations(pSoldier: SOLDIERTYPE): void {
  let ubShotsPerBurst: UINT8;
  let dAccululator: FLOAT = 0;
  let dStep: FLOAT = 0;
  let cnt: INT32;
  let ubLocationNum: UINT8;

  // OK, using the # of locations, spread them evenly between our current weapon shots per burst value

  // Get shots per burst
  ubShotsPerBurst = Weapon[pSoldier.inv[Enum261.HANDPOS].usItem].ubShotsPerBurst;

  // Use # gridnos accululated and # burst shots to determine accululator
  dStep = gbNumBurstLocations / ubShotsPerBurst;

  // Loop through our shots!
  for (cnt = 0; cnt < ubShotsPerBurst; cnt++) {
    // Get index into list
    ubLocationNum = (dAccululator);

    // Add to merc location
    pSoldier.sSpreadLocations[cnt] = gsBurstLocations[ubLocationNum].sGridNo;

    // Acculuate index value
    dAccululator += dStep;
  }

  // OK, they have been added
}

export function AIPickBurstLocations(pSoldier: SOLDIERTYPE, bTargets: INT8, pTargets: SOLDIERTYPE[] /* [5] */): void {
  let ubShotsPerBurst: UINT8;
  let dAccululator: FLOAT = 0;
  let dStep: FLOAT = 0;
  let cnt: INT32;
  let ubLocationNum: UINT8;

  // OK, using the # of locations, spread them evenly between our current weapon shots per burst value

  // Get shots per burst
  ubShotsPerBurst = Weapon[pSoldier.inv[Enum261.HANDPOS].usItem].ubShotsPerBurst;

  // Use # gridnos accululated and # burst shots to determine accululator
  // dStep = gbNumBurstLocations / (FLOAT)ubShotsPerBurst;
  // CJC: tweak!
  dStep = Math.floor(bTargets / ubShotsPerBurst);

  // Loop through our shots!
  for (cnt = 0; cnt < ubShotsPerBurst; cnt++) {
    // Get index into list
    ubLocationNum = (dAccululator);

    // Add to merc location
    pSoldier.sSpreadLocations[cnt] = pTargets[ubLocationNum].sGridNo;

    // Acculuate index value
    dAccululator += dStep;
  }

  // OK, they have been added
}

export function RenderAccumulatedBurstLocations(): void {
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
  hVObject = GetVideoObject(guiBURSTACCUM);

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
      ({ dScreenX: dTempX_S, dScreenY: dTempY_S } = FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

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

      iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sXPos, sYPos, (sXPos + 40), (sYPos + 40));
      if (iBack != -1) {
        SetBackgroundRectFilled(iBack);
      }

      BltVideoObject(FRAME_BUFFER, hVObject, 1, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, null);
    }
  }
}

}
