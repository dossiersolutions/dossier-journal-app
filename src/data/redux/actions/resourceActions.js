import {TYPE_UPDATE_CHANNELS, TYPE_UPDATE_LAST_MESSAGE, TYPE_UPDATE_USER, TYPE_LOAD_MESSAGES, TYPE_USER_AUTHENTIFICATION, TYPE_GET_ALL_USERS, TYPE_GET_ALL_EMOJI, TYPE_RESET_STATE, updateResources, updateResourcesWithIds} from "./populateActions";
import {fromJS, List} from "immutable";
import {
  KEY_UPDATE_LAST_MESSAGE, KEY_GET_ALL_USERS, KEY_LOAD_MESSAGES, KEY_USER_AUTHENTIFICATION, KEY_UPDATE_USER,
  KEY_GET_ALL_EMOJI, KEY_RESET_STATE, KEY_UPDATE_CHANNELS
} from "./constants";
const {WebClient} = require('@slack/client');
const web = new WebClient();

function getToken(){
  const SLACK_TOKEN = window.sessionStorage.getItem("token");
  if(SLACK_TOKEN){
    return SLACK_TOKEN;
  }else{
    return getIndexPage();
  }
}

function getIndexPage(){
  window.location.href="/";
}


export function doFetchJournalChannels() {

  web.token = getToken();

  return (dispatch) => {

    //Taking all channels list
    web.channels.list()
        .then((result) => {
          // `res` contains information about the channels
          const im_response = fromJS(result);
          const im_result = im_response.get("channels");

          let filteredResults = new List();

          // populate Journal channel list
          im_result.forEach((res) => {
            if (res.get("name").includes("journal")) {
              filteredResults = filteredResults.push(res);
            }
          });

          // dispatch results for taken list of journal channels
          dispatch(updateResources(filteredResults, KEY_UPDATE_CHANNELS, TYPE_UPDATE_CHANNELS));

          im_result.forEach((res) => {
            if (res.get("name").includes("journal")) {

              // populate last messages from channels
              const channel = {channel: res.get("id")};
              web.channels.history(channel)
                  .then((result) => {
                    dispatch(updateResourcesWithIds(result, KEY_UPDATE_LAST_MESSAGE, TYPE_UPDATE_LAST_MESSAGE, res.get("id")));

                  })
                  .catch(console.error);

              // populate channels/user from all journal channels
              const user = {user: res.get("creator")};
              web.users.info(user)
                  .then((result) => {
                    dispatch(updateResources(result, KEY_UPDATE_USER, TYPE_UPDATE_USER));

                  })
                  .catch(console.error);
            }
          });

        })
        .catch(console.error);
  }

}

export function doFetchJournalById(channelId) {

  web.token = getToken();

  return (dispatch) => {

    const channel = {channel: channelId};

    web.channels.history(channel)
        .then((result) => {

          dispatch(updateResourcesWithIds(result, KEY_LOAD_MESSAGES, TYPE_LOAD_MESSAGES, channelId));

        })
        .catch(console.error);
  }
}

export function doFetchAllUsers() {

  web.token =  getToken();

  return (dispatch) => {

    web.users.list()
        .then((result) => {

          dispatch(updateResources(result, KEY_GET_ALL_USERS, TYPE_GET_ALL_USERS));

        })
        .catch(console.error);
  }
}

export function getEmoji() {

  web.token =  getToken();

  return (dispatch) => {

    web.emoji.list()
        .then((result) => {

          dispatch(updateResources(result, KEY_GET_ALL_EMOJI, TYPE_GET_ALL_EMOJI));

        })
        .catch(console.error);
  }
}

export function doCheckToken() {

  web.token =  getToken();

  return (dispatch) => {

    const token = {token:  window.sessionStorage.getItem("token")};

    web.auth.test(token)
        .then((result) => {

          dispatch(updateResources(result, KEY_USER_AUTHENTIFICATION, TYPE_USER_AUTHENTIFICATION));

        })
        .catch(function (err) {
          if(err){
            const res = {"ok":false};
            dispatch(updateResources(res, KEY_USER_AUTHENTIFICATION, TYPE_USER_AUTHENTIFICATION));
          }
        })
  }
}


export function doResetState() {

  return (dispatch) => {
          dispatch(updateResources(null, KEY_RESET_STATE, TYPE_RESET_STATE));
  }
}



