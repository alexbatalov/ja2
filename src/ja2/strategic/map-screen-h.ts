const MAP_WORLD_X = 18;
const MAP_WORLD_Y = 18;

// Sector name identifiers
const enum Enum135 {
  BLANK_SECTOR = 0,
  OMERTA,
  DRASSEN,
  ALMA,
  GRUMM,
  TIXA,
  CAMBRIA,
  SAN_MONA,
  ESTONI,
  ORTA,
  BALIME,
  MEDUNA,
  CHITZENA,
  NUM_TOWNS,
}

const FIRST_TOWN = OMERTA;
//#define PALACE			NUM_TOWNS

extern BOOLEAN fCharacterInfoPanelDirty;
extern BOOLEAN fTeamPanelDirty;
extern BOOLEAN fMapPanelDirty;

extern BOOLEAN fMapInventoryItem;
extern BOOLEAN gfInConfirmMapMoveMode;
extern BOOLEAN gfInChangeArrivalSectorMode;

extern BOOLEAN gfSkyriderEmptyHelpGiven;
