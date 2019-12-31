namespace ja2 {

const NO_JUMP = 0;
const MAX_ANIFRAMES_PER_FLASH = 2;
//#define		TIME_FOR_RANDOM_ANIM_CHECK	10
const TIME_FOR_RANDOM_ANIM_CHECK = 2;

export let gfLastMercTalkedAboutKillingID: UINT8 /* boolean */ = NOBODY;

let gHopFenceForwardSEDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  2.2,
  0.7,
  3.2,
  0.7,
];
let gHopFenceForwardNWDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  2.7,
  1.0,
  2.7,
  1.0,
];
let gHopFenceForwardFullSEDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  1.1,
  1.0,
  2.1,
  1.1,
];
let gHopFenceForwardFullNWDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  0.8,
  0.2,
  2.7,
  0.8,
];
let gFalloffBackwardsDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  1,
  0.8,
  1,
  1,
];
let gClimbUpRoofDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  2,
  0.1,
  2,
  2,
];
let gClimbUpRoofLATDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  0.7,
  0.5,
  0.7,
  0.5,
];
let gClimbDownRoofStartDist: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  5.0,
  1.0,
  1,
  1,
];
let gClimbUpRoofDistGoingLower: DOUBLE[] /* [NUMSOLDIERBODYTYPES] */ = [
  0.9,
  0.1,
  1,
  1,
];

