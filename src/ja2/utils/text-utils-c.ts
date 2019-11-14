namespace ja2 {

export type ItemInfo = { name: string, info: string };

export function LoadItemInfo(ubIndex: UINT16): ItemInfo {
  let pNameString: string;
  let pInfoString: string;

  let hFile: HWFILE;
  let uiBytesRead: UINT32;
  let i: UINT16;
  let uiStartSeekAmount: UINT32;
  let buffer: Buffer;

  hFile = FileOpen(ITEMSTRINGFILENAME, FILE_ACCESS_READ, false);
  if (!hFile) {
    return <ItemInfo><unknown>undefined;
  }

  // Get current mercs bio info
  uiStartSeekAmount = ((SIZE_SHORT_ITEM_NAME + SIZE_ITEM_NAME + SIZE_ITEM_INFO) * ubIndex);

  // Skip short names
  uiStartSeekAmount += SIZE_SHORT_ITEM_NAME;

  if (FileSeek(hFile, uiStartSeekAmount, FILE_SEEK_FROM_START) == false) {
    FileClose(hFile);
    return <ItemInfo><unknown>undefined;
  }

  buffer = Buffer.allocUnsafe(SIZE_ITEM_NAME);
  if ((uiBytesRead = FileRead(hFile, buffer, SIZE_ITEM_NAME)) === -1) {
    FileClose(hFile);
    return <ItemInfo><unknown>undefined;
  }

  // Decrement, by 1, any value > 32
  for (i = 0; (i < SIZE_ITEM_NAME) && (buffer.readUInt16LE(i) != 0); i += 2) {
    if (buffer.readUInt16LE(i) > 33)
      buffer.writeUInt16LE(buffer.readUInt16LE(i) - 1, i);
// FIXME: Language-specific code
// #ifdef POLISH
//     switch (pNameString[i]) {
//       case 260:
//         pNameString[i] = 165;
//         break;
//       case 262:
//         pNameString[i] = 198;
//         break;
//       case 280:
//         pNameString[i] = 202;
//         break;
//       case 321:
//         pNameString[i] = 163;
//         break;
//       case 323:
//         pNameString[i] = 209;
//         break;
//       case 211:
//         pNameString[i] = 211;
//         break;
//
//       case 346:
//         pNameString[i] = 338;
//         break;
//       case 379:
//         pNameString[i] = 175;
//         break;
//       case 377:
//         pNameString[i] = 143;
//         break;
//       case 261:
//         pNameString[i] = 185;
//         break;
//       case 263:
//         pNameString[i] = 230;
//         break;
//       case 281:
//         pNameString[i] = 234;
//         break;
//
//       case 322:
//         pNameString[i] = 179;
//         break;
//       case 324:
//         pNameString[i] = 241;
//         break;
//       case 243:
//         pNameString[i] = 243;
//         break;
//       case 347:
//         pNameString[i] = 339;
//         break;
//       case 380:
//         pNameString[i] = 191;
//         break;
//       case 378:
//         pNameString[i] = 376;
//         break;
//     }
// #endif
  }

  pNameString = readStringNL(buffer, 'utf16le', 0, buffer.length);

  // Get the additional info
  uiStartSeekAmount = ((SIZE_ITEM_NAME + SIZE_SHORT_ITEM_NAME + SIZE_ITEM_INFO) * ubIndex) + SIZE_ITEM_NAME + SIZE_SHORT_ITEM_NAME;
  if (FileSeek(hFile, uiStartSeekAmount, FILE_SEEK_FROM_START) == false) {
    FileClose(hFile);
    return <ItemInfo><unknown>undefined;
  }

  buffer = Buffer.allocUnsafe(SIZE_ITEM_INFO);
  if ((uiBytesRead = FileRead(hFile, buffer, SIZE_ITEM_INFO)) === -1) {
    FileClose(hFile);
    return <ItemInfo><unknown>undefined;
  }

  // Decrement, by 1, any value > 32
  for (i = 0; (i < SIZE_ITEM_INFO) && (buffer.readUInt16LE(i) != 0); i += 2) {
    if (buffer.readUInt16LE(i) > 33)
      buffer.writeUInt16LE(buffer.readUInt16LE(i) - 1, i);
// FIXME: Language-specific code
// #ifdef POLISH
//       switch (pInfoString[i]) {
//         case 260:
//           pInfoString[i] = 165;
//           break;
//         case 262:
//           pInfoString[i] = 198;
//           break;
//         case 280:
//           pInfoString[i] = 202;
//           break;
//         case 321:
//           pInfoString[i] = 163;
//           break;
//         case 323:
//           pInfoString[i] = 209;
//           break;
//         case 211:
//           pInfoString[i] = 211;
//           break;
//
//         case 346:
//           pInfoString[i] = 338;
//           break;
//         case 379:
//           pInfoString[i] = 175;
//           break;
//         case 377:
//           pInfoString[i] = 143;
//           break;
//         case 261:
//           pInfoString[i] = 185;
//           break;
//         case 263:
//           pInfoString[i] = 230;
//           break;
//         case 281:
//           pInfoString[i] = 234;
//           break;
//
//         case 322:
//           pInfoString[i] = 179;
//           break;
//         case 324:
//           pInfoString[i] = 241;
//           break;
//         case 243:
//           pInfoString[i] = 243;
//           break;
//         case 347:
//           pInfoString[i] = 339;
//           break;
//         case 380:
//           pInfoString[i] = 191;
//           break;
//         case 378:
//           pInfoString[i] = 376;
//           break;
//       }
// #endif
  }

  pInfoString = readStringNL(buffer, 'utf16le', 0, buffer.length);

  FileClose(hFile);
  return { name: pNameString, info: pInfoString };
}

export function LoadShortNameItemInfo(ubIndex: UINT16): string {
  let pNameString: string

  let hFile: HWFILE;
  //  wchar_t		DestString[ SIZE_MERC_BIO_INFO ];
  let uiBytesRead: UINT32;
  let i: UINT16;
  let uiStartSeekAmount: UINT32;
  let buffer: Buffer;

  hFile = FileOpen(ITEMSTRINGFILENAME, FILE_ACCESS_READ, false);
  if (!hFile) {
    return <string><unknown>undefined;
  }

  // Get current mercs bio info
  uiStartSeekAmount = ((SIZE_SHORT_ITEM_NAME + SIZE_ITEM_NAME + SIZE_ITEM_INFO) * ubIndex);

  if (FileSeek(hFile, uiStartSeekAmount, FILE_SEEK_FROM_START) == false) {
    FileClose(hFile);
    return <string><unknown>undefined;
  }

  buffer = Buffer.allocUnsafe(SIZE_ITEM_NAME);
  if ((uiBytesRead = FileRead(hFile, buffer, SIZE_ITEM_NAME)) === -1) {
    FileClose(hFile);
    return <string><unknown>undefined;
  }

  // Decrement, by 1, any value > 32
  for (i = 0; (i < SIZE_ITEM_NAME) && (buffer.readUInt16LE(i) != 0); i += 2) {
    if (buffer.readUInt16LE(i) > 33)
      buffer.writeUInt16LE(buffer.readUInt16LE(i) - 1, i);
// FIXME: Language-specific code
// #ifdef POLISH
//     switch (pNameString[i]) {
//       case 260:
//         pNameString[i] = 165;
//         break;
//       case 262:
//         pNameString[i] = 198;
//         break;
//       case 280:
//         pNameString[i] = 202;
//         break;
//       case 321:
//         pNameString[i] = 163;
//         break;
//       case 323:
//         pNameString[i] = 209;
//         break;
//       case 211:
//         pNameString[i] = 211;
//         break;
//
//       case 346:
//         pNameString[i] = 338;
//         break;
//       case 379:
//         pNameString[i] = 175;
//         break;
//       case 377:
//         pNameString[i] = 143;
//         break;
//       case 261:
//         pNameString[i] = 185;
//         break;
//       case 263:
//         pNameString[i] = 230;
//         break;
//       case 281:
//         pNameString[i] = 234;
//         break;
//
//       case 322:
//         pNameString[i] = 179;
//         break;
//       case 324:
//         pNameString[i] = 241;
//         break;
//       case 243:
//         pNameString[i] = 243;
//         break;
//       case 347:
//         pNameString[i] = 339;
//         break;
//       case 380:
//         pNameString[i] = 191;
//         break;
//       case 378:
//         pNameString[i] = 376;
//         break;
//     }
// #endif
  }

  pNameString = readStringNL(buffer, 'utf16le', 0, uiBytesRead);

  FileClose(hFile);
  return pNameString;
}

function LoadAllItemNames(): void {
  let usLoop: UINT16;

  for (usLoop = 0; usLoop < Enum225.MAXITEMS; usLoop++) {
    ({ name: ItemNames[usLoop] } = LoadItemInfo(usLoop));

    // Load short item info
    ShortItemNames[usLoop] = LoadShortNameItemInfo(usLoop);
  }
}

export function LoadAllExternalText(): void {
  LoadAllItemNames();
}

export function GetWeightUnitString(): string /* Pointer<INT16> */ {
  if (gGameSettings.fOptions[Enum8.TOPTION_USE_METRIC_SYSTEM]) // metric
  {
    return pMessageStrings[Enum333.MSG_KILOGRAM_ABBREVIATION];
  } else {
    return pMessageStrings[Enum333.MSG_POUND_ABBREVIATION];
  }
}

export function GetWeightBasedOnMetricOption(uiObjectWeight: UINT32): FLOAT {
  let fWeight: FLOAT = 0.0;

  // if the user is smart and wants things displayed in 'metric'
  if (gGameSettings.fOptions[Enum8.TOPTION_USE_METRIC_SYSTEM]) // metric
  {
    fWeight = uiObjectWeight;
  }

  // else the user is a caveman and display it in pounds
  else {
    fWeight = uiObjectWeight * 2.2;
  }

  return fWeight;
}

}
