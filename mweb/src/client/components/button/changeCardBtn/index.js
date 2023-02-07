import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cx from 'classnames';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { triggerInvite } from 'src/client/actions/profile';
import { checkLogin } from  'src/client/actions/user';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
/**
 * gtm-tag
 */
function getGTMTag(postfix = 'connect') {
	return {
		changecard: {[`data-gtm-${postfix}`]: '交換名片'},
		friend: {[`data-gtm-${postfix}`]: '朋友'},
		colleague: {[`data-gtm-${postfix}`]: '同事'},
		classmate: {[`data-gtm-${postfix}`]: '同學'},
		others: {[`data-gtm-${postfix}`]: '我想認識他'},
	};
}

class ChangeCardBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			disabled: false,
		};
		this.handleClick = this.handleClick.bind(this);
		this.updateButton = this.updateButton.bind(this);
	}
	handleClick(type) {
		const {triggerInvite} = this.props;
		const parameters = this.getParamsForInvite(type);

		this.setState({loading: true});
		triggerInvite(parameters).then(this.updateButton);
	}
	updateButton(res) {
		if (res !== true) {
			const {canRetry} = res;
			this.setState({
				loading: false,
				disabled: !canRetry,
			});
		}
		// 給「非」profile大名片的Interaction使用的Connection
		if (res === true && this.props.changeStatus) this.props.changeStatus(1);
	}
	getParamsForInvite(type) {
		const {targetPid} = this.props;
		return {
			targetPid,
			relationType: type,
			memo: '',
		};
	}
	getButtonStyle() {
		const {loading, disabled} = this.state;
		return cx('ui button primary', {loading, disabled: loading || disabled});
	}
	render() {
		const { changecard, friend, colleague, classmate, others } = getGTMTag();
		return (
			<DropdownMenu className={ this.getButtonStyle() }>
				<DropdownTarget>
					<span { ...changecard } onClick={this.props.checkLogin}>交換名片</span>
				</DropdownTarget>
				{
					this.props.isLogin ? 
					<DropdownList>
						<div styleName="dropdownlist_title">
							<span>選擇關係:</span>
						</div>
						<ul styleName="other_actions">
							<li { ...friend } onClick={ this.handleClick.bind(this, 3) }>朋友</li>
							<li { ...colleague } onClick={ this.handleClick.bind(this, 1) }>同事</li>
							<li { ...classmate } onClick={ this.handleClick.bind(this, 2) }>同學</li>
							<li { ...others } onClick={ this.handleClick.bind(this, 3) }>我想認識他</li>
						</ul>
					</DropdownList> :
					<DropdownList />
				}
			</DropdownMenu>
		);
	}
}

ChangeCardBtn.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

export default compose(
	connect(null, {triggerInvite, checkLogin}),
	[CSSModules, '_', css],
)(ChangeCardBtn);
