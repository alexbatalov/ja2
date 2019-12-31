namespace ja2 {

const MAX_INTTILE_STACK = 10;

interface CUR_INTERACTIVE_TILE {
  sGridNo: INT16;
  ubFlags: UINT8;
  sTileIndex: INT16;
  sMaxScreenY: INT16;
  sHeighestScreenY: INT16;
  fFound: boolean;
  pFoundNode: LEVELNODE | null;
  sFoundGridNo: INT16;
  usStructureID: UINT16;
  fStructure: boolean;
}

function createCurInteractiveTile(): CUR_INTERACTIVE_TILE {
  return {
    sGridNo: 0,
    ubFlags: 0,
    sTileIndex: 0,
    sMaxScreenY: 0,
    sHeighestScreenY: 0,
    fFound: false,
    pFoundNode: null,
    sFoundGridNo: 0,
    usStructureID: 0,
    fStructure: false,
  }
}

interface INTERACTIVE_TILE_STACK_TYPE {
  bNum: INT8;
  bTiles: CUR_INTERACTIVE_TILE[] /* [MAX_INTTILE_STACK] */;
  bCur: INT8;
}

function createInteractiveTileStackType(): INTERACTIVE_TILE_STACK_TYPE {
  return {
    bNum: 0,
    bTiles: createArrayFrom(MAX_INTTILE_STACK, createCurInteractiveTile),
    bCur: 0,
  };
}

let gCurIntTileStack: INTERACTIVE_TILE_STACK_TYPE = createInteractiveTileStackType();
let gfCycleIntTile: boolean = false;

let gCurIntTile: CUR_INTERACTIVE_TILE = createCurInteractiveTile();
let gfOverIntTile: boolean = false;

// Values to determine if we should check or not
let gsINTOldRenderCenterX: INT16 = 0;
let gsINTOldRenderCenterY: INT16 = 0;
let gusINTOldMousePosX: UINT16 = 0;
let gusINTOldMousePosY: UINT16 = 0;

export function InitInteractiveTileManagement(): boolean {
  return true;
}

export function ShutdownInteractiveTileManagement(): void {
}

export function StartInteractiveObject(sGridNo: INT16, usStructureID: UINT16, pSoldier: SOLDIERTYPE, ubDirection: UINT8): boolean {
  let pStructure: STRUCTURE | null;

  // ATE: Patch fix: Don't allow if alreay in animation
  if (pSoldier.usAnimState == Enum193.OPEN_STRUCT || pSoldier.usAnimState == Enum193.OPEN_STRUCT_CROUCHED || pSoldier.usAnimState == Enum193.BEGIN_OPENSTRUCT || pSoldier.usAnimState == Enum193.BEGIN_OPENSTRUCT_CROUCHED) {
    return false;
  }

  pStructure = FindStructureByID(sGridNo, usStructureID);
  if (pStructure == null) {
    return false;
  }
  if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
    // Add soldier event for opening door....
    pSoldier.ubPendingAction = Enum257.MERC_OPENDOOR;
    pSoldier.uiPendingActionData1 = usStructureID;
    pSoldier.sPendingActionData2 = sGridNo;
    pSoldier.bPendingActionData3 = ubDirection;
    pSoldier.ubPendingActionAnimCount = 0;
  } else {
    // Add soldier event for opening door....
    pSoldier.ubPendingAction = Enum257.MERC_OPENSTRUCT;
    pSoldier.uiPendingActionData1 = usStructureID;
    pSoldier.sPendingActionData2 = sGridNo;
    pSoldier.bPendingActionData3 = ubDirection;
    pSoldier.ubPendingActionAnimCount = 0;
  }

  return true;
}

