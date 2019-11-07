namespace ja2 {

interface MACROSTRUCT {
  sMacroID: INT16;
  sOffset: INT16;
}

function createMacroStructFrom(sMacroID: INT16, sOffset: INT16): MACROSTRUCT {
  return {
    sMacroID,
    sOffset,
  };
}

// road macros

// These define the macros for the 32 road pieces.  The column contains the macro ID and
// the second contains the gridno offset from the anchor position (where the user clicks in the world to
// place the road).  The actual index of the array refers to the offset from ROADPIECE001.
let gRoadMacros: MACROSTRUCT[] /* [] */ = [
  // left 1
  createMacroStructFrom(Enum54.L1, -2),
  createMacroStructFrom(Enum54.L1, -162),
  createMacroStructFrom(Enum54.L1, -322),
  createMacroStructFrom(Enum54.L1, -1),
  createMacroStructFrom(Enum54.L1, -161),
  createMacroStructFrom(Enum54.L1, -321),
  createMacroStructFrom(Enum54.L1, 0),
  createMacroStructFrom(Enum54.L1, -160),
  createMacroStructFrom(Enum54.L1, -320),
  // right 1
  createMacroStructFrom(Enum54.R1, -2),
  createMacroStructFrom(Enum54.R1, -162),
  createMacroStructFrom(Enum54.R1, -322),
  createMacroStructFrom(Enum54.R1, -1),
  createMacroStructFrom(Enum54.R1, -161),
  createMacroStructFrom(Enum54.R1, -321),
  createMacroStructFrom(Enum54.R1, 0),
  createMacroStructFrom(Enum54.R1, -160),
  createMacroStructFrom(Enum54.R1, -320),
  // bottom 1
  createMacroStructFrom(Enum54.B1, -2),
  createMacroStructFrom(Enum54.B1, -162),
  createMacroStructFrom(Enum54.B1, -322),
  createMacroStructFrom(Enum54.B1, -1),
  createMacroStructFrom(Enum54.B1, -161),
  createMacroStructFrom(Enum54.B1, -321),
  createMacroStructFrom(Enum54.B1, 0),
  createMacroStructFrom(Enum54.B1, -160),
  createMacroStructFrom(Enum54.B1, -320),
  // top 1
  createMacroStructFrom(Enum54.T1, -2),
  createMacroStructFrom(Enum54.T1, -162),
  createMacroStructFrom(Enum54.T1, -322),
  createMacroStructFrom(Enum54.T1, -1),
  createMacroStructFrom(Enum54.T1, -161),
  createMacroStructFrom(Enum54.T1, -321),
  createMacroStructFrom(Enum54.T1, 0),
  createMacroStructFrom(Enum54.T1, -160),
  createMacroStructFrom(Enum54.T1, -320),
  // top half of top-right corner
  createMacroStructFrom(Enum54.TTR, -4),
  createMacroStructFrom(Enum54.TTR, -164),
  createMacroStructFrom(Enum54.TTR, -324),
  createMacroStructFrom(Enum54.TTR, -3),
  createMacroStructFrom(Enum54.TTR, -163),
  createMacroStructFrom(Enum54.TTR, -323),
  createMacroStructFrom(Enum54.TTR, -2),
  createMacroStructFrom(Enum54.TTR, -162),
  createMacroStructFrom(Enum54.TTR, -1),
  createMacroStructFrom(Enum54.TTR, -161),
  createMacroStructFrom(Enum54.TTR, 0),
  // bottom half of top-right corner
  createMacroStructFrom(Enum54.BTR, -5),
  createMacroStructFrom(Enum54.BTR, -165),
  createMacroStructFrom(Enum54.BTR, -325),
  createMacroStructFrom(Enum54.BTR, -4), // 50
  createMacroStructFrom(Enum54.BTR, -164),
  createMacroStructFrom(Enum54.BTR, -324),
  createMacroStructFrom(Enum54.BTR, -3),
  createMacroStructFrom(Enum54.BTR, -163),
  createMacroStructFrom(Enum54.BTR, -323),
  createMacroStructFrom(Enum54.BTR, -2),
  createMacroStructFrom(Enum54.BTR, -162),
  createMacroStructFrom(Enum54.BTR, -322),
  createMacroStructFrom(Enum54.BTR, -1),
  createMacroStructFrom(Enum54.BTR, -161),
  createMacroStructFrom(Enum54.BTR, -321),
  createMacroStructFrom(Enum54.BTR, 0),
  createMacroStructFrom(Enum54.BTR, -160),
  // left half of bottom-left corner
  createMacroStructFrom(Enum54.LBL, -322),
  createMacroStructFrom(Enum54.LBL, -482),
  createMacroStructFrom(Enum54.LBL, -642),
  createMacroStructFrom(Enum54.LBL, -161),
  createMacroStructFrom(Enum54.LBL, -321),
  createMacroStructFrom(Enum54.LBL, -481),
  createMacroStructFrom(Enum54.LBL, -641),
  createMacroStructFrom(Enum54.LBL, 0),
  createMacroStructFrom(Enum54.LBL, -160),
  createMacroStructFrom(Enum54.LBL, -320),
  createMacroStructFrom(Enum54.LBL, -480),
  createMacroStructFrom(Enum54.LBL, -640),
  // right half of bottom-left corner
  createMacroStructFrom(Enum54.RBL, -162),
  createMacroStructFrom(Enum54.RBL, -322),
  createMacroStructFrom(Enum54.RBL, -482),
  createMacroStructFrom(Enum54.RBL, -642),
  createMacroStructFrom(Enum54.RBL, -802),
  createMacroStructFrom(Enum54.RBL, -1),
  createMacroStructFrom(Enum54.RBL, -161),
  createMacroStructFrom(Enum54.RBL, -321),
  createMacroStructFrom(Enum54.RBL, -481),
  createMacroStructFrom(Enum54.RBL, -641),
  createMacroStructFrom(Enum54.RBL, -801),
  createMacroStructFrom(Enum54.RBL, 0),
  createMacroStructFrom(Enum54.RBL, -160),
  createMacroStructFrom(Enum54.RBL, -320),
  createMacroStructFrom(Enum54.RBL, -480),
  createMacroStructFrom(Enum54.RBL, -640),
  createMacroStructFrom(Enum54.RBL, -800),
  // left half of the top-left corner
  createMacroStructFrom(Enum54.LTL, -2),
  createMacroStructFrom(Enum54.LTL, -162),
  createMacroStructFrom(Enum54.LTL, -322),
  createMacroStructFrom(Enum54.LTL, -1),
  createMacroStructFrom(Enum54.LTL, -161),
  createMacroStructFrom(Enum54.LTL, -321),
  createMacroStructFrom(Enum54.LTL, -481),
  createMacroStructFrom(Enum54.LTL, 0), // 100
  createMacroStructFrom(Enum54.LTL, -160),
  createMacroStructFrom(Enum54.LTL, -320),
  createMacroStructFrom(Enum54.LTL, -480),
  createMacroStructFrom(Enum54.LTL, -640),
  // right half of top-left corner
  createMacroStructFrom(Enum54.RTL, -2),
  createMacroStructFrom(Enum54.RTL, -162),
  createMacroStructFrom(Enum54.RTL, -322),
  createMacroStructFrom(Enum54.RTL, -482),
  createMacroStructFrom(Enum54.RTL, -642),
  createMacroStructFrom(Enum54.RTL, -802),
  createMacroStructFrom(Enum54.RTL, -1),
  createMacroStructFrom(Enum54.RTL, -161),
  createMacroStructFrom(Enum54.RTL, -321),
  createMacroStructFrom(Enum54.RTL, -481),
  createMacroStructFrom(Enum54.RTL, -641),
  createMacroStructFrom(Enum54.RTL, -801),
  createMacroStructFrom(Enum54.RTL, 0),
  createMacroStructFrom(Enum54.RTL, -160),
  createMacroStructFrom(Enum54.RTL, -320),
  createMacroStructFrom(Enum54.RTL, -480),
  createMacroStructFrom(Enum54.RTL, -640),
  createMacroStructFrom(Enum54.RTL, -800),
  // right half of top-left corner
  createMacroStructFrom(Enum54.RBR, 159),
  createMacroStructFrom(Enum54.RBR, -1),
  createMacroStructFrom(Enum54.RBR, -161),
  createMacroStructFrom(Enum54.RBR, -321),
  createMacroStructFrom(Enum54.RBR, -481),
  createMacroStructFrom(Enum54.RBR, -641),
  createMacroStructFrom(Enum54.RBR, 0),
  createMacroStructFrom(Enum54.RBR, -160),
  createMacroStructFrom(Enum54.RBR, -320),
  createMacroStructFrom(Enum54.RBR, -480),
  createMacroStructFrom(Enum54.RBR, -640),
  createMacroStructFrom(Enum54.RBR, -159),
  createMacroStructFrom(Enum54.RBR, -319),
  createMacroStructFrom(Enum54.RBR, -479),
  createMacroStructFrom(Enum54.RBR, -639),
  // right half of top-left corner
  createMacroStructFrom(Enum54.LBR, 158),
  createMacroStructFrom(Enum54.LBR, -2),
  createMacroStructFrom(Enum54.LBR, -162),
  createMacroStructFrom(Enum54.LBR, -322),
  createMacroStructFrom(Enum54.LBR, -482),
  createMacroStructFrom(Enum54.LBR, -642),
  createMacroStructFrom(Enum54.LBR, 159),
  createMacroStructFrom(Enum54.LBR, -1),
  createMacroStructFrom(Enum54.LBR, -161),
  createMacroStructFrom(Enum54.LBR, -321),
  createMacroStructFrom(Enum54.LBR, -481),
  createMacroStructFrom(Enum54.LBR, -641),
  createMacroStructFrom(Enum54.LBR, 160), // 150
  createMacroStructFrom(Enum54.LBR, 0),
  createMacroStructFrom(Enum54.LBR, -160),
  createMacroStructFrom(Enum54.LBR, -320),
  createMacroStructFrom(Enum54.LBR, -480),
  createMacroStructFrom(Enum54.LBR, -640),
  // left 2
  createMacroStructFrom(Enum54.L2, -2),
  createMacroStructFrom(Enum54.L2, -162),
  createMacroStructFrom(Enum54.L2, -322),
  createMacroStructFrom(Enum54.L2, -1),
  createMacroStructFrom(Enum54.L2, -161),
  createMacroStructFrom(Enum54.L2, -321),
  createMacroStructFrom(Enum54.L2, 0),
  createMacroStructFrom(Enum54.L2, -160),
  createMacroStructFrom(Enum54.L2, -320),
  // right 2
  createMacroStructFrom(Enum54.R2, -2),
  createMacroStructFrom(Enum54.R2, -162),
  createMacroStructFrom(Enum54.R2, -322),
  createMacroStructFrom(Enum54.R2, -1),
  createMacroStructFrom(Enum54.R2, -161),
  createMacroStructFrom(Enum54.R2, -321),
  createMacroStructFrom(Enum54.R2, 0),
  createMacroStructFrom(Enum54.R2, -160),
  createMacroStructFrom(Enum54.R2, -320),
  // left 3
  createMacroStructFrom(Enum54.L3, -2),
  createMacroStructFrom(Enum54.L3, -162),
  createMacroStructFrom(Enum54.L3, -322),
  createMacroStructFrom(Enum54.L3, -1),
  createMacroStructFrom(Enum54.L3, -161),
  createMacroStructFrom(Enum54.L3, -321),
  createMacroStructFrom(Enum54.L3, 0),
  createMacroStructFrom(Enum54.L3, -160),
  createMacroStructFrom(Enum54.L3, -320),
  // right 3
  createMacroStructFrom(Enum54.R3, -2),
  createMacroStructFrom(Enum54.R3, -162),
  createMacroStructFrom(Enum54.R3, -322),
  createMacroStructFrom(Enum54.R3, -1),
  createMacroStructFrom(Enum54.R3, -161),
  createMacroStructFrom(Enum54.R3, -321),
  createMacroStructFrom(Enum54.R3, 0),
  createMacroStructFrom(Enum54.R3, -160),
  createMacroStructFrom(Enum54.R3, -320),
  // bottom 2
  createMacroStructFrom(Enum54.B2, -2),
  createMacroStructFrom(Enum54.B2, -162),
  createMacroStructFrom(Enum54.B2, -322),
  createMacroStructFrom(Enum54.B2, -1),
  createMacroStructFrom(Enum54.B2, -161),
  createMacroStructFrom(Enum54.B2, -321),
  createMacroStructFrom(Enum54.B2, 0),
  createMacroStructFrom(Enum54.B2, -160),
  createMacroStructFrom(Enum54.B2, -320), // 200
  // top 2
  createMacroStructFrom(Enum54.T2, -2),
  createMacroStructFrom(Enum54.T2, -162),
  createMacroStructFrom(Enum54.T2, -322),
  createMacroStructFrom(Enum54.T2, -1),
  createMacroStructFrom(Enum54.T2, -161),
  createMacroStructFrom(Enum54.T2, -321),
  createMacroStructFrom(Enum54.T2, 0),
  createMacroStructFrom(Enum54.T2, -160),
  createMacroStructFrom(Enum54.T2, -320),
  // bottom 3
  createMacroStructFrom(Enum54.B3, -2),
  createMacroStructFrom(Enum54.B3, -162),
  createMacroStructFrom(Enum54.B3, -322),
  createMacroStructFrom(Enum54.B3, -1),
  createMacroStructFrom(Enum54.B3, -161),
  createMacroStructFrom(Enum54.B3, -321),
  createMacroStructFrom(Enum54.B3, 0),
  createMacroStructFrom(Enum54.B3, -160),
  createMacroStructFrom(Enum54.B3, -320),
  // top 3
  createMacroStructFrom(Enum54.T3, -2),
  createMacroStructFrom(Enum54.T3, -162),
  createMacroStructFrom(Enum54.T3, -322),
  createMacroStructFrom(Enum54.T3, -1),
  createMacroStructFrom(Enum54.T3, -161),
  createMacroStructFrom(Enum54.T3, -321),
  createMacroStructFrom(Enum54.T3, 0),
  createMacroStructFrom(Enum54.T3, -160),
  createMacroStructFrom(Enum54.T3, -320),
  // bottom interior
  createMacroStructFrom(Enum54.BI, -2),
  createMacroStructFrom(Enum54.BI, -162),
  createMacroStructFrom(Enum54.BI, -322),
  createMacroStructFrom(Enum54.BI, -1),
  createMacroStructFrom(Enum54.BI, -161),
  createMacroStructFrom(Enum54.BI, -321),
  createMacroStructFrom(Enum54.BI, 0),
  createMacroStructFrom(Enum54.BI, -160),
  createMacroStructFrom(Enum54.BI, -320),
  // left interior
  createMacroStructFrom(Enum54.LI, -2),
  createMacroStructFrom(Enum54.LI, -162),
  createMacroStructFrom(Enum54.LI, -322),
  createMacroStructFrom(Enum54.LI, -1),
  createMacroStructFrom(Enum54.LI, -161),
  createMacroStructFrom(Enum54.LI, -321),
  createMacroStructFrom(Enum54.LI, 0),
  createMacroStructFrom(Enum54.LI, -160),
  createMacroStructFrom(Enum54.LI, -320),
  // top interior
  createMacroStructFrom(Enum54.TI, -2),
  createMacroStructFrom(Enum54.TI, -162),
  createMacroStructFrom(Enum54.TI, -322),
  createMacroStructFrom(Enum54.TI, -1),
  createMacroStructFrom(Enum54.TI, -161), // 250
  createMacroStructFrom(Enum54.TI, -321),
  createMacroStructFrom(Enum54.TI, 0),
  createMacroStructFrom(Enum54.TI, -160),
  createMacroStructFrom(Enum54.TI, -320),
  // right interior
  createMacroStructFrom(Enum54.RI, -2), // 0
  createMacroStructFrom(Enum54.RI, -162),
  createMacroStructFrom(Enum54.RI, -322),
  createMacroStructFrom(Enum54.RI, -1),
  createMacroStructFrom(Enum54.RI, -161),
  createMacroStructFrom(Enum54.RI, -321),
  createMacroStructFrom(Enum54.RI, 0),
  createMacroStructFrom(Enum54.RI, -160),
  createMacroStructFrom(Enum54.RI, -320),
  // left 4
  createMacroStructFrom(Enum54.L4, -2),
  createMacroStructFrom(Enum54.L4, -162),
  createMacroStructFrom(Enum54.L4, -322),
  createMacroStructFrom(Enum54.L4, -1),
  createMacroStructFrom(Enum54.L4, -161),
  createMacroStructFrom(Enum54.L4, -321),
  createMacroStructFrom(Enum54.L4, 0),
  createMacroStructFrom(Enum54.L4, -160),
  createMacroStructFrom(Enum54.L4, -320),
  // right 4
  createMacroStructFrom(Enum54.R4, -2),
  createMacroStructFrom(Enum54.R4, -162),
  createMacroStructFrom(Enum54.R4, -322),
  createMacroStructFrom(Enum54.R4, -1),
  createMacroStructFrom(Enum54.R4, -161),
  createMacroStructFrom(Enum54.R4, -321),
  createMacroStructFrom(Enum54.R4, 0),
  createMacroStructFrom(Enum54.R4, -160),
  createMacroStructFrom(Enum54.R4, -320),
  // bottom 4
  createMacroStructFrom(Enum54.B4, -2),
  createMacroStructFrom(Enum54.B4, -162),
  createMacroStructFrom(Enum54.B4, -322),
  createMacroStructFrom(Enum54.B4, -1),
  createMacroStructFrom(Enum54.B4, -161),
  createMacroStructFrom(Enum54.B4, -321),
  createMacroStructFrom(Enum54.B4, 0),
  createMacroStructFrom(Enum54.B4, -160),
  createMacroStructFrom(Enum54.B4, -320),
  // top 4
  createMacroStructFrom(Enum54.T4, -2),
  createMacroStructFrom(Enum54.T4, -162),
  createMacroStructFrom(Enum54.T4, -322),
  createMacroStructFrom(Enum54.T4, -1),
  createMacroStructFrom(Enum54.T4, -161),
  createMacroStructFrom(Enum54.T4, -321),
  createMacroStructFrom(Enum54.T4, 0),
  createMacroStructFrom(Enum54.T4, -160),
  createMacroStructFrom(Enum54.T4, -320),
  // right edge (end of road)
  createMacroStructFrom(Enum54.RE, 0),
  createMacroStructFrom(Enum54.RE, -160),
  createMacroStructFrom(Enum54.RE, -320),
  // left edge
  createMacroStructFrom(Enum54.LE, 0),
  createMacroStructFrom(Enum54.LE, -160),
  createMacroStructFrom(Enum54.LE, -320),
  // bottom edge
  createMacroStructFrom(Enum54.BE, -2),
  createMacroStructFrom(Enum54.BE, -1),
  createMacroStructFrom(Enum54.BE, 0),
  // top edge
  createMacroStructFrom(Enum54.TE, -2),
  createMacroStructFrom(Enum54.TE, -1),
  createMacroStructFrom(Enum54.TE, 0)
];

let gsRoadMacroStartIndex: INT16[] /* [NUM_ROAD_MACROS] */;

// A simple optimization function that calculates the first index in the large database for
// the particular macro ID.
export function InitializeRoadMacros(): void {
  let i: INT16;
  let end: INT16;
  let sMacro: INT16 = 0;
  end = sizeof(gRoadMacros) / 4;
  for (i = 0; i < end; i++) {
    if (i >= sizeof(gRoadMacros) / sizeof(MACROSTRUCT)) {
      i = i;
    }
    if (gRoadMacros[i].sMacroID == sMacro) {
      gsRoadMacroStartIndex[sMacro] = i;
      sMacro++;
    }
  }
  //	i = ROADPIECES001;
}

// Road macros vary in size from 3 gridnos to 18 gridnos.  Using the anchor gridno based off of the original
// road system, this function will place the new macro (consisting of multiple road pieces in multiple
// gridnos).
export function PlaceRoadMacroAtGridNo(iMapIndex: INT32, iMacroID: INT32): void {
  let i: INT32;
  let usTileIndex: UINT16;
  i = gsRoadMacroStartIndex[iMacroID];
  while (gRoadMacros[i].sMacroID == iMacroID) {
    AddToUndoList(iMapIndex + gRoadMacros[i].sOffset);
    RemoveAllObjectsOfTypeRange(i, Enum313.ROADPIECES, Enum313.ROADPIECES);
    GetTileIndexFromTypeSubIndex(Enum313.ROADPIECES, (i + 1), addressof(usTileIndex));
    AddObjectToHead(iMapIndex + gRoadMacros[i].sOffset, usTileIndex);
    i++;
  }
}

// The old road system used multi-tiled roads as a single image.  The new road system has taken these large
// pieces and chopped them up into single tiled images (to mitigate lighting problems).  Some of the larger
// road pieces turned into 18 smaller pieces.  So this function will go analyse the world, and replaces any
// locations containing the original road tile information, delete it, and replace it by inserting it's
// equivalent macro.
export function ReplaceObsoleteRoads(): void {
  let i: INT32;
  let iMacro: INT32;
  let pObject: Pointer<LEVELNODE>;
  let fRoadExistsAtGridNo: boolean;
  for (i = 0; i < WORLD_MAX; i++) {
    pObject = gpWorldLevelData[i].pObjectHead;
    fRoadExistsAtGridNo = false;
    while (pObject) {
      if (pObject.value.usIndex >= Enum312.FIRSTROAD1 && pObject.value.usIndex <= Enum312.FIRSTROAD32) {
        fRoadExistsAtGridNo = true;
        iMacro = pObject.value.usIndex - Enum312.FIRSTROAD1;
        PlaceRoadMacroAtGridNo(i, iMacro);
      }
      pObject = pObject.value.pNext;
    }
    if (fRoadExistsAtGridNo) {
      RemoveAllObjectsOfTypeRange(i, Enum313.FIRSTROAD, Enum313.FIRSTROAD);
    }
  }
}

}
