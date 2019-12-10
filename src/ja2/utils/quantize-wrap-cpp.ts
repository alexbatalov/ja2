namespace ja2 {

export interface RGBValues {
  r: UINT8;
  g: UINT8;
  b: UINT8;
}

export function QuantizeImage(pDest: Uint8ClampedArray, pSrc: Uint8ClampedArray, sWidth: INT16, sHeight: INT16, pPalette: SGPPaletteEntry[]): boolean {
  let sNumColors: INT16;

  // FIRST CREATE PALETTE
  let q = new CQuantizer(255, 6);

  q.ProcessImage(pSrc, sWidth, sHeight);

  sNumColors = q.GetColorCount();

  pPalette.forEach(resetSGPPaletteEntry);

  q.GetColorTable(pPalette);

  // THEN MAP IMAGE TO PALETTE
  // OK, MAPIT!
  MapPalette(pDest, pSrc, sWidth, sHeight, sNumColors, pPalette);

  return true;
}

function MapPalette(pDest: Uint8ClampedArray, pSrc: Uint8ClampedArray, sWidth: INT16, sHeight: INT16, sNumColors: INT16, pTable: SGPPaletteEntry[]): void {
  let cX: INT32;
  let cY: INT32;
  let cnt: INT32;
  let bBest: INT32;
  let dLowestDist: FLOAT;
  let dCubeDist: FLOAT;
  let vTableVal: vector_3 = createVector3();
  let vSrcVal: vector_3 = createVector3();
  let vDiffVal: vector_3 = createVector3();

  for (cX = 0; cX < sWidth; cX++) {
    for (cY = 0; cY < sHeight; cY++) {
      // OK, FOR EACH PALETTE ENTRY, FIND CLOSEST
      bBest = 0;
      dLowestDist = 9999999;

      for (cnt = 0; cnt < sNumColors; cnt++) {
        vSrcVal.x = pSrc[((cY * sWidth) + cX * 3)];
        vSrcVal.y = pSrc[((cY * sWidth) + cX * 3) + 1];
        vSrcVal.z = pSrc[((cY * sWidth) + cX * 3) + 2];

        vTableVal.x = pTable[cnt].peRed;
        vTableVal.y = pTable[cnt].peGreen;
        vTableVal.z = pTable[cnt].peBlue;

        // Get Dist
        vDiffVal = VSubtract(vSrcVal, vTableVal);

        // Get mag dist
        dCubeDist = VGetLength(vDiffVal);

        if (dCubeDist < dLowestDist) {
          dLowestDist = dCubeDist;
          bBest = cnt;
        }
      }

      // Now we have the lowest value
      // Set into dest
      pDest[(cY * sWidth) + cX] = bBest;
    }
  }
}

}