export function CalcInteractiveObjectAPs(sGridNo: INT16, pStructure: STRUCTURE | null, psAPCost: Pointer<INT16>, psBPCost: Pointer<INT16>): boolean {
  if (pStructure == null) {
    return false;
  }
  if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
    // For doors, if open, we can safely add APs for closing
    // If closed, we do not know what to do yet...
    // if ( pStructure->fFlags & STRUCTURE_OPEN )
    //{
    psAPCost.value = AP_OPEN_DOOR;
    psBPCost.value = AP_OPEN_DOOR;
    //}
    // else
    //{
    //	*psAPCost = 0;
    //	*psBPCost = 0;
    //}
  } else {
    psAPCost.value = AP_OPEN_DOOR;
    psBPCost.value = AP_OPEN_DOOR;
  }

  return true;
}

export function InteractWithInteractiveObject(pSoldier: SOLDIERTYPE, pStructure: STRUCTURE | null, ubDirection: UINT8): boolean {
  let fDoor: boolean = false;

  if (pStructure == null) {
    return false;
  }

  if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
    fDoor = true;
  }

  InteractWithOpenableStruct(pSoldier, pStructure, ubDirection, fDoor);

  return true;
}

export function SoldierHandleInteractiveObject(pSoldier: SOLDIERTYPE): boolean {
  let pStructure: STRUCTURE | null;
  let usStructureID: UINT16;
  let sGridNo: INT16;

  sGridNo = pSoldier.sPendingActionData2;
  usStructureID = pSoldier.uiPendingActionData1;

  // HANDLE SOLDIER ACTIONS
  pStructure = FindStructureByID(sGridNo, usStructureID);
  if (pStructure == null) {
    // DEBUG MSG!
    return false;
  }

  return HandleOpenableStruct(pSoldier, sGridNo, pStructure);
}

export function HandleStructChangeFromGridNo(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  let pStructure: STRUCTURE | null;
  let pNewStructure: STRUCTURE | null;
  let sAPCost: INT16 = 0;
  let sBPCost: INT16 = 0;
  let pItemPool: ITEM_POOL | null;
  let fDidMissingQuote: boolean = false;

  pStructure = FindStructure(sGridNo, STRUCTURE_OPENABLE);

  if (pStructure == null) {
    return;
  }

  // Do sound...
  if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
    // Play Opening sound...
    PlayJA2Sample(GetStructureOpenSound(pStructure, false), RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
  } else {
    // Play Opening sound...
    PlayJA2Sample((GetStructureOpenSound(pStructure, true)), RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
  }

  // ATE: Don't handle switches!
  if (!(pStructure.fFlags & STRUCTURE_SWITCH)) {
    if (pSoldier.bTeam == gbPlayerNum) {
      if (sGridNo == BOBBYR_SHIPPING_DEST_GRIDNO && gWorldSectorX == BOBBYR_SHIPPING_DEST_SECTOR_X && gWorldSectorY == BOBBYR_SHIPPING_DEST_SECTOR_Y && gbWorldSectorZ == BOBBYR_SHIPPING_DEST_SECTOR_Z && CheckFact(Enum170.FACT_PABLOS_STOLE_FROM_LATEST_SHIPMENT, 0) && !(CheckFact(Enum170.FACT_PLAYER_FOUND_ITEMS_MISSING, 0))) {
        SayQuoteFromNearbyMercInSector(BOBBYR_SHIPPING_DEST_GRIDNO, 3, Enum202.QUOTE_STUFF_MISSING_DRASSEN);
        fDidMissingQuote = true;
      }
    } else if (pSoldier.bTeam == CIV_TEAM) {
      if (pSoldier.ubProfile != NO_PROFILE) {
        TriggerNPCWithGivenApproach(pSoldier.ubProfile, Enum296.APPROACH_DONE_OPEN_STRUCTURE, false);
      }
    }

    // LOOK for item pool here...
    if ((pItemPool = GetItemPool(sGridNo, pSoldier.bLevel))) {
      // Update visiblity....
      if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
        let fDoHumm: boolean = true;
        let fDoLocators: boolean = true;

        if (pSoldier.bTeam != gbPlayerNum) {
          fDoHumm = false;
          fDoLocators = false;
        }

        // Look for ownership here....
        if (gWorldItems[pItemPool.iItemIndex].o.usItem == Enum225.OWNERSHIP) {
          fDoHumm = false;
          TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, Enum259.BATTLE_SOUND_NOTHING, 500);
        }

        // If now open, set visible...
        SetItemPoolVisibilityOn(pItemPool, ANY_VISIBILITY_VALUE, fDoLocators);

        // Display quote!
        // TacticalCharacterDialogue( pSoldier, (UINT16)( QUOTE_SPOTTED_SOMETHING_ONE + Random( 2 ) ) );

        // ATE: Check now many things in pool.....
        if (!fDidMissingQuote) {
          if (pItemPool.pNext != null) {
            if (pItemPool.pNext.pNext != null) {
              fDoHumm = false;

              TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, Enum259.BATTLE_SOUND_COOL1, 500);
            }
          }

          if (fDoHumm) {
            TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, Enum259.BATTLE_SOUND_HUMM, 500);
          }
        }
      } else {
        SetItemPoolVisibilityHidden(pItemPool);
      }
    } else {
      if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
        TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, Enum259.BATTLE_SOUND_NOTHING, 500);
      }
    }
  }

  // Deduct points!
  // CalcInteractiveObjectAPs( sGridNo, pStructure, &sAPCost, &sBPCost );
  // DeductPoints( pSoldier, sAPCost, sBPCost );

  pNewStructure = SwapStructureForPartner(sGridNo, pStructure);
  if (pNewStructure != null) {
    RecompileLocalMovementCosts(sGridNo);
    SetRenderFlags(RENDER_FLAG_FULL);
    if (pNewStructure.fFlags & STRUCTURE_SWITCH) {
      // just turned a switch on!
      ActivateSwitchInGridNo(pSoldier.ubID, sGridNo);
    }
  }
}

