namespace ja2 {

/////////////////////////////////
//
//	Defines
//
/////////////////////////////////

const OPTIONS_TITLE_FONT = () => FONT14ARIAL();
const OPTIONS_TITLE_COLOR = FONT_MCOLOR_WHITE;

const OPT_MAIN_FONT = () => FONT12ARIAL();
const OPT_MAIN_COLOR = OPT_BUTTON_ON_COLOR; // FONT_MCOLOR_WHITE
const OPT_HIGHLIGHT_COLOR = FONT_MCOLOR_WHITE; // FONT_MCOLOR_LTYELLOW

const OPTIONS_SCREEN_WIDTH = 440;
const OPTIONS_SCREEN_HEIGHT = 400;

const OPTIONS__TOP_LEFT_X = 100;
const OPTIONS__TOP_LEFT_Y = 40;
const OPTIONS__BOTTOM_RIGHT_X = OPTIONS__TOP_LEFT_X + OPTIONS_SCREEN_WIDTH;
const OPTIONS__BOTTOM_RIGHT_Y = OPTIONS__TOP_LEFT_Y + OPTIONS_SCREEN_HEIGHT;

const OPT_SAVE_BTN_X = 51;
const OPT_SAVE_BTN_Y = 438;

const OPT_LOAD_BTN_X = 190;
const OPT_LOAD_BTN_Y = OPT_SAVE_BTN_Y;

const OPT_QUIT_BTN_X = 329;
const OPT_QUIT_BTN_Y = OPT_SAVE_BTN_Y;

const OPT_DONE_BTN_X = 469;
const OPT_DONE_BTN_Y = OPT_SAVE_BTN_Y;

const OPT_GAP_BETWEEN_TOGGLE_BOXES = 31; // 40

// toggle boxes
const OPT_SPACE_BETWEEN_TEXT_AND_TOGGLE_BOX = 30; // 220
const OPT_TOGGLE_TEXT_OFFSET_Y = 2; // 3

const OPT_TOGGLE_BOX_FIRST_COLUMN_X = 265; // 257 //OPT_TOGGLE_BOX_TEXT_X + OPT_SPACE_BETWEEN_TEXT_AND_TOGGLE_BOX
const OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y = 89; // OPT_TOGGLE_BOX_TEXT_Y

const OPT_TOGGLE_BOX_SECOND_COLUMN_X = 428; // OPT_TOGGLE_BOX_TEXT_X + OPT_SPACE_BETWEEN_TEXT_AND_TOGGLE_BOX
const OPT_TOGGLE_BOX_SECOND_COLUMN_START_Y = OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y;

const OPT_TOGGLE_BOX_TEXT_WIDTH = OPT_TOGGLE_BOX_SECOND_COLUMN_X - OPT_TOGGLE_BOX_FIRST_COLUMN_X - 20;

// Text
const OPT_TOGGLE_BOX_FIRST_COL_TEXT_X = OPT_TOGGLE_BOX_FIRST_COLUMN_X + OPT_SPACE_BETWEEN_TEXT_AND_TOGGLE_BOX; // 350
const OPT_TOGGLE_BOX_FIRST_COL_TEXT_Y = OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y; // 100

const OPT_TOGGLE_BOX_SECOND_TEXT_X = OPT_TOGGLE_BOX_SECOND_COLUMN_X + OPT_SPACE_BETWEEN_TEXT_AND_TOGGLE_BOX; // 350
const OPT_TOGGLE_BOX_SECOND_TEXT_Y = OPT_TOGGLE_BOX_SECOND_COLUMN_START_Y; // 100

// Slider bar defines
const OPT_GAP_BETWEEN_SLIDER_BARS = 60;
//#define		OPT_SLIDER_BAR_WIDTH								200
const OPT_SLIDER_BAR_SIZE = 258;

const OPT_SLIDER_TEXT_WIDTH = 45;

const OPT_SOUND_FX_TEXT_X = 38;
const OPT_SOUND_FX_TEXT_Y = 87; // 116//110

const OPT_SPEECH_TEXT_X = 85; // OPT_SOUND_FX_TEXT_X + OPT_SLIDER_TEXT_WIDTH
const OPT_SPEECH_TEXT_Y = OPT_SOUND_FX_TEXT_Y; // OPT_SOUND_FX_TEXT_Y + OPT_GAP_BETWEEN_SLIDER_BARS

const OPT_MUSIC_TEXT_X = 137;
const OPT_MUSIC_TEXT_Y = OPT_SOUND_FX_TEXT_Y; // OPT_SPEECH_TEXT_Y + OPT_GAP_BETWEEN_SLIDER_BARS

const OPT_TEXT_TO_SLIDER_OFFSET_Y = 25;

const OPT_SOUND_EFFECTS_SLIDER_X = 56;
const OPT_SOUND_EFFECTS_SLIDER_Y = 126; // 110 + OPT_TEXT_TO_SLIDER_OFFSET_Y

const OPT_SPEECH_SLIDER_X = 107;
const OPT_SPEECH_SLIDER_Y = OPT_SOUND_EFFECTS_SLIDER_Y;

const OPT_MUSIC_SLIDER_X = 158;
const OPT_MUSIC_SLIDER_Y = OPT_SOUND_EFFECTS_SLIDER_Y;

const OPT_MUSIC_SLIDER_PLAY_SOUND_DELAY = 75;

const OPT_FIRST_COLUMN_TOGGLE_CUT_OFF = 10; // 8

/////////////////////////////////
//
//	Global Variables
//
/////////////////////////////////

let guiOptionBackGroundImage: UINT32;
let guiOptionsAddOnImages: UINT32;

let guiSoundEffectsSliderID: UINT32;
let guiSpeechSliderID: UINT32;
let guiMusicSliderID: UINT32;

let gfOptionsScreenEntry: boolean = true;
let gfOptionsScreenExit: boolean = false;
let gfRedrawOptionsScreen: boolean = true;

let gzSavedGameName: string /* CHAR8[128] */;
let gfEnteredFromMapScreen: boolean = false;

let guiOptionsScreen: UINT32 = Enum26.OPTIONS_SCREEN;
export let guiPreviousOptionScreen: UINT32 = Enum26.OPTIONS_SCREEN;

let gfExitOptionsDueToMessageBox: boolean = false;
let gfExitOptionsAfterMessageBox: boolean = false;

let guiSoundFxSliderMoving: UINT32 = 0xffffffff;
let guiSpeechSliderMoving: UINT32 = 0xffffffff;

let giOptionsMessageBox: INT32 = -1; // Options pop up messages index value

let gbHighLightedOptionText: INT8 = -1;

let gfHideBloodAndGoreOption: boolean = false; // If a germany build we are to hide the blood and gore option
let gubFirstColOfOptions: UINT8 = OPT_FIRST_COLUMN_TOGGLE_CUT_OFF;

let gfSettingOfTreeTopStatusOnEnterOfOptionScreen: boolean;
let gfSettingOfItemGlowStatusOnEnterOfOptionScreen: boolean;
let gfSettingOfDontAnimateSmoke: boolean;

let guiOptGotoSaveGameBtn: UINT32;
let giOptionsButtonImages: INT32;

let guiOptGotoLoadGameBtn: UINT32;
let giGotoLoadBtnImage: INT32;

let guiQuitButton: UINT32;
let giQuitBtnImage: INT32;

let guiDoneButton: UINT32;
let giDoneBtnImage: INT32;

// checkbox to toggle tracking mode on or off
let guiOptionsToggles: UINT32[] /* [NUM_GAME_OPTIONS] */;

// Mouse regions for the name of the option
let gSelectedOptionTextRegion: MOUSE_REGION[] /* [NUM_GAME_OPTIONS] */ = createArrayFrom(Enum8.NUM_GAME_OPTIONS, createMouseRegion);

// Mouse regions for the area around the toggle boxs
let gSelectedToggleBoxAreaRegion: MOUSE_REGION = createMouseRegion();

/////////////////////////////////
//
//	Function ProtoTypes
//
/////////////////////////////////

// ppp

/////////////////////////////////
//
//	Code
//
/////////////////////////////////

export function OptionsScreenInit(): boolean {
  // Set so next time we come in, we can set up
  gfOptionsScreenEntry = true;

  return true;
}

export function OptionsScreenHandle(): UINT32 {
  StartFrameBufferRender();

  if (gfOptionsScreenEntry) {
    PauseGame();
    EnterOptionsScreen();
    gfOptionsScreenEntry = false;
    gfOptionsScreenExit = false;
    gfRedrawOptionsScreen = true;
    RenderOptionsScreen();

    // Blit the background to the save buffer
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, 0, 0, 640, 480);
    InvalidateRegion(0, 0, 640, 480);
  }

