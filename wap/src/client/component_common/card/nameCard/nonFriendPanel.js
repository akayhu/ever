import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import CSSModules from 'react-css-modules';
import ChangeCard from 'src/client/component_common/changeCard';
import SubscribePeople from 'src/client/component_common/subscribePeople';

const NonFriendPanel = ({pid, targetPid, connectionStatus, subscribeStatus, hiddenStatus, count, openLightbox}) => {
	if (connectionStatus === 3 || connectionStatus === 4) return null;

	return (
		<div>
			{ count > 0 && pid !== targetPid &&
				<span onClick={ openLightbox }>
					<a href="">{ count }&nbsp;位共同朋友</a>
				</span>
			}
			<div styleName="actions">
				<ChangeCard
					pid={ pid }
					targetPid={ targetPid }
					connectionStatus={ connectionStatus }
					mutualFriendCount={ count }
					hiddenStatus={ hiddenStatus }
					inNameCard
				/>
				<div>
					<SubscribePeople
						pid={ pid }
						targetPid={ targetPid }
						subscribeStatus={ subscribeStatus }
						inNameCard
						fullModeButton={ false }
						alwaysShow={ false }
					/>
				</div>
			</div>
		</div>
	);
};

NonFriendPanel.propTypes = {
	pid: PropTypes.number,
	targetPid: PropTypes.number.isRequired,
	connectionStatus: PropTypes.number.isRequired,
	subscribeStatus: PropTypes.bool.isRequired,
	count: PropTypes.number.isRequired,
	openLightbox: PropTypes.func.isRequired
};

export default CSSModules(NonFriendPanel, css);
