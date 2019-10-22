//*****************************************************************************
//
// Filename : Container.c
//
// Purpose : Function definition for the Container
//
// Modification History :
// 25 nov 96 TS creation
//
// 19 Dec 97 AM Replace all memcpy() with memmove(), since overlap possibilities
//							abound (and there were already bugs in do_copy() for ordered lists)
//							While the memcpy() was working in _DEBUG mode, it was failing
//							reproducibly in RELEASE mode whenever regions overlapped!
//							Having read the code, I strongly suggest that you DO NOT use this
//							stuff at all and write your own instead.  Tarun was no Carmack...
//																									- Alex Meduna
// 1998	KM Detached all references to this file from JA2 as it caused a lot of hard to debug
//         crashes.  The VOBJECT/VSURFACE lists are now self-maintained and no longer use the
//				 this crap.  DON'T USE THIS -- NO MATTER WHAT!!!
//*****************************************************************************

//*****************************************************************************
//
// Defines and typedefs
//
//
//*****************************************************************************

interface StackHeader {
  uiTotal_items: UINT32;
  uiSiz_of_elem: UINT32;
  uiMax_size: UINT32;
}

interface QueueHeader {
  uiTotal_items: UINT32;
  uiSiz_of_elem: UINT32;
  uiMax_size: UINT32;
  uiHead: UINT32;
  uiTail: UINT32;
}

type ListHeader = QueueHeader;

interface OrdListHeader {
  uiTotal_items: UINT32;
  uiSiz_of_elem: UINT32;
  uiMax_size: UINT32;
  uiHead: UINT32;
  uiTail: UINT32;
  pCompare: (a: Pointer<void>, b: Pointer<void>, c: UINT32) => INT8;
}

interface TEST {
  me: UINT32;
  you: long;
  k: Pointer<char>;
  p: Pointer<char>;
}

//*****************************************************************************
//
// CreateStack
//
// Parameter List : num_items - estimated number
//									of items in stack
//									siz_each - size of each item
// Return Value	NULL if unsuccesful
//							 pointer to allocated memory
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

function CreateStack(uiNum_items: UINT32, uiSiz_each: UINT32): HSTACK {
  let uiAmount: UINT32;
  let hStack: HSTACK;
  let pStack: Pointer<StackHeader>;

  // assign an initial amount of memory to allocate
  if ((uiNum_items > 0) && (uiSiz_each > 0))
    uiAmount = uiNum_items * uiSiz_each;
  else {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "Requested stack items and size have to be >0");
    return NULL;
  }
  // allocate the container memory
  if ((hStack = MemAlloc(uiAmount + sizeof(StackHeader))) == 0) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "Could not allocate stack container memory");
    return NULL;
  }
  pStack = hStack;
  // initialize the header variables
  pStack.value.uiMax_size = uiAmount + sizeof(StackHeader);
  pStack.value.uiTotal_items = 0;
  pStack.value.uiSiz_of_elem = uiSiz_each;

  // return the pointer to the memory

  return hStack;
}

//*****************************************************************************
//
// CreateQueue
//
// Parameter List : num_items - estimated number
//									of items in queue
//									siz_each - size of each item
// Return Value	NULL if unsuccesful
//							 pointer to allocated memory
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function CreateQueue(uiNum_items: UINT32, uiSiz_each: UINT32): HQUEUE {
  let uiAmount: UINT32;
  let hQueue: HQUEUE;
  let pQueue: Pointer<QueueHeader>;

  // check to see if the queue has more than 1
  // element to be created and that the size > 1

  if ((uiNum_items > 0) && (uiSiz_each > 0))
    uiAmount = uiNum_items * uiSiz_each;
  else {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "Requested queue items and size have to be >0");
    return NULL;
  }

  // allocate the queue memory
  if ((hQueue = MemAlloc(uiAmount + sizeof(QueueHeader))) == 0) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "Could not allocate queue container memory");
    return NULL;
  }

  pQueue = hQueue;
  // initialize the queue structure

  pQueue.value.uiMax_size = uiAmount + sizeof(QueueHeader);
  pQueue.value.uiTotal_items = 0;
  pQueue.value.uiSiz_of_elem = uiSiz_each;
  pQueue.value.uiTail = pQueue.value.uiHead = sizeof(QueueHeader);

  // return the pointer to memory
  return hQueue;
}
//*****************************************************************************
//
// CreateList
//
// Parameter List : num_items - estimated number
//									of items in ordered list
//									siz_each - size of each item
// Return Value	NULL if unsuccesful
//							 pointer to allocated memory
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function CreateList(uiNum_items: UINT32, uiSiz_each: UINT32): HLIST {
  let uiAmount: UINT32;
  let hList: HLIST;
  let pList: Pointer<ListHeader>;

  // check to see if the queue has more than 1
  // element to be created and that the size > 1

  if ((uiNum_items > 0) && (uiSiz_each > 0))
    uiAmount = uiNum_items * uiSiz_each;
  else {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Requested queue items and size have to be >0");
    return 0;
  }

  // allocate the list memory
  if ((hList = MemAlloc(uiAmount + sizeof(ListHeader))) == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not allocate queue container memory");
    return 0;
  }

  pList = hList;
  // initialize the list structure

  pList.value.uiMax_size = uiAmount + sizeof(ListHeader);
  pList.value.uiTotal_items = 0;
  pList.value.uiSiz_of_elem = uiSiz_each;
  pList.value.uiTail = pList.value.uiHead = sizeof(ListHeader);

  // return the pointer to memory

  return hList;
}

//*****************************************************************************
//
// CreateOrdList
//
// Parameter List : num_items - estimated number
//									of items in ordered list
//									siz_each - size of each item
// Return Value	NULL if unsuccesful
//							 pointer to allocated memory
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function CreateOrdList(uiNum_items: UINT32, uiSiz_each: UINT32, compare: (a: Pointer<void>, b: Pointer<void>, c: UINT32) => INT8): HORDLIST {
  let uiAmount: UINT32;
  let hOrdList: HLIST;
  let pOrdList: Pointer<OrdListHeader>;

  // check to see if the ordered list has more than 1
  // element to be created and that the size > 1

  if ((uiNum_items > 0) && (uiSiz_each > 0))
    uiAmount = uiNum_items * uiSiz_each;
  else {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Requested ordered list items and size have to be >0");
    return 0;
  }

  // allocate the list memory
  if ((hOrdList = MemAlloc(uiAmount + sizeof(OrdListHeader))) == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not allocate queue container memory");
    return 0;
  }

  pOrdList = hOrdList;
  // initialize the list structure

  pOrdList.value.uiMax_size = uiAmount + sizeof(OrdListHeader);
  pOrdList.value.uiTotal_items = 0;
  pOrdList.value.uiSiz_of_elem = uiSiz_each;
  pOrdList.value.uiTail = pOrdList.value.uiHead = sizeof(OrdListHeader);
  pOrdList.value.pCompare = compare;

  // return the pointer to memory

  return hOrdList;
}

