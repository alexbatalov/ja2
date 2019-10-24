// When line of sight reaches a gridno, and there is a light there, it turns it on.
// This is only done in the cave levels.
function RemoveFogFromGridNo(uiGridNo: UINT32): void {
  let i: INT32;
  let x: INT32;
  let y: INT32;
  let uiAdjacentGridNo: UINT32 = 0;
  x = uiGridNo % WORLD_COLS;
  y = uiGridNo / WORLD_COLS;
  for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
    if (LightSprites[i].iX == x && LightSprites[i].iY == y) {
      if (!(LightSprites[i].uiFlags & LIGHT_SPR_ON)) {
        LightSpritePower(i, true);
        LightDraw(LightSprites[i].uiLightType, LightSprites[i].iTemplate, LightSprites[i].iX, LightSprites[i].iY, i);
        MarkWorldDirty();
        return;
      }
    }
  }
}
