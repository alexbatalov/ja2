namespace ja2 {

export let gfSetPerceivedDoorState: boolean = false;

export function HandleDoorChangeFromGridNo(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fNoAnimations: boolean): void {
  let pStructure: Pointer<STRUCTURE>;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let fDoorsAnimated: boolean = false;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure == null) {
    return;
  }

  fDoorsAnimated = HandleDoorsOpenClose(pSoldier, sGridNo, pStructure, fNoAnimations);
  if (SwapStructureForPartner(sGridNo, pStructure) != null) {
    RecompileLocalMovementCosts(sGridNo);
  }

  // set door busy
  pDoorStatus = GetDoorStatus(sGridNo);
  if (pDoorStatus == null) {
    return;
  }

  // ATE: Only do if animated.....
  if (fDoorsAnimated) {
    pDoorStatus.value.ubFlags |= DOOR_BUSY;
  }
}

export function GetAnimStateForInteraction(pSoldier: Pointer<SOLDIERTYPE>, fDoor: boolean, usAnimState: UINT16): UINT16 {
  switch (usAnimState) {
    case Enum193.OPEN_DOOR:

      if (pSoldier.value.ubBodyType == Enum194.CRIPPLECIV) {
        return Enum193.CRIPPLE_OPEN_DOOR;
      } else {
        if (fDoor) {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.OPEN_DOOR_CROUCHED;
          } else {
            return usAnimState;
          }
        } else {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.BEGIN_OPENSTRUCT_CROUCHED;
          } else {
            return Enum193.BEGIN_OPENSTRUCT;
          }
        }
      }
      break;

    case Enum193.CLOSE_DOOR:

      if (pSoldier.value.ubBodyType == Enum194.CRIPPLECIV) {
        return Enum193.CRIPPLE_CLOSE_DOOR;
      } else {
        if (fDoor) {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.CLOSE_DOOR_CROUCHED;
          } else {
            return usAnimState;
          }
        } else {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.OPEN_STRUCT_CROUCHED;
          } else {
            return Enum193.OPEN_STRUCT;
          }
        }
      }
      break;

    case Enum193.END_OPEN_DOOR:

      if (pSoldier.value.ubBodyType == Enum194.CRIPPLECIV) {
        return Enum193.CRIPPLE_END_OPEN_DOOR;
      } else {
        if (fDoor) {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.END_OPEN_DOOR_CROUCHED;
          } else {
            return usAnimState;
          }
        } else {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.END_OPENSTRUCT_CROUCHED;
          } else {
            return Enum193.END_OPENSTRUCT;
          }
        }
      }
      break;

    case Enum193.END_OPEN_LOCKED_DOOR:

      if (pSoldier.value.ubBodyType == Enum194.CRIPPLECIV) {
        return Enum193.CRIPPLE_END_OPEN_LOCKED_DOOR;
      } else {
        if (fDoor) {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.END_OPEN_LOCKED_DOOR_CROUCHED;
          } else {
            return Enum193.END_OPEN_LOCKED_DOOR;
          }
        } else {
          if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
            return Enum193.END_OPENSTRUCT_LOCKED_CROUCHED;
          } else {
            return Enum193.END_OPENSTRUCT_LOCKED;
          }
        }
      }
      break;

    case Enum193.PICK_LOCK:

      if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
        return Enum193.LOCKPICK_CROUCHED;
      } else {
        return Enum193.PICK_LOCK;
      }
      break;

    default:
      // should never happen!
      Assert(false);
      return usAnimState;
      break;
  }
}

export function InteractWithClosedDoor(pSoldier: Pointer<SOLDIERTYPE>, ubHandleCode: UINT8): void {
  pSoldier.value.ubDoorHandleCode = ubHandleCode;

  switch (ubHandleCode) {
    case HANDLE_DOOR_OPEN:
    case HANDLE_DOOR_UNLOCK:
    case HANDLE_DOOR_EXAMINE:
    case HANDLE_DOOR_EXPLODE:
    case HANDLE_DOOR_LOCK:
    case HANDLE_DOOR_UNTRAP:
    case HANDLE_DOOR_CROWBAR:

      ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, true, Enum193.OPEN_DOOR), 0, false);
      break;

    case HANDLE_DOOR_FORCE:

      ChangeSoldierState(pSoldier, Enum193.KICK_DOOR, 0, false);
      break;

    case HANDLE_DOOR_LOCKPICK:

      ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, true, Enum193.PICK_LOCK), 0, false);
      break;
  }
}

function DoTrapCheckOnStartingMenu(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): boolean {
  let bDetectLevel: INT8;

  if (pDoor && pDoor.value.fLocked && pDoor.value.ubTrapID != Enum227.NO_TRAP && pDoor.value.bPerceivedTrapped == DOOR_PERCEIVED_UNKNOWN) {
    // check for noticing the trap
    bDetectLevel = CalcTrapDetectLevel(pSoldier, false);
    if (bDetectLevel >= pDoor.value.ubTrapLevel) {
      // say quote, update status
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);
      UpdateDoorPerceivedValue(pDoor);

      return true;
    }
  }

  return false;
}