//*****************************************************************************
//
// push
//
// Parameter List : void * - pointer to stack
//									container
//									data - data to add to stack
//
// Return Value	BOOLEAN true if push ok
//							 else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function Push(hStack: HSTACK, pdata: Pointer<void>): HSTACK {
  let pTemp_cont: Pointer<StackHeader>;
  let uiOffset: UINT32;
  let uiNew_size: UINT32;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;

  // check for a NULL pointer

  if (hStack == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the stack");
    return NULL;
  }

  // some valid data should be passed in
  if (pdata == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto stack is NULL");
    return NULL;
  }

  // perform operations to calculate offset and decide if the container has to resized
  pTemp_cont = hStack;
  uiOffset = (pTemp_cont.value.uiSiz_of_elem * pTemp_cont.value.uiTotal_items) + sizeof(StackHeader);

  if ((uiOffset + pTemp_cont.value.uiSiz_of_elem) > pTemp_cont.value.uiMax_size) {
    uiNew_size = pTemp_cont.value.uiMax_size + (pTemp_cont.value.uiMax_size - sizeof(StackHeader));
    pTemp_cont.value.uiMax_size = uiNew_size;
    if ((hStack = MemRealloc(hStack, uiNew_size)) == NULL) {
      DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "Could not resize stack container memory");
      return NULL;
    }
    pTemp_cont = hStack;
  }
  pbyte = hStack;
  pbyte += uiOffset;
  pvoid = pbyte;
  // copy data from pdata to pvoid - the stack
  memmove(pvoid, pdata, pTemp_cont.value.uiSiz_of_elem);
  pTemp_cont.value.uiTotal_items++;
  // return push succeeded
  return hStack;
}
//*****************************************************************************
//
// pop
//
// Parameter List : void * - pointer to stack
//									container
//
//
// Return Value : void * - pointer to stack
//								after pushing element
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function Pop(hStack: HSTACK, pdata: Pointer<void>): BOOLEAN {
  let pTemp_cont: Pointer<StackHeader>;
  let uiOffset: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;

  // check for a NULL queue

  if (hStack == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the stack");
    return FALSE;
  }
  if (pdata == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "Variable where data is to be stored is NULL");
    return FALSE;
  }
  pTemp_cont = hStack;
  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  if (uiTotal == 0) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "There is no data in stack to pop");
    return FALSE;
  }

  // calculate offsets to decide if the page should be rezied
  uiOffset = (uiSize_of_each * uiTotal) + sizeof(StackHeader);
  uiOffset -= uiSize_of_each;
  pbyte = hStack;
  pbyte += uiOffset;
  pvoid = pbyte;
  // get the data from pvoid and store in pdata
  memmove(pdata, pvoid, uiSize_of_each);
  pTemp_cont.value.uiTotal_items--;
  return TRUE;
}
//*****************************************************************************
//
// PeekStack
//
// Parameter List : void * - buffer to hold data
//
//
// Return Value : TRUE if stack not empty
//
// Modification History :
// Apr 14 2000 SCT -> Created
//
//*****************************************************************************
function PeekStack(hStack: HSTACK, pdata: Pointer<void>): BOOLEAN {
  let pTemp_cont: Pointer<StackHeader>;
  let uiOffset: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;

  // check for a NULL queue

  if (hStack == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the stack");
    return FALSE;
  }
  if (pdata == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "Variable where data is to be stored is NULL");
    return FALSE;
  }
  pTemp_cont = hStack;
  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  if (uiTotal == 0) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "There is no data in stack to pop");
    return FALSE;
  }

  // calculate offsets to decide if the page should be rezied
  uiOffset = (uiSize_of_each * uiTotal) + sizeof(StackHeader);
  uiOffset -= uiSize_of_each;
  pbyte = hStack;
  pbyte += uiOffset;
  pvoid = pbyte;
  // get the data from pvoid and store in pdata
  memmove(pdata, pvoid, uiSize_of_each);
  return TRUE;
}
//*****************************************************************************
//
// DeleteStack
//
// Parameter List : pointer to memory
//
// Return Value	: BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function DeleteStack(hStack: HSTACK): BOOLEAN {
  if (hStack == NULL) {
    DbgMessage(TOPIC_STACK_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the stack");
    return FALSE;
  }
  // free the memory assigned to the handle
  MemFree(hStack);
  return TRUE;
}
//*****************************************************************************
//
// DeleteQueue
//
// Parameter List : pointer to memory
//
// Return Value	: BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function DeleteQueue(hQueue: HQUEUE): BOOLEAN {
  if (hQueue == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the queue");
    return FALSE;
  }
  // free the memory assigned to the handle
  MemFree(hQueue);
  return TRUE;
}
//*****************************************************************************
//
// DeleteList
//
// Parameter List : pointer to memory
//
// Return Value	: BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function DeleteList(hList: HLIST): BOOLEAN {
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the list");
    return FALSE;
  }
  // free the memory assigned to the list
  MemFree(hList);
  return TRUE;
}
//*****************************************************************************
//
// DeleteOrdList
//
// Parameter List : pointer to memory
//
// Return Value	: BOOLEAN
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function DeleteOrdList(hOrdList: HORDLIST): BOOLEAN {
  if (hOrdList == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the ordered list");
    return FALSE;
  }
  // free the memory assigned to the list
  MemFree(hOrdList);
  return TRUE;
}
//*****************************************************************************
//
// InitializeContainers
//
// Parameter List : none
//
// Return Value	: void
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

function InitializeContainers(): void {
  // register the appropriate debug topics
  RegisterDebugTopic(TOPIC_STACK_CONTAINERS, "Stack Container");
  RegisterDebugTopic(TOPIC_LIST_CONTAINERS, "List Container");
  RegisterDebugTopic(TOPIC_QUEUE_CONTAINERS, "Queue Container");
  RegisterDebugTopic(TOPIC_ORDLIST_CONTAINERS, "Ordered List Container");
}

