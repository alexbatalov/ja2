const LIFE_BAR_SHADOW = () => FROMRGB(108, 12, 12);
const LIFE_BAR = () => FROMRGB(200, 0, 0);
const BANDAGE_BAR_SHADOW = () => FROMRGB(156, 60, 60);
const BANDAGE_BAR = () => FROMRGB(222, 132, 132);
const BLEEDING_BAR_SHADOW = () => FROMRGB(128, 128, 60);
const BLEEDING_BAR = () => FROMRGB(240, 240, 20);
const CURR_BREATH_BAR_SHADOW = () => FROMRGB(8, 12, 118); // the MAX max breatth, always at 100%
const CURR_BREATH_BAR = () => FROMRGB(8, 12, 160);
const CURR_MAX_BREATH = () => FROMRGB(0, 0, 0); // the current max breath, black
const CURR_MAX_BREATH_SHADOW = () => FROMRGB(0, 0, 0);
const MORALE_BAR_SHADOW = () => FROMRGB(8, 112, 12);
const MORALE_BAR = () => FROMRGB(8, 180, 12);
const BREATH_BAR_SHADOW = () => FROMRGB(60, 108, 108); // the lt blue current breath
const BREATH_BAR = () => FROMRGB(113, 178, 218);
const BREATH_BAR_SHAD_BACK = () => FROMRGB(1, 1, 1);
const FACE_WIDTH = 48;
const FACE_HEIGHT = 43;

// car portraits
const enum Enum222 {
  ELDORADO_PORTRAIT = 0,
  HUMMER_PORTRAIT,
  ICE_CREAM_TRUCT_PORTRAIT,
  JEEP_PORTRAIT,
  NUMBER_CAR_PORTRAITS,
}

// the ids for the car portraits
let giCarPortraits: INT32[] /* [4] */ = [
  -1,
  -1,
  -1,
  -1,
];

// the car portrait file names
let pbCarPortraitFileNames: STR[] /* [] */ = [
  "INTERFACE\\eldorado.sti",
  "INTERFACE\\Hummer.sti",
  "INTERFACE\\ice Cream Truck.sti",
  "INTERFACE\\Jeep.sti",
];

// load int he portraits for the car faces that will be use in mapscreen
function LoadCarPortraitValues(): BOOLEAN {
  let iCounter: INT32 = 0;
  let VObjectDesc: VOBJECT_DESC;

  if (giCarPortraits[0] != -1) {
    return FALSE;
  }
  for (iCounter = 0; iCounter < NUMBER_CAR_PORTRAITS; iCounter++) {
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    sprintf(VObjectDesc.ImageFile, pbCarPortraitFileNames[iCounter]);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(giCarPortraits[iCounter])));
  }
  return TRUE;
}

// get rid of the images we loaded for the mapscreen car portraits
function UnLoadCarPortraits(): void {
  let iCounter: INT32 = 0;

  // car protraits loaded?
  if (giCarPortraits[0] == -1) {
    return;
  }
  for (iCounter = 0; iCounter < NUMBER_CAR_PORTRAITS; iCounter++) {
    DeleteVideoObjectFromIndex(giCarPortraits[iCounter]);
    giCarPortraits[iCounter] = -1;
  }
  return;
}

function DrawLifeUIBarEx(pSoldier: Pointer<SOLDIERTYPE>, sXPos: INT16, sYPos: INT16, sWidth: INT16, sHeight: INT16, fErase: BOOLEAN, uiBuffer: UINT32): void {
  let dStart: FLOAT;
  let dEnd: FLOAT;
  let dPercentage: FLOAT;
  // UINT16										 usLineColor;

  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;
  let bBandage: INT8;

  // Erase what was there
  if (fErase) {
    RestoreExternBackgroundRect(sXPos, (sYPos - sHeight), sWidth, (sHeight + 1));
  }

  if (pSoldier.value.bLife == 0) {
    // are they dead?
    return;
  }

  pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // FIRST DO MAX LIFE
  dPercentage = pSoldier.value.bLife / 100;
  dEnd = dPercentage * sHeight;
  dStart = sYPos;

  usLineColor = Get16BPPColor(LIFE_BAR_SHADOW);
  RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(LIFE_BAR);
  RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(LIFE_BAR_SHADOW);
  RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);

  // NOW DO BANDAGE

  // Calculate bandage
  bBandage = pSoldier.value.bLifeMax - pSoldier.value.bLife - pSoldier.value.bBleeding;

  if (bBandage) {
    dPercentage = bBandage / 100;
    dStart = (sYPos - dEnd);
    dEnd = (dPercentage * sHeight);

    usLineColor = Get16BPPColor(BANDAGE_BAR_SHADOW);
    RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

    usLineColor = Get16BPPColor(BANDAGE_BAR);
    RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

    usLineColor = Get16BPPColor(BANDAGE_BAR_SHADOW);
    RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);
  }

  // NOW DO BLEEDING
  if (pSoldier.value.bBleeding) {
    dPercentage = pSoldier.value.bBleeding / 100;
    dStart = (dStart - dEnd);
    dEnd = (dPercentage * sHeight);

    usLineColor = Get16BPPColor(BLEEDING_BAR_SHADOW);
    RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

    usLineColor = Get16BPPColor(BLEEDING_BAR);
    RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

    usLineColor = Get16BPPColor(BLEEDING_BAR_SHADOW);
    RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);
  }

  UnLockVideoSurface(uiBuffer);
}

