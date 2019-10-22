//*******  Local Defines **************************************************

const DC_MAX_COVER_RANGE = 31;

const DC__SOLDIER_VISIBLE_RANGE = 31;

const DC__MIN_SIZE = 4;
const DC__MAX_SIZE = 11;

interface BEST_COVER_STRUCT {
  sGridNo: INT16;
  bCover: INT8; //% chance that the gridno is fully covered.  ie 100 if safe, 0  is has no cover
}

interface VISIBLE_TO_SOLDIER_STRUCT {
  sGridNo: INT16;
  bVisibleToSoldier: INT8;
  fRoof: BOOLEAN;
}

/*
#define	DC__PRONE				(INT8)( 0x01 )
#define DC__CROUCH			(INT8)( 0x02 )
#define DC__STAND				(INT8)( 0x04 )
*/
const enum Enum205 {
  DC__SEE_NO_STANCES,
  DC__SEE_1_STANCE,
  DC__SEE_2_STANCE,
  DC__SEE_3_STANCE,
}

//******  Global Variables  *****************************************

let gCoverRadius: BEST_COVER_STRUCT[][] /* [DC_MAX_COVER_RANGE][DC_MAX_COVER_RANGE] */;
let gsLastCoverGridNo: INT16 = NOWHERE;
let gsLastSoldierGridNo: INT16 = NOWHERE;
let gbLastStance: INT8 = -1;

let gVisibleToSoldierStruct: VISIBLE_TO_SOLDIER_STRUCT[][] /* [DC__SOLDIER_VISIBLE_RANGE][DC__SOLDIER_VISIBLE_RANGE] */;
let gsLastVisibleToSoldierGridNo: INT16 = NOWHERE;

//*******  Function Prototypes ***************************************

// ppp

//*******  Functions **************************************************

function DisplayCoverOfSelectedGridNo(): void {
  let sGridNo: INT16;
  let bStance: INT8;

  GetMouseMapPos(&sGridNo);

  // Only allowed in if there is someone selected
  if (gusSelectedSoldier == NOBODY) {
    return;
  }

  // if the cursor is in a the tactical map
  if (sGridNo != NOWHERE && sGridNo != 0) {
    bStance = GetCurrentMercForDisplayCoverStance();

    // if the gridno is different then the last one that was displayed
    if (sGridNo != gsLastCoverGridNo || gbLastStance != bStance || MercPtrs[gusSelectedSoldier].value.sGridNo != gsLastSoldierGridNo) {
      // if the cover is currently being displayed
      if (gsLastCoverGridNo != NOWHERE || gbLastStance != -1 || gsLastSoldierGridNo != NOWHERE) {
        // remove the gridnos
        RemoveCoverOfSelectedGridNo();
      } else {
        // if it is the first time in here

        // pop up a message to say we are in the display cover routine
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, zNewTacticalMessages[TCTL_MSG__DISPLAY_COVER]);

        // increment the display cover counter ( just seeing how many times people use it )
        // gJa25SaveStruct.uiDisplayCoverCounter++;
      }

      gbLastStance = bStance;
      gsLastCoverGridNo = sGridNo;
      gsLastSoldierGridNo = MercPtrs[gusSelectedSoldier].value.sGridNo;

      // Fill the array of gridno and cover values
      CalculateCoverInRadiusAroundGridno(sGridNo, gGameSettings.ubSizeOfDisplayCover);

      // Add the graphics to each gridno
      AddCoverTileToEachGridNo();

      // Re-render the scene!
      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }
}

function AddCoverTileToEachGridNo(): void {
  let uiCntX: UINT32;
  let uiCntY: UINT32;
  let fRoof: BOOLEAN = (gsInterfaceLevel != I_GROUND_LEVEL);

  // loop through all the gridnos
  for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
    for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
      // if there is a valid cover at this gridno
      if (gCoverRadius[uiCntX][uiCntY].bCover != -1) {
        // if the tile provides 80-100% cover
        if (gCoverRadius[uiCntX][uiCntY].bCover <= 100 && gCoverRadius[uiCntX][uiCntY].bCover > 80) {
          AddCoverObjectToWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_5, fRoof);
        }

        // else if the tile provides 60-80% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 80 && gCoverRadius[uiCntX][uiCntY].bCover > 60) {
          AddCoverObjectToWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_4, fRoof);
        }

        // else if the tile provides 40-60% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 60 && gCoverRadius[uiCntX][uiCntY].bCover > 40) {
          AddCoverObjectToWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_3, fRoof);
        }

        // else if the tile provides 20-40% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 40 && gCoverRadius[uiCntX][uiCntY].bCover > 20) {
          AddCoverObjectToWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_2, fRoof);
        }

        // else if the tile provides 0-20% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 20 && gCoverRadius[uiCntX][uiCntY].bCover >= 0) {
          AddCoverObjectToWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_1, fRoof);
        }

        // should never get in here
        else {
          Assert(0);
        }
      }
    }
  }
}

