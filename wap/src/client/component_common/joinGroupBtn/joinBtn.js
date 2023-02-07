import React from 'react';
import PropTypes from 'prop-types';
const JoinBtn = ({
	buttonStyle,
	joinSetting,
	applyJoinGroup
}) =>
	<button
		className={ buttonStyle }
		onClick={ applyJoinGroup }
		data-gtm-group={ joinSetting ? '申請加入' : '加入社團' }
	>
		{ joinSetting ? '申請加入社團' : '加入社團' }
	</button>;

JoinBtn.propTypes = {
	buttonStyle: PropTypes.string.isRequired,
	joinSetting: PropTypes.number.isRequired,
	applyJoinGroup: PropTypes.func.isRequired
};

export default JoinBtn;
