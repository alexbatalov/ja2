const SMALLBRUSH = 0;
const MEDIUMBRUSH = 1;
const LARGEBRUSH = 2;

const NO_BANKS = 0;
const DRAW_BANKS = 1;
const DRAW_BANK_WATER = 2;
const DRAW_ERASE = 3;

const NO_CLIFFS = 0;
const DRAW_CLIFFS = 1;
const DRAW_CLIFF_LAND = 2;

BOOLEAN gfWarning;

BOOLEAN gfDoFill;
UINT16 CurrentPaste;
UINT16 gDebrisPaste;
UINT16 gChangeElevation;
UINT16 CurrentStruct;
UINT32 gDoBanks;
UINT32 gDoCliffs;