//*****************************************************************************
//
// ShutdownContainers
//
// Parameter List : none
//
// Return Value	: void
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

function ShutdownContainers(): void {
  UnRegisterDebugTopic(TOPIC_STACK_CONTAINERS, "Stack Container");
  UnRegisterDebugTopic(TOPIC_LIST_CONTAINERS, "List Container");
  UnRegisterDebugTopic(TOPIC_QUEUE_CONTAINERS, "Queue Container");
  UnRegisterDebugTopic(TOPIC_ORDLIST_CONTAINERS, "Ordered List Container");
}
//*****************************************************************************
//
// PeekQueue - gets the first item in queue without
// actually deleting it.
//
// Parameter List : pvoid_queue - pointer to queue
//									container
//									data - data removed from queue
//
// Return Value	pointer to queue with data removed
//							 or NULL if failed
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function PeekQueue(hQueue: HQUEUE, pdata: Pointer<void>): BOOLEAN {
  let pTemp_cont: Pointer<QueueHeader>;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;

  // cannot check for invalid handle , only 0
  if (hQueue == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the queue");
    return FALSE;
  }
  if (pdata == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "Memory fo Data to be removed from queue is NULL");
    return FALSE;
  }

  // assign to temporary variables
  pTemp_cont = hQueue;

  // if theres no elements to remove return error
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "There is nothing in the queue");
    return FALSE;
  }

  // copy the element pointed to by uiHead

  pbyte = hQueue;
  pbyte += pTemp_cont.value.uiHead;
  pvoid = pbyte;
  memmove(pdata, pvoid, pTemp_cont.value.uiSiz_of_elem);

  return TRUE;
}
//*****************************************************************************
//
// PeekList - gets the specified item in the list without
// actually deleting it.
//
// Parameter List : hList - pointer to list
//									container
//									data - data where list element is stored
//
// Return Value	BOOLEAN
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function PeekList(hList: HLIST, pdata: Pointer<void>, uiPos: UINT32): BOOLEAN {
  let pTemp_cont: Pointer<ListHeader>;
  let pvoid: Pointer<void>;
  let uiOffsetSrc: UINT32;
  let pbyte: Pointer<BYTE>;

  // cannot check for invalid handle , only 0
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the list");
    return FALSE;
  }
  if (pdata == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Memory fo Data to be removed from list is NULL");
    return FALSE;
  }

  // assign to temporary variables
  pTemp_cont = hList;

  // if theres no elements to peek return error
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "There is nothing in the list");
    return FALSE;
  }
  if (uiPos >= pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "There is no item at this position");
    return FALSE;
  }

  // copy the element pointed to by uiHead
  uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
  if (uiOffsetSrc >= pTemp_cont.value.uiMax_size)
    uiOffsetSrc = sizeof(ListHeader) + (uiOffsetSrc - pTemp_cont.value.uiMax_size);

  pbyte = hList;
  pbyte += uiOffsetSrc;
  pvoid = pbyte;
  memmove(pdata, pvoid, pTemp_cont.value.uiSiz_of_elem);

  return TRUE;
}

//*****************************************************************************
//
// SwapListNode - Swaps the contents of a list node with the given parameter.
//								Note: The data being swapped in MUST have the same size as
//								the current node size or strange things could happen.
//								Contents of node and pdata parameter are swapped.
//
// Parameter List : hList - pointer to list container
//									pdata - pointer to data to be swapped
//									uiPos - List position with which to swap.
//
// Return Value	BOOLEAN - TRUE if successful, FALSE if function fails.
//
//
// Modification History :
//	Added to SGP by Bret Rowdon for use with JA2. May 1 '97.
//		- This function was based on the PeekList function.
//
//*****************************************************************************
function SwapListNode(hList: HLIST, pdata: Pointer<void>, uiPos: UINT32): BOOLEAN {
  let pTemp_cont: Pointer<ListHeader>;
  let pvoid: Pointer<BYTE>;
  let uiOffsetSrc: UINT32;
  let pbyte: Pointer<BYTE>;
  let pSrc: Pointer<BYTE>;

  // cannot check for invalid handle, only 0
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid pointer to list");
    return FALSE;
  }

  if (pdata == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Data pointer to be swapped from list is NULL");
    return FALSE;
  }

  // assign to temporary variables
  pTemp_cont = hList;

  // if theres no elements to peek return error
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Empty list");
    return FALSE;
  }

  if (uiPos >= pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid list position");
    return FALSE;
  }

  uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
  if (uiOffsetSrc >= pTemp_cont.value.uiMax_size)
    uiOffsetSrc = sizeof(ListHeader) + (uiOffsetSrc - pTemp_cont.value.uiMax_size);

  pbyte = hList;
  pbyte += uiOffsetSrc;
  pvoid = pbyte;
  pSrc = pdata;

  // possible overlap, use memmove()
  memmove(pvoid, pdata, pTemp_cont.value.uiSiz_of_elem);
  // memmove(pvoid, pdata, pTemp_cont->uiSiz_of_elem);

  return TRUE;
}

//*****************************************************************************
//
// StoreListNode - Stores the contents of a list node with the given parameter.
//									Unlike SwapListNode(), this does NOT swap previous contents
//									back into the pdata buffer!
//
// Parameter List : hList - pointer to list container
//									pdata - pointer to data to be stored
//									uiPos - List position into which to store.
//
// Return Value	BOOLEAN - TRUE if successful, FALSE if function fails.
//
//
// Modification History :
//	Added to SGP by Alex Meduna for use with Wiz8. Oct 31 '97.
//		- This function is nearly identical to the SwapListNode() function.
//
//*****************************************************************************
function StoreListNode(hList: HLIST, pdata: Pointer<void>, uiPos: UINT32): BOOLEAN {
  let pTemp_cont: Pointer<ListHeader>;
  let uiOffsetSrc: UINT32;
  let pbyte: Pointer<BYTE>;

  // cannot check for invalid handle , only 0
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid pointer to list");
    return FALSE;
  }

  if (pdata == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Data pointer to be swapped from list is NULL");
    return FALSE;
  }

  // assign to temporary variables
  pTemp_cont = hList;

  // if theres no elements to peek return error
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Empty list");
    return FALSE;
  }

  if (uiPos >= pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid list position");
    return FALSE;
  }

  uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
  if (uiOffsetSrc >= pTemp_cont.value.uiMax_size)
    uiOffsetSrc = sizeof(ListHeader) + (uiOffsetSrc - pTemp_cont.value.uiMax_size);

  pbyte = hList;
  pbyte += uiOffsetSrc;

  memmove(pbyte, pdata, pTemp_cont.value.uiSiz_of_elem);

  return TRUE;
}

