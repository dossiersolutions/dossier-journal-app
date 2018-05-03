import React, {Component} from 'react'
import {ellipsis} from 'react-multiline-ellipsis'
import PropTypes from "prop-types";
import parser from "html-react-parser";
import {emojiInitialize} from "../../core/utils/formatingUtils";

class EllipsizerTextBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      emoji: null
    }
  }

  componentWillMount() {

    this.setState({emoji: emojiInitialize()})
  }

  render() {
    const {
      text
    } = this.props;

    const {
      emoji
    } = this.state;

    const messageHtmlToReact = parser(emoji.replace_colons(text));

    return <div>{messageHtmlToReact}</div>
  }
}

EllipsizerTextBox.propTypes = {
  text: PropTypes.string
};

export default ellipsis(EllipsizerTextBox, 3, '...')