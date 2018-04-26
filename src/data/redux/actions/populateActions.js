//Populate types
export const TYPE_UPDATE_CHANNELS = "TYPE_UPDATE_CHANNELS";
export const TYPE_UPDATE_LAST_MESSAGE = "TYPE_UPDATE_LAST_MESSAGE";
export const TYPE_UPDATE_USER = "TYPE_UPDATE_USER";
export const TYPE_LOAD_MESSAGES = "TYPE_LOAD_MESSAGES";
export const TYPE_USER_AUTHENTIFICATION = "TYPE_USER_AUTHENTIFICATION";
export const TYPE_GET_ALL_USERS = "TYPE_GET_ALL_USERS";
export const TYPE_GET_ALL_EMOJI = "TYPE_GET_ALL_EMOJI";
export const TYPE_RESET_STATE = "TYPE_RESET_STATE";

export function updateResources(result, populateKey, type) {
  return {
    type: type,
    payload: result,
    populateKey: populateKey
  };
}

export function updateResourcesWithIds(result, populateKey, type, channelId) {
  return {
    type: type,
    payload: result,
    populateKey: populateKey,
    channelId: channelId
  };
}