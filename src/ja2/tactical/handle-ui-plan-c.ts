let gubNumUIPlannedMoves: UINT8 = 0;
let gpUIPlannedSoldier: Pointer<SOLDIERTYPE> = NULL;
let gpUIStartPlannedSoldier: Pointer<SOLDIERTYPE> = NULL;
let gfInUIPlanMode: BOOLEAN = FALSE;

function BeginUIPlan(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  gubNumUIPlannedMoves = 0;
  gpUIPlannedSoldier = pSoldier;
  gpUIStartPlannedSoldier = pSoldier;
  gfInUIPlanMode = TRUE;

  gfPlotNewMovement = TRUE;

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Entering Planning Mode");

  return TRUE;
}

function AddUIPlan(sGridNo: UINT16, ubPlanID: UINT8): BOOLEAN {
  let pPlanSoldier: Pointer<SOLDIERTYPE>;
  let sXPos: INT16;
  let sYPos: INT16;
  let sAPCost: INT16 = 0;
  let bDirection: INT8;
  let iLoop: INT32;
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let ubNewIndex: UINT8;

  // Depeding on stance and direction facing, add guy!

  // If we have a planned action here, ignore!

  // If not OK Dest, ignore!
  if (!NewOKDestination(gpUIPlannedSoldier, sGridNo, FALSE, gsInterfaceLevel)) {
    return FALSE;
  }

  if (ubPlanID == UIPLAN_ACTION_MOVETO) {
    // Calculate cost to move here
    sAPCost = PlotPath(gpUIPlannedSoldier, sGridNo, COPYROUTE, NO_PLOT, TEMPORARY, gpUIPlannedSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, gpUIPlannedSoldier.value.bActionPoints);
    // Adjust for running if we are not already running
    if (gpUIPlannedSoldier.value.usUIMovementMode == RUNNING) {
      sAPCost += AP_START_RUN_COST;
    }

    if (EnoughPoints(gpUIPlannedSoldier, sAPCost, 0, FALSE)) {
      memset(&MercCreateStruct, 0, sizeof(MercCreateStruct));
      MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
      MercCreateStruct.ubProfile = NO_PROFILE;
      MercCreateStruct.fPlayerPlan = TRUE;
      MercCreateStruct.bBodyType = gpUIPlannedSoldier.value.ubBodyType;
      MercCreateStruct.sInsertionGridNo = sGridNo;

      // Get Grid Corrdinates of mouse
      if (TacticalCreateSoldier(&MercCreateStruct, &ubNewIndex)) {
        // Get pointer to soldier
        GetSoldier(&pPlanSoldier, ubNewIndex);

        pPlanSoldier.value.sPlannedTargetX = -1;
        pPlanSoldier.value.sPlannedTargetY = -1;

        // Compare OPPLISTS!
        // Set ones we don't know about but do now back to old ( ie no new guys )
        for (iLoop = 0; iLoop < MAX_NUM_SOLDIERS; iLoop++) {
          if (gpUIPlannedSoldier.value.bOppList[iLoop] < 0) {
            pPlanSoldier.value.bOppList[iLoop] = gpUIPlannedSoldier.value.bOppList[iLoop];
          }
        }

        // Get XY from Gridno
        ConvertGridNoToCenterCellXY(sGridNo, &sXPos, &sYPos);

        EVENT_SetSoldierPosition(pPlanSoldier, sXPos, sYPos);
        EVENT_SetSoldierDestination(pPlanSoldier, sGridNo);
        pPlanSoldier.value.bVisible = 1;
        pPlanSoldier.value.usUIMovementMode = gpUIPlannedSoldier.value.usUIMovementMode;

        pPlanSoldier.value.bActionPoints = gpUIPlannedSoldier.value.bActionPoints - sAPCost;

        pPlanSoldier.value.ubPlannedUIAPCost = pPlanSoldier.value.bActionPoints;

        // Get direction
        bDirection = gpUIPlannedSoldier.value.usPathingData[gpUIPlannedSoldier.value.usPathDataSize - 1];

        // Set direction
        pPlanSoldier.value.bDirection = bDirection;
        pPlanSoldier.value.bDesiredDirection = bDirection;

        // Set walking animation
        ChangeSoldierState(pPlanSoldier, pPlanSoldier.value.usUIMovementMode, 0, FALSE);

        // Change selected soldier
        gusSelectedSoldier = pPlanSoldier.value.ubID;

        // Change global planned mode to this guy!
        gpUIPlannedSoldier = pPlanSoldier;

        gubNumUIPlannedMoves++;

        gfPlotNewMovement = TRUE;

        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Adding Merc Move to Plan");
      }
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Merc will not have enough action points");
    }
  } else if (ubPlanID == UIPLAN_ACTION_FIRE) {
    sAPCost = CalcTotalAPsToAttack(gpUIPlannedSoldier, sGridNo, TRUE, (gpUIPlannedSoldier.value.bShownAimTime / 2));

    // Get XY from Gridno
    ConvertGridNoToCenterCellXY(sGridNo, &sXPos, &sYPos);

    // If this is a player guy, show message about no APS
    if (EnoughPoints(gpUIPlannedSoldier, sAPCost, 0, FALSE)) {
      // CHECK IF WE ARE A PLANNED SOLDIER OR NOT< IF SO< CREATE!
      if (gpUIPlannedSoldier.value.ubID < MAX_NUM_SOLDIERS) {
        memset(&MercCreateStruct, 0, sizeof(MercCreateStruct));
        MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
        MercCreateStruct.ubProfile = NO_PROFILE;
        MercCreateStruct.fPlayerPlan = TRUE;
        MercCreateStruct.bBodyType = gpUIPlannedSoldier.value.ubBodyType;
        MercCreateStruct.sInsertionGridNo = sGridNo;

        // Get Grid Corrdinates of mouse
        if (TacticalCreateSoldier(&MercCreateStruct, &ubNewIndex)) {
          // Get pointer to soldier
          GetSoldier(&pPlanSoldier, ubNewIndex);

          pPlanSoldier.value.sPlannedTargetX = -1;
          pPlanSoldier.value.sPlannedTargetY = -1;

          // Compare OPPLISTS!
          // Set ones we don't know about but do now back to old ( ie no new guys )
          for (iLoop = 0; iLoop < MAX_NUM_SOLDIERS; iLoop++) {
            if (gpUIPlannedSoldier.value.bOppList[iLoop] < 0) {
              pPlanSoldier.value.bOppList[iLoop] = gpUIPlannedSoldier.value.bOppList[iLoop];
            }
          }

          EVENT_SetSoldierPosition(pPlanSoldier, gpUIPlannedSoldier.value.dXPos, gpUIPlannedSoldier.value.dYPos);
          EVENT_SetSoldierDestination(pPlanSoldier, gpUIPlannedSoldier.value.sGridNo);
          pPlanSoldier.value.bVisible = 1;
          pPlanSoldier.value.usUIMovementMode = gpUIPlannedSoldier.value.usUIMovementMode;

          pPlanSoldier.value.bActionPoints = gpUIPlannedSoldier.value.bActionPoints - sAPCost;

          pPlanSoldier.value.ubPlannedUIAPCost = pPlanSoldier.value.bActionPoints;

          // Get direction
          bDirection = gpUIPlannedSoldier.value.usPathingData[gpUIPlannedSoldier.value.usPathDataSize - 1];

          // Set direction
          pPlanSoldier.value.bDirection = bDirection;
          pPlanSoldier.value.bDesiredDirection = bDirection;

          // Set walking animation
          ChangeSoldierState(pPlanSoldier, pPlanSoldier.value.usUIMovementMode, 0, FALSE);

          // Change selected soldier
          gusSelectedSoldier = pPlanSoldier.value.ubID;

          // Change global planned mode to this guy!
          gpUIPlannedSoldier = pPlanSoldier;

          gubNumUIPlannedMoves++;
        }
      }

      gpUIPlannedSoldier.value.bActionPoints = gpUIPlannedSoldier.value.bActionPoints - sAPCost;

      gpUIPlannedSoldier.value.ubPlannedUIAPCost = gpUIPlannedSoldier.value.bActionPoints;

      // Get direction from gridno
      bDirection = GetDirectionFromGridNo(sGridNo, gpUIPlannedSoldier);

      // Set direction
      gpUIPlannedSoldier.value.bDirection = bDirection;
      gpUIPlannedSoldier.value.bDesiredDirection = bDirection;

      // Set to shooting animation
      SelectPausedFireAnimation(gpUIPlannedSoldier);

      gpUIPlannedSoldier.value.sPlannedTargetX = sXPos;
      gpUIPlannedSoldier.value.sPlannedTargetY = sYPos;

      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Adding Merc Shoot to Plan");
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Merc will not have enough action points");
    }
  }
  return TRUE;
}