//*****************************************************************************
//
// PeekOrdList - gets the specified item in the list without
// actually deleting it.
//
// Parameter List : hList - pointer to ordered list
//									container
//									data - data where list element is stored
//
// Return Value	BOOLEAN
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function PeekOrdList(hOrdList: HORDLIST, pdata: Pointer<void>, uiPos: UINT32): BOOLEAN {
  let pTemp_cont: Pointer<OrdListHeader>;
  let pvoid: Pointer<void>;
  let uiOffsetSrc: UINT32;
  let pbyte: Pointer<BYTE>;

  // cannot check for invalid handle , only 0
  if (hOrdList == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the ordered list");
    return FALSE;
  }
  if (pdata == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Memory fo Data to be removed from ordered list is NULL");
    return FALSE;
  }

  // assign to temporary variables
  pTemp_cont = hOrdList;

  // if theres no elements to peek return error
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "There is nothing in the list");
    return FALSE;
  }
  if (uiPos >= pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "There is no item at this position");
    return FALSE;
  }

  // copy the element pointed to by uiHead
  uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
  if (uiOffsetSrc >= pTemp_cont.value.uiMax_size)
    uiOffsetSrc = sizeof(OrdListHeader) + (uiOffsetSrc - pTemp_cont.value.uiMax_size);

  pbyte = hOrdList;
  pbyte += uiOffsetSrc;
  pvoid = pbyte;
  memmove(pdata, pvoid, pTemp_cont.value.uiSiz_of_elem);

  return TRUE;
}
//*****************************************************************************
//
// RemfromQueue
//
// Parameter List : pvoid_queue - pointer to queue
//									container
//									data - data removed from queue
//
// Return Value	pointer to queue with data removed
//							 or NULL if failed
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function RemfromQueue(hQueue: HQUEUE, pdata: Pointer<void>): BOOLEAN {
  let pTemp_cont: Pointer<QueueHeader>;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;

  // cannot check for invalid handle , only 0
  if (hQueue == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the queue");
    return FALSE;
  }
  if (pdata == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "Memory fo Data to be removed from queue is NULL");
    return FALSE;
  }

  // assign to temporary variables
  pTemp_cont = hQueue;

  // if theres no elements to remove return error
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "There is nothing in the queue to remove");
    return FALSE;
  }

  // remove the element pointed to by uiHead

  pbyte = hQueue;
  pbyte += pTemp_cont.value.uiHead;
  pvoid = pbyte;
  memmove(pdata, pvoid, pTemp_cont.value.uiSiz_of_elem);
  pTemp_cont.value.uiTotal_items--;
  pTemp_cont.value.uiHead += pTemp_cont.value.uiSiz_of_elem;

  // if after removing an element head = tail then set them both
  // to the beginning of the container as it is empty

  if (pTemp_cont.value.uiHead == pTemp_cont.value.uiTail)
    pTemp_cont.value.uiHead = pTemp_cont.value.uiTail = sizeof(QueueHeader);

  // if only the head is at the end of the container then make it point
  // to the beginning of the container

  if (pTemp_cont.value.uiHead == pTemp_cont.value.uiMax_size)
    pTemp_cont.value.uiHead = sizeof(QueueHeader);

  return TRUE;
}

//*****************************************************************************
//
// AddtoQueue
//
// Parameter List : pvoid_queue - pointer to queue
//									container
//									pdata - pointer to data to add to queue
//
// Return Value	pointer to queue with data added
//							 else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function AddtoQueue(hQueue: HQUEUE, pdata: Pointer<void>): HQUEUE {
  let pTemp_cont: Pointer<QueueHeader>;
  let uiMax_size: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let uiNew_size: UINT32;
  let uiHead: UINT32;
  let uiTail: UINT32;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;
  let pmaxsize: Pointer<BYTE>;
  let presize: Pointer<BYTE>;
  let fresize: BOOLEAN;

  // check for invalid handle = 0
  if (hQueue == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "This is not a valid pointer to the queue");
    return NULL;
  }

  // check for data = NULL
  if (pdata == NULL) {
    DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "Data to be added onto queue is NULL");
    return NULL;
  }

  // assign some temporary variables
  fresize = FALSE;
  pTemp_cont = hQueue;
  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  uiMax_size = pTemp_cont.value.uiMax_size;
  uiHead = pTemp_cont.value.uiHead;
  uiTail = pTemp_cont.value.uiTail;
  if ((uiTail + uiSize_of_each) > uiMax_size) {
    uiTail = pTemp_cont.value.uiTail = sizeof(QueueHeader);
    fresize = TRUE;
  }
  if ((uiHead == uiTail) && ((uiHead >= (sizeof(QueueHeader) + uiSize_of_each)) || (fresize == TRUE))) {
    uiNew_size = uiMax_size + (uiMax_size - sizeof(QueueHeader));
    pTemp_cont.value.uiMax_size = uiNew_size;
    if ((hQueue = MemRealloc(hQueue, uiNew_size)) == NULL) {
      DbgMessage(TOPIC_QUEUE_CONTAINERS, DBG_LEVEL_0, "Could not resize queue container memory");
      return NULL;
    }
    // copy memory from beginning of container to end of container
    // so that all the data is in one continuous block

    pTemp_cont = hQueue;
    presize = hQueue;
    pmaxsize = hQueue;
    presize += sizeof(QueueHeader);
    pmaxsize += uiMax_size;
    if (uiHead > sizeof(QueueHeader))
      memmove(pmaxsize, presize, uiHead - sizeof(QueueHeader));
    pTemp_cont.value.uiTail = uiMax_size + (uiHead - sizeof(QueueHeader));
  }
  pbyte = hQueue;
  pbyte += pTemp_cont.value.uiTail;
  pvoid = pbyte;
  memmove(pvoid, pdata, uiSize_of_each);
  pTemp_cont.value.uiTotal_items++;
  pTemp_cont.value.uiTail += uiSize_of_each;
  return hQueue;
}

