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

export function copyMeanWhileDefinition(destination: MEANWHILE_DEFINITION, source: MEANWHILE_DEFINITION) {
  destination.sSectorX = source.sSectorX;
  destination.sSectorY = source.sSectorY;
  destination.usTriggerEvent = source.usTriggerEvent;
  destination.ubMeanwhileID = source.ubMeanwhileID;
  destination.ubNPCNumber = source.ubNPCNumber;
}

}
