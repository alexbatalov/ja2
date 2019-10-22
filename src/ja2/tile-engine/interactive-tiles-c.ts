const MAX_INTTILE_STACK = 10;

interface CUR_INTERACTIVE_TILE {
  sGridNo: INT16;
  ubFlags: UINT8;
  sTileIndex: INT16;
  sMaxScreenY: INT16;
  sHeighestScreenY: INT16;
  fFound: BOOLEAN;
  pFoundNode: Pointer<LEVELNODE>;
  sFoundGridNo: INT16;
  usStructureID: UINT16;
  fStructure: BOOLEAN;
}

interface INTERACTIVE_TILE_STACK_TYPE {
  bNum: INT8;
  bTiles: CUR_INTERACTIVE_TILE[] /* [MAX_INTTILE_STACK] */;
  bCur: INT8;
}

let gCurIntTileStack: INTERACTIVE_TILE_STACK_TYPE;
let gfCycleIntTile: BOOLEAN = FALSE;

let gCurIntTile: CUR_INTERACTIVE_TILE;
let gfOverIntTile: BOOLEAN = FALSE;

// Values to determine if we should check or not
let gsINTOldRenderCenterX: INT16 = 0;
let gsINTOldRenderCenterY: INT16 = 0;
let gusINTOldMousePosX: UINT16 = 0;
let gusINTOldMousePosY: UINT16 = 0;

function InitInteractiveTileManagement(): BOOLEAN {
  return TRUE;
}

function ShutdownInteractiveTileManagement(): void {
}

function AddInteractiveTile(sGridNo: INT16, pLevelNode: Pointer<LEVELNODE>, uiFlags: UINT32, usType: UINT16): BOOLEAN {
  return TRUE;
}

function StartInteractiveObject(sGridNo: INT16, usStructureID: UINT16, pSoldier: Pointer<SOLDIERTYPE>, ubDirection: UINT8): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  // ATE: Patch fix: Don't allow if alreay in animation
  if (pSoldier.value.usAnimState == OPEN_STRUCT || pSoldier.value.usAnimState == OPEN_STRUCT_CROUCHED || pSoldier.value.usAnimState == BEGIN_OPENSTRUCT || pSoldier.value.usAnimState == BEGIN_OPENSTRUCT_CROUCHED) {
    return FALSE;
  }

  pStructure = FindStructureByID(sGridNo, usStructureID);
  if (pStructure == NULL) {
    return FALSE;
  }
  if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
    // Add soldier event for opening door....
    pSoldier.value.ubPendingAction = MERC_OPENDOOR;
    pSoldier.value.uiPendingActionData1 = usStructureID;
    pSoldier.value.sPendingActionData2 = sGridNo;
    pSoldier.value.bPendingActionData3 = ubDirection;
    pSoldier.value.ubPendingActionAnimCount = 0;
  } else {
    // Add soldier event for opening door....
    pSoldier.value.ubPendingAction = MERC_OPENSTRUCT;
    pSoldier.value.uiPendingActionData1 = usStructureID;
    pSoldier.value.sPendingActionData2 = sGridNo;
    pSoldier.value.bPendingActionData3 = ubDirection;
    pSoldier.value.ubPendingActionAnimCount = 0;
  }

  return TRUE;
}

function CalcInteractiveObjectAPs(sGridNo: INT16, pStructure: Pointer<STRUCTURE>, psAPCost: Pointer<INT16>, psBPCost: Pointer<INT16>): BOOLEAN {
  if (pStructure == NULL) {
    return FALSE;
  }
  if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
    // For doors, if open, we can safely add APs for closing
    // If closed, we do not know what to do yet...
    // if ( pStructure->fFlags & STRUCTURE_OPEN )
    //{
    *psAPCost = AP_OPEN_DOOR;
    *psBPCost = AP_OPEN_DOOR;
    //}
    // else
    //{
    //	*psAPCost = 0;
    //	*psBPCost = 0;
    //}
  } else {
    *psAPCost = AP_OPEN_DOOR;
    *psBPCost = AP_OPEN_DOOR;
  }

  return TRUE;
}

