import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from '../../../util/compose';
import { Link } from 'react-router';
import css from './index.css';

const LinkWrapper = ({ isLogin, isActive, linkTo, gtmName, t, translateName, logApiName, pid, target }) => {
	if (isLogin !== undefined && !isLogin) return null;
	let clickHeader = function(logEvent, pid) {
		var window = window || { _elog: [] };
		window._elog.push({
			web: "plus",
			track: ["clickMegamenu"],
			ext: {
				event: logEvent,
				pid: pid,
				device: 'pc',
				ts: (new Date()).getTime()
			}
		});
	};

	return (
		<li styleName={ isActive ? 'active' : '' } onClick={ clickHeader(logApiName, pid) }>
				<a
					href={ linkTo }
					data-gtm-header={ gtmName }
					target={ target }
					rel='noreferrer noopener'
				>
					{ t(`${translateName}`) }
				</a>
		</li>
	);
};

LinkWrapper.propTypes = {
	isActive: PropTypes.bool.isRequired,
	linkTo: PropTypes.string.isRequired,
	gtmName: PropTypes.string.isRequired,
	logApiName: PropTypes.string.isRequired,
	t: PropTypes.func.isRequired,
	translateName: PropTypes.string.isRequired,
	isLogin: PropTypes.bool,
	target: PropTypes.string.isRequired
};

export default compose(
	translate([]),
	[CSSModules, '_', css]
)(LinkWrapper);
