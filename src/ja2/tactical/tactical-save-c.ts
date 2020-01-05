namespace ja2 {

const path: typeof import('path') = require('path');

let gfWasInMeanwhile: boolean = false;

///////////////////////////////////////////////////////////////
//
// Global Defines
//
///////////////////////////////////////////////////////////////

// This struct is used to save info from the NPCQuoteInfo struct that can change.
interface TempNPCQuoteInfoSave {
  usFlags: UINT16;

  /* union { */
  sRequiredItem: INT16; // item NPC must have to say quote
  sRequiredGridno: INT16; // location for NPC req'd to say quote
  /* } */
  usGoToGridno: UINT16;
}

class _TempNPCQuoteInfoSave implements TempNPCQuoteInfoSave {
  public usFlags: UINT16;
  public sRequiredItem: INT16;
  public usGoToGridno: UINT16;

  constructor() {
    this.usFlags = 0;
    this.sRequiredItem = 0;
    this.usGoToGridno = 0;
  }

  get sRequiredGridno() {
    return this.sRequiredItem;
  }

  set sRequiredGridno(value) {
    this.sRequiredItem = value;
  }
}

function createTempNPCQuoteInfoSave(): TempNPCQuoteInfoSave {
  return new _TempNPCQuoteInfoSave();
}

function resetTempNPCQuoteInfoSave(o: TempNPCQuoteInfoSave) {
  o.usFlags = 0;
  o.sRequiredItem = 0;
  o.usGoToGridno = 0;
}

const TEMP_NPC_QUOTE_INFO_SAVE_SIZE = 6;

function readTempNPCQuoteInfoSave(o: TempNPCQuoteInfoSave, buffer: Buffer, offset: number = 0): number {
  o.usFlags = buffer.readUInt16LE(offset); offset += 2;
  o.sRequiredItem = buffer.readUInt16LE(offset); offset += 2;
  o.usGoToGridno = buffer.readUInt16LE(offset); offset += 2;
  return offset;
}

function writeTempNPCQuoteInfoSave(o: TempNPCQuoteInfoSave, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.usFlags, offset);
  offset = buffer.writeUInt16LE(o.sRequiredItem, offset);
  offset = buffer.writeUInt16LE(o.usGoToGridno, offset);
  return offset;
}

const NPC_TEMP_QUOTE_FILE = path.join('Temp', 'NpcQuote.tmp');

///////////////////////////////////////////////////////////////
//
// Global Variables
//
///////////////////////////////////////////////////////////////

let giErrorMessageBox: INT32 = 0;

///////////////////////////////////////////////////////////////
//
// Function Prototypes
//
///////////////////////////////////////////////////////////////

// ppp

///////////////////////////////////////////////////////////////
//
// Functions
//
///////////////////////////////////////////////////////////////

// SaveMapTempFilesToSavedGameFile() Looks for and opens all Map Modification files.  It add each mod file to the save game file.
export function SaveMapTempFilesToSavedGameFile(hFile: HWFILE): boolean {
  let TempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;
  let sMapX: INT16;
  let sMapY: INT16;

  // Save the current sectors open temp files to the disk
  //	SaveCurrentSectorsItemsToTempItemFile();

  //
  // Loop though all the array elements to see if there is a data file to be saved
  //

  // First look through the above ground sectors
  for (sMapY = 1; sMapY <= 16; sMapY++) {
    for (sMapX = 1; sMapX <= 16; sMapX++) {
      // Save the Temp Item Files to the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ITEM_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_ITEM_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // Save the Rotting Corpse Temp file to the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ROTTING_CORPSE_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // Save the Map Modifications Temp file to the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // Save the Door Table temp file to the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_DOOR_TABLE_TEMP_FILES_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_DOOR_TABLE_TEMP_FILES_EXISTS, sMapX, sMapY, 0);
      }

      // Save the revealed status temp file to the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_REVEALED_STATUS_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_REVEALED_STATUS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // Save the door status temp file to the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_DOOR_STATUS_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_DOOR_STATUS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_CIV_PRESERVED_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_CIV_PRESERVED_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS) {
        AddTempFileToSavedGame(hFile, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // if any other file is to be saved
    }
  }

  // then look throught all the underground sectors
  while (TempNode) {
    if (TempNode.uiFlags & SF_ITEM_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_ITEM_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_ROTTING_CORPSE_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // Save the Map Modifications Temp file to the saved game file
    if (TempNode.uiFlags & SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // Save the door table to the saved game file
    if (TempNode.uiFlags & SF_DOOR_TABLE_TEMP_FILES_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_DOOR_TABLE_TEMP_FILES_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // Save the revealed status temp file to the saved game file
    if (TempNode.uiFlags & SF_REVEALED_STATUS_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_REVEALED_STATUS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // Save the door status temp file to the saved game file
    if (TempNode.uiFlags & SF_DOOR_STATUS_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_DOOR_STATUS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_CIV_PRESERVED_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_CIV_PRESERVED_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS) {
      AddTempFileToSavedGame(hFile, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // ttt

    TempNode = TempNode.next;
  }

  return true;
}

// LoadMapTempFilesFromSavedGameFile() loads all the temp files from the saved game file and writes them into the temp directory
export function LoadMapTempFilesFromSavedGameFile(hFile: HWFILE): boolean {
  let TempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;
  let sMapX: INT16;
  let sMapY: INT16;
  let uiPercentage: UINT32;
  let iCounter: UINT32 = 0;

  // HACK FOR GABBY
  if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME) && guiSaveGameVersion < 81) {
    if (gMercProfiles[Enum268.GABBY].bMercStatus != MERC_IS_DEAD) {
      // turn off alternate flags for the sectors he could be in
      // randomly place him in one of the two possible sectors
      SectorInfo[SECTOR(14, MAP_ROW_L)].uiFlags &= ~SF_USE_ALTERNATE_MAP;
      SectorInfo[SECTOR(8, MAP_ROW_L)].uiFlags &= ~SF_USE_ALTERNATE_MAP;

      if (Random(2)) {
        SectorInfo[SECTOR(11, MAP_ROW_H)].uiFlags |= SF_USE_ALTERNATE_MAP;
        gMercProfiles[Enum268.GABBY].sSectorX = 11;
        gMercProfiles[Enum268.GABBY].sSectorY = MAP_ROW_H;
      } else {
        SectorInfo[SECTOR(4, MAP_ROW_I)].uiFlags |= SF_USE_ALTERNATE_MAP;
        gMercProfiles[Enum268.GABBY].sSectorX = 4;
        gMercProfiles[Enum268.GABBY].sSectorY = MAP_ROW_I;
      }
    }
  }

  //
  // Loop though all the array elements to see if there is a data file to be loaded
  //

  // First look through the above ground sectors
  for (sMapY = 1; sMapY <= 16; sMapY++) {
    for (sMapX = 1; sMapX <= 16; sMapX++) {
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ITEM_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_ITEM_TEMP_FILE_EXISTS, sMapX, sMapY, 0);

        // sync up the temp file data to the sector structure data
        SynchronizeItemTempFileVisbleItemsToSectorInfoVisbleItems(sMapX, sMapY, 0, true);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ROTTING_CORPSE_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_DOOR_TABLE_TEMP_FILES_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_DOOR_TABLE_TEMP_FILES_EXISTS, sMapX, sMapY, 0);
      }

      // Get the revealed status temp file From the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_REVEALED_STATUS_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_REVEALED_STATUS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // Get the revealed status temp file From the saved game file
      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_DOOR_STATUS_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_DOOR_STATUS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_CIV_PRESERVED_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_CIV_PRESERVED_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
        if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME) && guiSaveGameVersion < 78) {
          let pMapName: string /* INT8[128] */;

          // KILL IT!!! KILL KIT!!!! IT IS CORRUPTED!!!
          pMapName = GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
          FileDelete(pMapName);

          // turn off the flag
          SectorInfo[SECTOR(sMapX, sMapY)].uiFlags &= (~SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
        }
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS) {
        RetrieveTempFileFromSavedGame(hFile, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, sMapX, sMapY, 0);
      }

      // if any other file is to be saved

      iCounter++;

      // update the progress bar
      uiPercentage = Math.trunc((iCounter * 100) / (255));

      RenderProgressBar(0, uiPercentage);
    }
  }

  // then look throught all the underground sectors
  while (TempNode) {
    if (TempNode.uiFlags & SF_ITEM_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_ITEM_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);

      // sync up the temp file data to the sector structure data
      SynchronizeItemTempFileVisbleItemsToSectorInfoVisbleItems(TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ, true);
    }

    if (TempNode.uiFlags & SF_ROTTING_CORPSE_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_DOOR_TABLE_TEMP_FILES_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_DOOR_TABLE_TEMP_FILES_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // Get the revealed status temp file From the saved game file
    if (TempNode.uiFlags & SF_REVEALED_STATUS_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_REVEALED_STATUS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    // Get the revealed status temp file From the saved game file
    if (TempNode.uiFlags & SF_DOOR_STATUS_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_DOOR_STATUS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_CIV_PRESERVED_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_CIV_PRESERVED_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
      if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME) && guiSaveGameVersion < 78) {
        let pMapName: string /* INT8[128] */;

        // KILL IT!!! KILL KIT!!!! IT IS CORRUPTED!!!
        pMapName = GetMapTempFileName(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
        FileDelete(pMapName);

        // turn off the flag
        TempNode.uiFlags &= (~SF_CIV_PRESERVED_TEMP_FILE_EXISTS);
      }
    }

    if (TempNode.uiFlags & SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    if (TempNode.uiFlags & SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS) {
      RetrieveTempFileFromSavedGame(hFile, SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, TempNode.ubSectorX, TempNode.ubSectorY, TempNode.ubSectorZ);
    }

    TempNode = TempNode.next;
  }
  // ttt
  return true;
}

export function SaveWorldItemsToTempItemFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8, uiNumberOfItems: UINT32, pData: WORLDITEM[] | null): boolean {
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  let zMapName: string /* CHAR8[128] */;
  let buffer: Buffer;

  zMapName = GetMapTempFileName(SF_ITEM_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Save the size of the ITem table
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumberOfItems, 0);

  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  // if there are items to save..
  if (uiNumberOfItems != 0) {
    Assert(pData);
    // Save the ITem array
    buffer = Buffer.allocUnsafe(uiNumberOfItems * WORLD_ITEM_SIZE);
    writeObjectArray(pData, buffer, 0, writeWorldItem);

    uiNumBytesWritten = FileWrite(hFile, buffer, uiNumberOfItems * WORLD_ITEM_SIZE);
    if (uiNumBytesWritten != uiNumberOfItems * WORLD_ITEM_SIZE) {
      // Error Writing size of array to disk
      FileClose(hFile);
      return false;
    }
  }

  FileClose(hFile);

  SetSectorFlag(sMapX, sMapY, bMapZ, SF_ITEM_TEMP_FILE_EXISTS);

  SynchronizeItemTempFileVisbleItemsToSectorInfoVisbleItems(sMapX, sMapY, bMapZ, false);

  return true;
}

export function LoadWorldItemsFromTempItemFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8, pData: WORLDITEM[]): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let hFile: HWFILE;
  let zMapName: string /* CHAR8[128] */;
  let uiNumberOfItems: UINT32 = 0;
  let buffer: Buffer;

  zMapName = GetMapTempFileName(SF_ITEM_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return true;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Load the size of the World ITem table
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  uiNumberOfItems = buffer.readUInt32LE(0);

  // Load the World ITem table
  buffer = Buffer.allocUnsafe(uiNumberOfItems * WORLD_ITEM_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, uiNumberOfItems * WORLD_ITEM_SIZE);
  if (uiNumBytesRead != uiNumberOfItems * WORLD_ITEM_SIZE) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  readObjectArray(pData, buffer, 0, readWorldItem);

  FileClose(hFile);

  return true;
}

export function GetNumberOfWorldItemsFromTempItemFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8, fIfEmptyCreate: boolean): UINT32 {
  let pSizeOfData: UINT32;

  let uiNumBytesRead: UINT32 = 0;
  let hFile: HWFILE;
  let zMapName: string /* CHAR8[128] */;
  let uiNumberOfItems: UINT32 = 0;
  let buffer: Buffer;

  zMapName = GetMapTempFileName(SF_ITEM_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Check if the file DOESNT exists
  if (!FileExistsNoDB(zMapName)) {
    if (fIfEmptyCreate) {
      let TempWorldItems: WORLDITEM[] /* [10] */ = createArrayFrom(10, createWorldItem);
      let uiNumberOfItems: UINT32 = 10;
      let uiNumBytesWritten: UINT32 = 0;

      // If the file doesnt exists, create a file that has an initial amount of Items
      hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
      if (hFile == 0) {
        // Error opening item modification file
        return -1;
      }

      // write the the number of item in the maps item file
      buffer = Buffer.allocUnsafe(4);
      buffer.writeUInt32LE(uiNumberOfItems, 0);

      uiNumBytesWritten = FileWrite(hFile, buffer, 4);
      if (uiNumBytesWritten != 4) {
        // Error Writing size of array to disk
        FileClose(hFile);
        return -1;
      }

      // write the the number of item in the maps item file
      buffer = Buffer.allocUnsafe(uiNumberOfItems * WORLD_ITEM_SIZE);
      writeObjectArray(TempWorldItems, buffer, 0, writeWorldItem);

      uiNumBytesWritten = FileWrite(hFile, buffer, uiNumberOfItems * WORLD_ITEM_SIZE);
      if (uiNumBytesWritten != uiNumberOfItems * WORLD_ITEM_SIZE) {
        // Error Writing size of array to disk
        FileClose(hFile);
        return -1;
      }

      // Close the file
      FileClose(hFile);
    } else {
      // the file doesnt exist
      pSizeOfData = 0;

      return pSizeOfData;
    }
  }

  // Open the file for reading, if it exists
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file
    return -1;
  }

  // Load the size of the World ITem table
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return -1;
  }

  uiNumberOfItems = buffer.readUInt32LE(0);

  pSizeOfData = uiNumberOfItems;

  FileClose(hFile);

  return pSizeOfData;
}

export function AddItemsToUnLoadedSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8, sGridNo: INT16, uiNumberOfItemsToAdd: UINT32, pObject: OBJECTTYPE[], ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8, bVisible: INT8, fReplaceEntireFile: boolean): boolean {
  let uiNumberOfItems: UINT32 = 0;
  let pWorldItems: WORLDITEM[] /* Pointer<WORLDITEM> */;
  let cnt: UINT32;
  let uiLoop1: UINT32 = 0;

  if ((uiNumberOfItems = GetNumberOfWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, true)) === -1) {
    // Errror getting the numbers of the items from the sector
    return false;
  }

  // Allocate memeory for the item
  pWorldItems = createArrayFrom(uiNumberOfItems, createWorldItem);

  // Load in the sectors Item Info
  if (!LoadWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, pWorldItems)) {
    // error reading in the items from the Item mod file
    return false;
  }

  // if we are to replace the entire file
  if (fReplaceEntireFile) {
    // first loop through and mark all entries that they dont exists
    for (cnt = 0; cnt < uiNumberOfItems; cnt++)
      pWorldItems[cnt].fExists = false;

    // Now delete the item temp file
    DeleteTempItemMapFile(sMapX, sMapY, bMapZ);
  }

  // loop through all the objects to add
  for (uiLoop1 = 0; uiLoop1 < uiNumberOfItemsToAdd; uiLoop1++) {
    // Loop through the array to see if there is a free spot to add an item to it
    for (cnt = 0; cnt < uiNumberOfItems; cnt++) {
      if (pWorldItems[cnt].fExists == false) {
        // We have found a free spot, break
        break;
      }
    }

    if (cnt == (uiNumberOfItems)) {
      // Error, there wasnt a free spot.  Reallocate memory for the array
      pWorldItems.push(createWorldItem());

      // Increment the total number of item in the array
      uiNumberOfItems++;

      // set the spot were the item is to be added
      cnt = uiNumberOfItems - 1;
    }

    pWorldItems[cnt].fExists = true;
    pWorldItems[cnt].sGridNo = sGridNo;
    pWorldItems[cnt].ubLevel = ubLevel;
    pWorldItems[cnt].usFlags = usFlags;
    pWorldItems[cnt].bVisible = bVisible;
    pWorldItems[cnt].bRenderZHeightAboveLevel = bRenderZHeightAboveLevel;

    // Check
    if (sGridNo == NOWHERE && !(pWorldItems[cnt].usFlags & WORLD_ITEM_GRIDNO_NOT_SET_USE_ENTRY_POINT)) {
      pWorldItems[cnt].usFlags |= WORLD_ITEM_GRIDNO_NOT_SET_USE_ENTRY_POINT;

      // Display warning.....
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Error: Trying to add item ( %d: %s ) to invalid gridno in unloaded sector. Please Report.", pWorldItems[cnt].o.usItem, ItemNames[pWorldItems[cnt].o.usItem]);
    }

    copyObjectType(pWorldItems[cnt].o, pObject[uiLoop1]);
  }

  // Save the Items to the the file
  SaveWorldItemsToTempItemFile(sMapX, sMapY, bMapZ, uiNumberOfItems, pWorldItems);

  return true;
}

export function SaveCurrentSectorsInformationToTempItemFile(): boolean {
  let fShouldBeInMeanwhile: boolean = false;
  if (gfWasInMeanwhile) {
    // Don't save a temp file for the meanwhile scene map.
    gfWasInMeanwhile = false;
    return true;
  } else if (AreInMeanwhile()) {
    gfInMeanwhile = false;
    fShouldBeInMeanwhile = true;
  }

  // If we havent been to tactical yet
  if ((gWorldSectorX == 0) && (gWorldSectorY == 0)) {
    return true;
  }

  // Save the Blood, smell and the revealed status for map elements
  SaveBloodSmellAndRevealedStatesFromMapToTempFile();

  // handle all reachable before save
  HandleAllReachAbleItemsInTheSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Save the Items to the the file
  if (!SaveWorldItemsToTempItemFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, guiNumWorldItems, gWorldItems)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveWorldItemsToTempItemFile()"));
    return false;
  }

  // Save the rotting corpse array to the temp rotting corpse file
  if (!SaveRottingCorpsesToTempCorpseFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveRottingCorpsesToTempCorpseFile()"));
    return false;
  }

  // save the Doortable array to the temp door map file
  if (!SaveDoorTableToDoorTableTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveDoorTableToDoorTableTempFile()"));
    return false;
  }

  // save the 'revealed'status of the tiles
  if (!SaveRevealedStatusArrayToRevealedTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveRevealedStatusArrayToRevealedTempFile()"));
    return false;
  }

  // save the door open status to the saved game file
  if (!SaveDoorStatusArrayToDoorStatusTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveDoorStatusArrayToDoorStatusTempFile()"));
    return false;
  }

  // Save the enemies to the temp file
  if (!NewWayOfSavingEnemyAndCivliansToTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, true, false)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in NewWayOfSavingEnemyAndCivliansToTempFile( Enemy, Creature Team )"));
    return false;
  }

  // Save the civilian info to the temp file
  if (!NewWayOfSavingEnemyAndCivliansToTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, false, false)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in NewWayOfSavingEnemyAndCivliansToTempFile( Civ Team )"));
    return false;
  }

  // Save the smoke effects info to the temp file
  if (!SaveSmokeEffectsToMapTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveSmokeEffectsToMapTempFile"));
    return false;
  }

  // Save the smoke effects info to the temp file
  if (!SaveLightEffectsToMapTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("SaveCurrentSectorsInformationToTempItemFile:  failed in SaveLightEffectsToMapTempFile"));
    return false;
  }

  // ttt

  // Save any other info here

  // Save certain information from the NPC's soldier structure to the Merc structure
  SaveNPCInformationToProfileStruct();

  // Save the time the player was last in the sector
  SetLastTimePlayerWasInSector();

  if (fShouldBeInMeanwhile) {
    gfInMeanwhile = true;
  }

  return true;
}

