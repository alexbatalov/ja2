const GLOBAL_SUMMARY_VERSION = 14;
const MINIMUMVERSION = 7;

interface TEAMSUMMARY {
  ubTotal: UINT8;
  ubDetailed: UINT8;
  ubProfile: UINT8;
  ubExistance: UINT8;
  ubNumAnimals: UINT8;

  // attributes
  ubBadA: UINT8;
  ubPoorA: UINT8;
  ubAvgA: UINT8;
  ubGoodA: UINT8;
  ubGreatA: UINT8;

  // equipment
  ubBadE: UINT8;
  ubPoorE: UINT8;
  ubAvgE: UINT8;
  ubGoodE: UINT8;
  ubGreatE: UINT8;
} // 15 bytes

interface SUMMARYFILE {
  // start version 1
  ubSummaryVersion: UINT8;
  ubSpecial: UINT8;
  usNumItems: UINT16;
  usNumLights: UINT16;
  MapInfo: MAPCREATE_STRUCT;
  EnemyTeam: TEAMSUMMARY;
  CreatureTeam: TEAMSUMMARY;
  RebelTeam: TEAMSUMMARY;
  CivTeam: TEAMSUMMARY;
  ubNumDoors: UINT8;
  ubNumDoorsLocked: UINT8;
  ubNumDoorsTrapped: UINT8;
  ubNumDoorsLockedAndTrapped: UINT8;
  // start version 2
  ubTilesetID: UINT8;
  ubNumRooms: UINT8;
  // start version	3
  ubNumElites: UINT8;
  ubNumAdmins: UINT8;
  ubNumTroops: UINT8;
  // start version 4
  ubEliteDetailed: UINT8;
  ubAdminDetailed: UINT8;
  ubTroopDetailed: UINT8;
  // start version 5
  ubEliteProfile: UINT8;
  ubAdminProfile: UINT8;
  ubTroopProfile: UINT8;
  // start version 6
  ubEliteExistance: UINT8;
  ubAdminExistance: UINT8;
  ubTroopExistance: UINT8;
  // start version 7
  dMajorMapVersion: FLOAT;
  // start version 8
  ubCivSchedules: UINT8;
  // start version 9
  ubCivCows: UINT8;
  ubCivBloodcats: UINT8;
  //																//-----
  //	190
  // start version 10
  ExitGrid: EXITGRID[] /* [4] */; // 5*4 //	 20
  usExitGridSize: UINT16[] /* [4] */; // 2*4 //    8
  fInvalidDest: BOOLEAN[] /* [4] */; //    4
  ubNumExitGridDests: UINT8; //		1
  fTooManyExitGridDests: BOOLEAN; //		1
  //																//-----
  //																//	224
  // start version 11
  ubEnemiesReqWaypoints: UINT8; //		1
  //																//-----
  //																		225
  // start version 12
  usWarningRoomNums: UINT16; //    2
                             //	227
  // start version 13
  ubEnemiesHaveWaypoints: UINT8; //		1
  uiNumItemsPosition: UINT32; //		4
                              //-----
                              //	232
  // start version 14
  uiEnemyPlacementPosition: UINT32; //		4
                                    //-----
                                    //	236
  ubPadding: UINT8[] /* [164] */; //	164
}

extern BOOLEAN gfAutoLoadA9;

extern BOOLEAN EvaluateWorld(UINT8 *pSector, UINT8 ubLevel);
extern void WriteSectorSummaryUpdate(UINT8 *puiFilename, UINT8 ubLevel, SUMMARYFILE *pSummaryFileInfo);

extern BOOLEAN gfMustForceUpdateAllMaps;
extern BOOLEAN gfMajorUpdate;
void ApologizeOverrideAndForceUpdateEverything();
