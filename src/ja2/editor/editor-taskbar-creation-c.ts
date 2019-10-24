function InitEditorItemStatsButtons(): void {
  iEditorButton[Enum32.ITEMSTATS_PANEL] = CreateTextButton(0, 0, 0, 0, BUTTON_USE_DEFAULT, 480, 361, 160, 99, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  SpecifyDisabledButtonStyle(iEditorButton[Enum32.ITEMSTATS_PANEL], Enum29.DISABLED_STYLE_NONE);
  DisableButton(iEditorButton[Enum32.ITEMSTATS_PANEL]);
  iEditorButton[Enum32.ITEMSTATS_HIDDEN_BTN] = CreateCheckBoxButton(485, 365, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_NORMAL, ItemStatsToggleHideCallback);
  iEditorButton[Enum32.ITEMSTATS_DELETE_BTN] = CreateTextButton("Delete", FONT10ARIAL(), FONT_RED, FONT_BLACK, BUTTON_USE_DEFAULT, 600, 441, 36, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), ItemStatsDeleteCallback);
}

function InitEditorMercsToolbar(): void {
  let TempString: INT16[] /* [30] */;
  let FaceDirs: Pointer<INT16>[] /* [8] */ = [
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];
  let x: INT32;

  iEditorButton[Enum32.MERCS_PLAYERTOGGLE] = CreateCheckBoxButton(4, 362, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_NORMAL, MercsTogglePlayers);
  if (gfShowPlayers)
    ClickEditorButton(Enum32.MERCS_PLAYERTOGGLE);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_PLAYERTOGGLE], "Toggle viewing of players");
  DisableButton(iEditorButton[Enum32.MERCS_PLAYERTOGGLE]);
  iEditorButton[Enum32.MERCS_ENEMYTOGGLE] = CreateCheckBoxButton(4, 382, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_NORMAL, MercsToggleEnemies);
  if (gfShowEnemies)
    ClickEditorButton(Enum32.MERCS_ENEMYTOGGLE);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_ENEMYTOGGLE], "Toggle viewing of enemies");
  iEditorButton[Enum32.MERCS_CREATURETOGGLE] = CreateCheckBoxButton(4, 402, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_NORMAL, MercsToggleCreatures);
  if (gfShowCreatures)
    ClickEditorButton(Enum32.MERCS_CREATURETOGGLE);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_CREATURETOGGLE], "Toggle viewing of creatures");
  iEditorButton[Enum32.MERCS_REBELTOGGLE] = CreateCheckBoxButton(4, 422, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_NORMAL, MercsToggleRebels);
  if (gfShowRebels)
    ClickEditorButton(Enum32.MERCS_REBELTOGGLE);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_REBELTOGGLE], "Toggle viewing of rebels");
  iEditorButton[Enum32.MERCS_CIVILIANTOGGLE] = CreateCheckBoxButton(4, 442, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_NORMAL, MercsToggleCivilians);
  if (gfShowCivilians)
    ClickEditorButton(Enum32.MERCS_CIVILIANTOGGLE);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_CIVILIANTOGGLE], "Toggle viewing of civilians");
  iEditorButton[Enum32.MERCS_PLAYER] = CreateTextButton("Player", BLOCKFONT(), 165, FONT_BLACK, BUTTON_USE_DEFAULT, 20, 362, 78, 19, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsPlayerTeamCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_PLAYER], FONT_YELLOW, FONT_BLACK);
  DisableButton(iEditorButton[Enum32.MERCS_PLAYER]);
  iEditorButton[Enum32.MERCS_ENEMY] = CreateTextButton("Enemy", BLOCKFONT(), 165, FONT_BLACK, BUTTON_USE_DEFAULT, 20, 382, 78, 19, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsEnemyTeamCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_ENEMY], FONT_YELLOW, FONT_BLACK);
  iEditorButton[Enum32.MERCS_CREATURE] = CreateTextButton("Creature", BLOCKFONT(), 165, FONT_BLACK, BUTTON_USE_DEFAULT, 20, 402, 78, 19, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsCreatureTeamCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_CREATURE], FONT_YELLOW, FONT_BLACK);
  iEditorButton[Enum32.MERCS_REBEL] = CreateTextButton("Rebels", BLOCKFONT(), 165, FONT_BLACK, BUTTON_USE_DEFAULT, 20, 422, 78, 19, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsRebelTeamCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_REBEL], FONT_YELLOW, FONT_BLACK);
  iEditorButton[Enum32.MERCS_CIVILIAN] = CreateTextButton("Civilian", BLOCKFONT(), 165, FONT_BLACK, BUTTON_USE_DEFAULT, 20, 442, 78, 19, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsCivilianTeamCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_CIVILIAN], FONT_YELLOW, FONT_BLACK);

  iEditorButton[Enum32.MERCS_1] = CreateTextButton("DETAILED PLACEMENT", SMALLCOMPFONT(), FONT_ORANGE, 60, BUTTON_USE_DEFAULT, 100, 362, 68, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  DisableButton(iEditorButton[Enum32.MERCS_1]);
  SpecifyDisabledButtonStyle(iEditorButton[Enum32.MERCS_1], Enum29.DISABLED_STYLE_NONE);
  SpecifyButtonTextOffsets(iEditorButton[Enum32.MERCS_1], 20, 4, FALSE);
  SpecifyButtonTextWrappedWidth(iEditorButton[Enum32.MERCS_1], 46);
  iEditorButton[Enum32.MERCS_DETAILEDCHECKBOX] = CreateCheckBoxButton(103, 365, "EDITOR//checkbox.sti", MSYS_PRIORITY_NORMAL, MercsDetailedPlacementCallback);

  iEditorButton[Enum32.MERCS_GENERAL] = CreateEasyToggleButton(100, 382, "EDITOR//MercGeneral.sti", MercsGeneralModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_GENERAL], "General information mode");
  iEditorButton[Enum32.MERCS_APPEARANCE] = CreateEasyToggleButton(134, 382, "EDITOR//MercAppearance.sti", MercsAppearanceModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_APPEARANCE], "Physical appearance mode");
  iEditorButton[Enum32.MERCS_ATTRIBUTES] = CreateEasyToggleButton(100, 408, "EDITOR//MercAttributes.sti", MercsAttributesModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_ATTRIBUTES], "Attributes mode");
  iEditorButton[Enum32.MERCS_INVENTORY] = CreateEasyToggleButton(134, 408, "EDITOR//MercInventory.sti", MercsInventoryModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_INVENTORY], "Inventory mode");
  iEditorButton[Enum32.MERCS_PROFILE] = CreateEasyToggleButton(100, 434, "EDITOR//MercProfile.sti", MercsProfileModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_PROFILE], "Profile ID mode");
  iEditorButton[Enum32.MERCS_SCHEDULE] = CreateEasyToggleButton(134, 434, "EDITOR//MercSchedule.sti", MercsScheduleModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_SCHEDULE], "Schedule mode");
  // Workaround for identical buttons.
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_SCHEDULE], 3, 0xffffffff);
  iEditorButton[Enum32.MERCS_GLOWSCHEDULE] = CreateEasyToggleButton(134, 434, "EDITOR//MercGlowSchedule.sti", MercsScheduleModeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_GLOWSCHEDULE], "Schedule mode");
  HideEditorButton(Enum32.MERCS_GLOWSCHEDULE);

  iEditorButton[Enum32.MERCS_DELETE] = CreateTextButton("DELETE", SMALLCOMPFONT(), FONT_DKBLUE, FONT_BLACK, BUTTON_USE_DEFAULT, 600, 362, 40, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsDeleteCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_DELETE], "Delete currently selected merc (DEL).");
  iEditorButton[Enum32.MERCS_NEXT] = CreateTextButton("NEXT", SMALLCOMPFONT(), FONT_DKBLUE, FONT_BLACK, BUTTON_USE_DEFAULT, 600, 382, 40, 20, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsNextCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_NEXT], "Find next merc (SPACE).");

  // Priority Existance
  iEditorButton[Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX] = CreateCheckBoxButton(170, 365, "EDITOR//checkbox.sti", MSYS_PRIORITY_NORMAL, MercsPriorityExistanceCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_PRIORITYEXISTANCE_CHECKBOX], "Toggle priority existance");

  // If merc has keys
  iEditorButton[Enum32.MERCS_HASKEYS_CHECKBOX] = CreateCheckBoxButton(170, 390, "EDITOR//checkbox.sti", MSYS_PRIORITY_NORMAL, MercsHasKeysCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_HASKEYS_CHECKBOX], "Toggle whether or not placement has/naccess to all doors.");

  // Orders
  iEditorButton[Enum32.MERCS_ORDERS_STATIONARY] = CreateTextButton("STATIONARY", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 368, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_ONGUARD] = CreateTextButton("ON GUARD", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 380, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_ONCALL] = CreateTextButton("ON CALL", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 392, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_SEEKENEMY] = CreateTextButton("SEEK ENEMY", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 404, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_CLOSEPATROL] = CreateTextButton("CLOSE PATROL", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 368, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_FARPATROL] = CreateTextButton("FAR PATROL", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 380, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_POINTPATROL] = CreateTextButton("POINT PATROL", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 392, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  iEditorButton[Enum32.MERCS_ORDERS_RNDPTPATROL] = CreateTextButton("RND PT PATROL", SMALLCOMPFONT(), FONT_GRAY2, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 404, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetOrdersCallback);
  for (x = 0; x < 8; x++) {
    MSYS_SetBtnUserData(iEditorButton[FIRST_MERCS_ORDERS_BUTTON + x], 0, x);
  }

  // Attitudes
  iEditorButton[Enum32.MERCS_ATTITUDE_DEFENSIVE] = CreateTextButton("DEFENSIVE", SMALLCOMPFONT(), FONT_GRAY4, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 424, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetAttitudeCallback);
  iEditorButton[Enum32.MERCS_ATTITUDE_BRAVESOLO] = CreateTextButton("BRAVE SOLO", SMALLCOMPFONT(), FONT_GRAY4, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 436, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetAttitudeCallback);
  iEditorButton[Enum32.MERCS_ATTITUDE_BRAVEAID] = CreateTextButton("BRAVE AID", SMALLCOMPFONT(), FONT_GRAY4, FONT_BLACK, BUTTON_USE_DEFAULT, 200, 448, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetAttitudeCallback);
  iEditorButton[Enum32.MERCS_ATTITUDE_AGGRESSIVE] = CreateTextButton("AGGRESSIVE", SMALLCOMPFONT(), FONT_GRAY4, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 424, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetAttitudeCallback);
  iEditorButton[Enum32.MERCS_ATTITUDE_CUNNINGSOLO] = CreateTextButton("CUNNING SOLO", SMALLCOMPFONT(), FONT_GRAY4, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 436, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetAttitudeCallback);
  iEditorButton[Enum32.MERCS_ATTITUDE_CUNNINGAID] = CreateTextButton("CUNNING AID", SMALLCOMPFONT(), FONT_GRAY4, FONT_BLACK, BUTTON_USE_DEFAULT, 270, 448, 70, 12, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetAttitudeCallback);
  for (x = 0; x < 6; x++) {
    MSYS_SetBtnUserData(iEditorButton[FIRST_MERCS_ATTITUDE_BUTTON + x], 0, x);
  }

  iEditorButton[Enum32.MERCS_DIRECTION_W] = CreateIconButton(giEditMercDirectionIcons[0], 7, BUTTON_USE_DEFAULT, 360, 365, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_NW] = CreateIconButton(giEditMercDirectionIcons[0], 0, BUTTON_USE_DEFAULT, 390, 365, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_N] = CreateIconButton(giEditMercDirectionIcons[0], 1, BUTTON_USE_DEFAULT, 420, 365, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_NE] = CreateIconButton(giEditMercDirectionIcons[0], 2, BUTTON_USE_DEFAULT, 420, 395, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_E] = CreateIconButton(giEditMercDirectionIcons[0], 3, BUTTON_USE_DEFAULT, 420, 425, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_SE] = CreateIconButton(giEditMercDirectionIcons[0], 4, BUTTON_USE_DEFAULT, 390, 425, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_S] = CreateIconButton(giEditMercDirectionIcons[0], 5, BUTTON_USE_DEFAULT, 360, 425, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  iEditorButton[Enum32.MERCS_DIRECTION_SW] = CreateIconButton(giEditMercDirectionIcons[0], 6, BUTTON_USE_DEFAULT, 360, 395, 30, 30, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsDirectionSetCallback);
  for (x = 0; x < 8; x++) {
    swprintf(TempString, "Set merc to face %s", FaceDirs[x]);
    SetButtonFastHelpText(iEditorButton[FIRST_MERCS_DIRECTION_BUTTON + x], TempString);
    MSYS_SetBtnUserData(iEditorButton[FIRST_MERCS_DIRECTION_BUTTON + x], 0, x);
  }

  iEditorButton[Enum32.MERCS_DIRECTION_FIND] = CreateTextButton("Find", FONT12POINT1(), FONT_MCOLOR_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 390, 395, 30, 30, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL + 1, DEFAULT_MOVE_CALLBACK(), MercsFindSelectedMercCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_DIRECTION_FIND], "Find selected merc");

  iEditorButton[Enum32.MERCS_EQUIPMENT_BAD] = CreateTextButton("BAD", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 480, 385, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeEquipmentCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_EQUIPMENT_BAD], FONT_LTRED, FONT_BLACK);
  iEditorButton[Enum32.MERCS_EQUIPMENT_POOR] = CreateTextButton("POOR", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 480, 400, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeEquipmentCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_EQUIPMENT_POOR], FONT_ORANGE, FONT_BLACK);
  iEditorButton[Enum32.MERCS_EQUIPMENT_AVERAGE] = CreateTextButton("AVERAGE", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 480, 415, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeEquipmentCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_EQUIPMENT_AVERAGE], FONT_YELLOW, FONT_BLACK);
  iEditorButton[Enum32.MERCS_EQUIPMENT_GOOD] = CreateTextButton("GOOD", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 480, 430, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeEquipmentCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_EQUIPMENT_GOOD], FONT_LTGREEN, FONT_BLACK);
  iEditorButton[Enum32.MERCS_EQUIPMENT_GREAT] = CreateTextButton("GREAT", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 480, 445, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeEquipmentCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_EQUIPMENT_GREAT], FONT_LTBLUE, FONT_BLACK);
  for (x = 0; x < 5; x++) {
    MSYS_SetBtnUserData(iEditorButton[FIRST_MERCS_REL_EQUIPMENT_BUTTON + x], 0, x);
  }

  iEditorButton[Enum32.MERCS_ATTRIBUTES_BAD] = CreateTextButton("BAD", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 530, 385, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeAttributesCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_ATTRIBUTES_BAD], FONT_LTRED, FONT_BLACK);
  iEditorButton[Enum32.MERCS_ATTRIBUTES_POOR] = CreateTextButton("POOR", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 530, 400, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeAttributesCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_ATTRIBUTES_POOR], FONT_ORANGE, FONT_BLACK);
  iEditorButton[Enum32.MERCS_ATTRIBUTES_AVERAGE] = CreateTextButton("AVERAGE", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 530, 415, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeAttributesCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_ATTRIBUTES_AVERAGE], FONT_YELLOW, FONT_BLACK);
  iEditorButton[Enum32.MERCS_ATTRIBUTES_GOOD] = CreateTextButton("GOOD", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 530, 430, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeAttributesCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_ATTRIBUTES_GOOD], FONT_LTGREEN, FONT_BLACK);
  iEditorButton[Enum32.MERCS_ATTRIBUTES_GREAT] = CreateTextButton("GREAT", SMALLCOMPFONT(), FONT_GRAY1, FONT_BLACK, BUTTON_USE_DEFAULT, 530, 445, 40, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsSetRelativeAttributesCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.MERCS_ATTRIBUTES_GREAT], FONT_LTBLUE, FONT_BLACK);
  for (x = 0; x < 5; x++)
    MSYS_SetBtnUserData(iEditorButton[FIRST_MERCS_REL_ATTRIBUTE_BUTTON + x], 0, x);

  iEditorButton[Enum32.MERCS_ARMY_CODE] = CreateCheckBoxButton(575, 410, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MercsSetEnemyColorCodeCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_ARMY_CODE], 0, Enum262.SOLDIER_CLASS_ARMY);
  iEditorButton[Enum32.MERCS_ADMIN_CODE] = CreateCheckBoxButton(575, 424, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MercsSetEnemyColorCodeCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_ADMIN_CODE], 0, Enum262.SOLDIER_CLASS_ADMINISTRATOR);
  iEditorButton[Enum32.MERCS_ELITE_CODE] = CreateCheckBoxButton(575, 438, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MercsSetEnemyColorCodeCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_ELITE_CODE], 0, Enum262.SOLDIER_CLASS_ELITE);

  iEditorButton[Enum32.MERCS_CIVILIAN_GROUP] = CreateTextButton(gszCivGroupNames[0], SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 574, 410, 60, 25, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsCivilianGroupCallback);

  iEditorButton[Enum32.MERCS_TOGGLECOLOR_BUTTON] = CreateCheckBoxButton(180, 364, "EDITOR//checkbox.sti", MSYS_PRIORITY_NORMAL, MercsToggleColorModeCallback);
  iEditorButton[Enum32.MERCS_HAIRCOLOR_DOWN] = CreateEasyNoToggleButton(200, 364, "EDITOR//leftarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_HAIRCOLOR_UP] = CreateEasyNoToggleButton(360, 364, "EDITOR//rightarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_SKINCOLOR_DOWN] = CreateEasyNoToggleButton(200, 388, "EDITOR//leftarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_SKINCOLOR_UP] = CreateEasyNoToggleButton(360, 388, "EDITOR//rightarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_VESTCOLOR_DOWN] = CreateEasyNoToggleButton(200, 412, "EDITOR//leftarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_VESTCOLOR_UP] = CreateEasyNoToggleButton(360, 412, "EDITOR//rightarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_PANTCOLOR_DOWN] = CreateEasyNoToggleButton(200, 436, "EDITOR//leftarrow.sti", MercsSetColorsCallback);
  iEditorButton[Enum32.MERCS_PANTCOLOR_UP] = CreateEasyNoToggleButton(360, 436, "EDITOR//rightarrow.sti", MercsSetColorsCallback);
  for (x = FIRST_MERCS_COLOR_BUTTON; x < LAST_MERCS_COLOR_BUTTON; x += 2) {
    SetButtonFastHelpText(iEditorButton[x], "Previous color set");
    SetButtonFastHelpText(iEditorButton[x + 1], "Next color set");
    DisableButton(iEditorButton[x]);
    DisableButton(iEditorButton[x + 1]);
  }

  iEditorButton[Enum32.MERCS_BODYTYPE_DOWN] = CreateEasyNoToggleButton(460, 364, "EDITOR//leftarrow.sti", MercsSetBodyTypeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_BODYTYPE_DOWN], "Previous body type");
  iEditorButton[Enum32.MERCS_BODYTYPE_UP] = CreateEasyNoToggleButton(560, 364, "EDITOR//rightarrow.sti", MercsSetBodyTypeCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_BODYTYPE_UP], "Next body type");

  iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE1] = CreateCheckBoxButton(309, 375, "EDITOR//SmCheckBox.sti", MSYS_PRIORITY_NORMAL, MercsScheduleToggleVariance1Callback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE1], "Toggle time variance (+ or - 15 minutes)");
  iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE2] = CreateCheckBoxButton(309, 396, "EDITOR//SmCheckBox.sti", MSYS_PRIORITY_NORMAL, MercsScheduleToggleVariance2Callback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE2], "Toggle time variance (+ or - 15 minutes)");
  iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE3] = CreateCheckBoxButton(309, 417, "EDITOR//SmCheckBox.sti", MSYS_PRIORITY_NORMAL, MercsScheduleToggleVariance3Callback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE3], "Toggle time variance (+ or - 15 minutes)");
  iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE4] = CreateCheckBoxButton(309, 438, "EDITOR//SmCheckBox.sti", MSYS_PRIORITY_NORMAL, MercsScheduleToggleVariance4Callback);
  SetButtonFastHelpText(iEditorButton[Enum32.MERCS_SCHEDULE_VARIANCE4], "Toggle time variance (+ or - 15 minutes)");

  iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1] = CreateTextButton("No action", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 186, 373, 77, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleAction1Callback);
  iEditorButton[Enum32.MERCS_SCHEDULE_ACTION2] = CreateTextButton("No action", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 186, 394, 77, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleAction2Callback);
  iEditorButton[Enum32.MERCS_SCHEDULE_ACTION3] = CreateTextButton("No action", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 186, 415, 77, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleAction3Callback);
  iEditorButton[Enum32.MERCS_SCHEDULE_ACTION4] = CreateTextButton("No action", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 186, 436, 77, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleAction4Callback);

  iEditorButton[Enum32.MERCS_SCHEDULE_DATA1A] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 331, 373, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData1ACallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA1B] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 381, 373, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData1BCallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA2A] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 331, 394, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData2ACallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA2B] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 381, 394, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData2BCallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA3A] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 331, 415, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData3ACallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA3B] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 381, 415, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData3BCallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA4A] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 331, 436, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData4ACallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_DATA4B] = CreateTextButton("", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 381, 436, 40, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleData4BCallback);
  iEditorButton[Enum32.MERCS_SCHEDULE_CLEAR] = CreateTextButton("Clear Schedule", FONT10ARIAL(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 516, 362, 77, 16, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), MercsScheduleClearCallback);
  HideEditorButtons(Enum32.MERCS_SCHEDULE_DATA1A, Enum32.MERCS_SCHEDULE_DATA4B);

  iEditorButton[Enum32.MERCS_HEAD_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 61, MERCPANEL_Y + 0, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_HEAD_SLOT], 0, Enum261.HELMETPOS);
  iEditorButton[Enum32.MERCS_BODY_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 61, MERCPANEL_Y + 22, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_BODY_SLOT], 0, Enum261.VESTPOS);
  iEditorButton[Enum32.MERCS_LEGS_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 62, MERCPANEL_Y + 73, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_LEGS_SLOT], 0, Enum261.LEGPOS);
  iEditorButton[Enum32.MERCS_LEFTHAND_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 12, MERCPANEL_Y + 43, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_LEFTHAND_SLOT], 0, Enum261.HANDPOS);
  iEditorButton[Enum32.MERCS_RIGHTHAND_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 90, MERCPANEL_Y + 42, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_RIGHTHAND_SLOT], 0, Enum261.SECONDHANDPOS);
  iEditorButton[Enum32.MERCS_PACK1_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 166, MERCPANEL_Y + 6, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_PACK1_SLOT], 0, Enum261.BIGPOCK1POS);
  iEditorButton[Enum32.MERCS_PACK2_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 166, MERCPANEL_Y + 29, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_PACK2_SLOT], 0, Enum261.BIGPOCK2POS);
  iEditorButton[Enum32.MERCS_PACK3_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 166, MERCPANEL_Y + 52, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_PACK3_SLOT], 0, Enum261.BIGPOCK3POS);
  iEditorButton[Enum32.MERCS_PACK4_SLOT] = CreateCheckBoxButton(MERCPANEL_X + 166, MERCPANEL_Y + 75, "EDITOR//smCheckbox.sti", MSYS_PRIORITY_NORMAL + 1, MercsInventorySlotCallback);
  MSYS_SetBtnUserData(iEditorButton[Enum32.MERCS_PACK4_SLOT], 0, Enum261.BIGPOCK4POS);
}