export function HandleAllReachAbleItemsInTheSector(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  // find out which items in the list are reachable
  let uiCounter: UINT32 = 0;
  let ubDir: UINT8;
  let ubMovementCost: UINT8;
  let fReachable: boolean = false;
  let sGridNo: INT16 = NOWHERE;
  let sGridNo2: INT16 = NOWHERE;
  let sNewLoc: INT16;

  let pSoldier: SOLDIERTYPE;
  let fSecondary: boolean = false;

  if (guiNumWorldItems == 0) {
    return;
  }

  if (gMapInformation.sCenterGridNo != -1) {
    sGridNo = gMapInformation.sCenterGridNo;
  } else if (gMapInformation.sNorthGridNo != -1) {
    // use any!
    sGridNo = gMapInformation.sNorthGridNo;
  } else if (gMapInformation.sEastGridNo != -1) {
    // use any!
    sGridNo = gMapInformation.sEastGridNo;
  } else if (gMapInformation.sSouthGridNo != -1) {
    // use any!
    sGridNo = gMapInformation.sSouthGridNo;
  } else if (gMapInformation.sWestGridNo != -1) {
    // use any!
    sGridNo = gMapInformation.sWestGridNo;
  } else {
    AssertMsg(false, FormatString("Map %s%d_b%d does not have any entry points!", String.fromCharCode('A'.charCodeAt(0) + gWorldSectorY - 1), gWorldSectorX, gbWorldSectorZ));
    return;
  }

  if (gMapInformation.sIsolatedGridNo != -1) {
    sGridNo2 = gMapInformation.sIsolatedGridNo;

    for (uiCounter = gTacticalStatus.Team[gbPlayerNum].bFirstID; uiCounter < gTacticalStatus.Team[gbPlayerNum].bLastID; uiCounter++) {
      pSoldier = MercPtrs[uiCounter];
      if (pSoldier && pSoldier.bActive && pSoldier.bLife > 0 && pSoldier.sSectorX == sSectorX && pSoldier.sSectorY == sSectorY && pSoldier.bSectorZ == bSectorZ) {
        if (FindBestPath(pSoldier, sGridNo2, pSoldier.bLevel, Enum193.WALKING, NO_COPYROUTE, 0)) {
          fSecondary = true;
          break;
        }
      }
    }

    if (!fSecondary) {
      sGridNo2 = NOWHERE;
    }
  }

  GlobalItemsReachableTest(sGridNo, sGridNo2);

  for (uiCounter = 0; uiCounter < guiNumWorldItems; uiCounter++) {
    // reset reachablity
    fReachable = false;

    // item doesn't exist, ignore it
    if (gWorldItems[uiCounter].fExists == false) {
      continue;
    }

    // if the item is trapped then flag it as unreachable, period
    if (gWorldItems[uiCounter].o.bTrap > 0) {
      fReachable = false;
    } else if (ItemTypeExistsAtLocation(gWorldItems[uiCounter].sGridNo, Enum225.OWNERSHIP, gWorldItems[uiCounter].ubLevel, null)) {
      fReachable = false;
    } else if (gWorldItems[uiCounter].o.usItem == Enum225.CHALICE) {
      fReachable = false;
    } else if (gpWorldLevelData[gWorldItems[uiCounter].sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
      // the gridno itself is reachable so the item is reachable
      fReachable = true;
    } else if (gWorldItems[uiCounter].ubLevel > 0) {
      // items on roofs are always reachable
      fReachable = true;
    } else {
      // check the 4 grids around the item, if any is reachable...then the item is reachable
      for (ubDir = 0; ubDir < Enum245.NUM_WORLD_DIRECTIONS; ubDir += 2) {
        sNewLoc = NewGridNo(gWorldItems[uiCounter].sGridNo, DirectionInc(ubDir));
        if (sNewLoc != gWorldItems[uiCounter].sGridNo) {
          // then it's a valid gridno, so test it
          // requires non-wall movement cost from one location to the other!
          if (gpWorldLevelData[sNewLoc].uiFlags & MAPELEMENT_REACHABLE) {
            ubMovementCost = gubWorldMovementCosts[gWorldItems[uiCounter].sGridNo][gOppositeDirection[ubDir]][0];
            // if we find a door movement cost, if the door is open the gridno should be accessible itself
            if (ubMovementCost != TRAVELCOST_DOOR && ubMovementCost != TRAVELCOST_WALL) {
              fReachable = true;
              break;
            }
          }
        }
      }
    }

    if (fReachable) {
      gWorldItems[uiCounter].usFlags |= WORLD_ITEM_REACHABLE;
    } else {
      gWorldItems[uiCounter].usFlags &= ~(WORLD_ITEM_REACHABLE);
    }
  }
}

export function LoadCurrentSectorsInformationFromTempItemsFile(): boolean {
  let fUsedTempFile: boolean = false;

  //
  // Load in the sectors ITems
  //

  if (AreInMeanwhile()) {
    // There will never be a temp file for the meanwhile scene, so return TRUE.  However,
    // set a flag to not save it either!
    gfWasInMeanwhile = true;

    // OK  - this is true except for interrotations - we need that item temp file to be
    // processed!
    if (GetMeanwhileID() == Enum160.INTERROGATION) {
      // If there is a file, load in the Items array
      if (DoesTempFileExistsForMap(SF_ITEM_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
        if (!LoadAndAddWorldItemsFromTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ))
          return false;
      }

      gfWasInMeanwhile = false;
    }
    return true;
  }

  // if we are in an above ground sector

  // If there is a file, load in the Items array
  if (DoesTempFileExistsForMap(SF_ITEM_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadAndAddWorldItemsFromTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ))
      return false;
  }

  // If there is a rotting corpse temp file, load the data from the temp file
  if (DoesTempFileExistsForMap(SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadRottingCorpsesFromTempCorpseFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ))
      return false;
  }

  // If there is a map modifications file, load the data from the temp file
  if (DoesTempFileExistsForMap(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadAllMapChangesFromMapTempFileAndApplyThem())
      return false;
  }

  // if there is a door table temp file, load the data from the temp file
  if (DoesTempFileExistsForMap(SF_DOOR_TABLE_TEMP_FILES_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadDoorTableFromDoorTableTempFile())
      return false;
  }

  // if there is a revealed status temp file, load the data from the temp file
  if (DoesTempFileExistsForMap(SF_REVEALED_STATUS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadRevealedStatusArrayFromRevealedTempFile())
      return false;
  }

  // if there is a door status temp file, load the data from the temp file
  if (DoesTempFileExistsForMap(SF_DOOR_STATUS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadDoorStatusArrayFromDoorStatusTempFile())
      return false;
  }

  // if the save is an older version, use theold way of oading it up
  if (guiSavedGameVersion < 57) {
    if (DoesTempFileExistsForMap(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
      fUsedTempFile = true;
      if (!LoadEnemySoldiersFromTempFile())
        return false;
    }
  }

  // else use the new way of loading the enemy and civilian placements
  else {
    if (DoesTempFileExistsForMap(SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
      fUsedTempFile = true;
      if (!NewWayOfLoadingEnemySoldiersFromTempFile())
        return false;
    }

    if (DoesTempFileExistsForMap(SF_CIV_PRESERVED_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
      fUsedTempFile = true;
      if (!NewWayOfLoadingCiviliansFromTempFile())
        return false;
    }
  }

  if (DoesTempFileExistsForMap(SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadSmokeEffectsFromMapTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ))
      return false;
  }

  if (DoesTempFileExistsForMap(SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ)) {
    fUsedTempFile = true;
    if (!LoadLightEffectsFromMapTempFile(gWorldSectorX, gWorldSectorY, gbWorldSectorZ))
      return false;
  }

  // ttt

  // Check to see if any npc are in this sector, if so load up some saved data for them
  LoadNPCInformationFromProfileStruct();

  // if we are loading a saved game
  //	if( gTacticalStatus.uiFlags & LOADING_SAVED_GAME )
  {
    // Init the world since we have modified the map
    InitLoadedWorld();
  }

  // Get the last time the player was in the sector
  guiTimeCurrentSectorWasLastLoaded = GetLastTimePlayerWasInSector();

  if (fUsedTempFile) {
    //		ValidateSoldierInitLinks( 3 );
  }

  StripEnemyDetailedPlacementsIfSectorWasPlayerLiberated();

  return true;
}

function SetLastTimePlayerWasInSector(): void {
  if (!gbWorldSectorZ)
    SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)].uiTimeCurrentSectorWasLastLoaded = GetWorldTotalMin();
  else if (gbWorldSectorZ > 0) {
    let pTempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

    pTempNode = gpUndergroundSectorInfoHead;

    // loop through and look for the right underground sector
    while (pTempNode) {
      if ((pTempNode.ubSectorX == gWorldSectorX) && (pTempNode.ubSectorY == gWorldSectorY) && (pTempNode.ubSectorZ == gbWorldSectorZ)) {
        // set the flag indicating that ther is a temp item file exists for the sector
        pTempNode.uiTimeCurrentSectorWasLastLoaded = GetWorldTotalMin();
        return; // break out
      }
      pTempNode = pTempNode.next;
    }
  }
}

function GetLastTimePlayerWasInSector(): UINT32 {
  if (!gbWorldSectorZ)
    return SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)].uiTimeCurrentSectorWasLastLoaded;
  else if (gbWorldSectorZ > 0) {
    let pTempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

    pTempNode = gpUndergroundSectorInfoHead;

    // loop through and look for the right underground sector
    while (pTempNode) {
      if ((pTempNode.ubSectorX == gWorldSectorX) && (pTempNode.ubSectorY == gWorldSectorY) && (pTempNode.ubSectorZ == gbWorldSectorZ)) {
        // set the flag indicating that ther is a temp item file exists for the sector
        return pTempNode.uiTimeCurrentSectorWasLastLoaded;
      }
      pTempNode = pTempNode.next;
    }

    return 0;
  }
  return 0;
}

function LoadAndAddWorldItemsFromTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let uiNumberOfItems: UINT32 = 0;
  let pWorldItems: WORLDITEM[];
  let cnt: UINT32;
  let sNewGridNo: INT16;

  // Get the number of items from the file
  if ((uiNumberOfItems = GetNumberOfWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, true)) === -1) {
    // Error getting the numbers of the items from the sector
    return false;
  }

  if (uiNumberOfItems) {
    pWorldItems = createArrayFrom(uiNumberOfItems, createWorldItem);
  } else {
    // if there are no items in the temp, the player might have cleared all of them out, check to see
    // If we have already been to the sector
    if (GetSectorFlagStatus(sMapX, sMapY, bMapZ, SF_ALREADY_LOADED)) {
      //
      // Completly replace the current sectors item table because all the items SHOULD be in the temp file!!
      //

      // Destroy the current sectors item table
      TrashWorldItems();

      // Add each item to the pool, handle below, outside of the if
    }

    // there are no items in the file
    return true;
  }

  // Load the World Items from the file
  if (!LoadWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, pWorldItems))
    return false;

  // If we have already been to the sector
  if (GetSectorFlagStatus(sMapX, sMapY, bMapZ, SF_ALREADY_LOADED)) {
    //
    // Completly replace the current sectors item table because all the items SHOULD be in the temp file!!
    //

    // Destroy the current sectors item table
    TrashWorldItems();

    // Add each item to the pool, handle below, outside of the if
  }

  //
  // Append the items in the file with to the current sectors item table
  //

  // Loop through all the items loaded from the file
  for (cnt = 0; cnt < uiNumberOfItems; cnt++) {
    // If the item in the array is valid
    if (pWorldItems[cnt].fExists) {
      // Check the flags to see if we have to find a gridno to place the items at
      if (pWorldItems[cnt].usFlags & WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO) {
        sNewGridNo = FindNearestAvailableGridNoForItem(pWorldItems[cnt].sGridNo, 5);
        if (sNewGridNo == NOWHERE)
          sNewGridNo = FindNearestAvailableGridNoForItem(pWorldItems[cnt].sGridNo, 15);

        if (sNewGridNo != NOWHERE) {
          pWorldItems[cnt].sGridNo = sNewGridNo;
        }
      }

      // If the item has an invalid gridno, use the maps entry point
      if (pWorldItems[cnt].usFlags & WORLD_ITEM_GRIDNO_NOT_SET_USE_ENTRY_POINT) {
        pWorldItems[cnt].sGridNo = gMapInformation.sCenterGridNo;
      }

      // add the item to the world
      AddItemToPool(pWorldItems[cnt].sGridNo, pWorldItems[cnt].o, pWorldItems[cnt].bVisible, pWorldItems[cnt].ubLevel, pWorldItems[cnt].usFlags, pWorldItems[cnt].bRenderZHeightAboveLevel);
    }
  }

  return true;
}

function AddTempFileToSavedGame(hFile: HWFILE, uiType: UINT32, sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let zMapName: string /* CHAR8[128] */;

  zMapName = GetMapTempFileName(uiType, sMapX, sMapY, bMapZ);

  // Save the map temp file to the saved game file
  if (!SaveFilesToSavedGame(zMapName, hFile))
    return false;

  return true;
}

function RetrieveTempFileFromSavedGame(hFile: HWFILE, uiType: UINT32, sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let zMapName: string /* CHAR8[128] */;

  zMapName = GetMapTempFileName(uiType, sMapX, sMapY, bMapZ);

  // Load the map temp file from the saved game file
  if (!LoadFilesFromSavedGame(zMapName, hFile))
    return false;

  return true;
}

