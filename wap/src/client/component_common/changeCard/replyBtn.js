import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
// style
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

const ReplyBtn = ({
	btnStyle,
	sizeStyle,
	toggle,
	acceptInvite,
	rejectInvite
}) =>
	<DropdownMenu
		className={ `ui button	${btnStyle} ${sizeStyle}` }
		toggleOpen={ toggle }
	>
		<DropdownTarget>
			<span>答覆交友邀請</span>
		</DropdownTarget>
		<DropdownList>
			<ul className="dropdown" styleName="other_actions">
				<li onClick={ acceptInvite }>確認</li>
				<li onClick={ rejectInvite }>拒絕邀請</li>
			</ul>
		</DropdownList>
	</DropdownMenu>;

ReplyBtn.propTYpes = {
	btnStyle: PropTypes.string,
	sizeStyle: PropTypes.string,
	toggle: PropTypes.func.isRequired,
	acceptInvite: PropTypes.func.isRequired,
	rejectInvite: PropTypes.func.isRequired
};

export default compose(
	//translate([]),
	[CSSModules, '_', css]
)(ReplyBtn);