function InitEditorBuildingsToolbar(): void {
  iEditorButton[Enum32.BUILDING_TOGGLE_ROOF_VIEW] = CreateTextButton("ROOFS", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 110, 400, 50, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BuildingToggleRoofViewCallback);
  iEditorButton[Enum32.BUILDING_TOGGLE_WALL_VIEW] = CreateTextButton("WALLS", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 110, 415, 50, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BuildingToggleWallViewCallback);
  iEditorButton[Enum32.BUILDING_TOGGLE_INFO_VIEW] = CreateTextButton("ROOM INFO", SMALLCOMPFONT(), FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 110, 430, 50, 15, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BuildingToggleInfoViewCallback);
  // Selection method buttons
  iEditorButton[Enum32.BUILDING_PLACE_WALLS] = CreateEasyToggleButton(180, 370, "EDITOR//wall.sti", BuildingWallCallback);
  // SetButtonFastHelpText(iEditorButton[BUILDING_PLACE_WALLS],L"Place walls using selection method");

  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_WALLS], "Place walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\nPlace walls using selection method\n");

  iEditorButton[Enum32.BUILDING_PLACE_DOORS] = CreateEasyToggleButton(210, 370, "EDITOR//door.sti", BuildingDoorCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_DOORS], "Place doors using selection method");
  iEditorButton[Enum32.BUILDING_PLACE_ROOFS] = CreateEasyToggleButton(240, 370, "EDITOR//roof.sti", BuildingRoofCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_ROOFS], "Place roofs using selection method");
  iEditorButton[Enum32.BUILDING_PLACE_WINDOWS] = CreateEasyToggleButton(180, 400, "EDITOR//window.sti", BuildingWindowCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_WINDOWS], "Place windows using selection method");
  iEditorButton[Enum32.BUILDING_PLACE_BROKEN_WALLS] = CreateEasyToggleButton(210, 400, "EDITOR//crackwall.sti", BuildingCrackWallCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_BROKEN_WALLS], "Place damaged walls using selection method.");
  iEditorButton[Enum32.BUILDING_PLACE_FURNITURE] = CreateEasyToggleButton(240, 400, "EDITOR//decor.sti", BuildingFurnitureCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_FURNITURE], "Place furniture using selection method");
  iEditorButton[Enum32.BUILDING_PLACE_DECALS] = CreateEasyToggleButton(180, 430, "EDITOR//decal.sti", BuildingDecalCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_DECALS], "Place wall decals using selection method");
  iEditorButton[Enum32.BUILDING_PLACE_FLOORS] = CreateEasyToggleButton(210, 430, "EDITOR//floor.sti", BuildingFloorCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_FLOORS], "Place floors using selection method");
  iEditorButton[Enum32.BUILDING_PLACE_TOILETS] = CreateEasyToggleButton(240, 430, "EDITOR//toilet.sti", BuildingToiletCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_PLACE_TOILETS], "Place generic furniture using selection method");

  // Smart method buttons
  iEditorButton[Enum32.BUILDING_SMART_WALLS] = CreateEasyToggleButton(290, 370, "EDITOR//wall.sti", BuildingSmartWallCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_SMART_WALLS], "Place walls using smart method");
  iEditorButton[Enum32.BUILDING_SMART_DOORS] = CreateEasyToggleButton(320, 370, "EDITOR//door.sti", BuildingSmartDoorCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_SMART_DOORS], "Place doors using smart method");
  iEditorButton[Enum32.BUILDING_SMART_WINDOWS] = CreateEasyToggleButton(290, 400, "EDITOR//window.sti", BuildingSmartWindowCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_SMART_WINDOWS], "Place windows using smart method");
  iEditorButton[Enum32.BUILDING_SMART_BROKEN_WALLS] = CreateEasyToggleButton(320, 400, "EDITOR//crackwall.sti", BuildingSmartCrackWallCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_SMART_BROKEN_WALLS], "Place damaged walls using smart method");
  iEditorButton[Enum32.BUILDING_DOORKEY] = CreateEasyToggleButton(290, 430, "EDITOR//key.sti", BuildingDoorKeyCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_DOORKEY], "Lock or trap existing doors");

  iEditorButton[Enum32.BUILDING_NEW_ROOM] = CreateEasyToggleButton(370, 370, "EDITOR//newroom.sti", BuildingNewRoomCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_NEW_ROOM], "Add a new room");
  iEditorButton[Enum32.BUILDING_CAVE_DRAWING] = CreateEasyToggleButton(370, 370, "EDITOR//caves.sti", BuildingCaveDrawingCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_CAVE_DRAWING], "Edit cave walls.");
  iEditorButton[Enum32.BUILDING_SAW_ROOM] = CreateEasyToggleButton(370, 400, "EDITOR//sawroom.sti", BuildingSawRoomCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_SAW_ROOM], "Remove an area from existing building.");
  iEditorButton[Enum32.BUILDING_KILL_BUILDING] = CreateEasyToggleButton(370, 430, "EDITOR//delroom.sti", BuildingKillBuildingCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_KILL_BUILDING], "Remove a building");
  iEditorButton[Enum32.BUILDING_NEW_ROOF] = CreateEasyToggleButton(400, 430, "EDITOR//newroof.sti", BuildingNewRoofCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_NEW_ROOF], "Add/replace building's roof with new flat roof.");
  iEditorButton[Enum32.BUILDING_COPY_BUILDING] = CreateEasyToggleButton(430, 430, "EDITOR//copyroom.sti", BuildingCopyBuildingCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_COPY_BUILDING], "Copy a building");
  iEditorButton[Enum32.BUILDING_MOVE_BUILDING] = CreateEasyToggleButton(460, 430, "EDITOR//moveroom.sti", BuildingMoveBuildingCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_MOVE_BUILDING], "Move a building");
  iEditorButton[Enum32.BUILDING_DRAW_ROOMNUM] = CreateEasyToggleButton(410, 370, "EDITOR//addTileRoom.sti", BuildingDrawRoomNumCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_DRAW_ROOMNUM], "Draw room number");
  iEditorButton[Enum32.BUILDING_ERASE_ROOMNUM] = CreateEasyToggleButton(440, 370, "EDITOR//killTileRoom.sti", BuildingEraseRoomNumCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_ERASE_ROOMNUM], "Erase room numbers");

  iEditorButton[Enum32.BUILDING_TOGGLE_ERASEMODE] = CreateEasyToggleButton(500, 400, "EDITOR//eraser.sti", BtnEraseCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_TOGGLE_ERASEMODE], "Toggle erase mode");
  iEditorButton[Enum32.BUILDING_UNDO] = CreateEasyNoToggleButton(530, 400, "EDITOR//undo.sti", BtnUndoCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_UNDO], "Undo last change");
  iEditorButton[Enum32.BUILDING_CYCLE_BRUSHSIZE] = CreateEasyNoToggleButton(500, 430, "EDITOR//paint.sti", BtnBrushCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.BUILDING_CYCLE_BRUSHSIZE], "Cycle brush size");
}

