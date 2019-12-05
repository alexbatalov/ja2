namespace ja2 {

// Queen Command.c

// The sector information required for the strategic AI.  Contains the number of enemy troops,
// as well as intentions, etc.
export let SectorInfo: SECTORINFO[] /* [256] */ = createArrayFrom(256, createSectorInfo);
export let gpUndergroundSectorInfoHead: UNDERGROUND_SECTORINFO | null = null;
export let gfPendingEnemies: boolean = false;

export let gsInterrogationGridNo: INT16[] /* [3] */ = [
  7756,
  7757,
  7758,
];

function ValidateEnemiesHaveWeapons(): void {
}

// Counts enemies and crepitus, but not bloodcats.
export function NumHostilesInSector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): UINT8 {
  let ubNumHostiles: UINT8 = 0;

  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  Assert(sSectorZ >= 0 && sSectorZ <= 3);

  if (sSectorZ) {
    let pSector: UNDERGROUND_SECTORINFO | null;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, sSectorZ);
    if (pSector) {
      ubNumHostiles = (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites + pSector.ubNumCreatures);
    }
  } else {
    let pSector: SECTORINFO;
    let pGroup: GROUP | null;

    // Count stationary hostiles
    pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
    ubNumHostiles = (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites + pSector.ubNumCreatures);

    // Count mobile enemies
    pGroup = gpGroupList;
    while (pGroup) {
      if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == sSectorX && pGroup.ubSectorY == sSectorY) {
        ubNumHostiles += pGroup.ubGroupSize;
      }
      pGroup = pGroup.next;
    }
  }

  return ubNumHostiles;
}

export function NumEnemiesInAnySector(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16): UINT8 {
  let ubNumEnemies: UINT8 = 0;

  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  Assert(sSectorZ >= 0 && sSectorZ <= 3);

  if (sSectorZ) {
    let pSector: UNDERGROUND_SECTORINFO | null;
    pSector = FindUnderGroundSector(sSectorX, sSectorY, sSectorZ);
    if (pSector) {
      ubNumEnemies = (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites);
    }
  } else {
    let pSector: SECTORINFO;
    let pGroup: GROUP | null;

    // Count stationary enemies
    pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
    ubNumEnemies = (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites);

    // Count mobile enemies
    pGroup = gpGroupList;
    while (pGroup) {
      if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == sSectorX && pGroup.ubSectorY == sSectorY) {
        ubNumEnemies += pGroup.ubGroupSize;
      }
      pGroup = pGroup.next;
    }
  }

  return ubNumEnemies;
}

export function NumEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let pSector: SECTORINFO;
  let pGroup: GROUP | null;
  let ubNumTroops: UINT8;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
  ubNumTroops = (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites);

  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == sSectorX && pGroup.ubSectorY == sSectorY) {
      ubNumTroops += pGroup.ubGroupSize;
    }
    pGroup = pGroup.next;
  }
  return ubNumTroops;
}

export function NumStationaryEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let pSector: SECTORINFO;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];

  if (pSector.ubGarrisonID == NO_GARRISON) {
    // If no garrison, no stationary.
    return 0;
  }

  // don't count roadblocks as stationary garrison, we want to see how many enemies are in them, not question marks
  if (gGarrisonGroup[pSector.ubGarrisonID].ubComposition == Enum174.ROADBLOCK) {
    // pretend they're not stationary
    return 0;
  }

  return (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites);
}

export function NumMobileEnemiesInSector(sSectorX: INT16, sSectorY: INT16): UINT8 {
  let pGroup: GROUP | null;
  let pSector: SECTORINFO;
  let ubNumTroops: UINT8;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);

  ubNumTroops = 0;
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == sSectorX && pGroup.ubSectorY == sSectorY) {
      ubNumTroops += pGroup.ubGroupSize;
    }
    pGroup = pGroup.next;
  }

  pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
  if (pSector.ubGarrisonID == Enum174.ROADBLOCK) {
    // consider these troops as mobile troops even though they are in a garrison
    ubNumTroops += (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites);
  }

  return ubNumTroops;
}

function GetNumberOfMobileEnemiesInSector(sSectorX: INT16, sSectorY: INT16): { ubNumAdmins: UINT8, ubNumTroops: UINT8, ubNumElites: UINT8 } {
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;

  let pGroup: GROUP | null;
  let pSector: SECTORINFO;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);

  // Now count the number of mobile groups in the sector.
  ubNumTroops = ubNumElites = ubNumAdmins = 0;
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == sSectorX && pGroup.ubSectorY == sSectorY) {
      ubNumTroops += (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops;
      ubNumElites += (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites;
      ubNumAdmins += (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins;
    }
    pGroup = pGroup.next;
  }

  pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];
  if (pSector.ubGarrisonID == Enum174.ROADBLOCK) {
    // consider these troops as mobile troops even though they are in a garrison
    ubNumAdmins += pSector.ubNumAdmins;
    ubNumTroops += pSector.ubNumTroops;
    ubNumElites += pSector.ubNumElites;
  }

  return { ubNumAdmins, ubNumTroops, ubNumElites };
}