export function InteractWithOpenableStruct(pSoldier: Pointer<SOLDIERTYPE>, pStructure: Pointer<STRUCTURE>, ubDirection: UINT8, fDoor: boolean): void {
  let pBaseStructure: Pointer<STRUCTURE>;
  let fDoMenu: boolean = false;
  let pDoor: Pointer<DOOR>;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let fTrapsFound: boolean = false;

  pBaseStructure = FindBaseStructure(pStructure);

  if (fDoor) {
    // get door status, if busy then just return!
    pDoorStatus = GetDoorStatus(pBaseStructure.value.sGridNo);
    if (pDoorStatus && (pDoorStatus.value.ubFlags & DOOR_BUSY)) {
      // Send this guy into stationary stance....
      EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);

      if (pSoldier.value.bTeam == gbPlayerNum) {
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.DOOR_IS_BUSY]);
      } else {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Trying to open door and door is busy: %d", pSoldier.value.ubID));
      }
      return;
    }
  }

  EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);

  // Is the door opened?
  if (pStructure.value.fFlags & STRUCTURE_OPEN) {
    if (pSoldier.value.ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID && !(pStructure.value.fFlags & STRUCTURE_SWITCH)) {
      // Bring up menu to decide what to do....
      SoldierGotoStationaryStance(pSoldier);

      pDoor = FindDoorInfoAtGridNo(pBaseStructure.value.sGridNo);
      if (pDoor) {
        if (DoTrapCheckOnStartingMenu(pSoldier, pDoor)) {
          fTrapsFound = true;
        }
      }

      // Pull Up Menu
      if (!fTrapsFound) {
        InitDoorOpenMenu(pSoldier, pStructure, ubDirection, true);
      }
    } else {
      // Easily close door....
      ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.CLOSE_DOOR), 0, false);
    }
  } else {
    // Bring up the menu, only if it has a lock!
    if (pSoldier.value.ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID) {
      pDoor = FindDoorInfoAtGridNo(pBaseStructure.value.sGridNo);

      if (pDoor != null) {
        // Assume true
        fDoMenu = true;

        // Check if it's locked.....
        // If not locked, don't bring it up!
        if (!pDoor.value.fLocked) {
          fDoMenu = false;
        }
      }
    }

    if (fDoMenu) {
      // Bring up menu to decide what to do....
      SoldierGotoStationaryStance(pSoldier);

      if (DoTrapCheckOnStartingMenu(pSoldier, pDoor)) {
        fTrapsFound = true;
      }

      // Pull Up Menu
      if (!fTrapsFound) {
        InitDoorOpenMenu(pSoldier, pStructure, ubDirection, false);
      } else {
        UnSetUIBusy(pSoldier.value.ubID);
      }
    } else {
      pSoldier.value.ubDoorHandleCode = HANDLE_DOOR_OPEN;

      ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.OPEN_DOOR), 0, false);
    }
  }
}

function ProcessImplicationsOfPCMessingWithDoor(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubRoom: UINT8;
  let pGoon: Pointer<SOLDIERTYPE>;
  // if player is hacking at a door in the brothel and a kingpin guy can see him
  if ((InARoom(pSoldier.value.sGridNo, addressof(ubRoom)) && IN_BROTHEL(ubRoom)) || (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_D && gbWorldSectorZ == 0 && (pSoldier.value.sGridNo == 11010 || pSoldier.value.sGridNo == 11177 || pSoldier.value.sGridNo == 11176))) {
    let ubLoop: UINT8;

    // see if a kingpin goon can see us
    for (ubLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID; ubLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; ubLoop++) {
      pGoon = MercPtrs[ubLoop];
      if (pGoon.value.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP && pGoon.value.bActive && pGoon.value.bInSector && pGoon.value.bLife >= OKLIFE && pGoon.value.bOppList[pSoldier.value.ubID] == SEEN_CURRENTLY) {
        MakeCivHostile(pGoon, 2);
        if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
          EnterCombatMode(pGoon.value.bTeam);
        }
      }
    }
  }

  if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y) {
    pGoon = FindSoldierByProfileID(Enum268.WARDEN, false);
    if (pGoon && pGoon.value.bAlertStatus < Enum243.STATUS_RED && PythSpacesAway(pSoldier.value.sGridNo, pGoon.value.sGridNo) <= 5) {
      // alert her if she hasn't been alerted
      pGoon.value.bAlertStatus = Enum243.STATUS_RED;
      CheckForChangingOrders(pGoon);
      CancelAIAction(pGoon, true);
    }
  }
}

