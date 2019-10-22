let gfOriginalList: BOOLEAN = TRUE;

let gSoldierInitHead: Pointer<SOLDIERINITNODE> = NULL;
let gSoldierInitTail: Pointer<SOLDIERINITNODE> = NULL;

let gOriginalSoldierInitListHead: Pointer<SOLDIERINITNODE> = NULL;
let gAlternateSoldierInitListHead: Pointer<SOLDIERINITNODE> = NULL;

function CountNumberOfNodesWithSoldiers(): UINT32 {
  let curr: Pointer<SOLDIERINITNODE>;
  let num: UINT32 = 0;
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier) {
      num++;
    }
    curr = curr.value.next;
  }
  return num;
}

function InitSoldierInitList(): void {
  if (gSoldierInitHead)
    KillSoldierInitList();
  gSoldierInitHead = NULL;
  gSoldierInitTail = NULL;
}

function KillSoldierInitList(): void {
  while (gSoldierInitHead)
    RemoveSoldierNodeFromInitList(gSoldierInitTail);
  if (gfOriginalList)
    gOriginalSoldierInitListHead = NULL;
  else
    gAlternateSoldierInitListHead = NULL;
}

function AddBasicPlacementToSoldierInitList(pBasicPlacement: Pointer<BASIC_SOLDIERCREATE_STRUCT>): Pointer<SOLDIERINITNODE> {
  let curr: Pointer<SOLDIERINITNODE>;
  // Allocate memory for node
  curr = MemAlloc(sizeof(SOLDIERINITNODE));
  Assert(curr);
  memset(curr, 0, sizeof(SOLDIERINITNODE));

  // Allocate memory for basic placement
  curr.value.pBasicPlacement = MemAlloc(sizeof(BASIC_SOLDIERCREATE_STRUCT));
  if (!curr.value.pBasicPlacement) {
    AssertMsg(0, "Failed to allocate memory for AddBasicPlacementToSoldierInitList.");
    return NULL;
  }

  // Copy memory for basic placement
  memcpy(curr.value.pBasicPlacement, pBasicPlacement, sizeof(BASIC_SOLDIERCREATE_STRUCT));

  // It is impossible to set up detailed placement stuff now.
  // If there is any detailed placement information during map load, it will be added
  // immediately after this function call.
  curr.value.pDetailedPlacement = NULL;
  curr.value.pSoldier = NULL;

  // Insert the new node in the list in its proper place.
  if (!gSoldierInitHead) {
    gSoldierInitHead = curr;
    if (gfOriginalList)
      gOriginalSoldierInitListHead = curr;
    else
      gAlternateSoldierInitListHead = curr;
    gSoldierInitTail = curr;
    gSoldierInitHead.value.next = NULL;
    gSoldierInitHead.value.prev = NULL;
  } else {
    // TEMP:  no sorting, just enemies
    curr.value.prev = gSoldierInitTail;
    curr.value.next = NULL;
    gSoldierInitTail.value.next = curr;
    gSoldierInitTail = gSoldierInitTail.value.next;
  }
  if (gfOriginalList)
    gMapInformation.ubNumIndividuals++;
  return curr;
}

function RemoveSoldierNodeFromInitList(pNode: Pointer<SOLDIERINITNODE>): void {
  if (!pNode)
    return;
  if (gfOriginalList)
    gMapInformation.ubNumIndividuals--;
  if (pNode.value.pBasicPlacement) {
    MemFree(pNode.value.pBasicPlacement);
    pNode.value.pBasicPlacement = NULL;
  }
  if (pNode.value.pDetailedPlacement) {
    MemFree(pNode.value.pDetailedPlacement);
    pNode.value.pDetailedPlacement = NULL;
  }
  if (pNode.value.pSoldier) {
    if (pNode.value.pSoldier.value.ubID >= 20) {
      TacticalRemoveSoldier(pNode.value.pSoldier.value.ubID);
    } else {
      let bug: INT8 = 0;
    }
  }
  if (pNode == gSoldierInitHead) {
    gSoldierInitHead = gSoldierInitHead.value.next;
    if (gSoldierInitHead)
      gSoldierInitHead.value.prev = NULL;
    if (gfOriginalList)
      gOriginalSoldierInitListHead = gSoldierInitHead;
    else
      gAlternateSoldierInitListHead = gSoldierInitHead;
  } else if (pNode == gSoldierInitTail) {
    gSoldierInitTail = gSoldierInitTail.value.prev;
    gSoldierInitTail.value.next = NULL;
  } else {
    pNode.value.prev.value.next = pNode.value.next;
    pNode.value.next.value.prev = pNode.value.prev;
  }
  MemFree(pNode);
}

// These serialization functions are assuming the passing of a valid file
// pointer to the beginning of the save/load area, which is not necessarily at
// the beginning of the file.  This is just a part of the whole map serialization.
function SaveSoldiersToMap(fp: HWFILE): BOOLEAN {
  let i: UINT32;
  let uiBytesWritten: UINT32;
  let curr: Pointer<SOLDIERINITNODE>;

  if (!fp)
    return FALSE;

  if (gMapInformation.ubNumIndividuals > MAX_INDIVIDUALS)
    return FALSE;

// If we are perhaps in the alternate version of the editor, we don't want bad things to
// happen.  This is probably the only place I know where the user gets punished now.  If the
// person was in the alternate editor mode, then decided to save the game, the current mercs may
// not be there.  This would be bad.  What we do is override any merc editing done while in this
// mode, and kill them all, while replacing them with the proper ones.  Not only that, the alternate
// editing mode is turned off, and if intentions are to play the game, the user will be facing many
// enemies!
  if (!gfOriginalList)
    ResetAllMercPositions();

  curr = gSoldierInitHead;
  for (i = 0; i < gMapInformation.ubNumIndividuals; i++) {
    if (!curr)
      return FALSE;
    curr.value.ubNodeID = i;
    FileWrite(fp, curr.value.pBasicPlacement, sizeof(BASIC_SOLDIERCREATE_STRUCT), addressof(uiBytesWritten));

    if (curr.value.pBasicPlacement.value.fDetailedPlacement) {
      if (!curr.value.pDetailedPlacement)
        return FALSE;
      FileWrite(fp, curr.value.pDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), addressof(uiBytesWritten));
    }
    curr = curr.value.next;
  }
  return TRUE;
}