function InitEditorItemsToolbar(): void {
  SetFontForeground(FONT_MCOLOR_LTRED);
  iEditorButton[Enum32.ITEMS_WEAPONS] = CreateTextButton("Weapons", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 100, 440, 59, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsWeaponsCallback);
  iEditorButton[Enum32.ITEMS_AMMO] = CreateTextButton("Ammo", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 159, 440, 40, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsAmmoCallback);
  iEditorButton[Enum32.ITEMS_ARMOUR] = CreateTextButton("Armour", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 199, 440, 52, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsArmourCallback);
  iEditorButton[Enum32.ITEMS_EXPLOSIVES] = CreateTextButton("Explosives", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 251, 440, 69, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsExplosivesCallback);
  iEditorButton[Enum32.ITEMS_EQUIPMENT1] = CreateTextButton("E1", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 320, 440, 21, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsEquipment1Callback);
  iEditorButton[Enum32.ITEMS_EQUIPMENT2] = CreateTextButton("E2", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 341, 440, 21, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsEquipment2Callback);
  iEditorButton[Enum32.ITEMS_EQUIPMENT3] = CreateTextButton("E3", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 362, 440, 21, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsEquipment3Callback);
  iEditorButton[Enum32.ITEMS_TRIGGERS] = CreateTextButton("Triggers", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 383, 440, 59, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsTriggersCallback);
  iEditorButton[Enum32.ITEMS_KEYS] = CreateTextButton("Keys", BLOCKFONT(), FONT_MCOLOR_DKWHITE, FONT_BLACK, BUTTON_USE_DEFAULT, 442, 440, 38, 20, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK(), ItemsKeysCallback);

  iEditorButton[Enum32.ITEMS_LEFTSCROLL] = CreateEasyNoToggleButton(1, 361, "EDITOR//leftscroll.sti", ItemsLeftScrollCallback);
  iEditorButton[Enum32.ITEMS_RIGHTSCROLL] = CreateEasyNoToggleButton(50, 361, "EDITOR//rightscroll.sti", ItemsRightScrollCallback);
}

