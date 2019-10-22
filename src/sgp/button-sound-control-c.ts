function SpecifyButtonSoundScheme(iButtonID: INT32, bSoundScheme: INT8): void {
  ButtonList[iButtonID].value.ubSoundSchemeID = bSoundScheme;
  if (bSoundScheme == BUTTON_SOUND_SCHEME_GENERIC) {
    switch (guiCurrentScreen) {
      case MAINMENU_SCREEN:
      case OPTIONS_SCREEN:
      case LOADSAVE_SCREEN:
      case SAVE_LOAD_SCREEN:
      case INIT_SCREEN:
        ButtonList[iButtonID].value.ubSoundSchemeID = BUTTON_SOUND_SCHEME_BIGSWITCH3;
        break;

      case LAPTOP_SCREEN:
        ButtonList[iButtonID].value.ubSoundSchemeID = BUTTON_SOUND_SCHEME_COMPUTERBEEP2;
        break;

      case AUTORESOLVE_SCREEN:
      case MAP_SCREEN:
      case GAME_SCREEN:
      case SHOPKEEPER_SCREEN:
        ButtonList[iButtonID].value.ubSoundSchemeID = BUTTON_SOUND_SCHEME_SMALLSWITCH2;
        break;

      case GAME_INIT_OPTIONS_SCREEN:
        ButtonList[iButtonID].value.ubSoundSchemeID = BUTTON_SOUND_SCHEME_VERYSMALLSWITCH2;
        break;

        // Anything not handled gets NO sound.
        // SHOPKEEPER_SCREEN,
        // GAME_SCREEN,
        // MSG_BOX_SCREEN,

        // ERROR_SCREEN,
        // ANIEDIT_SCREEN,
        // PALEDIT_SCREEN,
        // DEBUG_SCREEN,
        // SEX_SCREEN,
    }
    if (bSoundScheme == BUTTON_SOUND_SCHEME_GENERIC)
      bSoundScheme = BUTTON_SOUND_SCHEME_NONE;
  }
}

function PlayButtonSound(iButtonID: INT32, iSoundType: INT32): void {
  if (ButtonList[iButtonID] == NULL) {
    return;
  }

  switch (ButtonList[iButtonID].value.ubSoundSchemeID) {
    case BUTTON_SOUND_SCHEME_NONE:
    case BUTTON_SOUND_SCHEME_GENERIC:
      break;

    case BUTTON_SOUND_SCHEME_VERYSMALLSWITCH1:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(VSM_SWITCH1_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(VSM_SWITCH1_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_VERYSMALLSWITCH2:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(VSM_SWITCH2_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(VSM_SWITCH2_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_SMALLSWITCH1:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(SM_SWITCH1_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(SM_SWITCH1_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_SMALLSWITCH2:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(SM_SWITCH2_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(SM_SWITCH2_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_SMALLSWITCH3:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(SM_SWITCH3_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(SM_SWITCH3_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_BIGSWITCH3:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(BIG_SWITCH3_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(BIG_SWITCH3_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_COMPUTERBEEP2:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(COMPUTER_BEEP2_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(COMPUTER_BEEP2_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
    case BUTTON_SOUND_SCHEME_COMPUTERSWITCH1:
      switch (iSoundType) {
        case BUTTON_SOUND_CLICKED_ON:
          PlayJA2Sample(COMPUTER_SWITCH1_IN, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_CLICKED_OFF:
          PlayJA2Sample(COMPUTER_SWITCH1_OUT, RATE_11025, 15, 1, MIDDLEPAN);
          break;
        case BUTTON_SOUND_DISABLED_CLICK:
          PlayJA2SampleFromFile("Sounds\\Disabled Button.wav", RATE_11025, 15, 1, MIDDLEPAN);
          break;
      }
      break;
  }
}
