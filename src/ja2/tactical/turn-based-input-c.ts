let gfFirstCycleMovementStarted: BOOLEAN = FALSE;

let guiSoldierFlags: UINT32;
let guiUITargetSoldierId: UINT32 = NOBODY;

let gpExchangeSoldier1: Pointer<SOLDIERTYPE>;
let gpExchangeSoldier2: Pointer<SOLDIERTYPE>;

let gfNextFireJam: BOOLEAN = FALSE;

let gubCheatLevel: UINT8 = STARTING_CHEAT_LEVEL;

function GetTBMouseButtonInput(puiNewEvent: Pointer<UINT32>): void {
  QueryTBLeftButton(puiNewEvent);
  QueryTBRightButton(puiNewEvent);
}

function QueryTBLeftButton(puiNewEvent: Pointer<UINT32>): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;
  /* static */ let fClickHoldIntercepted: BOOLEAN = FALSE;
  let fOnInterTile: BOOLEAN = FALSE;
  /* static */ let fCanCheckForSpeechAdvance: BOOLEAN = FALSE;
  /* static */ let sMoveClickGridNo: INT16 = 0;

  // LEFT MOUSE BUTTON
  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!GetMouseMapPos(addressof(usMapPos)) && !gfUIShowExitSouth) {
      return;
    }

    if (gViewportRegion.ButtonState & MSYS_LEFT_BUTTON) {
      if (!fLeftButtonDown) {
        fLeftButtonDown = TRUE;
        RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);

        {
          switch (gCurrentUIMode) {
            case Enum206.CONFIRM_ACTION_MODE:

              if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                pSoldier.value.sStartGridNo = usMapPos;
              }
              break;

            case Enum206.MOVE_MODE:

              if (giUIMessageOverlay != -1) {
                EndUIMessage();
              } else {
                if (!HandleCheckForExitArrowsInput(FALSE) && gpItemPointer == null) {
                  // First check if we clicked on a guy, if so, make selected if it's ours
                  if (gfUIFullTargetFound && (guiUIFullTargetFlags & OWNED_MERC)) {
                    if (!(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                      fClickHoldIntercepted = TRUE;

                      // Select guy
                      if (GetSoldier(addressof(pSoldier), gusUIFullTargetID) && gpItemPointer == null) {
                        if (pSoldier.value.bAssignment >= Enum117.ON_DUTY) {
                          // do nothing
                          fClickHoldIntercepted = FALSE;
                        } else {
                          puiNewEvent.value = Enum207.I_SELECT_MERC;
                        }
                      } else {
                        puiNewEvent.value = Enum207.I_SELECT_MERC;
                      }
                    }
                  } else {
                    if (InUIPlanMode()) {
                      AddUIPlan(usMapPos, UIPLAN_ACTION_MOVETO);
                    } else {
                      // We're on terrain in which we can walk, walk
                      // If we're on terrain,
                      if (gusSelectedSoldier != NO_SOLDIER) {
                        let bReturnVal: INT8 = FALSE;

                        GetSoldier(addressof(pSoldier), gusSelectedSoldier);

                        bReturnVal = HandleMoveModeInteractiveClick(usMapPos, puiNewEvent);

                        // All's OK for interactive tile?
                        if (bReturnVal == -2) {
                          // Confirm!
                          if (SelectedMercCanAffordMove()) {
                            puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                          }
                        } else if (bReturnVal == 0) {
                          if (gfUIAllMoveOn) {
                            puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                          } else {
                            if (gsCurrentActionPoints == 0) {
                              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
                            } else if (SelectedMercCanAffordMove()) {
                              let fResult: BOOLEAN;

                              if ((fResult = UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) == 1) {
                                // ATE: CHECK IF WE CAN GET TO POSITION
                                // Check if we are not in combat
                                GetSoldier(addressof(pSoldier), gusSelectedSoldier);

                                if (gsCurrentActionPoints == 0) {
                                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
                                } else {
                                  puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                                }
                              } else {
                                if (fResult == 2) {
                                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NOBODY_USING_REMOTE_STR]);
                                } else {
                                  // if ( usMapPos != sMoveClickGridNo || pSoldier->uiStatusFlags & SOLDIER_ROBOT )
                                  //{
                                  //	sMoveClickGridNo					= usMapPos;

                                  // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ CANT_MOVE_THERE_STR ] );
                                  // Goto hand cursor mode....
                                  //	*puiNewEvent					  = M_CHANGE_TO_HANDMODE;
                                  //	gsOverItemsGridNo				= usMapPos;
                                  //	gsOverItemsLevel				= gsInterfaceLevel;
                                  //}
                                  // else
                                  //{
                                  //	sMoveClickGridNo = 0;
                                  //	*puiNewEvent = M_CHANGE_TO_HANDMODE;
                                  //}
                                }
                                // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, L"Invalid move destination." );
                              }
                            }
                          }
                        }
                        // OK, our first right-click is an all-cycle
                        gfUICanBeginAllMoveCycle = FALSE;
                      }
                      fClickHoldIntercepted = TRUE;
                    }
                  }
                } else {
                  fClickHoldIntercepted = TRUE;
                  fIgnoreLeftUp = TRUE;
                }
              }
              break;
          }
        }
        if (gfUIWaitingForUserSpeechAdvance) {
          fCanCheckForSpeechAdvance = TRUE;
        }
      }

      // HERE FOR CLICK-DRAG CLICK
      switch (gCurrentUIMode) {
        case Enum206.MOVE_MODE:

          // First check if we clicked on a guy, if so, make selected if it's ours
          if (gfUIFullTargetFound) {
            // Select guy
            if ((guiUIFullTargetFlags & SELECTED_MERC) && !(guiUIFullTargetFlags & UNCONSCIOUS_MERC) && !(MercPtrs[gusUIFullTargetID].value.uiStatusFlags & SOLDIER_VEHICLE)) {
              puiNewEvent.value = Enum207.M_CHANGE_TO_ADJPOS_MODE;
              fIgnoreLeftUp = FALSE;
            }
          }
          break;
      }

      // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
      if (COUNTERDONE(Enum386.LMOUSECLICK_DELAY_COUNTER) && !fClickHoldIntercepted) {
        // Switch on UI mode
        switch (gCurrentUIMode) {}
      }
    } else {
      if (fLeftButtonDown) {
        if (!fIgnoreLeftUp) {
          // FIRST CHECK FOR ANYTIME ( NON-INTERVAL ) CLICKS
          switch (gCurrentUIMode) {
            case Enum206.ADJUST_STANCE_MODE:

              // If button has come up, change to mocve mode
              puiNewEvent.value = Enum207.PADJ_ADJUST_STANCE;
              break;
          }

          // CHECK IF WE CLICKED-HELD
          if (COUNTERDONE(Enum386.LMOUSECLICK_DELAY_COUNTER)) {
            // LEFT CLICK-HOLD EVENT
            // Switch on UI mode
            switch (gCurrentUIMode) {
              case Enum206.CONFIRM_ACTION_MODE:

                if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                  if (pSoldier.value.bDoBurst) {
                    pSoldier.value.sEndGridNo = usMapPos;

                    gfBeginBurstSpreadTracking = FALSE;

                    if (pSoldier.value.sEndGridNo != pSoldier.value.sStartGridNo) {
                      pSoldier.value.fDoSpread = TRUE;

                      PickBurstLocations(pSoldier);

                      puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                    } else {
                      pSoldier.value.fDoSpread = FALSE;
                    }

                    fClickHoldIntercepted = TRUE;
                  }
                }
                break;
            }
          }

          {
            // LEFT CLICK NORMAL EVENT
            // Switch on UI mode
            if (!fClickHoldIntercepted) {
              if (giUIMessageOverlay != -1) {
                EndUIMessage();
              } else {
                if (!HandleCheckForExitArrowsInput(TRUE)) {
                  if (gpItemPointer != null) {
                    if (HandleItemPointerClick(usMapPos)) {
                      // getout of mode
                      EndItemPointer();

                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                    }
                  } else {
                    // Check for wiating for keyboard advance
                    if (gfUIWaitingForUserSpeechAdvance && fCanCheckForSpeechAdvance) {
                      // We have a key, advance!
                      DialogueAdvanceSpeech();
                    } else {
                      switch (gCurrentUIMode) {
                        case Enum206.MENU_MODE:

                          // If we get a hit here and we're in menu mode, quit the menu mode
                          EndMenuEvent(guiCurrentEvent);
                          break;

                        case Enum206.IDLE_MODE:

                          // First check if we clicked on a guy, if so, make selected if it's ours
                          if (gfUIFullTargetFound) {
                            // Select guy
                            if (guiUIFullTargetFlags & OWNED_MERC && !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                              puiNewEvent.value = Enum207.I_SELECT_MERC;
                            }
                          }
                          break;

                        case Enum206.MOVE_MODE:

                          // Check if we should activate an interactive tile!
                          // Select guy
                          if ((guiUIFullTargetFlags & OWNED_MERC) && !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                            // Select guy
                            if (GetSoldier(addressof(pSoldier), gusUIFullTargetID) && (gpItemPointer == null) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
                              if (pSoldier.value.bAssignment >= Enum117.ON_DUTY) {
                                PopupAssignmentMenuInTactical(pSoldier);
                              }
                            }
                          }
                          break;

                        case Enum206.CONFIRM_MOVE_MODE:

                          puiNewEvent.value = Enum207.C_MOVE_MERC;
                          break;

                        case Enum206.HANDCURSOR_MODE:

                          HandleHandCursorClick(usMapPos, puiNewEvent);
                          break;

                        case Enum206.JUMPOVER_MODE:

                          if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                            if (EnoughPoints(pSoldier, gsCurrentActionPoints, 0, TRUE)) {
                              puiNewEvent.value = Enum207.JP_JUMP;
                            }
                          }
                          break;

                        case Enum206.ACTION_MODE:

                          if (InUIPlanMode()) {
                            AddUIPlan(usMapPos, UIPLAN_ACTION_FIRE);
                          } else {
                            if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                              if (!HandleUIReloading(pSoldier)) {
                                // ATE: Reset refine aim..
                                pSoldier.value.bShownAimTime = 0;

                                if (gsCurrentActionPoints == 0) {
                                  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
                                }
                                // Determine if we have enough action points!
                                else if (UIMouseOnValidAttackLocation(pSoldier) && SelectedMercCanAffordAttack()) {
                                  puiNewEvent.value = Enum207.A_CHANGE_TO_CONFIM_ACTION;
                                  pSoldier.value.sStartGridNo = usMapPos;
                                }
                              }
                            }
                          }
                          break;

                        case Enum206.CONFIRM_ACTION_MODE:

                          puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                          break;

                        case Enum206.LOOKCURSOR_MODE:
                          // If we cannot actually do anything, return to movement mode
                          puiNewEvent.value = Enum207.LC_LOOK;
                          break;

                        case Enum206.TALKCURSOR_MODE:

                          if (HandleTalkInit()) {
                            puiNewEvent.value = Enum207.TA_TALKINGMENU;
                          }
                          break;

                        case Enum206.GETTINGITEM_MODE:

                          // Remove menu!
                          // RemoveItemPickupMenu( );
                          break;

                        case Enum206.TALKINGMENU_MODE:

                          // HandleTalkingMenuEscape( TRUE );
                          break;

                        case Enum206.EXITSECTORMENU_MODE:

                          RemoveSectorExitMenu(FALSE);
                          break;

                        case Enum206.OPENDOOR_MENU_MODE:

                          CancelOpenDoorMenu();
                          HandleOpenDoorMenu();
                          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                          break;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Reset flag
        fLeftButtonDown = FALSE;
        fIgnoreLeftUp = FALSE;
        fClickHoldIntercepted = FALSE;
        fCanCheckForSpeechAdvance = FALSE;
        gfFirstCycleMovementStarted = FALSE;

        // Reset counter
        RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);
      }
    }
  } else {
    // Set mouse down to false
    // fLeftButtonDown = FALSE;

    // OK, handle special cases like if we are dragging and holding for a burst spread and
    // release mouse over another mouse region
    if (gfBeginBurstSpreadTracking) {
      if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
        pSoldier.value.fDoSpread = FALSE;
      }
      gfBeginBurstSpreadTracking = FALSE;
    }
  }
}

function QueryTBRightButton(puiNewEvent: Pointer<UINT32>): void {
  /* static */ let fClickHoldIntercepted: BOOLEAN = FALSE;
  /* static */ let fClickIntercepted: BOOLEAN = FALSE;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;
  let fDone: BOOLEAN = FALSE;
  if (!GetMouseMapPos(addressof(usMapPos))) {
    return;
  }

  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    // RIGHT MOUSE BUTTON
    if (gViewportRegion.ButtonState & MSYS_RIGHT_BUTTON) {
      if (!fRightButtonDown) {
        fRightButtonDown = TRUE;
        RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
      }

      // CHECK COMBINATIONS
      if (fLeftButtonDown) {
      } else {
        if (gpItemPointer == null) {
          // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
          if (COUNTERDONE(Enum386.RMOUSECLICK_DELAY_COUNTER) && !fClickHoldIntercepted) {
            // Switch on UI mode
            switch (gCurrentUIMode) {
              case Enum206.IDLE_MODE:
              case Enum206.ACTION_MODE:
              case Enum206.HANDCURSOR_MODE:
              case Enum206.LOOKCURSOR_MODE:
              case Enum206.TALKCURSOR_MODE:
              case Enum206.MOVE_MODE:

                // Check if we're on terrain
                // if ( !gfUIFullTargetFound )
                //{
                // ATE:
                fDone = FALSE;

                if ((guiUIFullTargetFlags & OWNED_MERC) && !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                  // Select guy
                  if (GetSoldier(addressof(pSoldier), gusUIFullTargetID) && (gpItemPointer == null) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
                    // if( pSoldier->bAssignment >= ON_DUTY )
                    {
                      PopupAssignmentMenuInTactical(pSoldier);
                      fClickHoldIntercepted = TRUE;
                    }
                  }
                }

                if (fDone == TRUE) {
                  break;
                }

                if (gusSelectedSoldier != NOBODY && !fClickHoldIntercepted) {
                  puiNewEvent.value = Enum207.U_MOVEMENT_MENU;
                  fClickHoldIntercepted = TRUE;
                }
                //}
                // else
                //{
                // If we are on a selected guy
                //	if ( guiUIFullTargetFlags & SELECTED_MERC && !( guiUIFullTargetFlags & UNCONSCIOUS_MERC ) )
                //	{
                //*puiNewEvent = U_POSITION_MENU;
                // fClickHoldIntercepted = TRUE;
                //	}
                //		else if ( guiUIFullTargetFlags & OWNED_MERC )
                //		{
                // If we are on a non-selected guy selected guy
                //		}

                //}
                break;
            }
          }
        }
      }
    } else {
      if (fRightButtonDown) {
        if (fLeftButtonDown) {
          fIgnoreLeftUp = TRUE;

          if (gpItemPointer == null) {
            // ATE:
            if (gusSelectedSoldier != NOBODY) {
              switch (gCurrentUIMode) {
                case Enum206.CONFIRM_MOVE_MODE:
                case Enum206.MOVE_MODE:

                  if (gfUICanBeginAllMoveCycle) {
                    puiNewEvent.value = Enum207.M_CYCLE_MOVE_ALL;
                  } else {
                    if (!gfFirstCycleMovementStarted) {
                      gfFirstCycleMovementStarted = TRUE;

                      // OK, set this guy's movement mode to crawling fo rthat we will start cycling in run.....
                      if (MercPtrs[gusSelectedSoldier].value.usUIMovementMode != Enum193.RUNNING) {
                        // ATE: UNLESS WE ARE IN RUNNING MODE ALREADY
                        MercPtrs[gusSelectedSoldier].value.usUIMovementMode = Enum193.CRAWLING;
                      }
                    }

                    // Give event to cycle movement
                    puiNewEvent.value = Enum207.M_CYCLE_MOVEMENT;
                    break;
                  }
              }

              // ATE: Added cancel of burst mode....
              if (gfBeginBurstSpreadTracking) {
                gfBeginBurstSpreadTracking = FALSE;
                gfRTClickLeftHoldIntercepted = TRUE;
                MercPtrs[gusSelectedSoldier].value.fDoSpread = FALSE;
                fClickHoldIntercepted = TRUE;
                puiNewEvent.value = Enum207.A_END_ACTION;
                gCurrentUIMode = Enum206.MOVE_MODE;
              }
            }
          }
        } else {
          if (!fClickHoldIntercepted && !fClickIntercepted) {
            if (gpItemPointer == null) {
              // ATE:
              if (gusSelectedSoldier != NOBODY) {
                // Switch on UI mode
                switch (gCurrentUIMode) {
                  case Enum206.IDLE_MODE:

                    break;

                  case Enum206.MOVE_MODE:

                    // We have here a change to action mode
                    puiNewEvent.value = Enum207.M_CHANGE_TO_ACTION;
                    fClickIntercepted = TRUE;
                    break;

                  case Enum206.ACTION_MODE:

                    // We have here a change to action mode
                    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                    fClickIntercepted = TRUE;
                    break;

                  case Enum206.CONFIRM_MOVE_MODE:

                    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                    fClickIntercepted = TRUE;
                    break;

                  case Enum206.HANDCURSOR_MODE:
                    // If we cannot actually do anything, return to movement mode
                    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                    break;

                  case Enum206.LOOKCURSOR_MODE:
                  case Enum206.TALKCURSOR_MODE:

                    // If we cannot actually do anything, return to movement mode
                    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                    break;

                  case Enum206.CONFIRM_ACTION_MODE:

                    if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                      HandleRightClickAdjustCursor(pSoldier, usMapPos);
                    }
                    fClickIntercepted = TRUE;
                    break;

                  case Enum206.MENU_MODE:

                    // If we get a hit here and we're in menu mode, quit the menu mode
                    EndMenuEvent(guiCurrentEvent);
                    fClickIntercepted = TRUE;
                    break;
                }
              }
            } else {
              if (gfUIFullTargetFound) {
                gfItemPointerDifferentThanDefault = !gfItemPointerDifferentThanDefault;
              }
            }
          }
        }
      }
      // Reset flag
      fRightButtonDown = FALSE;
      fClickHoldIntercepted = FALSE;
      fClickIntercepted = FALSE;

      // Reset counter
      RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
    }
  }
}