function InteractWithInteractiveObject(pSoldier: Pointer<SOLDIERTYPE>, pStructure: Pointer<STRUCTURE>, ubDirection: UINT8): BOOLEAN {
  let fDoor: BOOLEAN = FALSE;

  if (pStructure == NULL) {
    return FALSE;
  }

  if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
    fDoor = TRUE;
  }

  InteractWithOpenableStruct(pSoldier, pStructure, ubDirection, fDoor);

  return TRUE;
}

function SoldierHandleInteractiveObject(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;
  let usStructureID: UINT16;
  let sGridNo: INT16;

  sGridNo = pSoldier.value.sPendingActionData2;
  usStructureID = pSoldier.value.uiPendingActionData1;

  // HANDLE SOLDIER ACTIONS
  pStructure = FindStructureByID(sGridNo, usStructureID);
  if (pStructure == NULL) {
    // DEBUG MSG!
    return FALSE;
  }

  return HandleOpenableStruct(pSoldier, sGridNo, pStructure);
}

function HandleStructChangeFromGridNo(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  let pStructure: Pointer<STRUCTURE>;
  let pNewStructure: Pointer<STRUCTURE>;
  let sAPCost: INT16 = 0;
  let sBPCost: INT16 = 0;
  let pItemPool: Pointer<ITEM_POOL>;
  let fDidMissingQuote: BOOLEAN = FALSE;

  pStructure = FindStructure(sGridNo, STRUCTURE_OPENABLE);

  if (pStructure == NULL) {
    return;
  }

  // Do sound...
  if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
    // Play Opening sound...
    PlayJA2Sample(GetStructureOpenSound(pStructure, FALSE), RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
  } else {
    // Play Opening sound...
    PlayJA2Sample((GetStructureOpenSound(pStructure, TRUE)), RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
  }

  // ATE: Don't handle switches!
  if (!(pStructure.value.fFlags & STRUCTURE_SWITCH)) {
    if (pSoldier.value.bTeam == gbPlayerNum) {
      if (sGridNo == BOBBYR_SHIPPING_DEST_GRIDNO && gWorldSectorX == BOBBYR_SHIPPING_DEST_SECTOR_X && gWorldSectorY == BOBBYR_SHIPPING_DEST_SECTOR_Y && gbWorldSectorZ == BOBBYR_SHIPPING_DEST_SECTOR_Z && CheckFact(FACT_PABLOS_STOLE_FROM_LATEST_SHIPMENT, 0) && !(CheckFact(FACT_PLAYER_FOUND_ITEMS_MISSING, 0))) {
        SayQuoteFromNearbyMercInSector(BOBBYR_SHIPPING_DEST_GRIDNO, 3, QUOTE_STUFF_MISSING_DRASSEN);
        fDidMissingQuote = TRUE;
      }
    } else if (pSoldier.value.bTeam == CIV_TEAM) {
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        TriggerNPCWithGivenApproach(pSoldier.value.ubProfile, APPROACH_DONE_OPEN_STRUCTURE, FALSE);
      }
    }

    // LOOK for item pool here...
    if (GetItemPool(sGridNo, addressof(pItemPool), pSoldier.value.bLevel)) {
      // Update visiblity....
      if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
        let fDoHumm: BOOLEAN = TRUE;
        let fDoLocators: BOOLEAN = TRUE;

        if (pSoldier.value.bTeam != gbPlayerNum) {
          fDoHumm = FALSE;
          fDoLocators = FALSE;
        }

        // Look for ownership here....
        if (gWorldItems[pItemPool.value.iItemIndex].o.usItem == OWNERSHIP) {
          fDoHumm = FALSE;
          TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, BATTLE_SOUND_NOTHING, 500);
        }

        // If now open, set visible...
        SetItemPoolVisibilityOn(pItemPool, ANY_VISIBILITY_VALUE, fDoLocators);

        // Display quote!
        // TacticalCharacterDialogue( pSoldier, (UINT16)( QUOTE_SPOTTED_SOMETHING_ONE + Random( 2 ) ) );

        // ATE: Check now many things in pool.....
        if (!fDidMissingQuote) {
          if (pItemPool.value.pNext != NULL) {
            if (pItemPool.value.pNext.value.pNext != NULL) {
              fDoHumm = FALSE;

              TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, BATTLE_SOUND_COOL1, 500);
            }
          }

          if (fDoHumm) {
            TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, BATTLE_SOUND_HUMM, 500);
          }
        }
      } else {
        SetItemPoolVisibilityHidden(pItemPool);
      }
    } else {
      if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
        TacticalCharacterDialogueWithSpecialEvent(pSoldier, 0, DIALOGUE_SPECIAL_EVENT_DO_BATTLE_SND, BATTLE_SOUND_NOTHING, 500);
      }
    }
  }

  // Deduct points!
  // CalcInteractiveObjectAPs( sGridNo, pStructure, &sAPCost, &sBPCost );
  // DeductPoints( pSoldier, sAPCost, sBPCost );

  pNewStructure = SwapStructureForPartner(sGridNo, pStructure);
  if (pNewStructure != NULL) {
    RecompileLocalMovementCosts(sGridNo);
    SetRenderFlags(RENDER_FLAG_FULL);
    if (pNewStructure.value.fFlags & STRUCTURE_SWITCH) {
      // just turned a switch on!
      ActivateSwitchInGridNo(pSoldier.value.ubID, sGridNo);
    }
  }
}

