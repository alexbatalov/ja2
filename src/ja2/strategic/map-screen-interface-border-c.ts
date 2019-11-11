namespace ja2 {

const MAP_BORDER_X = 261;
const MAP_BORDER_Y = 0;

const MAP_BORDER_CORNER_X = 584;
const MAP_BORDER_CORNER_Y = 279;

// mouse levels
let LevelMouseRegions: MOUSE_REGION[] /* [4] */ = createArrayFrom(4, createMouseRegion);

// graphics
let guiMapBorder: UINT32;
// UINT32 guiMapBorderCorner;

// scroll direction
let giScrollButtonState: INT32 = -1;

// flags
export let fShowTownFlag: boolean = false;
export let fShowMineFlag: boolean = false;
export let fShowTeamFlag: boolean = false;
export let fShowMilitia: boolean = false;
export let fShowAircraftFlag: boolean = false;
export let fShowItemsFlag: boolean = false;

export let fZoomFlag: boolean = false;
// BOOLEAN fShowVehicleFlag = FALSE;

// BOOLEAN fMapScrollDueToPanelButton = FALSE;
// BOOLEAN fCursorIsOnMapScrollButtons = FALSE;
// BOOLEAN fDisabledMapBorder = FALSE;

// buttons & button images
export let giMapBorderButtons: INT32[] /* [6] */ = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
];
let giMapBorderButtonsImage: INT32[] /* [6] */ = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
];

// UINT32 guiMapBorderScrollButtons[ 4 ] = { -1, -1, -1, -1 };
// UINT32 guiMapBorderScrollButtonsImage[ 4 ];

// raise/lower land buttons
// UINT32 guiMapBorderLandRaiseButtons[ 2 ] = { -1, -1 };
// UINT32 guiMapBorderLandRaiseButtonsImage[ 2 ];

// void MapScrollButtonMvtCheck( void );
// BOOLEAN ScrollButtonsDisplayingHelpMessage( void );
// void UpdateScrollButtonStatesWhileScrolling( void );

// void BtnZoomCallback(GUI_BUTTON *btn,INT32 reason);

/*
void BtnScrollNorthMapScreenCallback( GUI_BUTTON *btn,INT32 reason );
void BtnScrollSouthMapScreenCallback( GUI_BUTTON *btn,INT32 reason );
void BtnScrollWestMapScreenCallback( GUI_BUTTON *btn,INT32 reason );
void BtnScrollEastMapScreenCallback( GUI_BUTTON *btn,INT32 reason );
void BtnLowerLevelBtnCallback(GUI_BUTTON *btn,INT32 reason);
void BtnRaiseLevelBtnCallback(GUI_BUTTON *btn,INT32 reason);
*/

export function LoadMapBorderGraphics(): boolean {
  // this procedure will load the graphics needed for the map border
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // will load map border
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\MBS.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMapBorder))) {
    return false;
  }

  /* corner was removed along with the Zoom feature
          // will load map border corner
          VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
          FilenameForBPP( "INTERFACE\\map_screen_cutout.sti", VObjectDesc.ImageFile );
          CHECKF( AddVideoObject( &VObjectDesc, &guiMapBorderCorner ) );

          fCursorIsOnMapScrollButtons = FALSE;
  */

  return true;
}

export function DeleteMapBorderGraphics(): void {
  // procedure will delete graphics loaded for map border

  DeleteVideoObjectFromIndex(guiMapBorder);
  //	DeleteVideoObjectFromIndex( guiMapBorderCorner );

  return;
}

export function RenderMapBorder(): void {
  // renders the actual border to the guiSAVEBUFFER
  let hHandle: HVOBJECT;

  /*
          if( fDisabledMapBorder )
          {
                  return;
          }
  */

  if (fShowMapInventoryPool) {
    // render background, then leave
    BlitInventoryPoolGraphic();
    return;
  }

  // get and blt border
  GetVideoObject(addressof(hHandle), guiMapBorder);
  BltVideoObject(guiSAVEBUFFER, hHandle, 0, MAP_BORDER_X, MAP_BORDER_Y, VO_BLT_SRCTRANSPARENCY, null);

  // show the level marker
  DisplayCurrentLevelMarker();

  return;
}

/*
void RenderMapBorderCorner( void )
{
        // renders map border corner to the FRAME_BUFFER
        HVOBJECT hHandle;

        if( fDisabledMapBorder )
        {
                return;
        }

        if( fShowMapInventoryPool )
        {
                return;
        }


        // get and blt corner
        GetVideoObject(&hHandle, guiMapBorderCorner );
        BltVideoObject( FRAME_BUFFER , hHandle, 0,MAP_BORDER_CORNER_X, MAP_BORDER_CORNER_Y, VO_BLT_SRCTRANSPARENCY,NULL );

        InvalidateRegion( MAP_BORDER_CORNER_X, MAP_BORDER_CORNER_Y, 635, 315);

        return;
}
*/

