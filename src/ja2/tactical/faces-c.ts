namespace ja2 {

// Defines
const NUM_FACE_SLOTS = 50;

const END_FACE_OVERLAY_DELAY = 2000;

// GLOBAL FOR FACES LISTING
export let gFacesData: FACETYPE[] /* [NUM_FACE_SLOTS] */;
let guiNumFaces: UINT32 = 0;

interface RPC_SMALL_FACE_VALUES {
  bEyesX: INT8;
  bEyesY: INT8;
  bMouthX: INT8;
  bMouthY: INT8;
}

let gRPCSmallFaceValues: RPC_SMALL_FACE_VALUES[] /* [] */ = [
  [ 9, 8, 8, 24 ], // MIGUEL		( 57 )
  [ 8, 8, 7, 24 ], // CARLOS		( 58 )
  [ 10, 8, 8, 26 ], // IRA			( 59 )
  [ 7, 8, 7, 26 ], // DIMITRI	( 60 )
  [ 6, 7, 7, 23 ], // DEVIN		( 61 )
  [ 0, 0, 0, 0 ], // THE RAT	( 62 )
  [ 8, 7, 8, 23 ], //					( 63 )
  [ 8, 8, 8, 22 ], // SLAY			( 64 )
  [ 0, 0, 0, 0 ], //					( 65 )
  [ 9, 4, 7, 22 ], // DYNAMO		( 66 )
  [ 8, 8, 8, 25 ], // SHANK		( 67 )
  [ 4, 6, 5, 22 ], // IGGY			( 68 )
  [ 8, 9, 7, 25 ], // VINCE		( 69 )
  [ 4, 7, 5, 25 ], // CONRAD		( 70 )
  [ 9, 7, 8, 22 ], // CARL			( 71 )
  [ 9, 7, 9, 25 ], // MADDOG		( 72 )
  [ 0, 0, 0, 0 ], //					( 73 )
  [ 0, 0, 0, 0 ], //					( 74 )

  [ 9, 3, 8, 23 ], // MARIA		( 88 )

  [ 9, 3, 8, 25 ], // JOEY			( 90 )

  [ 11, 7, 9, 24 ], // SKYRIDER	( 97 )
  [ 9, 5, 7, 23 ], // Miner	( 106 )

  [ 6, 4, 6, 24 ], // JOHN					( 118 )
  [ 12, 4, 10, 24 ], //					( 119 )
  [ 8, 6, 8, 23 ], // Miner	( 148 )
  [ 6, 5, 6, 23 ], // Miner	( 156 )
  [ 13, 7, 11, 24 ], // Miner	( 157 )
  [ 9, 7, 8, 22 ], // Miner	( 158 )
];

let gubRPCSmallFaceProfileNum: UINT8[] /* [] */ = [
  57, // entry 0
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65,
  66, // entry 9
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  88,
  90, // entry 19
  97,
  106,
  118,
  119,
  148, // entry 24
  156,
  157,
  158,
];

let ubRPCNumSmallFaceValues: UINT8 = 28;

function GetFreeFace(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumFaces; uiCount++) {
    if ((gFacesData[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumFaces < NUM_FACE_SLOTS)
    return guiNumFaces++;

  return -1;
}

function RecountFaces(): void {
  let uiCount: INT32;

  for (uiCount = guiNumFaces - 1; (uiCount >= 0); uiCount--) {
    if ((gFacesData[uiCount].fAllocated)) {
      guiNumFaces = (uiCount + 1);
      break;
    }
  }
}

export function InitSoldierFace(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iFaceIndex: INT32;

  // Check if we have a face init already
  iFaceIndex = pSoldier.value.iFaceIndex;

  if (iFaceIndex != -1) {
    return iFaceIndex;
  }

  return InitFace(pSoldier.value.ubProfile, pSoldier.value.ubID, 0);
}

export function InitFace(usMercProfileID: UINT8, ubSoldierID: UINT8, uiInitFlags: UINT32): INT32 {
  let uiBlinkFrequency: UINT32;
  let uiExpressionFrequency: UINT32;

  if (usMercProfileID == NO_PROFILE) {
    return -1;
  }

  uiBlinkFrequency = gMercProfiles[usMercProfileID].uiBlinkFrequency;
  uiExpressionFrequency = gMercProfiles[usMercProfileID].uiExpressionFrequency;

  if (Random(2)) {
    uiBlinkFrequency += Random(2000);
  } else {
    uiBlinkFrequency -= Random(2000);
  }

  return InternalInitFace(usMercProfileID, ubSoldierID, uiInitFlags, gMercProfiles[usMercProfileID].ubFaceIndex, uiBlinkFrequency, uiExpressionFrequency);
}

function InternalInitFace(usMercProfileID: UINT8, ubSoldierID: UINT8, uiInitFlags: UINT32, iFaceFileID: INT32, uiBlinkFrequency: UINT32, uiExpressionFrequency: UINT32): INT32 {
  let pFace: Pointer<FACETYPE>;
  let VObjectDesc: VOBJECT_DESC;
  let uiVideoObject: UINT32;
  let iFaceIndex: INT32;
  let ETRLEObject: ETRLEObject;
  let hVObject: HVOBJECT;
  let uiCount: UINT32;
  let Pal: SGPPaletteEntry[] /* [256] */;

  if ((iFaceIndex = GetFreeFace()) == (-1))
    return -1;

  // Load face file
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;

  // ATE: If we are merc profile ID #151-154, all use 151's protrait....
  if (usMercProfileID >= 151 && usMercProfileID <= 154) {
    iFaceFileID = 151;
  }

  // Check if we are a big-face....
  if (uiInitFlags & FACE_BIGFACE) {
    // The filename is the profile ID!
    if (iFaceFileID < 100) {
      sprintf(VObjectDesc.ImageFile, "FACES\\b%02d.sti", iFaceFileID);
    } else {
      sprintf(VObjectDesc.ImageFile, "FACES\\b%03d.sti", iFaceFileID);
    }

    // ATE: Check for profile - if elliot , use special face :)
    if (usMercProfileID == Enum268.ELLIOT) {
      if (gMercProfiles[Enum268.ELLIOT].bNPCData > 3 && gMercProfiles[Enum268.ELLIOT].bNPCData < 7) {
        sprintf(VObjectDesc.ImageFile, "FACES\\b%02da.sti", iFaceFileID);
      } else if (gMercProfiles[Enum268.ELLIOT].bNPCData > 6 && gMercProfiles[Enum268.ELLIOT].bNPCData < 10) {
        sprintf(VObjectDesc.ImageFile, "FACES\\b%02db.sti", iFaceFileID);
      } else if (gMercProfiles[Enum268.ELLIOT].bNPCData > 9 && gMercProfiles[Enum268.ELLIOT].bNPCData < 13) {
        sprintf(VObjectDesc.ImageFile, "FACES\\b%02dc.sti", iFaceFileID);
      } else if (gMercProfiles[Enum268.ELLIOT].bNPCData > 12 && gMercProfiles[Enum268.ELLIOT].bNPCData < 16) {
        sprintf(VObjectDesc.ImageFile, "FACES\\b%02dd.sti", iFaceFileID);
      } else if (gMercProfiles[Enum268.ELLIOT].bNPCData == 17) {
        sprintf(VObjectDesc.ImageFile, "FACES\\b%02de.sti", iFaceFileID);
      }
    }
  } else {
    if (iFaceFileID < 100) {
      // The filename is the profile ID!
      sprintf(VObjectDesc.ImageFile, "FACES\\%02d.sti", iFaceFileID);
    } else {
      sprintf(VObjectDesc.ImageFile, "FACES\\%03d.sti", iFaceFileID);
    }
  }

  // Load
  if (AddVideoObject(addressof(VObjectDesc), addressof(uiVideoObject)) == false) {
    // If we are a big face, use placeholder...
    if (uiInitFlags & FACE_BIGFACE) {
      sprintf(VObjectDesc.ImageFile, "FACES\\placeholder.sti");

      if (AddVideoObject(addressof(VObjectDesc), addressof(uiVideoObject)) == false) {
        return -1;
      }
    } else {
      return -1;
    }
  }

  memset(addressof(gFacesData[iFaceIndex]), 0, sizeof(FACETYPE));

  pFace = addressof(gFacesData[iFaceIndex]);

  // Get profile data and set into face data
  pFace.value.ubSoldierID = ubSoldierID;

  pFace.value.iID = iFaceIndex;
  pFace.value.fAllocated = true;

  // Default to off!
  pFace.value.fDisabled = true;
  pFace.value.iVideoOverlay = -1;
  // pFace->uiEyeDelay			=	gMercProfiles[ usMercProfileID ].uiEyeDelay;
  // pFace->uiMouthDelay		= gMercProfiles[ usMercProfileID ].uiMouthDelay;
  pFace.value.uiEyeDelay = 50 + Random(30);
  pFace.value.uiMouthDelay = 120;
  pFace.value.ubCharacterNum = usMercProfileID;

  pFace.value.uiBlinkFrequency = uiBlinkFrequency;
  pFace.value.uiExpressionFrequency = uiExpressionFrequency;

  pFace.value.sEyeFrame = 0;
  pFace.value.sMouthFrame = 0;
  pFace.value.uiFlags = uiInitFlags;

  // Set palette
  if (GetVideoObject(addressof(hVObject), uiVideoObject)) {
    // Build a grayscale palette! ( for testing different looks )
    for (uiCount = 0; uiCount < 256; uiCount++) {
      Pal[uiCount].peRed = 255;
      Pal[uiCount].peGreen = 255;
      Pal[uiCount].peBlue = 255;
    }

    hVObject.value.pShades[FLASH_PORTRAIT_NOSHADE] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 255, 255, 255, false);
    hVObject.value.pShades[FLASH_PORTRAIT_STARTSHADE] = Create16BPPPaletteShaded(Pal, 255, 255, 255, false);
    hVObject.value.pShades[FLASH_PORTRAIT_ENDSHADE] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 250, 25, 25, true);
    hVObject.value.pShades[FLASH_PORTRAIT_DARKSHADE] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 100, 100, 100, true);
    hVObject.value.pShades[FLASH_PORTRAIT_LITESHADE] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 100, 100, 100, false);

    for (uiCount = 0; uiCount < 256; uiCount++) {
      Pal[uiCount].peRed = (uiCount % 128) + 128;
      Pal[uiCount].peGreen = (uiCount % 128) + 128;
      Pal[uiCount].peBlue = (uiCount % 128) + 128;
    }
    hVObject.value.pShades[FLASH_PORTRAIT_GRAYSHADE] = Create16BPPPaletteShaded(Pal, 255, 255, 255, false);
  }

  // Get FACE height, width
  if (GetVideoObjectETRLEPropertiesFromIndex(uiVideoObject, addressof(ETRLEObject), 0) == false) {
    return -1;
  }
  pFace.value.usFaceWidth = ETRLEObject.usWidth;
  pFace.value.usFaceHeight = ETRLEObject.usHeight;

  // OK, check # of items
  if (hVObject.value.usNumberOfObjects == 8) {
    pFace.value.fInvalidAnim = false;

    // Get EYE height, width
    if (GetVideoObjectETRLEPropertiesFromIndex(uiVideoObject, addressof(ETRLEObject), 1) == false) {
      return -1;
    }
    pFace.value.usEyesWidth = ETRLEObject.usWidth;
    pFace.value.usEyesHeight = ETRLEObject.usHeight;

    // Get Mouth height, width
    if (GetVideoObjectETRLEPropertiesFromIndex(uiVideoObject, addressof(ETRLEObject), 5) == false) {
      return -1;
    }
    pFace.value.usMouthWidth = ETRLEObject.usWidth;
    pFace.value.usMouthHeight = ETRLEObject.usHeight;
  } else {
    pFace.value.fInvalidAnim = true;
  }

  // Set id
  pFace.value.uiVideoObject = uiVideoObject;

  return iFaceIndex;
}