function GetTBMousePositionInput(puiNewEvent: Pointer<UINT32>): void {
  let usMapPos: UINT16;
  /* static */ let usOldMapPos: UINT16 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bHandleCode: BOOLEAN;
  /* static */ let fOnValidGuy: BOOLEAN = FALSE;
  /* static */ let uiMoveTargetSoldierId: UINT32 = NO_SOLDIER;

  if (!GetMouseMapPos(addressof(usMapPos))) {
    return;
  }

  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    // Handle highlighting stuff
    HandleObjectHighlighting();

    // Check if we have an item in our hands...
    if (gpItemPointer != null) {
      puiNewEvent.value = Enum207.A_ON_TERRAIN;
      return;
    }

    // Switch on modes
    switch (gCurrentUIMode) {
      case Enum206.LOCKUI_MODE:
        puiNewEvent.value = Enum207.LU_ON_TERRAIN;
        break;

      case Enum206.LOCKOURTURN_UI_MODE:
        puiNewEvent.value = Enum207.LA_ON_TERRAIN;
        break;

      case Enum206.IDLE_MODE:
        puiNewEvent.value = Enum207.I_ON_TERRAIN;
        break;

      case Enum206.ENEMYS_TURN_MODE:
        puiNewEvent.value = Enum207.ET_ON_TERRAIN;
        break;

      case Enum206.LOOKCURSOR_MODE:
        puiNewEvent.value = Enum207.LC_ON_TERRAIN;
        break;

      case Enum206.TALKCURSOR_MODE:
        if (uiMoveTargetSoldierId != NOBODY) {
          if (gfUIFullTargetFound) {
            if (gusUIFullTargetID != uiMoveTargetSoldierId) {
              puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
              return;
            }
          } else {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
            return;
          }
        }
        puiNewEvent.value = Enum207.T_ON_TERRAIN;
        break;

      case Enum206.MOVE_MODE:

        uiMoveTargetSoldierId = NO_SOLDIER;

        // Check for being on terrain
        if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
          if (IsValidJumpLocation(pSoldier, usMapPos, TRUE)) {
            gsJumpOverGridNo = usMapPos;
            puiNewEvent.value = Enum207.JP_ON_TERRAIN;
            return;
          } else {
            if (gfUIFullTargetFound) {
              // ATE: Don't do this automatically for enemies......
              if (MercPtrs[gusUIFullTargetID].value.bTeam != ENEMY_TEAM) {
                uiMoveTargetSoldierId = gusUIFullTargetID;
                if (IsValidTalkableNPC(gusUIFullTargetID, FALSE, FALSE, FALSE) && !_KeyDown(SHIFT) && !AM_AN_EPC(pSoldier) && !ValidQuickExchangePosition()) {
                  puiNewEvent.value = Enum207.T_CHANGE_TO_TALKING;
                  return;
                }
              }
            }
          }
        }
        puiNewEvent.value = Enum207.M_ON_TERRAIN;
        break;

      case Enum206.ACTION_MODE:

        // First check if we are on a guy, if so, make selected if it's ours
        // Check if the guy is visible
        guiUITargetSoldierId = NOBODY;

        fOnValidGuy = FALSE;

        if (gfUIFullTargetFound)
        // if ( gfUIFullTargetFound )
        {
          if (IsValidTargetMerc(gusUIFullTargetID)) {
            guiUITargetSoldierId = gusUIFullTargetID;

            if (MercPtrs[gusUIFullTargetID].value.bTeam != gbPlayerNum) {
              fOnValidGuy = TRUE;
            } else {
              if (gUIActionModeChangeDueToMouseOver) {
                puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                return;
              }
            }
          }
        } else {
          if (gUIActionModeChangeDueToMouseOver) {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
            return;
          }
        }
        puiNewEvent.value = Enum207.A_ON_TERRAIN;
        break;

      case Enum206.GETTINGITEM_MODE:

        break;

      case Enum206.TALKINGMENU_MODE:

        if (HandleTalkingMenu()) {
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
        break;

      case Enum206.EXITSECTORMENU_MODE:

        if (HandleSectorExitMenu()) {
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
        break;

      case Enum206.OPENDOOR_MENU_MODE:

        if ((bHandleCode = HandleOpenDoorMenu())) {
          // OK, IF we are not canceling, set ui back!
          if (bHandleCode == 2) {
            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
          } else {
          }
        }
        break;

      case Enum206.JUMPOVER_MODE:

        // ATE: Make sure!
        if (gsJumpOverGridNo != usMapPos) {
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        } else {
          puiNewEvent.value = Enum207.JP_ON_TERRAIN;
        }
        break;

      case Enum206.CONFIRM_MOVE_MODE:

        if (usMapPos != usOldMapPos) {
          // Switch event out of confirm mode
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;

          // Set off ALL move....
          gfUIAllMoveOn = FALSE;

          // ERASE PATH
          ErasePath(TRUE);
        }
        break;

      case Enum206.CONFIRM_ACTION_MODE:

        // DONOT CANCEL IF BURST
        if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
          if (pSoldier.value.bDoBurst) {
            pSoldier.value.sEndGridNo = usMapPos;

            if (pSoldier.value.sEndGridNo != pSoldier.value.sStartGridNo && fLeftButtonDown) {
              pSoldier.value.fDoSpread = TRUE;
              gfBeginBurstSpreadTracking = TRUE;
            }

            if (pSoldier.value.fDoSpread) {
              // Accumulate gridno
              AccumulateBurstLocation(usMapPos);

              puiNewEvent.value = Enum207.CA_ON_TERRAIN;
              break;
            }
          }
        }

        // First check if we are on a guy, if so, make selected if it's ours
        if (gfUIFullTargetFound) {
          if (guiUITargetSoldierId != gusUIFullTargetID) {
            // Switch event out of confirm mode
            puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
          } else {
            puiNewEvent.value = Enum207.CA_ON_TERRAIN;
          }
        } else {
          // OK, if we were on a guy, and now we are off, go back!
          if (fOnValidGuy) {
            // Switch event out of confirm mode
            puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
          } else {
            if (ConfirmActionCancel(usMapPos, usOldMapPos)) {
              // Switch event out of confirm mode
              puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
            } else {
              puiNewEvent.value = Enum207.CA_ON_TERRAIN;
            }
          }
        }
        break;

      case Enum206.HANDCURSOR_MODE:

        puiNewEvent.value = Enum207.HC_ON_TERRAIN;
        break;
    }

    usOldMapPos = usMapPos;
  }
}

function GetPolledKeyboardInput(puiNewEvent: Pointer<UINT32>): void {
  /* static */ let fShifted: BOOLEAN = FALSE;
  /* static */ let fShifted2: BOOLEAN = FALSE;
  /* static */ let fCtrlDown: BOOLEAN = FALSE;
  /* static */ let fAltDown: BOOLEAN = FALSE;
  /* static */ let fDeleteDown: BOOLEAN = FALSE;
  /* static */ let fEndDown: BOOLEAN = FALSE;

  // CHECK FOR POLLED KEYS!!
  // CHECK FOR CTRL
  switch (gCurrentUIMode) {
    case Enum206.DONT_CHANGEMODE:
    case Enum206.CONFIRM_MOVE_MODE:
    case Enum206.CONFIRM_ACTION_MODE:
    case Enum206.LOOKCURSOR_MODE:
    case Enum206.TALKCURSOR_MODE:
    case Enum206.IDLE_MODE:
    case Enum206.MOVE_MODE:
    case Enum206.ACTION_MODE:
    case Enum206.HANDCURSOR_MODE:

      if (_KeyDown(CTRL)) {
        if (fCtrlDown == FALSE) {
          ErasePath(TRUE);
          gfPlotNewMovement = TRUE;
        }
        fCtrlDown = TRUE;
        puiNewEvent.value = Enum207.HC_ON_TERRAIN;
      }
      if (!(_KeyDown(CTRL)) && fCtrlDown) {
        fCtrlDown = FALSE;
        puiNewEvent.value = Enum207.M_ON_TERRAIN;
        gfPlotNewMovement = TRUE;
      }
      break;
  }

  // CHECK FOR ALT
  switch (gCurrentUIMode) {
    case Enum206.MOVE_MODE:

      if (_KeyDown(ALT)) {
        if (fAltDown == FALSE) {
          // Get currently selected guy and change reverse....
          if (gusSelectedSoldier != NOBODY) {
            gUIUseReverse = TRUE;
            ErasePath(TRUE);
            gfPlotNewMovement = TRUE;
          }
        }
        fAltDown = TRUE;
      }
      if (!(_KeyDown(ALT)) && fAltDown) {
        if (gusSelectedSoldier != NOBODY) {
          gUIUseReverse = FALSE;
          ErasePath(TRUE);
          gfPlotNewMovement = TRUE;
        }

        fAltDown = FALSE;
      }
      break;
  }

  // Check realtime input!
  if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
    // if ( _KeyDown( CAPS )  ) //&& !fShifted )
    //{
    //	fShifted = TRUE;
    //	if ( gCurrentUIMode != ACTION_MODE && gCurrentUIMode != CONFIRM_ACTION_MODE )
    //	{
    //		*puiNewEvent = CA_ON_TERRAIN;
    //	}
    //}
    // if ( !(_KeyDown( CAPS ) ) && fShifted )
    //{
    //	fShifted = FALSE;
    //	{
    //		*puiNewEvent = M_ON_TERRAIN;
    //	}
    //}

    if (_KeyDown(SHIFT)) //&& !fShifted )
    {
      fShifted2 = TRUE;
      if (gCurrentUIMode != Enum206.MOVE_MODE && gCurrentUIMode != Enum206.CONFIRM_MOVE_MODE) {
        // puiNewEvent = M_ON_TERRAIN;
      }
    }
    if (!(_KeyDown(SHIFT)) && fShifted2) {
      fShifted2 = FALSE;
      if (gCurrentUIMode != Enum206.ACTION_MODE && gCurrentUIMode != Enum206.CONFIRM_ACTION_MODE) {
        //	*puiNewEvent = A_ON_TERRAIN;
      }
    }
  }

  if (_KeyDown(DEL)) {
    DisplayCoverOfSelectedGridNo();

    fDeleteDown = TRUE;
  }

  if (!_KeyDown(DEL) && fDeleteDown) {
    RemoveCoverOfSelectedGridNo();

    fDeleteDown = FALSE;
  }

  if (_KeyDown(END)) {
    DisplayGridNoVisibleToSoldierGrid();

    fEndDown = TRUE;
  }

  if (!_KeyDown(END) && fEndDown) {
    RemoveVisibleGridNoAtSelectedGridNo();

    fEndDown = FALSE;
  }
}

