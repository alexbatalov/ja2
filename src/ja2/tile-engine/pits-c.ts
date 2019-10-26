// used by editor
export let gfShowPits: boolean = false;

export let gfLoadPitsWithoutArming: boolean = false;

export function Add3X3Pit(iMapIndex: INT32): void {
  let ExitGrid: EXITGRID;
  if (!gfEditMode)
    ApplyMapChangesToMapTempFile(true);
  AddObjectToTail(iMapIndex + 159, Enum312.REGWATERTEXTURE1);
  AddObjectToTail(iMapIndex - 1, Enum312.REGWATERTEXTURE2);
  AddObjectToTail(iMapIndex - 161, Enum312.REGWATERTEXTURE3);
  AddObjectToTail(iMapIndex + 160, Enum312.REGWATERTEXTURE4);
  AddObjectToTail(iMapIndex, Enum312.REGWATERTEXTURE5);
  AddObjectToTail(iMapIndex - 160, Enum312.REGWATERTEXTURE6);
  AddObjectToTail(iMapIndex + 161, Enum312.REGWATERTEXTURE7);
  AddObjectToTail(iMapIndex + 1, Enum312.REGWATERTEXTURE8);
  AddObjectToTail(iMapIndex - 159, Enum312.REGWATERTEXTURE9);
  if (!gfEditMode) {
    // Add the exitgrids associated with the pit.
    ExitGrid.ubGotoSectorX = gWorldSectorX;
    ExitGrid.ubGotoSectorY = gWorldSectorY;
    ExitGrid.ubGotoSectorZ = (gbWorldSectorZ + 1);
    ExitGrid.usGridNo = iMapIndex;
    AddExitGridToWorld(iMapIndex + 159, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 1, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 161, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 160, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 160, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 161, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 1, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 159, addressof(ExitGrid));
    RecompileLocalMovementCostsFromRadius(iMapIndex, 2);
  }

  MarkWorldDirty();
  if (!gfEditMode)
    ApplyMapChangesToMapTempFile(false);
}

export function Add5X5Pit(iMapIndex: INT32): void {
  let ExitGrid: EXITGRID;
  if (!gfEditMode)
    ApplyMapChangesToMapTempFile(true);
  AddObjectToTail(iMapIndex + 318, Enum312.REGWATERTEXTURE10);
  AddObjectToTail(iMapIndex + 158, Enum312.REGWATERTEXTURE11);
  AddObjectToTail(iMapIndex - 2, Enum312.REGWATERTEXTURE12);
  AddObjectToTail(iMapIndex - 162, Enum312.REGWATERTEXTURE13);
  AddObjectToTail(iMapIndex - 322, Enum312.REGWATERTEXTURE14);
  AddObjectToTail(iMapIndex + 319, Enum312.REGWATERTEXTURE15);
  AddObjectToTail(iMapIndex + 159, Enum312.REGWATERTEXTURE16);
  AddObjectToTail(iMapIndex - 1, Enum312.REGWATERTEXTURE17);
  AddObjectToTail(iMapIndex - 161, Enum312.REGWATERTEXTURE18);
  AddObjectToTail(iMapIndex - 321, Enum312.REGWATERTEXTURE19);
  AddObjectToTail(iMapIndex + 320, Enum312.REGWATERTEXTURE20);
  AddObjectToTail(iMapIndex + 160, Enum312.REGWATERTEXTURE21);
  AddObjectToTail(iMapIndex, Enum312.REGWATERTEXTURE22);
  AddObjectToTail(iMapIndex - 160, Enum312.REGWATERTEXTURE23);
  AddObjectToTail(iMapIndex - 320, Enum312.REGWATERTEXTURE24);
  AddObjectToTail(iMapIndex + 321, Enum312.REGWATERTEXTURE25);
  AddObjectToTail(iMapIndex + 161, Enum312.REGWATERTEXTURE26);
  AddObjectToTail(iMapIndex + 1, Enum312.REGWATERTEXTURE27);
  AddObjectToTail(iMapIndex - 159, Enum312.REGWATERTEXTURE28);
  AddObjectToTail(iMapIndex - 319, Enum312.REGWATERTEXTURE29);
  AddObjectToTail(iMapIndex + 322, Enum312.REGWATERTEXTURE30);
  AddObjectToTail(iMapIndex + 162, Enum312.REGWATERTEXTURE31);
  AddObjectToTail(iMapIndex + 2, Enum312.REGWATERTEXTURE32);
  AddObjectToTail(iMapIndex - 158, Enum312.REGWATERTEXTURE33);
  AddObjectToTail(iMapIndex - 318, Enum312.REGWATERTEXTURE34);
  if (!gfEditMode) {
    // Add the exitgrids associated with the pit.
    ExitGrid.ubGotoSectorX = gWorldSectorX;
    ExitGrid.ubGotoSectorY = gWorldSectorY;
    ExitGrid.ubGotoSectorZ = (gbWorldSectorZ + 1);
    ExitGrid.usGridNo = iMapIndex;
    AddExitGridToWorld(iMapIndex + 318, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 158, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 2, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 162, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 322, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 319, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 159, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 1, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 161, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 321, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 320, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 160, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 160, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 320, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 321, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 161, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 1, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 159, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 319, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 322, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 162, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex + 2, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 158, addressof(ExitGrid));
    AddExitGridToWorld(iMapIndex - 318, addressof(ExitGrid));
    RecompileLocalMovementCostsFromRadius(iMapIndex, 3);
  }
  MarkWorldDirty();
  if (!gfEditMode)
    ApplyMapChangesToMapTempFile(false);
}