export function DeleteSoldierFace(pSoldier: Pointer<SOLDIERTYPE>): void {
  DeleteFace(pSoldier.value.iFaceIndex);

  pSoldier.value.iFaceIndex = -1;
}

export function DeleteFace(iFaceIndex: INT32): void {
  let pFace: Pointer<FACETYPE>;

  // Check face index
  CHECKV(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  // Check for a valid slot!
  CHECKV(pFace.value.fAllocated != false);

  pFace.value.fCanHandleInactiveNow = true;

  if (!pFace.value.fDisabled) {
    SetAutoFaceInActive(iFaceIndex);
  }

  // If we are still talking, stop!
  if (pFace.value.fTalking) {
    // Call dialogue handler function
    pFace.value.fTalking = false;

    HandleDialogueEnd(pFace);
  }

  // Delete vo
  DeleteVideoObjectFromIndex(pFace.value.uiVideoObject);

  // Set uncallocated
  pFace.value.fAllocated = false;

  RecountFaces();
}

export function SetAutoFaceActiveFromSoldier(uiDisplayBuffer: UINT32, uiRestoreBuffer: UINT32, ubSoldierID: UINT8, usFaceX: UINT16, usFaceY: UINT16): void {
  if (ubSoldierID == NOBODY) {
    return;
  }

  SetAutoFaceActive(uiDisplayBuffer, uiRestoreBuffer, MercPtrs[ubSoldierID].value.iFaceIndex, usFaceX, usFaceY);
}

function GetFaceRelativeCoordinates(pFace: Pointer<FACETYPE>, pusEyesX: Pointer<UINT16>, pusEyesY: Pointer<UINT16>, pusMouthX: Pointer<UINT16>, pusMouthY: Pointer<UINT16>): void {
  let usMercProfileID: UINT16;
  let usEyesX: UINT16;
  let usEyesY: UINT16;
  let usMouthX: UINT16;
  let usMouthY: UINT16;
  let cnt: INT32;

  usMercProfileID = pFace.value.ubCharacterNum;

  // Take eyes x,y from profile unless we are an RPC and we are small faced.....
  usEyesX = gMercProfiles[usMercProfileID].usEyesX;
  usEyesY = gMercProfiles[usMercProfileID].usEyesY;
  usMouthY = gMercProfiles[usMercProfileID].usMouthY;
  usMouthX = gMercProfiles[usMercProfileID].usMouthX;

  // Use some other values for x,y, base on if we are a RPC!
  if (!(pFace.value.uiFlags & FACE_BIGFACE) || (pFace.value.uiFlags & FACE_FORCE_SMALL)) {
    // Are we a recruited merc? .. or small?
    if ((gMercProfiles[usMercProfileID].ubMiscFlags & (PROFILE_MISC_FLAG_RECRUITED | PROFILE_MISC_FLAG_EPCACTIVE)) || (pFace.value.uiFlags & FACE_FORCE_SMALL)) {
      // Loop through all values of availible merc IDs to find ours!
      for (cnt = 0; cnt < ubRPCNumSmallFaceValues; cnt++) {
        // We've found one!
        if (gubRPCSmallFaceProfileNum[cnt] == usMercProfileID) {
          usEyesX = gRPCSmallFaceValues[cnt].bEyesX;
          usEyesY = gRPCSmallFaceValues[cnt].bEyesY;
          usMouthY = gRPCSmallFaceValues[cnt].bMouthY;
          usMouthX = gRPCSmallFaceValues[cnt].bMouthX;
        }
      }
    }
  }

  (pusEyesX.value) = usEyesX;
  (pusEyesY.value) = usEyesY;
  (pusMouthX.value) = usMouthX;
  (pusMouthY.value) = usMouthY;
}

export function SetAutoFaceActive(uiDisplayBuffer: UINT32, uiRestoreBuffer: UINT32, iFaceIndex: INT32, usFaceX: UINT16, usFaceY: UINT16): void {
  let usEyesX: UINT16;
  let usEyesY: UINT16;
  let usMouthX: UINT16;
  let usMouthY: UINT16;
  let pFace: Pointer<FACETYPE>;

  // Check face index
  CHECKV(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  GetFaceRelativeCoordinates(pFace, addressof(usEyesX), addressof(usEyesY), addressof(usMouthX), addressof(usMouthY));

  InternalSetAutoFaceActive(uiDisplayBuffer, uiRestoreBuffer, iFaceIndex, usFaceX, usFaceY, usEyesX, usEyesY, usMouthX, usMouthY);
}

function InternalSetAutoFaceActive(uiDisplayBuffer: UINT32, uiRestoreBuffer: UINT32, iFaceIndex: INT32, usFaceX: UINT16, usFaceY: UINT16, usEyesX: UINT16, usEyesY: UINT16, usMouthX: UINT16, usMouthY: UINT16): void {
  let usMercProfileID: UINT16;
  let pFace: Pointer<FACETYPE>;
  let vs_desc: VSURFACE_DESC;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;

  // Check face index
  CHECKV(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  // IF we are already being contained elsewhere, return without doing anything!

  // ATE: Don't allow another activity from setting active....
  if (pFace.value.uiFlags & FACE_INACTIVE_HANDLED_ELSEWHERE) {
    return;
  }

  // Check if we are active already, remove if so!
  if (pFace.value.fDisabled) {
    SetAutoFaceInActive(iFaceIndex);
  }

  if (uiRestoreBuffer == FACE_AUTO_RESTORE_BUFFER) {
    // BUILD A BUFFER
    GetCurrentVideoSettings(addressof(usWidth), addressof(usHeight), addressof(ubBitDepth));
    // OK, ignore screen widths, height, only use BPP
    vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.usWidth = pFace.value.usFaceWidth;
    vs_desc.usHeight = pFace.value.usFaceHeight;
    vs_desc.ubBitDepth = ubBitDepth;

    pFace.value.fAutoRestoreBuffer = true;

    CHECKV(AddVideoSurface(addressof(vs_desc), addressof(pFace.value.uiAutoRestoreBuffer)));
  } else {
    pFace.value.fAutoRestoreBuffer = false;
    pFace.value.uiAutoRestoreBuffer = uiRestoreBuffer;
  }

  if (uiDisplayBuffer == FACE_AUTO_DISPLAY_BUFFER) {
    // BUILD A BUFFER
    GetCurrentVideoSettings(addressof(usWidth), addressof(usHeight), addressof(ubBitDepth));
    // OK, ignore screen widths, height, only use BPP
    vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.usWidth = pFace.value.usFaceWidth;
    vs_desc.usHeight = pFace.value.usFaceHeight;
    vs_desc.ubBitDepth = ubBitDepth;

    pFace.value.fAutoDisplayBuffer = true;

    CHECKV(AddVideoSurface(addressof(vs_desc), addressof(pFace.value.uiAutoDisplayBuffer)));
  } else {
    pFace.value.fAutoDisplayBuffer = false;
    pFace.value.uiAutoDisplayBuffer = uiDisplayBuffer;
  }

  usMercProfileID = pFace.value.ubCharacterNum;

  pFace.value.usFaceX = usFaceX;
  pFace.value.usFaceY = usFaceY;
  pFace.value.fCanHandleInactiveNow = false;

  // Take eyes x,y from profile unless we are an RPC and we are small faced.....
  pFace.value.usEyesX = usEyesX + usFaceX;
  pFace.value.usEyesY = usEyesY + usFaceY;
  pFace.value.usMouthY = usMouthY + usFaceY;
  pFace.value.usMouthX = usMouthX + usFaceX;

  // Save offset values
  pFace.value.usEyesOffsetX = usEyesX;
  pFace.value.usEyesOffsetY = usEyesY;
  pFace.value.usMouthOffsetY = usMouthY;
  pFace.value.usMouthOffsetX = usMouthX;

  if (pFace.value.usEyesY == usFaceY || pFace.value.usMouthY == usFaceY) {
    pFace.value.fInvalidAnim = true;
  }

  pFace.value.fDisabled = false;
  pFace.value.uiLastBlink = GetJA2Clock();
  pFace.value.uiLastExpression = GetJA2Clock();
  pFace.value.uiEyelast = GetJA2Clock();
  pFace.value.fStartFrame = true;

  // Are we a soldier?
  if (pFace.value.ubSoldierID != NOBODY) {
    pFace.value.bOldSoldierLife = MercPtrs[pFace.value.ubSoldierID].value.bLife;
  }
}

export function SetAutoFaceInActiveFromSoldier(ubSoldierID: UINT8): void {
  // Check for valid soldier
  CHECKV(ubSoldierID != NOBODY);

  SetAutoFaceInActive(MercPtrs[ubSoldierID].value.iFaceIndex);
}

export function SetAutoFaceInActive(iFaceIndex: INT32): void {
  let pFace: Pointer<FACETYPE>;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Check face index
  CHECKV(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  // Check for a valid slot!
  CHECKV(pFace.value.fAllocated != false);

  // Turn off some flags
  if (pFace.value.uiFlags & FACE_INACTIVE_HANDLED_ELSEWHERE) {
    if (!pFace.value.fCanHandleInactiveNow) {
      return;
    }
  }

  if (pFace.value.uiFlags & FACE_MAKEACTIVE_ONCE_DONE) {
    //
    if (pFace.value.ubSoldierID != NOBODY) {
      pSoldier = MercPtrs[pFace.value.ubSoldierID];

      // IF we are in tactical
      if (pSoldier.value.bAssignment == iCurrentTacticalSquad && guiCurrentScreen == Enum26.GAME_SCREEN) {
        // Make the interfac panel dirty..
        // This will dirty the panel next frame...
        gfRerenderInterfaceFromHelpText = true;
      }
    }
  }

  if (pFace.value.fAutoRestoreBuffer) {
    DeleteVideoSurfaceFromIndex(pFace.value.uiAutoRestoreBuffer);
  }

  if (pFace.value.fAutoDisplayBuffer) {
    DeleteVideoSurfaceFromIndex(pFace.value.uiAutoDisplayBuffer);
  }

  if (pFace.value.iVideoOverlay != -1) {
    RemoveVideoOverlay(pFace.value.iVideoOverlay);
    pFace.value.iVideoOverlay = -1;
  }

  // Turn off some flags
  pFace.value.uiFlags &= (~FACE_INACTIVE_HANDLED_ELSEWHERE);

  // Disable!
  pFace.value.fDisabled = true;
}

export function SetAllAutoFacesInactive(): void {
  let uiCount: UINT32;
  let pFace: Pointer<FACETYPE>;

  for (uiCount = 0; uiCount < guiNumFaces; uiCount++) {
    if (gFacesData[uiCount].fAllocated) {
      pFace = addressof(gFacesData[uiCount]);

      SetAutoFaceInActive(uiCount);
    }
  }
}

function BlinkAutoFace(iFaceIndex: INT32): void {
  let pFace: Pointer<FACETYPE>;
  let sFrame: INT16;
  let fDoBlink: boolean = false;

  if (gFacesData[iFaceIndex].fAllocated && !gFacesData[iFaceIndex].fDisabled && !gFacesData[iFaceIndex].fInvalidAnim) {
    pFace = addressof(gFacesData[iFaceIndex]);

    // CHECK IF BUDDY IS DEAD, UNCONSCIOUS, ASLEEP, OR POW!
    if (pFace.value.ubSoldierID != NOBODY) {
      if ((MercPtrs[pFace.value.ubSoldierID].value.bLife < OKLIFE) || (MercPtrs[pFace.value.ubSoldierID].value.fMercAsleep == true) || (MercPtrs[pFace.value.ubSoldierID].value.bAssignment == Enum117.ASSIGNMENT_POW)) {
        return;
      }
    }

    if (pFace.value.ubExpression == NO_EXPRESSION) {
      // Get Delay time, if the first frame, use a different delay
      if ((GetJA2Clock() - pFace.value.uiLastBlink) > pFace.value.uiBlinkFrequency) {
        pFace.value.uiLastBlink = GetJA2Clock();
        pFace.value.ubExpression = BLINKING;
        pFace.value.uiEyelast = GetJA2Clock();
      }

      if (pFace.value.fAnimatingTalking) {
        if ((GetJA2Clock() - pFace.value.uiLastExpression) > pFace.value.uiExpressionFrequency) {
          pFace.value.uiLastExpression = GetJA2Clock();

          if (Random(2) == 0) {
            pFace.value.ubExpression = ANGRY;
          } else {
            pFace.value.ubExpression = SURPRISED;
          }
        }
      }
    }

    if (pFace.value.ubExpression != NO_EXPRESSION) {
      if (pFace.value.fStartFrame) {
        if ((GetJA2Clock() - pFace.value.uiEyelast) > pFace.value.uiEyeDelay) //> Random( 10000 ) )
        {
          fDoBlink = true;
          pFace.value.fStartFrame = false;
        }
      } else {
        if ((GetJA2Clock() - pFace.value.uiEyelast) > pFace.value.uiEyeDelay) {
          fDoBlink = true;
        }
      }

      // Are we going to blink?
      if (fDoBlink) {
        pFace.value.uiEyelast = GetJA2Clock();

        // Adjust
        NewEye(pFace);

        sFrame = pFace.value.sEyeFrame;

        if (sFrame >= 5) {
          sFrame = 4;
        }

        if (sFrame > 0) {
          // Blit Accordingly!
          BltVideoObjectFromIndex(pFace.value.uiAutoDisplayBuffer, pFace.value.uiVideoObject, (sFrame), pFace.value.usEyesX, pFace.value.usEyesY, VO_BLT_SRCTRANSPARENCY, null);

          if (pFace.value.uiAutoDisplayBuffer == FRAME_BUFFER) {
            InvalidateRegion(pFace.value.usEyesX, pFace.value.usEyesY, pFace.value.usEyesX + pFace.value.usEyesWidth, pFace.value.usEyesY + pFace.value.usEyesHeight);
          }
        } else {
          // RenderFace( uiDestBuffer , uiCount );
          pFace.value.ubExpression = NO_EXPRESSION;
          // Update rects just for eyes

          if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
            FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usEyesX, pFace.value.usEyesY, pFace.value.usEyesX, pFace.value.usEyesY, pFace.value.usEyesWidth, pFace.value.usEyesHeight);
          } else {
            FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usEyesX, pFace.value.usEyesY, pFace.value.usEyesOffsetX, pFace.value.usEyesOffsetY, pFace.value.usEyesWidth, pFace.value.usEyesHeight);
          }
        }

        HandleRenderFaceAdjustments(pFace, true, false, 0, pFace.value.usFaceX, pFace.value.usFaceY, pFace.value.usEyesX, pFace.value.usEyesY);
      }
    }
  }
}

function HandleFaceHilights(pFace: Pointer<FACETYPE>, uiBuffer: UINT32, sFaceX: INT16, sFaceY: INT16): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;
  let iFaceIndex: INT32;

  iFaceIndex = pFace.value.iID;

  if (!gFacesData[iFaceIndex].fDisabled) {
    if (pFace.value.uiAutoDisplayBuffer == FRAME_BUFFER && guiCurrentScreen == Enum26.GAME_SCREEN) {
      // If we are highlighted, do this now!
      if ((pFace.value.uiFlags & FACE_SHOW_WHITE_HILIGHT)) {
        // Lock buffer
        pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
        SetClippingRegionAndImageWidth(uiDestPitchBYTES, sFaceX - 2, sFaceY - 1, sFaceX + pFace.value.usFaceWidth + 4, sFaceY + pFace.value.usFaceHeight + 4);

        usLineColor = Get16BPPColor(FROMRGB(255, 255, 255));
        RectangleDraw(true, (sFaceX - 2), (sFaceY - 1), sFaceX + pFace.value.usFaceWidth + 1, sFaceY + pFace.value.usFaceHeight, usLineColor, pDestBuf);

        SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

        UnLockVideoSurface(uiBuffer);
      } else if ((pFace.value.uiFlags & FACE_SHOW_MOVING_HILIGHT)) {
        if (pFace.value.ubSoldierID != NOBODY) {
          if (MercPtrs[pFace.value.ubSoldierID].value.bLife >= OKLIFE) {
            // Lock buffer
            pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
            SetClippingRegionAndImageWidth(uiDestPitchBYTES, sFaceX - 2, sFaceY - 1, sFaceX + pFace.value.usFaceWidth + 4, sFaceY + pFace.value.usFaceHeight + 4);

            if (MercPtrs[pFace.value.ubSoldierID].value.bStealthMode) {
              usLineColor = Get16BPPColor(FROMRGB(158, 158, 12));
            } else {
              usLineColor = Get16BPPColor(FROMRGB(8, 12, 118));
            }
            RectangleDraw(true, (sFaceX - 2), (sFaceY - 1), sFaceX + pFace.value.usFaceWidth + 1, sFaceY + pFace.value.usFaceHeight, usLineColor, pDestBuf);

            SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

            UnLockVideoSurface(uiBuffer);
          }
        }
      } else {
        // ATE: Zero out any highlight boxzes....
        // Lock buffer
        pDestBuf = LockVideoSurface(pFace.value.uiAutoDisplayBuffer, addressof(uiDestPitchBYTES));
        SetClippingRegionAndImageWidth(uiDestPitchBYTES, pFace.value.usFaceX - 2, pFace.value.usFaceY - 1, pFace.value.usFaceX + pFace.value.usFaceWidth + 4, pFace.value.usFaceY + pFace.value.usFaceHeight + 4);

        usLineColor = Get16BPPColor(FROMRGB(0, 0, 0));
        RectangleDraw(true, (pFace.value.usFaceX - 2), (pFace.value.usFaceY - 1), pFace.value.usFaceX + pFace.value.usFaceWidth + 1, pFace.value.usFaceY + pFace.value.usFaceHeight, usLineColor, pDestBuf);

        SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

        UnLockVideoSurface(pFace.value.uiAutoDisplayBuffer);
      }
    }
  }

  if ((pFace.value.fCompatibleItems && !gFacesData[iFaceIndex].fDisabled)) {
    // Lock buffer
    pDestBuf = LockVideoSurface(uiBuffer, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, sFaceX - 2, sFaceY - 1, sFaceX + pFace.value.usFaceWidth + 4, sFaceY + pFace.value.usFaceHeight + 4);

    usLineColor = Get16BPPColor(FROMRGB(255, 0, 0));
    RectangleDraw(true, (sFaceX - 2), (sFaceY - 1), sFaceX + pFace.value.usFaceWidth + 1, sFaceY + pFace.value.usFaceHeight, usLineColor, pDestBuf);

    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    UnLockVideoSurface(uiBuffer);
  }
}