function LoadSoldiersFromMap(hBuffer: Pointer<Pointer<INT8>>): BOOLEAN {
  let i: UINT32;
  let ubNumIndividuals: UINT8;
  let tempBasicPlacement: BASIC_SOLDIERCREATE_STRUCT;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let pNode: Pointer<SOLDIERINITNODE>;
  let fCowInSector: BOOLEAN = FALSE;

  ubNumIndividuals = gMapInformation.ubNumIndividuals;

  UseEditorAlternateList();
  KillSoldierInitList();
  UseEditorOriginalList();
  KillSoldierInitList();

  InitSoldierInitList();

  if (ubNumIndividuals > MAX_INDIVIDUALS) {
    AssertMsg(0, "Corrupt map check failed.  ubNumIndividuals is greater than MAX_INDIVIDUALS.");
    return FALSE; // too many mercs
  }
  if (!ubNumIndividuals) {
    return TRUE; // no mercs
  }

  // Because we are loading the map, we needed to know how many
  // guys are being loaded, but when we add them to the list here, it
  // automatically increments that number, effectively doubling it, which
  // would be a problem.  Now that we know the number, we clear it here, so
  // it gets built again.
  gMapInformation.ubNumIndividuals = 0; // MUST BE CLEARED HERE!!!

  for (i = 0; i < ubNumIndividuals; i++) {
    LOADDATA(addressof(tempBasicPlacement), hBuffer.value, sizeof(BASIC_SOLDIERCREATE_STRUCT));
    pNode = AddBasicPlacementToSoldierInitList(addressof(tempBasicPlacement));
    pNode.value.ubNodeID = i;
    if (!pNode) {
      AssertMsg(0, "Failed to allocate memory for new basic placement in LoadSoldiersFromMap.");
      return FALSE;
    }
    if (tempBasicPlacement.fDetailedPlacement) {
      // Add the static detailed placement information in the same newly created node as the basic placement.
      // read static detailed placement from file
      LOADDATA(addressof(tempDetailedPlacement), hBuffer.value, sizeof(SOLDIERCREATE_STRUCT));
      // allocate memory for new static detailed placement
      pNode.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
      if (!pNode.value.pDetailedPlacement) {
        AssertMsg(0, "Failed to allocate memory for new detailed placement in LoadSoldiersFromMap.");
        return FALSE;
      }
      // copy the file information from temp var to node in list.
      memcpy(pNode.value.pDetailedPlacement, addressof(tempDetailedPlacement), sizeof(SOLDIERCREATE_STRUCT));

      if (tempDetailedPlacement.ubProfile != NO_PROFILE) {
        pNode.value.pDetailedPlacement.value.ubCivilianGroup = gMercProfiles[tempDetailedPlacement.ubProfile].ubCivilianGroup;
        pNode.value.pBasicPlacement.value.ubCivilianGroup = gMercProfiles[tempDetailedPlacement.ubProfile].ubCivilianGroup;
      }
    }
    if (tempBasicPlacement.bBodyType == COW) {
      fCowInSector = TRUE;
    }
  }
  if (fCowInSector) {
    let str: UINT8[] /* [40] */;
    sprintf(str, "Sounds\\\\cowmoo%d.wav", Random(3) + 1);
    PlayJA2SampleFromFile(str, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
  }
  return TRUE;
}

// Because soldiers, creatures, etc., maybe added to the game at anytime theoretically, the
// list will need to be sorted to reflect this.  It is quite likely that this won't be needed,
// but the flexibility is there just incase.  Now the list is sorted in the following manner:
//-1st priority:  Any nodes containing valid pointers to soldiers are moved to the end of the list.
//								We don't ever want to use two identical placements.
//-2nd priority:  Any nodes that have priority existance and detailed placement information are
//								put first in the list.
//-3rd priority:	Any nodes that have priority existance and no detailed placement information are used next.
//-4th priority:	Any nodes that have detailed placement and no priority existance information are used next.
//-5th priority:  The rest of the nodes are basic placements and are placed in the center of the list.  Of
//								these, they are randomly filled based on the number needed.
// NOTE:  This function is called by AddSoldierInitListTeamToWorld().  There is no other place it needs to
//			 be called.
function SortSoldierInitList(): void {
  let temp: Pointer<SOLDIERINITNODE>;
  let curr: Pointer<SOLDIERINITNODE>;

  let fFredoAtStart: BOOLEAN = FALSE;
  let fFredoAtEnd: BOOLEAN = FALSE;

  if (!gSoldierInitHead)
    return;

  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == FREDO) {
      fFredoAtStart = TRUE;
      break;
    }
    curr = curr.value.next;
  }

  // 1st priority sort
  curr = gSoldierInitTail;
  while (curr) {
    if (curr.value.pSoldier && curr != gSoldierInitTail) {
      // This node has an existing soldier, so move to end of list.
      // copy node
      temp = curr;
      if (temp == gSoldierInitHead) {
        // If we dealing with the head, we need to move it now.
        gSoldierInitHead = gSoldierInitHead.value.next;
        if (gfOriginalList)
          gOriginalSoldierInitListHead = gSoldierInitHead;
        else
          gAlternateSoldierInitListHead = gSoldierInitHead;
        gSoldierInitHead.value.prev = NULL;
        temp.value.next = NULL;
      }
      curr = curr.value.prev;
      // detach node from list
      if (temp.value.prev)
        temp.value.prev.value.next = temp.value.next;
      if (temp.value.next)
        temp.value.next.value.prev = temp.value.prev;
      // add node to end of list
      temp.value.prev = gSoldierInitTail;
      temp.value.next = NULL;
      gSoldierInitTail.value.next = temp;
      gSoldierInitTail = temp;
    } else {
      curr = curr.value.prev;
    }
  }
  // 4th -- put to start
  curr = gSoldierInitHead;
  while (curr) {
    if (!curr.value.pSoldier && !curr.value.pBasicPlacement.value.fPriorityExistance && curr.value.pDetailedPlacement && curr != gSoldierInitHead) {
      // Priority existance nodes without detailed placement info are moved to beginning of list
      // copy node
      temp = curr;
      if (temp == gSoldierInitTail) {
        // If we dealing with the tail, we need to move it now.
        gSoldierInitTail = gSoldierInitTail.value.prev;
        gSoldierInitTail.value.next = NULL;
        temp.value.prev = NULL;
      }
      curr = curr.value.next;
      // detach node from list
      if (temp.value.prev)
        temp.value.prev.value.next = temp.value.next;
      if (temp.value.next)
        temp.value.next.value.prev = temp.value.prev;
      // add node to beginning of list
      temp.value.prev = NULL;
      temp.value.next = gSoldierInitHead;
      gSoldierInitHead.value.prev = temp;
      gSoldierInitHead = temp;
      if (gfOriginalList)
        gOriginalSoldierInitListHead = gSoldierInitHead;
      else
        gAlternateSoldierInitListHead = gSoldierInitHead;
    } else {
      curr = curr.value.next;
    }
  }
  // 3rd priority sort (see below for reason why we do 2nd after 3rd)
  curr = gSoldierInitHead;
  while (curr) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.fPriorityExistance && !curr.value.pDetailedPlacement && curr != gSoldierInitHead) {
      // Priority existance nodes without detailed placement info are moved to beginning of list
      // copy node
      temp = curr;
      if (temp == gSoldierInitTail) {
        // If we dealing with the tail, we need to move it now.
        gSoldierInitTail = gSoldierInitTail.value.prev;
        gSoldierInitTail.value.next = NULL;
        temp.value.prev = NULL;
      }
      curr = curr.value.next;
      // detach node from list
      if (temp.value.prev)
        temp.value.prev.value.next = temp.value.next;
      if (temp.value.next)
        temp.value.next.value.prev = temp.value.prev;
      // add node to beginning of list
      temp.value.prev = NULL;
      temp.value.next = gSoldierInitHead;
      gSoldierInitHead.value.prev = temp;
      gSoldierInitHead = temp;
      if (gfOriginalList)
        gOriginalSoldierInitListHead = gSoldierInitHead;
      else
        gAlternateSoldierInitListHead = gSoldierInitHead;
    } else {
      curr = curr.value.next;
    }
  }
  // 2nd priority sort (by adding these to the front, it'll be before the
  // 3rd priority sort.  This is why we do it after.
  curr = gSoldierInitHead;
  while (curr) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.fPriorityExistance && curr.value.pDetailedPlacement && curr != gSoldierInitHead) {
      // Priority existance nodes are moved to beginning of list
      // copy node
      temp = curr;
      if (temp == gSoldierInitTail) {
        // If we dealing with the tail, we need to move it now.
        gSoldierInitTail = gSoldierInitTail.value.prev;
        gSoldierInitTail.value.next = NULL;
        temp.value.prev = NULL;
      }
      curr = curr.value.next;
      // detach node from list
      if (temp.value.prev)
        temp.value.prev.value.next = temp.value.next;
      if (temp.value.next)
        temp.value.next.value.prev = temp.value.prev;
      // add node to beginning of list
      temp.value.prev = NULL;
      temp.value.next = gSoldierInitHead;
      gSoldierInitHead.value.prev = temp;
      gSoldierInitHead = temp;
      if (gfOriginalList)
        gOriginalSoldierInitListHead = gSoldierInitHead;
      else
        gAlternateSoldierInitListHead = gSoldierInitHead;
    } else {
      curr = curr.value.next;
    }
  }
  // 4th priority sort
  // Done!  If the soldier existing slots are at the end of the list and the
  //			 priority placements are at the beginning of the list, then the
  //			 basic placements are in the middle.

  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == FREDO) {
      fFredoAtEnd = TRUE;
      break;
    }
    curr = curr.value.next;
  }
}

