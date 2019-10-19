//
// Used with the HireMerc function
//
const MERC_HIRE_OVER_20_MERCS_HIRED = -1;
const MERC_HIRE_FAILED = 0;
const MERC_HIRE_OK = 1;

const MERC_ARRIVE_TIME_SLOT_1 = (7 * 60 + 30); // 7:30 a.m.
const MERC_ARRIVE_TIME_SLOT_2 = (13 * 60 + 30); // 1:30 pm
const MERC_ARRIVE_TIME_SLOT_3 = (19 * 60 + 30); // 7:30 pm

// ATE: This define has been moved to be a function so that
// we pick the most appropriate time of day to use...
//#define		MERC_ARRIVAL_TIME_OF_DAY				 (7 * 60 + 30)		// 7:30 am

interface MERC_HIRE_STRUCT {
  ubProfileID: UINT8;
  sSectorX: INT16;
  sSectorY: INT16;
  bSectorZ: INT8;
  iTotalContractLength: INT16;
  fCopyProfileItemsOver: BOOLEAN;
  uiTimeTillMercArrives: UINT32;
  ubInsertionCode: UINT8;
  usInsertionData: UINT16;
  fUseLandingZoneForArrival: BOOLEAN;
}

// ATE: Globals that dictate where the mercs will land once being hired
extern INT16 gsMercArriveSectorX;
extern INT16 gsMercArriveSectorY;

INT8 HireMerc(MERC_HIRE_STRUCT *pHireMerc);
void MercArrivesCallback(UINT8 ubSoldierID);
BOOLEAN IsMercHireable(UINT8 ubMercID);
BOOLEAN IsMercDead(UINT8 ubMercID);
UINT8 NumberOfMercsOnPlayerTeam();
BOOLEAN IsTheSoldierAliveAndConcious(SOLDIERTYPE *pSoldier);
void HandleMercArrivesQuotes(SOLDIERTYPE *pSoldier);
void UpdateAnyInTransitMercsWithGlobalArrivalSector();

UINT32 GetMercArrivalTimeOfDay();