function DrawBreathUIBarEx(pSoldier: Pointer<SOLDIERTYPE>, sXPos: INT16, sYPos: INT16, sWidth: INT16, sHeight: INT16, fErase: BOOLEAN, uiBuffer: UINT32): void {
  let dStart: FLOAT;
  let dEnd: FLOAT;
  let dPercentage: FLOAT;
  // UINT16										 usLineColor;

  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;
  let hHandle: HVOBJECT;

  // Erase what was there
  if (fErase) {
    RestoreExternBackgroundRect(sXPos, (sYPos - sHeight), sWidth, (sHeight + 1));
  }

  if (pSoldier.value.bLife == 0) {
    // are they dead?
    return;
  }

  //  DO MAX MAX BREATH
  dPercentage = 1.;
  dEnd = dPercentage * sHeight;
  dStart = sYPos;

  // brown guy
  GetVideoObject(addressof(hHandle), guiBrownBackgroundForTeamPanel);

  // DO MAX BREATH
  if (guiCurrentScreen != MAP_SCREEN) {
    if (gusSelectedSoldier == pSoldier.value.ubID && gTacticalStatus.ubCurrentTeam == OUR_TEAM && OK_INTERRUPT_MERC(pSoldier)) {
      // gold, the second entry in the .sti
      BltVideoObject(uiBuffer, hHandle, 1, sXPos, (sYPos - sHeight), VO_BLT_SRCTRANSPARENCY, NULL);
    } else {
      // brown, first entry
      BltVideoObject(uiBuffer, hHandle, 0, sXPos, (sYPos - sHeight), VO_BLT_SRCTRANSPARENCY, NULL);
    }
  } else {
    // brown, first entry
    BltVideoObject(uiBuffer, hHandle, 0, sXPos, (sYPos - sHeight), VO_BLT_SRCTRANSPARENCY, NULL);
  }

  pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  if (pSoldier.value.bBreathMax <= 97) {
    dPercentage = ((pSoldier.value.bBreathMax + 3)) / 100;
    dEnd = dPercentage * sHeight;
    dStart = sYPos;

    // the old background colors for breath max diff
    usLineColor = Get16BPPColor(BREATH_BAR_SHAD_BACK);
    RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

    usLineColor = Get16BPPColor(BREATH_BAR_SHAD_BACK);
    RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

    usLineColor = Get16BPPColor(BREATH_BAR_SHAD_BACK);
    RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);
  }

  dPercentage = pSoldier.value.bBreathMax / 100;
  dEnd = dPercentage * sHeight;
  dStart = sYPos;

  usLineColor = Get16BPPColor(CURR_MAX_BREATH_SHADOW);
  RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(CURR_MAX_BREATH);
  RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(CURR_MAX_BREATH_SHADOW);
  RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);

  // NOW DO BREATH
  dPercentage = pSoldier.value.bBreath / 100;
  dEnd = dPercentage * sHeight;
  dStart = sYPos;

  usLineColor = Get16BPPColor(CURR_BREATH_BAR_SHADOW);
  RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(CURR_BREATH_BAR);
  RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(CURR_BREATH_BAR_SHADOW);
  RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);

  UnLockVideoSurface(uiBuffer);
}

function DrawMoraleUIBarEx(pSoldier: Pointer<SOLDIERTYPE>, sXPos: INT16, sYPos: INT16, sWidth: INT16, sHeight: INT16, fErase: BOOLEAN, uiBuffer: UINT32): void {
  let dStart: FLOAT;
  let dEnd: FLOAT;
  let dPercentage: FLOAT;
  // UINT16										 usLineColor;

  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;

  // Erase what was there
  if (fErase) {
    RestoreExternBackgroundRect(sXPos, (sYPos - sHeight), sWidth, (sHeight + 1));
  }

  if (pSoldier.value.bLife == 0) {
    // are they dead?
    return;
  }

  pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // FIRST DO BREATH
  dPercentage = pSoldier.value.bMorale / 100;
  dEnd = dPercentage * sHeight;
  dStart = sYPos;

  usLineColor = Get16BPPColor(MORALE_BAR_SHADOW);
  RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(MORALE_BAR);
  RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = Get16BPPColor(MORALE_BAR_SHADOW);
  RectangleDraw(TRUE, sXPos + 2, dStart, sXPos + 2, (dStart - dEnd), usLineColor, pDestBuf);

  UnLockVideoSurface(uiBuffer);
}