function GetInteractiveTileCursor(uiOldCursor: UINT32, fConfirm: BOOLEAN): UINT32 {
  let pIntNode: Pointer<LEVELNODE>;
  let pStructure: Pointer<STRUCTURE>;
  let sGridNo: INT16;

  // OK, first see if we have an in tile...
  pIntNode = GetCurInteractiveTileGridNoAndStructure(addressof(sGridNo), addressof(pStructure));

  if (pIntNode != NULL && pStructure != NULL) {
    if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
      SetDoorString(sGridNo);

      if (fConfirm) {
        return OKHANDCURSOR_UICURSOR;
      } else {
        return NORMALHANDCURSOR_UICURSOR;
      }
    } else {
      if (pStructure.value.fFlags & STRUCTURE_SWITCH) {
        wcscpy(gzIntTileLocation, gzLateLocalizedString[25]);
        gfUIIntTileLocation = TRUE;
      }

      if (fConfirm) {
        return OKHANDCURSOR_UICURSOR;
      } else {
        return NORMALHANDCURSOR_UICURSOR;
      }
    }
  }

  return uiOldCursor;
}

function SetActionModeDoorCursorText(): void {
  let pIntNode: Pointer<LEVELNODE>;
  let pStructure: Pointer<STRUCTURE>;
  let sGridNo: INT16;

  // If we are over a merc, don't
  if (gfUIFullTargetFound) {
    return;
  }

  // OK, first see if we have an in tile...
  pIntNode = GetCurInteractiveTileGridNoAndStructure(addressof(sGridNo), addressof(pStructure));

  if (pIntNode != NULL && pStructure != NULL) {
    if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
      SetDoorString(sGridNo);
    }
  }
}

