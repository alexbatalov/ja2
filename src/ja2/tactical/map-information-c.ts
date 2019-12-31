namespace ja2 {

// Don't mess with this value, unless you want to force update all maps in the game!
// FIXME: Language-specific code
// #ifdef RUSSIAN
// #define MAJOR_MAP_VERSION 6.00
// #else
const MAJOR_MAP_VERSION = 5.00;
// #endif

export let gdMajorMapVersion: FLOAT = MAJOR_MAP_VERSION;

export let gfWorldLoaded: boolean;

export let gMapInformation: MAPCREATE_STRUCT = createMapCreateStruct();

// Current minor map version updater.
const MINOR_MAP_VERSION = 25;
export let gubMinorMapVersion: UINT8 = MINOR_MAP_VERSION;

/*
MINOR_MAP_VERSION Log -- Created by Kris Morness, November 14, 1997
Version 0 -- Kris -- obsolete November 14, 1997
        The newly created soldier information had a couple bugs regarding initialization
  Bug 1)	Soldier placements without detailed slots weren't initialized.
        Bug 2)  The attitude variable was accidentally being generated like attributes
                        which usually put it completely out of range.
Version 1 -- Kris -- obsolete January 7, 1998
        Bug 3)  New changes to the wall decals, made the currently existing ones in the world
                        unpredictable, and are automatically removed, so new ones can be used.
Version 2 -- Kris -- obsolete February 3, 1998
  Bug 4)  Enemy mercs now have a color code assignment which defaults to army.
Version 3 -- Kris -- obsolete February 9, 1998
  Bug 5)  Move entry points down if they are too high.
Version 4 -- Kris -- obsolete February 25, 1998
  Bug 6)  Change all doors to FIRSTDOOR
Version 5 -- Kris -- obsolete March 4, 1998
  Bug 7)  Remove all exit grids (the format has changed)
Version 6 -- Kris -- obsolete March 9, 1998
  Bug 8)  Change droppable status of merc items so that they are all undroppable.
Version 7 -- Kris -- obsolete April 14, 1998
        Bug 9)  Priority placements have been dropped in favor of splitting it into two categories.
                                        The first is Detailed placements, and the second is priority existance.  So, all
                                        current detailed placements will also have priority existance.
Version 8 -- Kris -- obsolete April 16, 1998
        MAJOR CONFLICT RESULTING IN A MAJOR VERSION UPDATE 2.00!
        Bug 10) Padding on detailed placements is uninitialized.  Clear all data starting at
                                        fKillSlotIfOwnerDies.
Version 9 -- Kris -- obsolete April 26, 1998
        This version requires no auto updating, but external code has adjusted the size of the mapedgepoint
        arraysize from UINT8 to UINT16.  See Map Edgepoints.c.
        Bug 11) Convert all wheelchaired placement bodytypes to cows.  Result of change in the animation database.
Version 11 -- Kris -- obsolete May 2, 1998
  Added new center entry point.  Need to initialize the original padding to -1.
*/

// EntryPoints can't be placed on the top two gridnos in a map.  So all we do in this case
// is return the closest gridno.  Returns TRUE if the mapindex changes.
export function ValidateEntryPointGridNo(sGridNo: Pointer<INT16>): boolean {
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sWorldX: INT16;
  let sWorldY: INT16;
  let iNewMapX: INT32;
  let iNewMapY: INT32;
  let sTopLimit: INT16;
  let sBottomLimit: INT16;

  if (sGridNo.value < 0)
    return false; // entry point is non-existant

  ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(sGridNo.value));

  sTopLimit = 80;
  sBottomLimit = gsBRY - gsTLY - 40;

  // Get screen coordinates for current gridno
  ({ sScreenX: sWorldX, sScreenY: sWorldY } = GetWorldXYAbsoluteScreenXY(sXMapPos, sYMapPos));

  if (sWorldY < sTopLimit) {
    ({ uiCellX: iNewMapX, uiCellY: iNewMapY } = GetFromAbsoluteScreenXYWorldXY(sWorldX, sTopLimit));
  } else if (sWorldY > sBottomLimit) {
    ({ uiCellX: iNewMapX, uiCellY: iNewMapY } = GetFromAbsoluteScreenXYWorldXY(sWorldX, sBottomLimit));
  } else {
    return false; // already valid
  }

  sGridNo.value = MAPROWCOLTOPOS(Math.trunc(iNewMapY / 10), Math.trunc(iNewMapX / 10));

  return true; // modified
}