function MouthAutoFace(iFaceIndex: INT32): void {
  let pFace: Pointer<FACETYPE>;
  let sFrame: INT16;

  if (gFacesData[iFaceIndex].fAllocated) {
    pFace = addressof(gFacesData[iFaceIndex]);

    // Remove video overlay is present....
    if (pFace.value.uiFlags & FACE_DESTROY_OVERLAY) {
      // if ( pFace->iVideoOverlay != -1 )
      //{
      //	if ( pFace->uiStopOverlayTimer != 0 )
      //	{
      //		if ( ( GetJA2Clock( ) - pFace->uiStopOverlayTimer ) > END_FACE_OVERLAY_DELAY )
      //		{
      //	RemoveVideoOverlay( pFace->iVideoOverlay );
      //			pFace->iVideoOverlay = -1;
      //		}
      //	}
      //}
    }

    if (pFace.value.fTalking) {
      if (!gFacesData[iFaceIndex].fDisabled && !gFacesData[iFaceIndex].fInvalidAnim) {
        if (pFace.value.fAnimatingTalking) {
          PollAudioGap(pFace.value.uiSoundID, addressof(pFace.value.GapList));

          // Check if we have an audio gap
          if (pFace.value.GapList.audio_gap_active) {
            pFace.value.sMouthFrame = 0;

            if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
              FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
            } else {
              FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthOffsetX, pFace.value.usMouthOffsetY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
            }
          } else {
            // Get Delay time
            if ((GetJA2Clock() - pFace.value.uiMouthlast) > pFace.value.uiMouthDelay) {
              pFace.value.uiMouthlast = GetJA2Clock();

              // Adjust
              NewMouth(pFace);

              sFrame = pFace.value.sMouthFrame;

              if (sFrame > 0) {
                // Blit Accordingly!
                BltVideoObjectFromIndex(pFace.value.uiAutoDisplayBuffer, pFace.value.uiVideoObject, (sFrame + 4), pFace.value.usMouthX, pFace.value.usMouthY, VO_BLT_SRCTRANSPARENCY, null);

                // Update rects
                if (pFace.value.uiAutoDisplayBuffer == FRAME_BUFFER) {
                  InvalidateRegion(pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthX + pFace.value.usMouthWidth, pFace.value.usMouthY + pFace.value.usMouthHeight);
                }
              } else {
                // RenderFace( uiDestBuffer , uiCount );
                // pFace->fTaking = FALSE;
                // Update rects just for Mouth
                if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
                  FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
                } else {
                  FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthOffsetX, pFace.value.usMouthOffsetY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
                }
              }

              HandleRenderFaceAdjustments(pFace, true, false, 0, pFace.value.usFaceX, pFace.value.usFaceY, pFace.value.usEyesX, pFace.value.usEyesY);
            }
          }
        }
      }
    }

    if (!(pFace.value.uiFlags & FACE_INACTIVE_HANDLED_ELSEWHERE)) {
      HandleFaceHilights(pFace, pFace.value.uiAutoDisplayBuffer, pFace.value.usFaceX, pFace.value.usFaceY);
    }
  }
}