function GetNumberOfStationaryEnemiesInSector(sSectorX: INT16, sSectorY: INT16): { ubNumAdmins: UINT8, ubNumTroops: UINT8, ubNumElites: UINT8 } {
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;

  let pSector: SECTORINFO;
  Assert(sSectorX >= 1 && sSectorX <= 16);
  Assert(sSectorY >= 1 && sSectorY <= 16);
  pSector = SectorInfo[SECTOR(sSectorX, sSectorY)];

  // grab the number of each type in the stationary sector
  ubNumAdmins = pSector.ubNumAdmins;
  ubNumTroops = pSector.ubNumTroops;
  ubNumElites = pSector.ubNumElites;

  return { ubNumAdmins, ubNumTroops, ubNumElites };
}

export function GetNumberOfEnemiesInSector(sSectorX: INT16, sSectorY: INT16): { ubNumAdmins: UINT8, ubNumTroops: UINT8, ubNumElites: UINT8 } {
  let ubNumAdmins: UINT8;
  let ubNumTroops: UINT8;
  let ubNumElites: UINT8;

  let ubNumStationaryAdmins: UINT8;
  let ubNumStationaryTroops: UINT8;
  let ubNumStationaryElites: UINT8;

  let ubNumMobileAdmins: UINT8;
  let ubNumMobileTroops: UINT8;
  let ubNumMobileElites: UINT8;

  ({ ubNumAdmins: ubNumStationaryAdmins, ubNumTroops: ubNumStationaryTroops, ubNumElites: ubNumStationaryElites } = GetNumberOfStationaryEnemiesInSector(sSectorX, sSectorY));

  ({ ubNumAdmins: ubNumMobileAdmins, ubNumTroops: ubNumMobileTroops, ubNumElites: ubNumMobileElites } = GetNumberOfMobileEnemiesInSector(sSectorX, sSectorY));

  ubNumAdmins = ubNumStationaryAdmins + ubNumMobileAdmins;
  ubNumTroops = ubNumStationaryTroops + ubNumMobileTroops;
  ubNumElites = ubNumStationaryElites + ubNumMobileElites;

  return { ubNumAdmins, ubNumTroops, ubNumElites };
}