export function Remove3X3Pit(iMapIndex: INT32): void {
  RemoveAllObjectsOfTypeRange(iMapIndex + 159, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 1, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 161, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 160, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 160, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 161, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 1, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 159, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  MarkWorldDirty();
}

export function Remove5X5Pit(iMapIndex: INT32): void {
  RemoveAllObjectsOfTypeRange(iMapIndex + 318, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 158, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 2, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 162, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 322, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 319, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 159, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 1, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 161, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 321, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 320, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 160, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 160, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 320, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 321, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 161, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 1, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 159, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 319, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 322, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 162, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex + 2, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 158, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  RemoveAllObjectsOfTypeRange(iMapIndex - 318, Enum313.REGWATERTEXTURE, Enum313.REGWATERTEXTURE);
  MarkWorldDirty();
}

export function AddAllPits(): void {
  let i: UINT32;
  for (i = 0; i < guiNumWorldItems; i++) {
    if (gWorldItems[i].o.usItem == Enum225.ACTION_ITEM) {
      if (gWorldItems[i].o.bActionValue == Enum191.ACTION_ITEM_SMALL_PIT)
        Add3X3Pit(gWorldItems[i].sGridNo);
      else if (gWorldItems[i].o.bActionValue == Enum191.ACTION_ITEM_LARGE_PIT)
        Add5X5Pit(gWorldItems[i].sGridNo);
    }
  }
}

export function RemoveAllPits(): void {
  let i: UINT32;
  for (i = 0; i < guiNumWorldItems; i++) {
    if (gWorldItems[i].o.usItem == Enum225.ACTION_ITEM) {
      if (gWorldItems[i].o.bActionValue == Enum191.ACTION_ITEM_SMALL_PIT)
        Remove3X3Pit(gWorldItems[i].sGridNo);
      else if (gWorldItems[i].o.bActionValue == Enum191.ACTION_ITEM_LARGE_PIT)
        Remove5X5Pit(gWorldItems[i].sGridNo);
    }
  }
}

export function SearchForOtherMembersWithinPitRadiusAndMakeThemFall(sGridNo: INT16, sRadius: INT16): void {
  let x: INT16;
  let y: INT16;
  let sNewGridNo: INT16;
  let ubID: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  PlayJA2Sample(Enum330.CAVE_COLLAPSE, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
  for (y = -sRadius; y <= sRadius; y++)
    for (x = -sRadius; x <= sRadius; x++) {
      sNewGridNo = sGridNo + y * WORLD_COLS + x;
      // Validate gridno location, and check if there are any mercs here.  If there are
      // any mercs, we want them to fall below.  The exitgrid already exists at this location
      if (GridNoOnVisibleWorldTile(sNewGridNo)) {
        // Check if buddy exists here.....
        ubID = WhoIsThere2(sNewGridNo, 0);

        if (ubID != NOBODY) {
          // OK, make guy fall...
          // Set data to look for exit grid....
          pSoldier = MercPtrs[ubID];

          pSoldier.value.uiPendingActionData4 = sNewGridNo;

          EVENT_InitNewSoldierAnim(pSoldier, Enum193.FALL_INTO_PIT, 0, false);
        }
      }
    }
}

export function HandleFallIntoPitFromAnimation(ubID: UINT8): void {
  let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[ubID];
  let ExitGrid: EXITGRID;
  let sPitGridNo: INT16;
  // OK, get exit grid...

  sPitGridNo = pSoldier.value.uiPendingActionData4;

  GetExitGrid(sPitGridNo, addressof(ExitGrid));

  // Given exit grid, make buddy move to next sector....
  pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
  pSoldier.value.usStrategicInsertionData = ExitGrid.usGridNo;

  pSoldier.value.sSectorX = ExitGrid.ubGotoSectorX;
  pSoldier.value.sSectorY = ExitGrid.ubGotoSectorY;
  pSoldier.value.bSectorZ = ExitGrid.ubGotoSectorZ;

  // Remove from world......
  RemoveSoldierFromTacticalSector(pSoldier, true);

  HandleSoldierLeavingSectorByThemSelf(pSoldier);

  SetSoldierHeight(pSoldier, 0);
}