function RemoveCoverOfSelectedGridNo(): void {
  let uiCntX: UINT32;
  let uiCntY: UINT32;
  let fRoof: BOOLEAN = (gsInterfaceLevel != I_GROUND_LEVEL);

  if (gsLastCoverGridNo == NOWHERE) {
    return;
  }

  // loop through all the gridnos
  for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
    for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
      // if there is a valid cover at this gridno
      if (gCoverRadius[uiCntX][uiCntY].bCover != -1) {
        //				fRoof = gCoverRadius[ uiCntX ][ uiCntY ].fRoof;

        // if the tile provides 80-100% cover
        if (gCoverRadius[uiCntX][uiCntY].bCover <= 100 && gCoverRadius[uiCntX][uiCntY].bCover > 80) {
          RemoveCoverObjectFromWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_5, fRoof);
        }

        // else if the tile provides 60-80% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 80 && gCoverRadius[uiCntX][uiCntY].bCover > 60) {
          RemoveCoverObjectFromWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_4, fRoof);
        }

        // else if the tile provides 40-60% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 60 && gCoverRadius[uiCntX][uiCntY].bCover > 40) {
          RemoveCoverObjectFromWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_3, fRoof);
        }

        // else if the tile provides 20-40% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 40 && gCoverRadius[uiCntX][uiCntY].bCover > 20) {
          RemoveCoverObjectFromWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_2, fRoof);
        }

        // else if the tile provides 0-20% cover
        else if (gCoverRadius[uiCntX][uiCntY].bCover <= 20 && gCoverRadius[uiCntX][uiCntY].bCover >= 0) {
          RemoveCoverObjectFromWorld(gCoverRadius[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_1, fRoof);
        }

        // should never get in here
        else {
          Assert(0);
        }
      }
    }
  }

  // Re-render the scene!
  SetRenderFlags(RENDER_FLAG_FULL);

  gsLastCoverGridNo = NOWHERE;
  gbLastStance = -1;
  gsLastSoldierGridNo = NOWHERE;
}

