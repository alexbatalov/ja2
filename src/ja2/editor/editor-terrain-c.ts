namespace ja2 {

export let gfShowTerrainTileButtons: boolean;
let ubTerrainTileButtonWeight: UINT8[] /* [NUM_TERRAIN_TILE_REGIONS] */;
let usTotalWeight: UINT16;
let fPrevShowTerrainTileButtons: boolean = true;
export let fUseTerrainWeights: boolean = false;
let TerrainTileSelected: INT32 = 0;
let TerrainForegroundTile: INT32;
export let TerrainBackgroundTile: INT32;
export let TerrainTileDrawMode: INT32 = TERRAIN_TILES_NODRAW;

export function EntryInitEditorTerrainInfo(): void {
  // ResetTerrainTileWeights();
  if (!fUseTerrainWeights) {
    ResetTerrainTileWeights();
  }
}

export function ResetTerrainTileWeights(): void {
  let x: INT8;
  for (x = 0; x < NUM_TERRAIN_TILE_REGIONS; x++) {
    ubTerrainTileButtonWeight[x] = 0;
  }
  usTotalWeight = 0;
  fUseTerrainWeights = false;
  gfRenderTaskbar = true;
}

export function HideTerrainTileButtons(): void {
  let x: INT8;
  if (gfShowTerrainTileButtons) {
    for (x = Enum45.BASE_TERRAIN_TILE_REGION_ID; x < NUM_TERRAIN_TILE_REGIONS; x++) {
      DisableEditorRegion(x);
    }
    gfShowTerrainTileButtons = false;
  }
}

export function ShowTerrainTileButtons(): void {
  let x: INT8;
  if (!gfShowTerrainTileButtons) {
    for (x = Enum45.BASE_TERRAIN_TILE_REGION_ID; x < NUM_TERRAIN_TILE_REGIONS; x++) {
      EnableEditorRegion(x);
    }
    gfShowTerrainTileButtons = true;
  }
}

export function RenderTerrainTileButtons(): void {
  // If needed, display the ground tile images
  if (gfShowTerrainTileButtons) {
    let usFillColorDark: UINT16;
    let usFillColorLight: UINT16;
    let usFillColorRed: UINT16;
    let x: UINT16;
    let usX: UINT16;
    let usX2: UINT16;
    let usY: UINT16;
    let usY2: UINT16;

    usFillColorDark = Get16BPPColor(FROMRGB(24, 61, 81));
    usFillColorLight = Get16BPPColor(FROMRGB(136, 138, 135));
    usFillColorRed = Get16BPPColor(FROMRGB(255, 0, 0));

    usY = 369;
    usY2 = 391;

    SetFont(SMALLCOMPFONT());
    SetFontForeground(FONT_YELLOW);

    for (x = 0; x < NUM_TERRAIN_TILE_REGIONS; x++) {
      usX = 261 + (x * 42);
      usX2 = usX + 42;

      if (x == CurrentPaste && !fUseTerrainWeights) {
        ColorFillVideoSurfaceArea(ButtonDestBuffer, usX, usY, usX2, usY2, usFillColorRed);
      } else {
        ColorFillVideoSurfaceArea(ButtonDestBuffer, usX, usY, usX2, usY2, usFillColorDark);
        ColorFillVideoSurfaceArea(ButtonDestBuffer, usX + 1, usY + 1, usX2, usY2, usFillColorLight);
      }
      ColorFillVideoSurfaceArea(ButtonDestBuffer, usX + 1, usY + 1, usX2 - 1, usY2 - 1, 0);

      SetObjectShade(gTileDatabase[gTileTypeStartIndex[x]].hTileSurface, DEFAULT_SHADE_LEVEL);
      BltVideoObject(ButtonDestBuffer, gTileDatabase[gTileTypeStartIndex[x]].hTileSurface, 0, (usX + 1), (usY + 1), VO_BLT_SRCTRANSPARENCY, null);

      if (fUseTerrainWeights) {
        mprintf(usX + 2, usY + 2, "%d", ubTerrainTileButtonWeight[x]);
      }
    }
  }
}

// This callback is used for each of the terrain tile buttons.  The userData[0] field
// contains the terrain button's index value.
export function TerrainTileButtonRegionCallback(reg: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = true;
    TerrainTileSelected = MSYS_GetRegionUserData(reg, 0);
    if (TerrainTileDrawMode == TERRAIN_TILES_FOREGROUND) {
      TerrainForegroundTile = TerrainTileSelected;
      CurrentPaste = TerrainForegroundTile;
      // iEditorToolbarState = TBAR_MODE_DRAW;
      if (_KeyDown(SHIFT)) {
        fUseTerrainWeights = true;
      }
      if (fUseTerrainWeights) {
        // SHIFT+LEFTCLICK adds weight to the selected terrain tile.
        if (ubTerrainTileButtonWeight[TerrainTileSelected] < 10) {
          ubTerrainTileButtonWeight[TerrainTileSelected]++;
          usTotalWeight++;
        }
      } else {
        // Regular LEFTCLICK selects only that terrain tile.
        // When total weight is 0, then the only selected tile is drawn.
        ResetTerrainTileWeights();
      }
    } else if (TerrainTileDrawMode == TERRAIN_TILES_BACKGROUND) {
      TerrainBackgroundTile = TerrainTileSelected;
      iEditorToolbarState = Enum35.TBAR_MODE_SET_BGRND;
    }
  }
  if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    gfRenderTaskbar = true;
    TerrainTileSelected = MSYS_GetRegionUserData(reg, 0);
    if (TerrainTileDrawMode == TERRAIN_TILES_FOREGROUND) {
      TerrainForegroundTile = TerrainTileSelected;
      iEditorToolbarState = Enum35.TBAR_MODE_DRAW;
      if (ubTerrainTileButtonWeight[TerrainTileSelected]) {
        ubTerrainTileButtonWeight[TerrainTileSelected]--;
        usTotalWeight--;
      }
    }
  }
}

