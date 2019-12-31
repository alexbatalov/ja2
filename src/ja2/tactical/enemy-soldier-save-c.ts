namespace ja2 {

export let gfRestoringEnemySoldiersFromTempFile: boolean = false;
let gfRestoringCiviliansFromTempFile: boolean = false;

function RemoveEnemySoldierTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let zMapName: string /* CHAR8[128] */;
  if (GetSectorFlagStatus(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS)) {
    // Delete any temp file that is here and toast the flag that say's one exists.
    ReSetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);

    //		GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );
    // add the 'e' for 'Enemy preserved' to the front of the map name
    //		sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

    zMapName = GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);

    // Delete the temp file.
    FileDelete(zMapName);
  }
}

function RemoveCivilianTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  // CHAR8		zTempName[ 128 ];
  let zMapName: string /* CHAR8[128] */;
  if (GetSectorFlagStatus(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS)) {
    // Delete any temp file that is here and toast the flag that say's one exists.
    ReSetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
    // GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

    zMapName = GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);

    // Delete the temp file.
    FileDelete(zMapName);
  }
}

// OLD SAVE METHOD:  This is the old way of loading the enemies and civilians
export function LoadEnemySoldiersFromTempFile(): boolean {
  let curr: SOLDIERINITNODE | null;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let usFileCheckSum: UINT16;
  let zMapName: string /* CHAR8[128] */;
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
  let sizeBuffer: Buffer = Buffer.allocUnsafe(4);
  let dataBuffer: Buffer;

  gfRestoringEnemySoldiersFromTempFile = true;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hfile == 0) {
    // Error opening map modification file
    return false;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorY = sizeBuffer.readInt16LE(0);

  if (gWorldSectorY != sSectorY) {
    FileClose(hfile);
    return false;
  }

  LoadSoldierInitListLinks(hfile);

  // STEP THREE:  read the data

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorX = sizeBuffer.readInt16LE(0);

  if (gWorldSectorX != sSectorX) {
    FileClose(hfile);
    return false;
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  slots = sizeBuffer.readInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  uiTimeStamp = sizeBuffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  bSectorZ = sizeBuffer.readInt8(0);

  if (GetWorldTotalMin() > uiTimeStamp + 300) {
    // the file has aged.  Use the regular method for adding soldiers.
    FileClose(hfile);
    RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
    gfRestoringEnemySoldiersFromTempFile = false;
    return true;
  }

  if (gbWorldSectorZ != bSectorZ) {
    FileClose(hfile);
    return false;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    gfRestoringEnemySoldiersFromTempFile = false;
    FileClose(hfile);
    return true;
  }
  if (slots < 0 || slots >= 64) {
    // bad IO!
    FileClose(hfile);
    return false;
  }

  // For all the enemy slots (enemy/creature), clear the fPriorityExistance flag.  We will use these flags
  // to determine which slots have been modified as we load the data into the map pristine soldier init list.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.pBasicPlacement.fPriorityExistance) {
      if (curr.pBasicPlacement.bTeam == ENEMY_TEAM || curr.pBasicPlacement.bTeam == CREATURE_TEAM || curr.pBasicPlacement.bTeam == CIV_TEAM) {
        curr.pBasicPlacement.fPriorityExistance = false;
      }
    }
    curr = curr.next;
  }

  // get the number of enemies in this sector.
  if (bSectorZ) {
    let pSector: UNDERGROUND_SECTORINFO | null;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, bSectorZ);
    if (!pSector) {
      FileClose(hfile);
      return false;
    }
    ubStrategicElites = pSector.ubNumElites;
    ubStrategicTroops = pSector.ubNumTroops;
    ubStrategicAdmins = pSector.ubNumAdmins;
    ubStrategicCreatures = pSector.ubNumCreatures;
  } else {
    let pSector: SECTORINFO;
    pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
    ubStrategicCreatures = pSector.ubNumCreatures;
    ({ ubNumAdmins: ubStrategicAdmins, ubNumTroops: ubStrategicTroops, ubNumElites: ubStrategicElites } = GetNumberOfEnemiesInSector(sSectorX, sSectorY));
  }

  dataBuffer = Buffer.allocUnsafe(SOLDIER_CREATE_STRUCT_SIZE);
  for (i = 0; i < slots; i++) {
    uiNumBytesRead = FileRead(hfile, dataBuffer, SOLDIER_CREATE_STRUCT_SIZE);
    if (uiNumBytesRead != SOLDIER_CREATE_STRUCT_SIZE) {
      FileClose(hfile);
      return false;
    }
    readSoldierCreateStruct(tempDetailedPlacement, dataBuffer);

    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.pBasicPlacement.fPriorityExistance) {
        if (!curr.pDetailedPlacement || curr.pDetailedPlacement && curr.pDetailedPlacement.ubProfile == NO_PROFILE) {
          if (curr.pBasicPlacement.bTeam == tempDetailedPlacement.bTeam) {
            curr.pBasicPlacement.fPriorityExistance = true;
            if (!curr.pDetailedPlacement) {
              // need to upgrade the placement to detailed placement
              curr.pDetailedPlacement = createSoldierCreateStruct();
            }
            // now replace the map pristine placement info with the temp map file version..
            copySoldierCreateStruct(curr.pDetailedPlacement, tempDetailedPlacement);

            curr.pBasicPlacement.fPriorityExistance = true;
            curr.pBasicPlacement.bDirection = curr.pDetailedPlacement.bDirection;
            curr.pBasicPlacement.bOrders = curr.pDetailedPlacement.bOrders;
            curr.pBasicPlacement.bAttitude = curr.pDetailedPlacement.bAttitude;
            curr.pBasicPlacement.bBodyType = curr.pDetailedPlacement.bBodyType;
            curr.pBasicPlacement.fOnRoof = curr.pDetailedPlacement.fOnRoof;
            curr.pBasicPlacement.ubSoldierClass = curr.pDetailedPlacement.ubSoldierClass;
            curr.pBasicPlacement.ubCivilianGroup = curr.pDetailedPlacement.ubCivilianGroup;
            curr.pBasicPlacement.fHasKeys = curr.pDetailedPlacement.fHasKeys;
            curr.pBasicPlacement.usStartingGridNo = curr.pDetailedPlacement.sInsertionGridNo;

            curr.pBasicPlacement.bPatrolCnt = curr.pDetailedPlacement.bPatrolCnt;
            copyArray(curr.pBasicPlacement.sPatrolGrid, curr.pDetailedPlacement.sPatrolGrid);

            uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
            if (uiNumBytesRead != 2) {
              FileClose(hfile);
              return false;
            }
            usCheckSum = sizeBuffer.readUInt16LE(0);

            // verify the checksum equation (anti-hack) -- see save
            usFileCheckSum = curr.pDetailedPlacement.bLife * 7 + curr.pDetailedPlacement.bLifeMax * 8 - curr.pDetailedPlacement.bAgility * 2 + curr.pDetailedPlacement.bDexterity * 1 + curr.pDetailedPlacement.bExpLevel * 5 - curr.pDetailedPlacement.bMarksmanship * 9 + curr.pDetailedPlacement.bMedical * 10 + curr.pDetailedPlacement.bMechanical * 3 + curr.pDetailedPlacement.bExplosive * 4 + curr.pDetailedPlacement.bLeadership * 5 + curr.pDetailedPlacement.bStrength * 7 + curr.pDetailedPlacement.bWisdom * 11 + curr.pDetailedPlacement.bMorale * 7 + curr.pDetailedPlacement.bAIMorale * 3 - curr.pDetailedPlacement.bBodyType * 7 + 4 * 6 + curr.pDetailedPlacement.sSectorX * 7 - curr.pDetailedPlacement.ubSoldierClass * 4 + curr.pDetailedPlacement.bTeam * 7 + curr.pDetailedPlacement.bDirection * 5 + Number(curr.pDetailedPlacement.fOnRoof) * 17 + curr.pDetailedPlacement.sInsertionGridNo * 1 + 3;
            usFileCheckSum %= 2 ** 16;
            if (usCheckSum != usFileCheckSum) {
              // Hacker has modified the stats on the enemy placements.
              FileClose(hfile);
              return false;
            }

            if (curr.pBasicPlacement.bTeam == CIV_TEAM) {
              AddPlacementToWorld(curr);
              break;
            } else {
              // Add preserved placements as long as they don't exceed the actual population.
              switch (curr.pBasicPlacement.ubSoldierClass) {
                case Enum262.SOLDIER_CLASS_ELITE:
                  ubNumElites++;
                  if (ubNumElites < ubStrategicElites) {
                    AddPlacementToWorld(curr);
                  }
                  break;
                case Enum262.SOLDIER_CLASS_ARMY:
                  ubNumTroops++;
                  if (ubNumTroops < ubStrategicTroops) {
                    AddPlacementToWorld(curr);
                  }
                  break;
                case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
                  ubNumAdmins++;
                  if (ubNumAdmins < ubStrategicAdmins) {
                    AddPlacementToWorld(curr);
                  }
                  break;
                case Enum262.SOLDIER_CLASS_CREATURE:
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
      curr = curr.next;
    }
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  ubSectorID = sizeBuffer.readUInt8(0);

  if (ubSectorID != SECTOR(sSectorX, sSectorY)) {
    FileClose(hfile);
    return false;
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
  return true;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return false;
}

// OLD SAVE METHOD:  This is the older way of saving the civilian and the enemies placement into a temp file
function SaveEnemySoldiersToTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, ubFirstIdTeam: UINT8, ubLastIdTeam: UINT8, fAppendToFile: boolean): boolean {
  let curr: SOLDIERINITNODE | null;
  let pSoldier: SOLDIERTYPE;
  let i: INT32;
  let slots: INT32 = 0;
  let iSlotsAlreadyInUse: INT32 = 0;
  let uiNumBytesWritten: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let pSchedule: SCHEDULENODE | null;
  let usCheckSum: UINT16;
  let zMapName: string /* CHAR8[128] */;
  let ubSectorID: UINT8;
  let sizeBuffer: Buffer = Buffer.allocUnsafe(4);
  let dataBuffer: Buffer;

  // STEP ONE:  Prep the soldiers for saving...

  // modify the map's soldier init list to reflect the changes to the member's still alive...
  for (i = gTacticalStatus.Team[ubFirstIdTeam].bFirstID; i <= gTacticalStatus.Team[ubLastIdTeam].bLastID; i++) {
    pSoldier = MercPtrs[i];

    if (pSoldier.bActive /*&& pSoldier->bInSector*/ && pSoldier.bLife) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.pSoldier != pSoldier) {
        curr = curr.next;
      }
      if (curr && curr.pSoldier == pSoldier && pSoldier.ubProfile == NO_PROFILE) {
        // found a match.

        if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
          if (!curr.pDetailedPlacement) {
            // need to upgrade the placement to detailed placement
            curr.pBasicPlacement.fDetailedPlacement = true;
            curr.pDetailedPlacement = createSoldierCreateStruct();
          }

          // Copy over the data of the soldier.
          curr.pDetailedPlacement.ubProfile = NO_PROFILE;
          curr.pDetailedPlacement.bLife = pSoldier.bLife;
          curr.pDetailedPlacement.bLifeMax = pSoldier.bLifeMax;
          curr.pDetailedPlacement.bAgility = pSoldier.bAgility;
          curr.pDetailedPlacement.bDexterity = pSoldier.bDexterity;
          curr.pDetailedPlacement.bExpLevel = pSoldier.bExpLevel;
          curr.pDetailedPlacement.bMarksmanship = pSoldier.bMarksmanship;
          curr.pDetailedPlacement.bMedical = pSoldier.bMedical;
          curr.pDetailedPlacement.bMechanical = pSoldier.bMechanical;
          curr.pDetailedPlacement.bExplosive = pSoldier.bExplosive;
          curr.pDetailedPlacement.bLeadership = pSoldier.bLeadership;
          curr.pDetailedPlacement.bStrength = pSoldier.bStrength;
          curr.pDetailedPlacement.bWisdom = pSoldier.bWisdom;
          curr.pDetailedPlacement.bAttitude = pSoldier.bAttitude;
          curr.pDetailedPlacement.bOrders = pSoldier.bOrders;
          curr.pDetailedPlacement.bMorale = pSoldier.bMorale;
          curr.pDetailedPlacement.bAIMorale = pSoldier.bAIMorale;
          curr.pDetailedPlacement.bBodyType = pSoldier.ubBodyType;
          curr.pDetailedPlacement.ubCivilianGroup = pSoldier.ubCivilianGroup;

          // If the soldier has a real schedule (not a default schedule), then store it.
          // All other cases should be 0.
          curr.pDetailedPlacement.ubScheduleID = 0;
          if (pSoldier.ubScheduleID) {
            pSchedule = GetSchedule(pSoldier.ubScheduleID);
            if (pSchedule && !(pSchedule.usFlags & SCHEDULE_FLAGS_TEMPORARY)) {
              curr.pDetailedPlacement.ubScheduleID = pSoldier.ubScheduleID;
            }
          }

          curr.pDetailedPlacement.fHasKeys = Boolean(pSoldier.bHasKeys);
          curr.pDetailedPlacement.sSectorX = pSoldier.sSectorX;
          curr.pDetailedPlacement.sSectorY = pSoldier.sSectorY;
          curr.pDetailedPlacement.bSectorZ = pSoldier.bSectorZ;
          curr.pDetailedPlacement.ubSoldierClass = pSoldier.ubSoldierClass;
          curr.pDetailedPlacement.bTeam = pSoldier.bTeam;
          curr.pDetailedPlacement.bDirection = pSoldier.bDirection;

          // we don't want the player to think that all the enemies start in the exact position when we
          // left the map, so randomize the start locations either current position or original position.
          if (PreRandom(2)) {
            // use current position
            curr.pDetailedPlacement.fOnRoof = Boolean(pSoldier.bLevel);
            curr.pDetailedPlacement.sInsertionGridNo = pSoldier.sGridNo;
          } else {
            // use original position
            curr.pDetailedPlacement.fOnRoof = curr.pBasicPlacement.fOnRoof;
            curr.pDetailedPlacement.sInsertionGridNo = curr.pBasicPlacement.usStartingGridNo;
          }

          curr.pDetailedPlacement.name = pSoldier.name;

          // Copy patrol points
          curr.pDetailedPlacement.bPatrolCnt = pSoldier.bPatrolCnt;
          copyArray(curr.pDetailedPlacement.sPatrolGrid, pSoldier.usPatrolGrid);

          // copy colors for soldier based on the body type.
          curr.pDetailedPlacement.HeadPal = pSoldier.HeadPal;
          curr.pDetailedPlacement.VestPal = pSoldier.VestPal;
          curr.pDetailedPlacement.SkinPal = pSoldier.SkinPal;
          curr.pDetailedPlacement.PantsPal = pSoldier.PantsPal;
          curr.pDetailedPlacement.MiscPal = pSoldier.MiscPal;

          // copy soldier's inventory
          copyObjectArray(curr.pDetailedPlacement.Inv, pSoldier.inv, copyObjectType);
        }

        // DONE, now increment the counter, so we know how many there are.
        slots++;
      }
    }
  }
  if (!slots) {
    // No need to save anything, so return successfully
    RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
    return true;
  }

  // STEP TWO:  Set up the temp file to write to.

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);

  // if the file doesnt exist
  if (FileSize(zMapName) == 0) {
    // set it so we are not appending
    fAppendToFile = false;
  }

  // if we are to append to the file
  if (fAppendToFile) {
    // Open the file for writing, Create it if it doesnt exist
    hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_ALWAYS, false);
    if (hfile == 0) {
      // Error opening map modification file
      return false;
    }

    // advance for bytes and read the #of slots already used
    FileSeek(hfile, 4, FILE_SEEK_FROM_START);

    uiNumBytesWritten = FileRead(hfile, sizeBuffer, 4);
    if (uiNumBytesWritten != 4) {
      FileClose(hfile);
      return false;
    }
    iSlotsAlreadyInUse = sizeBuffer.readInt32LE(0);

    FileClose(hfile);

    // Open the file for writing, Create it if it doesnt exist
    hfile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
    if (hfile == 0) {
      // Error opening map modification file
      return false;
    }

    slots += iSlotsAlreadyInUse;

    // advance for bytes and read the #of slots already used
    FileSeek(hfile, 4, FILE_SEEK_FROM_START);
    sizeBuffer.writeInt32LE(slots, 0);
    uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 4);
    if (uiNumBytesWritten != 4) {
      FileClose(hfile);
      return false;
    }

    FileSeek(hfile, 0, FILE_SEEK_FROM_END);
  } else {
    // Open the file for writing, Create it if it doesnt exist
    hfile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
    if (hfile == 0) {
      // Error opening map modification file
      return false;
    }
  }

  // if we are to append to the file
  if (!fAppendToFile) {
    sizeBuffer.writeInt16LE(sSectorY, 0);
    uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 2);
    if (uiNumBytesWritten != 2) {
      FileClose(hfile);
      return false;
    }

    // STEP THREE:  Save the data
    SaveSoldierInitListLinks(hfile);

    sizeBuffer.writeInt16LE(sSectorX, 0);
    uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 2);
    if (uiNumBytesWritten != 2) {
      FileClose(hfile);
      return false;
    }

    // This check may appear confusing.  It is intended to abort if the player is saving the game.  It is only
    // supposed to preserve the links to the placement list, so when we finally do leave the level with enemies remaining,
    // we will need the links that are only added when the map is loaded, and are normally lost when restoring a save.
    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
      slots = 0;
    }

    sizeBuffer.writeInt32LE(slots, 0);
    uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 4);
    if (uiNumBytesWritten != 4) {
      FileClose(hfile);
      return false;
    }

    uiTimeStamp = GetWorldTotalMin();
    sizeBuffer.writeUInt32LE(uiTimeStamp, 0);
    uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 4);
    if (uiNumBytesWritten != 4) {
      FileClose(hfile);
      return false;
    }

    sizeBuffer.writeInt8(bSectorZ, 0);
    uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 1);
    if (uiNumBytesWritten != 1) {
      FileClose(hfile);
      return false;
    }
  }

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    // if we are saving the game, we don't need to preserve the soldier information, just
    // preserve the links to the placement list.
    slots = 0;
    FileClose(hfile);
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
    return true;
  }

  FAIL_SAVE:
  do {
    dataBuffer = Buffer.allocUnsafe(SOLDIER_CREATE_STRUCT_SIZE);
    for (i = gTacticalStatus.Team[ubFirstIdTeam].bFirstID; i <= gTacticalStatus.Team[ubLastIdTeam].bLastID; i++) {
      pSoldier = MercPtrs[i];
      if (pSoldier.bActive /*&& pSoldier->bInSector*/ && pSoldier.bLife) {
        // soldier is valid, so find the matching soldier init list entry for modification.
        curr = gSoldierInitHead;
        while (curr && curr.pSoldier != pSoldier) {
          curr = curr.next;
        }
        if (curr && curr.pSoldier == pSoldier && pSoldier.ubProfile == NO_PROFILE) {
          Assert(curr.pDetailedPlacement);
          // found a match.
          writeSoldierCreateStruct(curr.pDetailedPlacement, dataBuffer);
          uiNumBytesWritten = FileWrite(hfile, dataBuffer, SOLDIER_CREATE_STRUCT_SIZE);
          if (uiNumBytesWritten != SOLDIER_CREATE_STRUCT_SIZE) {
            break FAIL_SAVE;
          }
          // insert a checksum equation (anti-hack)
          usCheckSum = curr.pDetailedPlacement.bLife * 7 + curr.pDetailedPlacement.bLifeMax * 8 - curr.pDetailedPlacement.bAgility * 2 + curr.pDetailedPlacement.bDexterity * 1 + curr.pDetailedPlacement.bExpLevel * 5 - curr.pDetailedPlacement.bMarksmanship * 9 + curr.pDetailedPlacement.bMedical * 10 + curr.pDetailedPlacement.bMechanical * 3 + curr.pDetailedPlacement.bExplosive * 4 + curr.pDetailedPlacement.bLeadership * 5 + curr.pDetailedPlacement.bStrength * 7 + curr.pDetailedPlacement.bWisdom * 11 + curr.pDetailedPlacement.bMorale * 7 + curr.pDetailedPlacement.bAIMorale * 3 - curr.pDetailedPlacement.bBodyType * 7 + 4 * 6 + curr.pDetailedPlacement.sSectorX * 7 - curr.pDetailedPlacement.ubSoldierClass * 4 + curr.pDetailedPlacement.bTeam * 7 + curr.pDetailedPlacement.bDirection * 5 + Number(curr.pDetailedPlacement.fOnRoof) * 17 + curr.pDetailedPlacement.sInsertionGridNo * 1 + 3;
          usCheckSum %= 2 ** 16;
          sizeBuffer.writeUInt16LE(usCheckSum, 0);
          uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 2);
          if (uiNumBytesWritten != 2) {
            break FAIL_SAVE;
          }
        }
      }
    }

    // if we are to append to the file
    if (!fAppendToFile) {
      ubSectorID = SECTOR(sSectorX, sSectorY);
      sizeBuffer.writeUInt8(ubSectorID, 0);
      uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 1);
      if (uiNumBytesWritten != 1) {
        FileClose(hfile);
        return false;
      }
    }

    FileClose(hfile);
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
    return true;
  } while (false);

  FileClose(hfile);
  return false;
}