function InitEditorMapInfoToolbar(): void {
  iEditorButton[Enum32.MAPINFO_ADD_LIGHT1_SOURCE] = CreateEasyToggleButton(10, 362, "EDITOR//light.sti", BtnDrawLightsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_ADD_LIGHT1_SOURCE], "Add ambient light source");

  iEditorButton[Enum32.MAPINFO_LIGHT_PANEL] = CreateTextButton(0, 0, 0, 0, BUTTON_USE_DEFAULT, 45, 362, 60, 50, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  SpecifyDisabledButtonStyle(iEditorButton[Enum32.MAPINFO_LIGHT_PANEL], Enum29.DISABLED_STYLE_NONE);
  DisableButton(iEditorButton[Enum32.MAPINFO_LIGHT_PANEL]);
  iEditorButton[Enum32.MAPINFO_PRIMETIME_LIGHT] = CreateCheckBoxButton(48, 365, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MapInfoPrimeTimeRadioCallback);
  iEditorButton[Enum32.MAPINFO_NIGHTTIME_LIGHT] = CreateCheckBoxButton(48, 380, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MapInfoNightTimeRadioCallback);
  iEditorButton[Enum32.MAPINFO_24HOUR_LIGHT] = CreateCheckBoxButton(48, 395, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MapInfo24HourTimeRadioCallback);
  ClickEditorButton(gbDefaultLightType + Enum32.MAPINFO_PRIMETIME_LIGHT);

  iEditorButton[Enum32.MAPINFO_TOGGLE_FAKE_LIGHTS] = CreateEasyToggleButton(120, 362, "EDITOR//fakelight.sti", BtnFakeLightCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_TOGGLE_FAKE_LIGHTS], "Toggle fake ambient lights.");

  iEditorButton[Enum32.MAPINFO_RADIO_PANEL] = CreateTextButton(0, 0, 0, 0, BUTTON_USE_DEFAULT, 207, 362, 70, 50, BUTTON_TOGGLE, MSYS_PRIORITY_NORMAL, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  SpecifyDisabledButtonStyle(iEditorButton[Enum32.MAPINFO_RADIO_PANEL], Enum29.DISABLED_STYLE_NONE);
  DisableButton(iEditorButton[Enum32.MAPINFO_RADIO_PANEL]);
  iEditorButton[Enum32.MAPINFO_RADIO_NORMAL] = CreateCheckBoxButton(210, 365, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MapInfoNormalRadioCallback);
  iEditorButton[Enum32.MAPINFO_RADIO_BASEMENT] = CreateCheckBoxButton(210, 380, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MapInfoBasementRadioCallback);
  iEditorButton[Enum32.MAPINFO_RADIO_CAVES] = CreateCheckBoxButton(210, 395, "EDITOR//radiobutton.sti", MSYS_PRIORITY_NORMAL, MapInfoCavesRadioCallback);

  iEditorButton[Enum32.MAPINFO_DRAW_EXITGRIDS] = CreateEasyToggleButton(305, 372, "EDITOR//exitgridbut.sti", MapInfoDrawExitGridCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_DRAW_EXITGRIDS], "Add exit grids (r-clk to query existing).");
  iEditorButton[Enum32.MAPINFO_CYCLE_BRUSHSIZE] = CreateEasyNoToggleButton(420, 430, "EDITOR//paint.sti", BtnBrushCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_CYCLE_BRUSHSIZE], "Cycle brush size");
  iEditorButton[Enum32.MAPINFO_UNDO] = CreateEasyNoToggleButton(510, 430, "EDITOR//undo.sti", BtnUndoCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_UNDO], "Undo last change");
  iEditorButton[Enum32.MAPINFO_TOGGLE_ERASEMODE] = CreateEasyToggleButton(540, 430, "EDITOR//eraser.sti", BtnEraseCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_TOGGLE_ERASEMODE], "Toggle erase mode");

  iEditorButton[Enum32.MAPINFO_NORTH_POINT] = CreateEasyToggleButton(540, 365, "EDITOR//north.sti", MapInfoEntryPointsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_NORTH_POINT], "Specify north point for validation purposes.");

  iEditorButton[Enum32.MAPINFO_WEST_POINT] = CreateEasyToggleButton(525, 386, "EDITOR//west.sti", MapInfoEntryPointsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_WEST_POINT], "Specify west point for validation purposes.");

  iEditorButton[Enum32.MAPINFO_EAST_POINT] = CreateEasyToggleButton(555, 386, "EDITOR//east.sti", MapInfoEntryPointsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_EAST_POINT], "Specify east point for validation purposes.");

  iEditorButton[Enum32.MAPINFO_SOUTH_POINT] = CreateEasyToggleButton(540, 407, "EDITOR//south.sti", MapInfoEntryPointsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_SOUTH_POINT], "Specify south point for validation purposes.");

  iEditorButton[Enum32.MAPINFO_CENTER_POINT] = CreateEasyToggleButton(590, 375, "EDITOR//center.sti", MapInfoEntryPointsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_CENTER_POINT], "Specify center point for validation purposes.");

  iEditorButton[Enum32.MAPINFO_ISOLATED_POINT] = CreateEasyToggleButton(590, 396, "EDITOR//isolated.sti", MapInfoEntryPointsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.MAPINFO_ISOLATED_POINT], "Specify isolated point for validation purposes.");
}

