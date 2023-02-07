import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import errorHandle from 'src/util/errorHandle';
// style
import css from './index.css';
// actions
import {
	revoke,
	invite,
	accept,
	reject
} from 'src/client/actions/connection';
import { setDirectPanel } from 'src/client/actions/alert';
// components
import NotFriendBtn from './notFriendBtn';
import NotFriendBtnNotLogin from './notFriendBtnNotLogin';
import RevokeBtn from './revokeBtn';
import ReplyBtn from './replyBtn';
import SendMessageBtn from '../sendMessageBtn';

class ChangeCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submit: false,
			rejected: false,
			accepted: false,
			upperBound: false,
			loading: false
		};
		const {inNameCard, small} = props;
		const gtmPostText = 'connect';

		this.gtmTag = getGTMTag(gtmPostText);
		this.onSelect = this.onSelect.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.changeCard = this.changeCard.bind(this);
		this.revokeInvite = this.revokeInvite.bind(this);
		this.acceptInvite = this.acceptInvite.bind(this);
		this.rejectInvite = this.rejectInvite.bind(this);
		// for button style
		this.sizeStyle = small ? 'small' : '';
	}
	getButtonStyle() {
		const { loading } = this.state;
		const { primary, normal, line } = this.props;
		let style = '';
		if (primary) {
			style = 'primary';
		} else if (normal) {
			style = 'normal';
		} else if (line) {
			style = 'line';
		}
		if (!style) style = 'primary';
		return `${style} ${loading ? 'disabled loading' : ''}`;
	}
	rejectInvite() {
		const { targetPid, reject, category } = this.props;
		const parameters = { targetPid };

		this.setState({ loading: true });
		reject(parameters, category).then((msg) => {
			if (errorHandle(msg)) {
				return this.setState({ loading: false });
			}
			this.setState({
				rejected: true,
				loading: false
			});
		});
	}
	acceptInvite() {
		const { targetPid, accept, category } = this.props;
		const parameters = { targetPid };

		this.setState({ loading: true });
		accept(parameters, category).then((msg) => {
			if (errorHandle(msg)) {
				return this.setState({
					upperBound: true,
					loading: false
				});
			}
			this.setState({
				accepted: true,
				loading: false
			});
		});
	}
	changeCard(type = 3) {
		const { targetPid, invite, category } = this.props;
		const parameters = {
			targetPid,
			relationType: type,
			memo: ''
		};
		this.setState({ loading: true });
		invite(parameters, category).then((msg) => {
			if (errorHandle(msg)) {
				return this.setState({ loading: false });
			}
			this.setState({
				submit: true,
				loading: false
			});
		});
	}
	onSelect(type) {
		this.changeCard(type);
	}
	revokeInvite() {
		const {targetPid, revoke, category} = this.props;
		const parameters = {targetPid};

		this.setState({ loading: true });
		revoke(parameters, category).then((msg) => {
			if (errorHandle(msg)) {
				return this.setState({ loading: false });
			}
			this.setState({
				submit: false,
				loading: false
			});
		});
	}
	toggleOpen() {
		const {isLogin} = this.props;

		if (!isLogin) {
			this.props.setDirectPanel(true);
		}
	}
	renderNotFriend() {
		const { submit } = this.state;
		const { isLogin } = this.props;

		if (submit) return this.renderInviting();
		if (!isLogin) {
			return (
				<NotFriendBtnNotLogin
					gtmTag={ this.gtmTag }
					btnStyle={ this.getButtonStyle() }
					sizeStyle={ this.sizeStyle }
					toggle={ this.toggleOpen }
				/>
			);
		}
		return (
			<NotFriendBtn
				gtmTag={ this.gtmTag }
				btnStyle={ this.getButtonStyle() }
				sizeStyle={ this.sizeStyle }
				toggle={ this.toggleOpen }
				onSelect={ this.onSelect }
			/>
		);
	}
	renderInviting() {
		const { reversible } = this.props;
		return (
			<RevokeBtn
				reversible={ reversible }
				btnStyle={ this.getButtonStyle() }
				sizeStyle={ this.sizeStyle }
				toggle={ this.toggleOpen }
				triggerRevoke={ this.revokeInvite }
			/>
		);
	}
	renderSendMessage() {
		return <SendMessageBtn targetPid={ this.props.targetPid } />;
	}
	renderReply() {
		const { accepted, rejected } = this.state;
		if (!accepted) {
			return (
				<ReplyBtn
					btnStyle={ this.getButtonStyle() }
					sizeStyle={ this.sizeStyle }
					toggle={ this.toggleOpen }
					acceptInvite={ this.acceptInvite }
					rejectInvite={ this.rejectInvite }
				/>
			);
		} else if (rejected) {
			return this.renderNotFriend();
		}
		return this.renderSendMessage();
	}
	render() {
		const { userPid, targetPid, connectionStatus, hiddenStatus } = this.props;
		// 自己看自己不顯示
		if (userPid === targetPid)
			return null;
		// 隱身狀態不顯示
		if (hiddenStatus) return null;
		// 根據人脈狀態顯示
		switch (connectionStatus) {
			case 0: // 無關係
				return this.renderNotFriend();
			case 1: // 邀請中
				return this.renderInviting();
			case 2: // 待審核
				return this.renderReply();
			case 3: // 傳送訊息
				return this.renderSendMessage();
			default:
				return null;
		}
	}
}

function getGTMTag(postfix = 'connect') {
	return {
		changecard: {[`data-gtm-${postfix}`]: '交換名片'},
		friend: {[`data-gtm-${postfix}`]: '朋友'},
		colleague: {[`data-gtm-${postfix}`]: '同事'},
		classmate: {[`data-gtm-${postfix}`]: '同學'},
		others: {[`data-gtm-${postfix}`]: '我想認識他'}
	};
}

ChangeCard.defaultProps = {
	reversible: true,
	inNameCard: false,
	primary: false,
	normal: false,
	line: false,
	small: false
};

ChangeCard.propTypes = {
	targetPid: PropTypes.number.isRequired,
	connectionStatus: PropTypes.number.isRequired,
	reversible: PropTypes.bool,
	inNameCard: PropTypes.bool,
	primary: PropTypes.bool,
	normal: PropTypes.bool,
	line: PropTypes.bool,
	small: PropTypes.bool,
	invite: PropTypes.func.isRequired,
	revoke: PropTypes.func.isRequired
};

export default compose(
	connect(state => ({
		isLogin: state.user.isLogin,
		userPid: state.user.pid
	}), { invite, revoke, accept, reject, setDirectPanel }),
	[CSSModules, '_', css]
)(ChangeCard);
