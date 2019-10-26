//
// Used with the HireMerc function
//
export const MERC_HIRE_OVER_20_MERCS_HIRED = -1;
export const MERC_HIRE_FAILED = 0;
export const MERC_HIRE_OK = 1;

export const MERC_ARRIVE_TIME_SLOT_1 = (7 * 60 + 30); // 7:30 a.m.
export const MERC_ARRIVE_TIME_SLOT_2 = (13 * 60 + 30); // 1:30 pm
export const MERC_ARRIVE_TIME_SLOT_3 = (19 * 60 + 30); // 7:30 pm

// ATE: This define has been moved to be a function so that
// we pick the most appropriate time of day to use...
//#define		MERC_ARRIVAL_TIME_OF_DAY				 (7 * 60 + 30)		// 7:30 am

export interface MERC_HIRE_STRUCT {
  ubProfileID: UINT8;
  sSectorX: INT16;
  sSectorY: INT16;
  bSectorZ: INT8;
  iTotalContractLength: INT16;
  fCopyProfileItemsOver: boolean;
  uiTimeTillMercArrives: UINT32;
  ubInsertionCode: UINT8;
  usInsertionData: UINT16;
  fUseLandingZoneForArrival: boolean;
}
