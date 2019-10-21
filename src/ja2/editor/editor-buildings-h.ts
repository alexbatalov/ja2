extern BOOLEAN fBuildingShowRoofs, fBuildingShowWalls, fBuildingShowRoomInfo;
extern UINT8 gubCurrRoomNumber;
extern UINT8 gubMaxRoomNumber;

interface BUILDINGLAYOUTNODE {
  next: Pointer<BUILDINGLAYOUTNODE>;
  sGridNo: INT16;
}

extern BUILDINGLAYOUTNODE *gpBuildingLayoutList;
extern INT16 gsBuildingLayoutAnchorGridNo;

extern BOOLEAN gfEditingDoor;

extern UINT16 usCurrentMode;
