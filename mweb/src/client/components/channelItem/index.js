import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import Image from 'src/client/components/image';

const ChannelItem = ({
	channelInfo,
  imgSize,
  imgStyle,
  wrapStyle,
  onlyImg,
  hasButton,
  children
}) => {
	if (!channelInfo) {
		return null;
	}

	const {id, name, avatarWebUrl} = channelInfo;
	const size = {
		width: `${imgSize}px`,
		height: `${imgSize}px`,
	};
	const forImgStyle = {...size, ...imgStyle};
	return (
		<div styleName="wrap" style={ wrapStyle }>
			<Link to={ `/m/channel/${id}` }>
				<Image
					styleName="user_avatar"
					style={ forImgStyle }
					src={ avatarWebUrl }
					type="avatar"
					domain="channel"
				/>
			</Link>
			{
				!onlyImg &&
				<div styleName="info">
					<div styleName="top">
						<Link to={ `/m/channel/${id}` }>{name}</Link>
					</div>
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

ChannelItem.defaultProps = {
	imgSize: 40,
  onlyImg: false
};

ChannelItem.propTypes = {
	channelInfo: PropTypes.object,
	imgSize: PropTypes.number,
  hasButton: PropTypes.bool,
  imgStyle: PropTypes.object,
  wrapStyle: PropTypes.wrapStyle,
  onlyImg: PropTypes.bool,
};

export default CSSModules(ChannelItem, css);
