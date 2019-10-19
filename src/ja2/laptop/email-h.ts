// defines
const MAX_EMAIL_LINES = 10; // max number of lines can be shown in a message
const MAX_MESSAGES_PAGE = 18; // max number of messages per page

const IMP_EMAIL_INTRO = 0;
const IMP_EMAIL_INTRO_LENGTH = 10;
const ENRICO_CONGRATS = (IMP_EMAIL_INTRO + IMP_EMAIL_INTRO_LENGTH);
const ENRICO_CONGRATS_LENGTH = 3;
const IMP_EMAIL_AGAIN = (ENRICO_CONGRATS + ENRICO_CONGRATS_LENGTH);
const IMP_EMAIL_AGAIN_LENGTH = 6;
const MERC_INTRO = (IMP_EMAIL_AGAIN + IMP_EMAIL_AGAIN_LENGTH);
const MERC_INTRO_LENGTH = 5;
const MERC_NEW_SITE_ADDRESS = (MERC_INTRO + MERC_INTRO_LENGTH);
const MERC_NEW_SITE_ADDRESS_LENGTH = 2;
const AIM_MEDICAL_DEPOSIT_REFUND = (MERC_NEW_SITE_ADDRESS + MERC_NEW_SITE_ADDRESS_LENGTH);
const AIM_MEDICAL_DEPOSIT_REFUND_LENGTH = 3;
const IMP_EMAIL_PROFILE_RESULTS = (AIM_MEDICAL_DEPOSIT_REFUND + AIM_MEDICAL_DEPOSIT_REFUND_LENGTH);
const IMP_EMAIL_PROFILE_RESULTS_LENGTH = 1;
const MERC_WARNING = (IMP_EMAIL_PROFILE_RESULTS_LENGTH + IMP_EMAIL_PROFILE_RESULTS);
const MERC_WARNING_LENGTH = 2;
const MERC_INVALID = (MERC_WARNING + MERC_WARNING_LENGTH);
const MERC_INVALID_LENGTH = 2;
const NEW_MERCS_AT_MERC = (MERC_INVALID + MERC_INVALID_LENGTH);
const NEW_MERCS_AT_MERC_LENGTH = 2;
const MERC_FIRST_WARNING = (NEW_MERCS_AT_MERC + NEW_MERCS_AT_MERC_LENGTH);
const MERC_FIRST_WARNING_LENGTH = 2;
// merc up a level emails
const MERC_UP_LEVEL_BIFF = (MERC_FIRST_WARNING + MERC_FIRST_WARNING_LENGTH);
const MERC_UP_LEVEL_LENGTH_BIFF = 2;
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
const AIM_REPLY_BARRY = (MERC_UP_LEVEL_LENGTH_BUBBA + MERC_UP_LEVEL_BUBBA);
const AIM_REPLY_LENGTH_BARRY = 2;
const AIM_REPLY_MELTDOWN = (AIM_REPLY_BARRY + (39 * AIM_REPLY_LENGTH_BARRY));
const AIM_REPLY_LENGTH_MELTDOWN = AIM_REPLY_LENGTH_BARRY;

// old EXISTING emails when player starts game. They must look "read"
const OLD_ENRICO_1 = (AIM_REPLY_LENGTH_MELTDOWN + AIM_REPLY_MELTDOWN);
const OLD_ENRICO_1_LENGTH = 3;
const OLD_ENRICO_2 = (OLD_ENRICO_1 + OLD_ENRICO_1_LENGTH);
const OLD_ENRICO_2_LENGTH = 3;
const RIS_REPORT = (OLD_ENRICO_2 + OLD_ENRICO_2_LENGTH);
const RIS_REPORT_LENGTH = 2;
const OLD_ENRICO_3 = (RIS_REPORT + RIS_REPORT_LENGTH);
const OLD_ENRICO_3_LENGTH = 3;