function GetLevelNodeScreenRect(pNode: Pointer<LEVELNODE>, pRect: Pointer<SGPRect>, sXPos: INT16, sYPos: INT16, sGridNo: INT16): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempX_S: INT16;
  let sTempY_S: INT16;
  let pTrav: Pointer<ETRLEObject>;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let TileElem: Pointer<TILE_ELEMENT>;

  // Get 'TRUE' merc position
  sOffsetX = sXPos - gsRenderCenterX;
  sOffsetY = sYPos - gsRenderCenterY;

  FromCellToScreenCoordinates(sOffsetX, sOffsetY, addressof(sTempX_S), addressof(sTempY_S));

  if (pNode.value.uiFlags & LEVELNODE_CACHEDANITILE) {
    pTrav = addressof(gpTileCache[pNode.value.pAniTile.value.sCachedTileID].pImagery.value.vo.value.pETRLEObject[pNode.value.pAniTile.value.sCurrentFrame]);
  } else {
    TileElem = addressof(gTileDatabase[pNode.value.usIndex]);

    // Adjust for current frames and animations....
    if (TileElem.value.uiFlags & ANIMATED_TILE) {
      Assert(TileElem.value.pAnimData != NULL);
      TileElem = addressof(gTileDatabase[TileElem.value.pAnimData.value.pusFrames[TileElem.value.pAnimData.value.bCurrentFrame]]);
    } else if ((pNode.value.uiFlags & LEVELNODE_ANIMATION)) {
      if (pNode.value.sCurrentFrame != -1) {
        Assert(TileElem.value.pAnimData != NULL);
        TileElem = addressof(gTileDatabase[TileElem.value.pAnimData.value.pusFrames[pNode.value.sCurrentFrame]]);
      }
    }

    pTrav = addressof(TileElem.value.hTileSurface.value.pETRLEObject[TileElem.value.usRegionIndex]);
  }

  sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sTempX_S;
  sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sTempY_S;

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

  usHeight = pTrav.value.usHeight;
  usWidth = pTrav.value.usWidth;

  // Add to start position of dest buffer
  sScreenX += (pTrav.value.sOffsetX - (WORLD_TILE_X / 2));
  sScreenY += (pTrav.value.sOffsetY - (WORLD_TILE_Y / 2));

  // Adjust y offset!
  sScreenY += (WORLD_TILE_Y / 2);

  pRect.value.iLeft = sScreenX;
  pRect.value.iTop = sScreenY;
  pRect.value.iBottom = sScreenY + usHeight;
  pRect.value.iRight = sScreenX + usWidth;
}

function CompileInteractiveTiles(): void {
}

function LogMouseOverInteractiveTile(sGridNo: INT16): void {
  let aRect: SGPRect;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let pNode: Pointer<LEVELNODE>;

  // OK, for now, don't allow any interactive tiles on higher interface level!
  if (gsInterfaceLevel > 0) {
    return;
  }

  // Also, don't allow for mercs who are on upper level...
  if (gusSelectedSoldier != NOBODY && MercPtrs[gusSelectedSoldier].value.bLevel == 1) {
    return;
  }

  // Get World XY From gridno
  ConvertGridNoToCellXY(sGridNo, addressof(sXMapPos), addressof(sYMapPos));

  // Set mouse stuff
  sScreenX = gusMouseXPos;
  sScreenY = gusMouseYPos;

  pNode = gpWorldLevelData[sGridNo].pStructHead;

  while (pNode != NULL) {
    {
      GetLevelNodeScreenRect(pNode, addressof(aRect), sXMapPos, sYMapPos, sGridNo);

      // Make sure we are always on guy if we are on same gridno
      if (IsPointInScreenRect(sScreenX, sScreenY, addressof(aRect))) {
        // OK refine it!
        if (RefinePointCollisionOnStruct(sGridNo, sScreenX, sScreenY, aRect.iLeft, aRect.iBottom, pNode)) {
          // Do some additional checks here!
          if (RefineLogicOnStruct(sGridNo, pNode)) {
            gCurIntTile.fFound = TRUE;

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

      pNode = pNode.value.pNext;
    }
  }
}

function InternalGetCurInteractiveTile(fRejectItemsOnTop: BOOLEAN): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = NULL;
  let pStructure: Pointer<STRUCTURE> = NULL;

  // OK, Look for our tile!

  // Check for shift down!
  if (_KeyDown(SHIFT)) {
    return NULL;
  }

  if (gfOverIntTile) {
    pNode = gpWorldLevelData[gCurIntTile.sGridNo].pStructHead;

    while (pNode != NULL) {
      if (pNode.value.usIndex == gCurIntTile.sTileIndex) {
        if (fRejectItemsOnTop) {
          // get strucuture here...
          if (gCurIntTile.fStructure) {
            pStructure = FindStructureByID(gCurIntTile.sGridNo, gCurIntTile.usStructureID);
            if (pStructure != NULL) {
              if (pStructure.value.fFlags & STRUCTURE_HASITEMONTOP) {
                return NULL;
              }
            } else {
              return NULL;
            }
          }
        }

        return pNode;
      }

      pNode = pNode.value.pNext;
    }
  }

  return NULL;
}

function GetCurInteractiveTile(): Pointer<LEVELNODE> {
  return InternalGetCurInteractiveTile(TRUE);
}

function GetCurInteractiveTileGridNo(psGridNo: Pointer<INT16>): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE>;

  pNode = GetCurInteractiveTile();

  if (pNode != NULL) {
    *psGridNo = gCurIntTile.sGridNo;
  } else {
    *psGridNo = NOWHERE;
  }

  return pNode;
}

function ConditionalGetCurInteractiveTileGridNoAndStructure(psGridNo: Pointer<INT16>, ppStructure: Pointer<Pointer<STRUCTURE>>, fRejectOnTopItems: BOOLEAN): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE>;
  let pStructure: Pointer<STRUCTURE>;

  *ppStructure = NULL;

  pNode = InternalGetCurInteractiveTile(fRejectOnTopItems);

  if (pNode != NULL) {
    *psGridNo = gCurIntTile.sGridNo;
  } else {
    *psGridNo = NOWHERE;
  }

  if (pNode != NULL) {
    if (gCurIntTile.fStructure) {
      pStructure = FindStructureByID(gCurIntTile.sGridNo, gCurIntTile.usStructureID);
      if (pStructure == NULL) {
        *ppStructure = NULL;
        return NULL;
      } else {
        *ppStructure = pStructure;
      }
    }
  }

  return pNode;
}