// Deletes the Temp map Directory
export function InitTacticalSave(fCreateTempDir: boolean): boolean {
  let uiRetVal: UINT32;

  // If the Map Temp directory exists, removes the temp files
  uiRetVal = FileGetAttributes(MAPS_DIR);
  if (uiRetVal != 0xFFFFFFFF) {
    if (uiRetVal & FILE_ATTRIBUTES_DIRECTORY) {
      // Erase the directory
      if (!EraseDirectory(MAPS_DIR)) {
        // error erasing the temporary maps directory
      }
    }
  } else {
    if (!MakeFileManDirectory(MAPS_DIR)) {
      // Erro creating the temp map directory
      AssertMsg(false, "Error creating the Temp Directory.");
    }
  }

  if (fCreateTempDir) {
    // Create the initial temp file for the Npc Quote Info
    InitTempNpcQuoteInfoForNPCFromTempFile();
  }

  return true;
}

function SaveRottingCorpsesToTempCorpseFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32 = 0;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: string /* CHAR8[128] */;
  let uiNumberOfCorpses: UINT32 = 0;
  let iCount: INT32;
  let buffer: Buffer;

  /*
          //Convert the current sector location into a file name
          GetMapFileName( sMapX,sMapY, bMapZ, zTempName, FALSE );

          //add the 'r' for 'Rotting Corpses' to the front of the map name
          sprintf( zMapName, "%s\\r_%s", MAPS_DIR, zTempName);
  */

 zMapName = GetMapTempFileName(SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Determine how many rotting corpses there are
  for (iCount = 0; iCount < giNumRottingCorpse; iCount++) {
    if (gRottingCorpse[iCount].fActivated == true)
      uiNumberOfCorpses++;
  }

  // Save the number of the Rotting Corpses array table
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumberOfCorpses, 0);

  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  // Loop through all the carcases in the array and save the active ones
  buffer = Buffer.allocUnsafe(ROTTING_CORPSE_DEFINITION_SIZE);
  for (iCount = 0; iCount < giNumRottingCorpse; iCount++) {
    if (gRottingCorpse[iCount].fActivated == true) {
      // Save the RottingCorpse info array
      writeRottingCorpseDefinition(gRottingCorpse[iCount].def, buffer);
      uiNumBytesWritten = FileWrite(hFile, buffer, ROTTING_CORPSE_DEFINITION_SIZE);
      if (uiNumBytesWritten != ROTTING_CORPSE_DEFINITION_SIZE) {
        // Error Writing size of array to disk
        FileClose(hFile);
        return false;
      }
    }
  }

  FileClose(hFile);

  // Set the flag indicating that there is a rotting corpse Temp File
  //	SectorInfo[ SECTOR( sMapX,sMapY) ].uiFlags |= SF_ROTTING_CORPSE_TEMP_FILE_EXISTS;
  SetSectorFlag(sMapX, sMapY, bMapZ, SF_ROTTING_CORPSE_TEMP_FILE_EXISTS);

  return true;
}

function DeleteTempItemMapFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let bSectorId: UINT8 = 0;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: string /* CHAR8[128] */;

  // grab the sector id
  bSectorId = SECTOR(sMapX, sMapY);
  /*
          //Convert the current sector location into a file name
          GetMapFileName( sMapX,sMapY, bMapZ, zTempName, FALSE );

          sprintf( zMapName, "%s\\r_%s", MAPS_DIR, zTempName);
  */
 zMapName = GetMapTempFileName(SF_ITEM_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return true;
  }

  // the sector info flag being reset
  ReSetSectorFlag(sMapX, sMapY, bMapZ, SF_ITEM_TEMP_FILE_EXISTS);

  return true;
}

function LoadRottingCorpsesFromTempCorpseFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32 = 0;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: string /* CHAR8[128] */;
  let uiNumberOfCorpses: UINT32 = 0;
  let cnt: UINT32;
  let def: ROTTING_CORPSE_DEFINITION = createRottingCorpseDefinition();
  let fDontAddCorpse: boolean = false;
  let bTownId: INT8;
  let buffer: Buffer;

  // Delete the existing rotting corpse array
  RemoveCorpses();
  /*
          //Convert the current sector location into a file name
          GetMapFileName( sMapX,sMapY, bMapZ, zTempName, FALSE );

          sprintf( zMapName, "%s\\r_%s", MAPS_DIR, zTempName);
  */
 zMapName = GetMapTempFileName(SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return true;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Load the number of Rotting corpses
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }
  uiNumberOfCorpses = buffer.readUInt32LE(0);

  // Get town ID for use later....
  bTownId = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  buffer = Buffer.allocUnsafe(ROTTING_CORPSE_DEFINITION_SIZE);
  for (cnt = 0; cnt < uiNumberOfCorpses; cnt++) {
    fDontAddCorpse = false;

    // Load the Rotting corpses info
    uiNumBytesRead = FileRead(hFile, buffer, ROTTING_CORPSE_DEFINITION_SIZE);
    if (uiNumBytesRead != ROTTING_CORPSE_DEFINITION_SIZE) {
      // Error Writing size of array to disk
      FileClose(hFile);
      return false;
    }
    readRottingCorpseDefinition(def, buffer);

    // Check the flags to see if we have to find a gridno to place the rotting corpses at
    if (def.usFlags & ROTTING_CORPSE_FIND_SWEETSPOT_FROM_GRIDNO) {
      def.sGridNo = FindNearestAvailableGridNoForCorpse(def, 5);
      if (def.sGridNo == NOWHERE)
        def.sGridNo = FindNearestAvailableGridNoForCorpse(def, 15);

      // ATE: Here we still could have a bad location, but send in NOWHERE
      // to corpse function anyway, 'cause it will iwth not drop it or use
      // a map edgepoint....
    } else if (def.usFlags & ROTTING_CORPSE_USE_NORTH_ENTRY_POINT) {
      def.sGridNo = gMapInformation.sNorthGridNo;
    } else if (def.usFlags & ROTTING_CORPSE_USE_SOUTH_ENTRY_POINT) {
      def.sGridNo = gMapInformation.sSouthGridNo;
      ;
    } else if (def.usFlags & ROTTING_CORPSE_USE_EAST_ENTRY_POINT) {
      def.sGridNo = gMapInformation.sEastGridNo;
    } else if (def.usFlags & ROTTING_CORPSE_USE_WEST_ENTRY_POINT) {
      def.sGridNo = gMapInformation.sWestGridNo;
    }
    // Recalculate the dx,dy info
    def.dXPos = CenterX(def.sGridNo);
    def.dYPos = CenterY(def.sGridNo);

    // If not from loading a save....
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // ATE: Don't place corpses if
      // a ) in a town and b) indoors
      if (gbWorldSectorZ == 0) {
        if (bTownId != Enum135.BLANK_SECTOR) {
          // Are we indoors?
          if (FloorAtGridNo(def.sGridNo)) {
            // OK, finally, check TOC vs game time to see if at least some time has passed
            if ((GetWorldTotalMin() - def.uiTimeOfDeath) >= 30) {
              fDontAddCorpse = true;
            }
          }
        }
      }
    }

    if (!fDontAddCorpse) {
      // add the rotting corpse info
      if (AddRottingCorpse(def) == -1) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Failed to add a corpse to GridNo # %d", def.sGridNo));

        /*
                                Assert( 0 );
                                FileClose( hFile );
                                return( FALSE );
        */
      }
    }
  }

  FileClose(hFile);

  // Check to see if we have to start decomposing the corpses
  HandleRottingCorpses();

  return true;
}

export function AddWorldItemsToUnLoadedSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8, sGridNo: INT16, uiNumberOfItems: UINT32, pWorldItem: WORLDITEM[], fOverWrite: boolean): boolean {
  let uiLoop: UINT32;
  let fLoop: boolean = fOverWrite;

  for (uiLoop = 0; uiLoop < uiNumberOfItems; uiLoop++) {
    // If the item exists
    if (pWorldItem[uiLoop].fExists) {
      AddItemsToUnLoadedSector(sMapX, sMapY, bMapZ, pWorldItem[uiLoop].sGridNo, 1, [pWorldItem[uiLoop].o], pWorldItem[uiLoop].ubLevel, pWorldItem[uiLoop].usFlags, pWorldItem[uiLoop].bRenderZHeightAboveLevel, pWorldItem[uiLoop].bVisible, fLoop);

      fLoop = false;
    }
  }

  return true;
}

function SaveNPCInformationToProfileStruct(): void {
  let cnt: UINT32;
  let pSoldier: SOLDIERTYPE;
  let pProfile: MERCPROFILESTRUCT;

  // Loop through the active NPC's

  // Only do this on save now... on traversal this is handled in the strategic code
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    return;
  }

  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    // if it is an active NPC
    if (pSoldier && pSoldier.ubProfile != NO_PROFILE && pSoldier.bTeam == CIV_TEAM) {
      // Save Temp Npc Quote Info array
      SaveTempNpcQuoteInfoForNPCToTempFile(pSoldier.ubProfile);

      pProfile = gMercProfiles[pSoldier.ubProfile];

      pProfile.ubQuoteActionID = pSoldier.ubQuoteActionID;
      pProfile.ubQuoteRecord = pSoldier.ubQuoteRecord;

      // if the merc is NOT added due to flag set, return
      if (pProfile.ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR) {
        continue;
      }

      if (pProfile.ubMiscFlags3 & PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE) {
        continue;
      }

      pProfile.fUseProfileInsertionInfo = true;
      pProfile.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      // if ( gTacticalStatus.uiFlags & LOADING_SAVED_GAME )
      //{
      // if we are saving the game, save the NPC's current location
      pProfile.usStrategicInsertionData = pSoldier.sGridNo;
      //}
      /*
      else
      {
              // If the NPC is moving, save the final destination, else save the current location
              if ( pSoldier->sFinalDestination != pSoldier->sGridNo )
              {
                      pProfile->usStrategicInsertionData = pSoldier->sFinalDestination;
              }
              else
              {
                      pProfile->usStrategicInsertionData = pSoldier->sGridNo;
              }
      }
      */
    }
  }
}

