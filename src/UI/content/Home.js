import React, {Component} from "react";
import {doCheckToken} from "../../data/redux/actions/resourceActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import LoginForm from ".././forms/LoginForm";

class Home extends Component {

  errorMessage = {
    color: "red",
    textAlign: "center"
  };

  col_md_12 = {
    alignItems: "center",
    textAlign: "center",
    color: "red"
  };

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    }
  }

  nextPath() {
    const {
      history
    } = this.props;

    history.push("/users");
  }

  handleClick() {
    const {
      doCheckToken
    } = this.props;

    const {
      inputValue
    } = this.state;

    sessionStorage.setItem("token", inputValue);
    doCheckToken();
  }

  handleKeyPress = (e) => {
    const {
      doCheckToken
    } = this.props;

    const {
      inputValue
    } = this.state;

    if (e.key === "Enter") {
      sessionStorage.setItem("token", inputValue);
      doCheckToken();
    }
  };

  updateValue(event) {
    this.setState({inputValue: event.target.value})
  }

  render() {
    const {
      userAuth
    } = this.props;

    const formJsx = [];
    formJsx.push(<LoginForm
        key={"loginForm"}
        change={event => this.updateValue(event)} click={() => this.handleClick()}
        keyPress={this.handleKeyPress}
        value={this.state.inputValue}
    />);

    if (userAuth === true) {
      this.nextPath()
    }
    else if (userAuth === false) {
      formJsx.push(
          <div key={"errorMsg"} className="page-header" style={this.col_md_12}>
            <small>Wrong token!</small>
          </div>
      )
    }

    return (
        <div>
          {formJsx}
        </div>
    );
  }

}

const mapStateToProps = state => {

  const userAuth = state.populateReducer.get("authentificated");

  return {
    userAuth
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    doCheckToken
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
