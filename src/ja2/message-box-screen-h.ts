// Message box flags
const MSG_BOX_FLAG_USE_CENTERING_RECT = 0x0001; // Pass in a rect to center in
const MSG_BOX_FLAG_OK = 0x0002; // Displays OK button
const MSG_BOX_FLAG_YESNO = 0x0004; // Displays YES NO buttons
const MSG_BOX_FLAG_CANCEL = 0x0008; // Displays YES NO buttons
const MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS = 0x0010; // Displays four numbered buttons, 1-4
const MSG_BOX_FLAG_YESNOCONTRACT = 0x0020; // yes no and contract buttons
const MSG_BOX_FLAG_OKCONTRACT = 0x0040; // ok and contract buttons
const MSG_BOX_FLAG_YESNOLIE = 0x0080; // ok and contract buttons
const MSG_BOX_FLAG_CONTINUESTOP = 0x0100; // continue stop box
const MSG_BOX_FLAG_OKSKIP = 0x0200; // Displays ok or skip (meanwhile) buttons
const MSG_BOX_FLAG_GENERICCONTRACT = 0x0400; // displays contract buttoin + 2 user-defined text buttons
const MSG_BOX_FLAG_GENERIC = 0x0800; // 2 user-defined text buttons

// message box return codes
const MSG_BOX_RETURN_OK = 1; // ENTER or on OK button
const MSG_BOX_RETURN_YES = 2; // ENTER or YES button
const MSG_BOX_RETURN_NO = 3; // ESC, Right Click or NO button
const MSG_BOX_RETURN_CONTRACT = 4; // contract button
const MSG_BOX_RETURN_LIE = 5; // LIE BUTTON

// message box style flags
const enum Enum24 {
  MSG_BOX_BASIC_STYLE = 0, // We'll have other styles, like in laptop, etc
                           // Graphics are all that are required here...
  MSG_BOX_RED_ON_WHITE,
  MSG_BOX_BLUE_ON_GREY,
  MSG_BOX_BASIC_SMALL_BUTTONS,
  MSG_BOX_IMP_STYLE,
  MSG_BOX_LAPTOP_DEFAULT,
}

type MSGBOX_CALLBACK = (bExitValue: UINT8) => void;

interface MESSAGE_BOX_STRUCT {
  usFlags: UINT16;
  uiExitScreen: UINT32;
  ExitCallback: MSGBOX_CALLBACK;
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
  fRenderBox: BOOLEAN;
  bHandled: INT8;
  iBoxId: INT32;
}

////////////////////////////////
// ubStyle:				Determines the look of graphics including buttons
// zString:				16-bit string
// uiExitScreen		The screen to exit to
// ubFlags				Some flags for button style
// ReturnCallback	Callback for return. Can be NULL. Returns any above return value
// pCenteringRect	Rect to send if MSG_BOX_FLAG_USE_CENTERING_RECT set. Can be NULL
////////////////////////////////