// emails that occur from Enrico once player accomplishes things
const ENRICO_MIGUEL = (OLD_ENRICO_3 + OLD_ENRICO_3_LENGTH);
const ENRICO_MIGUEL_LENGTH = 3;
const ENRICO_PROG_20 = (ENRICO_MIGUEL + ENRICO_MIGUEL_LENGTH);
const ENRICO_PROG_20_LENGTH = 3;
const ENRICO_PROG_55 = (ENRICO_PROG_20 + ENRICO_PROG_20_LENGTH);
const ENRICO_PROG_55_LENGTH = 3;
const ENRICO_PROG_80 = (ENRICO_PROG_55 + ENRICO_PROG_55_LENGTH);
const ENRICO_PROG_80_LENGTH = 3;
const ENRICO_SETBACK = (ENRICO_PROG_80 + ENRICO_PROG_80_LENGTH);
const ENRICO_SETBACK_LENGTH = 3;
const ENRICO_SETBACK_2 = (ENRICO_SETBACK + ENRICO_SETBACK_LENGTH);
const ENRICO_SETBACK_2_LENGTH = 3;
const ENRICO_CREATURES = (ENRICO_SETBACK_2 + ENRICO_SETBACK_2_LENGTH);
const ENRICO_CREATURES_LENGTH = 3;

// insurance company emails
const INSUR_PAYMENT = (ENRICO_CREATURES + ENRICO_CREATURES_LENGTH);
const INSUR_PAYMENT_LENGTH = 3;
const INSUR_SUSPIC = (INSUR_PAYMENT + INSUR_PAYMENT_LENGTH);
const INSUR_SUSPIC_LENGTH = 3;
const INSUR_INVEST_OVER = (INSUR_SUSPIC + INSUR_SUSPIC_LENGTH);
const INSUR_INVEST_OVER_LENGTH = 3;
const INSUR_SUSPIC_2 = (INSUR_INVEST_OVER + INSUR_INVEST_OVER_LENGTH);
const INSUR_SUSPIC_2_LENGTH = 3;

const BOBBYR_NOW_OPEN = (INSUR_SUSPIC_2 + INSUR_SUSPIC_2_LENGTH);
const BOBBYR_NOW_OPEN_LENGTH = 3;

const KING_PIN_LETTER = (BOBBYR_NOW_OPEN + BOBBYR_NOW_OPEN_LENGTH);
const KING_PIN_LETTER_LENGTH = 4;

const LACK_PLAYER_PROGRESS_1 = (KING_PIN_LETTER + KING_PIN_LETTER_LENGTH);
const LACK_PLAYER_PROGRESS_1_LENGTH = 3;

const LACK_PLAYER_PROGRESS_2 = (LACK_PLAYER_PROGRESS_1 + LACK_PLAYER_PROGRESS_1_LENGTH);
const LACK_PLAYER_PROGRESS_2_LENGTH = 3;

const LACK_PLAYER_PROGRESS_3 = (LACK_PLAYER_PROGRESS_2 + LACK_PLAYER_PROGRESS_2_LENGTH);
const LACK_PLAYER_PROGRESS_3_LENGTH = 3;

// A package from bobby r has arrived in Drassen
const BOBBYR_SHIPMENT_ARRIVED = (LACK_PLAYER_PROGRESS_3 + LACK_PLAYER_PROGRESS_3_LENGTH);
const BOBBYR_SHIPMENT_ARRIVED_LENGTH = 4;

// John Kulba has left the gifts for theplayers in drassen
const JOHN_KULBA_GIFT_IN_DRASSEN = (BOBBYR_SHIPMENT_ARRIVED + BOBBYR_SHIPMENT_ARRIVED_LENGTH);
const JOHN_KULBA_GIFT_IN_DRASSEN_LENGTH = 4;

// when a merc dies on ANOTHER assignment ( ie not with the player )
const MERC_DIED_ON_OTHER_ASSIGNMENT = (JOHN_KULBA_GIFT_IN_DRASSEN + JOHN_KULBA_GIFT_IN_DRASSEN_LENGTH);
const MERC_DIED_ON_OTHER_ASSIGNMENT_LENGTH = 5;

const INSUR_1HOUR_FRAUD = (MERC_DIED_ON_OTHER_ASSIGNMENT + MERC_DIED_ON_OTHER_ASSIGNMENT_LENGTH);
const INSUR_1HOUR_FRAUD_LENGTH = 3;

// when a merc is fired, and is injured
const AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND = (INSUR_1HOUR_FRAUD + INSUR_1HOUR_FRAUD_LENGTH);
const AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND_LENGTH = 3;

// when a merc is fired, and is dead
const AIM_MEDICAL_DEPOSIT_NO_REFUND = (AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND + AIM_MEDICAL_DEPOSIT_PARTIAL_REFUND_LENGTH);
const AIM_MEDICAL_DEPOSIT_NO_REFUND_LENGTH = 3;

