namespace ja2 {

// Message box flags
export const MSG_BOX_FLAG_USE_CENTERING_RECT = 0x0001; // Pass in a rect to center in
export const MSG_BOX_FLAG_OK = 0x0002; // Displays OK button
export const MSG_BOX_FLAG_YESNO = 0x0004; // Displays YES NO buttons
export const MSG_BOX_FLAG_CANCEL = 0x0008; // Displays YES NO buttons
export const MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS = 0x0010; // Displays four numbered buttons, 1-4
export const MSG_BOX_FLAG_YESNOCONTRACT = 0x0020; // yes no and contract buttons
export const MSG_BOX_FLAG_OKCONTRACT = 0x0040; // ok and contract buttons
export const MSG_BOX_FLAG_YESNOLIE = 0x0080; // ok and contract buttons
export const MSG_BOX_FLAG_CONTINUESTOP = 0x0100; // continue stop box
export const MSG_BOX_FLAG_OKSKIP = 0x0200; // Displays ok or skip (meanwhile) buttons
export const MSG_BOX_FLAG_GENERICCONTRACT = 0x0400; // displays contract buttoin + 2 user-defined text buttons
export const MSG_BOX_FLAG_GENERIC = 0x0800; // 2 user-defined text buttons

// message box return codes
export const MSG_BOX_RETURN_OK = 1; // ENTER or on OK button
export const MSG_BOX_RETURN_YES = 2; // ENTER or YES button
export const MSG_BOX_RETURN_NO = 3; // ESC, Right Click or NO button
export const MSG_BOX_RETURN_CONTRACT = 4; // contract button
export const MSG_BOX_RETURN_LIE = 5; // LIE BUTTON

// message box style flags
export const enum Enum24 {
  MSG_BOX_BASIC_STYLE = 0, // We'll have other styles, like in laptop, etc
                           // Graphics are all that are required here...
  MSG_BOX_RED_ON_WHITE,
  MSG_BOX_BLUE_ON_GREY,
  MSG_BOX_BASIC_SMALL_BUTTONS,
  MSG_BOX_IMP_STYLE,
  MSG_BOX_LAPTOP_DEFAULT,
}

export type MSGBOX_CALLBACK = (bExitValue: UINT8) => void;

export interface MESSAGE_BOX_STRUCT {
  usFlags: UINT16;
  uiExitScreen: UINT32;
  ExitCallback: MSGBOX_CALLBACK | null;
  sX: INT16;
  sY: INT16;
  uiSaveBuffer: UINT32;
  BackRegion: MOUSE_REGION;
  usWidth: UINT16;
  usHeight: UINT16;
  iButtonImages: INT32;
  /* union { */
  /*   struct { */
  uiOKButton: UINT32;
  uiYESButton: UINT32;
  uiNOButton: UINT32;
  uiUnusedButton: UINT32;
  /*   } */
  /*   struct { */
  uiButton: UINT32[] /* [4] */;
  /*   } */
  /* } */
  fRenderBox: boolean;
  bHandled: INT8;
  iBoxId: INT32;
}

class _MESSAGE_BOX_STRUCT implements MESSAGE_BOX_STRUCT {
  public usFlags: UINT16;
  public uiExitScreen: UINT32;
  public ExitCallback: MSGBOX_CALLBACK | null;
  public sX: INT16;
  public sY: INT16;
  public uiSaveBuffer: UINT32;
  public BackRegion: MOUSE_REGION;
  public usWidth: UINT16;
  public usHeight: UINT16;
  public iButtonImages: INT32;
  public uiButton: UINT32[] /* [4] */;
  public fRenderBox: boolean;
  public bHandled: INT8;
  public iBoxId: INT32;

  constructor() {
    this.usFlags = 0;
    this.uiExitScreen = 0;
    this.ExitCallback = null;
    this.sX = 0;
    this.sY = 0;
    this.uiSaveBuffer = 0;
    this.BackRegion = createMouseRegion();
    this.usWidth = 0;
    this.usHeight = 0;
    this.iButtonImages = 0;
    this.uiButton = createArray(4, 0);
    this.fRenderBox = false;
    this.bHandled = 0;
    this.iBoxId = 0;
  }

  get uiOKButton() {
    return this.uiButton[0];
  }

  set uiOKButton(value) {
    this.uiButton[0] = value;
  }

  get uiYESButton() {
    return this.uiButton[1];
  }

  set uiYESButton(value) {
    this.uiButton[1] = value;
  }

  get uiNOButton() {
    return this.uiButton[2];
  }

  set uiNOButton(value) {
    this.uiButton[2] = value;
  }

  get uiUnusedButton() {
    return this.uiButton[3];
  }

  set uiUnusedButton(value) {
    this.uiButton[3] = value;
  }
}

export function createMessageBoxStruct(): MESSAGE_BOX_STRUCT {
  return new _MESSAGE_BOX_STRUCT();
}

////////////////////////////////
// ubStyle:				Determines the look of graphics including buttons
// zString:				16-bit string
// uiExitScreen		The screen to exit to
// ubFlags				Some flags for button style
// ReturnCallback	Callback for return. Can be NULL. Returns any above return value
// pCenteringRect	Rect to send if MSG_BOX_FLAG_USE_CENTERING_RECT set. Can be NULL
////////////////////////////////

}