function LoadNPCInformationFromProfileStruct(): void {
  let cnt: UINT32;
  let sSoldierID: INT16;
  let pSoldier: SOLDIERTYPE | null;

  // CJC: disabled this Dec 21, 1998 as unnecessary (and messing up quote files for recruited/escorted NPCs
  return;

  for (cnt = FIRST_RPC; cnt < NUM_PROFILES; cnt++) {
    if (gMercProfiles[cnt].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED) {
      // don't load
      continue;
    }

    sSoldierID = GetSoldierIDFromAnyMercID(cnt);

    // if the soldier is not loaded, return
    if (sSoldierID == -1)
      continue;

    // if we cant get a pointer to the soldier, continue
    if ((pSoldier = GetSoldier(sSoldierID)) === null)
      continue;

    // load quote info if it exists
    if (gMercProfiles[cnt].ubMiscFlags & PROFILE_MISC_FLAG_TEMP_NPC_QUOTE_DATA_EXISTS) {
      LoadTempNpcQuoteInfoForNPCFromTempFile(cnt);
    }

    // load insertion info
    /*
    if ( gMercProfiles[ cnt ] )
    {
            pSoldier->ubInsertionCode = pProfile->ubStrategicInsertionCode;
            pSoldier->usInsertionData = pProfile->usStrategicInsertionData;
    }
    */
  }

  /*
          INT16 sX, sY;
          UINT16	cnt;
          SOLDIERTYPE		*pSoldier;
          INT16			sSoldierID;
          INT16		sXPos, sYPos;

          sXPos = sYPos = 0;

          //Loop through the active NPC's
  //	cnt = gTacticalStatus.Team[ OUR_TEAM ].bLastID + 1;
          for(cnt=FIRST_RPC; cnt<NUM_PROFILES; cnt++)
          {
                  if ( gMercProfiles[ cnt ].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED )
                  {
                          // don't load
                          continue;
                  }

                  sSoldierID = GetSoldierIDFromAnyMercID( (UINT8)cnt );

                  //if the soldier is not loaded, return
                  if( sSoldierID == -1 )
                          continue;

                  //if we cant get a pointer to the soldier, continue
                  if( !GetSoldier( &pSoldier, sSoldierID ) )
                          continue;

                  pSoldier->ubQuoteActionID = gMercProfiles[ cnt ].ubQuoteActionID;
                  pSoldier->ubQuoteRecord = gMercProfiles[ cnt ].ubQuoteRecord;

                  if( gMercProfiles[ cnt ].fUseProfileInsertionInfo == PROFILE_USE_GRIDNO )
                  {
                          sX = CenterX( gMercProfiles[ cnt ].sGridNo );
                          sY = CenterY( gMercProfiles[ cnt ].sGridNo );

                          //Load the Temp Npc Quote Info array

                          //if the NPC has been recruited, continue
                          if( gMercProfiles[ cnt ].ubMiscFlags & PROFILE_MISC_FLAG_TEMP_NPC_QUOTE_DATA_EXISTS )
                                  LoadTempNpcQuoteInfoForNPCFromTempFile( (UINT8)cnt );

                          //if the NPC has been recruited, continue
                          if( gMercProfiles[ cnt ].ubMiscFlags & PROFILE_MISC_FLAG_RECRUITED )
                                  continue;

                          //If the NPC was supposed to do something when they reached their target destination
                          if( pSoldier->sGridNo == pSoldier->sFinalDestination )
                          {
                                  if (pSoldier->ubQuoteRecord && pSoldier->ubQuoteActionID == QUOTE_ACTION_ID_CHECKFORDEST )
                                  {
                                          //the mercs gridno has to be the same as the final destination
                                          EVENT_SetSoldierPosition( pSoldier, (FLOAT) sX, (FLOAT) sY );

                                          NPCReachedDestination( pSoldier, FALSE );
                                  }
                          }

                          //If the NPC's gridno is not nowhere, set him to that position
                          if( gMercProfiles[ cnt ].sGridNo != NOWHERE )
                          {
                                  if( !(gTacticalStatus.uiFlags & LOADING_SAVED_GAME ) )
                                  {
                                          //Set the NPC's destination
                                          pSoldier->sDestination = gMercProfiles[ cnt ].sGridNo;
                                          pSoldier->sDestXPos = sXPos;
                                          pSoldier->sDestYPos = sYPos;

                                          // We have moved to a diferent sector and are returning to it, therefore the merc should be in the final dest
                                          EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination( pSoldier, (FLOAT) sX, (FLOAT) sY, FALSE, TRUE );
                                  }

                                  //else we are saving
                                  else
                                  {

                                          //Set the NPC's position
          //				EVENT_SetSoldierPosition( pSoldier, (FLOAT) sX, (FLOAT) sY );
                                          EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination( pSoldier, (FLOAT) sX, (FLOAT) sY, FALSE, FALSE );
                                  }
                          }
                  }

                  //else if we are NOT to use the gridno, dont use it but reset the flag
                  else if( gMercProfiles[ cnt ].fUseProfileInsertionInfo == PROFILE_DONT_USE_GRIDNO )
                  {
                          gMercProfiles[ cnt ].fUseProfileInsertionInfo = PROFILE_NOT_SET;
                  }
          }
  */
}

export function GetNumberOfActiveWorldItemsFromTempFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8): UINT32 {
  let pNumberOfData: UINT32;

  let uiNumberOfItems: UINT32 = 0;
  let pWorldItems: WORLDITEM[] /* Pointer<WORLDITEM> */;
  let cnt: UINT32;
  let uiNumberOfActive: UINT32 = 0;
  let fFileLoaded: boolean = false;
  let TempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

  //
  // Load in the sectors ITems
  //

  // If there is a file, load in the Items array
  if (bMapZ == 0) {
    if (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & SF_ITEM_TEMP_FILE_EXISTS)
      fFileLoaded = true;
  } else {
    while (TempNode) {
      if (TempNode.ubSectorX == sMapX && TempNode.ubSectorY == sMapY && TempNode.ubSectorZ == bMapZ) {
        if (TempNode.uiFlags & SF_ITEM_TEMP_FILE_EXISTS)
          fFileLoaded = true;

        break;
      }

      TempNode = TempNode.next;
    }
  }

  if (fFileLoaded) {
    // Get the number of items from the file
    if ((uiNumberOfItems = GetNumberOfWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, true)) === -1) {
      // Error getting the numbers of the items from the sector
      return -1;
    }

    // If there items in the data file
    if (uiNumberOfItems != 0) {
      pWorldItems = createArrayFrom(uiNumberOfItems, createWorldItem);

      // Load the World Items from the file
      if (!LoadWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, pWorldItems))
        return -1;

      uiNumberOfActive = 0;
      for (cnt = 0; cnt < uiNumberOfItems; cnt++) {
        if (pWorldItems[cnt].fExists)
          uiNumberOfActive++;
      }
    }
    pNumberOfData = uiNumberOfActive;
  } else
    pNumberOfData = 0;

  return pNumberOfData;
}

function DoesTempFileExistsForMap(uiType: UINT32, sMapX: INT16, sMapY: INT16, bMapZ: INT8): boolean {
  let TempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

  if (bMapZ == 0) {
    return (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & uiType) ? true : false;
  } else {
    while (TempNode) {
      if (TempNode.ubSectorX == sMapX && TempNode.ubSectorY == sMapY && TempNode.ubSectorZ == bMapZ) {
        return (TempNode.uiFlags & uiType) ? true : false;
      }
      TempNode = TempNode.next;
    }
  }

  return false;
}

function GetSoldierIDFromAnyMercID(ubMercID: UINT8): INT16 {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = TOTAL_SOLDIERS;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.bActive) {
      if (pTeamSoldier.ubProfile == ubMercID) {
        return cnt;
      }
    }
  }

  return -1;
}

// Initializes the NPC temp array
function InitTempNpcQuoteInfoForNPCFromTempFile(): boolean {
  let uiNumBytesWritten: UINT32;
  let ubCnt: UINT8;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;
  let TempNpcQuote: TempNPCQuoteInfoSave[] /* [NUM_NPC_QUOTE_RECORDS] */ = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createTempNPCQuoteInfoSave);
  let uiSizeOfTempArray: UINT32 = TEMP_NPC_QUOTE_INFO_SAVE_SIZE * NUM_NPC_QUOTE_RECORDS;
  let usCnt1: UINT16;
  let hFile: HWFILE;
  let buffer: Buffer;

  // Open the temp npc file
  hFile = FileOpen(NPC_TEMP_QUOTE_FILE, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening temp npc quote info
    return false;
  }

  // loop through all the npc accounts and write the temp array to disk
  buffer = Buffer.allocUnsafe(uiSizeOfTempArray);
  for (usCnt1 = 0; usCnt1 < (NUM_PROFILES - FIRST_RPC); usCnt1++) {
    TempNpcQuote.forEach(resetTempNPCQuoteInfoSave);

    // Loop through and build the temp array to save
    for (ubCnt = 0; ubCnt < NUM_NPC_QUOTE_RECORDS; ubCnt++) {
      if (gpNPCQuoteInfoArray[usCnt1]) {
        TempNpcQuote[ubCnt].usFlags = gpNPCQuoteInfoArray[usCnt1][ubCnt].fFlags;
        TempNpcQuote[ubCnt].sRequiredItem = gpNPCQuoteInfoArray[usCnt1][ubCnt].sRequiredItem;
        TempNpcQuote[ubCnt].usGoToGridno = gpNPCQuoteInfoArray[usCnt1][ubCnt].usGoToGridno;
      }
    }

    // Save the array to a temp file
    writeObjectArray(TempNpcQuote, buffer, 0, writeTempNPCQuoteInfoSave);
    uiNumBytesWritten = FileWrite(hFile, buffer, uiSizeOfTempArray);
    if (uiNumBytesWritten != uiSizeOfTempArray) {
      FileClose(hFile);
      return false;
    }
  }

  FileClose(hFile);
  return true;
}

function SaveTempNpcQuoteInfoForNPCToTempFile(ubNpcId: UINT8): boolean {
  let uiNumBytesWritten: UINT32;
  let ubCnt: UINT8;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;
  let TempNpcQuote: TempNPCQuoteInfoSave[] /* [NUM_NPC_QUOTE_RECORDS] */ = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createTempNPCQuoteInfoSave);
  let uiSizeOfTempArray: UINT32 = TEMP_NPC_QUOTE_INFO_SAVE_SIZE * NUM_NPC_QUOTE_RECORDS;
  let uiSpotInFile: UINT32 = ubNpcId - FIRST_RPC;
  let hFile: HWFILE = 0;
  let buffer: Buffer;

  // if there are records to save
  if (gpNPCQuoteInfoArray[ubNpcId]) {
    hFile = FileOpen(NPC_TEMP_QUOTE_FILE, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
    if (hFile == 0) {
      // Error opening temp npc quote info
      return false;
    }

    // Loop through and build the temp array to save
    for (ubCnt = 0; ubCnt < NUM_NPC_QUOTE_RECORDS; ubCnt++) {
      TempNpcQuote[ubCnt].usFlags = gpNPCQuoteInfoArray[ubNpcId][ubCnt].fFlags;
      TempNpcQuote[ubCnt].sRequiredItem = gpNPCQuoteInfoArray[ubNpcId][ubCnt].sRequiredItem;
      TempNpcQuote[ubCnt].usGoToGridno = gpNPCQuoteInfoArray[ubNpcId][ubCnt].usGoToGridno;
    }

    // Seek to the correct spot in the file
    FileSeek(hFile, uiSpotInFile * uiSizeOfTempArray, FILE_SEEK_FROM_START);

    // Save the array to a temp file
    buffer = Buffer.allocUnsafe(uiSizeOfTempArray);
    writeObjectArray(TempNpcQuote, buffer, 0, writeTempNPCQuoteInfoSave);

    uiNumBytesWritten = FileWrite(hFile, buffer, uiSizeOfTempArray);
    if (uiNumBytesWritten != uiSizeOfTempArray) {
      FileClose(hFile);
      return false;
    }

    // Set the fact that the merc has the temp npc quote data
    gMercProfiles[ubNpcId].ubMiscFlags |= PROFILE_MISC_FLAG_TEMP_NPC_QUOTE_DATA_EXISTS;

    FileClose(hFile);
  }

  return true;
}

