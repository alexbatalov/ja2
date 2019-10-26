/* view directions */
const DLEFT = 0;
const DRIGHT = 1;
const UP = 2;
const LEFT = 3;
const RIGHT = 4;
const NOVIEW = 5;
const MAXVIEWPATHS = 17;
const VIEWPATHLENGTH = 13;

let gubGridNoMarkers: UINT8[] /* [WORLD_MAX] */;
let gubGridNoValue: UINT8 = 254;

let ViewPath: UINT8[][] /* [MAXVIEWPATHS][VIEWPATHLENGTH] */ = [
  [ NOVIEW, UP, UP, UP, UP, UP, UP, UP, UP, UP, UP, UP, UP ],
  [ UP, UP, UP, UP, DRIGHT, UP, UP, UP, UP, UP, UP, UP, UP ],
  [ UP, UP, UP, UP, DLEFT, UP, UP, UP, UP, UP, UP, UP, UP ],

  [ UP, UP, DLEFT, UP, DLEFT, UP, UP, UP, UP, UP, UP, UP, UP ],
  [ UP, UP, DRIGHT, UP, DRIGHT, UP, UP, UP, UP, UP, UP, UP, UP ],

  [ UP, UP, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP, UP, UP ],
  [ UP, UP, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP, UP, UP ],

  [ UP, RIGHT, UP, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP, UP ],
  [ UP, LEFT, UP, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP, UP ],

  [ DLEFT, DLEFT, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP, UP, UP ],
  [ DRIGHT, DRIGHT, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP, UP, UP ],

  [ RIGHT, DRIGHT, DRIGHT, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP, UP ],
  [ LEFT, DLEFT, DLEFT, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP, UP ],

  [ DLEFT, LEFT, LEFT, UP, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ LEFT, LEFT, LEFT, UP, LEFT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],

  [ DRIGHT, RIGHT, RIGHT, UP, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ RIGHT, RIGHT, RIGHT, UP, RIGHT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
];

let ViewPath2: UINT8[][] /* [MAXVIEWPATHS][VIEWPATHLENGTH] */ = [
  [ NOVIEW, UP, UP, UP, UP, UP, UP, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ UP, UP, DLEFT, UP, UP, UP, DLEFT, DRIGHT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ UP, UP, DLEFT, UP, UP, UP, DRIGHT, DLEFT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],

  [ UP, UP, DLEFT, UP, UP, DLEFT, DLEFT, UP, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ UP, UP, DRIGHT, UP, UP, DRIGHT, DRIGHT, UP, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],

  [ UP, DLEFT, UP, UP, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP ],
  [ UP, DRIGHT, UP, UP, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP ],

  [ DLEFT, DLEFT, UP, UP, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP ],
  [ DRIGHT, DRIGHT, UP, UP, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP ],

  [ DLEFT, DLEFT, UP, DLEFT, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP ],
  [ DRIGHT, DRIGHT, UP, DRIGHT, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP ],

  [ DLEFT, DLEFT, DLEFT, DLEFT, DLEFT, DLEFT, DLEFT, UP, UP, UP, UP, UP, UP ],
  [ DRIGHT, DRIGHT, DRIGHT, DRIGHT, DRIGHT, DRIGHT, DRIGHT, UP, UP, UP, UP, UP, UP ],

  [ DLEFT, LEFT, DLEFT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ DRIGHT, RIGHT, DRIGHT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],

  [ LEFT, LEFT, DLEFT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
  [ RIGHT, RIGHT, DRIGHT, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW, NOVIEW ],
];

function BuildSightDir(dir: UINT32, One: Pointer<UINT32>, Two: Pointer<UINT32>, Three: Pointer<UINT32>, Four: Pointer<UINT32>, Five: Pointer<UINT32>): void {
  switch (dir) {
    case Enum245.NORTH:
      One.value = Enum245.NORTHWEST;
      Two.value = Enum245.NORTHEAST;
      Three.value = Enum245.NORTH;
      Four.value = Enum245.WEST;
      Five.value = Enum245.EAST;
      break;
    case Enum245.NORTHEAST:
      One.value = Enum245.NORTH;
      Two.value = Enum245.EAST;
      Three.value = Enum245.NORTHEAST;
      Four.value = Enum245.NORTHWEST;
      Five.value = Enum245.SOUTHEAST;
      break;
    case Enum245.EAST:
      One.value = Enum245.NORTHEAST;
      Two.value = Enum245.SOUTHEAST;
      Three.value = Enum245.EAST;
      Four.value = Enum245.NORTH;
      Five.value = Enum245.SOUTH;
      break;
    case Enum245.SOUTHEAST:
      One.value = Enum245.EAST;
      Two.value = Enum245.SOUTH;
      Three.value = Enum245.SOUTHEAST;
      Four.value = Enum245.NORTHEAST;
      Five.value = Enum245.SOUTHWEST;
      break;
    case Enum245.SOUTH:
      One.value = Enum245.SOUTHEAST;
      Two.value = Enum245.SOUTHWEST;
      Three.value = Enum245.SOUTH;
      Four.value = Enum245.EAST;
      Five.value = Enum245.WEST;
      break;
    case Enum245.SOUTHWEST:
      One.value = Enum245.SOUTH;
      Two.value = Enum245.WEST;
      Three.value = Enum245.SOUTHWEST;
      Four.value = Enum245.SOUTHEAST;
      Five.value = Enum245.NORTHWEST;
      break;
    case Enum245.WEST:
      One.value = Enum245.SOUTHWEST;
      Two.value = Enum245.NORTHWEST;
      Three.value = Enum245.WEST;
      Four.value = Enum245.SOUTH;
      Five.value = Enum245.NORTH;
      break;
    case Enum245.NORTHWEST:
      One.value = Enum245.WEST;
      Two.value = Enum245.NORTH;
      Three.value = Enum245.NORTHWEST;
      Four.value = Enum245.SOUTHWEST;
      Five.value = Enum245.NORTHEAST;
      break;
  }
}

//#if 0

const NUM_SLANT_ROOF_SLOTS = 200;

interface SLANT_ROOF_FOV_TYPE {
  sGridNo: INT16;
  fAllocated: boolean;
}

let gSlantRoofData: SLANT_ROOF_FOV_TYPE[] /* [NUM_SLANT_ROOF_SLOTS] */;
let guiNumSlantRoofs: UINT32 = 0;

function GetFreeSlantRoof(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumSlantRoofs; uiCount++) {
    if ((gSlantRoofData[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumSlantRoofs < NUM_SLANT_ROOF_SLOTS)
    return guiNumSlantRoofs++;

  return -1;
}

function RecountSlantRoofs(): void {
  let uiCount: INT32;

  for (uiCount = guiNumSlantRoofs - 1; (uiCount >= 0); uiCount--) {
    if ((gSlantRoofData[uiCount].fAllocated)) {
      guiNumSlantRoofs = (uiCount + 1);
      break;
    }
  }
}

export function ClearSlantRoofs(): void {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumSlantRoofs; uiCount++) {
    if ((gSlantRoofData[uiCount].fAllocated)) {
      gSlantRoofData[uiCount].fAllocated = false;
    }
  }

  guiNumSlantRoofs = 0;
}

function FindSlantRoofSlot(sGridNo: INT16): boolean {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumSlantRoofs; uiCount++) {
    if ((gSlantRoofData[uiCount].fAllocated)) {
      if (gSlantRoofData[uiCount].sGridNo == sGridNo) {
        return true;
      }
    }
  }

  return false;
}

export function AddSlantRoofFOVSlot(sGridNo: INT16): void {
  let iSlantRoofSlot: INT32;
  let pSlantRoof: Pointer<SLANT_ROOF_FOV_TYPE>;

  // Check if this is a duplicate!
  if (FindSlantRoofSlot(sGridNo)) {
    return;
  }

  iSlantRoofSlot = GetFreeSlantRoof();

  if (iSlantRoofSlot != -1) {
    pSlantRoof = addressof(gSlantRoofData[iSlantRoofSlot]);
    pSlantRoof.value.sGridNo = sGridNo;
    pSlantRoof.value.fAllocated = true;
  }
}

export function ExamineSlantRoofFOVSlots(): void {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumSlantRoofs; uiCount++) {
    if ((gSlantRoofData[uiCount].fAllocated)) {
      ExamineGridNoForSlantRoofExtraGraphic(gSlantRoofData[uiCount].sGridNo);
    }
  }

  ClearSlantRoofs();
}

export function RevealRoofsAndItems(pSoldier: Pointer<SOLDIERTYPE>, itemsToo: UINT32, fShowLocators: boolean, ubLevel: UINT8, fForce: boolean): void {
  let maincnt: UINT32;
  let markercnt: UINT32;
  let marker: UINT32;
  let tilesLeftToSee: UINT32;
  let cnt: UINT32;
  let prevmarker: UINT32;
  let Inc: INT32[] /* [6] */;
  let Dir: INT32[] /* [6] */;
  let itemVisible: INT8 = false;
  let Blocking: INT8;
  let twoMoreTiles: INT8;
  let markerDir: INT8;
  let nextDir: INT8 = 0;
  let AlreadySawItem: INT8 = false;
  let who: UINT8; //,itemIndex; // for each square checked
  let dir: UINT8;
  let range: UINT8;
  let Path2: UINT8;
  let ubRoomNo: UINT8;
  let fCheckForRooms: boolean = false;
  let pItemPool: Pointer<ITEM_POOL>;
  let fHiddenStructVisible: boolean;
  let ubMovementCost: UINT8;
  let fTravelCostObs: boolean;
  let fGoneThroughDoor: boolean = false;
  let fThroughWindow: boolean = false;
  let fItemsQuoteSaid: boolean = false;
  let usIndex: UINT16;
  let fRevealItems: boolean = true;
  let fStopRevealingItemsAfterThisTile: boolean = false;
  let bTallestStructureHeight: INT8;
  let iDoorGridNo: INT32;
  let pStructure: Pointer<STRUCTURE>;
  let pDummy: Pointer<STRUCTURE>;
  let bStructHeight: INT8;
  let bThroughWindowDirection: INT8;

  if (pSoldier.value.uiStatusFlags & SOLDIER_ENEMY) {
    // pSoldier->needToLookForItems = FALSE;
    return;
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  // Return if this guy has no gridno, has bad life, etc
  if (pSoldier.value.sGridNo == NOWHERE || !pSoldier.value.bInSector || pSoldier.value.bLife < OKLIFE) {
    return;
  }

  if (pSoldier.value.bBlindedCounter > 0) {
    return;
  }

  gubGridNoValue++;

  if (gubGridNoValue == 255) {
    // Reset!
    memset(gubGridNoMarkers, 0, sizeof(gubGridNoMarkers));
    gubGridNoValue = 1;
  }

  // OK, look for doors
  MercLooksForDoors(pSoldier, true);

  who = pSoldier.value.ubID;
  dir = pSoldier.value.bDirection;

  // NumMessage("good old reveal",dir);

  // a gassed merc can only see 1 tile away due to blurred vision
  if (pSoldier.value.uiStatusFlags & SOLDIER_GASSED) {
    range = 1;
  } else {
    range = pSoldier.value.bViewRange;
    // balance item viewing range between normal and the limit set by opplist-type functions -- CJC
    range = (AdjustMaxSightRangeForEnvEffects(pSoldier, LightTrueLevel(pSoldier.value.sGridNo, pSoldier.value.bLevel), range) + range) / 2;
  }

  BuildSightDir(dir, addressof(Dir[0]), addressof(Dir[1]), addressof(Dir[2]), addressof(Dir[3]), addressof(Dir[4]));
  for (cnt = 0; cnt < 5; cnt++)
    Inc[cnt] = DirectionInc(Dir[cnt]);

  // create gridno increment for NOVIEW - in other words, no increment!
  Inc[5] = 0;
  Dir[5] = pSoldier.value.bDirection;

  if (dir % 2 == 1) /* even numbers use ViewPath2 */
    Path2 = true;
  else
    Path2 = false;

  // ATE: if in this special cercumstance... our guys are moving on their own...
  // Stop sighting items
  // IN the future, we may want to do something else here...

  if (gTacticalStatus.uiFlags & OUR_MERCS_AUTO_MOVE) {
    itemsToo = false;
  }

  for (maincnt = 0; maincnt < MAXVIEWPATHS; maincnt++) {
    marker = pSoldier.value.sGridNo;
    Blocking = false;
    twoMoreTiles = false;
    tilesLeftToSee = 99;
    fRevealItems = true;
    fStopRevealingItemsAfterThisTile = false;

    for (markercnt = 0; markercnt < range; markercnt++) {
      // fGoneThroughDoor = FALSE;
      // fThroughWindow		= FALSE;

      prevmarker = marker;

      nextDir = 99;
      fCheckForRooms = false;
      fTravelCostObs = false;
      if (fStopRevealingItemsAfterThisTile) {
        fRevealItems = false;
        fStopRevealingItemsAfterThisTile = false;
      }

      if (Path2) {
        markerDir = ViewPath2[maincnt][markercnt];
        if (markercnt < 12)
          nextDir = ViewPath2[maincnt][markercnt + 1];
      } else {
        markerDir = ViewPath[maincnt][markercnt];
        if (markercnt < 12)
          nextDir = ViewPath[maincnt][markercnt + 1];
      }

      // OK, check flags for going through door/window last tile
      if (fThroughWindow == 1) {
        // ATE: Make sure we are going through the same direction!
        // THis is to solve the drassen SAM problem with seeing through walls
        if (Dir[markerDir] == bThroughWindowDirection) {
          fThroughWindow = 2;
        } else {
          fThroughWindow = 0;
        }
      } else if (fThroughWindow == 2) {
        // We've overstayed our welcome - remove!
        fThroughWindow = 0;
      }

      if (fGoneThroughDoor == 1) {
        fGoneThroughDoor = 2;
      } else if (fGoneThroughDoor == 2) {
        // We've overstayed our welcome - remove!
        fGoneThroughDoor = 0;
      }

      // ATE CHECK FOR NOVIEW!
      if (nextDir == NOVIEW) {
        nextDir = 99;
      }

      marker = NewGridNo(marker, Inc[markerDir]);

      if (marker == 12426) {
        let i: int = 0;
      }

      // End if this is a no view...
      if (markerDir == NOVIEW && markercnt != 0) {
        break;
      }

      // Check if we can get to this gridno from our direction in
      ubMovementCost = gubWorldMovementCosts[marker][Dir[markerDir]][ubLevel];

      // ATE: Added: If our current sector is below ground, ignore any blocks!
      if (gfCaves && ubMovementCost != TRAVELCOST_CAVEWALL) {
        ubMovementCost = TRAVELCOST_FLAT;
      }

      if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
        ubMovementCost = DoorTravelCost(pSoldier, marker, ubMovementCost, (pSoldier.value.bTeam == gbPlayerNum), addressof(iDoorGridNo));
        pStructure = FindStructure(iDoorGridNo, STRUCTURE_ANYDOOR);
        if (pStructure != null && pStructure.value.fFlags & STRUCTURE_TRANSPARENT) {
          // cell door or somehow otherwise transparent; allow merc to see through
          ubMovementCost = TRAVELCOST_FLAT;
        }
      }

      // If we have hit an obstacle, STOP HERE
      if (ubMovementCost >= TRAVELCOST_BLOCKED) {
        // We have an obstacle here...

        // If it is bigger than a breadbox... err... taller than a man...
        // Then stop path altogether
        // otherwise just stop revealing items

        // CJC:  only do this when the direction is horizontal; easier and faster to check
        // and the effect should still be good enough

        if (ubMovementCost == TRAVELCOST_WALL || ubMovementCost == TRAVELCOST_DOOR || ubMovementCost == TRAVELCOST_EXITGRID) {
          fTravelCostObs = true;
          fRevealItems = false;
        } else {
          // walls are handled above, so the blocking object is guaranteed not to be a wall
          bTallestStructureHeight = GetTallestStructureHeight(marker, false);
          if (bTallestStructureHeight >= 3) {
            fTravelCostObs = true;
            fStopRevealingItemsAfterThisTile = true;
          } else if (bTallestStructureHeight != 0) {
            // stop revealing items after this tile but keep going
            fStopRevealingItemsAfterThisTile = true;
          }
        }

        if ((Dir[markerDir] % 2) == 1) {
          // diagonal
          fTravelCostObs = true;
          // cheap hack... don't reveal items
          fRevealItems = false;
        } else {
          bTallestStructureHeight = GetTallestStructureHeight(marker, false);
          if (bTallestStructureHeight >= 3) {
            fTravelCostObs = true;
            fStopRevealingItemsAfterThisTile = true;
          } else if (bTallestStructureHeight != 0) {
            // stop revealing items after this tile but keep going
            fStopRevealingItemsAfterThisTile = true;
          }
        }
      }

      // Check if it's been done already!
      if (gubGridNoMarkers[marker] != gubGridNoValue) {
        // Mark gridno
        gubGridNoMarkers[marker] = gubGridNoValue;

        // check and see if the gridno changed
        // if the gridno is the same, avoid redundancy and break
        if (marker == prevmarker && markercnt != 0) {
        } else // it changed
        {
          // Skip others if we have gone through a door but are too far away....
          if (fGoneThroughDoor) {
            if (markercnt > 5) // Are we near the door?
            {
              break;
            }
          }
          // DO MINE FINDING STUFF
          // GET INDEX FOR ITEM HERE
          // if there IS a direction after this one, nextdir WILL NOT be 99
          if (nextDir != 99) {
            Blocking = GetBlockingStructureInfo(marker, Dir[markerDir], Dir[nextDir], ubLevel, addressof(bStructHeight), addressof(pDummy), false);
          } else // no "next" direction, so pass in a NOWHERE so that
          // "SpecialViewObstruction" will know not to take it UINT32o consideration
          {
            Blocking = GetBlockingStructureInfo(marker, Dir[markerDir], 30, ubLevel, addressof(bStructHeight), addressof(pDummy), false);
          }

          if (gfCaves) {
            Blocking = NOTHING_BLOCKING;
          }

          // CHECK FOR ROOMS
          if (Blocking == BLOCKING_TOPLEFT_WINDOW || Blocking == BLOCKING_TOPLEFT_OPEN_WINDOW) {
            // CHECK FACING DIRECTION!
            if (Dir[markerDir] == Enum245.NORTH || Dir[markerDir] == Enum245.SOUTH) {
              if (markercnt <= 1) // Are we right beside it?
              {
                fThroughWindow = true;
                bThroughWindowDirection = Dir[markerDir];
              }
            }
          }
          if (Blocking == BLOCKING_TOPRIGHT_WINDOW || Blocking == BLOCKING_TOPRIGHT_OPEN_WINDOW) {
            // CHECK FACING DIRECTION!
            if (Dir[markerDir] == Enum245.EAST || Dir[markerDir] == Enum245.WEST) {
              if (markercnt <= 1) // Are we right beside it?
              {
                fThroughWindow = true;
                bThroughWindowDirection = Dir[markerDir];
              }
            }
          }

          if (Blocking == BLOCKING_TOPLEFT_DOOR) {
            fGoneThroughDoor = true;
          }
          if (Blocking == BLOCKING_TOPRIGHT_DOOR) {
            fGoneThroughDoor = true;
          }

          // ATE: If we hit this tile, find item always!
          // if (Blocking < FULL_BLOCKING )
          {
            // Handle special things for our mercs, like uncovering roofs
            // and revealing objects...
            // gpSoldier->shad |= SEENBIT;

            // itemVisible = ObjList[itemIndex].visible;

            // NOTE: don't allow object viewing if gassed XXX

            if (itemsToo && fRevealItems) // && itemIndex < MAXOBJECTLIST)
            {
              // OK, look for corpses...
              LookForAndMayCommentOnSeeingCorpse(pSoldier, marker, ubLevel);

              if (GetItemPool(marker, addressof(pItemPool), ubLevel)) {
                itemVisible = pItemPool.value.bVisible;

                if (SetItemPoolVisibilityOn(pItemPool, INVISIBLE, fShowLocators)) {
                  SetRenderFlags(RENDER_FLAG_FULL);

                  if (fShowLocators) {
                    // Set makred render flags
                    // gpWorldLevelData[marker].uiFlags|=MAPELEMENT_REDRAW;
                    // gpWorldLevelData[gusCurMousePos].pTopmostHead->uiFlags |= LEVELNODE_DYNAMIC;

                    // SetRenderFlags(RENDER_FLAG_MARKED);
                    SetRenderFlags(RENDER_FLAG_FULL);

                    // Hault soldier
                    // ATE: Only if in combat...
                    if (gTacticalStatus.uiFlags & INCOMBAT) {
                      HaultSoldierFromSighting(pSoldier, false);
                    } else {
                      // ATE: Make sure we show locators...
                      gTacticalStatus.fLockItemLocators = false;
                    }

                    if (!fItemsQuoteSaid && gTacticalStatus.fLockItemLocators == false) {
                      gTacticalStatus.fLockItemLocators = true;

                      if (gTacticalStatus.ubAttackBusyCount > 0 && (gTacticalStatus.uiFlags & INCOMBAT)) {
                        gTacticalStatus.fItemsSeenOnAttack = true;
                        gTacticalStatus.ubItemsSeenOnAttackSoldier = pSoldier.value.ubID;
                        gTacticalStatus.usItemsSeenOnAttackGridNo = (marker);
                      } else {
                        // Display quote!
                        if (!AM_AN_EPC(pSoldier)) {
                          TacticalCharacterDialogueWithSpecialEvent(pSoldier, (Enum202.QUOTE_SPOTTED_SOMETHING_ONE + Random(2)), DIALOGUE_SPECIAL_EVENT_SIGNAL_ITEM_LOCATOR_START, (marker), 0);
                        } else {
                          // Turn off item lock for locators...
                          gTacticalStatus.fLockItemLocators = false;
                          // Slide to location!
                          SlideToLocation(0, (marker));
                        }
                      }
                      fItemsQuoteSaid = true;
                    }
                  }
                }
              }
            }

            // if blood here, let the user see it now...
            // if (ExtGrid[marker].patrolInfo < MAXBLOOD)
            //		gpSoldier->blood = ExtGrid[marker].patrolInfo;

            // DoRoofs(marker,gpSoldier);

            tilesLeftToSee--;
          }

          // CHECK FOR HIDDEN STRUCTS
          // IF we had a hidden struct here that is not visible ( which will still be true because
          // we set it revealed below...
          if (DoesGridnoContainHiddenStruct(marker, addressof(fHiddenStructVisible))) {
            if (!fHiddenStructVisible) {
              gpWorldLevelData[marker].uiFlags |= MAPELEMENT_REDRAW;
              SetRenderFlags(RENDER_FLAG_MARKED);
              RecompileLocalMovementCosts(marker);
            }
          }

          if (tilesLeftToSee <= 0)
            break;

          if (Blocking == FULL_BLOCKING || (fTravelCostObs && !fThroughWindow)) {
            break;
          }

          // if ( Blocking == NOTHING_BLOCKING || Blocking == BLOCKING_NEXT_TILE )
          if (Blocking == NOTHING_BLOCKING) {
            fCheckForRooms = true;
          }

          if (ubLevel != 0) {
            fCheckForRooms = false;
          }

          // CHECK FOR SLANT ROOF!
          {
            let pStructure: Pointer<STRUCTURE>;
            let pBase: Pointer<STRUCTURE>;

            pStructure = FindStructure(marker, STRUCTURE_SLANTED_ROOF);

            if (pStructure != null) {
              pBase = FindBaseStructure(pStructure);

              // ADD TO SLANTED ROOF LIST!
              AddSlantRoofFOVSlot(marker);
            }
          }

          // Set gridno as revealed
          if (ubLevel == FIRST_LEVEL) {
            if (gfBasement || gfCaves) {
              // OK, if we are underground, we don't want to reveal stuff if
              // 1 ) there is a roof over us and
              // 2 ) we are not in a room
              if (gubWorldRoomInfo[marker] == NO_ROOM && TypeRangeExistsInRoofLayer(marker, Enum313.FIRSTROOF, Enum313.FOURTHROOF, addressof(usIndex))) {
                let i: int = 0;
              } else {
                gpWorldLevelData[marker].uiFlags |= MAPELEMENT_REVEALED;
                if (gfCaves) {
                  RemoveFogFromGridNo(marker);
                }
              }
            } else {
              gpWorldLevelData[marker].uiFlags |= MAPELEMENT_REVEALED;
            }

            // CHECK FOR ROOMS
            // if ( fCheckForRooms )
            {
              if (InAHiddenRoom(marker, addressof(ubRoomNo))) {
                RemoveRoomRoof(marker, ubRoomNo, pSoldier);
                if (ubRoomNo == ROOM_SURROUNDING_BOXING_RING && gWorldSectorX == BOXING_SECTOR_X && gWorldSectorY == BOXING_SECTOR_Y && gbWorldSectorZ == BOXING_SECTOR_Z) {
                  // reveal boxing ring at same time
                  RemoveRoomRoof(marker, BOXING_RING, pSoldier);
                }
              }
            }
          } else {
            gpWorldLevelData[marker].uiFlags |= MAPELEMENT_REVEALED_ROOF;
          }

          // Check for blood....
          UpdateBloodGraphics(marker, ubLevel);

          if (Blocking != NOTHING_BLOCKING && Blocking != BLOCKING_TOPLEFT_DOOR && Blocking != BLOCKING_TOPRIGHT_DOOR && Blocking != BLOCKING_TOPLEFT_WINDOW && Blocking != BLOCKING_TOPRIGHT_WINDOW && Blocking != BLOCKING_TOPRIGHT_OPEN_WINDOW && Blocking != BLOCKING_TOPLEFT_OPEN_WINDOW) {
            break;
          }

          // gpWorldLevelData[ marker ].uiFlags |= MAPELEMENT_SHADELAND;
        }
      } // End of duplicate check
      else {
        if (fTravelCostObs) {
          break;
        }
      }
    } // end of one path
  } // end of path loop

  // Loop through all availible slant roofs we collected and perform cool stuff on them
  ExamineSlantRoofFOVSlots();

  // pSoldier->needToLookForItems = FALSE;

  // LookForDoors(pSoldier,UNAWARE);
}

//#endif
