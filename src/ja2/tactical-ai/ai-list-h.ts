export interface AILIST {
  ubID: UINT8;
  bPriority: INT8;
  ubUnused: UINT8;
  pNext: Pointer<AILIST>;
}

export const MAX_AI_PRIORITY = 100;