function LoadTempNpcQuoteInfoForNPCFromTempFile(ubNpcId: UINT8): boolean {
  let uiNumBytesRead: UINT32;
  let ubCnt: UINT8;
  let ubOne: UINT8 = 1;
  let ubZero: UINT8 = 0;
  let TempNpcQuote: TempNPCQuoteInfoSave[] /* [NUM_NPC_QUOTE_RECORDS] */ = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createTempNPCQuoteInfoSave);
  let uiSizeOfTempArray: UINT32 = TEMP_NPC_QUOTE_INFO_SAVE_SIZE * NUM_NPC_QUOTE_RECORDS;
  let uiSpotInFile: UINT32 = ubNpcId - FIRST_RPC;
  let hFile: HWFILE;
  let buffer: Buffer;

  // If there isnt already memory allocated, allocate memory to hold the array
  if (gpNPCQuoteInfoArray[ubNpcId] == null) {
    gpNPCQuoteInfoArray[ubNpcId] = createArrayFrom(NUM_NPC_QUOTE_RECORDS, createNPCQuoteInfo);
    if (gpNPCQuoteInfoArray[ubNpcId] == null)
      return false;
  }

  hFile = FileOpen(NPC_TEMP_QUOTE_FILE, FILE_ACCESS_READ | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening temp npc quote info
    return false;
  }

  // Seek to the correct spot in the file
  FileSeek(hFile, uiSpotInFile * uiSizeOfTempArray, FILE_SEEK_FROM_START);

  // Save the array to a temp file
  buffer = Buffer.allocUnsafe(uiSizeOfTempArray);
  uiNumBytesRead = FileRead(hFile, buffer, uiSizeOfTempArray);
  if (uiNumBytesRead != uiSizeOfTempArray) {
    FileClose(hFile);
    return false;
  }
  readObjectArray(TempNpcQuote, buffer, 0, readTempNPCQuoteInfoSave);

  // Loop through and build the temp array to save
  for (ubCnt = 0; ubCnt < NUM_NPC_QUOTE_RECORDS; ubCnt++) {
    gpNPCQuoteInfoArray[ubNpcId][ubCnt].fFlags = TempNpcQuote[ubCnt].usFlags;
    gpNPCQuoteInfoArray[ubNpcId][ubCnt].sRequiredItem = TempNpcQuote[ubCnt].sRequiredItem;
    gpNPCQuoteInfoArray[ubNpcId][ubCnt].usGoToGridno = TempNpcQuote[ubCnt].usGoToGridno;
  }

  FileClose(hFile);

  return true;
}

export function ChangeNpcToDifferentSector(ubNpcId: UINT8, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  if (gMercProfiles[ubNpcId].ubMiscFlags2 & PROFILE_MISC_FLAG2_LEFT_COUNTRY) {
    // override location, this person is OUTTA here
    sSectorX = 0;
    sSectorY = 0;
    bSectorZ = 0;
  }
  // Carmen no longer traverses out, he is temporarily removed instead

  gMercProfiles[ubNpcId].sSectorX = sSectorX;
  gMercProfiles[ubNpcId].sSectorY = sSectorY;
  gMercProfiles[ubNpcId].bSectorZ = bSectorZ;

  gMercProfiles[ubNpcId].fUseProfileInsertionInfo = false;

  /*
  if (!gMercProfiles[ ubNpcId ].ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR)
  {
          gMercProfiles[ ubNpcId ].fUseProfileInsertionInfo = PROFILE_DONT_USE_GRIDNO;
  }
  */
}

export function AddRottingCorpseToUnloadedSectorsRottingCorpseFile(sMapX: INT16, sMapY: INT16, bMapZ: INT8, pRottingCorpseDef: ROTTING_CORPSE_DEFINITION): boolean {
  let hFile: HWFILE;
  let uiNumberOfCorpses: UINT32;
  //	CHAR8		zTempName[ 128 ];
  let zMapName: string /* CHAR8[128] */;
  let uiNumBytesRead: UINT32;
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  /*
          //Convert the current sector location into a file name
          GetMapFileName( sMapX,sMapY, bMapZ, zTempName, FALSE );

          //add the 'r' for 'Rotting Corpses' to the front of the map name
          sprintf( zMapName, "%s\\r_%s", MAPS_DIR, zTempName);
  */
 zMapName = GetMapTempFileName(SF_ROTTING_CORPSE_TEMP_FILE_EXISTS, sMapX, sMapY, bMapZ);

  // CHECK TO SEE if the file exist
  if (FileExists(zMapName)) {
    // Open the file for reading
    hFile = FileOpen(zMapName, FILE_ACCESS_READWRITE | FILE_OPEN_EXISTING, false);
    if (hFile == 0) {
      // Error opening map modification file,
      return false;
    }

    // Load the number of Rotting corpses
    buffer = Buffer.allocUnsafe(4);
    uiNumBytesRead = FileRead(hFile, buffer, 4);
    if (uiNumBytesRead != 4) {
      // Error Writing size of array to disk
      FileClose(hFile);
      return false;
    }
    uiNumberOfCorpses = buffer.readUInt32LE(0);
  } else {
    // the file doesnt exists, create a new one
    hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
    if (hFile == 0) {
      // Error opening map modification file
      return false;
    }
    uiNumberOfCorpses = 0;
  }

  // Start at the begining of the file
  FileSeek(hFile, 0, FILE_SEEK_FROM_START);

  // Add on to the number and save it back to disk
  uiNumberOfCorpses++;

  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumberOfCorpses, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  // Go to the end of the file
  FileSeek(hFile, 0, FILE_SEEK_FROM_END);

  // Append the new rotting corpse def to the end of the file
  buffer = Buffer.allocUnsafe(ROTTING_CORPSE_DEFINITION_SIZE);
  writeRottingCorpseDefinition(pRottingCorpseDef, buffer);

  uiNumBytesWritten = FileWrite(hFile, buffer, ROTTING_CORPSE_DEFINITION_SIZE);
  if (uiNumBytesWritten != ROTTING_CORPSE_DEFINITION_SIZE) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);
  SetSectorFlag(sMapX, sMapY, bMapZ, SF_ROTTING_CORPSE_TEMP_FILE_EXISTS);
  return true;
}

function SetUnderGroundSectorFlag(sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8, uiFlagToSet: UINT32): boolean {
  let pTempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

  pTempNode = gpUndergroundSectorInfoHead;

  // loop through and look for the right underground sector
  while (pTempNode) {
    if ((pTempNode.ubSectorX == sSectorX) && (pTempNode.ubSectorY == sSectorY) && (pTempNode.ubSectorZ == ubSectorZ)) {
      // set the flag indicating that ther is a temp item file exists for the sector
      pTempNode.uiFlags |= uiFlagToSet;

      return true;
    }
    pTempNode = pTempNode.next;
  }

  return false;
}

function ReSetUnderGroundSectorFlag(sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8, uiFlagToSet: UINT32): boolean {
  let pTempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

  pTempNode = gpUndergroundSectorInfoHead;

  // loop through and look for the right underground sector
  while (pTempNode) {
    if ((pTempNode.ubSectorX == sSectorX) && (pTempNode.ubSectorY == sSectorY) && (pTempNode.ubSectorZ == ubSectorZ)) {
      // set the flag indicating that ther is a temp item file exists for the sector
      pTempNode.uiFlags &= ~(uiFlagToSet);

      return true;
    }
    pTempNode = pTempNode.next;
  }

  return false;
}

function GetUnderGroundSectorFlagStatus(sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8, uiFlagToCheck: UINT32): boolean {
  let pTempNode: UNDERGROUND_SECTORINFO | null = gpUndergroundSectorInfoHead;

  pTempNode = gpUndergroundSectorInfoHead;

  // loop through and look for the right underground sector
  while (pTempNode) {
    if ((pTempNode.ubSectorX == sSectorX) && (pTempNode.ubSectorY == sSectorY) && (pTempNode.ubSectorZ == ubSectorZ)) {
      // set the flag indicating that ther is a temp item file exists for the sector
      if (pTempNode.uiFlags & uiFlagToCheck)
        return true;
      else
        return false;
    }
    pTempNode = pTempNode.next;
  }
  return false;
}

export function SetSectorFlag(sMapX: INT16, sMapY: INT16, bMapZ: UINT8, uiFlagToSet: UINT32): boolean {
  if (uiFlagToSet == SF_ALREADY_VISITED) {
    // do certain things when particular sectors are visited
    if ((sMapX == TIXA_SECTOR_X) && (sMapY == TIXA_SECTOR_Y)) {
      // Tixa prison (not seen until Tixa visited)
      SectorInfo[Enum123.SEC_J9].uiFacilitiesFlags |= SFCF_PRISON;
    }

    if ((sMapX == GUN_RANGE_X) && (sMapY == GUN_RANGE_Y) && (bMapZ == GUN_RANGE_Z)) {
      // Alma shooting range (not seen until sector visited)
      SectorInfo[Enum123.SEC_H13].uiFacilitiesFlags |= SFCF_GUN_RANGE;
      SectorInfo[Enum123.SEC_H14].uiFacilitiesFlags |= SFCF_GUN_RANGE;
      SectorInfo[Enum123.SEC_I13].uiFacilitiesFlags |= SFCF_GUN_RANGE;
      SectorInfo[Enum123.SEC_I14].uiFacilitiesFlags |= SFCF_GUN_RANGE;
    }

    if (!GetSectorFlagStatus(sMapX, sMapY, bMapZ, SF_ALREADY_VISITED)) {
      // increment daily counter of sectors visited
      gStrategicStatus.ubNumNewSectorsVisitedToday++;
      if (gStrategicStatus.ubNumNewSectorsVisitedToday == NEW_SECTORS_EQUAL_TO_ACTIVITY) {
        // visited enough to count as an active day
        UpdateLastDayOfPlayerActivity(GetWorldDay());
      }
    }
  }

  if (bMapZ == 0)
    SectorInfo[SECTOR(sMapX, sMapY)].uiFlags |= uiFlagToSet;
  else
    SetUnderGroundSectorFlag(sMapX, sMapY, bMapZ, uiFlagToSet);

  return true;
}

export function ReSetSectorFlag(sMapX: INT16, sMapY: INT16, bMapZ: UINT8, uiFlagToSet: UINT32): boolean {
  if (bMapZ == 0)
    SectorInfo[SECTOR(sMapX, sMapY)].uiFlags &= ~(uiFlagToSet);
  else
    ReSetUnderGroundSectorFlag(sMapX, sMapY, bMapZ, uiFlagToSet);

  return true;
}

export function GetSectorFlagStatus(sMapX: INT16, sMapY: INT16, bMapZ: UINT8, uiFlagToSet: UINT32): boolean {
  if (bMapZ == 0)
    return (SectorInfo[SECTOR(sMapX, sMapY)].uiFlags & uiFlagToSet) ? true : false;
  else
    return (GetUnderGroundSectorFlagStatus(sMapX, sMapY, bMapZ, uiFlagToSet)) ? true : false;
}