function CalculateCoverInRadiusAroundGridno(sTargetGridNo: INT16, bSearchRange: INT8): void {
  let sMaxLeft: INT16;
  let sMaxRight: INT16;
  let sMaxUp: INT16;
  let sMaxDown: INT16;
  let sXOffset: INT16;
  let sYOffset: INT16;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let sGridNo: INT16;
  let sCounterX: INT16;
  let sCounterY: INT16;
  let ubID: UINT8;
  let bStance: INT8;
  //	BOOLEAN fRoof;

  // clear out the array first
  //	memset( gCoverRadius, -1, DC_MAX_COVER_RANGE * DC_MAX_COVER_RANGE );
  // loop through all the gridnos that we are interested in
  for (sCounterY = 0; sCounterY < DC_MAX_COVER_RANGE; sCounterY++) {
    for (sCounterX = 0; sCounterX < DC_MAX_COVER_RANGE; sCounterX++) {
      gCoverRadius[sCounterX][sCounterY].sGridNo = -1;
      gCoverRadius[sCounterX][sCounterY].bCover = -1;
    }
  }

  if (bSearchRange > (DC_MAX_COVER_RANGE / 2))
    bSearchRange = (DC_MAX_COVER_RANGE / 2);

  // determine maximum horizontal limits
  sMaxLeft = min(bSearchRange, (sTargetGridNo % MAXCOL));
  sMaxRight = min(bSearchRange, MAXCOL - ((sTargetGridNo % MAXCOL) + 1));

  // determine maximum vertical limits
  sMaxUp = min(bSearchRange, (sTargetGridNo / MAXROW));
  sMaxDown = min(bSearchRange, MAXROW - ((sTargetGridNo / MAXROW) + 1));

  // Find out which tiles around the location are reachable
  LocalReachableTest(sTargetGridNo, bSearchRange);

  pSoldier = GetCurrentMercForDisplayCover();

  sCounterX = sCounterY = 0;

  // Determine the stance to use
  bStance = GetCurrentMercForDisplayCoverStance();

  // loop through all the gridnos that we are interested in
  for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
    for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
      sGridNo = sTargetGridNo + sXOffset + (MAXCOL * sYOffset);

      // record the gridno
      gCoverRadius[sCounterX][sCounterY].sGridNo = sGridNo;

      /*
                              fRoof = FALSE;

                              //is there a roof above this gridno
                              if( FlatRoofAboveGridNo( sGridNo ) )
                              {
                                      if( IsTheRoofVisible( sGridNo ) )
                                      {
                                              fRoof = TRUE;
                                      }
                              }
      */
      // if the gridno is NOT on screen
      if (!GridNoOnScreen(sGridNo)) {
        continue;
      }

      // if we are to display cover for the roofs, and there is a roof above us
      if (gsInterfaceLevel == I_ROOF_LEVEL && !FlatRoofAboveGridNo(sGridNo)) {
        continue;
      }

      // if the gridno cant be reached
      if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE)) {
        // skip to the next gridno
        sCounterX++;
        continue;
      }

      // if someone (visible) is there, skip
      // Check both bottom level, and top level
      ubID = WhoIsThere2(sGridNo, 0);
      if (ubID == NOBODY) {
        ubID = WhoIsThere2(sGridNo, 1);
      }
      // if someone is here, and they are an enemy, skip over them
      if (ubID != NOBODY && Menptr[ubID].bVisible == TRUE && Menptr[ubID].bTeam != pSoldier.value.bTeam) {
        continue;
      }

      // Calculate the cover for this gridno
      gCoverRadius[sCounterX][sCounterY].bCover = CalcCoverForGridNoBasedOnTeamKnownEnemies(pSoldier, sGridNo, bStance);
      //			gCoverRadius[ sCounterX ][ sCounterY ].fRoof = fRoof;

      sCounterX++;
    }
    sCounterY++;
    sCounterX = 0;
  }
}

function CalcCoverForGridNoBasedOnTeamKnownEnemies(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16, bStance: INT8): INT8 {
  let iTotalCoverPoints: INT32 = 0;
  let bNumEnemies: INT8 = 0;
  let bPercentCoverForGridno: INT8 = 0;
  let uiLoop: UINT32;
  let pOpponent: Pointer<SOLDIERTYPE>;
  let pbPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let iGetThrough: INT32 = 0;
  let iBulletGetThrough: INT32 = 0;
  let iHighestValue: INT32 = 0;
  let iCover: INT32 = 0;
  let usMaxRange: UINT16;
  let usRange: UINT16;
  let usSightLimit: UINT16;

  // loop through all the enemies and determine the cover
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpponent = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, dead, unconscious
    if (!pOpponent || pOpponent.value.bLife < OKLIFE) {
      continue; // next merc
    }

    // if this man is neutral / on the same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.value.bSide == pOpponent.value.bSide)) {
      continue; // next merc
    }

    pbPersOL = pSoldier.value.bOppList + pOpponent.value.ubID;
    pbPublOL = gbPublicOpplist[OUR_TEAM] + pOpponent.value.ubID;

    // if this opponent is unknown personally and publicly
    if (*pbPersOL != SEEN_CURRENTLY && *pbPersOL != SEEN_THIS_TURN && *pbPublOL != SEEN_CURRENTLY && *pbPublOL != SEEN_THIS_TURN) {
      continue; // next merc
    }

    usRange = GetRangeInCellCoordsFromGridNoDiff(pOpponent.value.sGridNo, sTargetGridNo);
    usSightLimit = DistanceVisible(pOpponent, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, sTargetGridNo, pSoldier.value.bLevel);

    if (usRange > (usSightLimit * CELL_X_SIZE)) {
      continue;
    }

    // if actual LOS check fails, then chance to hit is 0, ignore this guy
    if (SoldierToVirtualSoldierLineOfSightTest(pOpponent, sTargetGridNo, pSoldier.value.bLevel, bStance, usSightLimit, TRUE) == 0) {
      continue;
    }

    iGetThrough = SoldierToLocationChanceToGetThrough(pOpponent, sTargetGridNo, pSoldier.value.bLevel, bStance, NOBODY);
    //	iBulletGetThrough = CalcChanceToHitGun( pOpponent, sTargetGridNo, AP_MAX_AIM_ATTACK, AIM_SHOT_TORSO );

    if (WeaponInHand(pOpponent)) {
      usMaxRange = GunRange(&pOpponent.value.inv[HANDPOS]);
    } else {
      usMaxRange = Weapon[GLOCK_18].usRange;
    }

    iBulletGetThrough = __min(__max((((((usMaxRange - usRange) / (usMaxRange)) + .3) * 100)), 0), 100);

    if (iBulletGetThrough > 5 && iGetThrough > 0) {
      iCover = (iGetThrough * iBulletGetThrough / 100);

      if (iCover > iHighestValue)
        iHighestValue = iCover;

      iTotalCoverPoints += iCover;
      bNumEnemies++;
    }
  }

  if (bNumEnemies == 0) {
    bPercentCoverForGridno = 100;
  } else {
    let iTemp: INT32;

    bPercentCoverForGridno = (iTotalCoverPoints / bNumEnemies);

    iTemp = bPercentCoverForGridno - (iHighestValue / bNumEnemies);

    iTemp = iTemp + iHighestValue;

    bPercentCoverForGridno = 100 - (__min(iTemp, 100));
  }

  return bPercentCoverForGridno;
}

