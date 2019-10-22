let gfRestoringEnemySoldiersFromTempFile: BOOLEAN = FALSE;
let gfRestoringCiviliansFromTempFile: BOOLEAN = FALSE;

function RemoveEnemySoldierTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let zMapName: CHAR8[] /* [128] */;
  if (GetSectorFlagStatus(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS)) {
    // Delete any temp file that is here and toast the flag that say's one exists.
    ReSetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);

    //		GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );
    // add the 'e' for 'Enemy preserved' to the front of the map name
    //		sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

    GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

    // Delete the temp file.
    FileDelete(zMapName);
  }
}

function RemoveCivilianTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  // CHAR8		zTempName[ 128 ];
  let zMapName: CHAR8[] /* [128] */;
  if (GetSectorFlagStatus(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS)) {
    // Delete any temp file that is here and toast the flag that say's one exists.
    ReSetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
    // GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

    GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

    // Delete the temp file.
    FileDelete(zMapName);
  }
}

// OLD SAVE METHOD:  This is the old way of loading the enemies and civilians
function LoadEnemySoldiersFromTempFile(): BOOLEAN {
  let curr: Pointer<SOLDIERINITNODE>;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let usFileCheckSum: UINT16;
  let zMapName: CHAR8[] /* [128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  let ubNumElites: UINT8 = 0;
  let ubNumTroops: UINT8 = 0;
  let ubNumAdmins: UINT8 = 0;
  let ubNumCreatures: UINT8 = 0;
  let ubStrategicElites: UINT8;
  let ubStrategicTroops: UINT8;
  let ubStrategicAdmins: UINT8;
  let ubStrategicCreatures: UINT8;

  gfRestoringEnemySoldiersFromTempFile = TRUE;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hfile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  FileRead(hfile, &sSectorY, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorY != sSectorY) {
    goto FAIL_LOAD;
  }

  LoadSoldierInitListLinks(hfile);

  // STEP THREE:  read the data

  FileRead(hfile, &sSectorX, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorX != sSectorX) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &slots, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &uiTimeStamp, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &bSectorZ, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }

  if (GetWorldTotalMin() > uiTimeStamp + 300) {
    // the file has aged.  Use the regular method for adding soldiers.
    FileClose(hfile);
    RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
    gfRestoringEnemySoldiersFromTempFile = FALSE;
    return TRUE;
  }

  if (gbWorldSectorZ != bSectorZ) {
    goto FAIL_LOAD;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    gfRestoringEnemySoldiersFromTempFile = FALSE;
    FileClose(hfile);
    return TRUE;
  }
  if (slots < 0 || slots >= 64) {
    // bad IO!
    goto FAIL_LOAD;
  }

  // For all the enemy slots (enemy/creature), clear the fPriorityExistance flag.  We will use these flags
  // to determine which slots have been modified as we load the data into the map pristine soldier init list.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == CREATURE_TEAM || curr.value.pBasicPlacement.value.bTeam == CIV_TEAM) {
        curr.value.pBasicPlacement.value.fPriorityExistance = FALSE;
      }
    }
    curr = curr.value.next;
  }

  // get the number of enemies in this sector.
  if (bSectorZ) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, bSectorZ);
    if (!pSector) {
      goto FAIL_LOAD;
    }
    ubStrategicElites = pSector.value.ubNumElites;
    ubStrategicTroops = pSector.value.ubNumTroops;
    ubStrategicAdmins = pSector.value.ubNumAdmins;
    ubStrategicCreatures = pSector.value.ubNumCreatures;
  } else {
    let pSector: Pointer<SECTORINFO>;
    pSector = &SectorInfo[SECTOR(sSectorX, sSectorY)];
    ubStrategicCreatures = pSector.value.ubNumCreatures;
    GetNumberOfEnemiesInSector(sSectorX, sSectorY, &ubStrategicAdmins, &ubStrategicTroops, &ubStrategicElites);
  }

  for (i = 0; i < slots; i++) {
    FileRead(hfile, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), &uiNumBytesRead);
    if (uiNumBytesRead != sizeof(SOLDIERCREATE_STRUCT)) {
      goto FAIL_LOAD;
    }
    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.value.pBasicPlacement.value.fPriorityExistance) {
        if (!curr.value.pDetailedPlacement || curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == NO_PROFILE) {
          if (curr.value.pBasicPlacement.value.bTeam == tempDetailedPlacement.bTeam) {
            curr.value.pBasicPlacement.value.fPriorityExistance = TRUE;
            if (!curr.value.pDetailedPlacement) {
              // need to upgrade the placement to detailed placement
              curr.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
            }
            // now replace the map pristine placement info with the temp map file version..
            memcpy(curr.value.pDetailedPlacement, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));

            curr.value.pBasicPlacement.value.fPriorityExistance = TRUE;
            curr.value.pBasicPlacement.value.bDirection = curr.value.pDetailedPlacement.value.bDirection;
            curr.value.pBasicPlacement.value.bOrders = curr.value.pDetailedPlacement.value.bOrders;
            curr.value.pBasicPlacement.value.bAttitude = curr.value.pDetailedPlacement.value.bAttitude;
            curr.value.pBasicPlacement.value.bBodyType = curr.value.pDetailedPlacement.value.bBodyType;
            curr.value.pBasicPlacement.value.fOnRoof = curr.value.pDetailedPlacement.value.fOnRoof;
            curr.value.pBasicPlacement.value.ubSoldierClass = curr.value.pDetailedPlacement.value.ubSoldierClass;
            curr.value.pBasicPlacement.value.ubCivilianGroup = curr.value.pDetailedPlacement.value.ubCivilianGroup;
            curr.value.pBasicPlacement.value.fHasKeys = curr.value.pDetailedPlacement.value.fHasKeys;
            curr.value.pBasicPlacement.value.usStartingGridNo = curr.value.pDetailedPlacement.value.sInsertionGridNo;

            curr.value.pBasicPlacement.value.bPatrolCnt = curr.value.pDetailedPlacement.value.bPatrolCnt;
            memcpy(curr.value.pBasicPlacement.value.sPatrolGrid, curr.value.pDetailedPlacement.value.sPatrolGrid, sizeof(INT16) * curr.value.pBasicPlacement.value.bPatrolCnt);

            FileRead(hfile, &usCheckSum, 2, &uiNumBytesRead);
            if (uiNumBytesRead != 2) {
              goto FAIL_LOAD;
            }
            // verify the checksum equation (anti-hack) -- see save
            usFileCheckSum = curr.value.pDetailedPlacement.value.bLife * 7 + curr.value.pDetailedPlacement.value.bLifeMax * 8 - curr.value.pDetailedPlacement.value.bAgility * 2 + curr.value.pDetailedPlacement.value.bDexterity * 1 + curr.value.pDetailedPlacement.value.bExpLevel * 5 - curr.value.pDetailedPlacement.value.bMarksmanship * 9 + curr.value.pDetailedPlacement.value.bMedical * 10 + curr.value.pDetailedPlacement.value.bMechanical * 3 + curr.value.pDetailedPlacement.value.bExplosive * 4 + curr.value.pDetailedPlacement.value.bLeadership * 5 + curr.value.pDetailedPlacement.value.bStrength * 7 + curr.value.pDetailedPlacement.value.bWisdom * 11 + curr.value.pDetailedPlacement.value.bMorale * 7 + curr.value.pDetailedPlacement.value.bAIMorale * 3 - curr.value.pDetailedPlacement.value.bBodyType * 7 + 4 * 6 + curr.value.pDetailedPlacement.value.sSectorX * 7 - curr.value.pDetailedPlacement.value.ubSoldierClass * 4 + curr.value.pDetailedPlacement.value.bTeam * 7 + curr.value.pDetailedPlacement.value.bDirection * 5 + curr.value.pDetailedPlacement.value.fOnRoof * 17 + curr.value.pDetailedPlacement.value.sInsertionGridNo * 1 + 3;
            if (usCheckSum != usFileCheckSum) {
              // Hacker has modified the stats on the enemy placements.
              goto FAIL_LOAD;
            }

            if (curr.value.pBasicPlacement.value.bTeam == CIV_TEAM) {
              AddPlacementToWorld(curr);
              break;
            } else {
              // Add preserved placements as long as they don't exceed the actual population.
              switch (curr.value.pBasicPlacement.value.ubSoldierClass) {
                case SOLDIER_CLASS_ELITE:
                  ubNumElites++;
                  if (ubNumElites < ubStrategicElites) {
                    AddPlacementToWorld(curr);
                  }
                  break;
                case SOLDIER_CLASS_ARMY:
                  ubNumTroops++;
                  if (ubNumTroops < ubStrategicTroops) {
                    AddPlacementToWorld(curr);
                  }
                  break;
                case SOLDIER_CLASS_ADMINISTRATOR:
                  ubNumAdmins++;
                  if (ubNumAdmins < ubStrategicAdmins) {
                    AddPlacementToWorld(curr);
                  }
                  break;
                case SOLDIER_CLASS_CREATURE:
                  ubNumCreatures++;
                  if (ubNumCreatures < ubStrategicCreatures) {
                    AddPlacementToWorld(curr);
                  }
                  break;
              }
              break;
            }
          }
        }
      }
      curr = curr.value.next;
    }
  }

  FileRead(hfile, &ubSectorID, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }
  if (ubSectorID != SECTOR(sSectorX, sSectorY)) {
    goto FAIL_LOAD;
  }

  // now add any extra enemies that have arrived since the temp file was made.
  if (ubStrategicTroops > ubNumTroops || ubStrategicElites > ubNumElites || ubStrategicAdmins > ubNumAdmins) {
    ubStrategicTroops = (ubStrategicTroops > ubNumTroops) ? ubStrategicTroops - ubNumTroops : 0;
    ubStrategicElites = (ubStrategicElites > ubNumElites) ? ubStrategicElites - ubNumElites : 0;
    ubStrategicAdmins = (ubStrategicAdmins > ubNumAdmins) ? ubStrategicAdmins - ubNumAdmins : 0;
    AddSoldierInitListEnemyDefenceSoldiers(ubStrategicAdmins, ubStrategicTroops, ubStrategicElites);
  }
  if (ubStrategicCreatures > ubNumCreatures) {
    ubStrategicCreatures; // not sure if this wil ever happen.  If so, needs to be handled.
  }

  // successful
  FileClose(hfile);
  return TRUE;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return FALSE;
}

// OLD SAVE METHOD:  This is the older way of saving the civilian and the enemies placement into a temp file
function SaveEnemySoldiersToTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, ubFirstIdTeam: UINT8, ubLastIdTeam: UINT8, fAppendToFile: BOOLEAN): BOOLEAN {
  let curr: Pointer<SOLDIERINITNODE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;
  let slots: INT32 = 0;
  let iSlotsAlreadyInUse: INT32 = 0;
  let uiNumBytesWritten: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let pSchedule: Pointer<SCHEDULENODE>;
  let usCheckSum: UINT16;
  let zMapName: CHAR8[] /* [128] */;
  let ubSectorID: UINT8;

  // STEP ONE:  Prep the soldiers for saving...

  // modify the map's soldier init list to reflect the changes to the member's still alive...
  for (i = gTacticalStatus.Team[ubFirstIdTeam].bFirstID; i <= gTacticalStatus.Team[ubLastIdTeam].bLastID; i++) {
    pSoldier = MercPtrs[i];

    if (pSoldier.value.bActive /*&& pSoldier->bInSector*/ && pSoldier.value.bLife) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.value.pSoldier != pSoldier) {
        curr = curr.value.next;
      }
      if (curr && curr.value.pSoldier == pSoldier && pSoldier.value.ubProfile == NO_PROFILE) {
        // found a match.

        if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
          if (!curr.value.pDetailedPlacement) {
            // need to upgrade the placement to detailed placement
            curr.value.pBasicPlacement.value.fDetailedPlacement = TRUE;
            curr.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
            memset(curr.value.pDetailedPlacement, 0, sizeof(SOLDIERCREATE_STRUCT));
          }

          // Copy over the data of the soldier.
          curr.value.pDetailedPlacement.value.ubProfile = NO_PROFILE;
          curr.value.pDetailedPlacement.value.bLife = pSoldier.value.bLife;
          curr.value.pDetailedPlacement.value.bLifeMax = pSoldier.value.bLifeMax;
          curr.value.pDetailedPlacement.value.bAgility = pSoldier.value.bAgility;
          curr.value.pDetailedPlacement.value.bDexterity = pSoldier.value.bDexterity;
          curr.value.pDetailedPlacement.value.bExpLevel = pSoldier.value.bExpLevel;
          curr.value.pDetailedPlacement.value.bMarksmanship = pSoldier.value.bMarksmanship;
          curr.value.pDetailedPlacement.value.bMedical = pSoldier.value.bMedical;
          curr.value.pDetailedPlacement.value.bMechanical = pSoldier.value.bMechanical;
          curr.value.pDetailedPlacement.value.bExplosive = pSoldier.value.bExplosive;
          curr.value.pDetailedPlacement.value.bLeadership = pSoldier.value.bLeadership;
          curr.value.pDetailedPlacement.value.bStrength = pSoldier.value.bStrength;
          curr.value.pDetailedPlacement.value.bWisdom = pSoldier.value.bWisdom;
          curr.value.pDetailedPlacement.value.bAttitude = pSoldier.value.bAttitude;
          curr.value.pDetailedPlacement.value.bOrders = pSoldier.value.bOrders;
          curr.value.pDetailedPlacement.value.bMorale = pSoldier.value.bMorale;
          curr.value.pDetailedPlacement.value.bAIMorale = pSoldier.value.bAIMorale;
          curr.value.pDetailedPlacement.value.bBodyType = pSoldier.value.ubBodyType;
          curr.value.pDetailedPlacement.value.ubCivilianGroup = pSoldier.value.ubCivilianGroup;

          // If the soldier has a real schedule (not a default schedule), then store it.
          // All other cases should be 0.
          curr.value.pDetailedPlacement.value.ubScheduleID = 0;
          if (pSoldier.value.ubScheduleID) {
            pSchedule = GetSchedule(pSoldier.value.ubScheduleID);
            if (pSchedule && !(pSchedule.value.usFlags & SCHEDULE_FLAGS_TEMPORARY)) {
              curr.value.pDetailedPlacement.value.ubScheduleID = pSoldier.value.ubScheduleID;
            }
          }

          curr.value.pDetailedPlacement.value.fHasKeys = pSoldier.value.bHasKeys;
          curr.value.pDetailedPlacement.value.sSectorX = pSoldier.value.sSectorX;
          curr.value.pDetailedPlacement.value.sSectorY = pSoldier.value.sSectorY;
          curr.value.pDetailedPlacement.value.bSectorZ = pSoldier.value.bSectorZ;
          curr.value.pDetailedPlacement.value.ubSoldierClass = pSoldier.value.ubSoldierClass;
          curr.value.pDetailedPlacement.value.bTeam = pSoldier.value.bTeam;
          curr.value.pDetailedPlacement.value.bDirection = pSoldier.value.bDirection;

          // we don't want the player to think that all the enemies start in the exact position when we
          // left the map, so randomize the start locations either current position or original position.
          if (PreRandom(2)) {
            // use current position
            curr.value.pDetailedPlacement.value.fOnRoof = pSoldier.value.bLevel;
            curr.value.pDetailedPlacement.value.sInsertionGridNo = pSoldier.value.sGridNo;
          } else {
            // use original position
            curr.value.pDetailedPlacement.value.fOnRoof = curr.value.pBasicPlacement.value.fOnRoof;
            curr.value.pDetailedPlacement.value.sInsertionGridNo = curr.value.pBasicPlacement.value.usStartingGridNo;
          }

          swprintf(curr.value.pDetailedPlacement.value.name, pSoldier.value.name);

          // Copy patrol points
          curr.value.pDetailedPlacement.value.bPatrolCnt = pSoldier.value.bPatrolCnt;
          memcpy(curr.value.pDetailedPlacement.value.sPatrolGrid, pSoldier.value.usPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);

          // copy colors for soldier based on the body type.
          sprintf(curr.value.pDetailedPlacement.value.HeadPal, pSoldier.value.HeadPal);
          sprintf(curr.value.pDetailedPlacement.value.VestPal, pSoldier.value.VestPal);
          sprintf(curr.value.pDetailedPlacement.value.SkinPal, pSoldier.value.SkinPal);
          sprintf(curr.value.pDetailedPlacement.value.PantsPal, pSoldier.value.PantsPal);
          sprintf(curr.value.pDetailedPlacement.value.MiscPal, pSoldier.value.MiscPal);

          // copy soldier's inventory
          memcpy(curr.value.pDetailedPlacement.value.Inv, pSoldier.value.inv, sizeof(OBJECTTYPE) * NUM_INV_SLOTS);
        }

        // DONE, now increment the counter, so we know how many there are.
        slots++;
      }
    }
  }
  if (!slots) {
    // No need to save anything, so return successfully
    RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
    return TRUE;
  }

  // STEP TWO:  Set up the temp file to write to.

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // if the file doesnt exist
  if (FileSize(zMapName) == 0) {
    // set it so we are not appending
    fAppendToFile = FALSE;
  }

  // if we are to append to the file
  if (fAppendToFile) {
    // Open the file for writing, Create it if it doesnt exist
    hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_ALWAYS, FALSE);
    if (hfile == 0) {
      // Error opening map modification file
      return FALSE;
    }

    // advance for bytes and read the #of slots already used
    FileSeek(hfile, 4, FILE_SEEK_FROM_START);

    FileRead(hfile, &iSlotsAlreadyInUse, 4, &uiNumBytesWritten);
    if (uiNumBytesWritten != 4) {
      goto FAIL_SAVE;
    }

    FileClose(hfile);

    // Open the file for writing, Create it if it doesnt exist
    hfile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
    if (hfile == 0) {
      // Error opening map modification file
      return FALSE;
    }

    slots += iSlotsAlreadyInUse;

    // advance for bytes and read the #of slots already used
    FileSeek(hfile, 4, FILE_SEEK_FROM_START);
    FileWrite(hfile, &slots, 4, &uiNumBytesWritten);
    if (uiNumBytesWritten != 4) {
      goto FAIL_SAVE;
    }

    FileSeek(hfile, 0, FILE_SEEK_FROM_END);
  } else {
    // Open the file for writing, Create it if it doesnt exist
    hfile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
    if (hfile == 0) {
      // Error opening map modification file
      return FALSE;
    }
  }

  // if we are to append to the file
  if (!fAppendToFile) {
    FileWrite(hfile, &sSectorY, 2, &uiNumBytesWritten);
    if (uiNumBytesWritten != 2) {
      goto FAIL_SAVE;
    }

    // STEP THREE:  Save the data
    SaveSoldierInitListLinks(hfile);

    FileWrite(hfile, &sSectorX, 2, &uiNumBytesWritten);
    if (uiNumBytesWritten != 2) {
      goto FAIL_SAVE;
    }

    // This check may appear confusing.  It is intended to abort if the player is saving the game.  It is only
    // supposed to preserve the links to the placement list, so when we finally do leave the level with enemies remaining,
    // we will need the links that are only added when the map is loaded, and are normally lost when restoring a save.
    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      slots = 0;
    }

    FileWrite(hfile, &slots, 4, &uiNumBytesWritten);
    if (uiNumBytesWritten != 4) {
      goto FAIL_SAVE;
    }

    uiTimeStamp = GetWorldTotalMin();
    FileWrite(hfile, &uiTimeStamp, 4, &uiNumBytesWritten);
    if (uiNumBytesWritten != 4) {
      goto FAIL_SAVE;
    }

    FileWrite(hfile, &bSectorZ, 1, &uiNumBytesWritten);
    if (uiNumBytesWritten != 1) {
      goto FAIL_SAVE;
    }
  }

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    // if we are saving the game, we don't need to preserve the soldier information, just
    // preserve the links to the placement list.
    slots = 0;
    FileClose(hfile);
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
    return TRUE;
  }

  for (i = gTacticalStatus.Team[ubFirstIdTeam].bFirstID; i <= gTacticalStatus.Team[ubLastIdTeam].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bActive /*&& pSoldier->bInSector*/ && pSoldier.value.bLife) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.value.pSoldier != pSoldier) {
        curr = curr.value.next;
      }
      if (curr && curr.value.pSoldier == pSoldier && pSoldier.value.ubProfile == NO_PROFILE) {
        // found a match.
        FileWrite(hfile, curr.value.pDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), &uiNumBytesWritten);
        if (uiNumBytesWritten != sizeof(SOLDIERCREATE_STRUCT)) {
          goto FAIL_SAVE;
        }
        // insert a checksum equation (anti-hack)
        usCheckSum = curr.value.pDetailedPlacement.value.bLife * 7 + curr.value.pDetailedPlacement.value.bLifeMax * 8 - curr.value.pDetailedPlacement.value.bAgility * 2 + curr.value.pDetailedPlacement.value.bDexterity * 1 + curr.value.pDetailedPlacement.value.bExpLevel * 5 - curr.value.pDetailedPlacement.value.bMarksmanship * 9 + curr.value.pDetailedPlacement.value.bMedical * 10 + curr.value.pDetailedPlacement.value.bMechanical * 3 + curr.value.pDetailedPlacement.value.bExplosive * 4 + curr.value.pDetailedPlacement.value.bLeadership * 5 + curr.value.pDetailedPlacement.value.bStrength * 7 + curr.value.pDetailedPlacement.value.bWisdom * 11 + curr.value.pDetailedPlacement.value.bMorale * 7 + curr.value.pDetailedPlacement.value.bAIMorale * 3 - curr.value.pDetailedPlacement.value.bBodyType * 7 + 4 * 6 + curr.value.pDetailedPlacement.value.sSectorX * 7 - curr.value.pDetailedPlacement.value.ubSoldierClass * 4 + curr.value.pDetailedPlacement.value.bTeam * 7 + curr.value.pDetailedPlacement.value.bDirection * 5 + curr.value.pDetailedPlacement.value.fOnRoof * 17 + curr.value.pDetailedPlacement.value.sInsertionGridNo * 1 + 3;
        FileWrite(hfile, &usCheckSum, 2, &uiNumBytesWritten);
        if (uiNumBytesWritten != 2) {
          goto FAIL_SAVE;
        }
      }
    }
  }

  // if we are to append to the file
  if (!fAppendToFile) {
    ubSectorID = SECTOR(sSectorX, sSectorY);
    FileWrite(hfile, &ubSectorID, 1, &uiNumBytesWritten);
    if (uiNumBytesWritten != 1) {
      goto FAIL_SAVE;
    }
  }

  FileClose(hfile);
  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
  return TRUE;

