////////////////////////////////////////////
//
//	Global Defines
//
///////////////////////////////////////////

const GIO_TITLE_FONT = () => FONT16ARIAL(); // FONT14ARIAL
const GIO_TITLE_COLOR = FONT_MCOLOR_WHITE;

const GIO_TOGGLE_TEXT_FONT = () => FONT16ARIAL(); // FONT14ARIAL
const GIO_TOGGLE_TEXT_COLOR = FONT_MCOLOR_WHITE;

// buttons
const GIO_BTN_OK_X = 141;
const GIO_BTN_OK_Y = 418;
const GIO_CANCEL_X = 379;

// main title
const GIO_MAIN_TITLE_X = 0;
const GIO_MAIN_TITLE_Y = 68;
const GIO_MAIN_TITLE_WIDTH = 640;

// radio box locations
const GIO_GAP_BN_SETTINGS = 35;
const GIO_OFFSET_TO_TEXT = 20; // 30
const GIO_OFFSET_TO_TOGGLE_BOX = 155; // 200
const GIO_OFFSET_TO_TOGGLE_BOX_Y = 9;

const GIO_DIF_SETTINGS_X = 80;
const GIO_DIF_SETTINGS_Y = 150;
const GIO_DIF_SETTINGS_WIDTH = GIO_OFFSET_TO_TOGGLE_BOX - GIO_OFFSET_TO_TEXT; // 230

const GIO_GAME_SETTINGS_X = 350;
const GIO_GAME_SETTINGS_Y = 300; // 280//150
const GIO_GAME_SETTINGS_WIDTH = GIO_DIF_SETTINGS_WIDTH;

const GIO_GUN_SETTINGS_X = GIO_GAME_SETTINGS_X;
const GIO_GUN_SETTINGS_Y = GIO_DIF_SETTINGS_Y; // 150//280
const GIO_GUN_SETTINGS_WIDTH = GIO_DIF_SETTINGS_WIDTH;

/*
#define		GIO_TIMED_TURN_SETTING_X						GIO_DIF_SETTINGS_X
#define		GIO_TIMED_TURN_SETTING_Y						GIO_GAME_SETTINGS_Y
#define		GIO_TIMED_TURN_SETTING_WIDTH				GIO_DIF_SETTINGS_WIDTH
*/

const GIO_IRON_MAN_SETTING_X = GIO_DIF_SETTINGS_X;
const GIO_IRON_MAN_SETTING_Y = GIO_GAME_SETTINGS_Y;
const GIO_IRON_MAN_SETTING_WIDTH = GIO_DIF_SETTINGS_WIDTH;

// Difficulty settings
const enum Enum3 {
  GIO_DIFF_EASY,
  GIO_DIFF_MED,
  GIO_DIFF_HARD,

  NUM_DIFF_SETTINGS,
}

// Game Settings options
const enum Enum4 {
  GIO_REALISTIC,
  GIO_SCI_FI,

  NUM_GAME_STYLES,
}

// Gun options
const enum Enum5 {
  GIO_REDUCED_GUNS,
  GIO_GUN_NUT,

  NUM_GUN_OPTIONS,
}

// JA2Gold: no more timed turns setting

/*
//enum for the timed turns setting
enum
{
        GIO_NO_TIMED_TURNS,
        GIO_TIMED_TURNS,

        GIO_NUM_TIMED_TURN_OPTIONS,
};
*/

// Iron man mode
const enum Enum6 {
  GIO_CAN_SAVE,
  GIO_IRON_MAN,

  NUM_SAVE_OPTIONS,
}

// enum for different states of game
const enum Enum7 {
  GIO_NOTHING,
  GIO_CANCEL,
  GIO_EXIT,
  GIO_IRON_MAN_MODE,
}

////////////////////////////////////////////
//
//	Global Variables
//
///////////////////////////////////////////

let gfGIOScreenEntry: BOOLEAN = TRUE;
let gfGIOScreenExit: BOOLEAN = FALSE;
let gfReRenderGIOScreen: BOOLEAN = TRUE;
let gfGIOButtonsAllocated: BOOLEAN = FALSE;

let gubGameOptionScreenHandler: UINT8 = Enum7.GIO_NOTHING;

let gubGIOExitScreen: UINT32 = Enum26.GAME_INIT_OPTIONS_SCREEN;

let guiGIOMainBackGroundImage: UINT32;

let giGioMessageBox: INT32 = -1;
// BOOLEAN		gfExitGioDueToMessageBox=FALSE;

// UINT8			gubDifficultySettings[ NUM_DIFF_SETTINGS ];
// UINT8			gubGameSettings[ NUM_GAME_STYLES ];
// UINT8			gubGunSettings[ NUM_GUN_OPTIONS ];

