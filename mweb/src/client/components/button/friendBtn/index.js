import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cx from 'classnames';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import {triggerDisConnect} from 'src/client/actions/profile';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

class FriendBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			disabled: false,
		};
		this.handleClick = this.handleClick.bind(this);
		this.updateButton = this.updateButton.bind(this);
	}
	handleClick() {
		const {targetPid, triggerDisConnect} = this.props;

		this.setState({loading: true});
		triggerDisConnect(targetPid).then(this.updateButton);
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
		if (res === true && this.props.changeStatus) this.props.changeStatus(0);
	}
	getButtonStyle() {
		const {loading, disabled} = this.state;
		return cx('ui button primary', {loading, disabled: loading || disabled});
	}
	render() {
		return (
			<DropdownMenu className={ this.getButtonStyle() }>
				<DropdownTarget>
					<span>朋友</span>
				</DropdownTarget>
				<DropdownList>
					<ul styleName="other_actions">
						<li onClick={ this.handleClick } data-gtm-connect="刪除名片">刪除名片</li>
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
}

FriendBtn.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

export default compose(
	connect(null, {triggerDisConnect}),
	[CSSModules, '_', css]
)(FriendBtn);
