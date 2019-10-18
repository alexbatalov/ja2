// build main facilities strings for sector
void GetSectorFacilitiesFlags(INT16 sMapX, INT16 sMapY, STR16 sFacilitiesString);

// set sector as enemy controlled
BOOLEAN SetThisSectorAsEnemyControlled(INT16 sMapX, INT16 sMapY, INT8 bMapZ, BOOLEAN fContested);

// set sector as player controlled
BOOLEAN SetThisSectorAsPlayerControlled(INT16 sMapX, INT16 sMapY, INT8 bMapZ, BOOLEAN fContested);

/*
// is this sector under player control
BOOLEAN IsTheSectorPerceivedToBeUnderEnemyControl( INT16 sMapX, INT16 sMapY, INT8 bMapZ );

// make player's perceived control over the sector reflect reality
void MakePlayerPerceptionOfSectorControlCorrect( INT16 sMapX, INT16 sMapY, INT8 bMapZ );
*/

void ReplaceSoldierProfileInPlayerGroup(UINT8 ubGroupID, UINT8 ubOldProfile, UINT8 ubNewProfile);
