import React, {Component} from 'react';
import {doFetchJournalById, doFetchJournalChannels, doFetchAllUsers} from "../../data/redux/actions/resourceActions";
import {bindActionCreators} from "redux";
import _ from "lodash";
import {connect} from 'react-redux';
import {ALL_USERS, CHANNEL_MESSAGES, LOAD_ALL_CHANNELS} from "../../data/redux/actions/constants";
import JournalHeaderLoading from "../placeholders/PageLoader";
import Header from "../components/Header";
import logo from "../../media/images/dossier-logo.jpg";
import UserMessage from "../components/UserMessage";
import Footer from "../components/Footer";
import {messageNormalized} from "../../core/utils/formatingUtils";

const INPUT_DEBOUNCE_MILLISECONDS = 10000;
var doJob;

class Channel extends Component {

  img = {
    width: "90px"
  }

  constructor(props, context) {
    super(props, context);

    // this.debouncedAddToTaskPopulate = _.debounce(this.writeMessage, INPUT_DEBOUNCE_MILLISECONDS);
    // this.writeMessage1 = _.debounce(this.writeMessage, INPUT_DEBOUNCE_MILLISECONDS)
    doJob = _.debounce(this.writeMessage, INPUT_DEBOUNCE_MILLISECONDS);
    // this.writeMessage = _.bind(this.writeMessage, this);

    // const a = _.debounce(this.writeMessage, INPUT_DEBOUNCE_MILLISECONDS);
  }


  writeMessage(text) {
    alert(text)
  }

  componentWillMount() {
    const {
      channel,
      doFetchJournalById
    } = this.props;

    doJob("pewra");
    doFetchJournalById(channel);
  }

  componentDidMount(){
    window.scrollTo(0, 0)
  }

  componentWillUnmount(){
    console.log("UNMOUNT")
    doJob.cancel();
  }

  fetchUserChannelTitle(){
    const {
      channel,
      im_resourceData
    } = this.props;

    const index = im_resourceData.findIndex(item => item.get("id") === channel);
    return im_resourceData.getIn([index, "name_normalized"]);
  }

  fetchUserPhoto(user){
    const {
      im_resourcesUsers
    } = this.props;

    return im_resourcesUsers.getIn([user, "profile", "image_192"]);
  }

  setEmoji(text){

  const link = "https://dossiersolutions.slack.com/emoji/bowtie/46ec6f2bb0.png";

  text = text.split(" ");

  for (var i = 1; i < text.length; i++) {
    if(text[i] === ":slightly_smiling_face:"){
      text[i] = <span key={i}><img width="20px" className="rounded" src={link} alt="user_photo"/> </span>;
    }else{
      text[i] = <span key={i}>{text[i]+" "}</span>;
    }
  }
  return text;
  }


  makeJsx() {
    const {
      im_resourceMessages,
      im_resourcesUsers
    } = this.props;

    const jsxData = [];

    const userJournalName = "# "+this.fetchUserChannelTitle();

    jsxData.push(<Header key={"header"} headerTitle={userJournalName}/>)
    im_resourceMessages.forEach((im_data, index) => {

      const userPhoto = this.fetchUserPhoto(im_data.get("user"));

      const message1 = messageNormalized(im_data.get("text"), im_resourcesUsers);
      // console.log(message1);
      // const message = this.setEmoji(message1);

      jsxData.push(
              // const userPhoto = this.findUserPhoto();
          <UserMessage key={index} message={message1} userPhoto={userPhoto}>
            <img width="120px" className="rounded" style={this.img} src={logo} alt="user_photo"/>
          </UserMessage>
      )
    });
    jsxData.push(<Footer key={"footer"}/>)

    return jsxData;
  }

  render() {
    const {
      im_resourceMessages,
      populateMessages,
      populateAllUsers,
      im_resourceData
    } = this.props;

    let jsxData = null;

    if (populateMessages && populateAllUsers && im_resourceData) {
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

  const im_resourceMessages = im_state.resourceReducer.get(CHANNEL_MESSAGES+"_"+channel);
  const im_resourcesUsers = im_state.resourceReducer.get(ALL_USERS);
  const im_resourceData = im_state.resourceReducer.get(LOAD_ALL_CHANNELS);

  const populateMessages = im_state.populateReducer.getIn([CHANNEL_MESSAGES+"_"+channel]);
  const populateAllUsers = im_state.populateReducer.getIn([ALL_USERS]);


  return {
    im_resourceMessages,
    im_resourcesUsers,
    im_resourceData,
    channel,
    populateMessages,
    populateAllUsers
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    doFetchJournalById
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