/* static */ let AdjustToNextAnimationFrame__uiJumpAddress: UINT32 = NO_JUMP;
export function AdjustToNextAnimationFrame(pSoldier: SOLDIERTYPE): boolean {
  let SFireWeapon: EV_S_FIREWEAPON = createEvSFireWeapon();

  let sNewAniFrame: UINT16;
  let anAniFrame: UINT16;
  let ubCurrentHeight: INT8;
  let usOldAnimState: UINT16;
  let sNewGridNo: INT16;
  let sX: INT16;
  let sY: INT16;
  let fStop: boolean;
  let cnt: UINT32;
  let ubDiceRoll: UINT8; // Percentile dice roll
  let ubRandomHandIndex: UINT8; // Index value into random animation table to use base don what is in the guys hand...
  let usItem: UINT16;
  let pAnimDef: RANDOM_ANI_DEF;
  let ubNewDirection: UINT8 = 0;
  let ubDesiredHeight: UINT8;
  let bOKFireWeapon: UINT8 /* boolean */;
  let bWeaponJammed: UINT8 /* boolean */;
  let fFreeUpAttacker: boolean = false;
  let usUIMovementMode: UINT16;

  do {
    // Get new frame code
    sNewAniFrame = gusAnimInst[pSoldier.usAnimState][pSoldier.usAniCode];

    // Handle muzzel flashes
    if (pSoldier.bMuzFlashCount > 0) {
      // FLash for about 3 frames
      if (pSoldier.bMuzFlashCount > MAX_ANIFRAMES_PER_FLASH) {
        pSoldier.bMuzFlashCount = 0;
        if (pSoldier.iMuzFlash != -1) {
          LightSpriteDestroy(pSoldier.iMuzFlash);
          pSoldier.iMuzFlash = -1;
        }
      } else {
        pSoldier.bMuzFlashCount++;
      }
    }

    if (pSoldier.bBreathCollapsed) {
      // ATE: If we have fallen, and we can't get up... no
      // really, if we were told to collapse but have been hit after, don't
      // do anything...
      if (gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_HITSTOP | ANIM_HITFINISH)) {
        pSoldier.bBreathCollapsed = false;
      } else if (pSoldier.bLife == 0) {
        // Death takes precedence...
        pSoldier.bBreathCollapsed = false;
      } else if (pSoldier.usPendingAnimation == Enum193.FALLFORWARD_ROOF || pSoldier.usPendingAnimation == Enum193.FALLOFF || pSoldier.usAnimState == Enum193.FALLFORWARD_ROOF || pSoldier.usAnimState == Enum193.FALLOFF) {
        pSoldier.bBreathCollapsed = false;
      } else {
        // Wait here until we are free....
        if (!pSoldier.fInNonintAnim) {
          // UNset UI
          UnSetUIBusy(pSoldier.ubID);

          SoldierCollapse(pSoldier);

          pSoldier.bBreathCollapsed = false;

          return true;
        }
      }
    }

    // Check for special code
    if (sNewAniFrame < 399) {
      // Adjust / set true ani frame
      // Use -1 because ani files are 1-based, these are 0-based
      ConvertAniCodeToAniFrame(pSoldier, (sNewAniFrame - 1));

      // Adjust frame control pos, and try again
      pSoldier.usAniCode++;
      break;
    } else if (sNewAniFrame < 500) {
      // Switch on special code
      switch (sNewAniFrame) {
        case 402:

          // DO NOT MOVE FOR THIS FRAME
          pSoldier.fPausedMove = true;
          break;

        case 403:

          // MOVE GUY FORWARD SOME VALUE
          MoveMercFacingDirection(pSoldier, false, 0.7);

          break;

        case 404:

          // MOVE GUY BACKWARD SOME VALUE
          // Use same function as forward, but is -ve values!
          MoveMercFacingDirection(pSoldier, true, 1);
          break;

        case 405:

          return true;

        case 406:

          // Move merc up
          if (pSoldier.bDirection == Enum245.NORTH) {
            SetSoldierHeight(pSoldier, (pSoldier.sHeightAdjustment + 2));
          } else {
            SetSoldierHeight(pSoldier, (pSoldier.sHeightAdjustment + 3));
          }
          break;

        case 408:

          // CODE: SPECIAL MOVE CLIMB UP ROOF EVENT

          // re-enable sight
          gTacticalStatus.uiFlags &= (~DISALLOW_SIGHT);
          {
            let sXPos: INT16 = 0;
            let sYPos: INT16 = 0;

            // usNewGridNo = NewGridNo( (UINT16)pSoldier->sGridNo, (UINT16)DirectionInc( pSoldier->bDirection ) );
            ConvertMapPosToWorldTileCenter(pSoldier.sTempNewGridNo, createPointer(() => sXPos, (v) => sXPos = v), createPointer(() => sYPos, (v) => sYPos = v));
            EVENT_SetSoldierPosition(pSoldier, sXPos, sYPos);
          }
          // Move two CC directions
          EVENT_SetSoldierDirection(pSoldier, gTwoCCDirection[pSoldier.bDirection]);

          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

          // Set desired anim height!
          pSoldier.ubDesiredHeight = ANIM_CROUCH;

          // Move merc up specific height
          SetSoldierHeight(pSoldier, 50);

          // ATE: Change interface level.....
          // CJC: only if we are a player merc
          if (pSoldier.bTeam == gbPlayerNum) {
            if (gTacticalStatus.fAutoBandageMode) {
              // in autobandage, handle as AI, but add roof marker too
              FreeUpNPCFromRoofClimb(pSoldier);
              HandlePlacingRoofMarker(pSoldier, pSoldier.sGridNo, true, true);
            } else {
              // OK, UNSET INTERFACE FIRST
              UnSetUIBusy(pSoldier.ubID);

              if (pSoldier.ubID == gusSelectedSoldier) {
                ChangeInterfaceLevel(1);
              }
              HandlePlacingRoofMarker(pSoldier, pSoldier.sGridNo, true, true);
            }
          } else {
            FreeUpNPCFromRoofClimb(pSoldier);
          }

          // ATE: Handle sight...
          HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO | SIGHT_INTERRUPT);
          break;

        case 409:

          // CODE: MOVE DOWN
          SetSoldierHeight(pSoldier, (pSoldier.sHeightAdjustment - 2));
          break;

        case 410:

          // Move merc down specific height
          SetSoldierHeight(pSoldier, 0);
          break;

        case 411:

          // CODE: SPECIALMOVE CLIMB DOWN EVENT
          // Move two C directions
          EVENT_SetSoldierDirection(pSoldier, gTwoCDirection[pSoldier.bDirection]);

          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);
          // Adjust height
          SetSoldierHeight(pSoldier, gClimbDownRoofStartDist[pSoldier.ubBodyType]);
          // Adjust position
          MoveMercFacingDirection(pSoldier, true, 3.5);
          break;

        case 412:

          // CODE: HANDLING PRONE DOWN - NEED TO MOVE GUY BACKWARDS!
          MoveMercFacingDirection(pSoldier, false, .2);
          break;

        case 413:

          // CODE: HANDLING PRONE UP - NEED TO MOVE GUY FORWARDS!
          MoveMercFacingDirection(pSoldier, true, .2);
          break;

        case 430:

          // SHOOT GUN
          // MAKE AN EVENT, BUT ONLY DO STUFF IF WE OWN THE GUY!
          SFireWeapon.usSoldierID = pSoldier.ubID;
          SFireWeapon.uiUniqueId = pSoldier.uiUniqueSoldierIdValue;
          SFireWeapon.sTargetGridNo = pSoldier.sTargetGridNo;
          SFireWeapon.bTargetLevel = pSoldier.bTargetLevel;
          SFireWeapon.bTargetCubeLevel = pSoldier.bTargetCubeLevel;
          AddGameEvent(Enum319.S_FIREWEAPON, 0, SFireWeapon);
          break;

        case 431:

          // FLASH FRAME WHITE
          pSoldier.pForcedShade = White16BPPPalette;
          break;

        case 432:

          // PLAY RANDOM IMPACT SOUND!
          //	PlayJA2Sample( (UINT8)( BULLET_IMPACT_1 + Random(3) ), RATE_11025, MIDVOLUME, 1, MIDDLEPAN );

          // PLAY RANDOM GETTING HIT SOUND
          //	DoMercBattleSound( pSoldier, BATTLE_SOUND_HIT1 );

          break;

        case 433:

          // CODE: GENERIC HIT!

          CheckForAndHandleSoldierIncompacitated(pSoldier);

          break;

        case 434:

          // JUMP TO ANOTHER ANIMATION ( BLOOD ) IF WE WANT BLOOD
          AdjustToNextAnimationFrame__uiJumpAddress = pSoldier.usAnimState;
          ChangeSoldierState(pSoldier, Enum193.FLYBACK_HIT_BLOOD_STAND, 0, false);
          return true;
          break;

        case 435:

          // HOOK FOR A RETURN JUMP
          break;

        case 436:

          // Loop through script to find entry address
          if (AdjustToNextAnimationFrame__uiJumpAddress == NO_JUMP) {
            break;
          }
          usOldAnimState = pSoldier.usAnimState;
          pSoldier.usAniCode = 0;

          do {
            // Get new frame code
            anAniFrame = gusAnimInst[AdjustToNextAnimationFrame__uiJumpAddress][pSoldier.usAniCode];

            if (anAniFrame == 435) {
              // START PROCESSING HERE
              ChangeSoldierState(pSoldier, AdjustToNextAnimationFrame__uiJumpAddress, pSoldier.usAniCode, false);
              return true;
            }
            // Adjust frame control pos, and try again
            pSoldier.usAniCode++;
          } while (anAniFrame != 999);

          AdjustToNextAnimationFrame__uiJumpAddress = NO_JUMP;

          if (anAniFrame == 999) {
            // Fail jump, re-load old anim
            ChangeSoldierState(pSoldier, usOldAnimState, 0, false);
            return true;
          }
          break;

        case 437:

          // CHANGE DIRECTION AND GET-UP
          // sGridNo = NewGridNo( (UINT16)pSoldier->sGridNo, (UINT16)(-1 * DirectionInc( pSoldier->bDirection ) ) );
          // ConvertMapPosToWorldTileCenter( pSoldier->sGridNo, &sXPos, &sYPos );
          // SetSoldierPosition( pSoldier, (FLOAT)sXPos, (FLOAT)sYPos );

          // Reverse direction
          EVENT_SetSoldierDirection(pSoldier, gOppositeDirection[pSoldier.bDirection]);
          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

          ChangeSoldierState(pSoldier, Enum193.GETUP_FROM_ROLLOVER, 0, false);
          return true;

        case 438:

          // CODE: START HOLD FLASH
          pSoldier.fForceShade = true;
          break;

        case 439:

          // CODE: END HOLD FLASH
          pSoldier.fForceShade = false;
          break;

        case 440:
          // CODE: Set buddy as dead!
          {
            let fMadeCorpse: boolean = false;

            // ATE: Piggyback here on stopping the burn sound...
            if (pSoldier.usAnimState == Enum193.CHARIOTS_OF_FIRE || pSoldier.usAnimState == Enum193.BODYEXPLODING) {
              SoundStop(pSoldier.uiPendingActionData1);
            }

            CheckForAndHandleSoldierDeath(pSoldier, createPointer(() => fMadeCorpse, (v) => fMadeCorpse = v));

            if (fMadeCorpse) {
              return false;
            } else {
              return true;
            }
          }
          break;

        case 441:
          // CODE: Show mussel flash
          if (pSoldier.bVisible == -1) {
            break;
          }

          // DO ONLY IF WE'RE AT A GOOD LEVEL
          if (ubAmbientLightLevel < MIN_AMB_LEVEL_FOR_MERC_LIGHTS) {
            break;
          }

          if ((pSoldier.iMuzFlash = LightSpriteCreate("L-R03.LHT", 0)) == (-1)) {
            return true;
          }

          LightSpritePower(pSoldier.iMuzFlash, true);
          // Get one move forward
          {
            let usNewGridNo: UINT16;
            let sXPos: INT16;
            let sYPos: INT16;

            usNewGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(pSoldier.bDirection));
            ({ sX: sXPos, sY: sYPos } = ConvertGridNoToCenterCellXY(usNewGridNo));
            LightSpritePosition(pSoldier.iMuzFlash, Math.trunc(sXPos / CELL_X_SIZE), Math.trunc(sYPos / CELL_Y_SIZE));

            // Start count
            pSoldier.bMuzFlashCount = 1;
          }
          break;

        case 442:

          // CODE: FOR A NON-INTERRUPTABLE SCRIPT - SIGNAL DONE
          pSoldier.fInNonintAnim = false;

          // ATE: if it's the begin cower animation, unset ui, cause it could
          // be from player changin stance
          if (pSoldier.usAnimState == Enum193.START_COWER) {
            UnSetUIBusy(pSoldier.ubID);
          }
          break;

        case 443:

          // MOVE GUY FORWARD FOR FENCE HOP ANIMATION
          switch (pSoldier.bDirection) {
            case Enum245.SOUTH:
            case Enum245.EAST:

              MoveMercFacingDirection(pSoldier, false, gHopFenceForwardSEDist[pSoldier.ubBodyType]);
              break;

            case Enum245.NORTH:
            case Enum245.WEST:
              MoveMercFacingDirection(pSoldier, false, gHopFenceForwardNWDist[pSoldier.ubBodyType]);
              break;
          }
          break;

        case 444:

          // CODE: End Hop Fence
          // MOVE TO FORCASTED GRIDNO
          sX = CenterX(pSoldier.sForcastGridno);
          sY = CenterY(pSoldier.sForcastGridno);

          EVENT_InternalSetSoldierPosition(pSoldier, sX, sY, false, false, false);
          EVENT_SetSoldierDirection(pSoldier, gTwoCDirection[pSoldier.bDirection]);
          pSoldier.sZLevelOverride = -1;
          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

          if (gTacticalStatus.bBoxingState == Enum247.BOXING_WAITING_FOR_PLAYER || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING || gTacticalStatus.bBoxingState == Enum247.BOXING) {
            BoxingMovementCheck(pSoldier);
          }

          if (SetOffBombsInGridNo(pSoldier.ubID, pSoldier.sGridNo, false, pSoldier.bLevel)) {
            EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);
            return true;
          }

          // If we are at our final destination, goto stance of our movement stance...
          // Only in realtime...
          // if ( !( gTacticalStatus.uiFlags & INCOMBAT ) )
          // This has to be here to make guys continue along fence path
          if (pSoldier.sGridNo == pSoldier.sFinalDestination) {
            if (gAnimControl[pSoldier.usAnimState].ubEndHeight != gAnimControl[pSoldier.usUIMovementMode].ubEndHeight) {
              // Goto Stance...
              pSoldier.fDontChargeAPsForStanceChange = true;
              ChangeSoldierStance(pSoldier, gAnimControl[pSoldier.usUIMovementMode].ubEndHeight);
              return true;
            } else {
              SoldierGotoStationaryStance(pSoldier);

              // Set UI Busy
              UnSetUIBusy(pSoldier.ubID);
              return true;
            }
          }
          break;

        case 445:

          // CODE: MOVE GUY FORWARD ONE TILE, BASED ON WHERE WE ARE FACING
          switch (pSoldier.bDirection) {
            case Enum245.SOUTH:
            case Enum245.EAST:

              MoveMercFacingDirection(pSoldier, false, gHopFenceForwardFullSEDist[pSoldier.ubBodyType]);
              break;

            case Enum245.NORTH:
            case Enum245.WEST:

              MoveMercFacingDirection(pSoldier, false, gHopFenceForwardFullNWDist[pSoldier.ubBodyType]);
              break;
          }
          break;

        case 446:

          // CODE: Turn pause move flag on
          pSoldier.uiStatusFlags |= SOLDIER_PAUSEANIMOVE;
          break;

        case 447:

          // TRY TO FALL!!!
          if (pSoldier.fTryingToFall) {
            let sLastAniFrame: INT16;

            // TRY FORWARDS...
            // FIRST GRIDNO
            sNewGridNo = NewGridNo(pSoldier.sGridNo, (DirectionInc(pSoldier.bDirection)));

            if (OKFallDirection(pSoldier, sNewGridNo, pSoldier.bLevel, pSoldier.bDirection, Enum193.FALLFORWARD_HITDEATH_STOP)) {
              // SECOND GRIDNO
              // sNewGridNo = NewGridNo( (UINT16)sNewGridNo, (UINT16)( DirectionInc( pSoldier->bDirection ) ) );

              // if ( OKFallDirection( pSoldier, sNewGridNo, pSoldier->bLevel, pSoldier->bDirection, FALLFORWARD_HITDEATH_STOP ) )
              {
                // ALL'S OK HERE...
                pSoldier.fTryingToFall = false;
                break;
              }
            }

            // IF HERE, INCREMENT DIRECTION
            // ATE: Added Feb1 - can be either direction....
            if (pSoldier.fFallClockwise) {
              EVENT_SetSoldierDirection(pSoldier, gOneCDirection[pSoldier.bDirection]);
            } else {
              EVENT_SetSoldierDirection(pSoldier, gOneCCDirection[pSoldier.bDirection]);
            }
            EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);
            sLastAniFrame = gusAnimInst[pSoldier.usAnimState][(pSoldier.usAniCode - 2)];
            ConvertAniCodeToAniFrame(pSoldier, (sLastAniFrame));

            if (pSoldier.bDirection == pSoldier.bStartFallDir) {
              // GO FORWARD HERE...
              pSoldier.fTryingToFall = false;
              break;
              ;
            }
            // IF HERE, RETURN SO WE DONOT INCREMENT DIR
            return true;
          }
          break;

        case 448:

          // CODE: HANDLE BURST
          // FIRST CHECK IF WE'VE REACHED MAX FOR GUN
          fStop = false;

          if (pSoldier.bDoBurst > Weapon[pSoldier.usAttackingWeapon].ubShotsPerBurst) {
            fStop = true;
            fFreeUpAttacker = true;
          }

          // CHECK IF WE HAVE AMMO LEFT, IF NOT, END ANIMATION!
          if (!EnoughAmmo(pSoldier, false, pSoldier.ubAttackingHand)) {
            fStop = true;
            fFreeUpAttacker = true;
            if (pSoldier.bTeam == gbPlayerNum) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.BURST_FIRE_DEPLETED_CLIP_STR]);
            }
          } else if (pSoldier.bDoBurst == 1) {
            // CHECK FOR GUN JAM
            bWeaponJammed = CheckForGunJam(pSoldier);
            if (bWeaponJammed == 1) {
              fStop = true;
              fFreeUpAttacker = true;
              // stop shooting!
              pSoldier.bBulletsLeft = 0;

              // OK, Stop burst sound...
              if (pSoldier.iBurstSoundID != NO_SAMPLE) {
                SoundStop(pSoldier.iBurstSoundID);
              }

              if (pSoldier.bTeam == gbPlayerNum) {
                PlayJA2Sample(Enum330.S_DRYFIRE1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
                // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, L"Gun jammed!" );
              }

              DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker - aborting start of attack due to burst gun jam"));
              FreeUpAttacker(pSoldier.ubID);
            } else if (bWeaponJammed == 255) {
              // Play intermediate animation...
              if (HandleUnjamAnimation(pSoldier)) {
                return true;
              }
            }
          }

          if (fStop) {
            pSoldier.fDoSpread = 0;
            pSoldier.bDoBurst = 1;
            //						pSoldier->fBurstCompleted = TRUE;
            if (fFreeUpAttacker) {
              //							DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - aborting start of attack") );
              //							FreeUpAttacker( pSoldier->ubID );
            }

            // ATE; Reduce it due to animation being stopped...
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker - Burst animation ended"));
            ReduceAttackBusyCount(pSoldier.ubID, false);

            if (CheckForImproperFireGunEnd(pSoldier)) {
              return true;
            }

            // END: GOTO AIM STANCE BASED ON HEIGHT
            // If we are a robot - we need to do stuff different here
            if (AM_A_ROBOT(pSoldier)) {
              ChangeSoldierState(pSoldier, Enum193.STANDING, 0, false);
            } else {
              switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
                case ANIM_STAND:
                  ChangeSoldierState(pSoldier, Enum193.AIM_RIFLE_STAND, 0, false);
                  break;

                case ANIM_PRONE:
                  ChangeSoldierState(pSoldier, Enum193.AIM_RIFLE_PRONE, 0, false);
                  break;

                case ANIM_CROUCH:
                  ChangeSoldierState(pSoldier, Enum193.AIM_RIFLE_CROUCH, 0, false);
                  break;
              }
            }
            return true;
          }

          // MOVETO CURRENT SPREAD LOCATION
          if (pSoldier.fDoSpread) {
            if (pSoldier.sSpreadLocations[pSoldier.fDoSpread - 1] != 0) {
              EVENT_SetSoldierDirection(pSoldier, GetDirectionToGridNoFromGridNo(pSoldier.sGridNo, pSoldier.sSpreadLocations[pSoldier.fDoSpread - 1]));
              EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);
            }
          }
          break;

        case 449:

          // CODE: FINISH BURST
          pSoldier.fDoSpread = 0;
          pSoldier.bDoBurst = 1;
          //				pSoldier->fBurstCompleted = TRUE;
          break;

        case 450:

          // CODE: BEGINHOPFENCE
          // MOVE TWO FACGIN GRIDNOS
          sNewGridNo = NewGridNo(pSoldier.sGridNo, (DirectionInc(pSoldier.bDirection)));
          sNewGridNo = NewGridNo(sNewGridNo, (DirectionInc(pSoldier.bDirection)));
          pSoldier.sForcastGridno = sNewGridNo;
          break;

        case 451:

          // CODE: MANAGE START z-buffer override
          switch (pSoldier.bDirection) {
            case Enum245.NORTH:
            case Enum245.WEST:

              pSoldier.sZLevelOverride = TOPMOST_Z_LEVEL;
              break;
          }
          break;

        case 452:

          // CODE: MANAGE END z-buffer override
          switch (pSoldier.bDirection) {
            case Enum245.SOUTH:
            case Enum245.EAST:

              pSoldier.sZLevelOverride = TOPMOST_Z_LEVEL;
              break;

            case Enum245.NORTH:
            case Enum245.WEST:

              pSoldier.sZLevelOverride = -1;
              break;
          }
          break;

        case 453:

          // CODE: FALLOFF ROOF ( BACKWARDS ) - MOVE BACK SOME!
          // Use same function as forward, but is -ve values!
          MoveMercFacingDirection(pSoldier, true, gFalloffBackwardsDist[pSoldier.ubBodyType]);
          break;

        case 454:

          // CODE: HANDLE CLIMBING ROOF,
          // Move merc up
          if (pSoldier.bDirection == Enum245.NORTH) {
            SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment + gClimbUpRoofDist[pSoldier.ubBodyType]));
          } else {
            SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment + gClimbUpRoofDist[pSoldier.ubBodyType]));
          }
          break;

        case 455:

          // MOVE GUY FORWARD SOME VALUE
          MoveMercFacingDirection(pSoldier, false, gClimbUpRoofLATDist[pSoldier.ubBodyType]);

          // MOVE DOWN SOME VALUE TOO!
          SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment - gClimbUpRoofDistGoingLower[pSoldier.ubBodyType]));

          break;

        case 456:

          // CODE: HANDLE CLIMBING ROOF,
          // Move merc DOWN
          if (pSoldier.bDirection == Enum245.NORTH) {
            SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment - gClimbUpRoofDist[pSoldier.ubBodyType]));
          } else {
            SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment - gClimbUpRoofDist[pSoldier.ubBodyType]));
          }
          break;

        case 457:

          // CODE: CHANGCE STANCE TO STANDING
          SendChangeSoldierStanceEvent(pSoldier, ANIM_STAND);
          break;

        case 459:

          // CODE: CHANGE ATTACKING TO FIRST HAND
          pSoldier.ubAttackingHand = Enum261.HANDPOS;
          pSoldier.usAttackingWeapon = pSoldier.inv[pSoldier.ubAttackingHand].usItem;
          // Adjust fReloading to FALSE
          pSoldier.fReloading = false;
          break;

        case 458:

          // CODE: CHANGE ATTACKING TO SECOND HAND
          pSoldier.ubAttackingHand = Enum261.SECONDHANDPOS;
          pSoldier.usAttackingWeapon = pSoldier.inv[pSoldier.ubAttackingHand].usItem;
          // Adjust fReloading to FALSE
          pSoldier.fReloading = false;
          break;

        case 460:
        case 461:

          // CODE: THORW ITEM
          // Launch ITem!
          if (pSoldier.pTempObject != null && pSoldier.pThrowParams != null) {
            // ATE: If we are armmed...
            if (pSoldier.pThrowParams.ubActionCode == Enum258.THROW_ARM_ITEM) {
              // ATE: Deduct points!
              DeductPoints(pSoldier, MinAPsToThrow(pSoldier, pSoldier.sTargetGridNo, 0), 0);
            } else {
              // ATE: Deduct points!
              DeductPoints(pSoldier, AP_TOSS_ITEM, 0);
            }

            CreatePhysicalObject(pSoldier.pTempObject, pSoldier.pThrowParams.dLifeSpan, pSoldier.pThrowParams.dX, pSoldier.pThrowParams.dY, pSoldier.pThrowParams.dZ, pSoldier.pThrowParams.dForceX, pSoldier.pThrowParams.dForceY, pSoldier.pThrowParams.dForceZ, pSoldier.ubID, pSoldier.pThrowParams.ubActionCode, pSoldier.pThrowParams.uiActionData);

            // Remove object
            // RemoveObjFrom( &(pSoldier->inv[ HANDPOS ] ), 0 );

            // Update UI
            DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

            pSoldier.pTempObject = null;

            pSoldier.pThrowParams = null;
          }
          break;

        case 462:

          // CODE: MOVE UP FROM CLIFF CLIMB
          pSoldier.dHeightAdjustment += 2.1;
          pSoldier.sHeightAdjustment = pSoldier.dHeightAdjustment;
          // Move over some...
          // MoveMercFacingDirection( pSoldier , FALSE, (FLOAT)0.5 );
          break;

        case 463:

          // MOVE GUY FORWARD SOME VALUE
          // Creature move
          MoveMercFacingDirection(pSoldier, false, 1.5);
          break;

        case 464:

          // CODE: END CLIFF CLIMB
          pSoldier.dHeightAdjustment = 0;
          pSoldier.sHeightAdjustment = pSoldier.dHeightAdjustment;

          // Set new gridno
          {
            let sTempGridNo: INT16;
            let sNewX: INT16;
            let sNewY: INT16;

            // Get Next GridNo;
            sTempGridNo = NewGridNo(pSoldier.sGridNo, (DirectionInc(pSoldier.bDirection)));

            // Get center XY
            ({ sX: sNewX, sY: sNewY } = ConvertGridNoToCenterCellXY(sTempGridNo));

            // Set position
            EVENT_SetSoldierPosition(pSoldier, sNewX, sNewY);

            // Move two CC directions
            EVENT_SetSoldierDirection(pSoldier, gTwoCCDirection[pSoldier.bDirection]);
            EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

            // Set desired anim height!
            pSoldier.ubDesiredHeight = ANIM_CROUCH;
            pSoldier.sFinalDestination = pSoldier.sGridNo;
          }
          break;

        case 465:

          // CODE: SET GUY TO LIFE OF 0
          pSoldier.bLife = 0;
          break;

        case 466:

          // CODE: ADJUST TO OUR DEST HEIGHT
          if (pSoldier.sHeightAdjustment != pSoldier.sDesiredHeight) {
            let sDiff: INT16 = pSoldier.sHeightAdjustment - pSoldier.sDesiredHeight;

            if (Math.abs(sDiff) > 4) {
              if (sDiff > 0) {
                // Adjust!
                SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment - 2));
              } else {
                // Adjust!
                SetSoldierHeight(pSoldier, (pSoldier.dHeightAdjustment + 2));
              }
            } else {
              // Adjust!
              SetSoldierHeight(pSoldier, (pSoldier.sDesiredHeight));
            }
          } else {
            // Goto eating animation
            if (pSoldier.sDesiredHeight == 0) {
              ChangeSoldierState(pSoldier, Enum193.CROW_EAT, 0, false);
            } else {
              // We should leave now!
              TacticalRemoveSoldier(pSoldier.ubID);
              return false;
            }
            return true;
          }
          break;

        case 467:

          /// CODE: FOR HELIDROP, SET DIRECTION
          EVENT_SetSoldierDirection(pSoldier, Enum245.EAST);
          EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);

          gfIngagedInDrop = false;

          // OK, now get a sweetspot ( not the place we are now! )
          //	sNewGridNo =  FindGridNoFromSweetSpotExcludingSweetSpot( pSoldier, pSoldier->sGridNo, 5, &ubNewDirection );
          // sNewGridNo =  FindRandomGridNoFromSweetSpotExcludingSweetSpot( pSoldier, pSoldier->sGridNo, 3, &ubNewDirection );

          sNewGridNo = FindGridNoFromSweetSpotExcludingSweetSpotInQuardent(pSoldier, pSoldier.sGridNo, 3, createPointer(() => ubNewDirection, (v) => ubNewDirection = v), Enum245.SOUTHEAST);

          // Check for merc arrives quotes...
          HandleMercArrivesQuotes(pSoldier);

          // Find a path to it!
          EVENT_GetNewSoldierPath(pSoldier, sNewGridNo, Enum193.WALKING);

          return true;
          break;

        case 468:

          // CODE: End PUNCH
          {
            let fNPCPunch: boolean = false;

            // ATE: Put some code in for NPC punches...
            if (pSoldier.uiStatusFlags & SOLDIER_NPC_DOING_PUNCH) {
              fNPCPunch = true;

              // Turn off
              pSoldier.uiStatusFlags &= (~SOLDIER_NPC_DOING_PUNCH);

              // Trigger approach...
              TriggerNPCWithGivenApproach(pSoldier.ubProfile, pSoldier.uiPendingActionData4, false);
            }

            // Are we a martial artist?
            {
              let fMartialArtist: boolean = false;

              if (pSoldier.ubProfile != NO_PROFILE) {
                if (gMercProfiles[pSoldier.ubProfile].bSkillTrait == Enum269.MARTIALARTS || gMercProfiles[pSoldier.ubProfile].bSkillTrait2 == Enum269.MARTIALARTS) {
                  fMartialArtist = true;
                }
              }

              if (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_CROUCH) {
                if (fNPCPunch) {
                  ChangeSoldierStance(pSoldier, ANIM_STAND);
                  return true;
                } else {
                  ChangeSoldierState(pSoldier, Enum193.CROUCHING, 0, false);
                  return true;
                }
              } else {
                if (fMartialArtist && !AreInMeanwhile()) {
                  ChangeSoldierState(pSoldier, Enum193.NINJA_BREATH, 0, false);
                  return true;
                } else {
                  ChangeSoldierState(pSoldier, Enum193.PUNCH_BREATH, 0, false);
                  return true;
                }
              }
            }
          }
          break;

        case 469:

          // CODE: Begin martial artist attack
          DoNinjaAttack(pSoldier);
          return true;
          break;

        case 470:

          // CODE: CHECK FOR OK WEAPON SHOT!
          bOKFireWeapon = OKFireWeapon(pSoldier);

          if (bOKFireWeapon == 0) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Fire Weapon: Gun Cannot fire, code 470"));

            // OK, SKIP x # OF FRAMES
            // Skip 3 frames, ( a third ia added at the end of switch.. ) For a total of 4
            pSoldier.usAniCode += 4;

            // Reduce by a bullet...
            pSoldier.bBulletsLeft--;

            PlayJA2Sample(Enum330.S_DRYFIRE1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

            // Free-up!
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker - gun failed to fire"));
            FreeUpAttacker(pSoldier.ubID);
          } else if (bOKFireWeapon == 255) {
            // Play intermediate animation...
            if (HandleUnjamAnimation(pSoldier)) {
              return true;
            }
          }
          break;

        case 471:

          // CODE: Turn pause move flag off
          pSoldier.uiStatusFlags &= (~SOLDIER_PAUSEANIMOVE);
          break;

        case 472:

        {
          let fGoBackToAimAfterHit: boolean;

          // Save old flag, then reset. If we do nothing special here, at least go back
          // to aim if we were.
          fGoBackToAimAfterHit = pSoldier.fGoBackToAimAfterHit;
          pSoldier.fGoBackToAimAfterHit = false;

          if (!(pSoldier.uiStatusFlags & SOLDIER_TURNINGFROMHIT)) {
            switch (gAnimControl[pSoldier.usAnimState].ubEndHeight) {
              case ANIM_STAND:

                // OK, we can do some cool things here - first is to make guy walkl back a bit...
                //	ChangeSoldierState( pSoldier, STANDING_HIT_BEGINCROUCHDOWN, 0, FALSE );
                //	return( TRUE );
                break;
            }
          }

          // CODE: HANDLE ANY RANDOM HIT VARIATIONS WE WISH TO DO.....
          if (fGoBackToAimAfterHit) {
            if (pSoldier.bLife >= OKLIFE) {
              InternalSoldierReadyWeapon(pSoldier, pSoldier.bDirection, false);
            }
            return true;
          }
        } break;

        case 473:

          // CODE: CHECK IF WE HAVE JUST JAMMED / OUT OF AMMO, DONOT CONTINUE, BUT
          // GOTO STATIONARY ANIM
          if (CheckForImproperFireGunEnd(pSoldier)) {
            return true;
          }
          break;

        case 474:

          // CODE: GETUP FROM SLEEP
          ChangeSoldierStance(pSoldier, ANIM_STAND);
          return true;

        case 475:

          // CODE: END CLIMB DOWN ROOF
          pSoldier.ubDesiredHeight = ANIM_STAND;
          pSoldier.sFinalDestination = pSoldier.sGridNo;

          // re-enable sight
          gTacticalStatus.uiFlags &= (~DISALLOW_SIGHT);

          // ATE: Change interface level.....
          // CJC: only if we are a player merc
          if ((pSoldier.bTeam == gbPlayerNum) && !gTacticalStatus.fAutoBandageMode) {
            if (pSoldier.ubID == gusSelectedSoldier) {
              ChangeInterfaceLevel(0);
            }
            // OK, UNSET INTERFACE FIRST
            UnSetUIBusy(pSoldier.ubID);
          } else {
            FreeUpNPCFromRoofClimb(pSoldier);
          }
          pSoldier.usUIMovementMode = Enum193.WALKING;

          // ATE: Handle sight...
          HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO | SIGHT_INTERRUPT);
          break;

        case 476:

          // CODE: GOTO PREVIOUS ANIMATION
          ChangeSoldierState(pSoldier, (pSoldier.sPendingActionData2), (pSoldier.uiPendingActionData1 + 1), false);
          return true;
          break;

        case 477:

          // CODE: Locate to target ( if an AI guy.. )
          if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
            if (pSoldier.bTeam != gbPlayerNum) {
              // only locate if the enemy is visible or he's aiming at a player
              if (pSoldier.bVisible != -1 || (pSoldier.ubTargetID != NOBODY && MercPtrs[pSoldier.ubTargetID].bTeam == gbPlayerNum)) {
                LocateGridNo(pSoldier.sTargetGridNo);
              }
            }
          }
          break;

        case 478:

          // CODE: Decide to turn from hit.......
          {
            let bNewDirection: INT8;
            let uiChance: UINT32;

            // ONLY DO THIS IF CERTAIN CONDITIONS ARISE!
            // For one, only do for mercs!
            if (pSoldier.ubBodyType <= Enum194.REGFEMALE) {
              // Secondly, don't if we are going to collapse
              if (pSoldier.bLife >= OKLIFE && pSoldier.bBreath > 0 && pSoldier.bLevel == 0) {
                // Save old direction
                pSoldier.uiPendingActionData1 = pSoldier.bDirection;

                // If we got a head shot...more chance of turning...
                if (pSoldier.ubHitLocation != AIM_SHOT_HEAD) {
                  uiChance = Random(100);

                  // 30 % chance to change direction one way
                  if (uiChance < 30) {
                    bNewDirection = gOneCDirection[pSoldier.bDirection];
                  }
                  // 30 % chance to change direction the other way
                  else if (uiChance >= 30 && uiChance < 60) {
                    bNewDirection = gOneCCDirection[pSoldier.bDirection];
                  }
                  // 30 % normal....
                  else {
                    bNewDirection = pSoldier.bDirection;
                  }

                  EVENT_SetSoldierDirection(pSoldier, bNewDirection);
                  EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.bDirection);
                } else {
                  // OK, 50% chance here to turn...
                  uiChance = Random(100);

                  if (uiChance < 50) {
                    // OK, pick a larger direction to goto....
                    pSoldier.uiStatusFlags |= SOLDIER_TURNINGFROMHIT;

                    // Pick evenly between both
                    if (Random(50) < 25) {
                      bNewDirection = gOneCDirection[pSoldier.bDirection];
                      bNewDirection = gOneCDirection[bNewDirection];
                      bNewDirection = gOneCDirection[bNewDirection];
                    } else {
                      bNewDirection = gOneCCDirection[pSoldier.bDirection];
                      bNewDirection = gOneCCDirection[bNewDirection];
                      bNewDirection = gOneCCDirection[bNewDirection];
                    }

                    EVENT_SetSoldierDesiredDirection(pSoldier, bNewDirection);
                  }
                }
              }
            }
            break;
          }

        case 479:

          // CODE: Return to old direction......
          if (pSoldier.ubBodyType <= Enum194.REGFEMALE) {
            // Secondly, don't if we are going to collapse
            // if ( pSoldier->bLife >= OKLIFE && pSoldier->bBreath > 0 )
            //{
            ///	if ( !( pSoldier->uiStatusFlags & SOLDIER_TURNINGFROMHIT ) )
            //	{
            ///		pSoldier->bDirection				= (INT8)pSoldier->uiPendingActionData1;
            //		pSoldier->bDesiredDirection = (INT8)pSoldier->uiPendingActionData1;
            //	}
            //}
          }
          break;

        case 480:

          // CODE: FORCE FREE ATTACKER
          // Release attacker
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, code 480"));

          ReleaseSoldiersAttacker(pSoldier);

          // FREEUP GETTING HIT FLAG
          pSoldier.fGettingHit = 0;
          break;

        case 481:

          // CODE: CUT FENCE...
          CutWireFence(pSoldier.sTargetGridNo);
          break;

        case 482:

          // CODE: END CRIPPLE KICKOUT...
          KickOutWheelchair(pSoldier);
          break;

        case 483:

          // CODE: HANDLE DROP BOMB...
          HandleSoldierDropBomb(pSoldier, pSoldier.sPendingActionData2);
          break;

        case 484:

          // CODE: HANDLE REMOTE...
          HandleSoldierUseRemote(pSoldier, pSoldier.sPendingActionData2);
          break;

        case 485:

          // CODE: Try steal.....
          UseHandToHand(pSoldier, pSoldier.sPendingActionData2, true);
          break;

        case 486:

          // CODE: GIVE ITEM
          SoldierGiveItemFromAnimation(pSoldier);
          if (pSoldier.ubProfile != NO_PROFILE && pSoldier.ubProfile >= FIRST_NPC) {
            TriggerNPCWithGivenApproach(pSoldier.ubProfile, Enum296.APPROACH_DONE_GIVING_ITEM, false);
          }
          break;

        case 487:

          // CODE: DROP ITEM
          SoldierHandleDropItem(pSoldier);
          break;

        case 489:

          // CODE: REMOVE GUY FRMO WORLD DUE TO EXPLOSION
          // ChangeSoldierState( pSoldier, RAISE_RIFLE, 0 , FALSE );
          // return( TRUE );
          // Delete guy
          // TacticalRemoveSoldier( pSoldier->ubID );
          // return( FALSE );
          break;

        case 490:

          // CODE: HANDLE END ITEM PICKUP
          // LOOK INTO HAND, RAISE RIFLE IF WE HAVE ONE....
          /*
          if ( pSoldier->inv[ HANDPOS ].usItem != NOTHING )
          {
                  // CHECK IF GUN
                  if ( Item[ pSoldier->inv[ HANDPOS ].usItem ].usItemClass == IC_GUN )
                  {
                          if ( Weapon[ pSoldier->inv[ HANDPOS ].usItem ].ubWeaponClass != HANDGUNCLASS )
                          {
                                  // RAISE
                                  ChangeSoldierState( pSoldier, RAISE_RIFLE, 0 , FALSE );
                                  return( TRUE );
                          }

                  }

          }
          */
          break;

        case 491:

          // CODE: HANDLE RANDOM BREATH ANIMATION
          // if ( pSoldier->bLife > INJURED_CHANGE_THREASHOLD )
          if (pSoldier.bLife >= OKLIFE) {
            // Increment time from last update
            pSoldier.uiTimeOfLastRandomAction++;

            if (pSoldier.uiTimeOfLastRandomAction > TIME_FOR_RANDOM_ANIM_CHECK || pSoldier.bLife < INJURED_CHANGE_THREASHOLD || GetDrunkLevel(pSoldier) >= BORDERLINE) {
              pSoldier.uiTimeOfLastRandomAction = 0;

              // Don't do any in water!
              if (!MercInWater(pSoldier)) {
                // OK, make a dice roll
                ubDiceRoll = Random(100);

                // Determine what is in our hand;
                usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

                // Default to nothing in hand ( nothing in quotes, we do have something but not just visible )
                ubRandomHandIndex = RANDOM_ANIM_NOTHINGINHAND;

                if (usItem != NOTHING) {
                  if (Item[usItem].usItemClass == IC_GUN) {
                    if ((Item[usItem].fFlags & ITEM_TWO_HANDED)) {
                      // Set to rifle
                      ubRandomHandIndex = RANDOM_ANIM_RIFLEINHAND;
                    } else {
                      // Don't EVER do a trivial anim...
                      break;
                    }
                  }
                }

                // Check which animation to play....
                for (cnt = 0; cnt < MAX_RANDOM_ANIMS_PER_BODYTYPE; cnt++) {
                  pAnimDef = gRandomAnimDefs[pSoldier.ubBodyType][cnt];

                  if (pAnimDef.sAnimID != 0) {
                    // If it's an injured animation and we are not in the threashold....
                    if ((pAnimDef.ubFlags & RANDOM_ANIM_INJURED) && pSoldier.bLife >= INJURED_CHANGE_THREASHOLD) {
                      continue;
                    }

                    // If we need to do an injured one, don't do any others...
                    if (!(pAnimDef.ubFlags & RANDOM_ANIM_INJURED) && pSoldier.bLife < INJURED_CHANGE_THREASHOLD) {
                      continue;
                    }

                    // If it's a drunk animation and we are not in the threashold....
                    if ((pAnimDef.ubFlags & RANDOM_ANIM_DRUNK) && GetDrunkLevel(pSoldier) < BORDERLINE) {
                      continue;
                    }

                    // If we need to do an injured one, don't do any others...
                    if (!(pAnimDef.ubFlags & RANDOM_ANIM_DRUNK) && GetDrunkLevel(pSoldier) >= BORDERLINE) {
                      continue;
                    }

                    // Check if it's our hand
                    if (pAnimDef.ubHandRestriction != RANDOM_ANIM_IRRELEVENTINHAND && pAnimDef.ubHandRestriction != ubRandomHandIndex) {
                      continue;
                    }

                    // Check if it's casual and we're in combat and it's not our guy
                    if ((pAnimDef.ubFlags & RANDOM_ANIM_CASUAL)) {
                      // If he's a bad guy, do not do it!
                      if (pSoldier.bTeam != gbPlayerNum || (gTacticalStatus.uiFlags & INCOMBAT)) {
                        continue;
                      }
                    }

                    // If we are an alternate big guy and have been told to use a normal big merc ani...
                    if ((pAnimDef.ubFlags & RANDOM_ANIM_FIRSTBIGMERC) && (pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE)) {
                      continue;
                    }

                    // If we are a normal big guy and have been told to use an alternate big merc ani...
                    if ((pAnimDef.ubFlags & RANDOM_ANIM_SECONDBIGMERC) && !(pSoldier.uiAnimSubFlags & SUB_ANIM_BIGGUYTHREATENSTANCE)) {
                      continue;
                    }

                    // Check if it's the proper height
                    if (pAnimDef.ubAnimHeight == gAnimControl[pSoldier.usAnimState].ubEndHeight) {
                      // OK, If we rolled a value that lies within the range for this random animation, use this one!
                      if (ubDiceRoll >= pAnimDef.ubStartRoll && ubDiceRoll <= pAnimDef.ubEndRoll) {
                        // Are we playing a sound
                        if (pAnimDef.sAnimID == RANDOM_ANIM_SOUND) {
                          if (pSoldier.ubBodyType == Enum194.COW) {
                            if (Random(2) == 1) {
                              if ((gTacticalStatus.uiFlags & INCOMBAT) && pSoldier.bVisible == -1) {
                                // DO this every 10th time or so...
                                if (Random(100) < 10) {
                                  // Play sound
                                  PlayJA2SampleFromFile(pAnimDef.zSoundFile, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
                                }
                              } else {
                                // Play sound
                                PlayJA2SampleFromFile(pAnimDef.zSoundFile, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
                              }
                            }
                          } else {
                            // Play sound
                            PlayJA2SampleFromFile(pAnimDef.zSoundFile, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
                          }
                        } else {
                          ChangeSoldierState(pSoldier, pAnimDef.sAnimID, 0, false);
                        }
                        return true;
                      }
                    }
                  }
                }
              }
            }
          }
          break;

        case 492:

          // SIGNAL DODGE!
          // ATE: Only do if we're not inspecial case...
          if (!(pSoldier.uiStatusFlags & SOLDIER_NPC_DOING_PUNCH)) {
            let pTSoldier: SOLDIERTYPE;
            let uiMercFlags: UINT32 = 0;
            let usSoldierIndex: UINT16 = 0;

            if (FindSoldier(pSoldier.sTargetGridNo, createPointer(() => usSoldierIndex, (v) => usSoldierIndex = v), createPointer(() => uiMercFlags, (v) => uiMercFlags = v), FIND_SOLDIER_GRIDNO)) {
              pTSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

              // IF WE ARE AN ANIMAL, CAR, MONSTER, DONT'T DODGE
              if (IS_MERC_BODY_TYPE(pTSoldier)) {
                // ONLY DODGE IF WE ARE SEEN
                if (pTSoldier.bOppList[pSoldier.ubID] != 0 || pTSoldier.bTeam == pSoldier.bTeam) {
                  if (gAnimControl[pTSoldier.usAnimState].ubHeight == ANIM_STAND) {
                    // OK, stop merc....
                    EVENT_StopMerc(pTSoldier, pTSoldier.sGridNo, pTSoldier.bDirection);

                    if (pTSoldier.bTeam != gbPlayerNum) {
                      CancelAIAction(pTSoldier, 1);
                    }

                    // Turn towards the person!
                    EVENT_SetSoldierDesiredDirection(pTSoldier, GetDirectionFromGridNo(pSoldier.sGridNo, pTSoldier));

                    // PLAY SOLDIER'S DODGE ANIMATION
                    ChangeSoldierState(pTSoldier, Enum193.DODGE_ONE, 0, false);
                  }
                }
              }
            }
          }
          break;

        case 493:

          // CODE: PICKUP ITEM!
          // CHECK IF THIS EVENT HAS BEEN SETUP
          // if ( pSoldier->ubPendingAction == MERC_PICKUPITEM )
          //{
          // DROP ITEM
          HandleSoldierPickupItem(pSoldier, pSoldier.uiPendingActionData1, (pSoldier.uiPendingActionData4), pSoldier.bPendingActionData3);
          // EVENT HAS BEEN HANDLED
          pSoldier.ubPendingAction = NO_PENDING_ACTION;

          //}
          // else
          //{
          //	 DebugMsg( TOPIC_JA2, DBG_LEVEL_3, "Soldier Ani: CODE 493 Error, Pickup item action called but not setup" );
          //}
          break;

        case 494:

          // CODE: OPEN STRUCT!
          // CHECK IF THIS EVENT HAS BEEN SETUP
          // if ( pSoldier->ubPendingAction == MERC_OPENSTRUCT )
          //{
          SoldierHandleInteractiveObject(pSoldier);

          // EVENT HAS BEEN HANDLED
          pSoldier.ubPendingAction = NO_PENDING_ACTION;

          //}
          // else
          //{
          //	 DebugMsg( TOPIC_JA2, DBG_LEVEL_3, "Soldier Ani: CODE 494 Error, OPen door action called but not setup" );
          //}
          break;

        case 495:

          if (pSoldier.bAction == Enum289.AI_ACTION_UNLOCK_DOOR || (pSoldier.bAction == Enum289.AI_ACTION_LOCK_DOOR && !(pSoldier.fAIFlags & AI_LOCK_DOOR_INCLUDES_CLOSE))) {
            // EVENT HAS BEEN HANDLED
            pSoldier.ubPendingAction = NO_PENDING_ACTION;

            // do nothing here
          } else {
            pSoldier.fAIFlags &= ~(AI_LOCK_DOOR_INCLUDES_CLOSE);

            pSoldier.ubDoorOpeningNoise = DoorOpeningNoise(pSoldier);

            if (SoldierHandleInteractiveObject(pSoldier)) {
              // HANDLE SIGHT!
              // HandleSight(pSoldier,SIGHT_LOOK | SIGHT_RADIO | SIGHT_INTERRUPT );

              InitOpplistForDoorOpening();

              MakeNoise(pSoldier.ubID, pSoldier.sGridNo, pSoldier.bLevel, gpWorldLevelData[pSoldier.sGridNo].ubTerrainID, pSoldier.ubDoorOpeningNoise, Enum236.NOISE_CREAKING);
              //	gfDelayResolvingBestSighting = FALSE;

              gubInterruptProvoker = pSoldier.ubID;
              AllTeamsLookForAll(true);

              // ATE: Now, check AI guy to cancel what he was going....
              HandleSystemNewAISituation(pSoldier, true);
            }

            // EVENT HAS BEEN HANDLED
            pSoldier.ubPendingAction = NO_PENDING_ACTION;
          }

          break;

        case 496:
          // CODE: GOTO PREVIOUS ANIMATION
          ChangeSoldierState(pSoldier, pSoldier.usOldAniState, pSoldier.sOldAniCode, false);
          return true;

        case 497:

          // CODE: CHECK FOR UNCONSCIOUS OR DEATH
          // IF 496 - GOTO PREVIOUS ANIMATION, OTHERWISE PAUSE ANIMATION
          if (pSoldier.bLife == 0) {
            // HandleSoldierDeath( pSoldier );

            // If guy is now dead, and we have not played death sound before, play
            if (pSoldier.bLife == 0 && !pSoldier.fDeadSoundPlayed) {
              if (pSoldier.usAnimState != Enum193.JFK_HITDEATH) {
                DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
                pSoldier.fDeadSoundPlayed = true;
              }
            }

            if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
              // If we are dead, play some death animations!!
              switch (pSoldier.usAnimState) {
                case Enum193.FLYBACK_HIT:
                  ChangeSoldierState(pSoldier, Enum193.FLYBACK_HIT_DEATH, 0, false);
                  break;

                case Enum193.GENERIC_HIT_DEATHTWITCHNB:
                case Enum193.FALLFORWARD_FROMHIT_STAND:
                case Enum193.ENDFALLFORWARD_FROMHIT_CROUCH:

                  ChangeSoldierState(pSoldier, Enum193.GENERIC_HIT_DEATH, 0, false);
                  break;

                case Enum193.FALLBACK_HIT_DEATHTWITCHNB:
                case Enum193.FALLBACK_HIT_STAND:
                  ChangeSoldierState(pSoldier, Enum193.FALLBACK_HIT_DEATH, 0, false);
                  break;

                case Enum193.PRONE_HIT_DEATHTWITCHNB:
                case Enum193.PRONE_LAY_FROMHIT:

                  ChangeSoldierState(pSoldier, Enum193.PRONE_HIT_DEATH, 0, false);
                  break;

                case Enum193.FALLOFF:
                  ChangeSoldierState(pSoldier, Enum193.FALLOFF_DEATH, 0, false);
                  break;

                case Enum193.FALLFORWARD_ROOF:
                  ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_DEATH, 0, false);
                  break;

                case Enum193.ADULTMONSTER_DYING:
                  ChangeSoldierState(pSoldier, Enum193.ADULTMONSTER_DYING_STOP, 0, false);
                  break;

                case Enum193.LARVAE_DIE:
                  ChangeSoldierState(pSoldier, Enum193.LARVAE_DIE_STOP, 0, false);
                  break;

                case Enum193.QUEEN_DIE:
                  ChangeSoldierState(pSoldier, Enum193.QUEEN_DIE_STOP, 0, false);
                  break;

                case Enum193.INFANT_DIE:
                  ChangeSoldierState(pSoldier, Enum193.INFANT_DIE_STOP, 0, false);
                  break;

                case Enum193.CRIPPLE_DIE:
                  ChangeSoldierState(pSoldier, Enum193.CRIPPLE_DIE_STOP, 0, false);
                  break;

                case Enum193.ROBOTNW_DIE:
                  ChangeSoldierState(pSoldier, Enum193.ROBOTNW_DIE_STOP, 0, false);
                  break;

                case Enum193.CRIPPLE_DIE_FLYBACK:
                  ChangeSoldierState(pSoldier, Enum193.CRIPPLE_DIE_FLYBACK_STOP, 0, false);
                  break;

                default:
                  // IF we are here - something is wrong - we should have a death animation here
                  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Soldier Ani: Death sequence needed for animation %d", pSoldier.usAnimState));
              }
            } else {
              let fMadeCorpse: boolean = false;

              CheckForAndHandleSoldierDeath(pSoldier, createPointer(() => fMadeCorpse, (v) => fMadeCorpse = v));

              // ATE: Needs to be FALSE!
              return false;
            }
            return true;
          } else {
            // We can safely be here as well.. ( ie - next turn we may be able to get up )
            // DO SOME CHECKS HERE TO FREE UP ATTACKERS IF WE ARE WAITING AT SPECIFIC ANIMATIONS
            if ((gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_HITFINISH)) {
              gfPotentialTeamChangeDuringDeath = true;

              // Release attacker
              DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, code 497 = check for death"));
              ReleaseSoldiersAttacker(pSoldier);

              // ATE: OK - the above call can potentially
              // render the soldier bactive to false - check heare
              if (!pSoldier.bActive) {
                return false;
              }

              gfPotentialTeamChangeDuringDeath = false;

              // FREEUP GETTING HIT FLAG
              pSoldier.fGettingHit = 0;
            }

            HandleCheckForDeathCommonCode(pSoldier);

            return true;
          }
          break;

        case 498:

          // CONDITONAL JUMP
          // If we have a pending animation, play it, else continue
          if (pSoldier.usPendingAnimation != NO_PENDING_ANIMATION) {
            ChangeSoldierState(pSoldier, pSoldier.usPendingAnimation, 0, false);
            pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
            return true;
          }
          break;

        // JUMP TO NEXT STATIONARY ANIMATION ACCORDING TO HEIGHT
        case 499:

          if (!(pSoldier.uiStatusFlags & SOLDIER_PC)) {
            if (pSoldier.bAction == Enum289.AI_ACTION_PULL_TRIGGER) {
              if (pSoldier.usAnimState == Enum193.AI_PULL_SWITCH && gTacticalStatus.ubAttackBusyCount == 0 && gubElementsOnExplosionQueue == 0) {
                FreeUpNPCFromPendingAction(pSoldier);
              }
            } else if (pSoldier.bAction == Enum289.AI_ACTION_PENDING_ACTION || pSoldier.bAction == Enum289.AI_ACTION_OPEN_OR_CLOSE_DOOR || pSoldier.bAction == Enum289.AI_ACTION_YELLOW_ALERT || pSoldier.bAction == Enum289.AI_ACTION_RED_ALERT || pSoldier.bAction == Enum289.AI_ACTION_PULL_TRIGGER || pSoldier.bAction == Enum289.AI_ACTION_CREATURE_CALL || pSoldier.bAction == Enum289.AI_ACTION_UNLOCK_DOOR || pSoldier.bAction == Enum289.AI_ACTION_LOCK_DOOR) {
              if (pSoldier.usAnimState == Enum193.PICKUP_ITEM || pSoldier.usAnimState == Enum193.ADJACENT_GET_ITEM || pSoldier.usAnimState == Enum193.DROP_ITEM || pSoldier.usAnimState == Enum193.END_OPEN_DOOR || pSoldier.usAnimState == Enum193.END_OPEN_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.CLOSE_DOOR || pSoldier.usAnimState == Enum193.MONSTER_UP || pSoldier.usAnimState == Enum193.AI_RADIO || pSoldier.usAnimState == Enum193.AI_CR_RADIO || pSoldier.usAnimState == Enum193.END_OPENSTRUCT || pSoldier.usAnimState == Enum193.END_OPENSTRUCT_CROUCHED || pSoldier.usAnimState == Enum193.QUEEN_CALL) {
                FreeUpNPCFromPendingAction(pSoldier);
              }
            }
          }

          ubDesiredHeight = pSoldier.ubDesiredHeight;

          // Check if we are at the desired height
          if (pSoldier.ubDesiredHeight == gAnimControl[pSoldier.usAnimState].ubEndHeight || pSoldier.ubDesiredHeight == NO_DESIRED_HEIGHT) {
            // Adjust movement mode......
            if (pSoldier.bTeam == gbPlayerNum && !pSoldier.fContinueMoveAfterStanceChange) {
              usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight);

              // ATE: if we are currently running but have been told to walk, don't!
              if (pSoldier.usUIMovementMode == Enum193.RUNNING && usUIMovementMode == Enum193.WALKING) {
                // No!
              } else {
                pSoldier.usUIMovementMode = usUIMovementMode;
              }
            }

            pSoldier.ubDesiredHeight = NO_DESIRED_HEIGHT;

            if (pSoldier.fChangingStanceDueToSuppression) {
              pSoldier.fChangingStanceDueToSuppression = false;
              DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Freeing up attacker - end of suppression stance change"));
              ReduceAttackBusyCount(pSoldier.ubSuppressorID, false);
            }

            if (pSoldier.usPendingAnimation == NO_PENDING_ANIMATION && (pSoldier.fTurningFromPronePosition != 3) && (pSoldier.fTurningFromPronePosition != 1)) {
              if (gTacticalStatus.ubAttackBusyCount == 0) {
                // OK, UNSET INTERFACE FIRST
                UnSetUIBusy(pSoldier.ubID);
                // ( before we could get interrupted potentially by an interrupt )
              }
            }

            // Check to see if we have changed stance and need to update visibility
            if (gAnimControl[pSoldier.usAnimState].uiFlags & ANIM_STANCECHANGEANIM) {
              if (pSoldier.usPendingAnimation == NO_PENDING_ANIMATION && gTacticalStatus.ubAttackBusyCount == 0 && pSoldier.fTurningFromPronePosition != 3 && pSoldier.fTurningFromPronePosition != 1) {
                HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO | SIGHT_INTERRUPT);
              } else {
                HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO);
              }

              // Keep ui busy if we are now in a hidden interrupt
              // say we're prone and we crouch, we may get a hidden
              // interrupt and in such a case we'd really like the UI
              // still locked
              if (gfHiddenInterrupt) {
                guiPendingOverrideEvent = Enum207.LA_BEGINUIOURTURNLOCK;
                HandleTacticalUI();
              }

              // ATE: Now, check AI guy to cancel what he was going....
              HandleSystemNewAISituation(pSoldier, true);
            }

            // Have we finished opening doors?
            if (pSoldier.usAnimState == Enum193.END_OPEN_DOOR || pSoldier.usAnimState == Enum193.END_OPEN_DOOR_CROUCHED || pSoldier.usAnimState == Enum193.CRIPPLE_CLOSE_DOOR || pSoldier.usAnimState == Enum193.CRIPPLE_END_OPEN_DOOR) {
              // Are we told to continue movement...?
              if (pSoldier.bEndDoorOpenCode == 1) {
                // OK, set this value to 2 such that once we are into a new gridno,
                // we close the door!
                pSoldier.bEndDoorOpenCode = 2;

                // yes..
                EVENT_GetNewSoldierPath(pSoldier, pSoldier.sFinalDestination, pSoldier.usUIMovementMode);

                if (!(gAnimControl[pSoldier.usAnimState].uiFlags & (ANIM_MOVING))) {
                  if (pSoldier.sAbsoluteFinalDestination != NOWHERE) {
                    CancelAIAction(pSoldier, FORCE);
                  }
                }

                // OK, this code, pSoldier->bEndDoorOpenCode will be set to 0 if anythiing
                // cuases guy to stop - StopMerc() will set it...

                return true;
              }
            }

            // Check if we should contine into a moving animation
            if (pSoldier.usPendingAnimation != NO_PENDING_ANIMATION) {
              let usPendingAnimation: UINT16 = pSoldier.usPendingAnimation;

              pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
              ChangeSoldierState(pSoldier, usPendingAnimation, 0, false);
              return true;
            }

            // Alrighty, do we wish to continue
            if (pSoldier.fContinueMoveAfterStanceChange) {
              // OK, if the code is == 2, get the path and try to move....
              if (pSoldier.fContinueMoveAfterStanceChange == 2) {
                pSoldier.usPathIndex++;

                if (pSoldier.usPathIndex > pSoldier.usPathDataSize) {
                  pSoldier.usPathIndex = pSoldier.usPathDataSize;
                }

                if (pSoldier.usPathIndex == pSoldier.usPathDataSize) {
                  // Stop, don't do anything.....
                } else {
                  EVENT_InitNewSoldierAnim(pSoldier, pSoldier.usUIMovementMode, 0, false);

                  // UNSET LOCK PENDING ACTION COUNTER FLAG
                  pSoldier.uiStatusFlags &= (~SOLDIER_LOCKPENDINGACTIONCOUNTER);
                }
              } else {
                SelectMoveAnimationFromStance(pSoldier);
              }

              pSoldier.fContinueMoveAfterStanceChange = 0;
              return true;
            }
            SoldierGotoStationaryStance(pSoldier);
            return true;
          } else {
            ubCurrentHeight = gAnimControl[pSoldier.usAnimState].ubEndHeight;

            // We need to go more, continue
            if (ubDesiredHeight == ANIM_STAND && ubCurrentHeight == ANIM_CROUCH) {
              // Return here because if now, we will skipp a few frames
              ChangeSoldierState(pSoldier, Enum193.KNEEL_UP, 0, false);
              return true;
            }
            if (ubDesiredHeight == ANIM_CROUCH && ubCurrentHeight == ANIM_STAND) {
              // Return here because if now, we will skipp a few frames
              ChangeSoldierState(pSoldier, Enum193.KNEEL_DOWN, 0, false);
              return true;
            } else if (ubDesiredHeight == ANIM_PRONE && ubCurrentHeight == ANIM_CROUCH) {
              // Return here because if now, we will skipp a few frames
              ChangeSoldierState(pSoldier, Enum193.PRONE_DOWN, 0, false);
              return true;
            } else if (ubDesiredHeight == ANIM_CROUCH && ubCurrentHeight == ANIM_PRONE) {
              // Return here because if now, we will skipp a few frames
              ChangeSoldierState(pSoldier, Enum193.PRONE_UP, 0, false);
              return true;
            }
          }
