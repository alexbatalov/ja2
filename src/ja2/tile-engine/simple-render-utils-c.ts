function MarkMapIndexDirty(iMapIndex: INT32): void {
  gpWorldLevelData[iMapIndex].uiFlags |= MAPELEMENT_REDRAW;
  SetRenderFlags(RENDER_FLAG_MARKED);
}

function CenterScreenAtMapIndex(iMapIndex: INT32): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sCellX: INT16;
  let sCellY: INT16;

  // Get X, Y world GRID Coordinates
  sWorldY = (iMapIndex / WORLD_COLS);
  sWorldX = iMapIndex - (sWorldY * WORLD_COLS);

  // Convert into cell coords
  sCellY = sWorldY * CELL_Y_SIZE;
  sCellX = sWorldX * CELL_X_SIZE;

  // Set the render values, so that the screen will render here next frame.
  gsRenderCenterX = sCellX;
  gsRenderCenterY = sCellY;

  SetRenderFlags(RENDER_FLAG_FULL);
}

function MarkWorldDirty(): void {
  SetRenderFlags(RENDER_FLAG_FULL);
}
