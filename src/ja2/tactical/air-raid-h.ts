const AIR_RAID_BEGINNING_GAME = 0x00000001;
const AIR_RAID_CAN_RANDOMIZE_TEASE_DIVES = 0x00000002;

interface AIR_RAID_DEFINITION {
  sSectorX: INT16;
  sSectorY: INT16;
  sSectorZ: INT16;
  bIntensity: INT8;
  uiFlags: UINT32;
  ubNumMinsFromCurrentTime: UINT8;
  ubFiller: UINT8[] /* [8] */;
}

extern BOOLEAN gfInAirRaid;

// what ari raid mode are we in?
extern UINT8 gubAirRaidMode;

const enum Enum192 {
  AIR_RAID_TRYING_TO_START,
  AIR_RAID_START,
  AIR_RAID_LOOK_FOR_DIVE,
  AIR_RAID_BEGIN_DIVE,
  AIR_RAID_DIVING,
  AIR_RAID_END_DIVE,
  AIR_RAID_BEGIN_BOMBING,
  AIR_RAID_BOMBING,
  AIR_RAID_END_BOMBING,
  AIR_RAID_START_END,
  AIR_RAID_END,
}

void ScheduleAirRaid(AIR_RAID_DEFINITION *pAirRaidDef);
void HandleAirRaid();

BOOLEAN BeginAirRaid();
BOOLEAN InAirRaid();

BOOLEAN HandleAirRaidEndTurn();

// Save the air raid info to the saved game
BOOLEAN SaveAirRaidInfoToSaveGameFile(HWFILE hFile);

// load the air raid info from the saved game
BOOLEAN LoadAirRaidInfoFromSaveGameFile(HWFILE hFile);

void EndAirRaid();