function AddPlacementToWorld(curr: Pointer<SOLDIERINITNODE>): BOOLEAN {
  let ubProfile: UINT8;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubID: UINT8;
  // First check if this guy has a profile and if so check his location such that it matches!
  // Get profile from placement info
  memset(addressof(tempDetailedPlacement), 0, sizeof(SOLDIERCREATE_STRUCT));

  if (curr.value.pDetailedPlacement) {
    ubProfile = curr.value.pDetailedPlacement.value.ubProfile;

    if (ubProfile != NO_PROFILE && !gfEditMode) {
      if (gMercProfiles[ubProfile].sSectorX != gWorldSectorX || gMercProfiles[ubProfile].sSectorY != gWorldSectorY || gMercProfiles[ubProfile].bSectorZ != gbWorldSectorZ || gMercProfiles[ubProfile].ubMiscFlags & (PROFILE_MISC_FLAG_RECRUITED | PROFILE_MISC_FLAG_EPCACTIVE) ||
          //				gMercProfiles[ ubProfile ].ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR ||
          !gMercProfiles[ubProfile].bLife || gMercProfiles[ubProfile].fUseProfileInsertionInfo) {
        return FALSE;
      }
    }
    // Special case code when adding icecream truck.
    if (!gfEditMode) {
      // CJC, August 18, 1999: don't do this code unless the ice cream truck is on our team
      if (FindSoldierByProfileID(ICECREAMTRUCK, TRUE) != NULL) {
        if (curr.value.pDetailedPlacement.value.bBodyType == ICECREAMTRUCK) {
          // Check to see if Hamous is here and not recruited.  If so, add truck
          if (gMercProfiles[HAMOUS].sSectorX != gWorldSectorX || gMercProfiles[HAMOUS].sSectorY != gWorldSectorY || gMercProfiles[HAMOUS].bSectorZ) {
            // not here, so don't add
            return TRUE;
          }
          // Hamous is here.  Check to make sure he isn't recruited.
          if (gMercProfiles[HAMOUS].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) {
            return TRUE;
          }
        }
      }
    }
    CreateDetailedPlacementGivenStaticDetailedPlacementAndBasicPlacementInfo(addressof(tempDetailedPlacement), curr.value.pDetailedPlacement, curr.value.pBasicPlacement);
  } else {
    CreateDetailedPlacementGivenBasicPlacementInfo(addressof(tempDetailedPlacement), curr.value.pBasicPlacement);
  }

  if (!gfEditMode) {
    if (tempDetailedPlacement.bTeam == CIV_TEAM) {
      // quest-related overrides
      if (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C) {
        let ubRoom: UINT8;

        // Kinpin guys might be guarding Tony
        if (tempDetailedPlacement.ubCivilianGroup == KINGPIN_CIV_GROUP && (gTacticalStatus.fCivGroupHostile[KINGPIN_CIV_GROUP] == CIV_GROUP_WILL_BECOME_HOSTILE || ((gubQuest[QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) && (CheckFact(FACT_KINGPIN_CAN_SEND_ASSASSINS, KINGPIN))))) {
          if (tempDetailedPlacement.ubProfile == NO_PROFILE) {
            // these guys should be guarding Tony!
            tempDetailedPlacement.sInsertionGridNo = 13531 + (PreRandom(8) * (PreRandom(1) ? -1 : 1) + PreRandom(8) * (PreRandom(1) ? -1 : 1) * WORLD_ROWS);

            switch (PreRandom(3)) {
              case 0:
                tempDetailedPlacement.bOrders = ONGUARD;
                break;
              case 1:
                tempDetailedPlacement.bOrders = CLOSEPATROL;
                break;
              case 2:
                tempDetailedPlacement.bOrders = ONCALL;
                break;
            }
          } else if (tempDetailedPlacement.ubProfile == BILLY) {
            // billy should now be able to roam around
            tempDetailedPlacement.sInsertionGridNo = 13531 + (PreRandom(30) * (PreRandom(1) ? -1 : 1) + PreRandom(30) * (PreRandom(1) ? -1 : 1) * WORLD_ROWS);
            tempDetailedPlacement.bOrders = SEEKENEMY;
          } else if (tempDetailedPlacement.ubProfile == MADAME) {
            // she shouldn't be here!
            return TRUE;
          } else if (tempDetailedPlacement.ubProfile == NO_PROFILE && InARoom(tempDetailedPlacement.sInsertionGridNo, addressof(ubRoom)) && IN_BROTHEL(ubRoom)) {
            // must be a hooker, shouldn't be there
            return TRUE;
          }
        }
      } else if (!gfInMeanwhile && gWorldSectorX == 3 && gWorldSectorY == 16 && !gbWorldSectorZ) {
        // Special civilian setup for queen's palace.
        if (gubFact[FACT_QUEEN_DEAD]) {
          if (tempDetailedPlacement.ubCivilianGroup == QUEENS_CIV_GROUP) {
            // The queen's civs aren't added if queen is dead
            return TRUE;
          }
        } else {
          if (gfUseAlternateQueenPosition && tempDetailedPlacement.ubProfile == QUEEN) {
            tempDetailedPlacement.sInsertionGridNo = 11448;
          }
          if (tempDetailedPlacement.ubCivilianGroup != QUEENS_CIV_GROUP) {
            // The free civilians aren't added if queen is alive
            return TRUE;
          }
        }
      } else if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y && gbWorldSectorZ == 0) {
        // Tixa prison, once liberated, should not have any civs without profiles unless
        // they are kids
        if (!StrategicMap[TIXA_SECTOR_X + TIXA_SECTOR_Y * MAP_WORLD_X].fEnemyControlled && tempDetailedPlacement.ubProfile == NO_PROFILE && tempDetailedPlacement.bBodyType != HATKIDCIV && tempDetailedPlacement.bBodyType != KIDCIV) {
          // not there
          return TRUE;
        }
      } else if (gWorldSectorX == 13 && gWorldSectorY == MAP_ROW_C && gbWorldSectorZ == 0) {
        if (CheckFact(FACT_KIDS_ARE_FREE, 0)) {
          if (tempDetailedPlacement.bBodyType == HATKIDCIV || tempDetailedPlacement.bBodyType == KIDCIV) {
            // not there any more!  kids have been freeeeed!
            return TRUE;
          }
        }
      }
    }

    // SPECIAL!  Certain events in the game can cause profiled NPCs to become enemies.  The two cases are
    // adding Mike and Iggy.  We will only add one NPC in any given combat and the conditions for setting
    // the associated facts are done elsewhere.  There is also another place where NPCs can get added, which
    // is in TacticalCreateElite() used for inserting offensive enemies.
    if (tempDetailedPlacement.bTeam == ENEMY_TEAM && tempDetailedPlacement.ubSoldierClass == SOLDIER_CLASS_ELITE) {
      OkayToUpgradeEliteToSpecialProfiledEnemy(addressof(tempDetailedPlacement));
    }
  }

  if (pSoldier = TacticalCreateSoldier(addressof(tempDetailedPlacement), addressof(ubID))) {
    curr.value.pSoldier = pSoldier;
    curr.value.ubSoldierID = ubID;
    AddSoldierToSectorNoCalculateDirection(ubID);

    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bTeam == ENEMY_TEAM && !pSoldier.value.inv[HANDPOS].usItem) {
      pSoldier = pSoldier;
    }

    return TRUE;
  } else {
    LiveMessage("Failed to create soldier using TacticalCreateSoldier within AddPlacementToWorld");
  }
  return FALSE;
}

function AddPlacementToWorldByProfileID(ubProfile: UINT8): void {
  let curr: Pointer<SOLDIERINITNODE>;

  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == ubProfile && !curr.value.pSoldier) {
      // Matching profile, so add this placement.
      AddPlacementToWorld(curr);
      break;
    }
    curr = curr.value.next;
  }
}

function AddSoldierInitListTeamToWorld(bTeam: INT8, ubMaxNum: UINT8): UINT8 {
  let ubNumAdded: UINT8 = 0;
  let mark: Pointer<SOLDIERINITNODE>;
  let ubSlotsToFill: UINT8;
  let ubSlotsAvailable: UINT8;
  let curr: Pointer<SOLDIERINITNODE>;

  // Sort the list in the following manner:
  //-Priority placements first
  //-Basic placements next
  //-Any placements with existing soldiers last (overrides others)
  SortSoldierInitList();

  if (giCurrentTilesetID == 1) // cave/mine tileset only
  {
    // convert all civilians to miners which use uniforms and more masculine body types.
    curr = gSoldierInitHead;
    while (curr) {
      if (curr.value.pBasicPlacement.value.bTeam == CIV_TEAM && !curr.value.pDetailedPlacement) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_MINER;
        curr.value.pBasicPlacement.value.bBodyType = -1;
      }
      curr = curr.value.next;
    }
  }

  // Count the current number of soldiers of the specified team
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pBasicPlacement.value.bTeam == bTeam && curr.value.pSoldier)
      ubNumAdded++; // already one here!
    curr = curr.value.next;
  }

  curr = gSoldierInitHead;

  // First fill up all of the priority existance slots...
  while (curr && curr.value.pBasicPlacement.value.fPriorityExistance && ubNumAdded < ubMaxNum) {
    if (curr.value.pBasicPlacement.value.bTeam == bTeam) {
      // Matching team, so add this placement.
      if (AddPlacementToWorld(curr)) {
        ubNumAdded++;
      }
    }
    curr = curr.value.next;
  }
  if (ubNumAdded == ubMaxNum)
    return ubNumAdded;

  // Now count the number of nodes that are basic placements of desired team
  // This information will be used to randomly determine which of these placements
  // will be added based on the number of slots we can still add.
  mark = curr;
  ubSlotsAvailable = 0;
  ubSlotsToFill = ubMaxNum - ubNumAdded;
  while (curr && !curr.value.pSoldier && ubNumAdded < ubMaxNum) {
    if (curr.value.pBasicPlacement.value.bTeam == bTeam)
      ubSlotsAvailable++;
    curr = curr.value.next;
  }

  // we now have the number, so compared it to the num we can add, and determine how we will
  // randomly determine which nodes to add.
  if (!ubSlotsAvailable) {
    // There aren't any basic placements of desired team, so exit.
    return ubNumAdded;
  }
  curr = mark;
  // while we have a list, with no active soldiers, the num added is less than the max num requested, and
  // we have slots available, process the list to add new soldiers.
  while (curr && !curr.value.pSoldier && ubNumAdded < ubMaxNum && ubSlotsAvailable) {
    if (curr.value.pBasicPlacement.value.bTeam == bTeam) {
      if (ubSlotsAvailable <= ubSlotsToFill || Random(ubSlotsAvailable) < ubSlotsToFill) {
        // found matching team, so add this soldier to the game.
        if (AddPlacementToWorld(curr)) {
          ubNumAdded++;
        } else {
          // if it fails to create the soldier, it is likely that it is because the slots in the tactical
          // engine are already full.  Besides, the strategic AI shouldn't be trying to fill a map with
          // more than the maximum allowable soldiers of team.  All teams can have a max of 32 individuals,
          // except for the player which is 20.  Players aren't processed in this list anyway.
          return ubNumAdded;
        }
        ubSlotsToFill--;
      }
      ubSlotsAvailable--;
      // With the decrementing of the slot vars in this manner, the chances increase so that all slots
      // will be full by the time the end of the list comes up.
    }
    curr = curr.value.next;
  }
  return ubNumAdded;
}

