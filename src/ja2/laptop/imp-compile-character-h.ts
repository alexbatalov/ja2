const PLAYER_GENERATED_CHARACTER_ID = 51;
const ATTITUDE_LIST_SIZE = 20;
const NUMBER_OF_PLAYER_PORTRAITS = 16;

void AddAnAttitudeToAttitudeList(INT8 bAttitude);
void CreatePlayerAttitude(void);
BOOLEAN DoesCharacterHaveAnAttitude(void);
void CreateACharacterFromPlayerEnteredStats(void);
void CreatePlayerSkills(void);
void CreatePlayersPersonalitySkillsAndAttitude(void);
void AddAPersonalityToPersonalityList(INT8 bPersonlity);
void CreatePlayerPersonality(void);
BOOLEAN DoesCharacterHaveAPersoanlity(void);
void AddSkillToSkillList(INT8 bSkill);
void ResetSkillsAttributesAndPersonality(void);
void ResetIncrementCharacterAttributes(void);
void HandleMercStatsForChangesInFace(void);

extern STR8 pPlayerSelectedFaceFileNames[NUMBER_OF_PLAYER_PORTRAITS];
extern STR8 pPlayerSelectedBigFaceFileNames[NUMBER_OF_PLAYER_PORTRAITS];