export function SaveMapInformation(fp: HWFILE): void {
  let uiBytesWritten: UINT32;
  let buffer: Buffer;

  gMapInformation.ubMapVersion = MINOR_MAP_VERSION;
  buffer = Buffer.allocUnsafe(MAP_CREATE_STRUCT_SIZE);
  writeMapCreateStruct(gMapInformation, buffer);
  uiBytesWritten = FileWrite(fp, buffer, MAP_CREATE_STRUCT_SIZE);
}

export function LoadMapInformation(buffer: Buffer, offset: number): number {
  offset = readMapCreateStruct(gMapInformation, buffer, offset);
  // FileRead( hfile, &gMapInformation, sizeof( MAPCREATE_STRUCT ), &uiBytesRead);

  // ATE: OK, do some handling here for basement level scroll restrictions
  // Calcuate world scrolling restrictions
  InitRenderParams(gMapInformation.ubRestrictedScrollID);

  return offset;
}

// This will automatically update obsolete map versions to the new ones.  This will even
// work in the game itself, but would require conversion to happen every time.  This is completely
// transparent to the rest of the game, but in the editor, obsolete versions will be updated upon
// loading and won't be permanently updated until the map is saved, regardless of changes.
function UpdateOldVersionMap(): void {
  if (gMapInformation.ubMapVersion < 15) {
    AssertMsg(0, "Map is less than minimum supported version.");
  }
  if (gMapInformation.ubMapVersion < 16) {
    gMapInformation.ubMapVersion = 16;
    gMapInformation.sIsolatedGridNo = -1;
  }
  if (gMapInformation.ubMapVersion < 17) {
    gMapInformation.ubMapVersion = 17;
    // EliminateObjectLayerRedundancy();
  }
  if (gMapInformation.ubMapVersion < 18) {
    // replace useless crowbars with proper ones
    let i: UINT32;
    gMapInformation.ubMapVersion = 18;
    for (i = 0; i < guiNumWorldItems; i++) {
      if (gWorldItems[i].o.usItem == Enum225.JAR_ELIXIR) {
        gWorldItems[i].o.usItem = Enum225.CROWBAR;
      }
    }
  }
  if (gMapInformation.ubMapVersion < 19) {
    // Do nothing, this is used to force regenerate the map edgepoints in map edgepoints.c
    gMapInformation.ubMapVersion = 19;
  }
  if (gMapInformation.ubMapVersion < 20) {
    // validate the map entry points as the world boundaries have changed.
    gMapInformation.ubMapVersion = 20;
    ValidateEntryPointGridNo(createPropertyPointer(gMapInformation, 'sNorthGridNo'));
    ValidateEntryPointGridNo(createPropertyPointer(gMapInformation, 'sEastGridNo'));
    ValidateEntryPointGridNo(createPropertyPointer(gMapInformation, 'sSouthGridNo'));
    ValidateEntryPointGridNo(createPropertyPointer(gMapInformation, 'sWestGridNo'));
    ValidateEntryPointGridNo(createPropertyPointer(gMapInformation, 'sCenterGridNo'));
    ValidateEntryPointGridNo(createPropertyPointer(gMapInformation, 'sIsolatedGridNo'));
  }
  if (gMapInformation.ubMapVersion < 21) {
    let curr: SOLDIERINITNODE | null;
    // override any item slots being locked if there is no item in that slot.
    // Laymen terms:  If any items slots are locked to be empty, make them empty but available
    // for random item generation.
    gMapInformation.ubMapVersion = 21;
    curr = gSoldierInitHead;
    while (curr) {
      if (curr.pDetailedPlacement) {
        let i: INT32;
        for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
          if (!curr.pDetailedPlacement.Inv[i].usItem) {
            if (curr.pDetailedPlacement.Inv[i].fFlags & OBJECT_UNDROPPABLE) {
              if (curr.pDetailedPlacement.Inv[i].fFlags & OBJECT_NO_OVERWRITE) {
                curr.pDetailedPlacement.Inv[i].fFlags &= ~OBJECT_NO_OVERWRITE;
              }
            }
          }
        }
      }
      curr = curr.next;
    }
  }
  if (gMapInformation.ubMapVersion < 22) {
    // Allow map edgepoints to be regenerated as new system has been reenabled.
    gMapInformation.ubMapVersion = 22;
  }
  if (gMapInformation.ubMapVersion < 23) {
    // Allow map edgepoints to be regenerated as new system has been reenabled.
    let curr: SOLDIERINITNODE | null;
    gMapInformation.ubMapVersion = 23;
    if (giCurrentTilesetID == 1) // cave/mine tileset only
    {
     	// convert all civilians to miners which use uniforms and more masculine body types.
      curr = gSoldierInitHead;
      while (curr) {
        if (curr.pBasicPlacement.bTeam == CIV_TEAM && !curr.pDetailedPlacement) {
          curr.pBasicPlacement.ubSoldierClass = Enum262.SOLDIER_CLASS_MINER;
          curr.pBasicPlacement.bBodyType = -1;
        }
        curr = curr.next;
      }
    }
  }
  if (gMapInformation.ubMapVersion < 25) {
    gMapInformation.ubMapVersion = 25;
    if (gfCaves) {
      LightSetBaseLevel(13);
    }
  }
}

