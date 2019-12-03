namespace ja2 {

const SQUARE_STEP = 8;

export let gfFadeInitialized: boolean = false;
let gbFadeValue: INT8;
let gsFadeLimit: INT16;
let guiTime: UINT32;
let guiFadeDelay: UINT32;
let gfFirstTimeInFade: boolean = false;
let gsFadeCount: INT16;
let gbFadeType: INT8;
let giX1: INT32;
let giX2: INT32;
let giY1: INT32;
let giY2: INT32;
let gsFadeRealCount: INT16;
export let gfFadeInVideo: boolean;

let uiOldMusicMode: UINT32;

export let gFadeFunction: FADE_FUNCTION;

export let gFadeInDoneCallback: FADE_HOOK | null = null;
export let gFadeOutDoneCallback: FADE_HOOK | null = null;

export let gfFadeIn: boolean = false;
export let gfFadeOut: boolean = false;
export let gfFadeOutDone: boolean = false;
let gfFadeInDone: boolean = false;

export function FadeInNextFrame(): void {
  gfFadeIn = true;
  gfFadeInDone = false;
}

export function FadeOutNextFrame(): void {
  gfFadeOut = true;
  gfFadeOutDone = false;
}

export function HandleBeginFadeIn(uiScreenExit: UINT32): boolean {
  if (gfFadeIn) {
    BeginFade(uiScreenExit, 35, FADE_IN_REALFADE, 5);

    gfFadeIn = false;

    gfFadeInDone = true;

    return true;
  }

  return false;
}

export function HandleBeginFadeOut(uiScreenExit: UINT32): boolean {
  if (gfFadeOut) {
    BeginFade(uiScreenExit, 35, FADE_OUT_REALFADE, 5);

    gfFadeOut = false;

    gfFadeOutDone = true;

    return true;
  }

  return false;
}

export function HandleFadeOutCallback(): boolean {
  if (gfFadeOutDone) {
    gfFadeOutDone = false;

    if (gFadeOutDoneCallback != null) {
      gFadeOutDoneCallback();

      gFadeOutDoneCallback = null;

      return true;
    }
  }

  return false;
}

export function HandleFadeInCallback(): boolean {
  if (gfFadeInDone) {
    gfFadeInDone = false;

    if (gFadeInDoneCallback != null) {
      gFadeInDoneCallback();
    }

    gFadeInDoneCallback = null;

    return true;
  }

  return false;
}

function BeginFade(uiExitScreen: UINT32, bFadeValue: INT8, bType: INT8, uiDelay: UINT32): void {
  // Init some paramters
  guiExitScreen = uiExitScreen;
  gbFadeValue = bFadeValue;
  guiFadeDelay = uiDelay;
  gfFadeIn = false;
  gfFadeInVideo = true;

  uiOldMusicMode = uiMusicHandle;

  // Calculate step;
  switch (bType) {
    case FADE_IN_REALFADE:

      gsFadeRealCount = -1;
      gsFadeLimit = 8;
      gFadeFunction = FadeInFrameBufferRealFade;
      gfFadeInVideo = false;

      // Copy backbuffer to savebuffer
      UpdateSaveBufferWithBackbuffer();

      // Clear framebuffer
      ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
      break;

    case FADE_OUT_REALFADE:

      gsFadeRealCount = -1;
      gsFadeLimit = 10;
      gFadeFunction = FadeFrameBufferRealFade;
      gfFadeInVideo = false;

      // Clear framebuffer
      // ColorFillVideoSurfaceArea( FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor( FROMRGB( 0, 0, 0 ) ) );
      break;

    case FADE_OUT_VERSION_ONE:
      // gsFadeLimit = 255 / bFadeValue;
      // gFadeFunction = (FADE_FUNCTION)FadeFrameBufferVersionOne;
      // SetMusicFadeSpeed( 25 );
      // SetMusicMode( MUSIC_NONE );
      break;

    case FADE_OUT_SQUARE:
      gsFadeLimit = (640 / (SQUARE_STEP * 2));
      giX1 = 0;
      giX2 = 640;
      giY1 = 0;
      giY2 = 480;
      gFadeFunction = FadeFrameBufferSquare;

      // Zero frame buffer
      ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
      // ColorFillVideoSurfaceArea( guiSAVEBUFFER, 0, 0, 640,	480, Get16BPPColor( FROMRGB( 0, 0, 0 ) ) );

      //	SetMusicFadeSpeed( 25 );
      // SetMusicMode( MUSIC_NONE );
      break;

    case FADE_IN_VERSION_ONE:
      gsFadeLimit = 255 / bFadeValue;
      gFadeFunction = FadeInBackBufferVersionOne;
      break;

    case FADE_IN_SQUARE:
      gFadeFunction = FadeInBackBufferSquare;
      giX1 = 320;
      giX2 = 320;
      giY1 = 240;
      giY2 = 240;
      gsFadeLimit = (640 / (SQUARE_STEP * 2));
      gfFadeIn = true;
      break;

    case FADE_OUT_VERSION_FASTER:
      gsFadeLimit = (255 / bFadeValue) * 2;
      gFadeFunction = <FADE_FUNCTION>FadeFrameBufferVersionFaster;

      // SetMusicFadeSpeed( 25 );
      // SetMusicMode( MUSIC_NONE );
      break;

    case FADE_OUT_VERSION_SIDE:
      // Copy frame buffer to save buffer
      gsFadeLimit = (640 / 8);
      gFadeFunction = FadeFrameBufferSide;

      // SetMusicFadeSpeed( 25 );
      // SetMusicMode( MUSIC_NONE );
      break;
  }

  gfFadeInitialized = true;
  gfFirstTimeInFade = true;
  gsFadeCount = 0;
  gbFadeType = bType;

  SetPendingNewScreen(Enum26.FADE_SCREEN);
}

export function FadeScreenInit(): boolean {
  return true;
}

export function FadeScreenHandle(): UINT32 {
  let uiTime: UINT32;

  if (!gfFadeInitialized) {
    SET_ERROR("Fade Screen called but not intialized ");
    return Enum26.ERROR_SCREEN;
  }

  // ATE: Remove cursor
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  if (gfFirstTimeInFade) {
    gfFirstTimeInFade = false;

    // Calcuate delay
    guiTime = GetJA2Clock();
  }

  // Get time
  uiTime = GetJA2Clock();

  MusicPoll(true);

  if ((uiTime - guiTime) > guiFadeDelay) {
    // Fade!
    if (!gfFadeIn) {
      // gFadeFunction( );
    }

    InvalidateScreen();

    if (!gfFadeInVideo) {
      gFadeFunction();
    }

    gsFadeCount++;

    if (gsFadeCount > gsFadeLimit) {
      switch (gbFadeType) {
        case FADE_OUT_REALFADE:

          // Clear framebuffer
          ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
          break;
      }

      // End!
      gfFadeInitialized = false;
      gfFadeIn = false;

      return guiExitScreen;
    }
  }

  return Enum26.FADE_SCREEN;
}

export function FadeScreenShutdown(): boolean {
  return false;
}

function FadeFrameBufferVersionOne(): void {
  let cX: INT32;
  let cY: INT32;
  let uiDestPitchBYTES: UINT32;
  let pBuf: Pointer<UINT16>;
  let bR: INT16;
  let bG: INT16;
  let bB: INT16;
  let uiRGBColor: UINT32;
  let s16BPPSrc: UINT16;

  pBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

  // LOCK FRAME BUFFER
  for (cX = 0; cX < 640; cX++) {
    for (cY = 0; cY < 480; cY++) {
      s16BPPSrc = pBuf[(cY * 640) + cX];

      uiRGBColor = GetRGBColor(s16BPPSrc);

      bR = SGPGetRValue(uiRGBColor);
      bG = SGPGetGValue(uiRGBColor);
      bB = SGPGetBValue(uiRGBColor);

      // Fade down
      bR -= gbFadeValue;
      if (bR < 0)
        bR = 0;

      bG -= gbFadeValue;
      if (bG < 0)
        bG = 0;

      bB -= gbFadeValue;
      if (bB < 0)
        bB = 0;

      // Set back info buffer
      pBuf[(cY * 640) + cX] = Get16BPPColor(FROMRGB(bR, bG, bB));
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);
}

function FadeInBackBufferVersionOne(): void {
  let cX: INT32;
  let cY: INT32;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pSrcBuf: Pointer<UINT16>;
  let pDestBuf: Pointer<UINT16>;
  let bR: INT16;
  let bG: INT16;
  let bB: INT16;
  let uiRGBColor: UINT32;
  let s16BPPSrc: UINT16;
  let bFadeVal: INT16 = (gsFadeLimit - gsFadeCount) * gbFadeValue;

  pDestBuf = LockVideoSurface(BACKBUFFER, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiSrcPitchBYTES));

  // LOCK FRAME BUFFER
  for (cX = 0; cX < 640; cX++) {
    for (cY = 0; cY < 480; cY++) {
      s16BPPSrc = pSrcBuf[(cY * 640) + cX];

      uiRGBColor = GetRGBColor(s16BPPSrc);

      bR = SGPGetRValue(uiRGBColor);
      bG = SGPGetGValue(uiRGBColor);
      bB = SGPGetBValue(uiRGBColor);

      // Fade down
      bR -= bFadeVal;
      if (bR < 0)
        bR = 0;

      bG -= bFadeVal;
      if (bG < 0)
        bG = 0;

      bB -= bFadeVal;
      if (bB < 0)
        bB = 0;

      // Set back info dest buffer
      pDestBuf[(cY * 640) + cX] = Get16BPPColor(FROMRGB(bR, bG, bB));
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);
  UnLockVideoSurface(BACKBUFFER);
}

function FadeFrameBufferVersionFaster(bFadeValue: INT8): void {
  let cX: INT32;
  let cY: INT32;
  let iStartX: INT32;
  let iStartY: INT32;
  let uiDestPitchBYTES: UINT32;
  let pBuf: Pointer<UINT16>;
  let bR: INT16;
  let bG: INT16;
  let bB: INT16;
  let uiRGBColor: UINT32;
  let s16BPPSrc: UINT16;

  pBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

  iStartX = gsFadeCount % 2;
  iStartY = 0;

  // LOCK FRAME BUFFER
  for (cX = iStartX; cX < 640; cX += 2) {
    if (iStartX == 1) {
      iStartX = 0;
    } else {
      iStartX = 1;
    }

    for (cY = iStartY; cY < 480; cY++) {
      s16BPPSrc = pBuf[(cY * 640) + cX];

      uiRGBColor = GetRGBColor(s16BPPSrc);

      bR = SGPGetRValue(uiRGBColor);
      bG = SGPGetGValue(uiRGBColor);
      bB = SGPGetBValue(uiRGBColor);

      // Fade down
      bR -= bFadeValue;
      if (bR < 0)
        bR = 0;

      bG -= bFadeValue;
      if (bG < 0)
        bG = 0;

      bB -= bFadeValue;
      if (bB < 0)
        bB = 0;

      // Set back info buffer
      pBuf[(cY * 640) + cX] = Get16BPPColor(FROMRGB(bR, bG, bB));
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);
}

function FadeFrameBufferSide(): void {
  let iX1: INT32;
  let iX2: INT32;
  let sFadeMove: INT16;

  sFadeMove = gsFadeCount * 4;

  iX1 = 0;
  iX2 = sFadeMove;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, iX1, 0, iX2, 480, Get16BPPColor(FROMRGB(0, 0, 0)));

  iX1 = 640 - sFadeMove;
  iX2 = 640;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, iX1, 0, iX2, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
}

function FadeFrameBufferSquare(): void {
  let iX1: INT32;
  let iX2: INT32;
  let iY1: INT32;
  let iY2: INT32;
  let sFadeXMove: INT16;
  let sFadeYMove: INT16;

  sFadeXMove = SQUARE_STEP;
  sFadeYMove = (sFadeXMove * .75);

  iX1 = giX1;
  iX2 = giX1 + sFadeXMove;
  iY1 = giY1;
  iY2 = giY1 + sFadeYMove;

  ColorFillVideoSurfaceArea(BACKBUFFER, iX1, 0, iX2, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  ColorFillVideoSurfaceArea(BACKBUFFER, 0, iY1, 640, iY2, Get16BPPColor(FROMRGB(0, 0, 0)));

  iX1 = giX2 - sFadeXMove;
  iX2 = giX2;
  iY1 = giY2 - sFadeYMove;
  iY2 = giY2;

  ColorFillVideoSurfaceArea(BACKBUFFER, iX1, 0, iX2, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  ColorFillVideoSurfaceArea(BACKBUFFER, 0, iY1, 640, iY2, Get16BPPColor(FROMRGB(0, 0, 0)));

  giX1 += sFadeXMove;
  giX2 -= sFadeXMove;
  giY1 += sFadeYMove;
  giY2 -= sFadeYMove;
}

function FadeInBackBufferSquare(): void {
  let iX1: INT32;
  let iX2: INT32;
  let iY1: INT32;
  let iY2: INT32;
  let sFadeXMove: INT16;
  let sFadeYMove: INT16;
  let BltFx: blt_vs_fx = createBltVsFx();

  sFadeXMove = SQUARE_STEP;
  sFadeYMove = (sFadeXMove * .75);

  if (gsFadeCount == 0) {
    ColorFillVideoSurfaceArea(BACKBUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  }

  iX1 = giX1 - sFadeXMove;
  iX2 = giX1;
  iY1 = giY1 - sFadeYMove;
  iY2 = giY2 + sFadeYMove;

  BltFx.SrcRect.iLeft = iX1;
  BltFx.SrcRect.iTop = iY1;
  BltFx.SrcRect.iRight = iX2;
  BltFx.SrcRect.iBottom = iY2;

  if (BltFx.SrcRect.iRight != BltFx.SrcRect.iLeft) {
    BltVideoSurface(BACKBUFFER, FRAME_BUFFER, 0, iX1, iY1, VS_BLT_SRCSUBRECT, BltFx);
  }

  iX1 = giX2;
  iX2 = giX2 + sFadeXMove;
  iY1 = giY1 - sFadeYMove;
  iY2 = giY2 + sFadeYMove;

  BltFx.SrcRect.iLeft = iX1;
  BltFx.SrcRect.iTop = iY1;
  BltFx.SrcRect.iRight = iX2;
  BltFx.SrcRect.iBottom = iY2;

  if (BltFx.SrcRect.iRight != BltFx.SrcRect.iLeft) {
    BltVideoSurface(BACKBUFFER, FRAME_BUFFER, 0, iX1, iY1, VS_BLT_SRCSUBRECT, BltFx);
  }

  iX1 = giX1;
  iX2 = giX2;
  iY1 = giY1 - sFadeYMove;
  iY2 = giY1;

  BltFx.SrcRect.iLeft = iX1;
  BltFx.SrcRect.iTop = iY1;
  BltFx.SrcRect.iRight = iX2;
  BltFx.SrcRect.iBottom = iY2;

  if (BltFx.SrcRect.iBottom != BltFx.SrcRect.iTop) {
    BltVideoSurface(BACKBUFFER, FRAME_BUFFER, 0, iX1, iY1, VS_BLT_SRCSUBRECT, BltFx);
  }

  iX1 = giX1;
  iX2 = giX2;
  iY1 = giY2;
  iY2 = giY2 + sFadeYMove;

  BltFx.SrcRect.iLeft = iX1;
  BltFx.SrcRect.iTop = iY1;
  BltFx.SrcRect.iRight = iX2;
  BltFx.SrcRect.iBottom = iY2;

  if (BltFx.SrcRect.iBottom != BltFx.SrcRect.iTop) {
    BltVideoSurface(BACKBUFFER, FRAME_BUFFER, 0, iX1, iY1, VS_BLT_SRCSUBRECT, BltFx);
  }

  giX1 -= sFadeXMove;
  giX2 += sFadeXMove;
  giY1 -= sFadeYMove;
  giY2 += sFadeYMove;
}

function FadeFrameBufferRealFade(): void {
  if (gsFadeRealCount != gsFadeCount) {
    ShadowVideoSurfaceRectUsingLowPercentTable(FRAME_BUFFER, 0, 0, 640, 480);

    gsFadeRealCount = gsFadeCount;
  }
}

function FadeInFrameBufferRealFade(): void {
  let cnt: INT32;

  if (gsFadeRealCount != gsFadeCount) {
    for (cnt = 0; cnt < (gsFadeLimit - gsFadeCount); cnt++) {
      ShadowVideoSurfaceRectUsingLowPercentTable(FRAME_BUFFER, 0, 0, 640, 480);
    }

    // Refresh Screen
    RefreshScreen(null);

    // Copy save buffer back
    RestoreExternBackgroundRect(0, 0, 640, 480);

    gsFadeRealCount = gsFadeCount;
  }
}

function UpdateSaveBufferWithBackbuffer(): boolean {
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pSrcBuf: Pointer<UINT8>;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;

  // Update saved buffer - do for the viewport size ony!
  ({ usWidth, usHeight, ubBitDepth } = GetCurrentVideoSettings());

  pSrcBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiSrcPitchBYTES));
  pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));

  if (gbPixelDepth == 16) {
    // BLIT HERE
    Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, 0, 0, 0, 0, 640, 480);
  }

  UnLockVideoSurface(FRAME_BUFFER);
  UnLockVideoSurface(guiSAVEBUFFER);

  return true;
}

}
