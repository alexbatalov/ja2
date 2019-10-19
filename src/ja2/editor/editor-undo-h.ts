BOOLEAN AddToUndoList(INT32 iMapIndex);
void AddLightToUndoList(INT32 iMapIndex, INT32 iLightRadius, UINT8 ubLightID);

BOOLEAN RemoveAllFromUndoList();
BOOLEAN ExecuteUndoList();

void EnableUndo();
void DisableUndo();

void DetermineUndoState();

// Undo command flags
const MAX_UNDO_COMMAND_LENGTH = 10;