  RestoreBackgroundRects();

  GetOptionsScreenUserInput();

  HandleOptionsScreen();

  if (gfRedrawOptionsScreen) {
    RenderOptionsScreen();
    RenderButtons();

    gfRedrawOptionsScreen = false;
  }

  // Render the active slider bars
  RenderAllSliderBars();

  // render buttons marked dirty
  MarkButtonsDirty();
  RenderButtons();

  // ATE: Put here to save RECTS before any fast help being drawn...
  SaveBackgroundRects();
  RenderButtonsFastHelp();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  if (gfOptionsScreenExit) {
    ExitOptionsScreen();
    gfOptionsScreenExit = false;
    gfOptionsScreenEntry = true;

    UnPauseGame();
  }

  return guiOptionsScreen;
}

export function OptionsScreenShutdown(): boolean {
  return true;
}

function EnterOptionsScreen(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let usPosY: UINT16;
  let cnt: UINT8;
  let usTextWidth: UINT16;
  let usTextHeight: UINT16;

  // Default this to off
  gfHideBloodAndGoreOption = false;

  // if we are coming from mapscreen
  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    guiTacticalInterfaceFlags &= ~INTERFACE_MAPSCREEN;
    gfEnteredFromMapScreen = true;
  }

  // Stop ambients...
  StopAmbients();

  guiOptionsScreen = Enum26.OPTIONS_SCREEN;

  // Init the slider bar;
  InitSlider();

  if (gfExitOptionsDueToMessageBox) {
    gfRedrawOptionsScreen = true;
    gfExitOptionsDueToMessageBox = false;
    return true;
  }

  gfExitOptionsDueToMessageBox = false;

  // load the options screen background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\OptionScreenBase.sti");
  if (!(guiOptionBackGroundImage = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load button, title graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_OPTIONHEADER);
  if (!(guiOptionsAddOnImages = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // Save game button
  giOptionsButtonImages = LoadButtonImage("INTERFACE\\OptionScreenAddons.sti", -1, 2, -1, 3, -1);
  guiOptGotoSaveGameBtn = CreateIconAndTextButton(giOptionsButtonImages, zOptionsText[Enum372.OPT_SAVE_GAME], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, OPT_SAVE_BTN_X, OPT_SAVE_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnOptGotoSaveGameCallback);
  SpecifyDisabledButtonStyle(guiOptGotoSaveGameBtn, Enum29.DISABLED_STYLE_HATCHED);
  if (guiPreviousOptionScreen == Enum26.MAINMENU_SCREEN || !CanGameBeSaved()) {
    DisableButton(guiOptGotoSaveGameBtn);
  }

  // Load game button
  giGotoLoadBtnImage = UseLoadedButtonImage(giOptionsButtonImages, -1, 2, -1, 3, -1);
  guiOptGotoLoadGameBtn = CreateIconAndTextButton(giGotoLoadBtnImage, zOptionsText[Enum372.OPT_LOAD_GAME], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, OPT_LOAD_BTN_X, OPT_LOAD_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnOptGotoLoadGameCallback);
  //	SpecifyDisabledButtonStyle( guiBobbyRAcceptOrder, DISABLED_STYLE_SHADED );

  // Quit to main menu button
  giQuitBtnImage = UseLoadedButtonImage(giOptionsButtonImages, -1, 2, -1, 3, -1);
  guiQuitButton = CreateIconAndTextButton(giQuitBtnImage, zOptionsText[Enum372.OPT_MAIN_MENU], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, OPT_QUIT_BTN_X, OPT_QUIT_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnOptQuitCallback);
  SpecifyDisabledButtonStyle(guiQuitButton, Enum29.DISABLED_STYLE_HATCHED);
  //	DisableButton( guiQuitButton );

  // Done button
  giDoneBtnImage = UseLoadedButtonImage(giOptionsButtonImages, -1, 2, -1, 3, -1);
  guiDoneButton = CreateIconAndTextButton(giDoneBtnImage, zOptionsText[Enum372.OPT_DONE], OPT_BUTTON_FONT(), OPT_BUTTON_ON_COLOR, DEFAULT_SHADOW, OPT_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, OPT_DONE_BTN_X, OPT_DONE_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnDoneCallback);
  //	SpecifyDisabledButtonStyle( guiBobbyRAcceptOrder, DISABLED_STYLE_SHADED );

  //
  // Toggle Boxes
  //
  usTextHeight = GetFontHeight(OPT_MAIN_FONT());

  // Create the first column of check boxes
  usPosY = OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y;
  gubFirstColOfOptions = OPT_FIRST_COLUMN_TOGGLE_CUT_OFF;
  for (cnt = 0; cnt < gubFirstColOfOptions; cnt++) {
    // if this is the blood and gore option, and we are to hide the option
    if (cnt == Enum8.TOPTION_BLOOD_N_GORE && gfHideBloodAndGoreOption) {
      gubFirstColOfOptions++;

      // advance to the next
      continue;
    }
    // Check box to toggle tracking mode
    guiOptionsToggles[cnt] = CreateCheckBoxButton(OPT_TOGGLE_BOX_FIRST_COLUMN_X, usPosY, "INTERFACE\\OptionsCheckBoxes.sti", MSYS_PRIORITY_HIGH + 10, BtnOptionsTogglesCallback);
    MSYS_SetBtnUserData(guiOptionsToggles[cnt], 0, cnt);

    usTextWidth = StringPixLength(zOptionsToggleText[cnt], OPT_MAIN_FONT());

    if (usTextWidth > OPT_TOGGLE_BOX_TEXT_WIDTH) {
      // Get how many lines will be used to display the string, without displaying the string
      let ubNumLines: UINT8 = DisplayWrappedString(0, 0, OPT_TOGGLE_BOX_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_HIGHLIGHT_COLOR, zOptionsToggleText[cnt], FONT_MCOLOR_BLACK, true, LEFT_JUSTIFIED | DONT_DISPLAY_TEXT) / GetFontHeight(OPT_MAIN_FONT());

      usTextWidth = OPT_TOGGLE_BOX_TEXT_WIDTH;

      // Create mouse regions for the option toggle text
      MSYS_DefineRegion(gSelectedOptionTextRegion[cnt], OPT_TOGGLE_BOX_FIRST_COLUMN_X + 13, usPosY, (OPT_TOGGLE_BOX_FIRST_COL_TEXT_X + usTextWidth), (usPosY + usTextHeight * ubNumLines), MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, SelectedOptionTextRegionMovementCallBack, SelectedOptionTextRegionCallBack);
      MSYS_AddRegion(gSelectedOptionTextRegion[cnt]);
      MSYS_SetRegionUserData(gSelectedOptionTextRegion[cnt], 0, cnt);
    } else {
      // Create mouse regions for the option toggle text
      MSYS_DefineRegion(gSelectedOptionTextRegion[cnt], OPT_TOGGLE_BOX_FIRST_COLUMN_X + 13, usPosY, (OPT_TOGGLE_BOX_FIRST_COL_TEXT_X + usTextWidth), (usPosY + usTextHeight), MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, SelectedOptionTextRegionMovementCallBack, SelectedOptionTextRegionCallBack);
      MSYS_AddRegion(gSelectedOptionTextRegion[cnt]);
      MSYS_SetRegionUserData(gSelectedOptionTextRegion[cnt], 0, cnt);
    }

    SetRegionFastHelpText(gSelectedOptionTextRegion[cnt], zOptionsScreenHelpText[cnt]);
    SetButtonFastHelpText(guiOptionsToggles[cnt], zOptionsScreenHelpText[cnt]);

    usPosY += OPT_GAP_BETWEEN_TOGGLE_BOXES;
  }

  // Create the 2nd column of check boxes
  usPosY = OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y;
  for (cnt = gubFirstColOfOptions; cnt < Enum8.NUM_GAME_OPTIONS; cnt++) {
    // Check box to toggle tracking mode
    guiOptionsToggles[cnt] = CreateCheckBoxButton(OPT_TOGGLE_BOX_SECOND_COLUMN_X, usPosY, "INTERFACE\\OptionsCheckBoxes.sti", MSYS_PRIORITY_HIGH + 10, BtnOptionsTogglesCallback);
    MSYS_SetBtnUserData(guiOptionsToggles[cnt], 0, cnt);

    //
    // Create mouse regions for the option toggle text
    //

    usTextWidth = StringPixLength(zOptionsToggleText[cnt], OPT_MAIN_FONT());

    if (usTextWidth > OPT_TOGGLE_BOX_TEXT_WIDTH) {
      // Get how many lines will be used to display the string, without displaying the string
      let ubNumLines: UINT8 = DisplayWrappedString(0, 0, OPT_TOGGLE_BOX_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_HIGHLIGHT_COLOR, zOptionsToggleText[cnt], FONT_MCOLOR_BLACK, true, LEFT_JUSTIFIED | DONT_DISPLAY_TEXT) / GetFontHeight(OPT_MAIN_FONT());

      usTextWidth = OPT_TOGGLE_BOX_TEXT_WIDTH;

      MSYS_DefineRegion(gSelectedOptionTextRegion[cnt], OPT_TOGGLE_BOX_SECOND_COLUMN_X + 13, usPosY, (OPT_TOGGLE_BOX_SECOND_TEXT_X + usTextWidth), (usPosY + usTextHeight * ubNumLines), MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, SelectedOptionTextRegionMovementCallBack, SelectedOptionTextRegionCallBack);
      MSYS_AddRegion(gSelectedOptionTextRegion[cnt]);
      MSYS_SetRegionUserData(gSelectedOptionTextRegion[cnt], 0, cnt);
    } else {
      MSYS_DefineRegion(gSelectedOptionTextRegion[cnt], OPT_TOGGLE_BOX_SECOND_COLUMN_X + 13, usPosY, (OPT_TOGGLE_BOX_SECOND_TEXT_X + usTextWidth), (usPosY + usTextHeight), MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, SelectedOptionTextRegionMovementCallBack, SelectedOptionTextRegionCallBack);
      MSYS_AddRegion(gSelectedOptionTextRegion[cnt]);
      MSYS_SetRegionUserData(gSelectedOptionTextRegion[cnt], 0, cnt);
    }

    SetRegionFastHelpText(gSelectedOptionTextRegion[cnt], zOptionsScreenHelpText[cnt]);
    SetButtonFastHelpText(guiOptionsToggles[cnt], zOptionsScreenHelpText[cnt]);

    usPosY += OPT_GAP_BETWEEN_TOGGLE_BOXES;
  }

  // Create a mouse region so when the user leaves a togglebox text region we can detect it then unselect the region
  MSYS_DefineRegion(gSelectedToggleBoxAreaRegion, 0, 0, 640, 480, MSYS_PRIORITY_NORMAL, Enum317.CURSOR_NORMAL, SelectedToggleBoxAreaRegionMovementCallBack, MSYS_NO_CALLBACK);
  MSYS_AddRegion(gSelectedToggleBoxAreaRegion);

  // Render the scene before adding the slider boxes
  RenderOptionsScreen();

  // Add a slider bar for the Sound Effects
  guiSoundEffectsSliderID = AddSlider(Enum329.SLIDER_VERTICAL_STEEL, Enum317.CURSOR_NORMAL, OPT_SOUND_EFFECTS_SLIDER_X, OPT_SOUND_EFFECTS_SLIDER_Y, OPT_SLIDER_BAR_SIZE, 127, MSYS_PRIORITY_HIGH, SoundFXSliderChangeCallBack, 0);
  AssertMsg(guiSoundEffectsSliderID, "Failed to AddSlider");
  SetSliderValue(guiSoundEffectsSliderID, GetSoundEffectsVolume());

  // Add a slider bar for the Speech
  guiSpeechSliderID = AddSlider(Enum329.SLIDER_VERTICAL_STEEL, Enum317.CURSOR_NORMAL, OPT_SPEECH_SLIDER_X, OPT_SPEECH_SLIDER_Y, OPT_SLIDER_BAR_SIZE, 127, MSYS_PRIORITY_HIGH, SpeechSliderChangeCallBack, 0);
  AssertMsg(guiSpeechSliderID, "Failed to AddSlider");
  SetSliderValue(guiSpeechSliderID, GetSpeechVolume());

  // Add a slider bar for the Music
  guiMusicSliderID = AddSlider(Enum329.SLIDER_VERTICAL_STEEL, Enum317.CURSOR_NORMAL, OPT_MUSIC_SLIDER_X, OPT_MUSIC_SLIDER_Y, OPT_SLIDER_BAR_SIZE, 127, MSYS_PRIORITY_HIGH, MusicSliderChangeCallBack, 0);
  AssertMsg(guiMusicSliderID, "Failed to AddSlider");
  SetSliderValue(guiMusicSliderID, MusicGetVolume());

  // Remove the mouse region over the clock
  RemoveMouseRegionForPauseOfClock();

  // Draw the screen
  gfRedrawOptionsScreen = true;

  // Set the option screen toggle boxes
  SetOptionsScreenToggleBoxes();

  DisableScrollMessages();

  // reset
  gbHighLightedOptionText = -1;

  // get the status of the tree top option
  gfSettingOfTreeTopStatusOnEnterOfOptionScreen = gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS];

  // Get the status of the item glow option
  gfSettingOfItemGlowStatusOnEnterOfOptionScreen = gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS];

  gfSettingOfDontAnimateSmoke = gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE];
  return true;
}

