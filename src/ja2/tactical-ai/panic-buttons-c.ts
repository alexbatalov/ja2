namespace ja2 {

export function MakeClosestEnemyChosenOne(): void {
  let cnt: UINT32;
  let sPathCost: INT16;
  let sShortestPath: INT16 = 1000;
  let bOldKeys: INT8 = -1;
  let ubClosestEnemy: UINT8 = NOBODY;
  let pSoldier: SOLDIERTYPE;
  let bPanicTrigger: INT8;
  let sPanicTriggerGridNo: INT16;

  if (!(gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE)) {
    return;
  }

  if (!NeedToRadioAboutPanicTrigger()) {
    // no active panic triggers
    return;
  }

  // consider every enemy, looking for the closest capable, unbusy one
  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (!pSoldier) // if this merc is inactive, or not here
    {
      continue;
    }

    // if this merc is unconscious, or dead
    if (pSoldier.bLife < OKLIFE) {
      continue; // next soldier
    }

    // if this guy's too tired to go
    if (pSoldier.bBreath < OKBREATH) {
      continue; // next soldier
    }

    if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y) {
      if (pSoldier.ubProfile != Enum268.WARDEN) {
        continue;
      }
    } else {
      // only consider for army guys
      if (pSoldier.bTeam != ENEMY_TEAM) {
        continue;
      }
    }

    // if this guy is in battle with opponent(s)
    if (pSoldier.bOppCnt > 0) {
      continue; // next soldier
    }

    // if this guy is still in serious shock
    if (pSoldier.bShock > 2) {
      continue; // next soldier
    }

    if (pSoldier.bLevel != 0) {
      // screw having guys on the roof go for panic triggers!
      continue; // next soldier
    }

    bPanicTrigger = ClosestPanicTrigger(pSoldier);
    if (bPanicTrigger == -1) {
      continue; // next soldier
    }

    sPanicTriggerGridNo = gTacticalStatus.sPanicTriggerGridNo[bPanicTrigger];
    if (sPanicTriggerGridNo == NOWHERE) {
      // this should never happen!
      continue;
    }

    // remember whether this guy had keys before
    // bOldKeys = pSoldier->bHasKeys;

    // give him keys to see if with them he can get to the panic trigger
    pSoldier.bHasKeys = (pSoldier.bHasKeys << 1) | 1;

    // we now path directly to the panic trigger

    // if he can't get to a spot where he could get at the panic trigger
    /*
    if ( FindAdjacentGridEx( pSoldier, gTacticalStatus.sPanicTriggerGridno, &ubDirection, &sAdjSpot, FALSE, FALSE ) == -1 )
    {
            pSoldier->bHasKeys = bOldKeys;
            continue;          // next merc
    }
    */

    // ok, this enemy appears to be eligible

    // FindAdjacentGrid set HandGrid for us.  If we aren't at that spot already
    if (pSoldier.sGridNo != sPanicTriggerGridNo) {
      // get the AP cost for this enemy to go to target position
      sPathCost = PlotPath(pSoldier, sPanicTriggerGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.WALKING, NOT_STEALTH, FORWARD, 0);
    } else {
      sPathCost = 0;
    }

    // set his keys value back to what it was before this hack
    pSoldier.bHasKeys = (pSoldier.bHasKeys >> 1);

    // if he can get there (or is already there!)
    if (sPathCost || (pSoldier.sGridNo == sPanicTriggerGridNo)) {
      if (sPathCost < sShortestPath) {
        sShortestPath = sPathCost;
        ubClosestEnemy = pSoldier.ubID;
      }
    }
    // else
    // NameMessage(pSoldier,"can't get there...");
  }

  // if we found have an eligible enemy, make him our "chosen one"
  if (ubClosestEnemy < NOBODY) {
    gTacticalStatus.ubTheChosenOne = ubClosestEnemy; // flag him as the chosen one

    pSoldier = MercPtrs[gTacticalStatus.ubTheChosenOne];
    if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
      pSoldier.bAlertStatus = Enum243.STATUS_RED;
      CheckForChangingOrders(pSoldier);
    }
    SetNewSituation(pSoldier); // set new situation for the chosen one
    pSoldier.bHasKeys = (pSoldier.bHasKeys << 1) | 1; // cheat and give him keys to every door
    // pSoldier->bHasKeys = TRUE;
  }
}

