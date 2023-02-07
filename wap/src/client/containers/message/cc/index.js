import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { checkHistory, createNewMessage, initMessagePage, changeReadingChatId } from 'src/client/actions/message';
// selectors
// components
import MessageRightHalf from 'src/client/component_message/cc/messageRightHalf';
import LeftSideNavigation from 'src/client/component_message/cc/leftSideNavigation';

import {components as CPlatformComponents} from 'c_platform';
const ViewWrapper = CPlatformComponents.ViewWrapper;

class Message extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
		this.handleInit = this.handleInit.bind(this);
	}
	componentDidMount() {
		const { query: { newMessage, chatId } } = this.props.location;
		document.querySelector('html').classList.add('full_height');
		this.handleInit(newMessage || chatId);
	}
	componentWillReceiveProps(nextProps) {
		// 當route params 改變時
		if (this.props.location.query.chatId !== nextProps.location.query.chatId) {
			this.handleInit(nextProps.location.query.chatId);
		}
	}
	componentWillUnmount() {
		document.querySelector('html').classList.remove('full_height');
	}
	handleInit(chatId) {
		this.props.initMessagePage()
			.then(() => this.checkUrlQuery())
			.then(() => {
				if (chatId) this.props.changeReadingChatId(chatId);
				this.setState({
					show: true
				});
			});
	}
	checkUrlQuery() {
		const { query: { newMessage, chatId } } = this.props.location;
		if (newMessage || chatId) {
			const memberList = newMessage ? newMessage.split(',') : null;
			this.props.checkHistory({memberList, chatId});
		}
		return Promise.resolve();
	}
	changeActive(chatId) {
		this.props.changeReadingChatId(chatId);
	}
	render() {
		const { createNewMessage, user } = this.props;

		return (
			<ViewWrapper { ...this.props } >
				{
					this.state.show === true &&
					<div className="container_wrap original_panel" styleName="wrapper">
						<div className="header clearfix">
							<div className="title">
								<h2>最新訊息</h2>
							</div>
							{ user.isLogin && 
							<div className="options">
								<button className="mini ui primary button" onClick={ createNewMessage }>新訊息</button>
							</div>
							}
						</div>
						<div className="wrap_w300_m0_w660 body">
							<div className="left_side aside">
								<LeftSideNavigation handleClick={ this.changeActive.bind(this) } />
							</div>
							<div className="right_side">
								<MessageRightHalf user={ user } location={ this.props.location } />
							</div>
						</div>
					</div>
				}
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		// msgListData: getBCMsgList(state),
		user: state.user,
	};
}

const actions = {
	checkHistory, createNewMessage, initMessagePage, changeReadingChatId
};

export default compose(
	connect(mapStateToProps, actions),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Message);