function ExitOptionsScreen(): void {
  let cnt: UINT8;

  if (gfExitOptionsDueToMessageBox) {
    gfOptionsScreenExit = false;

    if (!gfExitOptionsAfterMessageBox)
      return;
    gfExitOptionsAfterMessageBox = false;
    gfExitOptionsDueToMessageBox = false;
  }

  // Get the current status of the toggle boxes
  GetOptionsScreenToggleBoxes();
  // The save the current settings to disk
  SaveGameSettings();

  // Create the clock mouse region
  CreateMouseRegionForPauseOfClock(CLOCK_REGION_START_X, CLOCK_REGION_START_Y);

  if (guiOptionsScreen == Enum26.GAME_SCREEN)
    EnterTacticalScreen();

  RemoveButton(guiOptGotoSaveGameBtn);
  RemoveButton(guiOptGotoLoadGameBtn);
  RemoveButton(guiQuitButton);
  RemoveButton(guiDoneButton);

  UnloadButtonImage(giOptionsButtonImages);
  UnloadButtonImage(giGotoLoadBtnImage);
  UnloadButtonImage(giQuitBtnImage);
  UnloadButtonImage(giDoneBtnImage);

  DeleteVideoObjectFromIndex(guiOptionBackGroundImage);
  DeleteVideoObjectFromIndex(guiOptionsAddOnImages);

  // Remove the toggle buttons
  for (cnt = 0; cnt < Enum8.NUM_GAME_OPTIONS; cnt++) {
    // if this is the blood and gore option, and we are to hide the option
    if (cnt == Enum8.TOPTION_BLOOD_N_GORE && gfHideBloodAndGoreOption) {
      // advance to the next
      continue;
    }

    RemoveButton(guiOptionsToggles[cnt]);

    MSYS_RemoveRegion(gSelectedOptionTextRegion[cnt]);
  }

  // REmove the slider bars
  RemoveSliderBar(guiSoundEffectsSliderID);
  RemoveSliderBar(guiSpeechSliderID);
  RemoveSliderBar(guiMusicSliderID);

  MSYS_RemoveRegion(gSelectedToggleBoxAreaRegion);

  ShutDownSlider();

  // if we are coming from mapscreen
  if (gfEnteredFromMapScreen) {
    gfEnteredFromMapScreen = false;
    guiTacticalInterfaceFlags |= INTERFACE_MAPSCREEN;
  }

  // if the user changed the  TREE TOP option, AND a world is loaded
  if (gfSettingOfTreeTopStatusOnEnterOfOptionScreen != gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS] && gfWorldLoaded) {
    SetTreeTopStateForMap();
  }

  // if the user has changed the item glow option AND a world is loaded
  if (gfSettingOfItemGlowStatusOnEnterOfOptionScreen != gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] && gfWorldLoaded) {
    ToggleItemGlow(gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]);
  }

  if (gfSettingOfDontAnimateSmoke != gGameSettings.fOptions[Enum8.TOPTION_ANIMATE_SMOKE] && gfWorldLoaded) {
    UpdateSmokeEffectGraphics();
  }
}