// IF we are here - something is wrong - we should have a death animation here

          SoldierGotoStationaryStance(pSoldier);
          return true;
      }

      // Adjust frame control pos, and try again
      pSoldier.usAniCode++;
    } else if (sNewAniFrame > 499 && sNewAniFrame < 599) {
      // Jump,
      // Do not adjust, just try again
      pSoldier.usAniCode = sNewAniFrame - 501;
    } else if (sNewAniFrame > 599 && sNewAniFrame <= 699) {
      // Jump, to animation script
      EVENT_InitNewSoldierAnim(pSoldier, (sNewAniFrame - 600), 0, false);
      return true;
    } else if (sNewAniFrame > 799 && sNewAniFrame <= 899) {
      // Jump, to animation script ( But in the 100's range )
      EVENT_InitNewSoldierAnim(pSoldier, (sNewAniFrame - 700), 0, false);
      return true;
    } else if (sNewAniFrame > 899 && sNewAniFrame <= 999) {
      // Jump, to animation script ( But in the 200's range )
      EVENT_InitNewSoldierAnim(pSoldier, (sNewAniFrame - 700), 0, false);
      return true;
    } else if (sNewAniFrame > 699 && sNewAniFrame < 799) {
      switch (sNewAniFrame) {
        case 702:
          // Play fall to knees sound
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.FALL_1 + Random(2)), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          break;

        case 703:
        case 704:

          // Play footprints
          PlaySoldierFootstepSound(pSoldier);
          break;

        case 705:
          // PLay body splat sound
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.BODY_SPLAT_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 706:
          // PLay head splat
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.HEADSPLAT_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 707:
          // PLay creature battle cry
          PlayJA2StreamingSample(Enum330.CREATURE_BATTLECRY_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
          break;

        case 708:

          // PLay lock n' load sound for gun....
          // Get LNL sound for current gun
          {
            let usItem: UINT16;
            let usSoundID: UINT16;

            usItem = pSoldier.inv[Enum261.HANDPOS].usItem;

            if (usItem != NOTHING) {
              usSoundID = Weapon[usItem].sLocknLoadSound;

              if (usSoundID != 0) {
                PlayJA2Sample(usSoundID, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
              }
            }
          }
          break;

        case 709:

          // Knife throw sound...
          PlayJA2Sample(Weapon[Enum225.THROWING_KNIFE].sSound, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
          break;

        case 710:

          // Monster footstep in
          if (SoldierOnScreen(pSoldier.ubID)) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ACR_STEP_1, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 711:

          // Monster footstep in
          if (SoldierOnScreen(pSoldier.ubID)) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ACR_STEP_2, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 712:

          // Monster footstep in
          if (SoldierOnScreen(pSoldier.ubID)) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.LCR_MOVEMENT, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 713:

          // Monster footstep in
          if (pSoldier.ubBodyType == Enum194.INFANT_MONSTER) {
            if (SoldierOnScreen(pSoldier.ubID)) {
              PlaySoldierJA2Sample(pSoldier.ubID, Enum330.BCR_DRAGGING, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
            }
          }
          break;

        case 714:

          // Lunges....
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ACR_LUNGE, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 715:

          // Swipe
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ACR_SWIPE, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 716:

          // Eat flesh
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ACR_EATFLESH, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 717:

          // Battle cry
          {
            let iSoundID: INT32 = 0;
            let fDoCry: boolean = false;

            // if ( SoldierOnScreen( pSoldier->ubID ) )
            {
              switch (pSoldier.usActionData) {
                case Enum288.CALL_1_PREY:

                  if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
                    iSoundID = Enum330.LQ_SMELLS_THREAT;
                  } else {
                    iSoundID = Enum330.ACR_SMEEL_PREY;
                  }
                  fDoCry = true;
                  break;

                case Enum288.CALL_MULTIPLE_PREY:

                  if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
                    iSoundID = Enum330.LQ_SMELLS_THREAT;
                  } else {
                    iSoundID = Enum330.ACR_SMELL_THREAT;
                  }
                  fDoCry = true;
                  break;

                case Enum288.CALL_ATTACKED:

                  if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
                    iSoundID = Enum330.LQ_ENRAGED_ATTACK;
                  } else {
                    iSoundID = Enum330.ACR_SMELL_THREAT;
                  }
                  fDoCry = true;
                  break;

                case Enum288.CALL_CRIPPLED:

                  if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
                    iSoundID = Enum330.LQ_CRIPPLED;
                  } else {
                    iSoundID = Enum330.ACR_CRIPPLED;
                  }
                  fDoCry = true;
                  break;
              }

              if (fDoCry) {
                PlayJA2Sample(iSoundID, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
              }
            }
          }
          break;

        case 718:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.LQ_RUPTURING, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 719:

          // Spit attack start sound...
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.LQ_ENRAGED_ATTACK, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 720:

          // Spit attack start sound...
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.LQ_WHIP_ATTACK, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 721:
          // Play fall from knees to ground...
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.FALL_TO_GROUND_1 + Random(3)), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          if (pSoldier.usAnimState == Enum193.FALLFORWARD_FROMHIT_STAND) {
            CheckEquipmentForFragileItemDamage(pSoldier, 20);
          }
          break;

        case 722:
          // Play fall heavy
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.HEAVY_FALL_1), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          if (pSoldier.usAnimState == Enum193.FALLFORWARD_FROMHIT_CROUCH) {
            CheckEquipmentForFragileItemDamage(pSoldier, 15);
          }
          break;

        case 723:

          // Play armpit noise...
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.IDLE_ARMPIT), RATE_11025, SoundVolume(LOWVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 724:

          // Play ass scratch
          // PlaySoldierJA2Sample( pSoldier->ubID, (UINT8)( IDLE_SCRATCH ), RATE_11025, SoundVolume( HIGHVOLUME, pSoldier->sGridNo ), 1, SoundDir( pSoldier->sGridNo ), TRUE );
          break;

        case 725:

          // Play back crack
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.IDLE_BACKCRACK), RATE_11025, SoundVolume(LOWVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 726:

          // Kickin door
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.KICKIN_DOOR), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 727:

          // Swoosh
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.SWOOSH_1 + Random(6)), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 728:

          // Creature fall
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.ACR_FALL_1), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 729:

          // grab roof....
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.GRAB_ROOF), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 730:

          // end climb roof....
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.LAND_ON_ROOF), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 731:

          // Stop climb roof..
          PlaySoldierJA2Sample(pSoldier.ubID, (Enum330.FALL_TO_GROUND_1 + Random(3)), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 732:

          // Play die sound
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
          pSoldier.fDeadSoundPlayed = true;
          break;

        case 750:

          // CODE: Move Vehicle UP
          if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
            //	SetSoldierHeight( pSoldier, (FLOAT)( pSoldier->sHeightAdjustment + 1 ) );
          }
          break;

        case 751:

          // CODE: Move vehicle down
          if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
            //		SetSoldierHeight( pSoldier, (FLOAT)( pSoldier->sHeightAdjustment - 1 ) );
          }
          break;

        case 752:

          // Code: decapitate
          DecapitateCorpse(pSoldier, pSoldier.sTargetGridNo, pSoldier.bTargetLevel);
          break;

        case 753:

          // code: freeup attcker
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count..., CODE FROM ANIMATION %s ( %d )", gAnimControl[pSoldier.usAnimState].zAnimStr, pSoldier.usAnimState));
          ReduceAttackBusyCount(pSoldier.ubID, false);

          // ATE: Here, reduce again if creaturequeen tentical attack...
          if (pSoldier.usAnimState == Enum193.QUEEN_SWIPE) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Reducing attacker busy count for end of queen swipe"));
            ReduceAttackBusyCount(pSoldier.ubID, false);
          }
          break;

        case 754:

          HandleFallIntoPitFromAnimation(pSoldier.ubID);
          break;

        case 755:

          DishoutQueenSwipeDamage(pSoldier);
          break;

        case 756:

          // Reload robot....
          {
            let ubPerson: UINT8;
            let pRobot: SOLDIERTYPE;

            // Get pointer...
            ubPerson = WhoIsThere2(pSoldier.sPendingActionData2, pSoldier.bLevel);

            if (ubPerson != NOBODY && MercPtrs[ubPerson].uiStatusFlags & SOLDIER_ROBOT) {
              pRobot = MercPtrs[ubPerson];
              Assert(pSoldier.pTempObject);

              ReloadGun(pRobot, pRobot.inv[Enum261.HANDPOS], pSoldier.pTempObject);

              // OK, check what was returned and place in inventory if it's non-zero
              if (pSoldier.pTempObject.usItem != NOTHING) {
                // Add to inv..
                AutoPlaceObject(pSoldier, pSoldier.pTempObject, true);
              }

              pSoldier.pTempObject = null;
            }
          }
          break;

        case 757:

          // INcrement attacker busy count....
          gTacticalStatus.ubAttackBusyCount++;
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!! Incrementing attacker busy count..., CODE FROM ANIMATION %s ( %d ) : Count now %d", gAnimControl[pSoldier.usAnimState].zAnimStr, pSoldier.usAnimState, gTacticalStatus.ubAttackBusyCount));
          break;

        case 758:

          // Trigger after slap...
          TriggerNPCWithGivenApproach(Enum268.QUEEN, Enum296.APPROACH_DONE_SLAPPED, true);
          break;

        case 759:

          // Getting hit by slap
          {
            let pTarget: SOLDIERTYPE | null;

            pTarget = FindSoldierByProfileID(Enum268.ELLIOT, false);

            if (pTarget) {
              EVENT_InitNewSoldierAnim(pTarget, Enum193.SLAP_HIT, 0, false);

              // Play noise....
              // PlaySoldierJA2Sample( pTarget->ubID, ( S_SLAP_IMPACT ), RATE_11025, SoundVolume( HIGHVOLUME, pTarget->sGridNo ), 1, SoundDir( pTarget->sGridNo ), TRUE );

              // DoMercBattleSound( pTarget, (INT8)( BATTLE_SOUND_HIT1 + Random( 2 ) ) );
            }
          }
          break;

        case 760:

          // Get some blood.....
          // Corpse Id is from pending action data
          GetBloodFromCorpse(pSoldier);
          // Dirty interface....
          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
          break;

        case 761:

        {
          // Dish out damage!
          EVENT_SoldierGotHit(MercPtrs[pSoldier.uiPendingActionData4], TAKE_DAMAGE_BLADE, 25, 25, gOppositeDirection[pSoldier.bDirection], 50, pSoldier.ubID, 0, ANIM_PRONE, 0, 0);
        } break;

        case 762: {
          // CODE: Set off Trigger
          let bPanicTrigger: INT8;

          bPanicTrigger = ClosestPanicTrigger(pSoldier);
          SetOffPanicBombs(pSoldier.ubID, bPanicTrigger);
          // any AI guy has been specially given keys for this, now take them
          // away
          pSoldier.bHasKeys = pSoldier.bHasKeys >> 1;
        } break;

        case 763:

          // CODE: Drop item at gridno
          if (pSoldier.pTempObject != null) {
            if (pSoldier.bVisible != -1) {
              PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
            }

            AddItemToPool(pSoldier.sPendingActionData2, pSoldier.pTempObject, 1, pSoldier.bLevel, 0, -1);
            NotifySoldiersToLookforItems();

            pSoldier.pTempObject = null;
          }
          break;

        case 764:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.PICKING_LOCK, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 765:

          // Flyback hit - do blood!
          // PLace in existing tile and one back...
          {
            let sNewGridNo: INT16;

            InternalDropBlood(pSoldier.sGridNo, pSoldier.bLevel, 0, (MAXBLOODQUANTITY), 1);

            // Move forward one gridno....
            sNewGridNo = NewGridNo(pSoldier.sGridNo, (DirectionInc(gOppositeDirection[pSoldier.bDirection])));

            InternalDropBlood(sNewGridNo, pSoldier.bLevel, 0, (MAXBLOODQUANTITY), 1);
          }
          break;

        case 766:

          // Say COOL quote
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_COOL1);
          break;

        case 767:

          // Slap sound effect
          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.SLAP_2, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          break;

        case 768:

          // OK, after ending first aid, stand up if not in combat....
          if (NumCapableEnemyInSector() == 0) {
            // Stand up...
            ChangeSoldierStance(pSoldier, ANIM_STAND);
            return false;
          }
          break;

        case 769:

          // ATE: LOOK HERE FOR CODE IN INTERNALS FOR
          // REFUELING A VEHICLE
          // THE GAS_CAN IS IN THE MERCS MAIN HAND AT THIS TIME
          {
            let ubPerson: UINT8;
            let pVehicle: SOLDIERTYPE;

            // Get pointer to vehicle...
            ubPerson = WhoIsThere2(pSoldier.sPendingActionData2, pSoldier.bLevel);
            pVehicle = MercPtrs[ubPerson];

            // this is a ubID for soldiertype....
            AddFuelToVehicle(pSoldier, pVehicle);

            fInterfacePanelDirty = DIRTYLEVEL2;
          }
          break;

        case 770:

          PlayJA2Sample(Enum330.USE_WIRE_CUTTERS, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
          break;

        case 771:

          PlayJA2Sample(Enum330.BLOODCAT_ATTACK, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
          break;

        case 772:

          // CODE: FOR A REALTIME NON-INTERRUPTABLE SCRIPT - SIGNAL DONE
          pSoldier.fRTInNonintAnim = false;
          break;

        case 773:

          // Kneel up...
          if (!pSoldier.bStealthMode) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.KNEEL_UP_SOUND, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 774:

          // Kneel down..
          if (!pSoldier.bStealthMode) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.KNEEL_DOWN_SOUND, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 775:

          // prone up..
          if (!pSoldier.bStealthMode) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.PRONE_UP_SOUND, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 776:

          // prone down..
          if (!pSoldier.bStealthMode) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.PRONE_DOWN_SOUND, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 777:

          // picking something up
          if (!pSoldier.bStealthMode) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.PICKING_SOMETHING_UP, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 778:
          if (!pSoldier.bStealthMode) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ENTER_DEEP_WATER_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 779:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.COW_FALL, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 780:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.COW_HIT_SND, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 781:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.ACR_DIE_PART2, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          break;

        case 782:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.CREATURE_DISSOLVE_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          break;

        case 784:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.CREATURE_FALL, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          break;

        case 785:

          if (Random(5) == 0) {
            PlaySoldierJA2Sample(pSoldier.ubID, Enum330.CROW_PECKING_AT_FLESH, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          }
          break;

        case 786:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.CROW_FLYING_AWAY, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 787:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.SLAP_1, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), false);
          break;

        case 788:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.MORTAR_START, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 789:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.MORTAR_LOAD, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 790:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.COW_FALL_2, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;

        case 791:

          PlaySoldierJA2Sample(pSoldier.ubID, Enum330.FENCE_OPEN, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo), true);
          break;
      }
      // Adjust frame control pos, and try again
      pSoldier.usAniCode++;
    } else if (sNewAniFrame == 999) {
      // Go to start, by default
      pSoldier.usAniCode = 0;
    }

    // Loop here until we break on a real item!
  } while (true);

  // We're done
  return true;
}