function GetCurInteractiveTileGridNoAndStructure(psGridNo: Pointer<INT16>, ppStructure: Pointer<Pointer<STRUCTURE>>): Pointer<LEVELNODE> {
  return ConditionalGetCurInteractiveTileGridNoAndStructure(psGridNo, ppStructure, TRUE);
}

function BeginCurInteractiveTileCheck(bCheckFlags: UINT8): void {
  gfOverIntTile = FALSE;

  // OK, release our stack, stuff could be different!
  gfCycleIntTile = FALSE;

  // Reset some highest values
  gCurIntTile.sHeighestScreenY = 0;
  gCurIntTile.fFound = FALSE;
  gCurIntTile.ubFlags = bCheckFlags;

  // Reset stack values
  gCurIntTileStack.bNum = 0;
}

function EndCurInteractiveTileCheck(): void {
  let pCurIntTile: Pointer<CUR_INTERACTIVE_TILE>;

  if (gCurIntTile.fFound) {
    // Set our currently cycled guy.....
    if (gfCycleIntTile) {
      // OK, we're over this cycled node
      pCurIntTile = addressof(gCurIntTileStack.bTiles[gCurIntTileStack.bCur]);
    } else {
      // OK, we're over this levelnode,
      pCurIntTile = addressof(gCurIntTile);
    }

    gCurIntTile.sGridNo = pCurIntTile.value.sFoundGridNo;
    gCurIntTile.sTileIndex = pCurIntTile.value.pFoundNode.value.usIndex;

    if (pCurIntTile.value.pFoundNode.value.pStructureData != NULL) {
      gCurIntTile.usStructureID = pCurIntTile.value.pFoundNode.value.pStructureData.value.usStructureID;
      gCurIntTile.fStructure = TRUE;
    } else {
      gCurIntTile.fStructure = FALSE;
    }

    gfOverIntTile = TRUE;
  } else {
    // If we are in cycle mode, end it
    if (gfCycleIntTile) {
      gfCycleIntTile = FALSE;
    }
  }
}