// extern	INT32						gp16PointArial;

let guiGIODoneButton: UINT32;
let giGIODoneBtnImage: INT32;

let guiGIOCancelButton: UINT32;
let giGIOCancelBtnImage: INT32;

// checkbox to toggle the Diff level
let guiDifficultySettingsToggles: UINT32[] /* [NUM_DIFF_SETTINGS] */;

// checkbox to toggle Game style
let guiGameStyleToggles: UINT32[] /* [NUM_GAME_STYLES] */;

// checkbox to toggle Gun options
let guiGunOptionToggles: UINT32[] /* [NUM_GUN_OPTIONS] */;

// JA2Gold: no more timed turns setting
/*
//checkbox to toggle Timed turn option on or off
UINT32	guiTimedTurnToggles[ GIO_NUM_TIMED_TURN_OPTIONS ];
void BtnTimedTurnsTogglesCallback(GUI_BUTTON *btn,INT32 reason);
*/

// checkbox to toggle Save style
let guiGameSaveToggles: UINT32[] /* [NUM_SAVE_OPTIONS] */;

////////////////////////////////////////////
//
//	Local Function Prototypes
//
///////////////////////////////////////////

// ppp

function GameInitOptionsScreenInit(): UINT32 {
  return 1;
}

function GameInitOptionsScreenHandle(): UINT32 {
  StartFrameBufferRender();

  if (gfGIOScreenEntry) {
    //		PauseGame();

    EnterGIOScreen();
    gfGIOScreenEntry = FALSE;
    gfGIOScreenExit = FALSE;
    InvalidateRegion(0, 0, 640, 480);
  }

  GetGIOScreenUserInput();

  HandleGIOScreen();

  // render buttons marked dirty
  MarkButtonsDirty();
  RenderButtons();

  // render help
  //	RenderFastHelp( );
  //	RenderButtonsFastHelp( );

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  if (HandleFadeOutCallback()) {
    ClearMainMenu();
    return gubGIOExitScreen;
  }

  if (HandleBeginFadeOut(gubGIOExitScreen)) {
    return gubGIOExitScreen;
  }

  if (gfGIOScreenExit) {
    ExitGIOScreen();
  }

  if (HandleFadeInCallback()) {
    // Re-render the scene!
    RenderGIOScreen();
  }

  if (HandleBeginFadeIn(gubGIOExitScreen)) {
  }

  return gubGIOExitScreen;
}

function GameInitOptionsScreenShutdown(): UINT32 {
  return 1;
}

