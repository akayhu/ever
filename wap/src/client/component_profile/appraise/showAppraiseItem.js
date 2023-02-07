import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import Image from 'src/client/component_common/image';
import css from './index.css';
// action
import {
  modifyPublishAppraiseText,
  deleteAppraiseText,
  deletePenddingAppraise
} from 'src/client/actions/social';
// components
import { DropdownMenu, DropdownTarget, DropdownList, DropList } from 'c_wap_module';
import { NameCard } from 'src/client/component_common/card';

import timeAgo from 'c_platform/lib/util/timeago';

class ShowAppraiseItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetIndex: 1,
      targetValue: '公開',
      trash: false,
      loading: false,
      deleting: false,
      privacySetting: 1,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOnSelected = this.handleOnSelected.bind(this);
  }
  handleSubmit() {
    this.setState({loading: true});
    const params = {
      pid: this.props.pid,
      // targetPid: this.props.selfpid,
      privacySetting: this.state.privacySetting
    };
    this.props.modifyPublishAppraiseText(params).then(res => {
      this.setState({loading: false});
    });
  }

  handleDelete() {
    this.setState({loading: true});

    if (!this.state.deleting) {
      this.state.deleting = true;
      const { privateSetting } = this.props;
      const params = {
        pid: this.props.pid,
        // targetPid: this.props.selfpid
      };
      this.props.deleteAppraiseText(params).then(res => {
        if (privateSetting === -1) {
          this.props.deletePenddingAppraise(params);
        }
        this.setState({loading: false});
      });
    }
  }

  toggleOpen(key) {
    this.state.ui[ key ].targetStyle = open ? { color: 'rgb(38,151,185)' } : null;
		this.setState({
			ui: this.state.ui
		})
  }
  handleOnSelected(data) {
    this.state.privacySetting = data.value;
  }
  render() {
    const { avatarWebUrl, userName, pid, viewas, text, privateSetting, dataDate, selfpid } = this.props;
    return (
      <div styleName="user_box">
        {
          this.state.loading &&
          <div styleName="loading_cover"><div className="ui loading"></div></div>
        }
        <div styleName="user_left">
          <NameCard
            targetPid={ pid }
            href={ `/profile/${ pid }` }
            imgSrc={ avatarWebUrl }
            name={ userName }
            gtm={{"data-gtm-profile-social": "讚美 - avatar"}}
          />
        </div>
        <div styleName="user_right">
          {
            privateSetting === -1 &&
            <div styleName="alert_text">尚未公開，等待確認中</div>
          }
          <div styleName="right_top">
            <a href={ `/profile/${pid}` } >
              { userName || 'No Name' }
            </a>
            {(viewas === 'self' && privateSetting === 0) && <i className="lock icon"></i>}
            {(viewas === 'self' && privateSetting === 1) && <i className="world icon"></i>}
          </div>
          <div styleName="right_mid">
            <p className="statics_text">{ text }</p>
          </div>
          <div styleName="right_bot">
            <p>{ timeAgo(dataDate) }</p>
          </div>
          {
            privateSetting === -1 && viewas === 'self' &&
            <div styleName="check_publicy">
              <span className="dropListSpan">
                <DropList
  								listContent={[
                      {label: '公開', value: 1, iconFont: 'world icon'},
                      {label: '只限本人', value: 0, iconFont: 'lock icon'}
                    ]}
  								onSelected={ this.handleOnSelected}
  								defaultIndex={ 1 }
                  className="dropListSpan"
                  width="125px"
                >
  							</DropList>
              </span>
              <div styleName="check_buttons">
                <button
                  className="ui primary button"
                  styleName="check_button"
                  onClick={this.handleSubmit}
                  data-gtm-profile-social="讚美 - 確定"
                >
                  送出
                </button>
                <button
                  className="ui normal button"
                  styleName="check_button"
                  onClick={this.handleDelete}
                  data-gtm-profile-social="讚美 - 刪除"
                >
                  刪除
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

ShowAppraiseItem.propTypes = {
  avatarWebUrl: PropTypes.string,
  userName: PropTypes.string,
  viewas: PropTypes.string,
  text: PropTypes.string,
  privateSetting: PropTypes.number,
  dataDate: PropTypes.string,
  // pid: PropTypes.number,
  // selfpid: PropTypes.number,
  modifyPublishAppraiseText: PropTypes.func,
  deleteAppraiseText: PropTypes.func,
  deletePenddingAppraise: PropTypes.func
}

const ShowAppraiseItemCss = CSSModules(ShowAppraiseItem, css, { allowMultiple: true });
const ShowAppraiseItemTranslate = translate([])(ShowAppraiseItemCss);
const actions = {
  modifyPublishAppraiseText,
  deleteAppraiseText,
  deletePenddingAppraise
}
export default connect(null, actions)(ShowAppraiseItemTranslate);
