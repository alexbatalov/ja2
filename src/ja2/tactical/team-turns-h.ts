extern UINT8 gubOutOfTurnPersons;
extern BOOLEAN gfHiddenInterrupt;
extern BOOLEAN gfHiddenTurnbased;

const INTERRUPT_QUEUED = () => (gubOutOfTurnPersons > 0);
