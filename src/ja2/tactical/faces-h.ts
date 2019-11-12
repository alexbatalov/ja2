namespace ja2 {

export const NO_EXPRESSION = 0;
export const BLINKING = 1;
export const ANGRY = 2;
export const SURPRISED = 3;

// Defines
const NUM_FACE_SLOTS = 50;

export interface AUDIO_GAP {
  uiStart: UINT32;
  uiEnd: UINT32;
  pNext: AUDIO_GAP | null /* Pointer<AUDIO_GAP> */;
}

export const FACE_AUTO_DISPLAY_BUFFER = 0xFFFFF000;
export const FACE_AUTO_RESTORE_BUFFER = 0xFFFFFF00;
export const FACE_NO_RESTORE_BUFFER = 0xFFFFFFF0;

// FLAGS....
export const FACE_DESTROY_OVERLAY = 0x00000000; // A face may contain a video overlay
export const FACE_BIGFACE = 0x00000001; // A BIGFACE instead of small face
export const FACE_POTENTIAL_KEYWAIT = 0x00000002; // If the option is set, will not stop face until key pressed
export const FACE_PCTRIGGER_NPC = 0x00000004; // This face has to trigger an NPC after being done
export const FACE_INACTIVE_HANDLED_ELSEWHERE = 0x00000008; // This face has been setup and any disable should be done
                                                    // Externally
export const FACE_TRIGGER_PREBATTLE_INT = 0x00000010;
export const FACE_SHOW_WHITE_HILIGHT = 0x00000020; // Show highlight around face
export const FACE_FORCE_SMALL = 0x00000040; // force to small face
export const FACE_MODAL = 0x00000080; // make game modal
export const FACE_MAKEACTIVE_ONCE_DONE = 0x00000100;
export const FACE_SHOW_MOVING_HILIGHT = 0x00000200;
export const FACE_REDRAW_WHOLE_FACE_NEXT_FRAME = 0x00000400; // Redraw the complete face next frame

export const FACE_DRAW_TEXT_OVER = 2;
export const FACE_ERASE_TEXT_OVER = 1;
export const FACE_NO_TEXT_OVER = 0;

// duration for talking
export const FINAL_TALKING_DURATION = 2000;

export interface AudioGapList {
  size: UINT32;
  current_time: UINT32;
  // Pointer to head and current entry of gap list
  pHead: Pointer<AUDIO_GAP>;
  pCurrent: Pointer<AUDIO_GAP>;

  audio_gap_active: boolean;
}

export interface FACETYPE {
  uiFlags: UINT32; // Basic flags
  iID: INT32;
  fAllocated: boolean; // Allocated or not
  fTalking: boolean; // Set to true if face is talking ( can be sitting for user input to esc )
  fAnimatingTalking: boolean; // Set if the face is animating right now
  fDisabled: boolean; // Not active
  fValidSpeech: boolean;
  fStartFrame: boolean; // Flag for the first start frame
  fInvalidAnim: boolean;

  uiTalkingDuration: UINT32; // A delay based on text length for how long to talk if no speech
  uiTalkingTimer: UINT32; // A timer to handle delay when no speech file
  uiTalkingFromVeryBeginningTimer: UINT32; // Timer from very beginning of talking...

  fFinishTalking: boolean; // A flag to indicate we want to delay after speech done

  iVideoOverlay: INT32; // Value for video overlay ( not used too much )

  uiSoundID: UINT32; // Sound ID if one being played
  ubSoldierID: UINT8; // SoldierID if one specified
  ubCharacterNum: UINT8; // Profile ID num

  usFaceX: UINT16; // X location to render face
  usFaceY: UINT16; // Y location to render face
  usFaceWidth: UINT16;
  usFaceHeight: UINT16;
  uiAutoDisplayBuffer: UINT32; // Display buffer for face
  uiAutoRestoreBuffer: UINT32; // Restore buffer
  fAutoRestoreBuffer: boolean; // Flag to indicate our own restorebuffer or not
  fAutoDisplayBuffer: boolean; // Flag to indicate our own display buffer or not
  fDisplayTextOver: boolean; // Boolean indicating to display text on face
  fOldDisplayTextOver: boolean; // OLD Boolean indicating to display text on face
  fCanHandleInactiveNow: boolean;
  zDisplayText: string /* INT16[30] */; // String of text that can be displayed

  usEyesX: UINT16;
  usEyesY: UINT16;
  usEyesOffsetX: UINT16;
  usEyesOffsetY: UINT16;

  usEyesWidth: UINT16;
  usEyesHeight: UINT16;

  usMouthX: UINT16;
  usMouthY: UINT16;
  usMouthOffsetX: UINT16;
  usMouthOffsetY: UINT16;
  usMouthWidth: UINT16;
  usMouthHeight: UINT16;

  sEyeFrame: UINT16;
  ubEyeWait: INT8;
  uiEyelast: UINT32;
  uiEyeDelay: UINT32;
  uiBlinkFrequency: UINT32;
  uiExpressionFrequency: UINT32;
  uiStopOverlayTimer: UINT32;

  ubExpression: UINT8;

  bOldSoldierLife: INT8;
  bOldActionPoints: INT8;
  fOldHandleUIHatch: boolean;
  fOldShowHighlight: boolean;
  bOldAssignment: INT8;
  ubOldServiceCount: INT8;
  ubOldServicePartner: UINT8;
  fOldShowMoveHilight: boolean;

  sMouthFrame: UINT16;
  uiMouthlast: UINT32;
  uiMouthDelay: UINT32;

  uiLastBlink: UINT32;
  uiLastExpression: UINT32;

  uiVideoObject: UINT32;

  uiUserData1: UINT32;
  uiUserData2: UINT32;

  fCompatibleItems: boolean;
  fOldCompatibleItems: boolean;
  bOldStealthMode: boolean;
  bOldOppCnt: INT8;

  GapList: AudioGapList;
}

// The first parameter is the profile ID and the second is the soldier ID ( which for most cases
// will be NOBODY if the face is not created from a SOLDIERTYPE )
// This function allocates a slot in the table for the face, loads it's STI file, sets some
// values for X,Y locations of eyes from the profile. Does not mkae the face visible or anything like that

// The first paramter is the display buffer you wish the face to be rendered on. The second is the
// Internal savebuffer which is used to facilitate the rendering of only things which have changed when
// blinking. IF the value of FACE_AUTO_RESTORE_BUFFER is given, the system will allocate it's own memory for
// a saved buffer and will delete it when finished with it. This function also takes an XY location

// This will draw the face into it's saved buffer and then display it on the display buffer. If the display
// buffer given is FRAME_BUFFER, the regions will automatically be dirtied, so no calls to InvalidateRegion()
// should be nessesary.

// This function will setup appropriate face data and begin the speech process. It can fail if the sound
// cannot be played for any reason.

// This will handle all faces set to be auto mamaged by SetAutoFaceActive(). What is does is determines
// the best mouth and eye graphic to use. It then renders only the rects nessessary into the display buffer.

// This can be used to times when you need process the user hitting <ESC> to cancel the speech, etc. It will
// shutoff any playing sound sample

}
