let gpUndergroundSectorInfoTail: Pointer<UNDERGROUND_SECTORINFO> = NULL;

function NewUndergroundNode(ubSectorX: UINT8, ubSectorY: UINT8, ubSectorZ: UINT8): Pointer<UNDERGROUND_SECTORINFO> {
  let curr: Pointer<UNDERGROUND_SECTORINFO>;
  curr = MemAlloc(sizeof(UNDERGROUND_SECTORINFO));
  AssertMsg(curr, "Failed to create an underground sector info node.");
  memset(curr, 0, sizeof(UNDERGROUND_SECTORINFO));

  curr.value.ubSectorX = ubSectorX;
  curr.value.ubSectorY = ubSectorY;
  curr.value.ubSectorZ = ubSectorZ;

  if (gpUndergroundSectorInfoTail) {
    gpUndergroundSectorInfoTail.value.next = curr;
    gpUndergroundSectorInfoTail = gpUndergroundSectorInfoTail.value.next;
  } else {
    gpUndergroundSectorInfoHead = curr;
    gpUndergroundSectorInfoTail = gpUndergroundSectorInfoHead;
  }
  return curr;
}

// setup which know facilities are in which cities
function InitKnowFacilitiesFlags(): void {
  let pSector: Pointer<SECTORINFO>;

  // Cambria hospital
  pSector = addressof(SectorInfo[SEC_G8]);
  pSector.value.uiFacilitiesFlags |= SFCF_HOSPITAL;
  pSector = addressof(SectorInfo[SEC_F8]);
  pSector.value.uiFacilitiesFlags |= SFCF_HOSPITAL;
  pSector = addressof(SectorInfo[SEC_G9]);
  pSector.value.uiFacilitiesFlags |= SFCF_HOSPITAL;
  pSector = addressof(SectorInfo[SEC_F9]);
  pSector.value.uiFacilitiesFlags |= SFCF_HOSPITAL;

  // Drassen airport
  pSector = addressof(SectorInfo[SEC_B13]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;
  pSector = addressof(SectorInfo[SEC_C13]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;
  pSector = addressof(SectorInfo[SEC_D13]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;

  // Meduna airport & military complex
  pSector = addressof(SectorInfo[SEC_N3]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;
  pSector = addressof(SectorInfo[SEC_N4]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;
  pSector = addressof(SectorInfo[SEC_N5]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;
  pSector = addressof(SectorInfo[SEC_O3]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;
  pSector = addressof(SectorInfo[SEC_O4]);
  pSector.value.uiFacilitiesFlags |= SFCF_AIRPORT;

  return;
}

function InitMiningLocations(): void {
  let pSector: Pointer<SECTORINFO>;
  // Set up mining sites

  pSector = addressof(SectorInfo[SEC_D4]);
  pSector.value.uiFlags |= SF_MINING_SITE;
  //	pSector->ubIncomeValue = 33;

  pSector = addressof(SectorInfo[SEC_D13]);
  pSector.value.uiFlags |= SF_MINING_SITE;
  //	pSector->ubIncomeValue = 41;

  pSector = addressof(SectorInfo[SEC_B2]);
  pSector.value.uiFlags |= SF_MINING_SITE;
  //	pSector->ubIncomeValue = 20;

  pSector = addressof(SectorInfo[SEC_H8]);
  pSector.value.uiFlags |= SF_MINING_SITE;
  //	pSector->ubIncomeValue = 64;

  pSector = addressof(SectorInfo[SEC_I14]);
  pSector.value.uiFlags |= SF_MINING_SITE;
  //	pSector->ubIncomeValue = 80;

  // Grumm
  pSector = addressof(SectorInfo[SEC_H3]);
  pSector.value.uiFlags |= SF_MINING_SITE;
  //	pSector->ubIncomeValue = 100;
}

// Mobile groups are handled separately from sectors, because they are on the move.
function GeneratePatrolGroups(): void {
  let pGroup: Pointer<GROUP>;
  let ubNumTroops: UINT8;
  ubNumTroops = (3 + gGameOptions.ubDifficultyLevel + Random(3));
  pGroup = CreateNewEnemyGroupDepartingFromSector(SEC_C7, 0, ubNumTroops, 0);
  pGroup.value.ubTransportationMask = CAR;
  AddWaypointToPGroup(pGroup, 8, 3); // C8
  AddWaypointToPGroup(pGroup, 7, 3); // C7

  ubNumTroops = (3 + gGameOptions.ubDifficultyLevel + Random(3));
  pGroup = CreateNewEnemyGroupDepartingFromSector(SEC_D9, 0, ubNumTroops, 0);
  AddWaypointToPGroup(pGroup, 9, 5); // E9
  AddWaypointToPGroup(pGroup, 9, 4); // D9
  pGroup.value.ubTransportationMask = TRUCK;

  ubNumTroops = (3 + gGameOptions.ubDifficultyLevel + Random(3));
  pGroup = CreateNewEnemyGroupDepartingFromSector(SEC_B9, 0, ubNumTroops, 0);
  AddWaypointToPGroup(pGroup, 12, 2); // B12
  AddWaypointToPGroup(pGroup, 9, 2); // B9
  pGroup.value.ubTransportationMask = FOOT;

  ubNumTroops = (3 + gGameOptions.ubDifficultyLevel + Random(3));
  pGroup = CreateNewEnemyGroupDepartingFromSector(SEC_A14, 0, ubNumTroops, 0);
  pGroup.value.ubMoveType = ENDTOEND_FORWARDS;
  AddWaypointToPGroup(pGroup, 13, 1); // A13
  AddWaypointToPGroup(pGroup, 15, 1); // A15
  AddWaypointToPGroup(pGroup, 15, 5); // E15
  AddWaypointToPGroup(pGroup, 13, 5); // E13
  AddWaypointToPGroup(pGroup, 12, 5); // E12
  AddWaypointToPGroup(pGroup, 12, 3); // C12
  pGroup.value.ubTransportationMask = TRACKED;

  ubNumTroops = (5 + gGameOptions.ubDifficultyLevel * 2 + Random(4));
  pGroup = CreateNewEnemyGroupDepartingFromSector(SEC_N6, 0, ubNumTroops, 0);
  AddWaypointToPGroup(pGroup, 9, 14); // N9
  AddWaypointToPGroup(pGroup, 6, 14); // N6
  pGroup.value.ubTransportationMask = CAR;

  ubNumTroops = (5 + gGameOptions.ubDifficultyLevel * 2 + Random(4));
  pGroup = CreateNewEnemyGroupDepartingFromSector(SEC_N10, 0, ubNumTroops, 0);
  AddWaypointToPGroup(pGroup, 10, 11); // K10
  AddWaypointToPGroup(pGroup, 10, 14); // N10
  pGroup.value.ubTransportationMask = CAR;
}

function TrashUndergroundSectorInfo(): void {
  let curr: Pointer<UNDERGROUND_SECTORINFO>;
  while (gpUndergroundSectorInfoHead) {
    curr = gpUndergroundSectorInfoHead;
    gpUndergroundSectorInfoHead = gpUndergroundSectorInfoHead.value.next;
    MemFree(curr);
  }
  gpUndergroundSectorInfoHead = NULL;
  gpUndergroundSectorInfoTail = NULL;
}

// Defines the sectors that can be occupied by enemies, creatures, etc.  It also
// contains the network of cave connections critical for strategic creature spreading, as we can't
// know how the levels connect without loading the maps.  This is completely hardcoded, and any
// changes to the maps, require changes accordingly.
function BuildUndergroundSectorInfoList(): void {
  let curr: Pointer<UNDERGROUND_SECTORINFO>;
  let pSector: Pointer<SECTORINFO> = NULL;

  TrashUndergroundSectorInfo();

  //********************
  //* BASEMENT LEVEL 1 *
  //********************

  // Miguel's basement.  Nothing here.
  curr = NewUndergroundNode(10, 1, 1);

  // Chitzena mine.  Nothing here.
  curr = NewUndergroundNode(2, 2, 1);

  // San mona mine.  Nothing here.
  curr = NewUndergroundNode(4, 4, 1);
  curr = NewUndergroundNode(5, 4, 1);

  // J9
  curr = NewUndergroundNode(9, 10, 1);
  switch (gGameOptions.ubDifficultyLevel) {
    case DIF_LEVEL_EASY:
      curr.value.ubNumTroops = 8;
      break;
    case DIF_LEVEL_MEDIUM:
      curr.value.ubNumTroops = 11;
      break;
    case DIF_LEVEL_HARD:
      curr.value.ubNumTroops = 15;
      break;
  }
  // J9 feeding zone
  curr = NewUndergroundNode(9, 10, 2);
  curr.value.ubNumCreatures = (2 + gGameOptions.ubDifficultyLevel * 2 + Random(2));

  // K4
  curr = NewUndergroundNode(4, 11, 1);
  curr.value.ubNumTroops = (6 + gGameOptions.ubDifficultyLevel * 2 + Random(3));
  curr.value.ubNumElites = (4 + gGameOptions.ubDifficultyLevel + Random(2));

  // O3
  curr = NewUndergroundNode(3, 15, 1);
  curr.value.ubNumTroops = (6 + gGameOptions.ubDifficultyLevel * 2 + Random(3));
  curr.value.ubNumElites = (4 + gGameOptions.ubDifficultyLevel + Random(2));
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;

  // P3
  curr = NewUndergroundNode(3, 16, 1);
  switch (gGameOptions.ubDifficultyLevel) {
    case DIF_LEVEL_EASY:
      curr.value.ubNumElites = (8 + Random(3));
      break;
    case DIF_LEVEL_MEDIUM:
      curr.value.ubNumElites = (10 + Random(5));
      break;
    case DIF_LEVEL_HARD:
      curr.value.ubNumElites = (14 + Random(6));
      break;
  }
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;

  // Do all of the mandatory underground mine sectors

  // Drassen's mine
  // D13_B1
  curr = NewUndergroundNode(13, 4, 1);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
  // E13_B1
  curr = NewUndergroundNode(13, 5, 1);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // E13_B2
  curr = NewUndergroundNode(13, 5, 2);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
  // F13_B2
  curr = NewUndergroundNode(13, 6, 2);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR | SOUTH_ADJACENT_SECTOR;
  // G13_B2
  curr = NewUndergroundNode(13, 7, 2);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // G13_B3
  curr = NewUndergroundNode(13, 7, 3);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // F13_B3
  curr = NewUndergroundNode(13, 6, 3);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;

  // Cambria's mine
  // H8_B1
  curr = NewUndergroundNode(8, 8, 1);
  curr.value.ubAdjacentSectors |= EAST_ADJACENT_SECTOR;
  // H9_B1
  curr = NewUndergroundNode(9, 8, 1);
  curr.value.ubAdjacentSectors |= WEST_ADJACENT_SECTOR;
  // H9_B2
  curr = NewUndergroundNode(9, 8, 2);
  curr.value.ubAdjacentSectors |= WEST_ADJACENT_SECTOR;
  // H8_B2
  curr = NewUndergroundNode(8, 8, 2);
  curr.value.ubAdjacentSectors |= EAST_ADJACENT_SECTOR;
  // H8_B3
  curr = NewUndergroundNode(8, 8, 3);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
  // I8_B3
  curr = NewUndergroundNode(8, 9, 3);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR | SOUTH_ADJACENT_SECTOR;
  // J8_B3
  curr = NewUndergroundNode(8, 10, 3);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;

  // Alma's mine
  // I14_B1
  curr = NewUndergroundNode(14, 9, 1);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
  // J14_B1
  curr = NewUndergroundNode(14, 10, 1);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // J14_B2
  curr = NewUndergroundNode(14, 10, 2);
  curr.value.ubAdjacentSectors |= WEST_ADJACENT_SECTOR;
  // J13_B2
  curr = NewUndergroundNode(13, 10, 2);
  curr.value.ubAdjacentSectors |= EAST_ADJACENT_SECTOR;
  // J13_B3
  curr = NewUndergroundNode(13, 10, 3);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
  // K13_B3
  curr = NewUndergroundNode(13, 11, 3);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;

  // Grumm's mine
  // H3_B1
  curr = NewUndergroundNode(3, 8, 1);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
  // I3_B1
  curr = NewUndergroundNode(3, 9, 1);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // I3_B2
  curr = NewUndergroundNode(3, 9, 2);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // H3_B2
  curr = NewUndergroundNode(3, 8, 2);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR | EAST_ADJACENT_SECTOR;
  // H4_B2
  curr = NewUndergroundNode(4, 8, 2);
  curr.value.ubAdjacentSectors |= WEST_ADJACENT_SECTOR;
  curr.value.uiFlags |= SF_PENDING_ALTERNATE_MAP;
  // H4_B3
  curr = NewUndergroundNode(4, 8, 3);
  curr.value.ubAdjacentSectors |= NORTH_ADJACENT_SECTOR;
  // G4_B3
  curr = NewUndergroundNode(4, 7, 3);
  curr.value.ubAdjacentSectors |= SOUTH_ADJACENT_SECTOR;
}

// This is the function that is called only once, when the player begins a new game.  This will calculate
// starting numbers of the queen's army in various parts of the map, which will vary from campaign to campaign.
// This is also highly effected by the game's difficulty setting.
function InitNewCampaign(): void {
  // First clear all the sector information of all enemy existance.  Conveniently, the
  // ubGroupType is also cleared, which is perceived to be an empty group.
  memset(addressof(SectorInfo), 0, sizeof(SECTORINFO) * 256);
  InitStrategicMovementCosts();
  RemoveAllGroups();

  InitMiningLocations();
  InitKnowFacilitiesFlags();

  BuildUndergroundSectorInfoList();

  // allow overhead view of omerta A9 on game onset
  SetSectorFlag(9, 1, 0, SF_ALREADY_VISITED);

  // Generates the initial forces in a new campaign.  The idea is to randomize numbers and sectors
  // so that no two games are the same.
  InitStrategicAI();

  InitStrategicStatus();
}
