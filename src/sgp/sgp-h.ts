extern BOOLEAN gfProgramIsRunning; // Turn this to FALSE to exit program
extern UINT32 giStartMem;
extern CHAR8 gzCommandLine[100]; // Command line given
extern UINT8 gbPixelDepth; // GLOBAL RUN-TIME SETTINGS
extern BOOLEAN gfDontUseDDBlits; // GLOBAL FOR USE OF DD BLITTING

// function prototypes
void SGPExit(void);
void ShutdownWithErrorBox(CHAR8 *pcMessage);
