import React, {Component} from 'react';
import PropTypes from "prop-types";
import EllipsizerTextBox from "./EllipsizerTextBox"

class UserBox extends Component {

  col_md_6 = {
    padding: "0px"
  };

  jumbotron = {
    padding: "5px",
    margin: "5px",
    border: "1px solid #dfe0e1",
    background: "#fafbfc"
  };

  img = {
    marginTop: "10px"
  };

  row = {
    marginLeft: "0px",
    minHeight: "100px"
  };

  render() {
    const {
      latest_message,
      profile_image,
      name,
      full_name,
      clickHandler,
      date,
      time,
      latestPostUser
    } = this.props;

    return (
        <div className="col-md-6" style={this.col_md_6} onClick={clickHandler}>
          <div className="jumbotron" style={this.jumbotron}>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <img width="120px" className="rounded" style={this.img} src={profile_image} alt="user_photo"/>
                </div>
                <div className="col-md-6">
                  <h5>{name}</h5>
                  <h6>{full_name}</h6>
                  <small><span><b>{date}</b></span></small>
                </div>
              </div>

              <div>
                <small>{time}</small>
              </div>

              <div style={this.row}>
                <small><b>{latestPostUser}:</b></small>
                <EllipsizerTextBox text={latest_message}/>
              </div>

            </div>
          </div>
        </div>
    );
  }
}

UserBox.propTypes = {
  latest_message: PropTypes.string,
  profile_image: PropTypes.string,
  name: PropTypes.string,
  full_name: PropTypes.string,
  date: PropTypes.string
};

export default UserBox;