function AddCoverObjectToWorld(sGridNo: INT16, usGraphic: UINT16, fRoof: BOOLEAN): void {
  let pNode: Pointer<LEVELNODE>;

  if (fRoof) {
    AddOnRoofToHead(sGridNo, usGraphic);
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
  } else {
    AddObjectToHead(sGridNo, usGraphic);
    pNode = gpWorldLevelData[sGridNo].pObjectHead;
  }

  pNode.value.uiFlags |= LEVELNODE_REVEAL;

  if (NightTime()) {
    pNode.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
    pNode.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
  }
}

function RemoveCoverObjectFromWorld(sGridNo: INT16, usGraphic: UINT16, fRoof: BOOLEAN): void {
  if (fRoof) {
    RemoveOnRoof(sGridNo, usGraphic);
  } else {
    RemoveObject(sGridNo, usGraphic);
  }
}

function GetCurrentMercForDisplayCover(): Pointer<SOLDIERTYPE> {
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  // Get a soldier that is on the player team
  if (gusSelectedSoldier != NOBODY) {
    GetSoldier(&pSoldier, gusSelectedSoldier);
  } else {
    Assert(0);
  }
  return pSoldier;
}

function GetCurrentMercForDisplayCoverStance(): INT8 {
  let bStance: INT8;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  pSoldier = GetCurrentMercForDisplayCover();

  switch (pSoldier.value.usUIMovementMode) {
    case PRONE:
    case CRAWLING:
      bStance = ANIM_PRONE;
      break;

    case KNEEL_DOWN:
    case SWATTING:
    case CROUCHING:
      bStance = ANIM_CROUCH;
      break;

    case WALKING:
    case RUNNING:
    case STANDING:
      bStance = ANIM_STAND;
      break;

    default:
      bStance = ANIM_CROUCH;
      break;
  }

  return bStance;
}

function DisplayRangeToTarget(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16): void {
  let usRange: UINT16 = 0;
  let zOutputString: CHAR16[] /* [512] */;

  if (sTargetGridNo == NOWHERE || sTargetGridNo == 0) {
    return;
  }

  // Get the range to the target location
  usRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sTargetGridNo);

  usRange = usRange / 10;

  // if the soldier has a weapon in hand,
  if (WeaponInHand(pSoldier)) {
    // display a string with the weapons range, then range to target
    swprintf(zOutputString, zNewTacticalMessages[TCTL_MSG__RANGE_TO_TARGET_AND_GUN_RANGE], Weapon[pSoldier.value.inv[HANDPOS].usItem].usRange / 10, usRange);
  } else {
    // display a string with the range to target
    swprintf(zOutputString, zNewTacticalMessages[TCTL_MSG__RANGE_TO_TARGET], usRange);
  }

  // Display the msg
  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, zOutputString);

  // if the target is out of the mercs gun range or knife
  if (!InRange(pSoldier, sTargetGridNo) && (Item[pSoldier.value.inv[HANDPOS].usItem].usItemClass == IC_GUN || Item[pSoldier.value.inv[HANDPOS].usItem].usItemClass == IC_THROWING_KNIFE)) {
    // Display a warning saying so
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[OUT_OF_RANGE_STRING]);
  }

  // increment the display gun range counter ( just seeing how many times people use it )
  // gJa25SaveStruct.uiDisplayGunRangeCounter++;
}