export function RenderMapBorderEtaPopUp(): void {
  // renders map border corner to the FRAME_BUFFER
  let hHandle: HVOBJECT;

  /*
          if( fDisabledMapBorder )
          {
                  return;
          }
  */

  if (fShowMapInventoryPool) {
    return;
  }

  if (fPlotForHelicopter == true) {
    DisplayDistancesForHelicopter();
    return;
  }

  // get and blt ETA box
  GetVideoObject(addressof(hHandle), guiMapBorderEtaPopUp);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, MAP_BORDER_X + 215, 291, VO_BLT_SRCTRANSPARENCY, null);

  InvalidateRegion(MAP_BORDER_X + 215, 291, MAP_BORDER_X + 215 + 100, 310);

  return;
}

export function CreateButtonsForMapBorder(): boolean {
  // will create the buttons needed for the map screen border region

  /*
          // up button
          guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_UP ] = LoadButtonImage( "INTERFACE\\map_screen_bottom_arrows.sti" ,11,4,-1,6,-1 );
    guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_UP ] = QuickCreateButton( guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_UP ], 602, 303,
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
                                                                                  (GUI_CALLBACK)BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnScrollNorthMapScreenCallback);

          // dwn button
          guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_DWN ] = LoadButtonImage( "INTERFACE\\map_screen_bottom_arrows.sti" ,12,5,-1,7,-1 );
    guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_DWN ] = QuickCreateButton( guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_DWN ], 602, 338,
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
                                                                                  (GUI_CALLBACK)BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnScrollSouthMapScreenCallback);

          // left button
          guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_LEFT ] = LoadButtonImage( "INTERFACE\\map_screen_bottom_arrows.sti" ,9,0,-1,2,-1 );
    guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_LEFT ] = QuickCreateButton( guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_LEFT ], 584, 322,
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
                                                                                  (GUI_CALLBACK)BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnScrollWestMapScreenCallback);

          // right button
          guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_RIGHT ] = LoadButtonImage( "INTERFACE\\map_screen_bottom_arrows.sti" ,10,1,-1,3,-1 );
    guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_RIGHT ] = QuickCreateButton( guiMapBorderScrollButtonsImage[ ZOOM_MAP_SCROLL_RIGHT ], 619, 322,
                                                                                  BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
                                                                                  (GUI_CALLBACK)BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnScrollEastMapScreenCallback);

          // set up fast help text
          SetButtonFastHelpText( guiMapBorderScrollButtons[ 0 ], pMapScreenBorderButtonHelpText[ 6 ] );
          SetButtonFastHelpText( guiMapBorderScrollButtons[ 1 ], pMapScreenBorderButtonHelpText[ 7 ] );
          SetButtonFastHelpText( guiMapBorderScrollButtons[ 2 ], pMapScreenBorderButtonHelpText[ 8 ] );
          SetButtonFastHelpText( guiMapBorderScrollButtons[ 3 ], pMapScreenBorderButtonHelpText[ 9 ] );
  */

  // towns
  giMapBorderButtonsImage[Enum141.MAP_BORDER_TOWN_BTN] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 5, -1, 14, -1);
  giMapBorderButtons[Enum141.MAP_BORDER_TOWN_BTN] = QuickCreateButton(giMapBorderButtonsImage[Enum141.MAP_BORDER_TOWN_BTN], 299, 323, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, MSYS_NO_CALLBACK, BtnTownCallback);

  // mines
  giMapBorderButtonsImage[Enum141.MAP_BORDER_MINE_BTN] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 4, -1, 13, -1);
  giMapBorderButtons[Enum141.MAP_BORDER_MINE_BTN] = QuickCreateButton(giMapBorderButtonsImage[Enum141.MAP_BORDER_MINE_BTN], 342, 323, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, MSYS_NO_CALLBACK, BtnMineCallback);

  // people
  giMapBorderButtonsImage[Enum141.MAP_BORDER_TEAMS_BTN] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 3, -1, 12, -1);
  giMapBorderButtons[Enum141.MAP_BORDER_TEAMS_BTN] = QuickCreateButton(giMapBorderButtonsImage[Enum141.MAP_BORDER_TEAMS_BTN], 385, 323, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, MSYS_NO_CALLBACK, BtnTeamCallback);

  // militia
  giMapBorderButtonsImage[Enum141.MAP_BORDER_MILITIA_BTN] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 8, -1, 17, -1);
  giMapBorderButtons[Enum141.MAP_BORDER_MILITIA_BTN] = QuickCreateButton(giMapBorderButtonsImage[Enum141.MAP_BORDER_MILITIA_BTN], 428, 323, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, MSYS_NO_CALLBACK, BtnMilitiaCallback);

  // airspace
  giMapBorderButtonsImage[Enum141.MAP_BORDER_AIRSPACE_BTN] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 2, -1, 11, -1);
  giMapBorderButtons[Enum141.MAP_BORDER_AIRSPACE_BTN] = QuickCreateButton(giMapBorderButtonsImage[Enum141.MAP_BORDER_AIRSPACE_BTN], 471, 323, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, MSYS_NO_CALLBACK, BtnAircraftCallback);

  // items
  giMapBorderButtonsImage[Enum141.MAP_BORDER_ITEM_BTN] = LoadButtonImage("INTERFACE\\map_border_buttons.sti", -1, 1, -1, 10, -1);
  giMapBorderButtons[Enum141.MAP_BORDER_ITEM_BTN] = QuickCreateButton(giMapBorderButtonsImage[Enum141.MAP_BORDER_ITEM_BTN], 514, 323, BUTTON_NO_TOGGLE, MSYS_PRIORITY_HIGH, MSYS_NO_CALLBACK, BtnItemCallback);

  // raise and lower view level

  // raise
  /*
  guiMapBorderLandRaiseButtonsImage[ MAP_BORDER_RAISE_LEVEL ] = LoadButtonImage( "INTERFACE\\map_screen_bottom_arrows.sti" ,11,4,-1,6,-1 );
  guiMapBorderLandRaiseButtons[ MAP_BORDER_RAISE_LEVEL ] = QuickCreateButton( guiMapBorderLandRaiseButtonsImage[ MAP_BORDER_RAISE_LEVEL ], MAP_BORDER_X + 264, 322,
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
                                                                          (GUI_CALLBACK)MSYS_NO_CALLBACK, (GUI_CALLBACK)BtnRaiseLevelBtnCallback);

  // lower
  guiMapBorderLandRaiseButtonsImage[ MAP_BORDER_LOWER_LEVEL ] = LoadButtonImage( "INTERFACE\\map_screen_bottom_arrows.sti" ,12,5,-1,7,-1  );
  guiMapBorderLandRaiseButtons[ MAP_BORDER_LOWER_LEVEL ] = QuickCreateButton( guiMapBorderLandRaiseButtonsImage[ MAP_BORDER_LOWER_LEVEL ], MAP_BORDER_X + 264, 340,
                                                                          BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
                                                                          (GUI_CALLBACK)MSYS_NO_CALLBACK, (GUI_CALLBACK)BtnLowerLevelBtnCallback);

*/
  // set up fast help text
  SetButtonFastHelpText(giMapBorderButtons[0], pMapScreenBorderButtonHelpText[0]);
  SetButtonFastHelpText(giMapBorderButtons[1], pMapScreenBorderButtonHelpText[1]);
  SetButtonFastHelpText(giMapBorderButtons[2], pMapScreenBorderButtonHelpText[2]);
  SetButtonFastHelpText(giMapBorderButtons[3], pMapScreenBorderButtonHelpText[3]);
  SetButtonFastHelpText(giMapBorderButtons[4], pMapScreenBorderButtonHelpText[4]);
  SetButtonFastHelpText(giMapBorderButtons[5], pMapScreenBorderButtonHelpText[5]);

  // SetButtonFastHelpText( guiMapBorderLandRaiseButtons[ 0 ], pMapScreenBorderButtonHelpText[ 10 ] );
  // SetButtonFastHelpText( guiMapBorderLandRaiseButtons[ 1 ], pMapScreenBorderButtonHelpText[ 11 ] );

  SetButtonCursor(giMapBorderButtons[0], MSYS_NO_CURSOR);
  SetButtonCursor(giMapBorderButtons[1], MSYS_NO_CURSOR);
  SetButtonCursor(giMapBorderButtons[2], MSYS_NO_CURSOR);
  SetButtonCursor(giMapBorderButtons[3], MSYS_NO_CURSOR);
  SetButtonCursor(giMapBorderButtons[4], MSYS_NO_CURSOR);
  SetButtonCursor(giMapBorderButtons[5], MSYS_NO_CURSOR);

  //	SetButtonCursor(guiMapBorderLandRaiseButtons[ 0 ], MSYS_NO_CURSOR );
  //	SetButtonCursor(guiMapBorderLandRaiseButtons[ 1 ], MSYS_NO_CURSOR );

  InitializeMapBorderButtonStates();

  return true;
}

