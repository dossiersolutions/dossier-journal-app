import React, {Component} from 'react';
import {doFetchJournalChannels, doFetchAllUsers, getEmoji} from "../../data/redux/actions/resourceActions";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {
  ALL_USERS,
  EMOJI,
  LOAD_ALL_CHANNELS,
  LOAD_ALL_LAST_MESSAGES,
  LOAD_ALL_USERS,
  DAT
} from "../../data/redux/actions/constants"
import {CardDeck} from 'reactstrap';
import Header from "../components/Header";
import JournalHeaderLoading from "../placeholders/PageLoader";
import Footer from "../components/Footer";

import UserProfile from "../components/UserProfile";
import {dateSelector} from "../../core/utils/dateUtils";
import {sortByDate} from "../../core/utils/formatingUtils";

class Home extends Component {

  deck_style={
    paddingLeft: "10px",
    paddingRight: "10px"
  }

  componentWillMount() {
      const {
        doFetchJournalChannels,
        doFetchAllUsers,
        getEmoji,
        populateData
      } = this.props;

    if(!populateData){
        doFetchJournalChannels(LOAD_ALL_CHANNELS);
        doFetchAllUsers();
        getEmoji();
      }
  }

  componentDidMount(){
    window.scrollTo(0, 0)
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  onClickHandler (channelId){
    this.nextPath("channel/" + channelId);
  }

  makeProfiles() {
    const {
      im_resourceData
    } = this.props;

    const jsxProfiles = [];
    const jsxLayout = [];
    jsxLayout.push(<Header key={"header"}/>)
    const sortedByMessage = sortByDate(im_resourceData);
    sortedByMessage.forEach((im_data) => {

      const dateTimeUnix = im_data.getIn(["latest_message", "ts"]);
      dateSelector();
      const date = new Date(dateTimeUnix * 1000);
      const customDate = date.customFormat("#DDDD#, #DD# #MMMM# #YYYY#");
      const customTime = date.customFormat("#hh#:#mm# #AMPM#");

      jsxProfiles.push(
          <UserProfile
              key={im_data.get("id")}
              profile_image={im_data.get("profile").get("photo")}
              latest_message={im_data.getIn(["latest_message", "text"])}
              full_name={im_data.get("profile").get("displayName")}
              name={im_data.get("name")}
              clickHandler={() => this.onClickHandler(im_data.get("id"))}
              date={customDate}
              time={customTime}
          />
      )

    });

    const dat = (<CardDeck style={this.deck_style} key={"cardDeck"}>{jsxProfiles}</CardDeck>)
    jsxLayout.push(dat);
    jsxLayout.push(<Footer key={"footer"}/>)

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
      populateData
    } = this.props;

    let jsxData = null;
    // console.log(JSON.stringify(populateData, null, null))


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
      // console.log(this.state)
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

  const im_resourceData = state.resourceReducer.get(LOAD_ALL_CHANNELS);
  const im_resourcesUsers = state.resourceReducer.get(ALL_USERS);
  const im_resourcesEmoji = state.resourceReducer.get(EMOJI);

  const populateData = state.populateReducer.get(LOAD_ALL_CHANNELS);
  const totalCount = state.populateReducer.getIn([LOAD_ALL_CHANNELS, "totalCount"]);
  const populateDataMessages = state.populateReducer.getIn([LOAD_ALL_LAST_MESSAGES, "messages"]);
  const populateDataUsers = state.populateReducer.getIn([LOAD_ALL_USERS, "users"]);
  const populateAllUsers = state.populateReducer.get(ALL_USERS);
  const populateAllEmoji = state.populateReducer.get(EMOJI);

  // console.log("TOATL COUNT "+JSON.stringify(populateDataMessages, null, 2))
  // console.log("This state "+JSON.stringify(state, null, 2));


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
    getEmoji
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