function DisplayGridNoVisibleToSoldierGrid(): void {
  let sGridNo: INT16;
  //	INT8	bStance;

  GetMouseMapPos(&sGridNo);

  // Only allowed in if there is someone selected
  if (gusSelectedSoldier == NOBODY) {
    return;
  }

  // if the cursor is in a the tactical map
  if (sGridNo != NOWHERE && sGridNo != 0) {
    // if the gridno is different then the last one that was displayed
    if (sGridNo != gsLastVisibleToSoldierGridNo || MercPtrs[gusSelectedSoldier].value.sGridNo != gsLastSoldierGridNo) {
      // if the cover is currently being displayed
      if (gsLastVisibleToSoldierGridNo != NOWHERE || gsLastSoldierGridNo != NOWHERE) {
        // remove the gridnos
        RemoveVisibleGridNoAtSelectedGridNo();
      } else {
        // pop up a message to say we are in the display cover routine
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, zNewTacticalMessages[TCTL_MSG__LOS]);
        // increment the display LOS counter ( just seeing how many times people use it )
        // gJa25SaveStruct.uiDisplayLosCounter++;
      }

      gsLastVisibleToSoldierGridNo = sGridNo;
      gsLastSoldierGridNo = MercPtrs[gusSelectedSoldier].value.sGridNo;

      // Fill the array of gridno and cover values
      CalculateVisibleToSoldierAroundGridno(sGridNo, gGameSettings.ubSizeOfLOS);

      // Add the graphics to each gridno
      AddVisibleToSoldierToEachGridNo();

      // Re-render the scene!
      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }
}

function CalculateVisibleToSoldierAroundGridno(sTargetGridNo: INT16, bSearchRange: INT8): void {
  let sMaxLeft: INT16;
  let sMaxRight: INT16;
  let sMaxUp: INT16;
  let sMaxDown: INT16;
  let sXOffset: INT16;
  let sYOffset: INT16;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let sGridNo: INT16;
  let sCounterX: INT16;
  let sCounterY: INT16;
  let fRoof: BOOLEAN = FALSE;

  // clear out the struct
  memset(gVisibleToSoldierStruct, 0, sizeof(VISIBLE_TO_SOLDIER_STRUCT) * DC__SOLDIER_VISIBLE_RANGE * DC__SOLDIER_VISIBLE_RANGE);

  if (bSearchRange > (DC_MAX_COVER_RANGE / 2))
    bSearchRange = (DC_MAX_COVER_RANGE / 2);

  // determine maximum horizontal limits
  sMaxLeft = min(bSearchRange, (sTargetGridNo % MAXCOL));
  sMaxRight = min(bSearchRange, MAXCOL - ((sTargetGridNo % MAXCOL) + 1));

  // determine maximum vertical limits
  sMaxUp = min(bSearchRange, (sTargetGridNo / MAXROW));
  sMaxDown = min(bSearchRange, MAXROW - ((sTargetGridNo / MAXROW) + 1));

  pSoldier = GetCurrentMercForDisplayCover();

  sCounterX = 0;
  sCounterY = 0;

  // loop through all the gridnos that we are interested in
  for (sYOffset = -sMaxUp; sYOffset <= sMaxDown; sYOffset++) {
    sCounterX = 0;
    for (sXOffset = -sMaxLeft; sXOffset <= sMaxRight; sXOffset++) {
      sGridNo = sTargetGridNo + sXOffset + (MAXCOL * sYOffset);
      fRoof = FALSE;

      // record the gridno
      gVisibleToSoldierStruct[sCounterX][sCounterY].sGridNo = sGridNo;

      // if the gridno is NOT on screen
      if (!GridNoOnScreen(sGridNo)) {
        continue;
      }

      // is there a roof above this gridno
      if (FlatRoofAboveGridNo(sGridNo)) {
        if (IsTheRoofVisible(sGridNo) && gbWorldSectorZ == 0) {
          fRoof = TRUE;
        }

        // if wer havent explored the area yet and we are underground, dont show cover
        else if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) && gbWorldSectorZ != 0) {
          continue;
        }
      }

      /*
                              //if we are to display cover for the roofs, and there is a roof above us
                              if( gsInterfaceLevel == I_ROOF_LEVEL && !FlatRoofAboveGridNo( sGridNo ) )
                              {
                                      continue;
                              }
      */
      /*
                              // if someone (visible) is there, skip
                              //Check both bottom level, and top level
                              ubID = WhoIsThere2( sGridNo, 0 );
                              if( ubID == NOBODY )
                              {
                                      ubID = WhoIsThere2( sGridNo, 1 );
                              }
                              //if someone is here, and they are an enemy, skip over them
                              if ( ubID != NOBODY && Menptr[ ubID ].bVisible == TRUE && Menptr[ ubID ].bTeam != pSoldier->bTeam )
                              {
                                      continue;
                              }

                              //Calculate the cover for this gridno
                              gCoverRadius[ sCounterX ][ sCounterY ].bCover = CalcCoverForGridNoBasedOnTeamKnownEnemies( pSoldier, sGridNo, bStance );
      */

      gVisibleToSoldierStruct[sCounterX][sCounterY].bVisibleToSoldier = CalcIfSoldierCanSeeGridNo(pSoldier, sGridNo, fRoof);
      gVisibleToSoldierStruct[sCounterX][sCounterY].fRoof = fRoof;
      sCounterX++;
    }

    sCounterY++;
  }
}

