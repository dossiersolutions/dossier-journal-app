import React, {Component} from "react";
import PropTypes from "prop-types";
import logo from "../../media/images/dossier-logo.jpg"

class LoginForm extends Component {

  col_md_12 ={
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    marginBottom: "15px",
  };

  rounded = {
    marginTop: "10px",
    marginBottom:"10px"
  };

  render() {
    const {
      change,
      click,
      value,
      keyPress
    } = this.props;

    return (
        <div>
          <div className="col-md-12" style={this.col_md_12}>
            <div className="col-md-12">
              <img className="rounded" width="70px" style={this.rounded} src={logo} alt="dossier"/>
              <div className="page-header">
                <h4># Dossier Journal App</h4>
                <small>Please enter Slack auth token!</small>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="row">
            <div className="col-md-3" >
            </div>

            <div className="col-md-6">
              <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type in..."
                    value={value}
                    onKeyPress={keyPress}
                    onChange={change}/>

                <span className="input-group-btn">
                      <button
                          className="btn btn-default"
                          type="button"
                          onClick={click}
                      >Go!</button>
                </span>
              </div>
            </div>
            </div>

            <div className="col-md-3" >
            </div>
          </div>

        </div>
    );
  }
}

LoginForm.propTypes = {
  change: PropTypes.func,
  click: PropTypes.func,
  value: PropTypes.string,
  keyPress: PropTypes.func
};

export default LoginForm;
