namespace ja2 {

export let gbDefaultLightType: INT8 = Enum39.PRIMETIME_LIGHT;

export let gEditorLightColor: SGPPaletteEntry = createSGPPaletteEntry();

export let gfEditorForceShadeTableRebuild: boolean = false;

export function SetupTextInputForMapInfo(): void {
  let str: string /* UINT16[10] */;

  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);

  AddUserInputField(null); // just so we can use short cut keys while not typing.

  // light rgb fields
  str = swprintf("%d", gEditorLightColor.peRed);
  AddTextInputField(10, 394, 25, 18, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  str = swprintf("%d", gEditorLightColor.peGreen);
  AddTextInputField(10, 414, 25, 18, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  str = swprintf("%d", gEditorLightColor.peBlue);
  AddTextInputField(10, 434, 25, 18, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);

  str = swprintf("%d", gsLightRadius);
  AddTextInputField(120, 394, 25, 18, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
  str = swprintf("%d", gusLightLevel);
  AddTextInputField(120, 414, 25, 18, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);

  // Scroll restriction ID
  if (!gMapInformation.ubRestrictedScrollID)
    str = "";
  else
    str = swprintf("%d", gMapInformation.ubRestrictedScrollID);
  AddTextInputField(210, 420, 30, 20, MSYS_PRIORITY_NORMAL, str, 2, INPUTTYPE_NUMERICSTRICT);

  // exit grid input fields
  str = swprintf("%s%d", String.fromCharCode(gExitGrid.ubGotoSectorY + 'A'.charCodeAt(0) - 1), gExitGrid.ubGotoSectorX);
  AddTextInputField(338, 363, 30, 18, MSYS_PRIORITY_NORMAL, str, 3, Enum383.INPUTTYPE_EXCLUSIVE_COORDINATE);
  str = swprintf("%d", gExitGrid.ubGotoSectorZ);
  AddTextInputField(338, 383, 30, 18, MSYS_PRIORITY_NORMAL, str, 1, INPUTTYPE_NUMERICSTRICT);
  str = swprintf("%d", gExitGrid.usGridNo);
  AddTextInputField(338, 403, 40, 18, MSYS_PRIORITY_NORMAL, str, 5, INPUTTYPE_NUMERICSTRICT);
}

export function UpdateMapInfo(): void {
  SetFont(FONT10ARIAL());
  SetFontShadow(FONT_NEARBLACK);

  SetFontForeground(FONT_RED);
  mprintf(38, 399, "R");
  SetFontForeground(FONT_GREEN);
  mprintf(38, 419, "G");
  SetFontForeground(FONT_DKBLUE);
  mprintf(38, 439, "B");

  SetFontForeground(FONT_YELLOW);
  mprintf(65, 369, "Prime");
  mprintf(65, 382, "Night");
  mprintf(65, 397, "24Hrs");

  SetFontForeground(FONT_YELLOW);
  mprintf(148, 399, "Radius");

  if (!gfBasement && !gfCaves)
    SetFontForeground(FONT_DKYELLOW);
  mprintf(148, 414, "Underground");
  mprintf(148, 423, "Light Level");

  SetFontForeground(FONT_YELLOW);
  mprintf(230, 369, "Outdoors");
  mprintf(230, 384, "Basement");
  mprintf(230, 399, "Caves");

  SetFontForeground(FONT_ORANGE);
  mprintf(250, 420, "Restricted");
  mprintf(250, 430, "Scroll ID");

  SetFontForeground(FONT_YELLOW);
  mprintf(368, 363, "Destination");
  mprintf(368, 372, "Sector");
  mprintf(368, 383, "Destination");
  mprintf(368, 392, "Bsmt. Level");
  mprintf(378, 403, "Dest.");
  mprintf(378, 412, "GridNo");
  SetFontForeground(FONT_RED);
}

export function UpdateMapInfoFields(): void {
  let str: string /* UINT16[10] */;
  // Update the text fields to reflect the validated values.
  // light rgb fields
  str = swprintf("%d", gEditorLightColor.peRed);
  SetInputFieldStringWith16BitString(1, str);
  str = swprintf("%d", gEditorLightColor.peGreen);
  SetInputFieldStringWith16BitString(2, str);
  str = swprintf("%d", gEditorLightColor.peBlue);
  SetInputFieldStringWith16BitString(3, str);

  str = swprintf("%d", gsLightRadius);
  SetInputFieldStringWith16BitString(4, str);
  str = swprintf("%d", gusLightLevel);
  SetInputFieldStringWith16BitString(5, str);

  if (!gMapInformation.ubRestrictedScrollID)
    str = "";
  else
    str = swprintf("%d", gMapInformation.ubRestrictedScrollID);
  SetInputFieldStringWith16BitString(6, str);

  ApplyNewExitGridValuesToTextFields();
}

export function ExtractAndUpdateMapInfo(): void {
  let str: string /* UINT16[10] */;
  let temp: INT32;
  let fUpdateLight1: boolean = false;
  // extract light1 colors
  temp = Math.min(GetNumericStrictValueFromField(1), 255);
  if (temp != -1 && temp != gEditorLightColor.peRed) {
    fUpdateLight1 = true;
    gEditorLightColor.peRed = temp;
  }
  temp = Math.min(GetNumericStrictValueFromField(2), 255);
  if (temp != -1 && temp != gEditorLightColor.peGreen) {
    fUpdateLight1 = true;
    gEditorLightColor.peGreen = temp;
  }
  temp = Math.min(GetNumericStrictValueFromField(3), 255);
  if (temp != -1 && temp != gEditorLightColor.peBlue) {
    fUpdateLight1 = true;
    gEditorLightColor.peBlue = temp;
  }
  if (fUpdateLight1) {
    gfEditorForceShadeTableRebuild = true;
    LightSetColors([gEditorLightColor], 1);
    gfEditorForceShadeTableRebuild = false;
  }

  // extract radius
  temp = Math.max(Math.min(GetNumericStrictValueFromField(4), 8), 1);
  if (temp != -1)
    gsLightRadius = temp;
  temp = Math.max(Math.min(GetNumericStrictValueFromField(5), 15), 1);
  if (temp != -1 && temp != gusLightLevel) {
    gusLightLevel = temp;
    gfRenderWorld = true;
    ubAmbientLightLevel = (EDITOR_LIGHT_MAX - gusLightLevel);
    LightSetBaseLevel(ubAmbientLightLevel);
    LightSpriteRenderAll();
  }

  temp = GetNumericStrictValueFromField(6);
  if (temp == -1)
    gMapInformation.ubRestrictedScrollID = 0;
  else
    gMapInformation.ubRestrictedScrollID = temp;

  // set up fields for exitgrid information
  str = Get16BitStringFromField(7);
  if (str[0] >= 'a' && str[0] <= 'z')
    str = String.fromCharCode(str.charCodeAt(0) - 32) + str.substring(1); // uppercase it!
  if (str[0] >= 'A' && str[0] <= 'Z' && str[1] >= '0' && str[1] <= '9') {
    // only update, if coordinate is valid.
    gExitGrid.ubGotoSectorY = (str.charCodeAt(0) - 'A'.charCodeAt(0) + 1);
    gExitGrid.ubGotoSectorX = (str.charCodeAt(1) - '0'.charCodeAt(0));
    if (str[2] >= '0' && str[2] <= '9')
      gExitGrid.ubGotoSectorX = (gExitGrid.ubGotoSectorX * 10 + str.charCodeAt(2) - '0'.charCodeAt(0));
    gExitGrid.ubGotoSectorX = Math.max(Math.min(gExitGrid.ubGotoSectorX, 16), 1);
    gExitGrid.ubGotoSectorY = Math.max(Math.min(gExitGrid.ubGotoSectorY, 16), 1);
  }
  gExitGrid.ubGotoSectorZ = Math.max(Math.min(GetNumericStrictValueFromField(8), 3), 0);
  gExitGrid.usGridNo = Math.max(Math.min(GetNumericStrictValueFromField(9), 25600), 0);

  UpdateMapInfoFields();
}

export function ApplyNewExitGridValuesToTextFields(): boolean {
  let str: string /* UINT16[10] */;
  // exit grid input fields
  if (iCurrentTaskbar != Enum36.TASK_MAPINFO)
    return false;
  str = swprintf("%s%d", String.fromCharCode(gExitGrid.ubGotoSectorY + 'A'.charCodeAt(0) - 1), gExitGrid.ubGotoSectorX);
  SetInputFieldStringWith16BitString(7, str);
  str = swprintf("%d", gExitGrid.ubGotoSectorZ);
  SetInputFieldStringWith16BitString(8, str);
  str = swprintf("%d", gExitGrid.usGridNo);
  SetInputFieldStringWith16BitString(9, str);
  SetActiveField(0);
  return true;
}

let usCurrentExitGridNo: UINT16 = 0;
export function LocateNextExitGrid(): void {
  let ExitGrid: EXITGRID = createExitGrid();
  let i: UINT16;
  for (i = usCurrentExitGridNo + 1; i < WORLD_MAX; i++) {
    if (GetExitGrid(i, ExitGrid)) {
      usCurrentExitGridNo = i;
      CenterScreenAtMapIndex(i);
      return;
    }
  }
  for (i = 0; i < usCurrentExitGridNo; i++) {
    if (GetExitGrid(i, ExitGrid)) {
      usCurrentExitGridNo = i;
      CenterScreenAtMapIndex(i);
      return;
    }
  }
}

export function ChangeLightDefault(bLightType: INT8): void {
  UnclickEditorButton(Enum32.MAPINFO_PRIMETIME_LIGHT + gbDefaultLightType);
  gbDefaultLightType = bLightType;
  ClickEditorButton(Enum32.MAPINFO_PRIMETIME_LIGHT + gbDefaultLightType);
}

}