//*****************************************************************************
//
// do_copy
//
// Parameter List : pointer to mem, source offset, dest offset, size
//
// Return Value	BOOLEAN
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function do_copy(pmem_void: Pointer<void>, uiSourceOfst: UINT32, uiDestOfst: UINT32, uiSize: UINT32): BOOLEAN {
  let pOffsetSrc: Pointer<BYTE>;
  let pOffsetDst: Pointer<BYTE>;
  let pvoid_src: Pointer<void>;
  let pvoid_dest: Pointer<void>;

  if ((uiSourceOfst < 0) || (uiDestOfst < 0) || (uiSize < 0)) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid parameters passed to do_copy");
    return FALSE;
  }

  if (pmem_void == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid pointer passed to do_copy");
    return FALSE;
  }
  pOffsetSrc = pmem_void;
  pOffsetSrc += uiSourceOfst;
  pOffsetDst = pmem_void;
  pOffsetDst += uiDestOfst;
  pvoid_src = pOffsetSrc;
  pvoid_dest = pOffsetDst;
  memmove(pvoid_dest, pvoid_src, uiSize);
  return TRUE;
}
//*****************************************************************************
//
// do_copy_data
//
// Parameter List : pointer to mem, pointer to data, source offset, size
//
// Return Value	BOOLEAN
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function do_copy_data(pmem_void: Pointer<void>, data: Pointer<void>, uiSrcOfst: UINT32, uiSize: UINT32): BOOLEAN {
  let pOffsetSrc: Pointer<BYTE>;
  let pvoid_src: Pointer<void>;

  if ((uiSrcOfst < 0) || (uiSize < 0)) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid parameters passed to do_copy_data");
    return FALSE;
  }

  if (pmem_void == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Invalid pointer passed to do_copy_data");
    return FALSE;
  }
  pOffsetSrc = pmem_void;
  pOffsetSrc += uiSrcOfst;
  pvoid_src = pOffsetSrc;
  memmove(data, pvoid_src, uiSize);
  return TRUE;
}
//*****************************************************************************
//
// StackSize
//
// Parameter List : pointer to stack
//
// Return Value	UINT32 stack size
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function StackSize(hStack: HSTACK): UINT32 {
  let pTemp_cont: Pointer<StackHeader>;
  if (hStack == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Stack pointer is NULL");
    return 0;
  }
  pTemp_cont = hStack;
  return pTemp_cont.value.uiTotal_items;
}
//*****************************************************************************
//
// QueueSize
//
// Parameter List : pointer to queue
//
// Return Value	UINT32 queue size
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function QueueSize(hQueue: HQUEUE): UINT32 {
  let pTemp_cont: Pointer<QueueHeader>;
  if (hQueue == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Queue pointer is NULL");
    return 0;
  }
  pTemp_cont = hQueue;
  return pTemp_cont.value.uiTotal_items;
}
//*****************************************************************************
//
// ListSize
//
// Parameter List : pointer to queue
//
// Return Value	UINT32 list size
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function ListSize(hList: HLIST): UINT32 {
  let pTemp_cont: Pointer<ListHeader>;
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "List pointer is NULL");
    return 0;
  }
  pTemp_cont = hList;
  return pTemp_cont.value.uiTotal_items;
}
//*****************************************************************************
//
// OrdListSize
//
// Parameter List : pointer to list
//
// Return Value	UINT32 Ordlist size
//
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function OrdListSize(hOrdList: HORDLIST): UINT32 {
  let pTemp_cont: Pointer<OrdListHeader>;
  if (hOrdList == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Ordered List pointer is NULL");
    return 0;
  }
  pTemp_cont = hOrdList;
  return pTemp_cont.value.uiTotal_items;
}
//*****************************************************************************
//
// AddtoList
//
// Parameter List : HCONTAINER - handle to list
//									container
//									data - data to add to queue
//									position - position after which data is to added
//
// Return Value	BOOLEAN true if push ok
//							 else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function AddtoList(hList: HLIST, pdata: Pointer<void>, uiPos: UINT32): HLIST {
  let pTemp_cont: Pointer<ListHeader>;
  let uiMax_size: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let uiNew_size: UINT32;
  let uiHead: UINT32;
  let uiTail: UINT32;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;
  let uiOffsetSrc: UINT32;
  let uiOffsetDst: UINT32;
  let uiFinalLoc: UINT32 = 0;
  let fTail_check: BOOLEAN = FALSE;

  // check for invalid handle = 0
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid handle to the list");
    return NULL;
  }

  // check for data = NULL
  if (pdata == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto list is NULL");
    return NULL;
  }
  // check for a 0 or negative position passed in
  if (uiPos < 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto list is NULL");
    return NULL;
  }

  // assign some temporary variables

  pTemp_cont = hList;
  if (uiPos > pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "There are not enough elements in the list");
    return NULL;
  }
  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  uiMax_size = pTemp_cont.value.uiMax_size;
  uiHead = pTemp_cont.value.uiHead;
  uiTail = pTemp_cont.value.uiTail;
  uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
  if (uiOffsetSrc >= uiMax_size)
    uiOffsetSrc = sizeof(ListHeader) + (uiOffsetSrc - uiMax_size);
  if (uiTail == uiOffsetSrc)
    fTail_check = TRUE;
  // copy appropriate blocks
  if (((uiTail + uiSize_of_each) <= uiMax_size) && ((uiTail > uiHead) || ((uiTail == uiHead) && (uiHead == sizeof(ListHeader))))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
    uiOffsetDst = uiOffsetSrc + pTemp_cont.value.uiSiz_of_elem;
    if (fTail_check == FALSE) {
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }
    }
    if (fTail_check == FALSE)
      pTemp_cont.value.uiTail += uiSize_of_each;
    uiFinalLoc = uiOffsetSrc;
  }

  if ((((uiTail + uiSize_of_each) <= uiMax_size) && (uiTail < uiHead)) || (((uiTail + uiSize_of_each) > uiMax_size) && (uiHead >= (sizeof(ListHeader) + uiSize_of_each)))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);

    if (uiOffsetSrc >= uiMax_size) {
      uiOffsetSrc = sizeof(ListHeader) + (uiOffsetSrc - uiMax_size);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy(hList, uiOffsetDst, uiOffsetSrc, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }
      uiFinalLoc = uiOffsetSrc;
    } else {
      uiOffsetSrc = sizeof(ListHeader);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }

      uiOffsetSrc = uiMax_size - uiSize_of_each;
      uiOffsetDst = sizeof(ListHeader);
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }
      uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, (uiMax_size - uiSize_of_each) - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }
    }
    pTemp_cont.value.uiTail += uiSize_of_each;
    uiFinalLoc = uiOffsetSrc;
  } // end if

  if ((((uiTail + uiSize_of_each) <= uiMax_size) && (uiTail == uiHead) && (uiHead >= (sizeof(ListHeader) + uiSize_of_each))) || (((uiTail + uiSize_of_each) > uiMax_size) && (uiHead == sizeof(ListHeader)))) {
    // need to resize the container
    uiNew_size = uiMax_size + (uiMax_size - sizeof(ListHeader));
    pTemp_cont.value.uiMax_size = uiNew_size;
    if ((hList = MemRealloc(hList, uiNew_size)) == NULL) {
      DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not resize list container memory");
      return NULL;
    }
    pTemp_cont = hList;
    if (do_copy(hList, sizeof(ListHeader), uiMax_size, uiHead - sizeof(ListHeader)) == FALSE) {
      DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not copy list container memory");
      return NULL;
    }
    pTemp_cont.value.uiTail = uiMax_size + (uiHead - sizeof(ListHeader));

    // now make place for the actual element

    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
    uiOffsetDst = uiOffsetSrc + pTemp_cont.value.uiSiz_of_elem;
    if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
      DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
      return NULL;
    }
    pTemp_cont.value.uiTail += uiSize_of_each;
    uiFinalLoc = uiOffsetSrc;
  }

  // finally insert data at position uiFinalLoc

  pbyte = hList;
  if (uiFinalLoc == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "This should never happen! report this problem!");
    return NULL;
  }
  pbyte += uiFinalLoc;
  pvoid = pbyte;

  memmove(pvoid, pdata, pTemp_cont.value.uiSiz_of_elem);
  pTemp_cont.value.uiTotal_items++;
  if (fTail_check == TRUE)
    pTemp_cont.value.uiTail += pTemp_cont.value.uiSiz_of_elem;
  return hList;
}

