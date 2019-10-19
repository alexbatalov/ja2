const ANITILE_DOOR = 0x00000001;
const ANITILE_BACKWARD = 0x00000020;
const ANITILE_FORWARD = 0x00000040;
const ANITILE_PAUSED = 0x00000200;
const ANITILE_EXISTINGTILE = 0x00000400;
const ANITILE_USEABSOLUTEPOS = 0x00004000;
const ANITILE_CACHEDTILE = 0x00008000;
const ANITILE_LOOPING = 0x00020000;
const ANITILE_NOZBLITTER = 0x00040000;
const ANITILE_REVERSE_LOOPING = 0x00080000;
const ANITILE_ALWAYS_TRANSLUCENT = 0x00100000;
const ANITILE_USEBEST_TRANSLUCENT = 0x00200000;
const ANITILE_OPTIMIZEFORSLOWMOVING = 0x00400000;
const ANITILE_ANIMATE_Z = 0x00800000;
const ANITILE_USE_DIRECTION_FOR_START_FRAME = 0x01000000;
const ANITILE_PAUSE_AFTER_LOOP = 0x02000000;
const ANITILE_ERASEITEMFROMSAVEBUFFFER = 0x04000000;
const ANITILE_OPTIMIZEFORSMOKEEFFECT = 0x08000000;
const ANITILE_SMOKE_EFFECT = 0x10000000;
const ANITILE_EXPLOSION = 0x20000000;
const ANITILE_RELEASE_ATTACKER_WHEN_DONE = 0x40000000;
const ANITILE_USE_4DIRECTION_FOR_START_FRAME = 0x02000000;

const ANI_LAND_LEVEL = 1;
const ANI_SHADOW_LEVEL = 2;
const ANI_OBJECT_LEVEL = 3;
const ANI_STRUCT_LEVEL = 4;
const ANI_ROOF_LEVEL = 5;
const ANI_ONROOF_LEVEL = 6;
const ANI_TOPMOST_LEVEL = 7;

typedef struct TAG_anitile {
  struct TAG_anitile *pNext;
  UINT32 uiFlags; // flags struct
  UINT32 uiTimeLastUpdate; // Stuff for animated tiles

  LEVELNODE *pLevelNode;
  UINT8 ubLevelID;
  INT16 sCurrentFrame;
  INT16 sStartFrame;
  INT16 sDelay;
  UINT16 usTileType;
  UINT16 usNumFrames;

  UINT16 usMissAnimationPlayed;
  UINT16 ubAttackerMissed;
  INT16 sRelativeX;
  INT16 sRelativeY;
  INT16 sRelativeZ;
  INT16 sGridNo;
  UINT16 usTileIndex;

  UINT16 usCachedTileSubIndex; // sub Index
  INT16 sCachedTileID; // Index into cached tile ID

  UINT8 ubOwner;
  UINT8 ubKeyFrame1;
  UINT32 uiKeyFrame1Code;
  UINT8 ubKeyFrame2;
  UINT32 uiKeyFrame2Code;

  UINT32 uiUserData;
  UINT8 ubUserData2;
  UINT32 uiUserData3;

  INT8 bFrameCountAfterStart;
} ANITILE;

typedef struct TAG_anitile_params {
  UINT32 uiFlags; // flags struct
  UINT8 ubLevelID; // Level ID for rendering layer
  INT16 sStartFrame; // Start frame
  INT16 sDelay; // Delay time
  UINT16 usTileType; // Tile databse type ( optional )
  UINT16 usTileIndex; // Tile database index ( optional )
  INT16 sX; // World X ( optional )
  INT16 sY; // World Y ( optional )
  INT16 sZ; // World Z ( optional )
  INT16 sGridNo; // World GridNo

  LEVELNODE *pGivenLevelNode; // Levelnode for existing tile ( optional )
  CHAR8 zCachedFile[100]; // Filename for cached tile name ( optional )

  UINT8 ubOwner; // UBID for the owner
  UINT8 ubKeyFrame1; // Key frame 1
  UINT32 uiKeyFrame1Code; // Key frame code
  UINT8 ubKeyFrame2; // Key frame 2
  UINT32 uiKeyFrame2Code; // Key frame code

  UINT32 uiUserData;
  UINT8 ubUserData2;
  UINT32 uiUserData3;
} ANITILE_PARAMS;

enum {
  ANI_KEYFRAME_NO_CODE,
  ANI_KEYFRAME_BEGIN_TRANSLUCENCY,
  ANI_KEYFRAME_BEGIN_DAMAGE,
  ANI_KEYFRAME_CHAIN_WATER_EXPLOSION,
  ANI_KEYFRAME_DO_SOUND,
} KeyFrameEnums;

// ANimation tile data
ANITILE *pAniTileHead;

ANITILE *CreateAnimationTile(ANITILE_PARAMS *pAniParams);

void DeleteAniTile(ANITILE *pAniTile);
void UpdateAniTiles();
void SetAniTileFrame(ANITILE *pAniTile, INT16 sFrame);
void DeleteAniTiles();

void HideAniTile(ANITILE *pAniTile, BOOLEAN fHide);
void PauseAniTile(ANITILE *pAniTile, BOOLEAN fPause);

ANITILE *GetCachedAniTileOfType(INT16 sGridNo, UINT8 ubLevelID, UINT32 uiFlags);

void PauseAllAniTilesOfType(UINT32 uiType, BOOLEAN fPause);
