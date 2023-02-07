import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import CSSModules from 'react-css-modules';
// import { Link } from 'react-router';
import SendMessageBtn from 'src/client/component_common/sendMessageBtn';
// components

const FriendPanel = ({connectionStatus, count, openLightbox, targetPid, hiddenStatus}) => {
	if (connectionStatus !== 3 || hiddenStatus) return null;
	return (
		<div>
			{ count > 0 &&
				<span onClick={ openLightbox }>
					<a href="">{count}&nbsp;位共同朋友</a>
				</span>
			}
			<div styleName="actions">
				<SendMessageBtn targetPid={ targetPid } />
			</div>
		</div>
	);
};

FriendPanel.propTypes = {
	connectionStatus: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	openLightbox: PropTypes.func.isRequired,
	targetPid: PropTypes.any
};

export default CSSModules(FriendPanel, css);