export function PossiblyMakeThisEnemyChosenOne(pSoldier: SOLDIERTYPE): void {
  let iAPCost: INT32;
  let iPathCost: INT32;
  // INT8		bOldKeys;
  let bPanicTrigger: INT8;
  let sPanicTriggerGridNo: INT16;
  let uiPercentEnemiesKilled: UINT32;

  if (!(gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE)) {
    return;
  }

  if (pSoldier.bLevel != 0) {
    // screw having guys on the roof go for panic triggers!
    return;
  }

  bPanicTrigger = ClosestPanicTrigger(pSoldier);
  if (bPanicTrigger == -1) {
    return;
  }

  sPanicTriggerGridNo = gTacticalStatus.sPanicTriggerGridNo[bPanicTrigger];

  uiPercentEnemiesKilled = (100 * (gTacticalStatus.ubArmyGuysKilled) / (gTacticalStatus.Team[ENEMY_TEAM].bMenInSector + gTacticalStatus.ubArmyGuysKilled));
  if (gTacticalStatus.ubPanicTolerance[bPanicTrigger] > uiPercentEnemiesKilled) {
    // not yet... not yet
    return;
  }

  // bOldKeys = pSoldier->bHasKeys;
  pSoldier.bHasKeys = (pSoldier.bHasKeys << 1) | 1;

  // if he can't get to a spot where he could get at the panic trigger
  iAPCost = AP_PULL_TRIGGER;
  if (pSoldier.sGridNo != sPanicTriggerGridNo) {
    iPathCost = PlotPath(pSoldier, sPanicTriggerGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.RUNNING, NOT_STEALTH, FORWARD, 0);
    if (iPathCost == 0) {
      // pSoldier->bHasKeys = bOldKeys;
      pSoldier.bHasKeys = (pSoldier.bHasKeys >> 1);
      return;
    }
    iAPCost += iPathCost;
  }

  if (iAPCost <= CalcActionPoints(pSoldier) * 2) {
    // go!!!
    gTacticalStatus.ubTheChosenOne = pSoldier.ubID;
    return;
  }
  // else return keys to normal
  // pSoldier->bHasKeys = bOldKeys;
  pSoldier.bHasKeys = (pSoldier.bHasKeys >> 1);
}