function GetKeyboardInput(puiNewEvent: Pointer<UINT32>): void {
  let InputEvent: InputAtom;
  let fKeyTaken: BOOLEAN = FALSE;
  let MousePos: POINT;
  // SOLDIERTYPE				*pSoldier;
  /* static */ let fShifted: BOOLEAN = FALSE;
  /* static */ let fShifted2: BOOLEAN = FALSE;
  /* static */ let fAltDown: BOOLEAN = FALSE;
  let usMapPos: UINT16;
  let fGoodCheatLevelKey: BOOLEAN = FALSE;

  GetCursorPos(addressof(MousePos));

  GetMouseMapPos(addressof(usMapPos));

  while (DequeueEvent(addressof(InputEvent)) == TRUE) {
    // HOOK INTO MOUSE HOOKS
    switch (InputEvent.usEvent) {
      case LEFT_BUTTON_DOWN:
        MouseSystemHook(LEFT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_UP:
        MouseSystemHook(LEFT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_DOWN:
        MouseSystemHook(RIGHT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_UP:
        MouseSystemHook(RIGHT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
    }

    // handle for fast help text for interface stuff
    if (IsTheInterfaceFastHelpTextActive()) {
      if (InputEvent.usEvent == KEY_UP) {
        ShutDownUserDefineHelpTextRegions();
      }

      continue;
    }

    // Check for waiting for keyboard advance
    if (gfUIWaitingForUserSpeechAdvance && InputEvent.usEvent == KEY_UP) {
      // We have a key, advance!
      DialogueAdvanceSpeech();

      // Ignore anything else
      continue;
    }

    // ATE: if game paused because fo player, unpasue with any key
    if (gfPauseDueToPlayerGamePause && InputEvent.usEvent == KEY_UP) {
      HandlePlayerPauseUnPauseOfGame();

      continue;
    }

    if ((InputEvent.usEvent == KEY_DOWN)) {
      if (giUIMessageOverlay != -1) {
        EndUIMessage();
        continue;
      }

      // End auto bandage if we want....
      if (gTacticalStatus.fAutoBandageMode) {
        AutoBandage(FALSE);
        puiNewEvent.value = Enum207.LU_ENDUILOCK;
      }
    }

    if (gUIKeyboardHook != null) {
      fKeyTaken = gUIKeyboardHook(addressof(InputEvent));
    }
    if (fKeyTaken) {
      continue;
    }

    /*
    if( (InputEvent.usEvent == KEY_DOWN )&& ( InputEvent.usParam == ) )
    {
            HandlePlayerPauseUnPauseOfGame( );
    }
    */

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == PAUSE) && !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
      // Pause game!
      HandlePlayerPauseUnPauseOfGame();
    }

    // FIRST DO KEYS THAT ARE USED EVERYWHERE!
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == 'x') && (InputEvent.usKeyState & ALT_DOWN)) {
      HandleShortCutExitState();
      //*puiNewEvent = I_EXIT;
    }

    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == ESC)) {
      if (AreInMeanwhile() && gCurrentMeanwhileDef.ubMeanwhileID != Enum160.INTERROGATION) {
        DeleteTalkingMenu();
        EndMeanwhile();
      }
    }

    // Break of out IN CONV...
    if (CHEATER_CHEAT_LEVEL()) {
      if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ENTER) && (InputEvent.usKeyState & ALT_DOWN)) {
        if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
          gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);
          giNPCReferenceCount = 0;
        }
      }
    }

    if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
      {
        if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
          if (CHEATER_CHEAT_LEVEL()) {
            if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ENTER) && (InputEvent.usKeyState & ALT_DOWN)) {
              // ESCAPE ENEMY'S TURN
              EndAIDeadlock();

              // Decrease global busy  counter...
              gTacticalStatus.ubAttackBusyCount = 0;

              guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
              UIHandleLUIEndLock(null);
            }
            if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ENTER) && (InputEvent.usKeyState & CTRL_DOWN)) {
              EscapeUILock();
            }
          }
        } else {
          if (CHEATER_CHEAT_LEVEL() && (InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ENTER) && (InputEvent.usKeyState & CTRL_DOWN)) {
            // UNLOCK UI
            EscapeUILock();
          } else if ((InputEvent.usEvent == KEY_DOWN) && InputEvent.usParam == ENTER) {
            // Cycle through enemys
            CycleThroughKnownEnemies();
          }
        }
      }
    }

    if (gfInTalkPanel) {
      HandleTalkingMenuKeys(addressof(InputEvent), puiNewEvent);
    }

    // Do some checks based on what mode we are in
    switch (gCurrentUIMode) {
      case Enum206.EXITSECTORMENU_MODE:

        HandleSectorExitMenuKeys(addressof(InputEvent), puiNewEvent);
        continue;

      case Enum206.GETTINGITEM_MODE:

        HandleItemMenuKeys(addressof(InputEvent), puiNewEvent);
        continue;

      case Enum206.MENU_MODE:

        HandleMenuKeys(addressof(InputEvent), puiNewEvent);
        continue;

      case Enum206.OPENDOOR_MENU_MODE:

        HandleOpenDoorMenuKeys(addressof(InputEvent), puiNewEvent);
        continue;
    }

    // CHECK ESC KEYS HERE....
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == ESC)) {
      // EscapeUILock( );

      // Cancel out of spread burst...
      gfBeginBurstSpreadTracking = FALSE;
      gfRTClickLeftHoldIntercepted = TRUE;
      if (gusSelectedSoldier != NO_SOLDIER) {
        MercPtrs[gusSelectedSoldier].value.fDoSpread = FALSE;
      }

      // Befone anything, delete popup box!
      EndUIMessage();

      // CANCEL FROM PLANNING MODE!
      if (InUIPlanMode()) {
        EndUIPlan();
      }

      if (InItemDescriptionBox()) {
        DeleteItemDescriptionBox();
      } else if (InKeyRingPopup()) {
        DeleteKeyRingPopup();
      }

      if (gCurrentUIMode == Enum206.MENU_MODE) {
        // If we get a hit here and we're in menu mode, quit the menu mode
        EndMenuEvent(guiCurrentEvent);
      }

      if (gCurrentUIMode == Enum206.HANDCURSOR_MODE) {
        puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
      }

      if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
        if (gusSelectedSoldier != NO_SOLDIER) {
          // If soldier is not stationary, stop
          StopSoldier(MercPtrs[gusSelectedSoldier]);
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
        // ATE: OK, stop any mercs who are moving by selection method....
        StopRubberBandedMercFromMoving();
      }
    }

    // CHECK ESC KEYS HERE....
    if ((InputEvent.usEvent == KEY_DOWN) && (InputEvent.usParam == BACKSPACE)) {
      StopAnyCurrentlyTalkingSpeech();
    }

    // IF UI HAS LOCKED, ONLY ALLOW EXIT!
    if (gfDisableRegionActive || gfUserTurnRegionActive) {
      continue;
    }

    // Check all those we want if enemy's turn
    if ((InputEvent.usEvent == KEY_UP) && (InputEvent.usParam == 'q')) {
      if (InputEvent.usKeyState & ALT_DOWN) {
        if (CHEATER_CHEAT_LEVEL()) {
          /* static */ let fShowRoofs: BOOLEAN = TRUE;
          let x: INT32;
          let usType: UINT16;

          // Toggle removal of roofs...
          fShowRoofs = !fShowRoofs;

          for (x = 0; x < WORLD_MAX; x++) {
            for (usType = Enum313.FIRSTROOF; usType <= LASTSLANTROOF; usType++) {
              HideStructOfGivenType(x, usType, (!fShowRoofs));
            }
          }
          InvalidateWorldRedundency();
          SetRenderFlags(RENDER_FLAG_FULL);
        }
      } else if (InputEvent.usKeyState & CTRL_DOWN) {
      } else {
        if (INFORMATION_CHEAT_LEVEL()) {
          puiNewEvent.value = Enum207.I_SOLDIERDEBUG;
        }
      }
    }

    if (InputEvent.usEvent == KEY_DOWN) {
      let fAlt: BOOLEAN;
      let fCtrl: BOOLEAN;
      let fShift: BOOLEAN;
      fAlt = InputEvent.usKeyState & ALT_DOWN ? TRUE : FALSE;
      fCtrl = InputEvent.usKeyState & CTRL_DOWN ? TRUE : FALSE;
      fShift = InputEvent.usKeyState & SHIFT_DOWN ? TRUE : FALSE;
      switch (InputEvent.usParam) {
        case SPACE:

          // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
          if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV) && ((gsCurInterfacePanel != Enum215.SM_PANEL) || (ButtonList[iSMPanelButtons[Enum220.NEXTMERC_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
            if (!InKeyRingPopup()) {
              if (_KeyDown(SHIFT)) {
                let pNewSoldier: Pointer<SOLDIERTYPE>;
                let iCurrentSquad: INT32;

                if (gusSelectedSoldier != NO_SOLDIER) {
                  // only allow if nothing in hand and if in SM panel, the Change Squad button must be enabled
                  if (((gsCurInterfacePanel != Enum215.TEAM_PANEL) || (ButtonList[iTEAMPanelButtons[Enum221.CHANGE_SQUAD_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
                    // Select next squad
                    iCurrentSquad = CurrentSquad();

                    pNewSoldier = FindNextActiveSquad(MercPtrs[gusSelectedSoldier]);

                    if (pNewSoldier.value.bAssignment != iCurrentSquad) {
                      HandleLocateSelectMerc(pNewSoldier.value.ubID, LOCATEANDSELECT_MERC);

                      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SQUAD_ACTIVE], (CurrentSquad() + 1));

                      // Center to guy....
                      LocateSoldier(gusSelectedSoldier, SETLOCATOR);
                    }
                  }
                }
              } else {
                if (gusSelectedSoldier != NO_SOLDIER) {
                  // Select next merc
                  let bID: UINT8;

                  bID = FindNextMercInTeamPanel(MercPtrs[gusSelectedSoldier], FALSE, FALSE);
                  HandleLocateSelectMerc(bID, LOCATEANDSELECT_MERC);

                  // Center to guy....
                  LocateSoldier(gusSelectedSoldier, SETLOCATOR);
                }
              }

              puiNewEvent.value = Enum207.M_ON_TERRAIN;
            }
          }
          break;
        case TAB:
          // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
          if ((gpItemPointer == null) && ((gsCurInterfacePanel != Enum215.SM_PANEL) || (ButtonList[iSMPanelButtons[Enum220.UPDOWN_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
            UIHandleChangeLevel(null);

            if (gsCurInterfacePanel == Enum215.SM_PANEL) {
              // Remember soldier's new value
              gpSMCurrentMerc.value.bUIInterfaceLevel = gsInterfaceLevel;
            }
          }
          break;

        case F1:
          if (fShift) {
            HandleSelectMercSlot(0, LOCATE_MERC_ONCE);
          }
          else
            HandleSelectMercSlot(0, LOCATEANDSELECT_MERC);
          break;
        case F2:
          if (fShift)
            HandleSelectMercSlot(1, LOCATE_MERC_ONCE);
          else
            HandleSelectMercSlot(1, LOCATEANDSELECT_MERC);
          break;
        case F3:
          if (fShift)
            HandleSelectMercSlot(2, LOCATE_MERC_ONCE);
          else
            HandleSelectMercSlot(2, LOCATEANDSELECT_MERC);
          break;
        case F4:
          if (fShift)
            HandleSelectMercSlot(3, LOCATE_MERC_ONCE);
          else
            HandleSelectMercSlot(3, LOCATEANDSELECT_MERC);
          break;
        case F5:
          if (fShift)
            HandleSelectMercSlot(4, LOCATE_MERC_ONCE);
          else
            HandleSelectMercSlot(4, LOCATEANDSELECT_MERC);
          break;
        case F6:
          if (fShift)
            HandleSelectMercSlot(5, LOCATE_MERC_ONCE);
          else
            HandleSelectMercSlot(5, LOCATEANDSELECT_MERC);
          break;

        case F11:

          if (fAlt) {
          }

          else {
            if (DEBUG_CHEAT_LEVEL()) {
              GetMouseMapPos(addressof(gsQdsEnteringGridNo));
              LeaveTacticalScreen(Enum26.QUEST_DEBUG_SCREEN);
            }
          }
          break;

        case F12:

          // clear tactical of messages
          if (fCtrl) {
            ClearTacticalMessageQueue();
          } else if (!fAlt) {
            ClearDisplayedListOfTacticalStrings();
          }
          break;

        case '1':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              // ChangeSoldiersBodyType( TANK_NW, TRUE );
              // MercPtrs[ gusSelectedSoldier ]->uiStatusFlags |= SOLDIER_CREATURE;
              // EVENT_InitNewSoldierAnim( MercPtrs[ gusSelectedSoldier ], CRIPPLE_BEG, 0 , TRUE );
            }
          } else
            ChangeCurrentSquad(0);
          break;

        case '2':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              ChangeSoldiersBodyType(Enum194.INFANT_MONSTER, TRUE);
            }
          } else if (fCtrl) // toggle between the different npc debug modes
          {
            if (CHEATER_CHEAT_LEVEL()) {
              ToggleQuestDebugModes(Enum299.QD_NPC_MSG);
            }
          } else
            ChangeCurrentSquad(1);
          break;

        case '3':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              EVENT_InitNewSoldierAnim(MercPtrs[gusSelectedSoldier], Enum193.KID_SKIPPING, 0, TRUE);

              // ChangeSoldiersBodyType( LARVAE_MONSTER, TRUE );
              // MercPtrs[ gusSelectedSoldier ]->usAttackingWeapon = TANK_CANNON;
              // LocateSoldier( gusSelectedSoldier, FALSE );
              // EVENT_FireSoldierWeapon( MercPtrs[ gusSelectedSoldier ], usMapPos );
            }
          } else
            ChangeCurrentSquad(2);

          break;

        case '4':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              ChangeSoldiersBodyType(Enum194.CRIPPLECIV, TRUE);
            }
          } else
            ChangeCurrentSquad(3);

          // ChangeSoldiersBodyType( BLOODCAT, FALSE );
          break;

        case '5':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              ChangeSoldiersBodyType(Enum194.YAM_MONSTER, TRUE);
            }
          } else
            ChangeCurrentSquad(4);
          break;

        case '6':
          ChangeCurrentSquad(5);
          break;

        case '7':
          ChangeCurrentSquad(6);
          break;

        case '8':
          ChangeCurrentSquad(7);
          break;

        case '9':
          ChangeCurrentSquad(8);
          break;

        case '0':
          ChangeCurrentSquad(9);
          break;

        case 'x':

          if (!fCtrl && !fAlt) {
            // Exchange places...
            let pSoldier1: Pointer<SOLDIERTYPE>;
            let pSoldier2: Pointer<SOLDIERTYPE>;

            // Check if we have a good selected guy
            if (gusSelectedSoldier != NOBODY) {
              pSoldier1 = MercPtrs[gusSelectedSoldier];

              if (gfUIFullTargetFound) {
                // Get soldier...
                pSoldier2 = MercPtrs[gusUIFullTargetID];

                // Check if both OK....
                if (pSoldier1.value.bLife >= OKLIFE && pSoldier2.value.ubID != gusSelectedSoldier) {
                  if (pSoldier2.value.bLife >= OKLIFE) {
                    if (CanSoldierReachGridNoInGivenTileLimit(pSoldier1, pSoldier2.value.sGridNo, 1, gsInterfaceLevel)) {
                      // Exclude enemies....
                      if (!pSoldier2.value.bNeutral && (pSoldier2.value.bSide != gbPlayerNum)) {
                      } else {
                        if (CanExchangePlaces(pSoldier1, pSoldier2, TRUE)) {
                          // All's good!
                          SwapMercPositions(pSoldier1, pSoldier2);

                          DeductPoints(pSoldier1, AP_EXCHANGE_PLACES, 0);
                          DeductPoints(pSoldier2, AP_EXCHANGE_PLACES, 0);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          break;

        case '/':

          // Center to guy....
          if (gusSelectedSoldier != NOBODY) {
            LocateSoldier(gusSelectedSoldier, 10);
          }
          break;

        case 'a':

          if (fCtrl) {
// FIXME: Language-specific code
// #ifdef GERMAN
//             if (gubCheatLevel == 3) {
//               gubCheatLevel++;
//               fGoodCheatLevelKey = TRUE;
//             } else if (gubCheatLevel == 5) {
//               gubCheatLevel++;
//               // ATE; We're done.... start cheat mode....
//               ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[MSG_CHEAT_LEVEL_TWO]);
//               SetHistoryFact(HISTORY_CHEAT_ENABLED, 0, GetWorldTotalMin(), -1, -1);
//             } else {
//               RESET_CHEAT_LEVEL();
//             }
// #else
            if (gubCheatLevel == 1) {
              gubCheatLevel++;
              fGoodCheatLevelKey = TRUE;
            } else {
              RESET_CHEAT_LEVEL();
            }
// #endif
          } else if (fAlt) {
          } else {
            BeginAutoBandage();
          }
          break;

        case 'j':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              gfNextFireJam = TRUE;
            }
          } else if (fCtrl) {
          }
          break;

        case 'b':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              puiNewEvent.value = Enum207.I_NEW_BADMERC;
            }
          } else if (fCtrl) {
// FIXME: Language-specific code
// #ifndef GERMAN
            if (gubCheatLevel == 2) {
              gubCheatLevel++;
              fGoodCheatLevelKey = TRUE;
            } else if (gubCheatLevel == 3) {
              gubCheatLevel++;
              fGoodCheatLevelKey = TRUE;
            } else if (gubCheatLevel == 5) {
              gubCheatLevel++;
              fGoodCheatLevelKey = TRUE;
            } else {
              RESET_CHEAT_LEVEL();
            }
// #else
//             if (gubCheatLevel == 6) {
//               gubCheatLevel++;
//               fGoodCheatLevelKey = TRUE;
//             } else {
//               RESET_CHEAT_LEVEL();
//             }
// #endif
            // gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] ^= TRUE;
          } else {
            // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
            if ((gpItemPointer == null) && ((gsCurInterfacePanel != Enum215.SM_PANEL) || (ButtonList[iSMPanelButtons[Enum220.BURSTMODE_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
              SetBurstMode();
            }
          }
          break;
        case 'c':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              CreateNextCivType();
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              ToggleCliffDebug();
            }
          } else {
            HandleStanceChangeFromUIKeys(ANIM_CROUCH);
          }
          break;

        case 'd':
          if (gTacticalStatus.uiFlags & TURNBASED && gTacticalStatus.uiFlags & INCOMBAT) {
            if (gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
              // nothing in hand and the Done button for whichever panel we're in must be enabled
              if ((gpItemPointer == null) && !gfDisableTacticalPanelButtons && (((gsCurInterfacePanel == Enum215.SM_PANEL) && (ButtonList[iSMPanelButtons[Enum220.SM_DONE_BUTTON]].value.uiFlags & BUTTON_ENABLED)) || ((gsCurInterfacePanel == Enum215.TEAM_PANEL) && (ButtonList[iTEAMPanelButtons[Enum221.TEAM_DONE_BUTTON]].value.uiFlags & BUTTON_ENABLED)))) {
                if (fAlt) {
                  let cnt: INT32;
                  let pSoldier: Pointer<SOLDIERTYPE>;

                  if (CHEATER_CHEAT_LEVEL()) {
                    for (pSoldier = MercPtrs[gbPlayerNum], cnt = 0; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
                      if (pSoldier.value.bActive && pSoldier.value.bLife > 0) {
                        // Get APs back...
                        CalcNewActionPoints(pSoldier);

                        fInterfacePanelDirty = DIRTYLEVEL2;
                      }
                    }
                  }
                } else // End turn only if in combat and it is the player's turn
                  puiNewEvent.value = Enum207.I_ENDTURN;
              }
            }
          }
          break;

        case 'e':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              ToggleViewAllMercs();
              ToggleViewAllItems();
            }
          }
          else {
            let pSoldier: Pointer<SOLDIERTYPE>;

            if (gusSelectedSoldier != NOBODY) {
              pSoldier = MercPtrs[gusSelectedSoldier];

              if (pSoldier.value.bOppCnt > 0) {
                // Cycle....
                CycleVisibleEnemies(pSoldier);
              } else {
                ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_ENEMIES_IN_SIGHT_STR]);
              }
            }
          }
          break;

        case 'f':
          if (fCtrl) {
            if (INFORMATION_CHEAT_LEVEL()) {
              // Toggle Frame Rate Display
              gbFPSDisplay = !gbFPSDisplay;
              DisableFPSOverlay(!gbFPSDisplay);
              if (!gbFPSDisplay)
                SetRenderFlags(RENDER_FLAG_FULL);
            }
          } else if (fAlt) {
            if (gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE]) {
              gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE] = FALSE;

              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_TACKING_MODE_OFF]);
            } else {
              gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE] = TRUE;

              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_TACKING_MODE_ON]);
            }
          } else {
            let sGridNo: INT16;

            // Get the gridno the cursor is at
            GetMouseMapPos(addressof(sGridNo));

            // if there is a selected soldier, and the cursor location is valid
            if (gusSelectedSoldier != NOBODY && sGridNo != NOWHERE) {
              // if the cursor is over someone
              if (gfUIFullTargetFound) {
                // Display the range to the target
                DisplayRangeToTarget(MercPtrs[gusSelectedSoldier], MercPtrs[gusUIFullTargetID].value.sGridNo);
              } else {
                // Display the range to the target
                DisplayRangeToTarget(MercPtrs[gusSelectedSoldier], sGridNo);
              }
            }
          }
          break;

        case 'g':

          if (fCtrl) {
// FIXME: Language-specific code
// #ifdef GERMAN
//             if (gubCheatLevel == 1) {
//               gubCheatLevel++;
//               fGoodCheatLevelKey = TRUE;
//             } else {
//               RESET_CHEAT_LEVEL();
//             }
// #else
            if (gubCheatLevel == 0) {
              gubCheatLevel++;
              fGoodCheatLevelKey = TRUE;
            } else {
              RESET_CHEAT_LEVEL();
            }
// #endif
          } else if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              puiNewEvent.value = Enum207.I_NEW_MERC;
            }
          } else {
            HandlePlayerTogglingLightEffects(TRUE);
          }
          break;
        case 'H':
        case 'h':
          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              if (gfReportHitChances) {
                gfReportHitChances = FALSE;
              } else {
                gfReportHitChances = TRUE;
              }
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              puiNewEvent.value = Enum207.I_TESTHIT;
            }
          } else {
            ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_TACTICAL, TRUE);
          }
          break;

        case 'i':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              CreateRandomItem();
            }
          } else if (fCtrl) {
// FIXME: Language-specific code
// #ifdef GERMAN
//             if (gubCheatLevel == 0) {
//               fGoodCheatLevelKey = TRUE;
//               gubCheatLevel++;
//             }
// #else
            if (gubCheatLevel == 4) {
              gubCheatLevel++;
              fGoodCheatLevelKey = TRUE;
              // ATE; We're done.... start cheat mode....
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_CHEAT_LEVEL_TWO]);
              SetHistoryFact(Enum83.HISTORY_CHEAT_ENABLED, 0, GetWorldTotalMin(), -1, -1);
            } else {
              RESET_CHEAT_LEVEL();
            }
