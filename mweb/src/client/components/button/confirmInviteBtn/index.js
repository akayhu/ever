import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cx from 'classnames';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import {triggerAccept, triggerReject} from 'src/client/actions/profile';

class ConfirmInviteBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			acceptDisabled: false,
			rejectDisabled: false,
		};
		this.handleAccept = this.handleAccept.bind(this);
		this.handleReject = this.handleReject.bind(this);
		this.updateButton = this.updateButton.bind(this);
	}
	handleAccept() {
		const {triggerAccept, targetPid} = this.props;

		this.setState({loading: true});
		triggerAccept(targetPid).then(this.updateButton.bind(this, 'accept'));
	}
	handleReject() {
		const {triggerReject, targetPid} = this.props;

		this.setState({loading: true});
		triggerReject(targetPid).then(this.updateButton.bind(this, 'reject'));
	}
	updateButton(type, res) {
		if (res !== true) {
			const {canRetry} = res;
			this.setState({
				loading: false,
				[`${type}Disabled`]: !canRetry,
			});
		}
		switch (type) {
			case 'accept':
				// 給「非」profile大名片的Interaction使用的Connection
				if (res === true && this.props.changeStatus) this.props.changeStatus(3);
				break;
			case 'reject':
				// 給「非」profile大名片的Interaction使用的Connection
				if (res === true && this.props.changeStatus) this.props.changeStatus(0);
			default:
				return;
		}
	}
	getButtonStyle(type) {
		const {loading} = this.state;
		return cx('ui button', {
			loading,
			disabled: loading || this.state[`${type}Disaled`],
			primary: type === 'accept',
			line: type === 'reject',
		});
	}
	render() {
		return (
			<div styleName="wrap">
				<button
					className={this.getButtonStyle('accept')}
					onClick={ this.handleAccept }
					data-gtm-connect="交友確認"
				>
					確認邀請
				</button>
				<button
					className={this.getButtonStyle('reject')}
					onClick={ this.handleReject }
					data-gtm-connect="交友拒絕"
				>
					拒絕
				</button>
			</div>
		);
	}
}

ConfirmInviteBtn.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

export default compose(
	connect(null, {triggerAccept, triggerReject}),
	[CSSModules, '_', css]
)(ConfirmInviteBtn);