export function GetInteractiveTileCursor(uiOldCursor: UINT32, fConfirm: boolean): UINT32 {
  let pIntNode: LEVELNODE | null;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let sGridNo: INT16 = 0;

  // OK, first see if we have an in tile...
  pIntNode = GetCurInteractiveTileGridNoAndStructure(createPointer(() => sGridNo, (v) => sGridNo = v), createPointer(() => pStructure, (v) => pStructure = v));

  if (pIntNode != null && pStructure != null) {
    if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
      SetDoorString(sGridNo);

      if (fConfirm) {
        return Enum210.OKHANDCURSOR_UICURSOR;
      } else {
        return Enum210.NORMALHANDCURSOR_UICURSOR;
      }
    } else {
      if (pStructure.fFlags & STRUCTURE_SWITCH) {
        gzIntTileLocation = gzLateLocalizedString[25];
        gfUIIntTileLocation = true;
      }

      if (fConfirm) {
        return Enum210.OKHANDCURSOR_UICURSOR;
      } else {
        return Enum210.NORMALHANDCURSOR_UICURSOR;
      }
    }
  }

  return uiOldCursor;
}

export function SetActionModeDoorCursorText(): void {
  let pIntNode: LEVELNODE | null;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let sGridNo: INT16 = 0;

  // If we are over a merc, don't
  if (gfUIFullTargetFound) {
    return;
  }

  // OK, first see if we have an in tile...
  pIntNode = GetCurInteractiveTileGridNoAndStructure(createPointer(() => sGridNo, (v) => sGridNo = v), createPointer(() => pStructure, (v) => pStructure = v));

  if (pIntNode != null && pStructure != null) {
    if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
      SetDoorString(sGridNo);
    }
  }
}