export function AddDeadSoldierToUnLoadedSector(sMapX: INT16, sMapY: INT16, bMapZ: UINT8, pSoldier: SOLDIERTYPE, sGridNo: INT16, uiFlags: UINT32): boolean {
  let uiNumberOfItems: UINT32;
  let pWorldItems: WORLDITEM[] /* Pointer<WORLDITEM> */ = <WORLDITEM[]><unknown>null;
  let i: UINT32;
  let bCount: UINT8 = 0;
  let uiFlagsForWorldItems: UINT16 = 0;
  let usFlagsForRottingCorpse: UINT16 = 0;
  let Corpse: ROTTING_CORPSE_DEFINITION = createRottingCorpseDefinition();
  let sXPos: INT16;
  let sYPos: INT16;
  let uiDeathAnim: UINT32;
  let uiPossibleDeathAnims: UINT32[] /* [] */ = [
    Enum193.GENERIC_HIT_DEATH,
    Enum193.FALLBACK_HIT_DEATH,
    Enum193.PRONE_HIT_DEATH,
    Enum193.FLYBACK_HIT_DEATH,
  ];
  const ubNumOfDeaths: UINT8 = 4;

  // setup the flags for the items and the rotting corpses
  if (uiFlags & ADD_DEAD_SOLDIER_USE_GRIDNO) {
    uiFlagsForWorldItems = 0;
    usFlagsForRottingCorpse = 0;
  }

  else if (uiFlags & ADD_DEAD_SOLDIER_TO_SWEETSPOT) {
    uiFlagsForWorldItems |= WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO | WORLD_ITEM_REACHABLE;
    usFlagsForRottingCorpse |= ROTTING_CORPSE_FIND_SWEETSPOT_FROM_GRIDNO;
  } else
    AssertMsg(0, "ERROR!!	Flag not is Switch statement");

  //
  // Create an array of objects from the mercs inventory
  //

  // go through and and find out how many items there are
  uiNumberOfItems = 0;
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    if (pSoldier.inv[i].usItem != 0) {
      // if not a player soldier
      if (pSoldier.bTeam != gbPlayerNum) {
        // this percent of the time, they don't drop stuff they would've dropped in tactical...
        if (Random(100) < 75) {
          // mark it undroppable...
          pSoldier.inv[i].fFlags |= OBJECT_UNDROPPABLE;
        }
      }

      // if the item can be dropped
      if (!(pSoldier.inv[i].fFlags & OBJECT_UNDROPPABLE) || pSoldier.bTeam == gbPlayerNum) {
        uiNumberOfItems++;
      }
    }
  }

  // If a robot, don't drop anything...
  if (AM_A_ROBOT(pSoldier)) {
    uiNumberOfItems = 0;
  }

  // if there are items to add
  if (uiNumberOfItems) {
    // allocate memory for the world item array
    pWorldItems = createArrayFrom(uiNumberOfItems, createWorldItem);

    // loop through all the soldiers items and add them to the world item array
    bCount = 0;
    for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
      if (pSoldier.inv[i].usItem != 0) {
        // if the item can be dropped
        if (!(pSoldier.inv[i].fFlags & OBJECT_UNDROPPABLE) || pSoldier.bTeam == gbPlayerNum) {
          ReduceAmmoDroppedByNonPlayerSoldiers(pSoldier, i);

          pWorldItems[bCount].fExists = true;
          pWorldItems[bCount].sGridNo = sGridNo;
          pWorldItems[bCount].ubLevel = pSoldier.bLevel;
          pWorldItems[bCount].usFlags = uiFlagsForWorldItems;
          pWorldItems[bCount].bVisible = 1;
          pWorldItems[bCount].bRenderZHeightAboveLevel = 0;

          copyObjectType(pWorldItems[bCount].o, pSoldier.inv[i]);
          bCount++;
        }
      }
    }

    // Add the soldiers items to an unloaded sector
    AddWorldItemsToUnLoadedSector(sMapX, sMapY, bMapZ, sGridNo, uiNumberOfItems, pWorldItems, false);
  }

  DropKeysInKeyRing(pSoldier, sGridNo, pSoldier.bLevel, 1, false, 0, true);

  //
  // Convert the soldier into a rottng corpse
  //

  // Setup some values!
  Corpse.ubBodyType = pSoldier.ubBodyType;
  Corpse.sGridNo = sGridNo;

  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo));

  Corpse.dXPos = (CenterX(sXPos));
  Corpse.dYPos = (CenterY(sYPos));
  Corpse.sHeightAdjustment = pSoldier.sHeightAdjustment;
  Corpse.bVisible = 1;

  Corpse.HeadPal = SET_PALETTEREP_ID(pSoldier.HeadPal);
  Corpse.VestPal = SET_PALETTEREP_ID(pSoldier.VestPal);
  Corpse.SkinPal = SET_PALETTEREP_ID(pSoldier.SkinPal);
  Corpse.PantsPal = SET_PALETTEREP_ID(pSoldier.PantsPal);

  Corpse.bDirection = pSoldier.bDirection;

  // Set time of death
  Corpse.uiTimeOfDeath = GetWorldTotalMin();

  // if the dead body shot be the result of a Jfk headshot, set it
  if (uiFlags & ADD_DEAD_SOLDIER__USE_JFK_HEADSHOT_CORPSE)
    uiDeathAnim = Enum193.JFK_HITDEATH;

  // else chose a random death sequence
  else
    uiDeathAnim = uiPossibleDeathAnims[Random(4)];

  // Set type
  Corpse.ubType = gubAnimSurfaceCorpseID[pSoldier.ubBodyType][uiDeathAnim];

  Corpse.usFlags |= usFlagsForRottingCorpse;

  // Add the rotting corpse info to the sectors unloaded rotting corpse file
  AddRottingCorpseToUnloadedSectorsRottingCorpseFile(sMapX, sMapY, bMapZ, Corpse);

  return true;
}

export function SaveTempNpcQuoteArrayToSaveGameFile(hFile: HWFILE): boolean {
  return SaveFilesToSavedGame(NPC_TEMP_QUOTE_FILE, hFile);
}

export function LoadTempNpcQuoteArrayToSaveGameFile(hFile: HWFILE): boolean {
  return LoadFilesFromSavedGame(NPC_TEMP_QUOTE_FILE, hFile);
}

function TempFileLoadErrorMessageReturnCallback(ubRetVal: UINT8): void {
  gfProgramIsRunning = false;
}

// if you call this function, make sure you return TRUE (if applicable) to make the game
// think it succeeded the load.  This sets up the dialog for the game exit, after the hacker
// message appears.
export function InitExitGameDialogBecauseFileHackDetected(): void {
  let CenteringRect: SGPRect = createSGPRectFrom(0, 0, 639, 479);

  // do message box and return
  giErrorMessageBox = DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pAntiHackerString[Enum332.ANTIHACKERSTR_EXITGAME], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, TempFileLoadErrorMessageReturnCallback, CenteringRect);
}

export function MercChecksum(pSoldier: SOLDIERTYPE): UINT32 {
  let uiChecksum: UINT32 = 1;
  let uiLoop: UINT32;

  uiChecksum += (pSoldier.bLife + 1);
  uiChecksum *= (pSoldier.bLifeMax + 1);
  uiChecksum += (pSoldier.bAgility + 1);
  uiChecksum *= (pSoldier.bDexterity + 1);
  uiChecksum += (pSoldier.bStrength + 1);
  uiChecksum *= (pSoldier.bMarksmanship + 1);
  uiChecksum += (pSoldier.bMedical + 1);
  uiChecksum *= (pSoldier.bMechanical + 1);
  uiChecksum += (pSoldier.bExplosive + 1);

  // put in some multipliers too!
  uiChecksum *= (pSoldier.bExpLevel + 1);
  uiChecksum += (pSoldier.ubProfile + 1);

  for (uiLoop = 0; uiLoop < Enum261.NUM_INV_SLOTS; uiLoop++) {
    uiChecksum += pSoldier.inv[uiLoop].usItem;
    uiChecksum += pSoldier.inv[uiLoop].ubNumberOfObjects;
  }

  uiChecksum %= 2 ** 32;

  return uiChecksum;
}

export function ProfileChecksum(pProfile: MERCPROFILESTRUCT): UINT32 {
  let uiChecksum: UINT32 = 1;
  let uiLoop: UINT32;

  uiChecksum += (pProfile.bLife + 1);
  uiChecksum *= (pProfile.bLifeMax + 1);
  uiChecksum += (pProfile.bAgility + 1);
  uiChecksum *= (pProfile.bDexterity + 1);
  uiChecksum += (pProfile.bStrength + 1);
  uiChecksum *= (pProfile.bMarksmanship + 1);
  uiChecksum += (pProfile.bMedical + 1);
  uiChecksum *= (pProfile.bMechanical + 1);
  uiChecksum += (pProfile.bExplosive + 1);

  // put in some multipliers too!
  uiChecksum *= (pProfile.bExpLevel + 1);

  for (uiLoop = 0; uiLoop < Enum261.NUM_INV_SLOTS; uiLoop++) {
    uiChecksum += pProfile.inv[uiLoop];
    uiChecksum += pProfile.bInvNumber[uiLoop];
  }

  uiChecksum %= 2 ** 32;

  return uiChecksum;
}

// UINT8 gubEncryptionArray4[ BASE_NUMBER_OF_ROTATION_ARRAYS * 3 ][ NEW_ROTATION_ARRAY_SIZE ] =
function GetRotationArray(): UINT8[] {
  // based on guiJA2EncryptionSet
  if (guiJA2EncryptionSet < BASE_NUMBER_OF_ROTATION_ARRAYS * 6) {
    if (guiJA2EncryptionSet < BASE_NUMBER_OF_ROTATION_ARRAYS * 3) {
      return gubEncryptionArray1[guiJA2EncryptionSet % (BASE_NUMBER_OF_ROTATION_ARRAYS * 3)];
    } else {
      return gubEncryptionArray2[guiJA2EncryptionSet % (BASE_NUMBER_OF_ROTATION_ARRAYS * 3)];
    }
  } else {
    if (guiJA2EncryptionSet < BASE_NUMBER_OF_ROTATION_ARRAYS * 9) {
      return gubEncryptionArray3[guiJA2EncryptionSet % (BASE_NUMBER_OF_ROTATION_ARRAYS * 3)];
    } else {
      return gubEncryptionArray4[guiJA2EncryptionSet % (BASE_NUMBER_OF_ROTATION_ARRAYS * 3)];
    }
  }
}

export function NewJA2EncryptedFileRead(hFile: HWFILE, pDest: Buffer, uiBytesToRead: UINT32): UINT32 {
  let uiBytesRead: UINT32;

  let uiLoop: UINT32;
  let ubArrayIndex: UINT8 = 0;
  let ubLastByte: UINT8 = 0;
  let ubLastByteForNextLoop: UINT8;
  let fRet: boolean;
  let pMemBlock: Buffer;
  let pubRotationArray: UINT8[];

  pubRotationArray = GetRotationArray();

  fRet = ((uiBytesRead = FileRead(hFile, pDest, uiBytesToRead)) !== -1);
  if (fRet) {
    pMemBlock = pDest;
    for (uiLoop = 0; uiLoop < uiBytesRead; uiLoop++) {
      ubLastByteForNextLoop = pMemBlock[uiLoop];
      pMemBlock[uiLoop] -= (ubLastByte + pubRotationArray[ubArrayIndex]);
      ubArrayIndex++;
      if (ubArrayIndex >= NEW_ROTATION_ARRAY_SIZE) {
        ubArrayIndex = 0;
      }
      ubLastByte = ubLastByteForNextLoop;
    }
  }

  return uiBytesRead;
}

