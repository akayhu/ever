import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import Image from 'src/client/component_common/image';
// components
import SubscribePeople from 'src/client/component_common/subscribePeople';

const FocusList = ({
	userPid,
	pid,
	subscribeStatus,
	notificationStatus,
	avatarWebUrl,
	userName
}) =>
	<li>
		<a styleName="focusImg" href={ `profile/${pid}` }>
			<Image
        src={ avatarWebUrl }
        type="avatar"
      />
		</a>
		<a
			href={ `profile/${pid}` }
			styleName="focusName"
		>
			{ userName || '不明使用者' }
		</a>
		<SubscribePeople
			pid={ userPid }
			targetPid={ pid }
			subscribeStatus={ subscribeStatus }
			notificationStatus={ notificationStatus }
			fullModeButton={ false }
			alwaysShow
			reversible
			line
		/>
	</li>;

function mapStateToProps(state) {
	return {
		userPid: state.user.pid,
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(FocusList);
