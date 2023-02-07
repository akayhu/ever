import React from 'react';
import PropTypes from 'prop-types';
import clientConfig from '../../../configs/client';

let flag = false;

const imgMap = {
	avatar: {
		profile: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultProfileAvatar.png`},
		company: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultProfileAvatar.png`},
		channel: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultMediaAvatar.png`},
		group: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultGroupAvatar.png`}
	},
	cover: {
		profile: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultProfileCover.png`},
		company: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultProfileCover.png`},
		channel: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultMediaCover.png`},
		group: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultGroupCover.png`}
	},
	error: {
		404: {src: `${clientConfig.params.staticWapUrl}/images/bg_404.png`}
	}
};

function handleError(type, domain, errorSrc, e) {
	//if (flag) return;
	//flag = !flag;
	let errorImg = errorSrc;
	if (!errorImg) {
		errorImg = getDefaultImg(type, domain);
	}

	e.target.src = errorImg;
}

function getDefaultImg(type, domain, errorImg) {
	if (imgMap.hasOwnProperty(type)) {
		return imgMap[type][domain].src;
	}
	return errorImg || imgMap.error['404'].src;
}

const Image = ({type, domain = 'profile', src, errorImg, ...rest}) => {
	let imgSrc = src;
	if (!imgSrc) {
		imgSrc = getDefaultImg(type, domain);
	}

	return (
		<img
			src={ imgSrc }
			onError={ handleError.bind(null, type, domain, errorImg) }
			{ ...rest }
		/>
	);
};

Image.defaultProps = {
	type: 'avatar',
	domain: 'profile',
	errorImg: ''
};

Image.propTypes = {
	src: PropTypes.string,
	type: PropTypes.string,
	domain: PropTypes.string,
	errorImg: PropTypes.string
};

export default Image;