export function DeleteMapBorderButtons(): void {
  let ubCnt: UINT8;

  /*
          RemoveButton( guiMapBorderScrollButtons[ 0 ]);
          RemoveButton( guiMapBorderScrollButtons[ 1 ]);
          RemoveButton( guiMapBorderScrollButtons[ 2 ]);
          RemoveButton( guiMapBorderScrollButtons[ 3 ]);
  */

  RemoveButton(giMapBorderButtons[0]);
  RemoveButton(giMapBorderButtons[1]);
  RemoveButton(giMapBorderButtons[2]);
  RemoveButton(giMapBorderButtons[3]);
  RemoveButton(giMapBorderButtons[4]);
  RemoveButton(giMapBorderButtons[5]);

  // RemoveButton( guiMapBorderLandRaiseButtons[ 0 ]);
  // RemoveButton( guiMapBorderLandRaiseButtons[ 1 ]);

  // images

  /*
          UnloadButtonImage( guiMapBorderScrollButtonsImage[ 0 ] );
          UnloadButtonImage( guiMapBorderScrollButtonsImage[ 1 ] );
          UnloadButtonImage( guiMapBorderScrollButtonsImage[ 2 ] );
          UnloadButtonImage( guiMapBorderScrollButtonsImage[ 3 ] );
  */

  UnloadButtonImage(giMapBorderButtonsImage[0]);
  UnloadButtonImage(giMapBorderButtonsImage[1]);
  UnloadButtonImage(giMapBorderButtonsImage[2]);
  UnloadButtonImage(giMapBorderButtonsImage[3]);
  UnloadButtonImage(giMapBorderButtonsImage[4]);
  UnloadButtonImage(giMapBorderButtonsImage[5]);

  // UnloadButtonImage( guiMapBorderLandRaiseButtonsImage[ 0 ] );
  // UnloadButtonImage( guiMapBorderLandRaiseButtonsImage[ 1 ] );

  for (ubCnt = 0; ubCnt < 6; ubCnt++) {
    giMapBorderButtons[ubCnt] = -1;
    giMapBorderButtonsImage[ubCnt] = -1;
  }
}