function EnterGIOScreen(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let cnt: UINT16;
  let usPosY: UINT16;

  if (gfGIOButtonsAllocated)
    return TRUE;

  SetCurrentCursorFromDatabase(Enum317.CURSOR_NORMAL);

  // load the Main trade screen backgroiund image
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("InterFace\\OptionsScreenBackGround.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiGIOMainBackGroundImage)));

  // Ok button
  giGIODoneBtnImage = LoadButtonImage("INTERFACE\\PreferencesButtons.sti", -1, 0, -1, 2, -1);
  guiGIODoneButton = CreateIconAndTextButton(giGIODoneBtnImage, gzGIOScreenText[Enum375.GIO_OK_TEXT], OPT_BUTTON_FONT, OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, GIO_BTN_OK_X, GIO_BTN_OK_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnGIODoneCallback);

  SpecifyButtonSoundScheme(guiGIODoneButton, Enum27.BUTTON_SOUND_SCHEME_BIGSWITCH3);
  SpecifyDisabledButtonStyle(guiGIODoneButton, Enum29.DISABLED_STYLE_NONE);

  // Cancel button
  giGIOCancelBtnImage = UseLoadedButtonImage(giGIODoneBtnImage, -1, 1, -1, 3, -1);
  guiGIOCancelButton = CreateIconAndTextButton(giGIOCancelBtnImage, gzGIOScreenText[Enum375.GIO_CANCEL_TEXT], OPT_BUTTON_FONT, OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, GIO_CANCEL_X, GIO_BTN_OK_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnGIOCancelCallback);
  SpecifyButtonSoundScheme(guiGIOCancelButton, Enum27.BUTTON_SOUND_SCHEME_BIGSWITCH3);

  //
  // Check box to toggle Difficulty settings
  //
  usPosY = GIO_DIF_SETTINGS_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;

  for (cnt = 0; cnt < Enum3.NUM_DIFF_SETTINGS; cnt++) {
    guiDifficultySettingsToggles[cnt] = CreateCheckBoxButton(GIO_DIF_SETTINGS_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, "INTERFACE\\OptionsCheck.sti", MSYS_PRIORITY_HIGH + 10, BtnDifficultyTogglesCallback);
    MSYS_SetBtnUserData(guiDifficultySettingsToggles[cnt], 0, cnt);

    usPosY += GIO_GAP_BN_SETTINGS;
  }
  if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_EASY)
    ButtonList[guiDifficultySettingsToggles[Enum3.GIO_DIFF_EASY]].value.uiFlags |= BUTTON_CLICKED_ON;

  else if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_MEDIUM)
    ButtonList[guiDifficultySettingsToggles[Enum3.GIO_DIFF_MED]].value.uiFlags |= BUTTON_CLICKED_ON;

  else if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_HARD)
    ButtonList[guiDifficultySettingsToggles[Enum3.GIO_DIFF_HARD]].value.uiFlags |= BUTTON_CLICKED_ON;

  else
    ButtonList[guiDifficultySettingsToggles[Enum3.GIO_DIFF_MED]].value.uiFlags |= BUTTON_CLICKED_ON;

  //
  // Check box to toggle Game settings ( realistic, sci fi )
  //

  usPosY = GIO_GAME_SETTINGS_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
  for (cnt = 0; cnt < Enum4.NUM_GAME_STYLES; cnt++) {
    guiGameStyleToggles[cnt] = CreateCheckBoxButton(GIO_GAME_SETTINGS_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, "INTERFACE\\OptionsCheck.sti", MSYS_PRIORITY_HIGH + 10, BtnGameStyleTogglesCallback);
    MSYS_SetBtnUserData(guiGameStyleToggles[cnt], 0, cnt);

    usPosY += GIO_GAP_BN_SETTINGS;
  }
  if (gGameOptions.fSciFi)
    ButtonList[guiGameStyleToggles[Enum4.GIO_SCI_FI]].value.uiFlags |= BUTTON_CLICKED_ON;
  else
    ButtonList[guiGameStyleToggles[Enum4.GIO_REALISTIC]].value.uiFlags |= BUTTON_CLICKED_ON;

  // JA2Gold: iron man buttons
  usPosY = GIO_IRON_MAN_SETTING_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
  for (cnt = 0; cnt < Enum6.NUM_SAVE_OPTIONS; cnt++) {
    guiGameSaveToggles[cnt] = CreateCheckBoxButton(GIO_IRON_MAN_SETTING_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, "INTERFACE\\OptionsCheck.sti", MSYS_PRIORITY_HIGH + 10, BtnGameSaveTogglesCallback);
    MSYS_SetBtnUserData(guiGameSaveToggles[cnt], 0, cnt);

    usPosY += GIO_GAP_BN_SETTINGS;
  }
  if (gGameOptions.fIronManMode)
    ButtonList[guiGameSaveToggles[Enum6.GIO_IRON_MAN]].value.uiFlags |= BUTTON_CLICKED_ON;
  else
    ButtonList[guiGameSaveToggles[Enum6.GIO_CAN_SAVE]].value.uiFlags |= BUTTON_CLICKED_ON;

  //
  // Check box to toggle Gun options
  //

  usPosY = GIO_GUN_SETTINGS_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
  for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
    guiGunOptionToggles[cnt] = CreateCheckBoxButton(GIO_GUN_SETTINGS_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, "INTERFACE\\OptionsCheck.sti", MSYS_PRIORITY_HIGH + 10, BtnGunOptionsTogglesCallback);
    MSYS_SetBtnUserData(guiGunOptionToggles[cnt], 0, cnt);

    usPosY += GIO_GAP_BN_SETTINGS;
  }

  if (gGameOptions.fGunNut)
    ButtonList[guiGunOptionToggles[Enum5.GIO_GUN_NUT]].value.uiFlags |= BUTTON_CLICKED_ON;
  else
    ButtonList[guiGunOptionToggles[Enum5.GIO_REDUCED_GUNS]].value.uiFlags |= BUTTON_CLICKED_ON;

  // JA2 Gold: no more timed turns
  //
  // Check box to toggle the timed turn option
  //
  /*
          usPosY = GIO_TIMED_TURN_SETTING_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
          for( cnt=0; cnt<GIO_NUM_TIMED_TURN_OPTIONS; cnt++)
          {
                  guiTimedTurnToggles[ cnt ] = CreateCheckBoxButton(	GIO_TIMED_TURN_SETTING_X+GIO_OFFSET_TO_TOGGLE_BOX, usPosY,
                                                                                                                                                  "INTERFACE\\OptionsCheck.sti", MSYS_PRIORITY_HIGH+10,
                                                                                                                                                  BtnTimedTurnsTogglesCallback );
                  MSYS_SetBtnUserData( guiTimedTurnToggles[ cnt ], 0, cnt );

                  usPosY += GIO_GAP_BN_SETTINGS;
          }
          if( gGameOptions.fTurnTimeLimit )
                  ButtonList[ guiTimedTurnToggles[ GIO_TIMED_TURNS ] ]->uiFlags |= BUTTON_CLICKED_ON;
          else
                  ButtonList[ guiTimedTurnToggles[ GIO_NO_TIMED_TURNS ] ]->uiFlags |= BUTTON_CLICKED_ON;
  */

  // Reset the exit screen
  gubGIOExitScreen = Enum26.GAME_INIT_OPTIONS_SCREEN;

  // REnder the screen once so we can blt ot to ths save buffer
  RenderGIOScreen();

  BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, 0, 0, 639, 439);

  gfGIOButtonsAllocated = TRUE;

  return TRUE;
}