function DrawItemUIBarEx(pObject: Pointer<OBJECTTYPE>, ubStatus: UINT8, sXPos: INT16, sYPos: INT16, sWidth: INT16, sHeight: INT16, sColor1: INT16, sColor2: INT16, fErase: BOOLEAN, uiBuffer: UINT32): void {
  let dStart: FLOAT;
  let dEnd: FLOAT;
  let dPercentage: FLOAT;
  // UINT16										 usLineColor;

  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;
  let sValue: INT16;

  if (ubStatus >= DRAW_ITEM_STATUS_ATTACHMENT1) {
    sValue = pObject.value.bAttachStatus[ubStatus - DRAW_ITEM_STATUS_ATTACHMENT1];
  } else {
    sValue = pObject.value.bStatus[ubStatus];
  }

  // Adjust for ammo, other thingys..
  if (Item[pObject.value.usItem].usItemClass & IC_AMMO) {
    sValue = sValue * 100 / Magazine[Item[pObject.value.usItem].ubClassIndex].ubMagSize;

    if (sValue > 100) {
      sValue = 100;
    }
  }

  if (Item[pObject.value.usItem].usItemClass & IC_KEY) {
    sValue = 100;
  }

  // ATE: Subtract 1 to exagerate bad status
  if (sValue < 100 && sValue > 1) {
    sValue--;
  }

  // Erase what was there
  if (fErase) {
    // RestoreExternBackgroundRect( sXPos, (INT16)(sYPos - sHeight), sWidth, (INT16)(sHeight + 1 ) );
  }

  pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // FIRST DO BREATH
  dPercentage = sValue / 100;
  dEnd = dPercentage * sHeight;
  dStart = sYPos;

  // usLineColor = Get16BPPColor( STATUS_BAR );
  usLineColor = sColor1;
  RectangleDraw(TRUE, sXPos, dStart, sXPos, (dStart - dEnd), usLineColor, pDestBuf);

  usLineColor = sColor2;
  RectangleDraw(TRUE, sXPos + 1, dStart, sXPos + 1, (dStart - dEnd), usLineColor, pDestBuf);

  UnLockVideoSurface(uiBuffer);

  if (uiBuffer == guiSAVEBUFFER) {
    RestoreExternBackgroundRect(sXPos, (sYPos - sHeight), sWidth, (sHeight + 1));
  } else {
    InvalidateRegion(sXPos, (sYPos - sHeight), sXPos + sWidth, (sYPos + 1));
  }
}

function RenderSoldierFace(pSoldier: Pointer<SOLDIERTYPE>, sFaceX: INT16, sFaceY: INT16, fAutoFace: BOOLEAN): void {
  let fDoFace: BOOLEAN = FALSE;
  let iFaceIndex: INT32 = -1;
  let ubVehicleType: UINT8 = 0;

  if (pSoldier.value.bActive) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
      // get the type of vehicle
      ubVehicleType = pVehicleList[pSoldier.value.bVehicleID].ubVehicleType;

      // just draw the vehicle
      BltVideoObjectFromIndex(guiSAVEBUFFER, giCarPortraits[ubVehicleType], 0, sFaceX, sFaceY, VO_BLT_SRCTRANSPARENCY, NULL);
      RestoreExternBackgroundRect(sFaceX, sFaceY, FACE_WIDTH, FACE_HEIGHT);

      return;
    }

    if (fAutoFace) {
      // OK, check if this face actually went active...
      if (gFacesData[pSoldier.value.iFaceIndex].uiFlags & FACE_INACTIVE_HANDLED_ELSEWHERE) {
        // Render as an extern face...
        fAutoFace = FALSE;
      } else {
        SetAutoFaceActiveFromSoldier(FRAME_BUFFER, guiSAVEBUFFER, pSoldier.value.ubID, sFaceX, sFaceY);
        //	SetAutoFaceActiveFromSoldier( FRAME_BUFFER, FACE_AUTO_RESTORE_BUFFER, pSoldier->ubID , sFaceX, sFaceY );
      }
    }

    fDoFace = TRUE;

    if (fDoFace) {
      if (fAutoFace) {
        RenderAutoFaceFromSoldier(pSoldier.value.ubID);
      } else {
        ExternRenderFaceFromSoldier(guiSAVEBUFFER, pSoldier.value.ubID, sFaceX, sFaceY);
      }
    }
  } else {
    // Put close panel there
    // if(gbPixelDepth==16)
    //{
    BltVideoObjectFromIndex(guiSAVEBUFFER, guiCLOSE, 5, sFaceX, sFaceY, VO_BLT_SRCTRANSPARENCY, NULL);
    //}
    RestoreExternBackgroundRect(sFaceX, sFaceY, FACE_WIDTH, FACE_HEIGHT);
  }
}