export function NewJA2EncryptedFileWrite(hFile: HWFILE, pDest: Buffer, uiBytesToWrite: UINT32): UINT32 {
  let uiBytesWritten: UINT32;

  let uiLoop: UINT32;
  let ubArrayIndex: UINT8 = 0;
  let ubLastByte: UINT8 = 0; //, ubTemp;
  let pMemBlock: Buffer;
  let fRet: boolean;
  let pubRotationArray: UINT8[];

  pMemBlock = Buffer.allocUnsafe(uiBytesToWrite);

  pubRotationArray = GetRotationArray();

  pDest.copy(pMemBlock);
  for (uiLoop = 0; uiLoop < uiBytesToWrite; uiLoop++) {
    pMemBlock[uiLoop] += ubLastByte + pubRotationArray[ubArrayIndex];
    ubArrayIndex++;
    if (ubArrayIndex >= NEW_ROTATION_ARRAY_SIZE) {
      ubArrayIndex = 0;
    }
    ubLastByte = pMemBlock[uiLoop];
  }

  fRet = ((uiBytesWritten = FileWrite(hFile, pMemBlock, uiBytesToWrite)) !== -1);

  return uiBytesWritten;
}

const ROTATION_ARRAY_SIZE = 46;
let ubRotationArray: UINT8[] /* [46] */ = [
  132,
  235,
  125,
  99,
  15,
  220,
  140,
  89,
  205,
  132,
  254,
  144,
  217,
  78,
  156,
  58,
  215,
  76,
  163,
  187,
  55,
  49,
  65,
  48,
  156,
  140,
  201,
  68,
  184,
  13,
  45,
  69,
  102,
  185,
  122,
  225,
  23,
  250,
  160,
  220,
  114,
  240,
  64,
  175,
  57,
  233,
];

export function JA2EncryptedFileRead(hFile: HWFILE, pDest: Buffer, uiBytesToRead: UINT32): UINT32 {
  let uiBytesRead: UINT32;

  let uiLoop: UINT32;
  let ubArrayIndex: UINT8 = 0;
  // UINT8		ubLastNonBlank = 0;
  let ubLastByte: UINT8 = 0;
  let ubLastByteForNextLoop: UINT8;
  let fRet: boolean;
  let pMemBlock: Buffer;

  fRet = ((uiBytesRead = FileRead(hFile, pDest, uiBytesToRead)) !== -1);
  if (fRet) {
    pMemBlock = pDest;
    for (uiLoop = 0; uiLoop < uiBytesRead; uiLoop++) {
      ubLastByteForNextLoop = pMemBlock[uiLoop];
      pMemBlock[uiLoop] -= (ubLastByte + ubRotationArray[ubArrayIndex]);
      ubArrayIndex++;
      if (ubArrayIndex >= ROTATION_ARRAY_SIZE) {
        ubArrayIndex = 0;
      }
      ubLastByte = ubLastByteForNextLoop;
    }
  }

  return uiBytesRead;
}

export function JA2EncryptedFileWrite(hFile: HWFILE, pDest: Buffer, uiBytesToWrite: UINT32): UINT32 {
  let uiBytesWritten: UINT32;

  let uiLoop: UINT32;
  let ubArrayIndex: UINT8 = 0;
  // UINT8		ubLastNonBlank = 0;
  let ubLastByte: UINT8 = 0; //, ubTemp;
  let pMemBlock: Buffer;
  let fRet: boolean;

  pMemBlock = Buffer.allocUnsafe(uiBytesToWrite);

  pDest.copy(pMemBlock);
  for (uiLoop = 0; uiLoop < uiBytesToWrite; uiLoop++) {
    // ubTemp = pMemBlock[ uiLoop ];
    pMemBlock[uiLoop] += ubLastByte + ubRotationArray[ubArrayIndex];
    ubArrayIndex++;
    if (ubArrayIndex >= ROTATION_ARRAY_SIZE) {
      ubArrayIndex = 0;
    }
    ubLastByte = pMemBlock[uiLoop];
    /*
    if ( pMemBlock[ uiLoop ] )
    {
            // store last non blank
            ubLastNonBlank = pMemBlock[ uiLoop ];

            pMemBlock[ uiLoop ] += ubRotationArray[ ubArrayIndex ];
            ubArrayIndex++;
            if ( ubArrayIndex >= ROTATION_ARRAY_SIZE )
            {
                    ubArrayIndex = 0;
            }
    }
    else // zero byte
    {
            pMemBlock[ uiLoop ] = ubLastNonBlank + ubRotationArray[ ubArrayIndex ];
            ubArrayIndex++;
            if ( ubArrayIndex >= ROTATION_ARRAY_SIZE )
            {
                    ubArrayIndex = 0;
            }
    }
    */
  }

  fRet = (uiBytesWritten = FileWrite(hFile, pMemBlock, uiBytesToWrite)) !== -1;

  return uiBytesWritten;
}

export function GetMapTempFileName(uiType: UINT32, sMapX: INT16, sMapY: INT16, bMapZ: INT8): string {
  let pMapName: string;

  let zTempName: string /* CHAR[512] */;

  // Convert the current sector location into a file name
  zTempName = GetMapFileName(sMapX, sMapY, bMapZ, false, false);

  switch (uiType) {
    case SF_ITEM_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "i_" + zTempName);
      break;

    case SF_ROTTING_CORPSE_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "r_" + zTempName);
      break;

    case SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "m_" + zTempName);
      break;

    case SF_DOOR_TABLE_TEMP_FILES_EXISTS:
      pMapName = path.join(MAPS_DIR, "d_" + zTempName);
      break;

    case SF_REVEALED_STATUS_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "v_" + zTempName);
      break;

    case SF_DOOR_STATUS_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "ds_" + zTempName);
      break;

    case SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "e_" + zTempName);
      break;

    case SF_CIV_PRESERVED_TEMP_FILE_EXISTS:
      // NB save game version 0 is "saving game"
      if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME) && guiSaveGameVersion != 0 && guiSaveGameVersion < 78) {
        pMapName = path.join(MAPS_DIR, "c_" + zTempName);
      } else {
        pMapName = path.join(MAPS_DIR, "cc_" + zTempName);
      }
      break;

    case SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "sm_" + zTempName);
      break;

    case SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS:
      pMapName = path.join(MAPS_DIR, "l_" + zTempName);
      break;

    default:
      Assert(false);
      break;
  }

  return pMapName;
}

export function GetNumberOfVisibleWorldItemsFromSectorStructureForSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8): UINT32 {
  let uiNumberOfItems: UINT32 = 0;
  let pSector: UNDERGROUND_SECTORINFO | null = null;

  // if the sector is above ground
  if (bMapZ == 0) {
    uiNumberOfItems = SectorInfo[SECTOR(sMapX, sMapY)].uiNumberOfWorldItemsInTempFileThatCanBeSeenByPlayer;
  } else {
    // find the underground sector
    pSector = FindUnderGroundSector(sMapX, sMapY, bMapZ);
    if (pSector != null) {
      // get the number of items
      uiNumberOfItems = pSector.uiNumberOfWorldItemsInTempFileThatCanBeSeenByPlayer;
    }
  }

  // if there is a sector loaded
  if (gfWorldLoaded) {
    // and it is the sector we are interested in
    if (sMapX == gWorldSectorX && sMapY == gWorldSectorY && bMapZ == gbWorldSectorZ) {
      // since items might have been added, update
      uiNumberOfItems = UpdateLoadedSectorsItemInventory(sMapX, sMapY, bMapZ, uiNumberOfItems);
    }
  }

  return uiNumberOfItems;
}

export function SetNumberOfVisibleWorldItemsInSectorStructureForSector(sMapX: INT16, sMapY: INT16, bMapZ: INT8, uiNumberOfItems: UINT32): void {
  let pSector: UNDERGROUND_SECTORINFO | null = null;

  // if the sector is above ground
  if (bMapZ == 0) {
    SectorInfo[SECTOR(sMapX, sMapY)].uiNumberOfWorldItemsInTempFileThatCanBeSeenByPlayer = uiNumberOfItems;
  } else {
    // find the underground sector
    pSector = FindUnderGroundSector(sMapX, sMapY, bMapZ);
    if (pSector != null) {
      // get the number of items
      pSector.uiNumberOfWorldItemsInTempFileThatCanBeSeenByPlayer = uiNumberOfItems;
    }
  }
}

function SynchronizeItemTempFileVisbleItemsToSectorInfoVisbleItems(sMapX: INT16, sMapY: INT16, bMapZ: INT8, fLoadingGame: boolean): void {
  let uiTotalNumberOfItems: UINT32 = 0;
  let uiTotalNumberOfRealItems: UINT32 = 0;
  let pTotalSectorList: WORLDITEM[] /* Pointer<WORLDITEM> */ = <WORLDITEM[]><unknown>null;
  let uiItemCount: UINT32 = 0;
  let iCounter: INT32 = 0;
  let fReturn: boolean;

  // get total number, visable and invisible
  fReturn = ((uiTotalNumberOfRealItems = GetNumberOfActiveWorldItemsFromTempFile(sMapX, sMapY, bMapZ)) !== -1);
  Assert(fReturn);

  fReturn = (uiTotalNumberOfItems = GetNumberOfWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, false)) !== -1;
  Assert(fReturn);

  if (uiTotalNumberOfItems > 0) {
    // allocate space for the list
    pTotalSectorList = createArrayFrom(uiTotalNumberOfItems, createWorldItem);

    // now load into mem
    LoadWorldItemsFromTempItemFile(sMapX, sMapY, bMapZ, pTotalSectorList);
  }

  // now run through list and
  for (iCounter = 0; (iCounter) < uiTotalNumberOfRealItems; iCounter++) {
    // if visible to player, then state fact
    if (IsMapScreenWorldItemVisibleInMapInventory(pTotalSectorList[iCounter])) {
      uiItemCount += pTotalSectorList[iCounter].o.ubNumberOfObjects;
    }
  }

  // record the number of items
  SetNumberOfVisibleWorldItemsInSectorStructureForSector(sMapX, sMapY, bMapZ, uiItemCount);
}

function UpdateLoadedSectorsItemInventory(sMapX: INT16, sMapY: INT16, bMapZ: INT8, uiNumberOfItems: UINT32): UINT32 {
  let uiCounter: UINT32;
  let uiItemCounter: UINT32 = 0;

  if (!gfWorldLoaded)
    return 0;

  // loop through all the world items
  for (uiCounter = 0; uiCounter < guiNumWorldItems; uiCounter++) {
    // if the item CAN be visible in mapscreen sector inventory
    if (IsMapScreenWorldItemVisibleInMapInventory(gWorldItems[uiCounter])) {
      // increment
      uiItemCounter += gWorldItems[uiCounter].o.ubNumberOfObjects;
    }
  }

  // if the item count is DIFFERENT
  if (uiItemCounter != uiNumberOfItems) {
    // Update the value in the sector info struct
    SetNumberOfVisibleWorldItemsInSectorStructureForSector(sMapX, sMapY, bMapZ, uiItemCounter);
  }

  // return the number of items
  return uiItemCounter;
}

}