const MIN_DEADLINESS_FOR_LIKE_GUN_QUOTE = 20;

function ShouldMercSayHappyWithGunQuote(pSoldier: SOLDIERTYPE): boolean {
  // How do we do this....

  if (QuoteExp_GotGunOrUsedGun[pSoldier.ubProfile] == Enum202.QUOTE_SATISFACTION_WITH_GUN_AFTER_KILL) {
    // For one, only once a day...
    if (pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_LIKESGUN) {
      return false;
    }

    // is it a gun?
    if (Item[pSoldier.usAttackingWeapon].usItemClass & IC_GUN) {
      // Is our weapon powerfull enough?
      if (Weapon[pSoldier.usAttackingWeapon].ubDeadliness > MIN_DEADLINESS_FOR_LIKE_GUN_QUOTE) {
        // 20 % chance?
        if (Random(100) < 20) {
          return true;
        }
      }
    }
  }

  return false;
}

function SayBuddyWitnessedQuoteFromKill(pKillerSoldier: SOLDIERTYPE, sGridNo: INT16, bLevel: INT8): void {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let bBuddyIndex: INT8[] /* [20] */ = createArray(20, -1);
  let bTempBuddyIndex: INT8;
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;
  let sDistVisible: INT16 = 0;
  let usQuoteNum: UINT16;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier) && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.fMercAsleep && pTeamSoldier.sGridNo != NOWHERE) {
      // Are we a buddy of killer?
      bTempBuddyIndex = WhichBuddy(pTeamSoldier.ubProfile, pKillerSoldier.ubProfile);

      if (bTempBuddyIndex != -1) {
        switch (bTempBuddyIndex) {
          case 0:
            if (pTeamSoldier.usQuoteSaidExtFlags & SOLDIER_QUOTE_SAID_BUDDY_1_WITNESSED) {
              continue;
            }
            break;

          case 1:
            if (pTeamSoldier.usQuoteSaidExtFlags & SOLDIER_QUOTE_SAID_BUDDY_2_WITNESSED) {
              continue;
            }
            break;

          case 2:
            if (pTeamSoldier.usQuoteSaidExtFlags & SOLDIER_QUOTE_SAID_BUDDY_3_WITNESSED) {
              continue;
            }
            break;
        }

        // TO LOS check to killed
        // Can we see location of killer?
        sDistVisible = DistanceVisible(pTeamSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, pKillerSoldier.sGridNo, pKillerSoldier.bLevel);
        if (SoldierTo3DLocationLineOfSightTest(pTeamSoldier, pKillerSoldier.sGridNo, pKillerSoldier.bLevel, 3, sDistVisible, true) == 0) {
          continue;
        }

        // Can we see location of killed?
        sDistVisible = DistanceVisible(pTeamSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, bLevel);
        if (SoldierTo3DLocationLineOfSightTest(pTeamSoldier, sGridNo, bLevel, 3, sDistVisible, true) == 0) {
          continue;
        }

        // OK, a good candidate...
        ubMercsInSector[ubNumMercs] = cnt;
        bBuddyIndex[ubNumMercs] = bTempBuddyIndex;
        ubNumMercs++;
      }
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    // Do random check here...
    if (Random(100) < 20) {
      ubChosenMerc = Random(ubNumMercs);

      switch (bBuddyIndex[ubChosenMerc]) {
        case 0:
          usQuoteNum = Enum202.QUOTE_BUDDY_1_GOOD;
          MercPtrs[ubMercsInSector[ubChosenMerc]].usQuoteSaidExtFlags |= SOLDIER_QUOTE_SAID_BUDDY_1_WITNESSED;
          break;

        case 1:
          usQuoteNum = Enum202.QUOTE_BUDDY_2_GOOD;
          MercPtrs[ubMercsInSector[ubChosenMerc]].usQuoteSaidExtFlags |= SOLDIER_QUOTE_SAID_BUDDY_2_WITNESSED;
          break;

        case 2:
          usQuoteNum = Enum202.QUOTE_LEARNED_TO_LIKE_WITNESSED;
          MercPtrs[ubMercsInSector[ubChosenMerc]].usQuoteSaidExtFlags |= SOLDIER_QUOTE_SAID_BUDDY_3_WITNESSED;
          break;

        default:
          throw new Error('Should be unreachable');
      }
      TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], usQuoteNum);
    }
  }
}

