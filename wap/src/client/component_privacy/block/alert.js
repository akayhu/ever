import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';

const Alert = ({which, targetPid, handleOnClose}) => {
	function alertText() {
		switch (which) {
			case 'alreadyIsBlock':
				return <p>此會員已被你加入到黑名單中。</p>;
			case 'notFound':
				return (
					<div>
						<p>查無此會員編號{targetPid}</p>
						<p>無法找到此會員。</p>
					</div>
				);
			default:
				return null;
		}
	}
	return (
		<div>
			{ alertText() }
			<div styleName="block_alert">
				<button className="ui normal button" onClick={ handleOnClose.bind(this) }>關閉</button>
			</div>
		</div>
	);
};

Alert.propTypes = {
	which: PropTypes.string.isRequired,
	targetPid: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired,
	]),
	handleOnClose: PropTypes.func.isRequired
};

export default CSSModules(Alert, css);
