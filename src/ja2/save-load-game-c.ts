namespace ja2 {

/////////////////////////////////////////////////////
//
// Local Defines
//
/////////////////////////////////////////////////////

// Global variable used

let gMusicModeToPlay: UINT8 /* boolean */ = 0;

let gfUseConsecutiveQuickSaveSlots: boolean = false;
let guiCurrentQuickSaveNumber: UINT32 = 0;
export let guiLastSaveGameNum: UINT32;

export let guiJA2EncryptionSet: UINT32 = 0;

interface GENERAL_SAVE_INFO {
  // The screen that the gaem was saved from
  uiCurrentScreen: UINT32;

  uiCurrentUniqueSoldierId: UINT32;

  // The music that was playing when the game was saved
  ubMusicMode: UINT8;

  // Flag indicating that we have purchased something from Tony
  fHavePurchasedItemsFromTony: boolean;

  // The selected soldier in tactical
  usSelectedSoldier: UINT16;

  // The x and y scroll position
  sRenderCenterX: INT16;
  sRenderCenterY: INT16;

  fAtLeastOneMercWasHired: boolean;

  // General Map screen state flags
  fShowItemsFlag: boolean;
  fShowTownFlag: boolean;
  fShowTeamFlag: boolean;
  fShowMineFlag: boolean;
  fShowAircraftFlag: boolean;

  // is the helicopter available to player?
  fHelicopterAvailable: boolean;

  // helicopter vehicle id
  iHelicopterVehicleId: INT32;

  // total distance travelled
  UNUSEDiTotalHeliDistanceSinceRefuel: INT32;

  // total owed to player
  iTotalAccumulatedCostByPlayer: INT32;

  // whether or not skyrider is alive and well? and on our side yet?
  fSkyRiderAvailable: boolean;

  // skyrider engaging in a monologue
  UNUSEDfSkyriderMonologue: boolean;

  // list of sector locations
  UNUSED: INT16[][] /* [2][2] */;

  // is the heli in the air?
  fHelicopterIsAirBorne: boolean;

  // is the pilot returning straight to base?
  fHeliReturnStraightToBase: boolean;

  // heli hovering
  fHoveringHelicopter: boolean;

  // time started hovering
  uiStartHoverTime: UINT32;

  // what state is skyrider's dialogue in in?
  uiHelicopterSkyriderTalkState: UINT32;

  // the flags for skyrider events
  fShowEstoniRefuelHighLight: boolean;
  fShowOtherSAMHighLight: boolean;
  fShowDrassenSAMHighLight: boolean;

  uiEnvWeather: UINT32;

  ubDefaultButton: UINT8;

  fSkyriderEmptyHelpGiven: boolean;
  fEnterMapDueToContract: boolean;
  ubHelicopterHitsTaken: UINT8;
  ubQuitType: UINT8;
  fSkyriderSaidCongratsOnTakingSAM: boolean;
  sContractRehireSoldierID: INT16;

  GameOptions: GAME_OPTIONS;

  uiSeedNumber: UINT32;

  // The GetJA2Clock() value
  uiBaseJA2Clock: UINT32;

  sCurInterfacePanel: INT16;

  ubSMCurrentMercID: UINT8;

  fFirstTimeInMapScreen: boolean;

  fDisableDueToBattleRoster: boolean;

  fDisableMapInterfaceDueToBattle: boolean;

  sBoxerGridNo: INT16[] /* [NUM_BOXERS] */;
  ubBoxerID: UINT8[] /* [NUM_BOXERS] */;
  fBoxerFought: boolean[] /* [NUM_BOXERS] */;

  fHelicopterDestroyed: boolean; // if the chopper is destroyed
  fShowMapScreenHelpText: boolean; // If true, displays help in mapscreen

  iSortStateForMapScreenList: INT32;
  fFoundTixa: boolean;

  uiTimeOfLastSkyriderMonologue: UINT32;
  fShowCambriaHospitalHighLight: boolean;
  fSkyRiderSetUp: boolean;
  fRefuelingSiteAvailable: boolean[] /* [NUMBER_OF_REFUEL_SITES] */;

  // Meanwhile stuff
  gCurrentMeanwhileDef: MEANWHILE_DEFINITION;

  ubPlayerProgressSkyriderLastCommentedOn: UINT8 /* boolean */;

  gfMeanwhileTryingToStart: boolean;
  gfInMeanwhile: boolean;

  // list of dead guys for squads...in id values -> -1 means no one home
  sDeadMercs: INT16[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */;

  // levels of publicly known noises
  gbPublicNoiseLevel: INT8[] /* [MAXTEAMS] */;

  gubScreenCount: UINT8;

  usOldMeanWhileFlags: UINT16;

  iPortraitNumber: INT32;

  sWorldSectorLocationOfFirstBattle: INT16;

  fUnReadMailFlag: boolean;
  fNewMailFlag: boolean;
  fOldUnReadFlag: boolean;
  fOldNewMailFlag: boolean;

  fShowMilitia: boolean;

  fNewFilesInFileViewer: boolean;

  fLastBoxingMatchWonByPlayer: boolean;

  uiUNUSED: UINT32;

  fSamSiteFound: boolean[] /* [NUMBER_OF_SAMS] */;

  ubNumTerrorists: UINT8;
  ubCambriaMedicalObjects: UINT8;

  fDisableTacticalPanelButtons: boolean;

  sSelMapX: INT16;
  sSelMapY: INT16;
  iCurrentMapSectorZ: INT32;

  usHasPlayerSeenHelpScreenInCurrentScreen: UINT16;
  fHideHelpInAllScreens: boolean;
  ubBoxingMatchesWon: UINT8;

  ubBoxersRests: UINT8;
  fBoxersResting: boolean;
  ubDesertTemperature: UINT8;
  ubGlobalTemperature: UINT8;

  sMercArriveSectorX: INT16;
  sMercArriveSectorY: INT16;

  fCreatureMeanwhileScenePlayed: boolean;
  ubPlayerNum: UINT8;
  // New stuff for the Prebattle interface / autoresolve
  fPersistantPBI: boolean;
  ubEnemyEncounterCode: UINT8;

  ubExplicitEnemyEncounterCode: UINT8 /* boolean */;
  fBlitBattleSectorLocator: boolean;
  ubPBSectorX: UINT8;
  ubPBSectorY: UINT8;

  ubPBSectorZ: UINT8;
  fCantRetreatInPBI: boolean;
  fExplosionQueueActive: boolean;
  ubUnused: UINT8[] /* [1] */;

  uiMeanWhileFlags: UINT32;

  bSelectedInfoChar: INT8;
  bHospitalPriceModifier: INT8;
  bUnused2: INT8[] /* [2] */;

  iHospitalTempBalance: INT32;
  iHospitalRefund: INT32;

  fPlayerTeamSawJoey: boolean /* INT8 */;
  fMikeShouldSayHi: INT8;

  ubFiller: UINT8[] /* [550] */; // This structure should be 1024 bytes
}

export function createGeneralSaveInfo(): GENERAL_SAVE_INFO {
  return {
    uiCurrentScreen: 0,
    uiCurrentUniqueSoldierId: 0,
    ubMusicMode: 0,
    fHavePurchasedItemsFromTony: false,
    usSelectedSoldier: 0,
    sRenderCenterX: 0,
    sRenderCenterY: 0,
    fAtLeastOneMercWasHired: false,
    fShowItemsFlag: false,
    fShowTownFlag: false,
    fShowTeamFlag: false,
    fShowMineFlag: false,
    fShowAircraftFlag: false,
    fHelicopterAvailable: false,
    iHelicopterVehicleId: 0,
    UNUSEDiTotalHeliDistanceSinceRefuel: 0,
    iTotalAccumulatedCostByPlayer: 0,
    fSkyRiderAvailable: false,
    UNUSEDfSkyriderMonologue: false,
    UNUSED: createArrayFrom(2, () => createArray(2, 0)),
    fHelicopterIsAirBorne: false,
    fHeliReturnStraightToBase: false,
    fHoveringHelicopter: false,
    uiStartHoverTime: 0,
    uiHelicopterSkyriderTalkState: 0,
    fShowEstoniRefuelHighLight: false,
    fShowOtherSAMHighLight: false,
    fShowDrassenSAMHighLight: false,
    uiEnvWeather: 0,
    ubDefaultButton: 0,
    fSkyriderEmptyHelpGiven: false,
    fEnterMapDueToContract: false,
    ubHelicopterHitsTaken: 0,
    ubQuitType: 0,
    fSkyriderSaidCongratsOnTakingSAM: false,
    sContractRehireSoldierID: 0,
    GameOptions: createGameOptions(),
    uiSeedNumber: 0,
    uiBaseJA2Clock: 0,
    sCurInterfacePanel: 0,
    ubSMCurrentMercID: 0,
    fFirstTimeInMapScreen: false,
    fDisableDueToBattleRoster: false,
    fDisableMapInterfaceDueToBattle: false,
    sBoxerGridNo: createArray(NUM_BOXERS, 0),
    ubBoxerID: createArray(NUM_BOXERS, 0),
    fBoxerFought: createArray(NUM_BOXERS, false),
    fHelicopterDestroyed: false,
    fShowMapScreenHelpText: false,
    iSortStateForMapScreenList: 0,
    fFoundTixa: false,
    uiTimeOfLastSkyriderMonologue: 0,
    fShowCambriaHospitalHighLight: false,
    fSkyRiderSetUp: false,
    fRefuelingSiteAvailable: createArray(Enum137.NUMBER_OF_REFUEL_SITES, false),
    gCurrentMeanwhileDef: createMeanwhileDefinition(),
    ubPlayerProgressSkyriderLastCommentedOn: 0,
    gfMeanwhileTryingToStart: false,
    gfInMeanwhile: false,
    sDeadMercs: createArrayFrom(Enum275.NUMBER_OF_SQUADS, () => createArray(NUMBER_OF_SOLDIERS_PER_SQUAD, 0)),
    gbPublicNoiseLevel: createArray(MAXTEAMS, 0),
    gubScreenCount: 0,
    usOldMeanWhileFlags: 0,
    iPortraitNumber: 0,
    sWorldSectorLocationOfFirstBattle: 0,
    fUnReadMailFlag: false,
    fNewMailFlag: false,
    fOldUnReadFlag: false,
    fOldNewMailFlag: false,
    fShowMilitia: false,
    fNewFilesInFileViewer: false,
    fLastBoxingMatchWonByPlayer: false,
    uiUNUSED: 0,
    fSamSiteFound: createArray(NUMBER_OF_SAMS, false),
    ubNumTerrorists: 0,
    ubCambriaMedicalObjects: 0,
    fDisableTacticalPanelButtons: false,
    sSelMapX: 0,
    sSelMapY: 0,
    iCurrentMapSectorZ: 0,
    usHasPlayerSeenHelpScreenInCurrentScreen: 0,
    fHideHelpInAllScreens: false,
    ubBoxingMatchesWon: 0,
    ubBoxersRests: 0,
    fBoxersResting: false,
    ubDesertTemperature: 0,
    ubGlobalTemperature: 0,
    sMercArriveSectorX: 0,
    sMercArriveSectorY: 0,
    fCreatureMeanwhileScenePlayed: false,
    ubPlayerNum: 0,
    fPersistantPBI: false,
    ubEnemyEncounterCode: 0,
    ubExplicitEnemyEncounterCode: 0,
    fBlitBattleSectorLocator: false,
    ubPBSectorX: 0,
    ubPBSectorY: 0,
    ubPBSectorZ: 0,
    fCantRetreatInPBI: false,
    fExplosionQueueActive: false,
    ubUnused: createArray(1, 0),
    uiMeanWhileFlags: 0,
    bSelectedInfoChar: 0,
    bHospitalPriceModifier: 0,
    bUnused2: createArray(2, 0),
    iHospitalTempBalance: 0,
    iHospitalRefund: 0,
    fPlayerTeamSawJoey: false,
    fMikeShouldSayHi: 0,
    ubFiller: createArray(550, 0),
  };
}

export const GENERAL_SAVE_INFO_SIZE = 1024;

export function readGeneralSaveInfo(o: GENERAL_SAVE_INFO, buffer: Buffer, offset: number = 0): number {
  o.uiCurrentScreen = buffer.readUInt32LE(offset); offset += 4;
  o.uiCurrentUniqueSoldierId = buffer.readUInt32LE(offset); offset += 4;
  o.ubMusicMode = buffer.readUInt8(offset++);
  o.fHavePurchasedItemsFromTony = Boolean(buffer.readUInt8(offset++));
  o.usSelectedSoldier = buffer.readUInt16LE(offset); offset += 2;
  o.sRenderCenterX = buffer.readInt16LE(offset); offset += 2;
  o.sRenderCenterY = buffer.readInt16LE(offset); offset += 2;
  o.fAtLeastOneMercWasHired = Boolean(buffer.readUInt8(offset++));
  o.fShowItemsFlag = Boolean(buffer.readUInt8(offset++));
  o.fShowTownFlag = Boolean(buffer.readUInt8(offset++));
  o.fShowTeamFlag = Boolean(buffer.readUInt8(offset++));
  o.fShowMineFlag = Boolean(buffer.readUInt8(offset++));
  o.fShowAircraftFlag = Boolean(buffer.readUInt8(offset++));
  o.fHelicopterAvailable = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.iHelicopterVehicleId = buffer.readInt32LE(offset); offset += 4;
  o.UNUSEDiTotalHeliDistanceSinceRefuel = buffer.readInt32LE(offset); offset += 4;
  o.iTotalAccumulatedCostByPlayer = buffer.readInt32LE(offset); offset += 4;
  o.fSkyRiderAvailable = Boolean(buffer.readUInt8(offset++));
  o.UNUSEDfSkyriderMonologue = Boolean(buffer.readUInt8(offset++));
  for (let i = 0; i < o.UNUSED.length; i++) {
    offset = readIntArray(o.UNUSED[i], buffer, offset, 2);
  }
  o.fHelicopterIsAirBorne = Boolean(buffer.readUInt8(offset++));
  o.fHeliReturnStraightToBase = Boolean(buffer.readUInt8(offset++));
  o.fHoveringHelicopter = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.uiStartHoverTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiHelicopterSkyriderTalkState = buffer.readUInt32LE(offset); offset += 4;
  o.fShowEstoniRefuelHighLight = Boolean(buffer.readUInt8(offset++));
  o.fShowOtherSAMHighLight = Boolean(buffer.readUInt8(offset++));
  o.fShowDrassenSAMHighLight = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.uiEnvWeather = buffer.readUInt32LE(offset); offset += 4;
  o.ubDefaultButton = buffer.readUInt8(offset++);
  o.fSkyriderEmptyHelpGiven = Boolean(buffer.readUInt8(offset++));
  o.fEnterMapDueToContract = Boolean(buffer.readUInt8(offset++));
  o.ubHelicopterHitsTaken = buffer.readUInt8(offset++);
  o.ubQuitType = buffer.readUInt8(offset++);
  o.fSkyriderSaidCongratsOnTakingSAM = Boolean(buffer.readUInt8(offset++));
  o.sContractRehireSoldierID = buffer.readInt16LE(offset); offset += 2;
  offset = readGameOptions(o.GameOptions, buffer, offset);
  o.uiSeedNumber = buffer.readUInt32LE(offset); offset += 4;
  o.uiBaseJA2Clock = buffer.readUInt32LE(offset); offset += 4;
  o.sCurInterfacePanel = buffer.readInt16LE(offset); offset += 2;
  o.ubSMCurrentMercID = buffer.readUInt8(offset++);
  o.fFirstTimeInMapScreen = Boolean(buffer.readUInt8(offset++));
  o.fDisableDueToBattleRoster = Boolean(buffer.readUInt8(offset++));
  o.fDisableMapInterfaceDueToBattle = Boolean(buffer.readUInt8(offset++));
  offset = readIntArray(o.sBoxerGridNo, buffer, offset, 2);
  offset = readUIntArray(o.ubBoxerID, buffer, offset, 1);
  offset = readBooleanArray(o.fBoxerFought, buffer, offset);
  o.fHelicopterDestroyed = Boolean(buffer.readUInt8(offset++)); //if the chopper is destroyed
  o.fShowMapScreenHelpText = Boolean(buffer.readUInt8(offset++)); //If true, displays help in mapscreen
  o.iSortStateForMapScreenList = buffer.readInt32LE(offset); offset += 4;
  o.fFoundTixa = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.uiTimeOfLastSkyriderMonologue = buffer.readUInt32LE(offset); offset += 4;
  o.fShowCambriaHospitalHighLight = Boolean(buffer.readUInt8(offset++));
  o.fSkyRiderSetUp = Boolean(buffer.readUInt8(offset++));
  offset = readBooleanArray(o.fRefuelingSiteAvailable, buffer, offset);
  offset = readMeanwhileDefinition(o.gCurrentMeanwhileDef, buffer, offset);
  o.ubPlayerProgressSkyriderLastCommentedOn = buffer.readUInt8(offset++);
  o.gfMeanwhileTryingToStart = Boolean(buffer.readUInt8(offset++));
  o.gfInMeanwhile = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  for (let i = 0; i < Enum275.NUMBER_OF_SQUADS; i++) {
    offset = readIntArray(o.sDeadMercs[i], buffer, offset, 2);
  }
  offset = readIntArray(o.gbPublicNoiseLevel, buffer, offset, 1);
  o.gubScreenCount = buffer.readUInt8(offset++);
  offset++; // padding
  o.usOldMeanWhileFlags = buffer.readUInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.iPortraitNumber = buffer.readInt32LE(offset); offset += 4;
  o.sWorldSectorLocationOfFirstBattle = buffer.readInt16LE(offset); offset += 2;
  o.fUnReadMailFlag = Boolean(buffer.readUInt8(offset++));
  o.fNewMailFlag = Boolean(buffer.readUInt8(offset++));
  o.fOldUnReadFlag = Boolean(buffer.readUInt8(offset++));
  o.fOldNewMailFlag = Boolean(buffer.readUInt8(offset++));
  o.fShowMilitia = Boolean(buffer.readUInt8(offset++));
  o.fNewFilesInFileViewer = Boolean(buffer.readUInt8(offset++));
  o.fLastBoxingMatchWonByPlayer = Boolean(buffer.readUInt8(offset++));
  offset += 3; // padding
  o.uiUNUSED = buffer.readUInt32LE(offset); offset += 4;
  offset = readBooleanArray(o.fSamSiteFound, buffer, offset);
  o.ubNumTerrorists = buffer.readUInt8(offset++);
  o.ubCambriaMedicalObjects = buffer.readUInt8(offset++);
  o.fDisableTacticalPanelButtons = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sSelMapX = buffer.readInt16LE(offset); offset += 2;
  o.sSelMapY = buffer.readInt16LE(offset); offset += 2;
  o.iCurrentMapSectorZ = buffer.readInt32LE(offset); offset += 4;
  o.usHasPlayerSeenHelpScreenInCurrentScreen = buffer.readUInt16LE(offset); offset += 2;
  o.fHideHelpInAllScreens = Boolean(buffer.readUInt8(offset++));
  o.ubBoxingMatchesWon = buffer.readUInt8(offset++);
  o.ubBoxersRests = buffer.readUInt8(offset++);
  o.fBoxersResting = Boolean(buffer.readUInt8(offset++));
  o.ubDesertTemperature = buffer.readUInt8(offset++);
  o.ubGlobalTemperature = buffer.readUInt8(offset++);
  o.sMercArriveSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sMercArriveSectorY = buffer.readInt16LE(offset); offset += 2;
  o.fCreatureMeanwhileScenePlayed = Boolean(buffer.readUInt8(offset++));
  o.ubPlayerNum = buffer.readUInt8(offset++);
  o.fPersistantPBI = Boolean(buffer.readUInt8(offset++));
  o.ubEnemyEncounterCode = buffer.readUInt8(offset++);
  o.ubExplicitEnemyEncounterCode = buffer.readUInt8(offset++);
  o.fBlitBattleSectorLocator = Boolean(buffer.readUInt8(offset++));
  o.ubPBSectorX = buffer.readUInt8(offset++);
  o.ubPBSectorY = buffer.readUInt8(offset++);
  o.ubPBSectorZ = buffer.readUInt8(offset++);
  o.fCantRetreatInPBI = Boolean(buffer.readUInt8(offset++));
  o.fExplosionQueueActive = Boolean(buffer.readUInt8(offset++));
  offset = readUIntArray(o.ubUnused, buffer, offset, 1);
  o.uiMeanWhileFlags = buffer.readUInt32LE(offset); offset += 4;
  o.bSelectedInfoChar = buffer.readInt8(offset++);;
  o.bHospitalPriceModifier = buffer.readInt8(offset++);;
  offset = readIntArray(o.bUnused2, buffer, offset, 1);
  o.iHospitalTempBalance = buffer.readInt32LE(offset); offset += 4;
  o.iHospitalRefund = buffer.readInt32LE(offset); offset += 4;
  o.fPlayerTeamSawJoey = Boolean(buffer.readUInt8(offset++));
  o.fMikeShouldSayHi = buffer.readInt8(offset++);;
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export function writeGeneralSaveInfo(o: GENERAL_SAVE_INFO, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiCurrentScreen, offset);
  offset = buffer.writeUInt32LE(o.uiCurrentUniqueSoldierId, offset);
  offset = buffer.writeUInt8(o.ubMusicMode, offset);
  offset = buffer.writeUInt8(Number(o.fHavePurchasedItemsFromTony), offset);
  offset = buffer.writeUInt16LE(o.usSelectedSoldier, offset);
  offset = buffer.writeInt16LE(o.sRenderCenterX, offset);
  offset = buffer.writeInt16LE(o.sRenderCenterY, offset);
  offset = buffer.writeUInt8(Number(o.fAtLeastOneMercWasHired), offset);
  offset = buffer.writeUInt8(Number(o.fShowItemsFlag), offset);
  offset = buffer.writeUInt8(Number(o.fShowTownFlag), offset);
  offset = buffer.writeUInt8(Number(o.fShowTeamFlag), offset);
  offset = buffer.writeUInt8(Number(o.fShowMineFlag), offset);
  offset = buffer.writeUInt8(Number(o.fShowAircraftFlag), offset);
  offset = buffer.writeUInt8(Number(o.fHelicopterAvailable), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt32LE(o.iHelicopterVehicleId, offset);
  offset = buffer.writeInt32LE(o.UNUSEDiTotalHeliDistanceSinceRefuel, offset);
  offset = buffer.writeInt32LE(o.iTotalAccumulatedCostByPlayer, offset);
  offset = buffer.writeUInt8(Number(o.fSkyRiderAvailable), offset);
  offset = buffer.writeUInt8(Number(o.UNUSEDfSkyriderMonologue), offset);
  for (let i = 0; i < o.UNUSED.length; i++) {
    offset = writeIntArray(o.UNUSED[i], buffer, offset, 2);
  }
  offset = buffer.writeUInt8(Number(o.fHelicopterIsAirBorne), offset);
  offset = buffer.writeUInt8(Number(o.fHeliReturnStraightToBase), offset);
  offset = buffer.writeUInt8(Number(o.fHoveringHelicopter), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiStartHoverTime, offset);
  offset = buffer.writeUInt32LE(o.uiHelicopterSkyriderTalkState, offset);
  offset = buffer.writeUInt8(Number(o.fShowEstoniRefuelHighLight), offset);
  offset = buffer.writeUInt8(Number(o.fShowOtherSAMHighLight), offset);
  offset = buffer.writeUInt8(Number(o.fShowDrassenSAMHighLight), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiEnvWeather, offset);
  offset = buffer.writeUInt8(o.ubDefaultButton, offset);
  offset = buffer.writeUInt8(Number(o.fSkyriderEmptyHelpGiven), offset);
  offset = buffer.writeUInt8(Number(o.fEnterMapDueToContract), offset);
  offset = buffer.writeUInt8(o.ubHelicopterHitsTaken, offset);
  offset = buffer.writeUInt8(o.ubQuitType, offset);
  offset = buffer.writeUInt8(Number(o.fSkyriderSaidCongratsOnTakingSAM), offset);
  offset = buffer.writeInt16LE(o.sContractRehireSoldierID, offset);
  offset = writeGameOptions(o.GameOptions, buffer, offset);
  offset = buffer.writeUInt32LE(o.uiSeedNumber, offset);
  offset = buffer.writeUInt32LE(o.uiBaseJA2Clock, offset);
  offset = buffer.writeInt16LE(o.sCurInterfacePanel, offset);
  offset = buffer.writeUInt8(o.ubSMCurrentMercID, offset);
  offset = buffer.writeUInt8(Number(o.fFirstTimeInMapScreen), offset);
  offset = buffer.writeUInt8(Number(o.fDisableDueToBattleRoster), offset);
  offset = buffer.writeUInt8(Number(o.fDisableMapInterfaceDueToBattle), offset);
  offset = writeIntArray(o.sBoxerGridNo, buffer, offset, 2);
  offset = writeUIntArray(o.ubBoxerID, buffer, offset, 1);
  offset = writeBooleanArray(o.fBoxerFought, buffer, offset);
  offset = buffer.writeUInt8(Number(o.fHelicopterDestroyed), offset); //if the chopper is destroyed
  offset = buffer.writeUInt8(Number(o.fShowMapScreenHelpText), offset); //If true, displays help in mapscreen
  offset = buffer.writeInt32LE(o.iSortStateForMapScreenList, offset);
  offset = buffer.writeUInt8(Number(o.fFoundTixa), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiTimeOfLastSkyriderMonologue, offset);
  offset = buffer.writeUInt8(Number(o.fShowCambriaHospitalHighLight), offset);
  offset = buffer.writeUInt8(Number(o.fSkyRiderSetUp), offset);
  offset = writeBooleanArray(o.fRefuelingSiteAvailable, buffer, offset);
  offset = writeMeanwhileDefinition(o.gCurrentMeanwhileDef, buffer, offset);
  offset = buffer.writeUInt8(o.ubPlayerProgressSkyriderLastCommentedOn, offset);
  offset = buffer.writeUInt8(Number(o.gfMeanwhileTryingToStart), offset);
  offset = buffer.writeUInt8(Number(o.gfInMeanwhile), offset);
  offset = writePadding(buffer, offset, 1); // padding
  for (let i = 0; i < Enum275.NUMBER_OF_SQUADS; i++) {
    offset = writeIntArray(o.sDeadMercs[i], buffer, offset, 2);
  }
  offset = writeIntArray(o.gbPublicNoiseLevel, buffer, offset, 1);
  offset = buffer.writeUInt8(o.gubScreenCount, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usOldMeanWhileFlags, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeInt32LE(o.iPortraitNumber, offset);
  offset = buffer.writeInt16LE(o.sWorldSectorLocationOfFirstBattle, offset);
  offset = buffer.writeUInt8(Number(o.fUnReadMailFlag), offset);
  offset = buffer.writeUInt8(Number(o.fNewMailFlag), offset);
  offset = buffer.writeUInt8(Number(o.fOldUnReadFlag), offset);
  offset = buffer.writeUInt8(Number(o.fOldNewMailFlag), offset);
  offset = buffer.writeUInt8(Number(o.fShowMilitia), offset);
  offset = buffer.writeUInt8(Number(o.fNewFilesInFileViewer), offset);
  offset = buffer.writeUInt8(Number(o.fLastBoxingMatchWonByPlayer), offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiUNUSED, offset);
  offset = writeBooleanArray(o.fSamSiteFound, buffer, offset);
  offset = buffer.writeUInt8(o.ubNumTerrorists, offset);
  offset = buffer.writeUInt8(o.ubCambriaMedicalObjects, offset);
  offset = buffer.writeUInt8(Number(o.fDisableTacticalPanelButtons), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sSelMapX, offset);
  offset = buffer.writeInt16LE(o.sSelMapY, offset);
  offset = buffer.writeInt32LE(o.iCurrentMapSectorZ, offset);
  offset = buffer.writeUInt16LE(o.usHasPlayerSeenHelpScreenInCurrentScreen, offset);
  offset = buffer.writeUInt8(Number(o.fHideHelpInAllScreens), offset);
  offset = buffer.writeUInt8(o.ubBoxingMatchesWon, offset);
  offset = buffer.writeUInt8(o.ubBoxersRests, offset);
  offset = buffer.writeUInt8(Number(o.fBoxersResting), offset);
  offset = buffer.writeUInt8(o.ubDesertTemperature, offset);
  offset = buffer.writeUInt8(o.ubGlobalTemperature, offset);
  offset = buffer.writeInt16LE(o.sMercArriveSectorX, offset);
  offset = buffer.writeInt16LE(o.sMercArriveSectorY, offset);
  offset = buffer.writeUInt8(Number(o.fCreatureMeanwhileScenePlayed), offset);
  offset = buffer.writeUInt8(o.ubPlayerNum, offset);
  offset = buffer.writeUInt8(Number(o.fPersistantPBI), offset);
  offset = buffer.writeUInt8(o.ubEnemyEncounterCode, offset);
  offset = buffer.writeUInt8(o.ubExplicitEnemyEncounterCode, offset);
  offset = buffer.writeUInt8(Number(o.fBlitBattleSectorLocator), offset);
  offset = buffer.writeUInt8(o.ubPBSectorX, offset);
  offset = buffer.writeUInt8(o.ubPBSectorY, offset);
  offset = buffer.writeUInt8(o.ubPBSectorZ, offset);
  offset = buffer.writeUInt8(Number(o.fCantRetreatInPBI), offset);
  offset = buffer.writeUInt8(Number(o.fExplosionQueueActive), offset);
  offset = writeUIntArray(o.ubUnused, buffer, offset, 1);
  offset = buffer.writeUInt32LE(o.uiMeanWhileFlags, offset);
  offset = buffer.writeInt8(o.bSelectedInfoChar, offset);;
  offset = buffer.writeInt8(o.bHospitalPriceModifier, offset);;
  offset = writeIntArray(o.bUnused2, buffer, offset, 1);
  offset = buffer.writeInt32LE(o.iHospitalTempBalance, offset);
  offset = buffer.writeInt32LE(o.iHospitalRefund, offset);
  offset = buffer.writeUInt8(Number(o.fPlayerTeamSawJoey), offset);
  offset = buffer.writeInt8(o.fMikeShouldSayHi, offset);;
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export let guiSaveGameVersion: UINT32 = 0;

/////////////////////////////////////////////////////
//
// Global Variables
//
/////////////////////////////////////////////////////

// CHAR8		gsSaveGameNameWithPath[ 512 ];

let gubSaveGameLoc: UINT8 = 0;

export let guiScreenToGotoAfterLoadingSavedGame: UINT32 = 0;

/////////////////////////////////////////////////////
//
// Function Prototypes
//
/////////////////////////////////////////////////////

// BOOLEAN		SavePtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile );
// BOOLEAN		LoadPtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile );

// ppp

/////////////////////////////////////////////////////
//
// Functions
//
/////////////////////////////////////////////////////

export function SaveGame(ubSaveGameID: UINT8, pGameDesc: Pointer<string> /* STR16 */): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let hFile: HWFILE = 0;
  let SaveGameHeader: SAVED_GAME_HEADER = createSavedGameHeader();
  let zSaveGameName: string /* CHAR8[512] */;
  let uiSizeOfGeneralInfo: UINT32 = GENERAL_SAVE_INFO_SIZE;
  let saveDir: string /* UINT8[100] */;
  let fPausedStateBeforeSaving: boolean = gfGamePaused;
  let fLockPauseStateBeforeSaving: boolean = gfLockPauseState;
  let iSaveLoadGameMessageBoxID: INT32 = -1;
  let usPosX: UINT16;
  let usActualWidth: UINT16;
  let usActualHeight: UINT16;
  let fWePausedIt: boolean = false;
  let buffer: Buffer;

  FAILED_TO_SAVE:
  do {
    saveDir = sprintf("%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY]);

    if (ubSaveGameID >= NUM_SAVE_GAMES && ubSaveGameID != SAVE__ERROR_NUM && ubSaveGameID != SAVE__END_TURN_NUM)
      return (false); // ddd

    if (!GamePaused()) {
      PauseBeforeSaveGame();
      fWePausedIt = true;
    }

    // Place a message on the screen telling the user that we are saving the game
    iSaveLoadGameMessageBoxID = PrepareMercPopupBox(iSaveLoadGameMessageBoxID, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, zSaveLoadText[Enum371.SLG_SAVING_GAME_MESSAGE], 300, 0, 0, 0, addressof(usActualWidth), addressof(usActualHeight));
    usPosX = (640 - usActualWidth) / 2;

    RenderMercPopUpBoxFromIndex(iSaveLoadGameMessageBoxID, usPosX, 160, FRAME_BUFFER);

    InvalidateRegion(0, 0, 640, 480);

    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
    RefreshScreen(null);

    if (RemoveMercPopupBoxFromIndex(iSaveLoadGameMessageBoxID)) {
      iSaveLoadGameMessageBoxID = -1;
    }

    //
    // make sure we redraw the screen when we are done
    //

    // if we are in the game screen
    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    else if (guiCurrentScreen == Enum26.MAP_SCREEN) {
      fMapPanelDirty = true;
      fTeamPanelDirty = true;
      fCharacterInfoPanelDirty = true;
    }

    else if (guiCurrentScreen == Enum26.SAVE_LOAD_SCREEN) {
      gfRedrawSaveLoadScreen = true;
    }

    gubSaveGameLoc = ubSaveGameID;

    // Set the fact that we are saving a game
    gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

    // Save the current sectors open temp files to the disk
    if (!SaveCurrentSectorsInformationToTempItemFile()) {
      ScreenMsg(FONT_MCOLOR_WHITE, MSG_TESTVERSION, "ERROR in SaveCurrentSectorsInformationToTempItemFile()");
      break FAILED_TO_SAVE;
    }

    // if we are saving the quick save,
    if (ubSaveGameID == 0) {
        pGameDesc = pMessageStrings[Enum333.MSG_QUICKSAVE_NAME];
    }

    // If there was no string, add one
    if (pGameDesc[0] == '\0')
      pGameDesc = pMessageStrings[Enum333.MSG_NODESC];

    // Check to see if the save directory exists
    if (FileGetAttributes(saveDir) == 0xFFFFFFFF) {
      // ok the direcotry doesnt exist, create it
      if (!MakeFileManDirectory(saveDir)) {
        break FAILED_TO_SAVE;
      }
    }

    // Create the name of the file
    zSaveGameName = CreateSavedGameFileNameFromNumber(ubSaveGameID);

    // if the file already exists, delete it
    if (FileExists(zSaveGameName)) {
      if (!FileDelete(zSaveGameName)) {
        break FAILED_TO_SAVE;
      }
    }

    // create the save game file
    hFile = FileOpen(zSaveGameName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);
    if (!hFile) {
      break FAILED_TO_SAVE;
    }

    //
    // If there are no enemy or civilians to save, we have to check BEFORE savinf the sector info struct because
    // the NewWayOfSavingEnemyAndCivliansToTempFile will RESET the civ or enemy flag AFTER they have been saved.
    //
    NewWayOfSavingEnemyAndCivliansToTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, true, true);
    NewWayOfSavingEnemyAndCivliansToTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, false, true);

    //
    // Setup the save game header
    //

    SaveGameHeader.uiSavedGameVersion = guiSavedGameVersion;
    SaveGameHeader.sSavedGameDesc = pGameDesc;
    SaveGameHeader.zGameVersionNumber = czVersionNumber;

    SaveGameHeader.uiFlags;

    // The following will be used to quickly access info to display in the save/load screen
    SaveGameHeader.uiDay = GetWorldDay();
    SaveGameHeader.ubHour = GetWorldHour();
    SaveGameHeader.ubMin = guiMin;

    // copy over the initial game options
    copyGameOptions(SaveGameHeader.sInitialGameOptions, gGameOptions);

    // Get the sector value to save.
    GetBestPossibleSectorXYZValues(addressof(SaveGameHeader.sSectorX), addressof(SaveGameHeader.sSectorY), addressof(SaveGameHeader.bSectorZ));

    /*

            //if the current sector is valid
            if( gfWorldLoaded )
            {
                    SaveGameHeader.sSectorX = gWorldSectorX;
                    SaveGameHeader.sSectorY = gWorldSectorY;
                    SaveGameHeader.bSectorZ = gbWorldSectorZ;
            }
            else if( Squad[ iCurrentTacticalSquad ][ 0 ] && iCurrentTacticalSquad != NO_CURRENT_SQUAD )
            {
    //		if( Squad[ iCurrentTacticalSquad ][ 0 ]->bAssignment != IN_TRANSIT )
                    {
                            SaveGameHeader.sSectorX = Squad[ iCurrentTacticalSquad ][ 0 ]->sSectorX;
                            SaveGameHeader.sSectorY = Squad[ iCurrentTacticalSquad ][ 0 ]->sSectorY;
                            SaveGameHeader.bSectorZ = Squad[ iCurrentTacticalSquad ][ 0 ]->bSectorZ;
                    }
            }
            else
            {
                    INT16					sSoldierCnt;
                    SOLDIERTYPE		*pSoldier;
                    INT16					bLastTeamID;
                    INT8					bCount=0;
                    BOOLEAN				fFoundAMerc=FALSE;

                    // Set locator to first merc
                    sSoldierCnt = gTacticalStatus.Team[ gbPlayerNum ].bFirstID;
                    bLastTeamID = gTacticalStatus.Team[ gbPlayerNum ].bLastID;

                    for ( pSoldier = MercPtrs[ sSoldierCnt ]; sSoldierCnt <= bLastTeamID; sSoldierCnt++,pSoldier++)
                    {
                            if( pSoldier->bActive )
                            {
                                    if ( pSoldier->bAssignment != IN_TRANSIT && !pSoldier->fBetweenSectors)
                                    {
                                            SaveGameHeader.sSectorX = pSoldier->sSectorX;
                                            SaveGameHeader.sSectorY = pSoldier->sSectorY;
                                            SaveGameHeader.bSectorZ = pSoldier->bSectorZ;
                                            fFoundAMerc = TRUE;
                                            break;
                                    }
                            }
                    }

                    if( !fFoundAMerc )
                    {
                            SaveGameHeader.sSectorX = gWorldSectorX;
                            SaveGameHeader.sSectorY = gWorldSectorY;
                            SaveGameHeader.bSectorZ = gbWorldSectorZ;
                    }
            }
    */

    SaveGameHeader.ubNumOfMercsOnPlayersTeam = NumberOfMercsOnPlayerTeam();
    SaveGameHeader.iCurrentBalance = LaptopSaveInfo.iCurrentBalance;

    SaveGameHeader.uiCurrentScreen = guiPreviousOptionScreen;

    SaveGameHeader.fAlternateSector = GetSectorFlagStatus(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_USE_ALTERNATE_MAP);

    if (gfWorldLoaded) {
      SaveGameHeader.fWorldLoaded = true;
      SaveGameHeader.ubLoadScreenID = GetLoadScreenID(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    } else {
      SaveGameHeader.fWorldLoaded = false;
      SaveGameHeader.ubLoadScreenID = 0;
    }

    SaveGameHeader.uiRandom = Random(RAND_MAX);

    //
    // Save the Save Game header file
    //

    buffer = Buffer.allocUnsafe(SAVED_GAME_HEADER_SIZE);
    writeSavedGameHeader(SaveGameHeader, buffer);
    uiNumBytesWritten = FileWrite(hFile, buffer, SAVED_GAME_HEADER_SIZE);
    if (uiNumBytesWritten != SAVED_GAME_HEADER_SIZE) {
      break FAILED_TO_SAVE;
    }

    guiJA2EncryptionSet = CalcJA2EncryptionSet(SaveGameHeader);

    //
    // Save the gTactical Status array, plus the curent secotr location
    //
    if (!SaveTacticalStatusToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    // save the game clock info
    if (!SaveGameClock(hFile, fPausedStateBeforeSaving, fLockPauseStateBeforeSaving)) {
      break FAILED_TO_SAVE;
    }

    // save the strategic events
    if (!SaveStrategicEventsToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveLaptopInfoToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    //
    // Save the merc profiles
    //
    if (!SaveMercProfiles(hFile)) {
      break FAILED_TO_SAVE;
    }

    //
    // Save the soldier structure
    //
    if (!SaveSoldierStructure(hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save the Finaces Data file
    if (!SaveFilesToSavedGame(FINANCES_DATA_FILE, hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save the history file
    if (!SaveFilesToSavedGame(HISTORY_DATA_FILE, hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save the Laptop File file
    if (!SaveFilesToSavedGame(FILES_DAT_FILE, hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save email stuff to save file
    if (!SaveEmailToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save the strategic information
    if (!SaveStrategicInfoToSavedFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    // save the underground information
    if (!SaveUnderGroundSectorInfoToSaveGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    // save the squad info
    if (!SaveSquadInfoToSavedGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveStrategicMovementGroupsToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save all the map temp files from the maps\temp directory into the saved game file
    if (!SaveMapTempFilesToSavedGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveQuestInfoToSavedGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveOppListInfoToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveMapScreenMessagesToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveNPCInfoToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveKeyTableToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveTempNpcQuoteArrayToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SavePreRandomNumbersToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveSmokeEffectsToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveArmsDealerInventoryToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveGeneralInfo(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveMineStatusToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveStrategicTownLoyaltyToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveVehicleInformationToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveBulletStructureToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SavePhysicsTableToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveAirRaidInfoToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveTeamTurnsToTheSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveExplosionTableToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveCreatureDirectives(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveStrategicStatusToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveStrategicAI(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveLightEffectsToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveWatchedLocsToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveItemCursorToSavedGame(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveCivQuotesToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveBackupNPCInfoToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    if (!SaveMeanwhileDefsFromSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    // save meanwhiledefs

    if (!SaveSchedules(hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save extra vehicle info
    if (!NewSaveVehicleMovementInfoToSavedGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save contract renewal sequence stuff
    if (!SaveContractRenewalDataToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    // Save leave list stuff
    if (!SaveLeaveItemList(hFile)) {
      break FAILED_TO_SAVE;
    }

    // do the new way of saving bobbyr mail order items
    if (!NewWayOfSavingBobbyRMailOrdersToSaveGameFile(hFile)) {
      break FAILED_TO_SAVE;
    }

    // sss

    // Close the saved game file
    FileClose(hFile);

    // if we succesfully saved the game, mark this entry as the last saved game file
    if (ubSaveGameID != SAVE__ERROR_NUM && ubSaveGameID != SAVE__END_TURN_NUM) {
      gGameSettings.bLastSavedGameSlot = ubSaveGameID;
    }

    // Save the save game settings
    SaveGameSettings();

    //
    // Display a screen message that the save was succesful
    //

    // if its the quick save slot
    if (ubSaveGameID == 0) {
      ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SAVESUCCESS]);
    }
    //#ifdef JA2BETAVERSION
    else if (ubSaveGameID == SAVE__END_TURN_NUM) {
      //		ScreenMsg( FONT_MCOLOR_WHITE, MSG_INTERFACE, pMessageStrings[ MSG_END_TURN_AUTO_SAVE ] );
    }
    //#endif
    else {
      ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, pMessageStrings[Enum333.MSG_SAVESLOTSUCCESS]);
    }

    // restore the music mode
    SetMusicMode(gubMusicMode);

    // Unset the fact that we are saving a game
    gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;

    UnPauseAfterSaveGame();

    // Check for enough free hard drive space
    NextLoopCheckForEnoughFreeHardDriveSpace();

    return true;
  } while (false);

  // if there is an error saving the game

  FileClose(hFile);

  if (fWePausedIt) {
    UnPauseAfterSaveGame();
  }

  // Delete the failed attempt at saving
  DeleteSaveGameNumber(ubSaveGameID);

  // Put out an error message
  ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, zSaveLoadText[Enum371.SLG_SAVE_GAME_ERROR]);

  // Check for enough free hard drive space
  NextLoopCheckForEnoughFreeHardDriveSpace();

  return false;
}

export let guiBrokenSaveGameVersion: UINT32 = 0;

export function LoadSavedGame(ubSavedGameID: UINT8): boolean {
  let hFile: HWFILE;
  let SaveGameHeader: SAVED_GAME_HEADER = createSavedGameHeader();
  let uiNumBytesRead: UINT32 = 0;

  let sLoadSectorX: INT16;
  let sLoadSectorY: INT16;
  let bLoadSectorZ: INT8;
  let zSaveGameName: string /* CHAR8[512] */;
  let uiSizeOfGeneralInfo: UINT32 = GENERAL_SAVE_INFO_SIZE;

  let uiRelStartPerc: UINT32;
  let uiRelEndPerc: UINT32;
  let buffer: Buffer;

  uiRelStartPerc = uiRelEndPerc = 0;

  TrashAllSoldiers();

  // Empty the dialogue Queue cause someone could still have a quote in waiting
  EmptyDialogueQueue();

  // If there is someone talking, stop them
  StopAnyCurrentlyTalkingSpeech();

  ZeroAnimSurfaceCounts();

  ShutdownNPCQuotes();

  // is it a valid save number
  if (ubSavedGameID >= NUM_SAVE_GAMES) {
    if (ubSavedGameID != SAVE__END_TURN_NUM)
      return false;
  } else if (!gbSaveGameArray[ubSavedGameID])
    return false;

  // Used in mapescreen to disable the annoying 'swoosh' transitions
  gfDontStartTransitionFromLaptop = true;

  // Reset timer callbacks
  gpCustomizableTimerCallback = null;

  gubSaveGameLoc = ubSavedGameID;

  // Set the fact that we are loading a saved game
  gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

  // Trash the existing world.  This is done to ensure that if we are loading a game that doesn't have
  // a world loaded, that we trash it beforehand -- else the player could theoretically enter that sector
  // where it would be in a pre-load state.
  TrashWorld();

  // Deletes all the Temp files in the Maps\Temp directory
  InitTacticalSave(true);

  // ATE; Added to empry dialogue q
  EmptyDialogueQueue();

  // Create the name of the file
  zSaveGameName = CreateSavedGameFileNameFromNumber(ubSavedGameID);

  // open the save game file
  hFile = FileOpen(zSaveGameName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (!hFile) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  // Load the Save Game header file
  buffer = Buffer.allocUnsafe(SAVED_GAME_HEADER_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, SAVED_GAME_HEADER_SIZE);
  if (uiNumBytesRead != SAVED_GAME_HEADER_SIZE) {
    FileClose(hFile);
    return false;
  }
  readSavedGameHeader(SaveGameHeader, buffer);

  guiJA2EncryptionSet = CalcJA2EncryptionSet(SaveGameHeader);

  guiBrokenSaveGameVersion = SaveGameHeader.uiSavedGameVersion;

  // if the player is loading up an older version of the game, and the person DOESNT have the cheats on,
  if (SaveGameHeader.uiSavedGameVersion < 65 && !CHEATER_CHEAT_LEVEL()) {
    // Fail loading the save
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  // Store the loading screenID that was saved
  gubLastLoadingScreenID = SaveGameHeader.ubLoadScreenID;

  // HACK
  guiSaveGameVersion = SaveGameHeader.uiSavedGameVersion;

  /*
          if( !LoadGeneralInfo( hFile ) )
          {
                  FileClose( hFile );
                  return(FALSE);
          }
          #ifdef JA2BETAVERSION
                  LoadGameFilePosition( FileGetPos( hFile ), "Misc info" );
          #endif
  */

  // Load the gtactical status structure plus the current sector x,y,z
  if (!LoadTacticalStatusFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  // This gets reset by the above function
  gTacticalStatus.uiFlags |= LOADING_SAVED_GAME;

  // Load the game clock ingo
  if (!LoadGameClock(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  // if we are suppose to use the alternate sector
  if (SaveGameHeader.fAlternateSector) {
    SetSectorFlag(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_USE_ALTERNATE_MAP);
    gfUseAlternateMap = true;
  }

  // if the world was loaded when saved, reload it, otherwise dont
  if (SaveGameHeader.fWorldLoaded || SaveGameHeader.uiSavedGameVersion < 50) {
    // Get the current world sector coordinates
    sLoadSectorX = gWorldSectorX;
    sLoadSectorY = gWorldSectorY;
    bLoadSectorZ = gbWorldSectorZ;

    // This will guarantee that the sector will be loaded
    gbWorldSectorZ = -1;

    // if we should load a sector ( if the person didnt just start the game game )
    if ((gWorldSectorX != 0) && (gWorldSectorY != 0)) {
      // Load the sector
      SetCurrentWorldSector(sLoadSectorX, sLoadSectorY, bLoadSectorZ);
    }
  } else {
    // By clearing these values, we can avoid "in sector" checks -- at least, that's the theory.
    gWorldSectorX = gWorldSectorY = 0;

    // Since there is no
    if (SaveGameHeader.sSectorX == -1 || SaveGameHeader.sSectorY == -1 || SaveGameHeader.bSectorZ == -1)
      gubLastLoadingScreenID = Enum22.LOADINGSCREEN_HELI;
    else
      gubLastLoadingScreenID = GetLoadScreenID(SaveGameHeader.sSectorX, SaveGameHeader.sSectorY, SaveGameHeader.bSectorZ);

    BeginLoadScreen();
  }

  CreateLoadingScreenProgressBar();
  SetProgressBarColor(0, 0, 0, 150);

  uiRelStartPerc = 0;

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Events...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // load the game events
  if (!LoadStrategicEventsFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Laptop Info");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadLaptopInfoFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Merc Profiles...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load all the saved Merc profiles
  //
  if (!LoadSavedMercProfiles(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 30;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Soldier Structure...");
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the soldier structure info
  //
  if (!LoadSoldierStructure(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Finances Data File...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the Finances Data and write it to a new file
  //
  if (!LoadFilesFromSavedGame(FINANCES_DATA_FILE, hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "History File...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the History Data and write it to a new file
  //
  if (!LoadFilesFromSavedGame(HISTORY_DATA_FILE, hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "The Laptop FILES file...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Load the Files Data and write it to a new file
  //
  if (!LoadFilesFromSavedGame(FILES_DAT_FILE, hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Email...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the data for the emails
  if (!LoadEmailFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the strategic Information
  if (!LoadStrategicInfoFromSavedFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "UnderGround Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the underground information
  if (!LoadUnderGroundSectorInfoFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Squad Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load all the squad info from the saved game file
  if (!LoadSquadInfoFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Movement Groups...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Load the group linked list
  if (!LoadStrategicMovementGroupsFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 30;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "All the Map Temp files...");
  uiRelStartPerc = uiRelEndPerc;

  // Load all the map temp files from the saved game file into the maps\temp directory
  if (!LoadMapTempFilesFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Quest Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadQuestInfoFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "OppList Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadOppListInfoFromSavedGame(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "MapScreen Messages...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadMapScreenMessagesFromSaveGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "NPC Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadNPCInfoFromSavedGameFile(hFile, SaveGameHeader.uiSavedGameVersion)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "KeyTable...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadKeyTableFromSaveedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Npc Temp Quote File...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadTempNpcQuoteArrayToSaveGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "PreGenerated Random Files...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadPreRandomNumbersFromSaveGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Smoke Effect Structures...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadSmokeEffectsFromLoadGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Arms Dealers Inventory...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadArmsDealerInventoryFromSavedGameFile(hFile, (SaveGameHeader.uiSavedGameVersion >= 54), (SaveGameHeader.uiSavedGameVersion >= 55))) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Misc info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadGeneralInfo(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Mine Status...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (!LoadMineStatusFromSavedGameFile(hFile)) {
    FileClose(hFile);
    guiSaveGameVersion = 0;
    return false;
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Town Loyalty...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 21) {
    if (!LoadStrategicTownLoyaltyFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Vehicle Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 22) {
    if (!LoadVehicleInformationFromSavedGameFile(hFile, SaveGameHeader.uiSavedGameVersion)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Bullet Information...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadBulletStructureFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Physics table...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadPhysicsTableFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Air Raid Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadAirRaidInfoFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 0;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Team Turn Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 24) {
    if (!LoadTeamTurnsFromTheSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Explosion Table...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 25) {
    if (!LoadExplosionTableFromSavedGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Creature Spreading...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 27) {
    if (!LoadCreatureDirectives(hFile, SaveGameHeader.uiSavedGameVersion)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic Status...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 28) {
    if (!LoadStrategicStatusFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Strategic AI...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 31) {
    if (!LoadStrategicAI(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Lighting Effects...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 37) {
    if (!LoadLightEffectsFromLoadGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Watched Locs Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 38) {
    if (!LoadWatchedLocsFromSavedGame(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Item cursor Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 39) {
    if (!LoadItemCursorFromSavedGame(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Civ Quote System...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 51) {
    if (!LoadCivQuotesFromLoadGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Backed up NPC Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 53) {
    if (!LoadBackupNPCInfoFromSavedGameFile(hFile, SaveGameHeader.uiSavedGameVersion)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Meanwhile definitions...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 58) {
    if (!LoadMeanwhileDefsFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  } else {
    copyMeanwhileDefinition(gMeanwhileDef[gCurrentMeanwhileDef.ubMeanwhileID], gCurrentMeanwhileDef);
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Schedules...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 59) {
    // trash schedules loaded from map
    DestroyAllSchedulesWithoutDestroyingEvents();
    if (!LoadSchedulesFromSave(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Extra Vehicle Info...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion >= 61) {
    if (SaveGameHeader.uiSavedGameVersion < 84) {
      if (!LoadVehicleMovementInfoFromSavedGameFile(hFile)) {
        FileClose(hFile);
        guiSaveGameVersion = 0;
        return false;
      }
    } else {
      if (!NewLoadVehicleMovementInfoFromSavedGameFile(hFile)) {
        FileClose(hFile);
        guiSaveGameVersion = 0;
        return false;
      }
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Contract renweal sequence stuff...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  if (SaveGameHeader.uiSavedGameVersion < 62) {
    // the older games had a bug where this flag was never being set
    gfResetAllPlayerKnowsEnemiesFlags = true;
  }

  if (SaveGameHeader.uiSavedGameVersion >= 67) {
    if (!LoadContractRenewalDataFromSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  if (SaveGameHeader.uiSavedGameVersion >= 70) {
    if (!LoadLeaveItemList(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  if (SaveGameHeader.uiSavedGameVersion <= 73) {
    // Patch vehicle fuel
    AddVehicleFuelToSave();
  }

  if (SaveGameHeader.uiSavedGameVersion >= 85) {
    if (!NewWayOfLoadingBobbyRMailOrdersToSaveGameFile(hFile)) {
      FileClose(hFile);
      guiSaveGameVersion = 0;
      return false;
    }
  }

  // If there are any old Bobby R Mail orders, tranfer them to the new system
  if (SaveGameHeader.uiSavedGameVersion < 85) {
    HandleOldBobbyRMailOrders();
  }

  /// lll

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  //
  // Close the saved game file
  //
  FileClose(hFile);

  // ATE: Patch? Patch up groups.....( will only do for old saves.. )
  UpdatePersistantGroupsFromOldSave(SaveGameHeader.uiSavedGameVersion);

  if (SaveGameHeader.uiSavedGameVersion <= 40) {
    // Cancel all pending purchase orders for BobbyRay's.  Starting with version 41, the BR orders events are
    // posted with the usItemIndex itself as the parameter, rather than the inventory slot index.  This was
    // done to make it easier to modify BR's traded inventory lists later on without breaking saves.
    CancelAllPendingBRPurchaseOrders();
  }

  // if the world is loaded, apply the temp files to the loaded map
  if (SaveGameHeader.fWorldLoaded || SaveGameHeader.uiSavedGameVersion < 50) {
    // Load the current sectors Information From the temporary files
    if (!LoadCurrentSectorsInformationFromTempItemsFile()) {
      InitExitGameDialogBecauseFileHackDetected();
      guiSaveGameVersion = 0;
      return true;
    }
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  InitAI();

  // Update the mercs in the sector with the new soldier info
  UpdateMercsInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // ReconnectSchedules();
  PostSchedules();

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Reset the lighting level if we are outside
  if (gbWorldSectorZ == 0)
    LightSetBaseLevel(GetTimeOfDayAmbientLightLevel());

  // if we have been to this sector before
  //	if( SectorInfo[ SECTOR( gWorldSectorX,gWorldSectorY) ].uiFlags & SF_ALREADY_VISITED )
  {
    // Reset the fact that we are loading a saved game
    gTacticalStatus.uiFlags &= ~LOADING_SAVED_GAME;
  }

  // CJC January 13: we can't do this because (a) it resets militia IN THE MIDDLE OF
  // COMBAT, and (b) if we add militia to the teams while LOADING_SAVED_GAME is set,
  // the team counters will not be updated properly!!!
  //	ResetMilitia();

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // if the UI was locked in the saved game file
  if (gTacticalStatus.ubAttackBusyCount > 1) {
    // Lock the ui
    SetUIBusy(gusSelectedSoldier);
  }

  // Reset the shadow
  SetFontShadow(DEFAULT_SHADOW);

  // if we succesfully LOADED! the game, mark this entry as the last saved game file
  gGameSettings.bLastSavedGameSlot = ubSavedGameID;

  // Save the save game settings
  SaveGameSettings();

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // Reset the Ai Timer clock
  giRTAILastUpdateTime = 0;

  // if we are in tactical
  if (guiScreenToGotoAfterLoadingSavedGame == Enum26.GAME_SCREEN) {
    // Initialize the current panel
    InitializeCurrentPanel();

    SelectSoldier(gusSelectedSoldier, false, true);
  }

  uiRelEndPerc += 1;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Final Checks...");
  RenderProgressBar(0, 100);
  uiRelStartPerc = uiRelEndPerc;

  // init extern faces
  InitalizeStaticExternalNPCFaces();

  // load portraits
  LoadCarPortraitValues();

  // OK, turn OFF show all enemies....
  gTacticalStatus.uiFlags &= (~SHOW_ALL_MERCS);
  gTacticalStatus.uiFlags &= ~SHOW_ALL_ITEMS;

  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Setting attack busy count to 0 from load"));
    gTacticalStatus.ubAttackBusyCount = 0;
  }

  if (SaveGameHeader.uiSavedGameVersion < 64) {
    // Militia/enemies/creature team sizes have been changed from 32 to 20.  This function
    // will simply kill off the excess.  This will allow the ability to load previous saves, though
    // there will still be problems, though a LOT less than there would be without this call.
    TruncateStrategicGroupSizes();
  }

  // ATE: if we are within this window where skyridder was foobared, fix!
  if (SaveGameHeader.uiSavedGameVersion >= 61 && SaveGameHeader.uiSavedGameVersion <= 65) {
    let pSoldier: SOLDIERTYPE | null;
    let pProfile: MERCPROFILESTRUCT;

    if (!fSkyRiderSetUp) {
      // see if we can find him and remove him if so....
      pSoldier = FindSoldierByProfileID(Enum268.SKYRIDER, false);

      if (pSoldier != null) {
        TacticalRemoveSoldier(pSoldier.ubID);
      }

      // add the pilot at a random location!
      pProfile = gMercProfiles[Enum268.SKYRIDER];
      switch (Random(4)) {
        case 0:
          pProfile.sSectorX = 15;
          pProfile.sSectorY = MAP_ROW_B;
          pProfile.bSectorZ = 0;
          break;
        case 1:
          pProfile.sSectorX = 14;
          pProfile.sSectorY = MAP_ROW_E;
          pProfile.bSectorZ = 0;
          break;
        case 2:
          pProfile.sSectorX = 12;
          pProfile.sSectorY = MAP_ROW_D;
          pProfile.bSectorZ = 0;
          break;
        case 3:
          pProfile.sSectorX = 16;
          pProfile.sSectorY = MAP_ROW_C;
          pProfile.bSectorZ = 0;
          break;
      }
    }
  }

  if (SaveGameHeader.uiSavedGameVersion < 68) {
    // correct bVehicleUnderRepairID for all mercs
    let ubID: UINT8;
    for (ubID = 0; ubID < MAXMERCS; ubID++) {
      Menptr[ubID].bVehicleUnderRepairID = -1;
    }
  }

  if (SaveGameHeader.uiSavedGameVersion < 73) {
    if (LaptopSaveInfo.fMercSiteHasGoneDownYet)
      LaptopSaveInfo.fFirstVisitSinceServerWentDown = <boolean><unknown>2;
  }

  // Update the MERC merc contract lenght.  Before save version 77 the data was stored in the SOLDIERTYPE,
  // after 77 the data is stored in the profile
  if (SaveGameHeader.uiSavedGameVersion < 77) {
    UpdateMercMercContractInfo();
  }

  if (SaveGameHeader.uiSavedGameVersion <= 89) {
    // ARM: A change was made in version 89 where refuel site availability now also depends on whether the player has
    // airspace control over that sector.  To update the settings immediately, must call it here.
    UpdateRefuelSiteAvailability();
  }

  if (SaveGameHeader.uiSavedGameVersion < 91) {
    // update the amount of money that has been paid to speck
    CalcAproximateAmountPaidToSpeck();
  }

  gfLoadedGame = true;

  uiRelEndPerc = 100;
  SetRelativeStartAndEndPercentage(0, uiRelStartPerc, uiRelEndPerc, "Done!");
  RenderProgressBar(0, 100);

  RemoveLoadingScreenProgressBar();

  SetMusicMode(gMusicModeToPlay);

  RESET_CHEAT_LEVEL();

  // reset to 0
  guiSaveGameVersion = 0;

  // reset once-per-convo records for everyone in the loaded sector
  ResetOncePerConvoRecordsForAllNPCsInLoadedSector();

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // fix lingering attack busy count problem on loading saved game by resetting a.b.c
    // if we're not in combat.
    gTacticalStatus.ubAttackBusyCount = 0;
  }

  // fix squads
  CheckSquadMovementGroups();

  // The above function LightSetBaseLevel adjusts ALL the level node light values including the merc node,
  // we must reset the values
  HandlePlayerTogglingLightEffects(false);

  return true;
}

function SaveMercProfiles(hFile: HWFILE): boolean {
  let cnt: UINT16;
  let uiNumBytesWritten: UINT32 = 0;
  let uiSaveSize: UINT32 = MERC_PROFILE_STRUCT_SIZE;
  let buffer: Buffer;

  // Lopp through all the profiles to save
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (cnt = 0; cnt < NUM_PROFILES; cnt++) {
    gMercProfiles[cnt].uiProfileChecksum = ProfileChecksum(gMercProfiles[cnt]);

    writeMercProfileStruct(gMercProfiles[cnt], buffer);

    if (guiSavedGameVersion < 87) {
      uiNumBytesWritten = JA2EncryptedFileWrite(hFile, buffer, uiSaveSize);
    } else {
      uiNumBytesWritten = NewJA2EncryptedFileWrite(hFile, buffer, uiSaveSize);
    }
    if (uiNumBytesWritten != uiSaveSize) {
      return false;
    }
  }

  return true;
}

function LoadSavedMercProfiles(hFile: HWFILE): boolean {
  let cnt: UINT16;
  let uiNumBytesRead: UINT32 = 0;
  let buffer: Buffer;

  // Lopp through all the profiles to Load
  buffer = Buffer.allocUnsafe(MERC_PROFILE_STRUCT_SIZE);
  for (cnt = 0; cnt < NUM_PROFILES; cnt++) {
    if (guiSaveGameVersion < 87) {
      uiNumBytesRead = JA2EncryptedFileRead(hFile, buffer, MERC_PROFILE_STRUCT_SIZE);
    } else {
      uiNumBytesRead = NewJA2EncryptedFileRead(hFile, buffer, MERC_PROFILE_STRUCT_SIZE);
    }

    if (uiNumBytesRead != MERC_PROFILE_STRUCT_SIZE) {
      return false;
    }

    readMercProfileStruct(gMercProfiles[cnt], buffer);

    if (gMercProfiles[cnt].uiProfileChecksum != ProfileChecksum(gMercProfiles[cnt])) {
      return false;
    }
  }

  return true;
}

// Not saving any of these in the soldier struct

//	struct TAG_level_node				*pLevelNode;
//	struct TAG_level_node				*pExternShadowLevelNode;
//	struct TAG_level_node				*pRoofUILevelNode;
//	UINT16											*pBackGround;
//	UINT16											*pZBackground;
//	UINT16											*pForcedShade;
//
// 	UINT16											*pEffectShades[ NUM_SOLDIER_EFFECTSHADES ]; // Shading tables for effects
//  THROW_PARAMS								*pThrowParams;
//  UINT16											*pCurrentShade;
//	UINT16											*pGlowShades[ 20 ]; //
//	UINT16											*pShades[ NUM_SOLDIER_SHADES ]; // Shading tables
//	UINT16											*p16BPPPalette;
//	SGPPaletteEntry							*p8BPPPalette
//	OBJECTTYPE									*pTempObject;

function SaveSoldierStructure(hFile: HWFILE): boolean {
  let cnt: UINT16;
  let uiNumBytesWritten: UINT32 = 0;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;

  let uiSaveSize: UINT32 = SOLDIER_TYPE_SIZE;
  let buffer: Buffer;

  // Loop through all the soldier structs to save
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    // if the soldier isnt active, dont add them to the saved game file.
    if (!Menptr[cnt].bActive) {
      // Save the byte specifing to NOT load the soldiers
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubZero, 0);

      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }
    }

    else {
      // Save the byte specifing to load the soldiers
      buffer = Buffer.allocUnsafe(1);
      buffer.writeUInt8(ubOne, 0);
      uiNumBytesWritten = FileWrite(hFile, buffer, 1);
      if (uiNumBytesWritten != 1) {
        return false;
      }

      // calculate checksum for soldier
      Menptr[cnt].uiMercChecksum = MercChecksum(Menptr[cnt]);
      // Save the soldier structure
      buffer = Buffer.allocUnsafe(uiSaveSize);
      writeSoldierType(Menptr[cnt], buffer);

      if (guiSavedGameVersion < 87) {
        uiNumBytesWritten = JA2EncryptedFileWrite(hFile, buffer, uiSaveSize);
      } else {
        uiNumBytesWritten = NewJA2EncryptedFileWrite(hFile, buffer, uiSaveSize);
      }
      if (uiNumBytesWritten != uiSaveSize) {
        return false;
      }

      //
      // Save all the pointer info from the structure
      //

      // Save the pMercPath
      if (!SaveMercPathFromSoldierStruct(hFile, cnt))
        return false;

      //
      // do we have a 	KEY_ON_RING									*pKeyRing;
      //

      if (Menptr[cnt].pKeyRing != null) {
        // write to the file saying we have the ....
        buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8(ubOne, 0);
        uiNumBytesWritten = FileWrite(hFile, buffer, 1);
        if (uiNumBytesWritten != 1) {
          return false;
        }

        // Now save the ....
        buffer = Buffer.allocUnsafe(NUM_KEYS * KEY_ON_RING_SIZE);
        writeObjectArray(<KEY_ON_RING[]>Menptr[cnt].pKeyRing, buffer, 0, writeKeyOnRing);
        uiNumBytesWritten = FileWrite(hFile, buffer, NUM_KEYS * KEY_ON_RING_SIZE);
        if (uiNumBytesWritten != NUM_KEYS * KEY_ON_RING_SIZE) {
          return false;
        }
      } else {
        // write to the file saying we DO NOT have the Key ring
        buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8(ubZero, 0);
        uiNumBytesWritten = FileWrite(hFile, buffer, 1);
        if (uiNumBytesWritten != 1) {
          return false;
        }
      }
    }
  }

  return true;
}

function LoadSoldierStructure(hFile: HWFILE): boolean {
  let cnt: UINT16;
  let uiNumBytesRead: UINT32 = 0;
  let SavedSoldierInfo: SOLDIERTYPE = createSoldierType();
  let uiSaveSize: UINT32 = SOLDIER_TYPE_SIZE;
  let ubId: UINT8;
  let ubOne: UINT8 = 1;
  let ubActive: UINT8 = 1;
  let uiPercentage: UINT32;
  let buffer: Buffer;

  let CreateStruct: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();

  // Loop through all the soldier and delete them all
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    TacticalRemoveSoldier(cnt);
  }

  // Loop through all the soldier structs to load
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    // update the progress bar
    uiPercentage = (cnt * 100) / (TOTAL_SOLDIERS - 1);

    RenderProgressBar(0, uiPercentage);

    // Read in a byte to tell us whether or not there is a soldier loaded here.
    buffer = Buffer.allocUnsafe(1);
    uiNumBytesRead = FileRead(hFile, buffer, 1);
    if (uiNumBytesRead != 1) {
      return false;
    }
    ubActive = buffer.readUInt8(0);

    // if the soldier is not active, continue
    if (!ubActive) {
      continue;
    }

    // else if there is a soldier
    else {
      // Read in the saved soldier info into a Temp structure
      buffer = Buffer.allocUnsafe(uiSaveSize);
      if (guiSaveGameVersion < 87) {
        uiNumBytesRead = JA2EncryptedFileRead(hFile, buffer, uiSaveSize);
      } else {
        uiNumBytesRead = NewJA2EncryptedFileRead(hFile, buffer, uiSaveSize);
      }
      if (uiNumBytesRead != uiSaveSize) {
        return false;
      }

      readSoldierType(SavedSoldierInfo, buffer);

      // check checksum
      if (MercChecksum(SavedSoldierInfo) != SavedSoldierInfo.uiMercChecksum) {
        return false;
      }

      // Make sure all the pointer references are NULL'ed out.
      SavedSoldierInfo.pTempObject = null;
      SavedSoldierInfo.pKeyRing = <KEY_ON_RING[]><unknown>null;
      SavedSoldierInfo.p8BPPPalette = null;
      SavedSoldierInfo.p16BPPPalette = null;
      memset(SavedSoldierInfo.pShades, 0, sizeof(UINT16 /* Pointer<UINT16> */) * NUM_SOLDIER_SHADES);
      memset(SavedSoldierInfo.pGlowShades, 0, sizeof(UINT16 /* Pointer<UINT16> */) * 20);
      SavedSoldierInfo.pCurrentShade = null;
      SavedSoldierInfo.pThrowParams = null;
      SavedSoldierInfo.pLevelNode = null;
      SavedSoldierInfo.pExternShadowLevelNode = null;
      SavedSoldierInfo.pRoofUILevelNode = null;
      SavedSoldierInfo.pBackGround = null;
      SavedSoldierInfo.pZBackground = null;
      SavedSoldierInfo.pForcedShade = null;
      SavedSoldierInfo.pMercPath = null;
      memset(SavedSoldierInfo.pEffectShades, 0, sizeof(UINT16 /* Pointer<UINT16> */) * NUM_SOLDIER_EFFECTSHADES);

      // if the soldier wasnt active, dont add them now.  Advance to the next merc
      // if( !SavedSoldierInfo.bActive )
      //	continue;

      // Create the new merc
      resetSoldierCreateStruct(CreateStruct);
      CreateStruct.bTeam = SavedSoldierInfo.bTeam;
      CreateStruct.ubProfile = SavedSoldierInfo.ubProfile;
      CreateStruct.fUseExistingSoldier = true;
      CreateStruct.pExistingSoldier = SavedSoldierInfo;

      if (!TacticalCreateSoldier(CreateStruct, addressof(ubId)))
        return false;

      // Load the pMercPath
      if (!LoadMercPathToSoldierStruct(hFile, ubId))
        return false;

      //
      // do we have a 	KEY_ON_RING									*pKeyRing;
      //

      // Read the file to see if we have to load the keys
      buffer = Buffer.allocUnsafe(1);
      uiNumBytesRead = FileRead(hFile, buffer, 1);
      if (uiNumBytesRead != 1) {
        return false;
      }
      ubOne = buffer.readUInt8(0);

      if (ubOne) {
        // Now Load the ....
        buffer = Buffer.allocUnsafe(NUM_KEYS * KEY_ON_RING_SIZE);
        uiNumBytesRead = FileRead(hFile, buffer, NUM_KEYS * KEY_ON_RING_SIZE);
        if (uiNumBytesRead != NUM_KEYS * KEY_ON_RING_SIZE) {
          return false;
        }
        readObjectArray(<KEY_ON_RING[]>Menptr[cnt].pKeyRing, buffer, 0, readKeyOnRing);
      } else {
        Assert(Menptr[cnt].pKeyRing == null);
      }

      // if the soldier is an IMP character
      if (Menptr[cnt].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__PLAYER_CHARACTER && Menptr[cnt].bTeam == gbPlayerNum) {
        ResetIMPCharactersEyesAndMouthOffsets(Menptr[cnt].ubProfile);
      }

      // if the saved game version is before x, calculate the amount of money paid to mercs
      if (guiSaveGameVersion < 83) {
        // if the soldier is someone
        if (Menptr[cnt].ubProfile != NO_PROFILE) {
          if (Menptr[cnt].ubWhatKindOfMercAmI == Enum260.MERC_TYPE__MERC) {
            gMercProfiles[Menptr[cnt].ubProfile].uiTotalCostToDate = gMercProfiles[Menptr[cnt].ubProfile].sSalary * gMercProfiles[Menptr[cnt].ubProfile].iMercMercContractLength;
          } else {
            gMercProfiles[Menptr[cnt].ubProfile].uiTotalCostToDate = gMercProfiles[Menptr[cnt].ubProfile].sSalary * Menptr[cnt].iTotalContractLength;
          }
        }
      }

// FIXME: Language-specific code
// #ifdef GERMAN
//       // Fix neutral flags
//       if (guiSaveGameVersion < 94) {
//         if (Menptr[cnt].bTeam == OUR_TEAM && Menptr[cnt].bNeutral && Menptr[cnt].bAssignment != ASSIGNMENT_POW) {
//           // turn off neutral flag
//           Menptr[cnt].bNeutral = FALSE;
//         }
//       }
// #endif
      // JA2Gold: fix next-to-previous attacker value
      if (guiSaveGameVersion < 99) {
        Menptr[cnt].ubNextToPreviousAttackerID = NOBODY;
      }
    }
  }

  // Fix robot
  if (guiSaveGameVersion <= 87) {
    let pSoldier: SOLDIERTYPE | null;

    if (gMercProfiles[Enum268.ROBOT].inv[Enum261.VESTPOS] == Enum225.SPECTRA_VEST) {
      // update this
      gMercProfiles[Enum268.ROBOT].inv[Enum261.VESTPOS] = Enum225.SPECTRA_VEST_18;
      gMercProfiles[Enum268.ROBOT].inv[Enum261.HELMETPOS] = Enum225.SPECTRA_HELMET_18;
      gMercProfiles[Enum268.ROBOT].inv[Enum261.LEGPOS] = Enum225.SPECTRA_LEGGINGS_18;
      gMercProfiles[Enum268.ROBOT].bAgility = 50;
      pSoldier = FindSoldierByProfileID(Enum268.ROBOT, false);
      if (pSoldier) {
        pSoldier.inv[Enum261.VESTPOS].usItem = Enum225.SPECTRA_VEST_18;
        pSoldier.inv[Enum261.HELMETPOS].usItem = Enum225.SPECTRA_HELMET_18;
        pSoldier.inv[Enum261.LEGPOS].usItem = Enum225.SPECTRA_LEGGINGS_18;
        pSoldier.bAgility = 50;
      }
    }
  }

  return true;
}

/*
BOOLEAN SavePtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile )
{
        UINT8		ubOne = 1;
        UINT8		ubZero = 0;
        UINT32	uiNumBytesWritten;

        if( pData != NULL )
        {
                // write to the file saying we have the ....
                FileWrite( hFile, &ubOne, 1, &uiNumBytesWritten );
                if( uiNumBytesWritten != 1 )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }

                // Now save the ....
                FileWrite( hFile, pData, uiSizeOfObject, &uiNumBytesWritten );
                if( uiNumBytesWritten != uiSizeOfObject )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }
        }
        else
        {
                // write to the file saying we DO NOT have the ...
                FileWrite( hFile, &ubZero, 1, &uiNumBytesWritten );
                if( uiNumBytesWritten != 1 )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }
        }

        return( TRUE );
}



BOOLEAN LoadPtrInfo( PTR *pData, UINT32 uiSizeOfObject, HWFILE hFile )
{
        UINT8		ubOne = 1;
        UINT8		ubZero = 0;
        UINT32	uiNumBytesRead;

        // Read the file to see if we have to load the ....
        FileRead( hFile, &ubOne, 1, &uiNumBytesRead );
        if( uiNumBytesRead != 1 )
        {
                DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Read Soldier Structure from File" ) );
                return(FALSE);
        }

        if( ubOne )
        {
                // if there is memory already allocated, free it
                MemFree( pData );

                //Allocate space for the structure data
                *pData = MemAlloc( uiSizeOfObject );
                if( pData == NULL )
                        return( FALSE );

                // Now Load the ....
                FileRead( hFile, pData, uiSizeOfObject, &uiNumBytesRead );
                if( uiNumBytesRead != uiSizeOfObject )
                {
                        DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("FAILED to Write Soldier Structure to File" ) );
                        return(FALSE);
                }
        }
        else
        {
                // if there is memory already allocated, free it
                if( pData )
                {
                        MemFree( pData );
                        pData = NULL;
                }
        }


        return( TRUE );
}
*/

export function SaveFilesToSavedGame(pSrcFileName: string /* STR */, hFile: HWFILE): boolean {
  let uiFileSize: UINT32;
  let uiNumBytesWritten: UINT32 = 0;
  let hSrcFile: HWFILE;
  let pData: Buffer;
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // open the file
  hSrcFile = FileOpen(pSrcFileName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (!hSrcFile) {
    return false;
  }

  // Get the file size of the source data file
  uiFileSize = FileGetSize(hSrcFile);
  if (uiFileSize == 0)
    return false;

  // Write the the size of the file to the saved game file
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiFileSize, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  // Allocate a buffer to read the data into
  pData = Buffer.allocUnsafe(uiFileSize);

  // Read the saource file into the buffer
  uiNumBytesRead = FileRead(hSrcFile, pData, uiFileSize);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hSrcFile);
    return false;
  }

  // Write the buffer to the saved game file
  uiNumBytesWritten = FileWrite(hFile, pData, uiFileSize);
  if (uiNumBytesWritten != uiFileSize) {
    FileClose(hSrcFile);
    return false;
  }

  // Clsoe the source data file
  FileClose(hSrcFile);

  return true;
}

export function LoadFilesFromSavedGame(pSrcFileName: string /* STR */, hFile: HWFILE): boolean {
  let uiFileSize: UINT32;
  let uiNumBytesWritten: UINT32 = 0;
  let hSrcFile: HWFILE;
  let pData: Buffer;
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // If the source file exists, delete it
  if (FileExists(pSrcFileName)) {
    if (!FileDelete(pSrcFileName)) {
      // unable to delete the original file
      return false;
    }
  }

  // open the destination file to write to
  hSrcFile = FileOpen(pSrcFileName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);
  if (!hSrcFile) {
    // error, we cant open the saved game file
    return false;
  }

  // Read the size of the data
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    FileClose(hSrcFile);

    return false;
  }
  uiFileSize = buffer.readUInt32LE(0);

  // if there is nothing in the file, return;
  if (uiFileSize == 0) {
    FileClose(hSrcFile);
    return true;
  }

  // Allocate a buffer to read the data into
  pData = Buffer.allocUnsafe(uiFileSize);

  // Read into the buffer
  uiNumBytesRead = FileRead(hFile, pData, uiFileSize);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hSrcFile);

    return false;
  }

  // Write the buffer to the new file
  uiNumBytesWritten = FileWrite(hSrcFile, pData, uiFileSize);
  if (uiNumBytesWritten != uiFileSize) {
    FileClose(hSrcFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to Write to the %s File", pSrcFileName));

    return false;
  }

  // Close the source data file
  FileClose(hSrcFile);

  return true;
}

function SaveEmailToSavedGame(hFile: HWFILE): boolean {
  let uiNumOfEmails: UINT32 = 0;
  let pEmail: Email | null = pEmailList;
  let pTempEmail: Email | null = null;
  let cnt: UINT32;
  let uiStringLength: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;
  let buffer: Buffer;

  let SavedEmail: SavedEmailStruct = createSavedEmailStruct();

  // loop through all the email to find out the total number
  while (pEmail) {
    pEmail = pEmail.Next;
    uiNumOfEmails++;
  }

  // write the number of email messages
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumOfEmails, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  // loop trhough all the emails, add each one individually
  pEmail = pEmailList;
  for (cnt = 0; cnt < uiNumOfEmails; cnt++) {
    Assert(pEmail);
    // Get the strng length of the subject
    uiStringLength = (pEmail.pSubject.length + 1) * 2;

    // write the length of the current emails subject to the saved game file
    buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32LE(uiStringLength, 0);
    uiNumBytesWritten = FileWrite(hFile, buffer, 4);
    if (uiNumBytesWritten != 4) {
      return false;
    }

    // write the subject of the current email to the saved game file
    buffer = Buffer.allocUnsafe(uiStringLength);
    writeStringNL(pEmail.pSubject, buffer, 0, uiStringLength, 'utf16le');

    uiNumBytesWritten = FileWrite(hFile, buffer, uiStringLength);
    if (uiNumBytesWritten != uiStringLength) {
      return false;
    }

    // Get the current emails data and asign it to the 'Saved email' struct
    SavedEmail.usOffset = pEmail.usOffset;
    SavedEmail.usLength = pEmail.usLength;
    SavedEmail.ubSender = pEmail.ubSender;
    SavedEmail.iDate = pEmail.iDate;
    SavedEmail.iId = pEmail.iId;
    SavedEmail.iFirstData = pEmail.iFirstData;
    SavedEmail.uiSecondData = pEmail.uiSecondData;
    SavedEmail.fRead = pEmail.fRead;
    SavedEmail.fNew = pEmail.fNew;
    SavedEmail.iThirdData = pEmail.iThirdData;
    SavedEmail.iFourthData = pEmail.iFourthData;
    SavedEmail.uiFifthData = pEmail.uiFifthData;
    SavedEmail.uiSixData = pEmail.uiSixData;

    // write the email header to the saved game file
    buffer = Buffer.allocUnsafe(SAVED_EMAIL_STRUCT_SIZE);
    writeSavedEmailStruct(SavedEmail, buffer);

    uiNumBytesWritten = FileWrite(hFile, buffer, SAVED_EMAIL_STRUCT_SIZE);
    if (uiNumBytesWritten != SAVED_EMAIL_STRUCT_SIZE) {
      return false;
    }

    // advance to the next email
    pEmail = pEmail.Next;
  }

  return true;
}

function LoadEmailFromSavedGame(hFile: HWFILE): boolean {
  let uiNumOfEmails: UINT32 = 0;
  let uiSizeOfSubject: UINT32 = 0;
  let pEmail: Email | null = pEmailList;
  let pTempEmail: Email | null = null;
  let pData: string;
  let cnt: UINT32;
  let SavedEmail: SavedEmailStruct = createSavedEmailStruct();
  let uiNumBytesRead: UINT32 = 0;
  let buffer: Buffer;

  // Delete the existing list of emails
  ShutDownEmailList();

  pEmailList = null;
  // Allocate memory for the header node
  pEmailList = createEmail();

  // read in the number of email messages
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }
  uiNumOfEmails = buffer.readUInt32LE(0);

  // loop through all the emails, add each one individually
  pEmail = pEmailList;
  for (cnt = 0; cnt < uiNumOfEmails; cnt++) {
    // get the length of the email subject
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      return false;
    }
    uiSizeOfSubject = buffer.readUInt32LE(0);

    // Get the subject
    buffer = Buffer.allocUnsafe(uiSizeOfSubject);
    uiNumBytesRead = FileRead(hFile, buffer, uiSizeOfSubject);
    if (uiNumBytesRead != uiSizeOfSubject) {
      return false;
    }
    pData = readStringNL(buffer, 'utf16le', 0, uiSizeOfSubject);

    // get the rest of the data from the email
    buffer = Buffer.allocUnsafe(SAVED_EMAIL_STRUCT_SIZE);
    uiNumBytesRead = FileRead(hFile, buffer, SAVED_EMAIL_STRUCT_SIZE);
    if (uiNumBytesRead != SAVED_EMAIL_STRUCT_SIZE) {
      return false;
    }
    readSavedEmailStruct(SavedEmail, buffer);

    //
    // add the email
    //

    // if we havent allocated space yet
    pTempEmail = createEmail();

    pTempEmail.usOffset = SavedEmail.usOffset;
    pTempEmail.usLength = SavedEmail.usLength;
    pTempEmail.ubSender = SavedEmail.ubSender;
    pTempEmail.iDate = SavedEmail.iDate;
    pTempEmail.iId = SavedEmail.iId;
    pTempEmail.fRead = SavedEmail.fRead;
    pTempEmail.fNew = SavedEmail.fNew;
    pTempEmail.pSubject = pData;
    pTempEmail.iFirstData = SavedEmail.iFirstData;
    pTempEmail.uiSecondData = SavedEmail.uiSecondData;
    pTempEmail.iThirdData = SavedEmail.iThirdData;
    pTempEmail.iFourthData = SavedEmail.iFourthData;
    pTempEmail.uiFifthData = SavedEmail.uiFifthData;
    pTempEmail.uiSixData = SavedEmail.uiSixData;

    // add the current email in
    pEmail.Next = pTempEmail;
    pTempEmail.Prev = pEmail;

    // moved to the next email
    pEmail = pEmail.Next;

    AddMessageToPages(pTempEmail.iId);
  }

  // if there are emails
  if (cnt) {
    // the first node of the LL was a dummy, node,get rid  of it
    pTempEmail = pEmailList;
    pEmailList = <Email>pEmailList.Next;
    pEmailList.Prev = null;
  } else {
    pEmailList = null;
  }

  return true;
}

function SaveTacticalStatusToSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // write the gTacticalStatus to the saved game file
  buffer = Buffer.allocUnsafe(TACTICAL_STATUS_TYPE_SIZE);
  writeTacticalStatusType(gTacticalStatus, buffer);

  uiNumBytesWritten = FileWrite(hFile, buffer, TACTICAL_STATUS_TYPE_SIZE);
  if (uiNumBytesWritten != TACTICAL_STATUS_TYPE_SIZE) {
    return false;
  }

  //
  // Save the current sector location to the saved game file
  //

  buffer = Buffer.allocUnsafe(2);

  // save gWorldSectorX
  buffer.writeInt16LE(gWorldSectorX, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 2);
  if (uiNumBytesWritten != 2) {
    return false;
  }

  // save gWorldSectorY
  buffer.writeInt16LE(gWorldSectorY, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 2);
  if (uiNumBytesWritten != 2) {
    return false;
  }

  // save gbWorldSectorZ
  buffer.writeInt8(gbWorldSectorZ, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    return false;
  }

  return true;
}

function LoadTacticalStatusFromSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // Read the gTacticalStatus to the saved game file
  buffer = Buffer.allocUnsafe(TACTICAL_STATUS_TYPE_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, TACTICAL_STATUS_TYPE_SIZE);
  if (uiNumBytesRead != TACTICAL_STATUS_TYPE_SIZE) {
    return false;
  }

  readTacticalStatusType(gTacticalStatus, buffer);

  //
  // Load the current sector location to the saved game file
  //

  buffer = Buffer.allocUnsafe(2);

  // Load gWorldSectorX
  uiNumBytesRead = FileRead(hFile, buffer, 2);
  if (uiNumBytesRead != 2) {
    return false;
  }

  gWorldSectorX = buffer.readInt16LE(0);

  // Load gWorldSectorY
  uiNumBytesRead = FileRead(hFile, buffer, 2);
  if (uiNumBytesRead != 2) {
    return false;
  }

  gWorldSectorY = buffer.readInt16LE(0);

  // Load gbWorldSectorZ
  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    return false;
  }

  gbWorldSectorZ = buffer.readInt8(0);

  return true;
}

export function CopySavedSoldierInfoToNewSoldier(pDestSourceInfo: SOLDIERTYPE, pSourceInfo: SOLDIERTYPE): boolean {
  // Copy the old soldier information over to the new structure
  copySoldierType(pDestSourceInfo, pSourceInfo);

  return true;
}

function SetMercsInsertionGridNo(): boolean {
  let cnt: UINT16 = 0;

  // loop through all the mercs
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    // if the soldier is active
    if (Menptr[cnt].bActive) {
      if (Menptr[cnt].sGridNo != NOWHERE) {
        // set the insertion type to gridno
        Menptr[cnt].ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;

        // set the insertion gridno
        Menptr[cnt].usStrategicInsertionData = Menptr[cnt].sGridNo;

        // set the gridno
        Menptr[cnt].sGridNo = NOWHERE;
      }
    }
  }

  return true;
}

function SaveOppListInfoToSavedGame(hFile: HWFILE): boolean {
  let uiSaveSize: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;
  let buffer: Buffer;

  // Save the Public Opplist
  uiSaveSize = MAXTEAMS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < MAXTEAMS; i++) {
    writeIntArray(gbPublicOpplist[i], buffer, 0, 1);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Seen Oppenents
  uiSaveSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeIntArray(gbSeenOpponents[i], buffer, 0, 1);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Last Known Opp Locations
  uiSaveSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeIntArray(gsLastKnownOppLoc[i], buffer, 0, 2);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Last Known Opp Level
  uiSaveSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeIntArray(gbLastKnownOppLevel[i], buffer, 0, 1);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Public Last Known Opp Locations
  uiSaveSize = MAXTEAMS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < MAXTEAMS; i++) {
    writeIntArray(gsPublicLastKnownOppLoc[i], buffer, 0, 2);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Public Last Known Opp Level
  uiSaveSize = MAXTEAMS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < MAXTEAMS; i++) {
    writeIntArray(gbPublicLastKnownOppLevel[i], buffer, 0, 1);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Public Noise Volume
  uiSaveSize = MAXTEAMS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  writeUIntArray(gubPublicNoiseVolume, buffer, 0, 1);
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  // Save the Public Last Noise Gridno
  uiSaveSize = MAXTEAMS;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  writeIntArray(gsPublicNoiseGridno, buffer, 0, 2);
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  return true;
}

function LoadOppListInfoFromSavedGame(hFile: HWFILE): boolean {
  let uiLoadSize: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;
  let buffer: Buffer;

  // Load the Public Opplist
  uiLoadSize = MAXTEAMS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < MAXTEAMS; i++) {
    readIntArray(gbPublicOpplist[i], buffer, 0, 1);
  }

  // Load the Seen Oppenents
  uiLoadSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readIntArray(gbSeenOpponents[i], buffer, 0, 1);
  }

  // Load the Last Known Opp Locations
  uiLoadSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readIntArray(gsLastKnownOppLoc[i], buffer, 0, 2);
  }

  // Load the Last Known Opp Level
  uiLoadSize = TOTAL_SOLDIERS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readIntArray(gbLastKnownOppLevel[i], buffer, 0, 1);
  }

  // Load the Public Last Known Opp Locations
  uiLoadSize = MAXTEAMS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < MAXTEAMS; i++) {
    readIntArray(gsPublicLastKnownOppLoc[i], buffer, 0, 2);
  }

  // Load the Public Last Known Opp Level
  uiLoadSize = MAXTEAMS * TOTAL_SOLDIERS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < MAXTEAMS; i++) {
    readIntArray(gbPublicLastKnownOppLevel[i], buffer, 0, 1);
  }

  // Load the Public Noise Volume
  uiLoadSize = MAXTEAMS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  readUIntArray(gubPublicNoiseVolume, buffer, 0, 1);

  // Load the Public Last Noise Gridno
  uiLoadSize = MAXTEAMS;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  readIntArray(gsPublicNoiseGridno, buffer, 0, 2);

  return true;
}

function SaveWatchedLocsToSavedGame(hFile: HWFILE): boolean {
  let uiArraySize: UINT32;
  let uiSaveSize: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;
  let buffer: Buffer;

  uiArraySize = TOTAL_SOLDIERS * NUM_WATCHED_LOCS;

  // save locations of watched points
  uiSaveSize = uiArraySize * 2;
  buffer = Buffer.allocUnsafe(uiSaveSize);
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeIntArray(gsWatchedLoc[i], buffer, 0, 2);
  }

  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  uiSaveSize = uiArraySize * 1;
  buffer = Buffer.allocUnsafe(uiSaveSize);

  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeIntArray(gbWatchedLocLevel[i], buffer, 0, 1);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeUIntArray(gubWatchedLocPoints[i], buffer, 0, 1);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    writeBooleanArray(gfWatchedLocReset[i], buffer, 0);
  }
  uiNumBytesWritten = FileWrite(hFile, buffer, uiSaveSize);
  if (uiNumBytesWritten != uiSaveSize) {
    return false;
  }

  return true;
}

function LoadWatchedLocsFromSavedGame(hFile: HWFILE): boolean {
  let uiArraySize: UINT32;
  let uiLoadSize: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;
  let buffer: Buffer;

  uiArraySize = TOTAL_SOLDIERS * NUM_WATCHED_LOCS;

  uiLoadSize = uiArraySize * 2;
  buffer = Buffer.allocUnsafe(uiLoadSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readIntArray(gsWatchedLoc[i], buffer, 0, 2);
  }

  uiLoadSize = uiArraySize * 1;
  buffer = Buffer.allocUnsafe(uiLoadSize);

  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readIntArray(gbWatchedLocLevel[i], buffer, 0, 1);
  }

  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readUIntArray(gubWatchedLocPoints[i], buffer, 0, 1);
  }

  uiNumBytesRead = FileRead(hFile, buffer, uiLoadSize);
  if (uiNumBytesRead != uiLoadSize) {
    return false;
  }
  for (let i = 0; i < TOTAL_SOLDIERS; i++) {
    readBooleanArray(gfWatchedLocReset[i], buffer, 0);
  }

  return true;
}

export function CreateSavedGameFileNameFromNumber(ubSaveGameID: UINT8): string {
  let zNewFileName: string;

  // if we are creating the QuickSave file
  if (ubSaveGameID == 0) {
      zNewFileName = sprintf("%S\\%S.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], pMessageStrings[Enum333.MSG_QUICKSAVE_NAME], pMessageStrings[Enum333.MSG_SAVEEXTENSION]);
  }
  //#ifdef JA2BETAVERSION
  else if (ubSaveGameID == SAVE__END_TURN_NUM) {
    // The name of the file
    zNewFileName = sprintf("%S\\Auto%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], guiLastSaveGameNum, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);

    // increment end turn number
    guiLastSaveGameNum++;

    // just have 2 saves
    if (guiLastSaveGameNum == 2) {
      guiLastSaveGameNum = 0;
    }
  }
  //#endif

  else
    zNewFileName = sprintf("%S\\%S%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], pMessageStrings[Enum333.MSG_SAVE_NAME], ubSaveGameID, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);

  return zNewFileName;
}

function SaveMercPathFromSoldierStruct(hFile: HWFILE, ubID: UINT8): boolean {
  let uiNumOfNodes: UINT32 = 0;
  let pTempPath: PathSt | null = Menptr[ubID].pMercPath;
  let uiNumBytesWritten: UINT32 = 0;
  let buffer: Buffer;

  // loop through to get all the nodes
  while (pTempPath) {
    uiNumOfNodes++;
    pTempPath = pTempPath.pNext;
  }

  // Save the number of the nodes
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumOfNodes, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  // loop through all the nodes and add them
  pTempPath = Menptr[ubID].pMercPath;

  // loop through nodes and save all the nodes
  buffer = Buffer.allocUnsafe(PATH_ST_SIZE);
  while (pTempPath) {
    // Save the number of the nodes
    writePathSt(pTempPath, buffer);
    uiNumBytesWritten = FileWrite(hFile, buffer, PATH_ST_SIZE);
    if (uiNumBytesWritten != PATH_ST_SIZE) {
      return false;
    }

    pTempPath = pTempPath.pNext;
  }

  return true;
}

function LoadMercPathToSoldierStruct(hFile: HWFILE, ubID: UINT8): boolean {
  let uiNumOfNodes: UINT32 = 0;
  let pTempPath: PathSt | null = null;
  let pTemp: PathSt | null = null;
  let uiNumBytesRead: UINT32 = 0;
  let cnt: UINT32;
  let buffer: Buffer;

  // The list SHOULD be empty at this point
  /*
          //if there is nodes, loop through and delete them
          if( Menptr[ ubID ].pMercPath )
          {
                  pTempPath = Menptr[ ubID ].pMercPath;
                  while( pTempPath )
                  {
                          pTemp = pTempPath;
                          pTempPath = pTempPath->pNext;

                          MemFree( pTemp );
                          pTemp=NULL;
                  }

                  Menptr[ ubID ].pMercPath = NULL;
          }
  */

  // Load the number of the nodes
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }
  uiNumOfNodes = buffer.readUInt32LE(0);

  // load all the nodes
  buffer = Buffer.allocUnsafe(PATH_ST_SIZE);
  for (cnt = 0; cnt < uiNumOfNodes; cnt++) {
    // Allocate memory for the new node
    pTemp = createPathSt();

    // Load the node
    uiNumBytesRead = FileRead(hFile, buffer, PATH_ST_SIZE);
    if (uiNumBytesRead != PATH_ST_SIZE) {
      return false;
    }
    readPathSt(pTemp, buffer);

    // Put the node into the list
    if (!pTempPath) {
      pTempPath = pTemp;
      pTemp.pPrev = null;
    } else {
      pTempPath.pNext = pTemp;
      pTemp.pPrev = pTempPath;

      pTempPath = pTempPath.pNext;
    }

    pTemp.pNext = null;
  }

  // move to beginning of list
  pTempPath = MoveToBeginningOfPathList(pTempPath);

  Menptr[ubID].pMercPath = pTempPath;
  if (Menptr[ubID].pMercPath)
    Menptr[ubID].pMercPath.pPrev = null;

  return true;
}

function SaveGeneralInfo(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  let sGeneralInfo: GENERAL_SAVE_INFO = createGeneralSaveInfo();

  sGeneralInfo.ubMusicMode = gubMusicMode;
  sGeneralInfo.uiCurrentUniqueSoldierId = guiCurrentUniqueSoldierId;
  sGeneralInfo.uiCurrentScreen = guiPreviousOptionScreen;

  sGeneralInfo.usSelectedSoldier = gusSelectedSoldier;
  sGeneralInfo.sRenderCenterX = gsRenderCenterX;
  sGeneralInfo.sRenderCenterY = gsRenderCenterY;
  sGeneralInfo.fAtLeastOneMercWasHired = gfAtLeastOneMercWasHired;
  sGeneralInfo.fHavePurchasedItemsFromTony = gfHavePurchasedItemsFromTony;

  sGeneralInfo.fShowItemsFlag = fShowItemsFlag;
  sGeneralInfo.fShowTownFlag = fShowTownFlag;
  sGeneralInfo.fShowMineFlag = fShowMineFlag;
  sGeneralInfo.fShowAircraftFlag = fShowAircraftFlag;
  sGeneralInfo.fShowTeamFlag = fShowTeamFlag;

  sGeneralInfo.fHelicopterAvailable = fHelicopterAvailable;

  // helicopter vehicle id
  sGeneralInfo.iHelicopterVehicleId = iHelicopterVehicleId;

  // total distance travelled
  //	sGeneralInfo.iTotalHeliDistanceSinceRefuel = iTotalHeliDistanceSinceRefuel;

  // total owed by player
  sGeneralInfo.iTotalAccumulatedCostByPlayer = iTotalAccumulatedCostByPlayer;

  // whether or not skyrider is alive and well? and on our side yet?
  sGeneralInfo.fSkyRiderAvailable = fSkyRiderAvailable;

  // is the heli in the air?
  sGeneralInfo.fHelicopterIsAirBorne = fHelicopterIsAirBorne;

  // is the pilot returning straight to base?
  sGeneralInfo.fHeliReturnStraightToBase = fHeliReturnStraightToBase;

  // heli hovering
  sGeneralInfo.fHoveringHelicopter = fHoveringHelicopter;

  // time started hovering
  sGeneralInfo.uiStartHoverTime = uiStartHoverTime;

  // what state is skyrider's dialogue in in?
  sGeneralInfo.uiHelicopterSkyriderTalkState = guiHelicopterSkyriderTalkState;

  // the flags for skyrider events
  sGeneralInfo.fShowEstoniRefuelHighLight = fShowEstoniRefuelHighLight;
  sGeneralInfo.fShowOtherSAMHighLight = fShowOtherSAMHighLight;
  sGeneralInfo.fShowDrassenSAMHighLight = fShowDrassenSAMHighLight;
  sGeneralInfo.fShowCambriaHospitalHighLight = fShowCambriaHospitalHighLight;

  // The current state of the weather
  sGeneralInfo.uiEnvWeather = guiEnvWeather;

  sGeneralInfo.ubDefaultButton = gubDefaultButton;

  sGeneralInfo.fSkyriderEmptyHelpGiven = gfSkyriderEmptyHelpGiven;
  sGeneralInfo.ubHelicopterHitsTaken = gubHelicopterHitsTaken;
  sGeneralInfo.fSkyriderSaidCongratsOnTakingSAM = gfSkyriderSaidCongratsOnTakingSAM;
  sGeneralInfo.ubPlayerProgressSkyriderLastCommentedOn = gubPlayerProgressSkyriderLastCommentedOn;

  sGeneralInfo.fEnterMapDueToContract = fEnterMapDueToContract;
  sGeneralInfo.ubQuitType = ubQuitType;

  if (pContractReHireSoldier != null)
    sGeneralInfo.sContractRehireSoldierID = pContractReHireSoldier.ubID;
  else
    sGeneralInfo.sContractRehireSoldierID = -1;

  copyGameOptions(sGeneralInfo.GameOptions, gGameOptions);

  // Save the Ja2Clock()
  sGeneralInfo.uiBaseJA2Clock = guiBaseJA2Clock;

  // Save the current tactical panel mode
  sGeneralInfo.sCurInterfacePanel = gsCurInterfacePanel;

  // Save the selected merc
  if (gpSMCurrentMerc)
    sGeneralInfo.ubSMCurrentMercID = gpSMCurrentMerc.ubID;
  else
    sGeneralInfo.ubSMCurrentMercID = 255;

  // Save the fact that it is the first time in mapscreen
  sGeneralInfo.fFirstTimeInMapScreen = fFirstTimeInMapScreen;

  // save map screen disabling buttons
  sGeneralInfo.fDisableDueToBattleRoster = fDisableDueToBattleRoster;
  sGeneralInfo.fDisableMapInterfaceDueToBattle = fDisableMapInterfaceDueToBattle;

  // Save boxing info
  copyArray(sGeneralInfo.sBoxerGridNo, gsBoxerGridNo);
  copyArray(sGeneralInfo.ubBoxerID, gubBoxerID);
  copyArray(sGeneralInfo.fBoxerFought, gfBoxerFought);

  // Save the helicopter status
  sGeneralInfo.fHelicopterDestroyed = fHelicopterDestroyed;
  sGeneralInfo.fShowMapScreenHelpText = fShowMapScreenHelpText;

  sGeneralInfo.iSortStateForMapScreenList = giSortStateForMapScreenList;
  sGeneralInfo.fFoundTixa = fFoundTixa;

  sGeneralInfo.uiTimeOfLastSkyriderMonologue = guiTimeOfLastSkyriderMonologue;
  sGeneralInfo.fSkyRiderSetUp = fSkyRiderSetUp;

  copyArray(sGeneralInfo.fRefuelingSiteAvailable, fRefuelingSiteAvailable);

  // Meanwhile stuff
  copyMeanwhileDefinition(sGeneralInfo.gCurrentMeanwhileDef, gCurrentMeanwhileDef);
  // sGeneralInfo.gfMeanwhileScheduled = gfMeanwhileScheduled;
  sGeneralInfo.gfMeanwhileTryingToStart = gfMeanwhileTryingToStart;
  sGeneralInfo.gfInMeanwhile = gfInMeanwhile;

  // list of dead guys for squads...in id values -> -1 means no one home
  for (let i = 0; i < Enum275.NUMBER_OF_SQUADS; i++) {
    copyArray(sGeneralInfo.sDeadMercs[i], sDeadMercs[i]);
  }

  // level of public noises
  copyArray(sGeneralInfo.gbPublicNoiseLevel, gbPublicNoiseLevel);

  // The screen count for the initscreen
  sGeneralInfo.gubScreenCount = gubScreenCount;

  // used for the mean while screen
  sGeneralInfo.uiMeanWhileFlags = uiMeanWhileFlags;

  // Imp portrait number
  sGeneralInfo.iPortraitNumber = iPortraitNumber;

  // location of first enocunter with enemy
  sGeneralInfo.sWorldSectorLocationOfFirstBattle = sWorldSectorLocationOfFirstBattle;

  // State of email flags
  sGeneralInfo.fUnReadMailFlag = fUnReadMailFlag;
  sGeneralInfo.fNewMailFlag = fNewMailFlag;
  sGeneralInfo.fOldUnReadFlag = fOldUnreadFlag;
  sGeneralInfo.fOldNewMailFlag = fOldNewMailFlag;

  sGeneralInfo.fShowMilitia = fShowMilitia;

  sGeneralInfo.fNewFilesInFileViewer = fNewFilesInFileViewer;

  sGeneralInfo.fLastBoxingMatchWonByPlayer = gfLastBoxingMatchWonByPlayer;

  copyArray(sGeneralInfo.fSamSiteFound, fSamSiteFound);

  sGeneralInfo.ubNumTerrorists = gubNumTerrorists;
  sGeneralInfo.ubCambriaMedicalObjects = gubCambriaMedicalObjects;

  sGeneralInfo.fDisableTacticalPanelButtons = gfDisableTacticalPanelButtons;

  sGeneralInfo.sSelMapX = sSelMapX;
  sGeneralInfo.sSelMapY = sSelMapY;
  sGeneralInfo.iCurrentMapSectorZ = iCurrentMapSectorZ;

  // Save the current status of the help screens flag that say wether or not the user has been there before
  sGeneralInfo.usHasPlayerSeenHelpScreenInCurrentScreen = gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen;

  sGeneralInfo.ubBoxingMatchesWon = gubBoxingMatchesWon;
  sGeneralInfo.ubBoxersRests = gubBoxersRests;
  sGeneralInfo.fBoxersResting = gfBoxersResting;

  sGeneralInfo.ubDesertTemperature = gubDesertTemperature;
  sGeneralInfo.ubGlobalTemperature = gubGlobalTemperature;

  sGeneralInfo.sMercArriveSectorX = gsMercArriveSectorX;
  sGeneralInfo.sMercArriveSectorY = gsMercArriveSectorY;

  sGeneralInfo.fCreatureMeanwhileScenePlayed = gfCreatureMeanwhileScenePlayed;

  // save the global player num
  sGeneralInfo.ubPlayerNum = gbPlayerNum;

  // New stuff for the Prebattle interface / autoresolve
  sGeneralInfo.fPersistantPBI = gfPersistantPBI;
  sGeneralInfo.ubEnemyEncounterCode = gubEnemyEncounterCode;
  sGeneralInfo.ubExplicitEnemyEncounterCode = gubExplicitEnemyEncounterCode;
  sGeneralInfo.fBlitBattleSectorLocator = gfBlitBattleSectorLocator;
  sGeneralInfo.ubPBSectorX = gubPBSectorX;
  sGeneralInfo.ubPBSectorY = gubPBSectorY;
  sGeneralInfo.ubPBSectorZ = gubPBSectorZ;
  sGeneralInfo.fCantRetreatInPBI = gfCantRetreatInPBI;
  sGeneralInfo.fExplosionQueueActive = gfExplosionQueueActive;

  sGeneralInfo.bSelectedInfoChar = bSelectedInfoChar;

  sGeneralInfo.iHospitalTempBalance = giHospitalTempBalance;
  sGeneralInfo.iHospitalRefund = giHospitalRefund;
  sGeneralInfo.bHospitalPriceModifier = gbHospitalPriceModifier;
  sGeneralInfo.fPlayerTeamSawJoey = gfPlayerTeamSawJoey;
  sGeneralInfo.fMikeShouldSayHi = gfMikeShouldSayHi;

  // Setup the
  // Save the current music mode
  buffer = Buffer.allocUnsafe(GENERAL_SAVE_INFO_SIZE);
  writeGeneralSaveInfo(sGeneralInfo, buffer);

  uiNumBytesWritten = FileWrite(hFile, buffer, GENERAL_SAVE_INFO_SIZE);
  if (uiNumBytesWritten != GENERAL_SAVE_INFO_SIZE) {
    FileClose(hFile);
    return false;
  }

  return true;
}

function LoadGeneralInfo(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;

  let sGeneralInfo: GENERAL_SAVE_INFO = createGeneralSaveInfo();
  let buffer: Buffer;

  // Load the current music mode
  buffer = Buffer.allocUnsafe(GENERAL_SAVE_INFO_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, GENERAL_SAVE_INFO_SIZE);
  if (uiNumBytesRead != GENERAL_SAVE_INFO_SIZE) {
    FileClose(hFile);
    return false;
  }
  readGeneralSaveInfo(sGeneralInfo, buffer);

  gMusicModeToPlay = sGeneralInfo.ubMusicMode;

  guiCurrentUniqueSoldierId = sGeneralInfo.uiCurrentUniqueSoldierId;

  guiScreenToGotoAfterLoadingSavedGame = sGeneralInfo.uiCurrentScreen;

  //	gusSelectedSoldier = NOBODY;
  gusSelectedSoldier = sGeneralInfo.usSelectedSoldier;

  gsRenderCenterX = sGeneralInfo.sRenderCenterX;
  gsRenderCenterY = sGeneralInfo.sRenderCenterY;

  gfAtLeastOneMercWasHired = sGeneralInfo.fAtLeastOneMercWasHired;

  gfHavePurchasedItemsFromTony = sGeneralInfo.fHavePurchasedItemsFromTony;

  fShowItemsFlag = sGeneralInfo.fShowItemsFlag;
  fShowTownFlag = sGeneralInfo.fShowTownFlag;
  fShowMineFlag = sGeneralInfo.fShowMineFlag;
  fShowAircraftFlag = sGeneralInfo.fShowAircraftFlag;
  fShowTeamFlag = sGeneralInfo.fShowTeamFlag;

  fHelicopterAvailable = sGeneralInfo.fHelicopterAvailable;

  // helicopter vehicle id
  iHelicopterVehicleId = sGeneralInfo.iHelicopterVehicleId;

  // total distance travelled
  //	iTotalHeliDistanceSinceRefuel = sGeneralInfo.iTotalHeliDistanceSinceRefuel;

  // total owed to player
  iTotalAccumulatedCostByPlayer = sGeneralInfo.iTotalAccumulatedCostByPlayer;

  // whether or not skyrider is alive and well? and on our side yet?
  fSkyRiderAvailable = sGeneralInfo.fSkyRiderAvailable;

  // is the heli in the air?
  fHelicopterIsAirBorne = sGeneralInfo.fHelicopterIsAirBorne;

  // is the pilot returning straight to base?
  fHeliReturnStraightToBase = sGeneralInfo.fHeliReturnStraightToBase;

  // heli hovering
  fHoveringHelicopter = sGeneralInfo.fHoveringHelicopter;

  // time started hovering
  uiStartHoverTime = sGeneralInfo.uiStartHoverTime;

  // what state is skyrider's dialogue in in?
  guiHelicopterSkyriderTalkState = sGeneralInfo.uiHelicopterSkyriderTalkState;

  // the flags for skyrider events
  fShowEstoniRefuelHighLight = sGeneralInfo.fShowEstoniRefuelHighLight;
  fShowOtherSAMHighLight = sGeneralInfo.fShowOtherSAMHighLight;
  fShowDrassenSAMHighLight = sGeneralInfo.fShowDrassenSAMHighLight;
  fShowCambriaHospitalHighLight = sGeneralInfo.fShowCambriaHospitalHighLight;

  // The current state of the weather
  guiEnvWeather = sGeneralInfo.uiEnvWeather;

  gubDefaultButton = sGeneralInfo.ubDefaultButton;

  gfSkyriderEmptyHelpGiven = sGeneralInfo.fSkyriderEmptyHelpGiven;
  gubHelicopterHitsTaken = sGeneralInfo.ubHelicopterHitsTaken;
  gfSkyriderSaidCongratsOnTakingSAM = sGeneralInfo.fSkyriderSaidCongratsOnTakingSAM;
  gubPlayerProgressSkyriderLastCommentedOn = sGeneralInfo.ubPlayerProgressSkyriderLastCommentedOn;

  fEnterMapDueToContract = sGeneralInfo.fEnterMapDueToContract;
  ubQuitType = sGeneralInfo.ubQuitType;

  // if the soldier id is valid
  if (sGeneralInfo.sContractRehireSoldierID == -1)
    pContractReHireSoldier = null;
  else
    pContractReHireSoldier = Menptr[sGeneralInfo.sContractRehireSoldierID];

  copyGameOptions(gGameOptions, sGeneralInfo.GameOptions);

  // Restore the JA2 Clock
  guiBaseJA2Clock = sGeneralInfo.uiBaseJA2Clock;

  // whenever guiBaseJA2Clock changes, we must reset all the timer variables that use it as a reference
  ResetJA2ClockGlobalTimers();

  // Restore the selected merc
  if (sGeneralInfo.ubSMCurrentMercID == 255)
    gpSMCurrentMerc = <SOLDIERTYPE><unknown>null;
  else
    gpSMCurrentMerc = Menptr[sGeneralInfo.ubSMCurrentMercID];

  // Set the interface panel to the team panel
  ShutdownCurrentPanel();

  // Restore the current tactical panel mode
  gsCurInterfacePanel = sGeneralInfo.sCurInterfacePanel;

  /*
  //moved to last stage in the LoadSaveGame() function
  //if we are in tactical
  if( guiScreenToGotoAfterLoadingSavedGame == GAME_SCREEN )
  {
          //Initialize the current panel
          InitializeCurrentPanel( );

          SelectSoldier( gusSelectedSoldier, FALSE, TRUE );
  }
  */

  // Restore the fact that it is the first time in mapscreen
  fFirstTimeInMapScreen = sGeneralInfo.fFirstTimeInMapScreen;

  // Load map screen disabling buttons
  fDisableDueToBattleRoster = sGeneralInfo.fDisableDueToBattleRoster;
  fDisableMapInterfaceDueToBattle = sGeneralInfo.fDisableMapInterfaceDueToBattle;

  copyArray(gsBoxerGridNo, sGeneralInfo.sBoxerGridNo);
  copyArray(gubBoxerID, sGeneralInfo.ubBoxerID);
  copyArray(gfBoxerFought, sGeneralInfo.fBoxerFought);

  // Load the helicopter status
  fHelicopterDestroyed = sGeneralInfo.fHelicopterDestroyed;
  fShowMapScreenHelpText = sGeneralInfo.fShowMapScreenHelpText;

  giSortStateForMapScreenList = sGeneralInfo.iSortStateForMapScreenList;
  fFoundTixa = sGeneralInfo.fFoundTixa;

  guiTimeOfLastSkyriderMonologue = sGeneralInfo.uiTimeOfLastSkyriderMonologue;
  fSkyRiderSetUp = sGeneralInfo.fSkyRiderSetUp;

  copyArray(fRefuelingSiteAvailable, sGeneralInfo.fRefuelingSiteAvailable);

  // Meanwhile stuff
  copyMeanwhileDefinition(gCurrentMeanwhileDef, sGeneralInfo.gCurrentMeanwhileDef);
  //	gfMeanwhileScheduled = sGeneralInfo.gfMeanwhileScheduled;
  gfMeanwhileTryingToStart = sGeneralInfo.gfMeanwhileTryingToStart;
  gfInMeanwhile = sGeneralInfo.gfInMeanwhile;

  // list of dead guys for squads...in id values -> -1 means no one home
  for (let i = 0; i < Enum275.NUMBER_OF_SQUADS; i++) {
    copyArray(sDeadMercs[i], sGeneralInfo.sDeadMercs[i]);
  }

  // level of public noises
  copyArray(gbPublicNoiseLevel, sGeneralInfo.gbPublicNoiseLevel);

  // the screen count for the init screen
  gubScreenCount = sGeneralInfo.gubScreenCount;

  // used for the mean while screen
  if (guiSaveGameVersion < 71) {
    uiMeanWhileFlags = sGeneralInfo.usOldMeanWhileFlags;
  } else {
    uiMeanWhileFlags = sGeneralInfo.uiMeanWhileFlags;
  }

  // Imp portrait number
  iPortraitNumber = sGeneralInfo.iPortraitNumber;

  // location of first enocunter with enemy
  sWorldSectorLocationOfFirstBattle = sGeneralInfo.sWorldSectorLocationOfFirstBattle;

  fShowMilitia = sGeneralInfo.fShowMilitia;

  fNewFilesInFileViewer = sGeneralInfo.fNewFilesInFileViewer;

  gfLastBoxingMatchWonByPlayer = sGeneralInfo.fLastBoxingMatchWonByPlayer;

  copyArray(fSamSiteFound, sGeneralInfo.fSamSiteFound);

  gubNumTerrorists = sGeneralInfo.ubNumTerrorists;
  gubCambriaMedicalObjects = sGeneralInfo.ubCambriaMedicalObjects;

  gfDisableTacticalPanelButtons = sGeneralInfo.fDisableTacticalPanelButtons;

  sSelMapX = sGeneralInfo.sSelMapX;
  sSelMapY = sGeneralInfo.sSelMapY;
  iCurrentMapSectorZ = sGeneralInfo.iCurrentMapSectorZ;

  // State of email flags
  fUnReadMailFlag = sGeneralInfo.fUnReadMailFlag;
  fNewMailFlag = sGeneralInfo.fNewMailFlag;
  fOldUnreadFlag = sGeneralInfo.fOldUnReadFlag;
  fOldNewMailFlag = sGeneralInfo.fOldNewMailFlag;

  // Save the current status of the help screens flag that say wether or not the user has been there before
  gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen = sGeneralInfo.usHasPlayerSeenHelpScreenInCurrentScreen;

  gubBoxingMatchesWon = sGeneralInfo.ubBoxingMatchesWon;
  gubBoxersRests = sGeneralInfo.ubBoxersRests;
  gfBoxersResting = sGeneralInfo.fBoxersResting;

  gubDesertTemperature = sGeneralInfo.ubDesertTemperature;
  gubGlobalTemperature = sGeneralInfo.ubGlobalTemperature;

  gsMercArriveSectorX = sGeneralInfo.sMercArriveSectorX;
  gsMercArriveSectorY = sGeneralInfo.sMercArriveSectorY;

  gfCreatureMeanwhileScenePlayed = sGeneralInfo.fCreatureMeanwhileScenePlayed;

  // load the global player num
  gbPlayerNum = sGeneralInfo.ubPlayerNum;

  // New stuff for the Prebattle interface / autoresolve
  gfPersistantPBI = sGeneralInfo.fPersistantPBI;
  gubEnemyEncounterCode = sGeneralInfo.ubEnemyEncounterCode;
  gubExplicitEnemyEncounterCode = sGeneralInfo.ubExplicitEnemyEncounterCode;
  gfBlitBattleSectorLocator = sGeneralInfo.fBlitBattleSectorLocator;
  gubPBSectorX = sGeneralInfo.ubPBSectorX;
  gubPBSectorY = sGeneralInfo.ubPBSectorY;
  gubPBSectorZ = sGeneralInfo.ubPBSectorZ;
  gfCantRetreatInPBI = sGeneralInfo.fCantRetreatInPBI;
  gfExplosionQueueActive = sGeneralInfo.fExplosionQueueActive;

  bSelectedInfoChar = sGeneralInfo.bSelectedInfoChar;

  giHospitalTempBalance = sGeneralInfo.iHospitalTempBalance;
  giHospitalRefund = sGeneralInfo.iHospitalRefund;
  gbHospitalPriceModifier = sGeneralInfo.bHospitalPriceModifier;
  gfPlayerTeamSawJoey = sGeneralInfo.fPlayerTeamSawJoey;
  gfMikeShouldSayHi = sGeneralInfo.fMikeShouldSayHi;

  return true;
}

function SavePreRandomNumbersToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // Save the Prerandom number index
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(guiPreRandomIndex, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  // Save the Prerandom number index
  buffer = Buffer.allocUnsafe(4 * MAX_PREGENERATED_NUMS);
  writeUIntArray(guiPreRandomNums, buffer, 0, 4);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4 * MAX_PREGENERATED_NUMS);
  if (uiNumBytesWritten != 4 * MAX_PREGENERATED_NUMS) {
    return false;
  }

  return true;
}

function LoadPreRandomNumbersFromSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // Load the Prerandom number index
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }
  guiPreRandomIndex = buffer.readUInt32LE(0);

  // Load the Prerandom number index
  buffer = Buffer.allocUnsafe(4 * MAX_PREGENERATED_NUMS);
  uiNumBytesRead = FileRead(hFile, buffer, 4 * MAX_PREGENERATED_NUMS);
  if (uiNumBytesRead != 4 * MAX_PREGENERATED_NUMS) {
    return false;
  }
  readUIntArray(guiPreRandomNums, buffer, 0, 4);

  return true;
}

function LoadMeanwhileDefsFromSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  if (guiSaveGameVersion < 72) {
    // Load the array of meanwhile defs
    buffer = Buffer.allocUnsafe(MEANWHILE_DEFINITION_SIZE * (Enum160.NUM_MEANWHILES - 1));
    uiNumBytesRead = FileRead(hFile, buffer, MEANWHILE_DEFINITION_SIZE * (Enum160.NUM_MEANWHILES - 1));
    if (uiNumBytesRead != MEANWHILE_DEFINITION_SIZE * (Enum160.NUM_MEANWHILES - 1)) {
      return false;
    }

    for (let i = 0, offset = 0; i < Enum160.NUM_MEANWHILES - 1; i++) {
      readMeanwhileDefinition(gMeanwhileDef[i], buffer, offset);
    }

    // and set the last one
    resetMeanwhileDefinition(gMeanwhileDef[Enum160.NUM_MEANWHILES - 1]);
  } else {
    // Load the array of meanwhile defs
    buffer = Buffer.allocUnsafe(MEANWHILE_DEFINITION_SIZE * Enum160.NUM_MEANWHILES);
    uiNumBytesRead = FileRead(hFile, buffer, MEANWHILE_DEFINITION_SIZE * Enum160.NUM_MEANWHILES);
    if (uiNumBytesRead != MEANWHILE_DEFINITION_SIZE * Enum160.NUM_MEANWHILES) {
      return false;
    }

    readObjectArray(gMeanwhileDef, buffer, 0, readMeanwhileDefinition);
  }

  return true;
}

function SaveMeanwhileDefsFromSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // Save the array of meanwhile defs
  buffer = Buffer.allocUnsafe(MEANWHILE_DEFINITION_SIZE * Enum160.NUM_MEANWHILES);
  writeObjectArray(gMeanwhileDef, buffer, 0, writeMeanwhileDefinition);

  uiNumBytesWritten = FileWrite(hFile, buffer, MEANWHILE_DEFINITION_SIZE * Enum160.NUM_MEANWHILES);
  if (uiNumBytesWritten != MEANWHILE_DEFINITION_SIZE * Enum160.NUM_MEANWHILES) {
    return false;
  }

  return true;
}

export function DoesUserHaveEnoughHardDriveSpace(): boolean {
  let uiBytesFree: UINT32 = 0;

  uiBytesFree = GetFreeSpaceOnHardDriveWhereGameIsRunningFrom();

  // check to see if there is enough hard drive space
  if (uiBytesFree < REQUIRED_FREE_SPACE) {
    return false;
  }

  return true;
}

export function GetBestPossibleSectorXYZValues(psSectorX: Pointer<INT16>, psSectorY: Pointer<INT16>, pbSectorZ: Pointer<INT8>): void {
  // if the current sector is valid
  if (gfWorldLoaded) {
    psSectorX.value = gWorldSectorX;
    psSectorY.value = gWorldSectorY;
    pbSectorZ.value = gbWorldSectorZ;
  } else if (iCurrentTacticalSquad != NO_CURRENT_SQUAD && Squad[iCurrentTacticalSquad][0]) {
    if (Squad[iCurrentTacticalSquad][0].bAssignment != Enum117.IN_TRANSIT) {
      psSectorX.value = Squad[iCurrentTacticalSquad][0].sSectorX;
      psSectorY.value = Squad[iCurrentTacticalSquad][0].sSectorY;
      pbSectorZ.value = Squad[iCurrentTacticalSquad][0].bSectorZ;
    }
  } else {
    let sSoldierCnt: INT16;
    let pSoldier: SOLDIERTYPE;
    let bLastTeamID: INT16;
    let bCount: INT8 = 0;
    let fFoundAMerc: boolean = false;

    // Set locator to first merc
    sSoldierCnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

    // loop through all the mercs on the players team to find the one that is not moving
    for (pSoldier = MercPtrs[sSoldierCnt]; sSoldierCnt <= bLastTeamID; sSoldierCnt++, pSoldier = MercPtrs[sSoldierCnt]) {
      if (pSoldier.bActive) {
        if (pSoldier.bAssignment != Enum117.IN_TRANSIT && !pSoldier.fBetweenSectors) {
          // we found an alive, merc that is not moving
          psSectorX.value = pSoldier.sSectorX;
          psSectorY.value = pSoldier.sSectorY;
          pbSectorZ.value = pSoldier.bSectorZ;
          fFoundAMerc = true;
          break;
        }
      }
    }

    // if we didnt find a merc
    if (!fFoundAMerc) {
      // Set locator to first merc
      sSoldierCnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
      bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

      // loop through all the mercs and find one that is moving
      for (pSoldier = MercPtrs[sSoldierCnt]; sSoldierCnt <= bLastTeamID; sSoldierCnt++, pSoldier = MercPtrs[sSoldierCnt]) {
        if (pSoldier.bActive) {
          // we found an alive, merc that is not moving
          psSectorX.value = pSoldier.sSectorX;
          psSectorY.value = pSoldier.sSectorY;
          pbSectorZ.value = pSoldier.bSectorZ;
          fFoundAMerc = true;
          break;
        }
      }

      // if we STILL havent found a merc, give up and use the -1, -1, -1
      if (!fFoundAMerc) {
        psSectorX.value = gWorldSectorX;
        psSectorY.value = gWorldSectorY;
        pbSectorZ.value = gbWorldSectorZ;
      }
    }
  }
}

function PauseBeforeSaveGame(): void {
  // if we are not in the save load screen
  if (guiCurrentScreen != Enum26.SAVE_LOAD_SCREEN) {
    // Pause the game
    PauseGame();
  }
}

function UnPauseAfterSaveGame(): void {
  // if we are not in the save load screen
  if (guiCurrentScreen != Enum26.SAVE_LOAD_SCREEN) {
    // UnPause time compression
    UnPauseGame();
  }
}

function TruncateStrategicGroupSizes(): void {
  let pGroup: GROUP | null;
  let pSector: SECTORINFO | null;
  let i: INT32;
  for (i = Enum123.SEC_A1; i < Enum123.SEC_P16; i++) {
    pSector = SectorInfo[i];
    if (pSector.ubNumAdmins + pSector.ubNumTroops + pSector.ubNumElites > MAX_STRATEGIC_TEAM_SIZE) {
      if (pSector.ubNumAdmins > pSector.ubNumTroops) {
        if (pSector.ubNumAdmins > pSector.ubNumElites) {
          pSector.ubNumAdmins = 20;
          pSector.ubNumTroops = 0;
          pSector.ubNumElites = 0;
        } else {
          pSector.ubNumAdmins = 0;
          pSector.ubNumTroops = 0;
          pSector.ubNumElites = 20;
        }
      } else if (pSector.ubNumTroops > pSector.ubNumElites) {
        if (pSector.ubNumTroops > pSector.ubNumAdmins) {
          pSector.ubNumAdmins = 0;
          pSector.ubNumTroops = 20;
          pSector.ubNumElites = 0;
        } else {
          pSector.ubNumAdmins = 20;
          pSector.ubNumTroops = 0;
          pSector.ubNumElites = 0;
        }
      } else {
        if (pSector.ubNumElites > pSector.ubNumTroops) {
          pSector.ubNumAdmins = 0;
          pSector.ubNumTroops = 0;
          pSector.ubNumElites = 20;
        } else {
          pSector.ubNumAdmins = 0;
          pSector.ubNumTroops = 20;
          pSector.ubNumElites = 0;
        }
      }
    }
    // militia
    if (pSector.ubNumberOfCivsAtLevel[0] + pSector.ubNumberOfCivsAtLevel[1] + pSector.ubNumberOfCivsAtLevel[2] > MAX_STRATEGIC_TEAM_SIZE) {
      if (pSector.ubNumberOfCivsAtLevel[0] > pSector.ubNumberOfCivsAtLevel[1]) {
        if (pSector.ubNumberOfCivsAtLevel[0] > pSector.ubNumberOfCivsAtLevel[2]) {
          pSector.ubNumberOfCivsAtLevel[0] = 20;
          pSector.ubNumberOfCivsAtLevel[1] = 0;
          pSector.ubNumberOfCivsAtLevel[2] = 0;
        } else {
          pSector.ubNumberOfCivsAtLevel[0] = 0;
          pSector.ubNumberOfCivsAtLevel[1] = 0;
          pSector.ubNumberOfCivsAtLevel[2] = 20;
        }
      } else if (pSector.ubNumberOfCivsAtLevel[1] > pSector.ubNumberOfCivsAtLevel[2]) {
        if (pSector.ubNumberOfCivsAtLevel[1] > pSector.ubNumberOfCivsAtLevel[0]) {
          pSector.ubNumberOfCivsAtLevel[0] = 0;
          pSector.ubNumberOfCivsAtLevel[1] = 20;
          pSector.ubNumberOfCivsAtLevel[2] = 0;
        } else {
          pSector.ubNumberOfCivsAtLevel[0] = 20;
          pSector.ubNumberOfCivsAtLevel[1] = 0;
          pSector.ubNumberOfCivsAtLevel[2] = 0;
        }
      } else {
        if (pSector.ubNumberOfCivsAtLevel[2] > pSector.ubNumberOfCivsAtLevel[1]) {
          pSector.ubNumberOfCivsAtLevel[0] = 0;
          pSector.ubNumberOfCivsAtLevel[1] = 0;
          pSector.ubNumberOfCivsAtLevel[2] = 20;
        } else {
          pSector.ubNumberOfCivsAtLevel[0] = 0;
          pSector.ubNumberOfCivsAtLevel[1] = 20;
          pSector.ubNumberOfCivsAtLevel[2] = 0;
        }
      }
    }
  }
  // Enemy groups
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.fPlayer) {
      Assert(pGroup.pEnemyGroup);
      if (pGroup.pEnemyGroup.ubNumAdmins + pGroup.pEnemyGroup.ubNumTroops + pGroup.pEnemyGroup.ubNumElites > MAX_STRATEGIC_TEAM_SIZE) {
        pGroup.ubGroupSize = 20;
        if (pGroup.pEnemyGroup.ubNumAdmins > pGroup.pEnemyGroup.ubNumTroops) {
          if (pGroup.pEnemyGroup.ubNumAdmins > pGroup.pEnemyGroup.ubNumElites) {
            pGroup.pEnemyGroup.ubNumAdmins = 20;
            pGroup.pEnemyGroup.ubNumTroops = 0;
            pGroup.pEnemyGroup.ubNumElites = 0;
          } else {
            pGroup.pEnemyGroup.ubNumAdmins = 0;
            pGroup.pEnemyGroup.ubNumTroops = 0;
            pGroup.pEnemyGroup.ubNumElites = 20;
          }
        } else if (pGroup.pEnemyGroup.ubNumTroops > pGroup.pEnemyGroup.ubNumElites) {
          if (pGroup.pEnemyGroup.ubNumTroops > pGroup.pEnemyGroup.ubNumAdmins) {
            pGroup.pEnemyGroup.ubNumAdmins = 0;
            pGroup.pEnemyGroup.ubNumTroops = 20;
            pGroup.pEnemyGroup.ubNumElites = 0;
          } else {
            pGroup.pEnemyGroup.ubNumAdmins = 20;
            pGroup.pEnemyGroup.ubNumTroops = 0;
            pGroup.pEnemyGroup.ubNumElites = 0;
          }
        } else {
          if (pGroup.pEnemyGroup.ubNumElites > pGroup.pEnemyGroup.ubNumTroops) {
            pGroup.pEnemyGroup.ubNumAdmins = 0;
            pGroup.pEnemyGroup.ubNumTroops = 0;
            pGroup.pEnemyGroup.ubNumElites = 20;
          } else {
            pGroup.pEnemyGroup.ubNumAdmins = 0;
            pGroup.pEnemyGroup.ubNumTroops = 20;
            pGroup.pEnemyGroup.ubNumElites = 0;
          }
        }
      }
    }
    pGroup = pGroup.next;
  }
}

function UpdateMercMercContractInfo(): void {
  let ubCnt: UINT8;
  let pSoldier: SOLDIERTYPE | null;

  for (ubCnt = Enum268.BIFF; ubCnt <= Enum268.BUBBA; ubCnt++) {
    pSoldier = FindSoldierByProfileID(ubCnt, true);

    // if the merc is on the team
    if (pSoldier == null)
      continue;

    gMercProfiles[ubCnt].iMercMercContractLength = pSoldier.iTotalContractLength;

    pSoldier.iTotalContractLength = 0;
  }
}

export function GetNumberForAutoSave(fLatestAutoSave: boolean): INT8 {
  let zFileName1: string /* CHAR[256] */;
  let zFileName2: string /* CHAR[256] */;
  let hFile: HWFILE;
  let fFile1Exist: boolean;
  let fFile2Exist: boolean;
  let CreationTime1: SGP_FILETIME;
  let LastAccessedTime1: SGP_FILETIME;
  let LastWriteTime1: SGP_FILETIME;
  let CreationTime2: SGP_FILETIME;
  let LastAccessedTime2: SGP_FILETIME;
  let LastWriteTime2: SGP_FILETIME;

  fFile1Exist = false;
  fFile2Exist = false;

  // The name of the file
  zFileName1 = sprintf("%S\\Auto%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], 0, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);
  zFileName2 = sprintf("%S\\Auto%02d.%S", pMessageStrings[Enum333.MSG_SAVEDIRECTORY], 1, pMessageStrings[Enum333.MSG_SAVEEXTENSION]);

  if (FileExists(zFileName1)) {
    hFile = FileOpen(zFileName1, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);

    GetFileManFileTime(hFile, addressof(CreationTime1), addressof(LastAccessedTime1), addressof(LastWriteTime1));

    FileClose(hFile);

    fFile1Exist = true;
  }

  if (FileExists(zFileName2)) {
    hFile = FileOpen(zFileName2, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);

    GetFileManFileTime(hFile, addressof(CreationTime2), addressof(LastAccessedTime2), addressof(LastWriteTime2));

    FileClose(hFile);

    fFile2Exist = true;
  }

  if (!fFile1Exist && !fFile2Exist)
    return -1;
  else if (fFile1Exist && !fFile2Exist) {
    if (fLatestAutoSave)
      return 0;
    else
      return -1;
  } else if (!fFile1Exist && fFile2Exist) {
    if (fLatestAutoSave)
      return 1;
    else
      return -1;
  } else {
    if (CompareSGPFileTimes(addressof(LastWriteTime1), addressof(LastWriteTime2)) > 0)
      return 0;
    else
      return 1;
  }
}

function HandleOldBobbyRMailOrders(): void {
  let iCnt: INT32;
  let iNewListCnt: INT32 = 0;

  if (LaptopSaveInfo.usNumberOfBobbyRayOrderUsed != 0) {
    // Allocate memory for the list
    gpNewBobbyrShipments = createArrayFrom(LaptopSaveInfo.usNumberOfBobbyRayOrderUsed, createNewBobbyRayOrderStruct);

    giNumberOfNewBobbyRShipment = LaptopSaveInfo.usNumberOfBobbyRayOrderUsed;

    // loop through and add the old items to the new list
    for (iCnt = 0; iCnt < LaptopSaveInfo.usNumberOfBobbyRayOrderItems; iCnt++) {
      // if this slot is used
      if (LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[iCnt].fActive) {
        // copy over the purchase info
        copyObjectArray(gpNewBobbyrShipments[iNewListCnt].BobbyRayPurchase, LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[iCnt].BobbyRayPurchase, copyBobbyRayPurchaseStruct);

        gpNewBobbyrShipments[iNewListCnt].fActive = true;
        gpNewBobbyrShipments[iNewListCnt].ubDeliveryLoc = Enum70.BR_DRASSEN;
        gpNewBobbyrShipments[iNewListCnt].ubDeliveryMethod = 0;
        gpNewBobbyrShipments[iNewListCnt].ubNumberPurchases = LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[iCnt].ubNumberPurchases;
        gpNewBobbyrShipments[iNewListCnt].uiPackageWeight = 1;
        gpNewBobbyrShipments[iNewListCnt].uiOrderedOnDayNum = GetWorldDay();
        gpNewBobbyrShipments[iNewListCnt].fDisplayedInShipmentPage = true;

        iNewListCnt++;
      }
    }

    // Clear out the old list
    LaptopSaveInfo.usNumberOfBobbyRayOrderUsed = 0;
    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = <BobbyRayOrderStruct[]><unknown>null;
  }
}

function CalcJA2EncryptionSet(pSaveGameHeader: SAVED_GAME_HEADER): UINT32 {
  let uiEncryptionSet: UINT32 = 0;

  uiEncryptionSet = pSaveGameHeader.uiSavedGameVersion;
  uiEncryptionSet *= pSaveGameHeader.uiFlags;
  uiEncryptionSet += pSaveGameHeader.iCurrentBalance;
  uiEncryptionSet *= (pSaveGameHeader.ubNumOfMercsOnPlayersTeam + 1);
  uiEncryptionSet += pSaveGameHeader.bSectorZ * 3;
  uiEncryptionSet += pSaveGameHeader.ubLoadScreenID;

  if (pSaveGameHeader.fAlternateSector) {
    uiEncryptionSet += 7;
  }

  if (pSaveGameHeader.uiRandom % 2 == 0) {
    uiEncryptionSet++;

    if (pSaveGameHeader.uiRandom % 7 == 0) {
      uiEncryptionSet++;
      if (pSaveGameHeader.uiRandom % 23 == 0) {
        uiEncryptionSet++;
      }
      if (pSaveGameHeader.uiRandom % 79 == 0) {
        uiEncryptionSet += 2;
      }
    }
  }

// FIXME: Language-specific code
// #ifdef GERMAN
//   uiEncryptionSet *= 11;
// #endif

  uiEncryptionSet = uiEncryptionSet % 10;

  uiEncryptionSet += pSaveGameHeader.uiDay / 10;

  uiEncryptionSet = uiEncryptionSet % 19;

  // now pick a different set of #s depending on what game options we've chosen
  if (pSaveGameHeader.sInitialGameOptions.fGunNut) {
    uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS * 6;
  }

  if (pSaveGameHeader.sInitialGameOptions.fSciFi) {
    uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS * 3;
  }

  switch (pSaveGameHeader.sInitialGameOptions.ubDifficultyLevel) {
    case Enum9.DIF_LEVEL_EASY:
      uiEncryptionSet += 0;
      break;
    case Enum9.DIF_LEVEL_MEDIUM:
      uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS;
      break;
    case Enum9.DIF_LEVEL_HARD:
      uiEncryptionSet += BASE_NUMBER_OF_ROTATION_ARRAYS * 2;
      break;
  }

  return uiEncryptionSet;
}

}