// callbacks

/*
void BtnLowerLevelBtnCallback(GUI_BUTTON *btn,INT32 reason)
{


        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                // are help messages being displayed?..redraw
                if( ScrollButtonsDisplayingHelpMessage( ) )
                {
                        fMapPanelDirty = TRUE;
                }

                MarkButtonsDirty( );

          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
  {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
      btn->uiFlags&=~(BUTTON_CLICKED_ON);

                  // go down one level
                  GoDownOneLevelInMap( );
                }
        }
}


void BtnRaiseLevelBtnCallback(GUI_BUTTON *btn,INT32 reason)
{
        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                // are help messages being displayed?..redraw
                if( ScrollButtonsDisplayingHelpMessage( ) )
                {
                        fMapPanelDirty = TRUE;
                }


                MarkButtonsDirty( );

          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
  {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
      btn->uiFlags&=~(BUTTON_CLICKED_ON);
                        // go up one level
                  GoUpOneLevelInMap( );
                }
        }
}
*/

function BtnMilitiaCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
    ToggleShowMilitiaMode();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
  }
}

function BtnTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
    ToggleShowTeamsMode();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
  }
}

function BtnTownCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
    ToggleShowTownsMode();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
  }
}

function BtnMineCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
    ToggleShowMinesMode();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
  }
}

function BtnAircraftCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();

    ToggleAirspaceMode();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
  }
}

function BtnItemCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();

    ToggleItemsFilter();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    CommonBtnCallbackBtnDownChecks();
  }
}

/*
void BtnZoomCallback(GUI_BUTTON *btn,INT32 reason)
{
        UINT16 sTempXOff=0;
        UINT16 sTempYOff=0;


        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                CommonBtnCallbackBtnDownChecks();

                if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
      btn->uiFlags&=~(BUTTON_CLICKED_ON);
      fZoomFlag=FALSE;
                }
                else
                {
                 btn->uiFlags|=(BUTTON_CLICKED_ON);
                 fZoomFlag=TRUE;
                 if( sSelMapX > 14 )
                 {
                         iZoomX = ( ( sSelMapX + 2 ) / 2 ) * ( MAP_GRID_X * 2 );
                 }
                 else
                 {
                         iZoomX=sSelMapX/2*MAP_GRID_X*2;
                 }

                 if( sOldSelMapY > 14 )
                 {
                         iZoomY = ( ( sSelMapY + 2 ) / 2 ) * ( MAP_GRID_Y * 2 );
                 }
                 else
                 {
                         iZoomY=sSelMapY/2*MAP_GRID_Y*2;
                 }

                }

                fMapPanelDirty=TRUE;
        }
        else if(reason & MSYS_CALLBACK_REASON_RBUTTON_DWN )
        {
                CommonBtnCallbackBtnDownChecks();
        }
}
*/

export function ToggleShowTownsMode(): void {
  if (fShowTownFlag == true) {
    fShowTownFlag = false;
    MapBorderButtonOff(Enum141.MAP_BORDER_TOWN_BTN);
  } else {
    fShowTownFlag = true;
    MapBorderButtonOn(Enum141.MAP_BORDER_TOWN_BTN);

    if (fShowMineFlag == true) {
      fShowMineFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_MINE_BTN);
    }

    if (fShowAircraftFlag == true) {
      fShowAircraftFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_AIRSPACE_BTN);
    }

    if (fShowItemsFlag == true) {
      fShowItemsFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);
    }
  }

  fMapPanelDirty = true;
}

export function ToggleShowMinesMode(): void {
  if (fShowMineFlag == true) {
    fShowMineFlag = false;
    MapBorderButtonOff(Enum141.MAP_BORDER_MINE_BTN);
  } else {
    fShowMineFlag = true;
    MapBorderButtonOn(Enum141.MAP_BORDER_MINE_BTN);

    if (fShowTownFlag == true) {
      fShowTownFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_TOWN_BTN);
    }

    if (fShowAircraftFlag == true) {
      fShowAircraftFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_AIRSPACE_BTN);
    }

    if (fShowItemsFlag == true) {
      fShowItemsFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);
    }
  }

  fMapPanelDirty = true;
}

export function ToggleShowMilitiaMode(): void {
  if (fShowMilitia == true) {
    fShowMilitia = false;
    MapBorderButtonOff(Enum141.MAP_BORDER_MILITIA_BTN);
  } else {
    // toggle militia ON
    fShowMilitia = true;
    MapBorderButtonOn(Enum141.MAP_BORDER_MILITIA_BTN);

    // if Team is ON, turn it OFF
    if (fShowTeamFlag == true) {
      fShowTeamFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_TEAMS_BTN);
    }

    /*
                    // if Airspace is ON, turn it OFF
                    if( fShowAircraftFlag == TRUE )
                    {
                            fShowAircraftFlag = FALSE;
                            MapBorderButtonOff( MAP_BORDER_AIRSPACE_BTN );
                    }
    */

    if (fShowItemsFlag == true) {
      fShowItemsFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);
    }

    // check if player has any militia
    if (DoesPlayerHaveAnyMilitia() == false) {
      let pwString: string /* STR16 */ = null;

      // no - so put up a message explaining how it works

      // if he's already training some
      if (IsAnyOneOnPlayersTeamOnThisAssignment(Enum117.TRAIN_TOWN)) {
        // say they'll show up when training is completed
        pwString = pMapErrorString[28];
      } else {
        // say you need to train them first
        pwString = zMarksMapScreenText[1];
      }

      MapScreenMessage(FONT_MCOLOR_LTYELLOW, MSG_MAP_UI_POSITION_MIDDLE, pwString);
    }
  }

  fMapPanelDirty = true;
}

