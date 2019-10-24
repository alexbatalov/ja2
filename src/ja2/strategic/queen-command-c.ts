// Queen Command.c

// The sector information required for the strategic AI.  Contains the number of enemy troops,
// as well as intentions, etc.
let SectorInfo: SECTORINFO[] /* [256] */;
let gpUndergroundSectorInfoHead: Pointer<UNDERGROUND_SECTORINFO> = null;
let gfPendingEnemies: BOOLEAN = FALSE;

let gsInterrogationGridNo: INT16[] /* [3] */ = [
  7756,
  7757,
  7758,
];

function ValidateEnemiesHaveWeapons(): void {
}

// Counts enemies and crepitus, but not bloodcats.
function NumHostilesInSector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): UINT8 {
  let ubNumHostiles: UINT8 = 0;

  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  Assert(sSectorZ >= 0 && sSectorZ <= 3);

  if (sSectorZ) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, sSectorZ);
    if (pSector) {
      ubNumHostiles = (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites + pSector.value.ubNumCreatures);
    }
  } else {
    let pSector: Pointer<SECTORINFO>;
    let pGroup: Pointer<GROUP>;

    // Count stationary hostiles
    pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);
    ubNumHostiles = (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites + pSector.value.ubNumCreatures);

    // Count mobile enemies
    pGroup = gpGroupList;
    while (pGroup) {
      if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == sSectorX && pGroup.value.ubSectorY == sSectorY) {
        ubNumHostiles += pGroup.value.ubGroupSize;
      }
      pGroup = pGroup.value.next;
    }
  }

  return ubNumHostiles;
}

function NumEnemiesInAnySector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): UINT8 {
  let ubNumEnemies: UINT8 = 0;

  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  Assert(sSectorZ >= 0 && sSectorZ <= 3);

  if (sSectorZ) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, sSectorZ);
    if (pSector) {
      ubNumEnemies = (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites);
    }
  } else {
    let pSector: Pointer<SECTORINFO>;
    let pGroup: Pointer<GROUP>;

    // Count stationary enemies
    pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);
    ubNumEnemies = (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites);

    // Count mobile enemies
    pGroup = gpGroupList;
    while (pGroup) {
      if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == sSectorX && pGroup.value.ubSectorY == sSectorY) {
        ubNumEnemies += pGroup.value.ubGroupSize;
      }
      pGroup = pGroup.value.next;
    }
  }

  return ubNumEnemies;
}

function NumEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let pSector: Pointer<SECTORINFO>;
  let pGroup: Pointer<GROUP>;
  let ubNumTroops: UINT8;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);
  ubNumTroops = (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites);

  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == sSectorX && pGroup.value.ubSectorY == sSectorY) {
      ubNumTroops += pGroup.value.ubGroupSize;
    }
    pGroup = pGroup.value.next;
  }
  return ubNumTroops;
}

function NumStationaryEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let pSector: Pointer<SECTORINFO>;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);

  if (pSector.value.ubGarrisonID == NO_GARRISON) {
    // If no garrison, no stationary.
    return 0;
  }

  // don't count roadblocks as stationary garrison, we want to see how many enemies are in them, not question marks
  if (gGarrisonGroup[pSector.value.ubGarrisonID].ubComposition == Enum174.ROADBLOCK) {
    // pretend they're not stationary
    return 0;
  }

  return (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites);
}

function NumMobileEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let pGroup: Pointer<GROUP>;
  let pSector: Pointer<SECTORINFO>;
  let ubNumTroops: UINT8;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);

  ubNumTroops = 0;
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == sSectorX && pGroup.value.ubSectorY == sSectorY) {
      ubNumTroops += pGroup.value.ubGroupSize;
    }
    pGroup = pGroup.value.next;
  }

  pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);
  if (pSector.value.ubGarrisonID == Enum174.ROADBLOCK) {
    // consider these troops as mobile troops even though they are in a garrison
    ubNumTroops += (pSector.value.ubNumAdmins + pSector.value.ubNumTroops + pSector.value.ubNumElites);
  }

  return ubNumTroops;
}

function GetNumberOfMobileEnemiesInSector(sSectorX: INT16, sSectorY: INT16, pubNumAdmins: Pointer<UINT8>, pubNumTroops: Pointer<UINT8>, pubNumElites: Pointer<UINT8>): void {
  let pGroup: Pointer<GROUP>;
  let pSector: Pointer<SECTORINFO>;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);

  // Now count the number of mobile groups in the sector.
  pubNumTroops.value = pubNumElites.value = pubNumAdmins.value = 0;
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == sSectorX && pGroup.value.ubSectorY == sSectorY) {
      pubNumTroops.value += pGroup.value.pEnemyGroup.value.ubNumTroops;
      pubNumElites.value += pGroup.value.pEnemyGroup.value.ubNumElites;
      pubNumAdmins.value += pGroup.value.pEnemyGroup.value.ubNumAdmins;
    }
    pGroup = pGroup.value.next;
  }

  pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);
  if (pSector.value.ubGarrisonID == Enum174.ROADBLOCK) {
    // consider these troops as mobile troops even though they are in a garrison
    pubNumAdmins.value += pSector.value.ubNumAdmins;
    pubNumTroops.value += pSector.value.ubNumTroops;
    pubNumElites.value += pSector.value.ubNumElites;
  }
}

function GetNumberOfStationaryEnemiesInSector(sSectorX: INT16, sSectorY: INT16, pubNumAdmins: Pointer<UINT8>, pubNumTroops: Pointer<UINT8>, pubNumElites: Pointer<UINT8>): void {
  let pSector: Pointer<SECTORINFO>;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  pSector = addressof(SectorInfo[SECTOR(sSectorX, sSectorY)]);

  // grab the number of each type in the stationary sector
  pubNumAdmins.value = pSector.value.ubNumAdmins;
  pubNumTroops.value = pSector.value.ubNumTroops;
  pubNumElites.value = pSector.value.ubNumElites;
}

function GetNumberOfEnemiesInSector(sSectorX: INT16, sSectorY: INT16, pubNumAdmins: Pointer<UINT8>, pubNumTroops: Pointer<UINT8>, pubNumElites: Pointer<UINT8>): void {
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;

  GetNumberOfStationaryEnemiesInSector(sSectorX, sSectorY, pubNumAdmins, pubNumTroops, pubNumElites);

  GetNumberOfMobileEnemiesInSector(sSectorX, sSectorY, addressof(ubNumAdmins), addressof(ubNumTroops), addressof(ubNumElites));

  pubNumAdmins.value += ubNumAdmins;
  pubNumTroops.value += ubNumTroops;
  pubNumElites.value += ubNumElites;
}