function HandleTalkingAutoFace(iFaceIndex: INT32): void {
  let pFace: Pointer<FACETYPE>;

  if (gFacesData[iFaceIndex].fAllocated) {
    pFace = addressof(gFacesData[iFaceIndex]);

    if (pFace.value.fTalking) {
      // Check if we are done!	( Check this first! )
      if (pFace.value.fValidSpeech) {
        // Check if we have finished, set some flags for the final delay down if so!
        if (!SoundIsPlaying(pFace.value.uiSoundID) && !pFace.value.fFinishTalking) {
          SetupFinalTalkingDelay(pFace);
        }
      } else {
        // Check if our delay is over
        if (!pFace.value.fFinishTalking) {
          if ((GetJA2Clock() - pFace.value.uiTalkingTimer) > pFace.value.uiTalkingDuration) {
            // If here, setup for last delay!
            SetupFinalTalkingDelay(pFace);
          }
        }
      }

      // Now check for end of talking
      if (pFace.value.fFinishTalking) {
        if ((GetJA2Clock() - pFace.value.uiTalkingTimer) > pFace.value.uiTalkingDuration) {
          pFace.value.fTalking = false;
          pFace.value.fAnimatingTalking = false;

          // Remove gap info
          AudioGapListDone(addressof(pFace.value.GapList));

          // Remove video overlay is present....
          if (pFace.value.iVideoOverlay != -1) {
            // if ( pFace->uiStopOverlayTimer == 0 )
            //{
            //	pFace->uiStopOverlayTimer = GetJA2Clock();
            //}
          }

          // Call dialogue handler function
          HandleDialogueEnd(pFace);
        }
      }
    }
  }
}

// Local function - uses these variables because they have already been validated
function SetFaceShade(pSoldier: Pointer<SOLDIERTYPE>, pFace: Pointer<FACETYPE>, fExternBlit: boolean): void {
  // Set to default
  SetObjectHandleShade(pFace.value.uiVideoObject, FLASH_PORTRAIT_NOSHADE);

  if (pFace.value.iVideoOverlay == -1 && !fExternBlit) {
    if ((pSoldier.value.bActionPoints == 0) && !(gTacticalStatus.uiFlags & REALTIME) && (gTacticalStatus.uiFlags & INCOMBAT)) {
      SetObjectHandleShade(pFace.value.uiVideoObject, FLASH_PORTRAIT_LITESHADE);
    }
  }

  if (pSoldier.value.bLife < OKLIFE) {
    SetObjectHandleShade(pFace.value.uiVideoObject, FLASH_PORTRAIT_DARKSHADE);
  }

  // ATE: Don't shade for damage if blitting extern face...
  if (!fExternBlit) {
    if (pSoldier.value.fFlashPortrait == FLASH_PORTRAIT_START) {
      SetObjectHandleShade(pFace.value.uiVideoObject, pSoldier.value.bFlashPortraitFrame);
    }
  }
}

export function RenderAutoFaceFromSoldier(ubSoldierID: UINT8): boolean {
  // Check for valid soldier
  CHECKF(ubSoldierID != NOBODY);

  return RenderAutoFace(MercPtrs[ubSoldierID].value.iFaceIndex);
}

function GetXYForIconPlacement(pFace: Pointer<FACETYPE>, ubIndex: UINT16, sFaceX: INT16, sFaceY: INT16, psX: Pointer<INT16>, psY: Pointer<INT16>): void {
  let sX: INT16;
  let sY: INT16;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let pTrav: Pointer<ETRLEObject>;
  let hVObject: HVOBJECT;

  // Get height, width of icon...
  GetVideoObject(addressof(hVObject), guiPORTRAITICONS);
  pTrav = addressof(hVObject.value.pETRLEObject[ubIndex]);
  usHeight = pTrav.value.usHeight;
  usWidth = pTrav.value.usWidth;

  sX = sFaceX + pFace.value.usFaceWidth - usWidth - 1;
  sY = sFaceY + pFace.value.usFaceHeight - usHeight - 1;

  psX.value = sX;
  psY.value = sY;
}

