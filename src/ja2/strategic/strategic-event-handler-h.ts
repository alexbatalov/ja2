const KINGPIN_MONEY_SECTOR_X = 5;
const KINGPIN_MONEY_SECTOR_Y = MAP_ROW_D;
const KINGPIN_MONEY_SECTOR_Z = 1;

const HOSPITAL_SECTOR_X = 8;
const HOSPITAL_SECTOR_Y = MAP_ROW_F;
const HOSPITAL_SECTOR_Z = 0;

extern UINT8 gubCambriaMedicalObjects;

void CheckForKingpinsMoneyMissing(BOOLEAN fFirstCheck);
void CheckForMissingHospitalSupplies(void);

void BobbyRayPurchaseEventCallback(UINT8 ubOrderID);

void HandleStolenItemsReturned(void);

void AddSecondAirportAttendant(void);

void SetPabloToUnbribed(void);
void HandleNPCSystemEvent(UINT32 uiEvent);
void HandleEarlyMorningEvents(void);

void MakeCivGroupHostileOnNextSectorEntrance(UINT8 ubCivGroup);

void RemoveAssassin(UINT8 ubProfile);
