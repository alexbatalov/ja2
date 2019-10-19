interface AILIST {
  ubID: UINT8;
  bPriority: INT8;
  ubUnused: UINT8;
  pNext: Pointer<AILIST>;
}

const MAX_AI_PRIORITY = 100;

extern void ClearAIList(void);
extern AILIST *CreateNewAIListEntry(UINT8 ubNewEntry, UINT8 ubID, INT8 bAlertStatus);
extern BOOLEAN InsertIntoAIList(UINT8 ubID, INT8 bAlertStatus);
extern UINT8 RemoveFirstAIListEntry(void);
extern BOOLEAN BuildAIListForTeam(INT8 bTeam);
extern BOOLEAN MoveToFrontOfAIList(UINT8 ubID);