function InitEditorOptionsToolbar(): void {
  iEditorButton[Enum32.OPTIONS_NEW_MAP] = CreateEasyNoToggleButton(71, 401, "EDITOR//new.sti", BtnNewMapCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_NEW_MAP], "New map");

  iEditorButton[Enum32.OPTIONS_NEW_BASEMENT] = CreateEasyNoToggleButton(101, 401, "EDITOR//new.sti", BtnNewBasementCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_NEW_BASEMENT], "New basement");

  iEditorButton[Enum32.OPTIONS_NEW_CAVES] = CreateEasyNoToggleButton(131, 401, "EDITOR//new.sti", BtnNewCavesCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_NEW_CAVES], "New cave level");

  iEditorButton[Enum32.OPTIONS_SAVE_MAP] = CreateEasyNoToggleButton(161, 401, "EDITOR//save.sti", BtnSaveCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_SAVE_MAP], "Save map");

  iEditorButton[Enum32.OPTIONS_LOAD_MAP] = CreateEasyNoToggleButton(191, 401, "EDITOR//load.sti", BtnLoadCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_LOAD_MAP], "Load map");

  iEditorButton[Enum32.OPTIONS_CHANGE_TILESET] = CreateEasyNoToggleButton(221, 401, "EDITOR//tileset.sti", BtnChangeTilesetCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_CHANGE_TILESET], "Select tileset");

  iEditorButton[Enum32.OPTIONS_LEAVE_EDITOR] = CreateEasyNoToggleButton(251, 401, "EDITOR//cancel.sti", BtnCancelCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_LEAVE_EDITOR], "Leave Editor mode");

  iEditorButton[Enum32.OPTIONS_QUIT_GAME] = CreateEasyNoToggleButton(281, 401, "EDITOR//cancel.sti", BtnQuitCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.OPTIONS_QUIT_GAME], "Exit game.");
}