export function NewWayOfLoadingEnemySoldiersFromTempFile(): boolean {
  let curr: SOLDIERINITNODE | null;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let usFileCheckSum: UINT16;
  let zMapName: string /* CHAR8[128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  let ubNumElites: UINT8 = 0;
  let ubNumTroops: UINT8 = 0;
  let ubNumAdmins: UINT8 = 0;
  let ubNumCreatures: UINT8 = 0;
  let ubStrategicElites: UINT8 = 0;
  let ubStrategicTroops: UINT8 = 0;
  let ubStrategicAdmins: UINT8 = 0;
  let ubStrategicCreatures: UINT8 = 0;
  let sizeBuffer: Buffer = Buffer.allocUnsafe(4);
  let dataBuffer: Buffer;

  gfRestoringEnemySoldiersFromTempFile = true;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Count the number of enemies ( elites, regulars, admins and creatures ) that are in the temp file.

  if (gbWorldSectorZ) {
    let pSector: UNDERGROUND_SECTORINFO | null;
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pSector) {
      return false;
    }
  } else {
    let pSector: SECTORINFO;
    pSector = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];

    ubNumElites = pSector.ubNumElites;
    ubNumTroops = pSector.ubNumTroops;
    ubNumAdmins = pSector.ubNumAdmins;
    ubNumCreatures = pSector.ubNumCreatures;
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Get the number of enemies form the temp file
    CountNumberOfElitesRegularsAdminsAndCreaturesFromEnemySoldiersTempFile(createPointer(() => ubStrategicElites, (v) => ubStrategicElites = v), createPointer(() => ubStrategicTroops, (v) => ubStrategicTroops = v), createPointer(() => ubStrategicAdmins, (v) => ubStrategicAdmins = v), createPointer(() => ubStrategicCreatures, (v) => ubStrategicCreatures = v));

    // If any of the counts differ from what is in memory
    if (ubStrategicElites != ubNumElites || ubStrategicTroops != ubNumTroops || ubStrategicAdmins != ubNumAdmins || ubStrategicCreatures != ubNumCreatures) {
      // remove the file
      RemoveEnemySoldierTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      return true;
    }
  }

  // reset
  ubNumElites = ubNumTroops = ubNumAdmins = ubNumCreatures = 0;

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hfile == 0) {
    // Error opening map modification file
    return false;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorY = sizeBuffer.readInt16LE(0);

  if (gWorldSectorY != sSectorY) {
    FileClose(hfile);
    return false;
  }

  //	LoadSoldierInitListLinks( hfile );
  NewWayOfLoadingEnemySoldierInitListLinks(hfile);

  // STEP THREE:  read the data

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorX = sizeBuffer.readInt16LE(0);

  if (gWorldSectorX != sSectorX) {
    FileClose(hfile);
    return false;
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  slots = sizeBuffer.readInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  uiTimeStamp = sizeBuffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  bSectorZ = sizeBuffer.readInt8(0);

  if (gbWorldSectorZ != bSectorZ) {
    FileClose(hfile);
    return false;
  }

  if (GetWorldTotalMin() > uiTimeStamp + 300) {
    // the file has aged.  Use the regular method for adding soldiers.
    FileClose(hfile);
    RemoveEnemySoldierTempFile(sSectorX, sSectorY, bSectorZ);
    gfRestoringEnemySoldiersFromTempFile = false;
    return true;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    gfRestoringEnemySoldiersFromTempFile = false;
    FileClose(hfile);
    return true;
  }

  if (slots < 0 || slots >= 64) {
    // bad IO!
    FileClose(hfile);
    return false;
  }

  // For all the enemy slots (enemy/creature), clear the fPriorityExistance flag.  We will use these flags
  // to determine which slots have been modified as we load the data into the map pristine soldier init list.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.pBasicPlacement.fPriorityExistance) {
      if (curr.pBasicPlacement.bTeam == ENEMY_TEAM || curr.pBasicPlacement.bTeam == CREATURE_TEAM) {
        curr.pBasicPlacement.fPriorityExistance = false;
      }
    }
    curr = curr.next;
  }

  // get the number of enemies in this sector.
  if (bSectorZ) {
    let pSector: UNDERGROUND_SECTORINFO | null;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, bSectorZ);
    if (!pSector) {
      FileClose(hfile);
      return false;
    }
    ubStrategicElites = pSector.ubNumElites;
    ubStrategicTroops = pSector.ubNumTroops;
    ubStrategicAdmins = pSector.ubNumAdmins;
    ubStrategicCreatures = pSector.ubNumCreatures;
  } else {
    let pSector: SECTORINFO;
    pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
    ubStrategicCreatures = pSector.ubNumCreatures;
    ({ ubNumAdmins: ubStrategicAdmins, ubNumTroops: ubStrategicTroops, ubNumElites: ubStrategicElites } = GetNumberOfEnemiesInSector(sSectorX, sSectorY));
  }

  dataBuffer = Buffer.allocUnsafe(SOLDIER_CREATE_STRUCT_SIZE);
  for (i = 0; i < slots; i++) {
    uiNumBytesRead = FileRead(hfile, dataBuffer, SOLDIER_CREATE_STRUCT_SIZE);
    if (uiNumBytesRead != SOLDIER_CREATE_STRUCT_SIZE) {
      FileClose(hfile);
      return false;
    }
    readSoldierCreateStruct(tempDetailedPlacement, dataBuffer);

    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.pBasicPlacement.fPriorityExistance) {
        if (curr.pBasicPlacement.bTeam == tempDetailedPlacement.bTeam) {
          curr.pBasicPlacement.fPriorityExistance = true;
          if (!curr.pDetailedPlacement) {
            // need to upgrade the placement to detailed placement
            curr.pDetailedPlacement = createSoldierCreateStruct();
          }
          // now replace the map pristine placement info with the temp map file version..
          copySoldierCreateStruct(curr.pDetailedPlacement, tempDetailedPlacement);

          curr.pBasicPlacement.fPriorityExistance = true;
          curr.pBasicPlacement.bDirection = curr.pDetailedPlacement.bDirection;
          curr.pBasicPlacement.bOrders = curr.pDetailedPlacement.bOrders;
          curr.pBasicPlacement.bAttitude = curr.pDetailedPlacement.bAttitude;
          curr.pBasicPlacement.bBodyType = curr.pDetailedPlacement.bBodyType;
          curr.pBasicPlacement.fOnRoof = curr.pDetailedPlacement.fOnRoof;
          curr.pBasicPlacement.ubSoldierClass = curr.pDetailedPlacement.ubSoldierClass;
          curr.pBasicPlacement.ubCivilianGroup = curr.pDetailedPlacement.ubCivilianGroup;
          curr.pBasicPlacement.fHasKeys = curr.pDetailedPlacement.fHasKeys;
          curr.pBasicPlacement.usStartingGridNo = curr.pDetailedPlacement.sInsertionGridNo;

          curr.pBasicPlacement.bPatrolCnt = curr.pDetailedPlacement.bPatrolCnt;
          copyArray(curr.pBasicPlacement.sPatrolGrid, curr.pDetailedPlacement.sPatrolGrid);

          uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
          if (uiNumBytesRead != 2) {
            FileClose(hfile);
            return false;
          }
          usCheckSum = sizeBuffer.readUInt16LE(0);

          // verify the checksum equation (anti-hack) -- see save
          usFileCheckSum = curr.pDetailedPlacement.bLife * 7 + curr.pDetailedPlacement.bLifeMax * 8 - curr.pDetailedPlacement.bAgility * 2 + curr.pDetailedPlacement.bDexterity * 1 + curr.pDetailedPlacement.bExpLevel * 5 - curr.pDetailedPlacement.bMarksmanship * 9 + curr.pDetailedPlacement.bMedical * 10 + curr.pDetailedPlacement.bMechanical * 3 + curr.pDetailedPlacement.bExplosive * 4 + curr.pDetailedPlacement.bLeadership * 5 + curr.pDetailedPlacement.bStrength * 7 + curr.pDetailedPlacement.bWisdom * 11 + curr.pDetailedPlacement.bMorale * 7 + curr.pDetailedPlacement.bAIMorale * 3 - curr.pDetailedPlacement.bBodyType * 7 + 4 * 6 + curr.pDetailedPlacement.sSectorX * 7 - curr.pDetailedPlacement.ubSoldierClass * 4 + curr.pDetailedPlacement.bTeam * 7 + curr.pDetailedPlacement.bDirection * 5 + Number(curr.pDetailedPlacement.fOnRoof) * 17 + curr.pDetailedPlacement.sInsertionGridNo * 1 + 3;
          usFileCheckSum %= 2 ** 16;
          if (usCheckSum != usFileCheckSum) {
            // Hacker has modified the stats on the enemy placements.
            FileClose(hfile);
            return false;
          }

          // Add preserved placements as long as they don't exceed the actual population.
          switch (curr.pBasicPlacement.ubSoldierClass) {
            case Enum262.SOLDIER_CLASS_ELITE:
              ubNumElites++;
              if (ubNumElites <= ubStrategicElites) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
            case Enum262.SOLDIER_CLASS_ARMY:
              ubNumTroops++;
              if (ubNumTroops <= ubStrategicTroops) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
            case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
              ubNumAdmins++;
              if (ubNumAdmins <= ubStrategicAdmins) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
            case Enum262.SOLDIER_CLASS_CREATURE:
              ubNumCreatures++;
              if (ubNumCreatures <= ubStrategicCreatures) {
                // def:								AddPlacementToWorld( curr );
              }
              break;
          }
          break;
        }
      }
      curr = curr.next;
    }
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  ubSectorID = sizeBuffer.readUInt8(0);

  if (ubSectorID != SECTOR(sSectorX, sSectorY)) {
    FileClose(hfile);
    return false;
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
    let pSector: UNDERGROUND_SECTORINFO | null;
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pSector) {
      FileClose(hfile);
      return false;

      /*
                              pSector->ubElitesInBattle = ubStrategicElites;
                              pSector->ubTroopsInBattle = ubStrategicTroops;
                              pSector->ubAdminsInBattle = ubStrategicAdmins;
                              pSector->ubCreaturesInBattle = ubStrategicCreatures;
      */
    }
  } else {
    let pSector: SECTORINFO;
    pSector = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
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
  return true;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return false;
}

