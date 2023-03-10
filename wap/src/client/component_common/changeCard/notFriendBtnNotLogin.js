import React from 'react';
import PropTypes from 'prop-types';

const NotFriendBtnNotLogin = ({	gtmTag,	btnStyle,	sizeStyle, toggle }) => {
	const { changecard } = gtmTag;
	return (
		<button	className={ `ui button	${btnStyle} ${sizeStyle}` }	onClick={ toggle }>
			<span { ...changecard }>δΊ€ζεη</span>
		</button>
	);
};

NotFriendBtnNotLogin.propTYpes = {
	btnStyle: PropTypes.string,
	sizeStyle: PropTypes.string,
	toggle: PropTypes.func.isRequired,
};

export default NotFriendBtnNotLogin;