export function HandleKilledQuote(pKilledSoldier: SOLDIERTYPE, pKillerSoldier: SOLDIERTYPE, sGridNo: INT16, bLevel: INT8): void {
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let fDoSomeoneElse: boolean = false;
  let fCanWeSeeLocation: boolean = false;
  let sDistVisible: INT16 = 0;

  gfLastMercTalkedAboutKillingID = pKilledSoldier.ubID;

  // Can we see location?
  sDistVisible = DistanceVisible(pKillerSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, bLevel);

  fCanWeSeeLocation = (SoldierTo3DLocationLineOfSightTest(pKillerSoldier, sGridNo, bLevel, 3, sDistVisible, true) != 0);

  // Are we killing mike?
  if (pKilledSoldier.ubProfile == 149 && pKillerSoldier.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
    // Can we see?
    if (fCanWeSeeLocation) {
      TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_AIM_KILLED_MIKE);
    }
  }
  // Are we killing factory mamager?
  else if (pKilledSoldier.ubProfile == 139) {
    // Can we see?
    // f ( fCanWeSeeLocation )
    { TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_KILLED_FACTORY_MANAGER); }
  } else {
    // Steps here...

    // If not head shot, just say killed quote

    // If head shot...

    // If we have a head shot saying,, randomly try that one

    // If not doing that one, search for anybody who can see person

    // If somebody did, play his quote plus attackers killed quote.

    // Checkf for headhot!
    if (pKilledSoldier.usAnimState == Enum193.JFK_HITDEATH) {
      // Randomliy say it!
      if (Random(100) < 40) {
        TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_HEADSHOT);
      } else {
        fDoSomeoneElse = true;
      }

      if (fDoSomeoneElse) {
        // Check if a person is here that has this quote....
        cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

        // run through list
        for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
          if (cnt != pKillerSoldier.ubID) {
            if (OK_INSECTOR_MERC(pTeamSoldier) && !(pTeamSoldier.uiStatusFlags & SOLDIER_GASSED) && !AM_AN_EPC(pTeamSoldier)) {
              // Can we see location?
              sDistVisible = DistanceVisible(pTeamSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, bLevel);

              if (SoldierTo3DLocationLineOfSightTest(pTeamSoldier, sGridNo, bLevel, 3, sDistVisible, true)) {
                ubMercsInSector[ubNumMercs] = cnt;
                ubNumMercs++;
              }
            }
          }
        }

        // Did we find anybody?
        if (ubNumMercs > 0) {
          ubChosenMerc = Random(ubNumMercs);

          // We have a random chance of not saying our we killed a guy quote
          if (Random(100) < 50) {
            // Say this guys quote but the killer's quote as well....
            // if killed was not a plain old civ, say quote
            if (pKilledSoldier.bTeam != CIV_TEAM || pKilledSoldier.ubCivilianGroup != 0) {
              TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_KILLED_AN_ENEMY);
            }
          }

          TacticalCharacterDialogue(MercPtrs[ubMercsInSector[ubChosenMerc]], Enum202.QUOTE_HEADSHOT);
        } else {
          // Can we see?
          if (fCanWeSeeLocation) {
            // Say this guys quote but the killer's quote as well....
            // if killed was not a plain old civ, say quote
            if (pKilledSoldier.bTeam != CIV_TEAM || pKilledSoldier.ubCivilianGroup != 0) {
              TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_KILLED_AN_ENEMY);
            }
          }
        }
      }
    } else {
      // Can we see?
      if (fCanWeSeeLocation) {
        // if killed was not a plain old civ, say quote
        if (pKilledSoldier.bTeam != CIV_TEAM || pKilledSoldier.ubCivilianGroup != 0) {
          // Are we happy with our gun?
          if (ShouldMercSayHappyWithGunQuote(pKillerSoldier)) {
            TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_SATISFACTION_WITH_GUN_AFTER_KILL);
            pKillerSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_LIKESGUN;
          } else
          // Randomize between laugh, quote...
          {
            if (Random(100) < 33 && pKilledSoldier.ubBodyType != Enum194.BLOODCAT) {
              // If it's a creature......
              if (pKilledSoldier.uiStatusFlags & SOLDIER_MONSTER) {
                TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_KILLED_A_CREATURE);
              } else {
                TacticalCharacterDialogue(pKillerSoldier, Enum202.QUOTE_KILLED_AN_ENEMY);
              }
            } else {
              if (Random(50) == 25) {
                DoMercBattleSound(pKillerSoldier, (Enum259.BATTLE_SOUND_LAUGH1));
              } else {
                DoMercBattleSound(pKillerSoldier, (Enum259.BATTLE_SOUND_COOL1));
              }
            }
          }

          // Buddy witnessed?
          SayBuddyWitnessedQuoteFromKill(pKillerSoldier, sGridNo, bLevel);
        }
      }
    }
  }
}

