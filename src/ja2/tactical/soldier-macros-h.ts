namespace ja2 {

// MACROS
export const RPC_RECRUITED = (p: Pointer<SOLDIERTYPE>) => ((p.value.ubProfile == NO_PROFILE) ? false : (gMercProfiles[p.value.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED));

export const AM_AN_EPC = (p: Pointer<SOLDIERTYPE>) => ((p.value.ubProfile == NO_PROFILE) ? false : (gMercProfiles[p.value.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG_EPCACTIVE));

export const AM_A_ROBOT = (p: Pointer<SOLDIERTYPE>) => ((p.value.ubProfile == NO_PROFILE) ? false : (gMercProfiles[p.value.ubProfile].ubBodyType == Enum194.ROBOTNOWEAPON));

export const OK_ENEMY_MERC = (p: Pointer<SOLDIERTYPE>) => (!p.value.bNeutral && (p.value.bSide != gbPlayerNum) && p.value.bLife >= OKLIFE);

// Checks if our guy can be controllable .... checks bInSector, team, on duty, etc...
export const OK_CONTROLLABLE_MERC = (p: Pointer<SOLDIERTYPE>) => (p.value.bLife >= OKLIFE && p.value.bActive && p.value.bInSector && p.value.bTeam == gbPlayerNum && p.value.bAssignment < Enum117.ON_DUTY);

// Checks if our guy can be controllable .... checks bInSector, team, on duty, etc...
export const OK_INSECTOR_MERC = (p: Pointer<SOLDIERTYPE>) => (p.value.bLife >= OKLIFE && p.value.bActive && p.value.bInSector && p.value.bTeam == gbPlayerNum && p.value.bAssignment < Enum117.ON_DUTY);

// Checkf if our guy can be selected and is not in a position where our team has an interupt and he does not have one...
export const OK_INTERRUPT_MERC = (p: Pointer<SOLDIERTYPE>) => ((INTERRUPT_QUEUED() != 0) ? ((p.value.bMoved) ? false : true) : true);

export const CREATURE_OR_BLOODCAT = (p: Pointer<SOLDIERTYPE>) => ((p.value.uiStatusFlags & SOLDIER_MONSTER) || p.value.ubBodyType == Enum194.BLOODCAT);

export const TANK = (p: Pointer<SOLDIERTYPE>) => (p.value.ubBodyType == Enum194.TANK_NE || p.value.ubBodyType == Enum194.TANK_NW);

export const OK_ENTERABLE_VEHICLE = (p: Pointer<SOLDIERTYPE>) => ((p.value.uiStatusFlags & SOLDIER_VEHICLE) && !TANK(p) && p.value.bLife >= OKLIFE);

}
