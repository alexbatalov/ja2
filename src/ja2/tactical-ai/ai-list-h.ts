interface AILIST {
  ubID: UINT8;
  bPriority: INT8;
  ubUnused: UINT8;
  pNext: Pointer<AILIST>;
}

const MAX_AI_PRIORITY = 100;