export function ToggleShowTeamsMode(): void {
  if (fShowTeamFlag == true) {
    // turn show teams OFF
    fShowTeamFlag = false;
    MapBorderButtonOff(Enum141.MAP_BORDER_TEAMS_BTN);

    // dirty regions
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  } else {
    // turn show teams ON
    TurnOnShowTeamsMode();
  }
}

export function ToggleAirspaceMode(): void {
  if (fShowAircraftFlag == true) {
    // turn airspace OFF
    fShowAircraftFlag = false;
    MapBorderButtonOff(Enum141.MAP_BORDER_AIRSPACE_BTN);

    if (fPlotForHelicopter == true) {
      AbortMovementPlottingMode();
    }

    // dirty regions
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  } else {
    // turn airspace ON
    TurnOnAirSpaceMode();
  }
}

export function ToggleItemsFilter(): void {
  if (fShowItemsFlag == true) {
    // turn items OFF
    fShowItemsFlag = false;
    MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);

    // dirty regions
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  } else {
    // turn items ON
    TurnOnItemFilterMode();
  }
}

/*
void ShowDestinationOfPlottedPath( STR16 pLoc )
{
        INT16 sFontX, sFontY;

        SetFontDestBuffer( FRAME_BUFFER, 0, 0, 640, 480, FALSE );

        SetFont( COMPFONT );
        SetFontForeground( 183 );
        SetFontBackground( FONT_BLACK );

        VarFindFontCenterCoordinates( 461, 344,  70, 12,  COMPFONT, &sFontX, &sFontY, pLoc );
        gprintfdirty(sFontX, sFontY, pLoc );
        mprintf(sFontX, sFontY, pLoc  );

        return;
}
*/

/*
void BtnScrollNorthMapScreenCallback( GUI_BUTTON *btn,INT32 reason )
{
        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {

                // not zoomed in?...don't push down
          if( fZoomFlag == FALSE )
                {
                        return;
                }

                // are help messages being displayed?..redraw
                if( ScrollButtonsDisplayingHelpMessage( ) )
                {
                        fMapPanelDirty = TRUE;
                }

          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
  {
   if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
     btn->uiFlags&=~(BUTTON_CLICKED_ON);
                 giScrollButtonState = NORTH_DIR;
                 fMapScrollDueToPanelButton = TRUE;
          }
        }
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT )
        {
                giScrollButtonState = NORTH_DIR;
          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
}

void BtnScrollSouthMapScreenCallback( GUI_BUTTON *btn,INT32 reason )
{

        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {

                // not zoomed in?...don't push down
          if( fZoomFlag == FALSE )
                {
                        return;
                }

                // are help messages being displayed?..redraw
                 if( ScrollButtonsDisplayingHelpMessage( ) )
                 {
                         fMapPanelDirty = TRUE;
                 }

          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
  {
   if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
      btn->uiFlags&=~(BUTTON_CLICKED_ON);
                  giScrollButtonState = SOUTH_DIR;
                  fMapScrollDueToPanelButton = TRUE;

          }
        }
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT )
        {
                 giScrollButtonState = SOUTH_DIR;
           btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
}

void BtnScrollEastMapScreenCallback( GUI_BUTTON *btn,INT32 reason )
{

        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
          // not zoomed in?...don't push down
          if( fZoomFlag == FALSE )
                {
                        return;
                }

                // are help messages being displayed?..redraw
                if( ScrollButtonsDisplayingHelpMessage( ) )
                {
                        fMapPanelDirty = TRUE;
                }

          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
  {
   if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
      btn->uiFlags&=~(BUTTON_CLICKED_ON);
                  giScrollButtonState = EAST_DIR;
                  fMapScrollDueToPanelButton = TRUE;

          }
        }
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT )
        {
                 giScrollButtonState = EAST_DIR;
           btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
}

void BtnScrollWestMapScreenCallback( GUI_BUTTON *btn,INT32 reason )
{

        if(reason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {

          // not zoomed in?...don't push down
          if( fZoomFlag == FALSE )
                {
                        return;
                }

                // are help messages being displayed?..redraw
                if( ScrollButtonsDisplayingHelpMessage( ) )
                {
                        fMapPanelDirty = TRUE;
                }

          btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
        else if(reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
  {
   if (btn->uiFlags & BUTTON_CLICKED_ON)
                {
      btn->uiFlags&=~(BUTTON_CLICKED_ON);
                  giScrollButtonState = WEST_DIR;
                  fMapScrollDueToPanelButton = TRUE;

          }
        }
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT )
        {
                 giScrollButtonState = WEST_DIR;
           btn->uiFlags|=(BUTTON_CLICKED_ON);
        }
}


void MapScrollButtonMvtCheck( void  )
{
        // run through each button's mouse region, if mouse cursor there...don't show map white sector highlight
        fCursorIsOnMapScrollButtons = FALSE;

        if( ButtonList[ guiMapBorderScrollButtons[ 0 ] ] ->Area.uiFlags & MSYS_MOUSE_IN_AREA )
        {
                fCursorIsOnMapScrollButtons = TRUE;
        }

        if( ButtonList[ guiMapBorderScrollButtons[ 1 ] ] ->Area.uiFlags & MSYS_MOUSE_IN_AREA )
        {
                fCursorIsOnMapScrollButtons = TRUE;
        }

        if( ButtonList[ guiMapBorderScrollButtons[ 2 ] ] ->Area.uiFlags & MSYS_MOUSE_IN_AREA )
        {
                fCursorIsOnMapScrollButtons = TRUE;
        }

        if( ButtonList[ guiMapBorderScrollButtons[ 3 ] ] ->Area.uiFlags & MSYS_MOUSE_IN_AREA )
        {
                fCursorIsOnMapScrollButtons = TRUE;
        }
}
*/

