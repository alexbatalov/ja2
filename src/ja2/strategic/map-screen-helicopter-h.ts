// costs of flying through sectors
const COST_AIRSPACE_SAFE = 100;
const COST_AIRSPACE_UNSAFE = 1000; // VERY dangerous

const MIN_PROGRESS_FOR_SKYRIDER_QUOTE_DOING_WELL = 25; // scale of 0-100
const MIN_REGRESS_FOR_SKYRIDER_QUOTE_DOING_BADLY = 10; // scale of 0-100

// skyrider quotes
const OWED_MONEY_TO_SKYRIDER = 11;
const MENTION_DRASSEN_SAM_SITE = 20;
const SECOND_HALF_OF_MENTION_DRASSEN_SAM_SITE = 21;
const SAM_SITE_TAKEN = 22;
const SKYRIDER_SAYS_HI = 23;
const SPIEL_ABOUT_OTHER_SAM_SITES = 24;
const SECOND_HALF_OF_SPIEL_ABOUT_OTHER_SAM_SITES = 25;

const SPIEL_ABOUT_ESTONI_AIRSPACE = 26;
const CONFIRM_DESTINATION = 27;
//#define DESTINATION_TOO_FAR 28		// unused
const ALTERNATE_FUEL_SITE = 26;
const ARRIVED_IN_HOSTILE_SECTOR = 29;
const BELIEVED_ENEMY_SECTOR = 30; // may become unused
const ARRIVED_IN_NON_HOSTILE_SECTOR = 31;
const HOVERING_A_WHILE = 32;
const RETURN_TO_BASE = 33;
const ENEMIES_SPOTTED_EN_ROUTE_IN_FRIENDLY_SECTOR_A = 34;
const ENEMIES_SPOTTED_EN_ROUTE_IN_FRIENDLY_SECTOR_B = 35;
const MENTION_HOSPITAL_IN_CAMBRIA = 45;
const THINGS_ARE_GOING_BADLY = 46;
const THINGS_ARE_GOING_WELL = 47;
const CHOPPER_NOT_ACCESSIBLE = 48;
const DOESNT_WANT_TO_FLY = 49;
const HELI_TOOK_MINOR_DAMAGE = 52;
const HELI_TOOK_MAJOR_DAMAGE = 53;
const HELI_GOING_DOWN = 54;

// enums for skyrider monologue
const enum Enum136 {
  SKYRIDER_MONOLOGUE_EVENT_DRASSEN_SAM_SITE = 0,
  SKYRIDER_MONOLOGUE_EVENT_OTHER_SAM_SITES,
  SKYRIDER_MONOLOGUE_EVENT_ESTONI_REFUEL,
  SKYRIDER_MONOLOGUE_EVENT_CAMBRIA_HOSPITAL,
}

const enum Enum137 {
  DRASSEN_REFUELING_SITE = 0,
  ESTONI_REFUELING_SITE,
  NUMBER_OF_REFUEL_SITES,
}

// the sam site enums
const enum Enum138 {
  SAM_SITE_ONE = 0, // near Chitzena
  SAM_SITE_TWO, // near Drassen
  SAM_SITE_THREE, // near Cambria
  SAM_SITE_FOUR, // near Meduna
  NUMBER_OF_SAM_SITES,
}

// list of refueling site's sector locations
extern UINT8 ubRefuelList[NUMBER_OF_REFUEL_SITES][2];

// is the helicopter available to player?
extern BOOLEAN fHelicopterAvailable;

// helicopter vehicle id value
extern INT32 iHelicopterVehicleId;

// heli is hovering
extern BOOLEAN fHoveringHelicopter;

// helicopter icon
extern UINT32 guiHelicopterIcon;

// helicopter destroyed
extern BOOLEAN fHelicopterDestroyed;

// is the pilot returning straight to base?
extern BOOLEAN fHeliReturnStraightToBase;

// is the heli in the air?
extern BOOLEAN fHelicopterIsAirBorne;

// total distance travelled
// extern INT32 iTotalHeliDistanceSinceRefuel;

// total owed to player
// extern INT32 iTotalAccumlatedCostByPlayer;

// whether or not skyrider is alive and well? and on our side yet?
extern BOOLEAN fSkyRiderAvailable;

// time started hovering
extern UINT32 uiStartHoverTime;

// what state is skyrider's dialogue in in?
extern UINT32 guiHelicopterSkyriderTalkState;

// plot for helicopter
extern BOOLEAN fPlotForHelicopter;

// the flags for skyrider events
extern BOOLEAN fShowEstoniRefuelHighLight;
extern BOOLEAN fShowOtherSAMHighLight;
extern BOOLEAN fShowDrassenSAMHighLight;
extern BOOLEAN fShowCambriaHospitalHighLight;

extern INT32 iTotalAccumulatedCostByPlayer;
extern UINT32 guiTimeOfLastSkyriderMonologue;
extern BOOLEAN fSkyRiderSetUp;
extern BOOLEAN fRefuelingSiteAvailable[NUMBER_OF_REFUEL_SITES];

extern UINT8 gubHelicopterHitsTaken;
extern BOOLEAN gfSkyriderSaidCongratsOnTakingSAM;
extern UINT8 gubPlayerProgressSkyriderLastCommentedOn;

/* ARM: Max. fuel range system removed
// add another sector to how far helictoper has travelled
void AddSectorToHelicopterDistanceTravelled( void );

// total distance travelled since last refuel
INT32 HowFarHelicopterhasTravelledSinceRefueling( void );

// get the total the heli can go
INT32 GetTotalDistanceHelicopterCanTravel( void );

// how far can helicopter can travel before refuel
INT32 HowFurtherCanHelicopterTravel( void );

// check if this sector is out of the way
BOOLEAN IsSectorOutOfTheWay( INT16 sX, INT16 sY );

*/

// total cost of helicopter trip
// INT32 GetTotalCostOfHelicopterTrip( void );

// will a sam site under the players control shoot down an airraid?
// BOOLEAN WillAirRaidBeStopped( INT16 sSectorX, INT16 sSectorY );
