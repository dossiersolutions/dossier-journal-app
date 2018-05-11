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
    width: "auto",
    maxWidth: "100%",
    marginBottom: "5px",
    marginTop: "5px"
  }

  row = {
    marginLeft: "0px",
    marginTop: "10px"
  };

  boxStyle={
    width: "auto",
    maxWidth: "100%",
    border: "1px #c7c7c7 solid",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "5px"
  }

  button={
    width: "55px",
    height: "25px",
    border: "1px solid #2b3179",
    backgroundColor: "#2b3179",
    borderRadius: "5px",
    marginLeft: "15px",
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "13px"
  }

  createFileJsx(){
    const {
      file,
      fileType
    } = this.props;

    let fileJsx = null;

    switch (fileType){
      case "GIF":
        fileJsx = <img style={this.fileInner} src={file} onClick={() => this.handleImageClick(file)} alt={fileType}/>;
        break;

      case "PNG":
        fileJsx = <img style={this.fileInner} src={file} onClick={() => this.handleImageClick(file)} alt={fileType}/>;
        break;

      case "JPG":
        fileJsx = <img style={this.fileInner} src={file} onClick={() => this.handleImageClick(file)} alt={fileType}/>;
        break;

      case "JPEG":
        fileJsx = <img style={this.fileInner} src={file} onClick={() => this.handleImageClick(file)} alt={fileType}/>;
        break;

      case "PDF":
        fileJsx = <div style={this.boxStyle}>
          <span><b>File:</b></span>
          <div className="row" style={{marginLeft: "15px"}}>
            <div>{file}</div>
            <div>
              <a href={file} target={"_blank"}><button style={this.button}>View</button></a>
            </div>
          </div>
        </div>
        break;

      case "Plain Text":
        fileJsx = <div style={this.boxStyle}>
          <span><b>File:</b></span>
          <div className="row" style={{marginLeft: "15px"}}>
            <div>{file}</div>
            <div>
              <a href={file} target={"_blank"}><button style={this.button}>View</button></a>
            </div>
          </div>
        </div>
        break;

      case "Java":
        fileJsx = <div style={this.boxStyle}>
          <span><b>File:</b></span>
          <div className="row" style={{marginLeft: "15px"}}>
            <div>{file}</div>
            <div>
              <a href={file} target={"_blank"}><button style={this.button}>View</button></a>
            </div>
          </div>
        </div>
        break;

      default:
        fileJsx = null;
    }

    return fileJsx;
  }

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

    const fileJsx = this.createFileJsx();

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
                    <div className={"row"} style={this.marginBottom}>
                      {message}
                    </div>
                    <div>
                      {file ? fileJsx : null}
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
  file: PropTypes.string,
  fileType: PropTypes.string
};

export default UserMessage;
