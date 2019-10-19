//#include "LaptopSave.h"

const BOBBYRDESCFILE = "BINARYDATA\\BrayDesc.edt";

const BOBBYR_ITEM_DESC_NAME_SIZE = 160;
const BOBBYR_ITEM_DESC_INFO_SIZE = 640;
const BOBBYR_ITEM_DESC_FILE_SIZE = 800;

const BOBBYR_USED_ITEMS = 0xFFFFFFFF;

const BOBBYR_GUNS_BUTTON_FONT = () => FONT10ARIAL();
const BOBBYR_GUNS_TEXT_COLOR_ON = FONT_NEARBLACK;
const BOBBYR_GUNS_TEXT_COLOR_OFF = FONT_NEARBLACK;
//#define		BOBBYR_GUNS_TEXT_COLOR_ON					FONT_MCOLOR_DKWHITE
//#define		BOBBYR_GUNS_TEXT_COLOR_OFF				FONT_MCOLOR_WHITE

const BOBBYR_GUNS_SHADOW_COLOR = 169;

const BOBBYR_NO_ITEMS = 65535;

extern UINT16 gusCurWeaponIndex;
extern UINT8 gubLastGunIndex;

void GameInitBobbyRGuns();
BOOLEAN EnterBobbyRGuns();
void ExitBobbyRGuns();
void HandleBobbyRGuns();
void RenderBobbyRGuns();

BOOLEAN DisplayBobbyRBrTitle();
BOOLEAN DeleteBobbyBrTitle();
BOOLEAN InitBobbyBrTitle();
BOOLEAN InitBobbyMenuBar();
BOOLEAN DeleteBobbyMenuBar();

// BOOLEAN DisplayWeaponInfo();
BOOLEAN DisplayItemInfo(UINT32 uiItemClass);
void DeleteMouseRegionForBigImage();
void UpdateButtonText(UINT32 uiCurPage);
void EnterInitBobbyRGuns();
void DailyUpdateOfBobbyRaysUsedInventory();
UINT16 CalcBobbyRayCost(UINT16 usIndex, UINT16 usBobbyIndex, BOOLEAN fUsed);
// void CalculateFirstAndLastIndexs();
void SetFirstLastPagesForUsed();
void SetFirstLastPagesForNew(UINT32 uiClass);
