// MACROS
const RPC_RECRUITED = (p) => ((p->ubProfile == NO_PROFILE) ? FALSE : (gMercProfiles[p->ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED));

const AM_AN_EPC = (p) => ((p->ubProfile == NO_PROFILE) ? FALSE : (gMercProfiles[p->ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_EPCACTIVE));

const AM_A_ROBOT = (p) => ((p->ubProfile == NO_PROFILE) ? FALSE : (gMercProfiles[p->ubProfile].ubBodyType == ROBOTNOWEAPON));

const OK_ENEMY_MERC = (p) => (!p->bNeutral && (p->bSide != gbPlayerNum) && p->bLife >= OKLIFE);

// Checks if our guy can be controllable .... checks bInSector, team, on duty, etc...
const OK_CONTROLLABLE_MERC = (p) => (p->bLife >= OKLIFE && p->bActive && p->bInSector && p->bTeam == gbPlayerNum && p->bAssignment < ON_DUTY);

// Checks if our guy can be controllable .... checks bInSector, team, on duty, etc...
const OK_INSECTOR_MERC = (p) => (p->bLife >= OKLIFE && p->bActive && p->bInSector && p->bTeam == gbPlayerNum && p->bAssignment < ON_DUTY);

// Checkf if our guy can be selected and is not in a position where our team has an interupt and he does not have one...
const OK_INTERRUPT_MERC = (p) => ((INTERRUPT_QUEUED != 0) ? ((p->bMoved) ? FALSE : TRUE) : TRUE);

const CREATURE_OR_BLOODCAT = (p) => ((p->uiStatusFlags & SOLDIER_MONSTER) || p->ubBodyType == BLOODCAT);

const TANK = (p) => (p->ubBodyType == TANK_NE || p->ubBodyType == TANK_NW);

const OK_ENTERABLE_VEHICLE = (p) => ((p->uiStatusFlags & SOLDIER_VEHICLE) && !TANK(p) && p->bLife >= OKLIFE);
