import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
// style
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

const RevokeBtn = ({
	reversible,
	btnStyle,
	sizeStyle,
	toggle,
	triggerRevoke
}) => {
	if (reversible) {
		return (
			<DropdownMenu
				className={ `ui button	${btnStyle} ${sizeStyle}` }
				toggleOpen={ toggle }
			>
				<DropdownTarget>
					<span>邀請已送出</span>
				</DropdownTarget>
				<DropdownList>
					<ul className="dropdown" styleName="other_actions">
						<li onClick={ triggerRevoke }>收回交友邀請</li>
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
	return <button className={ `ui normal button disabled ${sizeStyle}` }>邀請已送出</button>;
};

RevokeBtn.propTYpes = {
	reversible: PropTypes.bool.isRequired,
	btnStyle: PropTypes.string,
	sizeStyle: PropTypes.string,
	toggle: PropTypes.func.isRequired,
	triggerRevoke: PropTypes.func.isRequired
};

export default compose(
	//translate([]),
	[CSSModules, '_', css]
)(RevokeBtn);
