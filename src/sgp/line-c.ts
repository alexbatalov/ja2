//**************************************************************************
//
//				Example Usage
//
//**************************************************************************

//	SEND THE PITCH IN BYTES
//	SetClippingRegionAndImageWidth( uiPitch, 15, 15, 30, 30 );
//
//	LineDraw( TRUE, 10, 10, 200, 200, colour, pImageData);
//    OR
//	RectangleDraw( TRUE, 10, 10, 200, 200, colour, pImageData);

//**************************************************************************
//
//				Line Drawing Functions
//
//**************************************************************************

let giImageWidth: int = 0;
let giClipXMin: int = 0;
let giClipXMax: int = 0;
let giClipYMin: int = 0;
let giClipYMax: int = 0;

function SetClippingRegionAndImageWidth(iImageWidth: int, iClipStartX: int, iClipStartY: int, iClipWidth: int, iClipHeight: int): void {
  giImageWidth = iImageWidth;
  giClipXMin = iClipStartX;
  giClipXMax = iClipStartX + iClipWidth - 1;
  giClipYMin = iClipStartY;
  giClipYMax = iClipStartY + iClipHeight - 1;
}

function Clipt(denom: FLOAT, num: FLOAT, tE: Pointer<FLOAT>, tL: Pointer<FLOAT>): BOOL {
  let t: FLOAT;
  let accept: BOOL;

  accept = TRUE;

  if (denom > 0.0f) {
    t = num / denom;
    if (t > tL.value)
      accept = FALSE;
    else if (t > tE.value)
      tE.value = t;
  } else if (denom < 0.0f) {
    t = num / denom;
    if (t < tE.value)
      accept = FALSE;
    else if (t < tL.value)
      tL.value = t;
  } else if (num > 0)
    accept = FALSE;

  return accept;
}

function ClipPoint(x: int, y: int): BOOL {
  return x <= giClipXMax && x >= giClipXMin && y <= giClipYMax && y >= giClipYMin;
}

function Clip2D(ix0: Pointer<int>, iy0: Pointer<int>, ix1: Pointer<int>, iy1: Pointer<int>): BOOL {
  let visible: BOOL;
  let te: FLOAT;
  let tl: FLOAT;
  let dx: FLOAT;
  let dy: FLOAT;
  let x0: FLOAT;
  let y0: FLOAT;
  let x1: FLOAT;
  let y1: FLOAT;

  x0 = ix0.value;
  x1 = ix1.value;
  y0 = iy0.value;
  y1 = iy1.value;

  dx = x1 - x0;
  dy = y1 - y0;
  visible = FALSE;

  if (dx == 0.0 && dy == 0.0 && ClipPoint(ix0.value, iy0.value))
    visible = TRUE;
  else {
    te = 0.0f;
    tl = 1.0f;
    if (Clipt(dx, giClipXMin - x0, addressof(te), addressof(tl))) {
      if (Clipt(-dx, x0 - giClipXMax, addressof(te), addressof(tl))) {
        if (Clipt(dy, giClipYMin - y0, addressof(te), addressof(tl))) {
          if (Clipt(-dy, y0 - giClipYMax, addressof(te), addressof(tl))) {
            visible = TRUE;
            if (tl < 1.0f) {
              x1 = x0 + tl * dx;
              y1 = y0 + tl * dy;
            }
            if (te > 0) {
              x0 = x0 + te * dx;
              y0 = y0 + te * dy;
            }
          }
        }
      }
    }
  }

  ix0.value = x0;
  ix1.value = x1;
  iy0.value = y0;
  iy1.value = y1;

  return visible;
}

