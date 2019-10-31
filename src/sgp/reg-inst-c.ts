namespace ja2 {

//**************************************************************************
//
// Filename :	RegInst.c
//
//	Purpose :	registry routines
//
// Modification history :
//
//		02dec96:HJH				- Creation
//
//**************************************************************************

//**************************************************************************
//
//				Includes
//
//**************************************************************************

//**************************************************************************
//
//				Defines
//
//**************************************************************************

const REG_KEY_SIZE = 50;

//**************************************************************************
//
//				Variables
//
//**************************************************************************

// INI strings are not localized
/* static */ const szSoftware: string /* TCHAR[] */ = _T("Software");

/* static */ let gszRegistryKey: string /* CHAR[REG_KEY_SIZE] */;
/* static */ let gszAppName: string /* CHAR[REG_KEY_SIZE] */;
/* static */ let gszProfileName: string /* CHAR[REG_KEY_SIZE] */;

//**************************************************************************
//
//				Functions
//
//**************************************************************************

export function InitializeRegistryKeys(lpszAppName: string /* STR */, lpszRegistryKey: string /* STR */): boolean {
  if (lpszAppName == null) {
    return false;
  }
  if (lpszRegistryKey == null) {
    return false;
  }
  // CHECKF(gpszRegistryKey == NULL);
  // CHECKF(gpszAppName == NULL);
  // CHECKF(gpszProfileName == NULL);

  // Note: this will leak the original gpszProfileName, but it
  //  will be freed when the application exits.  No assumptions
  //  can be made on how gpszProfileName was allocated.

  gszAppName = lpszAppName;
  gszRegistryKey = lpszRegistryKey;
  gszProfileName = gszAppName;

  return true;
}

// returns key for HKEY_CURRENT_USER\"Software"\RegistryKey\ProfileName
// creating it if it doesn't exist
// responsibility of the caller to call RegCloseKey() on the returned HKEY
export function GetAppRegistryKey(): HKEY {
  let hAppKey: HKEY = null;
  let hSoftKey: HKEY = null;
  let hCompanyKey: HKEY = null;

  assert(gszRegistryKey[0] != '\0');
  // assert(gpszProfileName != NULL);

  if (RegOpenKeyEx(HKEY_CURRENT_USER, szSoftware, 0, KEY_WRITE | KEY_READ, addressof(hSoftKey)) == ERROR_SUCCESS) {
    let dw: number;
    if (RegCreateKeyEx(hSoftKey, gszRegistryKey, 0, REG_NONE, REG_OPTION_NON_VOLATILE, KEY_WRITE | KEY_READ, null, addressof(hCompanyKey), addressof(dw)) == ERROR_SUCCESS) {
      RegCreateKeyEx(hCompanyKey, gszProfileName, 0, REG_NONE, REG_OPTION_NON_VOLATILE, KEY_WRITE | KEY_READ, null, addressof(hAppKey), addressof(dw));
    }
  }
  if (hSoftKey != null)
    RegCloseKey(hSoftKey);
  if (hCompanyKey != null)
    RegCloseKey(hCompanyKey);

  return hAppKey;
}

// returns key for:
//      HKEY_CURRENT_USER\"Software"\RegistryKey\AppName\lpszSection
// creating it if it doesn't exist.
// responsibility of the caller to call RegCloseKey() on the returned HKEY
function GetSectionKey(lpszSection: string /* STR */): HKEY {
  let hSectionKey: HKEY = null;
  let hAppKey: HKEY = GetAppRegistryKey();
  let dw: number;

  assert(lpszSection != null);

  if (hAppKey == null)
    return null;

  RegCreateKeyEx(hAppKey, lpszSection, 0, REG_NONE, REG_OPTION_NON_VOLATILE, KEY_WRITE | KEY_READ, null, addressof(hSectionKey), addressof(dw));
  RegCloseKey(hAppKey);
  return hSectionKey;
}

function GetProfileInteger(lpszSection: string /* STR */, lpszEntry: string /* STR */, nDefault: number): UINT32 {
  let dwValue: number;
  let dwType: number;
  let dwCount: number = sizeof(DWORD);
  let lResult: number;

  assert(lpszSection != null);
  assert(lpszEntry != null);

  if (gszRegistryKey[0] != '\0') // use registry
  {
    let hSecKey: HKEY = GetSectionKey(lpszSection);
    if (hSecKey == null)
      return nDefault;
    lResult = RegQueryValueEx(hSecKey, lpszEntry, null, addressof(dwType), addressof(dwValue), addressof(dwCount));
    RegCloseKey(hSecKey);
    if (lResult == ERROR_SUCCESS) {
      assert(dwType == REG_DWORD);
      assert(dwCount == sizeof(dwValue));
      return dwValue;
    }
    return nDefault;
  } else {
    assert(gszProfileName[0] != '\0');
    return GetPrivateProfileInt(lpszSection, lpszEntry, nDefault, gszProfileName);
  }
}

function GetProfileChar(lpszSection: string /* STR */, lpszEntry: string /* STR */, lpszDefault: string /* STR */, lpszValue: Pointer<string> /* STR */): boolean {
  let dwType: number;
  let dwCount: number;
  let lResult: number;
  let fRet: boolean = true;
  let strValue: string /* CHAR[200] */;

  assert(lpszSection != null);
  assert(lpszEntry != null);
  assert(lpszDefault != null);

  if (gszRegistryKey[0] != '\0') {
    let hSecKey: HKEY = GetSectionKey(lpszSection);
    if (hSecKey == null) {
      lpszValue = lpszDefault;
      return true;
    }
    lResult = RegQueryValueEx(hSecKey, lpszEntry, null, addressof(dwType), null, addressof(dwCount));
    if (lResult == ERROR_SUCCESS) {
      assert(dwType == REG_SZ);
      lResult = RegQueryValueEx(hSecKey, lpszEntry, null, addressof(dwType), strValue, addressof(dwCount));
    }
    RegCloseKey(hSecKey);
    if (lResult == ERROR_SUCCESS) {
      assert(dwType == REG_SZ);
      lpszValue = strValue;
      return true;
    }
    lpszValue = lpszDefault;
    return true;
  }
  //	else
  //	{
  //		assert(gpszProfileName != NULL);
  //
  //		if (lpszDefault == NULL)
  //			lpszDefault = &afxChNil;    // don't pass in NULL
  //		TCHAR szT[4096];
  //		DWORD dw = ::GetPrivateProfileString(lpszSection, lpszEntry,
  //			lpszDefault, szT, _countof(szT), gpszProfileName);
  //		assert(dw < 4095);
  //		return szT;
  //	}

  return fRet;
}

function GetProfileBinary(lpszSection: string /* STR */, lpszEntry: string /* STR */, ppData: Pointer<Pointer<BYTE>>, pBytes: Pointer<UINT32>): boolean {
  //	DWORD dwType, dwCount;
  //	LONG lResult;
  //
  //	assert(lpszSection != NULL);
  //	assert(lpszEntry != NULL);
  //	assert(ppData != NULL);
  //	assert(pBytes != NULL);
  //	*ppData = NULL;
  //	*pBytes = 0;
  //
  //	if (gpszRegistryKey != NULL)
  //	{
  //		LPBYTE lpByte = NULL;
  //		HKEY hSecKey = GetSectionKey(lpszSection);
  //		if (hSecKey == NULL)
  //			return FALSE;
  //
  //		lResult = RegQueryValueEx(hSecKey, (LPTSTR)lpszEntry, NULL, &dwType,
  //			NULL, &dwCount);
  //		*pBytes = dwCount;
  //		if (lResult == ERROR_SUCCESS)
  //		{
  //			assert(dwType == REG_BINARY);
  //			*ppData = new BYTE[*pBytes];
  //			lResult = RegQueryValueEx(hSecKey, (LPTSTR)lpszEntry, NULL, &dwType,
  //				*ppData, &dwCount);
  //		}
  //		RegCloseKey(hSecKey);
  //		if (lResult == ERROR_SUCCESS)
  //		{
  //			assert(dwType == REG_BINARY);
  //			return TRUE;
  //		}
  //		else
  //		{
  //			delete [] *ppData;
  //			*ppData = NULL;
  //		}
  //		return FALSE;
  //	}
  //	else
  //	{
  //		//assert(gpszProfileName != NULL);
  //		//
  //		//CString str = GetProfileString(lpszSection, lpszEntry, NULL);
  //		//if (str.IsEmpty())
  //		//	return FALSE;
  //		//assert(str.GetLength()%2 == 0);
  //		//int nLen = str.GetLength();
  //		//*pBytes = nLen/2;
  //		//*ppData = new BYTE[*pBytes];
  //		//for (int i=0;i<nLen;i+=2)
  //		//{
  //		//	(*ppData)[i/2] = (BYTE)
  //		//		(((str[i+1] - _T('A')) << 4) + (str[i] - _T('A')));
  //		//}
  //		return TRUE;
  //	}
  return true;
}

function WriteProfileInt(lpszSection: string /* STR */, lpszEntry: string /* STR */, nValue: number): boolean {
  //	LONG lResult;
  //	TCHAR szT[16];
  //
  //	assert(lpszSection != NULL);
  //	assert(lpszEntry != NULL);
  //
  //	if (gpszRegistryKey != NULL)
  //	{
  //		HKEY hSecKey = GetSectionKey(lpszSection);
  //		if (hSecKey == NULL)
  //			return FALSE;
  //		lResult = RegSetValueEx(hSecKey, lpszEntry, NULL, REG_DWORD,
  //			(LPBYTE)&nValue, sizeof(nValue));
  //		RegCloseKey(hSecKey);
  //		return lResult == ERROR_SUCCESS;
  //	}
  //	else
  //	{
  //		assert(gpszProfileName != NULL);
  //
  //		wsprintf(szT, _T("%d"), nValue);
  //		return ::WritePrivateProfileString(lpszSection, lpszEntry, szT,
  //			gpszProfileName);
  //	}
  return true;
}

export function WriteProfileChar(lpszSection: string /* STR */, lpszEntry: string /* STR */, lpszValue: string /* STR */): boolean {
  assert(lpszSection != null);

  if (gszRegistryKey[0] != '\0') {
    let lResult: number;
    if (lpszEntry == null) // delete whole section
    {
      let hAppKey: HKEY = GetAppRegistryKey();
      if (hAppKey == null)
        return false;
      lResult = RegDeleteKey(hAppKey, lpszSection);
      RegCloseKey(hAppKey);
    } else if (lpszValue == null) {
      let hSecKey: HKEY = GetSectionKey(lpszSection);
      if (hSecKey == null)
        return false;
      // necessary to cast away const below
      lResult = RegDeleteValue(hSecKey, lpszEntry);
      RegCloseKey(hSecKey);
    } else {
      let hSecKey: HKEY = GetSectionKey(lpszSection);
      if (hSecKey == null)
        return false;
      lResult = RegSetValueEx(hSecKey, lpszEntry, 0, REG_SZ, lpszValue, (lstrlen(lpszValue) + 1) * sizeof(TCHAR));
      RegCloseKey(hSecKey);
    }
    return lResult == ERROR_SUCCESS;
  }
  //	else
  //	{
  //		assert(gpszProfileName != NULL);
  //		assert(lstrlen(gpszProfileName) < 4095); // can't read in bigger
  //		return ::WritePrivateProfileString(lpszSection, lpszEntry, lpszValue,
  //			gpszProfileName);
  //	}
  return true;
}

function WriteProfileBinary(lpszSection: string /* STR */, lpszEntry: string /* STR */, pData: LPBYTE, nBytes: UINT32): boolean {
  //	assert(lpszSection != NULL);
  //
  //	if (gpszRegistryKey != NULL)
  //	{
  //		LONG lResult;
  //		HKEY hSecKey = GetSectionKey(lpszSection);
  //		if (hSecKey == NULL)
  //			return FALSE;
  //		lResult = RegSetValueEx(hSecKey, lpszEntry, NULL, REG_BINARY,
  //			pData, nBytes);
  //		RegCloseKey(hSecKey);
  //		return lResult == ERROR_SUCCESS;
  //	}
  //
  //	// convert to string and write out
  //	LPTSTR lpsz = new TCHAR[nBytes*2+1];
  //	for (UINT i = 0; i < nBytes; i++)
  //	{
  //		lpsz[i*2] = (TCHAR)((pData[i] & 0x0F) + _T('A')); //low nibble
  //		lpsz[i*2+1] = (TCHAR)(((pData[i] >> 4) & 0x0F) + _T('A')); //high nibble
  //	}
  //	lpsz[i*2] = 0;
  //
  //	assert(gpszProfileName != NULL);
  //
  //	BOOL bResult = WriteProfileString(lpszSection, lpszEntry, lpsz);
  //	delete[] lpsz;
  //	return bResult;
  return true;
}

}
