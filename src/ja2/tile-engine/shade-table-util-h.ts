void DetermineRGBDistributionSettings();
BOOLEAN LoadShadeTable(HVOBJECT pObj, UINT32 uiTileTypeIndex);
BOOLEAN SaveShadeTable(HVOBJECT pObj, UINT32 uiTileTypeIndex);

extern CHAR8 TileSurfaceFilenames[NUMBEROFTILETYPES][32];
extern BOOLEAN gfForceBuildShadeTables;

BOOLEAN DeleteShadeTableDir();
