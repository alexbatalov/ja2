namespace ja2 {

const QUEST_DEBUG_FILE = "QuestDebug.txt";

// enums used for the current output level flags
const enum Enum298 {
  QD_OUTPUT_NONE, // no output
  QD_OUTPUT_LEVEL_1, // Highest level
  QD_OUTPUT_LEVEL_2,
  QD_OUTPUT_LEVEL_3,
  QD_OUTPUT_LEVEL_4,
  QD_OUTPUT_LEVEL_ALL, // any message
}

// Mode and priority for the Quest Debug Messages
let gubQuestDebugOutPutLevel: UINT8 = Enum298.QD_OUTPUT_LEVEL_ALL;

// Mode and priority for the NPC interaction Debug Messages
let gubNPCDebugOutPutLevel: UINT8 = Enum298.QD_OUTPUT_LEVEL_ALL;

// set the current output mode for either the NPC or the quest output
export function ToggleQuestDebugModes(ubType: UINT8): void {
  let sType: string /* wchar_t[16] */;
  let ubLevel: UINT8;

  if (ubType == Enum299.QD_NPC_MSG) {
    sType = "NPC Debug:";

    // check to see if its out of range
    if (gubNPCDebugOutPutLevel <= Enum298.QD_OUTPUT_NONE + 1)
      gubNPCDebugOutPutLevel = Enum298.QD_OUTPUT_LEVEL_ALL;
    else {
      // decrement
      gubNPCDebugOutPutLevel--;
    }

    ubLevel = gubNPCDebugOutPutLevel;
  } else {
    sType = "QUEST Debug:";

    // check to see if its out of range
    if (gubQuestDebugOutPutLevel <= Enum298.QD_OUTPUT_NONE)
      gubQuestDebugOutPutLevel = Enum298.QD_OUTPUT_LEVEL_ALL;
    else {
      // decrement
      gubQuestDebugOutPutLevel--;
    }

    ubLevel = gubQuestDebugOutPutLevel;
  }

  // Display a messasge to the screen
  if (ubLevel == Enum298.QD_OUTPUT_NONE)
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "%s No Output", sType);
  else if (ubLevel == Enum298.QD_OUTPUT_LEVEL_ALL)
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "%s All messages", sType);
  else
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "%s Level %d", sType, ubLevel);
}

/* static */ let QuestDebugFileMsg__fFirstTimeIn: boolean = true;
/* static */ let QuestDebugFileMsg__uiLineNumber: UINT32 = 1;
function QuestDebugFileMsg(ubQuoteType: UINT8, ubPriority: UINT8, pStringA: string /* STR */, ...args: any[]): void {
  let hFile: HWFILE;
  let uiByteWritten: UINT32;
  let TempString: string /* char[1024] */;
  let DestString: string /* char[1024] */;
  let buffer: Buffer;

  TempString = '';
  DestString = '';

  TempString = sprintf(pStringA, ...args); // process gprintf string (get output str)

  //
  // determine if we should display the message
  //

  // if its a quest message
  if (ubQuoteType == Enum299.QD_QUEST_MSG) {
    // if the message is a lower priority then the current output mode, dont display it
    if (ubPriority > gubQuestDebugOutPutLevel)
      return;
  } else {
    // if the message is a lower priority then the current output mode, dont display it
    if (ubPriority > gubNPCDebugOutPutLevel)
      return;
  }

  // if its the first time in the game
  if (QuestDebugFileMsg__fFirstTimeIn) {
    // open a new file for writing

    // if the file exists
    if (FileExists(QUEST_DEBUG_FILE)) {
      // delete the file
      if (!FileDelete(QUEST_DEBUG_FILE)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to delete %s file", QUEST_DEBUG_FILE));
        return;
      }
    }
    QuestDebugFileMsg__fFirstTimeIn = false;
  }

  // open the file
  hFile = FileOpen(QUEST_DEBUG_FILE, FILE_ACCESS_WRITE, false);
  if (!hFile) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to open Quest Debug File %s", QUEST_DEBUG_FILE));
    return;
  }

  DestString = sprintf("#%s. P%d:\n\t%s\n\n", QuestDebugFileMsg__uiLineNumber.toString().padStart(5), ubPriority, TempString);

  // open the file and append to it
  buffer = Buffer.allocUnsafe(DestString.length);
  writeStringNL(DestString, buffer, 0, DestString.length, 'ascii');
  if ((uiByteWritten = FileWrite(hFile, buffer, DestString.length)) === -1) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to write to %s", QUEST_DEBUG_FILE));
    return;
  }

  // increment the line number
  QuestDebugFileMsg__uiLineNumber++;
}

}
