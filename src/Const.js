// System consts
export const WORK_APP_URL = '10.1.53.185:9191/back/';
export const HOME_APP_URL = '192.168.0.102:9191/back/';
export const DACHA_APP_URL = '192.168.1.38:9191/back/';
export const APP_URL = 'http://' + WORK_APP_URL + 'FrontServlet';
export const CHAT_URL = 'ws://' + WORK_APP_URL + 'chat/';

//Supported browsers
export const BROWSER_CHROME = "CHROME";
export const BROWSER_FIREFOX = "FIREFOX";
export const BROWSER_IE = "IE";

export const AUTH = "auth";
export const AUTH_LOGIN = "auth_login";
export const AUTH_CHANGE_PASSWORD = "auth_change_password";
export const AUTH_SET_NEW_PASSWORD = "auth_set_new_password";

export const COMMON = "common";
export const COMMON_GEN_UUID = "common_gen_uuid";

export const CHAT = "chat";
export const CHAT_USER_LIST = "chat_user_list";
export const CHAT_USER_HISTORY = "chat_user_history";

export const ATTACH = "attach";
export const ATTACH_SAVE_FILE = "attach_save_file";
export const ATTACH_GET_FILE = "attach_get_file";

//Entity contexts
export const USER = "user";
export const USER_ROLE = "userRole";
export const BASE_PACKAGE = "basePackage";
export const REPAIR_APP = "repairApp";
export const CONFIG_PARAM = "configParam";
export const ROOM_TYPE = "roomType";
export const ROOM_ADD_OBJECT = "roomAddObject";
export const ROOM_EXCLUDE_OBJECT = "roomExcludeObject";

//Common entity actions
export const LIST_ACTION = "entity_list";
export const GET_ACTION = "entity_get";
export const NEW_ACTION = "entity_new";
export const SAVE_ACTION = "entity_save";
export const DELETE_ACTION = "entity_delete";

//User role Consts
export const SUPERUSER_ROLE = "superuser"; // Суперпользователь
export const CLIENT_ROLE = "client"; // Клиент светелкина

//ChatMessage type
export const CHAT_MESSAGE_TEXT_TYPE = "text";
export const CHAT_MESSAGE_FILE_TYPE = "file";
export const CHAT_USER_STATE = "chatUserState";

//Chat user state
export const ONLINE_STATE = "online";
export const OFFLINE_STATE = "offline";