FAIL_SAVE:
  FileClose(hfile);
  return FALSE;
}

function NewWayOfLoadingEnemySoldiersFromTempFile(): BOOLEAN {
  let curr: Pointer<SOLDIERINITNODE>;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let usFileCheckSum: UINT16;
  let zMapName: CHAR8[] /* [128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  let ubNumElites: UINT8 = 0;
  let ubNumTroops: UINT8 = 0;
  let ubNumAdmins: UINT8 = 0;
  let ubNumCreatures: UINT8 = 0;
  let ubStrategicElites: UINT8;
  let ubStrategicTroops: UINT8;
  let ubStrategicAdmins: UINT8;
  let ubStrategicCreatures: UINT8;

  gfRestoringEnemySoldiersFromTempFile = TRUE;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Count the number of enemies ( elites, regulars, admins and creatures ) that are in the temp file.

  if (gbWorldSectorZ) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pSector) {
      goto FAIL_LOAD;
    }
  } else {
    let pSector: Pointer<SECTORINFO>;
    pSector = &SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];

    ubNumElites = pSector.value.ubNumElites;
    ubNumTroops = pSector.value.ubNumTroops;
    ubNumAdmins = pSector.value.ubNumAdmins;
    ubNumCreatures = pSector.value.ubNumCreatures;
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Get the number of enemies form the temp file
    CountNumberOfElitesRegularsAdminsAndCreaturesFromEnemySoldiersTempFile(&ubStrategicElites, &ubStrategicTroops, &ubStrategicAdmins, &ubStrategicCreatures);

    // If any of the counts differ from what is in memory
    if (ubStrategicElites != ubNumElites || ubStrategicTroops != ubNumTroops || ubStrategicAdmins != ubNumAdmins || ubStrategicCreatures != ubNumCreatures) {
      // remove the file
      RemoveEnemySoldierTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      return TRUE;
    }
  }

  // reset
  ubNumElites = ubNumTroops = ubNumAdmins = ubNumCreatures = 0;

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hfile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  FileRead(hfile, &sSectorY, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorY != sSectorY) {
    goto FAIL_LOAD;
  }

  //	LoadSoldierInitListLinks( hfile );
  NewWayOfLoadingEnemySoldierInitListLinks(hfile);

  // STEP THREE:  read the data

  FileRead(hfile, &sSectorX, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorX != sSectorX) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &slots, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &uiTimeStamp, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &bSectorZ, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }
  if (gbWorldSectorZ != bSectorZ) {
    goto FAIL_LOAD;
  }

  if (GetWorldTotalMin() > uiTimeStamp + 300) {
    // the file has aged.  Use the regular method for adding soldiers.
    FileClose(hfile);
    RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
    gfRestoringEnemySoldiersFromTempFile = FALSE;
    return TRUE;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    gfRestoringEnemySoldiersFromTempFile = FALSE;
    FileClose(hfile);
    return TRUE;
  }

  if (slots < 0 || slots >= 64) {
    // bad IO!
    goto FAIL_LOAD;
  }

  // For all the enemy slots (enemy/creature), clear the fPriorityExistance flag.  We will use these flags
  // to determine which slots have been modified as we load the data into the map pristine soldier init list.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM || curr.value.pBasicPlacement.value.bTeam == CREATURE_TEAM) {
        curr.value.pBasicPlacement.value.fPriorityExistance = FALSE;
      }
    }
    curr = curr.value.next;
  }

  // get the number of enemies in this sector.
  if (bSectorZ) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, bSectorZ);
    if (!pSector) {
      goto FAIL_LOAD;
    }
    ubStrategicElites = pSector.value.ubNumElites;
    ubStrategicTroops = pSector.value.ubNumTroops;
    ubStrategicAdmins = pSector.value.ubNumAdmins;
    ubStrategicCreatures = pSector.value.ubNumCreatures;
  } else {
    let pSector: Pointer<SECTORINFO>;
    pSector = &SectorInfo[SECTOR(sSectorX, sSectorY)];
    ubStrategicCreatures = pSector.value.ubNumCreatures;
    GetNumberOfEnemiesInSector(sSectorX, sSectorY, &ubStrategicAdmins, &ubStrategicTroops, &ubStrategicElites);
  }

  for (i = 0; i < slots; i++) {
    FileRead(hfile, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), &uiNumBytesRead);
    if (uiNumBytesRead != sizeof(SOLDIERCREATE_STRUCT)) {
      goto FAIL_LOAD;
    }
    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.value.pBasicPlacement.value.fPriorityExistance) {
        if (curr.value.pBasicPlacement.value.bTeam == tempDetailedPlacement.bTeam) {
          curr.value.pBasicPlacement.value.fPriorityExistance = TRUE;
          if (!curr.value.pDetailedPlacement) {
            // need to upgrade the placement to detailed placement
            curr.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
          }
          // now replace the map pristine placement info with the temp map file version..
          memcpy(curr.value.pDetailedPlacement, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));

          curr.value.pBasicPlacement.value.fPriorityExistance = TRUE;
          curr.value.pBasicPlacement.value.bDirection = curr.value.pDetailedPlacement.value.bDirection;
          curr.value.pBasicPlacement.value.bOrders = curr.value.pDetailedPlacement.value.bOrders;
          curr.value.pBasicPlacement.value.bAttitude = curr.value.pDetailedPlacement.value.bAttitude;
          curr.value.pBasicPlacement.value.bBodyType = curr.value.pDetailedPlacement.value.bBodyType;
          curr.value.pBasicPlacement.value.fOnRoof = curr.value.pDetailedPlacement.value.fOnRoof;
          curr.value.pBasicPlacement.value.ubSoldierClass = curr.value.pDetailedPlacement.value.ubSoldierClass;
          curr.value.pBasicPlacement.value.ubCivilianGroup = curr.value.pDetailedPlacement.value.ubCivilianGroup;
          curr.value.pBasicPlacement.value.fHasKeys = curr.value.pDetailedPlacement.value.fHasKeys;
          curr.value.pBasicPlacement.value.usStartingGridNo = curr.value.pDetailedPlacement.value.sInsertionGridNo;

          curr.value.pBasicPlacement.value.bPatrolCnt = curr.value.pDetailedPlacement.value.bPatrolCnt;
          memcpy(curr.value.pBasicPlacement.value.sPatrolGrid, curr.value.pDetailedPlacement.value.sPatrolGrid, sizeof(INT16) * curr.value.pBasicPlacement.value.bPatrolCnt);

          FileRead(hfile, &usCheckSum, 2, &uiNumBytesRead);
          if (uiNumBytesRead != 2) {
            goto FAIL_LOAD;
          }
          // verify the checksum equation (anti-hack) -- see save
          usFileCheckSum = curr.value.pDetailedPlacement.value.bLife * 7 + curr.value.pDetailedPlacement.value.bLifeMax * 8 - curr.value.pDetailedPlacement.value.bAgility * 2 + curr.value.pDetailedPlacement.value.bDexterity * 1 + curr.value.pDetailedPlacement.value.bExpLevel * 5 - curr.value.pDetailedPlacement.value.bMarksmanship * 9 + curr.value.pDetailedPlacement.value.bMedical * 10 + curr.value.pDetailedPlacement.value.bMechanical * 3 + curr.value.pDetailedPlacement.value.bExplosive * 4 + curr.value.pDetailedPlacement.value.bLeadership * 5 + curr.value.pDetailedPlacement.value.bStrength * 7 + curr.value.pDetailedPlacement.value.bWisdom * 11 + curr.value.pDetailedPlacement.value.bMorale * 7 + curr.value.pDetailedPlacement.value.bAIMorale * 3 - curr.value.pDetailedPlacement.value.bBodyType * 7 + 4 * 6 + curr.value.pDetailedPlacement.value.sSectorX * 7 - curr.value.pDetailedPlacement.value.ubSoldierClass * 4 + curr.value.pDetailedPlacement.value.bTeam * 7 + curr.value.pDetailedPlacement.value.bDirection * 5 + curr.value.pDetailedPlacement.value.fOnRoof * 17 + curr.value.pDetailedPlacement.value.sInsertionGridNo * 1 + 3;
          if (usCheckSum != usFileCheckSum) {
            // Hacker has modified the stats on the enemy placements.
            goto FAIL_LOAD;
          }

          // Add preserved placements as long as they don't exceed the actual population.
          switch (curr.value.pBasicPlacement.value.ubSoldierClass) {
            case SOLDIER_CLASS_ELITE:
              ubNumElites++;
              if (ubNumElites <= ubStrategicElites) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
            case SOLDIER_CLASS_ARMY:
              ubNumTroops++;
              if (ubNumTroops <= ubStrategicTroops) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
            case SOLDIER_CLASS_ADMINISTRATOR:
              ubNumAdmins++;
              if (ubNumAdmins <= ubStrategicAdmins) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
            case SOLDIER_CLASS_CREATURE:
              ubNumCreatures++;
              if (ubNumCreatures <= ubStrategicCreatures) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
          }
          break;
        }
      }
      curr = curr.value.next;
    }
  }

  FileRead(hfile, &ubSectorID, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }
  if (ubSectorID != SECTOR(sSectorX, sSectorY)) {
    goto FAIL_LOAD;
  }

  // now add any extra enemies that have arrived since the temp file was made.
  if (ubStrategicTroops > ubNumTroops || ubStrategicElites > ubNumElites || ubStrategicAdmins > ubNumAdmins) {
    ubStrategicTroops = (ubStrategicTroops > ubNumTroops) ? ubStrategicTroops - ubNumTroops : 0;
    ubStrategicElites = (ubStrategicElites > ubNumElites) ? ubStrategicElites - ubNumElites : 0;
    ubStrategicAdmins = (ubStrategicAdmins > ubNumAdmins) ? ubStrategicAdmins - ubNumAdmins : 0;
    AddSoldierInitListEnemyDefenceSoldiers(ubStrategicAdmins, ubStrategicTroops, ubStrategicElites);
  }
  if (ubStrategicCreatures > ubNumCreatures) {
    ubStrategicCreatures; // not sure if this wil ever happen.  If so, needs to be handled.
  }

  // set the number of enemies in the sector
  if (bSectorZ) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pSector) {
      goto FAIL_LOAD;

      /*
                              pSector->ubElitesInBattle = ubStrategicElites;
                              pSector->ubTroopsInBattle = ubStrategicTroops;
                              pSector->ubAdminsInBattle = ubStrategicAdmins;
                              pSector->ubCreaturesInBattle = ubStrategicCreatures;
      */
    }
  } else {
    let pSector: Pointer<SECTORINFO>;
    pSector = &SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
    /*
                    pSector->ubElitesInBattle = ubStrategicElites;
                    pSector->ubTroopsInBattle = ubStrategicTroops;
                    pSector->ubAdminsInBattle = ubStrategicAdmins;
                    pSector->ubCreaturesInBattle = ubStrategicCreatures;
    */
  }

  // if in battle, what about the ubNumInBAttle

  // successful
  FileClose(hfile);
  return TRUE;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return FALSE;
}