function EndTacticalBattleForEnemy(): void {
  let pGroup: Pointer<GROUP>;
  let i: INT32;
  let iNumMilitia: INT32 = 0;
  let iNumEnemies: INT32 = 0;

  // Clear enemies in battle for all stationary groups in the sector.
  if (gbWorldSectorZ > 0) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    pSector.value.ubAdminsInBattle = 0;
    pSector.value.ubTroopsInBattle = 0;
    pSector.value.ubElitesInBattle = 0;
  } else if (!gbWorldSectorZ) {
    let pSector: Pointer<SECTORINFO>;
    pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
    // grab the number of each type in the stationary sector
    pSector.value.ubAdminsInBattle = 0;
    pSector.value.ubTroopsInBattle = 0;
    pSector.value.ubElitesInBattle = 0;
    pSector.value.ubNumCreatures = 0;
    pSector.value.ubCreaturesInBattle = 0;
  } else // negative
    return;

  // Clear this value so that profiled enemies can be added into battles in the future.
  gfProfiledEnemyAdded = FALSE;

  // Clear enemies in battle for all mobile groups in the sector.
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY) {
      pGroup.value.pEnemyGroup.value.ubTroopsInBattle = 0;
      pGroup.value.pEnemyGroup.value.ubElitesInBattle = 0;
      pGroup.value.pEnemyGroup.value.ubAdminsInBattle = 0;
    }
    pGroup = pGroup.value.next;
  }

  // Check to see if any of our mercs have abandoned the militia during a battle.  This is cause for a rather
  // severe loyalty blow.
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bInSector && MercPtrs[i].value.bLife >= OKLIFE) {
      // found one live militia, so look for any enemies/creatures.
      // NOTE: this is relying on ENEMY_TEAM being immediately followed by CREATURE_TEAM
      for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
        if (MercPtrs[i].value.bActive && MercPtrs[i].value.bInSector && MercPtrs[i].value.bLife >= OKLIFE) {
          // confirmed at least one enemy here, so do the loyalty penalty.
          HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_ABANDON_MILITIA, gWorldSectorX, gWorldSectorY, 0);
          break;
        }
      }
      break;
    }
  }
}

function NumFreeEnemySlots(): UINT8 {
  let ubNumFreeSlots: UINT8 = 0;
  let i: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  // Count the number of free enemy slots.  It is possible to have multiple groups exceed the maximum.
  for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; i++) {
    pSoldier = addressof(Menptr[i]);
    if (!pSoldier.value.bActive)
      ubNumFreeSlots++;
  }
  return ubNumFreeSlots;
}

