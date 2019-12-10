namespace ja2 {

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Local Defines
//
///////////////////////////////////////////////////////////////////////////////////////////////////

const MAX_DIRTY_REGIONS = 128;

const VIDEO_OFF = 0x00;
const VIDEO_ON = 0x01;
const VIDEO_SHUTTING_DOWN = 0x02;
const VIDEO_SUSPENDED = 0x04;

const THREAD_OFF = 0x00;
const THREAD_ON = 0x01;
const THREAD_SUSPENDED = 0x02;

const CURRENT_MOUSE_DATA = 0;
const PREVIOUS_MOUSE_DATA = 1;

const DDBLTFAST_NOCOLORKEY = 0x00000000;
const DDBLTFAST_SRCCOLORKEY = 0x00000001;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Local Typedefs
//
///////////////////////////////////////////////////////////////////////////////////////////////////

interface MouseCursorBackground {
  fRestore: boolean;

  usMouseXPos: UINT16;
  usMouseYPos: UINT16;

  usLeft: UINT16;
  usTop: UINT16;
  usRight: UINT16;
  usBottom: UINT16;

  Region: RECT;
  pSurface: ImageData;
}

function createMouseCursorBackground(): MouseCursorBackground {
  return {
    fRestore: false,
    usMouseXPos: 0,
    usMouseYPos: 0,
    usLeft: 0,
    usTop: 0,
    usRight: 0,
    usBottom: 0,
    Region: createRect(),
    pSurface: <ImageData><unknown>null,
  };
}

function copyMouseCursorBackground(destination: MouseCursorBackground, source: MouseCursorBackground) {
  destination.fRestore = source.fRestore;
  destination.usMouseXPos = source.usMouseXPos;
  destination.usMouseYPos = source.usMouseYPos;
  destination.usLeft = source.usLeft;
  destination.usTop = source.usTop;
  destination.usRight = source.usRight;
  destination.usBottom = source.usBottom;
  copyRect(destination.Region, source.Region);
  destination.pSurface = source.pSurface;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// LOCAL globals
//
///////////////////////////////////////////////////////////////////////////////////////////////////

//
// Video state variables
//

/* static */ let gusScreenWidth: UINT16;
/* static */ let gusScreenHeight: UINT16;
/* static */ let gubScreenPixelDepth: UINT8;

//
// Direct Draw objects for both the Primary and Backbuffer surfaces
//

/* static */ let gpDirectDrawObject: CanvasRenderingContext2D = <CanvasRenderingContext2D><unknown>null;

/* static */ let gpPrimarySurface: ImageData = <ImageData><unknown>null;
/* static */ let gpBackBuffer: ImageData = <ImageData><unknown>null;

//
// Direct Draw Objects for the frame buffer
//

/* static */ let gpFrameBuffer: ImageData = <ImageData><unknown>null;

//
// Globals for mouse cursor
//

/* static */ let gusMouseCursorWidth: UINT16;
/* static */ let gusMouseCursorHeight: UINT16;
/* static */ let gsMouseCursorXOffset: INT16;
/* static */ let gsMouseCursorYOffset: INT16;

/* static */ let gpMouseCursor: ImageData = <ImageData><unknown>null;

/* static */ let gpMouseCursorOriginal: ImageData = <ImageData><unknown>null;

/* static */ let gMouseCursorBackground: MouseCursorBackground[] /* [2] */ = createArrayFrom(2, createMouseCursorBackground);

/* static */ let gpCursorStore: SGPVObject | null = null;

let gFatalErrorString: string /* char[512] */;

// 8-bit palette stuff

let gSgpPalette: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);

//
// Make sure we record the value of the hWindow (main window frame for the application)
//

export let ghWindow: HTMLCanvasElement;

//
// Refresh thread based variables
//

let guiFrameBufferState: UINT32; // BUFFER_READY, BUFFER_DIRTY
let guiMouseBufferState: UINT32; // BUFFER_READY, BUFFER_DIRTY, BUFFER_DISABLED
let guiVideoManagerState: UINT32; // VIDEO_ON, VIDEO_OFF, VIDEO_SUSPENDED, VIDEO_SHUTTING_DOWN
let guiRefreshThreadState: UINT32; // THREAD_ON, THREAD_OFF, THREAD_SUSPENDED

//
// Dirty rectangle management variables
//

let gpFrameBufferRefreshOverride: (() => void) | null;
let gListOfDirtyRegions: SGPRect[] /* [MAX_DIRTY_REGIONS] */ = createArrayFrom(MAX_DIRTY_REGIONS, createSGPRect);
let guiDirtyRegionCount: UINT32;
let gfForceFullScreenRefresh: boolean;

let gDirtyRegionsEx: SGPRect[] /* [MAX_DIRTY_REGIONS] */ = createArrayFrom(MAX_DIRTY_REGIONS, createSGPRect);
let gDirtyRegionsFlagsEx: UINT32[] /* [MAX_DIRTY_REGIONS] */ = createArray(MAX_DIRTY_REGIONS, 0);
let guiDirtyRegionExCount: UINT32;

//
// Screen output stuff
//

let gfPrintFrameBuffer: boolean;
let guiPrintFrameBufferIndex: UINT32;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// External Variables
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Local Function Prototypes
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////

export function InitializeVideoManager(hInstance: HTMLElement): boolean {
  let uiIndex: UINT32;
  let hWindow: HTMLCanvasElement;

  //
  // Register debug topics
  //

  RegisterDebugTopic(TOPIC_VIDEO, "Video");
  DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "Initializing the video manager");

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Register and Realize our display window. The DirectX surface will eventually overlay on top
  // of this surface.
  //
  // <<<<<<<<< Don't change this >>>>>>>>
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////

  //
  // Get a window handle for our application (gotta have on of those)
  // Don't change this
  //
  hWindow = document.createElement('canvas');
  hWindow.width = SCREEN_WIDTH
  hWindow.height = SCREEN_HEIGHT;
  hInstance.appendChild(hWindow);

  //
  // Excellent. Now we record the hWindow variable for posterity (not)
  //

  ghWindow = hWindow;

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Start up Direct Draw
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////

  //
  // Create the Direct Draw Object
  //

  gpDirectDrawObject = <CanvasRenderingContext2D>hWindow.getContext('2d');
  if (!gpDirectDrawObject) {
    return false;
  }

  gusScreenWidth = SCREEN_WIDTH;
  gusScreenHeight = SCREEN_HEIGHT;
  gubScreenPixelDepth = gbPixelDepth;

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Setup all the surfaces
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////

  //
  // Initialize Primary Surface along with BackBuffer
  //

  gpPrimarySurface = gpDirectDrawObject.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
  gpBackBuffer = gpDirectDrawObject.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

  //
  // Initialize the frame buffer
  //

  gpFrameBuffer = gpDirectDrawObject.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

  //
  // Initialize the main mouse surfaces
  //

  gpMouseCursor = gpDirectDrawObject.createImageData(MAX_CURSOR_WIDTH, MAX_CURSOR_HEIGHT);


  //
  // Initialize the main mouse original surface
  //

  gpMouseCursorOriginal = gpDirectDrawObject.createImageData(MAX_CURSOR_WIDTH, MAX_CURSOR_HEIGHT);

  //
  // Initialize the main mouse background surfaces. There are two of them (one for each of the Primary
  // and Backbuffer surfaces
  //

  for (uiIndex = 0; uiIndex < 1; uiIndex++) {
    //
    // Initialize various mouse background variables
    //

    gMouseCursorBackground[uiIndex].fRestore = false;

    //
    // Initialize the direct draw surfaces for the mouse background
    //

    gMouseCursorBackground[uiIndex].pSurface = gpDirectDrawObject.createImageData(MAX_CURSOR_WIDTH, MAX_CURSOR_HEIGHT);
  }

  //
  // Initialize state variables
  //

  guiFrameBufferState = BUFFER_DIRTY;
  guiMouseBufferState = BUFFER_DISABLED;
  guiVideoManagerState = VIDEO_ON;
  guiRefreshThreadState = THREAD_OFF;
  guiDirtyRegionCount = 0;
  gfForceFullScreenRefresh = true;
  gpFrameBufferRefreshOverride = null;
  gpCursorStore = null;
  gfPrintFrameBuffer = false;
  guiPrintFrameBufferIndex = 0;

  //
  // This function must be called to setup RGB information
  //

  GetRGBDistribution();

  return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
export function ShutdownVideoManager(): void {
  // UINT32  uiRefreshThreadState;

  DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "Shutting down the video manager");

  //
  // Toggle the state of the video manager to indicate to the refresh thread that it needs to shut itself
  // down
  //

  gpMouseCursorOriginal = <ImageData><unknown>null;
  gpMouseCursor = <ImageData><unknown>null;
  gMouseCursorBackground[0].pSurface = <ImageData><unknown>null;
  gpBackBuffer = <ImageData><unknown>null;
  gpPrimarySurface = <ImageData><unknown>null;

  gpDirectDrawObject = <CanvasRenderingContext2D><unknown>null;

  // destroy the window
  // DestroyWindow( ghWindow );

  guiVideoManagerState = VIDEO_OFF;

  if (gpCursorStore != null) {
    DeleteVideoObject(gpCursorStore);
    gpCursorStore = null;
  }

  // ATE: Release mouse cursor!
  FreeMouseCursor();

  UnRegisterDebugTopic(TOPIC_VIDEO, "Video");
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function SuspendVideoManager(): void {
  guiVideoManagerState = VIDEO_SUSPENDED;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function RestoreVideoManager(): boolean {
  //
  // Make sure the video manager is indeed suspended before moving on
  //

  if (guiVideoManagerState == VIDEO_SUSPENDED) {

    //
    // Set the video state to VIDEO_ON
    //

    guiFrameBufferState = BUFFER_DIRTY;
    guiMouseBufferState = BUFFER_DIRTY;
    gfForceFullScreenRefresh = true;
    guiVideoManagerState = VIDEO_ON;
    return true;
  } else {
    return false;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetCurrentVideoSettings(): { usWidth: UINT16, usHeight: UINT16, ubBitDepth: UINT8 } {
  return {
    usWidth: gusScreenWidth,
    usHeight: gusScreenHeight,
    ubBitDepth: gubScreenPixelDepth,
  };
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function CanBlitToFrameBuffer(): boolean {
  let fCanBlit: boolean;

  //
  // W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ----
  //
  // This function is intended to be called by a thread which has already locked the
  // FRAME_BUFFER_MUTEX mutual exclusion section. Anything else will cause the application to
  // yack
  //

  fCanBlit = (guiFrameBufferState == BUFFER_READY);

  return fCanBlit;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function CanBlitToMouseBuffer(): boolean {
  let fCanBlit: boolean;

  //
  // W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ----
  //
  // This function is intended to be called by a thread which has already locked the
  // MOUSE_BUFFER_MUTEX mutual exclusion section. Anything else will cause the application to
  // yack
  //

  fCanBlit = (guiMouseBufferState == BUFFER_READY);

  return fCanBlit;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function InvalidateRegion(iLeft: INT32, iTop: INT32, iRight: INT32, iBottom: INT32): void {
  if (gfForceFullScreenRefresh == true) {
    //
    // There's no point in going on since we are forcing a full screen refresh
    //

    return;
  }

  if (guiDirtyRegionCount < MAX_DIRTY_REGIONS) {
    //
    // Well we haven't broken the MAX_DIRTY_REGIONS limit yet, so we register the new region
    //

    // DO SOME PREMIMARY CHECKS FOR VALID RECTS
    if (iLeft < 0)
      iLeft = 0;

    if (iTop < 0)
      iTop = 0;

    if (iRight > SCREEN_WIDTH)
      iRight = SCREEN_WIDTH;

    if (iBottom > SCREEN_HEIGHT)
      iBottom = SCREEN_HEIGHT;

    if ((iRight - iLeft) <= 0)
      return;

    if ((iBottom - iTop) <= 0)
      return;

    gListOfDirtyRegions[guiDirtyRegionCount].iLeft = iLeft;
    gListOfDirtyRegions[guiDirtyRegionCount].iTop = iTop;
    gListOfDirtyRegions[guiDirtyRegionCount].iRight = iRight;
    gListOfDirtyRegions[guiDirtyRegionCount].iBottom = iBottom;

    //		gDirtyRegionFlags[ guiDirtyRegionCount ] = TRUE;

    guiDirtyRegionCount++;
  } else {
    //
    // The MAX_DIRTY_REGIONS limit has been exceeded. Therefore we arbitrarely invalidate the entire
    // screen and force a full screen refresh
    //
    guiDirtyRegionExCount = 0;
    guiDirtyRegionCount = 0;
    gfForceFullScreenRefresh = true;
  }
}

export function InvalidateRegionEx(iLeft: INT32, iTop: INT32, iRight: INT32, iBottom: INT32, uiFlags: UINT32): void {
  let iOldBottom: INT32;

  iOldBottom = iBottom;

  // Check if we are spanning the rectangle - if so slit it up!
  if (iTop <= gsVIEWPORT_WINDOW_END_Y && iBottom > gsVIEWPORT_WINDOW_END_Y) {
    // Add new top region
    iBottom = gsVIEWPORT_WINDOW_END_Y;
    AddRegionEx(iLeft, iTop, iRight, iBottom, uiFlags);

    // Add new bottom region
    iTop = gsVIEWPORT_WINDOW_END_Y;
    iBottom = iOldBottom;
    AddRegionEx(iLeft, iTop, iRight, iBottom, uiFlags);
  } else {
    AddRegionEx(iLeft, iTop, iRight, iBottom, uiFlags);
  }
}

function AddRegionEx(iLeft: INT32, iTop: INT32, iRight: INT32, iBottom: INT32, uiFlags: UINT32): void {
  if (guiDirtyRegionExCount < MAX_DIRTY_REGIONS) {
    // DO SOME PREMIMARY CHECKS FOR VALID RECTS
    if (iLeft < 0)
      iLeft = 0;

    if (iTop < 0)
      iTop = 0;

    if (iRight > SCREEN_WIDTH)
      iRight = SCREEN_WIDTH;

    if (iBottom > SCREEN_HEIGHT)
      iBottom = SCREEN_HEIGHT;

    if ((iRight - iLeft) <= 0)
      return;

    if ((iBottom - iTop) <= 0)
      return;

    gDirtyRegionsEx[guiDirtyRegionExCount].iLeft = iLeft;
    gDirtyRegionsEx[guiDirtyRegionExCount].iTop = iTop;
    gDirtyRegionsEx[guiDirtyRegionExCount].iRight = iRight;
    gDirtyRegionsEx[guiDirtyRegionExCount].iBottom = iBottom;

    gDirtyRegionsFlagsEx[guiDirtyRegionExCount] = uiFlags;

    guiDirtyRegionExCount++;
  } else {
    guiDirtyRegionExCount = 0;
    guiDirtyRegionCount = 0;
    gfForceFullScreenRefresh = true;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function InvalidateRegions(pArrayOfRegions: SGPRect[], uiRegionCount: UINT32): void {
  if (gfForceFullScreenRefresh == true) {
    //
    // There's no point in going on since we are forcing a full screen refresh
    //

    return;
  }

  if ((guiDirtyRegionCount + uiRegionCount) < MAX_DIRTY_REGIONS) {
    let uiIndex: UINT32;

    for (uiIndex = 0; uiIndex < uiRegionCount; uiIndex++) {
      //
      // Well we haven't broken the MAX_DIRTY_REGIONS limit yet, so we register the new region
      //

      gListOfDirtyRegions[guiDirtyRegionCount].iLeft = pArrayOfRegions[uiIndex].iLeft;
      gListOfDirtyRegions[guiDirtyRegionCount].iTop = pArrayOfRegions[uiIndex].iTop;
      gListOfDirtyRegions[guiDirtyRegionCount].iRight = pArrayOfRegions[uiIndex].iRight;
      gListOfDirtyRegions[guiDirtyRegionCount].iBottom = pArrayOfRegions[uiIndex].iBottom;

      guiDirtyRegionCount++;
    }
  } else {
    guiDirtyRegionCount = 0;
    gfForceFullScreenRefresh = true;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function InvalidateScreen(): void {
  //
  // W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ----
  //
  // This function is intended to be called by a thread which has already locked the
  // FRAME_BUFFER_MUTEX mutual exclusion section. Anything else will cause the application to
  // yack
  //

  guiDirtyRegionCount = 0;
  guiDirtyRegionExCount = 0;
  gfForceFullScreenRefresh = true;
  guiFrameBufferState = BUFFER_DIRTY;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function InvalidateFrameBuffer(): void {
  //
  // W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ---- W A R N I N G ----
  //
  // This function is intended to be called by a thread which has already locked the
  // FRAME_BUFFER_MUTEX mutual exclusion section. Anything else will cause the application to
  // yack
  //

  guiFrameBufferState = BUFFER_DIRTY;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function SetFrameBufferRefreshOverride(pFrameBufferRefreshOverride: (() => void) | null): void {
  gpFrameBufferRefreshOverride = pFrameBufferRefreshOverride;
}

//#define SCROLL_TEST

///////////////////////////////////////////////////////////////////////////////////////////////////

/* static */ let ScrollJA2Background__Region: RECT = createRect();
/* static */ let ScrollJA2Background__usMouseXPos: UINT16;
/* static */ let ScrollJA2Background__usMouseYPos: UINT16;
/* static */ let ScrollJA2Background__StripRegions: RECT[] /* [2] */ = createArrayFrom(2, createRect);
/* static */ let ScrollJA2Background__MouseRegion: RECT = createRect();
function ScrollJA2Background(uiDirection: UINT32, sScrollXIncrement: INT16, sScrollYIncrement: INT16, pSource: ImageData, pDest: ImageData, fRenderStrip: boolean, uiCurrentMouseBackbuffer: UINT32): void {
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;
  let usNumStrips: UINT16 = 0;
  let cnt: INT32;
  let sShiftX: INT16;
  let sShiftY: INT16;
  let uiCountY: INT32;

  ({ usWidth, usHeight, ubBitDepth } = GetCurrentVideoSettings());
  usHeight = (gsVIEWPORT_WINDOW_END_Y - gsVIEWPORT_WINDOW_START_Y);

  ScrollJA2Background__StripRegions[0].left = gsVIEWPORT_START_X;
  ScrollJA2Background__StripRegions[0].right = gsVIEWPORT_END_X;
  ScrollJA2Background__StripRegions[0].top = gsVIEWPORT_WINDOW_START_Y;
  ScrollJA2Background__StripRegions[0].bottom = gsVIEWPORT_WINDOW_END_Y;
  ScrollJA2Background__StripRegions[1].left = gsVIEWPORT_START_X;
  ScrollJA2Background__StripRegions[1].right = gsVIEWPORT_END_X;
  ScrollJA2Background__StripRegions[1].top = gsVIEWPORT_WINDOW_START_Y;
  ScrollJA2Background__StripRegions[1].bottom = gsVIEWPORT_WINDOW_END_Y;

  ScrollJA2Background__MouseRegion.left = gMouseCursorBackground[uiCurrentMouseBackbuffer].usLeft;
  ScrollJA2Background__MouseRegion.top = gMouseCursorBackground[uiCurrentMouseBackbuffer].usTop;
  ScrollJA2Background__MouseRegion.right = gMouseCursorBackground[uiCurrentMouseBackbuffer].usRight;
  ScrollJA2Background__MouseRegion.bottom = gMouseCursorBackground[uiCurrentMouseBackbuffer].usBottom;

  ScrollJA2Background__usMouseXPos = gMouseCursorBackground[uiCurrentMouseBackbuffer].usMouseXPos;
  ScrollJA2Background__usMouseYPos = gMouseCursorBackground[uiCurrentMouseBackbuffer].usMouseYPos;

  switch (uiDirection) {
    case SCROLL_LEFT:

      ScrollJA2Background__Region.left = 0;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y;
      ScrollJA2Background__Region.right = usWidth - (sScrollXIncrement);
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight;

      BltFastDDSurfaceUsingSoftware(pDest, sScrollXIncrement, gsVIEWPORT_WINDOW_START_Y, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // memset z-buffer
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y; uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, + (uiCountY * 1280), sScrollXIncrement * 2);
      }

      ScrollJA2Background__StripRegions[0].right = (gsVIEWPORT_START_X + sScrollXIncrement);
      ScrollJA2Background__usMouseXPos += sScrollXIncrement;

      usNumStrips = 1;
      break;

    case SCROLL_RIGHT:

      ScrollJA2Background__Region.left = sScrollXIncrement;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y;
      ScrollJA2Background__Region.right = usWidth;
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight;

      BltFastDDSurfaceUsingSoftware(pDest, 0, gsVIEWPORT_WINDOW_START_Y, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // memset z-buffer
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y; uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280) + ((gsVIEWPORT_END_X - sScrollXIncrement) * 2), sScrollXIncrement * 2);
      }

      // for(uiCountY=0; uiCountY < usHeight; uiCountY++)
      //{
      //	memcpy(pDestBuf+(uiCountY*uiDestPitchBYTES),
      //					pSrcBuf+(uiCountY*uiDestPitchBYTES)+sScrollXIncrement*uiBPP,
      //					uiDestPitchBYTES-sScrollXIncrement*uiBPP);
      //}

      ScrollJA2Background__StripRegions[0].left = (gsVIEWPORT_END_X - sScrollXIncrement);
      ScrollJA2Background__usMouseXPos -= sScrollXIncrement;

      usNumStrips = 1;
      break;

    case SCROLL_UP:

      ScrollJA2Background__Region.left = 0;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y;
      ScrollJA2Background__Region.right = usWidth;
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight - sScrollYIncrement;

      BltFastDDSurfaceUsingSoftware(pDest, 0, gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      for (uiCountY = sScrollYIncrement - 1 + gsVIEWPORT_WINDOW_START_Y; uiCountY >= gsVIEWPORT_WINDOW_START_Y; uiCountY--) {
        gpZBuffer.fill(0, (uiCountY * 1280), 1280);
      }

      // for(uiCountY=usHeight-1; uiCountY >= sScrollYIncrement; uiCountY--)
      //{
      //	memcpy(pDestBuf+(uiCountY*uiDestPitchBYTES),
      //					pSrcBuf+((uiCountY-sScrollYIncrement)*uiDestPitchBYTES),
      //					uiDestPitchBYTES);
      //}
      ScrollJA2Background__StripRegions[0].bottom = (gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement);
      usNumStrips = 1;

      ScrollJA2Background__usMouseYPos += sScrollYIncrement;

      break;

    case SCROLL_DOWN:

      ScrollJA2Background__Region.left = 0;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement;
      ScrollJA2Background__Region.right = usWidth;
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight;

      BltFastDDSurfaceUsingSoftware(pDest, 0, gsVIEWPORT_WINDOW_START_Y, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // Zero out z
      for (uiCountY = (gsVIEWPORT_WINDOW_END_Y - sScrollYIncrement); uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280), 1280);
      }

      // for(uiCountY=0; uiCountY < (usHeight-sScrollYIncrement); uiCountY++)
      //{
      //	memcpy(pDestBuf+(uiCountY*uiDestPitchBYTES),
      //					pSrcBuf+((uiCountY+sScrollYIncrement)*uiDestPitchBYTES),
      //					uiDestPitchBYTES);
      //}

      ScrollJA2Background__StripRegions[0].top = (gsVIEWPORT_WINDOW_END_Y - sScrollYIncrement);
      usNumStrips = 1;

      ScrollJA2Background__usMouseYPos -= sScrollYIncrement;

      break;

    case SCROLL_UPLEFT:

      ScrollJA2Background__Region.left = 0;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y;
      ScrollJA2Background__Region.right = usWidth - (sScrollXIncrement);
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight - sScrollYIncrement;

      BltFastDDSurfaceUsingSoftware(pDest, sScrollXIncrement, gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // memset z-buffer
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y; uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280), sScrollXIncrement * 2);
      }
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement - 1; uiCountY >= gsVIEWPORT_WINDOW_START_Y; uiCountY--) {
        gpZBuffer.fill(0, (uiCountY * 1280), 1280);
      }

      ScrollJA2Background__StripRegions[0].right = (gsVIEWPORT_START_X + sScrollXIncrement);
      ScrollJA2Background__StripRegions[1].bottom = (gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement);
      ScrollJA2Background__StripRegions[1].left = (gsVIEWPORT_START_X + sScrollXIncrement);
      usNumStrips = 2;

      ScrollJA2Background__usMouseYPos += sScrollYIncrement;
      ScrollJA2Background__usMouseXPos += sScrollXIncrement;

      break;

    case SCROLL_UPRIGHT:

      ScrollJA2Background__Region.left = sScrollXIncrement;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y;
      ScrollJA2Background__Region.right = usWidth;
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight - sScrollYIncrement;

      BltFastDDSurfaceUsingSoftware(pDest, 0, gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // memset z-buffer
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y; uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280) + ((gsVIEWPORT_END_X - sScrollXIncrement) * 2), sScrollXIncrement * 2);
      }
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement - 1; uiCountY >= gsVIEWPORT_WINDOW_START_Y; uiCountY--) {
        gpZBuffer.fill(0, (uiCountY * 1280), 1280);
      }

      ScrollJA2Background__StripRegions[0].left = (gsVIEWPORT_END_X - sScrollXIncrement);
      ScrollJA2Background__StripRegions[1].bottom = (gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement);
      ScrollJA2Background__StripRegions[1].right = (gsVIEWPORT_END_X - sScrollXIncrement);
      usNumStrips = 2;

      ScrollJA2Background__usMouseYPos += sScrollYIncrement;
      ScrollJA2Background__usMouseXPos -= sScrollXIncrement;

      break;

    case SCROLL_DOWNLEFT:

      ScrollJA2Background__Region.left = 0;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement;
      ScrollJA2Background__Region.right = usWidth - (sScrollXIncrement);
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight;

      BltFastDDSurfaceUsingSoftware(pDest, sScrollXIncrement, gsVIEWPORT_WINDOW_START_Y, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // memset z-buffer
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y; uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280), sScrollXIncrement * 2);
      }
      for (uiCountY = (gsVIEWPORT_WINDOW_END_Y - sScrollYIncrement); uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280), 1280);
      }

      ScrollJA2Background__StripRegions[0].right = (gsVIEWPORT_START_X + sScrollXIncrement);

      ScrollJA2Background__StripRegions[1].top = (gsVIEWPORT_WINDOW_END_Y - sScrollYIncrement);
      ScrollJA2Background__StripRegions[1].left = (gsVIEWPORT_START_X + sScrollXIncrement);
      usNumStrips = 2;

      ScrollJA2Background__usMouseYPos -= sScrollYIncrement;
      ScrollJA2Background__usMouseXPos += sScrollXIncrement;

      break;

    case SCROLL_DOWNRIGHT:

      ScrollJA2Background__Region.left = sScrollXIncrement;
      ScrollJA2Background__Region.top = gsVIEWPORT_WINDOW_START_Y + sScrollYIncrement;
      ScrollJA2Background__Region.right = usWidth;
      ScrollJA2Background__Region.bottom = gsVIEWPORT_WINDOW_START_Y + usHeight;

      BltFastDDSurfaceUsingSoftware(pDest, 0, gsVIEWPORT_WINDOW_START_Y, pSource, ScrollJA2Background__Region, DDBLTFAST_NOCOLORKEY);

      // memset z-buffer
      for (uiCountY = gsVIEWPORT_WINDOW_START_Y; uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280) + ((gsVIEWPORT_END_X - sScrollXIncrement) * 2), sScrollXIncrement * 2);
      }
      for (uiCountY = (gsVIEWPORT_WINDOW_END_Y - sScrollYIncrement); uiCountY < gsVIEWPORT_WINDOW_END_Y; uiCountY++) {
        gpZBuffer.fill(0, (uiCountY * 1280), 1280);
      }

      ScrollJA2Background__StripRegions[0].left = (gsVIEWPORT_END_X - sScrollXIncrement);
      ScrollJA2Background__StripRegions[1].top = (gsVIEWPORT_WINDOW_END_Y - sScrollYIncrement);
      ScrollJA2Background__StripRegions[1].right = (gsVIEWPORT_END_X - sScrollXIncrement);
      usNumStrips = 2;

      ScrollJA2Background__usMouseYPos -= sScrollYIncrement;
      ScrollJA2Background__usMouseXPos -= sScrollXIncrement;

      break;
  }

  if (fRenderStrip) {
    // Memset to 0

    for (cnt = 0; cnt < usNumStrips; cnt++) {
      RenderStaticWorldRect(ScrollJA2Background__StripRegions[cnt].left, ScrollJA2Background__StripRegions[cnt].top, ScrollJA2Background__StripRegions[cnt].right, ScrollJA2Background__StripRegions[cnt].bottom, true);
      // Optimize Redundent tiles too!
      // ExamineZBufferRect( (INT16)StripRegions[ cnt ].left, (INT16)StripRegions[ cnt ].top, (INT16)StripRegions[ cnt ].right, (INT16)StripRegions[ cnt ].bottom );

      BltFastDDSurfaceUsingSoftware(pDest, ScrollJA2Background__StripRegions[cnt].left, ScrollJA2Background__StripRegions[cnt].top, gpFrameBuffer,  ScrollJA2Background__StripRegions[cnt], DDBLTFAST_NOCOLORKEY);
    }

    sShiftX = 0;
    sShiftY = 0;

    switch (uiDirection) {
      case SCROLL_LEFT:

        sShiftX = sScrollXIncrement;
        sShiftY = 0;
        break;

      case SCROLL_RIGHT:

        sShiftX = -sScrollXIncrement;
        sShiftY = 0;
        break;

      case SCROLL_UP:

        sShiftX = 0;
        sShiftY = sScrollYIncrement;
        break;

      case SCROLL_DOWN:

        sShiftX = 0;
        sShiftY = -sScrollYIncrement;
        break;

      case SCROLL_UPLEFT:

        sShiftX = sScrollXIncrement;
        sShiftY = sScrollYIncrement;
        break;

      case SCROLL_UPRIGHT:

        sShiftX = -sScrollXIncrement;
        sShiftY = sScrollYIncrement;
        break;

      case SCROLL_DOWNLEFT:

        sShiftX = sScrollXIncrement;
        sShiftY = -sScrollYIncrement;
        break;

      case SCROLL_DOWNRIGHT:

        sShiftX = -sScrollXIncrement;
        sShiftY = -sScrollYIncrement;
        break;
    }

    // RESTORE SHIFTED
    RestoreShiftedVideoOverlays(sShiftX, sShiftY);

    // SAVE NEW
    SaveVideoOverlaysArea(BACKBUFFER);

    // BLIT NEW
    ExecuteVideoOverlaysToAlternateBuffer(BACKBUFFER);
  }

  // InvalidateRegion( sLeftDraw, sTopDraw, sRightDraw, sBottomDraw );

  // UpdateSaveBuffer();
  // SaveBackgroundRects();
}