function NewWayOfLoadingCiviliansFromTempFile(): BOOLEAN {
  let curr: Pointer<SOLDIERINITNODE>;
  let temp: Pointer<SOLDIERINITNODE>;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let uiTimeSinceLastLoaded: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let usFileCheckSum: UINT16;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: CHAR8[] /* [128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  let ubNumElites: UINT8 = 0;
  let ubNumTroops: UINT8 = 0;
  let ubNumAdmins: UINT8 = 0;
  let ubNumCreatures: UINT8 = 0;
  let fDeleted: BOOLEAN;
  //	UINT8 ubStrategicElites, ubStrategicTroops, ubStrategicAdmins, ubStrategicCreatures;

  gfRestoringCiviliansFromTempFile = TRUE;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  // GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  // sprintf( zMapName, "%s\\c_%s", MAPS_DIR, zTempName);
  GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hfile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  FileRead(hfile, &sSectorY, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorY != sSectorY) {
    goto FAIL_LOAD;
  }

  // LoadSoldierInitListLinks( hfile );
  NewWayOfLoadingCivilianInitListLinks(hfile);

  // STEP THREE:  read the data
  FileRead(hfile, &sSectorX, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorX != sSectorX) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &slots, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &uiTimeStamp, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  uiTimeSinceLastLoaded = GetWorldTotalMin() - uiTimeStamp;

  FileRead(hfile, &bSectorZ, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }
  if (gbWorldSectorZ != bSectorZ) {
    goto FAIL_LOAD;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    gfRestoringCiviliansFromTempFile = FALSE;
    FileClose(hfile);
    return TRUE;
  }
  if (slots < 0 || slots >= 64) {
// bad IO!
    goto FAIL_LOAD;
  }

  // For all the enemy slots (enemy/creature), clear the fPriorityExistance flag.  We will use these flags
  // to determine which slots have been modified as we load the data into the map pristine soldier init list.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (curr.value.pBasicPlacement.value.bTeam == CIV_TEAM) {
        curr.value.pBasicPlacement.value.fPriorityExistance = FALSE;
      }
    }
    curr = curr.value.next;
  }

  for (i = 0; i < slots; i++) {
    FileRead(hfile, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), &uiNumBytesRead);
    if (uiNumBytesRead != sizeof(SOLDIERCREATE_STRUCT)) {
      goto FAIL_LOAD;
    }
    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.value.pBasicPlacement.value.fPriorityExistance) {
        if (!curr.value.pDetailedPlacement || curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == NO_PROFILE) {
          if (curr.value.pBasicPlacement.value.bTeam == tempDetailedPlacement.bTeam) {
            curr.value.pBasicPlacement.value.fPriorityExistance = TRUE;

            if (!curr.value.pDetailedPlacement) {
              // need to upgrade the placement to detailed placement
              curr.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
            }
            // now replace the map pristine placement info with the temp map file version..
            memcpy(curr.value.pDetailedPlacement, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT));

            curr.value.pBasicPlacement.value.fPriorityExistance = TRUE;
            curr.value.pBasicPlacement.value.bDirection = curr.value.pDetailedPlacement.value.bDirection;
            curr.value.pBasicPlacement.value.bOrders = curr.value.pDetailedPlacement.value.bOrders;
            curr.value.pBasicPlacement.value.bAttitude = curr.value.pDetailedPlacement.value.bAttitude;
            curr.value.pBasicPlacement.value.bBodyType = curr.value.pDetailedPlacement.value.bBodyType;
            curr.value.pBasicPlacement.value.fOnRoof = curr.value.pDetailedPlacement.value.fOnRoof;
            curr.value.pBasicPlacement.value.ubSoldierClass = curr.value.pDetailedPlacement.value.ubSoldierClass;
            curr.value.pBasicPlacement.value.ubCivilianGroup = curr.value.pDetailedPlacement.value.ubCivilianGroup;
            curr.value.pBasicPlacement.value.fHasKeys = curr.value.pDetailedPlacement.value.fHasKeys;
            curr.value.pBasicPlacement.value.usStartingGridNo = curr.value.pDetailedPlacement.value.sInsertionGridNo;

            curr.value.pBasicPlacement.value.bPatrolCnt = curr.value.pDetailedPlacement.value.bPatrolCnt;
            memcpy(curr.value.pBasicPlacement.value.sPatrolGrid, curr.value.pDetailedPlacement.value.sPatrolGrid, sizeof(INT16) * curr.value.pBasicPlacement.value.bPatrolCnt);

            FileRead(hfile, &usCheckSum, 2, &uiNumBytesRead);
            if (uiNumBytesRead != 2) {
              goto FAIL_LOAD;
            }
            // verify the checksum equation (anti-hack) -- see save
            usFileCheckSum = curr.value.pDetailedPlacement.value.bLife * 7 + curr.value.pDetailedPlacement.value.bLifeMax * 8 - curr.value.pDetailedPlacement.value.bAgility * 2 + curr.value.pDetailedPlacement.value.bDexterity * 1 + curr.value.pDetailedPlacement.value.bExpLevel * 5 - curr.value.pDetailedPlacement.value.bMarksmanship * 9 + curr.value.pDetailedPlacement.value.bMedical * 10 + curr.value.pDetailedPlacement.value.bMechanical * 3 + curr.value.pDetailedPlacement.value.bExplosive * 4 + curr.value.pDetailedPlacement.value.bLeadership * 5 + curr.value.pDetailedPlacement.value.bStrength * 7 + curr.value.pDetailedPlacement.value.bWisdom * 11 + curr.value.pDetailedPlacement.value.bMorale * 7 + curr.value.pDetailedPlacement.value.bAIMorale * 3 - curr.value.pDetailedPlacement.value.bBodyType * 7 + 4 * 6 + curr.value.pDetailedPlacement.value.sSectorX * 7 - curr.value.pDetailedPlacement.value.ubSoldierClass * 4 + curr.value.pDetailedPlacement.value.bTeam * 7 + curr.value.pDetailedPlacement.value.bDirection * 5 + curr.value.pDetailedPlacement.value.fOnRoof * 17 + curr.value.pDetailedPlacement.value.sInsertionGridNo * 1 + 3;
            if (usCheckSum != usFileCheckSum) {
// Hacker has modified the stats on the enemy placements.
              goto FAIL_LOAD;
            }

            if (curr.value.pDetailedPlacement.value.bLife < curr.value.pDetailedPlacement.value.bLifeMax) {
              // Add 4 life for every hour that passes.
              let iNewLife: INT32;
              iNewLife = curr.value.pDetailedPlacement.value.bLife + uiTimeSinceLastLoaded / 15;
              iNewLife = min(curr.value.pDetailedPlacement.value.bLifeMax, iNewLife);
              curr.value.pDetailedPlacement.value.bLife = iNewLife;
            }

            if (curr.value.pBasicPlacement.value.bTeam == CIV_TEAM) {
              // def:				AddPlacementToWorld( curr );
              break;
            }
          }
        }
      }
      curr = curr.value.next;
    }
  }

  // now remove any non-priority placement which matches the conditions!
  curr = gSoldierInitHead;
  fDeleted = FALSE;
  while (curr) {
    if (!curr.value.pBasicPlacement.value.fPriorityExistance) {
      if (!curr.value.pDetailedPlacement || curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubProfile == NO_PROFILE) {
        if (curr.value.pBasicPlacement.value.bTeam == tempDetailedPlacement.bTeam) {
          // Save pointer to the next guy in the list
          // and after deleting, set the 'curr' to that guy
          temp = curr.value.next;
          RemoveSoldierNodeFromInitList(curr);
          curr = temp;
          fDeleted = TRUE;
        }
      }
    }
    if (fDeleted) {
      // we've already done our pointer update so don't advance the pointer
      fDeleted = FALSE;
    } else {
      curr = curr.value.next;
    }
  }

  FileRead(hfile, &ubSectorID, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }

  /*
  if( ubSectorID != SECTOR( sSectorX, sSectorY ) )
  {
          #ifdef JA2TESTVERSION
                  sprintf( zReason, "Civilian -- ubSectorID mismatch.  KM" );
          #endif
          goto FAIL_LOAD;
  }
  */

  // successful
  FileClose(hfile);
  return TRUE;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return FALSE;
}

