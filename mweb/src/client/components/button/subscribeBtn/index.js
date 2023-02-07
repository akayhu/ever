import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cx from 'classnames';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import {triggerSubscribe, triggerNotify} from 'src/client/actions/profile';
import { checkLogin } from 'src/client/actions/user';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

class SubscribeBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			disabled: false,
		};
		this.handleSub = this.handleSub.bind(this);
		this.handleNotice = this.handleNotice.bind(this);
		this.updateButton = this.updateButton.bind(this);
	}
	handleNotice() {
		const {targetPid, notificationStatus, triggerNotify} = this.props;
		const toNotify = !notificationStatus;
		this.setState({loading: true});
		triggerNotify(targetPid, toNotify).then(this.updateButton);
	}
	handleSub() {
		if (!this.props.checkLogin()) {
			return;
		}

		const {targetPid, triggerSubscribe, subscribeStatus} = this.props;
		const toSubscribe = !subscribeStatus;
		this.setState({loading: true});
		triggerSubscribe(targetPid, toSubscribe).then(this.updateButton);
	}
	updateButton(res) {
		if (res !== true) {
			const {canRetry} = res;
			this.setState({
				loading: false,
				disabled: !canRetry,
			});
		} else {
			this.setState({
				loading: false,
			});
		}
	}
	getButtonStyle() {
		const {loading, disabled} = this.state;
		return cx('ui button line', {loading, disabled: loading || disabled});
	}
	render() {
		const {subscribeStatus, notificationStatus} = this.props;
		if (!subscribeStatus) {
			return (
				<div
					className={ this.getButtonStyle() }
					onClick={ this.handleSub }
					data-gtm-connect="關注"
				>
					關注
				</div>
			);
		}
		return (
			<DropdownMenu className={ this.getButtonStyle() }>
				<DropdownTarget>
					<span>取消關注</span>
				</DropdownTarget>
				<DropdownList>
					<ul styleName="other_actions">
						<li onClick={ this.handleNotice } data-gtm-connect={ notificationStatus ? '取消通知' : '接受通知' }>{notificationStatus ? '取消通知' : '接受通知'}</li>
						<li onClick={ this.handleSub } data-gtm-connect="取消關注">取消關注</li>
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
}

SubscribeBtn.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	subscribeStatus: PropTypes.bool.isRequired,
	notificationStatus: PropTypes.bool.isRequired,
};

export default compose(
	connect(null, {triggerSubscribe, triggerNotify, checkLogin}),
	[CSSModules, '_', css],
)(SubscribeBtn);
