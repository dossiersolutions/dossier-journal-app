import React, {Component} from "react";
import PropTypes from "prop-types";
import UserBox from "./UserProfile";

class UserMessage extends Component {

  col_md_12 = {
    padding: "0px"
  };

  col_md_1 = {
    padding: "0px",
    textAlign: "left"
  };

  marginBottom = {
    marginBottom: "10px"
  };

  jumbotron = {
    padding: "5px",
    margin: "5px",
    border: "1px solid #dfe0e1",
    background: "#fafbfc"
  };

  img = {
    width: "55px",
    marginTop: "5px",
    marginLeft: "5px",
    marginBottom: "5px",
    padding: "0px"
  };

  fileInner={
    width: "50%",
    marginBottom: "5px",
    marginTop: "5px"
  }

  row = {
    marginLeft: "0px",
    marginTop: "10px"
  };

  handleImageClick(imgUrl){
    window.open(imgUrl, "_blank");
  }

  render() {
    const {
      message,
      userPhoto,
      userName,
      date,
      time,
      file
    } = this.props;

    let fileJsx = null;

    if(file && file.includes(".pdf")){
      fileJsx = <a href={file} target="_blank">PDF File</a>;
    }else{
      fileJsx = <img style={this.fileInner} src={file} onClick={() => this.handleImageClick(file)}/>;
    }

    return (
        <div className="UserMessage">
          <div className="col-md-12" style={this.col_md_12}>
            <div className="jumbotron" style={this.jumbotron}>
              <div className="container">
                <div className="row">
                  <div className="col-md-1" style={this.col_md_1}>
                    <img className="rounded" style={this.img} src={userPhoto} alt="user_photo"/>
                  </div>
                  <div className="col-md-11">
                    <div className={"row"}>
                      <small><span><b>{userName}</b></span></small>
                    </div>
                    <div className={"row"} style={this.marginBottom}>
                      <small>{date} | {time}</small>
                    </div>
                    <div>
                      {file ? fileJsx : null}
                    </div>
                    <div className={"row"} style={this.marginBottom}>
                      {message}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
    );
  }
}

UserBox.propTypes = {
  message: PropTypes.string,
  userPhoto: PropTypes.string,
  userName: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  file: PropTypes.string
};

export default UserMessage;
