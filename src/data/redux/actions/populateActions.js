export const UPDATE_CHANNELS = "UPDATE_CHANNELS";
export const UPDATE_LAST_MESSAGE = "UPDATE_LAST_MESSAGE";
export const UPDATE_USER = "UPDATE_USER";
export const LOAD_MESSAGES = "LOAD_MESSAGES";
export const USER_AUTHENTIFICATION = "USER_AUTHENTIFICATION"
export const GET_ALL_USERS = "GET_ALL_USERS"
export const GET_ALL_EMOJI = "GET_ALL_EMOJI"



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