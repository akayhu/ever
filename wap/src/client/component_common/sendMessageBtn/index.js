import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'src/util/compose';
import { Link } from 'react-router';
// actions
import { setDirectPanel } from 'src/client/actions/alert';

const SendMessageBtn = ({
	targetPid,
	btnStyle,
	sizeStyle,
	isLogin,
	setDirectPanel,
}) => {
	const handleClick = (e) => {
		if( !isLogin ) setDirectPanel(true);
	}

	return (
		<Link
			to={ {pathname: '/message/cc', query: {newMessage: targetPid}} }
		>
			<button
				className={ `ui button ${btnStyle} ${sizeStyle}` }
				onClick={ handleClick }
			>
				傳送訊息
			</button>
		</Link>
	);
}
	

SendMessageBtn.defaultProps = {
	btnStyle: 'primary',
	sizeStyle: ''
};

SendMessageBtn.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]).isRequired,
	btnStyle: PropTypes.string,
	sizeStyle: PropTypes.string
};

function mapStateToProps(state) {
	return {
		isLogin: state.user.isLogin
	};
}

export default compose(
	connect(mapStateToProps, { setDirectPanel }),
	//translate([]),
)(SendMessageBtn);
