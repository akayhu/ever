import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
// components
import Experience from './experience';
import Image from 'src/client/component_common/image';

const CardInfo = ({avatarWebUrl, pid, userName, companyName, jobTitle, schoolName, major, connectionStatus}) =>
	<div styleName="user_info_wrap">
		<div styleName="user_img_block">
			<Image src={ avatarWebUrl } />
		</div>
		<div styleName="displayName">
			<Link
				href={ `/profile/${pid}` }
				data-gtm-bzcard="顯示名稱"
			>
				{ userName }
			</Link>
		</div>
		<div styleName="schoolName">
			<Experience
				companyName={ companyName }
				jobTitle={ jobTitle }
				schoolName={ schoolName }
				major={ major }
				connectionStatus={ connectionStatus }
			/>
		</div>
	</div>;

CardInfo.propTypes = {
	avatarWebUrl: PropTypes.string,
	pid: PropTypes.number.isRequired,
	userName: PropTypes.string.isRequired,
	companyName: PropTypes.string,
	jobTitle: PropTypes.string,
	schoolName: PropTypes.string,
	major: PropTypes.string,
	connectionStatus: PropTypes.number.isRequired
};

export default CSSModules(CardInfo, css);
