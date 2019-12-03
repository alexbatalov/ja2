namespace ja2 {

export const enum Enum160 {
  END_OF_PLAYERS_FIRST_BATTLE,
  DRASSEN_LIBERATED,
  CAMBRIA_LIBERATED,
  ALMA_LIBERATED,
  GRUMM_LIBERATED,
  CHITZENA_LIBERATED,
  NW_SAM,
  NE_SAM,
  CENTRAL_SAM,
  FLOWERS,
  LOST_TOWN,
  INTERROGATION,
  CREATURES,
  KILL_CHOPPER,
  AWOL_SCIENTIST,
  OUTSKIRTS_MEDUNA,
  BALIME_LIBERATED,
  NUM_MEANWHILES,
}

export interface MEANWHILE_DEFINITION {
  sSectorX: INT16;
  sSectorY: INT16;
  usTriggerEvent: UINT16;

  ubMeanwhileID: UINT8;
  ubNPCNumber: UINT8;
}

export function createMeanwhileDefinition(): MEANWHILE_DEFINITION {
  return {
    sSectorX: 0,
    sSectorY: 0,
    usTriggerEvent: 0,

    ubMeanwhileID: 0,
    ubNPCNumber: 0,
  };
}

export function resetMeanwhileDefinition(o: MEANWHILE_DEFINITION) {
  o.sSectorX = 0;
  o.sSectorY = 0;
  o.usTriggerEvent = 0;
  o.ubMeanwhileID = 0;
  o.ubNPCNumber = 0;
}

export function copyMeanwhileDefinition(destination: MEANWHILE_DEFINITION, source: MEANWHILE_DEFINITION) {
  destination.sSectorX = source.sSectorX;
  destination.sSectorY = source.sSectorY;
  destination.usTriggerEvent = source.usTriggerEvent;
  destination.ubMeanwhileID = source.ubMeanwhileID;
  destination.ubNPCNumber = source.ubNPCNumber;
}

export const MEANWHILE_DEFINITION_SIZE = 8;

export function readMeanwhileDefinition(o: MEANWHILE_DEFINITION, buffer: Buffer, offset: number = 0): number {
  o.sSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readInt16LE(offset); offset += 2;
  o.usTriggerEvent = buffer.readUInt16LE(offset); offset += 2;
  o.ubMeanwhileID = buffer.readUInt8(offset++);
  o.ubNPCNumber = buffer.readUInt8(offset++);
  return offset;
}

export function writeMeanwhileDefinition(o: MEANWHILE_DEFINITION, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sSectorX, offset);
  offset = buffer.writeInt16LE(o.sSectorY, offset);
  offset = buffer.writeUInt16LE(o.usTriggerEvent, offset);
  offset = buffer.writeUInt8(o.ubMeanwhileID, offset);
  offset = buffer.writeUInt8(o.ubNPCNumber, offset);
  return offset;
}

}