//*****************************************************************************
//
// RemfromList
//
// Parameter List : HLIST - handle to list
//									container
//									data - data to remove from list
//									position - position after which data is to added
//
// Return Value	BOOLEAN true if push ok
//							 else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function RemfromList(hList: HLIST, pdata: Pointer<void>, uiPos: UINT32): BOOLEAN {
  let pTemp_cont: Pointer<ListHeader>;
  let uiMax_size: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let uiHead: UINT32;
  let uiTail: UINT32;
  let uiOffsetSrc: UINT32;
  let uiOffsetDst: UINT32;
  let uiFinalLoc: UINT32 = 0;
  let fTail_check: BOOLEAN = FALSE;

  // check for invalid handle = 0
  if (hList == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid handle to the list");
    return FALSE;
  }

  // check for data = NULL
  if (pdata == NULL) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto list is NULL");
    return FALSE;
  }
  // check for a 0 or negative position passed in
  if (uiPos < 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto list is NULL");
    return FALSE;
  }

  // assign some temporary variables
  pTemp_cont = hList;

  if (uiPos >= pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Cannot delete at the specified position");
    return FALSE;
  }
  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "There are no elements in the list to remove");
    return FALSE;
  }

  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  uiMax_size = pTemp_cont.value.uiMax_size;
  uiHead = pTemp_cont.value.uiHead;
  uiTail = pTemp_cont.value.uiTail;

  // copy appropriate blocks
  if ((uiTail > uiHead) || ((uiTail == uiHead) && (uiHead == sizeof(ListHeader)))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
    uiOffsetDst = uiOffsetSrc + pTemp_cont.value.uiSiz_of_elem;
    if (do_copy_data(hList, pdata, uiOffsetSrc, uiSize_of_each) == FALSE) {
      DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from list");
      return FALSE;
    }
    if (do_copy(hList, uiOffsetDst, uiOffsetSrc, uiTail - uiOffsetSrc) == FALSE) {
      DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not remove the data the list");
      return FALSE;
    }
    pTemp_cont.value.uiTail -= uiSize_of_each;
    pTemp_cont.value.uiTotal_items--;
  }

  if ((uiTail < uiHead) || ((uiTail == uiHead) && (uiHead <= (sizeof(ListHeader) + uiSize_of_each)))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);

    if (uiOffsetSrc >= uiMax_size) {
      uiOffsetSrc = sizeof(ListHeader) + (uiOffsetSrc - uiMax_size);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy_data(hList, pdata, uiOffsetSrc, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from list");
        return FALSE;
      }
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }
      uiFinalLoc = uiOffsetSrc;
    } else {
      uiOffsetSrc = sizeof(ListHeader);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }

      uiOffsetSrc = uiMax_size - uiSize_of_each;
      uiOffsetDst = sizeof(ListHeader);
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }
      uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy_data(hList, pdata, uiOffsetSrc, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from list");
        return FALSE;
      }
      if (do_copy(hList, uiOffsetSrc, uiOffsetDst, (uiMax_size - uiSize_of_each) - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_LIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }
    }
    pTemp_cont.value.uiTail -= uiSize_of_each;
    pTemp_cont.value.uiTotal_items--;
  } // end if

  return TRUE;
}