function AddVisibleToSoldierToEachGridNo(): void {
  let uiCntX: UINT32;
  let uiCntY: UINT32;
  let bVisibleToSoldier: INT8 = 0;
  let fRoof: BOOLEAN;
  let sGridNo: INT16;

  // loop through all the gridnos
  for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
    for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
      bVisibleToSoldier = gVisibleToSoldierStruct[uiCntX][uiCntY].bVisibleToSoldier;
      if (bVisibleToSoldier == -1) {
        continue;
      }

      fRoof = gVisibleToSoldierStruct[uiCntX][uiCntY].fRoof;
      sGridNo = gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo;

      // if the soldier can easily see this gridno.  Can see all 3 positions
      if (bVisibleToSoldier == DC__SEE_3_STANCE) {
        AddCoverObjectToWorld(sGridNo, SPECIALTILE_COVER_5, fRoof);
      }

      // cant see a thing
      else if (bVisibleToSoldier == DC__SEE_NO_STANCES) {
        AddCoverObjectToWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_1, fRoof);
      }

      // can only see prone
      else if (bVisibleToSoldier == DC__SEE_1_STANCE) {
        AddCoverObjectToWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_2, fRoof);
      }

      // can see crouch or prone
      else if (bVisibleToSoldier == DC__SEE_2_STANCE) {
        AddCoverObjectToWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_3, fRoof);
      }

      else {
        Assert(0);
      }
    }
  }
}

function RemoveVisibleGridNoAtSelectedGridNo(): void {
  let uiCntX: UINT32;
  let uiCntY: UINT32;
  let bVisibleToSoldier: INT8;
  let sGridNo: INT16;
  let fRoof: BOOLEAN;

  // make sure to only remove it when its right
  if (gsLastVisibleToSoldierGridNo == NOWHERE) {
    return;
  }

  // loop through all the gridnos
  for (uiCntY = 0; uiCntY < DC_MAX_COVER_RANGE; uiCntY++) {
    for (uiCntX = 0; uiCntX < DC_MAX_COVER_RANGE; uiCntX++) {
      bVisibleToSoldier = gVisibleToSoldierStruct[uiCntX][uiCntY].bVisibleToSoldier;
      fRoof = gVisibleToSoldierStruct[uiCntX][uiCntY].fRoof;
      sGridNo = gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo;

      // if there is a valid cover at this gridno
      if (bVisibleToSoldier == DC__SEE_3_STANCE) {
        RemoveCoverObjectFromWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_5, fRoof);
      }

      // cant see a thing
      else if (bVisibleToSoldier == DC__SEE_NO_STANCES) {
        RemoveCoverObjectFromWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_1, fRoof);
      }

      // can only see prone
      else if (bVisibleToSoldier == DC__SEE_1_STANCE) {
        RemoveCoverObjectFromWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_2, fRoof);
      }

      // can see crouch or prone
      else if (bVisibleToSoldier == DC__SEE_2_STANCE) {
        RemoveCoverObjectFromWorld(gVisibleToSoldierStruct[uiCntX][uiCntY].sGridNo, SPECIALTILE_COVER_3, fRoof);
      }

      else {
        Assert(0);
      }
    }
  }

  // Re-render the scene!
  SetRenderFlags(RENDER_FLAG_FULL);

  gsLastVisibleToSoldierGridNo = NOWHERE;
  gsLastSoldierGridNo = NOWHERE;
}