function EndUIPlan(): void {
  let cnt: int;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Zero out any planned soldiers
  for (cnt = MAX_NUM_SOLDIERS; cnt < TOTAL_SOLDIERS; cnt++) {
    pSoldier = MercPtrs[cnt];

    if (pSoldier.value.bActive) {
      if (pSoldier.value.sPlannedTargetX != -1) {
        SetRenderFlags(RENDER_FLAG_FULL);
      }
      TacticalRemoveSoldier(pSoldier.value.ubID);
    }
  }
  gfInUIPlanMode = FALSE;
  gusSelectedSoldier = gpUIStartPlannedSoldier.value.ubID;

  gfPlotNewMovement = TRUE;

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Leaving Planning Mode");
}

function InUIPlanMode(): BOOLEAN {
  return gfInUIPlanMode;
}

function SelectPausedFireAnimation(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Determine which animation to do...depending on stance and gun in hand...

  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      if (pSoldier.value.bDoBurst > 0) {
        ChangeSoldierState(pSoldier, STANDING_BURST, 2, FALSE);
      } else {
        ChangeSoldierState(pSoldier, SHOOT_RIFLE_STAND, 2, FALSE);
      }
      break;

    case ANIM_PRONE:
      ChangeSoldierState(pSoldier, SHOOT_RIFLE_PRONE, 2, FALSE);
      break;

    case ANIM_CROUCH:
      ChangeSoldierState(pSoldier, SHOOT_RIFLE_CROUCH, 2, FALSE);
      break;
  }
}
