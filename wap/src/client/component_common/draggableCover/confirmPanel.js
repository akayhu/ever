import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';

class ConfirmPanel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.props.show) return null;
    return(
      <div styleName="confirm_cover_panel">
        拖曳可重新調整照片位置
        <div styleName="buttons">
          <button className="ui button primary" onClick={ this.props.submit }>儲存</button>
          <button className="ui button" onClick={ this.props.cancel }>取消</button>
        </div>
      </div>
    )
  }
}

ConfirmPanel.propTypes = {
  show: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}

export default CSSModules(ConfirmPanel, css)