const BOBBY_R_MEDUNA_SHIPMENT = (AIM_MEDICAL_DEPOSIT_NO_REFUND + AIM_MEDICAL_DEPOSIT_NO_REFUND_LENGTH);
const BOBBY_R_MEDUNA_SHIPMENT_LENGTH = 4;

struct message {
  STR16 pString;
  struct message *Next;
  struct message *Prev;
};

typedef struct message EmailMessage;
typedef EmailMessage *MessagePtr;

struct email {
  STR16 pSubject;
  UINT16 usOffset;
  UINT16 usLength;
  UINT8 ubSender;
  UINT32 iDate;
  INT32 iId;
  INT32 iFirstData;
  UINT32 uiSecondData;
  BOOLEAN fRead;
  BOOLEAN fNew;

  INT32 iThirdData;
  INT32 iFourthData;
  UINT32 uiFifthData;
  UINT32 uiSixData;

  struct email *Next;
  struct email *Prev;
};

typedef struct email Email;
typedef Email *EmailPtr;

// This used when saving the emails to disk.
typedef struct {
  UINT16 usOffset;
  UINT16 usLength;
  UINT8 ubSender;
  UINT32 iDate;
  INT32 iId;
  INT32 iFirstData;
  UINT32 uiSecondData;

  INT32 iThirdData;
  INT32 iFourthData;
  UINT32 uiFifthData;
  UINT32 uiSixData;

  BOOLEAN fRead;
  BOOLEAN fNew;
} SavedEmailStruct;

struct pagemessages {
  INT32 iIds[MAX_MESSAGES_PAGE];
  INT32 iPageId;
  struct pagemessages *Next;
  struct pagemessages *Prev;
};

typedef struct pagemessages Page;
typedef Page *PagePtr;

struct messagerecord {
  //  CHAR16 pRecord[ 320 ];
  CHAR16 pRecord[640];
  struct messagerecord *Next;
};

typedef struct messagerecord Record;
typedef Record *RecordPtr;

typedef struct {
  RecordPtr pFirstRecord;
  RecordPtr pLastRecord;
  INT32 iPageNumber;
} EmailPageInfoStruct;

enum {
  SENDER = 0,
  RECEIVED,
  SUBJECT,
  READ,
};

enum {
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
};

// the length of the subject in char
const EMAIL_SUBJECT_LENGTH = 128;

extern BOOLEAN fUnReadMailFlag;
extern BOOLEAN fNewMailFlag;
extern BOOLEAN fOldUnreadFlag;
extern BOOLEAN fOldNewMailFlag;
extern BOOLEAN fDeleteMailFlag;
extern BOOLEAN fDisplayMessageFlag;
extern BOOLEAN fReDrawNewMailFlag;
extern BOOLEAN fOpenMostRecentUnReadFlag;
extern EmailPtr pEmailList;
extern UINT32 guiEmailWarning;

void GameInitEmail();
BOOLEAN EnterEmail();
void ExitEmail();
void HandleEmail();
void RenderEmail();

const CHECK_X = 15;
const CHECK_Y = 13;
const VIEWER_X = 155;
const VIEWER_Y = 70 + 21;
const MAIL_STRING_SIZE = 640;

// message manipulation
void AddEmailMessage(INT32 iMessageOffset, INT32 iMessageLength, STR16 pSubject, INT32 iDate, UINT8 ubSender, BOOLEAN fAlreadyRead, INT32 uiFirstData, UINT32 uiSecondData);
void RemoveEmailMessage(INT32 iId);
EmailPtr GetEmailMessage(INT32 iId);
void LookForUnread();
void AddEmail(INT32 iMessageOffset, INT32 iMessageLength, UINT8 ubSender, INT32 iDate);
void AddPreReadEmail(INT32 iMessageOffset, INT32 iMessageLength, UINT8 ubSender, INT32 iDate);
BOOLEAN DisplayNewMailBox();
void CreateDestroyNewMailButton();
void CreateDestroyDeleteNoticeMailButton();
void AddDeleteRegionsToMessageRegion();
void DisplayEmailHeaders(void);
void ReDrawNewMailBox(void);
void ReDisplayBoxes(void);
void ShutDownEmailList();
void AddMessageToPages(INT32 iMessageId);
void AddEmailWithSpecialData(INT32 iMessageOffset, INT32 iMessageLength, UINT8 ubSender, INT32 iDate, INT32 iFirstData, UINT32 uiSecondData);