export function HandleOpenableStruct(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, pStructure: Pointer<STRUCTURE>): boolean {
  let fHandleDoor: boolean = false;
  let sAPCost: INT16 = 0;
  let sBPCost: INT16 = 0;
  let pDoor: Pointer<DOOR>;
  let fTrapFound: boolean = false;
  let fDoAction: boolean = true;
  let fDoor: boolean = false;
  let bItemIn: INT8 = false;

  // Are we a door?
  if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
    fDoor = true;
  }

  // Calculate basic points...

  // We'll add any aps for things like lockpicking, booting, etc

  // If we are already open....no need for lockpick checks, etc
  if (pStructure.value.fFlags & STRUCTURE_OPEN) {
    // Set costs for these
    sAPCost = AP_OPEN_DOOR;
    sBPCost = BP_OPEN_DOOR;

    fHandleDoor = true;
  } else {
    if (pSoldier.value.ubID < 20) {
      // Find locked door here....
      pDoor = FindDoorInfoAtGridNo(sGridNo);

      // Alrighty, first check for traps ( unless we are examining.... )
      if (pSoldier.value.ubDoorHandleCode != HANDLE_DOOR_EXAMINE && pSoldier.value.ubDoorHandleCode != HANDLE_DOOR_UNTRAP && pSoldier.value.ubDoorHandleCode != HANDLE_DOOR_UNLOCK) {
        if (pDoor != null) {
          // Do we have a trap? NB if door is unlocked disable all traps
          if (pDoor.value.fLocked && pDoor.value.ubTrapID != Enum227.NO_TRAP) {
            fTrapFound = true;

            // Set costs for these
            // Set AP costs to that of opening a door
            sAPCost = AP_OPEN_DOOR;
            sBPCost = BP_OPEN_DOOR;

            ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);

            // Did we inadvertently set it off?
            if (HasDoorTrapGoneOff(pSoldier, pDoor)) {
              // Kaboom
              // Code to handle trap here...
              HandleDoorTrap(pSoldier, pDoor);
              if (DoorTrapTable[pDoor.value.ubTrapID].fFlags & DOOR_TRAP_STOPS_ACTION) {
                // trap stops person from opening door!
                fDoAction = false;
              }
              if (!(DoorTrapTable[pDoor.value.ubTrapID].fFlags & DOOR_TRAP_RECURRING)) {
                // trap only happens once
                pDoor.value.ubTrapLevel = 0;
                pDoor.value.ubTrapID = Enum227.NO_TRAP;
              }
              UpdateDoorPerceivedValue(pDoor);
            } else {
              // If we didn't set it off then we must have noticed it or know about it already

              // do we know it's trapped?
              if (pDoor.value.bPerceivedTrapped == DOOR_PERCEIVED_UNKNOWN) {
                switch (pDoor.value.ubTrapID) {
                  case Enum227.BROTHEL_SIREN:
                    ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_DESCRIPTION_STR], pDoorTrapStrings[Enum227.SIREN]);
                    break;
                  case Enum227.SUPER_ELECTRIC:
                    ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_DESCRIPTION_STR], pDoorTrapStrings[Enum227.ELECTRIC]);
                    break;
                  default:
                    ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_DESCRIPTION_STR], pDoorTrapStrings[pDoor.value.ubTrapID]);
                    break;
                }

                // Stop action this time....
                fDoAction = false;

                // report!
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);
              } else {
                // Set it off!
                HandleDoorTrap(pSoldier, pDoor);
                if (DoorTrapTable[pDoor.value.ubTrapID].fFlags & DOOR_TRAP_STOPS_ACTION) {
                  // trap stops person from opening door!
                  fDoAction = false;
                }
                if (!(DoorTrapTable[pDoor.value.ubTrapID].fFlags & DOOR_TRAP_RECURRING)) {
                  // trap only happens once
                  pDoor.value.ubTrapLevel = 0;
                  pDoor.value.ubTrapID = Enum227.NO_TRAP;
                }
              }
              UpdateDoorPerceivedValue(pDoor);
            }
          }
        }
      }

      if (fDoAction) {
        // OK, switch based on how we are going to open door....
        switch (pSoldier.value.ubDoorHandleCode) {
          case HANDLE_DOOR_OPEN:

            // If we have no lock on door...
            if (pDoor == null) {
              // Set costs for these
              sAPCost = AP_OPEN_DOOR;
              sBPCost = BP_OPEN_DOOR;

              // Open if it's not locked....
              ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
              fHandleDoor = true;
              break;
            } else {
              if (pDoor.value.fLocked) {
                // it's locked....
                ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_LOCKED_DOOR), 0, false);

                // Do we have a quote for locked stuff?
                // Now just show on message bar
                if (!AM_AN_EPC(pSoldier)) {
                  DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_LOCKED);
                } else {
                  ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_HAS_BEEN_LOCKED_STR]);
                }
              } else {
                ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
                fHandleDoor = true;
              }
              UpdateDoorPerceivedValue(pDoor);
              break;
            }
            break;

          case HANDLE_DOOR_FORCE:

            // Set costs for these
            sAPCost = AP_BOOT_DOOR;
            sBPCost = BP_BOOT_DOOR;

            // OK, using force, if we have no lock, just open the door!
            if (pDoor == null) {
              ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
              fHandleDoor = true;

              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
            } else {
              // Attempt to force door
              if (AttemptToSmashDoor(pSoldier, pDoor)) {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_DESTROYED_STR ] );
                // DoMercBattleSound( pSoldier, BATTLE_SOUND_COOL1 );
                fHandleDoor = true;
              } else {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_NOT_DESTROYED_STR ] );
                UpdateDoorPerceivedValue(pDoor);
              }
              ProcessImplicationsOfPCMessingWithDoor(pSoldier);
            }
            break;

          case HANDLE_DOOR_CROWBAR:

            // Set costs for these
            sAPCost = AP_USE_CROWBAR;
            sBPCost = BP_USE_CROWBAR;

            // OK, using force, if we have no lock, just open the door!
            if (pDoor == null) {
              ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
              fHandleDoor = true;

              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
            } else {
              // Attempt to force door
              if (AttemptToCrowbarLock(pSoldier, pDoor)) {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_DESTROYED_STR ] );
                // DoMercBattleSound( pSoldier, BATTLE_SOUND_COOL1 );
                fHandleDoor = true;
              } else {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_NOT_DESTROYED_STR ] );
                UpdateDoorPerceivedValue(pDoor);
              }

              ProcessImplicationsOfPCMessingWithDoor(pSoldier);
            }
            break;

          case HANDLE_DOOR_EXPLODE:

            // Set costs for these
            sAPCost = AP_EXPLODE_DOOR;
            sBPCost = BP_EXPLODE_DOOR;

            if (pDoor == null) {
              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
            } else {
              // Attempt to force door
              if (AttemptToBlowUpLock(pSoldier, pDoor)) {
                // DoMercBattleSound( pSoldier, BATTLE_SOUND_COOL1 );
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_DESTROYED_STR ] );
                fHandleDoor = true;
              } else {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_NOT_DESTROYED_STR ] );
                UpdateDoorPerceivedValue(pDoor);
              }
              ProcessImplicationsOfPCMessingWithDoor(pSoldier);
            }
            break;

          case HANDLE_DOOR_LOCKPICK:

            // Set costs for these
            sAPCost = AP_PICKLOCK;
            sBPCost = BP_PICKLOCK;

            // Attempt to pick lock
            if (pDoor == null) {
              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
            } else {
              if (AttemptToPickLock(pSoldier, pDoor)) {
                DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_COOL1);
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_HAS_BEEN_PICKED_STR ] );
                fHandleDoor = true;
              } else {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_HAS_NOT_BEEN_PICKED_STR ] );
              }
              ProcessImplicationsOfPCMessingWithDoor(pSoldier);
            }
            break;

          case HANDLE_DOOR_EXAMINE:

            // Set costs for these
            sAPCost = AP_EXAMINE_DOOR;
            sBPCost = BP_EXAMINE_DOOR;

            // Attempt to examine door
            // Whatever the result, end the open animation
            ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);

            if (pDoor == null) {
              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
            } else {
              if (ExamineDoorForTraps(pSoldier, pDoor)) {
                // We have a trap. Use door pointer to determine what type, etc
                TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);
                switch (pDoor.value.ubTrapID) {
                  case Enum227.BROTHEL_SIREN:
                    ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_DESCRIPTION_STR], pDoorTrapStrings[Enum227.SIREN]);
                    break;
                  case Enum227.SUPER_ELECTRIC:
                    ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_DESCRIPTION_STR], pDoorTrapStrings[Enum227.ELECTRIC]);
                    break;
                  default:
                    ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_DESCRIPTION_STR], pDoorTrapStrings[pDoor.value.ubTrapID]);
                    break;
                }

                UpdateDoorPerceivedValue(pDoor);
              } else {
                ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_UNTRAPPED_STR]);
              }
            }
            break;

          case HANDLE_DOOR_UNLOCK:

            // Set costs for these
            sAPCost = AP_UNLOCK_DOOR;
            sBPCost = BP_UNLOCK_DOOR;

            // OK, if we have no lock, show that!
            if (pDoor == null) {
              // Open if it's not locked....
              // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_THERE_IS_NO_LOCK_STR ] );
              ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
              break;
            } else {
              // it's locked....
              // Attempt to unlock....
              if (AttemptToUnlockDoor(pSoldier, pDoor)) {
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_HAS_BEEN_UNLOCKED_STR ] );
                // DoMercBattleSound( pSoldier, BATTLE_SOUND_COOL1 );

                ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
                UpdateDoorPerceivedValue(pDoor);

                fHandleDoor = true;
              } else {
                ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_LOCKED_DOOR), 0, false);
                // Do we have a quote for locked stuff?
                // Now just show on message bar
                // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_NOT_PROPER_KEY_STR ], pSoldier->name );

                // OK PLay damn battle sound
                if (Random(2)) {
                  DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
                }
              }
            }
            break;

          case HANDLE_DOOR_UNTRAP:

            // Set costs for these
            sAPCost = AP_UNTRAP_DOOR;
            sBPCost = BP_UNTRAP_DOOR;

            // OK, if we have no lock, show that!
            if (pDoor == null) {
              // Open if it's not locked....
              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
              ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
              break;
            } else {
              // Do we have a trap?
              if (pDoor.value.ubTrapID != Enum227.NO_TRAP) {
                fTrapFound = true;
              }

              if (fTrapFound) {
                if (AttemptToUntrapDoor(pSoldier, pDoor)) {
                  // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[ DOOR_LOCK_HAS_BEEN_UNTRAPPED_STR ] );
                  DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_COOL1);
                  ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
                  UpdateDoorPerceivedValue(pDoor);
                  // fHandleDoor = TRUE;
                } else {
                  ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_LOCKED_DOOR), 0, false);
                  // Now just show on message bar
                  HandleDoorTrap(pSoldier, pDoor);

                  if (!(DoorTrapTable[pDoor.value.ubTrapID].fFlags & DOOR_TRAP_RECURRING)) {
                    // trap only happens once
                    pDoor.value.ubTrapLevel = 0;
                    pDoor.value.ubTrapID = Enum227.NO_TRAP;
                  }

                  // Update perceived lock value
                  UpdateDoorPerceivedValue(pDoor);
                }
              } else {
                ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_IS_NOT_TRAPPED_STR]);
              }
            }
            break;

          case HANDLE_DOOR_LOCK:

            // Set costs for these
            sAPCost = AP_LOCK_DOOR;
            sBPCost = BP_LOCK_DOOR;

            // OK, if we have no lock, show that!
            if (pDoor == null) {
              // Open if it's not locked....
              ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_THERE_IS_NO_LOCK_STR]);
              ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
              break;
            } else {
              // it's locked....
              // Attempt to unlock....
              if (AttemptToLockDoor(pSoldier, pDoor)) {
                ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_LOCK_HAS_BEEN_LOCKED_STR]);
                ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
                UpdateDoorPerceivedValue(pDoor);
              } else {
                ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_LOCKED_DOOR), 0, false);
                // Do we have a quote for locked stuff?
                // Now just show on message bar
                ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.DOOR_NOT_PROPER_KEY_STR], pSoldier.value.name);

                // Update perceived lock value
                UpdateDoorPerceivedValue(pDoor);
              }
            }
            break;
        }
      }
    } else {
      // Set costs for these
      sAPCost = AP_OPEN_DOOR;
      sBPCost = BP_OPEN_DOOR;

      // Open if it's not locked....
      ChangeSoldierState(pSoldier, GetAnimStateForInteraction(pSoldier, fDoor, Enum193.END_OPEN_DOOR), 0, false);
      fHandleDoor = true;
    }
  }

  if (fHandleDoor) {
    if (fDoor) {
      HandleDoorChangeFromGridNo(pSoldier, sGridNo, false);
    } else {
      HandleStructChangeFromGridNo(pSoldier, sGridNo);
    }
  }

  // Deduct points!
  // if ( fDoor )
  { DeductPoints(pSoldier, sAPCost, sBPCost); }

  return fHandleDoor;
}