function HandleOptionsScreen(): void {
  HandleSliderBarMovementSounds();

  HandleHighLightedText(true);
}

function RenderOptionsScreen(): void {
  let hPixHandle: HVOBJECT;
  let usPosY: UINT16;
  let cnt: UINT8;
  let usWidth: UINT16 = 0;

  // Get and display the background image
  hPixHandle = GetVideoObject(guiOptionBackGroundImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);

  // Get and display the titla image
  hPixHandle = GetVideoObject(guiOptionsAddOnImages);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 1, 0, 434, VO_BLT_SRCTRANSPARENCY, null);

  //
  // Text for the toggle boxes
  //

  usPosY = OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y + OPT_TOGGLE_TEXT_OFFSET_Y;

  // Display the First column of toggles
  for (cnt = 0; cnt < gubFirstColOfOptions; cnt++) {
    // if this is the blood and gore option, and we are to hide the option
    if (cnt == Enum8.TOPTION_BLOOD_N_GORE && gfHideBloodAndGoreOption) {
      // advance to the next
      continue;
    }

    usWidth = StringPixLength(zOptionsToggleText[cnt], OPT_MAIN_FONT());

    // if the string is going to wrap, move the string up a bit
    if (usWidth > OPT_TOGGLE_BOX_TEXT_WIDTH)
      DisplayWrappedString(OPT_TOGGLE_BOX_FIRST_COL_TEXT_X, usPosY, OPT_TOGGLE_BOX_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_MAIN_COLOR, zOptionsToggleText[cnt], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    else
      DrawTextToScreen(zOptionsToggleText[cnt], OPT_TOGGLE_BOX_FIRST_COL_TEXT_X, usPosY, 0, OPT_MAIN_FONT(), OPT_MAIN_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

    usPosY += OPT_GAP_BETWEEN_TOGGLE_BOXES;
  }

  usPosY = OPT_TOGGLE_BOX_SECOND_COLUMN_START_Y + OPT_TOGGLE_TEXT_OFFSET_Y;
  // Display the 2nd column of toggles
  for (cnt = gubFirstColOfOptions; cnt < Enum8.NUM_GAME_OPTIONS; cnt++) {
    usWidth = StringPixLength(zOptionsToggleText[cnt], OPT_MAIN_FONT());

    // if the string is going to wrap, move the string up a bit
    if (usWidth > OPT_TOGGLE_BOX_TEXT_WIDTH)
      DisplayWrappedString(OPT_TOGGLE_BOX_SECOND_TEXT_X, usPosY, OPT_TOGGLE_BOX_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_MAIN_COLOR, zOptionsToggleText[cnt], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    else
      DrawTextToScreen(zOptionsToggleText[cnt], OPT_TOGGLE_BOX_SECOND_TEXT_X, usPosY, 0, OPT_MAIN_FONT(), OPT_MAIN_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

    usPosY += OPT_GAP_BETWEEN_TOGGLE_BOXES;
  }

  //
  // Text for the Slider Bars
  //

  // Display the Sound Fx text
  DisplayWrappedString(OPT_SOUND_FX_TEXT_X, OPT_SOUND_FX_TEXT_Y, OPT_SLIDER_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_MAIN_COLOR, zOptionsText[Enum372.OPT_SOUND_FX], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // Display the Speech text
  DisplayWrappedString(OPT_SPEECH_TEXT_X, OPT_SPEECH_TEXT_Y, OPT_SLIDER_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_MAIN_COLOR, zOptionsText[Enum372.OPT_SPEECH], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // Display the Music text
  DisplayWrappedString(OPT_MUSIC_TEXT_X, OPT_MUSIC_TEXT_Y, OPT_SLIDER_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_MAIN_COLOR, zOptionsText[Enum372.OPT_MUSIC], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  InvalidateRegion(OPTIONS__TOP_LEFT_X, OPTIONS__TOP_LEFT_Y, OPTIONS__BOTTOM_RIGHT_X, OPTIONS__BOTTOM_RIGHT_Y);
}

function GetOptionsScreenUserInput(): void {
  let Event: InputAtom = createInputAtom();
  let MousePos: POINT = createPoint();

  GetCursorPos(MousePos);

  while (DequeueEvent(Event)) {
    // HOOK INTO MOUSE HOOKS
    switch (Event.usEvent) {
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
      case RIGHT_BUTTON_REPEAT:
        MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_REPEAT:
        MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
    }

    if (!HandleTextInput(Event) && Event.usEvent == KEY_DOWN) {
      switch (Event.usParam) {
        case ESC:
          SetOptionsExitScreen(guiPreviousOptionScreen);
          break;

        // Enter the save game screen
        case 's'.charCodeAt(0):
        case 'S'.charCodeAt(0):
          // if the save game button isnt disabled
          if (ButtonList[guiOptGotoSaveGameBtn].uiFlags & BUTTON_ENABLED) {
            SetOptionsExitScreen(Enum26.SAVE_LOAD_SCREEN);
            gfSaveGame = true;
          }
          break;

        // Enter the Load game screen
        case 'l'.charCodeAt(0):
        case 'L'.charCodeAt(0):
          SetOptionsExitScreen(Enum26.SAVE_LOAD_SCREEN);
          gfSaveGame = false;
          break;
      }
    }
  }
}

function SetOptionsExitScreen(uiExitScreen: UINT32): void {
  guiOptionsScreen = uiExitScreen;
  gfOptionsScreenExit = true;
}

function BtnOptGotoSaveGameCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);

    SetOptionsExitScreen(Enum26.SAVE_LOAD_SCREEN);
    gfSaveGame = true;

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnOptGotoLoadGameCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);

    SetOptionsExitScreen(Enum26.SAVE_LOAD_SCREEN);
    gfSaveGame = false;

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnOptQuitCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);

    // Confirm the Exit to the main menu screen
    DoOptionsMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zOptionsText[Enum372.OPT_RETURN_TO_MAIN], Enum26.OPTIONS_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmQuitToMainMenuMessageBoxCallBack);

    ///		SetOptionsExitScreen( MAINMENU_SCREEN );

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnDoneCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);

    SetOptionsExitScreen(guiPreviousOptionScreen);

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnOptionsTogglesCallback(btn: GUI_BUTTON, reason: INT32): void {
  let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      HandleOptionToggle(ubButton, true, false, false);

      //			gGameSettings.fOptions[ ubButton ] = TRUE;
      btn.uiFlags |= BUTTON_CLICKED_ON;
    } else {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      HandleOptionToggle(ubButton, false, false, false);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      HandleOptionToggle(ubButton, true, true, false);

      btn.uiFlags |= BUTTON_CLICKED_ON;
    } else {
      btn.uiFlags &= ~BUTTON_CLICKED_ON;

      HandleOptionToggle(ubButton, false, true, false);
    }
  }
}