// #endif
          } else {
            if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
              gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = FALSE;
              ToggleItemGlow(FALSE);
            } else {
              gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = TRUE;
              ToggleItemGlow(TRUE);
            }
          }
          break;

        case '$':

          break;

        case 'k':
          if (fAlt) {
            if (fCtrl) {
              if (CHEATER_CHEAT_LEVEL()) {
                // next shot by anybody is auto kill
                if (gfNextShotKills) {
                  gfNextShotKills = FALSE;
                } else {
                  gfNextShotKills = TRUE;
                }
              }
            } else {
              if (CHEATER_CHEAT_LEVEL()) {
                GrenadeTest1();
              }
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              GrenadeTest2();
            }
          } else {
            BeginKeyPanelFromKeyShortcut();
          }
          break;

        case INSERT:

          GoIntoOverheadMap();
          break;

        case END:

          if (gusSelectedSoldier != NOBODY) {
            if (CheckForMercContMove(MercPtrs[gusSelectedSoldier])) {
              // Continue
              ContinueMercMovement(MercPtrs[gusSelectedSoldier]);
              ErasePath(TRUE);
            }
          }
          break;

        case HOME:

          if (gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR]) {
            gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR] = FALSE;

            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_3DCURSOR_OFF]);
          } else {
            gGameSettings.fOptions[Enum8.TOPTION_3D_CURSOR] = TRUE;

            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_3DCURSOR_ON]);
          }
          break;

        case 'l':

          if (fAlt) {
            if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
              LeaveTacticalScreen(Enum26.GAME_SCREEN);

              DoQuickLoad();
            }
          }

          else if (fCtrl) {
            if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
              gfSaveGame = FALSE;
              gfCameDirectlyFromGame = TRUE;

              guiPreviousOptionScreen = Enum26.GAME_SCREEN;
              LeaveTacticalScreen(Enum26.SAVE_LOAD_SCREEN);
            }
            /*
                                                            if ( INFORMATION_CHEAT_LEVEL( ) )
                                                            {
                                                                    *puiNewEvent = I_LEVELNODEDEBUG;
                                                                    CountLevelNodes();
                                                            }
            */
          } else {
            // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
            if ((gpItemPointer == null) && ((gsCurInterfacePanel != Enum215.SM_PANEL) || (ButtonList[iSMPanelButtons[Enum220.LOOK_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
              puiNewEvent.value = Enum207.LC_CHANGE_TO_LOOK;
            }
          }
          break;
        case 'm':
          if (fAlt) {
            if (INFORMATION_CHEAT_LEVEL()) {
              puiNewEvent.value = Enum207.I_LEVELNODEDEBUG;
              CountLevelNodes();
            }
          } else if (fCtrl) {
            if (INFORMATION_CHEAT_LEVEL()) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Memory Used: %d + %d = %d vs: %d", guiMemTotal, giMemUsedInSurfaces, (guiMemTotal + giMemUsedInSurfaces), (giStartingMemValue - MemGetFree()));
            }
          } else {
            // nothing in hand and the Map Screen button for whichever panel we're in must be enabled
            if ((gpItemPointer == null) && !gfDisableTacticalPanelButtons && (((gsCurInterfacePanel == Enum215.SM_PANEL) && (ButtonList[iSMPanelButtons[Enum220.SM_MAP_SCREEN_BUTTON]].value.uiFlags & BUTTON_ENABLED)) || ((gsCurInterfacePanel == Enum215.TEAM_PANEL) && (ButtonList[iTEAMPanelButtons[Enum221.TEAM_MAP_SCREEN_BUTTON]].value.uiFlags & BUTTON_ENABLED)))) {
              // go to Map screen
              if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
                GoToMapScreenFromTactical();
              }
            }
          }
          break;

        case PGDN:

          if (CHEATER_CHEAT_LEVEL()) {
            if (fCtrl)
              AttemptToChangeFloorLevel(+1); // try to enter a lower underground level
          }

          if (guiCurrentScreen != Enum26.DEBUG_SCREEN) {
            if (gusSelectedSoldier != NOBODY) {
              // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
              if ((gpItemPointer == null)) {
                GotoLowerStance(MercPtrs[gusSelectedSoldier]);
              }
            }
          }
          break;

        case PGUP:

          if (CHEATER_CHEAT_LEVEL()) {
            if (fCtrl)
              AttemptToChangeFloorLevel(-1); // try to go up towards ground level
          }

          if (guiCurrentScreen != Enum26.DEBUG_SCREEN) {
            if (gusSelectedSoldier != NOBODY) {
              // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
              if ((gpItemPointer == null)) {
                GotoHeigherStance(MercPtrs[gusSelectedSoldier]);
              }
            }
          }
          break;

        case '*':

          if (gTacticalStatus.uiFlags & RED_ITEM_GLOW_ON) {
            gTacticalStatus.uiFlags &= (~RED_ITEM_GLOW_ON);
          } else {
            gTacticalStatus.uiFlags |= RED_ITEM_GLOW_ON;
          }
          break;

        case 'n':

          if (fAlt) {
            /* static */ let gQuoteNum: UINT16 = 0;

            if (INFORMATION_CHEAT_LEVEL()) {
              if (gfUIFullTargetFound) {
                TacticalCharacterDialogue(MercPtrs[gusUIFullTargetID], gQuoteNum);
                gQuoteNum++;
              }
            }
          } else if (fCtrl) {
// FIXME: Language-specific code
// #ifdef GERMAN
//             if (gubCheatLevel == 4) {
//               fGoodCheatLevelKey = TRUE;
//               gubCheatLevel++;
//             } else {
//               RESET_CHEAT_LEVEL();
//             }
// #endif
          } else if (!CycleSoldierFindStack(usMapPos)) // Are we over a merc stack?
            CycleIntTileFindStack(usMapPos); // If not, now check if we are over a struct stack
          break;

        case 'o':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              gStrategicStatus.usPlayerKills += NumEnemiesInAnySector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
              ObliterateSector();
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              CreatePlayerControlledMonster();
            }
          } else {
            // nothing in hand and the Options Screen button for whichever panel we're in must be enabled
            if ((gpItemPointer == null) && !gfDisableTacticalPanelButtons && ((gsCurInterfacePanel != Enum215.SM_PANEL) || (ButtonList[iSMPanelButtons[Enum220.OPTIONS_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
              if (!fDisableMapInterfaceDueToBattle) {
                // go to Options screen
                guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                LeaveTacticalScreen(Enum26.OPTIONS_SCREEN);
              }
            }
          }
          break;

        case 'p':

            HandleStanceChangeFromUIKeys(ANIM_PRONE);
          break;

        case 'r':
          if (gusSelectedSoldier != NO_SOLDIER) {
            if (fAlt) // reload selected merc's weapon
            {
              if (CHEATER_CHEAT_LEVEL()) {
                ReloadWeapon(MercPtrs[gusSelectedSoldier], MercPtrs[gusSelectedSoldier].value.ubAttackingHand);
              }
            } else if (fCtrl) {
              if (INFORMATION_CHEAT_LEVEL()) {
                DoChrisTest(MercPtrs[gusSelectedSoldier]);
              }
            } else {
              if (!MercInWater(MercPtrs[gusSelectedSoldier]) && !(MercPtrs[gusSelectedSoldier].value.uiStatusFlags & SOLDIER_ROBOT)) {
                // change selected merc to run
                if (MercPtrs[gusSelectedSoldier].value.usUIMovementMode != Enum193.WALKING && MercPtrs[gusSelectedSoldier].value.usUIMovementMode != Enum193.RUNNING) {
                  UIHandleSoldierStanceChange(gusSelectedSoldier, ANIM_STAND);
                  MercPtrs[gusSelectedSoldier].value.fUIMovementFast = 1;
                } else {
                  MercPtrs[gusSelectedSoldier].value.fUIMovementFast = 1;
                  MercPtrs[gusSelectedSoldier].value.usUIMovementMode = Enum193.RUNNING;
                  gfPlotNewMovement = TRUE;
                }
              }
            }
          }
          break;
        case 's':

          if (fCtrl) {
            if (!fDisableMapInterfaceDueToBattle && !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
              // if the game CAN be saved
              if (CanGameBeSaved()) {
                gfSaveGame = TRUE;
                gfCameDirectlyFromGame = TRUE;

                guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                LeaveTacticalScreen(Enum26.SAVE_LOAD_SCREEN);
              } else {
                // Display a message saying the player cant save now
                DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zNewTacticalMessages[Enum320.TCTL_MSG__IRON_MAN_CANT_SAVE_NOW], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
              }
            }
          } else if (fAlt) {
            if (!fDisableMapInterfaceDueToBattle && !(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
              // if the game CAN be saved
              if (CanGameBeSaved()) {
                guiPreviousOptionScreen = Enum26.GAME_SCREEN;
                // guiPreviousOptionScreen = guiCurrentScreen;
                DoQuickSave();
              } else {
                // Display a message saying the player cant save now
                DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zNewTacticalMessages[Enum320.TCTL_MSG__IRON_MAN_CANT_SAVE_NOW], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, null, null);
              }
            }
          } else if (gusSelectedSoldier != NOBODY) {
            gfPlotNewMovement = TRUE;
            HandleStanceChangeFromUIKeys(ANIM_STAND);
          }
          break;

        case 't':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              TeleportSelectedSoldier();
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              TestCapture();

              // EnterCombatMode( gbPlayerNum );
            }
          } else
            ToggleTreeTops();
          break;

        case '=':
          // if the display cover or line of sight is being displayed
          if (_KeyDown(END) || _KeyDown(DEL)) {
            if (_KeyDown(DEL))
              ChangeSizeOfDisplayCover(gGameSettings.ubSizeOfDisplayCover + 1);

            if (_KeyDown(END))
              ChangeSizeOfLOS(gGameSettings.ubSizeOfLOS + 1);
          } else {
            // ATE: This key will select everybody in the sector
            if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
              let pSoldier: Pointer<SOLDIERTYPE>;
              let cnt: INT32;

              cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
              for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
                // Check if this guy is OK to control....
                if (OK_CONTROLLABLE_MERC(pSoldier) && !(pSoldier.value.uiStatusFlags & (SOLDIER_VEHICLE | SOLDIER_PASSENGER | SOLDIER_DRIVER))) {
                  pSoldier.value.uiStatusFlags |= SOLDIER_MULTI_SELECTED;
                }
              }
              EndMultiSoldierSelection(TRUE);
            }
          }
          break;

        case 'u':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              RefreshSoldier();
            }
          } else if (fCtrl) {
            let cnt: INT32;
            let pSoldier: Pointer<SOLDIERTYPE>;

// FIXME: Language-specific code
// #ifdef GERMAN
//             if (gubCheatLevel == 2) {
//               fGoodCheatLevelKey = TRUE;
//               gubCheatLevel++;
//             } else {
//               RESET_CHEAT_LEVEL();
//             }
// #endif

            if (CHEATER_CHEAT_LEVEL() && gusSelectedSoldier != NOBODY) {
              for (pSoldier = MercPtrs[gbPlayerNum], cnt = 0; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
                if (pSoldier.value.bActive && pSoldier.value.bLife > 0) {
                  // Get breath back
                  pSoldier.value.bBreath = pSoldier.value.bBreathMax;

                  // Get life back
                  pSoldier.value.bLife = pSoldier.value.bLifeMax;
                  pSoldier.value.bBleeding = 0;

                  fInterfacePanelDirty = DIRTYLEVEL2;
                }
              }
            }
          }

          else if (gusSelectedSoldier != NO_SOLDIER)
            puiNewEvent.value = Enum207.M_CHANGE_TO_ACTION;
          break;

        case 'v':
          if (fAlt) {
          } else if (fCtrl) {
          } else
            DisplayGameSettings();

          break;
        case 'w':
        case 'W':

          if (fAlt) {
            if (CHEATER_CHEAT_LEVEL()) {
              if (InItemDescriptionBox()) {
                // Swap item in description panel...
                CycleItemDescriptionItem();
              } else {
                CycleSelectedMercsItem();
              }
            }
          } else if (fCtrl) {
            if (CHEATER_CHEAT_LEVEL()) {
              if (gusSelectedSoldier != NOBODY) {
                CreateItem(Enum225.FLAMETHROWER, 100, addressof(MercPtrs[gusSelectedSoldier].value.inv[Enum261.HANDPOS]));
              }
            }
          } else
            ToggleWireFrame();
          break;

        case 'y':
          if (fAlt) {
            let Object: OBJECTTYPE;
            let pSoldier: Pointer<SOLDIERTYPE>;

            if (CHEATER_CHEAT_LEVEL()) {
              QuickCreateProfileMerc(CIV_TEAM, Enum268.MARIA); // Ira

              // Recruit!
              RecruitEPC(Enum268.MARIA);
            }

            // Create object and set
            CreateItem(Enum225.G41, 100, addressof(Object));

            pSoldier = FindSoldierByProfileID(Enum268.ROBOT, FALSE);

            AutoPlaceObject(pSoldier, addressof(Object), FALSE);
          } else {
            if (INFORMATION_CHEAT_LEVEL()) {
              puiNewEvent.value = Enum207.I_LOSDEBUG;
            }
          }
          // else if( gusSelectedSoldier != NO_SOLDIER )
          break;
        case 'z':
          if (fCtrl) {
            if (INFORMATION_CHEAT_LEVEL()) {
              ToggleZBuffer();
            }
          } else if (fAlt) {
            // Toggle squad's stealth mode.....
            // For each guy on squad...
            {
              let pTeamSoldier: Pointer<SOLDIERTYPE>;
              let bLoop: INT8;
              let fStealthOn: BOOLEAN = FALSE;

              // Check if at least one guy is on stealth....
              for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID, pTeamSoldier = MercPtrs[bLoop]; bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++, pTeamSoldier++) {
                if (OK_CONTROLLABLE_MERC(pTeamSoldier) && pTeamSoldier.value.bAssignment == CurrentSquad()) {
                  if (pTeamSoldier.value.bStealthMode) {
                    fStealthOn = TRUE;
                  }
                }
              }

              fStealthOn = !fStealthOn;

              for (bLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID, pTeamSoldier = MercPtrs[bLoop]; bLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; bLoop++, pTeamSoldier++) {
                if (OK_CONTROLLABLE_MERC(pTeamSoldier) && pTeamSoldier.value.bAssignment == CurrentSquad() && !AM_A_ROBOT(pTeamSoldier)) {
                  if (gpSMCurrentMerc != null && bLoop == gpSMCurrentMerc.value.ubID) {
                    gfUIStanceDifferent = TRUE;
                  }

                  pTeamSoldier.value.bStealthMode = fStealthOn;
                }
              }

              fInterfacePanelDirty = DIRTYLEVEL2;

              // OK, display message
              if (fStealthOn) {
                ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SQUAD_ON_STEALTHMODE]);
              } else {
                ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SQUAD_OFF_STEALTHMODE]);
              }
            }
          } else {
            // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
            if ((gpItemPointer == null)) {
              HandleStealthChangeFromUIKeys();
            }
          }
          break;

        case '-':
        case '_':
          // if the display cover or line of sight is being displayed
          if (_KeyDown(END) || _KeyDown(DEL)) {
            if (_KeyDown(DEL))
              ChangeSizeOfDisplayCover(gGameSettings.ubSizeOfDisplayCover - 1);

            if (_KeyDown(END))
              ChangeSizeOfLOS(gGameSettings.ubSizeOfLOS - 1);
          } else {
            if (fAlt) {
              if (MusicGetVolume() >= 20)
                MusicSetVolume(MusicGetVolume() - 20);
              else
                MusicSetVolume(0);
            } else if (fCtrl) {
            } else {
            }
          }
          break;
        case '+':

          break;
        case '`':

          // Switch panels...
          {
            ToggleTacticalPanels();

            if (CHEATER_CHEAT_LEVEL()) {
              // EnvBeginRainStorm( 1 );
            }
          }
          break;
      }