function ExitGIOScreen(): BOOLEAN {
  let cnt: UINT16;

  if (!gfGIOButtonsAllocated)
    return TRUE;

  // Delete the main options screen background
  DeleteVideoObjectFromIndex(guiGIOMainBackGroundImage);

  RemoveButton(guiGIOCancelButton);
  RemoveButton(guiGIODoneButton);

  UnloadButtonImage(giGIOCancelBtnImage);
  UnloadButtonImage(giGIODoneBtnImage);

  // Check box to toggle Difficulty settings
  for (cnt = 0; cnt < Enum3.NUM_DIFF_SETTINGS; cnt++)
    RemoveButton(guiDifficultySettingsToggles[cnt]);

  // Check box to toggle Game settings ( realistic, sci fi )
  for (cnt = 0; cnt < Enum4.NUM_GAME_STYLES; cnt++)
    RemoveButton(guiGameStyleToggles[cnt]);

  // Check box to toggle Gun options
  for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++)
    RemoveButton(guiGunOptionToggles[cnt]);

  // JA2Gold: no more timed turns setting
  /*
  //remove the timed turns toggle
  for( cnt=0; cnt<GIO_NUM_TIMED_TURN_OPTIONS; cnt++ )
          RemoveButton( guiTimedTurnToggles[ cnt ] );
  */
  // JA2Gold: remove iron man buttons
  for (cnt = 0; cnt < Enum6.NUM_SAVE_OPTIONS; cnt++)
    RemoveButton(guiGameSaveToggles[cnt]);

  gfGIOButtonsAllocated = FALSE;

  // If we are starting the game stop playing the music
  if (gubGameOptionScreenHandler == Enum7.GIO_EXIT)
    SetMusicMode(Enum328.MUSIC_NONE);

  gfGIOScreenExit = FALSE;
  gfGIOScreenEntry = TRUE;

  return TRUE;
}

function HandleGIOScreen(): void {
  if (gubGameOptionScreenHandler != Enum7.GIO_NOTHING) {
    switch (gubGameOptionScreenHandler) {
      case Enum7.GIO_CANCEL:
        gubGIOExitScreen = Enum26.MAINMENU_SCREEN;
        gfGIOScreenExit = TRUE;
        break;

      case Enum7.GIO_EXIT: {
        // if we are already fading out, get out of here
        if (gFadeOutDoneCallback != DoneFadeOutForExitGameInitOptionScreen) {
          // Disable the ok button
          DisableButton(guiGIODoneButton);

          gFadeOutDoneCallback = DoneFadeOutForExitGameInitOptionScreen;

          FadeOutNextFrame();
        }
        break;
      }

      case Enum7.GIO_IRON_MAN_MODE:
        DisplayMessageToUserAboutGameDifficulty();
        break;
    }

    gubGameOptionScreenHandler = Enum7.GIO_NOTHING;
  }

  if (gfReRenderGIOScreen) {
    RenderGIOScreen();
    gfReRenderGIOScreen = FALSE;
  }

  RestoreGIOButtonBackGrounds();
}