export function HandleSoldierDeath(pSoldier: SOLDIERTYPE, pfMadeCorpse: Pointer<boolean>): boolean {
  let fBuddyJustDead: boolean = false;

  pfMadeCorpse.value = false;

  if (pSoldier.bLife == 0 && !(pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
    // Cancel services here...
    ReceivingSoldierCancelServices(pSoldier);
    GivingSoldierCancelServices(pSoldier);

    if (pSoldier.iMuzFlash != -1) {
      LightSpriteDestroy(pSoldier.iMuzFlash);
      pSoldier.iMuzFlash = -1;
    }
    if (pSoldier.iLight != -1) {
      LightSpriteDestroy(pSoldier.iLight);
    }

    // FREEUP GETTING HIT FLAG
    pSoldier.fGettingHit = 0;

    // Find next closest team member!
    if (pSoldier.bTeam == gbPlayerNum) {
      // Set guy to close panel!
      // ONLY IF VISIBLE ON SCREEN
      if (IsMercPortraitVisible(pSoldier.ubID)) {
        fInterfacePanelDirty = DIRTYLEVEL2;
      }
      pSoldier.fUIdeadMerc = true;

      if (!gfKillingGuysForLosingBattle) {
        // ATE: THIS IS S DUPLICATE SETTING OF SOLDIER_DEAD. Is set in StrategicHandlePlayerTeamMercDeath()
        // also, but here it's needed to tell tectical to ignore this dude...
        // until StrategicHandlePlayerTeamMercDeath() can get called after death skull interface is done
        pSoldier.uiStatusFlags |= SOLDIER_DEAD;
      }
    } else {
      let ubAssister: UINT8;

      // IF this guy has an attacker and he's a good guy, play sound
      if (pSoldier.ubAttackerID != NOBODY) {
        if (MercPtrs[pSoldier.ubAttackerID].bTeam == gbPlayerNum && gTacticalStatus.ubAttackBusyCount > 0) {
          gTacticalStatus.fKilledEnemyOnAttack = true;
          gTacticalStatus.ubEnemyKilledOnAttack = pSoldier.ubID;
          gTacticalStatus.ubEnemyKilledOnAttackLocation = pSoldier.sGridNo;
          gTacticalStatus.bEnemyKilledOnAttackLevel = pSoldier.bLevel;
          gTacticalStatus.ubEnemyKilledOnAttackKiller = pSoldier.ubAttackerID;

          // also check if we are in mapscreen, if so update soldier's list
          if (guiCurrentScreen == Enum26.MAP_SCREEN) {
            ReBuildCharactersList();
          }
        } else if (pSoldier.bVisible == 1) {
          // We were a visible enemy, say laugh!
          if (Random(3) == 0 && !CREATURE_OR_BLOODCAT(MercPtrs[pSoldier.ubAttackerID])) {
            DoMercBattleSound(MercPtrs[pSoldier.ubAttackerID], Enum259.BATTLE_SOUND_LAUGH1);
          }
        }
      }

      // Handle NPC Dead
      HandleNPCTeamMemberDeath(pSoldier);

      // if a friendly with a profile, increment kills
      // militia also now track kills...
      if (pSoldier.ubAttackerID != NOBODY) {
        if (MercPtrs[pSoldier.ubAttackerID].bTeam == gbPlayerNum) {
          // increment kills
          gMercProfiles[MercPtrs[pSoldier.ubAttackerID].ubProfile].usKills++;
          gStrategicStatus.usPlayerKills++;
        } else if (MercPtrs[pSoldier.ubAttackerID].bTeam == MILITIA_TEAM) {
          // get a kill! 2 points!
          MercPtrs[pSoldier.ubAttackerID].ubMilitiaKills += 2;
        }
      }

      // JA2 Gold: if previous and current attackers are the same, the next-to-previous attacker gets the assist
      if (pSoldier.ubPreviousAttackerID == pSoldier.ubAttackerID) {
        ubAssister = pSoldier.ubNextToPreviousAttackerID;
      } else {
        ubAssister = pSoldier.ubPreviousAttackerID;
      }

      if (ubAssister != NOBODY && ubAssister != pSoldier.ubAttackerID) {
        if (MercPtrs[ubAssister].bTeam == gbPlayerNum) {
          gMercProfiles[MercPtrs[ubAssister].ubProfile].usAssists++;
        } else if (MercPtrs[ubAssister].bTeam == MILITIA_TEAM) {
          // get an assist - 1 points
          MercPtrs[ubAssister].ubMilitiaKills += 1;
        }
      }
      /*
      // handle assist
      // if killer is assister, don't increment
      if ( pSoldier->ubPreviousAttackerID != NOBODY && pSoldier->ubPreviousAttackerID != pSoldier->ubAttackerID )
      {
              if ( MercPtrs[ pSoldier->ubPreviousAttackerID ]->bTeam == gbPlayerNum )
              {
                      gMercProfiles[ MercPtrs[ pSoldier->ubPreviousAttackerID ]->ubProfile ].usAssists++;
              }
              else if ( MercPtrs[ pSoldier->ubPreviousAttackerID ]->bTeam == MILITIA_TEAM )
              {
                      // get an assist - 1 points
                      MercPtrs[ pSoldier->ubPreviousAttackerID ]->ubMilitiaKills += 1;
              }
      }
      */
    }

    if (TurnSoldierIntoCorpse(pSoldier, true, true)) {
      pfMadeCorpse.value = true;
    }

    // Remove mad as target, one he has died!
    RemoveManAsTarget(pSoldier);

    // Re-evaluate visiblitiy for the team!
    BetweenTurnsVisibilityAdjustments();

    if (pSoldier.bTeam != gbPlayerNum) {
      if (!pSoldier.fDoingExternalDeath) {
        // Release attacker
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, code 497 = handle soldier death"));
        ReleaseSoldiersAttacker(pSoldier);
      }
    }

    if (!(pfMadeCorpse.value)) {
      fBuddyJustDead = true;
    }
  }

  if (pSoldier.bLife > 0) {
    // If we are here - something funny has heppende
    // We either have played a death animation when we are not dead, or we are calling
    // this ani code in an animation which is not a death animation
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Soldier Ani: Death animation called when not dead...");
  }

  return fBuddyJustDead;
}

export function HandlePlayerTeamMemberDeathAfterSkullAnimation(pSoldier: SOLDIERTYPE): void {
  // Release attacker
  if (!pSoldier.fDoingExternalDeath) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("@@@@@@@ Releasesoldierattacker, code 497 = handle soldier death"));
    ReleaseSoldiersAttacker(pSoldier);
  }

  HandlePlayerTeamMemberDeath(pSoldier);

  // now remove character from a squad
  RemoveCharacterFromSquads(pSoldier);
}

