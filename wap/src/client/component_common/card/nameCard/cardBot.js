import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import CSSModules from 'react-css-modules';
// components
import NonFriendPanel from './nonFriendPanel';
import FriendPanel from './friendPanel';

const CardBot = ({
	idInfo,
	count,
	connectionStatus,
	subscribeStatus,
	hiddenStatus,
	handleMutualFriendOpen,
}) =>
	<div styleName="card_view_main">
		<NonFriendPanel
			pid={ idInfo.pid }
			targetPid={ idInfo.targetPid }
			count={ count }
			connectionStatus={ connectionStatus }
			subscribeStatus={ subscribeStatus }
			hiddenStatus={ hiddenStatus }
			openLightbox={ handleMutualFriendOpen }
		/>
		<FriendPanel
			count={ count }
			connectionStatus={ connectionStatus }
			hiddenStatus={ hiddenStatus }
			openLightbox={ handleMutualFriendOpen }
			targetPid={ idInfo.targetPid }
		/>
	</div>;

CardBot.propTypes = {
	idInfo: PropTypes.object.isRequired,
	count: PropTypes.number.isRequired,
	connectionStatus: PropTypes.number.isRequired,
	subscribeStatus: PropTypes.bool.isRequired,
	handleMutualFriendOpen: PropTypes.func.isRequired,
};

export default CSSModules(CardBot, css);
