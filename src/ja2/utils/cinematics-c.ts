namespace ja2 {

//----------------------------------------------------------------------------------
// Cinematics Module
//
//
//	Stolen from Nemesis by Derek Beland.
//	Originally by Derek Beland and Bret Rowden.
//
//----------------------------------------------------------------------------------
//#include "LocalCodeAll.h"

//-Structures----------------------------------------------------------------------

//-Flags-and-Symbols---------------------------------------------------------------

const SMK_NUM_FLICS = 4; // Maximum number of flics open

// SMKFLIC uiFlags
const SMK_FLIC_OPEN = 0x00000001; // Flic is open
const SMK_FLIC_PLAYING = 0x00000002; // Flic is playing
const SMK_FLIC_LOOP = 0x00000004; // Play flic in a loop
const SMK_FLIC_AUTOCLOSE = 0x00000008; // Close when done

//-Globals-------------------------------------------------------------------------
let SmkList: SMKFLIC[] /* [SMK_NUM_FLICS] */;

let hDisplayWindow: HWND = 0;
let uiDisplayHeight: UINT32;
let uiDisplayWidth: UINT32;
let fSuspendFlics: boolean = false;
let uiFlicsPlaying: UINT32 = 0;
let guiSmackPixelFormat: UINT32 = SMACKBUFFER565;

let lpVideoPlayback: LPDIRECTDRAWSURFACE = null;
let lpVideoPlayback2: LPDIRECTDRAWSURFACE2 = null;

export function SmkPollFlics(): boolean {
  let uiCount: UINT32;
  let fFlicStatus: boolean = false;
  let SurfaceDescription: DDSURFACEDESC;

  for (uiCount = 0; uiCount < SMK_NUM_FLICS; uiCount++) {
    if (SmkList[uiCount].uiFlags & SMK_FLIC_PLAYING) {
      fFlicStatus = true;
      if (!fSuspendFlics) {
        if (!SmackWait(SmkList[uiCount].SmackHandle)) {
          DDLockSurface(SmkList[uiCount].lpDDS, null, addressof(SurfaceDescription), 0, null);
          SmackToBuffer(SmkList[uiCount].SmackHandle, SmkList[uiCount].uiLeft, SmkList[uiCount].uiTop, SurfaceDescription.lPitch, SmkList[uiCount].SmackHandle.value.Height, SurfaceDescription.lpSurface, guiSmackPixelFormat);
          SmackDoFrame(SmkList[uiCount].SmackHandle);
          DDUnlockSurface(SmkList[uiCount].lpDDS, SurfaceDescription.lpSurface);
          // temp til I figure out what to do with it
          // InvalidateRegion(0,0, 640, 480, FALSE);

          // Check to see if the flic is done the last frame
          if (SmkList[uiCount].SmackHandle.value.FrameNum == (SmkList[uiCount].SmackHandle.value.Frames - 1)) {
            // If flic is looping, reset frame to 0
            if (SmkList[uiCount].uiFlags & SMK_FLIC_LOOP)
              SmackGoto(SmkList[uiCount].SmackHandle, 0);
            else if (SmkList[uiCount].uiFlags & SMK_FLIC_AUTOCLOSE)
              SmkCloseFlic(addressof(SmkList[uiCount]));
          } else
            SmackNextFrame(SmkList[uiCount].SmackHandle);
        }
      }
    }
  }
  if (!fFlicStatus)
    SmkShutdownVideo();

  return fFlicStatus;
}

export function SmkInitialize(hWindow: HWND, uiWidth: UINT32, uiHeight: UINT32): void {
  let pSoundDriver: HDIGDRIVER = null;

  // Wipe the flic list clean
  memset(SmkList, 0, sizeof(SMKFLIC) * SMK_NUM_FLICS);

  // Set playback window properties
  hDisplayWindow = hWindow;
  uiDisplayWidth = uiWidth;
  uiDisplayHeight = uiHeight;

  // Use MMX acceleration, if available
  SmackUseMMX(1);

  // Get the sound Driver handle
  pSoundDriver = SoundGetDriverHandle();

  // if we got the sound handle, use sound during the intro
  if (pSoundDriver)
    SmackSoundUseMSS(pSoundDriver);
}

export function SmkShutdown(): void {
  let uiCount: UINT32;

  // Close and deallocate any open flics
  for (uiCount = 0; uiCount < SMK_NUM_FLICS; uiCount++) {
    if (SmkList[uiCount].uiFlags & SMK_FLIC_OPEN)
      SmkCloseFlic(addressof(SmkList[uiCount]));
  }
}

export function SmkPlayFlic(cFilename: string /* Pointer<CHAR8> */, uiLeft: UINT32, uiTop: UINT32, fClose: boolean): Pointer<SMKFLIC> {
  let pSmack: Pointer<SMKFLIC>;

  // Open the flic
  if ((pSmack = SmkOpenFlic(cFilename)) == null)
    return null;

  // Set the blitting position on the screen
  SmkSetBlitPosition(pSmack, uiLeft, uiTop);

  // We're now playing, flag the flic for the poller to update
  pSmack.value.uiFlags |= SMK_FLIC_PLAYING;
  if (fClose)
    pSmack.value.uiFlags |= SMK_FLIC_AUTOCLOSE;

  return pSmack;
}

function SmkOpenFlic(cFilename: string /* Pointer<CHAR8> */): Pointer<SMKFLIC> {
  let pSmack: Pointer<SMKFLIC>;
  let hFile: HANDLE;

  // Get an available flic slot from the list
  if (!(pSmack = SmkGetFreeFlic())) {
    ErrorMsg("SMK ERROR: Out of flic slots, cannot open another");
    return null;
  }

  // Attempt opening the filename
  if (!(pSmack.value.hFileHandle = FileOpen(cFilename, FILE_OPEN_EXISTING | FILE_ACCESS_READ, false))) {
    ErrorMsg("SMK ERROR: Can't open the SMK file");
    return null;
  }

  // Get the real file handle for the file man handle for the smacker file
  hFile = GetRealFileHandleFromFileManFileHandle(pSmack.value.hFileHandle);

  // Allocate a Smacker buffer for video decompression
  if (!(pSmack.value.SmackBuffer = SmackBufferOpen(hDisplayWindow, SMACKAUTOBLIT, 640, 480, 0, 0))) {
    ErrorMsg("SMK ERROR: Can't allocate a Smacker decompression buffer");
    return null;
  }

  if (!(pSmack.value.SmackHandle = SmackOpen(hFile, SMACKFILEHANDLE | SMACKTRACKS, SMACKAUTOEXTRA)))
  //	if(!(pSmack->SmackHandle=SmackOpen(cFilename, SMACKTRACKS, SMACKAUTOEXTRA)))
  {
    ErrorMsg("SMK ERROR: Smacker won't open the SMK file");
    return null;
  }

  // Make sure we have a video surface
  SmkSetupVideo();

  pSmack.value.cFilename = cFilename;
  pSmack.value.lpDDS = lpVideoPlayback2;
  pSmack.value.hWindow = hDisplayWindow;

  // Smack flic is now open and ready to go
  pSmack.value.uiFlags |= SMK_FLIC_OPEN;

  return pSmack;
}

function SmkSetBlitPosition(pSmack: Pointer<SMKFLIC>, uiLeft: UINT32, uiTop: UINT32): void {
  pSmack.value.uiLeft = uiLeft;
  pSmack.value.uiTop = uiTop;
}

export function SmkCloseFlic(pSmack: Pointer<SMKFLIC>): void {
  // Attempt opening the filename
  FileClose(pSmack.value.hFileHandle);

  // Deallocate the smack buffers
  SmackBufferClose(pSmack.value.SmackBuffer);

  // Close the smack flic
  SmackClose(pSmack.value.SmackHandle);

  // Zero the memory, flags, etc.
  memset(pSmack, 0, sizeof(SMKFLIC));
}

function SmkGetFreeFlic(): Pointer<SMKFLIC> {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < SMK_NUM_FLICS; uiCount++)
    if (!(SmkList[uiCount].uiFlags & SMK_FLIC_OPEN))
      return addressof(SmkList[uiCount]);

  return null;
}

