void EnterAutoResolveMode(UINT8 ubSectorX, UINT8 ubSectorY);

// is the autoresolve active?
BOOLEAN IsAutoResolveActive(void);

void EliminateAllEnemies(UINT8 ubSectorX, UINT8 ubSectorY);

void ConvertTacticalBattleIntoStrategicAutoResolveBattle();

UINT8 GetAutoResolveSectorID();

BOOLEAN gfTransferTacticalOppositionToAutoResolve;

// Returns TRUE if autoresolve is active or a sector is loaded.
BOOLEAN GetCurrentBattleSectorXYZ(INT16 *psSectorX, INT16 *psSectorY, INT16 *psSectorZ);