namespace ja2 {

//**************************************************************************
//
// Filename :	FileMan.h
//
//	Purpose :	prototypes for the file manager
//
// Modification history :
//
//		24sep96:HJH				- Creation
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

const MAX_FILENAME_LEN = 48;

export const FILE_ACCESS_READ = 0x01;
export const FILE_ACCESS_WRITE = 0x02;
export const FILE_ACCESS_READWRITE = 0x03;

export const FILE_CREATE_NEW = 0x0010; // create new file. fail if exists
export const FILE_CREATE_ALWAYS = 0x0020; // create new file. overwrite existing
export const FILE_OPEN_EXISTING = 0x0040; // open a file. fail if doesn't exist
export const FILE_OPEN_ALWAYS = 0x0080; // open a file, create if doesn't exist
export const FILE_TRUNCATE_EXISTING = 0x0100; // open a file, truncate to size 0. fail if no exist

export const FILE_SEEK_FROM_START = 0x01; // keep in sync with dbman.h
export const FILE_SEEK_FROM_END = 0x02; // keep in sync with dbman.h
export const FILE_SEEK_FROM_CURRENT = 0x04; // keep in sync with dbman.h

// GetFile file attributes
export const FILE_IS_READONLY = 1;
export const FILE_IS_DIRECTORY = 2;
export const FILE_IS_HIDDEN = 4;
export const FILE_IS_NORMAL = 8;
export const FILE_IS_ARCHIVE = 16;
export const FILE_IS_SYSTEM = 32;
export const FILE_IS_TEMPORARY = 64;
export const FILE_IS_COMPRESSED = 128;
export const FILE_IS_OFFLINE = 256;

// File Attributes settings
export const FILE_ATTRIBUTES_ARCHIVE = FILE_ATTRIBUTE_ARCHIVE;
export const FILE_ATTRIBUTES_HIDDEN = FILE_ATTRIBUTE_HIDDEN;
export const FILE_ATTRIBUTES_NORMAL = FILE_ATTRIBUTE_NORMAL;
export const FILE_ATTRIBUTES_OFFLINE = FILE_ATTRIBUTE_OFFLINE;
export const FILE_ATTRIBUTES_READONLY = FILE_ATTRIBUTE_READONLY;
export const FILE_ATTRIBUTES_SYSTEM = FILE_ATTRIBUTE_SYSTEM;
export const FILE_ATTRIBUTES_TEMPORARY = FILE_ATTRIBUTE_TEMPORARY;
export const FILE_ATTRIBUTES_DIRECTORY = FILE_ATTRIBUTE_DIRECTORY;

export type SGP_FILETIME = FILETIME;

//**************************************************************************
//
//				Function Prototypes
//
//**************************************************************************

export interface GETFILESTRUCT {
  iFindHandle: INT32;
  zFileName: string /* CHAR8[260] */; // changed from UINT16, Alex Meduna, Mar-20'98
  uiFileSize: UINT32;
  uiFileAttribs: UINT32;
}

}