function HandleDoorsOpenClose(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, pStructure: Pointer<STRUCTURE>, fNoAnimations: boolean): boolean {
  let pShadowNode: Pointer<LEVELNODE>;
  let pNode: Pointer<LEVELNODE>;
  let cnt: INT32;
  let fOpenedGraphic: boolean = false;
  let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
  let fDoAnimation: boolean = true;
  let pBaseStructure: Pointer<STRUCTURE>;
  let uiSoundID: UINT32;

  pBaseStructure = FindBaseStructure(pStructure);
  if (!pBaseStructure) {
    return false;
  }

  pNode = FindLevelNodeBasedOnStructure(pBaseStructure.value.sGridNo, pBaseStructure);
  if (!pNode) {
    return false;
  }

  // ATE: if we are about to swap, but have an animation playing here..... stop the animation....
  if ((pNode.value.uiFlags & LEVELNODE_ANIMATION)) {
    if (pNode.value.pAniTile != null) {
      if (pNode.value.pAniTile.value.uiFlags & ANITILE_DOOR) {
        // ATE: No two doors can exist ( there can be only one )
        // Update value.. ie: prematurely end door animation
        // Update current frame...

        if (pNode.value.pAniTile.value.uiFlags & ANITILE_FORWARD) {
          pNode.value.sCurrentFrame = pNode.value.pAniTile.value.sStartFrame + pNode.value.pAniTile.value.usNumFrames;
        }

        if (pNode.value.pAniTile.value.uiFlags & ANITILE_BACKWARD) {
          pNode.value.sCurrentFrame = pNode.value.pAniTile.value.sStartFrame - pNode.value.pAniTile.value.usNumFrames;
        }

        pNode.value.sCurrentFrame = pNode.value.pAniTile.value.usNumFrames - 1;

        // Delete...
        DeleteAniTile(pNode.value.pAniTile);

        pNode.value.uiFlags &= ~(LEVELNODE_LASTDYNAMIC | LEVELNODE_UPDATESAVEBUFFERONCE);

        if (GridNoOnScreen(pBaseStructure.value.sGridNo)) {
          SetRenderFlags(RENDER_FLAG_FULL);
        }
      }
    }
  }

  pShadowNode = gpWorldLevelData[sGridNo].pShadowHead;

  // Check the graphic which is down!
  // Check for Open Door!
  cnt = 0;
  while (gOpenDoorList[cnt] != -1) {
    // IF WE ARE A SHADOW TYPE
    if (pNode.value.usIndex == gOpenDoorList[cnt]) {
      fOpenedGraphic = true;
      break;
    }
    cnt++;
  };

  if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
    // ATE, the last parameter is the perceived value, I dont know what it is so could you please add the value?
    // ModifyDoorStatus( INT16 sGridNo, BOOLEAN fOpen, BOOLEAN fPercievedOpen )
    if (gfSetPerceivedDoorState) {
      ModifyDoorStatus(sGridNo, true, true);
    } else {
      ModifyDoorStatus(sGridNo, true, DONTSETDOORSTATUS);
    }

    if (gWorldSectorX == 13 && gWorldSectorY == MAP_ROW_I) {
      DoPOWPathChecks();
    }

    if (pSoldier) {
      // OK, Are we a player merc or AI?
      if (pSoldier.value.bTeam != gbPlayerNum) {
        // If an AI guy... do LOS check first....
        // If guy is visible... OR fading...
        if (pSoldier.value.bVisible == -1 && !AllMercsLookForDoor(sGridNo, false) && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
          fDoAnimation = false;
        }
      }
    } else {
      // door opening by action item... just do a LOS check
      if (!AllMercsLookForDoor(sGridNo, false)) {
        fDoAnimation = false;
      }
    }

    if (fNoAnimations) {
      fDoAnimation = false;
    }

    if (fDoAnimation) {
      // Update perceived value
      ModifyDoorStatus(sGridNo, DONTSETDOORSTATUS, true);

      if (fOpenedGraphic) {
        memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
        AniParams.sGridNo = sGridNo;
        AniParams.ubLevelID = ANI_STRUCT_LEVEL;
        AniParams.usTileType = gTileDatabase[pNode.value.usIndex].fType;
        AniParams.usTileIndex = pNode.value.usIndex;
        AniParams.sDelay = INTTILE_DOOR_OPENSPEED;
        AniParams.sStartFrame = pNode.value.sCurrentFrame;
        AniParams.uiFlags = ANITILE_DOOR | ANITILE_FORWARD | ANITILE_EXISTINGTILE;
        AniParams.pGivenLevelNode = pNode;

        CreateAnimationTile(addressof(AniParams));
      } else {
        memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));
        AniParams.sGridNo = sGridNo;
        AniParams.ubLevelID = ANI_STRUCT_LEVEL;
        AniParams.usTileType = gTileDatabase[pNode.value.usIndex].fType;
        AniParams.usTileIndex = pNode.value.usIndex;
        AniParams.sDelay = INTTILE_DOOR_OPENSPEED;
        AniParams.sStartFrame = pNode.value.sCurrentFrame;
        AniParams.uiFlags = ANITILE_DOOR | ANITILE_BACKWARD | ANITILE_EXISTINGTILE;
        AniParams.pGivenLevelNode = pNode;

        CreateAnimationTile(addressof(AniParams));
      }
    }

    // SHADOW STUFF HERE
    // if ( pShadowNode != NULL )
    //{
    //	pShadowNode->uiFlags |= LEVELNODE_ANIMATION;
    //	pShadowNode->uiFlags |= LEVELNODE_ANIMATION_PLAYONCE;
    //	pShadowNode->uiFlags |= LEVELNODE_ANIMATION_FORWARD;
    //	if ( pShadowNode->uiFlags & LEVELNODE_ANIMATION_BACKWARD )
    //		pShadowNode->uiFlags ^= LEVELNODE_ANIMATION_BACKWARD;
    //	pShadowNode->sDelay		= INTTILE_DOOR_OPENSPEED;
    //}

    if (fDoAnimation && pSoldier && pSoldier.value.ubDoorOpeningNoise) {
      // ATE; Default to normal door...
      uiSoundID = (Enum330.DROPEN_1 + Random(3));

      // OK, check if this door is sliding and is multi-tiled...
      if (pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR) {
        // Get database value...
        if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles > 1) {
          // change sound ID
          uiSoundID = Enum330.GARAGE_DOOR_OPEN;
        } else if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_CLOTH) {
          // change sound ID
          uiSoundID = Enum330.CURTAINS_OPEN;
        }
      } else if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_LIGHT_METAL || pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_THICKER_METAL || pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_HEAVY_METAL) {
        // change sound ID
        uiSoundID = Enum330.METAL_DOOR_OPEN;
      }

      // OK, We must know what sound to play, for now use same sound for all doors...
      PlayJA2Sample(uiSoundID, RATE_11025, SoundVolume(MIDVOLUME, sGridNo), 1, SoundDir(sGridNo));
    }
  } else {
    // ATE, the last parameter is the perceived value, I dont know what it is so could you please add the value?
    // ModifyDoorStatus( INT16 sGridNo, BOOLEAN fOpen, BOOLEAN fInitiallyPercieveOpen )

    if (gfSetPerceivedDoorState) {
      ModifyDoorStatus(sGridNo, false, false);
    } else {
      ModifyDoorStatus(sGridNo, false, DONTSETDOORSTATUS);
    }

    if (pSoldier) {
      // OK, Are we a player merc or AI?
      if (pSoldier.value.bTeam != gbPlayerNum) {
        // If an AI guy... do LOS check first....
        // If guy is visible... OR fading...
        if (pSoldier.value.bVisible == -1 && !AllMercsLookForDoor(sGridNo, false) && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
          fDoAnimation = false;
        }
      }
    } else {
      // door opening by action item... just do a LOS check
      if (!AllMercsLookForDoor(sGridNo, false)) {
        fDoAnimation = false;
      }
    }

    if (fNoAnimations) {
      fDoAnimation = false;
    }

    if (fDoAnimation) {
      // Update perceived value
      ModifyDoorStatus(sGridNo, DONTSETDOORSTATUS, false);

      memset(addressof(AniParams), 0, sizeof(ANITILE_PARAMS));

      // ATE; Default to normal door...
      uiSoundID = (Enum330.DRCLOSE_1 + Random(2));

      // OK, check if this door is sliding and is multi-tiled...
      if (pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR) {
        // Get database value...
        if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles > 1) {
          // change sound ID
          uiSoundID = Enum330.GARAGE_DOOR_CLOSE;
        } else if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_CLOTH) {
          // change sound ID
          uiSoundID = Enum330.CURTAINS_CLOSE;
        }
      } else if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_LIGHT_METAL || pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_THICKER_METAL || pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_HEAVY_METAL) {
        // change sound ID
        uiSoundID = Enum330.METAL_DOOR_CLOSE;
      }

      AniParams.uiKeyFrame1Code = Enum311.ANI_KEYFRAME_DO_SOUND;
      AniParams.uiUserData = uiSoundID;
      AniParams.uiUserData3 = sGridNo;

      if (fOpenedGraphic) {
        AniParams.sGridNo = sGridNo;
        AniParams.ubLevelID = ANI_STRUCT_LEVEL;
        AniParams.usTileType = gTileDatabase[pNode.value.usIndex].fType;
        AniParams.usTileIndex = pNode.value.usIndex;
        AniParams.sDelay = INTTILE_DOOR_OPENSPEED;
        AniParams.sStartFrame = pNode.value.sCurrentFrame;
        AniParams.uiFlags = ANITILE_DOOR | ANITILE_BACKWARD | ANITILE_EXISTINGTILE;
        AniParams.pGivenLevelNode = pNode;

        AniParams.ubKeyFrame1 = pNode.value.sCurrentFrame - 2;

        CreateAnimationTile(addressof(AniParams));
      } else {
        AniParams.sGridNo = sGridNo;
        AniParams.ubLevelID = ANI_STRUCT_LEVEL;
        AniParams.usTileType = gTileDatabase[pNode.value.usIndex].fType;
        AniParams.usTileIndex = pNode.value.usIndex;
        AniParams.sDelay = INTTILE_DOOR_OPENSPEED;
        AniParams.sStartFrame = pNode.value.sCurrentFrame;
        AniParams.uiFlags = ANITILE_DOOR | ANITILE_FORWARD | ANITILE_EXISTINGTILE;
        AniParams.pGivenLevelNode = pNode;

        AniParams.ubKeyFrame1 = pNode.value.sCurrentFrame + 2;

        CreateAnimationTile(addressof(AniParams));
      }
    }

    // if ( pShadowNode != NULL )
    //{
    //	pShadowNode->uiFlags |= LEVELNODE_ANIMATION;
    //	pShadowNode->uiFlags |= LEVELNODE_ANIMATION_PLAYONCE;
    //	pShadowNode->uiFlags |= LEVELNODE_ANIMATION_BACKWARD;
    //	if ( pShadowNode->uiFlags & LEVELNODE_ANIMATION_FORWARD )
    //		pShadowNode->uiFlags ^= LEVELNODE_ANIMATION_FORWARD;
    //	pShadowNode->sDelay		= INTTILE_DOOR_OPENSPEED;
    //}
  }

  if (fDoAnimation) {
    gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
    // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
    InvalidateWorldRedundency();

    if (GridNoOnScreen(sGridNo)) {
      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }

  return fDoAnimation;
}