// FIXME: Language-specific code
// #ifdef GERMAN
//       if (!fGoodCheatLevelKey && gubCheatLevel < 5) {
//         RESET_CHEAT_LEVEL();
//       }
// #else
      if (!fGoodCheatLevelKey && gubCheatLevel < 4) {
        RESET_CHEAT_LEVEL();
      }
// #endif
    }
  }
}

function HandleTalkingMenuKeys(pInputEvent: Pointer<InputAtom>, puiNewEvent: Pointer<UINT32>): void {
  // CHECK ESC KEYS HERE....
  if (pInputEvent.value.usEvent == KEY_UP) {
    if (pInputEvent.value.usParam == ESC) {
      // Handle esc in talking menu
      if (HandleTalkingMenuEscape(TRUE, TRUE)) {
        puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
      }
    } else if (pInputEvent.value.usParam == BACKSPACE) {
      HandleTalkingMenuBackspace();
    }
  }
}

function HandleSectorExitMenuKeys(pInputEvent: Pointer<InputAtom>, puiNewEvent: Pointer<UINT32>): void {
  // CHECK ESC KEYS HERE....
  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == ESC)) {
    // Handle esc in talking menu
    RemoveSectorExitMenu(FALSE);

    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
  }
}

function HandleOpenDoorMenuKeys(pInputEvent: Pointer<InputAtom>, puiNewEvent: Pointer<UINT32>): void {
  // CHECK ESC KEYS HERE....
  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == ESC)) {
    // Handle esc in talking menu
    CancelOpenDoorMenu();
    HandleOpenDoorMenu();
    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
  }
}

function HandleMenuKeys(pInputEvent: Pointer<InputAtom>, puiNewEvent: Pointer<UINT32>): void {
  // CHECK ESC KEYS HERE....
  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == ESC)) {
    // Handle esc in talking menu
    CancelMovementMenu();

    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
  }
}

function HandleItemMenuKeys(pInputEvent: Pointer<InputAtom>, puiNewEvent: Pointer<UINT32>): void {
  // CHECK ESC KEYS HERE....
  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == ESC)) {
    // Handle esc in talking menu
    RemoveItemPickupMenu();
    puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
  }
}

