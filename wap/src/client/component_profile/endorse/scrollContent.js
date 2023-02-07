import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';

const style = {
  height: '500px',
  padding: '0',
  overflowY: 'scroll'
}

class ScrollContent extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let contentBox = this.refs.content;

    contentBox.addEventListener("scroll", () => {
      let current = Math.ceil(contentBox.scrollTop + contentBox.clientHeight);
      if(current === contentBox.scrollHeight) {
        this.props.bottomAction();
      }
    })
  }
  render() {
    return (
      <div ref="content" style={style}>
        {this.props.children}
      </div>
    )
  }
}

ScrollContent.propTypes = {
  children: PropTypes.node.isRequired,
  bottomAction: PropTypes.func.isRequire
}

const ScrollContenteCss = CSSModules(ScrollContent, css, { allowMultiple: true });
const ScrollContentTranslate = translate([])(ScrollContenteCss);
export default ScrollContentTranslate;