namespace ja2 {

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

let giImageWidth: number = 0;
let giClipXMin: number = 0;
let giClipXMax: number = 0;
let giClipYMin: number = 0;
let giClipYMax: number = 0;

export function SetClippingRegionAndImageWidth(iImageWidth: number, iClipStartX: number, iClipStartY: number, iClipWidth: number, iClipHeight: number): void {
  giImageWidth = iImageWidth;
  giClipXMin = iClipStartX;
  giClipXMax = iClipStartX + iClipWidth - 1;
  giClipYMin = iClipStartY;
  giClipYMax = iClipStartY + iClipHeight - 1;
}

function Clipt(denom: FLOAT, num: FLOAT, tE: Pointer<FLOAT>, tL: Pointer<FLOAT>): boolean {
  let t: FLOAT;
  let accept: boolean;

  accept = true;

  if (denom > 0.0) {
    t = num / denom;
    if (t > tL.value)
      accept = false;
    else if (t > tE.value)
      tE.value = t;
  } else if (denom < 0.0) {
    t = num / denom;
    if (t < tE.value)
      accept = false;
    else if (t < tL.value)
      tL.value = t;
  } else if (num > 0)
    accept = false;

  return accept;
}

function ClipPoint(x: number, y: number): boolean {
  return x <= giClipXMax && x >= giClipXMin && y <= giClipYMax && y >= giClipYMin;
}

function Clip2D(ix0: Pointer<number>, iy0: Pointer<number>, ix1: Pointer<number>, iy1: Pointer<number>): boolean {
  let visible: boolean;
  let te: FLOAT = 0;
  let te__Pointer = createPointer(() => te, (v) => te = v);
  let tl: FLOAT = 0;
  let tl__Pointer = createPointer(() => tl, (v) => tl = v);
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
  visible = false;

  if (dx == 0.0 && dy == 0.0 && ClipPoint(ix0.value, iy0.value))
    visible = true;
  else {
    te = 0.0;
    tl = 1.0;
    if (Clipt(dx, giClipXMin - x0, te__Pointer, tl__Pointer)) {
      if (Clipt(-dx, x0 - giClipXMax, te__Pointer, tl__Pointer)) {
        if (Clipt(dy, giClipYMin - y0, te__Pointer, tl__Pointer)) {
          if (Clipt(-dy, y0 - giClipYMax, te__Pointer, tl__Pointer)) {
            visible = true;
            if (tl < 1.0) {
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
export function LineDraw(fClip: boolean, XStart: number, YStart: number, XEnd: number, YEnd: number, Color: number, ScreenPtr: Uint8ClampedArray): void {
  let Temp: number;
  let AdjUp: number;
  let AdjDown: number;
  let ErrorTerm: number;
  let XAdvance: number;
  let XDelta: number;
  let YDelta: number;
  let WholeStep: number;
  let InitialPixelCount: number;
  let FinalPixelCount: number;
  let i: number;
  let RunLength: number;
  let ScreenWidth: number = giImageWidth / 4;
  let rgb = GetRGBColor(Color);
  let r = SGPGetRValue(rgb);
  let g = SGPGetGValue(rgb);
  let b = SGPGetBValue(rgb);
  let offset: number;

  if (fClip) {
    if (!Clip2D(createPointer(() => XStart, (v) => XStart = v), createPointer(() => YStart, (v) => YStart = v), createPointer(() => XEnd, (v) => XEnd = v), createPointer(() => YEnd, (v) => YEnd = v)))
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
  offset = YStart * giImageWidth + XStart * 4;

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
      ScreenPtr[offset] = r;
      ScreenPtr[offset + 1] = g;
      ScreenPtr[offset + 2] = b;
      ScreenPtr[offset + 3] = 0xFF;
      offset += giImageWidth;
    }
    return;
  }
  if (YDelta == 0) {
    /* Horizontal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr[offset] = r;
      ScreenPtr[offset + 1] = g;
      ScreenPtr[offset + 2] = b;
      ScreenPtr[offset + 3] = 0xFF;
      offset += XAdvance * 4;
    }
    return;
  }
  if (XDelta == YDelta) {
    /* Diagonal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr[offset] = r;
      ScreenPtr[offset + 1] = g;
      ScreenPtr[offset + 2] = b;
      ScreenPtr[offset + 3] = 0xFF;
      offset += (XAdvance * 4) + giImageWidth;
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
    offset = DrawHorizontalRun(ScreenPtr, offset, XAdvance, InitialPixelCount, Color, ScreenWidth);
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
      offset = DrawHorizontalRun(ScreenPtr, offset, XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    offset = DrawHorizontalRun(ScreenPtr, offset, XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  } else {
    /* Y major line */

    /* Minimum # of pixels in a run in this line */
    WholeStep = Math.trunc(YDelta / XDelta);

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
    InitialPixelCount = Math.trunc(WholeStep / 2) + 1;
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
    offset = DrawVerticalRun(ScreenPtr, offset, XAdvance, InitialPixelCount, Color, ScreenWidth);

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
      offset = DrawVerticalRun(ScreenPtr, offset, XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    offset = DrawVerticalRun(ScreenPtr, offset, XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  }
}

// Draws a pixel in the specified color
export function PixelDraw(fClip: boolean, xp: INT32, yp: INT32, sColor: INT16, pScreen: Uint8ClampedArray): void {
  let rgb = GetRGBColor(sColor);
  let r = SGPGetRValue(rgb);
  let g = SGPGetGValue(rgb);
  let b = SGPGetBValue(rgb);
  let offset: number;

  if (fClip) {
    if (!ClipPoint(xp, yp))
      return;
  }

  // point to the bitmap address first pixel to draw
  offset = yp * giImageWidth * 4 + xp * 4;

  pScreen[offset] = r;
  pScreen[offset + 1] = g;
  pScreen[offset + 2] = b;
  pScreen[offset + 3] = 0xFF;
}

/* Draws a horizontal run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawHorizontalRun(ScreenPtr: Uint8ClampedArray, offset: number, XAdvance: number, RunLength: number, Color: number, ScreenWidth: number): number {
  let i: number;
  let rgb = GetRGBColor(Color);
  let r = SGPGetRValue(rgb);
  let g = SGPGetGValue(rgb);
  let b = SGPGetBValue(rgb);

  for (i = 0; i < RunLength; i++) {
    ScreenPtr[offset] = r;
    ScreenPtr[offset + 1] = g;
    ScreenPtr[offset + 2] = b;
    ScreenPtr[offset + 3] = 0xFF;
    offset += XAdvance * 4;
  }
  /* Advance to the next scan line */
  return offset;
}

/* Draws a vertical run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawVerticalRun(ScreenPtr: Uint8ClampedArray, offset: number, XAdvance: number, RunLength: number, Color: number, ScreenWidth: number): number {
  let i: number;
  let rgb = GetRGBColor(Color);
  let r = SGPGetRValue(rgb);
  let g = SGPGetGValue(rgb);
  let b = SGPGetBValue(rgb);

  for (i = 0; i < RunLength; i++) {
    ScreenPtr[offset] = r;
    ScreenPtr[offset + 1] = g;
    ScreenPtr[offset + 2] = b;
    ScreenPtr[offset + 3] = 0xFF;
    offset += giImageWidth * 4;
  }
  /* Advance to the next column */
  return offset;
}

/* Draws a rectangle between the specified endpoints in color Color. */
export function RectangleDraw(fClip: boolean, XStart: number, YStart: number, XEnd: number, YEnd: number, Color: number, ScreenPtr: Uint8ClampedArray): void {
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
export function RectangleDraw8(fClip: boolean, XStart: number, YStart: number, XEnd: number, YEnd: number, Color: number, ScreenPtr: Uint8ClampedArray): void {
  LineDraw8(fClip, XStart, YStart, XEnd, YStart, Color, ScreenPtr);
  LineDraw8(fClip, XStart, YEnd, XEnd, YEnd, Color, ScreenPtr);
  LineDraw8(fClip, XStart, YStart, XStart, YEnd, Color, ScreenPtr);
  LineDraw8(fClip, XEnd, YStart, XEnd, YEnd, Color, ScreenPtr);
}

/* Draws a line between the specified endpoints in color Color. */
function LineDraw8(fClip: boolean, XStart: number, YStart: number, XEnd: number, YEnd: number, Color: number, ScreenPtr: Uint8ClampedArray): void {
  let Temp: number;
  let AdjUp: number;
  let AdjDown: number;
  let ErrorTerm: number;
  let XAdvance: number;
  let XDelta: number;
  let YDelta: number;
  let WholeStep: number;
  let InitialPixelCount: number;
  let FinalPixelCount: number;
  let i: number;
  let RunLength: number;
  let ScreenWidth: number = giImageWidth;
  let col2: number = Color >> 8;
  let col1: number = Color & 0x00FF;
  let offset: number;

  if (fClip) {
    if (!Clip2D(createPointer(() => XStart, (v) => XStart = v), createPointer(() => YStart, (v) => YStart = v), createPointer(() => XEnd, (v) => XEnd = v), createPointer(() => YEnd, (v) => YEnd = v)))
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
  offset = YStart * giImageWidth + XStart;

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
      ScreenPtr[offset] = col1;
      offset += giImageWidth;
    }
    return;
  }
  if (YDelta == 0) {
    /* Horizontal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr[offset] = col1;
      offset += XAdvance;
    }
    return;
  }
  if (XDelta == YDelta) {
    /* Diagonal line */
    for (i = 0; i <= XDelta; i++) {
      ScreenPtr[offset] = col1;
      offset += (XAdvance + giImageWidth);
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
    offset = DrawHorizontalRun8(ScreenPtr, offset, XAdvance, InitialPixelCount, Color, ScreenWidth);
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
      offset = DrawHorizontalRun8(ScreenPtr, offset, XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    offset = DrawHorizontalRun8(ScreenPtr, offset, XAdvance, FinalPixelCount, Color, ScreenWidth);
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
    offset = DrawVerticalRun8(ScreenPtr, offset, XAdvance, InitialPixelCount, Color, ScreenWidth);

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
      offset = DrawVerticalRun8(ScreenPtr, offset, XAdvance, RunLength, Color, ScreenWidth);
    }
    /* Draw the final run of pixels */
    offset = DrawVerticalRun8(ScreenPtr, offset, XAdvance, FinalPixelCount, Color, ScreenWidth);
    return;
  }
}

/* Draws a horizontal run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawHorizontalRun8(ScreenPtr: Uint8ClampedArray, offset: number, XAdvance: number, RunLength: number, Color: number, ScreenWidth: number): number {
  let i: number;
  let col2: number = Color >> 8;
  let col1: number = Color & 0x00FF;

  for (i = 0; i < RunLength; i++) {
    ScreenPtr[offset] = col1;
    offset += XAdvance;
  }
  /* Advance to the next scan line */
  return offset;
}

/* Draws a vertical run of pixels, then advances the bitmap pointer to
   the first pixel of the next run. */
function DrawVerticalRun8(ScreenPtr: Uint8ClampedArray, offset: number, XAdvance: number, RunLength: number, Color: number, ScreenWidth: number): number {
  let i: number;
  let col2: number = Color >> 8;
  let col1: number = Color & 0x00FF;

  for (i = 0; i < RunLength; i++) {
    ScreenPtr[offset] = col1;
    offset += giImageWidth;
  }
  /* Advance to the next column */
  return offset;
}

}