export function NewWayOfLoadingCiviliansFromTempFile(): boolean {
  let curr: SOLDIERINITNODE | null;
  let temp: SOLDIERINITNODE | null;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
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
  let zMapName: string /* CHAR8[128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  let ubNumElites: UINT8 = 0;
  let ubNumTroops: UINT8 = 0;
  let ubNumAdmins: UINT8 = 0;
  let ubNumCreatures: UINT8 = 0;
  let fDeleted: boolean;
  //	UINT8 ubStrategicElites, ubStrategicTroops, ubStrategicAdmins, ubStrategicCreatures;
  let sizeBuffer: Buffer = Buffer.allocUnsafe(4);
  let dataBuffer: Buffer;

  gfRestoringCiviliansFromTempFile = true;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  // GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  // sprintf( zMapName, "%s\\c_%s", MAPS_DIR, zTempName);
  zMapName = GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hfile == 0) {
    // Error opening map modification file
    return false;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorY = sizeBuffer.readInt16LE(0);

  if (gWorldSectorY != sSectorY) {
    FileClose(hfile);
    return false;
  }

  // LoadSoldierInitListLinks( hfile );
  NewWayOfLoadingCivilianInitListLinks(hfile);

  // STEP THREE:  read the data
  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorX = sizeBuffer.readInt16LE(0);

  if (gWorldSectorX != sSectorX) {
    FileClose(hfile);
    return false;
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  slots = sizeBuffer.readInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  uiTimeStamp = sizeBuffer.readUInt32LE(0);

  uiTimeSinceLastLoaded = GetWorldTotalMin() - uiTimeStamp;

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  bSectorZ = sizeBuffer.readInt8(0);

  if (gbWorldSectorZ != bSectorZ) {
    FileClose(hfile);
    return false;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    gfRestoringCiviliansFromTempFile = false;
    FileClose(hfile);
    return true;
  }
  if (slots < 0 || slots >= 64) {
// bad IO!
    FileClose(hfile);
    return false;
  }

  // For all the enemy slots (enemy/creature), clear the fPriorityExistance flag.  We will use these flags
  // to determine which slots have been modified as we load the data into the map pristine soldier init list.
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.pBasicPlacement.fPriorityExistance) {
      if (curr.pBasicPlacement.bTeam == CIV_TEAM) {
        curr.pBasicPlacement.fPriorityExistance = false;
      }
    }
    curr = curr.next;
  }

  dataBuffer = Buffer.allocUnsafe(SOLDIER_CREATE_STRUCT_SIZE);
  for (i = 0; i < slots; i++) {
    uiNumBytesRead = FileRead(hfile, dataBuffer, SOLDIER_CREATE_STRUCT_SIZE);
    if (uiNumBytesRead != SOLDIER_CREATE_STRUCT_SIZE) {
      FileClose(hfile);
      return false;
    }
    readSoldierCreateStruct(tempDetailedPlacement, dataBuffer);

    curr = gSoldierInitHead;
    while (curr) {
      if (!curr.pBasicPlacement.fPriorityExistance) {
        if (!curr.pDetailedPlacement || curr.pDetailedPlacement && curr.pDetailedPlacement.ubProfile == NO_PROFILE) {
          if (curr.pBasicPlacement.bTeam == tempDetailedPlacement.bTeam) {
            curr.pBasicPlacement.fPriorityExistance = true;

            if (!curr.pDetailedPlacement) {
              // need to upgrade the placement to detailed placement
              curr.pDetailedPlacement = createSoldierCreateStruct();
            }
            // now replace the map pristine placement info with the temp map file version..
            copySoldierCreateStruct(curr.pDetailedPlacement, tempDetailedPlacement);

            curr.pBasicPlacement.fPriorityExistance = true;
            curr.pBasicPlacement.bDirection = curr.pDetailedPlacement.bDirection;
            curr.pBasicPlacement.bOrders = curr.pDetailedPlacement.bOrders;
            curr.pBasicPlacement.bAttitude = curr.pDetailedPlacement.bAttitude;
            curr.pBasicPlacement.bBodyType = curr.pDetailedPlacement.bBodyType;
            curr.pBasicPlacement.fOnRoof = curr.pDetailedPlacement.fOnRoof;
            curr.pBasicPlacement.ubSoldierClass = curr.pDetailedPlacement.ubSoldierClass;
            curr.pBasicPlacement.ubCivilianGroup = curr.pDetailedPlacement.ubCivilianGroup;
            curr.pBasicPlacement.fHasKeys = curr.pDetailedPlacement.fHasKeys;
            curr.pBasicPlacement.usStartingGridNo = curr.pDetailedPlacement.sInsertionGridNo;

            curr.pBasicPlacement.bPatrolCnt = curr.pDetailedPlacement.bPatrolCnt;
            copyArray(curr.pBasicPlacement.sPatrolGrid, curr.pDetailedPlacement.sPatrolGrid);

            uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
            if (uiNumBytesRead != 2) {
              FileClose(hfile);
              return false;
            }
            usCheckSum = sizeBuffer.readUInt16LE(0);

            // verify the checksum equation (anti-hack) -- see save
            usFileCheckSum = curr.pDetailedPlacement.bLife * 7 + curr.pDetailedPlacement.bLifeMax * 8 - curr.pDetailedPlacement.bAgility * 2 + curr.pDetailedPlacement.bDexterity * 1 + curr.pDetailedPlacement.bExpLevel * 5 - curr.pDetailedPlacement.bMarksmanship * 9 + curr.pDetailedPlacement.bMedical * 10 + curr.pDetailedPlacement.bMechanical * 3 + curr.pDetailedPlacement.bExplosive * 4 + curr.pDetailedPlacement.bLeadership * 5 + curr.pDetailedPlacement.bStrength * 7 + curr.pDetailedPlacement.bWisdom * 11 + curr.pDetailedPlacement.bMorale * 7 + curr.pDetailedPlacement.bAIMorale * 3 - curr.pDetailedPlacement.bBodyType * 7 + 4 * 6 + curr.pDetailedPlacement.sSectorX * 7 - curr.pDetailedPlacement.ubSoldierClass * 4 + curr.pDetailedPlacement.bTeam * 7 + curr.pDetailedPlacement.bDirection * 5 + Number(curr.pDetailedPlacement.fOnRoof) * 17 + curr.pDetailedPlacement.sInsertionGridNo * 1 + 3;
            usFileCheckSum %= 2 ** 16;
            if (usCheckSum != usFileCheckSum) {
// Hacker has modified the stats on the enemy placements.
              FileClose(hfile);
              return false;
            }

            if (curr.pDetailedPlacement.bLife < curr.pDetailedPlacement.bLifeMax) {
              // Add 4 life for every hour that passes.
              let iNewLife: INT32;
              iNewLife = curr.pDetailedPlacement.bLife + Math.trunc(uiTimeSinceLastLoaded / 15);
              iNewLife = Math.min(curr.pDetailedPlacement.bLifeMax, iNewLife);
              curr.pDetailedPlacement.bLife = iNewLife;
            }

            if (curr.pBasicPlacement.bTeam == CIV_TEAM) {
              // def:				AddPlacementToWorld( curr );
              break;
            }
          }
        }
      }
      curr = curr.next;
    }
  }

  // now remove any non-priority placement which matches the conditions!
  curr = gSoldierInitHead;
  fDeleted = false;
  while (curr) {
    if (!curr.pBasicPlacement.fPriorityExistance) {
      if (!curr.pDetailedPlacement || curr.pDetailedPlacement && curr.pDetailedPlacement.ubProfile == NO_PROFILE) {
        if (curr.pBasicPlacement.bTeam == tempDetailedPlacement.bTeam) {
          // Save pointer to the next guy in the list
          // and after deleting, set the 'curr' to that guy
          temp = curr.next;
          RemoveSoldierNodeFromInitList(curr);
          curr = temp;
          fDeleted = true;
        }
      }
    }
    if (fDeleted) {
      // we've already done our pointer update so don't advance the pointer
      fDeleted = false;
    } else {
      curr = (<SOLDIERINITNODE>curr).next;
    }
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  ubSectorID = sizeBuffer.readUInt8(0);

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
  return true;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return false;
}

// If we are saving a game and we are in the sector, we will need to preserve the links between the
// soldiers and the soldier init list.  Otherwise, the temp file will be deleted.
export function NewWayOfSavingEnemyAndCivliansToTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8, fEnemy: boolean, fValidateOnly: boolean): boolean {
  let curr: SOLDIERINITNODE | null;
  let pSoldier: SOLDIERTYPE | null;
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesWritten: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: string /* CHAR8[128] */;
  let ubSectorID: UINT8;
  let usCheckSum: UINT16;

  let ubStartID: UINT8 = 0;
  let ubEndID: UINT8 = 0;
  let sizeBuffer: Buffer = Buffer.allocUnsafe(4);
  let dataBuffer: Buffer;

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
    if (pSoldier.bActive /*&& pSoldier->bInSector*/ && pSoldier.bLife && pSoldier.ubProfile == NO_PROFILE) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.pSoldier != pSoldier) {
        curr = curr.next;
      }
      if (curr && curr.pSoldier == pSoldier && pSoldier.ubProfile == NO_PROFILE) {
        // found a match.

        if (!fValidateOnly) {
          if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
            if (!curr.pDetailedPlacement) {
              // need to upgrade the placement to detailed placement
              curr.pBasicPlacement.fDetailedPlacement = true;
              curr.pDetailedPlacement = createSoldierCreateStruct();
            }

            // Copy over the data of the soldier.
            curr.pDetailedPlacement.ubProfile = NO_PROFILE;
            curr.pDetailedPlacement.bLife = pSoldier.bLife;
            curr.pDetailedPlacement.bLifeMax = pSoldier.bLifeMax;
            curr.pDetailedPlacement.bAgility = pSoldier.bAgility;
            curr.pDetailedPlacement.bDexterity = pSoldier.bDexterity;
            curr.pDetailedPlacement.bExpLevel = pSoldier.bExpLevel;
            curr.pDetailedPlacement.bMarksmanship = pSoldier.bMarksmanship;
            curr.pDetailedPlacement.bMedical = pSoldier.bMedical;
            curr.pDetailedPlacement.bMechanical = pSoldier.bMechanical;
            curr.pDetailedPlacement.bExplosive = pSoldier.bExplosive;
            curr.pDetailedPlacement.bLeadership = pSoldier.bLeadership;
            curr.pDetailedPlacement.bStrength = pSoldier.bStrength;
            curr.pDetailedPlacement.bWisdom = pSoldier.bWisdom;
            curr.pDetailedPlacement.bAttitude = pSoldier.bAttitude;
            curr.pDetailedPlacement.bOrders = pSoldier.bOrders;
            curr.pDetailedPlacement.bMorale = pSoldier.bMorale;
            curr.pDetailedPlacement.bAIMorale = pSoldier.bAIMorale;
            curr.pDetailedPlacement.bBodyType = pSoldier.ubBodyType;
            curr.pDetailedPlacement.ubCivilianGroup = pSoldier.ubCivilianGroup;
            curr.pDetailedPlacement.ubScheduleID = pSoldier.ubScheduleID;
            curr.pDetailedPlacement.fHasKeys = Boolean(pSoldier.bHasKeys);
            curr.pDetailedPlacement.sSectorX = pSoldier.sSectorX;
            curr.pDetailedPlacement.sSectorY = pSoldier.sSectorY;
            curr.pDetailedPlacement.bSectorZ = pSoldier.bSectorZ;
            curr.pDetailedPlacement.ubSoldierClass = pSoldier.ubSoldierClass;
            curr.pDetailedPlacement.bTeam = pSoldier.bTeam;
            curr.pDetailedPlacement.bDirection = pSoldier.bDirection;

            // we don't want the player to think that all the enemies start in the exact position when we
            // left the map, so randomize the start locations either current position or original position.
            if (PreRandom(2)) {
              // use current position
              curr.pDetailedPlacement.fOnRoof = Boolean(pSoldier.bLevel);
              curr.pDetailedPlacement.sInsertionGridNo = pSoldier.sGridNo;
            } else {
              // use original position
              curr.pDetailedPlacement.fOnRoof = curr.pBasicPlacement.fOnRoof;
              curr.pDetailedPlacement.sInsertionGridNo = curr.pBasicPlacement.usStartingGridNo;
            }

            curr.pDetailedPlacement.name = pSoldier.name;

            // Copy patrol points
            curr.pDetailedPlacement.bPatrolCnt = pSoldier.bPatrolCnt;
            copyArray(curr.pDetailedPlacement.sPatrolGrid, pSoldier.usPatrolGrid);

            // copy colors for soldier based on the body type.
            curr.pDetailedPlacement.HeadPal = pSoldier.HeadPal;
            curr.pDetailedPlacement.VestPal = pSoldier.VestPal;
            curr.pDetailedPlacement.SkinPal = pSoldier.SkinPal;
            curr.pDetailedPlacement.PantsPal = pSoldier.PantsPal;
            curr.pDetailedPlacement.MiscPal = pSoldier.MiscPal;

            // copy soldier's inventory
            copyObjectArray(curr.pDetailedPlacement.Inv, pSoldier.inv, copyObjectType);
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
      return true;
    } else {
      // No need to save anything, so return successfully
      RemoveCivilianTempFile(sSectorX, sSectorY, bSectorZ);
      return true;
    }
  }

  if (fValidateOnly) {
    return true;
  }

  // STEP TWO:  Set up the temp file to write to.

  // Convert the current sector location into a file name
  // GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  if (fEnemy) {
    // add the 'e' for 'Enemy preserved' to the front of the map name
    // sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);
    zMapName = GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);
  } else {
    // add the 'e' for 'Enemy preserved' to the front of the map name
    // sprintf( zMapName, "%s\\c_%s", MAPS_DIR, zTempName);
    zMapName = GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);
  }

  // Open the file for writing, Create it if it doesnt exist
  hfile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hfile == 0) {
    // Error opening map modification file
    return false;
  }

  sizeBuffer.writeInt16LE(sSectorY, 0);
  uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 2);
  if (uiNumBytesWritten != 2) {
    FileClose(hfile);
    return false;
  }

  // STEP THREE:  Save the data

  // this works for both civs and enemies
  SaveSoldierInitListLinks(hfile);

  sizeBuffer.writeInt16LE(sSectorX, 0);
  uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 2);
  if (uiNumBytesWritten != 2) {
    FileClose(hfile);
    return false;
  }

  // This check may appear confusing.  It is intended to abort if the player is saving the game.  It is only
  // supposed to preserve the links to the placement list, so when we finally do leave the level with enemies remaining,
  // we will need the links that are only added when the map is loaded, and are normally lost when restoring a save.
  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    slots = 0;
  }

  sizeBuffer.writeInt32LE(slots, 0);
  uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 4);
  if (uiNumBytesWritten != 4) {
    FileClose(hfile);
    return false;
  }

  uiTimeStamp = GetWorldTotalMin();
  sizeBuffer.writeUInt32LE(uiTimeStamp, 0);
  uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 4);
  if (uiNumBytesWritten != 4) {
    FileClose(hfile);
    return false;
  }

  sizeBuffer.writeInt8(bSectorZ, 0);
  uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 1);
  if (uiNumBytesWritten != 1) {
    FileClose(hfile);
    return false;
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
    return true;
  }

  dataBuffer = Buffer.allocUnsafe(SOLDIER_CREATE_STRUCT_SIZE);
  for (i = gTacticalStatus.Team[ubStartID].bFirstID; i <= gTacticalStatus.Team[ubEndID].bLastID; i++) {
    pSoldier = MercPtrs[i];
    // CJC: note that bInSector is not required; the civ could be offmap!
    if (pSoldier.bActive /*&& pSoldier->bInSector*/ && pSoldier.bLife) {
      // soldier is valid, so find the matching soldier init list entry for modification.
      curr = gSoldierInitHead;
      while (curr && curr.pSoldier != pSoldier) {
        curr = curr.next;
      }
      if (curr && curr.pSoldier == pSoldier && pSoldier.ubProfile == NO_PROFILE) {
        Assert(curr.pDetailedPlacement);
        // found a match.
        writeSoldierCreateStruct(curr.pDetailedPlacement, dataBuffer);
        uiNumBytesWritten = FileWrite(hfile, dataBuffer, SOLDIER_CREATE_STRUCT_SIZE);
        if (uiNumBytesWritten != SOLDIER_CREATE_STRUCT_SIZE) {
          FileClose(hfile);
          return false;
        }
        // insert a checksum equation (anti-hack)
        usCheckSum = curr.pDetailedPlacement.bLife * 7 + curr.pDetailedPlacement.bLifeMax * 8 - curr.pDetailedPlacement.bAgility * 2 + curr.pDetailedPlacement.bDexterity * 1 + curr.pDetailedPlacement.bExpLevel * 5 - curr.pDetailedPlacement.bMarksmanship * 9 + curr.pDetailedPlacement.bMedical * 10 + curr.pDetailedPlacement.bMechanical * 3 + curr.pDetailedPlacement.bExplosive * 4 + curr.pDetailedPlacement.bLeadership * 5 + curr.pDetailedPlacement.bStrength * 7 + curr.pDetailedPlacement.bWisdom * 11 + curr.pDetailedPlacement.bMorale * 7 + curr.pDetailedPlacement.bAIMorale * 3 - curr.pDetailedPlacement.bBodyType * 7 + 4 * 6 + curr.pDetailedPlacement.sSectorX * 7 - curr.pDetailedPlacement.ubSoldierClass * 4 + curr.pDetailedPlacement.bTeam * 7 + curr.pDetailedPlacement.bDirection * 5 + Number(curr.pDetailedPlacement.fOnRoof) * 17 + curr.pDetailedPlacement.sInsertionGridNo * 1 + 3;
        sizeBuffer.writeUInt16LE(usCheckSum, 0);
        uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 2);
        if (uiNumBytesWritten != 2) {
          FileClose(hfile);
          return false;
        }
      }
    }
  }

  ubSectorID = SECTOR(sSectorX, sSectorY);
  sizeBuffer.writeUInt8(ubSectorID, 0);
  uiNumBytesWritten = FileWrite(hfile, sizeBuffer, 1);
  if (uiNumBytesWritten != 1) {
    FileClose(hfile);
    return false;
  }

  FileClose(hfile);

  if (fEnemy) {
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS);
  } else {
    SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
  }

  return true;

