import React, {Component} from "react";
import logo from "../../media/images/dossier-logo.jpg"
import slack from "../../media/images/slack-icon.png"
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import PropTypes from "prop-types";

class Header extends Component {

  sectionStyle = {
    backgroundImage: "url(" + require('../../media/images/background-head.png') + ")"
  };

  rounded ={
    marginTop: "10px",
    marginBottom:"10px"
  }

  slack_rounded={
    width: "30px",
    height: "30px",
    marginRight: "8px"
  }

  col_md_1={
    marginTop: "10px",
    display: "flex"
  }

  drop_down_toogle={
    background: "#f8f9fa",
    color: "#000000",
    border: "1px solid #dfe0e1"
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {

    const {
      headerTitle
    } = this.props;

    return (
          <div style={this.sectionStyle}>
                <div className="row">
                  <div className="col-md-10">
                  <img className="rounded" width="70px" style={this.rounded} src={logo} alt="dossier"/>
                  </div>


                  <div className="col-md-2" style={this.col_md_1}>
                    <img className="rounded" width="40px" style={this.slack_rounded} src={slack} alt="slack"/>
                    <Dropdown isOpen={this.state.dropdownOpen} size="sm" toggle={this.toggle}>
                      <DropdownToggle style={this.drop_down_toogle} caret>
                        Choose
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                  </div>

                  </div>

              <div>
                <h4>{headerTitle}</h4>
            </div>
            <hr/>

          </div>
    );
  }
}

Header.propTypes = {
  headerTitle: PropTypes.string
};

Header.defaultProps = {
  headerTitle: "# Dossier Journal App"
}

export default Header;
