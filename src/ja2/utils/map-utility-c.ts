const MINIMAP_X_SIZE = 88;
const MINIMAP_Y_SIZE = 44;

const WINDOW_SIZE = 2;

let gdXStep: FLOAT;
let gdYStep: FLOAT;
let giMiniMap: INT32;
let gi8BitMiniMap: INT32;
let ghvSurface: HVSURFACE;

// Utililty file for sub-sampling/creating our radar screen maps
// Loops though our maps directory and reads all .map files, subsamples an area, color
// quantizes it into an 8-bit image ans writes it to an sti file in radarmaps.

interface RGBValues {
  r: INT8;
  g: INT8;
  b: INT8;
}

function MapUtilScreenInit(): UINT32 {
  return TRUE;
}

function MapUtilScreenHandle(): UINT32 {
  /* static */ let fNewMap: INT16 = TRUE;
  /* static */ let sFileNum: INT16 = 0;
  let InputEvent: InputAtom;
  let FileInfo: GETFILESTRUCT;
  /* static */ let FListNode: Pointer<FDLG_LIST>;
  /* static */ let sFiles: INT16 = 0;
  /* static */ let sCurFile: INT16 = 0;
  /* static */ let FileList: Pointer<FDLG_LIST> = NULL;
  let zFilename: INT8[] /* [260] */;
  let zFilename2: INT8[] /* [260] */;
  let vs_desc: VSURFACE_DESC;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let ubBitDepth: UINT8;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let pSrcBuf: Pointer<UINT16>;
  let pDataPtr: Pointer<UINT8>;

  /* static */ let p24BitDest: Pointer<UINT8> = NULL;
  /* static */ let p24BitValues: Pointer<RGBValues> = NULL;

  let uiRGBColor: UINT32;

  let bR: UINT32;
  let bG: UINT32;
  let bB: UINT32;
  let bAvR: UINT32;
  let bAvG: UINT32;
  let bAvB: UINT32;
  let s16BPPSrc: INT16;
  let sDest16BPPColor: INT16;
  let cnt: INT32;

  let sX1: INT16;
  let sX2: INT16;
  let sY1: INT16;
  let sY2: INT16;
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;

  let dX: FLOAT;
  let dY: FLOAT;
  let dStartX: FLOAT;
  let dStartY: FLOAT;
  let iX: INT32;
  let iY: INT32;
  let iSubX1: INT32;
  let iSubY1: INT32;
  let iSubX2: INT32;
  let iSubY2: INT32;
  let iWindowX: INT32;
  let iWindowY: INT32;
  let iCount: INT32;
  let pPalette: SGPPaletteEntry[] /* [256] */;

  sDest16BPPColor = -1;
  bAvR = bAvG = bAvB = 0;

  // Zero out area!
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, (640), (480), Get16BPPColor(FROMRGB(0, 0, 0)));

  if (fNewMap) {
    fNewMap = FALSE;

    // Create render buffer
    GetCurrentVideoSettings(addressof(usWidth), addressof(usHeight), addressof(ubBitDepth));
    vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.usWidth = 88;
    vs_desc.usHeight = 44;
    vs_desc.ubBitDepth = ubBitDepth;

    if (AddVideoSurface(addressof(vs_desc), addressof(giMiniMap)) == FALSE) {
      return Enum26.ERROR_SCREEN;
    }

    // USING BRET's STUFF FOR LOOPING FILES/CREATING LIST, hence AddToFDlgList.....
    if (GetFileFirst("MAPS\\*.dat", addressof(FileInfo))) {
      FileList = AddToFDlgList(FileList, addressof(FileInfo));
      sFiles++;
      while (GetFileNext(addressof(FileInfo))) {
        FileList = AddToFDlgList(FileList, addressof(FileInfo));
        sFiles++;
      }
      GetFileClose(addressof(FileInfo));
    }

    FListNode = FileList;

    // Allocate 24 bit Surface
    p24BitValues = MemAlloc(MINIMAP_X_SIZE * MINIMAP_Y_SIZE * sizeof(RGBValues));
    p24BitDest = p24BitValues;

    // Allocate 8-bit surface
    vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.usWidth = 88;
    vs_desc.usHeight = 44;
    vs_desc.ubBitDepth = 8;

    if (AddVideoSurface(addressof(vs_desc), addressof(gi8BitMiniMap)) == FALSE) {
      return Enum26.ERROR_SCREEN;
    }
    GetVideoSurface(addressof(ghvSurface), gi8BitMiniMap);
  }

  // OK, we are here, now loop through files
  if (sCurFile == sFiles || FListNode == NULL) {
    gfProgramIsRunning = FALSE;
    return Enum26.MAPUTILITY_SCREEN;
  }

  sprintf(zFilename, "%s", FListNode.value.FileInfo.zFileName);

  // OK, load maps and do overhead shrinkage of them...
  if (!LoadWorld(zFilename)) {
    return Enum26.ERROR_SCREEN;
  }

  // Render small map
  InitNewOverheadDB(giCurrentTilesetID);

  gfOverheadMapDirty = TRUE;

  RenderOverheadMap(0, (WORLD_COLS / 2), 0, 0, 640, 320, TRUE);

  TrashOverheadMap();

  // OK, NOW PROCESS OVERHEAD MAP ( SHOUIDL BE ON THE FRAMEBUFFER )
  gdXStep = 640 / 88;
  gdYStep = 320 / 44;
  dStartX = dStartY = 0;

  // Adjust if we are using a restricted map...
  if (gMapInformation.ubRestrictedScrollID != 0) {
    CalculateRestrictedMapCoords(Enum245.NORTH, addressof(sX1), addressof(sY1), addressof(sX2), addressof(sTop), 640, 320);
    CalculateRestrictedMapCoords(Enum245.SOUTH, addressof(sX1), addressof(sBottom), addressof(sX2), addressof(sY2), 640, 320);
    CalculateRestrictedMapCoords(Enum245.WEST, addressof(sX1), addressof(sY1), addressof(sLeft), addressof(sY2), 640, 320);
    CalculateRestrictedMapCoords(Enum245.EAST, addressof(sRight), addressof(sY1), addressof(sX2), addressof(sY2), 640, 320);

    gdXStep = (sRight - sLeft) / 88;
    gdYStep = (sBottom - sTop) / 44;

    dStartX = sLeft;
    dStartY = sTop;
  }

  // LOCK BUFFERS

  dX = dStartX;
  dY = dStartY;

  pDestBuf = LockVideoSurface(giMiniMap, addressof(uiDestPitchBYTES));
  pSrcBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiSrcPitchBYTES));

  for (iX = 0; iX < 88; iX++) {
    dY = dStartY;

    for (iY = 0; iY < 44; iY++) {
      // OK, AVERAGE PIXELS
      iSubX1 = dX - WINDOW_SIZE;

      iSubX2 = dX + WINDOW_SIZE;

      iSubY1 = dY - WINDOW_SIZE;

      iSubY2 = dY + WINDOW_SIZE;

      iCount = 0;
      bR = bG = bB = 0;

      for (iWindowX = iSubX1; iWindowX < iSubX2; iWindowX++) {
        for (iWindowY = iSubY1; iWindowY < iSubY2; iWindowY++) {
          if (iWindowX >= 0 && iWindowX < 640 && iWindowY >= 0 && iWindowY < 320) {
            s16BPPSrc = pSrcBuf[(iWindowY * (uiSrcPitchBYTES / 2)) + iWindowX];

            uiRGBColor = GetRGBColor(s16BPPSrc);

            bR += SGPGetRValue(uiRGBColor);
            bG += SGPGetGValue(uiRGBColor);
            bB += SGPGetBValue(uiRGBColor);

            // Average!
            iCount++;
          }
        }
      }

      if (iCount > 0) {
        bAvR = bR / iCount;
        bAvG = bG / iCount;
        bAvB = bB / iCount;

        sDest16BPPColor = Get16BPPColor(FROMRGB(bAvR, bAvG, bAvB));
      }

      // Write into dest!
      pDestBuf[(iY * (uiDestPitchBYTES / 2)) + iX] = sDest16BPPColor;

      p24BitValues[(iY * (uiDestPitchBYTES / 2)) + iX].r = bAvR;
      p24BitValues[(iY * (uiDestPitchBYTES / 2)) + iX].g = bAvG;
      p24BitValues[(iY * (uiDestPitchBYTES / 2)) + iX].b = bAvB;

      // Increment
      dY += gdYStep;
    }

    // Increment
    dX += gdXStep;
  }

  UnLockVideoSurface(giMiniMap);
  UnLockVideoSurface(FRAME_BUFFER);

  // RENDER!
  BltVideoSurface(FRAME_BUFFER, giMiniMap, 0, 20, 360, VS_BLT_FAST | VS_BLT_USECOLORKEY, NULL);

  // QUantize!
  pDataPtr = LockVideoSurface(gi8BitMiniMap, addressof(uiSrcPitchBYTES));
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  QuantizeImage(pDataPtr, p24BitDest, MINIMAP_X_SIZE, MINIMAP_Y_SIZE, pPalette);
  SetVideoSurfacePalette(ghvSurface, pPalette);
  // Blit!
  Blt8BPPDataTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, ghvSurface, pDataPtr, 300, 360);

  // Write palette!
  {
    let cnt: INT32;
    let sX: INT32 = 0;
    let sY: INT32 = 420;
    let usLineColor: UINT16;

    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    for (cnt = 0; cnt < 256; cnt++) {
      usLineColor = Get16BPPColor(FROMRGB(pPalette[cnt].peRed, pPalette[cnt].peGreen, pPalette[cnt].peBlue));
      RectangleDraw(TRUE, sX, sY, sX, (sY + 10), usLineColor, pDestBuf);
      sX++;
      RectangleDraw(TRUE, sX, sY, sX, (sY + 10), usLineColor, pDestBuf);
      sX++;
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);

  // Remove extension
  for (cnt = strlen(zFilename) - 1; cnt >= 0; cnt--) {
    if (zFilename[cnt] == '.') {
      zFilename[cnt] = '\0';
    }
  }

  sprintf(zFilename2, "RADARMAPS\\%s.STI", zFilename);
  WriteSTIFile(pDataPtr, pPalette, MINIMAP_X_SIZE, MINIMAP_Y_SIZE, zFilename2, CONVERT_ETRLE_COMPRESS, 0);

  UnLockVideoSurface(gi8BitMiniMap);

  SetFont(TINYFONT1);
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_DKGRAY);
  mprintf(10, 340, "Writing radar image %S", zFilename2);

  mprintf(10, 350, "Using tileset %s", gTilesets[giCurrentTilesetID].zName);

  InvalidateScreen();

  while (DequeueEvent(addressof(InputEvent)) == TRUE) {
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ESC)) {
      // Exit the program
      gfProgramIsRunning = FALSE;
    }
  }

  // Set next
  FListNode = FListNode.value.pNext;
  sCurFile++;

  return Enum26.MAPUTILITY_SCREEN;
}

function MapUtilScreenShutdown(): UINT32 {
  return TRUE;
}