/*
void HandleMapScrollButtonStates( void )
{
        // will enable/disable map scroll buttons based on zoom mode

        if( fDisabledMapBorder || fShowMapInventoryPool )
        {
                return;
        }

        // if underground, don't want zoom in
        if( iCurrentMapSectorZ )
        {
                if( fZoomFlag == TRUE )
                {
                        fZoomFlag = FALSE;
                        fMapPanelDirty = TRUE;
                }

                MapBorderButtonOff( MAP_BORDER_ZOOM_BTN );
                DisableButton( giMapBorderButtons[ MAP_BORDER_ZOOM_BTN ]);
        }
        else
        {
                EnableButton( giMapBorderButtons[ MAP_BORDER_ZOOM_BTN ]);
        }

        if( fZoomFlag )
        {
                EnableButton( guiMapBorderScrollButtons[ 0 ]);
          EnableButton( guiMapBorderScrollButtons[ 1 ]);
          EnableButton( guiMapBorderScrollButtons[ 2 ]);
          EnableButton( guiMapBorderScrollButtons[ 3 ]);

                UpdateScrollButtonStatesWhileScrolling(  );

        }
        else
        {

                DisableButton( guiMapBorderScrollButtons[ 0 ]);
          DisableButton( guiMapBorderScrollButtons[ 1 ]);
          DisableButton( guiMapBorderScrollButtons[ 2 ]);
          DisableButton( guiMapBorderScrollButtons[ 3 ]);

        }

        // check mvt too
        MapScrollButtonMvtCheck( );


        return;
}
*/

// generic button mvt callback for mapscreen map border
function BtnGenericMouseMoveButtonCallbackForMapBorder(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // If the button isn't the anchored button, then we don't want to modify the button state.

  if (btn != gpAnchoredButton) {
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      if (btn.value.Area.uiFlags & MSYS_FASTHELP) {
        // redraw area
        fMapPanelDirty = true;
      }
    }
    return;
  }

  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    if (!gfAnchoredState)
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

/*
BOOLEAN ScrollButtonsDisplayingHelpMessage( void )
{
        // return if any help messages are being displayed for the scroll buttons

        if( ( ButtonList[ guiMapBorderScrollButtons[ 0 ] ]->Area.uiFlags & MSYS_HAS_BACKRECT )||
        ( ButtonList[ guiMapBorderScrollButtons[ 1 ] ]->Area.uiFlags & MSYS_HAS_BACKRECT )||
        ( ButtonList[ guiMapBorderScrollButtons[ 2 ] ]->Area.uiFlags & MSYS_HAS_BACKRECT )||
        ( ButtonList[ guiMapBorderScrollButtons[ 3 ] ]->Area.uiFlags & MSYS_HAS_BACKRECT ) )
        {
                return( TRUE );
        }

        return( FALSE );
}
*/

function DisplayCurrentLevelMarker(): void {
  // display the current level marker on the map border

  let hHandle: HVOBJECT;

  /*
          if( fDisabledMapBorder )
          {
                  return;
          }
  */

  // it's actually a white rectangle, not a green arrow!
  GetVideoObject(addressof(hHandle), guiLEVELMARKER);
  BltVideoObject(guiSAVEBUFFER, hHandle, 0, MAP_LEVEL_MARKER_X + 1, MAP_LEVEL_MARKER_Y + (MAP_LEVEL_MARKER_DELTA * iCurrentMapSectorZ), VO_BLT_SRCTRANSPARENCY, null);

  return;
}

export function CreateMouseRegionsForLevelMarkers(): void {
  let sCounter: INT16 = 0;
  let sString: string /* CHAR16[64] */;

  for (sCounter = 0; sCounter < 4; sCounter++) {
    MSYS_DefineRegion(LevelMouseRegions[sCounter], MAP_LEVEL_MARKER_X, (MAP_LEVEL_MARKER_Y + (MAP_LEVEL_MARKER_DELTA * sCounter)), MAP_LEVEL_MARKER_X + MAP_LEVEL_MARKER_WIDTH, (MAP_LEVEL_MARKER_Y + (MAP_LEVEL_MARKER_DELTA * (sCounter + 1))), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, LevelMarkerBtnCallback);

    MSYS_SetRegionUserData(LevelMouseRegions[sCounter], 0, sCounter);

    sString = swprintf("%s %d", zMarksMapScreenText[0], sCounter + 1);
    SetRegionFastHelpText(LevelMouseRegions[sCounter], sString);
  }
}