export function CheckForAndHandleSoldierDeath(pSoldier: SOLDIERTYPE, pfMadeCorpse: Pointer<boolean>): boolean {
  if (HandleSoldierDeath(pSoldier, pfMadeCorpse)) {
    // Select approriate death
    switch (pSoldier.usAnimState) {
      case Enum193.FLYBACK_HIT_DEATH:
        ChangeSoldierState(pSoldier, Enum193.FLYBACK_HITDEATH_STOP, 0, false);
        break;

      case Enum193.GENERIC_HIT_DEATH:
        ChangeSoldierState(pSoldier, Enum193.FALLFORWARD_HITDEATH_STOP, 0, false);
        break;

      case Enum193.FALLBACK_HIT_DEATH:
        ChangeSoldierState(pSoldier, Enum193.FALLBACK_HITDEATH_STOP, 0, false);
        break;

      case Enum193.PRONE_HIT_DEATH:
        ChangeSoldierState(pSoldier, Enum193.PRONE_HITDEATH_STOP, 0, false);
        break;

      case Enum193.JFK_HITDEATH:
        ChangeSoldierState(pSoldier, Enum193.JFK_HITDEATH_STOP, 0, false);
        break;

      case Enum193.FALLOFF_DEATH:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_DEATH_STOP, 0, false);
        break;

      case Enum193.FALLOFF_FORWARD_DEATH:
        ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_DEATH_STOP, 0, false);
        break;

      case Enum193.WATER_DIE:
        ChangeSoldierState(pSoldier, Enum193.WATER_DIE_STOP, 0, false);
        break;

      case Enum193.DEEP_WATER_DIE:
        ChangeSoldierState(pSoldier, Enum193.DEEP_WATER_DIE_STOPPING, 0, false);
        break;

      case Enum193.COW_DYING:
        ChangeSoldierState(pSoldier, Enum193.COW_DYING_STOP, 0, false);
        break;

      case Enum193.BLOODCAT_DYING:
        ChangeSoldierState(pSoldier, Enum193.BLOODCAT_DYING_STOP, 0, false);
        break;

      default:

        // IF we are here - something is wrong - we should have an animation stop here
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Soldier Ani: CODE 440 Error, Death STOP not handled");
    }

    return true;
  }

  return false;
}

//#define TESTFALLBACK
//#define TESTFALLFORWARD

