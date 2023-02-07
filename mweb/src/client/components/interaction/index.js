import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import {FriendBtn, ChangeCardBtn, RevokeInviteBtn, ConfirmInviteBtn} from 'src/client/components/button';

class Interaction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: props.connectionStatus,
		};
		this.changeStatus = this.changeStatus.bind(this);
	}
	changeStatus(value) {
		this.setState({
			status: value,
		});
	}
	render() {
		const { targetPid, user, isLogin } = this.props;
		if ( user.pid === targetPid) return null; // 是自己的時候不顯示Interaction
		return (
			<div styleName="wrap">
				{this.state.status === 0 && <ChangeCardBtn isLogin={isLogin} targetPid={ targetPid } changeStatus={ this.changeStatus } />}
				{this.state.status === 1 && <RevokeInviteBtn isLogin={isLogin} targetPid={ targetPid } changeStatus={ this.changeStatus } />}
				{this.state.status === 2 && <ConfirmInviteBtn isLogin={isLogin} targetPid={ targetPid } changeStatus={ this.changeStatus } />}
				{this.state.status === 3 && <FriendBtn isLogin={isLogin} targetPid={ targetPid } changeStatus={ this.changeStatus } />}
			</div>
		);
	}
}

Interaction.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

function selector(state) {
	return {
		user: state.user
	}
}

export default compose(
	connect(selector, {}),
	[CSSModules, '_', css],
)(Interaction);
