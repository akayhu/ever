import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

const MemberBtn = ({
	simpleMode,
	isHead,
	isMember,
	notified,
	buttonStyle,
	notify,
	leaveGroup
}) => {
	if (isMember && simpleMode) {
		return null;
	} else if (simpleMode) {
		return <button className="ui button disabled">已加入</button>;
	}
	return (
		<DropdownMenu toggleOpen={ () => {} }>
			<DropdownTarget>
				<button className={ buttonStyle }>
					已加入社團&nbsp;&nbsp;&nbsp;<i className="caret down icon" />
				</button>
			</DropdownTarget>
			<DropdownList>
				<ul className="dropdown" styleName="independent_ul">
					<li onClick={ notify }>{ notified ? '取消通知' : '接收通知' }</li>
					{ !isHead && <li onClick={ leaveGroup }>退出社團</li> }
				</ul>
			</DropdownList>
		</DropdownMenu>
	);
};

MemberBtn.propTypes = {
	simpleMode: PropTypes.bool.isRequired,
	isHead: PropTypes.bool.isRequired,
	isMember: PropTypes.bool.isRequired,
	notified: PropTypes.bool.isRequired,
	buttonStyle: PropTypes.string.isRequired,
	notify: PropTypes.func.isRequired,
	leaveGroup: PropTypes.func.isRequired
};

export default CSSModules(MemberBtn, css);