/* static */ let RefreshScreen__uiRefreshThreadState: UINT32;
/* static */ let RefreshScreen__uiIndex: UINT32;
/* static */ let RefreshScreen__fShowMouse: boolean;
/* static */ let RefreshScreen__Region: RECT = createRect();
/* static */ let RefreshScreen__MousePos: POINT = createPoint();
/* static */ let RefreshScreen__fFirstTime: boolean = true;
export function RefreshScreen(): void {
  let usScreenWidth: UINT16;
  let usScreenHeight: UINT16;
  let uiTime: UINT32;

  RefreshScreen__Region.left = 0;
  RefreshScreen__Region.top = 0;
  RefreshScreen__Region.right = SCREEN_WIDTH;
  RefreshScreen__Region.bottom = SCREEN_HEIGHT;

  // BltFastDDSurfaceUsingSoftware(gpBackBuffer, 0, 0, gpFrameBuffer, RefreshScreen__Region);

  // gpDirectDrawObject.putImageData(gpFrameBuffer, 0, 0);
  // return;

  usScreenWidth = usScreenHeight = 0;

  if (RefreshScreen__fFirstTime) {
    RefreshScreen__fShowMouse = false;
  }

  // DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "Looping in refresh");

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //
  // REFRESH_THREAD_MUTEX
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////

  switch (guiVideoManagerState) {
    case VIDEO_ON: //
      // Excellent, everything is cosher, we continue on
      //
      RefreshScreen__uiRefreshThreadState = guiRefreshThreadState = THREAD_ON;
      usScreenWidth = gusScreenWidth;
      usScreenHeight = gusScreenHeight;
      break;
    case VIDEO_OFF: //
      // Hot damn, the video manager is suddenly off. We have to bugger out of here. Don't forget to
      // leave the critical section
      //
      guiRefreshThreadState = THREAD_OFF;
      return;
    case VIDEO_SUSPENDED: //
      // This are suspended. Make sure the refresh function does try to access any of the direct
      // draw surfaces
      //
      RefreshScreen__uiRefreshThreadState = guiRefreshThreadState = THREAD_SUSPENDED;
      break;
    case VIDEO_SHUTTING_DOWN: //
                              // Well things are shutting down. So we need to bugger out of there. Don't forget to leave the
                              // critical section before returning
                              //
      guiRefreshThreadState = THREAD_OFF;
      return;
  }

  //
  // Get the current mouse position
  //

  GetCursorPos(RefreshScreen__MousePos);

  /////////////////////////////////////////////////////////////////////////////////////////////
  //
  // FRAME_BUFFER_MUTEX
  //
  /////////////////////////////////////////////////////////////////////////////////////////////

  // RESTORE OLD POSITION OF MOUSE
  if (gMouseCursorBackground[CURRENT_MOUSE_DATA].fRestore == true) {
    RefreshScreen__Region.left = gMouseCursorBackground[CURRENT_MOUSE_DATA].usLeft;
    RefreshScreen__Region.top = gMouseCursorBackground[CURRENT_MOUSE_DATA].usTop;
    RefreshScreen__Region.right = gMouseCursorBackground[CURRENT_MOUSE_DATA].usRight;
    RefreshScreen__Region.bottom = gMouseCursorBackground[CURRENT_MOUSE_DATA].usBottom;

    BltFastDDSurfaceUsingSoftware(gpBackBuffer, gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseXPos, gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseYPos, gMouseCursorBackground[CURRENT_MOUSE_DATA].pSurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);

    // Save position into other background region
    copyMouseCursorBackground(gMouseCursorBackground[PREVIOUS_MOUSE_DATA], gMouseCursorBackground[CURRENT_MOUSE_DATA]);
  }

  //
  // Ok we were able to get a hold of the frame buffer stuff. Check to see if it needs updating
  // if not, release the frame buffer stuff right away
  //
  if (guiFrameBufferState == BUFFER_DIRTY) {
    // Well the frame buffer is dirty.
    //

    if (gpFrameBufferRefreshOverride != null) {
      //
      // Method (3) - We are using a function override to refresh the frame buffer. First we
      // call the override function then we must set the override pointer to NULL
      //

      gpFrameBufferRefreshOverride();
      gpFrameBufferRefreshOverride = null;
    }

    if (gfFadeInitialized && gfFadeInVideo) {
      gFadeFunction();
    } else
    //
    // Either Method (1) or (2)
    //
    {
      if (gfForceFullScreenRefresh == true) {
        //
        // Method (1) - We will be refreshing the entire screen
        //

        RefreshScreen__Region.left = 0;
        RefreshScreen__Region.top = 0;
        RefreshScreen__Region.right = usScreenWidth;
        RefreshScreen__Region.bottom = usScreenHeight;

        BltFastDDSurfaceUsingSoftware(gpBackBuffer, 0, 0, gpFrameBuffer, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
      } else {
        for (RefreshScreen__uiIndex = 0; RefreshScreen__uiIndex < guiDirtyRegionCount; RefreshScreen__uiIndex++) {
          RefreshScreen__Region.left = gListOfDirtyRegions[RefreshScreen__uiIndex].iLeft;
          RefreshScreen__Region.top = gListOfDirtyRegions[RefreshScreen__uiIndex].iTop;
          RefreshScreen__Region.right = gListOfDirtyRegions[RefreshScreen__uiIndex].iRight;
          RefreshScreen__Region.bottom = gListOfDirtyRegions[RefreshScreen__uiIndex].iBottom;

          BltFastDDSurfaceUsingSoftware(gpBackBuffer, RefreshScreen__Region.left, RefreshScreen__Region.top, gpFrameBuffer, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
        }

        // Now do new, extended dirty regions
        for (RefreshScreen__uiIndex = 0; RefreshScreen__uiIndex < guiDirtyRegionExCount; RefreshScreen__uiIndex++) {
          RefreshScreen__Region.left = gDirtyRegionsEx[RefreshScreen__uiIndex].iLeft;
          RefreshScreen__Region.top = gDirtyRegionsEx[RefreshScreen__uiIndex].iTop;
          RefreshScreen__Region.right = gDirtyRegionsEx[RefreshScreen__uiIndex].iRight;
          RefreshScreen__Region.bottom = gDirtyRegionsEx[RefreshScreen__uiIndex].iBottom;

          // Do some checks if we are in the process of scrolling!
          if (gfRenderScroll) {
            // Check if we are completely out of bounds
            if (RefreshScreen__Region.top <= gsVIEWPORT_WINDOW_END_Y && RefreshScreen__Region.bottom <= gsVIEWPORT_WINDOW_END_Y) {
              continue;
            }
          }

          BltFastDDSurfaceUsingSoftware(gpBackBuffer, RefreshScreen__Region.left, RefreshScreen__Region.top, gpFrameBuffer, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
        }
      }
    }
    if (gfRenderScroll) {
      ScrollJA2Background(guiScrollDirection, gsScrollXIncrement, gsScrollYIncrement, gpPrimarySurface, gpBackBuffer, true, PREVIOUS_MOUSE_DATA);
    }
    gfIgnoreScrollDueToCenterAdjust = false;

    //
    // Update the guiFrameBufferState variable to reflect that the frame buffer can now be handled
    //

    guiFrameBufferState = BUFFER_READY;
  }

  //
  // Ok we were able to get a hold of the frame buffer stuff. Check to see if it needs updating
  // if not, release the frame buffer stuff right away
  //

  if (guiMouseBufferState == BUFFER_DIRTY) {
    //
    // Well the mouse buffer is dirty. Upload the whole thing
    //

    RefreshScreen__Region.left = 0;
    RefreshScreen__Region.top = 0;
    RefreshScreen__Region.right = gusMouseCursorWidth;
    RefreshScreen__Region.bottom = gusMouseCursorHeight;

    BltFastDDSurfaceUsingSoftware(gpMouseCursor, 0, 0, gpMouseCursorOriginal, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
    guiMouseBufferState = BUFFER_READY;
  }

  //
  // Check current state of the mouse cursor
  //

  if (RefreshScreen__fShowMouse == false) {
    if (guiMouseBufferState == BUFFER_READY) {
      RefreshScreen__fShowMouse = true;
    } else {
      RefreshScreen__fShowMouse = false;
    }
  } else {
    if (guiMouseBufferState == BUFFER_DISABLED) {
      RefreshScreen__fShowMouse = false;
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //
  // End of MOUSE_BUFFER_MUTEX
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //
  // If fMouseState == TRUE
  //
  // (1) Save mouse background from gpBackBuffer to gpMouseCursorBackground
  // (2) If step (1) is successfull blit mouse cursor onto gpBackBuffer
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////

  if (RefreshScreen__fShowMouse == true) {
    //
    // Step (1) - Save mouse background
    //

    RefreshScreen__Region.left = RefreshScreen__MousePos.x - gsMouseCursorXOffset;
    RefreshScreen__Region.top = RefreshScreen__MousePos.y - gsMouseCursorYOffset;
    RefreshScreen__Region.right = RefreshScreen__Region.left + gusMouseCursorWidth;
    RefreshScreen__Region.bottom = RefreshScreen__Region.top + gusMouseCursorHeight;

    if (RefreshScreen__Region.right > usScreenWidth) {
      RefreshScreen__Region.right = usScreenWidth;
    }

    if (RefreshScreen__Region.bottom > usScreenHeight) {
      RefreshScreen__Region.bottom = usScreenHeight;
    }

    if ((RefreshScreen__Region.right > RefreshScreen__Region.left) && (RefreshScreen__Region.bottom > RefreshScreen__Region.top)) {
      //
      // Make sure the mouse background is marked for restore and coordinates are saved for the
      // future restore
      //

      gMouseCursorBackground[CURRENT_MOUSE_DATA].fRestore = true;
      gMouseCursorBackground[CURRENT_MOUSE_DATA].usRight = RefreshScreen__Region.right - RefreshScreen__Region.left;
      gMouseCursorBackground[CURRENT_MOUSE_DATA].usBottom = RefreshScreen__Region.bottom - RefreshScreen__Region.top;
      if (RefreshScreen__Region.left < 0) {
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usLeft = (0 - RefreshScreen__Region.left);
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseXPos = 0;
        RefreshScreen__Region.left = 0;
      } else {
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseXPos = RefreshScreen__MousePos.x - gsMouseCursorXOffset;
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usLeft = 0;
      }
      if (RefreshScreen__Region.top < 0) {
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseYPos = 0;
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usTop = (0 - RefreshScreen__Region.top);
        RefreshScreen__Region.top = 0;
      } else {
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseYPos = RefreshScreen__MousePos.y - gsMouseCursorYOffset;
        gMouseCursorBackground[CURRENT_MOUSE_DATA].usTop = 0;
      }

      if ((RefreshScreen__Region.right > RefreshScreen__Region.left) && (RefreshScreen__Region.bottom > RefreshScreen__Region.top)) {
        // Save clipped region
        copyRect(gMouseCursorBackground[CURRENT_MOUSE_DATA].Region, RefreshScreen__Region);

        //
        // Ok, do the actual data save to the mouse background
        //

        BltFastDDSurfaceUsingSoftware(gMouseCursorBackground[CURRENT_MOUSE_DATA].pSurface, gMouseCursorBackground[CURRENT_MOUSE_DATA].usLeft, gMouseCursorBackground[CURRENT_MOUSE_DATA].usTop, gpBackBuffer, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);

        //
        // Step (2) - Blit mouse cursor to back buffer
        //

        RefreshScreen__Region.left = gMouseCursorBackground[CURRENT_MOUSE_DATA].usLeft;
        RefreshScreen__Region.top = gMouseCursorBackground[CURRENT_MOUSE_DATA].usTop;
        RefreshScreen__Region.right = gMouseCursorBackground[CURRENT_MOUSE_DATA].usRight;
        RefreshScreen__Region.bottom = gMouseCursorBackground[CURRENT_MOUSE_DATA].usBottom;

        BltFastDDSurfaceUsingSoftware(gpBackBuffer, gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseXPos, gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseYPos, gpMouseCursor, RefreshScreen__Region, DDBLTFAST_SRCCOLORKEY);
      } else {
        //
        // Hum, the mouse was not blitted this round. Henceforth we will flag fRestore as FALSE
        //

        gMouseCursorBackground[CURRENT_MOUSE_DATA].fRestore = false;
      }
    } else {
      //
      // Hum, the mouse was not blitted this round. Henceforth we will flag fRestore as FALSE
      //

      gMouseCursorBackground[CURRENT_MOUSE_DATA].fRestore = false;
    }
  } else {
    //
    // Well since there was no mouse handling this round, we disable the mouse restore
    //

    gMouseCursorBackground[CURRENT_MOUSE_DATA].fRestore = false;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //
  // (1) Flip Pages
  // (2) If the page flipping worked, then we copy the contents of the primary surface back
  //     to the backbuffer
  // (3) If step (2) was successfull we then restore the mouse background onto the backbuffer
  //     if fShowMouse is TRUE
  //
  ///////////////////////////////////////////////////////////////////////////////////////////////

  //
  // Step (1) - Flip pages
  //

  const data = gpPrimarySurface.data;
  gpPrimarySurface.data.set(gpBackBuffer.data);
  gpBackBuffer.data.set(data);

  gpDirectDrawObject.putImageData(gpBackBuffer, 0, 0);


  //
  // Step (2) - Copy Primary Surface to the Back Buffer
  //
  if (gfRenderScroll) {
    RefreshScreen__Region.left = 0;
    RefreshScreen__Region.top = 0;
    RefreshScreen__Region.right = 640;
    RefreshScreen__Region.bottom = 360;

    BltFastDDSurfaceUsingSoftware(gpBackBuffer, 0, 0, gpPrimarySurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);

    // Get new background for mouse
    //
    // Ok, do the actual data save to the mouse background

    //

    gfRenderScroll = false;
    gfScrollStart = false;
  }

  // COPY MOUSE AREAS FROM PRIMARY BACK!

  // FIRST OLD ERASED POSITION
  if (gMouseCursorBackground[PREVIOUS_MOUSE_DATA].fRestore == true) {
    copyRect(RefreshScreen__Region, gMouseCursorBackground[PREVIOUS_MOUSE_DATA].Region);

    BltFastDDSurfaceUsingSoftware(gpBackBuffer, gMouseCursorBackground[PREVIOUS_MOUSE_DATA].usMouseXPos, gMouseCursorBackground[PREVIOUS_MOUSE_DATA].usMouseYPos, gpPrimarySurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
  }

  // NOW NEW MOUSE AREA
  if (gMouseCursorBackground[CURRENT_MOUSE_DATA].fRestore == true) {
    copyRect(RefreshScreen__Region, gMouseCursorBackground[CURRENT_MOUSE_DATA].Region);

    BltFastDDSurfaceUsingSoftware(gpBackBuffer, gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseXPos, gMouseCursorBackground[CURRENT_MOUSE_DATA].usMouseYPos, gpPrimarySurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
  }

  if (gfForceFullScreenRefresh == true) {
    //
    // Method (1) - We will be refreshing the entire screen
    //
    RefreshScreen__Region.left = 0;
    RefreshScreen__Region.top = 0;
    RefreshScreen__Region.right = SCREEN_WIDTH;
    RefreshScreen__Region.bottom = SCREEN_HEIGHT;

    BltFastDDSurfaceUsingSoftware(gpBackBuffer, 0, 0, gpPrimarySurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);

    guiDirtyRegionCount = 0;
    guiDirtyRegionExCount = 0;
    gfForceFullScreenRefresh = false;
  } else {
    for (RefreshScreen__uiIndex = 0; RefreshScreen__uiIndex < guiDirtyRegionCount; RefreshScreen__uiIndex++) {
      RefreshScreen__Region.left = gListOfDirtyRegions[RefreshScreen__uiIndex].iLeft;
      RefreshScreen__Region.top = gListOfDirtyRegions[RefreshScreen__uiIndex].iTop;
      RefreshScreen__Region.right = gListOfDirtyRegions[RefreshScreen__uiIndex].iRight;
      RefreshScreen__Region.bottom = gListOfDirtyRegions[RefreshScreen__uiIndex].iBottom;

      BltFastDDSurfaceUsingSoftware(gpBackBuffer, RefreshScreen__Region.left, RefreshScreen__Region.top, gpPrimarySurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
    }

    guiDirtyRegionCount = 0;
    gfForceFullScreenRefresh = false;
  }

  // Do extended dirty regions!
  for (RefreshScreen__uiIndex = 0; RefreshScreen__uiIndex < guiDirtyRegionExCount; RefreshScreen__uiIndex++) {
    RefreshScreen__Region.left = gDirtyRegionsEx[RefreshScreen__uiIndex].iLeft;
    RefreshScreen__Region.top = gDirtyRegionsEx[RefreshScreen__uiIndex].iTop;
    RefreshScreen__Region.right = gDirtyRegionsEx[RefreshScreen__uiIndex].iRight;
    RefreshScreen__Region.bottom = gDirtyRegionsEx[RefreshScreen__uiIndex].iBottom;

    if ((RefreshScreen__Region.top < gsVIEWPORT_WINDOW_END_Y) && gfRenderScroll) {
      continue;
    }

    BltFastDDSurfaceUsingSoftware(gpBackBuffer, RefreshScreen__Region.left, RefreshScreen__Region.top, gpPrimarySurface, RefreshScreen__Region, DDBLTFAST_NOCOLORKEY);
  }

  guiDirtyRegionExCount = 0;

  RefreshScreen__fFirstTime = false;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Direct X object access functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetDirectDraw2Object(): CanvasRenderingContext2D {
  Assert(gpDirectDrawObject != null);

  return gpDirectDrawObject;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetPrimarySurfaceObject(): ImageData {
  Assert(gpPrimarySurface != null);

  return gpPrimarySurface;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetBackBufferObject(): ImageData {
  Assert(gpPrimarySurface != null);

  return gpBackBuffer;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetFrameBufferObject(): ImageData {
  Assert(gpPrimarySurface != null);

  return gpFrameBuffer;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetMouseBufferObject(): ImageData {
  Assert(gpPrimarySurface != null);

  return gpMouseCursor;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Buffer access functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export function LockPrimarySurface(uiPitch: Pointer<UINT32>): Uint8ClampedArray {
  uiPitch.value = SCREEN_WIDTH * 4;

  return gpPrimarySurface.data;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function UnlockPrimarySurface(): void {
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function LockBackBuffer(uiPitch: Pointer<UINT32>): Uint8ClampedArray {
  uiPitch.value = SCREEN_WIDTH * 4;

  return gpBackBuffer.data;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function UnlockBackBuffer(): void {
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function LockFrameBuffer(uiPitch: Pointer<UINT32>): Uint8ClampedArray {
  uiPitch.value = SCREEN_WIDTH * 4;

  return gpFrameBuffer.data;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function UnlockFrameBuffer(): void {
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function LockMouseBuffer(uiPitch: Pointer<UINT32>): Uint8ClampedArray {
  uiPitch.value = MAX_CURSOR_WIDTH * 4;

  return gpMouseCursorOriginal.data;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function UnlockMouseBuffer(): void {
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// RGB color management functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function GetRGBDistribution(): boolean {
  let usBit: UINT16;

  //
  // Ok we now have the surface description, we now can get the information that we need
  //

  gusRedMask = 0x7c00;
  gusGreenMask = 0x03e0;
  gusBlueMask = 0x1f;

  // RGB 5,5,5
  if ((gusRedMask == 0x7c00) && (gusGreenMask == 0x03e0) && (gusBlueMask == 0x1f))
    guiTranslucentMask = 0x3def;
  // RGB 5,6,5
  else // if((gusRedMask==0xf800) && (gusGreenMask==0x03e0) && (gusBlueMask==0x1f))
    guiTranslucentMask = 0x7bef;

  usBit = 0x8000;
  gusRedShift = 8;
  while (!(gusRedMask & usBit)) {
    usBit >>= 1;
    gusRedShift--;
  }

  usBit = 0x8000;
  gusGreenShift = 8;
  while (!(gusGreenMask & usBit)) {
    usBit >>= 1;
    gusGreenShift--;
  }

  usBit = 0x8000;
  gusBlueShift = 8;
  while (!(gusBlueMask & usBit)) {
    usBit >>= 1;
    gusBlueShift--;
  }

  return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function GetPrimaryRGBDistributionMasks(): { usRedMask: UINT16, usGreenMask: UINT16, usBlueMask: UINT16 } {
  let usRedMask: UINT16;
  let usGreenMask: UINT16;
  let usBlueMask: UINT16;

  usRedMask = gusRedMask;
  usGreenMask = gusGreenMask;
  usBlueMask = gusBlueMask;

  return { usRedMask, usGreenMask, usBlueMask };
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function EraseMouseCursor(): boolean {
  let pTmpPointer: Uint8ClampedArray;
  let uiPitch: UINT32;

  //
  // Erase cursor background
  //

  pTmpPointer = LockMouseBuffer(createPointer(() => uiPitch, (v) => uiPitch = v));
  pTmpPointer.fill(0);
  UnlockMouseBuffer();

  // Don't set dirty
  return true;
}

export function SetMouseCursorProperties(sOffsetX: INT16, sOffsetY: INT16, usCursorHeight: UINT16, usCursorWidth: UINT16): boolean {
  gsMouseCursorXOffset = sOffsetX;
  gsMouseCursorYOffset = sOffsetY;
  gusMouseCursorWidth = usCursorWidth;
  gusMouseCursorHeight = usCursorHeight;
  return true;
}

export function DirtyCursor(): void {
  guiMouseBufferState = BUFFER_DIRTY;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function SetCurrentCursor(usVideoObjectSubIndex: UINT16, usOffsetX: UINT16, usOffsetY: UINT16): boolean {
  let ReturnValue: boolean;
  let pTmpPointer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;
  let pETRLEPointer: ETRLEObject = createETRLEObject();

  //
  // Make sure we have a cursor store
  //

  if (gpCursorStore == null) {
    DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "ERROR : Cursor store is not loaded");
    return false;
  }

  //
  // Ok, then blit the mouse cursor to the MOUSE_BUFFER (which is really gpMouseBufferOriginal)
  //
  //
  // Erase cursor background
  //

  pTmpPointer = LockMouseBuffer(createPointer(() => uiPitch, (v) => uiPitch = v));
  pTmpPointer.fill(0);
  UnlockMouseBuffer();

  //
  // Get new cursor data
  //

  ReturnValue = BltVideoObject(MOUSE_BUFFER, gpCursorStore, usVideoObjectSubIndex, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
  guiMouseBufferState = BUFFER_DIRTY;

  if (GetVideoObjectETRLEProperties(gpCursorStore, pETRLEPointer, usVideoObjectSubIndex)) {
    gsMouseCursorXOffset = usOffsetX;
    gsMouseCursorYOffset = usOffsetY;
    gusMouseCursorWidth = pETRLEPointer.usWidth + pETRLEPointer.sOffsetX;
    gusMouseCursorHeight = pETRLEPointer.usHeight + pETRLEPointer.sOffsetY;

    DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "=================================================");
    DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, FormatString("Mouse Create with [ %d. %d ] [ %d, %d]", pETRLEPointer.sOffsetX, pETRLEPointer.sOffsetY, pETRLEPointer.usWidth, pETRLEPointer.usHeight));
    DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "=================================================");
  } else {
    DebugMsg(TOPIC_VIDEO, DBG_LEVEL_0, "Failed to get mouse info");
  }

  return ReturnValue;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function StartFrameBufferRender(): void {
  return;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function EndFrameBufferRender(): void {
  guiFrameBufferState = BUFFER_DIRTY;

  return;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function PrintScreen(): void {
  gfPrintFrameBuffer = true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
export function Set8BPPPalette(pPalette: SGPPaletteEntry[]): boolean {
  // If we are in 256 colors, then we have to initialize the palette system to 0 (faded out)
  copyObjectArray(gSgpPalette, pPalette, copySGPPaletteEntry);

  return true;
}

export function FatalError(pError: string /* Pointer<UINT8> */, ...args: any[]): void {
  gFatalErrorString = sprintf(pError, ...args);

  gfProgramIsRunning = false;

  alert(gFatalErrorString);
}

function BltFastDDSurfaceUsingSoftware(pDestSurface: ImageData, uiX: INT32, uiY: INT32, pSrcSurface: ImageData, pSrcRect: RECT, uiTrans: UINT32): boolean {
  let uiDestPitchBYTES: UINT32
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Uint8ClampedArray;
  let pSrcBuf: Uint8ClampedArray;

  // Lock surfaces
  uiDestPitchBYTES = pDestSurface.width * 4;
	pDestBuf = pDestSurface.data;

	// Lock surfaces
	uiSrcPitchBYTES = pSrcSurface.width * 4;
	pSrcBuf = pSrcSurface.data;

  if (uiTrans == DDBLTFAST_NOCOLORKEY) {
    return Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, uiX , uiY, pSrcRect.left , pSrcRect.top, pSrcRect.right - pSrcRect.left, pSrcRect.bottom - pSrcRect.top);
  } else if (uiTrans == DDBLTFAST_SRCCOLORKEY) {
    return Blt16BPPTo16BPPTrans(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, uiX , uiY, pSrcRect.left , pSrcRect.top, pSrcRect.right - pSrcRect.left, pSrcRect.bottom - pSrcRect.top, 0);
  }

  return true;
}

}