function CalcIfSoldierCanSeeGridNo(pSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16, fRoof: BOOLEAN): INT8 {
  let bRetVal: INT8 = 0;
  let iLosForGridNo: INT32 = 0;
  let usSightLimit: UINT16 = 0;
  let pPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let ubID: UINT8;
  let bAware: BOOLEAN = FALSE;

  if (fRoof) {
    ubID = WhoIsThere2(sTargetGridNo, 1);
  } else {
    ubID = WhoIsThere2(sTargetGridNo, 0);
  }

  if (ubID != NOBODY) {
    pPersOL = &(pSoldier.value.bOppList[ubID]);
    pbPublOL = &(gbPublicOpplist[pSoldier.value.bTeam][ubID]);

    // if soldier is known about (SEEN or HEARD within last few turns)
    if (*pPersOL || *pbPublOL) {
      bAware = TRUE;
    }
  }

  usSightLimit = DistanceVisible(pSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, sTargetGridNo, fRoof);

  //
  // Prone
  //
  iLosForGridNo = SoldierToVirtualSoldierLineOfSightTest(pSoldier, sTargetGridNo, fRoof, ANIM_PRONE, usSightLimit, bAware);
  if (iLosForGridNo != 0) {
    bRetVal++;
  }

  //
  // Crouch
  //
  iLosForGridNo = SoldierToVirtualSoldierLineOfSightTest(pSoldier, sTargetGridNo, fRoof, ANIM_CROUCH, usSightLimit, bAware);
  if (iLosForGridNo != 0) {
    bRetVal++;
  }

  //
  // Standing
  //
  iLosForGridNo = SoldierToVirtualSoldierLineOfSightTest(pSoldier, sTargetGridNo, fRoof, ANIM_STAND, usSightLimit, bAware);
  if (iLosForGridNo != 0) {
    bRetVal++;
  }

  return bRetVal;
}

function IsTheRoofVisible(sGridNo: INT16): BOOLEAN {
  let ubRoom: UINT8;

  if (InARoom(sGridNo, &ubRoom)) {
    if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) {
      if (gTacticalStatus.uiFlags & SHOW_ALL_ROOFS)
        return TRUE;
      else
        return FALSE;
    } else {
      return TRUE;
    }
  }

  return FALSE;
}

function ChangeSizeOfDisplayCover(iNewSize: INT32): void {
  // if the new size is smaller or greater, scale it
  if (iNewSize < DC__MIN_SIZE) {
    iNewSize = DC__MIN_SIZE;
  } else if (iNewSize > DC__MAX_SIZE) {
    iNewSize = DC__MAX_SIZE;
  }

  // Set new size
  gGameSettings.ubSizeOfDisplayCover = iNewSize;

  // redisplay the cover
  RemoveCoverOfSelectedGridNo();
  DisplayCoverOfSelectedGridNo();
}

function ChangeSizeOfLOS(iNewSize: INT32): void {
  // if the new size is smaller or greater, scale it
  if (iNewSize < DC__MIN_SIZE) {
    iNewSize = DC__MIN_SIZE;
  } else if (iNewSize > DC__MAX_SIZE) {
    iNewSize = DC__MAX_SIZE;
  }

  // Set new size
  gGameSettings.ubSizeOfLOS = iNewSize;

  // ReDisplay the los
  RemoveVisibleGridNoAtSelectedGridNo();
  DisplayGridNoVisibleToSoldierGrid();
}
