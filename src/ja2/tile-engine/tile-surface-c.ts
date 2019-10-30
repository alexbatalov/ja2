namespace ja2 {

export let gTileSurfaceArray: Pointer<TILE_IMAGERY>[] /* [NUMBEROFTILETYPES] */;
export let gbDefaultSurfaceUsed: UINT8[] /* [NUMBEROFTILETYPES] */;
export let gbSameAsDefaultSurfaceUsed: UINT8[] /* [NUMBEROFTILETYPES] */;

export function LoadTileSurface(cFilename: string /* Pointer<char> */): Pointer<TILE_IMAGERY> {
  // Add tile surface
  let pTileSurf: PTILE_IMAGERY = null;
  let VObjectDesc: VOBJECT_DESC;
  let hVObject: HVOBJECT;
  let hImage: HIMAGE;
  let cStructureFilename: string /* SGPFILENAME */;
  let cEndOfName: string /* STR */;
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
  let fOk: boolean;

  hImage = CreateImage(cFilename, IMAGE_ALLDATA);
  if (hImage == null) {
    // Report error
    SET_ERROR("Could not load tile file: %s", cFilename);
    return null;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMHIMAGE;
  VObjectDesc.hImage = hImage;

  hVObject = CreateVideoObject(addressof(VObjectDesc));

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
  cEndOfName = strchr(cStructureFilename, '.');
  if (cEndOfName != null) {
    cEndOfName++;
    cEndOfName.value = '\0';
  } else {
    cStructureFilename += ".";
  }
  cStructureFilename += STRUCTURE_FILE_EXTENSION;
  if (FileExists(cStructureFilename)) {
    pStructureFileRef = LoadStructureFile(cStructureFilename);
    if (pStructureFileRef == null || hVObject.value.usNumberOfObjects != pStructureFileRef.value.usNumberOfStructures) {
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

  pTileSurf = MemAlloc(sizeof(TILE_IMAGERY));

  // Set all values to zero
  memset(pTileSurf, 0, sizeof(TILE_IMAGERY));

  pTileSurf.value.vo = hVObject;
  pTileSurf.value.pStructureFileRef = pStructureFileRef;

  if (pStructureFileRef && pStructureFileRef.value.pAuxData != null) {
    pTileSurf.value.pAuxData = pStructureFileRef.value.pAuxData;
    pTileSurf.value.pTileLocData = pStructureFileRef.value.pTileLocData;
  } else if (hImage.value.uiAppDataSize == hVObject.value.usNumberOfObjects * sizeof(AuxObjectData)) {
    // Valid auxiliary data, so make a copy of it for TileSurf
    pTileSurf.value.pAuxData = MemAlloc(hImage.value.uiAppDataSize);
    if (pTileSurf.value.pAuxData == null) {
      DestroyImage(hImage);
      DeleteVideoObject(hVObject);
      return null;
    }
    memcpy(pTileSurf.value.pAuxData, hImage.value.pAppData, hImage.value.uiAppDataSize);
  } else {
    pTileSurf.value.pAuxData = null;
  }
  // the hImage is no longer needed
  DestroyImage(hImage);

  return pTileSurf;
}

export function DeleteTileSurface(pTileSurf: PTILE_IMAGERY): void {
  if (pTileSurf.value.pStructureFileRef != null) {
    FreeStructureFile(pTileSurf.value.pStructureFileRef);
  } else {
    // If a structure file exists, it will free the auxdata.
    // Since there is no structure file in this instance, we
    // free it ourselves.
    if (pTileSurf.value.pAuxData != null) {
      MemFree(pTileSurf.value.pAuxData);
    }
  }

  DeleteVideoObject(pTileSurf.value.vo);
  MemFree(pTileSurf);
}

export function SetRaisedObjectFlag(cFilename: string /* Pointer<char> */, pTileSurf: Pointer<TILE_IMAGERY>): void {
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
  if ((pTileSurf.value.fType >= Enum313.DEBRISWOOD && pTileSurf.value.fType <= Enum313.DEBRISWEEDS) || pTileSurf.value.fType == Enum313.DEBRIS2MISC || pTileSurf.value.fType == Enum313.ANOTHERDEBRIS) {
    GetRootName(cRootFile, cFilename);
    while (ubRaisedObjectFiles[cnt][0] != '1') {
      if (stricmp(ubRaisedObjectFiles[cnt], cRootFile) == 0) {
        pTileSurf.value.bRaisedObjectType = true;
      }

      cnt++;
    }
  }
}

}