// Called when entering a sector so the campaign AI can automatically insert the
// correct number of troops of each type based on the current number in the sector
// in global focus (gWorldSectorX/Y)
function PrepareEnemyForSectorBattle(): BOOLEAN {
  let pSector: Pointer<SECTORINFO>;
  let pGroup: Pointer<GROUP>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;
  let ubTotalAdmins: UINT8;
  let ubTotalElites: UINT8;
  let ubTotalTroops: UINT8;
  let ubStationaryEnemies: UINT8;
  let i: INT32;
  let num: INT32;
  let sNumSlots: INT16;

  gfPendingEnemies = FALSE;

  if (gbWorldSectorZ > 0)
    return PrepareEnemyForUndergroundBattle();

  if (gpBattleGroup && !gpBattleGroup.value.fPlayer) {
    // The enemy has instigated the battle which means they are the ones entering the conflict.
    // The player was actually in the sector first, and the enemy doesn't use reinforced placements
    HandleArrivalOfReinforcements(gpBattleGroup);
    // It is possible that other enemy groups have also arrived.  Add them in the same manner.
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup != gpBattleGroup && !pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == gpBattleGroup.value.ubSectorX && pGroup.value.ubSectorY == gpBattleGroup.value.ubSectorY && !pGroup.value.pEnemyGroup.value.ubAdminsInBattle && !pGroup.value.pEnemyGroup.value.ubTroopsInBattle && !pGroup.value.pEnemyGroup.value.ubElitesInBattle) {
        HandleArrivalOfReinforcements(pGroup);
      }
      pGroup = pGroup.value.next;
    }
    ValidateEnemiesHaveWeapons();
    return (gpBattleGroup.value.ubGroupSize > 0);
  }

  if (!gbWorldSectorZ) {
    if (NumEnemiesInSector(gWorldSectorX, gWorldSectorY) > 32) {
      gfPendingEnemies = TRUE;
    }
  }

  pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
  if (pSector.value.uiFlags & SF_USE_MAP_SETTINGS) {
    // count the number of enemy placements in a map and use those
    let curr: Pointer<SOLDIERINITNODE>;
    curr = gSoldierInitHead;
    ubTotalAdmins = ubTotalTroops = ubTotalElites = 0;
    while (curr) {
      if (curr.value.pBasicPlacement.value.bTeam == ENEMY_TEAM) {
        switch (curr.value.pBasicPlacement.value.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            ubTotalAdmins++;
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            ubTotalTroops++;
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            ubTotalElites++;
            break;
        }
      }
      curr = curr.value.next;
    }
    pSector.value.ubNumAdmins = ubTotalAdmins;
    pSector.value.ubNumTroops = ubTotalTroops;
    pSector.value.ubNumElites = ubTotalElites;
    pSector.value.ubAdminsInBattle = 0;
    pSector.value.ubTroopsInBattle = 0;
    pSector.value.ubElitesInBattle = 0;
  } else {
    ubTotalAdmins = (pSector.value.ubNumAdmins - pSector.value.ubAdminsInBattle);
    ubTotalTroops = (pSector.value.ubNumTroops - pSector.value.ubTroopsInBattle);
    ubTotalElites = (pSector.value.ubNumElites - pSector.value.ubElitesInBattle);
  }
  ubStationaryEnemies = (ubTotalAdmins + ubTotalTroops + ubTotalElites);

  if (ubTotalAdmins + ubTotalTroops + ubTotalElites > 32) {
    ubTotalAdmins = min(32, ubTotalAdmins);
    ubTotalTroops = min(32 - ubTotalAdmins, ubTotalTroops);
    ubTotalElites = min(32 - ubTotalAdmins + ubTotalTroops, ubTotalElites);
  }

  pSector.value.ubAdminsInBattle += ubTotalAdmins;
  pSector.value.ubTroopsInBattle += ubTotalTroops;
  pSector.value.ubElitesInBattle += ubTotalElites;

  // Search for movement groups that happen to be in the sector.
  sNumSlots = NumFreeEnemySlots();
  // Test:  All slots should be free at this point!
  if (sNumSlots != gTacticalStatus.Team[ENEMY_TEAM].bLastID - gTacticalStatus.Team[ENEMY_TEAM].bFirstID + 1) {
  }
  // Subtract the total number of stationary enemies from the available slots, as stationary forces take
  // precendence in combat.  The mobile forces that could also be in the same sector are considered later if
  // all the slots fill up.
  sNumSlots -= ubTotalAdmins + ubTotalTroops + ubTotalElites;
  // Now, process all of the groups and search for both enemy and player groups in the sector.
  // For enemy groups, we fill up the slots until we have none left or all of the groups have been
  // processed.
  pGroup = gpGroupList;
  while (pGroup && sNumSlots) {
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // Process enemy group in sector.
      if (sNumSlots > 0) {
        ubNumAdmins = (pGroup.value.pEnemyGroup.value.ubNumAdmins - pGroup.value.pEnemyGroup.value.ubAdminsInBattle);
        sNumSlots -= ubNumAdmins;
        if (sNumSlots < 0) {
          // adjust the value to zero
          ubNumAdmins += sNumSlots;
          sNumSlots = 0;
          gfPendingEnemies = TRUE;
        }
        pGroup.value.pEnemyGroup.value.ubAdminsInBattle += ubNumAdmins;
        ubTotalAdmins += ubNumAdmins;
      }
      if (sNumSlots > 0) {
        // Add regular army forces.
        ubNumTroops = (pGroup.value.pEnemyGroup.value.ubNumTroops - pGroup.value.pEnemyGroup.value.ubTroopsInBattle);
        sNumSlots -= ubNumTroops;
        if (sNumSlots < 0) {
          // adjust the value to zero
          ubNumTroops += sNumSlots;
          sNumSlots = 0;
          gfPendingEnemies = TRUE;
        }
        pGroup.value.pEnemyGroup.value.ubTroopsInBattle += ubNumTroops;
        ubTotalTroops += ubNumTroops;
      }
      if (sNumSlots > 0) {
        // Add elite troops
        ubNumElites = (pGroup.value.pEnemyGroup.value.ubNumElites - pGroup.value.pEnemyGroup.value.ubElitesInBattle);
        sNumSlots -= ubNumElites;
        if (sNumSlots < 0) {
          // adjust the value to zero
          ubNumElites += sNumSlots;
          sNumSlots = 0;
          gfPendingEnemies = TRUE;
        }
        pGroup.value.pEnemyGroup.value.ubElitesInBattle += ubNumElites;
        ubTotalElites += ubNumElites;
      }
      // NOTE:
      // no provisions for profile troop leader or retreat groups yet.
    }
    if (pGroup.value.fPlayer && !pGroup.value.fVehicle && !pGroup.value.fBetweenSectors && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // TEMP:  The player path needs to get destroyed, otherwise, it'll be impossible to move the
      //			 group after the battle is resolved.

      // no one in the group any more continue loop
      if (pGroup.value.pPlayerList == null) {
        pGroup = pGroup.value.next;
        continue;
      }

      // clear the movt for this grunt and his buddies
      RemoveGroupWaypoints(pGroup.value.ubGroupID);
    }
    pGroup = pGroup.value.next;
  }

  // if there are no troops in the current groups, then we're done.
  if (!ubTotalAdmins && !ubTotalTroops && !ubTotalElites) {
    return FALSE;
  }

  AddSoldierInitListEnemyDefenceSoldiers(ubTotalAdmins, ubTotalTroops, ubTotalElites);

  // Now, we have to go through all of the enemies in the new map, and assign their respective groups if
  // in a mobile group, but only for the ones that were assigned from the
  sNumSlots = 32 - ubStationaryEnemies;

  pGroup = gpGroupList;
  while (pGroup && sNumSlots) {
    i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;
    pSoldier = addressof(Menptr[i]);
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      num = pGroup.value.ubGroupSize;
      ubNumAdmins = pGroup.value.pEnemyGroup.value.ubAdminsInBattle;
      ubNumTroops = pGroup.value.pEnemyGroup.value.ubTroopsInBattle;
      ubNumElites = pGroup.value.pEnemyGroup.value.ubElitesInBattle;
      while (num && sNumSlots && i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID) {
        while (!pSoldier.value.bActive || pSoldier.value.ubGroupID) {
          pSoldier = addressof(Menptr[++i]);
          if (i > gTacticalStatus.Team[ENEMY_TEAM].bLastID) {
            AssertMsg(0, "Failed to assign battle counters for enemies properly. Please send save. KM:0.");
          }
        }
        switch (pSoldier.value.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            if (ubNumAdmins) {
              num--;
              sNumSlots--;
              ubNumAdmins--;
              pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
            }
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            if (ubNumTroops) {
              num--;
              sNumSlots--;
              ubNumTroops--;
              pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
            }
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            if (ubNumElites) {
              num--;
              sNumSlots--;
              ubNumElites--;
              pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
            }
            break;
        }
        pSoldier = addressof(Menptr[++i]);
      }
    }
    pGroup = pGroup.value.next;
  }

  ValidateEnemiesHaveWeapons();

  return TRUE;
}

function PrepareEnemyForUndergroundBattle(): BOOLEAN {
  let pUnderground: Pointer<UNDERGROUND_SECTORINFO>;
  let ubTotalAdmins: UINT8;
  let ubTotalTroops: UINT8;
  let ubTotalElites: UINT8;
  pUnderground = gpUndergroundSectorInfoHead;
  while (pUnderground) {
    if (pUnderground.value.ubSectorX == gWorldSectorX && pUnderground.value.ubSectorY == gWorldSectorY && pUnderground.value.ubSectorZ == gbWorldSectorZ) {
      // This is the sector we are going to be fighting in.
      if (pUnderground.value.ubNumAdmins || pUnderground.value.ubNumTroops || pUnderground.value.ubNumElites) {
        ubTotalAdmins = (pUnderground.value.ubNumAdmins - pUnderground.value.ubAdminsInBattle);
        ubTotalTroops = (pUnderground.value.ubNumTroops - pUnderground.value.ubTroopsInBattle);
        ubTotalElites = (pUnderground.value.ubNumElites - pUnderground.value.ubElitesInBattle);
        pUnderground.value.ubAdminsInBattle += ubTotalAdmins;
        pUnderground.value.ubTroopsInBattle += ubTotalTroops;
        pUnderground.value.ubElitesInBattle += ubTotalElites;
        AddSoldierInitListEnemyDefenceSoldiers(pUnderground.value.ubNumAdmins, pUnderground.value.ubNumTroops, pUnderground.value.ubNumElites);
        ValidateEnemiesHaveWeapons();
      }
      return (pUnderground.value.ubNumAdmins + pUnderground.value.ubNumTroops + pUnderground.value.ubNumElites > 0);
    }
    pUnderground = pUnderground.value.next;
  }

  // underground sector not found in list
  Assert(FALSE);
  return FALSE;
}

