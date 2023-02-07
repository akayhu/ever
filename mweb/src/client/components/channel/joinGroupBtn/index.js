import React, { Component  } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import cx from 'classnames';
// style
import css from './index.css';
// actions
import { triggerApplyJoinGroup, triggerCancelApplyJoin, triggerLeaveGroup, triggerNoticeStatus } from 'src/client/actions/group';
import { checkLogin } from  'src/client/actions/user';
// components
import JoinBtn from './joinBtn';
import MemberBtn from './memberBtn';
import AppliedBtn from './appliedBtn';

class JoinGroupBtn extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			joined: props.isMember || false,
			applied: props.isApplying || false,
			notified: props.noticeStatus || false,
			loading: false,
			// error: false
		};
	}
	componentWillReceiveProps(nextProps) {
		this.state.joined = nextProps.isMember || false;
		this.state.applied = nextProps.isApplying || false;
		this.state.notified = nextProps.noticeStatus || false;
	}
	getButtonStyle() {
		const { loading } = this.state;
		const { buttonStyle, buttonSize } = this.props;

		return cx(`button ui ${buttonStyle} ${buttonSize}`, {'disabled loading': loading});
	}
	stopAction() {
		if (this.state.loading){
			return true;
		} 
		
		return false;
	}
	handleApplyJoinGroup() {
		if(!this.props.checkLogin()){
			return;
		}
		
		if (this.stopAction()){
			return;
		} 

		const { channelId, joinSetting, triggerApplyJoinGroup } = this.props;
		
		this.setState({ loading: true }, () => {
			triggerApplyJoinGroup(channelId, joinSetting).then((isSuccess) => {
				this.setState({
					loading: false
				});
			});
		});
	}
	handleNotify() {
		if (this.stopAction()){
			return;
		} 

		const { notified } = this.state;
		const { triggerNoticeStatus, channelId } = this.props;
		
		this.setState({ loading: true }, () => {
			triggerNoticeStatus(channelId, !notified, 5).then((isSuccess) => {
				this.setState({
					loading: false
				});
			});
		});
	}
	handleLeaveGroup() {
		if (this.stopAction()){
			return;
		} 

		const { channelId, triggerLeaveGroup } = this.props;
		
		this.setState({ loading: true }, () => {
			triggerLeaveGroup(channelId).then((res) => {
				this.setState({
					loading: false
				});
			});
		});
	}
	handleRevokeJoin() {
		if (this.stopAction()){
			return;
		}

		const { channelId, triggerCancelApplyJoin } = this.props;

		this.setState({ loading: true }, () => {
			triggerCancelApplyJoin(channelId).then((isSuccess) => {
				this.setState({
					loading: false
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
					applyJoinGroup={ this.handleApplyJoinGroup.bind(this) }
				/>
			);
		}
		
		// 申請加入中
		if (applied) {
			return (
				<AppliedBtn
					simpleMode={ simple }
					buttonStyle={ this.getButtonStyle() }
					revokeJoin={ this.handleRevokeJoin.bind(this) }
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
				notify={ this.handleNotify.bind(this) }
				leaveGroup={ this.handleLeaveGroup.bind(this) }
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

export default compose(
	connect(null, { triggerApplyJoinGroup, triggerCancelApplyJoin, triggerLeaveGroup, triggerNoticeStatus, checkLogin }),
	[CSSModules, '_', css, {allowMultiple: true}]
)(JoinGroupBtn);