function HandleCheckForExitArrowsInput(fAdjustConfirm: BOOLEAN): BOOLEAN {
  let sMapPos: INT16;

  // If not in move mode, return!
  if (gCurrentUIMode != Enum206.MOVE_MODE) {
    return FALSE;
  }

  if (gusSelectedSoldier == NOBODY) {
    return FALSE;
  }

  // ATE: Remove confirm for exit arrows...
  fAdjustConfirm = TRUE;
  gfUIConfirmExitArrows = TRUE;

  // Return right away, saying that we are in this mode, don't do any normal stuff!
  if (guiCurrentUICursor == Enum210.NOEXIT_EAST_UICURSOR || guiCurrentUICursor == Enum210.NOEXIT_WEST_UICURSOR || guiCurrentUICursor == Enum210.NOEXIT_NORTH_UICURSOR || guiCurrentUICursor == Enum210.NOEXIT_SOUTH_UICURSOR || guiCurrentUICursor == Enum210.NOEXIT_GRID_UICURSOR) {
    // Yeah, but add a message....
    if (gfInvalidTraversal) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANNOT_LEAVE_SECTOR_FROM_SIDE_STR]);
      gfInvalidTraversal = FALSE;
    } else if (gfRobotWithoutControllerAttemptingTraversal) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[1]);
      gfRobotWithoutControllerAttemptingTraversal = FALSE;
    } else if (gfLoneEPCAttemptingTraversal) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, pExitingSectorHelpText[Enum336.EXIT_GUI_ESCORTED_CHARACTERS_CANT_LEAVE_SECTOR_ALONE_STR], MercPtrs[gusSelectedSoldier].value.name);
      gfLoneEPCAttemptingTraversal = FALSE;
    } else if (gubLoneMercAttemptingToAbandonEPCs) {
      let str: UINT16[] /* [256] */;
      if (gubLoneMercAttemptingToAbandonEPCs == 1) {
        // Use the singular version of the string
        if (gMercProfiles[MercPtrs[gusSelectedSoldier].value.ubProfile].bSex == Enum272.MALE) {
          // male singular
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_SINGULAR], MercPtrs[gusSelectedSoldier].value.name, MercPtrs[gbPotentiallyAbandonedEPCSlotID].value.name);
        } else {
          // female singular
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_SINGULAR], MercPtrs[gusSelectedSoldier].value.name, MercPtrs[gbPotentiallyAbandonedEPCSlotID].value.name);
        }
      } else {
        // Use the plural version of the string
        if (gMercProfiles[MercPtrs[gusSelectedSoldier].value.ubProfile].bSex == Enum272.MALE) {
          // male plural
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_MALE_PLURAL], MercPtrs[gusSelectedSoldier].value.name);
        } else {
          // female plural
          swprintf(str, pExitingSectorHelpText[Enum336.EXIT_GUI_MERC_CANT_ISOLATE_EPC_HELPTEXT_FEMALE_PLURAL], MercPtrs[gusSelectedSoldier].value.name);
        }
      }
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, str);
      gubLoneMercAttemptingToAbandonEPCs = FALSE;
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.MERC_IS_TOO_FAR_AWAY_STR], MercPtrs[gusSelectedSoldier].value.name);
    }

    return TRUE;
  }

  // Check if we want to exit!
  if (guiCurrentUICursor == Enum210.EXIT_GRID_UICURSOR || guiCurrentUICursor == Enum210.CONFIRM_EXIT_GRID_UICURSOR) {
    if (fAdjustConfirm) {
      if (!gfUIConfirmExitArrows) {
        gfUIConfirmExitArrows = TRUE;
      } else {
        if (!GetMouseMapPos(addressof(sMapPos))) {
          return FALSE;
        }

        // Goto next sector
        // SimulateMouseMovement( gusMouseXPos - 5, gusMouseYPos );
        InitSectorExitMenu(Enum245.DIRECTION_EXITGRID, sMapPos);
      }
    }
    return TRUE;
  }

  // Check if we want to exit!
  if (guiCurrentUICursor == Enum210.EXIT_EAST_UICURSOR || guiCurrentUICursor == Enum210.CONFIRM_EXIT_EAST_UICURSOR) {
    if (fAdjustConfirm) {
      if (!gfUIConfirmExitArrows) {
        gfUIConfirmExitArrows = TRUE;
      } else {
        // Goto next sector
        // SimulateMouseMovement( gusMouseXPos - 5, gusMouseYPos );
        InitSectorExitMenu(Enum245.EAST, 0);
      }
    }
    return TRUE;
  }
  if (guiCurrentUICursor == Enum210.EXIT_WEST_UICURSOR || guiCurrentUICursor == Enum210.CONFIRM_EXIT_WEST_UICURSOR) {
    if (fAdjustConfirm) {
      if (!gfUIConfirmExitArrows) {
        gfUIConfirmExitArrows = TRUE;
      } else {
        // Goto next sector
        // SimulateMouseMovement( gusMouseXPos + 5, gusMouseYPos );
        InitSectorExitMenu(Enum245.WEST, 0);
      }
    }
    return TRUE;
  }
  if (guiCurrentUICursor == Enum210.EXIT_NORTH_UICURSOR || guiCurrentUICursor == Enum210.CONFIRM_EXIT_NORTH_UICURSOR) {
    if (fAdjustConfirm) {
      if (!gfUIConfirmExitArrows) {
        gfUIConfirmExitArrows = TRUE;
      } else {
        // Goto next sector
        // SimulateMouseMovement( gusMouseXPos, gusMouseYPos + 5 );
        InitSectorExitMenu(Enum245.NORTH, 0);
      }
    }
    return TRUE;
  }
  if (guiCurrentUICursor == Enum210.EXIT_SOUTH_UICURSOR || guiCurrentUICursor == Enum210.CONFIRM_EXIT_SOUTH_UICURSOR) {
    if (fAdjustConfirm) {
      if (!gfUIConfirmExitArrows) {
        gfUIConfirmExitArrows = TRUE;
      } else {
        // Goto next sector
        // SimulateMouseMovement( gusMouseXPos, gusMouseYPos - 5);
        InitSectorExitMenu(Enum245.SOUTH, 0);
      }
    }
    return TRUE;
  }
  return FALSE;
}

// Simple function implementations called by keyboard input

function CreateRandomItem(): void {
  let Object: OBJECTTYPE;
  let usMapPos: UINT16;
  if (GetMouseMapPos(addressof(usMapPos))) {
    CreateItem((Random(35) + 1), 100, addressof(Object));
    AddItemToPool(usMapPos, addressof(Object), -1, 0, 0, 0);
  }
}

function MakeSelectedSoldierTired(): void {
  // Key to make guy get tired!
  let pSoldier: Pointer<SOLDIERTYPE>;
  let Object: OBJECTTYPE;
  let usMapPos: UINT16;
  if (GetMouseMapPos(addressof(usMapPos))) {
    CreateItem(Enum225.TNT, 100, addressof(Object));
    AddItemToPool(usMapPos, addressof(Object), -1, 0, 0, 0);
  }

  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (gfUIFullTargetFound) {
    // Get Soldier
    GetSoldier(addressof(pSoldier), gusUIFullTargetID);

    // FatigueCharacter( pSoldier );

    fInterfacePanelDirty = DIRTYLEVEL2;
  }
}

function ToggleRealTime(puiNewEvent: Pointer<UINT32>): void {
  if (gTacticalStatus.uiFlags & TURNBASED) {
    // Change to real-time
    gTacticalStatus.uiFlags &= (~TURNBASED);
    gTacticalStatus.uiFlags |= REALTIME;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Switching to Realtime.");
  } else if (gTacticalStatus.uiFlags & REALTIME) {
    // Change to turn-based
    gTacticalStatus.uiFlags |= TURNBASED;
    gTacticalStatus.uiFlags &= (~REALTIME);

    puiNewEvent.value = Enum207.M_ON_TERRAIN;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Switching to Turnbased.");
  }

  // Plot new path!
  gfPlotNewMovement = TRUE;
}

function ToggleViewAllMercs(): void {
  // Set option to show all mercs
  if (gTacticalStatus.uiFlags & SHOW_ALL_MERCS) {
    gTacticalStatus.uiFlags &= (~SHOW_ALL_MERCS);
  } else {
    gTacticalStatus.uiFlags |= SHOW_ALL_MERCS;
  }

  // RE-RENDER
  SetRenderFlags(RENDER_FLAG_FULL);
}

function ToggleViewAllItems(): void {
  // Set option to show all mercs
  if (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS) {
    gTacticalStatus.uiFlags &= ~SHOW_ALL_ITEMS;
  } else {
    gTacticalStatus.uiFlags |= SHOW_ALL_ITEMS;
  }

  if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
    ToggleItemGlow(TRUE);
  } else {
    ToggleItemGlow(FALSE);
  }

  // RE-RENDER
  SetRenderFlags(RENDER_FLAG_FULL);
}

function TestExplosion(): void {
  let usMapPos: UINT16;
  if (GetMouseMapPos(addressof(usMapPos))) {
    let ExpParams: EXPLOSION_PARAMS;
    ExpParams.uiFlags = 0;
    ExpParams.ubOwner = NOBODY;
    ExpParams.ubTypeID = Enum304.STUN_BLAST;
    ExpParams.sGridNo = usMapPos;

    GenerateExplosion(addressof(ExpParams));

    PlayJA2Sample(Enum330.EXPLOSION_1, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
  }
}

function CycleSelectedMercsItem(): void {
  let usOldItem: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  // Cycle selected guy's item...
  if (gfUIFullTargetFound) {
    // Get soldier...
    pSoldier = MercPtrs[gusUIFullTargetID];

    usOldItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

    usOldItem++;

    if (usOldItem > Enum225.MAX_WEAPONS) {
      usOldItem = 0;
    }

    CreateItem(usOldItem, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));

    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  }
}

function ToggleWireFrame(): void {
  if (gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME]) {
    gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME] = FALSE;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_WIREFRAMES_REMOVED]);
  } else {
    gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_WIREFRAME] = TRUE;

    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_WIREFRAMES_ADDED]);
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function RefreshSoldier(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;
  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (gfUIFullTargetFound) {
    // Get Soldier
    GetSoldier(addressof(pSoldier), gusUIFullTargetID);

    ReviveSoldier(pSoldier);
  }

  if (GetMouseMapPos(addressof(usMapPos)))
    sprintf(gDebugStr, "%d %d %d %d %d %d %d %d", gubWorldMovementCosts[usMapPos][0][0], gubWorldMovementCosts[usMapPos][1][gsInterfaceLevel], gubWorldMovementCosts[usMapPos][2][gsInterfaceLevel], gubWorldMovementCosts[usMapPos][3][gsInterfaceLevel], gubWorldMovementCosts[usMapPos][4][gsInterfaceLevel], gubWorldMovementCosts[usMapPos][5][gsInterfaceLevel], gubWorldMovementCosts[usMapPos][6][gsInterfaceLevel], gubWorldMovementCosts[usMapPos][7][gsInterfaceLevel]);
}

function ChangeSoldiersBodyType(ubBodyType: UINT8, fCreateNewPalette: BOOLEAN): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  if (gusSelectedSoldier != NO_SOLDIER) {
    if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
      pSoldier.value.ubBodyType = ubBodyType;
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 0, TRUE);
      // SetSoldierAnimationSurface( pSoldier, pSoldier->usAnimState );
      if (fCreateNewPalette) {
        CreateSoldierPalettes(pSoldier);

        switch (ubBodyType) {
          case Enum194.ADULTFEMALEMONSTER:
          case Enum194.AM_MONSTER:
          case Enum194.YAF_MONSTER:
          case Enum194.YAM_MONSTER:
          case Enum194.LARVAE_MONSTER:
          case Enum194.INFANT_MONSTER:
          case Enum194.QUEENMONSTER:

            pSoldier.value.uiStatusFlags |= SOLDIER_MONSTER;
            memset(addressof(pSoldier.value.inv), 0, sizeof(OBJECTTYPE) * Enum261.NUM_INV_SLOTS);
            AssignCreatureInventory(pSoldier);

            CreateItem(Enum225.CREATURE_YOUNG_MALE_SPIT, 100, addressof(pSoldier.value.inv[Enum261.HANDPOS]));

            break;

          case Enum194.TANK_NW:
          case Enum194.TANK_NE:

            pSoldier.value.uiStatusFlags |= SOLDIER_VEHICLE;
            // pSoldier->inv[ HANDPOS ].usItem = TANK_CANNON;

            pSoldier.value.inv[Enum261.HANDPOS].usItem = Enum225.MINIMI;
            pSoldier.value.bVehicleID = AddVehicleToList(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ, Enum279.HUMMER);

            break;
        }
      }
    }
  }
}

function TeleportSelectedSoldier(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;
  // CHECK IF WE'RE ON A GUY ( EITHER SELECTED, OURS, OR THEIRS
  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
    if (GetMouseMapPos(addressof(usMapPos))) {
      // Check level first....
      if (gsInterfaceLevel == 0) {
        SetSoldierHeight(pSoldier, 0);
        TeleportSoldier(pSoldier, usMapPos, FALSE);
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
      } else {
        // Is there a roof?
        if (FindStructure(usMapPos, STRUCTURE_ROOF) != null) {
          SetSoldierHeight(pSoldier, 50.0);

          TeleportSoldier(pSoldier, usMapPos, TRUE);
          EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
        }
      }
    }
  }
}

function ToggleTreeTops(): void {
  if (gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS]) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.REMOVING_TREETOPS_STR]);
    WorldHideTrees();
    gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
  } else {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.SHOWING_TREETOPS_STR]);
    WorldShowTrees();
    gTacticalStatus.uiFlags &= (~NOHIDE_REDUNDENCY);
  }
  gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS] = !gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS];

  // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
  InvalidateWorldRedundency();
}

function ToggleZBuffer(): void {
  // Set option to show all mercs
  if (gTacticalStatus.uiFlags & SHOW_Z_BUFFER) {
    gTacticalStatus.uiFlags &= (~SHOW_Z_BUFFER);
    SetRenderFlags(SHOW_Z_BUFFER);
  } else {
    gTacticalStatus.uiFlags |= SHOW_Z_BUFFER;
  }
}