export function PanicAI(pSoldier: SOLDIERTYPE, ubCanMove: boolean /* UINT8 */): INT8 {
  let fFoundRoute: boolean = false;
  let bSlot: INT8;
  let iPathCost: INT32;
  let bPanicTrigger: INT8;
  let sPanicTriggerGridNo: INT16;

  // if there are panic bombs here
  if (gTacticalStatus.fPanicFlags & PANIC_BOMBS_HERE) {
    // if enemy is holding a portable panic bomb detonator, he tries to use it
    bSlot = FindObj(pSoldier, Enum225.REMOTEBOMBTRIGGER);
    if (bSlot != NO_SLOT) {
      //////////////////////////////////////////////////////////////////////
      // ACTIVATE DETONATOR: blow up sector's panic bombs
      //////////////////////////////////////////////////////////////////////

      // if we have enough APs to activate it now
      if (pSoldier.bActionPoints >= AP_USE_REMOTE) {
        // blow up all the PANIC bombs!
        return Enum289.AI_ACTION_USE_DETONATOR;
      } else // otherwise, wait a turn
      {
        pSoldier.usActionData = NOWHERE;
        return Enum289.AI_ACTION_NONE;
      }
    }
  }

  // no panic bombs, or no portable detonator

  // if there's a panic trigger here (DOESN'T MATTER IF ANY PANIC BOMBS EXIST!)
  if (gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE) {
    // Have WE been chosen to go after the trigger?
    if (pSoldier.ubID == gTacticalStatus.ubTheChosenOne) {
      bPanicTrigger = ClosestPanicTrigger(pSoldier);
      if (bPanicTrigger == -1) {
        // augh!
        return -1;
      }
      sPanicTriggerGridNo = gTacticalStatus.sPanicTriggerGridNo[bPanicTrigger];

      // if not standing on the panic trigger
      if (pSoldier.sGridNo != sPanicTriggerGridNo) {
        // determine whether we can still get there
        iPathCost = PlotPath(pSoldier, sPanicTriggerGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.RUNNING, NOT_STEALTH, FORWARD, 0);
        if (iPathCost != 0) {
          fFoundRoute = true;
        }
      } else {
        fFoundRoute = true;
      }

      // if we managed to find an adjacent spot
      if (fFoundRoute) {
        /*
         *** COMMENTED OUT BECAUSE WE DON'T HAVE SUPPORT ROUTINES YET

               // make sure it's not in water (those triggers can't be pulled)
               if (Water(Terrain(gTacticalStatus.sHandGrid),Structure(gTacticalStatus.sHandGrid)))
                {
        #ifdef BETAVERSION
                 PopMessage("BAD SCENARIO DESIGN: Enemies can't use this panic trigger!");
        #endif
                 gTacticalStatus.ubTheChosenOne = NOBODY;   // strip him of his Chosen One status
                 // don't bother replacing him either, the next won't have more luck!
                 return(-1);
                }

                */
        // if we are at that spot now
        if (pSoldier.sGridNo == sPanicTriggerGridNo) {
          ////////////////////////////////////////////////////////////////
          // PULL THE PANIC TRIGGER!
          ////////////////////////////////////////////////////////////////

          // and we have enough APs left to pull the trigger
          if (pSoldier.bActionPoints >= AP_PULL_TRIGGER) {
            // blow up the all the PANIC bombs (or just the journal)
            pSoldier.usActionData = sPanicTriggerGridNo;

            return Enum289.AI_ACTION_PULL_TRIGGER;
          } else // otherwise, wait a turn
          {
            pSoldier.usActionData = NOWHERE;
            return Enum289.AI_ACTION_NONE;
          }
        } else // we are NOT at the HandGrid spot
        {
          // if we can move at least 1 square's worth
          if (ubCanMove) {
            // if we can get to the HandGrid spot to yank the trigger
            // animations don't allow trigger-pulling from water, so we won't!
            if (LegalNPCDestination(pSoldier, sPanicTriggerGridNo, ENSURE_PATH, NOWATER, 0)) {
              pSoldier.usActionData = sPanicTriggerGridNo;
              pSoldier.bPathStored = true;

              return Enum289.AI_ACTION_GET_CLOSER;
            } else // Oh oh, the chosen one can't get to the trigger!
            {
              gTacticalStatus.ubTheChosenOne = NOBODY; // strip him of his Chosen One status
              MakeClosestEnemyChosenOne(); // and replace him!
            }
          } else // can't move, wait 1 turn
          {
            pSoldier.usActionData = NOWHERE;
            return Enum289.AI_ACTION_NONE;
          }
        }
      } else // Oh oh, the chosen one can't get to the trigger!
      {
        gTacticalStatus.ubTheChosenOne = NOBODY; // strip him of his Chosen One status
        MakeClosestEnemyChosenOne(); // and replace him!
      }
    }
  }

  // no action decided
  return -1;
}

export function InitPanicSystem(): void {
  // start by assuming there is no panic bombs or triggers here
  gTacticalStatus.ubTheChosenOne = NOBODY;
  FindPanicBombsAndTriggers();
}