function GetXYForRightIconPlacement(pFace: Pointer<FACETYPE>, ubIndex: UINT16, sFaceX: INT16, sFaceY: INT16, psX: Pointer<INT16>, psY: Pointer<INT16>, bNumIcons: INT8): void {
  let sX: INT16;
  let sY: INT16;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let pTrav: Pointer<ETRLEObject>;
  let hVObject: HVOBJECT;

  // Get height, width of icon...
  GetVideoObject(addressof(hVObject), guiPORTRAITICONS);
  pTrav = addressof(hVObject.value.pETRLEObject[ubIndex]);
  usHeight = pTrav.value.usHeight;
  usWidth = pTrav.value.usWidth;

  sX = sFaceX + (usWidth * bNumIcons) + 1;
  sY = sFaceY + pFace.value.usFaceHeight - usHeight - 1;

  psX.value = sX;
  psY.value = sY;
}

function DoRightIcon(uiRenderBuffer: UINT32, pFace: Pointer<FACETYPE>, sFaceX: INT16, sFaceY: INT16, bNumIcons: INT8, sIconIndex: INT8): void {
  let sIconX: INT16;
  let sIconY: INT16;

  // Find X, y for placement
  GetXYForRightIconPlacement(pFace, sIconIndex, sFaceX, sFaceY, addressof(sIconX), addressof(sIconY), bNumIcons);
  BltVideoObjectFromIndex(uiRenderBuffer, guiPORTRAITICONS, sIconIndex, sIconX, sIconY, VO_BLT_SRCTRANSPARENCY, null);
}

function HandleRenderFaceAdjustments(pFace: Pointer<FACETYPE>, fDisplayBuffer: boolean, fUseExternBuffer: boolean, uiBuffer: UINT32, sFaceX: INT16, sFaceY: INT16, usEyesX: UINT16, usEyesY: UINT16): void {
  let sIconX: INT16;
  let sIconY: INT16;
  let sIconIndex: INT16 = -1;
  let fDoIcon: boolean = false;
  let uiRenderBuffer: UINT32;
  let sPtsAvailable: INT16 = 0;
  let usMaximumPts: UINT16 = 0;
  let sString: string /* CHAR16[32] */;
  let usTextWidth: UINT16;
  let fAtGunRange: boolean = false;
  let fShowNumber: boolean = false;
  let fShowMaximum: boolean = false;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sFontX: INT16;
  let sFontY: INT16;
  let sX1: INT16;
  let sY1: INT16;
  let sY2: INT16;
  let sX2: INT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usLineColor: UINT16;
  let bNumRightIcons: INT8 = 0;

  // If we are using an extern buffer...
  if (fUseExternBuffer) {
    uiRenderBuffer = uiBuffer;
  } else {
    if (fDisplayBuffer) {
      uiRenderBuffer = pFace.value.uiAutoDisplayBuffer;
    } else {
      uiRenderBuffer = pFace.value.uiAutoRestoreBuffer;

      if (pFace.value.uiAutoRestoreBuffer == FACE_NO_RESTORE_BUFFER) {
        return;
      }
    }
  }

  // BLIT HATCH
  if (pFace.value.ubSoldierID != NOBODY) {
    pSoldier = MercPtrs[pFace.value.ubSoldierID];

    if ((MercPtrs[pFace.value.ubSoldierID].value.bLife < CONSCIOUSNESS || MercPtrs[pFace.value.ubSoldierID].value.fDeadPanel)) {
      // Blit Closed eyes here!
      BltVideoObjectFromIndex(uiRenderBuffer, pFace.value.uiVideoObject, 1, usEyesX, usEyesY, VO_BLT_SRCTRANSPARENCY, null);

      // Blit hatch!
      BltVideoObjectFromIndex(uiRenderBuffer, guiHATCH, 0, sFaceX, sFaceY, VO_BLT_SRCTRANSPARENCY, null);
    }

    if (MercPtrs[pFace.value.ubSoldierID].value.fMercAsleep == true) {
      // blit eyes closed
      BltVideoObjectFromIndex(uiRenderBuffer, pFace.value.uiVideoObject, 1, usEyesX, usEyesY, VO_BLT_SRCTRANSPARENCY, null);
    }

    if ((pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
      // IF we are in the process of doing any deal/close animations, show face, not skill...
      if (!pSoldier.value.fClosePanel && !pSoldier.value.fDeadPanel && !pSoldier.value.fUIdeadMerc && !pSoldier.value.fUICloseMerc) {
        // Put close panel there
        BltVideoObjectFromIndex(uiRenderBuffer, guiDEAD, 5, sFaceX, sFaceY, VO_BLT_SRCTRANSPARENCY, null);

        // Blit hatch!
        BltVideoObjectFromIndex(uiRenderBuffer, guiHATCH, 0, sFaceX, sFaceY, VO_BLT_SRCTRANSPARENCY, null);
      }
    }

    // ATE: If talking in popup, don't do the other things.....
    if (pFace.value.fTalking && gTacticalStatus.uiFlags & IN_ENDGAME_SEQUENCE) {
      return;
    }

    // ATE: Only do this, because we can be talking during an interrupt....
    if ((pFace.value.uiFlags & FACE_INACTIVE_HANDLED_ELSEWHERE) && !fUseExternBuffer) {
      // Don't do this if we are being handled elsewhere and it's not an extern buffer...
    } else {
      HandleFaceHilights(pFace, uiRenderBuffer, sFaceX, sFaceY);

      if (pSoldier.value.bOppCnt > 0)
      {
        SetFontDestBuffer(uiRenderBuffer, 0, 0, 640, 480, false);

        swprintf(sString, "%d", pSoldier.value.bOppCnt);

        SetFont(TINYFONT1());
        SetFontForeground(FONT_DKRED);
        SetFontBackground(FONT_NEARBLACK);

        sX1 = (sFaceX);
        sY1 = (sFaceY);

        sX2 = sX1 + StringPixLength(sString, TINYFONT1()) + 1;
        sY2 = sY1 + GetFontHeight(TINYFONT1()) - 1;

        mprintf((sX1 + 1), (sY1 - 1), sString);
        SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

        // Draw box
        pDestBuf = LockVideoSurface(uiRenderBuffer, addressof(uiDestPitchBYTES));
        SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

        usLineColor = Get16BPPColor(FROMRGB(105, 8, 9));
        RectangleDraw(true, sX1, sY1, sX2, sY2, usLineColor, pDestBuf);

        UnLockVideoSurface(uiRenderBuffer);
      }

      if (MercPtrs[pFace.value.ubSoldierID].value.bInSector && (((gTacticalStatus.ubCurrentTeam != OUR_TEAM) || !OK_INTERRUPT_MERC(MercPtrs[pFace.value.ubSoldierID])) && !gfHiddenInterrupt) || ((gfSMDisableForItems && !gfInItemPickupMenu) && gusSMCurrentMerc == pFace.value.ubSoldierID && gsCurInterfacePanel == Enum215.SM_PANEL)) {
        // Blit hatch!
        BltVideoObjectFromIndex(uiRenderBuffer, guiHATCH, 0, sFaceX, sFaceY, VO_BLT_SRCTRANSPARENCY, null);
      }

      if (!pFace.value.fDisabled && !pFace.value.fInvalidAnim) {
        // Render text above here if that's what was asked for
        if (pFace.value.fDisplayTextOver != FACE_NO_TEXT_OVER) {
          SetFont(TINYFONT1());
          SetFontBackground(FONT_MCOLOR_BLACK);
          SetFontForeground(FONT_MCOLOR_WHITE);

          SetFontDestBuffer(uiRenderBuffer, 0, 0, 640, 480, false);

          VarFindFontCenterCoordinates(sFaceX, sFaceY, pFace.value.usFaceWidth, pFace.value.usFaceHeight, TINYFONT1(), addressof(sFontX), addressof(sFontY), pFace.value.zDisplayText);

          if (pFace.value.fDisplayTextOver == FACE_DRAW_TEXT_OVER) {
            gprintfinvalidate(sFontX, sFontY, pFace.value.zDisplayText);
            mprintf(sFontX, sFontY, pFace.value.zDisplayText);
          } else if (pFace.value.fDisplayTextOver == FACE_ERASE_TEXT_OVER) {
            gprintfRestore(sFontX, sFontY, pFace.value.zDisplayText);
            pFace.value.fDisplayTextOver = FACE_NO_TEXT_OVER;
          }

          SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
        }
      }
    }

    // Check if a robot and is not controlled....
    if (MercPtrs[pFace.value.ubSoldierID].value.uiStatusFlags & SOLDIER_ROBOT) {
      if (!CanRobotBeControlled(MercPtrs[pFace.value.ubSoldierID])) {
        // Not controlled robot
        sIconIndex = 5;
        fDoIcon = true;
      }
    }

    if (ControllingRobot(MercPtrs[pFace.value.ubSoldierID])) {
      // controlling robot
      sIconIndex = 4;
      fDoIcon = true;
    }

    // If blind...
    if (MercPtrs[pFace.value.ubSoldierID].value.bBlindedCounter > 0) {
      DoRightIcon(uiRenderBuffer, pFace, sFaceX, sFaceY, bNumRightIcons, 6);
      bNumRightIcons++;
    }

    if (MercPtrs[pFace.value.ubSoldierID].value.bDrugEffect[DRUG_TYPE_ADRENALINE]) {
      DoRightIcon(uiRenderBuffer, pFace, sFaceX, sFaceY, bNumRightIcons, 7);
      bNumRightIcons++;
    }

    if (GetDrunkLevel(MercPtrs[pFace.value.ubSoldierID]) != SOBER) {
      DoRightIcon(uiRenderBuffer, pFace, sFaceX, sFaceY, bNumRightIcons, 8);
      bNumRightIcons++;
    }

    switch (pSoldier.value.bAssignment) {
      case Enum117.DOCTOR:

        sIconIndex = 1;
        fDoIcon = true;
        sPtsAvailable = CalculateHealingPointsForDoctor(MercPtrs[pFace.value.ubSoldierID], addressof(usMaximumPts), false);
        fShowNumber = true;
        fShowMaximum = true;

        // divide both amounts by 10 to make the displayed numbers a little more user-palatable (smaller)
        sPtsAvailable = (sPtsAvailable + 5) / 10;
        usMaximumPts = (usMaximumPts + 5) / 10;
        break;

      case Enum117.PATIENT:

        sIconIndex = 2;
        fDoIcon = true;
        // show current health / maximum health
        sPtsAvailable = MercPtrs[pFace.value.ubSoldierID].value.bLife;
        usMaximumPts = MercPtrs[pFace.value.ubSoldierID].value.bLifeMax;
        fShowNumber = true;
        fShowMaximum = true;
        break;

      case Enum117.TRAIN_SELF:
      case Enum117.TRAIN_TOWN:
      case Enum117.TRAIN_TEAMMATE:
      case Enum117.TRAIN_BY_OTHER:
        sIconIndex = 3;
        fDoIcon = true;
        fShowNumber = true;
        fShowMaximum = true;
        // there could be bonus pts for training at gun range
        if ((MercPtrs[pFace.value.ubSoldierID].value.sSectorX == 13) && (MercPtrs[pFace.value.ubSoldierID].value.sSectorY == MAP_ROW_H) && (MercPtrs[pFace.value.ubSoldierID].value.bSectorZ == 0)) {
          fAtGunRange = true;
        }

        switch (MercPtrs[pFace.value.ubSoldierID].value.bAssignment) {
          case (Enum117.TRAIN_SELF):
            sPtsAvailable = GetSoldierTrainingPts(MercPtrs[pFace.value.ubSoldierID], MercPtrs[pFace.value.ubSoldierID].value.bTrainStat, fAtGunRange, addressof(usMaximumPts));
            break;
          case (Enum117.TRAIN_BY_OTHER):
            sPtsAvailable = GetSoldierStudentPts(MercPtrs[pFace.value.ubSoldierID], MercPtrs[pFace.value.ubSoldierID].value.bTrainStat, fAtGunRange, addressof(usMaximumPts));
            break;
          case (Enum117.TRAIN_TOWN):
            sPtsAvailable = GetTownTrainPtsForCharacter(MercPtrs[pFace.value.ubSoldierID], addressof(usMaximumPts));
            // divide both amounts by 10 to make the displayed numbers a little more user-palatable (smaller)
            sPtsAvailable = (sPtsAvailable + 5) / 10;
            usMaximumPts = (usMaximumPts + 5) / 10;
            break;
          case (Enum117.TRAIN_TEAMMATE):
            sPtsAvailable = GetBonusTrainingPtsDueToInstructor(MercPtrs[pFace.value.ubSoldierID], null, MercPtrs[pFace.value.ubSoldierID].value.bTrainStat, fAtGunRange, addressof(usMaximumPts));
            break;
        }
        break;

      case Enum117.REPAIR:

        sIconIndex = 0;
        fDoIcon = true;
        sPtsAvailable = CalculateRepairPointsForRepairman(MercPtrs[pFace.value.ubSoldierID], addressof(usMaximumPts), false);
        fShowNumber = true;
        fShowMaximum = true;

        // check if we are repairing a vehicle
        if (Menptr[pFace.value.ubSoldierID].bVehicleUnderRepairID != -1) {
          // reduce to a multiple of VEHICLE_REPAIR_POINTS_DIVISOR.  This way skill too low will show up as 0 repair pts.
          sPtsAvailable -= (sPtsAvailable % VEHICLE_REPAIR_POINTS_DIVISOR);
          usMaximumPts -= (usMaximumPts % VEHICLE_REPAIR_POINTS_DIVISOR);
        }

        break;
    }

    // Check for being serviced...
    if (MercPtrs[pFace.value.ubSoldierID].value.ubServicePartner != NOBODY) {
      // Doctor...
      sIconIndex = 1;
      fDoIcon = true;
    }

    if (MercPtrs[pFace.value.ubSoldierID].value.ubServiceCount != 0) {
      // Patient
      sIconIndex = 2;
      fDoIcon = true;
    }

    if (fDoIcon) {
      // Find X, y for placement
      GetXYForIconPlacement(pFace, sIconIndex, sFaceX, sFaceY, addressof(sIconX), addressof(sIconY));
      BltVideoObjectFromIndex(uiRenderBuffer, guiPORTRAITICONS, sIconIndex, sIconX, sIconY, VO_BLT_SRCTRANSPARENCY, null);

      // ATE: Show numbers only in mapscreen
      if (fShowNumber) {
        SetFontDestBuffer(uiRenderBuffer, 0, 0, 640, 480, false);

        if (fShowMaximum) {
          swprintf(sString, "%d/%d", sPtsAvailable, usMaximumPts);
        } else {
          swprintf(sString, "%d", sPtsAvailable);
        }

        usTextWidth = StringPixLength(sString, FONT10ARIAL());
        usTextWidth += 1;

        SetFont(FONT10ARIAL());
        SetFontForeground(FONT_YELLOW);
        SetFontBackground(FONT_BLACK);

        mprintf(sFaceX + pFace.value.usFaceWidth - usTextWidth, (sFaceY + 3), sString);
        SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);
      }
    }
  } else {
    if (pFace.value.ubCharacterNum == Enum268.FATHER || pFace.value.ubCharacterNum == Enum268.MICKY) {
      if (gMercProfiles[pFace.value.ubCharacterNum].bNPCData >= 5) {
        DoRightIcon(uiRenderBuffer, pFace, sFaceX, sFaceY, 0, 8);
      }
    }
  }
}