function TogglePlanningMode(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;
  // DO ONLY IN TURNED BASED!
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    // CANCEL FROM PLANNING MODE!
    if (InUIPlanMode()) {
      EndUIPlan();
    } else if (GetMouseMapPos(addressof(usMapPos))) {
      switch (gCurrentUIMode) {
        case Enum206.MOVE_MODE:
          if (gusSelectedSoldier != NO_SOLDIER) {
            GetSoldier(addressof(pSoldier), gusSelectedSoldier);
            BeginUIPlan(pSoldier);
            AddUIPlan(usMapPos, UIPLAN_ACTION_MOVETO);
          }
          break;
        case Enum206.ACTION_MODE:
          if (gusSelectedSoldier != NO_SOLDIER) {
            GetSoldier(addressof(pSoldier), gusSelectedSoldier);
            BeginUIPlan(pSoldier);
            AddUIPlan(usMapPos, UIPLAN_ACTION_FIRE);
          }
          break;
      }
    }
  }
}

function SetBurstMode(): void {
  if (gusSelectedSoldier != NO_SOLDIER) {
    ChangeWeaponMode(MercPtrs[gusSelectedSoldier]);
  }
}

function ObliterateSector(): void {
  let cnt: INT32;
  let pTSoldier: Pointer<SOLDIERTYPE>;

  // Kill everybody!
  cnt = gTacticalStatus.Team[gbPlayerNum].bLastID + 1;

  for (pTSoldier = MercPtrs[cnt]; cnt < MAX_NUM_SOLDIERS; pTSoldier++, cnt++) {
    if (pTSoldier.value.bActive && !pTSoldier.value.bNeutral && (pTSoldier.value.bSide != gbPlayerNum)) {
      //	ANITILE_PARAMS	AniParams;
      //		memset( &AniParams, 0, sizeof( ANITILE_PARAMS ) );
      //		AniParams.sGridNo							= pTSoldier->sGridNo;
      //		AniParams.ubLevelID						= ANI_STRUCT_LEVEL;
      //	AniParams.usTileType				  = FIRSTEXPLOSION;
      //	AniParams.usTileIndex					= FIRSTEXPLOSION1;
      //	AniParams.sDelay							= 80;
      //	AniParams.sStartFrame					= 0;
      //	AniParams.uiFlags							= ANITILE_FORWARD;

      //	CreateAnimationTile( &AniParams );
      // PlayJA2Sample( EXPLOSION_1, RATE_11025, MIDVOLUME, 1, MIDDLEPAN );

      EVENT_SoldierGotHit(pTSoldier, 0, 400, 0, pTSoldier.value.bDirection, 320, NOBODY, FIRE_WEAPON_NO_SPECIAL, pTSoldier.value.bAimShotLocation, 0, NOWHERE);
    }
  }
}

function RandomizeMercProfile(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  // Get selected soldier
  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
    // Change guy!
    ForceSoldierProfileID(pSoldier, Random(30));

    // Dirty interface
    DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
  }
}

function JumpFence(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bDirection: INT8;
  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
    if (FindFenceJumpDirection(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection, addressof(bDirection))) {
      BeginSoldierClimbFence(pSoldier);
    }
  }
}

function CreateNextCivType(): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let usMapPos: UINT16;
  /* static */ let bBodyType: INT8 = Enum194.FATCIV;
  // Get Grid Corrdinates of mouse
  if (GetMouseWorldCoordsInCenter(addressof(sWorldX), addressof(sWorldY)) && GetMouseMapPos(addressof(usMapPos))) {
    let iNewIndex: INT8;

    memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
    MercCreateStruct.ubProfile = NO_PROFILE;
    MercCreateStruct.sSectorX = gWorldSectorX;
    MercCreateStruct.sSectorY = gWorldSectorY;
    MercCreateStruct.bSectorZ = gbWorldSectorZ;
    MercCreateStruct.bBodyType = bBodyType;
    MercCreateStruct.bDirection = Enum245.SOUTH;

    bBodyType++;

    if (bBodyType > Enum194.KIDCIV) {
      bBodyType = Enum194.FATCIV;
    }

    MercCreateStruct.bTeam = CIV_TEAM;
    MercCreateStruct.sInsertionGridNo = usMapPos;
    RandomizeNewSoldierStats(addressof(MercCreateStruct));

    if (TacticalCreateSoldier(addressof(MercCreateStruct), addressof(iNewIndex))) {
      AddSoldierToSector(iNewIndex);

      // So we can see them!
      AllTeamsLookForAll(NO_INTERRUPTS);
    }
  }
}

function ToggleCliffDebug(): void {
  // Set option to show all mercs
  if (gTacticalStatus.uiFlags & DEBUGCLIFFS) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Cliff debug OFF.");

    gTacticalStatus.uiFlags &= (~DEBUGCLIFFS);
    SetRenderFlags(RENDER_FLAG_FULL);
  } else {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, "Cliff debug ON.");

    gTacticalStatus.uiFlags |= DEBUGCLIFFS;
  }
}

function CreateCow(): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let usMapPos: UINT16;
  // Get Grid Corrdinates of mouse
  if (GetMouseWorldCoordsInCenter(addressof(sWorldX), addressof(sWorldY)) && GetMouseMapPos(addressof(usMapPos))) {
    let iNewIndex: INT8;

    memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
    MercCreateStruct.ubProfile = NO_PROFILE;
    MercCreateStruct.sSectorX = gWorldSectorX;
    MercCreateStruct.sSectorY = gWorldSectorY;
    MercCreateStruct.bSectorZ = gbWorldSectorZ;
    MercCreateStruct.bBodyType = Enum194.COW;
    // MercCreateStruct.bTeam				= SOLDIER_CREATE_AUTO_TEAM;
    MercCreateStruct.bTeam = CIV_TEAM;
    MercCreateStruct.sInsertionGridNo = usMapPos;
    RandomizeNewSoldierStats(addressof(MercCreateStruct));

    if (TacticalCreateSoldier(addressof(MercCreateStruct), addressof(iNewIndex))) {
      AddSoldierToSector(iNewIndex);

      // So we can see them!
      AllTeamsLookForAll(NO_INTERRUPTS);
    }
  }
}

function CreatePlayerControlledCow(): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let MercCreateStruct: SOLDIERCREATE_STRUCT;
  let usMapPos: UINT16;
  // Get Grid Corrdinates of mouse
  if (GetMouseWorldCoordsInCenter(addressof(sWorldX), addressof(sWorldY)) && GetMouseMapPos(addressof(usMapPos))) {
    let iNewIndex: INT8;

    memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
    MercCreateStruct.ubProfile = 12;
    MercCreateStruct.sSectorX = gWorldSectorX;
    MercCreateStruct.sSectorY = gWorldSectorY;
    MercCreateStruct.bSectorZ = gbWorldSectorZ;
    MercCreateStruct.bBodyType = Enum194.COW;
    MercCreateStruct.sInsertionGridNo = usMapPos;
    MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
    MercCreateStruct.fPlayerMerc = TRUE;

    RandomizeNewSoldierStats(addressof(MercCreateStruct));

    if (TacticalCreateSoldier(addressof(MercCreateStruct), addressof(iNewIndex))) {
      AddSoldierToSector(iNewIndex);

      // So we can see them!
      AllTeamsLookForAll(NO_INTERRUPTS);
    }
  }
}

function ToggleRealTimeConfirm(): void {
}

function GrenadeTest1(): void {
  // Get mousexy
  let sX: INT16;
  let sY: INT16;
  if (GetMouseXY(addressof(sX), addressof(sY))) {
    let Object: OBJECTTYPE;
    Object.usItem = Enum225.MUSTARD_GRENADE;
    Object.bStatus[0] = 100;
    Object.ubNumberOfObjects = 1;
    CreatePhysicalObject(addressof(Object), 60, (sX * CELL_X_SIZE), (sY * CELL_Y_SIZE), 256, -20, 20, 158, NOBODY, Enum258.THROW_ARM_ITEM, 0);
  }
}

function GrenadeTest2(): void {
  // Get mousexy
  let sX: INT16;
  let sY: INT16;
  if (GetMouseXY(addressof(sX), addressof(sY))) {
    let Object: OBJECTTYPE;
    Object.usItem = Enum225.HAND_GRENADE;
    Object.bStatus[0] = 100;
    Object.ubNumberOfObjects = 1;
    CreatePhysicalObject(addressof(Object), 60, (sX * CELL_X_SIZE), (sY * CELL_Y_SIZE), 256, 0, -30, 158, NOBODY, Enum258.THROW_ARM_ITEM, 0);
  }
}

function GrenadeTest3(): void {
  // Get mousexy
  let sX: INT16;
  let sY: INT16;
  if (GetMouseXY(addressof(sX), addressof(sY))) {
    let Object: OBJECTTYPE;
    Object.usItem = Enum225.HAND_GRENADE;
    Object.bStatus[0] = 100;
    Object.ubNumberOfObjects = 1;
    CreatePhysicalObject(addressof(Object), 60, (sX * CELL_X_SIZE), (sY * CELL_Y_SIZE), 256, -10, 10, 158, NOBODY, Enum258.THROW_ARM_ITEM, 0);
  }
}

function CreatePlayerControlledMonster(): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let usMapPos: UINT16;
  if (GetMouseWorldCoordsInCenter(addressof(sWorldX), addressof(sWorldY)) && GetMouseMapPos(addressof(usMapPos))) {
    let MercCreateStruct: SOLDIERCREATE_STRUCT;
    let iNewIndex: INT8;

    memset(addressof(MercCreateStruct), 0, sizeof(MercCreateStruct));
    MercCreateStruct.ubProfile = NO_PROFILE;
    MercCreateStruct.sSectorX = gWorldSectorX;
    MercCreateStruct.sSectorY = gWorldSectorY;
    MercCreateStruct.bSectorZ = gbWorldSectorZ;

    // Note:  only gets called if Alt and/or Ctrl isn't pressed!
    if (_KeyDown(INSERT))
      MercCreateStruct.bBodyType = Enum194.QUEENMONSTER;
    // MercCreateStruct.bBodyType		= LARVAE_MONSTER;
    else
      MercCreateStruct.bBodyType = Enum194.ADULTFEMALEMONSTER;
    MercCreateStruct.bTeam = SOLDIER_CREATE_AUTO_TEAM;
    MercCreateStruct.sInsertionGridNo = usMapPos;
    RandomizeNewSoldierStats(addressof(MercCreateStruct));

    if (TacticalCreateSoldier(addressof(MercCreateStruct), addressof(iNewIndex))) {
      AddSoldierToSector(iNewIndex);
    }
  }
}

function CheckForAndHandleHandleVehicleInteractiveClick(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16, fMovementMode: BOOLEAN): INT8 {
  // Look for an item pool
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let sAPCost: INT16 = 0;

  if (gfUIFullTargetFound) {
    pTSoldier = MercPtrs[gusUIFullTargetID];

    if (OK_ENTERABLE_VEHICLE(pTSoldier) && pTSoldier.value.bVisible != -1 && OKUseVehicle(pTSoldier.value.ubProfile)) {
      if ((GetNumberInVehicle(pTSoldier.value.bVehicleID) == 0) || !fMovementMode) {
        // Find a gridno closest to sweetspot...
        sActionGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.value.usUIMovementMode, 5, addressof(ubDirection), 0, pTSoldier);

        if (sActionGridNo != NOWHERE) {
          // Calculate AP costs...
          // sAPCost = GetAPsToBeginFirstAid( pSoldier );
          sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

          if (EnoughPoints(pSoldier, sAPCost, 0, TRUE)) {
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);

            // CHECK IF WE ARE AT THIS GRIDNO NOW
            if (pSoldier.value.sGridNo != sActionGridNo) {
              // SEND PENDING ACTION
              pSoldier.value.ubPendingAction = Enum257.MERC_ENTER_VEHICLE;
              pSoldier.value.sPendingActionData2 = pTSoldier.value.sGridNo;
              pSoldier.value.bPendingActionData3 = ubDirection;
              pSoldier.value.ubPendingActionAnimCount = 0;

              // WALK UP TO DEST FIRST
              EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, 3, pSoldier.value.fNoAPToFinishMove);
            } else {
              EVENT_SoldierEnterVehicle(pSoldier, pTSoldier.value.sGridNo, ubDirection);
            }

            // OK, set UI
            SetUIBusy(pSoldier.value.ubID);
            // guiPendingOverrideEvent = A_CHANGE_TO_MOVE;

            return -1;
          }
        }
      }
    }
  }

  return 0;
}