function AddSoldierInitListEnemyDefenceSoldiers(ubTotalAdmin: UINT8, ubTotalTroops: UINT8, ubTotalElite: UINT8): void {
  let mark: Pointer<SOLDIERINITNODE>;
  let curr: Pointer<SOLDIERINITNODE>;
  let iRandom: INT32;
  let ubMaxNum: UINT8;
  let bTeam: INT8 = ENEMY_TEAM;
  let ubElitePDSlots: UINT8 = 0;
  let ubEliteDSlots: UINT8 = 0;
  let ubElitePSlots: UINT8 = 0;
  let ubEliteBSlots: UINT8 = 0;
  let ubTroopPDSlots: UINT8 = 0;
  let ubTroopDSlots: UINT8 = 0;
  let ubTroopPSlots: UINT8 = 0;
  let ubTroopBSlots: UINT8 = 0;
  let ubAdminPDSlots: UINT8 = 0;
  let ubAdminDSlots: UINT8 = 0;
  let ubAdminPSlots: UINT8 = 0;
  let ubAdminBSlots: UINT8 = 0;
  let ubFreeSlots: UINT8;
  let pCurrSlots: Pointer<UINT8> = NULL;
  let pCurrTotal: Pointer<UINT8> = NULL;
  let ubCurrClass: UINT8;

  ResetMortarsOnTeamCount();

  // Specs call for only one profiled enemy can be in a sector at a time due to flavor reasons.
  gfProfiledEnemyAdded = FALSE;

  // Because the enemy defence forces work differently than the regular map placements, the numbers
  // of each type of enemy may not be the same.  Elites will choose the best placements, then army, then
  // administrators.

  ubMaxNum = ubTotalAdmin + ubTotalTroops + ubTotalElite;

  // Sort the list in the following manner:
  //-Priority placements first
  //-Basic placements next
  //-Any placements with existing soldiers last (overrides others)
  SortSoldierInitList();

  // Now count the number of nodes that are basic placements of desired team AND CLASS
  // This information will be used to randomly determine which of these placements
  // will be added based on the number of slots we can still add.
  curr = gSoldierInitHead;
  while (curr && !curr.value.pSoldier) {
    if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
      switch (curr.value.pBasicPlacement.value.ubSoldierClass) {
        case SOLDIER_CLASS_ELITE:
          if (curr.value.pBasicPlacement.value.fPriorityExistance && curr.value.pDetailedPlacement)
            ubElitePDSlots++;
          else if (curr.value.pBasicPlacement.value.fPriorityExistance)
            ubElitePSlots++;
          else if (curr.value.pDetailedPlacement)
            ubEliteDSlots++;
          else
            ubEliteBSlots++;
          break;
        case SOLDIER_CLASS_ADMINISTRATOR:
          if (curr.value.pBasicPlacement.value.fPriorityExistance && curr.value.pDetailedPlacement)
            ubAdminPDSlots++;
          else if (curr.value.pBasicPlacement.value.fPriorityExistance)
            ubAdminPSlots++;
          else if (curr.value.pDetailedPlacement)
            ubAdminDSlots++;
          else
            ubAdminBSlots++;
          break;
        case SOLDIER_CLASS_ARMY:
          if (curr.value.pBasicPlacement.value.fPriorityExistance && curr.value.pDetailedPlacement)
            ubTroopPDSlots++;
          else if (curr.value.pBasicPlacement.value.fPriorityExistance)
            ubTroopPSlots++;
          else if (curr.value.pDetailedPlacement)
            ubTroopDSlots++;
          else
            ubTroopBSlots++;
          break;
      }
    }
    curr = curr.value.next;
  }

  // ADD PLACEMENTS WITH PRIORITY EXISTANCE WITH DETAILED PLACEMENT INFORMATION FIRST
  // we now have the numbers of available slots for each soldier class, so loop through three times
  // and randomly choose some (or all) of the matching slots to fill.  This is done randomly.
  for (ubCurrClass = SOLDIER_CLASS_ADMINISTRATOR; ubCurrClass <= SOLDIER_CLASS_ARMY; ubCurrClass++) {
    // First, prepare the counters.
    switch (ubCurrClass) {
      case SOLDIER_CLASS_ADMINISTRATOR:
        pCurrSlots = addressof(ubAdminPDSlots);
        pCurrTotal = addressof(ubTotalAdmin);
        break;
      case SOLDIER_CLASS_ELITE:
        pCurrSlots = addressof(ubElitePDSlots);
        pCurrTotal = addressof(ubTotalElite);
        break;
      case SOLDIER_CLASS_ARMY:
        pCurrSlots = addressof(ubTroopPDSlots);
        pCurrTotal = addressof(ubTotalTroops);
        break;
    }
    // Now, loop through the priority existance and detailed placement section of the list.
    curr = gSoldierInitHead;
    while (curr && ubMaxNum && pCurrTotal.value && pCurrSlots.value && curr.value.pDetailedPlacement && curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
        if (curr.value.pBasicPlacement.value.ubSoldierClass == ubCurrClass) {
          if (pCurrSlots.value <= pCurrTotal.value || Random(pCurrSlots.value) < pCurrTotal.value) {
            // found matching team, so add this soldier to the game.
            if (AddPlacementToWorld(curr)) {
              (pCurrTotal.value)--;
              ubMaxNum--;
            } else
              return;
          }
          (pCurrSlots.value)--;
          // With the decrementing of the slot vars in this manner, the chances increase so that all slots
          // will be full by the time the end of the list comes up.
        }
      }
      curr = curr.value.next;
    }
  }
  if (!ubMaxNum)
    return;
  curr = gSoldierInitHead;
  while (curr && curr.value.pDetailedPlacement && curr.value.pBasicPlacement.value.fPriorityExistance)
    curr = curr.value.next;
  mark = curr;

  // ADD PLACEMENTS WITH PRIORITY EXISTANCE AND NO DETAILED PLACEMENT INFORMATION SECOND
  // we now have the numbers of available slots for each soldier class, so loop through three times
  // and randomly choose some (or all) of the matching slots to fill.  This is done randomly.
  for (ubCurrClass = SOLDIER_CLASS_ADMINISTRATOR; ubCurrClass <= SOLDIER_CLASS_ARMY; ubCurrClass++) {
    // First, prepare the counters.
    switch (ubCurrClass) {
      case SOLDIER_CLASS_ADMINISTRATOR:
        pCurrSlots = addressof(ubAdminPSlots);
        pCurrTotal = addressof(ubTotalAdmin);
        break;
      case SOLDIER_CLASS_ELITE:
        pCurrSlots = addressof(ubElitePSlots);
        pCurrTotal = addressof(ubTotalElite);
        break;
      case SOLDIER_CLASS_ARMY:
        pCurrSlots = addressof(ubTroopPSlots);
        pCurrTotal = addressof(ubTotalTroops);
        break;
    }
    // Now, loop through the priority existance and non detailed placement section of the list.
    curr = mark;
    while (curr && ubMaxNum && pCurrTotal.value && pCurrSlots.value && !curr.value.pDetailedPlacement && curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
        if (curr.value.pBasicPlacement.value.ubSoldierClass == ubCurrClass) {
          if (pCurrSlots.value <= pCurrTotal.value || Random(pCurrSlots.value) < pCurrTotal.value) {
            // found matching team, so add this soldier to the game.
            if (AddPlacementToWorld(curr)) {
              (pCurrTotal.value)--;
              ubMaxNum--;
            } else
              return;
          }
          (pCurrSlots.value)--;
          // With the decrementing of the slot vars in this manner, the chances increase so that all slots
          // will be full by the time the end of the list comes up.
        }
      }
      curr = curr.value.next;
    }
  }
  if (!ubMaxNum)
    return;
  curr = mark;
  while (curr && !curr.value.pDetailedPlacement && curr.value.pBasicPlacement.value.fPriorityExistance)
    curr = curr.value.next;
  mark = curr;

  // ADD PLACEMENTS WITH NO DETAILED PLACEMENT AND PRIORITY EXISTANCE INFORMATION SECOND
  // we now have the numbers of available slots for each soldier class, so loop through three times
  // and randomly choose some (or all) of the matching slots to fill.  This is done randomly.
  for (ubCurrClass = SOLDIER_CLASS_ADMINISTRATOR; ubCurrClass <= SOLDIER_CLASS_ARMY; ubCurrClass++) {
    // First, prepare the counters.
    switch (ubCurrClass) {
      case SOLDIER_CLASS_ADMINISTRATOR:
        pCurrSlots = addressof(ubAdminDSlots);
        pCurrTotal = addressof(ubTotalAdmin);
        break;
      case SOLDIER_CLASS_ELITE:
        pCurrSlots = addressof(ubEliteDSlots);
        pCurrTotal = addressof(ubTotalElite);
        break;
      case SOLDIER_CLASS_ARMY:
        pCurrSlots = addressof(ubTroopDSlots);
        pCurrTotal = addressof(ubTotalTroops);
        break;
    }
    // Now, loop through the priority existance and detailed placement section of the list.
    curr = mark;
    while (curr && ubMaxNum && pCurrTotal.value && pCurrSlots.value && curr.value.pDetailedPlacement && !curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
        if (curr.value.pBasicPlacement.value.ubSoldierClass == ubCurrClass) {
          if (pCurrSlots.value <= pCurrTotal.value || Random(pCurrSlots.value) < pCurrTotal.value) {
            // found matching team, so add this soldier to the game.
            if (AddPlacementToWorld(curr)) {
              (pCurrTotal.value)--;
              ubMaxNum--;
            } else
              return;
          }
          (pCurrSlots.value)--;
          // With the decrementing of the slot vars in this manner, the chances increase so that all slots
          // will be full by the time the end of the list comes up.
        }
      }
      curr = curr.value.next;
    }
  }
  if (!ubMaxNum)
    return;
  curr = mark;
  while (curr && curr.value.pDetailedPlacement && !curr.value.pBasicPlacement.value.fPriorityExistance)
    curr = curr.value.next;
  mark = curr;

  // Kris: January 11, 2000 -- NEW!!!
  // PRIORITY EXISTANT SLOTS MUST BE FILLED
  // This must be done to ensure all priority existant slots are filled before ANY other slots are filled,
  // even if that means changing the class of the slot.  Also, assume that there are no matching fits left
  // for priority existance slots.  All of the matches have been already assigned in the above passes.
  // We'll have to convert the soldier type of the slot to match.
  curr = gSoldierInitHead;
  while (curr && ubMaxNum && curr.value.pBasicPlacement.value.fPriorityExistance) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
      // Choose which team to use.
      iRandom = Random(ubMaxNum);
      if (iRandom < ubTotalElite) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE;
        ubTotalElite--;
      } else if (iRandom < ubTotalElite + ubTotalTroops) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ARMY;
        ubTotalTroops--;
      } else if (iRandom < ubTotalElite + ubTotalTroops + ubTotalAdmin) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ADMINISTRATOR;
        ubTotalAdmin--;
      } else
        Assert(0);
      if (AddPlacementToWorld(curr)) {
        ubMaxNum--;
      } else
        return;
    }
    curr = curr.value.next;
  }
  if (!ubMaxNum)
    return;

  // ADD REMAINING PLACEMENTS WITH BASIC PLACEMENT INFORMATION
  // we now have the numbers of available slots for each soldier class, so loop through three times
  // and randomly choose some (or all) of the matching slots to fill.  This is done randomly.
  for (ubCurrClass = SOLDIER_CLASS_ADMINISTRATOR; ubCurrClass <= SOLDIER_CLASS_ARMY; ubCurrClass++) {
    // First, prepare the counters.
    switch (ubCurrClass) {
      case SOLDIER_CLASS_ADMINISTRATOR:
        pCurrSlots = addressof(ubAdminBSlots);
        pCurrTotal = addressof(ubTotalAdmin);
        break;
      case SOLDIER_CLASS_ELITE:
        pCurrSlots = addressof(ubEliteBSlots);
        pCurrTotal = addressof(ubTotalElite);
        break;
      case SOLDIER_CLASS_ARMY:
        pCurrSlots = addressof(ubTroopBSlots);
        pCurrTotal = addressof(ubTotalTroops);
        break;
    }
    // Now, loop through the regular basic placements section of the list.
    curr = mark;
    while (curr && ubMaxNum && pCurrTotal.value && pCurrSlots.value) {
      if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
        if (curr.value.pBasicPlacement.value.ubSoldierClass == ubCurrClass) {
          if (pCurrSlots.value <= pCurrTotal.value || Random(pCurrSlots.value) < pCurrTotal.value) {
            // found matching team, so add this soldier to the game.
            if (AddPlacementToWorld(curr)) {
              (pCurrTotal.value)--;
              ubMaxNum--;
            } else
              return;
          }
          (pCurrSlots.value)--;
          // With the decrementing of the slot vars in this manner, the chances increase so that all slots
          // will be full by the time the end of the list comes up.
        }
      }
      curr = curr.value.next;
    }
  }
  if (!ubMaxNum)
    return;

  // If we are at this point, that means that there are some compatibility issues.  This is fine.  An example
  // would be a map containing 1 elite placement, and 31 troop placements.  If we had 3 elites move into this
  // sector, we would not have placements for two of them.  What we have to do is override the class information
  // contained in the list by choosing unused placements, and assign them to the elites.  This time, we will
  // use all free slots including priority placement slots (ignoring the priority placement information).

  // First, count up the total number of free slots.
  ubFreeSlots = 0;
  curr = gSoldierInitHead;
  while (curr) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM)
      ubFreeSlots++;
    curr = curr.value.next;
  }

  // Now, loop through the entire list again, but for the last time.  All enemies will be inserted now ignoring
  // detailed placements and classes.
  curr = gSoldierInitHead;
  while (curr && ubFreeSlots && ubMaxNum) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
      // Randomly determine if we will use this slot; the more available slots in proportion to
      // the number of enemies, the lower the chance of accepting the slot.
      if (ubFreeSlots <= ubMaxNum || Random(ubFreeSlots) < ubMaxNum) {
        // Choose which team to use.
        iRandom = Random(ubMaxNum);
        if (iRandom < ubTotalElite) {
          curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE;
          ubTotalElite--;
        } else if (iRandom < ubTotalElite + ubTotalTroops) {
          curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ARMY;
          ubTotalTroops--;
        } else if (iRandom < ubTotalElite + ubTotalTroops + ubTotalAdmin) {
          curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ADMINISTRATOR;
          ubTotalAdmin--;
        } else
          Assert(0);
        /* DISABLE THE OVERRIDE FOR NOW...
        if( curr->pDetailedPlacement )
        { //delete the detailed placement information.
                MemFree( curr->pDetailedPlacement );
                curr->pDetailedPlacement = NULL;
                curr->pBasicPlacement->fDetailedPlacement = FALSE;
        }
        */
        if (AddPlacementToWorld(curr)) {
          ubMaxNum--;
        } else
          return;
      }
      ubFreeSlots--;
      // With the decrementing of the slot vars in this manner, the chances increase so that all slots
      // will be full by the time the end of the list comes up.
    }
    curr = curr.value.next;
  }
}

