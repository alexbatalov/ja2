namespace ja2 {

export interface MAPEDGEPOINTINFO {
  ubNumPoints: UINT8;
  ubStrategicInsertionCode: UINT8;
  sGridNo: UINT16[] /* [32] */;
}

export function createMapEdgePointInfo(): MAPEDGEPOINTINFO {
  return {
    ubNumPoints: 0,
    ubStrategicInsertionCode: 0,
    sGridNo: createArray(32, 0),
  };
}

}
