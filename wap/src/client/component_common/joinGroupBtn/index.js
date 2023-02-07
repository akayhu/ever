import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import cx from 'classnames';
// style
import css from './index.css';
// actions
import { triggerApplyJoinGroup, triggerCancelApplyJoin, leaveGroup, setNoticeStatus } from 'src/client/actions/group';
import { setDirectPanel } from 'src/client/actions/alert';
// components
import JoinBtn from './joinBtn';
import MemberBtn from './memberBtn';
import AppliedBtn from './appliedBtn';
import { initGroupPage } from 'src/client/actions/group';

function getStateObjByCondition(condition, successObj, errorObj, errorMsg) {
	if (!condition) { console.error(errorMsg); }
	const sourceObj = condition ? successObj : errorObj;
	return sourceObj.reduce((final, [key, value]) => ({...final, [key]: value}), {});
}

class JoinGroupBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			joined: props.isMember || false,
			applied: props.isApplying || false,
			notified: props.noticeStatus || false,
			loading: false,
			error: false
		};
		this.handleApplyJoinGroup = this.handleApplyJoinGroup.bind(this);
		this.handleNotify = this.handleNotify.bind(this);
		this.handleRevokeJoin = this.handleRevokeJoin.bind(this);
		this.handleLeaveGroup = this.handleLeaveGroup.bind(this);
	}
	getButtonStyle() {
		const { loading } = this.state;
		const { buttonStyle, buttonSize } = this.props;

		return cx(`button ui ${buttonStyle} ${buttonSize}`, {'disabled loading': loading});
	}
	stopAction() {
		if (!this.props.isLogin) {
			this.props.setDirectPanel(true);
			return true;
		}
		if (this.state.loading) return true;
		return false;
	}
	handleApplyJoinGroup() {
		if (this.stopAction()) return;

		const { channelId, joinSetting, triggerApplyJoinGroup } = this.props;
		this.setState({ loading: true }, () => {
			triggerApplyJoinGroup(channelId, joinSetting).then((isSuccess) => {
				const joinedValue = joinSetting === 0;
				const appliedValue = joinSetting === 1;
				this.setState(getStateObjByCondition(isSuccess,
					[['joined', joinedValue], ['applied', appliedValue], ['loading', false], ['error', false]],
					[['loading', false], ['error', true]],
					'handleApplyJoinGroup'
				), () => {
					this.props.initGroupPage({ channelId });
				});
			});
		});
	}
	handleNotify() {
		if (this.stopAction()) return;

		const { notified } = this.state;
		const { setNoticeStatus, channelId } = this.props;
		this.setState({ loading: true }, () => {
			setNoticeStatus({
				targetId: channelId,
				status: !notified,
				type: 5
			}).then((isSuccess) => {
				this.setState(getStateObjByCondition(isSuccess,
					[['notified', !notified], ['loading', false], ['error', false]],
					[['loading', false], ['error', true]],
					'handleNotify'
				));
			});
		});
	}
	handleRevokeJoin() {
		if (this.stopAction()) return;

		const { channelId, triggerCancelApplyJoin, category } = this.props;

		this.setState({ loading: true }, () => {
			triggerCancelApplyJoin(channelId, 'waitForJoin', category).then((isSuccess) => {
				this.setState(getStateObjByCondition(isSuccess,
					[['applied', false], ['loading', false], ['error', false]],
					[['loading', false], ['error', true]],
					'handleCancelApplyJoin'
				), () => {
					this.props.initGroupPage({ channelId });
				});
			});
		});
	}
	handleLeaveGroup() {
		if (this.stopAction()) return;

		const { channelId, leaveGroup } = this.props;
		this.setState({ loading: true }, () => {
			leaveGroup({ channelId }).then((res) => {
				this.setState(getStateObjByCondition(res.response,
					[['joined', false], ['loading', false], ['error', false]],
					[['loading', false], ['error', true]],
					'handleLeaveGroup'
				), () => {
					this.props.initGroupPage({ channelId });
				});
			});
		});
	}
	render() {
		const { isHead, isMember, joinSetting, simple } = this.props;
		const { joined, applied, notified } = this.state;

		// 非社團成員 且 尚未申請加入
		if (!joined && !applied) {
			return (
				<JoinBtn
					buttonStyle={ this.getButtonStyle() }
					joinSetting={ joinSetting }
					applyJoinGroup={ this.handleApplyJoinGroup }
				/>
			);
		}
		// 申請加入中
		if (applied) {
			return (
				<AppliedBtn
					simpleMode={ simple }
					buttonStyle={ this.getButtonStyle() }
					revokeJoin={ this.handleRevokeJoin }
				/>
			);
		}
		// 已經為社團成員
		return (
			<MemberBtn
				simpleMode={ simple }
				isHead={ isHead }
				isMember={ isMember }
				notified={ notified }
				buttonStyle={ this.getButtonStyle() }
				notify={ this.handleNotify }
				leaveGroup={ this.handleLeaveGroup }
			/>
		);
	}
}

JoinGroupBtn.defaultProps = {
	channelId: 0,
	simple: false,
	buttonStyle: 'primary',
	buttonSize: '',
	isHead: false,
	isMember: false,
	isApplying: false,
	joinSetting: 0,
	noticeStatus: false,
};

JoinGroupBtn.propTypes = {
	channelId: PropTypes.number.isRequired,
	isMember: PropTypes.bool.isRequired,
	isApplying: PropTypes.bool.isRequired,
	joinSetting: PropTypes.number.isRequired,
	isHead: PropTypes.bool.isRequired,
	noticeStatus: PropTypes.bool,
	buttonStyle: PropTypes.string,
	buttonSize: PropTypes.string,
	simple: PropTypes.bool
};

function mapStateToProps(state) {
	return {
		isLogin: state.user.isLogin
	};
}

export default compose(
	connect(mapStateToProps, { triggerApplyJoinGroup, triggerCancelApplyJoin, leaveGroup, setNoticeStatus, initGroupPage, setDirectPanel }),
	[CSSModules, '_', css, {allowMultiple: true}]
)(JoinGroupBtn);
