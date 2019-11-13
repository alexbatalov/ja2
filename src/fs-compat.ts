namespace ja2 {

const fs: typeof import('fs') = require('fs');

export type HANDLE = number;
export const INVALID_HANDLE_VALUE = 0xFFFFFFFF;

export const GENERIC_WRITE = 0x40000000;
export const GENERIC_READ = 0x80000000;

export const CREATE_NEW = 1;
export const CREATE_ALWAYS = 2;
export const OPEN_EXISTING = 3;
export const OPEN_ALWAYS = 4;
export const TRUNCATE_EXISTING = 5;

export const FILE_FLAG_RANDOM_ACCESS = 0x10000000;
export const FILE_FLAG_DELETE_ON_CLOSE = 0x04000000;

export const FILE_ATTRIBUTE_ARCHIVE = 0x20;
export const FILE_ATTRIBUTE_COMPRESSED = 0x800;
export const FILE_ATTRIBUTE_HIDDEN = 0x2;
export const FILE_ATTRIBUTE_NORMAL = 0x80;
export const FILE_ATTRIBUTE_OFFLINE = 0x1000;
export const FILE_ATTRIBUTE_READONLY = 0x1;
export const FILE_ATTRIBUTE_SYSTEM = 0x4;
export const FILE_ATTRIBUTE_TEMPORARY = 0x100;
export const FILE_ATTRIBUTE_DIRECTORY = 0x10;

export const FILE_BEGIN = 0;
export const FILE_CURRENT = 1;
export const FILE_END = 2;

export interface FILETIME {
  dwLowDateTime: number;
  dwHighDateTime: number;
}

export function createFileTime(): FILETIME {
  return {
    dwLowDateTime: 0,
    dwHighDateTime: 0,
  };
}

export const FILETIME_SIZE = 8;

export function CreateFile(lpFileName: string, dwDesiredAccess: number, dwShareMode: number, lpSecurityAttributes: null, dwCreationDisposition: number, dwFlagsAndAttributes: number, hTemplateFile: null): HANDLE {
  let flags = 0;

  switch (dwDesiredAccess) {
    case GENERIC_WRITE | GENERIC_READ:
      flags |= fs.constants.O_RDWR;
      break;
    case GENERIC_WRITE:
      flags |= fs.constants.O_WRONLY;
      break;
    case GENERIC_READ:
      flags |= fs.constants.O_RDONLY;
      break;
    default:
      throw new Error('Should be unreachable');
  }

  switch (dwCreationDisposition) {
    case CREATE_NEW:
      flags |= (fs.constants.O_CREAT | fs.constants.O_EXCL);
      break;
    case CREATE_ALWAYS:
      flags |= (fs.constants.O_CREAT | fs.constants.O_TRUNC);
      break;
    case OPEN_EXISTING:
      flags |= fs.constants.O_EXCL;
      break;
    case OPEN_ALWAYS:
      flags |= fs.constants.O_CREAT;
      break;
    case TRUNCATE_EXISTING:
      flags |= fs.constants.O_TRUNC;
      break;
    default:
      throw new Error('Should be unreachable');
  }

  switch (dwFlagsAndAttributes) {
    case FILE_FLAG_RANDOM_ACCESS:
      break;
    default:
      throw new Error('Should be unreachable');
  }

  try {
    const fd = fs.openSync(lpFileName, flags);

    setFilePosition(fd, 0);

    return fd;
  } catch {
    return INVALID_HANDLE_VALUE;
  }
}

export function ReadFile(hFile: HANDLE, lpBuffer: Buffer, nNumberOfBytesToRead: number): number {
  const position = getFilePosition(hFile);

  try {
    const bytesRead = fs.readSync(hFile, lpBuffer, 0, nNumberOfBytesToRead, position);

    setFilePosition(hFile, position + bytesRead);

    return bytesRead;
  } catch {
    return -1;
  }
}

export function WriteFile(hFile: HANDLE, lpBuffer: Buffer, nNumberOfBytesToWrite: number): number {
  const position = getFilePosition(hFile);

  try {
    const bytesWritten = fs.writeSync(hFile, lpBuffer, 0, nNumberOfBytesToWrite, position);

    setFilePosition(hFile, position + bytesWritten);

    return bytesWritten;
  } catch {
    return -1;
  }
}

export function CloseHandle(hHandle: HANDLE): boolean {
  deleteFilePosition(hHandle);

  fs.closeSync(hHandle);

  return true;
}

export function GetFileSize(hFile: HANDLE, lpFileSizeHigh: null): number {
  const { size } = fs.fstatSync(hFile);
  return size;
}

const handleToPositionMap = new Map<HANDLE, number>();

function getFilePosition(hFile: HANDLE): number {
  return handleToPositionMap.get(hFile) || 0;
}

function setFilePosition(hFile: HANDLE, position: number) {
  handleToPositionMap.set(hFile, position);
}

function deleteFilePosition(hFile: HANDLE) {
  handleToPositionMap.delete(hFile);
}

export function SetFilePointer(hFile: HANDLE, lDistanceToMove: number, lpDistanceToMoveHigh: null, dwMoveMethod: number) {
  let position = getFilePosition(hFile);

  switch (dwMoveMethod) {
    case FILE_BEGIN:
      position = lDistanceToMove;
      break;
    case FILE_CURRENT:
      position += lDistanceToMove;
      break;
    case FILE_END:
      position = GetFileSize(hFile, null) + lDistanceToMove;
      break;
    default:
      throw new Error('Should be unreachable');
  }

  setFilePosition(hFile, position);

  return position;
}

export function DeleteFile(lpFileName: string): boolean {
  try {
    fs.unlinkSync(lpFileName);
    return true;
  } catch {
    return false;
  }
}

export function CreateDirectory(lpPathName: string, lpSecurityAttributes: null): boolean {
  try {
    fs.mkdirSync(lpPathName);
    return true;
  } catch {
    return false;
  }
}

export function RemoveDirectory(lpPathName: string): boolean {
  try {
    fs.rmdirSync(lpPathName);
    return true;
  } catch {
    return false;
  }
}

export function readStringNL(buffer: Buffer, encoding: 'ascii' | 'utf16le', start: number, end: number): string {
  const s = buffer.toString(encoding, start, end);
  const pos = s.indexOf('\0');
  return pos !== -1 ? s.substring(0, pos) : s;
}

export function writeStringNL(string: string, buffer: Buffer, offset: number, length: number, encoding: 'ascii' | 'utf16le'): number {
  const bytesWritten = buffer.write(string, offset, length, encoding);
  if (bytesWritten < length) {
    buffer.fill(0, offset + bytesWritten, offset + length);
  }
  return offset + length;
}

}
