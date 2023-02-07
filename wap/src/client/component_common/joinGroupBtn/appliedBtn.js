import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

const AppliedBtn = ({
	simpleMode,
	buttonStyle,
	revokeJoin
}) => {
	if (simpleMode) {
		return <button className="ui button disabled">審核中</button>;
	}
	return (
		<DropdownMenu toggleOpen={ () => {} }>
			<DropdownTarget>
				<button className={ buttonStyle }>
					已申請加入&nbsp;&nbsp;&nbsp;<i className="caret down icon" />
				</button>
			</DropdownTarget>
			<DropdownList>
				<ul className="dropdown" styleName="independent_ul">
					<li onClick={ revokeJoin }>收回申請</li>
				</ul>
			</DropdownList>
		</DropdownMenu>
	);
};

AppliedBtn.propTypes = {
	simpleMode: PropTypes.bool.isRequired,
	buttonStyle: PropTypes.string.isRequired,
	revokeJoin: PropTypes.func.isRequired
};

export default CSSModules(AppliedBtn, css);
