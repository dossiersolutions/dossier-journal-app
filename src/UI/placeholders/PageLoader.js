import React, {Component} from "react";
import logo from "../../media/images/dossier-logo.jpg"
import placeholder from "../../media/images/placeholder.gif"


class JournalHeaderLoading extends Component {

  col_md_12 ={
    display: "flex",
    alignItems: "center",
    textAlign: "center"
  };

  img = {
    width: "90px"
  };

  rounded = {
    marginTop: "10px",
    marginBottom:"10px"
  };

  render() {
    return (
        <div>
          <div className="col-md-12" style={this.col_md_12}>
            <div className="col-md-12">
            <img className="rounded" width="70px" style={this.rounded} src={logo} alt="dossier"/>
              <div className="page-header">
                <h4># Dossier Journal App</h4>
                <small>If you can found this message you are a member of Dossier team!</small>
              </div>
            </div>
          </div>

          <div className="col-md-12" style={this.col_md_12} >
            <div className="col-md-12">
              <img className="img-responsive center-block" style={this.img} src={placeholder} alt="loading"/>
              <div className="page-header">
                <small>Loading...</small>
              </div>
            </div>
          </div>

        </div>
    );
  }
}


export default JournalHeaderLoading;
