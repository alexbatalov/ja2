namespace ja2 {

//
// Make sure the application has a name
//

export const APPLICATION_NAME = "Jagged Alliance 2";

//
// Basic defines for the video manager. These represent the starting values
//

export const SCREEN_WIDTH = 640;
export const SCREEN_HEIGHT = 480;
export const PIXEL_DEPTH = 16;

//
// These defines are used as MUTEX handles.
//

export const MAX_MUTEX_HANDLES = 32;

export const REFRESH_THREAD_MUTEX = 0;
export const FRAME_BUFFER_MUTEX = 1;
export const MOUSE_BUFFER_MUTEX = 2;
const DIRTY_BUFFER_MUTEX = 3;
const SCROLL_MESSAGE_MUTEX = 4;

}
