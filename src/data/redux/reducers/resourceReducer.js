import {fromJS, Iterable, List, Map} from "immutable";
import _ from "lodash";
import {
  TYPE_GET_ALL_EMOJI,
  TYPE_GET_ALL_USERS,
  TYPE_LOAD_MESSAGES,
  TYPE_RESET_STATE,
  TYPE_UPDATE_CHANNELS,
  TYPE_UPDATE_LAST_MESSAGE,
  TYPE_UPDATE_USER
} from "../actions/./populateActions";

const resourceReducer = (im_state = new Map(), action = {}) => {
  const populateKey = action.populateKey;
  let im_newState = im_state;

  switch (action.type) {
    case TYPE_UPDATE_CHANNELS: {
      const im_resourceState = fromJS(action.payload);
        if (!!im_resourceState && !im_resourceState.isEmpty()) {
          im_newState = im_newState.setIn([populateKey], new List())
          im_resourceState.forEach((im_resources, resourceName) => {
            im_resources.forEach((im_resource, resourceId) => {
              im_newState = im_newState.setIn([populateKey, resourceName, resourceId], im_resource);
            });
          });
        }

      break;
    }

    case TYPE_UPDATE_LAST_MESSAGE: {
      const im_lastMessage = fromJS(action.payload.messages);
      if (!!im_lastMessage && !im_lastMessage.isEmpty()) {

        const index = im_newState.get("loadAllChannels").findIndex(item => item.get("id") === action.channelId);

        let msg = null;
        for(let i = 0; i< im_lastMessage.size; i++){
          if(!im_lastMessage.get(i).get("subtype")){
            msg = im_lastMessage.get(i);
            break;
          }
        }

        const latest_message = {latest_message : msg};

        im_newState = im_newState.mergeIn(["loadAllChannels", index], latest_message)
      }

      break;
    }

    case TYPE_UPDATE_USER: {
      const im_user = fromJS(action.payload.user);
      if (!!im_user && !im_user.isEmpty()) {
        const index = im_newState.get("loadAllChannels").findIndex(item => item.get("creator") === im_user.get("id"));

        const user_realName = {displayName: im_user.getIn(["profile", "real_name_normalized"])};
        const user_displayNameNormalized = {displayNameNorm: im_user.getIn(["profile", "display_name_normalized"])};
        const user_photo_512 = {photo: im_user.getIn(["profile", "image_512"])};

        let profile = new Map();
        profile = profile.mergeIn(["profile"], user_realName);
        profile = profile.mergeIn(["profile"], user_displayNameNormalized);
        profile = profile.mergeIn(["profile"], user_photo_512);
        im_newState = im_newState.mergeIn(["loadAllChannels", index], profile)
      }

      break;
    }

    case TYPE_LOAD_MESSAGES: {
      const im_resourceState = fromJS(action.payload.messages);
      const channelId = action.channelId;
      if (!!im_resourceState && !im_resourceState.isEmpty()) {
        im_newState = im_newState.setIn([populateKey], new List())
        im_resourceState.forEach((im_resources, resourceName) => {
          im_resources.forEach((im_resource, resourceId) => {
            im_newState = im_newState.setIn([populateKey+"_"+channelId, resourceName, resourceId], im_resource);
          });
        });
      }

      break;
    }

    case TYPE_GET_ALL_USERS: {
      const im_resourceState = fromJS(action.payload.members);
      if (!!im_resourceState && !im_resourceState.isEmpty()) {
        im_newState = im_newState.setIn([populateKey], new Map())
        im_resourceState.forEach((im_resources, resourceName) => {
          im_resources.forEach((im_resource, resourceId) => {
            im_newState = im_newState.setIn([populateKey, im_resources.get("id"), resourceId], im_resource);
          });
        });
      }

      break;
    }

    case TYPE_GET_ALL_EMOJI: {

      const im_resourceState = fromJS(action.payload.emoji);
      if (!!im_resourceState && !im_resourceState.isEmpty()) {
        im_newState = im_newState.setIn([populateKey], new Map())
        im_resourceState.forEach((im_resources, resourceName) => {
            im_newState = im_newState.setIn([populateKey, ":"+resourceName+":", resourceName], im_resources);
        });
      }


      // if (!im_resourceState.isEmpty()) {
      //   im_newState = im_newState.mergeIn([populateKey], new Map({
      //     totalCount: im_resourceState.size,
      //     ids: im_resourceState
      //   }));
      //   return im_newState;
      // }
      // else {
      //   im_newState = im_newState.mergeIn([populateKey], new Map({
      //     totalCount: 0,
      //     ids: new Map()
      //   }));
      //   return im_newState;
      // }

      break;

    }

    case TYPE_RESET_STATE: {
      im_newState = im_newState.clear();
      return im_newState;
    }

    default:
      im_newState = im_state;
  }

  return im_newState.filter((resource) => {
    return !!resource && !(Iterable.isIterable(resource) && resource.isEmpty());
  });

}

export default resourceReducer;