// If we are saving a game and we are in the sector, we will need to preserve the links between the
// soldiers and the soldier init list.  Otherwise, the temp file will be deleted.
function NewWayOfSavingEnemyAndCivliansToTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, fEnemy: BOOLEAN, fValidateOnly: BOOLEAN): BOOLEAN {
  let curr: Pointer<SOLDIERINITNODE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesWritten: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: CHAR8[] /* [128] */;
  let ubSectorID: UINT8;
  let usCheckSum: UINT16;

  let ubStartID: UINT8 = 0;
  let ubEndID: UINT8 = 0;

  // if we are saving the enemy info to the enemy temp file
  if (fEnemy) {
    ubStartID = ENEMY_TEAM;
    ubEndID = CREATURE_TEAM;
  }

  // else its the civilian team
  else {
    ubStartID = CIV_TEAM;
    ubEndID = CIV_TEAM;
  }

  // STEP ONE:  Prep the soldiers for saving...

  // modify the map's soldier init list to reflect the changes to the member's still alive...
  for (i = gTacticalStatus.Team[ubStartID].bFirstID; i <= gTacticalStatus.Team[ubEndID].bLastID; i++) {
    pSoldier = MercPtrs[i];

    // make sure the person is active, alive, in the sector, and is not a profiled person
    if (pSoldier.value.bActive /*&& pSoldier->bInSector*/ && pSoldier.value.bLife && pSoldier.value.ubProfile == NO_PROFILE) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.value.pSoldier != pSoldier) {
        curr = curr.value.next;
      }
      if (curr && curr.value.pSoldier == pSoldier && pSoldier.value.ubProfile == NO_PROFILE) {
        // found a match.

        if (!fValidateOnly) {
          if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
            if (!curr.value.pDetailedPlacement) {
              // need to upgrade the placement to detailed placement
              curr.value.pBasicPlacement.value.fDetailedPlacement = TRUE;
              curr.value.pDetailedPlacement = MemAlloc(sizeof(SOLDIERCREATE_STRUCT));
              memset(curr.value.pDetailedPlacement, 0, sizeof(SOLDIERCREATE_STRUCT));
            }

            // Copy over the data of the soldier.
            curr.value.pDetailedPlacement.value.ubProfile = NO_PROFILE;
            curr.value.pDetailedPlacement.value.bLife = pSoldier.value.bLife;
            curr.value.pDetailedPlacement.value.bLifeMax = pSoldier.value.bLifeMax;
            curr.value.pDetailedPlacement.value.bAgility = pSoldier.value.bAgility;
            curr.value.pDetailedPlacement.value.bDexterity = pSoldier.value.bDexterity;
            curr.value.pDetailedPlacement.value.bExpLevel = pSoldier.value.bExpLevel;
            curr.value.pDetailedPlacement.value.bMarksmanship = pSoldier.value.bMarksmanship;
            curr.value.pDetailedPlacement.value.bMedical = pSoldier.value.bMedical;
            curr.value.pDetailedPlacement.value.bMechanical = pSoldier.value.bMechanical;
            curr.value.pDetailedPlacement.value.bExplosive = pSoldier.value.bExplosive;
            curr.value.pDetailedPlacement.value.bLeadership = pSoldier.value.bLeadership;
            curr.value.pDetailedPlacement.value.bStrength = pSoldier.value.bStrength;
            curr.value.pDetailedPlacement.value.bWisdom = pSoldier.value.bWisdom;
            curr.value.pDetailedPlacement.value.bAttitude = pSoldier.value.bAttitude;
            curr.value.pDetailedPlacement.value.bOrders = pSoldier.value.bOrders;
            curr.value.pDetailedPlacement.value.bMorale = pSoldier.value.bMorale;
            curr.value.pDetailedPlacement.value.bAIMorale = pSoldier.value.bAIMorale;
            curr.value.pDetailedPlacement.value.bBodyType = pSoldier.value.ubBodyType;
            curr.value.pDetailedPlacement.value.ubCivilianGroup = pSoldier.value.ubCivilianGroup;
            curr.value.pDetailedPlacement.value.ubScheduleID = pSoldier.value.ubScheduleID;
            curr.value.pDetailedPlacement.value.fHasKeys = pSoldier.value.bHasKeys;
            curr.value.pDetailedPlacement.value.sSectorX = pSoldier.value.sSectorX;
            curr.value.pDetailedPlacement.value.sSectorY = pSoldier.value.sSectorY;
            curr.value.pDetailedPlacement.value.bSectorZ = pSoldier.value.bSectorZ;
            curr.value.pDetailedPlacement.value.ubSoldierClass = pSoldier.value.ubSoldierClass;
            curr.value.pDetailedPlacement.value.bTeam = pSoldier.value.bTeam;
            curr.value.pDetailedPlacement.value.bDirection = pSoldier.value.bDirection;

            // we don't want the player to think that all the enemies start in the exact position when we
            // left the map, so randomize the start locations either current position or original position.
            if (PreRandom(2)) {
              // use current position
              curr.value.pDetailedPlacement.value.fOnRoof = pSoldier.value.bLevel;
              curr.value.pDetailedPlacement.value.sInsertionGridNo = pSoldier.value.sGridNo;
            } else {
              // use original position
              curr.value.pDetailedPlacement.value.fOnRoof = curr.value.pBasicPlacement.value.fOnRoof;
              curr.value.pDetailedPlacement.value.sInsertionGridNo = curr.value.pBasicPlacement.value.usStartingGridNo;
            }

            swprintf(curr.value.pDetailedPlacement.value.name, pSoldier.value.name);

            // Copy patrol points
            curr.value.pDetailedPlacement.value.bPatrolCnt = pSoldier.value.bPatrolCnt;
            memcpy(curr.value.pDetailedPlacement.value.sPatrolGrid, pSoldier.value.usPatrolGrid, sizeof(INT16) * MAXPATROLGRIDS);

            // copy colors for soldier based on the body type.
            sprintf(curr.value.pDetailedPlacement.value.HeadPal, pSoldier.value.HeadPal);
            sprintf(curr.value.pDetailedPlacement.value.VestPal, pSoldier.value.VestPal);
            sprintf(curr.value.pDetailedPlacement.value.SkinPal, pSoldier.value.SkinPal);
            sprintf(curr.value.pDetailedPlacement.value.PantsPal, pSoldier.value.PantsPal);
            sprintf(curr.value.pDetailedPlacement.value.MiscPal, pSoldier.value.MiscPal);

            // copy soldier's inventory
            memcpy(curr.value.pDetailedPlacement.value.Inv, pSoldier.value.inv, sizeof(OBJECTTYPE) * NUM_INV_SLOTS);
          }
        }

        // DONE, now increment the counter, so we know how many there are.
        slots++;
      }
    }
  }

  if (!slots) {
    if (fEnemy) {
      // No need to save anything, so return successfully
      RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
      return TRUE;
    } else {
      // No need to save anything, so return successfully
      RemoveCivilianTempFile(sSectorX, sSectorY, bSectorZ);
      return TRUE;
    }
  }

  if (fValidateOnly) {
    return TRUE;
  }

  // STEP TWO:  Set up the temp file to write to.

  // Convert the current sector location into a file name
  // GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  if (fEnemy) {
    // add the 'e' for 'Enemy preserved' to the front of the map name
    // sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);
    GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);
  } else {
    // add the 'e' for 'Enemy preserved' to the front of the map name
    // sprintf( zMapName, "%s\\c_%s", MAPS_DIR, zTempName);
    GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);
  }

  // Open the file for writing, Create it if it doesnt exist
  hfile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hfile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  FileWrite(hfile, &sSectorY, 2, &uiNumBytesWritten);
  if (uiNumBytesWritten != 2) {
    goto FAIL_SAVE;
  }

  // STEP THREE:  Save the data

  // this works for both civs and enemies
  SaveSoldierInitListLinks(hfile);

  FileWrite(hfile, &sSectorX, 2, &uiNumBytesWritten);
  if (uiNumBytesWritten != 2) {
    goto FAIL_SAVE;
  }

  // This check may appear confusing.  It is intended to abort if the player is saving the game.  It is only
  // supposed to preserve the links to the placement list, so when we finally do leave the level with enemies remaining,
  // we will need the links that are only added when the map is loaded, and are normally lost when restoring a save.
  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    slots = 0;
  }

  FileWrite(hfile, &slots, 4, &uiNumBytesWritten);
  if (uiNumBytesWritten != 4) {
    goto FAIL_SAVE;
  }

  uiTimeStamp = GetWorldTotalMin();
  FileWrite(hfile, &uiTimeStamp, 4, &uiNumBytesWritten);
  if (uiNumBytesWritten != 4) {
    goto FAIL_SAVE;
  }

  FileWrite(hfile, &bSectorZ, 1, &uiNumBytesWritten);
  if (uiNumBytesWritten != 1) {
    goto FAIL_SAVE;
  }

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    // if we are saving the game, we don't need to preserve the soldier information, just
    // preserve the links to the placement list.
    slots = 0;
    FileClose(hfile);

    if (fEnemy) {
      SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
    } else {
      SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
    }
    return TRUE;
  }

  for (i = gTacticalStatus.Team[ubStartID].bFirstID; i <= gTacticalStatus.Team[ubEndID].bLastID; i++) {
    pSoldier = MercPtrs[i];
    // CJC: note that bInSector is not required; the civ could be offmap!
    if (pSoldier.value.bActive /*&& pSoldier->bInSector*/ && pSoldier.value.bLife) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.value.pSoldier != pSoldier) {
        curr = curr.value.next;
      }
      if (curr && curr.value.pSoldier == pSoldier && pSoldier.value.ubProfile == NO_PROFILE) {
        // found a match.
        FileWrite(hfile, curr.value.pDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), &uiNumBytesWritten);
        if (uiNumBytesWritten != sizeof(SOLDIERCREATE_STRUCT)) {
          goto FAIL_SAVE;
        }
        // insert a checksum equation (anti-hack)
        usCheckSum = curr.value.pDetailedPlacement.value.bLife * 7 + curr.value.pDetailedPlacement.value.bLifeMax * 8 - curr.value.pDetailedPlacement.value.bAgility * 2 + curr.value.pDetailedPlacement.value.bDexterity * 1 + curr.value.pDetailedPlacement.value.bExpLevel * 5 - curr.value.pDetailedPlacement.value.bMarksmanship * 9 + curr.value.pDetailedPlacement.value.bMedical * 10 + curr.value.pDetailedPlacement.value.bMechanical * 3 + curr.value.pDetailedPlacement.value.bExplosive * 4 + curr.value.pDetailedPlacement.value.bLeadership * 5 + curr.value.pDetailedPlacement.value.bStrength * 7 + curr.value.pDetailedPlacement.value.bWisdom * 11 + curr.value.pDetailedPlacement.value.bMorale * 7 + curr.value.pDetailedPlacement.value.bAIMorale * 3 - curr.value.pDetailedPlacement.value.bBodyType * 7 + 4 * 6 + curr.value.pDetailedPlacement.value.sSectorX * 7 - curr.value.pDetailedPlacement.value.ubSoldierClass * 4 + curr.value.pDetailedPlacement.value.bTeam * 7 + curr.value.pDetailedPlacement.value.bDirection * 5 + curr.value.pDetailedPlacement.value.fOnRoof * 17 + curr.value.pDetailedPlacement.value.sInsertionGridNo * 1 + 3;
        FileWrite(hfile, &usCheckSum, 2, &uiNumBytesWritten);
        if (uiNumBytesWritten != 2) {
          goto FAIL_SAVE;
        }
      }
    }
  }

  ubSectorID = SECTOR(sSectorX, sSectorY);
  FileWrite(hfile, &ubSectorID, 1, &uiNumBytesWritten);
  if (uiNumBytesWritten != 1) {
    goto FAIL_SAVE;
  }

  FileClose(hfile);

  if (fEnemy) {
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
  } else {
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
  }

  return TRUE;