// If we are adding militia to our map, then we do a few things differently.
// First of all, they exist exclusively to the enemy troops, so if the militia exists in the
// sector, then they get to use the enemy placements.  However, we remove any orders from
// placements containing RNDPTPATROL or POINTPATROL orders, as well as remove any detailed
// placement information.
function AddSoldierInitListMilitia(ubNumGreen: UINT8, ubNumRegs: UINT8, ubNumElites: UINT8): void {
  let mark: Pointer<SOLDIERINITNODE>;
  let curr: Pointer<SOLDIERINITNODE>;
  let iRandom: INT32;
  let ubMaxNum: UINT8;
  let fDoPlacement: BOOLEAN;
  let bTeam: INT8 = ENEMY_TEAM;
  let ubEliteSlots: UINT8 = 0;
  let ubRegSlots: UINT8 = 0;
  let ubGreenSlots: UINT8 = 0;
  let ubFreeSlots: UINT8;
  let pCurrSlots: Pointer<UINT8> = NULL;
  let pCurrTotal: Pointer<UINT8> = NULL;
  let ubCurrClass: UINT8;

  ubMaxNum = ubNumGreen + ubNumRegs + ubNumElites;

  // Sort the list in the following manner:
  //-Priority placements first
  //-Basic placements next
  //-Any placements with existing soldiers last (overrides others)
  SortSoldierInitList();

  curr = gSoldierInitHead;

  // First fill up only the priority existance slots (as long as the availability and class are okay)
  while (curr && curr.value.pBasicPlacement.value.fPriorityExistance && ubMaxNum) {
    fDoPlacement = TRUE;

    if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == MILITIA_TEAM) {
      // Matching team (kindof), now check the soldier class...
      if (ubNumElites && curr.value.pBasicPlacement.value.ubSoldierClass == SOLDIER_CLASS_ELITE) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE_MILITIA;
        ubNumElites--;
      } else if (ubNumRegs && curr.value.pBasicPlacement.value.ubSoldierClass == SOLDIER_CLASS_ARMY) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_REG_MILITIA;
        ubNumRegs--;
      } else if (ubNumGreen && curr.value.pBasicPlacement.value.ubSoldierClass == SOLDIER_CLASS_ADMINISTRATOR) {
        curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_GREEN_MILITIA;
        ubNumGreen--;
      } else
        fDoPlacement = FALSE;

      if (fDoPlacement) {
        curr.value.pBasicPlacement.value.bTeam = MILITIA_TEAM;
        curr.value.pBasicPlacement.value.bOrders = STATIONARY;
        curr.value.pBasicPlacement.value.bAttitude = Random(MAXATTITUDES);
        if (curr.value.pDetailedPlacement) {
          // delete the detailed placement information.
          MemFree(curr.value.pDetailedPlacement);
          curr.value.pDetailedPlacement = NULL;
          curr.value.pBasicPlacement.value.fDetailedPlacement = FALSE;
          RandomizeRelativeLevel(addressof(curr.value.pBasicPlacement.value.bRelativeAttributeLevel), curr.value.pBasicPlacement.value.ubSoldierClass);
          RandomizeRelativeLevel(addressof(curr.value.pBasicPlacement.value.bRelativeEquipmentLevel), curr.value.pBasicPlacement.value.ubSoldierClass);
        }
        if (AddPlacementToWorld(curr)) {
          ubMaxNum--;
        } else
          return;
      }
    }
    curr = curr.value.next;
  }
  if (!ubMaxNum)
    return;
  // Now count the number of nodes that are basic placements of desired team AND CLASS
  // This information will be used to randomly determine which of these placements
  // will be added based on the number of slots we can still add.
  mark = curr;
  while (curr && !curr.value.pSoldier) {
    if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == MILITIA_TEAM) {
      switch (curr.value.pBasicPlacement.value.ubSoldierClass) {
        case SOLDIER_CLASS_ELITE:
          ubEliteSlots++;
          break;
        case SOLDIER_CLASS_ADMINISTRATOR:
          ubGreenSlots++;
          break;
        case SOLDIER_CLASS_ARMY:
          ubRegSlots++;
          break;
      }
    }
    curr = curr.value.next;
  }

  // we now have the numbers of available slots for each soldier class, so loop through three times
  // and randomly choose some (or all) of the matching slots to fill.  This is done randomly.
  for (ubCurrClass = SOLDIER_CLASS_ADMINISTRATOR; ubCurrClass <= SOLDIER_CLASS_ARMY; ubCurrClass++) {
    // First, prepare the counters.
    switch (ubCurrClass) {
      case SOLDIER_CLASS_ADMINISTRATOR:
        pCurrSlots = addressof(ubGreenSlots);
        pCurrTotal = addressof(ubNumGreen);
        break;
      case SOLDIER_CLASS_ELITE:
        pCurrSlots = addressof(ubEliteSlots);
        pCurrTotal = addressof(ubNumElites);
        break;
      case SOLDIER_CLASS_ARMY:
        pCurrSlots = addressof(ubRegSlots);
        pCurrTotal = addressof(ubNumRegs);
        break;
    }
    // Now, loop through the basic placement of the list.
    curr = mark; // mark is the marker where the basic placements start.
    while (curr && !curr.value.pSoldier && ubMaxNum && pCurrTotal.value && pCurrSlots.value) {
      if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == MILITIA_TEAM) {
        if (curr.value.pBasicPlacement.value.ubSoldierClass == ubCurrClass) {
          if (pCurrSlots.value <= pCurrTotal.value || Random(pCurrSlots.value) < pCurrTotal.value) {
            curr.value.pBasicPlacement.value.bTeam = MILITIA_TEAM;
            curr.value.pBasicPlacement.value.bOrders = STATIONARY;
            switch (ubCurrClass) {
              case SOLDIER_CLASS_ADMINISTRATOR:
                curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_GREEN_MILITIA;
                break;
              case SOLDIER_CLASS_ARMY:
                curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_REG_MILITIA;
                break;
              case SOLDIER_CLASS_ELITE:
                curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE_MILITIA;
                break;
            }
            // found matching team, so add this soldier to the game.
            if (AddPlacementToWorld(curr)) {
              (pCurrTotal.value)--;
              ubMaxNum--;
            } else
              return;
          }
          (pCurrSlots.value)--;
          // With the decrementing of the slot vars in this manner, the chances increase so that all slots
          // will be full by the time the end of the list comes up.
        }
      }
      curr = curr.value.next;
    }
  }
  if (!ubMaxNum)
    return;
  // If we are at this point, that means that there are some compatibility issues.  This is fine.  An example
  // would be a map containing 1 elite placement, and 31 troop placements.  If we had 3 elites move into this
  // sector, we would not have placements for two of them.  What we have to do is override the class information
  // contained in the list by choosing unused placements, and assign them to the elites.  This time, we will
  // use all free slots including priority placement slots (ignoring the priority placement information).

  // First, count up the total number of free slots.
  ubFreeSlots = 0;
  curr = gSoldierInitHead;
  while (curr) {
    if (!curr.value.pSoldier && (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == MILITIA_TEAM))
      ubFreeSlots++;
    curr = curr.value.next;
  }

  // Now, loop through the entire list again, but for the last time.  All enemies will be inserted now ignoring
  // detailed placements and classes.
  curr = gSoldierInitHead;
  while (curr && ubFreeSlots && ubMaxNum) {
    if (!curr.value.pSoldier && (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == MILITIA_TEAM)) {
      // Randomly determine if we will use this slot; the more available slots in proportion to
      // the number of enemies, the lower the chance of accepting the slot.
      if (ubFreeSlots <= ubMaxNum || Random(ubFreeSlots) < ubMaxNum) {
        // Choose which team to use.
        iRandom = Random(ubMaxNum);
        if (iRandom < ubNumElites) {
          curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_ELITE_MILITIA;
          ubNumElites--;
        } else if (iRandom < ubNumElites + ubNumRegs) {
          curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_REG_MILITIA;
          ubNumRegs--;
        } else if (iRandom < ubNumElites + ubNumRegs + ubNumGreen) {
          curr.value.pBasicPlacement.value.ubSoldierClass = SOLDIER_CLASS_GREEN_MILITIA;
          ubNumGreen--;
        } else
          Assert(0);
        curr.value.pBasicPlacement.value.bTeam = MILITIA_TEAM;
        curr.value.pBasicPlacement.value.bOrders = STATIONARY;
        curr.value.pBasicPlacement.value.bAttitude = Random(MAXATTITUDES);
        if (curr.value.pDetailedPlacement) {
          // delete the detailed placement information.
          MemFree(curr.value.pDetailedPlacement);
          curr.value.pDetailedPlacement = NULL;
          curr.value.pBasicPlacement.value.fDetailedPlacement = FALSE;
          RandomizeRelativeLevel(addressof(curr.value.pBasicPlacement.value.bRelativeAttributeLevel), curr.value.pBasicPlacement.value.ubSoldierClass);
          RandomizeRelativeLevel(addressof(curr.value.pBasicPlacement.value.bRelativeEquipmentLevel), curr.value.pBasicPlacement.value.ubSoldierClass);
        }
        if (AddPlacementToWorld(curr)) {
          ubMaxNum--;
        } else
          return;
      }
      ubFreeSlots--;
      // With the decrementing of the slot vars in this manner, the chances increase so that all slots
      // will be full by the time the end of the list comes up.
    }
    curr = curr.value.next;
  }
}