//*****************************************************************************
//
// RemfromOrdList
//
// Parameter List : HORDLIST - handle to ordered list
//									container
//									data - data to remove from ordered list
//									position - position after which data is to added
//
// Return Value	BOOLEAN true if push ok
//							 else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function RemfromOrdList(hOrdList: HORDLIST, pdata: Pointer<void>, uiPos: UINT32): BOOLEAN {
  let pTemp_cont: Pointer<OrdListHeader>;
  let uiMax_size: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let uiHead: UINT32;
  let uiTail: UINT32;
  let uiOffsetSrc: UINT32;
  let uiOffsetDst: UINT32;
  let uiFinalLoc: UINT32 = 0;

  // check for invalid handle = 0
  if (hOrdList == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid handle to the ordered list");
    return FALSE;
  }

  // check for data = NULL
  if (pdata == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto ordered list is NULL");
    return FALSE;
  }
  // check for a 0 or negative position passed in
  if (uiPos < 0) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto ordered list is NULL");
    return FALSE;
  }

  // assign some temporary variables

  pTemp_cont = hOrdList;
  if (uiPos >= pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Cannot delete at the specified position");
    return FALSE;
  }

  if (pTemp_cont.value.uiTotal_items == 0) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "There are no elements in the ordered list to remove");
    return FALSE;
  }

  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  uiMax_size = pTemp_cont.value.uiMax_size;
  uiHead = pTemp_cont.value.uiHead;
  uiTail = pTemp_cont.value.uiTail;

  // copy appropriate blocks
  if ((uiTail > uiHead) || ((uiTail == uiHead) && (uiHead == sizeof(OrdListHeader)))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
    uiOffsetDst = uiOffsetSrc + pTemp_cont.value.uiSiz_of_elem;
    if (do_copy_data(hOrdList, pdata, uiOffsetSrc, uiSize_of_each) == FALSE) {
      DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from ordered list");
      return FALSE;
    }

    if (do_copy(hOrdList, uiOffsetDst, uiOffsetSrc, uiTail - uiOffsetSrc) == FALSE) {
      DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not remove the data from the ordered list");
      return FALSE;
    }

    pTemp_cont.value.uiTail -= uiSize_of_each;
    pTemp_cont.value.uiTotal_items--;
  }

  if ((uiTail < uiHead) || ((uiTail == uiHead) && (uiHead <= (sizeof(OrdListHeader) + uiSize_of_each)))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);

    if (uiOffsetSrc >= uiMax_size) {
      uiOffsetSrc = sizeof(OrdListHeader) + (uiOffsetSrc - uiMax_size);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy_data(hOrdList, pdata, uiOffsetSrc, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from list");
        return FALSE;
      }
      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }

      uiFinalLoc = uiOffsetSrc;
    } else {
      uiOffsetSrc = sizeof(OrdListHeader);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;

      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }

      uiOffsetSrc = uiMax_size - uiSize_of_each;
      uiOffsetDst = sizeof(OrdListHeader);

      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }

      uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;
      if (do_copy_data(hOrdList, pdata, uiOffsetSrc, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from list");
        return FALSE;
      }

      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, (uiMax_size - uiSize_of_each) - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return FALSE;
      }
    }

    pTemp_cont.value.uiTail -= uiSize_of_each;
    pTemp_cont.value.uiTotal_items--;
  } // end if

  return TRUE;
}

//*****************************************************************************
//
// StoreinOrdList
//
// Parameter List : HORDLIST - handle to ordered list
//									container
//									data - data to add to the ordered list
//									position - position after which data is to added
//
// Return Value	BOOLEAN true if push ok
//							 else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
//
//*****************************************************************************
function StoreinOrdList(hOrdList: HORDLIST, pdata: Pointer<void>, uiPos: UINT32): HORDLIST {
  let pTemp_cont: Pointer<OrdListHeader>;
  let uiMax_size: UINT32;
  let uiSize_of_each: UINT32;
  let uiTotal: UINT32;
  let uiNew_size: UINT32;
  let uiHead: UINT32;
  let uiTail: UINT32;
  let pvoid: Pointer<void>;
  let pbyte: Pointer<BYTE>;
  let uiOffsetSrc: UINT32;
  let uiOffsetDst: UINT32;
  let uiFinalLoc: UINT32 = 0;
  let fTail_check: BOOLEAN = FALSE;

  // check for invalid handle = 0
  if (hOrdList == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "This is not a valid handle to the ordered list");
    return NULL;
  }

  // check for data = NULL
  if (pdata == NULL) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Data to be pushed onto ordered list is NULL");
    return NULL;
  }

  // assign some temporary variables
  pTemp_cont = hOrdList;

  // check for invalid position
  if (uiPos > pTemp_cont.value.uiTotal_items) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "There are not enough elements in the ordered list to add after");
    return NULL;
  }

  uiTotal = pTemp_cont.value.uiTotal_items;
  uiSize_of_each = pTemp_cont.value.uiSiz_of_elem;
  uiMax_size = pTemp_cont.value.uiMax_size;
  uiHead = pTemp_cont.value.uiHead;
  uiTail = pTemp_cont.value.uiTail;
  uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);

  // this shouldn't be necessary?  position should never be outside the range?
  if (uiOffsetSrc >= uiMax_size)
    uiOffsetSrc = sizeof(OrdListHeader) + (uiOffsetSrc - uiMax_size);

  if (uiTail == uiOffsetSrc)
    fTail_check = TRUE;

  // now copy the appropriate blocks to make room...

  if (((uiTail + uiSize_of_each) <= uiMax_size) && ((uiTail > uiHead) || ((uiTail == uiHead) && (uiHead == sizeof(OrdListHeader))))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
    uiOffsetDst = uiOffsetSrc + pTemp_cont.value.uiSiz_of_elem;

    if (fTail_check == FALSE) {
      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in ordered list");
        return NULL;
      }
    }

    if (fTail_check == FALSE)
      pTemp_cont.value.uiTail += uiSize_of_each;

    uiFinalLoc = uiOffsetSrc;
  }

  if ((((uiTail + uiSize_of_each) <= uiMax_size) && (uiTail < uiHead)) || (((uiTail + uiSize_of_each) > uiMax_size) && (uiHead >= (sizeof(OrdListHeader) + uiSize_of_each)))) {
    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);

    if (uiOffsetSrc >= uiMax_size) {
      uiOffsetSrc = sizeof(OrdListHeader) + (uiOffsetSrc - uiMax_size);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;

      if (do_copy(hOrdList, uiOffsetDst, uiOffsetSrc, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }
      uiFinalLoc = uiOffsetSrc;
    } else {
      uiOffsetSrc = sizeof(OrdListHeader);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;

      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }

      uiOffsetSrc = uiMax_size - uiSize_of_each;
      uiOffsetDst = sizeof(OrdListHeader);

      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiSize_of_each) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }

      uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
      uiOffsetDst = uiOffsetSrc + uiSize_of_each;

      if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, (uiMax_size - uiSize_of_each) - uiOffsetSrc) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
        return NULL;
      }
    }

    pTemp_cont.value.uiTail += uiSize_of_each;
    uiFinalLoc = uiOffsetSrc;
  } // end if

  if ((((uiTail + uiSize_of_each) <= uiMax_size) && (uiTail == uiHead) && (uiHead >= (sizeof(OrdListHeader) + uiSize_of_each))) || (((uiTail + uiSize_of_each) > uiMax_size) && (uiHead == sizeof(OrdListHeader)))) {
    // need to resize the container
    uiNew_size = uiMax_size + (uiMax_size - sizeof(OrdListHeader));
    pTemp_cont.value.uiMax_size = uiNew_size;

    if ((hOrdList = MemRealloc(hOrdList, uiNew_size)) == NULL) {
      DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not resize ordered list container memory");
      return NULL;
    }

    pTemp_cont = hOrdList;

    if (do_copy(hOrdList, sizeof(OrdListHeader), uiMax_size, uiHead - sizeof(OrdListHeader)) == FALSE) {
      DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy ordered list container memory");
      return NULL;
    }

    pTemp_cont.value.uiTail = uiMax_size + (uiHead - sizeof(OrdListHeader));

    // now make place for the actual element

    uiOffsetSrc = pTemp_cont.value.uiHead + (uiPos * pTemp_cont.value.uiSiz_of_elem);
    uiOffsetDst = uiOffsetSrc + pTemp_cont.value.uiSiz_of_elem;

    if (do_copy(hOrdList, uiOffsetSrc, uiOffsetDst, uiTail - uiOffsetSrc) == FALSE) {
      DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not store the data in list");
      return NULL;
    }
    pTemp_cont.value.uiTail += uiSize_of_each;
    uiFinalLoc = uiOffsetSrc;
  }

  if (uiFinalLoc == 0) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "This should never happen! report this problem!");
    return NULL;
  }

  // finally insert data at position uiFinalLoc
  pbyte = hOrdList;
  pbyte += uiFinalLoc;
  pvoid = pbyte;
  memmove(pvoid, pdata, pTemp_cont.value.uiSiz_of_elem);
  pTemp_cont.value.uiTotal_items++;

  if (fTail_check == TRUE)
    pTemp_cont.value.uiTail += pTemp_cont.value.uiSiz_of_elem;

  return hOrdList;
}

