namespace ja2 {

export let gfWarning: UINT8 /* boolean */ = 0;

let gfDoFill: boolean = false;
export let CurrentPaste: UINT16 = NO_TILE;
let gDebrisPaste: UINT16 = NO_TILE;
let CurrentStruct: UINT16 = NO_TILE;
let gDoBanks: UINT32 = NO_BANKS;
let gDoCliffs: UINT32 = NO_CLIFFS;

//---------------------------------------------------------------------------------------------------------------
//	QuickEraseMapTile
//
//	Performs ersing operation when the DEL key is hit in the editor
//
export function QuickEraseMapTile(iMapIndex: UINT32): void {
  if (iMapIndex >= 0x8000)
    return;
  AddToUndoList(iMapIndex);
  DeleteStuffFromMapTile(iMapIndex);
  MarkWorldDirty();
}

//---------------------------------------------------------------------------------------------------------------
//	DeleteStuffFromMapTile
//
//	Common delete function for both QuickEraseMapTile and EraseMapTile
//
export function DeleteStuffFromMapTile(iMapIndex: UINT32): void {
  // UINT16		usUseIndex;
  // UINT16		usType;
  // UINT32		uiCheckType;
  // UINT16		usDummy;

  // GetTileType( gpWorldLevelData[ iMapIndex ].pLandHead->usIndex, &uiCheckType );
  // RemoveLand( iMapIndex, gpWorldLevelData[ iMapIndex ].pLandHead->usIndex );
  // SmoothTerrainRadius( iMapIndex, uiCheckType, 1, TRUE );

  RemoveExitGridFromWorld(iMapIndex);
  RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  RemoveAllLandsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  RemoveAllRoofsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  RemoveAllOnRoofsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  RemoveAllTopmostsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, Enum313.WIREFRAMES);
  PasteRoomNumber(iMapIndex, 0);
}

//---------------------------------------------------------------------------------------------------------------
//	EraseMapTile
//
//	Generic tile erasing function. Erases things from the world depending on the current drawing mode
//
export function EraseMapTile(iMapIndex: UINT32): void {
  let iEraseMode: INT32;
  let uiCheckType: UINT32;
  if (iMapIndex >= 0x8000)
    return;

  // Figure out what it is we are trying to erase
  iEraseMode = iDrawMode - Enum38.DRAW_MODE_ERASE;

  switch (iEraseMode) {
    case Enum38.DRAW_MODE_NORTHPOINT:
    case Enum38.DRAW_MODE_WESTPOINT:
    case Enum38.DRAW_MODE_EASTPOINT:
    case Enum38.DRAW_MODE_SOUTHPOINT:
    case Enum38.DRAW_MODE_CENTERPOINT:
    case Enum38.DRAW_MODE_ISOLATEDPOINT:
      SpecifyEntryPoint(iMapIndex);
      break;
    case Enum38.DRAW_MODE_EXITGRID:
      AddToUndoList(iMapIndex);
      RemoveExitGridFromWorld(iMapIndex);
      RemoveTopmost(iMapIndex, Enum312.FIRSTPOINTERS8);
      break;
    case Enum38.DRAW_MODE_GROUND:
      // Is there ground on this tile? if not, get out o here
      if (gpWorldLevelData[iMapIndex].pLandHead == null)
        break;

      // is there only 1 ground tile here? if so, get out o here
      if ((<LEVELNODE>gpWorldLevelData[iMapIndex].pLandHead).pNext == null)
        break;
      AddToUndoList(iMapIndex);
      uiCheckType = GetTileType((<LEVELNODE>gpWorldLevelData[iMapIndex].pLandHead).usIndex);
      RemoveLand(iMapIndex, (<LEVELNODE>gpWorldLevelData[iMapIndex].pLandHead).usIndex);
      SmoothTerrainRadius(iMapIndex, uiCheckType, 1, true);
      break;
    case Enum38.DRAW_MODE_OSTRUCTS:
    case Enum38.DRAW_MODE_OSTRUCTS1:
    case Enum38.DRAW_MODE_OSTRUCTS2:
      AddToUndoList(iMapIndex);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTOSTRUCT, LASTOSTRUCT);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTVEHICLE, Enum313.SECONDVEHICLE);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTDEBRISSTRUCT, Enum313.SECONDDEBRISSTRUCT);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.NINTHOSTRUCT, Enum313.TENTHOSTRUCT);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTLARGEEXPDEBRIS, Enum313.SECONDLARGEEXPDEBRIS);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.DEBRIS2MISC, Enum313.DEBRIS2MISC);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.ANOTHERDEBRIS, Enum313.ANOTHERDEBRIS);
      break;
    case Enum38.DRAW_MODE_DEBRIS:
      AddToUndoList(iMapIndex);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.DEBRISROCKS, LASTDEBRIS);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.DEBRIS2MISC, Enum313.DEBRIS2MISC);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.ANOTHERDEBRIS, Enum313.ANOTHERDEBRIS);
      break;
    case Enum38.DRAW_MODE_BANKS:
      AddToUndoList(iMapIndex);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.FIRSTROAD, LASTROAD);
      // Note, for this routine, cliffs are considered a subset of banks
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.ANIOSTRUCT, Enum313.ANIOSTRUCT);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTCLIFF, LASTBANKS);
      RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTCLIFFSHADOW, LASTCLIFFSHADOW);
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.FIRSTCLIFFHANG, LASTCLIFFHANG);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FENCESTRUCT, Enum313.FENCESTRUCT);
      RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FENCESHADOW, Enum313.FENCESHADOW);
      break;
    case Enum38.DRAW_MODE_FLOORS:
      AddToUndoList(iMapIndex);
      RemoveAllLandsOfTypeRange(iMapIndex, Enum313.FIRSTFLOOR, LASTFLOOR);
      break;
    case Enum38.DRAW_MODE_ROOFS:
    case Enum38.DRAW_MODE_NEWROOF:
      AddToUndoList(iMapIndex);
      RemoveAllRoofsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, LASTITEM);
      RemoveAllOnRoofsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, LASTITEM);
      break;
    case Enum38.DRAW_MODE_WALLS:
    case Enum38.DRAW_MODE_DOORS:
    case Enum38.DRAW_MODE_WINDOWS:
    case Enum38.DRAW_MODE_BROKEN_WALLS:
      AddToUndoList(iMapIndex);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
      RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTDOOR, LASTDOOR);
      RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTDOORSHADOW, LASTDOORSHADOW);
      break;
    case Enum38.DRAW_MODE_DECOR:
    case Enum38.DRAW_MODE_DECALS:
    case Enum38.DRAW_MODE_ROOM:
    case Enum38.DRAW_MODE_TOILET:
      AddToUndoList(iMapIndex);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTWALLDECAL, LASTWALLDECAL);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIFTHWALLDECAL, Enum313.EIGTHWALLDECAL);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTDECORATIONS, LASTDECORATIONS);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTISTRUCT, LASTISTRUCT);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIFTHISTRUCT, Enum313.EIGHTISTRUCT);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTSWITCHES, Enum313.FIRSTSWITCHES);
      break;
    case Enum38.DRAW_MODE_CAVES:
      AddToUndoList(iMapIndex);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
      break;
    case Enum38.DRAW_MODE_ROOMNUM:
      PasteRoomNumber(iMapIndex, 0);
      break;
    case Enum38.DRAW_MODE_ROADS:
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.ROADPIECES, Enum313.ROADPIECES);
      break;
    default:
      // DeleteStuffFromMapTile( iMapIndex );
      break;
  }
}

