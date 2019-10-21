interface MAPEDGEPOINTINFO {
  ubNumPoints: UINT8;
  ubStrategicInsertionCode: UINT8;
  sGridNo: UINT16[] /* [32] */;
}

// dynamic arrays that contain the valid gridno's for each edge
extern INT16 *gps1stNorthEdgepointArray;
extern INT16 *gps1stEastEdgepointArray;
extern INT16 *gps1stSouthEdgepointArray;
extern INT16 *gps1stWestEdgepointArray;
// contains the size for each array
extern UINT16 gus1stNorthEdgepointArraySize;
extern UINT16 gus1stEastEdgepointArraySize;
extern UINT16 gus1stSouthEdgepointArraySize;
extern UINT16 gus1stWestEdgepointArraySize;
// contains the index value for the first array index of the second row of each edgepoint array.
// Because each edgepoint side has two rows, the outside most row is calculated first, then the inside row.
// For purposes of AI, it may become necessary to avoid this.
extern UINT16 gus1stNorthEdgepointMiddleIndex;
extern UINT16 gus1stEastEdgepointMiddleIndex;
extern UINT16 gus1stSouthEdgepointMiddleIndex;
extern UINT16 gus1stWestEdgepointMiddleIndex;

// dynamic arrays that contain the valid gridno's for each edge
extern INT16 *gps2ndNorthEdgepointArray;
extern INT16 *gps2ndEastEdgepointArray;
extern INT16 *gps2ndSouthEdgepointArray;
extern INT16 *gps2ndWestEdgepointArray;
// contains the size for each array
extern UINT16 gus2ndNorthEdgepointArraySize;
extern UINT16 gus2ndEastEdgepointArraySize;
extern UINT16 gus2ndSouthEdgepointArraySize;
extern UINT16 gus2ndWestEdgepointArraySize;
// contains the index value for the first array index of the second row of each edgepoint array.
// Because each edgepoint side has two rows, the outside most row is calculated first, then the inside row.
// For purposes of AI, it may become necessary to avoid this.
extern UINT16 gus2ndNorthEdgepointMiddleIndex;
extern UINT16 gus2ndEastEdgepointMiddleIndex;
extern UINT16 gus2ndSouthEdgepointMiddleIndex;
extern UINT16 gus2ndWestEdgepointMiddleIndex;