function HandleHandCursorClick(usMapPos: UINT16, puiNewEvent: Pointer<UINT32>): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pIntTile: Pointer<LEVELNODE>;
  let sIntTileGridNo: INT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let sAPCost: INT16;
  let sAdjustedGridNo: INT16;
  let pStructure: Pointer<STRUCTURE> = null;
  let pItemPool: Pointer<ITEM_POOL>;
  let fIgnoreItems: BOOLEAN = FALSE;

  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
    // If we are out of breath, no cursor...
    if (pSoldier.value.bBreath < OKBREATH && pSoldier.value.bCollapsed) {
      return;
    }

    if (CheckForAndHandleHandleVehicleInteractiveClick(pSoldier, usMapPos, FALSE) == -1) {
      return;
    }

    // Check if we are on a merc... if so.. steal!
    if (gfUIFullTargetFound) {
      if ((guiUIFullTargetFlags & ENEMY_MERC) && !(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
        sActionGridNo = FindAdjacentGridEx(pSoldier, MercPtrs[gusUIFullTargetID].value.sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
        if (sActionGridNo == -1) {
          sActionGridNo = sAdjustedGridNo;
        }

        // Steal!
        sAPCost = GetAPsToStealItem(pSoldier, sActionGridNo);

        if (EnoughPoints(pSoldier, sAPCost, 0, TRUE)) {
          MercStealFromMerc(pSoldier, MercPtrs[gusUIFullTargetID]);

          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;

          return;
        } else {
          return;
        }
      }
    }

    // Default action gridno to mouse....
    sActionGridNo = usMapPos;

    // If we are over an interactive struct, adjust gridno to this....
    pIntTile = ConditionalGetCurInteractiveTileGridNoAndStructure(addressof(sIntTileGridNo), addressof(pStructure), FALSE);
    if (pIntTile != null) {
      sActionGridNo = sIntTileGridNo;

      // if ( pStructure->fFlags & ( STRUCTURE_SWITCH | STRUCTURE_ANYDOOR ) )
      if (pStructure.value.fFlags & (STRUCTURE_SWITCH)) {
        fIgnoreItems = TRUE;
      }

      if (pStructure.value.fFlags & (STRUCTURE_ANYDOOR) && sActionGridNo != usMapPos) {
        fIgnoreItems = TRUE;
      }
    }

    // Check if we are over an item pool
    // ATE: Ignore items will be set if over a switch interactive tile...
    if (GetItemPool(sActionGridNo, addressof(pItemPool), pSoldier.value.bLevel) && ITEMPOOL_VISIBLE(pItemPool) && !fIgnoreItems) {
      if (AM_AN_EPC(pSoldier)) {
        // Display message
        // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.EPC_CANNOT_DO_THAT]);
      } else if (UIOkForItemPickup(pSoldier, sActionGridNo)) {
        let bZLevel: INT8;

        bZLevel = GetZLevelOfItemPoolGivenStructure(sActionGridNo, pSoldier.value.bLevel, pStructure);

        SoldierPickupItem(pSoldier, pItemPool.value.iItemIndex, sActionGridNo, bZLevel);

        puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
      }
    } else {
      if (pIntTile != null && !(pStructure.value.fFlags & STRUCTURE_HASITEMONTOP)) {
        sActionGridNo = FindAdjacentGridEx(pSoldier, sIntTileGridNo, addressof(ubDirection), null, FALSE, TRUE);
        if (sActionGridNo == -1) {
          sActionGridNo = sIntTileGridNo;
        }

        // If this is not the same tile as ours, check if we can get to dest!
        if (sActionGridNo != pSoldier.value.sGridNo && gsCurrentActionPoints == 0) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
        } else {
          if (SelectedMercCanAffordMove()) {
            puiNewEvent.value = Enum207.C_MOVE_MERC;
          }
        }
      } else {
        // ATE: Here, the poor player wants to search something that does not exist...
        // Why should we not let them make fools of themselves....?
        if (AM_AN_EPC(pSoldier)) {
          // Display message
          // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.EPC_CANNOT_DO_THAT]);
        } else {
          // Check morale, if < threashold, refuse...
          if (pSoldier.value.bMorale < 30) {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
          } else {
            if (gsCurrentActionPoints == 0) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
            } else {
              SoldierPickupItem(pSoldier, NOTHING, sActionGridNo, 0);
              puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
            }
          }
        }
      }
    }
  }
}

function ExchangeMessageBoxCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    SwapMercPositions(gpExchangeSoldier1, gpExchangeSoldier2);
  }
}

function HandleMoveModeInteractiveClick(usMapPos: UINT16, puiNewEvent: Pointer<UINT32>): INT8 {
  // Look for an item pool
  let pItemPool: Pointer<ITEM_POOL>;
  let fContinue: BOOLEAN = TRUE;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pIntTile: Pointer<LEVELNODE>;
  let sIntTileGridNo: INT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let bReturnCode: INT8 = 0;
  let bZLevel: INT8;
  let pStructure: Pointer<STRUCTURE> = null;

  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
    // If we are out of breath, no cursor...
    // if ( pSoldier->bBreath < OKBREATH )
    //{
    //	  return( -1 );
    //}

    // ATE: If we are a vehicle, no moving!
    if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.VEHICLE_CANT_MOVE_IN_TACTICAL]);
      return -3;
    }

    // OK, check for height differences.....
    if (gpWorldLevelData[usMapPos].sHeight != gpWorldLevelData[pSoldier.value.sGridNo].sHeight) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANT_GET_THERE]);
      return -1;
    }

    // See if we are over a vehicle, and walk up to it and enter....
    if (CheckForAndHandleHandleVehicleInteractiveClick(pSoldier, usMapPos, TRUE) == -1) {
      return -1;
    }

    // Check if we are over a civillian....
    if (gfUIFullTargetFound) {
      if (ValidQuickExchangePosition()) {
        // Check if we can...
        if (CanExchangePlaces(pSoldier, MercPtrs[gusUIFullTargetID], TRUE)) {
          gpExchangeSoldier1 = pSoldier;
          gpExchangeSoldier2 = MercPtrs[gusUIFullTargetID];

          // Do message box...
          // DoMessageBox( MSG_BOX_BASIC_STYLE, TacticalStr[ EXCHANGE_PLACES_REQUESTER ], GAME_SCREEN, ( UINT8 )MSG_BOX_FLAG_YESNO, ExchangeMessageBoxCallBack, NULL );
          SwapMercPositions(gpExchangeSoldier1, gpExchangeSoldier2);
        }
      }
      return -3;
    }

    pIntTile = GetCurInteractiveTileGridNoAndStructure(addressof(sIntTileGridNo), addressof(pStructure));

    if (pIntTile != null) {
      bReturnCode = -3;

      // Check if we are over an item pool, take precedence over that.....
      // EXCEPT FOR SWITCHES!
      if (GetItemPool(sIntTileGridNo, addressof(pItemPool), pSoldier.value.bLevel) && !(pStructure.value.fFlags & (STRUCTURE_SWITCH | STRUCTURE_ANYDOOR))) {
        if (AM_AN_EPC(pSoldier)) {
          // Display message
          // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.EPC_CANNOT_DO_THAT]);
          bReturnCode = -1;
        } else if (UIOkForItemPickup(pSoldier, sIntTileGridNo)) {
          bZLevel = GetLargestZLevelOfItemPool(pItemPool);

          if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
            fContinue = FALSE;

            SetUIBusy(pSoldier.value.ubID);

            if ((gTacticalStatus.uiFlags & INCOMBAT) && (gTacticalStatus.uiFlags & TURNBASED)) {
              // puiNewEvent = C_WAIT_FOR_CONFIRM;
              SoldierPickupItem(pSoldier, pItemPool.value.iItemIndex, sIntTileGridNo, bZLevel);
            } else {
              BeginDisplayTimedCursor(Enum210.OKHANDCURSOR_UICURSOR, 300);

              SoldierPickupItem(pSoldier, pItemPool.value.iItemIndex, sIntTileGridNo, bZLevel);
            }
          }
        }
      }

      if (fContinue) {
        sActionGridNo = FindAdjacentGridEx(MercPtrs[gusSelectedSoldier], sIntTileGridNo, addressof(ubDirection), null, FALSE, TRUE);
        if (sActionGridNo == -1) {
          sActionGridNo = sIntTileGridNo;
        }

        // If this is not the same tile as ours, check if we can get to dest!
        if (sActionGridNo != MercPtrs[gusSelectedSoldier].value.sGridNo && gsCurrentActionPoints == 0) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
          bReturnCode = -1;
        } else {
          bReturnCode = -2;
        }
      }
    }
  }

  return bReturnCode;
}

function HandleUIReloading(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let bAPs: INT8 = 0;

  // CHECK OUR CURRENT CURSOR...

  // Do we have the ammo to reload?
  if (guiCurrentUICursor == Enum210.GOOD_RELOAD_UICURSOR) {
    // Check APs to reload...
    bAPs = GetAPsToAutoReload(pSoldier);

    if (EnoughPoints(pSoldier, bAPs, 0, TRUE)) {
      // OK, we have some ammo we can reload.... reload now!
      if (!AutoReload(pSoldier)) {
        // Do we say we could not reload gun...?
      }

      // ATE: Re-examine cursor info!
      gfUIForceReExamineCursorData = TRUE;
    }
    return TRUE;
  }

  if (guiCurrentUICursor == Enum210.BAD_RELOAD_UICURSOR) {
    // OK, we have been told to reload but have no ammo...
    // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, L"No ammo to reload." );
    if (Random(3) == 0) {
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_AMMO);
    }
    return TRUE;
  }

  return FALSE;
}

function ConfirmActionCancel(usMapPos: UINT16, usOldMapPos: UINT16): BOOLEAN {
  // OK, most times we want to leave confirm mode if our
  // gridno is different... but if we are in the grenade throw
  // confirm UI, we want a bigger radius...
  // if ( InAimCubeUI( ) )
  //{
  // Calculate distence between both gridnos.....
  //	if ( GetRangeFromGridNoDiff( GetInAimCubeUIGridNo( ), usOldMapPos ) > 1 )
  // if ( usMapPos != usOldMapPos )
  //	{
  //		return( TRUE );
  //	}
  //
  // else
  {
    if (usMapPos != usOldMapPos) {
      return TRUE;
    }
  }

  return FALSE;
}

function ChangeCurrentSquad(iSquad: INT32): void {
  // only allow if nothing in hand and the Change Squad button for whichever panel we're in must be enabled
  if ((gpItemPointer == null) && !gfDisableTacticalPanelButtons && ((gsCurInterfacePanel != Enum215.TEAM_PANEL) || (ButtonList[iTEAMPanelButtons[Enum221.CHANGE_SQUAD_BUTTON]].value.uiFlags & BUTTON_ENABLED))) {
    if (IsSquadOnCurrentTacticalMap(iSquad)) {
      SetCurrentSquad(iSquad, FALSE);
    }
  }
}

function HandleSelectMercSlot(ubPanelSlot: UINT8, bCode: INT8): void {
  let ubID: UINT8;

  if (GetPlayerIDFromInterfaceTeamSlot(ubPanelSlot, addressof(ubID))) {
    HandleLocateSelectMerc(ubID, bCode);

    ErasePath(TRUE);
    gfPlotNewMovement = TRUE;
  }
}

function TestMeanWhile(iID: INT32): void {
  let MeanwhileDef: MEANWHILE_DEFINITION;
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  MeanwhileDef.sSectorX = 3;
  MeanwhileDef.sSectorY = 16;
  MeanwhileDef.ubNPCNumber = Enum268.QUEEN;
  MeanwhileDef.usTriggerEvent = 0;
  MeanwhileDef.ubMeanwhileID = iID;

  if (iID == Enum160.INTERROGATION) {
    MeanwhileDef.sSectorX = 7;
    MeanwhileDef.sSectorY = 14;

    // Loop through our mercs and set gridnos once some found.....
    // look for all mercs on the same team,
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
      // Are we a POW in this sector?
      if (pSoldier.value.bActive && pSoldier.value.bInSector) {
        ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_POW);

        pSoldier.value.sSectorX = 7;
        pSoldier.value.sSectorY = 14;
      }
    }
  }

  ScheduleMeanwhileEvent(addressof(MeanwhileDef), 10);
}

function EscapeUILock(): void {
  // UNLOCK UI
  UnSetUIBusy(gusSelectedSoldier);

  // Decrease global busy  counter...
  gTacticalStatus.ubAttackBusyCount = 0;

  guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
  UIHandleLUIEndLock(null);
}

function HandleStanceChangeFromUIKeys(ubAnimHeight: UINT8): void {
  // If we have multiple guys selected, make all change stance!
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;
  let pFirstSoldier: Pointer<SOLDIERTYPE> = null;

  if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
    // OK, loop through all guys who are 'multi-selected' and
    // check if our currently selected guy is amoung the
    // lucky few.. if not, change to a guy who is...
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
      if (pSoldier.value.bActive && pSoldier.value.bInSector) {
        if (pSoldier.value.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
          UIHandleSoldierStanceChange(pSoldier.value.ubID, ubAnimHeight);
        }
      }
    }
  } else {
    if (gusSelectedSoldier != NO_SOLDIER)
      UIHandleSoldierStanceChange(gusSelectedSoldier, ubAnimHeight);
  }
}

function ToggleStealthMode(pSoldier: Pointer<SOLDIERTYPE>): void {
  // nothing in hand and either not in SM panel, or the matching button is enabled if we are in SM panel
  if ((gsCurInterfacePanel != Enum215.SM_PANEL) || (ButtonList[giSMStealthButton].value.uiFlags & BUTTON_ENABLED)) {
    // ATE: Toggle stealth
    if (gpSMCurrentMerc != null && pSoldier.value.ubID == gpSMCurrentMerc.value.ubID) {
      gfUIStanceDifferent = TRUE;
    }

    pSoldier.value.bStealthMode = !pSoldier.value.bStealthMode;
    gfPlotNewMovement = TRUE;
    fInterfacePanelDirty = DIRTYLEVEL2;

    if (pSoldier.value.bStealthMode) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_MERC_ON_STEALTHMODE], pSoldier.value.name);
    } else {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, pMessageStrings[Enum333.MSG_MERC_OFF_STEALTHMODE], pSoldier.value.name);
    }
  }
}

function HandleStealthChangeFromUIKeys(): void {
  // If we have multiple guys selected, make all change stance!
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;
  let pFirstSoldier: Pointer<SOLDIERTYPE> = null;

  if (gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
    // OK, loop through all guys who are 'multi-selected' and
    // check if our currently selected guy is amoung the
    // lucky few.. if not, change to a guy who is...
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
      if (pSoldier.value.bActive && !AM_A_ROBOT(pSoldier) && pSoldier.value.bInSector) {
        if (pSoldier.value.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
          ToggleStealthMode(pSoldier);
        }
      }
    }
  } else {
    if (gusSelectedSoldier != NO_SOLDIER) {
      if (!AM_A_ROBOT(MercPtrs[gusSelectedSoldier])) {
        ToggleStealthMode(MercPtrs[gusSelectedSoldier]);
      }
    }
  }
}

function TestCapture(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiNumChosen: UINT32 = 0;

  // StartQuest( QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY );
  // EndQuest( QUEST_HELD_IN_ALMA, gWorldSectorX, gWorldSectorY );

  BeginCaptureSquence();

  gStrategicStatus.uiFlags &= (~STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE);

  // loop through sodliers and pick 3 lucky ones....
  for (cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID, pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.bActive && pSoldier.value.bInSector) {
      if (uiNumChosen < 3) {
        EnemyCapturesPlayerSoldier(pSoldier);

        // Remove them from tectical....
        RemoveSoldierFromGridNo(pSoldier);

        uiNumChosen++;
      }
    }
  }

  EndCaptureSequence();
}

function PopupAssignmentMenuInTactical(pSoldier: Pointer<SOLDIERTYPE>): void {
  // do something
  fShowAssignmentMenu = TRUE;
  CreateDestroyAssignmentPopUpBoxes();
  SetTacticalPopUpAssignmentBoxXY();
  DetermineBoxPositions();
  DetermineWhichAssignmentMenusCanBeShown();
  fFirstClickInAssignmentScreenMask = TRUE;
  gfIgnoreScrolling = TRUE;
}