//---------------------------------------------------------------------------------------------------------------
//	PasteDebris
//
//	Place some "debris" on the map at the current mouse coordinates. This function is called repeatedly if
//	the current brush size is larger than 1 tile.
//
export function PasteDebris(iMapIndex: UINT32): void {
  let usUseIndex: UINT16;
  let usUseObjIndex: UINT16;
  let iRandSelIndex: INT32;

  // Get selection list for debris
  pSelList = SelDebris;
  pNumSelList = iNumDebrisSelected__Pointer;

  if (iMapIndex < 0x8000) {
    AddToUndoList(iMapIndex);

    // Remove any debris that is currently at this map location
    if (gpWorldLevelData[iMapIndex].pObjectHead != null) {
      RemoveAllObjectsOfTypeRange(iMapIndex, Enum313.ANOTHERDEBRIS, Enum313.FIRSTPOINTERS - 1);
    }

    // Get a random debris from current selection
    iRandSelIndex = GetRandomSelection();
    if (iRandSelIndex != -1) {
      // Add debris to the world
      usUseIndex = pSelList[iRandSelIndex].usIndex;
      usUseObjIndex = pSelList[iRandSelIndex].uiObject;

      AddObjectToTail(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
    }
  }
}

export function PasteSingleWall(iMapIndex: UINT32): void {
  pSelList = SelSingleWall;
  pNumSelList = iNumWallsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleDoor(iMapIndex: UINT32): void {
  pSelList = SelSingleDoor;
  pNumSelList = iNumDoorsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleWindow(iMapIndex: UINT32): void {
  pSelList = SelSingleWindow;
  pNumSelList = iNumWindowsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleRoof(iMapIndex: UINT32): void {
  pSelList = SelSingleRoof;
  pNumSelList = iNumRoofsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteRoomNumber(iMapIndex: UINT32, ubRoomNumber: UINT8): void {
  if (gubWorldRoomInfo[iMapIndex] != ubRoomNumber) {
    AddToUndoList(iMapIndex);
    gubWorldRoomInfo[iMapIndex] = ubRoomNumber;
  }
}

export function PasteSingleBrokenWall(iMapIndex: UINT32): void {
  let usIndex: UINT16;
  let usObjIndex: UINT16;
  let usTileIndex: UINT16;
  let usWallOrientation: UINT16;

  pSelList = SelSingleBrokenWall;
  pNumSelList = iNumBrokenWallsSelected__Pointer;

  usIndex = pSelList[iCurBank].usIndex;
  usObjIndex = pSelList[iCurBank].uiObject;
  usTileIndex = usTileIndex = GetTileIndexFromTypeSubIndex(usObjIndex, usIndex);
  usWallOrientation = GetWallOrientation(usTileIndex);
  if (usWallOrientation == Enum314.INSIDE_TOP_LEFT || usWallOrientation == Enum314.INSIDE_TOP_RIGHT)
    EraseHorizontalWall(iMapIndex);
  else
    EraseVerticalWall(iMapIndex);

  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleDecoration(iMapIndex: UINT32): void {
  pSelList = SelSingleDecor;
  pNumSelList = iNumDecorSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleDecal(iMapIndex: UINT32): void {
  pSelList = SelSingleDecal;
  pNumSelList = iNumDecalsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleFloor(iMapIndex: UINT32): void {
  pSelList = SelSingleFloor;
  pNumSelList = iNumFloorsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

export function PasteSingleToilet(iMapIndex: UINT32): void {
  pSelList = SelSingleToilet;
  pNumSelList = iNumToiletsSelected__Pointer;
  PasteSingleWallCommon(iMapIndex);
}

//---------------------------------------------------------------------------------------------------------------
//	PasteSingleWallCommon
//
//	Common paste routine for PasteSingleWall, PasteSingleDoor, PasteSingleDecoration, and
//	PasteSingleDecor (above).
//
function PasteSingleWallCommon(iMapIndex: UINT32): void {
  let usUseIndex: UINT16;
  let usUseObjIndex: UINT16;
  let usTempIndex: UINT16;

  if (iMapIndex < 0x8000) {
    AddToUndoList(iMapIndex);

    usUseIndex = pSelList[iCurBank].usIndex;
    usUseObjIndex = pSelList[iCurBank].uiObject;

    // TEMP STUFF FOR ONROOF THINGS!
    if ((usUseObjIndex >= Enum313.FIRSTONROOF) && (usUseObjIndex <= Enum313.SECONDONROOF)) {
      // Add to onroof section!
      AddOnRoofToTail(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));

      if (gTileDatabase[(gTileTypeStartIndex[usUseObjIndex] + usUseIndex)].sBuddyNum != -1) {
        AddOnRoofToTail(iMapIndex, gTileDatabase[(gTileTypeStartIndex[usUseObjIndex] + usUseIndex)].sBuddyNum);
      }
      return;
    }

    // Make sure A-frames are on roof level!
    if ((usUseIndex >= WALL_AFRAME_START && usUseIndex <= WALL_AFRAME_END)) {
      AddRoofToTail(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
      return;
    }

    if ((usUseObjIndex >= Enum313.FIRSTDOOR) && (usUseObjIndex <= LASTDOOR)) {
      // PLace shadow for doors
      if (!gfBasement)
        AddExclusiveShadow(iMapIndex, (gTileTypeStartIndex[usUseObjIndex - Enum313.FIRSTDOOR + Enum313.FIRSTDOORSHADOW] + usUseIndex));
    }

    // Is it a wall?
    if (((usUseObjIndex >= Enum313.FIRSTWALL) && (usUseObjIndex <= LASTWALL))) {
      // ATE		If it is a wall shadow, place differenty!
      if (usUseIndex == 29 || usUseIndex == 30) {
        if (!gfBasement)
          AddExclusiveShadow(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
      } else {
        // Slap down wall/window/door/decoration (no smoothing)
        AddWallToStructLayer(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex), true);
      }
    }
    // Is it a door/window/decoration?
    else if (((usUseObjIndex >= Enum313.FIRSTDOOR) && (usUseObjIndex <= LASTDOOR)) || ((usUseObjIndex >= Enum313.FIRSTDECORATIONS) && (usUseObjIndex <= LASTDECORATIONS))) {
      // Slap down wall/window/door/decoration (no smoothing)
      AddWallToStructLayer(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex), true);
    } else if (((usUseObjIndex >= Enum313.FIRSTROOF) && (usUseObjIndex <= LASTROOF)) || ((usUseObjIndex >= Enum313.FIRSTSLANTROOF) && (usUseObjIndex <= LASTSLANTROOF))) {
      // Put a roof on this tile (even if nothing else is here)
      RemoveAllRoofsOfTypeRange(iMapIndex, Enum313.FIRSTROOF, LASTROOF);
      AddRoofToTail(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
    } else if ((usUseObjIndex >= Enum313.FIRSTFLOOR) && (usUseObjIndex <= LASTFLOOR)) {
      // Drop a floor on this tile
      if ((usTempIndex = TypeExistsInLandLayer(iMapIndex, usUseObjIndex)) !== -1)
        RemoveLand(iMapIndex, usTempIndex);

      AddLandToHead(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
    } else if (usUseObjIndex >= Enum313.FIRSTWALLDECAL && usUseObjIndex <= LASTWALLDECAL || usUseObjIndex >= Enum313.FIFTHWALLDECAL && usUseObjIndex <= Enum313.EIGTHWALLDECAL) {
      // Plop a decal here
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTWALLDECAL, LASTWALLDECAL);
      RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIFTHWALLDECAL, Enum313.EIGTHWALLDECAL);

      AddStructToTail(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
    } else if (usUseObjIndex >= Enum313.FIRSTISTRUCT && usUseObjIndex <= LASTISTRUCT || usUseObjIndex >= Enum313.FIFTHISTRUCT && usUseObjIndex <= Enum313.EIGHTISTRUCT) {
      AddStructToHead(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
    } else if (usUseObjIndex == Enum313.FIRSTSWITCHES) {
      AddStructToTail(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
    }
  }
}

//---------------------------------------------------------------------------------------------------------------
//	GetRandomIndexByRange
//
//	Returns a randomly picked object index given the current selection list, and the type or types of objects we want
//	from that list. If no such objects are in the list, we return 0xffff (-1).
export function GetRandomIndexByRange(usRangeStart: UINT16, usRangeEnd: UINT16): UINT16 {
  let usPickList: UINT16[] /* [50] */ = createArray(50, 0);
  let usNumInPickList: UINT16;
  let usWhich: UINT16;
  let usObject: UINT16;
  // Get a list of valid object to select from
  usNumInPickList = 0;
  for (usWhich = 0; usWhich < pNumSelList.value; usWhich++) {
    usObject = pSelList[usWhich].uiObject;
    if ((usObject >= usRangeStart) && (usObject <= usRangeEnd)) {
      usPickList[usNumInPickList] = usObject;
      usNumInPickList++;
    }
  }
  return (usNumInPickList) ? usPickList[Math.floor(Math.random() * usNumInPickList)] : 0xffff;
}

function GetRandomTypeByRange(usRangeStart: UINT16, usRangeEnd: UINT16): UINT16 {
  let usPickList: UINT16[] /* [50] */ = createArray(50, 0);
  let usNumInPickList: UINT16;
  let i: UINT16;
  let usObject: UINT16;
  let uiType: UINT32;
  // Get a list of valid object to select from
  usNumInPickList = 0;
  for (i = 0; i < pNumSelList.value; i++) {
    usObject = pSelList[i].uiObject;
    if ((usObject >= usRangeStart) && (usObject <= usRangeEnd)) {
      uiType = GetTileType(usObject);
      usPickList[usNumInPickList] = uiType;
      usNumInPickList++;
    }
  }
  return (usNumInPickList) ? usPickList[Math.floor(Math.random() * usNumInPickList)] : 0xffff;
}

//---------------------------------------------------------------------------------------------------------------
//	PasteStructure			(See also PasteStructure1, PasteStructure2, and PasteStructureCommon)
//
//	Puts a structure (trees, trucks, etc.) into the world
//
export function PasteStructure(iMapIndex: UINT32): void {
  pSelList = SelOStructs;
  pNumSelList = iNumOStructsSelected__Pointer;

  PasteStructureCommon(iMapIndex);
}

//---------------------------------------------------------------------------------------------------------------
//	PasteStructure1			(See also PasteStructure, PasteStructure2, and PasteStructureCommon)
//
//	Puts a structure (trees, trucks, etc.) into the world
//
export function PasteStructure1(iMapIndex: UINT32): void {
  pSelList = SelOStructs1;
  pNumSelList = iNumOStructs1Selected__Pointer;

  PasteStructureCommon(iMapIndex);
}

//---------------------------------------------------------------------------------------------------------------
//	PasteStructure2			(See also PasteStructure, PasteStructure1, and PasteStructureCommon)
//
//	Puts a structure (trees, trucks, etc.) into the world
//
export function PasteStructure2(iMapIndex: UINT32): void {
  pSelList = SelOStructs2;
  pNumSelList = iNumOStructs2Selected__Pointer;

  PasteStructureCommon(iMapIndex);
}

//---------------------------------------------------------------------------------------------------------------
//	PasteStructureCommon
//
//	This is the main (common) structure pasting function. The above three wrappers are only required because they
//	each use different selection lists. Other than that, they are COMPLETELY identical.
//
function PasteStructureCommon(iMapIndex: UINT32): void {
  let fDoPaste: boolean = false;
  let fHeadType: UINT32;
  let usUseIndex: UINT16;
  let usUseObjIndex: UINT16;
  let iRandSelIndex: INT32;
  let fOkayToAdd: boolean;

  if (iMapIndex < 0x8000) {
    /*
            if ( gpWorldLevelData[ iMapIndex ].pStructHead != NULL )
            {
                    fDoPaste = FALSE;
            }
            else
            {
                    // Nothing is here, paste
                    fDoPaste = TRUE;
            }
*/
    if (/*fDoPaste &&*/ iMapIndex < 0x8000) {
      iRandSelIndex = GetRandomSelection();
      if (iRandSelIndex == -1) {
        return;
      }

      AddToUndoList(iMapIndex);

      usUseIndex = pSelList[iRandSelIndex].usIndex;
      usUseObjIndex = pSelList[iRandSelIndex].uiObject;

      // Check with Structure Database (aka ODB) if we can put the object here!
      fOkayToAdd = OkayToAddStructureToWorld(iMapIndex, 0, <DB_STRUCTURE_REF>gTileDatabase[(gTileTypeStartIndex[usUseObjIndex] + usUseIndex)].pDBStructureRef, INVALID_STRUCTURE_ID);
      if (fOkayToAdd || (gTileDatabase[(gTileTypeStartIndex[usUseObjIndex] + usUseIndex)].pDBStructureRef == null)) {
        // Actual structure info is added by the functions below
        AddStructToHead(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
        // For now, adjust to shadows by a hard-coded amount,

        // Add mask if in long grass
        fHeadType = GetLandHeadType(iMapIndex);
      }
    }
  } else if (CurrentStruct == ERASE_TILE && iMapIndex < 0x8000) {
    RemoveAllStructsOfTypeRange(iMapIndex, Enum313.FIRSTOSTRUCT, LASTOSTRUCT);
    RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTSHADOW, LASTSHADOW);
  }
}

//---------------------------------------------------------------------------------------------------------------
//	PasteBanks
//
//	Places a river bank or cliff into the world
//
export function PasteBanks(iMapIndex: UINT32, usStructIndex: UINT16, fReplace: boolean): void {
  let fDoPaste: boolean = false;
  let usUseIndex: UINT16;
  let usUseObjIndex: UINT16;
  let usIndex: UINT16;

  pSelList = SelBanks;
  pNumSelList = iNumBanksSelected__Pointer;

  usUseIndex = pSelList[iCurBank].usIndex;
  usUseObjIndex = pSelList[iCurBank].uiObject;

  if (iMapIndex < 0x8000) {
    fDoPaste = true;

    if (gpWorldLevelData[iMapIndex].pStructHead != null) {
      // CHECK IF THE SAME TILE IS HERE
      if ((<LEVELNODE>gpWorldLevelData[iMapIndex].pStructHead).usIndex == (gTileTypeStartIndex[usUseObjIndex] + usUseIndex)) {
        fDoPaste = false;
      }
    } else {
      // Nothing is here, paste
      fDoPaste = true;
    }

    if (fDoPaste) {
      usIndex = gTileTypeStartIndex[usUseObjIndex] + usUseIndex;

      AddToUndoList(iMapIndex);

      {
        if (usUseObjIndex == Enum313.FIRSTROAD) {
          AddObjectToHead(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
        } else {
          AddStructToHead(iMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
          // Add shadows
          if (!gfBasement && usUseObjIndex == Enum313.FIRSTCLIFF) {
            // AddShadowToHead( iMapIndex, (UINT16)( gTileTypeStartIndex[ usUseObjIndex - FIRSTCLIFF + FIRSTCLIFFSHADOW ] + usUseIndex ) );
            AddObjectToHead(iMapIndex, (gTileTypeStartIndex[usUseObjIndex - Enum313.FIRSTCLIFF + Enum313.FIRSTCLIFFHANG] + usUseIndex));
          }
        }
      }
    }
  }
}

export function PasteRoads(iMapIndex: UINT32): void {
  let usUseIndex: UINT16;

  pSelList = SelRoads;
  pNumSelList = iNumRoadsSelected__Pointer;

  usUseIndex = pSelList[iCurBank].usIndex;

  PlaceRoadMacroAtGridNo(iMapIndex, usUseIndex);
}

//---------------------------------------------------------------------------------------------------------------
//	PasteTexture
//
//	Puts a ground texture in the world. Ground textures are then "smoothed" in order to blend the edges with one
//	another. The current drawing brush also affects this function.
//
export function PasteTexture(iMapIndex: UINT32): void {
  ChooseWeightedTerrainTile(); // Kris
  PasteTextureCommon(iMapIndex);
}

//---------------------------------------------------------------------------------------------------------------
//	PasteTextureCommon
//
//	The PasteTexture function calls this one to actually put a ground tile down. If the brush size is larger than
//	one tile, then the above function will call this one and indicate that they should all be placed into the undo
//	stack as the same undo command.
//
export function PasteTextureCommon(iMapIndex: UINT32): void {
  let ubLastHighLevel: UINT8;
  let usTileIndex: UINT16;
  // UINT16					Dummy;

  if (CurrentPaste != NO_TILE && iMapIndex < 0x8000) {
    // Set undo, then set new
    AddToUndoList(iMapIndex);

    if (CurrentPaste == Enum313.DEEPWATERTEXTURE) {
      // IF WE ARE PASTING DEEP WATER AND WE ARE NOT OVER WATER, IGNORE!
      if ((usTileIndex = TypeExistsInLandLayer(iMapIndex, Enum313.REGWATERTEXTURE)) !== -1) {
        if (!gTileDatabase[usTileIndex].ubFullTile) {
          return;
        }
      } else {
        return;
      }
    }

    // Don't draw over floors
    if ((usTileIndex = TypeRangeExistsInLandLayer(iMapIndex, Enum313.FIRSTFLOOR, Enum313.FOURTHFLOOR)) !== -1) {
      return;
    }

    // Compare heights and do appropriate action
    if (AnyHeigherLand(iMapIndex, CurrentPaste, createPointer(() => ubLastHighLevel, (v) => ubLastHighLevel = v))) {
      // Here we do the following:
      // - Remove old type from layer
      // - Smooth World with old type
      // - Add a 3 by 3 square of new type at head
      // - Smooth World with new type
      PasteHigherTexture(iMapIndex, CurrentPaste);
    } else {
      PasteTextureEx(iMapIndex, CurrentPaste);
      SmoothTerrainRadius(iMapIndex, CurrentPaste, 1, true);
    }
  }
}

//---------------------------------------------------------------------------------------------------------------
//	PasteHigherTexture
//
//	Some ground textures should be placed "above" others. That is, grass needs to be placed "above" sand etc.
//	This function performs the appropriate actions.
//
function PasteHigherTexture(iMapIndex: UINT32, fNewType: UINT32): void {
  let NewTile: UINT16;
  let ubLastHighLevel: UINT8;
  let puiDeletedTypes: UINT32[] = [];
  let ubNumTypes: UINT8 = 0;
  let cnt: UINT8;

  // Here we do the following:
  // - Remove old type from layer
  // - Smooth World with old type
  // - Add a 3 by 3 square of new type at head
  // - Smooth World with new type

  // if ( iMapIndex < 0x8000 && TypeRangeExistsInLandLayer( iMapIndex, FIRSTFLOOR, LASTFLOOR, &NewTile ) )
  // ATE: DONOT DO THIS!!!!!!! - I know what was intended - not to draw over floors - this
  // I don't know is the right way to do it!
  // return;

  if (iMapIndex < 0x8000 && AnyHeigherLand(iMapIndex, fNewType, createPointer(() => ubLastHighLevel, (v) => ubLastHighLevel = v))) {
    AddToUndoList(iMapIndex);

    // - For all heigher level, remove
    RemoveHigherLandLevels(iMapIndex, fNewType, createPointer(() => puiDeletedTypes, (v) => puiDeletedTypes = v), createPointer(() => ubNumTypes, (v) => ubNumTypes = v));

    // Set with a radius of 1 and smooth according to height difference
    SetLowerLandIndexWithRadius(iMapIndex, fNewType, 1, true);

    // Smooth all deleted levels
    for (cnt = 0; cnt < ubNumTypes; cnt++) {
      SmoothTerrainRadius(iMapIndex, puiDeletedTypes[cnt], 1, true);
    }
  } else if (iMapIndex < 0x8000) {
    AddToUndoList(iMapIndex);

    NewTile = GetTileIndexFromTypeSubIndex(fNewType, REQUIRES_SMOOTHING_TILE);
    SetLandIndex(iMapIndex, NewTile, fNewType, false);

    // Smooth item then adding here
    NewTile = SmoothTerrain(iMapIndex, fNewType, false);

    if (NewTile != NO_TILE) {
      // Change tile
      SetLandIndex(iMapIndex, NewTile, fNewType, false);
    }
  }
}

//---------------------------------------------------------------------------------------------------------------
//	PasteHigherTextureFromRadius
//
//	Like above function except it performs it's operation on a redial area.
//
function PasteHigherTextureFromRadius(iMapIndex: INT32, uiNewType: UINT32, ubRadius: UINT8): boolean {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let iNewIndex: INT32;
  let iXPos: INT32;
  let iYPos: INT32;

  // Determine start and end indicies and num rows
  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  iXPos = (iMapIndex % WORLD_COLS);
  iYPos = Math.trunc((iMapIndex - iXPos) / WORLD_COLS);

  if ((iXPos + sLeft) < 0)
    sLeft = (-iXPos);

  if ((iXPos + sRight) >= WORLD_COLS)
    sRight = (WORLD_COLS - iXPos - 1);

  if ((iYPos + sTop) >= WORLD_ROWS)
    sTop = (WORLD_ROWS - iYPos - 1);

  if ((iYPos + sBottom) < 0)
    sBottom = (-iYPos);

  if (iMapIndex >= 0x8000)
    return false;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      iNewIndex = iMapIndex + (WORLD_COLS * cnt1) + cnt2;

      PasteHigherTexture(iNewIndex, uiNewType);
    }
  }

  return true;
}

//---------------------------------------------------------------------------------------------------------------
//	PasteExistingTexture
//
function PasteExistingTexture(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let uiNewType: UINT32;
  let usNewIndex: UINT16;
  // UINT16					Dummy;

  // If here, we want to make, esentially, what is a type in
  // a level other than TOP-MOST the TOP-MOST level.
  // We should:
  // - remove what was top-most
  // - re-adjust the world to reflect missing top-most peice

  if (iMapIndex >= 0x8000)
    return false;

  // if ( TypeRangeExistsInLandLayer( iMapIndex, FIRSTFLOOR, LASTFLOOR, &Dummy ) )
  //	return( FALSE );

  // Get top tile index
  // Remove all land peices except
  uiNewType = GetTileType(usIndex);

  DeleteAllLandLayers(iMapIndex);

  // ADD BASE LAND AT LEAST!
  usNewIndex = Math.floor(Math.random() * 10);

  // Adjust for type
  usNewIndex += gTileTypeStartIndex[gCurrentBackground];

  // Set land index
  AddLandToHead(iMapIndex, usNewIndex);

  SetLandIndex(iMapIndex, usIndex, uiNewType, false);

  // ATE: Set this land peice to require smoothing again!
  SmoothAllTerrainTypeRadius(iMapIndex, 2, true);

  return true;
}

//---------------------------------------------------------------------------------------------------------------
//	PasteExistingTextureFromRadius
//
//	As above, but on a radial area
//
function PasteExistingTextureFromRadius(iMapIndex: INT32, usIndex: UINT16, ubRadius: UINT8): boolean {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let iNewIndex: INT32;
  let leftmost: INT32;

  // Determine start end end indicies and num rows
  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  if (iMapIndex >= 0x8000)
    return false;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((iMapIndex + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      iNewIndex = iMapIndex + (WORLD_COLS * cnt1) + cnt2;

      if (iNewIndex >= 0 && iNewIndex < WORLD_MAX && iNewIndex >= leftmost && iNewIndex < (leftmost + WORLD_COLS)) {
        AddToUndoList(iMapIndex);
        PasteExistingTexture(iNewIndex, usIndex);
      }
    }
  }

  return true;
}

//---------------------------------------------------------------------------------------------------------------
//	SetLowerLandIndexWithRadius
//
//	Puts a land index "under" an existing ground texture. Affects a radial area.
//
function SetLowerLandIndexWithRadius(iMapIndex: INT32, uiNewType: UINT32, ubRadius: UINT8, fReplace: boolean): boolean {
  let usTempIndex: UINT16;
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let iNewIndex: INT32;
  let fDoPaste: boolean = false;
  let leftmost: INT32;
  let ubLastHighLevel: UINT8 = 0;
  let ubLastHighLevel__Pointer = createPointer(() => ubLastHighLevel, (v) => ubLastHighLevel = v);
  let puiSmoothTiles: UINT32[] = [];
  let sNumSmoothTiles: INT16 = 0;
  let usTemp: UINT16;
  let NewTile: UINT16; //,Dummy;

  // Determine start end end indicies and num rows
  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  if (iMapIndex >= 0x8000)
    return false;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((iMapIndex + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      iNewIndex = iMapIndex + (WORLD_COLS * cnt1) + cnt2;

      if (iNewIndex >= 0 && iNewIndex < WORLD_MAX && iNewIndex >= leftmost && iNewIndex < (leftmost + WORLD_COLS)) {
        if (fReplace) {
          fDoPaste = true;
        } else {
          if ((usTempIndex = TypeExistsInLandLayer(iNewIndex, uiNewType)) !== -1) {
            fDoPaste = true;
          }
        }

        // if ( fDoPaste && !TypeRangeExistsInLandLayer( iMapIndex, FIRSTFLOOR, LASTFLOOR, &Dummy ) )
        if (fDoPaste) {
          if (iMapIndex == iNewIndex) {
            AddToUndoList(iMapIndex);

            // Force middle one to NOT smooth, and set to random 'full' tile
            usTemp = Math.floor(Math.random() * 10) + 1;
            NewTile = GetTileIndexFromTypeSubIndex(uiNewType, usTemp);
            SetLandIndex(iNewIndex, NewTile, uiNewType, false);
          } else if (AnyHeigherLand(iNewIndex, uiNewType, ubLastHighLevel__Pointer)) {
            AddToUndoList(iMapIndex);

            // Force middle one to NOT smooth, and set to random 'full' tile
            usTemp = Math.floor(Math.random() * 10) + 1;
            NewTile = GetTileIndexFromTypeSubIndex(uiNewType, usTemp);
            SetLandIndex(iNewIndex, NewTile, uiNewType, false);
          } else {
            AddToUndoList(iMapIndex);

            // Set tile to 'smooth target' tile
            NewTile = GetTileIndexFromTypeSubIndex(uiNewType, REQUIRES_SMOOTHING_TILE);
            SetLandIndex(iNewIndex, NewTile, uiNewType, false);

            // If we are top-most, add to smooth list
            sNumSmoothTiles++;
            puiSmoothTiles.push(iNewIndex);
          }
        }
      }
    }
  }

  // Once here, smooth any tiles that need it
  if (sNumSmoothTiles > 0) {
    for (cnt1 = 0; cnt1 < sNumSmoothTiles; cnt1++) {
      SmoothTerrainRadius(puiSmoothTiles[cnt1], uiNewType, 10, false);
    }
  }

  return true;
}

// ATE FIXES
function PasteTextureEx(sGridNo: INT16, usType: UINT16): void {
  let usIndex: UINT16;
  let ubTypeLevel: UINT8 = 0;
  let NewTile: UINT16;

  // CHECK IF THIS TEXTURE EXISTS!
  if ((usIndex = TypeExistsInLandLayer(sGridNo, usType)) !== -1) {
    if (GetTypeLandLevel(sGridNo, usType, createPointer(() => ubTypeLevel, (v) => ubTypeLevel = v))) {
      // If top-land , do not change
      if (ubTypeLevel != LANDHEAD) {
        PasteExistingTexture(sGridNo, usIndex);
      }
    }
  } else {
    // Fill with just first tile, smoothworld() will pick proper piece later
    NewTile = GetTileIndexFromTypeSubIndex(usType, REQUIRES_SMOOTHING_TILE);

    SetLandIndex(sGridNo, NewTile, usType, false);
  }
}

function PasteTextureFromRadiusEx(sGridNo: INT16, usType: UINT16, ubRadius: UINT8): void {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let iNewIndex: INT32;
  let leftmost: INT32;

  // Determine start end end indicies and num rows
  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  if (sGridNo >= 0x8000)
    return;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      iNewIndex = sGridNo + (WORLD_COLS * cnt1) + cnt2;

      if (iNewIndex >= 0 && iNewIndex < WORLD_MAX && iNewIndex >= leftmost && iNewIndex < (leftmost + WORLD_COLS)) {
        PasteTextureEx(sGridNo, usType);
      }
    }
  }

  return;
}

// FUNCTION TO GIVE NEAREST GRIDNO OF A CLIFF
const LAND_DROP_1 = Enum312.FIRSTCLIFF1;
const LAND_DROP_2 = Enum312.FIRSTCLIFF11;
const LAND_DROP_3 = Enum312.FIRSTCLIFF12;
const LAND_DROP_4 = Enum312.FIRSTCLIFF15;
const LAND_DROP_5 = Enum312.FIRSTCLIFF8;
export function RaiseWorldLand(): void {
  let cnt: INT32;
  let sTempGridNo: UINT32;
  let pStruct: LEVELNODE | null;
  let pTileElement: TILE_ELEMENT;
  let fRaise: boolean;
  let fRaiseSet: boolean;
  let fSomethingRaised: boolean = false;
  let ubLoop: UINT8;
  let usIndex: UINT16 = 0;
  let fStopRaise: boolean = false;
  let iCounterA: INT32 = 0;
  let iCounterB: INT32 = 0;
  let iStartNumberOfRaises: INT32 = 0;
  let iNumberOfRaises: INT32 = 0;
  let fAboutToRaise: boolean = false;

  fRaise = false;
  fRaiseSet = false;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    gpWorldLevelData[cnt].uiFlags &= (~MAPELEMENT_RAISE_LAND_START);
    gpWorldLevelData[cnt].uiFlags &= (~MAPELEMENT_RAISE_LAND_END);
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Get Structure levelnode
    pStruct = gpWorldLevelData[cnt].pStructHead;
    gpWorldLevelData[cnt].sHeight = 0;

    while (pStruct) {
      pTileElement = gTileDatabase[pStruct.usIndex];
      if (pTileElement.fType == Enum313.FIRSTCLIFF) {
        fSomethingRaised = true;
        // DebugMsg(TOPIC_JA2,DBG_LEVEL_3,String("Cliff found at count=%d",cnt));
        if (pTileElement.ubNumberOfTiles > 1) {
          // DebugMsg(TOPIC_JA2,DBG_LEVEL_3,String("Cliff has %d children", pTileElement->ubNumberOfTiles));
          for (ubLoop = 0; ubLoop < pTileElement.ubNumberOfTiles; ubLoop++) {
            usIndex = pStruct.usIndex;
            // need means to turn land raising on and off based on the tile ID and the offset in the
            // tile database when reading into the mapsystem
            // turning off of land raising can only be done
            // presently by CLIFF object/tileset 1
            // so simply detect this tile set and turn off instead of on
            // element 1 is 12 tiles and is unique
            Assert(pTileElement.pTileLocData);

            sTempGridNo = cnt + pTileElement.pTileLocData[ubLoop].bTileOffsetX + pTileElement.pTileLocData[ubLoop].bTileOffsetY * WORLD_COLS;
            // Check for valid gridno
            if (OutOfBounds(cnt, sTempGridNo)) {
              continue;
            }
            // if (pTileElement->ubNumberOfTiles==10)
            if ((usIndex == LAND_DROP_1) || (usIndex == LAND_DROP_2) || (usIndex == LAND_DROP_4)) {
              gpWorldLevelData[sTempGridNo].uiFlags &= (~MAPELEMENT_RAISE_LAND_START);
              gpWorldLevelData[sTempGridNo].uiFlags |= MAPELEMENT_RAISE_LAND_END;
            } else if ((usIndex == LAND_DROP_5) && (ubLoop == 4)) {
              gpWorldLevelData[sTempGridNo].uiFlags &= (~MAPELEMENT_RAISE_LAND_START);
              gpWorldLevelData[sTempGridNo].uiFlags |= MAPELEMENT_RAISE_LAND_END;
              if (!(gpWorldLevelData[sTempGridNo + 1].uiFlags & MAPELEMENT_RAISE_LAND_START)) {
                gpWorldLevelData[sTempGridNo + 1].uiFlags |= MAPELEMENT_RAISE_LAND_START;
              }
            } else if ((usIndex == LAND_DROP_3) && ((ubLoop == 0) || (ubLoop == 1) || (ubLoop == 2))) {
              gpWorldLevelData[sTempGridNo].uiFlags &= (~MAPELEMENT_RAISE_LAND_START);
              gpWorldLevelData[sTempGridNo].uiFlags |= MAPELEMENT_RAISE_LAND_END;
            } else {
              gpWorldLevelData[sTempGridNo].uiFlags |= MAPELEMENT_RAISE_LAND_START;
            }
          }
        } else {
          if (usIndex == LAND_DROP_3) {
            gpWorldLevelData[cnt].uiFlags &= (~MAPELEMENT_RAISE_LAND_START);
            gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_RAISE_LAND_END;
          } else {
            // if (pTileElement->ubNumberOfTiles==10)
            if (usIndex == LAND_DROP_1) {
              gpWorldLevelData[cnt].uiFlags &= (~MAPELEMENT_RAISE_LAND_START);
              gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_RAISE_LAND_END;
            } else
              gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_RAISE_LAND_START;
          }
        }
      }
      pStruct = pStruct.pNext;
    }
  }

  if (fSomethingRaised == false) {
    // no cliffs
    return;
  }

  // run through again, this pass is for placing raiselandstart in rows that have raiseland end but no raiselandstart
  for (cnt = WORLD_MAX - 1; cnt >= 0; cnt--) {
    if (cnt % WORLD_ROWS == WORLD_ROWS - 1) {
      // start of new row
      fRaiseSet = false;
    }
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RAISE_LAND_START) {
      fRaiseSet = true;
    } else if ((gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RAISE_LAND_END) && (!fRaiseSet)) {
      // there is a dropoff without a rise.
      // back up and set beginning to raiseland start
      gpWorldLevelData[cnt + ((WORLD_ROWS - 1) - (cnt % WORLD_ROWS))].uiFlags &= (~MAPELEMENT_RAISE_LAND_END);
      gpWorldLevelData[cnt + ((WORLD_ROWS - 1) - (cnt % WORLD_ROWS))].uiFlags |= MAPELEMENT_RAISE_LAND_START;
      if (cnt + ((WORLD_ROWS - 1) - (cnt % WORLD_ROWS)) - WORLD_ROWS > 0) {
        gpWorldLevelData[cnt + ((WORLD_ROWS - 1) - (cnt % WORLD_ROWS)) - WORLD_ROWS].uiFlags &= (~MAPELEMENT_RAISE_LAND_END);
        gpWorldLevelData[cnt + ((WORLD_ROWS - 1) - (cnt % WORLD_ROWS)) - WORLD_ROWS].uiFlags |= MAPELEMENT_RAISE_LAND_START;
      }
      fRaiseSet = true;
    }
  }
  fRaiseSet = false;
  // Look for a cliff face that is along either the lower edge or the right edge of the map, this is used for a special case fill
  // start at y=159, x= 80 and go to x=159, y=80

  // now check along x=159, y=80 to x=80, y=0
  for (cnt = ((WORLD_COLS * WORLD_ROWS) - Math.trunc(WORLD_ROWS / 2) * (WORLD_ROWS - 2) - 1); cnt > WORLD_ROWS - 1; cnt -= (WORLD_ROWS + 1)) {
    if (fAboutToRaise == true) {
      fRaiseSet = true;
      fAboutToRaise = false;
    }

    if ((gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RAISE_LAND_START) || (gpWorldLevelData[cnt - 1].uiFlags & MAPELEMENT_RAISE_LAND_START) || (gpWorldLevelData[cnt + 1].uiFlags & MAPELEMENT_RAISE_LAND_START)) {
      fAboutToRaise = true;
      fRaiseSet = false;
    } else if ((gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RAISE_LAND_END) || (gpWorldLevelData[cnt - 1].uiFlags & MAPELEMENT_RAISE_LAND_END) || (gpWorldLevelData[cnt + 1].uiFlags & MAPELEMENT_RAISE_LAND_END)) {
      fRaiseSet = false;
    }
    if (fRaiseSet) {
      gpWorldLevelData[cnt + ((WORLD_ROWS - 1) - (cnt % WORLD_ROWS))].uiFlags |= MAPELEMENT_RAISE_LAND_START;
      // gpWorldLevelData[cnt].uiFlags|=MAPELEMENT_RAISE_LAND_START;
      // gpWorldLevelData[cnt-1].uiFlags|=MAPELEMENT_RAISE_LAND_START;
      // DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Land Raise start at count: %d is raised",cnt ));
      // DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Land Raise start at count: %d is raised",cnt - 1 ));
    }
  }

  // fRaiseSet = FALSE;

  // Now go through the world, starting at x=max(x) and y=max(y) and work backwards
  // if a cliff is found turn raise flag on, if the end of a screen is found, turn off
  // the system uses world_cord=x+y*(row_size)

  for (cnt = WORLD_MAX - 1; cnt >= 0; cnt--) {
    //  reset the RAISE to FALSE
    // End of the row
    if (!(cnt % WORLD_ROWS)) {
      iNumberOfRaises = 0;
      iStartNumberOfRaises = 0;
    }

    if ((gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RAISE_LAND_END)) {
      if (cnt > 1) {
        if ((!(gpWorldLevelData[cnt - 1].uiFlags & MAPELEMENT_RAISE_LAND_END) && !(gpWorldLevelData[cnt - 2].uiFlags & MAPELEMENT_RAISE_LAND_END))) {
          iNumberOfRaises--;
        }
      }
    } else if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RAISE_LAND_START) {
      // check tile before and after, if either are raise land flagged, then don't increment number of
      // raises
      if (cnt < WORLD_MAX - 2) {
        if ((!(gpWorldLevelData[cnt + 1].uiFlags & MAPELEMENT_RAISE_LAND_START) && !(gpWorldLevelData[cnt + 2].uiFlags & MAPELEMENT_RAISE_LAND_START))) {
          iNumberOfRaises++;
        }
      }
    }

    // look at number of raises.. if negative, then we have more downs than ups, restart row with raises + 1;
    // now raise land of any tile while the flag is on
    if (iNumberOfRaises < 0) {
      // something wrong, reset cnt
      iStartNumberOfRaises++;
      cnt += WORLD_ROWS - cnt % WORLD_ROWS;
      iNumberOfRaises = iStartNumberOfRaises;
      continue;
    }

    if (iNumberOfRaises >= 0) {
      // DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Land Raise start at count: %d is raised",cnt ));
      gpWorldLevelData[cnt].sHeight = iNumberOfRaises * WORLD_CLIFF_HEIGHT;
    }
  }

  for (cnt = WORLD_MAX - 1; cnt >= 0; cnt--) {
    if ((cnt < WORLD_MAX - WORLD_ROWS) && (cnt > WORLD_ROWS)) {
      if ((gpWorldLevelData[cnt + WORLD_ROWS].sHeight == gpWorldLevelData[cnt - WORLD_ROWS].sHeight) && (gpWorldLevelData[cnt].sHeight != gpWorldLevelData[cnt - WORLD_ROWS].sHeight)) {
        gpWorldLevelData[cnt].sHeight = gpWorldLevelData[cnt + WORLD_ROWS].sHeight;
      } else if ((gpWorldLevelData[cnt].sHeight > gpWorldLevelData[cnt - WORLD_ROWS].sHeight) && (gpWorldLevelData[cnt + WORLD_ROWS].sHeight != gpWorldLevelData[cnt - WORLD_ROWS].sHeight) && (gpWorldLevelData[cnt].sHeight > gpWorldLevelData[cnt + WORLD_ROWS].sHeight)) {
        if (gpWorldLevelData[cnt - WORLD_ROWS].sHeight > gpWorldLevelData[cnt + WORLD_ROWS].sHeight) {
          gpWorldLevelData[cnt].sHeight = gpWorldLevelData[cnt - WORLD_ROWS].sHeight;
        } else {
          gpWorldLevelData[cnt].sHeight = gpWorldLevelData[cnt + WORLD_ROWS].sHeight;
        }
      }
    }
  }

  //*/
}

function EliminateObjectLayerRedundancy(): void {
  let i: INT32;
  let numRoads: INT32;
  let numAnothers: INT32;
  let uiType: UINT32;
  let pObject: LEVELNODE | null;
  let pValidRoad: LEVELNODE | null;
  let pValidAnother: LEVELNODE | null;
  let usIndex: UINT16;

  for (i = 0; i < WORLD_MAX; i++) {
    // Eliminate all but the last ROADPIECE and ANOTHERDEBRIS
    pObject = gpWorldLevelData[i].pObjectHead;
    pValidRoad = pValidAnother = null;
    numRoads = numAnothers = 0;
    while (pObject) {
      uiType = GetTileType(pObject.usIndex);
      if (uiType == Enum313.ROADPIECES) {
        // keep track of the last valid road piece, and count the total
        pValidRoad = pObject;
        numRoads++;
      } else if (uiType == Enum313.ANOTHERDEBRIS) {
        // keep track of the last valid another debris, and count the total
        pValidAnother = pObject;
        numAnothers++;
      }
      pObject = pObject.pNext;
    }
    if (pValidRoad && numRoads > 1) {
      // we have more than two roadpieces on the same gridno, so get rid of them, replacing it
      // with the visible one.
      usIndex = pValidRoad.usIndex;
      RemoveAllObjectsOfTypeRange(i, Enum313.ROADPIECES, Enum313.ROADPIECES);
      AddObjectToHead(i, usIndex);
    }
    if (pValidAnother && numAnothers > 1) {
      // we have more than two anotherdebris on the same gridno, so get rid of them, replacing it
      // with the visible one.
      usIndex = pValidAnother.usIndex;
      RemoveAllObjectsOfTypeRange(i, Enum313.ANOTHERDEBRIS, Enum313.ANOTHERDEBRIS);
      AddObjectToHead(i, usIndex);
    }
  }
}

}
