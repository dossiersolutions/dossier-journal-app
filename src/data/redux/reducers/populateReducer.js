import {fromJS, List, Map} from "immutable";
import {
  TYPE_GET_ALL_EMOJI,
  TYPE_GET_ALL_USERS,
  TYPE_LOAD_MESSAGES,
  TYPE_RESET_STATE,
  TYPE_UPDATE_CHANNELS,
  TYPE_UPDATE_LAST_MESSAGE,
  TYPE_UPDATE_USER,
  TYPE_USER_AUTHENTIFICATION
} from "../actions/./populateActions";

const populateReducer = (state = new Map(), action = {}) => {
  const populateKey = action.populateKey;

  switch (action.type) {
    case TYPE_UPDATE_CHANNELS: {

      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }

      //Update the meta state with resource type and IDs returned from RestApi
      const im_result = fromJS(action.payload);
      if (List.isList(im_result)) {
        if (im_result.size > 0) {
          return state.mergeIn([populateKey], new Map({
            totalCount: im_result.size,
            ids: im_result.map((im_results) => {
              return im_results.get("id");
            })
          }));
        }
        else {
          return state.mergeIn([populateKey], new Map({
            totalCount: 0,
            ids: new List()
          }));
        }
      }
      break;
    }

    case TYPE_UPDATE_LAST_MESSAGE: {
      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }

      const im_result = fromJS(action.payload.messages);
      const im_channelId = im_result.get(0);

      if (!state.getIn([populateKey])) {
        state = state.mergeIn([populateKey], new Map({
          messages: new List()
        }));
        let list = [];
        list.push(im_channelId);
        state = state.mergeIn([populateKey, "messages"], list);
        return state;
      }
      else {
        let list = state.getIn([populateKey, "messages"]);
        if (!list.includes(im_channelId)) {
          list = list.push(im_channelId)
        }
        state = state.mergeIn([populateKey, "messages"], list);
        return state;
      }
    }

    case TYPE_UPDATE_USER: {
      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }

      const im_user = fromJS(action.payload.user);
      const im_userId = im_user.get("id");

      if (!state.getIn([populateKey])) {
        state = state.mergeIn([populateKey], new Map({
          users: new List()
        }));
        let list = [];
        list.push(im_userId);
        state = state.mergeIn([populateKey, "users"], list);
        return state;
      }
      else {
        let list = state.getIn([populateKey, "users"]);
        if (!list.includes(im_userId)) {
          list = list.push(im_userId)
        }
        state = state.mergeIn([populateKey, "users"], list);
        return state;
      }
    }

    case TYPE_LOAD_MESSAGES: {
      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }

      //Update the meta state with resource type and IDs returned from RestApi
      const im_result = fromJS(action.payload.messages);
      const channelId = action.channelId;
      if (List.isList(im_result)) {
        if (im_result.size > 0) {
          return state.mergeIn([populateKey + "_" + channelId], new Map({
            totalCount: im_result.size,
            ids: im_result.map((im_results) => {
              return im_results.get("ts");
            })
          }));
        }
        else {
          return state.mergeIn([populateKey + "_" + channelId], new Map({
            totalCount: 0,
            ids: new List()
          }));
        }
      }
      break;
    }

    case TYPE_USER_AUTHENTIFICATION: {
      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }
      const response = fromJS(action.payload);
      state = state.setIn(["authentificated"], response.get("ok"));
      return state;
    }

    case TYPE_GET_ALL_USERS: {

      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }
      //Update the meta state with resource type and IDs returned from RestApi
      const im_result = fromJS(action.payload.members);

      if (List.isList(im_result)) {
        if (im_result.size > 0) {
          return state.mergeIn([populateKey], new Map({
            totalCount: im_result.size,
            ids: im_result.map((im_results) => {
              return im_results.get("id");
            })
          }));
        }
        else {
          return state.mergeIn([populateKey], new Map({
            totalCount: 0,
            ids: new List()
          }));
        }
      }

      break;
    }

    case TYPE_GET_ALL_EMOJI: {
      // Skip meta state update if the populateKey is missing (meaning only the resourceState will be updated)
      if (!populateKey) {
        return state;
      }
      const im_result = fromJS(action.payload.emoji);

      if (!im_result.isEmpty()) {
        return state.mergeIn([populateKey], new Map({
          totalCount: im_result.size,
          ids: im_result
        }));
      }
      else {
        return state.mergeIn([populateKey], new Map({
          totalCount: 0,
          ids: new Map()
        }));
      }
    }

    case TYPE_RESET_STATE: {
      state = state.clear();
      return state;
    }

    default:
      return state;
  }

};

export default populateReducer;