function CheckForAndHandleSoldierIncompacitated(pSoldier: SOLDIERTYPE): void {
  let sNewGridNo: INT16;

  if (pSoldier.bLife < OKLIFE) {
    // Cancel services here...
    ReceivingSoldierCancelServices(pSoldier);
    GivingSoldierCancelServices(pSoldier);

    // If we are a monster, set life to zero ( no unconscious )
    switch (pSoldier.ubBodyType) {
      case Enum194.ADULTFEMALEMONSTER:
      case Enum194.AM_MONSTER:
      case Enum194.YAF_MONSTER:
      case Enum194.YAM_MONSTER:
      case Enum194.LARVAE_MONSTER:
      case Enum194.INFANT_MONSTER:
      case Enum194.CRIPPLECIV:
      case Enum194.ROBOTNOWEAPON:
      case Enum194.QUEENMONSTER:
      case Enum194.TANK_NW:
      case Enum194.TANK_NE:

        pSoldier.bLife = 0;
        break;
    }

    // OK, if we are in a meanwhile and this is elliot...
    if (AreInMeanwhile()) {
      let pQueen: SOLDIERTYPE | null;

      pQueen = FindSoldierByProfileID(Enum268.QUEEN, false);

      if (pQueen) {
        TriggerNPCWithGivenApproach(Enum268.QUEEN, Enum296.APPROACH_DONE_SLAPPED, false);
      }
    }

    // We are unconscious now, play randomly, this animation continued, or a new death
    if (CheckSoldierHitRoof(pSoldier)) {
      return;
    }

    // If guy is now dead, play sound!
    if (pSoldier.bLife == 0) {
      if (!AreInMeanwhile()) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
        pSoldier.fDeadSoundPlayed = true;
      }
    }

    // Randomly fall back or forward, if we are in the standing hit animation
    if (pSoldier.usAnimState == Enum193.GENERIC_HIT_STAND || pSoldier.usAnimState == Enum193.STANDING_BURST_HIT || pSoldier.usAnimState == Enum193.RIFLE_STAND_HIT) {
      let bTestDirection: INT8 = pSoldier.bDirection;
      let fForceDirection: boolean = false;
      let fDoFallback: boolean = false;

      // TRY FALLING BACKWARDS, ( ONLY IF WE ARE A MERC! )
      if (Random(100) > 40 && IS_MERC_BODY_TYPE(pSoldier) && !IsProfileATerrorist(pSoldier.ubProfile))
      {
        // CHECK IF WE HAVE AN ATTACKER, TAKE OPPOSITE DIRECTION!
        if (pSoldier.ubAttackerID != NOBODY) {
          // Find direction!
          bTestDirection = GetDirectionFromGridNo(MercPtrs[pSoldier.ubAttackerID].sGridNo, pSoldier);
          fForceDirection = true;
        }

        sNewGridNo = pSoldier.sGridNo;

        if (OKFallDirection(pSoldier, sNewGridNo, pSoldier.bLevel, bTestDirection, Enum193.FALLBACK_HIT_STAND)) {
          // SECOND GRIDNO
          sNewGridNo = NewGridNo(sNewGridNo, DirectionInc(gOppositeDirection[bTestDirection]));

          if (OKFallDirection(pSoldier, sNewGridNo, pSoldier.bLevel, bTestDirection, Enum193.FALLBACK_HIT_STAND)) {
            // ALL'S OK HERE..... IF WE FORCED DIRECTION, SET!
            if (fForceDirection) {
              EVENT_SetSoldierDesiredDirection(pSoldier, bTestDirection);
              EVENT_SetSoldierDirection(pSoldier, bTestDirection);
            }
            ChangeToFallbackAnimation(pSoldier, pSoldier.bDirection);
            return;
          } else {
            fDoFallback = true;
          }
        } else {
          fDoFallback = true;
        }
      } else {
        fDoFallback = true;
      }

      if (fDoFallback) {
        // 1 )REC DIRECTION
        // 2 ) SET FLAG FOR STARTING TO FALL
        BeginTyingToFall(pSoldier);
        ChangeSoldierState(pSoldier, Enum193.FALLFORWARD_FROMHIT_STAND, 0, false);
        return;
      }
    } else if (pSoldier.usAnimState == Enum193.GENERIC_HIT_CROUCH) {
      ChangeSoldierState(pSoldier, Enum193.FALLFORWARD_FROMHIT_CROUCH, 0, false);
      BeginTyingToFall(pSoldier);
      return;
    } else if (pSoldier.usAnimState == Enum193.GENERIC_HIT_PRONE) {
      ChangeSoldierState(pSoldier, Enum193.PRONE_LAY_FROMHIT, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.ADULTMONSTER_HIT) {
      ChangeSoldierState(pSoldier, Enum193.ADULTMONSTER_DYING, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.LARVAE_HIT) {
      ChangeSoldierState(pSoldier, Enum193.LARVAE_DIE, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.QUEEN_HIT) {
      ChangeSoldierState(pSoldier, Enum193.QUEEN_DIE, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.CRIPPLE_HIT) {
      ChangeSoldierState(pSoldier, Enum193.CRIPPLE_DIE, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.ROBOTNW_HIT) {
      ChangeSoldierState(pSoldier, Enum193.ROBOTNW_DIE, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.INFANT_HIT) {
      ChangeSoldierState(pSoldier, Enum193.INFANT_DIE, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.COW_HIT) {
      ChangeSoldierState(pSoldier, Enum193.COW_DYING, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.BLOODCAT_HIT) {
      ChangeSoldierState(pSoldier, Enum193.BLOODCAT_DYING, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.WATER_HIT) {
      ChangeSoldierState(pSoldier, Enum193.WATER_DIE, 0, false);
      return;
    } else if (pSoldier.usAnimState == Enum193.DEEP_WATER_HIT) {
      ChangeSoldierState(pSoldier, Enum193.DEEP_WATER_DIE, 0, false);
      return;
    } else {
      // We have missed something here - send debug msg
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Soldier Ani: Genmeric hit not chained");
    }
  }
}

export function CheckForAndHandleSoldierDyingNotFromHit(pSoldier: SOLDIERTYPE): boolean {
  if (pSoldier.bLife == 0) {
    DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_DIE1);
    pSoldier.fDeadSoundPlayed = true;

    // Increment  being attacked count
    pSoldier.bBeingAttackedCount++;

    if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
      switch (pSoldier.usAnimState) {
        case Enum193.FLYBACKHIT_STOP:
          ChangeSoldierState(pSoldier, Enum193.FLYBACK_HIT_DEATH, 0, false);
          break;

        case Enum193.FALLFORWARD_FROMHIT_STAND:
        case Enum193.FALLFORWARD_FROMHIT_CROUCH:
        case Enum193.STAND_FALLFORWARD_STOP:
          ChangeSoldierState(pSoldier, Enum193.GENERIC_HIT_DEATH, 0, false);
          break;

        case Enum193.FALLBACKHIT_STOP:
          ChangeSoldierState(pSoldier, Enum193.FALLBACK_HIT_DEATH, 0, false);
          break;

        case Enum193.PRONE_LAYFROMHIT_STOP:
        case Enum193.PRONE_LAY_FROMHIT:

          ChangeSoldierState(pSoldier, Enum193.PRONE_HIT_DEATH, 0, false);
          break;

        case Enum193.FALLOFF_STOP:
          ChangeSoldierState(pSoldier, Enum193.FALLOFF_DEATH, 0, false);
          break;

        case Enum193.FALLOFF_FORWARD_STOP:
          ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_DEATH, 0, false);
          break;

        case Enum193.ADULTMONSTER_HIT:
          ChangeSoldierState(pSoldier, Enum193.ADULTMONSTER_DYING, 0, false);
          break;

        case Enum193.LARVAE_HIT:
          ChangeSoldierState(pSoldier, Enum193.LARVAE_DIE, 0, false);
          break;

        case Enum193.QUEEN_HIT:
          ChangeSoldierState(pSoldier, Enum193.QUEEN_DIE, 0, false);
          break;

        case Enum193.CRIPPLE_HIT:
          ChangeSoldierState(pSoldier, Enum193.CRIPPLE_DIE, 0, false);
          break;

        case Enum193.ROBOTNW_HIT:
          ChangeSoldierState(pSoldier, Enum193.ROBOTNW_DIE, 0, false);
          break;

        case Enum193.INFANT_HIT:
          ChangeSoldierState(pSoldier, Enum193.INFANT_DIE, 0, false);
          break;

        case Enum193.COW_HIT:
          ChangeSoldierState(pSoldier, Enum193.COW_DYING, 0, false);
          break;

        case Enum193.BLOODCAT_HIT:
          ChangeSoldierState(pSoldier, Enum193.BLOODCAT_DYING, 0, false);
          break;

        default:
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Soldier Control: Death state %d has no death hit", pSoldier.usAnimState));
          {
            let fMadeCorpse: boolean = false;
            CheckForAndHandleSoldierDeath(pSoldier, createPointer(() => fMadeCorpse, (v) => fMadeCorpse = v));
          }
          break;
      }
    } else {
      let fMadeCorpse: boolean = false;

      CheckForAndHandleSoldierDeath(pSoldier, createPointer(() => fMadeCorpse, (v) => fMadeCorpse = v));
    }
    return true;
  }

  return false;
}

function CheckForImproperFireGunEnd(pSoldier: SOLDIERTYPE): boolean {
  if (AM_A_ROBOT(pSoldier)) {
    return false;
  }

  // Check single hand for jammed status, ( or ammo is out.. )
  if (pSoldier.inv[Enum261.HANDPOS].bGunAmmoStatus < 0 || pSoldier.inv[Enum261.HANDPOS].ubGunShotsLeft == 0) {
    // If we have 2 pistols, donot go back!
    if (Item[pSoldier.inv[Enum261.SECONDHANDPOS].usItem].usItemClass != IC_GUN) {
      // OK, put gun down....
      InternalSoldierReadyWeapon(pSoldier, pSoldier.bDirection, true);
      return true;
    }
  }

  return false;
}

function OKHeightDest(pSoldier: SOLDIERTYPE, sNewGridNo: INT16): boolean {
  if (pSoldier.bLevel == 0) {
    return true;
  }

  // Check if there is a lower place here....
  if (IsLowerLevel(sNewGridNo)) {
    return false;
  }

  return true;
}

function HandleUnjamAnimation(pSoldier: SOLDIERTYPE): boolean {
  // OK, play intermediate animation here..... save in pending animation data, the current
  // code we are at!
  pSoldier.uiPendingActionData1 = pSoldier.usAniCode;
  pSoldier.sPendingActionData2 = pSoldier.usAnimState;
  // Check what animatnion we should do.....
  switch (pSoldier.usAnimState) {
    case Enum193.SHOOT_RIFLE_STAND:
    case Enum193.STANDING_BURST:
    case Enum193.FIRE_STAND_BURST_SPREAD:
      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.STANDING_SHOOT_UNJAM, 0, false);
      return true;

    case Enum193.PRONE_BURST:
    case Enum193.SHOOT_RIFLE_PRONE:

      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.PRONE_SHOOT_UNJAM, 0, false);
      return true;

    case Enum193.CROUCHED_BURST:
    case Enum193.SHOOT_RIFLE_CROUCH:

      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.CROUCH_SHOOT_UNJAM, 0, false);
      return true;

    case Enum193.SHOOT_DUAL_STAND:

      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.STANDING_SHOOT_DWEL_UNJAM, 0, false);
      return true;

    case Enum193.SHOOT_DUAL_PRONE:

      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.PRONE_SHOOT_DWEL_UNJAM, 0, false);
      return true;

    case Enum193.SHOOT_DUAL_CROUCH:

      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.CROUCH_SHOOT_DWEL_UNJAM, 0, false);
      return true;

    case Enum193.FIRE_LOW_STAND:
    case Enum193.FIRE_BURST_LOW_STAND:

      // Normal shoot rifle.... play
      ChangeSoldierState(pSoldier, Enum193.STANDING_SHOOT_LOW_UNJAM, 0, false);
      return true;
  }

  return false;
}

export function OKFallDirection(pSoldier: SOLDIERTYPE, sGridNo: INT16, bLevel: INT8, bTestDirection: INT8, usAnimState: UINT16): boolean {
  let pStructureFileRef: STRUCTURE_FILE_REF | null;
  let usAnimSurface: UINT16;

  // How are the movement costs?
  if (gubWorldMovementCosts[sGridNo][bTestDirection][bLevel] > TRAVELCOST_SHORE) {
    return false;
  }

  // NOT ok if in water....
  if (GetTerrainType(sGridNo) == Enum315.MED_WATER || GetTerrainType(sGridNo) == Enum315.DEEP_WATER || GetTerrainType(sGridNo) == Enum315.LOW_WATER) {
    return false;
  }

  // How are we for OK dest?
  if (!NewOKDestination(pSoldier, sGridNo, true, bLevel)) {
    return false;
  }

  usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
  pStructureFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, usAnimState);

  if (pStructureFileRef) {
    let usStructureID: UINT16;
    let sTestGridNo: INT16;

    // must make sure that structure data can be added in the direction of the target

    usStructureID = pSoldier.ubID;

    // Okay this is really SCREWY but it's due to the way this function worked before and must
    // work now.  The function is passing in an adjacent gridno but we need to place the structure
    // data in the tile BEFORE.  So we take one step back in the direction opposite to bTestDirection
    // and use that gridno
    sTestGridNo = NewGridNo(sGridNo, (DirectionInc(gOppositeDirection[bTestDirection])));

    if (!OkayToAddStructureToWorld(sTestGridNo, bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[bTestDirection]], usStructureID)) {
      // can't go in that dir!
      return false;
    }
  }

  return true;
}

export function HandleCheckForDeathCommonCode(pSoldier: SOLDIERTYPE): boolean {
  // Do we have a primary pending animation?
  if (pSoldier.usPendingAnimation2 != NO_PENDING_ANIMATION) {
    ChangeSoldierState(pSoldier, pSoldier.usPendingAnimation2, 0, false);
    pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;
    return true;
  }

  // CHECK IF WE HAVE A PENDING ANIMATION HERE
  if (pSoldier.usPendingAnimation != NO_PENDING_ANIMATION) {
    ChangeSoldierState(pSoldier, pSoldier.usPendingAnimation, 0, false);
    pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
    return true;
  }

  // OTHERWISE, GOTO APPROPRIATE STOPANIMATION!
  pSoldier.bCollapsed = true;

  // CC has requested - handle sight here...
  HandleSight(pSoldier, SIGHT_LOOK);

  // ATE: If it is our turn, make them try to getup...
  if (gTacticalStatus.ubCurrentTeam == pSoldier.bTeam) {
    // Try to getup...
    BeginSoldierGetup(pSoldier);

    // Check this to see if above worked
    if (!pSoldier.bCollapsed) {
      return true;
    }
  }

  switch (pSoldier.usAnimState) {
    case Enum193.FLYBACK_HIT:
      ChangeSoldierState(pSoldier, Enum193.FLYBACKHIT_STOP, 0, false);
      break;

    case Enum193.GENERIC_HIT_DEATHTWITCHNB:
    case Enum193.FALLFORWARD_FROMHIT_STAND:
    case Enum193.ENDFALLFORWARD_FROMHIT_CROUCH:

      ChangeSoldierState(pSoldier, Enum193.STAND_FALLFORWARD_STOP, 0, false);
      break;

    case Enum193.FALLBACK_HIT_DEATHTWITCHNB:
    case Enum193.FALLBACK_HIT_STAND:
      ChangeSoldierState(pSoldier, Enum193.FALLBACKHIT_STOP, 0, false);
      break;

    case Enum193.PRONE_HIT_DEATHTWITCHNB:
    case Enum193.PRONE_LAY_FROMHIT:

      ChangeSoldierState(pSoldier, Enum193.PRONE_LAYFROMHIT_STOP, 0, false);
      break;

    case Enum193.FALLOFF:
      ChangeSoldierState(pSoldier, Enum193.FALLOFF_STOP, 0, false);
      break;

    case Enum193.FALLFORWARD_ROOF:
      ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_STOP, 0, false);
      break;

    default:
      // IF we are here - something is wrong - we should have a death animation here
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Soldier Ani: unconscious hit sequence needed for animation %d", pSoldier.usAnimState));
  }
  // OTHERWISE, GOTO APPROPRIATE STOPANIMATION!
  pSoldier.bCollapsed = true;

  // ATE: If it is our turn, make them try to getup...
  if (gTacticalStatus.ubCurrentTeam == pSoldier.bTeam) {
    // Try to getup...
    BeginSoldierGetup(pSoldier);

    // Check this to see if above worked
    if (!pSoldier.bCollapsed) {
      return true;
    }
  }

  switch (pSoldier.usAnimState) {
    case Enum193.FLYBACK_HIT:
      ChangeSoldierState(pSoldier, Enum193.FLYBACKHIT_STOP, 0, false);
      break;

    case Enum193.GENERIC_HIT_DEATHTWITCHNB:
    case Enum193.FALLFORWARD_FROMHIT_STAND:
    case Enum193.ENDFALLFORWARD_FROMHIT_CROUCH:

      ChangeSoldierState(pSoldier, Enum193.STAND_FALLFORWARD_STOP, 0, false);
      break;

    case Enum193.FALLBACK_HIT_DEATHTWITCHNB:
    case Enum193.FALLBACK_HIT_STAND:
      ChangeSoldierState(pSoldier, Enum193.FALLBACKHIT_STOP, 0, false);
      break;

    case Enum193.PRONE_HIT_DEATHTWITCHNB:
    case Enum193.PRONE_LAY_FROMHIT:

      ChangeSoldierState(pSoldier, Enum193.PRONE_LAYFROMHIT_STOP, 0, false);
      break;

    case Enum193.FALLOFF:
      ChangeSoldierState(pSoldier, Enum193.FALLOFF_STOP, 0, false);
      break;

    case Enum193.FALLFORWARD_ROOF:
      ChangeSoldierState(pSoldier, Enum193.FALLOFF_FORWARD_STOP, 0, false);
      break;

    default:
      // IF we are here - something is wrong - we should have a death animation here
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Soldier Ani: unconscious hit sequence needed for animation %d", pSoldier.usAnimState));
  }

  return true;
}

export function KickOutWheelchair(pSoldier: SOLDIERTYPE): void {
  let sNewGridNo: INT16;

  // Move forward one gridno....
  sNewGridNo = NewGridNo(pSoldier.sGridNo, (DirectionInc(pSoldier.bDirection)));

  // ATE: Make sure that the gridno is unoccupied!
  if (!NewOKDestination(pSoldier, sNewGridNo, true, pSoldier.bLevel)) {
    // We should just stay put - will look kind of funny but nothing I can do!
    sNewGridNo = pSoldier.sGridNo;
  }

  EVENT_StopMerc(pSoldier, sNewGridNo, pSoldier.bDirection);
  pSoldier.ubBodyType = Enum194.REGMALE;
  if (pSoldier.ubProfile == Enum268.SLAY && pSoldier.bTeam == CIV_TEAM && !pSoldier.bNeutral) {
    HandleNPCDoAction(pSoldier.ubProfile, Enum213.NPC_ACTION_THREATENINGLY_RAISE_GUN, 0);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, true);
  }

  // If this person has a profile ID, set body type to regmale
  if (pSoldier.ubProfile != NO_PROFILE) {
    gMercProfiles[pSoldier.ubProfile].ubBodyType = Enum194.REGMALE;
  }
}

}
