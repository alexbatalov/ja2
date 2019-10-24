let gfStrategicMilitiaChangesMade: BOOLEAN = FALSE;

function ResetMilitia(): void {
  if (gfStrategicMilitiaChangesMade || gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    gfStrategicMilitiaChangesMade = FALSE;
    RemoveMilitiaFromTactical();
    PrepareMilitiaForTactical();
  }
}

function RemoveMilitiaFromTactical(): void {
  let curr: Pointer<SOLDIERINITNODE>;
  let i: INT32;
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    if (MercPtrs[i].value.bActive) {
      TacticalRemoveSoldier(MercPtrs[i].value.ubID);
    }
  }
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pBasicPlacement.value.bTeam == MILITIA_TEAM) {
      curr.value.pSoldier = NULL;
    }
    curr = curr.value.next;
  }
}

function PrepareMilitiaForTactical(): void {
  let pSector: Pointer<SECTORINFO>;
  //	INT32 i;
  let ubGreen: UINT8;
  let ubRegs: UINT8;
  let ubElites: UINT8;
  if (gbWorldSectorZ > 0)
    return;

  // Do we have a loaded sector?
  if (gWorldSectorX == 0 && gWorldSectorY == 0)
    return;

  pSector = addressof(SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)]);
  ubGreen = pSector.value.ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
  ubRegs = pSector.value.ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
  ubElites = pSector.value.ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];
  AddSoldierInitListMilitia(ubGreen, ubRegs, ubElites);
  /*
  for( i = gTacticalStatus.Team[ MILITIA_TEAM ].bFirstID; i <= gTacticalStatus.Team[ MILITIA_TEAM ].bLastID; i++ )
  {
          if( MercPtrs[ i ]->bInSector )
          {
                  MercPtrs[ i ]->bAttitude = AGGRESSIVE;
          }
  }
  */
}

function HandleMilitiaPromotions(): void {
  let cnt: UINT8;
  let ubMilitiaRank: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let ubPromotions: UINT8;

  gbGreenToElitePromotions = 0;
  gbGreenToRegPromotions = 0;
  gbRegToElitePromotions = 0;
  gbMilitiaPromotions = 0;

  cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bLife > 0) {
      if (pTeamSoldier.value.ubMilitiaKills > 0) {
        ubMilitiaRank = SoldierClassToMilitiaRank(pTeamSoldier.value.ubSoldierClass);
        ubPromotions = CheckOneMilitiaForPromotion(gWorldSectorX, gWorldSectorY, ubMilitiaRank, pTeamSoldier.value.ubMilitiaKills);
        if (ubPromotions) {
          if (ubPromotions == 2) {
            gbGreenToElitePromotions++;
            gbMilitiaPromotions++;
          } else if (pTeamSoldier.value.ubSoldierClass == Enum262.SOLDIER_CLASS_GREEN_MILITIA) {
            gbGreenToRegPromotions++;
            gbMilitiaPromotions++;
          } else if (pTeamSoldier.value.ubSoldierClass == Enum262.SOLDIER_CLASS_REG_MILITIA) {
            gbRegToElitePromotions++;
            gbMilitiaPromotions++;
          }
        }

        pTeamSoldier.value.ubMilitiaKills = 0;
      }
    }
  }
  if (gbMilitiaPromotions) {
    // ATE: Problems here with bringing up message box...

    // UINT16 str[ 512 ];
    // BuildMilitiaPromotionsString( str );
    // DoScreenIndependantMessageBox( str, MSG_BOX_FLAG_OK, NULL );
  }
}
