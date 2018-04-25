import React, {Component} from "react";
import PropTypes from "prop-types";
import UserBox from "./UserProfile";

class UserMessage extends Component {

  col_md_12 ={
    padding: "0px"
  }

  jumbotron ={
    padding: "5px",
    margin: "5px",
    border: "1px solid #dfe0e1",
    background: "#fafbfc"
  }

  img = {
    marginTop: "10px",
    marginBottom: "10px"
  }

  col_md_11 = {
    marginTop: "10px"
  }

  row = {
    marginLeft: "0px",
    marginTop: "10px"
  }


  render() {
    const {
      message,
      userPhoto
    } = this.props;


    return (
        <div className="UserMessage">
          <div className="col-md-12" style={this.col_md_12}>
            <div className="jumbotron" style={this.jumbotron}>
              <div className="container">
                <div className="row">
                  <div className="col-md-1">
                    <img width="40px" className="rounded" style={this.img} src={userPhoto} alt="user_photo"/>
                  </div>
                  <div className="col-md-11" style={this.col_md_11}>
                    <h6>{message}</h6>
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
  userPhoto: PropTypes.string
};

export default UserMessage;
