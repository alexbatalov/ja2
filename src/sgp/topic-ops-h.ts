// debug levels

const DBG_LEVEL_0 = 0; // for registering and unregistering topics only
const DBG_LEVEL_1 = 1; // for basic stuff
const DBG_LEVEL_2 = 2; // for ordinary, I usually want to see them, messages
const DBG_LEVEL_3 = 3; // nitty gritty detail

// from client

const TOPIC_REGISTER = 0;
const TOPIC_UNREGISTER = 1;
const TOPIC_MESSAGE = 2;
const CLIENT_REGISTER = 3;
const CLIENT_SHUTDOWN = 4;

// from server

const SYSTEM_SHUTDOWN = 0;
const MODULE_RESET = 1;
const SET_DEBUG_LEVEL = 2;