export function EndTacticalBattleForEnemy(): void {
  let pGroup: GROUP | null;
  let i: INT32;
  let iNumMilitia: INT32 = 0;
  let iNumEnemies: INT32 = 0;

  // Clear enemies in battle for all stationary groups in the sector.
  if (gbWorldSectorZ > 0) {
    let pSector: UNDERGROUND_SECTORINFO;
    pSector = <UNDERGROUND_SECTORINFO>FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    pSector.ubAdminsInBattle = 0;
    pSector.ubTroopsInBattle = 0;
    pSector.ubElitesInBattle = 0;
  } else if (!gbWorldSectorZ) {
    let pSector: SECTORINFO;
    pSector = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
    // grab the number of each type in the stationary sector
    pSector.ubAdminsInBattle = 0;
    pSector.ubTroopsInBattle = 0;
    pSector.ubElitesInBattle = 0;
    pSector.ubNumCreatures = 0;
    pSector.ubCreaturesInBattle = 0;
  } else // negative
    return;

  // Clear this value so that profiled enemies can be added into battles in the future.
  gfProfiledEnemyAdded = false;

  // Clear enemies in battle for all mobile groups in the sector.
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == gWorldSectorX && pGroup.ubSectorY == gWorldSectorY) {
      (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle = 0;
      (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle = 0;
      (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle = 0;
    }
    pGroup = pGroup.next;
  }

  // Check to see if any of our mercs have abandoned the militia during a battle.  This is cause for a rather
  // severe loyalty blow.
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    if (MercPtrs[i].bActive && MercPtrs[i].bInSector && MercPtrs[i].bLife >= OKLIFE) {
      // found one live militia, so look for any enemies/creatures.
      // NOTE: this is relying on ENEMY_TEAM being immediately followed by CREATURE_TEAM
      for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
        if (MercPtrs[i].bActive && MercPtrs[i].bInSector && MercPtrs[i].bLife >= OKLIFE) {
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
  let pSoldier: SOLDIERTYPE;
  // Count the number of free enemy slots.  It is possible to have multiple groups exceed the maximum.
  for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; i++) {
    pSoldier = Menptr[i];
    if (!pSoldier.bActive)
      ubNumFreeSlots++;
  }
  return ubNumFreeSlots;
}

// Called when entering a sector so the campaign AI can automatically insert the
// correct number of troops of each type based on the current number in the sector
// in global focus (gWorldSectorX/Y)
export function PrepareEnemyForSectorBattle(): boolean {
  let pSector: SECTORINFO;
  let pGroup: GROUP | null;
  let pSoldier: SOLDIERTYPE;
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

  gfPendingEnemies = false;

  if (gbWorldSectorZ > 0)
    return PrepareEnemyForUndergroundBattle();

  if (gpBattleGroup && !gpBattleGroup.fPlayer) {
    // The enemy has instigated the battle which means they are the ones entering the conflict.
    // The player was actually in the sector first, and the enemy doesn't use reinforced placements
    HandleArrivalOfReinforcements(gpBattleGroup);
    // It is possible that other enemy groups have also arrived.  Add them in the same manner.
    pGroup = gpGroupList;
    while (pGroup) {
      if (pGroup != gpBattleGroup && !pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == gpBattleGroup.ubSectorX && pGroup.ubSectorY == gpBattleGroup.ubSectorY && !(<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle && !(<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle && !(<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle) {
        HandleArrivalOfReinforcements(pGroup);
      }
      pGroup = pGroup.next;
    }
    ValidateEnemiesHaveWeapons();
    return (gpBattleGroup.ubGroupSize > 0);
  }

  if (!gbWorldSectorZ) {
    if (NumEnemiesInSector(gWorldSectorX, gWorldSectorY) > 32) {
      gfPendingEnemies = true;
    }
  }

  pSector = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
  if (pSector.uiFlags & SF_USE_MAP_SETTINGS) {
    // count the number of enemy placements in a map and use those
    let curr: SOLDIERINITNODE | null;
    curr = gSoldierInitHead;
    ubTotalAdmins = ubTotalTroops = ubTotalElites = 0;
    while (curr) {
      if (curr.pBasicPlacement.bTeam == ENEMY_TEAM) {
        switch (curr.pBasicPlacement.ubSoldierClass) {
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
      curr = curr.next;
    }
    pSector.ubNumAdmins = ubTotalAdmins;
    pSector.ubNumTroops = ubTotalTroops;
    pSector.ubNumElites = ubTotalElites;
    pSector.ubAdminsInBattle = 0;
    pSector.ubTroopsInBattle = 0;
    pSector.ubElitesInBattle = 0;
  } else {
    ubTotalAdmins = (pSector.ubNumAdmins - pSector.ubAdminsInBattle);
    ubTotalTroops = (pSector.ubNumTroops - pSector.ubTroopsInBattle);
    ubTotalElites = (pSector.ubNumElites - pSector.ubElitesInBattle);
  }
  ubStationaryEnemies = (ubTotalAdmins + ubTotalTroops + ubTotalElites);

  if (ubTotalAdmins + ubTotalTroops + ubTotalElites > 32) {
    ubTotalAdmins = Math.min(32, ubTotalAdmins);
    ubTotalTroops = Math.min(32 - ubTotalAdmins, ubTotalTroops);
    ubTotalElites = Math.min(32 - ubTotalAdmins + ubTotalTroops, ubTotalElites);
  }

  pSector.ubAdminsInBattle += ubTotalAdmins;
  pSector.ubTroopsInBattle += ubTotalTroops;
  pSector.ubElitesInBattle += ubTotalElites;

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
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == gWorldSectorX && pGroup.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // Process enemy group in sector.
      if (sNumSlots > 0) {
        ubNumAdmins = ((<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins - (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle);
        sNumSlots -= ubNumAdmins;
        if (sNumSlots < 0) {
          // adjust the value to zero
          ubNumAdmins += sNumSlots;
          sNumSlots = 0;
          gfPendingEnemies = true;
        }
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle += ubNumAdmins;
        ubTotalAdmins += ubNumAdmins;
      }
      if (sNumSlots > 0) {
        // Add regular army forces.
        ubNumTroops = ((<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops - (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle);
        sNumSlots -= ubNumTroops;
        if (sNumSlots < 0) {
          // adjust the value to zero
          ubNumTroops += sNumSlots;
          sNumSlots = 0;
          gfPendingEnemies = true;
        }
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle += ubNumTroops;
        ubTotalTroops += ubNumTroops;
      }
      if (sNumSlots > 0) {
        // Add elite troops
        ubNumElites = ((<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites - (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle);
        sNumSlots -= ubNumElites;
        if (sNumSlots < 0) {
          // adjust the value to zero
          ubNumElites += sNumSlots;
          sNumSlots = 0;
          gfPendingEnemies = true;
        }
        (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle += ubNumElites;
        ubTotalElites += ubNumElites;
      }
      // NOTE:
      // no provisions for profile troop leader or retreat groups yet.
    }
    if (pGroup.fPlayer && !pGroup.fVehicle && !pGroup.fBetweenSectors && pGroup.ubSectorX == gWorldSectorX && pGroup.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // TEMP:  The player path needs to get destroyed, otherwise, it'll be impossible to move the
      //			 group after the battle is resolved.

      // no one in the group any more continue loop
      if (pGroup.pPlayerList == null) {
        pGroup = pGroup.next;
        continue;
      }

      // clear the movt for this grunt and his buddies
      RemoveGroupWaypoints(pGroup.ubGroupID);
    }
    pGroup = pGroup.next;
  }

  // if there are no troops in the current groups, then we're done.
  if (!ubTotalAdmins && !ubTotalTroops && !ubTotalElites) {
    return false;
  }

  AddSoldierInitListEnemyDefenceSoldiers(ubTotalAdmins, ubTotalTroops, ubTotalElites);

  // Now, we have to go through all of the enemies in the new map, and assign their respective groups if
  // in a mobile group, but only for the ones that were assigned from the
  sNumSlots = 32 - ubStationaryEnemies;

  pGroup = gpGroupList;
  while (pGroup && sNumSlots) {
    i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;
    pSoldier = Menptr[i];
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == gWorldSectorX && pGroup.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      num = pGroup.ubGroupSize;
      ubNumAdmins = (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle;
      ubNumTroops = (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle;
      ubNumElites = (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle;
      while (num && sNumSlots && i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID) {
        while (!pSoldier.bActive || pSoldier.ubGroupID) {
          pSoldier = Menptr[++i];
          if (i > gTacticalStatus.Team[ENEMY_TEAM].bLastID) {
            AssertMsg(0, "Failed to assign battle counters for enemies properly. Please send save. KM:0.");
          }
        }
        switch (pSoldier.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            if (ubNumAdmins) {
              num--;
              sNumSlots--;
              ubNumAdmins--;
              pSoldier.ubGroupID = pGroup.ubGroupID;
            }
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            if (ubNumTroops) {
              num--;
              sNumSlots--;
              ubNumTroops--;
              pSoldier.ubGroupID = pGroup.ubGroupID;
            }
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            if (ubNumElites) {
              num--;
              sNumSlots--;
              ubNumElites--;
              pSoldier.ubGroupID = pGroup.ubGroupID;
            }
            break;
        }
        pSoldier = Menptr[++i];
      }
    }
    pGroup = pGroup.next;
  }

  ValidateEnemiesHaveWeapons();

  return true;
}

function PrepareEnemyForUndergroundBattle(): boolean {
  let pUnderground: UNDERGROUND_SECTORINFO | null;
  let ubTotalAdmins: UINT8;
  let ubTotalTroops: UINT8;
  let ubTotalElites: UINT8;
  pUnderground = gpUndergroundSectorInfoHead;
  while (pUnderground) {
    if (pUnderground.ubSectorX == gWorldSectorX && pUnderground.ubSectorY == gWorldSectorY && pUnderground.ubSectorZ == gbWorldSectorZ) {
      // This is the sector we are going to be fighting in.
      if (pUnderground.ubNumAdmins || pUnderground.ubNumTroops || pUnderground.ubNumElites) {
        ubTotalAdmins = (pUnderground.ubNumAdmins - pUnderground.ubAdminsInBattle);
        ubTotalTroops = (pUnderground.ubNumTroops - pUnderground.ubTroopsInBattle);
        ubTotalElites = (pUnderground.ubNumElites - pUnderground.ubElitesInBattle);
        pUnderground.ubAdminsInBattle += ubTotalAdmins;
        pUnderground.ubTroopsInBattle += ubTotalTroops;
        pUnderground.ubElitesInBattle += ubTotalElites;
        AddSoldierInitListEnemyDefenceSoldiers(pUnderground.ubNumAdmins, pUnderground.ubNumTroops, pUnderground.ubNumElites);
        ValidateEnemiesHaveWeapons();
      }
      return (pUnderground.ubNumAdmins + pUnderground.ubNumTroops + pUnderground.ubNumElites > 0);
    }
    pUnderground = pUnderground.next;
  }

  // underground sector not found in list
  Assert(false);
  return false;
}

// The queen AI layer must process the event by subtracting forces, etc.
export function ProcessQueenCmdImplicationsOfDeath(pSoldier: SOLDIERTYPE): void {
  let iNumEnemiesInSector: INT32;
  let pSector: SECTORINFO;
  let str: string /* UINT16[128] */;
  EvaluateDeathEffectsToSoldierInitList(pSoldier);

  switch (pSoldier.ubProfile) {
    case Enum268.MIKE:
    case Enum268.IGGY:
      if (pSoldier.ubProfile == Enum268.IGGY && !gubFact[Enum170.FACT_IGGY_AVAILABLE_TO_ARMY]) {
        // Iggy is on our team!
        break;
      }
      if (!pSoldier.bSectorZ) {
        pSector = SectorInfo[SECTOR(pSoldier.sSectorX, pSoldier.sSectorY)];
        if (pSector.ubNumElites) {
          pSector.ubNumElites--;
        }
        if (pSector.ubElitesInBattle) {
          pSector.ubElitesInBattle--;
        }
      } else {
        let pUnderground: UNDERGROUND_SECTORINFO | null;
        pUnderground = FindUnderGroundSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);
        Assert(pUnderground);
        if (pUnderground.ubNumElites) {
          pUnderground.ubNumElites--;
        }
        if (pUnderground.ubElitesInBattle) {
          pUnderground.ubElitesInBattle--;
        }
      }
      break;
  }

  if (pSoldier.bNeutral || pSoldier.bTeam != ENEMY_TEAM && pSoldier.bTeam != CREATURE_TEAM)
    return;
  // we are recording an enemy death
  if (pSoldier.ubGroupID) {
    // The enemy was in a mobile group
    let pGroup: GROUP;
    pGroup = GetGroup(pSoldier.ubGroupID);
    if (!pGroup) {
      return;
    }
    if (pGroup.fPlayer) {
      return;
    }
    switch (pSoldier.ubSoldierClass) {
      case Enum262.SOLDIER_CLASS_ELITE:
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites--;
        }
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle--;
        }
        break;
      case Enum262.SOLDIER_CLASS_ARMY:
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops--;
        }
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle--;
        }
        break;
      case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins--;
        }
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle) {
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle--;
        }
        break;
    }
    if (pGroup.ubGroupSize)
      pGroup.ubGroupSize--;
    RecalculateGroupWeight(pGroup);
    if (!pGroup.ubGroupSize) {
      RemovePGroup(pGroup);
    }
  } else {
    // The enemy was in a stationary defence group
    if (!gbWorldSectorZ || IsAutoResolveActive()) {
      // ground level (SECTORINFO)
      let pSector: SECTORINFO;

      if (!IsAutoResolveActive()) {
        pSector = SectorInfo[SECTOR(pSoldier.sSectorX, pSoldier.sSectorY)];
      } else {
        pSector = SectorInfo[GetAutoResolveSectorID()];
      }

      switch (pSoldier.ubSoldierClass) {
        case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
          if (pSector.ubNumAdmins) {
            pSector.ubNumAdmins--;
          }
          if (pSector.ubAdminsInBattle) {
            pSector.ubAdminsInBattle--;
          }
          break;
        case Enum262.SOLDIER_CLASS_ARMY:
          if (pSector.ubNumTroops) {
            pSector.ubNumTroops--;
          }
          if (pSector.ubTroopsInBattle) {
            pSector.ubTroopsInBattle--;
          }
          break;
        case Enum262.SOLDIER_CLASS_ELITE:
          if (pSector.ubNumElites) {
            pSector.ubNumElites--;
          }
          if (pSector.ubElitesInBattle) {
            pSector.ubElitesInBattle--;
          }
          break;
        case Enum262.SOLDIER_CLASS_CREATURE:
          if (pSoldier.ubBodyType != Enum194.BLOODCAT) {
            if (pSector.ubNumCreatures) {
              pSector.ubNumCreatures--;
            }
            if (pSector.ubCreaturesInBattle) {
              pSector.ubCreaturesInBattle--;
            }
          } else {
            if (pSector.bBloodCats) {
              pSector.bBloodCats--;
            }
          }

          break;
      }
      RecalculateSectorWeight(SECTOR(pSoldier.sSectorX, pSoldier.sSectorY));
    } else {
      // basement level (UNDERGROUND_SECTORINFO)
      let pSector: UNDERGROUND_SECTORINFO | null = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      if (pSector) {
        switch (pSoldier.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            if (pSector.ubNumAdmins) {
              pSector.ubNumAdmins--;
            }
            if (pSector.ubAdminsInBattle) {
              pSector.ubAdminsInBattle--;
            }
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            if (pSector.ubNumTroops) {
              pSector.ubNumTroops--;
            }
            if (pSector.ubTroopsInBattle) {
              pSector.ubTroopsInBattle--;
            }
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            if (pSector.ubNumElites) {
              pSector.ubNumElites--;
            }
            if (pSector.ubElitesInBattle) {
              pSector.ubElitesInBattle--;
            }
            break;
          case Enum262.SOLDIER_CLASS_CREATURE:
            if (pSector.ubNumCreatures) {
              pSector.ubNumCreatures--;
            }
            if (pSector.ubCreaturesInBattle) {
              pSector.ubCreaturesInBattle--;
            }

            if (!pSector.ubNumCreatures && gWorldSectorX != 9 && gWorldSectorY != 10) {
              // If the player has successfully killed all creatures in ANY underground sector except J9
              // then cancel any pending creature town attack.
              DeleteAllStrategicEventsOfType(Enum132.EVENT_CREATURE_ATTACK);
            }

            // a monster has died.  Post an event to immediately check whether a mine has been cleared.
            AddStrategicEventUsingSeconds(Enum132.EVENT_CHECK_IF_MINE_CLEARED, GetWorldTotalSeconds() + 15, 0);

            if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
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
  if (!pSoldier.bSectorZ) {
    pSector = SectorInfo[SECTOR(pSoldier.sSectorX, pSoldier.sSectorY)];
    iNumEnemiesInSector = NumEnemiesInSector(pSoldier.sSectorX, pSoldier.sSectorY);
    if (iNumEnemiesInSector) {
      if (pSector.bLastKnownEnemies >= 0) {
        pSector.bLastKnownEnemies = iNumEnemiesInSector;
      }
    } else {
      pSector.bLastKnownEnemies = 0;
    }
  }
}

// Rarely, there will be more enemies than supported by the engine.  In this case, these
// soldier's are waiting for a slot to be free so that they can enter the battle.  This
// essentially allows for an infinite number of troops, though only 32 at a time can fight.
// This is also called whenever an enemy group's reinforcements arrive because the code is
// identical, though it is highly likely that they will all be successfully added on the first call.
export function AddPossiblePendingEnemiesToBattle(): void {
  let ubSlots: UINT8;
  let ubNumAvailable: UINT8;
  let ubNumElites: UINT8;
  let ubNumTroops: UINT8;
  let ubNumAdmins: UINT8;
  let pGroup: GROUP | null;
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
    if (!pGroup.fPlayer && !pGroup.fVehicle && pGroup.ubSectorX == gWorldSectorX && pGroup.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
      // This enemy group is currently in the sector.
      ubNumElites = ubNumTroops = ubNumAdmins = 0;
      ubNumAvailable = pGroup.ubGroupSize - (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle - (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle - (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle;
      while (ubNumAvailable && ubSlots) {
        // This group has enemies waiting for a chance to enter the battle.
        if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle < (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumTroops) {
          // Add a regular troop.
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubTroopsInBattle++;
          ubNumAvailable--;
          ubSlots--;
          ubNumTroops++;
        } else if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle < (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumElites) {
          // Add an elite troop
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubElitesInBattle++;
          ubNumAvailable--;
          ubSlots--;
          ubNumElites++;
        } else if ((<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle < (<ENEMYGROUP>pGroup.pEnemyGroup).ubNumAdmins) {
          // Add an elite troop
          (<ENEMYGROUP>pGroup.pEnemyGroup).ubAdminsInBattle++;
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
        if (pGroup.ubPrevX && pGroup.ubPrevY) {
          if (pGroup.ubSectorX < pGroup.ubPrevX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
          else if (pGroup.ubSectorX > pGroup.ubPrevX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
          else if (pGroup.ubSectorY < pGroup.ubPrevY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
          else if (pGroup.ubSectorY > pGroup.ubPrevY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
        } else if (pGroup.ubNextX && pGroup.ubNextY) {
          if (pGroup.ubSectorX < pGroup.ubNextX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_EAST;
          else if (pGroup.ubSectorX > pGroup.ubNextX)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_WEST;
          else if (pGroup.ubSectorY < pGroup.ubNextY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_SOUTH;
          else if (pGroup.ubSectorY > pGroup.ubNextY)
            ubStrategicInsertionCode = Enum175.INSERTION_CODE_NORTH;
        }
        // Add the number of each type of troop and place them in the appropriate positions
        AddEnemiesToBattle(pGroup, ubStrategicInsertionCode, ubNumAdmins, ubNumTroops, ubNumElites, false);
      }
    }
    pGroup = pGroup.next;
  }
  if (ubSlots) {
    // After going through the process, we have finished with some free slots and no more enemies to add.
    // So, we can turn off the flag, as this check is no longer needed.
    gfPendingEnemies = false;
  }
}

function NotifyPlayersOfNewEnemies(): void {
  let iSoldiers: INT32;
  let iChosenSoldier: INT32;
  let i: INT32;
  let pSoldier: SOLDIERTYPE;
  let fIgnoreBreath: boolean = false;

  iSoldiers = 0;
  for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
    // find a merc that is aware.
    pSoldier = MercPtrs[i];
    if (pSoldier.bInSector && pSoldier.bActive && pSoldier.bLife >= OKLIFE && pSoldier.bBreath >= OKBREATH) {
      iSoldiers++;
    }
  }
  if (!iSoldiers) {
    // look for an out of breath merc.
    fIgnoreBreath = true;

    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      // find a merc that is aware.
      pSoldier = MercPtrs[i];
      if (pSoldier.bInSector && pSoldier.bActive && pSoldier.bLife >= OKLIFE) {
        iSoldiers++;
      }
    }
  }
  if (iSoldiers) {
    iChosenSoldier = Random(iSoldiers);
    for (i = gTacticalStatus.Team[OUR_TEAM].bFirstID; i <= gTacticalStatus.Team[OUR_TEAM].bLastID; i++) {
      // find a merc that is aware.
      pSoldier = MercPtrs[i];
      if (pSoldier.bInSector && pSoldier.bActive && pSoldier.bLife >= OKLIFE && ((pSoldier.bBreath >= OKBREATH) || fIgnoreBreath)) {
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

function AddEnemiesToBattle(pGroup: GROUP, ubStrategicInsertionCode: UINT8, ubNumAdmins: UINT8, ubNumTroops: UINT8, ubNumElites: UINT8, fMagicallyAppeared: boolean): void {
  let pSoldier: SOLDIERTYPE | null;
  let MapEdgepointInfo: MAPEDGEPOINTINFO = createMapEdgePointInfo();
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
      let pSector: SECTORINFO = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
      pSector.ubNumAdmins += ubNumAdmins;
      pSector.ubAdminsInBattle += ubNumAdmins;
      pSector.ubNumTroops += ubNumTroops;
      pSector.ubTroopsInBattle += ubNumTroops;
      pSector.ubNumElites += ubNumElites;
      pSector.ubElitesInBattle += ubNumElites;
    } else {
      let pSector: UNDERGROUND_SECTORINFO | null = FindUnderGroundSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      if (pSector) {
        pSector.ubNumAdmins += ubNumAdmins;
        pSector.ubAdminsInBattle += ubNumAdmins;
        pSector.ubNumTroops += ubNumTroops;
        pSector.ubTroopsInBattle += ubNumTroops;
        pSector.ubNumElites += ubNumElites;
        pSector.ubElitesInBattle += ubNumElites;
      }
    }
    // Because the enemies magically appeared, have one of our soldiers say something...
    NotifyPlayersOfNewEnemies();
  }

  ubTotalSoldiers = ubNumAdmins + ubNumTroops + ubNumElites;

  ChooseMapEdgepoints(MapEdgepointInfo, ubStrategicInsertionCode, (ubNumAdmins + ubNumElites + ubNumTroops));
  ubCurrSlot = 0;
  while (ubTotalSoldiers) {
    if (ubNumElites && Random(ubTotalSoldiers) < ubNumElites) {
      ubNumElites--;
      ubTotalSoldiers--;
      pSoldier = TacticalCreateEliteEnemy();
      Assert(pSoldier);
      if (pGroup) {
        pSoldier.ubGroupID = pGroup.ubGroupID;
      }

      pSoldier.ubInsertionDirection = bDesiredDirection;
      // Setup the position
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;
      }
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
    } else if (ubNumTroops && Random(ubTotalSoldiers) < (ubNumElites + ubNumTroops)) {
      ubNumTroops--;
      ubTotalSoldiers--;
      pSoldier = TacticalCreateArmyTroop();
      Assert(pSoldier);
      if (pGroup) {
        pSoldier.ubGroupID = pGroup.ubGroupID;
      }

      pSoldier.ubInsertionDirection = bDesiredDirection;
      // Setup the position
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;
      }
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
    } else if (ubNumAdmins && Random(ubTotalSoldiers) < (ubNumElites + ubNumTroops + ubNumAdmins)) {
      ubNumAdmins--;
      ubTotalSoldiers--;
      pSoldier = TacticalCreateAdministrator();
      Assert(pSoldier);
      if (pGroup) {
        pSoldier.ubGroupID = pGroup.ubGroupID;
      }

      pSoldier.ubInsertionDirection = bDesiredDirection;
      // Setup the position
      if (ubCurrSlot < MapEdgepointInfo.ubNumPoints) {
        // using an edgepoint
        pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
        pSoldier.usStrategicInsertionData = MapEdgepointInfo.sGridNo[ubCurrSlot++];
      } else {
        // no edgepoints left, so put him at the entrypoint.
        pSoldier.ubStrategicInsertionCode = ubStrategicInsertionCode;
      }
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, 0);
    }
  }
}

export function SaveUnderGroundSectorInfoToSaveGame(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let uiNumOfRecords: UINT32 = 0;
  let TempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;
  let buffer: Buffer;

  // Loop through all the nodes to count how many there are
  while (TempNode) {
    uiNumOfRecords++;
    TempNode = TempNode.next;
  }

  // Write how many nodes there are
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumOfRecords, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  TempNode = gpUndergroundSectorInfoHead;

  // Go through each node and save it.
  buffer = Buffer.allocUnsafe(UNDERGROUND_SECTOR_INFO_SIZE);
  while (TempNode) {
    writeUndergroundSectorInfo(TempNode, buffer);
    uiNumBytesWritten = FileWrite(hFile, buffer, UNDERGROUND_SECTOR_INFO_SIZE);
    if (uiNumBytesWritten != UNDERGROUND_SECTOR_INFO_SIZE) {
      return false;
    }

    TempNode = TempNode.next;
  }

  return true;
}

export function LoadUnderGroundSectorInfoFromSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let uiNumOfRecords: UINT32 = 0;
  let cnt: UINT32 = 0;
  let TempNode: UNDERGROUND_SECTORINFO | null = null;
  let TempSpot: UNDERGROUND_SECTORINFO | null = null;
  let buffer: Buffer;

  // Clear the current LL
  TrashUndergroundSectorInfo();

  // Read in the number of nodes stored
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }

  uiNumOfRecords = buffer.readUInt32LE(0);

  buffer = Buffer.allocUnsafe(UNDERGROUND_SECTOR_INFO_SIZE);
  for (cnt = 0; cnt < uiNumOfRecords; cnt++) {
    // Malloc space for the new node
    TempNode = createUndergroundSectorInfo()

    // read in the new node
    uiNumBytesRead = FileRead(hFile, buffer, UNDERGROUND_SECTOR_INFO_SIZE);
    if (uiNumBytesRead != UNDERGROUND_SECTOR_INFO_SIZE) {
      return false;
    }

    readUndergroundSectorInfo(TempNode, buffer);

    // If its the first time in, assign the node to the list
    if (TempSpot == null) {
      gpUndergroundSectorInfoHead = TempNode;
      TempSpot = gpUndergroundSectorInfoHead;
      TempSpot.next = null;
    } else {
      // assign the new node to the LL
      TempSpot.next = TempNode;

      // advance to the next node
      TempSpot = TempSpot.next;
      TempSpot.next = null;
      gpUndergroundSectorInfoTail = TempSpot;
    }
  }

  return true;
}

export function FindUnderGroundSector(sMapX: INT16, sMapY: INT16, bMapZ: UINT8): UNDERGROUND_SECTORINFO | null {
  let pUnderground: UNDERGROUND_SECTORINFO | null;
  pUnderground = gpUndergroundSectorInfoHead;

  // Loop through all the underground sectors looking for specified sector
  while (pUnderground) {
    // If the sector is the right one
    if (pUnderground.ubSectorX == sMapX && pUnderground.ubSectorY == sMapY && pUnderground.ubSectorZ == bMapZ) {
      return pUnderground;
    }
    pUnderground = pUnderground.next;
  }

  return null;
}

export function BeginCaptureSquence(): void {
  if (!(gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE) || !(gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE)) {
    gStrategicStatus.ubNumCapturedForRescue = 0;
  }
}

export function EndCaptureSequence(): void {
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
        let MeanwhileDef: MEANWHILE_DEFINITION = createMeanwhileDefinition();

        MeanwhileDef.sSectorX = 7;
        MeanwhileDef.sSectorY = 14;
        MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
        MeanwhileDef.usTriggerEvent = 0;
        MeanwhileDef.ubMeanwhileID = Enum160.INTERROGATION;

        ScheduleMeanwhileEvent(MeanwhileDef, 10);
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

/* static */ let EnemyCapturesPlayerSoldier__sAlmaCaptureGridNos: INT16[] /* [] */ = [
  9208,
  9688,
  9215,
];
/* static */ let EnemyCapturesPlayerSoldier__sAlmaCaptureItemsGridNo: INT16[] /* [] */ = [
  12246,
  12406,
  13046,
];

/* static */ let EnemyCapturesPlayerSoldier__sInterrogationItemGridNo: INT16[] /* [] */ = [
  12089,
  12089,
  12089,
];
export function EnemyCapturesPlayerSoldier(pSoldier: SOLDIERTYPE): void {
  let i: INT32;
  let WorldItem: WORLDITEM = createWorldItem();
  let fMadeCorpse: boolean = false;
  let iNumEnemiesInSector: INT32;

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
    pSoldier.bLife = 0;
    HandleSoldierDeath(pSoldier, createPointer(() => fMadeCorpse, (v) => fMadeCorpse = v));
    return;
  }

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    return;
  }

  // ATE: Patch fix If in a vehicle, remove from vehicle...
  TakeSoldierOutOfVehicle(pSoldier);

  // Are there anemies in ALMA? ( I13 )
  iNumEnemiesInSector = NumEnemiesInSector(13, 9);

  // IF there are no enemies, and we need to do alma, skip!
  if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED && iNumEnemiesInSector == 0) {
    InternalStartQuest(Enum169.QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY, false);
    InternalEndQuest(Enum169.QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY, false);
  }

  HandleMoraleEvent(pSoldier, Enum234.MORALE_MERC_CAPTURED, pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ);

  // Change to POW....
  //-add him to a POW assignment/group
  if ((pSoldier.bAssignment != Enum117.ASSIGNMENT_POW)) {
    SetTimeOfAssignmentChangeForMerc(pSoldier);
  }

  ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_POW);
  // ATE: Make them neutral!
  if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED) {
    pSoldier.bNeutral = true;
  }

  RemoveCharacterFromSquads(pSoldier);

  // Is this the first one..?
  if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED) {
    //-teleport him to NE Alma sector (not Tixa as originally planned)
    pSoldier.sSectorX = 13;
    pSoldier.sSectorY = 9;
    pSoldier.bSectorZ = 0;

    // put him on the floor!!
    pSoldier.bLevel = 0;

    // OK, drop all items!
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      if (pSoldier.inv[i].usItem != 0) {
        WorldItem.fExists = true;
        WorldItem.sGridNo = EnemyCapturesPlayerSoldier__sAlmaCaptureItemsGridNo[gStrategicStatus.ubNumCapturedForRescue];
        WorldItem.ubLevel = 0;
        WorldItem.usFlags = 0;
        WorldItem.bVisible = 0;
        WorldItem.bRenderZHeightAboveLevel = 0;

        copyObjectType(WorldItem.o, pSoldier.inv[i]);

        AddWorldItemsToUnLoadedSector(13, 9, 0, EnemyCapturesPlayerSoldier__sAlmaCaptureItemsGridNo[gStrategicStatus.ubNumCapturedForRescue], 1, [WorldItem], false);
        DeleteObj(pSoldier.inv[i]);
      }
    }

    pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.usStrategicInsertionData = EnemyCapturesPlayerSoldier__sAlmaCaptureGridNos[gStrategicStatus.ubNumCapturedForRescue];

    gStrategicStatus.ubNumCapturedForRescue++;
  } else if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTDONE) {
    //-teleport him to N7
    pSoldier.sSectorX = 7;
    pSoldier.sSectorY = 14;
    pSoldier.bSectorZ = 0;

    // put him on the floor!!
    pSoldier.bLevel = 0;

    // OK, drop all items!
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      if (pSoldier.inv[i].usItem != 0) {
        WorldItem.fExists = true;
        WorldItem.sGridNo = EnemyCapturesPlayerSoldier__sInterrogationItemGridNo[gStrategicStatus.ubNumCapturedForRescue];
        WorldItem.ubLevel = 0;
        WorldItem.usFlags = 0;
        WorldItem.bVisible = 0;
        WorldItem.bRenderZHeightAboveLevel = 0;

        copyObjectType(WorldItem.o, pSoldier.inv[i]);

        AddWorldItemsToUnLoadedSector(7, 14, 0, EnemyCapturesPlayerSoldier__sInterrogationItemGridNo[gStrategicStatus.ubNumCapturedForRescue], 1, [WorldItem], false);
        DeleteObj(pSoldier.inv[i]);
      }
    }

    pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.usStrategicInsertionData = gsInterrogationGridNo[gStrategicStatus.ubNumCapturedForRescue];

    gStrategicStatus.ubNumCapturedForRescue++;
  }

  // Bandaging him would prevent him from dying (due to low HP)
  pSoldier.bBleeding = 0;

  // wake him up
  if (pSoldier.fMercAsleep) {
    PutMercInAwakeState(pSoldier);
    pSoldier.fForcedToStayAwake = false;
  }

  // Set his life to 50% + or - 10 HP.
  pSoldier.bLife = pSoldier.bLifeMax / 2;
  if (pSoldier.bLife <= 35) {
    pSoldier.bLife = 35;
  } else if (pSoldier.bLife >= 45) {
    pSoldier.bLife += (10 - Random(21));
  }

  // make him quite exhausted when found
  pSoldier.bBreath = pSoldier.bBreathMax = 50;
  pSoldier.sBreathRed = 0;
  pSoldier.fMercCollapsedFlag = false;
}

export function PlayerSectorDefended(ubSectorID: UINT8): boolean {
  let pSector: SECTORINFO;
  pSector = SectorInfo[ubSectorID];
  if (pSector.ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + pSector.ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + pSector.ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA]) {
    // militia in sector
    return true;
  }
  if (FindMovementGroupInSector(SECTORX(ubSectorID), SECTORY(ubSectorID), true)) {
    // player in sector
    return true;
  }
  return false;
}

// Assumes gTacticalStatus.fEnemyInSector
export function OnlyHostileCivsInSector(): boolean {
  let pSoldier: SOLDIERTYPE;
  let i: INT32;
  let fHostileCivs: boolean = false;

  // Look for any hostile civs.
  for (i = gTacticalStatus.Team[CIV_TEAM].bFirstID; i <= gTacticalStatus.Team[CIV_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife) {
      if (!pSoldier.bNeutral) {
        fHostileCivs = true;
        break;
      }
    }
  }
  if (!fHostileCivs) {
    // No hostile civs, so return FALSE
    return false;
  }
  // Look for anybody else hostile.  If found, return FALSE immediately.
  for (i = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; i <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife) {
      if (!pSoldier.bNeutral) {
        return false;
      }
    }
  }
  for (i = gTacticalStatus.Team[CREATURE_TEAM].bFirstID; i <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife) {
      if (!pSoldier.bNeutral) {
        return false;
      }
    }
  }
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    pSoldier = MercPtrs[i];
    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife) {
      if (!pSoldier.bNeutral) {
        return false;
      }
    }
  }
  // We only have hostile civilians, don't allow time compression.
  return true;
}

}
