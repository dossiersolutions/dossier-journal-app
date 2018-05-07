import React, {Component} from 'react';
import {
  doFetchAllUsers,
  doFetchJournalById,
  doFetchJournalChannels,
  getEmoji
} from "../../data/redux/actions/resourceActions";
import {bindActionCreators} from "redux";
import {
  KEY_GET_ALL_EMOJI,
  KEY_GET_ALL_USERS,
  KEY_LOAD_MESSAGES,
  KEY_UPDATE_CHANNELS
} from "../../data/redux/actions/constants";
import {connect} from 'react-redux';
import JournalHeaderLoading from "../placeholders/PageLoader";
import Header from "../components/Header";
import logo from "../../media/images/dossier-logo.jpg";
import UserMessage from "../components/UserMessage";
import Footer from "../components/Footer";
import {messageNormalized} from "../../core/utils/formatingUtils";
import parser from "html-react-parser";
import {emojiInitialize} from "../.././core/utils/formatingUtils"
import {dateSelector} from "../../core/utils/dateUtils";

const INPUT_DEBOUNCE_MILLISECONDS = 180000;

class Channel extends Component {

  img = {
    width: "90px"
  };

  constructor(props) {
    super(props);

    this.state = {
      timerId: null
    }
  }

  componentWillMount() {
    const {
      channel,
      doFetchJournalById,
      doFetchJournalChannels,
      populateAllUsers,
      populateData,
      doFetchAllUsers,
      populateEmoji,
      getEmoji
    } = this.props;

    const {
      emoji
    } = this.state;

    this.setState({emoji: emojiInitialize()});
    this.setState({
      timerId: setInterval(() => this.doDataUpdate(this.props.channel), INPUT_DEBOUNCE_MILLISECONDS)
    });

    doFetchJournalById(channel);
    if (!populateData && !populateAllUsers && !populateEmoji) {
      doFetchJournalChannels();
      doFetchAllUsers();
      getEmoji();
    }
  }

  doDataUpdate(channel) {
    const {
      doFetchJournalById,
    } = this.props;

    doFetchJournalById(channel);
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  fetchUserChannelTitle() {
    const {
      channel,
      im_resourceData
    } = this.props;

    const index = im_resourceData.findIndex(item => item.get("id") === channel);
    return im_resourceData.getIn([index, "name_normalized"]);
  }

  fetchUserPhoto(user) {
    const {
      im_resourcesUsers
    } = this.props;

    return im_resourcesUsers.getIn([user, "profile", "image_192"]);
  }

  fetchUserName(user) {
    const {
      im_resourcesUsers
    } = this.props;

    return im_resourcesUsers.getIn([user, "profile", "real_name"]);
  }

  setEmoji(text) {

  }

  makeJsx() {
    const {
      im_resourceMessages,
      im_resourcesUsers
    } = this.props;

    const {
      emoji
    } = this.state;

    const jsxData = [];

    const userJournalName = "# " + this.fetchUserChannelTitle();

    jsxData.push(<Header key={"header"} headerTitle={userJournalName}/>);
    im_resourceMessages.forEach((im_data, index) => {

      // Check if message is regular user's message or comment
      let userPhoto = this.fetchUserPhoto(im_data.get("user"));

      if(!userPhoto && im_data.get("subtype") === "file_comment"){
        userPhoto = this.fetchUserPhoto(im_data.getIn(["comment", "user"]));
      }

      const userName = this.fetchUserName(im_data.get("user"));

      const message = messageNormalized(im_data.get("text"), im_resourcesUsers);

      // Check if message has a file and provide the file or null
      const fileCheck = im_data.get("file") ? im_data.get("file") : null;

      let file = null;
      if(fileCheck){
        const fileName = im_data.getIn(["file", "name"]);
        if( fileName.includes(".png") ||
            fileName.includes(".gif") ||
            fileName.includes(".jpg") ||
            fileName.includes(".jpeg")||
            fileName.includes(".pdf"))
        {
          file = im_data.getIn(["file", "url_private"]);
        }
      }

      const dateTimeUnix = im_data.get("ts");
      dateSelector();
      const date = new Date(dateTimeUnix * 1000);
      const customDate = date.customFormat("#DDDD#, #DD# #MMMM# #YYYY#");
      const customTime = date.customFormat("#hh#:#mm# #AMPM#");

      const messageHtmlToReact = parser(emoji.replace_colons(message));

      jsxData.push(
          // const userPhoto = this.findUserPhoto();
          <UserMessage
              key={index}
              message={messageHtmlToReact}
              userPhoto={userPhoto}
              userName={userName}
              date={customDate}
              time={customTime}
              file={file}
          >
            <img width="120px" className="rounded" style={this.img} src={logo} alt="user_photo"/>
          </UserMessage>
      )
    });
    jsxData.push(<Footer key={"footer"}/>);

    return jsxData;
  }

  render() {
    const {
      im_resourceMessages,
      populateMessages,
      populateAllUsers,
      populateData,
      populateEmoji
    } = this.props;

    let jsxData = null;

    if (populateMessages &&
        populateAllUsers &&
        populateData &&
        populateEmoji
    ) {
      jsxData = this.makeJsx(im_resourceMessages);
    }
    else {
      jsxData = <JournalHeaderLoading/>
    }

    return (
        <div className="Channel">
          {jsxData}
        </div>
    );
  }
}

function mapStateToProps(im_state, props) {
  const channel = props.match.params.channelId;

  const im_resourceMessages = im_state.resourceReducer.get(KEY_LOAD_MESSAGES + "_" + channel);
  const im_resourcesUsers = im_state.resourceReducer.get(KEY_GET_ALL_USERS);
  const im_resourceData = im_state.resourceReducer.get(KEY_UPDATE_CHANNELS);
  const im_resourcesEmoji = im_state.resourceReducer.get(KEY_GET_ALL_EMOJI);

  const populateMessages = im_state.populateReducer.getIn([KEY_LOAD_MESSAGES + "_" + channel]);
  const populateAllUsers = im_state.populateReducer.getIn([KEY_GET_ALL_USERS]);
  const populateData = im_state.populateReducer.get(KEY_UPDATE_CHANNELS);
  const populateEmoji = im_state.populateReducer.get(KEY_GET_ALL_EMOJI);

  return {
    im_resourceMessages,
    im_resourcesUsers,
    im_resourceData,
    channel,
    populateMessages,
    populateAllUsers,
    populateData,
    populateEmoji,
    im_resourcesEmoji
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    doFetchJournalById,
    doFetchJournalChannels,
    doFetchAllUsers,
    getEmoji
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
