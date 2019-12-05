namespace ja2 {

export let gTileSurfaceArray: TILE_IMAGERY[] /* Pointer<TILE_IMAGERY>[NUMBEROFTILETYPES] */;
export let gbDefaultSurfaceUsed: boolean[] /* UINT8[NUMBEROFTILETYPES] */ = createArray(Enum313.NUMBEROFTILETYPES, false);
export let gbSameAsDefaultSurfaceUsed: boolean[] /* UINT8[NUMBEROFTILETYPES] */ = createArray(Enum313.NUMBEROFTILETYPES, false);

export function LoadTileSurface(cFilename: string /* Pointer<char> */): TILE_IMAGERY | null {
  // Add tile surface
  let pTileSurf: TILE_IMAGERY;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let hVObject: SGPVObject;
  let hImage: ImageType;
  let cStructureFilename: string /* SGPFILENAME */;
  let cEndOfName: number /* STR */;
  let pStructureFileRef: STRUCTURE_FILE_REF | null;
  let fOk: boolean;

  hImage = CreateImage(cFilename, IMAGE_ALLDATA);
  if (hImage == null) {
    // Report error
    SET_ERROR("Could not load tile file: %s", cFilename);
    return null;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMHIMAGE;
  VObjectDesc.hImage = hImage;

  hVObject = CreateVideoObject(VObjectDesc);

  if (hVObject == null) {
    // Report error
    SET_ERROR("Could not load tile file: %s", cFilename);
    // Video Object will set error conition.]
    DestroyImage(hImage);
    return null;
  }

  // Load structure data, if any.
  // Start by hacking the image filename into that for the structure data
  cStructureFilename = cFilename;
  cEndOfName = cStructureFilename.indexOf('.');
  if (cEndOfName != -1) {
    cEndOfName++;
    cStructureFilename = cStructureFilename.substring(0, cEndOfName);
  } else {
    cStructureFilename += ".";
  }
  cStructureFilename += STRUCTURE_FILE_EXTENSION;
  if (FileExists(cStructureFilename)) {
    pStructureFileRef = LoadStructureFile(cStructureFilename);
    if (pStructureFileRef == null || hVObject.usNumberOfObjects != pStructureFileRef.usNumberOfStructures) {
      DestroyImage(hImage);
      DeleteVideoObject(hVObject);
      SET_ERROR("Structure file error: %s", cStructureFilename);
      return null;
    }

    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, cStructureFilename);

    fOk = AddZStripInfoToVObject(hVObject, pStructureFileRef, false, 0);
    if (fOk == false) {
      DestroyImage(hImage);
      DeleteVideoObject(hVObject);
      SET_ERROR("ZStrip creation error: %s", cStructureFilename);
      return null;
    }
  } else {
    pStructureFileRef = null;
  }

  pTileSurf = createTileImagery();

  pTileSurf.vo = hVObject;
  pTileSurf.pStructureFileRef = pStructureFileRef;

  if (pStructureFileRef && pStructureFileRef.pAuxData != null) {
    pTileSurf.pAuxData = pStructureFileRef.pAuxData;
    pTileSurf.pTileLocData = pStructureFileRef.pTileLocData;
  } else if (hImage.uiAppDataSize == hVObject.usNumberOfObjects * AUX_OBJECT_DATA_SIZE) {
    // Valid auxiliary data, so make a copy of it for TileSurf
    pTileSurf.pAuxData = createArrayFrom(hVObject.usNumberOfObjects, createAuxObjectData);
    if (pTileSurf.pAuxData == null) {
      DestroyImage(hImage);
      DeleteVideoObject(hVObject);
      return null;
    }
    readObjectArray(pTileSurf.pAuxData, hImage.pAppData, 0, readAuxObjectData);
  } else {
    pTileSurf.pAuxData = null;
  }
  // the hImage is no longer needed
  DestroyImage(hImage);

  return pTileSurf;
}

export function DeleteTileSurface(pTileSurf: TILE_IMAGERY): void {
  if (pTileSurf.pStructureFileRef != null) {
    FreeStructureFile(pTileSurf.pStructureFileRef);
  } else {
    // If a structure file exists, it will free the auxdata.
    // Since there is no structure file in this instance, we
    // free it ourselves.
    if (pTileSurf.pAuxData != null) {
    }
  }

  DeleteVideoObject(pTileSurf.vo);
}

export function SetRaisedObjectFlag(cFilename: string /* Pointer<char> */, pTileSurf: TILE_IMAGERY): void {
  let cnt: INT32 = 0;
  let cRootFile: string /* CHAR8[128] */;
  let ubRaisedObjectFiles: string[] /* UINT8[][80] */ = [
    "bones",
    "bones2",
    "grass2",
    "grass3",
    "l_weed3",
    "litter",
    "miniweed",
    "sblast",
    "sweeds",
    "twigs",
    "wing",
    "1",
  ];

  // Loop through array of RAISED objecttype imagery and
  // set global value...
  if ((pTileSurf.fType >= Enum313.DEBRISWOOD && pTileSurf.fType <= Enum313.DEBRISWEEDS) || pTileSurf.fType == Enum313.DEBRIS2MISC || pTileSurf.fType == Enum313.ANOTHERDEBRIS) {
    cRootFile = GetRootName(cFilename);
    while (ubRaisedObjectFiles[cnt][0] != '1') {
      if (ubRaisedObjectFiles[cnt].toLowerCase() == cRootFile.toLowerCase()) {
        pTileSurf.bRaisedObjectType = true;
      }

      cnt++;
    }
  }
}

}