// The queen AI layer must process the event by subtracting forces, etc.
function ProcessQueenCmdImplicationsOfDeath(pSoldier: Pointer<SOLDIERTYPE>): void {
  let iNumEnemiesInSector: INT32;
  let pSector: Pointer<SECTORINFO>;
  let str: UINT16[] /* [128] */;
  EvaluateDeathEffectsToSoldierInitList(pSoldier);

  switch (pSoldier.value.ubProfile) {
    case Enum268.MIKE:
    case Enum268.IGGY:
      if (pSoldier.value.ubProfile == Enum268.IGGY && !gubFact[Enum170.FACT_IGGY_AVAILABLE_TO_ARMY]) {
        // Iggy is on our team!
        break;
      }
      if (!pSoldier.value.bSectorZ) {
        pSector = addressof(SectorInfo[SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY)]);
        if (pSector.value.ubNumElites) {
          pSector.value.ubNumElites--;
        }
        if (pSector.value.ubElitesInBattle) {
          pSector.value.ubElitesInBattle--;
        }
      } else {
        let pUnderground: Pointer<UNDERGROUND_SECTORINFO>;
        pUnderground = FindUnderGroundSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
        Assert(pUnderground);
        if (pUnderground.value.ubNumElites) {
          pUnderground.value.ubNumElites--;
        }
        if (pUnderground.value.ubElitesInBattle) {
          pUnderground.value.ubElitesInBattle--;
        }
      }
      break;
  }

  if (pSoldier.value.bNeutral || pSoldier.value.bTeam != ENEMY_TEAM && pSoldier.value.bTeam != CREATURE_TEAM)
    return;
  // we are recording an enemy death
  if (pSoldier.value.ubGroupID) {
    // The enemy was in a mobile group
    let pGroup: Pointer<GROUP>;
    pGroup = GetGroup(pSoldier.value.ubGroupID);
    if (!pGroup) {
      return;
    }
    if (pGroup.value.fPlayer) {
      return;
    }
    switch (pSoldier.value.ubSoldierClass) {
      case Enum262.SOLDIER_CLASS_ELITE:
        if (pGroup.value.pEnemyGroup.value.ubNumElites) {
          pGroup.value.pEnemyGroup.value.ubNumElites--;
        }
        if (pGroup.value.pEnemyGroup.value.ubElitesInBattle) {
          pGroup.value.pEnemyGroup.value.ubElitesInBattle--;
        }
        break;
      case Enum262.SOLDIER_CLASS_ARMY:
        if (pGroup.value.pEnemyGroup.value.ubNumTroops) {
          pGroup.value.pEnemyGroup.value.ubNumTroops--;
        }
        if (pGroup.value.pEnemyGroup.value.ubTroopsInBattle) {
          pGroup.value.pEnemyGroup.value.ubTroopsInBattle--;
        }
        break;
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
        if (pGroup.value.pEnemyGroup.value.ubNumAdmins) {
          pGroup.value.pEnemyGroup.value.ubNumAdmins--;
        }
        if (pGroup.value.pEnemyGroup.value.ubAdminsInBattle) {
          pGroup.value.pEnemyGroup.value.ubAdminsInBattle--;
        }
        break;
    }
    if (pGroup.value.ubGroupSize)
      pGroup.value.ubGroupSize--;
    RecalculateGroupWeight(pGroup);
    if (!pGroup.value.ubGroupSize) {
      RemovePGroup(pGroup);
    }
  } else {
    // The enemy was in a stationary defence group
    if (!gbWorldSectorZ || IsAutoResolveActive()) {
      // ground level (SECTORINFO)
      let pSector: Pointer<SECTORINFO>;

      if (!IsAutoResolveActive()) {
        pSector = addressof(SectorInfo[SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY)]);
      } else {
        pSector = addressof(SectorInfo[GetAutoResolveSectorID()]);
      }

      switch (pSoldier.value.ubSoldierClass) {
        case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
          if (pSector.value.ubNumAdmins) {
            pSector.value.ubNumAdmins--;
          }
          if (pSector.value.ubAdminsInBattle) {
            pSector.value.ubAdminsInBattle--;
          }
          break;
        case Enum262.SOLDIER_CLASS_ARMY:
          if (pSector.value.ubNumTroops) {
            pSector.value.ubNumTroops--;
          }
          if (pSector.value.ubTroopsInBattle) {
            pSector.value.ubTroopsInBattle--;
          }
          break;
        case Enum262.SOLDIER_CLASS_ELITE:
          if (pSector.value.ubNumElites) {
            pSector.value.ubNumElites--;
          }
          if (pSector.value.ubElitesInBattle) {
            pSector.value.ubElitesInBattle--;
          }
          break;
        case Enum262.SOLDIER_CLASS_CREATURE:
          if (pSoldier.value.ubBodyType != Enum194.BLOODCAT) {
            if (pSector.value.ubNumCreatures) {
              pSector.value.ubNumCreatures--;
            }
            if (pSector.value.ubCreaturesInBattle) {
              pSector.value.ubCreaturesInBattle--;
            }
          } else {
            if (pSector.value.bBloodCats) {
              pSector.value.bBloodCats--;
            }
          }

          break;
      }
      RecalculateSectorWeight(SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY));
    } else {
      // basement level (UNDERGROUND_SECTORINFO)
      let pSector: Pointer<UNDERGROUND_SECTORINFO> = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      if (pSector) {
        switch (pSoldier.value.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            if (pSector.value.ubNumAdmins) {
              pSector.value.ubNumAdmins--;
            }
            if (pSector.value.ubAdminsInBattle) {
              pSector.value.ubAdminsInBattle--;
            }
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            if (pSector.value.ubNumTroops) {
              pSector.value.ubNumTroops--;
            }
            if (pSector.value.ubTroopsInBattle) {
              pSector.value.ubTroopsInBattle--;
            }
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            if (pSector.value.ubNumElites) {
              pSector.value.ubNumElites--;
            }
            if (pSector.value.ubElitesInBattle) {
              pSector.value.ubElitesInBattle--;
            }
            break;
          case Enum262.SOLDIER_CLASS_CREATURE:
            if (pSector.value.ubNumCreatures) {
              pSector.value.ubNumCreatures--;
            }
            if (pSector.value.ubCreaturesInBattle) {
              pSector.value.ubCreaturesInBattle--;
            }

            if (!pSector.value.ubNumCreatures && gWorldSectorX != 9 && gWorldSectorY != 10) {
              // If the player has successfully killed all creatures in ANY underground sector except J9
              // then cancel any pending creature town attack.
              DeleteAllStrategicEventsOfType(Enum132.EVENT_CREATURE_ATTACK);
            }

            // a monster has died.  Post an event to immediately check whether a mine has been cleared.
            AddStrategicEventUsingSeconds(Enum132.EVENT_CHECK_IF_MINE_CLEARED, GetWorldTotalSeconds() + 15, 0);

            if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
              // Need to call this, as the queen is really big, and killing her leaves a bunch
              // of bad tiles in behind her.  Calling this function cleans it up.
              InvalidateWorldRedundency();
              // Now that the queen is dead, turn off the creature quest.
              EndCreatureQuest();
              EndQuest(Enum169.QUEST_CREATURES, gWorldSectorX, gWorldSectorY);
            }
            break;
        }
      }
    }
  }
  if (!pSoldier.value.bSectorZ) {
    pSector = addressof(SectorInfo[SECTOR(pSoldier.value.sSectorX, pSoldier.value.sSectorY)]);
    iNumEnemiesInSector = NumEnemiesInSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY);
    if (iNumEnemiesInSector) {
      if (pSector.value.bLastKnownEnemies >= 0) {
        pSector.value.bLastKnownEnemies = iNumEnemiesInSector;
      }
    } else {
      pSector.value.bLastKnownEnemies = 0;
    }
  }
}