function RefineLogicOnStruct(sGridNo: INT16, pNode: Pointer<LEVELNODE>): BOOLEAN {
  let TileElem: Pointer<TILE_ELEMENT>;
  let pStructure: Pointer<STRUCTURE>;

  if (pNode.value.uiFlags & LEVELNODE_CACHEDANITILE) {
    return FALSE;
  }

  TileElem = addressof(gTileDatabase[pNode.value.usIndex]);

  if (gCurIntTile.ubFlags == INTILE_CHECK_SELECTIVE) {
    // See if we are on an interactable tile!
    // Try and get struct data from levelnode pointer
    pStructure = pNode.value.pStructureData;

    // If no data, quit
    if (pStructure == NULL) {
      return FALSE;
    }

    if (!(pStructure.value.fFlags & (STRUCTURE_OPENABLE | STRUCTURE_HASITEMONTOP))) {
      return FALSE;
    }

    if (gusSelectedSoldier != NOBODY && MercPtrs[gusSelectedSoldier].value.ubBodyType == ROBOTNOWEAPON) {
      return FALSE;
    }

    // If we are a door, we need a different definition of being visible than other structs
    if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
      if (!IsDoorVisibleAtGridNo(sGridNo)) {
        return FALSE;
      }

      // OK, For a OPENED door, addition requirements are: need to be in 'HAND CURSOR' mode...
      if (pStructure.value.fFlags & STRUCTURE_OPEN) {
        // Are we in hand cursor mode?
        if (gCurrentUIMode != HANDCURSOR_MODE && gCurrentUIMode != ACTION_MODE) {
          return FALSE;
        }
      }

      // If this option is on...
      if (!gGameSettings.fOptions[TOPTION_SNAP_CURSOR_TO_DOOR]) {
        if (gCurrentUIMode != HANDCURSOR_MODE) {
          return FALSE;
        }
      }
    } else {
      // IF we are a switch, reject in another direction...
      if (pStructure.value.fFlags & STRUCTURE_SWITCH) {
        // Find a new gridno based on switch's orientation...
        let sNewGridNo: INT16 = NOWHERE;

        switch (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubWallOrientation) {
          case OUTSIDE_TOP_LEFT:
          case INSIDE_TOP_LEFT:

            // Move south...
            sNewGridNo = NewGridNo(sGridNo, DirectionInc(SOUTH));
            break;

          case OUTSIDE_TOP_RIGHT:
          case INSIDE_TOP_RIGHT:

            // Move east...
            sNewGridNo = NewGridNo(sGridNo, DirectionInc(EAST));
            break;
        }

        if (sNewGridNo != NOWHERE) {
          // If we are hidden by a roof, reject it!
          if (!gfBasement && IsRoofVisible2(sNewGridNo) && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
            return FALSE;
          }
        }
      } else {
        // If we are hidden by a roof, reject it!
        if (!gfBasement && IsRoofVisible(sGridNo) && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
          return FALSE;
        }
      }
    }

    // Check if it's a hidden struct and we have not revealed anything!
    if (TileElem.value.uiFlags & HIDDEN_TILE) {
      if (!IsHiddenStructureVisible(sGridNo, pNode.value.usIndex)) {
        // Return false
        return FALSE;
      }
    }
  }

  return TRUE;
}

function RefinePointCollisionOnStruct(sGridNo: INT16, sTestX: INT16, sTestY: INT16, sSrcX: INT16, sSrcY: INT16, pNode: Pointer<LEVELNODE>): BOOLEAN {
  let TileElem: Pointer<TILE_ELEMENT>;

  if (pNode.value.uiFlags & LEVELNODE_CACHEDANITILE) {
    // Check it!
    return CheckVideoObjectScreenCoordinateInData(gpTileCache[pNode.value.pAniTile.value.sCachedTileID].pImagery.value.vo, pNode.value.pAniTile.value.sCurrentFrame, (sTestX - sSrcX), (-1 * (sTestY - sSrcY)));
  } else {
    TileElem = addressof(gTileDatabase[pNode.value.usIndex]);

    // Adjust for current frames and animations....
    if (TileElem.value.uiFlags & ANIMATED_TILE) {
      Assert(TileElem.value.pAnimData != NULL);
      TileElem = addressof(gTileDatabase[TileElem.value.pAnimData.value.pusFrames[TileElem.value.pAnimData.value.bCurrentFrame]]);
    } else if ((pNode.value.uiFlags & LEVELNODE_ANIMATION)) {
      if (pNode.value.sCurrentFrame != -1) {
        Assert(TileElem.value.pAnimData != NULL);
        TileElem = addressof(gTileDatabase[TileElem.value.pAnimData.value.pusFrames[pNode.value.sCurrentFrame]]);
      }
    }

    // Check it!
    return CheckVideoObjectScreenCoordinateInData(TileElem.value.hTileSurface, TileElem.value.usRegionIndex, (sTestX - sSrcX), (-1 * (sTestY - sSrcY)));
  }
}

