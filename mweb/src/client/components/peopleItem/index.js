import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import Image from 'src/client/components/image';

function getSubTitle({companyName, jobTitle, schoolName, major}) {
	if (companyName) {
		return `${jobTitle}　${companyName}`;
	} else if (schoolName) {
		return `${major}　${schoolName}`;
	}
	return '';
}

const PeopleItem = ({
	userObj,
	otherObj,
	imgSize,
	imgStyle,
	onlyImg,
	wrapStyle,
	hasButton,
	children
}) => {
	if (!userObj) {
		return null;
	}

	const {pid, userName, avatarWebUrl} = userObj;
	const subTitle = getSubTitle(userObj);
	const size = {
		width: `${imgSize}px`,
		height: `${imgSize}px`,
	};
	const forImgStyle = {...size, ...imgStyle};
	return (
		<div styleName="wrap" style={ wrapStyle }>
			<Link to={ `/m/profile/${pid}` }>
				<Image
					styleName="user_avatar"
					style={ forImgStyle }
					src={ avatarWebUrl }
					type="avatar"
					domain="profile"
				/>
			</Link>
			{
				!onlyImg &&
				<div styleName="info">
					<div styleName="top">
						<Link to={ `/m/profile/${pid}` }>{userName}</Link>
						{
							otherObj &&
							<span>
								<div styleName="arrow" />
								<Link to={ otherObj.link }>{otherObj.name}</Link>
							</span>
						}
					</div>
					<div styleName="bot">{subTitle || '　'}</div>
				</div>
			}
			{
				hasButton &&
				<div styleName="button_section">
					{ children }
				</div>
			}
		</div>
	);
};

PeopleItem.defaultProps = {
	otherObj: null,
	imgSize: 40,
	onlyAvatar: false,
	hasButton: false,
};

PeopleItem.propTypes = {
	userObj: PropTypes.shape({
		pid: PropTypes.number,
		userName: PropTypes.string,
		avatarWebUrl: PropTypes.string,
		companyName: PropTypes.string,
		jobTitle: PropTypes.string,
		schoolName: PropTypes.string,
		major: PropTypes.string,
	}),
	otherObj: PropTypes.shape({
		name: PropTypes.string,
		link: PropTypes.string,
	}),
	imgSize: PropTypes.number,
	imgStyle: PropTypes.object,
	wrapStyle: PropTypes.object,
	onlyAvatar: PropTypes.bool,
	hasButton: PropTypes.bool,
};

export default CSSModules(PeopleItem, css);