function GetLevelNodeScreenRect(pNode: LEVELNODE, pRect: SGPRect, sXPos: INT16, sYPos: INT16, sGridNo: INT16): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempX_S: INT16;
  let sTempY_S: INT16;
  let pTrav: ETRLEObject;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let TileElem: TILE_ELEMENT;

  // Get 'TRUE' merc position
  sOffsetX = sXPos - gsRenderCenterX;
  sOffsetY = sYPos - gsRenderCenterY;

  ({ sScreenX: sTempX_S, sScreenY: sTempY_S } = FromCellToScreenCoordinates(sOffsetX, sOffsetY));

  if (pNode.uiFlags & LEVELNODE_CACHEDANITILE) {
    pTrav = (<TILE_IMAGERY>gpTileCache[pNode.pAniTile.sCachedTileID].pImagery).vo.pETRLEObject[pNode.pAniTile.sCurrentFrame];
  } else {
    TileElem = gTileDatabase[pNode.usIndex];

    // Adjust for current frames and animations....
    if (TileElem.uiFlags & ANIMATED_TILE) {
      Assert(TileElem.pAnimData != null);
      TileElem = gTileDatabase[TileElem.pAnimData.pusFrames[TileElem.pAnimData.bCurrentFrame]];
    } else if ((pNode.uiFlags & LEVELNODE_ANIMATION)) {
      if (pNode.sCurrentFrame != -1) {
        Assert(TileElem.pAnimData != null);
        TileElem = gTileDatabase[TileElem.pAnimData.pusFrames[pNode.sCurrentFrame]];
      }
    }

    pTrav = TileElem.hTileSurface.pETRLEObject[TileElem.usRegionIndex];
  }

  sScreenX = Math.trunc((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sTempX_S;
  sScreenY = Math.trunc((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sTempY_S;

  // Adjust for offset position on screen
  sScreenX -= gsRenderWorldOffsetX;
  sScreenY -= gsRenderWorldOffsetY;
  sScreenY -= gpWorldLevelData[sGridNo].sHeight;

  // Adjust based on interface level
  if (gsInterfaceLevel > 0) {
    sScreenY += ROOF_LEVEL_HEIGHT;
  }

  // Adjust for render height
  sScreenY += gsRenderHeight;

  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;

  // Add to start position of dest buffer
  sScreenX += (pTrav.sOffsetX - Math.trunc(WORLD_TILE_X / 2));
  sScreenY += (pTrav.sOffsetY - Math.trunc(WORLD_TILE_Y / 2));

  // Adjust y offset!
  sScreenY += Math.trunc(WORLD_TILE_Y / 2);

  pRect.iLeft = sScreenX;
  pRect.iTop = sScreenY;
  pRect.iBottom = sScreenY + usHeight;
  pRect.iRight = sScreenX + usWidth;
}

export function CompileInteractiveTiles(): void {
}

export function LogMouseOverInteractiveTile(sGridNo: INT16): void {
  let aRect: SGPRect = createSGPRect();
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let pNode: LEVELNODE | null;

  // OK, for now, don't allow any interactive tiles on higher interface level!
  if (gsInterfaceLevel > 0) {
    return;
  }

  // Also, don't allow for mercs who are on upper level...
  if (gusSelectedSoldier != NOBODY && MercPtrs[gusSelectedSoldier].bLevel == 1) {
    return;
  }

  // Get World XY From gridno
  ({ sCellX: sXMapPos, sCellY: sYMapPos } = ConvertGridNoToCellXY(sGridNo));

  // Set mouse stuff
  sScreenX = gusMouseXPos;
  sScreenY = gusMouseYPos;

  pNode = gpWorldLevelData[sGridNo].pStructHead;

  while (pNode != null) {
    {
      GetLevelNodeScreenRect(pNode, aRect, sXMapPos, sYMapPos, sGridNo);

      // Make sure we are always on guy if we are on same gridno
      if (IsPointInScreenRect(sScreenX, sScreenY, aRect)) {
        // OK refine it!
        if (RefinePointCollisionOnStruct(sGridNo, sScreenX, sScreenY, aRect.iLeft, aRect.iBottom, pNode)) {
          // Do some additional checks here!
          if (RefineLogicOnStruct(sGridNo, pNode)) {
            gCurIntTile.fFound = true;

            // Only if we are not currently cycling....
            if (!gfCycleIntTile) {
              // Accumulate them!
              gCurIntTileStack.bTiles[gCurIntTileStack.bNum].pFoundNode = pNode;
              gCurIntTileStack.bTiles[gCurIntTileStack.bNum].sFoundGridNo = sGridNo;
              gCurIntTileStack.bNum++;

              // Determine if it's the best one
              if (aRect.iBottom > gCurIntTile.sHeighestScreenY) {
                gCurIntTile.sMaxScreenY = aRect.iBottom;
                gCurIntTile.sHeighestScreenY = gCurIntTile.sMaxScreenY;

                // Set it!
                gCurIntTile.pFoundNode = pNode;
                gCurIntTile.sFoundGridNo = sGridNo;

                // Set stack current one...
                gCurIntTileStack.bCur = gCurIntTileStack.bNum - 1;
              }
            }
          }
        }
      }

      pNode = pNode.pNext;
    }
  }
}

function InternalGetCurInteractiveTile(fRejectItemsOnTop: boolean): LEVELNODE | null {
  let pNode: LEVELNODE | null = null;
  let pStructure: STRUCTURE | null = null;

  // OK, Look for our tile!

  // Check for shift down!
  if (_KeyDown(SHIFT)) {
    return null;
  }

  if (gfOverIntTile) {
    pNode = gpWorldLevelData[gCurIntTile.sGridNo].pStructHead;

    while (pNode != null) {
      if (pNode.usIndex == gCurIntTile.sTileIndex) {
        if (fRejectItemsOnTop) {
          // get strucuture here...
          if (gCurIntTile.fStructure) {
            pStructure = FindStructureByID(gCurIntTile.sGridNo, gCurIntTile.usStructureID);
            if (pStructure != null) {
              if (pStructure.fFlags & STRUCTURE_HASITEMONTOP) {
                return null;
              }
            } else {
              return null;
            }
          }
        }

        return pNode;
      }

      pNode = pNode.pNext;
    }
  }

  return null;
}

export function GetCurInteractiveTile(): LEVELNODE | null {
  return InternalGetCurInteractiveTile(true);
}

export function GetCurInteractiveTileGridNo(psGridNo: Pointer<INT16>): LEVELNODE | null {
  let pNode: LEVELNODE | null;

  pNode = GetCurInteractiveTile();

  if (pNode != null) {
    psGridNo.value = gCurIntTile.sGridNo;
  } else {
    psGridNo.value = NOWHERE;
  }

  return pNode;
}

export function ConditionalGetCurInteractiveTileGridNoAndStructure(psGridNo: Pointer<INT16>, ppStructure: Pointer<STRUCTURE | null>, fRejectOnTopItems: boolean): LEVELNODE | null {
  let pNode: LEVELNODE | null;
  let pStructure: STRUCTURE | null;

  ppStructure.value = null;

  pNode = InternalGetCurInteractiveTile(fRejectOnTopItems);

  if (pNode != null) {
    psGridNo.value = gCurIntTile.sGridNo;
  } else {
    psGridNo.value = NOWHERE;
  }

  if (pNode != null) {
    if (gCurIntTile.fStructure) {
      pStructure = FindStructureByID(gCurIntTile.sGridNo, gCurIntTile.usStructureID);
      if (pStructure == null) {
        ppStructure.value = null;
        return null;
      } else {
        ppStructure.value = pStructure;
      }
    }
  }

  return pNode;
}

export function GetCurInteractiveTileGridNoAndStructure(psGridNo: Pointer<INT16>, ppStructure: Pointer<STRUCTURE | null>): LEVELNODE | null {
  return ConditionalGetCurInteractiveTileGridNoAndStructure(psGridNo, ppStructure, true);
}

export function BeginCurInteractiveTileCheck(bCheckFlags: UINT8): void {
  gfOverIntTile = false;

  // OK, release our stack, stuff could be different!
  gfCycleIntTile = false;

  // Reset some highest values
  gCurIntTile.sHeighestScreenY = 0;
  gCurIntTile.fFound = false;
  gCurIntTile.ubFlags = bCheckFlags;

  // Reset stack values
  gCurIntTileStack.bNum = 0;
}

export function EndCurInteractiveTileCheck(): void {
  let pCurIntTile: CUR_INTERACTIVE_TILE = createCurInteractiveTile();

  if (gCurIntTile.fFound) {
    // Set our currently cycled guy.....
    if (gfCycleIntTile) {
      // OK, we're over this cycled node
      pCurIntTile = gCurIntTileStack.bTiles[gCurIntTileStack.bCur];
    } else {
      // OK, we're over this levelnode,
      pCurIntTile = gCurIntTile;
    }

    Assert(pCurIntTile.pFoundNode);

    gCurIntTile.sGridNo = pCurIntTile.sFoundGridNo;
    gCurIntTile.sTileIndex = pCurIntTile.pFoundNode.usIndex;

    if (pCurIntTile.pFoundNode.pStructureData != null) {
      gCurIntTile.usStructureID = pCurIntTile.pFoundNode.pStructureData.usStructureID;
      gCurIntTile.fStructure = true;
    } else {
      gCurIntTile.fStructure = false;
    }

    gfOverIntTile = true;
  } else {
    // If we are in cycle mode, end it
    if (gfCycleIntTile) {
      gfCycleIntTile = false;
    }
  }
}

function RefineLogicOnStruct(sGridNo: INT16, pNode: LEVELNODE): boolean {
  let TileElem: TILE_ELEMENT;
  let pStructure: STRUCTURE | null;

  if (pNode.uiFlags & LEVELNODE_CACHEDANITILE) {
    return false;
  }

  TileElem = gTileDatabase[pNode.usIndex];

  if (gCurIntTile.ubFlags == INTILE_CHECK_SELECTIVE) {
    // See if we are on an interactable tile!
    // Try and get struct data from levelnode pointer
    pStructure = pNode.pStructureData;

    // If no data, quit
    if (pStructure == null) {
      return false;
    }

    if (!(pStructure.fFlags & (STRUCTURE_OPENABLE | STRUCTURE_HASITEMONTOP))) {
      return false;
    }

    if (gusSelectedSoldier != NOBODY && MercPtrs[gusSelectedSoldier].ubBodyType == Enum194.ROBOTNOWEAPON) {
      return false;
    }

    // If we are a door, we need a different definition of being visible than other structs
    if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
      if (!IsDoorVisibleAtGridNo(sGridNo)) {
        return false;
      }

      // OK, For a OPENED door, addition requirements are: need to be in 'HAND CURSOR' mode...
      if (pStructure.fFlags & STRUCTURE_OPEN) {
        // Are we in hand cursor mode?
        if (gCurrentUIMode != Enum206.HANDCURSOR_MODE && gCurrentUIMode != Enum206.ACTION_MODE) {
          return false;
        }
      }

      // If this option is on...
      if (!gGameSettings.fOptions[Enum8.TOPTION_SNAP_CURSOR_TO_DOOR]) {
        if (gCurrentUIMode != Enum206.HANDCURSOR_MODE) {
          return false;
        }
      }
    } else {
      // IF we are a switch, reject in another direction...
      if (pStructure.fFlags & STRUCTURE_SWITCH) {
        // Find a new gridno based on switch's orientation...
        let sNewGridNo: INT16 = NOWHERE;

        switch (pStructure.pDBStructureRef.pDBStructure.ubWallOrientation) {
          case Enum314.OUTSIDE_TOP_LEFT:
          case Enum314.INSIDE_TOP_LEFT:

            // Move south...
            sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTH));
            break;

          case Enum314.OUTSIDE_TOP_RIGHT:
          case Enum314.INSIDE_TOP_RIGHT:

            // Move east...
            sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.EAST));
            break;
        }

        if (sNewGridNo != NOWHERE) {
          // If we are hidden by a roof, reject it!
          if (!gfBasement && IsRoofVisible2(sNewGridNo) && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
            return false;
          }
        }
      } else {
        // If we are hidden by a roof, reject it!
        if (!gfBasement && IsRoofVisible(sGridNo) && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
          return false;
        }
      }
    }

    // Check if it's a hidden struct and we have not revealed anything!
    if (TileElem.uiFlags & HIDDEN_TILE) {
      if (!IsHiddenStructureVisible(sGridNo, pNode.usIndex)) {
        // Return false
        return false;
      }
    }
  }

  return true;
}