function InitEditorTerrainToolbar(): void {
  iEditorButton[Enum32.TERRAIN_FGROUND_TEXTURES] = CreateEasyToggleButton(100, 400, "EDITOR//downgrid.sti", BtnFgGrndCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_FGROUND_TEXTURES], "Draw ground textures");

  iEditorButton[Enum32.TERRAIN_BGROUND_TEXTURES] = CreateEasyToggleButton(130, 400, "EDITOR//upgrid.sti", BtnBkGrndCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_BGROUND_TEXTURES], "Set map ground textures");

  iEditorButton[Enum32.TERRAIN_PLACE_CLIFFS] = CreateEasyToggleButton(160, 400, "EDITOR//banks.sti", BtnBanksCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_PLACE_CLIFFS], "Place banks and cliffs");

  iEditorButton[Enum32.TERRAIN_PLACE_ROADS] = CreateEasyToggleButton(190, 400, "EDITOR//road.sti", BtnRoadsCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_PLACE_ROADS], "Draw roads");

  iEditorButton[Enum32.TERRAIN_PLACE_DEBRIS] = CreateEasyToggleButton(220, 400, "EDITOR//debris.sti", BtnDebrisCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_PLACE_DEBRIS], "Draw debris");

  iEditorButton[Enum32.TERRAIN_PLACE_TREES] = CreateEasyToggleButton(250, 400, "EDITOR//tree.sti", BtnObjectCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_PLACE_TREES], "Place trees & bushes");

  iEditorButton[Enum32.TERRAIN_PLACE_ROCKS] = CreateEasyToggleButton(280, 400, "EDITOR//num1.sti", BtnObject1Callback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_PLACE_ROCKS], "Place rocks");

  iEditorButton[Enum32.TERRAIN_PLACE_MISC] = CreateEasyToggleButton(310, 400, "EDITOR//num2.sti", BtnObject2Callback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_PLACE_MISC], "Place barrels & other junk");

  iEditorButton[Enum32.TERRAIN_FILL_AREA] = CreateEasyToggleButton(100, 430, "EDITOR//fill.sti", BtnFillCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_FILL_AREA], "Fill area");

  iEditorButton[Enum32.TERRAIN_UNDO] = CreateEasyNoToggleButton(130, 430, "EDITOR//undo.sti", BtnUndoCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_UNDO], "Undo last change");

  iEditorButton[Enum32.TERRAIN_TOGGLE_ERASEMODE] = CreateEasyToggleButton(160, 430, "EDITOR//eraser.sti", BtnEraseCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_TOGGLE_ERASEMODE], "Toggle erase mode");

  iEditorButton[Enum32.TERRAIN_CYCLE_BRUSHSIZE] = CreateEasyNoToggleButton(190, 430, "EDITOR//paint.sti", BtnBrushCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_CYCLE_BRUSHSIZE], "Cycle brush size");

  iEditorButton[Enum32.TERRAIN_RAISE_DENSITY] = CreateEasyNoToggleButton(280, 430, "EDITOR//uparrow.sti", BtnIncBrushDensityCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_RAISE_DENSITY], "Raise brush density");

  iEditorButton[Enum32.TERRAIN_LOWER_DENSITY] = CreateEasyNoToggleButton(350, 430, "EDITOR//downarrow.sti", BtnDecBrushDensityCallback);
  SetButtonFastHelpText(iEditorButton[Enum32.TERRAIN_LOWER_DENSITY], "Lower brush density");
}