// This function will check the video object at SrcX and SrcY for the lack of transparency
// will return true if data found, else false
function CheckVideoObjectScreenCoordinateInData(hSrcVObject: HVOBJECT, usIndex: UINT16, iTestX: INT32, iTestY: INT32): BOOLEAN {
  let uiOffset: UINT32;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let SrcPtr: Pointer<UINT8>;
  let LineSkip: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let fDataFound: BOOLEAN = FALSE;
  let iTestPos: INT32;
  let iStartPos: INT32;

  // Assertions
  Assert(hSrcVObject != NULL);

  // Get Offsets from Index into structure
  pTrav = addressof(hSrcVObject.value.pETRLEObject[usIndex]);
  usHeight = pTrav.value.usHeight;
  usWidth = pTrav.value.usWidth;
  uiOffset = pTrav.value.uiDataOffset;

  // Calculate test position we are looking for!
  // Calculate from 0, 0 at top left!
  iTestPos = ((usHeight - iTestY) * usWidth) + iTestX;
  iStartPos = 0;
  LineSkip = usWidth;

  SrcPtr = hSrcVObject.value.pPixData + uiOffset;

  __asm {
    mov esi, SrcPtr
    mov edi, iStartPos
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx

    BlitDispatch:

    mov cl, [esi]
    inc esi
    or cl, cl
    js BlitTransparent
    jz BlitDoneLine

    // BlitNonTransLoop:

    clc
    rcr cl, 1
    jnc BlitNTL2

    inc esi

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    BlitNTL2:
    clc
    rcr cl, 1
    jnc BlitNTL3

    add esi, 2

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    BlitNTL3:

    or cl, cl
    jz BlitDispatch

    xor ebx, ebx

    BlitNTL4:

    add esi, 4

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    // Check
    cmp edi, iTestPos
    je BlitFound
    add edi, 1

    dec cl
    jnz BlitNTL4

    jmp BlitDispatch

    BlitTransparent:

    and ecx, 07fH
    // shl ecx, 1
    add edi, ecx
    jmp BlitDispatch

    BlitDoneLine:

    // Here check if we have passed!
    cmp edi, iTestPos
    jge BlitDone

    dec usHeight
    jz BlitDone
    // add edi, LineSkip
    jmp BlitDispatch

    BlitFound:

    mov fDataFound, 1

    BlitDone:
  }

  return fDataFound;
}

function ShouldCheckForMouseDetections(): BOOLEAN {
  let fOK: BOOLEAN = FALSE;

  if (gsINTOldRenderCenterX != gsRenderCenterX || gsINTOldRenderCenterY != gsRenderCenterY || gusINTOldMousePosX != gusMouseXPos || gusINTOldMousePosY != gusMouseYPos) {
    fOK = TRUE;
  }

  // Set old values
  gsINTOldRenderCenterX = gsRenderCenterX;
  gsINTOldRenderCenterY = gsRenderCenterY;

  gusINTOldMousePosX = gusMouseXPos;
  gusINTOldMousePosY = gusMouseYPos;

  return fOK;
}

function CycleIntTileFindStack(usMapPos: UINT16): void {
  gfCycleIntTile = TRUE;

  // Cycle around!
  gCurIntTileStack.bCur++;

  // PLot new movement
  gfPlotNewMovement = TRUE;

  if (gCurIntTileStack.bCur == gCurIntTileStack.bNum) {
    gCurIntTileStack.bCur = 0;
  }
}
