import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
// style
import css from './style.css';
// component
import ConnectionButton from './connectionButton';
import Image from '../../../components/image';

const AlertList = ({ avatarWebUrl, name, mutualFriendCount, pid, userPid }) => (
	<dd styleName="alertItem">
		<Image
			type={ 'avatar' }
			className={css.connectionImg}
			src={ avatarWebUrl }
		/>
		<div styleName="connectionContent">
			<a href={ `/profile/${pid}` }>{ name }</a>
			<div styleName="connectionFriend">{ `${mutualFriendCount} 個共同朋友` }</div>
		</div>
		<div styleName="action_area">
			<ConnectionButton
				pid={ userPid }
				targetPid={ pid }
			/>
		</div>
	</dd>
);

AlertList.PropTypes = {
	avatarWebUrl: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	mutualFriendCount: PropTypes.number.isRequired,
	pid: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
	userPid: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
};

export default CSSModules(AlertList, css);