export function DeleteMouseRegionsForLevelMarkers(): void {
  let sCounter: INT16 = 0;

  for (sCounter = 0; sCounter < 4; sCounter++) {
    MSYS_RemoveRegion(LevelMouseRegions[sCounter]);
  }
}

function LevelMarkerBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  // btn callback handler for assignment screen mask region
  let iCounter: INT32 = 0;

  iCounter = MSYS_GetRegionUserData(pRegion, 0);

  if ((iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)) {
    JumpToLevel(iCounter);
  }
}

/*
void DisableMapBorderRegion( void )
{
        // will shutdown map border region

        if( fDisabledMapBorder )
        {
                // checked, failed
                return;
        }

        // get rid of graphics and mouse regions
        DeleteMapBorderGraphics( );


        fDisabledMapBorder = TRUE;
}

void EnableMapBorderRegion( void )
{
        // will re-enable mapborder region

        if( fDisabledMapBorder == FALSE )
        {
                // checked, failed
                return;
        }

        // re load graphics and buttons
        LoadMapBorderGraphics( );

        fDisabledMapBorder = FALSE;

}
*/

export function TurnOnShowTeamsMode(): void {
  // if mode already on, leave, else set and redraw

  if (fShowTeamFlag == false) {
    fShowTeamFlag = true;
    MapBorderButtonOn(Enum141.MAP_BORDER_TEAMS_BTN);

    if (fShowMilitia == true) {
      fShowMilitia = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_MILITIA_BTN);
    }

    /*
                    if( fShowAircraftFlag == TRUE )
                    {
                            fShowAircraftFlag = FALSE;
                            MapBorderButtonOff( MAP_BORDER_AIRSPACE_BTN );
                    }
    */

    if (fShowItemsFlag == true) {
      fShowItemsFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);
    }

    // dirty regions
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  }
}

export function TurnOnAirSpaceMode(): void {
  // if mode already on, leave, else set and redraw

  if (fShowAircraftFlag == false) {
    fShowAircraftFlag = true;
    MapBorderButtonOn(Enum141.MAP_BORDER_AIRSPACE_BTN);

    // Turn off towns & mines (mostly because town/mine names overlap SAM site names)
    if (fShowTownFlag == true) {
      fShowTownFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_TOWN_BTN);
    }

    if (fShowMineFlag == true) {
      fShowMineFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_MINE_BTN);
    }

    /*
                    // Turn off teams and militia
                    if( fShowTeamFlag == TRUE )
                    {
                            fShowTeamFlag = FALSE;
                            MapBorderButtonOff( MAP_BORDER_TEAMS_BTN );
                    }

                    if( fShowMilitia == TRUE )
                    {
                            fShowMilitia = FALSE;
                            MapBorderButtonOff( MAP_BORDER_MILITIA_BTN );
                    }
    */

    // Turn off items
    if (fShowItemsFlag == true) {
      fShowItemsFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);
    }

    if (bSelectedDestChar != -1) {
      AbortMovementPlottingMode();
    }

    // if showing underground
    if (iCurrentMapSectorZ != 0) {
      // switch to the surface
      JumpToLevel(0);
    }

    // dirty regions
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  }
}

function TurnOnItemFilterMode(): void {
  // if mode already on, leave, else set and redraw

  if (fShowItemsFlag == false) {
    fShowItemsFlag = true;
    MapBorderButtonOn(Enum141.MAP_BORDER_ITEM_BTN);

    // Turn off towns, mines, teams, militia & airspace if any are on
    if (fShowTownFlag == true) {
      fShowTownFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_TOWN_BTN);
    }

    if (fShowMineFlag == true) {
      fShowMineFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_MINE_BTN);
    }

    if (fShowTeamFlag == true) {
      fShowTeamFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_TEAMS_BTN);
    }

    if (fShowMilitia == true) {
      fShowMilitia = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_MILITIA_BTN);
    }

    if (fShowAircraftFlag == true) {
      fShowAircraftFlag = false;
      MapBorderButtonOff(Enum141.MAP_BORDER_AIRSPACE_BTN);
    }

    if ((bSelectedDestChar != -1) || (fPlotForHelicopter == true)) {
      AbortMovementPlottingMode();
    }

    // dirty regions
    fMapPanelDirty = true;
    fTeamPanelDirty = true;
    fCharacterInfoPanelDirty = true;
  }
}

/*
void UpdateLevelButtonStates( void )
{

        if( iCurrentMapSectorZ == 0 )
        {
                DisableButton( guiMapBorderLandRaiseButtons[ MAP_BORDER_RAISE_LEVEL ] );
        }
        else
        {
                EnableButton( guiMapBorderLandRaiseButtons[ MAP_BORDER_RAISE_LEVEL ] );
        }

        if( iCurrentMapSectorZ == 3 )
        {
                DisableButton( guiMapBorderLandRaiseButtons[ MAP_BORDER_LOWER_LEVEL ] );
        }
        else
        {
                EnableButton( guiMapBorderLandRaiseButtons[ MAP_BORDER_LOWER_LEVEL ] );
        }

        return;
}
*/