export function ClosestPanicTrigger(pSoldier: SOLDIERTYPE): INT8 {
  let bLoop: INT8;
  let sDistance: INT16;
  let sClosestDistance: INT16 = 1000;
  let bClosestTrigger: INT8 = -1;
  let uiPercentEnemiesKilled: UINT32;

  uiPercentEnemiesKilled = (100 * (gTacticalStatus.ubArmyGuysKilled) / (gTacticalStatus.Team[ENEMY_TEAM].bMenInSector + gTacticalStatus.ubArmyGuysKilled));

  for (bLoop = 0; bLoop < NUM_PANIC_TRIGGERS; bLoop++) {
    if (gTacticalStatus.sPanicTriggerGridNo[bLoop] != NOWHERE) {
      if (gTacticalStatus.ubPanicTolerance[bLoop] > uiPercentEnemiesKilled) {
        // not yet... not yet...
        continue; // next trigger
      }

      // in Tixa
      if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y) {
        // screen out everyone but the warden
        if (pSoldier.ubProfile != Enum268.WARDEN) {
          break;
        }

        // screen out the second/later panic trigger if the first one hasn't been triggered
        if (bLoop > 0 && gTacticalStatus.sPanicTriggerGridNo[bLoop - 1] != NOWHERE) {
          break;
        }
      }

      sDistance = PythSpacesAway(pSoldier.sGridNo, gTacticalStatus.sPanicTriggerGridNo[bLoop]);
      if (sDistance < sClosestDistance) {
        sClosestDistance = sDistance;
        bClosestTrigger = bLoop;
      }
    }
  }

  return bClosestTrigger;
}

export function NeedToRadioAboutPanicTrigger(): boolean {
  let uiPercentEnemiesKilled: UINT32;
  let bLoop: INT8;

  if (!(gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE) || gTacticalStatus.ubTheChosenOne != NOBODY) {
    // already done!
    return false;
  }

  if (gTacticalStatus.Team[ENEMY_TEAM].bMenInSector == 0) {
    return false;
  }

  if (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y) {
    let pSoldier: SOLDIERTYPE | null;
    pSoldier = FindSoldierByProfileID(Enum268.WARDEN, false);
    if (!pSoldier || pSoldier.ubID == gTacticalStatus.ubTheChosenOne) {
      return false;
    }
  }

  uiPercentEnemiesKilled = (100 * (gTacticalStatus.ubArmyGuysKilled) / (gTacticalStatus.Team[ENEMY_TEAM].bMenInSector + gTacticalStatus.ubArmyGuysKilled));

  for (bLoop = 0; bLoop < NUM_PANIC_TRIGGERS; bLoop++) {
    // if the bomb exists and its tolerance has been exceeded
    if ((gTacticalStatus.sPanicTriggerGridNo[bLoop] != NOWHERE) && (uiPercentEnemiesKilled >= gTacticalStatus.ubPanicTolerance[bLoop])) {
      return true;
    }
  }

  return false;
}

const STAIRCASE_GRIDNO = 12067;
const STAIRCASE_DIRECTION = 0;

export function HeadForTheStairCase(pSoldier: SOLDIERTYPE): INT8 {
  let pBasementInfo: UNDERGROUND_SECTORINFO | null;

  pBasementInfo = FindUnderGroundSector(3, MAP_ROW_P, 1);
  if (pBasementInfo && pBasementInfo.uiTimeCurrentSectorWasLastLoaded != 0 && (pBasementInfo.ubNumElites + pBasementInfo.ubNumTroops + pBasementInfo.ubNumAdmins) < 5) {
    return Enum289.AI_ACTION_NONE;
  }

  if (PythSpacesAway(pSoldier.sGridNo, STAIRCASE_GRIDNO) < 2) {
    return Enum289.AI_ACTION_TRAVERSE_DOWN;
  } else {
    if (LegalNPCDestination(pSoldier, STAIRCASE_GRIDNO, ENSURE_PATH, WATEROK, 0)) {
      pSoldier.usActionData = STAIRCASE_GRIDNO;
      return Enum289.AI_ACTION_GET_CLOSER;
    }
  }
  return Enum289.AI_ACTION_NONE;
}

const WARDEN_ALARM_GRIDNO = 9376;
const WARDEN_GAS_GRIDNO = 9216;
// in both cases, direction 6

}
