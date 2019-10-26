namespace ja2 {

// defines
const MAX_EMAIL_LINES = 10; // max number of lines can be shown in a message
export const MAX_MESSAGES_PAGE = 18; // max number of messages per page

export const IMP_EMAIL_INTRO = 0;
export const IMP_EMAIL_INTRO_LENGTH = 10;
export const ENRICO_CONGRATS = (IMP_EMAIL_INTRO + IMP_EMAIL_INTRO_LENGTH);
export const ENRICO_CONGRATS_LENGTH = 3;
export const IMP_EMAIL_AGAIN = (ENRICO_CONGRATS + ENRICO_CONGRATS_LENGTH);
export const IMP_EMAIL_AGAIN_LENGTH = 6;
export const MERC_INTRO = (IMP_EMAIL_AGAIN + IMP_EMAIL_AGAIN_LENGTH);
export const MERC_INTRO_LENGTH = 5;
export const MERC_NEW_SITE_ADDRESS = (MERC_INTRO + MERC_INTRO_LENGTH);
export const MERC_NEW_SITE_ADDRESS_LENGTH = 2;
export const AIM_MEDICAL_DEPOSIT_REFUND = (MERC_NEW_SITE_ADDRESS + MERC_NEW_SITE_ADDRESS_LENGTH);
export const AIM_MEDICAL_DEPOSIT_REFUND_LENGTH = 3;
export const IMP_EMAIL_PROFILE_RESULTS = (AIM_MEDICAL_DEPOSIT_REFUND + AIM_MEDICAL_DEPOSIT_REFUND_LENGTH);
export const IMP_EMAIL_PROFILE_RESULTS_LENGTH = 1;
export const MERC_WARNING = (IMP_EMAIL_PROFILE_RESULTS_LENGTH + IMP_EMAIL_PROFILE_RESULTS);
export const MERC_WARNING_LENGTH = 2;
export const MERC_INVALID = (MERC_WARNING + MERC_WARNING_LENGTH);
export const MERC_INVALID_LENGTH = 2;
export const NEW_MERCS_AT_MERC = (MERC_INVALID + MERC_INVALID_LENGTH);
export const NEW_MERCS_AT_MERC_LENGTH = 2;
export const MERC_FIRST_WARNING = (NEW_MERCS_AT_MERC + NEW_MERCS_AT_MERC_LENGTH);
export const MERC_FIRST_WARNING_LENGTH = 2;
// merc up a level emails
export const MERC_UP_LEVEL_BIFF = (MERC_FIRST_WARNING + MERC_FIRST_WARNING_LENGTH);
export const MERC_UP_LEVEL_LENGTH_BIFF = 2;
const MERC_UP_LEVEL_HAYWIRE = (MERC_UP_LEVEL_LENGTH_BIFF + MERC_UP_LEVEL_BIFF);
const MERC_UP_LEVEL_LENGTH_HAYWIRE = 2;
const MERC_UP_LEVEL_GASKET = (MERC_UP_LEVEL_LENGTH_HAYWIRE + MERC_UP_LEVEL_HAYWIRE);
const MERC_UP_LEVEL_LENGTH_GASKET = 2;
const MERC_UP_LEVEL_RAZOR = (MERC_UP_LEVEL_LENGTH_GASKET + MERC_UP_LEVEL_GASKET);
const MERC_UP_LEVEL_LENGTH_RAZOR = 2;
const MERC_UP_LEVEL_FLO = (MERC_UP_LEVEL_LENGTH_RAZOR + MERC_UP_LEVEL_RAZOR);
const MERC_UP_LEVEL_LENGTH_FLO = 2;
const MERC_UP_LEVEL_GUMPY = (MERC_UP_LEVEL_LENGTH_FLO + MERC_UP_LEVEL_FLO);
const MERC_UP_LEVEL_LENGTH_GUMPY = 2;
const MERC_UP_LEVEL_LARRY = (MERC_UP_LEVEL_LENGTH_GUMPY + MERC_UP_LEVEL_GUMPY);
const MERC_UP_LEVEL_LENGTH_LARRY = 2;
const MERC_UP_LEVEL_COUGAR = (MERC_UP_LEVEL_LENGTH_LARRY + MERC_UP_LEVEL_LARRY);
const MERC_UP_LEVEL_LENGTH_COUGAR = 2;
const MERC_UP_LEVEL_NUMB = (MERC_UP_LEVEL_LENGTH_COUGAR + MERC_UP_LEVEL_COUGAR);
const MERC_UP_LEVEL_LENGTH_NUMB = 2;
const MERC_UP_LEVEL_BUBBA = (MERC_UP_LEVEL_LENGTH_NUMB + MERC_UP_LEVEL_NUMB);
const MERC_UP_LEVEL_LENGTH_BUBBA = 2;
// merc left-me-a-message-and-now-I'm-back emails
export const AIM_REPLY_BARRY = (MERC_UP_LEVEL_LENGTH_BUBBA + MERC_UP_LEVEL_BUBBA);
export const AIM_REPLY_LENGTH_BARRY = 2;
const AIM_REPLY_MELTDOWN = (AIM_REPLY_BARRY + (39 * AIM_REPLY_LENGTH_BARRY));
const AIM_REPLY_LENGTH_MELTDOWN = AIM_REPLY_LENGTH_BARRY;

// old EXISTING emails when player starts game. They must look "read"
export const OLD_ENRICO_1 = (AIM_REPLY_LENGTH_MELTDOWN + AIM_REPLY_MELTDOWN);
export const OLD_ENRICO_1_LENGTH = 3;
export const OLD_ENRICO_2 = (OLD_ENRICO_1 + OLD_ENRICO_1_LENGTH);
export const OLD_ENRICO_2_LENGTH = 3;
export const RIS_REPORT = (OLD_ENRICO_2 + OLD_ENRICO_2_LENGTH);
export const RIS_REPORT_LENGTH = 2;
export const OLD_ENRICO_3 = (RIS_REPORT + RIS_REPORT_LENGTH);
export const OLD_ENRICO_3_LENGTH = 3;

// emails that occur from Enrico once player accomplishes things
export const ENRICO_MIGUEL = (OLD_ENRICO_3 + OLD_ENRICO_3_LENGTH);
export const ENRICO_MIGUEL_LENGTH = 3;
export const ENRICO_PROG_20 = (ENRICO_MIGUEL + ENRICO_MIGUEL_LENGTH);
export const ENRICO_PROG_20_LENGTH = 3;
export const ENRICO_PROG_55 = (ENRICO_PROG_20 + ENRICO_PROG_20_LENGTH);
export const ENRICO_PROG_55_LENGTH = 3;
export const ENRICO_PROG_80 = (ENRICO_PROG_55 + ENRICO_PROG_55_LENGTH);
export const ENRICO_PROG_80_LENGTH = 3;
export const ENRICO_SETBACK = (ENRICO_PROG_80 + ENRICO_PROG_80_LENGTH);
export const ENRICO_SETBACK_LENGTH = 3;
export const ENRICO_SETBACK_2 = (ENRICO_SETBACK + ENRICO_SETBACK_LENGTH);
export const ENRICO_SETBACK_2_LENGTH = 3;
export const ENRICO_CREATURES = (ENRICO_SETBACK_2 + ENRICO_SETBACK_2_LENGTH);
export const ENRICO_CREATURES_LENGTH = 3;

// insurance company emails
export const INSUR_PAYMENT = (ENRICO_CREATURES + ENRICO_CREATURES_LENGTH);
export const INSUR_PAYMENT_LENGTH = 3;
export const INSUR_SUSPIC = (INSUR_PAYMENT + INSUR_PAYMENT_LENGTH);
export const INSUR_SUSPIC_LENGTH = 3;
export const INSUR_INVEST_OVER = (INSUR_SUSPIC + INSUR_SUSPIC_LENGTH);
export const INSUR_INVEST_OVER_LENGTH = 3;
export const INSUR_SUSPIC_2 = (INSUR_INVEST_OVER + INSUR_INVEST_OVER_LENGTH);
export const INSUR_SUSPIC_2_LENGTH = 3;

export const BOBBYR_NOW_OPEN = (INSUR_SUSPIC_2 + INSUR_SUSPIC_2_LENGTH);
export const BOBBYR_NOW_OPEN_LENGTH = 3;

export const KING_PIN_LETTER = (BOBBYR_NOW_OPEN + BOBBYR_NOW_OPEN_LENGTH);
export const KING_PIN_LETTER_LENGTH = 4;

export const LACK_PLAYER_PROGRESS_1 = (KING_PIN_LETTER + KING_PIN_LETTER_LENGTH);
export const LACK_PLAYER_PROGRESS_1_LENGTH = 3;

export const LACK_PLAYER_PROGRESS_2 = (LACK_PLAYER_PROGRESS_1 + LACK_PLAYER_PROGRESS_1_LENGTH);
export const LACK_PLAYER_PROGRESS_2_LENGTH = 3;

export const LACK_PLAYER_PROGRESS_3 = (LACK_PLAYER_PROGRESS_2 + LACK_PLAYER_PROGRESS_2_LENGTH);
export const LACK_PLAYER_PROGRESS_3_LENGTH = 3;

// A package from bobby r has arrived in Drassen
export const BOBBYR_SHIPMENT_ARRIVED = (LACK_PLAYER_PROGRESS_3 + LACK_PLAYER_PROGRESS_3_LENGTH);
export const BOBBYR_SHIPMENT_ARRIVED_LENGTH = 4;

// John Kulba has left the gifts for theplayers in drassen
export const JOHN_KULBA_GIFT_IN_DRASSEN = (BOBBYR_SHIPMENT_ARRIVED + BOBBYR_SHIPMENT_ARRIVED_LENGTH);
export const JOHN_KULBA_GIFT_IN_DRASSEN_LENGTH = 4;

// when a merc dies on ANOTHER assignment ( ie not with the player )
export const MERC_DIED_ON_OTHER_ASSIGNMENT = (JOHN_KULBA_GIFT_IN_DRASSEN + JOHN_KULBA_GIFT_IN_DRASSEN_LENGTH);
export const MERC_DIED_ON_OTHER_ASSIGNMENT_LENGTH = 5;

export const INSUR_1HOUR_FRAUD = (MERC_DIED_ON_OTHER_ASSIGNMENT + MERC_DIED_ON_OTHER_ASSIGNMENT_LENGTH);
export const INSUR_1HOUR_FRAUD_LENGTH = 3;

// when a merc is fired, and is injured
export const AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND = (INSUR_1HOUR_FRAUD + INSUR_1HOUR_FRAUD_LENGTH);
export const AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND_LENGTH = 3;

// when a merc is fired, and is dead
export const AIM_MEDICAL_DEPOSIT_NO_REFUND = (AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND + AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND_LENGTH);
export const AIM_MEDICAL_DEPOSIT_NO_REFUND_LENGTH = 3;

export const BOBBY_R_MEDUNA_SHIPMENT = (AIM_MEDICAL_DEPOSIT_NO_REFUND + AIM_MEDICAL_DEPOSIT_NO_REFUND_LENGTH);
export const BOBBY_R_MEDUNA_SHIPMENT_LENGTH = 4;

export interface EmailMessage {
  pString: STR16;
  Next: Pointer<EmailMessage>;
  Prev: Pointer<EmailMessage>;
}

type MessagePtr = Pointer<EmailMessage>;

export interface Email {
  pSubject: STR16;
  usOffset: UINT16;
  usLength: UINT16;
  ubSender: UINT8;
  iDate: UINT32;
  iId: INT32;
  iFirstData: INT32;
  uiSecondData: UINT32;
  fRead: boolean;
  fNew: boolean;

  iThirdData: INT32;
  iFourthData: INT32;
  uiFifthData: UINT32;
  uiSixData: UINT32;

  Next: Pointer<Email>;
  Prev: Pointer<Email>;
}

export type EmailPtr = Pointer<Email>;

// This used when saving the emails to disk.
export interface SavedEmailStruct {
  usOffset: UINT16;
  usLength: UINT16;
  ubSender: UINT8;
  iDate: UINT32;
  iId: INT32;
  iFirstData: INT32;
  uiSecondData: UINT32;

  iThirdData: INT32;
  iFourthData: INT32;
  uiFifthData: UINT32;
  uiSixData: UINT32;

  fRead: boolean;
  fNew: boolean;
}

export interface Page {
  iIds: INT32[] /* [MAX_MESSAGES_PAGE] */;
  iPageId: INT32;
  Next: Pointer<Page>;
  Prev: Pointer<Page>;
}

export type PagePtr = Pointer<Page>;

export interface Record {
  //  CHAR16 pRecord[ 320 ];
  pRecord: CHAR16[] /* [640] */;
  Next: Pointer<Record>;
}

export type RecordPtr = Pointer<Record>;

export interface EmailPageInfoStruct {
  pFirstRecord: RecordPtr;
  pLastRecord: RecordPtr;
  iPageNumber: INT32;
}

export const enum Enum74 {
  SENDER = 0,
  RECEIVED,
  SUBJECT,
  READ,
}

export const enum Enum75 {
  MAIL_ENRICO = 0,
  CHAR_PROFILE_SITE,
  GAME_HELP,
  IMP_PROFILE_RESULTS,
  SPECK_FROM_MERC,
  RIS_EMAIL,
  BARRY_MAIL,
  MELTDOWN_MAIL = BARRY_MAIL + 39,
  INSURANCE_COMPANY,
  BOBBY_R,
  KING_PIN,
  JOHN_KULBA,
  AIM_SITE,
}

// the length of the subject in char
export const EMAIL_SUBJECT_LENGTH = 128;

export const CHECK_X = 15;
export const CHECK_Y = 13;
export const VIEWER_X = 155;
export const VIEWER_Y = 70 + 21;
export const MAIL_STRING_SIZE = 640;

}