function SmkSetupVideo(): void {
  let SurfaceDescription: DDSURFACEDESC;
  let ReturnCode: HRESULT;
  let usRed: UINT16;
  let usGreen: UINT16;
  let usBlue: UINT16;
  let hVSurface: HVSURFACE;

  // DEF:
  //	lpVideoPlayback2=CinematicModeOn();

  GetVideoSurface(addressof(hVSurface), FRAME_BUFFER);
  lpVideoPlayback2 = GetVideoSurfaceDDSurface(hVSurface);

  ZEROMEM(SurfaceDescription);
  SurfaceDescription.dwSize = sizeof(DDSURFACEDESC);
  ReturnCode = IDirectDrawSurface2_GetSurfaceDesc(lpVideoPlayback2, addressof(SurfaceDescription));
  if (ReturnCode != DD_OK) {
    DirectXAttempt(ReturnCode, __LINE__, __FILE__);
    return;
  }

  usRed = SurfaceDescription.ddpfPixelFormat.dwRBitMask;
  usGreen = SurfaceDescription.ddpfPixelFormat.dwGBitMask;
  usBlue = SurfaceDescription.ddpfPixelFormat.dwBBitMask;

  if ((usRed == 0xf800) && (usGreen == 0x07e0) && (usBlue == 0x001f))
    guiSmackPixelFormat = SMACKBUFFER565;
  else
    guiSmackPixelFormat = SMACKBUFFER555;
}

function SmkShutdownVideo(): void {
  // DEF:
  //	CinematicModeOff();
}

}