function CreateEditorTaskbarInternal(): void {
  // Create the tabs for the editor taskbar
  iEditorButton[Enum32.TAB_TERRAIN] = CreateTextButton("Terrain", SMALLFONT1(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 100, 460, 90, 20, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BUTTON_NO_CALLBACK, TaskTerrainCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.TAB_TERRAIN], FONT_YELLOW, FONT_ORANGE);
  iEditorButton[Enum32.TAB_BUILDINGS] = CreateTextButton("Buildings", SMALLFONT1(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 190, 460, 90, 20, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BUTTON_NO_CALLBACK, TaskBuildingCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.TAB_BUILDINGS], FONT_YELLOW, FONT_ORANGE);
  iEditorButton[Enum32.TAB_ITEMS] = CreateTextButton("Items", SMALLFONT1(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 280, 460, 90, 20, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BUTTON_NO_CALLBACK, TaskItemsCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.TAB_ITEMS], FONT_YELLOW, FONT_ORANGE);
  iEditorButton[Enum32.TAB_MERCS] = CreateTextButton("Mercs", SMALLFONT1(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 370, 460, 90, 20, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BUTTON_NO_CALLBACK, TaskMercsCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.TAB_MERCS], FONT_YELLOW, FONT_ORANGE);
  iEditorButton[Enum32.TAB_MAPINFO] = CreateTextButton("Map Info", SMALLFONT1(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 460, 460, 90, 20, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BUTTON_NO_CALLBACK, TaskMapInfoCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.TAB_MAPINFO], FONT_YELLOW, FONT_ORANGE);
  iEditorButton[Enum32.TAB_OPTIONS] = CreateTextButton("Options", SMALLFONT1(), FONT_LTKHAKI, FONT_DKKHAKI, BUTTON_USE_DEFAULT, 550, 460, 90, 20, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BUTTON_NO_CALLBACK, TaskOptionsCallback);
  SpecifyButtonDownTextColors(iEditorButton[Enum32.TAB_OPTIONS], FONT_YELLOW, FONT_ORANGE);

  // Create the buttons within each tab.
  InitEditorTerrainToolbar();
  InitEditorBuildingsToolbar();
  InitEditorItemsToolbar();
  InitEditorMercsToolbar();
  InitEditorMapInfoToolbar();
  InitEditorOptionsToolbar();
  InitEditorItemStatsButtons();
}