FAIL_SAVE:
  FileClose(hfile);
  return FALSE;
}

function CountNumberOfElitesRegularsAdminsAndCreaturesFromEnemySoldiersTempFile(pubNumElites: Pointer<UINT8>, pubNumRegulars: Pointer<UINT8>, pubNumAdmins: Pointer<UINT8>, pubNumCreatures: Pointer<UINT8>): BOOLEAN {
  //	SOLDIERINITNODE *curr;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT;
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let zMapName: CHAR8[] /* [128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  //	UINT8 ubNumElites = 0, ubNumTroops = 0, ubNumAdmins = 0, ubNumCreatures = 0;
  //	UINT8 ubStrategicElites, ubStrategicTroops, ubStrategicAdmins, ubStrategicCreatures;

  // make sure the variables are initialized
  *pubNumElites = 0;
  *pubNumRegulars = 0;
  *pubNumAdmins = 0;
  *pubNumCreatures = 0;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hfile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  FileRead(hfile, &sSectorY, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorY != sSectorY) {
    goto FAIL_LOAD;
  }

  //	LoadSoldierInitListLinks( hfile );
  LookAtButDontProcessEnemySoldierInitListLinks(hfile);

  // STEP THREE:  read the data

  FileRead(hfile, &sSectorX, 2, &uiNumBytesRead);
  if (uiNumBytesRead != 2) {
    goto FAIL_LOAD;
  }
  if (gWorldSectorX != sSectorX) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &slots, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &uiTimeStamp, 4, &uiNumBytesRead);
  if (uiNumBytesRead != 4) {
    goto FAIL_LOAD;
  }

  FileRead(hfile, &bSectorZ, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }

  if (gbWorldSectorZ != bSectorZ) {
    goto FAIL_LOAD;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    FileClose(hfile);
    return TRUE;
  }

  if (slots < 0 || slots >= 64) {
    // bad IO!
    goto FAIL_LOAD;
  }

  /*
          //get the number of enemies in this sector.
          if( bSectorZ )
          {
                  UNDERGROUND_SECTORINFO *pSector;
                  pSector = FindUnderGroundSector( sSectorX, sSectorY, bSectorZ );
                  if( !pSector )
                  {
                  #ifdef JA2TESTVERSION
                          sprintf( zReason, "EnemySoldier -- Couldn't find underground sector info for (%d,%d,%d)  KM", sSectorX, sSectorY, bSectorZ );
                  #endif
                          goto FAIL_LOAD;
                  }
                  ubStrategicElites		 = pSector->ubNumElites;
                  ubStrategicTroops		 = pSector->ubNumTroops;
                  ubStrategicAdmins		 = pSector->ubNumAdmins;
                  ubStrategicCreatures = pSector->ubNumCreatures;
          }
          else
          {
                  SECTORINFO *pSector;
                  pSector = &SectorInfo[ SECTOR( sSectorX, sSectorY ) ];
                  ubStrategicCreatures = pSector->ubNumCreatures;
                  GetNumberOfEnemiesInSector( sSectorX, sSectorY, &ubStrategicAdmins, &ubStrategicTroops, &ubStrategicElites );
          }
  */

  for (i = 0; i < slots; i++) {
    FileRead(hfile, &tempDetailedPlacement, sizeof(SOLDIERCREATE_STRUCT), &uiNumBytesRead);
    if (uiNumBytesRead != sizeof(SOLDIERCREATE_STRUCT)) {
      goto FAIL_LOAD;
    }

    // increment the current type of soldier
    switch (tempDetailedPlacement.ubSoldierClass) {
      case SOLDIER_CLASS_ELITE:
        (*pubNumElites)++;
        break;
      case SOLDIER_CLASS_ARMY:
        (*pubNumRegulars)++;
        break;
      case SOLDIER_CLASS_ADMINISTRATOR:
        (*pubNumAdmins)++;
        break;
      case SOLDIER_CLASS_CREATURE:
        (*pubNumCreatures)++;
        break;
    }

    FileRead(hfile, &usCheckSum, 2, &uiNumBytesRead);
    if (uiNumBytesRead != 2) {
      goto FAIL_LOAD;
    }
    /*
                    while( curr )
                    {
                            if( !curr->pBasicPlacement->fPriorityExistance )
                            {
                                    if( curr->pBasicPlacement->bTeam == tempDetailedPlacement.bTeam )
                                    {
                                            curr->pBasicPlacement->fPriorityExistance = TRUE;
                                            if( !curr->pDetailedPlacement )
                                            { //need to upgrade the placement to detailed placement
                                                    curr->pDetailedPlacement = (SOLDIERCREATE_STRUCT*)MemAlloc( sizeof( SOLDIERCREATE_STRUCT ) );
                                            }
                                            //now replace the map pristine placement info with the temp map file version..
                                            memcpy( curr->pDetailedPlacement, &tempDetailedPlacement, sizeof( SOLDIERCREATE_STRUCT ) );

                                            curr->pBasicPlacement->fPriorityExistance	=	TRUE;
                                            curr->pBasicPlacement->bDirection					= curr->pDetailedPlacement->bDirection;
                                            curr->pBasicPlacement->bOrders						= curr->pDetailedPlacement->bOrders;
                                            curr->pBasicPlacement->bAttitude					= curr->pDetailedPlacement->bAttitude;
                                            curr->pBasicPlacement->bBodyType					= curr->pDetailedPlacement->bBodyType;
                                            curr->pBasicPlacement->fOnRoof						= curr->pDetailedPlacement->fOnRoof;
                                            curr->pBasicPlacement->ubSoldierClass			= curr->pDetailedPlacement->ubSoldierClass;
                                            curr->pBasicPlacement->ubCivilianGroup		= curr->pDetailedPlacement->ubCivilianGroup;
                                            curr->pBasicPlacement->fHasKeys						= curr->pDetailedPlacement->fHasKeys;
                                            curr->pBasicPlacement->usStartingGridNo		= curr->pDetailedPlacement->sInsertionGridNo;

                                            curr->pBasicPlacement->bPatrolCnt			= curr->pDetailedPlacement->bPatrolCnt;
                                            memcpy( curr->pBasicPlacement->sPatrolGrid, curr->pDetailedPlacement->sPatrolGrid,
                                                    sizeof( INT16 ) * curr->pBasicPlacement->bPatrolCnt );

                                            FileRead( hfile, &usCheckSum, 2, &uiNumBytesRead );
                                            if( uiNumBytesRead != 2 )
                                            {
                                                    #ifdef JA2TESTVERSION
                                                            sprintf( zReason, "EnemySoldier -- EOF while reading usCheckSum %d.  KM", i );
                                                    #endif
                                                    goto FAIL_LOAD;
                                            }
                                            //verify the checksum equation (anti-hack) -- see save
                                            usFileCheckSum =
                                                    curr->pDetailedPlacement->bLife									* 7		+
                                                    curr->pDetailedPlacement->bLifeMax  						* 8		-
                                                    curr->pDetailedPlacement->bAgility							* 2		+
                                                    curr->pDetailedPlacement->bDexterity						* 1		+
                                                    curr->pDetailedPlacement->bExpLevel							* 5		-
                                                    curr->pDetailedPlacement->bMarksmanship					* 9		+
                                                    curr->pDetailedPlacement->bMedical							* 10	+
                                                    curr->pDetailedPlacement->bMechanical						* 3		+
                                                    curr->pDetailedPlacement->bExplosive						* 4		+
                                                    curr->pDetailedPlacement->bLeadership						* 5		+
                                                    curr->pDetailedPlacement->bStrength							* 7		+
                                                    curr->pDetailedPlacement->bWisdom								* 11	+
                                                    curr->pDetailedPlacement->bMorale								* 7		+
                                                    curr->pDetailedPlacement->bAIMorale							* 3		-
                                                    curr->pDetailedPlacement->bBodyType							* 7		+
                                                    4																								* 6		+
                                                    curr->pDetailedPlacement->sSectorX							* 7		-
                                                    curr->pDetailedPlacement->ubSoldierClass				* 4		+
                                                    curr->pDetailedPlacement->bTeam									* 7		+
                                                    curr->pDetailedPlacement->bDirection						* 5		+
                                                    curr->pDetailedPlacement->fOnRoof								* 17	+
                                                    curr->pDetailedPlacement->sInsertionGridNo			* 1		+
                                                    3;
                                            if( usCheckSum != usFileCheckSum )
                                            {	//Hacker has modified the stats on the enemy placements.
                                                    #ifdef JA2TESTVERSION
                                                            sprintf( zReason, "EnemySoldier -- checksum for placement %d failed.  KM", i );
                                                    #endif
                                                    goto FAIL_LOAD;
                                            }

                                            //Add preserved placements as long as they don't exceed the actual population.
                                            switch( curr->pBasicPlacement->ubSoldierClass )
                                            {
                                                    case SOLDIER_CLASS_ELITE:
                                                            ubNumElites++;
                                                            if( ubNumElites <= ubStrategicElites )
                                                            {
                                                                    AddPlacementToWorld( curr );
                                                            }
                                                            break;
                                                    case SOLDIER_CLASS_ARMY:
                                                            ubNumTroops++;
                                                            if( ubNumTroops <= ubStrategicTroops )
                                                            {
                                                                    AddPlacementToWorld( curr );
                                                            }
                                                            break;
                                                    case SOLDIER_CLASS_ADMINISTRATOR:
                                                            ubNumAdmins++;
                                                            if( ubNumAdmins <= ubStrategicAdmins )
                                                            {
                                                                    AddPlacementToWorld( curr );
                                                            }
                                                            break;
                                                    case SOLDIER_CLASS_CREATURE:
                                                            ubNumCreatures++;
                                                            if( ubNumCreatures <= ubStrategicCreatures )
                                                            {
                                                                    AddPlacementToWorld( curr );
                                                            }
                                                            break;
                                            }
                                            break;
                                    }
                            }
                            curr = curr->next;
                    }
    */
  }

  FileRead(hfile, &ubSectorID, 1, &uiNumBytesRead);
  if (uiNumBytesRead != 1) {
    goto FAIL_LOAD;
  }

  if (ubSectorID != SECTOR(sSectorX, sSectorY)) {
    goto FAIL_LOAD;
  }

  // successful
  FileClose(hfile);
  return TRUE;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return FALSE;
}
