namespace ja2 {

let gubNumUIPlannedMoves: UINT8 = 0;
let gpUIPlannedSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */ = <SOLDIERTYPE><unknown>null;
let gpUIStartPlannedSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */ = <SOLDIERTYPE><unknown>null;
let gfInUIPlanMode: boolean = false;

export function BeginUIPlan(pSoldier: SOLDIERTYPE): boolean {
  gubNumUIPlannedMoves = 0;
  gpUIPlannedSoldier = pSoldier;
  gpUIStartPlannedSoldier = pSoldier;
  gfInUIPlanMode = true;

  gfPlotNewMovement = true;

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Entering Planning Mode");

  return true;
}

export function AddUIPlan(sGridNo: UINT16, ubPlanID: UINT8): boolean {
  let pPlanSoldier: SOLDIERTYPE;
  let sXPos: INT16;
  let sYPos: INT16;
  let sAPCost: INT16 = 0;
  let bDirection: INT8;
  let iLoop: INT32;
  let MercCreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
  let ubNewIndex: UINT8 = 0;

  // Depeding on stance and direction facing, add guy!

  // If we have a planned action here, ignore!

  // If not OK Dest, ignore!
  if (!NewOKDestination(gpUIPlannedSoldier, sGridNo, false, gsInterfaceLevel)) {
    return false;
  }

  if (ubPlanID == UIPLAN_ACTION_MOVETO) {
    // Calculate cost to move here
    sAPCost = PlotPath(gpUIPlannedSoldier, sGridNo, COPYROUTE, NO_PLOT, TEMPORARY, gpUIPlannedSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, gpUIPlannedSoldier.bActionPoints);
    // Adjust for running if we are not already running
    if (gpUIPlannedSoldier.usUIMovementMode == Enum193.RUNNING) {
      sAPCost += AP_START_RUN_COST;
    }

    if (EnoughPoints(gpUIPlannedSoldier, sAPCost, 0, false)) {
      MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
      MercCreateStruct.ubProfile = NO_PROFILE;
      MercCreateStruct.fPlayerPlan = true;
      MercCreateStruct.bBodyType = gpUIPlannedSoldier.ubBodyType;
      MercCreateStruct.sInsertionGridNo = sGridNo;

      // Get Grid Corrdinates of mouse
      if (TacticalCreateSoldier(MercCreateStruct, createPointer(() => ubNewIndex, (v) => ubNewIndex = v))) {
        // Get pointer to soldier
        pPlanSoldier = <SOLDIERTYPE>GetSoldier(ubNewIndex);

        pPlanSoldier.sPlannedTargetX = -1;
        pPlanSoldier.sPlannedTargetY = -1;

        // Compare OPPLISTS!
        // Set ones we don't know about but do now back to old ( ie no new guys )
        for (iLoop = 0; iLoop < MAX_NUM_SOLDIERS; iLoop++) {
          if (gpUIPlannedSoldier.bOppList[iLoop] < 0) {
            pPlanSoldier.bOppList[iLoop] = gpUIPlannedSoldier.bOppList[iLoop];
          }
        }

        // Get XY from Gridno
        ({ sX: sXPos, sY: sYPos } = ConvertGridNoToCenterCellXY(sGridNo));

        EVENT_SetSoldierPosition(pPlanSoldier, sXPos, sYPos);
        EVENT_SetSoldierDestination(pPlanSoldier, sGridNo);
        pPlanSoldier.bVisible = 1;
        pPlanSoldier.usUIMovementMode = gpUIPlannedSoldier.usUIMovementMode;

        pPlanSoldier.bActionPoints = gpUIPlannedSoldier.bActionPoints - sAPCost;

        pPlanSoldier.ubPlannedUIAPCost = pPlanSoldier.bActionPoints;

        // Get direction
        bDirection = gpUIPlannedSoldier.usPathingData[gpUIPlannedSoldier.usPathDataSize - 1];

        // Set direction
        pPlanSoldier.bDirection = bDirection;
        pPlanSoldier.bDesiredDirection = bDirection;

        // Set walking animation
        ChangeSoldierState(pPlanSoldier, pPlanSoldier.usUIMovementMode, 0, false);

        // Change selected soldier
        gusSelectedSoldier = pPlanSoldier.ubID;

        // Change global planned mode to this guy!
        gpUIPlannedSoldier = pPlanSoldier;

        gubNumUIPlannedMoves++;

        gfPlotNewMovement = true;

        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Adding Merc Move to Plan");
      }
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Merc will not have enough action points");
    }
  } else if (ubPlanID == UIPLAN_ACTION_FIRE) {
    sAPCost = CalcTotalAPsToAttack(gpUIPlannedSoldier, sGridNo, 1, (gpUIPlannedSoldier.bShownAimTime / 2));

    // Get XY from Gridno
    ({ sX: sXPos, sY: sYPos } = ConvertGridNoToCenterCellXY(sGridNo));

    // If this is a player guy, show message about no APS
    if (EnoughPoints(gpUIPlannedSoldier, sAPCost, 0, false)) {
      // CHECK IF WE ARE A PLANNED SOLDIER OR NOT< IF SO< CREATE!
      if (gpUIPlannedSoldier.ubID < MAX_NUM_SOLDIERS) {
        MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
        MercCreateStruct.ubProfile = NO_PROFILE;
        MercCreateStruct.fPlayerPlan = true;
        MercCreateStruct.bBodyType = gpUIPlannedSoldier.ubBodyType;
        MercCreateStruct.sInsertionGridNo = sGridNo;

        // Get Grid Corrdinates of mouse
        if (TacticalCreateSoldier(MercCreateStruct, createPointer(() => ubNewIndex, (v) => ubNewIndex = v))) {
          // Get pointer to soldier
          pPlanSoldier = <SOLDIERTYPE>GetSoldier(ubNewIndex);

          pPlanSoldier.sPlannedTargetX = -1;
          pPlanSoldier.sPlannedTargetY = -1;

          // Compare OPPLISTS!
          // Set ones we don't know about but do now back to old ( ie no new guys )
          for (iLoop = 0; iLoop < MAX_NUM_SOLDIERS; iLoop++) {
            if (gpUIPlannedSoldier.bOppList[iLoop] < 0) {
              pPlanSoldier.bOppList[iLoop] = gpUIPlannedSoldier.bOppList[iLoop];
            }
          }

          EVENT_SetSoldierPosition(pPlanSoldier, gpUIPlannedSoldier.dXPos, gpUIPlannedSoldier.dYPos);
          EVENT_SetSoldierDestination(pPlanSoldier, gpUIPlannedSoldier.sGridNo);
          pPlanSoldier.bVisible = 1;
          pPlanSoldier.usUIMovementMode = gpUIPlannedSoldier.usUIMovementMode;

          pPlanSoldier.bActionPoints = gpUIPlannedSoldier.bActionPoints - sAPCost;

          pPlanSoldier.ubPlannedUIAPCost = pPlanSoldier.bActionPoints;

          // Get direction
          bDirection = gpUIPlannedSoldier.usPathingData[gpUIPlannedSoldier.usPathDataSize - 1];

          // Set direction
          pPlanSoldier.bDirection = bDirection;
          pPlanSoldier.bDesiredDirection = bDirection;

          // Set walking animation
          ChangeSoldierState(pPlanSoldier, pPlanSoldier.usUIMovementMode, 0, false);

          // Change selected soldier
          gusSelectedSoldier = pPlanSoldier.ubID;

          // Change global planned mode to this guy!
          gpUIPlannedSoldier = pPlanSoldier;

          gubNumUIPlannedMoves++;
        }
      }

      gpUIPlannedSoldier.bActionPoints = gpUIPlannedSoldier.bActionPoints - sAPCost;

      gpUIPlannedSoldier.ubPlannedUIAPCost = gpUIPlannedSoldier.bActionPoints;

      // Get direction from gridno
      bDirection = GetDirectionFromGridNo(sGridNo, gpUIPlannedSoldier);

      // Set direction
      gpUIPlannedSoldier.bDirection = bDirection;
      gpUIPlannedSoldier.bDesiredDirection = bDirection;

      // Set to shooting animation
      SelectPausedFireAnimation(gpUIPlannedSoldier);

      gpUIPlannedSoldier.sPlannedTargetX = sXPos;
      gpUIPlannedSoldier.sPlannedTargetY = sYPos;

      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Adding Merc Shoot to Plan");
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Merc will not have enough action points");
    }
  }
  return true;
}

export function EndUIPlan(): void {
  let cnt: number;
  let pSoldier: SOLDIERTYPE;

  // Zero out any planned soldiers
  for (cnt = MAX_NUM_SOLDIERS; cnt < TOTAL_SOLDIERS; cnt++) {
    pSoldier = MercPtrs[cnt];

    if (pSoldier.bActive) {
      if (pSoldier.sPlannedTargetX != -1) {
        SetRenderFlags(RENDER_FLAG_FULL);
      }
      TacticalRemoveSoldier(pSoldier.ubID);
    }
  }
  gfInUIPlanMode = false;
  gusSelectedSoldier = gpUIStartPlannedSoldier.ubID;

  gfPlotNewMovement = true;

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Leaving Planning Mode");
}

export function InUIPlanMode(): boolean {
  return gfInUIPlanMode;
}

function SelectPausedFireAnimation(pSoldier: SOLDIERTYPE): void {
  // Determine which animation to do...depending on stance and gun in hand...

  switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      if (pSoldier.bDoBurst > 0) {
        ChangeSoldierState(pSoldier, Enum193.STANDING_BURST, 2, false);
      } else {
        ChangeSoldierState(pSoldier, Enum193.SHOOT_RIFLE_STAND, 2, false);
      }
      break;

    case ANIM_PRONE:
      ChangeSoldierState(pSoldier, Enum193.SHOOT_RIFLE_PRONE, 2, false);
      break;

    case ANIM_CROUCH:
      ChangeSoldierState(pSoldier, Enum193.SHOOT_RIFLE_CROUCH, 2, false);
      break;
  }
}

}