export function RenderAutoFace(iFaceIndex: INT32): boolean {
  let pFace: Pointer<FACETYPE>;

  // Check face index
  CHECKF(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  // Check for a valid slot!
  CHECKF(pFace.value.fAllocated != false);

  // Check for disabled guy!
  CHECKF(pFace.value.fDisabled != true);

  // Set shade
  if (pFace.value.ubSoldierID != NOBODY) {
    SetFaceShade(MercPtrs[pFace.value.ubSoldierID], pFace, false);
  }

  // Blit face to save buffer!
  if (pFace.value.uiAutoRestoreBuffer != FACE_NO_RESTORE_BUFFER) {
    if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
      BltVideoObjectFromIndex(pFace.value.uiAutoRestoreBuffer, pFace.value.uiVideoObject, 0, pFace.value.usFaceX, pFace.value.usFaceY, VO_BLT_SRCTRANSPARENCY, null);
    } else {
      BltVideoObjectFromIndex(pFace.value.uiAutoRestoreBuffer, pFace.value.uiVideoObject, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
    }
  }

  HandleRenderFaceAdjustments(pFace, false, false, 0, pFace.value.usFaceX, pFace.value.usFaceY, pFace.value.usEyesX, pFace.value.usEyesY);

  // Restore extern rect
  if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
    FaceRestoreSavedBackgroundRect(iFaceIndex, (pFace.value.usFaceX), (pFace.value.usFaceY), (pFace.value.usFaceX), (pFace.value.usFaceY), (pFace.value.usFaceWidth), (pFace.value.usFaceHeight));
  } else {
    FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usFaceX, pFace.value.usFaceY, 0, 0, pFace.value.usFaceWidth, pFace.value.usFaceHeight);
  }

  return true;
}

export function ExternRenderFaceFromSoldier(uiBuffer: UINT32, ubSoldierID: UINT8, sX: INT16, sY: INT16): boolean {
  // Check for valid soldier
  CHECKF(ubSoldierID != NOBODY);

  return ExternRenderFace(uiBuffer, MercPtrs[ubSoldierID].value.iFaceIndex, sX, sY);
}