function RenderGIOScreen(): BOOLEAN {
  let hPixHandle: HVOBJECT;
  let usPosY: UINT16;

  // Get the main background screen graphic and blt it
  GetVideoObject(addressof(hPixHandle), guiGIOMainBackGroundImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, NULL);

  // Shade the background
  ShadowVideoSurfaceRect(FRAME_BUFFER, 48, 55, 592, 378); // 358

  // Display the title
  DrawTextToScreen(gzGIOScreenText[Enum375.GIO_INITIAL_GAME_SETTINGS], GIO_MAIN_TITLE_X, GIO_MAIN_TITLE_Y, GIO_MAIN_TITLE_WIDTH, GIO_TITLE_FONT, GIO_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display the Dif Settings Title Text
  // DrawTextToScreen( gzGIOScreenText[ GIO_DIF_LEVEL_TEXT ], GIO_DIF_SETTINGS_X, (UINT16)(GIO_DIF_SETTINGS_Y-GIO_GAP_BN_SETTINGS), GIO_DIF_SETTINGS_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString(GIO_DIF_SETTINGS_X, (GIO_DIF_SETTINGS_Y - GIO_GAP_BN_SETTINGS), GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_DIF_LEVEL_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY = GIO_DIF_SETTINGS_Y + 2;
  // DrawTextToScreen( gzGIOScreenText[ GIO_EASY_TEXT ], (UINT16)(GIO_DIF_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_DIF_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_EASY_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY += GIO_GAP_BN_SETTINGS;
  // DrawTextToScreen( gzGIOScreenText[ GIO_MEDIUM_TEXT ], (UINT16)(GIO_DIF_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_DIF_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_MEDIUM_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY += GIO_GAP_BN_SETTINGS;
  // DrawTextToScreen( gzGIOScreenText[ GIO_HARD_TEXT ], (UINT16)(GIO_DIF_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_DIF_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_HARD_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the Game Settings Title Text
  //	DrawTextToScreen( gzGIOScreenText[ GIO_GAME_STYLE_TEXT ], GIO_GAME_SETTINGS_X, (UINT16)(GIO_GAME_SETTINGS_Y-GIO_GAP_BN_SETTINGS), GIO_GAME_SETTINGS_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString(GIO_GAME_SETTINGS_X, (GIO_GAME_SETTINGS_Y - GIO_GAP_BN_SETTINGS), GIO_GAME_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_GAME_STYLE_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY = GIO_GAME_SETTINGS_Y + 2;
  // DrawTextToScreen( gzGIOScreenText[ GIO_REALISTIC_TEXT ], (UINT16)(GIO_GAME_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_GAME_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_GAME_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_REALISTIC_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY += GIO_GAP_BN_SETTINGS;
  // DrawTextToScreen( gzGIOScreenText[ GIO_SCI_FI_TEXT ], (UINT16)(GIO_GAME_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_GAME_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_GAME_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_SCI_FI_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the Gun Settings Title Text
  //	DrawTextToScreen( gzGIOScreenText[ GIO_GUN_OPTIONS_TEXT ], GIO_GUN_SETTINGS_X, (UINT16)(GIO_GUN_SETTINGS_Y-GIO_GAP_BN_SETTINGS), GIO_GUN_SETTINGS_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString(GIO_GUN_SETTINGS_X, (GIO_GUN_SETTINGS_Y - GIO_GAP_BN_SETTINGS), GIO_GUN_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_GUN_OPTIONS_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY = GIO_GUN_SETTINGS_Y + 2;
  // DrawTextToScreen( gzGIOScreenText[ GIO_REDUCED_GUNS_TEXT ], (UINT16)(GIO_GUN_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_GUN_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_GUN_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_REDUCED_GUNS_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY += GIO_GAP_BN_SETTINGS;
  // DrawTextToScreen( gzGIOScreenText[ GIO_GUN_NUT_TEXT ], (UINT16)(GIO_GUN_SETTINGS_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_MAIN_TITLE_WIDTH, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  DisplayWrappedString((GIO_GUN_SETTINGS_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_GUN_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_GUN_NUT_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // JA2Gold: no more timed turns setting
  /*
  //Display the Timed turns Settings Title Text
  DisplayWrappedString( GIO_TIMED_TURN_SETTING_X, (UINT16)(GIO_TIMED_TURN_SETTING_Y-GIO_GAP_BN_SETTINGS), GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[ GIO_TIMED_TURN_TITLE_TEXT ], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  usPosY = GIO_TIMED_TURN_SETTING_Y+2;

  DisplayWrappedString( (UINT16)(GIO_TIMED_TURN_SETTING_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[ GIO_NO_TIMED_TURNS_TEXT ], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  usPosY += GIO_GAP_BN_SETTINGS;

  DisplayWrappedString( (UINT16)(GIO_TIMED_TURN_SETTING_X+GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[ GIO_TIMED_TURNS_TEXT ], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED );
  */

  // JA2Gold: Display the iron man Settings Title Text
  DisplayWrappedString(GIO_IRON_MAN_SETTING_X, (GIO_IRON_MAN_SETTING_Y - GIO_GAP_BN_SETTINGS), GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_GAME_SAVE_STYLE_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  usPosY = GIO_IRON_MAN_SETTING_Y + 2;

  DisplayWrappedString((GIO_IRON_MAN_SETTING_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_SAVE_ANYWHERE_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  usPosY += GIO_GAP_BN_SETTINGS;

  DisplayWrappedString((GIO_IRON_MAN_SETTING_X + GIO_OFFSET_TO_TEXT), usPosY, GIO_DIF_SETTINGS_WIDTH, 2, GIO_TOGGLE_TEXT_FONT, GIO_TOGGLE_TEXT_COLOR, gzGIOScreenText[Enum375.GIO_IRON_MAN_TEXT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  usPosY += 20;
  DisplayWrappedString((GIO_IRON_MAN_SETTING_X + GIO_OFFSET_TO_TEXT), usPosY, 220, 2, FONT12ARIAL, GIO_TOGGLE_TEXT_COLOR, zNewTacticalMessages[Enum320.TCTL_MSG__CANNOT_SAVE_DURING_COMBAT], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  return TRUE;
}

function GetGIOScreenUserInput(): void {
  let Event: InputAtom;
  //	POINT  MousePos;

  //	GetCursorPos(&MousePos);

  while (DequeueEvent(addressof(Event))) {
    if (Event.usEvent == KEY_DOWN) {
      switch (Event.usParam) {
        case ESC:
          // Exit out of the screen
          gubGameOptionScreenHandler = Enum7.GIO_CANCEL;
          break;

        case ENTER:
          gubGameOptionScreenHandler = Enum7.GIO_EXIT;
          break;
      }
    }
  }
}

function BtnDifficultyTogglesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let cnt: UINT8;

      for (cnt = 0; cnt < Enum3.NUM_DIFF_SETTINGS; cnt++) {
        ButtonList[guiDifficultySettingsToggles[cnt]].value.uiFlags &= ~BUTTON_CLICKED_ON;
      }

      // enable the current button
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
    } else {
      let cnt: UINT8;
      let fAnyChecked: BOOLEAN = FALSE;

      // if none of the other boxes are checked, do not uncheck this box
      for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
        if (ButtonList[guiDifficultySettingsToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
          fAnyChecked = TRUE;
        }
      }
      // if none are checked, re check this one
      if (!fAnyChecked)
        btn.value.uiFlags |= BUTTON_CLICKED_ON;
    }
  }
}

function BtnGameStyleTogglesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let cnt: UINT8;

      for (cnt = 0; cnt < Enum4.NUM_GAME_STYLES; cnt++) {
        ButtonList[guiGameStyleToggles[cnt]].value.uiFlags &= ~BUTTON_CLICKED_ON;
      }

      // enable the current button
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
    } else {
      let cnt: UINT8;
      let fAnyChecked: BOOLEAN = FALSE;

      // if none of the other boxes are checked, do not uncheck this box
      for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
        if (ButtonList[guiGameStyleToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
          fAnyChecked = TRUE;
        }
      }
      // if none are checked, re check this one
      if (!fAnyChecked)
        btn.value.uiFlags |= BUTTON_CLICKED_ON;
    }
  }
}

function BtnGameSaveTogglesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    //		UINT8	ubButton = (UINT8)MSYS_GetBtnUserData( btn, 0 );

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let cnt: UINT8;

      for (cnt = 0; cnt < Enum6.NUM_SAVE_OPTIONS; cnt++) {
        ButtonList[guiGameSaveToggles[cnt]].value.uiFlags &= ~BUTTON_CLICKED_ON;
      }

      // enable the current button
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
    } else {
      let cnt: UINT8;
      let fAnyChecked: BOOLEAN = FALSE;

      // if none of the other boxes are checked, do not uncheck this box
      for (cnt = 0; cnt < Enum6.NUM_SAVE_OPTIONS; cnt++) {
        if (ButtonList[guiGameSaveToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
          fAnyChecked = TRUE;
        }
      }
      // if none are checked, re check this one
      if (!fAnyChecked)
        btn.value.uiFlags |= BUTTON_CLICKED_ON;
    }
  }
}

function BtnGunOptionsTogglesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);

    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let cnt: UINT8;

      for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
        ButtonList[guiGunOptionToggles[cnt]].value.uiFlags &= ~BUTTON_CLICKED_ON;
      }

      // enable the current button
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
    } else {
      let cnt: UINT8;
      let fAnyChecked: BOOLEAN = FALSE;

      // if none of the other boxes are checked, do not uncheck this box
      for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
        if (ButtonList[guiGunOptionToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
          fAnyChecked = TRUE;
        }
      }
      // if none are checked, re check this one
      if (!fAnyChecked)
        btn.value.uiFlags |= BUTTON_CLICKED_ON;
    }
  }
}

// JA2Gold: no more timed turns setting
/*
void BtnTimedTurnsTogglesCallback( GUI_BUTTON *btn, INT32 reason )
{
        if( reason & MSYS_CALLBACK_REASON_LBUTTON_UP )
        {
                UINT8	ubButton = (UINT8)MSYS_GetBtnUserData( btn, 0 );

                if( btn->uiFlags & BUTTON_CLICKED_ON )
                {
                        UINT8	cnt;

                        for( cnt=0; cnt<GIO_NUM_TIMED_TURN_OPTIONS; cnt++)
                        {
                                ButtonList[ guiTimedTurnToggles[ cnt ] ]->uiFlags &= ~BUTTON_CLICKED_ON;
                        }

                        //enable the current button
                        btn->uiFlags |= BUTTON_CLICKED_ON;
                }
                else
                {
                        UINT8	cnt;
                        BOOLEAN fAnyChecked=FALSE;

                        //if none of the other boxes are checked, do not uncheck this box
                        for( cnt=0; cnt<GIO_NUM_TIMED_TURN_OPTIONS; cnt++)
                        {
                                if( ButtonList[ guiTimedTurnToggles[ cnt ] ]->uiFlags & BUTTON_CLICKED_ON )
                                {
                                        fAnyChecked = TRUE;
                                }
                        }
                        //if none are checked, re check this one
                        if( !fAnyChecked )
                                btn->uiFlags |= BUTTON_CLICKED_ON;
                }
        }
}
*/

function BtnGIODoneCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    // if the user doesnt have IRON MAN mode selected
    if (!DisplayMessageToUserAboutIronManMode()) {
      // Confirm the difficulty setting
      DisplayMessageToUserAboutGameDifficulty();
    }

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnGIOCancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    gubGameOptionScreenHandler = Enum7.GIO_CANCEL;

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function GetCurrentDifficultyButtonSetting(): UINT8 {
  let cnt: UINT8;

  for (cnt = 0; cnt < Enum3.NUM_DIFF_SETTINGS; cnt++) {
    if (ButtonList[guiDifficultySettingsToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
      return cnt;
    }
  }

  return 0;
}

function GetCurrentGameStyleButtonSetting(): UINT8 {
  let cnt: UINT8;

  for (cnt = 0; cnt < Enum4.NUM_GAME_STYLES; cnt++) {
    if (ButtonList[guiGameStyleToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
      return cnt;
    }
  }
  return 0;
}

function GetCurrentGunButtonSetting(): UINT8 {
  let cnt: UINT8;

  for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
    if (ButtonList[guiGunOptionToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
      return cnt;
    }
  }
  return 0;
}

// JA2 Gold: no timed turns
/*
UINT8	GetCurrentTimedTurnsButtonSetting()
{
        UINT8	cnt;

        for( cnt=0; cnt<GIO_NUM_TIMED_TURN_OPTIONS; cnt++)
        {
                if( ButtonList[ guiTimedTurnToggles[ cnt ] ]->uiFlags & BUTTON_CLICKED_ON )
                {
                        return( cnt );
                }
        }
        return( 0 );
}
*/

function GetCurrentGameSaveButtonSetting(): UINT8 {
  let cnt: UINT8;

  for (cnt = 0; cnt < Enum6.NUM_SAVE_OPTIONS; cnt++) {
    if (ButtonList[guiGameSaveToggles[cnt]].value.uiFlags & BUTTON_CLICKED_ON) {
      return cnt;
    }
  }
  return 0;
}

function RestoreGIOButtonBackGrounds(): void {
  let cnt: UINT8;
  let usPosY: UINT16;

  usPosY = GIO_DIF_SETTINGS_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
  // Check box to toggle Difficulty settings
  for (cnt = 0; cnt < Enum3.NUM_DIFF_SETTINGS; cnt++) {
    RestoreExternBackgroundRect(GIO_DIF_SETTINGS_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, 34, 29);
    usPosY += GIO_GAP_BN_SETTINGS;
  }

  usPosY = GIO_GAME_SETTINGS_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
  // Check box to toggle Game settings ( realistic, sci fi )
  for (cnt = 0; cnt < Enum4.NUM_GAME_STYLES; cnt++) {
    RestoreExternBackgroundRect(GIO_GAME_SETTINGS_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, 34, 29);

    usPosY += GIO_GAP_BN_SETTINGS;
  }

  usPosY = GIO_GUN_SETTINGS_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;

  // Check box to toggle Gun options
  for (cnt = 0; cnt < Enum5.NUM_GUN_OPTIONS; cnt++) {
    RestoreExternBackgroundRect(GIO_GUN_SETTINGS_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, 34, 29);
    usPosY += GIO_GAP_BN_SETTINGS;
  }

  // JA2Gold: no more timed turns setting
  /*
  //Check box to toggle timed turns options
  usPosY = GIO_TIMED_TURN_SETTING_Y-GIO_OFFSET_TO_TOGGLE_BOX_Y;
  for( cnt=0; cnt<GIO_NUM_TIMED_TURN_OPTIONS; cnt++)
  {
          RestoreExternBackgroundRect( GIO_TIMED_TURN_SETTING_X+GIO_OFFSET_TO_TOGGLE_BOX, usPosY, 34, 29 );
          usPosY += GIO_GAP_BN_SETTINGS;
  }
  */
  // Check box to toggle iron man options
  usPosY = GIO_IRON_MAN_SETTING_Y - GIO_OFFSET_TO_TOGGLE_BOX_Y;
  for (cnt = 0; cnt < Enum6.NUM_SAVE_OPTIONS; cnt++) {
    RestoreExternBackgroundRect(GIO_IRON_MAN_SETTING_X + GIO_OFFSET_TO_TOGGLE_BOX, usPosY, 34, 29);
    usPosY += GIO_GAP_BN_SETTINGS;
  }
}

function DoneFadeOutForExitGameInitOptionScreen(): void {
  // loop through and get the status of all the buttons
  gGameOptions.fGunNut = GetCurrentGunButtonSetting();
  gGameOptions.fSciFi = GetCurrentGameStyleButtonSetting();
  gGameOptions.ubDifficultyLevel = GetCurrentDifficultyButtonSetting() + 1;
  // JA2Gold: no more timed turns setting
  // gGameOptions.fTurnTimeLimit = GetCurrentTimedTurnsButtonSetting();
  // JA2Gold: iron man
  gGameOptions.fIronManMode = GetCurrentGameSaveButtonSetting();

  //	gubGIOExitScreen = INIT_SCREEN;
  gubGIOExitScreen = Enum26.INTRO_SCREEN;

  // set the fact that we should do the intro videos
//	gbIntroScreenMode = INTRO_BEGINING;
    SetIntroType(Enum21.INTRO_BEGINING);

  ExitGIOScreen();

  //	gFadeInDoneCallback = DoneFadeInForExitGameInitOptionScreen;
  //	FadeInNextFrame( );
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
}

function DoneFadeInForExitGameInitOptionScreen(): void {
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
}

function DoGioMessageBox(ubStyle: UINT8, zString: Pointer<INT16>, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): BOOLEAN {
  let CenteringRect: SGPRect = [ 0, 0, 639, 479 ];

  // reset exit mode
  //	gfExitGioDueToMessageBox = TRUE;

  // do message box and return
  giGioMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, addressof(CenteringRect));

  // send back return state
  return giGioMessageBox != -1;
}

function DisplayMessageToUserAboutGameDifficulty(): void {
  let ubDiffLevel: UINT8 = GetCurrentDifficultyButtonSetting();

  switch (ubDiffLevel) {
    case 0:
      DoGioMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zGioDifConfirmText[Enum381.GIO_CFS_NOVICE], Enum26.GAME_INIT_OPTIONS_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmGioDifSettingMessageBoxCallBack);
      break;
    case 1:
      DoGioMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zGioDifConfirmText[Enum381.GIO_CFS_EXPERIENCED], Enum26.GAME_INIT_OPTIONS_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmGioDifSettingMessageBoxCallBack);
      break;
    case 2:
      DoGioMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zGioDifConfirmText[Enum381.GIO_CFS_EXPERT], Enum26.GAME_INIT_OPTIONS_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmGioDifSettingMessageBoxCallBack);
      break;
  }
}

function ConfirmGioDifSettingMessageBoxCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    gubGameOptionScreenHandler = Enum7.GIO_EXIT;
  }
}

function DisplayMessageToUserAboutIronManMode(): BOOLEAN {
  let ubIronManMode: UINT8 = GetCurrentGameSaveButtonSetting();

  // if the user has selected IRON MAN mode
  if (ubIronManMode) {
    DoGioMessageBox(Enum24.MSG_BOX_BASIC_STYLE, gzIronManModeWarningText[Enum321.IMM__IRON_MAN_MODE_WARNING_TEXT], Enum26.GAME_INIT_OPTIONS_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmGioIronManMessageBoxCallBack);

    return TRUE;
  }

  return FALSE;
}

function ConfirmGioIronManMessageBoxCallBack(bExitValue: UINT8): void {
  if (bExitValue == MSG_BOX_RETURN_YES) {
    gubGameOptionScreenHandler = Enum7.GIO_IRON_MAN_MODE;
  } else {
    ButtonList[guiGameSaveToggles[Enum6.GIO_IRON_MAN]].value.uiFlags &= ~BUTTON_CLICKED_ON;
    ButtonList[guiGameSaveToggles[Enum6.GIO_CAN_SAVE]].value.uiFlags |= BUTTON_CLICKED_ON;
  }
}
