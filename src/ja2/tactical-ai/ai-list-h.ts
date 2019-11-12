namespace ja2 {

export interface AILIST {
  ubID: UINT8;
  bPriority: INT8;
  ubUnused: UINT8;
  pNext: AILIST | null /* Pointer<AILIST> */;
}

export const MAX_AI_PRIORITY = 100;

}
