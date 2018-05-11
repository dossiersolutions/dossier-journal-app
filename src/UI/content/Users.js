import React, {Component} from 'react';
import {
  doFetchAllUsers,
  doFetchJournalChannels,
  doResetState,
  getEmoji
} from "../../data/redux/actions/resourceActions";
import {bindActionCreators} from "redux"
import {
  KEY_GET_ALL_EMOJI,
  KEY_GET_ALL_USERS,
  KEY_UPDATE_CHANNELS,
  KEY_UPDATE_LAST_MESSAGE,
  KEY_UPDATE_USER
} from "../../data/redux/actions/constants";
import {connect} from 'react-redux';

import {CardDeck} from 'reactstrap';
import Header from "../components/Header";
import JournalHeaderLoading from "../placeholders/PageLoader";
import Footer from "../components/Footer";

import UserProfile from "../components/UserProfile";
import {dateSelector} from "../../core/utils/dateUtils";
import {messageNormalized, sortByDate} from "../../core/utils/formatingUtils";

const INPUT_DEBOUNCE_MILLISECONDS = 300000;

class Home extends Component {

  deck_style = {
    paddingLeft: "10px",
    paddingRight: "10px"
  };

  constructor(props) {
    super(props);

    this.state = {
      timerId: null
    }
  };

  componentWillMount() {
    const {
      doFetchJournalChannels,
      doFetchAllUsers,
      getEmoji,
      populateAllEmoji,
      populateData,
      doResetState
    } = this.props;

    this.setState({
      timerId: setInterval(() => this.doDataUpdate(this.props.channel), INPUT_DEBOUNCE_MILLISECONDS)
    });

    if (!populateData || !populateAllEmoji) {
      doResetState();
      doFetchJournalChannels();
      doFetchAllUsers();
      getEmoji();
    }
  }

  doDataUpdate() {
    const {
      doFetchJournalChannels,
      doFetchAllUsers,
      getEmoji,
      doResetState
    } = this.props;

    doResetState();
    doFetchJournalChannels();
    doFetchAllUsers();
    getEmoji();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  fetchUserName(user) {
    const {
      im_resourcesUsers
    } = this.props;

    return im_resourcesUsers.getIn([user, "profile", "real_name"]);
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  onClickHandler(channelId) {
    this.nextPath("channel/" + channelId);
  }

  makeProfiles() {
    const {
      im_resourceData,
      im_resourcesUsers
    } = this.props;

    const jsxProfiles = [];
    const jsxLayout = [];
    jsxLayout.push(<Header key={"header"}/>);
    const sortedByMessage = sortByDate(im_resourceData);
    sortedByMessage.forEach((im_data) => {

      const dateTimeUnix = im_data.getIn(["latest_message", "ts"]);
      dateSelector();
      const date = new Date(dateTimeUnix * 1000);
      const customDate = date.customFormat("#DDDD#, #DD# #MMMM# #YYYY#");
      const customTime = date.customFormat("#hh#:#mm# #AMPM#");

      const latestMessage = im_data.getIn(["latest_message", "text"]);

      const latestPostUser = this.fetchUserName(im_data.getIn(["latest_message", "user"]));

      const message = messageNormalized(latestMessage, im_resourcesUsers);

      jsxProfiles.push(
          <UserProfile
              key={im_data.get("id")}
              profile_image={im_data.get("profile").get("photo")}
              latest_message={message}
              full_name={im_data.get("profile").get("displayName")}
              name={im_data.get("name")}
              clickHandler={() => this.onClickHandler(im_data.get("id"))}
              date={customDate}
              time={customTime}
              latestPostUser={latestPostUser}
          />
      )

    });

    const dat = (<CardDeck style={this.deck_style} key={"cardDeck"}>{jsxProfiles}</CardDeck>);
    jsxLayout.push(dat);
    jsxLayout.push(<Footer key={"footer"}/>);

    return jsxLayout;

  }

  render() {

    const {
      im_resourceData,
      populateDataMessages,
      totalCount,
      populateDataUsers,
      populateAllUsers,
      populateAllEmoji,
      populateData,
    } = this.props;

    let jsxData = null;

    if (
        populateData &&
        populateDataMessages &&
        populateDataUsers &&
        totalCount &&
        populateDataMessages.size === totalCount &&
        populateDataUsers.size === totalCount &&
        populateAllUsers &&
        populateAllEmoji
    ) {
      jsxData = this.makeProfiles(im_resourceData);
    }
    else {
      jsxData = <JournalHeaderLoading/>
    }

    return (
        <div className="Home">
          {jsxData}
        </div>
    );
  }
}

const mapStateToProps = state => {

  const im_resourceData = state.resourceReducer.get(KEY_UPDATE_CHANNELS);
  const im_resourcesUsers = state.resourceReducer.get(KEY_GET_ALL_USERS);
  const im_resourcesEmoji = state.resourceReducer.get(KEY_GET_ALL_EMOJI);

  const populateData = state.populateReducer.get(KEY_UPDATE_CHANNELS);
  const totalCount = state.populateReducer.getIn([KEY_UPDATE_CHANNELS, "totalCount"]);
  const populateDataMessages = state.populateReducer.getIn([KEY_UPDATE_LAST_MESSAGE, "messages"]);
  const populateDataUsers = state.populateReducer.getIn([KEY_UPDATE_USER, "users"]);
  const populateAllUsers = state.populateReducer.get(KEY_GET_ALL_USERS);
  const populateAllEmoji = state.populateReducer.get(KEY_GET_ALL_EMOJI);

  return {
    im_resourceData,
    im_resourcesUsers,
    im_resourcesEmoji,
    populateData,
    populateDataMessages,
    totalCount,
    populateDataUsers,
    populateAllUsers,
    populateAllEmoji
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    doFetchJournalChannels,
    doFetchAllUsers,
    getEmoji,
    doResetState
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
