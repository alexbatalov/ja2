const MERC_BUTTON_UP_COLOR = FONT_MCOLOR_WHITE;
const MERC_BUTTON_DOWN_COLOR = FONT_MCOLOR_DKWHITE;

const NUMBER_OF_MERCS = 11;
const LAST_MERC_ID = 10;
const NUMBER_OF_BAD_MERCS = 5;
const NUMBER_MERCS_AFTER_FIRST_MERC_ARRIVES = 6;
const NUMBER_MERCS_AFTER_SECOND_MERC_ARRIVES = 8;
const NUMBER_MERCS_AFTER_THIRD_MERC_ARRIVES = 9;
const NUMBER_MERCS_AFTER_FOURTH_MERC_ARRIVES = 10;

const MERC_NUM_DAYS_TILL_FIRST_WARNING = 7;
const MERC_NUM_DAYS_TILL_ACCOUNT_SUSPENDED = 9;
const MERC_NUM_DAYS_TILL_ACCOUNT_INVALID = 12;

const MERC_LARRY_ROACHBURN = 7;

const DAYS_TIL_M_E_R_C_AVAIL = 3;

// The players account information for the MERC site
const enum Enum104 {
  MERC_NO_ACCOUNT,
  MERC_ACCOUNT_SUSPENDED,
  MERC_ACCOUNT_INVALID,
  MERC_ACCOUNT_VALID_FIRST_WARNING,
  MERC_ACCOUNT_VALID,
}
// extern	UINT8			gubPlayersMercAccountStatus;
// extern	UINT32		guiPlayersMercAccountNumber;

// The video conferencing for the merc page
const MERC_VIDEO_SPECK_SPEECH_NOT_TALKING = 65535;
const MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET = 65534;

// used with the gubArrivedFromMercSubSite variable to signify whcih page the player came from
const enum Enum105 {
  MERC_CAME_FROM_OTHER_PAGE,
  MERC_CAME_FROM_ACCOUNTS_PAGE,
  MERC_CAME_FROM_HIRE_PAGE,
}

extern UINT16 gusMercVideoSpeckSpeech;

extern UINT8 gubArrivedFromMercSubSite;

extern UINT8 gubMercArray[NUMBER_OF_MERCS];
extern UINT8 gubCurMercIndex;
// extern	UINT8			gubLastMercIndex;

// extern	UINT32		guiNumberOfMercPaymentsInDays;
// extern	UINT8			gubNumDaysTillFirstMercArrives;

extern BOOLEAN gfJustHiredAMercMerc;