/*
void UpdateScrollButtonStatesWhileScrolling( void )
{
        // too far west, disable
        if ( iZoomY == NORTH_ZOOM_BOUND )
        {
                ButtonList[ guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_UP ] ]->uiFlags&=~(BUTTON_CLICKED_ON);
                DisableButton( guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_UP ] );
        }
        else if(iZoomY == SOUTH_ZOOM_BOUND )
        {
                ButtonList[ guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_DWN ] ]->uiFlags&=~(BUTTON_CLICKED_ON);
                DisableButton( guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_DWN ] );
        }

        // too far west, disable
        if ( iZoomX == WEST_ZOOM_BOUND )
        {
                ButtonList[ guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_LEFT ] ]->uiFlags&=~(BUTTON_CLICKED_ON);
                DisableButton( guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_LEFT ] );
        }
        else if(iZoomX == EAST_ZOOM_BOUND )
        {
                ButtonList[ guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_RIGHT ] ]->uiFlags&=~(BUTTON_CLICKED_ON);
                DisableButton( guiMapBorderScrollButtons[ ZOOM_MAP_SCROLL_RIGHT ] );
        }

}
*/

function InitializeMapBorderButtonStates(): void {
  if (fShowItemsFlag) {
    MapBorderButtonOn(Enum141.MAP_BORDER_ITEM_BTN);
  } else {
    MapBorderButtonOff(Enum141.MAP_BORDER_ITEM_BTN);
  }

  if (fShowTownFlag) {
    MapBorderButtonOn(Enum141.MAP_BORDER_TOWN_BTN);
  } else {
    MapBorderButtonOff(Enum141.MAP_BORDER_TOWN_BTN);
  }

  if (fShowMineFlag) {
    MapBorderButtonOn(Enum141.MAP_BORDER_MINE_BTN);
  } else {
    MapBorderButtonOff(Enum141.MAP_BORDER_MINE_BTN);
  }

  if (fShowTeamFlag) {
    MapBorderButtonOn(Enum141.MAP_BORDER_TEAMS_BTN);
  } else {
    MapBorderButtonOff(Enum141.MAP_BORDER_TEAMS_BTN);
  }

  if (fShowAircraftFlag) {
    MapBorderButtonOn(Enum141.MAP_BORDER_AIRSPACE_BTN);
  } else {
    MapBorderButtonOff(Enum141.MAP_BORDER_AIRSPACE_BTN);
  }

  if (fShowMilitia) {
    MapBorderButtonOn(Enum141.MAP_BORDER_MILITIA_BTN);
  } else {
    MapBorderButtonOff(Enum141.MAP_BORDER_MILITIA_BTN);
  }
}

function DoesPlayerHaveAnyMilitia(): boolean {
  let sX: INT16;
  let sY: INT16;

  // run through list of towns that might have militia..if any return TRUE..else return FALSE
  for (sX = 1; sX < MAP_WORLD_X - 1; sX++) {
    for (sY = 1; sY < MAP_WORLD_Y - 1; sY++) {
      if ((SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[Enum126.GREEN_MILITIA] + SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[Enum126.REGULAR_MILITIA] + SectorInfo[SECTOR(sX, sY)].ubNumberOfCivsAtLevel[Enum126.ELITE_MILITIA]) > 0) {
        // found at least one
        return true;
      }
    }
  }

  // no one found
  return false;
}

function CommonBtnCallbackBtnDownChecks(): void {
  if (IsMapScreenHelpTextUp()) {
    // stop mapscreen text
    StopMapScreenHelpText();
  }

  // any click cancels MAP UI messages, unless we're in confirm map move mode
  if ((giUIMessageOverlay != -1) && !gfInConfirmMapMoveMode) {
    CancelMapUIMessage();
  }
}

export function InitMapScreenFlags(): void {
  fShowTownFlag = true;
  fShowMineFlag = false;

  fShowTeamFlag = true;
  fShowMilitia = false;

  fShowAircraftFlag = false;
  fShowItemsFlag = false;
}

function MapBorderButtonOff(ubBorderButtonIndex: UINT8): void {
  Assert(ubBorderButtonIndex < 6);

  if (fShowMapInventoryPool) {
    return;
  }

  // if button doesn't exist, return
  if (giMapBorderButtons[ubBorderButtonIndex] == -1) {
    return;
  }

  Assert(giMapBorderButtons[ubBorderButtonIndex] < MAX_BUTTONS);

  ButtonList[giMapBorderButtons[ubBorderButtonIndex]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
}

function MapBorderButtonOn(ubBorderButtonIndex: UINT8): void {
  Assert(ubBorderButtonIndex < 6);

  if (fShowMapInventoryPool) {
    return;
  }

  // if button doesn't exist, return
  if (giMapBorderButtons[ubBorderButtonIndex] == -1) {
    return;
  }

  Assert(giMapBorderButtons[ubBorderButtonIndex] < MAX_BUTTONS);

  ButtonList[giMapBorderButtons[ubBorderButtonIndex]].value.uiFlags |= BUTTON_CLICKED_ON;
}

}