function AutoCalculateItemNoOverwriteStatus(): void {
  let curr: SOLDIERINITNODE | null;
  let i: INT32;
  let pItem: OBJECTTYPE;

  // Recalculate the "no overwrite" status flag on all items.  There are two different cases:
  // 1)  If detailed placement has item, the item "no overwrite" flag is set
  // 2)  If detailed placement doesn't have item, but item is set to drop (forced empty slot), the "no overwrite" flag is set.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.pDetailedPlacement) {
      for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
        pItem = curr.pDetailedPlacement.Inv[i];
        if (pItem.usItem != Enum225.NONE) {
          // case 1 (see above)
          pItem.fFlags |= OBJECT_NO_OVERWRITE;
        } else if (!(pItem.fFlags & OBJECT_UNDROPPABLE)) {
          // case 2 (see above)
          pItem.fFlags |= OBJECT_NO_OVERWRITE;
        }
      }
    }
    curr = curr.next;
  }
}

export function ValidateAndUpdateMapVersionIfNecessary(): void {
  // Older versions of mercs may require updating due to past bug fixes, new changes, etc.
  if (gMapInformation.ubMapVersion < MINOR_MAP_VERSION) {
    SetRelativeStartAndEndPercentage(0, 92, 93, "Updating older map version...");
    RenderProgressBar(0, 0);
    UpdateOldVersionMap();
  } else if (gMapInformation.ubMapVersion > MINOR_MAP_VERSION) {
    // we may have a problem...
    AssertMsg(0, "Map version is greater than the current version (old ja2.exe?)");
  }
  AutoCalculateItemNoOverwriteStatus();
}

// This function is used to avoid conflicts between minor version updates and sector summary info.
// By updating the summary info in conjunction with minor version updates, we can avoid these conflicts
// and really prevent major map updates.
export function UpdateSummaryInfo(pSummary: SUMMARYFILE): void {
  if (pSummary.MapInfo.ubMapVersion == MINOR_MAP_VERSION)
    return;
  if (pSummary.MapInfo.ubMapVersion < 9) {
    // See bug 10
    pSummary.ubCivSchedules = 0;
  }
  if (pSummary.MapInfo.ubMapVersion < 12) {
    pSummary.MapInfo.sCenterGridNo = -1;
  }
  if (pSummary.MapInfo.ubMapVersion < 16) {
    pSummary.MapInfo.sIsolatedGridNo = -1;
  }
}

}
