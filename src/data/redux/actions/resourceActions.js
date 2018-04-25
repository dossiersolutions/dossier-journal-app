import {UPDATE_CHANNELS, UPDATE_LAST_MESSAGE, UPDATE_USER, LOAD_MESSAGES, USER_AUTHENTIFICATION, GET_ALL_USERS, GET_ALL_EMOJI, updateResources, updateResourcesWithIds} from "./populateActions";
import {fromJS, List} from "immutable";
import {LOAD_ALL_LAST_MESSAGES, LOAD_ALL_USERS, CHANNEL_MESSAGES, USER_AUTH, ALL_USERS, EMOJI} from "./constants";

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


export function doFetchJournalChannels(populateKey) {

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
          dispatch(updateResources(filteredResults, populateKey, UPDATE_CHANNELS));

          im_result.forEach((res) => {
            if (res.get("name").includes("journal")) {

              // populate last messages from channels
              const channel = {channel: res.get("id")}
              web.channels.history(channel)
                  .then((result) => {
                    dispatch(updateResourcesWithIds(result, LOAD_ALL_LAST_MESSAGES, UPDATE_LAST_MESSAGE, res.get("id")));

                  })
                  .catch(console.error);

              // populate channels/user from all journal channels
              const user = {user: res.get("creator")}
              web.users.info(user)
                  .then((result) => {
                    dispatch(updateResources(result, LOAD_ALL_USERS, UPDATE_USER));

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

    const channel = {channel: channelId}

    web.channels.history(channel)
        .then((result) => {

          dispatch(updateResourcesWithIds(result, CHANNEL_MESSAGES, LOAD_MESSAGES, channelId));

        })
        .catch(console.error);
  }
}

export function doFetchAllUsers() {

  web.token =  getToken();

  return (dispatch) => {

    web.users.list()
        .then((result) => {

          dispatch(updateResources(result, ALL_USERS, GET_ALL_USERS));

        })
        .catch(console.error);
  }
}

export function getEmoji() {

  web.token =  getToken();

  return (dispatch) => {

    web.emoji.list()
        .then((result) => {

          dispatch(updateResources(result, EMOJI, GET_ALL_EMOJI));

        })
        .catch(console.error);
  }
}

export function doCheckToken() {

  web.token =  getToken();

  return (dispatch) => {

    const token = {token:  window.sessionStorage.getItem("token")}

    web.auth.test(token)
        .then((result) => {

          dispatch(updateResources(result, USER_AUTH, USER_AUTHENTIFICATION));

        })
        .catch(function (err) {
          if(err){
            const res = {"ok":false}
            dispatch(updateResources(res, USER_AUTH, USER_AUTHENTIFICATION));
          }
        })
  }
}



