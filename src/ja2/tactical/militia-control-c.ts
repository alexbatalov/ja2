namespace ja2 {

export let gfStrategicMilitiaChangesMade: boolean = false;

export function ResetMilitia(): void {
  if (gfStrategicMilitiaChangesMade || gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    gfStrategicMilitiaChangesMade = false;
    RemoveMilitiaFromTactical();
    PrepareMilitiaForTactical();
  }
}

function RemoveMilitiaFromTactical(): void {
  let curr: SOLDIERINITNODE | null;
  let i: INT32;
  for (i = gTacticalStatus.Team[MILITIA_TEAM].bFirstID; i <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; i++) {
    if (MercPtrs[i].bActive) {
      TacticalRemoveSoldier(MercPtrs[i].ubID);
    }
  }
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.pBasicPlacement.bTeam == MILITIA_TEAM) {
      curr.pSoldier = null;
    }
    curr = curr.next;
  }
}

export function PrepareMilitiaForTactical(): void {
  let pSector: SECTORINFO;
  //	INT32 i;
  let ubGreen: UINT8;
  let ubRegs: UINT8;
  let ubElites: UINT8;
  if (gbWorldSectorZ > 0)
    return;

  // Do we have a loaded sector?
  if (gWorldSectorX == 0 && gWorldSectorY == 0)
    return;

  pSector = SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)];
  ubGreen = pSector.ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA];
  ubRegs = pSector.ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA];
  ubElites = pSector.ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA];
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

export function HandleMilitiaPromotions(): void {
  let cnt: UINT8;
  let ubMilitiaRank: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let ubPromotions: UINT8;

  gbGreenToElitePromotions = 0;
  gbGreenToRegPromotions = 0;
  gbRegToElitePromotions = 0;
  gbMilitiaPromotions = 0;

  cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive && pTeamSoldier.bInSector && pTeamSoldier.bLife > 0) {
      if (pTeamSoldier.ubMilitiaKills > 0) {
        ubMilitiaRank = SoldierClassToMilitiaRank(pTeamSoldier.ubSoldierClass);
        ubPromotions = CheckOneMilitiaForPromotion(gWorldSectorX, gWorldSectorY, ubMilitiaRank, pTeamSoldier.ubMilitiaKills);
        if (ubPromotions) {
          if (ubPromotions == 2) {
            gbGreenToElitePromotions++;
            gbMilitiaPromotions++;
          } else if (pTeamSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_GREEN_MILITIA) {
            gbGreenToRegPromotions++;
            gbMilitiaPromotions++;
          } else if (pTeamSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_REG_MILITIA) {
            gbRegToElitePromotions++;
            gbMilitiaPromotions++;
          }
        }

        pTeamSoldier.ubMilitiaKills = 0;
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

}
