//
// Make sure the application has a name
//

const APPLICATION_NAME = "Jagged Alliance 2";

//
// Basic defines for the video manager. These represent the starting values
//

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const PIXEL_DEPTH = 16;

//
// These defines are used as MUTEX handles.
//

const MAX_MUTEX_HANDLES = 32;

const REFRESH_THREAD_MUTEX = 0;
const FRAME_BUFFER_MUTEX = 1;
const MOUSE_BUFFER_MUTEX = 2;
const DIRTY_BUFFER_MUTEX = 3;
const SCROLL_MESSAGE_MUTEX = 4;
