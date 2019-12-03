namespace ja2 {

// MACROS
export const RPC_RECRUITED = (p: SOLDIERTYPE) => ((p.ubProfile == NO_PROFILE) ? false : (gMercProfiles[p.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED));

export const AM_AN_EPC = (p: SOLDIERTYPE) => ((p.ubProfile == NO_PROFILE) ? false : (gMercProfiles[p.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_EPCACTIVE));

export const AM_A_ROBOT = (p: SOLDIERTYPE) => ((p.ubProfile == NO_PROFILE) ? false : (gMercProfiles[p.ubProfile].ubBodyType == Enum194.ROBOTNOWEAPON));

export const OK_ENEMY_MERC = (p: SOLDIERTYPE) => (!p.bNeutral && (p.bSide != gbPlayerNum) && p.bLife >= OKLIFE);

// Checks if our guy can be controllable .... checks bInSector, team, on duty, etc...
export const OK_CONTROLLABLE_MERC = (p: SOLDIERTYPE) => (p.bLife >= OKLIFE && p.bActive && p.bInSector && p.bTeam == gbPlayerNum && p.bAssignment < Enum117.ON_DUTY);

// Checks if our guy can be controllable .... checks bInSector, team, on duty, etc...
export const OK_INSECTOR_MERC = (p: SOLDIERTYPE) => (p.bLife >= OKLIFE && p.bActive && p.bInSector && p.bTeam == gbPlayerNum && p.bAssignment < Enum117.ON_DUTY);

// Checkf if our guy can be selected and is not in a position where our team has an interupt and he does not have one...
export const OK_INTERRUPT_MERC = (p: SOLDIERTYPE) => ((INTERRUPT_QUEUED() != false) ? ((p.bMoved) ? false : true) : true);

export const CREATURE_OR_BLOODCAT = (p: SOLDIERTYPE) => (Boolean(p.uiStatusFlags & SOLDIER_MONSTER) || p.ubBodyType == Enum194.BLOODCAT);

export const TANK = (p: SOLDIERTYPE) => (p.ubBodyType == Enum194.TANK_NE || p.ubBodyType == Enum194.TANK_NW);

export const OK_ENTERABLE_VEHICLE = (p: SOLDIERTYPE) => ((p.uiStatusFlags & SOLDIER_VEHICLE) && !TANK(p) && p.bLife >= OKLIFE);

}
