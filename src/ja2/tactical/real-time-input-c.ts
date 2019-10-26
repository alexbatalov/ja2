let gfStartLookingForRubberBanding: boolean = false;
let gusRubberBandX: UINT16 = 0;
let gusRubberBandY: UINT16 = 0;

export let gfBeginBurstSpreadTracking: boolean = false;

export let gfRTClickLeftHoldIntercepted: boolean = false;
let gfRTHaveClickedRightWhileLeftDown: boolean = false;

export function GetRTMouseButtonInput(puiNewEvent: Pointer<UINT32>): void {
  QueryRTLeftButton(puiNewEvent);
  QueryRTRightButton(puiNewEvent);
}

function QueryRTLeftButton(puiNewEvent: Pointer<UINT32>): void {
  let usSoldierIndex: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiMercFlags: UINT32;
  /* static */ let uiSingleClickTime: UINT32;
  let usMapPos: UINT16;
  let fDone: boolean = false;
  /* static */ let fDoubleClickIntercepted: boolean = false;
  /* static */ let fValidDoubleClickPossible: boolean = false;
  /* static */ let fCanCheckForSpeechAdvance: boolean = false;
  /* static */ let sMoveClickGridNo: INT16 = 0;

  // LEFT MOUSE BUTTON
  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!GetMouseMapPos(addressof(usMapPos)) && !gfUIShowExitSouth) {
      return;
    }

    if (gusSelectedSoldier != NOBODY) {
      if (MercPtrs[gusSelectedSoldier].value.pTempObject != null) {
        return;
      }
    }

    if (gViewportRegion.ButtonState & MSYS_LEFT_BUTTON) {
      if (!fLeftButtonDown) {
        fLeftButtonDown = true;
        gfRTHaveClickedRightWhileLeftDown = false;
        RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);
        RESETCOUNTER(Enum386.RUBBER_BAND_START_DELAY);

        if (giUIMessageOverlay == -1) {
          if (gpItemPointer == null) {
            switch (gCurrentUIMode) {
              case Enum206.ACTION_MODE:

                if (gusSelectedSoldier != NOBODY) {
                  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier) && gpItemPointer == null) {
                    // OK, check for needing ammo
                    if (HandleUIReloading(pSoldier)) {
                      gfRTClickLeftHoldIntercepted = true;
                      // fLeftButtonDown				= FALSE;
                    } else {
                      if (pSoldier.value.bDoBurst) {
                        pSoldier.value.sStartGridNo = usMapPos;
                        ResetBurstLocations();
                        puiNewEvent.value = Enum207.A_CHANGE_TO_CONFIM_ACTION;
                      } else {
                        gfRTClickLeftHoldIntercepted = true;

                        if (UIMouseOnValidAttackLocation(pSoldier)) {
                          // OK< going into confirm will call a function that will automatically move
                          // us to shoot in most vases ( grenades need a confirm mode regardless )
                          puiNewEvent.value = Enum207.A_CHANGE_TO_CONFIM_ACTION;
                          //*puiNewEvent = CA_MERC_SHOOT;
                          PauseRT(false);
                        }
                      }
                    }
                  }
                }
                break;

              case Enum206.MOVE_MODE:

                gfUICanBeginAllMoveCycle = true;

                if (!HandleCheckForExitArrowsInput(false) && gpItemPointer == null) {
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
                      gfRTClickLeftHoldIntercepted = true;
                    } else if (bReturnCode == 0) {
                      {
                        {
                          let fResult: boolean;

                          if (gusSelectedSoldier != NOBODY) {
                            if ((fResult = UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) == 1) {
                              if (gsCurrentActionPoints != 0) {
                                // We're on terrain in which we can walk, walk
                                // If we're on terrain,
                                if (!gGameSettings.fOptions[Enum8.TOPTION_RTCONFIRM]) {
                                  puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                                  gfPlotNewMovement = true;
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
                  gfRTClickLeftHoldIntercepted = true;
                  fIgnoreLeftUp = true;
                }

                break;
            }
          }
        }
        if (gfUIWaitingForUserSpeechAdvance) {
          fCanCheckForSpeechAdvance = true;
        }
      }

      if (gpItemPointer == null) {
        if (giUIMessageOverlay == -1 && !gfRTHaveClickedRightWhileLeftDown) {
          // HERE FOR CLICK-DRAG CLICK
          switch (gCurrentUIMode) {
            case Enum206.MOVE_MODE:
            case Enum206.CONFIRM_MOVE_MODE:

              // First check if we clicked on a guy, if so, make selected if it's ours
              if (FindSoldierFromMouse(addressof(usSoldierIndex), addressof(uiMercFlags))) {
                // Select guy
                if ((uiMercFlags & SELECTED_MERC) && !(uiMercFlags & UNCONSCIOUS_MERC) && !(MercPtrs[usSoldierIndex].value.uiStatusFlags & SOLDIER_VEHICLE)) {
                  puiNewEvent.value = Enum207.M_CHANGE_TO_ADJPOS_MODE;
                }
              } else {
                // if ( COUNTERDONE( RUBBER_BAND_START_DELAY )  )
                {
                  // OK, change to rubber banding mode..
                  // Have we started this yet?
                  if (!gfStartLookingForRubberBanding && !gRubberBandActive) {
                    gfStartLookingForRubberBanding = true;
                    gusRubberBandX = gusMouseXPos;
                    gusRubberBandY = gusMouseYPos;
                  } else {
                    // Have we moved....?
                    if (Math.abs(gusMouseXPos - gusRubberBandX) > 10 || Math.abs(gusMouseYPos - gusRubberBandY) > 10) {
                      gfStartLookingForRubberBanding = false;

                      // Stop scrolling:
                      gfIgnoreScrolling = true;

                      // Anchor cursor....
                      RestrictMouseToXYXY(0, 0, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);

                      // OK, settup anchor....
                      gRubberBandRect.iLeft = gusRubberBandX;
                      gRubberBandRect.iTop = gusRubberBandY;

                      gRubberBandActive = true;

                      // ATE: If we have stopped scrolling.....
                      if (gfScrollInertia != false) {
                        SetRenderFlags(RENDER_FLAG_FULL | RENDER_FLAG_CHECKZ);

                        // Restore Interface!
                        RestoreInterface();

                        // Delete Topmost blitters saved areas
                        DeleteVideoOverlaysArea();

                        gfScrollInertia = false;
                      }

                      puiNewEvent.value = Enum207.RB_ON_TERRAIN;
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
              if (gpItemPointer == null) {
                fDoubleClickIntercepted = true;

                // First check if we clicked on a guy, if so, make selected if it's ours
                if (gusSelectedSoldier != NO_SOLDIER) {
                  // Set movement mode
                  // OK, only change this if we are stationary!
                  // if ( gAnimControl[ MercPtrs[ gusSelectedSoldier ]->usAnimState ].uiFlags & ANIM_STATIONARY )
                  // if ( MercPtrs[ gusSelectedSoldier ]->usAnimState == WALKING )
                  {
                    MercPtrs[gusSelectedSoldier].value.fUIMovementFast = true;
                    puiNewEvent.value = Enum207.C_MOVE_MERC;
                  }
                }
              }
            }
          }

          // Capture time!
          uiSingleClickTime = GetJA2Clock();

          fValidDoubleClickPossible = false;

          if (!fDoubleClickIntercepted) {
            // FIRST CHECK FOR ANYTIME ( NON-INTERVAL ) CLICKS
            switch (gCurrentUIMode) {
              case Enum206.ADJUST_STANCE_MODE:

                // If button has come up, change to mocve mode
                puiNewEvent.value = Enum207.PADJ_ADJUST_STANCE;
                break;
            }

            // CHECK IF WE CLICKED-HELD
            if (COUNTERDONE(Enum386.LMOUSECLICK_DELAY_COUNTER) && gpItemPointer != null) {
              // LEFT CLICK-HOLD EVENT
              // Switch on UI mode
              switch (gCurrentUIMode) {
                case Enum206.CONFIRM_ACTION_MODE:
                case Enum206.ACTION_MODE:

                  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                    if (pSoldier.value.bDoBurst) {
                      pSoldier.value.sEndGridNo = usMapPos;

                      gfBeginBurstSpreadTracking = false;

                      if (pSoldier.value.sEndGridNo != pSoldier.value.sStartGridNo) {
                        pSoldier.value.fDoSpread = true;

                        PickBurstLocations(pSoldier);

                        puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                      } else {
                        pSoldier.value.fDoSpread = false;
                      }
                      gfRTClickLeftHoldIntercepted = true;
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
                  if (!HandleCheckForExitArrowsInput(true)) {
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
                            if (FindSoldierFromMouse(addressof(usSoldierIndex), addressof(uiMercFlags))) {
                              // Select guy
                              if (uiMercFlags & OWNED_MERC) {
                                puiNewEvent.value = Enum207.I_SELECT_MERC;
                              }
                            }
                            break;

                          case Enum206.HANDCURSOR_MODE:

                            HandleHandCursorClick(usMapPos, puiNewEvent);
                            break;

                          case Enum206.ACTION_MODE:

                            //*puiNewEvent = A_CHANGE_TO_CONFIM_ACTION;
                            // if(	GetSoldier( &pSoldier, gusSelectedSoldier ) )
                            //{
                            //	pSoldier->sStartGridNo = usMapPos;
                            //	ResetBurstLocations( );
                            //}
                            puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                            break;

                          case Enum206.CONFIRM_MOVE_MODE:

                            if (gusSelectedSoldier != NO_SOLDIER) {
                              if (MercPtrs[gusSelectedSoldier].value.usAnimState != Enum193.RUNNING) {
                                puiNewEvent.value = Enum207.C_MOVE_MERC;
                              } else {
                                MercPtrs[gusSelectedSoldier].value.fUIMovementFast = 2;
                                puiNewEvent.value = Enum207.C_MOVE_MERC;
                              }
                            }

                            //*puiNewEvent = C_MOVE_MERC;

                            // if ( gGameSettings.fOptions[ TOPTION_RTCONFIRM ] )
                            { fValidDoubleClickPossible = true; }
                            break;

                          case Enum206.CONFIRM_ACTION_MODE:

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
                            puiNewEvent.value = Enum207.CA_MERC_SHOOT;
                            //	}
                            //}
                            break;

                          case Enum206.MOVE_MODE:

                            if (!HandleCheckForExitArrowsInput(false) && gpItemPointer == null) {
                              // First check if we clicked on a guy, if so, make selected if it's ours
                              if (gfUIFullTargetFound && (guiUIFullTargetFlags & OWNED_MERC)) {
                                if (!(guiUIFullTargetFlags & UNCONSCIOUS_MERC)) {
                                  // Select guy
                                  if (GetSoldier(addressof(pSoldier), gusUIFullTargetID) && gpItemPointer == null) {
                                    if (pSoldier.value.bAssignment >= Enum117.ON_DUTY && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
                                      PopupAssignmentMenuInTactical(pSoldier);
                                    } else {
                                      if (!_KeyDown(ALT)) {
                                        ResetMultiSelection();
                                        puiNewEvent.value = Enum207.I_SELECT_MERC;
                                      } else {
                                        if (pSoldier.value.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
                                          pSoldier.value.uiStatusFlags &= (~SOLDIER_MULTI_SELECTED);
                                        } else {
                                          pSoldier.value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                          // Say Confimation...
                                          if (!gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS])
                                            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_ATTN1);

                                          // OK, if we have a selected guy.. make him part too....
                                          if (gusSelectedSoldier != NOBODY) {
                                            MercPtrs[gusSelectedSoldier].value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                          }
                                        }

                                        gfIgnoreOnSelectedGuy = true;

                                        EndMultiSoldierSelection(false);
                                      }
                                    }
                                  } else {
                                    if (!_KeyDown(ALT)) {
                                      ResetMultiSelection();
                                      puiNewEvent.value = Enum207.I_SELECT_MERC;
                                    } else {
                                      if (pSoldier.value.uiStatusFlags & SOLDIER_MULTI_SELECTED) {
                                        pSoldier.value.uiStatusFlags &= (~SOLDIER_MULTI_SELECTED);
                                      } else {
                                        pSoldier.value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                        // Say Confimation...
                                        if (!gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS])
                                          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_ATTN1);
                                      }

                                      // OK, if we have a selected guy.. make him part too....
                                      if (gusSelectedSoldier != NOBODY) {
                                        MercPtrs[gusSelectedSoldier].value.uiStatusFlags |= (SOLDIER_MULTI_SELECTED);
                                      }

                                      gfIgnoreOnSelectedGuy = true;

                                      EndMultiSoldierSelection(false);
                                    }
                                  }
                                }
                                gfRTClickLeftHoldIntercepted = true;
                              } else {
                                let bReturnCode: INT8;

                                bReturnCode = HandleMoveModeInteractiveClick(usMapPos, puiNewEvent);

                                if (bReturnCode == -1) {
                                  gfRTClickLeftHoldIntercepted = true;
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
                                      BeginDisplayTimedCursor(GetInteractiveTileCursor(guiCurrentUICursor, true), 300);

                                      if (pSoldier.value.usAnimState != Enum193.RUNNING) {
                                        puiNewEvent.value = Enum207.C_MOVE_MERC;
                                      } else {
                                        if (GetCurInteractiveTileGridNo(addressof(sIntTileGridNo)) != null) {
                                          pSoldier.value.fUIMovementFast = true;
                                          puiNewEvent.value = Enum207.C_MOVE_MERC;
                                        }
                                      }
                                      fValidDoubleClickPossible = true;
                                    }
                                  }
                                } else if (bReturnCode == 0) {
                                  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                                    // First check if we clicked on a guy, if so, make selected if it's ours
                                    if (FindSoldierFromMouse(addressof(usSoldierIndex), addressof(uiMercFlags)) && (uiMercFlags & OWNED_MERC)) {
                                      // Select guy
                                      puiNewEvent.value = Enum207.I_SELECT_MERC;
                                      gfRTClickLeftHoldIntercepted = true;
                                    } else {
                                      // if ( FindBestPath( pSoldier, usMapPos, pSoldier->bLevel, pSoldier->usUIMovementMode, NO_COPYROUTE, 0 ) == 0 )
                                      if (gsCurrentActionPoints == 0 && !gfUIAllMoveOn && !gTacticalStatus.fAtLeastOneGuyOnMultiSelect) {
                                        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_PATH]);
                                        gfRTClickLeftHoldIntercepted = true;
                                      } else {
                                        let fResult: boolean;

                                        if (gusSelectedSoldier != NOBODY) {
                                          if ((fResult = UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) == 1) {
                                            if (gfUIAllMoveOn) {
                                              // ATE: Select everybody in squad and make move!
                                              {
                                                // Make move!
                                                puiNewEvent.value = Enum207.C_MOVE_MERC;

                                                fValidDoubleClickPossible = true;
                                              }
                                            } else {
                                              // We're on terrain in which we can walk, walk
                                              // If we're on terrain,
                                              if (gGameSettings.fOptions[Enum8.TOPTION_RTCONFIRM]) {
                                                puiNewEvent.value = Enum207.C_WAIT_FOR_CONFIRM;
                                                gfPlotNewMovement = true;
                                              } else {
                                                puiNewEvent.value = Enum207.C_MOVE_MERC;
                                                fValidDoubleClickPossible = true;
                                              }
                                            }
                                          } else {
                                            if (fResult == 2) {
                                              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NOBODY_USING_REMOTE_STR]);
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

                                            gfRTClickLeftHoldIntercepted = true;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              // gfRTClickLeftHoldIntercepted = TRUE;
                            } else {
                              gfRTClickLeftHoldIntercepted = true;
                            }

                            break;

                          case Enum206.LOOKCURSOR_MODE:
                            // If we cannot actually do anything, return to movement mode
                            puiNewEvent.value = Enum207.LC_LOOK;
                            break;

                          case Enum206.JUMPOVER_MODE:

                            puiNewEvent.value = Enum207.JP_JUMP;
                            break;

                          case Enum206.TALKCURSOR_MODE:

                            PauseRT(false);

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

                            RemoveSectorExitMenu(false);
                            break;

                          case Enum206.OPENDOOR_MENU_MODE:

                            CancelOpenDoorMenu();
                            HandleOpenDoorMenu();
                            puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                            break;

                          case Enum206.RUBBERBAND_MODE:

                            EndRubberBanding();
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
        }

        // Reset flag
        fLeftButtonDown = false;
        fIgnoreLeftUp = false;
        gfRTClickLeftHoldIntercepted = false;
        fDoubleClickIntercepted = false;
        fCanCheckForSpeechAdvance = false;
        gfStartLookingForRubberBanding = false;

        // Reset counter
        RESETCOUNTER(Enum386.LMOUSECLICK_DELAY_COUNTER);
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
        pSoldier.value.fDoSpread = false;
      }
      gfBeginBurstSpreadTracking = false;
    }
  }
}

function QueryRTRightButton(puiNewEvent: Pointer<UINT32>): void {
  /* static */ let fClickHoldIntercepted: boolean = false;
  /* static */ let fClickIntercepted: boolean = false;
  /* static */ let uiSingleClickTime: UINT32;
  /* static */ let fDoubleClickIntercepted: boolean = false;
  /* static */ let fValidDoubleClickPossible: boolean = false;

  let pSoldier: Pointer<SOLDIERTYPE>;
  let usMapPos: UINT16;

  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    if (!GetMouseMapPos(addressof(usMapPos))) {
      return;
    }

    // RIGHT MOUSE BUTTON
    if (gViewportRegion.ButtonState & MSYS_RIGHT_BUTTON) {
      if (!fRightButtonDown) {
        fRightButtonDown = true;
        RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
      }

      // CHECK COMBINATIONS
      if (fLeftButtonDown) {
        // fIgnoreLeftUp = TRUE;
        gfRTHaveClickedRightWhileLeftDown = true;

        if (gpItemPointer == null) {
          // ATE:
          if (gusSelectedSoldier != NOBODY) {
            switch (gCurrentUIMode) {
              case Enum206.CONFIRM_MOVE_MODE:
              case Enum206.MOVE_MODE:

                if (!gfUIAllMoveOn) {
                  fValidDoubleClickPossible = true;

                  // OK, our first right-click is an all-cycle
                  if (gfUICanBeginAllMoveCycle) {
                    // ATE: Here, check if we can do this....
                    if (!UIOKMoveDestination(MercPtrs[gusSelectedSoldier], usMapPos)) {
                      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.CANT_MOVE_THERE_STR]);
                      gfRTClickLeftHoldIntercepted = true;
                    }
                    // else if ( gsCurrentActionPoints == 0 )
                    //{
                    //	ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[ NO_PATH ] );
                    //	gfRTClickLeftHoldIntercepted = TRUE;
                    //}
                    else {
                      puiNewEvent.value = Enum207.M_CYCLE_MOVE_ALL;
                    }
                  }
                  fClickHoldIntercepted = true;
                }
            }

            // ATE: Added cancel of burst mode....
            if (gfBeginBurstSpreadTracking) {
              gfBeginBurstSpreadTracking = false;
              gfRTClickLeftHoldIntercepted = true;
              MercPtrs[gusSelectedSoldier].value.fDoSpread = false;
              fClickHoldIntercepted = true;
              puiNewEvent.value = Enum207.A_END_ACTION;
              gCurrentUIMode = Enum206.MOVE_MODE;
            }
          }
        }
      } else {
        // IF HERE, DO A CLICK-HOLD IF IN INTERVAL
        if (COUNTERDONE(Enum386.RMOUSECLICK_DELAY_COUNTER) && !fClickHoldIntercepted) {
          if (gpItemPointer == null) {
            // Switch on UI mode
            switch (gCurrentUIMode) {
              case Enum206.IDLE_MODE:
              case Enum206.ACTION_MODE:
              case Enum206.HANDCURSOR_MODE:
              case Enum206.LOOKCURSOR_MODE:
              case Enum206.TALKCURSOR_MODE:
              case Enum206.MOVE_MODE:

                if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                  if ((guiUIFullTargetFlags & OWNED_MERC) && (guiUIFullTargetFlags & VISIBLE_MERC) && !(guiUIFullTargetFlags & DEAD_MERC) && !(pSoldier ? pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE : 0)) {
                    // if( pSoldier->bAssignment >= ON_DUTY )
                    {
                      PopupAssignmentMenuInTactical(pSoldier);
                      fClickHoldIntercepted = true;
                    }
                    break;
                  } else {
                    fShowAssignmentMenu = false;
                    CreateDestroyAssignmentPopUpBoxes();
                    DetermineWhichAssignmentMenusCanBeShown();
                  }

                  // ATE:
                  if (!fClickHoldIntercepted) {
                    puiNewEvent.value = Enum207.U_MOVEMENT_MENU;
                    fClickHoldIntercepted = true;
                  }
                  break;
                }
            }

            if (gCurrentUIMode == Enum206.ACTION_MODE || gCurrentUIMode == Enum206.TALKCURSOR_MODE) {
              PauseRT(false);
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
            fDoubleClickIntercepted = true;

            // Do stuff....
            // OK, check if left button down...
            if (fLeftButtonDown) {
              if (gpItemPointer == null) {
                if (!fClickIntercepted && !fClickHoldIntercepted) {
                  // ATE:
                  if (gusSelectedSoldier != NOBODY) {
                    // fIgnoreLeftUp = TRUE;
                    switch (gCurrentUIMode) {
                      case Enum206.CONFIRM_MOVE_MODE:
                      case Enum206.MOVE_MODE:

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

        fValidDoubleClickPossible = true;

        if (!fDoubleClickIntercepted) {
          // CHECK COMBINATIONS
          if (fLeftButtonDown) {
            if (gpItemPointer == null) {
              if (!fClickHoldIntercepted && !fClickIntercepted) {
                // ATE:
                if (gusSelectedSoldier != NOBODY) {
                  // fIgnoreLeftUp = TRUE;
                  switch (gCurrentUIMode) {
                    case Enum206.CONFIRM_MOVE_MODE:
                    case Enum206.MOVE_MODE:

                      if (gfUIAllMoveOn) {
                        gfUIAllMoveOn = false;
                        gfUICanBeginAllMoveCycle = true;
                      }
                  }
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

                    case Enum206.CONFIRM_MOVE_MODE:
                    case Enum206.MOVE_MODE:
                    case Enum206.TALKCURSOR_MODE:

                    {
                      // We have here a change to action mode
                      puiNewEvent.value = Enum207.M_CHANGE_TO_ACTION;
                    }
                      fClickIntercepted = true;
                      break;

                    case Enum206.ACTION_MODE:

                      // We have here a change to move mode
                      puiNewEvent.value = Enum207.A_END_ACTION;
                      fClickIntercepted = true;
                      break;

                    case Enum206.CONFIRM_ACTION_MODE:

                      if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
                        HandleRightClickAdjustCursor(pSoldier, usMapPos);
                      }
                      fClickIntercepted = true;
                      break;

                    case Enum206.MENU_MODE:

                      // If we get a hit here and we're in menu mode, quit the menu mode
                      EndMenuEvent(guiCurrentEvent);
                      fClickIntercepted = true;
                      break;

                    case Enum206.HANDCURSOR_MODE:
                      // If we cannot actually do anything, return to movement mode
                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
                      break;

                    case Enum206.LOOKCURSOR_MODE:

                      // If we cannot actually do anything, return to movement mode
                      puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
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
        fRightButtonDown = false;
        fClickHoldIntercepted = false;
        fClickIntercepted = false;
        fDoubleClickIntercepted = false;

        // Reset counter
        RESETCOUNTER(Enum386.RMOUSECLICK_DELAY_COUNTER);
      }
    }
  }
}

export function GetRTMousePositionInput(puiNewEvent: Pointer<UINT32>): void {
  let usMapPos: UINT16;
  /* static */ let usOldMapPos: UINT16 = 0;
  /* static */ let uiMoveTargetSoldierId: UINT32 = NO_SOLDIER;
  let pSoldier: Pointer<SOLDIERTYPE>;
  /* static */ let fOnValidGuy: boolean = false;

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
      case Enum206.RUBBERBAND_MODE:

        // ATE: Make sure!
        if (gRubberBandActive == false) {
          puiNewEvent.value = Enum207.M_ON_TERRAIN;
        } else {
          puiNewEvent.value = Enum207.RB_ON_TERRAIN;
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

      case Enum206.LOCKUI_MODE:
        puiNewEvent.value = Enum207.LU_ON_TERRAIN;
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

        if (HandleOpenDoorMenu()) {
          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
        break;

      case Enum206.HANDCURSOR_MODE:

        puiNewEvent.value = Enum207.HC_ON_TERRAIN;
        break;

      case Enum206.MOVE_MODE:

        if (usMapPos != usOldMapPos) {
          // Set off ALL move....
          gfUIAllMoveOn = false;
        }

        uiMoveTargetSoldierId = NO_SOLDIER;

        // Check for being on terrain
        if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
          let usItem: UINT16;
          let ubItemCursor: UINT8;

          // Alrighty, check what's in our hands = if a 'friendly thing', like med kit, look for our own guys
          usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

          // get cursor for item
          ubItemCursor = GetActionModeCursor(pSoldier);

          //
          if (IsValidJumpLocation(pSoldier, usMapPos, true)) {
            puiNewEvent.value = Enum207.JP_ON_TERRAIN;
            gsJumpOverGridNo = usMapPos;
            return;
          } else {
            if (gfUIFullTargetFound) {
              if (IsValidTalkableNPC(gusUIFullTargetID, false, false, false) && !_KeyDown(SHIFT) && !AM_AN_EPC(pSoldier) && MercPtrs[gusUIFullTargetID].value.bTeam != ENEMY_TEAM && !ValidQuickExchangePosition()) {
                uiMoveTargetSoldierId = gusUIFullTargetID;
                puiNewEvent.value = Enum207.T_CHANGE_TO_TALKING;
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
                  puiNewEvent.value = Enum207.A_ON_TERRAIN;
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

        fOnValidGuy = false;

        if (gfUIFullTargetFound)
        // if ( gfUIFullTargetFound )
        {
          if (IsValidTargetMerc(gusUIFullTargetID)) {
            guiUITargetSoldierId = gusUIFullTargetID;

            if (MercPtrs[gusUIFullTargetID].value.bTeam != gbPlayerNum) {
              fOnValidGuy = true;
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

      case Enum206.CONFIRM_MOVE_MODE:

        if (usMapPos != usOldMapPos) {
          // Switch event out of confirm mode
          // Set off ALL move....
          gfUIAllMoveOn = false;

          puiNewEvent.value = Enum207.A_CHANGE_TO_MOVE;
        }
        break;

      case Enum206.CONFIRM_ACTION_MODE:

        // DONOT CANCEL IF BURST
        if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
          if (pSoldier.value.bDoBurst) {
            pSoldier.value.sEndGridNo = usMapPos;

            if (pSoldier.value.sEndGridNo != pSoldier.value.sStartGridNo && fLeftButtonDown) {
              pSoldier.value.fDoSpread = true;
              gfBeginBurstSpreadTracking = true;
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
          if (ConfirmActionCancel(usMapPos, usOldMapPos)) {
            // Switch event out of confirm mode
            puiNewEvent.value = Enum207.CA_END_CONFIRM_ACTION;
          } else {
            puiNewEvent.value = Enum207.CA_ON_TERRAIN;
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
