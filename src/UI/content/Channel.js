import React, {Component} from 'react';
import {doFetchAllUsers, doFetchJournalById, doFetchJournalChannels, getEmoji} from "../../data/redux/actions/resourceActions";
import {bindActionCreators} from "redux";
import {KEY_GET_ALL_USERS, KEY_LOAD_MESSAGES, KEY_UPDATE_CHANNELS, KEY_GET_ALL_EMOJI} from "../../data/redux/actions/constants";
import {connect} from 'react-redux';
import JournalHeaderLoading from "../placeholders/PageLoader";
import Header from "../components/Header";
import logo from "../../media/images/dossier-logo.jpg";
import UserMessage from "../components/UserMessage";
import Footer from "../components/Footer";
import {messageNormalized} from "../../core/utils/formatingUtils";

const INPUT_DEBOUNCE_MILLISECONDS = 180000;

class Channel extends Component {

  img = {
    width: "90px"
  }

  constructor(props) {
    super(props);

    this.state ={
      timerId : null
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

    this.setState({
      timerId: setInterval(() => this.doDataUpdate(this.props.channel), INPUT_DEBOUNCE_MILLISECONDS)
    });

    doFetchJournalById(channel);
    if(!populateData && !populateAllUsers && !populateEmoji){
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

  componentDidMount(){
    window.scrollTo(0, 0)
  }

  componentWillUnmount(){
    clearInterval(this.state.timerId);
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

    const {
      populateEmoji,
      im_resourcesEmoji,
      im_resourcesUsers
    } = this.props;

    const link = "https://dossiersolutions.slack.com/emoji/bowtie/46ec6f2bb0.png";

    console.log(JSON.stringify(im_resourcesEmoji, null, 2))
    text = text.split(" ");

      // console.log("SIZE "+im_resourcesEmoji.has("au2"));
      // if(text.includes(":"+"au2"+":")){
      //   alert("MSG")
      //   text = text+"_____-_____________"
      //   console.log(text)
      // }


    for (var i = 0; i < text.length; i++) {
      if(im_resourcesEmoji.has(":"+text[i]+":")){
        console.log(text[i]);
        const link = im_resourcesEmoji.getIn([":"+text[i]+":", text[i]]);
        console.log(link);
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

  const im_resourceMessages = im_state.resourceReducer.get(KEY_LOAD_MESSAGES+"_"+channel);
  const im_resourcesUsers = im_state.resourceReducer.get(KEY_GET_ALL_USERS);
  const im_resourceData = im_state.resourceReducer.get(KEY_UPDATE_CHANNELS);
  const im_resourcesEmoji = im_state.resourceReducer.get(KEY_GET_ALL_EMOJI);

  const populateMessages = im_state.populateReducer.getIn([KEY_LOAD_MESSAGES+"_"+channel]);
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
