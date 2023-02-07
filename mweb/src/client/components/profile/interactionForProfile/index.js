import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import {FriendBtn, ChangeCardBtn, RevokeInviteBtn, ConfirmInviteBtn, SubscribeBtn} from 'src/client/components/button';

const InteractionForProfile = ({targetPid, connectionStatus, subscribeStatus, notificationStatus, isLogin}) => (
	<div styleName="wrap">
		{connectionStatus === 0 && <ChangeCardBtn targetPid={ targetPid } isLogin={isLogin} />}
		{connectionStatus === 1 && <RevokeInviteBtn targetPid={ targetPid } isLogin={isLogin} />}
		{connectionStatus === 2 && <ConfirmInviteBtn targetPid={ targetPid} isLogin={isLogin} />}
		{connectionStatus === 3 && <FriendBtn targetPid={ targetPid } isLogin={isLogin} />}
		{connectionStatus !== 2 &&
			<SubscribeBtn
				isLogin={isLogin}
				targetPid={ targetPid }
				subscribeStatus={ subscribeStatus }
				notificationStatus={ notificationStatus }
			/>
		}
	</div>
);

function selector(state) {
	return {
		isLogin: state.user.isLogin,
		connectionStatus: state.profile.connectionStatus,
		subscribeStatus: state.profile.subscribeStatus,
		notificationStatus: state.profile.notificationStatus,
	};
}

InteractionForProfile.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	connectionStatus: PropTypes.number.isRequired,
	subscribeStatus: PropTypes.bool.isRequired,
	notificationStatus: PropTypes.bool.isRequired,
};

export default compose(
	connect(selector),
	[CSSModules, '_', css],
)(InteractionForProfile);