export function ChooseWeightedTerrainTile(): void {
  let x: UINT16;
  let usWeight: UINT16;
  let sRandomNum: INT16;
  if (!usTotalWeight) {
    // Not in the weighted mode.  CurrentPaste will already contain the selected tile.
    return;
  }
  sRandomNum = rand() % usTotalWeight;
  x = NUM_TERRAIN_TILE_REGIONS;
  for (x = 0; x < NUM_TERRAIN_TILE_REGIONS; x++) {
    usWeight = ubTerrainTileButtonWeight[x];
    sRandomNum -= usWeight;
    if (sRandomNum <= 0 && usWeight) {
      CurrentPaste = x;
      return;
    }
  }
}

let guiSearchType: UINT32;
export let count: UINT32;
let maxCount: UINT32 = 0;
let calls: UINT32 = 0;

function Fill(x: INT32, y: INT32): void {
  let iMapIndex: INT32;
  let uiCheckType: UINT32;

  count++;
  calls++;

  if (count > maxCount)
    maxCount = count;

  iMapIndex = y * WORLD_COLS + x;
  if (!GridNoOnVisibleWorldTile(iMapIndex)) {
    count--;
    return;
  }
  uiCheckType = GetTileType(gpWorldLevelData[iMapIndex].pLandHead.value.usIndex);
  if (guiSearchType == uiCheckType)
    PasteTextureCommon(iMapIndex);
  else {
    count--;
    return;
  }

  if (y > 0)
    Fill(x, y - 1);
  if (y < WORLD_ROWS - 1)
    Fill(x, y + 1);
  if (x > 0)
    Fill(x - 1, y);
  if (x < WORLD_COLS - 1)
    Fill(x + 1, y);
  count--;
}

export function TerrainFill(iMapIndex: UINT32): void {
  let sX: INT16;
  let sY: INT16;
  // determine what we should be looking for to replace...
  guiSearchType = GetTileType(gpWorldLevelData[iMapIndex].pLandHead.value.usIndex);

  // check terminating conditions
  if (guiSearchType == CurrentPaste)
    return;

  ConvertGridNoToXY(iMapIndex, addressof(sX), addressof(sY));

  count = 0;

  Fill(sX, sY);
}

}