//*****************************************************************************
//
// AddtoOrdList
//
// Parameter List : HORDLIST - handle to ordered list
//									container
//									data - data to add to the ordered list
//
// Return Value	BOOLEAN true if Add ok else	false
//
// Modification History :
// Nov 26th 1996 -> modified for use by Wizardry
// Dec 19th 1997 -> verified, cleaned up, and heavily commented by AM
//
//*****************************************************************************
function AddtoOrdList(hOrdList: HORDLIST, pdata: Pointer<void>): HORDLIST {
  let pOrdList: Pointer<OrdListHeader>;
  let pTemp_data: Pointer<void>;
  let uiOffset: UINT32;
  let fContinue: BOOLEAN = FALSE;
  let fLessThan: BOOLEAN = FALSE;
  let fMoreThan: BOOLEAN = FALSE;
  let sbResult: INT8;
  let uiPosition: UINT32;

  // get a pointer into the list header
  pOrdList = hOrdList;

  // if the list is empty or full)
  if (pOrdList.value.uiHead == pOrdList.value.uiTail) {
    // if the head offset points to position 0, presumably that means it's empty (?)
    if (pOrdList.value.uiHead == sizeof(OrdListHeader)) {
      // so store it in position 0
      if ((hOrdList = StoreinOrdList(hOrdList, pdata, 0)) == FALSE) {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data into ordered list");
        return NULL;
      }

      return hOrdList;
    }

    // set flag to go through the while loop even though head == tail
    fContinue = TRUE;
  }

  // grab enough space to store one list entry
  pTemp_data = MemAlloc(pOrdList.value.uiSiz_of_elem);

  // start offset by pointing at the last entry in the the list
  uiOffset = pOrdList.value.uiTail;

  // figure out the index of the entry that the tail points to
  uiPosition = (pOrdList.value.uiTail - sizeof(OrdListHeader)) / pOrdList.value.uiSiz_of_elem;

  // continue looping while offset hasn't reached the start of the list yet (or at least once if list is full)
  while ((uiOffset != pOrdList.value.uiHead) || (fContinue)) {
    // when offset reaches the top of the list
    if (uiOffset == sizeof(OrdListHeader)) {
      // wrap around to the very bottom of the list (guaranteed to hold data?)
      uiOffset = pOrdList.value.uiMax_size;
      uiPosition = (pOrdList.value.uiMax_size - sizeof(OrdListHeader)) / pOrdList.value.uiSiz_of_elem;
    }

    // get entry data at the current offset position and store it in pTemp_data
    if (do_copy_data(hOrdList, pTemp_data, (uiOffset - pOrdList.value.uiSiz_of_elem), pOrdList.value.uiSiz_of_elem) == FALSE) {
      DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data from list");
      MemFree(pTemp_data);
      return NULL;
    }

    // run the compare function
    sbResult = pOrdList.value.pCompare(pTemp_data, pdata, pOrdList.value.uiSiz_of_elem);

    // and do the right thing based on the result...
    switch (sbResult) {
      case ORDLIST_ERROR: {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not perform comparison for ordered lists");
        MemFree(pTemp_data);
        return NULL;
      }

      case ORDLIST_EQUAL:
      case ORDLIST_LEFT_LESS: {
        // found the right spot!  Insert it at the current position
        if ((hOrdList = StoreinOrdList(hOrdList, pdata, uiPosition)) == NULL) {
          DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data into ordered list");
          MemFree(pTemp_data);
          return NULL;
        }
        return hOrdList;
      }

      case ORDLIST_RIGHT_LESS: {
        // keep looking
        uiOffset -= pOrdList.value.uiSiz_of_elem;
        uiPosition--;
        break;
      }

      default: {
        DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Invalid result received from Compare function");
        MemFree(pTemp_data);
        return NULL;
      }
    } // end switch

    fContinue = FALSE;
  } // end while

  // don't need this anymore
  MemFree(pTemp_data);
  pTemp_data = NULL;

  // never found the right spot, which means we must have reached the head (damn well better)
  if (uiOffset != pOrdList.value.uiHead) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "ERROR - left the while loop but not at the head");
    return NULL;
  }

  // the new item will be first in list, so calculate the position based on the head
  uiPosition = (pOrdList.value.uiHead - sizeof(OrdListHeader)) / pOrdList.value.uiSiz_of_elem;

  // and stick it in there...
  if ((hOrdList = StoreinOrdList(hOrdList, pdata, uiPosition)) == FALSE) {
    DbgMessage(TOPIC_ORDLIST_CONTAINERS, DBG_LEVEL_0, "Could not copy the data into ordered list");
    return NULL;
  }

  return hOrdList;
}

function Compare(p: Pointer<void>, q: Pointer<void>, size: UINT32): INT8 {
  let temp1: Pointer<TEST>;
  let temp2: Pointer<TEST>;

  temp1 = p;
  temp2 = q;

  if (temp1.value.me < temp2.value.me)
    return ORDLIST_LEFT_LESS;

  if (temp1.value.me > temp2.value.me)
    return ORDLIST_RIGHT_LESS;

  if (temp1.value.me == temp2.value.me)
    return ORDLIST_EQUAL;

  return ORDLIST_ERROR;
}
