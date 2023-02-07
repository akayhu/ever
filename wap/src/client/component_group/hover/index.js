import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import CSSModules from 'react-css-modules';
import css from './index.css';

class Hover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCompStyle: 'will_show_box_top',
      alreadyHover: false,
      getData: false,
      data: {}
    }
    this.shouldShow = false;
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  componentDidMount() {
    const { top } = this.hoverBox.getBoundingClientRect();
    if (top < 250) {
      this.setState({
        showCompStyle: 'will_show_box_bot',
      });
    }
  }
  handleMouseOver() {
    this.shouldShow = true;
    this.hoverWillShow.classList.remove(css.hide);
    if (!this.state.alreadyHover) this.loadData()
  }
  handleMouseLeave() {
    this.shouldShow = false;
    setTimeout(() => this.close(), 200);
  }
  close() {
    if (this.shouldShow) return;
    this.hoverWillShow.classList.add(css.hide);
  }
  loadData() {
    this.hoverWillShow.classList.add(css.loading);
    this.props.hoverAct(this.props.actParams).then(res => {
      this.setState({
        alreadyHover: true,
        getData: true,
        data: res.response
      });
      this.hoverWillShow.classList.remove(css.loading);
    })
  }
  render() {
    const { WillShow, children } = this.props;
    const { showCompStyle, getData, data } = this.state;
    return(
      <div
        ref={ _ref => this.hoverBox = _ref }
        styleName="hover_box"
      >
        {React.cloneElement(children, {
          ref: _ref => this.hoverTarget = _ref,
          onMouseOver: this.handleMouseOver,
          onMouseLeave: this.handleMouseLeave
        })}
        <div
          ref={ _ref => this.hoverWillShow = _ref }
          styleName={ `${showCompStyle}  hide` }
          onMouseOver={ this.handleMouseOver }
          onMouseLeave={ this.handleMouseLeave }
        >
          {getData
            ? <WillShow {...data}/>
            : <div className="ui loading" styleName="loading_view"></div>
          }
        </div>
      </div>
    )
  }
}

Hover.propTypes = {
  WillShow: PropTypes.func
}

export default CSSModules(Hover, css, { allowMultiple: true })
