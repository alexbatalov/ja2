namespace ja2 {

export function LoadEncryptedDataFromFile(pFileName: string /* STR */, uiSeekFrom: UINT32, uiSeekAmount: UINT32): string {
  let hFile: HWFILE;
  let i: UINT16;
  let uiBytesRead: UINT32;
  let buffer: Buffer;

  hFile = FileOpen(pFileName, FILE_ACCESS_READ, false);
  if (!hFile) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "LoadEncryptedDataFromFile: Failed to FileOpen");
    return <string><unknown>null;
  }

  if (FileSeek(hFile, uiSeekFrom, FILE_SEEK_FROM_START) == false) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "LoadEncryptedDataFromFile: Failed FileSeek");
    return <string><unknown>null;
  }

  buffer = Buffer.allocUnsafe(uiSeekAmount);
  if ((uiBytesRead = FileRead(hFile, buffer, uiSeekAmount)) === -1) {
    FileClose(hFile);
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "LoadEncryptedDataFromFile: Failed FileRead");
    return <string><unknown>null;
  }

  // Decrement, by 1, any value > 32
  for (i = 0; (i < uiSeekAmount) && (buffer.readUInt16LE(i) != 0); i += 2) {
    if (buffer.readUInt16LE(i) > 33)
      buffer.writeUInt16LE(buffer.readUInt16LE(i) - 1, i);
// FIXME: Language-specific code
// #ifdef POLISH
//     switch (pDestString[i]) {
//       case 260:
//         pDestString[i] = 165;
//         break;
//       case 262:
//         pDestString[i] = 198;
//         break;
//       case 280:
//         pDestString[i] = 202;
//         break;
//       case 321:
//         pDestString[i] = 163;
//         break;
//       case 323:
//         pDestString[i] = 209;
//         break;
//       case 211:
//         pDestString[i] = 211;
//         break;
//
//       case 346:
//         pDestString[i] = 338;
//         break;
//       case 379:
//         pDestString[i] = 175;
//         break;
//       case 377:
//         pDestString[i] = 143;
//         break;
//       case 261:
//         pDestString[i] = 185;
//         break;
//       case 263:
//         pDestString[i] = 230;
//         break;
//       case 281:
//         pDestString[i] = 234;
//         break;
//
//       case 322:
//         pDestString[i] = 179;
//         break;
//       case 324:
//         pDestString[i] = 241;
//         break;
//       case 243:
//         pDestString[i] = 243;
//         break;
//       case 347:
//         pDestString[i] = 339;
//         break;
//       case 380:
//         pDestString[i] = 191;
//         break;
//       case 378:
//         pDestString[i] = 376;
//         break;
//     }
// #endif
  }

  FileClose(hFile);
  return readStringNL(buffer, 'utf16le', 0, buffer.length);
}

}