FAIL_SAVE:
  FileClose(hfile);
  return false;
}

function CountNumberOfElitesRegularsAdminsAndCreaturesFromEnemySoldiersTempFile(pubNumElites: Pointer<UINT8>, pubNumRegulars: Pointer<UINT8>, pubNumAdmins: Pointer<UINT8>, pubNumCreatures: Pointer<UINT8>): boolean {
  //	SOLDIERINITNODE *curr;
  let tempDetailedPlacement: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let i: INT32;
  let slots: INT32 = 0;
  let uiNumBytesRead: UINT32;
  let uiTimeStamp: UINT32;
  let hfile: HWFILE;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let usCheckSum: UINT16;
  let zMapName: string /* CHAR8[128] */;
  let bSectorZ: INT8;
  let ubSectorID: UINT8;
  //	UINT8 ubNumElites = 0, ubNumTroops = 0, ubNumAdmins = 0, ubNumCreatures = 0;
  //	UINT8 ubStrategicElites, ubStrategicTroops, ubStrategicAdmins, ubStrategicCreatures;
  let sizeBuffer: Buffer = Buffer.allocUnsafe(4);
  let dataBuffer: Buffer;

  // make sure the variables are initialized
  pubNumElites.value = 0;
  pubNumRegulars.value = 0;
  pubNumAdmins.value = 0;
  pubNumCreatures.value = 0;

  // STEP ONE:  Set up the temp file to read from.

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'e' for 'Enemy preserved' to the front of the map name
  //	sprintf( zMapName, "%s\\e_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Open the file for reading
  hfile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hfile == 0) {
    // Error opening map modification file
    return false;
  }

  // STEP TWO:  determine whether or not we should use this data.
  // because it is the demo, it is automatically used.

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorY = sizeBuffer.readInt16LE(0);

  if (gWorldSectorY != sSectorY) {
    FileClose(hfile);
    return false;
  }

  //	LoadSoldierInitListLinks( hfile );
  LookAtButDontProcessEnemySoldierInitListLinks(hfile);

  // STEP THREE:  read the data

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
  if (uiNumBytesRead != 2) {
    FileClose(hfile);
    return false;
  }
  sSectorX = sizeBuffer.readInt16LE(0);

  if (gWorldSectorX != sSectorX) {
    FileClose(hfile);
    return false;
  }

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  slots = sizeBuffer.readInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hfile);
    return false;
  }
  uiTimeStamp = sizeBuffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  bSectorZ = sizeBuffer.readInt8(0);

  if (gbWorldSectorZ != bSectorZ) {
    FileClose(hfile);
    return false;
  }

  if (!slots) {
    // no need to restore the enemy's to the map.  This means we are restoring a saved game.
    FileClose(hfile);
    return true;
  }

  if (slots < 0 || slots >= 64) {
    // bad IO!
    FileClose(hfile);
    return false;
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

  dataBuffer = Buffer.allocUnsafeSlow(SOLDIER_CREATE_STRUCT_SIZE);
  for (i = 0; i < slots; i++) {
    uiNumBytesRead = FileRead(hfile, dataBuffer, SOLDIER_CREATE_STRUCT_SIZE);
    if (uiNumBytesRead != SOLDIER_CREATE_STRUCT_SIZE) {
      FileClose(hfile);
      return false;
    }
    readSoldierCreateStruct(tempDetailedPlacement, dataBuffer);

    // increment the current type of soldier
    switch (tempDetailedPlacement.ubSoldierClass) {
      case Enum262.SOLDIER_CLASS_ELITE:
        (pubNumElites.value)++;
        break;
      case Enum262.SOLDIER_CLASS_ARMY:
        (pubNumRegulars.value)++;
        break;
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
        (pubNumAdmins.value)++;
        break;
      case Enum262.SOLDIER_CLASS_CREATURE:
        (pubNumCreatures.value)++;
        break;
    }

    uiNumBytesRead = FileRead(hfile, sizeBuffer, 2);
    if (uiNumBytesRead != 2) {
      FileClose(hfile);
      return false;
    }
    usCheckSum = sizeBuffer.readUInt16LE(0);
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

  uiNumBytesRead = FileRead(hfile, sizeBuffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hfile);
    return false;
  }
  ubSectorID = sizeBuffer.readUInt8(0);

  if (ubSectorID != SECTOR(sSectorX, sSectorY)) {
    FileClose(hfile);
    return false;
  }

  // successful
  FileClose(hfile);
  return true;

FAIL_LOAD:
  // The temp file load failed either because of IO problems related to hacking/logic, or
  // various checks failed for hacker validation.  If we reach this point, the "error: exit game"
  // dialog would appear in a non-testversion.
  FileClose(hfile);
  return false;
}

}
