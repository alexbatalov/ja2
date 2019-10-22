let gfStartLookingForRubberBanding: BOOLEAN = FALSE;
let gusRubberBandX: UINT16 = 0;
let gusRubberBandY: UINT16 = 0;

let gfBeginBurstSpreadTracking: BOOLEAN = FALSE;

let gfRTClickLeftHoldIntercepted: BOOLEAN = FALSE;
let gfRTHaveClickedRightWhileLeftDown: BOOLEAN = FALSE;

function GetRTMouseButtonInput(puiNewEvent: Pointer<UINT32>): void {
  QueryRTLeftButton(puiNewEvent);
  QueryRTRightButton(puiNewEvent);
}

function QueryRTLeftButton(puiNewEvent: Pointer<UINT32>): void {
  let usSoldierIndex: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiMercFlags: UINT32;
  /* static */ let uiSingleClickTime: UINT32;
  let usMapPos: UINT16;
  let fDone: BOOLEAN = FALSE;
  /* static */ let fDoubleClickIntercepted: BOOLEAN = FALSE;
  /* static */ let fValidDoubleClickPossible: BOOLEAN = FALSE;
  /* static */ let fCanCheckForSpeechAdvance: BOOLEAN = FALSE;
  /* static */ let sMoveClickGridNo: INT16 = 0;

  // LEFT MOUSE BUTTON
  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!GetMouseMapPos(addressof(usMapPos)) && !gfUIShowExitSouth) {
      return;
    }

    if (gusSelectedSoldier != NOBODY) {
      if (MercPtrs[gusSelectedSoldier].value.pTempObject != NULL) {
        return;
      }
    }

    if (gViewportRegion.ButtonState & MSYS_LEFT_BUTTON) {
      if (!fLeftButtonDown) {
        fLeftButtonDown = TRUE;
        gfRTHaveClickedRightWhileLeftDown = FALSE;
        RESETCOUNTER(LMOUSECLICK_DELAY_COUNTER);
        RESETCOUNTER(RUBBER_BAND_START_DELAY);

        if (giUIMessageOverlay == -1) {
          if (gpItemPointer == NULL) {
            switch (gCurrentUIMode) {
              case ACTION_MODE:

                if (gusSelectedSoldier != NOBODY) {
                  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier) && gpItemPointer == NULL) {
                    // OK, check for needing ammo
                    if (HandleUIReloading(pSoldier)) {
                      gfRTClickLeftHoldIntercepted = TRUE;
                      // fLeftButtonDown				= FALSE;
                    } else {
                      if (pSoldier.value.bDoBurst) {
                        pSoldier.value.sStartGridNo = usMapPos;
                        ResetBurstLocations();
                        puiNewEvent.value = A_CHANGE_TO_CONFIM_ACTION;
                      } else {
                        gfRTClickLeftHoldIntercepted = TRUE;

                        if (UIMouseOnValidAttackLocation(pSoldier)) {
                          // OK< going into confirm will call a function that will automatically move
                          // us to shoot in most vases ( grenades need a confirm mode regardless )
                          puiNewEvent.value = A_CHANGE_TO_CONFIM_ACTION;
                          //*puiNewEvent = CA_MERC_SHOOT;
                          PauseRT(FALSE);
                        }
                      }
                    }
                  }
                }
                break;

              case MOVE_MODE:

                gfUICanBeginAllMoveCycle = TRUE;

                if (!HandleCheckForExitArrowsInput(FALSE) && gpItemPointer == NULL) {
                  if (gfUIFullTargetFound && (guiUIFullTargetFlags & OWNED_MERC)) {
                    // Reset , if this guy is selected merc, reset any multi selections...
                    if (gusUIFullTargetID == gusSelectedSoldier) {
                      ResetMultiSelection();
                    }
                  } else {
                    let bReturnCode: INT8;

                    bReturnCode = HandleMoveModeInteractiveClick(usMapPos, puiNewEvent);

                    if (bReturnCode == -1) {
                      // gfRTClickLeftHoldIntercepted = TRUE;
                    } else if (bReturnCode == -2) {
                      // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                      //{
                      //	*puiNewEvent = C_WAIT_FOR_CONFIRM;
                      //	gfPlotNewMovement = TRUE;
                      //}/
                      // else
                    } else if (bReturnCode == -3) {
                      gfRTClickLeftHoldIntercepted = TRUE;
                    } else if (bReturnCode == 0) {
                      {
                        {
                          let fResult: BOOLEAN;

                          if (gusSelectedSoldier != NOBODY) {
                            if ((fResult = UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) == 1) {
                              if (gsCurrentActionPoints != 0) {
                                // We're on terrain in which we can walk, walk
                                // If we're on terrain,
                                if (!gGameSettings.fOptions[TOPTION_RTCONFIRM]) {
                                  puiNewEvent.value = C_WAIT_FOR_CONFIRM;
                                  gfPlotNewMovement = TRUE;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  // gfRTClickLeftHoldIntercepted = TRUE;
                } else {
                  gfRTClickLeftHoldIntercepted = TRUE;
                  fIgnoreLeftUp = TRUE;
                }

                break;
            }
          }
        }
        if (gfUIWaitingForUserSpeechAdvance) {
          fCanCheckForSpeechAdvance = TRUE;
        }
      }

      if (gpItemPointer == NULL) {
        if (giUIMessageOverlay == -1 && !gfRTHaveClickedRightWhileLeftDown) {
          // HERE FOR CLICK-DRAG CLICK
          switch (gCurrentUIMode) {
            case MOVE_MODE:
            case CONFIRM_MOVE_MODE:

              // First check if we clicked on a guy, if so, make selected if it's ours
              if (FindSoldierFromMouse(addressof(usSoldierIndex), addressof(uiMercFlags))) {
                // Select guy
                if ((uiMercFlags & SELECTED_MERC) && !(uiMercFlags & UNCONSCIOUS_MERC) && !(MercPtrs[usSoldierIndex].value.uiStatusFlags & SOLDIER_VEHICLE)) {
                  puiNewEvent.value = M_CHANGE_TO_ADJPOS_MODE;
                }
              } else {
                // if ( COUNTERDONE( RUBBER_BAND_START_DELAY )  )
                {
                  // OK, change to rubber banding mode..
                  // Have we started this yet?
                  if (!gfStartLookingForRubberBanding && !gRubberBandActive) {
                    gfStartLookingForRubberBanding = TRUE;
                    gusRubberBandX = gusMouseXPos;
                    gusRubberBandY = gusMouseYPos;
                  } else {
                    // Have we moved....?
                    if (abs(gusMouseXPos - gusRubberBandX) > 10 || abs(gusMouseYPos - gusRubberBandY) > 10) {
                      gfStartLookingForRubberBanding = FALSE;

                      // Stop scrolling:
                      gfIgnoreScrolling = TRUE;

                      // Anchor cursor....
                      RestrictMouseToXYXY(0, 0, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);

                      // OK, settup anchor....
                      gRubberBandRect.iLeft = gusRubberBandX;
                      gRubberBandRect.iTop = gusRubberBandY;

                      gRubberBandActive = TRUE;

                      // ATE: If we have stopped scrolling.....
                      if (gfScrollInertia != FALSE) {
                        SetRenderFlags(RENDER_FLAG_FULL | RENDER_FLAG_CHECKZ);

                        // Restore Interface!
                        RestoreInterface();

                        // Delete Topmost blitters saved areas
                        DeleteVideoOverlaysArea();

                        gfScrollInertia = FALSE;
                      }

                      puiNewEvent.value = RB_ON_TERRAIN;
                      return;
                    }
                  }
                }
              }
              break;
          }
        }
      }
    } else {
      if (fLeftButtonDown) {
        if (!fIgnoreLeftUp) {
          // set flag for handling single clicks
          // OK , FOR DOUBLE CLICKS - TAKE TIME STAMP & RECORD EVENT
          if ((GetJA2Clock() - uiSingleClickTime) < 300) {
            // CHECK HERE FOR DOUBLE CLICK EVENTS
            if (fValidDoubleClickPossible) {
              if (gpItemPointer == NULL) {
                fDoubleClickIntercepted = TRUE;

                // First check if we clicked on a guy, if so, make selected if it's ours
                if (gusSelectedSoldier != NO_SOLDIER) {
                  // Set movement mode
                  // OK, only change this if we are stationary!
                  // if ( gAnimControl[ MercPtrs[ gusSelectedSoldier ]->usAnimState ].uiFlags & ANIM_STATIONARY )
                  // if ( MercPtrs[ gusSelectedSoldier ]->usAnimState == WALKING )
                  {
                    MercPtrs[gusSelectedSoldier].value.fUIMovementFast = TRUE;
                    puiNewEvent.value = C_MOVE_MERC;
                  }
                }
              }
            }
          }

          // Capture time!
          uiSingleClickTime = GetJA2Clock();

          fValidDoubleClickPossible = FALSE;

          if (!fDoubleClickIntercepted) {
            // FIRST CHECK FOR ANYTIME ( NON-INTERVAL ) CLICKS
            switch (gCurrentUIMode) {
              case ADJUST_STANCE_MODE:

                // If button has come up, change to mocve mode
                puiNewEvent.value = PADJ_ADJUST_STANCE;
                break;
            }

            // CHECK IF WE CLICKED-HELD
            if (COUNTERDONE(LMOUSECLICK_DELAY_COUNTER) && gpItemPointer != NULL) {
              // LEFT CLICK-HOLD EVENT
              // Switch on UI mode
              switch (gCurrentUIMode) {
                case CONFIRM_ACTION_MODE:
                case ACTION_MODE:

                  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                    if (pSoldier.value.bDoBurst) {
                      pSoldier.value.sEndGridNo = usMapPos;

                      gfBeginBurstSpreadTracking = FALSE;

                      if (pSoldier.value.sEndGridNo != pSoldier.value.sStartGridNo) {
                        pSoldier.value.fDoSpread = TRUE;

                        PickBurstLocations(pSoldier);

                        puiNewEvent.value = CA_MERC_SHOOT;
                      } else {
                        pSoldier.value.fDoSpread = FALSE;
                      }
                      gfRTClickLeftHoldIntercepted = TRUE;
                    }
                  }
                  break;
              }
            }
            // else
            {
              // LEFT CLICK NORMAL EVENT
              // Switch on UI mode
              if (!gfRTClickLeftHoldIntercepted) {
                if (giUIMessageOverlay != -1) {
                  EndUIMessage();
                } else {
                  if (!HandleCheckForExitArrowsInput(TRUE)) {
                    if (gpItemPointer != NULL) {
                      if (HandleItemPointerClick(usMapPos)) {
                        // getout of mode
                        EndItemPointer();

                        puiNewEvent.value = A_CHANGE_TO_MOVE;
                      }
                    } else {
                      // Check for wiating for keyboard advance
                      if (gfUIWaitingForUserSpeechAdvance && fCanCheckForSpeechAdvance) {
                        // We have a key, advance!
                        DialogueAdvanceSpeech();
                      } else {
                        switch (gCurrentUIMode) {
                          case MENU_MODE:

                            // If we get a hit here and we're in menu mode, quit the menu mode
                            EndMenuEvent(guiCurrentEvent);
                            break;

                          case IDLE_MODE:

                            // First check if we clicked on a guy, if so, make selected if it's ours
                            if (FindSoldierFromMouse(addressof(usSoldierIndex), addressof(uiMercFlags))) {
                              // Select guy
                              if (uiMercFlags & OWNED_MERC) {
                                puiNewEvent.value = I_SELECT_MERC;
                              }
                            }
                            break;

                          case HANDCURSOR_MODE:

                            HandleHandCursorClick(usMapPos, puiNewEvent);
                            break;

                          case ACTION_MODE:

                            //*puiNewEvent = A_CHANGE_TO_CONFIM_ACTION;
                            // if(	GetSoldier( &pSoldier, gusSelectedSoldier ) )
                            //{
                            //	pSoldier->sStartGridNo = usMapPos;
                            //	ResetBurstLocations( );
                            //}
                            puiNewEvent.value = CA_MERC_SHOOT;
                            break;

                          case CONFIRM_MOVE_MODE:

                            if (gusSelectedSoldier != NO_SOLDIER) {
                              if (MercPtrs[gusSelectedSoldier].value.usAnimState != RUNNING) {
                                puiNewEvent.value = C_MOVE_MERC;
                              } else {
                                MercPtrs[gusSelectedSoldier].value.fUIMovementFast = 2;
                                puiNewEvent.value = C_MOVE_MERC;
                              }
                            }

                            //*puiNewEvent = C_MOVE_MERC;

                            // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                            { fValidDoubleClickPossible = TRUE; }
                            break;

                          case CONFIRM_ACTION_MODE:

                            // Check if we are stationary
                            // if ( AimCubeUIClick( ) )
                            //{
                            //	if ( gusSelectedSoldier != NO_SOLDIER )
                            //	{
                            //		if ( !( gAnimControl[ MercPtrs[ gusSelectedSoldier ]->usAnimState ].uiFlags & ANIM_STATIONARY ) )
                            //		{

                            // gUITargetShotWaiting  = TRUE;
                            // gsUITargetShotGridNo	= usMapPos;
                            //		}
                            //		else
                            //		{
                            //	*puiNewEvent = CA_MERC_SHOOT;
                            //		}
                            puiNewEvent.value = CA_MERC_SHOOT;
                            //	}
                            //}
                            break;

                          case MOVE_MODE:

                            if (!HandleCheckForExitArrowsInput(FALSE) && gpItemPointer == NULL) {
                              // First check if we clicked on a guy, if so, make selected if it's ours
                              if (gfUIFullTargetFound && (guiUIFullTargetFlags & OWNED_MERC)) {
                                if (!(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                                  // Select guy
                                  if (GetSoldier(addressof(pSoldier), gusUIFullTargetID) && gpItemPointer == NULL) {
                                    if (pSoldier.value.bAssignment >= ON_DUTY && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
                                      PopupAssignmentMenuInTactical(pSoldier);
                                    } else {
                                      if (!_KeyDown(ALT)) {
                                        ResetMultiSelection();
                                        puiNewEvent.value = I_SELECT_MERC;
                                      } else {
                                        if (pSoldier.value.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
                                          pSoldier.value.uiStatusFlags &= (~SOLDIER_MULTI_SELECTED);
                                        } else {
                                          pSoldier.value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                          // Say Confimation...
                                          if (!gGameSettings.fOptions[TOPTION_MUTE_CONFIRMATIONS])
                                            DoMercBattleSound(pSoldier, BATTLE_SOUND_ATTN1);

                                          // OK, if we have a selected guy.. make him part too....
                                          if (gusSelectedSoldier != NOBODY) {
                                            MercPtrs[gusSelectedSoldier].value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                          }
                                        }

                                        gfIgnoreOnSelectedGuy = TRUE;

                                        EndMultiSoldierSelection(FALSE);
                                      }
                                    }
                                  } else {
                                    if (!_KeyDown(ALT)) {
                                      ResetMultiSelection();
                                      puiNewEvent.value = I_SELECT_MERC;
                                    } else {
                                      if (pSoldier.value.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
                                        pSoldier.value.uiStatusFlags &= (~SOLDIER_MULTI_SELECTED);
                                      } else {
                                        pSoldier.value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                        // Say Confimation...
                                        if (!gGameSettings.fOptions[TOPTION_MUTE_CONFIRMATIONS])
                                          DoMercBattleSound(pSoldier, BATTLE_SOUND_ATTN1);
                                      }

                                      // OK, if we have a selected guy.. make him part too....
                                      if (gusSelectedSoldier != NOBODY) {
                                        MercPtrs[gusSelectedSoldier].value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                      }

                                      gfIgnoreOnSelectedGuy = TRUE;

                                      EndMultiSoldierSelection(FALSE);
                                    }
                                  }
                                }
                                gfRTClickLeftHoldIntercepted = TRUE;
                              } else {
                                let bReturnCode: INT8;

                                bReturnCode = HandleMoveModeInteractiveClick(usMapPos, puiNewEvent);

                                if (bReturnCode == -1) {
                                  gfRTClickLeftHoldIntercepted = TRUE;
                                } else if (bReturnCode == -2) {
                                  // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                                  //{
                                  //	*puiNewEvent = C_WAIT_FOR_CONFIRM;
                                  //	gfPlotNewMovement = TRUE;
                                  //}/
                                  // else
                                  {
                                    let sIntTileGridNo: INT16;

                                    if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                                      BeginDisplayTimedCursor(GetInteractiveTileCursor(guiCurrentUICursor, TRUE), 300);

                                      if (pSoldier.value.usAnimState != RUNNING) {
                                        puiNewEvent.value = C_MOVE_MERC;
                                      } else {
                                        if (GetCurInteractiveTileGridNo(addressof(sIntTileGridNo)) != NULL) {
                                          pSoldier.value.fUIMovementFast = TRUE;
                                          puiNewEvent.value = C_MOVE_MERC;
                                        }
                                      }
                                      fValidDoubleClickPossible = TRUE;
                                    }
                                  }
                                } else if (bReturnCode == 0) {
                                  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                                    // First check if we clicked on a guy, if so, make selected if it's ours
                                    if (FindSoldierFromMouse(addressof(usSoldierIndex), addressof(uiMercFlags)) && (uiMercFlags & OWNED_MERC)) {
                                      // Select guy
                                      puiNewEvent.value = I_SELECT_MERC;
                                      gfRTClickLeftHoldIntercepted = TRUE;
                                    } else {
                                      // if ( FindBestPath( pSoldier, usMapPos, pSoldier->bLevel, pSoldier->usUIMovementMode, NO_COPYROUTE, 0 ) == 0 )
                                      if (gsCurrentActionPoints == 0 && !gfUIAllMoveOn && !gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
                                        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[NO_PATH]);
                                        gfRTClickLeftHoldIntercepted = TRUE;
                                      } else {
                                        let fResult: BOOLEAN;

                                        if (gusSelectedSoldier != NOBODY) {
                                          if ((fResult = UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) == 1) {
                                            if (gfUIAllMoveOn) {
                                              // ATE: Select everybody in squad and make move!
                                              {
                                                // Make move!
                                                puiNewEvent.value = C_MOVE_MERC;

                                                fValidDoubleClickPossible = TRUE;
                                              }
                                            } else {
                                              // We're on terrain in which we can walk, walk
                                              // If we're on terrain,
                                              if (gGameSettings.fOptions[TOPTION_RTCONFIRM]) {
                                                puiNewEvent.value = C_WAIT_FOR_CONFIRM;
                                                gfPlotNewMovement = TRUE;
                                              } else {
                                                puiNewEvent.value = C_MOVE_MERC;
                                                fValidDoubleClickPossible = TRUE;
                                              }
                                            }
                                          } else {
                                            if (fResult == 2) {
                                              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[NOBODY_USING_REMOTE_STR]);
                                            } else {
                                              // if ( usMapPos != sMoveClickGridNo || pSoldier->uiStatusFlags & SOLDIER_ROBOT )
                                              //{
                                              //		sMoveClickGridNo					= usMapPos;

                                              // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ CANT_MOVE_THERE_STR ] );

                                              //		*puiNewEvent					  = M_CHANGE_TO_HANDMODE;
                                              //		gsOverItemsGridNo				= usMapPos;
                                              //		gsOverItemsLevel				= gsInterfaceLevel;
                                              //	}
                                              //	else
                                              //	{
                                              //		sMoveClickGridNo = 0;
                                              //		*puiNewEvent = M_CHANGE_TO_HANDMODE;
                                              //	}
                                            }
                                            // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, L"Invalid move destination." );

                                            // Goto hand cursor mode...
                                            //*puiNewEvent = M_CHANGE_TO_HANDMODE;

                                            gfRTClickLeftHoldIntercepted = TRUE;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              // gfRTClickLeftHoldIntercepted = TRUE;
                            } else {
                              gfRTClickLeftHoldIntercepted = TRUE;
                            }

                            break;

                          case LOOKCURSOR_MODE:
                            // If we cannot actually do anything, return to movement mode
                            puiNewEvent.value = LC_LOOK;
                            break;

                          case JUMPOVER_MODE:

                            puiNewEvent.value = JP_JUMP;
                            break;

                          case TALKCURSOR_MODE:

                            PauseRT(FALSE);

                            if (HandleTalkInit()) {
                              puiNewEvent.value = TA_TALKINGMENU;
                            }
                            break;

                          case GETTINGITEM_MODE:

                            // Remove menu!
                            // RemoveItemPickupMenu( );
                            break;

                          case TALKINGMENU_MODE:

                            // HandleTalkingMenuEscape( TRUE );
                            break;

                          case EXITSECTORMENU_MODE:

                            RemoveSectorExitMenu(FALSE);
                            break;

                          case OPENDOOR_MENU_MODE:

                            CancelOpenDoorMenu();
                            HandleOpenDoorMenu();
                            puiNewEvent.value = A_CHANGE_TO_MOVE;
                            break;

                          case RUBBERBAND_MODE:

                            EndRubberBanding();
                            puiNewEvent.value = A_CHANGE_TO_MOVE;
                            break;
                        }
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
        gfRTClickLeftHoldIntercepted = FALSE;
        fDoubleClickIntercepted = FALSE;
        fCanCheckForSpeechAdvance = FALSE;
        gfStartLookingForRubberBanding = FALSE;

        // Reset counter
        RESETCOUNTER(LMOUSECLICK_DELAY_COUNTER);
      }
    }
  } else {
    // Set mouse down to false
    // fLeftButtonDown = FALSE;

    // fCanCheckForSpeechAdvance = FALSE;

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

function QueryRTRightButton(puiNewEvent: Pointer<UINT32>): void {
  /* static */ let fClickHoldIntercepted: BOOLEAN = FALSE;
  /* static */ let fClickIntercepted: BOOLEAN = FALSE;
  /* static */ let uiSingleClickTime: UINT32;
  /* static */ let fDoubleClickIntercepted: BOOLEAN = FALSE;
  /* static */ let fValidDoubleClickPossible: BOOLEAN = FALSE;

  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;

  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!GetMouseMapPos(addressof(usMapPos))) {
      return;
    }

    // RIGHT MOUSE BUTTON
    if (gViewportRegion.ButtonState & MSYS_RIGHT_BUTTON) {
      if (!fRightButtonDown) {
        fRightButtonDown = TRUE;
        RESETCOUNTER(RMOUSECLICK_DELAY_COUNTER);
      }

      // CHECK COMBINATIONS
      if (fLeftButtonDown) {
        // fIgnoreLeftUp = TRUE;
        gfRTHaveClickedRightWhileLeftDown = TRUE;

        if (gpItemPointer == NULL) {
          // ATE:
          if (gusSelectedSoldier != NOBODY) {
            switch (gCurrentUIMode) {
              case CONFIRM_MOVE_MODE:
              case MOVE_MODE:

                if (!gfUIAllMoveOn) {
                  fValidDoubleClickPossible = TRUE;

                  // OK, our first right-click is an all-cycle
                  if (gfUICanBeginAllMoveCycle) {
                    // ATE: Here, check if we can do this....
                    if (!UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) {
                      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[CANT_MOVE_THERE_STR]);
                      gfRTClickLeftHoldIntercepted = TRUE;
                    }
                    // else if ( gsCurrentActionPoints == 0 )
                    //{
                    //	ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
                    //	gfRTClickLeftHoldIntercepted = TRUE;
                    //}
                    else {
                      puiNewEvent.value = M_CYCLE_MOVE_ALL;
                    }
                  }
                  fClickHoldIntercepted = TRUE;
                }
            }

            // ATE: Added cancel of burst mode....
            if (gfBeginBurstSpreadTracking) {
              gfBeginBurstSpreadTracking = FALSE;
              gfRTClickLeftHoldIntercepted = TRUE;
              MercPtrs[gusSelectedSoldier].value.fDoSpread = FALSE;
              fClickHoldIntercepted = TRUE;
              puiNewEvent.value = A_END_ACTION;
              gCurrentUIMode = MOVE_MODE;
            }
          }
        }
      } else {
        // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
        if (COUNTERDONE(RMOUSECLICK_DELAY_COUNTER) && !fClickHoldIntercepted) {
          if (gpItemPointer == NULL) {
            // Switch on UI mode
            switch (gCurrentUIMode) {
              case IDLE_MODE:
              case ACTION_MODE:
              case HANDCURSOR_MODE:
              case LOOKCURSOR_MODE:
              case TALKCURSOR_MODE:
              case MOVE_MODE:

                if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                  if ((guiUIFullTargetFlags & OWNED_MERC) && (guiUIFullTargetFlags & VISIBLE_MERC) && !(guiUIFullTargetFlags & DEAD_MERC) && !(pSoldier ? pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE : 0)) {
                    // if( pSoldier->bAssignment >= ON_DUTY )
                    {
                      PopupAssignmentMenuInTactical(pSoldier);
                      fClickHoldIntercepted = TRUE;
                    }
                    break;
                  } else {
                    fShowAssignmentMenu = FALSE;
                    CreateDestroyAssignmentPopUpBoxes();
                    DetermineWhichAssignmentMenusCanBeShown();
                  }

                  // ATE:
                  if (!fClickHoldIntercepted) {
                    puiNewEvent.value = U_MOVEMENT_MENU;
                    fClickHoldIntercepted = TRUE;
                  }
                  break;
                }
            }

            if (gCurrentUIMode == ACTION_MODE || gCurrentUIMode == TALKCURSOR_MODE) {
              PauseRT(FALSE);
            }
          }
        }
      }
    } else {
      if (fRightButtonDown) {
        // OK , FOR DOUBLE CLICKS - TAKE TIME STAMP & RECORD EVENT
        if ((GetJA2Clock() - uiSingleClickTime) < 300) {
          // CHECK HERE FOR DOUBLE CLICK EVENTS
          if (fValidDoubleClickPossible) {
            fDoubleClickIntercepted = TRUE;

            // Do stuff....
            // OK, check if left button down...
            if (fLeftButtonDown) {
              if (gpItemPointer == NULL) {
                if (!fClickIntercepted && !fClickHoldIntercepted) {
                  // ATE:
                  if (gusSelectedSoldier != NOBODY) {
                    // fIgnoreLeftUp = TRUE;
                    switch (gCurrentUIMode) {
                      case CONFIRM_MOVE_MODE:
                      case MOVE_MODE:

                        if (gfUIAllMoveOn) {
                          // OK, now we wish to run!
                          gfUIAllMoveOn = 2;
                        }
                    }
                  }
                }
              }
            }
          }
        }

        // Capture time!
        uiSingleClickTime = GetJA2Clock();

        fValidDoubleClickPossible = TRUE;

        if (!fDoubleClickIntercepted) {
          // CHECK COMBINATIONS
          if (fLeftButtonDown) {
            if (gpItemPointer == NULL) {
              if (!fClickHoldIntercepted && !fClickIntercepted) {
                // ATE:
                if (gusSelectedSoldier != NOBODY) {
                  // fIgnoreLeftUp = TRUE;
                  switch (gCurrentUIMode) {
                    case CONFIRM_MOVE_MODE:
                    case MOVE_MODE:

                      if (gfUIAllMoveOn) {
                        gfUIAllMoveOn = FALSE;
                        gfUICanBeginAllMoveCycle = TRUE;
                      }
                  }
                }
              }
            }
          } else {
            if (!fClickHoldIntercepted && !fClickIntercepted) {
              if (gpItemPointer == NULL) {
                // ATE:
                if (gusSelectedSoldier != NOBODY) {
                  // Switch on UI mode
                  switch (gCurrentUIMode) {
                    case IDLE_MODE:

                      break;

                    case CONFIRM_MOVE_MODE:
                    case MOVE_MODE:
                    case TALKCURSOR_MODE:

                    {
                      // We have here a change to action mode
                      puiNewEvent.value = M_CHANGE_TO_ACTION;
                    }
                      fClickIntercepted = TRUE;
                      break;

                    case ACTION_MODE:

                      // We have here a change to move mode
                      puiNewEvent.value = A_END_ACTION;
                      fClickIntercepted = TRUE;
                      break;

                    case CONFIRM_ACTION_MODE:

                      if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                        HandleRightClickAdjustCursor(pSoldier, usMapPos);
                      }
                      fClickIntercepted = TRUE;
                      break;

                    case MENU_MODE:

                      // If we get a hit here and we're in menu mode, quit the menu mode
                      EndMenuEvent(guiCurrentEvent);
                      fClickIntercepted = TRUE;
                      break;

                    case HANDCURSOR_MODE:
                      // If we cannot actually do anything, return to movement mode
                      puiNewEvent.value = A_CHANGE_TO_MOVE;
                      break;

                    case LOOKCURSOR_MODE:

                      // If we cannot actually do anything, return to movement mode
                      puiNewEvent.value = A_CHANGE_TO_MOVE;
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
        fDoubleClickIntercepted = FALSE;

        // Reset counter
        RESETCOUNTER(RMOUSECLICK_DELAY_COUNTER);
      }
    }
  }
}

function GetRTMousePositionInput(puiNewEvent: Pointer<UINT32>): void {
  let usMapPos: UINT16;
  /* static */ let usOldMapPos: UINT16 = 0;
  /* static */ let uiMoveTargetSoldierId: UINT32 = NO_SOLDIER;
  let pSoldier: Pointer<SOLDIERTYPE>;
  /* static */ let fOnValidGuy: BOOLEAN = FALSE;

  if (!GetMouseMapPos(addressof(usMapPos))) {
    return;
  }

  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    // Handle highlighting stuff
    HandleObjectHighlighting();

    // Check if we have an item in our hands...
    if (gpItemPointer != NULL) {
      puiNewEvent.value = A_ON_TERRAIN;
      return;
    }

    // Switch on modes
    switch (gCurrentUIMode) {
      case RUBBERBAND_MODE:

        // ATE: Make sure!
        if (gRubberBandActive == FALSE) {
          puiNewEvent.value = M_ON_TERRAIN;
        } else {
          puiNewEvent.value = RB_ON_TERRAIN;
        }
        break;

      case JUMPOVER_MODE:

        // ATE: Make sure!
        if (gsJumpOverGridNo != usMapPos) {
          puiNewEvent.value = A_CHANGE_TO_MOVE;
        } else {
          puiNewEvent.value = JP_ON_TERRAIN;
        }
        break;

      case LOCKUI_MODE:
        puiNewEvent.value = LU_ON_TERRAIN;
        break;

      case IDLE_MODE:
        puiNewEvent.value = I_ON_TERRAIN;
        break;

      case ENEMYS_TURN_MODE:
        puiNewEvent.value = ET_ON_TERRAIN;
        break;

      case LOOKCURSOR_MODE:
        puiNewEvent.value = LC_ON_TERRAIN;
        break;

      case TALKCURSOR_MODE:

        if (uiMoveTargetSoldierId != NOBODY) {
          if (gfUIFullTargetFound) {
            if (gusUIFullTargetID != uiMoveTargetSoldierId) {
              puiNewEvent.value = A_CHANGE_TO_MOVE;
              return;
            }
          } else {
            puiNewEvent.value = A_CHANGE_TO_MOVE;
            return;
          }
        }
        puiNewEvent.value = T_ON_TERRAIN;
        break;

      case GETTINGITEM_MODE:

        break;

      case TALKINGMENU_MODE:

        if (HandleTalkingMenu()) {
          puiNewEvent.value = A_CHANGE_TO_MOVE;
        }
        break;

      case EXITSECTORMENU_MODE:

        if (HandleSectorExitMenu()) {
          puiNewEvent.value = A_CHANGE_TO_MOVE;
        }
        break;

      case OPENDOOR_MENU_MODE:

        if (HandleOpenDoorMenu()) {
          puiNewEvent.value = A_CHANGE_TO_MOVE;
        }
        break;

      case HANDCURSOR_MODE:

        puiNewEvent.value = HC_ON_TERRAIN;
        break;

      case MOVE_MODE:

        if (usMapPos != usOldMapPos) {
          // Set off ALL move....
          gfUIAllMoveOn = FALSE;
        }

        uiMoveTargetSoldierId = NO_SOLDIER;

        // Check for being on terrain
        if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
          let usItem: UINT16;
          let ubItemCursor: UINT8;

          // Alrighty, check what's in our hands = if a 'friendly thing', like med kit, look for our own guys
          usItem = pSoldier.value.inv[HANDPOS].usItem;

          // get cursor for item
          ubItemCursor = GetActionModeCursor(pSoldier);

          //
          if (IsValidJumpLocation(pSoldier, usMapPos, TRUE)) {
            puiNewEvent.value = JP_ON_TERRAIN;
            gsJumpOverGridNo = usMapPos;
            return;
          } else {
            if (gfUIFullTargetFound) {
              if (IsValidTalkableNPC(gusUIFullTargetID, FALSE, FALSE, FALSE) && !_KeyDown(SHIFT) && !AM_AN_EPC(pSoldier) && MercPtrs[gusUIFullTargetID].value.bTeam != ENEMY_TEAM && !ValidQuickExchangePosition()) {
                uiMoveTargetSoldierId = gusUIFullTargetID;
                puiNewEvent.value = T_CHANGE_TO_TALKING;
                return;
              } else if (ubItemCursor == AIDCURS) {
                // IF it's an ememy, goto confirm action mode
                if ((guiUIFullTargetFlags & OWNED_MERC) && (guiUIFullTargetFlags & VISIBLE_MERC) && !(guiUIFullTargetFlags & DEAD_MERC)) {
                  // uiMoveTargetSoldierId = gusUIFullTargetID;
                  //*puiNewEvent = A_ON_TERRAIN;
                  // return;
                }
              } else {
                // IF it's an ememy, goto confirm action mode
                if ((guiUIFullTargetFlags & ENEMY_MERC) && (guiUIFullTargetFlags & VISIBLE_MERC) && !(guiUIFullTargetFlags & DEAD_MERC)) {
                  uiMoveTargetSoldierId = gusUIFullTargetID;
                  puiNewEvent.value = A_ON_TERRAIN;
                  return;
                }
              }
            }
          }
        }
        puiNewEvent.value = M_ON_TERRAIN;
        break;

      case ACTION_MODE:

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
                puiNewEvent.value = A_CHANGE_TO_MOVE;
                return;
              }
            }
          }
        } else {
          if (gUIActionModeChangeDueToMouseOver) {
            puiNewEvent.value = A_CHANGE_TO_MOVE;
            return;
          }
        }
        puiNewEvent.value = A_ON_TERRAIN;
        break;

      case CONFIRM_MOVE_MODE:

        if (usMapPos != usOldMapPos) {
          // Switch event out of confirm mode
          // Set off ALL move....
          gfUIAllMoveOn = FALSE;

          puiNewEvent.value = A_CHANGE_TO_MOVE;
        }
        break;

      case CONFIRM_ACTION_MODE:

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

              puiNewEvent.value = CA_ON_TERRAIN;
              break;
            }
          }
        }

        // First check if we are on a guy, if so, make selected if it's ours
        if (gfUIFullTargetFound) {
          if (guiUITargetSoldierId != gusUIFullTargetID) {
            // Switch event out of confirm mode
            puiNewEvent.value = CA_END_CONFIRM_ACTION;
          } else {
            puiNewEvent.value = CA_ON_TERRAIN;
          }
        } else {
          if (ConfirmActionCancel(usMapPos, usOldMapPos)) {
            // Switch event out of confirm mode
            puiNewEvent.value = CA_END_CONFIRM_ACTION;
          } else {
            puiNewEvent.value = CA_ON_TERRAIN;
          }
        }
        break;
    }

    // if ( gCurrentUIMode != CONFIRM_ACTION_MODE )
    //{
    //	if(	GetSoldier( &pSoldier, gusSelectedSoldier ) )
    //	{
    // Change refine value back to 1
    ///		pSoldier->bShownAimTime = REFINE_AIM_1;
    //	}
    //}

    usOldMapPos = usMapPos;
  }
}