function AddSoldierInitListCreatures(fQueen: BOOLEAN, ubNumLarvae: UINT8, ubNumInfants: UINT8, ubNumYoungMales: UINT8, ubNumYoungFemales: UINT8, ubNumAdultMales: UINT8, ubNumAdultFemales: UINT8): void {
  let curr: Pointer<SOLDIERINITNODE>;
  let iRandom: INT32;
  let ubFreeSlots: UINT8;
  let fDoPlacement: BOOLEAN;
  let ubNumCreatures: UINT8;

  SortSoldierInitList();

  // Okay, if we have a queen, place her first.  She MUST have a special placement, else
  // we can't use anything.
  ubNumCreatures = (ubNumLarvae + ubNumInfants + ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales + ubNumAdultFemales);
  if (fQueen) {
    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == CREATURE_TEAM && curr.value.pBasicPlacement.value.bBodyType == QUEENMONSTER) {
        if (!AddPlacementToWorld(curr)) {
          fQueen = FALSE;
          break;
        }
      }
      curr = curr.value.next;
    }
    if (!fQueen) {
    }
  }

  // First fill up only the priority existance slots (as long as the availability and bodytypes match)
  curr = gSoldierInitHead;
  while (curr && curr.value.pBasicPlacement.value.fPriorityExistance && ubNumCreatures) {
    fDoPlacement = TRUE;

    if (curr.value.pBasicPlacement.value.bTeam == CREATURE_TEAM) {
      // Matching team, now check the soldier class...
      if (ubNumLarvae && curr.value.pBasicPlacement.value.bBodyType == LARVAE_MONSTER)
        ubNumLarvae--;
      else if (ubNumInfants && curr.value.pBasicPlacement.value.bBodyType == INFANT_MONSTER)
        ubNumInfants--;
      else if (ubNumYoungMales && curr.value.pBasicPlacement.value.bBodyType == YAM_MONSTER)
        ubNumYoungMales--;
      else if (ubNumYoungFemales && curr.value.pBasicPlacement.value.bBodyType == YAF_MONSTER)
        ubNumYoungFemales--;
      else if (ubNumAdultMales && curr.value.pBasicPlacement.value.bBodyType == AM_MONSTER)
        ubNumAdultMales--;
      else if (ubNumAdultFemales && curr.value.pBasicPlacement.value.bBodyType == ADULTFEMALEMONSTER)
        ubNumAdultFemales--;
      else
        fDoPlacement = FALSE;
      if (fDoPlacement) {
        if (AddPlacementToWorld(curr)) {
          ubNumCreatures--;
        } else
          return;
      }
    }
    curr = curr.value.next;
  }
  if (!ubNumCreatures)
    return;

  // Count how many free creature slots are left.
  curr = gSoldierInitHead;
  ubFreeSlots = 0;
  while (curr) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == CREATURE_TEAM)
      ubFreeSlots++;
    curr = curr.value.next;
  }
  // Now, if we still have creatures to place, do so completely randomly, overriding priority
  // placements, etc.
  curr = gSoldierInitHead;
  while (curr && ubFreeSlots && ubNumCreatures) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == CREATURE_TEAM) {
      // Randomly determine if we will use this slot; the more available slots in proportion to
      // the number of enemies, the lower the chance of accepting the slot.
      if (ubFreeSlots <= ubNumCreatures || Random(ubFreeSlots) < ubNumCreatures) {
        // Choose which team to use.
        iRandom = Random(ubNumCreatures);

        if (ubNumLarvae && iRandom < ubNumLarvae) {
          ubNumLarvae--;
          curr.value.pBasicPlacement.value.bBodyType = LARVAE_MONSTER;
        } else if (ubNumInfants && iRandom < ubNumLarvae + ubNumInfants) {
          ubNumInfants--;
          curr.value.pBasicPlacement.value.bBodyType = INFANT_MONSTER;
        } else if (ubNumYoungMales && iRandom < ubNumLarvae + ubNumInfants + ubNumYoungMales) {
          ubNumYoungMales--;
          curr.value.pBasicPlacement.value.bBodyType = YAM_MONSTER;
        } else if (ubNumYoungFemales && iRandom < ubNumLarvae + ubNumInfants + ubNumYoungMales + ubNumYoungFemales) {
          ubNumYoungFemales--;
          curr.value.pBasicPlacement.value.bBodyType = YAF_MONSTER;
        } else if (ubNumAdultMales && iRandom < ubNumLarvae + ubNumInfants + ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales) {
          ubNumAdultMales--;
          curr.value.pBasicPlacement.value.bBodyType = AM_MONSTER;
        } else if (ubNumAdultFemales && iRandom < ubNumLarvae + ubNumInfants + ubNumYoungMales + ubNumYoungFemales + ubNumAdultMales + ubNumAdultFemales) {
          ubNumAdultFemales--;
          curr.value.pBasicPlacement.value.bBodyType = ADULTFEMALEMONSTER;
        } else
          Assert(0);
        if (curr.value.pDetailedPlacement) {
          // delete the detailed placement information.
          MemFree(curr.value.pDetailedPlacement);
          curr.value.pDetailedPlacement = NULL;
          curr.value.pBasicPlacement.value.fDetailedPlacement = FALSE;
        }
        if (AddPlacementToWorld(curr)) {
          ubNumCreatures--;
        } else {
          return;
        }
      }
      ubFreeSlots--;
      // With the decrementing of the slot vars in this manner, the chances increase so that all slots
      // will be full by the time the end of the list comes up.
    }
    curr = curr.value.next;
  }
}

function FindSoldierInitNodeWithProfileID(usProfile: UINT16): Pointer<SOLDIERINITNODE> {
  let curr: Pointer<SOLDIERINITNODE>;
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == usProfile)
      return curr;
    curr = curr.value.next;
  }
  return NULL;
}