/* Draws a line between the specified endpoints in color Color. */
function LineDraw(fClip: BOOL, XStart: int, YStart: int, XEnd: int, YEnd: int, Color: short, ScreenPtr: Pointer<char>): void {
  let Temp: int;
  let AdjUp: int;
  let AdjDown: int;
  let ErrorTerm: int;
  let XAdvance: int;
  let XDelta: int;
  let YDelta: int;
  let WholeStep: int;
  let InitialPixelCount: int;
  let FinalPixelCount: int;
  let i: int;
  let RunLength: int;
  let ScreenWidth: int = giImageWidth / 2;
  let col2: char = Color >> 8;
  let col1: char = Color & 0x00FF;

  if (fClip) {
    if (!Clip2D(addressof(XStart), addressof(YStart), addressof(XEnd), addressof(YEnd)))
      return;
  }

  /*	We'll always draw top to bottom, to reduce the number of cases we have to
          handle, and to make lines between the same endpoints draw the same pixels */
  if (YStart > YEnd) {
    Temp = YStart;
    YStart = YEnd;
    YEnd = Temp;
    Temp = XStart;
    XStart = XEnd;
    XEnd = Temp;
  }

  // point to the bitmap address first pixel to draw
  ScreenPtr = ScreenPtr + YStart * giImageWidth + XStart * 2;

  /*	Figure out whether we're going left or right, and how far we're
          going horizontally */
  if ((XDelta = XEnd - XStart) < 0) {
    XAdvance = -1;
    XDelta = -XDelta;
  } else {
    XAdvance = 1;
  }
  /* Figure out how far we're going vertically */
  YDelta = YEnd - YStart;

  /* Special-case horizontal, vertical, and diagonal lines, for speed
  and to avoid nasty boundary conditions and division by 0 */
  if (XDelta == 0) {
    /* Vertical line */
    for (i = 0; i <= YDelta; i++) {
      ScreenPtr[0] = col1;
      ScreenPtr[1] = col2;
      ScreenPtr += giImageWidth;
    }
    return;
  }
  if (YDelta == 0) {
    /* Horizontal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr[0] = col1;
      ScreenPtr[1] = col2;
      ScreenPtr += XAdvance * 2;
    }
    return;
  }
  if (XDelta == YDelta) {
    /* Diagonal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr[0] = col1;
      ScreenPtr[1] = col2;
      ScreenPtr += (XAdvance * 2) + giImageWidth;
    }
    return;
  }

  /* Determine whether the line is X or Y major, and handle accordingly */
  if (XDelta >= YDelta) {
    /* X major line */
    /* Minimum # of pixels in a run in this line */
    WholeStep = XDelta / YDelta;

    /* Error term adjust each time Y steps by 1; used to tell when one
       extra pixel should be drawn as part of a run, to account for
       fractional steps along the X axis per 1-pixel steps along Y */
    AdjUp = (XDelta % YDelta) * 2;

    /* Error term adjust when the error term turns over, used to factor
       out the X step made at that time */
    AdjDown = YDelta * 2;

    /* Initial error term; reflects an initial step of 0.5 along the Y
       axis */
    ErrorTerm = (XDelta % YDelta) - (YDelta * 2);

    /* The initial and last runs are partial, because Y advances only 0.5
       for these runs, rather than 1. Divide one full run, plus the
       initial pixel, between the initial and last runs */
    InitialPixelCount = (WholeStep / 2) + 1;
    FinalPixelCount = InitialPixelCount;

    /* If the basic run length is even and there's no fractional
       advance, we have one pixel that could go to either the initial
       or last partial run, which we'll arbitrarily allocate to the
       last run */
    if ((AdjUp == 0) && ((WholeStep & 0x01) == 0)) {
      InitialPixelCount--;
    }
    /* If there're an odd number of pixels per run, we have 1 pixel that can't
       be allocated to either the initial or last partial run, so we'll add 0.5
       to error term so this pixel will be handled by the normal full-run loop */
    if ((WholeStep & 0x01) != 0) {
      ErrorTerm += YDelta;
    }
    /* Draw the first, partial run of pixels */
    DrawHorizontalRun(addressof(ScreenPtr), XAdvance, InitialPixelCount, Color, ScreenWidth);
    /* Draw all full runs */
    for (i = 0; i < (YDelta - 1); i++) {
      RunLength = WholeStep; /* run is at least this long */
      /* Advance the error term and add an extra pixel if the error
         term so indicates */
      if ((ErrorTerm += AdjUp) > 0) {
        RunLength++;
        ErrorTerm -= AdjDown; /* reset the error term */
      }
      /* Draw this scan line's run */
      DrawHorizontalRun(addressof(ScreenPtr), XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    DrawHorizontalRun(addressof(ScreenPtr), XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  } else {
    /* Y major line */

    /* Minimum # of pixels in a run in this line */
    WholeStep = YDelta / XDelta;

    /* Error term adjust each time X steps by 1; used to tell when 1 extra
       pixel should be drawn as part of a run, to account for
       fractional steps along the Y axis per 1-pixel steps along X */
    AdjUp = (YDelta % XDelta) * 2;

    /* Error term adjust when the error term turns over, used to factor
       out the Y step made at that time */
    AdjDown = XDelta * 2;

    /* Initial error term; reflects initial step of 0.5 along the X axis */
    ErrorTerm = (YDelta % XDelta) - (XDelta * 2);

    /* The initial and last runs are partial, because X advances only 0.5
       for these runs, rather than 1. Divide one full run, plus the
       initial pixel, between the initial and last runs */
    InitialPixelCount = (WholeStep / 2) + 1;
    FinalPixelCount = InitialPixelCount;

    /* If the basic run length is even and there's no fractional advance, we
       have 1 pixel that could go to either the initial or last partial run,
       which we'll arbitrarily allocate to the last run */
    if ((AdjUp == 0) && ((WholeStep & 0x01) == 0)) {
      InitialPixelCount--;
    }
    /* If there are an odd number of pixels per run, we have one pixel
       that can't be allocated to either the initial or last partial
       run, so we'll add 0.5 to the error term so this pixel will be
       handled by the normal full-run loop */
    if ((WholeStep & 0x01) != 0) {
      ErrorTerm += XDelta;
    }
    /* Draw the first, partial run of pixels */
    DrawVerticalRun(addressof(ScreenPtr), XAdvance, InitialPixelCount, Color, ScreenWidth);

    /* Draw all full runs */
    for (i = 0; i < (XDelta - 1); i++) {
      RunLength = WholeStep; /* run is at least this long */
      /* Advance the error term and add an extra pixel if the error
         term so indicates */
      if ((ErrorTerm += AdjUp) > 0) {
        RunLength++;
        ErrorTerm -= AdjDown; /* reset the error term */
      }
      /* Draw this scan line's run */
      DrawVerticalRun(addressof(ScreenPtr), XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    DrawVerticalRun(addressof(ScreenPtr), XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  }
}

// Draws a pixel in the specified color
function PixelDraw(fClip: BOOLEAN, xp: INT32, yp: INT32, sColor: INT16, pScreen: Pointer<INT8>): void {
  let col2: INT8 = sColor >> 8;
  let col1: INT8 = sColor & 0x00ff;

  if (fClip) {
    if (!ClipPoint(xp, yp))
      return;
  }

  // point to the bitmap address first pixel to draw
  pScreen += yp * giImageWidth + xp * 2;

  pScreen[0] = col1;
  pScreen[1] = col2;
}

/* Draws a horizontal run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawHorizontalRun(ScreenPtr: Pointer<Pointer<char>>, XAdvance: int, RunLength: int, Color: int, ScreenWidth: int): void {
  let i: int;
  let WorkingScreenPtr: Pointer<char> = ScreenPtr.value;
  let col2: char = Color >> 8;
  let col1: char = Color & 0x00FF;

  for (i = 0; i < RunLength; i++) {
    WorkingScreenPtr[0] = col1;
    WorkingScreenPtr[1] = col2;
    WorkingScreenPtr += XAdvance * 2;
  }
  /* Advance to the next scan line */
  WorkingScreenPtr += giImageWidth;
  ScreenPtr.value = WorkingScreenPtr;
}

/* Draws a vertical run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawVerticalRun(ScreenPtr: Pointer<Pointer<char>>, XAdvance: int, RunLength: int, Color: int, ScreenWidth: int): void {
  let i: int;
  let WorkingScreenPtr: Pointer<char> = ScreenPtr.value;
  let col2: char = Color >> 8;
  let col1: char = Color & 0x00FF;

  for (i = 0; i < RunLength; i++) {
    WorkingScreenPtr[0] = col1;
    WorkingScreenPtr[1] = col2;
    WorkingScreenPtr += giImageWidth;
  }
  /* Advance to the next column */
  WorkingScreenPtr += XAdvance * 2;
  ScreenPtr.value = WorkingScreenPtr;
}

/* Draws a rectangle between the specified endpoints in color Color. */
function RectangleDraw(fClip: BOOL, XStart: int, YStart: int, XEnd: int, YEnd: int, Color: short, ScreenPtr: Pointer<char>): void {
  LineDraw(fClip, XStart, YStart, XEnd, YStart, Color, ScreenPtr);
  LineDraw(fClip, XStart, YEnd, XEnd, YEnd, Color, ScreenPtr);
  LineDraw(fClip, XStart, YStart, XStart, YEnd, Color, ScreenPtr);
  LineDraw(fClip, XEnd, YStart, XEnd, YEnd, Color, ScreenPtr);
}

/***********************************************************************************
 * 8-Bit Versions
 *
 *
 *
 * Added by Derek Beland
 ***********************************************************************************/

/* Draws a rectangle between the specified endpoints in color Color. */
function RectangleDraw8(fClip: BOOL, XStart: int, YStart: int, XEnd: int, YEnd: int, Color: short, ScreenPtr: Pointer<char>): void {
  LineDraw8(fClip, XStart, YStart, XEnd, YStart, Color, ScreenPtr);
  LineDraw8(fClip, XStart, YEnd, XEnd, YEnd, Color, ScreenPtr);
  LineDraw8(fClip, XStart, YStart, XStart, YEnd, Color, ScreenPtr);
  LineDraw8(fClip, XEnd, YStart, XEnd, YEnd, Color, ScreenPtr);
}

/* Draws a line between the specified endpoints in color Color. */
function LineDraw8(fClip: BOOL, XStart: int, YStart: int, XEnd: int, YEnd: int, Color: short, ScreenPtr: Pointer<char>): void {
  let Temp: int;
  let AdjUp: int;
  let AdjDown: int;
  let ErrorTerm: int;
  let XAdvance: int;
  let XDelta: int;
  let YDelta: int;
  let WholeStep: int;
  let InitialPixelCount: int;
  let FinalPixelCount: int;
  let i: int;
  let RunLength: int;
  let ScreenWidth: int = giImageWidth;
  let col2: char = Color >> 8;
  let col1: char = Color & 0x00FF;

  if (fClip) {
    if (!Clip2D(addressof(XStart), addressof(YStart), addressof(XEnd), addressof(YEnd)))
      return;
  }

  /*	We'll always draw top to bottom, to reduce the number of cases we have to
          handle, and to make lines between the same endpoints draw the same pixels */
  if (YStart > YEnd) {
    Temp = YStart;
    YStart = YEnd;
    YEnd = Temp;
    Temp = XStart;
    XStart = XEnd;
    XEnd = Temp;
  }

  // point to the bitmap address first pixel to draw
  ScreenPtr = ScreenPtr + YStart * giImageWidth + XStart;

  /*	Figure out whether we're going left or right, and how far we're
          going horizontally */
  if ((XDelta = XEnd - XStart) < 0) {
    XAdvance = -1;
    XDelta = -XDelta;
  } else {
    XAdvance = 1;
  }
  /* Figure out how far we're going vertically */
  YDelta = YEnd - YStart;

  /* Special-case horizontal, vertical, and diagonal lines, for speed
  and to avoid nasty boundary conditions and division by 0 */
  if (XDelta == 0) {
    /* Vertical line */
    for (i = 0; i <= YDelta; i++) {
      ScreenPtr.value = col1;
      ScreenPtr += giImageWidth;
    }
    return;
  }
  if (YDelta == 0) {
    /* Horizontal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr.value = col1;
      ScreenPtr += XAdvance;
    }
    return;
  }
  if (XDelta == YDelta) {
    /* Diagonal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr.value = col1;
      ScreenPtr += (XAdvance + giImageWidth);
    }
    return;
  }

  /* Determine whether the line is X or Y major, and handle accordingly */
  if (XDelta >= YDelta) {
    /* X major line */
    /* Minimum # of pixels in a run in this line */
    WholeStep = XDelta / YDelta;

    /* Error term adjust each time Y steps by 1; used to tell when one
       extra pixel should be drawn as part of a run, to account for
       fractional steps along the X axis per 1-pixel steps along Y */
    AdjUp = (XDelta % YDelta) * 2;

    /* Error term adjust when the error term turns over, used to factor
       out the X step made at that time */
    AdjDown = YDelta * 2;

    /* Initial error term; reflects an initial step of 0.5 along the Y
       axis */
    ErrorTerm = (XDelta % YDelta) - (YDelta * 2);

    /* The initial and last runs are partial, because Y advances only 0.5
       for these runs, rather than 1. Divide one full run, plus the
       initial pixel, between the initial and last runs */
    InitialPixelCount = (WholeStep / 2) + 1;
    FinalPixelCount = InitialPixelCount;

    /* If the basic run length is even and there's no fractional
       advance, we have one pixel that could go to either the initial
       or last partial run, which we'll arbitrarily allocate to the
       last run */
    if ((AdjUp == 0) && ((WholeStep & 0x01) == 0)) {
      InitialPixelCount--;
    }
    /* If there're an odd number of pixels per run, we have 1 pixel that can't
       be allocated to either the initial or last partial run, so we'll add 0.5
       to error term so this pixel will be handled by the normal full-run loop */
    if ((WholeStep & 0x01) != 0) {
      ErrorTerm += YDelta;
    }
    /* Draw the first, partial run of pixels */
    DrawHorizontalRun8(addressof(ScreenPtr), XAdvance, InitialPixelCount, Color, ScreenWidth);
    /* Draw all full runs */
    for (i = 0; i < (YDelta - 1); i++) {
      RunLength = WholeStep; /* run is at least this long */
      /* Advance the error term and add an extra pixel if the error
         term so indicates */
      if ((ErrorTerm += AdjUp) > 0) {
        RunLength++;
        ErrorTerm -= AdjDown; /* reset the error term */
      }
      /* Draw this scan line's run */
      DrawHorizontalRun8(addressof(ScreenPtr), XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    DrawHorizontalRun8(addressof(ScreenPtr), XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  } else {
    /* Y major line */

    /* Minimum # of pixels in a run in this line */
    WholeStep = YDelta / XDelta;

    /* Error term adjust each time X steps by 1; used to tell when 1 extra
       pixel should be drawn as part of a run, to account for
       fractional steps along the Y axis per 1-pixel steps along X */
    AdjUp = (YDelta % XDelta) * 2;

    /* Error term adjust when the error term turns over, used to factor
       out the Y step made at that time */
    AdjDown = XDelta * 2;

    /* Initial error term; reflects initial step of 0.5 along the X axis */
    ErrorTerm = (YDelta % XDelta) - (XDelta * 2);

    /* The initial and last runs are partial, because X advances only 0.5
       for these runs, rather than 1. Divide one full run, plus the
       initial pixel, between the initial and last runs */
    InitialPixelCount = (WholeStep / 2) + 1;
    FinalPixelCount = InitialPixelCount;

    /* If the basic run length is even and there's no fractional advance, we
       have 1 pixel that could go to either the initial or last partial run,
       which we'll arbitrarily allocate to the last run */
    if ((AdjUp == 0) && ((WholeStep & 0x01) == 0)) {
      InitialPixelCount--;
    }
    /* If there are an odd number of pixels per run, we have one pixel
       that can't be allocated to either the initial or last partial
       run, so we'll add 0.5 to the error term so this pixel will be
       handled by the normal full-run loop */
    if ((WholeStep & 0x01) != 0) {
      ErrorTerm += XDelta;
    }
    /* Draw the first, partial run of pixels */
    DrawVerticalRun8(addressof(ScreenPtr), XAdvance, InitialPixelCount, Color, ScreenWidth);

    /* Draw all full runs */
    for (i = 0; i < (XDelta - 1); i++) {
      RunLength = WholeStep; /* run is at least this long */
      /* Advance the error term and add an extra pixel if the error
         term so indicates */
      if ((ErrorTerm += AdjUp) > 0) {
        RunLength++;
        ErrorTerm -= AdjDown; /* reset the error term */
      }
      /* Draw this scan line's run */
      DrawVerticalRun8(addressof(ScreenPtr), XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    DrawVerticalRun8(addressof(ScreenPtr), XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  }
}

/* Draws a horizontal run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawHorizontalRun8(ScreenPtr: Pointer<Pointer<char>>, XAdvance: int, RunLength: int, Color: int, ScreenWidth: int): void {
  let i: int;
  let WorkingScreenPtr: Pointer<char> = ScreenPtr.value;
  let col2: char = Color >> 8;
  let col1: char = Color & 0x00FF;

  for (i = 0; i < RunLength; i++) {
    WorkingScreenPtr.value = col1;
    WorkingScreenPtr += XAdvance;
  }
  /* Advance to the next scan line */
  WorkingScreenPtr += giImageWidth;
  ScreenPtr.value = WorkingScreenPtr;
}

/* Draws a vertical run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawVerticalRun8(ScreenPtr: Pointer<Pointer<char>>, XAdvance: int, RunLength: int, Color: int, ScreenWidth: int): void {
  let i: int;
  let WorkingScreenPtr: Pointer<char> = ScreenPtr.value;
  let col2: char = Color >> 8;
  let col1: char = Color & 0x00FF;

  for (i = 0; i < RunLength; i++) {
    WorkingScreenPtr.value = col1;
    WorkingScreenPtr += giImageWidth;
  }
  /* Advance to the next column */
  WorkingScreenPtr += XAdvance;
  ScreenPtr.value = WorkingScreenPtr;
}