function RefinePointCollisionOnStruct(sGridNo: INT16, sTestX: INT16, sTestY: INT16, sSrcX: INT16, sSrcY: INT16, pNode: LEVELNODE): boolean {
  let TileElem: TILE_ELEMENT;

  if (pNode.uiFlags & LEVELNODE_CACHEDANITILE) {
    // Check it!
    return CheckVideoObjectScreenCoordinateInData((<TILE_IMAGERY>gpTileCache[pNode.pAniTile.sCachedTileID].pImagery).vo, pNode.pAniTile.sCurrentFrame, (sTestX - sSrcX), (-1 * (sTestY - sSrcY)));
  } else {
    TileElem = gTileDatabase[pNode.usIndex];

    // Adjust for current frames and animations....
    if (TileElem.uiFlags & ANIMATED_TILE) {
      Assert(TileElem.pAnimData != null);
      TileElem = gTileDatabase[TileElem.pAnimData.pusFrames[TileElem.pAnimData.bCurrentFrame]];
    } else if ((pNode.uiFlags & LEVELNODE_ANIMATION)) {
      if (pNode.sCurrentFrame != -1) {
        Assert(TileElem.pAnimData != null);
        TileElem = gTileDatabase[TileElem.pAnimData.pusFrames[pNode.sCurrentFrame]];
      }
    }

    // Check it!
    return CheckVideoObjectScreenCoordinateInData(TileElem.hTileSurface, TileElem.usRegionIndex, (sTestX - sSrcX), (-1 * (sTestY - sSrcY)));
  }
}