function FindSoldierInitNodeWithID(usID: UINT16): Pointer<SOLDIERINITNODE> {
  let curr: Pointer<SOLDIERINITNODE>;
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier.value.ubID == usID)
      return curr;
    curr = curr.value.next;
  }
  return NULL;
}

function UseEditorOriginalList(): void {
  let curr: Pointer<SOLDIERINITNODE>;
  gfOriginalList = TRUE;
  gSoldierInitHead = gOriginalSoldierInitListHead;
  curr = gSoldierInitHead;
  if (curr) {
    while (curr.value.next)
      curr = curr.value.next;
  }
  if (curr)
    gSoldierInitTail = curr;
}

function UseEditorAlternateList(): void {
  let curr: Pointer<SOLDIERINITNODE>;
  gfOriginalList = FALSE;
  gSoldierInitHead = gAlternateSoldierInitListHead;
  curr = gSoldierInitHead;
  if (curr) {
    while (curr.value.next)
      curr = curr.value.next;
  }
  if (curr)
    gSoldierInitTail = curr;
}

// Any killed people that used detailed placement information must prevent that from occurring
// again in the future.  Otherwise, the sniper guy with 99 marksmanship could appear again
// if the map was loaded again!
function EvaluateDeathEffectsToSoldierInitList(pSoldier: Pointer<SOLDIERTYPE>): void {
  let curr: Pointer<SOLDIERINITNODE>;
  let ubNodeID: UINT8;
  curr = gSoldierInitHead;
  ubNodeID = 0;
  if (pSoldier.value.bTeam == MILITIA_TEAM)
    return;
  while (curr) {
    if (curr.value.pSoldier == pSoldier) {
      // Matching soldier found
      if (curr.value.pDetailedPlacement) {
        // This soldier used detailed placement information, so we must save the
        // node ID into the temp file which signifies that the

        // RECORD UBNODEID IN TEMP FILE.

        curr.value.pSoldier = NULL;
        MemFree(curr.value.pDetailedPlacement);
        curr.value.pDetailedPlacement = NULL;
        return;
      }
    }
    ubNodeID++;
    curr = curr.value.next;
  }
}

function RemoveDetailedPlacementInfo(ubNodeID: UINT8): void {
  let curr: Pointer<SOLDIERINITNODE>;
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.ubNodeID == ubNodeID) {
      if (curr.value.pDetailedPlacement) {
        MemFree(curr.value.pDetailedPlacement);
        curr.value.pDetailedPlacement = NULL;
        return;
      }
    }
    curr = curr.value.next;
  }
}

// For the purpose of keeping track of which soldier belongs to which placement within the game,
// the only way we can do this properly is to save the soldier ID from the list and reconnect the
// soldier pointer whenever we load the game.
function SaveSoldierInitListLinks(hfile: HWFILE): BOOLEAN {
  let curr: Pointer<SOLDIERINITNODE>;
  let uiNumBytesWritten: UINT32;
  let ubSlots: UINT8 = 0;

  // count the number of soldier init nodes...
  curr = gSoldierInitHead;
  while (curr) {
    ubSlots++;
    curr = curr.value.next;
  }
  //...and save it.
  FileWrite(hfile, addressof(ubSlots), 1, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != 1) {
    return FALSE;
  }
  // Now, go through each node, and save just the ubSoldierID, if that soldier is alive.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier && !curr.value.pSoldier.value.bActive) {
      curr.value.ubSoldierID = 0;
    }
    FileWrite(hfile, addressof(curr.value.ubNodeID), 1, addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != 1) {
      return FALSE;
    }
    FileWrite(hfile, addressof(curr.value.ubSoldierID), 1, addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != 1) {
      return FALSE;
    }
    curr = curr.value.next;
  }
  return TRUE;
}