function HandleOptionToggle(ubButton: UINT8, fState: boolean, fDown: boolean, fPlaySound: boolean): void {
  /* static */ let uiOptionToggleSound: UINT32 = NO_SAMPLE;
  let uiSideToPlaySoundOn: UINT32 = MIDDLEPAN;
  //	static	BOOLEAN	fCheckBoxDrawnDownLastTime = FALSE;

  if (fState) {
    gGameSettings.fOptions[ubButton] = true;

    ButtonList[guiOptionsToggles[ubButton]].uiFlags |= BUTTON_CLICKED_ON;

    if (fDown)
      DrawCheckBoxButtonOn(guiOptionsToggles[ubButton]);
  } else {
    gGameSettings.fOptions[ubButton] = false;

    ButtonList[guiOptionsToggles[ubButton]].uiFlags &= ~BUTTON_CLICKED_ON;

    if (fDown)
      DrawCheckBoxButtonOff(guiOptionsToggles[ubButton]);

    // check to see if the user is unselecting either the spech or subtitles toggle
    if (ubButton == Enum8.TOPTION_SPEECH || ubButton == Enum8.TOPTION_SUBTITLES) {
      // make sure that at least of of the toggles is still enabled
      if (!(ButtonList[guiOptionsToggles[Enum8.TOPTION_SPEECH]].uiFlags & BUTTON_CLICKED_ON)) {
        if (!(ButtonList[guiOptionsToggles[Enum8.TOPTION_SUBTITLES]].uiFlags & BUTTON_CLICKED_ON)) {
          gGameSettings.fOptions[ubButton] = true;
          ButtonList[guiOptionsToggles[ubButton]].uiFlags |= BUTTON_CLICKED_ON;

          // Confirm the Exit to the main menu screen
          DoOptionsMessageBox(Enum24.MSG_BOX_BASIC_STYLE, zOptionsText[Enum372.OPT_NEED_AT_LEAST_SPEECH_OR_SUBTITLE_OPTION_ON], Enum26.OPTIONS_SCREEN, MSG_BOX_FLAG_OK, null);
          gfExitOptionsDueToMessageBox = false;
        }
      }
    }
  }

  // stop the sound if
  //	if( SoundIsPlaying( uiOptionToggleSound ) && !fDown )
  { SoundStop(uiOptionToggleSound); }

  if (fPlaySound) {
    if (fDown) {
      //				case BTN_SND_CLICK_OFF:
      PlayJA2Sample(Enum330.BIG_SWITCH3_IN, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
    } else {
      //		case BTN_SND_CLICK_ON:
      PlayJA2Sample(Enum330.BIG_SWITCH3_OUT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
    }
  }
}

function SoundFXSliderChangeCallBack(iNewValue: INT32): void {
  SetSoundEffectsVolume(iNewValue);

  guiSoundFxSliderMoving = GetJA2Clock();
}

function SpeechSliderChangeCallBack(iNewValue: INT32): void {
  SetSpeechVolume(iNewValue);

  guiSpeechSliderMoving = GetJA2Clock();
}

function MusicSliderChangeCallBack(iNewValue: INT32): void {
  MusicSetVolume(iNewValue);
}

export function DoOptionsMessageBoxWithRect(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK | null, pCenteringRect: SGPRect): boolean {
  // reset exit mode
  gfExitOptionsDueToMessageBox = true;

  // do message box and return
  giOptionsMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, pCenteringRect);

  // send back return state
  return giOptionsMessageBox != -1;
}

function DoOptionsMessageBox(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK | null): boolean {
  let CenteringRect: SGPRect = createSGPRectFrom(0, 0, 639, 479);

  // reset exit mode
  gfExitOptionsDueToMessageBox = true;

  // do message box and return
  giOptionsMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, CenteringRect);

  // send back return state
  return giOptionsMessageBox != -1;
}

function ConfirmQuitToMainMenuMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, Quit to main menu
  if (bExitValue == MSG_BOX_RETURN_YES) {
    gfEnteredFromMapScreen = false;
    gfExitOptionsAfterMessageBox = true;
    SetOptionsExitScreen(Enum26.MAINMENU_SCREEN);

    // We want to reinitialize the game
    ReStartingGame();
  } else {
    gfExitOptionsAfterMessageBox = false;
    gfExitOptionsDueToMessageBox = false;
  }
}

function SetOptionsScreenToggleBoxes(): void {
  let cnt: UINT8;

  for (cnt = 0; cnt < Enum8.NUM_GAME_OPTIONS; cnt++) {
    if (gGameSettings.fOptions[cnt])
      ButtonList[guiOptionsToggles[cnt]].uiFlags |= BUTTON_CLICKED_ON;
    else
      ButtonList[guiOptionsToggles[cnt]].uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function GetOptionsScreenToggleBoxes(): void {
  let cnt: UINT8;

  for (cnt = 0; cnt < Enum8.NUM_GAME_OPTIONS; cnt++) {
    if (ButtonList[guiOptionsToggles[cnt]].uiFlags & BUTTON_CLICKED_ON)
      gGameSettings.fOptions[cnt] = true;
    else
      gGameSettings.fOptions[cnt] = false;
  }
}

function HandleSliderBarMovementSounds(): void {
  /* static */ let uiLastSoundFxTime: UINT32 = 0;
  /* static */ let uiLastSpeechTime: UINT32 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();
  /* static */ let uiLastPlayingSoundID: UINT32 = NO_SAMPLE;
  /* static */ let uiLastPlayingSpeechID: UINT32 = NO_SAMPLE;

  if ((uiLastSoundFxTime - OPT_MUSIC_SLIDER_PLAY_SOUND_DELAY) > guiSoundFxSliderMoving) {
    guiSoundFxSliderMoving = 0xffffffff;

    // The slider has stopped moving, reset the ambient sector sounds ( so it will change the volume )
    if (!DidGameJustStart())
      HandleNewSectorAmbience(gTilesets[giCurrentTilesetID].ubAmbientID);

    if (!SoundIsPlaying(uiLastPlayingSoundID))
      uiLastPlayingSoundID = PlayJA2SampleFromFile("Sounds\\Weapons\\LMG Reload.wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  } else
    uiLastSoundFxTime = GetJA2Clock();

  if ((uiLastSpeechTime - OPT_MUSIC_SLIDER_PLAY_SOUND_DELAY) > guiSpeechSliderMoving) {
    guiSpeechSliderMoving = 0xffffffff;

    if (!SoundIsPlaying(uiLastPlayingSpeechID))
      uiLastPlayingSpeechID = PlayJA2GapSample("BattleSnds\\m_cool.wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN, null);
  } else
    uiLastSpeechTime = GetJA2Clock();
}

function SelectedOptionTextRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  let ubButton: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    HandleOptionToggle(ubButton, (!gGameSettings.fOptions[ubButton]), false, true);

    InvalidateRegion(pRegion.RegionTopLeftX, pRegion.RegionTopLeftY, pRegion.RegionBottomRightX, pRegion.RegionBottomRightY);
  }

  else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) // iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT ||
  {
    if (gGameSettings.fOptions[ubButton]) {
      HandleOptionToggle(ubButton, true, true, true);
    } else {
      HandleOptionToggle(ubButton, false, true, true);
    }
  }
}

function SelectedOptionTextRegionMovementCallBack(pRegion: MOUSE_REGION, reason: INT32): void {
  let bButton: INT8 = MSYS_GetRegionUserData(pRegion, 0);

  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    HandleHighLightedText(false);

    gbHighLightedOptionText = -1;

    InvalidateRegion(pRegion.RegionTopLeftX, pRegion.RegionTopLeftY, pRegion.RegionBottomRightX, pRegion.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    gbHighLightedOptionText = bButton;

    InvalidateRegion(pRegion.RegionTopLeftX, pRegion.RegionTopLeftY, pRegion.RegionBottomRightX, pRegion.RegionBottomRightY);
  }
}

function HandleHighLightedText(fHighLight: boolean): void {
  let usPosX: UINT16 = 0;
  let usPosY: UINT16 = 0;
  let ubCnt: UINT8;
  let bHighLight: INT8 = -1;
  let usWidth: UINT16;

  /* static */ let bLastRegion: INT8 = -1;

  if (gbHighLightedOptionText == -1)
    fHighLight = false;

  // if the user has the mouse in one of the checkboxes
  for (ubCnt = 0; ubCnt < Enum8.NUM_GAME_OPTIONS; ubCnt++) {
    if (ubCnt == Enum8.TOPTION_BLOOD_N_GORE && gfHideBloodAndGoreOption) {
      // advance to the next
      continue;
    }

    if (ButtonList[guiOptionsToggles[ubCnt]].Area.uiFlags & MSYS_MOUSE_IN_AREA) {
      gbHighLightedOptionText = ubCnt;
      fHighLight = true;
    }
  }

  // If there is a valid section being highlighted
  if (gbHighLightedOptionText != -1) {
    bLastRegion = gbHighLightedOptionText;
  }

  bHighLight = gbHighLightedOptionText;

  if (bLastRegion != -1 && gbHighLightedOptionText == -1) {
    fHighLight = false;
    bHighLight = bLastRegion;
    bLastRegion = -1;
  }

  // If we are to hide the blood and gore option, and we are to highlight an option past the blood and gore option
  // reduce the highlight number by 1
  if (bHighLight >= Enum8.TOPTION_BLOOD_N_GORE && gfHideBloodAndGoreOption) {
    bHighLight--;
  }

  if (bHighLight != -1) {
    if (bHighLight < OPT_FIRST_COLUMN_TOGGLE_CUT_OFF) {
      usPosX = OPT_TOGGLE_BOX_FIRST_COL_TEXT_X;
      usPosY = OPT_TOGGLE_BOX_FIRST_COLUMN_START_Y + OPT_TOGGLE_TEXT_OFFSET_Y + (bHighLight * OPT_GAP_BETWEEN_TOGGLE_BOXES);
    } else {
      usPosX = OPT_TOGGLE_BOX_SECOND_TEXT_X;
      usPosY = OPT_TOGGLE_BOX_SECOND_COLUMN_START_Y + OPT_TOGGLE_TEXT_OFFSET_Y + ((bHighLight - OPT_FIRST_COLUMN_TOGGLE_CUT_OFF) * OPT_GAP_BETWEEN_TOGGLE_BOXES);
    }

    // If we are to hide the blood and gore option, and we are to highlight an option past the blood and gore option
    // reduce the highlight number by 1
    if (bHighLight >= Enum8.TOPTION_BLOOD_N_GORE && gfHideBloodAndGoreOption) {
      bHighLight++;
    }

    usWidth = StringPixLength(zOptionsToggleText[bHighLight], OPT_MAIN_FONT());

    // if the string is going to wrap, move the string up a bit
    if (usWidth > OPT_TOGGLE_BOX_TEXT_WIDTH) {
      if (fHighLight)
        DisplayWrappedString(usPosX, usPosY, OPT_TOGGLE_BOX_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_HIGHLIGHT_COLOR, zOptionsToggleText[bHighLight], FONT_MCOLOR_BLACK, true, LEFT_JUSTIFIED);
      //				DrawTextToScreen( zOptionsToggleText[ bHighLight ], usPosX, usPosY, 0, OPT_MAIN_FONT, OPT_HIGHLIGHT_COLOR, FONT_MCOLOR_BLACK, TRUE, LEFT_JUSTIFIED	);
      else
        DisplayWrappedString(usPosX, usPosY, OPT_TOGGLE_BOX_TEXT_WIDTH, 2, OPT_MAIN_FONT(), OPT_MAIN_COLOR, zOptionsToggleText[bHighLight], FONT_MCOLOR_BLACK, true, LEFT_JUSTIFIED);
      //				DrawTextToScreen( zOptionsToggleText[ bHighLight ], usPosX, usPosY, 0, OPT_MAIN_FONT, OPT_MAIN_COLOR, FONT_MCOLOR_BLACK, TRUE, LEFT_JUSTIFIED	);
    } else {
      if (fHighLight)
        DrawTextToScreen(zOptionsToggleText[bHighLight], usPosX, usPosY, 0, OPT_MAIN_FONT(), OPT_HIGHLIGHT_COLOR, FONT_MCOLOR_BLACK, true, LEFT_JUSTIFIED);
      else
        DrawTextToScreen(zOptionsToggleText[bHighLight], usPosX, usPosY, 0, OPT_MAIN_FONT(), OPT_MAIN_COLOR, FONT_MCOLOR_BLACK, true, LEFT_JUSTIFIED);
    }
  }
}

function SelectedToggleBoxAreaRegionMovementCallBack(pRegion: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    let ubCnt: UINT8;

    // loop through all the toggle box's and remove the in area flag
    for (ubCnt = 0; ubCnt < Enum8.NUM_GAME_OPTIONS; ubCnt++) {
      ButtonList[guiOptionsToggles[ubCnt]].Area.uiFlags &= ~MSYS_MOUSE_IN_AREA;
    }

    gbHighLightedOptionText = -1;

    InvalidateRegion(pRegion.RegionTopLeftX, pRegion.RegionTopLeftY, pRegion.RegionBottomRightX, pRegion.RegionBottomRightY);
  }
}

}