// This function will check the video object at SrcX and SrcY for the lack of transparency
// will return true if data found, else false
export function CheckVideoObjectScreenCoordinateInData(hSrcVObject: SGPVObject, usIndex: UINT16, iTestX: INT32, iTestY: INT32): boolean {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: number;
  let LineSkip: UINT32;
  let pTrav: ETRLEObject;
  let fDataFound: boolean = false;
  let iTestPos: INT32;
  let iStartPos: INT32;

  // Assertions
  Assert(hSrcVObject != null);

  // Get Offsets from Index into structure
  pTrav = hSrcVObject.pETRLEObject[usIndex];
  usHeight = pTrav.usHeight;
  usWidth = pTrav.usWidth;
  uiOffset = pTrav.uiDataOffset;

  // Calculate test position we are looking for!
  // Calculate from 0, 0 at top left!
  iTestPos = ((usHeight - iTestY) * usWidth) + iTestX;
  iStartPos = 0;
  LineSkip = usWidth;

  SrcPtr = uiOffset;

  let pPixData = hSrcVObject.pPixData;
  let byte: number;
  let runLength: number;

  while (usHeight) {
    byte = pPixData[SrcPtr++];
    if (byte === 0x00) {
      usHeight--;
      continue;
    }

    runLength = byte & 0x7F;

    if (iTestPos >= iStartPos && iTestPos < iStartPos + runLength) {
      fDataFound = !(byte & 0x80);
      break;
    }

    iStartPos += runLength;
  }

  return fDataFound;
}

export function ShouldCheckForMouseDetections(): boolean {
  let fOK: boolean = false;

  if (gsINTOldRenderCenterX != gsRenderCenterX || gsINTOldRenderCenterY != gsRenderCenterY || gusINTOldMousePosX != gusMouseXPos || gusINTOldMousePosY != gusMouseYPos) {
    fOK = true;
  }

  // Set old values
  gsINTOldRenderCenterX = gsRenderCenterX;
  gsINTOldRenderCenterY = gsRenderCenterY;

  gusINTOldMousePosX = gusMouseXPos;
  gusINTOldMousePosY = gusMouseYPos;

  return fOK;
}

export function CycleIntTileFindStack(usMapPos: UINT16): void {
  gfCycleIntTile = true;

  // Cycle around!
  gCurIntTileStack.bCur++;

  // PLot new movement
  gfPlotNewMovement = true;

  if (gCurIntTileStack.bCur == gCurIntTileStack.bNum) {
    gCurIntTileStack.bCur = 0;
  }
}

}