function LoadSoldierInitListLinks(hfile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let curr: Pointer<SOLDIERINITNODE>;
  let ubSlots: UINT8;
  let ubSoldierID: UINT8;
  let ubNodeID: UINT8;

  FileRead(hfile, addressof(ubSlots), 1, addressof(uiNumBytesRead));
  if (uiNumBytesRead != 1) {
    return FALSE;
  }
  while (ubSlots--) {
    FileRead(hfile, addressof(ubNodeID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }
    FileRead(hfile, addressof(ubSoldierID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }

    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      curr = gSoldierInitHead;
      while (curr) {
        if (curr.value.ubNodeID == ubNodeID) {
          curr.value.ubSoldierID = ubSoldierID;
          if (ubSoldierID >= gTacticalStatus.Team[ENEMY_TEAM].bFirstID && ubSoldierID <= gTacticalStatus.Team[CREATURE_TEAM].bLastID || ubSoldierID >= gTacticalStatus.Team[CIV_TEAM].bFirstID && ubSoldierID <= gTacticalStatus.Team[CIV_TEAM].bLastID) {
            // only enemies and creatures.
            curr.value.pSoldier = MercPtrs[ubSoldierID];
          }
        }
        curr = curr.value.next;
      }
    }
  }
  return TRUE;
}

function AddSoldierInitListBloodcats(): void {
  let pSector: Pointer<SECTORINFO>;
  let curr: Pointer<SOLDIERINITNODE>;
  let ubSectorID: UINT8;

  if (gbWorldSectorZ) {
    return; // no bloodcats underground.
  }

  ubSectorID = SECTOR(gWorldSectorX, gWorldSectorY);
  pSector = addressof(SectorInfo[ubSectorID]);

  if (!pSector.value.bBloodCatPlacements) {
    // This map has no bloodcat placements, so don't waste CPU time.
    return;
  }

  if (pSector.value.bBloodCatPlacements) {
    // We don't yet know the number of bloodcat placements in this sector so
    // count them now, and permanently record it.
    let bBloodCatPlacements: INT8 = 0;
    curr = gSoldierInitHead;
    while (curr) {
      if (curr.value.pBasicPlacement.value.bBodyType == BLOODCAT) {
        bBloodCatPlacements++;
      }
      curr = curr.value.next;
    }
    if (bBloodCatPlacements != pSector.value.bBloodCatPlacements && ubSectorID != SEC_I16 && ubSectorID != SEC_N5) {
      pSector.value.bBloodCatPlacements = bBloodCatPlacements;
      pSector.value.bBloodCats = -1;
      if (!bBloodCatPlacements) {
        return;
      }
    }
  }
  if (pSector.value.bBloodCats > 0) {
    // Add them to the world now...
    let ubNumAdded: UINT8 = 0;
    let ubMaxNum: UINT8 = pSector.value.bBloodCats;
    let mark: Pointer<SOLDIERINITNODE>;
    let ubSlotsToFill: UINT8;
    let ubSlotsAvailable: UINT8;
    let curr: Pointer<SOLDIERINITNODE>;

    // Sort the list in the following manner:
    //-Priority placements first
    //-Basic placements next
    //-Any placements with existing soldiers last (overrides others)
    SortSoldierInitList();

    // Count the current number of soldiers of the specified team
    curr = gSoldierInitHead;
    while (curr) {
      if (curr.value.pBasicPlacement.value.bBodyType == BLOODCAT && curr.value.pSoldier)
        ubNumAdded++; // already one here!
      curr = curr.value.next;
    }

    curr = gSoldierInitHead;

    // First fill up all of the priority existance slots...
    while (curr && curr.value.pBasicPlacement.value.fPriorityExistance && ubNumAdded < ubMaxNum) {
      if (curr.value.pBasicPlacement.value.bBodyType == BLOODCAT) {
        // Matching team, so add this placement.
        if (AddPlacementToWorld(curr)) {
          ubNumAdded++;
        }
      }
      curr = curr.value.next;
    }
    if (ubNumAdded == ubMaxNum)
      return;

    // Now count the number of nodes that are basic placements of desired team
    // This information will be used to randomly determine which of these placements
    // will be added based on the number of slots we can still add.
    mark = curr;
    ubSlotsAvailable = 0;
    ubSlotsToFill = ubMaxNum - ubNumAdded;
    while (curr && !curr.value.pSoldier && ubNumAdded < ubMaxNum) {
      if (curr.value.pBasicPlacement.value.bBodyType == BLOODCAT)
        ubSlotsAvailable++;
      curr = curr.value.next;
    }

    // we now have the number, so compared it to the num we can add, and determine how we will
    // randomly determine which nodes to add.
    if (!ubSlotsAvailable) {
      // There aren't any basic placements of desired team, so exit.
      return;
    }
    curr = mark;
    // while we have a list, with no active soldiers, the num added is less than the max num requested, and
    // we have slots available, process the list to add new soldiers.
    while (curr && !curr.value.pSoldier && ubNumAdded < ubMaxNum && ubSlotsAvailable) {
      if (curr.value.pBasicPlacement.value.bBodyType == BLOODCAT) {
        if (ubSlotsAvailable <= ubSlotsToFill || Random(ubSlotsAvailable) < ubSlotsToFill) {
          // found matching team, so add this soldier to the game.
          if (AddPlacementToWorld(curr)) {
            ubNumAdded++;
          } else {
            // if it fails to create the soldier, it is likely that it is because the slots in the tactical
            // engine are already full.  Besides, the strategic AI shouldn't be trying to fill a map with
            // more than the maximum allowable soldiers of team.  All teams can have a max of 32 individuals,
            // except for the player which is 20.  Players aren't processed in this list anyway.
            return;
          }
          ubSlotsToFill--;
        }
        ubSlotsAvailable--;
        // With the decrementing of the slot vars in this manner, the chances increase so that all slots
        // will be full by the time the end of the list comes up.
      }
      curr = curr.value.next;
    }
    return;
  }
}

function FindSoldierInitListNodeByProfile(ubProfile: UINT8): Pointer<SOLDIERINITNODE> {
  let curr: Pointer<SOLDIERINITNODE>;

  curr = gSoldierInitHead;

  while (curr) {
    if (curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == ubProfile) {
      return curr;
    }
    curr = curr.value.next;
  }
  return NULL;
}

// This is the code that loops through the profiles starting at the RPCs, and adds them using strategic insertion
// information, and not editor placements.  The key flag involved for doing it this way is the gMercProfiles[i].fUseProfileInsertionInfo.
function AddProfilesUsingProfileInsertionData(): void {
  let i: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let curr: Pointer<SOLDIERINITNODE>;

  for (i = FIRST_RPC; i < (PROF_HUMMER); i++) {
    // Perform various checks to make sure the soldier is actually in the same sector, alive, and so on.
    // More importantly, the flag to use profile insertion data must be set.
    if (gMercProfiles[i].sSectorX != gWorldSectorX || gMercProfiles[i].sSectorY != gWorldSectorY || gMercProfiles[i].bSectorZ != gbWorldSectorZ || gMercProfiles[i].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED || gMercProfiles[i].ubMiscFlags & PROFILE_MISC_FLAG_EPCACTIVE ||
        //			gMercProfiles[ i ].ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR ||
        !gMercProfiles[i].bLife || !gMercProfiles[i].fUseProfileInsertionInfo) {
          // Don't add, so skip to the next soldier.
      continue;
    }
    pSoldier = FindSoldierByProfileID(i, FALSE);
    if (!pSoldier) {
      // Create a new soldier, as this one doesn't exist
      let MercCreateStruct: SOLDIERCREATE_STRUCT;
      let ubID: UINT8;

      // Set up the create struct so that we can properly create the profile soldier.
      memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
      MercCreateStruct.bTeam = CIV_TEAM;
      MercCreateStruct.ubProfile = i;
      MercCreateStruct.sSectorX = gWorldSectorX;
      MercCreateStruct.sSectorY = gWorldSectorY;
      MercCreateStruct.bSectorZ = gbWorldSectorZ;

      pSoldier = TacticalCreateSoldier(addressof(MercCreateStruct), addressof(ubID));
    }
    if (pSoldier) {
      // Now, insert the soldier.
      pSoldier.value.ubStrategicInsertionCode = gMercProfiles[i].ubStrategicInsertionCode;
      pSoldier.value.usStrategicInsertionData = gMercProfiles[i].usStrategicInsertionData;
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      // CJC: Note well that unless an error occurs, UpdateMercInSector calls
      // AddSoldierToSector
      // AddSoldierToSector( pSoldier->ubID );

      // check action ID values
      if (gMercProfiles[i].ubQuoteRecord) {
        pSoldier.value.ubQuoteRecord = gMercProfiles[i].ubQuoteRecord;
        pSoldier.value.ubQuoteActionID = gMercProfiles[i].ubQuoteActionID;
        if (pSoldier.value.ubQuoteActionID == QUOTE_ACTION_ID_CHECKFORDEST) {
          // gridno will have been changed to destination... so we're there...
          NPCReachedDestination(pSoldier, FALSE);
        }
      }

      // make sure this person's pointer is set properly in the init list
      curr = FindSoldierInitListNodeByProfile(pSoldier.value.ubProfile);
      if (curr) {
        curr.value.pSoldier = pSoldier;
        curr.value.ubSoldierID = pSoldier.value.ubID;
        // also connect schedules here
        if (curr.value.pDetailedPlacement.value.ubScheduleID != 0) {
          let pSchedule: Pointer<SCHEDULENODE> = GetSchedule(curr.value.pDetailedPlacement.value.ubScheduleID);
          if (pSchedule) {
            pSchedule.value.ubSoldierID = pSoldier.value.ubID;
            pSoldier.value.ubScheduleID = curr.value.pDetailedPlacement.value.ubScheduleID;
          }
        }
      }
    }
  }
}

function AddProfilesNotUsingProfileInsertionData(): void {
  let curr: Pointer<SOLDIERINITNODE>;
  // Count the current number of soldiers of the specified team
  curr = gSoldierInitHead;
  while (curr) {
    if (!curr.value.pSoldier && curr.value.pBasicPlacement.value.bTeam == CIV_TEAM && curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile != NO_PROFILE && !gMercProfiles[curr.value.pDetailedPlacement.value.ubProfile].fUseProfileInsertionInfo && gMercProfiles[curr.value.pDetailedPlacement.value.ubProfile].bLife) {
      AddPlacementToWorld(curr);
    }
    curr = curr.value.next;
  }
}

function NewWayOfLoadingEnemySoldierInitListLinks(hfile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let curr: Pointer<SOLDIERINITNODE>;
  let ubSlots: UINT8;
  let ubSoldierID: UINT8;
  let ubNodeID: UINT8;

  FileRead(hfile, addressof(ubSlots), 1, addressof(uiNumBytesRead));
  if (uiNumBytesRead != 1) {
    return FALSE;
  }
  while (ubSlots--) {
    FileRead(hfile, addressof(ubNodeID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }
    FileRead(hfile, addressof(ubSoldierID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }

    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      curr = gSoldierInitHead;
      while (curr) {
        if (curr.value.ubNodeID == ubNodeID) {
          curr.value.ubSoldierID = ubSoldierID;
          if (ubSoldierID >= gTacticalStatus.Team[ENEMY_TEAM].bFirstID && ubSoldierID <= gTacticalStatus.Team[CREATURE_TEAM].bLastID) {
            // only enemies and creatures.
            curr.value.pSoldier = MercPtrs[ubSoldierID];
          }
        }
        curr = curr.value.next;
      }
    }
  }
  return TRUE;
}

function NewWayOfLoadingCivilianInitListLinks(hfile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let curr: Pointer<SOLDIERINITNODE>;
  let ubSlots: UINT8;
  let ubSoldierID: UINT8;
  let ubNodeID: UINT8;

  FileRead(hfile, addressof(ubSlots), 1, addressof(uiNumBytesRead));
  if (uiNumBytesRead != 1) {
    return FALSE;
  }
  while (ubSlots--) {
    FileRead(hfile, addressof(ubNodeID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }
    FileRead(hfile, addressof(ubSoldierID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }

    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      curr = gSoldierInitHead;
      while (curr) {
        if (curr.value.ubNodeID == ubNodeID) {
          curr.value.ubSoldierID = ubSoldierID;
          if (ubSoldierID >= gTacticalStatus.Team[CIV_TEAM].bFirstID && ubSoldierID <= gTacticalStatus.Team[CIV_TEAM].bLastID) {
            // only enemies and creatures.
            curr.value.pSoldier = MercPtrs[ubSoldierID];
          }
        }
        curr = curr.value.next;
      }
    }
  }
  return TRUE;
}

function LookAtButDontProcessEnemySoldierInitListLinks(hfile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let curr: Pointer<SOLDIERINITNODE>;
  let ubSlots: UINT8;
  let ubSoldierID: UINT8;
  let ubNodeID: UINT8;

  FileRead(hfile, addressof(ubSlots), 1, addressof(uiNumBytesRead));
  if (uiNumBytesRead != 1) {
    return FALSE;
  }
  while (ubSlots--) {
    FileRead(hfile, addressof(ubNodeID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }
    FileRead(hfile, addressof(ubSoldierID), 1, addressof(uiNumBytesRead));
    if (uiNumBytesRead != 1) {
      return FALSE;
    }

    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      curr = gSoldierInitHead;
      while (curr) {
        if (curr.value.ubNodeID == ubNodeID) {
          curr.value.ubSoldierID = ubSoldierID;
          if (ubSoldierID >= gTacticalStatus.Team[ENEMY_TEAM].bFirstID && ubSoldierID <= gTacticalStatus.Team[CREATURE_TEAM].bLastID) {
            // only enemies and creatures.
            curr.value.pSoldier = MercPtrs[ubSoldierID];
          }
        }
        curr = curr.value.next;
      }
    }
  }
  return TRUE;
}

function StripEnemyDetailedPlacementsIfSectorWasPlayerLiberated(): void {
  let pSector: Pointer<SECTORINFO>;
  let curr: Pointer<SOLDIERINITNODE>;

  if (!gfWorldLoaded || gbWorldSectorZ) {
    // No world loaded or underground.  Underground sectors don't matter
    // seeing enemies (not creatures) never rejuvenate underground.
    return;
  }

  pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);

  if (!pSector.value.uiTimeLastPlayerLiberated) {
    // The player has never owned the sector.
    return;
  }

  // The player has owned the sector at one point.  By stripping all of the detailed placements, only basic
  // placements will remain.  This prevents tanks and "specially detailed" enemies from coming back.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pDetailedPlacement) {
      if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
        MemFree(curr.value.pDetailedPlacement);
        curr.value.pDetailedPlacement = NULL;
        curr.value.pBasicPlacement.value.fDetailedPlacement = FALSE;
        curr.value.pBasicPlacement.value.fPriorityExistance = FALSE;
        curr.value.pBasicPlacement.value.bBodyType = -1;
        RandomizeRelativeLevel(addressof(curr.value.pBasicPlacement.value.bRelativeAttributeLevel), curr.value.pBasicPlacement.value.ubSoldierClass);
        RandomizeRelativeLevel(addressof(curr.value.pBasicPlacement.value.bRelativeEquipmentLevel), curr.value.pBasicPlacement.value.ubSoldierClass);
      }
    }
    curr = curr.value.next;
  }
}