function ExternRenderFace(uiBuffer: UINT32, iFaceIndex: INT32, sX: INT16, sY: INT16): boolean {
  let usEyesX: UINT16;
  let usEyesY: UINT16;
  let usMouthX: UINT16;
  let usMouthY: UINT16;
  let pFace: Pointer<FACETYPE>;

  // Check face index
  CHECKF(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  // Check for a valid slot!
  CHECKF(pFace.value.fAllocated != false);

  // Here, any face can be rendered, even if disabled

  // Set shade
  if (pFace.value.ubSoldierID != NOBODY) {
    SetFaceShade(MercPtrs[pFace.value.ubSoldierID], pFace, true);
  }

  // Blit face to save buffer!
  BltVideoObjectFromIndex(uiBuffer, pFace.value.uiVideoObject, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);

  GetFaceRelativeCoordinates(pFace, addressof(usEyesX), addressof(usEyesY), addressof(usMouthX), addressof(usMouthY));

  HandleRenderFaceAdjustments(pFace, false, true, uiBuffer, sX, sY, (sX + usEyesX), (sY + usEyesY));

  // Restore extern rect
  if (uiBuffer == guiSAVEBUFFER) {
    RestoreExternBackgroundRect(sX, sY, pFace.value.usFaceWidth, pFace.value.usFaceWidth);
  }

  return true;
}

function NewEye(pFace: Pointer<FACETYPE>): void {
  switch (pFace.value.sEyeFrame) {
    case 0: // pFace->sEyeFrame = (INT16)Random(2);	// normal - can blink or frown
      if (pFace.value.ubExpression == ANGRY) {
        pFace.value.ubEyeWait = 0;
        pFace.value.sEyeFrame = 3;
      } else if (pFace.value.ubExpression == SURPRISED) {
        pFace.value.ubEyeWait = 0;
        pFace.value.sEyeFrame = 4;
      } else
        // if (pFace->sEyeFrame && Talk.talking && Talk.expression != DYING)
        ///    pFace->sEyeFrame = 3;
        // else
        pFace.value.sEyeFrame = 1;
      break;
    case 1: // starting to blink  - has to finish unless dying
            // if (Talk.expression == DYING)
            //    pFace->sEyeFrame = 1;
            // else
      pFace.value.sEyeFrame = 2;
      break;
    case 2: // pFace->sEyeFrame = (INT16)Random(2);	// finishing blink - can go normal or frown
            // if (pFace->sEyeFrame && Talk.talking)
            //    pFace->sEyeFrame = 3;
            // else
            //   if (Talk.expression == ANGRY)
            // pFace->sEyeFrame = 3;
      //   else
      pFace.value.sEyeFrame = 0;
      break;

    case 3: // pFace->sEyeFrame = 4; break;	// frown

      pFace.value.ubEyeWait++;

      if (pFace.value.ubEyeWait > 6) {
        pFace.value.sEyeFrame = 0;
      }
      break;

    case 4:

      pFace.value.ubEyeWait++;

      if (pFace.value.ubEyeWait > 6) {
        pFace.value.sEyeFrame = 0;
      }
      break;

    case 5:
      pFace.value.sEyeFrame = 6;

      pFace.value.sEyeFrame = 0;
      break;

    case 6:
      pFace.value.sEyeFrame = 7;
      break;
    case 7:
      pFace.value.sEyeFrame = Random(2); // can stop frowning or continue
      // if (pFace->sEyeFrame && Talk.expression != DYING)
      //   pFace->sEyeFrame = 8;
      // else
      //    pFace->sEyeFrame = 0;
      // break;
    case 8:
      pFace.value.sEyeFrame = 9;
      break;
    case 9:
      pFace.value.sEyeFrame = 10;
      break;
    case 10:
      pFace.value.sEyeFrame = 11;
      break;
    case 11:
      pFace.value.sEyeFrame = 12;
      break;
    case 12:
      pFace.value.sEyeFrame = 0;
      break;
  }
}

function NewMouth(pFace: Pointer<FACETYPE>): void {
  let OK: boolean = false;
  let sOld: UINT16 = pFace.value.sMouthFrame;

  // if (audio_gap_active == 1)
  //  {
  //   Talk.mouth = 0;
  //   return;
  //  }

  do {
    // Talk.mouth = random(4);

    pFace.value.sMouthFrame = Random(6);

    if (pFace.value.sMouthFrame > 3) {
      pFace.value.sMouthFrame = 0;
    }

    switch (sOld) {
      case 0:
        if (pFace.value.sMouthFrame != 0)
          OK = true;
        break;
      case 1:
        if (pFace.value.sMouthFrame != 1)
          OK = true;
        break;
      case 2:
        if (pFace.value.sMouthFrame != 2)
          OK = true;
        break;
      case 3:
        if (pFace.value.sMouthFrame != 3)
          OK = true;
        break;
    }
  } while (!OK);
}

export function HandleAutoFaces(): void {
  let uiCount: UINT32;
  let pFace: Pointer<FACETYPE>;
  let bLife: INT8;
  let bInSector: INT8;
  let bAPs: INT8;
  let fRerender: boolean = false;
  let fHandleFace: boolean;
  let fHandleUIHatch: boolean;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (uiCount = 0; uiCount < guiNumFaces; uiCount++) {
    fRerender = false;
    fHandleFace = true;
    fHandleUIHatch = false;

    // OK, NOW, check if our bLife status has changed, re-render if so!
    if (gFacesData[uiCount].fAllocated) {
      pFace = addressof(gFacesData[uiCount]);

      // Are we a soldier?
      if (pFace.value.ubSoldierID != NOBODY) {
        // Get Life now
        pSoldier = MercPtrs[pFace.value.ubSoldierID];
        bLife = pSoldier.value.bLife;
        bInSector = pSoldier.value.bInSector;
        bAPs = pSoldier.value.bActionPoints;

        if (pSoldier.value.ubID == gsSelectedGuy && gfUIHandleSelectionAboveGuy) {
          pFace.value.uiFlags |= FACE_SHOW_WHITE_HILIGHT;
        } else {
          pFace.value.uiFlags &= (~FACE_SHOW_WHITE_HILIGHT);
        }

        if (pSoldier.value.sGridNo != pSoldier.value.sFinalDestination && pSoldier.value.sGridNo != NOWHERE) {
          pFace.value.uiFlags |= FACE_SHOW_MOVING_HILIGHT;
        } else {
          pFace.value.uiFlags &= (~FACE_SHOW_MOVING_HILIGHT);
        }

        if (pSoldier.value.bStealthMode != pFace.value.bOldStealthMode) {
          fRerender = true;
        }

        // Check if we have fallen below OKLIFE...
        if (bLife < OKLIFE && pFace.value.bOldSoldierLife >= OKLIFE) {
          fRerender = true;
        }

        if (bLife >= OKLIFE && pFace.value.bOldSoldierLife < OKLIFE) {
          fRerender = true;
        }

        // Check if we have fallen below CONSCIOUSNESS
        if (bLife < CONSCIOUSNESS && pFace.value.bOldSoldierLife >= CONSCIOUSNESS) {
          fRerender = true;
        }

        if (bLife >= CONSCIOUSNESS && pFace.value.bOldSoldierLife < CONSCIOUSNESS) {
          fRerender = true;
        }

        if (pSoldier.value.bOppCnt != pFace.value.bOldOppCnt) {
          fRerender = true;
        }

        // Check if assignment is idfferent....
        if (pSoldier.value.bAssignment != pFace.value.bOldAssignment) {
          pFace.value.bOldAssignment = pSoldier.value.bAssignment;
          fRerender = true;
        }

        // Check if we have fallen below CONSCIOUSNESS
        if (bAPs == 0 && pFace.value.bOldActionPoints > 0) {
          fRerender = true;
        }

        if (bAPs > 0 && pFace.value.bOldActionPoints == 0) {
          fRerender = true;
        }

        if (!(pFace.value.uiFlags & FACE_SHOW_WHITE_HILIGHT) && pFace.value.fOldShowHighlight) {
          fRerender = true;
        }

        if ((pFace.value.uiFlags & FACE_SHOW_WHITE_HILIGHT) && !(pFace.value.fOldShowHighlight)) {
          fRerender = true;
        }

        if (!(pFace.value.uiFlags & FACE_SHOW_MOVING_HILIGHT) && pFace.value.fOldShowMoveHilight) {
          fRerender = true;
        }

        if ((pFace.value.uiFlags & FACE_SHOW_MOVING_HILIGHT) && !(pFace.value.fOldShowMoveHilight)) {
          fRerender = true;
        }

        if (pFace.value.ubOldServiceCount != pSoldier.value.ubServiceCount) {
          fRerender = true;
          pFace.value.ubOldServiceCount = pSoldier.value.ubServiceCount;
        }

        if (pFace.value.fOldCompatibleItems != pFace.value.fCompatibleItems || gfInItemPickupMenu || gpItemPointer != null) {
          fRerender = true;
          pFace.value.fOldCompatibleItems = pFace.value.fCompatibleItems;
        }

        if (pFace.value.ubOldServicePartner != pSoldier.value.ubServicePartner) {
          fRerender = true;
          pFace.value.ubOldServicePartner = pSoldier.value.ubServicePartner;
        }

        pFace.value.fOldHandleUIHatch = fHandleUIHatch;
        pFace.value.bOldSoldierLife = bLife;
        pFace.value.bOldActionPoints = bAPs;
        pFace.value.bOldStealthMode = pSoldier.value.bStealthMode;
        pFace.value.bOldOppCnt = pSoldier.value.bOppCnt;

        if (pFace.value.uiFlags & FACE_SHOW_WHITE_HILIGHT) {
          pFace.value.fOldShowHighlight = true;
        } else {
          pFace.value.fOldShowHighlight = false;
        }

        if (pFace.value.uiFlags & FACE_SHOW_MOVING_HILIGHT) {
          pFace.value.fOldShowMoveHilight = true;
        } else {
          pFace.value.fOldShowMoveHilight = false;
        }

        if (pSoldier.value.fGettingHit && pSoldier.value.fFlashPortrait == FLASH_PORTRAIT_STOP) {
          pSoldier.value.fFlashPortrait = true;
          pSoldier.value.bFlashPortraitFrame = FLASH_PORTRAIT_STARTSHADE;
          RESETTIMECOUNTER(pSoldier.value.PortraitFlashCounter, FLASH_PORTRAIT_DELAY);
          fRerender = true;
        }
        if (pSoldier.value.fFlashPortrait == FLASH_PORTRAIT_START) {
          // Loop through flash values
          if (TIMECOUNTERDONE(pSoldier.value.PortraitFlashCounter, FLASH_PORTRAIT_DELAY)) {
            RESETTIMECOUNTER(pSoldier.value.PortraitFlashCounter, FLASH_PORTRAIT_DELAY);
            pSoldier.value.bFlashPortraitFrame++;

            if (pSoldier.value.bFlashPortraitFrame > FLASH_PORTRAIT_ENDSHADE) {
              pSoldier.value.bFlashPortraitFrame = FLASH_PORTRAIT_ENDSHADE;

              if (pSoldier.value.fGettingHit) {
                pSoldier.value.fFlashPortrait = FLASH_PORTRAIT_WAITING;
              } else {
                // Render face again!
                pSoldier.value.fFlashPortrait = FLASH_PORTRAIT_STOP;
              }

              fRerender = true;
            }
          }
        }
        // CHECK IF WE WERE WAITING FOR GETTING HIT TO FINISH!
        if (!pSoldier.value.fGettingHit && pSoldier.value.fFlashPortrait == FLASH_PORTRAIT_WAITING) {
          pSoldier.value.fFlashPortrait = false;
          fRerender = true;
        }

        if (pSoldier.value.fFlashPortrait == FLASH_PORTRAIT_START) {
          fRerender = true;
        }

        if (pFace.value.uiFlags & FACE_REDRAW_WHOLE_FACE_NEXT_FRAME) {
          pFace.value.uiFlags &= ~FACE_REDRAW_WHOLE_FACE_NEXT_FRAME;

          fRerender = true;
        }

        if (fInterfacePanelDirty == DIRTYLEVEL2 && guiCurrentScreen == Enum26.GAME_SCREEN) {
          fRerender = true;
        }

        if (fRerender) {
          RenderAutoFace(uiCount);
        }

        if (bLife < CONSCIOUSNESS) {
          fHandleFace = false;
        }
      }

      if (fHandleFace) {
        BlinkAutoFace(uiCount);
      }

      MouthAutoFace(uiCount);
    }
  }
}

export function HandleTalkingAutoFaces(): void {
  let uiCount: UINT32;
  let pFace: Pointer<FACETYPE>;

  for (uiCount = 0; uiCount < guiNumFaces; uiCount++) {
    // OK, NOW, check if our bLife status has changed, re-render if so!
    if (gFacesData[uiCount].fAllocated) {
      pFace = addressof(gFacesData[uiCount]);

      HandleTalkingAutoFace(uiCount);
    }
  }
}

function FaceRestoreSavedBackgroundRect(iFaceIndex: INT32, sDestLeft: INT16, sDestTop: INT16, sSrcLeft: INT16, sSrcTop: INT16, sWidth: INT16, sHeight: INT16): boolean {
  let pFace: Pointer<FACETYPE>;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;

  // Check face index
  CHECKF(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  // DOn't continue if we do not want the resotre to happen ( ei blitting entrie thing every frame...
  if (pFace.value.uiAutoRestoreBuffer == FACE_NO_RESTORE_BUFFER) {
    return false;
  }

  pDestBuf = LockVideoSurface(pFace.value.uiAutoDisplayBuffer, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(pFace.value.uiAutoRestoreBuffer, addressof(uiSrcPitchBYTES));

  Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, sDestLeft, sDestTop, sSrcLeft, sSrcTop, sWidth, sHeight);

  UnLockVideoSurface(pFace.value.uiAutoDisplayBuffer);
  UnLockVideoSurface(pFace.value.uiAutoRestoreBuffer);

  // Add rect to frame buffer queue
  if (pFace.value.uiAutoDisplayBuffer == FRAME_BUFFER) {
    InvalidateRegionEx(sDestLeft - 2, sDestTop - 2, (sDestLeft + sWidth + 3), (sDestTop + sHeight + 2), 0);
  }
  return true;
}

export function SetFaceTalking(iFaceIndex: INT32, zSoundFile: string /* Pointer<CHAR8> */, zTextString: string /* STR16 */, usRate: UINT32, ubVolume: UINT32, ubLoops: UINT32, uiPan: UINT32): boolean {
  let pFace: Pointer<FACETYPE>;

  pFace = addressof(gFacesData[iFaceIndex]);

  // Set face to talking
  pFace.value.fTalking = true;
  pFace.value.fAnimatingTalking = true;
  pFace.value.fFinishTalking = false;

  if (!AreInMeanwhile()) {
    TurnOnSectorLocator(pFace.value.ubCharacterNum);
  }

  // Play sample
  if (gGameSettings.fOptions[Enum8.TOPTION_SPEECH])
    pFace.value.uiSoundID = PlayJA2GapSample(zSoundFile, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN, addressof(pFace.value.GapList));
  else
    pFace.value.uiSoundID = SOUND_ERROR;

  if (pFace.value.uiSoundID != SOUND_ERROR) {
    pFace.value.fValidSpeech = true;

    pFace.value.uiTalkingFromVeryBeginningTimer = GetJA2Clock();
  } else {
    pFace.value.fValidSpeech = false;

    // Set delay based on sound...
    pFace.value.uiTalkingTimer = pFace.value.uiTalkingFromVeryBeginningTimer = GetJA2Clock();

    pFace.value.uiTalkingDuration = FindDelayForString(zTextString);
  }

  return true;
}

export function ExternSetFaceTalking(iFaceIndex: INT32, uiSoundID: UINT32): boolean {
  let pFace: Pointer<FACETYPE>;

  pFace = addressof(gFacesData[iFaceIndex]);

  // Set face to talki	ng
  pFace.value.fTalking = true;
  pFace.value.fAnimatingTalking = true;
  pFace.value.fFinishTalking = false;
  pFace.value.fValidSpeech = true;

  pFace.value.uiSoundID = uiSoundID;

  return true;
}

export function InternalShutupaYoFace(iFaceIndex: INT32, fForce: boolean): void {
  let pFace: Pointer<FACETYPE>;

  // Check face index
  CHECKV(iFaceIndex != -1);

  pFace = addressof(gFacesData[iFaceIndex]);

  if (pFace.value.fTalking) {
    // OK, only do this if we have been talking for a min. amount fo time...
    if ((GetJA2Clock() - pFace.value.uiTalkingFromVeryBeginningTimer) < 500 && !fForce) {
      return;
    }

    if (pFace.value.uiSoundID != SOUND_ERROR) {
      SoundStop(pFace.value.uiSoundID);
    }

    // Remove gap info
    AudioGapListDone(addressof(pFace.value.GapList));

    // Shutup mouth!
    pFace.value.sMouthFrame = 0;

    // ATE: Only change if active!
    if (!pFace.value.fDisabled) {
      if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
        FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
      } else {
        FaceRestoreSavedBackgroundRect(iFaceIndex, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthOffsetX, pFace.value.usMouthOffsetY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
      }
    }
    // OK, smart guy, make sure this guy has finished talking,
    // before attempting to end dialogue UI.
    pFace.value.fTalking = false;

    // Call dialogue handler function
    HandleDialogueEnd(pFace);

    pFace.value.fTalking = false;
    pFace.value.fAnimatingTalking = false;

    gfUIWaitingForUserSpeechAdvance = false;
  }
}

export function ShutupaYoFace(iFaceIndex: INT32): void {
  InternalShutupaYoFace(iFaceIndex, true);
}

function SetupFinalTalkingDelay(pFace: Pointer<FACETYPE>): void {
  pFace.value.fFinishTalking = true;

  pFace.value.fAnimatingTalking = false;

  pFace.value.uiTalkingTimer = GetJA2Clock();

  if (gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES]) {
    // pFace->uiTalkingDuration = FINAL_TALKING_DURATION;
    pFace.value.uiTalkingDuration = 300;
  } else {
    pFace.value.uiTalkingDuration = 300;
  }

  pFace.value.sMouthFrame = 0;

  // Close mouth!
  if (!pFace.value.fDisabled) {
    if (pFace.value.uiAutoRestoreBuffer == guiSAVEBUFFER) {
      FaceRestoreSavedBackgroundRect(pFace.value.iID, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
    } else {
      FaceRestoreSavedBackgroundRect(pFace.value.iID, pFace.value.usMouthX, pFace.value.usMouthY, pFace.value.usMouthOffsetX, pFace.value.usMouthOffsetY, pFace.value.usMouthWidth, pFace.value.usMouthHeight);
    }
  }

  // Setup flag to wait for advance ( because we have no text! )
  if (gGameSettings.fOptions[Enum8.TOPTION_KEY_ADVANCE_SPEECH] && (pFace.value.uiFlags & FACE_POTENTIAL_KEYWAIT)) {
    // Check if we have had valid speech!
    if (!pFace.value.fValidSpeech || gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES]) {
      // Set false!
      pFace.value.fFinishTalking = false;
      // Set waiting for advance to true!
      gfUIWaitingForUserSpeechAdvance = true;
    }
  }

  // Set final delay!
  pFace.value.fValidSpeech = false;
}

}