export function SetDoorString(sGridNo: INT16): void {
  let pDoor: Pointer<DOOR>;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let pStructure: Pointer<STRUCTURE>;

  let fTrapped: boolean = false;

  // Try and get a door if one exists here
  pDoor = FindDoorInfoAtGridNo(sGridNo);

  if (gfUIIntTileLocation == false) {
    if (pDoor == null) {
      gzIntTileLocation = TacticalStr[Enum335.DOOR_DOOR_MOUSE_DESCRIPTION];
      gfUIIntTileLocation = true;
    } else {
      gzIntTileLocation = TacticalStr[Enum335.DOOR_DOOR_MOUSE_DESCRIPTION];
      gfUIIntTileLocation = true;

      // CHECK PERCEIVED VALUE
      switch (pDoor.value.bPerceivedTrapped) {
        case DOOR_PERCEIVED_TRAPPED:

          gzIntTileLocation2 = TacticalStr[Enum335.DOOR_TRAPPED_MOUSE_DESCRIPTION];
          gfUIIntTileLocation2 = true;
          fTrapped = true;
          break;
      }

      if (!fTrapped) {
        // CHECK PERCEIVED VALUE
        switch (pDoor.value.bPerceivedLocked) {
          case DOOR_PERCEIVED_UNKNOWN:

            break;

          case DOOR_PERCEIVED_LOCKED:

            gzIntTileLocation2 = TacticalStr[Enum335.DOOR_LOCKED_MOUSE_DESCRIPTION];
            gfUIIntTileLocation2 = true;
            break;

          case DOOR_PERCEIVED_UNLOCKED:

            gzIntTileLocation2 = TacticalStr[Enum335.DOOR_UNLOCKED_MOUSE_DESCRIPTION];
            gfUIIntTileLocation2 = true;
            break;

          case DOOR_PERCEIVED_BROKEN:

            gzIntTileLocation2 = TacticalStr[Enum335.DOOR_BROKEN_MOUSE_DESCRIPTION];
            gfUIIntTileLocation2 = true;
            break;
        }
      }
    }
  }

  // ATE: If here, we try to say, opened or closed...
  if (gfUIIntTileLocation2 == false) {
// FIXME: Language-specific code
// #ifdef GERMAN
//
//     wcscpy(gzIntTileLocation2, TacticalStr[DOOR_DOOR_MOUSE_DESCRIPTION]);
//     gfUIIntTileLocation2 = TRUE;
//
//     // Try to get doors status here...
//     pDoorStatus = GetDoorStatus(sGridNo);
//     if (pDoorStatus == NULL || (pDoorStatus != NULL && pDoorStatus->ubFlags & DOOR_PERCEIVED_NOTSET)) {
//       // OK, get status based on graphic.....
//       pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
//       if (pStructure) {
//         if (pStructure->fFlags & STRUCTURE_OPEN) {
//           // Door is opened....
//           wcscpy(gzIntTileLocation, pMessageStrings[MSG_OPENED]);
//           gfUIIntTileLocation = TRUE;
//         } else {
//           // Door is closed
//           wcscpy(gzIntTileLocation, pMessageStrings[MSG_CLOSED]);
//           gfUIIntTileLocation = TRUE;
//         }
//       }
//     } else {
//       // Use percived value
//       if (pDoorStatus->ubFlags & DOOR_PERCEIVED_OPEN) {
//         // Door is opened....
//         wcscpy(gzIntTileLocation, pMessageStrings[MSG_OPENED]);
//         gfUIIntTileLocation = TRUE;
//       } else {
//         // Door is closed
//         wcscpy(gzIntTileLocation, pMessageStrings[MSG_CLOSED]);
//         gfUIIntTileLocation = TRUE;
//       }
//     }
// #else

    // Try to get doors status here...
    pDoorStatus = GetDoorStatus(sGridNo);
    if (pDoorStatus == null || (pDoorStatus != null && pDoorStatus.value.ubFlags & DOOR_PERCEIVED_NOTSET)) {
      // OK, get status based on graphic.....
      pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
      if (pStructure) {
        if (pStructure.value.fFlags & STRUCTURE_OPEN) {
          // Door is opened....
          gzIntTileLocation2 = pMessageStrings[Enum333.MSG_OPENED];
          gfUIIntTileLocation2 = true;
        } else {
          // Door is closed
          gzIntTileLocation2 = pMessageStrings[Enum333.MSG_CLOSED];
          gfUIIntTileLocation2 = true;
        }
      }
    } else {
      // Use percived value
      if (pDoorStatus.value.ubFlags & DOOR_PERCEIVED_OPEN) {
        // Door is opened....
        gzIntTileLocation2 = pMessageStrings[Enum333.MSG_OPENED];
        gfUIIntTileLocation2 = true;
      } else {
        // Door is closed
        gzIntTileLocation2 = pMessageStrings[Enum333.MSG_CLOSED];
        gfUIIntTileLocation2 = true;
      }
    }

// #endif
  }
}

}