// Rarely, there will be more enemies than supported by the engine.  In this case, these
// soldier's are waiting for a slot to be free so that they can enter the battle.  This
// essentially allows for an infinite number of troops, though only 32 at a time can fight.
// This is also called whenever an enemy group's reinforcements arrive because the code is
// identical, though it is highly likely that they will all be successfully added on the first call.
function AddPossiblePendingEnemiesToBattle(): void {
  let ubSlots: UINT8;
  let ubNumAvailable: UINT8;
  let ubNumElites: UINT8;
  let ubNumTroops: UINT8;
  let ubNumAdmins: UINT8;
  let pGroup: Pointer<GROUP>;
  if (!gfPendingEnemies) {
    // Optimization.  No point in checking if we know that there aren't any more enemies that can
    // be added to this battle.  This changes whenever a new enemy group arrives at the scene.
    return;
  }
  ubSlots = NumFreeEnemySlots();
  if (!ubSlots) {
    // no available slots to add enemies to.  Try again later...
    return;
  }
  pGroup = gpGroupList;
  while (pGroup && ubSlots) {
    if (!pGroup.value.fPlayer && !pGroup.value.fVehicle && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // This enemy group is currently in the sector.
      ubNumElites = ubNumTroops = ubNumAdmins = 0;
      ubNumAvailable = pGroup.value.ubGroupSize - pGroup.value.pEnemyGroup.value.ubElitesInBattle - pGroup.value.pEnemyGroup.value.ubTroopsInBattle - pGroup.value.pEnemyGroup.value.ubAdminsInBattle;
      while (ubNumAvailable && ubSlots) {
        // This group has enemies waiting for a chance to enter the battle.
        if (pGroup.value.pEnemyGroup.value.ubTroopsInBattle < pGroup.value.pEnemyGroup.value.ubNumTroops) {
          // Add a regular troop.
          pGroup.value.pEnemyGroup.value.ubTroopsInBattle++;
          ubNumAvailable--;
          ubSlots--;
          ubNumTroops++;
        } else if (pGroup.value.pEnemyGroup.value.ubElitesInBattle < pGroup.value.pEnemyGroup.value.ubNumElites) {
          // Add an elite troop
          pGroup.value.pEnemyGroup.value.ubElitesInBattle++;
          ubNumAvailable--;
          ubSlots--;
          ubNumElites++;
        } else if (pGroup.value.pEnemyGroup.value.ubAdminsInBattle < pGroup.value.pEnemyGroup.value.ubNumAdmins) {
          // Add an elite troop
          pGroup.value.pEnemyGroup.value.ubAdminsInBattle++;
          ubNumAvailable--;
          ubSlots--;
          ubNumAdmins++;
        } else {
          AssertMsg(0, "AddPossiblePendingEnemiesToBattle():  Logic Error -- by Kris");
        }
      }
      if (ubNumAdmins || ubNumTroops || ubNumElites) {
        // This group has contributed forces, then add them now, because different
        // groups appear on different sides of the map.
        let ubStrategicInsertionCode: UINT8 = 0;
        // First, determine which entrypoint to use, based on the travel direction of the group.
        if (pGroup.value.ubPrevX && pGroup.value.ubPrevY) {
          if (pGroup.value.ubSectorX < pGroup.value.ubPrevX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
          else if (pGroup.value.ubSectorX > pGroup.value.ubPrevX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
          else if (pGroup.value.ubSectorY < pGroup.value.ubPrevY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
          else if (pGroup.value.ubSectorY > pGroup.value.ubPrevY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
        } else if (pGroup.value.ubNextX && pGroup.value.ubNextY) {
          if (pGroup.value.ubSectorX < pGroup.value.ubNextX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
          else if (pGroup.value.ubSectorX > pGroup.value.ubNextX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
          else if (pGroup.value.ubSectorY < pGroup.value.ubNextY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
          else if (pGroup.value.ubSectorY > pGroup.value.ubNextY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
        }
        // Add the number of each type of troop and place them in the appropriate positions
        AddEnemiesToBattle(pGroup, ubStrategicInsertionCode, ubNumAdmins, ubNumTroops, ubNumElites, FALSE);
      }
    }
    pGroup = pGroup.value.next;
  }
  if (ubSlots) {
    // After going through the process, we have finished with some free slots and no more enemies to add.
    // So, we can turn off the flag, as this check is no longer needed.
    gfPendingEnemies = FALSE;
  }
}

function NotifyPlayersOfNewEnemies(): void {
  let iSoldiers: INT32;
  let iChosenSoldier: INT32;
  let i: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fIgnoreBreath: BOOLEAN = FALSE;

  iSoldiers = 0;
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    // find a merc that is aware.
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bInSector && pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bBreath >= OKBREATH) {
      iSoldiers++;
    }
  }
  if (!iSoldiers) {
    // look for an out of breath merc.
    fIgnoreBreath = TRUE;

    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      // find a merc that is aware.
      pSoldier = MercPtrs[i];
      if (pSoldier.value.bInSector && pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE) {
        iSoldiers++;
      }
    }
  }
  if (iSoldiers) {
    iChosenSoldier = Random(iSoldiers);
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      // find a merc that is aware.
      pSoldier = MercPtrs[i];
      if (pSoldier.value.bInSector && pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE && ((pSoldier.value.bBreath >= OKBREATH) || fIgnoreBreath)) {
        if (!iChosenSoldier) {
          // ATE: This is to allow special handling of initial heli drop
          if (!DidGameJustStart()) {
            TacticalCharacterDialogueWithSpecialEvent(pSoldier, Enum202.QUOTE_ENEMY_PRESENCE, 0, 0, 0);
          }
          return;
        }
        iChosenSoldier--;
      }
    }
  } else {
    // There is either nobody here or our mercs can't talk
  }
}

function AddEnemiesToBattle(pGroup: Pointer<GROUP>, ubStrategicInsertionCode: UINT8, ubNumAdmins: UINT8, ubNumTroops: UINT8, ubNumElites: UINT8, fMagicallyAppeared: BOOLEAN): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let MapEdgepointInfo: MAPEDGEPOINTINFO;
  let ubCurrSlot: UINT8;
  let ubTotalSoldiers: UINT8;
  let bDesiredDirection: UINT8 = 0;
  switch (ubStrategicInsertionCode) {
    case Enum175.INSERTION_CODE_NORTH:
      bDesiredDirection = Enum245.SOUTHEAST;
      break;
    case Enum175.INSERTION_CODE_EAST:
      bDesiredDirection = Enum245.SOUTHWEST;
      break;
    case Enum175.INSERTION_CODE_SOUTH:
      bDesiredDirection = Enum245.NORTHWEST;
      break;
    case Enum175.INSERTION_CODE_WEST:
      bDesiredDirection = Enum245.NORTHEAST;
      break;
    default:
      AssertMsg(0, "Illegal direction passed to AddEnemiesToBattle()");
      break;
  }

  if (fMagicallyAppeared) {
    // update the strategic counters
    if (!gbWorldSectorZ) {
      let pSector: Pointer<SECTORINFO> = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
      pSector.value.ubNumAdmins += ubNumAdmins;
      pSector.value.ubAdminsInBattle += ubNumAdmins;
      pSector.value.ubNumTroops += ubNumTroops;
      pSector.value.ubTroopsInBattle += ubNumTroops;
      pSector.value.ubNumElites += ubNumElites;
      pSector.value.ubElitesInBattle += ubNumElites;
    } else {
      let pSector: Pointer<UNDERGROUND_SECTORINFO> = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      if (pSector) {
        pSector.value.ubNumAdmins += ubNumAdmins;
        pSector.value.ubAdminsInBattle += ubNumAdmins;
        pSector.value.ubNumTroops += ubNumTroops;
        pSector.value.ubTroopsInBattle += ubNumTroops;
        pSector.value.ubNumElites += ubNumElites;
        pSector.value.ubElitesInBattle += ubNumElites;
      }
    }
    // Because the enemies magically appeared, have one of our soldiers say something...
    NotifyPlayersOfNewEnemies();
  }

  ubTotalSoldiers = ubNumAdmins + ubNumTroops + ubNumElites;

  ChooseMapEdgepoints(addressof(MapEdgepointInfo), ubStrategicInsertionCode, (ubNumAdmins + ubNumElites + ubNumTroops));
  ubCurrSlot = 0;
  while (ubTotalSoldiers) {
    if (ubNumElites && Random(ubTotalSoldiers) < ubNumElites) {
      ubNumElites--;
      ubTotalSoldiers--;
      pSoldier = TacticalCreateEliteEnemy();
      if (pGroup) {
        pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
      }

      pSoldier.value.ubInsertionDirection = bDesiredDirection;
      // Setup the position
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.value.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;
      }
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
    } else if (ubNumTroops && Random(ubTotalSoldiers) < (ubNumElites + ubNumTroops)) {
      ubNumTroops--;
      ubTotalSoldiers--;
      pSoldier = TacticalCreateArmyTroop();
      if (pGroup) {
        pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
      }

      pSoldier.value.ubInsertionDirection = bDesiredDirection;
      // Setup the position
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.value.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;
      }
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
    } else if (ubNumAdmins && Random(ubTotalSoldiers) < (ubNumElites + ubNumTroops + ubNumAdmins)) {
      ubNumAdmins--;
      ubTotalSoldiers--;
      pSoldier = TacticalCreateAdministrator();
      if (pGroup) {
        pSoldier.value.ubGroupID = pGroup.value.ubGroupID;
      }

      pSoldier.value.ubInsertionDirection = bDesiredDirection;
      // Setup the position
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.value.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;
      }
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
    }
  }
}

function SaveUnderGroundSectorInfoToSaveGame(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;
  let uiNumOfRecords: UINT32 = 0;
  let TempNode: Pointer<UNDERGROUND_SECTORINFO> = gpUndergroundSectorInfoHead;

  // Loop through all the nodes to count how many there are
  while (TempNode) {
    uiNumOfRecords++;
    TempNode = TempNode.value.next;
  }

  // Write how many nodes there are
  FileWrite(hFile, addressof(uiNumOfRecords), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  TempNode = gpUndergroundSectorInfoHead;

  // Go through each node and save it.
  while (TempNode) {
    FileWrite(hFile, TempNode, sizeof(UNDERGROUND_SECTORINFO), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(UNDERGROUND_SECTORINFO)) {
      return FALSE;
    }

    TempNode = TempNode.value.next;
  }

  return TRUE;
}

function LoadUnderGroundSectorInfoFromSavedGame(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let uiNumOfRecords: UINT32 = 0;
  let cnt: UINT32 = 0;
  let TempNode: Pointer<UNDERGROUND_SECTORINFO> = null;
  let TempSpot: Pointer<UNDERGROUND_SECTORINFO> = null;

  // Clear the current LL
  TrashUndergroundSectorInfo();

  // Read in the number of nodes stored
  FileRead(hFile, addressof(uiNumOfRecords), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return FALSE;
  }

  for (cnt = 0; cnt < uiNumOfRecords; cnt++) {
    // Malloc space for the new node
    TempNode = MemAlloc(sizeof(UNDERGROUND_SECTORINFO));
    if (TempNode == null)
      return FALSE;

    // read in the new node
    FileRead(hFile, TempNode, sizeof(UNDERGROUND_SECTORINFO), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(UNDERGROUND_SECTORINFO)) {
      return FALSE;
    }

    // If its the first time in, assign the node to the list
    if (cnt == 0) {
      gpUndergroundSectorInfoHead = TempNode;
      TempSpot = gpUndergroundSectorInfoHead;
      TempSpot.value.next = null;
    } else {
      // assign the new node to the LL
      TempSpot.value.next = TempNode;

      // advance to the next node
      TempSpot = TempSpot.value.next;
      TempSpot.value.next = null;
      gpUndergroundSectorInfoTail = TempSpot;
    }
  }

  return TRUE;
}

function FindUnderGroundSector(sMapX: INT16, sMapY: INT16, bMapZ: UINT8): Pointer<UNDERGROUND_SECTORINFO> {
  let pUnderground: Pointer<UNDERGROUND_SECTORINFO>;
  pUnderground = gpUndergroundSectorInfoHead;

  // Loop through all the underground sectors looking for specified sector
  while (pUnderground) {
    // If the sector is the right one
    if (pUnderground.value.ubSectorX == sMapX && pUnderground.value.ubSectorY == sMapY && pUnderground.value.ubSectorZ == bMapZ) {
      return pUnderground;
    }
    pUnderground = pUnderground.value.next;
  }

  return null;
}

function BeginCaptureSquence(): void {
  if (!(gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE) || !(gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE)) {
    gStrategicStatus.ubNumCapturedForRescue = 0;
  }
}

function EndCaptureSequence(): void {
  // Set flag...
  if (!(gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE) || !(gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE)) {
    // CJC Dec 1 2002: fixing multiple captures:
    // gStrategicStatus.uiFlags |= STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE;

    if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED) {
      // CJC Dec 1 2002: fixing multiple captures:
      gStrategicStatus.uiFlags |= STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE;
      StartQuest(Enum169.QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY);
    }
    // CJC Dec 1 2002: fixing multiple captures:
    // else if ( gubQuest[ QUEST_HELD_IN_ALMA ] == QUESTDONE )
    else if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTDONE && gubQuest[Enum169.QUEST_INTERROGATION] == QUESTNOTSTARTED) {
      StartQuest(Enum169.QUEST_INTERROGATION, gWorldSectorX, gWorldSectorY);
      // CJC Dec 1 2002: fixing multiple captures:
      gStrategicStatus.uiFlags |= STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE;

      // OK! - Schedule Meanwhile now!
      {
        let MeanwhileDef: MEANWHILE_DEFINITION;

        MeanwhileDef.sSectorX = 7;
        MeanwhileDef.sSectorY = 14;
        MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
        MeanwhileDef.usTriggerEvent = 0;
        MeanwhileDef.ubMeanwhileID = Enum160.INTERROGATION;

        ScheduleMeanwhileEvent(addressof(MeanwhileDef), 10);
      }
    }
    // CJC Dec 1 2002: fixing multiple captures
    else {
      // !?!? set both flags
      gStrategicStatus.uiFlags |= STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE;
      gStrategicStatus.uiFlags |= STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE;
    }
  }
}

function EnemyCapturesPlayerSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  let i: INT32;
  let WorldItem: WORLDITEM;
  let fMadeCorpse: BOOLEAN;
  let iNumEnemiesInSector: INT32;

  /* static */ let sAlmaCaptureGridNos: INT16[] /* [] */ = [
    9208,
    9688,
    9215,
  ];
  /* static */ let sAlmaCaptureItemsGridNo: INT16[] /* [] */ = [
    12246,
    12406,
    13046,
  ];

  /* static */ let sInterrogationItemGridNo: INT16[] /* [] */ = [
    12089,
    12089,
    12089,
  ];

  // ATE: Check first if ! in player captured sequence already
  // CJC Dec 1 2002: fixing multiple captures
  if ((gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE) && (gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE)) {
    return;
  }

  // ATE: If maximum prisoners captured, return!
  if (gStrategicStatus.ubNumCapturedForRescue > 3) {
    return;
  }

  // If this is an EPC , just kill them...
  if (AM_AN_EPC(pSoldier)) {
    pSoldier.value.bLife = 0;
    HandleSoldierDeath(pSoldier, addressof(fMadeCorpse));
    return;
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  // ATE: Patch fix If in a vehicle, remove from vehicle...
  TakeSoldierOutOfVehicle(pSoldier);

  // Are there anemies in ALMA? ( I13 )
  iNumEnemiesInSector = NumEnemiesInSector(13, 9);

  // IF there are no enemies, and we need to do alma, skip!
  if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED && iNumEnemiesInSector == 0) {
    InternalStartQuest(Enum169.QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY, FALSE);
    InternalEndQuest(Enum169.QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY, FALSE);
  }

  HandleMoraleEvent(pSoldier, Enum234.MORALE_MERC_CAPTURED, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);

  // Change to POW....
  //-add him to a POW assignment/group
  if ((pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW)) {
    SetTimeOfAssignmentChangeForMerc(pSoldier);
  }

  ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_POW);
  // ATE: Make them neutral!
  if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED) {
    pSoldier.value.bNeutral = TRUE;
  }

  RemoveCharacterFromSquads(pSoldier);

  // Is this the first one..?
  if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED) {
    //-teleport him to NE Alma sector (not Tixa as originally planned)
    pSoldier.value.sSectorX = 13;
    pSoldier.value.sSectorY = 9;
    pSoldier.value.bSectorZ = 0;

    // put him on the floor!!
    pSoldier.value.bLevel = 0;

    // OK, drop all items!
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      if (pSoldier.value.inv[i].usItem != 0) {
        WorldItem.fExists = TRUE;
        WorldItem.sGridNo = sAlmaCaptureItemsGridNo[gStrategicStatus.ubNumCapturedForRescue];
        WorldItem.ubLevel = 0;
        WorldItem.usFlags = 0;
        WorldItem.bVisible = FALSE;
        WorldItem.bRenderZHeightAboveLevel = 0;

        memcpy(addressof(WorldItem.o), addressof(pSoldier.value.inv[i]), sizeof(OBJECTTYPE));

        AddWorldItemsToUnLoadedSector(13, 9, 0, sAlmaCaptureItemsGridNo[gStrategicStatus.ubNumCapturedForRescue], 1, addressof(WorldItem), FALSE);
        DeleteObj(addressof(pSoldier.value.inv[i]));
      }
    }

    pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.value.usStrategicInsertionData = sAlmaCaptureGridNos[gStrategicStatus.ubNumCapturedForRescue];

    gStrategicStatus.ubNumCapturedForRescue++;
  } else if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTDONE) {
    //-teleport him to N7
    pSoldier.value.sSectorX = 7;
    pSoldier.value.sSectorY = 14;
    pSoldier.value.bSectorZ = 0;

    // put him on the floor!!
    pSoldier.value.bLevel = 0;

    // OK, drop all items!
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      if (pSoldier.value.inv[i].usItem != 0) {
        WorldItem.fExists = TRUE;
        WorldItem.sGridNo = sInterrogationItemGridNo[gStrategicStatus.ubNumCapturedForRescue];
        WorldItem.ubLevel = 0;
        WorldItem.usFlags = 0;
        WorldItem.bVisible = FALSE;
        WorldItem.bRenderZHeightAboveLevel = 0;

        memcpy(addressof(WorldItem.o), addressof(pSoldier.value.inv[i]), sizeof(OBJECTTYPE));

        AddWorldItemsToUnLoadedSector(7, 14, 0, sInterrogationItemGridNo[gStrategicStatus.ubNumCapturedForRescue], 1, addressof(WorldItem), FALSE);
        DeleteObj(addressof(pSoldier.value.inv[i]));
      }
    }

    pSoldier.value.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.value.usStrategicInsertionData = gsInterrogationGridNo[gStrategicStatus.ubNumCapturedForRescue];

    gStrategicStatus.ubNumCapturedForRescue++;
  }

  // Bandaging him would prevent him from dying (due to low HP)
  pSoldier.value.bBleeding = 0;

  // wake him up
  if (pSoldier.value.fMercAsleep) {
    PutMercInAwakeState(pSoldier);
    pSoldier.value.fForcedToStayAwake = FALSE;
  }

  // Set his life to 50% + or - 10 HP.
  pSoldier.value.bLife = pSoldier.value.bLifeMax / 2;
  if (pSoldier.value.bLife <= 35) {
    pSoldier.value.bLife = 35;
  } else if (pSoldier.value.bLife >= 45) {
    pSoldier.value.bLife += (10 - Random(21));
  }

  // make him quite exhausted when found
  pSoldier.value.bBreath = pSoldier.value.bBreathMax = 50;
  pSoldier.value.sBreathRed = 0;
  pSoldier.value.fMercCollapsedFlag = FALSE;
}

function HandleEnemyStatusInCurrentMapBeforeLoadingNewMap(): void {
  let i: INT32;
  let fMadeCorpse: BOOLEAN;
  let bKilledEnemies: INT8 = 0;
  let bKilledCreatures: INT8 = 0;
  let bKilledRebels: INT8 = 0;
  let bKilledCivilians: INT8 = 0;
  return;
  // If any of the soldiers are dying, kill them now.
  for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife < OKLIFE && MercPtrs[i].value.bLife) {
      MercPtrs[i].value.bLife = 0;
      HandleSoldierDeath(MercPtrs[i], addressof(fMadeCorpse));
      bKilledEnemies++;
    }
  }
  // Do the same for the creatures.
  for (i = gTacticalStatus.Team[CREATURE_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife < OKLIFE && MercPtrs[i].value.bLife) {
      MercPtrs[i].value.bLife = 0;
      HandleSoldierDeath(MercPtrs[i], addressof(fMadeCorpse));
      bKilledCreatures++;
    }
  }
  // Militia
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife < OKLIFE && MercPtrs[i].value.bLife) {
      MercPtrs[i].value.bLife = 0;
      HandleSoldierDeath(MercPtrs[i], addressof(fMadeCorpse));
      bKilledRebels++;
    }
  }
  // Civilians
  for (i = gTacticalStatus.Team[CIV_TEAM].bFirstID; i <= gTacticalStatus.Team[CIV_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive && MercPtrs[i].value.bLife < OKLIFE && MercPtrs[i].value.bLife) {
      MercPtrs[i].value.bLife = 0;
      HandleSoldierDeath(MercPtrs[i], addressof(fMadeCorpse));
      bKilledCivilians++;
    }
  }

  // TEST MESSAGES ONLY!
  if (bKilledCivilians)
    ScreenMsg(FONT_BLUE, MSG_TESTVERSION, "%d civilians died after you left the sector.", bKilledCivilians);
  if (bKilledRebels)
    ScreenMsg(FONT_BLUE, MSG_TESTVERSION, "%d militia died after you left the sector.", bKilledRebels);
  if (bKilledEnemies)
    ScreenMsg(FONT_BLUE, MSG_TESTVERSION, "%d enemies died after you left the sector.", bKilledEnemies);
  if (bKilledCreatures)
    ScreenMsg(FONT_BLUE, MSG_TESTVERSION, "%d creatures died after you left the sector.", bKilledCreatures);

  if (!gbWorldSectorZ) {
    let pSector: Pointer<SECTORINFO>;
    pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
    pSector.value.ubAdminsInBattle = 0;
    pSector.value.ubTroopsInBattle = 0;
    pSector.value.ubElitesInBattle = 0;
    pSector.value.ubCreaturesInBattle = 0;
    // RecalculateSectorWeight(
  } else if (gbWorldSectorZ > 0) {
    let pSector: Pointer<UNDERGROUND_SECTORINFO>;
    pSector = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    if (!pSector)
      return;
    pSector.value.ubAdminsInBattle = 0;
    pSector.value.ubTroopsInBattle = 0;
    pSector.value.ubElitesInBattle = 0;
    pSector.value.ubCreaturesInBattle = 0;
  }
}

function PlayerSectorDefended(ubSectorID: UINT8): BOOLEAN {
  let pSector: Pointer<SECTORINFO>;
  pSector = addressof(SectorInfo[ubSectorID]);
  if (pSector.value.ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + pSector.value.ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + pSector.value.ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA]) {
    // militia in sector
    return TRUE;
  }
  if (FindMovementGroupInSector(SECTORX(ubSectorID), SECTORY(ubSectorID), TRUE)) {
    // player in sector
    return TRUE;
  }
  return FALSE;
}

// Assumes gTacticalStatus.fEnemyInSector
function OnlyHostileCivsInSector(): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let i: INT32;
  let fHostileCivs: BOOLEAN = FALSE;

  // Look for any hostile civs.
  for (i = gTacticalStatus.Team[CIV_TEAM].bFirstID; i <= gTacticalStatus.Team[CIV_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      if (!pSoldier.value.bNeutral) {
        fHostileCivs = TRUE;
        break;
      }
    }
  }
  if (!fHostileCivs) {
    // No hostile civs, so return FALSE
    return FALSE;
  }
  // Look for anybody else hostile.  If found, return FALSE immediately.
  for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      if (!pSoldier.value.bNeutral) {
        return FALSE;
      }
    }
  }
  for (i = gTacticalStatus.Team[CREATURE_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      if (!pSoldier.value.bNeutral) {
        return FALSE;
      }
    }
  }
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      if (!pSoldier.value.bNeutral) {
        return FALSE;
      }
    }
  }
  // We only have hostile civilians, don't allow time compression.
  return TRUE;
}
